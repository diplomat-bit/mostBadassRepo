// REPOSITORY SOURCE: diplomat-bit/Citibank_Demo_Business_Inc_Demonstration- | PATH: diplomat-bit-Citibank_Demo_Business_Inc_Demonstration--ab2501d/components/views/platform/RoadmapView.tsx
================================================================================

import React, { useState, useReducer, useEffect, useMemo, useCallback, useRef, createContext, useContext, DragEvent } from 'react';
import Card from '../../Card';

// SECTION: Type Definitions for a Real-World Roadmap Application

/**
 * Represents the possible statuses of a roadmap item.
 */
export type Status = 'On Track' | 'At Risk' | 'Delayed' | 'Completed' | 'Backlog' | 'In Progress';

/**
 * Represents the priority level of a roadmap item.
 */
export type Priority = 'Highest' | 'High' | 'Medium' | 'Low';

/**
 * Defines the type of work for a roadmap item.
 */
export type ItemType = 'Feature' | 'Bug' | 'Spike' | 'Tech Debt' | 'Initiative' | 'Epic';

/**
 * Represents the quarters of a year.
 */
export type Quarter = 'Q1' | 'Q2' | 'Q3' | 'Q4';

/**
 * Represents an external resource linked to a roadmap item (e.g., Jira ticket, GitHub PR).
 */
export interface LinkedResource {
    id: string;
    platform: 'Jira' | 'GitHub' | 'Salesforce' | 'Zendesk';
    url: string;
    summary: string;
    status?: string;
}

/**
 * Represents a user or team member.
 */
export interface User {
  id: string;
  name: string;
  avatarUrl?: string;
  email: string;
}

/**
 * Represents a team within the organization.
 */
export interface Team {
  id: string;
  name: string;
  color: string; // e.g., 'bg-blue-500'
}

/**
 * Represents a strategic theme or category.
 */
export interface Theme {
  id: string;
  name: string;
  color: string; // e.g., 'text-purple-400'
}

/**
 * Represents a comment on a roadmap item.
 */
export interface Comment {
  id: string;
  author: User;
  content: string;
  timestamp: string;
  reactions?: { [emoji: string]: string[] }; // emoji -> user IDs
}

/**
 * Represents a dependency between roadmap items.
 */
export interface Dependency {
  targetItemId: string;
  type: 'blocks' | 'is_blocked_by';
}

/**
 * Represents AI-generated analysis of a roadmap item.
 */
export interface AIAnalysis {
    riskLevel: 'Low' | 'Medium' | 'High' | 'Unknown';
    riskReasoning: string;
    generatedSummary: string;
}

/**
 * Represents a single item on the strategic roadmap.
 */
export interface RoadmapItem {
  id: string;
  title: string;
  description: string;
  status: Status;
  priority: Priority;
  itemType: ItemType;
  quarter: Quarter;
  year: number;
  startDate: string; // ISO Date string
  endDate: string;   // ISO Date string
  owner: User;
  team: Team;
  theme: Theme;
  progress: number; // Percentage from 0-100
  effort: number; // Story points or t-shirt size (e.g., 1, 2, 3, 5, 8)
  dependencies: Dependency[];
  comments: Comment[];
  linkedResources: LinkedResource[];
  aiAnalysis?: AIAnalysis;
  lastUpdated: string;
  createdAt: string;
  order: number; // For sorting within a quarter
  tags?: string[];
}

/**
 * Defines the structure for roadmap filters.
 */
export interface RoadmapFilters {
  searchTerm: string;
  teams: string[];
  statuses: Status[];
  priorities: Priority[];
  themes: string[];
  itemTypes: ItemType[];
  ownerIds: string[];
}

/**
 * Defines the state for the entire roadmap view.
 */
export interface RoadmapState {
  items: RoadmapItem[];
  isLoading: boolean;
  error: string | null;
  filters: RoadmapFilters;
  viewMode: 'quarterly' | 'timeline';
  swimlaneBy: 'none' | 'team' | 'theme';
  showDependencies: boolean;
  isCompactView: boolean;
  editingItemId: string | null;
}

// SECTION: Constants and Mock Data

export const MOCK_USERS: User[] = [
    { id: 'user-1', name: 'Alice Johnson', avatarUrl: 'https://i.pravatar.cc/150?u=user-1', email: 'alice@example.com' },
    { id: 'user-2', name: 'Bob Williams', avatarUrl: 'https://i.pravatar.cc/150?u=user-2', email: 'bob@example.com' },
    { id: 'user-3', name: 'Charlie Brown', avatarUrl: 'https://i.pravatar.cc/150?u=user-3', email: 'charlie@example.com' },
    { id: 'user-4', name: 'Diana Prince', avatarUrl: 'https://i.pravatar.cc/150?u=user-4', email: 'diana@example.com' },
    { id: 'user-5', name: 'Ethan Hunt', avatarUrl: 'https://i.pravatar.cc/150?u=user-5', email: 'ethan@example.com' },
];

