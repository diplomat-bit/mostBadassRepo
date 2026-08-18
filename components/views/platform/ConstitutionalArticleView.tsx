// REPOSITORY SOURCE: diplomat-bit/Citibank_Demo_Business_Inc_Demonstration- | PATH: diplomat-bit-Citibank_Demo_Business_Inc_Demonstration--ab2501d/components/views/platform/ConstitutionalArticleView.tsx
================================================================================

// components/views/platform/ConstitutionalArticleView.tsx
import React, { useState, useEffect, useCallback, useMemo, useRef, createContext, useContext, useReducer, ReactNode } from 'react';
import Card from '../../Card';
import { CONSTITUTIONAL_ARTICLES } from '../../../data';
// In a real project, we'd use a library like react-flow-renderer
// For this self-contained example, we'll create simple components that mimic the behavior.
// import { ReactFlowProvider, useNodesState, useEdgesState, ReactFlow } from 'react-flow-renderer';


// --- ENHANCED TYPE DEFINITIONS FOR A REAL-WORLD APPLICATION ---

/**
 * Represents a user in the system.
 */
export type User = {
  id: string;
  name: string;
  avatarUrl?: string;
  role: 'admin' | 'moderator' | 'scholar' | 'user';
  bio: string;
  joinedDate: string;
  reputation: number;
};

/**
 * Represents a user's preferences for the application.
 */
export type UserPreferences = {
  fontSize: 'small' | 'medium' | 'large';
  theme: 'dark' | 'light' | 'sepia';
  showAnnotations: 'all' | 'scholar' | 'none';
  enableTextToSpeech: boolean;
  aiAssistantMode: 'concise' | 'detailed' | 'socratic';
  showSentimentAnalysis: boolean;
};

/**
 * Represents a cross-reference link within an article section.
 */
export type CrossReference = {
  text: string;
  targetArticleId: number;
  targetSectionId?: string;
};

/**
 * Represents a structured section of a constitutional article.
 */
export type ArticleSection = {
  id: string;
  tag: 'h3' | 'h4' | 'p' | 'ol' | 'ul' | 'blockquote';
  content: string | ArticleSection[];
  crossReferences?: CrossReference[];
};

/**
 * Represents a historical version of an article.
 */
export type HistoricalVersion = {
  versionId: string;
  dateEnacted: string;
  summaryOfChanges: string;
  ratifiedBy: string[];
  fullText: ArticleSection[];
};

/**
 * Represents a single constitutional article with rich metadata.
 */
export type ConstitutionalArticle = {
  id: number;
  romanNumeral: string;
  title: string;
  summary: string;
  content: ArticleSection[];
  currentVersionId: string;
  history: HistoricalVersion[];
  tags: string[];
  relatedCaseLaw: { caseName: string; citation: string; url: string; summary: string }[];
};

/**
 * Represents a user-created annotation on a piece of text.
 */
export type Annotation = {
  id: string;
  articleId: number;
  sectionId: string;
  range: [number, number];
  text: string;
  author: User;
  createdAt: string;
  replies: Comment[];
  type: 'historical' | 'legal' | 'linguistic' | 'personal';
  visibility: 'public' | 'private' | 'group';
  upvotes: number;
};

/**
 * Represents the sentiment of a piece of text.
 */
export type Sentiment = 'positive' | 'neutral' | 'negative' | 'mixed';

/**
 * Represents a comment in a discussion thread.
 */
export type Comment = {
  id: string;
  author: User;
  content: string;
  createdAt: string;
  upvotes: number;
  downvotes: number;
  replies: Comment[];
  currentUserVote?: 'up' | 'down' | null;
  sentiment?: Sentiment;
};

/**
 * Represents a node in the knowledge graph.
 */
export type GraphNode = {
  id: string;
  type: 'article' | 'case' | 'principle';
  label: string;
  data: { [key: string]: any };
  position: { x: number; y: number };
};

/**
 * Represents an edge connecting two nodes in the knowledge graph.
 */
export type GraphEdge = {
  id: string;
  source: string;
  target: string;
  label: string;
  animated?: boolean;
};


// --- MOCK API AND DATABASE LAYER ---

const MOCK_USERS: User[] = [
  { id: 'u1', name: 'Dr. Eleanor Vance', avatarUrl: '/avatars/vance.png', role: 'scholar', bio: 'Constitutional Law Professor at Harvard.', joinedDate: '2020-01-15T09:00:00Z', reputation: 1250 },
  { id: 'u2', name: 'John Public', avatarUrl: '/avatars/public.png', role: 'user', bio: 'Civics enthusiast.', joinedDate: '2021-03-22T14:30:00Z', reputation: 150 },
  { id: 'u3', name: 'Admin', avatarUrl: '/avatars/admin.png', role: 'admin', bio: 'Site Administrator.', joinedDate: '2019-01-01T00:00:00Z', reputation: 9999 },
  { id: 'u4', name: 'LegalEagleMod', avatarUrl: '/avatars/mod.png', role: 'moderator', bio: 'Moderator and paralegal.', joinedDate: '2022-06-10T18:00:00Z', reputation: 800 },
];

