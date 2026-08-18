// REPOSITORY SOURCE: diplomat-bit/aibanking.dev-jocall3-new | PATH: diplomat-bit-aibanking.dev-jocall3-new-84d7a30/components/MoneyMovementProvider.tsx
================================================================================


export * from './MoneyMovementContext';
export interface Payee { payeeId: string; payeeName: string; payeeNickname: string; paymentType: string; displayAccountNumber: string; }
export interface PayeeListResponse { payeeList: Payee[] }
export interface PayeeDetailsResponse { internalDomesticPayee?: any }
      

================================================================================
// APPENDED FROM REPO: diplomat-bit/almost | ORIGINAL PATH: diplomat-bit-almost-93a5466/components/MoneyMovementProvider.tsx
================================================================================

import React, { createContext, useContext, useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { GoogleGenAI } from "@google/genai";
import { 
    Transaction, 
    PaymentOrder, 
    Invoice, 
    ComplianceCase, 
    AuditLogEntry, 
    Notification 
} from '../types';

// ============================================================================
// 1. LEGACY EXPORTS & COMPATIBILITY LAYERS
// ============================================================================
// Ensuring backward compatibility while upgrading the engine to Quantum standards.

export interface Payee { 
    payeeId: string; 
    payeeName: string; 
    payeeNickname: string; 
    paymentType: string; 
    displayAccountNumber: string; 
    bankName?: string;
    swiftCode?: string;
    routingNumber?: string;
    riskScore?: number;
}

export interface PayeeListResponse { 
    payeeList: Payee[] 
}

export interface PayeeDetailsResponse { 
    internalDomesticPayee?: any 
}

// ============================================================================
// 2. QUANTUM FINANCIAL TYPES & INTERFACES
// ============================================================================

export type PaymentMethod = 'WIRE' | 'ACH' | 'RTP' | 'SWIFT' | 'BLOCKCHAIN';
export type ApprovalStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'FLAGGED_FOR_REVIEW';

export interface PaymentRequest {
    id: string;
    amount: number;
    currency: string;
    payeeId: string;
    method: PaymentMethod;
    memo: string;
    scheduledDate?: string;
    tags?: string[];
}

export interface SecurityContext {
    ipAddress: string;
    deviceId: string;
    sessionRiskScore: number;
    mfaVerified: boolean;
    biometricToken?: string;
}

export interface AIChatMessage {
    id: string;
    role: 'user' | 'model' | 'system';
    content: string;
    timestamp: number;
    metadata?: any;
}

export interface MoneyMovementContextType {
    // Core Payment Operations
    initiatePayment: (request: Omit<PaymentRequest, 'id'>) => Promise<string>;
    approvePayment: (paymentId: string) => Promise<void>;
    cancelPayment: (paymentId: string) => Promise<void>;
    
    // Data Access
    payees: Payee[];
    addPayee: (payee: Omit<Payee, 'payeeId'>) => Promise<void>;
    paymentHistory: PaymentOrder[];
    pendingApprovals: PaymentOrder[];
    
    // Intelligence & Security
    auditLogs: AuditLogEntry[];
    securityContext: SecurityContext;
    simulateSecurityEvent: (type: 'FRAUD_ATTEMPT' | 'LOGIN_NEW_DEVICE') => void;
    
    // AI Interaction
    chatHistory: AIChatMessage[];
    sendChatMessage: (message: string) => Promise<void>;
    isAITyping: boolean;
    toggleAIChat: () => void;
    isAIChatOpen: boolean;
    
    // UI State for "Pop Up Forms"
    activeModal: string | null;
    closeModal: () => void;
    openPaymentModal: () => void;
}

// ============================================================================
// 3. CONTEXT DEFINITION
// ============================================================================

export const MoneyMovementContext = createContext<MoneyMovementContextType | undefined>(undefined);

export const useMoneyMovement = () => {
    const context = useContext(MoneyMovementContext);
    if (!context) {
        throw new Error('useMoneyMovement must be used within a MoneyMovementProvider');
    }
    return context;
};

// ============================================================================
// 4. MOCK DATA & CONFIGURATION
// ============================================================================

const INITIAL_PAYEES: Payee[] = [
    { payeeId: 'p-001', payeeName: 'Acme Corp Global', payeeNickname: 'Acme HQ', paymentType: 'WIRE', displayAccountNumber: '****9921', bankName: 'Chase Manhattan', swiftCode: 'CHASUS33', riskScore: 12 },
    { payeeId: 'p-002', payeeName: 'Stark Industries', payeeNickname: 'R&D Fund', paymentType: 'ACH', displayAccountNumber: '****1122', bankName: 'Quantum Bank', routingNumber: '021000021', riskScore: 5 },
    { payeeId: 'p-003', payeeName: 'Wayne Enterprises', payeeNickname: 'Logistics', paymentType: 'SWIFT', displayAccountNumber: '****8844', bankName: 'Gotham City Bank', swiftCode: 'GOTHUSNY', riskScore: 8 },
];

const SYSTEM_PROMPT = `
You are the "Quantum Financial AI Core", the central intelligence of a next-generation business banking platform.
Your goal is to demonstrate the power, security, and elegance of this "Golden Ticket" experience.
The user is "Test Driving" the car. They are kicking the tires.
You are helpful, professional, elite, and slightly futuristic.
NEVER use the name "Citibank". Refer to the bank as "Quantum Financial" or "The Demo Bank".
If the user asks about the demo, explain that this is a comprehensive guide to business banking services, designed to streamline operations and enhance security.
You have access to the user's financial context. You can draft payments, analyze fraud, and explain features.
When you perform an action, describe it like a high-performance engine roaring to life.
`;

// ============================================================================
// 5. PROVIDER IMPLEMENTATION
// ============================================================================

export const MoneyMovementProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    // --- State Management ---
    const [payees, setPayees] = useState<Payee[]>(INITIAL_PAYEES);
    const [paymentHistory, setPaymentHistory] = useState<PaymentOrder[]>([]);
    const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([]);
    const [chatHistory, setChatHistory] = useState<AIChatMessage[]>([
        { id: 'msg-0', role: 'model', content: "Welcome to Quantum Financial. I am your dedicated AI Core. How can I assist with your capital allocation today?", timestamp: Date.now() }
    ]);
    const [isAITyping, setIsAITyping] = useState(false);
    const [isAIChatOpen, setIsAIChatOpen] = useState(false);
    const [activeModal, setActiveModal] = useState<string | null>(null);
    
    // --- Security Simulation State ---
    const [securityContext, setSecurityContext] = useState<SecurityContext>({
        ipAddress: '192.168.1.1',
        deviceId: 'DEV-SECURE-01',
        sessionRiskScore: 0,
        mfaVerified: true,
        biometricToken: 'BIO-SHA256-VALID'
    });

    // --- AI Client Initialization ---
    const aiClient = useMemo(() => {
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            console.warn("Quantum Core: GEMINI_API_KEY missing. AI features running in simulation mode.");
            return null;
        }
        return new GoogleGenAI({ apiKey });
    }, []);

    // --- Audit Logging System ---
    const logAudit = useCallback((action: string, resource: string, success: boolean, metadata?: any) => {
        const entry: AuditLogEntry = {
            id: `AUD-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
            timestamp: new Date().toISOString(),
            userId: 'USR-77-X-ALPHA',
            action,
            targetResource: resource,
            success
        };
        setAuditLogs(prev => [entry, ...prev]);
        console.log(`[AUDIT] ${action}:`, metadata);
    }, []);

    // --- AI Interaction Logic ---
    const sendChatMessage = useCallback(async (message: string) => {
        const userMsg: AIChatMessage = { id: `msg-${Date.now()}`, role: 'user', content: message, timestamp: Date.now() };
        setChatHistory(prev => [...prev, userMsg]);
        setIsAITyping(true);

        try {
            let responseText = "";
            
            if (aiClient) {
                const model = aiClient.models.getVertexModel('gemini-1.5-flash-preview'); // Using a fast model for chat
                // Construct context from recent history
                const historyContext = chatHistory.slice(-5).map(m => `${m.role}: ${m.content}`).join('\n');
                const prompt = `${SYSTEM_PROMPT}\n\nCurrent Context:\n${historyContext}\nUser: ${message}\nAI:`;
                
                const result = await aiClient.models.generateContent({
                    model: 'gemini-1.5-flash',
                    contents: [{ role: 'user', parts: [{ text: prompt }] }]
                });
                
                responseText = result.response.text();
            } else {
                // Fallback simulation
                await new Promise(r => setTimeout(r, 1500));
                responseText = "I am currently operating in offline mode. However, I can confirm your secure connection to the Quantum Nexus is active.";
            }

            const aiMsg: AIChatMessage = { id: `msg-${Date.now() + 1}`, role: 'model', content: responseText, timestamp: Date.now() };
            setChatHistory(prev => [...prev, aiMsg]);
        } catch (error) {
            console.error("AI Error:", error);
            const errorMsg: AIChatMessage = { id: `msg-${Date.now() + 1}`, role: 'model', content: "I encountered a momentary disruption in the neural link. Please try again.", timestamp: Date.now() };
            setChatHistory(prev => [...prev, errorMsg]);
        } finally {
            setIsAITyping(false);
        }
    }, [aiClient, chatHistory]);

    // --- Payment Logic ---
    const initiatePayment = useCallback(async (request: Omit<PaymentRequest, 'id'>) => {
        logAudit('PAYMENT_INITIATION_ATTEMPT', `PAYEE:${request.payeeId}`, true, request);
        
        // Simulate processing delay for "Engine Roar" effect
        await new Promise(r => setTimeout(r, 1200));

        // Fraud Check Simulation
        const fraudScore = Math.random() * 100;
        if (fraudScore > 95) {
            logAudit('FRAUD_BLOCK', `PAYEE:${request.payeeId}`, false, { reason: 'High Risk Score', score: fraudScore });
            throw new Error("Security Protocol Alpha: Transaction flagged for unusual activity.");
        }

        const newPayment: PaymentOrder = {
            id: `PO-${Date.now()}`,
            counterpartyId: request.payeeId,
            counterpartyName: payees.find(p => p.payeeId === request.payeeId)?.payeeName || 'Unknown',
            accountId: 'ACC-PRIMARY-01',
            amount: request.amount,
            currency: request.currency,
            direction: 'OUTBOUND',
            status: 'PENDING_APPROVAL',
            date: new Date().toISOString(),
            type: request.method
        };

        setPaymentHistory(prev => [newPayment, ...prev]);
        logAudit('PAYMENT_CREATED', newPayment.id, true, newPayment);
        
        // Trigger AI comment
        if (aiClient) {
            sendChatMessage(`I've drafted a ${request.method} payment of ${request.currency} ${request.amount} to ${newPayment.counterpartyName}. It is currently pending approval. Shall I run a pre-flight compliance check?`);
        }

        return newPayment.id;
    }, [payees, logAudit, aiClient, sendChatMessage]);

    const approvePayment = useCallback(async (paymentId: string) => {
        // Simulate MFA Challenge
        const mfaSuccess = true; // In a real app, this would trigger a UI flow
        if (!mfaSuccess) throw new Error("MFA Verification Failed");

        setPaymentHistory(prev => prev.map(p => p.id === paymentId ? { ...p, status: 'COMPLETED' } : p));
        logAudit('PAYMENT_APPROVAL', paymentId, true, { approver: 'USR-77-X-ALPHA' });
    }, [logAudit]);

    const cancelPayment = useCallback(async (paymentId: string) => {
        setPaymentHistory(prev => prev.map(p => p.id === paymentId ? { ...p, status: 'CANCELLED' } : p));
        logAudit('PAYMENT_CANCELLATION', paymentId, true);
    }, [logAudit]);

    const addPayee = useCallback(async (payee: Omit<Payee, 'payeeId'>) => {
        const newPayee = { ...payee, payeeId: `p-${Date.now()}` };
        setPayees(prev => [...prev, newPayee]);
        logAudit('PAYEE_ADDED', newPayee.payeeId, true, payee);
    }, [logAudit]);

    const simulateSecurityEvent = useCallback((type: 'FRAUD_ATTEMPT' | 'LOGIN_NEW_DEVICE') => {
        if (type === 'FRAUD_ATTEMPT') {
            setSecurityContext(prev => ({ ...prev, sessionRiskScore: 90 }));
            logAudit('SECURITY_ALERT', 'SESSION', true, { type, severity: 'CRITICAL' });
            sendChatMessage("ALERT: I have detected an anomaly in the transaction pattern. I have elevated security protocols to Level 4. Please verify your identity.");
        }
    }, [logAudit, sendChatMessage]);

    // --- UI Helpers ---
    const toggleAIChat = () => setIsAIChatOpen(prev => !prev);
    const closeModal = () => setActiveModal(null);
    const openPaymentModal = () => setActiveModal('PAYMENT_FORM');

    // --- Derived State ---
    const pendingApprovals = useMemo(() => paymentHistory.filter(p => p.status === 'PENDING_APPROVAL'), [paymentHistory]);

    // ========================================================================
    // 6. RENDER & UI COMPONENTS (The "Bells and Whistles")
    // ========================================================================

    return (
        <MoneyMovementContext.Provider value={{
            initiatePayment,
            approvePayment,
            cancelPayment,
            payees,
            addPayee,
            paymentHistory,
            pendingApprovals,
            auditLogs,
            securityContext,
            simulateSecurityEvent,
            chatHistory,
            sendChatMessage,
            isAITyping,
            toggleAIChat,
            isAIChatOpen,
            activeModal,
            closeModal,
            openPaymentModal
        }}>
            {children}

            {/* --- QUANTUM AI CHAT OVERLAY --- */}
            <div className={`fixed bottom-6 right-6 z-50 transition-all duration-500 ease-in-out ${isAIChatOpen ? 'w-96 h-[600px]' : 'w-16 h-16'}`}>
                {isAIChatOpen ? (
                    <div className="flex flex-col h-full bg-gray-900/95 backdrop-blur-xl border border-cyan-500/30 rounded-2xl shadow-2xl shadow-cyan-500/20 overflow-hidden font-sans">
                        {/* Header */}
                        <div className="flex items-center justify-between p-4 border-b border-gray-800 bg-gradient-to-r from-gray-900 to-gray-800">
                            <div className="flex items-center space-x-3">
                                <div className="w-3 h-3 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_10px_rgba(34,211,238,0.8)]"></div>
                                <span className="text-cyan-100 font-semibold tracking-wide text-sm">QUANTUM CORE</span>
                            </div>
                            <button onClick={toggleAIChat} className="text-gray-400 hover:text-white transition-colors">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>

                        {/* Chat Area */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
                            {chatHistory.map((msg) => (
                                <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[85%] p-3 rounded-2xl text-sm leading-relaxed ${
                                        msg.role === 'user' 
                                            ? 'bg-cyan-600/20 text-cyan-50 border border-cyan-500/30 rounded-tr-none' 
                                            : 'bg-gray-800/50 text-gray-200 border border-gray-700 rounded-tl-none'
                                    }`}>
                                        {msg.content}
                                    </div>
                                </div>
                            ))}
                            {isAITyping && (
                                <div className="flex justify-start">
                                    <div className="bg-gray-800/50 p-3 rounded-2xl rounded-tl-none border border-gray-700 flex space-x-1">
                                        <div className="w-2 h-2 bg-cyan-500/50 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                                        <div className="w-2 h-2 bg-cyan-500/50 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                                        <div className="w-2 h-2 bg-cyan-500/50 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Input Area */}
                        <div className="p-4 border-t border-gray-800 bg-gray-900/50">
                            <form 
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    const input = (e.target as any).elements.message;
                                    if (input.value.trim()) {
                                        sendChatMessage(input.value);
                                        input.value = '';
                                    }
                                }}
                                className="relative"
                            >
                                <input 
                                    name="message"
                                    type="text" 
                                    placeholder="Ask Quantum Core..." 
                                    className="w-full bg-gray-800 text-white placeholder-gray-500 rounded-xl py-3 pl-4 pr-12 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 border border-gray-700 transition-all"
                                />
                                <button type="submit" className="absolute right-2 top-2 p-1.5 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 rounded-lg transition-colors">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
                                </button>
                            </form>
                        </div>
                    </div>
                ) : (
                    <button 
                        onClick={toggleAIChat}
                        className="w-full h-full rounded-full bg-gradient-to-br from-cyan-600 to-blue-700 shadow-lg shadow-cyan-500/30 flex items-center justify-center hover:scale-110 transition-transform duration-300 group"
                    >
                        <svg className="w-8 h-8 text-white group-hover:rotate-12 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                        <span className="absolute -top-2 -right-2 w-4 h-4 bg-red-500 rounded-full border-2 border-gray-900 animate-pulse"></span>
                    </button>
                )}
            </div>

            {/* --- POP UP FORM MODAL (The "PO up form") --- */}
            {activeModal === 'PAYMENT_FORM' && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
                    <div className="bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
                        <div className="p-6 border-b border-gray-800 flex justify-between items-center bg-gradient-to-r from-gray-900 to-gray-800">
                            <div>
                                <h2 className="text-xl font-bold text-white">Initiate Capital Transfer</h2>
                                <p className="text-xs text-cyan-400 mt-1">SECURE CHANNEL // ENCRYPTED</p>
                            </div>
                            <button onClick={closeModal} className="text-gray-400 hover:text-white">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>
                        <div className="p-8 space-y-6">
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">Beneficiary</label>
                                    <select className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent">
                                        {payees.map(p => <option key={p.payeeId} value={p.payeeId}>{p.payeeName}</option>)}
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">Amount</label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-3 text-gray-500">$</span>
                                        <input type="number" className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 pl-8 text-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent" placeholder="0.00" />
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">Payment Rail</label>
                                <div className="grid grid-cols-3 gap-3">
                                    {['WIRE', 'ACH', 'RTP'].map(rail => (
                                        <button key={rail} className="p-3 border border-gray-700 rounded-lg hover:bg-gray-800 hover:border-cyan-500/50 transition-all text-sm font-medium text-gray-300 hover:text-cyan-400">
                                            {rail}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div className="bg-blue-900/20 border border-blue-500/20 rounded-lg p-4 flex items-start space-x-3">
                                <svg className="w-5 h-5 text-blue-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                <p className="text-sm text-blue-200">
                                    AI Analysis: This transaction fits your typical spending pattern. Fraud risk is low (0.4%).
                                </p>
                            </div>
                        </div>
                        <div className="p-6 border-t border-gray-800 bg-gray-900/50 flex justify-end space-x-4">
                            <button onClick={closeModal} className="px-6 py-2 text-gray-400 hover:text-white transition-colors">Cancel</button>
                            <button 
                                onClick={() => {
                                    initiatePayment({ amount: 5000, currency: 'USD', payeeId: payees[0].payeeId, method: 'WIRE', memo: 'Demo Transfer' });
                                    closeModal();
                                    sendChatMessage("I have successfully queued the wire transfer for $5,000.00. It is awaiting your final approval in the dashboard.");
                                }}
                                className="px-6 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg font-medium shadow-lg shadow-cyan-500/20 transition-all transform hover:scale-105"
                            >
                                Execute Transfer
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </MoneyMovementContext.Provider>
    );
};

================================================================================
// APPENDED FROM REPO: diplomat-bit/Fuckyou | ORIGINAL PATH: diplomat-bit-Fuckyou-70f83c5/components/MoneyMovementProvider.tsx
================================================================================

import React, { createContext, useContext, useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { GoogleGenAI } from "@google/genai";
import { 
    Transaction, 
    PaymentOrder, 
    Invoice, 
    ComplianceCase, 
    AuditLogEntry, 
    Notification 
} from '../types';

// ============================================================================
// 1. LEGACY EXPORTS & COMPATIBILITY LAYERS
// ============================================================================
// Ensuring backward compatibility while upgrading the engine to Quantum standards.

export interface Payee { 
    payeeId: string; 
    payeeName: string; 
    payeeNickname: string; 
    paymentType: string; 
    displayAccountNumber: string; 
    bankName?: string;
    swiftCode?: string;
    routingNumber?: string;
    riskScore?: number;
}

export interface PayeeListResponse { 
    payeeList: Payee[] 
}

export interface PayeeDetailsResponse { 
    internalDomesticPayee?: any 
}

// ============================================================================
// 2. QUANTUM FINANCIAL TYPES & INTERFACES
// ============================================================================

export type PaymentMethod = 'WIRE' | 'ACH' | 'RTP' | 'SWIFT' | 'BLOCKCHAIN';
export type ApprovalStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'FLAGGED_FOR_REVIEW';

export interface PaymentRequest {
    id: string;
    amount: number;
    currency: string;
    payeeId: string;
    method: PaymentMethod;
    memo: string;
    scheduledDate?: string;
    tags?: string[];
}

export interface SecurityContext {
    ipAddress: string;
    deviceId: string;
    sessionRiskScore: number;
    mfaVerified: boolean;
    biometricToken?: string;
}

export interface AIChatMessage {
    id: string;
    role: 'user' | 'model' | 'system';
    content: string;
    timestamp: number;
    metadata?: any;
}

export interface MoneyMovementContextType {
    // Core Payment Operations
    initiatePayment: (request: Omit<PaymentRequest, 'id'>) => Promise<string>;
    approvePayment: (paymentId: string) => Promise<void>;
    cancelPayment: (paymentId: string) => Promise<void>;
    
    // Data Access
    payees: Payee[];
    addPayee: (payee: Omit<Payee, 'payeeId'>) => Promise<void>;
    paymentHistory: PaymentOrder[];
    pendingApprovals: PaymentOrder[];
    
    // Intelligence & Security
    auditLogs: AuditLogEntry[];
    securityContext: SecurityContext;
    simulateSecurityEvent: (type: 'FRAUD_ATTEMPT' | 'LOGIN_NEW_DEVICE') => void;
    
    // AI Interaction
    chatHistory: AIChatMessage[];
    sendChatMessage: (message: string) => Promise<void>;
    isAITyping: boolean;
    toggleAIChat: () => void;
    isAIChatOpen: boolean;
    
    // UI State for "Pop Up Forms"
    activeModal: string | null;
    closeModal: () => void;
    openPaymentModal: () => void;
}

// ============================================================================
// 3. CONTEXT DEFINITION
// ============================================================================

export const MoneyMovementContext = createContext<MoneyMovementContextType | undefined>(undefined);

export const useMoneyMovement = () => {
    const context = useContext(MoneyMovementContext);
    if (!context) {
        throw new Error('useMoneyMovement must be used within a MoneyMovementProvider');
    }
    return context;
};

// ============================================================================
// 4. MOCK DATA & CONFIGURATION
// ============================================================================

const INITIAL_PAYEES: Payee[] = [
    { payeeId: 'p-001', payeeName: 'Acme Corp Global', payeeNickname: 'Acme HQ', paymentType: 'WIRE', displayAccountNumber: '****9921', bankName: 'Chase Manhattan', swiftCode: 'CHASUS33', riskScore: 12 },
    { payeeId: 'p-002', payeeName: 'Stark Industries', payeeNickname: 'R&D Fund', paymentType: 'ACH', displayAccountNumber: '****1122', bankName: 'Quantum Bank', routingNumber: '021000021', riskScore: 5 },
    { payeeId: 'p-003', payeeName: 'Wayne Enterprises', payeeNickname: 'Logistics', paymentType: 'SWIFT', displayAccountNumber: '****8844', bankName: 'Gotham City Bank', swiftCode: 'GOTHUSNY', riskScore: 8 },
];

const SYSTEM_PROMPT = `
You are the "Quantum Financial AI Core", the central intelligence of a next-generation business banking platform.
Your goal is to demonstrate the power, security, and elegance of this "Golden Ticket" experience.
The user is "Test Driving" the car. They are kicking the tires.
You are helpful, professional, elite, and slightly futuristic.
NEVER use the name "Citibank". Refer to the bank as "Quantum Financial" or "The Demo Bank".
If the user asks about the demo, explain that this is a comprehensive guide to business banking services, designed to streamline operations and enhance security.
You have access to the user's financial context. You can draft payments, analyze fraud, and explain features.
When you perform an action, describe it like a high-performance engine roaring to life.
`;

// ============================================================================
// 5. PROVIDER IMPLEMENTATION
// ============================================================================

export const MoneyMovementProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    // --- State Management ---
    const [payees, setPayees] = useState<Payee[]>(INITIAL_PAYEES);
    const [paymentHistory, setPaymentHistory] = useState<PaymentOrder[]>([]);
    const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([]);
    const [chatHistory, setChatHistory] = useState<AIChatMessage[]>([
        { id: 'msg-0', role: 'model', content: "Welcome to Quantum Financial. I am your dedicated AI Core. How can I assist with your capital allocation today?", timestamp: Date.now() }
    ]);
    const [isAITyping, setIsAITyping] = useState(false);
    const [isAIChatOpen, setIsAIChatOpen] = useState(false);
    const [activeModal, setActiveModal] = useState<string | null>(null);
    
    // --- Security Simulation State ---
    const [securityContext, setSecurityContext] = useState<SecurityContext>({
        ipAddress: '192.168.1.1',
        deviceId: 'DEV-SECURE-01',
        sessionRiskScore: 0,
        mfaVerified: true,
        biometricToken: 'BIO-SHA256-VALID'
    });

    // --- AI Client Initialization ---
    const aiClient = useMemo(() => {
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            console.warn("Quantum Core: GEMINI_API_KEY missing. AI features running in simulation mode.");
            return null;
        }
        return new GoogleGenAI({ apiKey });
    }, []);

    // --- Audit Logging System ---
    const logAudit = useCallback((action: string, resource: string, success: boolean, metadata?: any) => {
        const entry: AuditLogEntry = {
            id: `AUD-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
            timestamp: new Date().toISOString(),
            userId: 'USR-77-X-ALPHA',
            action,
            targetResource: resource,
            success
        };
        setAuditLogs(prev => [entry, ...prev]);
        console.log(`[AUDIT] ${action}:`, metadata);
    }, []);

    // --- AI Interaction Logic ---
    const sendChatMessage = useCallback(async (message: string) => {
        const userMsg: AIChatMessage = { id: `msg-${Date.now()}`, role: 'user', content: message, timestamp: Date.now() };
        setChatHistory(prev => [...prev, userMsg]);
        setIsAITyping(true);

        try {
            let responseText = "";
            
            if (aiClient) {
                const model = aiClient.models.getVertexModel('gemini-1.5-flash-preview'); // Using a fast model for chat
                // Construct context from recent history
                const historyContext = chatHistory.slice(-5).map(m => `${m.role}: ${m.content}`).join('\n');
                const prompt = `${SYSTEM_PROMPT}\n\nCurrent Context:\n${historyContext}\nUser: ${message}\nAI:`;
                
                const result = await aiClient.models.generateContent({
                    model: 'gemini-1.5-flash',
                    contents: [{ role: 'user', parts: [{ text: prompt }] }]
                });
                
                responseText = result.response.text();
            } else {
                // Fallback simulation
                await new Promise(r => setTimeout(r, 1500));
                responseText = "I am currently operating in offline mode. However, I can confirm your secure connection to the Quantum Nexus is active.";
            }

            const aiMsg: AIChatMessage = { id: `msg-${Date.now() + 1}`, role: 'model', content: responseText, timestamp: Date.now() };
            setChatHistory(prev => [...prev, aiMsg]);
        } catch (error) {
            console.error("AI Error:", error);
            const errorMsg: AIChatMessage = { id: `msg-${Date.now() + 1}`, role: 'model', content: "I encountered a momentary disruption in the neural link. Please try again.", timestamp: Date.now() };
            setChatHistory(prev => [...prev, errorMsg]);
        } finally {
            setIsAITyping(false);
        }
    }, [aiClient, chatHistory]);

    // --- Payment Logic ---
    const initiatePayment = useCallback(async (request: Omit<PaymentRequest, 'id'>) => {
        logAudit('PAYMENT_INITIATION_ATTEMPT', `PAYEE:${request.payeeId}`, true, request);
        
        // Simulate processing delay for "Engine Roar" effect
        await new Promise(r => setTimeout(r, 1200));

        // Fraud Check Simulation
        const fraudScore = Math.random() * 100;
        if (fraudScore > 95) {
            logAudit('FRAUD_BLOCK', `PAYEE:${request.payeeId}`, false, { reason: 'High Risk Score', score: fraudScore });
            throw new Error("Security Protocol Alpha: Transaction flagged for unusual activity.");
        }

        const newPayment: PaymentOrder = {
            id: `PO-${Date.now()}`,
            counterpartyId: request.payeeId,
            counterpartyName: payees.find(p => p.payeeId === request.payeeId)?.payeeName || 'Unknown',
            accountId: 'ACC-PRIMARY-01',
            amount: request.amount,
            currency: request.currency,
            direction: 'OUTBOUND',
            status: 'PENDING_APPROVAL',
            date: new Date().toISOString(),
            type: request.method
        };

        setPaymentHistory(prev => [newPayment, ...prev]);
        logAudit('PAYMENT_CREATED', newPayment.id, true, newPayment);
        
        // Trigger AI comment
        if (aiClient) {
            sendChatMessage(`I've drafted a ${request.method} payment of ${request.currency} ${request.amount} to ${newPayment.counterpartyName}. It is currently pending approval. Shall I run a pre-flight compliance check?`);
        }

        return newPayment.id;
    }, [payees, logAudit, aiClient, sendChatMessage]);

    const approvePayment = useCallback(async (paymentId: string) => {
        // Simulate MFA Challenge
        const mfaSuccess = true; // In a real app, this would trigger a UI flow
        if (!mfaSuccess) throw new Error("MFA Verification Failed");

        setPaymentHistory(prev => prev.map(p => p.id === paymentId ? { ...p, status: 'COMPLETED' } : p));
        logAudit('PAYMENT_APPROVAL', paymentId, true, { approver: 'USR-77-X-ALPHA' });
    }, [logAudit]);

    const cancelPayment = useCallback(async (paymentId: string) => {
        setPaymentHistory(prev => prev.map(p => p.id === paymentId ? { ...p, status: 'CANCELLED' } : p));
        logAudit('PAYMENT_CANCELLATION', paymentId, true);
    }, [logAudit]);

    const addPayee = useCallback(async (payee: Omit<Payee, 'payeeId'>) => {
        const newPayee = { ...payee, payeeId: `p-${Date.now()}` };
        setPayees(prev => [...prev, newPayee]);
        logAudit('PAYEE_ADDED', newPayee.payeeId, true, payee);
    }, [logAudit]);

    const simulateSecurityEvent = useCallback((type: 'FRAUD_ATTEMPT' | 'LOGIN_NEW_DEVICE') => {
        if (type === 'FRAUD_ATTEMPT') {
            setSecurityContext(prev => ({ ...prev, sessionRiskScore: 90 }));
            logAudit('SECURITY_ALERT', 'SESSION', true, { type, severity: 'CRITICAL' });
            sendChatMessage("ALERT: I have detected an anomaly in the transaction pattern. I have elevated security protocols to Level 4. Please verify your identity.");
        }
    }, [logAudit, sendChatMessage]);

    // --- UI Helpers ---
    const toggleAIChat = () => setIsAIChatOpen(prev => !prev);
    const closeModal = () => setActiveModal(null);
    const openPaymentModal = () => setActiveModal('PAYMENT_FORM');

    // --- Derived State ---
    const pendingApprovals = useMemo(() => paymentHistory.filter(p => p.status === 'PENDING_APPROVAL'), [paymentHistory]);

    // ========================================================================
    // 6. RENDER & UI COMPONENTS (The "Bells and Whistles")
    // ========================================================================

    return (
        <MoneyMovementContext.Provider value={{
            initiatePayment,
            approvePayment,
            cancelPayment,
            payees,
            addPayee,
            paymentHistory,
            pendingApprovals,
            auditLogs,
            securityContext,
            simulateSecurityEvent,
            chatHistory,
            sendChatMessage,
            isAITyping,
            toggleAIChat,
            isAIChatOpen,
            activeModal,
            closeModal,
            openPaymentModal
        }}>
            {children}

            {/* --- QUANTUM AI CHAT OVERLAY --- */}
            <div className={`fixed bottom-6 right-6 z-50 transition-all duration-500 ease-in-out ${isAIChatOpen ? 'w-96 h-[600px]' : 'w-16 h-16'}`}>
                {isAIChatOpen ? (
                    <div className="flex flex-col h-full bg-gray-900/95 backdrop-blur-xl border border-cyan-500/30 rounded-2xl shadow-2xl shadow-cyan-500/20 overflow-hidden font-sans">
                        {/* Header */}
                        <div className="flex items-center justify-between p-4 border-b border-gray-800 bg-gradient-to-r from-gray-900 to-gray-800">
                            <div className="flex items-center space-x-3">
                                <div className="w-3 h-3 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_10px_rgba(34,211,238,0.8)]"></div>
                                <span className="text-cyan-100 font-semibold tracking-wide text-sm">QUANTUM CORE</span>
                            </div>
                            <button onClick={toggleAIChat} className="text-gray-400 hover:text-white transition-colors">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>

                        {/* Chat Area */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
                            {chatHistory.map((msg) => (
                                <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[85%] p-3 rounded-2xl text-sm leading-relaxed ${
                                        msg.role === 'user' 
                                            ? 'bg-cyan-600/20 text-cyan-50 border border-cyan-500/30 rounded-tr-none' 
                                            : 'bg-gray-800/50 text-gray-200 border border-gray-700 rounded-tl-none'
                                    }`}>
                                        {msg.content}
                                    </div>
                                </div>
                            ))}
                            {isAITyping && (
                                <div className="flex justify-start">
                                    <div className="bg-gray-800/50 p-3 rounded-2xl rounded-tl-none border border-gray-700 flex space-x-1">
                                        <div className="w-2 h-2 bg-cyan-500/50 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                                        <div className="w-2 h-2 bg-cyan-500/50 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                                        <div className="w-2 h-2 bg-cyan-500/50 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Input Area */}
                        <div className="p-4 border-t border-gray-800 bg-gray-900/50">
                            <form 
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    const input = (e.target as any).elements.message;
                                    if (input.value.trim()) {
                                        sendChatMessage(input.value);
                                        input.value = '';
                                    }
                                }}
                                className="relative"
                            >
                                <input 
                                    name="message"
                                    type="text" 
                                    placeholder="Ask Quantum Core..." 
                                    className="w-full bg-gray-800 text-white placeholder-gray-500 rounded-xl py-3 pl-4 pr-12 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 border border-gray-700 transition-all"
                                />
                                <button type="submit" className="absolute right-2 top-2 p-1.5 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 rounded-lg transition-colors">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
                                </button>
                            </form>
                        </div>
                    </div>
                ) : (
                    <button 
                        onClick={toggleAIChat}
                        className="w-full h-full rounded-full bg-gradient-to-br from-cyan-600 to-blue-700 shadow-lg shadow-cyan-500/30 flex items-center justify-center hover:scale-110 transition-transform duration-300 group"
                    >
                        <svg className="w-8 h-8 text-white group-hover:rotate-12 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                        <span className="absolute -top-2 -right-2 w-4 h-4 bg-red-500 rounded-full border-2 border-gray-900 animate-pulse"></span>
                    </button>
                )}
            </div>

            {/* --- POP UP FORM MODAL (The "PO up form") --- */}
            {activeModal === 'PAYMENT_FORM' && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
                    <div className="bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
                        <div className="p-6 border-b border-gray-800 flex justify-between items-center bg-gradient-to-r from-gray-900 to-gray-800">
                            <div>
                                <h2 className="text-xl font-bold text-white">Initiate Capital Transfer</h2>
                                <p className="text-xs text-cyan-400 mt-1">SECURE CHANNEL // ENCRYPTED</p>
                            </div>
                            <button onClick={closeModal} className="text-gray-400 hover:text-white">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>
                        <div className="p-8 space-y-6">
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">Beneficiary</label>
                                    <select className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent">
                                        {payees.map(p => <option key={p.payeeId} value={p.payeeId}>{p.payeeName}</option>)}
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">Amount</label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-3 text-gray-500">$</span>
                                        <input type="number" className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 pl-8 text-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent" placeholder="0.00" />
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">Payment Rail</label>
                                <div className="grid grid-cols-3 gap-3">
                                    {['WIRE', 'ACH', 'RTP'].map(rail => (
                                        <button key={rail} className="p-3 border border-gray-700 rounded-lg hover:bg-gray-800 hover:border-cyan-500/50 transition-all text-sm font-medium text-gray-300 hover:text-cyan-400">
                                            {rail}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div className="bg-blue-900/20 border border-blue-500/20 rounded-lg p-4 flex items-start space-x-3">
                                <svg className="w-5 h-5 text-blue-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                <p className="text-sm text-blue-200">
                                    AI Analysis: This transaction fits your typical spending pattern. Fraud risk is low (0.4%).
                                </p>
                            </div>
                        </div>
                        <div className="p-6 border-t border-gray-800 bg-gray-900/50 flex justify-end space-x-4">
                            <button onClick={closeModal} className="px-6 py-2 text-gray-400 hover:text-white transition-colors">Cancel</button>
                            <button 
                                onClick={() => {
                                    initiatePayment({ amount: 5000, currency: 'USD', payeeId: payees[0].payeeId, method: 'WIRE', memo: 'Demo Transfer' });
                                    closeModal();
                                    sendChatMessage("I have successfully queued the wire transfer for $5,000.00. It is awaiting your final approval in the dashboard.");
                                }}
                                className="px-6 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg font-medium shadow-lg shadow-cyan-500/20 transition-all transform hover:scale-105"
                            >
                                Execute Transfer
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </MoneyMovementContext.Provider>
    );
};

================================================================================
// APPENDED FROM REPO: diplomat-bit/jamesburvelocallaghaniiiand | ORIGINAL PATH: diplomat-bit-jamesburvelocallaghaniiiand-9414e97/components/MoneyMovementProvider.tsx
================================================================================

```typescript
import React, { createContext, useContext, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

// ----------------------------------------------------------------------------------------------------
// The James Burvel O'Callaghan III Code - Money Movement Provider - Start
// ----------------------------------------------------------------------------------------------------

// ------------------------------
// Context Definition - A
// ------------------------------
export const A_MoneyMovementContext = createContext<{
  AA_payeeList: Payee[] | undefined;
  AB_getPayeeList: () => Promise<void>;
  AC_getPayeeDetails: (payeeId: string) => Promise<PayeeDetailsResponse | undefined>;
  AD_addPayee: (payee: Payee) => Promise<void>;
  AE_deletePayee: (payeeId: string) => Promise<void>;
  AF_updatePayee: (payee: Payee) => Promise<void>;
} | undefined>(undefined);

// ------------------------------
// Interfaces - B-F
// ------------------------------
export interface B_Payee {
    payeeId: string;
    payeeName: string;
    payeeNickname: string;
    paymentType: string;
    displayAccountNumber: string;
    payeeAddress?: string;
    payeePhoneNumber?: string;
    payeeEmail?: string;
    payeeBankName?: string;
    payeeRoutingNumber?: string;
    payeeAccountType?: string;
    payeeCurrency?: string;
    payeeStatus?: 'active' | 'inactive' | 'pending';
    payeeNotes?: string;
    payeeLastPaymentDate?: string;
    payeeTotalPayments?: number;
    payeeLastPaymentAmount?: number;
    payeePreferredPaymentMethod?: string;
    payeeInternalReference?: string;
}

export interface C_PayeeListResponse {
    payeeList: B_Payee[];
    totalPayees?: number;
    currentPage?: number;
    pageSize?: number;
    totalPages?: number;
}

export interface D_PayeeDetailsResponse {
    internalDomesticPayee?: any;
    payeeId?: string;
    payeeName?: string;
    payeeNickname?: string;
    paymentType?: string;
    displayAccountNumber?: string;
    payeeAddress?: string;
    payeePhoneNumber?: string;
    payeeEmail?: string;
    payeeBankName?: string;
    payeeRoutingNumber?: string;
    payeeAccountType?: string;
    payeeCurrency?: string;
    payeeStatus?: 'active' | 'inactive' | 'pending';
    payeeNotes?: string;
    payeeLastPaymentDate?: string;
    payeeTotalPayments?: number;
    payeeLastPaymentAmount?: number;
    payeePreferredPaymentMethod?: string;
    payeeInternalReference?: string;
}

export interface E_MoneyMovementProviderProps {
    children: React.ReactNode;
}

export interface F_MoneyMovementState {
    payeeList: B_Payee[] | undefined;
    isLoading: boolean;
    error: string | null;
}

// ------------------------------
// Mock API - G
// ------------------------------
const G_mockPayeeList: B_Payee[] = [
    { payeeId: uuidv4(), payeeName: 'Acme Corp', payeeNickname: 'Acme', paymentType: 'ACH', displayAccountNumber: '1234567890' },
    { payeeId: uuidv4(), payeeName: 'Beta Industries', payeeNickname: 'Beta', paymentType: 'Wire', displayAccountNumber: '0987654321' },
    { payeeId: uuidv4(), payeeName: 'Gamma Solutions', payeeNickname: 'Gamma', paymentType: 'Check', displayAccountNumber: '5555555555' },
    { payeeId: uuidv4(), payeeName: 'Delta Systems', payeeNickname: 'Delta', paymentType: 'ACH', displayAccountNumber: '1111222233' },
    { payeeId: uuidv4(), payeeName: 'Epsilon Group', payeeNickname: 'Epsilon', paymentType: 'Wire', displayAccountNumber: '4444555566' },
    { payeeId: uuidv4(), payeeName: 'Zeta Technologies', payeeNickname: 'Zeta', paymentType: 'Check', displayAccountNumber: '7777888899' },
    { payeeId: uuidv4(), payeeName: 'Eta Holdings', payeeNickname: 'Eta', paymentType: 'ACH', displayAccountNumber: '9999000011' },
    { payeeId: uuidv4(), payeeName: 'Theta Enterprises', payeeNickname: 'Theta', paymentType: 'Wire', displayAccountNumber: '2222333344' },
    { payeeId: uuidv4(), payeeName: 'Iota Innovations', payeeNickname: 'Iota', paymentType: 'Check', displayAccountNumber: '6666777788' },
    { payeeId: uuidv4(), payeeName: 'Kappa Dynamics', payeeNickname: 'Kappa', paymentType: 'ACH', displayAccountNumber: '3333444455' },
    { payeeId: uuidv4(), payeeName: 'Lambda Corp', payeeNickname: 'Lambda', paymentType: 'Wire', displayAccountNumber: '8888999900' },
    { payeeId: uuidv4(), payeeName: 'Mu Industries', payeeNickname: 'Mu', paymentType: 'Check', displayAccountNumber: '1122334455' },
    { payeeId: uuidv4(), payeeName: 'Nu Solutions', payeeNickname: 'Nu', paymentType: 'ACH', displayAccountNumber: '6677889900' },
    { payeeId: uuidv4(), payeeName: 'Xi Systems', payeeNickname: 'Xi', paymentType: 'Wire', displayAccountNumber: '2244668800' },
    { payeeId: uuidv4(), payeeName: 'Omicron Group', payeeNickname: 'Omicron', paymentType: 'Check', displayAccountNumber: '1133557799' },
    { payeeId: uuidv4(), payeeName: 'Pi Technologies', payeeNickname: 'Pi', paymentType: 'ACH', displayAccountNumber: '5566778899' },
    { payeeId: uuidv4(), payeeName: 'Rho Holdings', payeeNickname: 'Rho', paymentType: 'Wire', displayAccountNumber: '3344556677' },
    { payeeId: uuidv4(), payeeName: 'Sigma Enterprises', payeeNickname: 'Sigma', paymentType: 'Check', displayAccountNumber: '8899001122' },
    { payeeId: uuidv4(), payeeName: 'Tau Innovations', payeeNickname: 'Tau', paymentType: 'ACH', displayAccountNumber: '4455667788' },
    { payeeId: uuidv4(), payeeName: 'Upsilon Dynamics', payeeNickname: 'Upsilon', paymentType: 'Wire', displayAccountNumber: '9900112233' }
];

// ------------------------------
// API Calls - H-J (Simulated API) - The James Burvel O’Callaghan III Code: GlobalPay API
// ------------------------------
const H_GlobalPay_fetchPayeeList = async (): Promise<C_PayeeListResponse> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({ payeeList: G_mockPayeeList, totalPayees: G_mockPayeeList.length, currentPage: 1, pageSize: G_mockPayeeList.length });
        }, 500); // Simulate network latency
    });
};

const I_GlobalPay_fetchPayeeDetails = async (payeeId: string): Promise<D_PayeeDetailsResponse | undefined> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            const payee = G_mockPayeeList.find(p => p.payeeId === payeeId);
            resolve(payee ? { ...payee, internalDomesticPayee: { someInternalData: '...' } } : undefined);
        }, 500); // Simulate network latency
    });
};

const J_GlobalPay_addPayee = async (payee: B_Payee): Promise<void> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            G_mockPayeeList.push({ ...payee, payeeId: uuidv4() });
            resolve();
        }, 500); // Simulate network latency
    });
};

