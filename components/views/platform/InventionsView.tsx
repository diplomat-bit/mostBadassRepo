// REPOSITORY SOURCE: diplomat-bit/Citibank_Demo_Business_Inc_Demonstration- | PATH: diplomat-bit-Citibank_Demo_Business_Inc_Demonstration--ab2501d/components/views/platform/InventionsView.tsx
================================================================================

// components/views/platform/InventionsView.tsx
import React, { useState, useEffect, useReducer, useCallback, useMemo, useRef, FC, memo, createContext, useContext } from 'react';
import Card from '../../Card';

// =================================================================================================
// BEGINNING OF ENHANCEMENT
// The following code represents a significant expansion of the component for a real-world application.
// =================================================================================================

// --------------------------------------------------
// ADVANCED TYPES AND INTERFACES
// --------------------------------------------------

export type DocumentType = 'Invention' | 'Prototype' | 'ResearchPaper' | 'PatentApplication' | 'TechnicalSpec';
export type DocumentStatus = 'Draft' | 'In Review' | 'Approved' | 'Archived' | 'Rejected' | 'Pending Legal';
export type UserRole = 'Scientist' | 'Engineer' | 'ProjectManager' | 'Legal' | 'Admin' | 'ExternalCollaborator';
export type ViewMode = 'list' | 'grid';
export type SortDirection = 'asc' | 'desc';
export type SortableField = 'title' | 'updatedAt' | 'createdAt' | 'type' | 'status' | 'author';
export type ModalType = 'newDocument' | 'deleteConfirm' | 'bulkEditTags' | 'shareDocument' | 'viewHistory' | 'aiAssistant';
export type ViewerTab = 'content' | 'details' | 'history' | 'comments' | 'ai_insights';
export type AITask = 'summarize' | 'suggest_tags' | 'find_related' | 'explain_concept';

/**
 * Represents a user in the system.
 */
export interface User {
    id: string;
    name: string;
    avatarUrl: string;
    role: UserRole;
    email: string;
}

/**
 * Represents a tag that can be applied to documents.
 */
export interface Tag {
    id: string;
    label: string;
    color: string;
}

/**
 * Represents a comment on a document.
 */
export interface Comment {
    id:string;
    author: User;
    timestamp: string;
    content: string;
    replies: Comment[];
}

/**
 * Represents a specific version of a document in its history.
 */
export interface Version {
    versionNumber: number;
    timestamp: string;
    author: User;
    summary: string;
    contentHash: string;
}

/**
 * Defines access control permissions for a document.
 */
export interface AccessControl {
    view: UserRole[];
    edit: UserRole[];
    comment: UserRole[];
    manage: UserRole[];
}

/**
 * Represents a link to an external project management system.
 */
export interface ProjectLink {
    projectId: string;
    projectName: string;
    status: 'Active' | 'Completed' | 'On Hold';
    platform: 'Jira' | 'Asana' | 'Trello';
}

/**
 * Represents the result of an AI analysis task.
 */
export interface AIInsight {
    summary: string;
    suggestedTags: Tag[];
    relatedDocuments: { id: string; title: string; similarity: number }[];
    isLoading: boolean;
    error: string | null;
}

/**
 * Represents a comprehensive document object.
 */
export interface EnhancedDocument {
    id: string;
    path: string;
    title: string;
    type: DocumentType;
    status: DocumentStatus;
    createdAt: string;
    updatedAt: string;
    author: User;
    contributors: User[];
    tags: Tag[];
    abstract: string;
    versionHistory: Version[];
    comments: Comment[];
    accessControl: AccessControl;
    relatedDocuments: string[]; // Manual relations
    projectLinks: ProjectLink[];
    isFavorite: boolean;
    content?: string; // Full markdown content, loaded on demand
    aiInsights?: AIInsight;
}

/**
 * Represents the state of filters applied to the document list.
 */
export interface FilterState {
    searchTerm: string;
    types: Set<DocumentType>;
    stati: Set<DocumentStatus>;
    tags: Set<string>; // Tag IDs
    authorIds: Set<string>;
    isFavorite: boolean | null;
}

/**
 * Represents the sorting configuration for the document list.
 */
export interface SortState {
    field: SortableField;
    direction: SortDirection;
}

/**
 * Main application state.
 */
export interface AppState {
    documents: EnhancedDocument[];
    allUsers: User[];
    allTags: Tag[];
    selectedDocId: string | null;
    isLoadingList: boolean;
    isLoadingContent: boolean;
    error: string | null;
    filters: FilterState;
    sorting: SortState;
    pagination: {
        currentPage: number;
        pageSize: number;
        totalCount: number;
    };
    viewMode: ViewMode;
    selectedDocumentIdsForBulkAction: Set<string>;
    activeModal: ModalType | null;
    modalPayload?: any; // For passing data to modals
}

/**
 * Actions for the application state reducer.
 */