const MOCK_ARTICLES: ConstitutionalArticle[] = CONSTITUTIONAL_ARTICLES.map(article => ({
  ...article,
  summary: `This article establishes the fundamental principles and structure of the ${article.title.toLowerCase()}. It outlines key powers, responsibilities, and limitations, forming the bedrock of the governing framework.`,
  content: [
    { id: `${article.id}-s1`, tag: 'h3', content: 'Section 1: General Principles' },
    { id: `${article.id}-s2`, tag: 'p', content: article.content, crossReferences: article.id === 1 ? [{ text: 'Article V', targetArticleId: 5 }] : [] },
    { id: `${article.id}-s3`, tag: 'h3', content: 'Section 2: Operational Mandates' },
    { id: `${article.id}-s4`, tag: 'ol', content: [
      { id: `${article.id}-s4-li1`, tag: 'p', content: 'The body shall convene no less than twice per standard year.' },
      { id: `${article.id}-s4-li2`, tag: 'p', content: 'All proceedings must be recorded and made available for public review within thirty standard days.' },
    ]}
  ],
  currentVersionId: 'v2.0',
  history: [
    { versionId: 'v1.0', dateEnacted: '2250-01-01T00:00:00Z', summaryOfChanges: 'Initial ratification.', ratifiedBy: ['Founding Members Council'], fullText: [{ id: `${article.id}-v1-s1`, tag: 'p', content: 'The original, much simpler text.' }] },
    { versionId: 'v2.0', dateEnacted: '2285-07-04T12:00:00Z', summaryOfChanges: 'The "Modernization Act" amendment.', ratifiedBy: ['Galactic Senate', 'Citizen Plebiscite'], fullText: [
      { id: `${article.id}-v2-s1`, tag: 'h3', content: 'Section 1: General Principles' },
      { id: `${article.id}-v2-s2`, tag: 'p', content: article.content },
      { id: `${article.id}-v2-s3`, tag: 'h3', content: 'Section 2: Operational Mandates' },
      { id: `${article.id}-v2-s4`, tag: 'ol', content: [
        { id: `${article.id}-v2-s4-li1`, tag: 'p', content: 'The body shall convene no less than twice per standard year.' },
        { id: `${article.id}-v2-s4-li2`, tag: 'p', content: 'All proceedings must be recorded and made available for public review within thirty standard days.' },
      ]}
    ]}
  ],
  tags: ['governance', 'core-principle', 'legislation'],
  relatedCaseLaw: [
    { caseName: 'United Systems v. Hawthorne', citation: 'G.S.C. 2290 34.1', url: '/case/USvHawthorne', summary: 'Landmark case clarifying the interpretation of "public review" in Section 2.' },
  ]
}));

let MOCK_ANNOTATIONS: Annotation[] = [
  { id: 'anno1', articleId: 1, sectionId: '1-s2', range: [29, 44], text: "The term 'sovereign body' was intentionally chosen to echo pre-unification legal doctrines. See *The Federalist Papers, Vol. 3*. Fascinating linguistic choice.", author: MOCK_USERS[0], createdAt: '2023-01-20T15:00:00Z', replies: [], type: 'linguistic', visibility: 'public', upvotes: 15 },
  { id: 'anno2', articleId: 1, sectionId: '1-s2', range: [100, 120], text: "I think this part is too vague. Who defines what's 'just and equitable'?", author: MOCK_USERS[1], createdAt: '2023-05-11T10:00:00Z', replies: [], type: 'personal', visibility: 'public', upvotes: 3 },
];

let MOCK_COMMENTS: Comment[] = [
  { id: 'comm1', author: MOCK_USERS[0], content: "This entire article is a masterpiece of political philosophy.", createdAt: '2023-02-01T11:30:00Z', upvotes: 25, downvotes: 2, replies: [
    { id: 'comm2', author: MOCK_USERS[1], content: "I disagree. It gives too much power to the executive branch.", createdAt: '2023-02-02T09:00:00Z', upvotes: 10, downvotes: 5, replies: [], currentUserVote: null, sentiment: 'negative' },
  ], currentUserVote: 'up', sentiment: 'positive' },
  { id: 'comm3', author: MOCK_USERS[3], content: "Reminder: please keep discussion civil. (Rule 2.1)", createdAt: '2023-02-03T10:00:00Z', upvotes: 50, downvotes: 0, replies: [], currentUserVote: null, sentiment: 'neutral' },
];

const MOCK_GRAPH_DATA: { nodes: GraphNode[], edges: GraphEdge[] } = {
  nodes: [
    { id: 'art-1', type: 'article', label: 'Article I', data: {}, position: { x: 250, y: 5 } },
    { id: 'art-2', type: 'article', label: 'Article II', data: {}, position: { x: 100, y: 100 } },
    { id: 'case-1', type: 'case', label: 'US v. Hawthorne', data: {}, position: { x: 400, y: 100 } },
    { id: 'principle-1', type: 'principle', label: 'Separation of Powers', data: {}, position: { x: 250, y: 200 } },
  ],
  edges: [
    { id: 'e1-2', source: 'art-1', target: 'art-2', label: 'limits' },
    { id: 'e1-c1', source: 'art-1', target: 'case-1', label: 'interpreted by' },
    { id: 'e1-p1', source: 'art-1', target: 'principle-1', label: 'establishes' },
    { id: 'e2-p1', source: 'art-2', target: 'principle-1', label: 'establishes' },
  ]
};