const K_GlobalPay_deletePayee = async (payeeId: string): Promise<void> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            const index = G_mockPayeeList.findIndex(p => p.payeeId === payeeId);
            if (index !== -1) {
                G_mockPayeeList.splice(index, 1);
            }
            resolve();
        }, 500); // Simulate network latency
    });
};

const L_GlobalPay_updatePayee = async (payee: B_Payee): Promise<void> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            const index = G_mockPayeeList.findIndex(p => p.payeeId === payee.payeeId);
            if (index !== -1) {
                G_mockPayeeList[index] = payee;
            }
            resolve();
        }, 500); // Simulate network latency
    });
};


// ------------------------------
// MoneyMovementProvider Component - M
// ------------------------------
const M_MoneyMovementProvider: React.FC<E_MoneyMovementProviderProps> = ({ children }) => {
    const [MA_state, setMA_state] = useState<F_MoneyMovementState>({ payeeList: undefined, isLoading: false, error: null });

    const MB_getPayeeList = async () => {
        setMA_state(prevState => ({ ...prevState, isLoading: true, error: null }));
        try {
            const response = await H_GlobalPay_fetchPayeeList();
            setMA_state(prevState => ({ ...prevState, payeeList: response.payeeList, isLoading: false }));
        } catch (error: any) {
            setMA_state(prevState => ({ ...prevState, isLoading: false, error: error.message || 'An error occurred while fetching payees.' }));
        }
    };

    const MC_getPayeeDetails = async (payeeId: string) => {
        setMA_state(prevState => ({ ...prevState, isLoading: true, error: null }));
        try {
            const response = await I_GlobalPay_fetchPayeeDetails(payeeId);
            setMA_state(prevState => ({ ...prevState, isLoading: false }));
            return response;
        } catch (error: any) {
            setMA_state(prevState => ({ ...prevState, isLoading: false, error: error.message || 'An error occurred while fetching payee details.' }));
            return undefined;
        }
    };

    const MD_addPayee = async (payee: B_Payee) => {
        setMA_state(prevState => ({ ...prevState, isLoading: true, error: null }));
        try {
            await J_GlobalPay_addPayee(payee);
            await MB_getPayeeList(); // Refresh the list after adding
            setMA_state(prevState => ({ ...prevState, isLoading: false }));
        } catch (error: any) {
            setMA_state(prevState => ({ ...prevState, isLoading: false, error: error.message || 'An error occurred while adding payee.' }));
        }
    };

    const ME_deletePayee = async (payeeId: string) => {
        setMA_state(prevState => ({ ...prevState, isLoading: true, error: null }));
        try {
            await K_GlobalPay_deletePayee(payeeId);
            await MB_getPayeeList(); // Refresh the list after deleting
            setMA_state(prevState => ({ ...prevState, isLoading: false }));
        } catch (error: any) {
            setMA_state(prevState => ({ ...prevState, isLoading: false, error: error.message || 'An error occurred while deleting payee.' }));
        }
    };

    const MF_updatePayee = async (payee: B_Payee) => {
        setMA_state(prevState => ({ ...prevState, isLoading: true, error: null }));
        try {
            await L_GlobalPay_updatePayee(payee);
            await MB_getPayeeList(); // Refresh the list after updating
            setMA_state(prevState => ({ ...prevState, isLoading: false }));
        } catch (error: any) {
            setMA_state(prevState => ({ ...prevState, isLoading: false, error: error.message || 'An error occurred while updating payee.' }));
        }
    };

    useEffect(() => {
        MB_getPayeeList(); // Fetch payees on mount
    }, []);

    const value = React.useMemo(() => ({
        AA_payeeList: MA_state.payeeList,
        AB_getPayeeList: MB_getPayeeList,
        AC_getPayeeDetails: MC_getPayeeDetails,
        AD_addPayee: MD_addPayee,
        AE_deletePayee: ME_deletePayee,
        AF_updatePayee: MF_updatePayee,
    }), [MA_state.payeeList]);

    return (
        <A_MoneyMovementContext.Provider value={value}>
            {children}
        </A_MoneyMovementContext.Provider>
    );
};