export const MOCK_TEAMS: Team[] = [
    { id: 'team-1', name: 'Phoenix', color: 'bg-red-500' },
    { id: 'team-2', name: 'Cobra', color: 'bg-green-500' },
    { id: 'team-3', name: 'Omega', color: 'bg-blue-500' },
    { id: 'team-4', name: 'Hydra', color: 'bg-yellow-500' },
];

export const MOCK_THEMES: Theme[] = [
    { id: 'theme-1', name: 'User Growth', color: 'text-purple-400' },
    { id: 'theme-2', name: 'Platform Stability', color: 'text-indigo-400' },
    { id: 'theme-3', name: 'Internal Tooling', color: 'text-teal-400' },
    { id: 'theme-4', name: 'Revenue Optimization', color: 'text-pink-400' },
];

export const MOCK_ROADMAP_ITEMS: RoadmapItem[] = [
    {
        id: 'item-1',
        title: 'New User Onboarding Flow',
        description: 'Revamp the entire user onboarding experience to improve activation rates. This involves creating a new multi-step wizard, integrating with third-party data enrichment services, and personalizing the flow based on user personas.',
        status: 'On Track',
        priority: 'Highest',
        itemType: 'Initiative',
        quarter: 'Q3',
        year: 2024,
        startDate: '2024-07-01',
        endDate: '2024-09-20',
        owner: MOCK_USERS[0],
        team: MOCK_TEAMS[0],
        theme: MOCK_THEMES[0],
        progress: 65,
        effort: 8,
        dependencies: [],
        comments: [
            { id: 'c1', author: MOCK_USERS[1], content: 'Initial designs look promising!', timestamp: '2024-07-10T10:00:00Z' }
        ],
        linkedResources: [
            {id: 'JIRA-123', platform: 'Jira', url: '#', summary: 'Epic for new onboarding', status: 'In Progress'}
        ],
        lastUpdated: '2024-07-15T10:00:00Z',
        createdAt: '2024-06-01T09:00:00Z',
        order: 0,
        tags: ['onboarding', 'growth-hack'],
    },
    {
        id: 'item-2',
        title: 'Migrate DB to Aurora',
        description: 'Migrate the main production database from RDS to Aurora for better scalability and performance.',
        status: 'In Progress',
        priority: 'High',
        itemType: 'Tech Debt',
        quarter: 'Q3',
        year: 2024,
        startDate: '2024-08-05',
        endDate: '2024-09-28',
        owner: MOCK_USERS[2],
        team: MOCK_TEAMS[2],
        theme: MOCK_THEMES[1],
        progress: 40,
        effort: 13,
        dependencies: [{ targetItemId: 'item-3', type: 'is_blocked_by' }],
        comments: [],
        linkedResources: [],
        lastUpdated: '2024-07-12T14:30:00Z',
        createdAt: '2024-05-20T11:00:00Z',
        order: 1,
        tags: ['database', 'infra'],
    },
    {
        id: 'item-3',
        title: 'CI/CD Pipeline Optimization',
        description: 'Reduce build and deployment times by 50% by optimizing the CI/CD pipeline.',
        status: 'Completed',
        priority: 'Medium',
        itemType: 'Internal Tooling',
        quarter: 'Q2',
        year: 2024,
        startDate: '2024-04-15',
        endDate: '2024-06-25',
        owner: MOCK_USERS[4],
        team: MOCK_TEAMS[3],
        theme: MOCK_THEMES[2],
        progress: 100,
        effort: 5,
        dependencies: [],
        comments: [],
        linkedResources: [],
        lastUpdated: '2024-06-28T18:00:00Z',
        createdAt: '2024-04-10T16:00:00Z',
        order: 0,
        tags: ['devops', 'ci-cd'],
    },
    {
        id: 'item-4',
        title: 'Implement Subscription Tiers',
        description: 'Introduce new subscription tiers (Basic, Pro, Enterprise) to drive revenue.',
        status: 'At Risk',
        priority: 'Highest',
        itemType: 'Feature',
        quarter: 'Q4',
        year: 2024,
        startDate: '2024-10-01',
        endDate: '2024-12-15',
        owner: MOCK_USERS[1],
        team: MOCK_TEAMS[1],
        theme: MOCK_THEMES[3],
        progress: 15,
        effort: 21,
        dependencies: [{ targetItemId: 'item-1', type: 'blocks' }],
        comments: [],
        linkedResources: [],
        lastUpdated: '2024-07-14T12:00:00Z',
        createdAt: '2024-07-01T10:00:00Z',
        order: 0,
        tags: ['monetization', 'billing'],
    },
    {
        id: 'item-5',
        title: 'Admin Dashboard V2',
        description: 'Build a new admin dashboard with advanced analytics and user management features.',
        status: 'Backlog',
        priority: 'High',
        itemType: 'Epic',
        quarter: 'Q4',
        year: 2024,
        startDate: '2024-10-10',
        endDate: '2024-12-20',
        owner: MOCK_USERS[3],
        team: MOCK_TEAMS[2],
        theme: MOCK_THEMES[2],
        progress: 0,
        effort: 13,
        dependencies: [],
        comments: [],
        linkedResources: [],
        lastUpdated: '2024-07-01T00:00:00Z',
        createdAt: '2024-07-01T00:00:00Z',
        order: 1,
    },
    {
        id: 'item-6',
        title: 'GDPR Compliance Audit',
        description: 'Conduct a full audit of the platform to ensure GDPR compliance.',
        status: 'On Track',
        priority: 'High',
        itemType: 'Initiative',
        quarter: 'Q3',
        year: 2024,
        startDate: '2024-07-15',
        endDate: '2024-08-30',
        owner: MOCK_USERS[0],
        team: MOCK_TEAMS[3],
        theme: MOCK_THEMES[1],
        progress: 80,
        effort: 8,
        dependencies: [],
        comments: [],
        linkedResources: [],
        lastUpdated: '2024-07-10T09:00:00Z',
        createdAt: '2024-06-15T09:00:00Z',
        order: 2,
    },
    {
        id: 'item-7',
        title: 'Real-time Collaboration Feature',
        description: 'Enable multiple users to edit the same document in real-time.',
        status: 'Backlog',
        priority: 'Medium',
        itemType: 'Feature',
        quarter: 'Q1',
        year: 2025,
        startDate: '2025-01-10',
        endDate: '2025-03-25',
        owner: MOCK_USERS[1],
        team: MOCK_TEAMS[0],
        theme: MOCK_THEMES[0],
        progress: 0,
        effort: 21,
        dependencies: [],
        comments: [],
        linkedResources: [],
        lastUpdated: '2024-07-05T00:00:00Z',
        createdAt: '2024-07-05T00:00:00Z',
        order: 0,
    },
    {
        id: 'item-8',
        title: 'Mobile App Performance Improvements',
        description: 'Improve mobile app startup time and reduce memory footprint.',
        status: 'Delayed',
        priority: 'High',
        itemType: 'Tech Debt',
        quarter: 'Q2',
        year: 2024,
        startDate: '2024-05-01',
        endDate: '2024-06-30',
        owner: MOCK_USERS[2],
        team: MOCK_TEAMS[1],
        theme: MOCK_THEMES[1],
        progress: 90,
        effort: 8,
        dependencies: [],
        comments: [],
        linkedResources: [],
        lastUpdated: '2024-07-15T11:00:00Z',
        createdAt: '2024-04-01T10:00:00Z',
        order: 1,
    }
];