export const mockApiCall = <T,>(data: T, delay = 500): Promise<T> =>
  new Promise(resolve => setTimeout(() => resolve(JSON.parse(JSON.stringify(data))), delay));

export const ConstitutionalApi = {
  fetchArticle: (id: number) => mockApiCall(MOCK_ARTICLES.find(a => a.id === id)),
  fetchAnnotations: (articleId: number) => mockApiCall(MOCK_ANNOTATIONS.filter(a => a.articleId === articleId)),
  postAnnotation: (annotation: Omit<Annotation, 'id' | 'createdAt' | 'author'>) => {
    const newAnnotation: Annotation = { ...annotation, id: `anno${Date.now()}`, createdAt: new Date().toISOString(), author: MOCK_USERS[1], replies: [], upvotes: 0 };
    MOCK_ANNOTATIONS.push(newAnnotation);
    return mockApiCall(newAnnotation);
  },
  fetchComments: (articleId: number) => mockApiCall(MOCK_COMMENTS),
  postComment: (articleId: number, content: string, parentId: string | null = null) => {
    const newComment: Comment = { id: `comm${Date.now()}`, author: MOCK_USERS[1], content, createdAt: new Date().toISOString(), upvotes: 1, downvotes: 0, replies: [], currentUserVote: 'up' };
    if (parentId) {
        // Logic to find and add reply omitted for brevity
    } else {
      MOCK_COMMENTS.unshift(newComment);
    }
    return mockApiCall(newComment);
  },
  voteOnComment: (commentId: string, vote: 'up' | 'down') => mockApiCall(true),
  fetchGraphData: (articleId: number) => mockApiCall(MOCK_GRAPH_DATA),
};

export const AIService = {
  summarize: (text: string, mode: UserPreferences['aiAssistantMode']) => mockApiCall(`This is a ${mode} AI summary of the provided text. It emphasizes key legal principles and operational mandates.`, 1200),
  explain: (term: string, mode: UserPreferences['aiAssistantMode']) => mockApiCall(`In a ${mode} manner, "${term}" refers to a core legal concept regarding governmental authority and jurisdiction.`, 1000),
  analyzeSentiment: (text: string): Promise<Sentiment> => {
    const score = Math.random();
    if (score > 0.7) return mockApiCall('positive', 300);
    if (score < 0.3) return mockApiCall('negative', 300);
    return mockApiCall('neutral', 300);
  },
  generateArgument: (topic: string, stance: 'for' | 'against') => mockApiCall(`Here is a well-reasoned argument ${stance} the topic of "${topic}", citing historical precedents and logical frameworks.`, 1500),
};

// --- UTILITY FUNCTIONS ---

export const formatDate = (isoString: string): string => new Date(isoString).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });

export const diffText = (oldText: string, newText: string) => {
    if (oldText === newText) return [{ type: 'equal', value: oldText }];
    return [{ type: 'deleted', value: oldText }, { type: 'added', value: newText }];
};

export const useDebounce = <T extends (...args: any[]) => any>(callback: T, delay: number) => {
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);
    return useCallback((...args: Parameters<T>) => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => { callback(...args); }, delay);
    }, [callback, delay]);
};

// --- CONTEXT & PROVIDERS FOR GLOBAL STATE ---

export const UserPreferencesContext = createContext<[UserPreferences, React.Dispatch<React.SetStateAction<UserPreferences>>] | null>(null);
export const UserPreferencesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [preferences, setPreferences] = useState<UserPreferences>({
        fontSize: 'medium', theme: 'dark', showAnnotations: 'all', enableTextToSpeech: false, aiAssistantMode: 'concise', showSentimentAnalysis: true,
    });
    return <UserPreferencesContext.Provider value={[preferences, setPreferences]}>{children}</UserPreferencesContext.Provider>;
};
export const useUserPreferences = () => {
    const context = useContext(UserPreferencesContext);
    if (!context) throw new Error('useUserPreferences must be used within a UserPreferencesProvider');
    return context;
};

type Notification = { id: number; message: string; type: 'success' | 'error' | 'info' };
type NotificationContextType = { addNotification: (message: string, type: Notification['type']) => void };
const NotificationContext = createContext<NotificationContextType | null>(null);
export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const addNotification = (message: string, type: Notification['type']) => {
        const id = Date.now();
        setNotifications(prev => [...prev, { id, message, type }]);
        setTimeout(() => {
            setNotifications(n => n.filter(notif => notif.id !== id));
        }, 5000);
    };
    return (
        <NotificationContext.Provider value={{ addNotification }}>
            {children}
            <div className="fixed bottom-4 right-4 z-[100] space-y-2">
                {notifications.map(n => <Toast key={n.id} message={n.message} type={n.type} />)}
            </div>
        </NotificationContext.Provider>
    );
};
export const useNotifier = () => {
    const context = useContext(NotificationContext);
    if (!context) throw new Error('useNotifier must be used within a NotificationProvider');
    return context;
};

// --- CUSTOM HOOKS FOR DATA FETCHING AND MANAGEMENT ---

