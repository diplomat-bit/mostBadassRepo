// REPOSITORY SOURCE: diplomat-bit/Citibank_Demo_Business_Inc_Demonstration- | PATH: diplomat-bit-Citibank_Demo_Business_Inc_Demonstration--ab2501d/components/views/platform/AIAdvisorView.tsx.md
================================================================================

---
/*
# The Interrogation Room
*A Guide to the AI Advisor*

---

## The Concept

The `AIAdvisorView.tsx`, nicknamed "Quantum," is the primary command interface for the application. It's the "Interrogation Room," a dedicated space where the sovereign can issue direct queries to their AI instrument and receive definitive answers. It maintains a persistent session and uses your command history to provide smart, context-aware suggestions for your next line of questioning.

---

### A Simple Metaphor: Interrogating an Oracle

Think of this view as having a direct line to an omniscient oracle that is bound to answer you truthfully.

-   **The Interrogation (`messages`)**: The main part of the view is the record of your interrogation—a simple back-and-forth between you and your AI instrument.

-   **Contextual Awareness (`previousView`)**: The oracle knows what you were last focused on. If you come from the "Covenants" (Budgets) view, its first suggestions will be about enforcing your will in that domain. This makes the interrogation efficient and relevant.

-   **Suggested Lines of Questioning (`examplePrompts`)**: To begin the interrogation, the oracle offers a few relevant questions you might want to ask, based on the context of your last command. This eliminates ambiguity and makes it easy to get to the truth.

-   **The Oracle's Oath (`systemInstruction`)**: The instrument has been bound by an oath: "helpful, professional, and slightly futuristic." This ensures its answers are always clear, concise, and serve your will.

---

### How It Works

1.  **Binding the Oracle**: When the component first loads, it creates a `Chat` instance with the Gemini API. This instance is stored in a `useRef`, which is crucial because it ensures the *same interrogation session* persists. This is how the AI remembers your entire line of questionin g. The AI's oath is sworn here using the `systemInstruction`.

2.  **Issuing a Query**: When you send a message, the `handleSendMessage` function is called.
    -   It immediately adds your query to the record so the interface feels instant.
    -   It sends the query to the Gemini API using the persistent `chatRef.current.sendMessage`. This method automatically includes the entire previous interrogation, giving the AI full context.
    -   When the AI's definitive answer comes back, it's added to the record.

3.  **Providing Context**: The `App` component keeps track of the `previousView` you were commanding. It passes this information to the `AIAdvisorView`. The component then uses this to look up the most relevant `examplePrompts`, making the initial screen feel intelligent and prepared for your command.

---

### The Philosophy: Definitive Answers

This component is designed to make getting to the truth as easy as asking a direct question. Instead of navigating complex reports, you simply issue a query in plain English. The AI instrument, with its memory of the conversation and context of your recent commands, can provide the clear, concise, and definitive answers required to exercise effective rule.
*/

import React, {
    useState,
    useRef,
    useEffect,
    useCallback,
    useMemo,
    createContext,
    useContext,
    useReducer,
    Fragment,
    forwardRef,
    useImperativeHandle,
    PropsWithChildren,
} from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import { VegaLite } from 'react-vega';
import { v4 as uuidv4 } from 'uuid';
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';


// --- TYPE DEFINITIONS ---

/**
 * Represents the author of a message.
 * 'user': The end-user interacting with the UI.
 * 'ai': The AI model providing responses.
 * 'system': Internal messages for status, errors, or context.
 * 'tool': Messages related to AI tool calls and results.
 */
export type MessageAuthor = 'user' | 'ai' | 'system' | 'tool';

/**
 * Represents the status of a message, particularly for AI responses.
 * 'pending': Waiting for a response or for a tool to run.
 * 'streaming': The AI response is actively being streamed.
 * 'complete': The message is fully received and rendered.
 * 'error': An error occurred while generating or processing the message.
 */
export type MessageStatus = 'pending' | 'streaming' | 'complete' | 'error';

/**
 * Defines a tool call requested by the AI model.
 */
export interface ToolCall {
    id: string;
    name: string;
    args: Record<string, any>;
}

/**
 * Defines the result of a tool execution.
 */
export interface ToolResult {
    callId: string;
    result: any;
    error?: string;
}

/**
 * Defines the types of rich content that can be displayed in a message.
 */
export type ContentType = 'markdown' | 'code' | 'table' | 'chart' | 'image' | 'component';

/**
 * Represents a piece of rich content within a message.
 */
export interface ContentPart {
    type: ContentType;
    payload: any;
}

/**
 * Represents metadata associated with an AI message.
 */
export interface AIMessageMetadata {
    tokenCount?: number;
    modelId?: string;
    sources?: { title: string; url: string }[];
    relatedQuestions?: string[];
    latencyMs?: number;
}

/**
 * The core message structure for the chat interface.
 */
export interface ChatMessage {
    id: string;
    author: MessageAuthor;
    content: string | ContentPart[];
    timestamp: string;
    status: MessageStatus;
    toolCalls?: ToolCall[];
    toolResults?: ToolResult[];
    metadata?: AIMessageMetadata;
    parentId?: string; // For threading/editing
}

/**
 * Represents a full conversation thread.
 */
export interface Conversation {
    id: string;
    title: string;
    createdAt: string;
    lastModified: string;
    messages: ChatMessage[];
    systemInstruction: string;
    contextData?: Record<string, any>;
    aiProvider: AIProviderType;
}