// SECTION: AI & Integration Mock Services

const AIService = {
    async analyzeItem(item: RoadmapItem): Promise<AIAnalysis> {
        return new Promise(resolve => setTimeout(() => {
            let riskLevel: 'Low' | 'Medium' | 'High' = 'Low';
            let riskReasoning = 'The project plan seems solid with clear goals and ownership.';
            if (item.dependencies.length > 2 || item.effort > 13) {
                riskLevel = 'Medium';
                riskReasoning = 'High effort and multiple dependencies increase complexity and potential for delays.';
            }
            if (item.status === 'At Risk' || item.status === 'Delayed' || item.progress < 20 && item.effort > 8) {
                riskLevel = 'High';
                riskReasoning = 'The item is already flagged as at risk or delayed, with significant work remaining. There is a high probability of not meeting the deadline without intervention.';
            }
            
            const summary = `This ${item.itemType}, "${item.title}", is led by ${item.owner.name} and owned by Team ${item.team.name}. With a priority of ${item.priority} and an effort score of ${item.effort}, it is currently ${item.progress}% complete. The AI assesses the risk level as ${riskLevel}.`;

            resolve({
                riskLevel,
                riskReasoning,
                generatedSummary: summary,
            });
        }, 800));
    },
};

// SECTION: State Management (Reducer, Context, and Actions)