export type AppAction =
    | { type: 'FETCH_INIT' }
    | { type: 'FETCH_SUCCESS'; payload: { documents: EnhancedDocument[], allUsers: User[], allTags: Tag[] } }
    | { type: 'FETCH_FAILURE'; payload: string }
    | { type: 'SELECT_DOCUMENT'; payload: string | null }
    | { type: 'LOAD_CONTENT_START' }
    | { type: 'LOAD_CONTENT_SUCCESS'; payload: { docId: string, content: string } }
    | { type: 'LOAD_CONTENT_FAILURE'; payload: string }
    | { type: 'UPDATE_FILTERS'; payload: Partial<FilterState> }
    | { type: 'UPDATE_SORTING'; payload: SortState }
    | { type: 'SET_VIEW_MODE'; payload: ViewMode }
    | { type: 'SET_PAGE'; payload: number }
    | { type: 'TOGGLE_BULK_SELECT'; payload: string }
    | { type: 'CLEAR_BULK_SELECT' }
    | { type: 'SELECT_ALL_VISIBLE'; payload: string[] }
    | { type: 'OPEN_MODAL'; payload: { type: ModalType, data?: any } }
    | { type: 'CLOSE_MODAL' }
    | { type: 'UPDATE_DOCUMENT'; payload: Partial<EnhancedDocument> & { id: string } }
    | { type: 'ADD_COMMENT'; payload: { docId: string; comment: Comment } }
    | { type: 'AI_TASK_START'; payload: { docId: string } }
    | { type: 'AI_SUMMARY_SUCCESS'; payload: { docId: string; summary: string } }
    | { type: 'AI_RELATED_DOCS_SUCCESS'; payload: { docId: string; related: { id: string; title: string; similarity: number }[] } }
    | { type: 'AI_TASK_FAILURE'; payload: { docId: string; error: string } };

// --------------------------------------------------
// MOCK DATA GENERATION AND API SERVICES
// --------------------------------------------------

const LOREM_IPSUM_ABSTRACT = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non risus. Suspendisse lectus tortor, dignissim sit amet, adipiscing nec, ultricies sed, dolor. Cras elementum ultrices diam. Maecenas ligula massa, varius a, semper congue, euismod non, mi.";
const LOREM_IPSUM_CONTENT = (title: string) => `# ${title}\n\n## Overview\n\n${LOREM_IPSUM_ABSTRACT}\n\n### Key Features\n\n- Feature A: Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem.\n- Feature B: Nulla consequat massa quis enim. Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu.\n- Feature C: In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo.\n\n## Technical Specification\n\n\`\`\`json\n{\n  "version": "1.0.0",\n  "spec": {\n    "power_requirement": "5V",\n    "operating_temperature": "-20C to 85C"\n  }\n}\n\`\`\`\n\n## Conclusion\n\nNullam dictum felis eu pede mollis pretium. Integer tincidunt. Cras dapibus. Vivamus elementum semper nisi. Aenean vulputate eleifend tellus.`;

const MOCK_USERS: User[] = [
    { id: 'user_1', name: 'Dr. Evelyn Reed', avatarUrl: `https://i.pravatar.cc/40?u=user_1`, role: 'Scientist', email: 'e.reed@example.com' },
    { id: 'user_2', name: 'Kenji Tanaka', avatarUrl: `https://i.pravatar.cc/40?u=user_2`, role: 'Engineer', email: 'k.tanaka@example.com' },
    { id: 'user_3', name: 'Maria Garcia', avatarUrl: `https://i.pravatar.cc/40?u=user_3`, role: 'ProjectManager', email: 'm.garcia@example.com' },
    { id: 'user_4', name: 'David Chen', avatarUrl: `https://i.pravatar.cc/40?u=user_4`, role: 'Legal', email: 'd.chen@example.com' },
    { id: 'user_5', name: 'Aisha Khan', avatarUrl: `https://i.pravatar.cc/40?u=user_5`, role: 'Admin', email: 'a.khan@example.com' },
    { id: 'user_6', name: 'Dr. Ben Carter', avatarUrl: `https://i.pravatar.cc/40?u=user_6`, role: 'Scientist', email: 'b.carter@example.com' },
];

const MOCK_TAGS: Tag[] = [
    { id: 'tag_1', label: 'Quantum Computing', color: '#4A90E2' }, { id: 'tag_2', label: 'AI/ML', color: '#D0021B' },
    { id: 'tag_3', label: 'Biotechnology', color: '#50E3C2' }, { id: 'tag_4', label: 'Robotics', color: '#F5A623' },
    { id: 'tag_5', label: 'Materials Science', color: '#BD10E0' }, { id: 'tag_6', label: 'Energy', color: '#F8E71C' },
    { id: 'tag_7', label: 'Core Tech', color: '#7ED321' }, { id: 'tag_8', label: 'Theoretical', color: '#9013FE' },
];

const KNOWN_DOCS = {
    '/inventions/001_generative_ui_background.md': { title: "Generative UI Backgrounds", type: 'Invention' as DocumentType },
    '/inventions/002_ai_contextual_prompt_suggestion.md': { title: "AI Contextual Prompts", type: 'Invention' as DocumentType },
    '/prototypes/prototype_001.md': { title: "The Sovereign's Key", type: 'Prototype' as DocumentType },
    '/prototypes/prototype_002.md': { title: "The Oracle's Lens", type: 'Prototype' as DocumentType },
    '/prototypes/prototype_003.md': { title: "The Weaver's Blueprints", type: 'Prototype' as DocumentType },
};

const getRandomElement = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
const getRandomSubset = <T>(arr: T[], maxCount: number): T[] => {
    const shuffled = [...arr].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, Math.floor(Math.random() * (maxCount + 1)));
};