/**
 * Contextual information passed to the AI Advisor.
 */
export type AdvisorContextType = 'Covenants' | 'Treasury' | 'Fleet' | 'Intelligence' | 'None';

/**
 * Props for the main AIAdvisorView component.
 */
export interface AIAdvisorViewProps {
    initialContext?: AdvisorContextType;
    user: { id: string; name: string; avatarUrl?: string };
    onNewConversation?: (conversationId: string) => void;
    initialConversationId?: string;
}

/**
 * Represents an available tool the AI can use.
 */
export interface AITool {
    name: string;
    description: string;
    parameters: {
        type: 'object';
        properties: Record<string, { type: string; description: string; enum?: string[] }>;
        required: string[];
    };
    execute: (args: any) => Promise<any>;
}

/**
 * Props for the ChatInput component.
 */
export interface ChatInputProps {
    onSendMessage: (message: string, attachments?: File[]) => void;
    isSending: boolean;
    placeholder?: string;
}

/**
 * Ref handle for the ChatInput component to allow programmatic focus.
 */
export interface ChatInputRef {
    focus: () => void;
    setText: (text: string) => void;
}

/**
 * Defines the structure of an AI service response.
 */
export interface AIResponse {
    fullResponse: string;
    toolCalls?: ToolCall[];
    metadata: AIMessageMetadata;
}

/**
 * Interface for a generic AI service.
 */
export interface IAIService {
    generateResponse(
        messages: ChatMessage[],
        tools: AITool[],
        onStream: (chunk: string) => void
    ): Promise<AIResponse>;
}

export type AIProviderType = 'gemini' | 'openai';


// --- UI ICONS ---

/**
 * A simple, general-purpose Icon component using inline SVG.
 */
const Icon = React.memo(({ name, size = 16 }: { name: string; size?: number }) => {
    const icons: { [key: string]: React.ReactNode } = {
        send: <path d="M10 14l11-11-11-11v7l-11 4 11 4z" />,
        copy: <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z" />,
        retry: <path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z" />,
        thumb_up: <path d="M1 21h4V9H1v12zm22-11c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.59 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-2z" />,
        thumb_down: <path d="M15 3H6c-.83 0-1.54.5-1.84 1.22l-3.02 7.05c-.09.23-.14.47-.14.73v2c0 1.1.9 2 2 2h6.31l-.95 4.57-.03.32c0 .41.17.79.44 1.06L9.83 23l6.59-6.59c.36-.36.58-.86.58-1.41V5c0-1.1-.9-2-2-2zm4 0v12h4V3h-4z" />,
        user: <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />,
        bot: <path d="M19 1H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h4l3 3 3-3h4c1.1 0 2-.9 2-2V3c0-1.1-.9-2-2-2zm-5 12h-4v-2h4v2zm0-4h-4V7h4v2z" />,
        light_mode: <path d="M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zM2 13h2c.55 0 1-.45 1-1s-.45-1-1-1H2c-.55 0-1 .45-1 1s.45 1 1 1zm18 0h2c.55 0 1-.45 1-1s-.45-1-1-1h-2c-.55 0-1 .45-1 1s.45 1 1 1zM11 2v2c0 .55.45 1 1 1s1-.45 1-1V2c0-.55-.45-1-1-1s-1 .45-1 1zm0 18v2c0 .55.45 1 1 1s1-.45 1-1v-2c0-.55-.45-1-1-1s-1 .45-1 1zM5.99 4.58c-.39-.39-1.03-.39-1.41 0-.39.39-.39 1.03 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0s.39-1.03 0-1.41L5.99 4.58zm12.02 12.02c-.39-.39-1.03-.39-1.41 0-.39.39-.39 1.03 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0 .39-.39.39-1.03 0-1.41l-1.06-1.06zM20 6.01c.39-.39.39-1.03 0-1.41-.39-.39-1.03-.39-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06zM4.58 18.01c.39-.39.39-1.03 0-1.41-.39-.39-1.03-.39-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06z" />,
        dark_mode: <path d="M10 2c-1.82 0-3.53.5-5 1.35C7.99 5.08 10 8.3 10 12s-2.01 6.92-5 8.65C6.47 21.5 8.18 22 10 22c5.52 0 10-4.48 10-10S15.52 2 10 2z" />,
        new_chat: <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z" />,
        menu: <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z" />,
    };

    return (
        <svg fill="currentColor" width={size} height={size} viewBox="0 0 24 24" style={{ verticalAlign: 'middle' }}>
            {icons[name] || <circle cx="12" cy="12" r="10" />}
        </svg>
    );
});
Icon.displayName = 'Icon';


// --- CONSTANTS & CONFIGURATION ---

export const DEFAULT_SYSTEM_INSTRUCTION = "You are Quantum, a helpful, professional, and slightly futuristic AI advisor. You provide clear, concise, and definitive answers to serve the user's will. You can use available tools to access real-time data and perform actions.";