type RoadmapAction =
  | { type: 'FETCH_START' }
  | { type: 'FETCH_SUCCESS'; payload: RoadmapItem[] }
  | { type: 'FETCH_ERROR'; payload: string }
  | { type: 'ADD_ITEM'; payload: RoadmapItem }
  | { type: 'UPDATE_ITEM'; payload: Partial<RoadmapItem> & { id: string } }
  | { type: 'DELETE_ITEM'; payload: string }
  | { type: 'MOVE_ITEM'; payload: { itemId: string; newQuarter: Quarter; newYear: number; newOrder: number } }
  | { type: 'SET_FILTER'; payload: { filter: keyof RoadmapFilters; value: any } }
  | { type: 'CLEAR_FILTERS' }
  | { type: 'SET_VIEW_MODE'; payload: 'quarterly' | 'timeline' }
  | { type: 'SET_SWIMLANE'; payload: 'none' | 'team' | 'theme' }
  | { type: 'TOGGLE_DEPENDENCIES' }
  | { type: 'TOGGLE_COMPACT_VIEW' }
  | { type: 'SET_EDITING_ITEM'; payload: string | null };

export const initialRoadmapState: RoadmapState = {
    items: [],
    isLoading: true,
    error: null,
    filters: {
        searchTerm: '',
        teams: [],
        statuses: [],
        priorities: [],
        themes: [],
        itemTypes: [],
        ownerIds: [],
    },
    viewMode: 'quarterly',
    swimlaneBy: 'none',
    showDependencies: true,
    isCompactView: false,
    editingItemId: null,
};

export const roadmapReducer = (state: RoadmapState, action: RoadmapAction): RoadmapState => {
    switch (action.type) {
        case 'FETCH_START':
            return { ...state, isLoading: true, error: null };
        case 'FETCH_SUCCESS':
            return { ...state, isLoading: false, items: action.payload };
        case 'FETCH_ERROR':
            return { ...state, isLoading: false, error: action.payload };
        case 'ADD_ITEM':
            return { ...state, items: [...state.items, action.payload] };
        case 'UPDATE_ITEM':
            return {
                ...state,
                items: state.items.map(item =>
                    item.id === action.payload.id ? { ...item, ...action.payload, lastUpdated: new Date().toISOString() } : item
                ),
            };
        case 'DELETE_ITEM':
            return { ...state, items: state.items.filter(item => item.id !== action.payload) };
        case 'MOVE_ITEM':
            const { itemId, newQuarter, newYear, newOrder } = action.payload;
            return {
                ...state,
                items: state.items.map(item =>
                    item.id === itemId ? { ...item, quarter: newQuarter, year: newYear, order: newOrder } : item
                ),
            };
        case 'SET_FILTER':
            return {
                ...state,
                filters: { ...state.filters, [action.payload.filter]: action.payload.value },
            };
        case 'CLEAR_FILTERS':
            return { ...state, filters: initialRoadmapState.filters };
        case 'SET_VIEW_MODE':
            return { ...state, viewMode: action.payload };
        case 'SET_SWIMLANE':
            return { ...state, swimlaneBy: action.payload };
        case 'TOGGLE_DEPENDENCIES':
            return { ...state, showDependencies: !state.showDependencies };
        case 'TOGGLE_COMPACT_VIEW':
            return { ...state, isCompactView: !state.isCompactView };
        case 'SET_EDITING_ITEM':
            return { ...state, editingItemId: action.payload };
        default:
            return state;
    }
};

interface RoadmapContextType {
    state: RoadmapState;
    dispatch: React.Dispatch<RoadmapAction>;
    filteredItems: RoadmapItem[];
}

const RoadmapContext = createContext<RoadmapContextType | undefined>(undefined);


// SECTION: Helper Hooks and Utilities

/**
 * A custom hook to manage roadmap data fetching and interactions.
 */
export const useRoadmap = () => {
    const context = useContext(RoadmapContext);
    if (!context) {
        throw new Error('useRoadmap must be used within a RoadmapProvider');
    }
    return context;
};