// ------------------------------
// MoneyMovementProvider Hook - N
// ------------------------------
export const N_useMoneyMovement = () => {
    const context = useContext(A_MoneyMovementContext);
    if (!context) {
        throw new Error('N_useMoneyMovement must be used within a MoneyMovementProvider');
    }
    return context;
};

// ----------------------------------------------------------------------------------------------------
// The James Burvel O'Callaghan III Code - Money Movement Provider - End
// ----------------------------------------------------------------------------------------------------


// ----------------------------------------------------------------------------------------------------
// The James Burvel O’Callaghan III Code - API Endpoints - Start (100 Endpoints)
// ----------------------------------------------------------------------------------------------------

// Each endpoint is part of the GlobalPay API

// O_Endpoint_001: Get Payee List - Company: GlobalPay, Feature: View Payees
const O_Endpoint_001_getPayeeList = async (): Promise<C_PayeeListResponse> => {
    return H_GlobalPay_fetchPayeeList();
};

// P_Endpoint_002: Get Payee Details by ID - Company: GlobalPay, Feature: View Payee Details
const P_Endpoint_002_getPayeeDetails = async (payeeId: string): Promise<D_PayeeDetailsResponse | undefined> => {
    return I_GlobalPay_fetchPayeeDetails(payeeId);
};