export const generateMockDocuments = (count: number): EnhancedDocument[] => {
    return Array.from({ length: count }, (_, i) => {
        const docId = `doc_${i + 1}`;
        const knownPath = Object.keys(KNOWN_DOCS)[i % Object.keys(KNOWN_DOCS).length];
        const knownInfo = KNOWN_DOCS[knownPath as keyof typeof KNOWN_DOCS];
        
        const creationDate = new Date(Date.now() - Math.random() * 1000 * 3600 * 24 * 365);
        const updateDate = new Date(creationDate.getTime() + Math.random() * (Date.now() - creationDate.getTime()));
        const author = getRandomElement(MOCK_USERS);
        const type = i < 5 ? knownInfo.type : getRandomElement(['Invention', 'Prototype', 'ResearchPaper', 'PatentApplication', 'TechnicalSpec']);
        const title = i < 5 ? knownInfo.title : `${type} #${String(i + 1).padStart(3, '0')}`;
        const path = i < 5 ? knownPath : `/generated/${type.toLowerCase()}_${String(i + 1).padStart(3, '0')}.md`;
        
        return {
            id: docId, path, title, type,
            status: getRandomElement(['Draft', 'In Review', 'Approved', 'Archived', 'Rejected', 'Pending Legal']),
            createdAt: creationDate.toISOString(), updatedAt: updateDate.toISOString(),
            author, contributors: getRandomSubset(MOCK_USERS.filter(u => u.id !== author.id), 3),
            tags: getRandomSubset(MOCK_TAGS, 4), abstract: LOREM_IPSUM_ABSTRACT,
            versionHistory: Array.from({ length: Math.ceil(Math.random() * 5) }, (_, v) => ({
                versionNumber: v + 1,
                timestamp: new Date(creationDate.getTime() + (updateDate.getTime() - creationDate.getTime()) * (v / 5)).toISOString(),
                author: getRandomElement([author, ...MOCK_USERS]), summary: `Version ${v + 1} changes.`,
                contentHash: `hash_${i}_${v}`
            })),
            comments: Array.from({length: Math.floor(Math.random()*4)}, (_,c) => ({
                id: `comment_${i}_${c}`, author: getRandomElement(MOCK_USERS),
                timestamp: new Date(updateDate.getTime() - Math.random() * 1000 * 3600 * 24 * 30).toISOString(),
                content: "This is an insightful point. Have we considered the quantum-mechanical implications?",
                replies: []
            })),
            accessControl: { view: ['Scientist', 'Engineer', 'ProjectManager', 'Legal', 'Admin'], edit: ['Scientist', 'Engineer'], comment: ['Scientist', 'Engineer', 'ProjectManager'], manage: ['Admin'] },
            relatedDocuments: [],
            projectLinks: Math.random() > 0.7 ? [{
                projectId: `PROJ-${Math.floor(Math.random() * 100)}`, projectName: 'Project Phoenix',
                status: 'Active', platform: getRandomElement(['Jira', 'Asana', 'Trello'])
            }] : [],
            isFavorite: Math.random() > 0.8,
            aiInsights: { summary: '', suggestedTags: [], relatedDocuments: [], isLoading: false, error: null },
        };
    });
};

let MOCK_DB: { documents: EnhancedDocument[], users: User[], tags: Tag[] } = { documents: [], users: [], tags: [] };
const initializeDb = () => {
    if (MOCK_DB.documents.length === 0) {
        MOCK_DB.documents = generateMockDocuments(250);
        MOCK_DB.users = MOCK_USERS;
        MOCK_DB.tags = MOCK_TAGS;
    }
};

export const mockApiService = {
    fetchInitialData: (): Promise<{ documents: EnhancedDocument[], allUsers: User[], allTags: Tag[] }> => {
        initializeDb();
        return new Promise(resolve => setTimeout(() => resolve({ ...MOCK_DB }), 1000));
    },
    fetchDocumentContent: (docId: string): Promise<string> => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const doc = MOCK_DB.documents.find(d => d.id === docId);
                if (doc) resolve(LOREM_IPSUM_CONTENT(doc.title));
                else reject(new Error("Document not found in mock DB."));
            }, 500);
        });
    },
    updateDocument: (docUpdate: Partial<EnhancedDocument> & { id: string }): Promise<EnhancedDocument> => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const docIndex = MOCK_DB.documents.findIndex(d => d.id === docUpdate.id);
                if (docIndex > -1) {
                    MOCK_DB.documents[docIndex] = { ...MOCK_DB.documents[docIndex], ...docUpdate, updatedAt: new Date().toISOString() };
                    resolve(MOCK_DB.documents[docIndex]);
                } else reject(new Error("Document not found."));
            }, 300);
        });
    },
    addComment: (docId: string, content: string, authorId: string): Promise<Comment> => {
        return new Promise(resolve => {
            setTimeout(() => {
                const author = MOCK_USERS.find(u => u.id === authorId)!;
                const newComment: Comment = { id: `comment_new_${Date.now()}`, author, content, timestamp: new Date().toISOString(), replies: [] };
                const doc = MOCK_DB.documents.find(d => d.id === docId);
                doc?.comments.push(newComment);
                resolve(newComment);
            }, 400);
        });
    }
};

export const mockAiService = {
    summarize: (text: string): Promise<string> => new Promise(resolve => setTimeout(() => resolve(`This document outlines a novel concept for ${text.substring(2, 50).toLowerCase()}... It proposes a multi-phase implementation strategy, starting with theoretical modeling, followed by small-scale prototyping and eventual integration into the core platform. Key risks identified include potential quantum decoherence and supply chain vulnerabilities for exotic materials.`), 1500)),
    findRelated: (docId: string): Promise<{ id: string; title: string; similarity: number }[]> => new Promise(resolve => {
        setTimeout(() => {
            const related = getRandomSubset(MOCK_DB.documents.filter(d => d.id !== docId), 3)
                .map(d => ({ id: d.id, title: d.title, similarity: Math.random() * 0.5 + 0.4 }));
            resolve(related);
        }, 1200);
    })
};

// --------------------------------------------------
// UTILITY FUNCTIONS & CUSTOM HOOKS
// --------------------------------------------------

export const useDebounce = <T>(value: T, delay: number): T => {
    const [debouncedValue, setDebouncedValue] = useState<T>(value);
    useEffect(() => {
        const handler = setTimeout(() => setDebouncedValue(value), delay);
        return () => clearTimeout(handler);
    }, [value, delay]);
    return debouncedValue;
};