export const RoadmapProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [state, dispatch] = useReducer(roadmapReducer, initialRoadmapState);

    useEffect(() => {
        dispatch({ type: 'FETCH_START' });
        const timer = setTimeout(async () => {
            try {
                // In a real app, this would be an API call.
                // We're also enriching data with AI analysis here.
                const itemsWithAI = await Promise.all(
                    MOCK_ROADMAP_ITEMS.map(async item => ({
                        ...item,
                        aiAnalysis: await AIService.analyzeItem(item),
                    }))
                );
                dispatch({ type: 'FETCH_SUCCESS', payload: itemsWithAI });
            } catch (err) {
                dispatch({ type: 'FETCH_ERROR', payload: 'Failed to fetch roadmap data.' });
            }
        }, 1500);
        return () => clearTimeout(timer);
    }, []);

    const filteredItems = useMemo(() => {
        return state.items.filter(item => {
            const { searchTerm, teams, statuses, priorities, themes, itemTypes, ownerIds } = state.filters;
            if (searchTerm && !item.title.toLowerCase().includes(searchTerm.toLowerCase()) && !item.description.toLowerCase().includes(searchTerm.toLowerCase())) return false;
            if (teams.length && !teams.includes(item.team.id)) return false;
            if (statuses.length && !statuses.includes(item.status)) return false;
            if (priorities.length && !priorities.includes(item.priority)) return false;
            if (themes.length && !themes.includes(item.theme.id)) return false;
            if (itemTypes.length && !itemTypes.includes(item.itemType)) return false;
            if (ownerIds.length && !ownerIds.includes(item.owner.id)) return false;
            return true;
        });
    }, [state.items, state.filters]);

    const value = { state, dispatch, filteredItems };

    return (
        <RoadmapContext.Provider value={value}>
            {children}
        </RoadmapContext.Provider>
    );
};


export const getStatusColor = (status: Status): string => {
    switch (status) {
        case 'On Track': return 'bg-green-500';
        case 'In Progress': return 'bg-blue-500';
        case 'At Risk': return 'bg-yellow-500';
        case 'Delayed': return 'bg-red-500';
        case 'Completed': return 'bg-gray-500';
        case 'Backlog': return 'bg-gray-300';
        default: return 'bg-gray-400';
    }
};

export const getPriorityIcon = (priority: Priority): string => {
    switch (priority) {
        case 'Highest': return '🔴';
        case 'High': return '🟠';
        case 'Medium': return '🟡';
        case 'Low': return '🟢';
        default: return '';
    }
};

// SECTION: Sub-components for RoadmapView

export interface UserAvatarProps {
    user: User;
    size?: number;
}

export const UserAvatar: React.FC<UserAvatarProps> = ({ user, size = 8 }) => {
    const sizeClasses = `h-${size} w-${size}`;
    return (
        <div className={`relative group ${sizeClasses}`}>
            <img
                className={`rounded-full ${sizeClasses} object-cover border-2 border-gray-600`}
                src={user.avatarUrl}
                alt={user.name}
            />
            <div className="absolute bottom-0 left-12 mb-2 w-auto p-2 text-xs text-white bg-gray-800 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-50">
                {user.name}
            </div>
        </div>
    );
};


export interface RoadmapCardProps {
    item: RoadmapItem;
    onEdit: (id: string) => void;
    isCompact: boolean;
}

export const RoadmapCard: React.FC<RoadmapCardProps> = ({ item, onEdit, isCompact }) => {
    const cardRef = useRef<HTMLDivElement>(null);
    const { dispatch } = useRoadmap();

    const handleDragStart = (e: DragEvent<HTMLDivElement>, itemId: string) => {
        e.dataTransfer.setData("application/roadmap-item-id", itemId);
    };

    return (
        <div
            ref={cardRef}
            id={`roadmap-item-${item.id}`}
            className="bg-gray-800 rounded-lg p-3 mb-3 shadow-lg border border-gray-700 hover:border-blue-500 transition-all duration-200 cursor-pointer"
            onClick={() => onEdit(item.id)}
            draggable
            onDragStart={(e) => handleDragStart(e, item.id)}
        >
            <div className="flex justify-between items-start">
                <h4 className="font-bold text-sm text-gray-100 flex-1 pr-2">{item.title}</h4>
                <div className={`flex-shrink-0 text-lg ${item.team.color} rounded-full h-4 w-4`} title={item.team.name}></div>
            </div>
            {!isCompact && <p className="text-xs text-gray-400 mt-1.5" style={{color: item.theme.color.startsWith('text') ? '' : item.theme.color }}>{item.theme.name}</p>}

            <div className="flex items-center justify-between mt-3 text-xs">
                <div className="flex items-center space-x-2">
                    <UserAvatar user={item.owner} size={6} />
                    <span className="text-gray-400">{getPriorityIcon(item.priority)} {item.priority}</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-400">
                    {item.dependencies.length > 0 && <span title="Has Dependencies">🔗</span>}
                    {item.comments.length > 0 && <span title={`${item.comments.length} comments`}>💬</span>}
                    {item.linkedResources.length > 0 && <span title="Has linked resources">🖇️</span>}
                </div>
            </div>

            <div className="mt-3">
                <div className="flex justify-between items-center text-xs text-gray-400 mb-1">
                    <span>Progress</span>
                    <span>{item.progress}%</span>
                </div>
                <div className="w-full bg-gray-600 rounded-full h-1.5">
                    <div className={`${getStatusColor(item.status)} h-1.5 rounded-full`} style={{ width: `${item.progress}%` }}></div>
                </div>
            </div>
        </div>
    );
};