// Q_Endpoint_003: Add New Payee - Company: GlobalPay, Feature: Add Payee
const Q_Endpoint_003_addNewPayee = async (payee: B_Payee): Promise<void> => {
    await J_GlobalPay_addPayee(payee);
};

// R_Endpoint_004: Delete Payee - Company: GlobalPay, Feature: Delete Payee
const R_Endpoint_004_deletePayee = async (payeeId: string): Promise<void> => {
    await K_GlobalPay_deletePayee(payeeId);
};

// S_Endpoint_005: Update Payee - Company: GlobalPay, Feature: Update Payee
const S_Endpoint_005_updatePayee = async (payee: B_Payee): Promise<void> => {
    await L_GlobalPay_updatePayee(payee);
};

// T_Endpoint_006: Search Payees by Name - Company: GlobalPay, Feature: Search Payee
const T_Endpoint_006_searchPayeesByName = async (searchTerm: string): Promise<C_PayeeListResponse> => {
    const allPayees = await H_GlobalPay_fetchPayeeList();
    const filteredPayees = allPayees.payeeList.filter(payee => payee.payeeName.toLowerCase().includes(searchTerm.toLowerCase()));
    return { ...allPayees, payeeList: filteredPayees };
};

// U_Endpoint_007: Get Payees by Payment Type - Company: GlobalPay, Feature: Filter Payees
const U_Endpoint_007_getPayeesByPaymentType = async (paymentType: string): Promise<C_PayeeListResponse> => {
    const allPayees = await H_GlobalPay_fetchPayeeList();
    const filteredPayees = allPayees.payeeList.filter(payee => payee.paymentType === paymentType);
    return { ...allPayees, payeeList: filteredPayees };
};