export const formatDate = (isoString: string): string => new Date(isoString).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
export const formatDateTime = (isoString: string): string => new Date(isoString).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' });

// --------------------------------------------------
// STATE MANAGEMENT (Reducer and Context)
// --------------------------------------------------

const initialState: AppState = {
    documents: [], allUsers: [], allTags: [], selectedDocId: null,
    isLoadingList: true, isLoadingContent: false, error: null,
    filters: { searchTerm: '', types: new Set(), stati: new Set(), tags: new Set(), authorIds: new Set(), isFavorite: null },
    sorting: { field: 'updatedAt', direction: 'desc' },
    pagination: { currentPage: 1, pageSize: 25, totalCount: 0 },
    viewMode: 'list', selectedDocumentIdsForBulkAction: new Set(),
    activeModal: null, modalPayload: null
};

export const appReducer = (state: AppState, action: AppAction): AppState => {
    switch (action.type) {
        case 'FETCH_INIT': return { ...state, isLoadingList: true, error: null };
        case 'FETCH_SUCCESS': return { ...state, isLoadingList: false, documents: action.payload.documents, allUsers: action.payload.allUsers, allTags: action.payload.allTags };
        case 'FETCH_FAILURE': return { ...state, isLoadingList: false, error: action.payload };
        case 'SELECT_DOCUMENT': return { ...state, selectedDocId: action.payload, isLoadingContent: !!action.payload };
        case 'LOAD_CONTENT_START': return { ...state, isLoadingContent: true };
        case 'LOAD_CONTENT_SUCCESS': return { ...state, isLoadingContent: false, documents: state.documents.map(doc => doc.id === action.payload.docId ? { ...doc, content: action.payload.content } : doc) };
        case 'LOAD_CONTENT_FAILURE': return { ...state, isLoadingContent: false, error: action.payload };
        case 'UPDATE_FILTERS': return { ...state, filters: { ...state.filters, ...action.payload }, pagination: { ...state.pagination, currentPage: 1 } };
        case 'UPDATE_SORTING': return { ...state, sorting: action.payload };
        case 'SET_VIEW_MODE': return { ...state, viewMode: action.payload };
        case 'SET_PAGE': return { ...state, pagination: { ...state.pagination, currentPage: action.payload } };
        case 'TOGGLE_BULK_SELECT':
            const newSet = new Set(state.selectedDocumentIdsForBulkAction);
            if (newSet.has(action.payload)) newSet.delete(action.payload); else newSet.add(action.payload);
            return { ...state, selectedDocumentIdsForBulkAction: newSet };
        case 'CLEAR_BULK_SELECT': return { ...state, selectedDocumentIdsForBulkAction: new Set() };
        case 'SELECT_ALL_VISIBLE': return { ...state, selectedDocumentIdsForBulkAction: new Set(action.payload) };
        case 'OPEN_MODAL': return { ...state, activeModal: action.payload.type, modalPayload: action.payload.data };
        case 'CLOSE_MODAL': return { ...state, activeModal: null, modalPayload: null };
        case 'UPDATE_DOCUMENT': return { ...state, documents: state.documents.map(doc => doc.id === action.payload.id ? { ...doc, ...action.payload } : doc) };
        case 'ADD_COMMENT': return { ...state, documents: state.documents.map(doc => doc.id === action.payload.docId ? { ...doc, comments: [...doc.comments, action.payload.comment] } : doc) };
        case 'AI_TASK_START': return { ...state, documents: state.documents.map(doc => doc.id === action.payload.docId ? { ...doc, aiInsights: { ...doc.aiInsights!, isLoading: true } } : doc) };
        case 'AI_SUMMARY_SUCCESS': return { ...state, documents: state.documents.map(doc => doc.id === action.payload.docId ? { ...doc, aiInsights: { ...doc.aiInsights!, summary: action.payload.summary, isLoading: false } } : doc) };
        case 'AI_RELATED_DOCS_SUCCESS': return { ...state, documents: state.documents.map(doc => doc.id === action.payload.docId ? { ...doc, aiInsights: { ...doc.aiInsights!, relatedDocuments: action.payload.related, isLoading: false } } : doc) };
        case 'AI_TASK_FAILURE': return { ...state, documents: state.documents.map(doc => doc.id === action.payload.docId ? { ...doc, aiInsights: { ...doc.aiInsights!, isLoading: false, error: action.payload.error } } : doc) };
        default: return state;
    }
};

const AppContext = createContext<{ state: AppState; dispatch: React.Dispatch<AppAction> } | null>(null);
export const useAppContext = () => {
    const context = useContext(AppContext);
    if (!context) throw new Error('useAppContext must be used within an AppProvider');
    return context;
};

// --------------------------------------------------
// UI SUB-COMPONENTS
// --------------------------------------------------

export const Spinner: FC<{ size?: 'sm' | 'md' | 'lg' }> = ({ size = 'md' }) => {
    const sizeClasses = { sm: 'h-4 w-4', md: 'h-8 w-8', lg: 'h-12 w-12' };
    return <div className="flex justify-center items-center h-full w-full"><div className={`animate-spin rounded-full border-b-2 border-cyan-400 ${sizeClasses[size]}`}></div></div>;
};
export const ErrorDisplay: FC<{ message: string }> = ({ message }) => <div className="p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-300"><p className="font-bold">An Error Occurred</p><p className="text-sm">{message}</p></div>;
export const UserAvatar: FC<{ user: User }> = ({ user }) => <div className="flex items-center space-x-2" title={`${user.name} (${user.email})`}><img src={user.avatarUrl} alt={user.name} className="h-6 w-6 rounded-full" /><span className="text-sm text-gray-300">{user.name}</span></div>;
export const TagChip: FC<{ tag: Tag }> = ({ tag }) => <span className="px-2 py-0.5 text-xs font-semibold rounded-full" style={{ backgroundColor: `${tag.color}30`, color: tag.color, border: `1px solid ${tag.color}80` }}>{tag.label}</span>;

