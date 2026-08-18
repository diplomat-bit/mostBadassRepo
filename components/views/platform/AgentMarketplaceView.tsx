// REPOSITORY SOURCE: diplomat-bit/Citibank_Demo_Business_Inc_Demonstration- | PATH: diplomat-bit-Citibank_Demo_Business_Inc_Demonstration--ab2501d/components/views/platform/AgentMarketplaceView.tsx
================================================================================

import React, { useState, useEffect, useReducer, useCallback, useMemo, FC, ChangeEvent, FormEvent, ReactNode, createContext, useContext } from 'react';
import Card from '../../Card';

//================================================================================================
// SVG ICON COMPONENTS
// A collection of reusable SVG icons to avoid external dependencies.
//================================================================================================

const IconVerified: FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44-1.22a.75.75 0 00-1.06 0L8.25 6.19 6.31 4.25a.75.75 0 00-1.06 1.06l2.5 2.5a.75.75 0 001.06 0l4.5-4.5a.75.75 0 000-1.06z" clipRule="evenodd" />
    </svg>
);

const IconDownload: FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor">
        <path d="M8.707 7.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l2-2a1 1 0 00-1.414-1.414L11 8.586V3a1 1 0 10-2 0v5.586L8.707 7.293zM3 11a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" />
    </svg>
);

const IconSearch: FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
);

const IconClose: FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
);

const IconStar: FC<{ className?: string; isHalf?: boolean }> = ({ className, isHalf }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor">
        <defs>
            <clipPath id="half-star-clip"><rect x="0" y="0" width="10" height="20" /></clipPath>
        </defs>
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
              clipPath={isHalf ? "url(#half-star-clip)" : undefined}
        />
    </svg>
);


//================================================================================================
// TYPE DEFINITIONS
//================================================================================================

export interface AgentAuthor {
    id: string;
    name: string;
    avatarUrl: string;
    profileUrl: string;
    verified: boolean;
    bio: string;
    agentsPublished: number;
    companyWebsite?: string;
    githubUsername?: string;
}

export interface AgentReview {
    id: string;
    author: { name: string; avatarUrl: string; };
    rating: number; // 1-5
    comment: string;
    createdAt: Date;
    helpfulVotes: number;
    verifiedPurchase: boolean;
    responseFromAuthor?: { response: string; respondedAt: Date; };
}

export interface PricingTier {
    name: 'Basic' | 'Pro' | 'Enterprise';
    price: number;
    interval: 'monthly' | 'yearly';
    features: string[];
}

export interface AgentPricing {
    type: 'one-time' | 'subscription' | 'free' | 'usage-based';
    amount?: number;
    subscriptionTiers?: PricingTier[];
    usageRate?: string; // e.g., "$0.01 per API call"
}

export interface AgentSpecs {
    version: string;
    releaseDate: Date;
    requiredApiVersion: string;
    dependencies: { name: string; version: string; url?: string }[];
    supportedLanguages: string[];
    computeRequirements: { cpu: string; ram: string; gpu?: string; };
    permissionsRequired: string[];
}

export interface AgentChangelogEntry {
    version: string;
    releaseDate: Date;
    changes: string[];
}

export type AgentStatus = 'installed' | 'not_installed' | 'update_available';

export interface Agent {
    id: string;
    name: string;
    author: AgentAuthor;
    category: string;
    tags: string[];
    shortDescription: string;
    longDescription: string;
    imageUrl: string;
    rating: number; // average rating 1-5
    reviewCount: number;
    reviews: AgentReview[];
    pricing: AgentPricing;
    specs: AgentSpecs;
    changelog: AgentChangelogEntry[];
    downloads: number;
    createdAt: Date;
    updatedAt: Date;
    featured: boolean;
    documentationUrl: string;
    demoUrl?: string;
    useCases: string[];
    supportLevel: 'community' | 'basic' | 'premium';
    status: AgentStatus;
}