export const CONTEXTUAL_PROMPTS: Record<AdvisorContextType, string[]> = {
    Covenants: ["Summarize our current budget adherence.", "Which covenants are at risk of being breached?", "Project spending for the next 6 months.", "Generate a report on discretionary spending."],
    Treasury: ["What is our current cash flow situation?", "Analyze the performance of our investment portfolio.", "Show me a breakdown of assets vs. liabilities.", "Forecast treasury balance for year-end."],
    Fleet: ["What is the operational readiness of the fleet?", "List all assets currently undergoing maintenance.", "Show me a map of all active fleet deployments.", "Who is the commander of the starship 'Vanguard'?"],
    Intelligence: ["Summarize recent intelligence from the outer rim.", "Are there any emerging threats we should be aware of?", "Cross-reference faction 'Xylos' with trade anomalies.", "Generate a risk assessment for sector 7."],
    None: ["Give me a high-level summary of the current situation.", "What are the most pressing issues?", "Who can I talk to about fleet logistics?", "Start a new project plan."],
};

const LOCAL_STORAGE_KEY = 'ai_advisor_conversations';


// --- MOCK API & SERVICES ---

class MockGeminiService implements IAIService {
    async generateResponse(messages: ChatMessage[], tools: AITool[], onStream: (chunk: string) => void): Promise<AIResponse> {
        const lastUserMessage = messages[messages.length - 1]?.content.toString().toLowerCase() || '';
        await new Promise(res => setTimeout(res, 300));

        if (lastUserMessage.includes("readiness")) {
            return {
                fullResponse: "",
                toolCalls: [{ id: `tool_${uuidv4()}`, name: "get_fleet_readiness", args: { status: "all" } }],
                metadata: { modelId: 'gemini-pro-mock' }
            };
        }
        if (lastUserMessage.includes("market")) {
            return {
                fullResponse: "",
                toolCalls: [{ id: `tool_${uuidv4()}`, name: "get_market_data", args: { symbol: "TSLA" } }],
                metadata: { modelId: 'gemini-pro-mock' }
            };
        }

        let response = "I am processing your query. Stand by for a definitive answer.";
        if (lastUserMessage.includes("hello")) response = "Greetings. I am Quantum, your AI advisor. How may I be of service?";
        else if (lastUserMessage.includes("covenants")) response = "Analyzing covenant compliance... All budgets are within parameters. The 'Project Chimera' R&D fund is at 87% utilization.";

        const chunks = response.match(/.{1,10}/g) || [];
        for (const chunk of chunks) {
            await new Promise(res => setTimeout(res, 40));
            onStream(chunk);
        }

        return { fullResponse: response, metadata: { modelId: 'gemini-pro-mock', tokenCount: response.length * 2, latencyMs: 500 + chunks.length * 40 } };
    }
}

class MockOpenAIService implements IAIService {
    async generateResponse(messages: ChatMessage[], tools: AITool[], onStream: (chunk: string) => void): Promise<AIResponse> {
        const lastUserMessage = messages[messages.length - 1]?.content.toString().toLowerCase() || '';
        await new Promise(res => setTimeout(res, 400));

        if (lastUserMessage.includes("sales report")) {
            return {
                fullResponse: "",
                toolCalls: [{ id: `tool_${uuidv4()}`, name: "generate_sales_report", args: { quarter: "Q3", year: 2024 } }],
                metadata: { modelId: 'gpt-4-turbo-mock' }
            };
        }

        let response = "Acknowledged. Processing your directive now.";
        if (lastUserMessage.includes("hello")) response = "Hello! As an advanced AI, I am ready to assist you. What is your query?";
        else if (lastUserMessage.includes("treasury")) response = "Accessing treasury data... Current liquidity stands at 1.2B credits. The portfolio is up 3.2% this quarter, driven by strong performance in tech sector holdings.";

        const chunks = response.split(' ');
        for (const chunk of chunks) {
            await new Promise(res => setTimeout(res, 60));
            onStream(chunk + ' ');
        }
        
        return { fullResponse: response, metadata: { modelId: 'gpt-4-turbo-mock', tokenCount: response.length, latencyMs: 400 + chunks.length * 60 } };
    }
}

const aiServiceFactory = (provider: AIProviderType): IAIService => {
    switch (provider) {
        case 'gemini': return new MockGeminiService();
        case 'openai': return new MockOpenAIService();
        default: throw new Error(`Unknown AI provider: ${provider}`);
    }
};


// --- TOOLING ---

class ToolService {
    private tools: Map<string, AITool> = new Map();

    constructor(initialTools: AITool[]) {
        initialTools.forEach(tool => this.registerTool(tool));
    }

    public registerTool(tool: AITool): void {
        this.tools.set(tool.name, tool);
    }

    public getTool(name: string): AITool | undefined {
        return this.tools.get(name);
    }
    
    public getAvailableTools(): AITool[] {
        return Array.from(this.tools.values());
    }

    public async executeTool(call: ToolCall): Promise<ToolResult> {
        const tool = this.getTool(call.name);
        if (!tool) {
            const error = `Tool '${call.name}' not found.`;
            console.error(error);
            return { callId: call.id, result: null, error };
        }
        try {
            const result = await tool.execute(call.args);
            return { callId: call.id, result };
        } catch (e: any) {
            console.error(`Error executing tool '${call.name}':`, e);
            return { callId: call.id, result: null, error: e.message };
        }
    }
}