export const useArticleData = (articleNumber: number) => {
  const [data, setData] = useState<{
    article: ConstitutionalArticle | null;
    annotations: Annotation[];
    comments: Comment[];
    graphData: { nodes: GraphNode[], edges: GraphEdge[] } | null;
  }>({ article: null, annotations: [], comments: [], graphData: null });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [articleData, annotationsData, commentsData, graphData] = await Promise.all([
        ConstitutionalApi.fetchArticle(articleNumber),
        ConstitutionalApi.fetchAnnotations(articleNumber),
        ConstitutionalApi.fetchComments(articleNumber),
        ConstitutionalApi.fetchGraphData(articleNumber),
      ]);
      if (!articleData) throw new Error('Article not found.');
      setData({ article: articleData, annotations: annotationsData, comments: commentsData, graphData });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  }, [articleNumber]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const setComments = (newComments: Comment[]) => setData(d => ({...d, comments: newComments}));
  const setAnnotations = (newAnnotations: Annotation[]) => setData(d => ({...d, annotations: newAnnotations}));

  return { ...data, isLoading, error, setComments, setAnnotations, refreshData: fetchData };
};


// --- UI HELPER & ATOMIC COMPONENTS ---

export const LoadingSpinner: React.FC = () => (
  <div className="flex justify-center items-center p-8"><div className="w-16 h-16 border-4 border-teal-400 border-dashed rounded-full animate-spin"></div></div>
);

export const ErrorMessage: React.FC<{ message: string }> = ({ message }) => (
  <Card title="Error"><p className="text-red-400">{message}</p></Card>
);

export const Icon: React.FC<{ name: string; className?: string }> = ({ name, className = "w-6 h-6" }) => {
    const icons: { [key: string]: JSX.Element } = {
        comment: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />,
        upvote: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />,
        downvote: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />,
        close: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />,
        add: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />,
        ai: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />,
        graph: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />,
    };
    return <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">{icons[name]}</svg>;
};

export const UserAvatar: React.FC<{ user: User; size?: 'sm' | 'md' | 'lg' }> = ({ user, size = 'md' }) => {
    const sizeClasses = { sm: 'w-8 h-8', md: 'w-10 h-10', lg: 'w-16 h-16' };
    return (
        <div className={`relative ${sizeClasses[size]}`}>
            <img src={user.avatarUrl || `https://i.pravatar.cc/150?u=${user.id}`} alt={user.name} className="rounded-full object-cover w-full h-full" />
            {user.role === 'scholar' && <span title="Verified Scholar" className="absolute bottom-0 right-0 block h-3 w-3 rounded-full bg-blue-500 ring-2 ring-gray-800" />}
        </div>
    );
};

const Toast: React.FC<Notification> = ({ message, type }) => {
  const baseClasses = "px-4 py-3 rounded-md text-white shadow-lg animate-fade-in-up flex items-center";
  const typeClasses = {
    success: "bg-green-600",
    error: "bg-red-600",
    info: "bg-blue-600",
  };
  return <div className={`${baseClasses} ${typeClasses[type]}`}>{message}</div>;
};


// --- COMPLEX FEATURE COMPONENTS ---

const enrichContentWithAnnotations = (
  content: string,
  annotations: Annotation[],
  sectionId: string
): ReactNode[] => {
  const relevantAnnotations = annotations.filter(a => a.sectionId === sectionId);
  if (relevantAnnotations.length === 0) return [content];

  const markers = new Set<number>();
  relevantAnnotations.forEach(a => {
    markers.add(a.range[0]);
    markers.add(a.range[1]);
  });
  
  const splitPoints = Array.from(markers).sort((a, b) => a - b);
  if (splitPoints[0] !== 0) splitPoints.unshift(0);
  if (splitPoints[splitPoints.length - 1] !== content.length) splitPoints.push(content.length);

  const segments: ReactNode[] = [];
  for (let i = 0; i < splitPoints.length - 1; i++) {
    const start = splitPoints[i];
    const end = splitPoints[i + 1];
    const mid = Math.floor((start + end) / 2);
    const text = content.substring(start, end);
    const intersectingAnnotations = relevantAnnotations.filter(a => a.range[0] <= mid && a.range[1] > mid);
    
    if (intersectingAnnotations.length > 0) {
      segments.push(
        <span key={start} className="bg-teal-900/50 hover:bg-teal-800/70 cursor-pointer rounded px-1 py-0.5 relative group">
          {text}
          <div className="absolute bottom-full mb-2 w-72 bg-gray-900 text-white p-3 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
            {intersectingAnnotations.map(anno => (
              <div key={anno.id} className="border-b border-gray-700 last:border-b-0 py-2">
                <p className="text-sm">{anno.text}</p>
                <p className="text-xs text-gray-400 mt-1">- {anno.author.name}</p>
              </div>
            ))}
          </div>
        </span>
      );
    } else {
      segments.push(text);
    }
  }
  return segments;
};