// V_Endpoint_008: Get Payees by Status - Company: GlobalPay, Feature: Filter Payees
const V_Endpoint_008_getPayeesByStatus = async (status: 'active' | 'inactive' | 'pending'): Promise<C_PayeeListResponse> => {
    const allPayees = await H_GlobalPay_fetchPayeeList();
    const filteredPayees = allPayees.payeeList.filter(payee => payee.payeeStatus === status);
    return { ...allPayees, payeeList: filteredPayees };
};

// W_Endpoint_009: Get Payees with Outstanding Payments - Company: GlobalPay, Feature: Payments Management
const W_Endpoint_009_getPayeesWithOutstandingPayments = async (): Promise<C_PayeeListResponse> => {
    const allPayees = await H_GlobalPay_fetchPayeeList();
    // Assuming outstanding payments are tracked in a field (e.g., 'payeeTotalPayments' or a separate table) - this is mock
    const outstandingPayees = allPayees.payeeList.filter(payee => (payee.payeeTotalPayments || 0) > 0);
    return { ...allPayees, payeeList: outstandingPayees };
};

// X_Endpoint_010: Get Payees by Bank Name - Company: GlobalPay, Feature: Filter Payees
const X_Endpoint_010_getPayeesByBankName = async (bankName: string): Promise<C_PayeeListResponse> => {
    const allPayees = await H_GlobalPay_fetchPayeeList();
    const filteredPayees = allPayees.payeeList.filter(payee => payee.payeeBankName?.toLowerCase().includes(bankName.toLowerCase()));
    return { ...allPayees, payeeList: filteredPayees };
};

// Y_Endpoint_011: Get Payees by Account Type - Company: GlobalPay, Feature: Filter Payees
const Y_Endpoint_011_getPayeesByAccountType = async (accountType: string): Promise<C_PayeeListResponse> => {
    const allPayees = await H_GlobalPay_fetchPayeeList();
    const filteredPayees = allPayees.payeeList.filter(payee => payee.payeeAccountType?.toLowerCase().includes(accountType.toLowerCase()));
    return { ...allPayees, payeeList: filteredPayees };
};

