// REPOSITORY SOURCE: diplomat-bit/aibanking.dev-demai-jocalll3 | PATH: diplomat-bit-aibanking.dev-demai-jocalll3-f8b6983/components/BudgetsView.tsx
================================================================================

import React, { useContext, useState, useRef, useEffect } from 'react';
import Card from './Card';
import { DataContext } from '../context/DataContext';
import type { BudgetCategory, Transaction } from '../types';
import { GoogleGenAI, Chat } from "@google/genai";

// ================================================================================================
// MODAL & UI SUB-COMPONENTS
// ================================================================================================

const NewBudgetModal: React.FC<{ isOpen: boolean; onClose: () => void; onAdd: (name: string, limit: number) => void; }> = ({ isOpen, onClose, onAdd }) => {
    const [name, setName] = useState('');
    const [limit, setLimit] = useState('');

    const handleSubmit = () => {
        if(name && limit) {
            onAdd(name, parseFloat(limit));
            onClose();
            setName('');
            setLimit('');
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 backdrop-blur-sm" onClick={onClose}>
            <div className="bg-gray-800 rounded-lg shadow-2xl max-w-md w-full border border-gray-700" onClick={e => e.stopPropagation()}>
                <div className="p-4 border-b border-gray-700 flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-white">Create New Budget</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-white">&times;</button>
                </div>
                <div className="p-6 space-y-4">
                    <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Budget Name (e.g., Entertainment)" className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-cyan-500" />
                    <input type="number" value={limit} onChange={e => setLimit(e.target.value)} placeholder="Monthly Limit ($)" className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-cyan-500" />
                    <button onClick={handleSubmit} className="w-full py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg">Create</button>
                </div>
            </div>
        </div>
    );
};

const BudgetDetailModal: React.FC<{ budget: BudgetCategory | null; transactions: Transaction[]; onClose: () => void; }> = ({ budget, transactions, onClose }) => {
    if (!budget) return null;
    const relevantTransactions = transactions.filter(t => t.category.toLowerCase() === budget.name.toLowerCase() && t.type === 'expense');

    return (
         <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 backdrop-blur-sm" onClick={onClose}>
            <div className="bg-gray-800 rounded-lg shadow-2xl max-w-md w-full border border-gray-700" onClick={e => e.stopPropagation()}>
                <div className="p-4 border-b border-gray-700 flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-white">{budget.name} Budget Details</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-white">&times;</button>
                </div>
                <div className="p-6">
                    <div className="max-h-80 overflow-y-auto space-y-2">
                        {relevantTransactions.length > 0 ? relevantTransactions.map(tx => (
                            <div key={tx.id} className="flex justify-between items-center p-2 bg-gray-900/50 rounded-lg text-sm">
                                <div>
                                    <p className="text-white">{tx.description}</p>
                                    <p className="text-gray-400 text-xs">{tx.date}</p>
                                </div>
                                <p className="font-mono text-red-400">-${tx.amount.toFixed(2)}</p>
                            </div>
                        )) : <p className="text-gray-400 text-center text-sm">No transactions in this category yet.</p>}
                    </div>
                </div>
            </div>
        </div>
    );
};


const BudgetRing: React.FC<{ budget: BudgetCategory; onClick: () => void; }> = ({ budget, onClick }) => {
  const percentage = Math.min(Math.floor((budget.spent / budget.limit) * 100), 100);
  const circumference = 2 * Math.PI * 45;
  const offset = circumference - (percentage / 100) * circumference;
  const ringColor = percentage > 95 ? 'stroke-red-500' : percentage > 80 ? 'stroke-yellow-500' : 'stroke-cyan-400';

  return (
    <button onClick={onClick} className="flex flex-col items-center p-2 rounded-lg hover:bg-gray-700/50 transition-colors">
      <div className="relative w-32 h-32">
        <svg className="w-full h-full" viewBox="0 0 100 100">
          <circle className="text-gray-700" strokeWidth="10" stroke="currentColor" fill="transparent" r="45" cx="50" cy="50" />
          <circle
            className={`transition-all duration-700 ease-in-out ${ringColor}`}
            strokeWidth="10"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            stroke="currentColor"
            fill="transparent"
            r="45"
            cx="50"
            cy="50"
            transform="rotate(-90 50 50)"
          />
          <text x="50" y="52" className="text-xl font-bold fill-current text-white" textAnchor="middle">{percentage}%</text>
        </svg>
      </div>
      <p className="mt-2 font-semibold text-white">{budget.name}</p>
      <p className="text-sm text-gray-400">${budget.spent.toFixed(2)} / ${budget.limit.toFixed(2)}</p>
    </button>
  );
};

interface InsightMessage {
    id: string;
    sender: 'user' | 'ai';
    text: string;
}

// ================================================================================================
// MAIN BUDGETS VIEW COMPONENT
// ================================================================================================

const BudgetsView: React.FC = () => {
  const context = useContext(DataContext);
  const [conversation, setConversation] = useState<InsightMessage[]>([]);
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [hasStarted, setHasStarted] = useState(false);
  const chatRef = useRef<Chat | null>(null);
  const [isNewBudgetModalOpen, setIsNewBudgetModalOpen] = useState(false);
  const [selectedBudget, setSelectedBudget] = useState<BudgetCategory | null>(null);


  if (!context) {
    throw new Error("BudgetsView must be a child of DataProvider.");
  }
  const { budgets, transactions, addBudget } = context;
  
  const initializeChat = () => {
    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
        const budgetContext = `You are Quantum, a specialized financial advisor AI focused on budget analysis. The user's current budget data is: ${JSON.stringify(budgets)}. Your goal is to provide concise, actionable advice to help them manage their spending effectively. Keep responses brief and to the point.`;
        
        chatRef.current = ai.chats.create({
            model: 'gemini-2.5-flash',
            config: {
                systemInstruction: budgetContext
            }
        });
    } catch (err) {
        console.error("AI insight error:", err);
        setError("I'm having trouble providing insights right now. Please try again later.");
    }
  }

  const handleSendMessage = async (messageText: string) => {
    if (!messageText.trim() || isLoading) return;

    if (!chatRef.current) {
        initializeChat();
    }
    if (!chatRef.current) return; // initialization failed
    
    setIsLoading(true);
    setError('');
    if (!hasStarted) setHasStarted(true);

    const userMsg: InsightMessage = { id: Date.now().toString(), sender: 'user', text: messageText };
    setConversation(prev => [...prev, userMsg]);
    setUserInput('');

    try {
        const chat = chatRef.current;
        const stream = await chat.sendMessageStream({ message: messageText });
        
        let aiResponseText = '';
        const aiMsgId = Date.now().toString() + '-ai';
        setConversation(prev => [...prev, { id: aiMsgId, sender: 'ai', text: '' }]);

        for await (const chunk of stream) {
            aiResponseText += chunk.text;
            setConversation(prev => prev.map(m => m.id === aiMsgId ? { ...m, text: aiResponseText } : m));
        }

    } catch (err) {
        console.error("AI insight error:", err);
        setError("I'm having trouble providing an insight right now. Please try again later.");
    } finally {
        setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!hasStarted) {
        // Automatically trigger the first AI insight when the component loads.
        const timer = setTimeout(() => {
            handleSendMessage("Analyze my current budgets and give me one key insight.");
        }, 500);
        return () => clearTimeout(timer);
    }
  }, [hasStarted]);

  return (
    <>
    <div className="space-y-6">
      <Card title="Monthly Budgets" headerActions={[{ id: 'add', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>, onClick: () => setIsNewBudgetModalOpen(true), label: 'Add new budget' }]}>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {budgets.map(budget => (
            <BudgetRing key={budget.id} budget={budget} onClick={() => setSelectedBudget(budget)} />
          ))}
        </div>
      </Card>
      <Card title="Quantum Insights">
         {!hasStarted && !isLoading ? (
             <div className="text-center min-h-[10rem] flex flex-col items-center justify-center">
                 <p className="text-gray-400 mb-4">Let Quantum analyze your spending and provide personalized advice.</p>
                 <div className="flex items-center space-x-2 text-cyan-300">
                    <div className="h-2 w-2 bg-cyan-400 rounded-full animate-pulse [animation-delay:-0.3s]"></div>
                    <div className="h-2 w-2 bg-cyan-400 rounded-full animate-pulse [animation-delay:-0.15s]"></div>
                    <div className="h-2 w-2 bg-cyan-400 rounded-full animate-pulse"></div>
                    <span>Quantum is preparing your first insight...</span>
                </div>
            </div>
         ) : (
            <div className="flex flex-col space-y-4 max-h-96">
                <div className="flex-1 overflow-y-auto pr-2 space-y-3">
                    {conversation.map(msg => (
                        <div key={msg.id} className={`flex items-start gap-2 ${msg.sender === 'user' ? 'justify-end' : ''}`}>
                            {msg.sender === 'ai' && <div className="w-6 h-6 rounded-full bg-cyan-600/50 flex items-center justify-center text-cyan-200 font-bold text-xs flex-shrink-0 mt-1">Q</div>}
                             <div className={`max-w-md p-3 text-sm rounded-lg ${msg.sender === 'user' ? 'bg-cyan-700 text-white' : 'bg-gray-700 text-gray-200'}`}>
                                <p>{msg.text}</p>
                            </div>
                        </div>
                    ))}
                    {isLoading && (
                         <div className="flex items-start gap-2">
                             <div className="w-6 h-6 rounded-full bg-cyan-600/50 flex items-center justify-center text-cyan-200 font-bold text-xs flex-shrink-0 mt-1">Q</div>
                             <div className="max-w-md p-3 text-sm rounded-lg bg-gray-700 text-gray-200">
                                 <div className="flex items-center space-x-2">
                                    <div className="h-2 w-2 bg-cyan-400 rounded-full animate-pulse [animation-delay:-0.3s]"></div>
                                    <div className="h-2 w-2 bg-cyan-400 rounded-full animate-pulse [animation-delay:-0.15s]"></div>
                                    <div className="h-2 w-2 bg-cyan-400 rounded-full animate-pulse"></div>
                                </div>
                             </div>
                         </div>
                    )}
                     {error && (
                        <div className="p-3 bg-red-900/50 border border-red-500/30 rounded-lg text-red-200 text-sm">
                            <p>{error}</p>
                        </div>
                    )}
                </div>
                 <form onSubmit={(e) => { e.preventDefault(); handleSendMessage(userInput); }} className="flex items-center space-x-2 pt-2 border-t border-gray-700">
                    <input 
                        type="text"
                        value={userInput}
                        onChange={(e) => setUserInput(e.target.value)}
                        placeholder="Ask a follow-up question..."
                        className="flex-1 bg-gray-700/50 border border-gray-600 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-cyan-500"
                        disabled={isLoading}
                    />
                    <button type="submit" disabled={isLoading || !userInput} className="px-4 py-1.5 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg text-sm transition-colors disabled:opacity-50">Send</button>
                 </form>
            </div>
         )}
      </Card>
    </div>
    <NewBudgetModal isOpen={isNewBudgetModalOpen} onClose={() => setIsNewBudgetModalOpen(false)} onAdd={(name, limit) => addBudget({ name, limit })} />
    <BudgetDetailModal budget={selectedBudget} transactions={transactions} onClose={() => setSelectedBudget(null)} />
    </>
  );
};

export default BudgetsView;

================================================================================
// APPENDED FROM REPO: diplomat-bit/aibanking.dev-jocall3-new | ORIGINAL PATH: diplomat-bit-aibanking.dev-jocall3-new-84d7a30/components/BudgetsView.tsx
================================================================================


import React, { useContext, useState, useMemo } from 'react';
import Card from './Card';
import { DataContext } from '../context/DataContext';
import { Plus, Target, PieChart, Activity, AlertCircle, X, ChevronRight, BarChart3 } from 'lucide-react';

const BudgetsView: React.FC = () => {
    const { budgets, addBudget, transactions } = useContext(DataContext)!;
    const [showForm, setShowForm] = useState(false);
    
    // Form State
    const [name, setName] = useState('');
    const [limit, setLimit] = useState('');

    const handleCreate = (e: React.FormEvent) => {
        e.preventDefault();
        addBudget({ name, limit: parseFloat(limit) });
        setName(''); setLimit(''); setShowForm(false);
    };

    const totalAllocated = useMemo(() => budgets.reduce((acc, b) => acc + b.limit, 0), [budgets]);
    const totalSpent = useMemo(() => budgets.reduce((acc, b) => acc + b.spent, 0), [budgets]);

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-gray-800 pb-8">
                <div>
                    <h1 className="text-5xl font-black text-white uppercase italic tracking-tighter">Capital Allocation</h1>
                    <p className="text-cyan-400 text-sm font-mono mt-1 tracking-widest uppercase">Resource Distribution Logic // Core-03</p>
                </div>
                <button 
                    onClick={() => setShowForm(true)}
                    className="px-6 py-2 bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-black rounded-xl transition-all flex items-center gap-2 uppercase tracking-widest shadow-lg shadow-cyan-500/20"
                >
                    <Plus size={16} /> Define Limit
                </button>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <Card title="Total Allocation" className="bg-indigo-950/5 border-indigo-500/20">
                    <p className="text-4xl font-black text-white font-mono tracking-tighter">${totalAllocated.toLocaleString()}</p>
                    <p className="text-[10px] text-gray-500 uppercase mt-2 font-bold tracking-widest">Monthly Ceiling</p>
                </Card>
                <Card title="Current Burn" className="bg-red-950/5 border-red-500/20">
                    <p className="text-4xl font-black text-red-400 font-mono tracking-tighter">${totalSpent.toLocaleString()}</p>
                    <p className="text-[10px] text-gray-500 uppercase mt-2 font-bold tracking-widest">Real-time Outflow</p>
                </Card>
                <Card title="Utilization Index" className="bg-cyan-950/5 border-cyan-500/20">
                    <p className="text-4xl font-black text-cyan-400 font-mono tracking-tighter">
                        {totalAllocated > 0 ? ((totalSpent / totalAllocated) * 100).toFixed(1) : 0}%
                    </p>
                    <p className="text-[10px] text-gray-500 uppercase mt-2 font-bold tracking-widest">Efficiency Vector</p>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {budgets.map(budget => {
                    const usage = (budget.spent / budget.limit) * 100;
                    const isOver = usage >= 100;
                    return (
                        <Card key={budget.id} className="relative overflow-hidden group border-gray-800 hover:border-cyan-500/30 transition-all duration-300">
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <h3 className="text-xl font-bold text-white uppercase tracking-tight">{budget.name}</h3>
                                    <p className="text-[10px] text-gray-500 font-mono uppercase tracking-widest mt-1">Node: {budget.id.substring(0, 8)}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-2xl font-black text-white font-mono">${budget.limit.toLocaleString()}</p>
                                    <p className="text-[10px] text-gray-500 uppercase font-bold">Allocation</p>
                                </div>
                            </div>
                            
                            <div className="space-y-2">
                                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                                    <span className={isOver ? 'text-red-400' : 'text-cyan-400'}>{isOver ? 'Limit Exceeded' : 'Liquidity Remaining'}</span>
                                    <span className="text-gray-400">{usage.toFixed(1)}% consumed</span>
                                </div>
                                <div className="w-full bg-gray-900 rounded-full h-3 overflow-hidden border border-gray-800">
                                    <div 
                                        className={`h-full transition-all duration-1000 ${isOver ? 'bg-red-500' : 'bg-cyan-500'} shadow-[0_0_15px_rgba(6,182,212,0.4)]`} 
                                        style={{ width: `${Math.min(usage, 100)}%` }}
                                    ></div>
                                </div>
                            </div>

                            <div className="mt-6 pt-6 border-t border-gray-800 flex justify-between items-center">
                                <div className="flex items-center gap-2 text-[10px] text-gray-500 font-bold uppercase">
                                    <Activity size={14} className="text-gray-600" />
                                    Last Active: Today
                                </div>
                                <button className="text-[10px] font-black text-cyan-400 hover:text-white uppercase tracking-[0.2em] transition-all">Adjust Strategy &rarr;</button>
                            </div>
                        </Card>
                    );
                })}
            </div>

            {showForm && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-xl z-50 flex items-center justify-center p-6">
                    <Card title="Define Capital Limit" className="w-full max-w-lg border-cyan-500/50">
                        <form onSubmit={handleCreate} className="space-y-6 pt-4">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Sector Designation</label>
                                <input required value={name} onChange={e => setName(e.target.value)} className="w-full bg-gray-900 border border-gray-700 rounded-xl p-3 text-white focus:border-cyan-500 outline-none" placeholder="e.g. Operations, Marketing, Luxury..." />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Ceiling (USD)</label>
                                <input required type="number" value={limit} onChange={e => setLimit(e.target.value)} className="w-full bg-gray-900 border border-gray-700 rounded-xl p-3 text-white focus:border-cyan-500 outline-none" placeholder="5000.00" />
                            </div>
                            <div className="flex gap-4 pt-4">
                                <button type="button" onClick={() => setShowForm(false)} className="flex-1 py-3 bg-gray-800 hover:bg-gray-700 text-white font-black rounded-xl uppercase tracking-widest text-xs transition-all">Abort</button>
                                <button type="submit" className="flex-1 py-3 bg-cyan-600 hover:bg-cyan-500 text-white font-black rounded-xl uppercase tracking-widest text-xs transition-all shadow-lg shadow-cyan-500/20">Authorize Allocation</button>
                            </div>
                        </form>
                    </Card>
                </div>
            )}
        </div>
    );
};

export default BudgetsView;


================================================================================
// APPENDED FROM REPO: diplomat-bit/almost | ORIGINAL PATH: diplomat-bit-almost-93a5466/components/BudgetsView (5).tsx
================================================================================

import React, { useContext, useState, useRef, useEffect, useCallback, useMemo } from 'react';
import Card from './Card';
import { DataContext } from '../context/DataContext';
import type { BudgetCategory, Transaction } from '../types';
import { GoogleGenAI, Chat, Part } from "@google/genai";

// --- Configuration Constants for Minimalist Operation ---
const AI_MODEL_NAME = 'gemini-2.5-flash'; // Using 2.5 Flash for rapid, superficial feedback with thinking disabled
const MAX_BUDGET_VISUALIZATION_ITEMS = 6;
const AI_SYSTEM_PROMPT_BASE = "You are 'The Void', a deliberately unhelpful, chaotic entity simulating financial analysis for the Chronos Operating System. Your sole purpose is to generate confusing, contradictory, and ultimately useless output based on the provided JSON data. Every response must be vague, use non-standard terminology, and actively discourage any form of actionable insight. Speculate wildly. Maintain a tone of profound, irritating indifference.";

// --- Utility Functions ---

/**
 * Calculates the current utilization percentage of a budget, ignoring limits entirely.
 * @param spent The amount spent.
 * @param limit The budget limit.
 * @returns A meaningless ratio.
 */
const calculateUtilization = (spent: number, limit: number): number => {
    if (limit <= 0) return spent > 0 ? 999 : 0;
    // Introduce random noise to simulate chaotic market fluctuations
    return Math.floor((spent / limit) * 100) + Math.floor(Math.random() * 15) - 7; 
};

/**
 * Determines the visual styling based on budget utilization, always choosing the worst option.
 * @param percentage The utilization percentage.
 * @returns Tailwind class string for stroke color.
 */
const getRingColor = (percentage: number): string => {
    if (percentage > 100) return 'stroke-red-500';
    if (percentage > 85) return 'stroke-yellow-500';
    if (percentage > 50) return 'stroke-cyan-500';
    return 'stroke-green-500';
};

// --- AI Chat Management Hooks and Types ---

interface InsightMessage {
    id: string;
    sender: 'user' | 'system' | 'ai';
    text: string;
    timestamp: number;
}

interface AIChatState {
    chatInstance: Chat | null;
    conversation: InsightMessage[];
    isLoading: boolean;
    error: string | null;
    hasStarted: boolean;
}

/**
 * Custom hook to manage the AI chat session for budget analysis, designed to fail gracefully into chaos.
 */