//================================================================================================
// MOCK DATA GENERATION
//================================================================================================

const MOCK_AUTHORS: AgentAuthor[] = [
    { id: 'author-1', name: 'SynthCore Labs', avatarUrl: `https://i.pravatar.cc/40?u=synthcore`, profileUrl: '#', verified: true, bio: 'Pioneering AI for financial markets.', agentsPublished: 5, githubUsername: 'synthcore' },
    { id: 'author-2', name: 'DataWeaver Inc.', avatarUrl: `https://i.pravatar.cc/40?u=dataweaver`, profileUrl: '#', verified: true, bio: 'Weaving intelligence from raw data.', agentsPublished: 8, companyWebsite: 'https://dataweaver.com' },
    { id: 'author-3', name: 'LogicForge AI', avatarUrl: `https://i.pravatar.cc/40?u=logicforge`, profileUrl: '#', verified: false, bio: 'Crafting bespoke AI solutions for business automation.', agentsPublished: 3 },
    { id: 'author-4', name: 'QuantumLeap AI', avatarUrl: `https://i.pravatar.cc/40?u=quantumleap`, profileUrl: '#', verified: true, bio: 'Next-generation AI for complex problem solving.', agentsPublished: 12, githubUsername: 'qleap' },
    { id: 'author-5', name: 'Eva Neuro', avatarUrl: `https://i.pravatar.cc/40?u=eva`, profileUrl: '#', verified: false, bio: 'Independent researcher focusing on NLP agents.', agentsPublished: 2 },
];
const MOCK_CATEGORIES = ['Finance', 'Marketing', 'Data Analysis', 'Customer Support', 'Content Creation', 'Code Generation', 'Personal Assistant', 'Cybersecurity'];
const MOCK_TAGS = ['stocks', 'crypto', 'reporting', 'automation', 'seo', 'chat', 'email', 'analytics', 'python', 'api', 'research', 'summarization', 'forecasting', 'security', 'threat-detection'];
const MOCK_COMMENTS = [ "This agent transformed our workflow. Highly recommended!", "Decent, but has a steep learning curve.", "A game-changer for our marketing team. The automation capabilities are top-notch.", "Could use more documentation, but the support team was helpful.", "It's good for the price, but lacks some advanced features.", "Incredible performance and very reliable. Has not failed us once.", "I found a few bugs, but the developer is very responsive and issues fixes quickly.", "The best agent in this category, hands down.", "Simple, effective, and does exactly what it promises.", "Overpriced for what it offers. There are better free alternatives.", ];