export const CodexToolbar: FC<{ onNewDocument: () => void; }> = memo(({ onNewDocument }) => {
    const { state, dispatch } = useAppContext();
    const { viewMode, selectedDocumentIdsForBulkAction } = state;
    return (
        <div className="flex justify-between items-center mb-4">
            <div className="flex items-center space-x-2">
                <button onClick={onNewDocument} className="px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-sm font-semibold transition-colors flex items-center gap-2"><span>+</span> New Invention</button>
                {selectedDocumentIdsForBulkAction.size > 0 && <div className="text-sm text-cyan-300">{selectedDocumentIdsForBulkAction.size} selected</div>}
            </div>
            <div className="flex items-center space-x-1 p-1 bg-gray-900/50 rounded-lg">
                <button onClick={() => dispatch({ type: 'SET_VIEW_MODE', payload: 'list' })} className={`px-2.5 py-1 text-sm rounded-md transition-colors ${viewMode === 'list' ? 'bg-cyan-500/30 text-white' : 'text-gray-400 hover:bg-gray-700/50'}`}>List</button>
                <button onClick={() => dispatch({ type: 'SET_VIEW_MODE', payload: 'grid' })} className={`px-2.5 py-1 text-sm rounded-md transition-colors ${viewMode === 'grid' ? 'bg-cyan-500/30 text-white' : 'text-gray-400 hover:bg-gray-700/50'}`}>Grid</button>
            </div>
        </div>
    );
});
CodexToolbar.displayName = 'CodexToolbar';

export const FilterPanel: FC = memo(() => {
    const { state, dispatch } = useAppContext();
    const { filters, sorting } = state;
    const [localSearch, setLocalSearch] = useState(filters.searchTerm);
    const debouncedSearchTerm = useDebounce(localSearch, 300);

    useEffect(() => { dispatch({ type: 'UPDATE_FILTERS', payload: { searchTerm: debouncedSearchTerm } }); }, [debouncedSearchTerm, dispatch]);

    const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const [field, direction] = e.target.value.split(':');
        dispatch({ type: 'UPDATE_SORTING', payload: { field: field as SortableField, direction: direction as SortDirection } });
    };

    const handleSetToggle = <T,>(set: Set<T>, item: T) => {
        const newSet = new Set(set);
        if (newSet.has(item)) newSet.delete(item); else newSet.add(item);
        return newSet;
    }
    
    return (
        <Card title="Registry Filters" className="h-full flex flex-col" padding="none">
            <div className="p-4 border-b border-gray-700/60"><input type="text" placeholder="Search..." value={localSearch} onChange={e => setLocalSearch(e.target.value)} className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-3 py-1.5 text-sm text-white focus:ring-2 focus:ring-cyan-500 focus:outline-none"/></div>
            <div className="flex-grow overflow-y-auto p-4 space-y-6 text-sm">
                <div>
                    <h4 className="font-semibold text-gray-200 mb-2">Sort By</h4>
                    <select value={`${sorting.field}:${sorting.direction}`} onChange={handleSortChange} className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-3 py-1.5 text-sm text-white focus:ring-2 focus:ring-cyan-500 focus:outline-none">
                       <option value="updatedAt:desc">Last Updated (Newest)</option><option value="updatedAt:asc">Last Updated (Oldest)</option>
                       <option value="createdAt:desc">Date Created (Newest)</option><option value="createdAt:asc">Date Created (Oldest)</option>
                       <option value="title:asc">Title (A-Z)</option><option value="title:desc">Title (Z-A)</option>
                    </select>
                </div>
                <div>
                    <h4 className="font-semibold text-gray-200 mb-2">Status</h4>
                    <div className="space-y-1">{Object.values(DocumentStatus).map(s => <label key={s} className="flex items-center space-x-2 cursor-pointer"><input type="checkbox" className="form-checkbox bg-gray-700 border-gray-600 text-cyan-500" checked={filters.stati.has(s)} onChange={() => dispatch({ type: 'UPDATE_FILTERS', payload: { stati: handleSetToggle(filters.stati, s) }})}/><span>{s}</span></label>)}</div>
                </div>
                <div>
                    <h4 className="font-semibold text-gray-200 mb-2">Misc</h4>
                    <label className="flex items-center space-x-2 cursor-pointer"><input type="checkbox" className="form-checkbox bg-gray-700 border-gray-600 text-cyan-500" checked={!!filters.isFavorite} onChange={(e) => dispatch({ type: 'UPDATE_FILTERS', payload: { isFavorite: e.target.checked ? true : null } })}/><span>Favorites Only</span></label>
                </div>
            </div>
        </Card>
    );
});
FilterPanel.displayName = 'FilterPanel';

