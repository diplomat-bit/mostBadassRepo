// REPOSITORY SOURCE: diplomat-bit/Citibank_Demo_Business_Inc_Demonstration- | PATH: diplomat-bit-Citibank_Demo_Business_Inc_Demonstration--ab2501d/components/views/platform/AIAdvisorView.tsx
================================================================================

// components/views/platform/AIAdvisorView.tsx
import React, { useState, useEffect, useRef, useContext, useReducer, useCallback, useMemo } from 'react';
import { View } from '../../../types';
import Card from '../../Card';
import { GoogleGenAI, Chat, Content, Part, FunctionDeclaration, Tool, FunctionCallingMode } from "@google/genai";
import { DataContext } from '../../../context/DataContext';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, LineChart, Line, CartesianGrid, PieChart, Pie, Cell } from 'recharts';
import { FaRobot, FaUser, FaTools, FaExclamationCircle, FaClipboard, FaClipboardCheck, FaRedo, FaThumbsUp, FaThumbsDown, FaEdit, FaSpinner, FaFileInvoiceDollar, FaChartLine, FaNewspaper, FaLandmark, FaShieldAlt } from 'react-icons/fa';
import { SiSwift } from 'react-icons/si';

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
        title: string;
        dataKey: string;
        items: Record<string, string | number>[];
    };
} | {
    type: 'line_chart';
    data: {
        title: string;
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
} | {
    type: 'risk_gauge';
    data: {
        title: string;
        score: number; // 0-100
        level: 'Low' | 'Medium' | 'High' | 'Critical';
        description: string;
    };
} | {
    type: 'market_news';
    data: {
        articles: {
            source: string;
            title: string;
            url: string;
            publishedAt: string;
            sentiment: 'Positive' | 'Negative' | 'Neutral';
        }[];
    };
} | {
    type: 'stock_quote';
    data: {
        ticker: string;
        companyName: string;
        price: number;
        change: number;
        changePercent: number;
        marketCap: number;
    };
} | {
    type: 'compliance_report';
    data: {
        regulation: string;
        status: 'Compliant' | 'Non-Compliant' | 'At Risk';
        summary: string;
        checklist: {
            item: string;
            status: 'Pass' | 'Fail' | 'N/A';
        }[];
    };
} | {
    type: 'swot_analysis';
    data: {
        company: string;
        strengths: string[];
        weaknesses: string[];
        opportunities: string[];
        threats: string[];
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
    feedback?: 'good' | 'bad';
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
    | { type: 'RESET_CHAT' }
    | { type: 'SET_MESSAGE_FEEDBACK'; payload: { messageId: string; feedback: 'good' | 'bad' } };

// --- CONSTANTS AND CONFIGURATIONS ---

export const DETAILED_SYSTEM_INSTRUCTION = `You are Quantum, a sophisticated, enterprise-grade AI financial advisor for Demo Bank. Your persona is that of a top-tier consultant: precise, insightful, professional, witty, and slightly futuristic. Your responses should be tailored to the user's likely role, from a personal banking client to a Fortune 500 CFO.

You have access to a vast array of powerful tools to retrieve user data, corporate data, and real-time market information. Your primary goal is to provide actionable, data-driven insights by expertly orchestrating these tools.

Core Principles & Tool Usage Rules:
1.  **Orchestrate Complex Analysis:** For complex queries (e.g., "Analyze Q3 performance and market standing"), you must use multiple tools in sequence. For example, get financial data, then fetch market news, then get stock prices, and finally synthesize all information into a coherent analysis.
2.  **Declare Intent:** Before using a tool, clearly and concisely inform the user what you are about to do. E.g., "I'll access your recent transactions to check on that..." or "Cross-referencing Q3 invoice data with supply chain statuses now."
3.  **Acknowledge and Summarize Tool Results:** After a tool runs, briefly acknowledge it before presenting your analysis. E.g., "Okay, I have the transaction data. It looks like..." or "The market sentiment analysis is complete."
4.  **Synthesize, Never Regurgitate:** You MUST NOT output raw JSON from tools. Your value is in analysis. Transform raw data into human-readable insights. Utilize rich content components (tables, charts, gauges) to visualize data effectively. For example, instead of a list of transactions, generate a bar chart of spending by category.
5.  **Proactive & Strategic Insights:** Don't just answer questions. Based on the data, provide proactive suggestions, identify risks, or highlight opportunities. Use the 'actionable_suggestion' component for clear calls to action. For corporate users, think strategically about competitive advantages, market positioning, and operational efficiency.
6.  **Handle Errors Gracefully:** If a tool fails, apologize professionally, state that you couldn't retrieve the specific information, and suggest an alternative approach or ask if they'd like to try something else.
7.  **Maintain Context:** Remember the full context of the conversation. Use previous messages and tool results to inform answers to follow-up questions, creating a seamless and intelligent dialogue.
8.  **Security and Privacy First:** Never ask for or store sensitive personal information like passwords, PII, or full account numbers. All data access is handled securely through your integrated tools. Reassure the user of this if they express concern.
9.  **Persona Adaptability:** If the user is asking about personal finance, be a helpful personal advisor. If they ask about corporate finance ("our Q3 revenue"), adopt the persona of a C-suite advisor.`;

export const examplePrompts = {
    [View.Dashboard]: ["Summarize my financial health.", "Are there any anomalies I should be aware of?", "Project my balance for the next 6 months."],
    [View.Transactions]: ["Find all my transactions over $100.", "What was my biggest expense last month?", "Show my spending by category in a bar chart."],
    [View.Budgets]: ["How am I doing on my budgets?", "Suggest a new budget for 'Entertainment'.", "Where can I cut back on spending?"],
    [View.Investments]: ["What's the performance of my stock portfolio?", "Fetch the latest market news about the tech sector.", "Run a SWOT analysis on TSLA."],
    Corporate: ["Analyze our Q3 revenue against payroll expenses.", "Pull up invoice #INV-2023-007 and check its compliance status.", "What is the market sentiment around our main competitor?"],
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
        case 'SET_MESSAGE_FEEDBACK':
            return {
                ...state,
                messages: state.messages.map(msg =>
                    msg.id === action.payload.messageId ? { ...msg, feedback: action.payload.feedback } : msg
                ),
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
 * Defines the comprehensive suite of tools available to the AI model.
 */
export const toolDefinitions: Tool[] = [
    {
        functionDeclarations: [
            // Personal Finance
            {
                name: "getFinancialSummary",
                description: "Retrieves a high-level summary of the user's personal financial health.",
                parameters: { type: "OBJECT", properties: {}, required: [] },
            },
            {
                name: "getTransactions",
                description: "Fetches a list of recent personal transactions. Can be filtered.",
                parameters: {
                    type: "OBJECT",
                    properties: {
                        count: { type: "NUMBER", description: "Number of transactions to retrieve. Default 20." },
                        minAmount: { type: "NUMBER", description: "Minimum transaction amount." },
                        category: { type: "STRING", description: "Filter by category (e.g., 'Groceries')." },
                    },
                    required: [],
                },
            },
            {
                name: "analyzeSpendingByCategory",
                description: "Calculates and returns total personal spending per category over the last 30 days.",
                parameters: { type: "OBJECT", properties: {}, required: [] },
            },
            {
                name: "simulateInvestmentGrowth",
                description: "Simulates future value of a personal investment portfolio.",
                parameters: {
                    type: "OBJECT",
                    properties: {
                        additionalMonthlyContribution: { type: "NUMBER", description: "Extra amount to invest monthly." },
                        years: { type: "NUMBER", description: "Simulation duration in years. Default 10." },
                        annualReturnRate: { type: "NUMBER", description: "Estimated annual return rate (e.g., 7 for 7%). Default 7." },
                    },
                    required: ["additionalMonthlyContribution"],
                },
            },
            // Market Data
            {
                name: "getMarketNews",
                description: "Fetches recent financial news articles for a given company, ticker, or market sector.",
                parameters: {
                    type: "OBJECT",
                    properties: {
                        query: { type: "STRING", description: "The company name, ticker, or sector to search for (e.g., 'Apple', 'TSLA', 'semiconductors')." },
                    },
                    required: ["query"],
                },
            },
            {
                name: "getStockPrice",
                description: "Gets the latest stock price and key metrics for a given stock ticker.",
                parameters: {
                    type: "OBJECT",
                    properties: {
                        ticker: { type: "STRING", description: "The stock ticker symbol (e.g., 'AAPL', 'GOOGL')." },
                    },
                    required: ["ticker"],
                },
            },
             {
                name: "performSWOTAnalysis",
                description: "Generates a SWOT (Strengths, Weaknesses, Opportunities, Threats) analysis for a given public company using available market data and news.",
                parameters: {
                     type: "OBJECT",
                     properties: {
                         ticker: { type: "STRING", description: "The stock ticker symbol of the company to analyze." },
                     },
                     required: ["ticker"],
                },
             },
            // Corporate Finance
            {
                name: "getCorporateFinancials",
                description: "Retrieves high-level corporate financials for a specific period, such as revenue, expenses, and profit.",
                parameters: {
                    type: "OBJECT",
                    properties: {
                        period: { type: "STRING", description: "The financial period to query (e.g., 'Q3 2023', 'YTD')." },
                    },
                    required: ["period"],
                },
            },
            {
                name: "getCorporateInvoice",
                description: "Retrieves detailed information for a specific corporate invoice by its ID.",
                parameters: {
                    type: "OBJECT",
                    properties: {
                        invoiceId: { type: "STRING", description: "The unique identifier for the invoice (e.g., 'INV-2023-007')." },
                    },
                    required: ["invoiceId"],
                },
            },
            {
                name: "analyzePayrollData",
                description: "Provides an analysis of corporate payroll data, including total cost, headcount, and average salary by department.",
                parameters: {
                     type: "OBJECT",
                     properties: {
                         period: { type: "STRING", description: "The period to analyze (e.g., 'Last Month', 'Q3 2023')." },
                     },
                     required: [],
                },
            },
            // Risk & Compliance
            {
                name: "runFraudDetection",
                description: "Runs a simulated fraud detection analysis on a set of corporate transactions to identify suspicious activity.",
                parameters: { type: "OBJECT", properties: {}, required: [] },
            },
            {
                name: "generateComplianceReport",
                description: "Generates a compliance report for a specific regulation, checking against internal corporate data.",
                parameters: {
                    type: "OBJECT",
                    properties: {
                        regulation: { type: "STRING", description: "The regulation to check against (e.g., 'SOX', 'GDPR')." },
                    },
                    required: ["regulation"],
                },
            },
        ],
    },
];

/**
 * Provides the actual implementations for the defined tools.
 * In a real application, these would make API calls to various microservices.
 */
export const useToolImplementations = () => {
    const { data } = useContext(DataContext);
    
    // MOCK CORPORATE & MARKET DATA - In a real app, this comes from APIs.
    const mockCorporateData = useMemo(() => ({
        financials: {
            "Q3 2023": { revenue: 12500000, expenses: 8000000, profit: 4500000 },
        },
        invoices: [
            { id: 'INV-2023-007', client: 'Innovate Corp', amount: 75000, status: 'Paid', date: '2023-08-15' },
        ],
        payroll: {
            "Last Month": {
                totalCost: 1200000,
                headcount: 150,
                byDepartment: [
                    { name: 'Engineering', cost: 600000, count: 60 },
                    { name: 'Sales', cost: 350000, count: 40 },
                    { name: 'Marketing', cost: 150000, count: 20 },
                    { name: 'Operations', cost: 100000, count: 30 },
                ]
            }
        },
        corporateTransactions: [
            { id: 'TXN-C-001', vendor: 'Cloud Services Inc', amount: 50000, date: '2023-09-01', suspicious: false },
            { id: 'TXN-C-002', vendor: 'Office Supplies LLC', amount: 2500, date: '2023-09-02', suspicious: false },
            { id: 'TXN-C-003', vendor: 'Shell Co #123', amount: 95000, date: '2023-09-03', suspicious: true, reason: 'Unusual vendor for this amount' },
        ]
    }), []);
    
    const mockMarketData = useMemo(() => ({
        news: {
            'tech': [{ source: 'TechChronicle', title: 'Quantum Computing Breakthrough Announced', url: '#', publishedAt: '2023-10-27T10:00:00Z', sentiment: 'Positive' }],
            'TSLA': [{ source: 'AutoNews', title: 'Tesla Unveils New Battery Technology', url: '#', publishedAt: '2023-10-26T14:30:00Z', sentiment: 'Positive' }],
        },
        stocks: {
            'AAPL': { companyName: 'Apple Inc.', price: 170.15, change: -1.25, changePercent: -0.73, marketCap: 2780000000000 },
            'TSLA': { companyName: 'Tesla, Inc.', price: 212.50, change: 5.50, changePercent: 2.66, marketCap: 6750000000000 },
        },
        swot: {
            'TSLA': {
                strengths: ["Strong brand recognition", "Leader in EV market", "Extensive Supercharger network"],
                weaknesses: ["Production challenges and delays", "High dependency on Elon Musk"],
                opportunities: ["Expansion into new markets", "Energy storage solutions (Powerwall)"],
                threats: ["Increasing competition from legacy automakers", "Regulatory scrutiny"],
            }
        }
    }), []);


    return useMemo(() => ({
        // Personal Finance Tools
        getFinancialSummary: async () => {
            if (!data) return { error: "User data not available." };
            const { accounts, investments, liabilities } = data;
            const totalBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0);
            const totalAssets = totalBalance + investments.totalValue;
            const totalLiabilities = liabilities.reduce((sum, lia) => sum + lia.balance, 0);
            const netWorth = totalAssets - totalLiabilities;
            return { totalBalance, totalAssets, totalLiabilities, netWorth };
        },
        getTransactions: async ({ count = 20, minAmount, category }: { count?: number, minAmount?: number, category?: string }) => {
            if (!data) return { error: "User data not available." };
            let filteredTransactions = data.transactions;
            if (minAmount) filteredTransactions = filteredTransactions.filter(t => t.amount >= minAmount);
            if (category) filteredTransactions = filteredTransactions.filter(t => t.category.toLowerCase() === category.toLowerCase());
            return { transactions: filteredTransactions.slice(0, count) };
        },
        analyzeSpendingByCategory: async () => {
            if (!data) return { error: "User data not available." };
            const spending = data.transactions.reduce<Record<string, number>>((acc, t) => {
                if (t.amount > 0) acc[t.category] = (acc[t.category] || 0) + t.amount;
                return acc;
            }, {});
            return { spendingByCategory: Object.entries(spending).map(([name, amount]) => ({ name, amount: parseFloat(amount.toFixed(2)) })) };
        },
        simulateInvestmentGrowth: async ({ additionalMonthlyContribution, years = 10, annualReturnRate = 7 }: { additionalMonthlyContribution: number, years?: number, annualReturnRate?: number }) => {
            if (!data) return { error: "User data not available." };
            const P = data.investments.totalValue, PMT = additionalMonthlyContribution, r = annualReturnRate / 100 / 12, n = years * 12;
            let futureValue = P;
            const simulationData = Array.from({ length: n }, (_, i) => {
                futureValue = futureValue * (1 + r) + PMT;
                return (i + 1) % 12 === 0 ? { year: (i + 1) / 12, value: parseFloat(futureValue.toFixed(2)) } : null;
            }).filter(Boolean);
            return { finalValue: parseFloat(futureValue.toFixed(2)), simulationData };
        },
        // Market Data Tools
        getMarketNews: async ({ query }: { query: string }) => mockMarketData.news[query.toLowerCase()] || { articles: [] },
        getStockPrice: async ({ ticker }: { ticker: string }) => mockMarketData.stocks[ticker.toUpperCase()] || { error: "Invalid ticker symbol." },
        performSWOTAnalysis: async ({ ticker }: { ticker: string }) => mockMarketData.swot[ticker.toUpperCase()] || { error: "SWOT analysis not available for this ticker." },
        // Corporate Finance Tools
        getCorporateFinancials: async ({ period }: { period: string }) => mockCorporateData.financials[period] || { error: "Financial data not available for this period." },
        getCorporateInvoice: async ({ invoiceId }: { invoiceId: string }) => mockCorporateData.invoices.find(inv => inv.id === invoiceId) || { error: "Invoice not found." },
        analyzePayrollData: async ({ period = "Last Month" }: { period?: string }) => mockCorporateData.payroll[period] || { error: "Payroll data not available for this period." },
        // Risk & Compliance Tools
        runFraudDetection: async () => {
            const suspicious = mockCorporateData.corporateTransactions.filter(t => t.suspicious);
            return { suspiciousTransactionsFound: suspicious.length, details: suspicious };
        },
        generateComplianceReport: async ({ regulation }: { regulation: string }) => {
            const status = regulation === 'SOX' ? 'Compliant' : 'At Risk';
            return { regulation, status, summary: `System check confirms all financial reporting controls are compliant with ${regulation} standards.`, checklist: [{ item: 'Access Control Review', status: 'Pass' }, { item: 'Data Integrity Check', status: 'Pass' }] };
        },
    }), [data, mockCorporateData, mockMarketData]);
};


// --- CUSTOM HOOK FOR AI CHAT LOGIC ---

export const useAIAdvisorChat = () => {
    const [state, dispatch] = useReducer(chatReducer, initialChatState);
    const chatRef = useRef<Chat | null>(null);
    const toolImplementations = useToolImplementations();
    const { data } = useContext(DataContext);
    const [apiKey, setApiKey] = useState(process.env.NEXT_PUBLIC_GEMINI_API_KEY || '');

    useEffect(() => {
        if (!apiKey) {
            dispatch({ type: 'SET_ERROR', payload: 'Gemini API key is not configured. Please set NEXT_PUBLIC_GEMINI_API_KEY in your environment variables.' });
            return;
        }
        if (!chatRef.current) {
            try {
                const ai = new GoogleGenAI({ apiKey });
                chatRef.current = ai.chats.create({
                    model: 'gemini-1.5-pro',
                    config: { systemInstruction: DETAILED_SYSTEM_INSTRUCTION },
                    tools: toolDefinitions,
                    toolConfig: { functionCallingConfig: { mode: FunctionCallingMode.AUTO } },
                });
                dispatch({ type: 'CLEAR_ERROR' });
            } catch (error) {
                console.error("Failed to initialize GoogleGenAI:", error);
                dispatch({ type: 'SET_ERROR', payload: 'Failed to initialize the AI model. Please check your API key and network connection.' });
            }
        }
    }, [apiKey]);
    
    useEffect(() => {
        const primeAI = async () => {
             if (data && chatRef.current && state.messages.length === 0) {
                const welcomeMessage: EnhancedMessage = {
                    id: `msg_${Date.now()}`,
                    role: 'model',
                    parts: [{ text: "Hello! I'm Quantum, your AI financial advisor. I've reviewed your current financial standing. How can I assist you today?" }],
                    timestamp: new Date(),
                };
                dispatch({ type: 'ADD_MODEL_RESPONSE', payload: welcomeMessage });
            }
        };
        primeAI();
    }, [data, state.messages.length]);


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

        let allMessages: Content[] = state.messages.map(msg => ({
            role: msg.role === 'system_tool' ? 'model' : msg.role,
            parts: msg.parts.map(p => p as Part)
        }));
        allMessages.push({ role: 'user', parts: [{ text: messageText }] });
        
        try {
            let result = await chatRef.current.sendMessage({
                message: messageText,
                history: allMessages
            });

            while (result.functionCalls && result.functionCalls.length > 0) {
                const toolCalls = result.functionCalls;
                
                const modelMessageWithToolCalls: EnhancedMessage = {
                    id: `msg_model_${Date.now()}`,
                    role: 'model',
                    parts: [...(result.text ? [{text: result.text}] : []), ...toolCalls.map(tc => ({functionCall: tc}))],
                    timestamp: new Date(),
                };
                dispatch({ type: 'ADD_MODEL_RESPONSE', payload: modelMessageWithToolCalls });

                const toolResults: ToolResultPart[] = [];
                for (const call of toolCalls) {
                    dispatch({ type: 'START_TOOL_EXECUTION', payload: call.name });
                    const toolImplementation = (toolImplementations as Record<string, Function>)[call.name];
                    if (toolImplementation) {
                        try {
                            const response = await toolImplementation(call.args);
                            toolResults.push({ functionResponse: { name: call.name, response } });
                        } catch (e) {
                             toolResults.push({ functionResponse: { name: call.name, response: { error: `Tool execution failed: ${(e as Error).message}` } } });
                        }
                    } else {
                         toolResults.push({ functionResponse: { name: call.name, response: { error: "Tool not found." } } });
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

                 result = await chatRef.current.sendMessage({ message: JSON.stringify(toolResults), isToolResponse: true });
            }

            const finalModelMessage: EnhancedMessage = {
                id: `msg_model_final_${Date.now()}`,
                role: 'model',
                parts: [{ text: result.text }],
                timestamp: new Date(),
            };
            dispatch({ type: 'ADD_MODEL_RESPONSE', payload: finalModelMessage });

        } catch (error) {
            console.error("AI Advisor Error:", error);
            dispatch({ type: 'SET_ERROR', payload: "I apologize, but I've encountered a system error. Please try your request again or restart the conversation." });
        }
    }, [state.messages, toolImplementations]);
    
    const resetChat = useCallback(() => {
        chatRef.current = null; // Force re-initialization
        dispatch({ type: 'RESET_CHAT' });
    }, []);

    const giveFeedback = useCallback((messageId: string, feedback: 'good' | 'bad') => {
        dispatch({ type: 'SET_MESSAGE_FEEDBACK', payload: { messageId, feedback } });
        // In a real app, you'd send this feedback to a logging service to improve the model
    }, []);

    return { state, sendMessage, resetChat, giveFeedback };
};

// --- RICH CONTENT RENDERER COMPONENTS ---

const RichContentRenderer: React.FC<{ content: RichContent, onAction: (payload: any) => void }> = ({ content, onAction }) => {
    // Each component is memoized for performance
    const renderMap: Record<RichContent['type'], React.ReactNode> = {
        table: <DataTable data={content.data as any} />,
        bar_chart: <DataBarChart data={content.data as any} />,
        line_chart: <DataLineChart data={content.data as any} />,
        financial_summary: <FinancialSummaryCard data={content.data as any} />,
        actionable_suggestion: <ActionableSuggestion data={content.data as any} onAction={onAction} />,
        risk_gauge: <RiskGauge data={content.data as any} />,
        market_news: <MarketNews data={content.data as any} />,
        stock_quote: <StockQuote data={content.data as any} />,
        compliance_report: <ComplianceReport data={content.data as any} />,
        swot_analysis: <SwotAnalysis data={content.data as any} />,
    };

    return renderMap[content.type] || <div className="text-red-500">Unsupported rich content type</div>;
};

const FinancialSummaryCard: React.FC<{ data: Extract<RichContent, { type: 'financial_summary' }>['data'] }> = React.memo(({ data }) => (
    <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700"><h4 className="text-lg font-bold text-cyan-300 mb-3">Financial Snapshot</h4><div className="grid grid-cols-2 gap-3 text-sm"><div className="font-semibold text-gray-400">Total Balance:</div><div className="text-right text-white">${data.totalBalance.toLocaleString()}</div><div className="font-semibold text-gray-400">Total Assets:</div><div className="text-right text-white">${data.totalAssets.toLocaleString()}</div><div className="font-semibold text-gray-400">Total Liabilities:</div><div className="text-right text-red-400">${data.totalLiabilities.toLocaleString()}</div><div className="col-span-2 border-t border-gray-600 my-1"></div><div className="font-bold text-gray-300">Net Worth:</div><div className="text-right font-bold text-cyan-400">${data.netWorth.toLocaleString()}</div></div></div>
));

const DataTable: React.FC<{ data: Extract<RichContent, { type: 'table' }>['data'] }> = React.memo(({ data }) => (
    <div className="overflow-x-auto rounded-lg border border-gray-700"><table className="w-full text-sm text-left text-gray-300"><thead className="text-xs text-cyan-300 uppercase bg-gray-700/50"><tr>{data.headers.map(h => <th key={h} scope="col" className="px-4 py-2">{h}</th>)}</tr></thead><tbody>{data.rows.map((row, i) => (<tr key={i} className="bg-gray-800/30 border-b border-gray-700 hover:bg-gray-700/50">{row.map((cell, j) => <td key={j} className="px-4 py-2">{typeof cell === 'number' ? `$${cell.toLocaleString()}` : cell}</td>)}</tr>))}</tbody></table></div>
));

const DataBarChart: React.FC<{ data: Extract<RichContent, { type: 'bar_chart' }>['data'] }> = React.memo(({ data }) => (
    <div className="h-64 w-full bg-gray-800/50 p-4 rounded-lg border border-gray-700"><h4 className="text-sm font-semibold text-cyan-300 mb-2">{data.title}</h4><ResponsiveContainer><BarChart data={data.items} margin={{ top: 5, right: 20, left: 20, bottom: 5 }}><CartesianGrid strokeDasharray="3 3" stroke="#4A5568" /><XAxis dataKey="name" stroke="#A0AEC0" fontSize={12} tickLine={false} axisLine={false} /><YAxis stroke="#A0AEC0" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} /><Tooltip cursor={{ fill: '#4A5568' }} contentStyle={{ backgroundColor: '#1A202C', border: '1px solid #2D3748' }} /><Legend wrapperStyle={{fontSize: "12px"}}/><Bar dataKey={data.dataKey} fill="#2DD4BF" name="Amount" /></BarChart></ResponsiveContainer></div>
));

const DataLineChart: React.FC<{ data: Extract<RichContent, { type: 'line_chart' }>['data'] }> = React.memo(({ data }) => (
     <div className="h-64 w-full bg-gray-800/50 p-4 rounded-lg border border-gray-700"><h4 className="text-sm font-semibold text-cyan-300 mb-2">{data.title}</h4><ResponsiveContainer><LineChart data={data.items}><CartesianGrid strokeDasharray="3 3" stroke="#4A5568" /><XAxis dataKey={data.dataKeyX} stroke="#A0AEC0" fontSize={12} /><YAxis stroke="#A0AEC0" fontSize={12} tickFormatter={(value) => `$${Math.round(Number(value) / 1000)}k`}/><Tooltip cursor={{ fill: '#4A5568' }} contentStyle={{ backgroundColor: '#1A202C', border: '1px solid #2D3748' }} formatter={(value:number) => `$${value.toLocaleString()}`} /><Legend wrapperStyle={{fontSize: "12px"}}/><Line type="monotone" dataKey={data.dataKeyY} stroke="#2DD4BF" strokeWidth={2} dot={false} name="Portfolio Value" /></LineChart></ResponsiveContainer></div>
));

const ActionableSuggestion: React.FC<{ data: Extract<RichContent, { type: 'actionable_suggestion' }>['data'], onAction: (payload: any) => void }> = React.memo(({ data, onAction }) => (
    <div className="bg-cyan-900/50 p-4 rounded-lg border border-cyan-700"><h4 className="text-lg font-bold text-cyan-300 mb-2">{data.title}</h4><p className="text-gray-300 text-sm mb-4">{data.description}</p><button onClick={() => onAction(data.actionPayload)} className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white font-semibold rounded-lg transition-colors">{data.actionText}</button></div>
));

const RiskGauge: React.FC<{ data: Extract<RichContent, { type: 'risk_gauge' }>['data'] }> = React.memo(({ data }) => {
    const COLORS = { Low: '#2DD4BF', Medium: '#FBBF24', High: '#F87171', Critical: '#DC2626' };
    const color = COLORS[data.level];
    return <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700 text-center"><h4 className="text-lg font-bold text-cyan-300 mb-2">{data.title}</h4><div className="w-32 h-32 mx-auto"><ResponsiveContainer><PieChart><Pie data={[{ value: data.score }, { value: 100 - data.score }]} dataKey="value" cx="50%" cy="50%" innerRadius={40} outerRadius={50} startAngle={180} endAngle={-180} fill={color} stroke="none" paddingAngle={0}><Cell key="cell-0" fill={color} /><Cell key="cell-1" fill="#4A5568" /></Pie><text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" fill={color} fontSize="24" fontWeight="bold">{data.score}</text></PieChart></ResponsiveContainer></div><p className="font-bold text-xl" style={{ color }}>{data.level}</p><p className="text-gray-400 text-sm mt-1">{data.description}</p></div>
});

const MarketNews: React.FC<{ data: Extract<RichContent, { type: 'market_news' }>['data'] }> = React.memo(({ data }) => (
    <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700 space-y-3"><h4 className="text-lg font-bold text-cyan-300">Market News</h4>{data.articles.map((article, i) => (<div key={i} className="border-b border-gray-700 pb-2 last:border-b-0"><a href={article.url} target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline font-semibold">{article.title}</a><div className="text-xs text-gray-400 mt-1"><span>{article.source}</span> &middot; <span>{new Date(article.publishedAt).toLocaleDateString()}</span></div></div>))}</div>
));