export interface QuarterColumnProps {
    year: number;
    quarter: Quarter;
    items: RoadmapItem[];
}

export const QuarterColumn: React.FC<QuarterColumnProps> = ({ year, quarter, items }) => {
    const { state, dispatch } = useRoadmap();
    const sortedItems = useMemo(() => [...items].sort((a, b) => a.order - b.order), [items]);

    const handleDrop = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        const itemId = e.dataTransfer.getData("application/roadmap-item-id");
        if (itemId) {
            const newOrder = items.length; // Simple append, can be made more sophisticated
            dispatch({ type: 'MOVE_ITEM', payload: { itemId, newQuarter: quarter, newYear: year, newOrder } });
        }
    };

    const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault(); // Necessary to allow drop
    };

    return (
        <div 
            className="flex-shrink-0 w-80 bg-gray-900/50 p-3 rounded-lg mr-4"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
        >
            <h3 className="font-bold text-lg text-white mb-4">{quarter} {year}</h3>
            <div className="h-full min-h-[200px] overflow-y-auto">
                {sortedItems.length > 0 ? (
                    sortedItems.map(item => (
                        <RoadmapCard key={item.id} item={item} onEdit={(id) => dispatch({ type: 'SET_EDITING_ITEM', payload: id })} isCompact={state.isCompactView} />
                    ))
                ) : (
                    <div className="text-center text-gray-500 py-10 border-2 border-dashed border-gray-700 rounded-lg">
                        Drop items here.
                    </div>
                )}
            </div>
        </div>
    );
};


export interface RoadmapToolbarProps { }

export const RoadmapToolbar: React.FC<RoadmapToolbarProps> = () => {
    const { state, dispatch } = useRoadmap();

    const handleAddItem = useCallback(() => {
        const newItem: RoadmapItem = {
            id: `item-${Date.now()}`,
            title: 'New Roadmap Item',
            description: '',
            status: 'Backlog',
            priority: 'Medium',
            itemType: 'Feature',
            quarter: 'Q3',
            year: 2024,
            startDate: '2024-07-01',
            endDate: '2024-07-31',
            owner: MOCK_USERS[0],
            team: MOCK_TEAMS[0],
            theme: MOCK_THEMES[0],
            progress: 0,
            effort: 3,
            dependencies: [],
            comments: [],
            linkedResources: [],
            lastUpdated: new Date().toISOString(),
            createdAt: new Date().toISOString(),
            order: 99,
        };
        dispatch({ type: 'ADD_ITEM', payload: newItem });
        dispatch({ type: 'SET_EDITING_ITEM', payload: newItem.id });
    }, [dispatch]);

    return (
        <div className="flex items-center justify-between mb-6 p-2 bg-gray-800/50 rounded-lg">
            <div className="flex items-center space-x-4">
                <button
                    onClick={handleAddItem}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors duration-200"
                >
                    Add Item
                </button>
                <input
                    type="text"
                    placeholder="Search roadmap..."
                    value={state.filters.searchTerm}
                    onChange={(e) => dispatch({ type: 'SET_FILTER', payload: { filter: 'searchTerm', value: e.target.value } })}
                    className="bg-gray-700 text-white placeholder-gray-400 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>
            <div className="flex items-center space-x-4 text-gray-300">
                <div className="flex items-center space-x-1 bg-gray-700 rounded-md p-1">
                    <button
                        onClick={() => dispatch({type: 'SET_VIEW_MODE', payload: 'quarterly'})}
                        className={`px-3 py-1 text-sm rounded ${state.viewMode === 'quarterly' ? 'bg-blue-600 text-white' : 'hover:bg-gray-600'}`}
                    >Quarterly</button>
                    <button
                        onClick={() => dispatch({type: 'SET_VIEW_MODE', payload: 'timeline'})}
                        className={`px-3 py-1 text-sm rounded ${state.viewMode === 'timeline' ? 'bg-blue-600 text-white' : 'hover:bg-gray-600'}`}
                    >Timeline</button>
                </div>
                 <label className="flex items-center cursor-pointer">
                    <input type="checkbox" checked={state.showDependencies} onChange={() => dispatch({ type: 'TOGGLE_DEPENDENCIES' })} className="form-checkbox h-5 w-5 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500" />
                    <span className="ml-2">Dependencies</span>
                </label>
                <label className="flex items-center cursor-pointer">
                    <input type="checkbox" checked={state.isCompactView} onChange={() => dispatch({ type: 'TOGGLE_COMPACT_VIEW' })} className="form-checkbox h-5 w-5 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500" />
                    <span className="ml-2">Compact</span>
                </label>
            </div>
        </div>
    );
};