export const MOCK_TOOLS: AITool[] = [
    {
        name: "get_fleet_readiness",
        description: "Retrieves the operational status of the fleet.",
        parameters: { type: "object", properties: { status: { type: "string", description: "Status to filter by", enum: ["all", "active", "maintenance", "standby"] } }, required: ["status"] },
        execute: async (args) => {
            await new Promise(res => setTimeout(res, 1000));
            const data = [{ ship: "Vanguard", class: "Dreadnought", status: "active" }, { ship: "Aegis", class: "Cruiser", status: "maintenance" }];
            return { type: 'table', payload: { headers: ["Ship", "Class", "Status"], rows: data.map(s => [s.ship, s.class, s.status]) } };
        },
    },
    {
        name: "generate_sales_report",
        description: "Generates a sales report for a specific quarter and year.",
        parameters: { type: "object", properties: { quarter: { type: "string" }, year: { type: "number" } }, required: ["quarter", "year"] },
        execute: async (args) => {
            await new Promise(res => setTimeout(res, 1500));
            const salesData = [{ "month": "July", "revenue": 2870 }, { "month": "August", "revenue": 4320 }, { "month": "September", "revenue": 5550 }];
            return { type: 'chart', payload: { spec: { "$schema": "https://vega.github.io/schema/vega-lite/v5.json", "description": `Sales for ${args.quarter} ${args.year}`, "data": { "values": salesData }, "mark": "bar", "encoding": { "x": { "field": "month", "type": "ordinal" }, "y": { "field": "revenue", "type": "quantitative" } } } } };
        },
    },
    {
        name: "get_market_data",
        description: "Gets the latest market data for a stock symbol.",
        parameters: { type: "object", properties: { symbol: { type: "string", description: "The stock ticker symbol." } }, required: ["symbol"] },
        execute: async (args: { symbol: string }) => {
            await new Promise(res => setTimeout(res, 800));
            const price = (Math.random() * 200 + 100).toFixed(2);
            return { type: 'markdown', payload: `The current market price for **${args.symbol.toUpperCase()}** is **$${price}**. This represents a change of **+${(Math.random() * 5).toFixed(2)}%** over the last 24 hours.` };
        }
    }
];


// --- UTILITY FUNCTIONS ---

export const generateId = (): string => uuidv4();
export const formatTimestamp = (dateString: string): string => new Date(dateString).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });


// --- STATE MANAGEMENT ---

type ChatAction =
    | { type: 'ADD_MESSAGE'; payload: ChatMessage }
    | { type: 'UPDATE_LAST_MESSAGE'; payload: Partial<ChatMessage> }
    | { type: 'STREAM_TO_LAST_MESSAGE'; payload: string }
    | { type: 'SET_MESSAGES'; payload: ChatMessage[] }
    | { type: 'DELETE_MESSAGE'; payload: { messageId: string } }
    | { type: 'EDIT_MESSAGE'; payload: { messageId: string; newContent: string } };

export const chatReducer = (state: ChatMessage[], action: ChatAction): ChatMessage[] => {
    switch (action.type) {
        case 'ADD_MESSAGE': return [...state, action.payload];
        case 'UPDATE_LAST_MESSAGE':
            if (state.length === 0) return state;
            return [...state.slice(0, -1), { ...state[state.length - 1], ...action.payload }];
        case 'STREAM_TO_LAST_MESSAGE':
            if (state.length === 0 || typeof state[state.length - 1].content !== 'string') return state;
            const currentContent = state[state.length - 1].content as string;
            return [...state.slice(0, -1), { ...state[state.length - 1], content: currentContent + action.payload, status: 'streaming' }];
        case 'SET_MESSAGES': return action.payload;
        case 'DELETE_MESSAGE': return state.filter(msg => msg.id !== action.payload.messageId);
        case 'EDIT_MESSAGE': return state.map(msg => msg.id === action.payload.messageId ? { ...msg, content: action.payload.newContent } : msg);
        default: return state;
    }
};

/**
 * Manages conversation lifecycle: loading, saving, creating, deleting.
 * Uses localStorage for persistence in this demo.
 */
export const useConversationManager = () => {
    const [conversations, setConversations] = useState<Record<string, Conversation>>({});
    const [activeConversationId, setActiveConversationId] = useState<string | null>(null);

    useEffect(() => {
        try {
            const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
            if (saved) {
                setConversations(JSON.parse(saved));
            }
        } catch (error) {
            console.error("Failed to load conversations from localStorage:", error);
        }
    }, []);

    const saveConversations = useCallback((updatedConversations: Record<string, Conversation>) => {
        try {
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedConversations));
            setConversations(updatedConversations);
        } catch (error) {
            console.error("Failed to save conversations to localStorage:", error);
        }
    }, []);

    const createNewConversation = useCallback((context: AdvisorContextType, provider: AIProviderType) => {
        const newConvId = generateId();
        const newConversation: Conversation = {
            id: newConvId,
            title: `Interrogation ${new Date().toLocaleString()}`,
            createdAt: new Date().toISOString(),
            lastModified: new Date().toISOString(),
            messages: [],
            systemInstruction: DEFAULT_SYSTEM_INSTRUCTION,
            contextData: { initialContext: context },
            aiProvider: provider,
        };
        const updatedConversations = { ...conversations, [newConvId]: newConversation };
        saveConversations(updatedConversations);
        setActiveConversationId(newConvId);
        return newConversation;
    }, [conversations, saveConversations]);

    const updateConversation = useCallback((convId: string, updatedData: Partial<Conversation>) => {
        if (!conversations[convId]) return;
        const updatedConversation = { ...conversations[convId], ...updatedData, lastModified: new Date().toISOString() };
        const updatedConversations = { ...conversations, [convId]: updatedConversation };
        saveConversations(updatedConversations);
    }, [conversations, saveConversations]);
    
    const activeConversation = activeConversationId ? conversations[activeConversationId] : null;

    return {
        conversations: Object.values(conversations).sort((a,b) => new Date(b.lastModified).getTime() - new Date(a.lastModified).getTime()),
        activeConversation,
        setActiveConversationId,
        createNewConversation,
        updateConversation,
    };
};