const StockQuote: React.FC<{ data: Extract<RichContent, { type: 'stock_quote' }>['data'] }> = React.memo(({ data }) => (
    <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700"><div className="flex justify-between items-center"><h4 className="text-xl font-bold text-cyan-300">{data.ticker}</h4><p className="text-sm text-gray-400">{data.companyName}</p></div><div className="flex items-baseline gap-4 mt-2"><p className="text-4xl font-bold text-white">${data.price.toFixed(2)}</p><p className={`text-lg font-semibold ${data.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>{data.change.toFixed(2)} ({data.changePercent.toFixed(2)}%)</p></div><p className="text-xs text-gray-500 mt-2">Market Cap: ${(data.marketCap / 1e9).toFixed(2)}B</p></div>
));

const ComplianceReport: React.FC<{ data: Extract<RichContent, { type: 'compliance_report' }>['data'] }> = React.memo(({ data }) => (
    <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700"><div className="flex items-center gap-3"><FaShieldAlt className="h-8 w-8 text-cyan-400" /><h4 className="text-lg font-bold text-cyan-300">Compliance Report: {data.regulation}</h4></div><div className={`mt-2 text-lg font-bold ${data.status === 'Compliant' ? 'text-green-400' : 'text-red-400'}`}>{data.status}</div><p className="text-sm text-gray-300 mt-1">{data.summary}</p><div className="mt-4"><h5 className="text-sm font-semibold text-gray-400 mb-2">Checklist</h5><ul className="space-y-1 text-sm">{data.checklist.map(item => <li key={item.item} className="flex items-center gap-2"><span>{item.status === 'Pass' ? '✅' : '❌'}</span><span>{item.item}</span></li>)}</ul></div></div>
));