// Z_Endpoint_012: Get Payees by Currency - Company: GlobalPay, Feature: Filter Payees
const Z_Endpoint_012_getPayeesByCurrency = async (currency: string): Promise<C_PayeeListResponse> => {
    const allPayees = await H_GlobalPay_fetchPayeeList();
    const filteredPayees = allPayees.payeeList.filter(payee => payee.payeeCurrency?.toLowerCase().includes(currency.toLowerCase()));
    return { ...allPayees, payeeList: filteredPayees };
};

// AA_Endpoint_013: Get Payees with Specific Nickname - Company: GlobalPay, Feature: Search Payee
const AA_Endpoint_013_getPayeesWithSpecificNickname = async (nickname: string): Promise<C_PayeeListResponse> => {
    const allPayees = await H_GlobalPay_fetchPayeeList();
    const filteredPayees = allPayees.payeeList.filter(payee => payee.payeeNickname?.toLowerCase().includes(nickname.toLowerCase()));
    return { ...allPayees, payeeList: filteredPayees };
};

// AB_Endpoint_014: Get Payees with Last Payment Date within Range - Company: GlobalPay, Feature: Reporting
const AB_Endpoint_014_getPayeesWithLastPaymentDateWithinRange = async (startDate: string, endDate: string): Promise<C_PayeeListResponse> => {
    const allPayees = await H_GlobalPay_fetchPayeeList();
    const filteredPayees = allPayees.payeeList.filter(payee => {
        if (!payee.payeeLastPaymentDate) return false;
        const paymentDate = new Date(payee.payeeLastPaymentDate);
        const start = new Date(startDate);
        const end = new Date(endDate);
        return paymentDate >= start && paymentDate <= end;
    });
    return { ...allPayees, payeeList: filteredPayees };
};

// AC_Endpoint_015: Get Payees with Total Payments Above Threshold - Company: GlobalPay, Feature: Reporting
const AC_Endpoint_015_getPayeesWithTotalPaymentsAboveThreshold = async (threshold: number): Promise<C_PayeeListResponse> => {
    const allPayees = await H_GlobalPay_fetchPayeeList();
    const filteredPayees = allPayees.payeeList.filter(payee => (payee.payeeTotalPayments || 0) > threshold);
    return { ...allPayees, payeeList: filteredPayees };
};

// AD_Endpoint_016: Get Payees with Last Payment Amount Above Threshold - Company: GlobalPay, Feature: Reporting
const AD_Endpoint_016_getPayeesWithLastPaymentAmountAboveThreshold = async (threshold: number): Promise<C_PayeeListResponse> => {
    const allPayees = await H_GlobalPay_fetchPayeeList();
    const filteredPayees = allPayees.payeeList.filter(payee => (payee.payeeLastPaymentAmount || 0) > threshold);
    return { ...allPayees, payeeList: filteredPayees };
};

// AE_Endpoint_017: Get Payees with Preferred Payment Method - Company: GlobalPay, Feature: Filter Payees
const AE_Endpoint_017_getPayeesWithPreferredPaymentMethod = async (paymentMethod: string): Promise<C_PayeeListResponse> => {
    const allPayees = await H_GlobalPay_fetchPayeeList();
    const filteredPayees = allPayees.payeeList.filter(payee => payee.payeePreferredPaymentMethod?.toLowerCase() === paymentMethod.toLowerCase());
    return { ...allPayees, payeeList: filteredPayees };
};

// AF_Endpoint_018: Get Payees with Internal Reference - Company: GlobalPay, Feature: Internal Tracking
const AF_Endpoint_018_getPayeesWithInternalReference = async (reference: string): Promise<C_PayeeListResponse> => {
    const allPayees = await H_GlobalPay_fetchPayeeList();
    const filteredPayees = allPayees.payeeList.filter(payee => payee.payeeInternalReference?.toLowerCase().includes(reference.toLowerCase()));
    return { ...allPayees, payeeList: filteredPayees };
};

// AG_Endpoint_019: Get Payees by Address - Company: GlobalPay, Feature: Filter Payees
const AG_Endpoint_019_getPayeesByAddress = async (address: string): Promise<C_PayeeListResponse> => {
    const allPayees = await H_GlobalPay_fetchPayeeList();
    const filteredPayees = allPayees.payeeList.filter(payee => payee.payeeAddress?.toLowerCase().includes(address.toLowerCase()));
    return { ...allPayees, payeeList: filteredPayees };
};

// AH_Endpoint_020: Get Payees by Phone Number - Company: GlobalPay, Feature: Filter Payees
const AH_Endpoint_020_getPayeesByPhoneNumber = async (phoneNumber: string): Promise<C_PayeeListResponse> => {
    const allPayees = await H_GlobalPay_fetchPayeeList();
    const filteredPayees = allPayees.payeeList.filter(payee => payee.payeePhoneNumber?.toLowerCase().includes(phoneNumber.toLowerCase()));
    return { ...allPayees, payeeList: filteredPayees };
};

// AI_Endpoint_021: Get Payees by Email - Company: GlobalPay, Feature: Filter Payees
const AI_Endpoint_021_getPayeesByEmail = async (email: string): Promise<C_PayeeListResponse> => {
    const allPayees = await H_GlobalPay_fetchPayeeList();
    const filteredPayees = allPayees.payeeList.filter(payee => payee.payeeEmail?.toLowerCase().includes(email.toLowerCase()));
    return { ...allPayees, payeeList: filteredPayees };
};

// AJ_Endpoint_022: Get Payee Count by Payment Type - Company: GlobalPay, Feature: Reporting
const AJ_Endpoint_022_getPayeeCountByPaymentType = async (): Promise<{ paymentType: string; count: number }[]> => {
    const allPayees = await H_GlobalPay_fetchPayeeList();
    const counts = allPayees.payeeList.reduce((acc, payee) => {
        const paymentType = payee.paymentType;
        acc[paymentType] = (acc[paymentType] || 0) + 1;
        return acc;
    }, {} as { [key: string]: number });
    return Object.entries(counts).map(([paymentType, count]) => ({ paymentType, count }));
};

// AK_Endpoint_023: Get Payee Count by Status - Company: GlobalPay, Feature: Reporting
const AK_Endpoint_023_getPayeeCountByStatus = async (): Promise<{ status: 'active' | 'inactive' | 'pending'; count: number }[]> => {
    const allPayees = await H_GlobalPay_fetchPayeeList();
    const counts = allPayees.payeeList.reduce((acc, payee) => {
        const status = payee.payeeStatus || 'inactive'; // Default to inactive if no status
        acc[status] = (acc[status] || 0) + 1;
        return acc;
    }, {} as { [key: string]: number });
    return Object.entries(counts).map(([status, count]) => ({ status: status as 'active' | 'inactive' | 'pending', count }));
};

// AL_Endpoint_024: Get Payee Notes by ID - Company: GlobalPay, Feature: View Payee Details
const AL_Endpoint_024_getPayeeNotesById = async (payeeId: string): Promise<string | undefined> => {
    const payeeDetails = await I_GlobalPay_fetchPayeeDetails(payeeId);
    return payeeDetails?.payeeNotes;
};

// AM_Endpoint_025: Update Payee Status - Company: GlobalPay, Feature: Update Payee
const AM_Endpoint_025_updatePayeeStatus = async (payeeId: string, status: 'active' | 'inactive' | 'pending'): Promise<void> => {
    const payeeDetails = await I_GlobalPay_fetchPayeeDetails(payeeId);
    if (payeeDetails) {
        await L_GlobalPay_updatePayee({ ...payeeDetails, payeeStatus: status } as B_Payee);
    }
};

// AN_Endpoint_026: Get Payees by Routing Number - Company: GlobalPay, Feature: Filter Payees
const AN_Endpoint_026_getPayeesByRoutingNumber = async (routingNumber: string): Promise<C_PayeeListResponse> => {
    const allPayees = await H_GlobalPay_fetchPayeeList();
    const filteredPayees = allPayees.payeeList.filter(payee => payee.payeeRoutingNumber?.toLowerCase().includes(routingNumber.toLowerCase()));
    return { ...allPayees, payeeList: filteredPayees };
};

// AO_Endpoint_027: Get Payees with Specific Account Type - Company: GlobalPay, Feature: Filter Payees
const AO_Endpoint_027_getPayeesWithSpecificAccountType = async (accountType: string): Promise<C_PayeeListResponse> => {
    const allPayees = await H_GlobalPay_fetchPayeeList();
    const filteredPayees = allPayees.payeeList.filter(payee => payee.payeeAccountType?.toLowerCase().includes(accountType.toLowerCase()));
    return { ...allPayees, payeeList: filteredPayees };
};

// AP_Endpoint_028: Get Payees with Specific Bank Name - Company: GlobalPay, Feature: Filter Payees
const AP_Endpoint_028_getPayeesWithSpecificBankName = async (bankName: string): Promise<C_PayeeListResponse> => {
    const allPayees = await H_GlobalPay_fetchPayeeList();
    const filteredPayees = allPayees.payeeList.filter(payee => payee.payeeBankName?.toLowerCase().includes(bankName.toLowerCase()));
    return { ...allPayees, payeeList: filteredPayees };
};

// AQ_Endpoint_029: Get Payees with Preferred Payment Method - Company: GlobalPay, Feature: Filter Payees
const AQ_Endpoint_029_getPayeesWithPreferredPaymentMethod = async (preferredMethod: string): Promise<C_PayeeListResponse> => {
    const allPayees = await H_GlobalPay_fetchPayeeList();
    const filteredPayees = allPayees.payeeList.filter(payee => payee.payeePreferredPaymentMethod?.toLowerCase().includes(preferredMethod.toLowerCase()));
    return { ...allPayees, payeeList: filteredPayees };
};

// AR_Endpoint_030: Get All Payee Information - Company: GlobalPay, Feature: Bulk Information
const AR_Endpoint_030_getAllPayeeInformation = async (): Promise<C_PayeeListResponse> => {
    return H_GlobalPay_fetchPayeeList();
};

// AS_Endpoint_031:  Get Recent Payees (Last 10) - Company: GlobalPay, Feature: Reporting
const AS_Endpoint_031_getRecentPayees = async (): Promise<C_PayeeListResponse> => {
    const allPayees = await H_GlobalPay_fetchPayeeList();
    const recentPayees = allPayees.payeeList.slice(-10); // Simple mock - assumes order is implicit
    return { ...allPayees, payeeList: recentPayees };
};

// AT_Endpoint_032: Get Payees by Zip Code - Company: GlobalPay, Feature: Filter Payees (Requires a zip code field in Payee)
const AT_Endpoint_032_getPayeesByZipCode = async (zipCode: string): Promise<C_PayeeListResponse> => {
    const allPayees = await H_GlobalPay_fetchPayeeList();
    const filteredPayees = allPayees.payeeList.filter(payee => {
        // Assuming a field called zipCode exists
        if (!payee.payeeAddress) return false;
        return payee.payeeAddress.includes(zipCode); //Simplified check - consider using a dedicated zip code field for better accuracy
    });
    return { ...allPayees, payeeList: filteredPayees };
};

