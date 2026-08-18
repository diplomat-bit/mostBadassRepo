// REPOSITORY SOURCE: diplomat-bit/Citibank_Demo_Business_Inc_Demonstration- | PATH: diplomat-bit-Citibank_Demo_Business_Inc_Demonstration--ab2501d/components/views/platform/DemoBankKnowledgeBaseView.tsx
================================================================================

// components/views/platform/DemoBankKnowledgeBaseView.tsx
import React, { useState, useReducer, useEffect, useMemo, useCallback, useRef } from 'react';
import Card from '../../Card';
import { GoogleGenAI } from "@google/genai";

// --- EXPANDED TYPE DEFINITIONS FOR A ROBUST KNOWLEDGE BASE ---

export type UserRole = 'reader' | 'editor' | 'admin' | 'viewer';
export type ArticleStatus = 'draft' | 'pending_review' | 'published' | 'archived' | 'needs_update';
export type ContentType = 'article' | 'video' | 'interactive_tutorial';

export interface SEO_Metadata {
    title: string;
    description: string;
    keywords: string[];
}

export interface User {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    avatarUrl: string;
    lastLogin: string;
}

export interface Category {
    id: string;
    name: string;
    description: string;
    articleCount: number;
    slug: string;
    parentCategoryId?: string | null;
}

export interface ArticleVersion {
    version: number;
    content: string;
    authorId: string;
    timestamp: string;
    changeSummary: string;
}

export interface Comment {
    id: string;
    authorId: string;
    timestamp: string;
    content: string;
    replies?: Comment[];
}

export interface Article {
    id: string;
    title: string;
    slug: string;
    content: string;
    contentType: ContentType;
    videoUrl?: string;
    categoryId: string;
    authorId: string;
    status: ArticleStatus;
    tags: string[];
    createdAt: string;
    updatedAt: string;
    publishedAt?: string;
    viewCount: number;
    helpfulVotes: number;
    unhelpfulVotes: number;
    relatedArticleIds: string[];
    seoMetadata: SEO_Metadata;
    history: ArticleVersion[];
    comments: Comment[];
}

export type AppView = 'dashboard' | 'articles' | 'article_detail' | 'article_edit' | 'article_create' | 'categories' | 'analytics' | 'settings' | 'user_management';

export interface AppState {
    articles: Article[];
    categories: Category[];
    users: User[];
    currentUser: User | null;
    isLoading: boolean;
    error: string | null;
    currentView: AppView;
    selectedArticleId: string | null;
    selectedCategoryId: string | null;
    notifications: AppNotification[];
    searchTerm: string;
    filters: Record<string, any>;
}

export interface AppNotification {
    id: number;
    message: string;
    type: 'success' | 'error' | 'info' | 'warning';
}


// --- MASSIVE MOCK DATA GENERATION FOR A PRODUCTION-SCALE APPLICATION ---

const MOCK_USERS: User[] = [
    { id: 'user-1', name: 'Alice Johnson', email: 'alice.j@demobank.com', role: 'admin', avatarUrl: `https://i.pravatar.cc/150?u=user-1`, lastLogin: new Date().toISOString() },
    { id: 'user-2', name: 'Bob Williams', email: 'bob.w@demobank.com', role: 'editor', avatarUrl: `https://i.pravatar.cc/150?u=user-2`, lastLogin: new Date().toISOString() },
    { id: 'user-3', name: 'Charlie Brown', email: 'charlie.b@demobank.com', role: 'editor', avatarUrl: `https://i.pravatar.cc/150?u=user-3`, lastLogin: new Date().toISOString() },
    { id: 'user-4', name: 'Diana Prince', email: 'diana.p@demobank.com', role: 'reader', avatarUrl: `https://i.pravatar.cc/150?u=user-4`, lastLogin: new Date().toISOString() },
    { id: 'user-5', name: 'Ethan Hunt', email: 'ethan.h@demobank.com', role: 'reader', avatarUrl: `https://i.pravatar.cc/150?u=user-5`, lastLogin: new Date().toISOString() },
    { id: 'user-6', name: 'Fiona Glenanne', email: 'fiona.g@demobank.com', role: 'editor', avatarUrl: `https://i.pravatar.cc/150?u=user-6`, lastLogin: new Date().toISOString() },
    { id: 'user-7', name: 'George Costanza', email: 'george.c@demobank.com', role: 'viewer', avatarUrl: `https://i.pravatar.cc/150?u=user-7`, lastLogin: new Date().toISOString() },
];

const MOCK_CATEGORIES: Category[] = [
    { id: 'cat-1', name: 'Account Management', description: 'Everything about managing your Demo Bank account.', articleCount: 10, slug: 'account-management' },
    { id: 'cat-2', name: 'Payments & Transfers', description: 'Help with sending and receiving money.', articleCount: 8, slug: 'payments-transfers' },
    { id: 'cat-3', name: 'Security & Fraud', description: 'Keeping your account secure.', articleCount: 7, slug: 'security-fraud' },
    { id: 'cat-4', name: 'Mobile & Online Banking', description: 'Guides for our digital platforms.', articleCount: 5, slug: 'mobile-online-banking' },
    { id: 'cat-5', name: 'Loans & Credit', description: 'Information on mortgages, personal loans, and credit cards.', articleCount: 4, slug: 'loans-credit' },
    { id: 'cat-6', name: 'Investments', description: 'Guides to our investment products and services.', articleCount: 3, slug: 'investments' },
    { id: 'cat-7', name: 'Business Banking', description: 'Features and services for our business clients.', articleCount: 2, slug: 'business-banking' },
    { id: 'cat-8', name: 'Uncategorized', description: 'Miscellaneous articles.', articleCount: 0, slug: 'uncategorized' },
];

const generateSlug = (title: string): string => title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');