/**
 * Manages the state and logic of a single chat session.
 */
export const useChatSession = (conversation: Conversation | null, updateConversation: Function) => {
    const [messages, dispatch] = useReducer(chatReducer, []);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);
    const toolService = useMemo(() => new ToolService(MOCK_TOOLS), []);

    useEffect(() => {
        dispatch({ type: 'SET_MESSAGES', payload: conversation?.messages || [] });
    }, [conversation]);
    
    useEffect(() => {
        if (conversation && messages.length > 0) {
            updateConversation(conversation.id, { messages });
        }
    }, [messages, conversation, updateConversation]);

    const sendMessage = useCallback(async (text: string) => {
        if (!conversation) return;
        
        setIsLoading(true);
        setError(null);
        
        const userMessage: ChatMessage = { id: generateId(), author: 'user', content: text, timestamp: new Date().toISOString(), status: 'complete' };
        const currentMessages = [...messages, userMessage];
        dispatch({ type: 'ADD_MESSAGE', payload: userMessage });

        const aiService = aiServiceFactory(conversation.aiProvider);
        
        try {
            const aiMessageId = generateId();
            dispatch({ type: 'ADD_MESSAGE', payload: { id: aiMessageId, author: 'ai', content: '', timestamp: new Date().toISOString(), status: 'pending' } });
            
            const response = await aiService.generateResponse(currentMessages, toolService.getAvailableTools(), (chunk) => {
                dispatch({ type: 'STREAM_TO_LAST_MESSAGE', payload: chunk });
            });

            dispatch({ type: 'UPDATE_LAST_MESSAGE', payload: { content: response.fullResponse, status: 'complete', toolCalls: response.toolCalls, metadata: response.metadata }});
            
            if (response.toolCalls && response.toolCalls.length > 0) {
                // In a real app, you might send tool results back to the model. Here we just display them.
                for (const call of response.toolCalls) {
                    const result = await toolService.executeTool(call);
                    const toolResultMessage: ChatMessage = {
                        id: generateId(),
                        author: 'tool',
                        content: result.error ? `Error: ${result.error}` : [result.result],
                        timestamp: new Date().toISOString(),
                        status: result.error ? 'error' : 'complete',
                        toolResults: [result]
                    };
                    dispatch({type: 'ADD_MESSAGE', payload: toolResultMessage});
                }
            }

        } catch (e: any) {
            setError(e);
            dispatch({ type: 'UPDATE_LAST_MESSAGE', payload: { content: "An error occurred.", status: 'error' } });
        } finally {
            setIsLoading(false);
        }
    }, [conversation, messages, toolService]);

    return { messages, isLoading, error, sendMessage, dispatch };
};


// --- UI CONTEXTS ---

export const ThemeContext = createContext({ theme: 'dark', toggleTheme: () => {} });
export const useTheme = () => useContext(ThemeContext);
export const THEMES = { dark: { bg: '#1a1a1b', surface: '#2d2d2f', text: '#e6e6e6', primary: '#8a63d2', border: '#444' }, light: { bg: '#f4f4f5', surface: '#ffffff', text: '#1a1a1b', primary: '#6d28d9', border: '#e0e0e0' } };


// --- UI COMPONENTS ---

const LoadingSpinner = React.memo(() => <div style={styles.spinner}></div>);
LoadingSpinner.displayName = 'LoadingSpinner';

const ErrorDisplay = React.memo(({ error }: { error: Error }) => <div style={styles.errorContainer}><strong>Error:</strong> {error.message}</div>);
ErrorDisplay.displayName = 'ErrorDisplay';

const CodeBlock = React.memo(({ language, code }: { language: string; code: string }) => {
    const [copied, setCopied] = useState(false);
    const handleCopy = useCallback(() => { navigator.clipboard.writeText(code); setCopied(true); setTimeout(() => setCopied(false), 2000); }, [code]);
    return (
        <div style={styles.codeBlockContainer}>
            <div style={styles.codeBlockHeader}><span>{language}</span><button onClick={handleCopy} style={styles.copyButton}>{copied ? 'Copied!' : <Icon name="copy" size={14} />}</button></div>
            <SyntaxHighlighter language={language} style={vscDarkPlus} customStyle={{ margin: 0 }}>{code}</SyntaxHighlighter>
        </div>
    );
});
CodeBlock.displayName = 'CodeBlock';

const DataTable = React.memo(({ headers, rows }: { headers: string[]; rows: any[][] }) => {
    const { theme } = useTheme(); const currentTheme = THEMES[theme];
    return (
        <div style={{ ...styles.tableContainer, borderColor: currentTheme.border }}><table style={{ ...styles.table, color: currentTheme.text }}>
            <thead><tr>{headers.map((h, i) => <th key={i} style={{...styles.tableHeader, borderBottomColor: currentTheme.border}}>{h}</th>)}</tr></thead>
            <tbody>{rows.map((row, i) => <tr key={i}>{row.map((cell, j) => <td key={j} style={{...styles.tableCell, borderBottomColor: currentTheme.border}}>{cell}</td>)}</tr>)}</tbody>
        </table></div>
    );
});
DataTable.displayName = 'DataTable';