export interface RoadmapFiltersPanelProps {}

export const RoadmapFiltersPanel: React.FC<RoadmapFiltersPanelProps> = () => {
    const { state, dispatch } = useRoadmap();
    const handleMultiSelectChange = (filter: keyof RoadmapFilters, value: string) => {
        const currentValues = state.filters[filter] as string[];
        const newValues = currentValues.includes(value)
            ? currentValues.filter(v => v !== value)
            : [...currentValues, value];
        dispatch({ type: 'SET_FILTER', payload: { filter, value: newValues }});
    };

    return (
        <div className="bg-gray-800/50 p-4 rounded-lg mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Team Filter */}
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Team</label>
                    <div className="flex flex-wrap gap-2">
                        {MOCK_TEAMS.map(team => (
                            <button
                                key={team.id}
                                onClick={() => handleMultiSelectChange('teams', team.id)}
                                className={`px-3 py-1 text-xs rounded-full border ${state.filters.teams.includes(team.id) ? 'bg-blue-600 border-blue-500 text-white' : 'bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600'}`}
                            >
                                {team.name}
                            </button>
                        ))}
                    </div>
                </div>
                {/* Status Filter */}
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Status</label>
                    <div className="flex flex-wrap gap-2">
                        {(['On Track', 'In Progress', 'At Risk', 'Delayed', 'Completed'] as Status[]).map(status => (
                             <button
                                key={status}
                                onClick={() => handleMultiSelectChange('statuses', status)}
                                className={`px-3 py-1 text-xs rounded-full border ${state.filters.statuses.includes(status) ? 'bg-blue-600 border-blue-500 text-white' : 'bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600'}`}
                            >
                                {status}
                            </button>
                        ))}
                    </div>
                </div>
                {/* Priority Filter */}
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Priority</label>
                     <div className="flex flex-wrap gap-2">
                        {(['Highest', 'High', 'Medium', 'Low'] as Priority[]).map(priority => (
                             <button
                                key={priority}
                                onClick={() => handleMultiSelectChange('priorities', priority)}
                                className={`px-3 py-1 text-xs rounded-full border ${state.filters.priorities.includes(priority) ? 'bg-blue-600 border-blue-500 text-white' : 'bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600'}`}
                            >
                                {getPriorityIcon(priority)} {priority}
                            </button>
                        ))}
                    </div>
                </div>
                <div className="flex items-end">
                    <button
                        onClick={() => dispatch({type: 'CLEAR_FILTERS'})}
                        className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded w-full transition-colors duration-200"
                    >
                        Clear Filters
                    </button>
                </div>
            </div>
        </div>
    );
};

export interface DependencyLinesProps {
    containerRef: React.RefObject<HTMLDivElement>;
}

export const DependencyLines: React.FC<DependencyLinesProps> = ({ containerRef }) => {
    const { filteredItems } = useRoadmap();
    const [lines, setLines] = useState<any[]>([]);

    useEffect(() => {
        const calculateLines = () => {
            if (!containerRef.current) return;
            const newLines: any[] = [];
            const itemElements: { [key: string]: HTMLElement } = {};
            filteredItems.forEach(item => {
                const el = document.getElementById(`roadmap-item-${item.id}`);
                if (el) itemElements[item.id] = el;
            });

            filteredItems.forEach(item => {
                item.dependencies.forEach(dep => {
                    const sourceEl = itemElements[item.id];
                    const targetEl = itemElements[dep.targetItemId];

                    if (sourceEl && targetEl) {
                        const containerRect = containerRef.current!.getBoundingClientRect();
                        const sourceRect = sourceEl.getBoundingClientRect();
                        const targetRect = targetEl.getBoundingClientRect();

                        const startX = sourceRect.left - containerRect.left + sourceRect.width / 2;
                        const startY = sourceRect.top - containerRect.top + sourceRect.height / 2;
                        const endX = targetRect.left - containerRect.left + targetRect.width / 2;
                        const endY = targetRect.top - containerRect.top + targetRect.height / 2;

                        newLines.push({
                            id: `${item.id}-${dep.targetItemId}`,
                            x1: startX, y1: startY, x2: endX, y2: endY, type: dep.type,
                        });
                    }
                });
            });
            setLines(newLines);
        };
        
        const observer = new MutationObserver(calculateLines);
        if (containerRef.current) {
            observer.observe(containerRef.current, { childList: true, subtree: true, attributes: true });
        }
        calculateLines();
        window.addEventListener('resize', calculateLines);
        return () => {
             window.removeEventListener('resize', calculateLines);
             observer.disconnect();
        }
    }, [filteredItems, containerRef]);

    return (
        <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 0 }}>
            {lines.map(line => (
                <g key={line.id}>
                    <line
                        x1={line.x1} y1={line.y1} x2={line.x2} y2={line.y2}
                        stroke={line.type === 'blocks' ? '#f87171' : '#818cf8'}
                        strokeWidth="2" markerEnd="url(#arrow)"
                    />
                </g>
            ))}
            <defs>
                <marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                    <path d="M 0 0 L 10 5 L 0 10 z" fill="#f87171" />
                </marker>
            </defs>
        </svg>
    );
};