const createMockArticle = (id: number, title: string, categoryId: string, authorId: string, status: ArticleStatus, content: string, tags: string[]): Article => {
    const createdAt = new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString();
    const updatedAt = new Date(new Date(createdAt).getTime() + Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString();
    const publishedAt = status === 'published' ? updatedAt : undefined;
    return {
        id: `article-${id}`,
        title,
        slug: generateSlug(title),
        categoryId,
        authorId,
        status,
        content,
        tags,
        contentType: 'article',
        createdAt,
        updatedAt,
        publishedAt,
        viewCount: Math.floor(Math.random() * 25000),
        helpfulVotes: Math.floor(Math.random() * 1500),
        unhelpfulVotes: Math.floor(Math.random() * 100),
        relatedArticleIds: [], // will be populated later
        seoMetadata: {
            title: `${title} | Demo Bank Help Center`,
            description: `Learn ${title.toLowerCase()} with Demo Bank's official guide.`,
            keywords: [...tags, 'Demo Bank', 'help'],
        },
        history: [
            { version: 1, content, authorId, timestamp: createdAt, changeSummary: 'Initial draft created.' }
        ],
        comments: [
            {
                id: `comment-${id}-1`, authorId: MOCK_USERS[3].id,
                timestamp: new Date(new Date(createdAt).getTime() + Math.random() * 5 * 24 * 60 * 60 * 1000).toISOString(),
                content: 'This was really helpful, thanks!',
                replies: [
                     {
                        id: `comment-${id}-1-1`, authorId: MOCK_USERS[1].id,
                        timestamp: new Date(new Date(createdAt).getTime() + Math.random() * 6 * 24 * 60 * 60 * 1000).toISOString(),
                        content: 'Glad we could help!',
                     }
                ]
            },
            {
                id: `comment-${id}-2`, authorId: MOCK_USERS[4].id,
                timestamp: new Date(new Date(createdAt).getTime() + Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
                content: 'I still have a question about step 3. Can you clarify?',
            }
        ]
    };
};

const MOCK_ARTICLES: Article[] = [
    createMockArticle(1, "How to Reset Your Password", 'cat-1', 'user-2', 'published', `# How to Reset Your Password\n\nIf you've forgotten your password, don't worry! You can easily reset it by following these steps.\n\n## Step-by-Step Guide\n\n1.  **Navigate to the Login Page**: Open the Demo Bank app or visit our website and go to the login screen.\n2.  **Click 'Forgot Password'**: Look for a link that says "Forgot Password?" or "Reset Password" and click on it.\n3.  **Enter Your Email Address**: Provide the email address associated with your Demo Bank account. We will send a password reset link to this email.\n4.  **Check Your Email**: Open your email inbox and find the email from Demo Bank. If you don't see it, check your spam or junk folder.\n5.  **Follow the Link**: Click on the password reset link in the email. This will take you to a secure page to create a new password.\n6.  **Create a New Password**: Enter a new, strong password. Make sure it meets our security requirements (e.g., at least 12 characters, includes uppercase, lowercase, numbers, and symbols).\n7.  **Confirm Your New Password**: Re-enter your new password to confirm it.\n8.  **Login**: You can now log in with your new password!\n\n## Still Having Trouble?\n\nIf you're still unable to reset your password, please contact our support team at 1-800-DEMO-BANK.`, ['password', 'reset', 'account', 'security']),
    createMockArticle(2, "Setting Up Two-Factor Authentication (2FA)", 'cat-3', 'user-1', 'published', `# Setting Up Two-Factor Authentication (2FA)\n\nTwo-Factor Authentication adds an extra layer of security to your account.\n\n## Instructions\n\n1.  Log in to your account.\n2.  Go to **Settings > Security**.\n3.  Find the **Two-Factor Authentication** section and click 'Enable'.\n4.  Follow the on-screen instructions to link an authenticator app (like Google Authenticator) or your phone number.\n5.  Verify the setup by entering the code provided by your authenticator app or SMS.\n6.  Save your recovery codes in a safe place. You'll need these if you lose access to your 2FA device.`, ['2fa', 'security', 'authentication', 'mfa']),
    createMockArticle(3, "How to Send a Wire Transfer", 'cat-2', 'user-3', 'published', `# How to Send a Wire Transfer\n\nFollow these steps to securely send a domestic or international wire transfer.\n\n## Before You Begin\n\n- Have the recipient's full name, address, and bank account details ready.\n- For international wires, you will need the bank's SWIFT/BIC code and IBAN.\n\n## Steps\n\n1.  From your dashboard, select **Transfers > Wire Transfer**.\n2.  Choose the account you want to send funds from.\n3.  Enter the recipient's bank details, including their account number, routing number, and bank address.\n4.  Enter the amount you wish to send and select the currency.\n5.  Review the details, exchange rate, and associated fees.\n6.  Confirm the transfer. You may need to verify your identity with 2FA.`, ['wire', 'transfer', 'payments', 'international']),
    createMockArticle(4, "Understanding Your Monthly Statement", 'cat-1', 'user-2', 'pending_review', `# Understanding Your Monthly Statement\n\nThis article is a draft and needs review. It will explain all sections of our new statement format, including summary, transaction details, and fee breakdowns.`, ['statement', 'billing', 'account']),
    createMockArticle(5, "Disputing a Transaction", 'cat-2', 'user-3', 'draft', `# Disputing a Transaction\n\n*Initial draft content goes here. Needs sections on what constitutes a valid dispute, the process, and timelines.*`, ['dispute', 'fraud', 'transaction', 'chargeback']),
    createMockArticle(6, "How to Deposit a Check with the Mobile App", 'cat-4', 'user-1', 'published', `# Mobile Check Deposit\n\n1.  Open the Demo Bank mobile app and log in.\n2.  Tap on **Deposits** in the bottom menu.\n3.  Select the account to deposit into.\n4.  Enter the check amount.\n5.  Endorse the back of the check with "For Mobile Deposit at Demo Bank Only" and your signature.\n6.  Take a clear photo of the front and back of the check against a dark background.\n7.  Confirm the deposit. You'll receive a confirmation, and funds will be available according to our funds availability policy.`, ['mobile', 'deposit', 'check', 'app']),
    createMockArticle(7, "Reporting a Lost or Stolen Card", 'cat-3', 'user-1', 'published', `# Reporting a Lost or Stolen Card\n\nIf your card is lost or stolen, it's crucial to act quickly to protect your account.\n\n## Immediate Steps\n1.  **Freeze Your Card**: Log into the Demo Bank app or website immediately. Navigate to 'Card Services' and select the option to 'Freeze' or 'Lock' your card. This will prevent any new transactions.\n2.  **Contact Us**: Call our 24/7 support line at 1-800-DEMO-BANK to report the card as lost or stolen.\n3.  **Review Transactions**: Check your recent transactions for any unauthorized activity. Report any suspicious charges to the support agent.\n4.  **Order a New Card**: A support agent will help you order a replacement card, which will be mailed to your address on file.`, ['card', 'lost', 'stolen', 'fraud', 'security']),
    createMockArticle(8, "Updating Your Contact Information", 'cat-1', 'user-2', 'archived', `# Updating Your Contact Information (Old Version)\n\nThis article is outdated. Please see the new version for updated instructions on changing your address, phone number, and email.`, ['profile', 'contact', 'update', 'address']),
    createMockArticle(9, "Understanding Overdraft Protection", 'cat-1', 'user-6', 'published', `# Understanding Overdraft Protection\n\nOverdraft Protection can help you avoid declined transactions if you don't have enough money in your account.\n\n## How it Works\n\nWhen you opt-in, we can link your checking account to another Demo Bank account (like a savings account or credit card). If you make a transaction that overdraws your checking account, we will automatically transfer funds from the linked account to cover the difference. Fees may apply.`, ['overdraft', 'fees', 'protection', 'account']),
    createMockArticle(10, "How to Apply for a Personal Loan", 'cat-5', 'user-3', 'published', `# Applying for a Personal Loan\n\nOur online application makes it easy to apply for a personal loan.\n\n1. Visit our **Loans** section on the website.\n2. Select **Personal Loans** and click 'Apply Now'.\n3. Fill out the application with your personal, employment, and financial information.\n4. Submit your application for review. You'll typically receive a decision within minutes.`, ['loan', 'personal loan', 'application', 'credit']),
    createMockArticle(11, "What is a Roth IRA?", 'cat-6', 'user-1', 'needs_update', `# What is a Roth IRA?\n\nAn individual retirement account (IRA) that offers tax-free growth and tax-free withdrawals in retirement. This article needs to be updated with the latest contribution limits.`, ['investing', 'retirement', 'ira', 'roth ira', '401k']),
    createMockArticle(12, "Setting up Bill Pay", 'cat-2', 'user-2', 'published', `# Setting up Bill Pay\n\nAutomate your payments and never miss a bill again.\n\n## Adding a Payee\n1. Go to **Payments > Bill Pay**.\n2. Click 'Add a Payee'.\n3. Search for the company or enter their details manually.\n4. Link your account with the payee.\n\n## Scheduling a Payment\n1. Select a payee.\n2. Enter the amount and payment date.\n3. Choose to make it a one-time or recurring payment.\n4. Confirm the payment.`, ['bill pay', 'payments', 'automatic', 'e-bill']),
    // ... Add many more articles to reach a large number
];

// Populate relatedArticleIds
MOCK_ARTICLES.forEach(article => {
    const related = MOCK_ARTICLES.filter(a =>
        a.id !== article.id && a.categoryId === article.categoryId
    );
    article.relatedArticleIds = related.slice(0, 3).map(a => a.id);
});

// --- ADVANCED STATE MANAGEMENT (useReducer) ---

type Action =
    | { type: 'SET_VIEW'; payload: AppView }
    | { type: 'START_LOADING' }
    | { type: 'DATA_FETCH_SUCCESS'; payload: { articles: Article[]; categories: Category[]; users: User[]; currentUser: User } }
    | { type: 'FETCH_FAILURE'; payload: string }
    | { type: 'SELECT_ARTICLE'; payload: string | null }
    | { type: 'UPDATE_ARTICLE'; payload: Article }
    | { type: 'CREATE_ARTICLE'; payload: Article }
    | { type: 'DELETE_ARTICLE'; payload: string }
    | { type: 'ADD_NOTIFICATION'; payload: Omit<AppNotification, 'id'> }
    | { type: 'REMOVE_NOTIFICATION'; payload: number }
    | { type: 'UPDATE_FILTERS', payload: Record<string, any> }
    | { type: 'SET_SEARCH_TERM', payload: string };

const initialState: AppState = {
    articles: [],
    categories: [],
    users: [],
    currentUser: null,
    isLoading: true,
    error: null,
    currentView: 'dashboard',
    selectedArticleId: null,
    selectedCategoryId: null,
    notifications: [],
    searchTerm: '',
    filters: {},
};

function knowledgeBaseReducer(state: AppState, action: Action): AppState {
    switch (action.type) {
        case 'SET_VIEW':
            return { ...state, currentView: action.payload, selectedArticleId: action.payload === 'articles' || action.payload === 'dashboard' ? null : state.selectedArticleId };
        case 'START_LOADING':
            return { ...state, isLoading: true, error: null };
        case 'DATA_FETCH_SUCCESS':
            return { ...state, isLoading: false, ...action.payload };
        case 'FETCH_FAILURE':
            return { ...state, isLoading: false, error: action.payload };
        case 'SELECT_ARTICLE':
            return { ...state, selectedArticleId: action.payload, currentView: action.payload ? 'article_detail' : 'articles' };
        case 'UPDATE_ARTICLE':
            return { ...state, articles: state.articles.map(a => a.id === action.payload.id ? action.payload : a) };
        case 'CREATE_ARTICLE':
             const newCategories = state.categories.map(c => c.id === action.payload.categoryId ? { ...c, articleCount: c.articleCount + 1 } : c);
            return { ...state, articles: [action.payload, ...state.articles], categories: newCategories };
        case 'DELETE_ARTICLE':
             const articleToDelete = state.articles.find(a => a.id === action.payload);
             const updatedCategories = state.categories.map(c => (c.id === articleToDelete?.categoryId && c.articleCount > 0) ? { ...c, articleCount: c.articleCount - 1 } : c);
             return { ...state, articles: state.articles.filter(a => a.id !== action.payload), categories: updatedCategories };
        case 'ADD_NOTIFICATION':
            return { ...state, notifications: [...state.notifications, { ...action.payload, id: Date.now() }] };
        case 'REMOVE_NOTIFICATION':
            return { ...state, notifications: state.notifications.filter(n => n.id !== action.payload) };
        case 'UPDATE_FILTERS':
            return { ...state, filters: { ...state.filters, ...action.payload }};
        case 'SET_SEARCH_TERM':
            return { ...state, searchTerm: action.payload };
        default:
            return state;
    }
}


// --- PRODUCTION-GRADE MOCK API SERVICE LAYER ---

const apiDelay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const fetchKnowledgeBaseData = async (): Promise<{ articles: Article[]; categories: Category[]; users: User[]; currentUser: User }> => {
    console.log("API: Fetching all knowledge base data...");
    await apiDelay(1000);
    const currentUser = MOCK_USERS[0];
    return { articles: MOCK_ARTICLES, categories: MOCK_CATEGORIES, users: MOCK_USERS, currentUser };
};

export const saveArticle = async (article: Omit<Article, 'id' | 'createdAt' | 'slug'> & { id?: string }): Promise<Article> => {
    console.log(`API: Saving article "${article.title}"...`);
    await apiDelay(750);
    if (article.id) { // Update
        const updatedArticle = { ...article, updatedAt: new Date().toISOString() } as Article;
        const index = MOCK_ARTICLES.findIndex(a => a.id === article.id);
        if (index === -1) throw new Error("Article not found");
        MOCK_ARTICLES[index] = updatedArticle;
        return updatedArticle;
    } else { // Create
        const newArticle: Article = {
            ...article,
            id: `article-${Date.now()}`,
            slug: generateSlug(article.title),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            viewCount: 0, helpfulVotes: 0, unhelpfulVotes: 0, history: [], comments: [],
        };
        MOCK_ARTICLES.unshift(newArticle);
        return newArticle;
    }
};

export const deleteArticle = async (articleId: string): Promise<{ success: boolean }> => {
    console.log(`API: Deleting article with ID "${articleId}"...`);
    await apiDelay(500);
    const index = MOCK_ARTICLES.findIndex(a => a.id === articleId);
    if (index > -1) {
        MOCK_ARTICLES.splice(index, 1);
        return { success: true };
    }
    return { success: false };
};

export const getAiSummary = async (content: string): Promise<string> => {
    console.log("AI API: Generating summary...");
    await apiDelay(1500);
    // In a real app, this would be an API call to Gemini/ChatGPT.
    // Simulating a response.
    const firstParagraph = content.split('\n').find(line => line.length > 50) || "This article explains key concepts.";
    return `**AI Summary:** ${firstParagraph.substring(0, 200)}... Key topics include setup, configuration, and troubleshooting common issues. For detailed steps, please refer to the full article.`;
};


// --- UTILITY & HELPER FUNCTIONS ---

export const formatDate = (isoString?: string): string => {
    if (!isoString) return 'N/A';
    return new Date(isoString).toLocaleString(undefined, {
        year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit'
    });
};

export const useNotifications = (dispatch: React.Dispatch<Action>) => {
    const addNotification = useCallback((message: string, type: AppNotification['type'], duration = 5000) => {
        const notification: Omit<AppNotification, 'id'> = { message, type };
        dispatch({ type: 'ADD_NOTIFICATION', payload: notification });
        setTimeout(() => {
            // This needs a way to get the ID back, so we'll handle removal in the component
        }, duration);
    }, [dispatch]);

    return { addNotification };
};

// --- UI COMPONENTS ---

export const StatusBadge: React.FC<{ status: ArticleStatus }> = ({ status }) => {
    const baseClasses = "px-2 py-1 text-xs font-semibold rounded-full";
    const statusMap: Record<ArticleStatus, string> = {
        published: "bg-green-500/20 text-green-300",
        pending_review: "bg-yellow-500/20 text-yellow-300",
        draft: "bg-gray-500/20 text-gray-300",
        archived: "bg-red-500/20 text-red-300",
        needs_update: "bg-purple-500/20 text-purple-300",
    };
    const statusText = status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
    return <span className={`${baseClasses} ${statusMap[status]}`}>{statusText}</span>;
};

export const UserDisplay: React.FC<{ userId: string; users: User[] }> = ({ userId, users }) => {
    const user = users.find(u => u.id === userId);
    if (!user) return <div className="text-gray-400">Unknown User</div>;
    return (
        <div className="flex items-center space-x-2 group">
            <img src={user.avatarUrl} alt={user.name} className="w-6 h-6 rounded-full" />
            <span className="text-sm text-gray-300 group-hover:text-white">{user.name}</span>
        </div>
    );
};

export const ArticleFilterBar: React.FC<{ onFilterChange: (filters: any) => void; categories: Category[]; dispatch: React.Dispatch<Action> }> = ({ onFilterChange, categories, dispatch }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('');

    useEffect(() => {
        const handler = setTimeout(() => {
            dispatch({type: 'SET_SEARCH_TERM', payload: searchTerm});
            onFilterChange({ status: statusFilter, categoryId: categoryFilter });
        }, 300);
        return () => clearTimeout(handler);
    }, [searchTerm, statusFilter, categoryFilter, onFilterChange, dispatch]);

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-800/50 rounded-lg">
            <input type="text" placeholder="Search articles..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="col-span-1 md:col-span-1 bg-gray-700/50 p-2 rounded text-white focus:ring-cyan-500 focus:border-cyan-500" />
            <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="col-span-1 md:col-span-1 bg-gray-700/50 p-2 rounded text-white focus:ring-cyan-500 focus:border-cyan-500">
                <option value="">All Statuses</option>
                {['published', 'pending_review', 'draft', 'needs_update', 'archived'].map(s => <option key={s} value={s}>{s.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}</option>)}
            </select>
            <select value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)} className="col-span-1 md:col-span-1 bg-gray-700/50 p-2 rounded text-white focus:ring-cyan-500 focus:border-cyan-500">
                <option value="">All Categories</option>
                {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
            </select>
        </div>
    );
};