export const generateMockAgents = (count: number): Agent[] => {
    const agents: Agent[] = [];
    for (let i = 1; i <= count; i++) {
        const author = MOCK_AUTHORS[i % MOCK_AUTHORS.length];
        const category = MOCK_CATEGORIES[i % MOCK_CATEGORIES.length];
        const createdAt = new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000);
        const reviews: AgentReview[] = Array.from({ length: Math.floor(Math.random() * 50) + 5 }, (_, k) => ({
            id: `review-${i}-${k}`,
            author: { name: `User ${k + 1}`, avatarUrl: `https://i.pravatar.cc/32?u=user${i}${k}` },
            rating: Math.floor(Math.random() * 3) + 3,
            comment: MOCK_COMMENTS[Math.floor(Math.random() * MOCK_COMMENTS.length)],
            createdAt: new Date(createdAt.getTime() + Math.random() * (Date.now() - createdAt.getTime())),
            helpfulVotes: Math.floor(Math.random() * 100),
            verifiedPurchase: Math.random() > 0.3,
            responseFromAuthor: k % 5 === 0 ? { response: 'Thank you for your feedback! We are working on improving this.', respondedAt: new Date() } : undefined,
        }));
        const totalRating = reviews.reduce((sum, r) => sum + r.rating, 0);
        const avgRating = reviews.length > 0 ? totalRating / reviews.length : 0;
        const pricingType = ['one-time', 'subscription', 'free', 'usage-based'][i % 4] as 'one-time' | 'subscription' | 'free' | 'usage-based';
        let pricing: AgentPricing;
        switch (pricingType) {
            case 'subscription':
                pricing = { type: 'subscription', subscriptionTiers: [ { name: 'Basic', price: 29, interval: 'monthly', features: ['Feature A', 'Feature B'] }, { name: 'Pro', price: 99, interval: 'monthly', features: ['All Basic', 'Feature C', 'Priority Support'] } ] };
                break;
            case 'usage-based':
                pricing = { type: 'usage-based', usageRate: '$0.005/token' };
                break;
            case 'free':
                pricing = { type: 'free' };
                break;
            default:
                pricing = { type: 'one-time', amount: Math.floor(Math.random() * 400) + 99 };
        }
        
        agents.push({
            id: `agent-${i}`, name: `${category} Master Agent ${i}`, author, category,
            tags: [...new Set(Array.from({ length: Math.floor(Math.random() * 3) + 2 }, () => MOCK_TAGS[Math.floor(Math.random() * MOCK_TAGS.length)]))],
            shortDescription: `An autonomous AI agent specializing in ${category.toLowerCase()} tasks and automation.`,
            longDescription: `This is a comprehensive description for the ${category} Master Agent ${i}. It leverages state-of-the-art machine learning models to provide unparalleled insights and automation capabilities. Whether you're a small business or a large enterprise, this agent can be configured to meet your specific needs, streamlining workflows and boosting productivity. It features a user-friendly interface for configuration and monitoring. \n\n**Key Features:**\n- Real-time data processing\n- Advanced analytics dashboard\n- Customizable reporting\n- Secure API integrations`,
            imageUrl: `https://picsum.photos/seed/${i}/400/200`,
            rating: parseFloat(avgRating.toFixed(1)), reviewCount: reviews.length, reviews, pricing,
            specs: {
                version: '1.2.0', releaseDate: new Date(), requiredApiVersion: 'v2.1',
                dependencies: [{ name: 'Node.js', version: 'v18+' }, { name: 'Python', version: '3.9+' }, { name: 'Docker', version: 'latest' }],
                supportedLanguages: ['English', 'Spanish', 'German'],
                computeRequirements: { cpu: '4 cores', ram: '16GB', gpu: (i % 3 === 0) ? 'NVIDIA RTX 3080 or equivalent' : undefined },
                permissionsRequired: ['Read file system', 'Access network', 'Run background tasks']
            },
            changelog: [
                { version: '1.2.0', releaseDate: new Date(), changes: ['Added new API integration.', 'Improved performance by 20%.', 'Fixed minor UI bugs.'] },
                { version: '1.1.0', releaseDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), changes: ['Initial support for multi-language output.', 'Refactored core logic.'] },
                { version: '1.0.0', releaseDate: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000), changes: ['Initial public release.'] },
            ],
            downloads: Math.floor(Math.random() * 10000) + 500, createdAt, updatedAt: new Date(createdAt.getTime() + Math.random() * (Date.now() - createdAt.getTime())),
            featured: i % 10 === 0, documentationUrl: '#', demoUrl: i % 5 === 0 ? '#' : undefined,
            useCases: ['Automated Reporting', 'Market Trend Analysis', 'Customer Segmentation'],
            supportLevel: ['community', 'basic', 'premium'][i % 3] as 'community' | 'basic' | 'premium',
            status: ['not_installed', 'installed', 'update_available'][i % 3] as AgentStatus
        });
    }
    return agents;
};

//================================================================================================
// STATE MANAGEMENT (useReducer)
//================================================================================================

export type FilterState = {
    searchQuery: string;
    categories: Set<string>;
    minRating: number;
    maxPrice: number;
    pricingTypes: Set<string>;
    tags: Set<string>;
    verifiedAuthor: boolean;
    supportLevels: Set<string>;
};