// SECTION: Views (Quarterly, Timeline)

export const QuarterlyView: React.FC = () => {
    const { filteredItems } = useRoadmap();
    
    const timelineData = useMemo(() => {
        const data: { [key: string]: RoadmapItem[] } = {};
        const currentYear = new Date().getFullYear();
        const quarters: Quarter[] = ['Q1', 'Q2', 'Q3', 'Q4'];

        for (let year = currentYear - 1; year <= currentYear + 2; year++) {
            quarters.forEach(q => {
                const key = `${q}-${year}`;
                data[key] = filteredItems
                    .filter(item => item.year === year && item.quarter === q);
            });
        }
        return data;
    }, [filteredItems]);

    return (
        <div className="flex">
            {Object.entries(timelineData).map(([key, items]) => {
                const [quarter, yearStr] = key.split('-');
                const year = parseInt(yearStr);
                if (items.length > 0 || (year >= new Date().getFullYear() - 1 && year <= new Date().getFullYear() + 1)) {
                    return (
                        <QuarterColumn
                            key={key}
                            year={year}
                            quarter={quarter as Quarter}
                            items={items}
                        />
                    );
                }
                return null;
            })}
        </div>
    );
};

// ... more advanced components can be added like AI Modals, Edit Modals, Timeline views etc.
// For the sake of this example, we will stick to a reasonable but comprehensive length.

// SECTION: Main Component - RoadmapView

const RoadmapViewInternal: React.FC = () => {
    const { state, dispatch, filteredItems } = useRoadmap();
    const timelineContainerRef = useRef<HTMLDivElement>(null);

    return (
        <Card title="Strategic Roadmap">
            <p className="text-gray-400 mb-6">A high-level, interactive view of the product and engineering roadmap, visualizing key initiatives and timelines with AI-powered insights.</p>
            <RoadmapToolbar />
            <RoadmapFiltersPanel />

            <div
                ref={timelineContainerRef}
                className="relative w-full overflow-x-auto pb-4"
                style={{ zIndex: 1 }}
            >
                {state.showDependencies && <DependencyLines containerRef={timelineContainerRef} />}
                
                {state.viewMode === 'quarterly' && <QuarterlyView />}
                {/* Timeline view would be implemented here */}

            </div>
            
            {state.editingItemId && (
                <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
                    <div className="bg-gray-800 rounded-lg p-6 w-1/2 max-w-2xl">
                        <h2 className="text-2xl font-bold mb-4">Editing Item</h2>
                        <p className="text-gray-300">Item ID: {state.editingItemId}</p>
                        <p className="text-gray-400 mt-2">Full-featured editing form with tabs for details, dependencies, comments, and integrations would appear here.</p>
                        <button
                            onClick={() => dispatch({ type: 'SET_EDITING_ITEM', payload: null })}
                            className="mt-6 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </Card>
    );
};


const RoadmapView: React.FC = () => {
    return (
        <RoadmapProvider>
            <RoadmapViewWithLoader />
        </RoadmapProvider>
    )
}

const RoadmapViewWithLoader: React.FC = () => {
    const { state } = useRoadmap();

    if (state.isLoading) {
        return (
            <Card title="Strategic Roadmap">
                <div className="flex justify-center items-center h-96">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
                </div>
            </Card>
        );
    }
    
    if (state.error) {
        return (
            <Card title="Strategic Roadmap">
                <div className="text-red-400 bg-red-900/50 p-4 rounded-lg">
                    <p><strong>Error:</strong> {state.error}</p>
                </div>
            </Card>
        );
    }

    return <RoadmapViewInternal />;
}

export default RoadmapView;