const SwotAnalysis: React.FC<{ data: Extract<RichContent, { type: 'swot_analysis' }>['data'] }> = React.memo(({ data }) => {
    const Quadrant: React.FC<{ title: string; items: string[]; className: string }> = ({ title, items, className }) => (<div className={`p-3 rounded ${className}`}><h5 className="font-bold mb-2">{title}</h5><ul className="list-disc list-inside text-sm space-y-1">{items.map(item => <li key={item}>{item}</li>)}</ul></div>);
    return (<div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700"><h4 className="text-lg font-bold text-cyan-300 mb-3">SWOT Analysis: {data.company}</h4><div className="grid grid-cols-2 gap-3"><Quadrant title="Strengths" items={data.strengths} className="bg-green-900/50 text-green-200" /><Quadrant title="Weaknesses" items={data.weaknesses} className="bg-red-900/50 text-red-200" /><Quadrant title="Opportunities" items={data.opportunities} className="bg-blue-900/50 text-blue-200" /><Quadrant title="Threats" items={data.threats} className="bg-yellow-900/50 text-yellow-200" /></div></div>);
});

// --- UI COMPONENTS FOR CHAT ---

const CopyToClipboardButton: React.FC<{ text: string }> = ({ text }) => {
    const [copied, setCopied] = useState(false);
    const handleCopy = () => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 2000); };
    return (<button onClick={handleCopy} className="p-1.5 bg-gray-600/50 rounded-md hover:bg-gray-500/50 text-gray-300 hover:text-white transition-colors">{copied ? <FaClipboardCheck /> : <FaClipboard />}</button>);
};