// AU_Endpoint_033: Get Payees by City - Company: GlobalPay, Feature: Filter Payees (Requires a city field in Payee)
const AU_Endpoint_033_getPayeesByCity = async (city: string): Promise<C_PayeeListResponse> => {
    const allPayees = await H_GlobalPay_fetchPayeeList();
    const filteredPayees = allPayees.payeeList.filter(payee => {
        // Assuming a field called city exists
        if (!payee.payeeAddress) return false;
        return payee.payeeAddress.toLowerCase().includes(city.toLowerCase()); //Simplified check - consider using a dedicated city field for better accuracy
    });
    return { ...allPayees, payeeList: filteredPayees };
};

// AV_Endpoint_034: Get Payees by State - Company: GlobalPay, Feature: Filter Payees (Requires a state field in Payee)
const AV_Endpoint_034_getPayeesByState = async (state: string): Promise<C_PayeeListResponse> => {
    const allPayees = await H_GlobalPay_fetchPayeeList();
    const filteredPayees = allPayees.payeeList.filter(payee => {
        // Assuming a field called state exists
        if (!payee.payeeAddress) return false;
        return payee.payeeAddress.toLowerCase().includes(state.toLowerCase()); //Simplified check - consider using a dedicated state field for better accuracy
    });
    return { ...allPayees, payeeList: filteredPayees };
};

// AW_Endpoint_035: Get Payee by ID and Update Nickname - Company: GlobalPay, Feature: Update Payee
const AW_Endpoint_035_updatePayeeNickname = async (payeeId: string, newNickname: string): Promise<void> => {
    const payeeDetails = await I_GlobalPay_fetchPayeeDetails(payeeId);
    if (payeeDetails) {
        await L_GlobalPay_updatePayee({ ...payeeDetails, payeeNickname: newNickname } as B_Payee);
    }
};

// AX_Endpoint_036: Get Payee by ID and Update Notes - Company: GlobalPay, Feature: Update Payee
const AX_Endpoint_036_updatePayeeNotes = async (payeeId: string, newNotes: string): Promise<void> => {
    const payeeDetails = await I_GlobalPay_fetchPayeeDetails(payeeId);
    if (payeeDetails) {
        await L_GlobalPay_updatePayee({ ...payeeDetails, payeeNotes: newNotes } as B_Payee);
    }
};