export const DocumentListItem: FC<{ doc: EnhancedDocument; onSelect: (id: string) => void; onToggleFavorite: (id: string, isFavorite: boolean) => void; isSelected: boolean; }> = memo(({ doc, onSelect, onToggleFavorite, isSelected }) => (
    <div onClick={() => onSelect(doc.id)} className={`w-full text-left p-3 rounded-lg transition-colors cursor-pointer border ${isSelected ? 'bg-cyan-500/20 border-cyan-500/40' : 'text-gray-300 hover:bg-gray-700/50 border-transparent'}`}>
        <div className="flex justify-between items-start"><div className="flex-1 min-w-0"><span className={`text-xs font-bold ${doc.type === 'Prototype' ? 'text-indigo-300' : 'text-cyan-300'}`}>{doc.type}</span><p className="truncate font-semibold text-white">{doc.title}</p></div><button onClick={(e) => { e.stopPropagation(); onToggleFavorite(doc.id, !doc.isFavorite); }} className="text-gray-400 hover:text-yellow-400 text-lg px-1">{doc.isFavorite ? '★' : '☆'}</button></div>
        <p className="text-xs text-gray-400 mt-1 truncate">{doc.abstract}</p>
        <div className="flex items-center justify-between mt-2 text-xs text-gray-500"><UserAvatar user={doc.author} /><span>{formatDate(doc.updatedAt)}</span></div>
    </div>
));
DocumentListItem.displayName = 'DocumentListItem';

export const DocumentGridItem: FC<{ doc: EnhancedDocument; onSelect: (id: string) => void; onToggleFavorite: (id: string, isFavorite: boolean) => void; isSelected: boolean; }> = memo(({ doc, onSelect, onToggleFavorite, isSelected }) => (
    <div onClick={() => onSelect(doc.id)} className={`flex flex-col text-left p-4 rounded-lg transition-all cursor-pointer border ${isSelected ? 'bg-cyan-500/20 border-cyan-500/40 transform scale-105' : 'bg-gray-800/50 hover:bg-gray-700/50 border-gray-700/50 hover:border-gray-600'}`}>
        <div className="flex justify-between items-start"><div className="flex-1 min-w-0"><span className={`text-xs font-bold ${doc.type === 'Prototype' ? 'text-indigo-300' : 'text-cyan-300'}`}>{doc.type}</span><p className="truncate font-semibold text-white mt-1">{doc.title}</p></div><button onClick={(e) => { e.stopPropagation(); onToggleFavorite(doc.id, !doc.isFavorite); }} className="text-gray-400 hover:text-yellow-400 text-lg px-1">{doc.isFavorite ? '★' : '☆'}</button></div>
        <p className="text-xs text-gray-400 mt-2 flex-grow">{doc.abstract.substring(0, 100)}...</p>
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-700 text-xs text-gray-500"><UserAvatar user={doc.author} /><span>{formatDate(doc.updatedAt)}</span></div>
    </div>
));
DocumentGridItem.displayName = 'DocumentGridItem';

export const DocumentListContainer: FC<{ documents: EnhancedDocument[]; }> = ({ documents }) => {
    const { state, dispatch } = useAppContext();
    const { selectedDocId, viewMode } = state;
    const handleSelectDocument = useCallback((id: string) => dispatch({ type: 'SELECT_DOCUMENT', payload: id }), [dispatch]);
    const handleToggleFavorite = useCallback((id: string, isFavorite: boolean) => mockApiService.updateDocument({ id, isFavorite }).then(updatedDoc => dispatch({ type: 'UPDATE_DOCUMENT', payload: updatedDoc })), [dispatch]);
    
    return (
        <Card title="Codex Registry" className="h-full flex flex-col" padding="none">
            <div className="p-2 border-b border-gray-700/60">{/* Bulk actions could go here */}</div>
            <div className="flex-grow overflow-y-auto p-2">
                {viewMode === 'list' ? (
                    <div className="space-y-2">{documents.map(doc => <DocumentListItem key={doc.id} doc={doc} isSelected={selectedDocId === doc.id} onSelect={handleSelectDocument} onToggleFavorite={handleToggleFavorite} />)}</div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{documents.map(doc => <DocumentGridItem key={doc.id} doc={doc} isSelected={selectedDocId === doc.id} onSelect={handleSelectDocument} onToggleFavorite={handleToggleFavorite}/>)}</div>
                )}
            </div>
            <PaginationControls />
        </Card>
    );
};
DocumentListContainer.displayName = 'DocumentListContainer';

export const PaginationControls: FC = () => {
    const { state, dispatch } = useAppContext();
    const { currentPage, pageSize, totalCount } = state.pagination;
    const totalPages = Math.ceil(totalCount / pageSize);
    if (totalPages <= 1) return null;
    const handlePageChange = (newPage: number) => { if (newPage >= 1 && newPage <= totalPages) dispatch({ type: 'SET_PAGE', payload: newPage }); };
    return (
        <div className="p-2 border-t border-gray-700/60 flex justify-between items-center text-sm">
            <span className="text-gray-400">Page {currentPage} of {totalPages} ({totalCount} items)</span>
            <div className="flex space-x-1">
                <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} className="px-2 py-1 rounded bg-gray-700 hover:bg-gray-600 disabled:opacity-50">Prev</button>
                <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} className="px-2 py-1 rounded bg-gray-700 hover:bg-gray-600 disabled:opacity-50">Next</button>
            </div>
        </div>
    );
};
PaginationControls.displayName = 'PaginationControls';

