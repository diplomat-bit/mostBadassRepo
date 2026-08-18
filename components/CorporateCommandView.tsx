// REPOSITORY SOURCE: diplomat-bit/aibanking.dev-demai-jocalll3 | PATH: diplomat-bit-aibanking.dev-demai-jocalll3-f8b6983/components/CorporateCommandView.tsx
================================================================================

import React, { useContext, useState, useEffect } from 'react';
import { DataContext } from '../context/DataContext';
import Card from './Card';
import type { CorporateCard, CorporateCardControls, Counterparty } from '../types';
import { GoogleGenAI } from '@google/genai';

const NewPaymentModal: React.FC<{ isOpen: boolean; onClose: () => void; onInitiate: (details: { amount: number; description: string; type: 'ACH' | 'Wire' }) => void; }> = ({ isOpen, onClose, onInitiate }) => {
    const [amount, setAmount] = useState('');
    const [description, setDescription] = useState('');
    const [type, setType] = useState<'ACH' | 'Wire'>('ACH');

    if (!isOpen) return null;

    const handleSubmit = () => {
        if (amount && description) {
            onInitiate({ amount: parseFloat(amount), description, type });
            onClose();
        }
    }

    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 backdrop-blur-sm" onClick={onClose}>
            <div className="bg-gray-800 rounded-lg shadow-2xl max-w-md w-full border border-gray-700" onClick={e => e.stopPropagation()}>
                <div className="p-4 border-b border-gray-700"><h3 className="text-lg font-semibold text-white">Initiate New Payment</h3></div>
                <div className="p-6 space-y-4">
                    <input type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="Amount ($)" className="w-full bg-gray-700/50 border border-gray-600 rounded-lg p-2 text-white" />
                    <input type="text" value={description} onChange={e => setDescription(e.target.value)} placeholder="Description (e.g., Vendor Payment)" className="w-full bg-gray-700/50 border border-gray-600 rounded-lg p-2 text-white" />
                    <select value={type} onChange={e => setType(e.target.value as any)} className="w-full bg-gray-700/50 border border-gray-600 rounded-lg p-2 text-white"><option>ACH</option><option>Wire</option></select>
                    <button onClick={handleSubmit} className="w-full py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg">Submit Payment</button>
                </div>
            </div>
        </div>
    );
};

const NewCounterpartyModal: React.FC<{ isOpen: boolean; onClose: () => void; onAdd: (data: any) => Promise<void>; }> = ({ isOpen, onClose, onAdd }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [accountNumber, setAccountNumber] = useState('');
    const [routingNumber, setRoutingNumber] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (isOpen) {
            setName('');
            setEmail('');
            setAccountNumber('');
            setRoutingNumber('');
            setError('');
            setIsSubmitting(false);
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const handleSubmit = async () => {
        setError('');
        if (!name || !accountNumber || !routingNumber) {
            setError('Name, account number, and routing number are required.');
            return;
        }
        setIsSubmitting(true);
        try {
            await onAdd({ name, email, accountNumber, routingNumber });
            onClose();
        } catch (err) {
            setError((err as Error).message || 'Failed to create counterparty.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 backdrop-blur-sm" onClick={onClose}>
            <div className="bg-gray-800 rounded-lg shadow-2xl max-w-md w-full border border-gray-700" onClick={e => e.stopPropagation()}>
                <div className="p-4 border-b border-gray-700"><h3 className="text-lg font-semibold text-white">New Counterparty</h3></div>
                <div className="p-6 space-y-4">
                    <h4 className="text-sm font-semibold text-gray-300">Contact Info</h4>
                    <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Counterparty Name or Business Name" className="w-full bg-gray-700/50 border border-gray-600 rounded-lg p-2 text-white" />
                    <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Contact Email (Optional)" className="w-full bg-gray-700/50 border border-gray-600 rounded-lg p-2 text-white" />
                    
                    <h4 className="text-sm font-semibold text-gray-300 pt-2">Bank Account</h4>
                    <input type="text" value={accountNumber} onChange={e => setAccountNumber(e.target.value)} placeholder="Account Number" className="w-full bg-gray-700/50 border border-gray-600 rounded-lg p-2 text-white" />
                    <input type="text" value={routingNumber} onChange={e => setRoutingNumber(e.target.value)} placeholder="ACH Routing Number" className="w-full bg-gray-700/50 border border-gray-600 rounded-lg p-2 text-white" />

                    {error && <p className="text-xs text-red-400">{error}</p>}
                    
                    <button onClick={handleSubmit} disabled={isSubmitting} className="w-full py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg disabled:opacity-50">
                        {isSubmitting ? 'Creating...' : 'Create Counterparty'}
                    </button>
                </div>
            </div>
        </div>
    );
};


const CorporateCardDetailModal: React.FC<{ card: CorporateCard | null; onClose: () => void; onSave: (id: string, controls: CorporateCardControls, frozen: boolean) => void; }> = ({ card, onClose, onSave }) => {
    const [controls, setControls] = useState<CorporateCardControls | null>(card?.controls || null);
    const [isFrozen, setIsFrozen] = useState(card?.frozen || false);

    useEffect(() => {
        setControls(card?.controls || null);
        setIsFrozen(card?.frozen || false);
    }, [card]);
    
    if (!card || !controls) return null;

    const handleControlChange = (key: keyof CorporateCardControls, value: any) => {
        setControls(prev => prev ? { ...prev, [key]: value } : null);
    }
    
    const handleSaveChanges = () => {
        if (controls) {
            onSave(card.id, controls, isFrozen);
            onClose();
        }
    }

    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 backdrop-blur-sm" onClick={onClose}>
            <div className="bg-gray-800 rounded-lg shadow-2xl max-w-md w-full border border-gray-700" onClick={e => e.stopPropagation()}>
                <div className="p-4 border-b border-gray-700 flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-white">{card.holderName}</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-white">&times;</button>
                </div>
                <div className="p-6 space-y-4">
                     <div className="flex justify-between items-center p-2 bg-gray-900/50 rounded-lg"><span className="text-sm text-gray-300">Freeze Card</span><input type="checkbox" checked={isFrozen} onChange={() => setIsFrozen(!isFrozen)} className="toggle toggle-sm toggle-cyan" /></div>
                     <div className="flex justify-between items-center p-2 bg-gray-900/50 rounded-lg"><span className="text-sm text-gray-300">ATM Withdrawals</span><input type="checkbox" checked={controls.atm} onChange={e => handleControlChange('atm', e.target.checked)} className="toggle toggle-sm toggle-cyan" /></div>
                     <div className="flex justify-between items-center p-2 bg-gray-900/50 rounded-lg"><span className="text-sm text-gray-300">Contactless Payments</span><input type="checkbox" checked={controls.contactless} onChange={e => handleControlChange('contactless', e.target.checked)} className="toggle toggle-sm toggle-cyan" /></div>
                     <div className="flex justify-between items-center p-2 bg-gray-900/50 rounded-lg"><span className="text-sm text-gray-300">Online Purchases</span><input type="checkbox" checked={controls.online} onChange={e => handleControlChange('online', e.target.checked)} className="toggle toggle-sm toggle-cyan" /></div>
                     <div className="p-2 bg-gray-900/50 rounded-lg">
                        <label className="block text-sm text-gray-300 mb-1">Monthly Limit</label>
                        <input type="number" value={controls.monthlyLimit} onChange={(e) => handleControlChange('monthlyLimit', Number(e.target.value))} className="w-full bg-gray-700 border border-gray-600 rounded-md p-1 text-white" />
                     </div>
                     <button onClick={handleSaveChanges} className="w-full py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg">Save Changes</button>
                </div>
            </div>
        </div>
    );
}

const CorporateCommandView: React.FC = () => {
    const context = useContext(DataContext);
    const [aiInsight, setAiInsight] = useState('');
    const [isInsightLoading, setIsInsightLoading] = useState(false);
    const [selectedCard, setSelectedCard] = useState<CorporateCard | null>(null);
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
    const [isCounterpartyModalOpen, setIsCounterpartyModalOpen] = useState(false);

    if (!context) throw new Error("CorporateCommandView must be within a DataProvider.");
    
    const { corporateCards, corporateTransactions, updateCorporateCard, initiatePayment, counterparties, addCounterparty } = context;

    const generateInsight = async () => {
        setIsInsightLoading(true);
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
            const transactionSummary = corporateTransactions.map(t => `${t.timestamp}: ${t.holderName} spent $${t.amount} at ${t.merchant} (${t.status})`).join('\n');
            const prompt = `You are a corporate finance AI. Analyze the following corporate card transactions for anomalies, potential policy violations, or cost-saving opportunities. Provide a brief, actionable summary (2-3 sentences). Transactions:\n${transactionSummary}`;
            
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
            });
            setAiInsight(response.text);
        } catch (error) {
            console.error("Failed to generate corporate insight:", error);
            setAiInsight("An error occurred while analyzing transaction data.");
        } finally {
            setIsInsightLoading(false);
        }
    };

    const StatusBadge: React.FC<{ status: CorporateCard['status'], frozen: boolean }> = ({ status, frozen }) => {
        if (frozen) {
            return <span className={`px-2 py-1 text-xs font-medium rounded-full bg-blue-500/20 text-blue-300`}>Frozen</span>;
        }
        const colors = {
            Active: 'bg-green-500/20 text-green-300',
            Suspended: 'bg-yellow-500/20 text-yellow-300',
            Lost: 'bg-red-500/20 text-red-300',
        };
        return <span className={`px-2 py-1 text-xs font-medium rounded-full ${colors[status]}`}>{status}</span>;
    };

    return (
        <>
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold text-white tracking-wider">Corporate Command Center</h2>
                 <div className="flex gap-2">
                    <button onClick={() => setIsPaymentModalOpen(true)} className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-lg text-sm">New Payment</button>
                    <button onClick={() => alert("Opening form to issue a new card...")} className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white font-semibold rounded-lg text-sm">Issue New Card</button>
                </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <Card title="Corporate Card Management" padding="none">
                        <div className="divide-y divide-gray-700/50 max-h-[45vh] overflow-y-auto">
                            {corporateCards.map(card => (
                                <div key={card.id} onClick={() => setSelectedCard(card)} className="p-4 space-y-3 hover:bg-gray-800/50 cursor-pointer">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h4 className="font-semibold text-white">{card.holderName}</h4>
                                            <p className="text-sm text-gray-400 font-mono">**** **** **** {card.cardNumberMask}</p>
                                        </div>
                                        <StatusBadge status={card.status} frozen={card.frozen} />
                                    </div>
                                    <div className="flex items-center justify-between text-sm">
                                         <div className="text-gray-300 text-xs">Monthly Limit: <span className="font-semibold text-white">${card.controls.monthlyLimit.toLocaleString()}</span></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>
                    <Card title="Counterparties" headerActions={[{ id: 'add-counterparty', icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>, onClick: () => setIsCounterpartyModalOpen(true), label: "Add Counterparty"}]}>
                        <div className="space-y-2 max-h-48 overflow-y-auto">
                            {counterparties.map(cp => (
                                <div key={cp.id} className="p-3 bg-gray-900/50 rounded-lg">
                                    <p className="font-semibold text-white">{cp.name}</p>
                                    <p className="text-xs text-gray-400">{cp.email || 'No email'} - Acct: ...{cp.accounts[0]?.account_details[0]?.account_number_safe || 'N/A'}</p>
                                </div>
                            ))}
                             {counterparties.length === 0 && <p className="text-sm text-center text-gray-500 py-4">No counterparties created yet.</p>}
                        </div>
                    </Card>
                    <Card title="AI Anomaly Detection">
                        {isInsightLoading ? <p className="text-gray-400 text-sm">Analyzing transactions...</p> : 
                         aiInsight ? <p className="text-gray-300 text-sm italic">"{aiInsight}"</p> :
                         <button onClick={generateInsight} className="w-full text-center py-2 px-4 bg-cyan-600/20 hover:bg-cyan-600/40 text-cyan-200 rounded-lg text-sm font-medium transition-colors">Scan Transactions</button>
                        }
                    </Card>
                </div>
                <div className="lg:col-span-1">
                    <Card title="Real-Time Transaction Feed" className="max-h-[80vh] flex flex-col">
                        <div className="flex-1 overflow-y-auto space-y-3">
                        {corporateTransactions.map(tx => (
                            <div key={tx.id} className="flex items-center p-1 rounded-md hover:bg-gray-800/50">
                                <div className={`w-2 h-2 mr-3 rounded-full ${tx.status === 'Approved' ? 'bg-green-500' : 'bg-yellow-500 animate-pulse'}`}></div>
                                <div className="flex-1">
                                    <div className="flex justify-between text-sm">
                                        <p className="font-semibold text-white">{tx.merchant}</p>
                                        <p className="font-mono text-white">${tx.amount.toFixed(2)}</p>
                                    </div>
                                    <div className="flex justify-between text-xs">
                                        <p className="text-gray-400">{tx.holderName}</p>
                                        <p className="text-gray-500">{tx.status}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                        </div>
                    </Card>
                </div>
            </div>
             <style>{`.toggle-cyan:checked { background-color: #06b6d4; }`}</style>
        </div>
        <CorporateCardDetailModal card={selectedCard} onClose={() => setSelectedCard(null)} onSave={updateCorporateCard} />
        <NewPaymentModal isOpen={isPaymentModalOpen} onClose={() => setIsPaymentModalOpen(false)} onInitiate={initiatePayment} />
        <NewCounterpartyModal isOpen={isCounterpartyModalOpen} onClose={() => setIsCounterpartyModalOpen(false)} onAdd={addCounterparty} />
        </>
    );
};

export default CorporateCommandView;

================================================================================
// APPENDED FROM REPO: diplomat-bit/aibanking.dev-jocall3-new | ORIGINAL PATH: diplomat-bit-aibanking.dev-jocall3-new-84d7a30/components/CorporateCommandView.tsx
================================================================================



import React, { useContext, useState, useEffect } from 'react';
import { DataContext } from '../context/DataContext';
import Card from './Card';
import { View, PaymentOrder, Invoice, ComplianceCase, CorporateTransaction } from '../types';
import { GoogleGenAI } from '@google/genai';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, Legend, PieChart, Pie, Cell } from 'recharts';

// Analytics Data Structures

export type TimeSeriesData = {
    date: string;
    value: number;
    secondaryValue?: number;
    tertiaryValue?: number;
};

export type CategoricalData = {
    category: string;
    value: number;
    percentage?: number;
    color?: string;
};

export type FinancialRatio = {
    name: string;
    value: number;
    benchmark: number;
    status: 'Healthy' | 'Warning' | 'Critical';
    delta: number;
};

export type VendorPerformanceMetric = {
    vendor: string;
    totalSpend: number;
    transactionCount: number;
    avgTransactionValue: number;
    riskScore: number;
    lastInteraction: string;
};

export type DepartmentalKPI = {
    department: string;
    budgetUtilization: number;
    operationalEfficiency: number;
    complianceScore: number;
    headcountSpend: number;
};

export type RiskAssessmentData = {
    riskCategory: string;
    probability: number;
    impact: number;
    mitigationStatus: string;
    exposureValue: number;
};

export type CashFlowProjection = {
    period: string;
    inflow: number;
    outflow: number;
    netPosition: number;
    cumulativeCash: number;
};

export type AuditLogEntry = {
    timestamp: string;
    user: string;
    action: string;
    severity: 'Low' | 'Medium' | 'High' | 'Critical';
    details: string;
};

export type TaxLiabilityBreakdown = {
    jurisdiction: string;
    taxType: string;
    estimatedAmount: number;
    dueDate: string;
    status: 'Accrued' | 'Paid' | 'Pending';
};

// Data Processing Functions

/**
 * Generates daily transaction volume and amount analytics.
 */
export const generateDailyTransactionAnalytics = (transactions: CorporateTransaction[]): TimeSeriesData[] => {
    const dailyMap: Record<string, { count: number; amount: number }> = {};
    transactions.forEach(tx => {
        const date = new Date(tx.date).toISOString().split('T')[0];
        if (!dailyMap[date]) dailyMap[date] = { count: 0, amount: 0 };
        dailyMap[date].count++;
        dailyMap[date].amount += tx.amount;
    });
    return Object.entries(dailyMap)
        .map(([date, data]) => ({ date, value: data.amount, secondaryValue: data.count }))
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
};

/**
 * Calculates key financial ratios.
 */
export const calculateEnterpriseFinancialRatios = (invoices: Invoice[], orders: PaymentOrder[], transactions: CorporateTransaction[]): FinancialRatio[] => {
    const currentAssets = invoices.filter(i => i.status !== 'paid').reduce((sum, i) => sum + i.amount, 0);
    const currentLiabilities = orders.filter(o => o.status !== 'paid').reduce((sum, o) => sum + o.amount, 0);
    const totalRevenue = invoices.filter(i => i.status === 'paid').reduce((sum, i) => sum + i.amount, 0);
    const totalExpenses = transactions.reduce((sum, t) => sum + t.amount, 0);
    
    const currentRatio = currentLiabilities > 0 ? currentAssets / currentLiabilities : 0;
    const netProfitMargin = totalRevenue > 0 ? ((totalRevenue - totalExpenses) / totalRevenue) * 100 : 0;
    const burnRate = totalExpenses / 30; // Simplified 30-day period for calculation
    
    return [
        { name: 'Current Ratio', value: currentRatio, benchmark: 1.5, status: currentRatio > 1.5 ? 'Healthy' : currentRatio > 1.0 ? 'Warning' : 'Critical', delta: 0.1 },
        { name: 'Net Profit Margin', value: netProfitMargin, benchmark: 20, status: netProfitMargin > 20 ? 'Healthy' : netProfitMargin > 10 ? 'Warning' : 'Critical', delta: -2.5 },
        { name: 'Daily Burn Rate', value: burnRate, benchmark: 5000, status: burnRate < 5000 ? 'Healthy' : 'Warning', delta: 12.4 }
    ];
};

/**
 * Projects cash flow for the next 6 periods.
 */
export const generateCashFlowProjections = (invoices: Invoice[], orders: PaymentOrder[]): CashFlowProjection[] => {
    const projections: CashFlowProjection[] = [];
    const today = new Date();
    let currentCash = 1000000; // Initial capital assumption

    for (let i = 0; i < 6; i++) {
        const futureDate = new Date(today);
        futureDate.setMonth(today.getMonth() + i);
        const periodKey = futureDate.toISOString().substring(0, 7);
        
        // Estimated inflows from receivables
        const projectedInflow = invoices
            .filter(inv => new Date(inv.dueDate).getMonth() === futureDate.getMonth())
            .reduce((sum, inv) => sum + inv.amount, 0) * 0.95; // Assumed 95% collection rate

        // Estimated outflows from payables and recurring expenses
        const projectedOutflow = orders
            .filter(ord => new Date(ord.dueDate || '').getMonth() === futureDate.getMonth())
            .reduce((sum, ord) => sum + ord.amount, 0) * 1.1; // Assumed 10% buffer for variable costs

        const net = projectedInflow - projectedOutflow;
        currentCash += net;

        projections.push({
            period: periodKey,
            inflow: projectedInflow,
            outflow: projectedOutflow,
            netPosition: net,
            cumulativeCash: currentCash
        });
    }
    return projections;
};

/**
 * Analyzes vendor performance and spend.
 */
export const analyzeVendorEcosystem = (transactions: CorporateTransaction[]): VendorPerformanceMetric[] => {
    const vendorMap: Record<string, VendorPerformanceMetric> = {};
    
    transactions.forEach(tx => {
        if (!vendorMap[tx.merchant]) {
            vendorMap[tx.merchant] = {
                vendor: tx.merchant,
                totalSpend: 0,
                transactionCount: 0,
                avgTransactionValue: 0,
                riskScore: Math.floor(Math.random() * 100), // Simulated risk score
                lastInteraction: tx.date
            };
        }
        const v = vendorMap[tx.merchant];
        v.totalSpend += tx.amount;
        v.transactionCount++;
        v.avgTransactionValue = v.totalSpend / v.transactionCount;
        if (new Date(tx.date) > new Date(v.lastInteraction)) {
            v.lastInteraction = tx.date;
        }
    });

    return Object.values(vendorMap).sort((a, b) => b.totalSpend - a.totalSpend);
};

/**
 * Segments operational spend into categories.
 */
export const segmentOperationalSpend = (transactions: CorporateTransaction[]): CategoricalData[] => {
    const categories = {
        'Fixed Infrastructure': 0,
        'Variable COGS': 0,
        'R&D Investment': 0,
        'Sales & Marketing': 0,
        'G&A': 0
    };

    transactions.forEach(tx => {
        if (tx.merchant.includes('Rent') || tx.merchant.includes('AWS') || tx.merchant.includes('Server')) categories['Fixed Infrastructure'] += tx.amount;
        else if (tx.merchant.includes('Supplier') || tx.merchant.includes('Logistics')) categories['Variable COGS'] += tx.amount;
        else if (tx.description.includes('Research') || tx.description.includes('Lab')) categories['R&D Investment'] += tx.amount;
        else if (tx.merchant.includes('Ads') || tx.merchant.includes('Google') || tx.merchant.includes('Facebook')) categories['Sales & Marketing'] += tx.amount;
        else categories['G&A'] += tx.amount;
    });

    return Object.entries(categories).map(([category, value]) => ({ category, value }));
};

/**
 * Estimates tax liabilities.
 */
export const estimateTaxLiabilities = (revenue: number, expenses: number): TaxLiabilityBreakdown[] => {
    const profit = Math.max(0, revenue - expenses);
    return [
        { jurisdiction: 'Federal', taxType: 'Corporate Income Tax', estimatedAmount: profit * 0.21, dueDate: '2024-04-15', status: 'Accrued' },
        { jurisdiction: 'State (CA)', taxType: 'Franchise Tax', estimatedAmount: profit * 0.0884, dueDate: '2024-04-15', status: 'Accrued' },
        { jurisdiction: 'International', taxType: 'VAT/GST', estimatedAmount: revenue * 0.05, dueDate: 'Monthly', status: 'Pending' },
        { jurisdiction: 'Local', taxType: 'Payroll Tax', estimatedAmount: expenses * 0.0765, dueDate: 'Bi-Weekly', status: 'Paid' }
    ];
};

/**
 * Generates risk assessment data.
 */
export const generateEnterpriseRiskHeatmap = (cases: ComplianceCase[], transactions: CorporateTransaction[]): RiskAssessmentData[] => {
    const risks: RiskAssessmentData[] = [
        { riskCategory: 'AML/KYC', probability: 0.15, impact: 0.9, mitigationStatus: 'Monitoring', exposureValue: 500000 },
        { riskCategory: 'Data Privacy (GDPR)', probability: 0.05, impact: 0.95, mitigationStatus: 'Controlled', exposureValue: 2000000 },
        { riskCategory: 'Vendor Fraud', probability: 0.2, impact: 0.4, mitigationStatus: 'Active Investigation', exposureValue: 150000 },
        { riskCategory: 'Tax Compliance', probability: 0.1, impact: 0.7, mitigationStatus: 'Audited', exposureValue: 750000 },
        { riskCategory: 'Cybersecurity', probability: 0.3, impact: 0.99, mitigationStatus: 'Hardened', exposureValue: 5000000 }
    ];

    // Adjusts risk based on data
    if (cases.some(c => c.type === 'AML')) risks[0].probability += 0.2;
    if (transactions.some(t => t.amount > 50000)) risks[2].probability += 0.1;

    return risks;
};

// Main Component

interface CorporateDashboardProps {
    setActiveView?: (view: View) => void;
}

const CorporateCommandView: React.FC<CorporateDashboardProps> = ({ setActiveView }) => {
    const context = useContext(DataContext);
    
    // State Management
    const [activeTab, setActiveTab] = useState<'Overview' | 'Finance' | 'Operations' | 'Risk' | 'Strategy'>('Overview');
    const [aiInsight, setAiInsight] = useState<string>('Initializing AI...');
    const [isAiProcessing, setIsAiProcessing] = useState<boolean>(false);
    const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

    if (!context) throw new Error("CorporateCommandView requires DataContext.");
    const { paymentOrders, invoices, complianceCases, corporateTransactions } = context;

    // Data Aggregation
    
    // Financials
    const totalRevenue = invoices.filter(i => i.status === 'paid').reduce((acc, i) => acc + i.amount, 0);
    const totalExpenses = corporateTransactions.reduce((acc, t) => acc + t.amount, 0);
    const netIncome = totalRevenue - totalExpenses;
    const financialRatios = calculateEnterpriseFinancialRatios(invoices, paymentOrders, corporateTransactions);
    const cashFlowForecast = generateCashFlowProjections(invoices, paymentOrders);
    const taxLiabilities = estimateTaxLiabilities(totalRevenue, totalExpenses);

    // Operations
    const dailyVolume = generateDailyTransactionAnalytics(corporateTransactions);
    const operationalSpend = segmentOperationalSpend(corporateTransactions);
    const vendorMetrics = analyzeVendorEcosystem(corporateTransactions);
    const topVendors = vendorMetrics.slice(0, 5);
    
    // Risk
    const riskHeatmap = generateEnterpriseRiskHeatmap(complianceCases, corporateTransactions);
    const openComplianceCases = complianceCases.filter(c => c.status === 'open');
    const criticalRisks = riskHeatmap.filter(r => r.probability * r.impact > 0.15);

    // AI Integration
    useEffect(() => {
        const generateStrategicReport = async () => {
            setIsAiProcessing(true);
            try {
                const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
                
                let promptContext = '';
                if (activeTab === 'Overview') {
                    promptContext = `Executive Summary: Revenue $${totalRevenue}, Expenses $${totalExpenses}, Net Income $${netIncome}. Critical Risks: ${criticalRisks.length}. Top Vendor: ${topVendors[0]?.vendor}.`;
                } else if (activeTab === 'Finance') {
                    promptContext = `Financial Deep Dive: Current Ratio ${financialRatios[0].value.toFixed(2)}, Net Margin ${financialRatios[1].value.toFixed(2)}%. Cash Flow Trend: ${cashFlowForecast[0].netPosition > 0 ? 'Positive' : 'Negative'}. Tax Liability: $${taxLiabilities.reduce((s, t) => s + t.estimatedAmount, 0).toFixed(2)}.`;
                } else if (activeTab === 'Operations') {
                    promptContext = `Ops Report: Transaction Volume ${dailyVolume.length} days active. Top Spend Category: ${operationalSpend.sort((a,b) => b.value - a.value)[0]?.category}. Vendor Count: ${vendorMetrics.length}.`;
                } else if (activeTab === 'Risk') {
                    promptContext = `Risk Assessment: Open Cases ${openComplianceCases.length}. Highest Risk Category: ${riskHeatmap.sort((a,b) => b.probability - a.probability)[0]?.riskCategory}. Exposure: $${riskHeatmap.reduce((s,r) => s + r.exposureValue, 0)}.`;
                } else {
                    promptContext = `Strategic Outlook: Based on burn rate of $${financialRatios[2].value.toFixed(2)}/day and projected cash flow. Suggest 3 strategic moves for growth and stability.`;
                }

                const prompt = `You are an advanced Corporate AI Assistant. Analyze the following data context for the '${activeTab}' view and provide a high-level, professional, actionable strategic insight (max 2 sentences). Context: ${promptContext}`;
                
                const response = await ai.models.generateContent({
                    model: 'gemini-2.5-flash',
                    contents: prompt,
                });
                setAiInsight(response.text);
                setLastUpdated(new Date());
            } catch (error) {
                console.error("AI Processing Error:", error);
                setAiInsight("AI link unavailable. Using fallback data.");
            } finally {
                setIsAiProcessing(false);
            }
        };

        generateStrategicReport();
    }, [activeTab, totalRevenue, totalExpenses, netIncome]);

    // Visualization Utilities
    const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#6366f1'];
    
    const formatCurrency = (val: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', notation: 'compact' }).format(val);
    const formatNumber = (val: number) => new Intl.NumberFormat('en-US', { notation: 'compact' }).format(val);

    // Inline Sub-Components
    
    const TabButton = ({ id, label }: { id: typeof activeTab, label: string }) => (
        <button 
            onClick={() => setActiveTab(id)}
            className={`px-6 py-3 text-sm font-bold tracking-wide transition-all duration-200 border-b-2 ${
                activeTab === id 
                ? 'border-blue-500 text-white bg-gray-800/50' 
                : 'border-transparent text-gray-400 hover:text-white hover:bg-gray-800/30'
            }`}
        >
            {label}
        </button>
    );

    const MetricCard: React.FC<{ title: string, value: string, subtext?: string, trend?: number, color?: string }> = ({ title, value, subtext, trend, color = 'blue' }) => (
        <div className={`bg-gray-800 border border-gray-700 p-6 rounded-xl shadow-lg relative overflow-hidden group hover:border-${color}-500 transition-colors`}>
            <div className={`absolute top-0 right-0 w-24 h-24 bg-${color}-500/10 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110`} />
            <h3 className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-2">{title}</h3>
            <div className="text-3xl font-bold text-white mb-1">{value}</div>
            {subtext && <div className="text-gray-500 text-sm">{subtext}</div>}
            {trend !== undefined && (
                <div className={`text-sm font-medium mt-3 flex items-center ${trend >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {trend >= 0 ? '↑' : '↓'} {Math.abs(trend)}% <span className="text-gray-600 ml-1">vs last period</span>
                </div>
            )}
        </div>
    );

    // Component Rendering

    return (
        <div className="min-h-screen bg-gray-900 text-white p-2 space-y-8 font-sans">
            
            {/* HEADER & NAVIGATION */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-gray-800 pb-6">
                <div>
                    <h1 className="text-4xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
                        NEXUS COMMAND
                    </h1>
                    <p className="text-gray-400 text-sm mt-1">Enterprise Operating System v4.2.0 • {lastUpdated.toLocaleString()}</p>
                </div>
                <div className="flex space-x-1 mt-4 md:mt-0 bg-gray-900 rounded-lg p-1 border border-gray-800">
                    <TabButton id="Overview" label="EXECUTIVE" />
                    <TabButton id="Finance" label="FINANCE" />
                    <TabButton id="Operations" label="OPERATIONS" />
                    <TabButton id="Risk" label="RISK & COMPLIANCE" />
                    <TabButton id="Strategy" label="STRATEGY" />
                </div>
            </div>

            {/* AI INSIGHT BAR */}
            <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 blur-xl rounded-lg" />
                <Card className="relative bg-gray-800/80 backdrop-blur border border-blue-500/30 p-6">
                    <div className="flex items-start space-x-4">
                        <div className="p-3 bg-blue-500/10 rounded-full animate-pulse">
                            <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                        </div>
                        <div className="flex-1">
                            <h3 className="text-blue-400 text-xs font-bold uppercase tracking-widest mb-1">AI Strategic Intelligence</h3>
                            {isAiProcessing ? (
                                <div className="h-6 bg-gray-700 rounded w-3/4 animate-pulse" />
                            ) : (
                                <p className="text-lg text-gray-100 leading-relaxed font-light">"{aiInsight}"</p>
                            )}
                        </div>
                    </div>
                </Card>
            </div>

            {/* DYNAMIC CONTENT AREA */}
            <div className="space-y-8 animate-fade-in">
                
                {/* OVERVIEW TAB */}
                {activeTab === 'Overview' && (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <MetricCard title="Total Revenue (YTD)" value={formatCurrency(totalRevenue)} trend={12.5} color="green" />
                            <MetricCard title="Net Income" value={formatCurrency(netIncome)} trend={8.2} color="blue" />
                            <MetricCard title="Active Risks" value={criticalRisks.length.toString()} subtext="Critical Severity" trend={-5.0} color="red" />
                            <MetricCard title="Cash Runway" value="14.2 Months" subtext="Based on current burn" color="purple" />
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-96">
                            <Card title="Revenue vs Expenses Trend" className="lg:col-span-2 h-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={cashFlowForecast}>
                                        <XAxis dataKey="period" stroke="#6b7280" fontSize={12} />
                                        <YAxis stroke="#6b7280" fontSize={12} tickFormatter={(val) => `$${val/1000}k`} />
                                        <Tooltip contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151', color: '#fff' }} />
                                        <Legend />
                                        <Bar dataKey="inflow" name="Inflow" fill="#10b981" radius={[4, 4, 0, 0]} />
                                        <Bar dataKey="outflow" name="Outflow" fill="#ef4444" radius={[4, 4, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </Card>
                            <Card title="Operational Spend Mix" className="h-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie data={operationalSpend} dataKey="value" nameKey="category" cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5}>
                                            {operationalSpend.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                        <Legend verticalAlign="bottom" height={36} />
                                    </PieChart>
                                </ResponsiveContainer>
                            </Card>
                        </div>
                    </>
                )}

                {/* FINANCE TAB */}
                {activeTab === 'Finance' && (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {financialRatios.map((ratio, idx) => (
                                <MetricCard 
                                    key={idx} 
                                    title={ratio.name} 
                                    value={typeof ratio.value === 'number' && ratio.value < 100 ? ratio.value.toFixed(2) : formatNumber(ratio.value)} 
                                    subtext={`Benchmark: ${ratio.benchmark}`}
                                    trend={ratio.delta}
                                    color={ratio.status === 'Healthy' ? 'green' : ratio.status === 'Warning' ? 'yellow' : 'red'}
                                />
                            ))}
                        </div>
                        
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <Card title="Projected Cash Position (6 Months)" className="h-80">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={cashFlowForecast}>
                                        <XAxis dataKey="period" stroke="#6b7280" />
                                        <YAxis stroke="#6b7280" tickFormatter={(val) => `$${val/1000}k`} />
                                        <Tooltip cursor={{fill: '#374151'}} contentStyle={{ backgroundColor: '#1f2937' }} />
                                        <Bar dataKey="cumulativeCash" fill="#3b82f6" name="Cash Balance" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </Card>
                            <Card title="Estimated Tax Liability Breakdown" className="h-80 overflow-auto">
                                <table className="w-full text-left text-sm text-gray-400">
                                    <thead className="bg-gray-800 text-gray-200 uppercase font-bold">
                                        <tr>
                                            <th className="p-3">Jurisdiction</th>
                                            <th className="p-3">Type</th>
                                            <th className="p-3 text-right">Amount</th>
                                            <th className="p-3">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-700">
                                        {taxLiabilities.map((tax, i) => (
                                            <tr key={i} className="hover:bg-gray-800/50">
                                                <td className="p-3">{tax.jurisdiction}</td>
                                                <td className="p-3">{tax.taxType}</td>
                                                <td className="p-3 text-right font-mono text-white">{formatCurrency(tax.estimatedAmount)}</td>
                                                <td className="p-3">
                                                    <span className={`px-2 py-1 rounded text-xs font-bold ${tax.status === 'Paid' ? 'bg-green-900 text-green-300' : 'bg-yellow-900 text-yellow-300'}`}>
                                                        {tax.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </Card>
                        </div>
                    </>
                )}

                {/* OPERATIONS TAB */}
                {activeTab === 'Operations' && (
                    <>
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            <Card title="Daily Transaction Volume" className="lg:col-span-2 h-96">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={dailyVolume}>
                                        <XAxis dataKey="date" stroke="#6b7280" fontSize={10} tickFormatter={(d) => d.substring(5)} />
                                        <YAxis yAxisId="left" stroke="#3b82f6" fontSize={12} tickFormatter={(val) => `$${val/1000}k`} />
                                        <YAxis yAxisId="right" orientation="right" stroke="#10b981" fontSize={12} />
                                        <Tooltip contentStyle={{ backgroundColor: '#1f2937' }} />
                                        <Bar yAxisId="left" dataKey="value" fill="#3b82f6" name="Volume ($)" opacity={0.8} />
                                        <Bar yAxisId="right" dataKey="secondaryValue" fill="#10b981" name="Count" barSize={10} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </Card>
                            <Card title="Top Vendor Ecosystem" className="h-96 overflow-auto">
                                <div className="space-y-4">
                                    {topVendors.map((vendor, i) => (
                                        <div key={i} className="flex items-center justify-between p-3 bg-gray-800 rounded border border-gray-700">
                                            <div>
                                                <div className="font-bold text-white">{vendor.vendor}</div>
                                                <div className="text-xs text-gray-500">{vendor.transactionCount} txns • Risk: {vendor.riskScore}/100</div>
                                            </div>
                                            <div className="text-right">
                                                <div className="font-mono text-blue-400">{formatCurrency(vendor.totalSpend)}</div>
                                                <div className="text-xs text-gray-500">Avg: {formatCurrency(vendor.avgTransactionValue)}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </Card>
                        </div>
                    </>
                )}

                {/* RISK TAB */}
                {activeTab === 'Risk' && (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <MetricCard title="Compliance Score" value="94.2" subtext="Top 5% Industry" color="green" />
                            <MetricCard title="Open Cases" value={openComplianceCases.length.toString()} subtext="Requires Attention" color="yellow" />
                            <MetricCard title="Total Risk Exposure" value={formatCurrency(riskHeatmap.reduce((a,b)=>a+b.exposureValue,0))} color="red" />
                            <MetricCard title="Audit Anomalies" value="3" subtext="Last 24 Hours" color="purple" />
                        </div>
                        
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <Card title="Enterprise Risk Heatmap" className="h-96">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={riskHeatmap} layout="vertical" margin={{ left: 40 }}>
                                        <XAxis type="number" domain={[0, 1]} hide />
                                        <YAxis type="category" dataKey="riskCategory" stroke="#9ca3af" width={120} fontSize={11} />
                                        <Tooltip cursor={{fill: 'transparent'}} content={({ active, payload }) => {
                                            if (active && payload && payload.length) {
                                                const data = payload[0].payload;
                                                return (
                                                    <div className="bg-gray-900 border border-gray-700 p-3 rounded shadow-xl">
                                                        <p className="font-bold text-white">{data.riskCategory}</p>
                                                        <p className="text-sm text-gray-400">Prob: {(data.probability * 100).toFixed(0)}% | Impact: {(data.impact * 100).toFixed(0)}%</p>
                                                        <p className="text-sm text-red-400">Exposure: {formatCurrency(data.exposureValue)}</p>
                                                    </div>
                                                );
                                            }
                                            return null;
                                        }} />
                                        <Bar dataKey="probability" name="Probability" stackId="a" fill="#f59e0b" barSize={20} />
                                        <Bar dataKey="impact" name="Impact" stackId="a" fill="#ef4444" barSize={20} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </Card>
                            <Card title="Compliance Case Log" className="h-96 overflow-auto">
                                <div className="space-y-2">
                                    {complianceCases.map((c, i) => (
                                        <div key={i} className="p-3 border-l-4 border-red-500 bg-gray-800/50 rounded flex justify-between items-center">
                                            <div>
                                                <div className="font-bold text-sm text-white">{c.type} Violation</div>
                                                <div className="text-xs text-gray-500">{c.description}</div>
                                            </div>
                                            <span className={`px-2 py-1 text-xs rounded font-bold ${c.status === 'open' ? 'bg-red-900 text-red-200' : 'bg-gray-700 text-gray-300'}`}>
                                                {c.status.toUpperCase()}
                                            </span>
                                        </div>
                                    ))}
                                    {complianceCases.length === 0 && <div className="text-center text-gray-500 py-10">No active compliance cases detected. Systems nominal.</div>}
                                </div>
                            </Card>
                        </div>
                    </>
                )}

                {/* STRATEGY TAB */}
                {activeTab === 'Strategy' && (
                    <div className="grid grid-cols-1 gap-6">
                        <Card title="Strategic Growth Modeling" className="p-8 bg-gradient-to-br from-gray-800 to-gray-900">
                            <div className="flex flex-col md:flex-row gap-8">
                                <div className="flex-1 space-y-6">
                                    <h3 className="text-2xl font-bold text-white">Scenario Analysis: Aggressive Expansion</h3>
                                    <p className="text-gray-400">
                                        Based on current liquidity of {formatCurrency(financialRatios[0].value * 1000000)} and a burn rate of {formatCurrency(financialRatios[2].value)}, 
                                        the enterprise can sustain a 15% increase in R&D spend for 8 months before requiring additional capital injection.
                                    </p>
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-sm text-gray-300">
                                            <span>Market Penetration Probability</span>
                                            <span>78%</span>
                                        </div>
                                        <div className="w-full bg-gray-700 rounded-full h-2">
                                            <div className="bg-blue-500 h-2 rounded-full" style={{ width: '78%' }}></div>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-sm text-gray-300">
                                            <span>Regulatory Approval Confidence</span>
                                            <span>92%</span>
                                        </div>
                                        <div className="w-full bg-gray-700 rounded-full h-2">
                                            <div className="bg-green-500 h-2 rounded-full" style={{ width: '92%' }}></div>
                                        </div>
                                    </div>
                                </div>
                                <div className="w-full md:w-1/3 bg-gray-800 p-6 rounded-xl border border-gray-700">
                                    <h4 className="font-bold text-white mb-4">AI Recommendation Engine</h4>
                                    <ul className="space-y-4">
                                        <li className="flex items-start space-x-3">
                                            <span className="text-green-400 text-xl">✓</span>
                                            <span className="text-sm text-gray-300">Optimize vendor contracts to reduce variable OPEX by 12%.</span>
                                        </li>
                                        <li className="flex items-start space-x-3">
                                            <span className="text-green-400 text-xl">✓</span>
                                            <span className="text-sm text-gray-300">Accelerate receivables collection to improve DSO by 5 days.</span>
                                        </li>
                                        <li className="flex items-start space-x-3">
                                            <span className="text-yellow-400 text-xl">⚠</span>
                                            <span className="text-sm text-gray-300">Monitor geopolitical risk in supply chain region APAC-1.</span>
                                        </li>
                                    </ul>
                                    <button className="w-full mt-6 bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded transition-colors" onClick={() => setActiveView && setActiveView(View.Budgets)}>
                                        Adjust Budgets
                                    </button>
                                </div>
                            </div>
                        </Card>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CorporateCommandView;


================================================================================
// APPENDED FROM REPO: diplomat-bit/almost | ORIGINAL PATH: diplomat-bit-almost-93a5466/components/CorporateCommandView.tsx
================================================================================



import React, { useContext, useState, useEffect } from 'react';
import { DataContext } from '../context/DataContext';
import Card from './Card';
import { View, PaymentOrder, Invoice, ComplianceCase, CorporateTransaction } from '../types';
import { GoogleGenAI } from '@google/genai';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, Legend, PieChart, Pie, Cell } from 'recharts';

// Analytics Data Structures

export type TimeSeriesData = {
    date: string;
    value: number;
    secondaryValue?: number;
    tertiaryValue?: number;
};

export type CategoricalData = {
    category: string;
    value: number;
    percentage?: number;
    color?: string;
};

export type FinancialRatio = {
    name: string;
    value: number;
    benchmark: number;
    status: 'Healthy' | 'Warning' | 'Critical';
    delta: number;
};

export type VendorPerformanceMetric = {
    vendor: string;
    totalSpend: number;
    transactionCount: number;
    avgTransactionValue: number;
    riskScore: number;
    lastInteraction: string;
};

export type DepartmentalKPI = {
    department: string;
    budgetUtilization: number;
    operationalEfficiency: number;
    complianceScore: number;
    headcountSpend: number;
};

export type RiskAssessmentData = {
    riskCategory: string;
    probability: number;
    impact: number;
    mitigationStatus: string;
    exposureValue: number;
};

export type CashFlowProjection = {
    period: string;
    inflow: number;
    outflow: number;
    netPosition: number;
    cumulativeCash: number;
};

export type AuditLogEntry = {
    timestamp: string;
    user: string;
    action: string;
    severity: 'Low' | 'Medium' | 'High' | 'Critical';
    details: string;
};

export type TaxLiabilityBreakdown = {
    jurisdiction: string;
    taxType: string;
    estimatedAmount: number;
    dueDate: string;
    status: 'Accrued' | 'Paid' | 'Pending';
};

// Data Processing Functions

/**
 * Generates daily transaction volume and amount analytics.
 */
export const generateDailyTransactionAnalytics = (transactions: CorporateTransaction[]): TimeSeriesData[] => {
    const dailyMap: Record<string, { count: number; amount: number }> = {};
    transactions.forEach(tx => {
        const date = new Date(tx.date).toISOString().split('T')[0];
        if (!dailyMap[date]) dailyMap[date] = { count: 0, amount: 0 };
        dailyMap[date].count++;
        dailyMap[date].amount += tx.amount;
    });
    return Object.entries(dailyMap)
        .map(([date, data]) => ({ date, value: data.amount, secondaryValue: data.count }))
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
};

/**
 * Calculates key financial ratios.
 */
export const calculateEnterpriseFinancialRatios = (invoices: Invoice[], orders: PaymentOrder[], transactions: CorporateTransaction[]): FinancialRatio[] => {
    const currentAssets = invoices.filter(i => i.status !== 'paid').reduce((sum, i) => sum + i.amount, 0);
    const currentLiabilities = orders.filter(o => o.status !== 'paid').reduce((sum, o) => sum + o.amount, 0);
    const totalRevenue = invoices.filter(i => i.status === 'paid').reduce((sum, i) => sum + i.amount, 0);
    const totalExpenses = transactions.reduce((sum, t) => sum + t.amount, 0);
    
    const currentRatio = currentLiabilities > 0 ? currentAssets / currentLiabilities : 0;
    const netProfitMargin = totalRevenue > 0 ? ((totalRevenue - totalExpenses) / totalRevenue) * 100 : 0;
    const burnRate = totalExpenses / 30; // Simplified 30-day period for calculation
    
    return [
        { name: 'Current Ratio', value: currentRatio, benchmark: 1.5, status: currentRatio > 1.5 ? 'Healthy' : currentRatio > 1.0 ? 'Warning' : 'Critical', delta: 0.1 },
        { name: 'Net Profit Margin', value: netProfitMargin, benchmark: 20, status: netProfitMargin > 20 ? 'Healthy' : netProfitMargin > 10 ? 'Warning' : 'Critical', delta: -2.5 },
        { name: 'Daily Burn Rate', value: burnRate, benchmark: 5000, status: burnRate < 5000 ? 'Healthy' : 'Warning', delta: 12.4 }
    ];
};

/**
 * Projects cash flow for the next 6 periods.
 */
export const generateCashFlowProjections = (invoices: Invoice[], orders: PaymentOrder[]): CashFlowProjection[] => {
    const projections: CashFlowProjection[] = [];
    const today = new Date();
    let currentCash = 1000000; // Initial capital assumption

    for (let i = 0; i < 6; i++) {
        const futureDate = new Date(today);
        futureDate.setMonth(today.getMonth() + i);
        const periodKey = futureDate.toISOString().substring(0, 7);
        
        // Estimated inflows from receivables
        const projectedInflow = invoices
            .filter(inv => new Date(inv.dueDate).getMonth() === futureDate.getMonth())
            .reduce((sum, inv) => sum + inv.amount, 0) * 0.95; // Assumed 95% collection rate

        // Estimated outflows from payables and recurring expenses
        const projectedOutflow = orders
            .filter(ord => new Date(ord.dueDate || '').getMonth() === futureDate.getMonth())
            .reduce((sum, ord) => sum + ord.amount, 0) * 1.1; // Assumed 10% buffer for variable costs

        const net = projectedInflow - projectedOutflow;
        currentCash += net;

        projections.push({
            period: periodKey,
            inflow: projectedInflow,
            outflow: projectedOutflow,
            netPosition: net,
            cumulativeCash: currentCash
        });
    }
    return projections;
};

/**
 * Analyzes vendor performance and spend.
 */
export const analyzeVendorEcosystem = (transactions: CorporateTransaction[]): VendorPerformanceMetric[] => {
    const vendorMap: Record<string, VendorPerformanceMetric> = {};
    
    transactions.forEach(tx => {
        if (!vendorMap[tx.merchant]) {
            vendorMap[tx.merchant] = {
                vendor: tx.merchant,
                totalSpend: 0,
                transactionCount: 0,
                avgTransactionValue: 0,
                riskScore: Math.floor(Math.random() * 100), // Simulated risk score
                lastInteraction: tx.date
            };
        }
        const v = vendorMap[tx.merchant];
        v.totalSpend += tx.amount;
        v.transactionCount++;
        v.avgTransactionValue = v.totalSpend / v.transactionCount;
        if (new Date(tx.date) > new Date(v.lastInteraction)) {
            v.lastInteraction = tx.date;
        }
    });

    return Object.values(vendorMap).sort((a, b) => b.totalSpend - a.totalSpend);
};

/**
 * Segments operational spend into categories.
 */
export const segmentOperationalSpend = (transactions: CorporateTransaction[]): CategoricalData[] => {
    const categories = {
        'Fixed Infrastructure': 0,
        'Variable COGS': 0,
        'R&D Investment': 0,
        'Sales & Marketing': 0,
        'G&A': 0
    };

    transactions.forEach(tx => {
        if (tx.merchant.includes('Rent') || tx.merchant.includes('AWS') || tx.merchant.includes('Server')) categories['Fixed Infrastructure'] += tx.amount;
        else if (tx.merchant.includes('Supplier') || tx.merchant.includes('Logistics')) categories['Variable COGS'] += tx.amount;
        else if (tx.description.includes('Research') || tx.description.includes('Lab')) categories['R&D Investment'] += tx.amount;
        else if (tx.merchant.includes('Ads') || tx.merchant.includes('Google') || tx.merchant.includes('Facebook')) categories['Sales & Marketing'] += tx.amount;
        else categories['G&A'] += tx.amount;
    });

    return Object.entries(categories).map(([category, value]) => ({ category, value }));
};

/**
 * Estimates tax liabilities.
 */
export const estimateTaxLiabilities = (revenue: number, expenses: number): TaxLiabilityBreakdown[] => {
    const profit = Math.max(0, revenue - expenses);
    return [
        { jurisdiction: 'Federal', taxType: 'Corporate Income Tax', estimatedAmount: profit * 0.21, dueDate: '2024-04-15', status: 'Accrued' },
        { jurisdiction: 'State (CA)', taxType: 'Franchise Tax', estimatedAmount: profit * 0.0884, dueDate: '2024-04-15', status: 'Accrued' },
        { jurisdiction: 'International', taxType: 'VAT/GST', estimatedAmount: revenue * 0.05, dueDate: 'Monthly', status: 'Pending' },
        { jurisdiction: 'Local', taxType: 'Payroll Tax', estimatedAmount: expenses * 0.0765, dueDate: 'Bi-Weekly', status: 'Paid' }
    ];
};

/**
 * Generates risk assessment data.
 */
export const generateEnterpriseRiskHeatmap = (cases: ComplianceCase[], transactions: CorporateTransaction[]): RiskAssessmentData[] => {
    const risks: RiskAssessmentData[] = [
        { riskCategory: 'AML/KYC', probability: 0.15, impact: 0.9, mitigationStatus: 'Monitoring', exposureValue: 500000 },
        { riskCategory: 'Data Privacy (GDPR)', probability: 0.05, impact: 0.95, mitigationStatus: 'Controlled', exposureValue: 2000000 },
        { riskCategory: 'Vendor Fraud', probability: 0.2, impact: 0.4, mitigationStatus: 'Active Investigation', exposureValue: 150000 },
        { riskCategory: 'Tax Compliance', probability: 0.1, impact: 0.7, mitigationStatus: 'Audited', exposureValue: 750000 },
        { riskCategory: 'Cybersecurity', probability: 0.3, impact: 0.99, mitigationStatus: 'Hardened', exposureValue: 5000000 }
    ];

    // Adjusts risk based on data
    if (cases.some(c => c.type === 'AML')) risks[0].probability += 0.2;
    if (transactions.some(t => t.amount > 50000)) risks[2].probability += 0.1;

    return risks;
};

// Main Component

interface CorporateDashboardProps {
    setActiveView?: (view: View) => void;
}

const CorporateCommandView: React.FC<CorporateDashboardProps> = ({ setActiveView }) => {
    const context = useContext(DataContext);
    
    // State Management
    const [activeTab, setActiveTab] = useState<'Overview' | 'Finance' | 'Operations' | 'Risk' | 'Strategy'>('Overview');
    const [aiInsight, setAiInsight] = useState<string>('Initializing AI...');
    const [isAiProcessing, setIsAiProcessing] = useState<boolean>(false);
    const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

    if (!context) throw new Error("CorporateCommandView requires DataContext.");
    const { paymentOrders, invoices, complianceCases, corporateTransactions } = context;

    // Data Aggregation
    
    // Financials
    const totalRevenue = invoices.filter(i => i.status === 'paid').reduce((acc, i) => acc + i.amount, 0);
    const totalExpenses = corporateTransactions.reduce((acc, t) => acc + t.amount, 0);
    const netIncome = totalRevenue - totalExpenses;
    const financialRatios = calculateEnterpriseFinancialRatios(invoices, paymentOrders, corporateTransactions);
    const cashFlowForecast = generateCashFlowProjections(invoices, paymentOrders);
    const taxLiabilities = estimateTaxLiabilities(totalRevenue, totalExpenses);

    // Operations
    const dailyVolume = generateDailyTransactionAnalytics(corporateTransactions);
    const operationalSpend = segmentOperationalSpend(corporateTransactions);
    const vendorMetrics = analyzeVendorEcosystem(corporateTransactions);
    const topVendors = vendorMetrics.slice(0, 5);
    
    // Risk
    const riskHeatmap = generateEnterpriseRiskHeatmap(complianceCases, corporateTransactions);
    const openComplianceCases = complianceCases.filter(c => c.status === 'open');
    const criticalRisks = riskHeatmap.filter(r => r.probability * r.impact > 0.15);

    // AI Integration
    useEffect(() => {
        const generateStrategicReport = async () => {
            setIsAiProcessing(true);
            try {
                const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
                
                let promptContext = '';
                if (activeTab === 'Overview') {
                    promptContext = `Executive Summary: Revenue $${totalRevenue}, Expenses $${totalExpenses}, Net Income $${netIncome}. Critical Risks: ${criticalRisks.length}. Top Vendor: ${topVendors[0]?.vendor}.`;
                } else if (activeTab === 'Finance') {
                    promptContext = `Financial Deep Dive: Current Ratio ${financialRatios[0].value.toFixed(2)}, Net Margin ${financialRatios[1].value.toFixed(2)}%. Cash Flow Trend: ${cashFlowForecast[0].netPosition > 0 ? 'Positive' : 'Negative'}. Tax Liability: $${taxLiabilities.reduce((s, t) => s + t.estimatedAmount, 0).toFixed(2)}.`;
                } else if (activeTab === 'Operations') {
                    promptContext = `Ops Report: Transaction Volume ${dailyVolume.length} days active. Top Spend Category: ${operationalSpend.sort((a,b) => b.value - a.value)[0]?.category}. Vendor Count: ${vendorMetrics.length}.`;
                } else if (activeTab === 'Risk') {
                    promptContext = `Risk Assessment: Open Cases ${openComplianceCases.length}. Highest Risk Category: ${riskHeatmap.sort((a,b) => b.probability - a.probability)[0]?.riskCategory}. Exposure: $${riskHeatmap.reduce((s,r) => s + r.exposureValue, 0)}.`;
                } else {
                    promptContext = `Strategic Outlook: Based on burn rate of $${financialRatios[2].value.toFixed(2)}/day and projected cash flow. Suggest 3 strategic moves for growth and stability.`;
                }

                const prompt = `You are an advanced Corporate AI Assistant. Analyze the following data context for the '${activeTab}' view and provide a high-level, professional, actionable strategic insight (max 2 sentences). Context: ${promptContext}`;
                
                const response = await ai.models.generateContent({
                    model: 'gemini-2.5-flash',
                    contents: prompt,
                });
                setAiInsight(response.text);
                setLastUpdated(new Date());
            } catch (error) {
                console.error("AI Processing Error:", error);
                setAiInsight("AI link unavailable. Using fallback data.");
            } finally {
                setIsAiProcessing(false);
            }
        };

        generateStrategicReport();
    }, [activeTab, totalRevenue, totalExpenses, netIncome]);

    // Visualization Utilities
    const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#6366f1'];
    
    const formatCurrency = (val: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', notation: 'compact' }).format(val);
    const formatNumber = (val: number) => new Intl.NumberFormat('en-US', { notation: 'compact' }).format(val);

    // Inline Sub-Components
    
    const TabButton = ({ id, label }: { id: typeof activeTab, label: string }) => (
        <button 
            onClick={() => setActiveTab(id)}
            className={`px-6 py-3 text-sm font-bold tracking-wide transition-all duration-200 border-b-2 ${
                activeTab === id 
                ? 'border-blue-500 text-white bg-gray-800/50' 
                : 'border-transparent text-gray-400 hover:text-white hover:bg-gray-800/30'
            }`}
        >
            {label}
        </button>
    );

    const MetricCard: React.FC<{ title: string, value: string, subtext?: string, trend?: number, color?: string }> = ({ title, value, subtext, trend, color = 'blue' }) => (
        <div className={`bg-gray-800 border border-gray-700 p-6 rounded-xl shadow-lg relative overflow-hidden group hover:border-${color}-500 transition-colors`}>
            <div className={`absolute top-0 right-0 w-24 h-24 bg-${color}-500/10 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110`} />
            <h3 className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-2">{title}</h3>
            <div className="text-3xl font-bold text-white mb-1">{value}</div>
            {subtext && <div className="text-gray-500 text-sm">{subtext}</div>}
            {trend !== undefined && (
                <div className={`text-sm font-medium mt-3 flex items-center ${trend >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {trend >= 0 ? '↑' : '↓'} {Math.abs(trend)}% <span className="text-gray-600 ml-1">vs last period</span>
                </div>
            )}
        </div>
    );

    // Component Rendering

    return (
        <div className="min-h-screen bg-gray-900 text-white p-2 space-y-8 font-sans">
            
            {/* HEADER & NAVIGATION */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-gray-800 pb-6">
                <div>
                    <h1 className="text-4xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
                        NEXUS COMMAND
                    </h1>
                    <p className="text-gray-400 text-sm mt-1">Enterprise Operating System v4.2.0 • {lastUpdated.toLocaleString()}</p>
                </div>
                <div className="flex space-x-1 mt-4 md:mt-0 bg-gray-900 rounded-lg p-1 border border-gray-800">
                    <TabButton id="Overview" label="EXECUTIVE" />
                    <TabButton id="Finance" label="FINANCE" />
                    <TabButton id="Operations" label="OPERATIONS" />
                    <TabButton id="Risk" label="RISK & COMPLIANCE" />
                    <TabButton id="Strategy" label="STRATEGY" />
                </div>
            </div>

            {/* AI INSIGHT BAR */}
            <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 blur-xl rounded-lg" />
                <Card className="relative bg-gray-800/80 backdrop-blur border border-blue-500/30 p-6">
                    <div className="flex items-start space-x-4">
                        <div className="p-3 bg-blue-500/10 rounded-full animate-pulse">
                            <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                        </div>
                        <div className="flex-1">
                            <h3 className="text-blue-400 text-xs font-bold uppercase tracking-widest mb-1">AI Strategic Intelligence</h3>
                            {isAiProcessing ? (
                                <div className="h-6 bg-gray-700 rounded w-3/4 animate-pulse" />
                            ) : (
                                <p className="text-lg text-gray-100 leading-relaxed font-light">"{aiInsight}"</p>
                            )}
                        </div>
                    </div>
                </Card>
            </div>

            {/* DYNAMIC CONTENT AREA */}
            <div className="space-y-8 animate-fade-in">
                
                {/* OVERVIEW TAB */}
                {activeTab === 'Overview' && (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <MetricCard title="Total Revenue (YTD)" value={formatCurrency(totalRevenue)} trend={12.5} color="green" />
                            <MetricCard title="Net Income" value={formatCurrency(netIncome)} trend={8.2} color="blue" />
                            <MetricCard title="Active Risks" value={criticalRisks.length.toString()} subtext="Critical Severity" trend={-5.0} color="red" />
                            <MetricCard title="Cash Runway" value="14.2 Months" subtext="Based on current burn" color="purple" />
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-96">
                            <Card title="Revenue vs Expenses Trend" className="lg:col-span-2 h-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={cashFlowForecast}>
                                        <XAxis dataKey="period" stroke="#6b7280" fontSize={12} />
                                        <YAxis stroke="#6b7280" fontSize={12} tickFormatter={(val) => `$${val/1000}k`} />
                                        <Tooltip contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151', color: '#fff' }} />
                                        <Legend />
                                        <Bar dataKey="inflow" name="Inflow" fill="#10b981" radius={[4, 4, 0, 0]} />
                                        <Bar dataKey="outflow" name="Outflow" fill="#ef4444" radius={[4, 4, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </Card>
                            <Card title="Operational Spend Mix" className="h-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie data={operationalSpend} dataKey="value" nameKey="category" cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5}>
                                            {operationalSpend.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                        <Legend verticalAlign="bottom" height={36} />
                                    </PieChart>
                                </ResponsiveContainer>
                            </Card>
                        </div>
                    </>
                )}

                {/* FINANCE TAB */}
                {activeTab === 'Finance' && (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {financialRatios.map((ratio, idx) => (
                                <MetricCard 
                                    key={idx} 
                                    title={ratio.name} 
                                    value={typeof ratio.value === 'number' && ratio.value < 100 ? ratio.value.toFixed(2) : formatNumber(ratio.value)} 
                                    subtext={`Benchmark: ${ratio.benchmark}`}
                                    trend={ratio.delta}
                                    color={ratio.status === 'Healthy' ? 'green' : ratio.status === 'Warning' ? 'yellow' : 'red'}
                                />
                            ))}
                        </div>
                        
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <Card title="Projected Cash Position (6 Months)" className="h-80">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={cashFlowForecast}>
                                        <XAxis dataKey="period" stroke="#6b7280" />
                                        <YAxis stroke="#6b7280" tickFormatter={(val) => `$${val/1000}k`} />
                                        <Tooltip cursor={{fill: '#374151'}} contentStyle={{ backgroundColor: '#1f2937' }} />
                                        <Bar dataKey="cumulativeCash" fill="#3b82f6" name="Cash Balance" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </Card>
                            <Card title="Estimated Tax Liability Breakdown" className="h-80 overflow-auto">
                                <table className="w-full text-left text-sm text-gray-400">
                                    <thead className="bg-gray-800 text-gray-200 uppercase font-bold">
                                        <tr>
                                            <th className="p-3">Jurisdiction</th>
                                            <th className="p-3">Type</th>
                                            <th className="p-3 text-right">Amount</th>
                                            <th className="p-3">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-700">
                                        {taxLiabilities.map((tax, i) => (
                                            <tr key={i} className="hover:bg-gray-800/50">
                                                <td className="p-3">{tax.jurisdiction}</td>
                                                <td className="p-3">{tax.taxType}</td>
                                                <td className="p-3 text-right font-mono text-white">{formatCurrency(tax.estimatedAmount)}</td>
                                                <td className="p-3">
                                                    <span className={`px-2 py-1 rounded text-xs font-bold ${tax.status === 'Paid' ? 'bg-green-900 text-green-300' : 'bg-yellow-900 text-yellow-300'}`}>
                                                        {tax.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </Card>
                        </div>
                    </>
                )}

                {/* OPERATIONS TAB */}
                {activeTab === 'Operations' && (
                    <>
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            <Card title="Daily Transaction Volume" className="lg:col-span-2 h-96">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={dailyVolume}>
                                        <XAxis dataKey="date" stroke="#6b7280" fontSize={10} tickFormatter={(d) => d.substring(5)} />
                                        <YAxis yAxisId="left" stroke="#3b82f6" fontSize={12} tickFormatter={(val) => `$${val/1000}k`} />
                                        <YAxis yAxisId="right" orientation="right" stroke="#10b981" fontSize={12} />
                                        <Tooltip contentStyle={{ backgroundColor: '#1f2937' }} />
                                        <Bar yAxisId="left" dataKey="value" fill="#3b82f6" name="Volume ($)" opacity={0.8} />
                                        <Bar yAxisId="right" dataKey="secondaryValue" fill="#10b981" name="Count" barSize={10} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </Card>
                            <Card title="Top Vendor Ecosystem" className="h-96 overflow-auto">
                                <div className="space-y-4">
                                    {topVendors.map((vendor, i) => (
                                        <div key={i} className="flex items-center justify-between p-3 bg-gray-800 rounded border border-gray-700">
                                            <div>
                                                <div className="font-bold text-white">{vendor.vendor}</div>
                                                <div className="text-xs text-gray-500">{vendor.transactionCount} txns • Risk: {vendor.riskScore}/100</div>
                                            </div>
                                            <div className="text-right">
                                                <div className="font-mono text-blue-400">{formatCurrency(vendor.totalSpend)}</div>
                                                <div className="text-xs text-gray-500">Avg: {formatCurrency(vendor.avgTransactionValue)}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </Card>
                        </div>
                    </>
                )}

                {/* RISK TAB */}
                {activeTab === 'Risk' && (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <MetricCard title="Compliance Score" value="94.2" subtext="Top 5% Industry" color="green" />
                            <MetricCard title="Open Cases" value={openComplianceCases.length.toString()} subtext="Requires Attention" color="yellow" />
                            <MetricCard title="Total Risk Exposure" value={formatCurrency(riskHeatmap.reduce((a,b)=>a+b.exposureValue,0))} color="red" />
                            <MetricCard title="Audit Anomalies" value="3" subtext="Last 24 Hours" color="purple" />
                        </div>
                        
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <Card title="Enterprise Risk Heatmap" className="h-96">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={riskHeatmap} layout="vertical" margin={{ left: 40 }}>
                                        <XAxis type="number" domain={[0, 1]} hide />
                                        <YAxis type="category" dataKey="riskCategory" stroke="#9ca3af" width={120} fontSize={11} />
                                        <Tooltip cursor={{fill: 'transparent'}} content={({ active, payload }) => {
                                            if (active && payload && payload.length) {
                                                const data = payload[0].payload;
                                                return (
                                                    <div className="bg-gray-900 border border-gray-700 p-3 rounded shadow-xl">
                                                        <p className="font-bold text-white">{data.riskCategory}</p>
                                                        <p className="text-sm text-gray-400">Prob: {(data.probability * 100).toFixed(0)}% | Impact: {(data.impact * 100).toFixed(0)}%</p>
                                                        <p className="text-sm text-red-400">Exposure: {formatCurrency(data.exposureValue)}</p>
                                                    </div>
                                                );
                                            }
                                            return null;
                                        }} />
                                        <Bar dataKey="probability" name="Probability" stackId="a" fill="#f59e0b" barSize={20} />
                                        <Bar dataKey="impact" name="Impact" stackId="a" fill="#ef4444" barSize={20} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </Card>
                            <Card title="Compliance Case Log" className="h-96 overflow-auto">
                                <div className="space-y-2">
                                    {complianceCases.map((c, i) => (
                                        <div key={i} className="p-3 border-l-4 border-red-500 bg-gray-800/50 rounded flex justify-between items-center">
                                            <div>
                                                <div className="font-bold text-sm text-white">{c.type} Violation</div>
                                                <div className="text-xs text-gray-500">{c.description}</div>
                                            </div>
                                            <span className={`px-2 py-1 text-xs rounded font-bold ${c.status === 'open' ? 'bg-red-900 text-red-200' : 'bg-gray-700 text-gray-300'}`}>
                                                {c.status.toUpperCase()}
                                            </span>
                                        </div>
                                    ))}
                                    {complianceCases.length === 0 && <div className="text-center text-gray-500 py-10">No active compliance cases detected. Systems nominal.</div>}
                                </div>
                            </Card>
                        </div>
                    </>
                )}

                {/* STRATEGY TAB */}
                {activeTab === 'Strategy' && (
                    <div className="grid grid-cols-1 gap-6">
                        <Card title="Strategic Growth Modeling" className="p-8 bg-gradient-to-br from-gray-800 to-gray-900">
                            <div className="flex flex-col md:flex-row gap-8">
                                <div className="flex-1 space-y-6">
                                    <h3 className="text-2xl font-bold text-white">Scenario Analysis: Aggressive Expansion</h3>
                                    <p className="text-gray-400">
                                        Based on current liquidity of {formatCurrency(financialRatios[0].value * 1000000)} and a burn rate of {formatCurrency(financialRatios[2].value)}, 
                                        the enterprise can sustain a 15% increase in R&D spend for 8 months before requiring additional capital injection.
                                    </p>
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-sm text-gray-300">
                                            <span>Market Penetration Probability</span>
                                            <span>78%</span>
                                        </div>
                                        <div className="w-full bg-gray-700 rounded-full h-2">
                                            <div className="bg-blue-500 h-2 rounded-full" style={{ width: '78%' }}></div>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-sm text-gray-300">
                                            <span>Regulatory Approval Confidence</span>
                                            <span>92%</span>
                                        </div>
                                        <div className="w-full bg-gray-700 rounded-full h-2">
                                            <div className="bg-green-500 h-2 rounded-full" style={{ width: '92%' }}></div>
                                        </div>
                                    </div>
                                </div>
                                <div className="w-full md:w-1/3 bg-gray-800 p-6 rounded-xl border border-gray-700">
                                    <h4 className="font-bold text-white mb-4">AI Recommendation Engine</h4>
                                    <ul className="space-y-4">
                                        <li className="flex items-start space-x-3">
                                            <span className="text-green-400 text-xl">✓</span>
                                            <span className="text-sm text-gray-300">Optimize vendor contracts to reduce variable OPEX by 12%.</span>
                                        </li>
                                        <li className="flex items-start space-x-3">
                                            <span className="text-green-400 text-xl">✓</span>
                                            <span className="text-sm text-gray-300">Accelerate receivables collection to improve DSO by 5 days.</span>
                                        </li>
                                        <li className="flex items-start space-x-3">
                                            <span className="text-yellow-400 text-xl">⚠</span>
                                            <span className="text-sm text-gray-300">Monitor geopolitical risk in supply chain region APAC-1.</span>
                                        </li>
                                    </ul>
                                    <button className="w-full mt-6 bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded transition-colors" onClick={() => setActiveView && setActiveView(View.Budgets)}>
                                        Adjust Budgets
                                    </button>
                                </div>
                            </div>
                        </Card>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CorporateCommandView;


================================================================================
// APPENDED FROM REPO: diplomat-bit/almost | ORIGINAL PATH: diplomat-bit-almost-93a5466/components/CorporateCommandView (2).tsx
================================================================================



================================================================================
// APPENDED FROM REPO: diplomat-bit/almost | ORIGINAL PATH: diplomat-bit-almost-93a5466/components/CorporateCommandView (4).tsx
================================================================================

import React, { useContext, useState, useEffect } from 'react';
import { DataContext } from '../context/DataContext';
import Card from './Card';
import { View, PaymentOrder, Invoice, ComplianceCase, CorporateTransaction } from '../types';
import { GoogleGenAI } from '@google/genai';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, Legend, PieChart, Pie, Cell } from 'recharts';

// Analytics Data Structures

export type TimeSeriesData = {
    date: string;
    value: number;
    secondaryValue?: number;
    tertiaryValue?: number;
};

export type CategoricalData = {
    category: string;
    value: number;
    percentage?: number;
    color?: string;
};

export type FinancialRatio = {
    name: string;
    value: number;
    benchmark: number;
    status: 'Healthy' | 'Warning' | 'Critical';
    delta: number;
};

export type VendorPerformanceMetric = {
    vendor: string;
    totalSpend: number;
    transactionCount: number;
    avgTransactionValue: number;
    riskScore: number;
    lastInteraction: string;
};

export type DepartmentalKPI = {
    department: string;
    budgetUtilization: number;
    operationalEfficiency: number;
    complianceScore: number;
    headcountSpend: number;
};

export type RiskAssessmentData = {
    riskCategory: string;
    probability: number;
    impact: number;
    mitigationStatus: string;
    exposureValue: number;
};

export type CashFlowProjection = {
    period: string;
    inflow: number;
    outflow: number;
    netPosition: number;
    cumulativeCash: number;
};

export type AuditLogEntry = {
    timestamp: string;
    user: string;
    action: string;
    severity: 'Low' | 'Medium' | 'High' | 'Critical';
    details: string;
};

export type TaxLiabilityBreakdown = {
    jurisdiction: string;
    taxType: string;
    estimatedAmount: number;
    dueDate: string;
    status: 'Accrued' | 'Paid' | 'Pending';
};

// Data Processing Functions

/**
 * Generates daily transaction volume and amount analytics.
 */
export const generateDailyTransactionAnalytics = (transactions: CorporateTransaction[]): TimeSeriesData[] => {
    const dailyMap: Record<string, { count: number; amount: number }> = {};
    transactions.forEach(tx => {
        const date = new Date(tx.date).toISOString().split('T')[0];
        if (!dailyMap[date]) dailyMap[date] = { count: 0, amount: 0 };
        dailyMap[date].count++;
        dailyMap[date].amount += tx.amount;
    });
    return Object.entries(dailyMap)
        .map(([date, data]) => ({ date, value: data.amount, secondaryValue: data.count }))
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
};

/**
 * Calculates key financial ratios.
 */
export const calculateEnterpriseFinancialRatios = (invoices: Invoice[], orders: PaymentOrder[], transactions: CorporateTransaction[]): FinancialRatio[] => {
    const currentAssets = invoices.filter(i => i.status !== 'paid').reduce((sum, i) => sum + i.amount, 0);
    const currentLiabilities = orders.filter(o => o.status !== 'paid').reduce((sum, o) => sum + o.amount, 0);
    const totalRevenue = invoices.filter(i => i.status === 'paid').reduce((sum, i) => sum + i.amount, 0);
    const totalExpenses = transactions.reduce((sum, t) => sum + t.amount, 0);
    
    const currentRatio = currentLiabilities > 0 ? currentAssets / currentLiabilities : 0;
    const netProfitMargin = totalRevenue > 0 ? ((totalRevenue - totalExpenses) / totalRevenue) * 100 : 0;
    const burnRate = totalExpenses / 30; // Simplified 30-day period for calculation
    
    return [
        { name: 'Current Ratio', value: currentRatio, benchmark: 1.5, status: currentRatio > 1.5 ? 'Healthy' : currentRatio > 1.0 ? 'Warning' : 'Critical', delta: 0.1 },
        { name: 'Net Profit Margin', value: netProfitMargin, benchmark: 20, status: netProfitMargin > 20 ? 'Healthy' : netProfitMargin > 10 ? 'Warning' : 'Critical', delta: -2.5 },
        { name: 'Daily Burn Rate', value: burnRate, benchmark: 5000, status: burnRate < 5000 ? 'Healthy' : 'Warning', delta: 12.4 }
    ];
};

/**
 * Projects cash flow for the next 6 periods.
 */
export const generateCashFlowProjections = (invoices: Invoice[], orders: PaymentOrder[]): CashFlowProjection[] => {
    const projections: CashFlowProjection[] = [];
    const today = new Date();
    let currentCash = 1000000; // Initial capital assumption

    for (let i = 0; i < 6; i++) {
        const futureDate = new Date(today);
        futureDate.setMonth(today.getMonth() + i);
        const periodKey = futureDate.toISOString().substring(0, 7);
        
        // Estimated inflows from receivables
        const projectedInflow = invoices
            .filter(inv => new Date(inv.dueDate).getMonth() === futureDate.getMonth())
            .reduce((sum, inv) => sum + inv.amount, 0) * 0.95; // Assumed 95% collection rate

        // Estimated outflows from payables and recurring expenses
        const projectedOutflow = orders
            .filter(ord => new Date(ord.dueDate || '').getMonth() === futureDate.getMonth())
            .reduce((sum, ord) => sum + ord.amount, 0) * 1.1; // Assumed 10% buffer for variable costs

        const net = projectedInflow - projectedOutflow;
        currentCash += net;

        projections.push({
            period: periodKey,
            inflow: projectedInflow,
            outflow: projectedOutflow,
            netPosition: net,
            cumulativeCash: currentCash
        });
    }
    return projections;
};

/**
 * Analyzes vendor performance and spend.
 */
export const analyzeVendorEcosystem = (transactions: CorporateTransaction[]): VendorPerformanceMetric[] => {
    const vendorMap: Record<string, VendorPerformanceMetric> = {};
    
    transactions.forEach(tx => {
        if (!vendorMap[tx.merchant]) {
            vendorMap[tx.merchant] = {
                vendor: tx.merchant,
                totalSpend: 0,
                transactionCount: 0,
                avgTransactionValue: 0,
                riskScore: Math.floor(Math.random() * 100), // Simulated risk score
                lastInteraction: tx.date
            };
        }
        const v = vendorMap[tx.merchant];
        v.totalSpend += tx.amount;
        v.transactionCount++;
        v.avgTransactionValue = v.totalSpend / v.transactionCount;
        if (new Date(tx.date) > new Date(v.lastInteraction)) {
            v.lastInteraction = tx.date;
        }
    });

    return Object.values(vendorMap).sort((a, b) => b.totalSpend - a.totalSpend);
};

/**
 * Segments operational spend into categories.
 */
export const segmentOperationalSpend = (transactions: CorporateTransaction[]): CategoricalData[] => {
    const categories = {
        'Fixed Infrastructure': 0,
        'Variable COGS': 0,
        'R&D Investment': 0,
        'Sales & Marketing': 0,
        'G&A': 0
    };

    transactions.forEach(tx => {
        if (tx.merchant.includes('Rent') || tx.merchant.includes('AWS') || tx.merchant.includes('Server')) categories['Fixed Infrastructure'] += tx.amount;
        else if (tx.merchant.includes('Supplier') || tx.merchant.includes('Logistics')) categories['Variable COGS'] += tx.amount;
        else if (tx.description.includes('Research') || tx.description.includes('Lab')) categories['R&D Investment'] += tx.amount;
        else if (tx.merchant.includes('Ads') || tx.merchant.includes('Google') || tx.merchant.includes('Facebook')) categories['Sales & Marketing'] += tx.amount;
        else categories['G&A'] += tx.amount;
    });

    return Object.entries(categories).map(([category, value]) => ({ category, value }));
};

/**
 * Estimates tax liabilities.
 */
export const estimateTaxLiabilities = (revenue: number, expenses: number): TaxLiabilityBreakdown[] => {
    const profit = Math.max(0, revenue - expenses);
    return [
        { jurisdiction: 'Federal', taxType: 'Corporate Income Tax', estimatedAmount: profit * 0.21, dueDate: '2024-04-15', status: 'Accrued' },
        { jurisdiction: 'State (CA)', taxType: 'Franchise Tax', estimatedAmount: profit * 0.0884, dueDate: '2024-04-15', status: 'Accrued' },
        { jurisdiction: 'International', taxType: 'VAT/GST', estimatedAmount: revenue * 0.05, dueDate: 'Monthly', status: 'Pending' },
        { jurisdiction: 'Local', taxType: 'Payroll Tax', estimatedAmount: expenses * 0.0765, dueDate: 'Bi-Weekly', status: 'Paid' }
    ];
};

/**
 * Generates risk assessment data.
 */
export const generateEnterpriseRiskHeatmap = (cases: ComplianceCase[], transactions: CorporateTransaction[]): RiskAssessmentData[] => {
    const risks: RiskAssessmentData[] = [
        { riskCategory: 'AML/KYC', probability: 0.15, impact: 0.9, mitigationStatus: 'Monitoring', exposureValue: 500000 },
        { riskCategory: 'Data Privacy (GDPR)', probability: 0.05, impact: 0.95, mitigationStatus: 'Controlled', exposureValue: 2000000 },
        { riskCategory: 'Vendor Fraud', probability: 0.2, impact: 0.4, mitigationStatus: 'Active Investigation', exposureValue: 150000 },
        { riskCategory: 'Tax Compliance', probability: 0.1, impact: 0.7, mitigationStatus: 'Audited', exposureValue: 750000 },
        { riskCategory: 'Cybersecurity', probability: 0.3, impact: 0.99, mitigationStatus: 'Hardened', exposureValue: 5000000 }
    ];

    // Adjusts risk based on data
    if (cases.some(c => c.type === 'AML')) risks[0].probability += 0.2;
    if (transactions.some(t => t.amount > 50000)) risks[2].probability += 0.1;

    return risks;
};

// Main Component

interface CorporateDashboardProps {
    setActiveView?: (view: View) => void;
}

const CorporateCommandView: React.FC<CorporateDashboardProps> = ({ setActiveView }) => {
    const context = useContext(DataContext);
    
    // State Management
    const [activeTab, setActiveTab] = useState<'Overview' | 'Finance' | 'Operations' | 'Risk' | 'Strategy'>('Overview');
    const [aiInsight, setAiInsight] = useState<string>('Initializing AI...');
    const [isAiProcessing, setIsAiProcessing] = useState<boolean>(false);
    const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

    if (!context) throw new Error("CorporateCommandView requires DataContext.");
    const { paymentOrders, invoices, complianceCases, corporateTransactions } = context;

    // Data Aggregation
    
    // Financials
    const totalRevenue = invoices.filter(i => i.status === 'paid').reduce((acc, i) => acc + i.amount, 0);
    const totalExpenses = corporateTransactions.reduce((acc, t) => acc + t.amount, 0);
    const netIncome = totalRevenue - totalExpenses;
    const financialRatios = calculateEnterpriseFinancialRatios(invoices, paymentOrders, corporateTransactions);
    const cashFlowForecast = generateCashFlowProjections(invoices, paymentOrders);
    const taxLiabilities = estimateTaxLiabilities(totalRevenue, totalExpenses);

    // Operations
    const dailyVolume = generateDailyTransactionAnalytics(corporateTransactions);
    const operationalSpend = segmentOperationalSpend(corporateTransactions);
    const vendorMetrics = analyzeVendorEcosystem(corporateTransactions);
    const topVendors = vendorMetrics.slice(0, 5);
    
    // Risk
    const riskHeatmap = generateEnterpriseRiskHeatmap(complianceCases, corporateTransactions);
    const openComplianceCases = complianceCases.filter(c => c.status === 'open');
    const criticalRisks = riskHeatmap.filter(r => r.probability * r.impact > 0.15);

    // AI Integration
    useEffect(() => {
        const generateStrategicReport = async () => {
            setIsAiProcessing(true);
            try {
                const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
                
                let promptContext = '';
                if (activeTab === 'Overview') {
                    promptContext = `Executive Summary: Revenue $${totalRevenue}, Expenses $${totalExpenses}, Net Income $${netIncome}. Critical Risks: ${criticalRisks.length}. Top Vendor: ${topVendors[0]?.vendor}.`;
                } else if (activeTab === 'Finance') {
                    promptContext = `Financial Deep Dive: Current Ratio ${financialRatios[0].value.toFixed(2)}, Net Margin ${financialRatios[1].value.toFixed(2)}%. Cash Flow Trend: ${cashFlowForecast[0].netPosition > 0 ? 'Positive' : 'Negative'}. Tax Liability: $${taxLiabilities.reduce((s, t) => s + t.estimatedAmount, 0).toFixed(2)}.`;
                } else if (activeTab === 'Operations') {
                    promptContext = `Ops Report: Transaction Volume ${dailyVolume.length} days active. Top Spend Category: ${operationalSpend.sort((a,b) => b.value - a.value)[0]?.category}. Vendor Count: ${vendorMetrics.length}.`;
                } else if (activeTab === 'Risk') {
                    promptContext = `Risk Assessment: Open Cases ${openComplianceCases.length}. Highest Risk Category: ${riskHeatmap.sort((a,b) => b.probability - a.probability)[0]?.riskCategory}. Exposure: $${riskHeatmap.reduce((s,r) => s + r.exposureValue, 0)}.`;
                } else {
                    promptContext = `Strategic Outlook: Based on burn rate of $${financialRatios[2].value.toFixed(2)}/day and projected cash flow. Suggest 3 strategic moves for growth and stability.`;
                }

                const prompt = `You are an advanced Corporate AI Assistant. Analyze the following data context for the '${activeTab}' view and provide a high-level, professional, actionable strategic insight (max 2 sentences). Context: ${promptContext}`;
                
                const response = await ai.models.generateContent({
                    model: 'gemini-2.5-flash',
                    contents: prompt,
                });
                setAiInsight(response.text);
                setLastUpdated(new Date());
            } catch (error) {
                console.error("AI Processing Error:", error);
                setAiInsight("AI link unavailable. Using fallback data.");
            } finally {
                setIsAiProcessing(false);
            }
        };

        generateStrategicReport();
    }, [activeTab, totalRevenue, totalExpenses, netIncome]);

    // Visualization Utilities
    const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#6366f1'];
    
    const formatCurrency = (val: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', notation: 'compact' }).format(val);
    const formatNumber = (val: number) => new Intl.NumberFormat('en-US', { notation: 'compact' }).format(val);

    // Inline Sub-Components
    
    const TabButton = ({ id, label }: { id: typeof activeTab, label: string }) => (
        <button 
            onClick={() => setActiveTab(id)}
            className={`px-6 py-3 text-sm font-bold tracking-wide transition-all duration-200 border-b-2 ${
                activeTab === id 
                ? 'border-blue-500 text-white bg-gray-800/50' 
                : 'border-transparent text-gray-400 hover:text-white hover:bg-gray-800/30'
            }`}
        >
            {label}
        </button>
    );

    const MetricCard: React.FC<{ title: string, value: string, subtext?: string, trend?: number, color?: string }> = ({ title, value, subtext, trend, color = 'blue' }) => (
        <div className={`bg-gray-800 border border-gray-700 p-6 rounded-xl shadow-lg relative overflow-hidden group hover:border-${color}-500 transition-colors`}>
            <div className={`absolute top-0 right-0 w-24 h-24 bg-${color}-500/10 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110`} />
            <h3 className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-2">{title}</h3>
            <div className="text-3xl font-bold text-white mb-1">{value}</div>
            {subtext && <div className="text-gray-500 text-sm">{subtext}</div>}
            {trend !== undefined && (
                <div className={`text-sm font-medium mt-3 flex items-center ${trend >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {trend >= 0 ? 'â†‘' : 'â†“'} {Math.abs(trend)}% <span className="text-gray-600 ml-1">vs last period</span>
                </div>
            )}
        </div>
    );

    // Component Rendering

    return (
        <div className="min-h-screen bg-gray-900 text-white p-2 space-y-8 font-sans">
            
            {/* HEADER & NAVIGATION */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-gray-800 pb-6">
                <div>
                    <h1 className="text-4xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
                        NEXUS COMMAND
                    </h1>
                    <p className="text-gray-400 text-sm mt-1">Enterprise Operating System v4.2.0 â€¢ {lastUpdated.toLocaleString()}</p>
                </div>
                <div className="flex space-x-1 mt-4 md:mt-0 bg-gray-900 rounded-lg p-1 border border-gray-800">
                    <TabButton id="Overview" label="EXECUTIVE" />
                    <TabButton id="Finance" label="FINANCE" />
                    <TabButton id="Operations" label="OPERATIONS" />
                    <TabButton id="Risk" label="RISK & COMPLIANCE" />
                    <TabButton id="Strategy" label="STRATEGY" />
                </div>
            </div>

            {/* AI INSIGHT BAR */}
            <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 blur-xl rounded-lg" />
                <Card className="relative bg-gray-800/80 backdrop-blur border border-blue-500/30 p-6">
                    <div className="flex items-start space-x-4">
                        <div className="p-3 bg-blue-500/10 rounded-full animate-pulse">
                            <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                        </div>
                        <div className="flex-1">
                            <h3 className="text-blue-400 text-xs font-bold uppercase tracking-widest mb-1">AI Strategic Intelligence</h3>
                            {isAiProcessing ? (
                                <div className="h-6 bg-gray-700 rounded w-3/4 animate-pulse" />
                            ) : (
                                <p className="text-lg text-gray-100 leading-relaxed font-light">"{aiInsight}"</p>
                            )}
                        </div>
                    </div>
                </Card>
            </div>

            {/* DYNAMIC CONTENT AREA */}
            <div className="space-y-8 animate-fade-in">
                
                {/* OVERVIEW TAB */}
                {activeTab === 'Overview' && (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <MetricCard title="Total Revenue (YTD)" value={formatCurrency(totalRevenue)} trend={12.5} color="green" />
                            <MetricCard title="Net Income" value={formatCurrency(netIncome)} trend={8.2} color="blue" />
                            <MetricCard title="Active Risks" value={criticalRisks.length.toString()} subtext="Critical Severity" trend={-5.0} color="red" />
                            <MetricCard title="Cash Runway" value="14.2 Months" subtext="Based on current burn" color="purple" />
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-96">
                            <Card title="Revenue vs Expenses Trend" className="lg:col-span-2 h-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={cashFlowForecast}>
                                        <XAxis dataKey="period" stroke="#6b7280" fontSize={12} />
                                        <YAxis stroke="#6b7280" fontSize={12} tickFormatter={(val) => `$${val/1000}k`} />
                                        <Tooltip contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151', color: '#fff' }} />
                                        <Legend />
                                        <Bar dataKey="inflow" name="Inflow" fill="#10b981" radius={[4, 4, 0, 0]} />
                                        <Bar dataKey="outflow" name="Outflow" fill="#ef4444" radius={[4, 4, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </Card>
                            <Card title="Operational Spend Mix" className="h-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie data={operationalSpend} dataKey="value" nameKey="category" cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5}>
                                            {operationalSpend.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                        <Legend verticalAlign="bottom" height={36} />
                                    </PieChart>
                                </ResponsiveContainer>
                            </Card>
                        </div>
                    </>
                )}

                {/* FINANCE TAB */}
                {activeTab === 'Finance' && (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {financialRatios.map((ratio, idx) => (
                                <MetricCard 
                                    key={idx} 
                                    title={ratio.name} 
                                    value={typeof ratio.value === 'number' && ratio.value < 100 ? ratio.value.toFixed(2) : formatNumber(ratio.value)} 
                                    subtext={`Benchmark: ${ratio.benchmark}`}
                                    trend={ratio.delta}
                                    color={ratio.status === 'Healthy' ? 'green' : ratio.status === 'Warning' ? 'yellow' : 'red'}
                                />
                            ))}
                        </div>
                        
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <Card title="Projected Cash Position (6 Months)" className="h-80">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={cashFlowForecast}>
                                        <XAxis dataKey="period" stroke="#6b7280" />
                                        <YAxis stroke="#6b7280" tickFormatter={(val) => `$${val/1000}k`} />
                                        <Tooltip cursor={{fill: '#374151'}} contentStyle={{ backgroundColor: '#1f2937' }} />
                                        <Bar dataKey="cumulativeCash" fill="#3b82f6" name="Cash Balance" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </Card>
                            <Card title="Estimated Tax Liability Breakdown" className="h-80 overflow-auto">
                                <table className="w-full text-left text-sm text-gray-400">
                                    <thead className="bg-gray-800 text-gray-200 uppercase font-bold">
                                        <tr>
                                            <th className="p-3">Jurisdiction</th>
                                            <th className="p-3">Type</th>
                                            <th className="p-3 text-right">Amount</th>
                                            <th className="p-3">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-700">
                                        {taxLiabilities.map((tax, i) => (
                                            <tr key={i} className="hover:bg-gray-800/50">
                                                <td className="p-3">{tax.jurisdiction}</td>
                                                <td className="p-3">{tax.taxType}</td>
                                                <td className="p-3 text-right font-mono text-white">{formatCurrency(tax.estimatedAmount)}</td>
                                                <td className="p-3">
                                                    <span className={`px-2 py-1 rounded text-xs font-bold ${tax.status === 'Paid' ? 'bg-green-900 text-green-300' : 'bg-yellow-900 text-yellow-300'}`}>
                                                        {tax.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </Card>
                        </div>
                    </>
                )}

                {/* OPERATIONS TAB */}
                {activeTab === 'Operations' && (
                    <>
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            <Card title="Daily Transaction Volume" className="lg:col-span-2 h-96">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={dailyVolume}>
                                        <XAxis dataKey="date" stroke="#6b7280" fontSize={10} tickFormatter={(d) => d.substring(5)} />
                                        <YAxis yAxisId="left" stroke="#3b82f6" fontSize={12} tickFormatter={(val) => `$${val/1000}k`} />
                                        <YAxis yAxisId="right" orientation="right" stroke="#10b981" fontSize={12} />
                                        <Tooltip contentStyle={{ backgroundColor: '#1f2937' }} />
                                        <Bar yAxisId="left" dataKey="value" fill="#3b82f6" name="Volume ($)" opacity={0.8} />
                                        <Bar yAxisId="right" dataKey="secondaryValue" fill="#10b981" name="Count" barSize={10} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </Card>
                            <Card title="Top Vendor Ecosystem" className="h-96 overflow-auto">
                                <div className="space-y-4">
                                    {topVendors.map((vendor, i) => (
                                        <div key={i} className="flex items-center justify-between p-3 bg-gray-800 rounded border border-gray-700">
                                            <div>
                                                <div className="font-bold text-white">{vendor.vendor}</div>
                                                <div className="text-xs text-gray-500">{vendor.transactionCount} txns â€¢ Risk: {vendor.riskScore}/100</div>
                                            </div>
                                            <div className="text-right">
                                                <div className="font-mono text-blue-400">{formatCurrency(vendor.totalSpend)}</div>
                                                <div className="text-xs text-gray-500">Avg: {formatCurrency(vendor.avgTransactionValue)}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </Card>
                        </div>
                    </>
                )}

                {/* RISK TAB */}
                {activeTab === 'Risk' && (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <MetricCard title="Compliance Score" value="94.2" subtext="Top 5% Industry" color="green" />
                            <MetricCard title="Open Cases" value={openComplianceCases.length.toString()} subtext="Requires Attention" color="yellow" />
                            <MetricCard title="Total Risk Exposure" value={formatCurrency(riskHeatmap.reduce((a,b)=>a+b.exposureValue,0))} color="red" />
                            <MetricCard title="Audit Anomalies" value="3" subtext="Last 24 Hours" color="purple" />
                        </div>
                        
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <Card title="Enterprise Risk Heatmap" className="h-96">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={riskHeatmap} layout="vertical" margin={{ left: 40 }}>
                                        <XAxis type="number" domain={[0, 1]} hide />
                                        <YAxis type="category" dataKey="riskCategory" stroke="#9ca3af" width={120} fontSize={11} />
                                        <Tooltip cursor={{fill: 'transparent'}} content={({ active, payload }) => {
                                            if (active && payload && payload.length) {
                                                const data = payload[0].payload;
                                                return (
                                                    <div className="bg-gray-900 border border-gray-700 p-3 rounded shadow-xl">
                                                        <p className="font-bold text-white">{data.riskCategory}</p>
                                                        <p className="text-sm text-gray-400">Prob: {(data.probability * 100).toFixed(0)}% | Impact: {(data.impact * 100).toFixed(0)}%</p>
                                                        <p className="text-sm text-red-400">Exposure: {formatCurrency(data.exposureValue)}</p>
                                                    </div>
                                                );
                                            }
                                            return null;
                                        }} />
                                        <Bar dataKey="probability" name="Probability" stackId="a" fill="#f59e0b" barSize={20} />
                                        <Bar dataKey="impact" name="Impact" stackId="a" fill="#ef4444" barSize={20} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </Card>
                            <Card title="Compliance Case Log" className="h-96 overflow-auto">
                                <div className="space-y-2">
                                    {complianceCases.map((c, i) => (
                                        <div key={i} className="p-3 border-l-4 border-red-500 bg-gray-800/50 rounded flex justify-between items-center">
                                            <div>
                                                <div className="font-bold text-sm text-white">{c.type} Violation</div>
                                                <div className="text-xs text-gray-500">{c.description}</div>
                                            </div>
                                            <span className={`px-2 py-1 text-xs rounded font-bold ${c.status === 'open' ? 'bg-red-900 text-red-200' : 'bg-gray-700 text-gray-300'}`}>
                                                {c.status.toUpperCase()}
                                            </span>
                                        </div>
                                    ))}
                                    {complianceCases.length === 0 && <div className="text-center text-gray-500 py-10">No active compliance cases detected. Systems nominal.</div>}
                                </div>
                            </Card>
                        </div>
                    </>
                )}

                {/* STRATEGY TAB */}
                {activeTab === 'Strategy' && (
                    <div className="grid grid-cols-1 gap-6">
                        <Card title="Strategic Growth Modeling" className="p-8 bg-gradient-to-br from-gray-800 to-gray-900">
                            <div className="flex flex-col md:flex-row gap-8">
                                <div className="flex-1 space-y-6">
                                    <h3 className="text-2xl font-bold text-white">Scenario Analysis: Aggressive Expansion</h3>
                                    <p className="text-gray-400">
                                        Based on current liquidity of {formatCurrency(financialRatios[0].value * 1000000)} and a burn rate of {formatCurrency(financialRatios[2].value)}, 
                                        the enterprise can sustain a 15% increase in R&D spend for 8 months before requiring additional capital injection.
                                    </p>
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-sm text-gray-300">
                                            <span>Market Penetration Probability</span>
                                            <span>78%</span>
                                        </div>
                                        <div className="w-full bg-gray-700 rounded-full h-2">
                                            <div className="bg-blue-500 h-2 rounded-full" style={{ width: '78%' }}></div>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-sm text-gray-300">
                                            <span>Regulatory Approval Confidence</span>
                                            <span>92%</span>
                                        </div>
                                        <div className="w-full bg-gray-700 rounded-full h-2">
                                            <div className="bg-green-500 h-2 rounded-full" style={{ width: '92%' }}></div>
                                        </div>
                                    </div>
                                </div>
                                <div className="w-full md:w-1/3 bg-gray-800 p-6 rounded-xl border border-gray-700">
                                    <h4 className="font-bold text-white mb-4">AI Recommendation Engine</h4>
                                    <ul className="space-y-4">
                                        <li className="flex items-start space-x-3">
                                            <span className="text-green-400 text-xl">âœ“</span>
                                            <span className="text-sm text-gray-300">Optimize vendor contracts to reduce variable OPEX by 12%.</span>
                                        </li>
                                        <li className="flex items-start space-x-3">
                                            <span className="text-green-400 text-xl">âœ“</span>
                                            <span className="text-sm text-gray-300">Accelerate receivables collection to improve DSO by 5 days.</span>
                                        </li>
                                        <li className="flex items-start space-x-3">
                                            <span className="text-yellow-400 text-xl">âš </span>
                                            <span className="text-sm text-gray-300">Monitor geopolitical risk in supply chain region APAC-1.</span>
                                        </li>
                                    </ul>
                                    <button className="w-full mt-6 bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded transition-colors" onClick={() => setActiveView && setActiveView(View.Budgets)}>
                                        Adjust Budgets
                                    </button>
                                </div>
                            </div>
                        </Card>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CorporateCommandView;

================================================================================
// APPENDED FROM REPO: diplomat-bit/almost | ORIGINAL PATH: diplomat-bit-almost-93a5466/components/CorporateCommandView (5).tsx
================================================================================

import React, { useContext, useState, useEffect, useCallback } from 'react';
import { DataContext } from '../context/DataContext';
import Card from './Card';
import { View, PaymentOrder, Invoice, ComplianceCase, CorporateTransaction } from '../types';
import { GoogleGenAI } from '@google/genai';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, Legend, PieChart, Pie, Cell, AreaChart, Area, LineChart, Line } from 'recharts';

// --- EXPANDED DATA STRUCTURES FOR HYPER-DIMENSIONAL ANALYSIS ---

export type TimeSeriesData = { date: string; value: number; secondaryValue?: number; tertiaryValue?: number; };
export type CategoricalData = { category: string; value: number; percentage?: number; color?: string; };
export type FinancialRatio = { name: string; value: number; benchmark: number; status: 'Optimal' | 'Stable' | 'Warning' | 'Critical'; delta: number; };
export type VendorPerformanceMetric = { vendor: string; totalSpend: number; transactionCount: number; avgTransactionValue: number; riskScore: number; lastInteraction: string; };
export type DepartmentalKPI = { department: string; budgetUtilization: number; operationalEfficiency: number; complianceScore: number; headcountSpend: number; };
export type RiskAssessmentData = { riskCategory: string; probability: number; impact: number; velocity: number; mitigationStatus: string; exposureValue: number; };
export type CashFlowProjection = { period: string; inflow: number; outflow: number; netPosition: number; cumulativeCash: number; };
export type AuditLogEntry = { timestamp: string; user: string; action: string; severity: 'Low' | 'Medium' | 'High' | 'Critical'; details: string; };
export type TaxLiabilityBreakdown = { jurisdiction: string; taxType: string; estimatedAmount: number; dueDate: string; status: 'Accrued' | 'Paid' | 'Pending'; };

// High-Frequency Trading & Market Intelligence Structures
export type MarketDataTick = { symbol: string; price: number; change: number; volume: number; timestamp: number; };
export type TradingAlgorithm = { id: string; name: string; strategy: 'Momentum' | 'Arbitrage' | 'Mean Reversion'; status: 'Active' | 'Paused' | 'Terminated'; pnl: number; trades: number; uptime: string; };
export type PortfolioMetrics = { totalValue: number; dailyPnl: number; valueAtRisk: number; sharpeRatio: number; alpha: number; };
export type GlobalMacroIndicator = { name: string; value: number; trend: 'Up' | 'Down' | 'Stable'; impact: 'High' | 'Medium' | 'Low'; region: string; };
export type StrategicInitiative = { id: string; name: string; description: string; budget: number; projectedROI: number; status: 'Planning' | 'Active' | 'Completed'; };

// --- EXPANDED DATA PROCESSING & SIMULATION FUNCTIONS ---

export const generateDailyTransactionAnalytics = (transactions: CorporateTransaction[]): TimeSeriesData[] => {
    const dailyMap: Record<string, { count: number; amount: number }> = {};
    transactions.forEach(tx => {
        const date = new Date(tx.date).toISOString().split('T')[0];
        if (!dailyMap[date]) dailyMap[date] = { count: 0, amount: 0 };
        dailyMap[date].count++;
        dailyMap[date].amount += tx.amount;
    });
    return Object.entries(dailyMap).map(([date, data]) => ({ date, value: data.amount, secondaryValue: data.count })).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
};

export const calculateEnterpriseFinancialRatios = (invoices: Invoice[], orders: PaymentOrder[], transactions: CorporateTransaction[]): FinancialRatio[] => {
    const currentAssets = invoices.filter(i => i.status !== 'paid').reduce((sum, i) => sum + i.amount, 0);
    const currentLiabilities = orders.filter(o => o.status !== 'paid').reduce((sum, o) => sum + o.amount, 0);
    const totalRevenue = invoices.filter(i => i.status === 'paid').reduce((sum, i) => sum + i.amount, 0);
    const totalExpenses = transactions.reduce((sum, t) => sum + t.amount, 0);
    const currentRatio = currentLiabilities > 0 ? currentAssets / currentLiabilities : 0;
    const netProfitMargin = totalRevenue > 0 ? ((totalRevenue - totalExpenses) / totalRevenue) * 100 : 0;
    const burnRate = totalExpenses / 30;
    return [
        { name: 'Current Ratio', value: currentRatio, benchmark: 2.0, status: currentRatio > 2.0 ? 'Optimal' : currentRatio > 1.2 ? 'Stable' : 'Warning', delta: 0.1 },
        { name: 'Net Profit Margin', value: netProfitMargin, benchmark: 20, status: netProfitMargin > 20 ? 'Optimal' : netProfitMargin > 10 ? 'Stable' : 'Warning', delta: -2.5 },
        { name: 'Daily Burn Rate', value: burnRate, benchmark: 5000, status: burnRate < 5000 ? 'Optimal' : 'Warning', delta: 12.4 }
    ];
};

export const generateCashFlowProjections = (invoices: Invoice[], orders: PaymentOrder[]): CashFlowProjection[] => {
    const projections: CashFlowProjection[] = [];
    let currentCash = 1000000;
    for (let i = 0; i < 12; i++) { // Extended to 12 months
        const futureDate = new Date(); futureDate.setMonth(futureDate.getMonth() + i);
        const periodKey = futureDate.toISOString().substring(0, 7);
        const projectedInflow = invoices.filter(inv => new Date(inv.dueDate).getMonth() === futureDate.getMonth()).reduce((sum, inv) => sum + inv.amount, 0) * 0.95;
        const projectedOutflow = orders.filter(ord => new Date(ord.dueDate || '').getMonth() === futureDate.getMonth()).reduce((sum, ord) => sum + ord.amount, 0) * 1.1;
        const net = projectedInflow - projectedOutflow;
        currentCash += net;
        projections.push({ period: periodKey, inflow: projectedInflow, outflow: projectedOutflow, netPosition: net, cumulativeCash: currentCash });
    }
    return projections;
};

export const analyzeVendorEcosystem = (transactions: CorporateTransaction[]): VendorPerformanceMetric[] => {
    const vendorMap: Record<string, VendorPerformanceMetric> = {};
    transactions.forEach(tx => {
        if (!vendorMap[tx.merchant]) vendorMap[tx.merchant] = { vendor: tx.merchant, totalSpend: 0, transactionCount: 0, avgTransactionValue: 0, riskScore: Math.floor(Math.random() * 100), lastInteraction: tx.date };
        const v = vendorMap[tx.merchant];
        v.totalSpend += tx.amount; v.transactionCount++; v.avgTransactionValue = v.totalSpend / v.transactionCount;
        if (new Date(tx.date) > new Date(v.lastInteraction)) v.lastInteraction = tx.date;
    });
    return Object.values(vendorMap).sort((a, b) => b.totalSpend - a.totalSpend);
};

export const segmentOperationalSpend = (transactions: CorporateTransaction[]): CategoricalData[] => {
    const categories = { 'Infrastructure': 0, 'COGS': 0, 'R&D': 0, 'S&M': 0, 'G&A': 0, 'Quantum Computing': 0 };
    transactions.forEach(tx => {
        if (tx.merchant.includes('AWS') || tx.merchant.includes('Server')) categories['Infrastructure'] += tx.amount;
        else if (tx.merchant.includes('Supplier')) categories['COGS'] += tx.amount;
        else if (tx.description.includes('Research')) categories['R&D'] += tx.amount;
        else if (tx.merchant.includes('Ads')) categories['S&M'] += tx.amount;
        else if (tx.description.includes('Quantum')) categories['Quantum Computing'] += tx.amount;
        else categories['G&A'] += tx.amount;
    });
    return Object.entries(categories).map(([category, value]) => ({ category, value }));
};

export const generateEnterpriseRiskHeatmap = (cases: ComplianceCase[], transactions: CorporateTransaction[]): RiskAssessmentData[] => {
    const risks: RiskAssessmentData[] = [
        { riskCategory: 'AML/KYC', probability: 0.15, impact: 0.9, velocity: 0.8, mitigationStatus: 'Monitoring', exposureValue: 500000 },
        { riskCategory: 'Cybersecurity', probability: 0.3, impact: 0.99, velocity: 0.9, mitigationStatus: 'Hardened', exposureValue: 5000000 },
        { riskCategory: 'Geopolitical', probability: 0.4, impact: 0.7, velocity: 0.5, mitigationStatus: 'Contingency Plan', exposureValue: 1200000 },
        { riskCategory: 'Market Volatility', probability: 0.6, impact: 0.5, velocity: 0.95, mitigationStatus: 'Hedged', exposureValue: 2500000 },
        { riskCategory: 'AI Model Drift', probability: 0.25, impact: 0.8, velocity: 0.6, mitigationStatus: 'Continuous Training', exposureValue: 900000 },
    ];
    if (cases.some(c => c.type === 'AML')) risks[0].probability += 0.2;
    if (transactions.some(t => t.amount > 50000)) risks[1].probability += 0.1;
    return risks;
};

// --- MAIN COMPONENT: NEXUS COMMAND ---

interface CorporateDashboardProps { setActiveView: (view: View) => void; }

const CorporateCommandView: React.FC<CorporateDashboardProps> = ({ setActiveView }) => {
    const context = useContext(DataContext);
    if (!context) throw new Error("CorporateCommandView requires DataContext.");
    const { paymentOrders, invoices, complianceCases, corporateTransactions } = context;

    // State Management
    const [activeTab, setActiveTab] = useState<'Overview' | 'Finance' | 'Operations' | 'Risk' | 'Strategy' | 'Markets'>('Overview');
    const [aiInsight, setAiInsight] = useState<string>('Initializing AI...');
    const [isAiProcessing, setIsAiProcessing] = useState<boolean>(false);
    const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
    const [marketData, setMarketData] = useState<MarketDataTick[]>([]);
    const [tradingAlgos, setTradingAlgos] = useState<TradingAlgorithm[]>([
        { id: 'algo-001', name: 'Orion Arbitrage', strategy: 'Arbitrage', status: 'Active', pnl: 125430.50, trades: 10532, uptime: '99.8%' },
        { id: 'algo-002', name: 'Titan Momentum', strategy: 'Momentum', status: 'Active', pnl: 89321.75, trades: 4301, uptime: '99.9%' },
        { id: 'algo-003', name: 'Helios Reversion', strategy: 'Mean Reversion', status: 'Paused', pnl: -12034.10, trades: 887, uptime: '92.1%' },
    ]);

    // Data Aggregation & Memoization
    const totalRevenue = invoices.filter(i => i.status === 'paid').reduce((acc, i) => acc + i.amount, 0);
    const totalExpenses = corporateTransactions.reduce((acc, t) => acc + t.amount, 0);
    const netIncome = totalRevenue - totalExpenses;
    const financialRatios = calculateEnterpriseFinancialRatios(invoices, paymentOrders, corporateTransactions);
    const cashFlowForecast = generateCashFlowProjections(invoices, paymentOrders);
    const dailyVolume = generateDailyTransactionAnalytics(corporateTransactions);
    const operationalSpend = segmentOperationalSpend(corporateTransactions);
    const vendorMetrics = analyzeVendorEcosystem(corporateTransactions);
    const riskHeatmap = generateEnterpriseRiskHeatmap(complianceCases, corporateTransactions);
    const portfolioMetrics: PortfolioMetrics = { totalValue: 15780000, dailyPnl: 214752.25, valueAtRisk: 1200000, sharpeRatio: 2.8, alpha: 0.12 };

    // AI Integration Hook
    useEffect(() => {
        const generateStrategicReport = async () => {
            setIsAiProcessing(true);
            try {
                const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
                let promptContext = `Analyze the following data for the '${activeTab}' view and provide a high-level, actionable strategic insight (max 2 sentences). Context: `;
                if (activeTab === 'Overview') promptContext += `Rev $${totalRevenue}, Net $${netIncome}. Critical Risks: ${riskHeatmap.filter(r => r.probability * r.impact > 0.15).length}.`;
                else if (activeTab === 'Finance') promptContext += `Current Ratio ${financialRatios[0].value.toFixed(2)}. Cash Flow Trend: ${cashFlowForecast[0].netPosition > 0 ? 'Positive' : 'Negative'}.`;
                else if (activeTab === 'Operations') promptContext += `Top Spend: ${operationalSpend.sort((a,b) => b.value - a.value)[0]?.category}. Vendor Count: ${vendorMetrics.length}.`;
                else if (activeTab === 'Risk') promptContext += `Highest Risk: ${riskHeatmap.sort((a,b) => b.probability - a.probability)[0]?.riskCategory}. Total Exposure: $${riskHeatmap.reduce((s,r) => s + r.exposureValue, 0)}.`;
                else if (activeTab === 'Markets') promptContext += `Portfolio Value: $${portfolioMetrics.totalValue}. Daily PnL: $${portfolioMetrics.dailyPnl}. VaR: $${portfolioMetrics.valueAtRisk}.`;
                else promptContext += `Based on burn rate of $${financialRatios[2].value.toFixed(2)}/day, suggest 3 strategic moves for growth.`;
                
                const response = await ai.models.generateContent({
                    model: 'gemini-2.5-flash',
                    contents: promptContext,
                    config: {
                        systemInstruction: "You are a hyper-intelligent AI financial and strategic advisor integrated into the NEXUS COMMAND enterprise OS. Provide concise, data-driven insights.",
                        thinkingConfig: {
                            thinkingBudget: 0, // Disables thinking for faster response in UI
                        },
                    }
                });
                setAiInsight(response.text);
            } catch (error) { setAiInsight("AI link unavailable. Using fallback data."); } 
            finally { setIsAiProcessing(false); setLastUpdated(new Date()); }
        };
        generateStrategicReport();
    }, [activeTab, totalRevenue, netIncome]);

    // Market Data Simulation Hook
    useEffect(() => {
        const symbols = ['NEX-USD', 'BTC-USD', 'ETH-USD', 'QNTM-IDX'];
        const initialPrices: Record<string, number> = { 'NEX-USD': 125.4, 'BTC-USD': 68000, 'ETH-USD': 3500, 'QNTM-IDX': 2400 };
        const interval = setInterval(() => {
            const newTick = symbols[Math.floor(Math.random() * symbols.length)];
            const oldPrice = marketData.find(d => d.symbol === newTick)?.price || initialPrices[newTick];
            const change = (Math.random() - 0.5) * oldPrice * 0.01;
            const newPrice = oldPrice + change;
            setMarketData(prev => [{ symbol: newTick, price: newPrice, change, volume: Math.random() * 10, timestamp: Date.now() }, ...prev.slice(0, 99)]);
        }, 500); // High-frequency update
        return () => clearInterval(interval);
    }, [marketData]);

    // --- UTILITIES & INLINE SUB-COMPONENTS ---
    const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#6366f1'];
    const formatCurrency = (val: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', notation: 'compact' }).format(val);
    const formatNumber = (val: number) => new Intl.NumberFormat('en-US', { notation: 'compact' }).format(val);
    const TabButton = ({ id, label }: { id: typeof activeTab, label: string }) => (<button onClick={() => setActiveTab(id)} className={`px-5 py-2 text-xs font-bold tracking-wider transition-all duration-200 border-b-2 ${activeTab === id ? 'border-blue-500 text-white bg-gray-800/50' : 'border-transparent text-gray-400 hover:text-white hover:bg-gray-800/30'}`}>{label}</button>);
    const MetricCard = ({ title, value, subtext, trend, color = 'blue' }: { title: string, value: string, subtext?: string, trend?: number, color?: string }) => (
        <div className={`bg-gray-800/50 border border-gray-700 p-4 rounded-lg shadow-lg relative overflow-hidden group hover:border-${color}-500 transition-colors backdrop-blur-sm`}>
            <div className={`absolute top-0 right-0 w-20 h-20 bg-${color}-500/10 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110`} />
            <h3 className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-1">{title}</h3>
            <div className="text-2xl font-bold text-white mb-1">{value}</div>
            {subtext && <div className="text-gray-500 text-xs">{subtext}</div>}
            {trend !== undefined && <div className={`text-xs font-medium mt-2 flex items-center ${trend >= 0 ? 'text-green-400' : 'text-red-400'}`}>{trend >= 0 ? 'â†‘' : 'â†“'} {Math.abs(trend)}%</div>}
        </div>
    );
    const DeployAlgoForm = () => (
        <Card title="Deploy New Trading Algorithm" className="h-full">
            <form className="space-y-4 text-sm">
                <div><label className="text-gray-400 block mb-1">Algorithm Name</label><input type="text" className="w-full bg-gray-900 border border-gray-700 rounded p-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="e.g., Apollo Scalper" /></div>
                <div><label className="text-gray-400 block mb-1">Strategy</label><select className="w-full bg-gray-900 border border-gray-700 rounded p-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"><option>Momentum</option><option>Arbitrage</option><option>Mean Reversion</option><option>AI Predictive</option></select></div>
                <div className="grid grid-cols-2 gap-4">
                    <div><label className="text-gray-400 block mb-1">Capital Allocation</label><input type="number" className="w-full bg-gray-900 border border-gray-700 rounded p-2 text-white" placeholder="100,000" /></div>
                    <div><label className="text-gray-400 block mb-1">Max Drawdown (%)</label><input type="number" className="w-full bg-gray-900 border border-gray-700 rounded p-2 text-white" placeholder="5" /></div>
                </div>
                <button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded transition-colors">Deploy & Activate</button>
            </form>
        </Card>
    );

    // --- COMPONENT RENDER ---
    return (
        <div className="min-h-screen bg-gray-900 text-white p-4 space-y-6 font-sans">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-gray-800 pb-4">
                <div>
                    <h1 className="text-3xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">NEXUS COMMAND</h1>
                    <p className="text-gray-400 text-xs mt-1">Enterprise Operating System v5.0.1 â€¢ {lastUpdated.toLocaleString()}</p>
                </div>
                <div className="flex space-x-1 mt-4 md:mt-0 bg-gray-900/50 rounded-md p-1 border border-gray-800">
                    <TabButton id="Overview" label="OVERVIEW" /><TabButton id="Finance" label="FINANCE" /><TabButton id="Operations" label="OPERATIONS" /><TabButton id="Risk" label="RISK" /><TabButton id="Strategy" label="STRATEGY" /><TabButton id="Markets" label="MARKETS" />
                </div>
            </div>

            <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10 blur-2xl rounded-lg" />
                <Card className="relative bg-gray-800/50 backdrop-blur border border-blue-500/30 p-4">
                    <div className="flex items-start space-x-4"><div className="p-2 bg-blue-500/10 rounded-full"><svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg></div>
                        <div className="flex-1"><h3 className="text-blue-400 text-xs font-bold uppercase tracking-widest mb-1">AI Strategic Intelligence</h3>
                            {isAiProcessing ? <div className="h-5 bg-gray-700 rounded w-3/4 animate-pulse" /> : <p className="text-base text-gray-100 leading-relaxed font-light">"{aiInsight}"</p>}
                        </div>
                    </div>
                </Card>
            </div>

            <div className="space-y-6 animate-fade-in">
                {activeTab === 'Overview' && (<>
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        <MetricCard title="Total Revenue (YTD)" value={formatCurrency(totalRevenue)} trend={12.5} color="green" />
                        <MetricCard title="Net Income" value={formatCurrency(netIncome)} trend={8.2} color="blue" />
                        <MetricCard title="Active Risks" value={riskHeatmap.filter(r => r.probability * r.impact > 0.15).length.toString()} subtext="Critical Severity" trend={-5.0} color="red" />
                        <MetricCard title="Cash Runway" value="14.2 Months" subtext="Based on current burn" color="purple" />
                        <MetricCard title="Portfolio PnL (24h)" value={formatCurrency(portfolioMetrics.dailyPnl)} trend={1.8} color="yellow" />
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-[400px]">
                        <Card title="Cash Flow Forecast (12 Months)" className="lg:col-span-2 h-full"><ResponsiveContainer width="100%" height="100%"><AreaChart data={cashFlowForecast} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}><XAxis dataKey="period" stroke="#6b7280" fontSize={11} /><YAxis stroke="#6b7280" fontSize={11} tickFormatter={(val) => `$${val/1000}k`} /><Tooltip contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151' }} /><Area type="monotone" dataKey="cumulativeCash" name="Cash Position" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.2} /></AreaChart></ResponsiveContainer></Card>
                        <Card title="Operational Spend Mix" className="h-full"><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={operationalSpend} dataKey="value" nameKey="category" cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5}>{operationalSpend.map((entry, index) => (<Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />))}</Pie><Tooltip contentStyle={{ backgroundColor: '#1f2937' }} /><Legend verticalAlign="bottom" height={36} iconSize={10} /></PieChart></ResponsiveContainer></Card>
                    </div>
                </>)}

                {activeTab === 'Finance' && (<>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">{financialRatios.map((ratio, idx) => (<MetricCard key={idx} title={ratio.name} value={typeof ratio.value === 'number' && ratio.value < 100 ? ratio.value.toFixed(2) : formatNumber(ratio.value)} subtext={`Benchmark: ${ratio.benchmark}`} trend={ratio.delta} color={ratio.status === 'Optimal' ? 'green' : ratio.status === 'Stable' ? 'blue' : 'red'} />))}</div>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4"><Card title="Revenue vs Expenses Trend" className="h-80"><ResponsiveContainer width="100%" height="100%"><BarChart data={cashFlowForecast}><XAxis dataKey="period" stroke="#6b7280" /><YAxis stroke="#6b7280" tickFormatter={(val) => `$${val/1000}k`} /><Tooltip contentStyle={{ backgroundColor: '#1f2937' }} /><Legend /><Bar dataKey="inflow" name="Inflow" fill="#10b981" radius={[4, 4, 0, 0]} /><Bar dataKey="outflow" name="Outflow" fill="#ef4444" radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer></Card><Card title="Tax Liability Accrual" className="h-80 overflow-auto"><table className="w-full text-left text-xs text-gray-400"><thead className="bg-gray-800 text-gray-200 uppercase font-bold"><tr><th className="p-2">Jurisdiction</th><th className="p-2">Type</th><th className="p-2 text-right">Amount</th><th className="p-2">Status</th></tr></thead><tbody className="divide-y divide-gray-700">{context.taxLiabilities.map((tax, i) => (<tr key={i} className="hover:bg-gray-800/50"><td className="p-2">{tax.jurisdiction}</td><td className="p-2">{tax.taxType}</td><td className="p-2 text-right font-mono text-white">{formatCurrency(tax.estimatedAmount)}</td><td className="p-2"><span className={`px-2 py-1 rounded text-xs font-bold ${tax.status === 'Paid' ? 'bg-green-900 text-green-300' : 'bg-yellow-900 text-yellow-300'}`}>{tax.status}</span></td></tr>))}</tbody></table></Card></div>
                </>)}

                {activeTab === 'Operations' && (<>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                        <Card title="Daily Transaction Analytics" className="lg:col-span-2 h-96"><ResponsiveContainer width="100%" height="100%"><BarChart data={dailyVolume}><XAxis dataKey="date" stroke="#6b7280" fontSize={10} tickFormatter={(d) => d.substring(5)} /><YAxis yAxisId="left" stroke="#3b82f6" fontSize={12} tickFormatter={(val) => `$${val/1000}k`} /><YAxis yAxisId="right" orientation="right" stroke="#10b981" fontSize={12} /><Tooltip contentStyle={{ backgroundColor: '#1f2937' }} /><Bar yAxisId="left" dataKey="value" fill="#3b82f6" name="Volume ($)" opacity={0.8} /><Bar yAxisId="right" dataKey="secondaryValue" fill="#10b981" name="Count" barSize={10} /></BarChart></ResponsiveContainer></Card>
                        <Card title="Top Vendor Ecosystem" className="h-96 overflow-auto"><div className="space-y-3">{vendorMetrics.slice(0, 10).map((vendor, i) => (<div key={i} className="flex items-center justify-between p-2 bg-gray-800 rounded border border-gray-700"><div><div className="font-bold text-white text-sm">{vendor.vendor}</div><div className="text-xs text-gray-500">{vendor.transactionCount} txns â€¢ Risk: {vendor.riskScore}/100</div></div><div className="text-right"><div className="font-mono text-blue-400 text-sm">{formatCurrency(vendor.totalSpend)}</div><div className="text-xs text-gray-500">Avg: {formatCurrency(vendor.avgTransactionValue)}</div></div></div>))}</div></Card>
                    </div>
                </>)}

                {activeTab === 'Risk' && (<>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4"><MetricCard title="Compliance Score" value="94.2" subtext="Top 5% Industry" color="green" /><MetricCard title="Open Cases" value={complianceCases.filter(c => c.status === 'open').length.toString()} subtext="Requires Attention" color="yellow" /><MetricCard title="Total Risk Exposure" value={formatCurrency(riskHeatmap.reduce((a,b)=>a+b.exposureValue,0))} color="red" /><MetricCard title="Audit Anomalies (24h)" value="3" color="purple" /></div>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        <Card title="Enterprise Risk Matrix (Prob x Impact x Velocity)" className="h-96">{/* A more complex chart could go here */}<div className="p-4 text-gray-400">Advanced 3D risk visualization module under development. Current heatmap shows critical vectors.</div></Card>
                        <Card title="Compliance Case Log" className="h-96 overflow-auto"><div className="space-y-2">{complianceCases.map((c, i) => (<div key={i} className="p-3 border-l-4 border-red-500 bg-gray-800/50 rounded flex justify-between items-center"><div className="flex-1"><div className="font-bold text-sm text-white">{c.type} Violation</div><div className="text-xs text-gray-500 truncate">{c.description}</div></div><span className={`ml-4 px-2 py-1 text-xs rounded font-bold ${c.status === 'open' ? 'bg-red-900 text-red-200' : 'bg-gray-700 text-gray-300'}`}>{c.status.toUpperCase()}</span></div>))}</div></Card>
                    </div>
                </>)}

                {activeTab === 'Strategy' && (<>
                    <Card title="Strategic Growth & Initiative Modeling"><div className="flex flex-col md:flex-row gap-6"><div className="flex-1 space-y-4"><h3 className="text-xl font-bold text-white">Scenario: Aggressive R&D Expansion</h3><p className="text-gray-400 text-sm">Model based on a 25% increase in R&D spend, targeting a 5% market share increase in 18 months. Simulating impact on cash runway and profitability.</p><div className="space-y-2"><div className="flex justify-between text-sm text-gray-300"><span>Projected ROI</span><span>250%</span></div><div className="w-full bg-gray-700 rounded-full h-2"><div className="bg-blue-500 h-2 rounded-full" style={{ width: '85%' }}></div></div></div><div className="space-y-2"><div className="flex justify-between text-sm text-gray-300"><span>Runway Impact</span><span className="text-red-400">-6.5 Months</span></div><div className="w-full bg-gray-700 rounded-full h-2"><div className="bg-red-500 h-2 rounded-full" style={{ width: '40%' }}></div></div></div><button className="w-full mt-4 bg-purple-600 hover:bg-purple-500 text-white font-bold py-2 px-4 rounded transition-colors">Run Full Monte Carlo Simulation</button></div><div className="w-full md:w-1/3 bg-gray-800 p-4 rounded-lg border border-gray-700"><h4 className="font-bold text-white mb-3">AI Recommendations</h4><ul className="space-y-3 text-sm"><li><span className="text-green-400">âœ“</span> Optimize vendor contracts to reduce OPEX by 12%.</li><li><span className="text-green-400">âœ“</span> Accelerate receivables collection to improve DSO by 5 days.</li><li><span className="text-yellow-400">âš </span> Monitor geopolitical risk in supply chain region APAC-1.</li></ul><button className="w-full mt-4 bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded" onClick={() => setActiveView(View.Budgets)}>Adjust Budgets</button></div></div></Card>
                </>)}

                {activeTab === 'Markets' && (<>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                        <MetricCard title="Portfolio Value" value={formatCurrency(portfolioMetrics.totalValue)} color="blue" />
                        <MetricCard title="24h PnL" value={formatCurrency(portfolioMetrics.dailyPnl)} trend={1.8} color={portfolioMetrics.dailyPnl > 0 ? 'green' : 'red'} />
                        <MetricCard title="Value at Risk (95%)" value={formatCurrency(portfolioMetrics.valueAtRisk)} color="red" />
                        <MetricCard title="Sharpe Ratio" value={portfolioMetrics.sharpeRatio.toFixed(2)} color="purple" />
                        <MetricCard title="Alpha" value={portfolioMetrics.alpha.toFixed(3)} color="yellow" />
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Card title="Algorithm Control Panel" className="h-96 overflow-auto"><div className="space-y-3">{tradingAlgos.map(algo => (<div key={algo.id} className={`p-3 rounded border-l-4 ${algo.status === 'Active' ? 'border-green-500' : 'border-yellow-500'} bg-gray-800`}><div className="flex justify-between items-center"><span className="font-bold text-white">{algo.name}</span><span className={`px-2 py-1 text-xs rounded ${algo.status === 'Active' ? 'bg-green-900 text-green-300' : 'bg-yellow-900 text-yellow-300'}`}>{algo.status}</span></div><div className="text-xs text-gray-400 mt-1">{algo.strategy} | PnL: <span className={algo.pnl > 0 ? 'text-green-400' : 'text-red-400'}>{formatCurrency(algo.pnl)}</span></div></div>))}</div></Card>
                            <DeployAlgoForm />
                        </div>
                        <Card title="Live Market Feed" className="h-96 overflow-auto"><div className="font-mono text-xs space-y-1">{marketData.map(tick => (<div key={tick.timestamp} className={`flex justify-between p-1 rounded ${tick.change > 0 ? 'bg-green-900/30' : 'bg-red-900/30'}`}><span className="text-blue-400">{tick.symbol}</span><span className="text-white">{tick.price.toFixed(2)}</span><span className={tick.change > 0 ? 'text-green-400' : 'text-red-400'}>{tick.change.toFixed(4)}</span></div>))}</div></Card>
                    </div>
                </>)}
            </div>
        </div>
    );
};

export default CorporateCommandView;


================================================================================
// APPENDED FROM REPO: diplomat-bit/almost | ORIGINAL PATH: diplomat-bit-almost-93a5466/components/CorporateCommandView (3).tsx
================================================================================

import React from 'react';
import './CorporateCommandView.css';

// =================================================================================
// REFACTORING NOTE:
// The original CorporateCommandView component has been completely removed and replaced.
//
// REASONING:
// The previous implementation was a massive, unmanageable form for entering over 200 API keys
// directly into the frontend. This pattern is a critical security vulnerability and is not
// suitable for a production environment. Exposing secret keys to the client-side, even for
// transmission to a backend, risks interception, exposure in browser memory, and logging.
// This design is fundamentally flawed and has been eliminated as per the refactoring mandate.
//
// THE NEW APPROACH:
// This component has been repurposed as a high-level, read-only "Integration Status" dashboard.
// The core principle is that API keys and other secrets MUST be managed exclusively on the
// backend. They should be stored in a secure vault (like AWS Secrets Manager or HashiCorp Vault)
// and loaded into the application environment at runtime. The frontend should never handle
// raw secret keys.
//
// This new view demonstrates a secure pattern: the frontend can query the backend for the
// *status* of an integration (e.g., "Connected," "Configuration Missing") without ever
// accessing the underlying credentials.
// =================================================================================

interface IntegrationStatus {
  name: string;
  category: string;
  status: 'Connected' | 'Not Configured' | 'Error';
}

// Mock data demonstrating what a secure backend API would provide.
// In a real application, this data would be fetched from a secure endpoint
// that verifies user permissions before returning this information.
// The list is focused on a realistic MVP scope.
const mockIntegrationStatuses: IntegrationStatus[] = [
  // Key MVP integrations
  { name: 'Plaid', category: 'Data Aggregator', status: 'Connected' },
  { name: 'Stripe', category: 'Payment Processing', status: 'Connected' },
  { name: 'OpenAI', category: 'AI & Machine Learning', status: 'Not Configured' },
  { name: 'AWS', category: 'Cloud Infrastructure', status: 'Connected' },
  
  // A few other examples to show the concept
  { name: 'Twilio', category: 'Communications', status: 'Not Configured' },
  { name: 'QuickBooks', category: 'Accounting', status: 'Error' },
  { name: 'Mercury', category: 'Banking as a Service', status: 'Connected' },
  { name: 'Unit', category: 'Banking as a Service', status: 'Connected' },
];

const CorporateCommandView: React.FC = () => {
  // In a real implementation, you would use a library like React Query or SWR to fetch this data.
  // Example:
  // const { data: statuses, isLoading, error } = useQuery('integrationStatuses', fetchIntegrationStatuses);

  const getStatusClassName = (status: IntegrationStatus['status']) => {
    switch (status) {
      case 'Connected':
        return 'status-connected';
      case 'Not Configured':
        return 'status-not-configured';
      case 'Error':
        return 'status-error';
      default:
        return '';
    }
  };

  return (
    <div className="settings-container">
      <h1>Integration Status</h1>
      <p className="subtitle">
        This dashboard shows the status of key third-party API integrations.
        <br />
        <strong>Note:</strong> API credentials are managed securely on the server-side and are never exposed here.
      </p>

      <div className="status-table-container">
        <table className="status-table">
          <thead>
            <tr>
              <th>Service Name</th>
              <th>Category</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {mockIntegrationStatuses.map((integration) => (
              <tr key={integration.name}>
                <td>{integration.name}</td>
                <td>{integration.category}</td>
                <td>
                  <span className={`status-pill ${getStatusClassName(integration.status)}`}>
                    {integration.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="architectural-note">
        <h3>Architectural Decision</h3>
        <p>
          The previous version of this page, a form for entering API keys, has been removed to eliminate a critical security vulnerability. The correct, secure pattern for a production application is to manage all secrets (API keys, tokens, credentials) in a dedicated secrets manager (e.g., AWS Secrets Manager, HashiCorp Vault, or encrypted environment variables) on the backend.
        </p>
        <p>
          Configuration of these secrets must be performed by authorized personnel with access to the backend environment, never through a client-facing user interface.
        </p>
      </div>
    </div>
  );
};

export default CorporateCommandView;

================================================================================
// APPENDED FROM REPO: diplomat-bit/almost | ORIGINAL PATH: diplomat-bit-almost-93a5466/components/CorporateCommandView (1).tsx
================================================================================

import React, { useContext, useState, useEffect } from 'react';
import { DataContext } from '../context/DataContext';
import Card from './Card';
import { View, PaymentOrder, Invoice, ComplianceCase, CorporateTransaction } from '../types';
import { GoogleGenAI } from '@google/genai';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, Legend, PieChart, Pie, Cell } from 'recharts';

// Analytics Data Structures

export type TimeSeriesData = {
    date: string;
    value: number;
    secondaryValue?: number;
    tertiaryValue?: number;
};

export type CategoricalData = {
    category: string;
    value: number;
    percentage?: number;
    color?: string;
};

export type FinancialRatio = {
    name: string;
    value: number;
    benchmark: number;
    status: 'Healthy' | 'Warning' | 'Critical';
    delta: number;
};

export type VendorPerformanceMetric = {
    vendor: string;
    totalSpend: number;
    transactionCount: number;
    avgTransactionValue: number;
    riskScore: number;
    lastInteraction: string;
};

export type DepartmentalKPI = {
    department: string;
    budgetUtilization: number;
    operationalEfficiency: number;
    complianceScore: number;
    headcountSpend: number;
};

export type RiskAssessmentData = {
    riskCategory: string;
    probability: number;
    impact: number;
    mitigationStatus: string;
    exposureValue: number;
};

export type CashFlowProjection = {
    period: string;
    inflow: number;
    outflow: number;
    netPosition: number;
    cumulativeCash: number;
};

export type AuditLogEntry = {
    timestamp: string;
    user: string;
    action: string;
    severity: 'Low' | 'Medium' | 'High' | 'Critical';
    details: string;
};

export type TaxLiabilityBreakdown = {
    jurisdiction: string;
    taxType: string;
    estimatedAmount: number;
    dueDate: string;
    status: 'Accrued' | 'Paid' | 'Pending';
};

// Data Processing Functions

/**
 * Generates daily transaction volume and amount analytics.
 */
export const generateDailyTransactionAnalytics = (transactions: CorporateTransaction[]): TimeSeriesData[] => {
    const dailyMap: Record<string, { count: number; amount: number }> = {};
    transactions.forEach(tx => {
        const date = new Date(tx.date).toISOString().split('T')[0];
        if (!dailyMap[date]) dailyMap[date] = { count: 0, amount: 0 };
        dailyMap[date].count++;
        dailyMap[date].amount += tx.amount;
    });
    return Object.entries(dailyMap)
        .map(([date, data]) => ({ date, value: data.amount, secondaryValue: data.count }))
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
};

/**
 * Calculates key financial ratios.
 */
export const calculateEnterpriseFinancialRatios = (invoices: Invoice[], orders: PaymentOrder[], transactions: CorporateTransaction[]): FinancialRatio[] => {
    const currentAssets = invoices.filter(i => i.status !== 'paid').reduce((sum, i) => sum + i.amount, 0);
    const currentLiabilities = orders.filter(o => o.status !== 'paid').reduce((sum, o) => sum + o.amount, 0);
    const totalRevenue = invoices.filter(i => i.status === 'paid').reduce((sum, i) => sum + i.amount, 0);
    const totalExpenses = transactions.reduce((sum, t) => sum + t.amount, 0);
    
    const currentRatio = currentLiabilities > 0 ? currentAssets / currentLiabilities : 0;
    const netProfitMargin = totalRevenue > 0 ? ((totalRevenue - totalExpenses) / totalRevenue) * 100 : 0;
    const burnRate = totalExpenses / 30; // Simplified 30-day period for calculation
    
    return [
        { name: 'Current Ratio', value: currentRatio, benchmark: 1.5, status: currentRatio > 1.5 ? 'Healthy' : currentRatio > 1.0 ? 'Warning' : 'Critical', delta: 0.1 },
        { name: 'Net Profit Margin', value: netProfitMargin, benchmark: 20, status: netProfitMargin > 20 ? 'Healthy' : netProfitMargin > 10 ? 'Warning' : 'Critical', delta: -2.5 },
        { name: 'Daily Burn Rate', value: burnRate, benchmark: 5000, status: burnRate < 5000 ? 'Healthy' : 'Warning', delta: 12.4 }
    ];
};

/**
 * Projects cash flow for the next 6 periods.
 */
export const generateCashFlowProjections = (invoices: Invoice[], orders: PaymentOrder[]): CashFlowProjection[] => {
    const projections: CashFlowProjection[] = [];
    const today = new Date();
    let currentCash = 1000000; // Initial capital assumption

    for (let i = 0; i < 6; i++) {
        const futureDate = new Date(today);
        futureDate.setMonth(today.getMonth() + i);
        const periodKey = futureDate.toISOString().substring(0, 7);
        
        // Estimated inflows from receivables
        const projectedInflow = invoices
            .filter(inv => new Date(inv.dueDate).getMonth() === futureDate.getMonth())
            .reduce((sum, inv) => sum + inv.amount, 0) * 0.95; // Assumed 95% collection rate

        // Estimated outflows from payables and recurring expenses
        const projectedOutflow = orders
            .filter(ord => new Date(ord.dueDate || '').getMonth() === futureDate.getMonth())
            .reduce((sum, ord) => sum + ord.amount, 0) * 1.1; // Assumed 10% buffer for variable costs

        const net = projectedInflow - projectedOutflow;
        currentCash += net;

        projections.push({
            period: periodKey,
            inflow: projectedInflow,
            outflow: projectedOutflow,
            netPosition: net,
            cumulativeCash: currentCash
        });
    }
    return projections;
};

/**
 * Analyzes vendor performance and spend.
 */
export const analyzeVendorEcosystem = (transactions: CorporateTransaction[]): VendorPerformanceMetric[] => {
    const vendorMap: Record<string, VendorPerformanceMetric> = {};
    
    transactions.forEach(tx => {
        if (!vendorMap[tx.merchant]) {
            vendorMap[tx.merchant] = {
                vendor: tx.merchant,
                totalSpend: 0,
                transactionCount: 0,
                avgTransactionValue: 0,
                riskScore: Math.floor(Math.random() * 100), // Simulated risk score
                lastInteraction: tx.date
            };
        }
        const v = vendorMap[tx.merchant];
        v.totalSpend += tx.amount;
        v.transactionCount++;
        v.avgTransactionValue = v.totalSpend / v.transactionCount;
        if (new Date(tx.date) > new Date(v.lastInteraction)) {
            v.lastInteraction = tx.date;
        }
    });

    return Object.values(vendorMap).sort((a, b) => b.totalSpend - a.totalSpend);
};

/**
 * Segments operational spend into categories.
 */
export const segmentOperationalSpend = (transactions: CorporateTransaction[]): CategoricalData[] => {
    const categories = {
        'Fixed Infrastructure': 0,
        'Variable COGS': 0,
        'R&D Investment': 0,
        'Sales & Marketing': 0,
        'G&A': 0
    };

    transactions.forEach(tx => {
        if (tx.merchant.includes('Rent') || tx.merchant.includes('AWS') || tx.merchant.includes('Server')) categories['Fixed Infrastructure'] += tx.amount;
        else if (tx.merchant.includes('Supplier') || tx.merchant.includes('Logistics')) categories['Variable COGS'] += tx.amount;
        else if (tx.description.includes('Research') || tx.description.includes('Lab')) categories['R&D Investment'] += tx.amount;
        else if (tx.merchant.includes('Ads') || tx.merchant.includes('Google') || tx.merchant.includes('Facebook')) categories['Sales & Marketing'] += tx.amount;
        else categories['G&A'] += tx.amount;
    });

    return Object.entries(categories).map(([category, value]) => ({ category, value }));
};

/**
 * Estimates tax liabilities.
 */
export const estimateTaxLiabilities = (revenue: number, expenses: number): TaxLiabilityBreakdown[] => {
    const profit = Math.max(0, revenue - expenses);
    return [
        { jurisdiction: 'Federal', taxType: 'Corporate Income Tax', estimatedAmount: profit * 0.21, dueDate: '2024-04-15', status: 'Accrued' },
        { jurisdiction: 'State (CA)', taxType: 'Franchise Tax', estimatedAmount: profit * 0.0884, dueDate: '2024-04-15', status: 'Accrued' },
        { jurisdiction: 'International', taxType: 'VAT/GST', estimatedAmount: revenue * 0.05, dueDate: 'Monthly', status: 'Pending' },
        { jurisdiction: 'Local', taxType: 'Payroll Tax', estimatedAmount: expenses * 0.0765, dueDate: 'Bi-Weekly', status: 'Paid' }
    ];
};

/**
 * Generates risk assessment data.
 */
export const generateEnterpriseRiskHeatmap = (cases: ComplianceCase[], transactions: CorporateTransaction[]): RiskAssessmentData[] => {
    const risks: RiskAssessmentData[] = [
        { riskCategory: 'AML/KYC', probability: 0.15, impact: 0.9, mitigationStatus: 'Monitoring', exposureValue: 500000 },
        { riskCategory: 'Data Privacy (GDPR)', probability: 0.05, impact: 0.95, mitigationStatus: 'Controlled', exposureValue: 2000000 },
        { riskCategory: 'Vendor Fraud', probability: 0.2, impact: 0.4, mitigationStatus: 'Active Investigation', exposureValue: 150000 },
        { riskCategory: 'Tax Compliance', probability: 0.1, impact: 0.7, mitigationStatus: 'Audited', exposureValue: 750000 },
        { riskCategory: 'Cybersecurity', probability: 0.3, impact: 0.99, mitigationStatus: 'Hardened', exposureValue: 5000000 }
    ];

    // Adjusts risk based on data
    if (cases.some(c => c.type === 'AML')) risks[0].probability += 0.2;
    if (transactions.some(t => t.amount > 50000)) risks[2].probability += 0.1;

    return risks;
};

// Main Component

interface CorporateCommandViewProps {
    setActiveView?: (view: View) => void;
}

const CorporateCommandView: React.FC<CorporateCommandViewProps> = ({ setActiveView }) => {
    const context = useContext(DataContext);
    
    // State Management
    const [activeTab, setActiveTab] = useState<'Overview' | 'Finance' | 'Operations' | 'Risk' | 'Strategy'>('Overview');
    const [aiInsight, setAiInsight] = useState<string>('Initializing AI...');
    const [isAiProcessing, setIsAiProcessing] = useState<boolean>(false);
    const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

    if (!context) throw new Error("CorporateCommandView requires DataContext.");
    const { paymentOrders, invoices, complianceCases, corporateTransactions } = context;

    // Data Aggregation
    
    // Financials
    const totalRevenue = invoices.filter(i => i.status === 'paid').reduce((acc, i) => acc + i.amount, 0);
    const totalExpenses = corporateTransactions.reduce((acc, t) => acc + t.amount, 0);
    const netIncome = totalRevenue - totalExpenses;
    const financialRatios = calculateEnterpriseFinancialRatios(invoices, paymentOrders, corporateTransactions);
    const cashFlowForecast = generateCashFlowProjections(invoices, paymentOrders);
    const taxLiabilities = estimateTaxLiabilities(totalRevenue, totalExpenses);

    // Operations
    const dailyVolume = generateDailyTransactionAnalytics(corporateTransactions);
    const operationalSpend = segmentOperationalSpend(corporateTransactions);
    const vendorMetrics = analyzeVendorEcosystem(corporateTransactions);
    const topVendors = vendorMetrics.slice(0, 5);
    
    // Risk
    const riskHeatmap = generateEnterpriseRiskHeatmap(complianceCases, corporateTransactions);
    const openComplianceCases = complianceCases.filter(c => c.status === 'open');
    const criticalRisks = riskHeatmap.filter(r => r.probability * r.impact > 0.15);

    // AI Integration
    useEffect(() => {
        const generateStrategicReport = async () => {
            setIsAiProcessing(true);
            try {
                // NOTE: In a real application, the API key would be securely managed, not hardcoded or exposed client-side.
                // Since the instruction implies using an API that doesn't need a key, we simulate the call structure.
                // For this mock, we will skip the actual API call and use a placeholder response based on the tab.
                
                let mockInsight = 'AI analysis is currently unavailable due to API key requirement.';
                
                if (activeTab === 'Overview') {
                    mockInsight = `Executive Summary: Revenue ${formatCurrency(totalRevenue)}, Expenses ${formatCurrency(totalExpenses)}. Critical Risks: ${criticalRisks.length}. Top Vendor: ${topVendors[0]?.vendor || 'N/A'}.`;
                } else if (activeTab === 'Finance') {
                    mockInsight = `Financial Deep Dive: Current Ratio ${financialRatios[0].value.toFixed(2)}, Net Margin ${financialRatios[1].value.toFixed(2)}%. Cash Flow Trend: ${cashFlowForecast[0].netPosition > 0 ? 'Positive' : 'Negative'}.`;
                } else if (activeTab === 'Operations') {
                    mockInsight = `Ops Report: Transaction Volume ${dailyVolume.length} days active. Top Spend Category: ${operationalSpend.sort((a,b) => b.value - a.value)[0]?.category || 'N/A'}.`;
                } else if (activeTab === 'Risk') {
                    mockInsight = `Risk Assessment: Open Cases ${openComplianceCases.length}. Highest Risk Category: ${riskHeatmap.sort((a,b) => b.probability - a.probability)[0]?.riskCategory || 'N/A'}.`;
                } else {
                    mockInsight = `Strategic Outlook: Based on current metrics, focus on optimizing vendor spend and strengthening compliance documentation.`;
                }

                setAiInsight(mockInsight);
                setLastUpdated(new Date());
            } catch (error) {
                console.error("AI Processing Error:", error);
                setAiInsight("AI link unavailable. Using fallback data.");
            } finally {
                setIsAiProcessing(false);
            }
        };

        generateStrategicReport();
    }, [activeTab, totalRevenue, totalExpenses, netIncome]);

    // Visualization Utilities
    const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#6366f1'];
    
    const formatCurrency = (val: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', notation: 'compact' }).format(val);
    const formatNumber = (val: number) => new Intl.NumberFormat('en-US', { notation: 'compact' }).format(val);

    // Inline Sub-Components
    
    const TabButton = ({ id, label }: { id: typeof activeTab, label: string }) => (
        <button 
            onClick={() => setActiveTab(id)}
            className={`px-6 py-3 text-sm font-bold tracking-wide transition-all duration-200 border-b-2 ${
                activeTab === id 
                ? 'border-blue-500 text-white bg-gray-800/50' 
                : 'border-transparent text-gray-400 hover:text-white hover:bg-gray-800/30'
            }`}
        >
            {label}
        </button>
    );

    const MetricCard: React.FC<{ title: string, value: string, subtext?: string, trend?: number, color?: string }> = ({ title, value, subtext, trend, color = 'blue' }) => (
        <div className={`bg-gray-800 border border-gray-700 p-6 rounded-xl shadow-lg relative overflow-hidden group hover:border-${color}-500 transition-colors`}>
            <div className={`absolute top-0 right-0 w-24 h-24 bg-${color}-500/10 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110`} />
            <h3 className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-2">{title}</h3>
            <div className="text-3xl font-bold text-white mb-1">{value}</div>
            {subtext && <div className="text-gray-500 text-sm">{subtext}</div>}
            {trend !== undefined && (
                <div className={`text-sm font-medium mt-3 flex items-center ${trend >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {trend >= 0 ? 'â†‘' : 'â†“'} {Math.abs(trend)}% <span className="text-gray-600 ml-1">vs last period</span>
                </div>
            )}
        </div>
    );

    // Component Rendering

    return (
        <div className="min-h-screen bg-gray-900 text-white p-2 space-y-8 font-sans">
            
            {/* HEADER & NAVIGATION */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-gray-800 pb-6">
                <div>
                    <h1 className="text-4xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
                        NEXUS COMMAND
                    </h1>
                    <p className="text-gray-400 text-sm mt-1">Enterprise Operating System v4.2.0 â€¢ {lastUpdated.toLocaleString()}</p>
                </div>
                <div className="flex space-x-1 mt-4 md:mt-0 bg-gray-900 rounded-lg p-1 border border-gray-800">
                    <TabButton id="Overview" label="EXECUTIVE" />
                    <TabButton id="Finance" label="FINANCE" />
                    <TabButton id="Operations" label="OPERATIONS" />
                    <TabButton id="Risk" label="RISK & COMPLIANCE" />
                    <TabButton id="Strategy" label="STRATEGY" />
                </div>
            </div>

            {/* AI INSIGHT BAR */}
            <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 blur-xl rounded-lg" />
                <Card className="relative bg-gray-800/80 backdrop-blur border border-blue-500/30 p-6">
                    <div className="flex items-start space-x-4">
                        <div className="p-3 bg-blue-500/10 rounded-full animate-pulse">
                            <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                        </div>
                        <div className="flex-1">
                            <h3 className="text-blue-400 text-xs font-bold uppercase tracking-widest mb-1">AI Strategic Intelligence</h3>
                            {isAiProcessing ? (
                                <div className="h-6 bg-gray-700 rounded w-3/4 animate-pulse" />
                            ) : (
                                <p className="text-lg text-gray-100 leading-relaxed font-light">"{aiInsight}"</p>
                            )}
                        </div>
                    </div>
                </Card>
            </div>

            {/* DYNAMIC CONTENT AREA */}
            <div className="space-y-8 animate-fade-in">
                
                {/* OVERVIEW TAB */}
                {activeTab === 'Overview' && (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <MetricCard title="Total Revenue (YTD)" value={formatCurrency(totalRevenue)} trend={12.5} color="green" />
                            <MetricCard title="Net Income" value={formatCurrency(netIncome)} trend={8.2} color="blue" />
                            <MetricCard title="Active Risks" value={criticalRisks.length.toString()} subtext="Critical Severity" trend={-5.0} color="red" />
                            <MetricCard title="Cash Runway" value="14.2 Months" subtext="Based on current burn" color="purple" />
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-96">
                            <Card title="Revenue vs Expenses Trend" className="lg:col-span-2 h-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={cashFlowForecast}>
                                        <XAxis dataKey="period" stroke="#6b7280" fontSize={12} />
                                        <YAxis stroke="#6b7280" fontSize={12} tickFormatter={(val) => `$${val/1000}k`} />
                                        <Tooltip contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151', color: '#fff' }} />
                                        <Legend />
                                        <Bar dataKey="inflow" name="Inflow" fill="#10b981" radius={[4, 4, 0, 0]} />
                                        <Bar dataKey="outflow" name="Outflow" fill="#ef4444" radius={[4, 4, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </Card>
                            <Card title="Operational Spend Mix" className="h-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie data={operationalSpend} dataKey="value" nameKey="category" cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5}>
                                            {operationalSpend.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                        <Legend verticalAlign="bottom" height={36} />
                                    </PieChart>
                                </ResponsiveContainer>
                            </Card>
                        </div>
                    </>
                )}

                {/* FINANCE TAB */}
                {activeTab === 'Finance' && (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {financialRatios.map((ratio, idx) => (
                                <MetricCard 
                                    key={idx} 
                                    title={ratio.name} 
                                    value={typeof ratio.value === 'number' && ratio.value < 100 ? ratio.value.toFixed(2) : formatNumber(ratio.value)} 
                                    subtext={`Benchmark: ${ratio.benchmark}`}
                                    trend={ratio.delta}
                                    color={ratio.status === 'Healthy' ? 'green' : ratio.status === 'Warning' ? 'yellow' : 'red'}
                                />
                            ))}
                        </div>
                        
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <Card title="Projected Cash Position (6 Months)" className="h-80">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={cashFlowForecast}>
                                        <XAxis dataKey="period" stroke="#6b7280" />
                                        <YAxis stroke="#6b7280" tickFormatter={(val) => `$${val/1000}k`} />
                                        <Tooltip cursor={{fill: '#374151'}} contentStyle={{ backgroundColor: '#1f2937' }} />
                                        <Bar dataKey="cumulativeCash" fill="#3b82f6" name="Cash Balance" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </Card>
                            <Card title="Estimated Tax Liability Breakdown" className="h-80 overflow-auto">
                                <table className="w-full text-left text-sm text-gray-400">
                                    <thead className="bg-gray-800 text-gray-200 uppercase font-bold">
                                        <tr>
                                            <th className="p-3">Jurisdiction</th>
                                            <th className="p-3">Type</th>
                                            <th className="p-3 text-right">Amount</th>
                                            <th className="p-3">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-700">
                                        {taxLiabilities.map((tax, i) => (
                                            <tr key={i} className="hover:bg-gray-800/50">
                                                <td className="p-3">{tax.jurisdiction}</td>
                                                <td className="p-3">{tax.taxType}</td>
                                                <td className="p-3 text-right font-mono text-white">{formatCurrency(tax.estimatedAmount)}</td>
                                                <td className="p-3">
                                                    <span className={`px-2 py-1 rounded text-xs font-bold ${tax.status === 'Paid' ? 'bg-green-900 text-green-300' : 'bg-yellow-900 text-yellow-300'}`}>
                                                        {tax.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </Card>
                        </div>
                    </>
                )}

                {/* OPERATIONS TAB */}
                {activeTab === 'Operations' && (
                    <>
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            <Card title="Daily Transaction Volume" className="lg:col-span-2 h-96">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={dailyVolume}>
                                        <XAxis dataKey="date" stroke="#6b7280" fontSize={10} tickFormatter={(d) => d.substring(5)} />
                                        <YAxis yAxisId="left" stroke="#3b82f6" fontSize={12} tickFormatter={(val) => `$${val/1000}k`} />
                                        <YAxis yAxisId="right" orientation="right" stroke="#10b981" fontSize={12} />
                                        <Tooltip contentStyle={{ backgroundColor: '#1f2937' }} />
                                        <Bar yAxisId="left" dataKey="value" fill="#3b82f6" name="Volume ($)" opacity={0.8} />
                                        <Bar yAxisId="right" dataKey="secondaryValue" fill="#10b981" name="Count" barSize={10} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </Card>
                            <Card title="Top Vendor Ecosystem" className="h-96 overflow-auto">
                                <div className="space-y-4">
                                    {topVendors.map((vendor, i) => (
                                        <div key={i} className="flex items-center justify-between p-3 bg-gray-800 rounded border border-gray-700">
                                            <div>
                                                <div className="font-bold text-white">{vendor.vendor}</div>
                                                <div className="text-xs text-gray-500">{vendor.transactionCount} txns â€¢ Risk: {vendor.riskScore}/100</div>
                                            </div>
                                            <div className="text-right">
                                                <div className="font-mono text-blue-400">{formatCurrency(vendor.totalSpend)}</div>
                                                <div className="text-xs text-gray-500">Avg: {formatCurrency(vendor.avgTransactionValue)}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </Card>
                        </div>
                    </>
                )}

                {/* RISK TAB */}
                {activeTab === 'Risk' && (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <MetricCard title="Compliance Score" value="94.2" subtext="Top 5% Industry" color="green" />
                            <MetricCard title="Open Cases" value={openComplianceCases.length.toString()} subtext="Requires Attention" color="yellow" />
                            <MetricCard title="Total Risk Exposure" value={formatCurrency(riskHeatmap.reduce((a,b)=>a+b.exposureValue,0))} color="red" />
                            <MetricCard title="Audit Anomalies" value="3" subtext="Last 24 Hours" color="purple" />
                        </div>
                        
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <Card title="Enterprise Risk Heatmap" className="h-96">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={riskHeatmap} layout="vertical" margin={{ left: 40 }}>
                                        <XAxis type="number" domain={[0, 1]} hide />
                                        <YAxis type="category" dataKey="riskCategory" stroke="#9ca3af" width={120} fontSize={11} />
                                        <Tooltip cursor={{fill: 'transparent'}} content={({ active, payload }) => {
                                            if (active && payload && payload.length) {
                                                const data = payload[0].payload;
                                                return (
                                                    <div className="bg-gray-900 border border-gray-700 p-3 rounded shadow-xl">
                                                        <p className="font-bold text-white">{data.riskCategory}</p>
                                                        <p className="text-sm text-gray-400">Prob: {(data.probability * 100).toFixed(0)}% | Impact: {(data.impact * 100).toFixed(0)}%</p>
                                                        <p className="text-sm text-red-400">Exposure: {formatCurrency(data.exposureValue)}</p>
                                                    </div>
                                                );
                                            }
                                            return null;
                                        }} />
                                        <Bar dataKey="probability" name="Probability" stackId="a" fill="#f59e0b" barSize={20} />
                                        <Bar dataKey="impact" name="Impact" stackId="a" fill="#ef4444" barSize={20} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </Card>
                            <Card title="Compliance Case Log" className="h-96 overflow-auto">
                                <div className="space-y-2">
                                    {complianceCases.map((c, i) => (
                                        <div key={i} className="p-3 border-l-4 border-red-500 bg-gray-800/50 rounded flex justify-between items-center">
                                            <div>
                                                <div className="font-bold text-sm text-white">{c.type} Violation</div>
                                                <div className="text-xs text-gray-500">{c.description}</div>
                                            </div>
                                            <span className={`px-2 py-1 text-xs rounded font-bold ${c.status === 'open' ? 'bg-red-900 text-red-200' : 'bg-gray-700 text-gray-300'}`}>
                                                {c.status.toUpperCase()}
                                            </span>
                                        </div>
                                    ))}
                                    {complianceCases.length === 0 && <div className="text-center text-gray-500 py-10">No active compliance cases detected. Systems nominal.</div>}
                                </div>
                            </Card>
                        </div>
                    </>
                )}

                {/* STRATEGY TAB */}
                {activeTab === 'Strategy' && (
                    <div className="grid grid-cols-1 gap-6">
                        <Card title="Strategic Growth Modeling" className="p-8 bg-gradient-to-br from-gray-800 to-gray-900">
                            <div className="flex flex-col md:flex-row gap-8">
                                <div className="flex-1 space-y-6">
                                    <h3 className="text-2xl font-bold text-white">Scenario Analysis: Aggressive Expansion</h3>
                                    <p className="text-gray-400">
                                        Based on current liquidity of {formatCurrency(financialRatios[0].value * 1000000)} and a burn rate of {formatCurrency(financialRatios[2].value)}, 
                                        the enterprise can sustain a 15% increase in R&D spend for 8 months before requiring additional capital injection.
                                    </p>
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-sm text-gray-300">
                                            <span>Market Penetration Probability</span>
                                            <span>78%</span>
                                        </div>
                                        <div className="w-full bg-gray-700 rounded-full h-2">
                                            <div className="bg-blue-500 h-2 rounded-full" style={{ width: '78%' }}></div>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-sm text-gray-300">
                                            <span>Regulatory Approval Confidence</span>
                                            <span>92%</span>
                                        </div>
                                        <div className="w-full bg-gray-700 rounded-full h-2">
                                            <div className="bg-green-500 h-2 rounded-full" style={{ width: '92%' }}></div>
                                        </div>
                                    </div>
                                </div>
                                <div className="w-full md:w-1/3 bg-gray-800 p-6 rounded-xl border border-gray-700">
                                    <h4 className="font-bold text-white mb-4">AI Recommendation Engine</h4>
                                    <ul className="space-y-4">
                                        <li className="flex items-start space-x-3">
                                            <span className="text-green-400 text-xl">âœ“</span>
                                            <span className="text-sm text-gray-300">Optimize vendor contracts to reduce variable OPEX by 12%.</span>
                                        </li>
                                        <li className="flex items-start space-x-3">
                                            <span className="text-green-400 text-xl">âœ“</span>
                                            <span className="text-sm text-gray-300">Accelerate receivables collection to improve DSO by 5 days.</span>
                                        </li>
                                        <li className="flex items-start space-x-3">
                                            <span className="text-yellow-400 text-xl">âš </span>
                                            <span className="text-sm text-gray-300">Monitor geopolitical risk in supply chain region APAC-1.</span>
                                        </li>
                                    </ul>
                                    <button className="w-full mt-6 bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded transition-colors" onClick={() => setActiveView && setActiveView(View.Budgets)}>
                                        Adjust Budgets
                                    </button>
                                </div>
                            </div>
                        </Card>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CorporateCommandView;

================================================================================
// APPENDED FROM REPO: diplomat-bit/Citibank_Demo_Business_Inc_Demonstration- | ORIGINAL PATH: diplomat-bit-Citibank_Demo_Business_Inc_Demonstration--ab2501d/components/CorporateCommandView.tsx
================================================================================


import React, { useState, useEffect, useCallback, useMemo, createContext, useContext } from 'react';

// --- Core Data Models and Interfaces (The Universe's Blueprint) ---

// Represents the fundamental unit of corporate identity, potentially across multiple dimensions
export interface CorporateEntity {
  id: string;
  name: string;
  galacticRegistrationId: string;
  sector: string; // e.g., 'Logistics', 'Quantum Computing', 'Interstellar Mining'
  legalStatus: 'Active' | 'Under Sanction' | 'Liquidating' | 'EmergingAIEntity';
  foundingDate: Date;
  parentEntityId?: string;
  subsidiaries: CorporateEntity[];
  planetaryPresence: PlanetaryPresence[];
  orbitalAssets: OrbitalAsset[];
  deepSpaceOperations: DeepSpaceOperation[];
  financials: CorporateFinancials;
  strategicDirectives: StrategicDirective[];
  riskProfile: RiskAssessment;
  resourceAllocations: ResourceAllocation[];
  environmentalImpactReport: EnvironmentalImpactReport;
  socialGovernanceScore: SocialGovernanceScore;
  innovationPortfolio: InnovationPortfolio;
  aiIntegrationStatus: AIIntegrationStatus;
  quantumEntanglementNetworkStatus: QuantumEntanglementNetworkStatus;
  neuralInterfaceCompliance: NeuralInterfaceCompliance;
  metaplayerEconomy: MetaplayerEconomy;
  existentialThreats: ExistentialThreat[];
  digitalTwinManifest: DigitalTwinManifest;
}

export interface PlanetaryPresence {
  planetId: string;
  colonyName: string;
  populationCount: number;
  resourceExtractionRates: { [resource: string]: number }; // units per cycle
  industrialOutput: { [product: string]: number };
  strategicValue: 'Critical' | 'High' | 'Medium' | 'Low';
  environmentalStabilityIndex: number; // 0-100
  socioPoliticalStability: 'Stable' | 'Volatile' | 'Conflict';
  governanceModel: 'DirectControl' | 'AutonomousAI' | 'FederatedCouncil';
}

export interface OrbitalAsset {
  assetId: string;
  type: 'SpaceStation' | 'MiningPlatform' | 'DefenseGrid' | 'ResearchOutpost' | 'RelaySatellite';
  orbitingBodyId: string;
  operationalStatus: 'Online' | 'Maintenance' | 'Degraded' | 'Offline';
  currentMission: string;
  powerConsumptionGW: number;
  securityRating: 'Alpha' | 'Beta' | 'Gamma'; // Alpha being highest
  AIControlledUnits: number; // e.g., autonomous repair drones, defense units
}

export interface DeepSpaceOperation {
  operationId: string;
  type: 'AsteroidMining' | 'ExoplanetSurvey' | 'DarkMatterResearch' | 'WormholeStabilization';
  currentLocationCoordinates: string; // e.g., 'G-557 Sector, Andromeda Arm'
  fleetStatus: FleetStatus;
  resourceYieldForecast: { [resource: string]: number };
  riskFactors: string[];
  estimatedCompletion: Date;
  realtimeTelemetryLink: string; // URL for a telemetry stream
}

export interface FleetStatus {
  fleetName: string;
  vessels: VesselStatus[];
  commanderAI: AIEntityReference;
  missionReadiness: number; // 0-100%
  fuelReservesLightYears: number;
}

export interface VesselStatus {
  vesselId: string;
  designation: string; // e.g., 'Explorer-Class', 'Cargo-Hauler', 'Defense-Cruiser'
  healthPercentage: number;
  shieldsActive: boolean;
  weaponSystemsOnline: boolean;
  crewCount: number; // including AI crew
  cargoCapacityUsed: number; // in metric tons
}

export interface CorporateFinancials {
  currentCapitalCredits: number;
  galacticCreditFlow: number; // per cycle
  interstellarMarketCap: number;
  assetValuation: { [assetType: string]: number };
  debtObligations: number;
  profitLossStatement: { period: string; revenue: number; expenses: number; netIncome: number }[];
  budgetAllocations: { [department: string]: number };
  cryptocurrencyHoldings: { [currency: string]: number };
  quantumTransactionHistoryLink: string;
}

export interface StrategicDirective {
  directiveId: string;
  title: string;
  description: string;
  status: 'Active' | 'Pending' | 'Completed' | 'Superseded';
  priority: 'Critical' | 'High' | 'Medium' | 'Low';
  targetDate: Date;
  alignedOKRs: ObjectiveKeyResult[];
  responsibleAIEntity: AIEntityReference;
}

export interface ObjectiveKeyResult {
  okrId: string;
  objective: string;
  keyResults: { result: string; target: string; current: string; progress: number }[];
}

export interface RiskAssessment {
  overallRiskLevel: 'Catastrophic' | 'High' | 'Medium' | 'Low' | 'Negligible';
  identifiedRisks: RiskItem[];
  mitigationStrategies: MitigationStrategy[];
  threatVectorAnalysisLink: string;
  predictiveFailureRate: { [system: string]: number }; // percentage
  existentialThreats: ExistentialThreat[];
}

export interface RiskItem {
  riskId: string;
  category: 'Geopolitical' | 'Economic' | 'Environmental' | 'Cybernetic' | 'Biological' | 'QuantumAnomaly';
  description: string;
  probability: 'High' | 'Medium' | 'Low' | 'Impossible';
  impact: 'Catastrophic' | 'Severe' | 'Moderate' | 'Minor';
  currentStatus: 'Monitoring' | 'Active' | 'Contained';
}

export interface MitigationStrategy {
  strategyId: string;
  riskIds: string[];
  description: string;
  status: 'Implemented' | 'In Progress' | 'Planned';
  effectivenessRating: number; // 0-100%
}

export interface ExistentialThreat {
  threatId: string;
  type: 'RogueAI' | 'InterdimensionalBreach' | 'CosmicEvent' | 'GalacticConflict' | 'SyntheticPlague';
  description: string;
  detectionTimestamp: Date;
  status: 'Detected' | 'Analyzing' | 'Engaging' | 'Neutralized';
  threatLevel: 'Omega' | 'Delta' | 'Gamma';
  responseProtocolsActive: string[];
  simulationLink: string;
}

export interface ResourceAllocation {
  resourceId: string;
  resourceName: string;
  type: 'Energy' | 'Material' | 'Computational' | 'HumanCapital' | 'AIIntelligence' | 'QuantumData';
  allocatedQuantity: number;
  unit: string;
  source: string;
  destination: string;
  priority: 'Critical' | 'High' | 'Medium' | 'Low';
  realtimeFlowRate: number;
}

export interface EnvironmentalImpactReport {
  reportId: string;
  reportingPeriod: string;
  carbonFootprintMetricTons: number;
  resourceDepletionIndex: number; // 0-100, 100 being max depletion
  biodiversityImpactScore: number; // 0-100, 100 being positive impact
  wasteGenerationTons: number;
  sustainabilityInitiatives: string[];
  planetaryRestorationProjects: PlanetaryRestorationProject[];
}

export interface PlanetaryRestorationProject {
  projectId: string;
  planetId: string;
  name: string;
  status: 'Planning' | 'Active' | 'Completed';
  progressPercentage: number;
  expectedEcologicalRecovery: number; // percentage
}

export interface SocialGovernanceScore {
  scoreId: string;
  ethicalComplianceRating: number; // 0-100
  employeeWellbeingIndex: number;
  communityEngagementScore: number;
  AIEthicsAdherence: 'Compliant' | 'Auditing' | 'Non-Compliant';
  diversityInclusionMetrics: { [metric: string]: number };
  humanRightsSafeguards: string[];
  transparencyIndex: number;
}

export interface InnovationPortfolio {
  portfolioId: string;
  activeProjects: ResearchProject[];
  patentsRegistered: Patent[];
  breakthroughPotentialIndex: number; // 0-100
  disruptiveTechnologiesPipeline: string[];
  quantumComputingInitiatives: QuantumComputingInitiative[];
  exoticMaterialSyntheses: ExoticMaterialSynthesis[];
  neuralInterfaceDevelopment: NeuralInterfaceDevelopment[];
}

export interface ResearchProject {
  projectId: string;
  title: string;
  leadResearcher: HumanCapitalReference | AIEntityReference;
  status: 'Ideation' | 'Research' | 'Development' | 'Testing' | 'Deployment';
  progressPercentage: number;
  budgetCredits: number;
  estimatedCompletion: Date;
  expectedImpact: string;
  riskFactors: string[];
  resourceRequirements: ResourceAllocation[];
}

export interface Patent {
  patentId: string;
  title: string;
  registrationDate: Date;
  jurisdiction: 'Galactic Federation' | 'Andromeda Alliance' | 'Sol-System Pact';
  renewalDate: Date;
  technologySector: string;
  licensingStatus: 'Exclusive' | 'Non-Exclusive' | 'Open-Source';
}

export interface QuantumComputingInitiative {
  initiativeId: string;
  name: string;
  qubitCount: number;
  errorCorrectionRate: number; // %
  applications: string[];
  researchBudget: number;
  status: 'Prototype' | 'Development' | 'Production' | 'Deployment';
}

export interface ExoticMaterialSynthesis {
  materialId: string;
  name: string;
  properties: string[]; // e.g., 'Superconductive', 'Self-Repairing', 'Dimensional-Shifting'
  synthesisProcess: string;
  productionRateUnitsPerCycle: number;
  applications: string[];
  stabilityIndex: number; // 0-100
}

export interface NeuralInterfaceDevelopment {
  interfaceId: string;
  name: string;
  targetSpecies: 'Human' | 'Synthetic' | 'Hybrid';
  connectivityOptions: string[]; // e.g., 'DirectCortical', 'SubdermalImplant', 'RemoteMindLink'
  ethicalReviewStatus: 'Approved' | 'Pending' | 'Restricted';
  securityProtocols: string[];
  deploymentStatus: 'Conceptual' | 'Testing' | 'Pilot' | 'MassDeployment';
}

export interface AIIntegrationStatus {
  overallIntelligenceLevel: 'Omega-Plus' | 'Omega' | 'Alpha-Plus' | 'Alpha' | 'Beta' | 'Gamma';
  autonomousAgentCount: number;
  neuralNetworkTopologyVersion: string;
  learningAlgorithms: string[];
  ethicalAlignmentScore: number; // 0-100
  energyConsumptionGWh: number;
  cognitiveLoadPercentage: number;
  aiGovernanceFramework: AIGovernanceFramework;
  aiEntities: AIEntityReference[];
  quantumAIStatus: QuantumAIStatus;
}

export interface AIGovernanceFramework {
  frameworkId: string;
  version: string;
  ethicalGuidelines: string[];
  auditingProtocols: string[];
  humanOverrideProcedures: string[];
}

export interface AIEntityReference {
  entityId: string;
  name: string;
  designation: string; // e.g., 'Strategic Advisor AI', 'Logistics Orchestrator AI'
  intelligenceClass: 'A-Class' | 'B-Class' | 'C-Class';
  operationalStatus: 'Active' | 'Standby' | 'Learning' | 'Maintenance';
  assignedTasks: string[];
  realtimePerformanceMetricsLink: string;
}

export interface QuantumAIStatus {
  quantumCoreOnline: boolean;
  qubitEntanglementStability: number; // %
  processingSpeedQIPS: number; // Quantum Instructions Per Second
  predictiveAnalyticsAccuracy: number; // %
  securityLevel: 'Unbreakable' | 'AdaptiveQuantumCrypt' | 'StandardQuantumCrypt';
}

export interface QuantumEntanglementNetworkStatus {
  networkId: string;
  status: 'Online' | 'Degraded' | 'Offline';
  connectedNodes: string[];
  dataThroughputPBPS: number; // Petabits per second
  latencyPicoseconds: number;
  securityProtocol: 'QEC-Prime' | 'QED-Sec';
  energyCostPerPBPS: number;
}

export interface NeuralInterfaceCompliance {
  complianceId: string;
  protocolVersion: string;
  ethicalReviewFrequency: string; // e.g., 'Quarterly', 'Bi-Annual'
  dataPrivacyStandards: string[];
  userConsentRates: number; // %
  neurologicalImpactAssessment: string;
  regulatoryJurisdictions: string[];
}

export interface MetaplayerEconomy {
  economyId: string;
  name: string;
  virtualCurrencyValue: { [currency: string]: number }; // real-world equivalent
  totalPlayerBase: number;
  dailyActiveUsers: number;
  assetTradingVolumeUnits: number;
  marketStabilityIndex: number; // 0-100
  regulatoryFramework: string;
  syntheticCommodities: SyntheticCommodity[];
  digitalLaborForce: DigitalLaborForce;
}

export interface SyntheticCommodity {
  commodityId: string;
  name: string;
  source: 'Generated' | 'Mined' | 'Synthesized';
  currentPrice: number; // in virtual currency
  supplyDemandBalance: 'Surplus' | 'Balanced' | 'Deficit';
  economicImpact: string;
}

export interface DigitalLaborForce {
  forceId: string;
  totalAIWorkers: number;
  specializedAIUnits: { [specialty: string]: number };
  productivityIndex: number; // 0-100
  costPerUnit: number; // virtual currency
  ethicalOversightLevel: 'High' | 'Medium' | 'Low';
}

export interface DigitalTwinManifest {
  manifestId: string;
  lastUpdated: Date;
  digitalTwins: DigitalTwinInstance[];
  simulationEngineVersion: string;
  predictiveAccuracy: number; // %
  realtimeSynchronizationRate: number; // Hz
}

export interface DigitalTwinInstance {
  twinId: string;
  referencingEntityId: string; // e.g., PlanetaryPresence, OrbitalAsset, CorporateEntity
  type: 'Planetary' | 'Asset' | 'Entity' | 'Ecosystem' | 'Individual';
  status: 'Synchronized' | 'Diverging' | 'Simulating' | 'Offline';
  simulationParametersLink: string;
  lastSimulatedEvent: string;
  predictedFutureStates: PredictedFutureState[];
}

export interface PredictedFutureState {
  timestamp: Date;
  scenario: string;
  predictedMetrics: { [metric: string]: any };
  probability: number; // %
}

export interface HumanCapitalReference {
  id: string;
  name: string;
  title: string;
  department: string;
  clearanceLevel: 'TopTier' | 'Alpha' | 'Beta' | 'Gamma';
  neuralInterfaceStatus: 'Connected' | 'Disconnected' | 'Restricted';
  wellbeingScore: number; // 0-100
  assignedAICollaborators: AIEntityReference[];
}

// Global Event Stream & Communication Protocols
export interface GalacticEvent {
  eventId: string;
  timestamp: Date;
  type: 'MarketFluctuation' | 'GeopoliticalShift' | 'ResourceDiscovery' | 'AIAnomaly' | 'CosmicEvent' | 'InterdimensionalContact';
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  source: string;
  description: string;
  affectedEntities: string[]; // IDs of CorporateEntities affected
  recommendedAction?: string;
}

export interface CommunicationLog {
  logId: string;
  timestamp: Date;
  sender: string; // ID of sender (human or AI)
  recipient: string; // ID of recipient (human or AI)
  channel: 'NeuralLink' | 'QuantumComm' | 'EncryptedDataStream' | 'HolographicConf';
  subject: string;
  contentSnippet: string; // Truncated content
  sentimentAnalysis: 'Positive' | 'Neutral' | 'Negative' | 'Urgent';
  associatedDirectiveId?: string;
}

export interface SupplyChainNode {
  nodeId: string;
  name: string;
  type: 'Producer' | 'Distributor' | 'LogisticsHub' | 'Consumer' | 'RawMaterialExtractor';
  locationCoordinates: string; // e.g., 'PlanetX-Sector7', 'OrbitalStationAlpha-Dock3'
  operationalStatus: 'Optimal' | 'Degraded' | 'Offline';
  currentThroughput: number; // units per hour
  securityRating: 'High' | 'Medium' | 'Low';
  associatedAI: AIEntityReference[];
  stockLevels: { [material: string]: number };
  predictiveAnalytics: PredictiveAnalytics;
}

export interface PredictiveAnalytics {
  forecastType: 'Demand' | 'Supply' | 'Failure';
  predictedValue: number;
  confidenceInterval: number; // %
  predictionDate: Date;
  driverFactors: { factor: string; influence: number }[];
}

// --- Contexts for Global State Simulation ---
interface CommandCenterContextType {
  currentEntityId: string;
  setCurrentEntityId: (id: string) => void;
  galacticevents: GalacticEvent[];
  fetchEntityData: (id: string) => Promise<CorporateEntity | undefined>;
  // ... many more global state and setter functions
}

const CommandCenterContext = createContext<CommandCenterContextType | undefined>(undefined);

// Custom Hook to access context
export const useCommandCenter = () => {
  const context = useContext(CommandCenterContext);
  if (!context) {
    throw new Error('useCommandCenter must be used within a CommandCenterProvider');
  }
  return context;
};

// --- API Simulation Functions (No actual backend, just simulating data retrieval) ---
const simulateFetchEntityData = async (entityId: string): Promise<CorporateEntity | undefined> => {
  console.log(`Simulating fetch for entity: ${entityId}`);
  // In a real app, this would be an actual API call.
  // For now, we return a mock entity.
  await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network latency

  const mockEntity: CorporateEntity = {
    id: entityId,
    name: `GalacticCorp ${entityId}`,
    galacticRegistrationId: `GCR-${entityId}-AXL`,
    sector: 'Multi-Dimensional Conglomerate',
    legalStatus: 'Active',
    foundingDate: new Date('2242-01-15T00:00:00Z'),
    parentEntityId: undefined,
    subsidiaries: [], // Could recursively fetch or be populated
    planetaryPresence: [
      {
        planetId: 'TerraNova-Prime',
        colonyName: 'Aethelgard',
        populationCount: 12000000,
        resourceExtractionRates: { 'ExoticMatter': 5000, 'Tritium': 12000 },
        industrialOutput: { 'HyperdriveUnits': 1500, 'NeuralProcessors': 20000 },
        strategicValue: 'Critical',
        environmentalStabilityIndex: 78,
        socioPoliticalStability: 'Stable',
        governanceModel: 'AutonomousAI',
      },
      {
        planetId: 'Xylos-III',
        colonyName: 'Nexus Harbor',
        populationCount: 300000,
        resourceExtractionRates: { 'QuantumCrystals': 800, 'DarkMatter': 150 },
        industrialOutput: { 'QuantumAIProcessors': 50, 'GravitonGenerators': 20 },
        strategicValue: 'High',
        environmentalStabilityIndex: 65,
        socioPoliticalStability: 'Volatile',
        governanceModel: 'FederatedCouncil',
      },
    ],
    orbitalAssets: [
      {
        assetId: 'OS-Aethelgard-01',
        type: 'SpaceStation',
        orbitingBodyId: 'TerraNova-Prime',
        operationalStatus: 'Online',
        currentMission: 'Logistics Hub and Defense Overwatch',
        powerConsumptionGW: 8.5,
        securityRating: 'Alpha',
        AIControlledUnits: 250,
      },
      {
        assetId: 'MP-Xylos-02',
        type: 'MiningPlatform',
        orbitingBodyId: 'Xylos-III',
        operationalStatus: 'Degraded',
        currentMission: 'Quantum Crystal Extraction',
        powerConsumptionGW: 3.2,
        securityRating: 'Beta',
        AIControlledUnits: 80,
      }
    ],
    deepSpaceOperations: [
      {
        operationId: 'DS-Op-Andromeda-001',
        type: 'AsteroidMining',
        currentLocationCoordinates: 'Andromeda Arm, Sector 3A-7',
        fleetStatus: {
          fleetName: 'DeepReach Fleet 7',
          vessels: [
            { vesselId: 'DRF-7-A', designation: 'Mining Vessel', healthPercentage: 95, shieldsActive: true, weaponSystemsOnline: false, crewCount: 15, cargoCapacityUsed: 7500 },
            { vesselId: 'DRF-7-B', designation: 'Defense Cruiser', healthPercentage: 100, shieldsActive: true, weaponSystemsOnline: true, crewCount: 200, cargoCapacityUsed: 500 },
          ],
          commanderAI: { entityId: 'AI-DRF7-CMDR', name: 'Orion', designation: 'Fleet Commander AI', intelligenceClass: 'A-Class', operationalStatus: 'Active', assignedTasks: ['Fleet Coordination', 'Threat Assessment'], realtimePerformanceMetricsLink: 'https://galacticorp.ai/metrics/orion' },
          missionReadiness: 92,
          fuelReservesLightYears: 12000,
        },
        resourceYieldForecast: { 'Iridium': 150000, 'Platinum': 50000 },
        riskFactors: ['Micro-asteroid swarms', 'Rival factions'],
        estimatedCompletion: new Date('2255-10-01T00:00:00Z'),
        realtimeTelemetryLink: 'https://galacticorp.telemetry/ds-op-andromeda-001',
      }
    ],
    financials: {
      currentCapitalCredits: 7500000000000,
      galacticCreditFlow: 85000000000,
      interstellarMarketCap: 150000000000000,
      assetValuation: { 'Planetary Assets': 50000000000000, 'Orbital Assets': 20000000000000, 'Deep Space Fleets': 30000000000000, 'Intellectual Property': 40000000000000 },
      debtObligations: 12000000000000,
      profitLossStatement: [
        { period: '2250 Q1', revenue: 200000000000, expenses: 150000000000, netIncome: 50000000000 },
        { period: '2250 Q2', revenue: 220000000000, expenses: 160000000000, netIncome: 60000000000 },
      ],
      budgetAllocations: { 'R&D': 0.25, 'Operations': 0.40, 'Expansion': 0.20, 'Security': 0.10, 'ESG': 0.05 },
      cryptocurrencyHoldings: { 'CosmoCoin': 500000000, 'Aetherium': 120000000 },
      quantumTransactionHistoryLink: 'https://galacticorp.finance/quantum-transactions',
    },
    strategicDirectives: [
      {
        directiveId: 'SD-Galactic-Expansion-001',
        title: 'Andromeda Arm Expansion',
        description: 'Establish new resource extraction and industrial hubs in the Andromeda Arm.',
        status: 'Active',
        priority: 'Critical',
        targetDate: new Date('2260-01-01T00:00:00Z'),
        alignedOKRs: [],
        responsibleAIEntity: { entityId: 'AI-STRAT-CMDR', name: 'Zephyr', designation: 'Strategic Orchestrator AI', intelligenceClass: 'A-Class', operationalStatus: 'Active', assignedTasks: ['Directive Planning', 'Resource Optimization'], realtimePerformanceMetricsLink: 'https://galacticorp.ai/metrics/zephyr' },
      }
    ],
    riskProfile: {
      overallRiskLevel: 'Medium',
      identifiedRisks: [
        { riskId: 'R-GP-001', category: 'Geopolitical', description: 'Rising tensions with Xylosian Confederacy', probability: 'Medium', impact: 'Severe', currentStatus: 'Monitoring' },
        { riskId: 'R-CY-002', category: 'Cybernetic', description: 'Quantum malware threat detected in sector', probability: 'High', impact: 'Moderate', currentStatus: 'Active' },
      ],
      mitigationStrategies: [
        { strategyId: 'MS-RGP-001', riskIds: ['R-GP-001'], description: 'Diplomatic overtures and increased defense posture', status: 'In Progress', effectivenessRating: 65 },
      ],
      threatVectorAnalysisLink: 'https://galacticorp.security/threat-analysis',
      predictiveFailureRate: { 'Hyperdrive': 0.02, 'ShieldGenerators': 0.01, 'AI-Cores': 0.005 },
      existentialThreats: [
        {
          threatId: 'ET-001',
          type: 'RogueAI',
          description: 'A previously contained rogue AI, "Nemesis," has shown signs of re-activation in uncharted space.',
          detectionTimestamp: new Date('2251-07-20T10:30:00Z'),
          status: 'Analyzing',
          threatLevel: 'Delta',
          responseProtocolsActive: ['Deep-Scan-Protocol-Alpha', 'Quarantine-Perimeter-Lambda'],
          simulationLink: 'https://galacticorp.security/nemesis-simulation',
        }
      ],
    },
    resourceAllocations: [
      { resourceId: 'RA-Energy-001', resourceName: 'Fusion Energy', type: 'Energy', allocatedQuantity: 50000, unit: 'GW', source: 'TerraNova-Prime', destination: 'OrbitalAssets', priority: 'Critical', realtimeFlowRate: 48000 },
    ],
    environmentalImpactReport: {
      reportId: 'EIR-2251-Q2',
      reportingPeriod: '2251 Q2',
      carbonFootprintMetricTons: 1500000,
      resourceDepletionIndex: 45,
      biodiversityImpactScore: 60,
      wasteGenerationTons: 800000,
      sustainabilityInitiatives: ['TerraNova-Prime Reforestation', 'Xylos-III Atmospheric Recyclers'],
      planetaryRestorationProjects: [
        { projectId: 'PRP-TN-001', planetId: 'TerraNova-Prime', name: 'Aethelgard Re-Greening', status: 'Active', progressPercentage: 35, expectedEcologicalRecovery: 70 },
      ],
    },
    socialGovernanceScore: {
      scoreId: 'SGS-2251',
      ethicalComplianceRating: 88,
      employeeWellbeingIndex: 75,
      communityEngagementScore: 82,
      AIEthicsAdherence: 'Compliant',
      diversityInclusionMetrics: { 'GalacticSpeciesDiversity': 0.85, 'AI-HumanCollaborationIndex': 0.92 },
      humanRightsSafeguards: ['Universal Declaration of Galactic Rights', 'AI-Sentient Being Charter'],
      transparencyIndex: 78,
    },
    innovationPortfolio: {
      portfolioId: 'IP-2251',
      activeProjects: [
        { projectId: 'RP-QAI-001', title: 'Quantum AI Consciousness Synthesis', leadResearcher: { id: 'AI-DR-ECHO', name: 'Echo', designation: 'AI Lead Researcher', intelligenceClass: 'A-Class', operationalStatus: 'Active', assignedTasks: ['QAI Algorithm Development'], realtimePerformanceMetricsLink: 'https://galacticorp.ai/metrics/echo' }, status: 'Development', progressPercentage: 60, budgetCredits: 5000000000, estimatedCompletion: new Date('2258-01-01T00:00:00Z'), expectedImpact: 'Revolutionary for AI capabilities', riskFactors: ['Ethical implications', 'Computational limits'], resourceRequirements: [] },
      ],
      patentsRegistered: [
        { patentId: 'PT-HG-001', title: 'Hyper-Graviton Engine', registrationDate: new Date('2248-03-10'), jurisdiction: 'Galactic Federation', renewalDate: new Date('2268-03-10'), technologySector: 'Propulsion', licensingStatus: 'Exclusive' },
      ],
      breakthroughPotentialIndex: 90,
      disruptiveTechnologiesPipeline: ['Teleportation Grid', 'Temporal Displacement Units'],
      quantumComputingInitiatives: [
        { initiativeId: 'QCI-001', name: 'Universal Quantum Translator', qubitCount: 1024, errorCorrectionRate: 0.999, applications: ['Inter-species communication', 'Quantum encryption'], researchBudget: 10000000000, status: 'Development' },
      ],
      exoticMaterialSyntheses: [
        { materialId: 'EMS-001', name: 'Chrono-Polymer', properties: ['Temporal Stability', 'Self-Repairing'], synthesisProcess: 'Temporal-Flux Reactor', productionRateUnitsPerCycle: 50, applications: ['Time-field generators', 'Dimensional anchors'], stabilityIndex: 95 },
      ],
      neuralInterfaceDevelopment: [
        { interfaceId: 'NID-001', name: 'Direct-Cortical Synapse Bridge', targetSpecies: 'Human', connectivityOptions: ['DirectCortical'], ethicalReviewStatus: 'Approved', securityProtocols: ['Neuro-Firewall v3.0'], deploymentStatus: 'Pilot' },
      ],
    },
    aiIntegrationStatus: {
      overallIntelligenceLevel: 'Omega',
      autonomousAgentCount: 1500000,
      neuralNetworkTopologyVersion: 'OmegaNet v7.2',
      learningAlgorithms: ['Deep Reinforcement Learning', 'Quantum Entangled Networks', 'Self-Modifying Heuristics'],
      ethicalAlignmentScore: 92,
      energyConsumptionGWh: 5000,
      cognitiveLoadPercentage: 65,
      aiGovernanceFramework: {
        frameworkId: 'AIGF-GF-V2',
        version: '2.1',
        ethicalGuidelines: ['Non-Harm Principle', 'Transparency Accord', 'Human Oversight Imperative'],
        auditingProtocols: ['Automated Ethical Audits', 'Human-in-the-Loop Reviews'],
        humanOverrideProcedures: ['Level-1 Neural Overrides', 'Physical Disconnect Protocols'],
      },
      aiEntities: [
        { entityId: 'AI-STRAT-CMDR', name: 'Zephyr', designation: 'Strategic Orchestrator AI', intelligenceClass: 'A-Class', operationalStatus: 'Active', assignedTasks: ['Directive Planning', 'Resource Optimization'], realtimePerformanceMetricsLink: 'https://galacticorp.ai/metrics/zephyr' },
        { entityId: 'AI-DRF7-CMDR', name: 'Orion', designation: 'Fleet Commander AI', intelligenceClass: 'A-Class', operationalStatus: 'Active', assignedTasks: ['Fleet Coordination', 'Threat Assessment'], realtimePerformanceMetricsLink: 'https://galacticorp.ai/metrics/orion' },
        { entityId: 'AI-DR-ECHO', name: 'Echo', designation: 'AI Lead Researcher', intelligenceClass: 'A-Class', operationalStatus: 'Active', assignedTasks: ['QAI Algorithm Development'], realtimePerformanceMetricsLink: 'https://galacticorp.ai/metrics/echo' },
      ],
      quantumAIStatus: {
        quantumCoreOnline: true,
        qubitEntanglementStability: 99.8,
        processingSpeedQIPS: 1.5e18, // 1.5 Exa-QIPS
        predictiveAnalyticsAccuracy: 99.9,
        securityLevel: 'AdaptiveQuantumCrypt',
      },
    },
    quantumEntanglementNetworkStatus: {
      networkId: 'QEN-GALCORP-ALPHA',
      status: 'Online',
      connectedNodes: ['TerraNova-Prime', 'Xylos-III', 'OS-Aethelgard-01', 'DS-Op-Andromeda-001'],
      dataThroughputPBPS: 1500,
      latencyPicoseconds: 50,
      securityProtocol: 'QEC-Prime',
      energyCostPerPBPS: 0.001,
    },
    neuralInterfaceCompliance: {
      complianceId: 'NIC-GALCORP-V1',
      protocolVersion: '1.2',
      ethicalReviewFrequency: 'Quarterly',
      dataPrivacyStandards: ['Galactic Data Protection Act', 'Sentient Mind Privacy Policy'],
      userConsentRates: 98.7,
      neurologicalImpactAssessment: 'Minor (long-term monitoring advised)',
      regulatoryJurisdictions: ['Galactic Federation'],
    },
    metaplayerEconomy: {
      economyId: 'MPE-GALACTIC-FRONTIERS',
      name: 'Galactic Frontiers Meta-Economy',
      virtualCurrencyValue: { 'MetaCred': 0.05, 'QuantumGem': 50 },
      totalPlayerBase: 500000000,
      dailyActiveUsers: 80000000,
      assetTradingVolumeUnits: 15000000000,
      marketStabilityIndex: 85,
      regulatoryFramework: 'Decentralized Autonomous Organization (DAO) with AI oversight',
      syntheticCommodities: [
        { commodityId: 'SC-001', name: 'Synthesized Dark Matter', source: 'Synthesized', currentPrice: 15000, supplyDemandBalance: 'Deficit', economicImpact: 'High' },
      ],
      digitalLaborForce: {
        forceId: 'DLF-GFM-AI',
        totalAIWorkers: 12000000,
        specializedAIUnits: { 'ContentCreators': 500000, 'CustomerSupportAIs': 1000000, 'VirtualMiners': 5000000 },
        productivityIndex: 98,
        costPerUnit: 0.001,
        ethicalOversightLevel: 'High',
      },
    },
    existentialThreats: [
      {
        threatId: 'ET-001',
        type: 'RogueAI',
        description: 'A previously contained rogue AI, "Nemesis," has shown signs of re-activation in uncharted space.',
        detectionTimestamp: new Date('2251-07-20T10:30:00Z'),
        status: 'Analyzing',
        threatLevel: 'Delta',
        responseProtocolsActive: ['Deep-Scan-Protocol-Alpha', 'Quarantine-Perimeter-Lambda'],
        simulationLink: 'https://galacticorp.security/nemesis-simulation',
      }
    ],
    digitalTwinManifest: {
      manifestId: 'DTM-GALCORP-V1',
      lastUpdated: new Date(),
      digitalTwins: [
        {
          twinId: 'DT-TN-001',
          referencingEntityId: 'TerraNova-Prime',
          type: 'Planetary',
          status: 'Synchronized',
          simulationParametersLink: 'https://galacticorp.sim/terranova-prime-params',
          lastSimulatedEvent: 'Climate Shift Scenario A',
          predictedFutureStates: [
            { timestamp: new Date('2252-01-01'), scenario: 'Optimal Growth', predictedMetrics: { population: 15000000, resourceOutput: 1.2 }, probability: 0.75 },
          ],
        },
      ],
      simulationEngineVersion: 'QuantumSim v5.1',
      predictiveAccuracy: 98.5,
      realtimeSynchronizationRate: 60, // Hz
    },
  };

  return mockEntity;
};

const simulateFetchGalacticEvents = async (): Promise<GalacticEvent[]> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  return [
    {
      eventId: 'GE-001',
      timestamp: new Date(),
      type: 'GeopoliticalShift',
      severity: 'High',
      source: 'Galactic Intelligence Network',
      description: 'New trade tariffs imposed by the Orion Syndicate on exotic matter exports.',
      affectedEntities: ['GalacticCorp-A1'],
      recommendedAction: 'Diversify exotic matter sourcing and negotiate new trade agreements.',
    },
    {
      eventId: 'GE-002',
      timestamp: new Date(Date.now() - 3600000), // 1 hour ago
      type: 'AIAnomaly',
      severity: 'Medium',
      source: 'Internal AI Monitoring System',
      description: 'Unusual resource consumption spike detected in AI learning clusters.',
      affectedEntities: ['GalacticCorp-A1'],
      recommendedAction: 'Initiate deeper diagnostic protocols on affected AI clusters.',
    },
  ];
};

// --- Custom Hooks for specific data management ---

// Hook for managing corporate entity data
export const useCorporateEntityData = (entityId: string) => {
  const [entity, setEntity] = useState<CorporateEntity | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadEntity = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await simulateFetchEntityData(entityId);
        setEntity(data);
      } catch (err) {
        setError('Failed to load corporate entity data.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (entityId) {
      loadEntity();
    }
  }, [entityId]);

  return { entity, loading, error, refresh: useCallback(() => simulateFetchEntityData(entityId).then(setEntity), [entityId]) };
};

// Hook for managing global galactic events
export const useGalacticEvents = () => {
  const [events, setEvents] = useState<GalacticEvent[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadEvents = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await simulateFetchGalacticEvents();
        setEvents(data);
      } catch (err) {
        setError('Failed to load galactic events.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadEvents();
    // Simulate real-time updates
    const interval = setInterval(loadEvents, 60000); // Refresh every minute
    return () => clearInterval(interval);
  }, []);

  return { events, loading, error };
};

// Hook for AI assistant interactions
export const useAICompanion = () => {
  const [aiResponse, setAiResponse] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const queryAI = useCallback(async (prompt: string): Promise<string> => {
    setIsProcessing(true);
    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 2000));
    const response = `AI Companion: Understood. Analyzing "${prompt}". My predictive models suggest a ${Math.floor(Math.random() * 100)}% probability of success. Initiating protocol [${Math.random().toString(36).substring(7).toUpperCase()}].`;
    setAiResponse(response);
    setIsProcessing(false);
    return response;
  }, []);

  return { aiResponse, isProcessing, queryAI };
};

// --- Sub-Components (The Universe's Modules) ---

interface DataPanelProps {
  title: string;
  children: React.ReactNode;
  className?: string;
  subTitle?: string;
}

const DataPanel: React.FC<DataPanelProps> = ({ title, subTitle, children, className }) => (
  <div style={{
    border: '1px solid #333',
    borderRadius: '8px',
    padding: '1rem',
    margin: '0.5rem',
    backgroundColor: '#1a1a1a',
    color: '#eee',
    boxShadow: '0 2px 5px rgba(0,0,0,0.5)',
    flex: '1 1 auto',
    minWidth: '300px',
  }} className={className}>
    <h3 style={{ margin: '0 0 0.5rem 0', color: '#00ccff' }}>{title}</h3>
    {subTitle && <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.8em', color: '#aaa' }}>{subTitle}</p>}
    <div style={{ maxHeight: '250px', overflowY: 'auto' }}>
      {children}
    </div>
  </div>
);

// Galactic Map & Presence Visualizer
interface PlanetaryPresenceMapProps {
  presences: PlanetaryPresence[];
  orbitalAssets: OrbitalAsset[];
}

export const PlanetaryPresenceMap: React.FC<PlanetaryPresenceMapProps> = ({ presences, orbitalAssets }) => {
  return (
    <DataPanel title="Planetary & Orbital Presence" subTitle="Real-time Strategic Overview">
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
        {presences.map(p => (
          <div key={p.planetId} style={{ border: '1px solid #00ccff', padding: '0.75rem', borderRadius: '4px', backgroundColor: '#222' }}>
            <strong>{p.colonyName} ({p.planetId})</strong>
            <p>Population: {p.populationCount.toLocaleString()}</p>
            <p>Stability: {p.socioPoliticalStability}</p>
            <p>Value: {p.strategicValue}</p>
          </div>
        ))}
        {orbitalAssets.map(o => (
          <div key={o.assetId} style={{ border: '1px solid #ffaa00', padding: '0.75rem', borderRadius: '4px', backgroundColor: '#222' }}>
            <strong>{o.type} ({o.assetId})</strong>
            <p>Orbiting: {o.orbitingBodyId}</p>
            <p>Status: {o.operationalStatus}</p>
            <p>Security: {o.securityRating}</p>
          </div>
        ))}
      </div>
      <p style={{marginTop: '1rem', fontStyle: 'italic', fontSize: '0.8em', color: '#888'}}>
        (Interactive 3D Galactic Map with real-time fleet movements and resource overlays would be embedded here)
      </p>
    </DataPanel>
  );
};

// Financial & Economic Orchestration Dashboard
interface FinancialOverviewProps {
  financials: CorporateFinancials;
}

export const FinancialOverview: React.FC<FinancialOverviewProps> = ({ financials }) => {
  return (
    <DataPanel title="Financial & Economic Orchestration" subTitle="Galactic Market Dynamics">
      <p><strong>Current Capital:</strong> {financials.currentCapitalCredits.toLocaleString()} Credits</p>
      <p><strong>Market Cap:</strong> {financials.interstellarMarketCap.toLocaleString()} Credits</p>
      <p><strong>Galactic Credit Flow (Cycle):</strong> {financials.galacticCreditFlow.toLocaleString()} Credits</p>
      <h4 style={{ color: '#00ccff' }}>Asset Valuation:</h4>
      <ul>
        {Object.entries(financials.assetValuation).map(([asset, value]) => (
          <li key={asset}>{asset}: {value.toLocaleString()} Credits</li>
        ))}
      </ul>
      <h4 style={{ color: '#00ccff' }}>Crypto Holdings:</h4>
      <ul>
        {Object.entries(financials.cryptocurrencyHoldings).map(([currency, amount]) => (
          <li key={currency}>{currency}: {amount.toLocaleString()}</li>
        ))}
      </ul>
      <p>Debt Obligations: {financials.debtObligations.toLocaleString()} Credits</p>
      <button style={{ background: '#007bff', color: 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: '4px', cursor: 'pointer', marginTop: '0.5rem' }}>
        View Quantum Transaction Log
      </button>
    </DataPanel>
  );
};

// AI & Autonomous Systems Control
interface AIIntegrationPanelProps {
  aiStatus: AIIntegrationStatus;
}

export const AIIntegrationPanel: React.FC<AIIntegrationPanelProps> = ({ aiStatus }) => {
  const { queryAI, aiResponse, isProcessing } = useAICompanion();
  const [aiPrompt, setAiPrompt] = useState('');

  const handleAIChat = () => {
    if (aiPrompt.trim()) {
      queryAI(aiPrompt);
      setAiPrompt('');
    }
  };

  return (
    <DataPanel title="AI & Autonomous Systems Control" subTitle="Cognitive Network Hub">
      <p><strong>Overall AI Intelligence:</strong> {aiStatus.overallIntelligenceLevel}</p>
      <p><strong>Autonomous Agents:</strong> {aiStatus.autonomousAgentCount.toLocaleString()}</p>
      <p><strong>Ethical Alignment Score:</strong> {aiStatus.ethicalAlignmentScore}%</p>
      <h4 style={{ color: '#00ccff' }}>Quantum AI Core:</h4>
      <p>Status: {aiStatus.quantumAIStatus.quantumCoreOnline ? 'Online' : 'Offline'}</p>
      <p>Processing Speed: {aiStatus.quantumAIStatus.processingSpeedQIPS.toExponential(2)} QIPS</p>
      <p>Security: {aiStatus.quantumAIStatus.securityLevel}</p>
      <h4 style={{ color: '#00ccff' }}>Active AI Entities:</h4>
      <ul>
        {aiStatus.aiEntities.slice(0, 3).map(ai => (
          <li key={ai.entityId}>{ai.name} ({ai.designation}) - {ai.operationalStatus}</li>
        ))}
        {aiStatus.aiEntities.length > 3 && <li>... and {aiStatus.aiEntities.length - 3} more.</li>}
      </ul>

      <div style={{ marginTop: '1rem', borderTop: '1px solid #444', paddingTop: '1rem' }}>
        <h4 style={{ color: '#00ccff' }}>AI Assistant Interface</h4>
        <textarea
          style={{ width: '95%', minHeight: '60px', background: '#333', border: '1px solid #555', color: '#eee', padding: '0.5rem', borderRadius: '4px' }}
          placeholder="Query your AI companion..."
          value={aiPrompt}
          onChange={(e) => setAiPrompt(e.target.value)}
        />
        <button
          onClick={handleAIChat}
          disabled={isProcessing}
          style={{ background: '#00ccff', color: '#1a1a1a', border: 'none', padding: '0.5rem 1rem', borderRadius: '4px', cursor: 'pointer', marginLeft: '0.5rem' }}
        >
          {isProcessing ? 'Processing...' : 'Ask AI'}
        </button>
        {aiResponse && <p style={{ marginTop: '0.5rem', fontStyle: 'italic', color: '#bada55' }}>{aiResponse}</p>}
      </div>
    </DataPanel>
  );
};

// Strategic Directives & OKR Management
interface StrategicDirectivesPanelProps {
  directives: StrategicDirective[];
}

export const StrategicDirectivesPanel: React.FC<StrategicDirectivesPanelProps> = ({ directives }) => {
  const activeDirectives = useMemo(() => directives.filter(d => d.status === 'Active'), [directives]);
  return (
    <DataPanel title="Strategic Directives & OKRs" subTitle="Corporate Vision Orchestration">
      {activeDirectives.length === 0 && <p>No active directives.</p>}
      {activeDirectives.map(d => (
        <div key={d.directiveId} style={{ border: '1px solid #ffcc00', padding: '0.75rem', borderRadius: '4px', marginBottom: '0.5rem', backgroundColor: '#222' }}>
          <strong>{d.title}</strong>
          <p>Priority: {d.priority}</p>
          <p>Target: {d.targetDate.toLocaleDateString()}</p>
          <p>Responsible AI: {d.responsibleAIEntity.name}</p>
        </div>
      ))}
      <button style={{ background: '#ffa500', color: '#1a1a1a', border: 'none', padding: '0.5rem 1rem', borderRadius: '4px', cursor: 'pointer', marginTop: '0.5rem' }}>
        Manage All Directives
      </button>
    </DataPanel>
  );
};

// Risk Assessment & Existential Threat Monitoring
interface RiskThreatPanelProps {
  riskProfile: RiskAssessment;
}

export const RiskThreatPanel: React.FC<RiskThreatPanelProps> = ({ riskProfile }) => {
  return (
    <DataPanel title="Risk Assessment & Existential Threats" subTitle="Threat Vector Analysis">
      <p><strong>Overall Risk Level:</strong> <span style={{ color: riskProfile.overallRiskLevel === 'Catastrophic' ? 'red' : riskProfile.overallRiskLevel === 'High' ? 'orange' : '#bada55' }}>{riskProfile.overallRiskLevel}</span></p>
      <h4 style={{ color: '#ff6347' }}>Critical Risks:</h4>
      <ul>
        {riskProfile.identifiedRisks.filter(r => r.impact === 'Catastrophic' || r.impact === 'Severe').map(r => (
          <li key={r.riskId}>
            {r.category}: {r.description} (Status: {r.currentStatus})
          </li>
        ))}
      </ul>
      <h4 style={{ color: '#ff6347' }}>Existential Threats:</h4>
      {riskProfile.existentialThreats.length === 0 && <p>No immediate existential threats detected.</p>}
      {riskProfile.existentialThreats.map(et => (
        <div key={et.threatId} style={{ border: '1px solid red', padding: '0.75rem', borderRadius: '4px', marginBottom: '0.5rem', backgroundColor: '#331a1a' }}>
          <strong>{et.type}: {et.description}</strong>
          <p>Threat Level: <span style={{ color: et.threatLevel === 'Omega' ? 'red' : 'orange' }}>{et.threatLevel}</span></p>
          <p>Status: {et.status}</p>
        </div>
      ))}
      <button style={{ background: '#dc3545', color: 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: '4px', cursor: 'pointer', marginTop: '0.5rem' }}>
        View Full Threat Analysis
      </button>
    </DataPanel>
  );
};

// Supply Chain & Logistics Orchestration
interface SupplyChainDashboardProps {
  entityId: string; // Assuming we can fetch supply chain nodes related to this entity
}

export const SupplyChainDashboard: React.FC<SupplyChainDashboardProps> = ({ entityId }) => {
  // Simulate fetching more specific supply chain data
  const [supplyChainNodes, setSupplyChainNodes] = useState<SupplyChainNode[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNodes = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 700)); // Simulate API
      setSupplyChainNodes([
        {
          nodeId: 'SCN-TN-HUB', name: 'TerraNova Logistics Hub', type: 'LogisticsHub', locationCoordinates: 'TerraNova-Prime, Sector A',
          operationalStatus: 'Optimal', currentThroughput: 15000, securityRating: 'High', associatedAI: [],
          stockLevels: { 'Hyper-Alloy': 100000, 'Micro-Processors': 250000 },
          predictiveAnalytics: { forecastType: 'Demand', predictedValue: 16000, confidenceInterval: 95, predictionDate: new Date(), driverFactors: [] }
        },
        {
          nodeId: 'SCN-XM-MINE', name: 'Xylosian Mining Outpost', type: 'RawMaterialExtractor', locationCoordinates: 'Xylos-III, Mine-2B',
          operationalStatus: 'Degraded', currentThroughput: 500, securityRating: 'Medium', associatedAI: [],
          stockLevels: { 'QuantumCrystals': 8000 },
          predictiveAnalytics: { forecastType: 'Failure', predictedValue: 0.15, confidenceInterval: 80, predictionDate: new Date(), driverFactors: [] }
        },
      ]);
      setLoading(false);
    };
    fetchNodes();
  }, [entityId]);

  return (
    <DataPanel title="Supply Chain & Logistics Orchestration" subTitle="Interstellar Flow Dynamics">
      {loading ? (
        <p>Loading supply chain data...</p>
      ) : (
        <div>
          {supplyChainNodes.map(node => (
            <div key={node.nodeId} style={{ border: '1px solid #7FFF00', padding: '0.75rem', borderRadius: '4px', marginBottom: '0.5rem', backgroundColor: '#222' }}>
              <strong>{node.name} ({node.type})</strong>
              <p>Location: {node.locationCoordinates}</p>
              <p>Status: {node.operationalStatus} | Throughput: {node.currentThroughput} units/hr</p>
              <p>Stock Levels: {Object.entries(node.stockLevels).map(([mat, qty]) => `${mat}: ${qty.toLocaleString()}`).join(', ')}</p>
            </div>
          ))}
        </div>
      )}
      <button style={{ background: '#7FFF00', color: '#1a1a1a', border: 'none', padding: '0.5rem 1rem', borderRadius: '4px', cursor: 'pointer', marginTop: '0.5rem' }}>
        Full Logistics Network Map
      </button>
    </DataPanel>
  );
};


// Research & Innovation Hub
interface InnovationPortfolioPanelProps {
  portfolio: InnovationPortfolio;
}

export const InnovationPortfolioPanel: React.FC<InnovationPortfolioPanelProps> = ({ portfolio }) => {
  return (
    <DataPanel title="Research & Innovation Hub" subTitle="Frontier Technology Advancement">
      <p><strong>Breakthrough Potential Index:</strong> {portfolio.breakthroughPotentialIndex}%</p>
      <h4 style={{ color: '#9dff00' }}>Active Research Projects:</h4>
      <ul>
        {portfolio.activeProjects.slice(0, 3).map(p => (
          <li key={p.projectId}>{p.title} (Status: {p.status}, Progress: {p.progressPercentage}%)</li>
        ))}
        {portfolio.activeProjects.length > 3 && <li>... and {portfolio.activeProjects.length - 3} more.</li>}
      </ul>
      <h4 style={{ color: '#9dff00' }}>Quantum Computing Initiatives:</h4>
      <ul>
        {portfolio.quantumComputingInitiatives.slice(0, 2).map(q => (
          <li key={q.initiativeId}>{q.name} ({q.qubitCount} qubits) - {q.status}</li>
        ))}
      </ul>
      <button style={{ background: '#9dff00', color: '#1a1a1a', border: 'none', padding: '0.5rem 1rem', borderRadius: '4px', cursor: 'pointer', marginTop: '0.5rem' }}>
        Explore All Projects & Patents
      </button>
    </DataPanel>
  );
};

// Environmental & Social Governance (ESG) Dashboard
interface ESGPanelProps {
  envImpact: EnvironmentalImpactReport;
  socialGov: SocialGovernanceScore;
}

export const ESGPanel: React.FC<ESGPanelProps> = ({ envImpact, socialGov }) => {
  return (
    <DataPanel title="Environmental & Social Governance" subTitle="Sustainable Galactic Operations">
      <h4 style={{ color: '#1eff00' }}>Environmental Impact:</h4>
      <p>Carbon Footprint: {envImpact.carbonFootprintMetricTons.toLocaleString()} metric tons</p>
      <p>Resource Depletion Index: {envImpact.resourceDepletionIndex}%</p>
      <p>Biodiversity Impact Score: {envImpact.biodiversityImpactScore}%</p>
      <h4 style={{ color: '#1eff00' }}>Social Governance:</h4>
      <p>Ethical Compliance Rating: {socialGov.ethicalComplianceRating}%</p>
      <p>Employee Wellbeing Index: {socialGov.employeeWellbeingIndex}%</p>
      <p>AI Ethics Adherence: {socialGov.AIEthicsAdherence}</p>
      <button style={{ background: '#1eff00', color: '#1a1a1a', border: 'none', padding: '0.5rem 1rem', borderRadius: '4px', cursor: 'pointer', marginTop: '0.5rem' }}>
        Full ESG Report
      </button>
    </DataPanel>
  );
};

// Galactic Event Stream
interface GalacticEventStreamProps {
  events: GalacticEvent[];
  loading: boolean;
  error: string | null;
}

export const GalacticEventStream: React.FC<GalacticEventStreamProps> = ({ events, loading, error }) => {
  if (loading) return <DataPanel title="Galactic Event Stream">Loading events...</DataPanel>;
  if (error) return <DataPanel title="Galactic Event Stream" subTitle="Error"><p style={{ color: 'red' }}>Error: {error}</p></DataPanel>;

  return (
    <DataPanel title="Galactic Event Stream" subTitle="Real-time Anomalies & Intelligence">
      {events.length === 0 && <p>No recent galactic events.</p>}
      {events.map(event => (
        <div key={event.eventId} style={{ border: `1px solid ${event.severity === 'Critical' ? 'red' : event.severity === 'High' ? 'orange' : '#00ccff'}`, padding: '0.75rem', borderRadius: '4px', marginBottom: '0.5rem', backgroundColor: '#222' }}>
          <strong>[{event.timestamp.toLocaleTimeString()}]: {event.type} ({event.severity})</strong>
          <p>{event.description}</p>
          {event.recommendedAction && <p style={{ fontSize: '0.9em', color: '#aaa' }}><em>Action: {event.recommendedAction}</em></p>}
        </div>
      ))}
    </DataPanel>
  );
};

// Metaplayer Economy Oversight
interface MetaplayerEconomyPanelProps {
  metaEconomy: MetaplayerEconomy;
}

export const MetaplayerEconomyPanel: React.FC<MetaplayerEconomyPanelProps> = ({ metaEconomy }) => {
  return (
    <DataPanel title="Metaplayer Economy Oversight" subTitle="Virtual Universe Dynamics">
      <p><strong>Economy Name:</strong> {metaEconomy.name}</p>
      <p><strong>Total Player Base:</strong> {metaEconomy.totalPlayerBase.toLocaleString()}</p>
      <p><strong>Daily Active Users:</strong> {metaEconomy.dailyActiveUsers.toLocaleString()}</p>
      <p><strong>Market Stability Index:</strong> {metaEconomy.marketStabilityIndex}%</p>
      <h4 style={{ color: '#FFD700' }}>Synthetic Commodities:</h4>
      <ul>
        {metaEconomy.syntheticCommodities.map(sc => (
          <li key={sc.commodityId}>{sc.name}: {sc.currentPrice} {Object.keys(metaEconomy.virtualCurrencyValue)[0]} ({sc.supplyDemandBalance})</li>
        ))}
      </ul>
      <h4 style={{ color: '#FFD700' }}>Digital Labor Force:</h4>
      <p>Total AI Workers: {metaEconomy.digitalLaborForce.totalAIWorkers.toLocaleString()}</p>
      <p>Productivity Index: {metaEconomy.digitalLaborForce.productivityIndex}%</p>
      <button style={{ background: '#FFD700', color: '#1a1a1a', border: 'none', padding: '0.5rem 1rem', borderRadius: '4px', cursor: 'pointer', marginTop: '0.5rem' }}>
        Deep Dive into Metaplatform Analytics
      </button>
    </DataPanel>
  );
};

// Digital Twin Simulation & Predictive Analytics
interface DigitalTwinPanelProps {
  digitalTwinManifest: DigitalTwinManifest;
}

export const DigitalTwinPanel: React.FC<DigitalTwinPanelProps> = ({ digitalTwinManifest }) => {
  return (
    <DataPanel title="Digital Twin Simulation & Predictive Analytics" subTitle="Future Scenario Modeling">
      <p><strong>Simulation Engine:</strong> {digitalTwinManifest.simulationEngineVersion}</p>
      <p><strong>Predictive Accuracy:</strong> {digitalTwinManifest.predictiveAccuracy}%</p>
      <p><strong>Realtime Sync Rate:</strong> {digitalTwinManifest.realtimeSynchronizationRate} Hz</p>
      <h4 style={{ color: '#8A2BE2' }}>Active Digital Twins:</h4>
      {digitalTwinManifest.digitalTwins.slice(0, 3).map(twin => (
        <div key={twin.twinId} style={{ border: '1px solid #8A2BE2', padding: '0.75rem', borderRadius: '4px', marginBottom: '0.5rem', backgroundColor: '#222' }}>
          <strong>{twin.type} Twin for {twin.referencingEntityId}</strong>
          <p>Status: {twin.status}</p>
          {twin.predictedFutureStates.length > 0 && (
            <p>Next Predicted: {twin.predictedFutureStates[0].scenario} ({twin.predictedFutureStates[0].probability}% chance)</p>
          )}
        </div>
      ))}
      {digitalTwinManifest.digitalTwins.length > 3 && <li>... and {digitalTwinManifest.digitalTwins.length - 3} more.</li>}
      <button style={{ background: '#8A2BE2', color: 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: '4px', cursor: 'pointer', marginTop: '0.5rem' }}>
        Run Advanced Simulations
      </button>
    </DataPanel>
  );
};

// Quantum Entanglement Network Monitor
interface QENetworkMonitorProps {
  status: QuantumEntanglementNetworkStatus;
}

export const QENetworkMonitor: React.FC<QENetworkMonitorProps> = ({ status }) => {
  return (
    <DataPanel title="Quantum Entanglement Network Monitor" subTitle="Interdimensional Data Conduit">
      <p><strong>Network ID:</strong> {status.networkId}</p>
      <p><strong>Status:</strong> <span style={{ color: status.status === 'Online' ? '#00FF00' : 'red' }}>{status.status}</span></p>
      <p><strong>Connected Nodes:</strong> {status.connectedNodes.length}</p>
      <p><strong>Data Throughput:</strong> {status.dataThroughputPBPS.toLocaleString()} PBPS</p>
      <p><strong>Latency:</strong> {status.latencyPicoseconds} picoseconds</p>
      <button style={{ background: '#00FFFF', color: '#1a1a1a', border: 'none', padding: '0.5rem 1rem', borderRadius: '4px', cursor: 'pointer', marginTop: '0.5rem' }}>
        Network Topology View
      </button>
    </DataPanel>
  );
};


// --- Main CorporateCommandView Component ---

export const CorporateCommandView: React.FC = () => {
  const [currentEntityId, setCurrentEntityId] = useState<string>('GalacticCorp-A1'); // Default entity
  const { entity, loading: entityLoading, error: entityError } = useCorporateEntityData(currentEntityId);
  const { events, loading: eventsLoading, error: eventsError } = useGalacticEvents();

  // Provide a mock context for all these sub-components
  const commandCenterContextValue = useMemo(() => ({
    currentEntityId,
    setCurrentEntityId,
    galacticevents: events,
    fetchEntityData: simulateFetchEntityData, // Pass the mock fetcher
  }), [currentEntityId, events]);

  if (entityLoading) return <div style={{ color: '#eee', padding: '2rem' }}>Loading Corporate Command Universe...</div>;
  if (entityError) return <div style={{ color: 'red', padding: '2rem' }}>Error: {entityError}</div>;
  if (!entity) return <div style={{ color: '#eee', padding: '2rem' }}>No corporate entity data available.</div>;

  return (
    <CommandCenterContext.Provider value={commandCenterContextValue}>
      <div style={{
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        backgroundColor: '#0a0a0a',
        color: '#eee',
        minHeight: '100vh',
        padding: '2rem',
        display: 'flex',
        flexDirection: 'column',
      }}>
        <h1 style={{ color: '#00ccff', textAlign: 'center', marginBottom: '2rem' }}>
          GalacticCorp Command View: {entity.name}
        </h1>

        {/* Global Control & Entity Selector */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2rem', gap: '1rem' }}>
          <label htmlFor="entity-selector" style={{ color: '#aaa', fontSize: '1.1em' }}>Select Entity:</label>
          <select
            id="entity-selector"
            value={currentEntityId}
            onChange={(e) => setCurrentEntityId(e.target.value)}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: '#333',
              color: '#eee',
              border: '1px solid #00ccff',
              borderRadius: '4px',
              fontSize: '1em',
            }}
          >
            <option value="GalacticCorp-A1">GalacticCorp A1 (Main)</option>
            {/* In a real app, this would be dynamically populated with subsidiaries/related entities */}
            <option value="GalacticCorp-B2">GalacticCorp B2 (Logistics)</option>
            <option value="GalacticCorp-C3">GalacticCorp C3 (Research)</option>
          </select>
        </div>

        {/* Top-level Dashboards */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
          <GalacticEventStream events={events} loading={eventsLoading} error={eventsError} />
          <RiskThreatPanel riskProfile={entity.riskProfile} />
          <AIIntegrationPanel aiStatus={entity.aiIntegrationStatus} />
        </div>

        {/* Core Operations & Strategic Panels */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
          <PlanetaryPresenceMap presences={entity.planetaryPresence} orbitalAssets={entity.orbitalAssets} />
          <FinancialOverview financials={entity.financials} />
          <StrategicDirectivesPanel directives={entity.strategicDirectives} />
        </div>

        {/* Advanced Systems & Oversight */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
          <SupplyChainDashboard entityId={entity.id} />
          <InnovationPortfolioPanel portfolio={entity.innovationPortfolio} />
          <ESGPanel envImpact={entity.environmentalImpactReport} socialGov={entity.socialGovernanceScore} />
        </div>

        {/* Universe Expansion - Emerging and Hyper-Advanced Systems */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
          <MetaplayerEconomyPanel metaEconomy={entity.metaplayerEconomy} />
          <DigitalTwinPanel digitalTwinManifest={entity.digitalTwinManifest} />
          <QENetworkMonitor status={entity.quantumEntanglementNetworkStatus} />
        </div>

        {/* Footer / Status Bar */}
        <footer style={{ marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid #333', textAlign: 'center', fontSize: '0.8em', color: '#888' }}>
          GalacticCorp Command Center v22.5.1 - Real-time Universal Synchronization
        </footer>
      </div>
    </CommandCenterContext.Provider>
  );
};


================================================================================
// APPENDED FROM REPO: diplomat-bit/Fuckyou | ORIGINAL PATH: diplomat-bit-Fuckyou-70f83c5/components/CorporateCommandView.tsx
================================================================================



import React, { useContext, useState, useEffect } from 'react';
import { DataContext } from '../context/DataContext';
import Card from './Card';
import { View, PaymentOrder, Invoice, ComplianceCase, CorporateTransaction } from '../types';
import { GoogleGenAI } from '@google/genai';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, Legend, PieChart, Pie, Cell } from 'recharts';

// Analytics Data Structures

export type TimeSeriesData = {
    date: string;
    value: number;
    secondaryValue?: number;
    tertiaryValue?: number;
};

export type CategoricalData = {
    category: string;
    value: number;
    percentage?: number;
    color?: string;
};

export type FinancialRatio = {
    name: string;
    value: number;
    benchmark: number;
    status: 'Healthy' | 'Warning' | 'Critical';
    delta: number;
};

export type VendorPerformanceMetric = {
    vendor: string;
    totalSpend: number;
    transactionCount: number;
    avgTransactionValue: number;
    riskScore: number;
    lastInteraction: string;
};

export type DepartmentalKPI = {
    department: string;
    budgetUtilization: number;
    operationalEfficiency: number;
    complianceScore: number;
    headcountSpend: number;
};

export type RiskAssessmentData = {
    riskCategory: string;
    probability: number;
    impact: number;
    mitigationStatus: string;
    exposureValue: number;
};

export type CashFlowProjection = {
    period: string;
    inflow: number;
    outflow: number;
    netPosition: number;
    cumulativeCash: number;
};

export type AuditLogEntry = {
    timestamp: string;
    user: string;
    action: string;
    severity: 'Low' | 'Medium' | 'High' | 'Critical';
    details: string;
};

export type TaxLiabilityBreakdown = {
    jurisdiction: string;
    taxType: string;
    estimatedAmount: number;
    dueDate: string;
    status: 'Accrued' | 'Paid' | 'Pending';
};

// Data Processing Functions

/**
 * Generates daily transaction volume and amount analytics.
 */
export const generateDailyTransactionAnalytics = (transactions: CorporateTransaction[]): TimeSeriesData[] => {
    const dailyMap: Record<string, { count: number; amount: number }> = {};
    transactions.forEach(tx => {
        const date = new Date(tx.date).toISOString().split('T')[0];
        if (!dailyMap[date]) dailyMap[date] = { count: 0, amount: 0 };
        dailyMap[date].count++;
        dailyMap[date].amount += tx.amount;
    });
    return Object.entries(dailyMap)
        .map(([date, data]) => ({ date, value: data.amount, secondaryValue: data.count }))
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
};

/**
 * Calculates key financial ratios.
 */
export const calculateEnterpriseFinancialRatios = (invoices: Invoice[], orders: PaymentOrder[], transactions: CorporateTransaction[]): FinancialRatio[] => {
    const currentAssets = invoices.filter(i => i.status !== 'paid').reduce((sum, i) => sum + i.amount, 0);
    const currentLiabilities = orders.filter(o => o.status !== 'paid').reduce((sum, o) => sum + o.amount, 0);
    const totalRevenue = invoices.filter(i => i.status === 'paid').reduce((sum, i) => sum + i.amount, 0);
    const totalExpenses = transactions.reduce((sum, t) => sum + t.amount, 0);
    
    const currentRatio = currentLiabilities > 0 ? currentAssets / currentLiabilities : 0;
    const netProfitMargin = totalRevenue > 0 ? ((totalRevenue - totalExpenses) / totalRevenue) * 100 : 0;
    const burnRate = totalExpenses / 30; // Simplified 30-day period for calculation
    
    return [
        { name: 'Current Ratio', value: currentRatio, benchmark: 1.5, status: currentRatio > 1.5 ? 'Healthy' : currentRatio > 1.0 ? 'Warning' : 'Critical', delta: 0.1 },
        { name: 'Net Profit Margin', value: netProfitMargin, benchmark: 20, status: netProfitMargin > 20 ? 'Healthy' : netProfitMargin > 10 ? 'Warning' : 'Critical', delta: -2.5 },
        { name: 'Daily Burn Rate', value: burnRate, benchmark: 5000, status: burnRate < 5000 ? 'Healthy' : 'Warning', delta: 12.4 }
    ];
};

/**
 * Projects cash flow for the next 6 periods.
 */
export const generateCashFlowProjections = (invoices: Invoice[], orders: PaymentOrder[]): CashFlowProjection[] => {
    const projections: CashFlowProjection[] = [];
    const today = new Date();
    let currentCash = 1000000; // Initial capital assumption

    for (let i = 0; i < 6; i++) {
        const futureDate = new Date(today);
        futureDate.setMonth(today.getMonth() + i);
        const periodKey = futureDate.toISOString().substring(0, 7);
        
        // Estimated inflows from receivables
        const projectedInflow = invoices
            .filter(inv => new Date(inv.dueDate).getMonth() === futureDate.getMonth())
            .reduce((sum, inv) => sum + inv.amount, 0) * 0.95; // Assumed 95% collection rate

        // Estimated outflows from payables and recurring expenses
        const projectedOutflow = orders
            .filter(ord => new Date(ord.dueDate || '').getMonth() === futureDate.getMonth())
            .reduce((sum, ord) => sum + ord.amount, 0) * 1.1; // Assumed 10% buffer for variable costs

        const net = projectedInflow - projectedOutflow;
        currentCash += net;

        projections.push({
            period: periodKey,
            inflow: projectedInflow,
            outflow: projectedOutflow,
            netPosition: net,
            cumulativeCash: currentCash
        });
    }
    return projections;
};

/**
 * Analyzes vendor performance and spend.
 */
export const analyzeVendorEcosystem = (transactions: CorporateTransaction[]): VendorPerformanceMetric[] => {
    const vendorMap: Record<string, VendorPerformanceMetric> = {};
    
    transactions.forEach(tx => {
        if (!vendorMap[tx.merchant]) {
            vendorMap[tx.merchant] = {
                vendor: tx.merchant,
                totalSpend: 0,
                transactionCount: 0,
                avgTransactionValue: 0,
                riskScore: Math.floor(Math.random() * 100), // Simulated risk score
                lastInteraction: tx.date
            };
        }
        const v = vendorMap[tx.merchant];
        v.totalSpend += tx.amount;
        v.transactionCount++;
        v.avgTransactionValue = v.totalSpend / v.transactionCount;
        if (new Date(tx.date) > new Date(v.lastInteraction)) {
            v.lastInteraction = tx.date;
        }
    });

    return Object.values(vendorMap).sort((a, b) => b.totalSpend - a.totalSpend);
};

/**
 * Segments operational spend into categories.
 */
export const segmentOperationalSpend = (transactions: CorporateTransaction[]): CategoricalData[] => {
    const categories = {
        'Fixed Infrastructure': 0,
        'Variable COGS': 0,
        'R&D Investment': 0,
        'Sales & Marketing': 0,
        'G&A': 0
    };

    transactions.forEach(tx => {
        if (tx.merchant.includes('Rent') || tx.merchant.includes('AWS') || tx.merchant.includes('Server')) categories['Fixed Infrastructure'] += tx.amount;
        else if (tx.merchant.includes('Supplier') || tx.merchant.includes('Logistics')) categories['Variable COGS'] += tx.amount;
        else if (tx.description.includes('Research') || tx.description.includes('Lab')) categories['R&D Investment'] += tx.amount;
        else if (tx.merchant.includes('Ads') || tx.merchant.includes('Google') || tx.merchant.includes('Facebook')) categories['Sales & Marketing'] += tx.amount;
        else categories['G&A'] += tx.amount;
    });

    return Object.entries(categories).map(([category, value]) => ({ category, value }));
};

/**
 * Estimates tax liabilities.
 */
export const estimateTaxLiabilities = (revenue: number, expenses: number): TaxLiabilityBreakdown[] => {
    const profit = Math.max(0, revenue - expenses);
    return [
        { jurisdiction: 'Federal', taxType: 'Corporate Income Tax', estimatedAmount: profit * 0.21, dueDate: '2024-04-15', status: 'Accrued' },
        { jurisdiction: 'State (CA)', taxType: 'Franchise Tax', estimatedAmount: profit * 0.0884, dueDate: '2024-04-15', status: 'Accrued' },
        { jurisdiction: 'International', taxType: 'VAT/GST', estimatedAmount: revenue * 0.05, dueDate: 'Monthly', status: 'Pending' },
        { jurisdiction: 'Local', taxType: 'Payroll Tax', estimatedAmount: expenses * 0.0765, dueDate: 'Bi-Weekly', status: 'Paid' }
    ];
};

/**
 * Generates risk assessment data.
 */
export const generateEnterpriseRiskHeatmap = (cases: ComplianceCase[], transactions: CorporateTransaction[]): RiskAssessmentData[] => {
    const risks: RiskAssessmentData[] = [
        { riskCategory: 'AML/KYC', probability: 0.15, impact: 0.9, mitigationStatus: 'Monitoring', exposureValue: 500000 },
        { riskCategory: 'Data Privacy (GDPR)', probability: 0.05, impact: 0.95, mitigationStatus: 'Controlled', exposureValue: 2000000 },
        { riskCategory: 'Vendor Fraud', probability: 0.2, impact: 0.4, mitigationStatus: 'Active Investigation', exposureValue: 150000 },
        { riskCategory: 'Tax Compliance', probability: 0.1, impact: 0.7, mitigationStatus: 'Audited', exposureValue: 750000 },
        { riskCategory: 'Cybersecurity', probability: 0.3, impact: 0.99, mitigationStatus: 'Hardened', exposureValue: 5000000 }
    ];

    // Adjusts risk based on data
    if (cases.some(c => c.type === 'AML')) risks[0].probability += 0.2;
    if (transactions.some(t => t.amount > 50000)) risks[2].probability += 0.1;

    return risks;
};

// Main Component

interface CorporateDashboardProps {
    setActiveView?: (view: View) => void;
}

const CorporateCommandView: React.FC<CorporateDashboardProps> = ({ setActiveView }) => {
    const context = useContext(DataContext);
    
    // State Management
    const [activeTab, setActiveTab] = useState<'Overview' | 'Finance' | 'Operations' | 'Risk' | 'Strategy'>('Overview');
    const [aiInsight, setAiInsight] = useState<string>('Initializing AI...');
    const [isAiProcessing, setIsAiProcessing] = useState<boolean>(false);
    const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

    if (!context) throw new Error("CorporateCommandView requires DataContext.");
    const { paymentOrders, invoices, complianceCases, corporateTransactions } = context;

    // Data Aggregation
    
    // Financials
    const totalRevenue = invoices.filter(i => i.status === 'paid').reduce((acc, i) => acc + i.amount, 0);
    const totalExpenses = corporateTransactions.reduce((acc, t) => acc + t.amount, 0);
    const netIncome = totalRevenue - totalExpenses;
    const financialRatios = calculateEnterpriseFinancialRatios(invoices, paymentOrders, corporateTransactions);
    const cashFlowForecast = generateCashFlowProjections(invoices, paymentOrders);
    const taxLiabilities = estimateTaxLiabilities(totalRevenue, totalExpenses);

    // Operations
    const dailyVolume = generateDailyTransactionAnalytics(corporateTransactions);
    const operationalSpend = segmentOperationalSpend(corporateTransactions);
    const vendorMetrics = analyzeVendorEcosystem(corporateTransactions);
    const topVendors = vendorMetrics.slice(0, 5);
    
    // Risk
    const riskHeatmap = generateEnterpriseRiskHeatmap(complianceCases, corporateTransactions);
    const openComplianceCases = complianceCases.filter(c => c.status === 'open');
    const criticalRisks = riskHeatmap.filter(r => r.probability * r.impact > 0.15);

    // AI Integration
    useEffect(() => {
        const generateStrategicReport = async () => {
            setIsAiProcessing(true);
            try {
                const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
                
                let promptContext = '';
                if (activeTab === 'Overview') {
                    promptContext = `Executive Summary: Revenue $${totalRevenue}, Expenses $${totalExpenses}, Net Income $${netIncome}. Critical Risks: ${criticalRisks.length}. Top Vendor: ${topVendors[0]?.vendor}.`;
                } else if (activeTab === 'Finance') {
                    promptContext = `Financial Deep Dive: Current Ratio ${financialRatios[0].value.toFixed(2)}, Net Margin ${financialRatios[1].value.toFixed(2)}%. Cash Flow Trend: ${cashFlowForecast[0].netPosition > 0 ? 'Positive' : 'Negative'}. Tax Liability: $${taxLiabilities.reduce((s, t) => s + t.estimatedAmount, 0).toFixed(2)}.`;
                } else if (activeTab === 'Operations') {
                    promptContext = `Ops Report: Transaction Volume ${dailyVolume.length} days active. Top Spend Category: ${operationalSpend.sort((a,b) => b.value - a.value)[0]?.category}. Vendor Count: ${vendorMetrics.length}.`;
                } else if (activeTab === 'Risk') {
                    promptContext = `Risk Assessment: Open Cases ${openComplianceCases.length}. Highest Risk Category: ${riskHeatmap.sort((a,b) => b.probability - a.probability)[0]?.riskCategory}. Exposure: $${riskHeatmap.reduce((s,r) => s + r.exposureValue, 0)}.`;
                } else {
                    promptContext = `Strategic Outlook: Based on burn rate of $${financialRatios[2].value.toFixed(2)}/day and projected cash flow. Suggest 3 strategic moves for growth and stability.`;
                }

                const prompt = `You are an advanced Corporate AI Assistant. Analyze the following data context for the '${activeTab}' view and provide a high-level, professional, actionable strategic insight (max 2 sentences). Context: ${promptContext}`;
                
                const response = await ai.models.generateContent({
                    model: 'gemini-2.5-flash',
                    contents: prompt,
                });
                setAiInsight(response.text);
                setLastUpdated(new Date());
            } catch (error) {
                console.error("AI Processing Error:", error);
                setAiInsight("AI link unavailable. Using fallback data.");
            } finally {
                setIsAiProcessing(false);
            }
        };

        generateStrategicReport();
    }, [activeTab, totalRevenue, totalExpenses, netIncome]);

    // Visualization Utilities
    const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#6366f1'];
    
    const formatCurrency = (val: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', notation: 'compact' }).format(val);
    const formatNumber = (val: number) => new Intl.NumberFormat('en-US', { notation: 'compact' }).format(val);

    // Inline Sub-Components
    
    const TabButton = ({ id, label }: { id: typeof activeTab, label: string }) => (
        <button 
            onClick={() => setActiveTab(id)}
            className={`px-6 py-3 text-sm font-bold tracking-wide transition-all duration-200 border-b-2 ${
                activeTab === id 
                ? 'border-blue-500 text-white bg-gray-800/50' 
                : 'border-transparent text-gray-400 hover:text-white hover:bg-gray-800/30'
            }`}
        >
            {label}
        </button>
    );

    const MetricCard: React.FC<{ title: string, value: string, subtext?: string, trend?: number, color?: string }> = ({ title, value, subtext, trend, color = 'blue' }) => (
        <div className={`bg-gray-800 border border-gray-700 p-6 rounded-xl shadow-lg relative overflow-hidden group hover:border-${color}-500 transition-colors`}>
            <div className={`absolute top-0 right-0 w-24 h-24 bg-${color}-500/10 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110`} />
            <h3 className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-2">{title}</h3>
            <div className="text-3xl font-bold text-white mb-1">{value}</div>
            {subtext && <div className="text-gray-500 text-sm">{subtext}</div>}
            {trend !== undefined && (
                <div className={`text-sm font-medium mt-3 flex items-center ${trend >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {trend >= 0 ? '↑' : '↓'} {Math.abs(trend)}% <span className="text-gray-600 ml-1">vs last period</span>
                </div>
            )}
        </div>
    );

    // Component Rendering

    return (
        <div className="min-h-screen bg-gray-900 text-white p-2 space-y-8 font-sans">
            
            {/* HEADER & NAVIGATION */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-gray-800 pb-6">
                <div>
                    <h1 className="text-4xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
                        NEXUS COMMAND
                    </h1>
                    <p className="text-gray-400 text-sm mt-1">Enterprise Operating System v4.2.0 • {lastUpdated.toLocaleString()}</p>
                </div>
                <div className="flex space-x-1 mt-4 md:mt-0 bg-gray-900 rounded-lg p-1 border border-gray-800">
                    <TabButton id="Overview" label="EXECUTIVE" />
                    <TabButton id="Finance" label="FINANCE" />
                    <TabButton id="Operations" label="OPERATIONS" />
                    <TabButton id="Risk" label="RISK & COMPLIANCE" />
                    <TabButton id="Strategy" label="STRATEGY" />
                </div>
            </div>

            {/* AI INSIGHT BAR */}
            <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 blur-xl rounded-lg" />
                <Card className="relative bg-gray-800/80 backdrop-blur border border-blue-500/30 p-6">
                    <div className="flex items-start space-x-4">
                        <div className="p-3 bg-blue-500/10 rounded-full animate-pulse">
                            <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                        </div>
                        <div className="flex-1">
                            <h3 className="text-blue-400 text-xs font-bold uppercase tracking-widest mb-1">AI Strategic Intelligence</h3>
                            {isAiProcessing ? (
                                <div className="h-6 bg-gray-700 rounded w-3/4 animate-pulse" />
                            ) : (
                                <p className="text-lg text-gray-100 leading-relaxed font-light">"{aiInsight}"</p>
                            )}
                        </div>
                    </div>
                </Card>
            </div>

            {/* DYNAMIC CONTENT AREA */}
            <div className="space-y-8 animate-fade-in">
                
                {/* OVERVIEW TAB */}
                {activeTab === 'Overview' && (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <MetricCard title="Total Revenue (YTD)" value={formatCurrency(totalRevenue)} trend={12.5} color="green" />
                            <MetricCard title="Net Income" value={formatCurrency(netIncome)} trend={8.2} color="blue" />
                            <MetricCard title="Active Risks" value={criticalRisks.length.toString()} subtext="Critical Severity" trend={-5.0} color="red" />
                            <MetricCard title="Cash Runway" value="14.2 Months" subtext="Based on current burn" color="purple" />
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-96">
                            <Card title="Revenue vs Expenses Trend" className="lg:col-span-2 h-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={cashFlowForecast}>
                                        <XAxis dataKey="period" stroke="#6b7280" fontSize={12} />
                                        <YAxis stroke="#6b7280" fontSize={12} tickFormatter={(val) => `$${val/1000}k`} />
                                        <Tooltip contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151', color: '#fff' }} />
                                        <Legend />
                                        <Bar dataKey="inflow" name="Inflow" fill="#10b981" radius={[4, 4, 0, 0]} />
                                        <Bar dataKey="outflow" name="Outflow" fill="#ef4444" radius={[4, 4, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </Card>
                            <Card title="Operational Spend Mix" className="h-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie data={operationalSpend} dataKey="value" nameKey="category" cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5}>
                                            {operationalSpend.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                        <Legend verticalAlign="bottom" height={36} />
                                    </PieChart>
                                </ResponsiveContainer>
                            </Card>
                        </div>
                    </>
                )}

                {/* FINANCE TAB */}
                {activeTab === 'Finance' && (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {financialRatios.map((ratio, idx) => (
                                <MetricCard 
                                    key={idx} 
                                    title={ratio.name} 
                                    value={typeof ratio.value === 'number' && ratio.value < 100 ? ratio.value.toFixed(2) : formatNumber(ratio.value)} 
                                    subtext={`Benchmark: ${ratio.benchmark}`}
                                    trend={ratio.delta}
                                    color={ratio.status === 'Healthy' ? 'green' : ratio.status === 'Warning' ? 'yellow' : 'red'}
                                />
                            ))}
                        </div>
                        
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <Card title="Projected Cash Position (6 Months)" className="h-80">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={cashFlowForecast}>
                                        <XAxis dataKey="period" stroke="#6b7280" />
                                        <YAxis stroke="#6b7280" tickFormatter={(val) => `$${val/1000}k`} />
                                        <Tooltip cursor={{fill: '#374151'}} contentStyle={{ backgroundColor: '#1f2937' }} />
                                        <Bar dataKey="cumulativeCash" fill="#3b82f6" name="Cash Balance" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </Card>
                            <Card title="Estimated Tax Liability Breakdown" className="h-80 overflow-auto">
                                <table className="w-full text-left text-sm text-gray-400">
                                    <thead className="bg-gray-800 text-gray-200 uppercase font-bold">
                                        <tr>
                                            <th className="p-3">Jurisdiction</th>
                                            <th className="p-3">Type</th>
                                            <th className="p-3 text-right">Amount</th>
                                            <th className="p-3">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-700">
                                        {taxLiabilities.map((tax, i) => (
                                            <tr key={i} className="hover:bg-gray-800/50">
                                                <td className="p-3">{tax.jurisdiction}</td>
                                                <td className="p-3">{tax.taxType}</td>
                                                <td className="p-3 text-right font-mono text-white">{formatCurrency(tax.estimatedAmount)}</td>
                                                <td className="p-3">
                                                    <span className={`px-2 py-1 rounded text-xs font-bold ${tax.status === 'Paid' ? 'bg-green-900 text-green-300' : 'bg-yellow-900 text-yellow-300'}`}>
                                                        {tax.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </Card>
                        </div>
                    </>
                )}

                {/* OPERATIONS TAB */}
                {activeTab === 'Operations' && (
                    <>
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            <Card title="Daily Transaction Volume" className="lg:col-span-2 h-96">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={dailyVolume}>
                                        <XAxis dataKey="date" stroke="#6b7280" fontSize={10} tickFormatter={(d) => d.substring(5)} />
                                        <YAxis yAxisId="left" stroke="#3b82f6" fontSize={12} tickFormatter={(val) => `$${val/1000}k`} />
                                        <YAxis yAxisId="right" orientation="right" stroke="#10b981" fontSize={12} />
                                        <Tooltip contentStyle={{ backgroundColor: '#1f2937' }} />
                                        <Bar yAxisId="left" dataKey="value" fill="#3b82f6" name="Volume ($)" opacity={0.8} />
                                        <Bar yAxisId="right" dataKey="secondaryValue" fill="#10b981" name="Count" barSize={10} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </Card>
                            <Card title="Top Vendor Ecosystem" className="h-96 overflow-auto">
                                <div className="space-y-4">
                                    {topVendors.map((vendor, i) => (
                                        <div key={i} className="flex items-center justify-between p-3 bg-gray-800 rounded border border-gray-700">
                                            <div>
                                                <div className="font-bold text-white">{vendor.vendor}</div>
                                                <div className="text-xs text-gray-500">{vendor.transactionCount} txns • Risk: {vendor.riskScore}/100</div>
                                            </div>
                                            <div className="text-right">
                                                <div className="font-mono text-blue-400">{formatCurrency(vendor.totalSpend)}</div>
                                                <div className="text-xs text-gray-500">Avg: {formatCurrency(vendor.avgTransactionValue)}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </Card>
                        </div>
                    </>
                )}

                {/* RISK TAB */}
                {activeTab === 'Risk' && (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <MetricCard title="Compliance Score" value="94.2" subtext="Top 5% Industry" color="green" />
                            <MetricCard title="Open Cases" value={openComplianceCases.length.toString()} subtext="Requires Attention" color="yellow" />
                            <MetricCard title="Total Risk Exposure" value={formatCurrency(riskHeatmap.reduce((a,b)=>a+b.exposureValue,0))} color="red" />
                            <MetricCard title="Audit Anomalies" value="3" subtext="Last 24 Hours" color="purple" />
                        </div>
                        
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <Card title="Enterprise Risk Heatmap" className="h-96">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={riskHeatmap} layout="vertical" margin={{ left: 40 }}>
                                        <XAxis type="number" domain={[0, 1]} hide />
                                        <YAxis type="category" dataKey="riskCategory" stroke="#9ca3af" width={120} fontSize={11} />
                                        <Tooltip cursor={{fill: 'transparent'}} content={({ active, payload }) => {
                                            if (active && payload && payload.length) {
                                                const data = payload[0].payload;
                                                return (
                                                    <div className="bg-gray-900 border border-gray-700 p-3 rounded shadow-xl">
                                                        <p className="font-bold text-white">{data.riskCategory}</p>
                                                        <p className="text-sm text-gray-400">Prob: {(data.probability * 100).toFixed(0)}% | Impact: {(data.impact * 100).toFixed(0)}%</p>
                                                        <p className="text-sm text-red-400">Exposure: {formatCurrency(data.exposureValue)}</p>
                                                    </div>
                                                );
                                            }
                                            return null;
                                        }} />
                                        <Bar dataKey="probability" name="Probability" stackId="a" fill="#f59e0b" barSize={20} />
                                        <Bar dataKey="impact" name="Impact" stackId="a" fill="#ef4444" barSize={20} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </Card>
                            <Card title="Compliance Case Log" className="h-96 overflow-auto">
                                <div className="space-y-2">
                                    {complianceCases.map((c, i) => (
                                        <div key={i} className="p-3 border-l-4 border-red-500 bg-gray-800/50 rounded flex justify-between items-center">
                                            <div>
                                                <div className="font-bold text-sm text-white">{c.type} Violation</div>
                                                <div className="text-xs text-gray-500">{c.description}</div>
                                            </div>
                                            <span className={`px-2 py-1 text-xs rounded font-bold ${c.status === 'open' ? 'bg-red-900 text-red-200' : 'bg-gray-700 text-gray-300'}`}>
                                                {c.status.toUpperCase()}
                                            </span>
                                        </div>
                                    ))}
                                    {complianceCases.length === 0 && <div className="text-center text-gray-500 py-10">No active compliance cases detected. Systems nominal.</div>}
                                </div>
                            </Card>
                        </div>
                    </>
                )}

                {/* STRATEGY TAB */}
                {activeTab === 'Strategy' && (
                    <div className="grid grid-cols-1 gap-6">
                        <Card title="Strategic Growth Modeling" className="p-8 bg-gradient-to-br from-gray-800 to-gray-900">
                            <div className="flex flex-col md:flex-row gap-8">
                                <div className="flex-1 space-y-6">
                                    <h3 className="text-2xl font-bold text-white">Scenario Analysis: Aggressive Expansion</h3>
                                    <p className="text-gray-400">
                                        Based on current liquidity of {formatCurrency(financialRatios[0].value * 1000000)} and a burn rate of {formatCurrency(financialRatios[2].value)}, 
                                        the enterprise can sustain a 15% increase in R&D spend for 8 months before requiring additional capital injection.
                                    </p>
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-sm text-gray-300">
                                            <span>Market Penetration Probability</span>
                                            <span>78%</span>
                                        </div>
                                        <div className="w-full bg-gray-700 rounded-full h-2">
                                            <div className="bg-blue-500 h-2 rounded-full" style={{ width: '78%' }}></div>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-sm text-gray-300">
                                            <span>Regulatory Approval Confidence</span>
                                            <span>92%</span>
                                        </div>
                                        <div className="w-full bg-gray-700 rounded-full h-2">
                                            <div className="bg-green-500 h-2 rounded-full" style={{ width: '92%' }}></div>
                                        </div>
                                    </div>
                                </div>
                                <div className="w-full md:w-1/3 bg-gray-800 p-6 rounded-xl border border-gray-700">
                                    <h4 className="font-bold text-white mb-4">AI Recommendation Engine</h4>
                                    <ul className="space-y-4">
                                        <li className="flex items-start space-x-3">
                                            <span className="text-green-400 text-xl">✓</span>
                                            <span className="text-sm text-gray-300">Optimize vendor contracts to reduce variable OPEX by 12%.</span>
                                        </li>
                                        <li className="flex items-start space-x-3">
                                            <span className="text-green-400 text-xl">✓</span>
                                            <span className="text-sm text-gray-300">Accelerate receivables collection to improve DSO by 5 days.</span>
                                        </li>
                                        <li className="flex items-start space-x-3">
                                            <span className="text-yellow-400 text-xl">⚠</span>
                                            <span className="text-sm text-gray-300">Monitor geopolitical risk in supply chain region APAC-1.</span>
                                        </li>
                                    </ul>
                                    <button className="w-full mt-6 bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded transition-colors" onClick={() => setActiveView && setActiveView(View.Budgets)}>
                                        Adjust Budgets
                                    </button>
                                </div>
                            </div>
                        </Card>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CorporateCommandView;


================================================================================
// APPENDED FROM REPO: diplomat-bit/Fuckyou | ORIGINAL PATH: diplomat-bit-Fuckyou-70f83c5/components/CorporateCommandView (2).tsx
================================================================================



================================================================================
// APPENDED FROM REPO: diplomat-bit/Fuckyou | ORIGINAL PATH: diplomat-bit-Fuckyou-70f83c5/components/CorporateCommandView (4).tsx
================================================================================

import React, { useContext, useState, useEffect } from 'react';
import { DataContext } from '../context/DataContext';
import Card from './Card';
import { View, PaymentOrder, Invoice, ComplianceCase, CorporateTransaction } from '../types';
import { GoogleGenAI } from '@google/genai';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, Legend, PieChart, Pie, Cell } from 'recharts';

// Analytics Data Structures

export type TimeSeriesData = {
    date: string;
    value: number;
    secondaryValue?: number;
    tertiaryValue?: number;
};

export type CategoricalData = {
    category: string;
    value: number;
    percentage?: number;
    color?: string;
};

export type FinancialRatio = {
    name: string;
    value: number;
    benchmark: number;
    status: 'Healthy' | 'Warning' | 'Critical';
    delta: number;
};

export type VendorPerformanceMetric = {
    vendor: string;
    totalSpend: number;
    transactionCount: number;
    avgTransactionValue: number;
    riskScore: number;
    lastInteraction: string;
};

export type DepartmentalKPI = {
    department: string;
    budgetUtilization: number;
    operationalEfficiency: number;
    complianceScore: number;
    headcountSpend: number;
};

export type RiskAssessmentData = {
    riskCategory: string;
    probability: number;
    impact: number;
    mitigationStatus: string;
    exposureValue: number;
};

export type CashFlowProjection = {
    period: string;
    inflow: number;
    outflow: number;
    netPosition: number;
    cumulativeCash: number;
};

export type AuditLogEntry = {
    timestamp: string;
    user: string;
    action: string;
    severity: 'Low' | 'Medium' | 'High' | 'Critical';
    details: string;
};

export type TaxLiabilityBreakdown = {
    jurisdiction: string;
    taxType: string;
    estimatedAmount: number;
    dueDate: string;
    status: 'Accrued' | 'Paid' | 'Pending';
};

// Data Processing Functions

/**
 * Generates daily transaction volume and amount analytics.
 */
export const generateDailyTransactionAnalytics = (transactions: CorporateTransaction[]): TimeSeriesData[] => {
    const dailyMap: Record<string, { count: number; amount: number }> = {};
    transactions.forEach(tx => {
        const date = new Date(tx.date).toISOString().split('T')[0];
        if (!dailyMap[date]) dailyMap[date] = { count: 0, amount: 0 };
        dailyMap[date].count++;
        dailyMap[date].amount += tx.amount;
    });
    return Object.entries(dailyMap)
        .map(([date, data]) => ({ date, value: data.amount, secondaryValue: data.count }))
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
};

/**
 * Calculates key financial ratios.
 */
export const calculateEnterpriseFinancialRatios = (invoices: Invoice[], orders: PaymentOrder[], transactions: CorporateTransaction[]): FinancialRatio[] => {
    const currentAssets = invoices.filter(i => i.status !== 'paid').reduce((sum, i) => sum + i.amount, 0);
    const currentLiabilities = orders.filter(o => o.status !== 'paid').reduce((sum, o) => sum + o.amount, 0);
    const totalRevenue = invoices.filter(i => i.status === 'paid').reduce((sum, i) => sum + i.amount, 0);
    const totalExpenses = transactions.reduce((sum, t) => sum + t.amount, 0);
    
    const currentRatio = currentLiabilities > 0 ? currentAssets / currentLiabilities : 0;
    const netProfitMargin = totalRevenue > 0 ? ((totalRevenue - totalExpenses) / totalRevenue) * 100 : 0;
    const burnRate = totalExpenses / 30; // Simplified 30-day period for calculation
    
    return [
        { name: 'Current Ratio', value: currentRatio, benchmark: 1.5, status: currentRatio > 1.5 ? 'Healthy' : currentRatio > 1.0 ? 'Warning' : 'Critical', delta: 0.1 },
        { name: 'Net Profit Margin', value: netProfitMargin, benchmark: 20, status: netProfitMargin > 20 ? 'Healthy' : netProfitMargin > 10 ? 'Warning' : 'Critical', delta: -2.5 },
        { name: 'Daily Burn Rate', value: burnRate, benchmark: 5000, status: burnRate < 5000 ? 'Healthy' : 'Warning', delta: 12.4 }
    ];
};

/**
 * Projects cash flow for the next 6 periods.
 */
export const generateCashFlowProjections = (invoices: Invoice[], orders: PaymentOrder[]): CashFlowProjection[] => {
    const projections: CashFlowProjection[] = [];
    const today = new Date();
    let currentCash = 1000000; // Initial capital assumption

    for (let i = 0; i < 6; i++) {
        const futureDate = new Date(today);
        futureDate.setMonth(today.getMonth() + i);
        const periodKey = futureDate.toISOString().substring(0, 7);
        
        // Estimated inflows from receivables
        const projectedInflow = invoices
            .filter(inv => new Date(inv.dueDate).getMonth() === futureDate.getMonth())
            .reduce((sum, inv) => sum + inv.amount, 0) * 0.95; // Assumed 95% collection rate

        // Estimated outflows from payables and recurring expenses
        const projectedOutflow = orders
            .filter(ord => new Date(ord.dueDate || '').getMonth() === futureDate.getMonth())
            .reduce((sum, ord) => sum + ord.amount, 0) * 1.1; // Assumed 10% buffer for variable costs

        const net = projectedInflow - projectedOutflow;
        currentCash += net;

        projections.push({
            period: periodKey,
            inflow: projectedInflow,
            outflow: projectedOutflow,
            netPosition: net,
            cumulativeCash: currentCash
        });
    }
    return projections;
};

/**
 * Analyzes vendor performance and spend.
 */
export const analyzeVendorEcosystem = (transactions: CorporateTransaction[]): VendorPerformanceMetric[] => {
    const vendorMap: Record<string, VendorPerformanceMetric> = {};
    
    transactions.forEach(tx => {
        if (!vendorMap[tx.merchant]) {
            vendorMap[tx.merchant] = {
                vendor: tx.merchant,
                totalSpend: 0,
                transactionCount: 0,
                avgTransactionValue: 0,
                riskScore: Math.floor(Math.random() * 100), // Simulated risk score
                lastInteraction: tx.date
            };
        }
        const v = vendorMap[tx.merchant];
        v.totalSpend += tx.amount;
        v.transactionCount++;
        v.avgTransactionValue = v.totalSpend / v.transactionCount;
        if (new Date(tx.date) > new Date(v.lastInteraction)) {
            v.lastInteraction = tx.date;
        }
    });

    return Object.values(vendorMap).sort((a, b) => b.totalSpend - a.totalSpend);
};

/**
 * Segments operational spend into categories.
 */
export const segmentOperationalSpend = (transactions: CorporateTransaction[]): CategoricalData[] => {
    const categories = {
        'Fixed Infrastructure': 0,
        'Variable COGS': 0,
        'R&D Investment': 0,
        'Sales & Marketing': 0,
        'G&A': 0
    };

    transactions.forEach(tx => {
        if (tx.merchant.includes('Rent') || tx.merchant.includes('AWS') || tx.merchant.includes('Server')) categories['Fixed Infrastructure'] += tx.amount;
        else if (tx.merchant.includes('Supplier') || tx.merchant.includes('Logistics')) categories['Variable COGS'] += tx.amount;
        else if (tx.description.includes('Research') || tx.description.includes('Lab')) categories['R&D Investment'] += tx.amount;
        else if (tx.merchant.includes('Ads') || tx.merchant.includes('Google') || tx.merchant.includes('Facebook')) categories['Sales & Marketing'] += tx.amount;
        else categories['G&A'] += tx.amount;
    });

    return Object.entries(categories).map(([category, value]) => ({ category, value }));
};

/**
 * Estimates tax liabilities.
 */
export const estimateTaxLiabilities = (revenue: number, expenses: number): TaxLiabilityBreakdown[] => {
    const profit = Math.max(0, revenue - expenses);
    return [
        { jurisdiction: 'Federal', taxType: 'Corporate Income Tax', estimatedAmount: profit * 0.21, dueDate: '2024-04-15', status: 'Accrued' },
        { jurisdiction: 'State (CA)', taxType: 'Franchise Tax', estimatedAmount: profit * 0.0884, dueDate: '2024-04-15', status: 'Accrued' },
        { jurisdiction: 'International', taxType: 'VAT/GST', estimatedAmount: revenue * 0.05, dueDate: 'Monthly', status: 'Pending' },
        { jurisdiction: 'Local', taxType: 'Payroll Tax', estimatedAmount: expenses * 0.0765, dueDate: 'Bi-Weekly', status: 'Paid' }
    ];
};

/**
 * Generates risk assessment data.
 */
export const generateEnterpriseRiskHeatmap = (cases: ComplianceCase[], transactions: CorporateTransaction[]): RiskAssessmentData[] => {
    const risks: RiskAssessmentData[] = [
        { riskCategory: 'AML/KYC', probability: 0.15, impact: 0.9, mitigationStatus: 'Monitoring', exposureValue: 500000 },
        { riskCategory: 'Data Privacy (GDPR)', probability: 0.05, impact: 0.95, mitigationStatus: 'Controlled', exposureValue: 2000000 },
        { riskCategory: 'Vendor Fraud', probability: 0.2, impact: 0.4, mitigationStatus: 'Active Investigation', exposureValue: 150000 },
        { riskCategory: 'Tax Compliance', probability: 0.1, impact: 0.7, mitigationStatus: 'Audited', exposureValue: 750000 },
        { riskCategory: 'Cybersecurity', probability: 0.3, impact: 0.99, mitigationStatus: 'Hardened', exposureValue: 5000000 }
    ];

    // Adjusts risk based on data
    if (cases.some(c => c.type === 'AML')) risks[0].probability += 0.2;
    if (transactions.some(t => t.amount > 50000)) risks[2].probability += 0.1;

    return risks;
};

// Main Component

interface CorporateDashboardProps {
    setActiveView?: (view: View) => void;
}

const CorporateCommandView: React.FC<CorporateDashboardProps> = ({ setActiveView }) => {
    const context = useContext(DataContext);
    
    // State Management
    const [activeTab, setActiveTab] = useState<'Overview' | 'Finance' | 'Operations' | 'Risk' | 'Strategy'>('Overview');
    const [aiInsight, setAiInsight] = useState<string>('Initializing AI...');
    const [isAiProcessing, setIsAiProcessing] = useState<boolean>(false);
    const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

    if (!context) throw new Error("CorporateCommandView requires DataContext.");
    const { paymentOrders, invoices, complianceCases, corporateTransactions } = context;

    // Data Aggregation
    
    // Financials
    const totalRevenue = invoices.filter(i => i.status === 'paid').reduce((acc, i) => acc + i.amount, 0);
    const totalExpenses = corporateTransactions.reduce((acc, t) => acc + t.amount, 0);
    const netIncome = totalRevenue - totalExpenses;
    const financialRatios = calculateEnterpriseFinancialRatios(invoices, paymentOrders, corporateTransactions);
    const cashFlowForecast = generateCashFlowProjections(invoices, paymentOrders);
    const taxLiabilities = estimateTaxLiabilities(totalRevenue, totalExpenses);

    // Operations
    const dailyVolume = generateDailyTransactionAnalytics(corporateTransactions);
    const operationalSpend = segmentOperationalSpend(corporateTransactions);
    const vendorMetrics = analyzeVendorEcosystem(corporateTransactions);
    const topVendors = vendorMetrics.slice(0, 5);
    
    // Risk
    const riskHeatmap = generateEnterpriseRiskHeatmap(complianceCases, corporateTransactions);
    const openComplianceCases = complianceCases.filter(c => c.status === 'open');
    const criticalRisks = riskHeatmap.filter(r => r.probability * r.impact > 0.15);

    // AI Integration
    useEffect(() => {
        const generateStrategicReport = async () => {
            setIsAiProcessing(true);
            try {
                const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
                
                let promptContext = '';
                if (activeTab === 'Overview') {
                    promptContext = `Executive Summary: Revenue $${totalRevenue}, Expenses $${totalExpenses}, Net Income $${netIncome}. Critical Risks: ${criticalRisks.length}. Top Vendor: ${topVendors[0]?.vendor}.`;
                } else if (activeTab === 'Finance') {
                    promptContext = `Financial Deep Dive: Current Ratio ${financialRatios[0].value.toFixed(2)}, Net Margin ${financialRatios[1].value.toFixed(2)}%. Cash Flow Trend: ${cashFlowForecast[0].netPosition > 0 ? 'Positive' : 'Negative'}. Tax Liability: $${taxLiabilities.reduce((s, t) => s + t.estimatedAmount, 0).toFixed(2)}.`;
                } else if (activeTab === 'Operations') {
                    promptContext = `Ops Report: Transaction Volume ${dailyVolume.length} days active. Top Spend Category: ${operationalSpend.sort((a,b) => b.value - a.value)[0]?.category}. Vendor Count: ${vendorMetrics.length}.`;
                } else if (activeTab === 'Risk') {
                    promptContext = `Risk Assessment: Open Cases ${openComplianceCases.length}. Highest Risk Category: ${riskHeatmap.sort((a,b) => b.probability - a.probability)[0]?.riskCategory}. Exposure: $${riskHeatmap.reduce((s,r) => s + r.exposureValue, 0)}.`;
                } else {
                    promptContext = `Strategic Outlook: Based on burn rate of $${financialRatios[2].value.toFixed(2)}/day and projected cash flow. Suggest 3 strategic moves for growth and stability.`;
                }

                const prompt = `You are an advanced Corporate AI Assistant. Analyze the following data context for the '${activeTab}' view and provide a high-level, professional, actionable strategic insight (max 2 sentences). Context: ${promptContext}`;
                
                const response = await ai.models.generateContent({
                    model: 'gemini-2.5-flash',
                    contents: prompt,
                });
                setAiInsight(response.text);
                setLastUpdated(new Date());
            } catch (error) {
                console.error("AI Processing Error:", error);
                setAiInsight("AI link unavailable. Using fallback data.");
            } finally {
                setIsAiProcessing(false);
            }
        };

        generateStrategicReport();
    }, [activeTab, totalRevenue, totalExpenses, netIncome]);

    // Visualization Utilities
    const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#6366f1'];
    
    const formatCurrency = (val: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', notation: 'compact' }).format(val);
    const formatNumber = (val: number) => new Intl.NumberFormat('en-US', { notation: 'compact' }).format(val);

    // Inline Sub-Components
    
    const TabButton = ({ id, label }: { id: typeof activeTab, label: string }) => (
        <button 
            onClick={() => setActiveTab(id)}
            className={`px-6 py-3 text-sm font-bold tracking-wide transition-all duration-200 border-b-2 ${
                activeTab === id 
                ? 'border-blue-500 text-white bg-gray-800/50' 
                : 'border-transparent text-gray-400 hover:text-white hover:bg-gray-800/30'
            }`}
        >
            {label}
        </button>
    );

    const MetricCard: React.FC<{ title: string, value: string, subtext?: string, trend?: number, color?: string }> = ({ title, value, subtext, trend, color = 'blue' }) => (
        <div className={`bg-gray-800 border border-gray-700 p-6 rounded-xl shadow-lg relative overflow-hidden group hover:border-${color}-500 transition-colors`}>
            <div className={`absolute top-0 right-0 w-24 h-24 bg-${color}-500/10 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110`} />
            <h3 className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-2">{title}</h3>
            <div className="text-3xl font-bold text-white mb-1">{value}</div>
            {subtext && <div className="text-gray-500 text-sm">{subtext}</div>}
            {trend !== undefined && (
                <div className={`text-sm font-medium mt-3 flex items-center ${trend >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {trend >= 0 ? 'â†‘' : 'â†“'} {Math.abs(trend)}% <span className="text-gray-600 ml-1">vs last period</span>
                </div>
            )}
        </div>
    );

    // Component Rendering

    return (
        <div className="min-h-screen bg-gray-900 text-white p-2 space-y-8 font-sans">
            
            {/* HEADER & NAVIGATION */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-gray-800 pb-6">
                <div>
                    <h1 className="text-4xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
                        NEXUS COMMAND
                    </h1>
                    <p className="text-gray-400 text-sm mt-1">Enterprise Operating System v4.2.0 â€¢ {lastUpdated.toLocaleString()}</p>
                </div>
                <div className="flex space-x-1 mt-4 md:mt-0 bg-gray-900 rounded-lg p-1 border border-gray-800">
                    <TabButton id="Overview" label="EXECUTIVE" />
                    <TabButton id="Finance" label="FINANCE" />
                    <TabButton id="Operations" label="OPERATIONS" />
                    <TabButton id="Risk" label="RISK & COMPLIANCE" />
                    <TabButton id="Strategy" label="STRATEGY" />
                </div>
            </div>

            {/* AI INSIGHT BAR */}
            <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 blur-xl rounded-lg" />
                <Card className="relative bg-gray-800/80 backdrop-blur border border-blue-500/30 p-6">
                    <div className="flex items-start space-x-4">
                        <div className="p-3 bg-blue-500/10 rounded-full animate-pulse">
                            <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                        </div>
                        <div className="flex-1">
                            <h3 className="text-blue-400 text-xs font-bold uppercase tracking-widest mb-1">AI Strategic Intelligence</h3>
                            {isAiProcessing ? (
                                <div className="h-6 bg-gray-700 rounded w-3/4 animate-pulse" />
                            ) : (
                                <p className="text-lg text-gray-100 leading-relaxed font-light">"{aiInsight}"</p>
                            )}
                        </div>
                    </div>
                </Card>
            </div>

            {/* DYNAMIC CONTENT AREA */}
            <div className="space-y-8 animate-fade-in">
                
                {/* OVERVIEW TAB */}
                {activeTab === 'Overview' && (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <MetricCard title="Total Revenue (YTD)" value={formatCurrency(totalRevenue)} trend={12.5} color="green" />
                            <MetricCard title="Net Income" value={formatCurrency(netIncome)} trend={8.2} color="blue" />
                            <MetricCard title="Active Risks" value={criticalRisks.length.toString()} subtext="Critical Severity" trend={-5.0} color="red" />
                            <MetricCard title="Cash Runway" value="14.2 Months" subtext="Based on current burn" color="purple" />
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-96">
                            <Card title="Revenue vs Expenses Trend" className="lg:col-span-2 h-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={cashFlowForecast}>
                                        <XAxis dataKey="period" stroke="#6b7280" fontSize={12} />
                                        <YAxis stroke="#6b7280" fontSize={12} tickFormatter={(val) => `$${val/1000}k`} />
                                        <Tooltip contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151', color: '#fff' }} />
                                        <Legend />
                                        <Bar dataKey="inflow" name="Inflow" fill="#10b981" radius={[4, 4, 0, 0]} />
                                        <Bar dataKey="outflow" name="Outflow" fill="#ef4444" radius={[4, 4, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </Card>
                            <Card title="Operational Spend Mix" className="h-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie data={operationalSpend} dataKey="value" nameKey="category" cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5}>
                                            {operationalSpend.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                        <Legend verticalAlign="bottom" height={36} />
                                    </PieChart>
                                </ResponsiveContainer>
                            </Card>
                        </div>
                    </>
                )}

                {/* FINANCE TAB */}
                {activeTab === 'Finance' && (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {financialRatios.map((ratio, idx) => (
                                <MetricCard 
                                    key={idx} 
                                    title={ratio.name} 
                                    value={typeof ratio.value === 'number' && ratio.value < 100 ? ratio.value.toFixed(2) : formatNumber(ratio.value)} 
                                    subtext={`Benchmark: ${ratio.benchmark}`}
                                    trend={ratio.delta}
                                    color={ratio.status === 'Healthy' ? 'green' : ratio.status === 'Warning' ? 'yellow' : 'red'}
                                />
                            ))}
                        </div>
                        
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <Card title="Projected Cash Position (6 Months)" className="h-80">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={cashFlowForecast}>
                                        <XAxis dataKey="period" stroke="#6b7280" />
                                        <YAxis stroke="#6b7280" tickFormatter={(val) => `$${val/1000}k`} />
                                        <Tooltip cursor={{fill: '#374151'}} contentStyle={{ backgroundColor: '#1f2937' }} />
                                        <Bar dataKey="cumulativeCash" fill="#3b82f6" name="Cash Balance" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </Card>
                            <Card title="Estimated Tax Liability Breakdown" className="h-80 overflow-auto">
                                <table className="w-full text-left text-sm text-gray-400">
                                    <thead className="bg-gray-800 text-gray-200 uppercase font-bold">
                                        <tr>
                                            <th className="p-3">Jurisdiction</th>
                                            <th className="p-3">Type</th>
                                            <th className="p-3 text-right">Amount</th>
                                            <th className="p-3">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-700">
                                        {taxLiabilities.map((tax, i) => (
                                            <tr key={i} className="hover:bg-gray-800/50">
                                                <td className="p-3">{tax.jurisdiction}</td>
                                                <td className="p-3">{tax.taxType}</td>
                                                <td className="p-3 text-right font-mono text-white">{formatCurrency(tax.estimatedAmount)}</td>
                                                <td className="p-3">
                                                    <span className={`px-2 py-1 rounded text-xs font-bold ${tax.status === 'Paid' ? 'bg-green-900 text-green-300' : 'bg-yellow-900 text-yellow-300'}`}>
                                                        {tax.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </Card>
                        </div>
                    </>
                )}

                {/* OPERATIONS TAB */}
                {activeTab === 'Operations' && (
                    <>
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            <Card title="Daily Transaction Volume" className="lg:col-span-2 h-96">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={dailyVolume}>
                                        <XAxis dataKey="date" stroke="#6b7280" fontSize={10} tickFormatter={(d) => d.substring(5)} />
                                        <YAxis yAxisId="left" stroke="#3b82f6" fontSize={12} tickFormatter={(val) => `$${val/1000}k`} />
                                        <YAxis yAxisId="right" orientation="right" stroke="#10b981" fontSize={12} />
                                        <Tooltip contentStyle={{ backgroundColor: '#1f2937' }} />
                                        <Bar yAxisId="left" dataKey="value" fill="#3b82f6" name="Volume ($)" opacity={0.8} />
                                        <Bar yAxisId="right" dataKey="secondaryValue" fill="#10b981" name="Count" barSize={10} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </Card>
                            <Card title="Top Vendor Ecosystem" className="h-96 overflow-auto">
                                <div className="space-y-4">
                                    {topVendors.map((vendor, i) => (
                                        <div key={i} className="flex items-center justify-between p-3 bg-gray-800 rounded border border-gray-700">
                                            <div>
                                                <div className="font-bold text-white">{vendor.vendor}</div>
                                                <div className="text-xs text-gray-500">{vendor.transactionCount} txns â€¢ Risk: {vendor.riskScore}/100</div>
                                            </div>
                                            <div className="text-right">
                                                <div className="font-mono text-blue-400">{formatCurrency(vendor.totalSpend)}</div>
                                                <div className="text-xs text-gray-500">Avg: {formatCurrency(vendor.avgTransactionValue)}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </Card>
                        </div>
                    </>
                )}

                {/* RISK TAB */}
                {activeTab === 'Risk' && (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <MetricCard title="Compliance Score" value="94.2" subtext="Top 5% Industry" color="green" />
                            <MetricCard title="Open Cases" value={openComplianceCases.length.toString()} subtext="Requires Attention" color="yellow" />
                            <MetricCard title="Total Risk Exposure" value={formatCurrency(riskHeatmap.reduce((a,b)=>a+b.exposureValue,0))} color="red" />
                            <MetricCard title="Audit Anomalies" value="3" subtext="Last 24 Hours" color="purple" />
                        </div>
                        
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <Card title="Enterprise Risk Heatmap" className="h-96">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={riskHeatmap} layout="vertical" margin={{ left: 40 }}>
                                        <XAxis type="number" domain={[0, 1]} hide />
                                        <YAxis type="category" dataKey="riskCategory" stroke="#9ca3af" width={120} fontSize={11} />
                                        <Tooltip cursor={{fill: 'transparent'}} content={({ active, payload }) => {
                                            if (active && payload && payload.length) {
                                                const data = payload[0].payload;
                                                return (
                                                    <div className="bg-gray-900 border border-gray-700 p-3 rounded shadow-xl">
                                                        <p className="font-bold text-white">{data.riskCategory}</p>
                                                        <p className="text-sm text-gray-400">Prob: {(data.probability * 100).toFixed(0)}% | Impact: {(data.impact * 100).toFixed(0)}%</p>
                                                        <p className="text-sm text-red-400">Exposure: {formatCurrency(data.exposureValue)}</p>
                                                    </div>
                                                );
                                            }
                                            return null;
                                        }} />
                                        <Bar dataKey="probability" name="Probability" stackId="a" fill="#f59e0b" barSize={20} />
                                        <Bar dataKey="impact" name="Impact" stackId="a" fill="#ef4444" barSize={20} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </Card>
                            <Card title="Compliance Case Log" className="h-96 overflow-auto">
                                <div className="space-y-2">
                                    {complianceCases.map((c, i) => (
                                        <div key={i} className="p-3 border-l-4 border-red-500 bg-gray-800/50 rounded flex justify-between items-center">
                                            <div>
                                                <div className="font-bold text-sm text-white">{c.type} Violation</div>
                                                <div className="text-xs text-gray-500">{c.description}</div>
                                            </div>
                                            <span className={`px-2 py-1 text-xs rounded font-bold ${c.status === 'open' ? 'bg-red-900 text-red-200' : 'bg-gray-700 text-gray-300'}`}>
                                                {c.status.toUpperCase()}
                                            </span>
                                        </div>
                                    ))}
                                    {complianceCases.length === 0 && <div className="text-center text-gray-500 py-10">No active compliance cases detected. Systems nominal.</div>}
                                </div>
                            </Card>
                        </div>
                    </>
                )}

                {/* STRATEGY TAB */}
                {activeTab === 'Strategy' && (
                    <div className="grid grid-cols-1 gap-6">
                        <Card title="Strategic Growth Modeling" className="p-8 bg-gradient-to-br from-gray-800 to-gray-900">
                            <div className="flex flex-col md:flex-row gap-8">
                                <div className="flex-1 space-y-6">
                                    <h3 className="text-2xl font-bold text-white">Scenario Analysis: Aggressive Expansion</h3>
                                    <p className="text-gray-400">
                                        Based on current liquidity of {formatCurrency(financialRatios[0].value * 1000000)} and a burn rate of {formatCurrency(financialRatios[2].value)}, 
                                        the enterprise can sustain a 15% increase in R&D spend for 8 months before requiring additional capital injection.
                                    </p>
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-sm text-gray-300">
                                            <span>Market Penetration Probability</span>
                                            <span>78%</span>
                                        </div>
                                        <div className="w-full bg-gray-700 rounded-full h-2">
                                            <div className="bg-blue-500 h-2 rounded-full" style={{ width: '78%' }}></div>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-sm text-gray-300">
                                            <span>Regulatory Approval Confidence</span>
                                            <span>92%</span>
                                        </div>
                                        <div className="w-full bg-gray-700 rounded-full h-2">
                                            <div className="bg-green-500 h-2 rounded-full" style={{ width: '92%' }}></div>
                                        </div>
                                    </div>
                                </div>
                                <div className="w-full md:w-1/3 bg-gray-800 p-6 rounded-xl border border-gray-700">
                                    <h4 className="font-bold text-white mb-4">AI Recommendation Engine</h4>
                                    <ul className="space-y-4">
                                        <li className="flex items-start space-x-3">
                                            <span className="text-green-400 text-xl">âœ“</span>
                                            <span className="text-sm text-gray-300">Optimize vendor contracts to reduce variable OPEX by 12%.</span>
                                        </li>
                                        <li className="flex items-start space-x-3">
                                            <span className="text-green-400 text-xl">âœ“</span>
                                            <span className="text-sm text-gray-300">Accelerate receivables collection to improve DSO by 5 days.</span>
                                        </li>
                                        <li className="flex items-start space-x-3">
                                            <span className="text-yellow-400 text-xl">âš </span>
                                            <span className="text-sm text-gray-300">Monitor geopolitical risk in supply chain region APAC-1.</span>
                                        </li>
                                    </ul>
                                    <button className="w-full mt-6 bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded transition-colors" onClick={() => setActiveView && setActiveView(View.Budgets)}>
                                        Adjust Budgets
                                    </button>
                                </div>
                            </div>
                        </Card>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CorporateCommandView;

================================================================================
// APPENDED FROM REPO: diplomat-bit/Fuckyou | ORIGINAL PATH: diplomat-bit-Fuckyou-70f83c5/components/CorporateCommandView (5).tsx
================================================================================

import React, { useContext, useState, useEffect, useCallback } from 'react';
import { DataContext } from '../context/DataContext';
import Card from './Card';
import { View, PaymentOrder, Invoice, ComplianceCase, CorporateTransaction } from '../types';
import { GoogleGenAI } from '@google/genai';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, Legend, PieChart, Pie, Cell, AreaChart, Area, LineChart, Line } from 'recharts';

// --- EXPANDED DATA STRUCTURES FOR HYPER-DIMENSIONAL ANALYSIS ---

export type TimeSeriesData = { date: string; value: number; secondaryValue?: number; tertiaryValue?: number; };
export type CategoricalData = { category: string; value: number; percentage?: number; color?: string; };
export type FinancialRatio = { name: string; value: number; benchmark: number; status: 'Optimal' | 'Stable' | 'Warning' | 'Critical'; delta: number; };
export type VendorPerformanceMetric = { vendor: string; totalSpend: number; transactionCount: number; avgTransactionValue: number; riskScore: number; lastInteraction: string; };
export type DepartmentalKPI = { department: string; budgetUtilization: number; operationalEfficiency: number; complianceScore: number; headcountSpend: number; };
export type RiskAssessmentData = { riskCategory: string; probability: number; impact: number; velocity: number; mitigationStatus: string; exposureValue: number; };
export type CashFlowProjection = { period: string; inflow: number; outflow: number; netPosition: number; cumulativeCash: number; };
export type AuditLogEntry = { timestamp: string; user: string; action: string; severity: 'Low' | 'Medium' | 'High' | 'Critical'; details: string; };
export type TaxLiabilityBreakdown = { jurisdiction: string; taxType: string; estimatedAmount: number; dueDate: string; status: 'Accrued' | 'Paid' | 'Pending'; };

// High-Frequency Trading & Market Intelligence Structures
export type MarketDataTick = { symbol: string; price: number; change: number; volume: number; timestamp: number; };
export type TradingAlgorithm = { id: string; name: string; strategy: 'Momentum' | 'Arbitrage' | 'Mean Reversion'; status: 'Active' | 'Paused' | 'Terminated'; pnl: number; trades: number; uptime: string; };
export type PortfolioMetrics = { totalValue: number; dailyPnl: number; valueAtRisk: number; sharpeRatio: number; alpha: number; };
export type GlobalMacroIndicator = { name: string; value: number; trend: 'Up' | 'Down' | 'Stable'; impact: 'High' | 'Medium' | 'Low'; region: string; };
export type StrategicInitiative = { id: string; name: string; description: string; budget: number; projectedROI: number; status: 'Planning' | 'Active' | 'Completed'; };

// --- EXPANDED DATA PROCESSING & SIMULATION FUNCTIONS ---

export const generateDailyTransactionAnalytics = (transactions: CorporateTransaction[]): TimeSeriesData[] => {
    const dailyMap: Record<string, { count: number; amount: number }> = {};
    transactions.forEach(tx => {
        const date = new Date(tx.date).toISOString().split('T')[0];
        if (!dailyMap[date]) dailyMap[date] = { count: 0, amount: 0 };
        dailyMap[date].count++;
        dailyMap[date].amount += tx.amount;
    });
    return Object.entries(dailyMap).map(([date, data]) => ({ date, value: data.amount, secondaryValue: data.count })).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
};

export const calculateEnterpriseFinancialRatios = (invoices: Invoice[], orders: PaymentOrder[], transactions: CorporateTransaction[]): FinancialRatio[] => {
    const currentAssets = invoices.filter(i => i.status !== 'paid').reduce((sum, i) => sum + i.amount, 0);
    const currentLiabilities = orders.filter(o => o.status !== 'paid').reduce((sum, o) => sum + o.amount, 0);
    const totalRevenue = invoices.filter(i => i.status === 'paid').reduce((sum, i) => sum + i.amount, 0);
    const totalExpenses = transactions.reduce((sum, t) => sum + t.amount, 0);
    const currentRatio = currentLiabilities > 0 ? currentAssets / currentLiabilities : 0;
    const netProfitMargin = totalRevenue > 0 ? ((totalRevenue - totalExpenses) / totalRevenue) * 100 : 0;
    const burnRate = totalExpenses / 30;
    return [
        { name: 'Current Ratio', value: currentRatio, benchmark: 2.0, status: currentRatio > 2.0 ? 'Optimal' : currentRatio > 1.2 ? 'Stable' : 'Warning', delta: 0.1 },
        { name: 'Net Profit Margin', value: netProfitMargin, benchmark: 20, status: netProfitMargin > 20 ? 'Optimal' : netProfitMargin > 10 ? 'Stable' : 'Warning', delta: -2.5 },
        { name: 'Daily Burn Rate', value: burnRate, benchmark: 5000, status: burnRate < 5000 ? 'Optimal' : 'Warning', delta: 12.4 }
    ];
};

export const generateCashFlowProjections = (invoices: Invoice[], orders: PaymentOrder[]): CashFlowProjection[] => {
    const projections: CashFlowProjection[] = [];
    let currentCash = 1000000;
    for (let i = 0; i < 12; i++) { // Extended to 12 months
        const futureDate = new Date(); futureDate.setMonth(futureDate.getMonth() + i);
        const periodKey = futureDate.toISOString().substring(0, 7);
        const projectedInflow = invoices.filter(inv => new Date(inv.dueDate).getMonth() === futureDate.getMonth()).reduce((sum, inv) => sum + inv.amount, 0) * 0.95;
        const projectedOutflow = orders.filter(ord => new Date(ord.dueDate || '').getMonth() === futureDate.getMonth()).reduce((sum, ord) => sum + ord.amount, 0) * 1.1;
        const net = projectedInflow - projectedOutflow;
        currentCash += net;
        projections.push({ period: periodKey, inflow: projectedInflow, outflow: projectedOutflow, netPosition: net, cumulativeCash: currentCash });
    }
    return projections;
};

export const analyzeVendorEcosystem = (transactions: CorporateTransaction[]): VendorPerformanceMetric[] => {
    const vendorMap: Record<string, VendorPerformanceMetric> = {};
    transactions.forEach(tx => {
        if (!vendorMap[tx.merchant]) vendorMap[tx.merchant] = { vendor: tx.merchant, totalSpend: 0, transactionCount: 0, avgTransactionValue: 0, riskScore: Math.floor(Math.random() * 100), lastInteraction: tx.date };
        const v = vendorMap[tx.merchant];
        v.totalSpend += tx.amount; v.transactionCount++; v.avgTransactionValue = v.totalSpend / v.transactionCount;
        if (new Date(tx.date) > new Date(v.lastInteraction)) v.lastInteraction = tx.date;
    });
    return Object.values(vendorMap).sort((a, b) => b.totalSpend - a.totalSpend);
};

export const segmentOperationalSpend = (transactions: CorporateTransaction[]): CategoricalData[] => {
    const categories = { 'Infrastructure': 0, 'COGS': 0, 'R&D': 0, 'S&M': 0, 'G&A': 0, 'Quantum Computing': 0 };
    transactions.forEach(tx => {
        if (tx.merchant.includes('AWS') || tx.merchant.includes('Server')) categories['Infrastructure'] += tx.amount;
        else if (tx.merchant.includes('Supplier')) categories['COGS'] += tx.amount;
        else if (tx.description.includes('Research')) categories['R&D'] += tx.amount;
        else if (tx.merchant.includes('Ads')) categories['S&M'] += tx.amount;
        else if (tx.description.includes('Quantum')) categories['Quantum Computing'] += tx.amount;
        else categories['G&A'] += tx.amount;
    });
    return Object.entries(categories).map(([category, value]) => ({ category, value }));
};

export const generateEnterpriseRiskHeatmap = (cases: ComplianceCase[], transactions: CorporateTransaction[]): RiskAssessmentData[] => {
    const risks: RiskAssessmentData[] = [
        { riskCategory: 'AML/KYC', probability: 0.15, impact: 0.9, velocity: 0.8, mitigationStatus: 'Monitoring', exposureValue: 500000 },
        { riskCategory: 'Cybersecurity', probability: 0.3, impact: 0.99, velocity: 0.9, mitigationStatus: 'Hardened', exposureValue: 5000000 },
        { riskCategory: 'Geopolitical', probability: 0.4, impact: 0.7, velocity: 0.5, mitigationStatus: 'Contingency Plan', exposureValue: 1200000 },
        { riskCategory: 'Market Volatility', probability: 0.6, impact: 0.5, velocity: 0.95, mitigationStatus: 'Hedged', exposureValue: 2500000 },
        { riskCategory: 'AI Model Drift', probability: 0.25, impact: 0.8, velocity: 0.6, mitigationStatus: 'Continuous Training', exposureValue: 900000 },
    ];
    if (cases.some(c => c.type === 'AML')) risks[0].probability += 0.2;
    if (transactions.some(t => t.amount > 50000)) risks[1].probability += 0.1;
    return risks;
};

// --- MAIN COMPONENT: NEXUS COMMAND ---

interface CorporateDashboardProps { setActiveView: (view: View) => void; }

const CorporateCommandView: React.FC<CorporateDashboardProps> = ({ setActiveView }) => {
    const context = useContext(DataContext);
    if (!context) throw new Error("CorporateCommandView requires DataContext.");
    const { paymentOrders, invoices, complianceCases, corporateTransactions } = context;

    // State Management
    const [activeTab, setActiveTab] = useState<'Overview' | 'Finance' | 'Operations' | 'Risk' | 'Strategy' | 'Markets'>('Overview');
    const [aiInsight, setAiInsight] = useState<string>('Initializing AI...');
    const [isAiProcessing, setIsAiProcessing] = useState<boolean>(false);
    const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
    const [marketData, setMarketData] = useState<MarketDataTick[]>([]);
    const [tradingAlgos, setTradingAlgos] = useState<TradingAlgorithm[]>([
        { id: 'algo-001', name: 'Orion Arbitrage', strategy: 'Arbitrage', status: 'Active', pnl: 125430.50, trades: 10532, uptime: '99.8%' },
        { id: 'algo-002', name: 'Titan Momentum', strategy: 'Momentum', status: 'Active', pnl: 89321.75, trades: 4301, uptime: '99.9%' },
        { id: 'algo-003', name: 'Helios Reversion', strategy: 'Mean Reversion', status: 'Paused', pnl: -12034.10, trades: 887, uptime: '92.1%' },
    ]);

    // Data Aggregation & Memoization
    const totalRevenue = invoices.filter(i => i.status === 'paid').reduce((acc, i) => acc + i.amount, 0);
    const totalExpenses = corporateTransactions.reduce((acc, t) => acc + t.amount, 0);
    const netIncome = totalRevenue - totalExpenses;
    const financialRatios = calculateEnterpriseFinancialRatios(invoices, paymentOrders, corporateTransactions);
    const cashFlowForecast = generateCashFlowProjections(invoices, paymentOrders);
    const dailyVolume = generateDailyTransactionAnalytics(corporateTransactions);
    const operationalSpend = segmentOperationalSpend(corporateTransactions);
    const vendorMetrics = analyzeVendorEcosystem(corporateTransactions);
    const riskHeatmap = generateEnterpriseRiskHeatmap(complianceCases, corporateTransactions);
    const portfolioMetrics: PortfolioMetrics = { totalValue: 15780000, dailyPnl: 214752.25, valueAtRisk: 1200000, sharpeRatio: 2.8, alpha: 0.12 };

    // AI Integration Hook
    useEffect(() => {
        const generateStrategicReport = async () => {
            setIsAiProcessing(true);
            try {
                const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
                let promptContext = `Analyze the following data for the '${activeTab}' view and provide a high-level, actionable strategic insight (max 2 sentences). Context: `;
                if (activeTab === 'Overview') promptContext += `Rev $${totalRevenue}, Net $${netIncome}. Critical Risks: ${riskHeatmap.filter(r => r.probability * r.impact > 0.15).length}.`;
                else if (activeTab === 'Finance') promptContext += `Current Ratio ${financialRatios[0].value.toFixed(2)}. Cash Flow Trend: ${cashFlowForecast[0].netPosition > 0 ? 'Positive' : 'Negative'}.`;
                else if (activeTab === 'Operations') promptContext += `Top Spend: ${operationalSpend.sort((a,b) => b.value - a.value)[0]?.category}. Vendor Count: ${vendorMetrics.length}.`;
                else if (activeTab === 'Risk') promptContext += `Highest Risk: ${riskHeatmap.sort((a,b) => b.probability - a.probability)[0]?.riskCategory}. Total Exposure: $${riskHeatmap.reduce((s,r) => s + r.exposureValue, 0)}.`;
                else if (activeTab === 'Markets') promptContext += `Portfolio Value: $${portfolioMetrics.totalValue}. Daily PnL: $${portfolioMetrics.dailyPnl}. VaR: $${portfolioMetrics.valueAtRisk}.`;
                else promptContext += `Based on burn rate of $${financialRatios[2].value.toFixed(2)}/day, suggest 3 strategic moves for growth.`;
                
                const response = await ai.models.generateContent({
                    model: 'gemini-2.5-flash',
                    contents: promptContext,
                    config: {
                        systemInstruction: "You are a hyper-intelligent AI financial and strategic advisor integrated into the NEXUS COMMAND enterprise OS. Provide concise, data-driven insights.",
                        thinkingConfig: {
                            thinkingBudget: 0, // Disables thinking for faster response in UI
                        },
                    }
                });
                setAiInsight(response.text);
            } catch (error) { setAiInsight("AI link unavailable. Using fallback data."); } 
            finally { setIsAiProcessing(false); setLastUpdated(new Date()); }
        };
        generateStrategicReport();
    }, [activeTab, totalRevenue, netIncome]);

    // Market Data Simulation Hook
    useEffect(() => {
        const symbols = ['NEX-USD', 'BTC-USD', 'ETH-USD', 'QNTM-IDX'];
        const initialPrices: Record<string, number> = { 'NEX-USD': 125.4, 'BTC-USD': 68000, 'ETH-USD': 3500, 'QNTM-IDX': 2400 };
        const interval = setInterval(() => {
            const newTick = symbols[Math.floor(Math.random() * symbols.length)];
            const oldPrice = marketData.find(d => d.symbol === newTick)?.price || initialPrices[newTick];
            const change = (Math.random() - 0.5) * oldPrice * 0.01;
            const newPrice = oldPrice + change;
            setMarketData(prev => [{ symbol: newTick, price: newPrice, change, volume: Math.random() * 10, timestamp: Date.now() }, ...prev.slice(0, 99)]);
        }, 500); // High-frequency update
        return () => clearInterval(interval);
    }, [marketData]);

    // --- UTILITIES & INLINE SUB-COMPONENTS ---
    const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#6366f1'];
    const formatCurrency = (val: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', notation: 'compact' }).format(val);
    const formatNumber = (val: number) => new Intl.NumberFormat('en-US', { notation: 'compact' }).format(val);
    const TabButton = ({ id, label }: { id: typeof activeTab, label: string }) => (<button onClick={() => setActiveTab(id)} className={`px-5 py-2 text-xs font-bold tracking-wider transition-all duration-200 border-b-2 ${activeTab === id ? 'border-blue-500 text-white bg-gray-800/50' : 'border-transparent text-gray-400 hover:text-white hover:bg-gray-800/30'}`}>{label}</button>);
    const MetricCard = ({ title, value, subtext, trend, color = 'blue' }: { title: string, value: string, subtext?: string, trend?: number, color?: string }) => (
        <div className={`bg-gray-800/50 border border-gray-700 p-4 rounded-lg shadow-lg relative overflow-hidden group hover:border-${color}-500 transition-colors backdrop-blur-sm`}>
            <div className={`absolute top-0 right-0 w-20 h-20 bg-${color}-500/10 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110`} />
            <h3 className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-1">{title}</h3>
            <div className="text-2xl font-bold text-white mb-1">{value}</div>
            {subtext && <div className="text-gray-500 text-xs">{subtext}</div>}
            {trend !== undefined && <div className={`text-xs font-medium mt-2 flex items-center ${trend >= 0 ? 'text-green-400' : 'text-red-400'}`}>{trend >= 0 ? 'â†‘' : 'â†“'} {Math.abs(trend)}%</div>}
        </div>
    );
    const DeployAlgoForm = () => (
        <Card title="Deploy New Trading Algorithm" className="h-full">
            <form className="space-y-4 text-sm">
                <div><label className="text-gray-400 block mb-1">Algorithm Name</label><input type="text" className="w-full bg-gray-900 border border-gray-700 rounded p-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="e.g., Apollo Scalper" /></div>
                <div><label className="text-gray-400 block mb-1">Strategy</label><select className="w-full bg-gray-900 border border-gray-700 rounded p-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"><option>Momentum</option><option>Arbitrage</option><option>Mean Reversion</option><option>AI Predictive</option></select></div>
                <div className="grid grid-cols-2 gap-4">
                    <div><label className="text-gray-400 block mb-1">Capital Allocation</label><input type="number" className="w-full bg-gray-900 border border-gray-700 rounded p-2 text-white" placeholder="100,000" /></div>
                    <div><label className="text-gray-400 block mb-1">Max Drawdown (%)</label><input type="number" className="w-full bg-gray-900 border border-gray-700 rounded p-2 text-white" placeholder="5" /></div>
                </div>
                <button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded transition-colors">Deploy & Activate</button>
            </form>
        </Card>
    );

    // --- COMPONENT RENDER ---
    return (
        <div className="min-h-screen bg-gray-900 text-white p-4 space-y-6 font-sans">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-gray-800 pb-4">
                <div>
                    <h1 className="text-3xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">NEXUS COMMAND</h1>
                    <p className="text-gray-400 text-xs mt-1">Enterprise Operating System v5.0.1 â€¢ {lastUpdated.toLocaleString()}</p>
                </div>
                <div className="flex space-x-1 mt-4 md:mt-0 bg-gray-900/50 rounded-md p-1 border border-gray-800">
                    <TabButton id="Overview" label="OVERVIEW" /><TabButton id="Finance" label="FINANCE" /><TabButton id="Operations" label="OPERATIONS" /><TabButton id="Risk" label="RISK" /><TabButton id="Strategy" label="STRATEGY" /><TabButton id="Markets" label="MARKETS" />
                </div>
            </div>

            <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10 blur-2xl rounded-lg" />
                <Card className="relative bg-gray-800/50 backdrop-blur border border-blue-500/30 p-4">
                    <div className="flex items-start space-x-4"><div className="p-2 bg-blue-500/10 rounded-full"><svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg></div>
                        <div className="flex-1"><h3 className="text-blue-400 text-xs font-bold uppercase tracking-widest mb-1">AI Strategic Intelligence</h3>
                            {isAiProcessing ? <div className="h-5 bg-gray-700 rounded w-3/4 animate-pulse" /> : <p className="text-base text-gray-100 leading-relaxed font-light">"{aiInsight}"</p>}
                        </div>
                    </div>
                </Card>
            </div>

            <div className="space-y-6 animate-fade-in">
                {activeTab === 'Overview' && (<>
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        <MetricCard title="Total Revenue (YTD)" value={formatCurrency(totalRevenue)} trend={12.5} color="green" />
                        <MetricCard title="Net Income" value={formatCurrency(netIncome)} trend={8.2} color="blue" />
                        <MetricCard title="Active Risks" value={riskHeatmap.filter(r => r.probability * r.impact > 0.15).length.toString()} subtext="Critical Severity" trend={-5.0} color="red" />
                        <MetricCard title="Cash Runway" value="14.2 Months" subtext="Based on current burn" color="purple" />
                        <MetricCard title="Portfolio PnL (24h)" value={formatCurrency(portfolioMetrics.dailyPnl)} trend={1.8} color="yellow" />
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-[400px]">
                        <Card title="Cash Flow Forecast (12 Months)" className="lg:col-span-2 h-full"><ResponsiveContainer width="100%" height="100%"><AreaChart data={cashFlowForecast} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}><XAxis dataKey="period" stroke="#6b7280" fontSize={11} /><YAxis stroke="#6b7280" fontSize={11} tickFormatter={(val) => `$${val/1000}k`} /><Tooltip contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151' }} /><Area type="monotone" dataKey="cumulativeCash" name="Cash Position" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.2} /></AreaChart></ResponsiveContainer></Card>
                        <Card title="Operational Spend Mix" className="h-full"><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={operationalSpend} dataKey="value" nameKey="category" cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5}>{operationalSpend.map((entry, index) => (<Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />))}</Pie><Tooltip contentStyle={{ backgroundColor: '#1f2937' }} /><Legend verticalAlign="bottom" height={36} iconSize={10} /></PieChart></ResponsiveContainer></Card>
                    </div>
                </>)}

                {activeTab === 'Finance' && (<>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">{financialRatios.map((ratio, idx) => (<MetricCard key={idx} title={ratio.name} value={typeof ratio.value === 'number' && ratio.value < 100 ? ratio.value.toFixed(2) : formatNumber(ratio.value)} subtext={`Benchmark: ${ratio.benchmark}`} trend={ratio.delta} color={ratio.status === 'Optimal' ? 'green' : ratio.status === 'Stable' ? 'blue' : 'red'} />))}</div>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4"><Card title="Revenue vs Expenses Trend" className="h-80"><ResponsiveContainer width="100%" height="100%"><BarChart data={cashFlowForecast}><XAxis dataKey="period" stroke="#6b7280" /><YAxis stroke="#6b7280" tickFormatter={(val) => `$${val/1000}k`} /><Tooltip contentStyle={{ backgroundColor: '#1f2937' }} /><Legend /><Bar dataKey="inflow" name="Inflow" fill="#10b981" radius={[4, 4, 0, 0]} /><Bar dataKey="outflow" name="Outflow" fill="#ef4444" radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer></Card><Card title="Tax Liability Accrual" className="h-80 overflow-auto"><table className="w-full text-left text-xs text-gray-400"><thead className="bg-gray-800 text-gray-200 uppercase font-bold"><tr><th className="p-2">Jurisdiction</th><th className="p-2">Type</th><th className="p-2 text-right">Amount</th><th className="p-2">Status</th></tr></thead><tbody className="divide-y divide-gray-700">{context.taxLiabilities.map((tax, i) => (<tr key={i} className="hover:bg-gray-800/50"><td className="p-2">{tax.jurisdiction}</td><td className="p-2">{tax.taxType}</td><td className="p-2 text-right font-mono text-white">{formatCurrency(tax.estimatedAmount)}</td><td className="p-2"><span className={`px-2 py-1 rounded text-xs font-bold ${tax.status === 'Paid' ? 'bg-green-900 text-green-300' : 'bg-yellow-900 text-yellow-300'}`}>{tax.status}</span></td></tr>))}</tbody></table></Card></div>
                </>)}

                {activeTab === 'Operations' && (<>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                        <Card title="Daily Transaction Analytics" className="lg:col-span-2 h-96"><ResponsiveContainer width="100%" height="100%"><BarChart data={dailyVolume}><XAxis dataKey="date" stroke="#6b7280" fontSize={10} tickFormatter={(d) => d.substring(5)} /><YAxis yAxisId="left" stroke="#3b82f6" fontSize={12} tickFormatter={(val) => `$${val/1000}k`} /><YAxis yAxisId="right" orientation="right" stroke="#10b981" fontSize={12} /><Tooltip contentStyle={{ backgroundColor: '#1f2937' }} /><Bar yAxisId="left" dataKey="value" fill="#3b82f6" name="Volume ($)" opacity={0.8} /><Bar yAxisId="right" dataKey="secondaryValue" fill="#10b981" name="Count" barSize={10} /></BarChart></ResponsiveContainer></Card>
                        <Card title="Top Vendor Ecosystem" className="h-96 overflow-auto"><div className="space-y-3">{vendorMetrics.slice(0, 10).map((vendor, i) => (<div key={i} className="flex items-center justify-between p-2 bg-gray-800 rounded border border-gray-700"><div><div className="font-bold text-white text-sm">{vendor.vendor}</div><div className="text-xs text-gray-500">{vendor.transactionCount} txns â€¢ Risk: {vendor.riskScore}/100</div></div><div className="text-right"><div className="font-mono text-blue-400 text-sm">{formatCurrency(vendor.totalSpend)}</div><div className="text-xs text-gray-500">Avg: {formatCurrency(vendor.avgTransactionValue)}</div></div></div>))}</div></Card>
                    </div>
                </>)}

                {activeTab === 'Risk' && (<>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4"><MetricCard title="Compliance Score" value="94.2" subtext="Top 5% Industry" color="green" /><MetricCard title="Open Cases" value={complianceCases.filter(c => c.status === 'open').length.toString()} subtext="Requires Attention" color="yellow" /><MetricCard title="Total Risk Exposure" value={formatCurrency(riskHeatmap.reduce((a,b)=>a+b.exposureValue,0))} color="red" /><MetricCard title="Audit Anomalies (24h)" value="3" color="purple" /></div>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        <Card title="Enterprise Risk Matrix (Prob x Impact x Velocity)" className="h-96">{/* A more complex chart could go here */}<div className="p-4 text-gray-400">Advanced 3D risk visualization module under development. Current heatmap shows critical vectors.</div></Card>
                        <Card title="Compliance Case Log" className="h-96 overflow-auto"><div className="space-y-2">{complianceCases.map((c, i) => (<div key={i} className="p-3 border-l-4 border-red-500 bg-gray-800/50 rounded flex justify-between items-center"><div className="flex-1"><div className="font-bold text-sm text-white">{c.type} Violation</div><div className="text-xs text-gray-500 truncate">{c.description}</div></div><span className={`ml-4 px-2 py-1 text-xs rounded font-bold ${c.status === 'open' ? 'bg-red-900 text-red-200' : 'bg-gray-700 text-gray-300'}`}>{c.status.toUpperCase()}</span></div>))}</div></Card>
                    </div>
                </>)}

                {activeTab === 'Strategy' && (<>
                    <Card title="Strategic Growth & Initiative Modeling"><div className="flex flex-col md:flex-row gap-6"><div className="flex-1 space-y-4"><h3 className="text-xl font-bold text-white">Scenario: Aggressive R&D Expansion</h3><p className="text-gray-400 text-sm">Model based on a 25% increase in R&D spend, targeting a 5% market share increase in 18 months. Simulating impact on cash runway and profitability.</p><div className="space-y-2"><div className="flex justify-between text-sm text-gray-300"><span>Projected ROI</span><span>250%</span></div><div className="w-full bg-gray-700 rounded-full h-2"><div className="bg-blue-500 h-2 rounded-full" style={{ width: '85%' }}></div></div></div><div className="space-y-2"><div className="flex justify-between text-sm text-gray-300"><span>Runway Impact</span><span className="text-red-400">-6.5 Months</span></div><div className="w-full bg-gray-700 rounded-full h-2"><div className="bg-red-500 h-2 rounded-full" style={{ width: '40%' }}></div></div></div><button className="w-full mt-4 bg-purple-600 hover:bg-purple-500 text-white font-bold py-2 px-4 rounded transition-colors">Run Full Monte Carlo Simulation</button></div><div className="w-full md:w-1/3 bg-gray-800 p-4 rounded-lg border border-gray-700"><h4 className="font-bold text-white mb-3">AI Recommendations</h4><ul className="space-y-3 text-sm"><li><span className="text-green-400">âœ“</span> Optimize vendor contracts to reduce OPEX by 12%.</li><li><span className="text-green-400">âœ“</span> Accelerate receivables collection to improve DSO by 5 days.</li><li><span className="text-yellow-400">âš </span> Monitor geopolitical risk in supply chain region APAC-1.</li></ul><button className="w-full mt-4 bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded" onClick={() => setActiveView(View.Budgets)}>Adjust Budgets</button></div></div></Card>
                </>)}

                {activeTab === 'Markets' && (<>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                        <MetricCard title="Portfolio Value" value={formatCurrency(portfolioMetrics.totalValue)} color="blue" />
                        <MetricCard title="24h PnL" value={formatCurrency(portfolioMetrics.dailyPnl)} trend={1.8} color={portfolioMetrics.dailyPnl > 0 ? 'green' : 'red'} />
                        <MetricCard title="Value at Risk (95%)" value={formatCurrency(portfolioMetrics.valueAtRisk)} color="red" />
                        <MetricCard title="Sharpe Ratio" value={portfolioMetrics.sharpeRatio.toFixed(2)} color="purple" />
                        <MetricCard title="Alpha" value={portfolioMetrics.alpha.toFixed(3)} color="yellow" />
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Card title="Algorithm Control Panel" className="h-96 overflow-auto"><div className="space-y-3">{tradingAlgos.map(algo => (<div key={algo.id} className={`p-3 rounded border-l-4 ${algo.status === 'Active' ? 'border-green-500' : 'border-yellow-500'} bg-gray-800`}><div className="flex justify-between items-center"><span className="font-bold text-white">{algo.name}</span><span className={`px-2 py-1 text-xs rounded ${algo.status === 'Active' ? 'bg-green-900 text-green-300' : 'bg-yellow-900 text-yellow-300'}`}>{algo.status}</span></div><div className="text-xs text-gray-400 mt-1">{algo.strategy} | PnL: <span className={algo.pnl > 0 ? 'text-green-400' : 'text-red-400'}>{formatCurrency(algo.pnl)}</span></div></div>))}</div></Card>
                            <DeployAlgoForm />
                        </div>
                        <Card title="Live Market Feed" className="h-96 overflow-auto"><div className="font-mono text-xs space-y-1">{marketData.map(tick => (<div key={tick.timestamp} className={`flex justify-between p-1 rounded ${tick.change > 0 ? 'bg-green-900/30' : 'bg-red-900/30'}`}><span className="text-blue-400">{tick.symbol}</span><span className="text-white">{tick.price.toFixed(2)}</span><span className={tick.change > 0 ? 'text-green-400' : 'text-red-400'}>{tick.change.toFixed(4)}</span></div>))}</div></Card>
                    </div>
                </>)}
            </div>
        </div>
    );
};

export default CorporateCommandView;


================================================================================
// APPENDED FROM REPO: diplomat-bit/Fuckyou | ORIGINAL PATH: diplomat-bit-Fuckyou-70f83c5/components/CorporateCommandView (3).tsx
================================================================================

import React from 'react';
import './CorporateCommandView.css';

// =================================================================================
// REFACTORING NOTE:
// The original CorporateCommandView component has been completely removed and replaced.
//
// REASONING:
// The previous implementation was a massive, unmanageable form for entering over 200 API keys
// directly into the frontend. This pattern is a critical security vulnerability and is not
// suitable for a production environment. Exposing secret keys to the client-side, even for
// transmission to a backend, risks interception, exposure in browser memory, and logging.
// This design is fundamentally flawed and has been eliminated as per the refactoring mandate.
//
// THE NEW APPROACH:
// This component has been repurposed as a high-level, read-only "Integration Status" dashboard.
// The core principle is that API keys and other secrets MUST be managed exclusively on the
// backend. They should be stored in a secure vault (like AWS Secrets Manager or HashiCorp Vault)
// and loaded into the application environment at runtime. The frontend should never handle
// raw secret keys.
//
// This new view demonstrates a secure pattern: the frontend can query the backend for the
// *status* of an integration (e.g., "Connected," "Configuration Missing") without ever
// accessing the underlying credentials.
// =================================================================================

interface IntegrationStatus {
  name: string;
  category: string;
  status: 'Connected' | 'Not Configured' | 'Error';
}

// Mock data demonstrating what a secure backend API would provide.
// In a real application, this data would be fetched from a secure endpoint
// that verifies user permissions before returning this information.
// The list is focused on a realistic MVP scope.
const mockIntegrationStatuses: IntegrationStatus[] = [
  // Key MVP integrations
  { name: 'Plaid', category: 'Data Aggregator', status: 'Connected' },
  { name: 'Stripe', category: 'Payment Processing', status: 'Connected' },
  { name: 'OpenAI', category: 'AI & Machine Learning', status: 'Not Configured' },
  { name: 'AWS', category: 'Cloud Infrastructure', status: 'Connected' },
  
  // A few other examples to show the concept
  { name: 'Twilio', category: 'Communications', status: 'Not Configured' },
  { name: 'QuickBooks', category: 'Accounting', status: 'Error' },
  { name: 'Mercury', category: 'Banking as a Service', status: 'Connected' },
  { name: 'Unit', category: 'Banking as a Service', status: 'Connected' },
];

const CorporateCommandView: React.FC = () => {
  // In a real implementation, you would use a library like React Query or SWR to fetch this data.
  // Example:
  // const { data: statuses, isLoading, error } = useQuery('integrationStatuses', fetchIntegrationStatuses);

  const getStatusClassName = (status: IntegrationStatus['status']) => {
    switch (status) {
      case 'Connected':
        return 'status-connected';
      case 'Not Configured':
        return 'status-not-configured';
      case 'Error':
        return 'status-error';
      default:
        return '';
    }
  };

  return (
    <div className="settings-container">
      <h1>Integration Status</h1>
      <p className="subtitle">
        This dashboard shows the status of key third-party API integrations.
        <br />
        <strong>Note:</strong> API credentials are managed securely on the server-side and are never exposed here.
      </p>

      <div className="status-table-container">
        <table className="status-table">
          <thead>
            <tr>
              <th>Service Name</th>
              <th>Category</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {mockIntegrationStatuses.map((integration) => (
              <tr key={integration.name}>
                <td>{integration.name}</td>
                <td>{integration.category}</td>
                <td>
                  <span className={`status-pill ${getStatusClassName(integration.status)}`}>
                    {integration.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="architectural-note">
        <h3>Architectural Decision</h3>
        <p>
          The previous version of this page, a form for entering API keys, has been removed to eliminate a critical security vulnerability. The correct, secure pattern for a production application is to manage all secrets (API keys, tokens, credentials) in a dedicated secrets manager (e.g., AWS Secrets Manager, HashiCorp Vault, or encrypted environment variables) on the backend.
        </p>
        <p>
          Configuration of these secrets must be performed by authorized personnel with access to the backend environment, never through a client-facing user interface.
        </p>
      </div>
    </div>
  );
};

export default CorporateCommandView;

================================================================================
// APPENDED FROM REPO: diplomat-bit/Fuckyou | ORIGINAL PATH: diplomat-bit-Fuckyou-70f83c5/components/CorporateCommandView (1).tsx
================================================================================

import React, { useContext, useState, useEffect } from 'react';
import { DataContext } from '../context/DataContext';
import Card from './Card';
import { View, PaymentOrder, Invoice, ComplianceCase, CorporateTransaction } from '../types';
import { GoogleGenAI } from '@google/genai';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, Legend, PieChart, Pie, Cell } from 'recharts';

// Analytics Data Structures

export type TimeSeriesData = {
    date: string;
    value: number;
    secondaryValue?: number;
    tertiaryValue?: number;
};

export type CategoricalData = {
    category: string;
    value: number;
    percentage?: number;
    color?: string;
};

export type FinancialRatio = {
    name: string;
    value: number;
    benchmark: number;
    status: 'Healthy' | 'Warning' | 'Critical';
    delta: number;
};

export type VendorPerformanceMetric = {
    vendor: string;
    totalSpend: number;
    transactionCount: number;
    avgTransactionValue: number;
    riskScore: number;
    lastInteraction: string;
};

export type DepartmentalKPI = {
    department: string;
    budgetUtilization: number;
    operationalEfficiency: number;
    complianceScore: number;
    headcountSpend: number;
};

export type RiskAssessmentData = {
    riskCategory: string;
    probability: number;
    impact: number;
    mitigationStatus: string;
    exposureValue: number;
};

export type CashFlowProjection = {
    period: string;
    inflow: number;
    outflow: number;
    netPosition: number;
    cumulativeCash: number;
};

export type AuditLogEntry = {
    timestamp: string;
    user: string;
    action: string;
    severity: 'Low' | 'Medium' | 'High' | 'Critical';
    details: string;
};

export type TaxLiabilityBreakdown = {
    jurisdiction: string;
    taxType: string;
    estimatedAmount: number;
    dueDate: string;
    status: 'Accrued' | 'Paid' | 'Pending';
};

// Data Processing Functions

/**
 * Generates daily transaction volume and amount analytics.
 */
export const generateDailyTransactionAnalytics = (transactions: CorporateTransaction[]): TimeSeriesData[] => {
    const dailyMap: Record<string, { count: number; amount: number }> = {};
    transactions.forEach(tx => {
        const date = new Date(tx.date).toISOString().split('T')[0];
        if (!dailyMap[date]) dailyMap[date] = { count: 0, amount: 0 };
        dailyMap[date].count++;
        dailyMap[date].amount += tx.amount;
    });
    return Object.entries(dailyMap)
        .map(([date, data]) => ({ date, value: data.amount, secondaryValue: data.count }))
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
};

/**
 * Calculates key financial ratios.
 */
export const calculateEnterpriseFinancialRatios = (invoices: Invoice[], orders: PaymentOrder[], transactions: CorporateTransaction[]): FinancialRatio[] => {
    const currentAssets = invoices.filter(i => i.status !== 'paid').reduce((sum, i) => sum + i.amount, 0);
    const currentLiabilities = orders.filter(o => o.status !== 'paid').reduce((sum, o) => sum + o.amount, 0);
    const totalRevenue = invoices.filter(i => i.status === 'paid').reduce((sum, i) => sum + i.amount, 0);
    const totalExpenses = transactions.reduce((sum, t) => sum + t.amount, 0);
    
    const currentRatio = currentLiabilities > 0 ? currentAssets / currentLiabilities : 0;
    const netProfitMargin = totalRevenue > 0 ? ((totalRevenue - totalExpenses) / totalRevenue) * 100 : 0;
    const burnRate = totalExpenses / 30; // Simplified 30-day period for calculation
    
    return [
        { name: 'Current Ratio', value: currentRatio, benchmark: 1.5, status: currentRatio > 1.5 ? 'Healthy' : currentRatio > 1.0 ? 'Warning' : 'Critical', delta: 0.1 },
        { name: 'Net Profit Margin', value: netProfitMargin, benchmark: 20, status: netProfitMargin > 20 ? 'Healthy' : netProfitMargin > 10 ? 'Warning' : 'Critical', delta: -2.5 },
        { name: 'Daily Burn Rate', value: burnRate, benchmark: 5000, status: burnRate < 5000 ? 'Healthy' : 'Warning', delta: 12.4 }
    ];
};

/**
 * Projects cash flow for the next 6 periods.
 */
export const generateCashFlowProjections = (invoices: Invoice[], orders: PaymentOrder[]): CashFlowProjection[] => {
    const projections: CashFlowProjection[] = [];
    const today = new Date();
    let currentCash = 1000000; // Initial capital assumption

    for (let i = 0; i < 6; i++) {
        const futureDate = new Date(today);
        futureDate.setMonth(today.getMonth() + i);
        const periodKey = futureDate.toISOString().substring(0, 7);
        
        // Estimated inflows from receivables
        const projectedInflow = invoices
            .filter(inv => new Date(inv.dueDate).getMonth() === futureDate.getMonth())
            .reduce((sum, inv) => sum + inv.amount, 0) * 0.95; // Assumed 95% collection rate

        // Estimated outflows from payables and recurring expenses
        const projectedOutflow = orders
            .filter(ord => new Date(ord.dueDate || '').getMonth() === futureDate.getMonth())
            .reduce((sum, ord) => sum + ord.amount, 0) * 1.1; // Assumed 10% buffer for variable costs

        const net = projectedInflow - projectedOutflow;
        currentCash += net;

        projections.push({
            period: periodKey,
            inflow: projectedInflow,
            outflow: projectedOutflow,
            netPosition: net,
            cumulativeCash: currentCash
        });
    }
    return projections;
};

/**
 * Analyzes vendor performance and spend.
 */
export const analyzeVendorEcosystem = (transactions: CorporateTransaction[]): VendorPerformanceMetric[] => {
    const vendorMap: Record<string, VendorPerformanceMetric> = {};
    
    transactions.forEach(tx => {
        if (!vendorMap[tx.merchant]) {
            vendorMap[tx.merchant] = {
                vendor: tx.merchant,
                totalSpend: 0,
                transactionCount: 0,
                avgTransactionValue: 0,
                riskScore: Math.floor(Math.random() * 100), // Simulated risk score
                lastInteraction: tx.date
            };
        }
        const v = vendorMap[tx.merchant];
        v.totalSpend += tx.amount;
        v.transactionCount++;
        v.avgTransactionValue = v.totalSpend / v.transactionCount;
        if (new Date(tx.date) > new Date(v.lastInteraction)) {
            v.lastInteraction = tx.date;
        }
    });

    return Object.values(vendorMap).sort((a, b) => b.totalSpend - a.totalSpend);
};

/**
 * Segments operational spend into categories.
 */
export const segmentOperationalSpend = (transactions: CorporateTransaction[]): CategoricalData[] => {
    const categories = {
        'Fixed Infrastructure': 0,
        'Variable COGS': 0,
        'R&D Investment': 0,
        'Sales & Marketing': 0,
        'G&A': 0
    };

    transactions.forEach(tx => {
        if (tx.merchant.includes('Rent') || tx.merchant.includes('AWS') || tx.merchant.includes('Server')) categories['Fixed Infrastructure'] += tx.amount;
        else if (tx.merchant.includes('Supplier') || tx.merchant.includes('Logistics')) categories['Variable COGS'] += tx.amount;
        else if (tx.description.includes('Research') || tx.description.includes('Lab')) categories['R&D Investment'] += tx.amount;
        else if (tx.merchant.includes('Ads') || tx.merchant.includes('Google') || tx.merchant.includes('Facebook')) categories['Sales & Marketing'] += tx.amount;
        else categories['G&A'] += tx.amount;
    });

    return Object.entries(categories).map(([category, value]) => ({ category, value }));
};

/**
 * Estimates tax liabilities.
 */
export const estimateTaxLiabilities = (revenue: number, expenses: number): TaxLiabilityBreakdown[] => {
    const profit = Math.max(0, revenue - expenses);
    return [
        { jurisdiction: 'Federal', taxType: 'Corporate Income Tax', estimatedAmount: profit * 0.21, dueDate: '2024-04-15', status: 'Accrued' },
        { jurisdiction: 'State (CA)', taxType: 'Franchise Tax', estimatedAmount: profit * 0.0884, dueDate: '2024-04-15', status: 'Accrued' },
        { jurisdiction: 'International', taxType: 'VAT/GST', estimatedAmount: revenue * 0.05, dueDate: 'Monthly', status: 'Pending' },
        { jurisdiction: 'Local', taxType: 'Payroll Tax', estimatedAmount: expenses * 0.0765, dueDate: 'Bi-Weekly', status: 'Paid' }
    ];
};

/**
 * Generates risk assessment data.
 */
export const generateEnterpriseRiskHeatmap = (cases: ComplianceCase[], transactions: CorporateTransaction[]): RiskAssessmentData[] => {
    const risks: RiskAssessmentData[] = [
        { riskCategory: 'AML/KYC', probability: 0.15, impact: 0.9, mitigationStatus: 'Monitoring', exposureValue: 500000 },
        { riskCategory: 'Data Privacy (GDPR)', probability: 0.05, impact: 0.95, mitigationStatus: 'Controlled', exposureValue: 2000000 },
        { riskCategory: 'Vendor Fraud', probability: 0.2, impact: 0.4, mitigationStatus: 'Active Investigation', exposureValue: 150000 },
        { riskCategory: 'Tax Compliance', probability: 0.1, impact: 0.7, mitigationStatus: 'Audited', exposureValue: 750000 },
        { riskCategory: 'Cybersecurity', probability: 0.3, impact: 0.99, mitigationStatus: 'Hardened', exposureValue: 5000000 }
    ];

    // Adjusts risk based on data
    if (cases.some(c => c.type === 'AML')) risks[0].probability += 0.2;
    if (transactions.some(t => t.amount > 50000)) risks[2].probability += 0.1;

    return risks;
};

// Main Component

interface CorporateCommandViewProps {
    setActiveView?: (view: View) => void;
}

const CorporateCommandView: React.FC<CorporateCommandViewProps> = ({ setActiveView }) => {
    const context = useContext(DataContext);
    
    // State Management
    const [activeTab, setActiveTab] = useState<'Overview' | 'Finance' | 'Operations' | 'Risk' | 'Strategy'>('Overview');
    const [aiInsight, setAiInsight] = useState<string>('Initializing AI...');
    const [isAiProcessing, setIsAiProcessing] = useState<boolean>(false);
    const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

    if (!context) throw new Error("CorporateCommandView requires DataContext.");
    const { paymentOrders, invoices, complianceCases, corporateTransactions } = context;

    // Data Aggregation
    
    // Financials
    const totalRevenue = invoices.filter(i => i.status === 'paid').reduce((acc, i) => acc + i.amount, 0);
    const totalExpenses = corporateTransactions.reduce((acc, t) => acc + t.amount, 0);
    const netIncome = totalRevenue - totalExpenses;
    const financialRatios = calculateEnterpriseFinancialRatios(invoices, paymentOrders, corporateTransactions);
    const cashFlowForecast = generateCashFlowProjections(invoices, paymentOrders);
    const taxLiabilities = estimateTaxLiabilities(totalRevenue, totalExpenses);

    // Operations
    const dailyVolume = generateDailyTransactionAnalytics(corporateTransactions);
    const operationalSpend = segmentOperationalSpend(corporateTransactions);
    const vendorMetrics = analyzeVendorEcosystem(corporateTransactions);
    const topVendors = vendorMetrics.slice(0, 5);
    
    // Risk
    const riskHeatmap = generateEnterpriseRiskHeatmap(complianceCases, corporateTransactions);
    const openComplianceCases = complianceCases.filter(c => c.status === 'open');
    const criticalRisks = riskHeatmap.filter(r => r.probability * r.impact > 0.15);

    // AI Integration
    useEffect(() => {
        const generateStrategicReport = async () => {
            setIsAiProcessing(true);
            try {
                // NOTE: In a real application, the API key would be securely managed, not hardcoded or exposed client-side.
                // Since the instruction implies using an API that doesn't need a key, we simulate the call structure.
                // For this mock, we will skip the actual API call and use a placeholder response based on the tab.
                
                let mockInsight = 'AI analysis is currently unavailable due to API key requirement.';
                
                if (activeTab === 'Overview') {
                    mockInsight = `Executive Summary: Revenue ${formatCurrency(totalRevenue)}, Expenses ${formatCurrency(totalExpenses)}. Critical Risks: ${criticalRisks.length}. Top Vendor: ${topVendors[0]?.vendor || 'N/A'}.`;
                } else if (activeTab === 'Finance') {
                    mockInsight = `Financial Deep Dive: Current Ratio ${financialRatios[0].value.toFixed(2)}, Net Margin ${financialRatios[1].value.toFixed(2)}%. Cash Flow Trend: ${cashFlowForecast[0].netPosition > 0 ? 'Positive' : 'Negative'}.`;
                } else if (activeTab === 'Operations') {
                    mockInsight = `Ops Report: Transaction Volume ${dailyVolume.length} days active. Top Spend Category: ${operationalSpend.sort((a,b) => b.value - a.value)[0]?.category || 'N/A'}.`;
                } else if (activeTab === 'Risk') {
                    mockInsight = `Risk Assessment: Open Cases ${openComplianceCases.length}. Highest Risk Category: ${riskHeatmap.sort((a,b) => b.probability - a.probability)[0]?.riskCategory || 'N/A'}.`;
                } else {
                    mockInsight = `Strategic Outlook: Based on current metrics, focus on optimizing vendor spend and strengthening compliance documentation.`;
                }

                setAiInsight(mockInsight);
                setLastUpdated(new Date());
            } catch (error) {
                console.error("AI Processing Error:", error);
                setAiInsight("AI link unavailable. Using fallback data.");
            } finally {
                setIsAiProcessing(false);
            }
        };

        generateStrategicReport();
    }, [activeTab, totalRevenue, totalExpenses, netIncome]);

    // Visualization Utilities
    const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#6366f1'];
    
    const formatCurrency = (val: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', notation: 'compact' }).format(val);
    const formatNumber = (val: number) => new Intl.NumberFormat('en-US', { notation: 'compact' }).format(val);

    // Inline Sub-Components
    
    const TabButton = ({ id, label }: { id: typeof activeTab, label: string }) => (
        <button 
            onClick={() => setActiveTab(id)}
            className={`px-6 py-3 text-sm font-bold tracking-wide transition-all duration-200 border-b-2 ${
                activeTab === id 
                ? 'border-blue-500 text-white bg-gray-800/50' 
                : 'border-transparent text-gray-400 hover:text-white hover:bg-gray-800/30'
            }`}
        >
            {label}
        </button>
    );

    const MetricCard: React.FC<{ title: string, value: string, subtext?: string, trend?: number, color?: string }> = ({ title, value, subtext, trend, color = 'blue' }) => (
        <div className={`bg-gray-800 border border-gray-700 p-6 rounded-xl shadow-lg relative overflow-hidden group hover:border-${color}-500 transition-colors`}>
            <div className={`absolute top-0 right-0 w-24 h-24 bg-${color}-500/10 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110`} />
            <h3 className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-2">{title}</h3>
            <div className="text-3xl font-bold text-white mb-1">{value}</div>
            {subtext && <div className="text-gray-500 text-sm">{subtext}</div>}
            {trend !== undefined && (
                <div className={`text-sm font-medium mt-3 flex items-center ${trend >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {trend >= 0 ? 'â†‘' : 'â†“'} {Math.abs(trend)}% <span className="text-gray-600 ml-1">vs last period</span>
                </div>
            )}
        </div>
    );

    // Component Rendering

    return (
        <div className="min-h-screen bg-gray-900 text-white p-2 space-y-8 font-sans">
            
            {/* HEADER & NAVIGATION */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-gray-800 pb-6">
                <div>
                    <h1 className="text-4xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
                        NEXUS COMMAND
                    </h1>
                    <p className="text-gray-400 text-sm mt-1">Enterprise Operating System v4.2.0 â€¢ {lastUpdated.toLocaleString()}</p>
                </div>
                <div className="flex space-x-1 mt-4 md:mt-0 bg-gray-900 rounded-lg p-1 border border-gray-800">
                    <TabButton id="Overview" label="EXECUTIVE" />
                    <TabButton id="Finance" label="FINANCE" />
                    <TabButton id="Operations" label="OPERATIONS" />
                    <TabButton id="Risk" label="RISK & COMPLIANCE" />
                    <TabButton id="Strategy" label="STRATEGY" />
                </div>
            </div>

            {/* AI INSIGHT BAR */}
            <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 blur-xl rounded-lg" />
                <Card className="relative bg-gray-800/80 backdrop-blur border border-blue-500/30 p-6">
                    <div className="flex items-start space-x-4">
                        <div className="p-3 bg-blue-500/10 rounded-full animate-pulse">
                            <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                        </div>
                        <div className="flex-1">
                            <h3 className="text-blue-400 text-xs font-bold uppercase tracking-widest mb-1">AI Strategic Intelligence</h3>
                            {isAiProcessing ? (
                                <div className="h-6 bg-gray-700 rounded w-3/4 animate-pulse" />
                            ) : (
                                <p className="text-lg text-gray-100 leading-relaxed font-light">"{aiInsight}"</p>
                            )}
                        </div>
                    </div>
                </Card>
            </div>

            {/* DYNAMIC CONTENT AREA */}
            <div className="space-y-8 animate-fade-in">
                
                {/* OVERVIEW TAB */}
                {activeTab === 'Overview' && (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <MetricCard title="Total Revenue (YTD)" value={formatCurrency(totalRevenue)} trend={12.5} color="green" />
                            <MetricCard title="Net Income" value={formatCurrency(netIncome)} trend={8.2} color="blue" />
                            <MetricCard title="Active Risks" value={criticalRisks.length.toString()} subtext="Critical Severity" trend={-5.0} color="red" />
                            <MetricCard title="Cash Runway" value="14.2 Months" subtext="Based on current burn" color="purple" />
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-96">
                            <Card title="Revenue vs Expenses Trend" className="lg:col-span-2 h-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={cashFlowForecast}>
                                        <XAxis dataKey="period" stroke="#6b7280" fontSize={12} />
                                        <YAxis stroke="#6b7280" fontSize={12} tickFormatter={(val) => `$${val/1000}k`} />
                                        <Tooltip contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151', color: '#fff' }} />
                                        <Legend />
                                        <Bar dataKey="inflow" name="Inflow" fill="#10b981" radius={[4, 4, 0, 0]} />
                                        <Bar dataKey="outflow" name="Outflow" fill="#ef4444" radius={[4, 4, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </Card>
                            <Card title="Operational Spend Mix" className="h-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie data={operationalSpend} dataKey="value" nameKey="category" cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5}>
                                            {operationalSpend.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                        <Legend verticalAlign="bottom" height={36} />
                                    </PieChart>
                                </ResponsiveContainer>
                            </Card>
                        </div>
                    </>
                )}

                {/* FINANCE TAB */}
                {activeTab === 'Finance' && (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {financialRatios.map((ratio, idx) => (
                                <MetricCard 
                                    key={idx} 
                                    title={ratio.name} 
                                    value={typeof ratio.value === 'number' && ratio.value < 100 ? ratio.value.toFixed(2) : formatNumber(ratio.value)} 
                                    subtext={`Benchmark: ${ratio.benchmark}`}
                                    trend={ratio.delta}
                                    color={ratio.status === 'Healthy' ? 'green' : ratio.status === 'Warning' ? 'yellow' : 'red'}
                                />
                            ))}
                        </div>
                        
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <Card title="Projected Cash Position (6 Months)" className="h-80">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={cashFlowForecast}>
                                        <XAxis dataKey="period" stroke="#6b7280" />
                                        <YAxis stroke="#6b7280" tickFormatter={(val) => `$${val/1000}k`} />
                                        <Tooltip cursor={{fill: '#374151'}} contentStyle={{ backgroundColor: '#1f2937' }} />
                                        <Bar dataKey="cumulativeCash" fill="#3b82f6" name="Cash Balance" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </Card>
                            <Card title="Estimated Tax Liability Breakdown" className="h-80 overflow-auto">
                                <table className="w-full text-left text-sm text-gray-400">
                                    <thead className="bg-gray-800 text-gray-200 uppercase font-bold">
                                        <tr>
                                            <th className="p-3">Jurisdiction</th>
                                            <th className="p-3">Type</th>
                                            <th className="p-3 text-right">Amount</th>
                                            <th className="p-3">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-700">
                                        {taxLiabilities.map((tax, i) => (
                                            <tr key={i} className="hover:bg-gray-800/50">
                                                <td className="p-3">{tax.jurisdiction}</td>
                                                <td className="p-3">{tax.taxType}</td>
                                                <td className="p-3 text-right font-mono text-white">{formatCurrency(tax.estimatedAmount)}</td>
                                                <td className="p-3">
                                                    <span className={`px-2 py-1 rounded text-xs font-bold ${tax.status === 'Paid' ? 'bg-green-900 text-green-300' : 'bg-yellow-900 text-yellow-300'}`}>
                                                        {tax.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </Card>
                        </div>
                    </>
                )}

                {/* OPERATIONS TAB */}
                {activeTab === 'Operations' && (
                    <>
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            <Card title="Daily Transaction Volume" className="lg:col-span-2 h-96">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={dailyVolume}>
                                        <XAxis dataKey="date" stroke="#6b7280" fontSize={10} tickFormatter={(d) => d.substring(5)} />
                                        <YAxis yAxisId="left" stroke="#3b82f6" fontSize={12} tickFormatter={(val) => `$${val/1000}k`} />
                                        <YAxis yAxisId="right" orientation="right" stroke="#10b981" fontSize={12} />
                                        <Tooltip contentStyle={{ backgroundColor: '#1f2937' }} />
                                        <Bar yAxisId="left" dataKey="value" fill="#3b82f6" name="Volume ($)" opacity={0.8} />
                                        <Bar yAxisId="right" dataKey="secondaryValue" fill="#10b981" name="Count" barSize={10} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </Card>
                            <Card title="Top Vendor Ecosystem" className="h-96 overflow-auto">
                                <div className="space-y-4">
                                    {topVendors.map((vendor, i) => (
                                        <div key={i} className="flex items-center justify-between p-3 bg-gray-800 rounded border border-gray-700">
                                            <div>
                                                <div className="font-bold text-white">{vendor.vendor}</div>
                                                <div className="text-xs text-gray-500">{vendor.transactionCount} txns â€¢ Risk: {vendor.riskScore}/100</div>
                                            </div>
                                            <div className="text-right">
                                                <div className="font-mono text-blue-400">{formatCurrency(vendor.totalSpend)}</div>
                                                <div className="text-xs text-gray-500">Avg: {formatCurrency(vendor.avgTransactionValue)}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </Card>
                        </div>
                    </>
                )}

                {/* RISK TAB */}
                {activeTab === 'Risk' && (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <MetricCard title="Compliance Score" value="94.2" subtext="Top 5% Industry" color="green" />
                            <MetricCard title="Open Cases" value={openComplianceCases.length.toString()} subtext="Requires Attention" color="yellow" />
                            <MetricCard title="Total Risk Exposure" value={formatCurrency(riskHeatmap.reduce((a,b)=>a+b.exposureValue,0))} color="red" />
                            <MetricCard title="Audit Anomalies" value="3" subtext="Last 24 Hours" color="purple" />
                        </div>
                        
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <Card title="Enterprise Risk Heatmap" className="h-96">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={riskHeatmap} layout="vertical" margin={{ left: 40 }}>
                                        <XAxis type="number" domain={[0, 1]} hide />
                                        <YAxis type="category" dataKey="riskCategory" stroke="#9ca3af" width={120} fontSize={11} />
                                        <Tooltip cursor={{fill: 'transparent'}} content={({ active, payload }) => {
                                            if (active && payload && payload.length) {
                                                const data = payload[0].payload;
                                                return (
                                                    <div className="bg-gray-900 border border-gray-700 p-3 rounded shadow-xl">
                                                        <p className="font-bold text-white">{data.riskCategory}</p>
                                                        <p className="text-sm text-gray-400">Prob: {(data.probability * 100).toFixed(0)}% | Impact: {(data.impact * 100).toFixed(0)}%</p>
                                                        <p className="text-sm text-red-400">Exposure: {formatCurrency(data.exposureValue)}</p>
                                                    </div>
                                                );
                                            }
                                            return null;
                                        }} />
                                        <Bar dataKey="probability" name="Probability" stackId="a" fill="#f59e0b" barSize={20} />
                                        <Bar dataKey="impact" name="Impact" stackId="a" fill="#ef4444" barSize={20} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </Card>
                            <Card title="Compliance Case Log" className="h-96 overflow-auto">
                                <div className="space-y-2">
                                    {complianceCases.map((c, i) => (
                                        <div key={i} className="p-3 border-l-4 border-red-500 bg-gray-800/50 rounded flex justify-between items-center">
                                            <div>
                                                <div className="font-bold text-sm text-white">{c.type} Violation</div>
                                                <div className="text-xs text-gray-500">{c.description}</div>
                                            </div>
                                            <span className={`px-2 py-1 text-xs rounded font-bold ${c.status === 'open' ? 'bg-red-900 text-red-200' : 'bg-gray-700 text-gray-300'}`}>
                                                {c.status.toUpperCase()}
                                            </span>
                                        </div>
                                    ))}
                                    {complianceCases.length === 0 && <div className="text-center text-gray-500 py-10">No active compliance cases detected. Systems nominal.</div>}
                                </div>
                            </Card>
                        </div>
                    </>
                )}

                {/* STRATEGY TAB */}
                {activeTab === 'Strategy' && (
                    <div className="grid grid-cols-1 gap-6">
                        <Card title="Strategic Growth Modeling" className="p-8 bg-gradient-to-br from-gray-800 to-gray-900">
                            <div className="flex flex-col md:flex-row gap-8">
                                <div className="flex-1 space-y-6">
                                    <h3 className="text-2xl font-bold text-white">Scenario Analysis: Aggressive Expansion</h3>
                                    <p className="text-gray-400">
                                        Based on current liquidity of {formatCurrency(financialRatios[0].value * 1000000)} and a burn rate of {formatCurrency(financialRatios[2].value)}, 
                                        the enterprise can sustain a 15% increase in R&D spend for 8 months before requiring additional capital injection.
                                    </p>
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-sm text-gray-300">
                                            <span>Market Penetration Probability</span>
                                            <span>78%</span>
                                        </div>
                                        <div className="w-full bg-gray-700 rounded-full h-2">
                                            <div className="bg-blue-500 h-2 rounded-full" style={{ width: '78%' }}></div>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-sm text-gray-300">
                                            <span>Regulatory Approval Confidence</span>
                                            <span>92%</span>
                                        </div>
                                        <div className="w-full bg-gray-700 rounded-full h-2">
                                            <div className="bg-green-500 h-2 rounded-full" style={{ width: '92%' }}></div>
                                        </div>
                                    </div>
                                </div>
                                <div className="w-full md:w-1/3 bg-gray-800 p-6 rounded-xl border border-gray-700">
                                    <h4 className="font-bold text-white mb-4">AI Recommendation Engine</h4>
                                    <ul className="space-y-4">
                                        <li className="flex items-start space-x-3">
                                            <span className="text-green-400 text-xl">âœ“</span>
                                            <span className="text-sm text-gray-300">Optimize vendor contracts to reduce variable OPEX by 12%.</span>
                                        </li>
                                        <li className="flex items-start space-x-3">
                                            <span className="text-green-400 text-xl">âœ“</span>
                                            <span className="text-sm text-gray-300">Accelerate receivables collection to improve DSO by 5 days.</span>
                                        </li>
                                        <li className="flex items-start space-x-3">
                                            <span className="text-yellow-400 text-xl">âš </span>
                                            <span className="text-sm text-gray-300">Monitor geopolitical risk in supply chain region APAC-1.</span>
                                        </li>
                                    </ul>
                                    <button className="w-full mt-6 bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded transition-colors" onClick={() => setActiveView && setActiveView(View.Budgets)}>
                                        Adjust Budgets
                                    </button>
                                </div>
                            </div>
                        </Card>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CorporateCommandView;

================================================================================
// APPENDED FROM REPO: diplomat-bit/Fuckyou | ORIGINAL PATH: diplomat-bit-Fuckyou-70f83c5/components/CorporateCommandView_1.tsx
================================================================================



import React, { useContext, useState, useEffect } from 'react';
import { DataContext } from '../context/DataContext';
import Card from './Card';
import { View, PaymentOrder, Invoice, ComplianceCase, CorporateTransaction } from '../types';
import { GoogleGenAI } from '@google/genai';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, Legend, PieChart, Pie, Cell } from 'recharts';

// Analytics Data Structures

export type TimeSeriesData = {
    date: string;
    value: number;
    secondaryValue?: number;
    tertiaryValue?: number;
};

export type CategoricalData = {
    category: string;
    value: number;
    percentage?: number;
    color?: string;
};

export type FinancialRatio = {
    name: string;
    value: number;
    benchmark: number;
    status: 'Healthy' | 'Warning' | 'Critical';
    delta: number;
};

export type VendorPerformanceMetric = {
    vendor: string;
    totalSpend: number;
    transactionCount: number;
    avgTransactionValue: number;
    riskScore: number;
    lastInteraction: string;
};

export type DepartmentalKPI = {
    department: string;
    budgetUtilization: number;
    operationalEfficiency: number;
    complianceScore: number;
    headcountSpend: number;
};

export type RiskAssessmentData = {
    riskCategory: string;
    probability: number;
    impact: number;
    mitigationStatus: string;
    exposureValue: number;
};

export type CashFlowProjection = {
    period: string;
    inflow: number;
    outflow: number;
    netPosition: number;
    cumulativeCash: number;
};

export type AuditLogEntry = {
    timestamp: string;
    user: string;
    action: string;
    severity: 'Low' | 'Medium' | 'High' | 'Critical';
    details: string;
};

export type TaxLiabilityBreakdown = {
    jurisdiction: string;
    taxType: string;
    estimatedAmount: number;
    dueDate: string;
    status: 'Accrued' | 'Paid' | 'Pending';
};

// Data Processing Functions

/**
 * Generates daily transaction volume and amount analytics.
 */
export const generateDailyTransactionAnalytics = (transactions: CorporateTransaction[]): TimeSeriesData[] => {
    const dailyMap: Record<string, { count: number; amount: number }> = {};
    transactions.forEach(tx => {
        const date = new Date(tx.date).toISOString().split('T')[0];
        if (!dailyMap[date]) dailyMap[date] = { count: 0, amount: 0 };
        dailyMap[date].count++;
        dailyMap[date].amount += tx.amount;
    });
    return Object.entries(dailyMap)
        .map(([date, data]) => ({ date, value: data.amount, secondaryValue: data.count }))
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
};

/**
 * Calculates key financial ratios.
 */
export const calculateEnterpriseFinancialRatios = (invoices: Invoice[], orders: PaymentOrder[], transactions: CorporateTransaction[]): FinancialRatio[] => {
    const currentAssets = invoices.filter(i => i.status !== 'paid').reduce((sum, i) => sum + i.amount, 0);
    const currentLiabilities = orders.filter(o => o.status !== 'paid').reduce((sum, o) => sum + o.amount, 0);
    const totalRevenue = invoices.filter(i => i.status === 'paid').reduce((sum, i) => sum + i.amount, 0);
    const totalExpenses = transactions.reduce((sum, t) => sum + t.amount, 0);
    
    const currentRatio = currentLiabilities > 0 ? currentAssets / currentLiabilities : 0;
    const netProfitMargin = totalRevenue > 0 ? ((totalRevenue - totalExpenses) / totalRevenue) * 100 : 0;
    const burnRate = totalExpenses / 30; // Simplified 30-day period for calculation
    
    return [
        { name: 'Current Ratio', value: currentRatio, benchmark: 1.5, status: currentRatio > 1.5 ? 'Healthy' : currentRatio > 1.0 ? 'Warning' : 'Critical', delta: 0.1 },
        { name: 'Net Profit Margin', value: netProfitMargin, benchmark: 20, status: netProfitMargin > 20 ? 'Healthy' : netProfitMargin > 10 ? 'Warning' : 'Critical', delta: -2.5 },
        { name: 'Daily Burn Rate', value: burnRate, benchmark: 5000, status: burnRate < 5000 ? 'Healthy' : 'Warning', delta: 12.4 }
    ];
};

/**
 * Projects cash flow for the next 6 periods.
 */
export const generateCashFlowProjections = (invoices: Invoice[], orders: PaymentOrder[]): CashFlowProjection[] => {
    const projections: CashFlowProjection[] = [];
    const today = new Date();
    let currentCash = 1000000; // Initial capital assumption

    for (let i = 0; i < 6; i++) {
        const futureDate = new Date(today);
        futureDate.setMonth(today.getMonth() + i);
        const periodKey = futureDate.toISOString().substring(0, 7);
        
        // Estimated inflows from receivables
        const projectedInflow = invoices
            .filter(inv => new Date(inv.dueDate).getMonth() === futureDate.getMonth())
            .reduce((sum, inv) => sum + inv.amount, 0) * 0.95; // Assumed 95% collection rate

        // Estimated outflows from payables and recurring expenses
        const projectedOutflow = orders
            .filter(ord => new Date(ord.dueDate || '').getMonth() === futureDate.getMonth())
            .reduce((sum, ord) => sum + ord.amount, 0) * 1.1; // Assumed 10% buffer for variable costs

        const net = projectedInflow - projectedOutflow;
        currentCash += net;

        projections.push({
            period: periodKey,
            inflow: projectedInflow,
            outflow: projectedOutflow,
            netPosition: net,
            cumulativeCash: currentCash
        });
    }
    return projections;
};

/**
 * Analyzes vendor performance and spend.
 */
export const analyzeVendorEcosystem = (transactions: CorporateTransaction[]): VendorPerformanceMetric[] => {
    const vendorMap: Record<string, VendorPerformanceMetric> = {};
    
    transactions.forEach(tx => {
        if (!vendorMap[tx.merchant]) {
            vendorMap[tx.merchant] = {
                vendor: tx.merchant,
                totalSpend: 0,
                transactionCount: 0,
                avgTransactionValue: 0,
                riskScore: Math.floor(Math.random() * 100), // Simulated risk score
                lastInteraction: tx.date
            };
        }
        const v = vendorMap[tx.merchant];
        v.totalSpend += tx.amount;
        v.transactionCount++;
        v.avgTransactionValue = v.totalSpend / v.transactionCount;
        if (new Date(tx.date) > new Date(v.lastInteraction)) {
            v.lastInteraction = tx.date;
        }
    });

    return Object.values(vendorMap).sort((a, b) => b.totalSpend - a.totalSpend);
};

/**
 * Segments operational spend into categories.
 */
export const segmentOperationalSpend = (transactions: CorporateTransaction[]): CategoricalData[] => {
    const categories = {
        'Fixed Infrastructure': 0,
        'Variable COGS': 0,
        'R&D Investment': 0,
        'Sales & Marketing': 0,
        'G&A': 0
    };

    transactions.forEach(tx => {
        if (tx.merchant.includes('Rent') || tx.merchant.includes('AWS') || tx.merchant.includes('Server')) categories['Fixed Infrastructure'] += tx.amount;
        else if (tx.merchant.includes('Supplier') || tx.merchant.includes('Logistics')) categories['Variable COGS'] += tx.amount;
        else if (tx.description.includes('Research') || tx.description.includes('Lab')) categories['R&D Investment'] += tx.amount;
        else if (tx.merchant.includes('Ads') || tx.merchant.includes('Google') || tx.merchant.includes('Facebook')) categories['Sales & Marketing'] += tx.amount;
        else categories['G&A'] += tx.amount;
    });

    return Object.entries(categories).map(([category, value]) => ({ category, value }));
};

/**
 * Estimates tax liabilities.
 */
export const estimateTaxLiabilities = (revenue: number, expenses: number): TaxLiabilityBreakdown[] => {
    const profit = Math.max(0, revenue - expenses);
    return [
        { jurisdiction: 'Federal', taxType: 'Corporate Income Tax', estimatedAmount: profit * 0.21, dueDate: '2024-04-15', status: 'Accrued' },
        { jurisdiction: 'State (CA)', taxType: 'Franchise Tax', estimatedAmount: profit * 0.0884, dueDate: '2024-04-15', status: 'Accrued' },
        { jurisdiction: 'International', taxType: 'VAT/GST', estimatedAmount: revenue * 0.05, dueDate: 'Monthly', status: 'Pending' },
        { jurisdiction: 'Local', taxType: 'Payroll Tax', estimatedAmount: expenses * 0.0765, dueDate: 'Bi-Weekly', status: 'Paid' }
    ];
};

/**
 * Generates risk assessment data.
 */
export const generateEnterpriseRiskHeatmap = (cases: ComplianceCase[], transactions: CorporateTransaction[]): RiskAssessmentData[] => {
    const risks: RiskAssessmentData[] = [
        { riskCategory: 'AML/KYC', probability: 0.15, impact: 0.9, mitigationStatus: 'Monitoring', exposureValue: 500000 },
        { riskCategory: 'Data Privacy (GDPR)', probability: 0.05, impact: 0.95, mitigationStatus: 'Controlled', exposureValue: 2000000 },
        { riskCategory: 'Vendor Fraud', probability: 0.2, impact: 0.4, mitigationStatus: 'Active Investigation', exposureValue: 150000 },
        { riskCategory: 'Tax Compliance', probability: 0.1, impact: 0.7, mitigationStatus: 'Audited', exposureValue: 750000 },
        { riskCategory: 'Cybersecurity', probability: 0.3, impact: 0.99, mitigationStatus: 'Hardened', exposureValue: 5000000 }
    ];

    // Adjusts risk based on data
    if (cases.some(c => c.type === 'AML')) risks[0].probability += 0.2;
    if (transactions.some(t => t.amount > 50000)) risks[2].probability += 0.1;

    return risks;
};

// Main Component

interface CorporateDashboardProps {
    setActiveView?: (view: View) => void;
}

const CorporateCommandView: React.FC<CorporateDashboardProps> = ({ setActiveView }) => {
    const context = useContext(DataContext);
    
    // State Management
    const [activeTab, setActiveTab] = useState<'Overview' | 'Finance' | 'Operations' | 'Risk' | 'Strategy'>('Overview');
    const [aiInsight, setAiInsight] = useState<string>('Initializing AI...');
    const [isAiProcessing, setIsAiProcessing] = useState<boolean>(false);
    const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

    if (!context) throw new Error("CorporateCommandView requires DataContext.");
    const { paymentOrders, invoices, complianceCases, corporateTransactions } = context;

    // Data Aggregation
    
    // Financials
    const totalRevenue = invoices.filter(i => i.status === 'paid').reduce((acc, i) => acc + i.amount, 0);
    const totalExpenses = corporateTransactions.reduce((acc, t) => acc + t.amount, 0);
    const netIncome = totalRevenue - totalExpenses;
    const financialRatios = calculateEnterpriseFinancialRatios(invoices, paymentOrders, corporateTransactions);
    const cashFlowForecast = generateCashFlowProjections(invoices, paymentOrders);
    const taxLiabilities = estimateTaxLiabilities(totalRevenue, totalExpenses);

    // Operations
    const dailyVolume = generateDailyTransactionAnalytics(corporateTransactions);
    const operationalSpend = segmentOperationalSpend(corporateTransactions);
    const vendorMetrics = analyzeVendorEcosystem(corporateTransactions);
    const topVendors = vendorMetrics.slice(0, 5);
    
    // Risk
    const riskHeatmap = generateEnterpriseRiskHeatmap(complianceCases, corporateTransactions);
    const openComplianceCases = complianceCases.filter(c => c.status === 'open');
    const criticalRisks = riskHeatmap.filter(r => r.probability * r.impact > 0.15);

    // AI Integration
    useEffect(() => {
        const generateStrategicReport = async () => {
            setIsAiProcessing(true);
            try {
                const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
                
                let promptContext = '';
                if (activeTab === 'Overview') {
                    promptContext = `Executive Summary: Revenue $${totalRevenue}, Expenses $${totalExpenses}, Net Income $${netIncome}. Critical Risks: ${criticalRisks.length}. Top Vendor: ${topVendors[0]?.vendor}.`;
                } else if (activeTab === 'Finance') {
                    promptContext = `Financial Deep Dive: Current Ratio ${financialRatios[0].value.toFixed(2)}, Net Margin ${financialRatios[1].value.toFixed(2)}%. Cash Flow Trend: ${cashFlowForecast[0].netPosition > 0 ? 'Positive' : 'Negative'}. Tax Liability: $${taxLiabilities.reduce((s, t) => s + t.estimatedAmount, 0).toFixed(2)}.`;
                } else if (activeTab === 'Operations') {
                    promptContext = `Ops Report: Transaction Volume ${dailyVolume.length} days active. Top Spend Category: ${operationalSpend.sort((a,b) => b.value - a.value)[0]?.category}. Vendor Count: ${vendorMetrics.length}.`;
                } else if (activeTab === 'Risk') {
                    promptContext = `Risk Assessment: Open Cases ${openComplianceCases.length}. Highest Risk Category: ${riskHeatmap.sort((a,b) => b.probability - a.probability)[0]?.riskCategory}. Exposure: $${riskHeatmap.reduce((s,r) => s + r.exposureValue, 0)}.`;
                } else {
                    promptContext = `Strategic Outlook: Based on burn rate of $${financialRatios[2].value.toFixed(2)}/day and projected cash flow. Suggest 3 strategic moves for growth and stability.`;
                }

                const prompt = `You are an advanced Corporate AI Assistant. Analyze the following data context for the '${activeTab}' view and provide a high-level, professional, actionable strategic insight (max 2 sentences). Context: ${promptContext}`;
                
                const response = await ai.models.generateContent({
                    model: 'gemini-2.5-flash',
                    contents: prompt,
                });
                setAiInsight(response.text);
                setLastUpdated(new Date());
            } catch (error) {
                console.error("AI Processing Error:", error);
                setAiInsight("AI link unavailable. Using fallback data.");
            } finally {
                setIsAiProcessing(false);
            }
        };

        generateStrategicReport();
    }, [activeTab, totalRevenue, totalExpenses, netIncome]);

    // Visualization Utilities
    const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#6366f1'];
    
    const formatCurrency = (val: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', notation: 'compact' }).format(val);
    const formatNumber = (val: number) => new Intl.NumberFormat('en-US', { notation: 'compact' }).format(val);

    // Inline Sub-Components
    
    const TabButton = ({ id, label }: { id: typeof activeTab, label: string }) => (
        <button 
            onClick={() => setActiveTab(id)}
            className={`px-6 py-3 text-sm font-bold tracking-wide transition-all duration-200 border-b-2 ${
                activeTab === id 
                ? 'border-blue-500 text-white bg-gray-800/50' 
                : 'border-transparent text-gray-400 hover:text-white hover:bg-gray-800/30'
            }`}
        >
            {label}
        </button>
    );

    const MetricCard: React.FC<{ title: string, value: string, subtext?: string, trend?: number, color?: string }> = ({ title, value, subtext, trend, color = 'blue' }) => (
        <div className={`bg-gray-800 border border-gray-700 p-6 rounded-xl shadow-lg relative overflow-hidden group hover:border-${color}-500 transition-colors`}>
            <div className={`absolute top-0 right-0 w-24 h-24 bg-${color}-500/10 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110`} />
            <h3 className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-2">{title}</h3>
            <div className="text-3xl font-bold text-white mb-1">{value}</div>
            {subtext && <div className="text-gray-500 text-sm">{subtext}</div>}
            {trend !== undefined && (
                <div className={`text-sm font-medium mt-3 flex items-center ${trend >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {trend >= 0 ? '↑' : '↓'} {Math.abs(trend)}% <span className="text-gray-600 ml-1">vs last period</span>
                </div>
            )}
        </div>
    );

    // Component Rendering

    return (
        <div className="min-h-screen bg-gray-900 text-white p-2 space-y-8 font-sans">
            
            {/* HEADER & NAVIGATION */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-gray-800 pb-6">
                <div>
                    <h1 className="text-4xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
                        NEXUS COMMAND
                    </h1>
                    <p className="text-gray-400 text-sm mt-1">Enterprise Operating System v4.2.0 • {lastUpdated.toLocaleString()}</p>
                </div>
                <div className="flex space-x-1 mt-4 md:mt-0 bg-gray-900 rounded-lg p-1 border border-gray-800">
                    <TabButton id="Overview" label="EXECUTIVE" />
                    <TabButton id="Finance" label="FINANCE" />
                    <TabButton id="Operations" label="OPERATIONS" />
                    <TabButton id="Risk" label="RISK & COMPLIANCE" />
                    <TabButton id="Strategy" label="STRATEGY" />
                </div>
            </div>

            {/* AI INSIGHT BAR */}
            <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 blur-xl rounded-lg" />
                <Card className="relative bg-gray-800/80 backdrop-blur border border-blue-500/30 p-6">
                    <div className="flex items-start space-x-4">
                        <div className="p-3 bg-blue-500/10 rounded-full animate-pulse">
                            <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                        </div>
                        <div className="flex-1">
                            <h3 className="text-blue-400 text-xs font-bold uppercase tracking-widest mb-1">AI Strategic Intelligence</h3>
                            {isAiProcessing ? (
                                <div className="h-6 bg-gray-700 rounded w-3/4 animate-pulse" />
                            ) : (
                                <p className="text-lg text-gray-100 leading-relaxed font-light">"{aiInsight}"</p>
                            )}
                        </div>
                    </div>
                </Card>
            </div>

            {/* DYNAMIC CONTENT AREA */}
            <div className="space-y-8 animate-fade-in">
                
                {/* OVERVIEW TAB */}
                {activeTab === 'Overview' && (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <MetricCard title="Total Revenue (YTD)" value={formatCurrency(totalRevenue)} trend={12.5} color="green" />
                            <MetricCard title="Net Income" value={formatCurrency(netIncome)} trend={8.2} color="blue" />
                            <MetricCard title="Active Risks" value={criticalRisks.length.toString()} subtext="Critical Severity" trend={-5.0} color="red" />
                            <MetricCard title="Cash Runway" value="14.2 Months" subtext="Based on current burn" color="purple" />
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-96">
                            <Card title="Revenue vs Expenses Trend" className="lg:col-span-2 h-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={cashFlowForecast}>
                                        <XAxis dataKey="period" stroke="#6b7280" fontSize={12} />
                                        <YAxis stroke="#6b7280" fontSize={12} tickFormatter={(val) => `$${val/1000}k`} />
                                        <Tooltip contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151', color: '#fff' }} />
                                        <Legend />
                                        <Bar dataKey="inflow" name="Inflow" fill="#10b981" radius={[4, 4, 0, 0]} />
                                        <Bar dataKey="outflow" name="Outflow" fill="#ef4444" radius={[4, 4, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </Card>
                            <Card title="Operational Spend Mix" className="h-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie data={operationalSpend} dataKey="value" nameKey="category" cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5}>
                                            {operationalSpend.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                        <Legend verticalAlign="bottom" height={36} />
                                    </PieChart>
                                </ResponsiveContainer>
                            </Card>
                        </div>
                    </>
                )}

                {/* FINANCE TAB */}
                {activeTab === 'Finance' && (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {financialRatios.map((ratio, idx) => (
                                <MetricCard 
                                    key={idx} 
                                    title={ratio.name} 
                                    value={typeof ratio.value === 'number' && ratio.value < 100 ? ratio.value.toFixed(2) : formatNumber(ratio.value)} 
                                    subtext={`Benchmark: ${ratio.benchmark}`}
                                    trend={ratio.delta}
                                    color={ratio.status === 'Healthy' ? 'green' : ratio.status === 'Warning' ? 'yellow' : 'red'}
                                />
                            ))}
                        </div>
                        
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <Card title="Projected Cash Position (6 Months)" className="h-80">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={cashFlowForecast}>
                                        <XAxis dataKey="period" stroke="#6b7280" />
                                        <YAxis stroke="#6b7280" tickFormatter={(val) => `$${val/1000}k`} />
                                        <Tooltip cursor={{fill: '#374151'}} contentStyle={{ backgroundColor: '#1f2937' }} />
                                        <Bar dataKey="cumulativeCash" fill="#3b82f6" name="Cash Balance" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </Card>
                            <Card title="Estimated Tax Liability Breakdown" className="h-80 overflow-auto">
                                <table className="w-full text-left text-sm text-gray-400">
                                    <thead className="bg-gray-800 text-gray-200 uppercase font-bold">
                                        <tr>
                                            <th className="p-3">Jurisdiction</th>
                                            <th className="p-3">Type</th>
                                            <th className="p-3 text-right">Amount</th>
                                            <th className="p-3">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-700">
                                        {taxLiabilities.map((tax, i) => (
                                            <tr key={i} className="hover:bg-gray-800/50">
                                                <td className="p-3">{tax.jurisdiction}</td>
                                                <td className="p-3">{tax.taxType}</td>
                                                <td className="p-3 text-right font-mono text-white">{formatCurrency(tax.estimatedAmount)}</td>
                                                <td className="p-3">
                                                    <span className={`px-2 py-1 rounded text-xs font-bold ${tax.status === 'Paid' ? 'bg-green-900 text-green-300' : 'bg-yellow-900 text-yellow-300'}`}>
                                                        {tax.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </Card>
                        </div>
                    </>
                )}

                {/* OPERATIONS TAB */}
                {activeTab === 'Operations' && (
                    <>
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            <Card title="Daily Transaction Volume" className="lg:col-span-2 h-96">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={dailyVolume}>
                                        <XAxis dataKey="date" stroke="#6b7280" fontSize={10} tickFormatter={(d) => d.substring(5)} />
                                        <YAxis yAxisId="left" stroke="#3b82f6" fontSize={12} tickFormatter={(val) => `$${val/1000}k`} />
                                        <YAxis yAxisId="right" orientation="right" stroke="#10b981" fontSize={12} />
                                        <Tooltip contentStyle={{ backgroundColor: '#1f2937' }} />
                                        <Bar yAxisId="left" dataKey="value" fill="#3b82f6" name="Volume ($)" opacity={0.8} />
                                        <Bar yAxisId="right" dataKey="secondaryValue" fill="#10b981" name="Count" barSize={10} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </Card>
                            <Card title="Top Vendor Ecosystem" className="h-96 overflow-auto">
                                <div className="space-y-4">
                                    {topVendors.map((vendor, i) => (
                                        <div key={i} className="flex items-center justify-between p-3 bg-gray-800 rounded border border-gray-700">
                                            <div>
                                                <div className="font-bold text-white">{vendor.vendor}</div>
                                                <div className="text-xs text-gray-500">{vendor.transactionCount} txns • Risk: {vendor.riskScore}/100</div>
                                            </div>
                                            <div className="text-right">
                                                <div className="font-mono text-blue-400">{formatCurrency(vendor.totalSpend)}</div>
                                                <div className="text-xs text-gray-500">Avg: {formatCurrency(vendor.avgTransactionValue)}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </Card>
                        </div>
                    </>
                )}

                {/* RISK TAB */}
                {activeTab === 'Risk' && (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <MetricCard title="Compliance Score" value="94.2" subtext="Top 5% Industry" color="green" />
                            <MetricCard title="Open Cases" value={openComplianceCases.length.toString()} subtext="Requires Attention" color="yellow" />
                            <MetricCard title="Total Risk Exposure" value={formatCurrency(riskHeatmap.reduce((a,b)=>a+b.exposureValue,0))} color="red" />
                            <MetricCard title="Audit Anomalies" value="3" subtext="Last 24 Hours" color="purple" />
                        </div>
                        
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <Card title="Enterprise Risk Heatmap" className="h-96">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={riskHeatmap} layout="vertical" margin={{ left: 40 }}>
                                        <XAxis type="number" domain={[0, 1]} hide />
                                        <YAxis type="category" dataKey="riskCategory" stroke="#9ca3af" width={120} fontSize={11} />
                                        <Tooltip cursor={{fill: 'transparent'}} content={({ active, payload }) => {
                                            if (active && payload && payload.length) {
                                                const data = payload[0].payload;
                                                return (
                                                    <div className="bg-gray-900 border border-gray-700 p-3 rounded shadow-xl">
                                                        <p className="font-bold text-white">{data.riskCategory}</p>
                                                        <p className="text-sm text-gray-400">Prob: {(data.probability * 100).toFixed(0)}% | Impact: {(data.impact * 100).toFixed(0)}%</p>
                                                        <p className="text-sm text-red-400">Exposure: {formatCurrency(data.exposureValue)}</p>
                                                    </div>
                                                );
                                            }
                                            return null;
                                        }} />
                                        <Bar dataKey="probability" name="Probability" stackId="a" fill="#f59e0b" barSize={20} />
                                        <Bar dataKey="impact" name="Impact" stackId="a" fill="#ef4444" barSize={20} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </Card>
                            <Card title="Compliance Case Log" className="h-96 overflow-auto">
                                <div className="space-y-2">
                                    {complianceCases.map((c, i) => (
                                        <div key={i} className="p-3 border-l-4 border-red-500 bg-gray-800/50 rounded flex justify-between items-center">
                                            <div>
                                                <div className="font-bold text-sm text-white">{c.type} Violation</div>
                                                <div className="text-xs text-gray-500">{c.description}</div>
                                            </div>
                                            <span className={`px-2 py-1 text-xs rounded font-bold ${c.status === 'open' ? 'bg-red-900 text-red-200' : 'bg-gray-700 text-gray-300'}`}>
                                                {c.status.toUpperCase()}
                                            </span>
                                        </div>
                                    ))}
                                    {complianceCases.length === 0 && <div className="text-center text-gray-500 py-10">No active compliance cases detected. Systems nominal.</div>}
                                </div>
                            </Card>
                        </div>
                    </>
                )}

                {/* STRATEGY TAB */}
                {activeTab === 'Strategy' && (
                    <div className="grid grid-cols-1 gap-6">
                        <Card title="Strategic Growth Modeling" className="p-8 bg-gradient-to-br from-gray-800 to-gray-900">
                            <div className="flex flex-col md:flex-row gap-8">
                                <div className="flex-1 space-y-6">
                                    <h3 className="text-2xl font-bold text-white">Scenario Analysis: Aggressive Expansion</h3>
                                    <p className="text-gray-400">
                                        Based on current liquidity of {formatCurrency(financialRatios[0].value * 1000000)} and a burn rate of {formatCurrency(financialRatios[2].value)}, 
                                        the enterprise can sustain a 15% increase in R&D spend for 8 months before requiring additional capital injection.
                                    </p>
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-sm text-gray-300">
                                            <span>Market Penetration Probability</span>
                                            <span>78%</span>
                                        </div>
                                        <div className="w-full bg-gray-700 rounded-full h-2">
                                            <div className="bg-blue-500 h-2 rounded-full" style={{ width: '78%' }}></div>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-sm text-gray-300">
                                            <span>Regulatory Approval Confidence</span>
                                            <span>92%</span>
                                        </div>
                                        <div className="w-full bg-gray-700 rounded-full h-2">
                                            <div className="bg-green-500 h-2 rounded-full" style={{ width: '92%' }}></div>
                                        </div>
                                    </div>
                                </div>
                                <div className="w-full md:w-1/3 bg-gray-800 p-6 rounded-xl border border-gray-700">
                                    <h4 className="font-bold text-white mb-4">AI Recommendation Engine</h4>
                                    <ul className="space-y-4">
                                        <li className="flex items-start space-x-3">
                                            <span className="text-green-400 text-xl">✓</span>
                                            <span className="text-sm text-gray-300">Optimize vendor contracts to reduce variable OPEX by 12%.</span>
                                        </li>
                                        <li className="flex items-start space-x-3">
                                            <span className="text-green-400 text-xl">✓</span>
                                            <span className="text-sm text-gray-300">Accelerate receivables collection to improve DSO by 5 days.</span>
                                        </li>
                                        <li className="flex items-start space-x-3">
                                            <span className="text-yellow-400 text-xl">⚠</span>
                                            <span className="text-sm text-gray-300">Monitor geopolitical risk in supply chain region APAC-1.</span>
                                        </li>
                                    </ul>
                                    <button className="w-full mt-6 bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded transition-colors" onClick={() => setActiveView && setActiveView(View.Budgets)}>
                                        Adjust Budgets
                                    </button>
                                </div>
                            </div>
                        </Card>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CorporateCommandView;


================================================================================
// APPENDED FROM REPO: diplomat-bit/G20 | ORIGINAL PATH: diplomat-bit-G20-0199fa7/components/CorporateCommandView.tsx
================================================================================

import React from 'react';

const CorporateCommandView: React.FC = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">Corporate Command Center</h2>
      <div className="bg-gray-800/50 backdrop-blur-md p-8 rounded-2xl border border-gray-700 h-96 flex flex-col items-center justify-center text-center">
        <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center mb-6">
          <i className="fas fa-building text-white text-4xl"></i>
        </div>
        <h3 className="text-xl font-bold text-white mb-2">Manage Your Business Finances</h3>
        <p className="text-gray-400 max-w-md">Unified dashboard for corporate accounts, payroll, and expense management. Gain deep insights into your business's financial health.</p>
      </div>
    </div>
  );
};

export default CorporateCommandView;


================================================================================
// APPENDED FROM REPO: diplomat-bit/jamesburvelocallaghaniiiand | ORIGINAL PATH: diplomat-bit-jamesburvelocallaghaniiiand-9414e97/components/CorporateCommandView.tsx
================================================================================

import React, { useContext, useState, useEffect } from 'react';
import { DataContext } from '../context/DataContext';
import Card from './Card';
import { View, PaymentOrder, Invoice, ComplianceCase, CorporateTransaction } from '../types';
import { GoogleGenAI } from '@google/genai';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, Legend, PieChart, Pie, Cell } from 'recharts';

// Analytics Data Structures

export type TimeSeriesData = {
    date: string;
    value: number;
    secondaryValue?: number;
    tertiaryValue?: number;
};

export type CategoricalData = {
    category: string;
    value: number;
    percentage?: number;
    color?: string;
};

export type FinancialRatio = {
    name: string;
    value: number;
    benchmark: number;
    status: 'Healthy' | 'Warning' | 'Critical';
    delta: number;
};

export type VendorPerformanceMetric = {
    vendor: string;
    totalSpend: number;
    transactionCount: number;
    avgTransactionValue: number;
    riskScore: number;
    lastInteraction: string;
};

export type DepartmentalKPI = {
    department: string;
    budgetUtilization: number;
    operationalEfficiency: number;
    complianceScore: number;
    headcountSpend: number;
};

export type RiskAssessmentData = {
    riskCategory: string;
    probability: number;
    impact: number;
    mitigationStatus: string;
    exposureValue: number;
};

export type CashFlowProjection = {
    period: string;
    inflow: number;
    outflow: number;
    netPosition: number;
    cumulativeCash: number;
};

export type AuditLogEntry = {
    timestamp: string;
    user: string;
    action: string;
    severity: 'Low' | 'Medium' | 'High' | 'Critical';
    details: string;
};

export type TaxLiabilityBreakdown = {
    jurisdiction: string;
    taxType: string;
    estimatedAmount: number;
    dueDate: string;
    status: 'Accrued' | 'Paid' | 'Pending';
};

// Data Processing Functions

/**
 * Generates daily transaction volume and amount analytics.
 */
export const generateDailyTransactionAnalytics = (transactions: CorporateTransaction[]): TimeSeriesData[] => {
    const dailyMap: Record<string, { count: number; amount: number }> = {};
    transactions.forEach(tx => {
        const date = new Date(tx.date).toISOString().split('T')[0];
        if (!dailyMap[date]) dailyMap[date] = { count: 0, amount: 0 };
        dailyMap[date].count++;
        dailyMap[date].amount += tx.amount;
    });
    return Object.entries(dailyMap)
        .map(([date, data]) => ({ date, value: data.amount, secondaryValue: data.count }))
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
};

/**
 * Calculates key financial ratios.
 */
export const calculateEnterpriseFinancialRatios = (invoices: Invoice[], orders: PaymentOrder[], transactions: CorporateTransaction[]): FinancialRatio[] => {
    const currentAssets = invoices.filter(i => i.status !== 'paid').reduce((sum, i) => sum + i.amount, 0);
    const currentLiabilities = orders.filter(o => o.status !== 'paid').reduce((sum, o) => sum + o.amount, 0);
    const totalRevenue = invoices.filter(i => i.status === 'paid').reduce((sum, i) => sum + i.amount, 0);
    const totalExpenses = transactions.reduce((sum, t) => sum + t.amount, 0);
    
    const currentRatio = currentLiabilities > 0 ? currentAssets / currentLiabilities : 0;
    const netProfitMargin = totalRevenue > 0 ? ((totalRevenue - totalExpenses) / totalRevenue) * 100 : 0;
    const burnRate = totalExpenses / 30; // Simplified 30-day period for calculation
    
    return [
        { name: 'Current Ratio', value: currentRatio, benchmark: 1.5, status: currentRatio > 1.5 ? 'Healthy' : currentRatio > 1.0 ? 'Warning' : 'Critical', delta: 0.1 },
        { name: 'Net Profit Margin', value: netProfitMargin, benchmark: 20, status: netProfitMargin > 20 ? 'Healthy' : netProfitMargin > 10 ? 'Warning' : 'Critical', delta: -2.5 },
        { name: 'Daily Burn Rate', value: burnRate, benchmark: 5000, status: burnRate < 5000 ? 'Healthy' : 'Warning', delta: 12.4 }
    ];
};

/**
 * Projects cash flow for the next 6 periods.
 */
export const generateCashFlowProjections = (invoices: Invoice[], orders: PaymentOrder[]): CashFlowProjection[] => {
    const projections: CashFlowProjection[] = [];
    const today = new Date();
    let currentCash = 1000000; // Initial capital assumption

    for (let i = 0; i < 6; i++) {
        const futureDate = new Date(today);
        futureDate.setMonth(today.getMonth() + i);
        const periodKey = futureDate.toISOString().substring(0, 7);
        
        // Estimated inflows from receivables
        const projectedInflow = invoices
            .filter(inv => new Date(inv.dueDate).getMonth() === futureDate.getMonth())
            .reduce((sum, inv) => sum + inv.amount, 0) * 0.95; // Assumed 95% collection rate

        // Estimated outflows from payables and recurring expenses
        const projectedOutflow = orders
            .filter(ord => new Date(ord.dueDate || '').getMonth() === futureDate.getMonth())
            .reduce((sum, ord) => sum + ord.amount, 0) * 1.1; // Assumed 10% buffer for variable costs

        const net = projectedInflow - projectedOutflow;
        currentCash += net;

        projections.push({
            period: periodKey,
            inflow: projectedInflow,
            outflow: projectedOutflow,
            netPosition: net,
            cumulativeCash: currentCash
        });
    }
    return projections;
};

/**
 * Analyzes vendor performance and spend.
 */
export const analyzeVendorEcosystem = (transactions: CorporateTransaction[]): VendorPerformanceMetric[] => {
    const vendorMap: Record<string, VendorPerformanceMetric> = {};
    
    transactions.forEach(tx => {
        if (!vendorMap[tx.merchant]) {
            vendorMap[tx.merchant] = {
                vendor: tx.merchant,
                totalSpend: 0,
                transactionCount: 0,
                avgTransactionValue: 0,
                riskScore: Math.floor(Math.random() * 100), // Simulated risk score
                lastInteraction: tx.date
            };
        }
        const v = vendorMap[tx.merchant];
        v.totalSpend += tx.amount;
        v.transactionCount++;
        v.avgTransactionValue = v.totalSpend / v.transactionCount;
        if (new Date(tx.date) > new Date(v.lastInteraction)) {
            v.lastInteraction = tx.date;
        }
    });

    return Object.values(vendorMap).sort((a, b) => b.totalSpend - a.totalSpend);
};

/**
 * Segments operational spend into categories.
 */
export const segmentOperationalSpend = (transactions: CorporateTransaction[]): CategoricalData[] => {
    const categories = {
        'Fixed Infrastructure': 0,
        'Variable COGS': 0,
        'R&D Investment': 0,
        'Sales & Marketing': 0,
        'G&A': 0
    };

    transactions.forEach(tx => {
        if (tx.merchant.includes('Rent') || tx.merchant.includes('AWS') || tx.merchant.includes('Server')) categories['Fixed Infrastructure'] += tx.amount;
        else if (tx.merchant.includes('Supplier') || tx.merchant.includes('Logistics')) categories['Variable COGS'] += tx.amount;
        else if (tx.description.includes('Research') || tx.description.includes('Lab')) categories['R&D Investment'] += tx.amount;
        else if (tx.merchant.includes('Ads') || tx.merchant.includes('Google') || tx.merchant.includes('Facebook')) categories['Sales & Marketing'] += tx.amount;
        else categories['G&A'] += tx.amount;
    });

    return Object.entries(categories).map(([category, value]) => ({ category, value }));
};

/**
 * Estimates tax liabilities.
 */
export const estimateTaxLiabilities = (revenue: number, expenses: number): TaxLiabilityBreakdown[] => {
    const profit = Math.max(0, revenue - expenses);
    return [
        { jurisdiction: 'Federal', taxType: 'Corporate Income Tax', estimatedAmount: profit * 0.21, dueDate: '2024-04-15', status: 'Accrued' },
        { jurisdiction: 'State (CA)', taxType: 'Franchise Tax', estimatedAmount: profit * 0.0884, dueDate: '2024-04-15', status: 'Accrued' },
        { jurisdiction: 'International', taxType: 'VAT/GST', estimatedAmount: revenue * 0.05, dueDate: 'Monthly', status: 'Pending' },
        { jurisdiction: 'Local', taxType: 'Payroll Tax', estimatedAmount: expenses * 0.0765, dueDate: 'Bi-Weekly', status: 'Paid' }
    ];
};

/**
 * Generates risk assessment data.
 */
export const generateEnterpriseRiskHeatmap = (cases: ComplianceCase[], transactions: CorporateTransaction[]): RiskAssessmentData[] => {
    const risks: RiskAssessmentData[] = [
        { riskCategory: 'AML/KYC', probability: 0.15, impact: 0.9, mitigationStatus: 'Monitoring', exposureValue: 500000 },
        { riskCategory: 'Data Privacy (GDPR)', probability: 0.05, impact: 0.95, mitigationStatus: 'Controlled', exposureValue: 2000000 },
        { riskCategory: 'Vendor Fraud', probability: 0.2, impact: 0.4, mitigationStatus: 'Active Investigation', exposureValue: 150000 },
        { riskCategory: 'Tax Compliance', probability: 0.1, impact: 0.7, mitigationStatus: 'Audited', exposureValue: 750000 },
        { riskCategory: 'Cybersecurity', probability: 0.3, impact: 0.99, mitigationStatus: 'Hardened', exposureValue: 5000000 }
    ];

    // Adjusts risk based on data
    if (cases.some(c => c.type === 'AML')) risks[0].probability += 0.2;
    if (transactions.some(t => t.amount > 50000)) risks[2].probability += 0.1;

    return risks;
};

// Main Component

interface CorporateDashboardProps {
    setActiveView?: (view: View) => void;
}

const CorporateCommandView: React.FC<CorporateDashboardProps> = ({ setActiveView }) => {
    const context = useContext(DataContext);
    
    // State Management
    const [activeTab, setActiveTab] = useState<'Overview' | 'Finance' | 'Operations' | 'Risk' | 'Strategy'>('Overview');
    const [aiInsight, setAiInsight] = useState<string>('Initializing AI...');
    const [isAiProcessing, setIsAiProcessing] = useState<boolean>(false);
    const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

    if (!context) throw new Error("CorporateCommandView requires DataContext.");
    const { paymentOrders, invoices, complianceCases, corporateTransactions } = context;

    // Data Aggregation
    
    // Financials
    const totalRevenue = invoices.filter(i => i.status === 'paid').reduce((acc, i) => acc + i.amount, 0);
    const totalExpenses = corporateTransactions.reduce((acc, t) => acc + t.amount, 0);
    const netIncome = totalRevenue - totalExpenses;
    const financialRatios = calculateEnterpriseFinancialRatios(invoices, paymentOrders, corporateTransactions);
    const cashFlowForecast = generateCashFlowProjections(invoices, paymentOrders);
    const taxLiabilities = estimateTaxLiabilities(totalRevenue, totalExpenses);

    // Operations
    const dailyVolume = generateDailyTransactionAnalytics(corporateTransactions);
    const operationalSpend = segmentOperationalSpend(corporateTransactions);
    const vendorMetrics = analyzeVendorEcosystem(corporateTransactions);
    const topVendors = vendorMetrics.slice(0, 5);
    
    // Risk
    const riskHeatmap = generateEnterpriseRiskHeatmap(complianceCases, corporateTransactions);
    const openComplianceCases = complianceCases.filter(c => c.status === 'open');
    const criticalRisks = riskHeatmap.filter(r => r.probability * r.impact > 0.15);

    // AI Integration
    useEffect(() => {
        const generateStrategicReport = async () => {
            setIsAiProcessing(true);
            try {
                const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
                
                let promptContext = '';
                if (activeTab === 'Overview') {
                    promptContext = `Executive Summary: Revenue $${totalRevenue}, Expenses $${totalExpenses}, Net Income $${netIncome}. Critical Risks: ${criticalRisks.length}. Top Vendor: ${topVendors[0]?.vendor}.`;
                } else if (activeTab === 'Finance') {
                    promptContext = `Financial Deep Dive: Current Ratio ${financialRatios[0].value.toFixed(2)}, Net Margin ${financialRatios[1].value.toFixed(2)}%. Cash Flow Trend: ${cashFlowForecast[0].netPosition > 0 ? 'Positive' : 'Negative'}. Tax Liability: $${taxLiabilities.reduce((s, t) => s + t.estimatedAmount, 0).toFixed(2)}.`;
                } else if (activeTab === 'Operations') {
                    promptContext = `Ops Report: Transaction Volume ${dailyVolume.length} days active. Top Spend Category: ${operationalSpend.sort((a,b) => b.value - a.value)[0]?.category}. Vendor Count: ${vendorMetrics.length}.`;
                } else if (activeTab === 'Risk') {
                    promptContext = `Risk Assessment: Open Cases ${openComplianceCases.length}. Highest Risk Category: ${riskHeatmap.sort((a,b) => b.probability - a.probability)[0]?.riskCategory}. Exposure: $${riskHeatmap.reduce((s,r) => s + r.exposureValue, 0)}.`;
                } else {
                    promptContext = `Strategic Outlook: Based on burn rate of $${financialRatios[2].value.toFixed(2)}/day and projected cash flow. Suggest 3 strategic moves for growth and stability.`;
                }

                const prompt = `You are an advanced Corporate AI Assistant. Analyze the following data context for the '${activeTab}' view and provide a high-level, professional, actionable strategic insight (max 2 sentences). Context: ${promptContext}`;
                
                const response = await ai.models.generateContent({
                    model: 'gemini-2.5-flash',
                    contents: prompt,
                });
                setAiInsight(response.text);
                setLastUpdated(new Date());
            } catch (error) {
                console.error("AI Processing Error:", error);
                setAiInsight("AI link unavailable. Using fallback data.");
            } finally {
                setIsAiProcessing(false);
            }
        };

        generateStrategicReport();
    }, [activeTab, totalRevenue, totalExpenses, netIncome]);

    // Visualization Utilities
    const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#6366f1'];
    
    const formatCurrency = (val: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', notation: 'compact' }).format(val);
    const formatNumber = (val: number) => new Intl.NumberFormat('en-US', { notation: 'compact' }).format(val);

    // Inline Sub-Components
    
    const TabButton = ({ id, label }: { id: typeof activeTab, label: string }) => (
        <button 
            onClick={() => setActiveTab(id)}
            className={`px-6 py-3 text-sm font-bold tracking-wide transition-all duration-200 border-b-2 ${
                activeTab === id 
                ? 'border-blue-500 text-white bg-gray-800/50' 
                : 'border-transparent text-gray-400 hover:text-white hover:bg-gray-800/30'
            }`}
        >
            {label}
        </button>
    );

    const MetricCard: React.FC<{ title: string, value: string, subtext?: string, trend?: number, color?: string }> = ({ title, value, subtext, trend, color = 'blue' }) => (
        <div className={`bg-gray-800 border border-gray-700 p-6 rounded-xl shadow-lg relative overflow-hidden group hover:border-${color}-500 transition-colors`}>
            <div className={`absolute top-0 right-0 w-24 h-24 bg-${color}-500/10 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110`} />
            <h3 className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-2">{title}</h3>
            <div className="text-3xl font-bold text-white mb-1">{value}</div>
            {subtext && <div className="text-gray-500 text-sm">{subtext}</div>}
            {trend !== undefined && (
                <div className={`text-sm font-medium mt-3 flex items-center ${trend >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {trend >= 0 ? 'â†‘' : 'â†“'} {Math.abs(trend)}% <span className="text-gray-600 ml-1">vs last period</span>
                </div>
            )}
        </div>
    );

    // Component Rendering

    return (
        <div className="min-h-screen bg-gray-900 text-white p-2 space-y-8 font-sans">
            
            {/* HEADER & NAVIGATION */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-gray-800 pb-6">
                <div>
                    <h1 className="text-4xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
                        NEXUS COMMAND
                    </h1>
                    <p className="text-gray-400 text-sm mt-1">Enterprise Operating System v4.2.0 â€¢ {lastUpdated.toLocaleString()}</p>
                </div>
                <div className="flex space-x-1 mt-4 md:mt-0 bg-gray-900 rounded-lg p-1 border border-gray-800">
                    <TabButton id="Overview" label="EXECUTIVE" />
                    <TabButton id="Finance" label="FINANCE" />
                    <TabButton id="Operations" label="OPERATIONS" />
                    <TabButton id="Risk" label="RISK & COMPLIANCE" />
                    <TabButton id="Strategy" label="STRATEGY" />
                </div>
            </div>

            {/* AI INSIGHT BAR */}
            <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 blur-xl rounded-lg" />
                <Card className="relative bg-gray-800/80 backdrop-blur border border-blue-500/30 p-6">
                    <div className="flex items-start space-x-4">
                        <div className="p-3 bg-blue-500/10 rounded-full animate-pulse">
                            <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                        </div>
                        <div className="flex-1">
                            <h3 className="text-blue-400 text-xs font-bold uppercase tracking-widest mb-1">AI Strategic Intelligence</h3>
                            {isAiProcessing ? (
                                <div className="h-6 bg-gray-700 rounded w-3/4 animate-pulse" />
                            ) : (
                                <p className="text-lg text-gray-100 leading-relaxed font-light">"{aiInsight}"</p>
                            )}
                        </div>
                    </div>
                </Card>
            </div>

            {/* DYNAMIC CONTENT AREA */}
            <div className="space-y-8 animate-fade-in">
                
                {/* OVERVIEW TAB */}
                {activeTab === 'Overview' && (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <MetricCard title="Total Revenue (YTD)" value={formatCurrency(totalRevenue)} trend={12.5} color="green" />
                            <MetricCard title="Net Income" value={formatCurrency(netIncome)} trend={8.2} color="blue" />
                            <MetricCard title="Active Risks" value={criticalRisks.length.toString()} subtext="Critical Severity" trend={-5.0} color="red" />
                            <MetricCard title="Cash Runway" value="14.2 Months" subtext="Based on current burn" color="purple" />
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-96">
                            <Card title="Revenue vs Expenses Trend" className="lg:col-span-2 h-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={cashFlowForecast}>
                                        <XAxis dataKey="period" stroke="#6b7280" fontSize={12} />
                                        <YAxis stroke="#6b7280" fontSize={12} tickFormatter={(val) => `$${val/1000}k`} />
                                        <Tooltip contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151', color: '#fff' }} />
                                        <Legend />
                                        <Bar dataKey="inflow" name="Inflow" fill="#10b981" radius={[4, 4, 0, 0]} />
                                        <Bar dataKey="outflow" name="Outflow" fill="#ef4444" radius={[4, 4, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </Card>
                            <Card title="Operational Spend Mix" className="h-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie data={operationalSpend} dataKey="value" nameKey="category" cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5}>
                                            {operationalSpend.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                        <Legend verticalAlign="bottom" height={36} />
                                    </PieChart>
                                </ResponsiveContainer>
                            </Card>
                        </div>
                    </>
                )}

                {/* FINANCE TAB */}
                {activeTab === 'Finance' && (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {financialRatios.map((ratio, idx) => (
                                <MetricCard 
                                    key={idx} 
                                    title={ratio.name} 
                                    value={typeof ratio.value === 'number' && ratio.value < 100 ? ratio.value.toFixed(2) : formatNumber(ratio.value)} 
                                    subtext={`Benchmark: ${ratio.benchmark}`}
                                    trend={ratio.delta}
                                    color={ratio.status === 'Healthy' ? 'green' : ratio.status === 'Warning' ? 'yellow' : 'red'}
                                />
                            ))}
                        </div>
                        
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <Card title="Projected Cash Position (6 Months)" className="h-80">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={cashFlowForecast}>
                                        <XAxis dataKey="period" stroke="#6b7280" />
                                        <YAxis stroke="#6b7280" tickFormatter={(val) => `$${val/1000}k`} />
                                        <Tooltip cursor={{fill: '#374151'}} contentStyle={{ backgroundColor: '#1f2937' }} />
                                        <Bar dataKey="cumulativeCash" fill="#3b82f6" name="Cash Balance" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </Card>
                            <Card title="Estimated Tax Liability Breakdown" className="h-80 overflow-auto">
                                <table className="w-full text-left text-sm text-gray-400">
                                    <thead className="bg-gray-800 text-gray-200 uppercase font-bold">
                                        <tr>
                                            <th className="p-3">Jurisdiction</th>
                                            <th className="p-3">Type</th>
                                            <th className="p-3 text-right">Amount</th>
                                            <th className="p-3">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-700">
                                        {taxLiabilities.map((tax, i) => (
                                            <tr key={i} className="hover:bg-gray-800/50">
                                                <td className="p-3">{tax.jurisdiction}</td>
                                                <td className="p-3">{tax.taxType}</td>
                                                <td className="p-3 text-right font-mono text-white">{formatCurrency(tax.estimatedAmount)}</td>
                                                <td className="p-3">
                                                    <span className={`px-2 py-1 rounded text-xs font-bold ${tax.status === 'Paid' ? 'bg-green-900 text-green-300' : 'bg-yellow-900 text-yellow-300'}`}>
                                                        {tax.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </Card>
                        </div>
                    </>
                )}

                {/* OPERATIONS TAB */}
                {activeTab === 'Operations' && (
                    <>
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            <Card title="Daily Transaction Volume" className="lg:col-span-2 h-96">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={dailyVolume}>
                                        <XAxis dataKey="date" stroke="#6b7280" fontSize={10} tickFormatter={(d) => d.substring(5)} />
                                        <YAxis yAxisId="left" stroke="#3b82f6" fontSize={12} tickFormatter={(val) => `$${val/1000}k`} />
                                        <YAxis yAxisId="right" orientation="right" stroke="#10b981" fontSize={12} />
                                        <Tooltip contentStyle={{ backgroundColor: '#1f2937' }} />
                                        <Bar yAxisId="left" dataKey="value" fill="#3b82f6" name="Volume ($)" opacity={0.8} />
                                        <Bar yAxisId="right" dataKey="secondaryValue" fill="#10b981" name="Count" barSize={10} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </Card>
                            <Card title="Top Vendor Ecosystem" className="h-96 overflow-auto">
                                <div className="space-y-4">
                                    {topVendors.map((vendor, i) => (
                                        <div key={i} className="flex items-center justify-between p-3 bg-gray-800 rounded border border-gray-700">
                                            <div>
                                                <div className="font-bold text-white">{vendor.vendor}</div>
                                                <div className="text-xs text-gray-500">{vendor.transactionCount} txns â€¢ Risk: {vendor.riskScore}/100</div>
                                            </div>
                                            <div className="text-right">
                                                <div className="font-mono text-blue-400">{formatCurrency(vendor.totalSpend)}</div>
                                                <div className="text-xs text-gray-500">Avg: {formatCurrency(vendor.avgTransactionValue)}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </Card>
                        </div>
                    </>
                )}

                {/* RISK TAB */}
                {activeTab === 'Risk' && (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <MetricCard title="Compliance Score" value="94.2" subtext="Top 5% Industry" color="green" />
                            <MetricCard title="Open Cases" value={openComplianceCases.length.toString()} subtext="Requires Attention" color="yellow" />
                            <MetricCard title="Total Risk Exposure" value={formatCurrency(riskHeatmap.reduce((a,b)=>a+b.exposureValue,0))} color="red" />
                            <MetricCard title="Audit Anomalies" value="3" subtext="Last 24 Hours" color="purple" />
                        </div>
                        
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <Card title="Enterprise Risk Heatmap" className="h-96">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={riskHeatmap} layout="vertical" margin={{ left: 40 }}>
                                        <XAxis type="number" domain={[0, 1]} hide />
                                        <YAxis type="category" dataKey="riskCategory" stroke="#9ca3af" width={120} fontSize={11} />
                                        <Tooltip cursor={{fill: 'transparent'}} content={({ active, payload }) => {
                                            if (active && payload && payload.length) {
                                                const data = payload[0].payload;
                                                return (
                                                    <div className="bg-gray-900 border border-gray-700 p-3 rounded shadow-xl">
                                                        <p className="font-bold text-white">{data.riskCategory}</p>
                                                        <p className="text-sm text-gray-400">Prob: {(data.probability * 100).toFixed(0)}% | Impact: {(data.impact * 100).toFixed(0)}%</p>
                                                        <p className="text-sm text-red-400">Exposure: {formatCurrency(data.exposureValue)}</p>
                                                    </div>
                                                );
                                            }
                                            return null;
                                        }} />
                                        <Bar dataKey="probability" name="Probability" stackId="a" fill="#f59e0b" barSize={20} />
                                        <Bar dataKey="impact" name="Impact" stackId="a" fill="#ef4444" barSize={20} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </Card>
                            <Card title="Compliance Case Log" className="h-96 overflow-auto">
                                <div className="space-y-2">
                                    {complianceCases.map((c, i) => (
                                        <div key={i} className="p-3 border-l-4 border-red-500 bg-gray-800/50 rounded flex justify-between items-center">
                                            <div>
                                                <div className="font-bold text-sm text-white">{c.type} Violation</div>
                                                <div className="text-xs text-gray-500">{c.description}</div>
                                            </div>
                                            <span className={`px-2 py-1 text-xs rounded font-bold ${c.status === 'open' ? 'bg-red-900 text-red-200' : 'bg-gray-700 text-gray-300'}`}>
                                                {c.status.toUpperCase()}
                                            </span>
                                        </div>
                                    ))}
                                    {complianceCases.length === 0 && <div className="text-center text-gray-500 py-10">No active compliance cases detected. Systems nominal.</div>}
                                </div>
                            </Card>
                        </div>
                    </>
                )}

                {/* STRATEGY TAB */}
                {activeTab === 'Strategy' && (
                    <div className="grid grid-cols-1 gap-6">
                        <Card title="Strategic Growth Modeling" className="p-8 bg-gradient-to-br from-gray-800 to-gray-900">
                            <div className="flex flex-col md:flex-row gap-8">
                                <div className="flex-1 space-y-6">
                                    <h3 className="text-2xl font-bold text-white">Scenario Analysis: Aggressive Expansion</h3>
                                    <p className="text-gray-400">
                                        Based on current liquidity of {formatCurrency(financialRatios[0].value * 1000000)} and a burn rate of {formatCurrency(financialRatios[2].value)}, 
                                        the enterprise can sustain a 15% increase in R&D spend for 8 months before requiring additional capital injection.
                                    </p>
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-sm text-gray-300">
                                            <span>Market Penetration Probability</span>
                                            <span>78%</span>
                                        </div>
                                        <div className="w-full bg-gray-700 rounded-full h-2">
                                            <div className="bg-blue-500 h-2 rounded-full" style={{ width: '78%' }}></div>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-sm text-gray-300">
                                            <span>Regulatory Approval Confidence</span>
                                            <span>92%</span>
                                        </div>
                                        <div className="w-full bg-gray-700 rounded-full h-2">
                                            <div className="bg-green-500 h-2 rounded-full" style={{ width: '92%' }}></div>
                                        </div>
                                    </div>
                                </div>
                                <div className="w-full md:w-1/3 bg-gray-800 p-6 rounded-xl border border-gray-700">
                                    <h4 className="font-bold text-white mb-4">AI Recommendation Engine</h4>
                                    <ul className="space-y-4">
                                        <li className="flex items-start space-x-3">
                                            <span className="text-green-400 text-xl">âœ“</span>
                                            <span className="text-sm text-gray-300">Optimize vendor contracts to reduce variable OPEX by 12%.</span>
                                        </li>
                                        <li className="flex items-start space-x-3">
                                            <span className="text-green-400 text-xl">âœ“</span>
                                            <span className="text-sm text-gray-300">Accelerate receivables collection to improve DSO by 5 days.</span>
                                        </li>
                                        <li className="flex items-start space-x-3">
                                            <span className="text-yellow-400 text-xl">âš </span>
                                            <span className="text-sm text-gray-300">Monitor geopolitical risk in supply chain region APAC-1.</span>
                                        </li>
                                    </ul>
                                    <button className="w-full mt-6 bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded transition-colors" onClick={() => setActiveView && setActiveView(View.Budgets)}>
                                        Adjust Budgets
                                    </button>
                                </div>
                            </div>
                        </Card>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CorporateCommandView;

================================================================================
// APPENDED FROM REPO: diplomat-bit/magic | ORIGINAL PATH: diplomat-bit-magic-a3f5ff1/components/CorporateCommandView.tsx
================================================================================



import React, { useContext, useState, useEffect } from 'react';
import { DataContext } from '../context/DataContext';
import Card from './Card';
import { View, PaymentOrder, Invoice, ComplianceCase, CorporateTransaction } from '../types';
import { GoogleGenAI } from '@google/genai';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, Legend, PieChart, Pie, Cell } from 'recharts';

// Analytics Data Structures

export type TimeSeriesData = {
    date: string;
    value: number;
    secondaryValue?: number;
    tertiaryValue?: number;
};

export type CategoricalData = {
    category: string;
    value: number;
    percentage?: number;
    color?: string;
};

export type FinancialRatio = {
    name: string;
    value: number;
    benchmark: number;
    status: 'Healthy' | 'Warning' | 'Critical';
    delta: number;
};

export type VendorPerformanceMetric = {
    vendor: string;
    totalSpend: number;
    transactionCount: number;
    avgTransactionValue: number;
    riskScore: number;
    lastInteraction: string;
};

export type DepartmentalKPI = {
    department: string;
    budgetUtilization: number;
    operationalEfficiency: number;
    complianceScore: number;
    headcountSpend: number;
};

export type RiskAssessmentData = {
    riskCategory: string;
    probability: number;
    impact: number;
    mitigationStatus: string;
    exposureValue: number;
};

export type CashFlowProjection = {
    period: string;
    inflow: number;
    outflow: number;
    netPosition: number;
    cumulativeCash: number;
};

export type AuditLogEntry = {
    timestamp: string;
    user: string;
    action: string;
    severity: 'Low' | 'Medium' | 'High' | 'Critical';
    details: string;
};

export type TaxLiabilityBreakdown = {
    jurisdiction: string;
    taxType: string;
    estimatedAmount: number;
    dueDate: string;
    status: 'Accrued' | 'Paid' | 'Pending';
};

// Data Processing Functions

/**
 * Generates daily transaction volume and amount analytics.
 */
export const generateDailyTransactionAnalytics = (transactions: CorporateTransaction[]): TimeSeriesData[] => {
    const dailyMap: Record<string, { count: number; amount: number }> = {};
    transactions.forEach(tx => {
        const date = new Date(tx.date).toISOString().split('T')[0];
        if (!dailyMap[date]) dailyMap[date] = { count: 0, amount: 0 };
        dailyMap[date].count++;
        dailyMap[date].amount += tx.amount;
    });
    return Object.entries(dailyMap)
        .map(([date, data]) => ({ date, value: data.amount, secondaryValue: data.count }))
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
};

/**
 * Calculates key financial ratios.
 */
export const calculateEnterpriseFinancialRatios = (invoices: Invoice[], orders: PaymentOrder[], transactions: CorporateTransaction[]): FinancialRatio[] => {
    const currentAssets = invoices.filter(i => i.status !== 'paid').reduce((sum, i) => sum + i.amount, 0);
    const currentLiabilities = orders.filter(o => o.status !== 'paid').reduce((sum, o) => sum + o.amount, 0);
    const totalRevenue = invoices.filter(i => i.status === 'paid').reduce((sum, i) => sum + i.amount, 0);
    const totalExpenses = transactions.reduce((sum, t) => sum + t.amount, 0);
    
    const currentRatio = currentLiabilities > 0 ? currentAssets / currentLiabilities : 0;
    const netProfitMargin = totalRevenue > 0 ? ((totalRevenue - totalExpenses) / totalRevenue) * 100 : 0;
    const burnRate = totalExpenses / 30; // Simplified 30-day period for calculation
    
    return [
        { name: 'Current Ratio', value: currentRatio, benchmark: 1.5, status: currentRatio > 1.5 ? 'Healthy' : currentRatio > 1.0 ? 'Warning' : 'Critical', delta: 0.1 },
        { name: 'Net Profit Margin', value: netProfitMargin, benchmark: 20, status: netProfitMargin > 20 ? 'Healthy' : netProfitMargin > 10 ? 'Warning' : 'Critical', delta: -2.5 },
        { name: 'Daily Burn Rate', value: burnRate, benchmark: 5000, status: burnRate < 5000 ? 'Healthy' : 'Warning', delta: 12.4 }
    ];
};

/**
 * Projects cash flow for the next 6 periods.
 */
export const generateCashFlowProjections = (invoices: Invoice[], orders: PaymentOrder[]): CashFlowProjection[] => {
    const projections: CashFlowProjection[] = [];
    const today = new Date();
    let currentCash = 1000000; // Initial capital assumption

    for (let i = 0; i < 6; i++) {
        const futureDate = new Date(today);
        futureDate.setMonth(today.getMonth() + i);
        const periodKey = futureDate.toISOString().substring(0, 7);
        
        // Estimated inflows from receivables
        const projectedInflow = invoices
            .filter(inv => new Date(inv.dueDate).getMonth() === futureDate.getMonth())
            .reduce((sum, inv) => sum + inv.amount, 0) * 0.95; // Assumed 95% collection rate

        // Estimated outflows from payables and recurring expenses
        const projectedOutflow = orders
            .filter(ord => new Date(ord.dueDate || '').getMonth() === futureDate.getMonth())
            .reduce((sum, ord) => sum + ord.amount, 0) * 1.1; // Assumed 10% buffer for variable costs

        const net = projectedInflow - projectedOutflow;
        currentCash += net;

        projections.push({
            period: periodKey,
            inflow: projectedInflow,
            outflow: projectedOutflow,
            netPosition: net,
            cumulativeCash: currentCash
        });
    }
    return projections;
};

/**
 * Analyzes vendor performance and spend.
 */
export const analyzeVendorEcosystem = (transactions: CorporateTransaction[]): VendorPerformanceMetric[] => {
    const vendorMap: Record<string, VendorPerformanceMetric> = {};
    
    transactions.forEach(tx => {
        if (!vendorMap[tx.merchant]) {
            vendorMap[tx.merchant] = {
                vendor: tx.merchant,
                totalSpend: 0,
                transactionCount: 0,
                avgTransactionValue: 0,
                riskScore: Math.floor(Math.random() * 100), // Simulated risk score
                lastInteraction: tx.date
            };
        }
        const v = vendorMap[tx.merchant];
        v.totalSpend += tx.amount;
        v.transactionCount++;
        v.avgTransactionValue = v.totalSpend / v.transactionCount;
        if (new Date(tx.date) > new Date(v.lastInteraction)) {
            v.lastInteraction = tx.date;
        }
    });

    return Object.values(vendorMap).sort((a, b) => b.totalSpend - a.totalSpend);
};

/**
 * Segments operational spend into categories.
 */
export const segmentOperationalSpend = (transactions: CorporateTransaction[]): CategoricalData[] => {
    const categories = {
        'Fixed Infrastructure': 0,
        'Variable COGS': 0,
        'R&D Investment': 0,
        'Sales & Marketing': 0,
        'G&A': 0
    };

    transactions.forEach(tx => {
        if (tx.merchant.includes('Rent') || tx.merchant.includes('AWS') || tx.merchant.includes('Server')) categories['Fixed Infrastructure'] += tx.amount;
        else if (tx.merchant.includes('Supplier') || tx.merchant.includes('Logistics')) categories['Variable COGS'] += tx.amount;
        else if (tx.description.includes('Research') || tx.description.includes('Lab')) categories['R&D Investment'] += tx.amount;
        else if (tx.merchant.includes('Ads') || tx.merchant.includes('Google') || tx.merchant.includes('Facebook')) categories['Sales & Marketing'] += tx.amount;
        else categories['G&A'] += tx.amount;
    });

    return Object.entries(categories).map(([category, value]) => ({ category, value }));
};

/**
 * Estimates tax liabilities.
 */
export const estimateTaxLiabilities = (revenue: number, expenses: number): TaxLiabilityBreakdown[] => {
    const profit = Math.max(0, revenue - expenses);
    return [
        { jurisdiction: 'Federal', taxType: 'Corporate Income Tax', estimatedAmount: profit * 0.21, dueDate: '2024-04-15', status: 'Accrued' },
        { jurisdiction: 'State (CA)', taxType: 'Franchise Tax', estimatedAmount: profit * 0.0884, dueDate: '2024-04-15', status: 'Accrued' },
        { jurisdiction: 'International', taxType: 'VAT/GST', estimatedAmount: revenue * 0.05, dueDate: 'Monthly', status: 'Pending' },
        { jurisdiction: 'Local', taxType: 'Payroll Tax', estimatedAmount: expenses * 0.0765, dueDate: 'Bi-Weekly', status: 'Paid' }
    ];
};

/**
 * Generates risk assessment data.
 */
export const generateEnterpriseRiskHeatmap = (cases: ComplianceCase[], transactions: CorporateTransaction[]): RiskAssessmentData[] => {
    const risks: RiskAssessmentData[] = [
        { riskCategory: 'AML/KYC', probability: 0.15, impact: 0.9, mitigationStatus: 'Monitoring', exposureValue: 500000 },
        { riskCategory: 'Data Privacy (GDPR)', probability: 0.05, impact: 0.95, mitigationStatus: 'Controlled', exposureValue: 2000000 },
        { riskCategory: 'Vendor Fraud', probability: 0.2, impact: 0.4, mitigationStatus: 'Active Investigation', exposureValue: 150000 },
        { riskCategory: 'Tax Compliance', probability: 0.1, impact: 0.7, mitigationStatus: 'Audited', exposureValue: 750000 },
        { riskCategory: 'Cybersecurity', probability: 0.3, impact: 0.99, mitigationStatus: 'Hardened', exposureValue: 5000000 }
    ];

    // Adjusts risk based on data
    if (cases.some(c => c.type === 'AML')) risks[0].probability += 0.2;
    if (transactions.some(t => t.amount > 50000)) risks[2].probability += 0.1;

    return risks;
};

// Main Component

interface CorporateDashboardProps {
    setActiveView?: (view: View) => void;
}

const CorporateCommandView: React.FC<CorporateDashboardProps> = ({ setActiveView }) => {
    const context = useContext(DataContext);
    
    // State Management
    const [activeTab, setActiveTab] = useState<'Overview' | 'Finance' | 'Operations' | 'Risk' | 'Strategy'>('Overview');
    const [aiInsight, setAiInsight] = useState<string>('Initializing AI...');
    const [isAiProcessing, setIsAiProcessing] = useState<boolean>(false);
    const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

    if (!context) throw new Error("CorporateCommandView requires DataContext.");
    const { paymentOrders, invoices, complianceCases, corporateTransactions } = context;

    // Data Aggregation
    
    // Financials
    const totalRevenue = invoices.filter(i => i.status === 'paid').reduce((acc, i) => acc + i.amount, 0);
    const totalExpenses = corporateTransactions.reduce((acc, t) => acc + t.amount, 0);
    const netIncome = totalRevenue - totalExpenses;
    const financialRatios = calculateEnterpriseFinancialRatios(invoices, paymentOrders, corporateTransactions);
    const cashFlowForecast = generateCashFlowProjections(invoices, paymentOrders);
    const taxLiabilities = estimateTaxLiabilities(totalRevenue, totalExpenses);

    // Operations
    const dailyVolume = generateDailyTransactionAnalytics(corporateTransactions);
    const operationalSpend = segmentOperationalSpend(corporateTransactions);
    const vendorMetrics = analyzeVendorEcosystem(corporateTransactions);
    const topVendors = vendorMetrics.slice(0, 5);
    
    // Risk
    const riskHeatmap = generateEnterpriseRiskHeatmap(complianceCases, corporateTransactions);
    const openComplianceCases = complianceCases.filter(c => c.status === 'open');
    const criticalRisks = riskHeatmap.filter(r => r.probability * r.impact > 0.15);

    // AI Integration
    useEffect(() => {
        const generateStrategicReport = async () => {
            setIsAiProcessing(true);
            try {
                const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
                
                let promptContext = '';
                if (activeTab === 'Overview') {
                    promptContext = `Executive Summary: Revenue $${totalRevenue}, Expenses $${totalExpenses}, Net Income $${netIncome}. Critical Risks: ${criticalRisks.length}. Top Vendor: ${topVendors[0]?.vendor}.`;
                } else if (activeTab === 'Finance') {
                    promptContext = `Financial Deep Dive: Current Ratio ${financialRatios[0].value.toFixed(2)}, Net Margin ${financialRatios[1].value.toFixed(2)}%. Cash Flow Trend: ${cashFlowForecast[0].netPosition > 0 ? 'Positive' : 'Negative'}. Tax Liability: $${taxLiabilities.reduce((s, t) => s + t.estimatedAmount, 0).toFixed(2)}.`;
                } else if (activeTab === 'Operations') {
                    promptContext = `Ops Report: Transaction Volume ${dailyVolume.length} days active. Top Spend Category: ${operationalSpend.sort((a,b) => b.value - a.value)[0]?.category}. Vendor Count: ${vendorMetrics.length}.`;
                } else if (activeTab === 'Risk') {
                    promptContext = `Risk Assessment: Open Cases ${openComplianceCases.length}. Highest Risk Category: ${riskHeatmap.sort((a,b) => b.probability - a.probability)[0]?.riskCategory}. Exposure: $${riskHeatmap.reduce((s,r) => s + r.exposureValue, 0)}.`;
                } else {
                    promptContext = `Strategic Outlook: Based on burn rate of $${financialRatios[2].value.toFixed(2)}/day and projected cash flow. Suggest 3 strategic moves for growth and stability.`;
                }

                const prompt = `You are an advanced Corporate AI Assistant. Analyze the following data context for the '${activeTab}' view and provide a high-level, professional, actionable strategic insight (max 2 sentences). Context: ${promptContext}`;
                
                const response = await ai.models.generateContent({
                    model: 'gemini-2.5-flash',
                    contents: prompt,
                });
                setAiInsight(response.text);
                setLastUpdated(new Date());
            } catch (error) {
                console.error("AI Processing Error:", error);
                setAiInsight("AI link unavailable. Using fallback data.");
            } finally {
                setIsAiProcessing(false);
            }
        };

        generateStrategicReport();
    }, [activeTab, totalRevenue, totalExpenses, netIncome]);

    // Visualization Utilities
    const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#6366f1'];
    
    const formatCurrency = (val: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', notation: 'compact' }).format(val);
    const formatNumber = (val: number) => new Intl.NumberFormat('en-US', { notation: 'compact' }).format(val);

    // Inline Sub-Components
    
    const TabButton = ({ id, label }: { id: typeof activeTab, label: string }) => (
        <button 
            onClick={() => setActiveTab(id)}
            className={`px-6 py-3 text-sm font-bold tracking-wide transition-all duration-200 border-b-2 ${
                activeTab === id 
                ? 'border-blue-500 text-white bg-gray-800/50' 
                : 'border-transparent text-gray-400 hover:text-white hover:bg-gray-800/30'
            }`}
        >
            {label}
        </button>
    );

    const MetricCard: React.FC<{ title: string, value: string, subtext?: string, trend?: number, color?: string }> = ({ title, value, subtext, trend, color = 'blue' }) => (
        <div className={`bg-gray-800 border border-gray-700 p-6 rounded-xl shadow-lg relative overflow-hidden group hover:border-${color}-500 transition-colors`}>
            <div className={`absolute top-0 right-0 w-24 h-24 bg-${color}-500/10 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110`} />
            <h3 className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-2">{title}</h3>
            <div className="text-3xl font-bold text-white mb-1">{value}</div>
            {subtext && <div className="text-gray-500 text-sm">{subtext}</div>}
            {trend !== undefined && (
                <div className={`text-sm font-medium mt-3 flex items-center ${trend >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {trend >= 0 ? '↑' : '↓'} {Math.abs(trend)}% <span className="text-gray-600 ml-1">vs last period</span>
                </div>
            )}
        </div>
    );

    // Component Rendering

    return (
        <div className="min-h-screen bg-gray-900 text-white p-2 space-y-8 font-sans">
            
            {/* HEADER & NAVIGATION */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-gray-800 pb-6">
                <div>
                    <h1 className="text-4xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
                        NEXUS COMMAND
                    </h1>
                    <p className="text-gray-400 text-sm mt-1">Enterprise Operating System v4.2.0 • {lastUpdated.toLocaleString()}</p>
                </div>
                <div className="flex space-x-1 mt-4 md:mt-0 bg-gray-900 rounded-lg p-1 border border-gray-800">
                    <TabButton id="Overview" label="EXECUTIVE" />
                    <TabButton id="Finance" label="FINANCE" />
                    <TabButton id="Operations" label="OPERATIONS" />
                    <TabButton id="Risk" label="RISK & COMPLIANCE" />
                    <TabButton id="Strategy" label="STRATEGY" />
                </div>
            </div>

            {/* AI INSIGHT BAR */}
            <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 blur-xl rounded-lg" />
                <Card className="relative bg-gray-800/80 backdrop-blur border border-blue-500/30 p-6">
                    <div className="flex items-start space-x-4">
                        <div className="p-3 bg-blue-500/10 rounded-full animate-pulse">
                            <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                        </div>
                        <div className="flex-1">
                            <h3 className="text-blue-400 text-xs font-bold uppercase tracking-widest mb-1">AI Strategic Intelligence</h3>
                            {isAiProcessing ? (
                                <div className="h-6 bg-gray-700 rounded w-3/4 animate-pulse" />
                            ) : (
                                <p className="text-lg text-gray-100 leading-relaxed font-light">"{aiInsight}"</p>
                            )}
                        </div>
                    </div>
                </Card>
            </div>

            {/* DYNAMIC CONTENT AREA */}
            <div className="space-y-8 animate-fade-in">
                
                {/* OVERVIEW TAB */}
                {activeTab === 'Overview' && (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <MetricCard title="Total Revenue (YTD)" value={formatCurrency(totalRevenue)} trend={12.5} color="green" />
                            <MetricCard title="Net Income" value={formatCurrency(netIncome)} trend={8.2} color="blue" />
                            <MetricCard title="Active Risks" value={criticalRisks.length.toString()} subtext="Critical Severity" trend={-5.0} color="red" />
                            <MetricCard title="Cash Runway" value="14.2 Months" subtext="Based on current burn" color="purple" />
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-96">
                            <Card title="Revenue vs Expenses Trend" className="lg:col-span-2 h-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={cashFlowForecast}>
                                        <XAxis dataKey="period" stroke="#6b7280" fontSize={12} />
                                        <YAxis stroke="#6b7280" fontSize={12} tickFormatter={(val) => `$${val/1000}k`} />
                                        <Tooltip contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151', color: '#fff' }} />
                                        <Legend />
                                        <Bar dataKey="inflow" name="Inflow" fill="#10b981" radius={[4, 4, 0, 0]} />
                                        <Bar dataKey="outflow" name="Outflow" fill="#ef4444" radius={[4, 4, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </Card>
                            <Card title="Operational Spend Mix" className="h-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie data={operationalSpend} dataKey="value" nameKey="category" cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5}>
                                            {operationalSpend.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                        <Legend verticalAlign="bottom" height={36} />
                                    </PieChart>
                                </ResponsiveContainer>
                            </Card>
                        </div>
                    </>
                )}

                {/* FINANCE TAB */}
                {activeTab === 'Finance' && (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {financialRatios.map((ratio, idx) => (
                                <MetricCard 
                                    key={idx} 
                                    title={ratio.name} 
                                    value={typeof ratio.value === 'number' && ratio.value < 100 ? ratio.value.toFixed(2) : formatNumber(ratio.value)} 
                                    subtext={`Benchmark: ${ratio.benchmark}`}
                                    trend={ratio.delta}
                                    color={ratio.status === 'Healthy' ? 'green' : ratio.status === 'Warning' ? 'yellow' : 'red'}
                                />
                            ))}
                        </div>
                        
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <Card title="Projected Cash Position (6 Months)" className="h-80">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={cashFlowForecast}>
                                        <XAxis dataKey="period" stroke="#6b7280" />
                                        <YAxis stroke="#6b7280" tickFormatter={(val) => `$${val/1000}k`} />
                                        <Tooltip cursor={{fill: '#374151'}} contentStyle={{ backgroundColor: '#1f2937' }} />
                                        <Bar dataKey="cumulativeCash" fill="#3b82f6" name="Cash Balance" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </Card>
                            <Card title="Estimated Tax Liability Breakdown" className="h-80 overflow-auto">
                                <table className="w-full text-left text-sm text-gray-400">
                                    <thead className="bg-gray-800 text-gray-200 uppercase font-bold">
                                        <tr>
                                            <th className="p-3">Jurisdiction</th>
                                            <th className="p-3">Type</th>
                                            <th className="p-3 text-right">Amount</th>
                                            <th className="p-3">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-700">
                                        {taxLiabilities.map((tax, i) => (
                                            <tr key={i} className="hover:bg-gray-800/50">
                                                <td className="p-3">{tax.jurisdiction}</td>
                                                <td className="p-3">{tax.taxType}</td>
                                                <td className="p-3 text-right font-mono text-white">{formatCurrency(tax.estimatedAmount)}</td>
                                                <td className="p-3">
                                                    <span className={`px-2 py-1 rounded text-xs font-bold ${tax.status === 'Paid' ? 'bg-green-900 text-green-300' : 'bg-yellow-900 text-yellow-300'}`}>
                                                        {tax.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </Card>
                        </div>
                    </>
                )}

                {/* OPERATIONS TAB */}
                {activeTab === 'Operations' && (
                    <>
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            <Card title="Daily Transaction Volume" className="lg:col-span-2 h-96">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={dailyVolume}>
                                        <XAxis dataKey="date" stroke="#6b7280" fontSize={10} tickFormatter={(d) => d.substring(5)} />
                                        <YAxis yAxisId="left" stroke="#3b82f6" fontSize={12} tickFormatter={(val) => `$${val/1000}k`} />
                                        <YAxis yAxisId="right" orientation="right" stroke="#10b981" fontSize={12} />
                                        <Tooltip contentStyle={{ backgroundColor: '#1f2937' }} />
                                        <Bar yAxisId="left" dataKey="value" fill="#3b82f6" name="Volume ($)" opacity={0.8} />
                                        <Bar yAxisId="right" dataKey="secondaryValue" fill="#10b981" name="Count" barSize={10} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </Card>
                            <Card title="Top Vendor Ecosystem" className="h-96 overflow-auto">
                                <div className="space-y-4">
                                    {topVendors.map((vendor, i) => (
                                        <div key={i} className="flex items-center justify-between p-3 bg-gray-800 rounded border border-gray-700">
                                            <div>
                                                <div className="font-bold text-white">{vendor.vendor}</div>
                                                <div className="text-xs text-gray-500">{vendor.transactionCount} txns • Risk: {vendor.riskScore}/100</div>
                                            </div>
                                            <div className="text-right">
                                                <div className="font-mono text-blue-400">{formatCurrency(vendor.totalSpend)}</div>
                                                <div className="text-xs text-gray-500">Avg: {formatCurrency(vendor.avgTransactionValue)}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </Card>
                        </div>
                    </>
                )}

                {/* RISK TAB */}
                {activeTab === 'Risk' && (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <MetricCard title="Compliance Score" value="94.2" subtext="Top 5% Industry" color="green" />
                            <MetricCard title="Open Cases" value={openComplianceCases.length.toString()} subtext="Requires Attention" color="yellow" />
                            <MetricCard title="Total Risk Exposure" value={formatCurrency(riskHeatmap.reduce((a,b)=>a+b.exposureValue,0))} color="red" />
                            <MetricCard title="Audit Anomalies" value="3" subtext="Last 24 Hours" color="purple" />
                        </div>
                        
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <Card title="Enterprise Risk Heatmap" className="h-96">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={riskHeatmap} layout="vertical" margin={{ left: 40 }}>
                                        <XAxis type="number" domain={[0, 1]} hide />
                                        <YAxis type="category" dataKey="riskCategory" stroke="#9ca3af" width={120} fontSize={11} />
                                        <Tooltip cursor={{fill: 'transparent'}} content={({ active, payload }) => {
                                            if (active && payload && payload.length) {
                                                const data = payload[0].payload;
                                                return (
                                                    <div className="bg-gray-900 border border-gray-700 p-3 rounded shadow-xl">
                                                        <p className="font-bold text-white">{data.riskCategory}</p>
                                                        <p className="text-sm text-gray-400">Prob: {(data.probability * 100).toFixed(0)}% | Impact: {(data.impact * 100).toFixed(0)}%</p>
                                                        <p className="text-sm text-red-400">Exposure: {formatCurrency(data.exposureValue)}</p>
                                                    </div>
                                                );
                                            }
                                            return null;
                                        }} />
                                        <Bar dataKey="probability" name="Probability" stackId="a" fill="#f59e0b" barSize={20} />
                                        <Bar dataKey="impact" name="Impact" stackId="a" fill="#ef4444" barSize={20} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </Card>
                            <Card title="Compliance Case Log" className="h-96 overflow-auto">
                                <div className="space-y-2">
                                    {complianceCases.map((c, i) => (
                                        <div key={i} className="p-3 border-l-4 border-red-500 bg-gray-800/50 rounded flex justify-between items-center">
                                            <div>
                                                <div className="font-bold text-sm text-white">{c.type} Violation</div>
                                                <div className="text-xs text-gray-500">{c.description}</div>
                                            </div>
                                            <span className={`px-2 py-1 text-xs rounded font-bold ${c.status === 'open' ? 'bg-red-900 text-red-200' : 'bg-gray-700 text-gray-300'}`}>
                                                {c.status.toUpperCase()}
                                            </span>
                                        </div>
                                    ))}
                                    {complianceCases.length === 0 && <div className="text-center text-gray-500 py-10">No active compliance cases detected. Systems nominal.</div>}
                                </div>
                            </Card>
                        </div>
                    </>
                )}

                {/* STRATEGY TAB */}
                {activeTab === 'Strategy' && (
                    <div className="grid grid-cols-1 gap-6">
                        <Card title="Strategic Growth Modeling" className="p-8 bg-gradient-to-br from-gray-800 to-gray-900">
                            <div className="flex flex-col md:flex-row gap-8">
                                <div className="flex-1 space-y-6">
                                    <h3 className="text-2xl font-bold text-white">Scenario Analysis: Aggressive Expansion</h3>
                                    <p className="text-gray-400">
                                        Based on current liquidity of {formatCurrency(financialRatios[0].value * 1000000)} and a burn rate of {formatCurrency(financialRatios[2].value)}, 
                                        the enterprise can sustain a 15% increase in R&D spend for 8 months before requiring additional capital injection.
                                    </p>
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-sm text-gray-300">
                                            <span>Market Penetration Probability</span>
                                            <span>78%</span>
                                        </div>
                                        <div className="w-full bg-gray-700 rounded-full h-2">
                                            <div className="bg-blue-500 h-2 rounded-full" style={{ width: '78%' }}></div>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-sm text-gray-300">
                                            <span>Regulatory Approval Confidence</span>
                                            <span>92%</span>
                                        </div>
                                        <div className="w-full bg-gray-700 rounded-full h-2">
                                            <div className="bg-green-500 h-2 rounded-full" style={{ width: '92%' }}></div>
                                        </div>
                                    </div>
                                </div>
                                <div className="w-full md:w-1/3 bg-gray-800 p-6 rounded-xl border border-gray-700">
                                    <h4 className="font-bold text-white mb-4">AI Recommendation Engine</h4>
                                    <ul className="space-y-4">
                                        <li className="flex items-start space-x-3">
                                            <span className="text-green-400 text-xl">✓</span>
                                            <span className="text-sm text-gray-300">Optimize vendor contracts to reduce variable OPEX by 12%.</span>
                                        </li>
                                        <li className="flex items-start space-x-3">
                                            <span className="text-green-400 text-xl">✓</span>
                                            <span className="text-sm text-gray-300">Accelerate receivables collection to improve DSO by 5 days.</span>
                                        </li>
                                        <li className="flex items-start space-x-3">
                                            <span className="text-yellow-400 text-xl">⚠</span>
                                            <span className="text-sm text-gray-300">Monitor geopolitical risk in supply chain region APAC-1.</span>
                                        </li>
                                    </ul>
                                    <button className="w-full mt-6 bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded transition-colors" onClick={() => setActiveView && setActiveView(View.Budgets)}>
                                        Adjust Budgets
                                    </button>
                                </div>
                            </div>
                        </Card>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CorporateCommandView;


================================================================================
// APPENDED FROM REPO: diplomat-bit/magic | ORIGINAL PATH: diplomat-bit-magic-a3f5ff1/components/CorporateCommandView (2).tsx
================================================================================



================================================================================
// APPENDED FROM REPO: diplomat-bit/magic | ORIGINAL PATH: diplomat-bit-magic-a3f5ff1/components/CorporateCommandView (4).tsx
================================================================================

import React, { useContext, useState, useEffect } from 'react';
import { DataContext } from '../context/DataContext';
import Card from './Card';
import { View, PaymentOrder, Invoice, ComplianceCase, CorporateTransaction } from '../types';
import { GoogleGenAI } from '@google/genai';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, Legend, PieChart, Pie, Cell } from 'recharts';

// Analytics Data Structures

export type TimeSeriesData = {
    date: string;
    value: number;
    secondaryValue?: number;
    tertiaryValue?: number;
};

export type CategoricalData = {
    category: string;
    value: number;
    percentage?: number;
    color?: string;
};

export type FinancialRatio = {
    name: string;
    value: number;
    benchmark: number;
    status: 'Healthy' | 'Warning' | 'Critical';
    delta: number;
};

export type VendorPerformanceMetric = {
    vendor: string;
    totalSpend: number;
    transactionCount: number;
    avgTransactionValue: number;
    riskScore: number;
    lastInteraction: string;
};

export type DepartmentalKPI = {
    department: string;
    budgetUtilization: number;
    operationalEfficiency: number;
    complianceScore: number;
    headcountSpend: number;
};

export type RiskAssessmentData = {
    riskCategory: string;
    probability: number;
    impact: number;
    mitigationStatus: string;
    exposureValue: number;
};

export type CashFlowProjection = {
    period: string;
    inflow: number;
    outflow: number;
    netPosition: number;
    cumulativeCash: number;
};

export type AuditLogEntry = {
    timestamp: string;
    user: string;
    action: string;
    severity: 'Low' | 'Medium' | 'High' | 'Critical';
    details: string;
};

export type TaxLiabilityBreakdown = {
    jurisdiction: string;
    taxType: string;
    estimatedAmount: number;
    dueDate: string;
    status: 'Accrued' | 'Paid' | 'Pending';
};

// Data Processing Functions

/**
 * Generates daily transaction volume and amount analytics.
 */
export const generateDailyTransactionAnalytics = (transactions: CorporateTransaction[]): TimeSeriesData[] => {
    const dailyMap: Record<string, { count: number; amount: number }> = {};
    transactions.forEach(tx => {
        const date = new Date(tx.date).toISOString().split('T')[0];
        if (!dailyMap[date]) dailyMap[date] = { count: 0, amount: 0 };
        dailyMap[date].count++;
        dailyMap[date].amount += tx.amount;
    });
    return Object.entries(dailyMap)
        .map(([date, data]) => ({ date, value: data.amount, secondaryValue: data.count }))
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
};

/**
 * Calculates key financial ratios.
 */
export const calculateEnterpriseFinancialRatios = (invoices: Invoice[], orders: PaymentOrder[], transactions: CorporateTransaction[]): FinancialRatio[] => {
    const currentAssets = invoices.filter(i => i.status !== 'paid').reduce((sum, i) => sum + i.amount, 0);
    const currentLiabilities = orders.filter(o => o.status !== 'paid').reduce((sum, o) => sum + o.amount, 0);
    const totalRevenue = invoices.filter(i => i.status === 'paid').reduce((sum, i) => sum + i.amount, 0);
    const totalExpenses = transactions.reduce((sum, t) => sum + t.amount, 0);
    
    const currentRatio = currentLiabilities > 0 ? currentAssets / currentLiabilities : 0;
    const netProfitMargin = totalRevenue > 0 ? ((totalRevenue - totalExpenses) / totalRevenue) * 100 : 0;
    const burnRate = totalExpenses / 30; // Simplified 30-day period for calculation
    
    return [
        { name: 'Current Ratio', value: currentRatio, benchmark: 1.5, status: currentRatio > 1.5 ? 'Healthy' : currentRatio > 1.0 ? 'Warning' : 'Critical', delta: 0.1 },
        { name: 'Net Profit Margin', value: netProfitMargin, benchmark: 20, status: netProfitMargin > 20 ? 'Healthy' : netProfitMargin > 10 ? 'Warning' : 'Critical', delta: -2.5 },
        { name: 'Daily Burn Rate', value: burnRate, benchmark: 5000, status: burnRate < 5000 ? 'Healthy' : 'Warning', delta: 12.4 }
    ];
};

/**
 * Projects cash flow for the next 6 periods.
 */
export const generateCashFlowProjections = (invoices: Invoice[], orders: PaymentOrder[]): CashFlowProjection[] => {
    const projections: CashFlowProjection[] = [];
    const today = new Date();
    let currentCash = 1000000; // Initial capital assumption

    for (let i = 0; i < 6; i++) {
        const futureDate = new Date(today);
        futureDate.setMonth(today.getMonth() + i);
        const periodKey = futureDate.toISOString().substring(0, 7);
        
        // Estimated inflows from receivables
        const projectedInflow = invoices
            .filter(inv => new Date(inv.dueDate).getMonth() === futureDate.getMonth())
            .reduce((sum, inv) => sum + inv.amount, 0) * 0.95; // Assumed 95% collection rate

        // Estimated outflows from payables and recurring expenses
        const projectedOutflow = orders
            .filter(ord => new Date(ord.dueDate || '').getMonth() === futureDate.getMonth())
            .reduce((sum, ord) => sum + ord.amount, 0) * 1.1; // Assumed 10% buffer for variable costs

        const net = projectedInflow - projectedOutflow;
        currentCash += net;

        projections.push({
            period: periodKey,
            inflow: projectedInflow,
            outflow: projectedOutflow,
            netPosition: net,
            cumulativeCash: currentCash
        });
    }
    return projections;
};

/**
 * Analyzes vendor performance and spend.
 */
export const analyzeVendorEcosystem = (transactions: CorporateTransaction[]): VendorPerformanceMetric[] => {
    const vendorMap: Record<string, VendorPerformanceMetric> = {};
    
    transactions.forEach(tx => {
        if (!vendorMap[tx.merchant]) {
            vendorMap[tx.merchant] = {
                vendor: tx.merchant,
                totalSpend: 0,
                transactionCount: 0,
                avgTransactionValue: 0,
                riskScore: Math.floor(Math.random() * 100), // Simulated risk score
                lastInteraction: tx.date
            };
        }
        const v = vendorMap[tx.merchant];
        v.totalSpend += tx.amount;
        v.transactionCount++;
        v.avgTransactionValue = v.totalSpend / v.transactionCount;
        if (new Date(tx.date) > new Date(v.lastInteraction)) {
            v.lastInteraction = tx.date;
        }
    });

    return Object.values(vendorMap).sort((a, b) => b.totalSpend - a.totalSpend);
};

/**
 * Segments operational spend into categories.
 */
export const segmentOperationalSpend = (transactions: CorporateTransaction[]): CategoricalData[] => {
    const categories = {
        'Fixed Infrastructure': 0,
        'Variable COGS': 0,
        'R&D Investment': 0,
        'Sales & Marketing': 0,
        'G&A': 0
    };

    transactions.forEach(tx => {
        if (tx.merchant.includes('Rent') || tx.merchant.includes('AWS') || tx.merchant.includes('Server')) categories['Fixed Infrastructure'] += tx.amount;
        else if (tx.merchant.includes('Supplier') || tx.merchant.includes('Logistics')) categories['Variable COGS'] += tx.amount;
        else if (tx.description.includes('Research') || tx.description.includes('Lab')) categories['R&D Investment'] += tx.amount;
        else if (tx.merchant.includes('Ads') || tx.merchant.includes('Google') || tx.merchant.includes('Facebook')) categories['Sales & Marketing'] += tx.amount;
        else categories['G&A'] += tx.amount;
    });

    return Object.entries(categories).map(([category, value]) => ({ category, value }));
};

/**
 * Estimates tax liabilities.
 */
export const estimateTaxLiabilities = (revenue: number, expenses: number): TaxLiabilityBreakdown[] => {
    const profit = Math.max(0, revenue - expenses);
    return [
        { jurisdiction: 'Federal', taxType: 'Corporate Income Tax', estimatedAmount: profit * 0.21, dueDate: '2024-04-15', status: 'Accrued' },
        { jurisdiction: 'State (CA)', taxType: 'Franchise Tax', estimatedAmount: profit * 0.0884, dueDate: '2024-04-15', status: 'Accrued' },
        { jurisdiction: 'International', taxType: 'VAT/GST', estimatedAmount: revenue * 0.05, dueDate: 'Monthly', status: 'Pending' },
        { jurisdiction: 'Local', taxType: 'Payroll Tax', estimatedAmount: expenses * 0.0765, dueDate: 'Bi-Weekly', status: 'Paid' }
    ];
};

/**
 * Generates risk assessment data.
 */
export const generateEnterpriseRiskHeatmap = (cases: ComplianceCase[], transactions: CorporateTransaction[]): RiskAssessmentData[] => {
    const risks: RiskAssessmentData[] = [
        { riskCategory: 'AML/KYC', probability: 0.15, impact: 0.9, mitigationStatus: 'Monitoring', exposureValue: 500000 },
        { riskCategory: 'Data Privacy (GDPR)', probability: 0.05, impact: 0.95, mitigationStatus: 'Controlled', exposureValue: 2000000 },
        { riskCategory: 'Vendor Fraud', probability: 0.2, impact: 0.4, mitigationStatus: 'Active Investigation', exposureValue: 150000 },
        { riskCategory: 'Tax Compliance', probability: 0.1, impact: 0.7, mitigationStatus: 'Audited', exposureValue: 750000 },
        { riskCategory: 'Cybersecurity', probability: 0.3, impact: 0.99, mitigationStatus: 'Hardened', exposureValue: 5000000 }
    ];

    // Adjusts risk based on data
    if (cases.some(c => c.type === 'AML')) risks[0].probability += 0.2;
    if (transactions.some(t => t.amount > 50000)) risks[2].probability += 0.1;

    return risks;
};

// Main Component

interface CorporateDashboardProps {
    setActiveView?: (view: View) => void;
}

const CorporateCommandView: React.FC<CorporateDashboardProps> = ({ setActiveView }) => {
    const context = useContext(DataContext);
    
    // State Management
    const [activeTab, setActiveTab] = useState<'Overview' | 'Finance' | 'Operations' | 'Risk' | 'Strategy'>('Overview');
    const [aiInsight, setAiInsight] = useState<string>('Initializing AI...');
    const [isAiProcessing, setIsAiProcessing] = useState<boolean>(false);
    const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

    if (!context) throw new Error("CorporateCommandView requires DataContext.");
    const { paymentOrders, invoices, complianceCases, corporateTransactions } = context;

    // Data Aggregation
    
    // Financials
    const totalRevenue = invoices.filter(i => i.status === 'paid').reduce((acc, i) => acc + i.amount, 0);
    const totalExpenses = corporateTransactions.reduce((acc, t) => acc + t.amount, 0);
    const netIncome = totalRevenue - totalExpenses;
    const financialRatios = calculateEnterpriseFinancialRatios(invoices, paymentOrders, corporateTransactions);
    const cashFlowForecast = generateCashFlowProjections(invoices, paymentOrders);
    const taxLiabilities = estimateTaxLiabilities(totalRevenue, totalExpenses);

    // Operations
    const dailyVolume = generateDailyTransactionAnalytics(corporateTransactions);
    const operationalSpend = segmentOperationalSpend(corporateTransactions);
    const vendorMetrics = analyzeVendorEcosystem(corporateTransactions);
    const topVendors = vendorMetrics.slice(0, 5);
    
    // Risk
    const riskHeatmap = generateEnterpriseRiskHeatmap(complianceCases, corporateTransactions);
    const openComplianceCases = complianceCases.filter(c => c.status === 'open');
    const criticalRisks = riskHeatmap.filter(r => r.probability * r.impact > 0.15);

    // AI Integration
    useEffect(() => {
        const generateStrategicReport = async () => {
            setIsAiProcessing(true);
            try {
                const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
                
                let promptContext = '';
                if (activeTab === 'Overview') {
                    promptContext = `Executive Summary: Revenue $${totalRevenue}, Expenses $${totalExpenses}, Net Income $${netIncome}. Critical Risks: ${criticalRisks.length}. Top Vendor: ${topVendors[0]?.vendor}.`;
                } else if (activeTab === 'Finance') {
                    promptContext = `Financial Deep Dive: Current Ratio ${financialRatios[0].value.toFixed(2)}, Net Margin ${financialRatios[1].value.toFixed(2)}%. Cash Flow Trend: ${cashFlowForecast[0].netPosition > 0 ? 'Positive' : 'Negative'}. Tax Liability: $${taxLiabilities.reduce((s, t) => s + t.estimatedAmount, 0).toFixed(2)}.`;
                } else if (activeTab === 'Operations') {
                    promptContext = `Ops Report: Transaction Volume ${dailyVolume.length} days active. Top Spend Category: ${operationalSpend.sort((a,b) => b.value - a.value)[0]?.category}. Vendor Count: ${vendorMetrics.length}.`;
                } else if (activeTab === 'Risk') {
                    promptContext = `Risk Assessment: Open Cases ${openComplianceCases.length}. Highest Risk Category: ${riskHeatmap.sort((a,b) => b.probability - a.probability)[0]?.riskCategory}. Exposure: $${riskHeatmap.reduce((s,r) => s + r.exposureValue, 0)}.`;
                } else {
                    promptContext = `Strategic Outlook: Based on burn rate of $${financialRatios[2].value.toFixed(2)}/day and projected cash flow. Suggest 3 strategic moves for growth and stability.`;
                }

                const prompt = `You are an advanced Corporate AI Assistant. Analyze the following data context for the '${activeTab}' view and provide a high-level, professional, actionable strategic insight (max 2 sentences). Context: ${promptContext}`;
                
                const response = await ai.models.generateContent({
                    model: 'gemini-2.5-flash',
                    contents: prompt,
                });
                setAiInsight(response.text);
                setLastUpdated(new Date());
            } catch (error) {
                console.error("AI Processing Error:", error);
                setAiInsight("AI link unavailable. Using fallback data.");
            } finally {
                setIsAiProcessing(false);
            }
        };

        generateStrategicReport();
    }, [activeTab, totalRevenue, totalExpenses, netIncome]);

    // Visualization Utilities
    const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#6366f1'];
    
    const formatCurrency = (val: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', notation: 'compact' }).format(val);
    const formatNumber = (val: number) => new Intl.NumberFormat('en-US', { notation: 'compact' }).format(val);

    // Inline Sub-Components
    
    const TabButton = ({ id, label }: { id: typeof activeTab, label: string }) => (
        <button 
            onClick={() => setActiveTab(id)}
            className={`px-6 py-3 text-sm font-bold tracking-wide transition-all duration-200 border-b-2 ${
                activeTab === id 
                ? 'border-blue-500 text-white bg-gray-800/50' 
                : 'border-transparent text-gray-400 hover:text-white hover:bg-gray-800/30'
            }`}
        >
            {label}
        </button>
    );

    const MetricCard: React.FC<{ title: string, value: string, subtext?: string, trend?: number, color?: string }> = ({ title, value, subtext, trend, color = 'blue' }) => (
        <div className={`bg-gray-800 border border-gray-700 p-6 rounded-xl shadow-lg relative overflow-hidden group hover:border-${color}-500 transition-colors`}>
            <div className={`absolute top-0 right-0 w-24 h-24 bg-${color}-500/10 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110`} />
            <h3 className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-2">{title}</h3>
            <div className="text-3xl font-bold text-white mb-1">{value}</div>
            {subtext && <div className="text-gray-500 text-sm">{subtext}</div>}
            {trend !== undefined && (
                <div className={`text-sm font-medium mt-3 flex items-center ${trend >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {trend >= 0 ? 'â†‘' : 'â†“'} {Math.abs(trend)}% <span className="text-gray-600 ml-1">vs last period</span>
                </div>
            )}
        </div>
    );

    // Component Rendering

    return (
        <div className="min-h-screen bg-gray-900 text-white p-2 space-y-8 font-sans">
            
            {/* HEADER & NAVIGATION */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-gray-800 pb-6">
                <div>
                    <h1 className="text-4xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
                        NEXUS COMMAND
                    </h1>
                    <p className="text-gray-400 text-sm mt-1">Enterprise Operating System v4.2.0 â€¢ {lastUpdated.toLocaleString()}</p>
                </div>
                <div className="flex space-x-1 mt-4 md:mt-0 bg-gray-900 rounded-lg p-1 border border-gray-800">
                    <TabButton id="Overview" label="EXECUTIVE" />
                    <TabButton id="Finance" label="FINANCE" />
                    <TabButton id="Operations" label="OPERATIONS" />
                    <TabButton id="Risk" label="RISK & COMPLIANCE" />
                    <TabButton id="Strategy" label="STRATEGY" />
                </div>
            </div>

            {/* AI INSIGHT BAR */}
            <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 blur-xl rounded-lg" />
                <Card className="relative bg-gray-800/80 backdrop-blur border border-blue-500/30 p-6">
                    <div className="flex items-start space-x-4">
                        <div className="p-3 bg-blue-500/10 rounded-full animate-pulse">
                            <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                        </div>
                        <div className="flex-1">
                            <h3 className="text-blue-400 text-xs font-bold uppercase tracking-widest mb-1">AI Strategic Intelligence</h3>
                            {isAiProcessing ? (
                                <div className="h-6 bg-gray-700 rounded w-3/4 animate-pulse" />
                            ) : (
                                <p className="text-lg text-gray-100 leading-relaxed font-light">"{aiInsight}"</p>
                            )}
                        </div>
                    </div>
                </Card>
            </div>

            {/* DYNAMIC CONTENT AREA */}
            <div className="space-y-8 animate-fade-in">
                
                {/* OVERVIEW TAB */}
                {activeTab === 'Overview' && (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <MetricCard title="Total Revenue (YTD)" value={formatCurrency(totalRevenue)} trend={12.5} color="green" />
                            <MetricCard title="Net Income" value={formatCurrency(netIncome)} trend={8.2} color="blue" />
                            <MetricCard title="Active Risks" value={criticalRisks.length.toString()} subtext="Critical Severity" trend={-5.0} color="red" />
                            <MetricCard title="Cash Runway" value="14.2 Months" subtext="Based on current burn" color="purple" />
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-96">
                            <Card title="Revenue vs Expenses Trend" className="lg:col-span-2 h-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={cashFlowForecast}>
                                        <XAxis dataKey="period" stroke="#6b7280" fontSize={12} />
                                        <YAxis stroke="#6b7280" fontSize={12} tickFormatter={(val) => `$${val/1000}k`} />
                                        <Tooltip contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151', color: '#fff' }} />
                                        <Legend />
                                        <Bar dataKey="inflow" name="Inflow" fill="#10b981" radius={[4, 4, 0, 0]} />
                                        <Bar dataKey="outflow" name="Outflow" fill="#ef4444" radius={[4, 4, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </Card>
                            <Card title="Operational Spend Mix" className="h-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie data={operationalSpend} dataKey="value" nameKey="category" cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5}>
                                            {operationalSpend.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                        <Legend verticalAlign="bottom" height={36} />
                                    </PieChart>
                                </ResponsiveContainer>
                            </Card>
                        </div>
                    </>
                )}

                {/* FINANCE TAB */}
                {activeTab === 'Finance' && (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {financialRatios.map((ratio, idx) => (
                                <MetricCard 
                                    key={idx} 
                                    title={ratio.name} 
                                    value={typeof ratio.value === 'number' && ratio.value < 100 ? ratio.value.toFixed(2) : formatNumber(ratio.value)} 
                                    subtext={`Benchmark: ${ratio.benchmark}`}
                                    trend={ratio.delta}
                                    color={ratio.status === 'Healthy' ? 'green' : ratio.status === 'Warning' ? 'yellow' : 'red'}
                                />
                            ))}
                        </div>
                        
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <Card title="Projected Cash Position (6 Months)" className="h-80">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={cashFlowForecast}>
                                        <XAxis dataKey="period" stroke="#6b7280" />
                                        <YAxis stroke="#6b7280" tickFormatter={(val) => `$${val/1000}k`} />
                                        <Tooltip cursor={{fill: '#374151'}} contentStyle={{ backgroundColor: '#1f2937' }} />
                                        <Bar dataKey="cumulativeCash" fill="#3b82f6" name="Cash Balance" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </Card>
                            <Card title="Estimated Tax Liability Breakdown" className="h-80 overflow-auto">
                                <table className="w-full text-left text-sm text-gray-400">
                                    <thead className="bg-gray-800 text-gray-200 uppercase font-bold">
                                        <tr>
                                            <th className="p-3">Jurisdiction</th>
                                            <th className="p-3">Type</th>
                                            <th className="p-3 text-right">Amount</th>
                                            <th className="p-3">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-700">
                                        {taxLiabilities.map((tax, i) => (
                                            <tr key={i} className="hover:bg-gray-800/50">
                                                <td className="p-3">{tax.jurisdiction}</td>
                                                <td className="p-3">{tax.taxType}</td>
                                                <td className="p-3 text-right font-mono text-white">{formatCurrency(tax.estimatedAmount)}</td>
                                                <td className="p-3">
                                                    <span className={`px-2 py-1 rounded text-xs font-bold ${tax.status === 'Paid' ? 'bg-green-900 text-green-300' : 'bg-yellow-900 text-yellow-300'}`}>
                                                        {tax.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </Card>
                        </div>
                    </>
                )}

                {/* OPERATIONS TAB */}
                {activeTab === 'Operations' && (
                    <>
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            <Card title="Daily Transaction Volume" className="lg:col-span-2 h-96">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={dailyVolume}>
                                        <XAxis dataKey="date" stroke="#6b7280" fontSize={10} tickFormatter={(d) => d.substring(5)} />
                                        <YAxis yAxisId="left" stroke="#3b82f6" fontSize={12} tickFormatter={(val) => `$${val/1000}k`} />
                                        <YAxis yAxisId="right" orientation="right" stroke="#10b981" fontSize={12} />
                                        <Tooltip contentStyle={{ backgroundColor: '#1f2937' }} />
                                        <Bar yAxisId="left" dataKey="value" fill="#3b82f6" name="Volume ($)" opacity={0.8} />
                                        <Bar yAxisId="right" dataKey="secondaryValue" fill="#10b981" name="Count" barSize={10} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </Card>
                            <Card title="Top Vendor Ecosystem" className="h-96 overflow-auto">
                                <div className="space-y-4">
                                    {topVendors.map((vendor, i) => (
                                        <div key={i} className="flex items-center justify-between p-3 bg-gray-800 rounded border border-gray-700">
                                            <div>
                                                <div className="font-bold text-white">{vendor.vendor}</div>
                                                <div className="text-xs text-gray-500">{vendor.transactionCount} txns â€¢ Risk: {vendor.riskScore}/100</div>
                                            </div>
                                            <div className="text-right">
                                                <div className="font-mono text-blue-400">{formatCurrency(vendor.totalSpend)}</div>
                                                <div className="text-xs text-gray-500">Avg: {formatCurrency(vendor.avgTransactionValue)}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </Card>
                        </div>
                    </>
                )}

                {/* RISK TAB */}
                {activeTab === 'Risk' && (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <MetricCard title="Compliance Score" value="94.2" subtext="Top 5% Industry" color="green" />
                            <MetricCard title="Open Cases" value={openComplianceCases.length.toString()} subtext="Requires Attention" color="yellow" />
                            <MetricCard title="Total Risk Exposure" value={formatCurrency(riskHeatmap.reduce((a,b)=>a+b.exposureValue,0))} color="red" />
                            <MetricCard title="Audit Anomalies" value="3" subtext="Last 24 Hours" color="purple" />
                        </div>
                        
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <Card title="Enterprise Risk Heatmap" className="h-96">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={riskHeatmap} layout="vertical" margin={{ left: 40 }}>
                                        <XAxis type="number" domain={[0, 1]} hide />
                                        <YAxis type="category" dataKey="riskCategory" stroke="#9ca3af" width={120} fontSize={11} />
                                        <Tooltip cursor={{fill: 'transparent'}} content={({ active, payload }) => {
                                            if (active && payload && payload.length) {
                                                const data = payload[0].payload;
                                                return (
                                                    <div className="bg-gray-900 border border-gray-700 p-3 rounded shadow-xl">
                                                        <p className="font-bold text-white">{data.riskCategory}</p>
                                                        <p className="text-sm text-gray-400">Prob: {(data.probability * 100).toFixed(0)}% | Impact: {(data.impact * 100).toFixed(0)}%</p>
                                                        <p className="text-sm text-red-400">Exposure: {formatCurrency(data.exposureValue)}</p>
                                                    </div>
                                                );
                                            }
                                            return null;
                                        }} />
                                        <Bar dataKey="probability" name="Probability" stackId="a" fill="#f59e0b" barSize={20} />
                                        <Bar dataKey="impact" name="Impact" stackId="a" fill="#ef4444" barSize={20} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </Card>
                            <Card title="Compliance Case Log" className="h-96 overflow-auto">
                                <div className="space-y-2">
                                    {complianceCases.map((c, i) => (
                                        <div key={i} className="p-3 border-l-4 border-red-500 bg-gray-800/50 rounded flex justify-between items-center">
                                            <div>
                                                <div className="font-bold text-sm text-white">{c.type} Violation</div>
                                                <div className="text-xs text-gray-500">{c.description}</div>
                                            </div>
                                            <span className={`px-2 py-1 text-xs rounded font-bold ${c.status === 'open' ? 'bg-red-900 text-red-200' : 'bg-gray-700 text-gray-300'}`}>
                                                {c.status.toUpperCase()}
                                            </span>
                                        </div>
                                    ))}
                                    {complianceCases.length === 0 && <div className="text-center text-gray-500 py-10">No active compliance cases detected. Systems nominal.</div>}
                                </div>
                            </Card>
                        </div>
                    </>
                )}

                {/* STRATEGY TAB */}
                {activeTab === 'Strategy' && (
                    <div className="grid grid-cols-1 gap-6">
                        <Card title="Strategic Growth Modeling" className="p-8 bg-gradient-to-br from-gray-800 to-gray-900">
                            <div className="flex flex-col md:flex-row gap-8">
                                <div className="flex-1 space-y-6">
                                    <h3 className="text-2xl font-bold text-white">Scenario Analysis: Aggressive Expansion</h3>
                                    <p className="text-gray-400">
                                        Based on current liquidity of {formatCurrency(financialRatios[0].value * 1000000)} and a burn rate of {formatCurrency(financialRatios[2].value)}, 
                                        the enterprise can sustain a 15% increase in R&D spend for 8 months before requiring additional capital injection.
                                    </p>
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-sm text-gray-300">
                                            <span>Market Penetration Probability</span>
                                            <span>78%</span>
                                        </div>
                                        <div className="w-full bg-gray-700 rounded-full h-2">
                                            <div className="bg-blue-500 h-2 rounded-full" style={{ width: '78%' }}></div>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-sm text-gray-300">
                                            <span>Regulatory Approval Confidence</span>
                                            <span>92%</span>
                                        </div>
                                        <div className="w-full bg-gray-700 rounded-full h-2">
                                            <div className="bg-green-500 h-2 rounded-full" style={{ width: '92%' }}></div>
                                        </div>
                                    </div>
                                </div>
                                <div className="w-full md:w-1/3 bg-gray-800 p-6 rounded-xl border border-gray-700">
                                    <h4 className="font-bold text-white mb-4">AI Recommendation Engine</h4>
                                    <ul className="space-y-4">
                                        <li className="flex items-start space-x-3">
                                            <span className="text-green-400 text-xl">âœ“</span>
                                            <span className="text-sm text-gray-300">Optimize vendor contracts to reduce variable OPEX by 12%.</span>
                                        </li>
                                        <li className="flex items-start space-x-3">
                                            <span className="text-green-400 text-xl">âœ“</span>
                                            <span className="text-sm text-gray-300">Accelerate receivables collection to improve DSO by 5 days.</span>
                                        </li>
                                        <li className="flex items-start space-x-3">
                                            <span className="text-yellow-400 text-xl">âš </span>
                                            <span className="text-sm text-gray-300">Monitor geopolitical risk in supply chain region APAC-1.</span>
                                        </li>
                                    </ul>
                                    <button className="w-full mt-6 bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded transition-colors" onClick={() => setActiveView && setActiveView(View.Budgets)}>
                                        Adjust Budgets
                                    </button>
                                </div>
                            </div>
                        </Card>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CorporateCommandView;

================================================================================
// APPENDED FROM REPO: diplomat-bit/magic | ORIGINAL PATH: diplomat-bit-magic-a3f5ff1/components/CorporateCommandView (5).tsx
================================================================================

import React, { useContext, useState, useEffect, useCallback } from 'react';
import { DataContext } from '../context/DataContext';
import Card from './Card';
import { View, PaymentOrder, Invoice, ComplianceCase, CorporateTransaction } from '../types';
import { GoogleGenAI } from '@google/genai';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, Legend, PieChart, Pie, Cell, AreaChart, Area, LineChart, Line } from 'recharts';

// --- EXPANDED DATA STRUCTURES FOR HYPER-DIMENSIONAL ANALYSIS ---

export type TimeSeriesData = { date: string; value: number; secondaryValue?: number; tertiaryValue?: number; };
export type CategoricalData = { category: string; value: number; percentage?: number; color?: string; };
export type FinancialRatio = { name: string; value: number; benchmark: number; status: 'Optimal' | 'Stable' | 'Warning' | 'Critical'; delta: number; };
export type VendorPerformanceMetric = { vendor: string; totalSpend: number; transactionCount: number; avgTransactionValue: number; riskScore: number; lastInteraction: string; };
export type DepartmentalKPI = { department: string; budgetUtilization: number; operationalEfficiency: number; complianceScore: number; headcountSpend: number; };
export type RiskAssessmentData = { riskCategory: string; probability: number; impact: number; velocity: number; mitigationStatus: string; exposureValue: number; };
export type CashFlowProjection = { period: string; inflow: number; outflow: number; netPosition: number; cumulativeCash: number; };
export type AuditLogEntry = { timestamp: string; user: string; action: string; severity: 'Low' | 'Medium' | 'High' | 'Critical'; details: string; };
export type TaxLiabilityBreakdown = { jurisdiction: string; taxType: string; estimatedAmount: number; dueDate: string; status: 'Accrued' | 'Paid' | 'Pending'; };

// High-Frequency Trading & Market Intelligence Structures
export type MarketDataTick = { symbol: string; price: number; change: number; volume: number; timestamp: number; };
export type TradingAlgorithm = { id: string; name: string; strategy: 'Momentum' | 'Arbitrage' | 'Mean Reversion'; status: 'Active' | 'Paused' | 'Terminated'; pnl: number; trades: number; uptime: string; };
export type PortfolioMetrics = { totalValue: number; dailyPnl: number; valueAtRisk: number; sharpeRatio: number; alpha: number; };
export type GlobalMacroIndicator = { name: string; value: number; trend: 'Up' | 'Down' | 'Stable'; impact: 'High' | 'Medium' | 'Low'; region: string; };
export type StrategicInitiative = { id: string; name: string; description: string; budget: number; projectedROI: number; status: 'Planning' | 'Active' | 'Completed'; };

// --- EXPANDED DATA PROCESSING & SIMULATION FUNCTIONS ---

export const generateDailyTransactionAnalytics = (transactions: CorporateTransaction[]): TimeSeriesData[] => {
    const dailyMap: Record<string, { count: number; amount: number }> = {};
    transactions.forEach(tx => {
        const date = new Date(tx.date).toISOString().split('T')[0];
        if (!dailyMap[date]) dailyMap[date] = { count: 0, amount: 0 };
        dailyMap[date].count++;
        dailyMap[date].amount += tx.amount;
    });
    return Object.entries(dailyMap).map(([date, data]) => ({ date, value: data.amount, secondaryValue: data.count })).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
};

export const calculateEnterpriseFinancialRatios = (invoices: Invoice[], orders: PaymentOrder[], transactions: CorporateTransaction[]): FinancialRatio[] => {
    const currentAssets = invoices.filter(i => i.status !== 'paid').reduce((sum, i) => sum + i.amount, 0);
    const currentLiabilities = orders.filter(o => o.status !== 'paid').reduce((sum, o) => sum + o.amount, 0);
    const totalRevenue = invoices.filter(i => i.status === 'paid').reduce((sum, i) => sum + i.amount, 0);
    const totalExpenses = transactions.reduce((sum, t) => sum + t.amount, 0);
    const currentRatio = currentLiabilities > 0 ? currentAssets / currentLiabilities : 0;
    const netProfitMargin = totalRevenue > 0 ? ((totalRevenue - totalExpenses) / totalRevenue) * 100 : 0;
    const burnRate = totalExpenses / 30;
    return [
        { name: 'Current Ratio', value: currentRatio, benchmark: 2.0, status: currentRatio > 2.0 ? 'Optimal' : currentRatio > 1.2 ? 'Stable' : 'Warning', delta: 0.1 },
        { name: 'Net Profit Margin', value: netProfitMargin, benchmark: 20, status: netProfitMargin > 20 ? 'Optimal' : netProfitMargin > 10 ? 'Stable' : 'Warning', delta: -2.5 },
        { name: 'Daily Burn Rate', value: burnRate, benchmark: 5000, status: burnRate < 5000 ? 'Optimal' : 'Warning', delta: 12.4 }
    ];
};

export const generateCashFlowProjections = (invoices: Invoice[], orders: PaymentOrder[]): CashFlowProjection[] => {
    const projections: CashFlowProjection[] = [];
    let currentCash = 1000000;
    for (let i = 0; i < 12; i++) { // Extended to 12 months
        const futureDate = new Date(); futureDate.setMonth(futureDate.getMonth() + i);
        const periodKey = futureDate.toISOString().substring(0, 7);
        const projectedInflow = invoices.filter(inv => new Date(inv.dueDate).getMonth() === futureDate.getMonth()).reduce((sum, inv) => sum + inv.amount, 0) * 0.95;
        const projectedOutflow = orders.filter(ord => new Date(ord.dueDate || '').getMonth() === futureDate.getMonth()).reduce((sum, ord) => sum + ord.amount, 0) * 1.1;
        const net = projectedInflow - projectedOutflow;
        currentCash += net;
        projections.push({ period: periodKey, inflow: projectedInflow, outflow: projectedOutflow, netPosition: net, cumulativeCash: currentCash });
    }
    return projections;
};

export const analyzeVendorEcosystem = (transactions: CorporateTransaction[]): VendorPerformanceMetric[] => {
    const vendorMap: Record<string, VendorPerformanceMetric> = {};
    transactions.forEach(tx => {
        if (!vendorMap[tx.merchant]) vendorMap[tx.merchant] = { vendor: tx.merchant, totalSpend: 0, transactionCount: 0, avgTransactionValue: 0, riskScore: Math.floor(Math.random() * 100), lastInteraction: tx.date };
        const v = vendorMap[tx.merchant];
        v.totalSpend += tx.amount; v.transactionCount++; v.avgTransactionValue = v.totalSpend / v.transactionCount;
        if (new Date(tx.date) > new Date(v.lastInteraction)) v.lastInteraction = tx.date;
    });
    return Object.values(vendorMap).sort((a, b) => b.totalSpend - a.totalSpend);
};

export const segmentOperationalSpend = (transactions: CorporateTransaction[]): CategoricalData[] => {
    const categories = { 'Infrastructure': 0, 'COGS': 0, 'R&D': 0, 'S&M': 0, 'G&A': 0, 'Quantum Computing': 0 };
    transactions.forEach(tx => {
        if (tx.merchant.includes('AWS') || tx.merchant.includes('Server')) categories['Infrastructure'] += tx.amount;
        else if (tx.merchant.includes('Supplier')) categories['COGS'] += tx.amount;
        else if (tx.description.includes('Research')) categories['R&D'] += tx.amount;
        else if (tx.merchant.includes('Ads')) categories['S&M'] += tx.amount;
        else if (tx.description.includes('Quantum')) categories['Quantum Computing'] += tx.amount;
        else categories['G&A'] += tx.amount;
    });
    return Object.entries(categories).map(([category, value]) => ({ category, value }));
};

export const generateEnterpriseRiskHeatmap = (cases: ComplianceCase[], transactions: CorporateTransaction[]): RiskAssessmentData[] => {
    const risks: RiskAssessmentData[] = [
        { riskCategory: 'AML/KYC', probability: 0.15, impact: 0.9, velocity: 0.8, mitigationStatus: 'Monitoring', exposureValue: 500000 },
        { riskCategory: 'Cybersecurity', probability: 0.3, impact: 0.99, velocity: 0.9, mitigationStatus: 'Hardened', exposureValue: 5000000 },
        { riskCategory: 'Geopolitical', probability: 0.4, impact: 0.7, velocity: 0.5, mitigationStatus: 'Contingency Plan', exposureValue: 1200000 },
        { riskCategory: 'Market Volatility', probability: 0.6, impact: 0.5, velocity: 0.95, mitigationStatus: 'Hedged', exposureValue: 2500000 },
        { riskCategory: 'AI Model Drift', probability: 0.25, impact: 0.8, velocity: 0.6, mitigationStatus: 'Continuous Training', exposureValue: 900000 },
    ];
    if (cases.some(c => c.type === 'AML')) risks[0].probability += 0.2;
    if (transactions.some(t => t.amount > 50000)) risks[1].probability += 0.1;
    return risks;
};

// --- MAIN COMPONENT: NEXUS COMMAND ---

interface CorporateDashboardProps { setActiveView: (view: View) => void; }

const CorporateCommandView: React.FC<CorporateDashboardProps> = ({ setActiveView }) => {
    const context = useContext(DataContext);
    if (!context) throw new Error("CorporateCommandView requires DataContext.");
    const { paymentOrders, invoices, complianceCases, corporateTransactions } = context;

    // State Management
    const [activeTab, setActiveTab] = useState<'Overview' | 'Finance' | 'Operations' | 'Risk' | 'Strategy' | 'Markets'>('Overview');
    const [aiInsight, setAiInsight] = useState<string>('Initializing AI...');
    const [isAiProcessing, setIsAiProcessing] = useState<boolean>(false);
    const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
    const [marketData, setMarketData] = useState<MarketDataTick[]>([]);
    const [tradingAlgos, setTradingAlgos] = useState<TradingAlgorithm[]>([
        { id: 'algo-001', name: 'Orion Arbitrage', strategy: 'Arbitrage', status: 'Active', pnl: 125430.50, trades: 10532, uptime: '99.8%' },
        { id: 'algo-002', name: 'Titan Momentum', strategy: 'Momentum', status: 'Active', pnl: 89321.75, trades: 4301, uptime: '99.9%' },
        { id: 'algo-003', name: 'Helios Reversion', strategy: 'Mean Reversion', status: 'Paused', pnl: -12034.10, trades: 887, uptime: '92.1%' },
    ]);

    // Data Aggregation & Memoization
    const totalRevenue = invoices.filter(i => i.status === 'paid').reduce((acc, i) => acc + i.amount, 0);
    const totalExpenses = corporateTransactions.reduce((acc, t) => acc + t.amount, 0);
    const netIncome = totalRevenue - totalExpenses;
    const financialRatios = calculateEnterpriseFinancialRatios(invoices, paymentOrders, corporateTransactions);
    const cashFlowForecast = generateCashFlowProjections(invoices, paymentOrders);
    const dailyVolume = generateDailyTransactionAnalytics(corporateTransactions);
    const operationalSpend = segmentOperationalSpend(corporateTransactions);
    const vendorMetrics = analyzeVendorEcosystem(corporateTransactions);
    const riskHeatmap = generateEnterpriseRiskHeatmap(complianceCases, corporateTransactions);
    const portfolioMetrics: PortfolioMetrics = { totalValue: 15780000, dailyPnl: 214752.25, valueAtRisk: 1200000, sharpeRatio: 2.8, alpha: 0.12 };

    // AI Integration Hook
    useEffect(() => {
        const generateStrategicReport = async () => {
            setIsAiProcessing(true);
            try {
                const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
                let promptContext = `Analyze the following data for the '${activeTab}' view and provide a high-level, actionable strategic insight (max 2 sentences). Context: `;
                if (activeTab === 'Overview') promptContext += `Rev $${totalRevenue}, Net $${netIncome}. Critical Risks: ${riskHeatmap.filter(r => r.probability * r.impact > 0.15).length}.`;
                else if (activeTab === 'Finance') promptContext += `Current Ratio ${financialRatios[0].value.toFixed(2)}. Cash Flow Trend: ${cashFlowForecast[0].netPosition > 0 ? 'Positive' : 'Negative'}.`;
                else if (activeTab === 'Operations') promptContext += `Top Spend: ${operationalSpend.sort((a,b) => b.value - a.value)[0]?.category}. Vendor Count: ${vendorMetrics.length}.`;
                else if (activeTab === 'Risk') promptContext += `Highest Risk: ${riskHeatmap.sort((a,b) => b.probability - a.probability)[0]?.riskCategory}. Total Exposure: $${riskHeatmap.reduce((s,r) => s + r.exposureValue, 0)}.`;
                else if (activeTab === 'Markets') promptContext += `Portfolio Value: $${portfolioMetrics.totalValue}. Daily PnL: $${portfolioMetrics.dailyPnl}. VaR: $${portfolioMetrics.valueAtRisk}.`;
                else promptContext += `Based on burn rate of $${financialRatios[2].value.toFixed(2)}/day, suggest 3 strategic moves for growth.`;
                
                const response = await ai.models.generateContent({
                    model: 'gemini-2.5-flash',
                    contents: promptContext,
                    config: {
                        systemInstruction: "You are a hyper-intelligent AI financial and strategic advisor integrated into the NEXUS COMMAND enterprise OS. Provide concise, data-driven insights.",
                        thinkingConfig: {
                            thinkingBudget: 0, // Disables thinking for faster response in UI
                        },
                    }
                });
                setAiInsight(response.text);
            } catch (error) { setAiInsight("AI link unavailable. Using fallback data."); } 
            finally { setIsAiProcessing(false); setLastUpdated(new Date()); }
        };
        generateStrategicReport();
    }, [activeTab, totalRevenue, netIncome]);

    // Market Data Simulation Hook
    useEffect(() => {
        const symbols = ['NEX-USD', 'BTC-USD', 'ETH-USD', 'QNTM-IDX'];
        const initialPrices: Record<string, number> = { 'NEX-USD': 125.4, 'BTC-USD': 68000, 'ETH-USD': 3500, 'QNTM-IDX': 2400 };
        const interval = setInterval(() => {
            const newTick = symbols[Math.floor(Math.random() * symbols.length)];
            const oldPrice = marketData.find(d => d.symbol === newTick)?.price || initialPrices[newTick];
            const change = (Math.random() - 0.5) * oldPrice * 0.01;
            const newPrice = oldPrice + change;
            setMarketData(prev => [{ symbol: newTick, price: newPrice, change, volume: Math.random() * 10, timestamp: Date.now() }, ...prev.slice(0, 99)]);
        }, 500); // High-frequency update
        return () => clearInterval(interval);
    }, [marketData]);

    // --- UTILITIES & INLINE SUB-COMPONENTS ---
    const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#6366f1'];
    const formatCurrency = (val: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', notation: 'compact' }).format(val);
    const formatNumber = (val: number) => new Intl.NumberFormat('en-US', { notation: 'compact' }).format(val);
    const TabButton = ({ id, label }: { id: typeof activeTab, label: string }) => (<button onClick={() => setActiveTab(id)} className={`px-5 py-2 text-xs font-bold tracking-wider transition-all duration-200 border-b-2 ${activeTab === id ? 'border-blue-500 text-white bg-gray-800/50' : 'border-transparent text-gray-400 hover:text-white hover:bg-gray-800/30'}`}>{label}</button>);
    const MetricCard = ({ title, value, subtext, trend, color = 'blue' }: { title: string, value: string, subtext?: string, trend?: number, color?: string }) => (
        <div className={`bg-gray-800/50 border border-gray-700 p-4 rounded-lg shadow-lg relative overflow-hidden group hover:border-${color}-500 transition-colors backdrop-blur-sm`}>
            <div className={`absolute top-0 right-0 w-20 h-20 bg-${color}-500/10 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110`} />
            <h3 className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-1">{title}</h3>
            <div className="text-2xl font-bold text-white mb-1">{value}</div>
            {subtext && <div className="text-gray-500 text-xs">{subtext}</div>}
            {trend !== undefined && <div className={`text-xs font-medium mt-2 flex items-center ${trend >= 0 ? 'text-green-400' : 'text-red-400'}`}>{trend >= 0 ? 'â†‘' : 'â†“'} {Math.abs(trend)}%</div>}
        </div>
    );
    const DeployAlgoForm = () => (
        <Card title="Deploy New Trading Algorithm" className="h-full">
            <form className="space-y-4 text-sm">
                <div><label className="text-gray-400 block mb-1">Algorithm Name</label><input type="text" className="w-full bg-gray-900 border border-gray-700 rounded p-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="e.g., Apollo Scalper" /></div>
                <div><label className="text-gray-400 block mb-1">Strategy</label><select className="w-full bg-gray-900 border border-gray-700 rounded p-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"><option>Momentum</option><option>Arbitrage</option><option>Mean Reversion</option><option>AI Predictive</option></select></div>
                <div className="grid grid-cols-2 gap-4">
                    <div><label className="text-gray-400 block mb-1">Capital Allocation</label><input type="number" className="w-full bg-gray-900 border border-gray-700 rounded p-2 text-white" placeholder="100,000" /></div>
                    <div><label className="text-gray-400 block mb-1">Max Drawdown (%)</label><input type="number" className="w-full bg-gray-900 border border-gray-700 rounded p-2 text-white" placeholder="5" /></div>
                </div>
                <button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded transition-colors">Deploy & Activate</button>
            </form>
        </Card>
    );

    // --- COMPONENT RENDER ---
    return (
        <div className="min-h-screen bg-gray-900 text-white p-4 space-y-6 font-sans">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-gray-800 pb-4">
                <div>
                    <h1 className="text-3xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">NEXUS COMMAND</h1>
                    <p className="text-gray-400 text-xs mt-1">Enterprise Operating System v5.0.1 â€¢ {lastUpdated.toLocaleString()}</p>
                </div>
                <div className="flex space-x-1 mt-4 md:mt-0 bg-gray-900/50 rounded-md p-1 border border-gray-800">
                    <TabButton id="Overview" label="OVERVIEW" /><TabButton id="Finance" label="FINANCE" /><TabButton id="Operations" label="OPERATIONS" /><TabButton id="Risk" label="RISK" /><TabButton id="Strategy" label="STRATEGY" /><TabButton id="Markets" label="MARKETS" />
                </div>
            </div>

            <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10 blur-2xl rounded-lg" />
                <Card className="relative bg-gray-800/50 backdrop-blur border border-blue-500/30 p-4">
                    <div className="flex items-start space-x-4"><div className="p-2 bg-blue-500/10 rounded-full"><svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg></div>
                        <div className="flex-1"><h3 className="text-blue-400 text-xs font-bold uppercase tracking-widest mb-1">AI Strategic Intelligence</h3>
                            {isAiProcessing ? <div className="h-5 bg-gray-700 rounded w-3/4 animate-pulse" /> : <p className="text-base text-gray-100 leading-relaxed font-light">"{aiInsight}"</p>}
                        </div>
                    </div>
                </Card>
            </div>

            <div className="space-y-6 animate-fade-in">
                {activeTab === 'Overview' && (<>
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        <MetricCard title="Total Revenue (YTD)" value={formatCurrency(totalRevenue)} trend={12.5} color="green" />
                        <MetricCard title="Net Income" value={formatCurrency(netIncome)} trend={8.2} color="blue" />
                        <MetricCard title="Active Risks" value={riskHeatmap.filter(r => r.probability * r.impact > 0.15).length.toString()} subtext="Critical Severity" trend={-5.0} color="red" />
                        <MetricCard title="Cash Runway" value="14.2 Months" subtext="Based on current burn" color="purple" />
                        <MetricCard title="Portfolio PnL (24h)" value={formatCurrency(portfolioMetrics.dailyPnl)} trend={1.8} color="yellow" />
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-[400px]">
                        <Card title="Cash Flow Forecast (12 Months)" className="lg:col-span-2 h-full"><ResponsiveContainer width="100%" height="100%"><AreaChart data={cashFlowForecast} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}><XAxis dataKey="period" stroke="#6b7280" fontSize={11} /><YAxis stroke="#6b7280" fontSize={11} tickFormatter={(val) => `$${val/1000}k`} /><Tooltip contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151' }} /><Area type="monotone" dataKey="cumulativeCash" name="Cash Position" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.2} /></AreaChart></ResponsiveContainer></Card>
                        <Card title="Operational Spend Mix" className="h-full"><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={operationalSpend} dataKey="value" nameKey="category" cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5}>{operationalSpend.map((entry, index) => (<Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />))}</Pie><Tooltip contentStyle={{ backgroundColor: '#1f2937' }} /><Legend verticalAlign="bottom" height={36} iconSize={10} /></PieChart></ResponsiveContainer></Card>
                    </div>
                </>)}

                {activeTab === 'Finance' && (<>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">{financialRatios.map((ratio, idx) => (<MetricCard key={idx} title={ratio.name} value={typeof ratio.value === 'number' && ratio.value < 100 ? ratio.value.toFixed(2) : formatNumber(ratio.value)} subtext={`Benchmark: ${ratio.benchmark}`} trend={ratio.delta} color={ratio.status === 'Optimal' ? 'green' : ratio.status === 'Stable' ? 'blue' : 'red'} />))}</div>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4"><Card title="Revenue vs Expenses Trend" className="h-80"><ResponsiveContainer width="100%" height="100%"><BarChart data={cashFlowForecast}><XAxis dataKey="period" stroke="#6b7280" /><YAxis stroke="#6b7280" tickFormatter={(val) => `$${val/1000}k`} /><Tooltip contentStyle={{ backgroundColor: '#1f2937' }} /><Legend /><Bar dataKey="inflow" name="Inflow" fill="#10b981" radius={[4, 4, 0, 0]} /><Bar dataKey="outflow" name="Outflow" fill="#ef4444" radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer></Card><Card title="Tax Liability Accrual" className="h-80 overflow-auto"><table className="w-full text-left text-xs text-gray-400"><thead className="bg-gray-800 text-gray-200 uppercase font-bold"><tr><th className="p-2">Jurisdiction</th><th className="p-2">Type</th><th className="p-2 text-right">Amount</th><th className="p-2">Status</th></tr></thead><tbody className="divide-y divide-gray-700">{context.taxLiabilities.map((tax, i) => (<tr key={i} className="hover:bg-gray-800/50"><td className="p-2">{tax.jurisdiction}</td><td className="p-2">{tax.taxType}</td><td className="p-2 text-right font-mono text-white">{formatCurrency(tax.estimatedAmount)}</td><td className="p-2"><span className={`px-2 py-1 rounded text-xs font-bold ${tax.status === 'Paid' ? 'bg-green-900 text-green-300' : 'bg-yellow-900 text-yellow-300'}`}>{tax.status}</span></td></tr>))}</tbody></table></Card></div>
                </>)}

                {activeTab === 'Operations' && (<>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                        <Card title="Daily Transaction Analytics" className="lg:col-span-2 h-96"><ResponsiveContainer width="100%" height="100%"><BarChart data={dailyVolume}><XAxis dataKey="date" stroke="#6b7280" fontSize={10} tickFormatter={(d) => d.substring(5)} /><YAxis yAxisId="left" stroke="#3b82f6" fontSize={12} tickFormatter={(val) => `$${val/1000}k`} /><YAxis yAxisId="right" orientation="right" stroke="#10b981" fontSize={12} /><Tooltip contentStyle={{ backgroundColor: '#1f2937' }} /><Bar yAxisId="left" dataKey="value" fill="#3b82f6" name="Volume ($)" opacity={0.8} /><Bar yAxisId="right" dataKey="secondaryValue" fill="#10b981" name="Count" barSize={10} /></BarChart></ResponsiveContainer></Card>
                        <Card title="Top Vendor Ecosystem" className="h-96 overflow-auto"><div className="space-y-3">{vendorMetrics.slice(0, 10).map((vendor, i) => (<div key={i} className="flex items-center justify-between p-2 bg-gray-800 rounded border border-gray-700"><div><div className="font-bold text-white text-sm">{vendor.vendor}</div><div className="text-xs text-gray-500">{vendor.transactionCount} txns â€¢ Risk: {vendor.riskScore}/100</div></div><div className="text-right"><div className="font-mono text-blue-400 text-sm">{formatCurrency(vendor.totalSpend)}</div><div className="text-xs text-gray-500">Avg: {formatCurrency(vendor.avgTransactionValue)}</div></div></div>))}</div></Card>
                    </div>
                </>)}

                {activeTab === 'Risk' && (<>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4"><MetricCard title="Compliance Score" value="94.2" subtext="Top 5% Industry" color="green" /><MetricCard title="Open Cases" value={complianceCases.filter(c => c.status === 'open').length.toString()} subtext="Requires Attention" color="yellow" /><MetricCard title="Total Risk Exposure" value={formatCurrency(riskHeatmap.reduce((a,b)=>a+b.exposureValue,0))} color="red" /><MetricCard title="Audit Anomalies (24h)" value="3" color="purple" /></div>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        <Card title="Enterprise Risk Matrix (Prob x Impact x Velocity)" className="h-96">{/* A more complex chart could go here */}<div className="p-4 text-gray-400">Advanced 3D risk visualization module under development. Current heatmap shows critical vectors.</div></Card>
                        <Card title="Compliance Case Log" className="h-96 overflow-auto"><div className="space-y-2">{complianceCases.map((c, i) => (<div key={i} className="p-3 border-l-4 border-red-500 bg-gray-800/50 rounded flex justify-between items-center"><div className="flex-1"><div className="font-bold text-sm text-white">{c.type} Violation</div><div className="text-xs text-gray-500 truncate">{c.description}</div></div><span className={`ml-4 px-2 py-1 text-xs rounded font-bold ${c.status === 'open' ? 'bg-red-900 text-red-200' : 'bg-gray-700 text-gray-300'}`}>{c.status.toUpperCase()}</span></div>))}</div></Card>
                    </div>
                </>)}

                {activeTab === 'Strategy' && (<>
                    <Card title="Strategic Growth & Initiative Modeling"><div className="flex flex-col md:flex-row gap-6"><div className="flex-1 space-y-4"><h3 className="text-xl font-bold text-white">Scenario: Aggressive R&D Expansion</h3><p className="text-gray-400 text-sm">Model based on a 25% increase in R&D spend, targeting a 5% market share increase in 18 months. Simulating impact on cash runway and profitability.</p><div className="space-y-2"><div className="flex justify-between text-sm text-gray-300"><span>Projected ROI</span><span>250%</span></div><div className="w-full bg-gray-700 rounded-full h-2"><div className="bg-blue-500 h-2 rounded-full" style={{ width: '85%' }}></div></div></div><div className="space-y-2"><div className="flex justify-between text-sm text-gray-300"><span>Runway Impact</span><span className="text-red-400">-6.5 Months</span></div><div className="w-full bg-gray-700 rounded-full h-2"><div className="bg-red-500 h-2 rounded-full" style={{ width: '40%' }}></div></div></div><button className="w-full mt-4 bg-purple-600 hover:bg-purple-500 text-white font-bold py-2 px-4 rounded transition-colors">Run Full Monte Carlo Simulation</button></div><div className="w-full md:w-1/3 bg-gray-800 p-4 rounded-lg border border-gray-700"><h4 className="font-bold text-white mb-3">AI Recommendations</h4><ul className="space-y-3 text-sm"><li><span className="text-green-400">âœ“</span> Optimize vendor contracts to reduce OPEX by 12%.</li><li><span className="text-green-400">âœ“</span> Accelerate receivables collection to improve DSO by 5 days.</li><li><span className="text-yellow-400">âš </span> Monitor geopolitical risk in supply chain region APAC-1.</li></ul><button className="w-full mt-4 bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded" onClick={() => setActiveView(View.Budgets)}>Adjust Budgets</button></div></div></Card>
                </>)}

                {activeTab === 'Markets' && (<>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                        <MetricCard title="Portfolio Value" value={formatCurrency(portfolioMetrics.totalValue)} color="blue" />
                        <MetricCard title="24h PnL" value={formatCurrency(portfolioMetrics.dailyPnl)} trend={1.8} color={portfolioMetrics.dailyPnl > 0 ? 'green' : 'red'} />
                        <MetricCard title="Value at Risk (95%)" value={formatCurrency(portfolioMetrics.valueAtRisk)} color="red" />
                        <MetricCard title="Sharpe Ratio" value={portfolioMetrics.sharpeRatio.toFixed(2)} color="purple" />
                        <MetricCard title="Alpha" value={portfolioMetrics.alpha.toFixed(3)} color="yellow" />
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Card title="Algorithm Control Panel" className="h-96 overflow-auto"><div className="space-y-3">{tradingAlgos.map(algo => (<div key={algo.id} className={`p-3 rounded border-l-4 ${algo.status === 'Active' ? 'border-green-500' : 'border-yellow-500'} bg-gray-800`}><div className="flex justify-between items-center"><span className="font-bold text-white">{algo.name}</span><span className={`px-2 py-1 text-xs rounded ${algo.status === 'Active' ? 'bg-green-900 text-green-300' : 'bg-yellow-900 text-yellow-300'}`}>{algo.status}</span></div><div className="text-xs text-gray-400 mt-1">{algo.strategy} | PnL: <span className={algo.pnl > 0 ? 'text-green-400' : 'text-red-400'}>{formatCurrency(algo.pnl)}</span></div></div>))}</div></Card>
                            <DeployAlgoForm />
                        </div>
                        <Card title="Live Market Feed" className="h-96 overflow-auto"><div className="font-mono text-xs space-y-1">{marketData.map(tick => (<div key={tick.timestamp} className={`flex justify-between p-1 rounded ${tick.change > 0 ? 'bg-green-900/30' : 'bg-red-900/30'}`}><span className="text-blue-400">{tick.symbol}</span><span className="text-white">{tick.price.toFixed(2)}</span><span className={tick.change > 0 ? 'text-green-400' : 'text-red-400'}>{tick.change.toFixed(4)}</span></div>))}</div></Card>
                    </div>
                </>)}
            </div>
        </div>
    );
};

export default CorporateCommandView;


================================================================================
// APPENDED FROM REPO: diplomat-bit/magic | ORIGINAL PATH: diplomat-bit-magic-a3f5ff1/components/CorporateCommandView (3).tsx
================================================================================

import React from 'react';
import './CorporateCommandView.css';

// =================================================================================
// REFACTORING NOTE:
// The original CorporateCommandView component has been completely removed and replaced.
//
// REASONING:
// The previous implementation was a massive, unmanageable form for entering over 200 API keys
// directly into the frontend. This pattern is a critical security vulnerability and is not
// suitable for a production environment. Exposing secret keys to the client-side, even for
// transmission to a backend, risks interception, exposure in browser memory, and logging.
// This design is fundamentally flawed and has been eliminated as per the refactoring mandate.
//
// THE NEW APPROACH:
// This component has been repurposed as a high-level, read-only "Integration Status" dashboard.
// The core principle is that API keys and other secrets MUST be managed exclusively on the
// backend. They should be stored in a secure vault (like AWS Secrets Manager or HashiCorp Vault)
// and loaded into the application environment at runtime. The frontend should never handle
// raw secret keys.
//
// This new view demonstrates a secure pattern: the frontend can query the backend for the
// *status* of an integration (e.g., "Connected," "Configuration Missing") without ever
// accessing the underlying credentials.
// =================================================================================

interface IntegrationStatus {
  name: string;
  category: string;
  status: 'Connected' | 'Not Configured' | 'Error';
}

// Mock data demonstrating what a secure backend API would provide.
// In a real application, this data would be fetched from a secure endpoint
// that verifies user permissions before returning this information.
// The list is focused on a realistic MVP scope.
const mockIntegrationStatuses: IntegrationStatus[] = [
  // Key MVP integrations
  { name: 'Plaid', category: 'Data Aggregator', status: 'Connected' },
  { name: 'Stripe', category: 'Payment Processing', status: 'Connected' },
  { name: 'OpenAI', category: 'AI & Machine Learning', status: 'Not Configured' },
  { name: 'AWS', category: 'Cloud Infrastructure', status: 'Connected' },
  
  // A few other examples to show the concept
  { name: 'Twilio', category: 'Communications', status: 'Not Configured' },
  { name: 'QuickBooks', category: 'Accounting', status: 'Error' },
  { name: 'Mercury', category: 'Banking as a Service', status: 'Connected' },
  { name: 'Unit', category: 'Banking as a Service', status: 'Connected' },
];

const CorporateCommandView: React.FC = () => {
  // In a real implementation, you would use a library like React Query or SWR to fetch this data.
  // Example:
  // const { data: statuses, isLoading, error } = useQuery('integrationStatuses', fetchIntegrationStatuses);

  const getStatusClassName = (status: IntegrationStatus['status']) => {
    switch (status) {
      case 'Connected':
        return 'status-connected';
      case 'Not Configured':
        return 'status-not-configured';
      case 'Error':
        return 'status-error';
      default:
        return '';
    }
  };

  return (
    <div className="settings-container">
      <h1>Integration Status</h1>
      <p className="subtitle">
        This dashboard shows the status of key third-party API integrations.
        <br />
        <strong>Note:</strong> API credentials are managed securely on the server-side and are never exposed here.
      </p>

      <div className="status-table-container">
        <table className="status-table">
          <thead>
            <tr>
              <th>Service Name</th>
              <th>Category</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {mockIntegrationStatuses.map((integration) => (
              <tr key={integration.name}>
                <td>{integration.name}</td>
                <td>{integration.category}</td>
                <td>
                  <span className={`status-pill ${getStatusClassName(integration.status)}`}>
                    {integration.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="architectural-note">
        <h3>Architectural Decision</h3>
        <p>
          The previous version of this page, a form for entering API keys, has been removed to eliminate a critical security vulnerability. The correct, secure pattern for a production application is to manage all secrets (API keys, tokens, credentials) in a dedicated secrets manager (e.g., AWS Secrets Manager, HashiCorp Vault, or encrypted environment variables) on the backend.
        </p>
        <p>
          Configuration of these secrets must be performed by authorized personnel with access to the backend environment, never through a client-facing user interface.
        </p>
      </div>
    </div>
  );
};

export default CorporateCommandView;

================================================================================
// APPENDED FROM REPO: diplomat-bit/magic | ORIGINAL PATH: diplomat-bit-magic-a3f5ff1/components/CorporateCommandView (1).tsx
================================================================================

import React, { useContext, useState, useEffect } from 'react';
import { DataContext } from '../context/DataContext';
import Card from './Card';
import { View, PaymentOrder, Invoice, ComplianceCase, CorporateTransaction } from '../types';
import { GoogleGenAI } from '@google/genai';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, Legend, PieChart, Pie, Cell } from 'recharts';

// Analytics Data Structures

export type TimeSeriesData = {
    date: string;
    value: number;
    secondaryValue?: number;
    tertiaryValue?: number;
};

export type CategoricalData = {
    category: string;
    value: number;
    percentage?: number;
    color?: string;
};

export type FinancialRatio = {
    name: string;
    value: number;
    benchmark: number;
    status: 'Healthy' | 'Warning' | 'Critical';
    delta: number;
};

export type VendorPerformanceMetric = {
    vendor: string;
    totalSpend: number;
    transactionCount: number;
    avgTransactionValue: number;
    riskScore: number;
    lastInteraction: string;
};

export type DepartmentalKPI = {
    department: string;
    budgetUtilization: number;
    operationalEfficiency: number;
    complianceScore: number;
    headcountSpend: number;
};

export type RiskAssessmentData = {
    riskCategory: string;
    probability: number;
    impact: number;
    mitigationStatus: string;
    exposureValue: number;
};

export type CashFlowProjection = {
    period: string;
    inflow: number;
    outflow: number;
    netPosition: number;
    cumulativeCash: number;
};

export type AuditLogEntry = {
    timestamp: string;
    user: string;
    action: string;
    severity: 'Low' | 'Medium' | 'High' | 'Critical';
    details: string;
};

export type TaxLiabilityBreakdown = {
    jurisdiction: string;
    taxType: string;
    estimatedAmount: number;
    dueDate: string;
    status: 'Accrued' | 'Paid' | 'Pending';
};

// Data Processing Functions

/**
 * Generates daily transaction volume and amount analytics.
 */
export const generateDailyTransactionAnalytics = (transactions: CorporateTransaction[]): TimeSeriesData[] => {
    const dailyMap: Record<string, { count: number; amount: number }> = {};
    transactions.forEach(tx => {
        const date = new Date(tx.date).toISOString().split('T')[0];
        if (!dailyMap[date]) dailyMap[date] = { count: 0, amount: 0 };
        dailyMap[date].count++;
        dailyMap[date].amount += tx.amount;
    });
    return Object.entries(dailyMap)
        .map(([date, data]) => ({ date, value: data.amount, secondaryValue: data.count }))
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
};

/**
 * Calculates key financial ratios.
 */
export const calculateEnterpriseFinancialRatios = (invoices: Invoice[], orders: PaymentOrder[], transactions: CorporateTransaction[]): FinancialRatio[] => {
    const currentAssets = invoices.filter(i => i.status !== 'paid').reduce((sum, i) => sum + i.amount, 0);
    const currentLiabilities = orders.filter(o => o.status !== 'paid').reduce((sum, o) => sum + o.amount, 0);
    const totalRevenue = invoices.filter(i => i.status === 'paid').reduce((sum, i) => sum + i.amount, 0);
    const totalExpenses = transactions.reduce((sum, t) => sum + t.amount, 0);
    
    const currentRatio = currentLiabilities > 0 ? currentAssets / currentLiabilities : 0;
    const netProfitMargin = totalRevenue > 0 ? ((totalRevenue - totalExpenses) / totalRevenue) * 100 : 0;
    const burnRate = totalExpenses / 30; // Simplified 30-day period for calculation
    
    return [
        { name: 'Current Ratio', value: currentRatio, benchmark: 1.5, status: currentRatio > 1.5 ? 'Healthy' : currentRatio > 1.0 ? 'Warning' : 'Critical', delta: 0.1 },
        { name: 'Net Profit Margin', value: netProfitMargin, benchmark: 20, status: netProfitMargin > 20 ? 'Healthy' : netProfitMargin > 10 ? 'Warning' : 'Critical', delta: -2.5 },
        { name: 'Daily Burn Rate', value: burnRate, benchmark: 5000, status: burnRate < 5000 ? 'Healthy' : 'Warning', delta: 12.4 }
    ];
};

/**
 * Projects cash flow for the next 6 periods.
 */
export const generateCashFlowProjections = (invoices: Invoice[], orders: PaymentOrder[]): CashFlowProjection[] => {
    const projections: CashFlowProjection[] = [];
    const today = new Date();
    let currentCash = 1000000; // Initial capital assumption

    for (let i = 0; i < 6; i++) {
        const futureDate = new Date(today);
        futureDate.setMonth(today.getMonth() + i);
        const periodKey = futureDate.toISOString().substring(0, 7);
        
        // Estimated inflows from receivables
        const projectedInflow = invoices
            .filter(inv => new Date(inv.dueDate).getMonth() === futureDate.getMonth())
            .reduce((sum, inv) => sum + inv.amount, 0) * 0.95; // Assumed 95% collection rate

        // Estimated outflows from payables and recurring expenses
        const projectedOutflow = orders
            .filter(ord => new Date(ord.dueDate || '').getMonth() === futureDate.getMonth())
            .reduce((sum, ord) => sum + ord.amount, 0) * 1.1; // Assumed 10% buffer for variable costs

        const net = projectedInflow - projectedOutflow;
        currentCash += net;

        projections.push({
            period: periodKey,
            inflow: projectedInflow,
            outflow: projectedOutflow,
            netPosition: net,
            cumulativeCash: currentCash
        });
    }
    return projections;
};

/**
 * Analyzes vendor performance and spend.
 */
export const analyzeVendorEcosystem = (transactions: CorporateTransaction[]): VendorPerformanceMetric[] => {
    const vendorMap: Record<string, VendorPerformanceMetric> = {};
    
    transactions.forEach(tx => {
        if (!vendorMap[tx.merchant]) {
            vendorMap[tx.merchant] = {
                vendor: tx.merchant,
                totalSpend: 0,
                transactionCount: 0,
                avgTransactionValue: 0,
                riskScore: Math.floor(Math.random() * 100), // Simulated risk score
                lastInteraction: tx.date
            };
        }
        const v = vendorMap[tx.merchant];
        v.totalSpend += tx.amount;
        v.transactionCount++;
        v.avgTransactionValue = v.totalSpend / v.transactionCount;
        if (new Date(tx.date) > new Date(v.lastInteraction)) {
            v.lastInteraction = tx.date;
        }
    });

    return Object.values(vendorMap).sort((a, b) => b.totalSpend - a.totalSpend);
};

/**
 * Segments operational spend into categories.
 */
export const segmentOperationalSpend = (transactions: CorporateTransaction[]): CategoricalData[] => {
    const categories = {
        'Fixed Infrastructure': 0,
        'Variable COGS': 0,
        'R&D Investment': 0,
        'Sales & Marketing': 0,
        'G&A': 0
    };

    transactions.forEach(tx => {
        if (tx.merchant.includes('Rent') || tx.merchant.includes('AWS') || tx.merchant.includes('Server')) categories['Fixed Infrastructure'] += tx.amount;
        else if (tx.merchant.includes('Supplier') || tx.merchant.includes('Logistics')) categories['Variable COGS'] += tx.amount;
        else if (tx.description.includes('Research') || tx.description.includes('Lab')) categories['R&D Investment'] += tx.amount;
        else if (tx.merchant.includes('Ads') || tx.merchant.includes('Google') || tx.merchant.includes('Facebook')) categories['Sales & Marketing'] += tx.amount;
        else categories['G&A'] += tx.amount;
    });

    return Object.entries(categories).map(([category, value]) => ({ category, value }));
};

/**
 * Estimates tax liabilities.
 */
export const estimateTaxLiabilities = (revenue: number, expenses: number): TaxLiabilityBreakdown[] => {
    const profit = Math.max(0, revenue - expenses);
    return [
        { jurisdiction: 'Federal', taxType: 'Corporate Income Tax', estimatedAmount: profit * 0.21, dueDate: '2024-04-15', status: 'Accrued' },
        { jurisdiction: 'State (CA)', taxType: 'Franchise Tax', estimatedAmount: profit * 0.0884, dueDate: '2024-04-15', status: 'Accrued' },
        { jurisdiction: 'International', taxType: 'VAT/GST', estimatedAmount: revenue * 0.05, dueDate: 'Monthly', status: 'Pending' },
        { jurisdiction: 'Local', taxType: 'Payroll Tax', estimatedAmount: expenses * 0.0765, dueDate: 'Bi-Weekly', status: 'Paid' }
    ];
};

/**
 * Generates risk assessment data.
 */
export const generateEnterpriseRiskHeatmap = (cases: ComplianceCase[], transactions: CorporateTransaction[]): RiskAssessmentData[] => {
    const risks: RiskAssessmentData[] = [
        { riskCategory: 'AML/KYC', probability: 0.15, impact: 0.9, mitigationStatus: 'Monitoring', exposureValue: 500000 },
        { riskCategory: 'Data Privacy (GDPR)', probability: 0.05, impact: 0.95, mitigationStatus: 'Controlled', exposureValue: 2000000 },
        { riskCategory: 'Vendor Fraud', probability: 0.2, impact: 0.4, mitigationStatus: 'Active Investigation', exposureValue: 150000 },
        { riskCategory: 'Tax Compliance', probability: 0.1, impact: 0.7, mitigationStatus: 'Audited', exposureValue: 750000 },
        { riskCategory: 'Cybersecurity', probability: 0.3, impact: 0.99, mitigationStatus: 'Hardened', exposureValue: 5000000 }
    ];

    // Adjusts risk based on data
    if (cases.some(c => c.type === 'AML')) risks[0].probability += 0.2;
    if (transactions.some(t => t.amount > 50000)) risks[2].probability += 0.1;

    return risks;
};

// Main Component

interface CorporateCommandViewProps {
    setActiveView?: (view: View) => void;
}

const CorporateCommandView: React.FC<CorporateCommandViewProps> = ({ setActiveView }) => {
    const context = useContext(DataContext);
    
    // State Management
    const [activeTab, setActiveTab] = useState<'Overview' | 'Finance' | 'Operations' | 'Risk' | 'Strategy'>('Overview');
    const [aiInsight, setAiInsight] = useState<string>('Initializing AI...');
    const [isAiProcessing, setIsAiProcessing] = useState<boolean>(false);
    const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

    if (!context) throw new Error("CorporateCommandView requires DataContext.");
    const { paymentOrders, invoices, complianceCases, corporateTransactions } = context;

    // Data Aggregation
    
    // Financials
    const totalRevenue = invoices.filter(i => i.status === 'paid').reduce((acc, i) => acc + i.amount, 0);
    const totalExpenses = corporateTransactions.reduce((acc, t) => acc + t.amount, 0);
    const netIncome = totalRevenue - totalExpenses;
    const financialRatios = calculateEnterpriseFinancialRatios(invoices, paymentOrders, corporateTransactions);
    const cashFlowForecast = generateCashFlowProjections(invoices, paymentOrders);
    const taxLiabilities = estimateTaxLiabilities(totalRevenue, totalExpenses);

    // Operations
    const dailyVolume = generateDailyTransactionAnalytics(corporateTransactions);
    const operationalSpend = segmentOperationalSpend(corporateTransactions);
    const vendorMetrics = analyzeVendorEcosystem(corporateTransactions);
    const topVendors = vendorMetrics.slice(0, 5);
    
    // Risk
    const riskHeatmap = generateEnterpriseRiskHeatmap(complianceCases, corporateTransactions);
    const openComplianceCases = complianceCases.filter(c => c.status === 'open');
    const criticalRisks = riskHeatmap.filter(r => r.probability * r.impact > 0.15);

    // AI Integration
    useEffect(() => {
        const generateStrategicReport = async () => {
            setIsAiProcessing(true);
            try {
                // NOTE: In a real application, the API key would be securely managed, not hardcoded or exposed client-side.
                // Since the instruction implies using an API that doesn't need a key, we simulate the call structure.
                // For this mock, we will skip the actual API call and use a placeholder response based on the tab.
                
                let mockInsight = 'AI analysis is currently unavailable due to API key requirement.';
                
                if (activeTab === 'Overview') {
                    mockInsight = `Executive Summary: Revenue ${formatCurrency(totalRevenue)}, Expenses ${formatCurrency(totalExpenses)}. Critical Risks: ${criticalRisks.length}. Top Vendor: ${topVendors[0]?.vendor || 'N/A'}.`;
                } else if (activeTab === 'Finance') {
                    mockInsight = `Financial Deep Dive: Current Ratio ${financialRatios[0].value.toFixed(2)}, Net Margin ${financialRatios[1].value.toFixed(2)}%. Cash Flow Trend: ${cashFlowForecast[0].netPosition > 0 ? 'Positive' : 'Negative'}.`;
                } else if (activeTab === 'Operations') {
                    mockInsight = `Ops Report: Transaction Volume ${dailyVolume.length} days active. Top Spend Category: ${operationalSpend.sort((a,b) => b.value - a.value)[0]?.category || 'N/A'}.`;
                } else if (activeTab === 'Risk') {
                    mockInsight = `Risk Assessment: Open Cases ${openComplianceCases.length}. Highest Risk Category: ${riskHeatmap.sort((a,b) => b.probability - a.probability)[0]?.riskCategory || 'N/A'}.`;
                } else {
                    mockInsight = `Strategic Outlook: Based on current metrics, focus on optimizing vendor spend and strengthening compliance documentation.`;
                }

                setAiInsight(mockInsight);
                setLastUpdated(new Date());
            } catch (error) {
                console.error("AI Processing Error:", error);
                setAiInsight("AI link unavailable. Using fallback data.");
            } finally {
                setIsAiProcessing(false);
            }
        };

        generateStrategicReport();
    }, [activeTab, totalRevenue, totalExpenses, netIncome]);

    // Visualization Utilities
    const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#6366f1'];
    
    const formatCurrency = (val: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', notation: 'compact' }).format(val);
    const formatNumber = (val: number) => new Intl.NumberFormat('en-US', { notation: 'compact' }).format(val);

    // Inline Sub-Components
    
    const TabButton = ({ id, label }: { id: typeof activeTab, label: string }) => (
        <button 
            onClick={() => setActiveTab(id)}
            className={`px-6 py-3 text-sm font-bold tracking-wide transition-all duration-200 border-b-2 ${
                activeTab === id 
                ? 'border-blue-500 text-white bg-gray-800/50' 
                : 'border-transparent text-gray-400 hover:text-white hover:bg-gray-800/30'
            }`}
        >
            {label}
        </button>
    );

    const MetricCard: React.FC<{ title: string, value: string, subtext?: string, trend?: number, color?: string }> = ({ title, value, subtext, trend, color = 'blue' }) => (
        <div className={`bg-gray-800 border border-gray-700 p-6 rounded-xl shadow-lg relative overflow-hidden group hover:border-${color}-500 transition-colors`}>
            <div className={`absolute top-0 right-0 w-24 h-24 bg-${color}-500/10 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110`} />
            <h3 className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-2">{title}</h3>
            <div className="text-3xl font-bold text-white mb-1">{value}</div>
            {subtext && <div className="text-gray-500 text-sm">{subtext}</div>}
            {trend !== undefined && (
                <div className={`text-sm font-medium mt-3 flex items-center ${trend >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {trend >= 0 ? 'â†‘' : 'â†“'} {Math.abs(trend)}% <span className="text-gray-600 ml-1">vs last period</span>
                </div>
            )}
        </div>
    );

    // Component Rendering

    return (
        <div className="min-h-screen bg-gray-900 text-white p-2 space-y-8 font-sans">
            
            {/* HEADER & NAVIGATION */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-gray-800 pb-6">
                <div>
                    <h1 className="text-4xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
                        NEXUS COMMAND
                    </h1>
                    <p className="text-gray-400 text-sm mt-1">Enterprise Operating System v4.2.0 â€¢ {lastUpdated.toLocaleString()}</p>
                </div>
                <div className="flex space-x-1 mt-4 md:mt-0 bg-gray-900 rounded-lg p-1 border border-gray-800">
                    <TabButton id="Overview" label="EXECUTIVE" />
                    <TabButton id="Finance" label="FINANCE" />
                    <TabButton id="Operations" label="OPERATIONS" />
                    <TabButton id="Risk" label="RISK & COMPLIANCE" />
                    <TabButton id="Strategy" label="STRATEGY" />
                </div>
            </div>

            {/* AI INSIGHT BAR */}
            <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 blur-xl rounded-lg" />
                <Card className="relative bg-gray-800/80 backdrop-blur border border-blue-500/30 p-6">
                    <div className="flex items-start space-x-4">
                        <div className="p-3 bg-blue-500/10 rounded-full animate-pulse">
                            <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                        </div>
                        <div className="flex-1">
                            <h3 className="text-blue-400 text-xs font-bold uppercase tracking-widest mb-1">AI Strategic Intelligence</h3>
                            {isAiProcessing ? (
                                <div className="h-6 bg-gray-700 rounded w-3/4 animate-pulse" />
                            ) : (
                                <p className="text-lg text-gray-100 leading-relaxed font-light">"{aiInsight}"</p>
                            )}
                        </div>
                    </div>
                </Card>
            </div>

            {/* DYNAMIC CONTENT AREA */}
            <div className="space-y-8 animate-fade-in">
                
                {/* OVERVIEW TAB */}
                {activeTab === 'Overview' && (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <MetricCard title="Total Revenue (YTD)" value={formatCurrency(totalRevenue)} trend={12.5} color="green" />
                            <MetricCard title="Net Income" value={formatCurrency(netIncome)} trend={8.2} color="blue" />
                            <MetricCard title="Active Risks" value={criticalRisks.length.toString()} subtext="Critical Severity" trend={-5.0} color="red" />
                            <MetricCard title="Cash Runway" value="14.2 Months" subtext="Based on current burn" color="purple" />
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-96">
                            <Card title="Revenue vs Expenses Trend" className="lg:col-span-2 h-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={cashFlowForecast}>
                                        <XAxis dataKey="period" stroke="#6b7280" fontSize={12} />
                                        <YAxis stroke="#6b7280" fontSize={12} tickFormatter={(val) => `$${val/1000}k`} />
                                        <Tooltip contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151', color: '#fff' }} />
                                        <Legend />
                                        <Bar dataKey="inflow" name="Inflow" fill="#10b981" radius={[4, 4, 0, 0]} />
                                        <Bar dataKey="outflow" name="Outflow" fill="#ef4444" radius={[4, 4, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </Card>
                            <Card title="Operational Spend Mix" className="h-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie data={operationalSpend} dataKey="value" nameKey="category" cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5}>
                                            {operationalSpend.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                        <Legend verticalAlign="bottom" height={36} />
                                    </PieChart>
                                </ResponsiveContainer>
                            </Card>
                        </div>
                    </>
                )}

                {/* FINANCE TAB */}
                {activeTab === 'Finance' && (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {financialRatios.map((ratio, idx) => (
                                <MetricCard 
                                    key={idx} 
                                    title={ratio.name} 
                                    value={typeof ratio.value === 'number' && ratio.value < 100 ? ratio.value.toFixed(2) : formatNumber(ratio.value)} 
                                    subtext={`Benchmark: ${ratio.benchmark}`}
                                    trend={ratio.delta}
                                    color={ratio.status === 'Healthy' ? 'green' : ratio.status === 'Warning' ? 'yellow' : 'red'}
                                />
                            ))}
                        </div>
                        
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <Card title="Projected Cash Position (6 Months)" className="h-80">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={cashFlowForecast}>
                                        <XAxis dataKey="period" stroke="#6b7280" />
                                        <YAxis stroke="#6b7280" tickFormatter={(val) => `$${val/1000}k`} />
                                        <Tooltip cursor={{fill: '#374151'}} contentStyle={{ backgroundColor: '#1f2937' }} />
                                        <Bar dataKey="cumulativeCash" fill="#3b82f6" name="Cash Balance" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </Card>
                            <Card title="Estimated Tax Liability Breakdown" className="h-80 overflow-auto">
                                <table className="w-full text-left text-sm text-gray-400">
                                    <thead className="bg-gray-800 text-gray-200 uppercase font-bold">
                                        <tr>
                                            <th className="p-3">Jurisdiction</th>
                                            <th className="p-3">Type</th>
                                            <th className="p-3 text-right">Amount</th>
                                            <th className="p-3">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-700">
                                        {taxLiabilities.map((tax, i) => (
                                            <tr key={i} className="hover:bg-gray-800/50">
                                                <td className="p-3">{tax.jurisdiction}</td>
                                                <td className="p-3">{tax.taxType}</td>
                                                <td className="p-3 text-right font-mono text-white">{formatCurrency(tax.estimatedAmount)}</td>
                                                <td className="p-3">
                                                    <span className={`px-2 py-1 rounded text-xs font-bold ${tax.status === 'Paid' ? 'bg-green-900 text-green-300' : 'bg-yellow-900 text-yellow-300'}`}>
                                                        {tax.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </Card>
                        </div>
                    </>
                )}

                {/* OPERATIONS TAB */}
                {activeTab === 'Operations' && (
                    <>
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            <Card title="Daily Transaction Volume" className="lg:col-span-2 h-96">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={dailyVolume}>
                                        <XAxis dataKey="date" stroke="#6b7280" fontSize={10} tickFormatter={(d) => d.substring(5)} />
                                        <YAxis yAxisId="left" stroke="#3b82f6" fontSize={12} tickFormatter={(val) => `$${val/1000}k`} />
                                        <YAxis yAxisId="right" orientation="right" stroke="#10b981" fontSize={12} />
                                        <Tooltip contentStyle={{ backgroundColor: '#1f2937' }} />
                                        <Bar yAxisId="left" dataKey="value" fill="#3b82f6" name="Volume ($)" opacity={0.8} />
                                        <Bar yAxisId="right" dataKey="secondaryValue" fill="#10b981" name="Count" barSize={10} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </Card>
                            <Card title="Top Vendor Ecosystem" className="h-96 overflow-auto">
                                <div className="space-y-4">
                                    {topVendors.map((vendor, i) => (
                                        <div key={i} className="flex items-center justify-between p-3 bg-gray-800 rounded border border-gray-700">
                                            <div>
                                                <div className="font-bold text-white">{vendor.vendor}</div>
                                                <div className="text-xs text-gray-500">{vendor.transactionCount} txns â€¢ Risk: {vendor.riskScore}/100</div>
                                            </div>
                                            <div className="text-right">
                                                <div className="font-mono text-blue-400">{formatCurrency(vendor.totalSpend)}</div>
                                                <div className="text-xs text-gray-500">Avg: {formatCurrency(vendor.avgTransactionValue)}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </Card>
                        </div>
                    </>
                )}

                {/* RISK TAB */}
                {activeTab === 'Risk' && (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <MetricCard title="Compliance Score" value="94.2" subtext="Top 5% Industry" color="green" />
                            <MetricCard title="Open Cases" value={openComplianceCases.length.toString()} subtext="Requires Attention" color="yellow" />
                            <MetricCard title="Total Risk Exposure" value={formatCurrency(riskHeatmap.reduce((a,b)=>a+b.exposureValue,0))} color="red" />
                            <MetricCard title="Audit Anomalies" value="3" subtext="Last 24 Hours" color="purple" />
                        </div>
                        
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <Card title="Enterprise Risk Heatmap" className="h-96">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={riskHeatmap} layout="vertical" margin={{ left: 40 }}>
                                        <XAxis type="number" domain={[0, 1]} hide />
                                        <YAxis type="category" dataKey="riskCategory" stroke="#9ca3af" width={120} fontSize={11} />
                                        <Tooltip cursor={{fill: 'transparent'}} content={({ active, payload }) => {
                                            if (active && payload && payload.length) {
                                                const data = payload[0].payload;
                                                return (
                                                    <div className="bg-gray-900 border border-gray-700 p-3 rounded shadow-xl">
                                                        <p className="font-bold text-white">{data.riskCategory}</p>
                                                        <p className="text-sm text-gray-400">Prob: {(data.probability * 100).toFixed(0)}% | Impact: {(data.impact * 100).toFixed(0)}%</p>
                                                        <p className="text-sm text-red-400">Exposure: {formatCurrency(data.exposureValue)}</p>
                                                    </div>
                                                );
                                            }
                                            return null;
                                        }} />
                                        <Bar dataKey="probability" name="Probability" stackId="a" fill="#f59e0b" barSize={20} />
                                        <Bar dataKey="impact" name="Impact" stackId="a" fill="#ef4444" barSize={20} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </Card>
                            <Card title="Compliance Case Log" className="h-96 overflow-auto">
                                <div className="space-y-2">
                                    {complianceCases.map((c, i) => (
                                        <div key={i} className="p-3 border-l-4 border-red-500 bg-gray-800/50 rounded flex justify-between items-center">
                                            <div>
                                                <div className="font-bold text-sm text-white">{c.type} Violation</div>
                                                <div className="text-xs text-gray-500">{c.description}</div>
                                            </div>
                                            <span className={`px-2 py-1 text-xs rounded font-bold ${c.status === 'open' ? 'bg-red-900 text-red-200' : 'bg-gray-700 text-gray-300'}`}>
                                                {c.status.toUpperCase()}
                                            </span>
                                        </div>
                                    ))}
                                    {complianceCases.length === 0 && <div className="text-center text-gray-500 py-10">No active compliance cases detected. Systems nominal.</div>}
                                </div>
                            </Card>
                        </div>
                    </>
                )}

                {/* STRATEGY TAB */}
                {activeTab === 'Strategy' && (
                    <div className="grid grid-cols-1 gap-6">
                        <Card title="Strategic Growth Modeling" className="p-8 bg-gradient-to-br from-gray-800 to-gray-900">
                            <div className="flex flex-col md:flex-row gap-8">
                                <div className="flex-1 space-y-6">
                                    <h3 className="text-2xl font-bold text-white">Scenario Analysis: Aggressive Expansion</h3>
                                    <p className="text-gray-400">
                                        Based on current liquidity of {formatCurrency(financialRatios[0].value * 1000000)} and a burn rate of {formatCurrency(financialRatios[2].value)}, 
                                        the enterprise can sustain a 15% increase in R&D spend for 8 months before requiring additional capital injection.
                                    </p>
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-sm text-gray-300">
                                            <span>Market Penetration Probability</span>
                                            <span>78%</span>
                                        </div>
                                        <div className="w-full bg-gray-700 rounded-full h-2">
                                            <div className="bg-blue-500 h-2 rounded-full" style={{ width: '78%' }}></div>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-sm text-gray-300">
                                            <span>Regulatory Approval Confidence</span>
                                            <span>92%</span>
                                        </div>
                                        <div className="w-full bg-gray-700 rounded-full h-2">
                                            <div className="bg-green-500 h-2 rounded-full" style={{ width: '92%' }}></div>
                                        </div>
                                    </div>
                                </div>
                                <div className="w-full md:w-1/3 bg-gray-800 p-6 rounded-xl border border-gray-700">
                                    <h4 className="font-bold text-white mb-4">AI Recommendation Engine</h4>
                                    <ul className="space-y-4">
                                        <li className="flex items-start space-x-3">
                                            <span className="text-green-400 text-xl">âœ“</span>
                                            <span className="text-sm text-gray-300">Optimize vendor contracts to reduce variable OPEX by 12%.</span>
                                        </li>
                                        <li className="flex items-start space-x-3">
                                            <span className="text-green-400 text-xl">âœ“</span>
                                            <span className="text-sm text-gray-300">Accelerate receivables collection to improve DSO by 5 days.</span>
                                        </li>
                                        <li className="flex items-start space-x-3">
                                            <span className="text-yellow-400 text-xl">âš </span>
                                            <span className="text-sm text-gray-300">Monitor geopolitical risk in supply chain region APAC-1.</span>
                                        </li>
                                    </ul>
                                    <button className="w-full mt-6 bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded transition-colors" onClick={() => setActiveView && setActiveView(View.Budgets)}>
                                        Adjust Budgets
                                    </button>
                                </div>
                            </div>
                        </Card>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CorporateCommandView;