export const ArticleListView: React.FC<{ state: AppState; dispatch: React.Dispatch<Action>; }> = ({ state, dispatch }) => {
    const { articles, categories, users, filters, searchTerm } = state;
    const [sortBy, setSortBy] = useState<{ key: keyof Article; order: 'asc' | 'desc' }>({ key: 'updatedAt', order: 'desc' });

    const filteredAndSortedArticles = useMemo(() => {
        let filtered = [...articles];

        if (searchTerm) {
            const lowercasedTerm = searchTerm.toLowerCase();
            filtered = filtered.filter(a =>
                a.title.toLowerCase().includes(lowercasedTerm) ||
                a.content.toLowerCase().includes(lowercasedTerm) ||
                a.tags.some(t => t.toLowerCase().includes(lowercasedTerm))
            );
        }
        if (filters.status) {
            filtered = filtered.filter(a => a.status === filters.status);
        }
        if (filters.categoryId) {
            filtered = filtered.filter(a => a.categoryId === filters.categoryId);
        }

        return filtered.sort((a, b) => {
            const valA = a[sortBy.key];
            const valB = b[sortBy.key];
            if (valA < valB) return sortBy.order === 'asc' ? -1 : 1;
            if (valA > valB) return sortBy.order === 'asc' ? 1 : -1;
            return 0;
        });
    }, [articles, filters, sortBy, searchTerm]);
    
    const handleSort = (key: keyof Article) => {
        setSortBy(prev => ({ key, order: prev.key === key && prev.order === 'desc' ? 'asc' : 'desc' }));
    };
    
    const SortableHeader: React.FC<{ sortKey: keyof Article; children: React.ReactNode }> = ({ sortKey, children }) => (
         <th onClick={() => handleSort(sortKey)} className="p-3 text-left text-sm font-semibold text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-700">
             <div className="flex items-center">{children}{sortBy.key === sortKey && <span className="ml-2">{sortBy.order === 'desc' ? '↓' : '↑'}</span>}</div>
         </th>
    );

    return (
        <Card title="Knowledge Base Articles">
            <ArticleFilterBar onFilterChange={(f) => dispatch({type: 'UPDATE_FILTERS', payload: f})} categories={categories} dispatch={dispatch} />
            <div className="mt-4 overflow-x-auto">
                <table className="min-w-full bg-gray-900/50 rounded-lg">
                    <thead className="bg-gray-800/70">
                        <tr>
                            <SortableHeader sortKey="title">Title</SortableHeader>
                            <SortableHeader sortKey="status">Status</SortableHeader>
                            <th className="p-3 text-left text-sm font-semibold text-gray-300 uppercase tracking-wider">Category</th>
                            <SortableHeader sortKey="updatedAt">Last Updated</SortableHeader>
                            <SortableHeader sortKey="viewCount">Views</SortableHeader>
                            <th className="p-3 text-left text-sm font-semibold text-gray-300 uppercase tracking-wider">Author</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-700">
                        {filteredAndSortedArticles.map(article => (
                            <tr key={article.id} className="hover:bg-gray-800/60 cursor-pointer" onClick={() => dispatch({ type: 'SELECT_ARTICLE', payload: article.id })}>
                                <td className="p-3 text-white">{article.title}</td>
                                <td className="p-3"><StatusBadge status={article.status} /></td>
                                <td className="p-3 text-gray-400">{categories.find(c => c.id === article.categoryId)?.name || 'N/A'}</td>
                                <td className="p-3 text-gray-400">{formatDate(article.updatedAt)}</td>
                                <td className="p-3 text-gray-400">{article.viewCount.toLocaleString()}</td>
                                <td className="p-3"><UserDisplay userId={article.authorId} users={users} /></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                 {filteredAndSortedArticles.length === 0 && <p className="text-center text-gray-400 p-8">No articles match your criteria.</p>}
            </div>
        </Card>
    );
};

export const ArticleDetailView: React.FC<{
    article: Article; category: Category; users: User[]; currentUser: User; dispatch: React.Dispatch<Action>;
    addNotification: (message: string, type: AppNotification['type']) => void;
}> = ({ article, category, users, currentUser, dispatch, addNotification }) => {
    const [isDeleting, setIsDeleting] = useState(false);
    const [summary, setSummary] = useState('');
    const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);

    const handleDelete = async () => {
        if (window.confirm(`Are you sure you want to delete "${article.title}"? This action cannot be undone.`)) {
            setIsDeleting(true);
            try {
                await deleteArticle(article.id);
                dispatch({ type: 'DELETE_ARTICLE', payload: article.id });
                addNotification('Article deleted successfully.', 'success');
                dispatch({ type: 'SELECT_ARTICLE', payload: null });
            } catch (error) {
                addNotification('Failed to delete article.', 'error');
                setIsDeleting(false);
            }
        }
    };
    
    const handleGenerateSummary = useCallback(async () => {
        setIsGeneratingSummary(true);
        try {
            const result = await getAiSummary(article.content);
            setSummary(result);
        } catch (error) {
            setSummary('Error generating summary.');
        } finally {
            setIsGeneratingSummary(false);
        }
    }, [article.content]);
    
    return (
        <div className="space-y-6">
            <div>
                <button onClick={() => dispatch({ type: 'SET_VIEW', payload: 'articles' })} className="text-cyan-400 hover:text-cyan-300 mb-2">&larr; Back to Articles</button>
                <div className="flex justify-between items-start">
                    <div>
                        <h2 className="text-3xl font-bold text-white tracking-wider">{article.title}</h2>
                        <div className="flex items-center space-x-4 mt-2 text-gray-400 text-sm">
                            <span>Category: <span className="font-semibold text-cyan-400">{category.name}</span></span><span>|</span>
                            <span>Author: <span className="font-semibold text-gray-200">{users.find(u => u.id === article.authorId)?.name}</span></span><span>|</span>
                            <span>Last Updated: {formatDate(article.updatedAt)}</span>
                        </div>
                    </div>
                    <div className="flex space-x-2">
                        {(currentUser.role === 'admin' || currentUser.role === 'editor') && <button onClick={() => dispatch({ type: 'SET_VIEW', payload: 'article_edit' })} className="py-2 px-4 bg-cyan-600 hover:bg-cyan-700 rounded transition-colors">Edit</button>}
                        {currentUser.role === 'admin' && <button onClick={handleDelete} disabled={isDeleting} className="py-2 px-4 bg-red-600 hover:bg-red-700 rounded transition-colors disabled:opacity-50">{isDeleting ? 'Deleting...' : 'Delete'}</button>}
                    </div>
                </div>
            </div>

            <Card>
                <div className="flex justify-end">
                    <button onClick={handleGenerateSummary} disabled={isGeneratingSummary} className="text-sm py-1 px-3 bg-indigo-600 hover:bg-indigo-700 rounded disabled:opacity-50">
                        {isGeneratingSummary ? 'Summarizing...' : '✨ AI Summary'}
                    </button>
                </div>
                {summary && <div className="mt-4 p-4 bg-gray-800/70 rounded-lg text-gray-300 prose prose-invert max-w-none">{summary}</div>}
                <div className="prose prose-invert prose-lg max-w-none text-gray-300 whitespace-pre-line mt-4">
                   {article.content}
                </div>
            </Card>

            <Card title="Version History">
                 <ul className="space-y-2">
                    {article.history.map(v => (
                        <li key={v.version} className="text-sm p-2 bg-gray-800/50 rounded">
                            <span className="font-bold">Version {v.version}</span> by <UserDisplay userId={v.authorId} users={users} /> on {formatDate(v.timestamp)}
                            <p className="text-gray-400 italic mt-1">"{v.changeSummary}"</p>
                        </li>
                    ))}
                 </ul>
            </Card>

            <Card title="Comments">
                <div className="space-y-4">
                    {article.comments.map(c => (
                        <div key={c.id} className="p-3 bg-gray-800/50 rounded">
                            <div className="flex items-center justify-between mb-1"><UserDisplay userId={c.authorId} users={users} /><span className="text-xs text-gray-500">{formatDate(c.timestamp)}</span></div>
                            <p className="text-gray-300">{c.content}</p>
                        </div>
                    ))}
                </div>
            </Card>
        </div>
    );
};

export const AiArticleDrafter: React.FC<{
    onDraftGenerated: (title: string, content: string) => void; initialPrompt?: string;
}> = ({ onDraftGenerated, initialPrompt = "How to reset your password" }) => {
    const [prompt, setPrompt] = useState(initialPrompt);
    const [generatedArticle, setGeneratedArticle] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleGenerate = async () => {
        setIsLoading(true); setGeneratedArticle('');
        try {
            const apiKey = process.env.REACT_APP_GEMINI_API_KEY || process.env.API_KEY;
            if (!apiKey) { throw new Error("API key is not configured."); }
            const ai = new GoogleGenAI({ apiKey });
            const fullPrompt = `You are a helpful technical writer for "Demo Bank". Write a simple, clear knowledge base article with step-by-step instructions for the topic: "${prompt}". The article should be ready to be published for customers. Use markdown for formatting, including a main header (H1), sub-headers (H2), and numbered or bulleted lists where appropriate.`;
            const response = await ai.models.generateContent({ model: 'gemini-pro', contents: fullPrompt });
            const text = response.text ?? "No content generated.";
            setGeneratedArticle(text);
            if (!text.startsWith('Error:')) {
                onDraftGenerated(prompt, text);
            }
        } catch (error) {
            console.error("AI Generation Error:", error);
            const errorMessage = "Error: Could not generate article draft. Please check your API key and network connection.";
            setGeneratedArticle(errorMessage);
            onDraftGenerated(prompt, errorMessage);
        } finally { setIsLoading(false); }
    };

    return (
        <Card title="✨ AI Article Drafter">
            <p className="text-gray-400 mb-4">Enter a topic for a help article, and the AI will write a first draft.</p>
            <div className="flex space-x-2">
                <input type="text" value={prompt} onChange={e => setPrompt(e.target.value)} className="w-full bg-gray-700/50 p-3 rounded text-white focus:ring-cyan-500 focus:border-cyan-500" />
                <button onClick={handleGenerate} disabled={isLoading || !prompt} className="py-2 px-4 bg-cyan-600 hover:bg-cyan-700 rounded disabled:opacity-50 transition-colors">
                    {isLoading ? 'Drafting...' : 'Generate'}
                </button>
            </div>
            {isLoading && <div className="mt-4 text-center text-gray-400">The AI is thinking...</div>}
        </Card>
    );
};

export const ArticleEditorView: React.FC<{
    article?: Article; categories: Category[]; currentUser: User; dispatch: React.Dispatch<Action>;
    addNotification: (message: string, type: AppNotification['type']) => void;
}> = ({ article, categories, currentUser, dispatch, addNotification }) => {
    const [title, setTitle] = useState(article?.title || '');
    const [content, setContent] = useState(article?.content || '');
    const [categoryId, setCategoryId] = useState(article?.categoryId || categories[0]?.id || '');
    const [status, setStatus] = useState<ArticleStatus>(article?.status || 'draft');
    const [tags, setTags] = useState(article?.tags.join(', ') || '');
    const [isSaving, setIsSaving] = useState(false);

    const handleAiDraft = useCallback((draftTitle: string, draftContent: string) => {
        setTitle(draftTitle);
        setContent(draftContent);
        addNotification("AI draft has been populated into the editor.", 'info');
    }, [addNotification]);
    
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault(); setIsSaving(true);
        const articleData = {
            ...(article || { viewCount: 0, helpfulVotes: 0, unhelpfulVotes: 0, history: [], comments: [], relatedArticleIds: [], seoMetadata: { title: '', description: '', keywords: [] }, contentType: 'article' as ContentType }),
            id: article?.id, title, content, categoryId, status, tags: tags.split(',').map(t => t.trim()).filter(Boolean), authorId: article?.authorId || currentUser.id,
        };
        const newVersion: ArticleVersion = { version: (article?.history.length || 0) + 1, content, authorId: currentUser.id, timestamp: new Date().toISOString(), changeSummary: article ? 'Content updated' : 'Initial version' };
        articleData.history = article ? [...article.history, newVersion] : [newVersion];
        
        try {
            const savedArticle = await saveArticle(articleData);
            if (article) dispatch({ type: 'UPDATE_ARTICLE', payload: savedArticle });
            else dispatch({ type: 'CREATE_ARTICLE', payload: savedArticle });
            addNotification(`Article "${savedArticle.title}" saved successfully!`, 'success');
            dispatch({ type: 'SELECT_ARTICLE', payload: savedArticle.id });
        } catch(error) {
             addNotification('Error saving article.', 'error');
             setIsSaving(false);
        }
    };
    
    return (
        <div className="space-y-6">
            <button onClick={() => dispatch({ type: 'SET_VIEW', payload: article ? 'article_detail' : 'articles' })} className="text-cyan-400 hover:text-cyan-300 mb-2">&larr; Cancel</button>
            <h2 className="text-3xl font-bold text-white tracking-wider">{article ? 'Edit Article' : 'Create New Article'}</h2>
            {!article && <AiArticleDrafter onDraftGenerated={handleAiDraft} />}
            <form onSubmit={handleSubmit} className="space-y-6">
                <Card title="Article Content">
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-1">Title</label>
                            <input id="title" type="text" value={title} onChange={e => setTitle(e.target.value)} required className="w-full bg-gray-700/50 p-3 rounded text-white focus:ring-cyan-500 focus:border-cyan-500" />
                        </div>
                        <div>
                            <label htmlFor="content" className="block text-sm font-medium text-gray-300 mb-1">Content (Markdown supported)</label>
                            <textarea id="content" value={content} onChange={e => setContent(e.target.value)} required rows={20} className="w-full bg-gray-700/50 p-3 rounded text-white font-mono text-sm focus:ring-cyan-500 focus:border-cyan-500" />
                        </div>
                    </div>
                </Card>
                <Card title="Metadata & Publishing">
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                         <div>
                            <label htmlFor="category" className="block text-sm font-medium text-gray-300 mb-1">Category</label>
                             <select id="category" value={categoryId} onChange={e => setCategoryId(e.target.value)} className="w-full bg-gray-700/50 p-3 rounded text-white focus:ring-cyan-500 focus:border-cyan-500">
                                {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                            </select>
                         </div>
                          <div>
                            <label htmlFor="status" className="block text-sm font-medium text-gray-300 mb-1">Status</label>
                             <select id="status" value={status} onChange={e => setStatus(e.target.value as ArticleStatus)} className="w-full bg-gray-700/50 p-3 rounded text-white focus:ring-cyan-500 focus:border-cyan-500">
                                {Object.keys(statusMap).map(s => <option key={s} value={s}>{s.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}</option>)}
                            </select>
                         </div>
                         <div className="col-span-1 md:col-span-2">
                             <label htmlFor="tags" className="block text-sm font-medium text-gray-300 mb-1">Tags (comma-separated)</label>
                            <input id="tags" type="text" value={tags} onChange={e => setTags(e.target.value)} className="w-full bg-gray-700/50 p-3 rounded text-white focus:ring-cyan-500 focus:border-cyan-500" />
                         </div>
                     </div>
                </Card>
                <div className="flex justify-end">
                    <button type="submit" disabled={isSaving} className="py-2 px-6 bg-cyan-600 hover:bg-cyan-700 rounded disabled:opacity-50 transition-colors">{isSaving ? 'Saving...' : 'Save Article'}</button>
                </div>
            </form>
        </div>
    );
};
const statusMap: Record<ArticleStatus, string> = { published: "Published", pending_review: "Pending Review", draft: "Draft", archived: "Archived", needs_update: "Needs Update" };


export const DashboardView: React.FC<{ state: AppState, dispatch: React.Dispatch<Action> }> = ({ state, dispatch }) => {
    const { articles, categories } = state;
    const totalArticles = articles.length;
    const published = articles.filter(a => a.status === 'published').length;
    const drafts = articles.filter(a => a.status === 'draft').length;
    const pending = articles.filter(a => a.status === 'pending_review').length;
    const totalViews = articles.reduce((sum, a) => sum + a.viewCount, 0);

    const mostViewedArticles = [...articles].sort((a, b) => b.viewCount - a.viewCount).slice(0, 5);

    const StatCard: React.FC<{ title: string; value: string | number; }> = ({ title, value }) => (
        <div className="bg-gray-800/50 p-4 rounded-lg"><p className="text-sm text-gray-400">{title}</p><p className="text-3xl font-bold text-white">{value}</p></div>
    );

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold text-white tracking-wider">Dashboard</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <StatCard title="Total Articles" value={totalArticles} />
                <StatCard title="Published" value={published} />
                <StatCard title="Drafts & Pending" value={drafts + pending} />
                <StatCard title="Total Views" value={totalViews.toLocaleString()} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card title="Most Viewed Articles">
                    <ul className="space-y-2">
                        {mostViewedArticles.map(a => (
                            <li key={a.id} onClick={() => dispatch({type: 'SELECT_ARTICLE', payload: a.id})} className="flex justify-between items-center text-sm p-2 bg-gray-800/50 rounded hover:bg-gray-800 cursor-pointer">
                                <span className="text-gray-300 truncate pr-4">{a.title}</span>
                                <span className="font-semibold text-white flex-shrink-0">{a.viewCount.toLocaleString()} views</span>
                            </li>
                        ))}
                    </ul>
                </Card>
                <Card title="Articles by Category">
                    <ul className="space-y-2">
                        {categories.map(c => {
                            return (
                                <li key={c.id} className="flex justify-between items-center text-sm p-2 bg-gray-800/50 rounded">
                                    <span className="text-gray-300">{c.name}</span>
                                    <span className="font-semibold text-white">{c.articleCount} articles</span>
                                </li>
                            );
                        })}
                    </ul>
                </Card>
            </div>
        </div>
    );
};


// --- MAIN APPLICATION SHELL ---

const DemoBankKnowledgeBaseView: React.FC = () => {
    const [state, dispatch] = useReducer(knowledgeBaseReducer, initialState);
    const { addNotification } = useNotifications(dispatch);
    
    useEffect(() => {
        const loadData = async () => {
            dispatch({ type: 'START_LOADING' });
            try {
                const data = await fetchKnowledgeBaseData();
                dispatch({ type: 'DATA_FETCH_SUCCESS', payload: data });
            } catch (error) {
                dispatch({ type: 'FETCH_FAILURE', payload: 'Failed to load knowledge base data.' });
            }
        };
        loadData();
    }, []);

    const selectedArticle = useMemo(() => {
        return state.articles.find(a => a.id === state.selectedArticleId) || null;
    }, [state.articles, state.selectedArticleId]);

    const renderView = () => {
        if (state.isLoading) return <div className="text-center text-gray-400 p-8">Loading Knowledge Base...</div>;
        if (state.error) return <div className="text-center text-red-400 p-8">Error: {state.error}</div>;

        switch (state.currentView) {
            case 'dashboard': return <DashboardView state={state} dispatch={dispatch} />;
            case 'articles': return <ArticleListView state={state} dispatch={dispatch} />;
            case 'article_detail':
                if (selectedArticle && state.currentUser) {
                    return <ArticleDetailView article={selectedArticle} category={state.categories.find(c => c.id === selectedArticle.categoryId)!} users={state.users} currentUser={state.currentUser} dispatch={dispatch} addNotification={addNotification} />;
                }
                return <div className="text-red-400">Article not found.</div>;
            case 'article_edit':
                if (selectedArticle && state.currentUser) {
                     return <ArticleEditorView article={selectedArticle} categories={state.categories} currentUser={state.currentUser} dispatch={dispatch} addNotification={addNotification} />;
                }
                 return <div className="text-red-400">Article not found for editing.</div>;
            case 'article_create':
                if(state.currentUser) {
                    return <ArticleEditorView categories={state.categories} currentUser={state.currentUser} dispatch={dispatch} addNotification={addNotification} />;
                }
                return <div className="text-red-400">Cannot create article. User not found.</div>;
            default: return <div>View not implemented.</div>;
        }
    };
    
    const NavButton: React.FC<{ view: AppView; children: React.ReactNode }> = ({ view, children }) => (
        <button onClick={() => dispatch({ type: 'SET_VIEW', payload: view })} className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${state.currentView === view ? 'bg-cyan-600 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'}`}>{children}</button>
    );

    return (
        <div className="space-y-6 p-4 md:p-6 bg-gray-900 text-white min-h-screen">
            <header className="flex flex-col md:flex-row justify-between md:items-center space-y-4 md:space-y-0">
                <h1 className="text-3xl font-bold text-white tracking-wider">Demo Bank Knowledge Base</h1>
                {state.currentUser && (
                    <div className="flex items-center space-x-4">
                        <span className="text-gray-300">Welcome, {state.currentUser.name}</span>
                         <button onClick={() => dispatch({ type: 'SET_VIEW', payload: 'article_create' })} className="py-2 px-4 bg-green-600 hover:bg-green-700 rounded transition-colors text-sm font-semibold">+ New Article</button>
                    </div>
                )}
            </header>
            
            <nav className="flex space-x-2 p-2 bg-gray-800/50 rounded-lg overflow-x-auto">
                <NavButton view="dashboard">Dashboard</NavButton>
                <NavButton view="articles">Articles</NavButton>
                {/* Future views could be added here */}
                {/* <NavButton view="categories">Categories</NavButton> */}
                {/* <NavButton view="analytics">Analytics</NavButton> */}
                {/* <NavButton view="settings">Settings</NavButton> */}
            </nav>

            <main>
                {renderView()}
            </main>

             <div className="fixed bottom-4 right-4 space-y-2 z-50 w-80">
                {state.notifications.map(n => (
                    <div key={n.id} className={`relative px-4 py-3 rounded-lg shadow-lg text-white ${n.type === 'success' ? 'bg-green-600' : n.type === 'error' ? 'bg-red-600' : 'bg-blue-600'}`}>
                        {n.message}
                        <button onClick={() => dispatch({ type: 'REMOVE_NOTIFICATION', payload: n.id })} className="absolute top-1 right-1 text-white/70 hover:text-white">&times;</button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default DemoBankKnowledgeBaseView;