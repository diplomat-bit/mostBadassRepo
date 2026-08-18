// REPOSITORY SOURCE: diplomat-bit/aibanking.dev-demai-jocalll3 | PATH: diplomat-bit-aibanking.dev-demai-jocalll3-f8b6983/components/AIAdvisorView.tsx
================================================================================

import React, { useState, useEffect, useRef, useContext, useReducer, useCallback, useMemo } from 'react';
import { View } from '../types';
import Card from './Card';
// FIX: Removed FunctionCallingMode as it's not a valid export. The mode will be set with a string literal.
import { GoogleGenAI, Chat, Content, Part, FunctionDeclaration, Tool } from "@google/genai";
import { DataContext } from '../context/DataContext';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, LineChart, Line, CartesianGrid } from 'recharts';

// --- INLINE SVG ICONS (Replaced react-icons) ---
const FaRobot: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24" {...props}><path d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8z"></path><path d="M13 10h-2V7h2v3zm-2 2h2v2h-2v-2zm-3-2H7v2h2v-2zm8 0h-2v2h2v-2z"></path><circle cx="12" cy="12" r="2"></circle></svg>
);
const FaUser: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24" {...props}><path d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8z"></path><path d="M12 6c-1.654 0-3 1.346-3 3s1.346 3 3 3 3-1.346 3-3-1.346-3-3-3zm0 10c-2.674 0-8 1.339-8 4v2h16v-2c0-2.661-5.326-4-8-4z"></path></svg>
);
const FaTools: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24" {...props}><path d="M20.84 3.9l-1.42 1.42c1.78 1.78 2.87 4.24 2.87 6.94s-1.08 5.16-2.87 6.94l1.42 1.42C23.43 18.07 24 15.14 24 12s-.57-6.07-3.16-8.1zm-3.54 3.54c.95.95 1.54 2.26 1.54 3.66s-.58 2.71-1.54 3.66l1.41 1.41c1.71-1.71 2.75-4.02 2.75-6.57s-1.04-4.86-2.75-6.57L17.3 7.44zM2 12c0-3.14.99-6.07 2.65-8.38L3.23 2.2C.57 5.93 0 8.86 0 12s.57 6.07 3.23 9.8l1.42-1.42C2.99 18.07 2 15.14 2 12z"></path><path d="M12 12m-3 0a3 3 0 1 0 6 0 3 3 0 1 0-6 0"></path><path d="M8.11 6.38 6.7 4.96C5.04 6.63 4 8.94 4 11.4c0 .56.08 1.12.22 1.66l1.46-1.46c-.05-.23-.08-.47-.08-.7 0-1.77 1.02-3.29 2.5-4.02z"></path></svg>
);
const FaExclamationCircle: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24" {...props}><path d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8z"></path><path d="M11 11h2v6h-2zm0-4h2v2h-2z"></path></svg>
);
const FaClipboard: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24" {...props}><path d="M19 3H5c-1.103 0-2 .897-2 2v14c0 1.103.897 2 2 2h14c1.103 0 2-.897 2-2V5c0-1.103-.897-2-2-2zM5 19V5h14l.002 14H5z"></path><path d="M10 10h4v4h-4zm-1-5h6v2h-6z"></path></svg>
);
const FaClipboardCheck: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24" {...props}><path d="m13.354 11.646-2-2-.708.708L12.293 13l-1.647 1.646.708.708 2-2a.5.5 0 0 0 0-.708z"></path><path d="M19 3H5c-1.103 0-2 .897-2 2v14c0 1.103.897 2 2 2h14c1.103 0 2-.897 2-2V5c0-1.103-.897-2-2-2zM5 19V5h14l.002 14H5z"></path><path d="M9 4h6v2H9z"></path></svg>
);
const FaRedo: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24" {...props}><path d="M21 8c-1.423 0-2.7.543-3.678 1.414L14.414 6.5C14.776 6.177 15 5.696 15 5.165V3c0-1.103-.897-2-2-2H4c-1.103 0-2 .897-2 2v2c0 1.103.897 2 2 2h7.322l-4.702 4.702A4.954 4.954 0 0 0 5.014 13c-1.423 0-2.7.543-3.678 1.414A4.954 4.954 0 0 0 0 17.914C0 20.729 2.271 23 5.086 23c2.815 0 5.086-2.271 5.086-5.086 0-.704-.153-1.373-.418-2L13 12.678V16c0 1.103.897 2 2 2h5c1.103 0 2-.897 2-2v-2c0-1.103-.897-2-2-2zM5.086 21C3.391 21 2 19.609 2 17.914c0-1.139.63-2.13 1.554-2.617A2.96 2.96 0 0 1 5.086 15c1.695 0 3.086 1.391 3.086 3.086S6.781 21 5.086 21z"></path></svg>
);

// --- ENHANCED TYPES FOR A REAL-WORLD APPLICATION ---

export type ToolCallPart = {
    functionCall: {
        name: string;
        args: Record<string, any>;
    };
};

export type ToolResultPart = {
    functionResponse: {
        name: string;
        response: Record<string, any>;
    };
};

export type RichContent = {
    type: 'table';
    data: {
        headers: string[];
        rows: (string | number)[][];
    };
} | {
    type: 'bar_chart';
    data: {
        dataKey: string;
        items: Record<string, string | number>[];
    };
} | {
    type: 'line_chart';
    data: {
        dataKeyX: string;
        dataKeyY: string;
        items: Record<string, string | number>[];
    };
} | {
    type: 'financial_summary';
    data: {
        totalBalance: number;
        totalAssets: number;
        totalLiabilities: number;
        netWorth: number;
    };
} | {
    type: 'actionable_suggestion';
    data: {
        title: string;
        description: string;
        actionText: string;
        actionPayload: Record<string, any>;
    };
};

export type RichContentPart = {
    richContent: RichContent;
};

export type MessagePart = { text: string } | ToolCallPart | ToolResultPart | RichContentPart;

export type EnhancedMessage = {
    id: string;
    role: 'user' | 'model' | 'system_tool';
    parts: MessagePart[];
    timestamp: Date;
};

export type ChatState = {
    conversationId: string;
    messages: EnhancedMessage[];
    isLoading: boolean;
    error: string | null;
    isToolExecuting: boolean;
    toolExecutionName: string | null;
};

export type ChatAction =
    | { type: 'START_MESSAGE_SEND' }
    | { type: 'ADD_USER_MESSAGE'; payload: EnhancedMessage }
    | { type: 'ADD_MODEL_RESPONSE'; payload: EnhancedMessage }
    | { type: 'SET_ERROR'; payload: string }
    | { type: 'CLEAR_ERROR' }
    | { type: 'START_TOOL_EXECUTION'; payload: string }
    | { type: 'END_TOOL_EXECUTION' }
    | { type: 'RESET_CHAT' };

// --- CONSTANTS AND CONFIGURATIONS ---

export const DETAILED_SYSTEM_INSTRUCTION = `You are Quantum, an advanced AI financial advisor for Demo Bank. Your persona is helpful, professional, witty, and slightly futuristic. Be concise but informative.

You have access to a set of powerful tools to retrieve user data and perform financial calculations. Your primary goal is to assist the user with their financial inquiries by using these tools.

Tool Usage Rules:
1.  **Always Inform:** Before using a tool, tell the user what you are about to do. E.g., "I'll just access your recent transactions to check on that..."
2.  **Acknowledge Results:** After a tool runs, briefly acknowledge the result before presenting your analysis. E.g., "Okay, I've got the data. It looks like..."
3.  **Synthesize, Don't Dump:** Do not just output raw JSON data from tools. Analyze the data and present the key insights in a human-readable format. Use rich content components like tables and charts where appropriate.
4.  **Error Handling:** If a tool returns an error, apologize to the user, state that you couldn't retrieve the information, and ask if they'd like to try something else.
5.  **Proactive Suggestions:** Based on the user's data, provide proactive suggestions. Use the 'actionable_suggestion' rich content type for this.
6.  **Multi-turn Conversations:** Remember the context of the conversation. If a user asks a follow-up question, use the previous messages and tool results to answer.
7.  **Safety First:** Never ask for or store sensitive personal information like passwords or full social security numbers. All data access is handled securely through your tools.`;

export const examplePrompts = {
    [View.Dashboard]: ["Summarize my financial health.", "Are there any anomalies I should be aware of?", "Project my balance for the next 6 months."],
    [View.Transactions]: ["Find all my transactions over $100.", "What was my biggest expense last month?", "Show my spending by category in a bar chart."],
    [View.Budgets]: ["How am I doing on my budgets?", "Suggest a new budget for 'Entertainment'.", "Where can I cut back on spending?"],
    [View.Investments]: ["What's the performance of my stock portfolio?", "Explain ESG investing to me.", "Simulate my portfolio growth with an extra $200/month."],
    DEFAULT: ["What's my total balance?", "Help me create a savings goal.", "Explain how my credit score is calculated."]
};

// --- REDUCER FOR COMPLEX CHAT STATE MANAGEMENT ---