const ViewerTabContent: FC<{doc: EnhancedDocument}> = ({doc}) => {
     return <div className="prose prose-invert max-w-none prose-pre:bg-gray-900/50 prose-pre:p-4 prose-pre:rounded-lg"><pre className="font-sans whitespace-pre-wrap">{doc.content}</pre></div>;
}
const ViewerTabDetails: FC<{doc: EnhancedDocument}> = ({doc}) => {
    return (
        <div className="space-y-4 text-sm">
            <div><h4 className="font-bold text-gray-400">Author</h4><UserAvatar user={doc.author} /></div>
            <div><h4 className="font-bold text-gray-400">Contributors</h4><div className="flex flex-wrap gap-4 mt-1">{doc.contributors.map(c => <UserAvatar key={c.id} user={c}/>)}</div></div>
            <div><h4 className="font-bold text-gray-400">Tags</h4><div className="flex flex-wrap gap-2 mt-1">{doc.tags.map(t => <TagChip key={t.id} tag={t}/>)}</div></div>
            <div><h4 className="font-bold text-gray-400">Status</h4><p>{doc.status}</p></div>
            <div><h4 className="font-bold text-gray-400">Project Links</h4>{doc.projectLinks.length > 0 ? doc.projectLinks.map(l => <p key={l.projectId}>{l.projectName} ({l.platform}) - {l.status}</p>) : <p className="text-gray-500">None</p>}</div>
        </div>
    );
}
const ViewerTabHistory: FC<{doc: EnhancedDocument}> = ({doc}) => {
    return (
        <ul className="space-y-4">
            {doc.versionHistory.slice().reverse().map(v => (
                <li key={v.versionNumber} className="border-l-2 border-gray-700 pl-4">
                    <p className="font-semibold">Version {v.versionNumber}</p>
                    <p className="text-xs text-gray-400">{v.summary}</p>
                    <div className="flex items-center justify-between text-xs text-gray-500 mt-1">
                        <UserAvatar user={v.author} />
                        <span>{formatDateTime(v.timestamp)}</span>
                    </div>
                </li>
            ))}
        </ul>
    );
}
const ViewerTabComments: FC<{doc: EnhancedDocument}> = ({doc}) => {
    const { dispatch } = useAppContext();
    const [newComment, setNewComment] = useState("");
    const handleAddComment = () => {
        if (!newComment.trim()) return;
        mockApiService.addComment(doc.id, newComment, 'user_1').then(comment => {
            dispatch({type: 'ADD_COMMENT', payload: {docId: doc.id, comment}});
            setNewComment("");
        });
    }
    return (
        <div>
            <div className="space-y-4">
                {doc.comments.map(c => <div key={c.id} className="p-3 bg-gray-800/50 rounded-lg"><div className="flex justify-between items-center mb-2"><UserAvatar user={c.author} /><span className="text-xs text-gray-500">{formatDateTime(c.timestamp)}</span></div><p className="text-sm">{c.content}</p></div>)}
            </div>
            <div className="mt-6 border-t border-gray-700 pt-4">
                <textarea value={newComment} onChange={e => setNewComment(e.target.value)} placeholder="Add a comment..." rows={3} className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-3 py-1.5 text-sm text-white focus:ring-2 focus:ring-cyan-500 focus:outline-none mb-2" />
                <button onClick={handleAddComment} className="px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-sm font-semibold transition-colors">Submit</button>
            </div>
        </div>
    );
};
const ViewerTabAI: FC<{doc: EnhancedDocument}> = ({doc}) => {
    const { dispatch } = useAppContext();
    const insights = doc.aiInsights!;
    
    const handleSummarize = () => {
        if (!doc.content) return;
        dispatch({type: 'AI_TASK_START', payload: { docId: doc.id }});
        mockAiService.summarize(doc.content)
            .then(summary => dispatch({ type: 'AI_SUMMARY_SUCCESS', payload: { docId: doc.id, summary }}))
            .catch(e => dispatch({type: 'AI_TASK_FAILURE', payload: { docId: doc.id, error: e.message }}));
    };
    const handleFindRelated = () => {
        dispatch({type: 'AI_TASK_START', payload: { docId: doc.id }});
        mockAiService.findRelated(doc.id)
            .then(related => dispatch({ type: 'AI_RELATED_DOCS_SUCCESS', payload: { docId: doc.id, related }}))
            .catch(e => dispatch({type: 'AI_TASK_FAILURE', payload: { docId: doc.id, error: e.message }}));
    }

    return (
        <div className="space-y-6">
            <div>
                <div className="flex items-center justify-between mb-2">
                    <h4 className="font-bold text-gray-400">AI Summary</h4>
                    <button onClick={handleSummarize} disabled={insights.isLoading} className="text-xs px-2 py-1 bg-indigo-600 hover:bg-indigo-500 rounded disabled:opacity-50">Generate</button>
                </div>
                {insights.isLoading && <Spinner size="sm"/>}
                {insights.summary && <p className="text-sm p-3 bg-gray-800/50 rounded-lg whitespace-pre-wrap">{insights.summary}</p>}
                {insights.error && <ErrorDisplay message={insights.error}/>}
            </div>
            <div>
                 <div className="flex items-center justify-between mb-2">
                    <h4 className="font-bold text-gray-400">AI-Suggested Related Documents</h4>
                    <button onClick={handleFindRelated} disabled={insights.isLoading} className="text-xs px-2 py-1 bg-indigo-600 hover:bg-indigo-500 rounded disabled:opacity-50">Find</button>
                </div>
                {insights.isLoading && <Spinner size="sm"/>}
                {insights.relatedDocuments.length > 0 && <ul className="space-y-2">{insights.relatedDocuments.map(r => <li key={r.id} className="text-sm p-2 bg-gray-800/50 rounded-lg"><strong>{r.title}</strong> (Similarity: {r.similarity.toFixed(2)})</li>)}</ul>}
            </div>
        </div>
    );
};