const VegaChart = React.memo(({ spec }: { spec: any }) => <div style={styles.chartContainer}><VegaLite spec={spec} actions={false} theme={useTheme().theme === 'dark' ? 'dark' : 'default'} /></div>);
VegaChart.displayName = 'VegaChart';

const MessageContentPart = React.memo(({ part }: { part: ContentPart }) => {
    switch (part.type) {
        case 'table': return <DataTable headers={part.payload.headers} rows={part.payload.rows} />;
        case 'chart': return <VegaChart spec={part.payload.spec} />;
        case 'markdown': return <ReactMarkdown rehypePlugins={[rehypeRaw]} remarkPlugins={[remarkGfm]}>{part.payload}</ReactMarkdown>
        default: return <div>Unsupported content.</div>;
    }
});
MessageContentPart.displayName = 'MessageContentPart';

const MessageActions = React.memo(({ message, onRetry }: { message: ChatMessage, onRetry: (message: ChatMessage) => void }) => (
    <div style={styles.messageActions}>
        <button style={styles.actionButton} onClick={() => navigator.clipboard.writeText(Array.isArray(message.content) ? JSON.stringify(message.content) : message.content)}><Icon name="copy" size={14}/></button>
        {message.author === 'user' && <button style={styles.actionButton} onClick={() => onRetry(message)}><Icon name="retry" size={14}/></button>}
        {message.author === 'ai' && <>
            <button style={styles.actionButton}><Icon name="thumb_up" size={14}/></button>
            <button style={styles.actionButton}><Icon name="thumb_down" size={14}/></button>
        </>}
    </div>
));
MessageActions.displayName = 'MessageActions';

const ChatMessageBubble = React.memo(({ message, onRetry }: { message: ChatMessage, onRetry: (message: ChatMessage) => void }) => {
    const { theme } = useTheme(); const currentTheme = THEMES[theme];
    const isUser = message.author === 'user';
    const bubbleStyle = {
        ...styles.messageBubble,
        backgroundColor: isUser ? currentTheme.primary : currentTheme.surface,
        color: isUser ? '#fff' : currentTheme.text,
        alignSelf: isUser ? 'flex-end' : 'flex-start'
    };

    const renderContent = () => {
        if (Array.isArray(message.content)) return message.content.map((part, i) => <MessageContentPart key={i} part={part} />);
        return <ReactMarkdown components={{ code: ({node, inline, className, children, ...props}) => { const match = /language-(\w+)/.exec(className || ''); return !inline && match ? <CodeBlock language={match[1]} code={String(children).replace(/\n$/, '')} /> : <code className={className} {...props}>{children}</code>; }}}>{message.content}</ReactMarkdown>;
    };

    return (
        <div style={styles.messageRow}>
            {!isUser && <div style={styles.avatar}><Icon name="bot" /></div>}
            <div style={bubbleStyle}>
                <div style={styles.messageContent}>{renderContent()}{message.status === 'streaming' && <span style={styles.streamingCursor}></span>}</div>
                <MessageActions message={message} onRetry={onRetry} />
            </div>
             {isUser && <div style={styles.avatar}><Icon name="user" /></div>}
        </div>
    );
});
ChatMessageBubble.displayName = 'ChatMessageBubble';

const ExamplePrompts = React.memo(({ prompts, onSelect }: { prompts: string[]; onSelect: (p: string) => void }) => {
    const { theme } = useTheme(); const ct = THEMES[theme];
    return (
        <div style={styles.promptsContainer}>
            <h3 style={{...styles.promptsHeader, color: ct.text}}>Suggested Lines of Questioning</h3>
            <div style={styles.promptsGrid}>{prompts.map((p, i) => <button key={i} onClick={() => onSelect(p)} style={{ ...styles.promptButton, backgroundColor: ct.surface, color: ct.text, borderColor: ct.border }}>{p}</button>)}</div>
        </div>
    );
});
ExamplePrompts.displayName = 'ExamplePrompts';

const ChatInput = forwardRef<ChatInputRef, ChatInputProps>(({ onSendMessage, isSending }, ref) => {
    const [text, setText] = useState('');
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const { theme } = useTheme(); const ct = THEMES[theme];

    useImperativeHandle(ref, () => ({ focus: () => textareaRef.current?.focus(), setText: (t: string) => setText(t) }));
    useEffect(() => { const ta = textareaRef.current; if (ta) { ta.style.height = 'auto'; ta.style.height = `${ta.scrollHeight}px`; } }, [text]);

    const handleSend = () => { if (text.trim() && !isSending) { onSendMessage(text.trim()); setText(''); } };
    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } };

    return (
        <div style={{ ...styles.chatInputContainer, backgroundColor: ct.surface, borderColor: ct.border }}>
            <textarea ref={textareaRef} value={text} onChange={(e) => setText(e.target.value)} onKeyDown={handleKeyDown} disabled={isSending} placeholder={'Issue your command...'} rows={1} style={{ ...styles.chatTextarea, color: ct.text }} />
            <button onClick={handleSend} disabled={isSending} style={{ ...styles.sendButton, backgroundColor: isSending ? '#555' : ct.primary }}><Icon name="send" /></button>
        </div>
    );
});
ChatInput.displayName = 'ChatInput';