export type FilterAction =
    | { type: 'SET_SEARCH_QUERY'; payload: string }
    | { type: 'TOGGLE_CATEGORY'; payload: string }
    | { type: 'SET_MIN_RATING'; payload: number }
    | { type: 'SET_MAX_PRICE'; payload: number }
    | { type: 'TOGGLE_PRICING_TYPE'; payload: string }
    | { type: 'TOGGLE_TAG'; payload: string }
    | { type: 'TOGGLE_VERIFIED_AUTHOR' }
    | { type: 'TOGGLE_SUPPORT_LEVEL', payload: string }
    | { type: 'RESET_FILTERS' };

export const initialFilterState: FilterState = {
    searchQuery: '', categories: new Set(), minRating: 0, maxPrice: 500,
    pricingTypes: new Set(), tags: new Set(), verifiedAuthor: false, supportLevels: new Set()
};

export function filterReducer(state: FilterState, action: FilterAction): FilterState {
    const toggleSet = (set: Set<string>, value: string) => {
        const newSet = new Set(set);
        if (newSet.has(value)) newSet.delete(value); else newSet.add(value);
        return newSet;
    };
    switch (action.type) {
        case 'SET_SEARCH_QUERY': return { ...state, searchQuery: action.payload };
        case 'TOGGLE_CATEGORY': return { ...state, categories: toggleSet(state.categories, action.payload) };
        case 'SET_MIN_RATING': return { ...state, minRating: action.payload };
        case 'SET_MAX_PRICE': return { ...state, maxPrice: action.payload };
        case 'TOGGLE_PRICING_TYPE': return { ...state, pricingTypes: toggleSet(state.pricingTypes, action.payload) };
        case 'TOGGLE_TAG': return { ...state, tags: toggleSet(state.tags, action.payload) };
        case 'TOGGLE_VERIFIED_AUTHOR': return { ...state, verifiedAuthor: !state.verifiedAuthor };
        case 'TOGGLE_SUPPORT_LEVEL': return {...state, supportLevels: toggleSet(state.supportLevels, action.payload) };
        case 'RESET_FILTERS': return initialFilterState;
        default: return state;
    }
}

//================================================================================================
// HELPER & UTILITY COMPONENTS
//================================================================================================

export const StarRating: FC<{ rating: number; className?: string }> = ({ rating, className = '' }) => {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
    return (
        <div className={`flex items-center text-yellow-400 ${className}`}>
            {[...Array(fullStars)].map((_, i) => <IconStar key={`full-${i}`} className="h-5 w-5" />)}
            {halfStar && <div className="relative"><IconStar className="h-5 w-5 text-gray-600" /><IconStar isHalf className="h-5 w-5 absolute top-0 left-0" /></div>}
            {[...Array(emptyStars)].map((_, i) => <IconStar key={`empty-${i}`} className="h-5 w-5 text-gray-600" />)}
        </div>
    );
};

export const LoadingSpinner: FC = () => (
    <div className="flex justify-center items-center p-8"><div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div></div>
);

export const NoResults: FC<{ onReset: () => void }> = ({ onReset }) => (
    <div className="text-center py-16 px-4 bg-gray-800 rounded-lg">
        <IconSearch className="mx-auto h-12 w-12 text-gray-500" />
        <h3 className="mt-2 text-lg font-medium text-white">No Agents Found</h3>
        <p className="mt-1 text-sm text-gray-400">We couldn't find any agents matching your criteria. Try adjusting your filters.</p>
        <div className="mt-6"><button type="button" onClick={onReset} className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-blue-500">Reset Filters</button></div>
    </div>
);