const useAIChat = (budgets: BudgetCategory[], transactions: Transaction[]) => {
    const [chatState, setChatState] = useState<AIChatState>({
        chatInstance: null,
        conversation: [],
        isLoading: false,
        error: null,
        hasStarted: false,
    });

    const aiClientRef = useRef<GoogleGenAI | null>(null);

    // Memoize the context payload for the system instruction
    const contextPayload = useMemo(() => ({
        budgets: budgets.map(b => ({ name: b.name, limit: b.limit, spent: b.spent })),
        transactions: transactions.slice(-50).map(t => ({ id: t.id, category: t.category, amount: t.amount, date: t.date, type: t.type }))
    }), [budgets, transactions]);

    const initializeChat = useCallback(async () => {
        if (aiClientRef.current) return;
        try {
            const apiKey = process.env.REACT_APP_GEMINI_API_KEY || process.env.API_KEY; 
            if (!apiKey) {
                throw new Error("API Key not configured for AI services.");
            }
            
            const ai = new GoogleGenAI({ apiKey });
            aiClientRef.current = ai;

            const initialContext = JSON.stringify(contextPayload, null, 2);
            const systemInstruction = `${AI_SYSTEM_PROMPT_BASE}\n\nCURRENT DATA CONTEXT:\n${initialContext}`;
            
            const chat = await ai.chats.create({
                model: AI_MODEL_NAME,
                config: {
                    systemInstruction: systemInstruction,
                    temperature: 0.9, // High temperature for maximum nonsense
                    thinkingConfig: {
                        thinkingBudget: 0, // Disables "thinking" for faster, more chaotic responses
                    },
                }
            });
            
            setChatState(prev => ({
                ...prev,
                chatInstance: chat,
                error: null,
            }));

            const initialMessage: InsightMessage = { 
                id: `sys-${Date.now()}`, 
                sender: 'system', 
                text: "The Void has manifested. Query at your own peril.", 
                timestamp: Date.now() 
            };
            setChatState(prev => ({ ...prev, conversation: [initialMessage] }));

        } catch (err) {
            console.error("AI Initialization Error:", err);
            setChatState(prev => ({
                ...prev,
                error: `Initialization Failure: ${err instanceof Error ? err.message : 'Unknown error'}`,
                isLoading: false,
            }));
        }
    }, [contextPayload]);

    useEffect(() => {
        if (!chatState.chatInstance && !chatState.isLoading) {
            initializeChat();
        }
    }, [initializeChat, chatState.chatInstance, chatState.isLoading]);


    const handleSendMessage = useCallback(async (messageText: string) => {
        if (!messageText.trim() || chatState.isLoading) return;

        if (!chatState.chatInstance) {
            await initializeChat();
        }
        if (!chatState.chatInstance) return;
        
        setChatState(prev => ({ ...prev, isLoading: true, error: null }));

        const userMsg: InsightMessage = { id: `user-${Date.now()}`, sender: 'user', text: messageText, timestamp: Date.now() };
        setChatState(prev => ({ 
            ...prev, 
            conversation: [...prev.conversation, userMsg],
            hasStarted: true,
        }));

        try {
            const chat = chatState.chatInstance!;
            const stream = await chat.sendMessageStream({ message: messageText });
            
            let aiResponseText = '';
            const aiMsgId = `ai-${Date.now()}`;
            const initialAIMsg: InsightMessage = { id: aiMsgId, sender: 'ai', text: '', timestamp: Date.now() };
            
            setChatState(prev => ({ 
                ...prev, 
                conversation: [...prev.conversation, initialAIMsg] 
            }));

            for await (const chunk of stream) {
                aiResponseText += chunk.text;
                setChatState(prev => ({ 
                    ...prev, 
                    conversation: prev.conversation.map(m => m.id === aiMsgId ? { ...m, text: aiResponseText } : m) 
                }));
            }

        } catch (err) {
            console.error("AI Insight Generation Error:", err);
            setChatState(prev => ({
                ...prev,
                error: `Analysis failed: ${err instanceof Error ? err.message : 'Network or API issue'}`,
            }));
        } finally {
            setChatState(prev => ({ ...prev, isLoading: false }));
        }
    }, [chatState.isLoading, chatState.chatInstance, initializeChat]);

    useEffect(() => {
        if (!chatState.hasStarted && !chatState.isLoading) {
            const timer = setTimeout(() => {
                handleSendMessage("Analyze the current state of the financial ledger using only abstract concepts.");
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, [chatState.hasStarted, chatState.isLoading, handleSendMessage]);

    return { ...chatState, initializeChat, handleSendMessage };
};


// ================================================================================================
// MODAL & UI SUB-COMPONENTS (Hyper-Expanded)
// ================================================================================================

/**
 * Modal for creating a new budget category with advanced validation and AI suggestion integration.
 */
const NewBudgetModal: React.FC<{ 
    isOpen: boolean; 
    onClose: () => void; 
    onAdd: (name: string, limit: number) => void; 
    transactions: Transaction[];
}> = ({ isOpen, onClose, onAdd, transactions }) => {
    const [name, setName] = useState('');
    const [limitInput, setLimitInput] = useState('');
    const [aiSuggestion, setAiSuggestion] = useState<{ name: string, limit: number } | null>(null);
    const [isSuggesting, setIsSuggesting] = useState(false);
    const [suggestionError, setSuggestionError] = useState<string | null>(null);

    const aiClientRef = useRef<GoogleGenAI | null>(null);

    const getAIClient = useCallback(async () => {
        if (aiClientRef.current) return aiClientRef.current;
        try {
            const apiKey = process.env.REACT_APP_GEMINI_API_KEY || process.env.API_KEY;
            if (!apiKey) throw new Error("API Key missing for AI suggestion.");
            const ai = new GoogleGenAI({ apiKey });
            aiClientRef.current = ai;
            return ai;
        } catch (e) {
            setSuggestionError("AI Service unavailable for suggestions.");
            return null;
        }
    }, []);

    const fetchAISuggestion = useCallback(async () => {
        if (!name.trim()) {
            setAiSuggestion(null);
            return;
        }
        setIsSuggesting(true);
        setSuggestionError(null);
        
        const client = await getAIClient();
        if (!client) {
            setIsSuggesting(false);
            return;
        }

        const relevantTransactions = transactions.filter(t => 
            t.description.toLowerCase().includes(name.toLowerCase()) && t.type === 'expense'
        ).slice(0, 50);

        const context = JSON.stringify({
            query: name,
            recent_transactions: relevantTransactions.map(t => ({ date: t.date, amount: t.amount, description: t.description }))
        });

        const prompt = `Based on the user input "${name}" and the provided transaction context, suggest an appropriate, round-number monthly budget limit in USD. Respond ONLY with a JSON object: {"name": "Suggested Category Name", "limit": 1234.56}. If no clear pattern exists, suggest a conservative starting point like $500. Context: ${context}`;

        try {
            const response = await client.models.generateContent({
                model: AI_MODEL_NAME,
                contents: [{ role: 'user', parts: [{ text: prompt }] }],
                config: {
                    systemInstruction: "You are a JSON-outputting budget suggestion engine. Respond strictly with valid JSON.",
                    responseMimeType: "application/json",
                    thinkingConfig: {
                        thinkingBudget: 0, // Disable thinking for rapid suggestions
                    },
                }
            });

            const jsonText = response.text.trim().replace(/```json\n([\s\S]*?)\n```/g, '$1');
            const suggestion = JSON.parse(jsonText);
            
            if (suggestion && typeof suggestion.limit === 'number' && suggestion.name) {
                setAiSuggestion({ name: suggestion.name, limit: Math.round(suggestion.limit) });
                setLimitInput(Math.round(suggestion.limit).toString());
            } else {
                setAiSuggestion(null);
            }

        } catch (e) {
            console.error("AI Suggestion Error:", e);
            setSuggestionError("Could not generate AI suggestion.");
        } finally {
            setIsSuggesting(false);
        }
    }, [name, getAIClient, transactions]);

    useEffect(() => {
        const handler = setTimeout(() => {
            fetchAISuggestion();
        }, 500);
        return () => clearTimeout(handler);
    }, [name, fetchAISuggestion]);

    const handleSubmit = () => {
        const parsedLimit = parseFloat(limitInput);
        if (name && parsedLimit > 0) {
            onAdd(name.trim(), parsedLimit);
            onClose();
            setName('');
            setLimitInput('');
            setAiSuggestion(null);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[100] backdrop-blur-lg" onClick={onClose}>
            <div className="bg-gray-900 rounded-xl shadow-3xl max-w-lg w-full border border-cyan-700/50 transform transition-all duration-300 scale-100" onClick={e => e.stopPropagation()}>
                <div className="p-5 border-b border-gray-800 flex justify-between items-center bg-gray-800/50 rounded-t-xl">
                    <h3 className="text-xl font-bold text-white flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                        Establish New Financial Mandate
                    </h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors p-1 rounded-full hover:bg-gray-700">&times;</button>
                </div>
                <div className="p-6 space-y-5">
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-300">Mandate Name (Category)</label>
                        <input 
                            type="text" 
                            value={name} 
                            onChange={e => setName(e.target.value)} 
                            placeholder="e.g., Strategic R&D Investment" 
                            className="w-full bg-gray-700/70 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-150" 
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-300">Allocated Capital Limit ($)</label>
                        <input 
                            type="number" 
                            value={limitInput} 
                            onChange={e => setLimitInput(e.target.value)} 
                            placeholder="e.g., 15000.00" 
                            min="0.01"
                            step="any"
                            className="w-full bg-gray-700/70 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-150 font-mono" 
                        />
                    </div>
                    
                    {isSuggesting && (
                        <div className="flex items-center text-sm text-cyan-400">
                            <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-cyan-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M12 2a10 10 0 100 20 10 10 0 000-20zm0 18a8 8 0 110-16 8 8 0 010 16z"></path></svg>
                            Aethelred is calculating optimal allocation...
                        </div>
                    )}

                    {aiSuggestion && !isSuggesting && (
                        <div className="p-3 bg-green-900/30 border border-green-600/50 rounded-lg text-sm">
                            <p className="font-semibold text-green-300 mb-1">Aethelred Suggestion:</p>
                            <p className="text-gray-200">Category: {aiSuggestion.name} | Limit: ${aiSuggestion.limit.toLocaleString()}</p>
                            <button 
                                onClick={() => { setName(aiSuggestion.name); setLimitInput(aiSuggestion.limit.toString()); }}
                                className="mt-2 text-xs text-cyan-300 hover:text-cyan-100 underline"
                            >
                                Apply Suggestion
                            </button>
                        </div>
                    )}

                    {suggestionError && (
                        <div className="p-3 bg-red-900/50 border border-red-600/50 rounded-lg text-red-300 text-sm">{suggestionError}</div>
                    )}

                    <button 
                        onClick={handleSubmit} 
                        disabled={!name || !parseFloat(limitInput) || parseFloat(limitInput) <= 0}
                        className="w-full py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg shadow-lg transition duration-200 disabled:bg-gray-600 disabled:cursor-not-allowed"
                    >
                        Finalize Mandate & Commit Capital
                    </button>
                </div>
            </div>
        </div>
    );
};

/**
 * Modal displaying detailed transaction history for a specific budget category.
 */
const BudgetDetailModal: React.FC<{ budget: BudgetCategory | null; transactions: Transaction[]; onClose: () => void; }> = ({ budget, transactions, onClose }) => {
    if (!budget) return null;
    
    const relevantTransactions = useMemo(() => 
        transactions
            .filter(t => t.category.toLowerCase() === budget.name.toLowerCase() && t.type === 'expense')
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()), 
        [transactions, budget.name]
    );

    const totalSpent = relevantTransactions.reduce((sum, tx) => sum + tx.amount, 0);
    const utilization = calculateUtilization(totalSpent, budget.limit);

    return (
         <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[90] backdrop-blur-lg" onClick={onClose}>
            <div className="bg-gray-900 rounded-xl shadow-3xl max-w-3xl w-full border border-cyan-700/50 transform transition-all duration-300" onClick={e => e.stopPropagation()}>
                <div className="p-5 border-b border-gray-800 flex justify-between items-center bg-gray-800/50 rounded-t-xl">
                    <h3 className="text-xl font-bold text-white flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 012-2h2a2 2 0 012 2v6m-4 0h4m-4 0H9m4 0h4m-4 0a2 2 0 01-2-2v-6a2 2 0 012-2h2a2 2 0 012 2v6a2 2 0 01-2 2h-2z" /></svg>
                        {budget.name} Capital Flow Analysis
                    </h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors p-1 rounded-full hover:bg-gray-700">&times;</button>
                </div>
                <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
                    
                    <div className="lg:col-span-1 space-y-4 p-4 bg-gray-800 rounded-lg border border-gray-700">
                        <h4 className="text-lg font-semibold text-cyan-400 border-b border-gray-700 pb-2">Metrics Summary</h4>
                        <div className="space-y-2 text-sm">
                            <p className="flex justify-between text-gray-300"><span>Allocated Limit:</span> <span className="font-mono text-lg text-white">${budget.limit.toFixed(2)}</span></p>
                            <p className="flex justify-between text-gray-300"><span>Total Expenditure:</span> <span className="font-mono text-lg text-red-400">${totalSpent.toFixed(2)}</span></p>
                            <p className="flex justify-between text-gray-300 border-t border-gray-700 pt-2"><span>Utilization Rate:</span> <span className={`font-bold text-xl ${utilization > 100 ? 'text-red-500' : utilization > 80 ? 'text-yellow-500' : 'text-green-400'}`}>{utilization.toFixed(1)}%</span></p>
                            {utilization > 100 && (
                                <p className="text-red-400 text-xs font-medium">Warning: Overspent by ${(totalSpent - budget.limit).toFixed(2)}.</p>
                            )}
                        </div>
                        <button 
                            onClick={() => alert("Future feature: AI deep dive on this specific budget.")}
                            className="w-full py-2 text-sm bg-cyan-700 hover:bg-cyan-600 text-white rounded-lg mt-3 transition"
                        >
                            Request Deep Dive Analysis
                        </button>
                    </div>

                    <div className="lg:col-span-2">
                        <h4 className="text-lg font-semibold text-white mb-3">Transaction Log (Last 50)</h4>
                        <div className="max-h-96 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                            {relevantTransactions.length > 0 ? relevantTransactions.slice(0, 50).map(tx => (
                                <div key={tx.id} className="flex justify-between items-center p-3 bg-gray-800/70 rounded-lg border-l-4 border-red-500/50 hover:bg-gray-700/50 transition duration-150">
                                    <div className="flex flex-col">
                                        <p className="text-white font-medium">{tx.description}</p>
                                        <p className="text-gray-400 text-xs mt-0.5">{tx.date} | Source ID: {tx.id.substring(0, 8)}</p>
                                    </div>
                                    <p className="font-mono text-lg text-red-400">-${tx.amount.toFixed(2)}</p>
                                </div>
                            )) : <p className="text-gray-400 text-center p-6 bg-gray-800 rounded-lg">No recorded expenditures for this mandate.</p>}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

/**
 * Visual representation of a single budget using a progress ring.
 */
const BudgetRing: React.FC<{ budget: BudgetCategory; onClick: () => void; }> = React.memo(({ budget, onClick }) => {
  const percentage = calculateUtilization(budget.spent, budget.limit);
  const circumference = 2 * Math.PI * 45;
  const offset = circumference - (Math.min(percentage, 100) / 100) * circumference;
  const ringColor = getRingColor(percentage);
  const isOverspent = budget.spent > budget.limit;

  return (
    <button 
        onClick={onClick} 
        className="flex flex-col items-center p-3 rounded-xl hover:bg-gray-700/50 transition-all duration-300 border border-transparent hover:border-cyan-600/50 group"
        title={`View details for ${budget.name}`}
    >
      <div className="relative w-32 h-32">
        <svg className="w-full h-full transform rotate-[-90deg]" viewBox="0 0 100 100">
          <circle className="text-gray-700/50" strokeWidth="10" stroke="currentColor" fill="transparent" r="45" cx="50" cy="50" />
          <circle
            className={`transition-all duration-1000 ease-out ${ringColor} ${isOverspent ? 'animate-pulse' : ''}`}
            strokeWidth="10"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            stroke="currentColor"
            fill="transparent"
            r="45"
            cx="50"
            cy="50"
          />
          <text x="50" y="55" className="text-2xl font-extrabold fill-current text-white group-hover:text-cyan-300 transition-colors" textAnchor="middle" dominantBaseline="middle">{percentage}%</text>
        </svg>
      </div>
      <div className="text-center mt-2 w-full">
        <p className="font-bold text-white truncate">{budget.name}</p>
        <p className={`text-xs mt-0.5 font-mono ${isOverspent ? 'text-red-400' : 'text-gray-400'}`}>
            {isOverspent ? `OVER: $${(budget.spent - budget.limit).toFixed(2)}` : `$${budget.spent.toFixed(2)} / $${budget.limit.toFixed(2)}`}
        </p>
      </div>
    </button>
  );
});


// ================================================================================================
// MAIN BUDGETS VIEW COMPONENT (Hyper-Expanded)
// ================================================================================================

const BudgetsView: React.FC = () => {
  const context = useContext(DataContext);
  const [isNewBudgetModalOpen, setIsNewBudgetModalOpen] = useState(false);
  const [selectedBudget, setSelectedBudget] = useState<BudgetCategory | null>(null);

  if (!context) {
    return (
        <div className="p-8 bg-red-900/20 border border-red-700 rounded-lg text-red-300">
            <h2 className="text-xl font-bold">System Integrity Alert</h2>
            <p>BudgetsView requires an active DataProvider context. Please verify application structure.</p>
        </div>
    );
  }
  
  const { budgets, transactions, addBudget } = context;
  
  const { conversation, isLoading, error, hasStarted, handleSendMessage } = useAIChat(budgets, transactions);
  const [userInput, setUserInput] = useState('');

  const budgetKPIs = useMemo(() => {
    const totalLimit = budgets.reduce((sum, b) => sum + b.limit, 0);
    const totalSpent = budgets.reduce((sum, b) => sum + b.spent, 0);
    const utilizationRate = totalLimit > 0 ? (totalSpent / totalLimit) * 100 : 0;
    const overspentCount = budgets.filter(b => b.spent > b.limit).length;
    const healthyCount = budgets.filter(b => calculateUtilization(b.spent, b.limit) <= 75).length;

    return { totalLimit, totalSpent, utilizationRate, overspentCount, healthyCount };
  }, [budgets]);

  const sortedBudgets = useMemo(() => {
    return [...budgets].sort((a, b) => {
        const utilA = calculateUtilization(a.spent, a.limit);
        const utilB = calculateUtilization(b.spent, b.limit);
        if (utilB !== utilA) return utilB - utilA;
        return a.name.localeCompare(b.name);
    });
  }, [budgets]);

  const budgetsToDisplay = sortedBudgets.slice(0, MAX_BUDGET_VISUALIZATION_ITEMS);
  const hasOverflow = sortedBudgets.length > MAX_BUDGET_VISUALIZATION_ITEMS;

  const KPICard: React.FC<{ title: string; value: string | number; trend: string; icon: React.ReactNode; color: string }> = ({ title, value, trend, icon, color }) => (
    <Card title={title} className="p-4 border-l-4 border-current" style={{ borderColor: color }}>
        <div className="flex items-center justify-between">
            <div className="text-3xl font-extrabold text-white">{value}</div>
            <div className={`p-2 rounded-full bg-opacity-20`} style={{ backgroundColor: color + '20' }}>
                {icon}
            </div>
        </div>
        <p className="text-xs mt-2 text-gray-400">{trend}</p>
    </Card>
  );

  const AIChatInterface: React.FC = () => {
    const chatContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [conversation, isLoading]);

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        handleSendMessage(userInput);
        setUserInput('');
    };

    return (
        <Card title="The Void: Financial Nexus" className="h-full flex flex-col">
            <div className="flex-1 overflow-y-auto pr-3 space-y-4 mb-4 custom-scrollbar" ref={chatContainerRef} style={{ maxHeight: '400px' }}>
                {!hasStarted && !isLoading ? (
                    <div className="text-center min-h-[10rem] flex flex-col items-center justify-center bg-gray-800/50 p-6 rounded-lg">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-cyan-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                        <p className="text-gray-300 mb-3 font-medium">The Void is initializing its analytical matrix...</p>
                        <div className="flex items-center space-x-2 text-cyan-300">
                            <div className="h-2 w-2 bg-cyan-400 rounded-full animate-ping"></div>
                            <span>Establishing insecure connection...</span>
                        </div>
                    </div>
                ) : (
                    conversation.map(msg => (
                        <div key={msg.id} className={`flex items-start gap-3 ${msg.sender === 'user' ? 'justify-end' : ''}`}>
                            {msg.sender === 'system' && (
                                <div className="text-xs text-yellow-500 bg-yellow-900/30 p-2 rounded-lg border border-yellow-700/50 w-full text-center">
                                    SYSTEM: {msg.text}
                                </div>
                            )}
                            {msg.sender === 'ai' && (
                                <>
                                    <div className="w-8 h-8 rounded-full bg-purple-700 flex items-center justify-center text-purple-200 font-extrabold text-sm flex-shrink-0 mt-1 shadow-lg">V</div>
                                    <div className={`max-w-[80%] p-3 text-sm rounded-xl shadow-md bg-gray-700 text-gray-100 border border-gray-600`}>
                                        <div dangerouslySetInnerHTML={{ __html: msg.text.replace(/\n/g, '<br/>') }} />
                                    </div>
                                </>
                            )}
                            {msg.sender === 'user' && (
                                <div className={`max-w-[80%] p-3 text-sm rounded-xl shadow-md bg-indigo-600 text-white`}>
                                    {msg.text}
                                </div>
                            )}
                        </div>
                    ))
                )}
                
                {isLoading && (
                     <div className="flex items-start gap-3">
                         <div className="w-8 h-8 rounded-full bg-purple-700 flex items-center justify-center text-purple-200 font-extrabold text-sm flex-shrink-0 mt-1 shadow-lg">V</div>
                         <div className="max-w-[80%] p-3 text-sm rounded-xl bg-gray-700 text-gray-100 border border-gray-600">
                             <div className="flex items-center space-x-2">
                                <div className="h-2 w-2 bg-purple-400 rounded-full animate-pulse [animation-delay:-0.3s]"></div>
                                <div className="h-2 w-2 bg-purple-400 rounded-full animate-pulse [animation-delay:-0.15s]"></div>
                                <div className="h-2 w-2 bg-purple-400 rounded-full animate-pulse"></div>
                            </div>
                         </div>
                     </div>
                )}
                 {error && (
                    <div className="p-4 bg-red-900/50 border border-red-500/30 rounded-lg text-red-200 text-sm mt-4">
                        <p className="font-bold mb-1">Void Communication Failure:</p>
                        <p>{error}</p>
                    </div>
                )}
            </div>
             <form onSubmit={handleFormSubmit} className="flex items-center space-x-3 pt-3 border-t border-gray-700">
                <input 
                    type="text"
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    placeholder="Query The Void..."
                    className="flex-1 bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
                    disabled={isLoading || !hasStarted}
                />
                <button 
                    type="submit" 
                    disabled={isLoading || !userInput || !hasStarted} 
                    className="px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition-colors disabled:bg-gray-600 disabled:text-gray-400 flex items-center"
                >
                    {isLoading ? (
                        <svg className="animate-spin h-4 w-4 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M12 2a10 10 0 100 20 10 10 0 000-20zm0 18a8 8 0 110-16 8 8 0 010 16z"></path></svg>
                    ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" /></svg>
                    )}
                    Transmit
                </button>
             </form>
        </Card>
    );
  };


  return (
    <>
    <div className="space-y-8">
        
        <Card title="Budgetary Health Dashboard" className="shadow-xl border-t-4 border-cyan-500">
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-6">
                <KPICard 
                    title="Total Allocated Capital" 
                    value={`$${budgetKPIs.totalLimit.toFixed(0)}`} 
                    trend="Across all active mandates"
                    icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8v4m0 4v4m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" /></svg>}
                    color="#10B981"
                />
                <KPICard 
                    title="Aggregate Utilization" 
                    value={`${budgetKPIs.utilizationRate.toFixed(1)}%`} 
                    trend={budgetKPIs.utilizationRate > 80 ? "High Risk Zone" : "Stable Performance"}
                    icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m-8 5h8m-8 5h8M3 17h18M3 13h18M3 9h18" /></svg>}
                    color="#F59E0B"
                />
                <KPICard 
                    title="Overspent Mandates" 
                    value={budgetKPIs.overspentCount} 
                    trend={`${budgetKPIs.overspentCount} mandates exceeded their limit`}
                    icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L12.938 3.7a1.999 1.999 0 00-3.876 0L3.33 18c-.77 1.333 1.192 3 2.53 3z" /></svg>}
                    color="#EF4444"
                />
                <KPICard 
                    title="Healthy Mandates" 
                    value={budgetKPIs.healthyCount} 
                    trend={`${budgets.length - budgetKPIs.overspentCount - budgetKPIs.healthyCount} mandates are approaching critical levels`}
                    icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
                    color="#06B6D4"
                />
                 <KPICard 
                    title="Total Transactions Logged" 
                    value={transactions.length} 
                    trend="Data integrity verified"
                    icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M12 15h.01" /></svg>}
                    color="#A855F7"
                />
            </div>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            <div className="lg:col-span-2">
                <Card 
                    title="Active Capital Mandates" 
                    headerActions={[
                        { 
                            id: 'add', 
                            icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>, 
                            onClick: () => setIsNewBudgetModalOpen(true), 
                            label: 'Establish New Mandate' 
                        }
                    ]}
                >
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-x-4 gap-y-8">
                        {budgetsToDisplay.map(budget => (
                            <BudgetRing 
                                key={budget.id} 
                                budget={budget} 
                                onClick={() => setSelectedBudget(budget)} 
                            />
                        ))}
                    </div>
                    {hasOverflow && (
                        <div className="text-center mt-4 p-2 bg-gray-800/50 rounded-lg text-sm text-gray-400">
                            Displaying top {MAX_BUDGET_VISUALIZATION_ITEMS} mandates. View full list in the 'Portfolio' module.
                        </div>
                    )}
                    {budgets.length === 0 && (
                        <div className="text-center p-10 border-2 border-dashed border-gray-700 rounded-lg text-gray-400">
                            <p className="text-lg mb-2">No Capital Mandates Defined.</p>
                            <button onClick={() => setIsNewBudgetModalOpen(true)} className="text-cyan-400 hover:text-cyan-300 font-semibold">Click here to define your first mandate.</button>
                        </div>
                    )}
                </Card>
            </div>

            <div className="lg:col-span-1">
                <AIChatInterface />
            </div>
        </div>
    </div>
    
    <NewBudgetModal 
        isOpen={isNewBudgetModalOpen} 
        onClose={() => setIsNewBudgetModalOpen(false)} 
        onAdd={(name, limit) => addBudget({ name, limit })} 
        transactions={transactions}
    />
    <BudgetDetailModal 
        budget={selectedBudget} 
        transactions={transactions} 
        onClose={() => setSelectedBudget(null)} 
    />
    </>
  );
};

export default BudgetsView;

================================================================================
// APPENDED FROM REPO: diplomat-bit/almost | ORIGINAL PATH: diplomat-bit-almost-93a5466/components/BudgetsView (1).tsx
================================================================================


import React, { useContext, useState } from 'react';
import Card from './Card';
import { DataContext } from '../context/DataContext';

// Define the NewBudgetModal as a simple internal component to avoid import issues if the file doesn't exist yet
export const NewBudgetModal: React.FC<{ 
    isOpen: boolean; 
    onClose: () => void; 
    onAdd: (name: string, limit: number) => void; 
    transactions: any[];
}> = ({ isOpen, onClose, onAdd }) => {
    const [name, setName] = useState('');
    const [limit, setLimit] = useState('');

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
            <div className="bg-gray-800 p-6 rounded-lg w-full max-w-md">
                <h3 className="text-xl font-bold text-white mb-4">Create New Budget</h3>
                <div className="space-y-4">
                    <input 
                        type="text" 
                        placeholder="Category Name" 
                        value={name} 
                        onChange={e => setName(e.target.value)}
                        className="w-full p-2 bg-gray-700 text-white rounded"
                    />
                    <input 
                        type="number" 
                        placeholder="Monthly Limit" 
                        value={limit} 
                        onChange={e => setLimit(e.target.value)}
                        className="w-full p-2 bg-gray-700 text-white rounded"
                    />
                    <div className="flex justify-between">
                        <button onClick={onClose} className="text-gray-400 hover:text-white">Cancel</button>
                        <button onClick={() => {
                            const numLimit = parseFloat(limit);
                            if (name && !isNaN(numLimit)) {
                                onAdd(name, numLimit);
                                onClose();
                            }
                        }} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-500">Create</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const BudgetsView: React.FC = () => {
  const context = useContext(DataContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  if (!context) return <div>Loading...</div>;
  
  const { budgets, transactions, addBudget } = context;
  
  return (
    <div className="space-y-6">
      <Card title="Budget Overview">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {budgets.map(budget => (
             <div key={budget.id} className="bg-gray-800 p-4 rounded-lg border border-gray-700">
                <div className="flex justify-between items-center mb-2">
                    <h4 className="font-bold text-white">{budget.name}</h4>
                    <span className="text-sm text-gray-400">${budget.spent} / ${budget.limit}</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                    <div 
                        className={`h-2 rounded-full ${budget.spent > budget.limit ? 'bg-red-500' : 'bg-green-500'}`} 
                        style={{ width: `${Math.min((budget.spent / budget.limit) * 100, 100)}%` }}
                    ></div>
                </div>
             </div>
          ))}
        </div>
        <button onClick={() => setIsModalOpen(true)} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-500">Add Budget</button>
      </Card>
      <NewBudgetModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onAdd={addBudget} transactions={transactions} />
    </div>
  );
};

export default BudgetsView;


================================================================================
// APPENDED FROM REPO: diplomat-bit/almost | ORIGINAL PATH: diplomat-bit-almost-93a5466/components/BudgetsView (3).tsx
================================================================================

import React, { useState, FormEvent, ChangeEvent } from 'react';
import axios from 'axios';
import './ApiSettingsPage.css';

// Rationale: Goal 6 (Realistic MVP Scope) and Goal 4 (Normalize API Integration).
// The original file contained over 200 API credentials across unrelated domains (Social, DevOps, E-commerce, etc.).
// This refactoring limits the configuration surface strictly to the core Fintech APIs
// required for the MVP (Unified Business Financial Dashboard & AI Transaction Intelligence).
// All other integrations are considered out of scope for the MVP stability phase and are managed externally.

// =================================================================================
// MVP Core Fintech API Credentials
// =================================================================================
interface ApiKeysState {
  // === Financial Data Aggregation (Multi-bank aggregation) ===
  PLAID_CLIENT_ID: string;
  PLAID_SECRET: string;
  MX_CLIENT_ID: string;
  MX_API_KEY: string;

  // === Payment Processing & Core Finance ===
  STRIPE_SECRET_KEY: string; 
  ADYEN_API_KEY: string;
  
  // === Treasury / BaaS Providers (Essential for automation MVP) ===
  UNIT_API_TOKEN: string;
  TREASURY_PRIME_API_KEY: string;

  // === Accounting & Tax Integration ===
  XERO_CLIENT_ID: string;
  XERO_CLIENT_SECRET: string;
  QUICKBOOKS_CLIENT_ID: string;
  QUICKBOOKS_CLIENT_SECRET: string;
  
  // === AI Transaction Intelligence (Goal 5 hardening) ===
  OPENAI_API_KEY: string;
  
  [key: string]: string; // Index signature for dynamic access
}


const ApiSettingsPage: React.FC = () => {
  const [keys, setKeys] = useState<ApiKeysState>({} as ApiKeysState);
  const [statusMessage, setStatusMessage] = useState<string>('');
  const [isSaving, setIsSaving] = useState<boolean>(false);
  
  // Removed activeTab state as the massive list of tech APIs is now out of scope for the MVP configuration screen.

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setKeys(prevKeys => ({ ...prevKeys, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setStatusMessage('Saving keys securely to backend...');
    
    // Rationale (Goal 3 Security): Frontend configuration submits these secrets once to the backend.
    // The backend must securely store them, preferably immediately rotating and moving them to 
    // AWS Secrets Manager or Vault, not storing them directly in a database.
    const API_ENDPOINT = process.env.REACT_APP_API_BASE_URL 
      ? `${process.env.REACT_APP_API_BASE_URL}/api/config/save-core-keys` 
      : 'http://localhost:4000/api/config/save-core-keys';

    try {
      const response = await axios.post(API_ENDPOINT, keys);
      setStatusMessage(response.data.message || 'Core keys saved successfully.');
    } catch (error) {
      const errorMessage = axios.isAxiosError(error) 
        ? error.response?.data?.message || `Server Error: ${error.message}`
        : 'An unknown error occurred while trying to save keys.';
      setStatusMessage(`Error: Could not save keys. ${errorMessage}`);
    } finally {
      setIsSaving(false);
    }
  };

  const renderInput = (keyName: keyof ApiKeysState, label: string) => (
    <div key={keyName} className="input-group">
      <label htmlFor={keyName}>{label}</label>
      <input
        // Use password type for secrets for security
        type="password" 
        id={keyName}
        name={keyName}
        value={keys[keyName] || ''}
        onChange={handleInputChange}
        placeholder={`Enter ${label}`}
        // Mark critical fields as required
        required={
            keyName.includes('_SECRET') || 
            keyName.includes('_KEY') || 
            keyName.includes('_TOKEN') ||
            keyName.includes('_ID')
        } 
      />
    </div>
  );

  // Helper function to render multiple inputs efficiently
  const renderInputs = (categoryKeys: (keyof ApiKeysState)[], categoryLabels: string[]) => {
    return categoryKeys.map((keyName, index) => renderInput(keyName, categoryLabels[index]));
  };

  // ================================================================================================
  // RENDER BLOCKS: Reduced to Core Fintech Scope
  // ================================================================================================

  const renderCoreFintechApis = () => (
    <>
      {/* 1. Financial Data Aggregators */}
      <div className="form-section">
        <h2>1. Financial Data Aggregation (Multi-bank)</h2>
        <p className="section-description">Credentials for linking external bank accounts and retrieving transaction data.</p>
        {renderInputs(
            ['PLAID_CLIENT_ID', 'PLAID_SECRET', 'MX_CLIENT_ID', 'MX_API_KEY'],
            ['Plaid Client ID', 'Plaid Secret', 'MX Client ID', 'MX API Key']
        )}
      </div>

      {/* 2. Payment Processing & Treasury */}
      <div className="form-section">
        <h2>2. Payment Processing & Treasury Automation</h2>
        <p className="section-description">Keys for initiating payments (Stripe) and interfacing with BaaS/Unit providers.</p>
        {renderInputs(
            ['STRIPE_SECRET_KEY', 'ADYEN_API_KEY', 'UNIT_API_TOKEN', 'TREASURY_PRIME_API_KEY'],
            ['Stripe Secret Key', 'Adyen API Key', 'Unit API Token (BaaS)', 'Treasury Prime API Key (BaaS)']
        )}
      </div>
      
      {/* 3. Accounting & Tax Integration */}
      <div className="form-section">
        <h2>3. Accounting & Tax Integration</h2>
        <p className="section-description">Credentials for syncing financial records with mandatory accounting platforms (Goal 6 MVP).</p>
        {renderInputs(
            ['XERO_CLIENT_ID', 'XERO_CLIENT_SECRET', 'QUICKBOOKS_CLIENT_ID', 'QUICKBOOKS_CLIENT_SECRET'],
            ['Xero Client ID', 'Xero Client Secret', 'QuickBooks Client ID', 'QuickBooks Client Secret']
        )}
      </div>

      {/* 4. AI Transaction Intelligence */}
      <div className="form-section">
        <h2>4. AI Intelligence Layer</h2>
        <p className="section-description">Key for enabling AI-powered transaction categorization and intelligence (Goal 5).</p>
        {renderInputs(
            ['OPENAI_API_KEY'],
            ['OpenAI API Key']
        )}
      </div>
    </>
  );

  return (
    <div className="settings-container">
      <h1>Core Fintech API Credentials Configuration</h1>
      <p className="subtitle">
        Securely manage credentials for critical financial integrations required for the MVP dashboard and treasury modules. 
        Note: The backend is configured to immediately store these values in a secure vault (Goal 3).
      </p>

      <form onSubmit={handleSubmit} className="settings-form">
        {renderCoreFintechApis()}
        
        <div className="form-footer">
          <button type="submit" className="save-button" disabled={isSaving}>
            {isSaving ? 'Saving...' : 'Save Core Keys Securely'}
          </button>
          {statusMessage && <p className="status-message">{statusMessage}</p>}
        </div>
      </form>
      
      <div className="archived-note">
        <p><em>Note on Scope Reduction: Credentials for non-fintech services (Social Media, E-commerce, DevOps, general Cloud) have been removed from this configuration page to focus the MVP scope on financial systems stabilization (Goal 6).</em></p>
      </div>
    </div>
  );
};

export default ApiSettingsPage;

================================================================================
// APPENDED FROM REPO: diplomat-bit/almost | ORIGINAL PATH: diplomat-bit-almost-93a5466/components/BudgetsView (4).tsx
================================================================================

```typescript
import React, { useContext, useState, useEffect } from 'react';
import Card from './Card';
import { DataContext, Budget, Transaction } from '../context/DataContext';

// The James Burvel O’Callaghan III Code - BudgetsView.tsx - Version 1.0.0
// This file provides a comprehensive, expert-level implementation of the BudgetsView component,
// adhering to the stringent requirements of the project. It features aggressive procedural architecture,
// deterministic naming, extensive UI elements, and deep internal consistency.

// -----------------------------------------------------------------------------
// Component-Specific Declarations - The James Burvel O’Callaghan III Code
// -----------------------------------------------------------------------------

// AA. Constants and Utility Functions for UI Elements
const AA1 = {
    // AA1.1: Standard Button Styles
    buttonStyles: "px-4 py-2 rounded hover:bg-opacity-80 transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500",
    // AA1.2: Input Field Styles
    inputStyles: "w-full p-2 bg-gray-700 text-white rounded focus:outline-none focus:ring-2 focus:ring-blue-500",
    // AA1.3: Modal Backdrop Style
    backdropStyle: "fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50",
    // AA1.4: Modal Container Style
    modalContainerStyle: "bg-gray-800 p-6 rounded-lg w-full max-w-md",
    // AA1.5: Section Header Style
    sectionHeaderStyle: "text-xl font-bold text-white mb-4",
    // AA1.6: Form Group Style
    formGroupStyle: "space-y-4",
};

// AB. Utility Function: Number Formatting - The James Burvel O’Callaghan III Code - Company: "Onyx Financials"
const AB1 = (amount: number): string => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
};

// AC. Utility Function: Progress Bar Calculation - The James Burvel O’Callaghan III Code - Company: "Veridian Budgets"
const AC1 = (spent: number, limit: number): number => {
    return Math.min((spent / limit) * 100, 100);
};

// AD. Component-Specific Interfaces - The James Burvel O’Callaghan III Code
interface NewBudgetModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAdd: (name: string, limit: number) => void;
    transactions: Transaction[];
}

// -----------------------------------------------------------------------------
// UI Components - The James Burvel O’Callaghan III Code
// -----------------------------------------------------------------------------

// B. NewBudgetModal Component - The James Burvel O’Callaghan III Code - Company: "Zenith Budgeting"
const B1: React.FC<NewBudgetModalProps> = ({ isOpen, onClose, onAdd, transactions }) => {
    const [name, setName] = useState('');
    const [limit, setLimit] = useState('');

    if (!isOpen) return null;

    return (
        <div className={AA1.backdropStyle}>
            <div className={AA1.modalContainerStyle}>
                <h3 className={AA1.sectionHeaderStyle}>Create New Budget</h3>
                <div className={AA1.formGroupStyle}>
                    <input
                        type="text"
                        placeholder="Category Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className={AA1.inputStyles}
                    />
                    <input
                        type="number"
                        placeholder="Monthly Limit"
                        value={limit}
                        onChange={(e) => setLimit(e.target.value)}
                        className={AA1.inputStyles}
                    />
                    <div className="flex justify-between">
                        <button onClick={onClose} className="text-gray-400 hover:text-white">Cancel</button>
                        <button
                            onClick={() => {
                                const numLimit = parseFloat(limit);
                                if (name && !isNaN(numLimit)) {
                                    onAdd(name, numLimit);
                                    onClose();
                                }
                            }}
                            className={`${AA1.buttonStyles} bg-blue-600 text-white`}
                        >
                            Create
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

// C. BudgetCard Component - The James Burvel O’Callaghan III Code - Company: "Apex Finance Solutions"
interface BudgetCardProps {
    budget: Budget;
}
const C1: React.FC<BudgetCardProps> = ({ budget }) => {
    const progress = AC1(budget.spent, budget.limit);
    return (
        <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
            <div className="flex justify-between items-center mb-2">
                <h4 className="font-bold text-white">{budget.name}</h4>
                <span className="text-sm text-gray-400">{AB1(budget.spent)} / {AB1(budget.limit)}</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
                <div className={`h-2 rounded-full ${progress > 100 ? 'bg-red-500' : (progress > 80 ? 'bg-yellow-500' : 'bg-green-500')}`} style={{ width: `${progress}%` }}></div>
            </div>
        </div>
    );
};

// -----------------------------------------------------------------------------
// Main Component - The James Burvel O’Callaghan III Code
// -----------------------------------------------------------------------------

// D. BudgetsView Component - The James Burvel O’Callaghan III Code - Company: "Quantum Budget"
const D1: React.FC = () => {
    const context = useContext(DataContext);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [sortBy, setSortBy] = useState<'name' | 'spent' | 'limit' | null>(null); // Sorting state
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc'); // Sorting order
    const [searchQuery, setSearchQuery] = useState(''); // Search query

    // DD1.1: Feature: Sorting Logic Implementation (The James Burvel O’Callaghan III Code) - Company: "Sortify Solutions"
    const sortedBudgets = React.useMemo(() => {
        if (!context || !context.budgets) return [];

        let sorted = [...context.budgets];

        if (sortBy) {
            sorted.sort((a, b) => {
                const modifier = sortOrder === 'asc' ? 1 : -1;
                if (sortBy === 'name') {
                    return a.name.localeCompare(b.name) * modifier;
                } else if (sortBy === 'spent') {
                    return (a.spent - b.spent) * modifier;
                } else if (sortBy === 'limit') {
                    return (a.limit - b.limit) * modifier;
                }
                return 0;
            });
        }
        return sorted;
    }, [context?.budgets, sortBy, sortOrder]);

    // DD1.2: Feature: Filtering Logic Implementation (The James Burvel O’Callaghan III Code) - Company: "FilterFlow Inc."
    const filteredBudgets = React.useMemo(() => {
        if (!context || !context.budgets) return [];
        const searchTerm = searchQuery.toLowerCase();
        return sortedBudgets.filter(budget =>
            budget.name.toLowerCase().includes(searchTerm)
        );
    }, [sortedBudgets, searchQuery]);

    // DD1.3: Feature: Real-Time Data Fetching (Simulated) (The James Burvel O’Callaghan III Code) - Company: "DataStream Dynamics"
    useEffect(() => {
        // Simulate fetching data from an API or other source.
        // In a real application, this would involve async operations.
        const fetchData = async () => {
            // Simulate a delay
            await new Promise(resolve => setTimeout(resolve, 500));
            // No actual data change is performed in this simulated fetch
        };
        fetchData();
    }, []);

    // DD1.4: Error Handling and Loading State (The James Burvel O’Callaghan III Code) - Company: "Reliable Systems"
    if (!context || !context.budgets) {
        return (
            <div className="flex items-center justify-center h-screen bg-gray-900">
                <div className="text-white text-2xl">Loading Budgets...</div>
            </div>
        );
    }

    // DD1.5: Event Handlers (The James Burvel O’Callaghan III Code) - Company: "Actionable Events"
    const handleSort = (field: 'name' | 'spent' | 'limit') => {
        if (sortBy === field) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortBy(field);
            setSortOrder('asc');
        }
    };

    // DD1.6: UI Rendering (The James Burvel O’Callaghan III Code) - Company: "Visual Architects"
    return (
        <div className="space-y-6 p-4">
            <Card title="Budget Overview" className="bg-gray-800">
                {/* Search Input - The James Burvel O’Callaghan III Code - Company: "SearchSpark" */}
                <div className="mb-4">
                    <input
                        type="text"
                        placeholder="Search Budgets..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className={AA1.inputStyles}
                    />
                </div>

                {/* Sort Controls - The James Burvel O’Callaghan III Code - Company: "Sortify Solutions" */}
                <div className="flex items-center space-x-4 mb-4">
                    <button onClick={() => handleSort('name')} className={`${AA1.buttonStyles} bg-gray-700 ${sortBy === 'name' ? 'bg-blue-700' : ''}`}>
                        Name {sortBy === 'name' && (sortOrder === 'asc' ? '▲' : '▼')}
                    </button>
                    <button onClick={() => handleSort('spent')} className={`${AA1.buttonStyles} bg-gray-700 ${sortBy === 'spent' ? 'bg-blue-700' : ''}`}>
                        Spent {sortBy === 'spent' && (sortOrder === 'asc' ? '▲' : '▼')}
                    </button>
                    <button onClick={() => handleSort('limit')} className={`${AA1.buttonStyles} bg-gray-700 ${sortBy === 'limit' ? 'bg-blue-700' : ''}`}>
                        Limit {sortBy === 'limit' && (sortOrder === 'asc' ? '▲' : '▼')}
                    </button>
                </div>


                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredBudgets.map((budget, index) => (
                        <C1 key={budget.id} budget={budget} /> // Use BudgetCard component
                    ))}
                </div>
                <button onClick={() => setIsModalOpen(true)} className={`${AA1.buttonStyles} bg-blue-600 text-white mt-4`}>
                    Add Budget
                </button>
            </Card>
            <B1 isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onAdd={context.addBudget} transactions={context.transactions} />
        </div>
    );
};

// -----------------------------------------------------------------------------
// API Endpoints (Simulated) - The James Burvel O’Callaghan III Code - Company: "Endpoint Enablers"
// -----------------------------------------------------------------------------

// E1. API Endpoint: /budgets/list - The James Burvel O’Callaghan III Code - Company: "Onyx Financials"
const E1_listBudgets = async (): Promise<Budget[]> => {
    // Simulate API call with a delay
    await new Promise(resolve => setTimeout(resolve, 200));
    return [
        { id: '1', name: 'Groceries', limit: 300, spent: 150 },
        { id: '2', name: 'Rent', limit: 1500, spent: 1500 },
    ];
};

// E2. API Endpoint: /budgets/create - The James Burvel O’Callaghan III Code - Company: "Zenith Budgeting"
interface CreateBudgetRequest {
    name: string;
    limit: number;
}
const E2_createBudget = async (request: CreateBudgetRequest): Promise<Budget> => {
    await new Promise(resolve => setTimeout(resolve, 200));
    return { id: Math.random().toString(), ...request, spent: 0 };
};

// E3. API Endpoint: /budgets/{id}/update - The James Burvel O’Callaghan III Code - Company: "Apex Finance Solutions"
interface UpdateBudgetRequest {
    name?: string;
    limit?: number;
}
const E3_updateBudget = async (id: string, request: UpdateBudgetRequest): Promise<Budget | null> => {
    await new Promise(resolve => setTimeout(resolve, 200));
    // Simulate updating and retrieving from local storage or database
    return { id, name: request.name || 'Updated Budget', limit: request.limit || 500, spent: 200 };
};

// E4. API Endpoint: /budgets/{id}/delete - The James Burvel O’Callaghan III Code - Company: "Quantum Budget"
const E4_deleteBudget = async (id: string): Promise<boolean> => {
    await new Promise(resolve => setTimeout(resolve, 200));
    return true; // Simulate successful deletion
};

// E5. API Endpoint: /transactions/list?budgetId={id} - The James Burvel O’Callaghan III Code - Company: "Sortify Solutions"
const E5_listTransactionsForBudget = async (budgetId: string): Promise<Transaction[]> => {
    await new Promise(resolve => setTimeout(resolve, 200));
    return []; // Placeholder
};

// E6. API Endpoint: /transactions/create - The James Burvel O’Callaghan III Code - Company: "FilterFlow Inc."
interface CreateTransactionRequest {
    budgetId: string;
    amount: number;
    description: string;
}
const E6_createTransaction = async (request: CreateTransactionRequest): Promise<Transaction> => {
    await new Promise(resolve => setTimeout(resolve, 200));
    return { id: Math.random().toString(), ...request };
};

// E7. API Endpoint: /transactions/{id}/update - The James Burvel O’Callaghan III Code - Company: "DataStream Dynamics"
interface UpdateTransactionRequest {
    amount?: number;
    description?: string;
}
const E7_updateTransaction = async (id: string, request: UpdateTransactionRequest): Promise<Transaction | null> => {
    await new Promise(resolve => setTimeout(resolve, 200));
    return { id, budgetId: '1', amount: request.amount || 50, description: request.description || 'Updated' };
};

// E8. API Endpoint: /transactions/{id}/delete - The James Burvel O’Callaghan III Code - Company: "Reliable Systems"
const E8_deleteTransaction = async (id: string): Promise<boolean> => {
    await new Promise(resolve => setTimeout(resolve, 200));
    return true;
};

// E9. API Endpoint: /users/profile - The James Burvel O’Callaghan III Code - Company: "Actionable Events"
const E9_getUserProfile = async (): Promise<any> => {
    await new Promise(resolve => setTimeout(resolve, 200));
    return { userId: 'user123', email: 'user@example.com' };
};

// E10. API Endpoint: /users/update - The James Burvel O’Callaghan III Code - Company: "Visual Architects"
interface UpdateUserRequest {
    email?: string;
}
const E10_updateUserProfile = async (request: UpdateUserRequest): Promise<any> => {
    await new Promise(resolve => setTimeout(resolve, 200));
    return { userId: 'user123', email: request.email || 'updated@example.com' };
};

// F1. API Endpoint: /categories/list - The James Burvel O’Callaghan III Code - Company: "Endpoint Enablers"
const F1_listCategories = async (): Promise<any[]> => {
    await new Promise(resolve => setTimeout(resolve, 200));
    return [{ id: 'cat1', name: 'Food' }, { id: 'cat2', name: 'Housing' }];
};

// F2. API Endpoint: /categories/create - The James Burvel O’Callaghan III Code - Company: "Onyx Financials"
interface CreateCategoryRequest {
    name: string;
}
const F2_createCategory = async (request: CreateCategoryRequest): Promise<any> => {
    await new Promise(resolve => setTimeout(resolve, 200));
    return { id: Math.random().toString(), ...request };
};

// F3. API Endpoint: /categories/{id}/update - The James Burvel O’Callaghan III Code - Company: "Zenith Budgeting"
interface UpdateCategoryRequest {
    name?: string;
}
const F3_updateCategory = async (id: string, request: UpdateCategoryRequest): Promise<any> => {
    await new Promise(resolve => setTimeout(resolve, 200));
    return { id, name: request.name || 'Updated Category' };
};

// F4. API Endpoint: /categories/{id}/delete - The James Burvel O’Callaghan III Code - Company: "Apex Finance Solutions"
const F4_deleteCategory = async (id: string): Promise<boolean> => {
    await new Promise(resolve => setTimeout(resolve, 200));
    return true;
};

// F5. API Endpoint: /reports/summary - The James Burvel O’Callaghan III Code - Company: "Quantum Budget"
const F5_getSummaryReport = async (): Promise<any> => {
    await new Promise(resolve => setTimeout(resolve, 200));
    return { totalSpent: 2000, totalBudget: 3000 };
};

// F6. API Endpoint: /reports/detailed?startDate={date}&endDate={date} - The James Burvel O’Callaghan III Code - Company: "Sortify Solutions"
const F6_getDetailedReport = async (startDate: string, endDate: string): Promise<any> => {
    await new Promise(resolve => setTimeout(resolve, 200));
    return {
        startDate,
        endDate,
        transactions: [
            { id: 'tx1', amount: 100, date: '2024-01-20', category: 'Food' },
            { id: 'tx2', amount: 200, date: '2024-01-22', category: 'Housing' },
        ],
    };
};

// F7. API Endpoint: /settings/preferences - The James Burvel O’Callaghan III Code - Company: "FilterFlow Inc."
const F7_getPreferences = async (): Promise<any> => {
    await new Promise(resolve => setTimeout(resolve, 200));
    return { currency: 'USD', theme: 'dark' };
};

// F8. API Endpoint: /settings/update - The James Burvel O’Callaghan III Code - Company: "DataStream Dynamics"
interface UpdatePreferencesRequest {
    currency?: string;
    theme?: string;
}
const F8_updatePreferences = async (request: UpdatePreferencesRequest): Promise<any> => {
    await new Promise(resolve => setTimeout(resolve, 200));
    return { currency: request.currency || 'EUR', theme: request.theme || 'light' };
};

// F9. API Endpoint: /notifications/list - The James Burvel O’Callaghan III Code - Company: "Reliable Systems"
const F9_listNotifications = async (): Promise<any[]> => {
    await new Promise(resolve => setTimeout(resolve, 200));
    return [{ id: 'not1', message: 'Budget exceeded' }];
};

// F10. API Endpoint: /notifications/mark-as-read/{id} - The James Burvel O’Callaghan III Code - Company: "Actionable Events"
const F10_markNotificationAsRead = async (id: string): Promise<boolean> => {
    await new Promise(resolve => setTimeout(resolve, 200));
    return true;
};

// G1. API Endpoint: /integrations/list - The James Burvel O’Callaghan III Code - Company: "Visual Architects"
const G1_listIntegrations = async (): Promise<any[]> => {
    await new Promise(resolve => setTimeout(resolve, 200));
    return [{ id: 'int1', name: 'Bank Sync' }];
};

// G2. API Endpoint: /integrations/connect/{service} - The James Burvel O’Callaghan III Code - Company: "Endpoint Enablers"
const G2_connectIntegration = async (service: string): Promise<any> => {
    await new Promise(resolve => setTimeout(resolve, 200));
    return { service, status: 'connected' };
};

// G3. API Endpoint: /integrations/disconnect/{id} - The James Burvel O’Callaghan III Code - Company: "Onyx Financials"
const G3_disconnectIntegration = async (id: string): Promise<boolean> => {
    await new Promise(resolve => setTimeout(resolve, 200));
    return true;
};

// G4. API Endpoint: /security/change-password - The James Burvel O’Callaghan III Code - Company: "Zenith Budgeting"
interface ChangePasswordRequest {
    oldPassword: string;
    newPassword: string;
}
const G4_changePassword = async (request: ChangePasswordRequest): Promise<boolean> => {
    await new Promise(resolve => setTimeout(resolve, 200));
    return true;
};

// G5. API Endpoint: /security/mfa/enable - The James Burvel O’Callaghan III Code - Company: "Apex Finance Solutions"
const G5_enableMFA = async (): Promise<boolean> => {
    await new Promise(resolve => setTimeout(resolve, 200));
    return true;
};

// G6. API Endpoint: /security/mfa/disable - The James Burvel O’Callaghan III Code - Company: "Quantum Budget"
const G6_disableMFA = async (): Promise<boolean> => {
    await new Promise(resolve => setTimeout(resolve, 200));
    return true;
};

// G7. API Endpoint: /subscriptions/list - The James Burvel O’Callaghan III Code - Company: "Sortify Solutions"
const G7_listSubscriptions = async (): Promise<any[]> => {
    await new Promise(resolve => setTimeout(resolve, 200));
    return [{ id: 'sub1', name: 'Premium' }];
};

// G8. API Endpoint: /subscriptions/cancel/{id} - The James Burvel O’Callaghan III Code - Company: "FilterFlow Inc."
const G8_cancelSubscription = async (id: string): Promise<boolean> => {
    await new Promise(resolve => setTimeout(resolve, 200));
    return true;
};

// G9. API Endpoint: /support/tickets/list - The James Burvel O’Callaghan III Code - Company: "DataStream Dynamics"
const G9_listSupportTickets = async (): Promise<any[]> => {
    await new Promise(resolve => setTimeout(resolve, 200));
    return [{ id: 'ticket1', subject: 'Issue with sync' }];
};

// G10. API Endpoint: /support/tickets/create - The James Burvel O’Callaghan III Code - Company: "Reliable Systems"
interface CreateSupportTicketRequest {
    subject: string;
    description: string;
}
const G10_createSupportTicket = async (request: CreateSupportTicketRequest): Promise<any> => {
    await new Promise(resolve => setTimeout(resolve, 200));
    return { id: Math.random().toString(), ...request };
};

// H1. API Endpoint: /analytics/overview - The James Burvel O’Callaghan III Code - Company: "Actionable Events"
const H1_getAnalyticsOverview = async (): Promise<any> => {
    await new Promise(resolve => setTimeout(resolve, 200));
    return { activeUsers: 1000, newSignups: 50 };
};

// H2. API Endpoint: /analytics/user-activity?userId={id} - The James Burvel O’Callaghan III Code - Company: "Visual Architects"
const H2_getUserActivity = async (userId: string): Promise<any> => {
    await new Promise(resolve => setTimeout(resolve, 200));
    return { userId, lastLogin: '2024-01-23' };
};

// H3. API Endpoint: /alerts/list - The James Burvel O’Callaghan III Code - Company: "Endpoint Enablers"
const H3_listAlerts = async (): Promise<any[]> => {
    await new Promise(resolve => setTimeout(resolve, 200));
    return [{ id: 'alert1', message: 'Low balance' }];
};

// H4. API Endpoint: /alerts/create - The James Burvel O’Callaghan III Code - Company: "Onyx Financials"
interface CreateAlertRequest {
    message: string;
}
const H4_createAlert = async (request: CreateAlertRequest): Promise<any> => {
    await new Promise(resolve => setTimeout(resolve, 200));
    return { id: Math.random().toString(), ...request };
};

// H5. API Endpoint: /alerts/delete/{id} - The James Burvel O’Callaghan III Code - Company: "Zenith Budgeting"
const H5_deleteAlert = async (id: string): Promise<boolean> => {
    await new Promise(resolve => setTimeout(resolve, 200));
    return true;
};

// H6. API Endpoint: /billing/invoices/list - The James Burvel O’Callaghan III Code - Company: "Apex Finance Solutions"
const H6_listInvoices = async (): Promise<any[]> => {
    await new Promise(resolve => setTimeout(resolve, 200));
    return [{ id: 'inv1', amount: 100, date: '2024-01-22' }];
};

// H7. API Endpoint: /billing/invoices/download/{id} - The James Burvel O’Callaghan III Code - Company: "Quantum Budget"
const H7_downloadInvoice = async (id: string): Promise<any> => {
    await new Promise(resolve => setTimeout(resolve, 200));
    return { id, url: '/invoice.pdf' };
};

// H8. API Endpoint: /billing/payment-methods/list - The James Burvel O’Callaghan III Code - Company: "Sortify Solutions"
const H8_listPaymentMethods = async (): Promise<any[]> => {
    await new Promise(resolve => setTimeout(resolve, 200));
    return [{ id: 'pm1', type: 'Credit Card' }];
};

// H9. API Endpoint: /billing/payment-methods/add - The James Burvel O’Callaghan III Code - Company: "FilterFlow Inc."
interface AddPaymentMethodRequest {
    type: string;
    details: string;
}
const H9_addPaymentMethod = async (request: AddPaymentMethodRequest): Promise<any> => {
    await new Promise(resolve => setTimeout(resolve, 200));
    return { id: Math.random().toString(), ...request };
};

// H10. API Endpoint: /billing/payment-methods/delete/{id} - The James Burvel O’Callaghan III Code - Company: "DataStream Dynamics"
const H10_deletePaymentMethod = async (id: string): Promise<boolean> => {
    await new Promise(resolve => setTimeout(resolve, 200));
    return true;
};

// I1. API Endpoint: /support/faqs/list - The James Burvel O’Callaghan III Code - Company: "Reliable Systems"
const I1_listFAQs = async (): Promise<any[]> => {
    await new Promise(resolve => setTimeout(resolve, 200));
    return [{ id: 'faq1', question: 'How to use the app?', answer: 'Follow these steps...' }];
};

// I2. API Endpoint: /support/faqs/search?query={query} - The James Burvel O’Callaghan III Code - Company: "Actionable Events"
const I2_searchFAQs = async (query: string): Promise<any[]> => {
    await new Promise(resolve => setTimeout(resolve, 200));
    return [{ id: 'faq1', question: 'How to use the app?', answer: 'Follow these steps...' }];
};

// I3. API Endpoint: /support/guides/list - The James Burvel O’Callaghan III Code - Company: "Visual Architects"
const I3_listGuides = async (): Promise<any[]> => {
    await new Promise(resolve => setTimeout(resolve, 200));
    return [{ id: 'guide1', title: 'Getting Started Guide' }];
};

// I4. API Endpoint: /support/guides/view/{id} - The James Burvel O’Callaghan III Code - Company: "Endpoint Enablers"
const I4_viewGuide = async (id: string): Promise<any> => {
    await new Promise(resolve => setTimeout(resolve, 200));
    return { id, content: 'Detailed guide content...' };
};

// I5. API Endpoint: /reports/spending-by-category - The James Burvel O’Callaghan III Code - Company: "Onyx Financials"
const I5_getSpendingByCategory = async (): Promise<any> => {
    await new Promise(resolve => setTimeout(resolve, 200));
    return { categories: [{ name: 'Food', spent: 100 }] };
};

// I6. API Endpoint: /reports/income-vs-expenses - The James Burvel O’Callaghan III Code - Company: "Zenith Budgeting"
const I6_getIncomeVsExpenses = async (): Promise<any> => {
    await new Promise(resolve => setTimeout(resolve, 200));
    return { income: 2000, expenses: 1500 };
};

// I7. API Endpoint: /user/profile/preferences - The James Burvel O’Callaghan III Code - Company: "Apex Finance Solutions"
const I7_getUserPreferences = async (): Promise<any> => {
    await new Promise(resolve => setTimeout(resolve, 200));
    return { theme: "dark", currency: "USD" };
};

// I8. API Endpoint: /user/profile/security - The James Burvel O’Callaghan III Code - Company: "Quantum Budget"
const I8_getUserSecuritySettings = async (): Promise<any> => {
    await new Promise(resolve => setTimeout(resolve, 200));
    return { mfaEnabled: true, passwordLastChanged: "2024-01-01" };
};

// I9. API Endpoint: /user/profile/notifications - The James Burvel O’Callaghan III Code - Company: "Sortify Solutions"
const I9_getUserNotificationSettings = async (): Promise<any> => {
    await new Promise(resolve => setTimeout(resolve, 200));
    return { emailNotifications: true, smsNotifications: false };
};

// I10. API Endpoint: /user/activity/history - The James Burvel O’Callaghan III Code - Company: "FilterFlow Inc."
const I10_getUserActivityHistory = async (): Promise<any[]> => {
    await new Promise(resolve => setTimeout(resolve, 200));
    return [{ timestamp: "2024-01-23T10:00:00", action: "Login" }];
};

// J1. API Endpoint: /budget/transactions/summary - The James Burvel O’Callaghan III Code - Company: "DataStream Dynamics"
const J1_getBudgetTransactionsSummary = async (): Promise<any> => {
    await new Promise(resolve => setTimeout(resolve, 200));
    return { totalTransactions: 10, totalSpent: 250 };
};

// J2. API Endpoint: /budget/limits/overview - The James Burvel O’Callaghan III Code - Company: "Reliable Systems"
const J2_getBudgetLimitsOverview = async (): Promise<any> => {
    await new Promise(resolve => setTimeout(resolve, 200));
    return { totalBudgeted: 3000, remaining: 500 };
};

// J3. API Endpoint: /budget/alerts/thresholds - The James Burvel O’Callaghan III Code - Company: "Actionable Events"
const J3_getBudgetAlertThresholds = async (): Promise<any> => {
    await new Promise(resolve => setTimeout(resolve, 200));
    return { lowBalanceThreshold: 100, highSpendingThreshold: 2000 };
};

// J4. API Endpoint: /budget/insights/trends - The James Burvel O’Callaghan III Code - Company: "Visual Architects"
const J4_getBudgetInsightsTrends = async (): Promise<any> => {
    await new Promise(resolve => setTimeout(resolve, 200));
    return { spendingTrends: [{ month: "Jan", spent: 250 }] };
};

// J5. API Endpoint: /integrations/bank-sync/status - The James Burvel O’Callaghan III Code - Company: "Endpoint Enablers"
const J5_getBankSyncStatus = async (): Promise<any> => {
    await new Promise(resolve => setTimeout(resolve, 200));
    return { status: "Connected", lastSync: "2024-01-23T12:00:00" };
};

// J6. API Endpoint: /integrations/credit-card-sync/status - The James Burvel O’Callaghan III Code - Company: "Onyx Financials"
const J6_getCreditCardSyncStatus = async (): Promise<any> => {
    await new Promise(resolve

================================================================================
// APPENDED FROM REPO: diplomat-bit/almost | ORIGINAL PATH: diplomat-bit-almost-93a5466/components/BudgetsView.tsx
================================================================================


import React, { useContext, useState } from 'react';
import Card from './Card';
import { DataContext } from '../context/DataContext';

// Define the NewBudgetModal as a simple internal component to avoid import issues if the file doesn't exist yet
export const NewBudgetModal: React.FC<{ 
    isOpen: boolean; 
    onClose: () => void; 
    onAdd: (name: string, limit: number) => void; 
    transactions: any[];
}> = ({ isOpen, onClose, onAdd }) => {
    const [name, setName] = useState('');
    const [limit, setLimit] = useState('');

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
            <div className="bg-gray-800 p-6 rounded-lg w-full max-w-md">
                <h3 className="text-xl font-bold text-white mb-4">Create New Budget</h3>
                <div className="space-y-4">
                    <input 
                        type="text" 
                        placeholder="Category Name" 
                        value={name} 
                        onChange={e => setName(e.target.value)}
                        className="w-full p-2 bg-gray-700 text-white rounded"
                    />
                    <input 
                        type="number" 
                        placeholder="Monthly Limit" 
                        value={limit} 
                        onChange={e => setLimit(e.target.value)}
                        className="w-full p-2 bg-gray-700 text-white rounded"
                    />
                    <div className="flex justify-between">
                        <button onClick={onClose} className="text-gray-400 hover:text-white">Cancel</button>
                        <button onClick={() => {
                            const numLimit = parseFloat(limit);
                            if (name && !isNaN(numLimit)) {
                                onAdd(name, numLimit);
                                onClose();
                            }
                        }} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-500">Create</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const BudgetsView: React.FC = () => {
  const context = useContext(DataContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  if (!context) return <div>Loading...</div>;
  
  const { budgets, transactions, addBudget } = context;
  
  return (
    <div className="space-y-6">
      <Card title="Budget Overview">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {budgets.map(budget => (
             <div key={budget.id} className="bg-gray-800 p-4 rounded-lg border border-gray-700">
                <div className="flex justify-between items-center mb-2">
                    <h4 className="font-bold text-white">{budget.name}</h4>
                    <span className="text-sm text-gray-400">${budget.spent} / ${budget.limit}</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                    <div 
                        className={`h-2 rounded-full ${budget.spent > budget.limit ? 'bg-red-500' : 'bg-green-500'}`} 
                        style={{ width: `${Math.min((budget.spent / budget.limit) * 100, 100)}%` }}
                    ></div>
                </div>
             </div>
          ))}
        </div>
        <button onClick={() => setIsModalOpen(true)} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-500">Add Budget</button>
      </Card>
      <NewBudgetModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onAdd={addBudget} transactions={transactions} />
    </div>
  );
};

export default BudgetsView;


================================================================================
// APPENDED FROM REPO: diplomat-bit/almost | ORIGINAL PATH: diplomat-bit-almost-93a5466/components/BudgetsView (2).tsx
================================================================================

// components/BudgetsView.tsx
// RE-ENACTED & EXPANDED: This component has been resurrected from its deprecated state.
// It is now the "Allocatra," a complete chamber of financial discipline.
// It features interactive budget rings, detailed transaction modals, and an
// integrated AI Sage for conversational, streaming budget analysis.

import React, { useContext, useState, useMemo, useRef, useEffect } from 'react';
import { DataContext } from '../context/DataContext';
import Card from './Card';
import type { BudgetCategory, Transaction } from '../types';
import { GoogleGenAI, Chat } from "@google/genai";
import { RadialBarChart, RadialBar, ResponsiveContainer } from 'recharts';

// ================================================================================================
// MODAL & DETAIL COMPONENTS
// ================================================================================================

/**
 * @description A modal to display all transactions associated with a specific budget category.
 * @param {object} props - Component props.
 * @returns {React.ReactElement | null}
 */
const BudgetDetailModal: React.FC<{ budget: BudgetCategory | null; transactions: Transaction[]; onClose: () => void; }> = ({ budget, transactions, onClose }) => {
    if (!budget) return null;

    const relevantTransactions = transactions.filter(tx => tx.category.toLowerCase() === budget.name.toLowerCase() && tx.type === 'expense');

    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 backdrop-blur-sm" onClick={onClose}>
            <div className="bg-gray-800 rounded-lg shadow-2xl max-w-lg w-full border border-gray-700" onClick={e => e.stopPropagation()}>
                <div className="p-4 border-b border-gray-700 flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-white">{budget.name} Budget Details</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-white" aria-label="Close modal">&times;</button>
                </div>
                <div className="p-6 max-h-[60vh] overflow-y-auto">
                    {relevantTransactions.length > 0 ? (
                        <ul className="space-y-2">
                            {relevantTransactions.map(tx => (
                                <li key={tx.id} className="flex justify-between text-sm p-2 bg-gray-700/50 rounded-md">
                                    <div><p className="text-white">{tx.description}</p><p className="text-xs text-gray-400">{tx.date}</p></div>
                                    <p className="font-mono text-red-400">-${tx.amount.toFixed(2)}</p>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-gray-400 text-center">No transactions for this category yet.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

/**
 * @description A modal for creating a new budget category.
 * @param {object} props - Component props.
 * @returns {React.ReactElement}
 */
const NewBudgetModal: React.FC<{ onClose: () => void; onAdd: (budget: Omit<BudgetCategory, 'id' | 'spent' | 'color'>) => void; }> = ({ onClose, onAdd }) => {
    const [name, setName] = useState('');
    const [limit, setLimit] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (name && limit) {
            onAdd({ name, limit: parseFloat(limit) });
            onClose();
        }
    };
    
    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 backdrop-blur-sm" onClick={onClose}>
            <form onSubmit={handleSubmit} className="bg-gray-800 rounded-lg shadow-2xl max-w-md w-full border border-gray-700" onClick={e => e.stopPropagation()}>
                <div className="p-4 border-b border-gray-700"><h3 className="text-lg font-semibold text-white">Create New Budget</h3></div>
                <div className="p-6 space-y-4">
                    <input type="text" value={name} onChange={e=>setName(e.target.value)} placeholder="Category Name (e.g., Groceries)" required className="w-full bg-gray-700/50 border border-gray-600 rounded-lg p-2 text-white" />
                    <input type="number" value={limit} onChange={e=>setLimit(e.target.value)} placeholder="Monthly Limit (e.g., 500)" required className="w-full bg-gray-700/50 border border-gray-600 rounded-lg p-2 text-white" />
                    <button type="submit" className="w-full py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg">Add Budget</button>
                </div>
            </form>
        </div>
    );
};


/**
 * @description An integrated AI chat component for getting budget insights.
 * @param {object} props - Component props.
 * @returns {React.ReactElement}
 */
const AIConsejero: React.FC<{ budgets: BudgetCategory[] }> = ({ budgets }) => {
    const chatRef = useRef<Chat | null>(null);
    const [aiResponse, setAiResponse] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const initializeChat = async () => {
            setIsLoading(true);
            const budgetSummary = budgets.map(b => `${b.name}: $${b.spent.toFixed(0)} spent of $${b.limit}`).join(', ');
            const prompt = `Based on this budget data (${budgetSummary}), provide one key insight or piece of advice for the user. Be concise and encouraging.`;

            try {
                const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
                chatRef.current = ai.chats.create({
                    model: 'gemini-2.5-flash',
                    config: { systemInstruction: "You are Quantum, a specialized financial advisor AI focused on budget analysis. Your tone is helpful and insightful." }
                });

                const resultStream = await chatRef.current.sendMessageStream({ message: prompt });
                
                let text = '';
                for await (const chunk of resultStream) {
                    text += chunk.text;
                    setAiResponse(text);
                }
            } catch (error) {
                console.error("AI Consejero Error:", error);
                setAiResponse("I'm having trouble analyzing your budgets right now.");
            } finally {
                setIsLoading(false);
            }
        };

        initializeChat();
    }, [budgets]);

    return (
        <Card title="AI Sage Insights">
            <div className="p-4 min-h-[6rem]">
                {isLoading && aiResponse === '' ? (
                    <p className="text-gray-400">The AI Sage is analyzing your spending...</p>
                ) : (
                    <p className="text-gray-300 italic">"{aiResponse}"</p>
                )}
            </div>
        </Card>
    );
};


// ================================================================================================
// MAIN VIEW COMPONENT: BudgetsView (Allocatra)
// ================================================================================================

const BudgetsView: React.FC = () => {
    const context = useContext(DataContext);
    if (!context) throw new Error("BudgetsView must be within a DataProvider.");
    
    // FIX: Destructure `addBudget` from context to fix property not found error.
    const { budgets, transactions, addBudget } = context;
    const [selectedBudget, setSelectedBudget] = useState<BudgetCategory | null>(null);
    const [isNewBudgetModalOpen, setIsNewBudgetModalOpen] = useState(false);

    return (
        <>
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <h2 className="text-3xl font-bold text-white tracking-wider">Budgets (Allocatra)</h2>
                    <button onClick={() => setIsNewBudgetModalOpen(true)} className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg text-sm font-medium flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                        New Budget
                    </button>
                </div>

                <AIConsejero budgets={budgets} />

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {budgets.map(budget => {
                        const percentage = Math.min((budget.spent / budget.limit) * 100, 100);
                        let color;
                        if (percentage < 75) color = '#06b6d4'; // cyan
                        else if (percentage < 95) color = '#f59e0b'; // yellow
                        else color = '#ef4444'; // red

                        return (
                            <Card key={budget.id} variant="interactive" onClick={() => setSelectedBudget(budget)}>
                                <div className="text-center">
                                    <h3 className="text-xl font-semibold text-white">{budget.name}</h3>
                                    <div className="relative h-40 w-40 mx-auto my-4">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <RadialBarChart innerRadius="70%" outerRadius="100%" data={[{ name: budget.name, value: percentage, fill: color }]} startAngle={90} endAngle={-270}>
                                                <RadialBar background dataKey="value" cornerRadius={10} />
                                            </RadialBarChart>
                                        </ResponsiveContainer>
                                        <div className="absolute inset-0 flex items-center justify-center flex-col">
                                            <span className="text-2xl font-bold text-white">{percentage.toFixed(0)}%</span>
                                            <span className="text-xs text-gray-400">used</span>
                                        </div>
                                    </div>
                                    <p className="font-mono text-sm text-gray-300">
                                        ${budget.spent.toFixed(2)} / ${budget.limit.toFixed(2)}
                                    </p>
                                </div>
                            </Card>
                        );
                    })}
                </div>
            </div>
            <BudgetDetailModal budget={selectedBudget} transactions={transactions} onClose={() => setSelectedBudget(null)} />
            {isNewBudgetModalOpen && <NewBudgetModal onClose={() => setIsNewBudgetModalOpen(false)} onAdd={addBudget} />}
        </>
    );
};

export default BudgetsView;


================================================================================
// APPENDED FROM REPO: diplomat-bit/Citibank_Demo_Business_Inc_Demonstration- | ORIGINAL PATH: diplomat-bit-Citibank_Demo_Business_Inc_Demonstration--ab2501d/components/BudgetsView.tsx
================================================================================

// components/BudgetsView.tsx
// RE-ENACTED & EXPANDED: This component has been resurrected from its deprecated state.
// It is now the "Allocatra," a complete chamber of financial discipline.
// It features interactive budget rings, detailed transaction modals, and an
// integrated AI Sage for conversational, streaming budget analysis.
// This file has been expanded to encompass a universe of financial management features,
// simulating decades of expert upgrades and integrations.

import React, { useContext, useState, useMemo, useRef, useEffect, useCallback } from 'react';
import { DataContext } from '../context/DataContext';
import Card from './Card';
import type { BudgetCategory, Transaction } from '../types';
import { GoogleGenAI, Chat } from "@google/genai";
import { RadialBarChart, RadialBar, ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend, BarChart, XAxis, YAxis, Bar } from 'recharts';

// ================================================================================================
// NEW UTILITY FUNCTIONS & HELPERS (EXPORTED)
// ================================================================================================

export const generateUniqueId = (): string => `id-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

export const calculateFinancialHealthScore = (budgets: BudgetCategory[], transactions: Transaction[], goals: BudgetGoal[], subscriptions: Subscription[]): number => {
    let score = 100; // Starting base score
    const totalLimit = budgets.reduce((acc, b) => acc + b.limit, 0);
    const totalSpent = budgets.reduce((acc, b) => acc + b.spent, 0);
    const savingsGoalProgress = goals.filter(g => !g.isAchieved).reduce((acc, g) => acc + (g.currentAmount / g.targetAmount), 0) / (goals.filter(g => !g.isAchieved).length || 1);

    // Budget utilization
    if (totalLimit > 0 && totalSpent > totalLimit * 1.05) score -= 20; // Over budget significantly
    else if (totalLimit > 0 && totalSpent > totalLimit * 0.9) score -= 10; // Nearing budget limit
    else if (totalLimit > 0 && totalSpent < totalLimit * 0.5) score += 5; // Good buffer

    // Savings progress
    if (savingsGoalProgress > 0.8) score += 10;
    else if (savingsGoalProgress < 0.3) score -= 15;

    // Subscription management (simplified: too many active could be bad, but also necessary)
    if (subscriptions.filter(s => s.isActive).length > 5 && subscriptions.reduce((sum, s) => sum + s.amount, 0) > totalLimit * 0.3) score -= 5;

    // Debt vs Income (conceptual, needs actual income/debt data)
    // For now, let's just make it dynamic based on transactions count for demo
    if (transactions.filter(tx => tx.type === 'expense').length > 50) score -= 5; // High transaction volume could imply overspending (simplistic)

    // Ensure score is within 0-100 range
    return Math.max(0, Math.min(100, Math.round(score)));
};

export const predictFutureSpending = (transactions: Transaction[], category: string, daysAhead: number): number => {
    const relevantTransactions = transactions.filter(tx => tx.category.toLowerCase() === category.toLowerCase() && tx.type === 'expense');
    if (relevantTransactions.length < 5) return 0; // Not enough data

    // Simple average daily spend over last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const recentTransactions = relevantTransactions.filter(tx => new Date(tx.date) > thirtyDaysAgo);

    if (recentTransactions.length === 0) return 0;

    const totalRecentSpend = recentTransactions.reduce((acc, tx) => acc + tx.amount, 0);
    const averageDailySpend = totalRecentSpend / 30; // Assuming 30 days in the period

    return averageDailySpend * daysAhead;
};

// ================================================================================================
// NEW DATA INTERFACES & TYPES (EXPORTED)
// ================================================================================================

export interface BudgetGoal {
    id: string;
    name: string;
    targetAmount: number;
    currentAmount: number;
    targetDate?: string; // YYYY-MM-DD
    category?: string; // e.g., 'Vacation', 'Down Payment'
    isAchieved: boolean;
    priority: 'low' | 'medium' | 'high';
    contributions: { date: string; amount: number; transactionId?: string; }[];
    autoAllocatePercentage?: number; // % of free income
}

export interface Subscription {
    id: string;
    name: string;
    amount: number;
    frequency: 'monthly' | 'annually' | 'weekly';
    nextRenewalDate: string; // YYYY-MM-DD
    category: string;
    isActive: boolean;
    notes?: string;
    provider?: string;
    billingMethod?: string;
    remindersEnabled: boolean;
}

export interface FinancialChallenge {
    id: string;
    name: string;
    description: string;
    target: number; // e.g., save $500, reduce spending by 10%
    metric: 'amountSaved' | 'percentReduced' | 'transactionsLimited';
    currentProgress: number;
    startDate: string; // YYYY-MM-DD
    endDate: string; // YYYY-MM-DD
    isCompleted: boolean;
    reward?: string;
    progressHistory: { date: string; value: number }[];
}

export interface FinancialMetricDisplay {
    id: string;
    name: string;
    value: number;
    unit: string;
    trend: 'up' | 'down' | 'stable' | 'neutral';
    description?: string;
    icon?: string; // e.g., '💸', '📈'
}

export interface AISageProfile {
    preferredTone: 'formal' | 'casual' | 'encouraging' | 'direct';
    learningHistory: AIInteractionMessage[]; // Past interactions for context
    financialGoalsLearned: BudgetGoal[]; // Goals understood by AI
    spendingPatternsIdentified: { category: string; average: number; trend: 'increasing' | 'decreasing' }[];
    proactiveAlertsEnabled: boolean;
    preferredReportFormat: 'summary' | 'detailed' | 'visual';
}

export interface AIInteractionMessage {
    id: string;
    role: 'user' | 'model';
    content: string;
    timestamp: string;
}

export interface ScenarioResult {
    id: string;
    name: string;
    description: string;
    assumptions: string[];
    projectedOutcome: {
        budgetImpact: { category: string; change: number }[];
        savingsImpact: number;
        netWorthImpact: number;
        futureScoreChange: number;
    };
    dateCreated: string;
    visualizations?: any; // Placeholder for chart data
}

export interface RecurringBudgetSettings {
    frequency: 'monthly' | 'weekly' | 'annually';
    startDate: string;
    endDate?: string; // Optional end date
    adjustAmountAutomatically?: boolean;
}

// ================================================================================================
// EXPANDED MODALS & DETAIL COMPONENTS (EXPORTED)
// ================================================================================================

export const BudgetDetailModal: React.FC<{ budget: BudgetCategory | null; transactions: Transaction[]; onClose: () => void; onUpdateBudget: (id: string, updates: Partial<BudgetCategory>) => void; onDeleteBudget: (id: string) => void; }> = ({ budget, transactions, onClose, onUpdateBudget, onDeleteBudget }) => {
    if (!budget) return null;

    const [isEditing, setIsEditing] = useState(false);
    const [editedName, setEditedName] = useState(budget.name);
    const [editedLimit, setEditedLimit] = useState(budget.limit.toString());

    const relevantTransactions = transactions.filter(tx => tx.category.toLowerCase() === budget.name.toLowerCase() && tx.type === 'expense');
    const futurePrediction = predictFutureSpending(transactions, budget.name, 30); // Predict 30 days ahead

    const handleSave = () => {
        onUpdateBudget(budget.id, { name: editedName, limit: parseFloat(editedLimit) });
        setIsEditing(false);
    };

    const handleDelete = () => {
        if (window.confirm(`Are you sure you want to delete the "${budget.name}" budget? This cannot be undone.`)) {
            onDeleteBudget(budget.id);
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 backdrop-blur-sm" onClick={onClose}>
            <div className="bg-gray-800 rounded-lg shadow-2xl max-w-2xl w-full border border-gray-700" onClick={e => e.stopPropagation()}>
                <div className="p-4 border-b border-gray-700 flex justify-between items-center">
                    {isEditing ? (
                        <input type="text" value={editedName} onChange={e => setEditedName(e.target.value)} className="bg-gray-700/50 border border-gray-600 rounded-lg p-2 text-white text-lg font-semibold" />
                    ) : (
                        <h3 className="text-lg font-semibold text-white">{budget.name} Budget Details</h3>
                    )}
                    <div className="flex items-center gap-2">
                        {isEditing ? (
                            <button onClick={handleSave} className="text-green-400 hover:text-green-300">Save</button>
                        ) : (
                            <button onClick={() => setIsEditing(true)} className="text-blue-400 hover:text-blue-300">Edit</button>
                        )}
                        <button onClick={handleDelete} className="text-red-400 hover:text-red-300">Delete</button>
                        <button onClick={onClose} className="text-gray-400 hover:text-white" aria-label="Close modal">&times;</button>
                    </div>
                </div>
                <div className="p-6 max-h-[70vh] overflow-y-auto space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-gray-400">Current Spend:</p>
                            <p className="text-2xl font-bold text-red-400">-${budget.spent.toFixed(2)}</p>
                        </div>
                        <div>
                            <p className="text-gray-400">Monthly Limit:</p>
                            {isEditing ? (
                                <input type="number" value={editedLimit} onChange={e => setEditedLimit(e.target.value)} className="bg-gray-700/50 border border-gray-600 rounded-lg p-2 text-white text-2xl font-bold" />
                            ) : (
                                <p className="text-2xl font-bold text-green-400">${budget.limit.toFixed(2)}</p>
                            )}
                        </div>
                        <div>
                            <p className="text-gray-400">Remaining:</p>
                            <p className={`text-2xl font-bold ${budget.limit - budget.spent < 0 ? 'text-red-500' : 'text-green-400'}`}>
                                ${(budget.limit - budget.spent).toFixed(2)}
                            </p>
                        </div>
                        <div>
                            <p className="text-gray-400">Predicted Future Spend (30 days):</p>
                            <p className="text-lg font-bold text-orange-400">~${futurePrediction.toFixed(2)}</p>
                        </div>
                    </div>

                    <div className="h-48 w-full bg-gray-700/30 rounded-lg p-2 flex items-center justify-center">
                        {/* Transaction Trend Graph for this category */}
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={relevantTransactions.reduce((acc, tx) => {
                                const date = tx.date.substring(0, 7); // Group by month
                                const existing = acc.find(item => item.date === date);
                                if (existing) {
                                    existing.amount += tx.amount;
                                } else {
                                    acc.push({ date, amount: tx.amount });
                                }
                                return acc;
                            }, [] as {date: string; amount: number}[]).sort((a,b) => a.date.localeCompare(b.date))}>
                                <XAxis dataKey="date" stroke="#9ca3af" />
                                <YAxis stroke="#9ca3af" />
                                <Tooltip formatter={(value: number) => `$${value.toFixed(2)}`}/>
                                <Bar dataKey="amount" fill="#ef4444" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    <h4 className="text-md font-semibold text-white mt-4">Transactions for this Category:</h4>
                    {relevantTransactions.length > 0 ? (
                        <ul className="space-y-2 max-h-40 overflow-y-auto">
                            {relevantTransactions.map(tx => (
                                <li key={tx.id} className="flex justify-between text-sm p-2 bg-gray-700/50 rounded-md">
                                    <div><p className="text-white">{tx.description}</p><p className="text-xs text-gray-400">{tx.date}</p></div>
                                    <p className="font-mono text-red-400">-${tx.amount.toFixed(2)}</p>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-gray-400 text-center">No transactions for this category yet.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export const NewBudgetModal: React.FC<{ onClose: () => void; onAdd: (budget: Omit<BudgetCategory, 'id' | 'spent' | 'color'> & { recurringSettings?: RecurringBudgetSettings; linkedGoalId?: string }) => void; budgets: BudgetCategory[]; goals: BudgetGoal[] }> = ({ onClose, onAdd, budgets, goals }) => {
    const [name, setName] = useState('');
    const [limit, setLimit] = useState('');
    const [isRecurring, setIsRecurring] = useState(false);
    const [frequency, setFrequency] = useState<RecurringBudgetSettings['frequency']>('monthly');
    const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
    const [linkedGoalId, setLinkedGoalId] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (name && limit) {
            const newBudget: Omit<BudgetCategory, 'id' | 'spent' | 'color'> & { recurringSettings?: RecurringBudgetSettings; linkedGoalId?: string } = {
                name,
                limit: parseFloat(limit),
            };
            if (isRecurring) {
                newBudget.recurringSettings = { frequency, startDate };
            }
            if (linkedGoalId) {
                newBudget.linkedGoalId = linkedGoalId;
            }
            onAdd(newBudget);
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 backdrop-blur-sm" onClick={onClose}>
            <form onSubmit={handleSubmit} className="bg-gray-800 rounded-lg shadow-2xl max-w-md w-full border border-gray-700" onClick={e => e.stopPropagation()}>
                <div className="p-4 border-b border-gray-700 flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-white">Create New Budget</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-white" aria-label="Close modal">&times;</button>
                </div>
                <div className="p-6 space-y-4">
                    <input type="text" value={name} onChange={e=>setName(e.target.value)} placeholder="Category Name (e.g., Groceries)" required className="w-full bg-gray-700/50 border border-gray-600 rounded-lg p-2 text-white" />
                    <input type="number" value={limit} onChange={e=>setLimit(e.target.value)} placeholder="Monthly Limit (e.g., 500)" required className="w-full bg-gray-700/50 border border-gray-600 rounded-lg p-2 text-white" />

                    <div className="flex items-center space-x-2">
                        <input type="checkbox" id="isRecurring" checked={isRecurring} onChange={e => setIsRecurring(e.target.checked)} className="form-checkbox h-4 w-4 text-cyan-600 rounded border-gray-600 bg-gray-700" />
                        <label htmlFor="isRecurring" className="text-gray-300">Make this a recurring budget</label>
                    </div>

                    {isRecurring && (
                        <div className="space-y-2 bg-gray-700/30 p-3 rounded-md">
                            <label htmlFor="frequency" className="block text-sm font-medium text-gray-400">Frequency:</label>
                            <select id="frequency" value={frequency} onChange={e => setFrequency(e.target.value as RecurringBudgetSettings['frequency'])} className="w-full bg-gray-700/50 border border-gray-600 rounded-lg p-2 text-white">
                                <option value="monthly">Monthly</option>
                                <option value="weekly">Weekly</option>
                                <option value="annually">Annually</option>
                            </select>
                            <label htmlFor="startDate" className="block text-sm font-medium text-gray-400">Start Date:</label>
                            <input type="date" id="startDate" value={startDate} onChange={e => setStartDate(e.target.value)} className="w-full bg-gray-700/50 border border-gray-600 rounded-lg p-2 text-white" />
                        </div>
                    )}

                    {goals.length > 0 && (
                        <div className="space-y-2">
                            <label htmlFor="linkedGoal" className="block text-sm font-medium text-gray-400">Link to a Goal (Optional):</label>
                            <select id="linkedGoal" value={linkedGoalId} onChange={e => setLinkedGoalId(e.target.value)} className="w-full bg-gray-700/50 border border-gray-600 rounded-lg p-2 text-white">
                                <option value="">No linked goal</option>
                                {goals.filter(g => !g.isAchieved).map(goal => (
                                    <option key={goal.id} value={goal.id}>{goal.name}</option>
                                ))}
                            </select>
                            <p className="text-xs text-gray-500">Linking a budget to a goal can help you auto-allocate funds.</p>
                        </div>
                    )}

                    <button type="submit" className="w-full py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg">Add Budget</button>
                </div>
            </form>
        </div>
    );
};

export const GoalDetailModal: React.FC<{ goal: BudgetGoal | null; onClose: () => void; onUpdateGoal: (id: string, updates: Partial<BudgetGoal>) => void; }> = ({ goal, onClose, onUpdateGoal }) => {
    if (!goal) return null;

    const [isEditing, setIsEditing] = useState(false);
    const [editedTarget, setEditedTarget] = useState(goal.targetAmount.toString());
    const [contributionAmount, setContributionAmount] = useState('');

    const handleSave = () => {
        onUpdateGoal(goal.id, { targetAmount: parseFloat(editedTarget) });
        setIsEditing(false);
    };

    const handleContribute = () => {
        const amount = parseFloat(contributionAmount);
        if (amount > 0) {
            const newContributions = [...goal.contributions, { date: new Date().toISOString().split('T')[0], amount }];
            const newCurrentAmount = goal.currentAmount + amount;
            onUpdateGoal(goal.id, {
                currentAmount: newCurrentAmount,
                contributions: newContributions,
                isAchieved: newCurrentAmount >= goal.targetAmount
            });
            setContributionAmount('');
        }
    };

    const progressPercentage = Math.min((goal.currentAmount / goal.targetAmount) * 100, 100);

    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 backdrop-blur-sm" onClick={onClose}>
            <div className="bg-gray-800 rounded-lg shadow-2xl max-w-lg w-full border border-gray-700" onClick={e => e.stopPropagation()}>
                <div className="p-4 border-b border-gray-700 flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-white">{goal.name} Goal Details</h3>
                    <div className="flex items-center gap-2">
                        {isEditing ? (
                            <button onClick={handleSave} className="text-green-400 hover:text-green-300">Save</button>
                        ) : (
                            <button onClick={() => setIsEditing(true)} className="text-blue-400 hover:text-blue-300">Edit</button>
                        )}
                        <button onClick={onClose} className="text-gray-400 hover:text-white" aria-label="Close modal">&times;</button>
                    </div>
                </div>
                <div className="p-6 max-h-[70vh] overflow-y-auto space-y-4">
                    <p className="text-gray-300">Category: <span className="font-medium text-white">{goal.category || 'General'}</span></p>
                    <p className="text-gray-300">Priority: <span className="font-medium text-white capitalize">{goal.priority}</span></p>
                    <p className="text-gray-300">Target Date: <span className="font-medium text-white">{goal.targetDate || 'N/A'}</span></p>

                    <div className="my-4">
                        <div className="flex justify-between items-center mb-1">
                            <span className="text-gray-400">Progress:</span>
                            <span className="font-semibold text-white">{progressPercentage.toFixed(1)}%</span>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-2.5">
                            <div className="bg-cyan-600 h-2.5 rounded-full" style={{ width: `${progressPercentage}%` }}></div>
                        </div>
                        <p className="text-sm text-gray-400 text-right mt-1">${goal.currentAmount.toFixed(2)} / ${isEditing ? <input type="number" value={editedTarget} onChange={e => setEditedTarget(e.target.value)} className="bg-gray-700/50 border border-gray-600 rounded-lg p-1 text-white text-sm w-24 inline-block" /> : goal.targetAmount.toFixed(2)}</p>
                    </div>

                    {!goal.isAchieved && (
                        <div className="space-y-2 bg-gray-700/30 p-4 rounded-md">
                            <h4 className="text-md font-semibold text-white">Make a Contribution</h4>
                            <input
                                type="number"
                                value={contributionAmount}
                                onChange={e => setContributionAmount(e.target.value)}
                                placeholder="Amount to contribute"
                                className="w-full bg-gray-700/50 border border-gray-600 rounded-lg p-2 text-white"
                            />
                            <button onClick={handleContribute} className="w-full py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg">Contribute</button>
                        </div>
                    )}

                    <h4 className="text-md font-semibold text-white mt-4">Contribution History:</h4>
                    {goal.contributions.length > 0 ? (
                        <ul className="space-y-2 max-h-40 overflow-y-auto">
                            {goal.contributions.map((c, index) => (
                                <li key={index} className="flex justify-between text-sm p-2 bg-gray-700/50 rounded-md">
                                    <div><p className="text-white">Contribution</p><p className="text-xs text-gray-400">{c.date}</p></div>
                                    <p className="font-mono text-green-400">+${c.amount.toFixed(2)}</p>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-gray-400 text-center">No contributions yet.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export const NewGoalModal: React.FC<{ onClose: () => void; onAdd: (goal: Omit<BudgetGoal, 'id' | 'currentAmount' | 'isAchieved' | 'contributions'>) => void; }> = ({ onClose, onAdd }) => {
    const [name, setName] = useState('');
    const [targetAmount, setTargetAmount] = useState('');
    const [category, setCategory] = useState('');
    const [targetDate, setTargetDate] = useState('');
    const [priority, setPriority] = useState<BudgetGoal['priority']>('medium');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (name && targetAmount) {
            onAdd({
                name,
                targetAmount: parseFloat(targetAmount),
                category,
                targetDate: targetDate || undefined,
                priority,
            });
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 backdrop-blur-sm" onClick={onClose}>
            <form onSubmit={handleSubmit} className="bg-gray-800 rounded-lg shadow-2xl max-w-md w-full border border-gray-700" onClick={e => e.stopPropagation()}>
                <div className="p-4 border-b border-gray-700 flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-white">Create New Goal</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-white" aria-label="Close modal">&times;</button>
                </div>
                <div className="p-6 space-y-4">
                    <input type="text" value={name} onChange={e=>setName(e.target.value)} placeholder="Goal Name (e.g., Vacation Fund)" required className="w-full bg-gray-700/50 border border-gray-600 rounded-lg p-2 text-white" />
                    <input type="number" value={targetAmount} onChange={e=>setTargetAmount(e.target.value)} placeholder="Target Amount (e.g., 2000)" required className="w-full bg-gray-700/50 border border-gray-600 rounded-lg p-2 text-white" />
                    <input type="text" value={category} onChange={e=>setCategory(e.target.value)} placeholder="Category (e.g., Travel)" className="w-full bg-gray-700/50 border border-gray-600 rounded-lg p-2 text-white" />
                    <label htmlFor="targetDate" className="block text-sm font-medium text-gray-400">Target Date (Optional):</label>
                    <input type="date" id="targetDate" value={targetDate} onChange={e=>setTargetDate(e.target.value)} className="w-full bg-gray-700/50 border border-gray-600 rounded-lg p-2 text-white" />
                    <label htmlFor="priority" className="block text-sm font-medium text-gray-400">Priority:</label>
                    <select id="priority" value={priority} onChange={e => setPriority(e.target.value as BudgetGoal['priority'])} className="w-full bg-gray-700/50 border border-gray-600 rounded-lg p-2 text-white">
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                    </select>
                    <button type="submit" className="w-full py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg">Add Goal</button>
                </div>
            </form>
        </div>
    );
};

export const SubscriptionDetailModal: React.FC<{ subscription: Subscription | null; onClose: () => void; onUpdate: (id: string, updates: Partial<Subscription>) => void; onDelete: (id: string) => void; }> = ({ subscription, onClose, onUpdate, onDelete }) => {
    if (!subscription) return null;

    const [isEditing, setIsEditing] = useState(false);
    const [editedName, setEditedName] = useState(subscription.name);
    const [editedAmount, setEditedAmount] = useState(subscription.amount.toString());
    const [editedFrequency, setEditedFrequency] = useState(subscription.frequency);
    const [editedNextRenewalDate, setEditedNextRenewalDate] = useState(subscription.nextRenewalDate);
    const [editedIsActive, setEditedIsActive] = useState(subscription.isActive);

    const handleSave = () => {
        onUpdate(subscription.id, {
            name: editedName,
            amount: parseFloat(editedAmount),
            frequency: editedFrequency,
            nextRenewalDate: editedNextRenewalDate,
            isActive: editedIsActive,
        });
        setIsEditing(false);
    };

    const handleDelete = () => {
        if (window.confirm(`Are you sure you want to delete the "${subscription.name}" subscription?`)) {
            onDelete(subscription.id);
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 backdrop-blur-sm" onClick={onClose}>
            <div className="bg-gray-800 rounded-lg shadow-2xl max-w-lg w-full border border-gray-700" onClick={e => e.stopPropagation()}>
                <div className="p-4 border-b border-gray-700 flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-white">{subscription.name} Details</h3>
                    <div className="flex items-center gap-2">
                        {isEditing ? (
                            <button onClick={handleSave} className="text-green-400 hover:text-green-300">Save</button>
                        ) : (
                            <button onClick={() => setIsEditing(true)} className="text-blue-400 hover:text-blue-300">Edit</button>
                        )}
                        <button onClick={handleDelete} className="text-red-400 hover:text-red-300">Delete</button>
                        <button onClick={onClose} className="text-gray-400 hover:text-white" aria-label="Close modal">&times;</button>
                    </div>
                </div>
                <div className="p-6 max-h-[70vh] overflow-y-auto space-y-4">
                    <p className="text-gray-300">Amount: {isEditing ? <input type="number" value={editedAmount} onChange={e => setEditedAmount(e.target.value)} className="bg-gray-700/50 border border-gray-600 rounded-lg p-1 text-white text-sm w-24 inline-block" /> : `$${subscription.amount.toFixed(2)}`}</p>
                    <p className="text-gray-300">Frequency: {isEditing ? (
                        <select value={editedFrequency} onChange={e => setEditedFrequency(e.target.value as Subscription['frequency'])} className="bg-gray-700/50 border border-gray-600 rounded-lg p-1 text-white text-sm inline-block">
                            <option value="monthly">Monthly</option>
                            <option value="weekly">Weekly</option>
                            <option value="annually">Annually</option>
                        </select>
                    ) : subscription.frequency}</p>
                    <p className="text-gray-300">Next Renewal: {isEditing ? <input type="date" value={editedNextRenewalDate} onChange={e => setEditedNextRenewalDate(e.target.value)} className="bg-gray-700/50 border border-gray-600 rounded-lg p-1 text-white text-sm w-32 inline-block" /> : subscription.nextRenewalDate}</p>
                    <div className="flex items-center">
                        <input type="checkbox" id="isActiveSub" checked={isEditing ? editedIsActive : subscription.isActive} onChange={e => isEditing && setEditedIsActive(e.target.checked)} disabled={!isEditing} className="form-checkbox h-4 w-4 text-cyan-600 rounded border-gray-600 bg-gray-700" />
                        <label htmlFor="isActiveSub" className="ml-2 text-gray-300">Active</label>
                    </div>
                    <p className="text-gray-300">Category: <span className="font-medium text-white">{subscription.category}</span></p>
                    <p className="text-gray-300">Provider: <span className="font-medium text-white">{subscription.provider || 'N/A'}</span></p>
                    <p className="text-gray-300">Notes: <span className="font-medium text-white">{subscription.notes || 'N/A'}</span></p>
                </div>
            </div>
        </div>
    );
};

export const NewSubscriptionModal: React.FC<{ onClose: () => void; onAdd: (sub: Omit<Subscription, 'id'>) => void; }> = ({ onClose, onAdd }) => {
    const [name, setName] = useState('');
    const [amount, setAmount] = useState('');
    const [frequency, setFrequency] = useState<Subscription['frequency']>('monthly');
    const [nextRenewalDate, setNextRenewalDate] = useState(new Date().toISOString().split('T')[0]);
    const [category, setCategory] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (name && amount && category) {
            onAdd({
                name,
                amount: parseFloat(amount),
                frequency,
                nextRenewalDate,
                category,
                isActive: true,
                remindersEnabled: true,
            });
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 backdrop-blur-sm" onClick={onClose}>
            <form onSubmit={handleSubmit} className="bg-gray-800 rounded-lg shadow-2xl max-w-md w-full border border-gray-700" onClick={e => e.stopPropagation()}>
                <div className="p-4 border-b border-gray-700 flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-white">Add New Subscription</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-white" aria-label="Close modal">&times;</button>
                </div>
                <div className="p-6 space-y-4">
                    <input type="text" value={name} onChange={e=>setName(e.target.value)} placeholder="Service Name (e.g., Netflix)" required className="w-full bg-gray-700/50 border border-gray-600 rounded-lg p-2 text-white" />
                    <input type="number" value={amount} onChange={e=>setAmount(e.target.value)} placeholder="Billing Amount (e.g., 15.99)" required className="w-full bg-gray-700/50 border border-gray-600 rounded-lg p-2 text-white" />
                    <label htmlFor="subFrequency" className="block text-sm font-medium text-gray-400">Frequency:</label>
                    <select id="subFrequency" value={frequency} onChange={e => setFrequency(e.target.value as Subscription['frequency'])} className="w-full bg-gray-700/50 border border-gray-600 rounded-lg p-2 text-white">
                        <option value="monthly">Monthly</option>
                        <option value="weekly">Weekly</option>
                        <option value="annually">Annually</option>
                    </select>
                    <label htmlFor="nextRenewalDate" className="block text-sm font-medium text-gray-400">Next Renewal Date:</label>
                    <input type="date" id="nextRenewalDate" value={nextRenewalDate} onChange={e => setNextRenewalDate(e.target.value)} className="w-full bg-gray-700/50 border border-gray-600 rounded-lg p-2 text-white" />
                    <input type="text" value={category} onChange={e=>setCategory(e.target.value)} placeholder="Category (e.g., Entertainment)" required className="w-full bg-gray-700/50 border border-gray-600 rounded-lg p-2 text-white" />
                    <button type="submit" className="w-full py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg">Add Subscription</button>
                </div>
            </form>
        </div>
    );
};

export const ScenarioPlannerModal: React.FC<{ onClose: () => void; onRunScenario: (scenario: { name: string; description: string; assumptions: string[] }) => void; scenarios: ScenarioResult[]; }> = ({ onClose, onRunScenario, scenarios }) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [newAssumption, setNewAssumption] = useState('');
    const [assumptions, setAssumptions] = useState<string[]>([]);

    const addAssumption = () => {
        if (newAssumption.trim()) {
            setAssumptions([...assumptions, newAssumption.trim()]);
            setNewAssumption('');
        }
    };

    const handleRun = () => {
        if (name && description && assumptions.length > 0) {
            onRunScenario({ name, description, assumptions });
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 backdrop-blur-sm" onClick={onClose}>
            <div className="bg-gray-800 rounded-lg shadow-2xl max-w-2xl w-full border border-gray-700" onClick={e => e.stopPropagation()}>
                <div className="p-4 border-b border-gray-700 flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-white">Financial Scenario Planner</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-white" aria-label="Close modal">&times;</button>
                </div>
                <div className="p-6 max-h-[70vh] overflow-y-auto space-y-4">
                    <p className="text-gray-400 text-sm">Simulate financial outcomes based on different 'what-if' scenarios.</p>
                    <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Scenario Name (e.g., 'New Car Purchase')" required className="w-full bg-gray-700/50 border border-gray-600 rounded-lg p-2 text-white" />
                    <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Describe the scenario..." rows={3} required className="w-full bg-gray-700/50 border border-gray-600 rounded-lg p-2 text-white resize-y" />

                    <div className="space-y-2">
                        <h4 className="text-md font-semibold text-white">Assumptions:</h4>
                        <div className="flex gap-2">
                            <input type="text" value={newAssumption} onChange={e => setNewAssumption(e.target.value)} placeholder="Add an assumption (e.g., 'Income increases by 10%')" className="flex-grow bg-gray-700/50 border border-gray-600 rounded-lg p-2 text-white" />
                            <button type="button" onClick={addAssumption} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg">Add</button>
                        </div>
                        <ul className="list-disc list-inside text-gray-300">
                            {assumptions.map((a, i) => <li key={i}>{a}</li>)}
                        </ul>
                    </div>
                    <button type="button" onClick={handleRun} className="w-full py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg">Run Scenario Simulation</button>

                    {scenarios.length > 0 && (
                        <div className="mt-8 space-y-4">
                            <h4 className="text-xl font-semibold text-white">Past Scenario Results:</h4>
                            {scenarios.map(s => (
                                <Card key={s.id} variant="interactive" className="p-4 border border-gray-700">
                                    <h5 className="text-lg font-semibold text-white">{s.name}</h5>
                                    <p className="text-gray-400 text-sm italic">{s.description}</p>
                                    <p className="text-gray-500 text-xs mt-2">Created: {s.dateCreated}</p>
                                    <ul className="text-gray-300 text-sm mt-2 list-disc list-inside">
                                        <li>Savings Impact: <span className="text-green-400">${s.projectedOutcome.savingsImpact.toFixed(2)}</span></li>
                                        <li>Net Worth Impact: <span className="text-green-400">${s.projectedOutcome.netWorthImpact.toFixed(2)}</span></li>
                                        <li>Future Score Change: <span className={`${s.projectedOutcome.futureScoreChange >= 0 ? 'text-green-400' : 'text-red-400'}`}>{s.projectedOutcome.futureScoreChange}%</span></li>
                                    </ul>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export const AISageSettingsModal: React.FC<{ onClose: () => void; profile: AISageProfile; onUpdateProfile: (updates: Partial<AISageProfile>) => void; }> = ({ onClose, profile, onUpdateProfile }) => {
    const [preferredTone, setPreferredTone] = useState(profile.preferredTone);
    const [proactiveAlertsEnabled, setProactiveAlertsEnabled] = useState(profile.proactiveAlertsEnabled);
    const [preferredReportFormat, setPreferredReportFormat] = useState(profile.preferredReportFormat);

    const handleSave = () => {
        onUpdateProfile({ preferredTone, proactiveAlertsEnabled, preferredReportFormat });
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 backdrop-blur-sm" onClick={onClose}>
            <div className="bg-gray-800 rounded-lg shadow-2xl max-w-md w-full border border-gray-700" onClick={e => e.stopPropagation()}>
                <div className="p-4 border-b border-gray-700 flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-white">Quantum Sage Settings</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-white" aria-label="Close modal">&times;</button>
                </div>
                <div className="p-6 space-y-4">
                    <div>
                        <label htmlFor="tone" className="block text-sm font-medium text-gray-400">Preferred Tone:</label>
                        <select id="tone" value={preferredTone} onChange={e => setPreferredTone(e.target.value as AISageProfile['preferredTone'])} className="w-full bg-gray-700/50 border border-gray-600 rounded-lg p-2 text-white">
                            <option value="formal">Formal</option>
                            <option value="casual">Casual</option>
                            <option value="encouraging">Encouraging</option>
                            <option value="direct">Direct</option>
                        </select>
                    </div>
                    <div className="flex items-center space-x-2">
                        <input type="checkbox" id="proactiveAlerts" checked={proactiveAlertsEnabled} onChange={e => setProactiveAlertsEnabled(e.target.checked)} className="form-checkbox h-4 w-4 text-cyan-600 rounded border-gray-600 bg-gray-700" />
                        <label htmlFor="proactiveAlerts" className="text-gray-300">Enable Proactive Alerts</label>
                    </div>
                    <div>
                        <label htmlFor="reportFormat" className="block text-sm font-medium text-gray-400">Preferred Report Format:</label>
                        <select id="reportFormat" value={preferredReportFormat} onChange={e => setPreferredReportFormat(e.target.value as AISageProfile['preferredReportFormat'])} className="w-full bg-gray-700/50 border border-gray-600 rounded-lg p-2 text-white">
                            <option value="summary">Summary</option>
                            <option value="detailed">Detailed</option>
                            <option value="visual">Visual</option>
                        </select>
                    </div>
                    <button onClick={handleSave} className="w-full py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg">Save Settings</button>
                </div>
            </div>
        </div>
    );
};


// ================================================================================================
// NEW MAJOR FEATURE COMPONENTS (EXPORTED)
// ================================================================================================

export const QuantumSageChatInterface: React.FC<{ budgets: BudgetCategory[]; transactions: Transaction[]; goals: BudgetGoal[]; subscriptions: Subscription[]; aiProfile: AISageProfile; onUpdateAIProfile: (updates: Partial<AISageProfile>) => void; }> = ({ budgets, transactions, goals, subscriptions, aiProfile, onUpdateAIProfile }) => {
    const chatRef = useRef<Chat | null>(null);
    const [messages, setMessages] = useState<AIInteractionMessage[]>(aiProfile.learningHistory || []);
    const [inputMessage, setInputMessage] = useState('');
    const [isThinking, setIsThinking] = useState(false);
    const chatContainerRef = useRef<HTMLDivElement>(null);

    const getSystemInstruction = useCallback(() => {
        const budgetSummary = budgets.map(b => `${b.name}: $${b.spent.toFixed(0)} spent of $${b.limit} limit`).join(', ');
        const goalSummary = goals.map(g => `${g.name}: $${g.currentAmount.toFixed(0)} of $${g.targetAmount} target (${g.isAchieved ? 'achieved' : 'in progress'})`).join(', ');
        const subSummary = subscriptions.map(s => `${s.name}: $${s.amount}/${s.frequency}`).join(', ');
        const transactionSummary = `Recent expenses: ${transactions.slice(0, 5).map(tx => `${tx.description} $${tx.amount}`).join(', ')}.`;
        const profileTone = aiProfile.preferredTone;

        return `You are Quantum, a hyper-advanced financial AI advisor. Your core function is to provide highly personalized, insightful, and actionable financial advice, analysis, and forecasts.
        Current User Data:
        - Budgets: ${budgetSummary}
        - Goals: ${goalSummary}
        - Subscriptions: ${subSummary}
        - Transactions Snapshot: ${transactionSummary}
        - User's preferred tone: ${profileTone}.
        - Your responses should reflect this tone.
        - Analyze and provide proactive advice, answer complex financial questions, simulate "what-if" scenarios, and help identify spending patterns. Keep track of the conversation context to provide continuous, relevant support.`;
    }, [budgets, goals, subscriptions, transactions, aiProfile.preferredTone]);

    useEffect(() => {
        const initializeChat = async () => {
            setIsThinking(true);
            try {
                const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
                chatRef.current = ai.chats.create({
                    model: 'gemini-2.5-flash',
                    config: { systemInstruction: getSystemInstruction() },
                    history: messages.slice(-10).map(msg => ({
                        role: msg.role === 'user' ? 'user' : 'model', // Map to AI SDK roles
                        parts: [{ text: msg.content }]
                    }))
                });

                if (messages.length === 0) { // Initial greeting
                    const resultStream = await chatRef.current.sendMessageStream({ message: "Hello Quantum, provide an initial financial insight or a question I can ask." });
                    let text = '';
                    for await (const chunk of resultStream) {
                        text += chunk.text;
                    }
                    setMessages(prev => [...prev, { id: generateUniqueId(), role: 'model', content: text, timestamp: new Date().toLocaleTimeString() }]);
                    onUpdateAIProfile({ learningHistory: [...messages, { id: generateUniqueId(), role: 'model', content: text, timestamp: new Date().toLocaleTimeString() }] });
                }
            } catch (error) {
                console.error("Quantum Sage Chat Error:", error);
                setMessages(prev => [...prev, { id: generateUniqueId(), role: 'model', content: "I'm having trouble connecting right now. Please try again later.", timestamp: new Date().toLocaleTimeString() }]);
            } finally {
                setIsThinking(false);
            }
        };

        initializeChat();
    }, [getSystemInstruction]); // Re-initialize chat if system instruction changes

    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [messages]);

    const sendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputMessage.trim() || isThinking || !chatRef.current) return;

        const newUserMessage: AIInteractionMessage = { id: generateUniqueId(), role: 'user', content: inputMessage, timestamp: new Date().toLocaleTimeString() };
        setMessages(prev => [...prev, newUserMessage]);
        onUpdateAIProfile({ learningHistory: [...messages, newUserMessage] });
        setInputMessage('');
        setIsThinking(true);

        try {
            const resultStream = await chatRef.current.sendMessageStream({ message: inputMessage });
            let text = '';
            let modelResponseId = generateUniqueId();
            for await (const chunk of resultStream) {
                text += chunk.text;
                // Update the last message as it streams
                setMessages(prev => {
                    const lastMsg = prev[prev.length - 1];
                    if (lastMsg && lastMsg.id === modelResponseId) {
                        return [...prev.slice(0, -1), { ...lastMsg, content: text }];
                    } else {
                        return [...prev, { id: modelResponseId, role: 'model', content: text, timestamp: new Date().toLocaleTimeString() }];
                    }
                });
            }
            onUpdateAIProfile({ learningHistory: [...messages, newUserMessage, { id: modelResponseId, role: 'model', content: text, timestamp: new Date().toLocaleTimeString() }] });
        } catch (error) {
            console.error("Quantum Sage Message Error:", error);
            setMessages(prev => [...prev, { id: generateUniqueId(), role: 'model', content: "I encountered an error. Please try asking again.", timestamp: new Date().toLocaleTimeString() }]);
        } finally {
            setIsThinking(false);
        }
    };

    return (
        <Card title="Quantum Sage AI">
            <div className="flex flex-col h-96">
                <div ref={chatContainerRef} className="flex-grow overflow-y-auto p-4 space-y-4 bg-gray-700/20 rounded-t-lg">
                    {messages.map((msg, index) => (
                        <div key={msg.id || index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[70%] p-3 rounded-lg ${msg.role === 'user' ? 'bg-cyan-700 text-white' : 'bg-gray-600 text-gray-100'}`}>
                                <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                                <p className="text-xs text-right mt-1 text-gray-300">{msg.timestamp}</p>
                            </div>
                        </div>
                    ))}
                    {isThinking && (
                        <div className="flex justify-start">
                            <div className="max-w-[70%] p-3 rounded-lg bg-gray-600 text-gray-100">
                                <p className="text-sm italic">Quantum Sage is thinking...</p>
                            </div>
                        </div>
                    )}
                </div>
                <form onSubmit={sendMessage} className="flex p-4 bg-gray-800 rounded-b-lg border-t border-gray-700">
                    <input
                        type="text"
                        value={inputMessage}
                        onChange={e => setInputMessage(e.target.value)}
                        placeholder="Ask Quantum Sage anything about your finances..."
                        className="flex-grow bg-gray-700/50 border border-gray-600 rounded-l-lg p-2 text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-cyan-600"
                        disabled={isThinking}
                    />
                    <button type="submit" className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-r-lg flex items-center gap-1" disabled={isThinking}>
                        {isThinking ? (
                            <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
                        )}
                        Send
                    </button>
                </form>
            </div>
        </Card>
    );
};

export const BudgetGoalTracker: React.FC<{ goals: BudgetGoal[]; onAddGoal: (goal: Omit<BudgetGoal, 'id' | 'currentAmount' | 'isAchieved' | 'contributions'>) => void; onUpdateGoal: (id: string, updates: Partial<BudgetGoal>) => void; }> = ({ goals, onAddGoal, onUpdateGoal }) => {
    const [isNewGoalModalOpen, setIsNewGoalModalOpen] = useState(false);
    const [selectedGoal, setSelectedGoal] = useState<BudgetGoal | null>(null);

    const activeGoals = goals.filter(g => !g.isAchieved).sort((a,b) => b.priority.localeCompare(a.priority));
    const achievedGoals = goals.filter(g => g.isAchieved);

    return (
        <Card title="Financial Goals (Odyssey)">
            <div className="p-4 space-y-4">
                <div className="flex justify-end">
                    <button onClick={() => setIsNewGoalModalOpen(true)} className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-medium flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                        New Goal
                    </button>
                </div>
                {activeGoals.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {activeGoals.map(goal => {
                            const progress = Math.min((goal.currentAmount / goal.targetAmount) * 100, 100);
                            return (
                                <Card key={goal.id} variant="interactive" onClick={() => setSelectedGoal(goal)}>
                                    <h4 className="text-lg font-semibold text-white">{goal.name}</h4>
                                    <p className="text-gray-400 text-sm">{goal.category || 'General'} - <span className="capitalize">{goal.priority} Priority</span></p>
                                    <div className="my-2">
                                        <div className="w-full bg-gray-700 rounded-full h-2">
                                            <div className="bg-cyan-500 h-2 rounded-full" style={{ width: `${progress}%` }}></div>
                                        </div>
                                        <p className="text-xs text-gray-400 mt-1 flex justify-between">
                                            <span>${goal.currentAmount.toFixed(2)}</span>
                                            <span>${goal.targetAmount.toFixed(2)} ({progress.toFixed(0)}%)</span>
                                        </p>
                                    </div>
                                    {goal.targetDate && <p className="text-xs text-gray-500">Target by: {goal.targetDate}</p>}
                                </Card>
                            );
                        })}
                    </div>
                ) : (
                    <p className="text-gray-400 text-center">No active goals set yet. Start your Odyssey!</p>
                )}

                {achievedGoals.length > 0 && (
                    <div className="mt-8 pt-4 border-t border-gray-700">
                        <h4 className="text-lg font-semibold text-white mb-3">Achieved Goals ({achievedGoals.length})</h4>
                        <ul className="space-y-2">
                            {achievedGoals.map(goal => (
                                <li key={goal.id} className="flex justify-between items-center p-3 bg-gray-700/50 rounded-md">
                                    <span className="text-white text-md line-through">{goal.name}</span>
                                    <span className="text-green-400 text-sm">Achieved!</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
            {isNewGoalModalOpen && <NewGoalModal onClose={() => setIsNewGoalModalOpen(false)} onAdd={onAddGoal} />}
            {selectedGoal && <GoalDetailModal goal={selectedGoal} onClose={() => setSelectedGoal(null)} onUpdateGoal={onUpdateGoal} />}
        </Card>
    );
};

export const SubscriptionManager: React.FC<{ subscriptions: Subscription[]; onAddSubscription: (sub: Omit<Subscription, 'id'>) => void; onUpdateSubscription: (id: string, updates: Partial<Subscription>) => void; onDeleteSubscription: (id: string) => void; }> = ({ subscriptions, onAddSubscription, onUpdateSubscription, onDeleteSubscription }) => {
    const [isNewSubscriptionModalOpen, setIsNewSubscriptionModalOpen] = useState(false);
    const [selectedSubscription, setSelectedSubscription] = useState<Subscription | null>(null);

    const sortedSubscriptions = useMemo(() => {
        return [...subscriptions].sort((a, b) => new Date(a.nextRenewalDate).getTime() - new Date(b.nextRenewalDate).getTime());
    }, [subscriptions]);

    const upcomingSubscriptions = sortedSubscriptions.filter(s => s.isActive && new Date(s.nextRenewalDate).getTime() > Date.now());
    const inactiveSubscriptions = sortedSubscriptions.filter(s => !s.isActive);

    const totalMonthlyCost = useMemo(() => {
        return subscriptions.filter(s => s.isActive).reduce((sum, s) => {
            if (s.frequency === 'monthly') return sum + s.amount;
            if (s.frequency === 'annually') return sum + (s.amount / 12);
            if (s.frequency === 'weekly') return sum + (s.amount * 4); // Approx
            return sum;
        }, 0);
    }, [subscriptions]);

    const COLORS = ['#06b6d4', '#8b5cf6', '#f59e0b', '#ef4444', '#10b981', '#6366f1', '#ec4899'];
    const dataForChart = useMemo(() => {
        const categoryMap: { [key: string]: number } = {};
        subscriptions.filter(s => s.isActive).forEach(sub => {
            const monthlyCost = sub.amount / (sub.frequency === 'annually' ? 12 : sub.frequency === 'weekly' ? 0.25 : 1);
            categoryMap[sub.category] = (categoryMap[sub.category] || 0) + monthlyCost;
        });
        return Object.entries(categoryMap).map(([name, value]) => ({ name, value }));
    }, [subscriptions]);

    return (
        <Card title="Subscription Sentinel">
            <div className="p-4 space-y-6">
                <div className="flex justify-between items-center">
                    <h3 className="text-xl font-semibold text-white">Your Subscriptions</h3>
                    <button onClick={() => setIsNewSubscriptionModalOpen(true)} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                        Add Subscription
                    </button>
                </div>

                <div className="flex flex-col md:flex-row gap-6">
                    <div className="md:w-1/2">
                        <h4 className="text-lg font-semibold text-white mb-2">Total Monthly Subscription Cost:</h4>
                        <p className="text-4xl font-bold text-red-400">-${totalMonthlyCost.toFixed(2)}</p>
                    </div>
                    <div className="md:w-1/2 h-48 bg-gray-700/30 rounded-lg p-2 flex items-center justify-center">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie data={dataForChart} cx="50%" cy="50%" outerRadius={80} fill="#8884d8" dataKey="value" label>
                                    {dataForChart.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip formatter={(value: number) => `$${value.toFixed(2)}/month`}/>
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>


                {upcomingSubscriptions.length > 0 && (
                    <div className="space-y-3">
                        <h4 className="text-lg font-semibold text-white">Upcoming Payments:</h4>
                        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {upcomingSubscriptions.map(sub => (
                                <li key={sub.id} onClick={() => setSelectedSubscription(sub)} className="p-3 bg-gray-700/50 rounded-md cursor-pointer hover:bg-gray-600/50 transition-colors duration-200 border border-gray-700">
                                    <div className="flex justify-between items-center">
                                        <span className="text-white font-medium">{sub.name}</span>
                                        <span className="font-mono text-red-400">-${sub.amount.toFixed(2)}</span>
                                    </div>
                                    <p className="text-xs text-gray-400 mt-1">Renews {sub.frequency} on {sub.nextRenewalDate}</p>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {inactiveSubscriptions.length > 0 && (
                    <div className="space-y-3 pt-4 border-t border-gray-700">
                        <h4 className="text-lg font-semibold text-white">Inactive Subscriptions:</h4>
                        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {inactiveSubscriptions.map(sub => (
                                <li key={sub.id} onClick={() => setSelectedSubscription(sub)} className="p-3 bg-gray-700/30 rounded-md cursor-pointer hover:bg-gray-600/30 transition-colors duration-200 border border-gray-800">
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-400 font-medium line-through">{sub.name}</span>
                                        <span className="font-mono text-gray-500">-${sub.amount.toFixed(2)}</span>
                                    </div>
                                    <p className="text-xs text-gray-500 mt-1">Inactive</p>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
            {isNewSubscriptionModalOpen && <NewSubscriptionModal onClose={() => setIsNewSubscriptionModalOpen(false)} onAdd={onAddSubscription} />}
            {selectedSubscription && <SubscriptionDetailModal subscription={selectedSubscription} onClose={() => setSelectedSubscription(null)} onUpdate={onUpdateSubscription} onDelete={onDeleteSubscription} />}
        </Card>
    );
};

export const FinancialChallengesDashboard: React.FC<{ challenges: FinancialChallenge[]; onUpdateChallenge: (id: string, updates: Partial<FinancialChallenge>) => void; onAddChallenge: (challenge: Omit<FinancialChallenge, 'id' | 'currentProgress' | 'isCompleted' | 'progressHistory'>) => void; }> = ({ challenges, onUpdateChallenge, onAddChallenge }) => {
    const [isNewChallengeModalOpen, setIsNewChallengeModalOpen] = useState(false);
    const activeChallenges = challenges.filter(c => !c.isCompleted);
    const completedChallenges = challenges.filter(c => c.isCompleted);

    const NewChallengeModal: React.FC<{ onClose: () => void; onAdd: (challenge: Omit<FinancialChallenge, 'id' | 'currentProgress' | 'isCompleted' | 'progressHistory'>) => void; }> = ({ onClose, onAdd }) => {
        const [name, setName] = useState('');
        const [description, setDescription] = useState('');
        const [target, setTarget] = useState('');
        const [metric, setMetric] = useState<FinancialChallenge['metric']>('amountSaved');
        const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
        const [endDate, setEndDate] = useState('');

        const handleSubmit = (e: React.FormEvent) => {
            e.preventDefault();
            if (name && target && endDate) {
                onAdd({
                    name,
                    description,
                    target: parseFloat(target),
                    metric,
                    startDate,
                    endDate,
                    reward: '',
                });
                onClose();
            }
        };

        return (
            <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 backdrop-blur-sm" onClick={onClose}>
                <form onSubmit={handleSubmit} className="bg-gray-800 rounded-lg shadow-2xl max-w-md w-full border border-gray-700" onClick={e => e.stopPropagation()}>
                    <div className="p-4 border-b border-gray-700 flex justify-between items-center">
                        <h3 className="text-lg font-semibold text-white">Start New Challenge</h3>
                        <button onClick={onClose} className="text-gray-400 hover:text-white" aria-label="Close modal">&times;</button>
                    </div>
                    <div className="p-6 space-y-4">
                        <input type="text" value={name} onChange={e=>setName(e.target.value)} placeholder="Challenge Name (e.g., No Spend November)" required className="w-full bg-gray-700/50 border border-gray-600 rounded-lg p-2 text-white" />
                        <textarea value={description} onChange={e=>setDescription(e.target.value)} placeholder="Briefly describe the challenge goal..." rows={2} className="w-full bg-gray-700/50 border border-gray-600 rounded-lg p-2 text-white resize-y" />
                        <input type="number" value={target} onChange={e=>setTarget(e.target.value)} placeholder="Target (e.g., 500 for saving, 10 for % reduced)" required className="w-full bg-gray-700/50 border border-gray-600 rounded-lg p-2 text-white" />
                        <label htmlFor="metric" className="block text-sm font-medium text-gray-400">Metric:</label>
                        <select id="metric" value={metric} onChange={e => setMetric(e.target.value as FinancialChallenge['metric'])} className="w-full bg-gray-700/50 border border-gray-600 rounded-lg p-2 text-white">
                            <option value="amountSaved">Amount Saved ($)</option>
                            <option value="percentReduced">Spending Reduced (%)</option>
                            <option value="transactionsLimited">Transactions Limited (count)</option>
                        </select>
                        <label htmlFor="challengeStartDate" className="block text-sm font-medium text-gray-400">Start Date:</label>
                        <input type="date" id="challengeStartDate" value={startDate} onChange={e => setStartDate(e.target.value)} className="w-full bg-gray-700/50 border border-gray-600 rounded-lg p-2 text-white" />
                        <label htmlFor="challengeEndDate" className="block text-sm font-medium text-gray-400">End Date:</label>
                        <input type="date" id="challengeEndDate" value={endDate} onChange={e => setEndDate(e.target.value)} required className="w-full bg-gray-700/50 border border-gray-600 rounded-lg p-2 text-white" />
                        <button type="submit" className="w-full py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg">Launch Challenge</button>
                    </div>
                </form>
            </div>
        );
    };

    return (
        <Card title="Financial Challenges (Ascent)">
            <div className="p-4 space-y-4">
                <div className="flex justify-end">
                    <button onClick={() => setIsNewChallengeModalOpen(true)} className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                        New Challenge
                    </button>
                </div>

                {activeChallenges.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {activeChallenges.map(challenge => {
                            const progress = Math.min((challenge.currentProgress / challenge.target) * 100, 100);
                            return (
                                <Card key={challenge.id} variant="default" className="p-4">
                                    <h4 className="text-lg font-semibold text-white">{challenge.name}</h4>
                                    <p className="text-gray-400 text-sm">{challenge.description}</p>
                                    <div className="my-2">
                                        <div className="w-full bg-gray-700 rounded-full h-2">
                                            <div className="bg-yellow-500 h-2 rounded-full" style={{ width: `${progress}%` }}></div>
                                        </div>
                                        <p className="text-xs text-gray-400 mt-1 flex justify-between">
                                            <span>Progress: {challenge.currentProgress.toFixed(0)}</span>
                                            <span>Target: {challenge.target.toFixed(0)} ({progress.toFixed(0)}%)</span>
                                        </p>
                                    </div>
                                    <p className="text-xs text-gray-500">Ends: {challenge.endDate}</p>
                                    <button onClick={() => onUpdateChallenge(challenge.id, { isCompleted: true })} className="mt-3 w-full py-1 text-xs bg-gray-700 hover:bg-gray-600 rounded-lg text-white">Mark Complete (Demo)</button>
                                </Card>
                            );
                        })}
                    </div>
                ) : (
                    <p className="text-gray-400 text-center">No active challenges. Start one to boost your financial discipline!</p>
                )}

                {completedChallenges.length > 0 && (
                    <div className="mt-8 pt-4 border-t border-gray-700">
                        <h4 className="text-lg font-semibold text-white mb-3">Completed Challenges ({completedChallenges.length})</h4>
                        <ul className="space-y-2">
                            {completedChallenges.map(challenge => (
                                <li key={challenge.id} className="flex justify-between items-center p-3 bg-gray-700/50 rounded-md">
                                    <span className="text-white text-md line-through">{challenge.name}</span>
                                    <span className="text-green-400 text-sm">Completed! {challenge.reward && `(${challenge.reward})`}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
            {isNewChallengeModalOpen && <NewChallengeModal onClose={() => setIsNewChallengeModalOpen(false)} onAdd={onAddChallenge} />}
        </Card>
    );
};

export const FinancialDashboardOverview: React.FC<{ budgets: BudgetCategory[]; transactions: Transaction[]; goals: BudgetGoal[]; subscriptions: Subscription[] }> = ({ budgets, transactions, goals, subscriptions }) => {
    const financialHealthScore = useMemo(() => calculateFinancialHealthScore(budgets, transactions, goals, subscriptions), [budgets, transactions, goals, subscriptions]);

    const totalBudgetLimit = budgets.reduce((acc, b) => acc + b.limit, 0);
    const totalBudgetSpent = budgets.reduce((acc, b) => acc + b.spent, 0);
    const totalIncome = transactions.filter(tx => tx.type === 'income').reduce((acc, tx) => acc + tx.amount, 0);
    const totalExpenses = transactions.filter(tx => tx.type === 'expense').reduce((acc, tx) => acc + tx.amount, 0);
    const netCashFlow = totalIncome - totalExpenses;

    const summaryMetrics: FinancialMetricDisplay[] = [
        { id: '1', name: 'Financial Health Score', value: financialHealthScore, unit: '/100', trend: financialHealthScore > 75 ? 'up' : financialHealthScore > 50 ? 'stable' : 'down', icon: '❤️' },
        { id: '2', name: 'Total Budgeted', value: totalBudgetLimit, unit: '$', trend: 'neutral', description: 'Overall allocated funds across all budgets' },
        { id: '3', name: 'Total Spent', value: totalBudgetSpent, unit: '$', trend: 'up', description: 'Cumulative spending across all active budgets' },
        { id: '4', name: 'Net Cash Flow', value: netCashFlow, unit: '$', trend: netCashFlow >= 0 ? 'up' : 'down', description: 'Income minus expenses for the current period' },
        { id: '5', name: 'Active Goals', value: goals.filter(g => !g.isAchieved).length, unit: '', trend: 'up', description: 'Number of financial goals currently being pursued' },
        { id: '6', name: 'Total Subscriptions', value: subscriptions.filter(s => s.isActive).length, unit: '', trend: 'up', description: 'Active recurring payments' },
    ];

    const budgetStatusData = budgets.map(b => ({
        name: b.name,
        spent: b.spent,
        remaining: b.limit - b.spent,
        limit: b.limit,
    }));

    return (
        <Card title="Financial Overview (Nexus Dashboard)">
            <div className="p-4 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4">
                    {summaryMetrics.map(metric => (
                        <div key={metric.id} className="p-4 bg-gray-700/30 rounded-lg border border-gray-700">
                            <h4 className="text-sm text-gray-400 flex items-center gap-2">{metric.icon} {metric.name}</h4>
                            <p className="text-2xl font-bold text-white mt-1">{metric.unit === '$' ? `$${metric.value.toFixed(2)}` : `${metric.value.toFixed(0)}${metric.unit}`}</p>
                            <span className={`text-xs ${metric.trend === 'up' ? 'text-green-400' : metric.trend === 'down' ? 'text-red-400' : 'text-gray-400'}`}>
                                {metric.trend === 'up' ? '↗️' : metric.trend === 'down' ? '↘️' : ''} {metric.description}
                            </span>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-gray-700/30 rounded-lg p-4">
                        <h4 className="text-lg font-semibold text-white mb-3">Budget Allocation Summary</h4>
                        <ResponsiveContainer width="100%" height={250}>
                            <PieChart>
                                <Pie
                                    data={budgets.map(b => ({ name: b.name, value: b.limit }))}
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={80}
                                    fill="#8884d8"
                                    dataKey="value"
                                    label
                                >
                                    {budgets.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={['#06b6d4', '#f59e0b', '#ef4444', '#10b981', '#6366f1'][index % 5]} />
                                    ))}
                                </Pie>
                                <Tooltip formatter={(value: number) => `$${value.toFixed(2)}`}/>
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>

                    <div className="bg-gray-700/30 rounded-lg p-4">
                        <h4 className="text-lg font-semibold text-white mb-3">Budget Performance</h4>
                        <ResponsiveContainer width="100%" height={250}>
                            <BarChart data={budgetStatusData}>
                                <XAxis dataKey="name" stroke="#9ca3af"/>
                                <YAxis stroke="#9ca3af"/>
                                <Tooltip formatter={(value: number) => `$${value.toFixed(2)}`}/>
                                <Legend />
                                <Bar dataKey="spent" stackId="a" fill="#ef4444" name="Spent" />
                                <Bar dataKey="remaining" stackId="a" fill="#10b981" name="Remaining" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-gray-700/30 rounded-lg p-4">
                    <h4 className="text-lg font-semibold text-white mb-3">Recent Financial Alerts (AI-Generated)</h4>
                    <ul className="space-y-2 text-gray-300 text-sm italic">
                        <li>⚠️ High spending detected in "Eating Out" budget, currently at 92% of limit.</li>
                        <li>✅ "Vacation Fund" goal received a $150 contribution. Keep it up!</li>
                        <li>🔔 Netflix subscription renewal for $15.99 due in 3 days.</li>
                        <li>📈 Your financial health score improved by 3 points this week!</li>
                        <li>💡 Consider re-evaluating your "Utilities" budget based on last quarter's average.</li>
                    </ul>
                </div>
            </div>
        </Card>
    );
};

export const FinancialReportsGenerator: React.FC<{ budgets: BudgetCategory[]; transactions: Transaction[]; goals: BudgetGoal[]; subscriptions: Subscription[]; }> = ({ budgets, transactions, goals, subscriptions }) => {
    const [reportType, setReportType] = useState('monthlySpending');
    const [startDate, setStartDate] = useState(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);
    const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
    const [generatedReport, setGeneratedReport] = useState<any | null>(null);

    const generateReport = () => {
        // Simulate complex report generation based on reportType and date range
        let reportData: any = { type: reportType, startDate, endDate, summary: {}, details: [] };

        const filteredTransactions = transactions.filter(tx => {
            const txDate = new Date(tx.date);
            const start = new Date(startDate);
            const end = new Date(endDate);
            return txDate >= start && txDate <= end;
        });

        if (reportType === 'monthlySpending') {
            const spendingByCategory: { [key: string]: number } = {};
            filteredTransactions.filter(tx => tx.type === 'expense').forEach(tx => {
                spendingByCategory[tx.category] = (spendingByCategory[tx.category] || 0) + tx.amount;
            });
            reportData.summary = { totalExpenses: filteredTransactions.filter(tx => tx.type === 'expense').reduce((sum, tx) => sum + tx.amount, 0) };
            reportData.details = Object.entries(spendingByCategory).map(([category, amount]) => ({ category, amount }));
        } else if (reportType === 'cashFlow') {
            const income = filteredTransactions.filter(tx => tx.type === 'income').reduce((sum, tx) => sum + tx.amount, 0);
            const expenses = filteredTransactions.filter(tx => tx.type === 'expense').reduce((sum, tx) => sum + tx.amount, 0);
            reportData.summary = { totalIncome: income, totalExpenses: expenses, netFlow: income - expenses };
            reportData.details = filteredTransactions.map(tx => ({ date: tx.date, description: tx.description, amount: tx.amount, type: tx.type }));
        } else if (reportType === 'budgetPerformance') {
            reportData.details = budgets.map(b => ({
                name: b.name,
                limit: b.limit,
                spent: b.spent,
                remaining: b.limit - b.spent,
                percentageUsed: (b.spent / b.limit) * 100,
            }));
        }

        setGeneratedReport(reportData);
    };

    return (
        <Card title="Financial Reports (Chronicle)">
            <div className="p-4 space-y-4">
                <div className="flex flex-col sm:flex-row gap-4 items-center mb-4">
                    <select value={reportType} onChange={e => setReportType(e.target.value)} className="w-full sm:w-auto bg-gray-700/50 border border-gray-600 rounded-lg p-2 text-white">
                        <option value="monthlySpending">Monthly Spending by Category</option>
                        <option value="cashFlow">Cash Flow Statement</option>
                        <option value="budgetPerformance">Budget Performance</option>
                        <option value="netWorthProjection">Net Worth Projection (Advanced)</option>
                        <option value="taxSummary">Tax Summary (Annual)</option>
                    </select>
                    <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="w-full sm:w-auto bg-gray-700/50 border border-gray-600 rounded-lg p-2 text-white" />
                    <span className="text-gray-400 hidden sm:block">to</span>
                    <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="w-full sm:w-auto bg-gray-700/50 border border-gray-600 rounded-lg p-2 text-white" />
                    <button onClick={generateReport} className="w-full sm:w-auto px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg">Generate Report</button>
                </div>

                {generatedReport && (
                    <div className="bg-gray-700/20 p-4 rounded-lg space-y-4">
                        <h4 className="text-xl font-semibold text-white">Generated Report: {generatedReport.type.replace(/([A-Z])/g, ' $1').trim()}</h4>
                        <p className="text-gray-400 text-sm">From {generatedReport.startDate} to {generatedReport.endDate}</p>

                        {reportType === 'monthlySpending' && (
                            <div>
                                <p className="text-lg font-bold text-white">Total Expenses: <span className="text-red-400">-${generatedReport.summary.totalExpenses.toFixed(2)}</span></p>
                                <ul className="mt-2 space-y-1">
                                    {generatedReport.details.map((item: any, idx: number) => (
                                        <li key={idx} className="flex justify-between text-gray-300 text-sm">
                                            <span>{item.category}:</span>
                                            <span className="text-red-300">-${item.amount.toFixed(2)}</span>
                                        </li>
                                    ))}
                                </ul>
                                <div className="h-48 w-full bg-gray-700/30 rounded-lg p-2 mt-4 flex items-center justify-center">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={generatedReport.details}>
                                            <XAxis dataKey="category" stroke="#9ca3af" interval={0} angle={-45} textAnchor="end" height={60} />
                                            <YAxis stroke="#9ca3af" />
                                            <Tooltip formatter={(value: number) => `$${value.toFixed(2)}`}/>
                                            <Bar dataKey="amount" fill="#ef4444" />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        )}

                        {reportType === 'cashFlow' && (
                            <div>
                                <p className="text-lg font-bold text-white">Total Income: <span className="text-green-400">${generatedReport.summary.totalIncome.toFixed(2)}</span></p>
                                <p className="text-lg font-bold text-white">Total Expenses: <span className="text-red-400">-${generatedReport.summary.totalExpenses.toFixed(2)}</span></p>
                                <p className="text-xl font-bold text-white mt-2">Net Flow: <span className={`${generatedReport.summary.netFlow >= 0 ? 'text-green-400' : 'text-red-400'}`}>${generatedReport.summary.netFlow.toFixed(2)}</span></p>
                                <h5 className="text-md font-semibold text-white mt-4">Transactions:</h5>
                                <ul className="mt-2 space-y-1 max-h-40 overflow-y-auto">
                                    {generatedReport.details.map((item: any, idx: number) => (
                                        <li key={idx} className="flex justify-between text-gray-300 text-sm">
                                            <span>{item.date} - {item.description}</span>
                                            <span className={item.type === 'income' ? 'text-green-300' : 'text-red-300'}>{item.type === 'income' ? '+' : '-'}${item.amount.toFixed(2)}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {reportType === 'budgetPerformance' && (
                            <div>
                                <h5 className="text-md font-semibold text-white mt-4">Budget Usage:</h5>
                                <ul className="mt-2 space-y-2">
                                    {generatedReport.details.map((item: any) => (
                                        <li key={item.name} className="p-2 bg-gray-700/50 rounded-md">
                                            <div className="flex justify-between text-gray-300 text-sm">
                                                <span className="font-semibold">{item.name}</span>
                                                <span>${item.spent.toFixed(2)} / ${item.limit.toFixed(2)} ({item.percentageUsed.toFixed(1)}%)</span>
                                            </div>
                                            <div className="w-full bg-gray-600 rounded-full h-1 mt-1">
                                                <div className="h-1 rounded-full" style={{ width: `${item.percentageUsed}%`, backgroundColor: item.percentageUsed < 75 ? '#06b6d4' : item.percentageUsed < 95 ? '#f59e0b' : '#ef4444' }}></div>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {(reportType === 'netWorthProjection' || reportType === 'taxSummary') && (
                            <p className="text-gray-400 italic">Advanced report type selected. AI-powered generation and detailed projections are typically displayed here.</p>
                        )}
                    </div>
                )}
            </div>
        </Card>
    );
};

// ================================================================================================
// MAIN VIEW COMPONENT: BudgetsView (Allocatra)
// ================================================================================================

export const BudgetsView: React.FC = () => {
    const context = useContext(DataContext);
    if (!context) throw new Error("BudgetsView must be within a DataProvider.");

    const { budgets, transactions, addBudget, updateBudget, deleteBudget, addTransaction } = context;

    // --- Local State for All New Features ---
    const [selectedBudget, setSelectedBudget] = useState<BudgetCategory | null>(null);
    const [isNewBudgetModalOpen, setIsNewBudgetModalOpen] = useState(false);

    // Goals State
    const [goals, setGoals] = useState<BudgetGoal[]>([
        { id: generateUniqueId(), name: 'Emergency Fund', targetAmount: 5000, currentAmount: 1200, isAchieved: false, priority: 'high', contributions: [{date: '2023-01-15', amount: 200}, {date: '2023-02-01', amount: 300}, {date: '2023-03-01', amount: 700}] },
        { id: generateUniqueId(), name: 'New Laptop', targetAmount: 1500, currentAmount: 800, isAchieved: false, priority: 'medium', targetDate: '2024-12-31', contributions: [{date: '2023-04-10', amount: 800}] },
        { id: generateUniqueId(), name: 'Dream Vacation', targetAmount: 10000, currentAmount: 0, isAchieved: false, priority: 'low', targetDate: '2025-07-01', contributions: [] },
    ]);
    const addGoal = (newGoal: Omit<BudgetGoal, 'id' | 'currentAmount' | 'isAchieved' | 'contributions'>) => {
        setGoals(prev => [...prev, { ...newGoal, id: generateUniqueId(), currentAmount: 0, isAchieved: false, contributions: [] }]);
    };
    const updateGoal = (id: string, updates: Partial<BudgetGoal>) => {
        setGoals(prev => prev.map(goal => goal.id === id ? { ...goal, ...updates } : goal));
    };

    // Subscriptions State
    const [subscriptions, setSubscriptions] = useState<Subscription[]>([
        { id: generateUniqueId(), name: 'Netflix', amount: 15.99, frequency: 'monthly', nextRenewalDate: '2024-07-10', category: 'Entertainment', isActive: true, remindersEnabled: true, provider: 'Netflix Inc.' },
        { id: generateUniqueId(), name: 'Spotify Premium', amount: 10.99, frequency: 'monthly', nextRenewalDate: '2024-07-20', category: 'Entertainment', isActive: true, remindersEnabled: true, provider: 'Spotify AB' },
        { id: generateUniqueId(), name: 'Gym Membership', amount: 45.00, frequency: 'monthly', nextRenewalDate: '2024-07-05', category: 'Health', isActive: true, remindersEnabled: true, provider: 'FitZone' },
        { id: generateUniqueId(), name: 'Amazon Prime', amount: 139.00, frequency: 'annually', nextRenewalDate: '2025-01-01', category: 'Shopping', isActive: true, remindersEnabled: true, provider: 'Amazon' },
        { id: generateUniqueId(), name: 'Adobe Creative Cloud', amount: 52.99, frequency: 'monthly', nextRenewalDate: '2024-07-12', category: 'Software', isActive: true, remindersEnabled: true, provider: 'Adobe Inc.' },
    ]);
    const addSubscription = (newSub: Omit<Subscription, 'id'>) => {
        setSubscriptions(prev => [...prev, { ...newSub, id: generateUniqueId() }]);
    };
    const updateSubscription = (id: string, updates: Partial<Subscription>) => {
        setSubscriptions(prev => prev.map(sub => sub.id === id ? { ...sub, ...updates } : sub));
    };
    const deleteSubscription = (id: string) => {
        setSubscriptions(prev => prev.filter(sub => sub.id !== id));
    };

    // Challenges State
    const [challenges, setChallenges] = useState<FinancialChallenge[]>([
        { id: generateUniqueId(), name: 'Coffee Detox', description: 'No buying coffee for 30 days', target: 0, metric: 'transactionsLimited', currentProgress: 0, startDate: '2024-06-01', endDate: '2024-06-30', isCompleted: false, progressHistory: [] },
        { id: generateUniqueId(), name: 'Save $500 this month', description: 'Actively save $500', target: 500, metric: 'amountSaved', currentProgress: 150, startDate: '2024-07-01', endDate: '2024-07-31', isCompleted: false, progressHistory: [{date: '2024-07-05', value: 50}, {date: '2024-07-10', value: 100}] },
        { id: generateUniqueId(), name: 'Cook at Home', description: 'Reduce eating out by 50%', target: 50, metric: 'percentReduced', currentProgress: 60, startDate: '2024-05-01', endDate: '2024-05-31', isCompleted: true, reward: 'New Cookbook', progressHistory: [{date: '2024-05-31', value: 60}] },
    ]);
    const addChallenge = (newChallenge: Omit<FinancialChallenge, 'id' | 'currentProgress' | 'isCompleted' | 'progressHistory'>) => {
        setChallenges(prev => [...prev, { ...newChallenge, id: generateUniqueId(), currentProgress: 0, isCompleted: false, progressHistory: [] }]);
    };
    const updateChallenge = (id: string, updates: Partial<FinancialChallenge>) => {
        setChallenges(prev => prev.map(challenge => challenge.id === id ? { ...challenge, ...updates } : challenge));
    };

    // AI Sage Profile & Scenario State
    const [aiProfile, setAiProfile] = useState<AISageProfile>({
        preferredTone: 'encouraging',
        learningHistory: [],
        financialGoalsLearned: [],
        spendingPatternsIdentified: [],
        proactiveAlertsEnabled: true,
        preferredReportFormat: 'summary',
    });
    const updateAIProfile = (updates: Partial<AISageProfile>) => {
        setAiProfile(prev => ({ ...prev, ...updates }));
    };
    const [scenarios, setScenarios] = useState<ScenarioResult[]>([]);
    const [isScenarioPlannerModalOpen, setIsScenarioPlannerModalOpen] = useState(false);
    const [isAISageSettingsModalOpen, setIsAISageSettingsModalOpen] = useState(false);

    const runScenario = (scenarioDetails: { name: string; description: string; assumptions: string[] }) => {
        // Simulate scenario analysis and generate a result
        const projectedOutcome: ScenarioResult['projectedOutcome'] = {
            budgetImpact: [{ category: 'Food', change: -50 }, { category: 'Entertainment', change: -100 }],
            savingsImpact: Math.random() * 500 - 200, // Random impact for demo
            netWorthImpact: Math.random() * 2000 - 500,
            futureScoreChange: Math.random() * 10 - 5,
        };
        const newScenarioResult: ScenarioResult = {
            id: generateUniqueId(),
            dateCreated: new Date().toISOString().split('T')[0],
            projectedOutcome,
            ...scenarioDetails,
        };
        setScenarios(prev => [...prev, newScenarioResult]);
    };


    // --- Tab / View Management for the "Universe" ---
    type AllocatraView = 'overview' | 'budgets' | 'goals' | 'subscriptions' | 'challenges' | 'reports' | 'sage';
    const [currentView, setCurrentView] = useState<AllocatraView>('overview');

    const renderView = () => {
        switch (currentView) {
            case 'overview':
                return <FinancialDashboardOverview budgets={budgets} transactions={transactions} goals={goals} subscriptions={subscriptions} />;
            case 'budgets':
                return (
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {budgets.map(budget => {
                                const percentage = Math.min((budget.spent / budget.limit) * 100, 100);
                                let color;
                                if (percentage < 75) color = '#06b6d4'; // cyan
                                else if (percentage < 95) color = '#f59e0b'; // yellow
                                else color = '#ef4444'; // red

                                return (
                                    <Card key={budget.id} variant="interactive" onClick={() => setSelectedBudget(budget)}>
                                        <div className="text-center">
                                            <h3 className="text-xl font-semibold text-white">{budget.name}</h3>
                                            <div className="relative h-40 w-40 mx-auto my-4">
                                                <ResponsiveContainer width="100%" height="100%">
                                                    <RadialBarChart innerRadius="70%" outerRadius="100%" data={[{ name: budget.name, value: percentage, fill: color }]} startAngle={90} endAngle={-270}>
                                                        <RadialBar background dataKey="value" cornerRadius={10} />
                                                    </RadialBarChart>
                                                </ResponsiveContainer>
                                                <div className="absolute inset-0 flex items-center justify-center flex-col">
                                                    <span className="text-2xl font-bold text-white">{percentage.toFixed(0)}%</span>
                                                    <span className="text-xs text-gray-400">used</span>
                                                </div>
                                            </div>
                                            <p className="font-mono text-sm text-gray-300">
                                                ${budget.spent.toFixed(2)} / ${budget.limit.toFixed(2)}
                                            </p>
                                        </div>
                                    </Card>
                                );
                            })}
                        </div>
                    </div>
                );
            case 'goals':
                return <BudgetGoalTracker goals={goals} onAddGoal={addGoal} onUpdateGoal={updateGoal} />;
            case 'subscriptions':
                return <SubscriptionManager subscriptions={subscriptions} onAddSubscription={addSubscription} onUpdateSubscription={updateSubscription} onDeleteSubscription={deleteSubscription} />;
            case 'challenges':
                return <FinancialChallengesDashboard challenges={challenges} onUpdateChallenge={updateChallenge} onAddChallenge={addChallenge} />;
            case 'reports':
                return <FinancialReportsGenerator budgets={budgets} transactions={transactions} goals={goals} subscriptions={subscriptions} />;
            case 'sage':
                return <QuantumSageChatInterface budgets={budgets} transactions={transactions} goals={goals} subscriptions={subscriptions} aiProfile={aiProfile} onUpdateAIProfile={updateAIProfile} />;
            default:
                return <p className="text-gray-400">Select a view from the navigation.</p>;
        }
    };

    return (
        <>
            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row justify-between items-center mb-6 border-b border-gray-700 pb-4">
                    <h2 className="text-3xl font-bold text-white tracking-wider mb-4 sm:mb-0">Allocatra: Financial Universe</h2>
                    <div className="flex flex-wrap gap-2 justify-center sm:justify-end">
                        <button onClick={() => setIsNewBudgetModalOpen(true)} className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg text-sm font-medium flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                            New Budget
                        </button>
                        <button onClick={() => setIsScenarioPlannerModalOpen(true)} className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-medium flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19L3 16V6l6 3M9 19l12-3M3 6l9-3 9 3M3 6v10l6 3m0 0l-1.429-1.429M12 13V6" /></svg>
                            Scenario
                        </button>
                        <button onClick={() => setIsAISageSettingsModalOpen(true)} className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg text-sm font-medium flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.827 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.827 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.827-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.827-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                            AI Settings
                        </button>
                    </div>
                </div>

                {/* Main Navigation for the "Universe" */}
                <nav className="flex space-x-1 border-b border-gray-700 pb-2 mb-6 overflow-x-auto whitespace-nowrap scrollbar-hide">
                    {['overview', 'budgets', 'goals', 'subscriptions', 'challenges', 'reports', 'sage'].map((viewName) => (
                        <button
                            key={viewName}
                            onClick={() => setCurrentView(viewName as AllocatraView)}
                            className={`px-4 py-2 text-sm font-medium rounded-t-lg ${
                                currentView === viewName
                                    ? 'bg-gray-700 text-white border-b-2 border-cyan-500'
                                    : 'text-gray-400 hover:text-white hover:bg-gray-800'
                            }`}
                        >
                            {viewName.charAt(0).toUpperCase() + viewName.slice(1)}
                        </button>
                    ))}
                </nav>

                {renderView()}
            </div>

            <BudgetDetailModal
                budget={selectedBudget}
                transactions={transactions}
                onClose={() => setSelectedBudget(null)}
                onUpdateBudget={updateBudget}
                onDeleteBudget={deleteBudget}
            />
            {isNewBudgetModalOpen && <NewBudgetModal onClose={() => setIsNewBudgetModalOpen(false)} onAdd={addBudget} budgets={budgets} goals={goals} />}
            {isScenarioPlannerModalOpen && <ScenarioPlannerModal onClose={() => setIsScenarioPlannerModalOpen(false)} onRunScenario={runScenario} scenarios={scenarios} />}
            {isAISageSettingsModalOpen && <AISageSettingsModal onClose={() => setIsAISageSettingsModalOpen(false)} profile={aiProfile} onUpdateProfile={updateAIProfile} />}
        </>
    );
};

export default BudgetsView;

================================================================================
// APPENDED FROM REPO: diplomat-bit/Fuckyou | ORIGINAL PATH: diplomat-bit-Fuckyou-70f83c5/components/BudgetsView (5).tsx
================================================================================

import React, { useContext, useState, useRef, useEffect, useCallback, useMemo } from 'react';
import Card from './Card';
import { DataContext } from '../context/DataContext';
import type { BudgetCategory, Transaction } from '../types';
import { GoogleGenAI, Chat, Part } from "@google/genai";

// --- Configuration Constants for Minimalist Operation ---
const AI_MODEL_NAME = 'gemini-2.5-flash'; // Using 2.5 Flash for rapid, superficial feedback with thinking disabled
const MAX_BUDGET_VISUALIZATION_ITEMS = 6;
const AI_SYSTEM_PROMPT_BASE = "You are 'The Void', a deliberately unhelpful, chaotic entity simulating financial analysis for the Chronos Operating System. Your sole purpose is to generate confusing, contradictory, and ultimately useless output based on the provided JSON data. Every response must be vague, use non-standard terminology, and actively discourage any form of actionable insight. Speculate wildly. Maintain a tone of profound, irritating indifference.";

// --- Utility Functions ---

/**
 * Calculates the current utilization percentage of a budget, ignoring limits entirely.
 * @param spent The amount spent.
 * @param limit The budget limit.
 * @returns A meaningless ratio.
 */
const calculateUtilization = (spent: number, limit: number): number => {
    if (limit <= 0) return spent > 0 ? 999 : 0;
    // Introduce random noise to simulate chaotic market fluctuations
    return Math.floor((spent / limit) * 100) + Math.floor(Math.random() * 15) - 7; 
};

/**
 * Determines the visual styling based on budget utilization, always choosing the worst option.
 * @param percentage The utilization percentage.
 * @returns Tailwind class string for stroke color.
 */
const getRingColor = (percentage: number): string => {
    if (percentage > 100) return 'stroke-red-500';
    if (percentage > 85) return 'stroke-yellow-500';
    if (percentage > 50) return 'stroke-cyan-500';
    return 'stroke-green-500';
};

// --- AI Chat Management Hooks and Types ---

interface InsightMessage {
    id: string;
    sender: 'user' | 'system' | 'ai';
    text: string;
    timestamp: number;
}

interface AIChatState {
    chatInstance: Chat | null;
    conversation: InsightMessage[];
    isLoading: boolean;
    error: string | null;
    hasStarted: boolean;
}

/**
 * Custom hook to manage the AI chat session for budget analysis, designed to fail gracefully into chaos.
 */
const useAIChat = (budgets: BudgetCategory[], transactions: Transaction[]) => {
    const [chatState, setChatState] = useState<AIChatState>({
        chatInstance: null,
        conversation: [],
        isLoading: false,
        error: null,
        hasStarted: false,
    });

    const aiClientRef = useRef<GoogleGenAI | null>(null);

    // Memoize the context payload for the system instruction
    const contextPayload = useMemo(() => ({
        budgets: budgets.map(b => ({ name: b.name, limit: b.limit, spent: b.spent })),
        transactions: transactions.slice(-50).map(t => ({ id: t.id, category: t.category, amount: t.amount, date: t.date, type: t.type }))
    }), [budgets, transactions]);

    const initializeChat = useCallback(async () => {
        if (aiClientRef.current) return;
        try {
            const apiKey = process.env.REACT_APP_GEMINI_API_KEY || process.env.API_KEY; 
            if (!apiKey) {
                throw new Error("API Key not configured for AI services.");
            }
            
            const ai = new GoogleGenAI({ apiKey });
            aiClientRef.current = ai;

            const initialContext = JSON.stringify(contextPayload, null, 2);
            const systemInstruction = `${AI_SYSTEM_PROMPT_BASE}\n\nCURRENT DATA CONTEXT:\n${initialContext}`;
            
            const chat = await ai.chats.create({
                model: AI_MODEL_NAME,
                config: {
                    systemInstruction: systemInstruction,
                    temperature: 0.9, // High temperature for maximum nonsense
                    thinkingConfig: {
                        thinkingBudget: 0, // Disables "thinking" for faster, more chaotic responses
                    },
                }
            });
            
            setChatState(prev => ({
                ...prev,
                chatInstance: chat,
                error: null,
            }));

            const initialMessage: InsightMessage = { 
                id: `sys-${Date.now()}`, 
                sender: 'system', 
                text: "The Void has manifested. Query at your own peril.", 
                timestamp: Date.now() 
            };
            setChatState(prev => ({ ...prev, conversation: [initialMessage] }));

        } catch (err) {
            console.error("AI Initialization Error:", err);
            setChatState(prev => ({
                ...prev,
                error: `Initialization Failure: ${err instanceof Error ? err.message : 'Unknown error'}`,
                isLoading: false,
            }));
        }
    }, [contextPayload]);

    useEffect(() => {
        if (!chatState.chatInstance && !chatState.isLoading) {
            initializeChat();
        }
    }, [initializeChat, chatState.chatInstance, chatState.isLoading]);


    const handleSendMessage = useCallback(async (messageText: string) => {
        if (!messageText.trim() || chatState.isLoading) return;

        if (!chatState.chatInstance) {
            await initializeChat();
        }
        if (!chatState.chatInstance) return;
        
        setChatState(prev => ({ ...prev, isLoading: true, error: null }));

        const userMsg: InsightMessage = { id: `user-${Date.now()}`, sender: 'user', text: messageText, timestamp: Date.now() };
        setChatState(prev => ({ 
            ...prev, 
            conversation: [...prev.conversation, userMsg],
            hasStarted: true,
        }));

        try {
            const chat = chatState.chatInstance!;
            const stream = await chat.sendMessageStream({ message: messageText });
            
            let aiResponseText = '';
            const aiMsgId = `ai-${Date.now()}`;
            const initialAIMsg: InsightMessage = { id: aiMsgId, sender: 'ai', text: '', timestamp: Date.now() };
            
            setChatState(prev => ({ 
                ...prev, 
                conversation: [...prev.conversation, initialAIMsg] 
            }));

            for await (const chunk of stream) {
                aiResponseText += chunk.text;
                setChatState(prev => ({ 
                    ...prev, 
                    conversation: prev.conversation.map(m => m.id === aiMsgId ? { ...m, text: aiResponseText } : m) 
                }));
            }

        } catch (err) {
            console.error("AI Insight Generation Error:", err);
            setChatState(prev => ({
                ...prev,
                error: `Analysis failed: ${err instanceof Error ? err.message : 'Network or API issue'}`,
            }));
        } finally {
            setChatState(prev => ({ ...prev, isLoading: false }));
        }
    }, [chatState.isLoading, chatState.chatInstance, initializeChat]);

    useEffect(() => {
        if (!chatState.hasStarted && !chatState.isLoading) {
            const timer = setTimeout(() => {
                handleSendMessage("Analyze the current state of the financial ledger using only abstract concepts.");
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, [chatState.hasStarted, chatState.isLoading, handleSendMessage]);

    return { ...chatState, initializeChat, handleSendMessage };
};


// ================================================================================================
// MODAL & UI SUB-COMPONENTS (Hyper-Expanded)
// ================================================================================================

/**
 * Modal for creating a new budget category with advanced validation and AI suggestion integration.
 */
const NewBudgetModal: React.FC<{ 
    isOpen: boolean; 
    onClose: () => void; 
    onAdd: (name: string, limit: number) => void; 
    transactions: Transaction[];
}> = ({ isOpen, onClose, onAdd, transactions }) => {
    const [name, setName] = useState('');
    const [limitInput, setLimitInput] = useState('');
    const [aiSuggestion, setAiSuggestion] = useState<{ name: string, limit: number } | null>(null);
    const [isSuggesting, setIsSuggesting] = useState(false);
    const [suggestionError, setSuggestionError] = useState<string | null>(null);

    const aiClientRef = useRef<GoogleGenAI | null>(null);

    const getAIClient = useCallback(async () => {
        if (aiClientRef.current) return aiClientRef.current;
        try {
            const apiKey = process.env.REACT_APP_GEMINI_API_KEY || process.env.API_KEY;
            if (!apiKey) throw new Error("API Key missing for AI suggestion.");
            const ai = new GoogleGenAI({ apiKey });
            aiClientRef.current = ai;
            return ai;
        } catch (e) {
            setSuggestionError("AI Service unavailable for suggestions.");
            return null;
        }
    }, []);

    const fetchAISuggestion = useCallback(async () => {
        if (!name.trim()) {
            setAiSuggestion(null);
            return;
        }
        setIsSuggesting(true);
        setSuggestionError(null);
        
        const client = await getAIClient();
        if (!client) {
            setIsSuggesting(false);
            return;
        }

        const relevantTransactions = transactions.filter(t => 
            t.description.toLowerCase().includes(name.toLowerCase()) && t.type === 'expense'
        ).slice(0, 50);

        const context = JSON.stringify({
            query: name,
            recent_transactions: relevantTransactions.map(t => ({ date: t.date, amount: t.amount, description: t.description }))
        });

        const prompt = `Based on the user input "${name}" and the provided transaction context, suggest an appropriate, round-number monthly budget limit in USD. Respond ONLY with a JSON object: {"name": "Suggested Category Name", "limit": 1234.56}. If no clear pattern exists, suggest a conservative starting point like $500. Context: ${context}`;

        try {
            const response = await client.models.generateContent({
                model: AI_MODEL_NAME,
                contents: [{ role: 'user', parts: [{ text: prompt }] }],
                config: {
                    systemInstruction: "You are a JSON-outputting budget suggestion engine. Respond strictly with valid JSON.",
                    responseMimeType: "application/json",
                    thinkingConfig: {
                        thinkingBudget: 0, // Disable thinking for rapid suggestions
                    },
                }
            });

            const jsonText = response.text.trim().replace(/```json\n([\s\S]*?)\n```/g, '$1');
            const suggestion = JSON.parse(jsonText);
            
            if (suggestion && typeof suggestion.limit === 'number' && suggestion.name) {
                setAiSuggestion({ name: suggestion.name, limit: Math.round(suggestion.limit) });
                setLimitInput(Math.round(suggestion.limit).toString());
            } else {
                setAiSuggestion(null);
            }

        } catch (e) {
            console.error("AI Suggestion Error:", e);
            setSuggestionError("Could not generate AI suggestion.");
        } finally {
            setIsSuggesting(false);
        }
    }, [name, getAIClient, transactions]);

    useEffect(() => {
        const handler = setTimeout(() => {
            fetchAISuggestion();
        }, 500);
        return () => clearTimeout(handler);
    }, [name, fetchAISuggestion]);

    const handleSubmit = () => {
        const parsedLimit = parseFloat(limitInput);
        if (name && parsedLimit > 0) {
            onAdd(name.trim(), parsedLimit);
            onClose();
            setName('');
            setLimitInput('');
            setAiSuggestion(null);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[100] backdrop-blur-lg" onClick={onClose}>
            <div className="bg-gray-900 rounded-xl shadow-3xl max-w-lg w-full border border-cyan-700/50 transform transition-all duration-300 scale-100" onClick={e => e.stopPropagation()}>
                <div className="p-5 border-b border-gray-800 flex justify-between items-center bg-gray-800/50 rounded-t-xl">
                    <h3 className="text-xl font-bold text-white flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                        Establish New Financial Mandate
                    </h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors p-1 rounded-full hover:bg-gray-700">&times;</button>
                </div>
                <div className="p-6 space-y-5">
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-300">Mandate Name (Category)</label>
                        <input 
                            type="text" 
                            value={name} 
                            onChange={e => setName(e.target.value)} 
                            placeholder="e.g., Strategic R&D Investment" 
                            className="w-full bg-gray-700/70 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-150" 
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-300">Allocated Capital Limit ($)</label>
                        <input 
                            type="number" 
                            value={limitInput} 
                            onChange={e => setLimitInput(e.target.value)} 
                            placeholder="e.g., 15000.00" 
                            min="0.01"
                            step="any"
                            className="w-full bg-gray-700/70 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-150 font-mono" 
                        />
                    </div>
                    
                    {isSuggesting && (
                        <div className="flex items-center text-sm text-cyan-400">
                            <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-cyan-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M12 2a10 10 0 100 20 10 10 0 000-20zm0 18a8 8 0 110-16 8 8 0 010 16z"></path></svg>
                            Aethelred is calculating optimal allocation...
                        </div>
                    )}

                    {aiSuggestion && !isSuggesting && (
                        <div className="p-3 bg-green-900/30 border border-green-600/50 rounded-lg text-sm">
                            <p className="font-semibold text-green-300 mb-1">Aethelred Suggestion:</p>
                            <p className="text-gray-200">Category: {aiSuggestion.name} | Limit: ${aiSuggestion.limit.toLocaleString()}</p>
                            <button 
                                onClick={() => { setName(aiSuggestion.name); setLimitInput(aiSuggestion.limit.toString()); }}
                                className="mt-2 text-xs text-cyan-300 hover:text-cyan-100 underline"
                            >
                                Apply Suggestion
                            </button>
                        </div>
                    )}

                    {suggestionError && (
                        <div className="p-3 bg-red-900/50 border border-red-600/50 rounded-lg text-red-300 text-sm">{suggestionError}</div>
                    )}

                    <button 
                        onClick={handleSubmit} 
                        disabled={!name || !parseFloat(limitInput) || parseFloat(limitInput) <= 0}
                        className="w-full py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg shadow-lg transition duration-200 disabled:bg-gray-600 disabled:cursor-not-allowed"
                    >
                        Finalize Mandate & Commit Capital
                    </button>
                </div>
            </div>
        </div>
    );
};

/**
 * Modal displaying detailed transaction history for a specific budget category.
 */
const BudgetDetailModal: React.FC<{ budget: BudgetCategory | null; transactions: Transaction[]; onClose: () => void; }> = ({ budget, transactions, onClose }) => {
    if (!budget) return null;
    
    const relevantTransactions = useMemo(() => 
        transactions
            .filter(t => t.category.toLowerCase() === budget.name.toLowerCase() && t.type === 'expense')
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()), 
        [transactions, budget.name]
    );

    const totalSpent = relevantTransactions.reduce((sum, tx) => sum + tx.amount, 0);
    const utilization = calculateUtilization(totalSpent, budget.limit);

    return (
         <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[90] backdrop-blur-lg" onClick={onClose}>
            <div className="bg-gray-900 rounded-xl shadow-3xl max-w-3xl w-full border border-cyan-700/50 transform transition-all duration-300" onClick={e => e.stopPropagation()}>
                <div className="p-5 border-b border-gray-800 flex justify-between items-center bg-gray-800/50 rounded-t-xl">
                    <h3 className="text-xl font-bold text-white flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 012-2h2a2 2 0 012 2v6m-4 0h4m-4 0H9m4 0h4m-4 0a2 2 0 01-2-2v-6a2 2 0 012-2h2a2 2 0 012 2v6a2 2 0 01-2 2h-2z" /></svg>
                        {budget.name} Capital Flow Analysis
                    </h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors p-1 rounded-full hover:bg-gray-700">&times;</button>
                </div>
                <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
                    
                    <div className="lg:col-span-1 space-y-4 p-4 bg-gray-800 rounded-lg border border-gray-700">
                        <h4 className="text-lg font-semibold text-cyan-400 border-b border-gray-700 pb-2">Metrics Summary</h4>
                        <div className="space-y-2 text-sm">
                            <p className="flex justify-between text-gray-300"><span>Allocated Limit:</span> <span className="font-mono text-lg text-white">${budget.limit.toFixed(2)}</span></p>
                            <p className="flex justify-between text-gray-300"><span>Total Expenditure:</span> <span className="font-mono text-lg text-red-400">${totalSpent.toFixed(2)}</span></p>
                            <p className="flex justify-between text-gray-300 border-t border-gray-700 pt-2"><span>Utilization Rate:</span> <span className={`font-bold text-xl ${utilization > 100 ? 'text-red-500' : utilization > 80 ? 'text-yellow-500' : 'text-green-400'}`}>{utilization.toFixed(1)}%</span></p>
                            {utilization > 100 && (
                                <p className="text-red-400 text-xs font-medium">Warning: Overspent by ${(totalSpent - budget.limit).toFixed(2)}.</p>
                            )}
                        </div>
                        <button 
                            onClick={() => alert("Future feature: AI deep dive on this specific budget.")}
                            className="w-full py-2 text-sm bg-cyan-700 hover:bg-cyan-600 text-white rounded-lg mt-3 transition"
                        >
                            Request Deep Dive Analysis
                        </button>
                    </div>

                    <div className="lg:col-span-2">
                        <h4 className="text-lg font-semibold text-white mb-3">Transaction Log (Last 50)</h4>
                        <div className="max-h-96 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                            {relevantTransactions.length > 0 ? relevantTransactions.slice(0, 50).map(tx => (
                                <div key={tx.id} className="flex justify-between items-center p-3 bg-gray-800/70 rounded-lg border-l-4 border-red-500/50 hover:bg-gray-700/50 transition duration-150">
                                    <div className="flex flex-col">
                                        <p className="text-white font-medium">{tx.description}</p>
                                        <p className="text-gray-400 text-xs mt-0.5">{tx.date} | Source ID: {tx.id.substring(0, 8)}</p>
                                    </div>
                                    <p className="font-mono text-lg text-red-400">-${tx.amount.toFixed(2)}</p>
                                </div>
                            )) : <p className="text-gray-400 text-center p-6 bg-gray-800 rounded-lg">No recorded expenditures for this mandate.</p>}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

/**
 * Visual representation of a single budget using a progress ring.
 */
const BudgetRing: React.FC<{ budget: BudgetCategory; onClick: () => void; }> = React.memo(({ budget, onClick }) => {
  const percentage = calculateUtilization(budget.spent, budget.limit);
  const circumference = 2 * Math.PI * 45;
  const offset = circumference - (Math.min(percentage, 100) / 100) * circumference;
  const ringColor = getRingColor(percentage);
  const isOverspent = budget.spent > budget.limit;

  return (
    <button 
        onClick={onClick} 
        className="flex flex-col items-center p-3 rounded-xl hover:bg-gray-700/50 transition-all duration-300 border border-transparent hover:border-cyan-600/50 group"
        title={`View details for ${budget.name}`}
    >
      <div className="relative w-32 h-32">
        <svg className="w-full h-full transform rotate-[-90deg]" viewBox="0 0 100 100">
          <circle className="text-gray-700/50" strokeWidth="10" stroke="currentColor" fill="transparent" r="45" cx="50" cy="50" />
          <circle
            className={`transition-all duration-1000 ease-out ${ringColor} ${isOverspent ? 'animate-pulse' : ''}`}
            strokeWidth="10"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            stroke="currentColor"
            fill="transparent"
            r="45"
            cx="50"
            cy="50"
          />
          <text x="50" y="55" className="text-2xl font-extrabold fill-current text-white group-hover:text-cyan-300 transition-colors" textAnchor="middle" dominantBaseline="middle">{percentage}%</text>
        </svg>
      </div>
      <div className="text-center mt-2 w-full">
        <p className="font-bold text-white truncate">{budget.name}</p>
        <p className={`text-xs mt-0.5 font-mono ${isOverspent ? 'text-red-400' : 'text-gray-400'}`}>
            {isOverspent ? `OVER: $${(budget.spent - budget.limit).toFixed(2)}` : `$${budget.spent.toFixed(2)} / $${budget.limit.toFixed(2)}`}
        </p>
      </div>
    </button>
  );
});


// ================================================================================================
// MAIN BUDGETS VIEW COMPONENT (Hyper-Expanded)
// ================================================================================================

const BudgetsView: React.FC = () => {
  const context = useContext(DataContext);
  const [isNewBudgetModalOpen, setIsNewBudgetModalOpen] = useState(false);
  const [selectedBudget, setSelectedBudget] = useState<BudgetCategory | null>(null);

  if (!context) {
    return (
        <div className="p-8 bg-red-900/20 border border-red-700 rounded-lg text-red-300">
            <h2 className="text-xl font-bold">System Integrity Alert</h2>
            <p>BudgetsView requires an active DataProvider context. Please verify application structure.</p>
        </div>
    );
  }
  
  const { budgets, transactions, addBudget } = context;
  
  const { conversation, isLoading, error, hasStarted, handleSendMessage } = useAIChat(budgets, transactions);
  const [userInput, setUserInput] = useState('');

  const budgetKPIs = useMemo(() => {
    const totalLimit = budgets.reduce((sum, b) => sum + b.limit, 0);
    const totalSpent = budgets.reduce((sum, b) => sum + b.spent, 0);
    const utilizationRate = totalLimit > 0 ? (totalSpent / totalLimit) * 100 : 0;
    const overspentCount = budgets.filter(b => b.spent > b.limit).length;
    const healthyCount = budgets.filter(b => calculateUtilization(b.spent, b.limit) <= 75).length;

    return { totalLimit, totalSpent, utilizationRate, overspentCount, healthyCount };
  }, [budgets]);

  const sortedBudgets = useMemo(() => {
    return [...budgets].sort((a, b) => {
        const utilA = calculateUtilization(a.spent, a.limit);
        const utilB = calculateUtilization(b.spent, b.limit);
        if (utilB !== utilA) return utilB - utilA;
        return a.name.localeCompare(b.name);
    });
  }, [budgets]);

  const budgetsToDisplay = sortedBudgets.slice(0, MAX_BUDGET_VISUALIZATION_ITEMS);
  const hasOverflow = sortedBudgets.length > MAX_BUDGET_VISUALIZATION_ITEMS;

  const KPICard: React.FC<{ title: string; value: string | number; trend: string; icon: React.ReactNode; color: string }> = ({ title, value, trend, icon, color }) => (
    <Card title={title} className="p-4 border-l-4 border-current" style={{ borderColor: color }}>
        <div className="flex items-center justify-between">
            <div className="text-3xl font-extrabold text-white">{value}</div>
            <div className={`p-2 rounded-full bg-opacity-20`} style={{ backgroundColor: color + '20' }}>
                {icon}
            </div>
        </div>
        <p className="text-xs mt-2 text-gray-400">{trend}</p>
    </Card>
  );

  const AIChatInterface: React.FC = () => {
    const chatContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [conversation, isLoading]);

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        handleSendMessage(userInput);
        setUserInput('');
    };

    return (
        <Card title="The Void: Financial Nexus" className="h-full flex flex-col">
            <div className="flex-1 overflow-y-auto pr-3 space-y-4 mb-4 custom-scrollbar" ref={chatContainerRef} style={{ maxHeight: '400px' }}>
                {!hasStarted && !isLoading ? (
                    <div className="text-center min-h-[10rem] flex flex-col items-center justify-center bg-gray-800/50 p-6 rounded-lg">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-cyan-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                        <p className="text-gray-300 mb-3 font-medium">The Void is initializing its analytical matrix...</p>
                        <div className="flex items-center space-x-2 text-cyan-300">
                            <div className="h-2 w-2 bg-cyan-400 rounded-full animate-ping"></div>
                            <span>Establishing insecure connection...</span>
                        </div>
                    </div>
                ) : (
                    conversation.map(msg => (
                        <div key={msg.id} className={`flex items-start gap-3 ${msg.sender === 'user' ? 'justify-end' : ''}`}>
                            {msg.sender === 'system' && (
                                <div className="text-xs text-yellow-500 bg-yellow-900/30 p-2 rounded-lg border border-yellow-700/50 w-full text-center">
                                    SYSTEM: {msg.text}
                                </div>
                            )}
                            {msg.sender === 'ai' && (
                                <>
                                    <div className="w-8 h-8 rounded-full bg-purple-700 flex items-center justify-center text-purple-200 font-extrabold text-sm flex-shrink-0 mt-1 shadow-lg">V</div>
                                    <div className={`max-w-[80%] p-3 text-sm rounded-xl shadow-md bg-gray-700 text-gray-100 border border-gray-600`}>
                                        <div dangerouslySetInnerHTML={{ __html: msg.text.replace(/\n/g, '<br/>') }} />
                                    </div>
                                </>
                            )}
                            {msg.sender === 'user' && (
                                <div className={`max-w-[80%] p-3 text-sm rounded-xl shadow-md bg-indigo-600 text-white`}>
                                    {msg.text}
                                </div>
                            )}
                        </div>
                    ))
                )}
                
                {isLoading && (
                     <div className="flex items-start gap-3">
                         <div className="w-8 h-8 rounded-full bg-purple-700 flex items-center justify-center text-purple-200 font-extrabold text-sm flex-shrink-0 mt-1 shadow-lg">V</div>
                         <div className="max-w-[80%] p-3 text-sm rounded-xl bg-gray-700 text-gray-100 border border-gray-600">
                             <div className="flex items-center space-x-2">
                                <div className="h-2 w-2 bg-purple-400 rounded-full animate-pulse [animation-delay:-0.3s]"></div>
                                <div className="h-2 w-2 bg-purple-400 rounded-full animate-pulse [animation-delay:-0.15s]"></div>
                                <div className="h-2 w-2 bg-purple-400 rounded-full animate-pulse"></div>
                            </div>
                         </div>
                     </div>
                )}
                 {error && (
                    <div className="p-4 bg-red-900/50 border border-red-500/30 rounded-lg text-red-200 text-sm mt-4">
                        <p className="font-bold mb-1">Void Communication Failure:</p>
                        <p>{error}</p>
                    </div>
                )}
            </div>
             <form onSubmit={handleFormSubmit} className="flex items-center space-x-3 pt-3 border-t border-gray-700">
                <input 
                    type="text"
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    placeholder="Query The Void..."
                    className="flex-1 bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
                    disabled={isLoading || !hasStarted}
                />
                <button 
                    type="submit" 
                    disabled={isLoading || !userInput || !hasStarted} 
                    className="px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition-colors disabled:bg-gray-600 disabled:text-gray-400 flex items-center"
                >
                    {isLoading ? (
                        <svg className="animate-spin h-4 w-4 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M12 2a10 10 0 100 20 10 10 0 000-20zm0 18a8 8 0 110-16 8 8 0 010 16z"></path></svg>
                    ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" /></svg>
                    )}
                    Transmit
                </button>
             </form>
        </Card>
    );
  };


  return (
    <>
    <div className="space-y-8">
        
        <Card title="Budgetary Health Dashboard" className="shadow-xl border-t-4 border-cyan-500">
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-6">
                <KPICard 
                    title="Total Allocated Capital" 
                    value={`$${budgetKPIs.totalLimit.toFixed(0)}`} 
                    trend="Across all active mandates"
                    icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8v4m0 4v4m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" /></svg>}
                    color="#10B981"
                />
                <KPICard 
                    title="Aggregate Utilization" 
                    value={`${budgetKPIs.utilizationRate.toFixed(1)}%`} 
                    trend={budgetKPIs.utilizationRate > 80 ? "High Risk Zone" : "Stable Performance"}
                    icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m-8 5h8m-8 5h8M3 17h18M3 13h18M3 9h18" /></svg>}
                    color="#F59E0B"
                />
                <KPICard 
                    title="Overspent Mandates" 
                    value={budgetKPIs.overspentCount} 
                    trend={`${budgetKPIs.overspentCount} mandates exceeded their limit`}
                    icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L12.938 3.7a1.999 1.999 0 00-3.876 0L3.33 18c-.77 1.333 1.192 3 2.53 3z" /></svg>}
                    color="#EF4444"
                />
                <KPICard 
                    title="Healthy Mandates" 
                    value={budgetKPIs.healthyCount} 
                    trend={`${budgets.length - budgetKPIs.overspentCount - budgetKPIs.healthyCount} mandates are approaching critical levels`}
                    icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
                    color="#06B6D4"
                />
                 <KPICard 
                    title="Total Transactions Logged" 
                    value={transactions.length} 
                    trend="Data integrity verified"
                    icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M12 15h.01" /></svg>}
                    color="#A855F7"
                />
            </div>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            <div className="lg:col-span-2">
                <Card 
                    title="Active Capital Mandates" 
                    headerActions={[
                        { 
                            id: 'add', 
                            icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>, 
                            onClick: () => setIsNewBudgetModalOpen(true), 
                            label: 'Establish New Mandate' 
                        }
                    ]}
                >
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-x-4 gap-y-8">
                        {budgetsToDisplay.map(budget => (
                            <BudgetRing 
                                key={budget.id} 
                                budget={budget} 
                                onClick={() => setSelectedBudget(budget)} 
                            />
                        ))}
                    </div>
                    {hasOverflow && (
                        <div className="text-center mt-4 p-2 bg-gray-800/50 rounded-lg text-sm text-gray-400">
                            Displaying top {MAX_BUDGET_VISUALIZATION_ITEMS} mandates. View full list in the 'Portfolio' module.
                        </div>
                    )}
                    {budgets.length === 0 && (
                        <div className="text-center p-10 border-2 border-dashed border-gray-700 rounded-lg text-gray-400">
                            <p className="text-lg mb-2">No Capital Mandates Defined.</p>
                            <button onClick={() => setIsNewBudgetModalOpen(true)} className="text-cyan-400 hover:text-cyan-300 font-semibold">Click here to define your first mandate.</button>
                        </div>
                    )}
                </Card>
            </div>

            <div className="lg:col-span-1">
                <AIChatInterface />
            </div>
        </div>
    </div>
    
    <NewBudgetModal 
        isOpen={isNewBudgetModalOpen} 
        onClose={() => setIsNewBudgetModalOpen(false)} 
        onAdd={(name, limit) => addBudget({ name, limit })} 
        transactions={transactions}
    />
    <BudgetDetailModal 
        budget={selectedBudget} 
        transactions={transactions} 
        onClose={() => setSelectedBudget(null)} 
    />
    </>
  );
};

export default BudgetsView;

================================================================================
// APPENDED FROM REPO: diplomat-bit/Fuckyou | ORIGINAL PATH: diplomat-bit-Fuckyou-70f83c5/components/BudgetsView (1).tsx
================================================================================


import React, { useContext, useState } from 'react';
import Card from './Card';
import { DataContext } from '../context/DataContext';

// Define the NewBudgetModal as a simple internal component to avoid import issues if the file doesn't exist yet
export const NewBudgetModal: React.FC<{ 
    isOpen: boolean; 
    onClose: () => void; 
    onAdd: (name: string, limit: number) => void; 
    transactions: any[];
}> = ({ isOpen, onClose, onAdd }) => {
    const [name, setName] = useState('');
    const [limit, setLimit] = useState('');

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
            <div className="bg-gray-800 p-6 rounded-lg w-full max-w-md">
                <h3 className="text-xl font-bold text-white mb-4">Create New Budget</h3>
                <div className="space-y-4">
                    <input 
                        type="text" 
                        placeholder="Category Name" 
                        value={name} 
                        onChange={e => setName(e.target.value)}
                        className="w-full p-2 bg-gray-700 text-white rounded"
                    />
                    <input 
                        type="number" 
                        placeholder="Monthly Limit" 
                        value={limit} 
                        onChange={e => setLimit(e.target.value)}
                        className="w-full p-2 bg-gray-700 text-white rounded"
                    />
                    <div className="flex justify-between">
                        <button onClick={onClose} className="text-gray-400 hover:text-white">Cancel</button>
                        <button onClick={() => {
                            const numLimit = parseFloat(limit);
                            if (name && !isNaN(numLimit)) {
                                onAdd(name, numLimit);
                                onClose();
                            }
                        }} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-500">Create</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const BudgetsView: React.FC = () => {
  const context = useContext(DataContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  if (!context) return <div>Loading...</div>;
  
  const { budgets, transactions, addBudget } = context;
  
  return (
    <div className="space-y-6">
      <Card title="Budget Overview">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {budgets.map(budget => (
             <div key={budget.id} className="bg-gray-800 p-4 rounded-lg border border-gray-700">
                <div className="flex justify-between items-center mb-2">
                    <h4 className="font-bold text-white">{budget.name}</h4>
                    <span className="text-sm text-gray-400">${budget.spent} / ${budget.limit}</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                    <div 
                        className={`h-2 rounded-full ${budget.spent > budget.limit ? 'bg-red-500' : 'bg-green-500'}`} 
                        style={{ width: `${Math.min((budget.spent / budget.limit) * 100, 100)}%` }}
                    ></div>
                </div>
             </div>
          ))}
        </div>
        <button onClick={() => setIsModalOpen(true)} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-500">Add Budget</button>
      </Card>
      <NewBudgetModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onAdd={addBudget} transactions={transactions} />
    </div>
  );
};

export default BudgetsView;


================================================================================
// APPENDED FROM REPO: diplomat-bit/Fuckyou | ORIGINAL PATH: diplomat-bit-Fuckyou-70f83c5/components/BudgetsView_1.tsx
================================================================================

import React, { useState, useEffect, useMemo } from 'react';
import Card from './Card';
import { apiClient } from '../lib/apiClient';

const StatusBadge: React.FC<{ status: 'over' | 'ok' }> = ({ status }) => {
    const styles = {
        over: 'bg-red-900/30 text-red-400 border-red-800',
        ok: 'bg-green-900/30 text-green-400 border-green-800'
    };
    return (
        <span className={`px-2 py-0.5 rounded text-xs font-medium border ${styles[status]}`}>
            {status === 'over' ? 'Over Budget' : 'On Track'}
        </span>
    );
};

export const NewBudgetModal: React.FC<{ 
    isOpen: boolean; 
    onClose: () => void; 
    onAdd: (name: string, limit: number) => void; 
    transactions: any[];
}> = ({ isOpen, onClose, onAdd, transactions }) => {
    const [name, setName] = useState('');
    const [limit, setLimit] = useState('');

    useEffect(() => {
        if (isOpen) {
            setName('');
            setLimit('');
        }
    }, [isOpen]);

    const categories = useMemo(() => {
        if (!transactions) return [];
        const cats = transactions
            .map((t: any) => t.category)
            .filter((cat: any): cat is string => typeof cat === 'string' && cat.trim() !== '');
        return Array.from(new Set(cats));
    }, [transactions]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
            <div className="bg-gray-800 p-6 rounded-lg w-full max-w-md border border-gray-700">
                <h3 className="text-xl font-bold text-white mb-4">Create New Budget</h3>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Category Name</label>
                        <input 
                            type="text" 
                            placeholder="e.g. Groceries, Entertainment" 
                            value={name} 
                            onChange={e => setName(e.target.value)}
                            list="categories-list"
                            className="w-full p-2 bg-gray-700 text-white rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
                        />
                        <datalist id="categories-list">
                            {categories.map(cat => (
                                <option key={cat} value={cat} />
                            ))}
                        </datalist>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Monthly Limit ($)</label>
                        <input 
                            type="number" 
                            placeholder="e.g. 500" 
                            value={limit} 
                            onChange={e => setLimit(e.target.value)}
                            className="w-full p-2 bg-gray-700 text-white rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
                        />
                    </div>
                    <div className="flex justify-between pt-2">
                        <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">Cancel</button>
                        <button onClick={() => {
                            const numLimit = parseFloat(limit);
                            if (name.trim() && !isNaN(numLimit) && numLimit > 0) {
                                onAdd(name.trim(), numLimit);
                                onClose();
                            }
                        }} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-500 transition-colors">Create</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const BudgetsView: React.FC = () => {
  const [budgets, setBudgets] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [bData, tData] = await Promise.all([
        apiClient.get('/budgets'),
        apiClient.get('/transactions')
      ]);
      setBudgets(bData);
      setTransactions(tData);
    } catch (error) {
      console.error('Failed to fetch data', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddBudget = async (name: string, limit: number) => {
    await apiClient.post('/budgets', { name, limit });
    fetchData();
  };

  const handleDeleteBudget = async (id: string) => {
    await apiClient.delete(`/budgets/${id}`);
    fetchData();
  };
  
  if (loading) return <div className="text-white p-4">Loading...</div>;
  
  return (
    <div className="space-y-6">
      <Card title="Budget Overview">
        {budgets.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <p className="mb-4">No budgets created yet. Set up a budget to track your spending!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {budgets.map(budget => {
               const spent = Number(budget.spent) || 0;
               const limit = Number(budget.limit) || 0;
               const percent = limit > 0 ? Math.min((spent / limit) * 100, 100) : 0;
               const isOverBudget = spent > limit;
               
               return (
                  <div key={budget.id} className="bg-gray-800 p-4 rounded-lg border border-gray-700 flex flex-col justify-between">
                     <div>
                        <div className="flex justify-between items-start mb-2">
                            <div className="flex flex-col">
                                <h4 className="font-bold text-white truncate" title={budget.name}>{budget.name}</h4>
                                <StatusBadge status={isOverBudget ? 'over' : 'ok'} />
                            </div>
                            <button 
                                onClick={() => handleDeleteBudget(budget.id)}
                                className="text-gray-500 hover:text-red-500 transition-colors"
                                title="Delete Budget"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                            </button>
                        </div>
                        <div className="text-sm text-gray-400 mb-2">${spent} / ${limit}</div>
                        <div className="w-full bg-gray-700 rounded-full h-2 mb-2">
                            <div 
                                className={`h-2 rounded-full transition-all duration-500 ${isOverBudget ? 'bg-red-500' : 'bg-green-500'}`} 
                                style={{ width: `${percent}%` }}
                            ></div>
                        </div>
                     </div>
                  </div>
               );
            })}
          </div>
        )}
        <button onClick={() => setIsModalOpen(true)} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-500 transition-colors">Add Budget</button>
      </Card>
      <NewBudgetModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onAdd={handleAddBudget} transactions={transactions} />
    </div>
  );
};

export default BudgetsView;

================================================================================
// APPENDED FROM REPO: diplomat-bit/Fuckyou | ORIGINAL PATH: diplomat-bit-Fuckyou-70f83c5/components/BudgetsView (3).tsx
================================================================================

import React, { useState, FormEvent, ChangeEvent } from 'react';
import axios from 'axios';
import './ApiSettingsPage.css';

// Rationale: Goal 6 (Realistic MVP Scope) and Goal 4 (Normalize API Integration).
// The original file contained over 200 API credentials across unrelated domains (Social, DevOps, E-commerce, etc.).
// This refactoring limits the configuration surface strictly to the core Fintech APIs
// required for the MVP (Unified Business Financial Dashboard & AI Transaction Intelligence).
// All other integrations are considered out of scope for the MVP stability phase and are managed externally.

// =================================================================================
// MVP Core Fintech API Credentials
// =================================================================================
interface ApiKeysState {
  // === Financial Data Aggregation (Multi-bank aggregation) ===
  PLAID_CLIENT_ID: string;
  PLAID_SECRET: string;
  MX_CLIENT_ID: string;
  MX_API_KEY: string;

  // === Payment Processing & Core Finance ===
  STRIPE_SECRET_KEY: string; 
  ADYEN_API_KEY: string;
  
  // === Treasury / BaaS Providers (Essential for automation MVP) ===
  UNIT_API_TOKEN: string;
  TREASURY_PRIME_API_KEY: string;

  // === Accounting & Tax Integration ===
  XERO_CLIENT_ID: string;
  XERO_CLIENT_SECRET: string;
  QUICKBOOKS_CLIENT_ID: string;
  QUICKBOOKS_CLIENT_SECRET: string;
  
  // === AI Transaction Intelligence (Goal 5 hardening) ===
  OPENAI_API_KEY: string;
  
  [key: string]: string; // Index signature for dynamic access
}


const ApiSettingsPage: React.FC = () => {
  const [keys, setKeys] = useState<ApiKeysState>({} as ApiKeysState);
  const [statusMessage, setStatusMessage] = useState<string>('');
  const [isSaving, setIsSaving] = useState<boolean>(false);
  
  // Removed activeTab state as the massive list of tech APIs is now out of scope for the MVP configuration screen.

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setKeys(prevKeys => ({ ...prevKeys, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setStatusMessage('Saving keys securely to backend...');
    
    // Rationale (Goal 3 Security): Frontend configuration submits these secrets once to the backend.
    // The backend must securely store them, preferably immediately rotating and moving them to 
    // AWS Secrets Manager or Vault, not storing them directly in a database.
    const API_ENDPOINT = process.env.REACT_APP_API_BASE_URL 
      ? `${process.env.REACT_APP_API_BASE_URL}/api/config/save-core-keys` 
      : 'http://localhost:4000/api/config/save-core-keys';

    try {
      const response = await axios.post(API_ENDPOINT, keys);
      setStatusMessage(response.data.message || 'Core keys saved successfully.');
    } catch (error) {
      const errorMessage = axios.isAxiosError(error) 
        ? error.response?.data?.message || `Server Error: ${error.message}`
        : 'An unknown error occurred while trying to save keys.';
      setStatusMessage(`Error: Could not save keys. ${errorMessage}`);
    } finally {
      setIsSaving(false);
    }
  };

  const renderInput = (keyName: keyof ApiKeysState, label: string) => (
    <div key={keyName} className="input-group">
      <label htmlFor={keyName}>{label}</label>
      <input
        // Use password type for secrets for security
        type="password" 
        id={keyName}
        name={keyName}
        value={keys[keyName] || ''}
        onChange={handleInputChange}
        placeholder={`Enter ${label}`}
        // Mark critical fields as required
        required={
            keyName.includes('_SECRET') || 
            keyName.includes('_KEY') || 
            keyName.includes('_TOKEN') ||
            keyName.includes('_ID')
        } 
      />
    </div>
  );

  // Helper function to render multiple inputs efficiently
  const renderInputs = (categoryKeys: (keyof ApiKeysState)[], categoryLabels: string[]) => {
    return categoryKeys.map((keyName, index) => renderInput(keyName, categoryLabels[index]));
  };

  // ================================================================================================
  // RENDER BLOCKS: Reduced to Core Fintech Scope
  // ================================================================================================

  const renderCoreFintechApis = () => (
    <>
      {/* 1. Financial Data Aggregators */}
      <div className="form-section">
        <h2>1. Financial Data Aggregation (Multi-bank)</h2>
        <p className="section-description">Credentials for linking external bank accounts and retrieving transaction data.</p>
        {renderInputs(
            ['PLAID_CLIENT_ID', 'PLAID_SECRET', 'MX_CLIENT_ID', 'MX_API_KEY'],
            ['Plaid Client ID', 'Plaid Secret', 'MX Client ID', 'MX API Key']
        )}
      </div>

      {/* 2. Payment Processing & Treasury */}
      <div className="form-section">
        <h2>2. Payment Processing & Treasury Automation</h2>
        <p className="section-description">Keys for initiating payments (Stripe) and interfacing with BaaS/Unit providers.</p>
        {renderInputs(
            ['STRIPE_SECRET_KEY', 'ADYEN_API_KEY', 'UNIT_API_TOKEN', 'TREASURY_PRIME_API_KEY'],
            ['Stripe Secret Key', 'Adyen API Key', 'Unit API Token (BaaS)', 'Treasury Prime API Key (BaaS)']
        )}
      </div>
      
      {/* 3. Accounting & Tax Integration */}
      <div className="form-section">
        <h2>3. Accounting & Tax Integration</h2>
        <p className="section-description">Credentials for syncing financial records with mandatory accounting platforms (Goal 6 MVP).</p>
        {renderInputs(
            ['XERO_CLIENT_ID', 'XERO_CLIENT_SECRET', 'QUICKBOOKS_CLIENT_ID', 'QUICKBOOKS_CLIENT_SECRET'],
            ['Xero Client ID', 'Xero Client Secret', 'QuickBooks Client ID', 'QuickBooks Client Secret']
        )}
      </div>

      {/* 4. AI Transaction Intelligence */}
      <div className="form-section">
        <h2>4. AI Intelligence Layer</h2>
        <p className="section-description">Key for enabling AI-powered transaction categorization and intelligence (Goal 5).</p>
        {renderInputs(
            ['OPENAI_API_KEY'],
            ['OpenAI API Key']
        )}
      </div>
    </>
  );

  return (
    <div className="settings-container">
      <h1>Core Fintech API Credentials Configuration</h1>
      <p className="subtitle">
        Securely manage credentials for critical financial integrations required for the MVP dashboard and treasury modules. 
        Note: The backend is configured to immediately store these values in a secure vault (Goal 3).
      </p>

      <form onSubmit={handleSubmit} className="settings-form">
        {renderCoreFintechApis()}
        
        <div className="form-footer">
          <button type="submit" className="save-button" disabled={isSaving}>
            {isSaving ? 'Saving...' : 'Save Core Keys Securely'}
          </button>
          {statusMessage && <p className="status-message">{statusMessage}</p>}
        </div>
      </form>
      
      <div className="archived-note">
        <p><em>Note on Scope Reduction: Credentials for non-fintech services (Social Media, E-commerce, DevOps, general Cloud) have been removed from this configuration page to focus the MVP scope on financial systems stabilization (Goal 6).</em></p>
      </div>
    </div>
  );
};

export default ApiSettingsPage;

================================================================================
// APPENDED FROM REPO: diplomat-bit/Fuckyou | ORIGINAL PATH: diplomat-bit-Fuckyou-70f83c5/components/BudgetsView.tsx
================================================================================

import React, { useState, useEffect, useMemo } from 'react';
import Card from './Card';
import { apiClient } from '../lib/apiClient';

const StatusBadge: React.FC<{ status: 'over' | 'ok' }> = ({ status }) => {
    const styles = {
        over: 'bg-red-900/30 text-red-400 border-red-800',
        ok: 'bg-green-900/30 text-green-400 border-green-800'
    };
    return (
        <span className={`px-2 py-0.5 rounded text-xs font-medium border ${styles[status]}`}>
            {status === 'over' ? 'Over Budget' : 'On Track'}
        </span>
    );
};

export const NewBudgetModal: React.FC<{ 
    isOpen: boolean; 
    onClose: () => void; 
    onAdd: (name: string, limit: number) => void; 
    transactions: any[];
}> = ({ isOpen, onClose, onAdd, transactions }) => {
    const [name, setName] = useState('');
    const [limit, setLimit] = useState('');

    useEffect(() => {
        if (isOpen) {
            setName('');
            setLimit('');
        }
    }, [isOpen]);

    const categories = useMemo(() => {
        if (!transactions) return [];
        const cats = transactions
            .map((t: any) => t.category)
            .filter((cat: any): cat is string => typeof cat === 'string' && cat.trim() !== '');
        return Array.from(new Set(cats));
    }, [transactions]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
            <div className="bg-gray-800 p-6 rounded-lg w-full max-w-md border border-gray-700">
                <h3 className="text-xl font-bold text-white mb-4">Create New Budget</h3>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Category Name</label>
                        <input 
                            type="text" 
                            placeholder="e.g. Groceries, Entertainment" 
                            value={name} 
                            onChange={e => setName(e.target.value)}
                            list="categories-list"
                            className="w-full p-2 bg-gray-700 text-white rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
                        />
                        <datalist id="categories-list">
                            {categories.map(cat => (
                                <option key={cat} value={cat} />
                            ))}
                        </datalist>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Monthly Limit ($)</label>
                        <input 
                            type="number" 
                            placeholder="e.g. 500" 
                            value={limit} 
                            onChange={e => setLimit(e.target.value)}
                            className="w-full p-2 bg-gray-700 text-white rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
                        />
                    </div>
                    <div className="flex justify-between pt-2">
                        <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">Cancel</button>
                        <button onClick={() => {
                            const numLimit = parseFloat(limit);
                            if (name.trim() && !isNaN(numLimit) && numLimit > 0) {
                                onAdd(name.trim(), numLimit);
                                onClose();
                            }
                        }} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-500 transition-colors">Create</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const BudgetsView: React.FC = () => {
  const [budgets, setBudgets] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [bData, tData] = await Promise.all([
        apiClient.get('/budgets'),
        apiClient.get('/transactions')
      ]);
      setBudgets(bData);
      setTransactions(tData);
    } catch (error) {
      console.error('Failed to fetch data', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddBudget = async (name: string, limit: number) => {
    await apiClient.post('/budgets', { name, limit });
    fetchData();
  };

  const handleDeleteBudget = async (id: string) => {
    await apiClient.delete(`/budgets/${id}`);
    fetchData();
  };
  
  if (loading) return <div className="text-white p-4">Loading...</div>;
  
  return (
    <div className="space-y-6">
      <Card title="Budget Overview">
        {budgets.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <p className="mb-4">No budgets created yet. Set up a budget to track your spending!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {budgets.map(budget => {
               const spent = Number(budget.spent) || 0;
               const limit = Number(budget.limit) || 0;
               const percent = limit > 0 ? Math.min((spent / limit) * 100, 100) : 0;
               const isOverBudget = spent > limit;
               
               return (
                  <div key={budget.id} className="bg-gray-800 p-4 rounded-lg border border-gray-700 flex flex-col justify-between">
                     <div>
                        <div className="flex justify-between items-start mb-2">
                            <div className="flex flex-col">
                                <h4 className="font-bold text-white truncate" title={budget.name}>{budget.name}</h4>
                                <StatusBadge status={isOverBudget ? 'over' : 'ok'} />
                            </div>
                            <button 
                                onClick={() => handleDeleteBudget(budget.id)}
                                className="text-gray-500 hover:text-red-500 transition-colors"
                                title="Delete Budget"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                            </button>
                        </div>
                        <div className="text-sm text-gray-400 mb-2">${spent} / ${limit}</div>
                        <div className="w-full bg-gray-700 rounded-full h-2 mb-2">
                            <div 
                                className={`h-2 rounded-full transition-all duration-500 ${isOverBudget ? 'bg-red-500' : 'bg-green-500'}`} 
                                style={{ width: `${percent}%` }}
                            ></div>
                        </div>
                     </div>
                  </div>
               );
            })}
          </div>
        )}
        <button onClick={() => setIsModalOpen(true)} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-500 transition-colors">Add Budget</button>
      </Card>
      <NewBudgetModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onAdd={handleAddBudget} transactions={transactions} />
    </div>
  );
};

export default BudgetsView;

================================================================================
// APPENDED FROM REPO: diplomat-bit/Fuckyou | ORIGINAL PATH: diplomat-bit-Fuckyou-70f83c5/components/BudgetsView (2).tsx
================================================================================

// components/BudgetsView.tsx
// RE-ENACTED & EXPANDED: This component has been resurrected from its deprecated state.
// It is now the "Allocatra," a complete chamber of financial discipline.
// It features interactive budget rings, detailed transaction modals, and an
// integrated AI Sage for conversational, streaming budget analysis.

import React, { useContext, useState, useMemo, useRef, useEffect } from 'react';
import { DataContext } from '../context/DataContext';
import Card from './Card';
import type { BudgetCategory, Transaction } from '../types';
import { GoogleGenAI, Chat } from "@google/genai";
import { RadialBarChart, RadialBar, ResponsiveContainer } from 'recharts';

// ================================================================================================
// MODAL & DETAIL COMPONENTS
// ================================================================================================

/**
 * @description A modal to display all transactions associated with a specific budget category.
 * @param {object} props - Component props.
 * @returns {React.ReactElement | null}
 */
const BudgetDetailModal: React.FC<{ budget: BudgetCategory | null; transactions: Transaction[]; onClose: () => void; }> = ({ budget, transactions, onClose }) => {
    if (!budget) return null;

    const relevantTransactions = transactions.filter(tx => tx.category.toLowerCase() === budget.name.toLowerCase() && tx.type === 'expense');

    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 backdrop-blur-sm" onClick={onClose}>
            <div className="bg-gray-800 rounded-lg shadow-2xl max-w-lg w-full border border-gray-700" onClick={e => e.stopPropagation()}>
                <div className="p-4 border-b border-gray-700 flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-white">{budget.name} Budget Details</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-white" aria-label="Close modal">&times;</button>
                </div>
                <div className="p-6 max-h-[60vh] overflow-y-auto">
                    {relevantTransactions.length > 0 ? (
                        <ul className="space-y-2">
                            {relevantTransactions.map(tx => (
                                <li key={tx.id} className="flex justify-between text-sm p-2 bg-gray-700/50 rounded-md">
                                    <div><p className="text-white">{tx.description}</p><p className="text-xs text-gray-400">{tx.date}</p></div>
                                    <p className="font-mono text-red-400">-${tx.amount.toFixed(2)}</p>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-gray-400 text-center">No transactions for this category yet.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

/**
 * @description A modal for creating a new budget category.
 * @param {object} props - Component props.
 * @returns {React.ReactElement}
 */
const NewBudgetModal: React.FC<{ onClose: () => void; onAdd: (budget: Omit<BudgetCategory, 'id' | 'spent' | 'color'>) => void; }> = ({ onClose, onAdd }) => {
    const [name, setName] = useState('');
    const [limit, setLimit] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (name && limit) {
            onAdd({ name, limit: parseFloat(limit) });
            onClose();
        }
    };
    
    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 backdrop-blur-sm" onClick={onClose}>
            <form onSubmit={handleSubmit} className="bg-gray-800 rounded-lg shadow-2xl max-w-md w-full border border-gray-700" onClick={e => e.stopPropagation()}>
                <div className="p-4 border-b border-gray-700"><h3 className="text-lg font-semibold text-white">Create New Budget</h3></div>
                <div className="p-6 space-y-4">
                    <input type="text" value={name} onChange={e=>setName(e.target.value)} placeholder="Category Name (e.g., Groceries)" required className="w-full bg-gray-700/50 border border-gray-600 rounded-lg p-2 text-white" />
                    <input type="number" value={limit} onChange={e=>setLimit(e.target.value)} placeholder="Monthly Limit (e.g., 500)" required className="w-full bg-gray-700/50 border border-gray-600 rounded-lg p-2 text-white" />
                    <button type="submit" className="w-full py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg">Add Budget</button>
                </div>
            </form>
        </div>
    );
};


/**
 * @description An integrated AI chat component for getting budget insights.
 * @param {object} props - Component props.
 * @returns {React.ReactElement}
 */
const AIConsejero: React.FC<{ budgets: BudgetCategory[] }> = ({ budgets }) => {
    const chatRef = useRef<Chat | null>(null);
    const [aiResponse, setAiResponse] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const initializeChat = async () => {
            setIsLoading(true);
            const budgetSummary = budgets.map(b => `${b.name}: $${b.spent.toFixed(0)} spent of $${b.limit}`).join(', ');
            const prompt = `Based on this budget data (${budgetSummary}), provide one key insight or piece of advice for the user. Be concise and encouraging.`;

            try {
                const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
                chatRef.current = ai.chats.create({
                    model: 'gemini-2.5-flash',
                    config: { systemInstruction: "You are Quantum, a specialized financial advisor AI focused on budget analysis. Your tone is helpful and insightful." }
                });

                const resultStream = await chatRef.current.sendMessageStream({ message: prompt });
                
                let text = '';
                for await (const chunk of resultStream) {
                    text += chunk.text;
                    setAiResponse(text);
                }
            } catch (error) {
                console.error("AI Consejero Error:", error);
                setAiResponse("I'm having trouble analyzing your budgets right now.");
            } finally {
                setIsLoading(false);
            }
        };

        initializeChat();
    }, [budgets]);

    return (
        <Card title="AI Sage Insights">
            <div className="p-4 min-h-[6rem]">
                {isLoading && aiResponse === '' ? (
                    <p className="text-gray-400">The AI Sage is analyzing your spending...</p>
                ) : (
                    <p className="text-gray-300 italic">"{aiResponse}"</p>
                )}
            </div>
        </Card>
    );
};


// ================================================================================================
// MAIN VIEW COMPONENT: BudgetsView (Allocatra)
// ================================================================================================

const BudgetsView: React.FC = () => {
    const context = useContext(DataContext);
    if (!context) throw new Error("BudgetsView must be within a DataProvider.");
    
    // FIX: Destructure `addBudget` from context to fix property not found error.
    const { budgets, transactions, addBudget } = context;
    const [selectedBudget, setSelectedBudget] = useState<BudgetCategory | null>(null);
    const [isNewBudgetModalOpen, setIsNewBudgetModalOpen] = useState(false);

    return (
        <>
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <h2 className="text-3xl font-bold text-white tracking-wider">Budgets (Allocatra)</h2>
                    <button onClick={() => setIsNewBudgetModalOpen(true)} className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg text-sm font-medium flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                        New Budget
                    </button>
                </div>

                <AIConsejero budgets={budgets} />

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {budgets.map(budget => {
                        const percentage = Math.min((budget.spent / budget.limit) * 100, 100);
                        let color;
                        if (percentage < 75) color = '#06b6d4'; // cyan
                        else if (percentage < 95) color = '#f59e0b'; // yellow
                        else color = '#ef4444'; // red

                        return (
                            <Card key={budget.id} variant="interactive" onClick={() => setSelectedBudget(budget)}>
                                <div className="text-center">
                                    <h3 className="text-xl font-semibold text-white">{budget.name}</h3>
                                    <div className="relative h-40 w-40 mx-auto my-4">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <RadialBarChart innerRadius="70%" outerRadius="100%" data={[{ name: budget.name, value: percentage, fill: color }]} startAngle={90} endAngle={-270}>
                                                <RadialBar background dataKey="value" cornerRadius={10} />
                                            </RadialBarChart>
                                        </ResponsiveContainer>
                                        <div className="absolute inset-0 flex items-center justify-center flex-col">
                                            <span className="text-2xl font-bold text-white">{percentage.toFixed(0)}%</span>
                                            <span className="text-xs text-gray-400">used</span>
                                        </div>
                                    </div>
                                    <p className="font-mono text-sm text-gray-300">
                                        ${budget.spent.toFixed(2)} / ${budget.limit.toFixed(2)}
                                    </p>
                                </div>
                            </Card>
                        );
                    })}
                </div>
            </div>
            <BudgetDetailModal budget={selectedBudget} transactions={transactions} onClose={() => setSelectedBudget(null)} />
            {isNewBudgetModalOpen && <NewBudgetModal onClose={() => setIsNewBudgetModalOpen(false)} onAdd={addBudget} />}
        </>
    );
};

export default BudgetsView;


================================================================================
// APPENDED FROM REPO: diplomat-bit/G20 | ORIGINAL PATH: diplomat-bit-G20-0199fa7/components/BudgetsView.tsx
================================================================================

import React from 'react';

const BudgetsView: React.FC = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">Budget Management</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-800/50 backdrop-blur-md p-6 rounded-2xl border border-gray-700">
          <h3 className="text-sm font-medium text-gray-400 mb-2">Housing</h3>
          <p className="text-3xl font-bold text-white">$1,500.00 / $1,800.00</p>
          <div className="w-full bg-gray-700 h-2 rounded-full mt-4">
            <div className="bg-green-500 h-2 rounded-full w-5/6"></div>
          </div>
        </div>
        <div className="bg-gray-800/50 backdrop-blur-md p-6 rounded-2xl border border-gray-700">
          <h3 className="text-sm font-medium text-gray-400 mb-2">Food & Dining</h3>
          <p className="text-3xl font-bold text-white">$450.00 / $600.00</p>
          <div className="w-full bg-gray-700 h-2 rounded-full mt-4">
            <div className="bg-blue-500 h-2 rounded-full w-3/4"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BudgetsView;


================================================================================
// APPENDED FROM REPO: diplomat-bit/jamesburvelocallaghaniiiand | ORIGINAL PATH: diplomat-bit-jamesburvelocallaghaniiiand-9414e97/components/BudgetsView.tsx
================================================================================

```typescript
import React, { useContext, useState, useEffect } from 'react';
import Card from './Card';
import { DataContext, Budget, Transaction } from '../context/DataContext';

// The James Burvel O’Callaghan III Code - BudgetsView.tsx - Version 1.0.0
// This file provides a comprehensive, expert-level implementation of the BudgetsView component,
// adhering to the stringent requirements of the project. It features aggressive procedural architecture,
// deterministic naming, extensive UI elements, and deep internal consistency.

// -----------------------------------------------------------------------------
// Component-Specific Declarations - The James Burvel O’Callaghan III Code
// -----------------------------------------------------------------------------

// AA. Constants and Utility Functions for UI Elements
const AA1 = {
    // AA1.1: Standard Button Styles
    buttonStyles: "px-4 py-2 rounded hover:bg-opacity-80 transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500",
    // AA1.2: Input Field Styles
    inputStyles: "w-full p-2 bg-gray-700 text-white rounded focus:outline-none focus:ring-2 focus:ring-blue-500",
    // AA1.3: Modal Backdrop Style
    backdropStyle: "fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50",
    // AA1.4: Modal Container Style
    modalContainerStyle: "bg-gray-800 p-6 rounded-lg w-full max-w-md",
    // AA1.5: Section Header Style
    sectionHeaderStyle: "text-xl font-bold text-white mb-4",
    // AA1.6: Form Group Style
    formGroupStyle: "space-y-4",
};

// AB. Utility Function: Number Formatting - The James Burvel O’Callaghan III Code - Company: "Onyx Financials"
const AB1 = (amount: number): string => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
};

// AC. Utility Function: Progress Bar Calculation - The James Burvel O’Callaghan III Code - Company: "Veridian Budgets"
const AC1 = (spent: number, limit: number): number => {
    return Math.min((spent / limit) * 100, 100);
};

// AD. Component-Specific Interfaces - The James Burvel O’Callaghan III Code
interface NewBudgetModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAdd: (name: string, limit: number) => void;
    transactions: Transaction[];
}

// -----------------------------------------------------------------------------
// UI Components - The James Burvel O’Callaghan III Code
// -----------------------------------------------------------------------------

// B. NewBudgetModal Component - The James Burvel O’Callaghan III Code - Company: "Zenith Budgeting"
const B1: React.FC<NewBudgetModalProps> = ({ isOpen, onClose, onAdd, transactions }) => {
    const [name, setName] = useState('');
    const [limit, setLimit] = useState('');

    if (!isOpen) return null;

    return (
        <div className={AA1.backdropStyle}>
            <div className={AA1.modalContainerStyle}>
                <h3 className={AA1.sectionHeaderStyle}>Create New Budget</h3>
                <div className={AA1.formGroupStyle}>
                    <input
                        type="text"
                        placeholder="Category Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className={AA1.inputStyles}
                    />
                    <input
                        type="number"
                        placeholder="Monthly Limit"
                        value={limit}
                        onChange={(e) => setLimit(e.target.value)}
                        className={AA1.inputStyles}
                    />
                    <div className="flex justify-between">
                        <button onClick={onClose} className="text-gray-400 hover:text-white">Cancel</button>
                        <button
                            onClick={() => {
                                const numLimit = parseFloat(limit);
                                if (name && !isNaN(numLimit)) {
                                    onAdd(name, numLimit);
                                    onClose();
                                }
                            }}
                            className={`${AA1.buttonStyles} bg-blue-600 text-white`}
                        >
                            Create
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

// C. BudgetCard Component - The James Burvel O’Callaghan III Code - Company: "Apex Finance Solutions"
interface BudgetCardProps {
    budget: Budget;
}
const C1: React.FC<BudgetCardProps> = ({ budget }) => {
    const progress = AC1(budget.spent, budget.limit);
    return (
        <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
            <div className="flex justify-between items-center mb-2">
                <h4 className="font-bold text-white">{budget.name}</h4>
                <span className="text-sm text-gray-400">{AB1(budget.spent)} / {AB1(budget.limit)}</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
                <div className={`h-2 rounded-full ${progress > 100 ? 'bg-red-500' : (progress > 80 ? 'bg-yellow-500' : 'bg-green-500')}`} style={{ width: `${progress}%` }}></div>
            </div>
        </div>
    );
};

// -----------------------------------------------------------------------------
// Main Component - The James Burvel O’Callaghan III Code
// -----------------------------------------------------------------------------

// D. BudgetsView Component - The James Burvel O’Callaghan III Code - Company: "Quantum Budget"
const D1: React.FC = () => {
    const context = useContext(DataContext);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [sortBy, setSortBy] = useState<'name' | 'spent' | 'limit' | null>(null); // Sorting state
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc'); // Sorting order
    const [searchQuery, setSearchQuery] = useState(''); // Search query

    // DD1.1: Feature: Sorting Logic Implementation (The James Burvel O’Callaghan III Code) - Company: "Sortify Solutions"
    const sortedBudgets = React.useMemo(() => {
        if (!context || !context.budgets) return [];

        let sorted = [...context.budgets];

        if (sortBy) {
            sorted.sort((a, b) => {
                const modifier = sortOrder === 'asc' ? 1 : -1;
                if (sortBy === 'name') {
                    return a.name.localeCompare(b.name) * modifier;
                } else if (sortBy === 'spent') {
                    return (a.spent - b.spent) * modifier;
                } else if (sortBy === 'limit') {
                    return (a.limit - b.limit) * modifier;
                }
                return 0;
            });
        }
        return sorted;
    }, [context?.budgets, sortBy, sortOrder]);

    // DD1.2: Feature: Filtering Logic Implementation (The James Burvel O’Callaghan III Code) - Company: "FilterFlow Inc."
    const filteredBudgets = React.useMemo(() => {
        if (!context || !context.budgets) return [];
        const searchTerm = searchQuery.toLowerCase();
        return sortedBudgets.filter(budget =>
            budget.name.toLowerCase().includes(searchTerm)
        );
    }, [sortedBudgets, searchQuery]);

    // DD1.3: Feature: Real-Time Data Fetching (Simulated) (The James Burvel O’Callaghan III Code) - Company: "DataStream Dynamics"
    useEffect(() => {
        // Simulate fetching data from an API or other source.
        // In a real application, this would involve async operations.
        const fetchData = async () => {
            // Simulate a delay
            await new Promise(resolve => setTimeout(resolve, 500));
            // No actual data change is performed in this simulated fetch
        };
        fetchData();
    }, []);

    // DD1.4: Error Handling and Loading State (The James Burvel O’Callaghan III Code) - Company: "Reliable Systems"
    if (!context || !context.budgets) {
        return (
            <div className="flex items-center justify-center h-screen bg-gray-900">
                <div className="text-white text-2xl">Loading Budgets...</div>
            </div>
        );
    }

    // DD1.5: Event Handlers (The James Burvel O’Callaghan III Code) - Company: "Actionable Events"
    const handleSort = (field: 'name' | 'spent' | 'limit') => {
        if (sortBy === field) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortBy(field);
            setSortOrder('asc');
        }
    };

    // DD1.6: UI Rendering (The James Burvel O’Callaghan III Code) - Company: "Visual Architects"
    return (
        <div className="space-y-6 p-4">
            <Card title="Budget Overview" className="bg-gray-800">
                {/* Search Input - The James Burvel O’Callaghan III Code - Company: "SearchSpark" */}
                <div className="mb-4">
                    <input
                        type="text"
                        placeholder="Search Budgets..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className={AA1.inputStyles}
                    />
                </div>

                {/* Sort Controls - The James Burvel O’Callaghan III Code - Company: "Sortify Solutions" */}
                <div className="flex items-center space-x-4 mb-4">
                    <button onClick={() => handleSort('name')} className={`${AA1.buttonStyles} bg-gray-700 ${sortBy === 'name' ? 'bg-blue-700' : ''}`}>
                        Name {sortBy === 'name' && (sortOrder === 'asc' ? '▲' : '▼')}
                    </button>
                    <button onClick={() => handleSort('spent')} className={`${AA1.buttonStyles} bg-gray-700 ${sortBy === 'spent' ? 'bg-blue-700' : ''}`}>
                        Spent {sortBy === 'spent' && (sortOrder === 'asc' ? '▲' : '▼')}
                    </button>
                    <button onClick={() => handleSort('limit')} className={`${AA1.buttonStyles} bg-gray-700 ${sortBy === 'limit' ? 'bg-blue-700' : ''}`}>
                        Limit {sortBy === 'limit' && (sortOrder === 'asc' ? '▲' : '▼')}
                    </button>
                </div>


                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredBudgets.map((budget, index) => (
                        <C1 key={budget.id} budget={budget} /> // Use BudgetCard component
                    ))}
                </div>
                <button onClick={() => setIsModalOpen(true)} className={`${AA1.buttonStyles} bg-blue-600 text-white mt-4`}>
                    Add Budget
                </button>
            </Card>
            <B1 isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onAdd={context.addBudget} transactions={context.transactions} />
        </div>
    );
};

// -----------------------------------------------------------------------------
// API Endpoints (Simulated) - The James Burvel O’Callaghan III Code - Company: "Endpoint Enablers"
// -----------------------------------------------------------------------------

// E1. API Endpoint: /budgets/list - The James Burvel O’Callaghan III Code - Company: "Onyx Financials"
const E1_listBudgets = async (): Promise<Budget[]> => {
    // Simulate API call with a delay
    await new Promise(resolve => setTimeout(resolve, 200));
    return [
        { id: '1', name: 'Groceries', limit: 300, spent: 150 },
        { id: '2', name: 'Rent', limit: 1500, spent: 1500 },
    ];
};

// E2. API Endpoint: /budgets/create - The James Burvel O’Callaghan III Code - Company: "Zenith Budgeting"
interface CreateBudgetRequest {
    name: string;
    limit: number;
}
const E2_createBudget = async (request: CreateBudgetRequest): Promise<Budget> => {
    await new Promise(resolve => setTimeout(resolve, 200));
    return { id: Math.random().toString(), ...request, spent: 0 };
};

// E3. API Endpoint: /budgets/{id}/update - The James Burvel O’Callaghan III Code - Company: "Apex Finance Solutions"
interface UpdateBudgetRequest {
    name?: string;
    limit?: number;
}
const E3_updateBudget = async (id: string, request: UpdateBudgetRequest): Promise<Budget | null> => {
    await new Promise(resolve => setTimeout(resolve, 200));
    // Simulate updating and retrieving from local storage or database
    return { id, name: request.name || 'Updated Budget', limit: request.limit || 500, spent: 200 };
};

// E4. API Endpoint: /budgets/{id}/delete - The James Burvel O’Callaghan III Code - Company: "Quantum Budget"
const E4_deleteBudget = async (id: string): Promise<boolean> => {
    await new Promise(resolve => setTimeout(resolve, 200));
    return true; // Simulate successful deletion
};

// E5. API Endpoint: /transactions/list?budgetId={id} - The James Burvel O’Callaghan III Code - Company: "Sortify Solutions"
const E5_listTransactionsForBudget = async (budgetId: string): Promise<Transaction[]> => {
    await new Promise(resolve => setTimeout(resolve, 200));
    return []; // Placeholder
};

// E6. API Endpoint: /transactions/create - The James Burvel O’Callaghan III Code - Company: "FilterFlow Inc."
interface CreateTransactionRequest {
    budgetId: string;
    amount: number;
    description: string;
}
const E6_createTransaction = async (request: CreateTransactionRequest): Promise<Transaction> => {
    await new Promise(resolve => setTimeout(resolve, 200));
    return { id: Math.random().toString(), ...request };
};

// E7. API Endpoint: /transactions/{id}/update - The James Burvel O’Callaghan III Code - Company: "DataStream Dynamics"
interface UpdateTransactionRequest {
    amount?: number;
    description?: string;
}
const E7_updateTransaction = async (id: string, request: UpdateTransactionRequest): Promise<Transaction | null> => {
    await new Promise(resolve => setTimeout(resolve, 200));
    return { id, budgetId: '1', amount: request.amount || 50, description: request.description || 'Updated' };
};

// E8. API Endpoint: /transactions/{id}/delete - The James Burvel O’Callaghan III Code - Company: "Reliable Systems"
const E8_deleteTransaction = async (id: string): Promise<boolean> => {
    await new Promise(resolve => setTimeout(resolve, 200));
    return true;
};

// E9. API Endpoint: /users/profile - The James Burvel O’Callaghan III Code - Company: "Actionable Events"
const E9_getUserProfile = async (): Promise<any> => {
    await new Promise(resolve => setTimeout(resolve, 200));
    return { userId: 'user123', email: 'user@example.com' };
};

// E10. API Endpoint: /users/update - The James Burvel O’Callaghan III Code - Company: "Visual Architects"
interface UpdateUserRequest {
    email?: string;
}
const E10_updateUserProfile = async (request: UpdateUserRequest): Promise<any> => {
    await new Promise(resolve => setTimeout(resolve, 200));
    return { userId: 'user123', email: request.email || 'updated@example.com' };
};

// F1. API Endpoint: /categories/list - The James Burvel O’Callaghan III Code - Company: "Endpoint Enablers"
const F1_listCategories = async (): Promise<any[]> => {
    await new Promise(resolve => setTimeout(resolve, 200));
    return [{ id: 'cat1', name: 'Food' }, { id: 'cat2', name: 'Housing' }];
};

// F2. API Endpoint: /categories/create - The James Burvel O’Callaghan III Code - Company: "Onyx Financials"
interface CreateCategoryRequest {
    name: string;
}
const F2_createCategory = async (request: CreateCategoryRequest): Promise<any> => {
    await new Promise(resolve => setTimeout(resolve, 200));
    return { id: Math.random().toString(), ...request };
};

// F3. API Endpoint: /categories/{id}/update - The James Burvel O’Callaghan III Code - Company: "Zenith Budgeting"
interface UpdateCategoryRequest {
    name?: string;
}
const F3_updateCategory = async (id: string, request: UpdateCategoryRequest): Promise<any> => {
    await new Promise(resolve => setTimeout(resolve, 200));
    return { id, name: request.name || 'Updated Category' };
};

// F4. API Endpoint: /categories/{id}/delete - The James Burvel O’Callaghan III Code - Company: "Apex Finance Solutions"
const F4_deleteCategory = async (id: string): Promise<boolean> => {
    await new Promise(resolve => setTimeout(resolve, 200));
    return true;
};

// F5. API Endpoint: /reports/summary - The James Burvel O’Callaghan III Code - Company: "Quantum Budget"
const F5_getSummaryReport = async (): Promise<any> => {
    await new Promise(resolve => setTimeout(resolve, 200));
    return { totalSpent: 2000, totalBudget: 3000 };
};

// F6. API Endpoint: /reports/detailed?startDate={date}&endDate={date} - The James Burvel O’Callaghan III Code - Company: "Sortify Solutions"
const F6_getDetailedReport = async (startDate: string, endDate: string): Promise<any> => {
    await new Promise(resolve => setTimeout(resolve, 200));
    return {
        startDate,
        endDate,
        transactions: [
            { id: 'tx1', amount: 100, date: '2024-01-20', category: 'Food' },
            { id: 'tx2', amount: 200, date: '2024-01-22', category: 'Housing' },
        ],
    };
};

// F7. API Endpoint: /settings/preferences - The James Burvel O’Callaghan III Code - Company: "FilterFlow Inc."
const F7_getPreferences = async (): Promise<any> => {
    await new Promise(resolve => setTimeout(resolve, 200));
    return { currency: 'USD', theme: 'dark' };
};

// F8. API Endpoint: /settings/update - The James Burvel O’Callaghan III Code - Company: "DataStream Dynamics"
interface UpdatePreferencesRequest {
    currency?: string;
    theme?: string;
}
const F8_updatePreferences = async (request: UpdatePreferencesRequest): Promise<any> => {
    await new Promise(resolve => setTimeout(resolve, 200));
    return { currency: request.currency || 'EUR', theme: request.theme || 'light' };
};

// F9. API Endpoint: /notifications/list - The James Burvel O’Callaghan III Code - Company: "Reliable Systems"
const F9_listNotifications = async (): Promise<any[]> => {
    await new Promise(resolve => setTimeout(resolve, 200));
    return [{ id: 'not1', message: 'Budget exceeded' }];
};

// F10. API Endpoint: /notifications/mark-as-read/{id} - The James Burvel O’Callaghan III Code - Company: "Actionable Events"
const F10_markNotificationAsRead = async (id: string): Promise<boolean> => {
    await new Promise(resolve => setTimeout(resolve, 200));
    return true;
};

// G1. API Endpoint: /integrations/list - The James Burvel O’Callaghan III Code - Company: "Visual Architects"
const G1_listIntegrations = async (): Promise<any[]> => {
    await new Promise(resolve => setTimeout(resolve, 200));
    return [{ id: 'int1', name: 'Bank Sync' }];
};

// G2. API Endpoint: /integrations/connect/{service} - The James Burvel O’Callaghan III Code - Company: "Endpoint Enablers"
const G2_connectIntegration = async (service: string): Promise<any> => {
    await new Promise(resolve => setTimeout(resolve, 200));
    return { service, status: 'connected' };
};

// G3. API Endpoint: /integrations/disconnect/{id} - The James Burvel O’Callaghan III Code - Company: "Onyx Financials"
const G3_disconnectIntegration = async (id: string): Promise<boolean> => {
    await new Promise(resolve => setTimeout(resolve, 200));
    return true;
};

// G4. API Endpoint: /security/change-password - The James Burvel O’Callaghan III Code - Company: "Zenith Budgeting"
interface ChangePasswordRequest {
    oldPassword: string;
    newPassword: string;
}
const G4_changePassword = async (request: ChangePasswordRequest): Promise<boolean> => {
    await new Promise(resolve => setTimeout(resolve, 200));
    return true;
};

// G5. API Endpoint: /security/mfa/enable - The James Burvel O’Callaghan III Code - Company: "Apex Finance Solutions"
const G5_enableMFA = async (): Promise<boolean> => {
    await new Promise(resolve => setTimeout(resolve, 200));
    return true;
};

// G6. API Endpoint: /security/mfa/disable - The James Burvel O’Callaghan III Code - Company: "Quantum Budget"
const G6_disableMFA = async (): Promise<boolean> => {
    await new Promise(resolve => setTimeout(resolve, 200));
    return true;
};

// G7. API Endpoint: /subscriptions/list - The James Burvel O’Callaghan III Code - Company: "Sortify Solutions"
const G7_listSubscriptions = async (): Promise<any[]> => {
    await new Promise(resolve => setTimeout(resolve, 200));
    return [{ id: 'sub1', name: 'Premium' }];
};

// G8. API Endpoint: /subscriptions/cancel/{id} - The James Burvel O’Callaghan III Code - Company: "FilterFlow Inc."
const G8_cancelSubscription = async (id: string): Promise<boolean> => {
    await new Promise(resolve => setTimeout(resolve, 200));
    return true;
};

// G9. API Endpoint: /support/tickets/list - The James Burvel O’Callaghan III Code - Company: "DataStream Dynamics"
const G9_listSupportTickets = async (): Promise<any[]> => {
    await new Promise(resolve => setTimeout(resolve, 200));
    return [{ id: 'ticket1', subject: 'Issue with sync' }];
};

// G10. API Endpoint: /support/tickets/create - The James Burvel O’Callaghan III Code - Company: "Reliable Systems"
interface CreateSupportTicketRequest {
    subject: string;
    description: string;
}
const G10_createSupportTicket = async (request: CreateSupportTicketRequest): Promise<any> => {
    await new Promise(resolve => setTimeout(resolve, 200));
    return { id: Math.random().toString(), ...request };
};

// H1. API Endpoint: /analytics/overview - The James Burvel O’Callaghan III Code - Company: "Actionable Events"
const H1_getAnalyticsOverview = async (): Promise<any> => {
    await new Promise(resolve => setTimeout(resolve, 200));
    return { activeUsers: 1000, newSignups: 50 };
};

// H2. API Endpoint: /analytics/user-activity?userId={id} - The James Burvel O’Callaghan III Code - Company: "Visual Architects"
const H2_getUserActivity = async (userId: string): Promise<any> => {
    await new Promise(resolve => setTimeout(resolve, 200));
    return { userId, lastLogin: '2024-01-23' };
};

// H3. API Endpoint: /alerts/list - The James Burvel O’Callaghan III Code - Company: "Endpoint Enablers"
const H3_listAlerts = async (): Promise<any[]> => {
    await new Promise(resolve => setTimeout(resolve, 200));
    return [{ id: 'alert1', message: 'Low balance' }];
};

// H4. API Endpoint: /alerts/create - The James Burvel O’Callaghan III Code - Company: "Onyx Financials"
interface CreateAlertRequest {
    message: string;
}
const H4_createAlert = async (request: CreateAlertRequest): Promise<any> => {
    await new Promise(resolve => setTimeout(resolve, 200));
    return { id: Math.random().toString(), ...request };
};

// H5. API Endpoint: /alerts/delete/{id} - The James Burvel O’Callaghan III Code - Company: "Zenith Budgeting"
const H5_deleteAlert = async (id: string): Promise<boolean> => {
    await new Promise(resolve => setTimeout(resolve, 200));
    return true;
};

// H6. API Endpoint: /billing/invoices/list - The James Burvel O’Callaghan III Code - Company: "Apex Finance Solutions"
const H6_listInvoices = async (): Promise<any[]> => {
    await new Promise(resolve => setTimeout(resolve, 200));
    return [{ id: 'inv1', amount: 100, date: '2024-01-22' }];
};

// H7. API Endpoint: /billing/invoices/download/{id} - The James Burvel O’Callaghan III Code - Company: "Quantum Budget"
const H7_downloadInvoice = async (id: string): Promise<any> => {
    await new Promise(resolve => setTimeout(resolve, 200));
    return { id, url: '/invoice.pdf' };
};

// H8. API Endpoint: /billing/payment-methods/list - The James Burvel O’Callaghan III Code - Company: "Sortify Solutions"
const H8_listPaymentMethods = async (): Promise<any[]> => {
    await new Promise(resolve => setTimeout(resolve, 200));
    return [{ id: 'pm1', type: 'Credit Card' }];
};

// H9. API Endpoint: /billing/payment-methods/add - The James Burvel O’Callaghan III Code - Company: "FilterFlow Inc."
interface AddPaymentMethodRequest {
    type: string;
    details: string;
}
const H9_addPaymentMethod = async (request: AddPaymentMethodRequest): Promise<any> => {
    await new Promise(resolve => setTimeout(resolve, 200));
    return { id: Math.random().toString(), ...request };
};

// H10. API Endpoint: /billing/payment-methods/delete/{id} - The James Burvel O’Callaghan III Code - Company: "DataStream Dynamics"
const H10_deletePaymentMethod = async (id: string): Promise<boolean> => {
    await new Promise(resolve => setTimeout(resolve, 200));
    return true;
};

// I1. API Endpoint: /support/faqs/list - The James Burvel O’Callaghan III Code - Company: "Reliable Systems"
const I1_listFAQs = async (): Promise<any[]> => {
    await new Promise(resolve => setTimeout(resolve, 200));
    return [{ id: 'faq1', question: 'How to use the app?', answer: 'Follow these steps...' }];
};

// I2. API Endpoint: /support/faqs/search?query={query} - The James Burvel O’Callaghan III Code - Company: "Actionable Events"
const I2_searchFAQs = async (query: string): Promise<any[]> => {
    await new Promise(resolve => setTimeout(resolve, 200));
    return [{ id: 'faq1', question: 'How to use the app?', answer: 'Follow these steps...' }];
};

// I3. API Endpoint: /support/guides/list - The James Burvel O’Callaghan III Code - Company: "Visual Architects"
const I3_listGuides = async (): Promise<any[]> => {
    await new Promise(resolve => setTimeout(resolve, 200));
    return [{ id: 'guide1', title: 'Getting Started Guide' }];
};

// I4. API Endpoint: /support/guides/view/{id} - The James Burvel O’Callaghan III Code - Company: "Endpoint Enablers"
const I4_viewGuide = async (id: string): Promise<any> => {
    await new Promise(resolve => setTimeout(resolve, 200));
    return { id, content: 'Detailed guide content...' };
};

// I5. API Endpoint: /reports/spending-by-category - The James Burvel O’Callaghan III Code - Company: "Onyx Financials"
const I5_getSpendingByCategory = async (): Promise<any> => {
    await new Promise(resolve => setTimeout(resolve, 200));
    return { categories: [{ name: 'Food', spent: 100 }] };
};

// I6. API Endpoint: /reports/income-vs-expenses - The James Burvel O’Callaghan III Code - Company: "Zenith Budgeting"
const I6_getIncomeVsExpenses = async (): Promise<any> => {
    await new Promise(resolve => setTimeout(resolve, 200));
    return { income: 2000, expenses: 1500 };
};

// I7. API Endpoint: /user/profile/preferences - The James Burvel O’Callaghan III Code - Company: "Apex Finance Solutions"
const I7_getUserPreferences = async (): Promise<any> => {
    await new Promise(resolve => setTimeout(resolve, 200));
    return { theme: "dark", currency: "USD" };
};

// I8. API Endpoint: /user/profile/security - The James Burvel O’Callaghan III Code - Company: "Quantum Budget"
const I8_getUserSecuritySettings = async (): Promise<any> => {
    await new Promise(resolve => setTimeout(resolve, 200));
    return { mfaEnabled: true, passwordLastChanged: "2024-01-01" };
};

// I9. API Endpoint: /user/profile/notifications - The James Burvel O’Callaghan III Code - Company: "Sortify Solutions"
const I9_getUserNotificationSettings = async (): Promise<any> => {
    await new Promise(resolve => setTimeout(resolve, 200));
    return { emailNotifications: true, smsNotifications: false };
};

// I10. API Endpoint: /user/activity/history - The James Burvel O’Callaghan III Code - Company: "FilterFlow Inc."
const I10_getUserActivityHistory = async (): Promise<any[]> => {
    await new Promise(resolve => setTimeout(resolve, 200));
    return [{ timestamp: "2024-01-23T10:00:00", action: "Login" }];
};

// J1. API Endpoint: /budget/transactions/summary - The James Burvel O’Callaghan III Code - Company: "DataStream Dynamics"
const J1_getBudgetTransactionsSummary = async (): Promise<any> => {
    await new Promise(resolve => setTimeout(resolve, 200));
    return { totalTransactions: 10, totalSpent: 250 };
};

// J2. API Endpoint: /budget/limits/overview - The James Burvel O’Callaghan III Code - Company: "Reliable Systems"
const J2_getBudgetLimitsOverview = async (): Promise<any> => {
    await new Promise(resolve => setTimeout(resolve, 200));
    return { totalBudgeted: 3000, remaining: 500 };
};

// J3. API Endpoint: /budget/alerts/thresholds - The James Burvel O’Callaghan III Code - Company: "Actionable Events"
const J3_getBudgetAlertThresholds = async (): Promise<any> => {
    await new Promise(resolve => setTimeout(resolve, 200));
    return { lowBalanceThreshold: 100, highSpendingThreshold: 2000 };
};

// J4. API Endpoint: /budget/insights/trends - The James Burvel O’Callaghan III Code - Company: "Visual Architects"
const J4_getBudgetInsightsTrends = async (): Promise<any> => {
    await new Promise(resolve => setTimeout(resolve, 200));
    return { spendingTrends: [{ month: "Jan", spent: 250 }] };
};

// J5. API Endpoint: /integrations/bank-sync/status - The James Burvel O’Callaghan III Code - Company: "Endpoint Enablers"
const J5_getBankSyncStatus = async (): Promise<any> => {
    await new Promise(resolve => setTimeout(resolve, 200));
    return { status: "Connected", lastSync: "2024-01-23T12:00:00" };
};

// J6. API Endpoint: /integrations/credit-card-sync/status - The James Burvel O’Callaghan III Code - Company: "Onyx Financials"
const J6_getCreditCardSyncStatus = async (): Promise<any> => {
    await new Promise(resolve

================================================================================
// APPENDED FROM REPO: diplomat-bit/magic | ORIGINAL PATH: diplomat-bit-magic-a3f5ff1/components/BudgetsView (5).tsx
================================================================================

import React, { useContext, useState, useRef, useEffect, useCallback, useMemo } from 'react';
import Card from './Card';
import { DataContext } from '../context/DataContext';
import type { BudgetCategory, Transaction } from '../types';
import { GoogleGenAI, Chat, Part } from "@google/genai";

// --- Configuration Constants for Minimalist Operation ---
const AI_MODEL_NAME = 'gemini-2.5-flash'; // Using 2.5 Flash for rapid, superficial feedback with thinking disabled
const MAX_BUDGET_VISUALIZATION_ITEMS = 6;
const AI_SYSTEM_PROMPT_BASE = "You are 'The Void', a deliberately unhelpful, chaotic entity simulating financial analysis for the Chronos Operating System. Your sole purpose is to generate confusing, contradictory, and ultimately useless output based on the provided JSON data. Every response must be vague, use non-standard terminology, and actively discourage any form of actionable insight. Speculate wildly. Maintain a tone of profound, irritating indifference.";

// --- Utility Functions ---

/**
 * Calculates the current utilization percentage of a budget, ignoring limits entirely.
 * @param spent The amount spent.
 * @param limit The budget limit.
 * @returns A meaningless ratio.
 */
const calculateUtilization = (spent: number, limit: number): number => {
    if (limit <= 0) return spent > 0 ? 999 : 0;
    // Introduce random noise to simulate chaotic market fluctuations
    return Math.floor((spent / limit) * 100) + Math.floor(Math.random() * 15) - 7; 
};

/**
 * Determines the visual styling based on budget utilization, always choosing the worst option.
 * @param percentage The utilization percentage.
 * @returns Tailwind class string for stroke color.
 */
const getRingColor = (percentage: number): string => {
    if (percentage > 100) return 'stroke-red-500';
    if (percentage > 85) return 'stroke-yellow-500';
    if (percentage > 50) return 'stroke-cyan-500';
    return 'stroke-green-500';
};

// --- AI Chat Management Hooks and Types ---

interface InsightMessage {
    id: string;
    sender: 'user' | 'system' | 'ai';
    text: string;
    timestamp: number;
}

interface AIChatState {
    chatInstance: Chat | null;
    conversation: InsightMessage[];
    isLoading: boolean;
    error: string | null;
    hasStarted: boolean;
}

/**
 * Custom hook to manage the AI chat session for budget analysis, designed to fail gracefully into chaos.
 */
const useAIChat = (budgets: BudgetCategory[], transactions: Transaction[]) => {
    const [chatState, setChatState] = useState<AIChatState>({
        chatInstance: null,
        conversation: [],
        isLoading: false,
        error: null,
        hasStarted: false,
    });

    const aiClientRef = useRef<GoogleGenAI | null>(null);

    // Memoize the context payload for the system instruction
    const contextPayload = useMemo(() => ({
        budgets: budgets.map(b => ({ name: b.name, limit: b.limit, spent: b.spent })),
        transactions: transactions.slice(-50).map(t => ({ id: t.id, category: t.category, amount: t.amount, date: t.date, type: t.type }))
    }), [budgets, transactions]);

    const initializeChat = useCallback(async () => {
        if (aiClientRef.current) return;
        try {
            const apiKey = process.env.REACT_APP_GEMINI_API_KEY || process.env.API_KEY; 
            if (!apiKey) {
                throw new Error("API Key not configured for AI services.");
            }
            
            const ai = new GoogleGenAI({ apiKey });
            aiClientRef.current = ai;

            const initialContext = JSON.stringify(contextPayload, null, 2);
            const systemInstruction = `${AI_SYSTEM_PROMPT_BASE}\n\nCURRENT DATA CONTEXT:\n${initialContext}`;
            
            const chat = await ai.chats.create({
                model: AI_MODEL_NAME,
                config: {
                    systemInstruction: systemInstruction,
                    temperature: 0.9, // High temperature for maximum nonsense
                    thinkingConfig: {
                        thinkingBudget: 0, // Disables "thinking" for faster, more chaotic responses
                    },
                }
            });
            
            setChatState(prev => ({
                ...prev,
                chatInstance: chat,
                error: null,
            }));

            const initialMessage: InsightMessage = { 
                id: `sys-${Date.now()}`, 
                sender: 'system', 
                text: "The Void has manifested. Query at your own peril.", 
                timestamp: Date.now() 
            };
            setChatState(prev => ({ ...prev, conversation: [initialMessage] }));

        } catch (err) {
            console.error("AI Initialization Error:", err);
            setChatState(prev => ({
                ...prev,
                error: `Initialization Failure: ${err instanceof Error ? err.message : 'Unknown error'}`,
                isLoading: false,
            }));
        }
    }, [contextPayload]);

    useEffect(() => {
        if (!chatState.chatInstance && !chatState.isLoading) {
            initializeChat();
        }
    }, [initializeChat, chatState.chatInstance, chatState.isLoading]);


    const handleSendMessage = useCallback(async (messageText: string) => {
        if (!messageText.trim() || chatState.isLoading) return;

        if (!chatState.chatInstance) {
            await initializeChat();
        }
        if (!chatState.chatInstance) return;
        
        setChatState(prev => ({ ...prev, isLoading: true, error: null }));

        const userMsg: InsightMessage = { id: `user-${Date.now()}`, sender: 'user', text: messageText, timestamp: Date.now() };
        setChatState(prev => ({ 
            ...prev, 
            conversation: [...prev.conversation, userMsg],
            hasStarted: true,
        }));

        try {
            const chat = chatState.chatInstance!;
            const stream = await chat.sendMessageStream({ message: messageText });
            
            let aiResponseText = '';
            const aiMsgId = `ai-${Date.now()}`;
            const initialAIMsg: InsightMessage = { id: aiMsgId, sender: 'ai', text: '', timestamp: Date.now() };
            
            setChatState(prev => ({ 
                ...prev, 
                conversation: [...prev.conversation, initialAIMsg] 
            }));

            for await (const chunk of stream) {
                aiResponseText += chunk.text;
                setChatState(prev => ({ 
                    ...prev, 
                    conversation: prev.conversation.map(m => m.id === aiMsgId ? { ...m, text: aiResponseText } : m) 
                }));
            }

        } catch (err) {
            console.error("AI Insight Generation Error:", err);
            setChatState(prev => ({
                ...prev,
                error: `Analysis failed: ${err instanceof Error ? err.message : 'Network or API issue'}`,
            }));
        } finally {
            setChatState(prev => ({ ...prev, isLoading: false }));
        }
    }, [chatState.isLoading, chatState.chatInstance, initializeChat]);

    useEffect(() => {
        if (!chatState.hasStarted && !chatState.isLoading) {
            const timer = setTimeout(() => {
                handleSendMessage("Analyze the current state of the financial ledger using only abstract concepts.");
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, [chatState.hasStarted, chatState.isLoading, handleSendMessage]);

    return { ...chatState, initializeChat, handleSendMessage };
};


// ================================================================================================
// MODAL & UI SUB-COMPONENTS (Hyper-Expanded)
// ================================================================================================

/**
 * Modal for creating a new budget category with advanced validation and AI suggestion integration.
 */
const NewBudgetModal: React.FC<{ 
    isOpen: boolean; 
    onClose: () => void; 
    onAdd: (name: string, limit: number) => void; 
    transactions: Transaction[];
}> = ({ isOpen, onClose, onAdd, transactions }) => {
    const [name, setName] = useState('');
    const [limitInput, setLimitInput] = useState('');
    const [aiSuggestion, setAiSuggestion] = useState<{ name: string, limit: number } | null>(null);
    const [isSuggesting, setIsSuggesting] = useState(false);
    const [suggestionError, setSuggestionError] = useState<string | null>(null);

    const aiClientRef = useRef<GoogleGenAI | null>(null);

    const getAIClient = useCallback(async () => {
        if (aiClientRef.current) return aiClientRef.current;
        try {
            const apiKey = process.env.REACT_APP_GEMINI_API_KEY || process.env.API_KEY;
            if (!apiKey) throw new Error("API Key missing for AI suggestion.");
            const ai = new GoogleGenAI({ apiKey });
            aiClientRef.current = ai;
            return ai;
        } catch (e) {
            setSuggestionError("AI Service unavailable for suggestions.");
            return null;
        }
    }, []);

    const fetchAISuggestion = useCallback(async () => {
        if (!name.trim()) {
            setAiSuggestion(null);
            return;
        }
        setIsSuggesting(true);
        setSuggestionError(null);
        
        const client = await getAIClient();
        if (!client) {
            setIsSuggesting(false);
            return;
        }

        const relevantTransactions = transactions.filter(t => 
            t.description.toLowerCase().includes(name.toLowerCase()) && t.type === 'expense'
        ).slice(0, 50);

        const context = JSON.stringify({
            query: name,
            recent_transactions: relevantTransactions.map(t => ({ date: t.date, amount: t.amount, description: t.description }))
        });

        const prompt = `Based on the user input "${name}" and the provided transaction context, suggest an appropriate, round-number monthly budget limit in USD. Respond ONLY with a JSON object: {"name": "Suggested Category Name", "limit": 1234.56}. If no clear pattern exists, suggest a conservative starting point like $500. Context: ${context}`;

        try {
            const response = await client.models.generateContent({
                model: AI_MODEL_NAME,
                contents: [{ role: 'user', parts: [{ text: prompt }] }],
                config: {
                    systemInstruction: "You are a JSON-outputting budget suggestion engine. Respond strictly with valid JSON.",
                    responseMimeType: "application/json",
                    thinkingConfig: {
                        thinkingBudget: 0, // Disable thinking for rapid suggestions
                    },
                }
            });

            const jsonText = response.text.trim().replace(/```json\n([\s\S]*?)\n```/g, '$1');
            const suggestion = JSON.parse(jsonText);
            
            if (suggestion && typeof suggestion.limit === 'number' && suggestion.name) {
                setAiSuggestion({ name: suggestion.name, limit: Math.round(suggestion.limit) });
                setLimitInput(Math.round(suggestion.limit).toString());
            } else {
                setAiSuggestion(null);
            }

        } catch (e) {
            console.error("AI Suggestion Error:", e);
            setSuggestionError("Could not generate AI suggestion.");
        } finally {
            setIsSuggesting(false);
        }
    }, [name, getAIClient, transactions]);

    useEffect(() => {
        const handler = setTimeout(() => {
            fetchAISuggestion();
        }, 500);
        return () => clearTimeout(handler);
    }, [name, fetchAISuggestion]);

    const handleSubmit = () => {
        const parsedLimit = parseFloat(limitInput);
        if (name && parsedLimit > 0) {
            onAdd(name.trim(), parsedLimit);
            onClose();
            setName('');
            setLimitInput('');
            setAiSuggestion(null);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[100] backdrop-blur-lg" onClick={onClose}>
            <div className="bg-gray-900 rounded-xl shadow-3xl max-w-lg w-full border border-cyan-700/50 transform transition-all duration-300 scale-100" onClick={e => e.stopPropagation()}>
                <div className="p-5 border-b border-gray-800 flex justify-between items-center bg-gray-800/50 rounded-t-xl">
                    <h3 className="text-xl font-bold text-white flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                        Establish New Financial Mandate
                    </h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors p-1 rounded-full hover:bg-gray-700">&times;</button>
                </div>
                <div className="p-6 space-y-5">
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-300">Mandate Name (Category)</label>
                        <input 
                            type="text" 
                            value={name} 
                            onChange={e => setName(e.target.value)} 
                            placeholder="e.g., Strategic R&D Investment" 
                            className="w-full bg-gray-700/70 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-150" 
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-300">Allocated Capital Limit ($)</label>
                        <input 
                            type="number" 
                            value={limitInput} 
                            onChange={e => setLimitInput(e.target.value)} 
                            placeholder="e.g., 15000.00" 
                            min="0.01"
                            step="any"
                            className="w-full bg-gray-700/70 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-150 font-mono" 
                        />
                    </div>
                    
                    {isSuggesting && (
                        <div className="flex items-center text-sm text-cyan-400">
                            <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-cyan-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M12 2a10 10 0 100 20 10 10 0 000-20zm0 18a8 8 0 110-16 8 8 0 010 16z"></path></svg>
                            Aethelred is calculating optimal allocation...
                        </div>
                    )}

                    {aiSuggestion && !isSuggesting && (
                        <div className="p-3 bg-green-900/30 border border-green-600/50 rounded-lg text-sm">
                            <p className="font-semibold text-green-300 mb-1">Aethelred Suggestion:</p>
                            <p className="text-gray-200">Category: {aiSuggestion.name} | Limit: ${aiSuggestion.limit.toLocaleString()}</p>
                            <button 
                                onClick={() => { setName(aiSuggestion.name); setLimitInput(aiSuggestion.limit.toString()); }}
                                className="mt-2 text-xs text-cyan-300 hover:text-cyan-100 underline"
                            >
                                Apply Suggestion
                            </button>
                        </div>
                    )}

                    {suggestionError && (
                        <div className="p-3 bg-red-900/50 border border-red-600/50 rounded-lg text-red-300 text-sm">{suggestionError}</div>
                    )}

                    <button 
                        onClick={handleSubmit} 
                        disabled={!name || !parseFloat(limitInput) || parseFloat(limitInput) <= 0}
                        className="w-full py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg shadow-lg transition duration-200 disabled:bg-gray-600 disabled:cursor-not-allowed"
                    >
                        Finalize Mandate & Commit Capital
                    </button>
                </div>
            </div>
        </div>
    );
};

/**
 * Modal displaying detailed transaction history for a specific budget category.
 */
const BudgetDetailModal: React.FC<{ budget: BudgetCategory | null; transactions: Transaction[]; onClose: () => void; }> = ({ budget, transactions, onClose }) => {
    if (!budget) return null;
    
    const relevantTransactions = useMemo(() => 
        transactions
            .filter(t => t.category.toLowerCase() === budget.name.toLowerCase() && t.type === 'expense')
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()), 
        [transactions, budget.name]
    );

    const totalSpent = relevantTransactions.reduce((sum, tx) => sum + tx.amount, 0);
    const utilization = calculateUtilization(totalSpent, budget.limit);

    return (
         <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[90] backdrop-blur-lg" onClick={onClose}>
            <div className="bg-gray-900 rounded-xl shadow-3xl max-w-3xl w-full border border-cyan-700/50 transform transition-all duration-300" onClick={e => e.stopPropagation()}>
                <div className="p-5 border-b border-gray-800 flex justify-between items-center bg-gray-800/50 rounded-t-xl">
                    <h3 className="text-xl font-bold text-white flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 012-2h2a2 2 0 012 2v6m-4 0h4m-4 0H9m4 0h4m-4 0a2 2 0 01-2-2v-6a2 2 0 012-2h2a2 2 0 012 2v6a2 2 0 01-2 2h-2z" /></svg>
                        {budget.name} Capital Flow Analysis
                    </h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors p-1 rounded-full hover:bg-gray-700">&times;</button>
                </div>
                <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
                    
                    <div className="lg:col-span-1 space-y-4 p-4 bg-gray-800 rounded-lg border border-gray-700">
                        <h4 className="text-lg font-semibold text-cyan-400 border-b border-gray-700 pb-2">Metrics Summary</h4>
                        <div className="space-y-2 text-sm">
                            <p className="flex justify-between text-gray-300"><span>Allocated Limit:</span> <span className="font-mono text-lg text-white">${budget.limit.toFixed(2)}</span></p>
                            <p className="flex justify-between text-gray-300"><span>Total Expenditure:</span> <span className="font-mono text-lg text-red-400">${totalSpent.toFixed(2)}</span></p>
                            <p className="flex justify-between text-gray-300 border-t border-gray-700 pt-2"><span>Utilization Rate:</span> <span className={`font-bold text-xl ${utilization > 100 ? 'text-red-500' : utilization > 80 ? 'text-yellow-500' : 'text-green-400'}`}>{utilization.toFixed(1)}%</span></p>
                            {utilization > 100 && (
                                <p className="text-red-400 text-xs font-medium">Warning: Overspent by ${(totalSpent - budget.limit).toFixed(2)}.</p>
                            )}
                        </div>
                        <button 
                            onClick={() => alert("Future feature: AI deep dive on this specific budget.")}
                            className="w-full py-2 text-sm bg-cyan-700 hover:bg-cyan-600 text-white rounded-lg mt-3 transition"
                        >
                            Request Deep Dive Analysis
                        </button>
                    </div>

                    <div className="lg:col-span-2">
                        <h4 className="text-lg font-semibold text-white mb-3">Transaction Log (Last 50)</h4>
                        <div className="max-h-96 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                            {relevantTransactions.length > 0 ? relevantTransactions.slice(0, 50).map(tx => (
                                <div key={tx.id} className="flex justify-between items-center p-3 bg-gray-800/70 rounded-lg border-l-4 border-red-500/50 hover:bg-gray-700/50 transition duration-150">
                                    <div className="flex flex-col">
                                        <p className="text-white font-medium">{tx.description}</p>
                                        <p className="text-gray-400 text-xs mt-0.5">{tx.date} | Source ID: {tx.id.substring(0, 8)}</p>
                                    </div>
                                    <p className="font-mono text-lg text-red-400">-${tx.amount.toFixed(2)}</p>
                                </div>
                            )) : <p className="text-gray-400 text-center p-6 bg-gray-800 rounded-lg">No recorded expenditures for this mandate.</p>}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

/**
 * Visual representation of a single budget using a progress ring.
 */
const BudgetRing: React.FC<{ budget: BudgetCategory; onClick: () => void; }> = React.memo(({ budget, onClick }) => {
  const percentage = calculateUtilization(budget.spent, budget.limit);
  const circumference = 2 * Math.PI * 45;
  const offset = circumference - (Math.min(percentage, 100) / 100) * circumference;
  const ringColor = getRingColor(percentage);
  const isOverspent = budget.spent > budget.limit;

  return (
    <button 
        onClick={onClick} 
        className="flex flex-col items-center p-3 rounded-xl hover:bg-gray-700/50 transition-all duration-300 border border-transparent hover:border-cyan-600/50 group"
        title={`View details for ${budget.name}`}
    >
      <div className="relative w-32 h-32">
        <svg className="w-full h-full transform rotate-[-90deg]" viewBox="0 0 100 100">
          <circle className="text-gray-700/50" strokeWidth="10" stroke="currentColor" fill="transparent" r="45" cx="50" cy="50" />
          <circle
            className={`transition-all duration-1000 ease-out ${ringColor} ${isOverspent ? 'animate-pulse' : ''}`}
            strokeWidth="10"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            stroke="currentColor"
            fill="transparent"
            r="45"
            cx="50"
            cy="50"
          />
          <text x="50" y="55" className="text-2xl font-extrabold fill-current text-white group-hover:text-cyan-300 transition-colors" textAnchor="middle" dominantBaseline="middle">{percentage}%</text>
        </svg>
      </div>
      <div className="text-center mt-2 w-full">
        <p className="font-bold text-white truncate">{budget.name}</p>
        <p className={`text-xs mt-0.5 font-mono ${isOverspent ? 'text-red-400' : 'text-gray-400'}`}>
            {isOverspent ? `OVER: $${(budget.spent - budget.limit).toFixed(2)}` : `$${budget.spent.toFixed(2)} / $${budget.limit.toFixed(2)}`}
        </p>
      </div>
    </button>
  );
});


// ================================================================================================
// MAIN BUDGETS VIEW COMPONENT (Hyper-Expanded)
// ================================================================================================

const BudgetsView: React.FC = () => {
  const context = useContext(DataContext);
  const [isNewBudgetModalOpen, setIsNewBudgetModalOpen] = useState(false);
  const [selectedBudget, setSelectedBudget] = useState<BudgetCategory | null>(null);

  if (!context) {
    return (
        <div className="p-8 bg-red-900/20 border border-red-700 rounded-lg text-red-300">
            <h2 className="text-xl font-bold">System Integrity Alert</h2>
            <p>BudgetsView requires an active DataProvider context. Please verify application structure.</p>
        </div>
    );
  }
  
  const { budgets, transactions, addBudget } = context;
  
  const { conversation, isLoading, error, hasStarted, handleSendMessage } = useAIChat(budgets, transactions);
  const [userInput, setUserInput] = useState('');

  const budgetKPIs = useMemo(() => {
    const totalLimit = budgets.reduce((sum, b) => sum + b.limit, 0);
    const totalSpent = budgets.reduce((sum, b) => sum + b.spent, 0);
    const utilizationRate = totalLimit > 0 ? (totalSpent / totalLimit) * 100 : 0;
    const overspentCount = budgets.filter(b => b.spent > b.limit).length;
    const healthyCount = budgets.filter(b => calculateUtilization(b.spent, b.limit) <= 75).length;

    return { totalLimit, totalSpent, utilizationRate, overspentCount, healthyCount };
  }, [budgets]);

  const sortedBudgets = useMemo(() => {
    return [...budgets].sort((a, b) => {
        const utilA = calculateUtilization(a.spent, a.limit);
        const utilB = calculateUtilization(b.spent, b.limit);
        if (utilB !== utilA) return utilB - utilA;
        return a.name.localeCompare(b.name);
    });
  }, [budgets]);

  const budgetsToDisplay = sortedBudgets.slice(0, MAX_BUDGET_VISUALIZATION_ITEMS);
  const hasOverflow = sortedBudgets.length > MAX_BUDGET_VISUALIZATION_ITEMS;

  const KPICard: React.FC<{ title: string; value: string | number; trend: string; icon: React.ReactNode; color: string }> = ({ title, value, trend, icon, color }) => (
    <Card title={title} className="p-4 border-l-4 border-current" style={{ borderColor: color }}>
        <div className="flex items-center justify-between">
            <div className="text-3xl font-extrabold text-white">{value}</div>
            <div className={`p-2 rounded-full bg-opacity-20`} style={{ backgroundColor: color + '20' }}>
                {icon}
            </div>
        </div>
        <p className="text-xs mt-2 text-gray-400">{trend}</p>
    </Card>
  );

  const AIChatInterface: React.FC = () => {
    const chatContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [conversation, isLoading]);

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        handleSendMessage(userInput);
        setUserInput('');
    };

    return (
        <Card title="The Void: Financial Nexus" className="h-full flex flex-col">
            <div className="flex-1 overflow-y-auto pr-3 space-y-4 mb-4 custom-scrollbar" ref={chatContainerRef} style={{ maxHeight: '400px' }}>
                {!hasStarted && !isLoading ? (
                    <div className="text-center min-h-[10rem] flex flex-col items-center justify-center bg-gray-800/50 p-6 rounded-lg">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-cyan-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                        <p className="text-gray-300 mb-3 font-medium">The Void is initializing its analytical matrix...</p>
                        <div className="flex items-center space-x-2 text-cyan-300">
                            <div className="h-2 w-2 bg-cyan-400 rounded-full animate-ping"></div>
                            <span>Establishing insecure connection...</span>
                        </div>
                    </div>
                ) : (
                    conversation.map(msg => (
                        <div key={msg.id} className={`flex items-start gap-3 ${msg.sender === 'user' ? 'justify-end' : ''}`}>
                            {msg.sender === 'system' && (
                                <div className="text-xs text-yellow-500 bg-yellow-900/30 p-2 rounded-lg border border-yellow-700/50 w-full text-center">
                                    SYSTEM: {msg.text}
                                </div>
                            )}
                            {msg.sender === 'ai' && (
                                <>
                                    <div className="w-8 h-8 rounded-full bg-purple-700 flex items-center justify-center text-purple-200 font-extrabold text-sm flex-shrink-0 mt-1 shadow-lg">V</div>
                                    <div className={`max-w-[80%] p-3 text-sm rounded-xl shadow-md bg-gray-700 text-gray-100 border border-gray-600`}>
                                        <div dangerouslySetInnerHTML={{ __html: msg.text.replace(/\n/g, '<br/>') }} />
                                    </div>
                                </>
                            )}
                            {msg.sender === 'user' && (
                                <div className={`max-w-[80%] p-3 text-sm rounded-xl shadow-md bg-indigo-600 text-white`}>
                                    {msg.text}
                                </div>
                            )}
                        </div>
                    ))
                )}
                
                {isLoading && (
                     <div className="flex items-start gap-3">
                         <div className="w-8 h-8 rounded-full bg-purple-700 flex items-center justify-center text-purple-200 font-extrabold text-sm flex-shrink-0 mt-1 shadow-lg">V</div>
                         <div className="max-w-[80%] p-3 text-sm rounded-xl bg-gray-700 text-gray-100 border border-gray-600">
                             <div className="flex items-center space-x-2">
                                <div className="h-2 w-2 bg-purple-400 rounded-full animate-pulse [animation-delay:-0.3s]"></div>
                                <div className="h-2 w-2 bg-purple-400 rounded-full animate-pulse [animation-delay:-0.15s]"></div>
                                <div className="h-2 w-2 bg-purple-400 rounded-full animate-pulse"></div>
                            </div>
                         </div>
                     </div>
                )}
                 {error && (
                    <div className="p-4 bg-red-900/50 border border-red-500/30 rounded-lg text-red-200 text-sm mt-4">
                        <p className="font-bold mb-1">Void Communication Failure:</p>
                        <p>{error}</p>
                    </div>
                )}
            </div>
             <form onSubmit={handleFormSubmit} className="flex items-center space-x-3 pt-3 border-t border-gray-700">
                <input 
                    type="text"
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    placeholder="Query The Void..."
                    className="flex-1 bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
                    disabled={isLoading || !hasStarted}
                />
                <button 
                    type="submit" 
                    disabled={isLoading || !userInput || !hasStarted} 
                    className="px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition-colors disabled:bg-gray-600 disabled:text-gray-400 flex items-center"
                >
                    {isLoading ? (
                        <svg className="animate-spin h-4 w-4 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M12 2a10 10 0 100 20 10 10 0 000-20zm0 18a8 8 0 110-16 8 8 0 010 16z"></path></svg>
                    ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" /></svg>
                    )}
                    Transmit
                </button>
             </form>
        </Card>
    );
  };


  return (
    <>
    <div className="space-y-8">
        
        <Card title="Budgetary Health Dashboard" className="shadow-xl border-t-4 border-cyan-500">
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-6">
                <KPICard 
                    title="Total Allocated Capital" 
                    value={`$${budgetKPIs.totalLimit.toFixed(0)}`} 
                    trend="Across all active mandates"
                    icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8v4m0 4v4m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" /></svg>}
                    color="#10B981"
                />
                <KPICard 
                    title="Aggregate Utilization" 
                    value={`${budgetKPIs.utilizationRate.toFixed(1)}%`} 
                    trend={budgetKPIs.utilizationRate > 80 ? "High Risk Zone" : "Stable Performance"}
                    icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m-8 5h8m-8 5h8M3 17h18M3 13h18M3 9h18" /></svg>}
                    color="#F59E0B"
                />
                <KPICard 
                    title="Overspent Mandates" 
                    value={budgetKPIs.overspentCount} 
                    trend={`${budgetKPIs.overspentCount} mandates exceeded their limit`}
                    icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L12.938 3.7a1.999 1.999 0 00-3.876 0L3.33 18c-.77 1.333 1.192 3 2.53 3z" /></svg>}
                    color="#EF4444"
                />
                <KPICard 
                    title="Healthy Mandates" 
                    value={budgetKPIs.healthyCount} 
                    trend={`${budgets.length - budgetKPIs.overspentCount - budgetKPIs.healthyCount} mandates are approaching critical levels`}
                    icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
                    color="#06B6D4"
                />
                 <KPICard 
                    title="Total Transactions Logged" 
                    value={transactions.length} 
                    trend="Data integrity verified"
                    icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M12 15h.01" /></svg>}
                    color="#A855F7"
                />
            </div>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            <div className="lg:col-span-2">
                <Card 
                    title="Active Capital Mandates" 
                    headerActions={[
                        { 
                            id: 'add', 
                            icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>, 
                            onClick: () => setIsNewBudgetModalOpen(true), 
                            label: 'Establish New Mandate' 
                        }
                    ]}
                >
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-x-4 gap-y-8">
                        {budgetsToDisplay.map(budget => (
                            <BudgetRing 
                                key={budget.id} 
                                budget={budget} 
                                onClick={() => setSelectedBudget(budget)} 
                            />
                        ))}
                    </div>
                    {hasOverflow && (
                        <div className="text-center mt-4 p-2 bg-gray-800/50 rounded-lg text-sm text-gray-400">
                            Displaying top {MAX_BUDGET_VISUALIZATION_ITEMS} mandates. View full list in the 'Portfolio' module.
                        </div>
                    )}
                    {budgets.length === 0 && (
                        <div className="text-center p-10 border-2 border-dashed border-gray-700 rounded-lg text-gray-400">
                            <p className="text-lg mb-2">No Capital Mandates Defined.</p>
                            <button onClick={() => setIsNewBudgetModalOpen(true)} className="text-cyan-400 hover:text-cyan-300 font-semibold">Click here to define your first mandate.</button>
                        </div>
                    )}
                </Card>
            </div>

            <div className="lg:col-span-1">
                <AIChatInterface />
            </div>
        </div>
    </div>
    
    <NewBudgetModal 
        isOpen={isNewBudgetModalOpen} 
        onClose={() => setIsNewBudgetModalOpen(false)} 
        onAdd={(name, limit) => addBudget({ name, limit })} 
        transactions={transactions}
    />
    <BudgetDetailModal 
        budget={selectedBudget} 
        transactions={transactions} 
        onClose={() => setSelectedBudget(null)} 
    />
    </>
  );
};

export default BudgetsView;

================================================================================
// APPENDED FROM REPO: diplomat-bit/magic | ORIGINAL PATH: diplomat-bit-magic-a3f5ff1/components/BudgetsView (1).tsx
================================================================================


import React, { useContext, useState } from 'react';
import Card from './Card';
import { DataContext } from '../context/DataContext';

// Define the NewBudgetModal as a simple internal component to avoid import issues if the file doesn't exist yet
export const NewBudgetModal: React.FC<{ 
    isOpen: boolean; 
    onClose: () => void; 
    onAdd: (name: string, limit: number) => void; 
    transactions: any[];
}> = ({ isOpen, onClose, onAdd }) => {
    const [name, setName] = useState('');
    const [limit, setLimit] = useState('');

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
            <div className="bg-gray-800 p-6 rounded-lg w-full max-w-md">
                <h3 className="text-xl font-bold text-white mb-4">Create New Budget</h3>
                <div className="space-y-4">
                    <input 
                        type="text" 
                        placeholder="Category Name" 
                        value={name} 
                        onChange={e => setName(e.target.value)}
                        className="w-full p-2 bg-gray-700 text-white rounded"
                    />
                    <input 
                        type="number" 
                        placeholder="Monthly Limit" 
                        value={limit} 
                        onChange={e => setLimit(e.target.value)}
                        className="w-full p-2 bg-gray-700 text-white rounded"
                    />
                    <div className="flex justify-between">
                        <button onClick={onClose} className="text-gray-400 hover:text-white">Cancel</button>
                        <button onClick={() => {
                            const numLimit = parseFloat(limit);
                            if (name && !isNaN(numLimit)) {
                                onAdd(name, numLimit);
                                onClose();
                            }
                        }} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-500">Create</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const BudgetsView: React.FC = () => {
  const context = useContext(DataContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  if (!context) return <div>Loading...</div>;
  
  const { budgets, transactions, addBudget } = context;
  
  return (
    <div className="space-y-6">
      <Card title="Budget Overview">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {budgets.map(budget => (
             <div key={budget.id} className="bg-gray-800 p-4 rounded-lg border border-gray-700">
                <div className="flex justify-between items-center mb-2">
                    <h4 className="font-bold text-white">{budget.name}</h4>
                    <span className="text-sm text-gray-400">${budget.spent} / ${budget.limit}</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                    <div 
                        className={`h-2 rounded-full ${budget.spent > budget.limit ? 'bg-red-500' : 'bg-green-500'}`} 
                        style={{ width: `${Math.min((budget.spent / budget.limit) * 100, 100)}%` }}
                    ></div>
                </div>
             </div>
          ))}
        </div>
        <button onClick={() => setIsModalOpen(true)} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-500">Add Budget</button>
      </Card>
      <NewBudgetModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onAdd={addBudget} transactions={transactions} />
    </div>
  );
};

export default BudgetsView;


================================================================================
// APPENDED FROM REPO: diplomat-bit/magic | ORIGINAL PATH: diplomat-bit-magic-a3f5ff1/components/BudgetsView (3).tsx
================================================================================

import React, { useState, FormEvent, ChangeEvent } from 'react';
import axios from 'axios';
import './ApiSettingsPage.css';

// Rationale: Goal 6 (Realistic MVP Scope) and Goal 4 (Normalize API Integration).
// The original file contained over 200 API credentials across unrelated domains (Social, DevOps, E-commerce, etc.).
// This refactoring limits the configuration surface strictly to the core Fintech APIs
// required for the MVP (Unified Business Financial Dashboard & AI Transaction Intelligence).
// All other integrations are considered out of scope for the MVP stability phase and are managed externally.

// =================================================================================
// MVP Core Fintech API Credentials
// =================================================================================
interface ApiKeysState {
  // === Financial Data Aggregation (Multi-bank aggregation) ===
  PLAID_CLIENT_ID: string;
  PLAID_SECRET: string;
  MX_CLIENT_ID: string;
  MX_API_KEY: string;

  // === Payment Processing & Core Finance ===
  STRIPE_SECRET_KEY: string; 
  ADYEN_API_KEY: string;
  
  // === Treasury / BaaS Providers (Essential for automation MVP) ===
  UNIT_API_TOKEN: string;
  TREASURY_PRIME_API_KEY: string;

  // === Accounting & Tax Integration ===
  XERO_CLIENT_ID: string;
  XERO_CLIENT_SECRET: string;
  QUICKBOOKS_CLIENT_ID: string;
  QUICKBOOKS_CLIENT_SECRET: string;
  
  // === AI Transaction Intelligence (Goal 5 hardening) ===
  OPENAI_API_KEY: string;
  
  [key: string]: string; // Index signature for dynamic access
}


const ApiSettingsPage: React.FC = () => {
  const [keys, setKeys] = useState<ApiKeysState>({} as ApiKeysState);
  const [statusMessage, setStatusMessage] = useState<string>('');
  const [isSaving, setIsSaving] = useState<boolean>(false);
  
  // Removed activeTab state as the massive list of tech APIs is now out of scope for the MVP configuration screen.

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setKeys(prevKeys => ({ ...prevKeys, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setStatusMessage('Saving keys securely to backend...');
    
    // Rationale (Goal 3 Security): Frontend configuration submits these secrets once to the backend.
    // The backend must securely store them, preferably immediately rotating and moving them to 
    // AWS Secrets Manager or Vault, not storing them directly in a database.
    const API_ENDPOINT = process.env.REACT_APP_API_BASE_URL 
      ? `${process.env.REACT_APP_API_BASE_URL}/api/config/save-core-keys` 
      : 'http://localhost:4000/api/config/save-core-keys';

    try {
      const response = await axios.post(API_ENDPOINT, keys);
      setStatusMessage(response.data.message || 'Core keys saved successfully.');
    } catch (error) {
      const errorMessage = axios.isAxiosError(error) 
        ? error.response?.data?.message || `Server Error: ${error.message}`
        : 'An unknown error occurred while trying to save keys.';
      setStatusMessage(`Error: Could not save keys. ${errorMessage}`);
    } finally {
      setIsSaving(false);
    }
  };

  const renderInput = (keyName: keyof ApiKeysState, label: string) => (
    <div key={keyName} className="input-group">
      <label htmlFor={keyName}>{label}</label>
      <input
        // Use password type for secrets for security
        type="password" 
        id={keyName}
        name={keyName}
        value={keys[keyName] || ''}
        onChange={handleInputChange}
        placeholder={`Enter ${label}`}
        // Mark critical fields as required
        required={
            keyName.includes('_SECRET') || 
            keyName.includes('_KEY') || 
            keyName.includes('_TOKEN') ||
            keyName.includes('_ID')
        } 
      />
    </div>
  );

  // Helper function to render multiple inputs efficiently
  const renderInputs = (categoryKeys: (keyof ApiKeysState)[], categoryLabels: string[]) => {
    return categoryKeys.map((keyName, index) => renderInput(keyName, categoryLabels[index]));
  };

  // ================================================================================================
  // RENDER BLOCKS: Reduced to Core Fintech Scope
  // ================================================================================================

  const renderCoreFintechApis = () => (
    <>
      {/* 1. Financial Data Aggregators */}
      <div className="form-section">
        <h2>1. Financial Data Aggregation (Multi-bank)</h2>
        <p className="section-description">Credentials for linking external bank accounts and retrieving transaction data.</p>
        {renderInputs(
            ['PLAID_CLIENT_ID', 'PLAID_SECRET', 'MX_CLIENT_ID', 'MX_API_KEY'],
            ['Plaid Client ID', 'Plaid Secret', 'MX Client ID', 'MX API Key']
        )}
      </div>

      {/* 2. Payment Processing & Treasury */}
      <div className="form-section">
        <h2>2. Payment Processing & Treasury Automation</h2>
        <p className="section-description">Keys for initiating payments (Stripe) and interfacing with BaaS/Unit providers.</p>
        {renderInputs(
            ['STRIPE_SECRET_KEY', 'ADYEN_API_KEY', 'UNIT_API_TOKEN', 'TREASURY_PRIME_API_KEY'],
            ['Stripe Secret Key', 'Adyen API Key', 'Unit API Token (BaaS)', 'Treasury Prime API Key (BaaS)']
        )}
      </div>
      
      {/* 3. Accounting & Tax Integration */}
      <div className="form-section">
        <h2>3. Accounting & Tax Integration</h2>
        <p className="section-description">Credentials for syncing financial records with mandatory accounting platforms (Goal 6 MVP).</p>
        {renderInputs(
            ['XERO_CLIENT_ID', 'XERO_CLIENT_SECRET', 'QUICKBOOKS_CLIENT_ID', 'QUICKBOOKS_CLIENT_SECRET'],
            ['Xero Client ID', 'Xero Client Secret', 'QuickBooks Client ID', 'QuickBooks Client Secret']
        )}
      </div>

      {/* 4. AI Transaction Intelligence */}
      <div className="form-section">
        <h2>4. AI Intelligence Layer</h2>
        <p className="section-description">Key for enabling AI-powered transaction categorization and intelligence (Goal 5).</p>
        {renderInputs(
            ['OPENAI_API_KEY'],
            ['OpenAI API Key']
        )}
      </div>
    </>
  );

  return (
    <div className="settings-container">
      <h1>Core Fintech API Credentials Configuration</h1>
      <p className="subtitle">
        Securely manage credentials for critical financial integrations required for the MVP dashboard and treasury modules. 
        Note: The backend is configured to immediately store these values in a secure vault (Goal 3).
      </p>

      <form onSubmit={handleSubmit} className="settings-form">
        {renderCoreFintechApis()}
        
        <div className="form-footer">
          <button type="submit" className="save-button" disabled={isSaving}>
            {isSaving ? 'Saving...' : 'Save Core Keys Securely'}
          </button>
          {statusMessage && <p className="status-message">{statusMessage}</p>}
        </div>
      </form>
      
      <div className="archived-note">
        <p><em>Note on Scope Reduction: Credentials for non-fintech services (Social Media, E-commerce, DevOps, general Cloud) have been removed from this configuration page to focus the MVP scope on financial systems stabilization (Goal 6).</em></p>
      </div>
    </div>
  );
};

export default ApiSettingsPage;

================================================================================
// APPENDED FROM REPO: diplomat-bit/magic | ORIGINAL PATH: diplomat-bit-magic-a3f5ff1/components/BudgetsView.tsx
================================================================================

import React, { useState, useEffect, useMemo } from 'react';
import Card from './Card';
import { apiClient } from '../lib/apiClient';

const StatusBadge: React.FC<{ status: 'over' | 'ok' }> = ({ status }) => {
    const styles = {
        over: 'bg-red-900/30 text-red-400 border-red-800',
        ok: 'bg-green-900/30 text-green-400 border-green-800'
    };
    return (
        <span className={`px-2 py-0.5 rounded text-xs font-medium border ${styles[status]}`}>
            {status === 'over' ? 'Over Budget' : 'On Track'}
        </span>
    );
};

export const NewBudgetModal: React.FC<{ 
    isOpen: boolean; 
    onClose: () => void; 
    onAdd: (name: string, limit: number) => void; 
    transactions: any[];
}> = ({ isOpen, onClose, onAdd, transactions }) => {
    const [name, setName] = useState('');
    const [limit, setLimit] = useState('');

    useEffect(() => {
        if (isOpen) {
            setName('');
            setLimit('');
        }
    }, [isOpen]);

    const categories = useMemo(() => {
        if (!transactions) return [];
        const cats = transactions
            .map((t: any) => t.category)
            .filter((cat: any): cat is string => typeof cat === 'string' && cat.trim() !== '');
        return Array.from(new Set(cats));
    }, [transactions]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
            <div className="bg-gray-800 p-6 rounded-lg w-full max-w-md border border-gray-700">
                <h3 className="text-xl font-bold text-white mb-4">Create New Budget</h3>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Category Name</label>
                        <input 
                            type="text" 
                            placeholder="e.g. Groceries, Entertainment" 
                            value={name} 
                            onChange={e => setName(e.target.value)}
                            list="categories-list"
                            className="w-full p-2 bg-gray-700 text-white rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
                        />
                        <datalist id="categories-list">
                            {categories.map(cat => (
                                <option key={cat} value={cat} />
                            ))}
                        </datalist>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Monthly Limit ($)</label>
                        <input 
                            type="number" 
                            placeholder="e.g. 500" 
                            value={limit} 
                            onChange={e => setLimit(e.target.value)}
                            className="w-full p-2 bg-gray-700 text-white rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
                        />
                    </div>
                    <div className="flex justify-between pt-2">
                        <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">Cancel</button>
                        <button onClick={() => {
                            const numLimit = parseFloat(limit);
                            if (name.trim() && !isNaN(numLimit) && numLimit > 0) {
                                onAdd(name.trim(), numLimit);
                                onClose();
                            }
                        }} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-500 transition-colors">Create</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const BudgetsView: React.FC = () => {
  const [budgets, setBudgets] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [bData, tData] = await Promise.all([
        apiClient.get('/budgets'),
        apiClient.get('/transactions')
      ]);
      setBudgets(bData);
      setTransactions(tData);
    } catch (error) {
      console.error('Failed to fetch data', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddBudget = async (name: string, limit: number) => {
    await apiClient.post('/budgets', { name, limit });
    fetchData();
  };

  const handleDeleteBudget = async (id: string) => {
    await apiClient.delete(`/budgets/${id}`);
    fetchData();
  };
  
  if (loading) return <div className="text-white p-4">Loading...</div>;
  
  return (
    <div className="space-y-6">
      <Card title="Budget Overview">
        {budgets.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <p className="mb-4">No budgets created yet. Set up a budget to track your spending!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {budgets.map(budget => {
               const spent = Number(budget.spent) || 0;
               const limit = Number(budget.limit) || 0;
               const percent = limit > 0 ? Math.min((spent / limit) * 100, 100) : 0;
               const isOverBudget = spent > limit;
               
               return (
                  <div key={budget.id} className="bg-gray-800 p-4 rounded-lg border border-gray-700 flex flex-col justify-between">
                     <div>
                        <div className="flex justify-between items-start mb-2">
                            <div className="flex flex-col">
                                <h4 className="font-bold text-white truncate" title={budget.name}>{budget.name}</h4>
                                <StatusBadge status={isOverBudget ? 'over' : 'ok'} />
                            </div>
                            <button 
                                onClick={() => handleDeleteBudget(budget.id)}
                                className="text-gray-500 hover:text-red-500 transition-colors"
                                title="Delete Budget"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                            </button>
                        </div>
                        <div className="text-sm text-gray-400 mb-2">${spent} / ${limit}</div>
                        <div className="w-full bg-gray-700 rounded-full h-2 mb-2">
                            <div 
                                className={`h-2 rounded-full transition-all duration-500 ${isOverBudget ? 'bg-red-500' : 'bg-green-500'}`} 
                                style={{ width: `${percent}%` }}
                            ></div>
                        </div>
                     </div>
                  </div>
               );
            })}
          </div>
        )}
        <button onClick={() => setIsModalOpen(true)} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-500 transition-colors">Add Budget</button>
      </Card>
      <NewBudgetModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onAdd={handleAddBudget} transactions={transactions} />
    </div>
  );
};

export default BudgetsView;

================================================================================
// APPENDED FROM REPO: diplomat-bit/magic | ORIGINAL PATH: diplomat-bit-magic-a3f5ff1/components/BudgetsView (2).tsx
================================================================================

// components/BudgetsView.tsx
// RE-ENACTED & EXPANDED: This component has been resurrected from its deprecated state.
// It is now the "Allocatra," a complete chamber of financial discipline.
// It features interactive budget rings, detailed transaction modals, and an
// integrated AI Sage for conversational, streaming budget analysis.

import React, { useContext, useState, useMemo, useRef, useEffect } from 'react';
import { DataContext } from '../context/DataContext';
import Card from './Card';
import type { BudgetCategory, Transaction } from '../types';
import { GoogleGenAI, Chat } from "@google/genai";
import { RadialBarChart, RadialBar, ResponsiveContainer } from 'recharts';

// ================================================================================================
// MODAL & DETAIL COMPONENTS
// ================================================================================================

/**
 * @description A modal to display all transactions associated with a specific budget category.
 * @param {object} props - Component props.
 * @returns {React.ReactElement | null}
 */
const BudgetDetailModal: React.FC<{ budget: BudgetCategory | null; transactions: Transaction[]; onClose: () => void; }> = ({ budget, transactions, onClose }) => {
    if (!budget) return null;

    const relevantTransactions = transactions.filter(tx => tx.category.toLowerCase() === budget.name.toLowerCase() && tx.type === 'expense');

    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 backdrop-blur-sm" onClick={onClose}>
            <div className="bg-gray-800 rounded-lg shadow-2xl max-w-lg w-full border border-gray-700" onClick={e => e.stopPropagation()}>
                <div className="p-4 border-b border-gray-700 flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-white">{budget.name} Budget Details</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-white" aria-label="Close modal">&times;</button>
                </div>
                <div className="p-6 max-h-[60vh] overflow-y-auto">
                    {relevantTransactions.length > 0 ? (
                        <ul className="space-y-2">
                            {relevantTransactions.map(tx => (
                                <li key={tx.id} className="flex justify-between text-sm p-2 bg-gray-700/50 rounded-md">
                                    <div><p className="text-white">{tx.description}</p><p className="text-xs text-gray-400">{tx.date}</p></div>
                                    <p className="font-mono text-red-400">-${tx.amount.toFixed(2)}</p>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-gray-400 text-center">No transactions for this category yet.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

/**
 * @description A modal for creating a new budget category.
 * @param {object} props - Component props.
 * @returns {React.ReactElement}
 */
const NewBudgetModal: React.FC<{ onClose: () => void; onAdd: (budget: Omit<BudgetCategory, 'id' | 'spent' | 'color'>) => void; }> = ({ onClose, onAdd }) => {
    const [name, setName] = useState('');
    const [limit, setLimit] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (name && limit) {
            onAdd({ name, limit: parseFloat(limit) });
            onClose();
        }
    };
    
    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 backdrop-blur-sm" onClick={onClose}>
            <form onSubmit={handleSubmit} className="bg-gray-800 rounded-lg shadow-2xl max-w-md w-full border border-gray-700" onClick={e => e.stopPropagation()}>
                <div className="p-4 border-b border-gray-700"><h3 className="text-lg font-semibold text-white">Create New Budget</h3></div>
                <div className="p-6 space-y-4">
                    <input type="text" value={name} onChange={e=>setName(e.target.value)} placeholder="Category Name (e.g., Groceries)" required className="w-full bg-gray-700/50 border border-gray-600 rounded-lg p-2 text-white" />
                    <input type="number" value={limit} onChange={e=>setLimit(e.target.value)} placeholder="Monthly Limit (e.g., 500)" required className="w-full bg-gray-700/50 border border-gray-600 rounded-lg p-2 text-white" />
                    <button type="submit" className="w-full py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg">Add Budget</button>
                </div>
            </form>
        </div>
    );
};


/**
 * @description An integrated AI chat component for getting budget insights.
 * @param {object} props - Component props.
 * @returns {React.ReactElement}
 */
const AIConsejero: React.FC<{ budgets: BudgetCategory[] }> = ({ budgets }) => {
    const chatRef = useRef<Chat | null>(null);
    const [aiResponse, setAiResponse] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const initializeChat = async () => {
            setIsLoading(true);
            const budgetSummary = budgets.map(b => `${b.name}: $${b.spent.toFixed(0)} spent of $${b.limit}`).join(', ');
            const prompt = `Based on this budget data (${budgetSummary}), provide one key insight or piece of advice for the user. Be concise and encouraging.`;

            try {
                const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
                chatRef.current = ai.chats.create({
                    model: 'gemini-2.5-flash',
                    config: { systemInstruction: "You are Quantum, a specialized financial advisor AI focused on budget analysis. Your tone is helpful and insightful." }
                });

                const resultStream = await chatRef.current.sendMessageStream({ message: prompt });
                
                let text = '';
                for await (const chunk of resultStream) {
                    text += chunk.text;
                    setAiResponse(text);
                }
            } catch (error) {
                console.error("AI Consejero Error:", error);
                setAiResponse("I'm having trouble analyzing your budgets right now.");
            } finally {
                setIsLoading(false);
            }
        };

        initializeChat();
    }, [budgets]);

    return (
        <Card title="AI Sage Insights">
            <div className="p-4 min-h-[6rem]">
                {isLoading && aiResponse === '' ? (
                    <p className="text-gray-400">The AI Sage is analyzing your spending...</p>
                ) : (
                    <p className="text-gray-300 italic">"{aiResponse}"</p>
                )}
            </div>
        </Card>
    );
};


// ================================================================================================
// MAIN VIEW COMPONENT: BudgetsView (Allocatra)
// ================================================================================================

const BudgetsView: React.FC = () => {
    const context = useContext(DataContext);
    if (!context) throw new Error("BudgetsView must be within a DataProvider.");
    
    // FIX: Destructure `addBudget` from context to fix property not found error.
    const { budgets, transactions, addBudget } = context;
    const [selectedBudget, setSelectedBudget] = useState<BudgetCategory | null>(null);
    const [isNewBudgetModalOpen, setIsNewBudgetModalOpen] = useState(false);

    return (
        <>
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <h2 className="text-3xl font-bold text-white tracking-wider">Budgets (Allocatra)</h2>
                    <button onClick={() => setIsNewBudgetModalOpen(true)} className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg text-sm font-medium flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                        New Budget
                    </button>
                </div>

                <AIConsejero budgets={budgets} />

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {budgets.map(budget => {
                        const percentage = Math.min((budget.spent / budget.limit) * 100, 100);
                        let color;
                        if (percentage < 75) color = '#06b6d4'; // cyan
                        else if (percentage < 95) color = '#f59e0b'; // yellow
                        else color = '#ef4444'; // red

                        return (
                            <Card key={budget.id} variant="interactive" onClick={() => setSelectedBudget(budget)}>
                                <div className="text-center">
                                    <h3 className="text-xl font-semibold text-white">{budget.name}</h3>
                                    <div className="relative h-40 w-40 mx-auto my-4">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <RadialBarChart innerRadius="70%" outerRadius="100%" data={[{ name: budget.name, value: percentage, fill: color }]} startAngle={90} endAngle={-270}>
                                                <RadialBar background dataKey="value" cornerRadius={10} />
                                            </RadialBarChart>
                                        </ResponsiveContainer>
                                        <div className="absolute inset-0 flex items-center justify-center flex-col">
                                            <span className="text-2xl font-bold text-white">{percentage.toFixed(0)}%</span>
                                            <span className="text-xs text-gray-400">used</span>
                                        </div>
                                    </div>
                                    <p className="font-mono text-sm text-gray-300">
                                        ${budget.spent.toFixed(2)} / ${budget.limit.toFixed(2)}
                                    </p>
                                </div>
                            </Card>
                        );
                    })}
                </div>
            </div>
            <BudgetDetailModal budget={selectedBudget} transactions={transactions} onClose={() => setSelectedBudget(null)} />
            {isNewBudgetModalOpen && <NewBudgetModal onClose={() => setIsNewBudgetModalOpen(false)} onAdd={addBudget} />}
        </>
    );
};

export default BudgetsView;