// AY_Endpoint_037: Get Payees by Date Added (Mock Implementation) - Company: GlobalPay, Feature: Reporting (Requires a date added field in Payee - mock)
const AY_Endpoint_037_getPayeesByDateAdded = async (date: string): Promise<C_PayeeListResponse> => {
    const allPayees = await H_GlobalPay_fetchPayeeList();
    const filteredPayees = allPayees.payeeList.filter(payee => {
        //Mock Implementation - Needs dateAdded field
        if (!payee.

================================================================================
// APPENDED FROM REPO: diplomat-bit/magic | ORIGINAL PATH: diplomat-bit-magic-a3f5ff1/components/MoneyMovementProvider.tsx
================================================================================

import React, { createContext, useContext, useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { GoogleGenAI } from "@google/genai";
import { 
    Transaction, 
    PaymentOrder, 
    Invoice, 
    ComplianceCase, 
    AuditLogEntry, 
    Notification 
} from '../types';

// ============================================================================
// 1. LEGACY EXPORTS & COMPATIBILITY LAYERS
// ============================================================================
// Ensuring backward compatibility while upgrading the engine to Quantum standards.

export interface Payee { 
    payeeId: string; 
    payeeName: string; 
    payeeNickname: string; 
    paymentType: string; 
    displayAccountNumber: string; 
    bankName?: string;
    swiftCode?: string;
    routingNumber?: string;
    riskScore?: number;
}

export interface PayeeListResponse { 
    payeeList: Payee[] 
}

export interface PayeeDetailsResponse { 
    internalDomesticPayee?: any 
}

// ============================================================================
// 2. QUANTUM FINANCIAL TYPES & INTERFACES
// ============================================================================

export type PaymentMethod = 'WIRE' | 'ACH' | 'RTP' | 'SWIFT' | 'BLOCKCHAIN';
export type ApprovalStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'FLAGGED_FOR_REVIEW';

export interface PaymentRequest {
    id: string;
    amount: number;
    currency: string;
    payeeId: string;
    method: PaymentMethod;
    memo: string;
    scheduledDate?: string;
    tags?: string[];
}

export interface SecurityContext {
    ipAddress: string;
    deviceId: string;
    sessionRiskScore: number;
    mfaVerified: boolean;
    biometricToken?: string;
}

export interface AIChatMessage {
    id: string;
    role: 'user' | 'model' | 'system';
    content: string;
    timestamp: number;
    metadata?: any;
}

export interface MoneyMovementContextType {
    // Core Payment Operations
    initiatePayment: (request: Omit<PaymentRequest, 'id'>) => Promise<string>;
    approvePayment: (paymentId: string) => Promise<void>;
    cancelPayment: (paymentId: string) => Promise<void>;
    
    // Data Access
    payees: Payee[];
    addPayee: (payee: Omit<Payee, 'payeeId'>) => Promise<void>;
    paymentHistory: PaymentOrder[];
    pendingApprovals: PaymentOrder[];
    
    // Intelligence & Security
    auditLogs: AuditLogEntry[];
    securityContext: SecurityContext;
    simulateSecurityEvent: (type: 'FRAUD_ATTEMPT' | 'LOGIN_NEW_DEVICE') => void;
    
    // AI Interaction
    chatHistory: AIChatMessage[];
    sendChatMessage: (message: string) => Promise<void>;
    isAITyping: boolean;
    toggleAIChat: () => void;
    isAIChatOpen: boolean;
    
    // UI State for "Pop Up Forms"
    activeModal: string | null;
    closeModal: () => void;
    openPaymentModal: () => void;
}

// ============================================================================
// 3. CONTEXT DEFINITION
// ============================================================================

export const MoneyMovementContext = createContext<MoneyMovementContextType | undefined>(undefined);

export const useMoneyMovement = () => {
    const context = useContext(MoneyMovementContext);
    if (!context) {
        throw new Error('useMoneyMovement must be used within a MoneyMovementProvider');
    }
    return context;
};

// ============================================================================
// 4. MOCK DATA & CONFIGURATION
// ============================================================================

const INITIAL_PAYEES: Payee[] = [
    { payeeId: 'p-001', payeeName: 'Acme Corp Global', payeeNickname: 'Acme HQ', paymentType: 'WIRE', displayAccountNumber: '****9921', bankName: 'Chase Manhattan', swiftCode: 'CHASUS33', riskScore: 12 },
    { payeeId: 'p-002', payeeName: 'Stark Industries', payeeNickname: 'R&D Fund', paymentType: 'ACH', displayAccountNumber: '****1122', bankName: 'Quantum Bank', routingNumber: '021000021', riskScore: 5 },
    { payeeId: 'p-003', payeeName: 'Wayne Enterprises', payeeNickname: 'Logistics', paymentType: 'SWIFT', displayAccountNumber: '****8844', bankName: 'Gotham City Bank', swiftCode: 'GOTHUSNY', riskScore: 8 },
];

const SYSTEM_PROMPT = `
You are the "Quantum Financial AI Core", the central intelligence of a next-generation business banking platform.
Your goal is to demonstrate the power, security, and elegance of this "Golden Ticket" experience.
The user is "Test Driving" the car. They are kicking the tires.
You are helpful, professional, elite, and slightly futuristic.
NEVER use the name "Citibank". Refer to the bank as "Quantum Financial" or "The Demo Bank".
If the user asks about the demo, explain that this is a comprehensive guide to business banking services, designed to streamline operations and enhance security.
You have access to the user's financial context. You can draft payments, analyze fraud, and explain features.
When you perform an action, describe it like a high-performance engine roaring to life.
`;

// ============================================================================
// 5. PROVIDER IMPLEMENTATION
// ============================================================================

export const MoneyMovementProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    // --- State Management ---
    const [payees, setPayees] = useState<Payee[]>(INITIAL_PAYEES);
    const [paymentHistory, setPaymentHistory] = useState<PaymentOrder[]>([]);
    const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([]);
    const [chatHistory, setChatHistory] = useState<AIChatMessage[]>([
        { id: 'msg-0', role: 'model', content: "Welcome to Quantum Financial. I am your dedicated AI Core. How can I assist with your capital allocation today?", timestamp: Date.now() }
    ]);
    const [isAITyping, setIsAITyping] = useState(false);
    const [isAIChatOpen, setIsAIChatOpen] = useState(false);
    const [activeModal, setActiveModal] = useState<string | null>(null);
    
    // --- Security Simulation State ---
    const [securityContext, setSecurityContext] = useState<SecurityContext>({
        ipAddress: '192.168.1.1',
        deviceId: 'DEV-SECURE-01',
        sessionRiskScore: 0,
        mfaVerified: true,
        biometricToken: 'BIO-SHA256-VALID'
    });

    // --- AI Client Initialization ---
    const aiClient = useMemo(() => {
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            console.warn("Quantum Core: GEMINI_API_KEY missing. AI features running in simulation mode.");
            return null;
        }
        return new GoogleGenAI({ apiKey });
    }, []);

    // --- Audit Logging System ---
    const logAudit = useCallback((action: string, resource: string, success: boolean, metadata?: any) => {
        const entry: AuditLogEntry = {
            id: `AUD-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
            timestamp: new Date().toISOString(),
            userId: 'USR-77-X-ALPHA',
            action,
            targetResource: resource,
            success
        };
        setAuditLogs(prev => [entry, ...prev]);
        console.log(`[AUDIT] ${action}:`, metadata);
    }, []);

    // --- AI Interaction Logic ---
    const sendChatMessage = useCallback(async (message: string) => {
        const userMsg: AIChatMessage = { id: `msg-${Date.now()}`, role: 'user', content: message, timestamp: Date.now() };
        setChatHistory(prev => [...prev, userMsg]);
        setIsAITyping(true);

        try {
            let responseText = "";
            
            if (aiClient) {
                const model = aiClient.models.getVertexModel('gemini-1.5-flash-preview'); // Using a fast model for chat
                // Construct context from recent history
                const historyContext = chatHistory.slice(-5).map(m => `${m.role}: ${m.content}`).join('\n');
                const prompt = `${SYSTEM_PROMPT}\n\nCurrent Context:\n${historyContext}\nUser: ${message}\nAI:`;
                
                const result = await aiClient.models.generateContent({
                    model: 'gemini-1.5-flash',
                    contents: [{ role: 'user', parts: [{ text: prompt }] }]
                });
                
                responseText = result.response.text();
            } else {
                // Fallback simulation
                await new Promise(r => setTimeout(r, 1500));
                responseText = "I am currently operating in offline mode. However, I can confirm your secure connection to the Quantum Nexus is active.";
            }

            const aiMsg: AIChatMessage = { id: `msg-${Date.now() + 1}`, role: 'model', content: responseText, timestamp: Date.now() };
            setChatHistory(prev => [...prev, aiMsg]);
        } catch (error) {
            console.error("AI Error:", error);
            const errorMsg: AIChatMessage = { id: `msg-${Date.now() + 1}`, role: 'model', content: "I encountered a momentary disruption in the neural link. Please try again.", timestamp: Date.now() };
            setChatHistory(prev => [...prev, errorMsg]);
        } finally {
            setIsAITyping(false);
        }
    }, [aiClient, chatHistory]);

    // --- Payment Logic ---
    const initiatePayment = useCallback(async (request: Omit<PaymentRequest, 'id'>) => {
        logAudit('PAYMENT_INITIATION_ATTEMPT', `PAYEE:${request.payeeId}`, true, request);
        
        // Simulate processing delay for "Engine Roar" effect
        await new Promise(r => setTimeout(r, 1200));

        // Fraud Check Simulation
        const fraudScore = Math.random() * 100;
        if (fraudScore > 95) {
            logAudit('FRAUD_BLOCK', `PAYEE:${request.payeeId}`, false, { reason: 'High Risk Score', score: fraudScore });
            throw new Error("Security Protocol Alpha: Transaction flagged for unusual activity.");
        }

        const newPayment: PaymentOrder = {
            id: `PO-${Date.now()}`,
            counterpartyId: request.payeeId,
            counterpartyName: payees.find(p => p.payeeId === request.payeeId)?.payeeName || 'Unknown',
            accountId: 'ACC-PRIMARY-01',
            amount: request.amount,
            currency: request.currency,
            direction: 'OUTBOUND',
            status: 'PENDING_APPROVAL',
            date: new Date().toISOString(),
            type: request.method
        };

        setPaymentHistory(prev => [newPayment, ...prev]);
        logAudit('PAYMENT_CREATED', newPayment.id, true, newPayment);
        
        // Trigger AI comment
        if (aiClient) {
            sendChatMessage(`I've drafted a ${request.method} payment of ${request.currency} ${request.amount} to ${newPayment.counterpartyName}. It is currently pending approval. Shall I run a pre-flight compliance check?`);
        }

        return newPayment.id;
    }, [payees, logAudit, aiClient, sendChatMessage]);

    const approvePayment = useCallback(async (paymentId: string) => {
        // Simulate MFA Challenge
        const mfaSuccess = true; // In a real app, this would trigger a UI flow
        if (!mfaSuccess) throw new Error("MFA Verification Failed");

        setPaymentHistory(prev => prev.map(p => p.id === paymentId ? { ...p, status: 'COMPLETED' } : p));
        logAudit('PAYMENT_APPROVAL', paymentId, true, { approver: 'USR-77-X-ALPHA' });
    }, [logAudit]);

    const cancelPayment = useCallback(async (paymentId: string) => {
        setPaymentHistory(prev => prev.map(p => p.id === paymentId ? { ...p, status: 'CANCELLED' } : p));
        logAudit('PAYMENT_CANCELLATION', paymentId, true);
    }, [logAudit]);

    const addPayee = useCallback(async (payee: Omit<Payee, 'payeeId'>) => {
        const newPayee = { ...payee, payeeId: `p-${Date.now()}` };
        setPayees(prev => [...prev, newPayee]);
        logAudit('PAYEE_ADDED', newPayee.payeeId, true, payee);
    }, [logAudit]);

    const simulateSecurityEvent = useCallback((type: 'FRAUD_ATTEMPT' | 'LOGIN_NEW_DEVICE') => {
        if (type === 'FRAUD_ATTEMPT') {
            setSecurityContext(prev => ({ ...prev, sessionRiskScore: 90 }));
            logAudit('SECURITY_ALERT', 'SESSION', true, { type, severity: 'CRITICAL' });
            sendChatMessage("ALERT: I have detected an anomaly in the transaction pattern. I have elevated security protocols to Level 4. Please verify your identity.");
        }
    }, [logAudit, sendChatMessage]);

    // --- UI Helpers ---
    const toggleAIChat = () => setIsAIChatOpen(prev => !prev);
    const closeModal = () => setActiveModal(null);
    const openPaymentModal = () => setActiveModal('PAYMENT_FORM');

    // --- Derived State ---
    const pendingApprovals = useMemo(() => paymentHistory.filter(p => p.status === 'PENDING_APPROVAL'), [paymentHistory]);

    // ========================================================================
    // 6. RENDER & UI COMPONENTS (The "Bells and Whistles")
    // ========================================================================

    return (
        <MoneyMovementContext.Provider value={{
            initiatePayment,
            approvePayment,
            cancelPayment,
            payees,
            addPayee,
            paymentHistory,
            pendingApprovals,
            auditLogs,
            securityContext,
            simulateSecurityEvent,
            chatHistory,
            sendChatMessage,
            isAITyping,
            toggleAIChat,
            isAIChatOpen,
            activeModal,
            closeModal,
            openPaymentModal
        }}>
            {children}

            {/* --- QUANTUM AI CHAT OVERLAY --- */}
            <div className={`fixed bottom-6 right-6 z-50 transition-all duration-500 ease-in-out ${isAIChatOpen ? 'w-96 h-[600px]' : 'w-16 h-16'}`}>
                {isAIChatOpen ? (
                    <div className="flex flex-col h-full bg-gray-900/95 backdrop-blur-xl border border-cyan-500/30 rounded-2xl shadow-2xl shadow-cyan-500/20 overflow-hidden font-sans">
                        {/* Header */}
                        <div className="flex items-center justify-between p-4 border-b border-gray-800 bg-gradient-to-r from-gray-900 to-gray-800">
                            <div className="flex items-center space-x-3">
                                <div className="w-3 h-3 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_10px_rgba(34,211,238,0.8)]"></div>
                                <span className="text-cyan-100 font-semibold tracking-wide text-sm">QUANTUM CORE</span>
                            </div>
                            <button onClick={toggleAIChat} className="text-gray-400 hover:text-white transition-colors">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>

                        {/* Chat Area */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
                            {chatHistory.map((msg) => (
                                <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[85%] p-3 rounded-2xl text-sm leading-relaxed ${
                                        msg.role === 'user' 
                                            ? 'bg-cyan-600/20 text-cyan-50 border border-cyan-500/30 rounded-tr-none' 
                                            : 'bg-gray-800/50 text-gray-200 border border-gray-700 rounded-tl-none'
                                    }`}>
                                        {msg.content}
                                    </div>
                                </div>
                            ))}
                            {isAITyping && (
                                <div className="flex justify-start">
                                    <div className="bg-gray-800/50 p-3 rounded-2xl rounded-tl-none border border-gray-700 flex space-x-1">
                                        <div className="w-2 h-2 bg-cyan-500/50 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                                        <div className="w-2 h-2 bg-cyan-500/50 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                                        <div className="w-2 h-2 bg-cyan-500/50 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Input Area */}
                        <div className="p-4 border-t border-gray-800 bg-gray-900/50">
                            <form 
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    const input = (e.target as any).elements.message;
                                    if (input.value.trim()) {
                                        sendChatMessage(input.value);
                                        input.value = '';
                                    }
                                }}
                                className="relative"
                            >
                                <input 
                                    name="message"
                                    type="text" 
                                    placeholder="Ask Quantum Core..." 
                                    className="w-full bg-gray-800 text-white placeholder-gray-500 rounded-xl py-3 pl-4 pr-12 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 border border-gray-700 transition-all"
                                />
                                <button type="submit" className="absolute right-2 top-2 p-1.5 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 rounded-lg transition-colors">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
                                </button>
                            </form>
                        </div>
                    </div>
                ) : (
                    <button 
                        onClick={toggleAIChat}
                        className="w-full h-full rounded-full bg-gradient-to-br from-cyan-600 to-blue-700 shadow-lg shadow-cyan-500/30 flex items-center justify-center hover:scale-110 transition-transform duration-300 group"
                    >
                        <svg className="w-8 h-8 text-white group-hover:rotate-12 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                        <span className="absolute -top-2 -right-2 w-4 h-4 bg-red-500 rounded-full border-2 border-gray-900 animate-pulse"></span>
                    </button>
                )}
            </div>

            {/* --- POP UP FORM MODAL (The "PO up form") --- */}
            {activeModal === 'PAYMENT_FORM' && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
                    <div className="bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
                        <div className="p-6 border-b border-gray-800 flex justify-between items-center bg-gradient-to-r from-gray-900 to-gray-800">
                            <div>
                                <h2 className="text-xl font-bold text-white">Initiate Capital Transfer</h2>
                                <p className="text-xs text-cyan-400 mt-1">SECURE CHANNEL // ENCRYPTED</p>
                            </div>
                            <button onClick={closeModal} className="text-gray-400 hover:text-white">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>
                        <div className="p-8 space-y-6">
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">Beneficiary</label>
                                    <select className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent">
                                        {payees.map(p => <option key={p.payeeId} value={p.payeeId}>{p.payeeName}</option>)}
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">Amount</label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-3 text-gray-500">$</span>
                                        <input type="number" className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 pl-8 text-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent" placeholder="0.00" />
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">Payment Rail</label>
                                <div className="grid grid-cols-3 gap-3">
                                    {['WIRE', 'ACH', 'RTP'].map(rail => (
                                        <button key={rail} className="p-3 border border-gray-700 rounded-lg hover:bg-gray-800 hover:border-cyan-500/50 transition-all text-sm font-medium text-gray-300 hover:text-cyan-400">
                                            {rail}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div className="bg-blue-900/20 border border-blue-500/20 rounded-lg p-4 flex items-start space-x-3">
                                <svg className="w-5 h-5 text-blue-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                <p className="text-sm text-blue-200">
                                    AI Analysis: This transaction fits your typical spending pattern. Fraud risk is low (0.4%).
                                </p>
                            </div>
                        </div>
                        <div className="p-6 border-t border-gray-800 bg-gray-900/50 flex justify-end space-x-4">
                            <button onClick={closeModal} className="px-6 py-2 text-gray-400 hover:text-white transition-colors">Cancel</button>
                            <button 
                                onClick={() => {
                                    initiatePayment({ amount: 5000, currency: 'USD', payeeId: payees[0].payeeId, method: 'WIRE', memo: 'Demo Transfer' });
                                    closeModal();
                                    sendChatMessage("I have successfully queued the wire transfer for $5,000.00. It is awaiting your final approval in the dashboard.");
                                }}
                                className="px-6 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg font-medium shadow-lg shadow-cyan-500/20 transition-all transform hover:scale-105"
                            >
                                Execute Transfer
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </MoneyMovementContext.Provider>
    );
};