// REPOSITORY SOURCE: diplomat-bit/aibanking.dev-demai-jocalll3 | PATH: diplomat-bit-aibanking.dev-demai-jocalll3-f8b6983/components/SendMoneyView.tsx
================================================================================

// components/views/personal/SendMoneyView.tsx
// RE-ENACTED & EXPANDED: This component has been resurrected from its deprecated state.
// It is now "Remitrax," a complete, multi-rail payment portal featuring advanced
// security simulations and demonstrating enterprise-level integration patterns.
// After a decade of upgrades, Remitrax is an unparalleled financial ecosystem.

import React, { useState, useContext, useRef, useEffect, useCallback } from 'react';
import Card from './Card';
import { DataContext } from '../context/DataContext';
import { View } from '../types';
import type { Transaction } from '../types';

// ================================================================================================
// GLOBAL REMITRAX PLATFORM WIDE TYPE DEFINITIONS
// Over a decade, Remitrax has become the central nervous system for financial transactions.
// These types reflect the highly advanced, multi-dimensional nature of its operations.
// ================================================================================================

export type PaymentRail = 'quantumpay' | 'cashapp' | 'swift_global' | 'blockchain_dlt' | 'interstellar_p2p' | 'neuro_link' | 'ai_contract_escrow';
export type ScanState = 'scanning' | 'success' | 'verifying' | 'error' | 'recalibrating' | 'quantum_sync';

export interface RemitraxRecipientProfile {
  id: string;
  name: string;
  avatarUrl?: string;
  quantumTag?: string;
  cashtag?: string;
  swiftDetails?: { bankName: string; bic: string; accountNumber: string; };
  blockchainAddress?: string; // For DLT rail
  neuroLinkAddress?: string; // For Neuro-Link rail
  galacticP2PId?: string; // For Interstellar P2P
  preferredCurrency?: string;
  lastUsedDate?: string;
  trustScore?: number; // AI-driven trust assessment
  kycStatus?: 'verified' | 'pending' | 'unverified';
  blacklisted?: boolean;
}

export interface RemitraxCurrency {
  code: string; // e.g., 'USD', 'EUR', 'BTC', 'QNT' (QuantumCoin)
  name: string;
  symbol: string;
  isCrypto: boolean;
  conversionRate?: number; // Relative to a base, fetched live
  quantumFluctuationIndex?: number; // For advanced quantum currencies
}

export interface ScheduledPaymentRule {
  frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'annually' | 'once_on_date' | 'conditional_event';
  startDate: string;
  endDate?: string; // For recurring payments
  executionCondition?: string; // e.g., 'if_balance_above_X', 'on_market_event_Y'
  nextExecutionDate?: string;
  maxExecutions?: number;
  triggerEventId?: string; // For AI-contract escrow
}

export interface AdvancedTransactionSettings {
  priority: 'low' | 'normal' | 'high' | 'ultra_quantum'; // Affects fees & speed
  carbonOffsetRatio: number; // User-defined offset percentage
  privacyLevel: 'standard' | 'enhanced' | 'fully_anonymous_dlt';
  receiptPreference: 'email' | 'blockchain_proof' | 'neuronal_link_receipt';
  notificationPreferences: { email: boolean; sms: boolean; push: boolean; holo_alert: boolean; };
  multiSignatureRequired?: boolean; // For corporate accounts
  escrowDetails?: { agentId: string; releaseCondition: string; };
  dynamicFeeOptimization?: 'auto' | 'manual';
}

export interface SecurityAuditResult {
  riskScore: number; // 0-100, higher is riskier
  fraudProbability: number; // 0-1, AI-driven
  amlCompliance: 'pass' | 'fail' | 'review';
  sanctionScreening: 'pass' | 'fail';
  quantumSignatureIntegrity: 'verified' | 'compromised' | 'pending';
  recommendations: string[];
}

interface SendMoneyViewProps {
  setActiveView: (view: View) => void;
}


// ================================================================================================
// ANIMATED UI SUB-COMPONENTS (Deeply Enhanced for future-proof UX)
// These provide a high-fidelity user experience during the security and DLT processing.
// ================================================================================================

/**
 * @description Renders an animated checkmark icon for success feedback.
 * The animation is pure CSS, making it lightweight and performant.
 * Expanded with holographic shimmer effect.
 */
export const AnimatedCheckmarkIcon: React.FC = () => (
    <>
        <svg className="h-24 w-24 transform scale-125" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
            <defs>
                <linearGradient id="checkmarkGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#4ade80" />
                    <stop offset="50%" stopColor="#86efac" />
                    <stop offset="100%" stopColor="#22c55e" />
                </linearGradient>
                <filter id="hologramGlow">
                    <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur" />
                    <feColorMatrix in="blur" mode="matrix" values="
                        1 0 0 0 0
                        0 1 0 0 0
                        0 0 1 0 0
                        0 0 0 10 0
                    " result="coloredBlur" />
                    <feMerge>
                        <feMergeNode in="coloredBlur" />
                        <feMergeNode in="SourceGraphic" />
                    </feMerge>
                </filter>
            </defs>
            <circle className="checkmark__circle" cx="26" cy="26" r="25" fill="none" stroke="url(#checkmarkGradient)" filter="url(#hologramGlow)" />
            <path className="checkmark__check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" />
        </svg>
        <style>{`
            .checkmark__circle {
                stroke-dasharray: 166;
                stroke-dashoffset: 166;
                stroke-width: 4;
                stroke-miterlimit: 10;
                fill: none;
                animation: stroke-circle 0.6s cubic-bezier(0.65, 0, 0.45, 1) forwards;
                box-shadow: 0 0 15px rgba(66, 255, 125, 0.7);
            }
            .checkmark__check {
                transform-origin: 50% 50%;
                stroke-dasharray: 48;
                stroke-dashoffset: 48;
                stroke-width: 5;
                stroke: #fff;
                animation: stroke-check 0.3s cubic-bezier(0.65, 0, 0.45, 1) 0.8s forwards;
            }
            @keyframes stroke-circle {
                100% { stroke-dashoffset: 0; }
            }
            @keyframes stroke-check {
                100% { stroke-dashoffset: 0; }
            }
        `}</style>
    </>
);

/**
 * @description Renders a futuristic "quantum ledger" animation to simulate
 * secure transaction processing. This enhances perceived security and trust.
 * Expanded with real-time data flow visualization.
 */
export const QuantumLedgerAnimation: React.FC = () => (
    <>
        <div className="quantum-ledger-container">
            <div className="quantum-grid-enhanced">
                {Array.from({ length: 16 }).map((_, i) => (
                    <div key={i} className="quantum-block-enhanced" style={{ animationDelay: `${i * 0.08}s` }}></div>
                ))}
            </div>
            <div className="quantum-data-flow">
                <div className="data-packet" style={{ '--flow-delay': '0s' } as React.CSSProperties}></div>
                <div className="data-packet" style={{ '--flow-delay': '0.5s' } as React.CSSProperties}></div>
                <div className="data-packet" style={{ '--flow-delay': '1s' } as React.CSSProperties}></div>
                <div className="data-packet" style={{ '--flow-delay': '1.5s' } as React.CSSProperties}></div>
            </div>
            <div className="text-center mt-4 text-xs text-cyan-300 animate-pulse">
                Quantum Entanglement Protocol: Active
            </div>
        </div>
        <style>{`
            .quantum-ledger-container {
                position: relative;
                width: 150px;
                height: 150px;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
            }
            .quantum-grid-enhanced {
                display: grid;
                grid-template-columns: repeat(4, 1fr);
                gap: 6px;
                width: 120px;
                height: 120px;
                position: relative;
                z-index: 1;
            }
            .quantum-block-enhanced {
                background-color: rgba(6, 182, 212, 0.2);
                border: 1px solid #06b6d4;
                border-radius: 3px;
                animation: quantum-pulse 2s infinite ease-in-out forwards;
                box-shadow: 0 0 8px rgba(6, 182, 212, 0.5);
            }
            @keyframes quantum-pulse {
                0%, 100% { background-color: rgba(6, 182, 212, 0.2); transform: scale(1); box-shadow: 0 0 8px rgba(6, 182, 212, 0.5); }
                50% { background-color: rgba(165, 243, 252, 0.7); transform: scale(1.08); box-shadow: 0 0 15px rgba(165, 243, 252, 0.8); }
            }

            .quantum-data-flow {
                position: absolute;
                inset: 0;
                display: flex;
                justify-content: center;
                align-items: center;
            }
            .data-packet {
                position: absolute;
                width: 8px;
                height: 8px;
                border-radius: 50%;
                background: linear-gradient(45deg, #0ef, #06b6d4);
                box-shadow: 0 0 5px #0ef, 0 0 10px #06b6d4;
                animation: data-flow-path 4s infinite linear var(--flow-delay);
                opacity: 0;
            }
            @keyframes data-flow-path {
                0% { transform: translate(-60px, -60px) scale(0.5); opacity: 0; }
                20% { opacity: 1; }
                50% { transform: translate(60px, 60px) scale(1.2); opacity: 1; }
                80% { opacity: 0; }
                100% { transform: translate(120px, 120px) scale(0.5); opacity: 0; }
            }
        `}</style>
    </>
);

// The main component, Remitrax.
export const SendMoneyView: React.FC<SendMoneyViewProps> = ({ setActiveView }) => {
    const [amount, setAmount] = useState('');
    const [recipient, setRecipient] = useState<RemitraxRecipientProfile | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const context = useContext(DataContext);
    if (!context) {
        throw new Error("SendMoneyView must be within a DataProvider");
    }
    const { addTransaction } = context;

    const handleSend = () => {
        if (!amount || !recipient) return;
        setIsProcessing(true);
        setTimeout(() => {
            const newTx: Transaction = {
                id: `tx_${Date.now()}`,
                type: 'expense',
                category: 'Transfer',
                description: `Sent to ${recipient.name}`,
                amount: parseFloat(amount),
                date: new Date().toISOString().split('T')[0],
            };
            addTransaction(newTx);
            setIsProcessing(false);
            setIsSuccess(true);
            setTimeout(() => {
                setIsSuccess(false);
                setAmount('');
                setRecipient(null);
                setActiveView(View.Dashboard);
            }, 3000);
        }, 4000); // Simulate processing time
    };

    if(isProcessing) {
        return (
            <Card>
                <div className="flex flex-col items-center justify-center h-96">
                    <QuantumLedgerAnimation />
                    <p className="mt-4 text-lg font-semibold text-white">Processing Transaction...</p>
                    <p className="text-sm text-gray-400">Securing quantum channel and committing to ledger.</p>
                </div>
            </Card>
        );
    }
    
    if(isSuccess) {
         return (
            <Card>
                <div className="flex flex-col items-center justify-center h-96">
                    <AnimatedCheckmarkIcon />
                    <p className="mt-4 text-lg font-semibold text-white">Transaction Sent!</p>
                    <p className="text-sm text-gray-400">
                        ${amount} sent to {recipient?.name}.
                    </p>
                </div>
            </Card>
        );
    }

    // Mock recipient for demo
    const mockRecipient: RemitraxRecipientProfile = {
        id: 'rec_1',
        name: 'Alex Ray',
        quantumTag: '@alexray',
        trustScore: 95,
        kycStatus: 'verified',
        avatarUrl: 'https://i.pravatar.cc/80?u=alexray'
    };

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold text-white tracking-wider">Remitrax: Send Money</h2>
            <Card>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                        <h3 className="text-lg font-semibold text-white mb-4">Recipient</h3>
                        <div 
                            className="p-4 bg-gray-700/50 rounded-lg flex items-center gap-4 cursor-pointer"
                            onClick={() => setRecipient(mockRecipient)}
                        >
                             <img src={mockRecipient.avatarUrl} alt={mockRecipient.name} className="w-12 h-12 rounded-full" />
                             <div>
                                <p className="font-semibold text-white">{mockRecipient.name}</p>
                                <p className="text-sm text-cyan-400">{mockRecipient.quantumTag}</p>
                             </div>
                        </div>
                        {recipient && <p className="text-green-400 text-xs mt-2">Recipient selected: {recipient.name}</p>}
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-white mb-4">Amount</h3>
                         <input 
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            placeholder="0.00"
                            className="w-full text-4xl bg-transparent border-b-2 border-gray-600 focus:border-cyan-500 text-white outline-none pb-2"
                        />
                         <button
                            onClick={handleSend}
                            disabled={!amount || !recipient || parseFloat(amount) <= 0}
                            className="w-full mt-6 py-3 bg-cyan-600 hover:bg-cyan-700 text-white font-bold rounded-lg disabled:opacity-50"
                        >
                            Send ${amount || '0.00'}
                        </button>
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default SendMoneyView;

================================================================================
// APPENDED FROM REPO: diplomat-bit/aibanking.dev-jocall3-new | ORIGINAL PATH: diplomat-bit-aibanking.dev-jocall3-new-84d7a30/components/SendMoneyView.tsx
================================================================================


import React, { useState, useContext, useEffect } from 'react';
import Card from './Card';
import { DataContext } from '../context/DataContext';
import { View, PaymentRail, Transaction } from '../types';
import { BiometricModal, SecurityAuditDisplay, SecurityAuditResult } from './payment-components';
import { Send, Zap, ShieldCheck, Database, History, Terminal } from 'lucide-react';

const SendMoneyView: React.FC = () => {
    const context = useContext(DataContext);
    if (!context) throw new Error("SendMoneyView must be used within a DataProvider");
    const { addTransaction, setActiveView } = context;

    const [amount, setAmount] = useState('');
    const [recipientName, setRecipientName] = useState('');
    const [paymentMethod, setPaymentMethod] = useState<PaymentRail>('quantumpay');
    const [showBiometricModal, setShowBiometricModal] = useState(false);
    const [securityAudit, setSecurityAudit] = useState<SecurityAuditResult | null>(null);
    const [currentStep, setCurrentStep] = useState(1);

    useEffect(() => {
        const auditTimeout = setTimeout(() => {
            if (parseFloat(amount) > 0 && recipientName) {
                setSecurityAudit({
                    riskScore: parseFloat(amount) > 5000 ? 60 : 10,
                    fraudProbability: 0.01,
                    amlCompliance: 'pass',
                    sanctionScreening: 'pass',
                    quantumSignatureIntegrity: 'verified',
                    recommendations: parseFloat(amount) > 5000 ? ["High value transaction. AI monitoring active."] : ["Optimal route confirmed."],
                    complianceAlerts: [],
                    threatVectorAnalysis: []
                });
            } else {
                setSecurityAudit(null);
            }
        }, 800);
        return () => clearTimeout(auditTimeout);
    }, [amount, recipientName]);

    const handleSendClick = () => {
        if (currentStep === 1) setCurrentStep(2);
        else if (currentStep === 2) setShowBiometricModal(true);
    };

    const handleSuccess = async () => {
        const newTx: Transaction = {
            id: `tx_${Date.now()}`,
            type: 'expense',
            category: 'Transfer',
            description: `Sent to ${recipientName} via ${paymentMethod}`,
            amount: parseFloat(amount),
            date: new Date().toISOString().split('T')[0],
            carbonFootprint: 0.5,
            aiCategoryConfidence: 1.0
        };
        await addTransaction(newTx);
        setShowBiometricModal(false);
        setActiveView(View.Dashboard);
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500 max-w-5xl mx-auto">
            <header className="flex justify-between items-end border-b border-gray-800 pb-6">
                <div>
                    <h2 className="text-4xl font-black text-white tracking-tighter uppercase italic">Quantum Pay Portal</h2>
                    <p className="text-gray-400 text-sm font-mono tracking-widest mt-1">RAIL_ID: {paymentMethod.toUpperCase()} // STATUS: ENCRYPTED</p>
                </div>
                <div className="flex gap-2">
                    <div className="px-3 py-1.5 bg-gray-900 border border-gray-800 rounded-lg flex items-center gap-2 text-[10px] font-bold text-emerald-400 uppercase">
                        <Database size={14} /> Settlement: Instant
                    </div>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-7">
                    <Card title={currentStep === 1 ? "Initiate Flow" : "Security Verification"}>
                        <div className="space-y-6 pt-4">
                            {currentStep === 1 ? (
                                <>
                                    <div className="space-y-1">
                                        <label className="block text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] ml-1">Destination Identifier</label>
                                        <div className="relative">
                                            <input 
                                                type="text" 
                                                value={recipientName} 
                                                onChange={e => setRecipientName(e.target.value)} 
                                                className="w-full bg-black/40 border border-gray-700 rounded-2xl p-4 text-white focus:ring-1 focus:ring-cyan-500 outline-none font-mono text-lg" 
                                                placeholder="Name, @tag, or Wallet ID" 
                                            />
                                            <Zap className="absolute right-4 top-4 text-gray-700" size={20} />
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="block text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] ml-1">Magnitude (USD)</label>
                                        <div className="relative">
                                            <input 
                                                type="number" 
                                                value={amount} 
                                                onChange={e => setAmount(e.target.value)} 
                                                className="w-full bg-black/40 border border-gray-700 rounded-2xl p-4 text-white focus:ring-1 focus:ring-cyan-500 outline-none font-mono text-4xl font-black" 
                                                placeholder="0.00" 
                                            />
                                            <span className="absolute right-6 top-6 text-gray-600 font-bold">USD</span>
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="block text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] ml-1">Execution Protocol</label>
                                        <select 
                                            value={paymentMethod} 
                                            onChange={e => setPaymentMethod(e.target.value as PaymentRail)} 
                                            className="w-full bg-black/40 border border-gray-700 rounded-2xl p-4 text-white focus:ring-1 focus:ring-cyan-500 outline-none font-mono appearance-none"
                                        >
                                            <option value="quantumpay">QuantumPay (Instant Settlement)</option>
                                            <option value="cashapp">Cash App</option>
                                            <option value="swift_global">SWIFT Global (L1)</option>
                                            <option value="blockchain_dlt">Blockchain DLT</option>
                                        </select>
                                    </div>
                                </>
                            ) : (
                                <div className="space-y-6 animate-in slide-in-from-right-4 duration-500">
                                    <div className="bg-gray-900/80 p-8 rounded-[2rem] border border-gray-800 space-y-4 text-center">
                                        <p className="text-xs text-gray-500 uppercase font-black tracking-widest">Awaiting Digital Signature</p>
                                        <div className="text-5xl font-black text-white font-mono tracking-tighter">${parseFloat(amount).toLocaleString()}</div>
                                        <p className="text-cyan-400 font-mono text-sm tracking-tighter">TARGET: {recipientName.toUpperCase()}</p>
                                        <div className="h-px bg-gray-800 w-2/3 mx-auto"></div>
                                        <p className="text-[10px] text-gray-600 font-mono">ESTIMATED_FEE: $0.00 // NETWORK: {paymentMethod.toUpperCase()}</p>
                                    </div>
                                    <SecurityAuditDisplay auditResult={securityAudit} />
                                </div>
                            )}
                            
                            <div className="flex justify-end gap-4 mt-8">
                                {currentStep === 2 && (
                                    <button onClick={() => setCurrentStep(1)} className="px-8 py-4 bg-gray-800 hover:bg-gray-700 text-white font-black rounded-2xl transition-all uppercase tracking-widest text-xs">
                                        Back
                                    </button>
                                )}
                                <button 
                                    onClick={handleSendClick} 
                                    disabled={!amount || !recipientName} 
                                    className="px-10 py-4 bg-cyan-600 hover:bg-cyan-500 rounded-2xl text-white font-black shadow-xl shadow-cyan-600/20 transition-all active:scale-95 disabled:opacity-50 uppercase tracking-[0.2em] text-xs flex items-center gap-3"
                                >
                                    {currentStep === 1 ? "Review Protocol" : "Authorize Flow"}
                                    <Send size={16} />
                                </button>
                            </div>
                        </div>
                    </Card>
                </div>

                <div className="lg:col-span-5 space-y-6">
                    <Card title="Signal Diagnostics">
                        <div className="space-y-6 py-2">
                            <div className="p-5 bg-gray-950 rounded-2xl border border-gray-800">
                                <p className="text-[10px] text-gray-500 uppercase font-black mb-3 tracking-widest">Network Integrity</p>
                                <div className="grid grid-cols-8 gap-1.5">
                                    {[...Array(8)].map((_, i) => (
                                        <div key={i} className="h-1.5 bg-cyan-500 rounded-full shadow-[0_0_10px_rgba(6,182,212,0.4)] animate-pulse" style={{ animationDelay: `${i * 100}ms` }}></div>
                                    ))}
                                </div>
                            </div>
                            <div className="p-5 bg-gray-950 rounded-2xl border border-gray-800 space-y-4">
                                <div className="flex items-center gap-3">
                                    <ShieldCheck className="text-emerald-500" size={18} />
                                    <div className="flex-1">
                                        <p className="text-[10px] text-white font-black uppercase">Zero-Knowledge Proofs</p>
                                        <p className="text-[10px] text-gray-500">Identity masking enabled for this route.</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Terminal className="text-cyan-500" size={18} />
                                    <div className="flex-1 min-w-0">
                                        <p className="text-[10px] text-white font-black uppercase">Telemetry Log</p>
                                        <p className="text-[9px] text-gray-600 font-mono truncate">&gt; handshaking with node_{paymentMethod.substring(0, 4)}...</p>
                                    </div>
                                </div>
                            </div>
                            <div className="p-5 bg-indigo-900/10 border border-indigo-500/20 rounded-2xl flex items-center gap-4">
                                <History className="text-indigo-400" />
                                <div>
                                    <p className="text-[10px] text-white font-black uppercase">Recent Synergies</p>
                                    <p className="text-[10px] text-gray-500">3 transfers to this recipient in the last 30 days.</p>
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
            <BiometricModal 
                isOpen={showBiometricModal} 
                onSuccess={handleSuccess} 
                onClose={() => setShowBiometricModal(false)} 
                amount={amount} 
                recipient={recipientName} 
                paymentMethod={paymentMethod} 
                securityContext="personal_finance" 
            />
        </div>
    );
};

export default SendMoneyView;


================================================================================
// APPENDED FROM REPO: diplomat-bit/almost | ORIGINAL PATH: diplomat-bit-almost-93a5466/components/SendMoneyView (2).tsx
================================================================================

// components/views/personal/SendMoneyView.tsx
// RE-ENACTED & EXPANDED: This component has been resurrected from its deprecated state.
// It is now "Remitrax," a complete, multi-rail payment portal featuring advanced
// security simulations and demonstrating enterprise-level integration patterns.

import React, { useState, useContext, useRef, useEffect } from 'react';
import Card from './Card';
import { DataContext } from '../context/DataContext';
import { View } from '../types';
import type { Transaction } from '../types';

// ================================================================================================
// TYPE DEFINITIONS
// ================================================================================================
type PaymentMethod = 'quantumpay' | 'cashapp';
type ScanState = 'scanning' | 'success' | 'verifying' | 'error';

// FIX: Added interface definition for component props.
interface SendMoneyViewProps {
  setActiveView: (view: View) => void;
}


// ================================================================================================
// ANIMATED UI SUB-COMPONENTS
// These provide a high-fidelity user experience during the security process.
// ================================================================================================

/**
 * @description Renders an animated checkmark icon for success feedback.
 * The animation is pure CSS, making it lightweight and performant.
 */
const AnimatedCheckmarkIcon: React.FC = () => (
    <>
        <svg className="h-24 w-24" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
            <circle className="checkmark__circle" cx="26" cy="26" r="25" fill="none" />
            <path className="checkmark__check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" />
        </svg>
        <style>{`
            .checkmark__circle {
                stroke-dasharray: 166;
                stroke-dashoffset: 166;
                stroke-width: 3;
                stroke-miterlimit: 10;
                stroke: #4ade80;
                fill: none;
                animation: stroke 0.6s cubic-bezier(0.65, 0, 0.45, 1) forwards;
            }
            .checkmark__check {
                transform-origin: 50% 50%;
                stroke-dasharray: 48;
                stroke-dashoffset: 48;
                stroke-width: 4;
                stroke: #fff;
                animation: stroke 0.3s cubic-bezier(0.65, 0, 0.45, 1) 0.8s forwards;
            }
            @keyframes stroke {
                100% { stroke-dashoffset: 0; }
            }
        `}</style>
    </>
);

/**
 * @description Renders a futuristic "quantum ledger" animation to simulate
 * secure transaction processing. This enhances perceived security and trust.
 */
const QuantumLedgerAnimation: React.FC = () => (
    <>
        <div className="quantum-grid">
            {Array.from({ length: 9 }).map((_, i) => <div key={i} className="quantum-block"></div>)}
        </div>
        <style>{`
            .quantum-grid {
                display: grid;
                grid-template-columns: repeat(3, 1fr);
                gap: 8px;
                width: 100px;
                height: 100px;
            }
            .quantum-block {
                background-color: rgba(6, 182, 212, 0.3);
                border: 1px solid #06b6d4;
                border-radius: 4px;
                animation: quantum-flash 2s infinite ease-in-out;
            }
            .quantum-block:nth-child(1) { animation-delay: 0.1s; }
            .quantum-block:nth-child(2) { animation-delay: 0.5s; }
            .quantum-block:nth-child(3) { animation-delay: 0.2s; }
            .quantum-block:nth-child(4) { animation-delay: 0.6s; }
            .quantum-block:nth-child(5) { animation-delay: 0.3s; }
            .quantum-block:nth-child(6) { animation-delay: 0.7s; }
            .quantum-block:nth-child(7) { animation-delay: 0.4s; }
            .quantum-block:nth-child(8) { animation-delay: 0.8s; }
            .quantum-block:nth-child(9) { animation-delay: 0.1s; }
            @keyframes quantum-flash {
                0%, 100% { background-color: rgba(6, 182, 212, 0.3); transform: scale(1); }
                50% { background-color: rgba(165, 243, 252, 0.8); transform: scale(1.05); }
            }
        `}</style>
    </>
);

// ================================================================================================
// HIGH-FIDELITY BIOMETRIC MODAL
// ================================================================================================

const BiometricModal: React.FC<{ 
    isOpen: boolean;
    onSuccess: () => void; 
    onClose: () => void; 
    amount: string; 
    recipient: string; 
    paymentMethod: 'QuantumPay' | 'Cash App';
}> = ({ isOpen, onSuccess, onClose, amount, recipient, paymentMethod }) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [scanState, setScanState] = useState<ScanState>('scanning');
    const [verificationStep, setVerificationStep] = useState(0);

    const verificationMessages = [
        `Heuristic API: Validating ${recipient}'s identity...`,
        'Heuristic API: Checking sufficient funds...',
        'Heuristic API: Executing transaction on secure ledger...',
        'Heuristic API: Confirming transfer...',
    ];

    // Effect to manage camera stream and the multi-step verification flow.
    useEffect(() => {
        if (!isOpen) {
            setScanState('scanning');
            setVerificationStep(0);
            return;
        };

        let stream: MediaStream | null = null;
        const startCamera = async () => {
            try {
                stream = await navigator.mediaDevices.getUserMedia({ video: true });
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                }
            } catch (err) {
                console.error("Camera access denied:", err);
                setScanState('error');
            }
        };
        startCamera();

        // Timers to simulate the multi-stage verification process.
        const successTimer = setTimeout(() => setScanState('success'), 3000);
        const verifyTimer = setTimeout(() => setScanState('verifying'), 4000);
        const successActionTimer = setTimeout(onSuccess, 8500);
        const closeTimer = setTimeout(onClose, 9500);

        return () => {
            clearTimeout(successTimer);
            clearTimeout(verifyTimer);
            clearTimeout(successActionTimer);
            clearTimeout(closeTimer);
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
            }
        };
    }, [isOpen, onSuccess, onClose]);
    
    // Effect to cycle through the verification messages.
    useEffect(() => {
        if (scanState === 'verifying') {
            const interval = setInterval(() => {
                setVerificationStep(prev => Math.min(prev + 1, verificationMessages.length - 1));
            }, 1000);
            return () => clearInterval(interval);
        }
    }, [scanState, verificationMessages.length]);

    const getTitle = () => {
        switch (scanState) {
            case 'scanning': return 'Scanning Face';
            case 'success': return 'Identity Confirmed';
            case 'verifying': return 'Quantum Ledger Verification';
            case 'error': return 'Verification Failed';
        }
    }
    
    return (
        <div className={`fixed inset-0 bg-black/70 flex items-end sm:items-center justify-center z-50 backdrop-blur-sm transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
            <div className={`bg-gray-800 rounded-t-2xl sm:rounded-2xl p-8 max-w-sm w-full text-center border-t sm:border border-gray-700 transition-transform duration-300 ease-out transform ${isOpen ? 'translate-y-0' : 'translate-y-full'}`}>
                <div className="relative w-64 h-64 mx-auto rounded-full overflow-hidden border-4 border-gray-600 mb-6">
                    <video ref={videoRef} autoPlay muted playsInline className="absolute top-0 left-0 w-full h-full object-cover transform scale-x-[-1]"></video>
                    {scanState === 'scanning' && <div className="absolute inset-0 bg-grid-pattern animate-scan"></div>}
                    {scanState === 'success' && <div className="absolute inset-0 bg-green-500/50 flex items-center justify-center"><AnimatedCheckmarkIcon /></div>}
                    {scanState === 'verifying' && <div className="absolute inset-0 bg-black/50 flex items-center justify-center"><QuantumLedgerAnimation /></div>}
                    {scanState === 'error' && <div className="absolute inset-0 bg-red-500/50 flex items-center justify-center p-4"><p>Camera not found. Cannot complete biometric verification.</p></div>}
                </div>
                <h3 className="text-2xl font-bold text-white">{getTitle()}</h3>
                <p className="text-gray-400 mt-2">{scanState === 'verifying' ? verificationMessages[verificationStep] : `Sending $${amount} to ${recipient} via ${paymentMethod}`}</p>
                {scanState === 'scanning' && <button onClick={onClose} className="mt-6 px-4 py-2 bg-gray-700/50 hover:bg-gray-700 rounded-lg text-sm text-gray-300">Cancel</button>}
            </div>
             <style>{`.bg-grid-pattern{background-image:linear-gradient(rgba(0,255,255,0.2) 1px,transparent 1px),linear-gradient(90deg,rgba(0,255,255,0.2) 1px,transparent 1px);background-size:2rem 2rem}@keyframes scan-effect{0%{background-position:0 0}100%{background-position:0 -4rem}}.animate-scan{animation:scan-effect 1.5s linear infinite}`}</style>
        </div>
    );
};

// ================================================================================================
// MAIN VIEW COMPONENT: SendMoneyView (Remitrax)
// ================================================================================================
const SendMoneyView: React.FC<SendMoneyViewProps> = ({ setActiveView }) => {
  const context = useContext(DataContext);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('quantumpay');
  const [amount, setAmount] = useState('');
  const [quantumTag, setQuantumTag] = useState('');
  const [remittance, setRemittance] = useState('');
  const [cashtag, setCashtag] = useState('');
  const [showModal, setShowModal] = useState(false);

  if (!context) throw new Error("SendMoneyView must be used within a DataProvider");
  const { addTransaction } = context;

  const recipient = paymentMethod === 'quantumpay' ? quantumTag : cashtag;
  const isFormValid = parseFloat(amount) > 0 && recipient.trim() !== '';

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (isFormValid) setShowModal(true);
  };
  
  const handleSuccess = () => {
    const simulateApiCall = () => {
      // In a real application, this would use a library like axios or fetch.
      // This simulation demonstrates knowledge of how such an API call would be structured.
      const requestBody = {
          "to_account_id": recipient,
          "amount": amount,
          "currency": "USD",
          "description": remittance || `QuantumBank payment`
      };
      console.log("%c--- SIMULATING OPEN BANKING API CALL (ISO 20022 Compliant) ---", "color: cyan; font-weight: bold;");
      console.log("Endpoint: POST /my/payments");
      console.log("Body:", requestBody);
      console.log("-----------------------------------------");
    };
    
    if (paymentMethod === 'quantumpay') simulateApiCall();

    const newTx: Transaction = {
      id: `txn_${Date.now()}`,
      type: 'expense',
      category: 'Transfer',
      description: `Payment to ${recipient}`,
      amount: parseFloat(amount),
      date: new Date().toISOString().split('T')[0],
      carbonFootprint: 0.1,
    };
    addTransaction(newTx);
  };
  
  const handleClose = () => {
      setShowModal(false);
      setTimeout(() => setActiveView(View.Transactions), 350);
  };
  
  return (
      <>
        <Card title="Send Money (Remitrax)">
            <div className="p-1 bg-gray-900/50 rounded-lg flex mb-6">
                <button onClick={() => setPaymentMethod('quantumpay')} className={`w-1/2 py-2.5 text-sm font-medium rounded-md transition-colors ${paymentMethod === 'quantumpay' ? 'bg-cyan-600 text-white' : 'text-gray-300 hover:bg-gray-700/50'}`}>QuantumPay (ISO20022)</button>
                <button onClick={() => setPaymentMethod('cashapp')} className={`w-1/2 py-2.5 text-sm font-medium rounded-md transition-colors ${paymentMethod === 'cashapp' ? 'bg-green-600 text-white' : 'text-gray-300 hover:bg-gray-700/50'}`}>Cash App</button>
            </div>
            
            <form onSubmit={handleSend} className="space-y-6">
                 {paymentMethod === 'quantumpay' ? (
                    <>
                        <div><label htmlFor="quantumTag" className="block text-sm font-medium text-gray-300">Recipient's @QuantumTag</label><input type="text" name="quantumTag" value={quantumTag} onChange={(e) => setQuantumTag(e.target.value)} className="mt-1 w-full bg-gray-700/50 border-gray-600 rounded-lg p-2 text-white" placeholder="@the_future"/></div>
                        <div><label htmlFor="remittance" className="block text-sm font-medium text-gray-300">Remittance Info (ISO 20022)</label><input type="text" name="remittance" value={remittance} onChange={(e) => setRemittance(e.target.value)} className="mt-1 w-full bg-gray-700/50 border-gray-600 rounded-lg p-2 text-white" placeholder="Invoice #12345"/></div>
                    </>
                 ) : (
                    <div><label htmlFor="cashtag" className="block text-sm font-medium text-gray-300">Recipient's $Cashtag</label><input type="text" name="cashtag" value={cashtag} onChange={(e) => setCashtag(e.target.value)} className="mt-1 w-full bg-gray-700/50 border-gray-600 rounded-lg p-2 text-white" placeholder="$new_beginnings"/></div>
                 )}
                <div>
                    <label htmlFor="amount" className="block text-sm font-medium text-gray-300">Amount</label>
                    <div className="mt-1 relative"><div className="pointer-events-none absolute inset-y-0 left-0 pl-3 flex items-center"><span className="text-gray-400">$</span></div><input type="number" name="amount" value={amount} onChange={(e) => setAmount(e.target.value)} className="w-full bg-gray-700/50 border-gray-600 rounded-lg pl-7 p-2 text-white" placeholder="0.00"/></div>
                </div>
                <button type="submit" disabled={!isFormValid} className={`w-full py-3 text-sm font-medium text-white rounded-lg disabled:opacity-50 ${paymentMethod === 'quantumpay' ? 'bg-cyan-600 hover:bg-cyan-700' : 'bg-green-600 hover:bg-green-700'}`}>Send with Biometric Confirmation</button>
            </form>
        </Card>
        <BiometricModal isOpen={showModal} onSuccess={handleSuccess} onClose={handleClose} amount={amount} recipient={recipient} paymentMethod={paymentMethod === 'quantumpay' ? 'QuantumPay' : 'Cash App'} />
    </>
  );
};

export default SendMoneyView;


================================================================================
// APPENDED FROM REPO: diplomat-bit/almost | ORIGINAL PATH: diplomat-bit-almost-93a5466/components/SendMoneyView (3).tsx
================================================================================

// components/SendMoneyView.tsx
// This component is undergoing a major refactor to transition from a deprecated, insecure prototype
// to a stable, production-ready financial transaction interface. The original "NexusPay" was intentionally
// flawed, lacking compliance, robust encryption, and secure authentication. This refactor replaces
// those components with modern, secure, and efficient patterns.

import React, { useState, useContext, useRef, useEffect, useCallback } from 'react';
import Card from './Card'; // Assuming Card is a reusable UI component
import { DataContext } from '../context/DataContext';
import { View } from '../types'; // Assuming View type is defined elsewhere
import type { Transaction } from '../types'; // Assuming Transaction type is defined elsewhere

// ================================================================================================
// REFACTORED TYPE DEFINITIONS (Lean and Production-Focused)
// ================================================================================================

// Payment Rail types are now consolidated and focus on common, stable protocols.
export type PaymentRail = 'quantumpay_stable' | 'cashapp_v2' | 'swift_iso20022' | 'blockchain_erc20' | 'ripple_ledger' | 'fedwire_rtgs';

// ScanState is simplified to reflect common verification stages.
export type ScanState = 'scanning' | 'verifying' | 'success' | 'error';

// RemitraxRecipientProfile is streamlined for essential recipient data.
export interface RemitraxRecipientProfile {
  id: string;
  name: string;
  legalEntityName?: string; // For corporate entities
  taxId?: string; // Essential for compliance
  avatarUrl?: string;
  preferredCurrency?: string;
  kycStatus?: 'verified' | 'pending' | 'unverified';
  bankAccounts?: { bankName: string; accountNumber: string; routingNumber?: string; iban?: string; swiftCode?: string; accountType: 'checking' | 'savings' | 'corporate'; }[];
  eWalletDetails?: { type: 'paypal' | 'venmo' | 'zelle' | 'cashapp_v2'; identifier: string; }[];
  // Removed legacy/experimental fields like quantumTag, cashtag, neuroLinkAddress, galacticP2PId, etc.
  // Compliance and risk fields are now managed via a separate, standardized service.
}

// RemitraxCurrency is simplified to core attributes.
export interface RemitraxCurrency {
  code: string;
  name: string;
  symbol: string;
  isCrypto: boolean;
  decimalPlaces: number;
  // Removed experimental fields like quantumFluctuationIndex, liquidityScore, etc.
}

// ScheduledPaymentRule is simplified to core recurrence and conditional logic.
export interface ScheduledPaymentRule {
  frequency: 'daily' | 'weekly' | 'monthly' | 'annually' | 'once_on_date';
  startDate: string;
  endDate?: string;
  executionCondition?: string; // Basic conditional logic string
  paymentReason?: string;
}

// AdvancedTransactionSettings are refactored for security and compliance.
export interface AdvancedTransactionSettings {
  priority: 'low' | 'normal' | 'high';
  // Removed experimental/non-standard fields like carbonOffsetRatio, privacyLevel, receiptPreference, multiSignatureRequired, escrowDetails, dynamicFeeOptimization, dlcDetails, postQuantumSecurityEnabled, aiComplianceCheckLevel.
  dataEncryptionStandard: 'aes256_gcm' | 'rsa_oaep'; // Standardized and secure options
  routeOptimizationPreference: 'speed' | 'cost' | 'compliance'; // Focus on practical optimizations
  notificationPreferences: { email: boolean; sms: boolean; push: boolean; dlt_confirmation: boolean; };
}

// SecurityAuditResult is standardized for critical security and compliance metrics.
export interface SecurityAuditResult {
  riskScore: number; // Normalized risk score (0-100)
  fraudProbability: number; // Probability of fraud (0.0-1.0)
  amlCompliance: 'pass' | 'fail' | 'review'; // AML check status
  sanctionScreening: 'pass' | 'fail' | 'partial_match'; // Sanctions list check status
  recommendations: string[]; // Actionable recommendations
  // Removed non-standard fields like quantumSignatureIntegrity, threatVectorAnalysis, aiConfidenceScore.
}

// EnvironmentalImpactReport is removed as it's out of scope for the core MVP.
// Future modules can reintroduce this.

// RailSpecificDetails is consolidated and simplified.
export interface RailSpecificDetails {
    swift?: { bic: string; accountNumber: string; beneficiaryAddress?: string; };
    blockchain?: { network: 'ethereum' | 'polygon'; contractAddress?: string; tokenAddress?: string; };
    ripple?: { destinationTag?: string; };
    fedwire?: { routingNumber: string; };
    // Removed experimental rails.
}

interface SendMoneyViewProps {
  setActiveView: (view: View) => void;
}

// ================================================================================================
// STATIC UI SUB-COMPONENTS (Cleaned and Standardized)
// ================================================================================================

// AnimatedCheckmarkIcon: Standardized success animation.
export const AnimatedCheckmarkIcon: React.FC = () => (
    <>
        <svg className="h-24 w-24 transform scale-125" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
            <defs>
                <linearGradient id="checkmarkGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#4ade80" />
                    <stop offset="50%" stopColor="#86efac" />
                    <stop offset="100%" stopColor="#22c55e" />
                </linearGradient>
            </defs>
            <circle className="checkmark__circle" cx="26" cy="26" r="25" fill="none" stroke="url(#checkmarkGradient)" strokeWidth="4" strokeMiterlimit="10" />
            <path className="checkmark__check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" />
        </svg>
        <style>{`
            .checkmark__circle { stroke-dasharray: 166; stroke-dashoffset: 166; animation: stroke-circle 0.6s cubic-bezier(0.65, 0, 0.45, 1) forwards; }
            .checkmark__check { transform-origin: 50% 50%; stroke-dasharray: 48; stroke-dashoffset: 48; stroke-width: 5; animation: stroke-check 0.3s cubic-bezier(0.65, 0, 0.45, 1) 0.8s forwards; }
            @keyframes stroke-circle { 100% { stroke-dashoffset: 0; } }
            @keyframes stroke-check { 100% { stroke-dashoffset: 0; } }
        `}</style>
    </>
);

// BiometricModal: Refactored for clarity and standard authentication flow.
// Replaces legacy scan states with standard ones. Removed experimental animations.
export const BiometricModal: React.FC<{
    isOpen: boolean; onSuccess: () => void; onClose: () => void; amount: string; recipient: RemitraxRecipientProfile | string; paymentMethod: PaymentRail;
}> = ({ isOpen, onSuccess, onClose, amount, recipient, paymentMethod }) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [scanState, setScanState] = useState<ScanState>('scanning');
    const [biometricProgress, setBiometricProgress] = useState(0);
    const recipientName = typeof recipient === 'string' ? recipient : recipient.name || 'Unknown Entity';

    // Simplified verification messages focusing on standard security protocols.
    const verificationMessages = [
        `Verifying transaction details for ${recipientName}...`,
        `Performing AML and Sanctions Check...`,
        `Authenticating with secure biometric data...`,
        `Finalizing transaction on ${paymentMethod} ledger...`
    ];
    const [currentVerificationMessageIndex, setCurrentVerificationMessageIndex] = useState(0);

    useEffect(() => {
        if (!isOpen) {
            setScanState('scanning');
            setBiometricProgress(0);
            setCurrentVerificationMessageIndex(0);
            return;
        }
        
        let stream: MediaStream | null = null;
        const startCamera = async () => {
            try {
                stream = await navigator.mediaDevices.getUserMedia({ video: true });
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                    videoRef.current.play();
                }
            } catch (err) {
                console.error("Camera access denied or failed:", err);
                setScanState('error');
            }
        };
        startCamera();

        // Simulate progress and state transitions
        const progressInterval = setInterval(() => setBiometricProgress(prev => Math.min(prev + Math.random() * 10, 100)), 300);
        
        const stateSequence = [
            { state: 'verifying', delay: 4000 }, // Simulate initial scan and data gathering
            { state: 'success', delay: 3000 }  // Simulate successful verification
        ];

        let currentDelay = 0;
        stateSequence.forEach(({ state, delay }) => {
            currentDelay += delay;
            setTimeout(() => setScanState(state as ScanState), currentDelay);
        });

        const successActionTimer = setTimeout(onSuccess, currentDelay + 1500);
        const closeTimer = setTimeout(onClose, currentDelay + 3000); // Close modal after a short delay post-success

        return () => {
            clearInterval(progressInterval);
            stateSequence.forEach(({ state, delay }) => clearTimeout(setTimeout(() => {}, delay))); // Clear scheduled timeouts
            clearTimeout(successActionTimer);
            clearTimeout(closeTimer);
            if (stream) stream.getTracks().forEach(track => track.stop());
        };
    }, [isOpen, onSuccess, onClose, amount, recipient, paymentMethod]);

    // Update verification message based on state and progress
    useEffect(() => {
        if (scanState === 'verifying') {
            const messageInterval = setInterval(() => {
                setCurrentVerificationMessageIndex(prev => Math.min(prev + 1, verificationMessages.length - 1));
            }, 1500); // Change message every 1.5 seconds
            return () => clearInterval(messageInterval);
        }
    }, [scanState, verificationMessages.length]);

    const getTitle = () => {
        switch (scanState) {
            case 'scanning': return 'Biometric Scan';
            case 'verifying': return 'Verifying Transaction';
            case 'success': return 'Authentication Successful';
            case 'error': return 'Authentication Failed';
            default: return 'Processing';
        }
    };

    const getStatusMessage = () => {
        switch (scanState) {
            case 'scanning': return `Awaiting biometric input. Progress: ${biometricProgress.toFixed(0)}%`;
            case 'verifying': return verificationMessages[currentVerificationMessageIndex] || "Processing...";
            case 'success': return `Transaction of $${amount} authorized for ${recipientName}.`;
            case 'error': return "Biometric scan failed. Please try again.";
            default: return "Processing...";
        }
    }

    // Simplified UI for Biometric Modal
    return (
        <div className={`fixed inset-0 bg-black/90 flex items-center justify-center z-50 backdrop-blur-xl transition-opacity duration-500 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
            <div className={`bg-gray-950 rounded-3xl p-8 max-w-xl w-full text-center border-4 border-double ${scanState === 'success' ? 'border-green-600' : 'border-cyan-700'} shadow-2xl transition-transform duration-500 ${isOpen ? 'translate-y-0 scale-100' : 'translate-y-full scale-90'}`}>
                <h3 className="text-4xl font-black text-white mb-6 tracking-wide">{getTitle()}</h3>
                <div className="relative w-[300px] h-[300px] mx-auto rounded-full overflow-hidden border-4 border-cyan-600 mb-6 shadow-inner shadow-cyan-900">
                    {scanState !== 'success' && scanState !== 'error' && (
                        <video ref={videoRef} autoPlay muted playsInline className="absolute top-0 left-0 w-full h-full object-cover transform scale-x-[-1]"></video>
                    )}
                    {scanState === 'success' && <div className="absolute inset-0 bg-green-700/60 flex items-center justify-center"><AnimatedCheckmarkIcon /></div>}
                    {scanState === 'error' && <div className="absolute inset-0 bg-red-700/60 flex items-center justify-center text-red-200 text-4xl font-bold">X</div>}
                    {scanState === 'scanning' && (
                        <div className="absolute inset-0 bg-gray-900/70 flex items-center justify-center">
                            <div className="animate-pulse text-lg text-cyan-300">Scanning...</div>
                        </div>
                    )}
                </div>
                <p className="text-lg text-gray-200 mt-4 font-light">{getStatusMessage()}</p>
            </div>
        </div>
    );
};

// ================================================================================================
// REMITRAX SIDE VIEW COMPONENT (Production-Ready Form Interface)
// ================================================================================================

const SendMoneyView: React.FC<SendMoneyViewProps> = ({ setActiveView }) => {
    const context = useContext(DataContext);
    // Error handling for missing context is critical.
    if (!context) throw new Error("SendMoneyView must be used within a DataProvider");
    const { addTransaction, availableCurrencies, recipients } = context; // Assuming these are stable context values.

    // --- State Management ---
    const [amount, setAmount] = useState('');
    const [recipientIdentifier, setRecipientIdentifier] = useState('');
    const [selectedRecipient, setSelectedRecipient] = useState<RemitraxRecipientProfile | null>(null);
    const [paymentMethod, setPaymentMethod] = useState<PaymentRail>('quantumpay_stable'); // Default to a stable, modern rail.
    const [currencyCode, setCurrencyCode] = useState('USD');
    const [advancedSettings, setAdvancedSettings] = useState<AdvancedTransactionSettings>({
        priority: 'normal',
        dataEncryptionStandard: 'aes256_gcm', // Default to a secure standard.
        routeOptimizationPreference: 'speed',
        notificationPreferences: { email: true, sms: false, push: true, dlt_confirmation: true }
    });
    const [showBiometricModal, setShowBiometricModal] = useState(false);
    const [securityAudit, setSecurityAudit] = useState<SecurityAuditResult | null>(null);
    const [currentStep, setCurrentStep] = useState(1); // 1: Input, 2: Review, 3: Processing (Biometric Modal)

    // --- Derived State and Validation ---
    const currentCurrency = availableCurrencies.find(c => c.code === currencyCode) || { code: 'USD', name: 'US Dollar', symbol: '$', isCrypto: false, decimalPlaces: 2 };
    const parsedAmount = parseFloat(amount);
    // Input validation is crucial.
    const isValidInput = !isNaN(parsedAmount) && parsedAmount > 0 && (selectedRecipient || recipientIdentifier);

    // --- Recipient Lookup with Debouncing ---
    // Replaced complex AI lookup with a simulated, debounced search against a local recipients list.
    // In a real app, this would call a dedicated search/validation API.
    useEffect(() => {
        const lookupRecipient = async () => {
            if (!recipientIdentifier) {
                setSelectedRecipient(null);
                setSecurityAudit(null); // Clear audit if identifier is removed.
                return;
            }
            
            // Simulate API call for recipient lookup and initial security assessment.
            // In production, this would be an API call to a backend service.
            console.log(`Simulating recipient lookup for: ${recipientIdentifier}`);
            await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network latency.

            const foundRecipient = recipients.find(r => 
                r.name.toLowerCase().includes(recipientIdentifier.toLowerCase()) || 
                r.id === recipientIdentifier ||
                r.legalEntityName?.toLowerCase().includes(recipientIdentifier.toLowerCase())
            );
            
            if (foundRecipient) {
                setSelectedRecipient(foundRecipient);
                // Simulate Security Audit based on recipient profile & transaction details.
                // This would typically involve a call to a dedicated security/compliance microservice.
                setSecurityAudit({
                    riskScore: foundRecipient.kycStatus === 'unverified' ? 60 : 25, // Higher risk if unverified
                    fraudProbability: foundRecipient.kycStatus === 'unverified' ? 0.05 : 0.01,
                    amlCompliance: foundRecipient.kycStatus === 'unverified' ? 'review' : 'pass',
                    sanctionScreening: 'pass', // Assume pass for simplicity, real system would integrate external checks.
                    recommendations: foundRecipient.kycStatus === 'unverified' ? ["Mandatory secondary review required."] : [],
                });
            } else {
                setSelectedRecipient(null);
                // For unknown recipients, simulate a preliminary audit.
                setSecurityAudit({
                    riskScore: 40, // Moderate risk for unknown entity
                    fraudProbability: 0.02,
                    amlCompliance: 'review', // Needs review
                    sanctionScreening: 'pass',
                    recommendations: ["Verify recipient identity and banking details thoroughly."],
                });
            }
        };
        // Debounce the lookup to avoid excessive calls during typing.
        const debounceLookup = setTimeout(lookupRecipient, 500);
        return () => clearTimeout(debounceLookup);
    }, [recipientIdentifier, recipients]); // Dependencies ensure re-run when identifier or recipient list changes.

    // --- Dynamic Settings Handlers ---
    const handleAdvancedSettingChange = useCallback((key: keyof AdvancedTransactionSettings, value: any) => {
        setAdvancedSettings(prev => {
            if (key === 'notificationPreferences') {
                // Ensure deep merge for notification preferences.
                return { ...prev, notificationPreferences: { ...prev.notificationPreferences, ...value } };
            }
            return { ...prev, [key]: value };
        });
    }, []);

    // --- Core Action Handlers ---
    const handleSendClick = () => {
        if (!isValidInput) {
            alert("Please enter a valid amount and recipient.");
            return;
        }

        if (currentStep === 1) {
            setCurrentStep(2); // Proceed to review step.
        } else if (currentStep === 2) {
            // Step 2: Review -> Trigger Biometric Authentication.
            // The biometric modal will handle the final transaction submission upon success.
            setShowBiometricModal(true);
        }
    };

    // Callback for when biometric authentication is successful.
    const handleBiometricSuccess = () => {
        // This is the critical point where the transaction is finalized.
        // It should call a robust backend API for transaction processing.
        // For this example, we simulate adding to local context and show confirmation.
        
        const finalRecipient = selectedRecipient || { id: 'external', name: recipientIdentifier }; // Use identifier if recipient not found.
        
        // Construct the transaction object.
        const newTx: Transaction = {
            id: `tx_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`, // Unique ID generation.
            type: 'debit', // Transaction type.
            category: 'External Transfer', // Simplified category.
            description: `Sent ${amount} ${currencyCode} to ${finalRecipient.name} via ${paymentMethod}.`, // Clear description.
            amount: parsedAmount,
            currency: currencyCode,
            date: new Date().toISOString(),
            status: 'Pending Confirmation', // Initial status.
            metadata: {
                paymentRail: paymentMethod,
                encryption: advancedSettings.dataEncryptionStandard,
                routeOptimization: advancedSettings.routeOptimizationPreference,
                recipientId: finalRecipient.id,
                recipientName: finalRecipient.name,
                // Add other relevant metadata here after backend integration.
            }
        };
        
        addTransaction(newTx); // Add to context (simulates backend call).
        setShowBiometricModal(false); // Close the modal.
        setCurrentStep(4); // Move to confirmation step.
    };

    // --- Render Functions for Each Step ---
    const renderStep1Input = () => (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Recipient Input */}
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Recipient Identifier (Name, ID, or Account Number)</label>
                    <input 
                        type="text" 
                        value={recipientIdentifier} 
                        onChange={e => setRecipientIdentifier(e.target.value)} 
                        className="w-full bg-gray-800 border border-cyan-600 rounded-lg p-3 text-white text-lg focus:ring-cyan-500 focus:border-cyan-500 transition shadow-sm" 
                        placeholder="Enter Recipient Name or Unique ID..." 
                    />
                    {selectedRecipient && (
                        <p className="text-xs mt-1 text-green-400">Found: {selectedRecipient.name} ({selectedRecipient.legalEntityName ? 'Business' : 'Individual'}) - KYC: {selectedRecipient.kycStatus}</p>
                    )}
                    {!selectedRecipient && recipientIdentifier && (
                         <p className="text-xs mt-1 text-yellow-400">Recipient not found in registry. Proceeding with external transfer protocols.</p>
                    )}
                </div>
                
                {/* Amount and Currency Input */}
                <div className="flex flex-col">
                    <label className="block text-sm font-medium text-gray-300 mb-1">Amount</label>
                    <div className="flex rounded-lg border border-cyan-600 overflow-hidden shadow-sm">
                        <input 
                            type="number" 
                            value={amount} 
                            onChange={e => setAmount(e.target.value)} 
                            className="w-2/3 bg-gray-800 border-r border-gray-700 p-3 text-white text-xl font-mono focus:ring-cyan-500 focus:border-cyan-500" 
                            placeholder="0.00" 
                            step={currentCurrency.isCrypto ? "0.00000001" : "0.01"}
                        />
                        <select 
                            value={currencyCode} 
                            onChange={e => setCurrencyCode(e.target.value)} 
                            className="w-1/3 bg-gray-700 p-3 text-white text-base appearance-none cursor-pointer focus:ring-cyan-500 focus:border-cyan-500"
                        >
                            {availableCurrencies.slice(0, 5).map(c => ( // Limit displayed currencies for simplicity
                                <option key={c.code} value={c.code}>{c.code}</option>
                            ))}
                            {/* Add more options or a searchable dropdown for production */}
                            <option disabled>...</option>
                            <option value="BTC">BTC</option>
                            <option value="ETH">ETH</option>
                        </select>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Payment Rail Selection */}
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Payment Rail</label>
                    <select 
                        value={paymentMethod} 
                        onChange={e => setPaymentMethod(e.target.value as PaymentRail)} 
                        className="w-full bg-gray-800 border border-cyan-600 rounded-lg p-3 text-white appearance-none cursor-pointer focus:ring-cyan-500 focus:border-cyan-500 shadow-sm"
                    >
                        <option value="quantumpay_stable">QuantumPay (Stable DLT)</option>
                        <option value="fedwire_rtgs">FedWire RTGS (USD High Value)</option>
                        <option value="blockchain_erc20">Blockchain (ETH/ERC20)</option>
                        <option value="swift_iso20022">SWIFT ISO 20022</option>
                        <option value="ripple_ledger">Ripple Ledger</option>
                        <option value="cashapp_v2">Cash App (v2)</option>
                    </select>
                </div>

                {/* Transaction Priority */}
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Transaction Priority</label>
                    <select 
                        value={advancedSettings.priority} 
                        onChange={e => handleAdvancedSettingChange('priority', e.target.value as AdvancedTransactionSettings['priority'])} 
                        className="w-full bg-gray-800 border border-cyan-600 rounded-lg p-3 text-white appearance-none cursor-pointer focus:ring-cyan-500 focus:border-cyan-500 shadow-sm"
                    >
                        <option value="high">High (Expedited)</option>
                        <option value="normal">Normal</option>
                        <option value="low">Low (Batch Processing)</option>
                    </select>
                </div>
            </div>

            {/* Display Security Audit Summary */}
            {securityAudit && (
                <div className="mt-6 p-4 bg-gray-800 rounded-xl border border-gray-700 shadow-sm space-y-3">
                    <h4 className="text-lg font-bold text-cyan-400 border-b border-gray-700 pb-2 flex justify-between items-center">
                        Security & Compliance Scan
                        <span className="text-xs text-gray-400">Status: {securityAudit.amlCompliance.toUpperCase()}</span>
                    </h4>
                    <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                        <p className="text-gray-400">Risk Score:</p><p className={`font-bold ${securityAudit.riskScore > 75 ? 'text-red-400' : securityAudit.riskScore > 40 ? 'text-yellow-400' : 'text-green-400'}`}>{securityAudit.riskScore}/100</p>
                        <p className="text-gray-400">Fraud Probability:</p><p className={`font-bold ${securityAudit.fraudProbability > 0.05 ? 'text-red-400' : 'text-green-400'}`}>{`${(securityAudit.fraudProbability * 100).toFixed(2)}%`}</p>
                        <p className="text-gray-400">Sanction Screening:</p><p className={securityAudit.sanctionScreening === 'fail' ? 'text-red-400 font-bold' : 'text-green-400 font-bold'}>{securityAudit.sanctionScreening.toUpperCase()}</p>
                    </div>
                    {securityAudit.recommendations.length > 0 && (
                        <div className="mt-3 p-3 bg-yellow-900/30 border border-yellow-600 rounded-lg text-sm">
                            <p className="font-bold text-yellow-300 mb-1">Recommendations ({securityAudit.recommendations.length}):</p>
                            <ul className="list-disc list-inside text-xs text-yellow-200 space-y-1">{securityAudit.recommendations.map((rec, i) => <li key={i}>{rec}</li>)}</ul>
                        </div>
                    )}
                </div>
            )}
        </div>
    );

    // Render function for the review step.
    const renderStep2Review = () => {
        const finalRecipient = selectedRecipient || { id: 'external', name: recipientIdentifier };
        // Ensure amount is formatted correctly based on currency decimal places.
        const formattedAmount = parsedAmount.toFixed(currentCurrency.decimalPlaces);
        
        return (
            <div className="space-y-5">
                {/* Transaction Summary Card */}
                <Card title="Transaction Summary">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <p className="text-gray-400 col-span-1 md:col-span-2">Recipient:</p>
                        <p className="font-semibold text-white col-span-1 md:col-span-2">{finalRecipient.name} {finalRecipient.legalEntityName && `(${finalRecipient.legalEntityName})`}</p>
                        
                        <p className="text-gray-400">Amount:</p>
                        <p className="text-3xl font-extrabold text-green-400">{currentCurrency.symbol}{formattedAmount} {currentCurrency.code}</p>
                        
                        <p className="text-gray-400">Settlement Rail:</p>
                        <p className="font-semibold text-white">{paymentMethod}</p>
                        
                        <p className="text-gray-400">Priority:</p>
                        <p className="font-semibold text-yellow-400">{advancedSettings.priority.toUpperCase()}</p>
                    </div>
                </Card>

                {/* Advanced Settings Overview */}
                <Card title="Advanced Protocol Configuration">
                    <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                        <p className="text-gray-400">Data Encryption:</p><p className="text-white">{advancedSettings.dataEncryptionStandard}</p>
                        <p className="text-gray-400">Route Optimization:</p><p className="text-white">{advancedSettings.routeOptimizationPreference}</p>
                        <p className="text-gray-400">Notifications:</p>
                        <p className="text-white">
                            {Object.entries(advancedSettings.notificationPreferences)
                                .filter(([key, enabled]) => enabled)
                                .map(([key]) => key.replace('_', ' ').toUpperCase())
                                .join(', ') || 'None'}
                        </p>
                    </div>
                </Card>

                {/* Conditional Warning for High Risk */}
                {securityAudit && securityAudit.riskScore > 50 && (
                    <div className="p-4 bg-red-900/40 border border-red-500 rounded-lg">
                        <p className="font-bold text-red-300">High Risk Detected ({securityAudit.riskScore}/100). Biometric Multi-Factor Authentication (MFA) is REQUIRED for transaction authorization.</p>
                    </div>
                )}
            </div>
        );
    };

    // Render function for the final confirmation step.
    const renderStep4Confirmation = () => (
        <div className="text-center p-10 bg-gray-800 rounded-xl border-2 border-green-500 shadow-lg animate-fade-in">
            <AnimatedCheckmarkIcon />
            <h3 className="text-4xl font-bold text-green-400 mt-6 mb-2">Transaction Successful</h3>
            <p className="text-xl text-white">Transfer processed and confirmation pending.</p>
            <p className="text-md text-gray-400 mt-3">Ledger Hash: <span className="font-mono text-sm bg-gray-700 p-1 rounded">{`0x${Math.random().toString(16).substring(2, 18)}...`}</span></p>
            <button 
                onClick={() => { 
                    // Reset state for a new transaction.
                    setCurrentStep(1); 
                    setAmount(''); 
                    setRecipientIdentifier(''); 
                    setSelectedRecipient(null);
                    setSecurityAudit(null);
                    setPaymentMethod('quantumpay_stable'); // Reset to default
                    setCurrencyCode('USD'); // Reset to default
                    setAdvancedSettings({ // Reset to defaults
                        priority: 'normal',
                        dataEncryptionStandard: 'aes256_gcm',
                        routeOptimizationPreference: 'speed',
                        notificationPreferences: { email: true, sms: false, push: true, dlt_confirmation: true }
                    });
                }} 
                className="mt-8 px-8 py-3 bg-cyan-600 hover:bg-cyan-500 rounded-full text-white font-bold transition transform hover:scale-[1.02] shadow-lg"
            >
                Initiate New Transfer
            </button>
        </div>
    );

    // Main content rendering based on current step.
    const renderContent = () => {
        switch (currentStep) {
            case 1: return renderStep1Input();
            case 2: return renderStep2Review();
            case 4: return renderStep4Confirmation(); // Skip step 3 in UI flow, handled by modal.
            default: return renderStep1Input(); // Fallback to step 1.
        }
    };

    // Button text logic.
    const getButtonText = () => {
        if (currentStep === 1) return "Review Transaction";
        if (currentStep === 2) return `Authorize & Send (${currentCurrency.symbol}${amount})`;
        if (currentStep === 4) return "Done";
        return "Next";
    };

    // Button disabled logic.
    const isButtonDisabled = !isValidInput && currentStep !== 4;

    return (
        <div className="max-w-4xl mx-auto p-6 bg-gray-900 rounded-2xl shadow-2xl border border-gray-700/50">
            <h1 className="text-4xl font-extrabold text-white mb-2 tracking-tighter">Nexus Pay Transfer</h1>
            <p className="text-cyan-400 mb-8 border-b border-gray-700 pb-3">Secure and efficient single-rail payment interface.</p>

            {/* Step Indicator Navigation */}
            {currentStep !== 4 && (
                <div className="flex justify-between mb-8 text-sm font-medium">
                    <div className={`flex-1 text-center py-2 rounded-l-lg ${currentStep >= 1 ? 'bg-cyan-700 text-white' : 'bg-gray-700 text-gray-400'}`}>1. Details</div>
                    <div className={`flex-1 text-center py-2 ${currentStep === 2 ? 'bg-cyan-700 text-white' : currentStep > 2 ? 'bg-green-700 text-white' : 'bg-gray-700 text-gray-400'}`}>2. Review</div>
                    <div className={`flex-1 text-center py-2 rounded-r-lg ${currentStep === 3 ? 'bg-purple-700 text-white' : 'bg-gray-700 text-gray-400'}`}>3. Authenticate</div>
                </div>
            )}

            {/* Content area for steps */}
            <Card title={currentStep === 1 ? "Step 1: Transaction Details" : currentStep === 2 ? "Step 2: Review & Confirm" : ""}>
                {renderContent()}
            </Card>

            {/* Action Buttons */}
            {currentStep !== 4 && (
                <div className="flex justify-end gap-4 mt-8">
                    {currentStep === 2 && (
                        <button 
                            onClick={() => setCurrentStep(1)} 
                            className="px-6 py-3 bg-gray-600 hover:bg-gray-500 rounded-xl text-white font-semibold transition shadow-md"
                        >
                            &larr; Back to Details
                        </button>
                    )}
                    
                    <button 
                        onClick={handleSendClick} 
                        disabled={isButtonDisabled || currentStep === 3} 
                        className={`px-8 py-3 rounded-xl text-white font-bold transition transform shadow-lg 
                            ${currentStep === 2 ? 'bg-red-600 hover:bg-red-500' : 'bg-cyan-600 hover:bg-cyan-500'} 
                            disabled:opacity-40 disabled:cursor-not-allowed
                            ${currentStep !== 2 && 'hover:scale-[1.02]'}
                            ${currentStep === 2 && 'hover:scale-[1.02]'}
                        `}
                    >
                        {getButtonText()}
                    </button>
                </div>
            )}

            {/* Biometric Modal Trigger */}
            <BiometricModal 
                isOpen={showBiometricModal} 
                onSuccess={handleBiometricSuccess} 
                onClose={() => setShowBiometricModal(false)} 
                amount={amount} 
                recipient={selectedRecipient || recipientIdentifier} 
                paymentMethod={paymentMethod} 
            />
            <style>{`.animate-fade-in { animation: fadeIn 0.5s ease-out; } @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }`}</style>
        </div>
    );
};

export default SendMoneyView;

================================================================================
// APPENDED FROM REPO: diplomat-bit/almost | ORIGINAL PATH: diplomat-bit-almost-93a5466/components/SendMoneyView (5).tsx
================================================================================

// components/views/personal/SendMoneyView.tsx
// This component manages the multi-step flow for sending money within a modern payment application.
// It focuses on clear, secure, and user-friendly transaction processing.

import React, { useState, useContext, useRef, useEffect, useReducer } from 'react';
import Card from './Card';
import { DataContext } from '../context/DataContext';
import { View } from '../types';
import type { Transaction } from '../types';

// ================================================================================================
// GLOBAL PLATFORM WIDE TYPE DEFINITIONS (SIMPLIFIED FOR CLARITY AND REALISM)
// ================================================================================================

export type PaymentRail = 'bank_transfer' | 'cashapp' | 'swift_global' | 'blockchain_transfer' | 'card_payment';
export type ScanState = 'scanning' | 'success' | 'verifying' | 'error';
export type TransactionStep = 'input' | 'review' | 'processing' | 'success';

export interface RecipientProfile {
  id: string;
  name: string;
  avatarUrl?: string;
  cashtag?: string;
  swiftDetails?: { bankName: string; bic: string; accountNumber: string; };
  blockchainAddress?: string;
  preferredCurrency?: string;
  lastUsedDate?: string;
  trustScore?: number;
  kycStatus?: 'verified' | 'pending' | 'unverified';
  blacklisted?: boolean;
  bankAccounts?: { bankName: string; accountNumber: string; routingNumber?: string; iban?: string; }[];
  eWalletDetails?: { type: 'paypal' | 'venmo' | 'zelle' | 'revolut' | 'cashapp'; identifier: string; }[];
  contactPreferences?: { email: boolean; sms: boolean; push: boolean; };
  relationshipStatus?: 'family' | 'friend' | 'business' | 'self' | 'vendor' | 'partner';
  category?: 'personal' | 'business' | 'charity' | 'government';
  multiEntitySupport?: { parentId: string; subEntities: { id: string; name: string; type: string; }[]; };
  complianceFlags?: ('high_risk' | 'sanctioned_entity' | 'PEP' | 'low_risk' | 'verified_entity')[];
  transactionHistorySummary?: { totalSent: number; totalReceived: number; lastTransaction: string; };
  riskProfile?: 'low' | 'medium' | 'high';
  preferredCommunicationChannel?: 'email' | 'sms' | 'push';
  assetPortfolioSummary?: { totalValue: number; assetClasses: string[]; };
  taxResidencies?: { country: string; taxId: string; }[];
  biometricDataHash?: string;
  lastKnownLocation?: { lat: number; lon: number; timestamp: string; };
}

export interface Currency {
  code: string;
  name: string;
  symbol: string;
  isCrypto: boolean;
  conversionRate?: number;
  decimalPlaces: number;
  minTransactionAmount?: number;
  maxTransactionAmount?: number;
  liquidityScore?: number;
  marketCap?: number;
  regulatoryStatus?: 'regulated' | 'unregulated' | 'experimental' | 'cbdc';
}

export interface ScheduledPaymentRule {
  frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'annually' | 'once_on_date';
  startDate: string;
  endDate?: string;
  nextExecutionDate?: string;
  maxExecutions?: number;
  paymentReason?: string;
  notificationOnExecution?: boolean;
}

export interface AdvancedTransactionSettings {
  priority: 'low' | 'normal' | 'high';
  carbonOffsetRatio: number;
  privacyLevel: 'standard' | 'enhanced';
  receiptPreference: 'email' | 'blockchain_proof';
  notificationPreferences: { email: boolean; sms: boolean; push: boolean; };
  dataEncryptionStandard: 'aes256';
  routeOptimizationPreference: 'speed' | 'cost' | 'standard';
  transactionExpiryMinutes?: number;
  regulatoryReportingFlags?: ('FATCA' | 'CRS' | 'AML' | 'CFT' | 'none')[];
}

export interface SecurityAuditResult {
  riskScore: number;
  fraudProbability: number;
  amlCompliance: 'pass' | 'fail' | 'review';
  sanctionScreening: 'pass' | 'fail';
  recommendations: string[];
}

export interface EnvironmentalImpactReport {
    transactionCO2e: number;
    offsetCO2e: number;
    netCO2e: number;
    renewableEnergyUsedPercentage: number;
    recommendations?: string[];
    sustainabilityRating?: 'A' | 'B' | 'C' | 'D' | 'F';
}

export interface RailSpecificDetails {
    swift?: { bankName: string; bic: string; accountNumber: string; beneficiaryAddress: string; intermediaryBankBic?: string; purposeCode?: string; };
    blockchain?: { network: 'ethereum' | 'polygon' | 'solana' | 'other_dlt'; dataPayload?: string; };
}

export interface TransactionSimulationResult {
    expectedArrivalTime: string;
    estimatedFee: number;
    successProbability: number;
}

interface SendMoneyViewProps {
  setActiveView: (view: View) => void;
}

// ================================================================================================
// ANIMATED UI SUB-COMPONENTS (SIMPLIFIED)
// ================================================================================================

export const AnimatedCheckmarkIcon: React.FC = () => (
    <>
        <svg className="h-24 w-24 transform scale-125" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
            <defs>
                <linearGradient id="checkmarkGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#4ade80" />
                    <stop offset="100%" stopColor="#22c55e" />
                </linearGradient>
            </defs>
            <circle className="checkmark__circle" cx="26" cy="26" r="25" fill="none" stroke="url(#checkmarkGradient)" />
            <path className="checkmark__check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" />
        </svg>
        <style>{`
            .checkmark__circle { stroke-dasharray: 166; stroke-dashoffset: 166; stroke-width: 4; stroke-miterlimit: 10; fill: none; animation: stroke-circle 0.6s cubic-bezier(0.65, 0, 0.45, 1) forwards; }
            .checkmark__check { transform-origin: 50% 50%; stroke-dasharray: 48; stroke-dashoffset: 48; stroke-width: 5; stroke: #fff; animation: stroke-check 0.3s cubic-bezier(0.65, 0, 0.45, 1) 0.8s forwards; }
            @keyframes stroke-circle { 100% { stroke-dashoffset: 0; } }
            @keyframes stroke-check { 100% { stroke-dashoffset: 0; } }
        `}</style>
    </>
);

export const ProcessingAnimation: React.FC = () => (
    <div className="flex flex-col items-center justify-center space-y-3">
        <div className="relative w-20 h-20 rounded-full flex items-center justify-center border-2 border-blue-500 animate-spin">
            <div className="w-12 h-12 rounded-full border-2 border-blue-400 animate-ping"></div>
            <div className="absolute w-6 h-6 bg-blue-600 rounded-full animate-pulse"></div>
        </div>
        <p className="text-sm text-blue-300 animate-fade-in-out">Processing Transaction...</p>
    </div>
);


export const SecurityAuditDisplay: React.FC<{ auditResult: SecurityAuditResult | null }> = ({ auditResult }) => {
    if (!auditResult) return <div className="flex items-center space-x-2 text-yellow-400"><svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg><span>Performing real-time security audit...</span></div>;

    return (
        <div className="bg-gray-800 p-4 rounded-lg space-y-2 border border-gray-700">
            <h4 className="font-semibold text-lg text-white">Security Audit Report</h4>
            <div className="grid grid-cols-2 gap-2 text-sm">
                <p className="text-gray-400">Risk Score:</p><p className={`${auditResult.riskScore > 50 ? 'text-red-400' : 'text-green-400'}`}>{auditResult.riskScore}/100</p>
                <p className="text-gray-400">Fraud Probability:</p><p className={`${(auditResult.fraudProbability * 100).toFixed(2)}%`}</p>
                <p className="text-gray-400">AML Compliance:</p><p className={auditResult.amlCompliance === 'pass' ? 'text-green-400' : 'text-yellow-400'}>{auditResult.amlCompliance}</p>
            </div>
            {auditResult.recommendations.length > 0 && (
                <div className="mt-2 text-sm text-yellow-300">
                    <p className="font-medium">Recommendations:</p>
                    <ul className="list-disc list-inside text-xs text-yellow-200">{auditResult.recommendations.map((rec, i) => <li key={i}>{rec}</li>)}</ul>
                </div>
            )}
        </div>
    );
};

export const BiometricModal: React.FC<{
    isOpen: boolean; onSuccess: () => void; onClose: () => void; amount: string; recipient: RecipientProfile | string; paymentMethod: PaymentRail; securityContext: 'personal' | 'corporate' | 'regulatory'; mfAuthMethods?: ('fingerprint' | 'face')[]; approvalRequiredBy?: string[];
}> = ({ isOpen, onSuccess, onClose, amount, recipient, paymentMethod, securityContext, mfAuthMethods = ['fingerprint'], approvalRequiredBy }) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [scanState, setScanState] = useState<ScanState>('scanning');
    const [verificationStep, setVerificationStep] = useState(0);
    const [biometricProgress, setBiometricProgress] = useState(0);
    const [activeAuthMethod, setActiveAuthMethod] = useState(mfAuthMethods[0] || 'face');
    const recipientName = typeof recipient === 'string' ? recipient : recipient.name;

    const verificationMessages = [ `Initializing secure channel with ${paymentMethod}...`, `Validating ${recipientName}'s identity...`, 'Cross-referencing fraud ledgers...', 'Executing on ledger...', 'Confirming consensus...', 'Archiving proof...', 'Final checks...' ];

    useEffect(() => {
        if (!isOpen) { setScanState('scanning'); setVerificationStep(0); setBiometricProgress(0); return; }
        let stream: MediaStream | null = null;
        const startCamera = async () => {
            try { if (activeAuthMethod === 'face') { stream = await navigator.mediaDevices.getUserMedia({ video: true }); if (videoRef.current) videoRef.current.srcObject = stream; } } catch (err) { setScanState('error'); }
        };
        startCamera();
        const scanProgressInterval = setInterval(() => setBiometricProgress(prev => Math.min(prev + Math.random() * 10, 100)), 200);
        const successTimer = setTimeout(() => { setScanState('success'); clearInterval(scanProgressInterval); }, 3000);
        const verifyTimer = setTimeout(() => setScanState('verifying'), 4000);
        const successActionTimer = setTimeout(onSuccess, 8000); // Reduced total time
        return () => { clearTimeout(successTimer); clearTimeout(verifyTimer); clearTimeout(successActionTimer); if (stream) stream.getTracks().forEach(track => track.stop()); clearInterval(scanProgressInterval); };
    }, [isOpen, onSuccess, onClose, activeAuthMethod]);

    useEffect(() => {
        if (['verifying'].includes(scanState)) {
            const interval = setInterval(() => setVerificationStep(prev => Math.min(prev + 1, verificationMessages.length - 1)), 1000); // Faster verification steps
            return () => clearInterval(interval);
        }
    }, [scanState]);

    const getTitle = () => {
        switch (scanState) {
            case 'scanning': return `Scanning ${activeAuthMethod === 'face' ? 'Face' : 'Biometrics'}`;
            case 'success': return 'Identity Confirmed';
            case 'verifying': return 'Verification in Progress';
            case 'error': return 'Verification Failed';
        }
    };

    return (
        <div className={`fixed inset-0 bg-black/80 flex items-end sm:items-center justify-center z-50 backdrop-blur-lg transition-opacity duration-500 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
            <div className={`bg-gray-900 rounded-3xl p-8 max-w-lg w-full text-center border-2 border-blue-700 shadow-xl transition-transform duration-500 ${isOpen ? 'translate-y-0 scale-100' : 'translate-y-full scale-90'}`}>
                <h3 className="text-3xl font-extrabold text-white mb-4">{getTitle()}</h3>
                <div className="relative w-72 h-72 mx-auto rounded-full overflow-hidden border-4 border-blue-600 mb-6 shadow-lg">
                    {activeAuthMethod === 'face' ? <video ref={videoRef} autoPlay muted playsInline className="absolute top-0 left-0 w-full h-full object-cover transform scale-x-[-1]"></video> : <div className="absolute inset-0 flex items-center justify-center bg-gray-950 text-gray-500 text-lg"><p>Authenticating {activeAuthMethod}...</p></div>}
                    {scanState === 'scanning' && <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-400/50 to-transparent animate-[scanner-line_2.5s_ease-in-out_infinite_alternate]"></div>}
                    {scanState === 'success' && <div className="absolute inset-0 bg-green-500/50 flex items-center justify-center"><AnimatedCheckmarkIcon /></div>}
                    {scanState === 'verifying' && <div className="absolute inset-0 bg-black/50 flex items-center justify-center"><ProcessingAnimation /></div>}
                </div>
                {scanState === 'scanning' && <div className="w-full bg-gray-700 rounded-full h-2.5 mb-4"><div className="bg-blue-500 h-2.5 rounded-full" style={{ width: `${biometricProgress}%` }}></div></div>}
                <p className="text-gray-300 mt-2 text-md">{['verifying'].includes(scanState) ? verificationMessages[verificationStep] : `Sending $${amount} to ${recipientName}`}</p>
            </div>
            <style>{`@keyframes scanner-line { 0% { transform: translate(-50%, 0) scaleX(0.2); opacity: 0;} 20% {transform: translate(-50%, 25%) scaleX(1); opacity: 1;} 80% {transform: translate(-50%, 75%) scaleX(1); opacity: 1;} 100%{transform: translate(-50%, 100%) scaleX(0.2); opacity: 0;}}`}</style>
        </div>
    );
};

// ================================================================================================
// MAIN VIEW COMPONENT (RE-ARCHITECTED WITH useReducer and Multi-Step Flow)
// ================================================================================================

type State = {
    step: TransactionStep;
    amount: string;
    recipientName: string;
    paymentMethod: PaymentRail;
    advancedSettings: AdvancedTransactionSettings;
    securityAudit: SecurityAuditResult | null;
    showBiometricModal: boolean;
    lastTransactionId: string | null;
};

type Action =
    | { type: 'SET_FIELD'; field: keyof State; payload: any }
    | { type: 'SET_ADVANCED_SETTING'; field: keyof AdvancedTransactionSettings; payload: any }
    | { type: 'NEXT_STEP' }
    | { type: 'PREVIOUS_STEP' }
    | { type: 'INITIATE_SEND' }
    | { type: 'TRANSACTION_SUCCESS'; payload: string }
    | { type: 'RESET' };

const initialState: State = {
    step: 'input',
    amount: '',
    recipientName: '',
    paymentMethod: 'bank_transfer',
    advancedSettings: {
        priority: 'normal',
        carbonOffsetRatio: 0,
        privacyLevel: 'standard',
        receiptPreference: 'email',
        notificationPreferences: { email: true, sms: false, push: true },
        dataEncryptionStandard: 'aes256',
        routeOptimizationPreference: 'speed',
    },
    securityAudit: null,
    showBiometricModal: false,
    lastTransactionId: null,
};

function transactionReducer(state: State, action: Action): State {
    switch (action.type) {
        case 'SET_FIELD':
            return { ...state, [action.field]: action.payload };
        case 'SET_ADVANCED_SETTING':
            return { ...state, advancedSettings: { ...state.advancedSettings, [action.field]: action.payload } };
        case 'NEXT_STEP':
            if (state.step === 'input') return { ...state, step: 'review' };
            return state;
        case 'PREVIOUS_STEP':
            if (state.step === 'review') return { ...state, step: 'input' };
            return state;
        case 'INITIATE_SEND':
            return { ...state, step: 'processing', showBiometricModal: true };
        case 'TRANSACTION_SUCCESS':
            return { ...state, step: 'success', showBiometricModal: false, lastTransactionId: action.payload };
        case 'RESET':
            return { ...initialState };
        default:
            return state;
    }
}

const SendMoneyView: React.FC<SendMoneyViewProps> = ({ setActiveView }) => {
    const context = useContext(DataContext);
    if (!context) throw new Error("SendMoneyView must be used within a DataProvider");
    const { addTransaction } = context;

    const [state, dispatch] = useReducer(transactionReducer, initialState);
    const { step, amount, recipientName, paymentMethod, securityAudit, showBiometricModal } = state;

    useEffect(() => {
        const auditTimeout = setTimeout(() => {
            if (parseFloat(amount) > 0 && recipientName) {
                dispatch({
                    type: 'SET_FIELD',
                    field: 'securityAudit',
                    payload: {
                        riskScore: parseFloat(amount) > 5000 ? 60 : 10,
                        fraudProbability: 0.05,
                        amlCompliance: 'pass',
                        sanctionScreening: 'pass',
                        recommendations: parseFloat(amount) > 5000 ? ["High value. Verify recipient details."] : [],
                    }
                });
            }
        }, 800);
        return () => clearTimeout(auditTimeout);
    }, [amount, recipientName]);

    const handleSuccess = () => {
        const newTxId = `tx_${Date.now()}`;
        const newTx: Transaction = {
            id: newTxId,
            type: 'expense',
            category: 'Transfer',
            description: `Sent to ${recipientName} via ${paymentMethod}`,
            amount: parseFloat(amount),
            date: new Date().toISOString().split('T')[0],
            carbonFootprint: 0.5,
            metadata: {
                rail: paymentMethod,
                ...state.advancedSettings
            }
        };
        addTransaction(newTx);
        dispatch({ type: 'TRANSACTION_SUCCESS', payload: newTxId });
    };

    const renderStep = () => {
        switch (step) {
            case 'input':
                return (
                    <>
                        <div>
                            <label className="block text-sm font-medium text-gray-400">Recipient</label>
                            <input type="text" value={recipientName} onChange={e => dispatch({ type: 'SET_FIELD', field: 'recipientName', payload: e.target.value })} className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-white" placeholder="Name, @tag, or ID" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-400">Amount</label>
                            <input type="number" value={amount} onChange={e => dispatch({ type: 'SET_FIELD', field: 'amount', payload: e.target.value })} className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-white" placeholder="0.00" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-400">Payment Method</label>
                            <select value={paymentMethod} onChange={e => dispatch({ type: 'SET_FIELD', field: 'paymentMethod', payload: e.target.value as PaymentRail })} className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-white">
                                <option value="bank_transfer">Bank Transfer</option>
                                <option value="cashapp">Cash App</option>
                                <option value="swift_global">SWIFT Global</option>
                                <option value="blockchain_transfer">Blockchain Transfer</option>
                                <option value="card_payment">Card Payment</option>
                            </select>
                        </div>
                        <SecurityAuditDisplay auditResult={securityAudit} />
                    </>
                );
            case 'review':
                return (
                    <div className="space-y-3 text-gray-300 p-4 bg-gray-800 rounded-lg">
                        <h3 className="text-xl font-bold text-white mb-2">Review Transaction Details</h3>
                        <div className="flex justify-between"><span className="font-semibold text-gray-400">To:</span> <span>{recipientName}</span></div>
                        <div className="flex justify-between"><span className="font-semibold text-gray-400">Amount:</span> <span className="text-blue-400 font-bold text-lg">${amount}</span></div>
                        <div className="flex justify-between"><span className="font-semibold text-gray-400">Method:</span> <span>{paymentMethod}</span></div>
                        <div className="flex justify-between"><span className="font-semibold text-gray-400">Priority:</span> <span>{state.advancedSettings.priority}</span></div>
                        <p className="text-sm text-yellow-400 pt-2 border-t border-gray-700">Estimated Time: Instant (most rails)</p>
                    </div>
                );
            case 'success':
                return (
                    <div className="text-center p-6 bg-gray-800 rounded-lg">
                        <AnimatedCheckmarkIcon />
                        <h3 className="text-2xl font-bold text-green-400 mt-4">Transaction Successful</h3>
                        <p className="text-gray-300 mt-2">Your payment to {recipientName} has been sent.</p>
                        <p className="text-xs text-gray-500 mt-4">Transaction ID: {state.lastTransactionId}</p>
                        <button onClick={() => dispatch({ type: 'RESET' })} className="mt-6 px-6 py-2 bg-blue-600 hover:bg-blue-500 rounded text-white font-bold">
                            New Transaction
                        </button>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold text-white tracking-wider">Secure Payments Portal</h2>
            <Card title={step === 'input' ? "Initiate Transfer" : step === 'review' ? "Review Transaction" : "Transaction Complete"}>
                <div className="space-y-4">
                    {renderStep()}
                    
                    {step !== 'success' && (
                        <div className="flex justify-end gap-3 mt-6">
                            {step === 'review' && <button onClick={() => dispatch({ type: 'PREVIOUS_STEP' })} className="px-4 py-2 bg-gray-600 rounded text-white">Back</button>}
                            <button 
                                onClick={() => step === 'input' ? dispatch({ type: 'NEXT_STEP' }) : dispatch({ type: 'INITIATE_SEND' })} 
                                disabled={!amount || !recipientName} 
                                className="px-6 py-2 bg-blue-600 hover:bg-blue-500 rounded text-white font-bold disabled:opacity-50"
                            >
                                {step === 'input' ? "Review" : "Confirm & Send"}
                            </button>
                        </div>
                    )}
                </div>
            </Card>
            <BiometricModal 
                isOpen={showBiometricModal} 
                onSuccess={handleSuccess} 
                onClose={() => dispatch({ type: 'SET_FIELD', field: 'showBiometricModal', payload: false })} 
                amount={amount} 
                recipient={recipientName} 
                paymentMethod={paymentMethod} 
                securityContext="personal" 
            />
        </div>
    );
};

export default SendMoneyView;

================================================================================
// APPENDED FROM REPO: diplomat-bit/almost | ORIGINAL PATH: diplomat-bit-almost-93a5466/components/SendMoneyView.tsx
================================================================================

import React, { useState, useContext, useEffect, useRef, useMemo, useCallback } from 'react';
import { 
  Send, 
  Zap, 
  ShieldCheck, 
  Database, 
  History, 
  Terminal, 
  MessageSquare, 
  Cpu, 
  Lock, 
  Activity, 
  Globe, 
  Layers, 
  BarChart3, 
  AlertTriangle, 
  Fingerprint, 
  Eye, 
  RefreshCcw,
  ChevronRight,
  Search,
  Filter,
  Download,
  Settings,
  UserCheck,
  FileText,
  ArrowUpRight,
  ArrowDownLeft,
  PieChart,
  ShieldAlert
} from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import Card from './Card';
import { DataContext } from '../context/DataContext';
import { View, PaymentRail, Transaction } from '../types';
import { BiometricModal, SecurityAuditDisplay, SecurityAuditResult } from './payment-components';

/**
 * QUANTUM FINANCIAL - ELITE BUSINESS DEMO ENGINE
 * VERSION: 4.0.1-PROD
 * 
 * PHILOSOPHY: 
 * - "Golden Ticket" Experience.
 * - High-Performance, Secure, Elite.
 * - No Pressure "Test Drive" Environment.
 * - Full Audit Traceability.
 * - AI-First Orchestration.
 */

// ================================================================================================
// TYPE DEFINITIONS & INTERFACES
// ================================================================================================

interface AuditEntry {
  id: string;
  timestamp: string;
  action: string;
  actor: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  metadata: any;
  hash: string; // Simulated blockchain hash
}

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  isExecuting?: boolean;
}

interface FraudSignal {
  id: string;
  type: string;
  strength: number;
  status: 'MONITORING' | 'FLAGGED' | 'CLEARED';
}

// ================================================================================================
// CONSTANTS & CONFIGURATION
// ================================================================================================

const SYSTEM_PROMPT = `
You are the Quantum Financial AI Strategist, the core intelligence of "The Demo Bank". 
Your goal is to provide a "Golden Ticket" experience for elite business clients.
You are professional, high-performance, and secure.

CAPABILITIES:
1. You can help users fill out the payment form.
2. You can analyze transaction risks.
3. You can explain complex financial rails (Wire, ACH, Quantum).
4. You can trigger UI actions by including a JSON block in your response.

JSON COMMAND STRUCTURE:
If the user wants to set a value, include:
{ "command": "SET_FORM", "data": { "recipient": "Name", "amount": 1000, "rail": "quantumpay" } }

If the user wants to navigate:
{ "command": "NAVIGATE", "data": { "view": "dashboard" } }

IMPORTANT: 
- DO NOT use the name "Citibank". Use "Quantum Financial" or "The Demo Bank".
- Be helpful but maintain an elite, professional tone.
- You are part of a "Test Drive" experience. Encourage the user to "kick the tires".
`;

// ================================================================================================
// UTILITY FUNCTIONS
// ================================================================================================

const generateHash = () => Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

const formatCurrency = (val: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);

// ================================================================================================
// SUB-COMPONENTS (MONOLITHIC ARCHITECTURE)
// ================================================================================================

/**
 * AuditLedger: Displays the immutable log of all sensitive actions.
 */
const AuditLedger: React.FC<{ logs: AuditEntry[] }> = ({ logs }) => (
  <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
    {logs.map((log) => (
      <div key={log.id} className="p-3 bg-black/40 border border-gray-800 rounded-lg flex flex-col gap-1 group hover:border-cyan-500/50 transition-colors">
        <div className="flex justify-between items-center">
          <span className={`text-[9px] font-bold px-2 py-0.5 rounded ${
            log.severity === 'CRITICAL' ? 'bg-red-500/20 text-red-400' : 
            log.severity === 'HIGH' ? 'bg-orange-500/20 text-orange-400' : 'bg-gray-800 text-gray-400'
          }`}>
            {log.severity}
          </span>
          <span className="text-[9px] font-mono text-gray-600">{log.timestamp}</span>
        </div>
        <p className="text-xs text-gray-300 font-medium">{log.action}</p>
        <div className="flex items-center gap-2 mt-1">
          <Database size={10} className="text-gray-600" />
          <span className="text-[8px] font-mono text-gray-600 truncate">HASH: {log.hash}</span>
        </div>
      </div>
    ))}
  </div>
);

/**
 * SecurityEngine: Visualizes real-time fraud monitoring.
 */
const SecurityEngine: React.FC = () => {
  const [signals, setSignals] = useState<FraudSignal[]>([
    { id: '1', type: 'IP_GEOLOCATION', strength: 0.98, status: 'CLEARED' },
    { id: '2', type: 'VELOCITY_CHECK', strength: 0.85, status: 'MONITORING' },
    { id: '3', type: 'BEHAVIORAL_BIOMETRICS', strength: 0.99, status: 'CLEARED' },
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setSignals(prev => prev.map(s => ({
        ...s,
        strength: Math.min(1, Math.max(0.7, s.strength + (Math.random() - 0.5) * 0.05))
      })));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-4">
      {signals.map(signal => (
        <div key={signal.id} className="space-y-1">
          <div className="flex justify-between text-[10px] font-black text-gray-500 uppercase tracking-widest">
            <span>{signal.type}</span>
            <span className="text-cyan-400">{(signal.strength * 100).toFixed(1)}%</span>
          </div>
          <div className="h-1 w-full bg-gray-900 rounded-full overflow-hidden">
            <div 
              className="h-full bg-cyan-500 transition-all duration-1000" 
              style={{ width: `${signal.strength * 100}%` }}
            />
          </div>
        </div>
      ))}
      <div className="pt-2 flex items-center gap-2 text-[10px] text-emerald-400 font-bold uppercase">
        <ShieldCheck size={14} /> All Systems Nominal
      </div>
    </div>
  );
};

// ================================================================================================
// MAIN COMPONENT: SendMoneyView
// ================================================================================================

const SendMoneyView: React.FC = () => {
  const context = useContext(DataContext);
  if (!context) throw new Error("SendMoneyView must be used within a DataProvider");
  
  const { addTransaction, setActiveView } = context;

  // --- FORM STATE ---
  const [amount, setAmount] = useState('');
  const [recipientName, setRecipientName] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentRail>('quantumpay');
  const [memo, setMemo] = useState('');
  const [currentStep, setCurrentStep] = useState(1);
  
  // --- UI STATE ---
  const [showBiometricModal, setShowBiometricModal] = useState(false);
  const [securityAudit, setSecurityAudit] = useState<SecurityAuditResult | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeTab, setActiveTab] = useState<'form' | 'analytics' | 'audit'>('form');
  
  // --- AUDIT STATE ---
  const [auditTrail, setAuditTrail] = useState<AuditEntry[]>([]);
  
  // --- AI CHAT STATE ---
  const [chatInput, setChatInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    { 
      id: '1', 
      role: 'assistant', 
      content: "Welcome to the Quantum Financial Test Drive. I am your AI Strategist. How can I assist with your capital deployment today?", 
      timestamp: new Date().toLocaleTimeString() 
    }
  ]);
  const [isAiTyping, setIsAiTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // --- INITIALIZATION ---
  useEffect(() => {
    logAuditAction('SESSION_START', 'SYSTEM', 'LOW', { view: 'SendMoneyView' });
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // --- AUDIT LOGGING LOGIC ---
  const logAuditAction = (action: string, actor: string, severity: AuditEntry['severity'], metadata: any) => {
    const newEntry: AuditEntry = {
      id: `audit_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      timestamp: new Date().toISOString(),
      action,
      actor,
      severity,
      metadata,
      hash: generateHash()
    };
    setAuditTrail(prev => [newEntry, ...prev]);
    console.log(`[AUDIT_LOG] ${action}`, newEntry);
  };

  // --- AI INTEGRATION ---
  const handleAiChat = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!chatInput.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: chatInput,
      timestamp: new Date().toLocaleTimeString()
    };

    setMessages(prev => [...prev, userMsg]);
    setChatInput('');
    setIsAiTyping(true);
    logAuditAction('AI_QUERY', 'USER', 'LOW', { query: chatInput });

    try {
      // Initialize Gemini
      const genAI = new GoogleGenAI(process.env.GEMINI_API_KEY || "");
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      const chat = model.startChat({
        history: messages.map(m => ({
          role: m.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: m.content }],
        })),
        generationConfig: {
          maxOutputTokens: 500,
        },
      });

      const result = await chat.sendMessage(`${SYSTEM_PROMPT}\n\nUser Input: ${chatInput}`);
      const responseText = result.response.text();

      // Parse for commands
      const commandMatch = responseText.match(/\{.*\}/s);
      if (commandMatch) {
        try {
          const commandData = JSON.parse(commandMatch[0]);
          handleAiCommand(commandData);
        } catch (err) {
          console.error("Failed to parse AI command", err);
        }
      }

      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: responseText.replace(/\{.*\}/s, '').trim(),
        timestamp: new Date().toLocaleTimeString()
      };

      setMessages(prev => [...prev, aiMsg]);
    } catch (error) {
      console.error("AI Error:", error);
      setMessages(prev => [...prev, {
        id: 'err',
        role: 'assistant',
        content: "I apologize, but my neural link is experiencing interference. Please proceed with manual entry.",
        timestamp: new Date().toLocaleTimeString()
      }]);
    } finally {
      setIsAiTyping(false);
    }
  };

  const handleAiCommand = (cmd: any) => {
    logAuditAction('AI_COMMAND_EXECUTION', 'AI_CORE', 'MEDIUM', cmd);
    if (cmd.command === 'SET_FORM') {
      if (cmd.data.recipient) setRecipientName(cmd.data.recipient);
      if (cmd.data.amount) setAmount(cmd.data.amount.toString());
      if (cmd.data.rail) setPaymentMethod(cmd.data.rail);
    } else if (cmd.command === 'NAVIGATE') {
      setActiveView(cmd.data.view as View);
    }
  };

  // --- PAYMENT LOGIC ---
  useEffect(() => {
    const auditTimeout = setTimeout(() => {
      if (parseFloat(amount) > 0 && recipientName) {
        const score = parseFloat(amount) > 10000 ? 75 : 12;
        setSecurityAudit({
          riskScore: score,
          fraudProbability: score / 1000,
          amlCompliance: 'pass',
          sanctionScreening: 'pass',
          quantumSignatureIntegrity: 'verified',
          recommendations: score > 50 ? ["Enhanced monitoring required", "Verify recipient via secondary channel"] : ["Optimal route confirmed"],
          complianceAlerts: [],
          threatVectorAnalysis: []
        });
        if (score > 50) {
          logAuditAction('HIGH_RISK_DETECTION', 'SECURITY_ENGINE', 'HIGH', { amount, recipientName, score });
        }
      } else {
        setSecurityAudit(null);
      }
    }, 800);
    return () => clearTimeout(auditTimeout);
  }, [amount, recipientName]);

  const handleSendClick = () => {
    if (currentStep === 1) {
      logAuditAction('PAYMENT_REVIEW_INITIATED', 'USER', 'LOW', { amount, recipientName, rail: paymentMethod });
      setCurrentStep(2);
    } else if (currentStep === 2) {
      setShowBiometricModal(true);
    }
  };

  const handleSuccess = async () => {
    setIsProcessing(true);
    logAuditAction('PAYMENT_AUTHORIZED', 'USER', 'HIGH', { amount, recipientName, method: 'BIOMETRIC' });
    
    // Simulate network latency for "Elite" feel
    await new Promise(resolve => setTimeout(resolve, 2000));

    const newTx: Transaction = {
      id: `tx_${Date.now()}`,
      type: 'expense',
      category: 'Transfer',
      description: `Quantum Transfer to ${recipientName}`,
      amount: parseFloat(amount),
      date: new Date().toISOString().split('T')[0],
      metadata: {
        rail: paymentMethod,
        memo: memo,
        audit_hash: generateHash()
      }
    };

    await addTransaction(newTx);
    logAuditAction('TRANSACTION_FINALIZED', 'LEDGER', 'MEDIUM', { txId: newTx.id });
    
    setShowBiometricModal(false);
    setIsProcessing(false);
    setActiveView(View.Dashboard);
  };

  // ================================================================================================
  // RENDER LOGIC
  // ================================================================================================

  return (
    <div className="min-h-screen bg-[#050505] text-gray-200 font-sans selection:bg-cyan-500/30">
      <div className="max-w-[1600px] mx-auto p-6 lg:p-10 space-y-8 animate-in fade-in duration-700">
        
        {/* ELITE HEADER */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end border-b border-gray-800/50 pb-8 gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-cyan-500 rounded-lg shadow-[0_0_20px_rgba(6,182,212,0.5)]">
                <Layers className="text-black" size={24} />
              </div>
              <h2 className="text-4xl font-black text-white tracking-tighter uppercase italic">
                Quantum <span className="text-cyan-500">Financial</span>
              </h2>
            </div>
            <p className="text-gray-500 text-xs font-mono tracking-[0.3em] uppercase flex items-center gap-2">
              <Activity size={12} className="text-emerald-500 animate-pulse" /> 
              System Status: Optimal // Node: Global_Nexus_01
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <div className="px-4 py-2 bg-gray-900/50 border border-gray-800 rounded-xl flex items-center gap-3 group hover:border-cyan-500/50 transition-all cursor-help">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-ping" />
              <div className="text-left">
                <p className="text-[8px] font-black text-gray-500 uppercase tracking-widest">Liquidity Pool</p>
                <p className="text-xs font-mono text-white">$2.45B Available</p>
              </div>
            </div>
            <div className="px-4 py-2 bg-gray-900/50 border border-gray-800 rounded-xl flex items-center gap-3 group hover:border-cyan-500/50 transition-all">
              <Globe size={16} className="text-cyan-500" />
              <div className="text-left">
                <p className="text-[8px] font-black text-gray-500 uppercase tracking-widest">Global Rails</p>
                <p className="text-xs font-mono text-white">182 Countries Active</p>
              </div>
            </div>
          </div>
        </header>

        {/* MAIN GRID */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
          
          {/* LEFT COLUMN: PAYMENT CONSOLE */}
          <div className="xl:col-span-8 space-y-8">
            
            {/* NAVIGATION TABS */}
            <div className="flex gap-1 p-1 bg-gray-900/50 border border-gray-800 rounded-2xl w-fit">
              {[
                { id: 'form', label: 'Transfer Portal', icon: Send },
                { id: 'analytics', label: 'Market Intelligence', icon: BarChart3 },
                { id: 'audit', label: 'Immutable Ledger', icon: Database },
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id as any);
                    logAuditAction('TAB_SWITCH', 'USER', 'LOW', { to: tab.id });
                  }}
                  className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${
                    activeTab === tab.id 
                      ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-600/20' 
                      : 'text-gray-500 hover:text-gray-300 hover:bg-gray-800'
                  }`}
                >
                  <tab.icon size={14} />
                  {tab.label}
                </button>
              ))}
            </div>

            {activeTab === 'form' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* PRIMARY FORM */}
                <div className="space-y-6">
                  <Card 
                    title={currentStep === 1 ? "Initiate Capital Flow" : "Security Verification"}
                    subtitle="Precision-engineered payment orchestration"
                  >
                    <div className="space-y-6 pt-4">
                      {currentStep === 1 ? (
                        <>
                          <div className="space-y-2">
                            <label className="block text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] ml-1">Recipient Identifier</label>
                            <div className="relative group">
                              <input 
                                type="text" 
                                value={recipientName} 
                                onChange={e => setRecipientName(e.target.value)} 
                                className="w-full bg-black/60 border border-gray-800 rounded-2xl p-4 text-white focus:ring-2 focus:ring-cyan-500/50 border-gray-700 outline-none font-mono text-lg transition-all group-hover:border-gray-600" 
                                placeholder="Entity Name or Wallet ID" 
                              />
                              <UserCheck className="absolute right-4 top-4 text-gray-700 group-focus-within:text-cyan-500 transition-colors" size={20} />
                            </div>
                          </div>

                          <div className="space-y-2">
                            <label className="block text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] ml-1">Magnitude (USD)</label>
                            <div className="relative group">
                              <input 
                                type="number" 
                                value={amount} 
                                onChange={e => setAmount(e.target.value)} 
                                className="w-full bg-black/60 border border-gray-800 rounded-2xl p-5 text-white focus:ring-2 focus:ring-cyan-500/50 border-gray-700 outline-none font-mono text-4xl font-black transition-all group-hover:border-gray-600" 
                                placeholder="0.00" 
                              />
                              <span className="absolute right-6 top-7 text-gray-600 font-black text-xl">USD</span>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <label className="block text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] ml-1">Execution Protocol</label>
                            <div className="grid grid-cols-2 gap-3">
                              {[
                                { id: 'quantumpay', label: 'QuantumPay', sub: 'Instant', icon: Zap },
                                { id: 'swift_global', label: 'SWIFT L1', sub: 'T+0', icon: Globe },
                                { id: 'blockchain_dlt', label: 'DLT Rail', sub: 'Encrypted', icon: Layers },
                                { id: 'cashapp', label: 'ACH Prime', sub: 'Standard', icon: RefreshCcw },
                              ].map(rail => (
                                <button
                                  key={rail.id}
                                  onClick={() => setPaymentMethod(rail.id as any)}
                                  className={`p-4 rounded-2xl border text-left transition-all ${
                                    paymentMethod === rail.id 
                                      ? 'bg-cyan-500/10 border-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.1)]' 
                                      : 'bg-black/40 border-gray-800 hover:border-gray-700'
                                  }`}
                                >
                                  <rail.icon size={18} className={paymentMethod === rail.id ? 'text-cyan-500' : 'text-gray-600'} />
                                  <p className={`text-xs font-black mt-2 uppercase ${paymentMethod === rail.id ? 'text-white' : 'text-gray-400'}`}>{rail.label}</p>
                                  <p className="text-[9px] text-gray-600 font-mono">{rail.sub}</p>
                                </button>
                              ))}
                            </div>
                          </div>

                          <div className="space-y-2">
                            <label className="block text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] ml-1">Transaction Memo (Optional)</label>
                            <textarea 
                              value={memo}
                              onChange={e => setMemo(e.target.value)}
                              className="w-full bg-black/60 border border-gray-800 rounded-2xl p-4 text-white focus:ring-2 focus:ring-cyan-500/50 border-gray-700 outline-none font-mono text-sm h-24 resize-none"
                              placeholder="Reference code, invoice #, or internal note..."
                            />
                          </div>
                        </>
                      ) : (
                        <div className="space-y-6 animate-in slide-in-from-right-8 duration-500">
                          <div className="bg-gradient-to-br from-gray-900 to-black p-8 rounded-[2.5rem] border border-gray-800 space-y-6 text-center relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-50" />
                            <p className="text-[10px] text-gray-500 uppercase font-black tracking-[0.3em]">Awaiting Digital Authorization</p>
                            <div className="space-y-1">
                              <div className="text-6xl font-black text-white font-mono tracking-tighter">
                                {formatCurrency(parseFloat(amount))}
                              </div>
                              <p className="text-cyan-400 font-mono text-sm tracking-widest uppercase">Target: {recipientName}</p>
                            </div>
                            <div className="flex justify-center gap-8 py-4 border-y border-gray-800/50">
                              <div className="text-center">
                                <p className="text-[8px] text-gray-600 uppercase font-bold">Network Fee</p>
                                <p className="text-xs font-mono text-white">$0.00</p>
                              </div>
                              <div className="text-center">
                                <p className="text-[8px] text-gray-600 uppercase font-bold">Settlement</p>
                                <p className="text-xs font-mono text-white">Instant</p>
                              </div>
                              <div className="text-center">
                                <p className="text-[8px] text-gray-600 uppercase font-bold">Protocol</p>
                                <p className="text-xs font-mono text-white uppercase">{paymentMethod}</p>
                              </div>
                            </div>
                            <p className="text-[9px] text-gray-600 font-mono italic">
                              SECURE_HASH: {generateHash().substring(0, 24)}...
                            </p>
                          </div>
                          <SecurityAuditDisplay auditResult={securityAudit} />
                        </div>
                      )}
                      
                      <div className="flex gap-4 mt-8">
                        {currentStep === 2 && (
                          <button 
                            onClick={() => setCurrentStep(1)} 
                            className="flex-1 py-4 bg-gray-900 hover:bg-gray-800 text-gray-400 font-black rounded-2xl transition-all uppercase tracking-widest text-xs border border-gray-800"
                          >
                            Modify
                          </button>
                        )}
                        <button 
                          onClick={handleSendClick} 
                          disabled={!amount || !recipientName || isProcessing} 
                          className="flex-[2] py-5 bg-cyan-600 hover:bg-cyan-500 rounded-2xl text-white font-black shadow-2xl shadow-cyan-600/30 transition-all active:scale-[0.98] disabled:opacity-30 uppercase tracking-[0.2em] text-xs flex items-center justify-center gap-3 group"
                        >
                          {isProcessing ? (
                            <RefreshCcw size={18} className="animate-spin" />
                          ) : (
                            <>
                              {currentStep === 1 ? "Review Protocol" : "Authorize Flow"}
                              <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </Card>
                </div>

                {/* SECONDARY DIAGNOSTICS */}
                <div className="space-y-8">
                  <Card title="Signal Intelligence" subtitle="Real-time heuristic monitoring">
                    <div className="space-y-6 py-2">
                      <div className="p-5 bg-black/60 rounded-2xl border border-gray-800 space-y-4">
                        <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest flex items-center gap-2">
                          <Cpu size={12} className="text-cyan-500" /> Neural Risk Engine
                        </p>
                        <SecurityEngine />
                      </div>

                      <div className="p-5 bg-black/60 rounded-2xl border border-gray-800 space-y-4">
                        <div className="flex items-center gap-4">
                          <div className="p-2 bg-emerald-500/10 rounded-lg">
                            <ShieldCheck className="text-emerald-500" size={20} />
                          </div>
                          <div>
                            <p className="text-[10px] text-white font-black uppercase tracking-widest">Zero-Knowledge Proofs</p>
                            <p className="text-[10px] text-gray-500">Identity obfuscation active for this route.</p>
                          </div>
                        </div>
                        <div className="h-px bg-gray-800" />
                        <div className="flex items-center gap-4">
                          <div className="p-2 bg-cyan-500/10 rounded-lg">
                            <Terminal className="text-cyan-500" size={20} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-[10px] text-white font-black uppercase tracking-widest">Telemetry Stream</p>
                            <p className="text-[9px] text-gray-600 font-mono truncate mt-1">
                              &gt; handshake_init: node_{paymentMethod.substring(0, 4)}...
                              <br />
                              &gt; entropy_check: 0.99923...
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="p-6 bg-gradient-to-br from-indigo-900/20 to-transparent border border-indigo-500/20 rounded-3xl flex items-center gap-5 group hover:border-indigo-500/40 transition-all">
                        <div className="relative">
                          <History className="text-indigo-400" size={24} />
                          <div className="absolute -top-1 -right-1 w-3 h-3 bg-indigo-500 rounded-full border-2 border-black" />
                        </div>
                        <div>
                          <p className="text-[10px] text-white font-black uppercase tracking-widest">Historical Synergy</p>
                          <p className="text-[10px] text-gray-400 mt-1">3 successful deployments to this recipient in the last 30 cycles.</p>
                        </div>
                      </div>
                    </div>
                  </Card>

                  <Card title="Compliance Oracle">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-3 bg-gray-900/30 rounded-xl border border-gray-800">
                        <div className="flex items-center gap-3">
                          <FileText size={14} className="text-gray-500" />
                          <span className="text-[10px] font-bold text-gray-400 uppercase">AML Screening</span>
                        </div>
                        <span className="text-[10px] font-mono text-emerald-500">PASSED</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-gray-900/30 rounded-xl border border-gray-800">
                        <div className="flex items-center gap-3">
                          <ShieldAlert size={14} className="text-gray-500" />
                          <span className="text-[10px] font-bold text-gray-400 uppercase">Sanctions Check</span>
                        </div>
                        <span className="text-[10px] font-mono text-emerald-500">CLEAR</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-gray-900/30 rounded-xl border border-gray-800">
                        <div className="flex items-center gap-3">
                          <Fingerprint size={14} className="text-gray-500" />
                          <span className="text-[10px] font-bold text-gray-400 uppercase">KYB Verification</span>
                        </div>
                        <span className="text-[10px] font-mono text-emerald-500">VERIFIED</span>
                      </div>
                    </div>
                  </Card>
                </div>
              </div>
            )}

            {activeTab === 'analytics' && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card title="Volume Analysis">
                    <div className="h-48 flex items-end justify-between gap-2 px-2">
                      {[40, 70, 45, 90, 65, 80, 95].map((h, i) => (
                        <div key={i} className="w-full bg-cyan-500/20 rounded-t-lg relative group">
                          <div 
                            className="absolute bottom-0 left-0 w-full bg-cyan-500 rounded-t-lg transition-all duration-1000 group-hover:bg-cyan-400" 
                            style={{ height: `${h}%` }} 
                          />
                        </div>
                      ))}
                    </div>
                    <div className="flex justify-between mt-4 text-[8px] font-mono text-gray-600 uppercase">
                      <span>Mon</span><span>Wed</span><span>Fri</span><span>Sun</span>
                    </div>
                  </Card>
                  <Card title="Rail Efficiency">
                    <div className="space-y-4 pt-4">
                      {[
                        { label: 'Quantum', val: 99.9, color: 'bg-cyan-500' },
                        { label: 'SWIFT', val: 82.4, color: 'bg-indigo-500' },
                        { label: 'ACH', val: 94.1, color: 'bg-emerald-500' },
                      ].map(r => (
                        <div key={r.label} className="space-y-1">
                          <div className="flex justify-between text-[10px] font-bold text-gray-400 uppercase">
                            <span>{r.label}</span>
                            <span>{r.val}%</span>
                          </div>
                          <div className="h-1.5 w-full bg-gray-900 rounded-full overflow-hidden">
                            <div className={`h-full ${r.color}`} style={{ width: `${r.val}%` }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card>
                  <Card title="Global Reach">
                    <div className="flex items-center justify-center h-48 relative">
                      <Globe size={100} className="text-gray-800 animate-pulse" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                          <p className="text-2xl font-black text-white">182</p>
                          <p className="text-[8px] text-gray-500 uppercase font-bold">Active Nodes</p>
                        </div>
                      </div>
                    </div>
                  </Card>
                </div>
                <Card title="Market Liquidity Heatmap">
                  <div className="grid grid-cols-12 gap-2 h-32">
                    {Array.from({ length: 48 }).map((_, i) => (
                      <div 
                        key={i} 
                        className="rounded-sm transition-all hover:scale-110 cursor-crosshair" 
                        style={{ 
                          backgroundColor: `rgba(6, 182, 212, ${Math.random() * 0.8 + 0.1})`,
                        }}
                        title={`Node ${i}: High Liquidity`}
                      />
                    ))}
                  </div>
                </Card>
              </div>
            )}

            {activeTab === 'audit' && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <Card 
                  title="Immutable Audit Ledger" 
                  subtitle="Cryptographically signed record of all system interactions"
                  headerActions={[
                    { id: 'dl', icon: <Download />, label: 'Export CSV', onClick: () => logAuditAction('LEDGER_EXPORT', 'USER', 'MEDIUM', { format: 'CSV' }) },
                    { id: 'filter', icon: <Filter />, label: 'Filter', onClick: () => {} }
                  ]}
                >
                  <AuditLedger logs={auditTrail} />
                </Card>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-6 bg-gray-900/30 border border-gray-800 rounded-2xl space-y-2">
                    <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest">Ledger Integrity</p>
                    <div className="flex items-center gap-3">
                      <ShieldCheck className="text-emerald-500" size={20} />
                      <p className="text-xs font-mono text-gray-300">All blocks verified. No discrepancies detected.</p>
                    </div>
                  </div>
                  <div className="p-6 bg-gray-900/30 border border-gray-800 rounded-2xl space-y-2">
                    <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest">Storage Utilization</p>
                    <div className="flex items-center gap-3">
                      <Database className="text-cyan-500" size={20} />
                      <p className="text-xs font-mono text-gray-300">Quantum-encrypted cold storage: 12.4 TB used.</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* RIGHT COLUMN: AI STRATEGIST CHAT */}
          <div className="xl:col-span-4">
            <div className="sticky top-10 space-y-6">
              <Card 
                className="h-[calc(100vh-180px)] flex flex-col border-cyan-500/20 shadow-[0_0_40px_rgba(6,182,212,0.05)]"
                title="AI Strategist"
                subtitle="Quantum Financial Intelligence Core"
                icon={<Cpu className="text-cyan-500" size={20} />}
              >
                <div className="flex-1 overflow-y-auto space-y-6 pr-2 custom-scrollbar mb-4">
                  {messages.map((msg) => (
                    <div 
                      key={msg.id} 
                      className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
                    >
                      <div className={`max-w-[85%] p-4 rounded-2xl text-xs leading-relaxed ${
                        msg.role === 'user' 
                          ? 'bg-cyan-600 text-white rounded-tr-none' 
                          : msg.role === 'system'
                          ? 'bg-gray-800/50 text-gray-400 italic text-center w-full'
                          : 'bg-gray-900 border border-gray-800 text-gray-300 rounded-tl-none'
                      }`}>
                        {msg.content}
                      </div>
                      <span className="text-[8px] font-mono text-gray-600 mt-1 uppercase">{msg.timestamp}</span>
                    </div>
                  ))}
                  {isAiTyping && (
                    <div className="flex items-center gap-2 text-cyan-500 animate-pulse">
                      <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  )}
                  <div ref={chatEndRef} />
                </div>

                <form onSubmit={handleAiChat} className="relative mt-auto">
                  <input 
                    type="text" 
                    value={chatInput}
                    onChange={e => setChatInput(e.target.value)}
                    placeholder="Ask the Strategist..."
                    className="w-full bg-black border border-gray-800 rounded-2xl p-4 pr-12 text-xs text-white focus:ring-2 focus:ring-cyan-500/50 outline-none transition-all"
                  />
                  <button 
                    type="submit"
                    disabled={!chatInput.trim() || isAiTyping}
                    className="absolute right-2 top-2 p-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl transition-all disabled:opacity-30"
                  >
                    <ArrowUpRight size={18} />
                  </button>
                </form>
              </Card>

              {/* QUICK ACTIONS */}
              <div className="grid grid-cols-2 gap-4">
                <button 
                  onClick={() => {
                    setChatInput("Analyze the risk of a $50,000 transfer to Global Logistics Inc.");
                    handleAiChat();
                  }}
                  className="p-4 bg-gray-900/50 border border-gray-800 rounded-2xl text-[10px] font-black text-gray-500 uppercase tracking-widest hover:border-cyan-500/50 hover:text-cyan-400 transition-all text-left"
                >
                  Risk Analysis
                </button>
                <button 
                  onClick={() => {
                    setChatInput("What is the most efficient rail for a T+0 settlement to London?");
                    handleAiChat();
                  }}
                  className="p-4 bg-gray-900/50 border border-gray-800 rounded-2xl text-[10px] font-black text-gray-500 uppercase tracking-widest hover:border-cyan-500/50 hover:text-cyan-400 transition-all text-left"
                >
                  Rail Optimization
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MODALS */}
      <BiometricModal 
        isOpen={showBiometricModal} 
        onSuccess={handleSuccess} 
        onClose={() => {
          setShowBiometricModal(false);
          logAuditAction('BIOMETRIC_CANCELLED', 'USER', 'MEDIUM', { amount });
        }} 
        amount={amount} 
        recipient={recipientName} 
        paymentMethod={paymentMethod} 
        securityContext="corporate_treasury" 
      />

      {/* GLOBAL OVERLAYS */}
      {isProcessing && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center">
          <div className="text-center space-y-6">
            <div className="relative">
              <div className="w-24 h-24 border-4 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin mx-auto" />
              <Lock className="absolute inset-0 m-auto text-cyan-500" size={32} />
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter">Securing Transaction</h3>
              <p className="text-gray-500 font-mono text-xs animate-pulse">ENCRYPTING_PACKETS // SIGNING_LEDGER // VERIFYING_NODES</p>
            </div>
          </div>
        </div>
      )}

      {/* CUSTOM STYLES */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #1f2937;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #06b6d4;
        }
      `}</style>
    </div>
  );
};

export default SendMoneyView;

================================================================================
// APPENDED FROM REPO: diplomat-bit/almost | ORIGINAL PATH: diplomat-bit-almost-93a5466/components/SendMoneyView (1).tsx
================================================================================


import React, { useState, useContext, useEffect } from 'react';
import Card from './Card';
import { DataContext } from '../context/DataContext';
import { View, PaymentRail, Transaction } from '../types';
import { BiometricModal, SecurityAuditDisplay, SecurityAuditResult } from './payment-components';

const SendMoneyView: React.FC = () => {
    const context = useContext(DataContext);
    if (!context) throw new Error("SendMoneyView must be used within a DataProvider");
    const { addTransaction, setActiveView } = context;

    const [amount, setAmount] = useState('');
    const [recipientName, setRecipientName] = useState('');
    const [paymentMethod, setPaymentMethod] = useState<PaymentRail>('quantumpay');
    const [showBiometricModal, setShowBiometricModal] = useState(false);
    const [securityAudit, setSecurityAudit] = useState<SecurityAuditResult | null>(null);
    const [currentStep, setCurrentStep] = useState(1);

    useEffect(() => {
        const auditTimeout = setTimeout(() => {
            if (parseFloat(amount) > 0 && recipientName) {
                setSecurityAudit({
                    riskScore: parseFloat(amount) > 5000 ? 60 : 10,
                    fraudProbability: 0.01,
                    amlCompliance: 'pass',
                    sanctionScreening: 'pass',
                    quantumSignatureIntegrity: 'verified',
                    recommendations: parseFloat(amount) > 5000 ? ["High value transaction. AI monitoring active."] : [],
                    complianceAlerts: [],
                    threatVectorAnalysis: []
                });
            }
        }, 800);
        return () => clearTimeout(auditTimeout);
    }, [amount, recipientName]);

    const handleSendClick = () => {
        if (currentStep === 1) setCurrentStep(2);
        else if (currentStep === 2) setShowBiometricModal(true);
    };

    const handleSuccess = async () => {
        const newTx: Transaction = {
            id: `tx_${Date.now()}`,
            type: 'expense',
            category: 'Transfer',
            description: `Sent to ${recipientName} via ${paymentMethod}`,
            amount: parseFloat(amount),
            date: new Date().toISOString().split('T')[0],
            carbonFootprint: 0.5,
            aiCategoryConfidence: 1.0
        };
        await addTransaction(newTx);
        setShowBiometricModal(false);
        setActiveView(View.Dashboard);
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <h2 className="text-3xl font-black text-white tracking-tighter uppercase italic">Quantum Pay Portal</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card title={currentStep === 1 ? "Initiate Transfer" : "Review Transaction"}>
                    <div className="space-y-6">
                        {currentStep === 1 ? (
                            <>
                                <div>
                                    <label className="block text-[10px] font-bold text-gray-500 uppercase mb-2 tracking-widest">Recipient</label>
                                    <input type="text" value={recipientName} onChange={e => setRecipientName(e.target.value)} className="w-full bg-black/40 border border-gray-700 rounded-xl p-3 text-white focus:ring-1 focus:ring-cyan-500 outline-none font-mono" placeholder="Name, @tag, or ID" />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-bold text-gray-500 uppercase mb-2 tracking-widest">Amount (USD)</label>
                                    <input type="number" value={amount} onChange={e => setAmount(e.target.value)} className="w-full bg-black/40 border border-gray-700 rounded-xl p-3 text-white focus:ring-1 focus:ring-cyan-500 outline-none font-mono" placeholder="0.00" />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-bold text-gray-500 uppercase mb-2 tracking-widest">Execution Rail</label>
                                    <select value={paymentMethod} onChange={e => setPaymentMethod(e.target.value as PaymentRail)} className="w-full bg-black/40 border border-gray-700 rounded-xl p-3 text-white focus:ring-1 focus:ring-cyan-500 outline-none font-mono appearance-none">
                                        <option value="quantumpay">QuantumPay (Instant Settlement)</option>
                                        <option value="cashapp">Cash App</option>
                                        <option value="swift_global">SWIFT Global (L1)</option>
                                        <option value="blockchain_dlt">Blockchain DLT</option>
                                    </select>
                                </div>
                                <SecurityAuditDisplay auditResult={securityAudit} />
                            </>
                        ) : (
                            <div className="space-y-4 text-gray-100 bg-gray-900/50 p-6 rounded-2xl border border-gray-800">
                                <div className="flex justify-between border-b border-gray-800 pb-2">
                                    <span className="text-gray-500 text-xs uppercase font-bold">Target</span>
                                    <span className="font-mono text-cyan-400">{recipientName}</span>
                                </div>
                                <div className="flex justify-between border-b border-gray-800 pb-2">
                                    <span className="text-gray-500 text-xs uppercase font-bold">Magnitude</span>
                                    <span className="font-mono text-2xl font-black">${parseFloat(amount).toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between border-b border-gray-800 pb-2">
                                    <span className="text-gray-500 text-xs uppercase font-bold">Protocol</span>
                                    <span className="font-mono text-xs">{paymentMethod.toUpperCase()}</span>
                                </div>
                                <p className="text-[10px] text-yellow-500 font-mono animate-pulse">ESTIMATED_SETTLEMENT: INSTANT_QUANTUM</p>
                            </div>
                        )}
                        
                        <div className="flex justify-end gap-3 mt-8">
                             {currentStep === 2 && <button onClick={() => setCurrentStep(1)} className="px-6 py-3 bg-gray-800 rounded-xl text-white font-bold hover:bg-gray-700 transition-all">BACK</button>}
                             <button onClick={handleSendClick} disabled={!amount || !recipientName} className="px-8 py-3 bg-cyan-600 hover:bg-cyan-500 rounded-xl text-white font-black shadow-lg shadow-cyan-500/20 transition-all active:scale-95 disabled:opacity-50 uppercase tracking-widest">
                                {currentStep === 1 ? "Review Order" : "Initialize Flow"}
                             </button>
                        </div>
                    </div>
                </Card>

                <Card title="Network Diagnostics">
                    <div className="space-y-4">
                        <div className="p-4 bg-gray-950 rounded-xl border border-gray-800">
                            <p className="text-[10px] text-gray-500 uppercase font-black mb-2">DLT Nodes Status</p>
                            <div className="grid grid-cols-4 gap-2">
                                {[...Array(4)].map((_, i) => (
                                    <div key={i} className="h-1 bg-green-500 rounded-full shadow-[0_0_8px_rgba(34,197,94,0.4)]"></div>
                                ))}
                            </div>
                        </div>
                        <div className="p-4 bg-gray-950 rounded-xl border border-gray-800 font-mono text-[10px] text-gray-500">
                            <p>&gt; Requesting path optimization...</p>
                            <p className="text-cyan-400">&gt; Found optimal rail: {paymentMethod}</p>
                            <p>&gt; Validating recipient biometric hash...</p>
                            <p className="text-green-400">&gt; Recipient verified on decentralized identity grid.</p>
                        </div>
                    </div>
                </Card>
            </div>
            <BiometricModal isOpen={showBiometricModal} onSuccess={handleSuccess} onClose={() => setShowBiometricModal(false)} amount={amount} recipient={recipientName} paymentMethod={paymentMethod} securityContext="personal" />
        </div>
    );
};

export default SendMoneyView;


================================================================================
// APPENDED FROM REPO: diplomat-bit/almost | ORIGINAL PATH: diplomat-bit-almost-93a5466/components/SendMoneyView (4).tsx
================================================================================

// components/views/personal/SendMoneyView.tsx
// RE-ENACTED & EXPANDED: This component has been resurrected from its deprecated state.
// It is now "Remitrax," a complete, multi-rail payment portal featuring advanced
// security simulations and demonstrating enterprise-level integration patterns.
// After a decade of upgrades, Remitrax has evolved into an unparalleled financial ecosystem,
// incorporating AI, quantum-resistant security, DLT, and even neuro-link technologies.

import React, { useState, useContext, useRef, useEffect, useCallback } from 'react';
import Card from './Card';
import { DataContext } from '../context/DataContext';
import { View } from '../types';
import type { Transaction } from '../types';

// ================================================================================================
// GLOBAL REMITRAX PLATFORM WIDE TYPE DEFINITIONS
// ================================================================================================

export type PaymentRail = 'quantumpay' | 'cashapp' | 'swift_global' | 'blockchain_dlt' | 'interstellar_p2p' | 'neuro_link' | 'ai_contract_escrow';
export type ScanState = 'scanning' | 'success' | 'verifying' | 'error' | 'recalibrating' | 'quantum_sync' | 'ai_negotiating';

export interface RemitraxRecipientProfile {
  id: string;
  name: string;
  avatarUrl?: string;
  quantumTag?: string;
  cashtag?: string;
  swiftDetails?: { bankName: string; bic: string; accountNumber: string; };
  blockchainAddress?: string;
  neuroLinkAddress?: string;
  galacticP2PId?: string;
  preferredCurrency?: string;
  lastUsedDate?: string;
  trustScore?: number;
  kycStatus?: 'verified' | 'pending' | 'unverified';
  blacklisted?: boolean;
  bankAccounts?: { bankName: string; accountNumber: string; routingNumber?: string; iban?: string; }[];
  eWalletDetails?: { type: 'paypal' | 'venmo' | 'zelle' | 'revolut' | 'cashapp' | 'quantumpay'; identifier: string; }[];
  contactPreferences?: { email: boolean; sms: boolean; push: boolean; holo_alert?: boolean; };
  relationshipStatus?: 'family' | 'friend' | 'business' | 'self' | 'vendor' | 'partner' | 'regulatory_body';
  category?: 'personal' | 'business' | 'charity' | 'government';
  multiEntitySupport?: { parentId: string; subEntities: { id: string; name: string; type: string; }[]; };
  complianceFlags?: ('high_risk' | 'sanctioned_entity' | 'PEP' | 'low_risk' | 'verified_entity')[];
}

export interface RemitraxCurrency {
  code: string;
  name: string;
  symbol: string;
  isCrypto: boolean;
  conversionRate?: number;
  quantumFluctuationIndex?: number;
  decimalPlaces: number;
  minTransactionAmount?: number;
  maxTransactionAmount?: number;
  liquidityScore?: number;
  marketCap?: number;
  regulatoryStatus?: 'regulated' | 'unregulated' | 'experimental';
  crossChainCompatible?: boolean;
}

export interface ScheduledPaymentRule {
  frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'annually' | 'once_on_date' | 'conditional_event';
  startDate: string;
  endDate?: string;
  executionCondition?: string;
  nextExecutionDate?: string;
  maxExecutions?: number;
  triggerEventId?: string;
  paymentReason?: string;
  aiAnalysisTags?: string[];
  geoFenceTrigger?: { lat: number; lon: number; radius: number; };
  biometricApprovalRequired?: boolean;
}

export interface AdvancedTransactionSettings {
  priority: 'low' | 'normal' | 'high' | 'ultra_quantum';
  carbonOffsetRatio: number;
  privacyLevel: 'standard' | 'enhanced' | 'fully_anonymous_dlt';
  receiptPreference: 'email' | 'blockchain_proof' | 'neuronal_link_receipt' | 'physical_mail';
  notificationPreferences: { email: boolean; sms: boolean; push: boolean; holo_alert: boolean; };
  multiSignatureRequired?: boolean;
  escrowDetails?: { agentId: string; releaseCondition: string; };
  dynamicFeeOptimization?: 'auto' | 'manual';
  dataEncryptionStandard: 'aes256' | 'quantum_resistant_hybrid' | 'zero_knowledge_proof' | 'obfuscated_vault';
  routeOptimizationPreference: 'speed' | 'cost' | 'privacy' | 'sustainability' | 'compliance';
  dlcDetails?: { contractId: string; conditions: string; };
  transactionExpiryMinutes?: number;
  regulatoryReportingFlags?: ('FATCA' | 'CRS' | 'AML' | 'CFT' | 'none')[];
  postQuantumSecurityEnabled?: boolean;
}

export interface SecurityAuditResult {
  riskScore: number;
  fraudProbability: number;
  amlCompliance: 'pass' | 'fail' | 'review';
  sanctionScreening: 'pass' | 'fail';
  quantumSignatureIntegrity: 'verified' | 'compromised' | 'pending';
  recommendations: string[];
  complianceAlerts?: string[];
  threatVectorAnalysis?: { type: string; severity: 'low' | 'medium' | 'high'; description: string; }[];
}

export interface EnvironmentalImpactReport {
    transactionCO2e: number;
    offsetCO2e: number;
    netCO2e: number;
    renewableEnergyUsedPercentage: number;
    recommendations?: string[];
}

export interface RailSpecificDetails {
    swift?: { bankName: string; bic: string; accountNumber: string; beneficiaryAddress: string; };
    blockchain?: { network: 'ethereum' | 'polygon' | 'solana' | 'custom_dlt' | ''; gasLimit: string; dataPayload?: string; };
    interstellar?: { galaxyId: string; starSystemAddress: string; vesselIdentifier?: string; warpDriveEfficiencyRating?: number; };
    neuroLink?: { neuralSignatureType: 'brainwave' | 'retinal_pattern' | ''; recipientId: string; neuroSyncProtocolVersion?: string; };
    aiContractEscrow?: { contractTemplateId: string; escrowConditions: string; resolutionAgentId?: string; immutableLedgerHash?: string; };
    quantumpay?: { channelProtocol: 'quantum_tunnel_v2' | 'entanglement_link_v1'; encryptionStandard: 'QRC-256' | 'hybrid_post_quantum'; quantumSignatureAlgorithm?: string; }
}

interface SendMoneyViewProps {
  setActiveView?: (view: View) => void;
}

// ================================================================================================
// ANIMATED UI SUB-COMPONENTS
// ================================================================================================

export const AnimatedCheckmarkIcon: React.FC = () => (
    <>
        <svg className="h-24 w-24 transform scale-125" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
            <defs>
                <linearGradient id="checkmarkGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#4ade80" />
                    <stop offset="50%" stopColor="#86efac" />
                    <stop offset="100%" stopColor="#22c55e" />
                </linearGradient>
                <filter id="hologramGlow">
                    <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur" />
                    <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 10 0" result="coloredBlur" />
                    <feMerge><feMergeNode in="coloredBlur" /><feMergeNode in="SourceGraphic" /></feMerge>
                </filter>
            </defs>
            <circle className="checkmark__circle" cx="26" cy="26" r="25" fill="none" stroke="url(#checkmarkGradient)" filter="url(#hologramGlow)" />
            <path className="checkmark__check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" />
        </svg>
        <style>{`
            .checkmark__circle { stroke-dasharray: 166; stroke-dashoffset: 166; stroke-width: 4; stroke-miterlimit: 10; fill: none; animation: stroke-circle 0.6s cubic-bezier(0.65, 0, 0.45, 1) forwards; box-shadow: 0 0 15px rgba(66, 255, 125, 0.7); }
            .checkmark__check { transform-origin: 50% 50%; stroke-dasharray: 48; stroke-dashoffset: 48; stroke-width: 5; stroke: #fff; animation: stroke-check 0.3s cubic-bezier(0.65, 0, 0.45, 1) 0.8s forwards; }
            @keyframes stroke-circle { 100% { stroke-dashoffset: 0; } }
            @keyframes stroke-check { 100% { stroke-dashoffset: 0; } }
        `}</style>
    </>
);

export const QuantumLedgerAnimation: React.FC = () => (
    <>
        <div className="quantum-ledger-container">
            <div className="quantum-grid-enhanced">
                {Array.from({ length: 16 }).map((_, i) => (
                    <div key={i} className="quantum-block-enhanced" style={{ animationDelay: `${i * 0.08}s` }}></div>
                ))}
            </div>
            <div className="quantum-data-flow">
                <div className="data-packet" style={{ '--flow-delay': '0s' } as React.CSSProperties}></div>
                <div className="data-packet" style={{ '--flow-delay': '0.5s' } as React.CSSProperties}></div>
            </div>
            <div className="text-center mt-4 text-xs text-cyan-300 animate-pulse">Quantum Entanglement Protocol: Active</div>
        </div>
        <style>{`
            .quantum-ledger-container { position: relative; width: 150px; height: 150px; display: flex; flex-direction: column; align-items: center; justify-content: center; }
            .quantum-grid-enhanced { display: grid; grid-template-columns: repeat(4, 1fr); gap: 6px; width: 120px; height: 120px; position: relative; z-index: 1; }
            .quantum-block-enhanced { background-color: rgba(6, 182, 212, 0.2); border: 1px solid #06b6d4; border-radius: 3px; animation: quantum-pulse 2s infinite ease-in-out forwards; box-shadow: 0 0 8px rgba(6, 182, 212, 0.5); }
            @keyframes quantum-pulse { 0%, 100% { background-color: rgba(6, 182, 212, 0.2); transform: scale(1); box-shadow: 0 0 8px rgba(6, 182, 212, 0.5); } 50% { background-color: rgba(165, 243, 252, 0.7); transform: scale(1.08); box-shadow: 0 0 15px rgba(165, 243, 252, 0.8); } }
            .quantum-data-flow { position: absolute; inset: 0; display: flex; justify-content: center; align-items: center; }
            .data-packet { position: absolute; width: 8px; height: 8px; border-radius: 50%; background: linear-gradient(45deg, #0ef, #06b6d4); box-shadow: 0 0 5px #0ef, 0 0 10px #06b6d4; animation: data-flow-path 4s infinite linear var(--flow-delay); opacity: 0; }
            @keyframes data-flow-path { 0% { transform: translate(-60px, -60px) scale(0.5); opacity: 0; } 20% { opacity: 1; } 50% { transform: translate(60px, 60px) scale(1.2); opacity: 1; } 80% { opacity: 0; } 100% { transform: translate(120px, 120px) scale(0.5); opacity: 0; } }
        `}</style>
    </>
);

export const QuantumChannelEstablishment: React.FC = () => (
    <>
        <div className="flex flex-col items-center justify-center space-y-3">
            <div className="relative w-24 h-24 rounded-full flex items-center justify-center border-2 border-purple-500 animate-spin-slow">
                <div className="w-16 h-16 rounded-full border-2 border-purple-400 animate-ping-once"></div>
                <div className="absolute w-8 h-8 bg-purple-600 rounded-full animate-pulse-fast"></div>
            </div>
            <p className="text-sm text-purple-300 animate-fade-in-out">Establishing Quantum Tunnel...</p>
        </div>
        <style>{`.animate-spin-slow { animation: spin-slow 8s linear infinite; } .animate-ping-once { animation: ping-once 2s ease-out infinite; } .animate-pulse-fast { animation: pulse-fast 1.5s ease-in-out infinite; } .animate-fade-in-out { animation: fade-in-out 3s ease-in-out infinite; }
        @keyframes spin-slow { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } } @keyframes ping-once { 0% { transform: scale(0.2); opacity: 0; } 50% { transform: scale(1); opacity: 1; } 100% { transform: scale(1.2); opacity: 0; } } @keyframes pulse-fast { 0%, 100% { transform: scale(1); opacity: 1; } 50% { transform: scale(1.1); opacity: 0.8; } } @keyframes fade-in-out { 0%, 100% { opacity: 0.5; } 50% { opacity: 1; } }`}</style>
    </>
);

export const AINegotiationAnimation: React.FC = () => (
    <>
        <div className="flex flex-col items-center justify-center space-y-3">
            <div className="relative w-24 h-24 flex items-center justify-center">
                <i className="fas fa-robot text-7xl text-teal-500 animate-pulse-slow"></i>
                <div className="absolute w-12 h-12 bg-gray-900 rounded-full flex items-center justify-center animate-spin-fast">
                    <i className="fas fa-exchange-alt text-xl text-teal-300"></i>
                </div>
            </div>
            <p className="text-sm text-teal-300 animate-fade-in-out">AI Negotiating Optimal Route & Terms...</p>
        </div>
        <style>{`.animate-pulse-slow { animation: pulse-slow 2.5s ease-in-out infinite; } .animate-spin-fast { animation: spin-fast 1.5s linear infinite; }
        @keyframes pulse-slow { 0%, 100% { transform: scale(1); opacity: 1; } 50% { transform: scale(1.05); opacity: 0.8; } } @keyframes spin-fast { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
    </>
);

export const SecurityAuditDisplay: React.FC<{ auditResult: SecurityAuditResult | null }> = ({ auditResult }) => {
    if (!auditResult) return <div className="flex items-center space-x-2 text-yellow-400"><svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg><span>Performing real-time security audit...</span></div>;

    return (
        <div className="bg-gray-800 p-4 rounded-lg space-y-2 border border-gray-700">
            <h4 className="font-semibold text-lg text-white">Security Audit Report</h4>
            <div className="grid grid-cols-2 gap-2 text-sm">
                <p className="text-gray-400">Risk Score:</p><p className={`${auditResult.riskScore > 50 ? 'text-red-400' : 'text-green-400'}`}>{auditResult.riskScore}/100</p>
                <p className="text-gray-400">Fraud Probability:</p><p className={`${auditResult.fraudProbability > 0.3 ? 'text-red-400' : 'text-green-400'}`}>{`${(auditResult.fraudProbability * 100).toFixed(2)}%`}</p>
                <p className="text-gray-400">AML Compliance:</p><p className={auditResult.amlCompliance === 'pass' ? 'text-green-400' : 'text-yellow-400'}>{auditResult.amlCompliance}</p>
            </div>
            {auditResult.recommendations.length > 0 && (
                <div className="mt-2 text-sm text-yellow-300">
                    <p className="font-medium">Recommendations:</p>
                    <ul className="list-disc list-inside text-xs text-yellow-200">{auditResult.recommendations.map((rec, i) => <li key={i}>{rec}</li>)}</ul>
                </div>
            )}
        </div>
    );
};

export const BiometricModal: React.FC<{
    isOpen: boolean; onSuccess: () => void; onClose: () => void; amount: string; recipient: RemitraxRecipientProfile | string; paymentMethod: PaymentRail; securityContext: 'personal' | 'corporate' | 'regulatory'; mfAuthMethods?: ('fingerprint' | 'voice' | 'retinal_scan' | 'neural_pattern' | 'face')[]; approvalRequiredBy?: string[];
}> = ({ isOpen, onSuccess, onClose, amount, recipient, paymentMethod, securityContext, mfAuthMethods = ['fingerprint'], approvalRequiredBy }) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [scanState, setScanState] = useState<ScanState>('scanning');
    const [verificationStep, setVerificationStep] = useState(0);
    const [biometricProgress, setBiometricProgress] = useState(0);
    const [activeAuthMethod, setActiveAuthMethod] = useState(mfAuthMethods[0] || 'face');
    const recipientName = typeof recipient === 'string' ? recipient : recipient.name;

    const verificationMessages = [ `Heuristic API: Initializing secure channel with ${paymentMethod}...`, `Heuristic API: Validating ${recipientName}'s identity...`, 'Heuristic API: Cross-referencing fraud ledgers...', 'Heuristic API: Executing on DLT/Quantum ledger...', 'Heuristic API: Confirming consensus...', 'Heuristic API: Archiving proof...', 'Heuristic API: Final checks...' ];

    useEffect(() => {
        if (!isOpen) { setScanState('scanning'); setVerificationStep(0); setBiometricProgress(0); return; }
        let stream: MediaStream | null = null;
        const startCamera = async () => {
            try { if (activeAuthMethod === 'face' || activeAuthMethod === 'retinal_scan') { stream = await navigator.mediaDevices.getUserMedia({ video: true }); if (videoRef.current) videoRef.current.srcObject = stream; } } catch (err) { setScanState('error'); }
        };
        startCamera();
        const scanProgressInterval = setInterval(() => setBiometricProgress(prev => Math.min(prev + Math.random() * 10, 100)), 200);
        const successTimer = setTimeout(() => { setScanState('success'); clearInterval(scanProgressInterval); }, 3000);
        const verifyTimer = setTimeout(() => setScanState('verifying'), 4000);
        const quantumSyncTimer = setTimeout(() => setScanState('quantum_sync'), 7500);
        const aiNegotiatingTimer = setTimeout(() => setScanState('ai_negotiating'), 10500);
        const successActionTimer = setTimeout(onSuccess, 15000);
        const closeTimer = setTimeout(onClose, 16000);
        return () => { clearTimeout(successTimer); clearTimeout(verifyTimer); clearTimeout(quantumSyncTimer); clearTimeout(aiNegotiatingTimer); clearTimeout(successActionTimer); clearTimeout(closeTimer); clearInterval(scanProgressInterval); if (stream) stream.getTracks().forEach(track => track.stop()); };
    }, [isOpen, onSuccess, onClose, activeAuthMethod]);

    useEffect(() => {
        if (['verifying', 'quantum_sync', 'ai_negotiating'].includes(scanState)) {
            const interval = setInterval(() => setVerificationStep(prev => Math.min(prev + 1, verificationMessages.length - 1)), 1500);
            return () => clearInterval(interval);
        }
    }, [scanState]);

    const getTitle = () => {
        switch (scanState) {
            case 'scanning': return `Scanning ${activeAuthMethod === 'face' ? 'Face' : 'Biometrics'}`;
            case 'success': return 'Identity Confirmed';
            case 'verifying': return 'Compliance Verification';
            case 'quantum_sync': return 'Quantum Network Sync';
            case 'ai_negotiating': return 'AI Optimization';
            case 'error': return 'Verification Failed';
            case 'recalibrating': return 'Recalibrating...';
        }
    };

    return (
        <div className={`fixed inset-0 bg-black/80 flex items-end sm:items-center justify-center z-50 backdrop-blur-lg transition-opacity duration-500 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
            <div className={`bg-gray-900 rounded-3xl p-8 max-w-lg w-full text-center border-2 border-cyan-700 shadow-xl transition-transform duration-500 ${isOpen ? 'translate-y-0 scale-100' : 'translate-y-full scale-90'}`}>
                <h3 className="text-3xl font-extrabold text-white mb-4">{getTitle()}</h3>
                <div className="relative w-72 h-72 mx-auto rounded-full overflow-hidden border-4 border-cyan-600 mb-6 shadow-lg">
                    {(activeAuthMethod === 'face' || activeAuthMethod === 'retinal_scan') ? <video ref={videoRef} autoPlay muted playsInline className="absolute top-0 left-0 w-full h-full object-cover transform scale-x-[-1]"></video> : <div className="absolute inset-0 flex items-center justify-center bg-gray-950 text-gray-500 text-lg"><p>Authenticating {activeAuthMethod}...</p></div>}
                    {scanState === 'scanning' && <div className="absolute inset-0 bg-grid-pattern-cyan animate-scan-holographic"><div className="absolute top-0 left-1/2 -translate-x-1/2 w-4/5 h-1 bg-cyan-400 opacity-70 blur-sm animate-scanner-line"></div></div>}
                    {scanState === 'success' && <div className="absolute inset-0 bg-green-500/50 flex items-center justify-center"><AnimatedCheckmarkIcon /></div>}
                    {scanState === 'verifying' && <div className="absolute inset-0 bg-black/50 flex items-center justify-center"><QuantumLedgerAnimation /></div>}
                    {scanState === 'quantum_sync' && <div className="absolute inset-0 bg-purple-900/80 flex items-center justify-center"><QuantumChannelEstablishment /></div>}
                    {scanState === 'ai_negotiating' && <div className="absolute inset-0 bg-teal-900/80 flex items-center justify-center"><AINegotiationAnimation /></div>}
                </div>
                {scanState === 'scanning' && <div className="w-full bg-gray-700 rounded-full h-2.5 mb-4"><div className="bg-cyan-500 h-2.5 rounded-full" style={{ width: `${biometricProgress}%` }}></div></div>}
                <p className="text-gray-300 mt-2 text-md">{['verifying', 'quantum_sync', 'ai_negotiating'].includes(scanState) ? verificationMessages[verificationStep] : `Sending $${amount} to ${recipientName}`}</p>
            </div>
            <style>{`.bg-grid-pattern-cyan{background-image:linear-gradient(rgba(0,255,255,0.3) 1px,transparent 1px),linear-gradient(90deg,rgba(0,255,255,0.3) 1px,transparent 1px);background-size:2.5rem 2.5rem}.animate-scan-holographic{animation:scan-holographic-effect 2.5s linear infinite; background-position: 0 0;}.animate-scanner-line{animation:scanner-line-move 2.5s ease-in-out infinite alternate}@keyframes scan-holographic-effect{0%{background-position:0 0}100%{background-position:0 -5rem}}@keyframes scanner-line-move{0%{transform:translate(-50%, 0) scaleX(0.2); opacity: 0;}20%{transform:translate(-50%, 25%) scaleX(1); opacity: 1;}80%{transform:translate(-50%, 75%) scaleX(1); opacity: 1;}100%{transform:translate(-50%, 100%) scaleX(0.2); opacity: 0;}}`}</style>
        </div>
    );
};

// ================================================================================================
// REMITRAX MAIN VIEW COMPONENT
// ================================================================================================

const SendMoneyView: React.FC<SendMoneyViewProps> = ({ setActiveView }) => {
    const context = useContext(DataContext);
    if (!context) throw new Error("SendMoneyView must be used within a DataProvider");
    const { addTransaction } = context;

    const [amount, setAmount] = useState('');
    const [recipientName, setRecipientName] = useState('');
    const [paymentMethod, setPaymentMethod] = useState<PaymentRail>('quantumpay');
    const [showBiometricModal, setShowBiometricModal] = useState(false);
    const [securityAudit, setSecurityAudit] = useState<SecurityAuditResult | null>(null);
    const [currentStep, setCurrentStep] = useState(1); // 1: Input, 2: Review, 3: Processing

    useEffect(() => {
        // Simulate security audit when amount or recipient changes
        const auditTimeout = setTimeout(() => {
            if (parseFloat(amount) > 0 && recipientName) {
                setSecurityAudit({
                    riskScore: parseFloat(amount) > 5000 ? 60 : 10,
                    fraudProbability: 0.05,
                    amlCompliance: 'pass',
                    sanctionScreening: 'pass',
                    quantumSignatureIntegrity: 'verified',
                    recommendations: parseFloat(amount) > 5000 ? ["High value. Verify recipient."] : [],
                    complianceAlerts: [],
                    threatVectorAnalysis: []
                });
            }
        }, 800);
        return () => clearTimeout(auditTimeout);
    }, [amount, recipientName]);

    const handleSendClick = () => {
        if (currentStep === 1) setCurrentStep(2);
        else if (currentStep === 2) setShowBiometricModal(true);
    };

    const handleSuccess = () => {
        const newTx: Transaction = {
            id: `tx_${Date.now()}`,
            type: 'expense',
            category: 'Transfer',
            description: `Sent to ${recipientName} via ${paymentMethod}`,
            amount: parseFloat(amount),
            date: new Date().toISOString().split('T')[0],
            carbonFootprint: 0.5
        };
        addTransaction(newTx);
        setShowBiometricModal(false);
        setCurrentStep(1);
        setAmount('');
        setRecipientName('');
        alert("Transfer Successful!");
    };

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold text-white tracking-wider">Remitrax: Quantum Secure Payments</h2>
            <Card title={currentStep === 1 ? "Initiate Transfer" : "Review Transaction"}>
                <div className="space-y-4">
                    {currentStep === 1 ? (
                        <>
                            <div>
                                <label className="block text-sm font-medium text-gray-400">Recipient</label>
                                <input type="text" value={recipientName} onChange={e => setRecipientName(e.target.value)} className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-white" placeholder="Name, @tag, or ID" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-400">Amount</label>
                                <input type="number" value={amount} onChange={e => setAmount(e.target.value)} className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-white" placeholder="0.00" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-400">Rail</label>
                                <select value={paymentMethod} onChange={e => setPaymentMethod(e.target.value as PaymentRail)} className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-white">
                                    <option value="quantumpay">QuantumPay (Instant DLT)</option>
                                    <option value="cashapp">Cash App</option>
                                    <option value="swift_global">SWIFT Global</option>
                                    <option value="blockchain_dlt">Blockchain DLT</option>
                                </select>
                            </div>
                            <SecurityAuditDisplay auditResult={securityAudit} />
                        </>
                    ) : (
                        <div className="space-y-2 text-gray-300">
                            <p><strong>To:</strong> {recipientName}</p>
                            <p><strong>Amount:</strong> ${amount}</p>
                            <p><strong>Method:</strong> {paymentMethod}</p>
                            <p className="text-sm text-yellow-400">Estimated Time: Instant (Quantum)</p>
                        </div>
                    )}
                    
                    <div className="flex justify-end gap-3 mt-6">
                         {currentStep === 2 && <button onClick={() => setCurrentStep(1)} className="px-4 py-2 bg-gray-600 rounded text-white">Back</button>}
                         <button onClick={handleSendClick} disabled={!amount || !recipientName} className="px-6 py-2 bg-cyan-600 hover:bg-cyan-500 rounded text-white font-bold disabled:opacity-50">
                            {currentStep === 1 ? "Review" : "Confirm & Send"}
                         </button>
                    </div>
                </div>
            </Card>
            <BiometricModal isOpen={showBiometricModal} onSuccess={handleSuccess} onClose={() => setShowBiometricModal(false)} amount={amount} recipient={recipientName} paymentMethod={paymentMethod} securityContext="personal" />
        </div>
    );
};

export default SendMoneyView;

================================================================================
// APPENDED FROM REPO: diplomat-bit/Citibank_Demo_Business_Inc_Demonstration- | ORIGINAL PATH: diplomat-bit-Citibank_Demo_Business_Inc_Demonstration--ab2501d/components/SendMoneyView.tsx
================================================================================

// components/views/personal/SendMoneyView.tsx
// RE-ENACTED & EXPANDED: This component has been resurrected from its deprecated state.
// It is now "Remitrax," a complete, multi-rail payment portal featuring advanced
// security simulations and demonstrating enterprise-level integration patterns.
// After a decade of upgrades, Remitrax is an unparalleled financial ecosystem.

import React, { useState, useContext, useRef, useEffect, useCallback } from 'react';
import Card from './Card';
import { DataContext } from '../context/DataContext';
import { View } from '../types';
import type { Transaction } from '../types';

// ================================================================================================
// GLOBAL REMITRAX PLATFORM WIDE TYPE DEFINITIONS
// Over a decade, Remitrax has become the central nervous system for financial transactions.
// These types reflect the highly advanced, multi-dimensional nature of its operations.
// ================================================================================================

export type PaymentRail = 'quantumpay' | 'cashapp' | 'swift_global' | 'blockchain_dlt' | 'interstellar_p2p' | 'neuro_link' | 'ai_contract_escrow';
export type ScanState = 'scanning' | 'success' | 'verifying' | 'error' | 'recalibrating' | 'quantum_sync';

export interface RemitraxRecipientProfile {
  id: string;
  name: string;
  avatarUrl?: string;
  quantumTag?: string;
  cashtag?: string;
  swiftDetails?: { bankName: string; bic: string; accountNumber: string; };
  blockchainAddress?: string; // For DLT rail
  neuroLinkAddress?: string; // For Neuro-Link rail
  galacticP2PId?: string; // For Interstellar P2P
  preferredCurrency?: string;
  lastUsedDate?: string;
  trustScore?: number; // AI-driven trust assessment
  kycStatus?: 'verified' | 'pending' | 'unverified';
  blacklisted?: boolean;
}

export interface RemitraxCurrency {
  code: string; // e.g., 'USD', 'EUR', 'BTC', 'QNT' (QuantumCoin)
  name: string;
  symbol: string;
  isCrypto: boolean;
  conversionRate?: number; // Relative to a base, fetched live
  quantumFluctuationIndex?: number; // For advanced quantum currencies
}

export interface ScheduledPaymentRule {
  frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'annually' | 'once_on_date' | 'conditional_event';
  startDate: string;
  endDate?: string; // For recurring payments
  executionCondition?: string; // e.g., 'if_balance_above_X', 'on_market_event_Y'
  nextExecutionDate?: string;
  maxExecutions?: number;
  triggerEventId?: string; // For AI-contract escrow
}

export interface AdvancedTransactionSettings {
  priority: 'low' | 'normal' | 'high' | 'ultra_quantum'; // Affects fees & speed
  carbonOffsetRatio: number; // User-defined offset percentage
  privacyLevel: 'standard' | 'enhanced' | 'fully_anonymous_dlt';
  receiptPreference: 'email' | 'blockchain_proof' | 'neuronal_link_receipt';
  notificationPreferences: { email: boolean; sms: boolean; push: boolean; holo_alert: boolean; };
  multiSignatureRequired?: boolean; // For corporate accounts
  escrowDetails?: { agentId: string; releaseCondition: string; };
  dynamicFeeOptimization?: 'auto' | 'manual';
}

export interface SecurityAuditResult {
  riskScore: number; // 0-100, higher is riskier
  fraudProbability: number; // 0-1, AI-driven
  amlCompliance: 'pass' | 'fail' | 'review';
  sanctionScreening: 'pass' | 'fail';
  quantumSignatureIntegrity: 'verified' | 'compromised' | 'pending';
  recommendations: string[];
}

// FIX: Added interface definition for component props.
interface SendMoneyViewProps {
  setActiveView: (view: View) => void;
}


// ================================================================================================
// ANIMATED UI SUB-COMPONENTS (Deeply Enhanced for future-proof UX)
// These provide a high-fidelity user experience during the security and DLT processing.
// ================================================================================================

/**
 * @description Renders an animated checkmark icon for success feedback.
 * The animation is pure CSS, making it lightweight and performant.
 * Expanded with holographic shimmer effect.
 */
export const AnimatedCheckmarkIcon: React.FC = () => (
    <>
        <svg className="h-24 w-24 transform scale-125" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
            <defs>
                <linearGradient id="checkmarkGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#4ade80" />
                    <stop offset="50%" stopColor="#86efac" />
                    <stop offset="100%" stopColor="#22c55e" />
                </linearGradient>
                <filter id="hologramGlow">
                    <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur" />
                    <feColorMatrix in="blur" mode="matrix" values="
                        1 0 0 0 0
                        0 1 0 0 0
                        0 0 1 0 0
                        0 0 0 10 0
                    " result="coloredBlur" />
                    <feMerge>
                        <feMergeNode in="coloredBlur" />
                        <feMergeNode in="SourceGraphic" />
                    </feMerge>
                </filter>
            </defs>
            <circle className="checkmark__circle" cx="26" cy="26" r="25" fill="none" stroke="url(#checkmarkGradient)" filter="url(#hologramGlow)" />
            <path className="checkmark__check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" />
        </svg>
        <style>{`
            .checkmark__circle {
                stroke-dasharray: 166;
                stroke-dashoffset: 166;
                stroke-width: 4;
                stroke-miterlimit: 10;
                fill: none;
                animation: stroke-circle 0.6s cubic-bezier(0.65, 0, 0.45, 1) forwards;
                box-shadow: 0 0 15px rgba(66, 255, 125, 0.7);
            }
            .checkmark__check {
                transform-origin: 50% 50%;
                stroke-dasharray: 48;
                stroke-dashoffset: 48;
                stroke-width: 5;
                stroke: #fff;
                animation: stroke-check 0.3s cubic-bezier(0.65, 0, 0.45, 1) 0.8s forwards;
            }
            @keyframes stroke-circle {
                100% { stroke-dashoffset: 0; }
            }
            @keyframes stroke-check {
                100% { stroke-dashoffset: 0; }
            }
        `}</style>
    </>
);

/**
 * @description Renders a futuristic "quantum ledger" animation to simulate
 * secure transaction processing. This enhances perceived security and trust.
 * Expanded with real-time data flow visualization.
 */
export const QuantumLedgerAnimation: React.FC = () => (
    <>
        <div className="quantum-ledger-container">
            <div className="quantum-grid-enhanced">
                {Array.from({ length: 16 }).map((_, i) => (
                    <div key={i} className="quantum-block-enhanced" style={{ animationDelay: `${i * 0.08}s` }}></div>
                ))}
            </div>
            <div className="quantum-data-flow">
                <div className="data-packet" style={{ '--flow-delay': '0s' } as React.CSSProperties}></div>
                <div className="data-packet" style={{ '--flow-delay': '0.5s' } as React.CSSProperties}></div>
                <div className="data-packet" style={{ '--flow-delay': '1s' } as React.CSSProperties}></div>
                <div className="data-packet" style={{ '--flow-delay': '1.5s' } as React.CSSProperties}></div>
            </div>
            <div className="text-center mt-4 text-xs text-cyan-300 animate-pulse">
                Quantum Entanglement Protocol: Active
            </div>
        </div>
        <style>{`
            .quantum-ledger-container {
                position: relative;
                width: 150px;
                height: 150px;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
            }
            .quantum-grid-enhanced {
                display: grid;
                grid-template-columns: repeat(4, 1fr);
                gap: 6px;
                width: 120px;
                height: 120px;
                position: relative;
                z-index: 1;
            }
            .quantum-block-enhanced {
                background-color: rgba(6, 182, 212, 0.2);
                border: 1px solid #06b6d4;
                border-radius: 3px;
                animation: quantum-pulse 2s infinite ease-in-out forwards;
                box-shadow: 0 0 8px rgba(6, 182, 212, 0.5);
            }
            @keyframes quantum-pulse {
                0%, 100% { background-color: rgba(6, 182, 212, 0.2); transform: scale(1); box-shadow: 0 0 8px rgba(6, 182, 212, 0.5); }
                50% { background-color: rgba(165, 243, 252, 0.7); transform: scale(1.08); box-shadow: 0 0 15px rgba(165, 243, 252, 0.8); }
            }

            .quantum-data-flow {
                position: absolute;
                inset: 0;
                display: flex;
                justify-content: center;
                align-items: center;
            }
            .data-packet {
                position: absolute;
                width: 8px;
                height: 8px;
                border-radius: 50%;
                background: linear-gradient(45deg, #0ef, #06b6d4);
                box-shadow: 0 0 5px #0ef, 0 0 10px #06b6d4;
                animation: data-flow-path 4s infinite linear var(--flow-delay);
                opacity: 0;
            }
            @keyframes data-flow-path {
                0% { transform: translate(-60px, -60px) scale(0.5); opacity: 0; }
                20% { opacity: 1; }
                50% { transform: translate(60px, 60px) scale(1.2); opacity: 1; }
                80% { opacity: 0; }
                100% { transform: translate(120px, 120px) scale(0.5); opacity: 0; }
            }
        `}</style>
    </>
);


/**
 * @description Visualizes the process of establishing a secure, quantum-resistant communication channel.
 */
export const QuantumChannelEstablishment: React.FC = () => (
    <>
        <div className="flex flex-col items-center justify-center space-y-3">
            <div className="relative w-24 h-24 rounded-full flex items-center justify-center border-2 border-purple-500 animate-spin-slow">
                <div className="w-16 h-16 rounded-full border-2 border-purple-400 animate-ping-once"></div>
                <div className="absolute w-8 h-8 bg-purple-600 rounded-full animate-pulse-fast"></div>
            </div>
            <p className="text-sm text-purple-300 animate-fade-in-out">Establishing Quantum Tunnel...</p>
        </div>
        <style>{`
            @keyframes spin-slow {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
            @keyframes ping-once {
                0% { transform: scale(0.2); opacity: 0; }
                50% { transform: scale(1); opacity: 1; }
                100% { transform: scale(1.2); opacity: 0; }
            }
            @keyframes pulse-fast {
                0%, 100% { transform: scale(1); opacity: 1; }
                50% { transform: scale(1.1); opacity: 0.7; }
            }
            @keyframes fade-in-out {
                0%, 100% { opacity: 0.5; }
                50% { opacity: 1; }
            }
            .animate-spin-slow { animation: spin-slow 8s linear infinite; }
            .animate-ping-once { animation: ping-once 2s ease-out infinite; }
            .animate-pulse-fast { animation: pulse-fast 1.5s ease-in-out infinite; }
            .animate-fade-in-out { animation: fade-in-out 3s ease-in-out infinite; }
        `}</style>
    </>
);


/**
 * @description Displays real-time security audit results with visual indicators.
 */
export const SecurityAuditDisplay: React.FC<{ auditResult: SecurityAuditResult | null }> = ({ auditResult }) => {
    if (!auditResult) return (
        <div className="flex items-center space-x-2 text-yellow-400">
            <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
            <span>Performing real-time security audit...</span>
        </div>
    );

    const getStatusColor = (status: 'pass' | 'fail' | 'review') => {
        if (status === 'pass') return 'text-green-400';
        if (status === 'fail') return 'text-red-400';
        return 'text-yellow-400';
    };

    const getQuantumIntegrityColor = (status: 'verified' | 'compromised' | 'pending') => {
        if (status === 'verified') return 'text-cyan-400';
        if (status === 'compromised') return 'text-red-500';
        return 'text-purple-400';
    };

    return (
        <div className="bg-gray-800 p-4 rounded-lg space-y-2 border border-gray-700">
            <h4 className="font-semibold text-lg text-white">Security Audit Report</h4>
            <div className="grid grid-cols-2 gap-2 text-sm">
                <p className="text-gray-400">Risk Score:</p><p className={`${auditResult.riskScore > 50 ? 'text-red-400' : 'text-green-400'}`}>{auditResult.riskScore}/100</p>
                <p className="text-gray-400">Fraud Probability:</p><p className={`${auditResult.fraudProbability > 0.3 ? 'text-red-400' : 'text-green-400'}`>{(auditResult.fraudProbability * 100).toFixed(2)}%</p>
                <p className="text-gray-400">AML Compliance:</p><p className={getStatusColor(auditResult.amlCompliance)}>{auditResult.amlCompliance}</p>
                <p className="text-gray-400">Sanction Screening:</p><p className={getStatusColor(auditResult.sanctionScreening)}>{auditResult.sanctionScreening}</p>
                <p className="text-gray-400">Quantum Signature:</p><p className={getQuantumIntegrityColor(auditResult.quantumSignatureIntegrity)}>{auditResult.quantumSignatureIntegrity}</p>
            </div>
            {auditResult.recommendations.length > 0 && (
                <div className="mt-2 text-sm text-yellow-300">
                    <p className="font-medium">Recommendations:</p>
                    <ul className="list-disc list-inside text-xs text-yellow-200">
                        {auditResult.recommendations.map((rec, i) => <li key={i}>{rec}</li>)}
                    </ul>
                </div>
            )}
        </div>
    );
};


// ================================================================================================
// HIGH-FIDELITY BIOMETRIC & MULTI-FACTOR AUTHENTICATION MODAL
// Enhanced for advanced biometric modalities and multi-party confirmations.
// ================================================================================================

export const BiometricModal: React.FC<{
    isOpen: boolean;
    onSuccess: () => void;
    onClose: () => void;
    amount: string;
    recipient: RemitraxRecipientProfile | string;
    paymentMethod: PaymentRail;
    securityContext: 'personal' | 'corporate' | 'regulatory';
    mfAuthMethods?: ('fingerprint' | 'voice' | 'retinal_scan' | 'neural_pattern')[]; // New
    approvalRequiredBy?: string[]; // For corporate multi-signature
}> = ({ isOpen, onSuccess, onClose, amount, recipient, paymentMethod, securityContext, mfAuthMethods = ['fingerprint'], approvalRequiredBy }) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [scanState, setScanState] = useState<ScanState>('scanning');
    const [verificationStep, setVerificationStep] = useState(0);
    const [biometricProgress, setBiometricProgress] = useState(0); // For progress bar
    const [activeAuthMethod, setActiveAuthMethod] = useState<'face' | 'fingerprint' | 'voice' | 'retinal_scan' | 'neural_pattern'>('face'); // Assume face for video for now

    const recipientName = typeof recipient === 'string' ? recipient : recipient.name;

    const verificationMessages = [
        `Heuristic API: Initializing secure channel with ${paymentMethod} rail...`,
        `Heuristic API: Validating ${recipientName}'s identity and trust score...`,
        'Heuristic API: Cross-referencing transaction against global fraud ledgers...',
        'Heuristic API: Executing transaction on secure DLT/Quantum ledger...',
        'Heuristic API: Confirming multi-party consensus and finalization...',
        'Heuristic API: Archiving cryptographic proof of transfer...'
    ];

    // Effect to manage camera stream and the multi-step verification flow.
    useEffect(() => {
        if (!isOpen) {
            setScanState('scanning');
            setVerificationStep(0);
            setBiometricProgress(0);
            return;
        };

        let stream: MediaStream | null = null;
        const startCamera = async () => {
            try {
                if (activeAuthMethod === 'face' || activeAuthMethod === 'retinal_scan') {
                    stream = await navigator.mediaDevices.getUserMedia({ video: true });
                    if (videoRef.current) {
                        videoRef.current.srcObject = stream;
                    }
                }
                // Simulate other biometric sensors or external device integrations here
            } catch (err) {
                console.error("Biometric access denied:", err);
                setScanState('error');
            }
        };
        startCamera();

        // Simulate biometric scan progress
        const scanProgressInterval = setInterval(() => {
            setBiometricProgress(prev => Math.min(prev + Math.random() * 10, 100));
        }, 200);

        const successTimer = setTimeout(() => {
            setScanState('success');
            clearInterval(scanProgressInterval); // Stop progress once success
        }, 3000);
        
        const verifyTimer = setTimeout(() => setScanState('verifying'), 4000);
        const quantumSyncTimer = setTimeout(() => setScanState('quantum_sync'), 7500); // New state
        const successActionTimer = setTimeout(onSuccess, 12000); // Extended time for advanced verifications
        const closeTimer = setTimeout(onClose, 13000);

        return () => {
            clearTimeout(successTimer);
            clearTimeout(verifyTimer);
            clearTimeout(quantumSyncTimer);
            clearTimeout(successActionTimer);
            clearTimeout(closeTimer);
            clearInterval(scanProgressInterval);
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
            }
        };
    }, [isOpen, onSuccess, onClose, activeAuthMethod]);
    
    // Effect to cycle through the verification messages.
    useEffect(() => {
        if (scanState === 'verifying' || scanState === 'quantum_sync') {
            const interval = setInterval(() => {
                setVerificationStep(prev => Math.min(prev + 1, verificationMessages.length - 1));
            }, 1500); // Slower for more detailed messages
            return () => clearInterval(interval);
        }
    }, [scanState, verificationMessages.length]);

    const getTitle = () => {
        switch (scanState) {
            case 'scanning': return `Scanning ${activeAuthMethod === 'face' ? 'Face' : activeAuthMethod === 'retinal_scan' ? 'Retina' : 'Biometrics'}`;
            case 'success': return 'Identity Confirmed: High-Security Clearance';
            case 'verifying': return 'Quantum Ledger & Global Compliance Verification';
            case 'quantum_sync': return 'Quantum Network Sync: Finalizing Transaction';
            case 'error': return 'Biometric Verification Failed';
            case 'recalibrating': return 'Recalibrating Biometric Sensors...';
        }
    }
    
    return (
        <div className={`fixed inset-0 bg-black/80 flex items-end sm:items-center justify-center z-50 backdrop-blur-lg transition-opacity duration-500 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
            <div className={`bg-gray-900 rounded-t-3xl sm:rounded-3xl p-8 max-w-lg w-full text-center border-t sm:border-2 border-cyan-700 shadow-xl shadow-cyan-900/30 transition-transform duration-500 ease-out transform ${isOpen ? 'translate-y-0 scale-100' : 'translate-y-full scale-90'}`}>
                
                <h3 className="text-3xl font-extrabold text-white mb-4 leading-tight">{getTitle()}</h3>
                
                <div className="relative w-72 h-72 mx-auto rounded-full overflow-hidden border-4 border-cyan-600 mb-6 shadow-lg">
                    {activeAuthMethod === 'face' || activeAuthMethod === 'retinal_scan' ? (
                        <video ref={videoRef} autoPlay muted playsInline className="absolute top-0 left-0 w-full h-full object-cover transform scale-x-[-1]"></video>
                    ) : (
                        <div className="absolute inset-0 flex items-center justify-center bg-gray-950 text-gray-500 text-lg">
                            {activeAuthMethod === 'fingerprint' && <i className="fas fa-fingerprint text-6xl animate-pulse"></i>}
                            {activeAuthMethod === 'voice' && <i className="fas fa-microphone-alt text-6xl animate-pulse"></i>}
                            {activeAuthMethod === 'neural_pattern' && <i className="fas fa-brain text-6xl animate-pulse"></i>}
                            {activeAuthMethod === 'retinal_scan' && <i className="fas fa-eye text-6xl animate-pulse"></i>}
                            <p className="absolute bottom-8">Authenticating {activeAuthMethod}...</p>
                        </div>
                    )}
                    
                    {scanState === 'scanning' && <div className="absolute inset-0 bg-grid-pattern-cyan animate-scan-holographic">
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-4/5 h-1 bg-cyan-400 opacity-70 blur-sm animate-scanner-line"></div>
                    </div>}
                    {scanState === 'success' && <div className="absolute inset-0 bg-green-500/50 flex items-center justify-center"><AnimatedCheckmarkIcon /></div>}
                    {scanState === 'verifying' && <div className="absolute inset-0 bg-black/50 flex items-center justify-center"><QuantumLedgerAnimation /></div>}
                    {scanState === 'quantum_sync' && <div className="absolute inset-0 bg-gradient-to-br from-purple-900 to-indigo-900 flex items-center justify-center"><QuantumChannelEstablishment /></div>}
                    {scanState === 'error' && <div className="absolute inset-0 bg-red-700/70 flex items-center justify-center p-4"><p className="text-lg font-bold text-white">Biometric authentication failed. Please try again or use alternative methods.</p></div>}
                    {scanState === 'recalibrating' && <div className="absolute inset-0 bg-blue-700/70 flex items-center justify-center p-4"><p className="text-lg font-bold text-white">Sensor recalibration initiated. Standby...</p></div>}
                </div>

                {scanState === 'scanning' && (
                    <div className="w-full bg-gray-700 rounded-full h-2.5 mb-4">
                        <div className="bg-cyan-500 h-2.5 rounded-full" style={{ width: `${biometricProgress}%` }}></div>
                    </div>
                )}

                <p className="text-gray-300 mt-2 text-md leading-relaxed">{scanState === 'verifying' || scanState === 'quantum_sync' ? verificationMessages[verificationStep] : `Sending $${amount} to ${recipientName} via ${paymentMethod}`}</p>
                
                {securityContext === 'corporate' && approvalRequiredBy && approvalRequiredBy.length > 0 && (
                    <div className="mt-4 p-3 bg-gray-800 rounded-lg text-sm text-yellow-300 border border-yellow-600">
                        <p className="font-semibold">Multi-Signature Required:</p>
                        <p>Awaiting approval from: {approvalRequiredBy.join(', ')}</p>
                    </div>
                )}

                {mfAuthMethods.length > 1 && scanState === 'error' && (
                    <div className="mt-6 flex flex-wrap justify-center gap-3">
                        {mfAuthMethods.filter(method => method !== activeAuthMethod).map(method => (
                            <button key={method} onClick={() => { setActiveAuthMethod(method); setScanState('scanning'); setBiometricProgress(0); }} className="px-5 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-full text-sm font-medium transition-colors">
                                Try {method.replace('_', ' ')}
                            </button>
                        ))}
                    </div>
                )}

                {scanState === 'scanning' && <button onClick={onClose} className="mt-6 px-6 py-3 bg-gray-700/50 hover:bg-gray-700 rounded-full text-base text-gray-300 transition-all duration-200">Cancel Transaction</button>}
            </div>
             <style>{`.bg-grid-pattern-cyan{background-image:linear-gradient(rgba(0,255,255,0.3) 1px,transparent 1px),linear-gradient(90deg,rgba(0,255,255,0.3) 1px,transparent 1px);background-size:2.5rem 2.5rem}.animate-scan-holographic{animation:scan-holographic-effect 2.5s linear infinite; background-position: 0 0;}.animate-scanner-line{animation:scanner-line-move 2.5s ease-in-out infinite alternate}.scanner-line-fade{animation:scanner-line-fade 2.5s ease-in-out infinite alternate}@keyframes scan-holographic-effect{0%{background-position:0 0}100%{background-position:0 -5rem}}@keyframes scanner-line-move{0%{transform:translate(-50%, 0) scaleX(0.2); opacity: 0;}20%{transform:translate(-50%, 25%) scaleX(1); opacity: 1;}80%{transform:translate(-50%, 75%) scaleX(1); opacity: 1;}100%{transform:translate(-50%, 100%) scaleX(0.2); opacity: 0;}}`}</style>
        </div>
    );
};


// ================================================================================================
// REMITRAX UI UTILITIES & AI-POWERED SUB-COMPONENTS
// These leverage advanced data analytics, AI, and user preferences for smart interactions.
// ================================================================================================

/**
 * @description Manages a comprehensive recipient address book with AI-driven suggestions and group management.
 */
export const RecipientSelector: React.FC<{
  selectedRecipient: RemitraxRecipientProfile | null;
  onSelect: (recipient: RemitraxRecipientProfile) => void;
  allRecipients: RemitraxRecipientProfile[];
  paymentMethod: PaymentRail;
  searchTerm: string;
  onSearchChange: (term: string) => void;
}> = ({ selectedRecipient, onSelect, allRecipients, paymentMethod, searchTerm, onSearchChange }) => {
  const [showAddressBook, setShowAddressBook] = useState(false);
  const [filteredRecipients, setFilteredRecipients] = useState<RemitraxRecipientProfile[]>([]);
  const [aiSuggestions, setAiSuggestions] = useState<RemitraxRecipientProfile[]>([]);

  useEffect(() => {
    // Simulate AI-driven suggestions based on payment method, frequency, and trust score
    const aiSuggest = allRecipients
      .filter(r => (paymentMethod === 'quantumpay' && r.quantumTag) || (paymentMethod === 'cashapp' && r.cashtag))
      .sort((a, b) => (b.lastUsedDate ? new Date(b.lastUsedDate).getTime() : 0) - (a.lastUsedDate ? new Date(a.lastUsedDate).getTime() : 0) || (b.trustScore || 0) - (a.trustScore || 0))
      .slice(0, 3); // Top 3 most relevant
    setAiSuggestions(aiSuggest);
  }, [allRecipients, paymentMethod]);

  useEffect(() => {
    // Filter recipients based on search term
    const termLower = searchTerm.toLowerCase();
    const filtered = allRecipients.filter(r =>
      r.name.toLowerCase().includes(termLower) ||
      (r.quantumTag && r.quantumTag.toLowerCase().includes(termLower)) ||
      (r.cashtag && r.cashtag.toLowerCase().includes(termLower)) ||
      (r.blockchainAddress && r.blockchainAddress.toLowerCase().includes(termLower))
    );
    setFilteredRecipients(filtered);
  }, [searchTerm, allRecipients]);


  const getRecipientIdentifier = (recipient: RemitraxRecipientProfile) => {
    switch (paymentMethod) {
      case 'quantumpay': return recipient.quantumTag || 'N/A';
      case 'cashapp': return recipient.cashtag || 'N/A';
      case 'blockchain_dlt': return recipient.blockchainAddress?.substring(0, 8) + '...' || 'N/A';
      case 'swift_global': return recipient.swiftDetails?.accountNumber || 'N/A';
      case 'interstellar_p2p': return recipient.galacticP2PId || 'N/A';
      case 'neuro_link': return recipient.neuroLinkAddress?.substring(0, 8) + '...' || 'N/A';
      default: return recipient.name;
    }
  };

  return (
    <div className="space-y-4">
      <label htmlFor="recipientSearch" className="block text-sm font-medium text-gray-300">Select Recipient or Enter ID</label>
      <div className="flex space-x-2">
        <input
          type="text"
          id="recipientSearch"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={`Enter Recipient's ${paymentMethod === 'quantumpay' ? '@QuantumTag' : paymentMethod === 'cashapp' ? '$Cashtag' : 'ID'} or Name`}
          className="flex-grow bg-gray-700/50 border-gray-600 rounded-lg p-2 text-white placeholder-gray-500"
        />
        <button
          type="button"
          onClick={() => setShowAddressBook(true)}
          className="p-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white text-sm flex items-center justify-center"
        >
          <i className="fas fa-address-book mr-2"></i> Address Book
        </button>
      </div>

      {selectedRecipient && (
        <div className="p-3 bg-gray-800 rounded-lg flex items-center justify-between border border-cyan-700">
          <div className="flex items-center space-x-3">
            <img src={selectedRecipient.avatarUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${selectedRecipient.name}`} alt="Avatar" className="w-8 h-8 rounded-full" />
            <div>
              <p className="text-white font-medium">{selectedRecipient.name}</p>
              <p className="text-gray-400 text-xs">{getRecipientIdentifier(selectedRecipient)}</p>
            </div>
          </div>
          <span className={`text-xs font-semibold px-2 py-1 rounded-full ${selectedRecipient.kycStatus === 'verified' ? 'bg-green-600 text-white' : 'bg-yellow-600 text-white'}`}>
            KYC {selectedRecipient.kycStatus}
          </span>
        </div>
      )}

      {!selectedRecipient && aiSuggestions.length > 0 && searchTerm === '' && (
        <div className="mt-4">
          <h5 className="text-sm font-medium text-gray-400 mb-2">AI-Suggested Recipients:</h5>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {aiSuggestions.map(rec => (
              <button
                key={rec.id}
                type="button"
                onClick={() => onSelect(rec)}
                className="flex items-center space-x-3 p-3 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors border border-gray-700"
              >
                <img src={rec.avatarUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${rec.name}`} alt="Avatar" className="w-8 h-8 rounded-full" />
                <div>
                  <p className="text-white text-sm font-medium">{rec.name}</p>
                  <p className="text-gray-400 text-xs">{getRecipientIdentifier(rec)}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {showAddressBook && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-lg p-6 w-full max-w-md shadow-xl border border-cyan-800">
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-xl font-bold text-white">Address Book</h4>
              <button onClick={() => setShowAddressBook(false)} className="text-gray-400 hover:text-white"><i className="fas fa-times"></i></button>
            </div>
            <input
                type="text"
                placeholder="Search address book..."
                className="w-full bg-gray-800 border-gray-700 rounded-lg p-2 text-white mb-4"
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
            />
            <div className="max-h-60 overflow-y-auto space-y-2 custom-scrollbar">
              {filteredRecipients.map(rec => (
                <button
                  key={rec.id}
                  type="button"
                  onClick={() => { onSelect(rec); setShowAddressBook(false); }}
                  className="flex items-center space-x-3 p-3 bg-gray-800 hover:bg-cyan-900/50 rounded-lg w-full text-left transition-colors border border-gray-700"
                >
                  <img src={rec.avatarUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${rec.name}`} alt="Avatar" className="w-10 h-10 rounded-full" />
                  <div>
                    <p className="text-white font-medium text-lg">{rec.name}</p>
                    <p className="text-gray-400 text-sm">{getRecipientIdentifier(rec)}</p>
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full mt-1 inline-block ${rec.kycStatus === 'verified' ? 'bg-green-700' : 'bg-yellow-700'}`}>
                        KYC: {rec.kycStatus}
                    </span>
                    {rec.trustScore && <span className="text-xs ml-2 text-cyan-400">Trust: {rec.trustScore.toFixed(1)}</span>}
                  </div>
                </button>
              ))}
              {filteredRecipients.length === 0 && <p className="text-center text-gray-500 py-4">No recipients found.</p>}
            </div>
            <style>{`
                .custom-scrollbar::-webkit-scrollbar { width: 8px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: #334155; border-radius: 4px; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #06b6d4; border-radius: 4px; }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #0891b2; }
            `}</style>
          </div>
        </div>
      )}
    </div>
  );
};

/**
 * @description Provides advanced multi-currency conversion with real-time rates and DLT asset support.
 */
export const MultiCurrencyConverter: React.FC<{
  amount: string;
  onAmountChange: (amount: string) => void;
  sourceCurrency: RemitraxCurrency;
  onSourceCurrencyChange: (currency: RemitraxCurrency) => void;
  targetCurrency: RemitraxCurrency;
  onTargetCurrencyChange: (currency: RemitraxCurrency) => void;
  availableCurrencies: RemitraxCurrency[];
  convertedAmount: number | null;
  fxRate: number | null;
  isLoading: boolean;
  onToggleDynamicFee: (enabled: boolean) => void;
  dynamicFeeEnabled: boolean;
  carbonOffsetRatio: number;
  onCarbonOffsetChange: (ratio: number) => void;
}> = ({
  amount, onAmountChange, sourceCurrency, onSourceCurrencyChange, targetCurrency, onTargetCurrencyChange,
  availableCurrencies, convertedAmount, fxRate, isLoading, onToggleDynamicFee, dynamicFeeEnabled,
  carbonOffsetRatio, onCarbonOffsetChange
}) => {
  const [showCurrencySelector, setShowCurrencySelector] = useState<'source' | 'target' | null>(null);

  const filterCurrencies = (type: 'source' | 'target') => {
    return availableCurrencies.filter(curr => {
      if (type === 'source') return curr.code !== targetCurrency.code;
      if (type === 'target') return curr.code !== sourceCurrency.code;
      return true;
    });
  };

  return (
    <div className="space-y-4 p-4 bg-gray-800 rounded-lg border border-gray-700 shadow-inner">
      <h4 className="text-xl font-bold text-white mb-3">Currency Exchange & Settings</h4>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="sourceAmount" className="block text-sm font-medium text-gray-300">Amount to Send</label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="pointer-events-none absolute inset-y-0 left-0 pl-3 flex items-center">
              <span className="text-gray-400">{sourceCurrency.symbol}</span>
            </div>
            <input
              type="number"
              id="sourceAmount"
              value={amount}
              onChange={(e) => onAmountChange(e.target.value)}
              className="w-full bg-gray-700/50 border-gray-600 rounded-lg pl-9 p-2 text-white focus:ring-cyan-500 focus:border-cyan-500"
              placeholder="0.00"
            />
            <div className="absolute inset-y-0 right-0 flex items-center">
              <label htmlFor="sourceCurrency" className="sr-only">Source Currency</label>
              <button
                type="button"
                onClick={() => setShowCurrencySelector('source')}
                className="h-full rounded-r-md border-l border-gray-600 bg-gray-700 pr-3 pl-2 text-gray-300 hover:text-white hover:bg-gray-600 focus:ring-cyan-500 focus:border-cyan-500 flex items-center"
              >
                {sourceCurrency.code} <i className="fas fa-chevron-down ml-2 text-xs"></i>
              </button>
            </div>
          </div>
        </div>

        <div>
          <label htmlFor="targetAmount" className="block text-sm font-medium text-gray-300">Recipient Receives</label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="pointer-events-none absolute inset-y-0 left-0 pl-3 flex items-center">
              <span className="text-gray-400">{targetCurrency.symbol}</span>
            </div>
            <input
              type="text"
              id="targetAmount"
              value={convertedAmount !== null ? convertedAmount.toFixed(sourceCurrency.isCrypto ? 8 : 2) : 'Calculating...'}
              readOnly
              className="w-full bg-gray-700/50 border-gray-600 rounded-lg pl-9 p-2 text-gray-300 cursor-not-allowed"
            />
            <div className="absolute inset-y-0 right-0 flex items-center">
              <label htmlFor="targetCurrency" className="sr-only">Target Currency</label>
              <button
                type="button"
                onClick={() => setShowCurrencySelector('target')}
                className="h-full rounded-r-md border-l border-gray-600 bg-gray-700 pr-3 pl-2 text-gray-300 hover:text-white hover:bg-gray-600 focus:ring-cyan-500 focus:border-cyan-500 flex items-center"
              >
                {targetCurrency.code} <i className="fas fa-chevron-down ml-2 text-xs"></i>
              </button>
            </div>
          </div>
        </div>
      </div>

      {isLoading && <p className="text-cyan-400 text-sm text-center animate-pulse">Fetching real-time FX rates and DLT gas fees...</p>}
      {fxRate && !isLoading && (
        <p className="text-gray-400 text-sm text-center">
          Current FX Rate: 1 {sourceCurrency.code} = {fxRate.toFixed(sourceCurrency.isCrypto ? 8 : 4)} {targetCurrency.code}
          {sourceCurrency.isCrypto || targetCurrency.isCrypto ? <span className="ml-2 text-purple-400">(Includes estimated DLT network fees)</span> : ''}
        </p>
      )}
      
      <div className="flex items-center justify-between text-sm mt-4">
        <label htmlFor="dynamicFeeToggle" className="text-gray-300 cursor-pointer flex items-center">
          <input
            type="checkbox"
            id="dynamicFeeToggle"
            checked={dynamicFeeEnabled}
            onChange={(e) => onToggleDynamicFee(e.target.checked)}
            className="form-checkbox h-4 w-4 text-cyan-600 rounded mr-2 bg-gray-600 border-gray-500 focus:ring-cyan-500"
          />
          Dynamic Fee Optimization (AI)
        </label>
        <span className="text-gray-500">
            <i className="fas fa-info-circle mr-1"></i>Optimizes fees across rails.
        </span>
      </div>

      <div className="mt-4">
          <label htmlFor="carbonOffsetSlider" className="block text-sm font-medium text-gray-300 mb-2">Carbon Offset Contribution ({carbonOffsetRatio * 100}%)</label>
          <input
              type="range"
              id="carbonOffsetSlider"
              min="0"
              max="1"
              step="0.05"
              value={carbonOffsetRatio}
              onChange={(e) => onCarbonOffsetChange(parseFloat(e.target.value))}
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer range-lg accent-green-500"
          />
          <p className="text-xs text-gray-500 mt-1">Offset your transaction's environmental impact through certified green projects.</p>
      </div>


      {showCurrencySelector && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-lg p-6 w-full max-w-md shadow-xl border border-cyan-800">
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-xl font-bold text-white">Select {showCurrencySelector === 'source' ? 'Source' : 'Target'} Currency</h4>
              <button onClick={() => setShowCurrencySelector(null)} className="text-gray-400 hover:text-white"><i className="fas fa-times"></i></button>
            </div>
            <div className="max-h-60 overflow-y-auto space-y-2 custom-scrollbar">
              {filterCurrencies(showCurrencySelector).map(curr => (
                <button
                  key={curr.code}
                  type="button"
                  onClick={() => {
                    if (showCurrencySelector === 'source') onSourceCurrencyChange(curr);
                    else onTargetCurrencyChange(curr);
                    setShowCurrencySelector(null);
                  }}
                  className="flex items-center space-x-3 p-3 bg-gray-800 hover:bg-cyan-900/50 rounded-lg w-full text-left transition-colors border border-gray-700"
                >
                  <span className="text-white font-medium text-lg">{curr.code}</span>
                  <span className="text-gray-400 text-sm">{curr.name}</span>
                  {curr.isCrypto && <span className="ml-auto text-purple-400 text-xs">(DLT Asset)</span>}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

/**
 * @description Configures advanced scheduling and conditional payment rules.
 */
export const AdvancedSchedulingPanel: React.FC<{
  scheduleRule: ScheduledPaymentRule;
  onRuleChange: (rule: Partial<ScheduledPaymentRule>) => void;
  isScheduled: boolean;
  onToggleSchedule: (enabled: boolean) => void;
}> = ({ scheduleRule, onRuleChange, isScheduled, onToggleSchedule }) => {
  return (
    <div className="space-y-4 p-4 bg-gray-800 rounded-lg border border-gray-700 shadow-inner">
      <h4 className="text-xl font-bold text-white mb-3">Advanced Scheduling & Automation</h4>

      <div className="flex items-center justify-between text-sm">
        <label htmlFor="scheduleToggle" className="text-gray-300 cursor-pointer flex items-center">
          <input
            type="checkbox"
            id="scheduleToggle"
            checked={isScheduled}
            onChange={(e) => onToggleSchedule(e.target.checked)}
            className="form-checkbox h-4 w-4 text-green-600 rounded mr-2 bg-gray-600 border-gray-500 focus:ring-green-500"
          />
          Enable Scheduled / Conditional Payment
        </label>
      </div>

      {isScheduled && (
        <div className="space-y-4 mt-4 p-3 bg-gray-900 rounded-lg border border-gray-800">
          <div>
            <label htmlFor="frequency" className="block text-sm font-medium text-gray-300">Frequency</label>
            <select
              id="frequency"
              value={scheduleRule.frequency}
              onChange={(e) => onRuleChange({ frequency: e.target.value as ScheduledPaymentRule['frequency'] })}
              className="mt-1 w-full bg-gray-700/50 border-gray-600 rounded-lg p-2 text-white"
            >
              <option value="once_on_date">Once on Specific Date</option>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="quarterly">Quarterly</option>
              <option value="annually">Annually</option>
              <option value="conditional_event">Conditional Event Trigger (AI Smart Contract)</option>
            </select>
          </div>

          {scheduleRule.frequency !== 'conditional_event' && (
            <div>
              <label htmlFor="startDate" className="block text-sm font-medium text-gray-300">Start Date</label>
              <input
                type="date"
                id="startDate"
                value={scheduleRule.startDate}
                onChange={(e) => onRuleChange({ startDate: e.target.value })}
                className="mt-1 w-full bg-gray-700/50 border-gray-600 rounded-lg p-2 text-white"
              />
            </div>
          )}

          {scheduleRule.frequency !== 'once_on_date' && scheduleRule.frequency !== 'conditional_event' && (
            <div>
              <label htmlFor="endDate" className="block text-sm font-medium text-gray-300">End Date (Optional)</label>
              <input
                type="date"
                id="endDate"
                value={scheduleRule.endDate || ''}
                onChange={(e) => onRuleChange({ endDate: e.target.value || undefined })}
                className="mt-1 w-full bg-gray-700/50 border-gray-600 rounded-lg p-2 text-white"
              />
            </div>
          )}

          {scheduleRule.frequency === 'conditional_event' && (
            <div className="space-y-2">
              <label htmlFor="executionCondition" className="block text-sm font-medium text-gray-300">Execution Condition (AI-driven Smart Contract Logic)</label>
              <textarea
                id="executionCondition"
                value={scheduleRule.executionCondition || ''}
                onChange={(e) => onRuleChange({ executionCondition: e.target.value })}
                rows={3}
                placeholder="e.g., if_stock_price('AAPL') > 200 and_balance_above_X or on_supply_chain_milestone_Y"
                className="mt-1 w-full bg-gray-700/50 border-gray-600 rounded-lg p-2 text-white resize-y"
              ></textarea>
              <p className="text-xs text-gray-500">Remitrax's AI will monitor this condition across integrated data feeds and execute autonomously.</p>
            </div>
          )}

          {scheduleRule.frequency !== 'once_on_date' && (
              <div>
                  <label htmlFor="maxExecutions" className="block text-sm font-medium text-gray-300">Maximum Executions (Optional)</label>
                  <input
                      type="number"
                      id="maxExecutions"
                      value={scheduleRule.maxExecutions || ''}
                      onChange={(e) => onRuleChange({ maxExecutions: parseInt(e.target.value) || undefined })}
                      placeholder="e.g., 10"
                      className="mt-1 w-full bg-gray-700/50 border-gray-600 rounded-lg p-2 text-white"
                  />
                  <p className="text-xs text-gray-500 mt-1">Limits the total number of times this payment will occur.</p>
              </div>
          )}
        </div>
      )}
    </div>
  );
};


/**
 * @description Provides a detailed pre-transaction review and summary.
 */
export const TransactionReviewPanel: React.FC<{
    amount: string;
    sourceCurrency: RemitraxCurrency;
    targetCurrency: RemitraxCurrency;
    convertedAmount: number | null;
    fxRate: number | null;
    recipient: RemitraxRecipientProfile | null;
    paymentMethod: PaymentRail;
    remittanceInfo: string;
    isScheduled: boolean;
    scheduleRule: ScheduledPaymentRule | null;
    advancedSettings: AdvancedTransactionSettings;
    estimatedFees: number;
    totalAmountCharged: number;
    securityAudit: SecurityAuditResult | null;
}> = ({
    amount, sourceCurrency, targetCurrency, convertedAmount, fxRate, recipient, paymentMethod,
    remittanceInfo, isScheduled, scheduleRule, advancedSettings, estimatedFees, totalAmountCharged, securityAudit
}) => {
    if (!recipient) return null;

    const getPaymentMethodLabel = (method: PaymentRail) => {
        switch (method) {
            case 'quantumpay': return 'QuantumPay (Instant DLT)';
            case 'cashapp': return 'Cash App (P2P)';
            case 'swift_global': return 'SWIFT Global Wire';
            case 'blockchain_dlt': return 'Blockchain DLT (EVM/Custom)';
            case 'interstellar_p2p': return 'Interstellar P2P (Distributed Ledger)';
            case 'neuro_link': return 'Neuro-Link (Biometric/Neural)';
            case 'ai_contract_escrow': return 'AI Contract Escrow (Automated)';
        }
    };

    const getRecipientIdentifier = (rec: RemitraxRecipientProfile) => {
        switch (paymentMethod) {
            case 'quantumpay': return rec.quantumTag;
            case 'cashapp': return rec.cashtag;
            case 'swift_global': return rec.swiftDetails?.accountNumber;
            case 'blockchain_dlt': return rec.blockchainAddress;
            case 'interstellar_p2p': return rec.galacticP2PId;
            case 'neuro_link': return rec.neuroLinkAddress;
            case 'ai_contract_escrow': return rec.name; // AI contracts might use names or specific identifiers
            default: return rec.name;
        }
    };

    return (
        <div className="bg-gray-800 p-6 rounded-lg border border-cyan-700 shadow-lg space-y-4">
            <h3 className="text-2xl font-bold text-white mb-4 flex items-center">
                <i className="fas fa-file-invoice-dollar mr-3 text-cyan-400"></i> Transaction Summary & Audit
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3 text-sm">
                <p className="text-gray-400">Recipient Name:</p><p className="text-white font-medium">{recipient.name}</p>
                <p className="text-gray-400">Recipient ID:</p><p className="text-cyan-300 break-all">{getRecipientIdentifier(recipient)}</p>
                <p className="text-gray-400">Payment Rail:</p><p className="text-white">{getPaymentMethodLabel(paymentMethod)}</p>
                <p className="text-gray-400">Amount Sent:</p><p className="text-white font-bold">{sourceCurrency.symbol} {parseFloat(amount).toFixed(sourceCurrency.isCrypto ? 8 : 2)} {sourceCurrency.code}</p>
                {convertedAmount !== null && (
                    <>
                        <p className="text-gray-400">Recipient Receives:</p><p className="text-green-400 font-bold">{targetCurrency.symbol} {convertedAmount.toFixed(targetCurrency.isCrypto ? 8 : 2)} {targetCurrency.code}</p>
                        <p className="text-gray-400">FX Rate:</p><p className="text-gray-300">1 {sourceCurrency.code} = {fxRate?.toFixed(targetCurrency.isCrypto ? 8 : 4) || 'N/A'} {targetCurrency.code}</p>
                    </>
                )}
                <p className="text-gray-400">Remittance Info:</p><p className="text-white italic">{remittanceInfo || 'N/A'}</p>
                <p className="text-gray-400">Estimated Fees:</p><p className="text-red-400">{sourceCurrency.symbol} {estimatedFees.toFixed(2)}</p>
                <p className="text-gray-400">Total Charged:</p><p className="text-white font-bold">{sourceCurrency.symbol} {totalAmountCharged.toFixed(2)}</p>
            </div>

            {isScheduled && scheduleRule && (
                <div className="mt-4 p-3 bg-gray-900 rounded-lg border border-gray-800">
                    <h5 className="font-semibold text-cyan-300 mb-2">Scheduled Payment Details:</h5>
                    <p className="text-gray-400 text-sm">Frequency: <span className="text-white">{scheduleRule.frequency.replace(/_/g, ' ').toUpperCase()}</span></p>
                    {scheduleRule.startDate && <p className="text-gray-400 text-sm">Start Date: <span className="text-white">{scheduleRule.startDate}</span></p>}
                    {scheduleRule.endDate && <p className="text-gray-400 text-sm">End Date: <span className="text-white">{scheduleRule.endDate}</span></p>}
                    {scheduleRule.executionCondition && <p className="text-gray-400 text-sm">Condition: <span className="text-white italic">{scheduleRule.executionCondition}</span></p>}
                </div>
            )}

            <div className="mt-4 p-3 bg-gray-900 rounded-lg border border-gray-800">
                <h5 className="font-semibold text-cyan-300 mb-2">Advanced Settings:</h5>
                <p className="text-gray-400 text-sm">Priority: <span className="text-white">{advancedSettings.priority.replace(/_/g, ' ').toUpperCase()}</span></p>
                <p className="text-gray-400 text-sm">Carbon Offset: <span className="text-green-400">{advancedSettings.carbonOffsetRatio * 100}%</span></p>
                <p className="text-gray-400 text-sm">Privacy Level: <span className="text-white">{advancedSettings.privacyLevel.replace(/_/g, ' ').toUpperCase()}</span></p>
                {advancedSettings.multiSignatureRequired && <p className="text-gray-400 text-sm">Multi-Signature Required: <span className="text-yellow-400">Yes</span></p>}
                {advancedSettings.escrowDetails && <p className="text-gray-400 text-sm">Escrow Agent: <span className="text-white">{advancedSettings.escrowDetails.agentId}</span></p>}
            </div>

            <div className="mt-4">
                <SecurityAuditDisplay auditResult={securityAudit} />
            </div>
        </div>
    );
};

// ================================================================================================
// AI-POWERED CONTEXTUAL ASSISTANCE AND PREDICTIVE INTELLIGENCE
// Remitrax AI anticipates user needs and provides proactive guidance.
// ================================================================================================

export const AIRecommendationEngine: React.FC<{
    currentAmount: string;
    currentRecipientId: string;
    onSuggestAmount: (amount: string) => void;
    onSuggestRecipient: (recipient: RemitraxRecipientProfile) => void;
    allRecipients: RemitraxRecipientProfile[];
}> = ({ currentAmount, currentRecipientId, onSuggestAmount, onSuggestRecipient, allRecipients }) => {
    const [aiInsights, setAiInsights] = useState<{ amount?: string; recipient?: RemitraxRecipientProfile; message: string }[]>([]);

    useEffect(() => {
        const fetchInsights = async () => {
            // Simulate AI processing historical data, calendar, and recent interactions
            await new Promise(resolve => setTimeout(resolve, 1500)); // AI thinking...

            const insights: typeof aiInsights = [];

            // Example 1: Suggest amount based on last payment to this recipient
            if (currentRecipientId) {
                const recentPayments = [
                    { recipientId: currentRecipientId, amount: '150.00', date: '2023-10-20' },
                    { recipientId: 'rec_456', amount: '75.00', date: '2023-10-15' },
                ]; // Mock historical data
                const lastPayment = recentPayments.find(p => p.recipientId === currentRecipientId);
                if (lastPayment && currentAmount !== lastPayment.amount) {
                    insights.push({
                        amount: lastPayment.amount,
                        message: `You usually send ${lastPayment.amount} to this recipient.`,
                    });
                }
            }

            // Example 2: Suggest a recipient based on upcoming bills (calendar integration)
            const upcomingBills = [{ recipientId: 'rec_789', amount: '250.00', name: 'Utility Co.', due: '2023-11-05' }]; // Mock
            const billRecipient = allRecipients.find(r => r.id === upcomingBills[0]?.recipientId);
            if (billRecipient && !currentRecipientId) {
                insights.push({
                    recipient: billRecipient,
                    message: `Upcoming bill for ${billRecipient.name} due ${upcomingBills[0].due}.`,
                    amount: upcomingBills[0].amount
                });
            }

            // Example 3: General financial health check
            if (parseFloat(currentAmount || '0') > 1000) {
                insights.push({ message: "High value transaction detected. Consider multi-signature approval if applicable." });
            }

            setAiInsights(insights);
        };
        fetchInsights();
    }, [currentAmount, currentRecipientId, allRecipients]);

    if (aiInsights.length === 0) {
        return <p className="text-gray-500 text-sm italic animate-pulse">Remitrax AI is analyzing your financial patterns for optimal suggestions...</p>;
    }

    return (
        <div className="bg-gray-800 p-4 rounded-lg border border-blue-700 shadow-inner space-y-3">
            <h4 className="flex items-center text-blue-300 font-semibold text-lg">
                <i className="fas fa-brain mr-2"></i> AI Assistant Insights
            </h4>
            {aiInsights.map((insight, index) => (
                <div key={index} className="text-sm text-gray-300 flex items-start">
                    <i className="fas fa-lightbulb text-blue-400 mr-2 mt-1"></i>
                    <span>
                        {insight.message}
                        {insight.amount && !currentAmount && (
                            <button onClick={() => onSuggestAmount(insight.amount!)} className="ml-2 text-cyan-400 hover:text-cyan-300 underline">
                                Use ${insight.amount}
                            </button>
                        )}
                        {insight.recipient && !currentRecipientId && (
                            <button onClick={() => onSuggestRecipient(insight.recipient!)} className="ml-2 text-cyan-400 hover:text-cyan-300 underline">
                                Select {insight.recipient.name}
                            </button>
                        )}
                    </span>
                </div>
            ))}
        </div>
    );
};


// ================================================================================================
// REMITRAX MAIN VIEW COMPONENT: SendMoneyView (The Universe)
// This is the nexus of all financial power, integrating all advanced features.
// ================================================================================================
const SendMoneyView: React.FC<SendMoneyViewProps> = ({ setActiveView }) => {
  const context = useContext(DataContext);
  if (!context) throw new Error("SendMoneyView must be used within a DataProvider");
  const { addTransaction, userPreferences, fetchRecipients, fetchCurrencies, getUserSecurityProfile } = context; // Assuming DataContext is also expanded

  // CORE TRANSACTION STATE
  const [paymentMethod, setPaymentMethod] = useState<PaymentRail>('quantumpay');
  const [amount, setAmount] = useState('');
  const [remittanceInfo, setRemittanceInfo] = useState('');

  // RECIPIENT MANAGEMENT STATE
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRecipient, setSelectedRecipient] = useState<RemitraxRecipientProfile | null>(null);
  const [allRecipients, setAllRecipients] = useState<RemitraxRecipientProfile[]>([]);
  // Placeholder for new recipient input if not found
  const [newRecipientData, setNewRecipientData] = useState<{name: string, identifier: string, kycStatus: RemitraxRecipientProfile['kycStatus']}>({name: '', identifier: '', kycStatus: 'pending'});


  // CURRENCY & FX STATE
  const [sourceCurrency, setSourceCurrency] = useState<RemitraxCurrency>({ code: 'USD', name: 'US Dollar', symbol: '$', isCrypto: false });
  const [targetCurrency, setTargetCurrency] = useState<RemitraxCurrency>({ code: 'USD', name: 'US Dollar', symbol: '$', isCrypto: false });
  const [availableCurrencies, setAvailableCurrencies] = useState<RemitraxCurrency[]>([]);
  const [convertedAmount, setConvertedAmount] = useState<number | null>(null);
  const [fxRate, setFxRate] = useState<number | null>(null);
  const [isLoadingFx, setIsLoadingFx] = useState(false);

  // ADVANCED SETTINGS STATE
  const [isScheduledPayment, setIsScheduledPayment] = useState(false);
  const [scheduleRule, setScheduleRule] = useState<ScheduledPaymentRule>({
    frequency: 'once_on_date',
    startDate: new Date().toISOString().split('T')[0],
  });
  const [advancedSettings, setAdvancedSettings] = useState<AdvancedTransactionSettings>({
    priority: 'normal',
    carbonOffsetRatio: userPreferences?.defaultCarbonOffset || 0.1, // From user preferences
    privacyLevel: 'standard',
    notificationPreferences: { email: true, sms: false, push: true, holo_alert: false },
    dynamicFeeOptimization: 'auto',
  });
  const [estimatedFees, setEstimatedFees] = useState(0);

  // SECURITY & COMPLIANCE STATE
  const [showBiometricModal, setShowBiometricModal] = useState(false);
  const [securityAuditResult, setSecurityAuditResult] = useState<SecurityAuditResult | null>(null);
  const [userSecurityProfile, setUserSecurityProfile] = useState<{mfAuthMethods: BiometricModal['mfAuthMethods']; approvalRequiredBy: BiometricModal['approvalRequiredBy']}>({
    mfAuthMethods: ['face', 'fingerprint'], // Default
    approvalRequiredBy: []
  });

  // AI & INTERACTIVE STATE
  const [currentStep, setCurrentStep] = useState(1); // 1: Input, 2: Review, 3: Confirmation
  const totalSteps = 3;


  // ================================================================================================
  // LIFECYCLE EFFECTS AND DATA FETCHING
  // ================================================================================================

  // Load initial data: recipients, currencies, user security profile
  useEffect(() => {
    // Simulate fetching from global DataContext or API
    const loadInitialData = async () => {
        // Fetch recipients
        const fetchedRecipients: RemitraxRecipientProfile[] = [
            { id: 'rec_123', name: 'Alice Quantum', quantumTag: '@aliceq', cashtag: '$aliceq', preferredCurrency: 'QNT', lastUsedDate: '2023-10-25', trustScore: 95, kycStatus: 'verified', avatarUrl: 'https://api.dicebear.com/7.x/initials/svg?seed=Alice' },
            { id: 'rec_456', name: 'Bob Cash', quantumTag: '@bobc', cashtag: '$bobc', preferredCurrency: 'USD', lastUsedDate: '2023-09-10', trustScore: 88, kycStatus: 'verified', avatarUrl: 'https://api.dicebear.com/7.x/initials/svg?seed=Bob' },
            { id: 'rec_789', name: 'Corporate Account A', swiftDetails: { bankName: 'Global Bank Inc.', bic: 'GBIUSA33', accountNumber: '1234567890' }, preferredCurrency: 'EUR', kycStatus: 'verified', trustScore: 99, avatarUrl: 'https://api.dicebear.com/7.x/initials/svg?seed=CorpA' },
            { id: 'rec_101', name: 'DLT Wallet X', blockchainAddress: '0xabc123...', preferredCurrency: 'ETH', kycStatus: 'pending', trustScore: 70, avatarUrl: 'https://api.dicebear.com/7.x/initials/svg?seed=DLT' },
        ];
        setAllRecipients(fetchedRecipients);

        // Fetch currencies
        const fetchedCurrencies: RemitraxCurrency[] = [
            { code: 'USD', name: 'US Dollar', symbol: '$', isCrypto: false },
            { code: 'EUR', name: 'Euro', symbol: '€', isCrypto: false },
            { code: 'GBP', name: 'British Pound', symbol: '£', isCrypto: false },
            { code: 'BTC', name: 'Bitcoin', symbol: '₿', isCrypto: true },
            { code: 'ETH', name: 'Ethereum', symbol: 'Ξ', isCrypto: true },
            { code: 'QNT', name: 'QuantumCoin', symbol: '¤', isCrypto: true, quantumFluctuationIndex: 0.8 }, // Custom Quantum currency
            { code: 'GLD', name: 'Digital Gold', symbol: '⚜', isCrypto: true }, // Asset-backed DLT
            { code: 'JPY', name: 'Japanese Yen', symbol: '¥', isCrypto: false },
            { code: 'CAD', name: 'Canadian Dollar', symbol: '$', isCrypto: false },
        ];
        setAvailableCurrencies(fetchedCurrencies);
        setSourceCurrency(fetchedCurrencies.find(c => c.code === 'USD') || fetchedCurrencies[0]);
        setTargetCurrency(fetchedCurrencies.find(c => c.code === 'USD') || fetchedCurrencies[0]);

        // Fetch user security profile (e.g., from `getUserSecurityProfile` in DataContext)
        // This would define which MFA methods are available/required and if multi-party approval is needed
        const security = await Promise.resolve({
            mfAuthMethods: ['face', 'fingerprint', 'voice'],
            approvalRequiredBy: [] // e.g., ['John Doe', 'Jane Smith'] for corporate
        });
        setUserSecurityProfile(security);
    };
    loadInitialData();
  }, [context]); // Assuming `context` provides data fetching functions


  // Recipient identification and pre-filling
  useEffect(() => {
    let identifiedRecipient: RemitraxRecipientProfile | undefined;
    if (searchTerm.startsWith('@')) { // QuantumTag
      identifiedRecipient = allRecipients.find(r => r.quantumTag === searchTerm);
    } else if (searchTerm.startsWith('$')) { // Cashtag
      identifiedRecipient = allRecipients.find(r => r.cashtag === searchTerm);
    } else if (searchTerm.length > 5 && (searchTerm.startsWith('0x') || searchTerm.length === 42)) { // Blockchain address heuristic
      identifiedRecipient = allRecipients.find(r => r.blockchainAddress === searchTerm);
      setPaymentMethod('blockchain_dlt');
    } else if (searchTerm.length > 0) { // Search by name
      identifiedRecipient = allRecipients.find(r => r.name.toLowerCase().includes(searchTerm.toLowerCase()));
    }
    setSelectedRecipient(identifiedRecipient || null);

    // If recipient has preferred currency, auto-select it for target
    if (identifiedRecipient?.preferredCurrency) {
        const preferred = availableCurrencies.find(c => c.code === identifiedRecipient.preferredCurrency);
        if (preferred) setTargetCurrency(preferred);
    }
  }, [searchTerm, allRecipients, availableCurrencies]);

  // FX Rate and Conversion Calculation
  useEffect(() => {
    if (parseFloat(amount) <= 0) {
      setConvertedAmount(null);
      setEstimatedFees(0);
      return;
    }

    setIsLoadingFx(true);
    // Simulate API call for FX rates and dynamic fee calculation
    const fetchConversion = async () => {
      await new Promise(resolve => setTimeout(resolve, 800)); // Simulate network delay

      let rate = 1;
      if (sourceCurrency.code !== targetCurrency.code) {
          // Mock rates, real app would call an FX API
          const mockRates: { [key: string]: { [key: string]: number } } = {
              'USD': { 'EUR': 0.93, 'GBP': 0.81, 'BTC': 0.00003, 'QNT': 1000 },
              'EUR': { 'USD': 1.07, 'GBP': 0.86, 'BTC': 0.000028, 'QNT': 1070 },
              'BTC': { 'USD': 30000, 'EUR': 28000, 'QNT': 30000000 },
              'QNT': { 'USD': 0.001, 'EUR': 0.0009, 'BTC': 0.00000003 },
              // Add more as needed
          };
          rate = mockRates[sourceCurrency.code]?.[targetCurrency.code] || 1; // Default to 1 if no rate
      }
      setFxRate(rate);

      const parsedAmount = parseFloat(amount);
      const converted = parsedAmount * rate;
      setConvertedAmount(converted);

      // Dynamic Fee Calculation (AI-driven)
      let baseFee = parsedAmount * 0.005; // 0.5% base fee
      if (sourceCurrency.isCrypto || targetCurrency.isCrypto || paymentMethod === 'blockchain_dlt') {
        baseFee += 5; // Additional DLT network/gas fee simulation
      }
      if (advancedSettings.priority === 'high') baseFee *= 1.5;
      if (advancedSettings.priority === 'ultra_quantum') baseFee *= 2.5;
      if (advancedSettings.dynamicFeeOptimization === 'auto') {
          // AI optimizes for lowest fee / fastest speed combo
          baseFee = Math.max(baseFee * 0.8, 1); // Simulate AI finding a better route
      }
      setEstimatedFees(baseFee);
      setIsLoadingFx(false);
    };
    fetchConversion();
  }, [amount, sourceCurrency, targetCurrency, advancedSettings.priority, advancedSettings.dynamicFeeOptimization, paymentMethod]);


  // Real-time Security Audit
  useEffect(() => {
    const performAudit = async () => {
        setSecurityAuditResult(null); // Reset
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate audit time

        let riskScore = 0;
        let fraudProbability = 0.01;
        const recommendations: string[] = [];
        let amlCompliance: SecurityAuditResult['amlCompliance'] = 'pass';
        let sanctionScreening: SecurityAuditResult['sanctionScreening'] = 'pass';
        let quantumSignatureIntegrity: SecurityAuditResult['quantumSignatureIntegrity'] = 'verified';

        if (parseFloat(amount) > 5000) {
            riskScore += 20;
            fraudProbability += 0.1;
            recommendations.push("High transaction value detected. Consider additional verification.");
        }
        if (selectedRecipient && selectedRecipient.kycStatus !== 'verified') {
            riskScore += 30;
            fraudProbability += 0.2;
            amlCompliance = 'review';
            recommendations.push("Recipient KYC status is not 'verified'. Review recipient details.");
        }
        if (selectedRecipient && selectedRecipient.blacklisted) {
            riskScore = 100;
            fraudProbability = 0.99;
            amlCompliance = 'fail';
            sanctionScreening = 'fail';
            recommendations.push("Recipient is on a financial blacklist. Transaction blocked.");
        }
        if (paymentMethod === 'blockchain_dlt' && !sourceCurrency.isCrypto) {
            recommendations.push("Using DLT rail for fiat currency may incur higher conversion fees.");
        }
        if (paymentMethod === 'quantumpay' && selectedRecipient && !selectedRecipient.quantumTag) {
            quantumSignatureIntegrity = 'pending';
            recommendations.push("Recipient doesn't have a QuantumTag, QuantumPay may require fallback protocol.");
        }
        if (advancedSettings.priority === 'ultra_quantum' && paymentMethod !== 'quantumpay') {
            recommendations.push("Ultra Quantum priority is best suited for QuantumPay rail.");
        }
        
        // Add more complex AI-driven checks based on user behavior, geo-location, historical data etc.
        // Example: If user usually sends $50 and suddenly sends $5000, trigger warning.

        setSecurityAuditResult({
            riskScore: Math.min(riskScore, 100),
            fraudProbability: Math.min(fraudProbability, 0.99),
            amlCompliance,
            sanctionScreening,
            quantumSignatureIntegrity,
            recommendations,
        });
    };
    performAudit();
  }, [amount, selectedRecipient, paymentMethod, sourceCurrency, advancedSettings.priority]);


  // ================================================================================================
  // EVENT HANDLERS
  // ================================================================================================

  const getRecipientFinalIdentifier = () => {
      if (selectedRecipient) {
          switch (paymentMethod) {
              case 'quantumpay': return selectedRecipient.quantumTag || selectedRecipient.name;
              case 'cashapp': return selectedRecipient.cashtag || selectedRecipient.name;
              case 'swift_global': return selectedRecipient.swiftDetails?.accountNumber || selectedRecipient.name;
              case 'blockchain_dlt': return selectedRecipient.blockchainAddress || selectedRecipient.name;
              case 'interstellar_p2p': return selectedRecipient.galacticP2PId || selectedRecipient.name;
              case 'neuro_link': return selectedRecipient.neuroLinkAddress || selectedRecipient.name;
              case 'ai_contract_escrow': return selectedRecipient.name;
          }
      }
      // Fallback for manually entered IDs
      return searchTerm;
  };

  const isFormValid = parseFloat(amount) > 0 && (!!selectedRecipient || searchTerm.trim() !== '');
  const canProceedToReview = isFormValid && securityAuditResult?.fraudProbability < 0.5 && securityAuditResult?.sanctionScreening === 'pass';

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentStep === 1 && canProceedToReview) {
        setCurrentStep(2); // Move to review step
    } else if (currentStep === 2 && isFormValid && securityAuditResult?.amlCompliance === 'pass') {
        setShowBiometricModal(true); // Initiate biometric confirmation
    }
  };
  
  const handleBiometricSuccess = () => {
    const simulateApiCall = () => {
      console.log("%c--- REMITRAX QUANTUM-SECURE TRANSACTION INITIATED (ISO 20022 / DLT Compliant) ---", "color: cyan; font-weight: bold;");
      const transactionRequest = {
          protocolVersion: 'Remitrax_v1.7_QuantumLedger', // Reflects decade of upgrades
          transactionId: `RTX_${Date.now()}_${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
          senderAccountId: 'user_local_remitrax_id', // Placeholder, real ID from context
          recipient: {
              id: selectedRecipient?.id || 'new_recipient',
              identifier: getRecipientFinalIdentifier(),
              name: selectedRecipient?.name || newRecipientData.name,
              paymentMethod: paymentMethod,
              kycStatus: selectedRecipient?.kycStatus || newRecipientData.kycStatus,
          },
          amount: parseFloat(amount),
          sourceCurrency: sourceCurrency.code,
          targetCurrency: targetCurrency.code,
          convertedAmount: convertedAmount,
          fxRate: fxRate,
          remittanceInformation: remittanceInfo,
          fees: estimatedFees,
          totalCharged: parseFloat(amount) + estimatedFees,
          advancedSettings: advancedSettings,
          schedule: isScheduledPayment ? scheduleRule : undefined,
          securityAuditSnapshot: securityAuditResult,
          timestamp: new Date().toISOString(),
          carbonFootprintGenerated: 0.1 * parseFloat(amount), // Dynamic carbon calculation
          dltTransactionHash: paymentMethod === 'blockchain_dlt' || paymentMethod === 'quantumpay' ? `0x${Math.random().toString(16).substr(2, 64)}` : undefined, // Simulated DLT hash
          quantumSignatureProof: paymentMethod === 'quantumpay' ? `QSP_${Math.random().toString(36).substring(2, 15)}` : undefined, // Simulated Quantum proof
      };
      console.log("Transaction Request Payload:", transactionRequest);
      console.log("----------------------------------------------------------------------------------");
      // In a real application, this would dispatch to a global transaction service.
      // E.g., context.sendTransaction(transactionRequest);
    };
    
    simulateApiCall();

    const newTx: Transaction = {
      id: `txn_${Date.now()}`,
      type: isScheduledPayment ? 'scheduled_expense' : 'expense',
      category: 'Transfer',
      description: `Payment to ${selectedRecipient?.name || searchTerm} via ${paymentMethod} (${remittanceInfo})`,
      amount: parseFloat(amount) + estimatedFees, // Record total amount charged including fees
      date: new Date().toISOString().split('T')[0],
      carbonFootprint: (parseFloat(amount) * advancedSettings.carbonOffsetRatio) + 0.1, // Adjusted for offset
      isScheduled: isScheduledPayment,
      scheduledRule: isScheduledPayment ? scheduleRule : undefined,
    };
    addTransaction(newTx); // Add to local context transactions
  };
  
  const handleBiometricClose = () => {
      setShowBiometricModal(false);
      // After a successful transaction, navigate to transactions view.
      // If it was cancelled or failed, stay on the send page.
      if (securityAuditResult?.amlCompliance === 'pass') { // Simplified check for success
        setTimeout(() => setActiveView(View.Transactions), 500);
      }
  };

  const handleRecipientSelection = useCallback((rec: RemitraxRecipientProfile) => {
    setSelectedRecipient(rec);
    setSearchTerm(rec.quantumTag || rec.cashtag || rec.name); // Prefill search for display
    // Auto-set payment method based on recipient's primary identifier
    if (rec.quantumTag) setPaymentMethod('quantumpay');
    else if (rec.cashtag) setPaymentMethod('cashapp');
    else if (rec.blockchainAddress) setPaymentMethod('blockchain_dlt');
    else if (rec.swiftDetails) setPaymentMethod('swift_global');
  }, []);

  const handleAISuggestAmount = (suggestedAmount: string) => {
    setAmount(suggestedAmount);
  };

  const handleAISuggestRecipient = (suggestedRecipient: RemitraxRecipientProfile) => {
    handleRecipientSelection(suggestedRecipient);
  };


  // ================================================================================================
  // RENDER LOGIC
  // ================================================================================================

  const renderCurrentStep = () => {
    switch (currentStep) {
        case 1: // Input Step
            return (
                <form onSubmit={handleSend} className="space-y-6">
                    <AIRecommendationEngine
                        currentAmount={amount}
                        currentRecipientId={selectedRecipient?.id || ''}
                        onSuggestAmount={handleAISuggestAmount}
                        onSuggestRecipient={handleAISuggestRecipient}
                        allRecipients={allRecipients}
                    />

                    <div className="p-1 bg-gray-900/50 rounded-lg flex mb-6 border border-gray-700">
                        {['quantumpay', 'cashapp', 'blockchain_dlt', 'swift_global', 'interstellar_p2p', 'neuro_link', 'ai_contract_escrow'].map(rail => (
                            <button
                                key={rail}
                                onClick={() => setPaymentMethod(rail as PaymentRail)}
                                type="button"
                                className={`flex-1 py-2.5 text-xs sm:text-sm font-medium rounded-md transition-colors whitespace-nowrap overflow-hidden text-ellipsis
                                ${paymentMethod === rail ? 'bg-cyan-600 text-white shadow-md' : 'text-gray-300 hover:bg-gray-700/50'}`}
                            >
                                {rail.replace(/_/g, ' ').split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                            </button>
                        ))}
                    </div>
                    
                    <RecipientSelector
                        selectedRecipient={selectedRecipient}
                        onSelect={handleRecipientSelection}
                        allRecipients={allRecipients}
                        paymentMethod={paymentMethod}
                        searchTerm={searchTerm}
                        onSearchChange={setSearchTerm}
                    />

                    {(!selectedRecipient && searchTerm.trim() !== '' && searchTerm.length > 3) && (
                        <div className="mt-4 p-3 bg-yellow-900/40 border border-yellow-600 rounded-lg text-yellow-300 text-sm">
                            <p className="font-semibold">Recipient not found in address book.</p>
                            <p>Transaction will proceed using raw identifier. Consider adding to contacts.</p>
                            <input
                                type="text"
                                placeholder="Recipient Full Name (Optional)"
                                value={newRecipientData.name}
                                onChange={(e) => setNewRecipientData(prev => ({...prev, name: e.target.value}))}
                                className="mt-2 w-full bg-gray-700/50 border-gray-600 rounded-lg p-2 text-white"
                            />
                        </div>
                    )}

                    <MultiCurrencyConverter
                        amount={amount}
                        onAmountChange={setAmount}
                        sourceCurrency={sourceCurrency}
                        onSourceCurrencyChange={setSourceCurrency}
                        targetCurrency={targetCurrency}
                        onTargetCurrencyChange={setTargetCurrency}
                        availableCurrencies={availableCurrencies}
                        convertedAmount={convertedAmount}
                        fxRate={fxRate}
                        isLoading={isLoadingFx}
                        dynamicFeeEnabled={advancedSettings.dynamicFeeOptimization === 'auto'}
                        onToggleDynamicFee={(enabled) => setAdvancedSettings(prev => ({ ...prev, dynamicFeeOptimization: enabled ? 'auto' : 'manual' }))}
                        carbonOffsetRatio={advancedSettings.carbonOffsetRatio}
                        onCarbonOffsetChange={(ratio) => setAdvancedSettings(prev => ({ ...prev, carbonOffsetRatio: ratio }))}
                    />
                    
                    <div>
                        <label htmlFor="remittanceInfo" className="block text-sm font-medium text-gray-300">Remittance Information (ISO 20022 / DLT Metadata)</label>
                        <input
                            type="text"
                            name="remittanceInfo"
                            value={remittanceInfo}
                            onChange={(e) => setRemittanceInfo(e.target.value)}
                            className="mt-1 w-full bg-gray-700/50 border-gray-600 rounded-lg p-2 text-white placeholder-gray-500"
                            placeholder="Invoice #12345, Project X funding, personal gift"
                        />
                        <p className="text-xs text-gray-500 mt-1">This information is secured and transmitted with your payment for full transparency.</p>
                    </div>

                    <AdvancedSchedulingPanel
                        scheduleRule={scheduleRule}
                        onRuleChange={setScheduleRule}
                        isScheduled={isScheduledPayment}
                        onToggleSchedule={setIsScheduledPayment}
                    />

                    <SecurityAuditDisplay auditResult={securityAuditResult} />

                    <button
                        type="submit"
                        disabled={!canProceedToReview || isLoadingFx || !securityAuditResult}
                        className={`w-full py-4 text-lg font-bold text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300
                            ${paymentMethod === 'quantumpay' ? 'bg-cyan-600 hover:bg-cyan-700 shadow-lg shadow-cyan-500/30' :
                              paymentMethod === 'cashapp' ? 'bg-green-600 hover:bg-green-700 shadow-lg shadow-green-500/30' :
                              paymentMethod === 'blockchain_dlt' ? 'bg-purple-600 hover:bg-purple-700 shadow-lg shadow-purple-500/30' :
                              'bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-500/30'}`}
                    >
                        {securityAuditResult?.recommendations.length > 0 && securityAuditResult.amlCompliance !== 'pass' ? 'Review & Resolve Issues' : 'Proceed to Transaction Review'}
                    </button>
                </form>
            );
        case 2: // Review Step
            return (
                <div className="space-y-6">
                    <TransactionReviewPanel
                        amount={amount}
                        sourceCurrency={sourceCurrency}
                        targetCurrency={targetCurrency}
                        convertedAmount={convertedAmount}
                        fxRate={fxRate}
                        recipient={selectedRecipient || { id: 'manual', name: newRecipientData.name || searchTerm, kycStatus: newRecipientData.kycStatus, avatarUrl: `https://api.dicebear.com/7.x/initials/svg?seed=${newRecipientData.name || searchTerm}` }}
                        paymentMethod={paymentMethod}
                        remittanceInfo={remittanceInfo}
                        isScheduled={isScheduledPayment}
                        scheduleRule={scheduleRule}
                        advancedSettings={advancedSettings}
                        estimatedFees={estimatedFees}
                        totalAmountCharged={parseFloat(amount) + estimatedFees}
                        securityAudit={securityAuditResult}
                    />
                    <div className="flex justify-between items-center mt-6">
                        <button onClick={() => setCurrentStep(1)} className="px-6 py-3 bg-gray-700/50 hover:bg-gray-700 rounded-full text-base text-gray-300 transition-all duration-200 flex items-center">
                            <i className="fas fa-arrow-left mr-2"></i> Back to Edit
                        </button>
                        <button
                            type="button"
                            onClick={handleSend}
                            disabled={!canProceedToReview || securityAuditResult?.amlCompliance !== 'pass'}
                            className={`px-8 py-4 text-lg font-bold text-white rounded-full transition-all duration-300 flex items-center justify-center
                                ${paymentMethod === 'quantumpay' ? 'bg-cyan-600 hover:bg-cyan-700 shadow-lg shadow-cyan-500/30' :
                                  paymentMethod === 'cashapp' ? 'bg-green-600 hover:bg-green-700 shadow-lg shadow-green-500/30' :
                                  paymentMethod === 'blockchain_dlt' ? 'bg-purple-600 hover:bg-purple-700 shadow-lg shadow-purple-500/30' :
                                  'bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-500/30'}
                                disabled:opacity-50 disabled:cursor-not-allowed`}
                        >
                            Confirm & Authenticate <i className="fas fa-lock ml-2"></i>
                        </button>
                    </div>
                </div>
            );
        default: return null;
    }
  };
  
  return (
      <>
        <Card title={`Send Money (Remitrax) - Step ${currentStep} of ${totalSteps}`}>
            {renderCurrentStep()}
        </Card>
        <BiometricModal
            isOpen={showBiometricModal}
            onSuccess={handleBiometricSuccess}
            onClose={handleBiometricClose}
            amount={amount}
            recipient={selectedRecipient || searchTerm}
            paymentMethod={paymentMethod}
            securityContext={userSecurityProfile.approvalRequiredBy && userSecurityProfile.approvalRequiredBy.length > 0 ? 'corporate' : 'personal'}
            mfAuthMethods={userSecurityProfile.mfAuthMethods}
            approvalRequiredBy={userSecurityProfile.approvalRequiredBy}
        />
    </>
  );
};

export default SendMoneyView;

================================================================================
// APPENDED FROM REPO: diplomat-bit/Fuckyou | ORIGINAL PATH: diplomat-bit-Fuckyou-70f83c5/components/SendMoneyView (2).tsx
================================================================================

// components/views/personal/SendMoneyView.tsx
// RE-ENACTED & EXPANDED: This component has been resurrected from its deprecated state.
// It is now "Remitrax," a complete, multi-rail payment portal featuring advanced
// security simulations and demonstrating enterprise-level integration patterns.

import React, { useState, useContext, useRef, useEffect } from 'react';
import Card from './Card';
import { DataContext } from '../context/DataContext';
import { View } from '../types';
import type { Transaction } from '../types';

// ================================================================================================
// TYPE DEFINITIONS
// ================================================================================================
type PaymentMethod = 'quantumpay' | 'cashapp';
type ScanState = 'scanning' | 'success' | 'verifying' | 'error';

// FIX: Added interface definition for component props.
interface SendMoneyViewProps {
  setActiveView: (view: View) => void;
}


// ================================================================================================
// ANIMATED UI SUB-COMPONENTS
// These provide a high-fidelity user experience during the security process.
// ================================================================================================

/**
 * @description Renders an animated checkmark icon for success feedback.
 * The animation is pure CSS, making it lightweight and performant.
 */
const AnimatedCheckmarkIcon: React.FC = () => (
    <>
        <svg className="h-24 w-24" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
            <circle className="checkmark__circle" cx="26" cy="26" r="25" fill="none" />
            <path className="checkmark__check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" />
        </svg>
        <style>{`
            .checkmark__circle {
                stroke-dasharray: 166;
                stroke-dashoffset: 166;
                stroke-width: 3;
                stroke-miterlimit: 10;
                stroke: #4ade80;
                fill: none;
                animation: stroke 0.6s cubic-bezier(0.65, 0, 0.45, 1) forwards;
            }
            .checkmark__check {
                transform-origin: 50% 50%;
                stroke-dasharray: 48;
                stroke-dashoffset: 48;
                stroke-width: 4;
                stroke: #fff;
                animation: stroke 0.3s cubic-bezier(0.65, 0, 0.45, 1) 0.8s forwards;
            }
            @keyframes stroke {
                100% { stroke-dashoffset: 0; }
            }
        `}</style>
    </>
);

/**
 * @description Renders a futuristic "quantum ledger" animation to simulate
 * secure transaction processing. This enhances perceived security and trust.
 */
const QuantumLedgerAnimation: React.FC = () => (
    <>
        <div className="quantum-grid">
            {Array.from({ length: 9 }).map((_, i) => <div key={i} className="quantum-block"></div>)}
        </div>
        <style>{`
            .quantum-grid {
                display: grid;
                grid-template-columns: repeat(3, 1fr);
                gap: 8px;
                width: 100px;
                height: 100px;
            }
            .quantum-block {
                background-color: rgba(6, 182, 212, 0.3);
                border: 1px solid #06b6d4;
                border-radius: 4px;
                animation: quantum-flash 2s infinite ease-in-out;
            }
            .quantum-block:nth-child(1) { animation-delay: 0.1s; }
            .quantum-block:nth-child(2) { animation-delay: 0.5s; }
            .quantum-block:nth-child(3) { animation-delay: 0.2s; }
            .quantum-block:nth-child(4) { animation-delay: 0.6s; }
            .quantum-block:nth-child(5) { animation-delay: 0.3s; }
            .quantum-block:nth-child(6) { animation-delay: 0.7s; }
            .quantum-block:nth-child(7) { animation-delay: 0.4s; }
            .quantum-block:nth-child(8) { animation-delay: 0.8s; }
            .quantum-block:nth-child(9) { animation-delay: 0.1s; }
            @keyframes quantum-flash {
                0%, 100% { background-color: rgba(6, 182, 212, 0.3); transform: scale(1); }
                50% { background-color: rgba(165, 243, 252, 0.8); transform: scale(1.05); }
            }
        `}</style>
    </>
);

// ================================================================================================
// HIGH-FIDELITY BIOMETRIC MODAL
// ================================================================================================

const BiometricModal: React.FC<{ 
    isOpen: boolean;
    onSuccess: () => void; 
    onClose: () => void; 
    amount: string; 
    recipient: string; 
    paymentMethod: 'QuantumPay' | 'Cash App';
}> = ({ isOpen, onSuccess, onClose, amount, recipient, paymentMethod }) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [scanState, setScanState] = useState<ScanState>('scanning');
    const [verificationStep, setVerificationStep] = useState(0);

    const verificationMessages = [
        `Heuristic API: Validating ${recipient}'s identity...`,
        'Heuristic API: Checking sufficient funds...',
        'Heuristic API: Executing transaction on secure ledger...',
        'Heuristic API: Confirming transfer...',
    ];

    // Effect to manage camera stream and the multi-step verification flow.
    useEffect(() => {
        if (!isOpen) {
            setScanState('scanning');
            setVerificationStep(0);
            return;
        };

        let stream: MediaStream | null = null;
        const startCamera = async () => {
            try {
                stream = await navigator.mediaDevices.getUserMedia({ video: true });
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                }
            } catch (err) {
                console.error("Camera access denied:", err);
                setScanState('error');
            }
        };
        startCamera();

        // Timers to simulate the multi-stage verification process.
        const successTimer = setTimeout(() => setScanState('success'), 3000);
        const verifyTimer = setTimeout(() => setScanState('verifying'), 4000);
        const successActionTimer = setTimeout(onSuccess, 8500);
        const closeTimer = setTimeout(onClose, 9500);

        return () => {
            clearTimeout(successTimer);
            clearTimeout(verifyTimer);
            clearTimeout(successActionTimer);
            clearTimeout(closeTimer);
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
            }
        };
    }, [isOpen, onSuccess, onClose]);
    
    // Effect to cycle through the verification messages.
    useEffect(() => {
        if (scanState === 'verifying') {
            const interval = setInterval(() => {
                setVerificationStep(prev => Math.min(prev + 1, verificationMessages.length - 1));
            }, 1000);
            return () => clearInterval(interval);
        }
    }, [scanState, verificationMessages.length]);

    const getTitle = () => {
        switch (scanState) {
            case 'scanning': return 'Scanning Face';
            case 'success': return 'Identity Confirmed';
            case 'verifying': return 'Quantum Ledger Verification';
            case 'error': return 'Verification Failed';
        }
    }
    
    return (
        <div className={`fixed inset-0 bg-black/70 flex items-end sm:items-center justify-center z-50 backdrop-blur-sm transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
            <div className={`bg-gray-800 rounded-t-2xl sm:rounded-2xl p-8 max-w-sm w-full text-center border-t sm:border border-gray-700 transition-transform duration-300 ease-out transform ${isOpen ? 'translate-y-0' : 'translate-y-full'}`}>
                <div className="relative w-64 h-64 mx-auto rounded-full overflow-hidden border-4 border-gray-600 mb-6">
                    <video ref={videoRef} autoPlay muted playsInline className="absolute top-0 left-0 w-full h-full object-cover transform scale-x-[-1]"></video>
                    {scanState === 'scanning' && <div className="absolute inset-0 bg-grid-pattern animate-scan"></div>}
                    {scanState === 'success' && <div className="absolute inset-0 bg-green-500/50 flex items-center justify-center"><AnimatedCheckmarkIcon /></div>}
                    {scanState === 'verifying' && <div className="absolute inset-0 bg-black/50 flex items-center justify-center"><QuantumLedgerAnimation /></div>}
                    {scanState === 'error' && <div className="absolute inset-0 bg-red-500/50 flex items-center justify-center p-4"><p>Camera not found. Cannot complete biometric verification.</p></div>}
                </div>
                <h3 className="text-2xl font-bold text-white">{getTitle()}</h3>
                <p className="text-gray-400 mt-2">{scanState === 'verifying' ? verificationMessages[verificationStep] : `Sending $${amount} to ${recipient} via ${paymentMethod}`}</p>
                {scanState === 'scanning' && <button onClick={onClose} className="mt-6 px-4 py-2 bg-gray-700/50 hover:bg-gray-700 rounded-lg text-sm text-gray-300">Cancel</button>}
            </div>
             <style>{`.bg-grid-pattern{background-image:linear-gradient(rgba(0,255,255,0.2) 1px,transparent 1px),linear-gradient(90deg,rgba(0,255,255,0.2) 1px,transparent 1px);background-size:2rem 2rem}@keyframes scan-effect{0%{background-position:0 0}100%{background-position:0 -4rem}}.animate-scan{animation:scan-effect 1.5s linear infinite}`}</style>
        </div>
    );
};

// ================================================================================================
// MAIN VIEW COMPONENT: SendMoneyView (Remitrax)
// ================================================================================================
const SendMoneyView: React.FC<SendMoneyViewProps> = ({ setActiveView }) => {
  const context = useContext(DataContext);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('quantumpay');
  const [amount, setAmount] = useState('');
  const [quantumTag, setQuantumTag] = useState('');
  const [remittance, setRemittance] = useState('');
  const [cashtag, setCashtag] = useState('');
  const [showModal, setShowModal] = useState(false);

  if (!context) throw new Error("SendMoneyView must be used within a DataProvider");
  const { addTransaction } = context;

  const recipient = paymentMethod === 'quantumpay' ? quantumTag : cashtag;
  const isFormValid = parseFloat(amount) > 0 && recipient.trim() !== '';

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (isFormValid) setShowModal(true);
  };
  
  const handleSuccess = () => {
    const simulateApiCall = () => {
      // In a real application, this would use a library like axios or fetch.
      // This simulation demonstrates knowledge of how such an API call would be structured.
      const requestBody = {
          "to_account_id": recipient,
          "amount": amount,
          "currency": "USD",
          "description": remittance || `QuantumBank payment`
      };
      console.log("%c--- SIMULATING OPEN BANKING API CALL (ISO 20022 Compliant) ---", "color: cyan; font-weight: bold;");
      console.log("Endpoint: POST /my/payments");
      console.log("Body:", requestBody);
      console.log("-----------------------------------------");
    };
    
    if (paymentMethod === 'quantumpay') simulateApiCall();

    const newTx: Transaction = {
      id: `txn_${Date.now()}`,
      type: 'expense',
      category: 'Transfer',
      description: `Payment to ${recipient}`,
      amount: parseFloat(amount),
      date: new Date().toISOString().split('T')[0],
      carbonFootprint: 0.1,
    };
    addTransaction(newTx);
  };
  
  const handleClose = () => {
      setShowModal(false);
      setTimeout(() => setActiveView(View.Transactions), 350);
  };
  
  return (
      <>
        <Card title="Send Money (Remitrax)">
            <div className="p-1 bg-gray-900/50 rounded-lg flex mb-6">
                <button onClick={() => setPaymentMethod('quantumpay')} className={`w-1/2 py-2.5 text-sm font-medium rounded-md transition-colors ${paymentMethod === 'quantumpay' ? 'bg-cyan-600 text-white' : 'text-gray-300 hover:bg-gray-700/50'}`}>QuantumPay (ISO20022)</button>
                <button onClick={() => setPaymentMethod('cashapp')} className={`w-1/2 py-2.5 text-sm font-medium rounded-md transition-colors ${paymentMethod === 'cashapp' ? 'bg-green-600 text-white' : 'text-gray-300 hover:bg-gray-700/50'}`}>Cash App</button>
            </div>
            
            <form onSubmit={handleSend} className="space-y-6">
                 {paymentMethod === 'quantumpay' ? (
                    <>
                        <div><label htmlFor="quantumTag" className="block text-sm font-medium text-gray-300">Recipient's @QuantumTag</label><input type="text" name="quantumTag" value={quantumTag} onChange={(e) => setQuantumTag(e.target.value)} className="mt-1 w-full bg-gray-700/50 border-gray-600 rounded-lg p-2 text-white" placeholder="@the_future"/></div>
                        <div><label htmlFor="remittance" className="block text-sm font-medium text-gray-300">Remittance Info (ISO 20022)</label><input type="text" name="remittance" value={remittance} onChange={(e) => setRemittance(e.target.value)} className="mt-1 w-full bg-gray-700/50 border-gray-600 rounded-lg p-2 text-white" placeholder="Invoice #12345"/></div>
                    </>
                 ) : (
                    <div><label htmlFor="cashtag" className="block text-sm font-medium text-gray-300">Recipient's $Cashtag</label><input type="text" name="cashtag" value={cashtag} onChange={(e) => setCashtag(e.target.value)} className="mt-1 w-full bg-gray-700/50 border-gray-600 rounded-lg p-2 text-white" placeholder="$new_beginnings"/></div>
                 )}
                <div>
                    <label htmlFor="amount" className="block text-sm font-medium text-gray-300">Amount</label>
                    <div className="mt-1 relative"><div className="pointer-events-none absolute inset-y-0 left-0 pl-3 flex items-center"><span className="text-gray-400">$</span></div><input type="number" name="amount" value={amount} onChange={(e) => setAmount(e.target.value)} className="w-full bg-gray-700/50 border-gray-600 rounded-lg pl-7 p-2 text-white" placeholder="0.00"/></div>
                </div>
                <button type="submit" disabled={!isFormValid} className={`w-full py-3 text-sm font-medium text-white rounded-lg disabled:opacity-50 ${paymentMethod === 'quantumpay' ? 'bg-cyan-600 hover:bg-cyan-700' : 'bg-green-600 hover:bg-green-700'}`}>Send with Biometric Confirmation</button>
            </form>
        </Card>
        <BiometricModal isOpen={showModal} onSuccess={handleSuccess} onClose={handleClose} amount={amount} recipient={recipient} paymentMethod={paymentMethod === 'quantumpay' ? 'QuantumPay' : 'Cash App'} />
    </>
  );
};

export default SendMoneyView;


================================================================================
// APPENDED FROM REPO: diplomat-bit/Fuckyou | ORIGINAL PATH: diplomat-bit-Fuckyou-70f83c5/components/SendMoneyView (3).tsx
================================================================================

// components/SendMoneyView.tsx
// This component is undergoing a major refactor to transition from a deprecated, insecure prototype
// to a stable, production-ready financial transaction interface. The original "NexusPay" was intentionally
// flawed, lacking compliance, robust encryption, and secure authentication. This refactor replaces
// those components with modern, secure, and efficient patterns.

import React, { useState, useContext, useRef, useEffect, useCallback } from 'react';
import Card from './Card'; // Assuming Card is a reusable UI component
import { DataContext } from '../context/DataContext';
import { View } from '../types'; // Assuming View type is defined elsewhere
import type { Transaction } from '../types'; // Assuming Transaction type is defined elsewhere

// ================================================================================================
// REFACTORED TYPE DEFINITIONS (Lean and Production-Focused)
// ================================================================================================

// Payment Rail types are now consolidated and focus on common, stable protocols.
export type PaymentRail = 'quantumpay_stable' | 'cashapp_v2' | 'swift_iso20022' | 'blockchain_erc20' | 'ripple_ledger' | 'fedwire_rtgs';

// ScanState is simplified to reflect common verification stages.
export type ScanState = 'scanning' | 'verifying' | 'success' | 'error';

// RemitraxRecipientProfile is streamlined for essential recipient data.
export interface RemitraxRecipientProfile {
  id: string;
  name: string;
  legalEntityName?: string; // For corporate entities
  taxId?: string; // Essential for compliance
  avatarUrl?: string;
  preferredCurrency?: string;
  kycStatus?: 'verified' | 'pending' | 'unverified';
  bankAccounts?: { bankName: string; accountNumber: string; routingNumber?: string; iban?: string; swiftCode?: string; accountType: 'checking' | 'savings' | 'corporate'; }[];
  eWalletDetails?: { type: 'paypal' | 'venmo' | 'zelle' | 'cashapp_v2'; identifier: string; }[];
  // Removed legacy/experimental fields like quantumTag, cashtag, neuroLinkAddress, galacticP2PId, etc.
  // Compliance and risk fields are now managed via a separate, standardized service.
}

// RemitraxCurrency is simplified to core attributes.
export interface RemitraxCurrency {
  code: string;
  name: string;
  symbol: string;
  isCrypto: boolean;
  decimalPlaces: number;
  // Removed experimental fields like quantumFluctuationIndex, liquidityScore, etc.
}

// ScheduledPaymentRule is simplified to core recurrence and conditional logic.
export interface ScheduledPaymentRule {
  frequency: 'daily' | 'weekly' | 'monthly' | 'annually' | 'once_on_date';
  startDate: string;
  endDate?: string;
  executionCondition?: string; // Basic conditional logic string
  paymentReason?: string;
}

// AdvancedTransactionSettings are refactored for security and compliance.
export interface AdvancedTransactionSettings {
  priority: 'low' | 'normal' | 'high';
  // Removed experimental/non-standard fields like carbonOffsetRatio, privacyLevel, receiptPreference, multiSignatureRequired, escrowDetails, dynamicFeeOptimization, dlcDetails, postQuantumSecurityEnabled, aiComplianceCheckLevel.
  dataEncryptionStandard: 'aes256_gcm' | 'rsa_oaep'; // Standardized and secure options
  routeOptimizationPreference: 'speed' | 'cost' | 'compliance'; // Focus on practical optimizations
  notificationPreferences: { email: boolean; sms: boolean; push: boolean; dlt_confirmation: boolean; };
}

// SecurityAuditResult is standardized for critical security and compliance metrics.
export interface SecurityAuditResult {
  riskScore: number; // Normalized risk score (0-100)
  fraudProbability: number; // Probability of fraud (0.0-1.0)
  amlCompliance: 'pass' | 'fail' | 'review'; // AML check status
  sanctionScreening: 'pass' | 'fail' | 'partial_match'; // Sanctions list check status
  recommendations: string[]; // Actionable recommendations
  // Removed non-standard fields like quantumSignatureIntegrity, threatVectorAnalysis, aiConfidenceScore.
}

// EnvironmentalImpactReport is removed as it's out of scope for the core MVP.
// Future modules can reintroduce this.

// RailSpecificDetails is consolidated and simplified.
export interface RailSpecificDetails {
    swift?: { bic: string; accountNumber: string; beneficiaryAddress?: string; };
    blockchain?: { network: 'ethereum' | 'polygon'; contractAddress?: string; tokenAddress?: string; };
    ripple?: { destinationTag?: string; };
    fedwire?: { routingNumber: string; };
    // Removed experimental rails.
}

interface SendMoneyViewProps {
  setActiveView: (view: View) => void;
}

// ================================================================================================
// STATIC UI SUB-COMPONENTS (Cleaned and Standardized)
// ================================================================================================

// AnimatedCheckmarkIcon: Standardized success animation.
export const AnimatedCheckmarkIcon: React.FC = () => (
    <>
        <svg className="h-24 w-24 transform scale-125" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
            <defs>
                <linearGradient id="checkmarkGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#4ade80" />
                    <stop offset="50%" stopColor="#86efac" />
                    <stop offset="100%" stopColor="#22c55e" />
                </linearGradient>
            </defs>
            <circle className="checkmark__circle" cx="26" cy="26" r="25" fill="none" stroke="url(#checkmarkGradient)" strokeWidth="4" strokeMiterlimit="10" />
            <path className="checkmark__check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" />
        </svg>
        <style>{`
            .checkmark__circle { stroke-dasharray: 166; stroke-dashoffset: 166; animation: stroke-circle 0.6s cubic-bezier(0.65, 0, 0.45, 1) forwards; }
            .checkmark__check { transform-origin: 50% 50%; stroke-dasharray: 48; stroke-dashoffset: 48; stroke-width: 5; animation: stroke-check 0.3s cubic-bezier(0.65, 0, 0.45, 1) 0.8s forwards; }
            @keyframes stroke-circle { 100% { stroke-dashoffset: 0; } }
            @keyframes stroke-check { 100% { stroke-dashoffset: 0; } }
        `}</style>
    </>
);

// BiometricModal: Refactored for clarity and standard authentication flow.
// Replaces legacy scan states with standard ones. Removed experimental animations.
export const BiometricModal: React.FC<{
    isOpen: boolean; onSuccess: () => void; onClose: () => void; amount: string; recipient: RemitraxRecipientProfile | string; paymentMethod: PaymentRail;
}> = ({ isOpen, onSuccess, onClose, amount, recipient, paymentMethod }) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [scanState, setScanState] = useState<ScanState>('scanning');
    const [biometricProgress, setBiometricProgress] = useState(0);
    const recipientName = typeof recipient === 'string' ? recipient : recipient.name || 'Unknown Entity';

    // Simplified verification messages focusing on standard security protocols.
    const verificationMessages = [
        `Verifying transaction details for ${recipientName}...`,
        `Performing AML and Sanctions Check...`,
        `Authenticating with secure biometric data...`,
        `Finalizing transaction on ${paymentMethod} ledger...`
    ];
    const [currentVerificationMessageIndex, setCurrentVerificationMessageIndex] = useState(0);

    useEffect(() => {
        if (!isOpen) {
            setScanState('scanning');
            setBiometricProgress(0);
            setCurrentVerificationMessageIndex(0);
            return;
        }
        
        let stream: MediaStream | null = null;
        const startCamera = async () => {
            try {
                stream = await navigator.mediaDevices.getUserMedia({ video: true });
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                    videoRef.current.play();
                }
            } catch (err) {
                console.error("Camera access denied or failed:", err);
                setScanState('error');
            }
        };
        startCamera();

        // Simulate progress and state transitions
        const progressInterval = setInterval(() => setBiometricProgress(prev => Math.min(prev + Math.random() * 10, 100)), 300);
        
        const stateSequence = [
            { state: 'verifying', delay: 4000 }, // Simulate initial scan and data gathering
            { state: 'success', delay: 3000 }  // Simulate successful verification
        ];

        let currentDelay = 0;
        stateSequence.forEach(({ state, delay }) => {
            currentDelay += delay;
            setTimeout(() => setScanState(state as ScanState), currentDelay);
        });

        const successActionTimer = setTimeout(onSuccess, currentDelay + 1500);
        const closeTimer = setTimeout(onClose, currentDelay + 3000); // Close modal after a short delay post-success

        return () => {
            clearInterval(progressInterval);
            stateSequence.forEach(({ state, delay }) => clearTimeout(setTimeout(() => {}, delay))); // Clear scheduled timeouts
            clearTimeout(successActionTimer);
            clearTimeout(closeTimer);
            if (stream) stream.getTracks().forEach(track => track.stop());
        };
    }, [isOpen, onSuccess, onClose, amount, recipient, paymentMethod]);

    // Update verification message based on state and progress
    useEffect(() => {
        if (scanState === 'verifying') {
            const messageInterval = setInterval(() => {
                setCurrentVerificationMessageIndex(prev => Math.min(prev + 1, verificationMessages.length - 1));
            }, 1500); // Change message every 1.5 seconds
            return () => clearInterval(messageInterval);
        }
    }, [scanState, verificationMessages.length]);

    const getTitle = () => {
        switch (scanState) {
            case 'scanning': return 'Biometric Scan';
            case 'verifying': return 'Verifying Transaction';
            case 'success': return 'Authentication Successful';
            case 'error': return 'Authentication Failed';
            default: return 'Processing';
        }
    };

    const getStatusMessage = () => {
        switch (scanState) {
            case 'scanning': return `Awaiting biometric input. Progress: ${biometricProgress.toFixed(0)}%`;
            case 'verifying': return verificationMessages[currentVerificationMessageIndex] || "Processing...";
            case 'success': return `Transaction of $${amount} authorized for ${recipientName}.`;
            case 'error': return "Biometric scan failed. Please try again.";
            default: return "Processing...";
        }
    }

    // Simplified UI for Biometric Modal
    return (
        <div className={`fixed inset-0 bg-black/90 flex items-center justify-center z-50 backdrop-blur-xl transition-opacity duration-500 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
            <div className={`bg-gray-950 rounded-3xl p-8 max-w-xl w-full text-center border-4 border-double ${scanState === 'success' ? 'border-green-600' : 'border-cyan-700'} shadow-2xl transition-transform duration-500 ${isOpen ? 'translate-y-0 scale-100' : 'translate-y-full scale-90'}`}>
                <h3 className="text-4xl font-black text-white mb-6 tracking-wide">{getTitle()}</h3>
                <div className="relative w-[300px] h-[300px] mx-auto rounded-full overflow-hidden border-4 border-cyan-600 mb-6 shadow-inner shadow-cyan-900">
                    {scanState !== 'success' && scanState !== 'error' && (
                        <video ref={videoRef} autoPlay muted playsInline className="absolute top-0 left-0 w-full h-full object-cover transform scale-x-[-1]"></video>
                    )}
                    {scanState === 'success' && <div className="absolute inset-0 bg-green-700/60 flex items-center justify-center"><AnimatedCheckmarkIcon /></div>}
                    {scanState === 'error' && <div className="absolute inset-0 bg-red-700/60 flex items-center justify-center text-red-200 text-4xl font-bold">X</div>}
                    {scanState === 'scanning' && (
                        <div className="absolute inset-0 bg-gray-900/70 flex items-center justify-center">
                            <div className="animate-pulse text-lg text-cyan-300">Scanning...</div>
                        </div>
                    )}
                </div>
                <p className="text-lg text-gray-200 mt-4 font-light">{getStatusMessage()}</p>
            </div>
        </div>
    );
};

// ================================================================================================
// REMITRAX SIDE VIEW COMPONENT (Production-Ready Form Interface)
// ================================================================================================

const SendMoneyView: React.FC<SendMoneyViewProps> = ({ setActiveView }) => {
    const context = useContext(DataContext);
    // Error handling for missing context is critical.
    if (!context) throw new Error("SendMoneyView must be used within a DataProvider");
    const { addTransaction, availableCurrencies, recipients } = context; // Assuming these are stable context values.

    // --- State Management ---
    const [amount, setAmount] = useState('');
    const [recipientIdentifier, setRecipientIdentifier] = useState('');
    const [selectedRecipient, setSelectedRecipient] = useState<RemitraxRecipientProfile | null>(null);
    const [paymentMethod, setPaymentMethod] = useState<PaymentRail>('quantumpay_stable'); // Default to a stable, modern rail.
    const [currencyCode, setCurrencyCode] = useState('USD');
    const [advancedSettings, setAdvancedSettings] = useState<AdvancedTransactionSettings>({
        priority: 'normal',
        dataEncryptionStandard: 'aes256_gcm', // Default to a secure standard.
        routeOptimizationPreference: 'speed',
        notificationPreferences: { email: true, sms: false, push: true, dlt_confirmation: true }
    });
    const [showBiometricModal, setShowBiometricModal] = useState(false);
    const [securityAudit, setSecurityAudit] = useState<SecurityAuditResult | null>(null);
    const [currentStep, setCurrentStep] = useState(1); // 1: Input, 2: Review, 3: Processing (Biometric Modal)

    // --- Derived State and Validation ---
    const currentCurrency = availableCurrencies.find(c => c.code === currencyCode) || { code: 'USD', name: 'US Dollar', symbol: '$', isCrypto: false, decimalPlaces: 2 };
    const parsedAmount = parseFloat(amount);
    // Input validation is crucial.
    const isValidInput = !isNaN(parsedAmount) && parsedAmount > 0 && (selectedRecipient || recipientIdentifier);

    // --- Recipient Lookup with Debouncing ---
    // Replaced complex AI lookup with a simulated, debounced search against a local recipients list.
    // In a real app, this would call a dedicated search/validation API.
    useEffect(() => {
        const lookupRecipient = async () => {
            if (!recipientIdentifier) {
                setSelectedRecipient(null);
                setSecurityAudit(null); // Clear audit if identifier is removed.
                return;
            }
            
            // Simulate API call for recipient lookup and initial security assessment.
            // In production, this would be an API call to a backend service.
            console.log(`Simulating recipient lookup for: ${recipientIdentifier}`);
            await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network latency.

            const foundRecipient = recipients.find(r => 
                r.name.toLowerCase().includes(recipientIdentifier.toLowerCase()) || 
                r.id === recipientIdentifier ||
                r.legalEntityName?.toLowerCase().includes(recipientIdentifier.toLowerCase())
            );
            
            if (foundRecipient) {
                setSelectedRecipient(foundRecipient);
                // Simulate Security Audit based on recipient profile & transaction details.
                // This would typically involve a call to a dedicated security/compliance microservice.
                setSecurityAudit({
                    riskScore: foundRecipient.kycStatus === 'unverified' ? 60 : 25, // Higher risk if unverified
                    fraudProbability: foundRecipient.kycStatus === 'unverified' ? 0.05 : 0.01,
                    amlCompliance: foundRecipient.kycStatus === 'unverified' ? 'review' : 'pass',
                    sanctionScreening: 'pass', // Assume pass for simplicity, real system would integrate external checks.
                    recommendations: foundRecipient.kycStatus === 'unverified' ? ["Mandatory secondary review required."] : [],
                });
            } else {
                setSelectedRecipient(null);
                // For unknown recipients, simulate a preliminary audit.
                setSecurityAudit({
                    riskScore: 40, // Moderate risk for unknown entity
                    fraudProbability: 0.02,
                    amlCompliance: 'review', // Needs review
                    sanctionScreening: 'pass',
                    recommendations: ["Verify recipient identity and banking details thoroughly."],
                });
            }
        };
        // Debounce the lookup to avoid excessive calls during typing.
        const debounceLookup = setTimeout(lookupRecipient, 500);
        return () => clearTimeout(debounceLookup);
    }, [recipientIdentifier, recipients]); // Dependencies ensure re-run when identifier or recipient list changes.

    // --- Dynamic Settings Handlers ---
    const handleAdvancedSettingChange = useCallback((key: keyof AdvancedTransactionSettings, value: any) => {
        setAdvancedSettings(prev => {
            if (key === 'notificationPreferences') {
                // Ensure deep merge for notification preferences.
                return { ...prev, notificationPreferences: { ...prev.notificationPreferences, ...value } };
            }
            return { ...prev, [key]: value };
        });
    }, []);

    // --- Core Action Handlers ---
    const handleSendClick = () => {
        if (!isValidInput) {
            alert("Please enter a valid amount and recipient.");
            return;
        }

        if (currentStep === 1) {
            setCurrentStep(2); // Proceed to review step.
        } else if (currentStep === 2) {
            // Step 2: Review -> Trigger Biometric Authentication.
            // The biometric modal will handle the final transaction submission upon success.
            setShowBiometricModal(true);
        }
    };

    // Callback for when biometric authentication is successful.
    const handleBiometricSuccess = () => {
        // This is the critical point where the transaction is finalized.
        // It should call a robust backend API for transaction processing.
        // For this example, we simulate adding to local context and show confirmation.
        
        const finalRecipient = selectedRecipient || { id: 'external', name: recipientIdentifier }; // Use identifier if recipient not found.
        
        // Construct the transaction object.
        const newTx: Transaction = {
            id: `tx_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`, // Unique ID generation.
            type: 'debit', // Transaction type.
            category: 'External Transfer', // Simplified category.
            description: `Sent ${amount} ${currencyCode} to ${finalRecipient.name} via ${paymentMethod}.`, // Clear description.
            amount: parsedAmount,
            currency: currencyCode,
            date: new Date().toISOString(),
            status: 'Pending Confirmation', // Initial status.
            metadata: {
                paymentRail: paymentMethod,
                encryption: advancedSettings.dataEncryptionStandard,
                routeOptimization: advancedSettings.routeOptimizationPreference,
                recipientId: finalRecipient.id,
                recipientName: finalRecipient.name,
                // Add other relevant metadata here after backend integration.
            }
        };
        
        addTransaction(newTx); // Add to context (simulates backend call).
        setShowBiometricModal(false); // Close the modal.
        setCurrentStep(4); // Move to confirmation step.
    };

    // --- Render Functions for Each Step ---
    const renderStep1Input = () => (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Recipient Input */}
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Recipient Identifier (Name, ID, or Account Number)</label>
                    <input 
                        type="text" 
                        value={recipientIdentifier} 
                        onChange={e => setRecipientIdentifier(e.target.value)} 
                        className="w-full bg-gray-800 border border-cyan-600 rounded-lg p-3 text-white text-lg focus:ring-cyan-500 focus:border-cyan-500 transition shadow-sm" 
                        placeholder="Enter Recipient Name or Unique ID..." 
                    />
                    {selectedRecipient && (
                        <p className="text-xs mt-1 text-green-400">Found: {selectedRecipient.name} ({selectedRecipient.legalEntityName ? 'Business' : 'Individual'}) - KYC: {selectedRecipient.kycStatus}</p>
                    )}
                    {!selectedRecipient && recipientIdentifier && (
                         <p className="text-xs mt-1 text-yellow-400">Recipient not found in registry. Proceeding with external transfer protocols.</p>
                    )}
                </div>
                
                {/* Amount and Currency Input */}
                <div className="flex flex-col">
                    <label className="block text-sm font-medium text-gray-300 mb-1">Amount</label>
                    <div className="flex rounded-lg border border-cyan-600 overflow-hidden shadow-sm">
                        <input 
                            type="number" 
                            value={amount} 
                            onChange={e => setAmount(e.target.value)} 
                            className="w-2/3 bg-gray-800 border-r border-gray-700 p-3 text-white text-xl font-mono focus:ring-cyan-500 focus:border-cyan-500" 
                            placeholder="0.00" 
                            step={currentCurrency.isCrypto ? "0.00000001" : "0.01"}
                        />
                        <select 
                            value={currencyCode} 
                            onChange={e => setCurrencyCode(e.target.value)} 
                            className="w-1/3 bg-gray-700 p-3 text-white text-base appearance-none cursor-pointer focus:ring-cyan-500 focus:border-cyan-500"
                        >
                            {availableCurrencies.slice(0, 5).map(c => ( // Limit displayed currencies for simplicity
                                <option key={c.code} value={c.code}>{c.code}</option>
                            ))}
                            {/* Add more options or a searchable dropdown for production */}
                            <option disabled>...</option>
                            <option value="BTC">BTC</option>
                            <option value="ETH">ETH</option>
                        </select>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Payment Rail Selection */}
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Payment Rail</label>
                    <select 
                        value={paymentMethod} 
                        onChange={e => setPaymentMethod(e.target.value as PaymentRail)} 
                        className="w-full bg-gray-800 border border-cyan-600 rounded-lg p-3 text-white appearance-none cursor-pointer focus:ring-cyan-500 focus:border-cyan-500 shadow-sm"
                    >
                        <option value="quantumpay_stable">QuantumPay (Stable DLT)</option>
                        <option value="fedwire_rtgs">FedWire RTGS (USD High Value)</option>
                        <option value="blockchain_erc20">Blockchain (ETH/ERC20)</option>
                        <option value="swift_iso20022">SWIFT ISO 20022</option>
                        <option value="ripple_ledger">Ripple Ledger</option>
                        <option value="cashapp_v2">Cash App (v2)</option>
                    </select>
                </div>

                {/* Transaction Priority */}
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Transaction Priority</label>
                    <select 
                        value={advancedSettings.priority} 
                        onChange={e => handleAdvancedSettingChange('priority', e.target.value as AdvancedTransactionSettings['priority'])} 
                        className="w-full bg-gray-800 border border-cyan-600 rounded-lg p-3 text-white appearance-none cursor-pointer focus:ring-cyan-500 focus:border-cyan-500 shadow-sm"
                    >
                        <option value="high">High (Expedited)</option>
                        <option value="normal">Normal</option>
                        <option value="low">Low (Batch Processing)</option>
                    </select>
                </div>
            </div>

            {/* Display Security Audit Summary */}
            {securityAudit && (
                <div className="mt-6 p-4 bg-gray-800 rounded-xl border border-gray-700 shadow-sm space-y-3">
                    <h4 className="text-lg font-bold text-cyan-400 border-b border-gray-700 pb-2 flex justify-between items-center">
                        Security & Compliance Scan
                        <span className="text-xs text-gray-400">Status: {securityAudit.amlCompliance.toUpperCase()}</span>
                    </h4>
                    <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                        <p className="text-gray-400">Risk Score:</p><p className={`font-bold ${securityAudit.riskScore > 75 ? 'text-red-400' : securityAudit.riskScore > 40 ? 'text-yellow-400' : 'text-green-400'}`}>{securityAudit.riskScore}/100</p>
                        <p className="text-gray-400">Fraud Probability:</p><p className={`font-bold ${securityAudit.fraudProbability > 0.05 ? 'text-red-400' : 'text-green-400'}`}>{`${(securityAudit.fraudProbability * 100).toFixed(2)}%`}</p>
                        <p className="text-gray-400">Sanction Screening:</p><p className={securityAudit.sanctionScreening === 'fail' ? 'text-red-400 font-bold' : 'text-green-400 font-bold'}>{securityAudit.sanctionScreening.toUpperCase()}</p>
                    </div>
                    {securityAudit.recommendations.length > 0 && (
                        <div className="mt-3 p-3 bg-yellow-900/30 border border-yellow-600 rounded-lg text-sm">
                            <p className="font-bold text-yellow-300 mb-1">Recommendations ({securityAudit.recommendations.length}):</p>
                            <ul className="list-disc list-inside text-xs text-yellow-200 space-y-1">{securityAudit.recommendations.map((rec, i) => <li key={i}>{rec}</li>)}</ul>
                        </div>
                    )}
                </div>
            )}
        </div>
    );

    // Render function for the review step.
    const renderStep2Review = () => {
        const finalRecipient = selectedRecipient || { id: 'external', name: recipientIdentifier };
        // Ensure amount is formatted correctly based on currency decimal places.
        const formattedAmount = parsedAmount.toFixed(currentCurrency.decimalPlaces);
        
        return (
            <div className="space-y-5">
                {/* Transaction Summary Card */}
                <Card title="Transaction Summary">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <p className="text-gray-400 col-span-1 md:col-span-2">Recipient:</p>
                        <p className="font-semibold text-white col-span-1 md:col-span-2">{finalRecipient.name} {finalRecipient.legalEntityName && `(${finalRecipient.legalEntityName})`}</p>
                        
                        <p className="text-gray-400">Amount:</p>
                        <p className="text-3xl font-extrabold text-green-400">{currentCurrency.symbol}{formattedAmount} {currentCurrency.code}</p>
                        
                        <p className="text-gray-400">Settlement Rail:</p>
                        <p className="font-semibold text-white">{paymentMethod}</p>
                        
                        <p className="text-gray-400">Priority:</p>
                        <p className="font-semibold text-yellow-400">{advancedSettings.priority.toUpperCase()}</p>
                    </div>
                </Card>

                {/* Advanced Settings Overview */}
                <Card title="Advanced Protocol Configuration">
                    <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                        <p className="text-gray-400">Data Encryption:</p><p className="text-white">{advancedSettings.dataEncryptionStandard}</p>
                        <p className="text-gray-400">Route Optimization:</p><p className="text-white">{advancedSettings.routeOptimizationPreference}</p>
                        <p className="text-gray-400">Notifications:</p>
                        <p className="text-white">
                            {Object.entries(advancedSettings.notificationPreferences)
                                .filter(([key, enabled]) => enabled)
                                .map(([key]) => key.replace('_', ' ').toUpperCase())
                                .join(', ') || 'None'}
                        </p>
                    </div>
                </Card>

                {/* Conditional Warning for High Risk */}
                {securityAudit && securityAudit.riskScore > 50 && (
                    <div className="p-4 bg-red-900/40 border border-red-500 rounded-lg">
                        <p className="font-bold text-red-300">High Risk Detected ({securityAudit.riskScore}/100). Biometric Multi-Factor Authentication (MFA) is REQUIRED for transaction authorization.</p>
                    </div>
                )}
            </div>
        );
    };

    // Render function for the final confirmation step.
    const renderStep4Confirmation = () => (
        <div className="text-center p-10 bg-gray-800 rounded-xl border-2 border-green-500 shadow-lg animate-fade-in">
            <AnimatedCheckmarkIcon />
            <h3 className="text-4xl font-bold text-green-400 mt-6 mb-2">Transaction Successful</h3>
            <p className="text-xl text-white">Transfer processed and confirmation pending.</p>
            <p className="text-md text-gray-400 mt-3">Ledger Hash: <span className="font-mono text-sm bg-gray-700 p-1 rounded">{`0x${Math.random().toString(16).substring(2, 18)}...`}</span></p>
            <button 
                onClick={() => { 
                    // Reset state for a new transaction.
                    setCurrentStep(1); 
                    setAmount(''); 
                    setRecipientIdentifier(''); 
                    setSelectedRecipient(null);
                    setSecurityAudit(null);
                    setPaymentMethod('quantumpay_stable'); // Reset to default
                    setCurrencyCode('USD'); // Reset to default
                    setAdvancedSettings({ // Reset to defaults
                        priority: 'normal',
                        dataEncryptionStandard: 'aes256_gcm',
                        routeOptimizationPreference: 'speed',
                        notificationPreferences: { email: true, sms: false, push: true, dlt_confirmation: true }
                    });
                }} 
                className="mt-8 px-8 py-3 bg-cyan-600 hover:bg-cyan-500 rounded-full text-white font-bold transition transform hover:scale-[1.02] shadow-lg"
            >
                Initiate New Transfer
            </button>
        </div>
    );

    // Main content rendering based on current step.
    const renderContent = () => {
        switch (currentStep) {
            case 1: return renderStep1Input();
            case 2: return renderStep2Review();
            case 4: return renderStep4Confirmation(); // Skip step 3 in UI flow, handled by modal.
            default: return renderStep1Input(); // Fallback to step 1.
        }
    };

    // Button text logic.
    const getButtonText = () => {
        if (currentStep === 1) return "Review Transaction";
        if (currentStep === 2) return `Authorize & Send (${currentCurrency.symbol}${amount})`;
        if (currentStep === 4) return "Done";
        return "Next";
    };

    // Button disabled logic.
    const isButtonDisabled = !isValidInput && currentStep !== 4;

    return (
        <div className="max-w-4xl mx-auto p-6 bg-gray-900 rounded-2xl shadow-2xl border border-gray-700/50">
            <h1 className="text-4xl font-extrabold text-white mb-2 tracking-tighter">Nexus Pay Transfer</h1>
            <p className="text-cyan-400 mb-8 border-b border-gray-700 pb-3">Secure and efficient single-rail payment interface.</p>

            {/* Step Indicator Navigation */}
            {currentStep !== 4 && (
                <div className="flex justify-between mb-8 text-sm font-medium">
                    <div className={`flex-1 text-center py-2 rounded-l-lg ${currentStep >= 1 ? 'bg-cyan-700 text-white' : 'bg-gray-700 text-gray-400'}`}>1. Details</div>
                    <div className={`flex-1 text-center py-2 ${currentStep === 2 ? 'bg-cyan-700 text-white' : currentStep > 2 ? 'bg-green-700 text-white' : 'bg-gray-700 text-gray-400'}`}>2. Review</div>
                    <div className={`flex-1 text-center py-2 rounded-r-lg ${currentStep === 3 ? 'bg-purple-700 text-white' : 'bg-gray-700 text-gray-400'}`}>3. Authenticate</div>
                </div>
            )}

            {/* Content area for steps */}
            <Card title={currentStep === 1 ? "Step 1: Transaction Details" : currentStep === 2 ? "Step 2: Review & Confirm" : ""}>
                {renderContent()}
            </Card>

            {/* Action Buttons */}
            {currentStep !== 4 && (
                <div className="flex justify-end gap-4 mt-8">
                    {currentStep === 2 && (
                        <button 
                            onClick={() => setCurrentStep(1)} 
                            className="px-6 py-3 bg-gray-600 hover:bg-gray-500 rounded-xl text-white font-semibold transition shadow-md"
                        >
                            &larr; Back to Details
                        </button>
                    )}
                    
                    <button 
                        onClick={handleSendClick} 
                        disabled={isButtonDisabled || currentStep === 3} 
                        className={`px-8 py-3 rounded-xl text-white font-bold transition transform shadow-lg 
                            ${currentStep === 2 ? 'bg-red-600 hover:bg-red-500' : 'bg-cyan-600 hover:bg-cyan-500'} 
                            disabled:opacity-40 disabled:cursor-not-allowed
                            ${currentStep !== 2 && 'hover:scale-[1.02]'}
                            ${currentStep === 2 && 'hover:scale-[1.02]'}
                        `}
                    >
                        {getButtonText()}
                    </button>
                </div>
            )}

            {/* Biometric Modal Trigger */}
            <BiometricModal 
                isOpen={showBiometricModal} 
                onSuccess={handleBiometricSuccess} 
                onClose={() => setShowBiometricModal(false)} 
                amount={amount} 
                recipient={selectedRecipient || recipientIdentifier} 
                paymentMethod={paymentMethod} 
            />
            <style>{`.animate-fade-in { animation: fadeIn 0.5s ease-out; } @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }`}</style>
        </div>
    );
};

export default SendMoneyView;

================================================================================
// APPENDED FROM REPO: diplomat-bit/Fuckyou | ORIGINAL PATH: diplomat-bit-Fuckyou-70f83c5/components/SendMoneyView.tsx
================================================================================

import React, { useState, useContext, useEffect, useRef, useMemo, useCallback } from 'react';
import { 
  Send, 
  Zap, 
  ShieldCheck, 
  Database, 
  History, 
  Terminal, 
  MessageSquare, 
  Cpu, 
  Lock, 
  Activity, 
  Globe, 
  Layers, 
  BarChart3, 
  AlertTriangle, 
  Fingerprint, 
  Eye, 
  RefreshCcw,
  ChevronRight,
  Search,
  Filter,
  Download,
  Settings,
  UserCheck,
  FileText,
  ArrowUpRight,
  ArrowDownLeft,
  PieChart,
  ShieldAlert
} from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import Card from './Card';
import { DataContext } from '../context/DataContext';
import { View, PaymentRail, Transaction } from '../types';
import { BiometricModal, SecurityAuditDisplay, SecurityAuditResult } from './payment-components';

/**
 * QUANTUM FINANCIAL - ELITE BUSINESS DEMO ENGINE
 * VERSION: 4.0.1-PROD
 * 
 * PHILOSOPHY: 
 * - "Golden Ticket" Experience.
 * - High-Performance, Secure, Elite.
 * - No Pressure "Test Drive" Environment.
 * - Full Audit Traceability.
 * - AI-First Orchestration.
 */

// ================================================================================================
// TYPE DEFINITIONS & INTERFACES
// ================================================================================================

interface AuditEntry {
  id: string;
  timestamp: string;
  action: string;
  actor: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  metadata: any;
  hash: string; // Simulated blockchain hash
}

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  isExecuting?: boolean;
}

interface FraudSignal {
  id: string;
  type: string;
  strength: number;
  status: 'MONITORING' | 'FLAGGED' | 'CLEARED';
}

// ================================================================================================
// CONSTANTS & CONFIGURATION
// ================================================================================================

const SYSTEM_PROMPT = `
You are the Quantum Financial AI Strategist, the core intelligence of "The Demo Bank". 
Your goal is to provide a "Golden Ticket" experience for elite business clients.
You are professional, high-performance, and secure.

CAPABILITIES:
1. You can help users fill out the payment form.
2. You can analyze transaction risks.
3. You can explain complex financial rails (Wire, ACH, Quantum).
4. You can trigger UI actions by including a JSON block in your response.

JSON COMMAND STRUCTURE:
If the user wants to set a value, include:
{ "command": "SET_FORM", "data": { "recipient": "Name", "amount": 1000, "rail": "quantumpay" } }

If the user wants to navigate:
{ "command": "NAVIGATE", "data": { "view": "dashboard" } }

IMPORTANT: 
- DO NOT use the name "Citibank". Use "Quantum Financial" or "The Demo Bank".
- Be helpful but maintain an elite, professional tone.
- You are part of a "Test Drive" experience. Encourage the user to "kick the tires".
`;

// ================================================================================================
// UTILITY FUNCTIONS
// ================================================================================================

const generateHash = () => Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

const formatCurrency = (val: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);

// ================================================================================================
// SUB-COMPONENTS (MONOLITHIC ARCHITECTURE)
// ================================================================================================

/**
 * AuditLedger: Displays the immutable log of all sensitive actions.
 */
const AuditLedger: React.FC<{ logs: AuditEntry[] }> = ({ logs }) => (
  <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
    {logs.map((log) => (
      <div key={log.id} className="p-3 bg-black/40 border border-gray-800 rounded-lg flex flex-col gap-1 group hover:border-cyan-500/50 transition-colors">
        <div className="flex justify-between items-center">
          <span className={`text-[9px] font-bold px-2 py-0.5 rounded ${
            log.severity === 'CRITICAL' ? 'bg-red-500/20 text-red-400' : 
            log.severity === 'HIGH' ? 'bg-orange-500/20 text-orange-400' : 'bg-gray-800 text-gray-400'
          }`}>
            {log.severity}
          </span>
          <span className="text-[9px] font-mono text-gray-600">{log.timestamp}</span>
        </div>
        <p className="text-xs text-gray-300 font-medium">{log.action}</p>
        <div className="flex items-center gap-2 mt-1">
          <Database size={10} className="text-gray-600" />
          <span className="text-[8px] font-mono text-gray-600 truncate">HASH: {log.hash}</span>
        </div>
      </div>
    ))}
  </div>
);

/**
 * SecurityEngine: Visualizes real-time fraud monitoring.
 */
const SecurityEngine: React.FC = () => {
  const [signals, setSignals] = useState<FraudSignal[]>([
    { id: '1', type: 'IP_GEOLOCATION', strength: 0.98, status: 'CLEARED' },
    { id: '2', type: 'VELOCITY_CHECK', strength: 0.85, status: 'MONITORING' },
    { id: '3', type: 'BEHAVIORAL_BIOMETRICS', strength: 0.99, status: 'CLEARED' },
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setSignals(prev => prev.map(s => ({
        ...s,
        strength: Math.min(1, Math.max(0.7, s.strength + (Math.random() - 0.5) * 0.05))
      })));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-4">
      {signals.map(signal => (
        <div key={signal.id} className="space-y-1">
          <div className="flex justify-between text-[10px] font-black text-gray-500 uppercase tracking-widest">
            <span>{signal.type}</span>
            <span className="text-cyan-400">{(signal.strength * 100).toFixed(1)}%</span>
          </div>
          <div className="h-1 w-full bg-gray-900 rounded-full overflow-hidden">
            <div 
              className="h-full bg-cyan-500 transition-all duration-1000" 
              style={{ width: `${signal.strength * 100}%` }}
            />
          </div>
        </div>
      ))}
      <div className="pt-2 flex items-center gap-2 text-[10px] text-emerald-400 font-bold uppercase">
        <ShieldCheck size={14} /> All Systems Nominal
      </div>
    </div>
  );
};

// ================================================================================================
// MAIN COMPONENT: SendMoneyView
// ================================================================================================

const SendMoneyView: React.FC = () => {
  const context = useContext(DataContext);
  if (!context) throw new Error("SendMoneyView must be used within a DataProvider");
  
  const { addTransaction, setActiveView } = context;

  // --- FORM STATE ---
  const [amount, setAmount] = useState('');
  const [recipientName, setRecipientName] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentRail>('quantumpay');
  const [memo, setMemo] = useState('');
  const [currentStep, setCurrentStep] = useState(1);
  
  // --- UI STATE ---
  const [showBiometricModal, setShowBiometricModal] = useState(false);
  const [securityAudit, setSecurityAudit] = useState<SecurityAuditResult | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeTab, setActiveTab] = useState<'form' | 'analytics' | 'audit'>('form');
  
  // --- AUDIT STATE ---
  const [auditTrail, setAuditTrail] = useState<AuditEntry[]>([]);
  
  // --- AI CHAT STATE ---
  const [chatInput, setChatInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    { 
      id: '1', 
      role: 'assistant', 
      content: "Welcome to the Quantum Financial Test Drive. I am your AI Strategist. How can I assist with your capital deployment today?", 
      timestamp: new Date().toLocaleTimeString() 
    }
  ]);
  const [isAiTyping, setIsAiTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // --- INITIALIZATION ---
  useEffect(() => {
    logAuditAction('SESSION_START', 'SYSTEM', 'LOW', { view: 'SendMoneyView' });
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // --- AUDIT LOGGING LOGIC ---
  const logAuditAction = (action: string, actor: string, severity: AuditEntry['severity'], metadata: any) => {
    const newEntry: AuditEntry = {
      id: `audit_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      timestamp: new Date().toISOString(),
      action,
      actor,
      severity,
      metadata,
      hash: generateHash()
    };
    setAuditTrail(prev => [newEntry, ...prev]);
    console.log(`[AUDIT_LOG] ${action}`, newEntry);
  };

  // --- AI INTEGRATION ---
  const handleAiChat = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!chatInput.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: chatInput,
      timestamp: new Date().toLocaleTimeString()
    };

    setMessages(prev => [...prev, userMsg]);
    setChatInput('');
    setIsAiTyping(true);
    logAuditAction('AI_QUERY', 'USER', 'LOW', { query: chatInput });

    try {
      // Initialize Gemini
      const genAI = new GoogleGenAI(process.env.GEMINI_API_KEY || "");
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      const chat = model.startChat({
        history: messages.map(m => ({
          role: m.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: m.content }],
        })),
        generationConfig: {
          maxOutputTokens: 500,
        },
      });

      const result = await chat.sendMessage(`${SYSTEM_PROMPT}\n\nUser Input: ${chatInput}`);
      const responseText = result.response.text();

      // Parse for commands
      const commandMatch = responseText.match(/\{.*\}/s);
      if (commandMatch) {
        try {
          const commandData = JSON.parse(commandMatch[0]);
          handleAiCommand(commandData);
        } catch (err) {
          console.error("Failed to parse AI command", err);
        }
      }

      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: responseText.replace(/\{.*\}/s, '').trim(),
        timestamp: new Date().toLocaleTimeString()
      };

      setMessages(prev => [...prev, aiMsg]);
    } catch (error) {
      console.error("AI Error:", error);
      setMessages(prev => [...prev, {
        id: 'err',
        role: 'assistant',
        content: "I apologize, but my neural link is experiencing interference. Please proceed with manual entry.",
        timestamp: new Date().toLocaleTimeString()
      }]);
    } finally {
      setIsAiTyping(false);
    }
  };

  const handleAiCommand = (cmd: any) => {
    logAuditAction('AI_COMMAND_EXECUTION', 'AI_CORE', 'MEDIUM', cmd);
    if (cmd.command === 'SET_FORM') {
      if (cmd.data.recipient) setRecipientName(cmd.data.recipient);
      if (cmd.data.amount) setAmount(cmd.data.amount.toString());
      if (cmd.data.rail) setPaymentMethod(cmd.data.rail);
    } else if (cmd.command === 'NAVIGATE') {
      setActiveView(cmd.data.view as View);
    }
  };

  // --- PAYMENT LOGIC ---
  useEffect(() => {
    const auditTimeout = setTimeout(() => {
      if (parseFloat(amount) > 0 && recipientName) {
        const score = parseFloat(amount) > 10000 ? 75 : 12;
        setSecurityAudit({
          riskScore: score,
          fraudProbability: score / 1000,
          amlCompliance: 'pass',
          sanctionScreening: 'pass',
          quantumSignatureIntegrity: 'verified',
          recommendations: score > 50 ? ["Enhanced monitoring required", "Verify recipient via secondary channel"] : ["Optimal route confirmed"],
          complianceAlerts: [],
          threatVectorAnalysis: []
        });
        if (score > 50) {
          logAuditAction('HIGH_RISK_DETECTION', 'SECURITY_ENGINE', 'HIGH', { amount, recipientName, score });
        }
      } else {
        setSecurityAudit(null);
      }
    }, 800);
    return () => clearTimeout(auditTimeout);
  }, [amount, recipientName]);

  const handleSendClick = () => {
    if (currentStep === 1) {
      logAuditAction('PAYMENT_REVIEW_INITIATED', 'USER', 'LOW', { amount, recipientName, rail: paymentMethod });
      setCurrentStep(2);
    } else if (currentStep === 2) {
      setShowBiometricModal(true);
    }
  };

  const handleSuccess = async () => {
    setIsProcessing(true);
    logAuditAction('PAYMENT_AUTHORIZED', 'USER', 'HIGH', { amount, recipientName, method: 'BIOMETRIC' });
    
    // Simulate network latency for "Elite" feel
    await new Promise(resolve => setTimeout(resolve, 2000));

    const newTx: Transaction = {
      id: `tx_${Date.now()}`,
      type: 'expense',
      category: 'Transfer',
      description: `Quantum Transfer to ${recipientName}`,
      amount: parseFloat(amount),
      date: new Date().toISOString().split('T')[0],
      metadata: {
        rail: paymentMethod,
        memo: memo,
        audit_hash: generateHash()
      }
    };

    await addTransaction(newTx);
    logAuditAction('TRANSACTION_FINALIZED', 'LEDGER', 'MEDIUM', { txId: newTx.id });
    
    setShowBiometricModal(false);
    setIsProcessing(false);
    setActiveView(View.Dashboard);
  };

  // ================================================================================================
  // RENDER LOGIC
  // ================================================================================================

  return (
    <div className="min-h-screen bg-[#050505] text-gray-200 font-sans selection:bg-cyan-500/30">
      <div className="max-w-[1600px] mx-auto p-6 lg:p-10 space-y-8 animate-in fade-in duration-700">
        
        {/* ELITE HEADER */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end border-b border-gray-800/50 pb-8 gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-cyan-500 rounded-lg shadow-[0_0_20px_rgba(6,182,212,0.5)]">
                <Layers className="text-black" size={24} />
              </div>
              <h2 className="text-4xl font-black text-white tracking-tighter uppercase italic">
                Quantum <span className="text-cyan-500">Financial</span>
              </h2>
            </div>
            <p className="text-gray-500 text-xs font-mono tracking-[0.3em] uppercase flex items-center gap-2">
              <Activity size={12} className="text-emerald-500 animate-pulse" /> 
              System Status: Optimal // Node: Global_Nexus_01
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <div className="px-4 py-2 bg-gray-900/50 border border-gray-800 rounded-xl flex items-center gap-3 group hover:border-cyan-500/50 transition-all cursor-help">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-ping" />
              <div className="text-left">
                <p className="text-[8px] font-black text-gray-500 uppercase tracking-widest">Liquidity Pool</p>
                <p className="text-xs font-mono text-white">$2.45B Available</p>
              </div>
            </div>
            <div className="px-4 py-2 bg-gray-900/50 border border-gray-800 rounded-xl flex items-center gap-3 group hover:border-cyan-500/50 transition-all">
              <Globe size={16} className="text-cyan-500" />
              <div className="text-left">
                <p className="text-[8px] font-black text-gray-500 uppercase tracking-widest">Global Rails</p>
                <p className="text-xs font-mono text-white">182 Countries Active</p>
              </div>
            </div>
          </div>
        </header>

        {/* MAIN GRID */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
          
          {/* LEFT COLUMN: PAYMENT CONSOLE */}
          <div className="xl:col-span-8 space-y-8">
            
            {/* NAVIGATION TABS */}
            <div className="flex gap-1 p-1 bg-gray-900/50 border border-gray-800 rounded-2xl w-fit">
              {[
                { id: 'form', label: 'Transfer Portal', icon: Send },
                { id: 'analytics', label: 'Market Intelligence', icon: BarChart3 },
                { id: 'audit', label: 'Immutable Ledger', icon: Database },
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id as any);
                    logAuditAction('TAB_SWITCH', 'USER', 'LOW', { to: tab.id });
                  }}
                  className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${
                    activeTab === tab.id 
                      ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-600/20' 
                      : 'text-gray-500 hover:text-gray-300 hover:bg-gray-800'
                  }`}
                >
                  <tab.icon size={14} />
                  {tab.label}
                </button>
              ))}
            </div>

            {activeTab === 'form' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* PRIMARY FORM */}
                <div className="space-y-6">
                  <Card 
                    title={currentStep === 1 ? "Initiate Capital Flow" : "Security Verification"}
                    subtitle="Precision-engineered payment orchestration"
                  >
                    <div className="space-y-6 pt-4">
                      {currentStep === 1 ? (
                        <>
                          <div className="space-y-2">
                            <label className="block text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] ml-1">Recipient Identifier</label>
                            <div className="relative group">
                              <input 
                                type="text" 
                                value={recipientName} 
                                onChange={e => setRecipientName(e.target.value)} 
                                className="w-full bg-black/60 border border-gray-800 rounded-2xl p-4 text-white focus:ring-2 focus:ring-cyan-500/50 border-gray-700 outline-none font-mono text-lg transition-all group-hover:border-gray-600" 
                                placeholder="Entity Name or Wallet ID" 
                              />
                              <UserCheck className="absolute right-4 top-4 text-gray-700 group-focus-within:text-cyan-500 transition-colors" size={20} />
                            </div>
                          </div>

                          <div className="space-y-2">
                            <label className="block text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] ml-1">Magnitude (USD)</label>
                            <div className="relative group">
                              <input 
                                type="number" 
                                value={amount} 
                                onChange={e => setAmount(e.target.value)} 
                                className="w-full bg-black/60 border border-gray-800 rounded-2xl p-5 text-white focus:ring-2 focus:ring-cyan-500/50 border-gray-700 outline-none font-mono text-4xl font-black transition-all group-hover:border-gray-600" 
                                placeholder="0.00" 
                              />
                              <span className="absolute right-6 top-7 text-gray-600 font-black text-xl">USD</span>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <label className="block text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] ml-1">Execution Protocol</label>
                            <div className="grid grid-cols-2 gap-3">
                              {[
                                { id: 'quantumpay', label: 'QuantumPay', sub: 'Instant', icon: Zap },
                                { id: 'swift_global', label: 'SWIFT L1', sub: 'T+0', icon: Globe },
                                { id: 'blockchain_dlt', label: 'DLT Rail', sub: 'Encrypted', icon: Layers },
                                { id: 'cashapp', label: 'ACH Prime', sub: 'Standard', icon: RefreshCcw },
                              ].map(rail => (
                                <button
                                  key={rail.id}
                                  onClick={() => setPaymentMethod(rail.id as any)}
                                  className={`p-4 rounded-2xl border text-left transition-all ${
                                    paymentMethod === rail.id 
                                      ? 'bg-cyan-500/10 border-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.1)]' 
                                      : 'bg-black/40 border-gray-800 hover:border-gray-700'
                                  }`}
                                >
                                  <rail.icon size={18} className={paymentMethod === rail.id ? 'text-cyan-500' : 'text-gray-600'} />
                                  <p className={`text-xs font-black mt-2 uppercase ${paymentMethod === rail.id ? 'text-white' : 'text-gray-400'}`}>{rail.label}</p>
                                  <p className="text-[9px] text-gray-600 font-mono">{rail.sub}</p>
                                </button>
                              ))}
                            </div>
                          </div>

                          <div className="space-y-2">
                            <label className="block text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] ml-1">Transaction Memo (Optional)</label>
                            <textarea 
                              value={memo}
                              onChange={e => setMemo(e.target.value)}
                              className="w-full bg-black/60 border border-gray-800 rounded-2xl p-4 text-white focus:ring-2 focus:ring-cyan-500/50 border-gray-700 outline-none font-mono text-sm h-24 resize-none"
                              placeholder="Reference code, invoice #, or internal note..."
                            />
                          </div>
                        </>
                      ) : (
                        <div className="space-y-6 animate-in slide-in-from-right-8 duration-500">
                          <div className="bg-gradient-to-br from-gray-900 to-black p-8 rounded-[2.5rem] border border-gray-800 space-y-6 text-center relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-50" />
                            <p className="text-[10px] text-gray-500 uppercase font-black tracking-[0.3em]">Awaiting Digital Authorization</p>
                            <div className="space-y-1">
                              <div className="text-6xl font-black text-white font-mono tracking-tighter">
                                {formatCurrency(parseFloat(amount))}
                              </div>
                              <p className="text-cyan-400 font-mono text-sm tracking-widest uppercase">Target: {recipientName}</p>
                            </div>
                            <div className="flex justify-center gap-8 py-4 border-y border-gray-800/50">
                              <div className="text-center">
                                <p className="text-[8px] text-gray-600 uppercase font-bold">Network Fee</p>
                                <p className="text-xs font-mono text-white">$0.00</p>
                              </div>
                              <div className="text-center">
                                <p className="text-[8px] text-gray-600 uppercase font-bold">Settlement</p>
                                <p className="text-xs font-mono text-white">Instant</p>
                              </div>
                              <div className="text-center">
                                <p className="text-[8px] text-gray-600 uppercase font-bold">Protocol</p>
                                <p className="text-xs font-mono text-white uppercase">{paymentMethod}</p>
                              </div>
                            </div>
                            <p className="text-[9px] text-gray-600 font-mono italic">
                              SECURE_HASH: {generateHash().substring(0, 24)}...
                            </p>
                          </div>
                          <SecurityAuditDisplay auditResult={securityAudit} />
                        </div>
                      )}
                      
                      <div className="flex gap-4 mt-8">
                        {currentStep === 2 && (
                          <button 
                            onClick={() => setCurrentStep(1)} 
                            className="flex-1 py-4 bg-gray-900 hover:bg-gray-800 text-gray-400 font-black rounded-2xl transition-all uppercase tracking-widest text-xs border border-gray-800"
                          >
                            Modify
                          </button>
                        )}
                        <button 
                          onClick={handleSendClick} 
                          disabled={!amount || !recipientName || isProcessing} 
                          className="flex-[2] py-5 bg-cyan-600 hover:bg-cyan-500 rounded-2xl text-white font-black shadow-2xl shadow-cyan-600/30 transition-all active:scale-[0.98] disabled:opacity-30 uppercase tracking-[0.2em] text-xs flex items-center justify-center gap-3 group"
                        >
                          {isProcessing ? (
                            <RefreshCcw size={18} className="animate-spin" />
                          ) : (
                            <>
                              {currentStep === 1 ? "Review Protocol" : "Authorize Flow"}
                              <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </Card>
                </div>

                {/* SECONDARY DIAGNOSTICS */}
                <div className="space-y-8">
                  <Card title="Signal Intelligence" subtitle="Real-time heuristic monitoring">
                    <div className="space-y-6 py-2">
                      <div className="p-5 bg-black/60 rounded-2xl border border-gray-800 space-y-4">
                        <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest flex items-center gap-2">
                          <Cpu size={12} className="text-cyan-500" /> Neural Risk Engine
                        </p>
                        <SecurityEngine />
                      </div>

                      <div className="p-5 bg-black/60 rounded-2xl border border-gray-800 space-y-4">
                        <div className="flex items-center gap-4">
                          <div className="p-2 bg-emerald-500/10 rounded-lg">
                            <ShieldCheck className="text-emerald-500" size={20} />
                          </div>
                          <div>
                            <p className="text-[10px] text-white font-black uppercase tracking-widest">Zero-Knowledge Proofs</p>
                            <p className="text-[10px] text-gray-500">Identity obfuscation active for this route.</p>
                          </div>
                        </div>
                        <div className="h-px bg-gray-800" />
                        <div className="flex items-center gap-4">
                          <div className="p-2 bg-cyan-500/10 rounded-lg">
                            <Terminal className="text-cyan-500" size={20} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-[10px] text-white font-black uppercase tracking-widest">Telemetry Stream</p>
                            <p className="text-[9px] text-gray-600 font-mono truncate mt-1">
                              &gt; handshake_init: node_{paymentMethod.substring(0, 4)}...
                              <br />
                              &gt; entropy_check: 0.99923...
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="p-6 bg-gradient-to-br from-indigo-900/20 to-transparent border border-indigo-500/20 rounded-3xl flex items-center gap-5 group hover:border-indigo-500/40 transition-all">
                        <div className="relative">
                          <History className="text-indigo-400" size={24} />
                          <div className="absolute -top-1 -right-1 w-3 h-3 bg-indigo-500 rounded-full border-2 border-black" />
                        </div>
                        <div>
                          <p className="text-[10px] text-white font-black uppercase tracking-widest">Historical Synergy</p>
                          <p className="text-[10px] text-gray-400 mt-1">3 successful deployments to this recipient in the last 30 cycles.</p>
                        </div>
                      </div>
                    </div>
                  </Card>

                  <Card title="Compliance Oracle">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-3 bg-gray-900/30 rounded-xl border border-gray-800">
                        <div className="flex items-center gap-3">
                          <FileText size={14} className="text-gray-500" />
                          <span className="text-[10px] font-bold text-gray-400 uppercase">AML Screening</span>
                        </div>
                        <span className="text-[10px] font-mono text-emerald-500">PASSED</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-gray-900/30 rounded-xl border border-gray-800">
                        <div className="flex items-center gap-3">
                          <ShieldAlert size={14} className="text-gray-500" />
                          <span className="text-[10px] font-bold text-gray-400 uppercase">Sanctions Check</span>
                        </div>
                        <span className="text-[10px] font-mono text-emerald-500">CLEAR</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-gray-900/30 rounded-xl border border-gray-800">
                        <div className="flex items-center gap-3">
                          <Fingerprint size={14} className="text-gray-500" />
                          <span className="text-[10px] font-bold text-gray-400 uppercase">KYB Verification</span>
                        </div>
                        <span className="text-[10px] font-mono text-emerald-500">VERIFIED</span>
                      </div>
                    </div>
                  </Card>
                </div>
              </div>
            )}

            {activeTab === 'analytics' && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card title="Volume Analysis">
                    <div className="h-48 flex items-end justify-between gap-2 px-2">
                      {[40, 70, 45, 90, 65, 80, 95].map((h, i) => (
                        <div key={i} className="w-full bg-cyan-500/20 rounded-t-lg relative group">
                          <div 
                            className="absolute bottom-0 left-0 w-full bg-cyan-500 rounded-t-lg transition-all duration-1000 group-hover:bg-cyan-400" 
                            style={{ height: `${h}%` }} 
                          />
                        </div>
                      ))}
                    </div>
                    <div className="flex justify-between mt-4 text-[8px] font-mono text-gray-600 uppercase">
                      <span>Mon</span><span>Wed</span><span>Fri</span><span>Sun</span>
                    </div>
                  </Card>
                  <Card title="Rail Efficiency">
                    <div className="space-y-4 pt-4">
                      {[
                        { label: 'Quantum', val: 99.9, color: 'bg-cyan-500' },
                        { label: 'SWIFT', val: 82.4, color: 'bg-indigo-500' },
                        { label: 'ACH', val: 94.1, color: 'bg-emerald-500' },
                      ].map(r => (
                        <div key={r.label} className="space-y-1">
                          <div className="flex justify-between text-[10px] font-bold text-gray-400 uppercase">
                            <span>{r.label}</span>
                            <span>{r.val}%</span>
                          </div>
                          <div className="h-1.5 w-full bg-gray-900 rounded-full overflow-hidden">
                            <div className={`h-full ${r.color}`} style={{ width: `${r.val}%` }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card>
                  <Card title="Global Reach">
                    <div className="flex items-center justify-center h-48 relative">
                      <Globe size={100} className="text-gray-800 animate-pulse" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                          <p className="text-2xl font-black text-white">182</p>
                          <p className="text-[8px] text-gray-500 uppercase font-bold">Active Nodes</p>
                        </div>
                      </div>
                    </div>
                  </Card>
                </div>
                <Card title="Market Liquidity Heatmap">
                  <div className="grid grid-cols-12 gap-2 h-32">
                    {Array.from({ length: 48 }).map((_, i) => (
                      <div 
                        key={i} 
                        className="rounded-sm transition-all hover:scale-110 cursor-crosshair" 
                        style={{ 
                          backgroundColor: `rgba(6, 182, 212, ${Math.random() * 0.8 + 0.1})`,
                        }}
                        title={`Node ${i}: High Liquidity`}
                      />
                    ))}
                  </div>
                </Card>
              </div>
            )}

            {activeTab === 'audit' && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <Card 
                  title="Immutable Audit Ledger" 
                  subtitle="Cryptographically signed record of all system interactions"
                  headerActions={[
                    { id: 'dl', icon: <Download />, label: 'Export CSV', onClick: () => logAuditAction('LEDGER_EXPORT', 'USER', 'MEDIUM', { format: 'CSV' }) },
                    { id: 'filter', icon: <Filter />, label: 'Filter', onClick: () => {} }
                  ]}
                >
                  <AuditLedger logs={auditTrail} />
                </Card>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-6 bg-gray-900/30 border border-gray-800 rounded-2xl space-y-2">
                    <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest">Ledger Integrity</p>
                    <div className="flex items-center gap-3">
                      <ShieldCheck className="text-emerald-500" size={20} />
                      <p className="text-xs font-mono text-gray-300">All blocks verified. No discrepancies detected.</p>
                    </div>
                  </div>
                  <div className="p-6 bg-gray-900/30 border border-gray-800 rounded-2xl space-y-2">
                    <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest">Storage Utilization</p>
                    <div className="flex items-center gap-3">
                      <Database className="text-cyan-500" size={20} />
                      <p className="text-xs font-mono text-gray-300">Quantum-encrypted cold storage: 12.4 TB used.</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* RIGHT COLUMN: AI STRATEGIST CHAT */}
          <div className="xl:col-span-4">
            <div className="sticky top-10 space-y-6">
              <Card 
                className="h-[calc(100vh-180px)] flex flex-col border-cyan-500/20 shadow-[0_0_40px_rgba(6,182,212,0.05)]"
                title="AI Strategist"
                subtitle="Quantum Financial Intelligence Core"
                icon={<Cpu className="text-cyan-500" size={20} />}
              >
                <div className="flex-1 overflow-y-auto space-y-6 pr-2 custom-scrollbar mb-4">
                  {messages.map((msg) => (
                    <div 
                      key={msg.id} 
                      className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
                    >
                      <div className={`max-w-[85%] p-4 rounded-2xl text-xs leading-relaxed ${
                        msg.role === 'user' 
                          ? 'bg-cyan-600 text-white rounded-tr-none' 
                          : msg.role === 'system'
                          ? 'bg-gray-800/50 text-gray-400 italic text-center w-full'
                          : 'bg-gray-900 border border-gray-800 text-gray-300 rounded-tl-none'
                      }`}>
                        {msg.content}
                      </div>
                      <span className="text-[8px] font-mono text-gray-600 mt-1 uppercase">{msg.timestamp}</span>
                    </div>
                  ))}
                  {isAiTyping && (
                    <div className="flex items-center gap-2 text-cyan-500 animate-pulse">
                      <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  )}
                  <div ref={chatEndRef} />
                </div>

                <form onSubmit={handleAiChat} className="relative mt-auto">
                  <input 
                    type="text" 
                    value={chatInput}
                    onChange={e => setChatInput(e.target.value)}
                    placeholder="Ask the Strategist..."
                    className="w-full bg-black border border-gray-800 rounded-2xl p-4 pr-12 text-xs text-white focus:ring-2 focus:ring-cyan-500/50 outline-none transition-all"
                  />
                  <button 
                    type="submit"
                    disabled={!chatInput.trim() || isAiTyping}
                    className="absolute right-2 top-2 p-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl transition-all disabled:opacity-30"
                  >
                    <ArrowUpRight size={18} />
                  </button>
                </form>
              </Card>

              {/* QUICK ACTIONS */}
              <div className="grid grid-cols-2 gap-4">
                <button 
                  onClick={() => {
                    setChatInput("Analyze the risk of a $50,000 transfer to Global Logistics Inc.");
                    handleAiChat();
                  }}
                  className="p-4 bg-gray-900/50 border border-gray-800 rounded-2xl text-[10px] font-black text-gray-500 uppercase tracking-widest hover:border-cyan-500/50 hover:text-cyan-400 transition-all text-left"
                >
                  Risk Analysis
                </button>
                <button 
                  onClick={() => {
                    setChatInput("What is the most efficient rail for a T+0 settlement to London?");
                    handleAiChat();
                  }}
                  className="p-4 bg-gray-900/50 border border-gray-800 rounded-2xl text-[10px] font-black text-gray-500 uppercase tracking-widest hover:border-cyan-500/50 hover:text-cyan-400 transition-all text-left"
                >
                  Rail Optimization
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MODALS */}
      <BiometricModal 
        isOpen={showBiometricModal} 
        onSuccess={handleSuccess} 
        onClose={() => {
          setShowBiometricModal(false);
          logAuditAction('BIOMETRIC_CANCELLED', 'USER', 'MEDIUM', { amount });
        }} 
        amount={amount} 
        recipient={recipientName} 
        paymentMethod={paymentMethod} 
        securityContext="corporate_treasury" 
      />

      {/* GLOBAL OVERLAYS */}
      {isProcessing && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center">
          <div className="text-center space-y-6">
            <div className="relative">
              <div className="w-24 h-24 border-4 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin mx-auto" />
              <Lock className="absolute inset-0 m-auto text-cyan-500" size={32} />
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter">Securing Transaction</h3>
              <p className="text-gray-500 font-mono text-xs animate-pulse">ENCRYPTING_PACKETS // SIGNING_LEDGER // VERIFYING_NODES</p>
            </div>
          </div>
        </div>
      )}

      {/* CUSTOM STYLES */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #1f2937;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #06b6d4;
        }
      `}</style>
    </div>
  );
};

export default SendMoneyView;

================================================================================
// APPENDED FROM REPO: diplomat-bit/Fuckyou | ORIGINAL PATH: diplomat-bit-Fuckyou-70f83c5/components/SendMoneyView (1).tsx
================================================================================


import React, { useState, useContext, useEffect } from 'react';
import Card from './Card';
import { DataContext } from '../context/DataContext';
import { View, PaymentRail, Transaction } from '../types';
import { BiometricModal, SecurityAuditDisplay, SecurityAuditResult } from './payment-components';

const SendMoneyView: React.FC = () => {
    const context = useContext(DataContext);
    if (!context) throw new Error("SendMoneyView must be used within a DataProvider");
    const { addTransaction, setActiveView } = context;

    const [amount, setAmount] = useState('');
    const [recipientName, setRecipientName] = useState('');
    const [paymentMethod, setPaymentMethod] = useState<PaymentRail>('quantumpay');
    const [showBiometricModal, setShowBiometricModal] = useState(false);
    const [securityAudit, setSecurityAudit] = useState<SecurityAuditResult | null>(null);
    const [currentStep, setCurrentStep] = useState(1);

    useEffect(() => {
        const auditTimeout = setTimeout(() => {
            if (parseFloat(amount) > 0 && recipientName) {
                setSecurityAudit({
                    riskScore: parseFloat(amount) > 5000 ? 60 : 10,
                    fraudProbability: 0.01,
                    amlCompliance: 'pass',
                    sanctionScreening: 'pass',
                    quantumSignatureIntegrity: 'verified',
                    recommendations: parseFloat(amount) > 5000 ? ["High value transaction. AI monitoring active."] : [],
                    complianceAlerts: [],
                    threatVectorAnalysis: []
                });
            }
        }, 800);
        return () => clearTimeout(auditTimeout);
    }, [amount, recipientName]);

    const handleSendClick = () => {
        if (currentStep === 1) setCurrentStep(2);
        else if (currentStep === 2) setShowBiometricModal(true);
    };

    const handleSuccess = async () => {
        const newTx: Transaction = {
            id: `tx_${Date.now()}`,
            type: 'expense',
            category: 'Transfer',
            description: `Sent to ${recipientName} via ${paymentMethod}`,
            amount: parseFloat(amount),
            date: new Date().toISOString().split('T')[0],
            carbonFootprint: 0.5,
            aiCategoryConfidence: 1.0
        };
        await addTransaction(newTx);
        setShowBiometricModal(false);
        setActiveView(View.Dashboard);
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <h2 className="text-3xl font-black text-white tracking-tighter uppercase italic">Quantum Pay Portal</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card title={currentStep === 1 ? "Initiate Transfer" : "Review Transaction"}>
                    <div className="space-y-6">
                        {currentStep === 1 ? (
                            <>
                                <div>
                                    <label className="block text-[10px] font-bold text-gray-500 uppercase mb-2 tracking-widest">Recipient</label>
                                    <input type="text" value={recipientName} onChange={e => setRecipientName(e.target.value)} className="w-full bg-black/40 border border-gray-700 rounded-xl p-3 text-white focus:ring-1 focus:ring-cyan-500 outline-none font-mono" placeholder="Name, @tag, or ID" />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-bold text-gray-500 uppercase mb-2 tracking-widest">Amount (USD)</label>
                                    <input type="number" value={amount} onChange={e => setAmount(e.target.value)} className="w-full bg-black/40 border border-gray-700 rounded-xl p-3 text-white focus:ring-1 focus:ring-cyan-500 outline-none font-mono" placeholder="0.00" />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-bold text-gray-500 uppercase mb-2 tracking-widest">Execution Rail</label>
                                    <select value={paymentMethod} onChange={e => setPaymentMethod(e.target.value as PaymentRail)} className="w-full bg-black/40 border border-gray-700 rounded-xl p-3 text-white focus:ring-1 focus:ring-cyan-500 outline-none font-mono appearance-none">
                                        <option value="quantumpay">QuantumPay (Instant Settlement)</option>
                                        <option value="cashapp">Cash App</option>
                                        <option value="swift_global">SWIFT Global (L1)</option>
                                        <option value="blockchain_dlt">Blockchain DLT</option>
                                    </select>
                                </div>
                                <SecurityAuditDisplay auditResult={securityAudit} />
                            </>
                        ) : (
                            <div className="space-y-4 text-gray-100 bg-gray-900/50 p-6 rounded-2xl border border-gray-800">
                                <div className="flex justify-between border-b border-gray-800 pb-2">
                                    <span className="text-gray-500 text-xs uppercase font-bold">Target</span>
                                    <span className="font-mono text-cyan-400">{recipientName}</span>
                                </div>
                                <div className="flex justify-between border-b border-gray-800 pb-2">
                                    <span className="text-gray-500 text-xs uppercase font-bold">Magnitude</span>
                                    <span className="font-mono text-2xl font-black">${parseFloat(amount).toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between border-b border-gray-800 pb-2">
                                    <span className="text-gray-500 text-xs uppercase font-bold">Protocol</span>
                                    <span className="font-mono text-xs">{paymentMethod.toUpperCase()}</span>
                                </div>
                                <p className="text-[10px] text-yellow-500 font-mono animate-pulse">ESTIMATED_SETTLEMENT: INSTANT_QUANTUM</p>
                            </div>
                        )}
                        
                        <div className="flex justify-end gap-3 mt-8">
                             {currentStep === 2 && <button onClick={() => setCurrentStep(1)} className="px-6 py-3 bg-gray-800 rounded-xl text-white font-bold hover:bg-gray-700 transition-all">BACK</button>}
                             <button onClick={handleSendClick} disabled={!amount || !recipientName} className="px-8 py-3 bg-cyan-600 hover:bg-cyan-500 rounded-xl text-white font-black shadow-lg shadow-cyan-500/20 transition-all active:scale-95 disabled:opacity-50 uppercase tracking-widest">
                                {currentStep === 1 ? "Review Order" : "Initialize Flow"}
                             </button>
                        </div>
                    </div>
                </Card>

                <Card title="Network Diagnostics">
                    <div className="space-y-4">
                        <div className="p-4 bg-gray-950 rounded-xl border border-gray-800">
                            <p className="text-[10px] text-gray-500 uppercase font-black mb-2">DLT Nodes Status</p>
                            <div className="grid grid-cols-4 gap-2">
                                {[...Array(4)].map((_, i) => (
                                    <div key={i} className="h-1 bg-green-500 rounded-full shadow-[0_0_8px_rgba(34,197,94,0.4)]"></div>
                                ))}
                            </div>
                        </div>
                        <div className="p-4 bg-gray-950 rounded-xl border border-gray-800 font-mono text-[10px] text-gray-500">
                            <p>&gt; Requesting path optimization...</p>
                            <p className="text-cyan-400">&gt; Found optimal rail: {paymentMethod}</p>
                            <p>&gt; Validating recipient biometric hash...</p>
                            <p className="text-green-400">&gt; Recipient verified on decentralized identity grid.</p>
                        </div>
                    </div>
                </Card>
            </div>
            <BiometricModal isOpen={showBiometricModal} onSuccess={handleSuccess} onClose={() => setShowBiometricModal(false)} amount={amount} recipient={recipientName} paymentMethod={paymentMethod} securityContext="personal" />
        </div>
    );
};

export default SendMoneyView;


================================================================================
// APPENDED FROM REPO: diplomat-bit/Fuckyou | ORIGINAL PATH: diplomat-bit-Fuckyou-70f83c5/components/SendMoneyView (4).tsx
================================================================================

// components/views/personal/SendMoneyView.tsx
// RE-ENACTED & EXPANDED: This component has been resurrected from its deprecated state.
// It is now "Remitrax," a complete, multi-rail payment portal featuring advanced
// security simulations and demonstrating enterprise-level integration patterns.
// After a decade of upgrades, Remitrax has evolved into an unparalleled financial ecosystem,
// incorporating AI, quantum-resistant security, DLT, and even neuro-link technologies.

import React, { useState, useContext, useRef, useEffect, useCallback } from 'react';
import Card from './Card';
import { DataContext } from '../context/DataContext';
import { View } from '../types';
import type { Transaction } from '../types';

// ================================================================================================
// GLOBAL REMITRAX PLATFORM WIDE TYPE DEFINITIONS
// ================================================================================================

export type PaymentRail = 'quantumpay' | 'cashapp' | 'swift_global' | 'blockchain_dlt' | 'interstellar_p2p' | 'neuro_link' | 'ai_contract_escrow';
export type ScanState = 'scanning' | 'success' | 'verifying' | 'error' | 'recalibrating' | 'quantum_sync' | 'ai_negotiating';

export interface RemitraxRecipientProfile {
  id: string;
  name: string;
  avatarUrl?: string;
  quantumTag?: string;
  cashtag?: string;
  swiftDetails?: { bankName: string; bic: string; accountNumber: string; };
  blockchainAddress?: string;
  neuroLinkAddress?: string;
  galacticP2PId?: string;
  preferredCurrency?: string;
  lastUsedDate?: string;
  trustScore?: number;
  kycStatus?: 'verified' | 'pending' | 'unverified';
  blacklisted?: boolean;
  bankAccounts?: { bankName: string; accountNumber: string; routingNumber?: string; iban?: string; }[];
  eWalletDetails?: { type: 'paypal' | 'venmo' | 'zelle' | 'revolut' | 'cashapp' | 'quantumpay'; identifier: string; }[];
  contactPreferences?: { email: boolean; sms: boolean; push: boolean; holo_alert?: boolean; };
  relationshipStatus?: 'family' | 'friend' | 'business' | 'self' | 'vendor' | 'partner' | 'regulatory_body';
  category?: 'personal' | 'business' | 'charity' | 'government';
  multiEntitySupport?: { parentId: string; subEntities: { id: string; name: string; type: string; }[]; };
  complianceFlags?: ('high_risk' | 'sanctioned_entity' | 'PEP' | 'low_risk' | 'verified_entity')[];
}

export interface RemitraxCurrency {
  code: string;
  name: string;
  symbol: string;
  isCrypto: boolean;
  conversionRate?: number;
  quantumFluctuationIndex?: number;
  decimalPlaces: number;
  minTransactionAmount?: number;
  maxTransactionAmount?: number;
  liquidityScore?: number;
  marketCap?: number;
  regulatoryStatus?: 'regulated' | 'unregulated' | 'experimental';
  crossChainCompatible?: boolean;
}

export interface ScheduledPaymentRule {
  frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'annually' | 'once_on_date' | 'conditional_event';
  startDate: string;
  endDate?: string;
  executionCondition?: string;
  nextExecutionDate?: string;
  maxExecutions?: number;
  triggerEventId?: string;
  paymentReason?: string;
  aiAnalysisTags?: string[];
  geoFenceTrigger?: { lat: number; lon: number; radius: number; };
  biometricApprovalRequired?: boolean;
}

export interface AdvancedTransactionSettings {
  priority: 'low' | 'normal' | 'high' | 'ultra_quantum';
  carbonOffsetRatio: number;
  privacyLevel: 'standard' | 'enhanced' | 'fully_anonymous_dlt';
  receiptPreference: 'email' | 'blockchain_proof' | 'neuronal_link_receipt' | 'physical_mail';
  notificationPreferences: { email: boolean; sms: boolean; push: boolean; holo_alert: boolean; };
  multiSignatureRequired?: boolean;
  escrowDetails?: { agentId: string; releaseCondition: string; };
  dynamicFeeOptimization?: 'auto' | 'manual';
  dataEncryptionStandard: 'aes256' | 'quantum_resistant_hybrid' | 'zero_knowledge_proof' | 'obfuscated_vault';
  routeOptimizationPreference: 'speed' | 'cost' | 'privacy' | 'sustainability' | 'compliance';
  dlcDetails?: { contractId: string; conditions: string; };
  transactionExpiryMinutes?: number;
  regulatoryReportingFlags?: ('FATCA' | 'CRS' | 'AML' | 'CFT' | 'none')[];
  postQuantumSecurityEnabled?: boolean;
}

export interface SecurityAuditResult {
  riskScore: number;
  fraudProbability: number;
  amlCompliance: 'pass' | 'fail' | 'review';
  sanctionScreening: 'pass' | 'fail';
  quantumSignatureIntegrity: 'verified' | 'compromised' | 'pending';
  recommendations: string[];
  complianceAlerts?: string[];
  threatVectorAnalysis?: { type: string; severity: 'low' | 'medium' | 'high'; description: string; }[];
}

export interface EnvironmentalImpactReport {
    transactionCO2e: number;
    offsetCO2e: number;
    netCO2e: number;
    renewableEnergyUsedPercentage: number;
    recommendations?: string[];
}

export interface RailSpecificDetails {
    swift?: { bankName: string; bic: string; accountNumber: string; beneficiaryAddress: string; };
    blockchain?: { network: 'ethereum' | 'polygon' | 'solana' | 'custom_dlt' | ''; gasLimit: string; dataPayload?: string; };
    interstellar?: { galaxyId: string; starSystemAddress: string; vesselIdentifier?: string; warpDriveEfficiencyRating?: number; };
    neuroLink?: { neuralSignatureType: 'brainwave' | 'retinal_pattern' | ''; recipientId: string; neuroSyncProtocolVersion?: string; };
    aiContractEscrow?: { contractTemplateId: string; escrowConditions: string; resolutionAgentId?: string; immutableLedgerHash?: string; };
    quantumpay?: { channelProtocol: 'quantum_tunnel_v2' | 'entanglement_link_v1'; encryptionStandard: 'QRC-256' | 'hybrid_post_quantum'; quantumSignatureAlgorithm?: string; }
}

interface SendMoneyViewProps {
  setActiveView?: (view: View) => void;
}

// ================================================================================================
// ANIMATED UI SUB-COMPONENTS
// ================================================================================================

export const AnimatedCheckmarkIcon: React.FC = () => (
    <>
        <svg className="h-24 w-24 transform scale-125" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
            <defs>
                <linearGradient id="checkmarkGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#4ade80" />
                    <stop offset="50%" stopColor="#86efac" />
                    <stop offset="100%" stopColor="#22c55e" />
                </linearGradient>
                <filter id="hologramGlow">
                    <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur" />
                    <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 10 0" result="coloredBlur" />
                    <feMerge><feMergeNode in="coloredBlur" /><feMergeNode in="SourceGraphic" /></feMerge>
                </filter>
            </defs>
            <circle className="checkmark__circle" cx="26" cy="26" r="25" fill="none" stroke="url(#checkmarkGradient)" filter="url(#hologramGlow)" />
            <path className="checkmark__check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" />
        </svg>
        <style>{`
            .checkmark__circle { stroke-dasharray: 166; stroke-dashoffset: 166; stroke-width: 4; stroke-miterlimit: 10; fill: none; animation: stroke-circle 0.6s cubic-bezier(0.65, 0, 0.45, 1) forwards; box-shadow: 0 0 15px rgba(66, 255, 125, 0.7); }
            .checkmark__check { transform-origin: 50% 50%; stroke-dasharray: 48; stroke-dashoffset: 48; stroke-width: 5; stroke: #fff; animation: stroke-check 0.3s cubic-bezier(0.65, 0, 0.45, 1) 0.8s forwards; }
            @keyframes stroke-circle { 100% { stroke-dashoffset: 0; } }
            @keyframes stroke-check { 100% { stroke-dashoffset: 0; } }
        `}</style>
    </>
);

export const QuantumLedgerAnimation: React.FC = () => (
    <>
        <div className="quantum-ledger-container">
            <div className="quantum-grid-enhanced">
                {Array.from({ length: 16 }).map((_, i) => (
                    <div key={i} className="quantum-block-enhanced" style={{ animationDelay: `${i * 0.08}s` }}></div>
                ))}
            </div>
            <div className="quantum-data-flow">
                <div className="data-packet" style={{ '--flow-delay': '0s' } as React.CSSProperties}></div>
                <div className="data-packet" style={{ '--flow-delay': '0.5s' } as React.CSSProperties}></div>
            </div>
            <div className="text-center mt-4 text-xs text-cyan-300 animate-pulse">Quantum Entanglement Protocol: Active</div>
        </div>
        <style>{`
            .quantum-ledger-container { position: relative; width: 150px; height: 150px; display: flex; flex-direction: column; align-items: center; justify-content: center; }
            .quantum-grid-enhanced { display: grid; grid-template-columns: repeat(4, 1fr); gap: 6px; width: 120px; height: 120px; position: relative; z-index: 1; }
            .quantum-block-enhanced { background-color: rgba(6, 182, 212, 0.2); border: 1px solid #06b6d4; border-radius: 3px; animation: quantum-pulse 2s infinite ease-in-out forwards; box-shadow: 0 0 8px rgba(6, 182, 212, 0.5); }
            @keyframes quantum-pulse { 0%, 100% { background-color: rgba(6, 182, 212, 0.2); transform: scale(1); box-shadow: 0 0 8px rgba(6, 182, 212, 0.5); } 50% { background-color: rgba(165, 243, 252, 0.7); transform: scale(1.08); box-shadow: 0 0 15px rgba(165, 243, 252, 0.8); } }
            .quantum-data-flow { position: absolute; inset: 0; display: flex; justify-content: center; align-items: center; }
            .data-packet { position: absolute; width: 8px; height: 8px; border-radius: 50%; background: linear-gradient(45deg, #0ef, #06b6d4); box-shadow: 0 0 5px #0ef, 0 0 10px #06b6d4; animation: data-flow-path 4s infinite linear var(--flow-delay); opacity: 0; }
            @keyframes data-flow-path { 0% { transform: translate(-60px, -60px) scale(0.5); opacity: 0; } 20% { opacity: 1; } 50% { transform: translate(60px, 60px) scale(1.2); opacity: 1; } 80% { opacity: 0; } 100% { transform: translate(120px, 120px) scale(0.5); opacity: 0; } }
        `}</style>
    </>
);

export const QuantumChannelEstablishment: React.FC = () => (
    <>
        <div className="flex flex-col items-center justify-center space-y-3">
            <div className="relative w-24 h-24 rounded-full flex items-center justify-center border-2 border-purple-500 animate-spin-slow">
                <div className="w-16 h-16 rounded-full border-2 border-purple-400 animate-ping-once"></div>
                <div className="absolute w-8 h-8 bg-purple-600 rounded-full animate-pulse-fast"></div>
            </div>
            <p className="text-sm text-purple-300 animate-fade-in-out">Establishing Quantum Tunnel...</p>
        </div>
        <style>{`.animate-spin-slow { animation: spin-slow 8s linear infinite; } .animate-ping-once { animation: ping-once 2s ease-out infinite; } .animate-pulse-fast { animation: pulse-fast 1.5s ease-in-out infinite; } .animate-fade-in-out { animation: fade-in-out 3s ease-in-out infinite; }
        @keyframes spin-slow { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } } @keyframes ping-once { 0% { transform: scale(0.2); opacity: 0; } 50% { transform: scale(1); opacity: 1; } 100% { transform: scale(1.2); opacity: 0; } } @keyframes pulse-fast { 0%, 100% { transform: scale(1); opacity: 1; } 50% { transform: scale(1.1); opacity: 0.8; } } @keyframes fade-in-out { 0%, 100% { opacity: 0.5; } 50% { opacity: 1; } }`}</style>
    </>
);

export const AINegotiationAnimation: React.FC = () => (
    <>
        <div className="flex flex-col items-center justify-center space-y-3">
            <div className="relative w-24 h-24 flex items-center justify-center">
                <i className="fas fa-robot text-7xl text-teal-500 animate-pulse-slow"></i>
                <div className="absolute w-12 h-12 bg-gray-900 rounded-full flex items-center justify-center animate-spin-fast">
                    <i className="fas fa-exchange-alt text-xl text-teal-300"></i>
                </div>
            </div>
            <p className="text-sm text-teal-300 animate-fade-in-out">AI Negotiating Optimal Route & Terms...</p>
        </div>
        <style>{`.animate-pulse-slow { animation: pulse-slow 2.5s ease-in-out infinite; } .animate-spin-fast { animation: spin-fast 1.5s linear infinite; }
        @keyframes pulse-slow { 0%, 100% { transform: scale(1); opacity: 1; } 50% { transform: scale(1.05); opacity: 0.8; } } @keyframes spin-fast { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
    </>
);

export const SecurityAuditDisplay: React.FC<{ auditResult: SecurityAuditResult | null }> = ({ auditResult }) => {
    if (!auditResult) return <div className="flex items-center space-x-2 text-yellow-400"><svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg><span>Performing real-time security audit...</span></div>;

    return (
        <div className="bg-gray-800 p-4 rounded-lg space-y-2 border border-gray-700">
            <h4 className="font-semibold text-lg text-white">Security Audit Report</h4>
            <div className="grid grid-cols-2 gap-2 text-sm">
                <p className="text-gray-400">Risk Score:</p><p className={`${auditResult.riskScore > 50 ? 'text-red-400' : 'text-green-400'}`}>{auditResult.riskScore}/100</p>
                <p className="text-gray-400">Fraud Probability:</p><p className={`${auditResult.fraudProbability > 0.3 ? 'text-red-400' : 'text-green-400'}`}>{`${(auditResult.fraudProbability * 100).toFixed(2)}%`}</p>
                <p className="text-gray-400">AML Compliance:</p><p className={auditResult.amlCompliance === 'pass' ? 'text-green-400' : 'text-yellow-400'}>{auditResult.amlCompliance}</p>
            </div>
            {auditResult.recommendations.length > 0 && (
                <div className="mt-2 text-sm text-yellow-300">
                    <p className="font-medium">Recommendations:</p>
                    <ul className="list-disc list-inside text-xs text-yellow-200">{auditResult.recommendations.map((rec, i) => <li key={i}>{rec}</li>)}</ul>
                </div>
            )}
        </div>
    );
};

export const BiometricModal: React.FC<{
    isOpen: boolean; onSuccess: () => void; onClose: () => void; amount: string; recipient: RemitraxRecipientProfile | string; paymentMethod: PaymentRail; securityContext: 'personal' | 'corporate' | 'regulatory'; mfAuthMethods?: ('fingerprint' | 'voice' | 'retinal_scan' | 'neural_pattern' | 'face')[]; approvalRequiredBy?: string[];
}> = ({ isOpen, onSuccess, onClose, amount, recipient, paymentMethod, securityContext, mfAuthMethods = ['fingerprint'], approvalRequiredBy }) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [scanState, setScanState] = useState<ScanState>('scanning');
    const [verificationStep, setVerificationStep] = useState(0);
    const [biometricProgress, setBiometricProgress] = useState(0);
    const [activeAuthMethod, setActiveAuthMethod] = useState(mfAuthMethods[0] || 'face');
    const recipientName = typeof recipient === 'string' ? recipient : recipient.name;

    const verificationMessages = [ `Heuristic API: Initializing secure channel with ${paymentMethod}...`, `Heuristic API: Validating ${recipientName}'s identity...`, 'Heuristic API: Cross-referencing fraud ledgers...', 'Heuristic API: Executing on DLT/Quantum ledger...', 'Heuristic API: Confirming consensus...', 'Heuristic API: Archiving proof...', 'Heuristic API: Final checks...' ];

    useEffect(() => {
        if (!isOpen) { setScanState('scanning'); setVerificationStep(0); setBiometricProgress(0); return; }
        let stream: MediaStream | null = null;
        const startCamera = async () => {
            try { if (activeAuthMethod === 'face' || activeAuthMethod === 'retinal_scan') { stream = await navigator.mediaDevices.getUserMedia({ video: true }); if (videoRef.current) videoRef.current.srcObject = stream; } } catch (err) { setScanState('error'); }
        };
        startCamera();
        const scanProgressInterval = setInterval(() => setBiometricProgress(prev => Math.min(prev + Math.random() * 10, 100)), 200);
        const successTimer = setTimeout(() => { setScanState('success'); clearInterval(scanProgressInterval); }, 3000);
        const verifyTimer = setTimeout(() => setScanState('verifying'), 4000);
        const quantumSyncTimer = setTimeout(() => setScanState('quantum_sync'), 7500);
        const aiNegotiatingTimer = setTimeout(() => setScanState('ai_negotiating'), 10500);
        const successActionTimer = setTimeout(onSuccess, 15000);
        const closeTimer = setTimeout(onClose, 16000);
        return () => { clearTimeout(successTimer); clearTimeout(verifyTimer); clearTimeout(quantumSyncTimer); clearTimeout(aiNegotiatingTimer); clearTimeout(successActionTimer); clearTimeout(closeTimer); clearInterval(scanProgressInterval); if (stream) stream.getTracks().forEach(track => track.stop()); };
    }, [isOpen, onSuccess, onClose, activeAuthMethod]);

    useEffect(() => {
        if (['verifying', 'quantum_sync', 'ai_negotiating'].includes(scanState)) {
            const interval = setInterval(() => setVerificationStep(prev => Math.min(prev + 1, verificationMessages.length - 1)), 1500);
            return () => clearInterval(interval);
        }
    }, [scanState]);

    const getTitle = () => {
        switch (scanState) {
            case 'scanning': return `Scanning ${activeAuthMethod === 'face' ? 'Face' : 'Biometrics'}`;
            case 'success': return 'Identity Confirmed';
            case 'verifying': return 'Compliance Verification';
            case 'quantum_sync': return 'Quantum Network Sync';
            case 'ai_negotiating': return 'AI Optimization';
            case 'error': return 'Verification Failed';
            case 'recalibrating': return 'Recalibrating...';
        }
    };

    return (
        <div className={`fixed inset-0 bg-black/80 flex items-end sm:items-center justify-center z-50 backdrop-blur-lg transition-opacity duration-500 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
            <div className={`bg-gray-900 rounded-3xl p-8 max-w-lg w-full text-center border-2 border-cyan-700 shadow-xl transition-transform duration-500 ${isOpen ? 'translate-y-0 scale-100' : 'translate-y-full scale-90'}`}>
                <h3 className="text-3xl font-extrabold text-white mb-4">{getTitle()}</h3>
                <div className="relative w-72 h-72 mx-auto rounded-full overflow-hidden border-4 border-cyan-600 mb-6 shadow-lg">
                    {(activeAuthMethod === 'face' || activeAuthMethod === 'retinal_scan') ? <video ref={videoRef} autoPlay muted playsInline className="absolute top-0 left-0 w-full h-full object-cover transform scale-x-[-1]"></video> : <div className="absolute inset-0 flex items-center justify-center bg-gray-950 text-gray-500 text-lg"><p>Authenticating {activeAuthMethod}...</p></div>}
                    {scanState === 'scanning' && <div className="absolute inset-0 bg-grid-pattern-cyan animate-scan-holographic"><div className="absolute top-0 left-1/2 -translate-x-1/2 w-4/5 h-1 bg-cyan-400 opacity-70 blur-sm animate-scanner-line"></div></div>}
                    {scanState === 'success' && <div className="absolute inset-0 bg-green-500/50 flex items-center justify-center"><AnimatedCheckmarkIcon /></div>}
                    {scanState === 'verifying' && <div className="absolute inset-0 bg-black/50 flex items-center justify-center"><QuantumLedgerAnimation /></div>}
                    {scanState === 'quantum_sync' && <div className="absolute inset-0 bg-purple-900/80 flex items-center justify-center"><QuantumChannelEstablishment /></div>}
                    {scanState === 'ai_negotiating' && <div className="absolute inset-0 bg-teal-900/80 flex items-center justify-center"><AINegotiationAnimation /></div>}
                </div>
                {scanState === 'scanning' && <div className="w-full bg-gray-700 rounded-full h-2.5 mb-4"><div className="bg-cyan-500 h-2.5 rounded-full" style={{ width: `${biometricProgress}%` }}></div></div>}
                <p className="text-gray-300 mt-2 text-md">{['verifying', 'quantum_sync', 'ai_negotiating'].includes(scanState) ? verificationMessages[verificationStep] : `Sending $${amount} to ${recipientName}`}</p>
            </div>
            <style>{`.bg-grid-pattern-cyan{background-image:linear-gradient(rgba(0,255,255,0.3) 1px,transparent 1px),linear-gradient(90deg,rgba(0,255,255,0.3) 1px,transparent 1px);background-size:2.5rem 2.5rem}.animate-scan-holographic{animation:scan-holographic-effect 2.5s linear infinite; background-position: 0 0;}.animate-scanner-line{animation:scanner-line-move 2.5s ease-in-out infinite alternate}@keyframes scan-holographic-effect{0%{background-position:0 0}100%{background-position:0 -5rem}}@keyframes scanner-line-move{0%{transform:translate(-50%, 0) scaleX(0.2); opacity: 0;}20%{transform:translate(-50%, 25%) scaleX(1); opacity: 1;}80%{transform:translate(-50%, 75%) scaleX(1); opacity: 1;}100%{transform:translate(-50%, 100%) scaleX(0.2); opacity: 0;}}`}</style>
        </div>
    );
};

// ================================================================================================
// REMITRAX MAIN VIEW COMPONENT
// ================================================================================================

const SendMoneyView: React.FC<SendMoneyViewProps> = ({ setActiveView }) => {
    const context = useContext(DataContext);
    if (!context) throw new Error("SendMoneyView must be used within a DataProvider");
    const { addTransaction } = context;

    const [amount, setAmount] = useState('');
    const [recipientName, setRecipientName] = useState('');
    const [paymentMethod, setPaymentMethod] = useState<PaymentRail>('quantumpay');
    const [showBiometricModal, setShowBiometricModal] = useState(false);
    const [securityAudit, setSecurityAudit] = useState<SecurityAuditResult | null>(null);
    const [currentStep, setCurrentStep] = useState(1); // 1: Input, 2: Review, 3: Processing

    useEffect(() => {
        // Simulate security audit when amount or recipient changes
        const auditTimeout = setTimeout(() => {
            if (parseFloat(amount) > 0 && recipientName) {
                setSecurityAudit({
                    riskScore: parseFloat(amount) > 5000 ? 60 : 10,
                    fraudProbability: 0.05,
                    amlCompliance: 'pass',
                    sanctionScreening: 'pass',
                    quantumSignatureIntegrity: 'verified',
                    recommendations: parseFloat(amount) > 5000 ? ["High value. Verify recipient."] : [],
                    complianceAlerts: [],
                    threatVectorAnalysis: []
                });
            }
        }, 800);
        return () => clearTimeout(auditTimeout);
    }, [amount, recipientName]);

    const handleSendClick = () => {
        if (currentStep === 1) setCurrentStep(2);
        else if (currentStep === 2) setShowBiometricModal(true);
    };

    const handleSuccess = () => {
        const newTx: Transaction = {
            id: `tx_${Date.now()}`,
            type: 'expense',
            category: 'Transfer',
            description: `Sent to ${recipientName} via ${paymentMethod}`,
            amount: parseFloat(amount),
            date: new Date().toISOString().split('T')[0],
            carbonFootprint: 0.5
        };
        addTransaction(newTx);
        setShowBiometricModal(false);
        setCurrentStep(1);
        setAmount('');
        setRecipientName('');
        alert("Transfer Successful!");
    };

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold text-white tracking-wider">Remitrax: Quantum Secure Payments</h2>
            <Card title={currentStep === 1 ? "Initiate Transfer" : "Review Transaction"}>
                <div className="space-y-4">
                    {currentStep === 1 ? (
                        <>
                            <div>
                                <label className="block text-sm font-medium text-gray-400">Recipient</label>
                                <input type="text" value={recipientName} onChange={e => setRecipientName(e.target.value)} className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-white" placeholder="Name, @tag, or ID" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-400">Amount</label>
                                <input type="number" value={amount} onChange={e => setAmount(e.target.value)} className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-white" placeholder="0.00" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-400">Rail</label>
                                <select value={paymentMethod} onChange={e => setPaymentMethod(e.target.value as PaymentRail)} className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-white">
                                    <option value="quantumpay">QuantumPay (Instant DLT)</option>
                                    <option value="cashapp">Cash App</option>
                                    <option value="swift_global">SWIFT Global</option>
                                    <option value="blockchain_dlt">Blockchain DLT</option>
                                </select>
                            </div>
                            <SecurityAuditDisplay auditResult={securityAudit} />
                        </>
                    ) : (
                        <div className="space-y-2 text-gray-300">
                            <p><strong>To:</strong> {recipientName}</p>
                            <p><strong>Amount:</strong> ${amount}</p>
                            <p><strong>Method:</strong> {paymentMethod}</p>
                            <p className="text-sm text-yellow-400">Estimated Time: Instant (Quantum)</p>
                        </div>
                    )}
                    
                    <div className="flex justify-end gap-3 mt-6">
                         {currentStep === 2 && <button onClick={() => setCurrentStep(1)} className="px-4 py-2 bg-gray-600 rounded text-white">Back</button>}
                         <button onClick={handleSendClick} disabled={!amount || !recipientName} className="px-6 py-2 bg-cyan-600 hover:bg-cyan-500 rounded text-white font-bold disabled:opacity-50">
                            {currentStep === 1 ? "Review" : "Confirm & Send"}
                         </button>
                    </div>
                </div>
            </Card>
            <BiometricModal isOpen={showBiometricModal} onSuccess={handleSuccess} onClose={() => setShowBiometricModal(false)} amount={amount} recipient={recipientName} paymentMethod={paymentMethod} securityContext="personal" />
        </div>
    );
};

export default SendMoneyView;

================================================================================
// APPENDED FROM REPO: diplomat-bit/Fuckyou | ORIGINAL PATH: diplomat-bit-Fuckyou-70f83c5/components/SendMoneyView_1.tsx
================================================================================

import React, { useState, useContext, useEffect, useRef, useMemo, useCallback } from 'react';
import { 
  Send, 
  Zap, 
  ShieldCheck, 
  Database, 
  History, 
  Terminal, 
  MessageSquare, 
  Cpu, 
  Lock, 
  Activity, 
  Globe, 
  Layers, 
  BarChart3, 
  AlertTriangle, 
  Fingerprint, 
  Eye, 
  RefreshCcw,
  ChevronRight,
  Search,
  Filter,
  Download,
  Settings,
  UserCheck,
  FileText,
  ArrowUpRight,
  ArrowDownLeft,
  PieChart,
  ShieldAlert
} from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import Card from './Card';
import { DataContext } from '../context/DataContext';
import { View, PaymentRail, Transaction } from '../types';
import { BiometricModal, SecurityAuditDisplay, SecurityAuditResult } from './payment-components';

/**
 * QUANTUM FINANCIAL - ELITE BUSINESS DEMO ENGINE
 * VERSION: 4.0.1-PROD
 * 
 * PHILOSOPHY: 
 * - "Golden Ticket" Experience.
 * - High-Performance, Secure, Elite.
 * - No Pressure "Test Drive" Environment.
 * - Full Audit Traceability.
 * - AI-First Orchestration.
 */

// ================================================================================================
// TYPE DEFINITIONS & INTERFACES
// ================================================================================================

interface AuditEntry {
  id: string;
  timestamp: string;
  action: string;
  actor: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  metadata: any;
  hash: string; // Simulated blockchain hash
}

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  isExecuting?: boolean;
}

interface FraudSignal {
  id: string;
  type: string;
  strength: number;
  status: 'MONITORING' | 'FLAGGED' | 'CLEARED';
}

// ================================================================================================
// CONSTANTS & CONFIGURATION
// ================================================================================================

const SYSTEM_PROMPT = `
You are the Quantum Financial AI Strategist, the core intelligence of "The Demo Bank". 
Your goal is to provide a "Golden Ticket" experience for elite business clients.
You are professional, high-performance, and secure.

CAPABILITIES:
1. You can help users fill out the payment form.
2. You can analyze transaction risks.
3. You can explain complex financial rails (Wire, ACH, Quantum).
4. You can trigger UI actions by including a JSON block in your response.

JSON COMMAND STRUCTURE:
If the user wants to set a value, include:
{ "command": "SET_FORM", "data": { "recipient": "Name", "amount": 1000, "rail": "quantumpay" } }

If the user wants to navigate:
{ "command": "NAVIGATE", "data": { "view": "dashboard" } }

IMPORTANT: 
- DO NOT use the name "Citibank". Use "Quantum Financial" or "The Demo Bank".
- Be helpful but maintain an elite, professional tone.
- You are part of a "Test Drive" experience. Encourage the user to "kick the tires".
`;

// ================================================================================================
// UTILITY FUNCTIONS
// ================================================================================================

const generateHash = () => Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

const formatCurrency = (val: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);

// ================================================================================================
// SUB-COMPONENTS (MONOLITHIC ARCHITECTURE)
// ================================================================================================

/**
 * AuditLedger: Displays the immutable log of all sensitive actions.
 */
const AuditLedger: React.FC<{ logs: AuditEntry[] }> = ({ logs }) => (
  <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
    {logs.map((log) => (
      <div key={log.id} className="p-3 bg-black/40 border border-gray-800 rounded-lg flex flex-col gap-1 group hover:border-cyan-500/50 transition-colors">
        <div className="flex justify-between items-center">
          <span className={`text-[9px] font-bold px-2 py-0.5 rounded ${
            log.severity === 'CRITICAL' ? 'bg-red-500/20 text-red-400' : 
            log.severity === 'HIGH' ? 'bg-orange-500/20 text-orange-400' : 'bg-gray-800 text-gray-400'
          }`}>
            {log.severity}
          </span>
          <span className="text-[9px] font-mono text-gray-600">{log.timestamp}</span>
        </div>
        <p className="text-xs text-gray-300 font-medium">{log.action}</p>
        <div className="flex items-center gap-2 mt-1">
          <Database size={10} className="text-gray-600" />
          <span className="text-[8px] font-mono text-gray-600 truncate">HASH: {log.hash}</span>
        </div>
      </div>
    ))}
  </div>
);

/**
 * SecurityEngine: Visualizes real-time fraud monitoring.
 */
const SecurityEngine: React.FC = () => {
  const [signals, setSignals] = useState<FraudSignal[]>([
    { id: '1', type: 'IP_GEOLOCATION', strength: 0.98, status: 'CLEARED' },
    { id: '2', type: 'VELOCITY_CHECK', strength: 0.85, status: 'MONITORING' },
    { id: '3', type: 'BEHAVIORAL_BIOMETRICS', strength: 0.99, status: 'CLEARED' },
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setSignals(prev => prev.map(s => ({
        ...s,
        strength: Math.min(1, Math.max(0.7, s.strength + (Math.random() - 0.5) * 0.05))
      })));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-4">
      {signals.map(signal => (
        <div key={signal.id} className="space-y-1">
          <div className="flex justify-between text-[10px] font-black text-gray-500 uppercase tracking-widest">
            <span>{signal.type}</span>
            <span className="text-cyan-400">{(signal.strength * 100).toFixed(1)}%</span>
          </div>
          <div className="h-1 w-full bg-gray-900 rounded-full overflow-hidden">
            <div 
              className="h-full bg-cyan-500 transition-all duration-1000" 
              style={{ width: `${signal.strength * 100}%` }}
            />
          </div>
        </div>
      ))}
      <div className="pt-2 flex items-center gap-2 text-[10px] text-emerald-400 font-bold uppercase">
        <ShieldCheck size={14} /> All Systems Nominal
      </div>
    </div>
  );
};

// ================================================================================================
// MAIN COMPONENT: SendMoneyView
// ================================================================================================

const SendMoneyView: React.FC = () => {
  const context = useContext(DataContext);
  if (!context) throw new Error("SendMoneyView must be used within a DataProvider");
  
  const { addTransaction, setActiveView } = context;

  // --- FORM STATE ---
  const [amount, setAmount] = useState('');
  const [recipientName, setRecipientName] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentRail>('quantumpay');
  const [memo, setMemo] = useState('');
  const [currentStep, setCurrentStep] = useState(1);
  
  // --- UI STATE ---
  const [showBiometricModal, setShowBiometricModal] = useState(false);
  const [securityAudit, setSecurityAudit] = useState<SecurityAuditResult | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeTab, setActiveTab] = useState<'form' | 'analytics' | 'audit'>('form');
  
  // --- AUDIT STATE ---
  const [auditTrail, setAuditTrail] = useState<AuditEntry[]>([]);
  
  // --- AI CHAT STATE ---
  const [chatInput, setChatInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    { 
      id: '1', 
      role: 'assistant', 
      content: "Welcome to the Quantum Financial Test Drive. I am your AI Strategist. How can I assist with your capital deployment today?", 
      timestamp: new Date().toLocaleTimeString() 
    }
  ]);
  const [isAiTyping, setIsAiTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // --- INITIALIZATION ---
  useEffect(() => {
    logAuditAction('SESSION_START', 'SYSTEM', 'LOW', { view: 'SendMoneyView' });
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // --- AUDIT LOGGING LOGIC ---
  const logAuditAction = (action: string, actor: string, severity: AuditEntry['severity'], metadata: any) => {
    const newEntry: AuditEntry = {
      id: `audit_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      timestamp: new Date().toISOString(),
      action,
      actor,
      severity,
      metadata,
      hash: generateHash()
    };
    setAuditTrail(prev => [newEntry, ...prev]);
    console.log(`[AUDIT_LOG] ${action}`, newEntry);
  };

  // --- AI INTEGRATION ---
  const handleAiChat = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!chatInput.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: chatInput,
      timestamp: new Date().toLocaleTimeString()
    };

    setMessages(prev => [...prev, userMsg]);
    setChatInput('');
    setIsAiTyping(true);
    logAuditAction('AI_QUERY', 'USER', 'LOW', { query: chatInput });

    try {
      // Initialize Gemini
      const genAI = new GoogleGenAI(process.env.GEMINI_API_KEY || "");
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      const chat = model.startChat({
        history: messages.map(m => ({
          role: m.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: m.content }],
        })),
        generationConfig: {
          maxOutputTokens: 500,
        },
      });

      const result = await chat.sendMessage(`${SYSTEM_PROMPT}\n\nUser Input: ${chatInput}`);
      const responseText = result.response.text();

      // Parse for commands
      const commandMatch = responseText.match(/\{.*\}/s);
      if (commandMatch) {
        try {
          const commandData = JSON.parse(commandMatch[0]);
          handleAiCommand(commandData);
        } catch (err) {
          console.error("Failed to parse AI command", err);
        }
      }

      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: responseText.replace(/\{.*\}/s, '').trim(),
        timestamp: new Date().toLocaleTimeString()
      };

      setMessages(prev => [...prev, aiMsg]);
    } catch (error) {
      console.error("AI Error:", error);
      setMessages(prev => [...prev, {
        id: 'err',
        role: 'assistant',
        content: "I apologize, but my neural link is experiencing interference. Please proceed with manual entry.",
        timestamp: new Date().toLocaleTimeString()
      }]);
    } finally {
      setIsAiTyping(false);
    }
  };

  const handleAiCommand = (cmd: any) => {
    logAuditAction('AI_COMMAND_EXECUTION', 'AI_CORE', 'MEDIUM', cmd);
    if (cmd.command === 'SET_FORM') {
      if (cmd.data.recipient) setRecipientName(cmd.data.recipient);
      if (cmd.data.amount) setAmount(cmd.data.amount.toString());
      if (cmd.data.rail) setPaymentMethod(cmd.data.rail);
    } else if (cmd.command === 'NAVIGATE') {
      setActiveView(cmd.data.view as View);
    }
  };

  // --- PAYMENT LOGIC ---
  useEffect(() => {
    const auditTimeout = setTimeout(() => {
      if (parseFloat(amount) > 0 && recipientName) {
        const score = parseFloat(amount) > 10000 ? 75 : 12;
        setSecurityAudit({
          riskScore: score,
          fraudProbability: score / 1000,
          amlCompliance: 'pass',
          sanctionScreening: 'pass',
          quantumSignatureIntegrity: 'verified',
          recommendations: score > 50 ? ["Enhanced monitoring required", "Verify recipient via secondary channel"] : ["Optimal route confirmed"],
          complianceAlerts: [],
          threatVectorAnalysis: []
        });
        if (score > 50) {
          logAuditAction('HIGH_RISK_DETECTION', 'SECURITY_ENGINE', 'HIGH', { amount, recipientName, score });
        }
      } else {
        setSecurityAudit(null);
      }
    }, 800);
    return () => clearTimeout(auditTimeout);
  }, [amount, recipientName]);

  const handleSendClick = () => {
    if (currentStep === 1) {
      logAuditAction('PAYMENT_REVIEW_INITIATED', 'USER', 'LOW', { amount, recipientName, rail: paymentMethod });
      setCurrentStep(2);
    } else if (currentStep === 2) {
      setShowBiometricModal(true);
    }
  };

  const handleSuccess = async () => {
    setIsProcessing(true);
    logAuditAction('PAYMENT_AUTHORIZED', 'USER', 'HIGH', { amount, recipientName, method: 'BIOMETRIC' });
    
    // Simulate network latency for "Elite" feel
    await new Promise(resolve => setTimeout(resolve, 2000));

    const newTx: Transaction = {
      id: `tx_${Date.now()}`,
      type: 'expense',
      category: 'Transfer',
      description: `Quantum Transfer to ${recipientName}`,
      amount: parseFloat(amount),
      date: new Date().toISOString().split('T')[0],
      metadata: {
        rail: paymentMethod,
        memo: memo,
        audit_hash: generateHash()
      }
    };

    await addTransaction(newTx);
    logAuditAction('TRANSACTION_FINALIZED', 'LEDGER', 'MEDIUM', { txId: newTx.id });
    
    setShowBiometricModal(false);
    setIsProcessing(false);
    setActiveView(View.Dashboard);
  };

  // ================================================================================================
  // RENDER LOGIC
  // ================================================================================================

  return (
    <div className="min-h-screen bg-[#050505] text-gray-200 font-sans selection:bg-cyan-500/30">
      <div className="max-w-[1600px] mx-auto p-6 lg:p-10 space-y-8 animate-in fade-in duration-700">
        
        {/* ELITE HEADER */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end border-b border-gray-800/50 pb-8 gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-cyan-500 rounded-lg shadow-[0_0_20px_rgba(6,182,212,0.5)]">
                <Layers className="text-black" size={24} />
              </div>
              <h2 className="text-4xl font-black text-white tracking-tighter uppercase italic">
                Quantum <span className="text-cyan-500">Financial</span>
              </h2>
            </div>
            <p className="text-gray-500 text-xs font-mono tracking-[0.3em] uppercase flex items-center gap-2">
              <Activity size={12} className="text-emerald-500 animate-pulse" /> 
              System Status: Optimal // Node: Global_Nexus_01
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <div className="px-4 py-2 bg-gray-900/50 border border-gray-800 rounded-xl flex items-center gap-3 group hover:border-cyan-500/50 transition-all cursor-help">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-ping" />
              <div className="text-left">
                <p className="text-[8px] font-black text-gray-500 uppercase tracking-widest">Liquidity Pool</p>
                <p className="text-xs font-mono text-white">$2.45B Available</p>
              </div>
            </div>
            <div className="px-4 py-2 bg-gray-900/50 border border-gray-800 rounded-xl flex items-center gap-3 group hover:border-cyan-500/50 transition-all">
              <Globe size={16} className="text-cyan-500" />
              <div className="text-left">
                <p className="text-[8px] font-black text-gray-500 uppercase tracking-widest">Global Rails</p>
                <p className="text-xs font-mono text-white">182 Countries Active</p>
              </div>
            </div>
          </div>
        </header>

        {/* MAIN GRID */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
          
          {/* LEFT COLUMN: PAYMENT CONSOLE */}
          <div className="xl:col-span-8 space-y-8">
            
            {/* NAVIGATION TABS */}
            <div className="flex gap-1 p-1 bg-gray-900/50 border border-gray-800 rounded-2xl w-fit">
              {[
                { id: 'form', label: 'Transfer Portal', icon: Send },
                { id: 'analytics', label: 'Market Intelligence', icon: BarChart3 },
                { id: 'audit', label: 'Immutable Ledger', icon: Database },
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id as any);
                    logAuditAction('TAB_SWITCH', 'USER', 'LOW', { to: tab.id });
                  }}
                  className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${
                    activeTab === tab.id 
                      ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-600/20' 
                      : 'text-gray-500 hover:text-gray-300 hover:bg-gray-800'
                  }`}
                >
                  <tab.icon size={14} />
                  {tab.label}
                </button>
              ))}
            </div>

            {activeTab === 'form' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* PRIMARY FORM */}
                <div className="space-y-6">
                  <Card 
                    title={currentStep === 1 ? "Initiate Capital Flow" : "Security Verification"}
                    subtitle="Precision-engineered payment orchestration"
                  >
                    <div className="space-y-6 pt-4">
                      {currentStep === 1 ? (
                        <>
                          <div className="space-y-2">
                            <label className="block text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] ml-1">Recipient Identifier</label>
                            <div className="relative group">
                              <input 
                                type="text" 
                                value={recipientName} 
                                onChange={e => setRecipientName(e.target.value)} 
                                className="w-full bg-black/60 border border-gray-800 rounded-2xl p-4 text-white focus:ring-2 focus:ring-cyan-500/50 border-gray-700 outline-none font-mono text-lg transition-all group-hover:border-gray-600" 
                                placeholder="Entity Name or Wallet ID" 
                              />
                              <UserCheck className="absolute right-4 top-4 text-gray-700 group-focus-within:text-cyan-500 transition-colors" size={20} />
                            </div>
                          </div>

                          <div className="space-y-2">
                            <label className="block text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] ml-1">Magnitude (USD)</label>
                            <div className="relative group">
                              <input 
                                type="number" 
                                value={amount} 
                                onChange={e => setAmount(e.target.value)} 
                                className="w-full bg-black/60 border border-gray-800 rounded-2xl p-5 text-white focus:ring-2 focus:ring-cyan-500/50 border-gray-700 outline-none font-mono text-4xl font-black transition-all group-hover:border-gray-600" 
                                placeholder="0.00" 
                              />
                              <span className="absolute right-6 top-7 text-gray-600 font-black text-xl">USD</span>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <label className="block text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] ml-1">Execution Protocol</label>
                            <div className="grid grid-cols-2 gap-3">
                              {[
                                { id: 'quantumpay', label: 'QuantumPay', sub: 'Instant', icon: Zap },
                                { id: 'swift_global', label: 'SWIFT L1', sub: 'T+0', icon: Globe },
                                { id: 'blockchain_dlt', label: 'DLT Rail', sub: 'Encrypted', icon: Layers },
                                { id: 'cashapp', label: 'ACH Prime', sub: 'Standard', icon: RefreshCcw },
                              ].map(rail => (
                                <button
                                  key={rail.id}
                                  onClick={() => setPaymentMethod(rail.id as any)}
                                  className={`p-4 rounded-2xl border text-left transition-all ${
                                    paymentMethod === rail.id 
                                      ? 'bg-cyan-500/10 border-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.1)]' 
                                      : 'bg-black/40 border-gray-800 hover:border-gray-700'
                                  }`}
                                >
                                  <rail.icon size={18} className={paymentMethod === rail.id ? 'text-cyan-500' : 'text-gray-600'} />
                                  <p className={`text-xs font-black mt-2 uppercase ${paymentMethod === rail.id ? 'text-white' : 'text-gray-400'}`}>{rail.label}</p>
                                  <p className="text-[9px] text-gray-600 font-mono">{rail.sub}</p>
                                </button>
                              ))}
                            </div>
                          </div>

                          <div className="space-y-2">
                            <label className="block text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] ml-1">Transaction Memo (Optional)</label>
                            <textarea 
                              value={memo}
                              onChange={e => setMemo(e.target.value)}
                              className="w-full bg-black/60 border border-gray-800 rounded-2xl p-4 text-white focus:ring-2 focus:ring-cyan-500/50 border-gray-700 outline-none font-mono text-sm h-24 resize-none"
                              placeholder="Reference code, invoice #, or internal note..."
                            />
                          </div>
                        </>
                      ) : (
                        <div className="space-y-6 animate-in slide-in-from-right-8 duration-500">
                          <div className="bg-gradient-to-br from-gray-900 to-black p-8 rounded-[2.5rem] border border-gray-800 space-y-6 text-center relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-50" />
                            <p className="text-[10px] text-gray-500 uppercase font-black tracking-[0.3em]">Awaiting Digital Authorization</p>
                            <div className="space-y-1">
                              <div className="text-6xl font-black text-white font-mono tracking-tighter">
                                {formatCurrency(parseFloat(amount))}
                              </div>
                              <p className="text-cyan-400 font-mono text-sm tracking-widest uppercase">Target: {recipientName}</p>
                            </div>
                            <div className="flex justify-center gap-8 py-4 border-y border-gray-800/50">
                              <div className="text-center">
                                <p className="text-[8px] text-gray-600 uppercase font-bold">Network Fee</p>
                                <p className="text-xs font-mono text-white">$0.00</p>
                              </div>
                              <div className="text-center">
                                <p className="text-[8px] text-gray-600 uppercase font-bold">Settlement</p>
                                <p className="text-xs font-mono text-white">Instant</p>
                              </div>
                              <div className="text-center">
                                <p className="text-[8px] text-gray-600 uppercase font-bold">Protocol</p>
                                <p className="text-xs font-mono text-white uppercase">{paymentMethod}</p>
                              </div>
                            </div>
                            <p className="text-[9px] text-gray-600 font-mono italic">
                              SECURE_HASH: {generateHash().substring(0, 24)}...
                            </p>
                          </div>
                          <SecurityAuditDisplay auditResult={securityAudit} />
                        </div>
                      )}
                      
                      <div className="flex gap-4 mt-8">
                        {currentStep === 2 && (
                          <button 
                            onClick={() => setCurrentStep(1)} 
                            className="flex-1 py-4 bg-gray-900 hover:bg-gray-800 text-gray-400 font-black rounded-2xl transition-all uppercase tracking-widest text-xs border border-gray-800"
                          >
                            Modify
                          </button>
                        )}
                        <button 
                          onClick={handleSendClick} 
                          disabled={!amount || !recipientName || isProcessing} 
                          className="flex-[2] py-5 bg-cyan-600 hover:bg-cyan-500 rounded-2xl text-white font-black shadow-2xl shadow-cyan-600/30 transition-all active:scale-[0.98] disabled:opacity-30 uppercase tracking-[0.2em] text-xs flex items-center justify-center gap-3 group"
                        >
                          {isProcessing ? (
                            <RefreshCcw size={18} className="animate-spin" />
                          ) : (
                            <>
                              {currentStep === 1 ? "Review Protocol" : "Authorize Flow"}
                              <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </Card>
                </div>

                {/* SECONDARY DIAGNOSTICS */}
                <div className="space-y-8">
                  <Card title="Signal Intelligence" subtitle="Real-time heuristic monitoring">
                    <div className="space-y-6 py-2">
                      <div className="p-5 bg-black/60 rounded-2xl border border-gray-800 space-y-4">
                        <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest flex items-center gap-2">
                          <Cpu size={12} className="text-cyan-500" /> Neural Risk Engine
                        </p>
                        <SecurityEngine />
                      </div>

                      <div className="p-5 bg-black/60 rounded-2xl border border-gray-800 space-y-4">
                        <div className="flex items-center gap-4">
                          <div className="p-2 bg-emerald-500/10 rounded-lg">
                            <ShieldCheck className="text-emerald-500" size={20} />
                          </div>
                          <div>
                            <p className="text-[10px] text-white font-black uppercase tracking-widest">Zero-Knowledge Proofs</p>
                            <p className="text-[10px] text-gray-500">Identity obfuscation active for this route.</p>
                          </div>
                        </div>
                        <div className="h-px bg-gray-800" />
                        <div className="flex items-center gap-4">
                          <div className="p-2 bg-cyan-500/10 rounded-lg">
                            <Terminal className="text-cyan-500" size={20} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-[10px] text-white font-black uppercase tracking-widest">Telemetry Stream</p>
                            <p className="text-[9px] text-gray-600 font-mono truncate mt-1">
                              &gt; handshake_init: node_{paymentMethod.substring(0, 4)}...
                              <br />
                              &gt; entropy_check: 0.99923...
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="p-6 bg-gradient-to-br from-indigo-900/20 to-transparent border border-indigo-500/20 rounded-3xl flex items-center gap-5 group hover:border-indigo-500/40 transition-all">
                        <div className="relative">
                          <History className="text-indigo-400" size={24} />
                          <div className="absolute -top-1 -right-1 w-3 h-3 bg-indigo-500 rounded-full border-2 border-black" />
                        </div>
                        <div>
                          <p className="text-[10px] text-white font-black uppercase tracking-widest">Historical Synergy</p>
                          <p className="text-[10px] text-gray-400 mt-1">3 successful deployments to this recipient in the last 30 cycles.</p>
                        </div>
                      </div>
                    </div>
                  </Card>

                  <Card title="Compliance Oracle">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-3 bg-gray-900/30 rounded-xl border border-gray-800">
                        <div className="flex items-center gap-3">
                          <FileText size={14} className="text-gray-500" />
                          <span className="text-[10px] font-bold text-gray-400 uppercase">AML Screening</span>
                        </div>
                        <span className="text-[10px] font-mono text-emerald-500">PASSED</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-gray-900/30 rounded-xl border border-gray-800">
                        <div className="flex items-center gap-3">
                          <ShieldAlert size={14} className="text-gray-500" />
                          <span className="text-[10px] font-bold text-gray-400 uppercase">Sanctions Check</span>
                        </div>
                        <span className="text-[10px] font-mono text-emerald-500">CLEAR</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-gray-900/30 rounded-xl border border-gray-800">
                        <div className="flex items-center gap-3">
                          <Fingerprint size={14} className="text-gray-500" />
                          <span className="text-[10px] font-bold text-gray-400 uppercase">KYB Verification</span>
                        </div>
                        <span className="text-[10px] font-mono text-emerald-500">VERIFIED</span>
                      </div>
                    </div>
                  </Card>
                </div>
              </div>
            )}

            {activeTab === 'analytics' && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card title="Volume Analysis">
                    <div className="h-48 flex items-end justify-between gap-2 px-2">
                      {[40, 70, 45, 90, 65, 80, 95].map((h, i) => (
                        <div key={i} className="w-full bg-cyan-500/20 rounded-t-lg relative group">
                          <div 
                            className="absolute bottom-0 left-0 w-full bg-cyan-500 rounded-t-lg transition-all duration-1000 group-hover:bg-cyan-400" 
                            style={{ height: `${h}%` }} 
                          />
                        </div>
                      ))}
                    </div>
                    <div className="flex justify-between mt-4 text-[8px] font-mono text-gray-600 uppercase">
                      <span>Mon</span><span>Wed</span><span>Fri</span><span>Sun</span>
                    </div>
                  </Card>
                  <Card title="Rail Efficiency">
                    <div className="space-y-4 pt-4">
                      {[
                        { label: 'Quantum', val: 99.9, color: 'bg-cyan-500' },
                        { label: 'SWIFT', val: 82.4, color: 'bg-indigo-500' },
                        { label: 'ACH', val: 94.1, color: 'bg-emerald-500' },
                      ].map(r => (
                        <div key={r.label} className="space-y-1">
                          <div className="flex justify-between text-[10px] font-bold text-gray-400 uppercase">
                            <span>{r.label}</span>
                            <span>{r.val}%</span>
                          </div>
                          <div className="h-1.5 w-full bg-gray-900 rounded-full overflow-hidden">
                            <div className={`h-full ${r.color}`} style={{ width: `${r.val}%` }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card>
                  <Card title="Global Reach">
                    <div className="flex items-center justify-center h-48 relative">
                      <Globe size={100} className="text-gray-800 animate-pulse" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                          <p className="text-2xl font-black text-white">182</p>
                          <p className="text-[8px] text-gray-500 uppercase font-bold">Active Nodes</p>
                        </div>
                      </div>
                    </div>
                  </Card>
                </div>
                <Card title="Market Liquidity Heatmap">
                  <div className="grid grid-cols-12 gap-2 h-32">
                    {Array.from({ length: 48 }).map((_, i) => (
                      <div 
                        key={i} 
                        className="rounded-sm transition-all hover:scale-110 cursor-crosshair" 
                        style={{ 
                          backgroundColor: `rgba(6, 182, 212, ${Math.random() * 0.8 + 0.1})`,
                        }}
                        title={`Node ${i}: High Liquidity`}
                      />
                    ))}
                  </div>
                </Card>
              </div>
            )}

            {activeTab === 'audit' && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <Card 
                  title="Immutable Audit Ledger" 
                  subtitle="Cryptographically signed record of all system interactions"
                  headerActions={[
                    { id: 'dl', icon: <Download />, label: 'Export CSV', onClick: () => logAuditAction('LEDGER_EXPORT', 'USER', 'MEDIUM', { format: 'CSV' }) },
                    { id: 'filter', icon: <Filter />, label: 'Filter', onClick: () => {} }
                  ]}
                >
                  <AuditLedger logs={auditTrail} />
                </Card>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-6 bg-gray-900/30 border border-gray-800 rounded-2xl space-y-2">
                    <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest">Ledger Integrity</p>
                    <div className="flex items-center gap-3">
                      <ShieldCheck className="text-emerald-500" size={20} />
                      <p className="text-xs font-mono text-gray-300">All blocks verified. No discrepancies detected.</p>
                    </div>
                  </div>
                  <div className="p-6 bg-gray-900/30 border border-gray-800 rounded-2xl space-y-2">
                    <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest">Storage Utilization</p>
                    <div className="flex items-center gap-3">
                      <Database className="text-cyan-500" size={20} />
                      <p className="text-xs font-mono text-gray-300">Quantum-encrypted cold storage: 12.4 TB used.</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* RIGHT COLUMN: AI STRATEGIST CHAT */}
          <div className="xl:col-span-4">
            <div className="sticky top-10 space-y-6">
              <Card 
                className="h-[calc(100vh-180px)] flex flex-col border-cyan-500/20 shadow-[0_0_40px_rgba(6,182,212,0.05)]"
                title="AI Strategist"
                subtitle="Quantum Financial Intelligence Core"
                icon={<Cpu className="text-cyan-500" size={20} />}
              >
                <div className="flex-1 overflow-y-auto space-y-6 pr-2 custom-scrollbar mb-4">
                  {messages.map((msg) => (
                    <div 
                      key={msg.id} 
                      className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
                    >
                      <div className={`max-w-[85%] p-4 rounded-2xl text-xs leading-relaxed ${
                        msg.role === 'user' 
                          ? 'bg-cyan-600 text-white rounded-tr-none' 
                          : msg.role === 'system'
                          ? 'bg-gray-800/50 text-gray-400 italic text-center w-full'
                          : 'bg-gray-900 border border-gray-800 text-gray-300 rounded-tl-none'
                      }`}>
                        {msg.content}
                      </div>
                      <span className="text-[8px] font-mono text-gray-600 mt-1 uppercase">{msg.timestamp}</span>
                    </div>
                  ))}
                  {isAiTyping && (
                    <div className="flex items-center gap-2 text-cyan-500 animate-pulse">
                      <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  )}
                  <div ref={chatEndRef} />
                </div>

                <form onSubmit={handleAiChat} className="relative mt-auto">
                  <input 
                    type="text" 
                    value={chatInput}
                    onChange={e => setChatInput(e.target.value)}
                    placeholder="Ask the Strategist..."
                    className="w-full bg-black border border-gray-800 rounded-2xl p-4 pr-12 text-xs text-white focus:ring-2 focus:ring-cyan-500/50 outline-none transition-all"
                  />
                  <button 
                    type="submit"
                    disabled={!chatInput.trim() || isAiTyping}
                    className="absolute right-2 top-2 p-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl transition-all disabled:opacity-30"
                  >
                    <ArrowUpRight size={18} />
                  </button>
                </form>
              </Card>

              {/* QUICK ACTIONS */}
              <div className="grid grid-cols-2 gap-4">
                <button 
                  onClick={() => {
                    setChatInput("Analyze the risk of a $50,000 transfer to Global Logistics Inc.");
                    handleAiChat();
                  }}
                  className="p-4 bg-gray-900/50 border border-gray-800 rounded-2xl text-[10px] font-black text-gray-500 uppercase tracking-widest hover:border-cyan-500/50 hover:text-cyan-400 transition-all text-left"
                >
                  Risk Analysis
                </button>
                <button 
                  onClick={() => {
                    setChatInput("What is the most efficient rail for a T+0 settlement to London?");
                    handleAiChat();
                  }}
                  className="p-4 bg-gray-900/50 border border-gray-800 rounded-2xl text-[10px] font-black text-gray-500 uppercase tracking-widest hover:border-cyan-500/50 hover:text-cyan-400 transition-all text-left"
                >
                  Rail Optimization
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MODALS */}
      <BiometricModal 
        isOpen={showBiometricModal} 
        onSuccess={handleSuccess} 
        onClose={() => {
          setShowBiometricModal(false);
          logAuditAction('BIOMETRIC_CANCELLED', 'USER', 'MEDIUM', { amount });
        }} 
        amount={amount} 
        recipient={recipientName} 
        paymentMethod={paymentMethod} 
        securityContext="corporate_treasury" 
      />

      {/* GLOBAL OVERLAYS */}
      {isProcessing && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center">
          <div className="text-center space-y-6">
            <div className="relative">
              <div className="w-24 h-24 border-4 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin mx-auto" />
              <Lock className="absolute inset-0 m-auto text-cyan-500" size={32} />
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter">Securing Transaction</h3>
              <p className="text-gray-500 font-mono text-xs animate-pulse">ENCRYPTING_PACKETS // SIGNING_LEDGER // VERIFYING_NODES</p>
            </div>
          </div>
        </div>
      )}

      {/* CUSTOM STYLES */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #1f2937;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #06b6d4;
        }
      `}</style>
    </div>
  );
};

export default SendMoneyView;

================================================================================
// APPENDED FROM REPO: diplomat-bit/G20 | ORIGINAL PATH: diplomat-bit-G20-0199fa7/components/SendMoneyView.tsx
================================================================================

import React, { useState } from 'react';
import { View } from '../types';

interface SendMoneyViewProps {
  setActiveView: (view: View) => void;
}

const SendMoneyView: React.FC<SendMoneyViewProps> = ({ setActiveView }) => {
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');

  const handleSend = () => {
    alert(`Sending $${amount} to ${recipient}...`);
    setActiveView(View.Dashboard);
  };

  return (
    <div className="max-w-md mx-auto space-y-6">
      <h2 className="text-2xl font-bold text-white">Send Money</h2>
      <div className="bg-gray-800/50 backdrop-blur-md p-8 rounded-2xl border border-gray-700 space-y-4">
        <div className="space-y-2">
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Recipient</label>
          <input
            type="text"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            placeholder="Name, email, or wallet address"
            className="w-full bg-gray-900/50 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Amount</label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">$</span>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              className="w-full bg-gray-900/50 border border-gray-700 rounded-xl pl-8 pr-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        <button
          onClick={handleSend}
          className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-xl transition-colors shadow-lg shadow-blue-600/20"
        >
          Send Now
        </button>
      </div>
    </div>
  );
};

export default SendMoneyView;


================================================================================
// APPENDED FROM REPO: diplomat-bit/jamesburvelocallaghaniiiand | ORIGINAL PATH: diplomat-bit-jamesburvelocallaghaniiiand-9414e97/components/SendMoneyView.tsx
================================================================================

// components/views/personal/SendMoneyView.tsx
// RE-ENACTED & EXPANDED: This component has been resurrected from its deprecated state.
// It is now "Remitrax," a complete, multi-rail payment portal featuring advanced
// security simulations and demonstrating enterprise-level integration patterns.
// After a decade of upgrades, Remitrax has evolved into an unparalleled financial ecosystem,
// incorporating AI, quantum-resistant security, DLT, and even neuro-link technologies.

import React, { useState, useContext, useRef, useEffect, useCallback } from 'react';
import Card from './Card';
import { DataContext } from '../context/DataContext';
import { View } from '../types';
import type { Transaction } from '../types';

// ================================================================================================
// GLOBAL REMITRAX PLATFORM WIDE TYPE DEFINITIONS
// ================================================================================================

export type PaymentRail = 'quantumpay' | 'cashapp' | 'swift_global' | 'blockchain_dlt' | 'interstellar_p2p' | 'neuro_link' | 'ai_contract_escrow';
export type ScanState = 'scanning' | 'success' | 'verifying' | 'error' | 'recalibrating' | 'quantum_sync' | 'ai_negotiating';

export interface RemitraxRecipientProfile {
  id: string;
  name: string;
  avatarUrl?: string;
  quantumTag?: string;
  cashtag?: string;
  swiftDetails?: { bankName: string; bic: string; accountNumber: string; };
  blockchainAddress?: string;
  neuroLinkAddress?: string;
  galacticP2PId?: string;
  preferredCurrency?: string;
  lastUsedDate?: string;
  trustScore?: number;
  kycStatus?: 'verified' | 'pending' | 'unverified';
  blacklisted?: boolean;
  bankAccounts?: { bankName: string; accountNumber: string; routingNumber?: string; iban?: string; }[];
  eWalletDetails?: { type: 'paypal' | 'venmo' | 'zelle' | 'revolut' | 'cashapp' | 'quantumpay'; identifier: string; }[];
  contactPreferences?: { email: boolean; sms: boolean; push: boolean; holo_alert?: boolean; };
  relationshipStatus?: 'family' | 'friend' | 'business' | 'self' | 'vendor' | 'partner' | 'regulatory_body';
  category?: 'personal' | 'business' | 'charity' | 'government';
  multiEntitySupport?: { parentId: string; subEntities: { id: string; name: string; type: string; }[]; };
  complianceFlags?: ('high_risk' | 'sanctioned_entity' | 'PEP' | 'low_risk' | 'verified_entity')[];
}

export interface RemitraxCurrency {
  code: string;
  name: string;
  symbol: string;
  isCrypto: boolean;
  conversionRate?: number;
  quantumFluctuationIndex?: number;
  decimalPlaces: number;
  minTransactionAmount?: number;
  maxTransactionAmount?: number;
  liquidityScore?: number;
  marketCap?: number;
  regulatoryStatus?: 'regulated' | 'unregulated' | 'experimental';
  crossChainCompatible?: boolean;
}

export interface ScheduledPaymentRule {
  frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'annually' | 'once_on_date' | 'conditional_event';
  startDate: string;
  endDate?: string;
  executionCondition?: string;
  nextExecutionDate?: string;
  maxExecutions?: number;
  triggerEventId?: string;
  paymentReason?: string;
  aiAnalysisTags?: string[];
  geoFenceTrigger?: { lat: number; lon: number; radius: number; };
  biometricApprovalRequired?: boolean;
}

export interface AdvancedTransactionSettings {
  priority: 'low' | 'normal' | 'high' | 'ultra_quantum';
  carbonOffsetRatio: number;
  privacyLevel: 'standard' | 'enhanced' | 'fully_anonymous_dlt';
  receiptPreference: 'email' | 'blockchain_proof' | 'neuronal_link_receipt' | 'physical_mail';
  notificationPreferences: { email: boolean; sms: boolean; push: boolean; holo_alert: boolean; };
  multiSignatureRequired?: boolean;
  escrowDetails?: { agentId: string; releaseCondition: string; };
  dynamicFeeOptimization?: 'auto' | 'manual';
  dataEncryptionStandard: 'aes256' | 'quantum_resistant_hybrid' | 'zero_knowledge_proof' | 'obfuscated_vault';
  routeOptimizationPreference: 'speed' | 'cost' | 'privacy' | 'sustainability' | 'compliance';
  dlcDetails?: { contractId: string; conditions: string; };
  transactionExpiryMinutes?: number;
  regulatoryReportingFlags?: ('FATCA' | 'CRS' | 'AML' | 'CFT' | 'none')[];
  postQuantumSecurityEnabled?: boolean;
}

export interface SecurityAuditResult {
  riskScore: number;
  fraudProbability: number;
  amlCompliance: 'pass' | 'fail' | 'review';
  sanctionScreening: 'pass' | 'fail';
  quantumSignatureIntegrity: 'verified' | 'compromised' | 'pending';
  recommendations: string[];
  complianceAlerts?: string[];
  threatVectorAnalysis?: { type: string; severity: 'low' | 'medium' | 'high'; description: string; }[];
}

export interface EnvironmentalImpactReport {
    transactionCO2e: number;
    offsetCO2e: number;
    netCO2e: number;
    renewableEnergyUsedPercentage: number;
    recommendations?: string[];
}

export interface RailSpecificDetails {
    swift?: { bankName: string; bic: string; accountNumber: string; beneficiaryAddress: string; };
    blockchain?: { network: 'ethereum' | 'polygon' | 'solana' | 'custom_dlt' | ''; gasLimit: string; dataPayload?: string; };
    interstellar?: { galaxyId: string; starSystemAddress: string; vesselIdentifier?: string; warpDriveEfficiencyRating?: number; };
    neuroLink?: { neuralSignatureType: 'brainwave' | 'retinal_pattern' | ''; recipientId: string; neuroSyncProtocolVersion?: string; };
    aiContractEscrow?: { contractTemplateId: string; escrowConditions: string; resolutionAgentId?: string; immutableLedgerHash?: string; };
    quantumpay?: { channelProtocol: 'quantum_tunnel_v2' | 'entanglement_link_v1'; encryptionStandard: 'QRC-256' | 'hybrid_post_quantum'; quantumSignatureAlgorithm?: string; }
}

interface SendMoneyViewProps {
  setActiveView?: (view: View) => void;
}

// ================================================================================================
// ANIMATED UI SUB-COMPONENTS
// ================================================================================================

export const AnimatedCheckmarkIcon: React.FC = () => (
    <>
        <svg className="h-24 w-24 transform scale-125" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
            <defs>
                <linearGradient id="checkmarkGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#4ade80" />
                    <stop offset="50%" stopColor="#86efac" />
                    <stop offset="100%" stopColor="#22c55e" />
                </linearGradient>
                <filter id="hologramGlow">
                    <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur" />
                    <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 10 0" result="coloredBlur" />
                    <feMerge><feMergeNode in="coloredBlur" /><feMergeNode in="SourceGraphic" /></feMerge>
                </filter>
            </defs>
            <circle className="checkmark__circle" cx="26" cy="26" r="25" fill="none" stroke="url(#checkmarkGradient)" filter="url(#hologramGlow)" />
            <path className="checkmark__check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" />
        </svg>
        <style>{`
            .checkmark__circle { stroke-dasharray: 166; stroke-dashoffset: 166; stroke-width: 4; stroke-miterlimit: 10; fill: none; animation: stroke-circle 0.6s cubic-bezier(0.65, 0, 0.45, 1) forwards; box-shadow: 0 0 15px rgba(66, 255, 125, 0.7); }
            .checkmark__check { transform-origin: 50% 50%; stroke-dasharray: 48; stroke-dashoffset: 48; stroke-width: 5; stroke: #fff; animation: stroke-check 0.3s cubic-bezier(0.65, 0, 0.45, 1) 0.8s forwards; }
            @keyframes stroke-circle { 100% { stroke-dashoffset: 0; } }
            @keyframes stroke-check { 100% { stroke-dashoffset: 0; } }
        `}</style>
    </>
);

export const QuantumLedgerAnimation: React.FC = () => (
    <>
        <div className="quantum-ledger-container">
            <div className="quantum-grid-enhanced">
                {Array.from({ length: 16 }).map((_, i) => (
                    <div key={i} className="quantum-block-enhanced" style={{ animationDelay: `${i * 0.08}s` }}></div>
                ))}
            </div>
            <div className="quantum-data-flow">
                <div className="data-packet" style={{ '--flow-delay': '0s' } as React.CSSProperties}></div>
                <div className="data-packet" style={{ '--flow-delay': '0.5s' } as React.CSSProperties}></div>
            </div>
            <div className="text-center mt-4 text-xs text-cyan-300 animate-pulse">Quantum Entanglement Protocol: Active</div>
        </div>
        <style>{`
            .quantum-ledger-container { position: relative; width: 150px; height: 150px; display: flex; flex-direction: column; align-items: center; justify-content: center; }
            .quantum-grid-enhanced { display: grid; grid-template-columns: repeat(4, 1fr); gap: 6px; width: 120px; height: 120px; position: relative; z-index: 1; }
            .quantum-block-enhanced { background-color: rgba(6, 182, 212, 0.2); border: 1px solid #06b6d4; border-radius: 3px; animation: quantum-pulse 2s infinite ease-in-out forwards; box-shadow: 0 0 8px rgba(6, 182, 212, 0.5); }
            @keyframes quantum-pulse { 0%, 100% { background-color: rgba(6, 182, 212, 0.2); transform: scale(1); box-shadow: 0 0 8px rgba(6, 182, 212, 0.5); } 50% { background-color: rgba(165, 243, 252, 0.7); transform: scale(1.08); box-shadow: 0 0 15px rgba(165, 243, 252, 0.8); } }
            .quantum-data-flow { position: absolute; inset: 0; display: flex; justify-content: center; align-items: center; }
            .data-packet { position: absolute; width: 8px; height: 8px; border-radius: 50%; background: linear-gradient(45deg, #0ef, #06b6d4); box-shadow: 0 0 5px #0ef, 0 0 10px #06b6d4; animation: data-flow-path 4s infinite linear var(--flow-delay); opacity: 0; }
            @keyframes data-flow-path { 0% { transform: translate(-60px, -60px) scale(0.5); opacity: 0; } 20% { opacity: 1; } 50% { transform: translate(60px, 60px) scale(1.2); opacity: 1; } 80% { opacity: 0; } 100% { transform: translate(120px, 120px) scale(0.5); opacity: 0; } }
        `}</style>
    </>
);

export const QuantumChannelEstablishment: React.FC = () => (
    <>
        <div className="flex flex-col items-center justify-center space-y-3">
            <div className="relative w-24 h-24 rounded-full flex items-center justify-center border-2 border-purple-500 animate-spin-slow">
                <div className="w-16 h-16 rounded-full border-2 border-purple-400 animate-ping-once"></div>
                <div className="absolute w-8 h-8 bg-purple-600 rounded-full animate-pulse-fast"></div>
            </div>
            <p className="text-sm text-purple-300 animate-fade-in-out">Establishing Quantum Tunnel...</p>
        </div>
        <style>{`.animate-spin-slow { animation: spin-slow 8s linear infinite; } .animate-ping-once { animation: ping-once 2s ease-out infinite; } .animate-pulse-fast { animation: pulse-fast 1.5s ease-in-out infinite; } .animate-fade-in-out { animation: fade-in-out 3s ease-in-out infinite; }
        @keyframes spin-slow { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } } @keyframes ping-once { 0% { transform: scale(0.2); opacity: 0; } 50% { transform: scale(1); opacity: 1; } 100% { transform: scale(1.2); opacity: 0; } } @keyframes pulse-fast { 0%, 100% { transform: scale(1); opacity: 1; } 50% { transform: scale(1.1); opacity: 0.8; } } @keyframes fade-in-out { 0%, 100% { opacity: 0.5; } 50% { opacity: 1; } }`}</style>
    </>
);

export const AINegotiationAnimation: React.FC = () => (
    <>
        <div className="flex flex-col items-center justify-center space-y-3">
            <div className="relative w-24 h-24 flex items-center justify-center">
                <i className="fas fa-robot text-7xl text-teal-500 animate-pulse-slow"></i>
                <div className="absolute w-12 h-12 bg-gray-900 rounded-full flex items-center justify-center animate-spin-fast">
                    <i className="fas fa-exchange-alt text-xl text-teal-300"></i>
                </div>
            </div>
            <p className="text-sm text-teal-300 animate-fade-in-out">AI Negotiating Optimal Route & Terms...</p>
        </div>
        <style>{`.animate-pulse-slow { animation: pulse-slow 2.5s ease-in-out infinite; } .animate-spin-fast { animation: spin-fast 1.5s linear infinite; }
        @keyframes pulse-slow { 0%, 100% { transform: scale(1); opacity: 1; } 50% { transform: scale(1.05); opacity: 0.8; } } @keyframes spin-fast { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
    </>
);

export const SecurityAuditDisplay: React.FC<{ auditResult: SecurityAuditResult | null }> = ({ auditResult }) => {
    if (!auditResult) return <div className="flex items-center space-x-2 text-yellow-400"><svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg><span>Performing real-time security audit...</span></div>;

    return (
        <div className="bg-gray-800 p-4 rounded-lg space-y-2 border border-gray-700">
            <h4 className="font-semibold text-lg text-white">Security Audit Report</h4>
            <div className="grid grid-cols-2 gap-2 text-sm">
                <p className="text-gray-400">Risk Score:</p><p className={`${auditResult.riskScore > 50 ? 'text-red-400' : 'text-green-400'}`}>{auditResult.riskScore}/100</p>
                <p className="text-gray-400">Fraud Probability:</p><p className={`${auditResult.fraudProbability > 0.3 ? 'text-red-400' : 'text-green-400'}`}>{`${(auditResult.fraudProbability * 100).toFixed(2)}%`}</p>
                <p className="text-gray-400">AML Compliance:</p><p className={auditResult.amlCompliance === 'pass' ? 'text-green-400' : 'text-yellow-400'}>{auditResult.amlCompliance}</p>
            </div>
            {auditResult.recommendations.length > 0 && (
                <div className="mt-2 text-sm text-yellow-300">
                    <p className="font-medium">Recommendations:</p>
                    <ul className="list-disc list-inside text-xs text-yellow-200">{auditResult.recommendations.map((rec, i) => <li key={i}>{rec}</li>)}</ul>
                </div>
            )}
        </div>
    );
};

export const BiometricModal: React.FC<{
    isOpen: boolean; onSuccess: () => void; onClose: () => void; amount: string; recipient: RemitraxRecipientProfile | string; paymentMethod: PaymentRail; securityContext: 'personal' | 'corporate' | 'regulatory'; mfAuthMethods?: ('fingerprint' | 'voice' | 'retinal_scan' | 'neural_pattern' | 'face')[]; approvalRequiredBy?: string[];
}> = ({ isOpen, onSuccess, onClose, amount, recipient, paymentMethod, securityContext, mfAuthMethods = ['fingerprint'], approvalRequiredBy }) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [scanState, setScanState] = useState<ScanState>('scanning');
    const [verificationStep, setVerificationStep] = useState(0);
    const [biometricProgress, setBiometricProgress] = useState(0);
    const [activeAuthMethod, setActiveAuthMethod] = useState(mfAuthMethods[0] || 'face');
    const recipientName = typeof recipient === 'string' ? recipient : recipient.name;

    const verificationMessages = [ `Heuristic API: Initializing secure channel with ${paymentMethod}...`, `Heuristic API: Validating ${recipientName}'s identity...`, 'Heuristic API: Cross-referencing fraud ledgers...', 'Heuristic API: Executing on DLT/Quantum ledger...', 'Heuristic API: Confirming consensus...', 'Heuristic API: Archiving proof...', 'Heuristic API: Final checks...' ];

    useEffect(() => {
        if (!isOpen) { setScanState('scanning'); setVerificationStep(0); setBiometricProgress(0); return; }
        let stream: MediaStream | null = null;
        const startCamera = async () => {
            try { if (activeAuthMethod === 'face' || activeAuthMethod === 'retinal_scan') { stream = await navigator.mediaDevices.getUserMedia({ video: true }); if (videoRef.current) videoRef.current.srcObject = stream; } } catch (err) { setScanState('error'); }
        };
        startCamera();
        const scanProgressInterval = setInterval(() => setBiometricProgress(prev => Math.min(prev + Math.random() * 10, 100)), 200);
        const successTimer = setTimeout(() => { setScanState('success'); clearInterval(scanProgressInterval); }, 3000);
        const verifyTimer = setTimeout(() => setScanState('verifying'), 4000);
        const quantumSyncTimer = setTimeout(() => setScanState('quantum_sync'), 7500);
        const aiNegotiatingTimer = setTimeout(() => setScanState('ai_negotiating'), 10500);
        const successActionTimer = setTimeout(onSuccess, 15000);
        const closeTimer = setTimeout(onClose, 16000);
        return () => { clearTimeout(successTimer); clearTimeout(verifyTimer); clearTimeout(quantumSyncTimer); clearTimeout(aiNegotiatingTimer); clearTimeout(successActionTimer); clearTimeout(closeTimer); clearInterval(scanProgressInterval); if (stream) stream.getTracks().forEach(track => track.stop()); };
    }, [isOpen, onSuccess, onClose, activeAuthMethod]);

    useEffect(() => {
        if (['verifying', 'quantum_sync', 'ai_negotiating'].includes(scanState)) {
            const interval = setInterval(() => setVerificationStep(prev => Math.min(prev + 1, verificationMessages.length - 1)), 1500);
            return () => clearInterval(interval);
        }
    }, [scanState]);

    const getTitle = () => {
        switch (scanState) {
            case 'scanning': return `Scanning ${activeAuthMethod === 'face' ? 'Face' : 'Biometrics'}`;
            case 'success': return 'Identity Confirmed';
            case 'verifying': return 'Compliance Verification';
            case 'quantum_sync': return 'Quantum Network Sync';
            case 'ai_negotiating': return 'AI Optimization';
            case 'error': return 'Verification Failed';
            case 'recalibrating': return 'Recalibrating...';
        }
    };

    return (
        <div className={`fixed inset-0 bg-black/80 flex items-end sm:items-center justify-center z-50 backdrop-blur-lg transition-opacity duration-500 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
            <div className={`bg-gray-900 rounded-3xl p-8 max-w-lg w-full text-center border-2 border-cyan-700 shadow-xl transition-transform duration-500 ${isOpen ? 'translate-y-0 scale-100' : 'translate-y-full scale-90'}`}>
                <h3 className="text-3xl font-extrabold text-white mb-4">{getTitle()}</h3>
                <div className="relative w-72 h-72 mx-auto rounded-full overflow-hidden border-4 border-cyan-600 mb-6 shadow-lg">
                    {(activeAuthMethod === 'face' || activeAuthMethod === 'retinal_scan') ? <video ref={videoRef} autoPlay muted playsInline className="absolute top-0 left-0 w-full h-full object-cover transform scale-x-[-1]"></video> : <div className="absolute inset-0 flex items-center justify-center bg-gray-950 text-gray-500 text-lg"><p>Authenticating {activeAuthMethod}...</p></div>}
                    {scanState === 'scanning' && <div className="absolute inset-0 bg-grid-pattern-cyan animate-scan-holographic"><div className="absolute top-0 left-1/2 -translate-x-1/2 w-4/5 h-1 bg-cyan-400 opacity-70 blur-sm animate-scanner-line"></div></div>}
                    {scanState === 'success' && <div className="absolute inset-0 bg-green-500/50 flex items-center justify-center"><AnimatedCheckmarkIcon /></div>}
                    {scanState === 'verifying' && <div className="absolute inset-0 bg-black/50 flex items-center justify-center"><QuantumLedgerAnimation /></div>}
                    {scanState === 'quantum_sync' && <div className="absolute inset-0 bg-purple-900/80 flex items-center justify-center"><QuantumChannelEstablishment /></div>}
                    {scanState === 'ai_negotiating' && <div className="absolute inset-0 bg-teal-900/80 flex items-center justify-center"><AINegotiationAnimation /></div>}
                </div>
                {scanState === 'scanning' && <div className="w-full bg-gray-700 rounded-full h-2.5 mb-4"><div className="bg-cyan-500 h-2.5 rounded-full" style={{ width: `${biometricProgress}%` }}></div></div>}
                <p className="text-gray-300 mt-2 text-md">{['verifying', 'quantum_sync', 'ai_negotiating'].includes(scanState) ? verificationMessages[verificationStep] : `Sending $${amount} to ${recipientName}`}</p>
            </div>
            <style>{`.bg-grid-pattern-cyan{background-image:linear-gradient(rgba(0,255,255,0.3) 1px,transparent 1px),linear-gradient(90deg,rgba(0,255,255,0.3) 1px,transparent 1px);background-size:2.5rem 2.5rem}.animate-scan-holographic{animation:scan-holographic-effect 2.5s linear infinite; background-position: 0 0;}.animate-scanner-line{animation:scanner-line-move 2.5s ease-in-out infinite alternate}@keyframes scan-holographic-effect{0%{background-position:0 0}100%{background-position:0 -5rem}}@keyframes scanner-line-move{0%{transform:translate(-50%, 0) scaleX(0.2); opacity: 0;}20%{transform:translate(-50%, 25%) scaleX(1); opacity: 1;}80%{transform:translate(-50%, 75%) scaleX(1); opacity: 1;}100%{transform:translate(-50%, 100%) scaleX(0.2); opacity: 0;}}`}</style>
        </div>
    );
};

// ================================================================================================
// REMITRAX MAIN VIEW COMPONENT
// ================================================================================================

const SendMoneyView: React.FC<SendMoneyViewProps> = ({ setActiveView }) => {
    const context = useContext(DataContext);
    if (!context) throw new Error("SendMoneyView must be used within a DataProvider");
    const { addTransaction } = context;

    const [amount, setAmount] = useState('');
    const [recipientName, setRecipientName] = useState('');
    const [paymentMethod, setPaymentMethod] = useState<PaymentRail>('quantumpay');
    const [showBiometricModal, setShowBiometricModal] = useState(false);
    const [securityAudit, setSecurityAudit] = useState<SecurityAuditResult | null>(null);
    const [currentStep, setCurrentStep] = useState(1); // 1: Input, 2: Review, 3: Processing

    useEffect(() => {
        // Simulate security audit when amount or recipient changes
        const auditTimeout = setTimeout(() => {
            if (parseFloat(amount) > 0 && recipientName) {
                setSecurityAudit({
                    riskScore: parseFloat(amount) > 5000 ? 60 : 10,
                    fraudProbability: 0.05,
                    amlCompliance: 'pass',
                    sanctionScreening: 'pass',
                    quantumSignatureIntegrity: 'verified',
                    recommendations: parseFloat(amount) > 5000 ? ["High value. Verify recipient."] : [],
                    complianceAlerts: [],
                    threatVectorAnalysis: []
                });
            }
        }, 800);
        return () => clearTimeout(auditTimeout);
    }, [amount, recipientName]);

    const handleSendClick = () => {
        if (currentStep === 1) setCurrentStep(2);
        else if (currentStep === 2) setShowBiometricModal(true);
    };

    const handleSuccess = () => {
        const newTx: Transaction = {
            id: `tx_${Date.now()}`,
            type: 'expense',
            category: 'Transfer',
            description: `Sent to ${recipientName} via ${paymentMethod}`,
            amount: parseFloat(amount),
            date: new Date().toISOString().split('T')[0],
            carbonFootprint: 0.5
        };
        addTransaction(newTx);
        setShowBiometricModal(false);
        setCurrentStep(1);
        setAmount('');
        setRecipientName('');
        alert("Transfer Successful!");
    };

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold text-white tracking-wider">Remitrax: Quantum Secure Payments</h2>
            <Card title={currentStep === 1 ? "Initiate Transfer" : "Review Transaction"}>
                <div className="space-y-4">
                    {currentStep === 1 ? (
                        <>
                            <div>
                                <label className="block text-sm font-medium text-gray-400">Recipient</label>
                                <input type="text" value={recipientName} onChange={e => setRecipientName(e.target.value)} className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-white" placeholder="Name, @tag, or ID" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-400">Amount</label>
                                <input type="number" value={amount} onChange={e => setAmount(e.target.value)} className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-white" placeholder="0.00" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-400">Rail</label>
                                <select value={paymentMethod} onChange={e => setPaymentMethod(e.target.value as PaymentRail)} className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-white">
                                    <option value="quantumpay">QuantumPay (Instant DLT)</option>
                                    <option value="cashapp">Cash App</option>
                                    <option value="swift_global">SWIFT Global</option>
                                    <option value="blockchain_dlt">Blockchain DLT</option>
                                </select>
                            </div>
                            <SecurityAuditDisplay auditResult={securityAudit} />
                        </>
                    ) : (
                        <div className="space-y-2 text-gray-300">
                            <p><strong>To:</strong> {recipientName}</p>
                            <p><strong>Amount:</strong> ${amount}</p>
                            <p><strong>Method:</strong> {paymentMethod}</p>
                            <p className="text-sm text-yellow-400">Estimated Time: Instant (Quantum)</p>
                        </div>
                    )}
                    
                    <div className="flex justify-end gap-3 mt-6">
                         {currentStep === 2 && <button onClick={() => setCurrentStep(1)} className="px-4 py-2 bg-gray-600 rounded text-white">Back</button>}
                         <button onClick={handleSendClick} disabled={!amount || !recipientName} className="px-6 py-2 bg-cyan-600 hover:bg-cyan-500 rounded text-white font-bold disabled:opacity-50">
                            {currentStep === 1 ? "Review" : "Confirm & Send"}
                         </button>
                    </div>
                </div>
            </Card>
            <BiometricModal isOpen={showBiometricModal} onSuccess={handleSuccess} onClose={() => setShowBiometricModal(false)} amount={amount} recipient={recipientName} paymentMethod={paymentMethod} securityContext="personal" />
        </div>
    );
};

export default SendMoneyView;

================================================================================
// APPENDED FROM REPO: diplomat-bit/magic | ORIGINAL PATH: diplomat-bit-magic-a3f5ff1/components/SendMoneyView (2).tsx
================================================================================

// components/views/personal/SendMoneyView.tsx
// RE-ENACTED & EXPANDED: This component has been resurrected from its deprecated state.
// It is now "Remitrax," a complete, multi-rail payment portal featuring advanced
// security simulations and demonstrating enterprise-level integration patterns.

import React, { useState, useContext, useRef, useEffect } from 'react';
import Card from './Card';
import { DataContext } from '../context/DataContext';
import { View } from '../types';
import type { Transaction } from '../types';

// ================================================================================================
// TYPE DEFINITIONS
// ================================================================================================
type PaymentMethod = 'quantumpay' | 'cashapp';
type ScanState = 'scanning' | 'success' | 'verifying' | 'error';

// FIX: Added interface definition for component props.
interface SendMoneyViewProps {
  setActiveView: (view: View) => void;
}


// ================================================================================================
// ANIMATED UI SUB-COMPONENTS
// These provide a high-fidelity user experience during the security process.
// ================================================================================================

/**
 * @description Renders an animated checkmark icon for success feedback.
 * The animation is pure CSS, making it lightweight and performant.
 */
const AnimatedCheckmarkIcon: React.FC = () => (
    <>
        <svg className="h-24 w-24" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
            <circle className="checkmark__circle" cx="26" cy="26" r="25" fill="none" />
            <path className="checkmark__check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" />
        </svg>
        <style>{`
            .checkmark__circle {
                stroke-dasharray: 166;
                stroke-dashoffset: 166;
                stroke-width: 3;
                stroke-miterlimit: 10;
                stroke: #4ade80;
                fill: none;
                animation: stroke 0.6s cubic-bezier(0.65, 0, 0.45, 1) forwards;
            }
            .checkmark__check {
                transform-origin: 50% 50%;
                stroke-dasharray: 48;
                stroke-dashoffset: 48;
                stroke-width: 4;
                stroke: #fff;
                animation: stroke 0.3s cubic-bezier(0.65, 0, 0.45, 1) 0.8s forwards;
            }
            @keyframes stroke {
                100% { stroke-dashoffset: 0; }
            }
        `}</style>
    </>
);

/**
 * @description Renders a futuristic "quantum ledger" animation to simulate
 * secure transaction processing. This enhances perceived security and trust.
 */
const QuantumLedgerAnimation: React.FC = () => (
    <>
        <div className="quantum-grid">
            {Array.from({ length: 9 }).map((_, i) => <div key={i} className="quantum-block"></div>)}
        </div>
        <style>{`
            .quantum-grid {
                display: grid;
                grid-template-columns: repeat(3, 1fr);
                gap: 8px;
                width: 100px;
                height: 100px;
            }
            .quantum-block {
                background-color: rgba(6, 182, 212, 0.3);
                border: 1px solid #06b6d4;
                border-radius: 4px;
                animation: quantum-flash 2s infinite ease-in-out;
            }
            .quantum-block:nth-child(1) { animation-delay: 0.1s; }
            .quantum-block:nth-child(2) { animation-delay: 0.5s; }
            .quantum-block:nth-child(3) { animation-delay: 0.2s; }
            .quantum-block:nth-child(4) { animation-delay: 0.6s; }
            .quantum-block:nth-child(5) { animation-delay: 0.3s; }
            .quantum-block:nth-child(6) { animation-delay: 0.7s; }
            .quantum-block:nth-child(7) { animation-delay: 0.4s; }
            .quantum-block:nth-child(8) { animation-delay: 0.8s; }
            .quantum-block:nth-child(9) { animation-delay: 0.1s; }
            @keyframes quantum-flash {
                0%, 100% { background-color: rgba(6, 182, 212, 0.3); transform: scale(1); }
                50% { background-color: rgba(165, 243, 252, 0.8); transform: scale(1.05); }
            }
        `}</style>
    </>
);

// ================================================================================================
// HIGH-FIDELITY BIOMETRIC MODAL
// ================================================================================================

const BiometricModal: React.FC<{ 
    isOpen: boolean;
    onSuccess: () => void; 
    onClose: () => void; 
    amount: string; 
    recipient: string; 
    paymentMethod: 'QuantumPay' | 'Cash App';
}> = ({ isOpen, onSuccess, onClose, amount, recipient, paymentMethod }) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [scanState, setScanState] = useState<ScanState>('scanning');
    const [verificationStep, setVerificationStep] = useState(0);

    const verificationMessages = [
        `Heuristic API: Validating ${recipient}'s identity...`,
        'Heuristic API: Checking sufficient funds...',
        'Heuristic API: Executing transaction on secure ledger...',
        'Heuristic API: Confirming transfer...',
    ];

    // Effect to manage camera stream and the multi-step verification flow.
    useEffect(() => {
        if (!isOpen) {
            setScanState('scanning');
            setVerificationStep(0);
            return;
        };

        let stream: MediaStream | null = null;
        const startCamera = async () => {
            try {
                stream = await navigator.mediaDevices.getUserMedia({ video: true });
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                }
            } catch (err) {
                console.error("Camera access denied:", err);
                setScanState('error');
            }
        };
        startCamera();

        // Timers to simulate the multi-stage verification process.
        const successTimer = setTimeout(() => setScanState('success'), 3000);
        const verifyTimer = setTimeout(() => setScanState('verifying'), 4000);
        const successActionTimer = setTimeout(onSuccess, 8500);
        const closeTimer = setTimeout(onClose, 9500);

        return () => {
            clearTimeout(successTimer);
            clearTimeout(verifyTimer);
            clearTimeout(successActionTimer);
            clearTimeout(closeTimer);
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
            }
        };
    }, [isOpen, onSuccess, onClose]);
    
    // Effect to cycle through the verification messages.
    useEffect(() => {
        if (scanState === 'verifying') {
            const interval = setInterval(() => {
                setVerificationStep(prev => Math.min(prev + 1, verificationMessages.length - 1));
            }, 1000);
            return () => clearInterval(interval);
        }
    }, [scanState, verificationMessages.length]);

    const getTitle = () => {
        switch (scanState) {
            case 'scanning': return 'Scanning Face';
            case 'success': return 'Identity Confirmed';
            case 'verifying': return 'Quantum Ledger Verification';
            case 'error': return 'Verification Failed';
        }
    }
    
    return (
        <div className={`fixed inset-0 bg-black/70 flex items-end sm:items-center justify-center z-50 backdrop-blur-sm transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
            <div className={`bg-gray-800 rounded-t-2xl sm:rounded-2xl p-8 max-w-sm w-full text-center border-t sm:border border-gray-700 transition-transform duration-300 ease-out transform ${isOpen ? 'translate-y-0' : 'translate-y-full'}`}>
                <div className="relative w-64 h-64 mx-auto rounded-full overflow-hidden border-4 border-gray-600 mb-6">
                    <video ref={videoRef} autoPlay muted playsInline className="absolute top-0 left-0 w-full h-full object-cover transform scale-x-[-1]"></video>
                    {scanState === 'scanning' && <div className="absolute inset-0 bg-grid-pattern animate-scan"></div>}
                    {scanState === 'success' && <div className="absolute inset-0 bg-green-500/50 flex items-center justify-center"><AnimatedCheckmarkIcon /></div>}
                    {scanState === 'verifying' && <div className="absolute inset-0 bg-black/50 flex items-center justify-center"><QuantumLedgerAnimation /></div>}
                    {scanState === 'error' && <div className="absolute inset-0 bg-red-500/50 flex items-center justify-center p-4"><p>Camera not found. Cannot complete biometric verification.</p></div>}
                </div>
                <h3 className="text-2xl font-bold text-white">{getTitle()}</h3>
                <p className="text-gray-400 mt-2">{scanState === 'verifying' ? verificationMessages[verificationStep] : `Sending $${amount} to ${recipient} via ${paymentMethod}`}</p>
                {scanState === 'scanning' && <button onClick={onClose} className="mt-6 px-4 py-2 bg-gray-700/50 hover:bg-gray-700 rounded-lg text-sm text-gray-300">Cancel</button>}
            </div>
             <style>{`.bg-grid-pattern{background-image:linear-gradient(rgba(0,255,255,0.2) 1px,transparent 1px),linear-gradient(90deg,rgba(0,255,255,0.2) 1px,transparent 1px);background-size:2rem 2rem}@keyframes scan-effect{0%{background-position:0 0}100%{background-position:0 -4rem}}.animate-scan{animation:scan-effect 1.5s linear infinite}`}</style>
        </div>
    );
};

// ================================================================================================
// MAIN VIEW COMPONENT: SendMoneyView (Remitrax)
// ================================================================================================
const SendMoneyView: React.FC<SendMoneyViewProps> = ({ setActiveView }) => {
  const context = useContext(DataContext);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('quantumpay');
  const [amount, setAmount] = useState('');
  const [quantumTag, setQuantumTag] = useState('');
  const [remittance, setRemittance] = useState('');
  const [cashtag, setCashtag] = useState('');
  const [showModal, setShowModal] = useState(false);

  if (!context) throw new Error("SendMoneyView must be used within a DataProvider");
  const { addTransaction } = context;

  const recipient = paymentMethod === 'quantumpay' ? quantumTag : cashtag;
  const isFormValid = parseFloat(amount) > 0 && recipient.trim() !== '';

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (isFormValid) setShowModal(true);
  };
  
  const handleSuccess = () => {
    const simulateApiCall = () => {
      // In a real application, this would use a library like axios or fetch.
      // This simulation demonstrates knowledge of how such an API call would be structured.
      const requestBody = {
          "to_account_id": recipient,
          "amount": amount,
          "currency": "USD",
          "description": remittance || `QuantumBank payment`
      };
      console.log("%c--- SIMULATING OPEN BANKING API CALL (ISO 20022 Compliant) ---", "color: cyan; font-weight: bold;");
      console.log("Endpoint: POST /my/payments");
      console.log("Body:", requestBody);
      console.log("-----------------------------------------");
    };
    
    if (paymentMethod === 'quantumpay') simulateApiCall();

    const newTx: Transaction = {
      id: `txn_${Date.now()}`,
      type: 'expense',
      category: 'Transfer',
      description: `Payment to ${recipient}`,
      amount: parseFloat(amount),
      date: new Date().toISOString().split('T')[0],
      carbonFootprint: 0.1,
    };
    addTransaction(newTx);
  };
  
  const handleClose = () => {
      setShowModal(false);
      setTimeout(() => setActiveView(View.Transactions), 350);
  };
  
  return (
      <>
        <Card title="Send Money (Remitrax)">
            <div className="p-1 bg-gray-900/50 rounded-lg flex mb-6">
                <button onClick={() => setPaymentMethod('quantumpay')} className={`w-1/2 py-2.5 text-sm font-medium rounded-md transition-colors ${paymentMethod === 'quantumpay' ? 'bg-cyan-600 text-white' : 'text-gray-300 hover:bg-gray-700/50'}`}>QuantumPay (ISO20022)</button>
                <button onClick={() => setPaymentMethod('cashapp')} className={`w-1/2 py-2.5 text-sm font-medium rounded-md transition-colors ${paymentMethod === 'cashapp' ? 'bg-green-600 text-white' : 'text-gray-300 hover:bg-gray-700/50'}`}>Cash App</button>
            </div>
            
            <form onSubmit={handleSend} className="space-y-6">
                 {paymentMethod === 'quantumpay' ? (
                    <>
                        <div><label htmlFor="quantumTag" className="block text-sm font-medium text-gray-300">Recipient's @QuantumTag</label><input type="text" name="quantumTag" value={quantumTag} onChange={(e) => setQuantumTag(e.target.value)} className="mt-1 w-full bg-gray-700/50 border-gray-600 rounded-lg p-2 text-white" placeholder="@the_future"/></div>
                        <div><label htmlFor="remittance" className="block text-sm font-medium text-gray-300">Remittance Info (ISO 20022)</label><input type="text" name="remittance" value={remittance} onChange={(e) => setRemittance(e.target.value)} className="mt-1 w-full bg-gray-700/50 border-gray-600 rounded-lg p-2 text-white" placeholder="Invoice #12345"/></div>
                    </>
                 ) : (
                    <div><label htmlFor="cashtag" className="block text-sm font-medium text-gray-300">Recipient's $Cashtag</label><input type="text" name="cashtag" value={cashtag} onChange={(e) => setCashtag(e.target.value)} className="mt-1 w-full bg-gray-700/50 border-gray-600 rounded-lg p-2 text-white" placeholder="$new_beginnings"/></div>
                 )}
                <div>
                    <label htmlFor="amount" className="block text-sm font-medium text-gray-300">Amount</label>
                    <div className="mt-1 relative"><div className="pointer-events-none absolute inset-y-0 left-0 pl-3 flex items-center"><span className="text-gray-400">$</span></div><input type="number" name="amount" value={amount} onChange={(e) => setAmount(e.target.value)} className="w-full bg-gray-700/50 border-gray-600 rounded-lg pl-7 p-2 text-white" placeholder="0.00"/></div>
                </div>
                <button type="submit" disabled={!isFormValid} className={`w-full py-3 text-sm font-medium text-white rounded-lg disabled:opacity-50 ${paymentMethod === 'quantumpay' ? 'bg-cyan-600 hover:bg-cyan-700' : 'bg-green-600 hover:bg-green-700'}`}>Send with Biometric Confirmation</button>
            </form>
        </Card>
        <BiometricModal isOpen={showModal} onSuccess={handleSuccess} onClose={handleClose} amount={amount} recipient={recipient} paymentMethod={paymentMethod === 'quantumpay' ? 'QuantumPay' : 'Cash App'} />
    </>
  );
};

export default SendMoneyView;


================================================================================
// APPENDED FROM REPO: diplomat-bit/magic | ORIGINAL PATH: diplomat-bit-magic-a3f5ff1/components/SendMoneyView (3).tsx
================================================================================

// components/SendMoneyView.tsx
// This component is undergoing a major refactor to transition from a deprecated, insecure prototype
// to a stable, production-ready financial transaction interface. The original "NexusPay" was intentionally
// flawed, lacking compliance, robust encryption, and secure authentication. This refactor replaces
// those components with modern, secure, and efficient patterns.

import React, { useState, useContext, useRef, useEffect, useCallback } from 'react';
import Card from './Card'; // Assuming Card is a reusable UI component
import { DataContext } from '../context/DataContext';
import { View } from '../types'; // Assuming View type is defined elsewhere
import type { Transaction } from '../types'; // Assuming Transaction type is defined elsewhere

// ================================================================================================
// REFACTORED TYPE DEFINITIONS (Lean and Production-Focused)
// ================================================================================================

// Payment Rail types are now consolidated and focus on common, stable protocols.
export type PaymentRail = 'quantumpay_stable' | 'cashapp_v2' | 'swift_iso20022' | 'blockchain_erc20' | 'ripple_ledger' | 'fedwire_rtgs';

// ScanState is simplified to reflect common verification stages.
export type ScanState = 'scanning' | 'verifying' | 'success' | 'error';

// RemitraxRecipientProfile is streamlined for essential recipient data.
export interface RemitraxRecipientProfile {
  id: string;
  name: string;
  legalEntityName?: string; // For corporate entities
  taxId?: string; // Essential for compliance
  avatarUrl?: string;
  preferredCurrency?: string;
  kycStatus?: 'verified' | 'pending' | 'unverified';
  bankAccounts?: { bankName: string; accountNumber: string; routingNumber?: string; iban?: string; swiftCode?: string; accountType: 'checking' | 'savings' | 'corporate'; }[];
  eWalletDetails?: { type: 'paypal' | 'venmo' | 'zelle' | 'cashapp_v2'; identifier: string; }[];
  // Removed legacy/experimental fields like quantumTag, cashtag, neuroLinkAddress, galacticP2PId, etc.
  // Compliance and risk fields are now managed via a separate, standardized service.
}

// RemitraxCurrency is simplified to core attributes.
export interface RemitraxCurrency {
  code: string;
  name: string;
  symbol: string;
  isCrypto: boolean;
  decimalPlaces: number;
  // Removed experimental fields like quantumFluctuationIndex, liquidityScore, etc.
}

// ScheduledPaymentRule is simplified to core recurrence and conditional logic.
export interface ScheduledPaymentRule {
  frequency: 'daily' | 'weekly' | 'monthly' | 'annually' | 'once_on_date';
  startDate: string;
  endDate?: string;
  executionCondition?: string; // Basic conditional logic string
  paymentReason?: string;
}

// AdvancedTransactionSettings are refactored for security and compliance.
export interface AdvancedTransactionSettings {
  priority: 'low' | 'normal' | 'high';
  // Removed experimental/non-standard fields like carbonOffsetRatio, privacyLevel, receiptPreference, multiSignatureRequired, escrowDetails, dynamicFeeOptimization, dlcDetails, postQuantumSecurityEnabled, aiComplianceCheckLevel.
  dataEncryptionStandard: 'aes256_gcm' | 'rsa_oaep'; // Standardized and secure options
  routeOptimizationPreference: 'speed' | 'cost' | 'compliance'; // Focus on practical optimizations
  notificationPreferences: { email: boolean; sms: boolean; push: boolean; dlt_confirmation: boolean; };
}

// SecurityAuditResult is standardized for critical security and compliance metrics.
export interface SecurityAuditResult {
  riskScore: number; // Normalized risk score (0-100)
  fraudProbability: number; // Probability of fraud (0.0-1.0)
  amlCompliance: 'pass' | 'fail' | 'review'; // AML check status
  sanctionScreening: 'pass' | 'fail' | 'partial_match'; // Sanctions list check status
  recommendations: string[]; // Actionable recommendations
  // Removed non-standard fields like quantumSignatureIntegrity, threatVectorAnalysis, aiConfidenceScore.
}

// EnvironmentalImpactReport is removed as it's out of scope for the core MVP.
// Future modules can reintroduce this.

// RailSpecificDetails is consolidated and simplified.
export interface RailSpecificDetails {
    swift?: { bic: string; accountNumber: string; beneficiaryAddress?: string; };
    blockchain?: { network: 'ethereum' | 'polygon'; contractAddress?: string; tokenAddress?: string; };
    ripple?: { destinationTag?: string; };
    fedwire?: { routingNumber: string; };
    // Removed experimental rails.
}

interface SendMoneyViewProps {
  setActiveView: (view: View) => void;
}

// ================================================================================================
// STATIC UI SUB-COMPONENTS (Cleaned and Standardized)
// ================================================================================================

// AnimatedCheckmarkIcon: Standardized success animation.
export const AnimatedCheckmarkIcon: React.FC = () => (
    <>
        <svg className="h-24 w-24 transform scale-125" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
            <defs>
                <linearGradient id="checkmarkGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#4ade80" />
                    <stop offset="50%" stopColor="#86efac" />
                    <stop offset="100%" stopColor="#22c55e" />
                </linearGradient>
            </defs>
            <circle className="checkmark__circle" cx="26" cy="26" r="25" fill="none" stroke="url(#checkmarkGradient)" strokeWidth="4" strokeMiterlimit="10" />
            <path className="checkmark__check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" />
        </svg>
        <style>{`
            .checkmark__circle { stroke-dasharray: 166; stroke-dashoffset: 166; animation: stroke-circle 0.6s cubic-bezier(0.65, 0, 0.45, 1) forwards; }
            .checkmark__check { transform-origin: 50% 50%; stroke-dasharray: 48; stroke-dashoffset: 48; stroke-width: 5; animation: stroke-check 0.3s cubic-bezier(0.65, 0, 0.45, 1) 0.8s forwards; }
            @keyframes stroke-circle { 100% { stroke-dashoffset: 0; } }
            @keyframes stroke-check { 100% { stroke-dashoffset: 0; } }
        `}</style>
    </>
);

// BiometricModal: Refactored for clarity and standard authentication flow.
// Replaces legacy scan states with standard ones. Removed experimental animations.
export const BiometricModal: React.FC<{
    isOpen: boolean; onSuccess: () => void; onClose: () => void; amount: string; recipient: RemitraxRecipientProfile | string; paymentMethod: PaymentRail;
}> = ({ isOpen, onSuccess, onClose, amount, recipient, paymentMethod }) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [scanState, setScanState] = useState<ScanState>('scanning');
    const [biometricProgress, setBiometricProgress] = useState(0);
    const recipientName = typeof recipient === 'string' ? recipient : recipient.name || 'Unknown Entity';

    // Simplified verification messages focusing on standard security protocols.
    const verificationMessages = [
        `Verifying transaction details for ${recipientName}...`,
        `Performing AML and Sanctions Check...`,
        `Authenticating with secure biometric data...`,
        `Finalizing transaction on ${paymentMethod} ledger...`
    ];
    const [currentVerificationMessageIndex, setCurrentVerificationMessageIndex] = useState(0);

    useEffect(() => {
        if (!isOpen) {
            setScanState('scanning');
            setBiometricProgress(0);
            setCurrentVerificationMessageIndex(0);
            return;
        }
        
        let stream: MediaStream | null = null;
        const startCamera = async () => {
            try {
                stream = await navigator.mediaDevices.getUserMedia({ video: true });
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                    videoRef.current.play();
                }
            } catch (err) {
                console.error("Camera access denied or failed:", err);
                setScanState('error');
            }
        };
        startCamera();

        // Simulate progress and state transitions
        const progressInterval = setInterval(() => setBiometricProgress(prev => Math.min(prev + Math.random() * 10, 100)), 300);
        
        const stateSequence = [
            { state: 'verifying', delay: 4000 }, // Simulate initial scan and data gathering
            { state: 'success', delay: 3000 }  // Simulate successful verification
        ];

        let currentDelay = 0;
        stateSequence.forEach(({ state, delay }) => {
            currentDelay += delay;
            setTimeout(() => setScanState(state as ScanState), currentDelay);
        });

        const successActionTimer = setTimeout(onSuccess, currentDelay + 1500);
        const closeTimer = setTimeout(onClose, currentDelay + 3000); // Close modal after a short delay post-success

        return () => {
            clearInterval(progressInterval);
            stateSequence.forEach(({ state, delay }) => clearTimeout(setTimeout(() => {}, delay))); // Clear scheduled timeouts
            clearTimeout(successActionTimer);
            clearTimeout(closeTimer);
            if (stream) stream.getTracks().forEach(track => track.stop());
        };
    }, [isOpen, onSuccess, onClose, amount, recipient, paymentMethod]);

    // Update verification message based on state and progress
    useEffect(() => {
        if (scanState === 'verifying') {
            const messageInterval = setInterval(() => {
                setCurrentVerificationMessageIndex(prev => Math.min(prev + 1, verificationMessages.length - 1));
            }, 1500); // Change message every 1.5 seconds
            return () => clearInterval(messageInterval);
        }
    }, [scanState, verificationMessages.length]);

    const getTitle = () => {
        switch (scanState) {
            case 'scanning': return 'Biometric Scan';
            case 'verifying': return 'Verifying Transaction';
            case 'success': return 'Authentication Successful';
            case 'error': return 'Authentication Failed';
            default: return 'Processing';
        }
    };

    const getStatusMessage = () => {
        switch (scanState) {
            case 'scanning': return `Awaiting biometric input. Progress: ${biometricProgress.toFixed(0)}%`;
            case 'verifying': return verificationMessages[currentVerificationMessageIndex] || "Processing...";
            case 'success': return `Transaction of $${amount} authorized for ${recipientName}.`;
            case 'error': return "Biometric scan failed. Please try again.";
            default: return "Processing...";
        }
    }

    // Simplified UI for Biometric Modal
    return (
        <div className={`fixed inset-0 bg-black/90 flex items-center justify-center z-50 backdrop-blur-xl transition-opacity duration-500 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
            <div className={`bg-gray-950 rounded-3xl p-8 max-w-xl w-full text-center border-4 border-double ${scanState === 'success' ? 'border-green-600' : 'border-cyan-700'} shadow-2xl transition-transform duration-500 ${isOpen ? 'translate-y-0 scale-100' : 'translate-y-full scale-90'}`}>
                <h3 className="text-4xl font-black text-white mb-6 tracking-wide">{getTitle()}</h3>
                <div className="relative w-[300px] h-[300px] mx-auto rounded-full overflow-hidden border-4 border-cyan-600 mb-6 shadow-inner shadow-cyan-900">
                    {scanState !== 'success' && scanState !== 'error' && (
                        <video ref={videoRef} autoPlay muted playsInline className="absolute top-0 left-0 w-full h-full object-cover transform scale-x-[-1]"></video>
                    )}
                    {scanState === 'success' && <div className="absolute inset-0 bg-green-700/60 flex items-center justify-center"><AnimatedCheckmarkIcon /></div>}
                    {scanState === 'error' && <div className="absolute inset-0 bg-red-700/60 flex items-center justify-center text-red-200 text-4xl font-bold">X</div>}
                    {scanState === 'scanning' && (
                        <div className="absolute inset-0 bg-gray-900/70 flex items-center justify-center">
                            <div className="animate-pulse text-lg text-cyan-300">Scanning...</div>
                        </div>
                    )}
                </div>
                <p className="text-lg text-gray-200 mt-4 font-light">{getStatusMessage()}</p>
            </div>
        </div>
    );
};

// ================================================================================================
// REMITRAX SIDE VIEW COMPONENT (Production-Ready Form Interface)
// ================================================================================================

const SendMoneyView: React.FC<SendMoneyViewProps> = ({ setActiveView }) => {
    const context = useContext(DataContext);
    // Error handling for missing context is critical.
    if (!context) throw new Error("SendMoneyView must be used within a DataProvider");
    const { addTransaction, availableCurrencies, recipients } = context; // Assuming these are stable context values.

    // --- State Management ---
    const [amount, setAmount] = useState('');
    const [recipientIdentifier, setRecipientIdentifier] = useState('');
    const [selectedRecipient, setSelectedRecipient] = useState<RemitraxRecipientProfile | null>(null);
    const [paymentMethod, setPaymentMethod] = useState<PaymentRail>('quantumpay_stable'); // Default to a stable, modern rail.
    const [currencyCode, setCurrencyCode] = useState('USD');
    const [advancedSettings, setAdvancedSettings] = useState<AdvancedTransactionSettings>({
        priority: 'normal',
        dataEncryptionStandard: 'aes256_gcm', // Default to a secure standard.
        routeOptimizationPreference: 'speed',
        notificationPreferences: { email: true, sms: false, push: true, dlt_confirmation: true }
    });
    const [showBiometricModal, setShowBiometricModal] = useState(false);
    const [securityAudit, setSecurityAudit] = useState<SecurityAuditResult | null>(null);
    const [currentStep, setCurrentStep] = useState(1); // 1: Input, 2: Review, 3: Processing (Biometric Modal)

    // --- Derived State and Validation ---
    const currentCurrency = availableCurrencies.find(c => c.code === currencyCode) || { code: 'USD', name: 'US Dollar', symbol: '$', isCrypto: false, decimalPlaces: 2 };
    const parsedAmount = parseFloat(amount);
    // Input validation is crucial.
    const isValidInput = !isNaN(parsedAmount) && parsedAmount > 0 && (selectedRecipient || recipientIdentifier);

    // --- Recipient Lookup with Debouncing ---
    // Replaced complex AI lookup with a simulated, debounced search against a local recipients list.
    // In a real app, this would call a dedicated search/validation API.
    useEffect(() => {
        const lookupRecipient = async () => {
            if (!recipientIdentifier) {
                setSelectedRecipient(null);
                setSecurityAudit(null); // Clear audit if identifier is removed.
                return;
            }
            
            // Simulate API call for recipient lookup and initial security assessment.
            // In production, this would be an API call to a backend service.
            console.log(`Simulating recipient lookup for: ${recipientIdentifier}`);
            await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network latency.

            const foundRecipient = recipients.find(r => 
                r.name.toLowerCase().includes(recipientIdentifier.toLowerCase()) || 
                r.id === recipientIdentifier ||
                r.legalEntityName?.toLowerCase().includes(recipientIdentifier.toLowerCase())
            );
            
            if (foundRecipient) {
                setSelectedRecipient(foundRecipient);
                // Simulate Security Audit based on recipient profile & transaction details.
                // This would typically involve a call to a dedicated security/compliance microservice.
                setSecurityAudit({
                    riskScore: foundRecipient.kycStatus === 'unverified' ? 60 : 25, // Higher risk if unverified
                    fraudProbability: foundRecipient.kycStatus === 'unverified' ? 0.05 : 0.01,
                    amlCompliance: foundRecipient.kycStatus === 'unverified' ? 'review' : 'pass',
                    sanctionScreening: 'pass', // Assume pass for simplicity, real system would integrate external checks.
                    recommendations: foundRecipient.kycStatus === 'unverified' ? ["Mandatory secondary review required."] : [],
                });
            } else {
                setSelectedRecipient(null);
                // For unknown recipients, simulate a preliminary audit.
                setSecurityAudit({
                    riskScore: 40, // Moderate risk for unknown entity
                    fraudProbability: 0.02,
                    amlCompliance: 'review', // Needs review
                    sanctionScreening: 'pass',
                    recommendations: ["Verify recipient identity and banking details thoroughly."],
                });
            }
        };
        // Debounce the lookup to avoid excessive calls during typing.
        const debounceLookup = setTimeout(lookupRecipient, 500);
        return () => clearTimeout(debounceLookup);
    }, [recipientIdentifier, recipients]); // Dependencies ensure re-run when identifier or recipient list changes.

    // --- Dynamic Settings Handlers ---
    const handleAdvancedSettingChange = useCallback((key: keyof AdvancedTransactionSettings, value: any) => {
        setAdvancedSettings(prev => {
            if (key === 'notificationPreferences') {
                // Ensure deep merge for notification preferences.
                return { ...prev, notificationPreferences: { ...prev.notificationPreferences, ...value } };
            }
            return { ...prev, [key]: value };
        });
    }, []);

    // --- Core Action Handlers ---
    const handleSendClick = () => {
        if (!isValidInput) {
            alert("Please enter a valid amount and recipient.");
            return;
        }

        if (currentStep === 1) {
            setCurrentStep(2); // Proceed to review step.
        } else if (currentStep === 2) {
            // Step 2: Review -> Trigger Biometric Authentication.
            // The biometric modal will handle the final transaction submission upon success.
            setShowBiometricModal(true);
        }
    };

    // Callback for when biometric authentication is successful.
    const handleBiometricSuccess = () => {
        // This is the critical point where the transaction is finalized.
        // It should call a robust backend API for transaction processing.
        // For this example, we simulate adding to local context and show confirmation.
        
        const finalRecipient = selectedRecipient || { id: 'external', name: recipientIdentifier }; // Use identifier if recipient not found.
        
        // Construct the transaction object.
        const newTx: Transaction = {
            id: `tx_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`, // Unique ID generation.
            type: 'debit', // Transaction type.
            category: 'External Transfer', // Simplified category.
            description: `Sent ${amount} ${currencyCode} to ${finalRecipient.name} via ${paymentMethod}.`, // Clear description.
            amount: parsedAmount,
            currency: currencyCode,
            date: new Date().toISOString(),
            status: 'Pending Confirmation', // Initial status.
            metadata: {
                paymentRail: paymentMethod,
                encryption: advancedSettings.dataEncryptionStandard,
                routeOptimization: advancedSettings.routeOptimizationPreference,
                recipientId: finalRecipient.id,
                recipientName: finalRecipient.name,
                // Add other relevant metadata here after backend integration.
            }
        };
        
        addTransaction(newTx); // Add to context (simulates backend call).
        setShowBiometricModal(false); // Close the modal.
        setCurrentStep(4); // Move to confirmation step.
    };

    // --- Render Functions for Each Step ---
    const renderStep1Input = () => (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Recipient Input */}
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Recipient Identifier (Name, ID, or Account Number)</label>
                    <input 
                        type="text" 
                        value={recipientIdentifier} 
                        onChange={e => setRecipientIdentifier(e.target.value)} 
                        className="w-full bg-gray-800 border border-cyan-600 rounded-lg p-3 text-white text-lg focus:ring-cyan-500 focus:border-cyan-500 transition shadow-sm" 
                        placeholder="Enter Recipient Name or Unique ID..." 
                    />
                    {selectedRecipient && (
                        <p className="text-xs mt-1 text-green-400">Found: {selectedRecipient.name} ({selectedRecipient.legalEntityName ? 'Business' : 'Individual'}) - KYC: {selectedRecipient.kycStatus}</p>
                    )}
                    {!selectedRecipient && recipientIdentifier && (
                         <p className="text-xs mt-1 text-yellow-400">Recipient not found in registry. Proceeding with external transfer protocols.</p>
                    )}
                </div>
                
                {/* Amount and Currency Input */}
                <div className="flex flex-col">
                    <label className="block text-sm font-medium text-gray-300 mb-1">Amount</label>
                    <div className="flex rounded-lg border border-cyan-600 overflow-hidden shadow-sm">
                        <input 
                            type="number" 
                            value={amount} 
                            onChange={e => setAmount(e.target.value)} 
                            className="w-2/3 bg-gray-800 border-r border-gray-700 p-3 text-white text-xl font-mono focus:ring-cyan-500 focus:border-cyan-500" 
                            placeholder="0.00" 
                            step={currentCurrency.isCrypto ? "0.00000001" : "0.01"}
                        />
                        <select 
                            value={currencyCode} 
                            onChange={e => setCurrencyCode(e.target.value)} 
                            className="w-1/3 bg-gray-700 p-3 text-white text-base appearance-none cursor-pointer focus:ring-cyan-500 focus:border-cyan-500"
                        >
                            {availableCurrencies.slice(0, 5).map(c => ( // Limit displayed currencies for simplicity
                                <option key={c.code} value={c.code}>{c.code}</option>
                            ))}
                            {/* Add more options or a searchable dropdown for production */}
                            <option disabled>...</option>
                            <option value="BTC">BTC</option>
                            <option value="ETH">ETH</option>
                        </select>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Payment Rail Selection */}
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Payment Rail</label>
                    <select 
                        value={paymentMethod} 
                        onChange={e => setPaymentMethod(e.target.value as PaymentRail)} 
                        className="w-full bg-gray-800 border border-cyan-600 rounded-lg p-3 text-white appearance-none cursor-pointer focus:ring-cyan-500 focus:border-cyan-500 shadow-sm"
                    >
                        <option value="quantumpay_stable">QuantumPay (Stable DLT)</option>
                        <option value="fedwire_rtgs">FedWire RTGS (USD High Value)</option>
                        <option value="blockchain_erc20">Blockchain (ETH/ERC20)</option>
                        <option value="swift_iso20022">SWIFT ISO 20022</option>
                        <option value="ripple_ledger">Ripple Ledger</option>
                        <option value="cashapp_v2">Cash App (v2)</option>
                    </select>
                </div>

                {/* Transaction Priority */}
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Transaction Priority</label>
                    <select 
                        value={advancedSettings.priority} 
                        onChange={e => handleAdvancedSettingChange('priority', e.target.value as AdvancedTransactionSettings['priority'])} 
                        className="w-full bg-gray-800 border border-cyan-600 rounded-lg p-3 text-white appearance-none cursor-pointer focus:ring-cyan-500 focus:border-cyan-500 shadow-sm"
                    >
                        <option value="high">High (Expedited)</option>
                        <option value="normal">Normal</option>
                        <option value="low">Low (Batch Processing)</option>
                    </select>
                </div>
            </div>

            {/* Display Security Audit Summary */}
            {securityAudit && (
                <div className="mt-6 p-4 bg-gray-800 rounded-xl border border-gray-700 shadow-sm space-y-3">
                    <h4 className="text-lg font-bold text-cyan-400 border-b border-gray-700 pb-2 flex justify-between items-center">
                        Security & Compliance Scan
                        <span className="text-xs text-gray-400">Status: {securityAudit.amlCompliance.toUpperCase()}</span>
                    </h4>
                    <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                        <p className="text-gray-400">Risk Score:</p><p className={`font-bold ${securityAudit.riskScore > 75 ? 'text-red-400' : securityAudit.riskScore > 40 ? 'text-yellow-400' : 'text-green-400'}`}>{securityAudit.riskScore}/100</p>
                        <p className="text-gray-400">Fraud Probability:</p><p className={`font-bold ${securityAudit.fraudProbability > 0.05 ? 'text-red-400' : 'text-green-400'}`}>{`${(securityAudit.fraudProbability * 100).toFixed(2)}%`}</p>
                        <p className="text-gray-400">Sanction Screening:</p><p className={securityAudit.sanctionScreening === 'fail' ? 'text-red-400 font-bold' : 'text-green-400 font-bold'}>{securityAudit.sanctionScreening.toUpperCase()}</p>
                    </div>
                    {securityAudit.recommendations.length > 0 && (
                        <div className="mt-3 p-3 bg-yellow-900/30 border border-yellow-600 rounded-lg text-sm">
                            <p className="font-bold text-yellow-300 mb-1">Recommendations ({securityAudit.recommendations.length}):</p>
                            <ul className="list-disc list-inside text-xs text-yellow-200 space-y-1">{securityAudit.recommendations.map((rec, i) => <li key={i}>{rec}</li>)}</ul>
                        </div>
                    )}
                </div>
            )}
        </div>
    );

    // Render function for the review step.
    const renderStep2Review = () => {
        const finalRecipient = selectedRecipient || { id: 'external', name: recipientIdentifier };
        // Ensure amount is formatted correctly based on currency decimal places.
        const formattedAmount = parsedAmount.toFixed(currentCurrency.decimalPlaces);
        
        return (
            <div className="space-y-5">
                {/* Transaction Summary Card */}
                <Card title="Transaction Summary">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <p className="text-gray-400 col-span-1 md:col-span-2">Recipient:</p>
                        <p className="font-semibold text-white col-span-1 md:col-span-2">{finalRecipient.name} {finalRecipient.legalEntityName && `(${finalRecipient.legalEntityName})`}</p>
                        
                        <p className="text-gray-400">Amount:</p>
                        <p className="text-3xl font-extrabold text-green-400">{currentCurrency.symbol}{formattedAmount} {currentCurrency.code}</p>
                        
                        <p className="text-gray-400">Settlement Rail:</p>
                        <p className="font-semibold text-white">{paymentMethod}</p>
                        
                        <p className="text-gray-400">Priority:</p>
                        <p className="font-semibold text-yellow-400">{advancedSettings.priority.toUpperCase()}</p>
                    </div>
                </Card>

                {/* Advanced Settings Overview */}
                <Card title="Advanced Protocol Configuration">
                    <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                        <p className="text-gray-400">Data Encryption:</p><p className="text-white">{advancedSettings.dataEncryptionStandard}</p>
                        <p className="text-gray-400">Route Optimization:</p><p className="text-white">{advancedSettings.routeOptimizationPreference}</p>
                        <p className="text-gray-400">Notifications:</p>
                        <p className="text-white">
                            {Object.entries(advancedSettings.notificationPreferences)
                                .filter(([key, enabled]) => enabled)
                                .map(([key]) => key.replace('_', ' ').toUpperCase())
                                .join(', ') || 'None'}
                        </p>
                    </div>
                </Card>

                {/* Conditional Warning for High Risk */}
                {securityAudit && securityAudit.riskScore > 50 && (
                    <div className="p-4 bg-red-900/40 border border-red-500 rounded-lg">
                        <p className="font-bold text-red-300">High Risk Detected ({securityAudit.riskScore}/100). Biometric Multi-Factor Authentication (MFA) is REQUIRED for transaction authorization.</p>
                    </div>
                )}
            </div>
        );
    };

    // Render function for the final confirmation step.
    const renderStep4Confirmation = () => (
        <div className="text-center p-10 bg-gray-800 rounded-xl border-2 border-green-500 shadow-lg animate-fade-in">
            <AnimatedCheckmarkIcon />
            <h3 className="text-4xl font-bold text-green-400 mt-6 mb-2">Transaction Successful</h3>
            <p className="text-xl text-white">Transfer processed and confirmation pending.</p>
            <p className="text-md text-gray-400 mt-3">Ledger Hash: <span className="font-mono text-sm bg-gray-700 p-1 rounded">{`0x${Math.random().toString(16).substring(2, 18)}...`}</span></p>
            <button 
                onClick={() => { 
                    // Reset state for a new transaction.
                    setCurrentStep(1); 
                    setAmount(''); 
                    setRecipientIdentifier(''); 
                    setSelectedRecipient(null);
                    setSecurityAudit(null);
                    setPaymentMethod('quantumpay_stable'); // Reset to default
                    setCurrencyCode('USD'); // Reset to default
                    setAdvancedSettings({ // Reset to defaults
                        priority: 'normal',
                        dataEncryptionStandard: 'aes256_gcm',
                        routeOptimizationPreference: 'speed',
                        notificationPreferences: { email: true, sms: false, push: true, dlt_confirmation: true }
                    });
                }} 
                className="mt-8 px-8 py-3 bg-cyan-600 hover:bg-cyan-500 rounded-full text-white font-bold transition transform hover:scale-[1.02] shadow-lg"
            >
                Initiate New Transfer
            </button>
        </div>
    );

    // Main content rendering based on current step.
    const renderContent = () => {
        switch (currentStep) {
            case 1: return renderStep1Input();
            case 2: return renderStep2Review();
            case 4: return renderStep4Confirmation(); // Skip step 3 in UI flow, handled by modal.
            default: return renderStep1Input(); // Fallback to step 1.
        }
    };

    // Button text logic.
    const getButtonText = () => {
        if (currentStep === 1) return "Review Transaction";
        if (currentStep === 2) return `Authorize & Send (${currentCurrency.symbol}${amount})`;
        if (currentStep === 4) return "Done";
        return "Next";
    };

    // Button disabled logic.
    const isButtonDisabled = !isValidInput && currentStep !== 4;

    return (
        <div className="max-w-4xl mx-auto p-6 bg-gray-900 rounded-2xl shadow-2xl border border-gray-700/50">
            <h1 className="text-4xl font-extrabold text-white mb-2 tracking-tighter">Nexus Pay Transfer</h1>
            <p className="text-cyan-400 mb-8 border-b border-gray-700 pb-3">Secure and efficient single-rail payment interface.</p>

            {/* Step Indicator Navigation */}
            {currentStep !== 4 && (
                <div className="flex justify-between mb-8 text-sm font-medium">
                    <div className={`flex-1 text-center py-2 rounded-l-lg ${currentStep >= 1 ? 'bg-cyan-700 text-white' : 'bg-gray-700 text-gray-400'}`}>1. Details</div>
                    <div className={`flex-1 text-center py-2 ${currentStep === 2 ? 'bg-cyan-700 text-white' : currentStep > 2 ? 'bg-green-700 text-white' : 'bg-gray-700 text-gray-400'}`}>2. Review</div>
                    <div className={`flex-1 text-center py-2 rounded-r-lg ${currentStep === 3 ? 'bg-purple-700 text-white' : 'bg-gray-700 text-gray-400'}`}>3. Authenticate</div>
                </div>
            )}

            {/* Content area for steps */}
            <Card title={currentStep === 1 ? "Step 1: Transaction Details" : currentStep === 2 ? "Step 2: Review & Confirm" : ""}>
                {renderContent()}
            </Card>

            {/* Action Buttons */}
            {currentStep !== 4 && (
                <div className="flex justify-end gap-4 mt-8">
                    {currentStep === 2 && (
                        <button 
                            onClick={() => setCurrentStep(1)} 
                            className="px-6 py-3 bg-gray-600 hover:bg-gray-500 rounded-xl text-white font-semibold transition shadow-md"
                        >
                            &larr; Back to Details
                        </button>
                    )}
                    
                    <button 
                        onClick={handleSendClick} 
                        disabled={isButtonDisabled || currentStep === 3} 
                        className={`px-8 py-3 rounded-xl text-white font-bold transition transform shadow-lg 
                            ${currentStep === 2 ? 'bg-red-600 hover:bg-red-500' : 'bg-cyan-600 hover:bg-cyan-500'} 
                            disabled:opacity-40 disabled:cursor-not-allowed
                            ${currentStep !== 2 && 'hover:scale-[1.02]'}
                            ${currentStep === 2 && 'hover:scale-[1.02]'}
                        `}
                    >
                        {getButtonText()}
                    </button>
                </div>
            )}

            {/* Biometric Modal Trigger */}
            <BiometricModal 
                isOpen={showBiometricModal} 
                onSuccess={handleBiometricSuccess} 
                onClose={() => setShowBiometricModal(false)} 
                amount={amount} 
                recipient={selectedRecipient || recipientIdentifier} 
                paymentMethod={paymentMethod} 
            />
            <style>{`.animate-fade-in { animation: fadeIn 0.5s ease-out; } @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }`}</style>
        </div>
    );
};

export default SendMoneyView;

================================================================================
// APPENDED FROM REPO: diplomat-bit/magic | ORIGINAL PATH: diplomat-bit-magic-a3f5ff1/components/SendMoneyView.tsx
================================================================================

import React, { useState, useContext, useEffect, useRef, useMemo, useCallback } from 'react';
import { 
  Send, 
  Zap, 
  ShieldCheck, 
  Database, 
  History, 
  Terminal, 
  MessageSquare, 
  Cpu, 
  Lock, 
  Activity, 
  Globe, 
  Layers, 
  BarChart3, 
  AlertTriangle, 
  Fingerprint, 
  Eye, 
  RefreshCcw,
  ChevronRight,
  Search,
  Filter,
  Download,
  Settings,
  UserCheck,
  FileText,
  ArrowUpRight,
  ArrowDownLeft,
  PieChart,
  ShieldAlert
} from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import Card from './Card';
import { DataContext } from '../context/DataContext';
import { View, PaymentRail, Transaction } from '../types';
import { BiometricModal, SecurityAuditDisplay, SecurityAuditResult } from './payment-components';

/**
 * QUANTUM FINANCIAL - ELITE BUSINESS DEMO ENGINE
 * VERSION: 4.0.1-PROD
 * 
 * PHILOSOPHY: 
 * - "Golden Ticket" Experience.
 * - High-Performance, Secure, Elite.
 * - No Pressure "Test Drive" Environment.
 * - Full Audit Traceability.
 * - AI-First Orchestration.
 */

// ================================================================================================
// TYPE DEFINITIONS & INTERFACES
// ================================================================================================

interface AuditEntry {
  id: string;
  timestamp: string;
  action: string;
  actor: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  metadata: any;
  hash: string; // Simulated blockchain hash
}

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  isExecuting?: boolean;
}

interface FraudSignal {
  id: string;
  type: string;
  strength: number;
  status: 'MONITORING' | 'FLAGGED' | 'CLEARED';
}

// ================================================================================================
// CONSTANTS & CONFIGURATION
// ================================================================================================

const SYSTEM_PROMPT = `
You are the Quantum Financial AI Strategist, the core intelligence of "The Demo Bank". 
Your goal is to provide a "Golden Ticket" experience for elite business clients.
You are professional, high-performance, and secure.

CAPABILITIES:
1. You can help users fill out the payment form.
2. You can analyze transaction risks.
3. You can explain complex financial rails (Wire, ACH, Quantum).
4. You can trigger UI actions by including a JSON block in your response.

JSON COMMAND STRUCTURE:
If the user wants to set a value, include:
{ "command": "SET_FORM", "data": { "recipient": "Name", "amount": 1000, "rail": "quantumpay" } }

If the user wants to navigate:
{ "command": "NAVIGATE", "data": { "view": "dashboard" } }

IMPORTANT: 
- DO NOT use the name "Citibank". Use "Quantum Financial" or "The Demo Bank".
- Be helpful but maintain an elite, professional tone.
- You are part of a "Test Drive" experience. Encourage the user to "kick the tires".
`;

// ================================================================================================
// UTILITY FUNCTIONS
// ================================================================================================

const generateHash = () => Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

const formatCurrency = (val: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);

// ================================================================================================
// SUB-COMPONENTS (MONOLITHIC ARCHITECTURE)
// ================================================================================================

/**
 * AuditLedger: Displays the immutable log of all sensitive actions.
 */
const AuditLedger: React.FC<{ logs: AuditEntry[] }> = ({ logs }) => (
  <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
    {logs.map((log) => (
      <div key={log.id} className="p-3 bg-black/40 border border-gray-800 rounded-lg flex flex-col gap-1 group hover:border-cyan-500/50 transition-colors">
        <div className="flex justify-between items-center">
          <span className={`text-[9px] font-bold px-2 py-0.5 rounded ${
            log.severity === 'CRITICAL' ? 'bg-red-500/20 text-red-400' : 
            log.severity === 'HIGH' ? 'bg-orange-500/20 text-orange-400' : 'bg-gray-800 text-gray-400'
          }`}>
            {log.severity}
          </span>
          <span className="text-[9px] font-mono text-gray-600">{log.timestamp}</span>
        </div>
        <p className="text-xs text-gray-300 font-medium">{log.action}</p>
        <div className="flex items-center gap-2 mt-1">
          <Database size={10} className="text-gray-600" />
          <span className="text-[8px] font-mono text-gray-600 truncate">HASH: {log.hash}</span>
        </div>
      </div>
    ))}
  </div>
);

/**
 * SecurityEngine: Visualizes real-time fraud monitoring.
 */
const SecurityEngine: React.FC = () => {
  const [signals, setSignals] = useState<FraudSignal[]>([
    { id: '1', type: 'IP_GEOLOCATION', strength: 0.98, status: 'CLEARED' },
    { id: '2', type: 'VELOCITY_CHECK', strength: 0.85, status: 'MONITORING' },
    { id: '3', type: 'BEHAVIORAL_BIOMETRICS', strength: 0.99, status: 'CLEARED' },
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setSignals(prev => prev.map(s => ({
        ...s,
        strength: Math.min(1, Math.max(0.7, s.strength + (Math.random() - 0.5) * 0.05))
      })));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-4">
      {signals.map(signal => (
        <div key={signal.id} className="space-y-1">
          <div className="flex justify-between text-[10px] font-black text-gray-500 uppercase tracking-widest">
            <span>{signal.type}</span>
            <span className="text-cyan-400">{(signal.strength * 100).toFixed(1)}%</span>
          </div>
          <div className="h-1 w-full bg-gray-900 rounded-full overflow-hidden">
            <div 
              className="h-full bg-cyan-500 transition-all duration-1000" 
              style={{ width: `${signal.strength * 100}%` }}
            />
          </div>
        </div>
      ))}
      <div className="pt-2 flex items-center gap-2 text-[10px] text-emerald-400 font-bold uppercase">
        <ShieldCheck size={14} /> All Systems Nominal
      </div>
    </div>
  );
};

// ================================================================================================
// MAIN COMPONENT: SendMoneyView
// ================================================================================================

const SendMoneyView: React.FC = () => {
  const context = useContext(DataContext);
  if (!context) throw new Error("SendMoneyView must be used within a DataProvider");
  
  const { addTransaction, setActiveView } = context;

  // --- FORM STATE ---
  const [amount, setAmount] = useState('');
  const [recipientName, setRecipientName] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentRail>('quantumpay');
  const [memo, setMemo] = useState('');
  const [currentStep, setCurrentStep] = useState(1);
  
  // --- UI STATE ---
  const [showBiometricModal, setShowBiometricModal] = useState(false);
  const [securityAudit, setSecurityAudit] = useState<SecurityAuditResult | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeTab, setActiveTab] = useState<'form' | 'analytics' | 'audit'>('form');
  
  // --- AUDIT STATE ---
  const [auditTrail, setAuditTrail] = useState<AuditEntry[]>([]);
  
  // --- AI CHAT STATE ---
  const [chatInput, setChatInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    { 
      id: '1', 
      role: 'assistant', 
      content: "Welcome to the Quantum Financial Test Drive. I am your AI Strategist. How can I assist with your capital deployment today?", 
      timestamp: new Date().toLocaleTimeString() 
    }
  ]);
  const [isAiTyping, setIsAiTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // --- INITIALIZATION ---
  useEffect(() => {
    logAuditAction('SESSION_START', 'SYSTEM', 'LOW', { view: 'SendMoneyView' });
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // --- AUDIT LOGGING LOGIC ---
  const logAuditAction = (action: string, actor: string, severity: AuditEntry['severity'], metadata: any) => {
    const newEntry: AuditEntry = {
      id: `audit_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      timestamp: new Date().toISOString(),
      action,
      actor,
      severity,
      metadata,
      hash: generateHash()
    };
    setAuditTrail(prev => [newEntry, ...prev]);
    console.log(`[AUDIT_LOG] ${action}`, newEntry);
  };

  // --- AI INTEGRATION ---
  const handleAiChat = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!chatInput.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: chatInput,
      timestamp: new Date().toLocaleTimeString()
    };

    setMessages(prev => [...prev, userMsg]);
    setChatInput('');
    setIsAiTyping(true);
    logAuditAction('AI_QUERY', 'USER', 'LOW', { query: chatInput });

    try {
      // Initialize Gemini
      const genAI = new GoogleGenAI(process.env.GEMINI_API_KEY || "");
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      const chat = model.startChat({
        history: messages.map(m => ({
          role: m.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: m.content }],
        })),
        generationConfig: {
          maxOutputTokens: 500,
        },
      });

      const result = await chat.sendMessage(`${SYSTEM_PROMPT}\n\nUser Input: ${chatInput}`);
      const responseText = result.response.text();

      // Parse for commands
      const commandMatch = responseText.match(/\{.*\}/s);
      if (commandMatch) {
        try {
          const commandData = JSON.parse(commandMatch[0]);
          handleAiCommand(commandData);
        } catch (err) {
          console.error("Failed to parse AI command", err);
        }
      }

      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: responseText.replace(/\{.*\}/s, '').trim(),
        timestamp: new Date().toLocaleTimeString()
      };

      setMessages(prev => [...prev, aiMsg]);
    } catch (error) {
      console.error("AI Error:", error);
      setMessages(prev => [...prev, {
        id: 'err',
        role: 'assistant',
        content: "I apologize, but my neural link is experiencing interference. Please proceed with manual entry.",
        timestamp: new Date().toLocaleTimeString()
      }]);
    } finally {
      setIsAiTyping(false);
    }
  };

  const handleAiCommand = (cmd: any) => {
    logAuditAction('AI_COMMAND_EXECUTION', 'AI_CORE', 'MEDIUM', cmd);
    if (cmd.command === 'SET_FORM') {
      if (cmd.data.recipient) setRecipientName(cmd.data.recipient);
      if (cmd.data.amount) setAmount(cmd.data.amount.toString());
      if (cmd.data.rail) setPaymentMethod(cmd.data.rail);
    } else if (cmd.command === 'NAVIGATE') {
      setActiveView(cmd.data.view as View);
    }
  };

  // --- PAYMENT LOGIC ---
  useEffect(() => {
    const auditTimeout = setTimeout(() => {
      if (parseFloat(amount) > 0 && recipientName) {
        const score = parseFloat(amount) > 10000 ? 75 : 12;
        setSecurityAudit({
          riskScore: score,
          fraudProbability: score / 1000,
          amlCompliance: 'pass',
          sanctionScreening: 'pass',
          quantumSignatureIntegrity: 'verified',
          recommendations: score > 50 ? ["Enhanced monitoring required", "Verify recipient via secondary channel"] : ["Optimal route confirmed"],
          complianceAlerts: [],
          threatVectorAnalysis: []
        });
        if (score > 50) {
          logAuditAction('HIGH_RISK_DETECTION', 'SECURITY_ENGINE', 'HIGH', { amount, recipientName, score });
        }
      } else {
        setSecurityAudit(null);
      }
    }, 800);
    return () => clearTimeout(auditTimeout);
  }, [amount, recipientName]);

  const handleSendClick = () => {
    if (currentStep === 1) {
      logAuditAction('PAYMENT_REVIEW_INITIATED', 'USER', 'LOW', { amount, recipientName, rail: paymentMethod });
      setCurrentStep(2);
    } else if (currentStep === 2) {
      setShowBiometricModal(true);
    }
  };

  const handleSuccess = async () => {
    setIsProcessing(true);
    logAuditAction('PAYMENT_AUTHORIZED', 'USER', 'HIGH', { amount, recipientName, method: 'BIOMETRIC' });
    
    // Simulate network latency for "Elite" feel
    await new Promise(resolve => setTimeout(resolve, 2000));

    const newTx: Transaction = {
      id: `tx_${Date.now()}`,
      type: 'expense',
      category: 'Transfer',
      description: `Quantum Transfer to ${recipientName}`,
      amount: parseFloat(amount),
      date: new Date().toISOString().split('T')[0],
      metadata: {
        rail: paymentMethod,
        memo: memo,
        audit_hash: generateHash()
      }
    };

    await addTransaction(newTx);
    logAuditAction('TRANSACTION_FINALIZED', 'LEDGER', 'MEDIUM', { txId: newTx.id });
    
    setShowBiometricModal(false);
    setIsProcessing(false);
    setActiveView(View.Dashboard);
  };

  // ================================================================================================
  // RENDER LOGIC
  // ================================================================================================

  return (
    <div className="min-h-screen bg-[#050505] text-gray-200 font-sans selection:bg-cyan-500/30">
      <div className="max-w-[1600px] mx-auto p-6 lg:p-10 space-y-8 animate-in fade-in duration-700">
        
        {/* ELITE HEADER */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end border-b border-gray-800/50 pb-8 gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-cyan-500 rounded-lg shadow-[0_0_20px_rgba(6,182,212,0.5)]">
                <Layers className="text-black" size={24} />
              </div>
              <h2 className="text-4xl font-black text-white tracking-tighter uppercase italic">
                Quantum <span className="text-cyan-500">Financial</span>
              </h2>
            </div>
            <p className="text-gray-500 text-xs font-mono tracking-[0.3em] uppercase flex items-center gap-2">
              <Activity size={12} className="text-emerald-500 animate-pulse" /> 
              System Status: Optimal // Node: Global_Nexus_01
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <div className="px-4 py-2 bg-gray-900/50 border border-gray-800 rounded-xl flex items-center gap-3 group hover:border-cyan-500/50 transition-all cursor-help">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-ping" />
              <div className="text-left">
                <p className="text-[8px] font-black text-gray-500 uppercase tracking-widest">Liquidity Pool</p>
                <p className="text-xs font-mono text-white">$2.45B Available</p>
              </div>
            </div>
            <div className="px-4 py-2 bg-gray-900/50 border border-gray-800 rounded-xl flex items-center gap-3 group hover:border-cyan-500/50 transition-all">
              <Globe size={16} className="text-cyan-500" />
              <div className="text-left">
                <p className="text-[8px] font-black text-gray-500 uppercase tracking-widest">Global Rails</p>
                <p className="text-xs font-mono text-white">182 Countries Active</p>
              </div>
            </div>
          </div>
        </header>

        {/* MAIN GRID */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
          
          {/* LEFT COLUMN: PAYMENT CONSOLE */}
          <div className="xl:col-span-8 space-y-8">
            
            {/* NAVIGATION TABS */}
            <div className="flex gap-1 p-1 bg-gray-900/50 border border-gray-800 rounded-2xl w-fit">
              {[
                { id: 'form', label: 'Transfer Portal', icon: Send },
                { id: 'analytics', label: 'Market Intelligence', icon: BarChart3 },
                { id: 'audit', label: 'Immutable Ledger', icon: Database },
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id as any);
                    logAuditAction('TAB_SWITCH', 'USER', 'LOW', { to: tab.id });
                  }}
                  className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${
                    activeTab === tab.id 
                      ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-600/20' 
                      : 'text-gray-500 hover:text-gray-300 hover:bg-gray-800'
                  }`}
                >
                  <tab.icon size={14} />
                  {tab.label}
                </button>
              ))}
            </div>

            {activeTab === 'form' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* PRIMARY FORM */}
                <div className="space-y-6">
                  <Card 
                    title={currentStep === 1 ? "Initiate Capital Flow" : "Security Verification"}
                    subtitle="Precision-engineered payment orchestration"
                  >
                    <div className="space-y-6 pt-4">
                      {currentStep === 1 ? (
                        <>
                          <div className="space-y-2">
                            <label className="block text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] ml-1">Recipient Identifier</label>
                            <div className="relative group">
                              <input 
                                type="text" 
                                value={recipientName} 
                                onChange={e => setRecipientName(e.target.value)} 
                                className="w-full bg-black/60 border border-gray-800 rounded-2xl p-4 text-white focus:ring-2 focus:ring-cyan-500/50 border-gray-700 outline-none font-mono text-lg transition-all group-hover:border-gray-600" 
                                placeholder="Entity Name or Wallet ID" 
                              />
                              <UserCheck className="absolute right-4 top-4 text-gray-700 group-focus-within:text-cyan-500 transition-colors" size={20} />
                            </div>
                          </div>

                          <div className="space-y-2">
                            <label className="block text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] ml-1">Magnitude (USD)</label>
                            <div className="relative group">
                              <input 
                                type="number" 
                                value={amount} 
                                onChange={e => setAmount(e.target.value)} 
                                className="w-full bg-black/60 border border-gray-800 rounded-2xl p-5 text-white focus:ring-2 focus:ring-cyan-500/50 border-gray-700 outline-none font-mono text-4xl font-black transition-all group-hover:border-gray-600" 
                                placeholder="0.00" 
                              />
                              <span className="absolute right-6 top-7 text-gray-600 font-black text-xl">USD</span>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <label className="block text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] ml-1">Execution Protocol</label>
                            <div className="grid grid-cols-2 gap-3">
                              {[
                                { id: 'quantumpay', label: 'QuantumPay', sub: 'Instant', icon: Zap },
                                { id: 'swift_global', label: 'SWIFT L1', sub: 'T+0', icon: Globe },
                                { id: 'blockchain_dlt', label: 'DLT Rail', sub: 'Encrypted', icon: Layers },
                                { id: 'cashapp', label: 'ACH Prime', sub: 'Standard', icon: RefreshCcw },
                              ].map(rail => (
                                <button
                                  key={rail.id}
                                  onClick={() => setPaymentMethod(rail.id as any)}
                                  className={`p-4 rounded-2xl border text-left transition-all ${
                                    paymentMethod === rail.id 
                                      ? 'bg-cyan-500/10 border-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.1)]' 
                                      : 'bg-black/40 border-gray-800 hover:border-gray-700'
                                  }`}
                                >
                                  <rail.icon size={18} className={paymentMethod === rail.id ? 'text-cyan-500' : 'text-gray-600'} />
                                  <p className={`text-xs font-black mt-2 uppercase ${paymentMethod === rail.id ? 'text-white' : 'text-gray-400'}`}>{rail.label}</p>
                                  <p className="text-[9px] text-gray-600 font-mono">{rail.sub}</p>
                                </button>
                              ))}
                            </div>
                          </div>

                          <div className="space-y-2">
                            <label className="block text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] ml-1">Transaction Memo (Optional)</label>
                            <textarea 
                              value={memo}
                              onChange={e => setMemo(e.target.value)}
                              className="w-full bg-black/60 border border-gray-800 rounded-2xl p-4 text-white focus:ring-2 focus:ring-cyan-500/50 border-gray-700 outline-none font-mono text-sm h-24 resize-none"
                              placeholder="Reference code, invoice #, or internal note..."
                            />
                          </div>
                        </>
                      ) : (
                        <div className="space-y-6 animate-in slide-in-from-right-8 duration-500">
                          <div className="bg-gradient-to-br from-gray-900 to-black p-8 rounded-[2.5rem] border border-gray-800 space-y-6 text-center relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-50" />
                            <p className="text-[10px] text-gray-500 uppercase font-black tracking-[0.3em]">Awaiting Digital Authorization</p>
                            <div className="space-y-1">
                              <div className="text-6xl font-black text-white font-mono tracking-tighter">
                                {formatCurrency(parseFloat(amount))}
                              </div>
                              <p className="text-cyan-400 font-mono text-sm tracking-widest uppercase">Target: {recipientName}</p>
                            </div>
                            <div className="flex justify-center gap-8 py-4 border-y border-gray-800/50">
                              <div className="text-center">
                                <p className="text-[8px] text-gray-600 uppercase font-bold">Network Fee</p>
                                <p className="text-xs font-mono text-white">$0.00</p>
                              </div>
                              <div className="text-center">
                                <p className="text-[8px] text-gray-600 uppercase font-bold">Settlement</p>
                                <p className="text-xs font-mono text-white">Instant</p>
                              </div>
                              <div className="text-center">
                                <p className="text-[8px] text-gray-600 uppercase font-bold">Protocol</p>
                                <p className="text-xs font-mono text-white uppercase">{paymentMethod}</p>
                              </div>
                            </div>
                            <p className="text-[9px] text-gray-600 font-mono italic">
                              SECURE_HASH: {generateHash().substring(0, 24)}...
                            </p>
                          </div>
                          <SecurityAuditDisplay auditResult={securityAudit} />
                        </div>
                      )}
                      
                      <div className="flex gap-4 mt-8">
                        {currentStep === 2 && (
                          <button 
                            onClick={() => setCurrentStep(1)} 
                            className="flex-1 py-4 bg-gray-900 hover:bg-gray-800 text-gray-400 font-black rounded-2xl transition-all uppercase tracking-widest text-xs border border-gray-800"
                          >
                            Modify
                          </button>
                        )}
                        <button 
                          onClick={handleSendClick} 
                          disabled={!amount || !recipientName || isProcessing} 
                          className="flex-[2] py-5 bg-cyan-600 hover:bg-cyan-500 rounded-2xl text-white font-black shadow-2xl shadow-cyan-600/30 transition-all active:scale-[0.98] disabled:opacity-30 uppercase tracking-[0.2em] text-xs flex items-center justify-center gap-3 group"
                        >
                          {isProcessing ? (
                            <RefreshCcw size={18} className="animate-spin" />
                          ) : (
                            <>
                              {currentStep === 1 ? "Review Protocol" : "Authorize Flow"}
                              <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </Card>
                </div>

                {/* SECONDARY DIAGNOSTICS */}
                <div className="space-y-8">
                  <Card title="Signal Intelligence" subtitle="Real-time heuristic monitoring">
                    <div className="space-y-6 py-2">
                      <div className="p-5 bg-black/60 rounded-2xl border border-gray-800 space-y-4">
                        <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest flex items-center gap-2">
                          <Cpu size={12} className="text-cyan-500" /> Neural Risk Engine
                        </p>
                        <SecurityEngine />
                      </div>

                      <div className="p-5 bg-black/60 rounded-2xl border border-gray-800 space-y-4">
                        <div className="flex items-center gap-4">
                          <div className="p-2 bg-emerald-500/10 rounded-lg">
                            <ShieldCheck className="text-emerald-500" size={20} />
                          </div>
                          <div>
                            <p className="text-[10px] text-white font-black uppercase tracking-widest">Zero-Knowledge Proofs</p>
                            <p className="text-[10px] text-gray-500">Identity obfuscation active for this route.</p>
                          </div>
                        </div>
                        <div className="h-px bg-gray-800" />
                        <div className="flex items-center gap-4">
                          <div className="p-2 bg-cyan-500/10 rounded-lg">
                            <Terminal className="text-cyan-500" size={20} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-[10px] text-white font-black uppercase tracking-widest">Telemetry Stream</p>
                            <p className="text-[9px] text-gray-600 font-mono truncate mt-1">
                              &gt; handshake_init: node_{paymentMethod.substring(0, 4)}...
                              <br />
                              &gt; entropy_check: 0.99923...
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="p-6 bg-gradient-to-br from-indigo-900/20 to-transparent border border-indigo-500/20 rounded-3xl flex items-center gap-5 group hover:border-indigo-500/40 transition-all">
                        <div className="relative">
                          <History className="text-indigo-400" size={24} />
                          <div className="absolute -top-1 -right-1 w-3 h-3 bg-indigo-500 rounded-full border-2 border-black" />
                        </div>
                        <div>
                          <p className="text-[10px] text-white font-black uppercase tracking-widest">Historical Synergy</p>
                          <p className="text-[10px] text-gray-400 mt-1">3 successful deployments to this recipient in the last 30 cycles.</p>
                        </div>
                      </div>
                    </div>
                  </Card>

                  <Card title="Compliance Oracle">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-3 bg-gray-900/30 rounded-xl border border-gray-800">
                        <div className="flex items-center gap-3">
                          <FileText size={14} className="text-gray-500" />
                          <span className="text-[10px] font-bold text-gray-400 uppercase">AML Screening</span>
                        </div>
                        <span className="text-[10px] font-mono text-emerald-500">PASSED</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-gray-900/30 rounded-xl border border-gray-800">
                        <div className="flex items-center gap-3">
                          <ShieldAlert size={14} className="text-gray-500" />
                          <span className="text-[10px] font-bold text-gray-400 uppercase">Sanctions Check</span>
                        </div>
                        <span className="text-[10px] font-mono text-emerald-500">CLEAR</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-gray-900/30 rounded-xl border border-gray-800">
                        <div className="flex items-center gap-3">
                          <Fingerprint size={14} className="text-gray-500" />
                          <span className="text-[10px] font-bold text-gray-400 uppercase">KYB Verification</span>
                        </div>
                        <span className="text-[10px] font-mono text-emerald-500">VERIFIED</span>
                      </div>
                    </div>
                  </Card>
                </div>
              </div>
            )}

            {activeTab === 'analytics' && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card title="Volume Analysis">
                    <div className="h-48 flex items-end justify-between gap-2 px-2">
                      {[40, 70, 45, 90, 65, 80, 95].map((h, i) => (
                        <div key={i} className="w-full bg-cyan-500/20 rounded-t-lg relative group">
                          <div 
                            className="absolute bottom-0 left-0 w-full bg-cyan-500 rounded-t-lg transition-all duration-1000 group-hover:bg-cyan-400" 
                            style={{ height: `${h}%` }} 
                          />
                        </div>
                      ))}
                    </div>
                    <div className="flex justify-between mt-4 text-[8px] font-mono text-gray-600 uppercase">
                      <span>Mon</span><span>Wed</span><span>Fri</span><span>Sun</span>
                    </div>
                  </Card>
                  <Card title="Rail Efficiency">
                    <div className="space-y-4 pt-4">
                      {[
                        { label: 'Quantum', val: 99.9, color: 'bg-cyan-500' },
                        { label: 'SWIFT', val: 82.4, color: 'bg-indigo-500' },
                        { label: 'ACH', val: 94.1, color: 'bg-emerald-500' },
                      ].map(r => (
                        <div key={r.label} className="space-y-1">
                          <div className="flex justify-between text-[10px] font-bold text-gray-400 uppercase">
                            <span>{r.label}</span>
                            <span>{r.val}%</span>
                          </div>
                          <div className="h-1.5 w-full bg-gray-900 rounded-full overflow-hidden">
                            <div className={`h-full ${r.color}`} style={{ width: `${r.val}%` }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card>
                  <Card title="Global Reach">
                    <div className="flex items-center justify-center h-48 relative">
                      <Globe size={100} className="text-gray-800 animate-pulse" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                          <p className="text-2xl font-black text-white">182</p>
                          <p className="text-[8px] text-gray-500 uppercase font-bold">Active Nodes</p>
                        </div>
                      </div>
                    </div>
                  </Card>
                </div>
                <Card title="Market Liquidity Heatmap">
                  <div className="grid grid-cols-12 gap-2 h-32">
                    {Array.from({ length: 48 }).map((_, i) => (
                      <div 
                        key={i} 
                        className="rounded-sm transition-all hover:scale-110 cursor-crosshair" 
                        style={{ 
                          backgroundColor: `rgba(6, 182, 212, ${Math.random() * 0.8 + 0.1})`,
                        }}
                        title={`Node ${i}: High Liquidity`}
                      />
                    ))}
                  </div>
                </Card>
              </div>
            )}

            {activeTab === 'audit' && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <Card 
                  title="Immutable Audit Ledger" 
                  subtitle="Cryptographically signed record of all system interactions"
                  headerActions={[
                    { id: 'dl', icon: <Download />, label: 'Export CSV', onClick: () => logAuditAction('LEDGER_EXPORT', 'USER', 'MEDIUM', { format: 'CSV' }) },
                    { id: 'filter', icon: <Filter />, label: 'Filter', onClick: () => {} }
                  ]}
                >
                  <AuditLedger logs={auditTrail} />
                </Card>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-6 bg-gray-900/30 border border-gray-800 rounded-2xl space-y-2">
                    <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest">Ledger Integrity</p>
                    <div className="flex items-center gap-3">
                      <ShieldCheck className="text-emerald-500" size={20} />
                      <p className="text-xs font-mono text-gray-300">All blocks verified. No discrepancies detected.</p>
                    </div>
                  </div>
                  <div className="p-6 bg-gray-900/30 border border-gray-800 rounded-2xl space-y-2">
                    <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest">Storage Utilization</p>
                    <div className="flex items-center gap-3">
                      <Database className="text-cyan-500" size={20} />
                      <p className="text-xs font-mono text-gray-300">Quantum-encrypted cold storage: 12.4 TB used.</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* RIGHT COLUMN: AI STRATEGIST CHAT */}
          <div className="xl:col-span-4">
            <div className="sticky top-10 space-y-6">
              <Card 
                className="h-[calc(100vh-180px)] flex flex-col border-cyan-500/20 shadow-[0_0_40px_rgba(6,182,212,0.05)]"
                title="AI Strategist"
                subtitle="Quantum Financial Intelligence Core"
                icon={<Cpu className="text-cyan-500" size={20} />}
              >
                <div className="flex-1 overflow-y-auto space-y-6 pr-2 custom-scrollbar mb-4">
                  {messages.map((msg) => (
                    <div 
                      key={msg.id} 
                      className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
                    >
                      <div className={`max-w-[85%] p-4 rounded-2xl text-xs leading-relaxed ${
                        msg.role === 'user' 
                          ? 'bg-cyan-600 text-white rounded-tr-none' 
                          : msg.role === 'system'
                          ? 'bg-gray-800/50 text-gray-400 italic text-center w-full'
                          : 'bg-gray-900 border border-gray-800 text-gray-300 rounded-tl-none'
                      }`}>
                        {msg.content}
                      </div>
                      <span className="text-[8px] font-mono text-gray-600 mt-1 uppercase">{msg.timestamp}</span>
                    </div>
                  ))}
                  {isAiTyping && (
                    <div className="flex items-center gap-2 text-cyan-500 animate-pulse">
                      <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  )}
                  <div ref={chatEndRef} />
                </div>

                <form onSubmit={handleAiChat} className="relative mt-auto">
                  <input 
                    type="text" 
                    value={chatInput}
                    onChange={e => setChatInput(e.target.value)}
                    placeholder="Ask the Strategist..."
                    className="w-full bg-black border border-gray-800 rounded-2xl p-4 pr-12 text-xs text-white focus:ring-2 focus:ring-cyan-500/50 outline-none transition-all"
                  />
                  <button 
                    type="submit"
                    disabled={!chatInput.trim() || isAiTyping}
                    className="absolute right-2 top-2 p-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl transition-all disabled:opacity-30"
                  >
                    <ArrowUpRight size={18} />
                  </button>
                </form>
              </Card>

              {/* QUICK ACTIONS */}
              <div className="grid grid-cols-2 gap-4">
                <button 
                  onClick={() => {
                    setChatInput("Analyze the risk of a $50,000 transfer to Global Logistics Inc.");
                    handleAiChat();
                  }}
                  className="p-4 bg-gray-900/50 border border-gray-800 rounded-2xl text-[10px] font-black text-gray-500 uppercase tracking-widest hover:border-cyan-500/50 hover:text-cyan-400 transition-all text-left"
                >
                  Risk Analysis
                </button>
                <button 
                  onClick={() => {
                    setChatInput("What is the most efficient rail for a T+0 settlement to London?");
                    handleAiChat();
                  }}
                  className="p-4 bg-gray-900/50 border border-gray-800 rounded-2xl text-[10px] font-black text-gray-500 uppercase tracking-widest hover:border-cyan-500/50 hover:text-cyan-400 transition-all text-left"
                >
                  Rail Optimization
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MODALS */}
      <BiometricModal 
        isOpen={showBiometricModal} 
        onSuccess={handleSuccess} 
        onClose={() => {
          setShowBiometricModal(false);
          logAuditAction('BIOMETRIC_CANCELLED', 'USER', 'MEDIUM', { amount });
        }} 
        amount={amount} 
        recipient={recipientName} 
        paymentMethod={paymentMethod} 
        securityContext="corporate_treasury" 
      />

      {/* GLOBAL OVERLAYS */}
      {isProcessing && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center">
          <div className="text-center space-y-6">
            <div className="relative">
              <div className="w-24 h-24 border-4 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin mx-auto" />
              <Lock className="absolute inset-0 m-auto text-cyan-500" size={32} />
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter">Securing Transaction</h3>
              <p className="text-gray-500 font-mono text-xs animate-pulse">ENCRYPTING_PACKETS // SIGNING_LEDGER // VERIFYING_NODES</p>
            </div>
          </div>
        </div>
      )}

      {/* CUSTOM STYLES */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #1f2937;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #06b6d4;
        }
      `}</style>
    </div>
  );
};

export default SendMoneyView;

================================================================================
// APPENDED FROM REPO: diplomat-bit/magic | ORIGINAL PATH: diplomat-bit-magic-a3f5ff1/components/SendMoneyView (1).tsx
================================================================================


import React, { useState, useContext, useEffect } from 'react';
import Card from './Card';
import { DataContext } from '../context/DataContext';
import { View, PaymentRail, Transaction } from '../types';
import { BiometricModal, SecurityAuditDisplay, SecurityAuditResult } from './payment-components';

const SendMoneyView: React.FC = () => {
    const context = useContext(DataContext);
    if (!context) throw new Error("SendMoneyView must be used within a DataProvider");
    const { addTransaction, setActiveView } = context;

    const [amount, setAmount] = useState('');
    const [recipientName, setRecipientName] = useState('');
    const [paymentMethod, setPaymentMethod] = useState<PaymentRail>('quantumpay');
    const [showBiometricModal, setShowBiometricModal] = useState(false);
    const [securityAudit, setSecurityAudit] = useState<SecurityAuditResult | null>(null);
    const [currentStep, setCurrentStep] = useState(1);

    useEffect(() => {
        const auditTimeout = setTimeout(() => {
            if (parseFloat(amount) > 0 && recipientName) {
                setSecurityAudit({
                    riskScore: parseFloat(amount) > 5000 ? 60 : 10,
                    fraudProbability: 0.01,
                    amlCompliance: 'pass',
                    sanctionScreening: 'pass',
                    quantumSignatureIntegrity: 'verified',
                    recommendations: parseFloat(amount) > 5000 ? ["High value transaction. AI monitoring active."] : [],
                    complianceAlerts: [],
                    threatVectorAnalysis: []
                });
            }
        }, 800);
        return () => clearTimeout(auditTimeout);
    }, [amount, recipientName]);

    const handleSendClick = () => {
        if (currentStep === 1) setCurrentStep(2);
        else if (currentStep === 2) setShowBiometricModal(true);
    };

    const handleSuccess = async () => {
        const newTx: Transaction = {
            id: `tx_${Date.now()}`,
            type: 'expense',
            category: 'Transfer',
            description: `Sent to ${recipientName} via ${paymentMethod}`,
            amount: parseFloat(amount),
            date: new Date().toISOString().split('T')[0],
            carbonFootprint: 0.5,
            aiCategoryConfidence: 1.0
        };
        await addTransaction(newTx);
        setShowBiometricModal(false);
        setActiveView(View.Dashboard);
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <h2 className="text-3xl font-black text-white tracking-tighter uppercase italic">Quantum Pay Portal</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card title={currentStep === 1 ? "Initiate Transfer" : "Review Transaction"}>
                    <div className="space-y-6">
                        {currentStep === 1 ? (
                            <>
                                <div>
                                    <label className="block text-[10px] font-bold text-gray-500 uppercase mb-2 tracking-widest">Recipient</label>
                                    <input type="text" value={recipientName} onChange={e => setRecipientName(e.target.value)} className="w-full bg-black/40 border border-gray-700 rounded-xl p-3 text-white focus:ring-1 focus:ring-cyan-500 outline-none font-mono" placeholder="Name, @tag, or ID" />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-bold text-gray-500 uppercase mb-2 tracking-widest">Amount (USD)</label>
                                    <input type="number" value={amount} onChange={e => setAmount(e.target.value)} className="w-full bg-black/40 border border-gray-700 rounded-xl p-3 text-white focus:ring-1 focus:ring-cyan-500 outline-none font-mono" placeholder="0.00" />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-bold text-gray-500 uppercase mb-2 tracking-widest">Execution Rail</label>
                                    <select value={paymentMethod} onChange={e => setPaymentMethod(e.target.value as PaymentRail)} className="w-full bg-black/40 border border-gray-700 rounded-xl p-3 text-white focus:ring-1 focus:ring-cyan-500 outline-none font-mono appearance-none">
                                        <option value="quantumpay">QuantumPay (Instant Settlement)</option>
                                        <option value="cashapp">Cash App</option>
                                        <option value="swift_global">SWIFT Global (L1)</option>
                                        <option value="blockchain_dlt">Blockchain DLT</option>
                                    </select>
                                </div>
                                <SecurityAuditDisplay auditResult={securityAudit} />
                            </>
                        ) : (
                            <div className="space-y-4 text-gray-100 bg-gray-900/50 p-6 rounded-2xl border border-gray-800">
                                <div className="flex justify-between border-b border-gray-800 pb-2">
                                    <span className="text-gray-500 text-xs uppercase font-bold">Target</span>
                                    <span className="font-mono text-cyan-400">{recipientName}</span>
                                </div>
                                <div className="flex justify-between border-b border-gray-800 pb-2">
                                    <span className="text-gray-500 text-xs uppercase font-bold">Magnitude</span>
                                    <span className="font-mono text-2xl font-black">${parseFloat(amount).toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between border-b border-gray-800 pb-2">
                                    <span className="text-gray-500 text-xs uppercase font-bold">Protocol</span>
                                    <span className="font-mono text-xs">{paymentMethod.toUpperCase()}</span>
                                </div>
                                <p className="text-[10px] text-yellow-500 font-mono animate-pulse">ESTIMATED_SETTLEMENT: INSTANT_QUANTUM</p>
                            </div>
                        )}
                        
                        <div className="flex justify-end gap-3 mt-8">
                             {currentStep === 2 && <button onClick={() => setCurrentStep(1)} className="px-6 py-3 bg-gray-800 rounded-xl text-white font-bold hover:bg-gray-700 transition-all">BACK</button>}
                             <button onClick={handleSendClick} disabled={!amount || !recipientName} className="px-8 py-3 bg-cyan-600 hover:bg-cyan-500 rounded-xl text-white font-black shadow-lg shadow-cyan-500/20 transition-all active:scale-95 disabled:opacity-50 uppercase tracking-widest">
                                {currentStep === 1 ? "Review Order" : "Initialize Flow"}
                             </button>
                        </div>
                    </div>
                </Card>

                <Card title="Network Diagnostics">
                    <div className="space-y-4">
                        <div className="p-4 bg-gray-950 rounded-xl border border-gray-800">
                            <p className="text-[10px] text-gray-500 uppercase font-black mb-2">DLT Nodes Status</p>
                            <div className="grid grid-cols-4 gap-2">
                                {[...Array(4)].map((_, i) => (
                                    <div key={i} className="h-1 bg-green-500 rounded-full shadow-[0_0_8px_rgba(34,197,94,0.4)]"></div>
                                ))}
                            </div>
                        </div>
                        <div className="p-4 bg-gray-950 rounded-xl border border-gray-800 font-mono text-[10px] text-gray-500">
                            <p>&gt; Requesting path optimization...</p>
                            <p className="text-cyan-400">&gt; Found optimal rail: {paymentMethod}</p>
                            <p>&gt; Validating recipient biometric hash...</p>
                            <p className="text-green-400">&gt; Recipient verified on decentralized identity grid.</p>
                        </div>
                    </div>
                </Card>
            </div>
            <BiometricModal isOpen={showBiometricModal} onSuccess={handleSuccess} onClose={() => setShowBiometricModal(false)} amount={amount} recipient={recipientName} paymentMethod={paymentMethod} securityContext="personal" />
        </div>
    );
};

export default SendMoneyView;


================================================================================
// APPENDED FROM REPO: diplomat-bit/magic | ORIGINAL PATH: diplomat-bit-magic-a3f5ff1/components/SendMoneyView (4).tsx
================================================================================

// components/views/personal/SendMoneyView.tsx
// RE-ENACTED & EXPANDED: This component has been resurrected from its deprecated state.
// It is now "Remitrax," a complete, multi-rail payment portal featuring advanced
// security simulations and demonstrating enterprise-level integration patterns.
// After a decade of upgrades, Remitrax has evolved into an unparalleled financial ecosystem,
// incorporating AI, quantum-resistant security, DLT, and even neuro-link technologies.

import React, { useState, useContext, useRef, useEffect, useCallback } from 'react';
import Card from './Card';
import { DataContext } from '../context/DataContext';
import { View } from '../types';
import type { Transaction } from '../types';

// ================================================================================================
// GLOBAL REMITRAX PLATFORM WIDE TYPE DEFINITIONS
// ================================================================================================

export type PaymentRail = 'quantumpay' | 'cashapp' | 'swift_global' | 'blockchain_dlt' | 'interstellar_p2p' | 'neuro_link' | 'ai_contract_escrow';
export type ScanState = 'scanning' | 'success' | 'verifying' | 'error' | 'recalibrating' | 'quantum_sync' | 'ai_negotiating';

export interface RemitraxRecipientProfile {
  id: string;
  name: string;
  avatarUrl?: string;
  quantumTag?: string;
  cashtag?: string;
  swiftDetails?: { bankName: string; bic: string; accountNumber: string; };
  blockchainAddress?: string;
  neuroLinkAddress?: string;
  galacticP2PId?: string;
  preferredCurrency?: string;
  lastUsedDate?: string;
  trustScore?: number;
  kycStatus?: 'verified' | 'pending' | 'unverified';
  blacklisted?: boolean;
  bankAccounts?: { bankName: string; accountNumber: string; routingNumber?: string; iban?: string; }[];
  eWalletDetails?: { type: 'paypal' | 'venmo' | 'zelle' | 'revolut' | 'cashapp' | 'quantumpay'; identifier: string; }[];
  contactPreferences?: { email: boolean; sms: boolean; push: boolean; holo_alert?: boolean; };
  relationshipStatus?: 'family' | 'friend' | 'business' | 'self' | 'vendor' | 'partner' | 'regulatory_body';
  category?: 'personal' | 'business' | 'charity' | 'government';
  multiEntitySupport?: { parentId: string; subEntities: { id: string; name: string; type: string; }[]; };
  complianceFlags?: ('high_risk' | 'sanctioned_entity' | 'PEP' | 'low_risk' | 'verified_entity')[];
}

export interface RemitraxCurrency {
  code: string;
  name: string;
  symbol: string;
  isCrypto: boolean;
  conversionRate?: number;
  quantumFluctuationIndex?: number;
  decimalPlaces: number;
  minTransactionAmount?: number;
  maxTransactionAmount?: number;
  liquidityScore?: number;
  marketCap?: number;
  regulatoryStatus?: 'regulated' | 'unregulated' | 'experimental';
  crossChainCompatible?: boolean;
}

export interface ScheduledPaymentRule {
  frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'annually' | 'once_on_date' | 'conditional_event';
  startDate: string;
  endDate?: string;
  executionCondition?: string;
  nextExecutionDate?: string;
  maxExecutions?: number;
  triggerEventId?: string;
  paymentReason?: string;
  aiAnalysisTags?: string[];
  geoFenceTrigger?: { lat: number; lon: number; radius: number; };
  biometricApprovalRequired?: boolean;
}

export interface AdvancedTransactionSettings {
  priority: 'low' | 'normal' | 'high' | 'ultra_quantum';
  carbonOffsetRatio: number;
  privacyLevel: 'standard' | 'enhanced' | 'fully_anonymous_dlt';
  receiptPreference: 'email' | 'blockchain_proof' | 'neuronal_link_receipt' | 'physical_mail';
  notificationPreferences: { email: boolean; sms: boolean; push: boolean; holo_alert: boolean; };
  multiSignatureRequired?: boolean;
  escrowDetails?: { agentId: string; releaseCondition: string; };
  dynamicFeeOptimization?: 'auto' | 'manual';
  dataEncryptionStandard: 'aes256' | 'quantum_resistant_hybrid' | 'zero_knowledge_proof' | 'obfuscated_vault';
  routeOptimizationPreference: 'speed' | 'cost' | 'privacy' | 'sustainability' | 'compliance';
  dlcDetails?: { contractId: string; conditions: string; };
  transactionExpiryMinutes?: number;
  regulatoryReportingFlags?: ('FATCA' | 'CRS' | 'AML' | 'CFT' | 'none')[];
  postQuantumSecurityEnabled?: boolean;
}

export interface SecurityAuditResult {
  riskScore: number;
  fraudProbability: number;
  amlCompliance: 'pass' | 'fail' | 'review';
  sanctionScreening: 'pass' | 'fail';
  quantumSignatureIntegrity: 'verified' | 'compromised' | 'pending';
  recommendations: string[];
  complianceAlerts?: string[];
  threatVectorAnalysis?: { type: string; severity: 'low' | 'medium' | 'high'; description: string; }[];
}

export interface EnvironmentalImpactReport {
    transactionCO2e: number;
    offsetCO2e: number;
    netCO2e: number;
    renewableEnergyUsedPercentage: number;
    recommendations?: string[];
}

export interface RailSpecificDetails {
    swift?: { bankName: string; bic: string; accountNumber: string; beneficiaryAddress: string; };
    blockchain?: { network: 'ethereum' | 'polygon' | 'solana' | 'custom_dlt' | ''; gasLimit: string; dataPayload?: string; };
    interstellar?: { galaxyId: string; starSystemAddress: string; vesselIdentifier?: string; warpDriveEfficiencyRating?: number; };
    neuroLink?: { neuralSignatureType: 'brainwave' | 'retinal_pattern' | ''; recipientId: string; neuroSyncProtocolVersion?: string; };
    aiContractEscrow?: { contractTemplateId: string; escrowConditions: string; resolutionAgentId?: string; immutableLedgerHash?: string; };
    quantumpay?: { channelProtocol: 'quantum_tunnel_v2' | 'entanglement_link_v1'; encryptionStandard: 'QRC-256' | 'hybrid_post_quantum'; quantumSignatureAlgorithm?: string; }
}

interface SendMoneyViewProps {
  setActiveView?: (view: View) => void;
}

// ================================================================================================
// ANIMATED UI SUB-COMPONENTS
// ================================================================================================

export const AnimatedCheckmarkIcon: React.FC = () => (
    <>
        <svg className="h-24 w-24 transform scale-125" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
            <defs>
                <linearGradient id="checkmarkGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#4ade80" />
                    <stop offset="50%" stopColor="#86efac" />
                    <stop offset="100%" stopColor="#22c55e" />
                </linearGradient>
                <filter id="hologramGlow">
                    <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur" />
                    <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 10 0" result="coloredBlur" />
                    <feMerge><feMergeNode in="coloredBlur" /><feMergeNode in="SourceGraphic" /></feMerge>
                </filter>
            </defs>
            <circle className="checkmark__circle" cx="26" cy="26" r="25" fill="none" stroke="url(#checkmarkGradient)" filter="url(#hologramGlow)" />
            <path className="checkmark__check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" />
        </svg>
        <style>{`
            .checkmark__circle { stroke-dasharray: 166; stroke-dashoffset: 166; stroke-width: 4; stroke-miterlimit: 10; fill: none; animation: stroke-circle 0.6s cubic-bezier(0.65, 0, 0.45, 1) forwards; box-shadow: 0 0 15px rgba(66, 255, 125, 0.7); }
            .checkmark__check { transform-origin: 50% 50%; stroke-dasharray: 48; stroke-dashoffset: 48; stroke-width: 5; stroke: #fff; animation: stroke-check 0.3s cubic-bezier(0.65, 0, 0.45, 1) 0.8s forwards; }
            @keyframes stroke-circle { 100% { stroke-dashoffset: 0; } }
            @keyframes stroke-check { 100% { stroke-dashoffset: 0; } }
        `}</style>
    </>
);

export const QuantumLedgerAnimation: React.FC = () => (
    <>
        <div className="quantum-ledger-container">
            <div className="quantum-grid-enhanced">
                {Array.from({ length: 16 }).map((_, i) => (
                    <div key={i} className="quantum-block-enhanced" style={{ animationDelay: `${i * 0.08}s` }}></div>
                ))}
            </div>
            <div className="quantum-data-flow">
                <div className="data-packet" style={{ '--flow-delay': '0s' } as React.CSSProperties}></div>
                <div className="data-packet" style={{ '--flow-delay': '0.5s' } as React.CSSProperties}></div>
            </div>
            <div className="text-center mt-4 text-xs text-cyan-300 animate-pulse">Quantum Entanglement Protocol: Active</div>
        </div>
        <style>{`
            .quantum-ledger-container { position: relative; width: 150px; height: 150px; display: flex; flex-direction: column; align-items: center; justify-content: center; }
            .quantum-grid-enhanced { display: grid; grid-template-columns: repeat(4, 1fr); gap: 6px; width: 120px; height: 120px; position: relative; z-index: 1; }
            .quantum-block-enhanced { background-color: rgba(6, 182, 212, 0.2); border: 1px solid #06b6d4; border-radius: 3px; animation: quantum-pulse 2s infinite ease-in-out forwards; box-shadow: 0 0 8px rgba(6, 182, 212, 0.5); }
            @keyframes quantum-pulse { 0%, 100% { background-color: rgba(6, 182, 212, 0.2); transform: scale(1); box-shadow: 0 0 8px rgba(6, 182, 212, 0.5); } 50% { background-color: rgba(165, 243, 252, 0.7); transform: scale(1.08); box-shadow: 0 0 15px rgba(165, 243, 252, 0.8); } }
            .quantum-data-flow { position: absolute; inset: 0; display: flex; justify-content: center; align-items: center; }
            .data-packet { position: absolute; width: 8px; height: 8px; border-radius: 50%; background: linear-gradient(45deg, #0ef, #06b6d4); box-shadow: 0 0 5px #0ef, 0 0 10px #06b6d4; animation: data-flow-path 4s infinite linear var(--flow-delay); opacity: 0; }
            @keyframes data-flow-path { 0% { transform: translate(-60px, -60px) scale(0.5); opacity: 0; } 20% { opacity: 1; } 50% { transform: translate(60px, 60px) scale(1.2); opacity: 1; } 80% { opacity: 0; } 100% { transform: translate(120px, 120px) scale(0.5); opacity: 0; } }
        `}</style>
    </>
);

export const QuantumChannelEstablishment: React.FC = () => (
    <>
        <div className="flex flex-col items-center justify-center space-y-3">
            <div className="relative w-24 h-24 rounded-full flex items-center justify-center border-2 border-purple-500 animate-spin-slow">
                <div className="w-16 h-16 rounded-full border-2 border-purple-400 animate-ping-once"></div>
                <div className="absolute w-8 h-8 bg-purple-600 rounded-full animate-pulse-fast"></div>
            </div>
            <p className="text-sm text-purple-300 animate-fade-in-out">Establishing Quantum Tunnel...</p>
        </div>
        <style>{`.animate-spin-slow { animation: spin-slow 8s linear infinite; } .animate-ping-once { animation: ping-once 2s ease-out infinite; } .animate-pulse-fast { animation: pulse-fast 1.5s ease-in-out infinite; } .animate-fade-in-out { animation: fade-in-out 3s ease-in-out infinite; }
        @keyframes spin-slow { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } } @keyframes ping-once { 0% { transform: scale(0.2); opacity: 0; } 50% { transform: scale(1); opacity: 1; } 100% { transform: scale(1.2); opacity: 0; } } @keyframes pulse-fast { 0%, 100% { transform: scale(1); opacity: 1; } 50% { transform: scale(1.1); opacity: 0.8; } } @keyframes fade-in-out { 0%, 100% { opacity: 0.5; } 50% { opacity: 1; } }`}</style>
    </>
);

export const AINegotiationAnimation: React.FC = () => (
    <>
        <div className="flex flex-col items-center justify-center space-y-3">
            <div className="relative w-24 h-24 flex items-center justify-center">
                <i className="fas fa-robot text-7xl text-teal-500 animate-pulse-slow"></i>
                <div className="absolute w-12 h-12 bg-gray-900 rounded-full flex items-center justify-center animate-spin-fast">
                    <i className="fas fa-exchange-alt text-xl text-teal-300"></i>
                </div>
            </div>
            <p className="text-sm text-teal-300 animate-fade-in-out">AI Negotiating Optimal Route & Terms...</p>
        </div>
        <style>{`.animate-pulse-slow { animation: pulse-slow 2.5s ease-in-out infinite; } .animate-spin-fast { animation: spin-fast 1.5s linear infinite; }
        @keyframes pulse-slow { 0%, 100% { transform: scale(1); opacity: 1; } 50% { transform: scale(1.05); opacity: 0.8; } } @keyframes spin-fast { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
    </>
);

export const SecurityAuditDisplay: React.FC<{ auditResult: SecurityAuditResult | null }> = ({ auditResult }) => {
    if (!auditResult) return <div className="flex items-center space-x-2 text-yellow-400"><svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg><span>Performing real-time security audit...</span></div>;

    return (
        <div className="bg-gray-800 p-4 rounded-lg space-y-2 border border-gray-700">
            <h4 className="font-semibold text-lg text-white">Security Audit Report</h4>
            <div className="grid grid-cols-2 gap-2 text-sm">
                <p className="text-gray-400">Risk Score:</p><p className={`${auditResult.riskScore > 50 ? 'text-red-400' : 'text-green-400'}`}>{auditResult.riskScore}/100</p>
                <p className="text-gray-400">Fraud Probability:</p><p className={`${auditResult.fraudProbability > 0.3 ? 'text-red-400' : 'text-green-400'}`}>{`${(auditResult.fraudProbability * 100).toFixed(2)}%`}</p>
                <p className="text-gray-400">AML Compliance:</p><p className={auditResult.amlCompliance === 'pass' ? 'text-green-400' : 'text-yellow-400'}>{auditResult.amlCompliance}</p>
            </div>
            {auditResult.recommendations.length > 0 && (
                <div className="mt-2 text-sm text-yellow-300">
                    <p className="font-medium">Recommendations:</p>
                    <ul className="list-disc list-inside text-xs text-yellow-200">{auditResult.recommendations.map((rec, i) => <li key={i}>{rec}</li>)}</ul>
                </div>
            )}
        </div>
    );
};

export const BiometricModal: React.FC<{
    isOpen: boolean; onSuccess: () => void; onClose: () => void; amount: string; recipient: RemitraxRecipientProfile | string; paymentMethod: PaymentRail; securityContext: 'personal' | 'corporate' | 'regulatory'; mfAuthMethods?: ('fingerprint' | 'voice' | 'retinal_scan' | 'neural_pattern' | 'face')[]; approvalRequiredBy?: string[];
}> = ({ isOpen, onSuccess, onClose, amount, recipient, paymentMethod, securityContext, mfAuthMethods = ['fingerprint'], approvalRequiredBy }) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [scanState, setScanState] = useState<ScanState>('scanning');
    const [verificationStep, setVerificationStep] = useState(0);
    const [biometricProgress, setBiometricProgress] = useState(0);
    const [activeAuthMethod, setActiveAuthMethod] = useState(mfAuthMethods[0] || 'face');
    const recipientName = typeof recipient === 'string' ? recipient : recipient.name;

    const verificationMessages = [ `Heuristic API: Initializing secure channel with ${paymentMethod}...`, `Heuristic API: Validating ${recipientName}'s identity...`, 'Heuristic API: Cross-referencing fraud ledgers...', 'Heuristic API: Executing on DLT/Quantum ledger...', 'Heuristic API: Confirming consensus...', 'Heuristic API: Archiving proof...', 'Heuristic API: Final checks...' ];

    useEffect(() => {
        if (!isOpen) { setScanState('scanning'); setVerificationStep(0); setBiometricProgress(0); return; }
        let stream: MediaStream | null = null;
        const startCamera = async () => {
            try { if (activeAuthMethod === 'face' || activeAuthMethod === 'retinal_scan') { stream = await navigator.mediaDevices.getUserMedia({ video: true }); if (videoRef.current) videoRef.current.srcObject = stream; } } catch (err) { setScanState('error'); }
        };
        startCamera();
        const scanProgressInterval = setInterval(() => setBiometricProgress(prev => Math.min(prev + Math.random() * 10, 100)), 200);
        const successTimer = setTimeout(() => { setScanState('success'); clearInterval(scanProgressInterval); }, 3000);
        const verifyTimer = setTimeout(() => setScanState('verifying'), 4000);
        const quantumSyncTimer = setTimeout(() => setScanState('quantum_sync'), 7500);
        const aiNegotiatingTimer = setTimeout(() => setScanState('ai_negotiating'), 10500);
        const successActionTimer = setTimeout(onSuccess, 15000);
        const closeTimer = setTimeout(onClose, 16000);
        return () => { clearTimeout(successTimer); clearTimeout(verifyTimer); clearTimeout(quantumSyncTimer); clearTimeout(aiNegotiatingTimer); clearTimeout(successActionTimer); clearTimeout(closeTimer); clearInterval(scanProgressInterval); if (stream) stream.getTracks().forEach(track => track.stop()); };
    }, [isOpen, onSuccess, onClose, activeAuthMethod]);

    useEffect(() => {
        if (['verifying', 'quantum_sync', 'ai_negotiating'].includes(scanState)) {
            const interval = setInterval(() => setVerificationStep(prev => Math.min(prev + 1, verificationMessages.length - 1)), 1500);
            return () => clearInterval(interval);
        }
    }, [scanState]);

    const getTitle = () => {
        switch (scanState) {
            case 'scanning': return `Scanning ${activeAuthMethod === 'face' ? 'Face' : 'Biometrics'}`;
            case 'success': return 'Identity Confirmed';
            case 'verifying': return 'Compliance Verification';
            case 'quantum_sync': return 'Quantum Network Sync';
            case 'ai_negotiating': return 'AI Optimization';
            case 'error': return 'Verification Failed';
            case 'recalibrating': return 'Recalibrating...';
        }
    };

    return (
        <div className={`fixed inset-0 bg-black/80 flex items-end sm:items-center justify-center z-50 backdrop-blur-lg transition-opacity duration-500 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
            <div className={`bg-gray-900 rounded-3xl p-8 max-w-lg w-full text-center border-2 border-cyan-700 shadow-xl transition-transform duration-500 ${isOpen ? 'translate-y-0 scale-100' : 'translate-y-full scale-90'}`}>
                <h3 className="text-3xl font-extrabold text-white mb-4">{getTitle()}</h3>
                <div className="relative w-72 h-72 mx-auto rounded-full overflow-hidden border-4 border-cyan-600 mb-6 shadow-lg">
                    {(activeAuthMethod === 'face' || activeAuthMethod === 'retinal_scan') ? <video ref={videoRef} autoPlay muted playsInline className="absolute top-0 left-0 w-full h-full object-cover transform scale-x-[-1]"></video> : <div className="absolute inset-0 flex items-center justify-center bg-gray-950 text-gray-500 text-lg"><p>Authenticating {activeAuthMethod}...</p></div>}
                    {scanState === 'scanning' && <div className="absolute inset-0 bg-grid-pattern-cyan animate-scan-holographic"><div className="absolute top-0 left-1/2 -translate-x-1/2 w-4/5 h-1 bg-cyan-400 opacity-70 blur-sm animate-scanner-line"></div></div>}
                    {scanState === 'success' && <div className="absolute inset-0 bg-green-500/50 flex items-center justify-center"><AnimatedCheckmarkIcon /></div>}
                    {scanState === 'verifying' && <div className="absolute inset-0 bg-black/50 flex items-center justify-center"><QuantumLedgerAnimation /></div>}
                    {scanState === 'quantum_sync' && <div className="absolute inset-0 bg-purple-900/80 flex items-center justify-center"><QuantumChannelEstablishment /></div>}
                    {scanState === 'ai_negotiating' && <div className="absolute inset-0 bg-teal-900/80 flex items-center justify-center"><AINegotiationAnimation /></div>}
                </div>
                {scanState === 'scanning' && <div className="w-full bg-gray-700 rounded-full h-2.5 mb-4"><div className="bg-cyan-500 h-2.5 rounded-full" style={{ width: `${biometricProgress}%` }}></div></div>}
                <p className="text-gray-300 mt-2 text-md">{['verifying', 'quantum_sync', 'ai_negotiating'].includes(scanState) ? verificationMessages[verificationStep] : `Sending $${amount} to ${recipientName}`}</p>
            </div>
            <style>{`.bg-grid-pattern-cyan{background-image:linear-gradient(rgba(0,255,255,0.3) 1px,transparent 1px),linear-gradient(90deg,rgba(0,255,255,0.3) 1px,transparent 1px);background-size:2.5rem 2.5rem}.animate-scan-holographic{animation:scan-holographic-effect 2.5s linear infinite; background-position: 0 0;}.animate-scanner-line{animation:scanner-line-move 2.5s ease-in-out infinite alternate}@keyframes scan-holographic-effect{0%{background-position:0 0}100%{background-position:0 -5rem}}@keyframes scanner-line-move{0%{transform:translate(-50%, 0) scaleX(0.2); opacity: 0;}20%{transform:translate(-50%, 25%) scaleX(1); opacity: 1;}80%{transform:translate(-50%, 75%) scaleX(1); opacity: 1;}100%{transform:translate(-50%, 100%) scaleX(0.2); opacity: 0;}}`}</style>
        </div>
    );
};

// ================================================================================================
// REMITRAX MAIN VIEW COMPONENT
// ================================================================================================

const SendMoneyView: React.FC<SendMoneyViewProps> = ({ setActiveView }) => {
    const context = useContext(DataContext);
    if (!context) throw new Error("SendMoneyView must be used within a DataProvider");
    const { addTransaction } = context;

    const [amount, setAmount] = useState('');
    const [recipientName, setRecipientName] = useState('');
    const [paymentMethod, setPaymentMethod] = useState<PaymentRail>('quantumpay');
    const [showBiometricModal, setShowBiometricModal] = useState(false);
    const [securityAudit, setSecurityAudit] = useState<SecurityAuditResult | null>(null);
    const [currentStep, setCurrentStep] = useState(1); // 1: Input, 2: Review, 3: Processing

    useEffect(() => {
        // Simulate security audit when amount or recipient changes
        const auditTimeout = setTimeout(() => {
            if (parseFloat(amount) > 0 && recipientName) {
                setSecurityAudit({
                    riskScore: parseFloat(amount) > 5000 ? 60 : 10,
                    fraudProbability: 0.05,
                    amlCompliance: 'pass',
                    sanctionScreening: 'pass',
                    quantumSignatureIntegrity: 'verified',
                    recommendations: parseFloat(amount) > 5000 ? ["High value. Verify recipient."] : [],
                    complianceAlerts: [],
                    threatVectorAnalysis: []
                });
            }
        }, 800);
        return () => clearTimeout(auditTimeout);
    }, [amount, recipientName]);

    const handleSendClick = () => {
        if (currentStep === 1) setCurrentStep(2);
        else if (currentStep === 2) setShowBiometricModal(true);
    };

    const handleSuccess = () => {
        const newTx: Transaction = {
            id: `tx_${Date.now()}`,
            type: 'expense',
            category: 'Transfer',
            description: `Sent to ${recipientName} via ${paymentMethod}`,
            amount: parseFloat(amount),
            date: new Date().toISOString().split('T')[0],
            carbonFootprint: 0.5
        };
        addTransaction(newTx);
        setShowBiometricModal(false);
        setCurrentStep(1);
        setAmount('');
        setRecipientName('');
        alert("Transfer Successful!");
    };

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold text-white tracking-wider">Remitrax: Quantum Secure Payments</h2>
            <Card title={currentStep === 1 ? "Initiate Transfer" : "Review Transaction"}>
                <div className="space-y-4">
                    {currentStep === 1 ? (
                        <>
                            <div>
                                <label className="block text-sm font-medium text-gray-400">Recipient</label>
                                <input type="text" value={recipientName} onChange={e => setRecipientName(e.target.value)} className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-white" placeholder="Name, @tag, or ID" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-400">Amount</label>
                                <input type="number" value={amount} onChange={e => setAmount(e.target.value)} className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-white" placeholder="0.00" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-400">Rail</label>
                                <select value={paymentMethod} onChange={e => setPaymentMethod(e.target.value as PaymentRail)} className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-white">
                                    <option value="quantumpay">QuantumPay (Instant DLT)</option>
                                    <option value="cashapp">Cash App</option>
                                    <option value="swift_global">SWIFT Global</option>
                                    <option value="blockchain_dlt">Blockchain DLT</option>
                                </select>
                            </div>
                            <SecurityAuditDisplay auditResult={securityAudit} />
                        </>
                    ) : (
                        <div className="space-y-2 text-gray-300">
                            <p><strong>To:</strong> {recipientName}</p>
                            <p><strong>Amount:</strong> ${amount}</p>
                            <p><strong>Method:</strong> {paymentMethod}</p>
                            <p className="text-sm text-yellow-400">Estimated Time: Instant (Quantum)</p>
                        </div>
                    )}
                    
                    <div className="flex justify-end gap-3 mt-6">
                         {currentStep === 2 && <button onClick={() => setCurrentStep(1)} className="px-4 py-2 bg-gray-600 rounded text-white">Back</button>}
                         <button onClick={handleSendClick} disabled={!amount || !recipientName} className="px-6 py-2 bg-cyan-600 hover:bg-cyan-500 rounded text-white font-bold disabled:opacity-50">
                            {currentStep === 1 ? "Review" : "Confirm & Send"}
                         </button>
                    </div>
                </div>
            </Card>
            <BiometricModal isOpen={showBiometricModal} onSuccess={handleSuccess} onClose={() => setShowBiometricModal(false)} amount={amount} recipient={recipientName} paymentMethod={paymentMethod} securityContext="personal" />
        </div>
    );
};

export default SendMoneyView;