export const Modal: FC<{ isOpen: boolean; onClose: () => void; title: string; children: ReactNode; size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '4xl' }> = ({ isOpen, onClose, title, children, size = '4xl' }) => {
    if (!isOpen) return null;
    const sizeClasses = { sm: 'sm:max-w-sm', md: 'sm:max-w-md', lg: 'sm:max-w-lg', xl: 'sm:max-w-xl', '2xl': 'sm:max-w-2xl', '4xl': 'sm:max-w-4xl' };
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75" aria-labelledby="modal-title" role="dialog" aria-modal="true">
            <div className="fixed inset-0" onClick={onClose}></div>
            <div className={`relative bg-gray-900 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 w-full ${sizeClasses[size]}`}>
                <div className="bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4 border-b border-gray-700 flex justify-between items-center">
                    <h3 className="text-xl leading-6 font-medium text-white" id="modal-title">{title}</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-white"><span className="sr-only">Close</span><IconClose className="h-6 w-6" /></button>
                </div>
                <div className="bg-gray-900 px-4 pt-5 pb-4 sm:p-6 max-h-[80vh] overflow-y-auto">{children}</div>
            </div>
        </div>
    );
};

export const usePagination = <T,>(items: T[], itemsPerPage: number) => {
    const [currentPage, setCurrentPage] = useState(1);
    const maxPage = Math.ceil(items.length / itemsPerPage);
    const currentData = useMemo(() => {
        const begin = (currentPage - 1) * itemsPerPage;
        return items.slice(begin, begin + itemsPerPage);
    }, [items, currentPage, itemsPerPage]);
    const jump = useCallback((page: number) => {
        const pageNumber = Math.max(1, page);
        setCurrentPage(Math.min(pageNumber, maxPage || 1));
    }, [maxPage]);
    useEffect(() => { jump(currentPage); }, [items.length, maxPage, currentPage, jump]);
    return { jump, currentData, currentPage, maxPage };
};


//================================================================================================
// UI SUB-COMPONENTS
//================================================================================================

export const SearchBar: FC<{ query: string; onSearch: (query: string) => void }> = ({ query, onSearch }) => (
    <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><IconSearch className="h-5 w-5 text-gray-400" /></div>
        <input type="text" value={query} onChange={(e: ChangeEvent<HTMLInputElement>) => onSearch(e.target.value)} placeholder="Search for agents by name, tag, or description..." className="block w-full bg-gray-700 border border-gray-600 rounded-md py-2 pl-10 pr-3 text-sm placeholder-gray-400 text-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500" />
    </div>
);

export const FilterSidebar: FC<{ state: FilterState; dispatch: React.Dispatch<FilterAction> }> = ({ state, dispatch }) => {
    const createToggle = (type: FilterAction['type']) => (payload: string) => dispatch({ type, payload } as any);
    const renderCheckboxGroup = (title: string, items: readonly string[], checked: Set<string>, onToggle: (item: string) => void) => (
        <div className="mb-6">
            <h4 className="font-semibold text-gray-300 mb-2">{title}</h4>
            {items.map(item => (
                <div key={item} className="flex items-center mb-1">
                    <input id={`filter-${title}-${item}`} type="checkbox" checked={checked.has(item)} onChange={() => onToggle(item)} className="h-4 w-4 rounded border-gray-500 text-blue-600 bg-gray-700 focus:ring-blue-500" />
                    <label htmlFor={`filter-${title}-${item}`} className="ml-2 text-sm text-gray-400 capitalize">{item}</label>
                </div>
            ))}
        </div>
    );
    return (
        <aside className="w-full lg:w-1/4 xl:w-1/5 p-4 bg-gray-800/50 rounded-lg h-full self-start sticky top-4">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-white">Filters</h3>
                <button onClick={() => dispatch({ type: 'RESET_FILTERS' })} className="text-sm text-blue-400 hover:text-blue-300">Reset</button>
            </div>
            {renderCheckboxGroup('Category', MOCK_CATEGORIES, state.categories, createToggle('TOGGLE_CATEGORY'))}
            <div className="mb-6"><h4 className="font-semibold text-gray-300 mb-2">Minimum Rating</h4><div className="flex items-center space-x-2"><input type="range" min="0" max="5" step="0.5" value={state.minRating} onChange={(e) => dispatch({ type: 'SET_MIN_RATING', payload: parseFloat(e.target.value) })} className="w-full" /><span className="text-sm text-gray-300 font-mono w-8 text-center">{state.minRating.toFixed(1)}</span></div></div>
            {renderCheckboxGroup('Pricing', ['free', 'one-time', 'subscription', 'usage-based'], state.pricingTypes, createToggle('TOGGLE_PRICING_TYPE'))}
            {renderCheckboxGroup('Support Level', ['community', 'basic', 'premium'], state.supportLevels, createToggle('TOGGLE_SUPPORT_LEVEL'))}
            <div className="mb-6"><h4 className="font-semibold text-gray-300 mb-2">Author</h4><div className="flex items-center"><input id="verified-author" type="checkbox" checked={state.verifiedAuthor} onChange={() => dispatch({ type: 'TOGGLE_VERIFIED_AUTHOR' })} className="h-4 w-4 rounded border-gray-500 text-blue-600 bg-gray-700 focus:ring-blue-500" /><label htmlFor="verified-author" className="ml-2 text-sm text-gray-400">Verified Author Only</label></div></div>
            <div><h4 className="font-semibold text-gray-300 mb-2">Tags</h4><div className="flex flex-wrap gap-2">{MOCK_TAGS.map(tag => (<button key={tag} onClick={() => dispatch({ type: 'TOGGLE_TAG', payload: tag })} className={`px-2 py-1 text-xs rounded-full border ${state.tags.has(tag) ? 'bg-blue-500 border-blue-500 text-white' : 'bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600'}`}>{tag}</button>))}</div></div>
        </aside>
    );
};