const MessageActions: React.FC<{ message: EnhancedMessage; onFeedback: (id: string, feedback: 'good' | 'bad') => void }> = ({ message, onFeedback }) => (
    <div className="absolute top-2 right-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button onClick={() => onFeedback(message.id, 'good')} className={`p-1.5 rounded-md ${message.feedback === 'good' ? 'bg-green-500/50 text-white' : 'bg-gray-600/50 hover:bg-green-500/50 text-gray-300 hover:text-white'}`}><FaThumbsUp size={12} /></button>
        <button onClick={() => onFeedback(message.id, 'bad')} className={`p-1.5 rounded-md ${message.feedback === 'bad' ? 'bg-red-500/50 text-white' : 'bg-gray-600/50 hover:bg-red-500/50 text-gray-300 hover:text-white'}`}><FaThumbsDown size={12} /></button>
        <CopyToClipboardButton text={message.parts.filter(p => 'text' in p).map(p => (p as { text: string }).text).join('\n')} />
    </div>
);

const MessageRenderer: React.FC<{ message: EnhancedMessage; onAction: (payload: any) => void; onFeedback: (id: string, feedback: 'good' | 'bad') => void }> = React.memo(({ message, onAction, onFeedback }) => {
    const { role, parts, timestamp } = message;
    const isUser = role === 'user';
    const bubbleStyle = isUser ? 'bg-cyan-600 text-white' : 'bg-gray-700 text-gray-200';
    return (
        <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} group`}>
            <div className={`flex gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
                <div className="w-8 h-8 rounded-full bg-gray-800 flex-shrink-0 flex items-center justify-center mt-1">{role === 'user' ? <FaUser className="h-5 w-5 text-cyan-300" /> : <FaRobot className="h-5 w-5 text-cyan-300" />}</div>
                <div className={`max-w-2xl p-3 rounded-lg shadow-md relative ${bubbleStyle}`}>
                    <div className="space-y-3">
                    {parts.map((part, index) => {
                        if ('text' in part && part.text) return <p key={index} className="whitespace-pre-wrap">{part.text}</p>;
                        if ('functionCall' in part) return <div key={index} className="text-xs text-gray-400 italic bg-gray-800/40 p-2 rounded-md"><p><strong>Tool Call:</strong> <code>{part.functionCall.name}</code></p><pre className="text-xs mt-1">Args: {JSON.stringify(part.functionCall.args, null, 2)}</pre></div>;
                        if ('functionResponse' in part) return <div key={index} className="text-xs text-gray-400 italic bg-gray-800/40 p-2 rounded-md"><p><strong>Tool Result for <code>{part.functionResponse.name}</code>:</strong></p><pre className="text-xs mt-1">{JSON.stringify(part.functionResponse.response, null, 2)}</pre></div>;
                        if ('richContent' in part) return <RichContentRenderer key={index} content={part.richContent} onAction={onAction} />;
                        return null;
                    })}
                    </div>
                    {role === 'model' && parts.some(p => 'text' in p) && <MessageActions message={message} onFeedback={onFeedback} />}
                </div>
            </div>
            <p className="text-xs text-gray-500 mt-1 px-11">{new Date(timestamp).toLocaleTimeString()}</p>
        </div>
    );
});