export const ArticleContentRenderer: React.FC<{
  sections: ArticleSection[];
  annotations: Annotation[];
  onTextSelect: (sectionId: string, range: [number, number], text: string) => void;
}> = ({ sections, annotations, onTextSelect }) => {
    
    const handleMouseUp = (e: React.MouseEvent<HTMLDivElement>) => {
        const selection = window.getSelection();
        if (!selection || selection.rangeCount === 0 || selection.isCollapsed) return;
        const range = selection.getRangeAt(0);
        const sectionEl = range.startContainer.parentElement?.closest('[data-section-id]');
        if (sectionEl) {
            const sectionId = sectionEl.getAttribute('data-section-id')!;
            const selectedText = selection.toString();
            const start = range.startOffset;
            const end = start + selectedText.length;
            onTextSelect(sectionId, [start, end], selectedText);
        }
    };

    const renderSection = (section: ArticleSection): JSX.Element => {
        const { id, tag, content, crossReferences } = section;
        const Tag = tag as keyof JSX.IntrinsicElements;
        
        if (typeof content === 'string') {
            return (
                <Tag key={id} data-section-id={id} className="mb-4 leading-relaxed text-lg">
                    {enrichContentWithAnnotations(content, annotations, id)}
                    {crossReferences && crossReferences.map((ref, i) => (
                        <a key={i} href={`#`} className="text-teal-400 hover:underline ml-2">({ref.text})</a>
                    ))}
                </Tag>
            );
        }

        return <Tag key={id} data-section-id={id} className="list-decimal pl-6 space-y-2">{content.map(child => <li key={child.id}>{renderSection(child)}</li>)}</Tag>;
    };

    return <div onMouseUp={handleMouseUp} className="prose prose-invert max-w-none text-gray-300">{sections.map(renderSection)}</div>;
};

export const AnnotationCreator: React.FC<{
  selection: { sectionId: string; range: [number, number]; text: string };
  onClose: () => void;
  onSave: (annotation: Omit<Annotation, 'id' | 'createdAt' | 'author'>) => void;
}> = ({ selection, onClose, onSave }) => {
    const [text, setText] = useState('');
    const [type, setType] = useState<'historical' | 'legal' | 'linguistic' | 'personal'>('legal');
    const [visibility, setVisibility] = useState<'public' | 'private'>('public');

    const handleSave = () => {
        onSave({ articleId: 0, sectionId: selection.sectionId, range: selection.range, text, type, visibility, replies: [], upvotes: 0 });
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
            <div className="bg-gray-800 rounded-lg p-6 w-full max-w-lg animate-fade-in-up">
                <h3 className="text-xl font-bold text-white mb-4">Create Annotation</h3>
                <p className="text-gray-400 mb-4 italic border-l-4 border-teal-500 pl-4">"{selection.text}"</p>
                <textarea value={text} onChange={(e) => setText(e.target.value)} className="w-full bg-gray-900 text-white p-2 rounded-md h-32" placeholder="Your analysis or comment..."></textarea>
                <div className="flex justify-between items-center mt-4">
                    <select value={type} onChange={e => setType(e.target.value as any)} className="bg-gray-900 text-white p-2 rounded-md"><option value="legal">Legal Analysis</option><option value="historical">Historical</option><option value="linguistic">Linguistic</option><option value="personal">Personal</option></select>
                    <select value={visibility} onChange={e => setVisibility(e.target.value as any)} className="bg-gray-900 text-white p-2 rounded-md"><option value="public">Public</option><option value="private">Private</option></select>
                </div>
                <div className="flex justify-end space-x-4 mt-6">
                    <button onClick={onClose} className="px-4 py-2 rounded-md text-white bg-gray-600 hover:bg-gray-500">Cancel</button>
                    <button onClick={handleSave} className="px-4 py-2 rounded-md text-white bg-teal-600 hover:bg-teal-500 disabled:opacity-50" disabled={!text}>Save</button>
                </div>
            </div>
        </div>
    );
};

export const AnnotationsSidebar: React.FC<{ annotations: Annotation[], onClose: () => void }> = ({ annotations, onClose }) => {
    return (
        <div className="fixed top-0 right-0 h-full w-96 bg-gray-900 shadow-lg p-6 space-y-4 overflow-y-auto z-40 transform animate-slide-in-left">
            <div className="flex justify-between items-center"><h3 className="text-2xl font-bold text-white">Annotations</h3><button onClick={onClose} className="text-gray-400 hover:text-white"><Icon name="close" /></button></div>
            {annotations.length === 0 ? (<p className="text-gray-400">No annotations yet.</p>) : (annotations.map(anno => (
                <div key={anno.id} className="bg-gray-800 p-4 rounded-lg">
                    <div className="flex items-start space-x-3"><UserAvatar user={anno.author} size="sm" /><div><p className="font-bold text-white">{anno.author.name}</p><p className="text-xs text-gray-400">{formatDate(anno.createdAt)}</p></div></div>
                    <p className="mt-3 text-gray-300">{anno.text}</p>
                    <div className="flex items-center justify-between mt-3 text-xs text-gray-400"><span className="px-2 py-1 bg-blue-900 text-blue-300 rounded-full">{anno.type}</span><span>{anno.upvotes} upvotes</span></div>
                </div>)))}
        </div>
    );
};