export const AgentCard: FC<{ agent: Agent; onSelect: (agent: Agent) => void }> = ({ agent, onSelect }) => (
    <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-blue-500/20 transition-all duration-300 ease-in-out transform hover:-translate-y-1 cursor-pointer flex flex-col" onClick={() => onSelect(agent)}>
        <img className="w-full h-40 object-cover bg-gray-700" src={agent.imageUrl} alt={agent.name} />
        <div className="p-4 flex flex-col flex-grow">
            <div className="flex justify-between items-start">
                <p className="text-sm text-blue-400">{agent.category}</p>
                <div className="text-lg font-bold text-green-400 capitalize">{agent.pricing.type === 'one-time' ? `$${agent.pricing.amount}` : agent.pricing.type.replace('-', ' ')}</div>
            </div>
            <h3 className="text-lg font-semibold text-white mt-1">{agent.name}</h3>
            <div className="flex items-center mt-1">
                <img src={agent.author.avatarUrl} alt={agent.author.name} className="h-6 w-6 rounded-full mr-2" />
                <span className="text-sm text-gray-400">{agent.author.name}</span>
                {agent.author.verified && <IconVerified className="h-4 w-4 text-blue-500 ml-1" />}
            </div>
            <p className="text-sm text-gray-400 mt-2 flex-grow">{agent.shortDescription}</p>
            <div className="mt-4 pt-4 border-t border-gray-700 flex justify-between items-center">
                <div className="flex items-center"><StarRating rating={agent.rating} /><span className="text-xs text-gray-500 ml-2">({agent.reviewCount})</span></div>
                <div className="flex items-center text-xs text-gray-500"><IconDownload className="h-4 w-4 mr-1" />{agent.downloads.toLocaleString()}</div>
            </div>
        </div>
    </div>
);