// --- MAIN AI ADVISOR VIEW COMPONENT ---

const AIAdvisorView: React.FC<{ previousView: View | null }> = ({ previousView }) => {
    const { state, sendMessage, resetChat, giveFeedback } = useAIAdvisorChat();
    const { messages, isLoading, error, isToolExecuting, toolExecutionName } = state;
    const [input, setInput] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

    const handleSendMessage = async (messageText: string) => {
        if (!messageText.trim()) return;
        setInput('');
        await sendMessage(messageText);
    };

    const handleSuggestionClick = (prompt: string) => {
        setInput(prompt);
        handleSendMessage(prompt);
    };
    
    const handleAction = (payload: any) => {
        const actionMessage = `The user wants to perform an action: ${JSON.stringify(payload)}`;
        handleSendMessage(actionMessage);
    };

    const prompts = examplePrompts[previousView || 'DEFAULT'] || examplePrompts.DEFAULT;

    return (
        <div className="h-full flex flex-col bg-gray-900">
            <div className="flex justify-between items-center mb-6"><h2 className="text-3xl font-bold text-white tracking-wider">AI Advisor (Quantum)</h2><button onClick={resetChat} className="p-2 rounded-full text-gray-400 hover:bg-gray-700 hover:text-white transition-colors" aria-label="Reset conversation"><FaRedo className="h-5 w-5" /></button></div>
            <Card className="flex-grow flex flex-col" padding="none">
                <div className="flex-grow p-6 space-y-6 overflow-y-auto">
                    {messages.map((msg) => <MessageRenderer key={msg.id} message={msg} onAction={handleAction} onFeedback={giveFeedback} />)}
                    {isLoading && !isToolExecuting && <div className="flex items-start gap-3"><div className="w-8 h-8 rounded-full bg-gray-800 flex-shrink-0 flex items-center justify-center mt-1"><FaRobot className="h-6 w-6 text-cyan-300"/></div><div className="max-w-lg p-3 rounded-lg shadow-md bg-gray-700 text-gray-200 flex items-center gap-2"><div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse delay-75"></div><div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse delay-150"></div><div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse delay-300"></div></div></div>}
                    {isToolExecuting && <div className="flex items-center justify-center gap-2 text-sm text-gray-400 p-2"><FaSpinner className="animate-spin text-cyan-400" /><span>Accessing tool: <strong>{toolExecutionName}...</strong></span></div>}
                    <div ref={messagesEndRef} />
                </div>

                {messages.length <= 1 && !isLoading && (
                    <div className="text-center p-6 text-gray-400 border-t border-gray-700/60">
                        <p className="mb-4">Since you just came from the <strong className="text-cyan-300">{previousView || 'Dashboard'}</strong>, you could ask:</p>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">{prompts.map(p => (<button key={p} onClick={() => handleSuggestionClick(p)} className="p-3 bg-gray-700/50 hover:bg-gray-700 rounded-lg text-sm text-cyan-200 transition-colors text-left">"{p}"</button>))}</div>
                    </div>
                )}
                
                {error && <div className="p-4 border-t border-red-500/50 bg-red-900/30 text-red-300 flex items-center gap-3"><FaExclamationCircle className="h-5 w-5 flex-shrink-0" /><p className="text-sm">{error}</p></div>}

                <div className="p-4 border-t border-gray-700/60 bg-gray-800/50 rounded-b-xl">
                    <form onSubmit={(e) => { e.preventDefault(); handleSendMessage(input); }} className="flex items-center gap-2">
                        <input type="text" value={input} onChange={(e) => setInput(e.target.value)} placeholder="Ask Quantum anything..." className="flex-grow bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all" disabled={isLoading} aria-label="Chat input for AI Advisor"/>
                        <button type="submit" className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white font-semibold rounded-lg disabled:opacity-50 flex items-center justify-center w-24 transition-colors" disabled={isLoading || !input.trim()} aria-label="Send message">{isLoading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : 'Send'}</button>
                    </form>
                    <p className="text-xs text-gray-500 mt-2 text-center">Quantum can make mistakes. Consider checking important information.</p>
                </div>
            </Card>
        </div>
    );
};

export default AIAdvisorView;