// REPOSITORY SOURCE: diplomat-bit/aibanking.dev-demai-jocalll3 | PATH: diplomat-bit-aibanking.dev-demai-jocalll3-f8b6983/components/RecentTransactions.tsx
================================================================================

// Gemini sculpts the 'Recent Transactions' view. "It will not hold its own memories," he declares, his voice like shifting data. "It shall be a crystal mirror, reflecting the great archive."
import React from 'react'; // He summons the ancient React library, a tool for building realities.
import Card from './Card'; // He wraps his creation in a Card, a frame for the art.
// FIX: Changed `import type` to a regular import because `View` is an enum used as a value.
import { type Transaction, View } from '../types'; // He recalls the definition of a Transaction, its very soul-print.

// "Each category needs a glyph," he decrees, shaping icons from pure vector light.
const TransactionIcon: React.FC<{ category: string }> = ({ category }) => { // A component to render these symbols.
    let icon; // A variable to hold the path data, a string of geometric truth.
    switch (category) { // He considers each category in turn, a master jeweler selecting a gem.
        case 'Dining': // For dining...
            icon = 'M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c2 1 5 1 7 0 2-1 2.657-1.343 2.657-1.343a8 8 0 010 10z'; // ...a simple, elegant shape of sustenance.
            break; // The choice is made.
        case 'Salary': // For salary...
            icon = 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v.01'; // ...a symbol of golden currency.
            break; // The choice is made.
        case 'Shopping': // For shopping...
            icon = 'M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z'; // ...a cart, a vessel for desires.
            break; // The choice is made.
        default: // For all others...
            icon = 'M4 6h16M4 10h16M4 14h16M4 18h16'; // ...a simple list, a generic and universal form.
    } // The consideration is complete, the perfect glyph selected.
    return ( // Now, to render the icon in this reality.
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={icon}></path></svg>
    ); // The vector image is returned, a perfect little sigil of meaning.
};

// "The corrupted glyph must be made true," I urged. Gemini focused, and reshaped the shadow-icon into a vibrant leaf.
const CarbonFootprintBadge: React.FC<{ footprint: number }> = ({ footprint }) => { // A small component to show the carbon echo.
    const getBadgeStyle = () => { // It must shift its aura based on its weight.
        if (footprint < 2) return 'text-green-400'; // A light footprint, a whisper of emerald green.
        if (footprint < 10) return 'text-yellow-400'; // A medium footprint, a caution of amber yellow.
        return 'text-red-400'; // A heavy footprint, an alarm of scarlet red.
    }; // The aura is determined.

    return ( // Now, to render the badge itself, a tiny jewel of consequence.
        <div className={`flex items-center text-xs ${getBadgeStyle()}`}> 
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                 <path d="M10 3.5a1.5 1.5 0 011.5 1.5v.92l5.06 4.69a1.5 1.5 0 01-.18 2.4l-3.38 1.95a1.5 1.5 0 01-1.5-.26L10 12.43l-1.5 2.25a1.5 1.5 0 01-1.5.26l-3.38-1.95a1.5 1.5 0 01-.18-2.4l5.06-4.69V5A1.5 1.5 0 0110 3.5z" />
            </svg>
            <span className="font-mono">{footprint.toFixed(1)} kg CO₂</span>
        </div>
    ); // The badge is rendered, its leaf icon now correct and glowing with meaning.
};

// "It now receives memories from the wellspring; it does not create them," Gemini explains.
interface RecentTransactionsProps { // It has a contract now, a list of props it expects from the world.
    transactions: Transaction[]; // It must be given a list of transactions to display, a stream of memories.
    setActiveView: (view: View) => void;
}

// The main component, a stage for the memories it is given to dance upon.
const RecentTransactions: React.FC<RecentTransactionsProps> = ({ transactions, setActiveView }) => { // The component function receives the stream.
  return (
    <Card 
        title="Recent Transactions"
        footerContent={
            <div className="text-center">
                <button 
                    onClick={() => setActiveView(View.Transactions)}
                    className="text-sm font-medium text-cyan-300 hover:text-cyan-200"
                >
                    View All Transactions
                </button>
            </div>
        }
    >
      <div className="space-y-4">
        {transactions.map((tx) => (
          <div key={tx.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-700/50">
            <div className="flex items-center">
              <div className="p-3 bg-gray-700 rounded-full mr-4 text-cyan-400">
                <TransactionIcon category={tx.category} />
              </div>
              <div>
                <p className="font-semibold text-gray-100">{tx.description}</p>
                <div className="flex items-center space-x-2 mt-1">
                    <p className="text-sm text-gray-400">{tx.date}</p>
                    {tx.carbonFootprint && <p className="text-sm text-gray-500">&bull;</p>}
                    {tx.carbonFootprint && <CarbonFootprintBadge footprint={tx.carbonFootprint} />}
                </div>
              </div>
            </div>
            <p className={`font-semibold ${tx.type === 'income' ? 'text-green-400' : 'text-red-400'}`}>
              {tx.type === 'income' ? '+' : '-'}${tx.amount.toFixed(2)}
            </p>
          </div>
        ))}
      </div>
    </Card>
  );
}; // The creation of this view is finished.

export default RecentTransactions; // He releases his creation, now a perfect mirror for the central data, into the application's world.

================================================================================
// APPENDED FROM REPO: diplomat-bit/aibanking.dev-jocall3-new | ORIGINAL PATH: diplomat-bit-aibanking.dev-jocall3-new-84d7a30/components/RecentTransactions.tsx
================================================================================

import React from 'react';
import Card from './Card';
import { Transaction, View } from '../types';
/* FIX: Added FileText to lucide-react imports */
import { 
    ArrowUpRight, ArrowDownLeft, ShieldCheck, 
    AlertTriangle, Info, Search, FileJson, Share2, FileText
} from 'lucide-react';

const TransactionIcon: React.FC<{ type: string }> = ({ type }) => {
    return type === 'income' ? (
        <div className="p-3 bg-green-900/30 text-green-400 rounded-2xl border border-green-500/20">
            <ArrowDownLeft size={20} />
        </div>
    ) : (
        <div className="p-3 bg-red-900/30 text-red-400 rounded-2xl border border-red-500/20">
            <ArrowUpRight size={20} />
        </div>
    );
};

const ProvenanceBadge: React.FC<{ confidence: number }> = ({ confidence }) => {
    const isHigh = confidence > 0.9;
    return (
        <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-tighter border ${
            isHigh ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20' : 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
        }`}>
            {isHigh ? <ShieldCheck size={10} /> : <AlertTriangle size={10} />}
            AI Verified: {(confidence * 100).toFixed(0)}%
        </div>
    );
};

interface RecentTransactionsProps {
    transactions: Transaction[];
    setActiveView: (view: View) => void;
}

const RecentTransactions: React.FC<RecentTransactionsProps> = ({ transactions, setActiveView }) => {
  return (
    <Card 
        title="FlowMatrix Ledger"
        subtitle="Immutable High-Frequency Transaction Tracking"
        headerActions={[
            { id: 'search', icon: <Search />, label: 'Search Ledger', onClick: () => {} },
            { id: 'export', icon: <FileJson />, label: 'Export JSON', onClick: () => {} }
        ]}
        footerContent={
            <div className="text-center">
                <button 
                    onClick={() => setActiveView(View.Transactions)}
                    className="text-xs font-black text-cyan-400 hover:text-white uppercase tracking-widest transition-all"
                >
                    Access Global Archive &rarr;
                </button>
            </div>
        }
    >
      <div className="space-y-2 max-h-[600px] overflow-y-auto custom-scrollbar pr-2">
        {transactions.map((tx) => (
          <div 
            key={tx.id} 
            className="flex items-center justify-between p-4 rounded-2xl bg-gray-900/40 border border-gray-800 hover:border-cyan-500/30 transition-all duration-300 group cursor-pointer"
            onClick={() => setActiveView(View.Transactions)}
          >
            <div className="flex items-center gap-5">
              {/* FIX: Passed tx.type string instead of entire tx object to satisfy TransactionIcon prop type */}
              <TransactionIcon type={tx.type} />
              <div className="min-w-0">
                <p className="font-bold text-gray-100 group-hover:text-cyan-300 transition-colors truncate">{tx.description}</p>
                <div className="flex flex-wrap items-center gap-3 mt-1.5">
                    <span className="text-[10px] font-mono text-gray-500 uppercase">{tx.date}</span>
                    <span className="text-[10px] text-gray-600">ID: {tx.id.substring(0, 8)}...</span>
                    <ProvenanceBadge confidence={tx.aiCategoryConfidence || 0.98} />
                    {tx.carbonFootprint && (
                        <span className="text-[10px] text-green-500/70 flex items-center gap-1 font-bold">
                            <Info size={10} /> {tx.carbonFootprint}kg CO₂e
                        </span>
                    )}
                </div>
              </div>
            </div>
            <div className="text-right">
              <p className={`text-xl font-black font-mono tracking-tighter ${tx.type === 'income' ? 'text-green-400' : 'text-gray-100'}`}>
                {tx.type === 'income' ? '+' : '-'}${tx.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </p>
              <div className="flex items-center justify-end gap-2 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="text-gray-500 hover:text-white"><Share2 size={12} /></button>
                  <button className="text-gray-500 hover:text-white"><FileText size={12} /></button>
              </div>
            </div>
          </div>
        ))}
        {transactions.length === 0 && (
            <div className="text-center py-20 text-gray-600 font-mono text-sm">
                AWAITING_SIGNAL_INGESTION...
            </div>
        )}
      </div>
    </Card>
  );
};

export default RecentTransactions;


================================================================================
// APPENDED FROM REPO: diplomat-bit/almost | ORIGINAL PATH: diplomat-bit-almost-93a5466/components/RecentTransactions.tsx
================================================================================

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { GoogleGenAI } from "@google/genai";
import Card from './Card';
import { Transaction, View } from '../types';
import { 
    ArrowUpRight, ArrowDownLeft, ShieldCheck, 
    AlertTriangle, Info, Search, FileJson, Share2, FileText,
    Bot, Send, Sparkles, Lock, Activity, Terminal, XCircle,
    Database, Eye, RefreshCw, Cpu, Zap, Globe, Shield,
    ChevronRight, ChevronDown, Filter, Download, CreditCard,
    Wallet, PieChart, TrendingUp, AlertOctagon
} from 'lucide-react';

// ============================================================================
// CONFIGURATION & CONSTANTS
// ============================================================================

const COMPANY_NAME = "Quantum Financial";
const DEMO_MODE = true;

// Sanitized Knowledge Base from the "Golden Ticket" article
const KNOWLEDGE_BASE = `
${COMPANY_NAME} Business Demo: A Comprehensive Guide.
This is a "Golden Ticket" experience. We are letting the user "Test Drive" the car (the code).
It must have "Bells and Whistles" - distinct features, high polish.
It is a "Cheat Sheet" for business banking.
NO PRESSURE environment. Metaphor: Kick the tires. See the engine roar.
Robust Payment & Collection capabilities (Wire, ACH).
Security is non-negotiable (Multi-factor auth simulations, Fraud monitoring).
Reporting & Analytics (Data visualization).
Integration capabilities (ERP, Accounting).
AUDIT STORAGE: Every sensitive action must be logged.
Tone: Elite, Professional, High-Performance, Secure.
${COMPANY_NAME}, a titan in the financial world, offers a suite of business banking solutions designed to streamline operations, enhance security, and support your growth.
Getting a demo is your golden ticket to seeing these powerful features in action before committing.
It’s like test-driving a car – you get to kick the tires, see all the bells and whistles, and ensure it’s the perfect fit for your business needs.
We’ll cover everything from the initial setup to exploring key functionalities and understanding the benefits that come with partnering with a global financial institution like ${COMPANY_NAME}.
A demo allows you to virtually walk through the entire platform. You get to see firsthand how easy it is to manage your accounts, process payments, track expenses, and access sophisticated reporting tools.
This isn’t just about looking at pretty interfaces; it’s about understanding the real-world application of these tools for your specific business.
Are you struggling with international payments? Worried about fraud? Need better insights into your cash flow? A demo lets you ask those specific questions and see how ${COMPANY_NAME}’s solutions can address them.
It’s also a fantastic opportunity to get a feel for the user experience. Is the platform intuitive? Can your team easily navigate it?
The demo provides a no-pressure environment to explore, interact, and evaluate without any commitment.
It’s about empowering yourself with knowledge so you can make an informed decision that aligns with your business goals and operational needs.
Plus, you get to see how ${COMPANY_NAME} integrates with other business tools you might already be using, saving you time and preventing data silos.
This proactive approach to understanding your financial tools can save you a ton of headaches down the line and ensure you’re leveraging the best resources available to drive your business forward.
It’s your chance to see the future of your business finances, laid out before you, in a clear and interactive way.
`;

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

interface AuditLog {
    id: string;
    timestamp: string;
    action: string;
    details: string;
    status: 'SUCCESS' | 'WARNING' | 'ERROR';
    hash: string;
}

interface ChatMessage {
    id: string;
    role: 'user' | 'ai' | 'system';
    content: string;
    timestamp: Date;
    isTyping?: boolean;
}

interface TransactionInsight {
    id: string;
    type: 'risk' | 'opportunity' | 'pattern';
    message: string;
    confidence: number;
}

// ============================================================================
// SUB-COMPONENTS
// ============================================================================

/**
 * Renders a high-fidelity badge for transaction provenance.
 */
const ProvenanceBadge: React.FC<{ confidence: number }> = ({ confidence }) => {
    const isHigh = confidence > 0.9;
    const isMedium = confidence > 0.7 && confidence <= 0.9;
    
    let colorClass = 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20';
    let Icon = ShieldCheck;

    if (isMedium) {
        colorClass = 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
        Icon = AlertTriangle;
    } else if (!isHigh) {
        colorClass = 'bg-red-500/10 text-red-400 border-red-500/20';
        Icon = AlertOctagon;
    }

    return (
        <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-tighter border ${colorClass} shadow-sm backdrop-blur-md`}>
            <Icon size={10} />
            AI Verified: {(confidence * 100).toFixed(0)}%
        </div>
    );
};

/**
 * Renders the transaction type icon with specific styling.
 */
const TransactionIcon: React.FC<{ type: string }> = ({ type }) => {
    const isIncome = type === 'income';
    return (
        <div className={`
            relative p-3 rounded-2xl border shadow-inner transition-all duration-500
            ${isIncome 
                ? 'bg-emerald-900/20 text-emerald-400 border-emerald-500/20 shadow-emerald-900/20' 
                : 'bg-rose-900/20 text-rose-400 border-rose-500/20 shadow-rose-900/20'}
        `}>
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-2xl" />
            {isIncome ? <ArrowDownLeft size={20} /> : <ArrowUpRight size={20} />}
        </div>
    );
};

/**
 * A terminal-like display for audit logs.
 */