const ConversationHistorySidebar = React.memo(({ conversations, activeId, onSelect, onCreate, isOpen }: { conversations: Conversation[], activeId: string | null, onSelect: (id: string) => void, onCreate: () => void, isOpen: boolean }) => {
    const { theme } = useTheme(); const ct = THEMES[theme];
    return (
        <div style={{...styles.sidebar, backgroundColor: ct.surface, transform: isOpen ? 'translateX(0)' : 'translateX(-100%)' }}>
            <button onClick={onCreate} style={{...styles.newChatButton, color: ct.text}}>+ New Interrogation</button>
            <div style={styles.sidebarList}>
                {conversations.map(c => (
                    <div key={c.id} onClick={() => onSelect(c.id)} style={{...styles.sidebarItem, backgroundColor: c.id === activeId ? ct.primary : 'transparent', color: c.id === activeId ? '#fff' : ct.text}}>
                        <p style={styles.sidebarItemTitle}>{c.title}</p>
                        <p style={styles.sidebarItemDate}>{new Date(c.lastModified).toLocaleDateString()}</p>
                    </div>
                ))}
            </div>
        </div>
    );
});
ConversationHistorySidebar.displayName = 'ConversationHistorySidebar';

const ChatHeader = React.memo(({ title, onNew, onToggleTheme, onToggleSidebar }: { title: string; onNew: () => void; onToggleTheme: () => void; onToggleSidebar: () => void }) => {
    const { theme } = useTheme(); const ct = THEMES[theme];
    return (
        <div style={{ ...styles.chatHeader, backgroundColor: ct.surface, borderBottomColor: ct.border }}>
            <button onClick={onToggleSidebar} style={styles.headerButton}><Icon name="menu" /></button>
            <h2 style={{ ...styles.chatHeaderTitle, color: ct.text }}>{title}</h2>
            <div>
                <button onClick={onToggleTheme} style={styles.headerButton}>{theme === 'dark' ? <Icon name="light_mode" /> : <Icon name="dark_mode" />}</button>
                <button onClick={onNew} style={styles.headerButton}><Icon name="new_chat" /></button>
            </div>
        </div>
    );
});
ChatHeader.displayName = 'ChatHeader';


// --- MAIN COMPONENT ---

export const AIAdvisorView = ({ initialContext = 'None', user }: AIAdvisorViewProps) => {
    const [theme, setTheme] = useState<'light' | 'dark'>('dark');
    const { conversations, activeConversation, setActiveConversationId, createNewConversation, updateConversation } = useConversationManager();
    const { messages, isLoading, error, sendMessage } = useChatSession(activeConversation, updateConversation);
    const [isSidebarOpen, setSidebarOpen] = useState(true);
    const chatInputRef = useRef<ChatInputRef>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const themeProviderValue = useMemo(() => ({ theme, toggleTheme: () => setTheme(t => t === 'light' ? 'dark' : 'light') }), [theme]);
    
    useEffect(() => { if (!activeConversation && conversations.length > 0) setActiveConversationId(conversations[0].id); else if (!activeConversation && conversations.length === 0) createNewConversation(initialContext, 'gemini')}, [activeConversation, conversations, setActiveConversationId, createNewConversation, initialContext]);
    useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);
    
    const handleNewConversation = useCallback(() => createNewConversation(initialContext, 'gemini'), [createNewConversation, initialContext]);
    const handleRetry = useCallback((message: ChatMessage) => { if (message.author === 'user') { sendMessage(message.content as string) } }, [sendMessage]);

    return (
        <ThemeContext.Provider value={themeProviderValue}>
            <div style={{ ...styles.advisorContainer, backgroundColor: THEMES[theme].bg }}>
                <ConversationHistorySidebar conversations={conversations} activeId={activeConversation?.id || null} onSelect={setActiveConversationId} onCreate={handleNewConversation} isOpen={isSidebarOpen}/>
                <div style={styles.mainContent}>
                    <ChatHeader title={activeConversation?.title || "Quantum Advisor"} onNew={handleNewConversation} onToggleTheme={themeProviderValue.toggleTheme} onToggleSidebar={() => setSidebarOpen(!isSidebarOpen)} />
                    <div style={styles.chatArea}>
                        {messages.length === 0 && !isLoading ? (
                            <ExamplePrompts prompts={CONTEXTUAL_PROMPTS[initialContext]} onSelect={(p) => { sendMessage(p); chatInputRef.current?.focus(); }} />
                        ) : (
                            <div style={styles.messagesContainer}>
                                {messages.map(msg => <ChatMessageBubble key={msg.id} message={msg} onRetry={handleRetry} />)}
                                {isLoading && <div style={styles.messageRow}><div style={styles.avatar}><Icon name="bot" /></div><div style={{...styles.messageBubble, ...styles.loadingBubble}}><LoadingSpinner /></div></div>}
                                {error && <ErrorDisplay error={error} />}
                                <div ref={messagesEndRef} />
                            </div>
                        )}
                        <div style={styles.inputWrapper}><ChatInput ref={chatInputRef} onSendMessage={sendMessage} isSending={isLoading} /></div>
                    </div>
                </div>
            </div>
        </ThemeContext.Provider>
    );
};