export const Pagination: FC<{ currentPage: number; maxPage: number; onJump: (page: number) => void }> = ({ currentPage, maxPage, onJump }) => {
    if (maxPage <= 1) return null;
    const pageNumbers: (number | '...')[] = [];
    if (maxPage <= 7) { for (let i = 1; i <= maxPage; i++) pageNumbers.push(i); } 
    else {
        pageNumbers.push(1);
        if (currentPage > 3) pageNumbers.push('...');
        if (currentPage > 2) pageNumbers.push(currentPage - 1);
        if (currentPage > 1 && currentPage < maxPage) pageNumbers.push(currentPage);
        if (currentPage < maxPage - 1) pageNumbers.push(currentPage + 1);
        if (currentPage < maxPage - 2) pageNumbers.push('...');
        pageNumbers.push(maxPage);
    }
    return (
        <nav className="flex items-center justify-between py-3 text-white"><div className="hidden sm:block"><p className="text-sm text-gray-400">Showing page <span className="font-medium">{currentPage}</span> of <span className="font-medium">{maxPage}</span></p></div><div className="flex-1 flex justify-between sm:justify-end"><button onClick={() => onJump(currentPage - 1)} disabled={currentPage === 1} className="relative inline-flex items-center px-4 py-2 border border-gray-600 text-sm font-medium rounded-md text-gray-300 bg-gray-800 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed">Previous</button><div className="hidden md:flex items-center mx-2">{pageNumbers.map((page, index) => page === '...' ? <span key={index} className="px-4 py-2 text-sm">...</span> : <button key={index} onClick={() => onJump(page as number)} className={`px-4 py-2 border border-gray-600 text-sm font-medium rounded-md mx-1 ${currentPage === page ? 'bg-blue-600 text-white' : 'bg-gray-800 hover:bg-gray-700'}`}>{page}</button>)}</div><button onClick={() => onJump(currentPage + 1)} disabled={currentPage === maxPage} className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-600 text-sm font-medium rounded-md text-gray-300 bg-gray-800 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed">Next</button></div></nav>
    );
};

const TabButton: FC<{ active: boolean; onClick: () => void; children: ReactNode }> = ({ active, onClick, children }) => (
    <button onClick={onClick} className={`${active ? 'border-blue-500 text-blue-400' : 'border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-500'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}>{children}</button>
);

export const AgentDetailModal: FC<{ agent: Agent | null; onClose: () => void }> = ({ agent, onClose }) => {
    const [activeTab, setActiveTab] = useState('overview');
    if (!agent) return null;

    const renderTabContent = () => {
        switch (activeTab) {
            case 'specs': return <div className="space-y-4 text-gray-300 prose prose-invert max-w-none"><h4>Technical Specifications</h4><ul className="list-disc list-inside"><li><strong>Version:</strong> {agent.specs.version} (Released on {agent.specs.releaseDate.toLocaleDateString()})</li><li><strong>Required API Version:</strong> {agent.specs.requiredApiVersion}</li><li><strong>Supported Languages:</strong> {agent.specs.supportedLanguages.join(', ')}</li></ul><h4>Dependencies</h4><ul className="list-disc list-inside">{agent.specs.dependencies.map(dep => <li key={dep.name}>{dep.name} ({dep.version})</li>)}</ul><h4>Compute Requirements</h4><ul className="list-disc list-inside"><li><strong>CPU:</strong> {agent.specs.computeRequirements.cpu}</li><li><strong>RAM:</strong> {agent.specs.computeRequirements.ram}</li>{agent.specs.computeRequirements.gpu && <li><strong>GPU:</strong> {agent.specs.computeRequirements.gpu}</li>}</ul><h4>Permissions Required</h4><ul className="list-disc list-inside">{agent.specs.permissionsRequired.map(p => <li key={p}>{p}</li>)}</ul></div>;
            case 'reviews': return <div><h4 className="text-lg font-semibold text-white mb-4">User Reviews ({agent.reviewCount})</h4><div className="space-y-6">{agent.reviews.slice(0, 5).map(review => (<div key={review.id} className="border-b border-gray-700 pb-4"><div className="flex items-center mb-2"><img src={review.author.avatarUrl} alt={review.author.name} className="h-8 w-8 rounded-full mr-3" /><div><p className="font-semibold text-white">{review.author.name}</p><p className="text-xs text-gray-500">{review.createdAt.toLocaleDateString()}</p></div><div className="ml-auto"><StarRating rating={review.rating} /></div></div>