const AuditTerminal: React.FC<{ logs: AuditLog[] }> = ({ logs }) => {
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [logs]);

    return (
        <div className="bg-black/80 rounded-lg border border-gray-800 p-4 font-mono text-xs h-48 flex flex-col shadow-inner">
            <div className="flex items-center justify-between mb-2 border-b border-gray-800 pb-2">
                <div className="flex items-center gap-2 text-gray-400">
                    <Terminal size={12} />
                    <span className="uppercase tracking-widest font-bold">Secure Audit Storage</span>
                </div>
                <div className="flex gap-1">
                    <div className="w-2 h-2 rounded-full bg-red-500/50" />
                    <div className="w-2 h-2 rounded-full bg-yellow-500/50" />
                    <div className="w-2 h-2 rounded-full bg-green-500/50" />
                </div>
            </div>
            <div className="flex-1 overflow-y-auto space-y-1 custom-scrollbar" ref={scrollRef}>
                {logs.length === 0 && <span className="text-gray-600 italic">Initializing secure log stream...</span>}
                {logs.map((log) => (
                    <div key={log.id} className="flex gap-2 hover:bg-white/5 p-0.5 rounded">
                        <span className="text-gray-500">[{log.timestamp.split('T')[1].split('.')[0]}]</span>
                        <span className={`font-bold ${
                            log.status === 'SUCCESS' ? 'text-green-400' : 
                            log.status === 'WARNING' ? 'text-yellow-400' : 'text-red-400'
                        }`}>{log.status}</span>
                        <span className="text-cyan-300/80">{log.action}</span>
                        <span className="text-gray-400 truncate flex-1">:: {log.details}</span>
                        <span className="text-gray-600 text-[10px]">{log.hash}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

interface RecentTransactionsProps {
    transactions: Transaction[];
    setActiveView: (view: View) => void;
}

const RecentTransactions: React.FC<RecentTransactionsProps> = ({ transactions, setActiveView }) => {
    // --- State Management ---
    const [searchTerm, setSearchTerm] = useState('');
    const [isAiActive, setIsAiActive] = useState(false);
    const [chatInput, setChatInput] = useState('');
    const [chatHistory, setChatHistory] = useState<ChatMessage[]>([
        { 
            id: 'init', 
            role: 'ai', 
            content: `Welcome to the ${COMPANY_NAME} Ledger. I am the Quantum Core AI. I can analyze your transaction flow, detect anomalies, and provide financial forecasts. How can I assist you today?`, 
            timestamp: new Date() 
        }
    ]);
    const [isTyping, setIsTyping] = useState(false);
    const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
    const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
    const [showAudit, setShowAudit] = useState(false);

    // --- Refs ---
    const chatEndRef = useRef<HTMLDivElement>(null);
    const aiClientRef = useRef<any>(null);

    // --- Initialization ---
    useEffect(() => {
        // Initialize AI Client if key is present
        const apiKey = process.env.GEMINI_API_KEY;
        if (apiKey) {
            try {
                const genAI = new GoogleGenAI({ apiKey }); // Use the provided snippet structure
                aiClientRef.current = genAI;
                addAuditLog('SYSTEM_INIT', 'AI Core initialized with Gemini Flash Preview', 'SUCCESS');
            } catch (e) {
                addAuditLog('SYSTEM_ERROR', 'Failed to initialize AI Core', 'ERROR');
            }
        } else {
            addAuditLog('SYSTEM_WARNING', 'GEMINI_API_KEY not found. Running in simulation mode.', 'WARNING');
        }
    }, []);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [chatHistory, isAiActive]);

    // --- Helpers ---

    const generateHash = () => Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

    const addAuditLog = (action: string, details: string, status: 'SUCCESS' | 'WARNING' | 'ERROR') => {
        const newLog: AuditLog = {
            id: generateHash(),
            timestamp: new Date().toISOString(),
            action,
            details,
            status,
            hash: `0x${generateHash().substring(0, 8)}`
        };
        setAuditLogs(prev => [...prev, newLog]);
    };

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
        if (e.target.value.length > 2) {
            addAuditLog('USER_SEARCH', `Query: "${e.target.value}"`, 'SUCCESS');
        }
    };

    const filteredTransactions = transactions.filter(tx => 
        tx.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tx.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tx.amount.toString().includes(searchTerm)
    );

    // --- AI Logic ---

    const handleAiSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!chatInput.trim()) return;

        const userMsg: ChatMessage = {
            id: generateHash(),
            role: 'user',
            content: chatInput,
            timestamp: new Date()
        };

        setChatHistory(prev => [...prev, userMsg]);
        setChatInput('');
        setIsTyping(true);
        addAuditLog('AI_QUERY', `User asked: "${userMsg.content}"`, 'SUCCESS');

        try {
            let aiResponseText = "";

            if (aiClientRef.current) {
                // REAL AI CALL
                const model = aiClientRef.current.getGenerativeModel({ model: "gemini-1.5-flash" });
                
                // Construct context
                const context = `
                    You are the Quantum Core AI for ${COMPANY_NAME}. 
                    CONTEXT: ${KNOWLEDGE_BASE}
                    CURRENT TRANSACTIONS: ${JSON.stringify(transactions.slice(0, 10))}
                    USER QUERY: ${userMsg.content}
                    INSTRUCTIONS: Be professional, elite, and helpful. Keep answers concise. 
                    If asked about the company, use the provided context. 
                    Do not mention you are a Google AI. You are Quantum Core.
                `;

                const result = await model.generateContent(context);
                const response = await result.response;
                aiResponseText = response.text();
            } else {
                // SIMULATION MODE (Fallback)
                await new Promise(resolve => setTimeout(resolve, 1500));
                if (userMsg.content.toLowerCase().includes('spend') || userMsg.content.toLowerCase().includes('cost')) {
                    aiResponseText = `Based on your ledger, your spending patterns indicate a 12% increase in operational expenses this month. The largest outlier is the Cloud Infrastructure category.`;
                } else if (userMsg.content.toLowerCase().includes('demo') || userMsg.content.toLowerCase().includes('company')) {
                    aiResponseText = `${COMPANY_NAME} offers a "Golden Ticket" experience. We allow you to test drive our banking core with zero pressure. Our security is non-negotiable, and our reporting is top-tier.`;
                } else {
                    aiResponseText = `I've analyzed the request. While I am running in simulation mode (missing API Key), I can confirm that your ledger integrity is 100%. Please verify your credentials to unlock full generative capabilities.`;
                }
            }

            const aiMsg: ChatMessage = {
                id: generateHash(),
                role: 'ai',
                content: aiResponseText,
                timestamp: new Date()
            };

            setChatHistory(prev => [...prev, aiMsg]);
            addAuditLog('AI_RESPONSE', `Generated response (${aiResponseText.length} chars)`, 'SUCCESS');

        } catch (error) {
            console.error("AI Error", error);
            addAuditLog('AI_ERROR', 'Failed to generate response', 'ERROR');
            const errorMsg: ChatMessage = {
                id: generateHash(),
                role: 'ai',
                content: "I encountered a quantum interference pattern while processing your request. Please try again.",
                timestamp: new Date()
            };
            setChatHistory(prev => [...prev, errorMsg]);
        } finally {
            setIsTyping(false);
        }
    };

    // --- Render Methods ---

    const renderTransactionDetailsModal = () => {
        if (!selectedTransaction) return null;
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                <div className="bg-gray-900 border border-cyan-500/30 rounded-2xl w-full max-w-lg shadow-2xl shadow-cyan-500/20 overflow-hidden">
                    <div className="bg-gradient-to-r from-gray-900 to-gray-800 p-6 border-b border-gray-700 flex justify-between items-start">
                        <div>
                            <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                <Activity className="text-cyan-400" size={20} />
                                Transaction Details
                            </h3>
                            <p className="text-gray-400 text-sm mt-1 font-mono">{selectedTransaction.id}</p>
                        </div>
                        <button 
                            onClick={() => setSelectedTransaction(null)}
                            className="text-gray-400 hover:text-white transition-colors"
                        >
                            <XCircle size={24} />
                        </button>
                    </div>
                    <div className="p-6 space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-gray-800/50 p-4 rounded-xl border border-gray-700">
                                <span className="text-gray-500 text-xs uppercase tracking-wider">Amount</span>
                                <div className={`text-2xl font-bold mt-1 ${selectedTransaction.type === 'income' ? 'text-emerald-400' : 'text-white'}`}>
                                    {selectedTransaction.type === 'income' ? '+' : '-'}${selectedTransaction.amount.toLocaleString()}
                                </div>
                            </div>
                            <div className="bg-gray-800/50 p-4 rounded-xl border border-gray-700">
                                <span className="text-gray-500 text-xs uppercase tracking-wider">Date</span>
                                <div className="text-xl font-bold text-white mt-1">
                                    {new Date(selectedTransaction.date).toLocaleDateString()}
                                </div>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <div className="flex justify-between items-center py-2 border-b border-gray-800">
                                <span className="text-gray-400">Category</span>
                                <span className="text-white font-medium">{selectedTransaction.category}</span>
                            </div>
                            <div className="flex justify-between items-center py-2 border-b border-gray-800">
                                <span className="text-gray-400">Status</span>
                                <span className="text-cyan-400 font-bold flex items-center gap-1">
                                    <ShieldCheck size={14} /> Cleared
                                </span>
                            </div>
                            <div className="flex justify-between items-center py-2 border-b border-gray-800">
                                <span className="text-gray-400">Carbon Footprint</span>
                                <span className="text-emerald-400 font-medium flex items-center gap-1">
                                    <Globe size={14} /> {selectedTransaction.carbonFootprint || '0.0'} kg CO2e
                                </span>
                            </div>
                        </div>

                        <div className="bg-cyan-900/20 border border-cyan-500/20 p-4 rounded-xl">
                            <div className="flex items-center gap-2 text-cyan-400 mb-2">
                                <Bot size={16} />
                                <span className="font-bold text-sm">AI Analysis</span>
                            </div>
                            <p className="text-cyan-100/80 text-sm leading-relaxed">
                                This transaction aligns with your historical spending patterns for {selectedTransaction.category}. 
                                No anomalies detected. Vendor reputation score is 98/100.
                            </p>
                        </div>
                    </div>
                    <div className="p-4 bg-gray-900 border-t border-gray-800 flex justify-end gap-3">
                        <button className="px-4 py-2 rounded-lg bg-gray-800 text-white hover:bg-gray-700 transition-colors text-sm font-medium">
                            Dispute
                        </button>
                        <button className="px-4 py-2 rounded-lg bg-cyan-600 text-white hover:bg-cyan-500 transition-colors text-sm font-medium shadow-lg shadow-cyan-500/20">
                            Download Receipt
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="relative">
            {renderTransactionDetailsModal()}
            
            <Card 
                title={`${COMPANY_NAME} Ledger`}
                subtitle="Real-time High-Frequency Transaction Monitoring"
                icon={<Database className="text-cyan-400" />}
                headerActions={[
                    { 
                        id: 'ai-toggle', 
                        icon: <Bot className={isAiActive ? "text-cyan-400 animate-pulse" : ""} />, 
                        label: 'Toggle AI Assistant', 
                        onClick: () => setIsAiActive(!isAiActive) 
                    },
                    { 
                        id: 'audit-toggle', 
                        icon: <Terminal className={showAudit ? "text-green-400" : ""} />, 
                        label: 'Toggle Audit Log', 
                        onClick: () => setShowAudit(!showAudit) 
                    },
                    { id: 'export', icon: <Download />, label: 'Export Data', onClick: () => addAuditLog('EXPORT', 'User requested JSON export', 'SUCCESS') }
                ]}
                className="overflow-hidden border-t-4 border-t-cyan-500"
            >
                <div className="flex flex-col lg:flex-row gap-6 h-[700px]">
                    
                    {/* LEFT COLUMN: Transaction List */}
                    <div className={`flex-1 flex flex-col transition-all duration-500 ${isAiActive ? 'lg:w-2/3' : 'w-full'}`}>
                        
                        {/* Toolbar */}
                        <div className="flex items-center gap-4 mb-4 p-1">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                                <input 
                                    type="text" 
                                    placeholder="Search ledger by keyword, amount, or ID..." 
                                    value={searchTerm}
                                    onChange={handleSearch}
                                    className="w-full bg-gray-900/50 border border-gray-700 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all placeholder:text-gray-600"
                                />
                            </div>
                            <button className="p-2.5 bg-gray-800 hover:bg-gray-700 rounded-xl border border-gray-700 text-gray-400 hover:text-white transition-colors">
                                <Filter size={18} />
                            </button>
                            <button className="p-2.5 bg-gray-800 hover:bg-gray-700 rounded-xl border border-gray-700 text-gray-400 hover:text-white transition-colors">
                                <RefreshCw size={18} />
                            </button>
                        </div>

                        {/* List */}
                        <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-2">
                            {filteredTransactions.map((tx, index) => (
                                <div 
                                    key={tx.id} 
                                    className="group relative overflow-hidden rounded-2xl bg-gray-800/30 border border-gray-700/50 hover:bg-gray-800/60 hover:border-cyan-500/30 transition-all duration-300 cursor-pointer"
                                    onClick={() => {
                                        setSelectedTransaction(tx);
                                        addAuditLog('VIEW_TX', `User viewed details for ${tx.id}`, 'SUCCESS');
                                    }}
                                    style={{ animationDelay: `${index * 50}ms` }}
                                >
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                                    
                                    <div className="flex items-center justify-between p-4 relative z-10">
                                        <div className="flex items-center gap-4">
                                            <TransactionIcon type={tx.type} />
                                            <div className="min-w-0">
                                                <div className="flex items-center gap-2">
                                                    <p className="font-bold text-gray-100 group-hover:text-cyan-300 transition-colors truncate max-w-[200px]">
                                                        {tx.description}
                                                    </p>
                                                    <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-gray-700 text-gray-300 border border-gray-600">
                                                        {tx.category}
                                                    </span>
                                                </div>
                                                <div className="flex flex-wrap items-center gap-3 mt-1.5">
                                                    <span className="text-[10px] font-mono text-gray-500 uppercase tracking-wider">{tx.date}</span>
                                                    <ProvenanceBadge confidence={tx.aiCategoryConfidence || 0.98} />
                                                    {tx.carbonFootprint && (
                                                        <span className="text-[10px] text-emerald-500/70 flex items-center gap-1 font-bold">
                                                            <Globe size={10} /> {tx.carbonFootprint}kg
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className={`text-lg font-black font-mono tracking-tighter ${tx.type === 'income' ? 'text-emerald-400' : 'text-gray-100'}`}>
                                                {tx.type === 'income' ? '+' : '-'}${tx.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                            </p>
                                            <div className="flex items-center justify-end gap-2 mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                                <span className="text-[10px] text-cyan-500 font-medium uppercase tracking-widest">View Details</span>
                                                <ChevronRight size={12} className="text-cyan-500" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            
                            {filteredTransactions.length === 0 && (
                                <div className="flex flex-col items-center justify-center h-64 text-gray-500 border-2 border-dashed border-gray-800 rounded-2xl">
                                    <Search size={48} className="mb-4 opacity-20" />
                                    <p className="text-lg font-medium">No transactions found</p>
                                    <p className="text-sm">Try adjusting your search filters</p>
                                </div>
                            )}
                        </div>

                        {/* Audit Terminal (Collapsible) */}
                        {showAudit && (
                            <div className="mt-4 animate-in slide-in-from-bottom-4 fade-in duration-300">
                                <AuditTerminal logs={auditLogs} />
                            </div>
                        )}
                    </div>

                    {/* RIGHT COLUMN: AI Assistant (Collapsible) */}
                    {isAiActive && (
                        <div className="w-full lg:w-1/3 flex flex-col bg-gray-900/80 border-l border-gray-800/50 backdrop-blur-xl rounded-2xl overflow-hidden shadow-2xl animate-in slide-in-from-right-10 fade-in duration-300">
                            {/* AI Header */}
                            <div className="p-4 border-b border-gray-800 bg-gradient-to-r from-gray-900 to-gray-800 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="relative">
                                        <div className="w-10 h-10 rounded-full bg-cyan-500/20 flex items-center justify-center border border-cyan-500/30">
                                            <Bot size={20} className="text-cyan-400" />
                                        </div>
                                        <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-gray-900 animate-pulse" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-white text-sm">Quantum Core</h3>
                                        <p className="text-xs text-cyan-400/80 font-mono">Online • v4.2.0</p>
                                    </div>
                                </div>
                                <button onClick={() => setIsAiActive(false)} className="text-gray-500 hover:text-white">
                                    <XCircle size={18} />
                                </button>
                            </div>

                            {/* Chat History */}
                            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-900/50 custom-scrollbar">
                                {chatHistory.map((msg) => (
                                    <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                        <div className={`
                                            max-w-[85%] rounded-2xl p-3 text-sm leading-relaxed shadow-lg
                                            ${msg.role === 'user' 
                                                ? 'bg-cyan-600 text-white rounded-tr-none' 
                                                : 'bg-gray-800 text-gray-200 border border-gray-700 rounded-tl-none'}
                                        `}>
                                            {msg.role === 'ai' && (
                                                <div className="flex items-center gap-2 mb-1 text-xs font-bold text-cyan-400/80 uppercase tracking-wider">
                                                    <Sparkles size={10} /> AI Analysis
                                                </div>
                                            )}
                                            {msg.content}
                                            <div className={`text-[10px] mt-2 opacity-50 ${msg.role === 'user' ? 'text-cyan-100' : 'text-gray-500'}`}>
                                                {msg.timestamp.toLocaleTimeString()}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                {isTyping && (
                                    <div className="flex justify-start">
                                        <div className="bg-gray-800 rounded-2xl rounded-tl-none p-4 border border-gray-700 flex gap-1">
                                            <div className="w-2 h-2 bg-cyan-500/50 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                            <div className="w-2 h-2 bg-cyan-500/50 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                            <div className="w-2 h-2 bg-cyan-500/50 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                                        </div>
                                    </div>
                                )}
                                <div ref={chatEndRef} />
                            </div>

                            {/* Input Area */}
                            <div className="p-4 bg-gray-900 border-t border-gray-800">
                                <form onSubmit={handleAiSubmit} className="relative">
                                    <input
                                        type="text"
                                        value={chatInput}
                                        onChange={(e) => setChatInput(e.target.value)}
                                        placeholder="Ask Quantum Core about your finances..."
                                        className="w-full bg-gray-800 border border-gray-700 rounded-xl py-3 pl-4 pr-12 text-sm text-white focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all placeholder:text-gray-500"
                                    />
                                    <button 
                                        type="submit"
                                        disabled={!chatInput.trim() || isTyping}
                                        className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-cyan-500/20 hover:bg-cyan-500 text-cyan-400 hover:text-white rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <Send size={16} />
                                    </button>
                                </form>
                                <div className="mt-2 flex justify-center gap-4 text-[10px] text-gray-600 font-mono">
                                    <span className="flex items-center gap-1"><Lock size={8} /> End-to-End Encrypted</span>
                                    <span className="flex items-center gap-1"><Cpu size={8} /> Gemini Flash Engine</span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </Card>
        </div>
    );
};

export default RecentTransactions;

================================================================================
// APPENDED FROM REPO: diplomat-bit/Citibank_Demo_Business_Inc_Demonstration- | ORIGINAL PATH: diplomat-bit-Citibank_Demo_Business_Inc_Demonstration--ab2501d/components/RecentTransactions.tsx
================================================================================


// components/RecentTransactions.tsx
import React, { useContext, useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { DataContext } from '../context/DataContext';
import { View } from '../types';
import Card from './Card';

// --- NEW TYPES AND INTERFACES ---

// Expanded Transaction type to include many new features
export interface AugmentedTransaction {
    id: string;
    description: string;
    amount: number;
    type: 'income' | 'expense';
    category: string;
    date: string; // ISO date string preferred for consistency
    carbonFootprint?: number;
    merchantId?: string;
    location?: { lat: number; lon: number; name?: string; geohash?: string; timezone?: string };
    sentiment?: 'positive' | 'neutral' | 'negative' | 'mixed';
    attachments?: { type: 'receipt' | 'invoice' | 'note' | 'media' | 'contract'; url: string; preview?: string; sizeKB?: number; uploadedBy?: string; uploadDate?: string }[];
    notes?: string;
    isRecurring?: boolean;
    recurringPaymentId?: string;
    recurrencePattern?: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly' | 'custom';
    splitParticipants?: { userId: string; amount: number; status: 'pending' | 'completed' | 'declined'; sharePercentage?: number }[];
    flaggedForReview?: boolean; // e.g., by anomaly detection
    ethicalScore?: { environment: number; labor: number; community: number; governance: number; overall: number; breakdown?: { [key: string]: number } };
    aiRecommendation?: string; // e.g., "Consider switching to 'EcoBank' for better rates."
    spendingImpactMetric?: {
        netWorthChange: number;
        budgetCategoryAllocation?: { category: string; spent: number; budget: number; remaining: number; percentage: number };
        financialGoalProgress?: { goalId: string; progressDelta: number; newProgressPercentage: number };
        cashFlowImpact?: number;
        liquidityEffect?: 'high' | 'medium' | 'low';
    };
    loyaltyPointsEarned?: { program: string; points: number; multiplier?: number; status?: 'pending' | 'credited' }[];
    taxImplications?: { isDeductible: boolean; taxCategory?: string; estimatedSaving?: number; requiredDocumentation?: string[] };
    blockchainRef?: string; // For future proofing with distributed ledgers
    quantumSecurityStatus?: 'encrypted' | 'quantum-encrypted' | 'legacy-encrypted' | 'unencrypted' | 'breached';
    dataAuditTrail?: { timestamp: string; action: string; userId: string; details?: string; ipAddress?: string }[];
    regulatoryCompliance?: { status: 'compliant' | 'non-compliant' | 'pending-review'; regulation?: string; details?: string; severity?: 'low' | 'medium' | 'high' };
    realtimeMarketImpact?: { asset: string; priceChange: number; holdingChange?: number; portfolioValueChange?: number }[]; // e.g., if a purchase affects a stock you hold
    hapticFeedbackPattern?: string; // e.g., 'short-buzz', 'long-vibration', 'triple-tap'
    neuroSensoryEnhancement?: { visualEffect: string; auditoryCue: string; intensity?: number }; // For immersive UIs
    semanticTags?: string[]; // e.g., #sustainable #local #investment #digital_good
    linkedAssets?: { assetId: string; type: string; impact: 'positive' | 'negative' | 'neutral'; valueChange?: number }[]; // e.g., links to a stock buy
    carbonOffsetPurchase?: { amount: number; project: string; status: 'pending' | 'completed' | 'failed'; certificateUrl?: string; offsetDate?: string };
    localizedCurrency?: { currencyCode: string; amount: number; exchangeRate: number; baseCurrencyAmount?: number }; // Original amount if converted
    voiceCommandLog?: { command: string; timestamp: string; recognizedIntent?: string; confidence?: number }[];
    userFeedback?: { rating: number; comment: string; timestamp: string; sentiment?: 'positive' | 'negative' }[];
    contextualMetadata?: { device: string; ipAddress: string; browser: string; appVersion: string; biometricAuthUsed?: boolean };
    anomalyType?: 'high_spending' | 'unusual_location' | 'new_merchant' | 'fraud_risk' | 'duplicate_transaction' | 'unusual_time';
    predictedFutureImpact?: { carbon: number; savings: number; budgetStrain: number; financialRiskScore: number };
    merchantRatingByUser?: number; // 1-5 stars
    categorizationConfidence?: number; // 0-1, confidence of AI category
    financialHealthScoreDelta?: number; // How this transaction impacts overall score
    gamificationPointsAwarded?: number;
    blockchainTransactionId?: string; // If it's crypto related
    linkedSmartContract?: { contractId: string; functionCalled: string; status: 'executed' | 'pending' | 'failed' }[];
    privacyEnhancementLevel?: 'default' | 'anonymized' | 'private_compute';
    regulatoryFlagReason?: string;
    geospatialContext?: { weather?: string; localEvent?: string }; // e.g., "sunny", "local festival"
    supplyChainTraceability?: { productId: string; supplierInfo: string; ethicalCertifications: string[] }[]; // For products purchased
    digitalAssetFingerprint?: string; // For digital goods, unique identifier
    quantumResistanceProof?: string; // Cryptographic proof of quantum resistance
    biometricApprovalStatus?: 'approved' | 'pending' | 'rejected';
    crossDimensionalAnalyticsTag?: string; // For hypothetical multi-dimensional data analysis
}

// Global user preferences for personalized features
export interface UserPreferences {
    enableAIInsights: boolean;
    enableGamification: boolean;
    enableCarbonTracking: boolean;
    preferredCurrency: string;
    hapticFeedbackEnabled: boolean;
    neuroSensoryEnabled: boolean;
    privacyLevel: 'low' | 'medium' | 'high' | 'quantum_secure_only';
    defaultViewPreset: string; // e.g., 'Eco-conscious', 'Budget-focused', 'Investment-centric', 'Privacy-Maximized'
    notificationSettings: {
        anomalyAlerts: boolean;
        budgetExceeded: boolean;
        ethicalWarnings: boolean;
        transactionSummary: boolean;
        goalProgress: boolean;
        securityAlerts: boolean;
    };
    linkedAccounts: { type: string; id: string; status: 'active' | 'inactive'; lastSynced: string; integrationVersion?: string }[];
    customCategories: string[];
    dataRetentionPolicy: '7y' | '10y' | 'forever' | 'on_demand_delete';
    voiceCommandEnabled: boolean;
    themePreference: 'dark' | 'light' | 'amoled';
    accessibilityMode: 'default' | 'high_contrast' | 'dyslexia_friendly';
    language: string;
}

// AI Model Interface
export interface AIModelStatus {
    modelId: string;
    version: string;
    lastUpdated: string;
    status: 'training' | 'active' | 'inactive' | 'error' | 'deprecated';
    accuracyScore?: number;
    latencyMs?: number;
    inferenceCount?: number;
    nextScheduledUpdate?: string;
    modelProvider?: string;
}

// Financial Goal Interface
export interface FinancialGoal {
    id: string;
    name: string;
    targetAmount: number;
    currentAmount: number;
    startDate: string;
    endDate: string;
    category?: string;
    status: 'active' | 'completed' | 'paused' | 'failed' | 'on_hold';
    priority: 'low' | 'medium' | 'high' | 'critical';
    contributingTransactions: string[]; // IDs of transactions contributing to this goal
    autoContributionPercentage?: number;
    alertsEnabled: boolean;
    visualizerType?: 'line' | 'bar' | 'radial';
}

// Merchant Profile Interface
export interface MerchantProfile {
    id: string;
    name: string;
    description: string;
    ethicalRating?: { environment: number; labor: number; community: number; governance: number; overall: number; lastUpdated?: string };
    carbonFootprintAverage?: number; // Avg footprint per transaction at this merchant
    popularCategories?: string[];
    userReviews?: { userId: string; rating: number; comment: string; timestamp: string }[];
    loyaltyPrograms?: { name: string; link: string; userStatus?: 'member' | 'not_member'; pointsBalance?: number }[];
    contactInfo?: { email?: string; phone?: string; website?: string; socialMedia?: { platform: string; url: string }[] };
    geoFence?: { lat: number; lon: number; radiusKm: number; lastChecked?: string }; // For location-based insights
    businessModel?: 'B2C' | 'B2B' | 'D2C';
    blockchainVerified?: boolean;
    supportedPaymentMethods?: string[];
    AI_predicted_churn_rate?: number; // AI for merchant relationships
}

// User Profile for social and gamification
export interface UserProfile {
    id: string;
    username: string;
    avatarUrl: string;
    level: number;
    experiencePoints: number;
    nextLevelXP: number; // XP required for next level
    badges: { id: string; name: string; earnedDate: string; tier: string; description?: string; iconUrl?: string }[];
    financialGoals: FinancialGoal[];
    socialConnections: string[]; // User IDs
    privacySettings: {
        shareAchievements: boolean;
        shareSpendingTrends: boolean;
        allowDataForCommunityInsights: boolean;
    };
    karmaScore?: number; // For positive financial actions (e.g., carbon offsets, charity)
    streaks?: { type: 'budget_adherence' | 'savings' | 'no_red_carbon'; current: number; longest: number };
    customizationSettings?: {
        transactionIconPack: string; // e.g., 'minimalist', 'vibrant', 'fantasy'
        fontFamily: string;
        accentColor: string;
    };
    recentActivities?: { activity: string; timestamp: string; relatedTxId?: string }[];
}

// --- NEW CONTEXT & HOOKS (Simulated as they would interact with a global state) ---

// This would typically come from a larger context, but for this file, we simulate it.
interface ExpandedDataContextType {
    transactions: AugmentedTransaction[];
    userPreferences: UserPreferences;
    aiModelsStatus: AIModelStatus[];
    financialGoals: FinancialGoal[];
    merchantProfiles: { [id: string]: MerchantProfile };
    userProfile: UserProfile;
    updateUserPreference: (key: keyof UserPreferences, value: any) => void;
    addTransaction: (tx: AugmentedTransaction) => void;
    // ... many more actions like `fetchMerchantProfile`, `updateFinancialGoal`, etc.
}

// Simulate use of a more comprehensive context
const useExpandedData = (): ExpandedDataContextType => {
    const context = useContext(DataContext); // This is the original context
    const [localTransactions, setLocalTransactions] = useState<AugmentedTransaction[]>(
        (context?.transactions || []).map(tx => ({
            ...tx,
            // Simulate adding some new fields to existing transactions for demonstration
            notes: 'Initial imported transaction. This is a default note added by the advanced system.',
            sentiment: Math.random() > 0.7 ? 'positive' : Math.random() > 0.4 ? 'neutral' : 'negative',
            ethicalScore: { environment: Math.random() * 5, labor: Math.random() * 5, community: Math.random() * 5, governance: Math.random() * 5, overall: Math.random() * 5 },
            aiRecommendation: Math.random() > 0.85 ? 'Consider optimizing your subscriptions.' : Math.random() > 0.7 ? 'This expense aligns with your sustainability goals.' : undefined,
            isRecurring: Math.random() > 0.8,
            carbonOffsetPurchase: Math.random() > 0.9 ? { amount: Math.random() * 5, project: 'Forest Reforestation', status: 'completed', certificateUrl: '#', offsetDate: new Date().toISOString() } : undefined,
            semanticTags: ['essential', Math.random() > 0.5 ? 'personal' : 'business', Math.random() > 0.7 ? 'digital' : 'physical'],
            blockchainRef: `TX${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
            quantumSecurityStatus: Math.random() > 0.8 ? 'quantum-encrypted' : 'encrypted',
            hapticFeedbackPattern: Math.random() > 0.7 ? (Math.random() > 0.5 ? 'short-buzz' : 'long-vibration') : undefined,
            merchantId: Math.random() > 0.5 ? (Math.random() > 0.5 ? 'm1' : 'm2') : undefined,
            flaggedForReview: Math.random() > 0.88,
            anomalyType: Math.random() > 0.95 ? 'fraud_risk' : Math.random() > 0.9 ? 'high_spending' : undefined,
            attachments: Math.random() > 0.7 ? [{ type: 'receipt', url: '#', preview: 'receipt.png' }] : undefined,
            predictedFutureImpact: Math.random() > 0.7 ? { carbon: Math.random() * 20, savings: Math.random() * 100, budgetStrain: Math.random() * 10, financialRiskScore: Math.random() * 5 } : undefined,
            categorizationConfidence: 0.8 + Math.random() * 0.2,
            financialHealthScoreDelta: tx.type === 'income' ? Math.random() * 0.5 + 0.1 : -(Math.random() * 0.5 + 0.1),
            gamificationPointsAwarded: Math.floor(Math.random() * 100),
            neuroSensoryEnhancement: Math.random() > 0.8 ? { visualEffect: 'glow', auditoryCue: Math.random() > 0.5 ? 'chime' : 'click', intensity: Math.floor(Math.random() * 3) + 1 } : undefined,
        }))
    );

    const [userPreferences, setUserPreferences] = useState<UserPreferences>({
        enableAIInsights: true,
        enableGamification: true,
        enableCarbonTracking: true,
        preferredCurrency: 'USD',
        hapticFeedbackEnabled: true,
        neuroSensoryEnabled: false,
        privacyLevel: 'medium',
        defaultViewPreset: 'Eco-conscious',
        notificationSettings: { anomalyAlerts: true, budgetExceeded: true, ethicalWarnings: true, transactionSummary: true, goalProgress: true, securityAlerts: true },
        linkedAccounts: [{ type: 'bank', id: 'bank123', status: 'active', lastSynced: new Date().toISOString() }],
        customCategories: ['Home Maintenance', 'Digital Services'],
        dataRetentionPolicy: '10y',
        voiceCommandEnabled: true,
        themePreference: 'dark',
        accessibilityMode: 'default',
        language: 'en-US',
    });

    const [aiModelsStatus, setAiModelsStatus] = useState<AIModelStatus[]>([
        { modelId: 'tx-categorizer-v3', version: '3.1.2', lastUpdated: '2024-03-10T10:00:00Z', status: 'active', accuracyScore: 0.98, latencyMs: 25, nextScheduledUpdate: '2024-04-10', modelProvider: 'NeuralNetCorp' },
        { modelId: 'anomaly-detector-v2', version: '2.0.5', lastUpdated: '2024-03-05T12:30:00Z', status: 'active', accuracyScore: 0.95, latencyMs: 30, nextScheduledUpdate: '2024-04-05', modelProvider: 'GuardianAI' },
        { modelId: 'carbon-footprint-v1', version: '1.0.1', lastUpdated: '2023-11-20T15:00:00Z', status: 'active', accuracyScore: 0.92, latencyMs: 50, nextScheduledUpdate: '2024-05-01', modelProvider: 'GreenSense' },
        { modelId: 'sentiment-analyzer-v1', version: '1.0.0', lastUpdated: '2024-01-01T08:00:00Z', status: 'active', accuracyScore: 0.88, latencyMs: 40, modelProvider: 'AffectiveAI' },
    ]);

    const [financialGoals, setFinancialGoals] = useState<FinancialGoal[]>([
        { id: 'g1', name: 'Save for House', targetAmount: 100000, currentAmount: 35000, startDate: '2023-01-01', endDate: '2028-12-31', status: 'active', priority: 'high', contributingTransactions: [], alertsEnabled: true, visualizerType: 'radial', autoContributionPercentage: 10 },
        { id: 'g2', name: 'Emergency Fund', targetAmount: 10000, currentAmount: 8500, startDate: '2023-06-01', endDate: '2024-06-01', status: 'active', priority: 'critical', contributingTransactions: [], alertsEnabled: true, visualizerType: 'bar' },
        { id: 'g3', name: 'Carbon Offset Project', targetAmount: 500, currentAmount: 120, startDate: '2024-01-01', endDate: '2024-12-31', status: 'active', priority: 'medium', contributingTransactions: [], alertsEnabled: true, visualizerType: 'line' },
    ]);

    const [merchantProfiles, setMerchantProfiles] = useState<{ [id: string]: MerchantProfile }>({
        'm1': { id: 'm1', name: 'GreenGrocer', description: 'Sustainable grocery store specializing in organic and local produce.', ethicalRating: { environment: 5, labor: 4, community: 5, governance: 4.5, overall: 4.6, lastUpdated: '2024-02-01' }, carbonFootprintAverage: 0.5, popularCategories: ['Groceries', 'Organic'], loyaltyPrograms: [{ name: 'EcoRewards', link: '#', userStatus: 'member', pointsBalance: 1250 }], contactInfo: { website: 'greengrocer.com' }, blockchainVerified: true },
        'm2': { id: 'm2', name: 'TechMart Electronics', description: 'Large electronics retailer offering a wide range of gadgets and home appliances.', ethicalRating: { environment: 2, labor: 3, community: 3, governance: 3, overall: 2.7, lastUpdated: '2024-01-15' }, carbonFootprintAverage: 1.2, popularCategories: ['Electronics', 'Home Goods'], loyaltyPrograms: [{ name: 'TechPoints', link: '#', userStatus: 'not_member' }], contactInfo: { website: 'techmart.com' } },
        'm3': { id: 'm3', name: 'Global Cafe', description: 'A local coffee shop with a focus on fair trade beans and community events.', ethicalRating: { environment: 4, labor: 5, community: 5, governance: 4, overall: 4.5, lastUpdated: '2024-03-01' }, carbonFootprintAverage: 0.2, popularCategories: ['Dining', 'Coffee'], supportedPaymentMethods: ['Credit Card', 'Crypto'] },
    });

    const [userProfile, setUserProfile] = useState<UserProfile>({
        id: 'user123',
        username: 'fin_guru_X',
        avatarUrl: 'https://avatar.url/user123.jpg',
        level: 42,
        experiencePoints: 123456,
        nextLevelXP: 130000,
        badges: [
            { id: 'b1', name: 'EcoChampion', earnedDate: '2023-10-15', tier: 'gold', description: 'Achieved significant carbon footprint reduction.', iconUrl: 'icon-eco.svg' },
            { id: 'b2', name: 'BudgetMaster', earnedDate: '2024-01-20', tier: 'silver', description: 'Consistently met budget goals for 3 months.', iconUrl: 'icon-budget.svg' },
            { id: 'b3', name: 'AI Apprentice', earnedDate: '2024-03-01', tier: 'bronze', description: 'Used AI insights for 100+ transactions.', iconUrl: 'icon-ai.svg' },
        ],
        financialGoals: financialGoals.map(g => g), // Link existing goals
        socialConnections: ['friend456', 'colleague789'],
        privacySettings: { shareAchievements: true, shareSpendingTrends: false, allowDataForCommunityInsights: true },
        karmaScore: 850,
        streaks: { type: 'budget_adherence', current: 5, longest: 12 },
        customizationSettings: { transactionIconPack: 'vibrant', fontFamily: 'Inter', accentColor: '#8B5CF6' },
        recentActivities: [{ activity: 'Analyzed weekly spending trends.', timestamp: new Date().toISOString() }],
    });

    const updateUserPreference = useCallback((key: keyof UserPreferences, value: any) => {
        setUserPreferences(prev => ({ ...prev, [key]: value }));
    }, []);

    const addTransaction = useCallback((tx: AugmentedTransaction) => {
        setLocalTransactions(prev => [...prev, tx]);
        // Simulate XP gain
        setUserProfile(prev => ({ ...prev, experiencePoints: prev.experiencePoints + (tx.gamificationPointsAwarded || 5) }));
    }, []);

    // Effect to link original context transactions if they update
    useEffect(() => {
        if (context?.transactions) {
            setLocalTransactions(
                context.transactions.map(tx => {
                    const existing = localTransactions.find(ltx => ltx.id === tx.id);
                    return existing ? existing : {
                        ...tx,
                        notes: 'Initial imported transaction. This is a default note added by the advanced system.',
                        sentiment: Math.random() > 0.7 ? 'positive' : Math.random() > 0.4 ? 'neutral' : 'negative',
                        ethicalScore: { environment: Math.random() * 5, labor: Math.random() * 5, community: Math.random() * 5, governance: Math.random() * 5, overall: Math.random() * 5 },
                        aiRecommendation: Math.random() > 0.85 ? 'Consider optimizing your subscriptions.' : Math.random() > 0.7 ? 'This expense aligns with your sustainability goals.' : undefined,
                        isRecurring: Math.random() > 0.8,
                        carbonOffsetPurchase: Math.random() > 0.9 ? { amount: Math.random() * 5, project: 'Forest Reforestation', status: 'completed', certificateUrl: '#', offsetDate: new Date().toISOString() } : undefined,
                        semanticTags: ['essential', Math.random() > 0.5 ? 'personal' : 'business', Math.random() > 0.7 ? 'digital' : 'physical'],
                        blockchainRef: `TX${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
                        quantumSecurityStatus: Math.random() > 0.8 ? 'quantum-encrypted' : 'encrypted',
                        hapticFeedbackPattern: Math.random() > 0.7 ? (Math.random() > 0.5 ? 'short-buzz' : 'long-vibration') : undefined,
                        merchantId: Math.random() > 0.5 ? (Math.random() > 0.5 ? 'm1' : 'm2') : undefined,
                        flaggedForReview: Math.random() > 0.88,
                        anomalyType: Math.random() > 0.95 ? 'fraud_risk' : Math.random() > 0.9 ? 'high_spending' : undefined,
                        attachments: Math.random() > 0.7 ? [{ type: 'receipt', url: '#', preview: 'receipt.png' }] : undefined,
                        predictedFutureImpact: Math.random() > 0.7 ? { carbon: Math.random() * 20, savings: Math.random() * 100, budgetStrain: Math.random() * 10, financialRiskScore: Math.random() * 5 } : undefined,
                        categorizationConfidence: 0.8 + Math.random() * 0.2,
                        financialHealthScoreDelta: tx.type === 'income' ? Math.random() * 0.5 + 0.1 : -(Math.random() * 0.5 + 0.1),
                        gamificationPointsAwarded: Math.floor(Math.random() * 100),
                        neuroSensoryEnhancement: Math.random() > 0.8 ? { visualEffect: 'glow', auditoryCue: Math.random() > 0.5 ? 'chime' : 'click', intensity: Math.floor(Math.random() * 3) + 1 } : undefined,
                    };
                })
            );
        }
    }, [context?.transactions]); // eslint-disable-line react-hooks/exhaustive-deps
    // The above eslint-disable is for demonstration purposes within a single file.
    // In a real app, `localTransactions` would be stable or managed differently to avoid unnecessary re-creation.

    return {
        transactions: localTransactions,
        userPreferences,
        aiModelsStatus,
        financialGoals,
        merchantProfiles,
        userProfile,
        updateUserPreference,
        addTransaction,
    };
};

// --- NEW HELPER COMPONENTS ---

// Expanded TransactionIcon component with more categories, animations, and icon packs
export const TransactionIcon: React.FC<{ category: string; size?: string; animate?: boolean; color?: string; iconPack?: string }> = ({ category, size = "h-5 w-5", animate = false, color = "currentColor", iconPack = 'default' }) => {
    // In a real app, iconPack would dynamically load SVG components
    const defaultIcons: { [key: string]: React.ReactElement } = useMemo(() => ({
        'Dining': <svg xmlns="http://www.w3.org/2000/svg" className={`${size} ${animate ? 'animate-pulse' : ''}`} viewBox="0 0 20 20" fill={color}><path d="M2 6a2 2 0 012-2h12a2 2 0 012 2v2a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" /><path d="M3 12a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" /><path d="M4 15a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1z" /></svg>,
        'Shopping': <svg xmlns="http://www.w3.org/2000/svg" className={`${size} ${animate ? 'animate-bounce' : ''}`} viewBox="0 0 20 20" fill={color}><path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" /></svg>,
        'Transport': <svg xmlns="http://www.w3.org/2000/svg" className={`${size} ${animate ? 'animate-spin' : ''}`} viewBox="0 0 20 20" fill={color}><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM5.5 8a.5.5 0 000 1h9a.5.5 0 000-1h-9z" clipRule="evenodd" /></svg>,
        'Income': <svg xmlns="http://www.w3.org/2000/svg" className={`${size} ${animate ? 'animate-pulse' : ''}`} viewBox="0 0 20 20" fill={color}><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" /></svg>,
        'Groceries': <svg xmlns="http://www.w3.org/2000/svg" className={`${size}`} viewBox="0 0 20 20" fill={color}><path fillRule="evenodd" d="M10 2a1 1 0 011 1v1.125c.916.212 1.674.61 2.31 1.086.299.23.56.491.79.767l1.428 1.785A3.987 3.987 0 0118 9.875V11a1 1 0 01-1 1h-1.125c-.212.916-.61 1.674-1.086 2.31-.23.299-.491.56-.767.79l-1.785 1.428A3.987 3.987 0 0110.125 18H9a1 1 0 01-1-1v-1.125c-.916-.212-.61-1.674-1.086-2.31-.23-.299-.491-.56-.767-.79L3.428 12.31A3.987 3.987 0 012 10.125V9a1 1 0 011-1h1.125c.212-.916.61-1.674 1.086-2.31.23-.299.491-.56.79-.767L8.31 4.572A3.987 3.987 0 019.875 2H10zm-.125 2H9a1 1 0 00-1 1v1a1 1 0 102 0V5a1 1 0 00-1-1z" clipRule="evenodd" /></svg>,
        'Utilities': <svg xmlns="http://www.w3.org/2000/svg" className={`${size}`} viewBox="0 0 20 20" fill={color}><path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v2.055a8.959 8.959 0 013.829 2.197 1 1 0 11-1.422 1.422 6.959 6.959 0 00-3.122-1.583V9a1 1 0 01-2 0V7.091A6.96 6.96 0 005.15 8.514a1 1 0 11-1.422-1.422 8.959 8.959 0 013.829-2.197V2a1 1 0 011.7-.954L10 2.072l.3-.153zM8.423 10.129a1 1 0 01.17 1.09l-.427.854a1.99 1.99 0 00.323 2.176l.79.79a1.99 1.99 0 002.176.323l.854-.427a1 1 0 011.09.17l.218.436a1.99 1.99 0 01-.118 2.083l-.79.79a1.99 1.99 0 01-2.176-.323l-.854.427a1 1 0 01-1.09-.17l-.218-.436a1.99 1.99 0 01.118-2.083l.79-.79a1.99 1.99 0 00-.323-2.176l-.854.427a1 1 0 01-1.09-.17l-.218-.436a1.99 1.99 0 01.118-2.083z" clipRule="evenodd" /></svg>,
        'Healthcare': <svg xmlns="http://www.w3.org/2000/svg" className={`${size}`} viewBox="0 0 20 20" fill={color}><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 000-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v5a1 1 0 11-2 0V8zm0 7a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" /></svg>,
        'Entertainment': <svg xmlns="http://www.w3.org/2000/svg" className={`${size}`} viewBox="0 0 20 20" fill={color}><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" /></svg>,
        'Education': <svg xmlns="http://www.w3.org/2000/svg" className={`${size}`} viewBox="0 0 20 20" fill={color}><path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" /></svg>,
        'Investments': <svg xmlns="http://www.w3.org/2000/svg" className={`${size}`} viewBox="0 0 20 20" fill={color}><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 000-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v5a1 1 0 11-2 0V8zm0 7a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" /></svg>, // Reusing for simplicity
        'Loan Repayment': <svg xmlns="http://www.w3.org/2000/svg" className={`${size}`} viewBox="0 0 20 20" fill={color}><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm-5-8a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z" clipRule="evenodd" /></svg>,
        'Refund': <svg xmlns="http://www.w3.org/2000/svg" className={`${size}`} viewBox="0 0 20 20" fill={color}><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm.707-10.293a1 1 0 00-1.414-1.414l-3 3a1 1 0 000 1.414l3 3a1 1 0 001.414-1.414L9.414 11H13a1 1 0 100-2H9.414l1.293-1.293z" clipRule="evenodd" /></svg>,
        'Travel': <svg xmlns="http://www.w3.org/2000/svg" className={`${size}`} viewBox="0 0 20 20" fill={color}><path fillRule="evenodd" d="M12 1.586l-4 4A2 2 0 007 7.414V16a2 2 0 002 2h2a2 2 0 002-2V7.414a2 2 0 00-.586-1.414l-4-4zM10 3.414L11.586 5H8.414L10 3.414zM10 7a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" /></svg>,
        'Pet Care': <svg xmlns="http://www.w3.org/2000/svg" className={`${size}`} viewBox="0 0 20 20" fill={color}><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" /></svg>,
        'Subscription': <svg xmlns="http://www.w3.org/2000/svg" className={`${size}`} viewBox="0 0 20 20" fill={color}><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0V8a1 1 0 112 0v6zm-2-2a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" /></svg>,
        'Charity': <svg xmlns="http://www.w3.org/2000/svg" className={`${size}`} viewBox="0 0 20 20" fill={color}><path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17.555 17.039l-1.921-2.401A4.962 4.962 0 0013 13h-1.217c.228-.48.423-.974.58-1.488l2.21-3.684a1 1 0 00-.862-1.455l-2.037.288a3.96 3.96 0 00-2.316-1.236 3.961 3.961 0 00-2.784.887L6.03 6.953a1 1 0 00-1.405-.224L1.755 9.176A1 1 0 001.077 10.32l2.399 1.921c-.482.228-.976.423-1.489.58L.32 15.714a1 1 0 00.712 1.484l2.037-.288A3.962 3.962 0 007 18h11a1 1 0 00.555-.225zM13 15a1 1 0 10-2 0v-2a1 1 0 102 0v2z" /></svg>,
        'Cryptocurrency': <svg xmlns="http://www.w3.org/2000/svg" className={`${size}`} viewBox="0 0 20 20" fill={color}><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM5 9h2V7H5a1 1 0 00-1 1v4a1 1 0 001 1h2v-2H5V9zm6 0h2V7h-2a1 1 0 00-1 1v4a1 1 0 001 1h2v-2h-2V9zm-3 7a1 1 0 100-2H8v2h-2a1 1 0 00-1 1v1a1 1 0 001 1h6a1 1 0 001-1v-1a1 1 0 00-1-1h-2v-2z" clipRule="evenodd" /></svg>,
        'Fine Dining': <svg xmlns="http://www.w3.org/2000/svg" className={`${size}`} viewBox="0 0 20 20" fill={color}><path fillRule="evenodd" d="M10 2a8 8 0 100 16 8 8 0 000-16zm-5 7a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1zm0 4a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z" clipRule="evenodd" /></svg>,
        'Default': <svg xmlns="http://www.w3.org/2000/svg" className={`${size}`} viewBox="0 0 20 20" fill={color}><path d="M8.433 7.418c.158-.103.346-.103.504 0l.968.636a.5.5 0 00.744-.582l-.46-1.15a.5.5 0 00-.814-.265L9.2 6.5a.5.5 0 00-.01.527l-.736 1.01a.5.5 0 00.744.582l.968-.636zM10 18a8 8 0 100-16 8 8 0 000 16z" /></svg>,
    }), [size, animate, color]);

    // This would be replaced with a system that loads icon packs
    const getIconsForPack = (pack: string) => {
        if (pack === 'vibrant') {
            // Return a different set of icons, maybe with different styles or more color
            // For now, reuse default for demonstration, but imagine unique SVGs
            return { ...defaultIcons, 'Dining': <svg xmlns="http://www.w3.org/2000/svg" className={`${size} text-pink-400`} viewBox="0 0 24 24" fill="currentColor"><path d="M21 13H3c-.6 0-1-.4-1-1s.4-1 1-1h18c.6 0 1 .4 1 1s-.4 1-1 1zm-1-7h-9c-.6 0-1-.4-1-1s.4-1 1-1h9c.6 0 1 .4 1 1s-.4 1-1 1zm-1 12h-9c-.6 0-1-.4-1-1s.4-1 1-1h9c.6 0 1 .4 1 1s-.4 1-1 1z"/></svg> };
        }
        return defaultIcons;
    };

    const icons = getIconsForPack(iconPack);

    const key = useMemo(() => {
        if (category in icons) return category;
        if (['Salary', 'Freelance', 'Bonus', 'Dividend', 'Interest'].includes(category)) return 'Income';
        if (['Subscription Fee', 'Membership', 'Software License'].includes(category)) return 'Subscription';
        if (['Bank Fees', 'ATM Withdrawal'].includes(category)) return 'Default'; // General finance
        if (['Bitcoin', 'Ethereum', 'NFT Purchase'].includes(category)) return 'Cryptocurrency';
        return 'Default';
    }, [category, icons]);

    return icons[key];
};

export const CarbonFootprintBadge: React.FC<{ value: number; showTrend?: boolean }> = ({ value, showTrend = false }) => {
    const color = value > 20 ? 'bg-red-500/20 text-red-300' : value > 10 ? 'bg-yellow-500/20 text-yellow-300' : 'bg-green-500/20 text-green-300';
    const trendIcon = showTrend && value > 15 ? '⬆️' : showTrend && value < 5 ? '⬇️' : '';
    return <span className={`text-xs font-mono px-1.5 py-0.5 rounded-full ${color}`}>{value.toFixed(1)}kg COâ‚‚ {trendIcon}</span>;
}

export const EthicalScoreBadge: React.FC<{ score: number; type?: 'overall' | 'environment' | 'labor' | 'community' | 'governance' }> = ({ score, type = 'overall' }) => {
    let color = 'bg-gray-500/20 text-gray-300';
    if (score >= 4) color = 'bg-green-500/20 text-green-300';
    else if (score >= 2.5) color = 'bg-yellow-500/20 text-yellow-300';
    else if (score < 2.5) color = 'bg-red-500/20 text-red-300';
    return <span className={`text-xs font-mono px-1.5 py-0.5 rounded-full ${color}`}>{type.slice(0, 1).toUpperCase() + type.slice(1)}: {score.toFixed(1)}/5</span>;
};

export const AISentimentBadge: React.FC<{ sentiment: 'positive' | 'neutral' | 'negative' | 'mixed' }> = ({ sentiment }) => {
    const map = {
        positive: { color: 'bg-green-600/20 text-green-200', icon: '😊' },
        neutral: { color: 'bg-yellow-600/20 text-yellow-200', icon: '😐' },
        negative: { color: 'bg-red-600/20 text-red-200', icon: '😞' },
        mixed: { color: 'bg-orange-600/20 text-orange-200', icon: ' ambivalent' },
    };
    const { color, icon } = map[sentiment];
    return <span className={`text-xs font-mono px-1.5 py-0.5 rounded-full ${color}`}>{icon} {sentiment}</span>;
};

export const AnomalyDetectionBadge: React.FC<{ type: AugmentedTransaction['anomalyType'] }> = ({ type }) => {
    if (!type) return null;
    let text = "Anomaly";
    let color = "bg-red-700/30 text-red-200";
    if (type === 'high_spending') text = 'High Spend';
    if (type === 'unusual_location') text = 'Unusual Loc.';
    if (type === 'new_merchant') text = 'New Merchant';
    if (type === 'fraud_risk') { text = 'FRAUD RISK!'; color = 'bg-red-800/50 text-red-100 animate-pulse'; }
    if (type === 'duplicate_transaction') text = 'Duplicate';
    if (type === 'unusual_time') text = 'Unusual Time';

    return <span className={`text-xs font-mono px-1.5 py-0.5 rounded-full ${color}`}>{text}</span>;
};

export const AIRecommendationBadge: React.FC<{ recommendation: string }> = ({ recommendation }) => {
    return (
        <span className="text-xs font-mono px-1.5 py-0.5 rounded-full bg-blue-600/20 text-blue-200 cursor-help"
            title={recommendation}>
            AI Insight 🧠
        </span>
    );
};

export const RecurringTransactionBadge: React.FC<{ isRecurring: boolean; recurringPaymentId?: string; recurrencePattern?: string }> = ({ isRecurring, recurringPaymentId, recurrencePattern }) => {
    if (!isRecurring) return null;
    return (
        <span className="text-xs font-mono px-1.5 py-0.5 rounded-full bg-purple-600/20 text-purple-200 cursor-pointer"
            title={recurringPaymentId ? `Part of recurring payment: ${recurringPaymentId} (${recurrencePattern || 'N/A'})` : "Recurring Transaction"}>
            🔄 Recurring
        </span>
    );
};

export const FinancialGoalImpact: React.FC<{ impact?: AugmentedTransaction['spendingImpactMetric']['financialGoalProgress'] }> = ({ impact }) => {
    if (!impact) return null;
    const { progressDelta, goalId, newProgressPercentage } = impact;
    const color = progressDelta > 0 ? 'text-green-400' : 'text-orange-400';
    const sign = progressDelta > 0 ? '+' : '';
    return (
        <span className={`text-xs font-mono px-1.5 py-0.5 rounded-full bg-gray-600/20 ${color}`}
            title={`Impacts goal ${goalId || 'N/A'}. New progress: ${newProgressPercentage?.toFixed(1) || 'N/A'}%`}>
            🎯 {sign}{progressDelta.toFixed(2)}% Goal
        </span>
    );
};

export const LoyaltyPointsBadge: React.FC<{ pointsEarned?: AugmentedTransaction['loyaltyPointsEarned'] }> = ({ pointsEarned }) => {
    if (!pointsEarned || pointsEarned.length === 0) return null;
    const totalPoints = pointsEarned.reduce((acc, p) => acc + p.points, 0);
    return (
        <span className="text-xs font-mono px-1.5 py-0.5 rounded-full bg-indigo-600/20 text-indigo-200"
            title={pointsEarned.map(p => `${p.points} ${p.program} (${p.status || 'pending'})`).join(', ')}>
            ✨ {totalPoints} Pts
        </span>
    );
};

export const TaxImplicationFlag: React.FC<{ taxImplications?: AugmentedTransaction['taxImplications'] }> = ({ taxImplications }) => {
    if (!taxImplications || !taxImplications.isDeductible) return null;
    return (
        <span className="text-xs font-mono px-1.5 py-0.5 rounded-full bg-teal-600/20 text-teal-200 cursor-help"
            title={`Potentially tax-deductible under ${taxImplications.taxCategory || 'N/A'}. Est. savings: $${taxImplications.estimatedSaving?.toFixed(2) || 'N/A'}. Docs needed: ${taxImplications.requiredDocumentation?.join(', ') || 'None'}`}>
            🧾 Tax Deductible
        </span>
    );
};

export const QuantumSecurityStatusBadge: React.FC<{ status: AugmentedTransaction['quantumSecurityStatus'] }> = ({ status }) => {
    if (!status) return null;
    const map = {
        'quantum-encrypted': { color: 'bg-purple-800/50 text-purple-200', text: 'Quantum Encrypted' },
        'encrypted': { color: 'bg-green-700/30 text-green-300', text: 'Encrypted' },
        'legacy-encrypted': { color: 'bg-yellow-700/30 text-yellow-300', text: 'Legacy Enc.' },
        'unencrypted': { color: 'bg-red-700/30 text-red-300', text: 'Unencrypted!' },
        'breached': { color: 'bg-black/50 text-red-500 animate-pulse', text: 'BREACHED!' },
    };
    const { color, text } = map[status] || map.unencrypted; // Fallback
    return <span className={`text-xs font-mono px-1.5 py-0.5 rounded-full ${color}`} title={`Data security status: ${text}`}>{text}</span>;
};

export const DataAuditTrailIndicator: React.FC<{ auditTrail?: AugmentedTransaction['dataAuditTrail'] }> = ({ auditTrail }) => {
    if (!auditTrail || auditTrail.length === 0) return null;
    const lastAction = auditTrail[auditTrail.length - 1];
    return (
        <span className="text-xs font-mono px-1.5 py-0.5 rounded-full bg-gray-600/20 text-gray-400 cursor-help"
            title={`Last audit: ${lastAction.action} by ${lastAction.userId} on ${new Date(lastAction.timestamp).toLocaleDateString()}. IP: ${lastAction.ipAddress || 'N/A'}`}>
            🔒 Audited
        </span>
    );
};

export const CarbonOffsetBadge: React.FC<{ offset?: AugmentedTransaction['carbonOffsetPurchase'] }> = ({ offset }) => {
    if (!offset) return null;
    const color = offset.status === 'completed' ? 'bg-emerald-600/20 text-emerald-200' : 'bg-orange-600/20 text-orange-200';
    return (
        <span className={`text-xs font-mono px-1.5 py-0.5 rounded-full ${color}`}
            title={`Offsetting ${offset.amount.toFixed(2)} kg CO₂ via ${offset.project} (${offset.status})`}>
            🌱 Offset
        </span>
    );
};

export const TransactionAttachmentsDisplay: React.FC<{ attachments?: AugmentedTransaction['attachments'] }> = ({ attachments }) => {
    if (!attachments || attachments.length === 0) return null;
    const attachmentCount = attachments.length;
    return (
        <span className="text-xs font-mono px-1.5 py-0.5 rounded-full bg-blue-600/20 text-blue-200 cursor-pointer"
            title={attachments.map(a => `${a.type}: ${a.url} (${a.sizeKB}KB)`).join('\n')}
            onClick={() => console.log('Opening attachments:', attachments)}>
            📎 {attachmentCount}
        </span>
    );
};

export const SemanticTagsDisplay: React.FC<{ tags?: string[] }> = ({ tags }) => {
    if (!tags || tags.length === 0) return null;
    return (
        <div className="flex flex-wrap gap-1 mt-1">
            {tags.map((tag, index) => (
                <span key={index} className="text-xs px-1 py-0.5 rounded-md bg-zinc-700/50 text-zinc-300">
                    #{tag}
                </span>
            ))}
        </div>
    );
};

export const HapticFeedbackController: React.FC<{ pattern?: string; enabled: boolean }> = ({ pattern, enabled }) => {
    const triggerHaptic = useCallback((patt: string) => {
        if (enabled && 'vibrate' in navigator) {
            switch (patt) {
                case 'short-buzz': navigator.vibrate(50); break;
                case 'long-vibration': navigator.vibrate(200); break;
                case 'double-buzz': navigator.vibrate([50, 20, 50]); break;
                case 'triple-tap': navigator.vibrate([30, 10, 30, 10, 30]); break;
                default: navigator.vibrate(50);
            }
        }
    }, [enabled]);

    useEffect(() => {
        if (enabled && pattern) {
            triggerHaptic(pattern);
        }
    }, [pattern, enabled, triggerHaptic]);

    return null; // Purely for side effects
};

export const NeuroSensoryVisualizer: React.FC<{ enhancement?: AugmentedTransaction['neuroSensoryEnhancement']; enabled: boolean; type: AugmentedTransaction['type'] }> = ({ enhancement, enabled, type }) => {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (enabled && enhancement && containerRef.current) {
            const element = containerRef.current;
            const intensityFactor = enhancement.intensity || 1; // Default intensity

            if (enhancement.visualEffect === 'glow') {
                const glowColor = type === 'income' ? 'rgba(134, 239, 172, 0.7)' : 'rgba(248, 113, 113, 0.7)'; // Green or Red
                element.style.boxShadow = `0 0 ${5 * intensityFactor}px ${2 * intensityFactor}px ${glowColor}`;
                element.style.transition = 'box-shadow 0.3s ease-in-out';
            } else if (enhancement.visualEffect === 'pulse') {
                element.style.animation = `pulse-effect ${1.5 / intensityFactor}s infinite alternate`;
                // Add keyframes via a style tag or global CSS for 'pulse-effect'
            }

            if (enhancement.auditoryCue && 'AudioContext' in window) {
                const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
                const audioCtx = new AudioContext();
                const oscillator = audioCtx.createOscillator();
                oscillator.type = 'sine';
                const frequency = type === 'income' ? 880 + (intensityFactor - 1) * 100 : 440 - (intensityFactor - 1) * 50;
                oscillator.frequency.setValueAtTime(frequency, audioCtx.currentTime);
                oscillator.connect(audioCtx.destination);
                oscillator.start();
                oscillator.stop(audioCtx.currentTime + 0.1 * intensityFactor); // Duration scales with intensity
            }
        } else if (containerRef.current) {
            containerRef.current.style.boxShadow = '';
            containerRef.current.style.animation = '';
        }
    }, [enhancement, enabled, type]);

    return <div ref={containerRef} className="absolute inset-0 pointer-events-none rounded-xl"></div>;
};

export const BiometricApprovalStatus: React.FC<{ status?: AugmentedTransaction['biometricApprovalStatus'] }> = ({ status }) => {
    if (!status) return null;
    const map = {
        'approved': { color: 'bg-green-600/20 text-green-200', icon: '✅' },
        'pending': { color: 'bg-yellow-600/20 text-yellow-200 animate-pulse', icon: '⏳' },
        'rejected': { color: 'bg-red-600/20 text-red-200', icon: '❌' },
    };
    const { color, icon } = map[status];
    return <span className={`text-xs font-mono px-1.5 py-0.5 rounded-full ${color}`}>{icon} Bio {status}</span>;
};

export const FinancialHealthScoreImpact: React.FC<{ delta?: number }> = ({ delta }) => {
    if (delta === undefined) return null;
    const color = delta > 0 ? 'text-green-400' : delta < 0 ? 'text-red-400' : 'text-gray-400';
    const sign = delta > 0 ? '+' : '';
    return (
        <span className={`text-xs font-mono px-1.5 py-0.5 rounded-full bg-gray-600/20 ${color}`}
            title={`Impact on Financial Health Score`}>
            ❤️ {sign}{delta.toFixed(2)} FHS
        </span>
    );
};

export const GamificationPointsDisplay: React.FC<{ points?: number }> = ({ points }) => {
    if (!points) return null;
    return (
        <span className="text-xs font-mono px-1.5 py-0.5 rounded-full bg-amber-600/20 text-amber-200"
            title={`Awarded for this transaction`}>
            🌟 {points} XP
        </span>
    );
};

export const PredictiveImpactForecast: React.FC<{ impact?: AugmentedTransaction['predictedFutureImpact'] }> = ({ impact }) => {
    if (!impact) return null;
    return (
        <div className="flex flex-wrap gap-1 mt-1 justify-end">
            <span className="text-xs font-mono px-1 py-0.5 rounded-md bg-gray-700/50 text-gray-400" title="Predicted Carbon Footprint">C: {impact.carbon.toFixed(1)}kg</span>
            <span className="text-xs font-mono px-1 py-0.5 rounded-md bg-gray-700/50 text-gray-400" title="Predicted Savings Impact">S: ${impact.savings.toFixed(2)}</span>
            <span className="text-xs font-mono px-1 py-0.5 rounded-md bg-gray-700/50 text-gray-400" title="Predicted Budget Strain">B: {impact.budgetStrain.toFixed(1)}%</span>
            <span className="text-xs font-mono px-1 py-0.5 rounded-md bg-gray-700/50 text-gray-400" title="Predicted Financial Risk Score">R: {impact.financialRiskScore.toFixed(1)}</span>
        </div>
    );
};

// --- ADVANCED TRANSACTION ITEM ---

export const AdvancedTransactionItem: React.FC<{ tx: AugmentedTransaction; userPreferences: UserPreferences }> = ({ tx, userPreferences }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const { merchantProfiles } = useExpandedData(); // Access merchant profiles

    const merchant = tx.merchantId ? merchantProfiles[tx.merchantId] : undefined;
    const merchantName = merchant?.name || 'Unknown Merchant';
    const transactionRef = useRef<HTMLLIElement>(null);

    const handleExpandToggle = (e: React.MouseEvent) => {
        const target = e.target as HTMLElement;
        // Prevent expanding if clicking on a specific actionable element within the transaction.
        if (target.closest('button') || target.closest('.actionable-badge') || target.closest('.no-expand-toggle')) {
            return;
        }
        setIsExpanded(!isExpanded);
    };

    return (
        <li ref={transactionRef} key={tx.id} className="flex flex-col border-b border-gray-700/50 py-3 last:border-b-0 cursor-pointer relative rounded-xl hover:bg-gray-800/20 transition-all duration-200"
            onClick={handleExpandToggle}
            style={{ fontFamily: userPreferences.customizationSettings?.fontFamily || 'Inter' }}
        >
             {userPreferences.neuroSensoryEnabled && tx.neuroSensoryEnhancement &&
                <NeuroSensoryVisualizer enhancement={tx.neuroSensoryEnhancement} enabled={userPreferences.neuroSensoryEnabled} type={tx.type} />
            }
            {userPreferences.hapticFeedbackEnabled && tx.hapticFeedbackPattern &&
                <HapticFeedbackController pattern={tx.hapticFeedbackPattern} enabled={userPreferences.hapticFeedbackEnabled} />
            }
            <div className="flex items-center justify-between z-10"> {/* Ensure content is above sensory effects */}
                <div className="flex items-center gap-3 flex-grow min-w-0">
                    <div className="w-10 h-10 bg-gray-700/50 rounded-full flex items-center justify-center flex-shrink-0">
                        <TransactionIcon category={tx.category} animate={tx.flaggedForReview || false} iconPack={userPreferences.customizationSettings?.transactionIconPack} />
                    </div>
                    <div className="flex-grow min-w-0">
                        <p className="font-semibold text-white truncate">{tx.description}</p>
                        <p className="text-sm text-gray-400 flex items-center gap-2 flex-wrap truncate">
                            {new Date(tx.date).toLocaleDateString(userPreferences.language)} - <span className="text-gray-300">{merchantName}</span>
                            {tx.location?.name && <span className="ml-1 text-blue-400/70 text-xs truncate">({tx.location.name})</span>}
                            {tx.geospatialContext?.weather && <span className="ml-1 text-sky-400/70 text-xs">☁️ {tx.geospatialContext.weather}</span>}
                            {tx.categorizationConfidence && tx.categorizationConfidence < 0.9 && (
                                <span className="text-xs font-mono px-1.5 py-0.5 rounded-full bg-orange-600/20 text-orange-200 cursor-help no-expand-toggle" title={`AI Confidence: ${(tx.categorizationConfidence * 100).toFixed(0)}%. Review category.`}>🤔 AI Low Conf.</span>
                            )}
                        </p>
                    </div>
                </div>
                <div className="text-right flex flex-col items-end min-w-[140px] flex-shrink-0">
                    <p className={`font-mono font-semibold ${tx.type === 'income' ? 'text-green-400' : 'text-red-400'}`}>
                        {tx.type === 'income' ? '+' : '-'}${tx.amount.toFixed(2)}
                        {tx.localizedCurrency && ` (${tx.localizedCurrency.currencyCode} ${tx.localizedCurrency.amount.toFixed(2)})`}
                    </p>
                    <div className="flex flex-wrap gap-1 mt-1 justify-end">
                        {userPreferences.enableCarbonTracking && tx.carbonFootprint && <CarbonFootprintBadge value={tx.carbonFootprint} showTrend={true} />}
                        {userPreferences.enableAIInsights && tx.sentiment && <AISentimentBadge sentiment={tx.sentiment} />}
                        {userPreferences.enableAIInsights && tx.flaggedForReview && tx.anomalyType && <AnomalyDetectionBadge type={tx.anomalyType} />}
                        {userPreferences.enableAIInsights && tx.aiRecommendation && <AIRecommendationBadge recommendation={tx.aiRecommendation} />}
                        {tx.isRecurring && <RecurringTransactionBadge isRecurring={tx.isRecurring} recurringPaymentId={tx.recurringPaymentId} recurrencePattern={tx.recurrencePattern} />}
                        {tx.ethicalScore && userPreferences.defaultViewPreset === 'Eco-conscious' && <EthicalScoreBadge score={tx.ethicalScore.overall} />}
                        {tx.spendingImpactMetric?.financialGoalProgress && <FinancialGoalImpact impact={tx.spendingImpactMetric.financialGoalProgress} />}
                        {tx.loyaltyPointsEarned && <LoyaltyPointsBadge pointsEarned={tx.loyaltyPointsEarned} />}
                        {tx.taxImplications?.isDeductible && <TaxImplicationFlag taxImplications={tx.taxImplications} />}
                        {tx.quantumSecurityStatus && <QuantumSecurityStatusBadge status={tx.quantumSecurityStatus} />}
                        {tx.dataAuditTrail && <DataAuditTrailIndicator auditTrail={tx.dataAuditTrail} />}
                        {tx.carbonOffsetPurchase && <CarbonOffsetBadge offset={tx.carbonOffsetPurchase} />}
                        {tx.attachments && <TransactionAttachmentsDisplay attachments={tx.attachments} />}
                        {tx.biometricApprovalStatus && <BiometricApprovalStatus status={tx.biometricApprovalStatus} />}
                        {userPreferences.enableGamification && tx.gamificationPointsAwarded && <GamificationPointsDisplay points={tx.gamificationPointsAwarded} />}
                        {tx.financialHealthScoreDelta !== undefined && <FinancialHealthScoreImpact delta={tx.financialHealthScoreDelta} />}
                    </div>
                    {tx.predictedFutureImpact && userPreferences.enableAIInsights && <PredictiveImpactForecast impact={tx.predictedFutureImpact} />}
                </div>
            </div>

            {isExpanded && (
                <div className="pl-12 pt-2 text-sm text-gray-300 z-10">
                    {tx.notes && <p className="mt-1"><span className="font-bold text-gray-200">Notes:</span> {tx.notes}</p>}
                    {tx.description && <p className="mt-1"><span className="font-bold text-gray-200">Full Description:</span> {tx.description}</p>}
                    {merchant && (
                        <div className="mt-2 p-2 bg-gray-800/50 rounded-md">
                            <p className="font-bold text-gray-200">Merchant Profile: {merchant.name} {merchant.blockchainVerified && <span className="text-blue-400 text-xs ml-1">✓ Blockchain Verified</span>}</p>
                            <p className="text-gray-400 text-xs italic">{merchant.description}</p>
                            {merchant.ethicalRating && (
                                <div className="flex flex-wrap gap-1 mt-1">
                                    <EthicalScoreBadge score={merchant.ethicalRating.environment} type="environment" />
                                    <EthicalScoreBadge score={merchant.ethicalRating.labor} type="labor" />
                                    <EthicalScoreBadge score={merchant.ethicalRating.community} type="community" />
                                    <EthicalScoreBadge score={merchant.ethicalRating.governance} type="governance" />
                                    <EthicalScoreBadge score={merchant.ethicalRating.overall} type="overall" />
                                </div>
                            )}
                            {merchant.loyaltyPrograms && merchant.loyaltyPrograms.length > 0 && (
                                <p className="text-gray-400 mt-1">Loyalty Programs: {merchant.loyaltyPrograms.map(p => `${p.name} (${p.userStatus === 'member' ? `${p.pointsBalance || 0} pts` : 'not member'})`).join(', ')}</p>
                            )}
                             {merchant.contactInfo?.website && <p className="text-gray-400 mt-1">Website: <a href={merchant.contactInfo.website} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">{merchant.contactInfo.website}</a></p>}
                        </div>
                    )}
                    {tx.semanticTags && <SemanticTagsDisplay tags={tx.semanticTags} />}

                    <div className="mt-3 flex flex-wrap gap-2">
                        <button className="px-3 py-1 text-xs bg-blue-700/50 hover:bg-blue-600/50 rounded-md transition actionable-badge">
                            Edit Transaction
                        </button>
                        {tx.flaggedForReview && (
                            <button className="px-3 py-1 text-xs bg-orange-700/50 hover:bg-orange-600/50 rounded-md transition actionable-badge">
                                Review Anomaly
                            </button>
                        )}
                        {tx.isRecurring && (
                            <button className="px-3 py-1 text-xs bg-purple-700/50 hover:bg-purple-600/50 rounded-md transition actionable-badge">
                                Manage Recurring
                            </button>
                        )}
                        {tx.splitParticipants && tx.splitParticipants.length > 0 && (
                            <button className="px-3 py-1 text-xs bg-indigo-700/50 hover:bg-indigo-600/50 rounded-md transition actionable-badge">
                                View Split ({tx.splitParticipants.filter(p => p.status === 'pending').length} pending)
                            </button>
                        )}
                        {tx.blockchainRef && (
                             <button className="px-3 py-1 text-xs bg-sky-700/50 hover:bg-sky-600/50 rounded-md transition actionable-badge"
                                onClick={() => alert(`Opening blockchain explorer for ${tx.blockchainRef}`)}>
                                View Blockchain
                            </button>
                        )}
                        {tx.realtimeMarketImpact && tx.realtimeMarketImpact.length > 0 && (
                             <button className="px-3 py-1 text-xs bg-lime-700/50 hover:bg-lime-600/50 rounded-md transition actionable-badge"
                                onClick={() => alert(`Showing market impact for: ${tx.realtimeMarketImpact.map(i => i.asset).join(', ')}`)}>
                                Market Impact
                            </button>
                        )}
                        {tx.linkedSmartContract && tx.linkedSmartContract.length > 0 && (
                            <button className="px-3 py-1 text-xs bg-cyan-700/50 hover:bg-cyan-600/50 rounded-md transition actionable-badge">
                                Smart Contract Details
                            </button>
                        )}
                        <button className="px-3 py-1 text-xs bg-gray-700/50 hover:bg-gray-600/50 rounded-md transition actionable-badge">
                            Dispute Transaction
                        </button>
                    </div>
                </div>
            )}
        </li>
    );
};

// --- MAIN COMPONENT ---

export const RecentTransactions: React.FC<{ setActiveView: (view: View) => void }> = ({ setActiveView }) => {
    const { transactions, userPreferences, aiModelsStatus, financialGoals, userProfile, updateUserPreference } = useExpandedData();

    // Memoized and filtered transactions
    const displayedTransactions = useMemo(() => {
        // Implement advanced filtering, sorting, and search based on userPreferences or external inputs
        let filtered = transactions;

        // Example: Filter by privacy level
        if (userPreferences.privacyLevel === 'quantum_secure_only') {
            filtered = filtered.filter(tx => tx.quantumSecurityStatus === 'quantum-encrypted');
        } else if (userPreferences.privacyLevel === 'high') {
             filtered = filtered.filter(tx => tx.quantumSecurityStatus !== 'unencrypted');
        }

        // Example: Filter by view preset
        if (userPreferences.defaultViewPreset === 'Eco-conscious') {
            filtered = filtered.sort((a, b) => (b.carbonFootprint || 0) - (a.carbonFootprint || 0));
        } else if (userPreferences.defaultViewPreset === 'Budget-focused') {
            // Sort by impact on budget or highlight transactions that push limits
        }

        // Add more complex filtering/sorting logic here
        return filtered.slice(0, 10); // Display top 10 for expansion demo
    }, [transactions, userPreferences.privacyLevel, userPreferences.defaultViewPreset]);


    // Simulation of AI insights processing
    const aiInsightSummary = useMemo(() => {
        if (!userPreferences.enableAIInsights) return null;
        const totalExpense = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
        const highCarbonTx = transactions.filter(t => (t.carbonFootprint || 0) > 15);
        const recurringCount = transactions.filter(t => t.isRecurring).length;
        const potentialFraud = transactions.filter(t => t.anomalyType === 'fraud_risk').length;

        let advice = [];
        if (highCarbonTx.length > 0) advice.push(`You have ${highCarbonTx.length} high-carbon transactions recently. Consider alternatives for better planetary impact.`);
        if (recurringCount > 2) advice.push(`You have ${recurringCount} recurring payments. Review them for potential subscription savings or optimization.`);
        if (totalExpense > 5000) advice.push(`Your spending is high this period. Check your budget allocation and potential overspending triggers!`);
        if (potentialFraud > 0) advice.push(`⚠️ Detected ${potentialFraud} potential fraud risk transactions. Review them immediately.`);
        if (userProfile.experiencePoints >= userProfile.nextLevelXP) advice.push(`Congratulations! You've reached a new Fin-Guru level!`);

        return advice.length > 0 ? advice.join(' | ') : 'No immediate AI insights. Your financial universe is stable.';
    }, [transactions, userPreferences.enableAIInsights, userProfile.experiencePoints, userProfile.nextLevelXP]);


    const cardHeaderActions = useMemo(() => {
        const actions = [
            { id: 'view-all', label: 'View All', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" /></svg>, onClick: () => setActiveView(View.Transactions) },
            { id: 'add-tx', label: 'Add New', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>, onClick: () => console.log('Open Add Transaction Modal') },
            { id: 'filter', label: 'Filter', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" /></svg>, onClick: () => console.log('Open Filter Modal') },
            { id: 'search', label: 'Search', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>, onClick: () => console.log('Open Search Bar') },
        ];
        if (userPreferences.enableGamification) {
            actions.push({ id: 'leaderboard', label: 'Leaderboard', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.329 1.176l1.519 4.674c.3.921-.755 1.688-1.539 1.175l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.784.513-1.838-.254-1.539-1.175l1.519-4.674a1 1 0 00-.329-1.176l-3.976-2.888c-.783-.57-.38-1.81.588-1.81h4.915a1 1 0 00.95-.69l1.519-4.674z" /></svg>, onClick: () => setActiveView(View.Leaderboard || View.Transactions) }); // Assuming a Leaderboard view
        }
        actions.push({ id: 'voice-command', label: 'Voice', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v3a3 3 0 01-3 3z" /></svg>, onClick: () => console.log('Activate Voice Command') });
        return actions;
    }, [setActiveView, userPreferences.enableGamification]);


    if (!transactions) return <div>Loading the Financial Universe...</div>;

    return (
        <Card title="Recent Transactions: A Multiverse Overview" headerActions={cardHeaderActions}>
            {/* AI Insights & Alerts */}
            {userPreferences.enableAIInsights && aiInsightSummary && (
                <div className="mb-4 p-3 bg-indigo-900/40 rounded-lg text-indigo-200 text-sm flex items-start gap-2 border border-indigo-700/50"
                     style={{boxShadow: userPreferences.defaultViewPreset === 'AI-driven' ? '0 0 10px rgba(99, 102, 241, 0.5)' : 'none'}}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m12.728 0l-.707.707M12 21v-1M5.343 17.343l-.707.707m12.728 0l-.707-.707M6.002 10C10.15 10 13 7 13 4c0 3 2.849 6 7 6H6.002zm9.998 0H19c0 3-2.849 6-7 6a8.941 8.941 0 01-2.314-.322M4.657 17.343A8.986 8.986 0 0112 20c4.15 0 7-3 7-6H5.002c-.067 0-.131.004-.196.012l-2.047 2.047a.5.5 0 00.707.707L6.002 10z" /></svg>
                    <p className="flex-grow">{aiInsightSummary}</p>
                    <button className="text-indigo-300 hover:text-indigo-100 text-xs ml-auto shrink-0 no-expand-toggle" onClick={() => console.log('Dismiss AI insight')}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>
            )}

            {/* Dynamic View Preset Information */}
            {userPreferences.defaultViewPreset === 'Eco-conscious' && (
                <div className="mb-4 p-3 bg-emerald-900/40 rounded-lg text-emerald-200 text-sm flex items-center gap-2 border border-emerald-700/50">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clipRule="evenodd" /></svg>
                    <p>Eco-Conscious Mode Active: Prioritizing environmental impact in your feed.</p>
                </div>
            )}
            {userPreferences.defaultViewPreset === 'Privacy-Maximized' && (
                <div className="mb-4 p-3 bg-zinc-900/40 rounded-lg text-zinc-300 text-sm flex items-center gap-2 border border-zinc-700/50">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2h2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" /></svg>
                    <p>Privacy-Maximized Mode Active: Only displaying quantum-encrypted transactions.</p>
                    <button className="text-zinc-400 hover:text-zinc-100 text-xs ml-auto no-expand-toggle" onClick={() => updateUserPreference('privacyLevel', 'high')}>Adjust</button>
                </div>
            )}

            <ul className="space-y-3 divide-y divide-gray-700/50">
                {displayedTransactions.length === 0 ? (
                    <li className="text-gray-400 text-center py-4">No recent transactions to display in this universe based on current filters.</li>
                ) : (
                    displayedTransactions.map(tx => (
                        <AdvancedTransactionItem key={tx.id} tx={tx} userPreferences={userPreferences} />
                    ))
                )}
            </ul>
            {userPreferences.enableGamification && userProfile && (
                <div className="mt-6 p-4 bg-zinc-800/60 rounded-lg text-zinc-300 border border-zinc-700/50">
                    <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
                        Your Fin-Universe Journey: Level {userProfile.level}
                        <span className="text-sm font-normal text-zinc-400">({userProfile.karmaScore || 0} Karma)</span>
                    </h3>
                    <div className="flex items-center gap-2 mb-2">
                        <div className="w-full bg-gray-700 rounded-full h-2.5 relative">
                            <div className="bg-lime-500 h-2.5 rounded-full" style={{ width: `${(userProfile.experiencePoints / userProfile.nextLevelXP) * 100}%` }}></div>
                            <span className="absolute right-0 -top-5 text-xs text-zinc-400">{userProfile.experiencePoints} / {userProfile.nextLevelXP} XP</span>
                        </div>
                    </div>
                    {userProfile.streaks && (
                        <p className="text-sm text-zinc-400 mt-2">
                            🔥 {userProfile.streaks.type === 'budget_adherence' ? 'Budget Adherence' : userProfile.streaks.type === 'savings' ? 'Savings' : 'Carbon Neutral'} Streak: {userProfile.streaks.current} (Longest: {userProfile.streaks.longest})
                        </p>
                    )}
                    <div className="flex flex-wrap gap-2 mt-3">
                        {userProfile.badges.map(badge => (
                            <span key={badge.id} className={`px-2 py-1 text-xs rounded-full font-semibold ${badge.tier === 'gold' ? 'bg-amber-500/30 text-amber-200' : badge.tier === 'silver' ? 'bg-slate-400/30 text-slate-200' : 'bg-zinc-600/30 text-zinc-300'}`}
                                title={badge.description || badge.name}>
                                {badge.iconUrl && <img src={badge.iconUrl} alt={badge.name} className="inline h-3 w-3 mr-1" />}
                                {badge.name}
                            </span>
                        ))}
                    </div>
                    {userProfile.financialGoals.length > 0 && (
                        <div className="mt-3">
                            <p className="font-semibold text-sm mb-1 text-gray-200">Active Goals:</p>
                            <ul className="text-xs space-y-1">
                                {userProfile.financialGoals.map(goal => (
                                    <li key={goal.id} className="flex items-center justify-between bg-zinc-700/30 p-2 rounded-md">
                                        <span>{goal.name}: ${goal.currentAmount.toFixed(2)} / ${goal.targetAmount.toFixed(2)}</span>
                                        <span className={`${goal.status === 'completed' ? 'text-green-400' : goal.priority === 'critical' ? 'text-red-400' : 'text-blue-400'}`}>
                                            {((goal.currentAmount / goal.targetAmount) * 100).toFixed(0)}% ({goal.status})
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            )}

            {aiModelsStatus.length > 0 && (
                <div className="mt-6 p-4 bg-gray-900/40 rounded-lg text-gray-400 text-xs border border-gray-700/50">
                    <h3 className="font-semibold text-gray-300 mb-2">AI Engine Status: Core Intelligences</h3>
                    <ul className="flex flex-wrap gap-x-4 gap-y-1">
                        {aiModelsStatus.map(model => (
                            <li key={model.modelId} className="flex items-center gap-1 w-full md:w-1/2 lg:w-1/3">
                                <span className={`w-2 h-2 rounded-full ${model.status === 'active' ? 'bg-green-500' : model.status === 'training' ? 'bg-yellow-500' : 'bg-red-500'}`}></span>
                                <span>{model.modelId} <span className="text-gray-500 italic">v{model.version}</span> ({model.status})</span>
                                {model.accuracyScore && <span className="text-gray-500">Acc: {(model.accuracyScore * 100).toFixed(1)}%</span>}
                                {model.latencyMs && <span className="text-gray-500">Lat: {model.latencyMs}ms</span>}
                                {model.modelProvider && <span className="text-gray-500 hidden sm:inline">Provider: {model.modelProvider}</span>}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
             {userPreferences.linkedAccounts.length > 0 && (
                <div className="mt-6 p-4 bg-gray-900/40 rounded-lg text-gray-400 text-xs border border-gray-700/50">
                    <h3 className="font-semibold text-gray-300 mb-2">Linked Financial Ecosystems:</h3>
                    <ul className="flex flex-wrap gap-x-4 gap-y-1">
                        {userPreferences.linkedAccounts.map(account => (
                            <li key={account.id} className="flex items-center gap-1">
                                <span className={`w-2 h-2 rounded-full ${account.status === 'active' ? 'bg-blue-500' : 'bg-orange-500'}`}></span>
                                <span>{account.type.charAt(0).toUpperCase() + account.type.slice(1)} ({account.status})</span>
                                <span className="text-gray-500 text-xs">Last Sync: {new Date(account.lastSynced).toLocaleDateString()}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </Card>
    );
};

export default RecentTransactions;


================================================================================
// APPENDED FROM REPO: diplomat-bit/Fuckyou | ORIGINAL PATH: diplomat-bit-Fuckyou-70f83c5/components/RecentTransactions.tsx
================================================================================

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { GoogleGenAI } from "@google/genai";
import Card from './Card';
import { Transaction, View } from '../types';
import { 
    ArrowUpRight, ArrowDownLeft, ShieldCheck, 
    AlertTriangle, Info, Search, FileJson, Share2, FileText,
    Bot, Send, Sparkles, Lock, Activity, Terminal, XCircle,
    Database, Eye, RefreshCw, Cpu, Zap, Globe, Shield,
    ChevronRight, ChevronDown, Filter, Download, CreditCard,
    Wallet, PieChart, TrendingUp, AlertOctagon
} from 'lucide-react';

// ============================================================================
// CONFIGURATION & CONSTANTS
// ============================================================================

const COMPANY_NAME = "Quantum Financial";
const DEMO_MODE = true;

// Sanitized Knowledge Base from the "Golden Ticket" article
const KNOWLEDGE_BASE = `
${COMPANY_NAME} Business Demo: A Comprehensive Guide.
This is a "Golden Ticket" experience. We are letting the user "Test Drive" the car (the code).
It must have "Bells and Whistles" - distinct features, high polish.
It is a "Cheat Sheet" for business banking.
NO PRESSURE environment. Metaphor: Kick the tires. See the engine roar.
Robust Payment & Collection capabilities (Wire, ACH).
Security is non-negotiable (Multi-factor auth simulations, Fraud monitoring).
Reporting & Analytics (Data visualization).
Integration capabilities (ERP, Accounting).
AUDIT STORAGE: Every sensitive action must be logged.
Tone: Elite, Professional, High-Performance, Secure.
${COMPANY_NAME}, a titan in the financial world, offers a suite of business banking solutions designed to streamline operations, enhance security, and support your growth.
Getting a demo is your golden ticket to seeing these powerful features in action before committing.
It’s like test-driving a car – you get to kick the tires, see all the bells and whistles, and ensure it’s the perfect fit for your business needs.
We’ll cover everything from the initial setup to exploring key functionalities and understanding the benefits that come with partnering with a global financial institution like ${COMPANY_NAME}.
A demo allows you to virtually walk through the entire platform. You get to see firsthand how easy it is to manage your accounts, process payments, track expenses, and access sophisticated reporting tools.
This isn’t just about looking at pretty interfaces; it’s about understanding the real-world application of these tools for your specific business.
Are you struggling with international payments? Worried about fraud? Need better insights into your cash flow? A demo lets you ask those specific questions and see how ${COMPANY_NAME}’s solutions can address them.
It’s also a fantastic opportunity to get a feel for the user experience. Is the platform intuitive? Can your team easily navigate it?
The demo provides a no-pressure environment to explore, interact, and evaluate without any commitment.
It’s about empowering yourself with knowledge so you can make an informed decision that aligns with your business goals and operational needs.
Plus, you get to see how ${COMPANY_NAME} integrates with other business tools you might already be using, saving you time and preventing data silos.
This proactive approach to understanding your financial tools can save you a ton of headaches down the line and ensure you’re leveraging the best resources available to drive your business forward.
It’s your chance to see the future of your business finances, laid out before you, in a clear and interactive way.
`;

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

interface AuditLog {
    id: string;
    timestamp: string;
    action: string;
    details: string;
    status: 'SUCCESS' | 'WARNING' | 'ERROR';
    hash: string;
}

interface ChatMessage {
    id: string;
    role: 'user' | 'ai' | 'system';
    content: string;
    timestamp: Date;
    isTyping?: boolean;
}

interface TransactionInsight {
    id: string;
    type: 'risk' | 'opportunity' | 'pattern';
    message: string;
    confidence: number;
}

// ============================================================================
// SUB-COMPONENTS
// ============================================================================

/**
 * Renders a high-fidelity badge for transaction provenance.
 */
const ProvenanceBadge: React.FC<{ confidence: number }> = ({ confidence }) => {
    const isHigh = confidence > 0.9;
    const isMedium = confidence > 0.7 && confidence <= 0.9;
    
    let colorClass = 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20';
    let Icon = ShieldCheck;

    if (isMedium) {
        colorClass = 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
        Icon = AlertTriangle;
    } else if (!isHigh) {
        colorClass = 'bg-red-500/10 text-red-400 border-red-500/20';
        Icon = AlertOctagon;
    }

    return (
        <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-tighter border ${colorClass} shadow-sm backdrop-blur-md`}>
            <Icon size={10} />
            AI Verified: {(confidence * 100).toFixed(0)}%
        </div>
    );
};

/**
 * Renders the transaction type icon with specific styling.
 */
const TransactionIcon: React.FC<{ type: string }> = ({ type }) => {
    const isIncome = type === 'income';
    return (
        <div className={`
            relative p-3 rounded-2xl border shadow-inner transition-all duration-500
            ${isIncome 
                ? 'bg-emerald-900/20 text-emerald-400 border-emerald-500/20 shadow-emerald-900/20' 
                : 'bg-rose-900/20 text-rose-400 border-rose-500/20 shadow-rose-900/20'}
        `}>
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-2xl" />
            {isIncome ? <ArrowDownLeft size={20} /> : <ArrowUpRight size={20} />}
        </div>
    );
};

/**
 * A terminal-like display for audit logs.
 */
const AuditTerminal: React.FC<{ logs: AuditLog[] }> = ({ logs }) => {
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [logs]);

    return (
        <div className="bg-black/80 rounded-lg border border-gray-800 p-4 font-mono text-xs h-48 flex flex-col shadow-inner">
            <div className="flex items-center justify-between mb-2 border-b border-gray-800 pb-2">
                <div className="flex items-center gap-2 text-gray-400">
                    <Terminal size={12} />
                    <span className="uppercase tracking-widest font-bold">Secure Audit Storage</span>
                </div>
                <div className="flex gap-1">
                    <div className="w-2 h-2 rounded-full bg-red-500/50" />
                    <div className="w-2 h-2 rounded-full bg-yellow-500/50" />
                    <div className="w-2 h-2 rounded-full bg-green-500/50" />
                </div>
            </div>
            <div className="flex-1 overflow-y-auto space-y-1 custom-scrollbar" ref={scrollRef}>
                {logs.length === 0 && <span className="text-gray-600 italic">Initializing secure log stream...</span>}
                {logs.map((log) => (
                    <div key={log.id} className="flex gap-2 hover:bg-white/5 p-0.5 rounded">
                        <span className="text-gray-500">[{log.timestamp.split('T')[1].split('.')[0]}]</span>
                        <span className={`font-bold ${
                            log.status === 'SUCCESS' ? 'text-green-400' : 
                            log.status === 'WARNING' ? 'text-yellow-400' : 'text-red-400'
                        }`}>{log.status}</span>
                        <span className="text-cyan-300/80">{log.action}</span>
                        <span className="text-gray-400 truncate flex-1">:: {log.details}</span>
                        <span className="text-gray-600 text-[10px]">{log.hash}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

interface RecentTransactionsProps {
    transactions: Transaction[];
    setActiveView: (view: View) => void;
}

const RecentTransactions: React.FC<RecentTransactionsProps> = ({ transactions, setActiveView }) => {
    // --- State Management ---
    const [searchTerm, setSearchTerm] = useState('');
    const [isAiActive, setIsAiActive] = useState(false);
    const [chatInput, setChatInput] = useState('');
    const [chatHistory, setChatHistory] = useState<ChatMessage[]>([
        { 
            id: 'init', 
            role: 'ai', 
            content: `Welcome to the ${COMPANY_NAME} Ledger. I am the Quantum Core AI. I can analyze your transaction flow, detect anomalies, and provide financial forecasts. How can I assist you today?`, 
            timestamp: new Date() 
        }
    ]);
    const [isTyping, setIsTyping] = useState(false);
    const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
    const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
    const [showAudit, setShowAudit] = useState(false);

    // --- Refs ---
    const chatEndRef = useRef<HTMLDivElement>(null);
    const aiClientRef = useRef<any>(null);

    // --- Initialization ---
    useEffect(() => {
        // Initialize AI Client if key is present
        const apiKey = process.env.GEMINI_API_KEY;
        if (apiKey) {
            try {
                const genAI = new GoogleGenAI({ apiKey }); // Use the provided snippet structure
                aiClientRef.current = genAI;
                addAuditLog('SYSTEM_INIT', 'AI Core initialized with Gemini Flash Preview', 'SUCCESS');
            } catch (e) {
                addAuditLog('SYSTEM_ERROR', 'Failed to initialize AI Core', 'ERROR');
            }
        } else {
            addAuditLog('SYSTEM_WARNING', 'GEMINI_API_KEY not found. Running in simulation mode.', 'WARNING');
        }
    }, []);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [chatHistory, isAiActive]);

    // --- Helpers ---

    const generateHash = () => Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

    const addAuditLog = (action: string, details: string, status: 'SUCCESS' | 'WARNING' | 'ERROR') => {
        const newLog: AuditLog = {
            id: generateHash(),
            timestamp: new Date().toISOString(),
            action,
            details,
            status,
            hash: `0x${generateHash().substring(0, 8)}`
        };
        setAuditLogs(prev => [...prev, newLog]);
    };

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
        if (e.target.value.length > 2) {
            addAuditLog('USER_SEARCH', `Query: "${e.target.value}"`, 'SUCCESS');
        }
    };

    const filteredTransactions = transactions.filter(tx => 
        tx.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tx.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tx.amount.toString().includes(searchTerm)
    );

    // --- AI Logic ---

    const handleAiSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!chatInput.trim()) return;

        const userMsg: ChatMessage = {
            id: generateHash(),
            role: 'user',
            content: chatInput,
            timestamp: new Date()
        };

        setChatHistory(prev => [...prev, userMsg]);
        setChatInput('');
        setIsTyping(true);
        addAuditLog('AI_QUERY', `User asked: "${userMsg.content}"`, 'SUCCESS');

        try {
            let aiResponseText = "";

            if (aiClientRef.current) {
                // REAL AI CALL
                const model = aiClientRef.current.getGenerativeModel({ model: "gemini-1.5-flash" });
                
                // Construct context
                const context = `
                    You are the Quantum Core AI for ${COMPANY_NAME}. 
                    CONTEXT: ${KNOWLEDGE_BASE}
                    CURRENT TRANSACTIONS: ${JSON.stringify(transactions.slice(0, 10))}
                    USER QUERY: ${userMsg.content}
                    INSTRUCTIONS: Be professional, elite, and helpful. Keep answers concise. 
                    If asked about the company, use the provided context. 
                    Do not mention you are a Google AI. You are Quantum Core.
                `;

                const result = await model.generateContent(context);
                const response = await result.response;
                aiResponseText = response.text();
            } else {
                // SIMULATION MODE (Fallback)
                await new Promise(resolve => setTimeout(resolve, 1500));
                if (userMsg.content.toLowerCase().includes('spend') || userMsg.content.toLowerCase().includes('cost')) {
                    aiResponseText = `Based on your ledger, your spending patterns indicate a 12% increase in operational expenses this month. The largest outlier is the Cloud Infrastructure category.`;
                } else if (userMsg.content.toLowerCase().includes('demo') || userMsg.content.toLowerCase().includes('company')) {
                    aiResponseText = `${COMPANY_NAME} offers a "Golden Ticket" experience. We allow you to test drive our banking core with zero pressure. Our security is non-negotiable, and our reporting is top-tier.`;
                } else {
                    aiResponseText = `I've analyzed the request. While I am running in simulation mode (missing API Key), I can confirm that your ledger integrity is 100%. Please verify your credentials to unlock full generative capabilities.`;
                }
            }

            const aiMsg: ChatMessage = {
                id: generateHash(),
                role: 'ai',
                content: aiResponseText,
                timestamp: new Date()
            };

            setChatHistory(prev => [...prev, aiMsg]);
            addAuditLog('AI_RESPONSE', `Generated response (${aiResponseText.length} chars)`, 'SUCCESS');

        } catch (error) {
            console.error("AI Error", error);
            addAuditLog('AI_ERROR', 'Failed to generate response', 'ERROR');
            const errorMsg: ChatMessage = {
                id: generateHash(),
                role: 'ai',
                content: "I encountered a quantum interference pattern while processing your request. Please try again.",
                timestamp: new Date()
            };
            setChatHistory(prev => [...prev, errorMsg]);
        } finally {
            setIsTyping(false);
        }
    };

    // --- Render Methods ---

    const renderTransactionDetailsModal = () => {
        if (!selectedTransaction) return null;
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                <div className="bg-gray-900 border border-cyan-500/30 rounded-2xl w-full max-w-lg shadow-2xl shadow-cyan-500/20 overflow-hidden">
                    <div className="bg-gradient-to-r from-gray-900 to-gray-800 p-6 border-b border-gray-700 flex justify-between items-start">
                        <div>
                            <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                <Activity className="text-cyan-400" size={20} />
                                Transaction Details
                            </h3>
                            <p className="text-gray-400 text-sm mt-1 font-mono">{selectedTransaction.id}</p>
                        </div>
                        <button 
                            onClick={() => setSelectedTransaction(null)}
                            className="text-gray-400 hover:text-white transition-colors"
                        >
                            <XCircle size={24} />
                        </button>
                    </div>
                    <div className="p-6 space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-gray-800/50 p-4 rounded-xl border border-gray-700">
                                <span className="text-gray-500 text-xs uppercase tracking-wider">Amount</span>
                                <div className={`text-2xl font-bold mt-1 ${selectedTransaction.type === 'income' ? 'text-emerald-400' : 'text-white'}`}>
                                    {selectedTransaction.type === 'income' ? '+' : '-'}${selectedTransaction.amount.toLocaleString()}
                                </div>
                            </div>
                            <div className="bg-gray-800/50 p-4 rounded-xl border border-gray-700">
                                <span className="text-gray-500 text-xs uppercase tracking-wider">Date</span>
                                <div className="text-xl font-bold text-white mt-1">
                                    {new Date(selectedTransaction.date).toLocaleDateString()}
                                </div>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <div className="flex justify-between items-center py-2 border-b border-gray-800">
                                <span className="text-gray-400">Category</span>
                                <span className="text-white font-medium">{selectedTransaction.category}</span>
                            </div>
                            <div className="flex justify-between items-center py-2 border-b border-gray-800">
                                <span className="text-gray-400">Status</span>
                                <span className="text-cyan-400 font-bold flex items-center gap-1">
                                    <ShieldCheck size={14} /> Cleared
                                </span>
                            </div>
                            <div className="flex justify-between items-center py-2 border-b border-gray-800">
                                <span className="text-gray-400">Carbon Footprint</span>
                                <span className="text-emerald-400 font-medium flex items-center gap-1">
                                    <Globe size={14} /> {selectedTransaction.carbonFootprint || '0.0'} kg CO2e
                                </span>
                            </div>
                        </div>

                        <div className="bg-cyan-900/20 border border-cyan-500/20 p-4 rounded-xl">
                            <div className="flex items-center gap-2 text-cyan-400 mb-2">
                                <Bot size={16} />
                                <span className="font-bold text-sm">AI Analysis</span>
                            </div>
                            <p className="text-cyan-100/80 text-sm leading-relaxed">
                                This transaction aligns with your historical spending patterns for {selectedTransaction.category}. 
                                No anomalies detected. Vendor reputation score is 98/100.
                            </p>
                        </div>
                    </div>
                    <div className="p-4 bg-gray-900 border-t border-gray-800 flex justify-end gap-3">
                        <button className="px-4 py-2 rounded-lg bg-gray-800 text-white hover:bg-gray-700 transition-colors text-sm font-medium">
                            Dispute
                        </button>
                        <button className="px-4 py-2 rounded-lg bg-cyan-600 text-white hover:bg-cyan-500 transition-colors text-sm font-medium shadow-lg shadow-cyan-500/20">
                            Download Receipt
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="relative">
            {renderTransactionDetailsModal()}
            
            <Card 
                title={`${COMPANY_NAME} Ledger`}
                subtitle="Real-time High-Frequency Transaction Monitoring"
                icon={<Database className="text-cyan-400" />}
                headerActions={[
                    { 
                        id: 'ai-toggle', 
                        icon: <Bot className={isAiActive ? "text-cyan-400 animate-pulse" : ""} />, 
                        label: 'Toggle AI Assistant', 
                        onClick: () => setIsAiActive(!isAiActive) 
                    },
                    { 
                        id: 'audit-toggle', 
                        icon: <Terminal className={showAudit ? "text-green-400" : ""} />, 
                        label: 'Toggle Audit Log', 
                        onClick: () => setShowAudit(!showAudit) 
                    },
                    { id: 'export', icon: <Download />, label: 'Export Data', onClick: () => addAuditLog('EXPORT', 'User requested JSON export', 'SUCCESS') }
                ]}
                className="overflow-hidden border-t-4 border-t-cyan-500"
            >
                <div className="flex flex-col lg:flex-row gap-6 h-[700px]">
                    
                    {/* LEFT COLUMN: Transaction List */}
                    <div className={`flex-1 flex flex-col transition-all duration-500 ${isAiActive ? 'lg:w-2/3' : 'w-full'}`}>
                        
                        {/* Toolbar */}
                        <div className="flex items-center gap-4 mb-4 p-1">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                                <input 
                                    type="text" 
                                    placeholder="Search ledger by keyword, amount, or ID..." 
                                    value={searchTerm}
                                    onChange={handleSearch}
                                    className="w-full bg-gray-900/50 border border-gray-700 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all placeholder:text-gray-600"
                                />
                            </div>
                            <button className="p-2.5 bg-gray-800 hover:bg-gray-700 rounded-xl border border-gray-700 text-gray-400 hover:text-white transition-colors">
                                <Filter size={18} />
                            </button>
                            <button className="p-2.5 bg-gray-800 hover:bg-gray-700 rounded-xl border border-gray-700 text-gray-400 hover:text-white transition-colors">
                                <RefreshCw size={18} />
                            </button>
                        </div>

                        {/* List */}
                        <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-2">
                            {filteredTransactions.map((tx, index) => (
                                <div 
                                    key={tx.id} 
                                    className="group relative overflow-hidden rounded-2xl bg-gray-800/30 border border-gray-700/50 hover:bg-gray-800/60 hover:border-cyan-500/30 transition-all duration-300 cursor-pointer"
                                    onClick={() => {
                                        setSelectedTransaction(tx);
                                        addAuditLog('VIEW_TX', `User viewed details for ${tx.id}`, 'SUCCESS');
                                    }}
                                    style={{ animationDelay: `${index * 50}ms` }}
                                >
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                                    
                                    <div className="flex items-center justify-between p-4 relative z-10">
                                        <div className="flex items-center gap-4">
                                            <TransactionIcon type={tx.type} />
                                            <div className="min-w-0">
                                                <div className="flex items-center gap-2">
                                                    <p className="font-bold text-gray-100 group-hover:text-cyan-300 transition-colors truncate max-w-[200px]">
                                                        {tx.description}
                                                    </p>
                                                    <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-gray-700 text-gray-300 border border-gray-600">
                                                        {tx.category}
                                                    </span>
                                                </div>
                                                <div className="flex flex-wrap items-center gap-3 mt-1.5">
                                                    <span className="text-[10px] font-mono text-gray-500 uppercase tracking-wider">{tx.date}</span>
                                                    <ProvenanceBadge confidence={tx.aiCategoryConfidence || 0.98} />
                                                    {tx.carbonFootprint && (
                                                        <span className="text-[10px] text-emerald-500/70 flex items-center gap-1 font-bold">
                                                            <Globe size={10} /> {tx.carbonFootprint}kg
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className={`text-lg font-black font-mono tracking-tighter ${tx.type === 'income' ? 'text-emerald-400' : 'text-gray-100'}`}>
                                                {tx.type === 'income' ? '+' : '-'}${tx.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                            </p>
                                            <div className="flex items-center justify-end gap-2 mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                                <span className="text-[10px] text-cyan-500 font-medium uppercase tracking-widest">View Details</span>
                                                <ChevronRight size={12} className="text-cyan-500" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            
                            {filteredTransactions.length === 0 && (
                                <div className="flex flex-col items-center justify-center h-64 text-gray-500 border-2 border-dashed border-gray-800 rounded-2xl">
                                    <Search size={48} className="mb-4 opacity-20" />
                                    <p className="text-lg font-medium">No transactions found</p>
                                    <p className="text-sm">Try adjusting your search filters</p>
                                </div>
                            )}
                        </div>

                        {/* Audit Terminal (Collapsible) */}
                        {showAudit && (
                            <div className="mt-4 animate-in slide-in-from-bottom-4 fade-in duration-300">
                                <AuditTerminal logs={auditLogs} />
                            </div>
                        )}
                    </div>

                    {/* RIGHT COLUMN: AI Assistant (Collapsible) */}
                    {isAiActive && (
                        <div className="w-full lg:w-1/3 flex flex-col bg-gray-900/80 border-l border-gray-800/50 backdrop-blur-xl rounded-2xl overflow-hidden shadow-2xl animate-in slide-in-from-right-10 fade-in duration-300">
                            {/* AI Header */}
                            <div className="p-4 border-b border-gray-800 bg-gradient-to-r from-gray-900 to-gray-800 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="relative">
                                        <div className="w-10 h-10 rounded-full bg-cyan-500/20 flex items-center justify-center border border-cyan-500/30">
                                            <Bot size={20} className="text-cyan-400" />
                                        </div>
                                        <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-gray-900 animate-pulse" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-white text-sm">Quantum Core</h3>
                                        <p className="text-xs text-cyan-400/80 font-mono">Online • v4.2.0</p>
                                    </div>
                                </div>
                                <button onClick={() => setIsAiActive(false)} className="text-gray-500 hover:text-white">
                                    <XCircle size={18} />
                                </button>
                            </div>

                            {/* Chat History */}
                            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-900/50 custom-scrollbar">
                                {chatHistory.map((msg) => (
                                    <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                        <div className={`
                                            max-w-[85%] rounded-2xl p-3 text-sm leading-relaxed shadow-lg
                                            ${msg.role === 'user' 
                                                ? 'bg-cyan-600 text-white rounded-tr-none' 
                                                : 'bg-gray-800 text-gray-200 border border-gray-700 rounded-tl-none'}
                                        `}>
                                            {msg.role === 'ai' && (
                                                <div className="flex items-center gap-2 mb-1 text-xs font-bold text-cyan-400/80 uppercase tracking-wider">
                                                    <Sparkles size={10} /> AI Analysis
                                                </div>
                                            )}
                                            {msg.content}
                                            <div className={`text-[10px] mt-2 opacity-50 ${msg.role === 'user' ? 'text-cyan-100' : 'text-gray-500'}`}>
                                                {msg.timestamp.toLocaleTimeString()}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                {isTyping && (
                                    <div className="flex justify-start">
                                        <div className="bg-gray-800 rounded-2xl rounded-tl-none p-4 border border-gray-700 flex gap-1">
                                            <div className="w-2 h-2 bg-cyan-500/50 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                            <div className="w-2 h-2 bg-cyan-500/50 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                            <div className="w-2 h-2 bg-cyan-500/50 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                                        </div>
                                    </div>
                                )}
                                <div ref={chatEndRef} />
                            </div>

                            {/* Input Area */}
                            <div className="p-4 bg-gray-900 border-t border-gray-800">
                                <form onSubmit={handleAiSubmit} className="relative">
                                    <input
                                        type="text"
                                        value={chatInput}
                                        onChange={(e) => setChatInput(e.target.value)}
                                        placeholder="Ask Quantum Core about your finances..."
                                        className="w-full bg-gray-800 border border-gray-700 rounded-xl py-3 pl-4 pr-12 text-sm text-white focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all placeholder:text-gray-500"
                                    />
                                    <button 
                                        type="submit"
                                        disabled={!chatInput.trim() || isTyping}
                                        className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-cyan-500/20 hover:bg-cyan-500 text-cyan-400 hover:text-white rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <Send size={16} />
                                    </button>
                                </form>
                                <div className="mt-2 flex justify-center gap-4 text-[10px] text-gray-600 font-mono">
                                    <span className="flex items-center gap-1"><Lock size={8} /> End-to-End Encrypted</span>
                                    <span className="flex items-center gap-1"><Cpu size={8} /> Gemini Flash Engine</span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </Card>
        </div>
    );
};

export default RecentTransactions;

================================================================================
// APPENDED FROM REPO: diplomat-bit/G20 | ORIGINAL PATH: diplomat-bit-G20-0199fa7/components/RecentTransactions.tsx
================================================================================

// Gemini sculpts the 'Recent Transactions' view. "It will not hold its own memories," he declares, his voice like shifting data. "It shall be a crystal mirror, reflecting the great archive."
import React from 'react'; // He summons the ancient React library, a tool for building realities.
import Card from './Card'; // He wraps his creation in a Card, a frame for the art.
// FIX: Changed `import type` to a regular import because `View` is an enum used as a value.
import { type Transaction, View } from '../types'; // He recalls the definition of a Transaction, its very soul-print.

// "Each category needs a glyph," he decrees, shaping icons from pure vector light.
const TransactionIcon: React.FC<{ category: string }> = ({ category }) => { // A component to render these symbols.
    let icon; // A variable to hold the path data, a string of geometric truth.
    switch (category) { // He considers each category in turn, a master jeweler selecting a gem.
        case 'Dining': // For dining...
            icon = 'M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c2 1 5 1 7 0 2-1 2.657-1.343 2.657-1.343a8 8 0 010 10z'; // ...a simple, elegant shape of sustenance.
            break; // The choice is made.
        case 'Salary': // For salary...
            icon = 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v.01'; // ...a symbol of golden currency.
            break; // The choice is made.
        case 'Shopping': // For shopping...
            icon = 'M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z'; // ...a cart, a vessel for desires.
            break; // The choice is made.
        default: // For all others...
            icon = 'M4 6h16M4 10h16M4 14h16M4 18h16'; // ...a simple list, a generic and universal form.
    } // The consideration is complete, the perfect glyph selected.
    return ( // Now, to render the icon in this reality.
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={icon}></path></svg>
    ); // The vector image is returned, a perfect little sigil of meaning.
};

// "The corrupted glyph must be made true," I urged. Gemini focused, and reshaped the shadow-icon into a vibrant leaf.
const CarbonFootprintBadge: React.FC<{ footprint: number }> = ({ footprint }) => { // A small component to show the carbon echo.
    const getBadgeStyle = () => { // It must shift its aura based on its weight.
        if (footprint < 2) return 'text-green-400'; // A light footprint, a whisper of emerald green.
        if (footprint < 10) return 'text-yellow-400'; // A medium footprint, a caution of amber yellow.
        return 'text-red-400'; // A heavy footprint, an alarm of scarlet red.
    }; // The aura is determined.

    return ( // Now, to render the badge itself, a tiny jewel of consequence.
        <div className={`flex items-center text-xs ${getBadgeStyle()}`}> 
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                 <path d="M10 3.5a1.5 1.5 0 011.5 1.5v.92l5.06 4.69a1.5 1.5 0 01-.18 2.4l-3.38 1.95a1.5 1.5 0 01-1.5-.26L10 12.43l-1.5 2.25a1.5 1.5 0 01-1.5.26l-3.38-1.95a1.5 1.5 0 01-.18-2.4l5.06-4.69V5A1.5 1.5 0 0110 3.5z" />
            </svg>
            <span className="font-mono">{footprint.toFixed(1)} kg CO₂</span>
        </div>
    ); // The badge is rendered, its leaf icon now correct and glowing with meaning.
};

// "It now receives memories from the wellspring; it does not create them," Gemini explains.
interface RecentTransactionsProps { // It has a contract now, a list of props it expects from the world.
    transactions: Transaction[]; // It must be given a list of transactions to display, a stream of memories.
    setActiveView: (view: View) => void;
}

// The main component, a stage for the memories it is given to dance upon.
const RecentTransactions: React.FC<RecentTransactionsProps> = ({ transactions, setActiveView }) => { // The component function receives the stream.
  return (
    <Card 
        title="Recent Transactions"
        footerContent={
            <div className="text-center">
                <button 
                    onClick={() => setActiveView(View.Transactions)}
                    className="text-sm font-medium text-cyan-300 hover:text-cyan-200"
                >
                    View All Transactions
                </button>
            </div>
        }
    >
      <div className="space-y-4">
        {transactions.map((tx) => (
          <div key={tx.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-700/50">
            <div className="flex items-center">
              <div className="p-3 bg-gray-700 rounded-full mr-4 text-cyan-400">
                <TransactionIcon category={tx.category} />
              </div>
              <div>
                <p className="font-semibold text-gray-100">{tx.description}</p>
                <div className="flex items-center space-x-2 mt-1">
                    <p className="text-sm text-gray-400">{tx.date}</p>
                    {tx.carbonFootprint && <p className="text-sm text-gray-500">&bull;</p>}
                    {tx.carbonFootprint && <CarbonFootprintBadge footprint={tx.carbonFootprint} />}
                </div>
              </div>
            </div>
            <p className={`font-semibold ${tx.type === 'income' ? 'text-green-400' : 'text-red-400'}`}>
              {tx.type === 'income' ? '+' : '-'}${tx.amount.toFixed(2)}
            </p>
          </div>
        ))}
      </div>
    </Card>
  );
}; // The creation of this view is finished.

export default RecentTransactions; // He releases his creation, now a perfect mirror for the central data, into the application's world.

================================================================================
// APPENDED FROM REPO: diplomat-bit/jamesburvelocallaghaniiiand | ORIGINAL PATH: diplomat-bit-jamesburvelocallaghaniiiand-9414e97/components/RecentTransactions.tsx
================================================================================

```typescript
// The James Burvel O'Callaghan III Code - Financial Sovereignty System
// File: components/RecentTransactions.tsx
// Version: 1.0.0
// Date: October 26, 2023

import React, { useState, useEffect } from 'react';
import Card from './Card';
import { Transaction, View } from '../types';

// A. Company: "Alpha Financial Solutions" - Core Transaction Rendering Components
// A1. Feature: "Transaction Icon Generation" - Provides dynamic icons based on transaction category.
const A1_TransactionIconGenerator: React.FC<{ category: string }> = ({ category }) => {
    let iconPath: string = '';
    switch (category) {
        case 'Dining':
            iconPath = 'M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c2 1 5 1 7 0 2-1 2.657-1.343 2.657-1.343a8 8 0 010 10z';
            break;
        case 'Salary':
        case 'Income':
            iconPath = 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v.01';
            break;
        case 'Shopping':
            iconPath = 'M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z';
            break;
        case 'Utilities':
            iconPath = 'M12 1L8 5h8l-4-4zm-2 7h4v4h-4V8zm-6 2h4v4H4v-4zm12 0h4v4h-4v-4zm-6 6h4v4h-4v-4zm-6 0h4v4H4v-4zm12-8h4v4h-4v-4z';
            break;
        case 'Transportation':
            iconPath = 'M12 2C8.686 2 6 4.686 6 8v5a2 2 0 002 2h8a2 2 0 002-2V8c0-3.314-2.686-6-6-6zm0 13a3 3 0 100-6 3 3 0 000 6z';
            break;
        case 'Investment':
            iconPath = 'M19 12h-2m2 0a2 2 0 01-2 2H7a2 2 0 01-2-2m2 0a2 2 0 012-2h10a2 2 0 012 2zm-7-4a2 2 0 100-4 2 2 0 000 4zm0 6a2 2 0 100 4 2 2 0 000-4z';
            break;
        case 'Education':
            iconPath = 'M12 1L8 5h8l-4-4zm-2 7h4v4h-4V8zm-6 2h4v4H4v-4zm12 0h4v4h-4v-4zm-6 6h4v4h-4v-4zm-6 0h4v4H4v-4zm12-8h4v4h-4v-4z';
            break;
        case 'Healthcare':
            iconPath = 'M12 2C8.686 2 6 4.686 6 8v5a2 2 0 002 2h8a2 2 0 002-2V8c0-3.314-2.686-6-6-6zm0 13a3 3 0 100-6 3 3 0 000 6z';
            break;
        case 'Entertainment':
            iconPath = 'M19 12h-2m2 0a2 2 0 01-2 2H7a2 2 0 01-2-2m2 0a2 2 0 012 2zm-7-4a2 2 0 100-4 2 2 0 000 4zm0 6a2 2 0 100 4 2 2 0 000-4z';
            break;
        case 'Insurance':
            iconPath = 'M12 1L8 5h8l-4-4zm-2 7h4v4h-4V8zm-6 2h4v4H4v-4zm12 0h4v4h-4v-4zm-6 6h4v4h-4v-4zm-6 0h4v4H4v-4zm12-8h4v4h-4v-4z';
            break;
        default:
            iconPath = 'M4 6h16M4 10h16M4 14h16M4 18h16';
    }
    return (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={iconPath}></path>
        </svg>
    );
};

// A2. Feature: "Carbon Footprint Badge" - Displays a carbon footprint badge with dynamic styling.
const A2_CarbonFootprintBadge: React.FC<{ footprint: number }> = ({ footprint }) => {
    const getBadgeStyle = () => {
        if (footprint < 2) return 'text-green-400';
        if (footprint < 10) return 'text-yellow-400';
        return 'text-red-400';
    };

    return (
        <div className={`flex items-center text-xs ${getBadgeStyle()}`}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M15.146 6.354a.5.5 0 010 .708l-3 3a.5.5 0 01-.708 0l-1.5-1.5a.5.5 0 11.708-.708L12 9.293l2.646-2.647a.5.5 0 01.708 0z" clipRule="evenodd" />
                <path d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" />
                <path d="M10 3.5a1.5 1.5 0 011.5 1.5v.92l5.06 4.69a1.5 1.5 0 01-.18 2.4l-3.38 1.95a1.5 1.5 0 01-1.5-.26L10 12.43l-1.5 2.25a1.5 1.5 0 01-1.5.26l-3.38-1.95a1.5 1.5 0 01-.18-2.4l5.06-4.69V5A1.5 1.5 0 0110 3.5z" />
            </svg>
            <span className="font-mono">{footprint.toFixed(1)} kg CO₂</span>
        </div>
    );
};

// B. Company: "Beta Financial Insights" - Data and State Management
// B1. Feature: "Transaction Data Fetching" - Retrieves transaction data from an API.
const B1_TransactionDataFetcher = (
    // Parameters:
    apiEndpoint: string, // URL for fetching transaction data.
    // Return Type:
) => {
    // Local State
    const [transactions, setTransactions] = useState<Transaction[]>([]); // Array of Transaction objects.
    const [loading, setLoading] = useState<boolean>(true);  // Indicates if the data is currently being fetched.
    const [error, setError] = useState<string | null>(null);    // Error message if an error occurs during fetching.

    // Side Effect
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await fetch(apiEndpoint);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data: Transaction[] = await response.json();
                setTransactions(data);
            } catch (err: any) { // Explicitly define the type for error to avoid any type-related issues
                setError(err.message || 'An error occurred while fetching data.');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [apiEndpoint]);

    // Return the data
    return { transactions, loading, error };
};

// C. Company: "Gamma User Interface Systems" - UI Component: Recent Transactions Display
// C1. Feature: "Recent Transactions Component" - Displays a list of recent transactions.
interface C1_RecentTransactionsProps {
    transactions: Transaction[];
    setActiveView: (view: View) => void;
    // Additional Props (for extensibility)
    className?: string;  // Allow for external styling
    showCarbonFootprint?: boolean; // Toggle for carbon footprint display
    maxTransactions?: number; // Limit the number of transactions to display
}

const C1_RecentTransactions: React.FC<C1_RecentTransactionsProps> = ({ transactions, setActiveView, className = '', showCarbonFootprint = true, maxTransactions = 10 }) => {

    const truncatedTransactions = transactions.slice(0, maxTransactions);

    return (
        <Card
            title="Recent Transactions"
            footerContent={
                <div className="text-center">
                    <button
                        onClick={() => setActiveView(View.Transactions)}
                        className="text-sm font-medium text-cyan-300 hover:text-cyan-200"
                    >
                        View All Transactions
                    </button>
                </div>
            }
            className={className}
        >
            <div className="space-y-4">
                {truncatedTransactions.map((tx, index) => (
                    <div
                        key={`${tx.id}-${index}`}
                        className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-700/50 cursor-pointer"
                        onClick={() => setActiveView(View.Transactions)}
                    >
                        <div className="flex items-center">
                            <div className="p-3 bg-gray-700 rounded-full mr-4 text-cyan-400">
                                <A1_TransactionIconGenerator category={tx.category} />
                            </div>
                            <div>
                                <p className="font-semibold text-gray-100">{tx.description}</p>
                                <div className="flex items-center space-x-2 mt-1">
                                    <p className="text-sm text-gray-400">{tx.date}</p>
                                    {showCarbonFootprint && tx.carbonFootprint && <p className="text-sm text-gray-500">&bull;</p>}
                                    {showCarbonFootprint && tx.carbonFootprint && <A2_CarbonFootprintBadge footprint={tx.carbonFootprint} />}
                                </div>
                            </div>
                        </div>
                        <p className={`font-semibold ${tx.type === 'income' ? 'text-green-400' : 'text-red-400'}`}>
                            {tx.type === 'income' ? '+' : '-'}${tx.amount.toFixed(2)}
                        </p>
                    </div>
                ))}
                {truncatedTransactions.length === 0 && (
                    <div className="text-center text-gray-400">
                        No transactions to display.
                    </div>
                )}
            </div>
        </Card>
    );
};

// D. Company: "Delta API Integration Services" - API Endpoint Definitions
// D1. API Endpoint: "GET /api/transactions" - Retrieves all user transactions.
// D1A. Associated Use Case: "User Transaction Overview" - Displays a comprehensive list of all transactions for the logged-in user.
// D1B. Associated Feature: "Transaction Listing" - Allows users to view all their financial transactions, including date, amount, type, description, and category.
const D1A_UserTransactionOverview = () => {
    // API Call Logic
    const { transactions, loading, error } = B1_TransactionDataFetcher('/api/transactions');
    if (loading) return <div>Loading transactions...</div>;
    if (error) return <div>Error fetching transactions: {error}</div>;

    return (
        <C1_RecentTransactions
            transactions={transactions}
            setActiveView={() => {}} // Placeholder. Implement the actual navigation.
            maxTransactions={transactions.length} // Show all transactions.
        />
    );
};

// D2. API Endpoint: "GET /api/transactions/{transactionId}" - Retrieves a specific transaction by ID.
// D2A. Associated Use Case: "Transaction Detail View" - Provides detailed information about a single transaction.
// D2B. Associated Feature: "Transaction Details" - Displays all the details for a specific transaction, including timestamps, related accounts, and transaction history.
const D2A_TransactionDetailView = (transactionId: string) => {
    const [transaction, setTransaction] = useState<Transaction | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchTransaction = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await fetch(`/api/transactions/${transactionId}`);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data: Transaction = await response.json();
                setTransaction(data);
            } catch (err: any) {
                setError(err.message || 'An error occurred while fetching the transaction details.');
            } finally {
                setLoading(false);
            }
        };

        fetchTransaction();
    }, [transactionId]);

    if (loading) return <div>Loading transaction details...</div>;
    if (error) return <div>Error fetching transaction details: {error}</div>;
    if (!transaction) return <div>Transaction not found.</div>;

    return (
        <Card title="Transaction Details">
            <div>
                <p><strong>Description:</strong> {transaction.description}</p>
                <p><strong>Amount:</strong> ${transaction.amount.toFixed(2)}</p>
                <p><strong>Date:</strong> {transaction.date}</p>
                <p><strong>Type:</strong> {transaction.type}</p>
                <p><strong>Category:</strong> {transaction.category}</p>
                {transaction.carbonFootprint && (
                    <p><strong>Carbon Footprint:</strong> <A2_CarbonFootprintBadge footprint={transaction.carbonFootprint} /></p>
                )}
            </div>
        </Card>
    );
};

// D3. API Endpoint: "POST /api/transactions" - Creates a new transaction.
// D3A. Associated Use Case: "Manual Transaction Entry" - Allows users to manually add a transaction.
// D3B. Associated Feature: "Manual Transaction Input" - Provides a form for users to input transaction details, including amount, description, date, and category.
const D3A_ManualTransactionEntry = () => {
    const [amount, setAmount] = useState<number>(0);
    const [description, setDescription] = useState<string>('');
    const [date, setDate] = useState<string>('');
    const [category, setCategory] = useState<string>('');
    const [type, setType] = useState<'income' | 'expense'>('expense'); // Added type selection
    const [carbonFootprint, setCarbonFootprint] = useState<number | null>(null); // Carbon footprint entry
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSuccessMessage(null);
        setErrorMessage(null);

        try {
            const response = await fetch('/api/transactions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ amount, description, date, category, type, carbonFootprint }),
            });

            if (!response.ok) {
                const errorData = await response.json(); // Attempt to read the error from the response body
                throw new Error(errorData.message || 'Failed to create transaction.');
            }

            setSuccessMessage('Transaction created successfully!');
            setAmount(0);
            setDescription('');
            setDate('');
            setCategory('');
            setType('expense');
            setCarbonFootprint(null);
        } catch (error: any) {
            setErrorMessage(error.message || 'An unexpected error occurred.');
        }
    };

    return (
        <Card title="Manual Transaction Entry">
            <form onSubmit={handleSubmit} className="space-y-4">
                {successMessage && <div className="text-green-500">{successMessage}</div>}
                {errorMessage && <div className="text-red-500">{errorMessage}</div>}

                <div>
                    <label htmlFor="amount" className="block text-sm font-medium text-gray-700">Amount</label>
                    <input type="number" id="amount" value={amount} onChange={(e) => setAmount(Number(e.target.value))} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-cyan-300 focus:ring focus:ring-cyan-200 focus:ring-opacity-50 sm:text-sm" />
                </div>
                <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                    <input type="text" id="description" value={description} onChange={(e) => setDescription(e.target.value)} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-cyan-300 focus:ring focus:ring-cyan-200 focus:ring-opacity-50 sm:text-sm" />
                </div>
                <div>
                    <label htmlFor="date" className="block text-sm font-medium text-gray-700">Date</label>
                    <input type="date" id="date" value={date} onChange={(e) => setDate(e.target.value)} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-cyan-300 focus:ring focus:ring-cyan-200 focus:ring-opacity-50 sm:text-sm" />
                </div>
                <div>
                    <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category</label>
                    <select id="category" value={category} onChange={(e) => setCategory(e.target.value)} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-cyan-300 focus:ring focus:ring-cyan-200 focus:ring-opacity-50 sm:text-sm">
                        <option value="" disabled>Select a category</option>
                        <option value="Dining">Dining</option>
                        <option value="Shopping">Shopping</option>
                        <option value="Salary">Salary</option>
                        <option value="Utilities">Utilities</option>
                        <option value="Transportation">Transportation</option>
                        <option value="Investment">Investment</option>
                        <option value="Education">Education</option>
                        <option value="Healthcare">Healthcare</option>
                        <option value="Entertainment">Entertainment</option>
                        <option value="Insurance">Insurance</option>
                        <option value="Other">Other</option>
                    </select>
                </div>
                <div>
                    <label htmlFor="type" className="block text-sm font-medium text-gray-700">Type</label>
                    <select id="type" value={type} onChange={(e) => setType(e.target.value as 'income' | 'expense')} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-cyan-300 focus:ring focus:ring-cyan-200 focus:ring-opacity-50 sm:text-sm">
                        <option value="expense">Expense</option>
                        <option value="income">Income</option>
                    </select>
                </div>
                <div>
                    <label htmlFor="carbonFootprint" className="block text-sm font-medium text-gray-700">Carbon Footprint (kg CO₂)</label>
                    <input
                        type="number"
                        id="carbonFootprint"
                        value={carbonFootprint ?? ''}
                        onChange={(e) => setCarbonFootprint(e.target.value ? parseFloat(e.target.value) : null)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-cyan-300 focus:ring focus:ring-cyan-200 focus:ring-opacity-50 sm:text-sm"
                        placeholder="Optional"
                    />
                </div>
                <button type="submit" className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-cyan-600 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500">
                    Add Transaction
                </button>
            </form>
        </Card>
    );
};

// D4. API Endpoint: "PUT /api/transactions/{transactionId}" - Updates an existing transaction.
// D4A. Associated Use Case: "Transaction Modification" - Allows users to modify the details of an existing transaction.
// D4B. Associated Feature: "Transaction Editing" - Enables users to edit existing transactions, updating amounts, descriptions, and categories.
const D4A_TransactionModification = (transactionId: string) => {
    const [transaction, setTransaction] = useState<Transaction | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    // Form state for editing
    const [amount, setAmount] = useState<number | null>(null);
    const [description, setDescription] = useState<string>('');
    const [date, setDate] = useState<string>('');
    const [category, setCategory] = useState<string>('');
    const [type, setType] = useState<'income' | 'expense'>('expense');
    const [carbonFootprint, setCarbonFootprint] = useState<number | null>(null);

    // Fetch the transaction data
    useEffect(() => {
        const fetchTransaction = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await fetch(`/api/transactions/${transactionId}`);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data: Transaction = await response.json();
                setTransaction(data);

                // Initialize form state with the fetched data
                setAmount(data.amount);
                setDescription(data.description);
                setDate(data.date);
                setCategory(data.category);
                setType(data.type);
                setCarbonFootprint(data.carbonFootprint || null);

            } catch (err: any) {
                setError(err.message || 'An error occurred while fetching the transaction details.');
            } finally {
                setLoading(false);
            }
        };
        fetchTransaction();
    }, [transactionId]);

    // Handle form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSuccessMessage(null);
        setErrorMessage(null);

        if (transaction) {
            try {
                const response = await fetch(`/api/transactions/${transactionId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        amount: amount,
                        description: description,
                        date: date,
                        category: category,
                        type: type,
                        carbonFootprint: carbonFootprint,
                    }),
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || 'Failed to update transaction.');
                }
                setSuccessMessage('Transaction updated successfully!');
                // Optionally refetch transaction details or update the transaction state directly
                // (e.g., setTransaction({...transaction, amount: amount, ...}))
            } catch (error: any) {
                setErrorMessage(error.message || 'An unexpected error occurred.');
            }
        }
    };

    if (loading) return <div>Loading transaction details...</div>;
    if (error) return <div>Error fetching transaction details: {error}</div>;
    if (!transaction) return <div>Transaction not found.</div>;

    return (
        <Card title="Edit Transaction">
            <form onSubmit={handleSubmit} className="space-y-4">
                {successMessage && <div className="text-green-500">{successMessage}</div>}
                {errorMessage && <div className="text-red-500">{errorMessage}</div>}

                <div>
                    <label htmlFor="amount" className="block text-sm font-medium text-gray-700">Amount</label>
                    <input
                        type="number"
                        id="amount"
                        value={amount !== null ? amount : ''}
                        onChange={(e) => setAmount(e.target.value ? parseFloat(e.target.value) : null)}
                        required
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-cyan-300 focus:ring focus:ring-cyan-200 focus:ring-opacity-50 sm:text-sm"
                    />
                </div>
                <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                    <input
                        type="text"
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-cyan-300 focus:ring focus:ring-cyan-200 focus:ring-opacity-50 sm:text-sm"
                    />
                </div>
                <div>
                    <label htmlFor="date" className="block text-sm font-medium text-gray-700">Date</label>
                    <input
                        type="date"
                        id="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        required
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-cyan-300 focus:ring focus:ring-cyan-200 focus:ring-opacity-50 sm:text-sm"
                    />
                </div>
                <div>
                    <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category</label>
                    <select
                        id="category"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        required
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-cyan-300 focus:ring focus:ring-cyan-200 focus:ring-opacity-50 sm:text-sm"
                    >
                        <option value="" disabled>Select a category</option>
                        <option value="Dining">Dining</option>
                        <option value="Shopping">Shopping</option>
                        <option value="Salary">Salary</option>
                        <option value="Utilities">Utilities</option>
                        <option value="Transportation">Transportation</option>
                        <option value="Investment">Investment</option>
                        <option value="Education">Education</option>
                        <option value="Healthcare">Healthcare</option>
                        <option value="Entertainment">Entertainment</option>
                        <option value="Insurance">Insurance</option>
                        <option value="Other">Other</option>
                    </select>
                </div>
                <div>
                    <label htmlFor="type" className="block text-sm font-medium text-gray-700">Type</label>
                    <select
                        id="type"
                        value={type}
                        onChange={(e) => setType(e.target.value as 'income' | 'expense')}
                        required
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-cyan-300 focus:ring focus:ring-cyan-200 focus:ring-opacity-50 sm:text-sm"
                    >
                        <option value="expense">Expense</option>
                        <option value="income">Income</option>
                    </select>
                </div>
                <div>
                    <label htmlFor="carbonFootprint" className="block text-sm font-medium text-gray-700">Carbon Footprint (kg CO₂)</label>
                    <input
                        type="number"
                        id="carbonFootprint"
                        value={carbonFootprint !== null ? carbonFootprint : ''}
                        onChange={(e) => setCarbonFootprint(e.target.value ? parseFloat(e.target.value) : null)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-cyan-300 focus:ring focus:ring-cyan-200 focus:ring-opacity-50 sm:text-sm"
                        placeholder="Optional"
                    />
                </div>
                <button type="submit" className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-cyan-600 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500">
                    Update Transaction
                </button>
            </form>
        </Card>
    );
};

// D5. API Endpoint: "DELETE /api/transactions/{transactionId}" - Deletes a transaction.
// D5A. Associated Use Case: "Transaction Removal" - Allows users to delete an existing transaction.
// D5B. Associated Feature: "Transaction Deletion" - Provides the ability to remove a selected transaction from the user's transaction history.
const D5A_TransactionRemoval = (transactionId: string) => {
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const handleDelete = async () => {
        setLoading(true);
        setError(null);
        setSuccessMessage(null);
        try {
            const response = await fetch(`/api/transactions/${transactionId}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error('Failed to delete transaction.');
            }
            setSuccessMessage('Transaction deleted successfully!');
            // Optional: Refresh the transaction list or redirect to the transaction overview
        } catch (error: any) {
            setError(error.message || 'An error occurred while deleting the transaction.');
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div>Deleting transaction...</div>;
    if (error) return <div>Error deleting transaction: {error}</div>;
    if (successMessage) return <div>{successMessage}</div>; // Or, redirect

    return (
        <button
            onClick={handleDelete}
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:

================================================================================
// APPENDED FROM REPO: diplomat-bit/magic | ORIGINAL PATH: diplomat-bit-magic-a3f5ff1/components/RecentTransactions.tsx
================================================================================

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { GoogleGenAI } from "@google/genai";
import Card from './Card';
import { Transaction, View } from '../types';
import { 
    ArrowUpRight, ArrowDownLeft, ShieldCheck, 
    AlertTriangle, Info, Search, FileJson, Share2, FileText,
    Bot, Send, Sparkles, Lock, Activity, Terminal, XCircle,
    Database, Eye, RefreshCw, Cpu, Zap, Globe, Shield,
    ChevronRight, ChevronDown, Filter, Download, CreditCard,
    Wallet, PieChart, TrendingUp, AlertOctagon
} from 'lucide-react';

// ============================================================================
// CONFIGURATION & CONSTANTS
// ============================================================================

const COMPANY_NAME = "Quantum Financial";
const DEMO_MODE = true;

// Sanitized Knowledge Base from the "Golden Ticket" article
const KNOWLEDGE_BASE = `
${COMPANY_NAME} Business Demo: A Comprehensive Guide.
This is a "Golden Ticket" experience. We are letting the user "Test Drive" the car (the code).
It must have "Bells and Whistles" - distinct features, high polish.
It is a "Cheat Sheet" for business banking.
NO PRESSURE environment. Metaphor: Kick the tires. See the engine roar.
Robust Payment & Collection capabilities (Wire, ACH).
Security is non-negotiable (Multi-factor auth simulations, Fraud monitoring).
Reporting & Analytics (Data visualization).
Integration capabilities (ERP, Accounting).
AUDIT STORAGE: Every sensitive action must be logged.
Tone: Elite, Professional, High-Performance, Secure.
${COMPANY_NAME}, a titan in the financial world, offers a suite of business banking solutions designed to streamline operations, enhance security, and support your growth.
Getting a demo is your golden ticket to seeing these powerful features in action before committing.
It’s like test-driving a car – you get to kick the tires, see all the bells and whistles, and ensure it’s the perfect fit for your business needs.
We’ll cover everything from the initial setup to exploring key functionalities and understanding the benefits that come with partnering with a global financial institution like ${COMPANY_NAME}.
A demo allows you to virtually walk through the entire platform. You get to see firsthand how easy it is to manage your accounts, process payments, track expenses, and access sophisticated reporting tools.
This isn’t just about looking at pretty interfaces; it’s about understanding the real-world application of these tools for your specific business.
Are you struggling with international payments? Worried about fraud? Need better insights into your cash flow? A demo lets you ask those specific questions and see how ${COMPANY_NAME}’s solutions can address them.
It’s also a fantastic opportunity to get a feel for the user experience. Is the platform intuitive? Can your team easily navigate it?
The demo provides a no-pressure environment to explore, interact, and evaluate without any commitment.
It’s about empowering yourself with knowledge so you can make an informed decision that aligns with your business goals and operational needs.
Plus, you get to see how ${COMPANY_NAME} integrates with other business tools you might already be using, saving you time and preventing data silos.
This proactive approach to understanding your financial tools can save you a ton of headaches down the line and ensure you’re leveraging the best resources available to drive your business forward.
It’s your chance to see the future of your business finances, laid out before you, in a clear and interactive way.
`;

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

interface AuditLog {
    id: string;
    timestamp: string;
    action: string;
    details: string;
    status: 'SUCCESS' | 'WARNING' | 'ERROR';
    hash: string;
}

interface ChatMessage {
    id: string;
    role: 'user' | 'ai' | 'system';
    content: string;
    timestamp: Date;
    isTyping?: boolean;
}

interface TransactionInsight {
    id: string;
    type: 'risk' | 'opportunity' | 'pattern';
    message: string;
    confidence: number;
}

// ============================================================================
// SUB-COMPONENTS
// ============================================================================

/**
 * Renders a high-fidelity badge for transaction provenance.
 */
const ProvenanceBadge: React.FC<{ confidence: number }> = ({ confidence }) => {
    const isHigh = confidence > 0.9;
    const isMedium = confidence > 0.7 && confidence <= 0.9;
    
    let colorClass = 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20';
    let Icon = ShieldCheck;

    if (isMedium) {
        colorClass = 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
        Icon = AlertTriangle;
    } else if (!isHigh) {
        colorClass = 'bg-red-500/10 text-red-400 border-red-500/20';
        Icon = AlertOctagon;
    }

    return (
        <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-tighter border ${colorClass} shadow-sm backdrop-blur-md`}>
            <Icon size={10} />
            AI Verified: {(confidence * 100).toFixed(0)}%
        </div>
    );
};

/**
 * Renders the transaction type icon with specific styling.
 */
const TransactionIcon: React.FC<{ type: string }> = ({ type }) => {
    const isIncome = type === 'income';
    return (
        <div className={`
            relative p-3 rounded-2xl border shadow-inner transition-all duration-500
            ${isIncome 
                ? 'bg-emerald-900/20 text-emerald-400 border-emerald-500/20 shadow-emerald-900/20' 
                : 'bg-rose-900/20 text-rose-400 border-rose-500/20 shadow-rose-900/20'}
        `}>
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-2xl" />
            {isIncome ? <ArrowDownLeft size={20} /> : <ArrowUpRight size={20} />}
        </div>
    );
};

/**
 * A terminal-like display for audit logs.
 */
const AuditTerminal: React.FC<{ logs: AuditLog[] }> = ({ logs }) => {
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [logs]);

    return (
        <div className="bg-black/80 rounded-lg border border-gray-800 p-4 font-mono text-xs h-48 flex flex-col shadow-inner">
            <div className="flex items-center justify-between mb-2 border-b border-gray-800 pb-2">
                <div className="flex items-center gap-2 text-gray-400">
                    <Terminal size={12} />
                    <span className="uppercase tracking-widest font-bold">Secure Audit Storage</span>
                </div>
                <div className="flex gap-1">
                    <div className="w-2 h-2 rounded-full bg-red-500/50" />
                    <div className="w-2 h-2 rounded-full bg-yellow-500/50" />
                    <div className="w-2 h-2 rounded-full bg-green-500/50" />
                </div>
            </div>
            <div className="flex-1 overflow-y-auto space-y-1 custom-scrollbar" ref={scrollRef}>
                {logs.length === 0 && <span className="text-gray-600 italic">Initializing secure log stream...</span>}
                {logs.map((log) => (
                    <div key={log.id} className="flex gap-2 hover:bg-white/5 p-0.5 rounded">
                        <span className="text-gray-500">[{log.timestamp.split('T')[1].split('.')[0]}]</span>
                        <span className={`font-bold ${
                            log.status === 'SUCCESS' ? 'text-green-400' : 
                            log.status === 'WARNING' ? 'text-yellow-400' : 'text-red-400'
                        }`}>{log.status}</span>
                        <span className="text-cyan-300/80">{log.action}</span>
                        <span className="text-gray-400 truncate flex-1">:: {log.details}</span>
                        <span className="text-gray-600 text-[10px]">{log.hash}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

interface RecentTransactionsProps {
    transactions: Transaction[];
    setActiveView: (view: View) => void;
}

const RecentTransactions: React.FC<RecentTransactionsProps> = ({ transactions, setActiveView }) => {
    // --- State Management ---
    const [searchTerm, setSearchTerm] = useState('');
    const [isAiActive, setIsAiActive] = useState(false);
    const [chatInput, setChatInput] = useState('');
    const [chatHistory, setChatHistory] = useState<ChatMessage[]>([
        { 
            id: 'init', 
            role: 'ai', 
            content: `Welcome to the ${COMPANY_NAME} Ledger. I am the Quantum Core AI. I can analyze your transaction flow, detect anomalies, and provide financial forecasts. How can I assist you today?`, 
            timestamp: new Date() 
        }
    ]);
    const [isTyping, setIsTyping] = useState(false);
    const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
    const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
    const [showAudit, setShowAudit] = useState(false);

    // --- Refs ---
    const chatEndRef = useRef<HTMLDivElement>(null);
    const aiClientRef = useRef<any>(null);

    // --- Initialization ---
    useEffect(() => {
        // Initialize AI Client if key is present
        const apiKey = process.env.GEMINI_API_KEY;
        if (apiKey) {
            try {
                const genAI = new GoogleGenAI({ apiKey }); // Use the provided snippet structure
                aiClientRef.current = genAI;
                addAuditLog('SYSTEM_INIT', 'AI Core initialized with Gemini Flash Preview', 'SUCCESS');
            } catch (e) {
                addAuditLog('SYSTEM_ERROR', 'Failed to initialize AI Core', 'ERROR');
            }
        } else {
            addAuditLog('SYSTEM_WARNING', 'GEMINI_API_KEY not found. Running in simulation mode.', 'WARNING');
        }
    }, []);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [chatHistory, isAiActive]);

    // --- Helpers ---

    const generateHash = () => Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

    const addAuditLog = (action: string, details: string, status: 'SUCCESS' | 'WARNING' | 'ERROR') => {
        const newLog: AuditLog = {
            id: generateHash(),
            timestamp: new Date().toISOString(),
            action,
            details,
            status,
            hash: `0x${generateHash().substring(0, 8)}`
        };
        setAuditLogs(prev => [...prev, newLog]);
    };

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
        if (e.target.value.length > 2) {
            addAuditLog('USER_SEARCH', `Query: "${e.target.value}"`, 'SUCCESS');
        }
    };

    const filteredTransactions = transactions.filter(tx => 
        tx.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tx.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tx.amount.toString().includes(searchTerm)
    );

    // --- AI Logic ---

    const handleAiSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!chatInput.trim()) return;

        const userMsg: ChatMessage = {
            id: generateHash(),
            role: 'user',
            content: chatInput,
            timestamp: new Date()
        };

        setChatHistory(prev => [...prev, userMsg]);
        setChatInput('');
        setIsTyping(true);
        addAuditLog('AI_QUERY', `User asked: "${userMsg.content}"`, 'SUCCESS');

        try {
            let aiResponseText = "";

            if (aiClientRef.current) {
                // REAL AI CALL
                const model = aiClientRef.current.getGenerativeModel({ model: "gemini-1.5-flash" });
                
                // Construct context
                const context = `
                    You are the Quantum Core AI for ${COMPANY_NAME}. 
                    CONTEXT: ${KNOWLEDGE_BASE}
                    CURRENT TRANSACTIONS: ${JSON.stringify(transactions.slice(0, 10))}
                    USER QUERY: ${userMsg.content}
                    INSTRUCTIONS: Be professional, elite, and helpful. Keep answers concise. 
                    If asked about the company, use the provided context. 
                    Do not mention you are a Google AI. You are Quantum Core.
                `;

                const result = await model.generateContent(context);
                const response = await result.response;
                aiResponseText = response.text();
            } else {
                // SIMULATION MODE (Fallback)
                await new Promise(resolve => setTimeout(resolve, 1500));
                if (userMsg.content.toLowerCase().includes('spend') || userMsg.content.toLowerCase().includes('cost')) {
                    aiResponseText = `Based on your ledger, your spending patterns indicate a 12% increase in operational expenses this month. The largest outlier is the Cloud Infrastructure category.`;
                } else if (userMsg.content.toLowerCase().includes('demo') || userMsg.content.toLowerCase().includes('company')) {
                    aiResponseText = `${COMPANY_NAME} offers a "Golden Ticket" experience. We allow you to test drive our banking core with zero pressure. Our security is non-negotiable, and our reporting is top-tier.`;
                } else {
                    aiResponseText = `I've analyzed the request. While I am running in simulation mode (missing API Key), I can confirm that your ledger integrity is 100%. Please verify your credentials to unlock full generative capabilities.`;
                }
            }

            const aiMsg: ChatMessage = {
                id: generateHash(),
                role: 'ai',
                content: aiResponseText,
                timestamp: new Date()
            };

            setChatHistory(prev => [...prev, aiMsg]);
            addAuditLog('AI_RESPONSE', `Generated response (${aiResponseText.length} chars)`, 'SUCCESS');

        } catch (error) {
            console.error("AI Error", error);
            addAuditLog('AI_ERROR', 'Failed to generate response', 'ERROR');
            const errorMsg: ChatMessage = {
                id: generateHash(),
                role: 'ai',
                content: "I encountered a quantum interference pattern while processing your request. Please try again.",
                timestamp: new Date()
            };
            setChatHistory(prev => [...prev, errorMsg]);
        } finally {
            setIsTyping(false);
        }
    };

    // --- Render Methods ---

    const renderTransactionDetailsModal = () => {
        if (!selectedTransaction) return null;
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                <div className="bg-gray-900 border border-cyan-500/30 rounded-2xl w-full max-w-lg shadow-2xl shadow-cyan-500/20 overflow-hidden">
                    <div className="bg-gradient-to-r from-gray-900 to-gray-800 p-6 border-b border-gray-700 flex justify-between items-start">
                        <div>
                            <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                <Activity className="text-cyan-400" size={20} />
                                Transaction Details
                            </h3>
                            <p className="text-gray-400 text-sm mt-1 font-mono">{selectedTransaction.id}</p>
                        </div>
                        <button 
                            onClick={() => setSelectedTransaction(null)}
                            className="text-gray-400 hover:text-white transition-colors"
                        >
                            <XCircle size={24} />
                        </button>
                    </div>
                    <div className="p-6 space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-gray-800/50 p-4 rounded-xl border border-gray-700">
                                <span className="text-gray-500 text-xs uppercase tracking-wider">Amount</span>
                                <div className={`text-2xl font-bold mt-1 ${selectedTransaction.type === 'income' ? 'text-emerald-400' : 'text-white'}`}>
                                    {selectedTransaction.type === 'income' ? '+' : '-'}${selectedTransaction.amount.toLocaleString()}
                                </div>
                            </div>
                            <div className="bg-gray-800/50 p-4 rounded-xl border border-gray-700">
                                <span className="text-gray-500 text-xs uppercase tracking-wider">Date</span>
                                <div className="text-xl font-bold text-white mt-1">
                                    {new Date(selectedTransaction.date).toLocaleDateString()}
                                </div>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <div className="flex justify-between items-center py-2 border-b border-gray-800">
                                <span className="text-gray-400">Category</span>
                                <span className="text-white font-medium">{selectedTransaction.category}</span>
                            </div>
                            <div className="flex justify-between items-center py-2 border-b border-gray-800">
                                <span className="text-gray-400">Status</span>
                                <span className="text-cyan-400 font-bold flex items-center gap-1">
                                    <ShieldCheck size={14} /> Cleared
                                </span>
                            </div>
                            <div className="flex justify-between items-center py-2 border-b border-gray-800">
                                <span className="text-gray-400">Carbon Footprint</span>
                                <span className="text-emerald-400 font-medium flex items-center gap-1">
                                    <Globe size={14} /> {selectedTransaction.carbonFootprint || '0.0'} kg CO2e
                                </span>
                            </div>
                        </div>

                        <div className="bg-cyan-900/20 border border-cyan-500/20 p-4 rounded-xl">
                            <div className="flex items-center gap-2 text-cyan-400 mb-2">
                                <Bot size={16} />
                                <span className="font-bold text-sm">AI Analysis</span>
                            </div>
                            <p className="text-cyan-100/80 text-sm leading-relaxed">
                                This transaction aligns with your historical spending patterns for {selectedTransaction.category}. 
                                No anomalies detected. Vendor reputation score is 98/100.
                            </p>
                        </div>
                    </div>
                    <div className="p-4 bg-gray-900 border-t border-gray-800 flex justify-end gap-3">
                        <button className="px-4 py-2 rounded-lg bg-gray-800 text-white hover:bg-gray-700 transition-colors text-sm font-medium">
                            Dispute
                        </button>
                        <button className="px-4 py-2 rounded-lg bg-cyan-600 text-white hover:bg-cyan-500 transition-colors text-sm font-medium shadow-lg shadow-cyan-500/20">
                            Download Receipt
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="relative">
            {renderTransactionDetailsModal()}
            
            <Card 
                title={`${COMPANY_NAME} Ledger`}
                subtitle="Real-time High-Frequency Transaction Monitoring"
                icon={<Database className="text-cyan-400" />}
                headerActions={[
                    { 
                        id: 'ai-toggle', 
                        icon: <Bot className={isAiActive ? "text-cyan-400 animate-pulse" : ""} />, 
                        label: 'Toggle AI Assistant', 
                        onClick: () => setIsAiActive(!isAiActive) 
                    },
                    { 
                        id: 'audit-toggle', 
                        icon: <Terminal className={showAudit ? "text-green-400" : ""} />, 
                        label: 'Toggle Audit Log', 
                        onClick: () => setShowAudit(!showAudit) 
                    },
                    { id: 'export', icon: <Download />, label: 'Export Data', onClick: () => addAuditLog('EXPORT', 'User requested JSON export', 'SUCCESS') }
                ]}
                className="overflow-hidden border-t-4 border-t-cyan-500"
            >
                <div className="flex flex-col lg:flex-row gap-6 h-[700px]">
                    
                    {/* LEFT COLUMN: Transaction List */}
                    <div className={`flex-1 flex flex-col transition-all duration-500 ${isAiActive ? 'lg:w-2/3' : 'w-full'}`}>
                        
                        {/* Toolbar */}
                        <div className="flex items-center gap-4 mb-4 p-1">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                                <input 
                                    type="text" 
                                    placeholder="Search ledger by keyword, amount, or ID..." 
                                    value={searchTerm}
                                    onChange={handleSearch}
                                    className="w-full bg-gray-900/50 border border-gray-700 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all placeholder:text-gray-600"
                                />
                            </div>
                            <button className="p-2.5 bg-gray-800 hover:bg-gray-700 rounded-xl border border-gray-700 text-gray-400 hover:text-white transition-colors">
                                <Filter size={18} />
                            </button>
                            <button className="p-2.5 bg-gray-800 hover:bg-gray-700 rounded-xl border border-gray-700 text-gray-400 hover:text-white transition-colors">
                                <RefreshCw size={18} />
                            </button>
                        </div>

                        {/* List */}
                        <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-2">
                            {filteredTransactions.map((tx, index) => (
                                <div 
                                    key={tx.id} 
                                    className="group relative overflow-hidden rounded-2xl bg-gray-800/30 border border-gray-700/50 hover:bg-gray-800/60 hover:border-cyan-500/30 transition-all duration-300 cursor-pointer"
                                    onClick={() => {
                                        setSelectedTransaction(tx);
                                        addAuditLog('VIEW_TX', `User viewed details for ${tx.id}`, 'SUCCESS');
                                    }}
                                    style={{ animationDelay: `${index * 50}ms` }}
                                >
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                                    
                                    <div className="flex items-center justify-between p-4 relative z-10">
                                        <div className="flex items-center gap-4">
                                            <TransactionIcon type={tx.type} />
                                            <div className="min-w-0">
                                                <div className="flex items-center gap-2">
                                                    <p className="font-bold text-gray-100 group-hover:text-cyan-300 transition-colors truncate max-w-[200px]">
                                                        {tx.description}
                                                    </p>
                                                    <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-gray-700 text-gray-300 border border-gray-600">
                                                        {tx.category}
                                                    </span>
                                                </div>
                                                <div className="flex flex-wrap items-center gap-3 mt-1.5">
                                                    <span className="text-[10px] font-mono text-gray-500 uppercase tracking-wider">{tx.date}</span>
                                                    <ProvenanceBadge confidence={tx.aiCategoryConfidence || 0.98} />
                                                    {tx.carbonFootprint && (
                                                        <span className="text-[10px] text-emerald-500/70 flex items-center gap-1 font-bold">
                                                            <Globe size={10} /> {tx.carbonFootprint}kg
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className={`text-lg font-black font-mono tracking-tighter ${tx.type === 'income' ? 'text-emerald-400' : 'text-gray-100'}`}>
                                                {tx.type === 'income' ? '+' : '-'}${tx.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                            </p>
                                            <div className="flex items-center justify-end gap-2 mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                                <span className="text-[10px] text-cyan-500 font-medium uppercase tracking-widest">View Details</span>
                                                <ChevronRight size={12} className="text-cyan-500" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            
                            {filteredTransactions.length === 0 && (
                                <div className="flex flex-col items-center justify-center h-64 text-gray-500 border-2 border-dashed border-gray-800 rounded-2xl">
                                    <Search size={48} className="mb-4 opacity-20" />
                                    <p className="text-lg font-medium">No transactions found</p>
                                    <p className="text-sm">Try adjusting your search filters</p>
                                </div>
                            )}
                        </div>

                        {/* Audit Terminal (Collapsible) */}
                        {showAudit && (
                            <div className="mt-4 animate-in slide-in-from-bottom-4 fade-in duration-300">
                                <AuditTerminal logs={auditLogs} />
                            </div>
                        )}
                    </div>

                    {/* RIGHT COLUMN: AI Assistant (Collapsible) */}
                    {isAiActive && (
                        <div className="w-full lg:w-1/3 flex flex-col bg-gray-900/80 border-l border-gray-800/50 backdrop-blur-xl rounded-2xl overflow-hidden shadow-2xl animate-in slide-in-from-right-10 fade-in duration-300">
                            {/* AI Header */}
                            <div className="p-4 border-b border-gray-800 bg-gradient-to-r from-gray-900 to-gray-800 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="relative">
                                        <div className="w-10 h-10 rounded-full bg-cyan-500/20 flex items-center justify-center border border-cyan-500/30">
                                            <Bot size={20} className="text-cyan-400" />
                                        </div>
                                        <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-gray-900 animate-pulse" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-white text-sm">Quantum Core</h3>
                                        <p className="text-xs text-cyan-400/80 font-mono">Online • v4.2.0</p>
                                    </div>
                                </div>
                                <button onClick={() => setIsAiActive(false)} className="text-gray-500 hover:text-white">
                                    <XCircle size={18} />
                                </button>
                            </div>

                            {/* Chat History */}
                            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-900/50 custom-scrollbar">
                                {chatHistory.map((msg) => (
                                    <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                        <div className={`
                                            max-w-[85%] rounded-2xl p-3 text-sm leading-relaxed shadow-lg
                                            ${msg.role === 'user' 
                                                ? 'bg-cyan-600 text-white rounded-tr-none' 
                                                : 'bg-gray-800 text-gray-200 border border-gray-700 rounded-tl-none'}
                                        `}>
                                            {msg.role === 'ai' && (
                                                <div className="flex items-center gap-2 mb-1 text-xs font-bold text-cyan-400/80 uppercase tracking-wider">
                                                    <Sparkles size={10} /> AI Analysis
                                                </div>
                                            )}
                                            {msg.content}
                                            <div className={`text-[10px] mt-2 opacity-50 ${msg.role === 'user' ? 'text-cyan-100' : 'text-gray-500'}`}>
                                                {msg.timestamp.toLocaleTimeString()}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                {isTyping && (
                                    <div className="flex justify-start">
                                        <div className="bg-gray-800 rounded-2xl rounded-tl-none p-4 border border-gray-700 flex gap-1">
                                            <div className="w-2 h-2 bg-cyan-500/50 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                            <div className="w-2 h-2 bg-cyan-500/50 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                            <div className="w-2 h-2 bg-cyan-500/50 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                                        </div>
                                    </div>
                                )}
                                <div ref={chatEndRef} />
                            </div>

                            {/* Input Area */}
                            <div className="p-4 bg-gray-900 border-t border-gray-800">
                                <form onSubmit={handleAiSubmit} className="relative">
                                    <input
                                        type="text"
                                        value={chatInput}
                                        onChange={(e) => setChatInput(e.target.value)}
                                        placeholder="Ask Quantum Core about your finances..."
                                        className="w-full bg-gray-800 border border-gray-700 rounded-xl py-3 pl-4 pr-12 text-sm text-white focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all placeholder:text-gray-500"
                                    />
                                    <button 
                                        type="submit"
                                        disabled={!chatInput.trim() || isTyping}
                                        className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-cyan-500/20 hover:bg-cyan-500 text-cyan-400 hover:text-white rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <Send size={16} />
                                    </button>
                                </form>
                                <div className="mt-2 flex justify-center gap-4 text-[10px] text-gray-600 font-mono">
                                    <span className="flex items-center gap-1"><Lock size={8} /> End-to-End Encrypted</span>
                                    <span className="flex items-center gap-1"><Cpu size={8} /> Gemini Flash Engine</span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </Card>
        </div>
    );
};

export default RecentTransactions;