export const DocumentViewer: FC = () => {
    const { state } = useAppContext();
    const { documents, selectedDocId, isLoadingContent } = state;
    const [activeTab, setActiveTab] = useState<ViewerTab>('content');
    const selectedDoc = useMemo(() => documents.find(d => d.id === selectedDocId), [documents, selectedDocId]);

    useEffect(() => { setActiveTab('content') }, [selectedDocId]);

    if (!selectedDocId) return <Card className="h-full"><div className="flex flex-col justify-center items-center h-full text-gray-400"><p className="text-lg">Select a document from the registry.</p><p className="text-sm">The codex contains all known inventions and prototypes.</p></div></Card>;
    if (isLoadingContent) return <Card className="h-full"><Spinner /></Card>;
    if (!selectedDoc) return <Card className="h-full"><ErrorDisplay message={`Document with ID ${selectedDocId} not found.`} /></Card>;
    
    const TABS: { id: ViewerTab, label: string, component: React.ReactNode }[] = [
        { id: 'content', label: 'Content', component: <ViewerTabContent doc={selectedDoc}/> },
        { id: 'details', label: 'Details', component: <ViewerTabDetails doc={selectedDoc}/> },
        { id: 'history', label: `History (${selectedDoc.versionHistory.length})`, component: <ViewerTabHistory doc={selectedDoc}/> },
        { id: 'comments', label: `Comments (${selectedDoc.comments.length})`, component: <ViewerTabComments doc={selectedDoc}/> },
        { id: 'ai_insights', label: 'AI Insights ✨', component: <ViewerTabAI doc={selectedDoc}/> }
    ];

    return (
        <Card className="h-full flex flex-col" padding="none">
             <div className="p-4 border-b border-gray-700/60">
                 <h3 className="text-2xl font-bold text-white tracking-wider">{selectedDoc.title}</h3>
                 <div className="flex space-x-4 text-xs text-gray-400 mt-1"><span>By {selectedDoc.author.name}</span><span>Updated: {formatDate(selectedDoc.updatedAt)}</span></div>
             </div>
             <div className="border-b border-gray-700/60 px-4">
                <nav className="flex space-x-4 -mb-px">
                    {TABS.map(tab => <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`py-3 px-1 text-sm font-medium border-b-2 ${activeTab === tab.id ? 'border-cyan-400 text-cyan-300' : 'border-transparent text-gray-400 hover:text-white hover:border-gray-500'}`}>{tab.label}</button>)}
                </nav>
             </div>
             <div className="flex-grow overflow-y-auto p-6">{TABS.find(t => t.id === activeTab)?.component}</div>
        </Card>
    );
};
DocumentViewer.displayName = 'DocumentViewer';

// =================================================================================================
// REFACTORED MAIN COMPONENT
// =================================================================================================

const InventionsView: React.FC = () => {
    const [state, dispatch] = useReducer(appReducer, initialState);
    const { filters, sorting, pagination } = state;

    useEffect(() => {
        dispatch({ type: 'FETCH_INIT' });
        mockApiService.fetchInitialData()
            .then(data => dispatch({ type: 'FETCH_SUCCESS', payload: data }))
            .catch(error => dispatch({ type: 'FETCH_FAILURE', payload: error.message }));
    }, []);

    useEffect(() => {
        if (state.selectedDocId) {
            const doc = state.documents.find(d => d.id === state.selectedDocId);
            if (doc && !doc.content) {
                dispatch({ type: 'LOAD_CONTENT_START' });
                mockApiService.fetchDocumentContent(doc.id)
                    .then(content => dispatch({ type: 'LOAD_CONTENT_SUCCESS', payload: { docId: doc.id, content } }))
                    .catch(error => dispatch({ type: 'LOAD_CONTENT_FAILURE', payload: error.message }));
            }
        }
    }, [state.selectedDocId, state.documents]);
    
    const processedDocuments = useMemo(() => {
        let filtered = state.documents
            .filter(doc => {
                const term = filters.searchTerm.toLowerCase();
                const matchesSearch = !term || doc.title.toLowerCase().includes(term) || doc.abstract.toLowerCase().includes(term);
                const matchesFavorite = !filters.isFavorite || doc.isFavorite;
                const matchesStatus = filters.stati.size === 0 || filters.stati.has(doc.status);
                return matchesSearch && matchesFavorite && matchesStatus;
            })
            .sort((a, b) => {
                const fieldA = a[sorting.field];
                const fieldB = b[sorting.field];
                let comparison = 0;
                if (fieldA > fieldB) comparison = 1; else if (fieldA < fieldB) comparison = -1;
                return sorting.direction === 'asc' ? comparison : -comparison;
            });
        
        // This is a bit of a hack to update pagination total outside of reducer
        if(state.pagination.totalCount !== filtered.length) {
            state.pagination.totalCount = filtered.length;
        }

        return filtered;
    }, [state.documents, filters, sorting, state.pagination]);

    const paginatedDocuments = useMemo(() => {
        const start = (pagination.currentPage - 1) * pagination.pageSize;
        return processedDocuments.slice(start, start + pagination.pageSize);
    }, [processedDocuments, pagination.currentPage, pagination.pageSize]);
    
    if (state.isLoadingList) return <div className="h-screen flex justify-center items-center"><Spinner size="lg" /></div>;
    if (state.error) return <ErrorDisplay message={state.error} />

    return (
        <AppContext.Provider value={{ state, dispatch }}>
            <div className="space-y-6">
                <h2 className="text-3xl font-bold text-white tracking-wider">Invention & Prototype Codex</h2>
                <CodexToolbar onNewDocument={() => dispatch({ type: 'OPEN_MODAL', payload: { type: 'newDocument' } })} />
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100vh-200px)]">
                    <div className="lg:col-span-1 h-full"><FilterPanel/></div>
                    <div className="lg:col-span-2 h-full"><DocumentListContainer documents={paginatedDocuments} /></div>
                    <div className="lg:col-span-1 h-full"><DocumentViewer /></div>
                </div>
            </div>
        </AppContext.Provider>
    );
};

export default InventionsView;
// =================================================================================================
// END OF ENHANCEMENT
// =================================================================================================