export const CommentComponent: React.FC<{ comment: Comment; onReply: (id: string) => void }> = ({ comment, onReply }) => {
    const [preferences] = useUserPreferences();
    const sentimentIcons = {
        positive: '😊',
        negative: '😞',
        neutral: '😐',
        mixed: '🤔'
    };
    return (
        <div className="flex space-x-4">
            <UserAvatar user={comment.author} />
            <div className="flex-1">
                <div className="bg-gray-800 p-4 rounded-lg rounded-tl-none">
                    <div className="flex justify-between items-center">
                        <span className="font-bold text-teal-300">{comment.author.name}</span>
                        <div className="flex items-center space-x-2">
                           {preferences.showSentimentAnalysis && comment.sentiment && <span title={`Sentiment: ${comment.sentiment}`}>{sentimentIcons[comment.sentiment]}</span>}
                           <span className="text-xs text-gray-400">{formatDate(comment.createdAt)}</span>
                        </div>
                    </div>
                    <p className="text-gray-300 mt-2">{comment.content}</p>
                </div>
                <div className="flex items-center space-x-4 mt-2 text-sm text-gray-400">
                    <button className="flex items-center space-x-1 hover:text-white"><Icon name="upvote" className="w-4 h-4" /> <span>{comment.upvotes}</span></button>
                    <button className="flex items-center space-x-1 hover:text-white"><Icon name="downvote" className="w-4 h-4" /> <span>{comment.downvotes}</span></button>
                    <button onClick={() => onReply(comment.id)} className="hover:text-white">Reply</button>
                </div>
                <div className="mt-4 space-y-4 pl-6 border-l-2 border-gray-700">{comment.replies.map(reply => <CommentComponent key={reply.id} comment={reply} onReply={onReply} />)}</div>
            </div>
        </div>
    );
};

export const DiscussionForum: React.FC<{ articleId: number; comments: Comment[]; onCommentsChange: (comments: Comment[]) => void; }> = ({ articleId, comments, onCommentsChange }) => {
    const [newComment, setNewComment] = useState("");
    const handlePostComment = async () => { if (!newComment.trim()) return; await ConstitutionalApi.postComment(articleId, newComment); /* refresh logic here */ setNewComment(""); };
    return (
        <div className="mt-8"><h3 className="text-2xl font-bold text-white mb-4">Discussion</h3><div className="bg-gray-800 p-4 rounded-lg"><textarea className="w-full bg-gray-900 text-white p-2 rounded-md h-24" placeholder="Share your thoughts..." value={newComment} onChange={(e) => setNewComment(e.target.value)} /><div className="flex justify-end mt-2"><button onClick={handlePostComment} className="px-4 py-2 rounded-md text-white bg-teal-600 hover:bg-teal-500 disabled:opacity-50" disabled={!newComment.trim()}>Post</button></div></div><div className="mt-6 space-y-6">{comments.map(comment => <CommentComponent key={comment.id} comment={comment} onReply={() => {}} />)}</div></div>
    );
};

export const VersionComparisonView: React.FC<{ versionA: HistoricalVersion; versionB: HistoricalVersion; }> = ({ versionA, versionB }) => {
    const textA = versionA.fullText.map(s => typeof s.content === 'string' ? s.content : '').join('\n');
    const textB = versionB.fullText.map(s => typeof s.content === 'string' ? s.content : '').join('\n');
    const diffResult = diffText(textA, textB);
    return <Card title={`Comparing ${versionA.versionId} and ${versionB.versionId}`}><pre className="whitespace-pre-wrap font-mono text-sm">{diffResult.map((part, index) => part.type === 'added' ? <span key={index} className="bg-green-900 text-green-200">{part.value}</span> : part.type === 'deleted' ? <span key={index} className="bg-red-900 text-red-200 line-through">{part.value}</span> : <span key={index}>{part.value}</span>)}</pre></Card>;
};

export const KnowledgeGraphView: React.FC<{ data: { nodes: GraphNode[], edges: GraphEdge[] } }> = ({ data }) => {
    if (!data) return <p>No graph data available.</p>;
    return (
        <Card title="Knowledge Graph">
            <div className="relative h-[500px] bg-gray-800 rounded-lg overflow-hidden">
                <svg className="absolute w-full h-full">
                    {data.edges.map(edge => {
                        const sourceNode = data.nodes.find(n => n.id === edge.source);
                        const targetNode = data.nodes.find(n => n.id === edge.target);
                        if (!sourceNode || !targetNode) return null;
                        return <line key={edge.id} x1={sourceNode.position.x} y1={sourceNode.position.y} x2={targetNode.position.x} y2={targetNode.position.y} stroke="#4A5568" strokeWidth="2" />;
                    })}
                </svg>
                {data.nodes.map(node => (
                    <div key={node.id} className="absolute p-2 rounded-md shadow-lg text-white text-center cursor-pointer hover:scale-105 transition-transform" style={{ left: `${node.position.x}px`, top: `${node.position.y}px`, transform: 'translate(-50%, -50%)', backgroundColor: node.type === 'article' ? '#319795' : node.type === 'case' ? '#B7791F' : '#4C51BF' }}>
                        <div className="font-bold">{node.label}</div>
                        <div className="text-xs capitalize">{node.type}</div>
                    </div>
                ))}
            </div>
        </Card>
    );
};