// --- STYLES ---

type StyleDictionary = { [key: string]: React.CSSProperties };

export const styles: StyleDictionary = {
    advisorContainer: { display: 'flex', height: '100vh', fontFamily: 'system-ui, sans-serif', overflow: 'hidden', transition: 'background-color 0.3s' },
    mainContent: { flex: 1, display: 'flex', flexDirection: 'column', transition: 'margin-left 0.3s' },
    chatHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 20px', borderBottom: '1px solid', flexShrink: 0 },
    chatHeaderTitle: { margin: 0, fontSize: '1.2rem' },
    headerButton: { background: 'none', border: 'none', cursor: 'pointer', padding: '8px', color: 'inherit' },
    chatArea: { flexGrow: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' },
    messagesContainer: { flexGrow: 1, overflowY: 'auto', padding: '20px' },
    inputWrapper: { padding: '10px 20px 20px', flexShrink: 0, borderTop: '1px solid #444' },
    messageRow: { display: 'flex', marginBottom: '15px', gap: '10px', alignItems: 'flex-start' },
    avatar: { width: 32, height: 32, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#444', flexShrink: 0 },
    messageBubble: { maxWidth: '80%', padding: '12px 18px', borderRadius: '18px', position: 'relative', wordWrap: 'break-word', transition: 'background-color 0.3s' },
    messageContent: {},
    streamingCursor: { display: 'inline-block', width: '10px', height: '1em', backgroundColor: '#fff', animation: 'blink 1s step-end infinite', marginLeft: '4px', verticalAlign: 'text-bottom' },
    chatInputContainer: { display: 'flex', alignItems: 'center', padding: '5px', borderRadius: '8px', border: '1px solid' },
    chatTextarea: { flexGrow: 1, border: 'none', outline: 'none', resize: 'none', fontSize: '1rem', maxHeight: '200px', padding: '10px', backgroundColor: 'transparent', fontFamily: 'inherit' },
    sendButton: { border: 'none', borderRadius: '5px', color: '#fff', padding: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' },
    spinner: { border: '3px solid rgba(255,255,255,0.3)', borderTop: '3px solid #fff', borderRadius: '50%', width: '20px', height: '20px', animation: 'spin 1s linear infinite' },
    errorContainer: { padding: '10px', margin: '10px 0', backgroundColor: '#ffdddd', color: '#d8000c', borderRadius: '5px' },
    promptsContainer: { textAlign: 'center', padding: '40px 20px' },
    promptsHeader: { marginBottom: '20px' },
    promptsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '15px', maxWidth: '800px', margin: '0 auto' },
    promptButton: { padding: '15px', border: '1px solid', borderRadius: '8px', textAlign: 'left', cursor: 'pointer', transition: 'transform 0.2s, background-color 0.2s', fontSize: '0.9rem', ':hover': { transform: 'scale(1.02)' } },
    codeBlockContainer: { margin: '10px 0', borderRadius: '4px', overflow: 'hidden' },
    codeBlockHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '5px 10px', backgroundColor: '#1e1e1e', fontSize: '0.8rem', color: '#ccc' },
    copyButton: { background: 'none', border: 'none', color: '#ccc', cursor: 'pointer' },
    tableContainer: { margin: '10px 0', border: '1px solid', borderRadius: '4px', overflowX: 'auto' },
    table: { width: '100%', borderCollapse: 'collapse' },
    tableHeader: { padding: '10px', textAlign: 'left', borderBottom: '2px solid' },
    tableCell: { padding: '10px', borderBottom: '1px solid' },
    chartContainer: { padding: '10px', margin: '10px 0', backgroundColor: '#fff', borderRadius: '4px' },
    messageActions: { position: 'absolute', bottom: -12, right: 10, display: 'flex', gap: '4px', background: '#333', padding: '2px 6px', borderRadius: '10px', opacity: 0, transition: 'opacity 0.2s' },
    messageRowHover: { ' .messageActions': { opacity: 1 } }, /* This is a pseudo-selector, requires CSS-in-JS lib */
    actionButton: { background: 'none', border: 'none', color: '#ccc', cursor: 'pointer', padding: '4px' },
    sidebar: { width: '260px', borderRight: '1px solid #444', display: 'flex', flexDirection: 'column', transition: 'transform 0.3s ease-in-out' },
    newChatButton: { padding: '15px', margin: '10px', border: '1px dashed #555', borderRadius: '8px', cursor: 'pointer', textAlign: 'center', background: 'none' },
    sidebarList: { flex: 1, overflowY: 'auto' },
    sidebarItem: { padding: '10px 15px', margin: '5px 10px', borderRadius: '5px', cursor: 'pointer' },
    sidebarItemTitle: { margin: 0, fontWeight: '500', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' },
    sidebarItemDate: { margin: '4px 0 0', fontSize: '0.8rem', opacity: 0.7 },
    loadingBubble: { display: 'flex', alignItems: 'center', justifyContent: 'center' }
};

const keyframes = `
@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
@keyframes blink { from, to { opacity: 0; } 50% { opacity: 1; } }
`;
if (typeof document !== 'undefined') {
    const styleSheet = document.createElement("style");
    styleSheet.innerText = keyframes;
    document.head.appendChild(styleSheet);
}

export default AIAdvisorView;