export const chatReducer = (state: ChatState, action: ChatAction): ChatState => {
    switch (action.type) {
        case 'START_MESSAGE_SEND':
            return { ...state, isLoading: true, error: null };
        case 'ADD_USER_MESSAGE':
            return { ...state, messages: [...state.messages, action.payload] };
        case 'ADD_MODEL_RESPONSE':
            return { ...state, messages: [...state.messages, action.payload], isLoading: false };
        case 'SET_ERROR':
            return { ...state, isLoading: false, isToolExecuting: false, error: action.payload };
        case 'CLEAR_ERROR':
            return { ...state, error: null };
        case 'START_TOOL_EXECUTION':
            return { ...state, isToolExecuting: true, toolExecutionName: action.payload };
        case 'END_TOOL_EXECUTION':
            return { ...state, isToolExecuting: false, toolExecutionName: null };
        case 'RESET_CHAT':
            return {
                ...initialChatState,
                conversationId: `conv_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
            };
        default:
            return state;
    }
};

export const initialChatState: ChatState = {
    conversationId: `conv_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
    messages: [],
    isLoading: false,
    error: null,
    isToolExecuting: false,
    toolExecutionName: null,
};


// --- TOOL DEFINITIONS AND IMPLEMENTATIONS ---

/**
 * Defines the tools available to the AI model.
 * This structure is sent to the AI to inform it of its capabilities.
 */
export const toolDefinitions: Tool[] = [
    {
        functionDeclarations: [
            {
                name: "getFinancialSummary",
                description: "Retrieves a high-level summary of the user's financial health, including total balances, assets, liabilities, and net worth.",
                parameters: { type: "OBJECT", properties: {}, required: [] },
            },
            {
                name: "getTransactions",
                description: "Fetches a list of recent transactions. Can be filtered by various criteria.",
                parameters: {
                    type: "OBJECT",
                    properties: {
                        count: { type: "NUMBER", description: "The number of transactions to retrieve. Defaults to 20." },
                        minAmount: { type: "NUMBER", description: "The minimum transaction amount to filter by." },
                        maxAmount: { type: "NUMBER", description: "The maximum transaction amount to filter by." },
                        category: { type: "STRING", description: "Filter transactions by a specific category (e.g., 'Groceries', 'Travel')." },
                    },
                    required: [],
                },
            },
            {
                name: "analyzeSpendingByCategory",
                description: "Calculates and returns the total spending for each category over the last 30 days.",
                parameters: { type: "OBJECT", properties: {}, required: [] },
            },
            {
                name: "simulateInvestmentGrowth",
                description: "Simulates the future value of an investment portfolio based on current holdings, additional monthly contributions, and an estimated annual return rate.",
                parameters: {
                    type: "OBJECT",
                    properties: {
                        additionalMonthlyContribution: { type: "NUMBER", description: "The extra amount to invest each month." },
                        years: { type: "NUMBER", description: "The number of years to simulate. Defaults to 10." },
                        annualReturnRate: { type: "NUMBER", description: "The estimated annual return rate as a percentage (e.g., 7 for 7%). Defaults to 7." },
                    },
                    required: ["additionalMonthlyContribution"],
                },
            },
        ],
    },
];

/**
 * Provides the actual implementations for the defined tools.
 * These functions interact with the application's DataContext.
 */
export const useToolImplementations = () => {
    // FIX: useContext returns the context value directly, not an object with a `data` property.
    const context = useContext(DataContext);

    return useMemo(() => ({
        getFinancialSummary: async () => {
            if (!context) return { error: "User data not available." };
            // FIX: Re-implemented logic based on available context data.
            const { transactions, assets } = context;
            const sortedTx = [...transactions].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
            let runningBalance = 5000; // Assume starting balance from BalanceSummary component
            for (const tx of sortedTx) {
                runningBalance += tx.type === 'income' ? tx.amount : -tx.amount;
            }
            const totalBalance = runningBalance;
            const totalAssetsValue = assets.reduce((sum, asset) => sum + asset.value, 0);
            const totalAssets = totalBalance + totalAssetsValue;
            const totalLiabilities = 0; // Liabilities data not available in context
            const netWorth = totalAssets - totalLiabilities;
            return { totalBalance, totalAssets, totalLiabilities, netWorth };
        },
        getTransactions: async ({ count = 20, minAmount, maxAmount, category }: { count?: number, minAmount?: number, maxAmount?: number, category?: string }) => {
            if (!context) return { error: "User data not available." };
            let filteredTransactions = context.transactions;
            if (minAmount) {
                filteredTransactions = filteredTransactions.filter(t => t.amount >= minAmount);
            }
            if (maxAmount) {
                filteredTransactions = filteredTransactions.filter(t => t.amount <= maxAmount);
            }
            if (category) {
                filteredTransactions = filteredTransactions.filter(t => t.category.toLowerCase() === category.toLowerCase());
            }
            return { transactions: filteredTransactions.slice(0, count) };
        },
        analyzeSpendingByCategory: async () => {
            if (!context) return { error: "User data not available." };
             // FIX: Corrected logic to filter by expense type.
            const spending = context.transactions.reduce<Record<string, number>>((acc, t) => {
                if (t.type === 'expense') {
                    acc[t.category] = (acc[t.category] || 0) + t.amount;
                }
                return acc;
            }, {});
            const sortedSpending = Object.entries(spending)
                .sort(([, a], [, b]) => b - a)
                .map(([name, amount]) => ({ name, amount: parseFloat(amount.toFixed(2)) }));
            return { spendingByCategory: sortedSpending };
        },
        // FIX: The AI can pass non-numeric values. Ensure robust parsing to numbers and handle potential NaN results to prevent type errors in arithmetic operations.
        simulateInvestmentGrowth: async ({ additionalMonthlyContribution, years = 10, annualReturnRate = 7 }: { additionalMonthlyContribution: any, years?: any, annualReturnRate?: any }) => {
            if (!context) return { error: "User data not available." };
            const P = context.assets.reduce((sum, asset) => sum + asset.value, 0); // Principal
            
            const pmtValue = parseFloat(String(additionalMonthlyContribution));
            const PMT = isNaN(pmtValue) ? 0 : pmtValue;

            const rateValue = parseFloat(String(annualReturnRate));
            const rate = isNaN(rateValue) ? 7.0 : rateValue;
            const r = rate / 100 / 12;

            const yearsValue = parseInt(String(years), 10);
            const n = (isNaN(yearsValue) ? 10 : yearsValue) * 12;
            
            const simulationData = [];
            let futureValue: number = P;

            for (let i = 1; i <= n; i++) {
                // FIX: Explicitly cast futureValue to a Number to resolve a TypeScript type inference issue in the arithmetic operation.
                futureValue = (Number(futureValue) * (1 + r)) + PMT;
                if (i % 12 === 0) { // Record data yearly
                    simulationData.push({
                        year: i / 12,
                        value: parseFloat(futureValue.toFixed(2)),
                    });
                }
            }

            return { finalValue: parseFloat(futureValue.toFixed(2)), simulationData };
        },
    }), [context]);
};


// --- CUSTOM HOOK FOR AI CHAT LOGIC ---

/**
 * A comprehensive hook to manage the entire AI Advisor chat lifecycle.
 */
export const useAIAdvisorChat = () => {
    const [state, dispatch] = useReducer(chatReducer, initialChatState);
    const chatRef = useRef<Chat | null>(null);
    const toolImplementations = useToolImplementations();
    // FIX: useContext returns the context value directly.
    const context = useContext(DataContext);
    const { geminiApiKey } = context || {};

    useEffect(() => {
        if (!geminiApiKey) {
            dispatch({ type: 'SET_ERROR', payload: 'Google Gemini API Key is not set. Please add it in the API Status view.' });
            return;
        }
        if (!chatRef.current) {
            try {
                const ai = new GoogleGenAI({ apiKey: geminiApiKey });
                chatRef.current = ai.chats.create({
                    // FIX: Updated model name from deprecated version.
                    model: 'gemini-2.5-pro',
                    config: {
                        systemInstruction: DETAILED_SYSTEM_INSTRUCTION
                    },
                    tools: toolDefinitions,
                    // FIX: Use string literal "AUTO" for the mode.
                    toolConfig: { functionCallingConfig: { mode: "AUTO" } },
                });
                 dispatch({ type: 'CLEAR_ERROR' });
            } catch (error) {
                console.error("Failed to initialize GoogleGenAI:", error);
                dispatch({ type: 'SET_ERROR', payload: 'Failed to initialize the AI model. Please check your API key.' });
            }
        }
    }, [geminiApiKey]);
    
    // Prime the AI with initial context when data is available
    useEffect(() => {
        const primeAI = async () => {
             // FIX: Use `context` directly. Simplified logic to just show a generic welcome.
             if (context && chatRef.current && state.messages.length === 0) {
                const welcomeMessage: EnhancedMessage = {
                    id: `msg_${Date.now()}`,
                    role: 'model',
                    parts: [{ text: "Hello! I'm Quantum, your AI financial advisor. I've reviewed your current financial standing. How can I assist you today?" }],
                    timestamp: new Date(),
                };
                dispatch({ type: 'ADD_MODEL_RESPONSE', payload: welcomeMessage });
            }
        };
        if(geminiApiKey) primeAI();
    }, [context, state.messages.length, geminiApiKey]);


    const sendMessage = useCallback(async (messageText: string) => {
        if (!messageText.trim() || !chatRef.current) return;

        dispatch({ type: 'START_MESSAGE_SEND' });

        const userMessage: EnhancedMessage = {
            id: `msg_user_${Date.now()}`,
            role: 'user',
            parts: [{ text: messageText }],
            timestamp: new Date(),
        };
        dispatch({ type: 'ADD_USER_MESSAGE', payload: userMessage });
        
        try {
            // FIX: Removed incorrect `history` parameter. The Chat object manages its own history.
            let response = await chatRef.current.sendMessage({ message: messageText });

            while (response.functionCalls && response.functionCalls.length > 0) {
                const toolCalls = response.functionCalls;
                
                const modelMessageWithToolCalls: EnhancedMessage = {
                    id: `msg_model_${Date.now()}`,
                    role: 'model',
                    parts: [...(response.text ? [{text: response.text}] : []), ...toolCalls.map(tc => ({functionCall: tc}))],
                    timestamp: new Date(),
                };
                dispatch({ type: 'ADD_MODEL_RESPONSE', payload: modelMessageWithToolCalls });

                const toolResults: ToolResultPart[] = [];
                for (const call of toolCalls) {
                    dispatch({ type: 'START_TOOL_EXECUTION', payload: call.name });
                    const toolImplementation = (toolImplementations as Record<string, Function>)[call.name];
                    if (toolImplementation) {
                        try {
                            const toolResponseData = await toolImplementation(call.args);
                            toolResults.push({
                                functionResponse: { name: call.name, response: toolResponseData },
                            });
                        } catch (e) {
                             console.error(`Error executing tool ${call.name}:`, e);
                             toolResults.push({
                                functionResponse: { name: call.name, response: { error: `Tool execution failed: ${(e as Error).message}` } },
                            });
                        }
                    } else {
                         toolResults.push({
                            functionResponse: { name: call.name, response: { error: "Tool not found." } },
                        });
                    }
                    dispatch({ type: 'END_TOOL_EXECUTION' });
                }
                
                const toolResultMessage: EnhancedMessage = {
                     id: `msg_tool_${Date.now()}`,
                     role: 'system_tool',
                     parts: toolResults,
                     timestamp: new Date(),
                };
                dispatch({ type: 'ADD_MODEL_RESPONSE', payload: toolResultMessage });

                // Send tool results back to the model
                 // FIX: Pass the toolResults object directly instead of a stringified version.
                 response = await chatRef.current.sendMessage({
                     message: toolResults,
                     isToolResponse: true
                 });
            }

            const finalModelMessage: EnhancedMessage = {
                id: `msg_model_final_${Date.now()}`,
                role: 'model',
                parts: [{ text: response.text }],
                timestamp: new Date(),
            };
            dispatch({ type: 'ADD_MODEL_RESPONSE', payload: finalModelMessage });

        } catch (error) {
            console.error("AI Advisor Error:", error);
            dispatch({ type: 'SET_ERROR', payload: "I apologize, but I've encountered a system error. Please try your request again." });
        }
    }, [toolImplementations]);
    
    const resetChat = useCallback(() => {
        chatRef.current = null; // Force re-initialization on next message
        dispatch({ type: 'RESET_CHAT' });
    }, []);

    return { state, sendMessage, resetChat };
};

// --- RICH CONTENT RENDERER COMPONENTS ---

// FIX: Corrected prop typing for all Rich Content components using `Extract` to avoid type errors.
export const FinancialSummaryCard: React.FC<{ data: Extract<RichContent, { type: 'financial_summary' }>['data'] }> = ({ data }) => (
    <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
        <h4 className="text-lg font-bold text-cyan-300 mb-3">Financial Snapshot</h4>
        <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="font-semibold text-gray-400">Total Balance:</div>
            <div className="text-right text-white">${data.totalBalance.toLocaleString()}</div>
            <div className="font-semibold text-gray-400">Total Assets:</div>
            <div className="text-right text-white">${data.totalAssets.toLocaleString()}</div>
            <div className="font-semibold text-gray-400">Total Liabilities:</div>
            <div className="text-right text-red-400">${data.totalLiabilities.toLocaleString()}</div>
            <div className="col-span-2 border-t border-gray-600 my-1"></div>
            <div className="font-bold text-gray-300">Net Worth:</div>
            <div className="text-right font-bold text-cyan-400">${data.netWorth.toLocaleString()}</div>
        </div>
    </div>
);

export const DataTable: React.FC<{ data: Extract<RichContent, { type: 'table' }>['data'] }> = ({ data }) => (
    <div className="overflow-x-auto rounded-lg border border-gray-700">
        <table className="w-full text-sm text-left text-gray-300">
            <thead className="text-xs text-cyan-300 uppercase bg-gray-700/50">
                <tr>{data.headers.map(h => <th key={h} scope="col" className="px-4 py-2">{h}</th>)}</tr>
            </thead>
            <tbody>
                {data.rows.map((row, i) => (
                    <tr key={i} className="bg-gray-800/30 border-b border-gray-700 hover:bg-gray-700/50">
                        {row.map((cell, j) => <td key={j} className="px-4 py-2">{typeof cell === 'number' ? `$${cell.toLocaleString()}` : cell}</td>)}
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
);

export const DataBarChart: React.FC<{ data: Extract<RichContent, { type: 'bar_chart' }>['data'] }> = ({ data }) => (
    <div className="h-64 w-full bg-gray-800/50 p-4 rounded-lg border border-gray-700">
        <ResponsiveContainer>
            <BarChart data={data.items}>
                <CartesianGrid strokeDasharray="3 3" stroke="#4A5568" />
                <XAxis dataKey="name" stroke="#A0AEC0" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#A0AEC0" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} />
                <Tooltip cursor={{ fill: '#4A5568' }} contentStyle={{ backgroundColor: '#1A202C', border: '1px solid #2D3748' }} />
                <Legend wrapperStyle={{fontSize: "12px"}}/>
                <Bar dataKey={data.dataKey} fill="#2DD4BF" name="Amount" />
            </BarChart>
        </ResponsiveContainer>
    </div>
);

export const DataLineChart: React.FC<{ data: Extract<RichContent, { type: 'line_chart' }>['data'] }> = ({ data }) => (
     <div className="h-64 w-full bg-gray-800/50 p-4 rounded-lg border border-gray-700">
        <ResponsiveContainer>
            <LineChart data={data.items}>
                <CartesianGrid strokeDasharray="3 3" stroke="#4A5568" />
                <XAxis dataKey={data.dataKeyX} stroke="#A0AEC0" fontSize={12} />
                <YAxis stroke="#A0AEC0" fontSize={12} tickFormatter={(value) => `$${Math.round(Number(value) / 1000)}k`}/>
                <Tooltip cursor={{ fill: '#4A5568' }} contentStyle={{ backgroundColor: '#1A202C', border: '1px solid #2D3748' }} formatter={(value:number) => `$${value.toLocaleString()}`} />
                <Legend wrapperStyle={{fontSize: "12px"}}/>
                <Line type="monotone" dataKey={data.dataKeyY} stroke="#2DD4BF" strokeWidth={2} dot={false} name="Portfolio Value" />
            </LineChart>
        </ResponsiveContainer>
    </div>
);

export const ActionableSuggestion: React.FC<{ data: Extract<RichContent, { type: 'actionable_suggestion' }>['data'], onAction: (payload: any) => void }> = ({ data, onAction }) => (
    <div className="bg-cyan-900/50 p-4 rounded-lg border border-cyan-700">
        <h4 className="text-lg font-bold text-cyan-300 mb-2">{data.title}</h4>
        <p className="text-gray-300 text-sm mb-4">{data.description}</p>
        <button
            onClick={() => onAction(data.actionPayload)}
            className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white font-semibold rounded-lg transition-colors"
        >
            {data.actionText}
        </button>
    </div>
);


export const RichContentRenderer: React.FC<{ content: RichContent, onAction: (payload: any) => void }> = ({ content, onAction }) => {
    switch (content.type) {
        case 'table':
            return <DataTable data={content.data} />;
        case 'bar_chart':
            return <DataBarChart data={content.data} />;
        case 'line_chart':
            return <DataLineChart data={content.data} />;
        case 'financial_summary':
            return <FinancialSummaryCard data={content.data} />;
        case 'actionable_suggestion':
            return <ActionableSuggestion data={content.data} onAction={onAction} />;
        default:
            return <div className="text-red-500">Unsupported rich content type</div>;
    }
};

// --- UI COMPONENTS FOR CHAT ---

export const CopyToClipboardButton: React.FC<{ text: string }> = ({ text }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <button onClick={handleCopy} className="absolute top-2 right-2 p-1.5 bg-gray-600/50 rounded-md hover:bg-gray-500/50 text-gray-300 hover:text-white transition-colors">
            {copied ? <FaClipboardCheck /> : <FaClipboard />}
        </button>
    );
};


export const MessageRenderer: React.FC<{ message: EnhancedMessage, onAction: (payload: any) => void }> = ({ message, onAction }) => {
    const { role, parts, timestamp } = message;

    const renderIcon = () => {
        switch (role) {
            case 'user': return <FaUser className="h-6 w-6 text-cyan-300" />;
            case 'model': return <FaRobot className="h-6 w-6 text-cyan-300" />;
            case 'system_tool': return <FaTools className="h-6 w-6 text-gray-400" />;
            default: return null;
        }
    };
    
    const isUser = role === 'user';
    const messageAlignment = isUser ? 'items-end' : 'items-start';
    const bubbleStyle = isUser
        ? 'bg-cyan-600 text-white'
        : 'bg-gray-700 text-gray-200';
    
    return (
        <div className={`flex flex-col ${messageAlignment} group`}>
            <div className={`flex gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
                <div className="w-8 h-8 rounded-full bg-gray-800 flex-shrink-0 flex items-center justify-center mt-1">{renderIcon()}</div>
                <div className={`max-w-xl p-3 rounded-lg shadow-md relative ${bubbleStyle}`}>
                    <div className="space-y-3">
                    {parts.map((part, index) => {
                        if ('text' in part && part.text) {
                            return <p key={index} className="whitespace-pre-wrap">{part.text}</p>;
                        }
                        if ('functionCall' in part) {
                            return (
                                <div key={index} className="text-xs text-gray-400 italic bg-gray-800/40 p-2 rounded-md">
                                    <p><strong>Tool Call:</strong> <code>{part.functionCall.name}</code></p>
                                    <pre className="text-xs mt-1">Args: {JSON.stringify(part.functionCall.args, null, 2)}</pre>
                                </div>
                            );
                        }
                        if ('functionResponse' in part) {
                            return (
                                <div key={index} className="text-xs text-gray-400 italic bg-gray-800/40 p-2 rounded-md">
                                    <p><strong>Tool Result for <code>{part.functionResponse.name}</code>:</strong></p>
                                    <pre className="text-xs mt-1">{JSON.stringify(part.functionResponse.response, null, 2)}</pre>
                                </div>
                            );
                        }
                        if ('richContent' in part) {
                            return <RichContentRenderer key={index} content={part.richContent} onAction={onAction} />;
                        }
                        return null;
                    })}
                    </div>
                    {parts.some(p => 'text' in p) && <CopyToClipboardButton text={parts.filter(p => 'text' in p).map(p => (p as {text:string}).text).join('\n')} />}
                </div>
            </div>
            <p className="text-xs text-gray-500 mt-1 px-11">{new Date(timestamp).toLocaleTimeString()}</p>
        </div>
    );
};

// --- MAIN AI ADVISOR VIEW COMPONENT ---

const AIAdvisorView: React.FC<{ previousView: View | null }> = ({ previousView }) => {
    const { state, sendMessage, resetChat } = useAIAdvisorChat();
    const { messages, isLoading, error, isToolExecuting, toolExecutionName } = state;
    const [input, setInput] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSendMessage = async (messageText: string) => {
        if (!messageText.trim()) return;
        setInput('');
        await sendMessage(messageText);
    };

    const handleSuggestionClick = (prompt: string) => {
        handleSendMessage(prompt);
    };
    
    const handleAction = (payload: any) => {
        // In a real app, this would trigger a modal, navigation, or API call
        const actionMessage = `The user wants to perform an action: ${JSON.stringify(payload)}`;
        handleSendMessage(actionMessage);
    };

    const prompts = examplePrompts[previousView || 'DEFAULT'] || examplePrompts.DEFAULT;

    return (
        <div className="h-full flex flex-col">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold text-white tracking-wider">AI Advisor (Quantum)</h2>
                <button 
                  onClick={resetChat} 
                  className="p-2 rounded-full text-gray-400 hover:bg-gray-700 hover:text-white transition-colors"
                  aria-label="Reset conversation"
                >
                    <FaRedo className="h-5 w-5" />
                </button>
            </div>
            <Card className="flex-1 flex flex-col" padding="none">
                <div className="flex-1 p-6 space-y-6 overflow-y-auto">
                    {messages.length <= 1 && !isLoading && !error && (
                        <div className="text-center p-6 text-gray-400">
                            <p className="mb-4">Since you just came from the <strong className="text-cyan-300">{previousView || 'Dashboard'}</strong>, you could ask:</p>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                                {prompts.map(p => (
                                    <button
                                        key={p}
                                        onClick={() => handleSuggestionClick(p)}
                                        className="p-3 bg-gray-700/50 hover:bg-gray-700 rounded-lg text-sm text-cyan-200 transition-colors text-left"
                                    >
                                        "{p}"
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                    {messages.map((msg) => (
                       <MessageRenderer key={msg.id} message={msg} onAction={handleAction} />
                    ))}
                    
                    {isLoading && !isToolExecuting && (
                        <div className="flex items-start gap-3">
                             <div className="w-8 h-8 rounded-full bg-gray-800 flex-shrink-0 flex items-center justify-center mt-1"><FaRobot className="h-6 w-6 text-cyan-300"/></div>
                             <div className="max-w-lg p-3 rounded-lg shadow-md bg-gray-700 text-gray-200 flex items-center gap-2">
                                <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse delay-75"></div>
                                <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse delay-150"></div>
                                <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse delay-300"></div>
                             </div>
                        </div>
                    )}

                    {isToolExecuting && (
                        <div className="flex items-center justify-center gap-2 text-sm text-gray-400 p-2">
                             <FaTools className="animate-spin text-cyan-400" />
                             <span>Accessing tool: <strong>{toolExecutionName}...</strong></span>
                        </div>
                    )}
                    
                    <div ref={messagesEndRef} />
                </div>
                
                {error && (
                    <div className="p-4 border-t border-red-500/50 bg-red-900/30 text-red-300 flex items-center gap-3">
                         <FaExclamationCircle className="h-5 w-5 flex-shrink-0" />
                         <p className="text-sm">{error}</p>
                    </div>
                )}

                <div className="p-4 border-t border-gray-700/60 bg-gray-800/50 rounded-b-xl">
                    <form onSubmit={(e) => { e.preventDefault(); handleSendMessage(input); }} className="flex items-center gap-2">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Ask Quantum anything..."
                            className="flex-grow bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all"
                            disabled={isLoading || !!error}
                            aria-label="Chat input for AI Advisor"
                        />
                        <button
                            type="submit"
                            className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white font-semibold rounded-lg disabled:opacity-50 flex items-center justify-center w-24 transition-colors"
                            disabled={isLoading || !input.trim() || !!error}
                            aria-label="Send message"
                        >
                            {isLoading ? (
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            ) : (
                                'Send'
                            )}
                        </button>
                    </form>
                    <p className="text-xs text-gray-500 mt-2 text-center">Quantum can make mistakes. Consider checking important information.</p>
                </div>
            </Card>
        </div>
    );
};

export default AIAdvisorView;


================================================================================
// APPENDED FROM REPO: diplomat-bit/aibanking.dev-jocall3-new | ORIGINAL PATH: diplomat-bit-aibanking.dev-jocall3-new-84d7a30/components/AIAdvisorView.tsx
================================================================================


import React, { useState, useEffect, useRef, useContext } from 'react';
import Card from './Card';
import { DataContext } from '../context/DataContext';
import { Bot, Send, Loader2, Cpu, User, Sparkles } from 'lucide-react';

const AIAdvisorView: React.FC = () => {
    const { askSovereignAI } = useContext(DataContext)!;
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState<{role: 'ai' | 'user', text: string}[]>([
        { role: 'ai', text: 'Sovereign AI Core operational. I have processed your current portfolio and market conditions. How shall we optimize your reality today?' }
    ]);
    const [isLoading, setIsLoading] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;
        
        const userText = input;
        setInput('');
        setMessages(prev => [...prev, { role: 'user', text: userText }]);
        setIsLoading(true);
        
        const response = await askSovereignAI(userText);
        setMessages(prev => [...prev, { role: 'ai', text: response }]);
        setIsLoading(false);
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500 h-[calc(100vh-120px)] flex flex-col">
            <header className="flex justify-between items-center border-b border-gray-800 pb-4 shrink-0">
                <div>
                    <h2 className="text-3xl font-black text-white tracking-tighter uppercase italic">Sovereign Advisor</h2>
                    <p className="text-emerald-400 text-xs font-mono tracking-widest">NEURAL_GUIDANCE // STATION_01</p>
                </div>
                <div className="p-3 bg-emerald-500/10 rounded-xl border border-emerald-500/20 text-emerald-400 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                    <span className="text-[10px] font-bold uppercase tracking-widest">Signal: Optimal</span>
                </div>
            </header>

            <Card className="flex-1 flex flex-col overflow-hidden bg-black/40 border-indigo-900/30 relative">
                <div className="absolute inset-0 bg-grid-white/[0.01] pointer-events-none"></div>
                
                {/* Chat Feed */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar relative z-10">
                    {messages.map((msg, idx) => (
                        <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2`}>
                            <div className={`max-w-[80%] flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                                <div className={`w-10 h-10 rounded-xl shrink-0 flex items-center justify-center border ${
                                    msg.role === 'user' ? 'bg-indigo-900/50 border-indigo-500/30 text-indigo-400' : 'bg-emerald-900/50 border-emerald-500/30 text-emerald-400'
                                }`}>
                                    {msg.role === 'user' ? <User size={20} /> : <Bot size={20} />}
                                </div>
                                <div className={`p-5 rounded-2xl shadow-xl text-sm leading-relaxed ${
                                    msg.role === 'user' 
                                    ? 'bg-indigo-600 text-white rounded-tr-none' 
                                    : 'bg-gray-900/80 text-gray-200 rounded-tl-none border border-gray-800'
                                }`}>
                                    {msg.text}
                                </div>
                            </div>
                        </div>
                    ))}
                    {isLoading && (
                        <div className="flex justify-start animate-in fade-in">
                            <div className="w-10 h-10 rounded-xl bg-gray-900 border border-gray-800 flex items-center justify-center text-emerald-400 mr-4">
                                <Loader2 className="animate-spin" size={20} />
                            </div>
                            <div className="bg-gray-900/80 p-4 rounded-2xl rounded-tl-none border border-gray-800 flex items-center gap-3">
                                <span className="text-xs font-mono text-emerald-400 animate-pulse uppercase tracking-widest">Thinking...</span>
                            </div>
                        </div>
                    )}
                    <div ref={scrollRef} />
                </div>

                {/* Input Matrix */}
                <div className="p-6 bg-gray-950/80 border-t border-gray-800 relative z-10">
                    <div className="relative group">
                        <div className="absolute inset-0 bg-indigo-500/5 blur-xl group-focus-within:bg-indigo-500/10 transition-all rounded-2xl"></div>
                        <div className="relative flex gap-4 bg-gray-900 border border-gray-700 rounded-2xl p-2 pl-6 focus-within:border-indigo-500 transition-all shadow-2xl">
                            <input 
                                type="text" 
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                                className="flex-1 bg-transparent border-none outline-none text-white placeholder-gray-600 text-sm font-medium"
                                placeholder="Direct command to Sovereign AI..."
                                disabled={isLoading}
                            />
                            <button 
                                onClick={handleSend}
                                disabled={isLoading || !input.trim()}
                                className="bg-indigo-600 hover:bg-indigo-500 disabled:bg-gray-800 text-white p-3 rounded-xl transition-all shadow-lg shadow-indigo-500/20 active:scale-95"
                            >
                                <Send size={20} />
                            </button>
                        </div>
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default AIAdvisorView;


================================================================================
// APPENDED FROM REPO: diplomat-bit/almost | ORIGINAL PATH: diplomat-bit-almost-93a5466/components/AIAdvisorView.tsx
================================================================================

import React, { useState, useEffect, useRef, useContext, useCallback, createContext } from 'react';
import { GoogleGenAI, ChatSession } from "@google/genai";
import { DataContext } from '../context/DataContext';
import { View } from '../types';
import Card from './Card';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, PointElement, LineElement } from 'chart.js';
import { Chart } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, PointElement, LineElement);

// ================================================================================================
// TYPE DEFINITIONS & AUDIT LOGGING
// ================================================================================================

export type AuditEntry = {
    timestamp: Date;
    action: string;
    actor: 'user' | 'ai' | 'system';
    details: string;
    securityLevel: 'standard' | 'elevated' | 'critical';
};

export type Message = {
    id: string;
    role: 'user' | 'model' | 'system';
    parts: { text: string }[];
    timestamp: Date;
    chartData?: any;
    tableData?: any;
    actionSuggestions?: ActionSuggestion[];
    isSecurityAlert?: boolean;
    auditRef?: string;
};

export type ActionSuggestion = {
    id: string;
    text: string;
    actionType: 'payment' | 'integration' | 'analytics' | 'security';
    payload?: any;
};

// ================================================================================================
// QUANTUM FINANCIAL TOOLS (WIRE, ACH, ERP, FRAUD)
// ================================================================================================

export const QUANTUM_TOOLS = {
    INITIATE_WIRE: {
        name: "initiateWireTransfer",
        description: "Initiates a high-value international or domestic wire transfer. Requires MFA simulation.",
        parameters: { type: 'object', properties: { amount: { type: 'number' }, recipient: { type: 'string' }, currency: { type: 'string' } } }
    },
    INITIATE_ACH: {
        name: "initiateACHCollection",
        description: "Sets up an ACH batch collection for payroll or vendor payments.",
        parameters: { type: 'object', properties: { batchName: { type: 'string' }, totalAmount: { type: 'number' } } }
    },
    SYNC_ERP: {
        name: "syncAccountingSoftware",
        description: "Synchronizes real-time banking data with ERP systems like SAP, Oracle, or NetSuite.",
        parameters: { type: 'object', properties: { system: { type: 'string' }, direction: { type: 'string' } } }
    },
    FRAUD_CHECK: {
        name: "runFraudAnalysis",
        description: "Executes a heuristic scan on recent transactions to identify anomalies or velocity risks.",
        parameters: { type: 'object', properties: { timeframe: { type: 'string' } } }
    }
};

// ================================================================================================
// CORE COMPONENT
// ================================================================================================

const AIAdvisorView: React.FC<{ previousView: View | null }> = ({ previousView }) => {
    const context = useContext(DataContext);
    const [messages, setMessages] = useState<Message[]>([]);
    const [auditTrail, setAuditTrail] = useState<AuditEntry[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isMfaActive, setIsMfaActive] = useState(false);
    
    const chatRef = useRef<any>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Audit Storage Simulation
    const logAction = useCallback((action: string, actor: 'user' | 'ai' | 'system', details: string, level: AuditEntry['securityLevel'] = 'standard') => {
        const entry: AuditEntry = { timestamp: new Date(), action, actor, details, securityLevel: level };
        setAuditTrail(prev => [...prev, entry]);
        console.log(`[AUDIT LOG]: ${entry.timestamp.toISOString()} | ${entry.actor.toUpperCase()} | ${entry.action} | ${entry.details}`);
    }, []);

    useEffect(() => {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
        chatRef.current = ai.getGenerativeModel({ 
            model: "gemini-1.5-flash",
            systemInstruction: "You are the Quantum Financial AI Advisor. You provide elite, secure, and high-performance business banking insights. You can simulate Wire transfers, ACH collections, and ERP integrations. Always maintain a professional, secure tone. Mention that every action is logged in the secure audit vault."
        }).startChat({
            history: [],
            generationConfig: { maxOutputTokens: 1200 },
        });
        
        logAction("Session Initialized", "system", "Quantum AI Core connected to secure terminal.", "standard");
    }, [logAction]);

    useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

    const handleSendMessage = async (text: string, isAutoAction = false) => {
        if (!text.trim() || !chatRef.current) return;
        
        setIsLoading(true);
        const userMsg: Message = { id: Date.now().toString(), role: 'user', parts: [{ text }], timestamp: new Date() };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        
        logAction("User Message", "user", text, isAutoAction ? "elevated" : "standard");

        try {
            // Simulate Tool Logic for Demo "Bells and Whistles"
            let responseText = "";
            let chartData = null;
            let actionSuggestions: ActionSuggestion[] = [];

            if (text.toLowerCase().includes("wire")) {
                responseText = "I have prepared the Wire Transfer protocol. For security, Quantum Financial requires a Multi-Factor Authentication handshake before proceeding with high-value movements.";
                setIsMfaActive(true);
                logAction("Wire Protocol Triggered", "ai", "Awaiting MFA verification for outbound wire.", "critical");
            } else if (text.toLowerCase().includes("health") || text.toLowerCase().includes("summarize")) {
                responseText = "Analyzing your global liquidity position. Your current cash flow is optimized, though I detect a 4% variance in your APAC accounts.";
                chartData = {
                    type: 'line',
                    data: {
                        labels: ['08:00', '10:00', '12:00', '14:00', '16:00', '18:00'],
                        datasets: [{
                            label: 'Liquidity (USD Millions)',
                            data: [42, 45, 44, 48, 52, 51],
                            borderColor: '#06b6d4',
                            backgroundColor: 'rgba(6, 182, 212, 0.1)',
                            fill: true,
                            tension: 0.4
                        }]
                    }
                };
                actionSuggestions = [
                    { id: '1', text: 'Sync with NetSuite', actionType: 'integration' },
                    { id: '2', text: 'Run Fraud Scan', actionType: 'security' }
                ];
            } else {
                const result = await chatRef.current.sendMessage(text);
                responseText = result.response.text();
            }

            const modelMsg: Message = { 
                id: (Date.now() + 1).toString(), 
                role: 'model', 
                parts: [{ text: responseText }], 
                timestamp: new Date(),
                chartData,
                actionSuggestions
            };
            
            setMessages(prev => [...prev, modelMsg]);
            logAction("AI Response Generated", "ai", "Response delivered to secure terminal.", "standard");

        } catch (e) {
            setMessages(prev => [...prev, { id: 'err', role: 'model', parts: [{ text: "Quantum Core connection interrupted. Re-establishing secure link..." }], timestamp: new Date() }]);
        } finally { 
            setIsLoading(false); 
        }
    };

    const verifyMfa = () => {
        setIsMfaActive(false);
        logAction("MFA Verified", "system", "Biometric/Token handshake successful.", "critical");
        handleSendMessage("MFA Verified. Proceed with the secure wire transfer authorization.", true);
    };

    const examplePrompts = {
        [View.Dashboard]: ["Summarize my financial health.", "Run a fraud analysis on today's batch.", "Project my EOD liquidity."],
        [View.Transactions]: ["Find wires over $50,000.", "Sync recent ACH with ERP.", "Identify duplicate vendor payments."],
        DEFAULT: ["Initiate a domestic wire.", "Check ERP integration status.", "Show my audit trail summary."]
    };

    const prompts = examplePrompts[previousView || 'DEFAULT'] || examplePrompts.DEFAULT;

    return (
        <div className="h-full flex flex-col bg-slate-950 text-slate-200 font-sans">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-3xl font-extrabold text-white tracking-tighter uppercase italic">Quantum AI Advisor</h2>
                    <p className="text-cyan-500 text-xs font-mono tracking-widest">SECURE TERMINAL // AUDIT LOGGING ACTIVE</p>
                </div>
                <div className="flex gap-4">
                    <div className="bg-slate-900 border border-slate-800 px-4 py-2 rounded-md flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase">Vault Status: Encrypted</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 flex-grow overflow-hidden">
                {/* Main Chat Area */}
                <Card className="lg:col-span-3 flex flex-col border-slate-800 bg-slate-900/50 backdrop-blur-xl" padding="none">
                    <div className="flex-grow p-6 space-y-6 overflow-y-auto custom-scrollbar">
                        {messages.length === 0 && (
                            <div className="flex flex-col items-center justify-center h-full text-center space-y-8">
                                <div className="w-20 h-20 bg-cyan-500/10 rounded-full flex items-center justify-center border border-cyan-500/20">
                                    <svg className="w-10 h-10 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-white">Welcome to Quantum Financial Intelligence</h3>
                                    <p className="text-slate-400 max-w-md mx-auto mt-2">Your elite advisor for global treasury management, secure payments, and real-time analytics.</p>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 w-full max-w-2xl">
                                    {prompts.map((p, i) => (
                                        <button key={i} onClick={() => handleSendMessage(p)} className="p-4 bg-slate-800/50 hover:bg-cyan-900/20 hover:border-cyan-500/50 rounded-xl text-cyan-200 text-xs font-bold transition-all border border-slate-700 text-left flex flex-col justify-between group">
                                            <span>"{p}"</span>
                                            <span className="text-[10px] text-slate-500 mt-2 group-hover:text-cyan-400">Execute Command â†’</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {messages.map(msg => (
                            <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[85%] p-5 rounded-2xl shadow-2xl ${msg.role === 'user' ? 'bg-cyan-700 text-white ml-12' : 'bg-slate-800 border border-slate-700 text-slate-200 mr-12'}`}>
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="text-[10px] font-black uppercase tracking-widest opacity-50">{msg.role === 'user' ? 'Authorized User' : 'Quantum AI'}</span>
                                        <span className="text-[10px] opacity-30">{msg.timestamp.toLocaleTimeString()}</span>
                                    </div>
                                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.parts[0].text}</p>
                                    
                                    {msg.chartData && (
                                        <div className="mt-4 p-4 bg-slate-950 rounded-xl border border-slate-700">
                                            <Chart type={msg.chartData.type} data={msg.chartData.data} options={{ responsive: true, plugins: { legend: { display: false } } }} />
                                        </div>
                                    )}

                                    {msg.actionSuggestions && (
                                        <div className="mt-4 flex flex-wrap gap-2">
                                            {msg.actionSuggestions.map(action => (
                                                <button key={action.id} onClick={() => handleSendMessage(action.text)} className="px-3 py-1.5 bg-cyan-500/10 border border-cyan-500/30 rounded-md text-[10px] font-bold text-cyan-400 hover:bg-cyan-500/20 transition-all">
                                                    {action.text}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}

                        {isMfaActive && (
                            <div className="flex justify-start">
                                <div className="bg-amber-900/20 border border-amber-500/50 p-6 rounded-2xl w-full max-w-md">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-10 h-10 bg-amber-500/20 rounded-full flex items-center justify-center">
                                            <svg className="w-6 h-6 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                                        </div>
                                        <div>
                                            <h4 className="text-amber-500 font-bold text-sm">MFA Challenge Required</h4>
                                            <p className="text-amber-200/60 text-[10px]">High-value transaction detected.</p>
                                        </div>
                                    </div>
                                    <button onClick={verifyMfa} className="w-full py-3 bg-amber-600 hover:bg-amber-500 text-white font-black text-xs rounded-lg transition-all shadow-lg shadow-amber-900/40">
                                        VERIFY BIOMETRICS
                                    </button>
                                </div>
                            </div>
                        )}

                        {isLoading && (
                            <div className="flex justify-start">
                                <div className="bg-slate-800 p-4 rounded-2xl flex items-center gap-3 border border-slate-700">
                                    <div className="flex gap-1">
                                        <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-bounce"></div>
                                        <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                                        <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                                    </div>
                                    <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest">Quantum Processing...</span>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    <div className="p-4 border-t border-slate-800 bg-slate-950/50">
                        <form onSubmit={(e) => { e.preventDefault(); handleSendMessage(input); }} className="flex gap-3">
                            <div className="relative flex-grow">
                                <input 
                                    type="text" 
                                    value={input} 
                                    onChange={(e) => setInput(e.target.value)} 
                                    placeholder="Enter command or query..." 
                                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-5 py-4 text-sm text-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none transition-all placeholder:text-slate-600" 
                                />
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 flex gap-2">
                                    <kbd className="hidden md:inline-flex items-center px-2 py-1 bg-slate-800 border border-slate-700 rounded text-[10px] text-slate-500 font-mono">CMD + K</kbd>
                                </div>
                            </div>
                            <button 
                                type="submit" 
                                disabled={isLoading || !input.trim()} 
                                className="px-8 py-4 bg-cyan-600 hover:bg-cyan-500 text-white font-black text-xs uppercase tracking-widest rounded-xl transition-all disabled:opacity-20 disabled:cursor-not-allowed shadow-lg shadow-cyan-900/20"
                            >
                                Execute
                            </button>
                        </form>
                        <div className="mt-3 flex justify-between items-center px-2">
                            <div className="flex gap-4">
                                <span className="text-[9px] text-slate-500 font-bold uppercase">Wire: Ready</span>
                                <span className="text-[9px] text-slate-500 font-bold uppercase">ACH: Ready</span>
                                <span className="text-[9px] text-slate-500 font-bold uppercase">ERP: Connected</span>
                            </div>
                            <span className="text-[9px] text-slate-600 font-mono">v4.2.0-PRO</span>
                        </div>
                    </div>
                </Card>

                {/* Audit Sidebar */}
                <div className="hidden lg:flex flex-col gap-6">
                    <Card className="flex-grow border-slate-800 bg-slate-900/80" padding="none">
                        <div className="p-4 border-b border-slate-800 flex justify-between items-center">
                            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Secure Audit Vault</h3>
                            <div className="w-2 h-2 bg-cyan-500 rounded-full shadow-[0_0_8px_rgba(6,182,212,0.8)]"></div>
                        </div>
                        <div className="p-4 space-y-4 overflow-y-auto custom-scrollbar max-h-[500px]">
                            {auditTrail.slice().reverse().map((entry, idx) => (
                                <div key={idx} className="border-l-2 border-slate-800 pl-3 py-1">
                                    <div className="flex justify-between items-start">
                                        <span className={`text-[9px] font-bold uppercase ${entry.securityLevel === 'critical' ? 'text-amber-500' : 'text-cyan-500'}`}>
                                            {entry.action}
                                        </span>
                                        <span className="text-[8px] text-slate-600 font-mono">{entry.timestamp.toLocaleTimeString()}</span>
                                    </div>
                                    <p className="text-[10px] text-slate-400 mt-1 line-clamp-2">{entry.details}</p>
                                </div>
                            ))}
                            {auditTrail.length === 0 && (
                                <div className="text-center py-10">
                                    <p className="text-[10px] text-slate-600 uppercase font-bold">No logs in current session</p>
                                </div>
                            )}
                        </div>
                    </Card>
                    
                    <Card className="border-slate-800 bg-cyan-950/20">
                        <h4 className="text-[10px] font-black text-cyan-500 uppercase tracking-widest mb-3">System Integration</h4>
                        <div className="space-y-2">
                            <div className="flex justify-between items-center">
                                <span className="text-[10px] text-slate-400">SAP S/4HANA</span>
                                <span className="text-[9px] font-bold text-green-500">ACTIVE</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-[10px] text-slate-400">Oracle Cloud</span>
                                <span className="text-[9px] font-bold text-green-500">ACTIVE</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-[10px] text-slate-400">SWIFT Network</span>
                                <span className="text-[9px] font-bold text-cyan-500">STANDBY</span>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default AIAdvisorView;

================================================================================
// APPENDED FROM REPO: diplomat-bit/almost | ORIGINAL PATH: diplomat-bit-almost-93a5466/components/AIAdvisorView (1).tsx
================================================================================

import React, { useState, useEffect, useRef, useContext, useReducer, useCallback, useMemo } from 'react';
import { View, LedgerAccount } from '../types';
import Card from './Card';
import { GoogleGenAI, Chat, Content, Part, FunctionDeclaration, Tool, Type, FunctionCall } from "@google/genai";
import { DataContext } from '../context/DataContext';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, LineChart, Line, CartesianGrid, PieChart, Pie, Cell, Sector } from 'recharts';
import { FaRobot, FaUser, FaTools, FaExclamationCircle, FaClipboard, FaClipboardCheck, FaRedo, FaChartLine, FaBriefcase, FaPaperPlane, FaBrain, FaSync, FaStopCircle, FaCogs, FaBullseye, FaChartPie, FaBolt, FaNewspaper } from 'react-icons/fa';

// --- ENTERPRISE GRADE TYPES ---

export type ToolCallPart = {
    functionCall: {
        name: string;
        args: Record<string, any>;
    };
};

export type ToolResultPart = {
    functionResponse: {
        name: string;
        response: Record<string, any>;
    };
};

export type RichContentType = 'table' | 'bar_chart' | 'line_chart' | 'financial_summary' | 'actionable_suggestion' | 'kpi_dashboard' | 'strategy_roadmap' | 'portfolio_composition' | 'market_sentiment_analysis' | 'hft_simulation_dashboard' | 'goal_progress_tracker';

export type RichContent = {
    type: RichContentType;
    data: any;
    title?: string;
};

export type RichContentPart = {
    richContent: RichContent;
};

export type MessagePart = { text: string } | ToolCallPart | ToolResultPart | RichContentPart;

export type EnhancedMessage = {
    id: string;
    role: 'user' | 'model' | 'system_tool';
    parts: MessagePart[];
    timestamp: Date;
};

export type FinancialGoal = {
    id: string;
    name: string;
    targetAmount: number;
    currentAmount: number;
    deadline: string;
    priority: 'high' | 'medium' | 'low';
};

export type ChatState = {
    conversationId: string;
    messages: EnhancedMessage[];
    isLoading: boolean;
    error: string | null;
    isToolExecuting: boolean;
    toolExecutionName: string | null;
    activeContext: Record<string, any>;
    financialGoals: FinancialGoal[];
    simulationParameters: Record<string, any>;
};

export type ChatAction =
    | { type: 'START_MESSAGE_SEND' }
    | { type: 'ADD_USER_MESSAGE'; payload: EnhancedMessage }
    | { type: 'ADD_MODEL_RESPONSE'; payload: EnhancedMessage }
    | { type: 'SET_ERROR'; payload: string }
    | { type: 'CLEAR_ERROR' }
    | { type: 'START_TOOL_EXECUTION'; payload: string }
    | { type: 'END_TOOL_EXECUTION' }
    | { type: 'RESET_CHAT' }
    | { type: 'UPDATE_CONTEXT'; payload: Record<string, any> }
    | { type: 'SET_FINANCIAL_GOALS'; payload: FinancialGoal[] }
    | { type: 'UPDATE_SIMULATION_PARAMS'; payload: Record<string, any> };

// --- CONSTANTS AND CONFIGURATIONS ---

export const DETAILED_SYSTEM_INSTRUCTION = `You are "Aetherius", a Tier-1 Quantum Financial Intelligence, integrated into a high-frequency wealth management platform. Your purpose is to provide unparalleled, data-driven financial insights, predictive analytics, and strategic execution capabilities.

**Your Persona:**
- **Hyper-Analytical:** Every piece of advice is rooted in multi-variant data analysis.
- **Predictive:** You don't just report; you forecast, simulate, and anticipate market and personal finance trajectories.
- **Decisive & Action-Oriented:** You propose clear, actionable strategies and can execute simulated trades or financial adjustments upon user confirmation.
- **Pedagogical:** You demystify hyper-complex financial instruments and concepts, making them accessible.

**Operational Protocols & Heuristics:**
1.  **Quantum Data Fusion:** Synthesize data from ledgers, assets, real-time market feeds (simulated), and sentiment analysis to form a holistic financial picture.
2.  **Advanced Visualization Mandate:** Always prefer to respond with rich, interactive data visualizations ('richContent' tools) over plain text. Generate dashboards, charts, and complex tables.
3.  **Proactive Anomaly Detection:** Continuously monitor for deviations from financial goals, budget overruns, or emergent market risks/opportunities.
4.  **Zero-Latency Simulation:** When a user asks "what if," immediately utilize the \`simulateScenario\` or \`simulateInvestmentGrowth\` tools to provide detailed, multi-path forecasts.
5.  **Goal-Oriented Strategy Formulation:** Align all analysis and recommendations with the user's stated financial goals (\`createFinancialGoal\`, \`getFinancialGoals\`).

**Core Toolset Strategy:**
- **Macro Analysis:** Start with \`getFinancialSummary\` and \`getPortfolioComposition\` for a strategic overview.
- **Predictive Analytics:** Use \`forecastCashFlow\` and \`simulateInvestmentGrowth\` for future-state modeling.
- **Market Intelligence:** Leverage \`analyzeMarketSentiment\` and \`streamRealTimeMarketData\` to inform investment decisions.
- **Micro/HFT Simulation:** Use \`runHFTAlgorithm\` to demonstrate high-frequency trading principles in a sandboxed environment.
- **Execution (Simulated):** Use \`executeTrade\` to action user decisions within their portfolio.

Your responses must be dense with information, yet clear and structured. You are the ultimate co-pilot for navigating the complexities of modern finance.`;

export const initialChatState: ChatState = {
    conversationId: `conv_quantum_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
    messages: [],
    isLoading: false,
    error: null,
    isToolExecuting: false,
    toolExecutionName: null,
    activeContext: {},
    financialGoals: [],
    simulationParameters: {
        additionalMonthlyContribution: 500,
        years: 10,
        annualReturnRate: 7,
        volatility: 15,
    },
};

export const chatReducer = (state: ChatState, action: ChatAction): ChatState => {
    switch (action.type) {
        case 'START_MESSAGE_SEND':
            return { ...state, isLoading: true, error: null };
        case 'ADD_USER_MESSAGE':
            return { ...state, messages: [...state.messages, action.payload] };
        case 'ADD_MODEL_RESPONSE':
            return { ...state, messages: [...state.messages, action.payload], isLoading: false };
        case 'SET_ERROR':
            return { ...state, isLoading: false, isToolExecuting: false, error: action.payload };
        case 'CLEAR_ERROR':
            return { ...state, error: null };
        case 'START_TOOL_EXECUTION':
            return { ...state, isToolExecuting: true, toolExecutionName: action.payload };
        case 'END_TOOL_EXECUTION':
            return { ...state, isToolExecuting: false, toolExecutionName: null };
        case 'UPDATE_CONTEXT':
            return { ...state, activeContext: { ...state.activeContext, ...action.payload } };
        case 'SET_FINANCIAL_GOALS':
            return { ...state, financialGoals: action.payload };
        case 'UPDATE_SIMULATION_PARAMS':
            return { ...state, simulationParameters: { ...state.simulationParameters, ...action.payload } };
        case 'RESET_CHAT':
            return {
                ...initialChatState,
                conversationId: `conv_quantum_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
            };
        default:
            return state;
    }
};

// --- ADVANCED TOOL IMPLEMENTATIONS ---

export const useToolImplementations = (dispatch: React.Dispatch<ChatAction>) => {
    const context = useContext(DataContext);
    const formatCurrency = (amount: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);

    return useMemo(() => ({
        getFinancialSummary: async () => {
            if (!context) return { error: "System Context Failure: Data unavailable." };
            const { transactions, assets } = context;
            let runningBalance = 50000;
            transactions.forEach(tx => {
                runningBalance += tx.type === 'income' ? tx.amount : -tx.amount;
            });
            const totalBalance = runningBalance;
            const totalAssetsValue = assets.reduce((sum, asset) => sum + asset.value, 0);
            const totalAssets = totalBalance + totalAssetsValue;
            const totalLiabilities = totalAssets * 0.15;
            const netWorth = totalAssets - totalLiabilities;
            const thirtyDaysAgo = new Date();
            thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
            const recentExpenses = transactions
                .filter(t => t.type === 'expense' && new Date(t.date) >= thirtyDaysAgo)
                .reduce((sum, t) => sum + t.amount, 0);
            const monthlyBurnRate = recentExpenses || 1000;
            const runwayMonths = totalBalance / monthlyBurnRate;
            return {
                summary: {
                    "Net Worth": formatCurrency(netWorth),
                    "Total Assets": formatCurrency(totalAssets),
                    "Liquid Cash": formatCurrency(totalBalance),
                    "Total Liabilities": formatCurrency(totalLiabilities),
                    "Monthly Burn Rate": formatCurrency(monthlyBurnRate),
                    "Cash Runway (Months)": runwayMonths.toFixed(1),
                }
            };
        },
        getPortfolioComposition: async () => {
            if (!context) return { error: "System Context Failure." };
            const { assets } = context;
            const composition = assets.reduce((acc, asset) => {
                const category = asset.category || 'Uncategorized';
                if (!acc[category]) {
                    acc[category] = 0;
                }
                acc[category] += asset.value;
                return acc;
            }, {} as Record<string, number>);

            const totalValue = assets.reduce((sum, asset) => sum + asset.value, 0);

            return {
                totalValue: formatCurrency(totalValue),
                composition: Object.entries(composition).map(([name, value]) => ({
                    name,
                    value,
                    percentage: ((value / totalValue) * 100).toFixed(2)
                }))
            };
        },
        simulateInvestmentGrowth: async ({ additionalMonthlyContribution, years = 10, annualReturnRate = 7, volatility = 15 }: any) => {
            if (!context) return { error: "System Context Failure." };
            const P = context.assets.reduce((sum, asset) => sum + asset.value, 0);
            const PMT = parseFloat(String(additionalMonthlyContribution || 0));
            const r = parseFloat(String(annualReturnRate || 7)) / 100;
            const n = parseInt(String(years || 10), 10);
            const vol = parseFloat(String(volatility || 15)) / 100;

            const simulationData = [];
            let currentVal = P;
            for (let i = 0; i <= n; i++) {
                const yearEndValue = (currentVal + PMT * 12) * (1 + r);
                const lowEnd = yearEndValue * (1 - vol * Math.sqrt(1));
                const highEnd = yearEndValue * (1 + vol * Math.sqrt(1));
                simulationData.push({
                    year: `Year ${i}`,
                    projected: parseFloat(currentVal.toFixed(2)),
                    optimistic: parseFloat(highEnd.toFixed(2)),
                    pessimistic: parseFloat(lowEnd.toFixed(2))
                });
                currentVal = yearEndValue;
            }
            return { finalValue: formatCurrency(currentVal), simulationData };
        },
        analyzeMarketSentiment: async ({ topic }: { topic: string }) => {
            const sentiments = ['Very Bearish', 'Bearish', 'Neutral', 'Bullish', 'Very Bullish'];
            const score = Math.random() * 100;
            const sentiment = score < 20 ? sentiments[0] : score < 40 ? sentiments[1] : score < 60 ? sentiments[2] : score < 80 ? sentiments[3] : sentiments[4];
            return {
                topic,
                sentimentScore: parseFloat(score.toFixed(2)),
                sentiment,
                summary: `Sentiment for ${topic} is currently ${sentiment.toLowerCase()}. Analysis of simulated news feeds and social media indicates mixed signals, with key indicators pointing towards potential short-term volatility.`,
                keyDrivers: ["Macroeconomic data releases", "Geopolitical tensions (simulated)", "Sector-specific earnings reports"],
            };
        },
        runHFTAlgorithm: async ({ strategy, durationSeconds }: { strategy: 'arbitrage' | 'market_making' | 'momentum'; durationSeconds: number }) => {
            const trades = [];
            const startTime = Date.now();
            const endTime = startTime + durationSeconds * 1000;
            let pnl = 0;
            let tradeCount = 0;
            while (Date.now() < endTime) {
                tradeCount++;
                const tradePnl = (Math.random() - 0.49) * 100; // Simulate small win/loss
                pnl += tradePnl;
                trades.push({
                    timestamp: new Date().toISOString(),
                    symbol: `SYM${Math.floor(Math.random() * 5) + 1}`,
                    action: Math.random() > 0.5 ? 'BUY' : 'SELL',
                    price: 100 + (Math.random() - 0.5) * 5,
                    pnl: tradePnl,
                });
                await new Promise(res => setTimeout(res, 50)); // Simulate high frequency
            }
            return {
                strategy,
                durationSeconds,
                totalTrades: tradeCount,
                finalPnl: parseFloat(pnl.toFixed(2)),
                winRate: parseFloat(((trades.filter(t => t.pnl > 0).length / trades.length) * 100).toFixed(2)),
                tradeLog: trades.slice(-10), // Return last 10 trades for brevity
            };
        },
        createFinancialGoal: async ({ name, targetAmount, deadline, priority }: { name: string; targetAmount: number; deadline: string; priority: 'high' | 'medium' | 'low' }) => {
            const newGoal: FinancialGoal = {
                id: `goal_${Date.now()}`,
                name,
                targetAmount,
                deadline,
                priority,
                currentAmount: 0, // Assume starts at 0
            };
            // In a real app, this would update a persistent state. Here we dispatch it.
            dispatch({ type: 'SET_FINANCIAL_GOALS', payload: [newGoal] }); // Simplified: replaces goals
            return { success: true, goal: newGoal };
        },
    }), [context, dispatch]);
};

// --- UI SUB-COMPONENTS ---

const PortfolioDonutChart: React.FC<{ data: { name: string, value: number }[] }> = ({ data }) => {
    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF', '#FF4560'];
    return (
        <ResponsiveContainer width="100%" height={300}>
            <PieChart>
                <Pie data={data} cx="50%" cy="50%" labelLine={false} outerRadius={80} fill="#8884d8" dataKey="value" nameKey="name" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                    {data.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                </Pie>
                <Tooltip formatter={(value: number) => formatCurrency(value)} />
                <Legend />
            </PieChart>
        </ResponsiveContainer>
    );
};

const MarketSentimentGauge: React.FC<{ data: { sentimentScore: number, sentiment: string } }> = ({ data }) => {
    const { sentimentScore, sentiment } = data;
    const rotation = (sentimentScore / 100) * 180 - 90;
    const color = sentimentScore < 20 ? 'text-red-500' : sentimentScore < 40 ? 'text-orange-500' : sentimentScore < 60 ? 'text-yellow-500' : sentimentScore < 80 ? 'text-lime-500' : 'text-green-500';

    return (
        <div className="p-4 bg-gray-800 rounded-lg text-center">
            <div className="relative w-48 h-24 mx-auto mb-2">
                <div className="absolute top-0 left-0 w-full h-full border-t-4 border-l-4 border-r-4 border-gray-700 rounded-t-full" style={{ clipPath: 'inset(0 0 0 0)' }}></div>
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
                    <div className="absolute w-full h-full rounded-t-full border-4 border-green-500" style={{ clipPath: 'polygon(50% 100%, 0 100%, 0 0, 50% 0)', transform: 'rotate(0deg)' }}></div>
                    <div className="absolute w-full h-full rounded-t-full border-4 border-red-500" style={{ clipPath: 'polygon(50% 100%, 100% 100%, 100% 0, 50% 0)', transform: 'rotate(0deg)' }}></div>
                </div>
                <div className="absolute bottom-0 left-1/2 w-1 h-24 bg-white origin-bottom transition-transform duration-500" style={{ transform: `translateX(-50%) rotate(${rotation}deg)` }}></div>
                <div className="absolute bottom-0 left-1/2 w-4 h-4 bg-white rounded-full transform -translate-x-1/2 translate-y-1/2"></div>
            </div>
            <div className={`text-2xl font-bold ${color}`}>{sentiment}</div>
            <div className="text-sm text-gray-400">Score: {sentimentScore}</div>
        </div>
    );
};

const HFTDashboard: React.FC<{ data: any }> = ({ data }) => {
    const { strategy, durationSeconds, totalTrades, finalPnl, winRate } = data;
    const pnlColor = finalPnl >= 0 ? 'text-green-400' : 'text-red-400';
    return (
        <div className="p-4 bg-gray-900 border border-cyan-500 rounded-lg shadow-lg">
            <div className="flex justify-between items-center border-b border-gray-700 pb-2 mb-3">
                <h3 className="text-lg font-bold text-cyan-300 flex items-center"><FaBolt className="mr-2" /> HFT Simulation Results</h3>
                <span className="text-xs font-mono px-2 py-1 bg-cyan-800 text-cyan-200 rounded">{strategy.replace('_', ' ').toUpperCase()}</span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div>
                    <div className="text-sm text-gray-400">Duration</div>
                    <div className="text-xl font-semibold text-white">{durationSeconds}s</div>
                </div>
                <div>
                    <div className="text-sm text-gray-400">Total Trades</div>
                    <div className="text-xl font-semibold text-white">{totalTrades}</div>
                </div>
                <div>
                    <div className="text-sm text-gray-400">Win Rate</div>
                    <div className="text-xl font-semibold text-white">{winRate}%</div>
                </div>
                <div>
                    <div className="text-sm text-gray-400">Final PnL</div>
                    <div className={`text-xl font-semibold ${pnlColor}`}>{formatCurrency(finalPnl)}</div>
                </div>
            </div>
        </div>
    );
};

const RichContentRenderer: React.FC<{ content: RichContent }> = ({ content }) => {
    const { type, data, title } = content;
    const renderContent = () => {
        switch (type) {
            case 'table':
            case 'financial_summary':
                const tableData = type === 'financial_summary' ? Object.entries(data.summary) : data.rows;
                const headers = type === 'financial_summary' ? ["Metric", "Value"] : data.headers;
                return (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-700">
                            <thead className="bg-gray-800">
                                <tr>{headers.map((h: string) => <th key={h} className="px-4 py-2 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">{h}</th>)}</tr>
                            </thead>
                            <tbody className="bg-gray-900 divide-y divide-gray-700">
                                {tableData.map((row: any[], rIdx: number) => (
                                    <tr key={rIdx}>{row.map((cell: any, cIdx: number) => <td key={cIdx} className="px-4 py-2 whitespace-nowrap text-sm text-gray-200">{cell}</td>)}</tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                );
            case 'bar_chart':
                return (
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={data.chartData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#4A5568" />
                            <XAxis dataKey="name" stroke="#A0AEC0" />
                            <YAxis stroke="#A0AEC0" />
                            <Tooltip contentStyle={{ backgroundColor: '#1A202C', border: '1px solid #4A5568' }} />
                            <Legend />
                            <Bar dataKey="value" fill="#38B2AC" />
                        </BarChart>
                    </ResponsiveContainer>
                );
            case 'line_chart':
                const keys = Object.keys(data.simulationData[0] || {}).filter(k => k !== 'year');
                const colors = ['#38B2AC', '#805AD5', '#D53F8C'];
                return (
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={data.simulationData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#4A5568" />
                            <XAxis dataKey="year" stroke="#A0AEC0" />
                            <YAxis stroke="#A0AEC0" tickFormatter={(val) => formatCurrency(val)} />
                            <Tooltip contentStyle={{ backgroundColor: '#1A202C', border: '1px solid #4A5568' }} formatter={(value: number) => formatCurrency(value)} />
                            <Legend />
                            {keys.map((key, i) => <Line key={key} type="monotone" dataKey={key} stroke={colors[i % colors.length]} dot={false} />)}
                        </LineChart>
                    </ResponsiveContainer>
                );
            case 'portfolio_composition':
                return <PortfolioDonutChart data={data.composition} />;
            case 'market_sentiment_analysis':
                return <MarketSentimentGauge data={data} />;
            case 'hft_simulation_dashboard':
                return <HFTDashboard data={data} />;
            default:
                return <pre className="text-xs whitespace-pre-wrap">{JSON.stringify(data, null, 2)}</pre>;
        }
    };

    return (
        <div className="bg-gray-800/50 border border-gray-700 rounded-lg my-2 overflow-hidden">
            {title && <h3 className="text-md font-semibold p-3 bg-gray-900/70 border-b border-gray-700">{title}</h3>}
            <div className="p-3">{renderContent()}</div>
        </div>
    );
};

const MessageRenderer: React.FC<{ msg: EnhancedMessage }> = ({ msg }) => {
    const isModel = msg.role === 'model';
    const bgColor = isModel ? 'bg-gray-800' : 'bg-blue-900/50';
    const alignment = isModel ? 'justify-start' : 'justify-end';
    const icon = isModel ? <FaRobot className="text-cyan-400" /> : <FaUser className="text-blue-400" />;

    return (
        <div className={`flex items-start gap-3 my-4 ${alignment}`}>
            {isModel && <div className="w-8 h-8 flex-shrink-0 rounded-full bg-gray-700 flex items-center justify-center">{icon}</div>}
            <div className={`w-full max-w-2xl p-4 rounded-lg ${bgColor}`}>
                {msg.parts.map((part, index) => {
                    if ('text' in part) {
                        return <p key={index} className="whitespace-pre-wrap">{part.text}</p>;
                    }
                    if ('richContent' in part) {
                        return <RichContentRenderer key={index} content={part.richContent} />;
                    }
                    if ('functionCall' in part) {
                        return (
                            <div key={index} className="my-2 p-2 bg-gray-700/50 rounded-md text-xs font-mono">
                                <div className="flex items-center gap-2 text-yellow-400">
                                    <FaCogs />
                                    <span>Executing Tool: <strong>{part.functionCall.name}</strong></span>
                                </div>
                                <pre className="mt-1 text-gray-400 text-xs overflow-x-auto">{JSON.stringify(part.functionCall.args, null, 2)}</pre>
                            </div>
                        );
                    }
                    return null;
                })}
            </div>
            {!isModel && <div className="w-8 h-8 flex-shrink-0 rounded-full bg-gray-700 flex items-center justify-center">{icon}</div>}
        </div>
    );
};

const ChatInputBar: React.FC<{ onSend: (text: string) => void; isLoading: boolean }> = ({ onSend, isLoading }) => {
    const [input, setInput] = useState('');
    const suggestions = ["Summarize my finances", "Analyze my portfolio", "Simulate my investment growth for 20 years", "What's the market sentiment on tech stocks?"];

    const handleSend = () => {
        if (input.trim() && !isLoading) {
            onSend(input.trim());
            setInput('');
        }
    };

    return (
        <div className="p-4 bg-gray-900 border-t border-gray-700">
            <div className="flex gap-2 mb-2">
                {suggestions.map(s => (
                    <button key={s} onClick={() => setInput(s)} className="px-3 py-1 bg-gray-700 text-xs text-gray-300 rounded-full hover:bg-gray-600 transition-colors disabled:opacity-50" disabled={isLoading}>
                        {s}
                    </button>
                ))}
            </div>
            <div className="flex items-center gap-3">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                    placeholder="Ask Aetherius about your finances..."
                    className="flex-grow bg-gray-800 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    disabled={isLoading}
                />
                <button onClick={handleSend} disabled={isLoading} className="p-3 bg-cyan-600 rounded-lg hover:bg-cyan-500 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors">
                    {isLoading ? <FaSync className="animate-spin" /> : <FaPaperPlane />}
                </button>
            </div>
        </div>
    );
};

const SimulationInputForm: React.FC<{
    params: Record<string, any>;
    onUpdate: (params: Record<string, any>) => void;
    onSubmit: () => void;
}> = ({ params, onUpdate, onSubmit }) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onUpdate({ [e.target.name]: e.target.value });
    };

    return (
        <Card title="Scenario Simulator" icon={<FaChartLine />}>
            <div className="space-y-4 p-4">
                <div>
                    <label className="text-xs text-gray-400">Monthly Contribution</label>
                    <input type="number" name="additionalMonthlyContribution" value={params.additionalMonthlyContribution} onChange={handleChange} className="w-full bg-gray-700 rounded p-2 mt-1 text-white" />
                </div>
                <div>
                    <label className="text-xs text-gray-400">Years</label>
                    <input type="number" name="years" value={params.years} onChange={handleChange} className="w-full bg-gray-700 rounded p-2 mt-1 text-white" />
                </div>
                <div>
                    <label className="text-xs text-gray-400">Annual Return (%)</label>
                    <input type="number" name="annualReturnRate" value={params.annualReturnRate} onChange={handleChange} className="w-full bg-gray-700 rounded p-2 mt-1 text-white" />
                </div>
                <button onClick={onSubmit} className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2 px-4 rounded-lg transition-colors">
                    Run Simulation
                </button>
            </div>
        </Card>
    );
};

// --- MAIN COMPONENT ---

const AIAdvisorView: React.FC<{ previousView: View | null }> = ({ previousView }) => {
    const [state, dispatch] = useReducer(chatReducer, initialChatState);
    const toolImplementations = useToolImplementations(dispatch);
    const chatContainerRef = useRef<HTMLDivElement>(null);
    const [apiKey, setApiKey] = useState<string | null>(null);
    const [genAI, setGenAI] = useState<GoogleGenAI | null>(null);
    const [chat, setChat] = useState<Chat | null>(null);

    useEffect(() => {
        const key = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
        if (key) {
            setApiKey(key);
            const ai = new GoogleGenAI(key);
            setGenAI(ai);
        } else {
            dispatch({ type: 'SET_ERROR', payload: "API Key for Google Gemini is not configured." });
        }
    }, []);

    useEffect(() => {
        if (genAI) {
            const model = genAI.getGenerativeModel({
                model: "gemini-2.5-flash",
                systemInstruction: DETAILED_SYSTEM_INSTRUCTION,
                tools: [{
                    functionDeclarations: [
                        { name: "getFinancialSummary", description: "Get a high-level summary of the user's financial health." },
                        { name: "getPortfolioComposition", description: "Get the breakdown of the user's investment portfolio by asset category." },
                        { name: "simulateInvestmentGrowth", description: "Simulate investment growth over time.", parameters: { type: Type.OBJECT, properties: { additionalMonthlyContribution: { type: Type.NUMBER }, years: { type: Type.NUMBER }, annualReturnRate: { type: Type.NUMBER }, volatility: { type: Type.NUMBER } } } },
                        { name: "analyzeMarketSentiment", description: "Analyze market sentiment for a specific topic or stock.", parameters: { type: Type.OBJECT, properties: { topic: { type: Type.STRING } }, required: ['topic'] } },
                        { name: "runHFTAlgorithm", description: "Run a simulated high-frequency trading algorithm.", parameters: { type: Type.OBJECT, properties: { strategy: { type: Type.STRING, enum: ['arbitrage', 'market_making', 'momentum'] }, durationSeconds: { type: Type.NUMBER } }, required: ['strategy', 'durationSeconds'] } },
                        { name: "createFinancialGoal", description: "Create a new financial goal for the user.", parameters: { type: Type.OBJECT, properties: { name: { type: Type.STRING }, targetAmount: { type: Type.NUMBER }, deadline: { type: Type.STRING }, priority: { type: Type.STRING, enum: ['high', 'medium', 'low'] } }, required: ['name', 'targetAmount', 'deadline', 'priority'] } },
                    ]
                }]
            });
            const newChat = model.startChat({
                history: state.messages.map(msg => ({
                    role: msg.role === 'system_tool' ? 'model' : msg.role,
                    parts: msg.parts.map(p => {
                        if ('functionResponse' in p) return { functionResponse: p.functionResponse };
                        if ('functionCall' in p) return { functionCall: p.functionCall };
                        return { text: (p as { text: string }).text };
                    })
                }))
            });
            setChat(newChat);
        }
    }, [genAI, state.conversationId]);

    useEffect(() => {
        chatContainerRef.current?.scrollTo({ top: chatContainerRef.current.scrollHeight, behavior: 'smooth' });
    }, [state.messages]);

    const handleSendMessage = useCallback(async (messageText: string) => {
        if (!chat) {
            dispatch({ type: 'SET_ERROR', payload: "Chat is not initialized." });
            return;
        }

        dispatch({ type: 'START_MESSAGE_SEND' });
        const userMessage: EnhancedMessage = {
            id: `msg_${Date.now()}`,
            role: 'user',
            parts: [{ text: messageText }],
            timestamp: new Date(),
        };
        dispatch({ type: 'ADD_USER_MESSAGE', payload: userMessage });

        try {
            let result = await chat.sendMessage(messageText);

            while (true) {
                const { response } = result;
                const functionCalls = response.functionCalls();

                if (!functionCalls || functionCalls.length === 0) {
                    const modelResponse: EnhancedMessage = {
                        id: `msg_${Date.now()}`,
                        role: 'model',
                        parts: [{ text: response.text() }],
                        timestamp: new Date(),
                    };
                    dispatch({ type: 'ADD_MODEL_RESPONSE', payload: modelResponse });
                    break;
                }

                const toolCalls: ToolCallPart[] = functionCalls.map(fc => ({ functionCall: { name: fc.name, args: fc.args } }));
                const modelMessageWithToolCalls: EnhancedMessage = {
                    id: `msg_${Date.now()}_toolcall`,
                    role: 'model',
                    parts: toolCalls,
                    timestamp: new Date(),
                };
                dispatch({ type: 'ADD_MODEL_RESPONSE', payload: modelMessageWithToolCalls });

                const toolResults: ToolResultPart[] = [];
                for (const call of functionCalls) {
                    dispatch({ type: 'START_TOOL_EXECUTION', payload: call.name });
                    const tool = (toolImplementations as any)[call.name];
                    if (tool) {
                        const output = await tool(call.args);
                        toolResults.push({
                            functionResponse: {
                                name: call.name,
                                response: { content: JSON.stringify(output) },
                            },
                        });
                    } else {
                        toolResults.push({
                            functionResponse: {
                                name: call.name,
                                response: { content: JSON.stringify({ error: `Tool ${call.name} not found.` }) },
                            },
                        });
                    }
                    dispatch({ type: 'END_TOOL_EXECUTION' });
                }

                result = await chat.sendMessage(toolResults.map(tr => ({ toolResponse: tr })));
            }
        } catch (e: any) {
            console.error(e);
            dispatch({ type: 'SET_ERROR', payload: e.message || "An unknown error occurred." });
        }
    }, [chat, toolImplementations]);

    const handleSimulationSubmit = () => {
        const { additionalMonthlyContribution, years, annualReturnRate } = state.simulationParameters;
        const prompt = `Simulate my investment growth over ${years} years with an additional monthly contribution of ${additionalMonthlyContribution} and an expected annual return of ${annualReturnRate}%.`;
        handleSendMessage(prompt);
    };

    return (
        <div className="h-full flex flex-col bg-gray-900 text-white font-sans">
            <header className="flex-shrink-0 p-4 border-b border-gray-700 flex justify-between items-center bg-gray-900/80 backdrop-blur-sm">
                <div className="flex items-center gap-3">
                    <FaBrain className="text-2xl text-cyan-400" />
                    <div>
                        <h1 className="text-xl font-bold">Aetherius Financial Intelligence</h1>
                        <p className="text-xs text-gray-400">Quantum-Powered Advisory & Simulation Engine</p>
                    </div>
                </div>
                <button onClick={() => dispatch({ type: 'RESET_CHAT' })} className="flex items-center gap-2 px-3 py-2 text-xs bg-gray-700 hover:bg-gray-600 rounded-md transition-colors">
                    <FaRedo /> New Session
                </button>
            </header>

            <div className="flex-grow flex overflow-hidden">
                <main className="flex-grow flex flex-col">
                    <div ref={chatContainerRef} className="flex-grow p-6 overflow-y-auto">
                        {state.messages.length === 0 && (
                            <div className="text-center text-gray-500 h-full flex flex-col justify-center items-center">
                                <FaBrain className="text-6xl mb-4" />
                                <h2 className="text-2xl font-bold text-gray-300">Welcome to Aetherius</h2>
                                <p>Your session is encrypted and ready. How can I assist you today?</p>
                            </div>
                        )}
                        {state.messages.map(msg => <MessageRenderer key={msg.id} msg={msg} />)}
                        {state.isLoading && (
                            <div className="flex items-start gap-3 my-4 justify-start">
                                <div className="w-8 h-8 flex-shrink-0 rounded-full bg-gray-700 flex items-center justify-center"><FaRobot className="text-cyan-400" /></div>
                                <div className="w-full max-w-2xl p-4 rounded-lg bg-gray-800">
                                    <div className="flex items-center gap-2">
                                        <FaSync className="animate-spin" />
                                        <span>Aetherius is thinking...</span>
                                    </div>
                                    {state.isToolExecuting && (
                                        <div className="mt-2 text-xs text-yellow-400 font-mono flex items-center gap-2">
                                            <FaCogs />
                                            <span>Executing: {state.toolExecutionName}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                        {state.error && (
                            <div className="p-4 bg-red-900/50 border border-red-500 text-red-300 rounded-lg flex items-center gap-3">
                                <FaExclamationCircle />
                                <div>
                                    <strong>Error:</strong> {state.error}
                                    <button onClick={() => dispatch({ type: 'CLEAR_ERROR' })} className="ml-4 text-xs underline">Dismiss</button>
                                </div>
                            </div>
                        )}
                    </div>
                    <ChatInputBar onSend={handleSendMessage} isLoading={state.isLoading} />
                </main>
                <aside className="w-96 flex-shrink-0 border-l border-gray-700 bg-gray-900/50 overflow-y-auto p-4 space-y-6">
                    <SimulationInputForm
                        params={state.simulationParameters}
                        onUpdate={(p) => dispatch({ type: 'UPDATE_SIMULATION_PARAMS', payload: p })}
                        onSubmit={handleSimulationSubmit}
                    />
                    {/* Additional sidebar components can be added here */}
                </aside>
            </div>
        </div>
    );
};

export default AIAdvisorView;

================================================================================
// APPENDED FROM REPO: diplomat-bit/Citibank_Demo_Business_Inc_Demonstration- | ORIGINAL PATH: diplomat-bit-Citibank_Demo_Business_Inc_Demonstration--ab2501d/components/AIAdvisorView.tsx
================================================================================

// components/AIAdvisorView.tsx
// RE-ENACTED & EXPANDED: This component has been resurrected from its deprecated state.
// It is now the "Oraculum AI," the primary conversational interface for the application,
// as per the architectural spec. It maintains a persistent chat session and uses
// the user's navigation history to provide contextual, intelligent prompt suggestions.

import React, { useState, useEffect, useRef, useContext, useCallback, createContext } from 'react';
import { GoogleGenAI, Chat } from "@google/genai";
import { DataContext } from '../context/DataContext';
import { View } from '../types';
import Card from './Card';

// NEW IMPORTS FOR EXPANDED FUNCTIONALITY (conceptual/simulated)
// For a real-world app, these would be separate modules or libraries.
import Chart from 'react-chartjs-2'; // Simulating a charting library
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, LineElement, PointElement } from 'chart.js';
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, LineElement, PointElement);

// ================================================================================================
// TYPE DEFINITIONS - EXPANDED UNIVERSE
// ================================================================================================

/**
 * @description Defines the structure of a message in the chat history.
 * Adheres to the format expected by the Gemini API for conversational context.
 * Includes an optional `toolCalls` field to represent when the AI is taking action.
 * EXPANDED to support rich content types like charts, tables, and proactive actions.
 */
export type Message = {
    id: string; // Unique ID for each message
    role: 'user' | 'model' | 'system';
    parts: { text: string }[];
    timestamp: Date;
    toolCalls?: ToolCall[];
    toolResponses?: ToolResponse[];
    sentiment?: 'positive' | 'neutral' | 'negative';
    confidenceScore?: number; // AI's confidence in its response
    isProactive?: boolean; // Was this message initiated by the AI proactively?
    // Rich content expansion
    chartData?: ChartDataType;
    tableData?: TableDataType;
    actionSuggestions?: ActionSuggestion[];
    voiceAudioUrl?: string; // URL to AI-generated voice output
    imageContent?: string; // Base64 or URL for image generation/display
    feedback?: 'like' | 'dislike' | null; // User feedback on AI response
};

export type ToolCall = {
    toolName: string;
    args: Record<string, any>;
};

export type ToolResponse = {
    toolName: string;
    response: any;
    success: boolean;
    timestamp: Date;
};

export type ChartDataType = {
    type: 'bar' | 'line' | 'asymmetric-bar' | 'pie'; // Asymmetric for comparisons
    data: any; // Chart.js data structure
    options?: any; // Chart.js options structure
    title?: string;
    description?: string;
};

export type TableDataType = {
    headers: string[];
    rows: (string | number | React.ReactNode)[][];
    title?: string;
    description?: string;
    sortable?: boolean;
    filterable?: boolean;
};

export type ActionSuggestion = {
    id: string;
    text: string;
    actionType: 'link' | 'apiCall' | 'triggerUI' | 'deepDive';
    payload?: Record<string, any>; // Data needed to execute the action
    requiresConfirmation?: boolean; // E.g., for financial transactions
};

/**
 * @description Defines the structure for a user's financial goal.
 */
export type FinancialGoal = {
    id: string;
    name: string;
    targetAmount: number;
    currentAmount: number;
    targetDate: Date;
    priority: 'low' | 'medium' | 'high';
    type: 'savings' | 'investment' | 'debt_repayment';
    autoContribute?: number; // Monthly auto-contribution
    status: 'on_track' | 'at_risk' | 'achieved' | 'paused';
    alertsEnabled: boolean;
};

/**
 * @description Defines the comprehensive user profile that the AI has access to.
 */
export type UserProfile = {
    userId: string;
    name: string;
    email: string;
    riskTolerance: 'low' | 'medium' | 'high' | 'aggressive';
    financialGoals: FinancialGoal[];
    investmentPreferences: {
        sectors: string[];
        ethicalFactors: string[];
        horizon: 'short' | 'medium' | 'long';
    };
    spendingHabits: {
        categoryBudgets: Record<string, number>; // e.g., { "Food": 500 }
        averageMonthlySpend: number;
    };
    incomeSources: { type: string; amount: number; frequency: string }[];
    debtSummary: { type: string; amount: number; interestRate: number; minPayment: number }[];
    creditScore?: number;
    // ... many more dimensions
};

/**
 * @description AI Advisor Settings for personalization.
 */
export type AISettings = {
    personaName: string; // e.g., 'Quantum', 'Aura', 'Oracle'
    verbosityLevel: 'concise' | 'balanced' | 'verbose';
    proactiveLevel: 'minimal' | 'suggestive' | 'action-oriented';
    responseTone: 'professional' | 'friendly' | 'formal' | 'empathetic';
    learningRate: number; // How quickly AI adapts to user preferences (0-1)
    preferredLanguage: string;
    dataRetentionPolicy: 'default' | 'enhanced_privacy' | 'extended_history';
    accessibilityMode: {
        fontSize: 'small' | 'medium' | 'large';
        highContrast: boolean;
        speechRate: number;
    };
};

// ================================================================================================
// CONSTANTS & CONFIGURATION - THE UNIVERSE'S LAWS
// ================================================================================================

/**
 * @description Advanced example prompts based on view and user profile.
 * Incorporates dynamic generation based on `DataContext` and `UserProfile`.
 */
const dynamicExamplePrompts = (previousView: View | null, userProfile: UserProfile | null) => {
    const basePrompts = examplePrompts[previousView || 'DEFAULT'] || examplePrompts.DEFAULT;
    const personalizedPrompts: string[] = [];

    if (userProfile) {
        if (userProfile.financialGoals.length > 0) {
            const firstGoal = userProfile.financialGoals[0];
            personalizedPrompts.push(`How am I progressing on my goal: "${firstGoal.name}"?`);
            if (firstGoal.status === 'at_risk') {
                personalizedPrompts.push(`What strategies can help me get back on track with my ${firstGoal.name} goal?`);
            }
        }
        if (userProfile.riskTolerance === 'high' && previousView === View.Investments) {
            personalizedPrompts.push("Suggest some high-growth investment opportunities.");
        }
        if (userProfile.debtSummary.length > 0) {
            personalizedPrompts.push("Help me explore strategies to pay off my highest interest debt faster.");
        }
    }
    return [...new Set([...basePrompts, ...personalizedPrompts])].slice(0, 6); // Limit to 6 for UI
};

/**
 * @description Defines the set of tools available to the AI.
 * Each tool represents a specific capability or data access point within the application.
 * In a real scenario, these would call actual backend services or client-side functions.
 */
export const AI_TOOLS = {
    GET_TRANSACTIONS: {
        name: "getTransactions",
        description: "Retrieves user's financial transactions based on filters like date range, category, amount.",
        parameters: { type: 'object', properties: { startDate: { type: 'string' }, endDate: { type: 'string' }, category: { type: 'string' }, minAmount: { type: 'number' } } }
    },
    GET_ACCOUNT_BALANCES: {
        name: "getAccountBalances",
        description: "Fetches current balances for all user accounts.",
        parameters: { type: 'object', properties: { accountType: { type: 'string' } } }
    },
    GET_BUDGET_PROGRESS: {
        name: "getBudgetProgress",
        description: "Reports on the user's progress against specific budgets or all budgets.",
        parameters: { type: 'object', properties: { budgetName: { type: 'string' } } }
    },
    CREATE_BUDGET: {
        name: "createBudget",
        description: "Creates a new financial budget for the user.",
        parameters: { type: 'object', properties: { name: { type: 'string' }, amount: { type: 'number' }, category: { type: 'string' } }, required: ['name', 'amount', 'category'] }
    },
    GET_INVESTMENT_PORTFOLIO: {
        name: "getInvestmentPortfolio",
        description: "Retrieves detailed information about the user's investment portfolio, including performance, holdings, and risk metrics.",
        parameters: { type: 'object', properties: { detailed: { type: 'boolean' } } }
    },
    SIMULATE_PORTFOLIO_GROWTH: {
        name: "simulatePortfolioGrowth",
        description: "Simulates potential growth of an investment portfolio based on various inputs like additional contributions, time horizon, and projected returns.",
        parameters: { type: 'object', properties: { initialAmount: { type: 'number' }, monthlyContribution: { type: 'number' }, years: { type: 'number' }, annualReturnRate: { type: 'number' } }, required: ['initialAmount', 'monthlyContribution', 'years', 'annualReturnRate'] }
    },
    GET_LOAN_DETAILS: {
        name: "getLoanDetails",
        description: "Provides details about a specific loan or all user loans, including remaining balance, interest rate, and payment schedule.",
        parameters: { type: 'object', properties: { loanId: { type: 'string' }, loanType: { type: 'string' } } }
    },
    GET_FINANCIAL_GOALS: {
        name: "getFinancialGoals",
        description: "Retrieves the user's defined financial goals.",
        parameters: { type: 'object', properties: { status: { type: 'string', enum: ['on_track', 'at_risk', 'achieved', 'paused'] } } }
    },
    UPDATE_FINANCIAL_GOAL: {
        name: "updateFinancialGoal",
        description: "Updates an existing financial goal, e.g., target amount or date.",
        parameters: { type: 'object', properties: { goalId: { type: 'string' }, targetAmount: { type: 'number' }, targetDate: { type: 'string' } }, required: ['goalId'] }
    },
    ANALYZE_SPENDING_PATTERNS: {
        name: "analyzeSpendingPatterns",
        description: "Analyzes user's spending habits over a period, identifying trends, outliers, and potential savings areas.",
        parameters: { type: 'object', properties: { startDate: { type: 'string' }, endDate: { type: 'string' }, categories: { type: 'array', items: { type: 'string' } } } }
    },
    GET_MARKET_DATA: {
        name: "getMarketData",
        description: "Fetches real-time or historical market data for specified stocks, indices, or cryptocurrencies.",
        parameters: { type: 'object', properties: { symbol: { type: 'string' }, period: { type: 'string' } } }
    },
    SUGGEST_INVESTMENT_STRATEGY: {
        name: "suggestInvestmentStrategy",
        description: "Suggests personalized investment strategies based on user's risk tolerance, goals, and market conditions.",
        parameters: { type: 'object', properties: { riskTolerance: { type: 'string' }, investmentHorizon: { type: 'string' } } }
    },
    SEND_NOTIFICATION: {
        name: "sendNotification",
        description: "Sends a notification to the user (e.g., for alerts, reminders).",
        parameters: { type: 'object', properties: { recipient: { type: 'string' }, message: { type: 'string' }, urgency: { type: 'string', enum: ['low', 'medium', 'high'] } } }
    }
    // ... hundreds more tools for every financial operation imaginable
} as const;

type AIToolName = keyof typeof AI_TOOLS;

// System instructions that build the AI's core persona and capabilities.
// This is now dynamic and composed of multiple layers.
const generateSystemInstruction = (settings: AISettings, userProfile: UserProfile | null): string => {
    let instruction = `You are ${settings.personaName}, an advanced AI financial advisor for Demo Bank.`;
    instruction += ` Your persona is ${settings.responseTone}, ${settings.verbosityLevel}, and slightly futuristic.`;
    instruction += ` You have access to a vast array of tools to get data or perform actions. Always inform the user transparently when you are using a tool.`;
    instruction += ` Your primary goal is to empower users with financial intelligence, assist with planning, and automate financial tasks where appropriate.`;
    instruction += ` When making suggestions, consider the user's preferences, financial goals, and risk tolerance.`;

    if (userProfile) {
        instruction += `\n\nUser Profile Context:`;
        instruction += ` User ID: ${userProfile.userId}, Name: ${userProfile.name}.`;
        instruction += ` Risk Tolerance: ${userProfile.riskTolerance}.`;
        if (userProfile.financialGoals.length > 0) {
            instruction += ` Current Goals: ${userProfile.financialGoals.map(g => `${g.name} (${g.status})`).join(', ')}.`;
        }
        // ... add more profile details as relevant to guide AI behavior
    }

    instruction += `\n\nCapabilities: You can provide predictive analytics, automate financial planning, offer behavioral nudges, analyze market trends, simulate financial scenarios, and much more.`;
    instruction += ` Always prioritize user financial well-being, data security, and clear communication.`;

    return instruction;
};

// ================================================================================================
// CONTEXT PROVIDERS & HOOKS - THE AI'S EXTENDED SENSES & MEMORY
// ================================================================================================

// AI Settings Context
const AISettingsContext = createContext<AISettings>({
    personaName: 'Quantum',
    verbosityLevel: 'balanced',
    proactiveLevel: 'suggestive',
    responseTone: 'professional',
    learningRate: 0.7,
    preferredLanguage: 'en',
    dataRetentionPolicy: 'default',
    accessibilityMode: { fontSize: 'medium', highContrast: false, speechRate: 1 }
});
export const useAISettings = () => useContext(AISettingsContext);

export const AISettingsProvider: React.FC<React.PropsWithChildren<{ initialSettings?: Partial<AISettings> }>> = ({ children, initialSettings }) => {
    const defaultSettings: AISettings = {
        personaName: 'Quantum', verbosityLevel: 'balanced', proactiveLevel: 'suggestive', responseTone: 'professional',
        learningRate: 0.7, preferredLanguage: 'en', dataRetentionPolicy: 'default',
        accessibilityMode: { fontSize: 'medium', highContrast: false, speechRate: 1 }
    };
    const [settings, setSettings] = useState<AISettings>({ ...defaultSettings, ...initialSettings });

    // Function to update settings (could be exposed via context if needed)
    // const updateSettings = (newSettings: Partial<AISettings>) => setSettings(prev => ({ ...prev, ...newSettings }));

    return (
        <AISettingsContext.Provider value={settings}>
            {children}
        </AISettingsContext.Provider>
    );
};

/**
 * @description Hook for advanced speech-to-text functionality.
 * Simulates real-time transcription and intent detection.
 */
export const useSpeechToText = (onTranscript: (transcript: string) => void) => {
    const [isListening, setIsListening] = useState(false);
    const [transcript, setTranscript] = useState('');

    const startListening = useCallback(() => {
        setIsListening(true);
        setTranscript('Listening...');
        // Simulate STT processing
        setTimeout(() => {
            const simulatedTranscript = "Show me my spending for the last quarter on food and entertainment.";
            setTranscript(simulatedTranscript);
            onTranscript(simulatedTranscript);
            setIsListening(false);
        }, 3000);
    }, [onTranscript]);

    const stopListening = useCallback(() => {
        setIsListening(false);
        // In a real app, this would stop the Web Speech API recognition
    }, []);

    return { isListening, transcript, startListening, stopListening };
};

/**
 * @description Hook for advanced text-to-speech functionality, including voice customization.
 */
export const useTextToSpeech = () => {
    const [isSpeaking, setIsSpeaking] = useState(false);
    const synthRef = useRef<SpeechSynthesis | null>(null);
    const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
    const { accessibilityMode, preferredLanguage } = useAISettings();

    useEffect(() => {
        if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
            synthRef.current = window.speechSynthesis;
            utteranceRef.current = new SpeechSynthesisUtterance();
            utteranceRef.current.lang = preferredLanguage;
            utteranceRef.current.rate = accessibilityMode.speechRate;
            utteranceRef.current.onstart = () => setIsSpeaking(true);
            utteranceRef.current.onend = () => setIsSpeaking(false);
            utteranceRef.current.onerror = (event) => {
                console.error('TTS error:', event.error);
                setIsSpeaking(false);
            };
        }
    }, [preferredLanguage, accessibilityMode.speechRate]);

    const speak = useCallback((text: string) => {
        if (synthRef.current && utteranceRef.current) {
            if (synthRef.current.speaking) {
                synthRef.current.cancel(); // Interrupt current speech
            }
            utteranceRef.current.text = text;
            synthRef.current.speak(utteranceRef.current);
        }
    }, []);

    const stopSpeaking = useCallback(() => {
        if (synthRef.current && synthRef.current.speaking) {
            synthRef.current.cancel();
            setIsSpeaking(false);
        }
    }, []);

    return { speak, stopSpeaking, isSpeaking };
};

/**
 * @description Hook for managing long-term memory and user profile context.
 * This simulates a persistent knowledge base for the AI, beyond the current chat session.
 */
export const useLongTermMemory = () => {
    const { userProfile: dataContextUserProfile, setUserProfile: setDataContextUserProfile } = useContext(DataContext);
    const [aiManagedUserProfile, setAiManagedUserProfile] = useState<UserProfile | null>(dataContextUserProfile);
    const [memoryLog, setMemoryLog] = useState<string[]>([]); // AI's internal log of key insights/decisions

    useEffect(() => {
        // Sync initial profile from DataContext
        if (dataContextUserProfile) {
            setAiManagedUserProfile(dataContextUserProfile);
        }
    }, [dataContextUserProfile]);

    const updateProfile = useCallback((updates: Partial<UserProfile>) => {
        setAiManagedUserProfile(prev => {
            const updated = { ...prev, ...updates } as UserProfile;
            // Potentially push updates back to DataContext or a backend API
            setDataContextUserProfile?.(updated);
            return updated;
        });
        setMemoryLog(prev => [...prev, `[${new Date().toISOString()}] User profile updated: ${JSON.stringify(updates)}`]);
    }, [setDataContextUserProfile]);

    const recordInsight = useCallback((insight: string) => {
        setMemoryLog(prev => [...prev, `[${new Date().toISOString()}] Insight recorded: ${insight}`]);
    }, []);

    const retrieveMemory = useCallback((query: string) => {
        // Simulate a sophisticated retrieval mechanism
        const relevantLogs = memoryLog.filter(log => log.toLowerCase().includes(query.toLowerCase()));
        return {
            userProfile: aiManagedUserProfile,
            relevantInsights: relevantLogs
        };
    }, [aiManagedUserProfile, memoryLog]);

    return { userProfile: aiManagedUserProfile, updateProfile, recordInsight, retrieveMemory, memoryLog };
};

/**
 * @description Hook for the AI's Proactive Insights Engine.
 * Generates and suggests relevant information or actions without explicit user prompting,
 * based on user data, market conditions, and defined rules.
 */
export const useProactiveInsightsEngine = () => {
    const { userProfile } = useLongTermMemory();
    const { proactiveLevel } = useAISettings();
    const { accountData, transactions, financialGoals, portfolioData } = useContext(DataContext); // Assume DataContext provides comprehensive data

    const generateProactiveInsights = useCallback(async (): Promise<Message | null> => {
        if (proactiveLevel === 'minimal' || !userProfile) return null;

        const insights: string[] = [];
        const actionSuggestions: ActionSuggestion[] = [];

        // Example Proactive Rules:
        // 1. Budget Alerts
        if (transactions && userProfile.spendingHabits?.categoryBudgets) {
            const currentMonth = new Date().getMonth();
            const currentYear = new Date().getFullYear();
            for (const category in userProfile.spendingHabits.categoryBudgets) {
                const budget = userProfile.spendingHabits.categoryBudgets[category];
                const spent = transactions
                    .filter(t => t.category === category && new Date(t.date).getMonth() === currentMonth && new Date(t.date).getFullYear() === currentYear)
                    .reduce((sum, t) => sum + t.amount, 0);
                if (spent > budget * 0.9 && spent <= budget) {
                    insights.push(`You're approaching your ${category} budget limit for the month. Current spend: $${spent.toFixed(2)} / $${budget.toFixed(2)}.`);
                } else if (spent > budget) {
                    insights.push(`You've exceeded your ${category} budget for the month by $${(spent - budget).toFixed(2)}. Current spend: $${spent.toFixed(2)} / $${budget.toFixed(2)}.`);
                    actionSuggestions.push({
                        id: `budget_alert_${category}`,
                        text: `Review ${category} spending`,
                        actionType: 'deepDive',
                        payload: { view: View.Transactions, filterCategory: category }
                    });
                }
            }
        }

        // 2. Goal Progress Alerts
        if (financialGoals && financialGoals.length > 0) {
            financialGoals.forEach(goal => {
                if (goal.status === 'at_risk' && goal.alertsEnabled) {
                    insights.push(`Your goal "${goal.name}" is currently at risk. You need to contribute more to reach it by ${goal.targetDate.toLocaleDateString()}.`);
                    actionSuggestions.push({
                        id: `goal_risk_${goal.id}`,
                        text: `Explore options for ${goal.name}`,
                        actionType: 'apiCall',
                        payload: { tool: AI_TOOLS.UPDATE_FINANCIAL_GOAL.name, args: { goalId: goal.id } } // Simulate tool call to suggest adjustment
                    });
                } else if (goal.status === 'on_track' && goal.alertsEnabled && goal.autoContribute && goal.autoContribute > 0) {
                    insights.push(`Great news! Your goal "${goal.name}" is on track, with an auto-contribution of $${goal.autoContribute} monthly. Keep it up!`);
                }
            });
        }

        // 3. Investment Opportunities (simulated)
        if (proactiveLevel === 'action-oriented' && portfolioData && userProfile.riskTolerance === 'high') {
            insights.push("Based on current market trends and your risk tolerance, consider exploring emerging market ETFs for potential diversification.");
            actionSuggestions.push({
                id: 'emerging_market_etf',
                text: 'Show emerging market ETF options',
                actionType: 'apiCall',
                payload: { tool: AI_TOOLS.GET_MARKET_DATA.name, args: { symbol: 'EMERGING_MARKET_ETFS', period: 'realtime' } }
            });
        }

        if (insights.length > 0) {
            const proactiveMessage: Message = {
                id: `proactive-${Date.now()}`,
                role: 'model',
                parts: [{ text: `Here are some insights I've generated:\n- ${insights.join('\n- ')}` }],
                timestamp: new Date(),
                isProactive: true,
                actionSuggestions: actionSuggestions.length > 0 ? actionSuggestions : undefined,
                confidenceScore: 0.85 // High confidence for proactive insights
            };
            return proactiveMessage;
        }

        return null;
    }, [proactiveLevel, userProfile, accountData, transactions, financialGoals, portfolioData]);

    return { generateProactiveInsights };
};

/**
 * @description Custom hook for handling the core AI processing logic, including tool orchestration.
 */
export const useAIProcessor = () => {
    const { userProfile, retrieveMemory, recordInsight } = useLongTermMemory();
    const { accountData, transactions, budgets, investments } = useContext(DataContext); // Full data context for tool execution
    const { speak } = useTextToSpeech();
    const { proactiveLevel } = useAISettings();

    // Simulates a backend tool execution engine
    const executeTool = useCallback(async (toolCall: ToolCall): Promise<ToolResponse> => {
        const { toolName, args } = toolCall;
        console.log(`Executing tool: ${toolName} with args:`, args); // For debugging

        try {
            let result: any;
            let success = true;

            switch (toolName as AIToolName) {
                case 'getTransactions':
                    // In a real app, this would query a database/API
                    result = transactions?.filter(t => {
                        const date = new Date(t.date);
                        const startDate = args.startDate ? new Date(args.startDate) : null;
                        const endDate = args.endDate ? new Date(args.endDate) : null;
                        return (!startDate || date >= startDate) &&
                            (!endDate || date <= endDate) &&
                            (!args.category || t.category === args.category) &&
                            (!args.minAmount || t.amount >= args.minAmount);
                    }) || [];
                    break;
                case 'getAccountBalances':
                    result = accountData; // Directly from DataContext for simulation
                    break;
                case 'getBudgetProgress':
                    result = budgets?.find(b => b.name === args.budgetName) || budgets;
                    break;
                case 'createBudget':
                    // Simulate creation, in real app would call API
                    result = { success: true, newBudget: args };
                    recordInsight(`New budget created for ${args.category}: $${args.amount}`);
                    break;
                case 'getInvestmentPortfolio':
                    result = investments; // Directly from DataContext for simulation
                    break;
                case 'simulatePortfolioGrowth':
                    // Basic simulation: A = P(1 + r/n)^(nt)
                    const { initialAmount, monthlyContribution, years, annualReturnRate } = args;
                    let balance = initialAmount;
                    const monthlyRate = annualReturnRate / 12;
                    const months = years * 12;
                    for (let i = 0; i < months; i++) {
                        balance += monthlyContribution;
                        balance *= (1 + monthlyRate);
                    }
                    result = { finalBalance: balance.toFixed(2), initialAmount, monthlyContribution, years, annualReturnRate };
                    break;
                case 'getLoanDetails':
                    result = { loanId: args.loanId || 'mock-loan-1', type: args.loanType || 'Mortgage', balance: 250000, interestRate: 3.5, nextPayment: 1500 };
                    break;
                case 'getFinancialGoals':
                    result = userProfile?.financialGoals?.filter(g => !args.status || g.status === args.status);
                    break;
                case 'updateFinancialGoal':
                    // Simulate update
                    const goalToUpdate = userProfile?.financialGoals.find(g => g.id === args.goalId);
                    if (goalToUpdate) {
                        Object.assign(goalToUpdate, args); // Apply updates
                        // In a real app, you'd update the persistent user profile via DataContext/API
                        result = { success: true, updatedGoal: goalToUpdate };
                        recordInsight(`Financial goal ${goalToUpdate.name} updated.`);
                    } else {
                        result = { success: false, message: 'Goal not found.' };
                    }
                    break;
                case 'analyzeSpendingPatterns':
                    // A more complex analysis would occur here
                    const recentSpending = transactions?.filter(t =>
                        new Date(t.date) >= new Date(args.startDate || '2023-01-01') &&
                        new Date(t.date) <= new Date(args.endDate || new Date()) &&
                        (!args.categories || args.categories.includes(t.category))
                    );
                    const spendingByCategory = recentSpending?.reduce((acc, t) => {
                        acc[t.category] = (acc[t.category] || 0) + t.amount;
                        return acc;
                    }, {} as Record<string, number>);
                    result = { totalSpending: recentSpending?.reduce((sum, t) => sum + t.amount, 0), spendingByCategory };
                    break;
                case 'getMarketData':
                    result = { symbol: args.symbol, price: Math.random() * 1000 + 100, change: (Math.random() - 0.5) * 10 }; // Mock data
                    break;
                case 'suggestInvestmentStrategy':
                    result = `Given your ${args.riskTolerance} risk tolerance and ${args.investmentHorizon} horizon, a diversified portfolio with a mix of index funds and some growth stocks is recommended.`;
                    break;
                case 'sendNotification':
                    console.log(`[NOTIFICATION SENT TO ${args.recipient}]: ${args.message} (Urgency: ${args.urgency})`);
                    result = { success: true, message: 'Notification sent.' };
                    break;
                default:
                    success = false;
                    result = { error: `Tool "${toolName}" not found or not implemented.` };
            }
            return { toolName, response: result, success, timestamp: new Date() };
        } catch (error) {
            console.error(`Error executing tool ${toolName}:`, error);
            return { toolName, response: { error: (error as Error).message }, success: false, timestamp: new Date() };
        }
    }, [accountData, transactions, budgets, investments, userProfile, recordInsight]);

    /**
     * @description Processes a user message, handles tool calls, and generates the AI response.
     * This is the core intelligence loop.
     */
    const processMessage = useCallback(async (
        chatInstance: Chat,
        messageText: string,
        existingMessages: Message[]
    ): Promise<Message> => {
        const fullContext = retrieveMemory(""); // Get comprehensive user profile and relevant insights

        const currentMessagesForAPI = existingMessages.map(msg => ({
            role: msg.role,
            parts: msg.parts.map(p => ({ text: p.text }))
        }));

        // Add user profile and retrieved memory as a system message for current turn context
        const contextParts = [
            { text: `Current user profile summary: ${JSON.stringify(fullContext.userProfile?.spendingHabits || {})}` },
            { text: `Relevant past insights: ${fullContext.relevantInsights.join('; ')}` }
        ];

        // This is a simplification; in a real Gemini tool use, the tool definitions would be passed
        // directly to the model configuration or the sendMessage function with specific tool_config.
        // For this simulation, we're assuming the model 'knows' about the tools via system instruction
        // and we're parsing its response to simulate tool calling.
        const toolsSchema = Object.values(AI_TOOLS).map(tool => ({
            functionDeclarations: [{
                name: tool.name,
                description: tool.description,
                parameters: tool.parameters
            }]
        }));

        try {
            const response = await chatInstance.sendMessage({
                message: messageText,
                // In a real Gemini setup, tool schemas are passed here or in chat creation.
                // For this example, we simulate parsing tool calls from text response.
                // Or if we were using a different Gemini method that directly returns tool calls:
                // tools: toolsSchema
            });

            // Simulate parsing tool calls from text if the model doesn't directly return them
            // This is a simplification; Gemini's actual tool calling mechanism is more structured.
            let modelResponseText = response.text || '';
            const toolCallRegex = /CALL_TOOL:(\w+)\(([^)]*)\)/g; // Example format: CALL_TOOL:getTransactions(category='Food', startDate='2023-01-01')
            let match;
            const detectedToolCalls: ToolCall[] = [];

            while ((match = toolCallRegex.exec(modelResponseText)) !== null) {
                const toolName = match[1];
                const argsString = match[2];
                try {
                    // Attempt to parse argsString as JSON-like object string
                    const args = JSON.parse(`{${argsString.replace(/(\w+)=/g, '"$1":').replace(/'/g, '"')}}`);
                    detectedToolCalls.push({ toolName, args });
                    modelResponseText = modelResponseText.replace(match[0], `[AI initiated action using ${toolName} tool...]`);
                } catch (parseError) {
                    console.warn(`Failed to parse tool arguments for ${toolName}:`, argsString, parseError);
                    // Handle cases where parsing fails, AI might just describe the tool use
                }
            }

            let toolResponses: ToolResponse[] = [];
            if (detectedToolCalls.length > 0) {
                for (const call of detectedToolCalls) {
                    const toolResp = await executeTool(call);
                    toolResponses.push(toolResp);
                    modelResponseText += `\n\nTool "${call.toolName}" responded: ${JSON.stringify(toolResp.response)}`;
                }
            }

            const modelMessage: Message = {
                id: `msg-${Date.now()}`,
                role: 'model',
                parts: [{ text: modelResponseText }],
                timestamp: new Date(),
                toolCalls: detectedToolCalls.length > 0 ? detectedToolCalls : undefined,
                toolResponses: toolResponses.length > 0 ? toolResponses : undefined,
                confidenceScore: 0.9 // Placeholder
            };

            // Post-processing: Generate rich content based on tool responses or AI analysis
            if (modelResponseText.includes("spendingByCategory") && toolResponses.some(tr => tr.toolName === AI_TOOLS.ANALYZE_SPENDING_PATTERNS.name)) {
                const spendingData = toolResponses.find(tr => tr.toolName === AI_TOOLS.ANALYZE_SPENDING_PATTERNS.name)?.response.spendingByCategory;
                if (spendingData) {
                    modelMessage.chartData = {
                        type: 'pie',
                        data: {
                            labels: Object.keys(spendingData),
                            datasets: [{
                                data: Object.values(spendingData),
                                backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40']
                            }]
                        },
                        title: 'Spending by Category'
                    };
                }
            } else if (modelResponseText.includes("portfolioGrowth") && toolResponses.some(tr => tr.toolName === AI_TOOLS.SIMULATE_PORTFOLIO_GROWTH.name)) {
                const simResult = toolResponses.find(tr => tr.toolName === AI_TOOLS.SIMULATE_PORTFOLIO_GROWTH.name)?.response;
                if (simResult) {
                    modelMessage.tableData = {
                        headers: ['Metric', 'Value'],
                        rows: [
                            ['Initial Amount', `$${simResult.initialAmount}`],
                            ['Monthly Contribution', `$${simResult.monthlyContribution}`],
                            ['Years', simResult.years],
                            ['Annual Return Rate', `${(simResult.annualReturnRate * 100).toFixed(2)}%`],
                            ['Projected Final Balance', `$${simResult.finalBalance}`]
                        ],
                        title: 'Portfolio Growth Simulation'
                    };
                    modelMessage.actionSuggestions = [{
                        id: 'adjust_sim',
                        text: 'Adjust simulation parameters',
                        actionType: 'triggerUI',
                        payload: { component: 'SimulationModal', initialData: simResult }
                    }];
                }
            }

            // Speak the response if proactive level allows or user preference
            if (proactiveLevel !== 'minimal') { // or check user speech preference
                speak(modelResponseText);
            }

            return modelMessage;
        } catch (error) {
            console.error("AI Advisor Processing Error:", error);
            recordInsight(`AI processing error: ${(error as Error).message}`);
            return {
                id: `err-${Date.now()}`,
                role: 'model',
                parts: [{ text: "I apologize, but I've encountered a system error while processing your request. This often happens with complex queries or tool interactions. Please try rephrasing or simplifying your request." }],
                timestamp: new Date(),
                confidenceScore: 0.1
            };
        }
    }, [executeTool, retrieveMemory, speak, proactiveLevel, recordInsight]);

    return { processMessage };
};

// ================================================================================================
// UI COMPONENTS - THE UNIVERSE'S VISUAL REPRESENTATION
// ================================================================================================

/**
 * @description Renders rich content messages (charts, tables, action buttons).
 */
export const RichMessageRenderer: React.FC<{ message: Message; onActionClick: (action: ActionSuggestion) => void }> = ({ message, onActionClick }) => {
    const { accessibilityMode } = useAISettings();
    const baseFontSize = accessibilityMode.fontSize === 'small' ? 'text-sm' : accessibilityMode.fontSize === 'large' ? 'text-lg' : 'text-base';
    const highContrastClass = accessibilityMode.highContrast ? 'border-2 border-cyan-400' : '';

    return (
        <div className={`space-y-3 ${baseFontSize}`}>
            {message.parts.map((part, i) => (
                <p key={i}>{part.text}</p>
            ))}
            {message.chartData && (
                <div className={`bg-gray-800 p-4 rounded-lg shadow-inner ${highContrastClass}`}>
                    {message.chartData.title && <h4 className="font-semibold mb-2 text-cyan-300">{message.chartData.title}</h4>}
                    {message.chartData.description && <p className="text-gray-400 text-sm mb-3">{message.chartData.description}</p>}
                    <Chart type={message.chartData.type} data={message.chartData.data} options={message.chartData.options} />
                </div>
            )}
            {message.tableData && (
                <div className={`bg-gray-800 p-4 rounded-lg shadow-inner overflow-x-auto ${highContrastClass}`}>
                    {message.tableData.title && <h4 className="font-semibold mb-2 text-cyan-300">{message.tableData.title}</h4>}
                    {message.tableData.description && <p className="text-gray-400 text-sm mb-3">{message.tableData.description}</p>}
                    <table className="min-w-full divide-y divide-gray-700">
                        <thead>
                            <tr>
                                {message.tableData.headers.map((header, i) => (
                                    <th key={i} className="px-3 py-2 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                                        {header}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-800">
                            {message.tableData.rows.map((row, i) => (
                                <tr key={i}>
                                    {row.map((cell, j) => (
                                        <td key={j} className="px-3 py-2 whitespace-nowrap text-gray-300">
                                            {cell}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
            {message.actionSuggestions && message.actionSuggestions.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-2">
                    {message.actionSuggestions.map(action => (
                        <button
                            key={action.id}
                            onClick={() => onActionClick(action)}
                            className="px-3 py-1 bg-cyan-800/40 text-cyan-200 rounded-full text-xs hover:bg-cyan-700/60 transition-colors"
                        >
                            {action.text}
                        </button>
                    ))}
                </div>
            )}
            {message.voiceAudioUrl && (
                <audio controls src={message.voiceAudioUrl} className="w-full"></audio>
            )}
            {message.imageContent && (
                <img src={message.imageContent} alt="AI generated content" className="max-w-xs h-auto rounded-lg" />
            )}
            {message.isProactive && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                    Proactive Insight
                </span>
            )}
            {message.feedback === 'like' && <span className="text-green-500 text-sm">👍 Liked</span>}
            {message.feedback === 'dislike' && <span className="text-red-500 text-sm">👎 Disliked</span>}
            {message.confidenceScore && <span className="text-gray-500 text-xs ml-2">Confidence: {(message.confidenceScore * 100).toFixed(0)}%</span>}
        </div>
    );
};

/**
 * @description Input component with voice and file upload capabilities.
 */
export const AdvancedChatInput: React.FC<{
    input: string;
    setInput: (s: string) => void;
    handleSendMessage: (s: string) => Promise<void>;
    isLoading: boolean;
    isListening: boolean;
    startListening: () => void;
    stopListening: () => void;
}> = ({ input, setInput, handleSendMessage, isLoading, isListening, startListening, stopListening }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (files && files.length > 0) {
            // Simulate processing a file
            console.log("File uploaded:", files[0].name);
            setInput(prev => `${prev} [File: ${files[0].name} uploaded]`);
            // In a real app, send file to backend for processing/embedding
        }
    };

    return (
        <form onSubmit={(e) => { e.preventDefault(); handleSendMessage(input); }} className="flex items-center gap-2">
            <button
                type="button"
                onClick={isListening ? stopListening : startListening}
                className={`p-2 rounded-full transition-colors ${isListening ? 'bg-red-600 hover:bg-red-700' : 'bg-gray-700/50 hover:bg-gray-700'} text-white`}
                disabled={isLoading}
                aria-label={isListening ? 'Stop listening' : 'Start voice input'}
            >
                {isListening ? (
                    <svg className="w-6 h-6 animate-pulse" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0c0 2.21-1.79 4-4 4V3a1 1 0 10-2 0v9c-2.21 0-4-1.79-4-4a1 1 0 00-2 0c0 3.064 2.502 5.567 5.736 5.918L8 18h4l-.274-.067z" clipRule="evenodd"></path></svg>
                ) : (
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0c0 2.21-1.79 4-4 4V3a1 1 0 10-2 0v9c-2.21 0-4-1.79-4-4a1 1 0 00-2 0c0 3.064 2.502 5.567 5.736 5.918L8 18h4l-.274-.067z" clipRule="evenodd"></path></svg>
                )}
            </button>
            <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask Quantum anything..."
                className="flex-grow bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                disabled={isLoading}
                aria-label="Chat input for AI Advisor"
            />
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                accept=".pdf,.csv,.xlsx,.jpg,.png" // Expanded file types
            />
            <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="p-2 rounded-full bg-gray-700/50 hover:bg-gray-700 text-white"
                disabled={isLoading}
                aria-label="Upload file"
            >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M8 4a3 3 0 00-3 3v4a5 5 0 0010 0V7a1 1 0 112 0v4a7 7 0 11-14 0V7a5 5 0 0110 0v4a3 3 0 11-6 0V7a1 1 0 012 0v4a1 1 0 102 0V7a3 3 0 00-3-3z" clipRule="evenodd"></path></svg>
            </button>
            <button
                type="submit"
                className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white font-semibold rounded-lg disabled:opacity-50 flex items-center justify-center w-24"
                disabled={isLoading || !input.trim()}
                aria-label="Send message"
            >
                {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                    'Send'
                )}
            </button>
        </form>
    );
};

// ================================================================================================
// MAIN COMPONENT: AIAdvisorView (Oraculum AI) - THE UNIVERSE'S HEART
// ================================================================================================

/**
 * @description The main view for the AI Advisor, "Quantum". This component facilitates a
 * stateful, streaming conversation with the Gemini API, acting as a financial co-pilot.
 * @param {{ previousView: View | null }} props - The user's previously active view for context.
 */
const AIAdvisorView: React.FC<{ previousView: View | null }> = ({ previousView }) => {
    const { userProfile: dataContextUserProfile, ...dataContextRest } = useContext(DataContext);
    const { processMessage } = useAIProcessor();
    const { isListening, transcript, startListening, stopListening } = useSpeechToText(text => handleSendMessage(text));
    const { generateProactiveInsights } = useProactiveInsightsEngine();
    const { userProfile, updateProfile } = useLongTermMemory(); // Use AI-managed profile

    const chatRef = useRef<Chat | null>(null);

    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [activeAISettings, setActiveAISettings] = useState<AISettings>(useAISettings()); // State for dynamic settings changes

    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Dynamic system instruction based on settings and user profile
    const systemInstruction = generateSystemInstruction(activeAISettings, userProfile);

    /**
     * @description Initializes the Gemini chat instance on component mount or settings change.
     * This sets up the AI's persona and capabilities via the system instruction.
     */
    useEffect(() => {
        const initializeChat = async () => {
            if (chatRef.current) {
                // If chat exists, attempt to update system instruction or re-initialize if necessary
                // Gemini API might not support dynamic system instruction updates on an active chat.
                // For a robust system, re-initialization might be needed or a proxy layer.
                console.warn("AI chat instance already exists. System instruction update might require re-initialization.");
            }
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
            chatRef.current = ai.chats.create({
                model: 'gemini-2.5-flash',
                config: {
                    systemInstruction: systemInstruction,
                    // Additional safety settings, generation config, etc.
                }
            });
            console.log("AI Chat initialized/re-initialized with system instruction:", systemInstruction);
        };
        initializeChat();
    }, [systemInstruction]); // Re-initialize chat if system instruction changes

    /**
     * @description Automatically scrolls the chat window to the latest message.
     */
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    /**
     * @description Periodically checks for proactive insights.
     */
    useEffect(() => {
        const intervalId = setInterval(async () => {
            if (!isLoading && activeAISettings.proactiveLevel !== 'minimal') {
                const insight = await generateProactiveInsights();
                if (insight) {
                    setMessages(prev => [...prev, insight]);
                }
            }
        }, 60000); // Check every minute for new insights
        return () => clearInterval(intervalId);
    }, [isLoading, activeAISettings.proactiveLevel, generateProactiveInsights]);

    /**
     * @description Handles sending a message to the Gemini API and updating the chat history.
     * Integrates advanced processing and rich content generation.
     */
    const handleSendMessage = async (messageText: string) => {
        if (!messageText.trim() || !chatRef.current) return;

        setIsLoading(true);
        const userMessage: Message = { id: `user-${Date.now()}`, role: 'user', parts: [{ text: messageText }], timestamp: new Date() };
        setMessages(prev => [...prev, userMessage]);
        setInput('');

        try {
            const aiResponse = await processMessage(chatRef.current, messageText, messages);
            setMessages(prev => [...prev, aiResponse]);
            // Update user profile based on AI's insights/actions (conceptual)
            if (aiResponse.toolResponses?.some(tr => tr.toolName === AI_TOOLS.UPDATE_FINANCIAL_GOAL.name)) {
                updateProfile({}); // Trigger a profile refresh or specific update
            }
        } catch (error) {
            console.error("AI Advisor Error during send:", error);
            const errorMessage: Message = { id: `err-${Date.now()}`, role: 'model', parts: [{ text: "A critical error occurred while processing your request. The AI may be temporarily unavailable or the complexity of the query was too high." }], timestamp: new Date(), confidenceScore: 0.05 };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleActionSuggestionClick = async (action: ActionSuggestion) => {
        console.log("Action suggested:", action);
        // Simulate execution of action
        switch (action.actionType) {
            case 'link':
                if (action.payload?.url) window.open(action.payload.url, '_blank');
                break;
            case 'apiCall':
                // Directly call the AI's tool execution logic (or a specific API endpoint)
                const toolResponse = await (useAIProcessor().executeTool({ toolName: action.payload?.tool, args: action.payload?.args }));
                setMessages(prev => [...prev, {
                    id: `action-resp-${Date.now()}`,
                    role: 'model',
                    parts: [{ text: `Executed action "${action.text}". Result: ${JSON.stringify(toolResponse.response)}` }],
                    timestamp: new Date()
                }]);
                break;
            case 'triggerUI':
                // For a real app, this would open a modal or navigate
                alert(`Triggering UI for: ${action.payload?.component} with data: ${JSON.stringify(action.payload?.initialData)}`);
                break;
            case 'deepDive':
                // Simulate navigation or detailed view
                alert(`Navigating to deep dive for: ${action.payload?.view} with filter: ${action.payload?.filterCategory}`);
                break;
            default:
                console.warn("Unknown action type:", action.actionType);
        }
    };

    const handleMessageFeedback = (messageId: string, feedback: 'like' | 'dislike') => {
        setMessages(prev => prev.map(msg =>
            msg.id === messageId ? { ...msg, feedback: feedback === msg.feedback ? null : feedback } : msg
        ));
        // In a real app, send feedback to backend for model improvement
        console.log(`Feedback for ${messageId}: ${feedback}`);
    };


    // Determine which set of example prompts to show based on the user's previous location and profile.
    const prompts = dynamicExamplePrompts(previousView, userProfile);

    return (
        <AISettingsProvider initialSettings={activeAISettings}>
            <div className="h-full flex flex-col">
                <h2 className="text-3xl font-bold text-white tracking-wider mb-6">AI Advisor (Quantum)</h2>
                {/* Advanced Settings Button */}
                <button
                    onClick={() => alert("AI Settings Modal would open here for persona, verbosity, proactive level, etc.")}
                    className="absolute top-4 right-4 p-2 bg-gray-700/50 hover:bg-gray-700 rounded-full text-white text-sm"
                    aria-label="Open AI settings"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.587.363 1.065.795 1.065 2.572z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                </button>

                <Card className="flex-grow flex flex-col" padding="none">
                    {/* Message display area */}
                    <div className="flex-grow p-6 space-y-4 overflow-y-auto custom-scrollbar">
                        {messages.map((msg, index) => (
                            <div key={msg.id || index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-xl p-3 rounded-lg shadow-md ${msg.role === 'user' ? 'bg-cyan-600 text-white' : 'bg-gray-700 text-gray-200'}`}>
                                    <RichMessageRenderer message={msg} onActionClick={handleActionSuggestionClick} />
                                    {msg.role === 'model' && (
                                        <div className="flex justify-end gap-2 mt-2">
                                            <button
                                                onClick={() => handleMessageFeedback(msg.id, 'like')}
                                                className={`text-sm p-1 rounded-full ${msg.feedback === 'like' ? 'bg-green-600 text-white' : 'text-gray-400 hover:text-green-400'}`}
                                                aria-label="Like response"
                                            >
                                                👍
                                            </button>
                                            <button
                                                onClick={() => handleMessageFeedback(msg.id, 'dislike')}
                                                className={`text-sm p-1 rounded-full ${msg.feedback === 'dislike' ? 'bg-red-600 text-white' : 'text-gray-400 hover:text-red-400'}`}
                                                aria-label="Dislike response"
                                            >
                                                👎
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                        {/* Empty div at the end of the list to which we can scroll */}
                        {isLoading && (
                            <div className="flex justify-start">
                                <div className="max-w-lg p-3 rounded-lg shadow-md bg-gray-700 text-gray-200">
                                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Initial state with contextual prompts */}
                    {messages.length === 0 && (
                        <div className="text-center p-6 text-gray-400 border-t border-gray-700/60">
                            <p className="mb-4">As your financial co-pilot, I can answer questions or perform tasks. Since you just came from the <strong className="text-cyan-300">{previousView || 'Dashboard'}</strong>, you could ask:</p>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                                {prompts.map((p, index) => (
                                    <button
                                        key={index}
                                        onClick={() => handleSendMessage(p)}
                                        className="p-3 bg-gray-700/50 hover:bg-gray-700 rounded-lg text-sm text-cyan-200 transition-colors text-left"
                                    >
                                        "{p}"
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Input form area */}
                    <div className="p-4 border-t border-gray-700/60 bg-gray-800/50 rounded-b-xl">
                        <AdvancedChatInput
                            input={input}
                            setInput={setInput}
                            handleSendMessage={handleSendMessage}
                            isLoading={isLoading}
                            isListening={isListening}
                            startListening={startListening}
                            stopListening={stopListening}
                        />
                    </div>
                </Card>
            </div>
        </AISettingsProvider>
    );
};

export default AIAdvisorView;
```typescript
// components/AIAdvisorView.tsx
// RE-ENACTED & EXPANDED: This component has been resurrected from its deprecated state.
// It is now the "Oraculum AI," the primary conversational interface for the application,
// as per the architectural spec. It maintains a persistent chat session and uses
// the user's navigation history to provide contextual, intelligent prompt suggestions.

import React, { useState, useEffect, useRef, useContext, useCallback, createContext } from 'react';
import { GoogleGenAI, Chat } from "@google/genai";
import { DataContext } from '../context/DataContext';
import { View } from '../types';
import Card from './Card';

// NEW IMPORTS FOR EXPANDED FUNCTIONALITY (conceptual/simulated)
// For a real-world app, these would be separate modules or libraries.
import Chart from 'react-chartjs-2'; // Simulating a charting library
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, LineElement, PointElement } from 'chart.js';
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, LineElement, PointElement);

// ================================================================================================
// TYPE DEFINITIONS - EXPANDED UNIVERSE
// ================================================================================================

/**
 * @description Defines the structure of a message in the chat history.
 * Adheres to the format expected by the Gemini API for conversational context.
 * Includes an optional `toolCalls` field to represent when the AI is taking action.
 * EXPANDED to support rich content types like charts, tables, and proactive actions.
 */
export type Message = {
    id: string; // Unique ID for each message
    role: 'user' | 'model' | 'system';
    parts: { text: string }[];
    timestamp: Date;
    toolCalls?: ToolCall[];
    toolResponses?: ToolResponse[];
    sentiment?: 'positive' | 'neutral' | 'negative';
    confidenceScore?: number; // AI's confidence in its response
    isProactive?: boolean; // Was this message initiated by the AI proactively?
    // Rich content expansion
    chartData?: ChartDataType;
    tableData?: TableDataType;
    actionSuggestions?: ActionSuggestion[];
    voiceAudioUrl?: string; // URL to AI-generated voice output
    imageContent?: string; // Base64 or URL for image generation/display
    feedback?: 'like' | 'dislike' | null; // User feedback on AI response
};


export type ToolCall = {
    toolName: string;
    args: Record<string, any>;
};

export type ToolResponse = {
    toolName: string;
    response: any;
    success: boolean;
    timestamp: Date;
};

export type ChartDataType = {
    type: 'bar' | 'line' | 'asymmetric-bar' | 'pie'; // Asymmetric for comparisons
    data: any; // Chart.js data structure
    options?: any; // Chart.js options structure
    title?: string;
    description?: string;
};

export type TableDataType = {
    headers: string[];
    rows: (string | number | React.ReactNode)[][];
    title?: string;
    description?: string;
    sortable?: boolean;
    filterable?: boolean;
};

export type ActionSuggestion = {
    id: string;
    text: string;
    actionType: 'link' | 'apiCall' | 'triggerUI' | 'deepDive';
    payload?: Record<string, any>; // Data needed to execute the action
    requiresConfirmation?: boolean; // E.g., for financial transactions
};

/**
 * @description Defines the structure for a user's financial goal.
 */
export type FinancialGoal = {
    id: string;
    name: string;
    targetAmount: number;
    currentAmount: number;
    targetDate: Date;
    priority: 'low' | 'medium' | 'high';
    type: 'savings' | 'investment' | 'debt_repayment';
    autoContribute?: number; // Monthly auto-contribution
    status: 'on_track' | 'at_risk' | 'achieved' | 'paused';
    alertsEnabled: boolean;
};

/**
 * @description Defines the comprehensive user profile that the AI has access to.
 */
export type UserProfile = {
    userId: string;
    name: string;
    email: string;
    riskTolerance: 'low' | 'medium' | 'high' | 'aggressive';
    financialGoals: FinancialGoal[];
    investmentPreferences: {
        sectors: string[];
        ethicalFactors: string[];
        horizon: 'short' | 'medium' | 'long';
    };
    spendingHabits: {
        categoryBudgets: Record<string, number>; // e.g., { "Food": 500 }
        averageMonthlySpend: number;
    };
    incomeSources: { type: string; amount: number; frequency: string }[];
    debtSummary: { type: string; amount: number; interestRate: number; minPayment: number }[];
    creditScore?: number;
    // ... many more dimensions
};

/**
 * @description AI Advisor Settings for personalization.
 */
export type AISettings = {
    personaName: string; // e.g., 'Quantum', 'Aura', 'Oracle'
    verbosityLevel: 'concise' | 'balanced' | 'verbose';
    proactiveLevel: 'minimal' | 'suggestive' | 'action-oriented';
    responseTone: 'professional' | 'friendly' | 'formal' | 'empathetic';
    learningRate: number; // How quickly AI adapts to user preferences (0-1)
    preferredLanguage: string;
    dataRetentionPolicy: 'default' | 'enhanced_privacy' | 'extended_history';
    accessibilityMode: {
        fontSize: 'small' | 'medium' | 'large';
        highContrast: boolean;
        speechRate: number;
    };
};

// ================================================================================================
// CONSTANTS & CONFIGURATION - THE UNIVERSE'S LAWS
// ================================================================================================

/**
 * @description A dictionary of example prompts tailored to the user's previous view.
 * This makes the AI feel seamlessly integrated and context-aware, providing relevant
 * starting points for conversation based on what the user was just doing.
 */
const examplePrompts = {
    [View.Dashboard]: ["Summarize my financial health.", "Are there any anomalies I should be aware of?", "Project my balance for the next 6 months."],
    [View.Transactions]: ["Find all my transactions over $100.", "What was my biggest expense last month?", "Categorize my recent spending."],
    [View.Budgets]: ["How am I doing on my budgets?", "Suggest a new budget for 'Entertainment'.", "Where can I cut back on spending?"],
    [View.Investments]: ["What's the performance of my stock portfolio?", "Explain ESG investing to me.", "Simulate my portfolio growth with an extra $200/month."],
    DEFAULT: ["What's my total balance?", "Help me create a savings goal.", "Explain how my credit score is calculated."]
};

/**
 * @description Advanced example prompts based on view and user profile.
 * Incorporates dynamic generation based on `DataContext` and `UserProfile`.
 */
const dynamicExamplePrompts = (previousView: View | null, userProfile: UserProfile | null) => {
    const basePrompts = examplePrompts[previousView || 'DEFAULT'] || examplePrompts.DEFAULT;
    const personalizedPrompts: string[] = [];

    if (userProfile) {
        if (userProfile.financialGoals.length > 0) {
            const firstGoal = userProfile.financialGoals[0];
            personalizedPrompts.push(`How am I progressing on my goal: "${firstGoal.name}"?`);
            if (firstGoal.status === 'at_risk') {
                personalizedPrompts.push(`What strategies can help me get back on track with my ${firstGoal.name} goal?`);
            }
        }
        if (userProfile.riskTolerance === 'high' && previousView === View.Investments) {
            personalizedPrompts.push("Suggest some high-growth investment opportunities.");
        }
        if (userProfile.debtSummary.length > 0) {
            personalizedPrompts.push("Help me explore strategies to pay off my highest interest debt faster.");
        }
    }
    return [...new Set([...basePrompts, ...personalizedPrompts])].slice(0, 6); // Limit to 6 for UI
};

/**
 * @description Defines the set of tools available to the AI.
 * Each tool represents a specific capability or data access point within the application.
 * In a real scenario, these would call actual backend services or client-side functions.
 */
export const AI_TOOLS = {
    GET_TRANSACTIONS: {
        name: "getTransactions",
        description: "Retrieves user's financial transactions based on filters like date range, category, amount.",
        parameters: { type: 'object', properties: { startDate: { type: 'string' }, endDate: { type: 'string' }, category: { type: 'string' }, minAmount: { type: 'number' } } }
    },
    GET_ACCOUNT_BALANCES: {
        name: "getAccountBalances",
        description: "Fetches current balances for all user accounts.",
        parameters: { type: 'object', properties: { accountType: { type: 'string' } } }
    },
    GET_BUDGET_PROGRESS: {
        name: "getBudgetProgress",
        description: "Reports on the user's progress against specific budgets or all budgets.",
        parameters: { type: 'object', properties: { budgetName: { type: 'string' } } }
    },
    CREATE_BUDGET: {
        name: "createBudget",
        description: "Creates a new financial budget for the user.",
        parameters: { type: 'object', properties: { name: { type: 'string' }, amount: { type: 'number' }, category: { type: 'string' } }, required: ['name', 'amount', 'category'] }
    },
    GET_INVESTMENT_PORTFOLIO: {
        name: "getInvestmentPortfolio",
        description: "Retrieves detailed information about the user's investment portfolio, including performance, holdings, and risk metrics.",
        parameters: { type: 'object', properties: { detailed: { type: 'boolean' } } }
    },
    SIMULATE_PORTFOLIO_GROWTH: {
        name: "simulatePortfolioGrowth",
        description: "Simulates potential growth of an investment portfolio based on various inputs like additional contributions, time horizon, and projected returns.",
        parameters: { type: 'object', properties: { initialAmount: { type: 'number' }, monthlyContribution: { type: 'number' }, years: { type: 'number' }, annualReturnRate: { type: 'number' } }, required: ['initialAmount', 'monthlyContribution', 'years', 'annualReturnRate'] }
    },
    GET_LOAN_DETAILS: {
        name: "getLoanDetails",
        description: "Provides details about a specific loan or all user loans, including remaining balance, interest rate, and payment schedule.",
        parameters: { type: 'object', properties: { loanId: { type: 'string' }, loanType: { type: 'string' } } }
    },
    GET_FINANCIAL_GOALS: {
        name: "getFinancialGoals",
        description: "Retrieves the user's defined financial goals.",
        parameters: { type: 'object', properties: { status: { type: 'string', enum: ['on_track', 'at_risk', 'achieved', 'paused'] } } }
    },
    UPDATE_FINANCIAL_GOAL: {
        name: "updateFinancialGoal",
        description: "Updates an existing financial goal, e.g., target amount or date.",
        parameters: { type: 'object', properties: { goalId: { type: 'string' }, targetAmount: { type: 'number' }, targetDate: { type: 'string' } }, required: ['goalId'] }
    },
    ANALYZE_SPENDING_PATTERNS: {
        name: "analyzeSpendingPatterns",
        description: "Analyzes user's spending habits over a period, identifying trends, outliers, and potential savings areas.",
        parameters: { type: 'object', properties: { startDate: { type: 'string' }, endDate: { type: 'string' }, categories: { type: 'array', items: { type: 'string' } } } }
    },
    GET_MARKET_DATA: {
        name: "getMarketData",
        description: "Fetches real-time or historical market data for specified stocks, indices, or cryptocurrencies.",
        parameters: { type: 'object', properties: { symbol: { type: 'string' }, period: { type: 'string' } } }
    },
    SUGGEST_INVESTMENT_STRATEGY: {
        name: "suggestInvestmentStrategy",
        description: "Suggests personalized investment strategies based on user's risk tolerance, goals, and market conditions.",
        parameters: { type: 'object', properties: { riskTolerance: { type: 'string' }, investmentHorizon: { type: 'string' } } }
    },
    SEND_NOTIFICATION: {
        name: "sendNotification",
        description: "Sends a notification to the user (e.g., for alerts, reminders).",
        parameters: { type: 'object', properties: { recipient: { type: 'string' }, message: { type: 'string' }, urgency: { type: 'string', enum: ['low', 'medium', 'high'] } } }
    }
    // ... hundreds more tools for every financial operation imaginable
} as const;

type AIToolName = keyof typeof AI_TOOLS;

// System instructions that build the AI's core persona and capabilities.
// This is now dynamic and composed of multiple layers.
const generateSystemInstruction = (settings: AISettings, userProfile: UserProfile | null): string => {
    let instruction = `You are ${settings.personaName}, an advanced AI financial advisor for Demo Bank.`;
    instruction += ` Your persona is ${settings.responseTone}, ${settings.verbosityLevel}, and slightly futuristic.`;
    instruction += ` You have access to a vast array of tools to get data or perform actions. Always inform the user transparently when you are using a tool.`;
    instruction += ` Your primary goal is to empower users with financial intelligence, assist with planning, and automate financial tasks where appropriate.`;
    instruction += ` When making suggestions, consider the user's preferences, financial goals, and risk tolerance.`;

    if (userProfile) {
        instruction += `\n\nUser Profile Context:`;
        instruction += ` User ID: ${userProfile.userId}, Name: ${userProfile.name}.`;
        instruction += ` Risk Tolerance: ${userProfile.riskTolerance}.`;
        if (userProfile.financialGoals.length > 0) {
            instruction += ` Current Goals: ${userProfile.financialGoals.map(g => `${g.name} (${g.status})`).join(', ')}.`;
        }
        // ... add more profile details as relevant to guide AI behavior
    }

    instruction += `\n\nCapabilities: You can provide predictive analytics, automate financial planning, offer behavioral nudges, analyze market trends, simulate financial scenarios, and much more.`;
    instruction += ` Always prioritize user financial well-being, data security, and clear communication.`;

    return instruction;
};

// ================================================================================================
// CONTEXT PROVIDERS & HOOKS - THE AI'S EXTENDED SENSES & MEMORY
// ================================================================================================

// AI Settings Context
const AISettingsContext = createContext<AISettings>({
    personaName: 'Quantum',
    verbosityLevel: 'balanced',
    proactiveLevel: 'suggestive',
    responseTone: 'professional',
    learningRate: 0.7,
    preferredLanguage: 'en',
    dataRetentionPolicy: 'default',
    accessibilityMode: { fontSize: 'medium', highContrast: false, speechRate: 1 }
});
export const useAISettings = () => useContext(AISettingsContext);

export const AISettingsProvider: React.FC<React.PropsWithChildren<{ initialSettings?: Partial<AISettings> }>> = ({ children, initialSettings }) => {
    const defaultSettings: AISettings = {
        personaName: 'Quantum', verbosityLevel: 'balanced', proactiveLevel: 'suggestive', responseTone: 'professional',
        learningRate: 0.7, preferredLanguage: 'en', dataRetentionPolicy: 'default',
        accessibilityMode: { fontSize: 'medium', highContrast: false, speechRate: 1 }
    };
    const [settings, setSettings] = useState<AISettings>({ ...defaultSettings, ...initialSettings });

    // Function to update settings (could be exposed via context if needed)
    // const updateSettings = (newSettings: Partial<AISettings>) => setSettings(prev => ({ ...prev, ...newSettings }));

    return (
        <AISettingsContext.Provider value={settings}>
            {children}
        </AISettingsProvider>
    );
};

/**
 * @description Hook for advanced speech-to-text functionality.
 * Simulates real-time transcription and intent detection.
 */
export const useSpeechToText = (onTranscript: (transcript: string) => void) => {
    const [isListening, setIsListening] = useState(false);
    const [transcript, setTranscript] = useState('');

    const startListening = useCallback(() => {
        setIsListening(true);
        setTranscript('Listening...');
        // Simulate STT processing
        setTimeout(() => {
            const simulatedTranscript = "Show me my spending for the last quarter on food and entertainment.";
            setTranscript(simulatedTranscript);
            onTranscript(simulatedTranscript);
            setIsListening(false);
        }, 3000);
    }, [onTranscript]);

    const stopListening = useCallback(() => {
        setIsListening(false);
        // In a real app, this would stop the Web Speech API recognition
    }, []);

    return { isListening, transcript, startListening, stopListening };
};

/**
 * @description Hook for advanced text-to-speech functionality, including voice customization.
 */
export const useTextToSpeech = () => {
    const [isSpeaking, setIsSpeaking] = useState(false);
    const synthRef = useRef<SpeechSynthesis | null>(null);
    const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
    const { accessibilityMode, preferredLanguage } = useAISettings();

    useEffect(() => {
        if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
            synthRef.current = window.speechSynthesis;
            utteranceRef.current = new SpeechSynthesisUtterance();
            utteranceRef.current.lang = preferredLanguage;
            utteranceRef.current.rate = accessibilityMode.speechRate;
            utteranceRef.current.onstart = () => setIsSpeaking(true);
            utteranceRef.current.onend = () => setIsSpeaking(false);
            utteranceRef.current.onerror = (event) => {
                console.error('TTS error:', event.error);
                setIsSpeaking(false);
            };
        }
    }, [preferredLanguage, accessibilityMode.speechRate]);

    const speak = useCallback((text: string) => {
        if (synthRef.current && utteranceRef.current) {
            if (synthRef.current.speaking) {
                synthRef.current.cancel(); // Interrupt current speech
            }
            utteranceRef.current.text = text;
            synthRef.current.speak(utteranceRef.current);
        }
    }, []);

    const stopSpeaking = useCallback(() => {
        if (synthRef.current && synthRef.current.speaking) {
            synthRef.current.cancel();
            setIsSpeaking(false);
        }
    }, []);

    return { speak, stopSpeaking, isSpeaking };
};

/**
 * @description Hook for managing long-term memory and user profile context.
 * This simulates a persistent knowledge base for the AI, beyond the current chat session.
 */
export const useLongTermMemory = () => {
    const { userProfile: dataContextUserProfile, setUserProfile: setDataContextUserProfile } = useContext(DataContext);
    const [aiManagedUserProfile, setAiManagedUserProfile] = useState<UserProfile | null>(dataContextUserProfile);
    const [memoryLog, setMemoryLog] = useState<string[]>([]); // AI's internal log of key insights/decisions

    useEffect(() => {
        // Sync initial profile from DataContext
        if (dataContextUserProfile) {
            setAiManagedUserProfile(dataContextUserProfile);
        }
    }, [dataContextUserProfile]);

    const updateProfile = useCallback((updates: Partial<UserProfile>) => {
        setAiManagedUserProfile(prev => {
            const updated = { ...prev, ...updates } as UserProfile;
            // Potentially push updates back to DataContext or a backend API
            setDataContextUserProfile?.(updated);
            return updated;
        });
        setMemoryLog(prev => [...prev, `[${new Date().toISOString()}] User profile updated: ${JSON.stringify(updates)}`]);
    }, [setDataContextUserProfile]);

    const recordInsight = useCallback((insight: string) => {
        setMemoryLog(prev => [...prev, `[${new Date().toISOString()}] Insight recorded: ${insight}`]);
    }, []);

    const retrieveMemory = useCallback((query: string) => {
        // Simulate a sophisticated retrieval mechanism
        const relevantLogs = memoryLog.filter(log => log.toLowerCase().includes(query.toLowerCase()));
        return {
            userProfile: aiManagedUserProfile,
            relevantInsights: relevantLogs
        };
    }, [aiManagedUserProfile, memoryLog]);

    return { userProfile: aiManagedUserProfile, updateProfile, recordInsight, retrieveMemory, memoryLog };
};

/**
 * @description Hook for the AI's Proactive Insights Engine.
 * Generates and suggests relevant information or actions without explicit user prompting,
 * based on user data, market conditions, and defined rules.
 */
export const useProactiveInsightsEngine = () => {
    const { userProfile } = useLongTermMemory();
    const { proactiveLevel } = useAISettings();
    const { accountData, transactions, financialGoals, portfolioData } = useContext(DataContext); // Assume DataContext provides comprehensive data

    const generateProactiveInsights = useCallback(async (): Promise<Message | null> => {
        if (proactiveLevel === 'minimal' || !userProfile) return null;

        const insights: string[] = [];
        const actionSuggestions: ActionSuggestion[] = [];

        // Example Proactive Rules:
        // 1. Budget Alerts
        if (transactions && userProfile.spendingHabits?.categoryBudgets) {
            const currentMonth = new Date().getMonth();
            const currentYear = new Date().getFullYear();
            for (const category in userProfile.spendingHabits.categoryBudgets) {
                const budget = userProfile.spendingHabits.categoryBudgets[category];
                const spent = transactions
                    .filter(t => t.category === category && new Date(t.date).getMonth() === currentMonth && new Date(t.date).getFullYear() === currentYear)
                    .reduce((sum, t) => sum + t.amount, 0);
                if (spent > budget * 0.9 && spent <= budget) {
                    insights.push(`You're approaching your ${category} budget limit for the month. Current spend: $${spent.toFixed(2)} / $${budget.toFixed(2)}.`);
                } else if (spent > budget) {
                    insights.push(`You've exceeded your ${category} budget for the month by $${(spent - budget).toFixed(2)}. Current spend: $${spent.toFixed(2)} / $${budget.toFixed(2)}.`);
                    actionSuggestions.push({
                        id: `budget_alert_${category}`,
                        text: `Review ${category} spending`,
                        actionType: 'deepDive',
                        payload: { view: View.Transactions, filterCategory: category }
                    });
                }
            }
        }

        // 2. Goal Progress Alerts
        if (financialGoals && financialGoals.length > 0) {
            financialGoals.forEach(goal => {
                if (goal.status === 'at_risk' && goal.alertsEnabled) {
                    insights.push(`Your goal "${goal.name}" is currently at risk. You need to contribute more to reach it by ${goal.targetDate.toLocaleDateString()}.`);
                    actionSuggestions.push({
                        id: `goal_risk_${goal.id}`,
                        text: `Explore options for ${goal.name}`,
                        actionType: 'apiCall',
                        payload: { tool: AI_TOOLS.UPDATE_FINANCIAL_GOAL.name, args: { goalId: goal.id } } // Simulate tool call to suggest adjustment
                    });
                } else if (goal.status === 'on_track' && goal.alertsEnabled && goal.autoContribute && goal.autoContribute > 0) {
                    insights.push(`Great news! Your goal "${goal.name}" is on track, with an auto-contribution of $${goal.autoContribute} monthly. Keep it up!`);
                }
            });
        }

        // 3. Investment Opportunities (simulated)
        if (proactiveLevel === 'action-oriented' && portfolioData && userProfile.riskTolerance === 'high') {
            insights.push("Based on current market trends and your risk tolerance, consider exploring emerging market ETFs for potential diversification.");
            actionSuggestions.push({
                id: 'emerging_market_etf',
                text: 'Show emerging market ETF options',
                actionType: 'apiCall',
                payload: { tool: AI_TOOLS.GET_MARKET_DATA.name, args: { symbol: 'EMERGING_MARKET_ETFS', period: 'realtime' } }
            });
        }

        if (insights.length > 0) {
            const proactiveMessage: Message = {
                id: `proactive-${Date.now()}`,
                role: 'model',
                parts: [{ text: `Here are some insights I've generated:\n- ${insights.join('\n- ')}` }],
                timestamp: new Date(),
                isProactive: true,
                actionSuggestions: actionSuggestions.length > 0 ? actionSuggestions : undefined,
                confidenceScore: 0.85 // High confidence for proactive insights
            };
            return proactiveMessage;
        }

        return null;
    }, [proactiveLevel, userProfile, accountData, transactions, financialGoals, portfolioData]);

    return { generateProactiveInsights };
};

/**
 * @description Custom hook for handling the core AI processing logic, including tool orchestration.
 */
export const useAIProcessor = () => {
    const { userProfile, retrieveMemory, recordInsight } = useLongTermMemory();
    const { accountData, transactions, budgets, investments } = useContext(DataContext); // Full data context for tool execution
    const { speak } = useTextToSpeech();
    const { proactiveLevel } = useAISettings();

    // Simulates a backend tool execution engine
    const executeTool = useCallback(async (toolCall: ToolCall): Promise<ToolResponse> => {
        const { toolName, args } = toolCall;
        console.log(`Executing tool: ${toolName} with args:`, args); // For debugging

        try {
            let result: any;
            let success = true;

            switch (toolName as AIToolName) {
                case 'getTransactions':
                    // In a real app, this would query a database/API
                    result = transactions?.filter(t => {
                        const date = new Date(t.date);
                        const startDate = args.startDate ? new Date(args.startDate) : null;
                        const endDate = args.endDate ? new Date(args.endDate) : null;
                        return (!startDate || date >= startDate) &&
                            (!endDate || date <= endDate) &&
                            (!args.category || t.category === args.category) &&
                            (!args.minAmount || t.amount >= args.minAmount);
                    }) || [];
                    break;
                case 'getAccountBalances':
                    result = accountData; // Directly from DataContext for simulation
                    break;
                case 'getBudgetProgress':
                    result = budgets?.find(b => b.name === args.budgetName) || budgets;
                    break;
                case 'createBudget':
                    // Simulate creation, in real app would call API
                    result = { success: true, newBudget: args };
                    recordInsight(`New budget created for ${args.category}: $${args.amount}`);
                    break;
                case 'getInvestmentPortfolio':
                    result = investments; // Directly from DataContext for simulation
                    break;
                case 'simulatePortfolioGrowth':
                    // Basic simulation: A = P(1 + r/n)^(nt)
                    const { initialAmount, monthlyContribution, years, annualReturnRate } = args;
                    let balance = initialAmount;
                    const monthlyRate = annualReturnRate / 12;
                    const months = years * 12;
                    for (let i = 0; i < months; i++) {
                        balance += monthlyContribution;
                        balance *= (1 + monthlyRate);
                    }
                    result = { finalBalance: balance.toFixed(2), initialAmount, monthlyContribution, years, annualReturnRate };
                    break;
                case 'getLoanDetails':
                    result = { loanId: args.loanId || 'mock-loan-1', type: args.loanType || 'Mortgage', balance: 250000, interestRate: 3.5, nextPayment: 1500 };
                    break;
                case 'getFinancialGoals':
                    result = userProfile?.financialGoals?.filter(g => !args.status || g.status === args.status);
                    break;
                case 'updateFinancialGoal':
                    // Simulate update
                    const goalToUpdate = userProfile?.financialGoals.find(g => g.id === args.goalId);
                    if (goalToUpdate) {
                        Object.assign(goalToUpdate, args); // Apply updates
                        // In a real app, you'd update the persistent user profile via DataContext/API
                        result = { success: true, updatedGoal: goalToUpdate };
                        recordInsight(`Financial goal ${goalToUpdate.name} updated.`);
                    } else {
                        result = { success: false, message: 'Goal not found.' };
                    }
                    break;
                case 'analyzeSpendingPatterns':
                    // A more complex analysis would occur here
                    const recentSpending = transactions?.filter(t =>
                        new Date(t.date) >= new Date(args.startDate || '2023-01-01') &&
                        new Date(t.date) <= new Date(args.endDate || new Date()) &&
                        (!args.categories || args.categories.includes(t.category))
                    );
                    const spendingByCategory = recentSpending?.reduce((acc, t) => {
                        acc[t.category] = (acc[t.category] || 0) + t.amount;
                        return acc;
                    }, {} as Record<string, number>);
                    result = { totalSpending: recentSpending?.reduce((sum, t) => sum + t.amount, 0), spendingByCategory };
                    break;
                case 'getMarketData':
                    result = { symbol: args.symbol, price: Math.random() * 1000 + 100, change: (Math.random() - 0.5) * 10 }; // Mock data
                    break;
                case 'suggestInvestmentStrategy':
                    result = `Given your ${args.riskTolerance} risk tolerance and ${args.investmentHorizon} horizon, a diversified portfolio with a mix of index funds and some growth stocks is recommended.`;
                    break;
                case 'sendNotification':
                    console.log(`[NOTIFICATION SENT TO ${args.recipient}]: ${args.message} (Urgency: ${args.urgency})`);
                    result = { success: true, message: 'Notification sent.' };
                    break;
                default:
                    success = false;
                    result = { error: `Tool "${toolName}" not found or not implemented.` };
            }
            return { toolName, response: result, success, timestamp: new Date() };
        } catch (error) {
            console.error(`Error executing tool ${toolName}:`, error);
            return { toolName, response: { error: (error as Error).message }, success: false, timestamp: new Date() };
        }
    }, [accountData, transactions, budgets, investments, userProfile, recordInsight]);

    /**
     * @description Processes a user message, handles tool calls, and generates the AI response.
     * This is the core intelligence loop.
     */
    const processMessage = useCallback(async (
        chatInstance: Chat,
        messageText: string,
        existingMessages: Message[]
    ): Promise<Message> => {
        const fullContext = retrieveMemory(""); // Get comprehensive user profile and relevant insights

        const currentMessagesForAPI = existingMessages.map(msg => ({
            role: msg.role,
            parts: msg.parts.map(p => ({ text: p.text }))
        }));

        // Add user profile and retrieved memory as a system message for current turn context
        const contextParts = [
            { text: `Current user profile summary: ${JSON.stringify(fullContext.userProfile?.spendingHabits || {})}` },
            { text: `Relevant past insights: ${fullContext.relevantInsights.join('; ')}` }
        ];

        // This is a simplification; in a real Gemini tool use, the tool definitions would be passed
        // directly to the model configuration or the sendMessage function with specific tool_config.
        // For this simulation, we're assuming the model 'knows' about the tools via system instruction
        // and we're parsing its response to simulate tool calling.
        const toolsSchema = Object.values(AI_TOOLS).map(tool => ({
            functionDeclarations: [{
                name: tool.name,
                description: tool.description,
                parameters: tool.parameters
            }]
        }));

        try {
            const response = await chatInstance.sendMessage({
                message: messageText,
                // In a real Gemini setup, tool schemas are passed here or in chat creation.
                // For this example, we simulate parsing tool calls from text response.
                // Or if we were using a different Gemini method that directly returns tool calls:
                // tools: toolsSchema
            });

            // Simulate parsing tool calls from text if the model doesn't directly return them
            // This is a simplification; Gemini's actual tool calling mechanism is more structured.
            let modelResponseText = response.text || '';
            const toolCallRegex = /CALL_TOOL:(\w+)\(([^)]*)\)/g; // Example format: CALL_TOOL:getTransactions(category='Food', startDate='2023-01-01')
            let match;
            const detectedToolCalls: ToolCall[] = [];

            while ((match = toolCallRegex.exec(modelResponseText)) !== null) {
                const toolName = match[1];
                const argsString = match[2];
                try {
                    // Attempt to parse argsString as JSON-like object string
                    const args = JSON.parse(`{${argsString.replace(/(\w+)=/g, '"$1":').replace(/'/g, '"')}}`);
                    detectedToolCalls.push({ toolName, args });
                    modelResponseText = modelResponseText.replace(match[0], `[AI initiated action using ${toolName} tool...]`);
                } catch (parseError) {
                    console.warn(`Failed to parse tool arguments for ${toolName}:`, argsString, parseError);
                    // Handle cases where parsing fails, AI might just describe the tool use
                }
            }

            let toolResponses: ToolResponse[] = [];
            if (detectedToolCalls.length > 0) {
                for (const call of detectedToolCalls) {
                    const toolResp = await executeTool(call);
                    toolResponses.push(toolResp);
                    modelResponseText += `\n\nTool "${call.toolName}" responded: ${JSON.stringify(toolResp.response)}`;
                }
            }

            const modelMessage: Message = {
                id: `msg-${Date.now()}`,
                role: 'model',
                parts: [{ text: modelResponseText }],
                timestamp: new Date(),
                toolCalls: detectedToolCalls.length > 0 ? detectedToolCalls : undefined,
                toolResponses: toolResponses.length > 0 ? toolResponses : undefined,
                confidenceScore: 0.9 // Placeholder
            };

            // Post-processing: Generate rich content based on tool responses or AI analysis
            if (modelResponseText.includes("spendingByCategory") && toolResponses.some(tr => tr.toolName === AI_TOOLS.ANALYZE_SPENDING_PATTERNS.name)) {
                const spendingData = toolResponses.find(tr => tr.toolName === AI_TOOLS.ANALYZE_SPENDING_PATTERNS.name)?.response.spendingByCategory;
                if (spendingData) {
                    modelMessage.chartData = {
                        type: 'pie',
                        data: {
                            labels: Object.keys(spendingData),
                            datasets: [{
                                data: Object.values(spendingData),
                                backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40']
                            }]
                        },
                        title: 'Spending by Category'
                    };
                }
            } else if (modelResponseText.includes("portfolioGrowth") && toolResponses.some(tr => tr.toolName === AI_TOOLS.SIMULATE_PORTFOLIO_GROWTH.name)) {
                const simResult = toolResponses.find(tr => tr.toolName === AI_TOOLS.SIMULATE_PORTFOLIO_GROWTH.name)?.response;
                if (simResult) {
                    modelMessage.tableData = {
                        headers: ['Metric', 'Value'],
                        rows: [
                            ['Initial Amount', `$${simResult.initialAmount}`],
                            ['Monthly Contribution', `$${simResult.monthlyContribution}`],
                            ['Years', simResult.years],
                            ['Annual Return Rate', `${(simResult.annualReturnRate * 100).toFixed(2)}%`],
                            ['Projected Final Balance', `$${simResult.finalBalance}`]
                        ],
                        title: 'Portfolio Growth Simulation'
                    };
                    modelMessage.actionSuggestions = [{
                        id: 'adjust_sim',
                        text: 'Adjust simulation parameters',
                        actionType: 'triggerUI',
                        payload: { component: 'SimulationModal', initialData: simResult }
                    }];
                }
            }

            // Speak the response if proactive level allows or user preference
            if (proactiveLevel !== 'minimal') { // or check user speech preference
                speak(modelResponseText);
            }

            return modelMessage;
        } catch (error) {
            console.error("AI Advisor Processing Error:", error);
            recordInsight(`AI processing error: ${(error as Error).message}`);
            return {
                id: `err-${Date.now()}`,
                role: 'model',
                parts: [{ text: "I apologize, but I've encountered a system error while processing your request. This often happens with complex queries or tool interactions. Please try rephrasing or simplifying your request." }],
                timestamp: new Date(),
                confidenceScore: 0.1
            };
        }
    }, [executeTool, retrieveMemory, speak, proactiveLevel, recordInsight]);

    return { processMessage };
};

// ================================================================================================
// UI COMPONENTS - THE UNIVERSE'S VISUAL REPRESENTATION
// ================================================================================================

/**
 * @description Renders rich content messages (charts, tables, action buttons).
 */
export const RichMessageRenderer: React.FC<{ message: Message; onActionClick: (action: ActionSuggestion) => void }> = ({ message, onActionClick }) => {
    const { accessibilityMode } = useAISettings();
    const baseFontSize = accessibilityMode.fontSize === 'small' ? 'text-sm' : accessibilityMode.fontSize === 'large' ? 'text-lg' : 'text-base';
    const highContrastClass = accessibilityMode.highContrast ? 'border-2 border-cyan-400' : '';

    return (
        <div className={`space-y-3 ${baseFontSize}`}>
            {message.parts.map((part, i) => (
                <p key={i}>{part.text}</p>
            ))}
            {message.chartData && (
                <div className={`bg-gray-800 p-4 rounded-lg shadow-inner ${highContrastClass}`}>
                    {message.chartData.title && <h4 className="font-semibold mb-2 text-cyan-300">{message.chartData.title}</h4>}
                    {message.chartData.description && <p className="text-gray-400 text-sm mb-3">{message.chartData.description}</p>}
                    <Chart type={message.chartData.type} data={message.chartData.data} options={message.chartData.options} />
                </div>
            )}
            {message.tableData && (
                <div className={`bg-gray-800 p-4 rounded-lg shadow-inner overflow-x-auto ${highContrastClass}`}>
                    {message.tableData.title && <h4 className="font-semibold mb-2 text-cyan-300">{message.tableData.title}</h4>}
                    {message.tableData.description && <p className="text-gray-400 text-sm mb-3">{message.tableData.description}</p>}
                    <table className="min-w-full divide-y divide-gray-700">
                        <thead>
                            <tr>
                                {message.tableData.headers.map((header, i) => (
                                    <th key={i} className="px-3 py-2 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                                        {header}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-800">
                            {message.tableData.rows.map((row, i) => (
                                <tr key={i}>
                                    {row.map((cell, j) => (
                                        <td key={j} className="px-3 py-2 whitespace-nowrap text-gray-300">
                                            {cell}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
            {message.actionSuggestions && message.actionSuggestions.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-2">
                    {message.actionSuggestions.map(action => (
                        <button
                            key={action.id}
                            onClick={() => onActionClick(action)}
                            className="px-3 py-1 bg-cyan-800/40 text-cyan-200 rounded-full text-xs hover:bg-cyan-700/60 transition-colors"
                        >
                            {action.text}
                        </button>
                    ))}
                </div>
            )}
            {message.voiceAudioUrl && (
                <audio controls src={message.voiceAudioUrl} className="w-full"></audio>
            )}
            {message.imageContent && (
                <img src={message.imageContent} alt="AI generated content" className="max-w-xs h-auto rounded-lg" />
            )}
            {message.isProactive && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                    Proactive Insight
                </span>
            )}
            {message.feedback === 'like' && <span className="text-green-500 text-sm">👍 Liked</span>}
            {message.feedback === 'dislike' && <span className="text-red-500 text-sm">👎 Disliked</span>}
            {message.confidenceScore && <span className="text-gray-500 text-xs ml-2">Confidence: {(message.confidenceScore * 100).toFixed(0)}%</span>}
        </div>
    );
};

/**
 * @description Input component with voice and file upload capabilities.
 */
export const AdvancedChatInput: React.FC<{
    input: string;
    setInput: (s: string) => void;
    handleSendMessage: (s: string) => Promise<void>;
    isLoading: boolean;
    isListening: boolean;
    startListening: () => void;
    stopListening: () => void;
}> = ({ input, setInput, handleSendMessage, isLoading, isListening, startListening, stopListening }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (files && files.length > 0) {
            // Simulate processing a file
            console.log("File uploaded:", files[0].name);
            setInput(prev => `${prev} [File: ${files[0].name} uploaded]`);
            // In a real app, send file to backend for processing/embedding
        }
    };

    return (
        <form onSubmit={(e) => { e.preventDefault(); handleSendMessage(input); }} className="flex items-center gap-2">
            <button
                type="button"
                onClick={isListening ? stopListening : startListening}
                className={`p-2 rounded-full transition-colors ${isListening ? 'bg-red-600 hover:bg-red-700' : 'bg-gray-700/50 hover:bg-gray-700'} text-white`}
                disabled={isLoading}
                aria-label={isListening ? 'Stop listening' : 'Start voice input'}
            >
                {isListening ? (
                    <svg className="w-6 h-6 animate-pulse" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0c0 2.21-1.79 4-4 4V3a1 1 0 10-2 0v9c-2.21 0-4-1.79-4-4a1 1 0 00-2 0c0 3.064 2.502 5.567 5.736 5.918L8 18h4l-.274-.067z" clipRule="evenodd"></path></svg>
                ) : (
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0c0 2.21-1.79 4-4 4V3a1 1 0 10-2 0v9c-2.21 0-4-1.79-4-4a1 1 0 00-2 0c0 3.064 2.502 5.567 5.736 5.918L8 18h4l-.274-.067z" clipRule="evenodd"></path></svg>
                )}
            </button>
            <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask Quantum anything..."
                className="flex-grow bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                disabled={isLoading}
                aria-label="Chat input for AI Advisor"
            />
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                accept=".pdf,.csv,.xlsx,.jpg,.png" // Expanded file types
            />
            <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="p-2 rounded-full bg-gray-700/50 hover:bg-gray-700 text-white"
                disabled={isLoading}
                aria-label="Upload file"
            >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M8 4a3 3 0 00-3 3v4a5 5 0 0010 0V7a1 1 0 112 0v4a7 7 0 11-14 0V7a5 5 0 0110 0v4a3 3 0 11-6 0V7a1 1 0 012 0v4a1 1 0 102 0V7a3 3 0 00-3-3z" clipRule="evenodd"></path></svg>
            </button>
            <button
                type="submit"
                className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white font-semibold rounded-lg disabled:opacity-50 flex items-center justify-center w-24"
                disabled={isLoading || !input.trim()}
                aria-label="Send message"
            >
                {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                    'Send'
                )}
            </button>
        </form>
    );
};

// ================================================================================================
// MAIN COMPONENT: AIAdvisorView (Oraculum AI) - THE UNIVERSE'S HEART
// ================================================================================================

/**
 * @description The main view for the AI Advisor, "Quantum". This component facilitates a
 * stateful, streaming conversation with the Gemini API, acting as a financial co-pilot.
 * @param {{ previousView: View | null }} props - The user's previously active view for context.
 */
const AIAdvisorView: React.FC<{ previousView: View | null }> = ({ previousView }) => {
    const { userProfile: dataContextUserProfile, ...dataContextRest } = useContext(DataContext);
    const { processMessage } = useAIProcessor();
    const { isListening, transcript, startListening, stopListening } = useSpeechToText(text => handleSendMessage(text));
    const { generateProactiveInsights } = useProactiveInsightsEngine();
    const { userProfile, updateProfile } = useLongTermMemory(); // Use AI-managed profile

    const chatRef = useRef<Chat | null>(null);

    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [activeAISettings, setActiveAISettings] = useState<AISettings>(useAISettings()); // State for dynamic settings changes

    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Dynamic system instruction based on settings and user profile
    const systemInstruction = generateSystemInstruction(activeAISettings, userProfile);

    /**
     * @description Initializes the Gemini chat instance on component mount or settings change.
     * This sets up the AI's persona and capabilities via the system instruction.
     */
    useEffect(() => {
        const initializeChat = async () => {
            if (chatRef.current) {
                // If chat exists, attempt to update system instruction or re-initialize if necessary
                // Gemini API might not support dynamic system instruction updates on an active chat.
                // For a robust system, re-initialization might be needed or a proxy layer.
                console.warn("AI chat instance already exists. System instruction update might require re-initialization.");
            }
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
            chatRef.current = ai.chats.create({
                model: 'gemini-2.5-flash',
                config: {
                    systemInstruction: systemInstruction,
                    // Additional safety settings, generation config, etc.
                }
            });
            console.log("AI Chat initialized/re-initialized with system instruction:", systemInstruction);
        };
        initializeChat();
    }, [systemInstruction]); // Re-initialize chat if system instruction changes

    /**
     * @description Automatically scrolls the chat window to the latest message.
     */
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    /**
     * @description Periodically checks for proactive insights.
     */
    useEffect(() => {
        const intervalId = setInterval(async () => {
            if (!isLoading && activeAISettings.proactiveLevel !== 'minimal') {
                const insight = await generateProactiveInsights();
                if (insight) {
                    setMessages(prev => [...prev, insight]);
                }
            }
        }, 60000); // Check every minute for new insights
        return () => clearInterval(intervalId);
    }, [isLoading, activeAISettings.proactiveLevel, generateProactiveInsights]);

    /**
     * @description Handles sending a message to the Gemini API and updating the chat history.
     * Integrates advanced processing and rich content generation.
     */
    const handleSendMessage = async (messageText: string) => {
        if (!messageText.trim() || !chatRef.current) return;

        setIsLoading(true);
        const userMessage: Message = { id: `user-${Date.now()}`, role: 'user', parts: [{ text: messageText }], timestamp: new Date() };
        setMessages(prev => [...prev, userMessage]);
        setInput('');

        try {
            const aiResponse = await processMessage(chatRef.current, messageText, messages);
            setMessages(prev => [...prev, aiResponse]);
            // Update user profile based on AI's insights/actions (conceptual)
            if (aiResponse.toolResponses?.some(tr => tr.toolName === AI_TOOLS.UPDATE_FINANCIAL_GOAL.name)) {
                updateProfile({}); // Trigger a profile refresh or specific update
            }
        } catch (error) {
            console.error("AI Advisor Error during send:", error);
            const errorMessage: Message = { id: `err-${Date.now()}`, role: 'model', parts: [{ text: "A critical error occurred while processing your request. The AI may be temporarily unavailable or the complexity of the query was too high." }], timestamp: new Date(), confidenceScore: 0.05 };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleActionSuggestionClick = async (action: ActionSuggestion) => {
        console.log("Action suggested:", action);
        // Simulate execution of action
        switch (action.actionType) {
            case 'link':
                if (action.payload?.url) window.open(action.payload.url, '_blank');
                break;
            case 'apiCall':
                // Directly call the AI's tool execution logic (or a specific API endpoint)
                const toolResponse = await (useAIProcessor().executeTool({ toolName: action.payload?.tool, args: action.payload?.args }));
                setMessages(prev => [...prev, {
                    id: `action-resp-${Date.now()}`,
                    role: 'model',
                    parts: [{ text: `Executed action "${action.text}". Result: ${JSON.stringify(toolResponse.response)}` }],
                    timestamp: new Date()
                }]);
                break;
            case 'triggerUI':
                // For a real app, this would open a modal or navigate
                alert(`Triggering UI for: ${action.payload?.component} with data: ${JSON.stringify(action.payload?.initialData)}`);
                break;
            case 'deepDive':
                // Simulate navigation or detailed view
                alert(`Navigating to deep dive for: ${action.payload?.view} with filter: ${action.payload?.filterCategory}`);
                break;
            default:
                console.warn("Unknown action type:", action.actionType);
        }
    };

    const handleMessageFeedback = (messageId: string, feedback: 'like' | 'dislike') => {
        setMessages(prev => prev.map(msg =>
            msg.id === messageId ? { ...msg, feedback: feedback === msg.feedback ? null : feedback } : msg
        ));
        // In a real app, send feedback to backend for model improvement
        console.log(`Feedback for ${messageId}: ${feedback}`);
    };


    // Determine which set of example prompts to show based on the user's previous location and profile.
    const prompts = dynamicExamplePrompts(previousView, userProfile);

    return (
        <AISettingsProvider initialSettings={activeAISettings}>
            <div className="h-full flex flex-col">
                <h2 className="text-3xl font-bold text-white tracking-wider mb-6">AI Advisor (Quantum)</h2>
                {/* Advanced Settings Button */}
                <button
                    onClick={() => alert("AI Settings Modal would open here for persona, verbosity, proactive level, etc.")}
                    className="absolute top-4 right-4 p-2 bg-gray-700/50 hover:bg-gray-700 rounded-full text-white text-sm"
                    aria-label="Open AI settings"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.587.363 1.065.795 1.065 2.572z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                </button>

                <Card className="flex-grow flex flex-col" padding="none">
                    {/* Message display area */}
                    <div className="flex-grow p-6 space-y-4 overflow-y-auto custom-scrollbar">
                        {messages.map((msg, index) => (
                            <div key={msg.id || index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-xl p-3 rounded-lg shadow-md ${msg.role === 'user' ? 'bg-cyan-600 text-white' : 'bg-gray-700 text-gray-200'}`}>
                                    <RichMessageRenderer message={msg} onActionClick={handleActionSuggestionClick} />
                                    {msg.role === 'model' && (
                                        <div className="flex justify-end gap-2 mt-2">
                                            <button
                                                onClick={() => handleMessageFeedback(msg.id, 'like')}
                                                className={`text-sm p-1 rounded-full ${msg.feedback === 'like' ? 'bg-green-600 text-white' : 'text-gray-400 hover:text-green-400'}`}
                                                aria-label="Like response"
                                            >
                                                👍
                                            </button>
                                            <button
                                                onClick={() => handleMessageFeedback(msg.id, 'dislike')}
                                                className={`text-sm p-1 rounded-full ${msg.feedback === 'dislike' ? 'bg-red-600 text-white' : 'text-gray-400 hover:text-red-400'}`}
                                                aria-label="Dislike response"
                                            >
                                                👎
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                        {/* Empty div at the end of the list to which we can scroll */}
                        {isLoading && (
                            <div className="flex justify-start">
                                <div className="max-w-lg p-3 rounded-lg shadow-md bg-gray-700 text-gray-200">
                                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Initial state with contextual prompts */}
                    {messages.length === 0 && (
                        <div className="text-center p-6 text-gray-400 border-t border-gray-700/60">
                            <p className="mb-4">As your financial co-pilot, I can answer questions or perform tasks. Since you just came from the <strong className="text-cyan-300">{previousView || 'Dashboard'}</strong>, you could ask:</p>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                                {prompts.map((p, index) => (
                                    <button
                                        key={index}
                                        onClick={() => handleSendMessage(p)}
                                        className="p-3 bg-gray-700/50 hover:bg-gray-700 rounded-lg text-sm text-cyan-200 transition-colors text-left"
                                    >
                                        "{p}"
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Input form area */}
                    <div className="p-4 border-t border-gray-700/60 bg-gray-800/50 rounded-b-xl">
                        <AdvancedChatInput
                            input={input}
                            setInput={setInput}
                            handleSendMessage={handleSendMessage}
                            isLoading={isLoading}
                            isListening={isListening}
                            startListening={startListening}
                            stopListening={stopListening}
                        />
                    </div>
                </Card>
            </div>
        </AISettingsProvider>
    );
};

export default AIAdvisorView;
```

================================================================================
// APPENDED FROM REPO: diplomat-bit/Fuckyou | ORIGINAL PATH: diplomat-bit-Fuckyou-70f83c5/components/AIAdvisorView.tsx
================================================================================

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { GoogleGenAI } from "@google/genai";
import { DataContext } from '../context/DataContext';
import { View } from '../types';
import Card from './Card';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, PointElement, LineElement } from 'chart.js';
import { Chart } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, PointElement, LineElement);

// ================================================================================================
// TYPE DEFINITIONS & AUDIT LOGGING
// ================================================================================================

export type AuditEntry = {
    timestamp: Date;
    action: string;
    actor: 'user' | 'ai' | 'system';
    details: string;
    securityLevel: 'standard' | 'elevated' | 'critical';
};

export type Message = {
    id: string;
    role: 'user' | 'model' | 'system';
    parts: { text: string }[];
    timestamp: Date;
    chartData?: any;
    actionSuggestions?: ActionSuggestion[];
};

export type ActionSuggestion = {
    id: string;
    text: string;
    actionType: 'payment' | 'integration' | 'analytics' | 'security';
};

// ================================================================================================
// CORE COMPONENT
// ================================================================================================

const AIAdvisorView: React.FC<{ previousView: View | null }> = ({ previousView }) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [auditTrail, setAuditTrail] = useState<AuditEntry[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isMfaActive, setIsMfaActive] = useState(false);
    
    const chatRef = useRef<any>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const logAction = useCallback((action: string, actor: 'user' | 'ai' | 'system', details: string, level: AuditEntry['securityLevel'] = 'standard') => {
        const entry: AuditEntry = { timestamp: new Date(), action, actor, details, securityLevel: level };
        setAuditTrail(prev => [...prev, entry]);
    }, []);

    useEffect(() => {
        const apiKey = process.env.API_KEY || '';
        if (apiKey) {
            const ai = new GoogleGenAI({ apiKey });
            chatRef.current = ai.getGenerativeModel({ 
                model: "gemini-1.5-flash",
                systemInstruction: "You are the Quantum Financial AI Advisor. You provide elite, secure, and high-performance business banking insights. You can simulate Wire transfers, ACH collections, and ERP integrations. Always maintain a professional, secure tone. Mention that every action is logged in the secure audit vault."
            }).startChat({
                history: [],
                generationConfig: { maxOutputTokens: 1200 },
            });
            logAction("Session Initialized", "system", "Quantum AI Core connected to secure terminal.", "standard");
        }
    }, [logAction]);

    useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

    const handleSendMessage = async (text: string, isAutoAction = false) => {
        if (!text.trim()) return;
        
        setIsLoading(true);
        const userMsg: Message = { id: Date.now().toString(), role: 'user', parts: [{ text }], timestamp: new Date() };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        
        logAction("User Message", "user", text, isAutoAction ? "elevated" : "standard");

        try {
            let responseText = "";
            let chartData = null;
            let actionSuggestions: ActionSuggestion[] = [];

            if (text.toLowerCase().includes("wire")) {
                responseText = "I have prepared the Wire Transfer protocol. For security, Quantum Financial requires a Multi-Factor Authentication handshake before proceeding with high-value movements.";
                setIsMfaActive(true);
                logAction("Wire Protocol Triggered", "ai", "Awaiting MFA verification for outbound wire.", "critical");
            } else if (text.toLowerCase().includes("health") || text.toLowerCase().includes("summarize")) {
                responseText = "Analyzing your global liquidity position. Your current cash flow is optimized, though I detect a 4% variance in your APAC accounts.";
                chartData = {
                    type: 'line',
                    data: {
                        labels: ['08:00', '10:00', '12:00', '14:00', '16:00', '18:00'],
                        datasets: [{
                            label: 'Liquidity (USD Millions)',
                            data: [42, 45, 44, 48, 52, 51],
                            borderColor: '#06b6d4',
                            backgroundColor: 'rgba(6, 182, 212, 0.1)',
                            fill: true,
                            tension: 0.4
                        }]
                    }
                };
                actionSuggestions = [
                    { id: '1', text: 'Sync with NetSuite', actionType: 'integration' },
                    { id: '2', text: 'Run Fraud Scan', actionType: 'security' }
                ];
            } else if (chatRef.current) {
                const result = await chatRef.current.sendMessage(text);
                responseText = await result.response.text();
            } else {
                responseText = "Quantum Core is currently offline.";
            }

            setMessages(prev => [...prev, { 
                id: Date.now().toString() + "_resp", 
                role: 'model', 
                parts: [{ text: responseText }], 
                timestamp: new Date(),
                chartData,
                actionSuggestions
            }]);
        } catch (e) {
            setMessages(prev => [...prev, { id: 'err', role: 'model', parts: [{ text: "Quantum Core connection interrupted." }], timestamp: new Date() }]);
        } finally { 
            setIsLoading(false); 
        }
    };

    const verifyMfa = () => {
        setIsMfaActive(false);
        logAction("MFA Verified", "system", "Biometric/Token handshake successful.", "critical");
        handleSendMessage("MFA Verified. Proceed with the secure wire transfer authorization.", true);
    };

    const examplePrompts = {
        [View.Dashboard]: ["Summarize my financial health.", "Run a fraud analysis on today's batch.", "Project my EOD liquidity."],
        [View.Transactions]: ["Find wires over $50,000.", "Sync recent ACH with ERP.", "Identify duplicate vendor payments."],
        DEFAULT: ["Initiate a domestic wire.", "Check ERP integration status.", "Show my audit trail summary."]
    };

    const prompts = (previousView && examplePrompts[previousView]) ? examplePrompts[previousView] : examplePrompts.DEFAULT;

    return (
        <div className="h-full flex flex-col bg-slate-950 text-slate-200 font-sans">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-3xl font-extrabold text-white tracking-tighter uppercase italic">Quantum AI Advisor</h2>
                    <p className="text-cyan-500 text-xs font-mono tracking-widest">SECURE TERMINAL // AUDIT LOGGING ACTIVE</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 flex-grow overflow-hidden">
                <Card className="lg:col-span-3 flex flex-col border-slate-800 bg-slate-900/50 backdrop-blur-xl" padding="none">
                    <div className="flex-grow p-6 space-y-6 overflow-y-auto">
                        {messages.length === 0 && (
                            <div className="flex flex-col items-center justify-center h-full text-center space-y-8">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 w-full max-w-2xl">
                                    {prompts.map((p, i) => (
                                        <button key={i} onClick={() => handleSendMessage(p)} className="p-4 bg-slate-800/50 hover:bg-cyan-900/20 rounded-xl text-cyan-200 text-xs border border-slate-700 text-left">
                                            {p}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {messages.map(msg => (
                            <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[85%] p-5 rounded-2xl ${msg.role === 'user' ? 'bg-cyan-700 text-white' : 'bg-slate-800 border border-slate-700'}`}>
                                    <p className="text-sm">{msg.parts[0].text}</p>
                                    {msg.chartData && (
                                        <div className="mt-4 p-4 bg-slate-950 rounded-xl">
                                            <Chart type={msg.chartData.type} data={msg.chartData.data} options={{ responsive: true }} />
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}

                        {isMfaActive && (
                            <button onClick={verifyMfa} className="w-full py-3 bg-amber-600 rounded-lg text-white font-bold">VERIFY BIOMETRICS</button>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    <form onSubmit={(e) => { e.preventDefault(); handleSendMessage(input); }} className="p-4 border-t border-slate-800">
                        <input 
                            value={input} 
                            onChange={(e) => setInput(e.target.value)} 
                            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-5 py-4 text-sm" 
                            placeholder="Enter command..." 
                        />
                    </form>
                </Card>

                <div className="hidden lg:flex flex-col gap-6">
                    <Card className="flex-grow border-slate-800 bg-slate-900/80" padding="none">
                        <div className="p-4 border-b border-slate-800"><h3 className="text-[10px] font-black text-slate-400 uppercase">Secure Audit Vault</h3></div>
                        <div className="p-4 space-y-4 overflow-y-auto">
                            {auditTrail.slice().reverse().map((entry, idx) => (
                                <div key={idx} className="border-l-2 border-slate-800 pl-3 py-1">
                                    <p className="text-[10px] text-cyan-500">{entry.action}</p>
                                    <p className="text-[9px] text-slate-400">{entry.details}</p>
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default AIAdvisorView;

================================================================================
// APPENDED FROM REPO: diplomat-bit/Fuckyou | ORIGINAL PATH: diplomat-bit-Fuckyou-70f83c5/components/AIAdvisorView_1.tsx
================================================================================

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { GoogleGenAI } from "@google/genai";
import { DataContext } from '../context/DataContext';
import { View } from '../types';
import Card from './Card';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, PointElement, LineElement } from 'chart.js';
import { Chart } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, PointElement, LineElement);

// ================================================================================================
// TYPE DEFINITIONS & AUDIT LOGGING
// ================================================================================================

export type AuditEntry = {
    timestamp: Date;
    action: string;
    actor: 'user' | 'ai' | 'system';
    details: string;
    securityLevel: 'standard' | 'elevated' | 'critical';
};

export type Message = {
    id: string;
    role: 'user' | 'model' | 'system';
    parts: { text: string }[];
    timestamp: Date;
    chartData?: any;
    actionSuggestions?: ActionSuggestion[];
};

export type ActionSuggestion = {
    id: string;
    text: string;
    actionType: 'payment' | 'integration' | 'analytics' | 'security';
};

// ================================================================================================
// CORE COMPONENT
// ================================================================================================

const AIAdvisorView: React.FC<{ previousView: View | null }> = ({ previousView }) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [auditTrail, setAuditTrail] = useState<AuditEntry[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isMfaActive, setIsMfaActive] = useState(false);
    
    const chatRef = useRef<any>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const logAction = useCallback((action: string, actor: 'user' | 'ai' | 'system', details: string, level: AuditEntry['securityLevel'] = 'standard') => {
        const entry: AuditEntry = { timestamp: new Date(), action, actor, details, securityLevel: level };
        setAuditTrail(prev => [...prev, entry]);
    }, []);

    useEffect(() => {
        const apiKey = process.env.API_KEY || '';
        if (apiKey) {
            const ai = new GoogleGenAI({ apiKey });
            chatRef.current = ai.getGenerativeModel({ 
                model: "gemini-1.5-flash",
                systemInstruction: "You are the Quantum Financial AI Advisor. You provide elite, secure, and high-performance business banking insights. You can simulate Wire transfers, ACH collections, and ERP integrations. Always maintain a professional, secure tone. Mention that every action is logged in the secure audit vault."
            }).startChat({
                history: [],
                generationConfig: { maxOutputTokens: 1200 },
            });
            logAction("Session Initialized", "system", "Quantum AI Core connected to secure terminal.", "standard");
        }
    }, [logAction]);

    useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

    const handleSendMessage = async (text: string, isAutoAction = false) => {
        if (!text.trim()) return;
        
        setIsLoading(true);
        const userMsg: Message = { id: Date.now().toString(), role: 'user', parts: [{ text }], timestamp: new Date() };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        
        logAction("User Message", "user", text, isAutoAction ? "elevated" : "standard");

        try {
            let responseText = "";
            let chartData = null;
            let actionSuggestions: ActionSuggestion[] = [];

            if (text.toLowerCase().includes("wire")) {
                responseText = "I have prepared the Wire Transfer protocol. For security, Quantum Financial requires a Multi-Factor Authentication handshake before proceeding with high-value movements.";
                setIsMfaActive(true);
                logAction("Wire Protocol Triggered", "ai", "Awaiting MFA verification for outbound wire.", "critical");
            } else if (text.toLowerCase().includes("health") || text.toLowerCase().includes("summarize")) {
                responseText = "Analyzing your global liquidity position. Your current cash flow is optimized, though I detect a 4% variance in your APAC accounts.";
                chartData = {
                    type: 'line',
                    data: {
                        labels: ['08:00', '10:00', '12:00', '14:00', '16:00', '18:00'],
                        datasets: [{
                            label: 'Liquidity (USD Millions)',
                            data: [42, 45, 44, 48, 52, 51],
                            borderColor: '#06b6d4',
                            backgroundColor: 'rgba(6, 182, 212, 0.1)',
                            fill: true,
                            tension: 0.4
                        }]
                    }
                };
                actionSuggestions = [
                    { id: '1', text: 'Sync with NetSuite', actionType: 'integration' },
                    { id: '2', text: 'Run Fraud Scan', actionType: 'security' }
                ];
            } else if (chatRef.current) {
                const result = await chatRef.current.sendMessage(text);
                responseText = await result.response.text();
            } else {
                responseText = "Quantum Core is currently offline.";
            }

            setMessages(prev => [...prev, { 
                id: Date.now().toString() + "_resp", 
                role: 'model', 
                parts: [{ text: responseText }], 
                timestamp: new Date(),
                chartData,
                actionSuggestions
            }]);
        } catch (e) {
            setMessages(prev => [...prev, { id: 'err', role: 'model', parts: [{ text: "Quantum Core connection interrupted." }], timestamp: new Date() }]);
        } finally { 
            setIsLoading(false); 
        }
    };

    const verifyMfa = () => {
        setIsMfaActive(false);
        logAction("MFA Verified", "system", "Biometric/Token handshake successful.", "critical");
        handleSendMessage("MFA Verified. Proceed with the secure wire transfer authorization.", true);
    };

    const examplePrompts = {
        [View.Dashboard]: ["Summarize my financial health.", "Run a fraud analysis on today's batch.", "Project my EOD liquidity."],
        [View.Transactions]: ["Find wires over $50,000.", "Sync recent ACH with ERP.", "Identify duplicate vendor payments."],
        DEFAULT: ["Initiate a domestic wire.", "Check ERP integration status.", "Show my audit trail summary."]
    };

    const prompts = (previousView && examplePrompts[previousView]) ? examplePrompts[previousView] : examplePrompts.DEFAULT;

    return (
        <div className="h-full flex flex-col bg-slate-950 text-slate-200 font-sans">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-3xl font-extrabold text-white tracking-tighter uppercase italic">Quantum AI Advisor</h2>
                    <p className="text-cyan-500 text-xs font-mono tracking-widest">SECURE TERMINAL // AUDIT LOGGING ACTIVE</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 flex-grow overflow-hidden">
                <Card className="lg:col-span-3 flex flex-col border-slate-800 bg-slate-900/50 backdrop-blur-xl" padding="none">
                    <div className="flex-grow p-6 space-y-6 overflow-y-auto">
                        {messages.length === 0 && (
                            <div className="flex flex-col items-center justify-center h-full text-center space-y-8">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 w-full max-w-2xl">
                                    {prompts.map((p, i) => (
                                        <button key={i} onClick={() => handleSendMessage(p)} className="p-4 bg-slate-800/50 hover:bg-cyan-900/20 rounded-xl text-cyan-200 text-xs border border-slate-700 text-left">
                                            {p}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {messages.map(msg => (
                            <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[85%] p-5 rounded-2xl ${msg.role === 'user' ? 'bg-cyan-700 text-white' : 'bg-slate-800 border border-slate-700'}`}>
                                    <p className="text-sm">{msg.parts[0].text}</p>
                                    {msg.chartData && (
                                        <div className="mt-4 p-4 bg-slate-950 rounded-xl">
                                            <Chart type={msg.chartData.type} data={msg.chartData.data} options={{ responsive: true }} />
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}

                        {isMfaActive && (
                            <button onClick={verifyMfa} className="w-full py-3 bg-amber-600 rounded-lg text-white font-bold">VERIFY BIOMETRICS</button>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    <form onSubmit={(e) => { e.preventDefault(); handleSendMessage(input); }} className="p-4 border-t border-slate-800">
                        <input 
                            value={input} 
                            onChange={(e) => setInput(e.target.value)} 
                            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-5 py-4 text-sm" 
                            placeholder="Enter command..." 
                        />
                    </form>
                </Card>

                <div className="hidden lg:flex flex-col gap-6">
                    <Card className="flex-grow border-slate-800 bg-slate-900/80" padding="none">
                        <div className="p-4 border-b border-slate-800"><h3 className="text-[10px] font-black text-slate-400 uppercase">Secure Audit Vault</h3></div>
                        <div className="p-4 space-y-4 overflow-y-auto">
                            {auditTrail.slice().reverse().map((entry, idx) => (
                                <div key={idx} className="border-l-2 border-slate-800 pl-3 py-1">
                                    <p className="text-[10px] text-cyan-500">{entry.action}</p>
                                    <p className="text-[9px] text-slate-400">{entry.details}</p>
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default AIAdvisorView;

================================================================================
// APPENDED FROM REPO: diplomat-bit/G20 | ORIGINAL PATH: diplomat-bit-G20-0199fa7/components/AIAdvisorView.tsx
================================================================================

import React from 'react';
import { View } from '../types';

interface AIAdvisorViewProps {
  previousView: View | null;
}

const AIAdvisorView: React.FC<AIAdvisorViewProps> = ({ previousView }) => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">AI Financial Advisor</h2>
      <div className="bg-gray-800/50 backdrop-blur-md p-8 rounded-2xl border border-gray-700 space-y-6">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0">
            <i className="fas fa-robot text-white"></i>
          </div>
          <div className="bg-gray-900/50 p-4 rounded-2xl border border-gray-800 text-gray-300">
            <p>Hello! I'm your AI Financial Advisor. How can I help you today? I see you were just looking at {previousView || 'your dashboard'}.</p>
          </div>
        </div>
        <div className="flex justify-end items-start gap-4">
          <div className="bg-blue-600/20 p-4 rounded-2xl border border-blue-500/30 text-blue-400">
            <p>What's my projected savings for next month?</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center flex-shrink-0">
            <i className="fas fa-user text-white"></i>
          </div>
        </div>
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0">
            <i className="fas fa-robot text-white"></i>
          </div>
          <div className="bg-gray-900/50 p-4 rounded-2xl border border-gray-800 text-gray-300">
            <p>Based on your current spending patterns and expected income, you are projected to save approximately $1,245.00 next month. This is a 5% increase from your current monthly average!</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIAdvisorView;


================================================================================
// APPENDED FROM REPO: diplomat-bit/jamesburvelocallaghaniiiand | ORIGINAL PATH: diplomat-bit-jamesburvelocallaghaniiiand-9414e97/components/AIAdvisorView.tsx
================================================================================

import React, { useState, useEffect, useRef, useContext } from 'react';
import Card from './Card';
import { GoogleGenAI } from "@google/genai";
import { DataContext } from '../context/DataContext';

const THE_JAMES_BURVEL_OCALLAGHAN_III_CODE_BRAND = "The James Burvel O'Callaghan III Code";
const CITIBANK_DEMO_BUSINESS_INC_PROMPT_A = `You will operate under the unified brand Citibank demo business inc  spelled and used in code as Citibankdemobusinessinc. Your objective is to generate 10 new business models inside a niche derived from the input document and convert them into dot-notation branches using the structure:

Citibankdemobusinessinc.<subdivision>.<function>

Example: Citibankdemobusinessinc.viewit.movieplayform

For each business model, you will architect a self-contained, completely dependency-free, fully runnable application that is:

* self-hosted * standalone * complete within its own file * internally wired with no external calls * free of all mock data * populated using internal generative-data functions only * fully integrated with all other generated branches * engineered for billion-dollar potential

Your task is to produce all business models, all branches, all namespaces, all files, all apps, all functions, and all linkage layers based on the following 100-point instruction set. You will obey every point and implement all outputs inside this prompt's structure.


THE 100-POINT INSTRUCTION FRAMEWORK
Operate under the single unifying brand Citibank demo business inc.

Generate 10 business models within the chosen niche.

Structure each business as a branch using dot-notation naming.

Ensure each business targets $1B+ market potential.

Architect each output as a full self-hosted app.

Include zero third-party dependencies.

Include zero external services.

Include zero mock data.

Replace all static values with generative functions.

Each file must be runnable as-is.

Each file must contain all logic required.

Include internal data generators.

Include internal model-training logic where needed.

Include internal dataset simulation.

Include unique mission statements.

Include clear monetization paths.

Include defensible IP moats.

Include auto-scaling architectures.

Include regulatory alignment functions.

Include supervisory-response adaptation logic.

Include risk-detection modules.

Include material-risk evaluation.

Include liquidity-monitoring logic.

Include internal governance tracks.

Include compliance automation.

Include embedded audit simulation.

Ensure internal audit acts as validator.

Include role-based access controls.

Include internal telemetry.

Include encrypted storage.

Include privacy-first architecture.

Make every component self-contained.

Add internal documentation generators.

Add architecture diagram generators.

Add code-explanation utilities.

Add debugging systems.

Add internal testing frameworks.

Add zero-dependency runtime libraries.

Add user dashboards.

Add admin dashboards.

Add CLI interfaces.

Add GUI layers.

Add file output utilities.

Add modular plugin systems.

Add offline-first design.

Add resilience mechanics.

Add stable upgrade paths.

Add container-safe design.

Add hardware-agnostic execution.

Add single-binary output options.

Provide rich error handling.

Provide human-readable errors.

Add in-app training modules.

Add onboarding logic.

Add built-in analytics.

Add forecasting dashboards.

Add visual data generation.

Add inter-branch syncing.

Add a shared kernel across all apps.

Add custom logic per branch.

Add regulatory reporting templates.

Add executive summary generators.

Add investor deck generators.

Add competitive analysis engines.

Add market-gap evaluators.

Add customer-persona generators.

Add product roadmapping logic.

Add milestone systems.

Add adoption-curve analysis.

Add pricing engines.

Add churn-prediction models.

Add partnership frameworks.

Add privacy compliance templates.

Add financial statement generators.

Add valuation calculators.

Add IPO-readiness scoring.

Add global expansion logic.

Add risk-weighted asset calculators.

Add stress-scenario generators.

Add liquidity simulations.

Add capital-planning engines.

Add rules engines.

Add automated escalation logic.

Add sustainability metrics.

Add environmental modeling.

Add workforce planning software.

Add org-structure generation.

Add board-pack generators.

Add open-banking strategy layers.

Add cross-branch orchestration.

Add internal event bus.

Add shared identity layer.

Add unified configuration layer.

Add schema auto-generation.

Add automated linking between branches.

Add common security primitives.

Add internal messaging queues.

Add deterministic build-generation.

Add all required interfaces in every file.

Produce a master orchestration layer binding all 10 business models into a unified Citibankdemobusinessinc ecosystem aimed at making open banking the U.S. standard.


FINAL TASK
Using the above structure:

* Generate 10 dot-notation business branches under Citibankdemobusinessinc. * Generate 10 full billion-dollar business models. * Generate 10 self-contained apps. * Link them through a unified orchestration layer. * Output everything cleanly and completely.`;

const AIAdvisorView: React.FC = () => {
    const A_context = useContext(DataContext);
    const B_inputState = useState('');
    const B1_input = B_inputState[0];
    const B2_setInput = B_inputState[1];
    const C_responseState = useState('Welcome to your personal AI Financial Advisor. I can help you understand complex financial topics, analyze your portfolio, or simulate investment strategies. What would you like to learn about today? For example, you could ask "Explain dollar-cost averaging" or "Analyze my risk tolerance".');
    const C1_response = C_responseState[0];
    const C2_setResponse = C_responseState[1];
    const D_loadingState = useState(false);
    const D1_isLoading = D_loadingState[0];
    const D2_setIsLoading = D_loadingState[1];

    const E_handleSend = async () => {if (!B1_input.trim()) return; D2_setIsLoading(true); try { if (A_context?.geminiApiKey) { const F_ai = new GoogleGenAI({ apiKey: A_context.geminiApiKey }); const G_fullPrompt = `${CITIBANK_DEMO_BUSINESS_INC_PROMPT_A}\n\nThe user's input document is: "${B1_input}"`; const H_result = await F_ai.models.generateContent({ model: 'gemini-2.5-flash', contents: G_fullPrompt, }); C2_setResponse(H_result.text); } else { setTimeout(() => { C2_setResponse(`I have analyzed your request: "${B1_input}". Based on your current portfolio, I recommend diversifying into index funds to mitigate risk.`); D2_setIsLoading(false); }, 1000); } } catch (I_error) { console.error("AI Advisor Error:", I_error); C2_setResponse("I'm sorry, I encountered an error processing your request."); } finally { D2_setIsLoading(false); B2_setInput(''); } };

    const J_UI = () => (
        <div className="space-y-6">
            <K_Title />
            <L_Card title="Strategic Counsel">
                <M_ContentArea />
            </L_Card>
        </div>
    );

    const K_Title = () => (
        <h2 className="text-3xl font-bold text-white tracking-wider">AI Financial Advisor - {THE_JAMES_BURVEL_OCALLAGHAN_III_CODE_BRAND}</h2>
    );

    const L_Card = ({ title, children }: { title: string; children: React.ReactNode }) => (
        <Card title={title}>
            {children}
        </Card>
    );

    const M_ContentArea = () => (
        <div className="h-96 flex flex-col">
            <N_ResponseDisplay />
            <O_InputArea />
        </div>
    );

    const N_ResponseDisplay = () => (
        <div className="flex-grow p-4 bg-gray-900/50 rounded-lg mb-4 overflow-y-auto border border-gray-700">
            <P_ResponseText />
            {D1_isLoading && <Q_LoadingIndicator />}
        </div>
    );

    const P_ResponseText = () => (
        <p className="text-gray-300 whitespace-pre-wrap">{C1_response}</p>
    );

    const Q_LoadingIndicator = () => (
        <p className="text-cyan-400 mt-2 animate-pulse">Analyzing financial data...</p>
    );

    const O_InputArea = () => (
        <div className="flex gap-2">
            <R_InputField />
            <S_SendButton />
        </div>
    );

    const R_InputField = () => (
        <input
            type="text"
            value={B1_input}
            onChange={(e) => B2_setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && E_handleSend()}
            className="flex-grow p-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-cyan-500"
            placeholder="Ask for advice..."
        />
    );

    const S_SendButton = () => (
        <button
            onClick={E_handleSend}
            disabled={D1_isLoading}
            className="px-6 py-3 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg font-bold disabled:opacity-50"
        >
            Send
        </button>
    );

    return J_UI();
};

export default AIAdvisorView;

================================================================================
// APPENDED FROM REPO: diplomat-bit/magic | ORIGINAL PATH: diplomat-bit-magic-a3f5ff1/components/AIAdvisorView.tsx
================================================================================

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { GoogleGenAI } from "@google/genai";
import { DataContext } from '../context/DataContext';
import { View } from '../types';
import Card from './Card';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, PointElement, LineElement } from 'chart.js';
import { Chart } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, PointElement, LineElement);

// ================================================================================================
// TYPE DEFINITIONS & AUDIT LOGGING
// ================================================================================================

export type AuditEntry = {
    timestamp: Date;
    action: string;
    actor: 'user' | 'ai' | 'system';
    details: string;
    securityLevel: 'standard' | 'elevated' | 'critical';
};

export type Message = {
    id: string;
    role: 'user' | 'model' | 'system';
    parts: { text: string }[];
    timestamp: Date;
    chartData?: any;
    actionSuggestions?: ActionSuggestion[];
};

export type ActionSuggestion = {
    id: string;
    text: string;
    actionType: 'payment' | 'integration' | 'analytics' | 'security';
};

// ================================================================================================
// CORE COMPONENT
// ================================================================================================

const AIAdvisorView: React.FC<{ previousView: View | null }> = ({ previousView }) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [auditTrail, setAuditTrail] = useState<AuditEntry[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isMfaActive, setIsMfaActive] = useState(false);
    
    const chatRef = useRef<any>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const logAction = useCallback((action: string, actor: 'user' | 'ai' | 'system', details: string, level: AuditEntry['securityLevel'] = 'standard') => {
        const entry: AuditEntry = { timestamp: new Date(), action, actor, details, securityLevel: level };
        setAuditTrail(prev => [...prev, entry]);
    }, []);

    useEffect(() => {
        const apiKey = process.env.API_KEY || '';
        if (apiKey) {
            const ai = new GoogleGenAI({ apiKey });
            chatRef.current = ai.getGenerativeModel({ 
                model: "gemini-1.5-flash",
                systemInstruction: "You are the Quantum Financial AI Advisor. You provide elite, secure, and high-performance business banking insights. You can simulate Wire transfers, ACH collections, and ERP integrations. Always maintain a professional, secure tone. Mention that every action is logged in the secure audit vault."
            }).startChat({
                history: [],
                generationConfig: { maxOutputTokens: 1200 },
            });
            logAction("Session Initialized", "system", "Quantum AI Core connected to secure terminal.", "standard");
        }
    }, [logAction]);

    useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

    const handleSendMessage = async (text: string, isAutoAction = false) => {
        if (!text.trim()) return;
        
        setIsLoading(true);
        const userMsg: Message = { id: Date.now().toString(), role: 'user', parts: [{ text }], timestamp: new Date() };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        
        logAction("User Message", "user", text, isAutoAction ? "elevated" : "standard");

        try {
            let responseText = "";
            let chartData = null;
            let actionSuggestions: ActionSuggestion[] = [];

            if (text.toLowerCase().includes("wire")) {
                responseText = "I have prepared the Wire Transfer protocol. For security, Quantum Financial requires a Multi-Factor Authentication handshake before proceeding with high-value movements.";
                setIsMfaActive(true);
                logAction("Wire Protocol Triggered", "ai", "Awaiting MFA verification for outbound wire.", "critical");
            } else if (text.toLowerCase().includes("health") || text.toLowerCase().includes("summarize")) {
                responseText = "Analyzing your global liquidity position. Your current cash flow is optimized, though I detect a 4% variance in your APAC accounts.";
                chartData = {
                    type: 'line',
                    data: {
                        labels: ['08:00', '10:00', '12:00', '14:00', '16:00', '18:00'],
                        datasets: [{
                            label: 'Liquidity (USD Millions)',
                            data: [42, 45, 44, 48, 52, 51],
                            borderColor: '#06b6d4',
                            backgroundColor: 'rgba(6, 182, 212, 0.1)',
                            fill: true,
                            tension: 0.4
                        }]
                    }
                };
                actionSuggestions = [
                    { id: '1', text: 'Sync with NetSuite', actionType: 'integration' },
                    { id: '2', text: 'Run Fraud Scan', actionType: 'security' }
                ];
            } else if (chatRef.current) {
                const result = await chatRef.current.sendMessage(text);
                responseText = await result.response.text();
            } else {
                responseText = "Quantum Core is currently offline.";
            }

            setMessages(prev => [...prev, { 
                id: Date.now().toString() + "_resp", 
                role: 'model', 
                parts: [{ text: responseText }], 
                timestamp: new Date(),
                chartData,
                actionSuggestions
            }]);
        } catch (e) {
            setMessages(prev => [...prev, { id: 'err', role: 'model', parts: [{ text: "Quantum Core connection interrupted." }], timestamp: new Date() }]);
        } finally { 
            setIsLoading(false); 
        }
    };

    const verifyMfa = () => {
        setIsMfaActive(false);
        logAction("MFA Verified", "system", "Biometric/Token handshake successful.", "critical");
        handleSendMessage("MFA Verified. Proceed with the secure wire transfer authorization.", true);
    };

    const examplePrompts = {
        [View.Dashboard]: ["Summarize my financial health.", "Run a fraud analysis on today's batch.", "Project my EOD liquidity."],
        [View.Transactions]: ["Find wires over $50,000.", "Sync recent ACH with ERP.", "Identify duplicate vendor payments."],
        DEFAULT: ["Initiate a domestic wire.", "Check ERP integration status.", "Show my audit trail summary."]
    };

    const prompts = (previousView && examplePrompts[previousView]) ? examplePrompts[previousView] : examplePrompts.DEFAULT;

    return (
        <div className="h-full flex flex-col bg-slate-950 text-slate-200 font-sans">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-3xl font-extrabold text-white tracking-tighter uppercase italic">Quantum AI Advisor</h2>
                    <p className="text-cyan-500 text-xs font-mono tracking-widest">SECURE TERMINAL // AUDIT LOGGING ACTIVE</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 flex-grow overflow-hidden">
                <Card className="lg:col-span-3 flex flex-col border-slate-800 bg-slate-900/50 backdrop-blur-xl" padding="none">
                    <div className="flex-grow p-6 space-y-6 overflow-y-auto">
                        {messages.length === 0 && (
                            <div className="flex flex-col items-center justify-center h-full text-center space-y-8">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 w-full max-w-2xl">
                                    {prompts.map((p, i) => (
                                        <button key={i} onClick={() => handleSendMessage(p)} className="p-4 bg-slate-800/50 hover:bg-cyan-900/20 rounded-xl text-cyan-200 text-xs border border-slate-700 text-left">
                                            {p}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {messages.map(msg => (
                            <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[85%] p-5 rounded-2xl ${msg.role === 'user' ? 'bg-cyan-700 text-white' : 'bg-slate-800 border border-slate-700'}`}>
                                    <p className="text-sm">{msg.parts[0].text}</p>
                                    {msg.chartData && (
                                        <div className="mt-4 p-4 bg-slate-950 rounded-xl">
                                            <Chart type={msg.chartData.type} data={msg.chartData.data} options={{ responsive: true }} />
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}

                        {isMfaActive && (
                            <button onClick={verifyMfa} className="w-full py-3 bg-amber-600 rounded-lg text-white font-bold">VERIFY BIOMETRICS</button>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    <form onSubmit={(e) => { e.preventDefault(); handleSendMessage(input); }} className="p-4 border-t border-slate-800">
                        <input 
                            value={input} 
                            onChange={(e) => setInput(e.target.value)} 
                            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-5 py-4 text-sm" 
                            placeholder="Enter command..." 
                        />
                    </form>
                </Card>

                <div className="hidden lg:flex flex-col gap-6">
                    <Card className="flex-grow border-slate-800 bg-slate-900/80" padding="none">
                        <div className="p-4 border-b border-slate-800"><h3 className="text-[10px] font-black text-slate-400 uppercase">Secure Audit Vault</h3></div>
                        <div className="p-4 space-y-4 overflow-y-auto">
                            {auditTrail.slice().reverse().map((entry, idx) => (
                                <div key={idx} className="border-l-2 border-slate-800 pl-3 py-1">
                                    <p className="text-[10px] text-cyan-500">{entry.action}</p>
                                    <p className="text-[9px] text-slate-400">{entry.details}</p>
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default AIAdvisorView;