export const AICompanionPanel: React.FC<{ article: ConstitutionalArticle, onClose: () => void }> = ({ article, onClose }) => {
    const [messages, setMessages] = useState<{ sender: 'user' | 'ai'; text: string }[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [preferences] = useUserPreferences();

    const handleSend = async () => {
        if (!input.trim()) return;
        const userMessage = { sender: 'user' as const, text: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);
        const aiResponse = await AIService.explain(input, preferences.aiAssistantMode);
        setMessages(prev => [...prev, { sender: 'ai' as const, text: aiResponse }]);
        setIsLoading(false);
    };

    return (
        <div className="fixed bottom-4 right-4 w-96 h-[500px] bg-gray-900 shadow-2xl rounded-lg z-50 flex flex-col animate-fade-in-up">
            <div className="flex justify-between items-center p-3 bg-gray-800 rounded-t-lg"><h3 className="text-lg font-bold text-white">AI Companion</h3><button onClick={onClose} className="text-gray-400 hover:text-white"><Icon name="close" /></button></div>
            <div className="flex-1 p-4 space-y-4 overflow-y-auto">{messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`p-3 rounded-lg max-w-xs ${msg.sender === 'user' ? 'bg-teal-600 text-white' : 'bg-gray-700 text-gray-200'}`}>{msg.text}</div>
                </div>
            ))}
            {isLoading && <div className="text-center text-gray-400">AI is thinking...</div>}
            </div>
            <div className="p-3 border-t border-gray-700 flex space-x-2"><input type="text" value={input} onChange={e => setInput(e.target.value)} onKeyPress={e => e.key === 'Enter' && handleSend()} className="flex-1 bg-gray-800 p-2 rounded-md text-white" placeholder="Ask about this article..." /><button onClick={handleSend} className="px-4 py-2 bg-teal-600 rounded-md text-white">Send</button></div>
        </div>
    );
};

// --- MAIN VIEW COMPONENT (REFACTORED AND EXPANDED) ---

interface ConstitutionalArticleViewProps { articleNumber: number }
type ViewState = {
  activeTab: 'content' | 'history' | 'cases' | 'graph';
  activeSidePanel: 'none' | 'annotations' | 'discussion';
  selectedVersion: string | null;
  selectionForAnnotation: { sectionId: string; range: [number, number]; text: string } | null;
  showAICompanion: boolean;
  articleSummary: string | null;
  isSummaryLoading: boolean;
};
type ViewAction = 
  | { type: 'SET_TAB'; payload: ViewState['activeTab'] }
  | { type: 'TOGGLE_SIDE_PANEL'; payload: 'annotations' | 'discussion' }
  | { type: 'SET_SELECTION'; payload: ViewState['selectionForAnnotation'] }
  | { type: 'TOGGLE_AI_COMPANION' }
  | { type: 'SET_SUMMARY'; payload: { summary: string | null; isLoading: boolean } };

const initialState: ViewState = { activeTab: 'content', activeSidePanel: 'none', selectedVersion: null, selectionForAnnotation: null, showAICompanion: false, articleSummary: null, isSummaryLoading: false };
const viewReducer = (state: ViewState, action: ViewAction): ViewState => {
  switch (action.type) {
    case 'SET_TAB': return { ...state, activeTab: action.payload };
    case 'TOGGLE_SIDE_PANEL': return { ...state, activeSidePanel: state.activeSidePanel === action.payload ? 'none' : action.payload };
    case 'SET_SELECTION': return { ...state, selectionForAnnotation: action.payload };
    case 'TOGGLE_AI_COMPANION': return { ...state, showAICompanion: !state.showAICompanion };
    case 'SET_SUMMARY': return { ...state, articleSummary: action.payload.summary, isSummaryLoading: action.payload.isLoading };
    default: return state;
  }
};

const ConstitutionalArticleViewInternal: React.FC<ConstitutionalArticleViewProps> = ({ articleNumber }) => {
  const { article, annotations, comments, graphData, isLoading, error, setComments, setAnnotations } = useArticleData(articleNumber);
  const [state, dispatch] = useReducer(viewReducer, initialState);
  const [preferences] = useUserPreferences();
  const notifier = useNotifier();

  const handleTextSelect = useCallback((sectionId: string, range: [number, number], text: string) => dispatch({ type: 'SET_SELECTION', payload: { sectionId, range, text } }), []);

  const handleSaveAnnotation = useCallback(async (newAnnotationData: Omit<Annotation, 'id' | 'createdAt' | 'author'>) => {
      if (!article) return;
      const newAnnotation = await ConstitutionalApi.postAnnotation({ ...newAnnotationData, articleId: article.id });
      setAnnotations([newAnnotation, ...annotations]);
      notifier.addNotification('Annotation saved!', 'success');
  }, [article, annotations, setAnnotations, notifier]);

  const handleSummarize = useCallback(async () => {
    if (!article) return;
    dispatch({ type: 'SET_SUMMARY', payload: { summary: null, isLoading: true } });
    const fullText = article.content.map(c => typeof c.content === 'string' ? c.content : '').join(' ');
    const summary = await AIService.summarize(fullText, preferences.aiAssistantMode);
    dispatch({ type: 'SET_SUMMARY', payload: { summary, isLoading: false } });
    notifier.addNotification('AI summary generated.', 'info');
  }, [article, preferences.aiAssistantMode, notifier]);
  
  if (isLoading) return <LoadingSpinner />;
  if (error || !article) return <ErrorMessage message={error || 'Article not found.'} />;
  
  const currentVersion = article.history.find(v => v.versionId === (state.selectedVersion || article.currentVersionId))!;
  const fontSizeClass = { small: 'text-sm', medium: 'text-base', large: 'text-lg' }[preferences.fontSize];

  return (
    <div className={`space-y-6 font-serif animate-fade-in ${fontSizeClass}`}>
      <div className="flex justify-between items-start">
        <div>
            <h2 className="text-3xl font-bold text-white tracking-wider">Article {article.romanNumeral} — {article.title}</h2>
            <p className="text-gray-400 mt-2 max-w-3xl">{article.summary}</p>
            <div className="mt-3 flex space-x-2">{article.tags.map(tag => <span key={tag} className="px-2 py-1 text-xs bg-gray-700 text-teal-300 rounded-full">{tag}</span>)}</div>
        </div>
        <div className="flex space-x-2">
            <button onClick={handleSummarize} className="px-3 py-2 rounded-md bg-purple-600 text-white flex items-center space-x-2 hover:bg-purple-500"><Icon name="ai" className="w-5 h-5" /><span>Summarize</span></button>
            <button onClick={() => dispatch({type: 'TOGGLE_SIDE_PANEL', payload: 'annotations'})} className={`px-3 py-2 rounded-md ${state.activeSidePanel === 'annotations' ? 'bg-teal-600' : 'bg-gray-700'} text-white`}>Annotations ({annotations.length})</button>
        </div>
      </div>
      
      {state.isSummaryLoading && <p className="text-purple-300">Generating AI summary...</p>}
      {state.articleSummary && <Card title="AI Summary"><p className="text-gray-300 italic">{state.articleSummary}</p></Card>}

      <div className="border-b border-gray-700"><nav className="-mb-px flex space-x-8" aria-label="Tabs">{['content', 'history', 'cases', 'graph'].map(tabName => (
          <button key={tabName} onClick={() => dispatch({type: 'SET_TAB', payload: tabName as any})} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm capitalize ${state.activeTab === tabName ? 'border-teal-500 text-teal-400' : 'border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-500'}`}>
              {tabName === 'content' ? 'Article Text' : tabName === 'cases' ? 'Case Law' : tabName}
          </button>
      ))}</nav></div>
      
      {state.activeTab === 'content' && <Card><ArticleContentRenderer sections={currentVersion.fullText} annotations={annotations} onTextSelect={handleTextSelect} /></Card>}
      {state.activeTab === 'history' && <div className="space-y-4">{article.history.map(v => <Card key={v.versionId}><h4 className="font-bold text-xl text-teal-300">Version {v.versionId} ({formatDate(v.dateEnacted)})</h4><p className="text-gray-400 mt-1"><strong>Changes:</strong> {v.summaryOfChanges}</p></Card>)}</div>}
      {state.activeTab === 'cases' && <div className="space-y-4">{article.relatedCaseLaw.map(c => <Card key={c.citation}><h4 className="font-bold text-xl text-teal-300">{c.caseName}</h4><p className="text-gray-400 font-mono text-sm">{c.citation}</p><p className="mt-2 text-gray-300">{c.summary}</p></Card>)}</div>}
      {state.activeTab === 'graph' && graphData && <KnowledgeGraphView data={graphData} />}

      <DiscussionForum articleId={article.id} comments={comments} onCommentsChange={setComments} />
      
      {state.activeSidePanel === 'annotations' && <AnnotationsSidebar annotations={annotations} onClose={() => dispatch({ type: 'TOGGLE_SIDE_PANEL', payload: 'annotations'})} />}
      {state.selectionForAnnotation && <AnnotationCreator selection={state.selectionForAnnotation} onClose={() => dispatch({ type: 'SET_SELECTION', payload: null })} onSave={handleSaveAnnotation} />}
      
      <button onClick={() => dispatch({type: 'TOGGLE_AI_COMPANION'})} className="fixed bottom-4 left-4 bg-teal-600 text-white rounded-full p-4 shadow-lg hover:bg-teal-500 z-50"><Icon name="ai" /></button>
      {state.showAICompanion && <AICompanionPanel article={article} onClose={() => dispatch({ type: 'TOGGLE_AI_COMPANION' })}/>}

      <style>{`
        .prose strong { color: #81e6d9; }
        @keyframes fade-in { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fade-in-up { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes slide-in-left { from { transform: translateX(100%); } to { transform: translateX(0); } }
        .animate-fade-in { animation: fade-in 0.5s ease-out forwards; }
        .animate-fade-in-up { animation: fade-in-up 0.3s ease-out forwards; }
        .animate-slide-in-left { animation: slide-in-left 0.3s ease-out forwards; }
        ::selection { background-color: #81e6d9; color: #1a202c; }
      `}</style>
    </div>
  );
};

const ConstitutionalArticleView: React.FC<ConstitutionalArticleViewProps> = (props) => (
    <UserPreferencesProvider>
        <NotificationProvider>
            <ConstitutionalArticleViewInternal {...props} />
        </NotificationProvider>
    </UserPreferencesProvider>
);

export default ConstitutionalArticleView;