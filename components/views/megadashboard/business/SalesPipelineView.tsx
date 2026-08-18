// REPOSITORY SOURCE: diplomat-bit/almost | PATH: diplomat-bit-almost-93a5466/components/views/megadashboard/business/SalesPipelineView.tsx
================================================================================

// components/views/megadashboard/business/SalesPipelineView.tsx
import React, { useContext, useMemo, useState } from 'react';
import Card from '../../../Card';
import { DataContext } from '../../../../context/DataContext';
import { FunnelChart, Funnel, Tooltip, ResponsiveContainer, LabelList } from 'recharts';
import type { SalesDeal } from '../../../../types';

const SalesPipelineView: React.FC = () => {
    const context = useContext(DataContext);
    if (!context) throw new Error("SalesPipelineView must be within DataProvider");
    
    const { salesDeals } = context;
    const [selectedDeal, setSelectedDeal] = useState<SalesDeal | null>(null);
    const [aiProbability, setAiProbability] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const pipelineData = useMemo(() => {
        const stages = { Prospecting: 0, Qualification: 0, Proposal: 0, 'Closed Won': 0 };
        salesDeals.forEach(deal => {
            if(deal.stage in stages) stages[deal.stage]++;
        });
        return [
            { value: stages.Prospecting, name: 'Prospecting', fill: '#06b6d4' },
            { value: stages.Qualification, name: 'Qualification', fill: '#3b82f6' },
            { value: stages.Proposal, name: 'Proposal', fill: '#8b5cf6' },
            { value: stages['Closed Won'], name: 'Won', fill: '#10b981' },
        ];
    }, [salesDeals]);

    const kpiData = useMemo(() => ({
        pipelineValue: salesDeals.reduce((sum, d) => d.status !== 'Closed Won' ? sum + d.value : sum, 0),
        winRate: (salesDeals.filter(d => d.status === 'Closed Won').length / salesDeals.length) * 100,
        avgDealSize: salesDeals.reduce((sum, d) => sum + d.value, 0) / salesDeals.length,
    }), [salesDeals]);

    const getAiProbability = async (deal: SalesDeal) => {
        setSelectedDeal(deal);
        setIsLoading(true);
        setAiProbability(null);
        try {
            const response = await fetch('https://ce47fe80-dabc-4ad0-b0e7-cf285695b8b8.mock.pstmn.io/ai/advisor/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: `Based on this deal (Value: $${deal.value}, Stage: ${deal.stage}), estimate the probability to close as a percentage. Respond with only the number.`,
                    sessionId: 'session-sales-pipeline-123'
                })
            });
            const data = await response.json();
            setAiProbability(parseFloat(data.text));
        } catch (err) { console.error(err); } finally { setIsLoading(false); }
    };

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold text-white tracking-wider">Sales Pipeline</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="text-center"><p className="text-3xl font-bold text-white">${(kpiData.pipelineValue / 1000).toFixed(0)}k</p><p className="text-sm text-gray-400 mt-1">Pipeline Value</p></Card>
                <Card className="text-center"><p className="text-3xl font-bold text-white">{kpiData.winRate.toFixed(1)}%</p><p className="text-sm text-gray-400 mt-1">Win Rate</p></Card>
                <Card className="text-center"><p className="text-3xl font-bold text-white">${(kpiData.avgDealSize / 1000).toFixed(0)}k</p><p className="text-sm text-gray-400 mt-1">Avg. Deal Size</p></Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card title="Sales Funnel">
                    <ResponsiveContainer width="100%" height={300}>
                        <FunnelChart><Tooltip /><Funnel dataKey="value" data={pipelineData} isAnimationActive><LabelList position="right" fill="#fff" stroke="none" dataKey="name" /></Funnel></FunnelChart>
                    </ResponsiveContainer>
                </Card>
                <Card title="Top Deals">
                    <div className="space-y-2">
                        {salesDeals.slice(0, 5).map(deal => (
                            <div key={deal.id} className="p-2 bg-gray-800/50 rounded-lg flex justify-between items-center">
                                <div><p className="font-semibold text-white">{deal.name}</p><p className="text-xs text-gray-400">{deal.stage} - ${deal.value.toLocaleString()}</p></div>
                                <button onClick={() => getAiProbability(deal)} className="text-xs text-cyan-400 hover:underline">AI Probability</button>
                            </div>
                        ))}
                    </div>
                     {selectedDeal && <div className="mt-4 p-2 bg-gray-900/50 rounded text-center"><p className="text-sm">AI Probability for {selectedDeal.name}: <strong className="text-cyan-300">{isLoading ? '...' : `${aiProbability}%`}</strong></p></div>}
                </Card>
            </div>
        </div>
    );
};

export default SalesPipelineView;

================================================================================
// APPENDED FROM REPO: diplomat-bit/Citibank_Demo_Business_Inc_Demonstration- | ORIGINAL PATH: diplomat-bit-Citibank_Demo_Business_Inc_Demonstration--ab2501d/components/views/megadashboard/business/SalesPipelineView.tsx
================================================================================

import React, { useContext, useMemo, useState, useEffect, useCallback, createContext } from 'react';
import Card from '../../../Card';
import { DataContext } from '../../../../context/DataContext';
import { FunnelChart, Funnel, Tooltip, ResponsiveContainer, LabelList, PieChart, Pie, Cell, BarChart, XAxis, YAxis, Bar, Legend, CartesianGrid, LineChart, Line, AreaChart, Area } from 'recharts';
import { GoogleGenAI } from "@google/genai";
import type { SalesDeal } from '../../../../types';

// New Imports for richer UI and functionality
import { ChevronDownIcon, ChevronUpIcon, MagnifyingGlassIcon, PlusIcon, TrashIcon, PencilSquareIcon, ChartBarIcon, ListBulletIcon, DocumentTextIcon, Cog8ToothIcon, ClockIcon, UserIcon, CalendarDaysIcon, TagIcon, CurrencyDollarIcon, FunnelIcon, PuzzlePieceIcon, RocketLaunchIcon, TrophyIcon, XMarkIcon, CheckCircleIcon, InformationCircleIcon, EnvelopeIcon, ClipboardDocumentCheckIcon, ViewColumnsIcon, PresentationChartLineIcon, LightBulbIcon, BuildingOffice2Icon, ArrowUpOnSquareIcon } from '@heroicons/react/24/outline';
import Modal from '../../../Modal'; // Assuming a generic Modal component exists
import Input from '../../../Input'; // Assuming a generic Input component exists
import Select from '../../../Select'; // Assuming a generic Select component exists
import Button from '../../../Button'; // Assuming a generic Button component exists
import DatePicker from 'react-datepicker'; // Assuming a date picker library, e.g., react-datepicker
import 'react-datepicker/dist/react-datepicker.css';
import { format, parseISO, isBefore, subDays, addDays, getMonth, getYear } from 'date-fns';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import type { DropResult } from 'react-beautiful-dnd';


// --- Start of New Type Definitions (for extended functionality) ---

/**
 * @typedef {Object} SalesContact
 * @property {string} id - Unique identifier for the contact.
 * @property {string} name - Full name of the contact.
 * @property {string} email - Email address of the contact.
 * @property {string} phone - Phone number of the contact.
 * @property {string} title - Job title of the contact.
 * @property {string} company - Company the contact belongs to (could be different from deal company).
 */
export type SalesContact = {
    id: string;
    name: string;
    email: string;
    phone: string;
    title: string;
    company: string;
};

/**
 * @typedef {Object} ActivityLogEntry
 * @property {string} id - Unique identifier for the activity.
 * @property {'call' | 'email' | 'meeting' | 'note' | 'task' | 'stage_change'} type - Type of activity.
 * @property {string} description - Detailed description of the activity.
 * @property {Date} timestamp - When the activity occurred.
 * @property {string} createdBy - User who logged the activity.
 * @property {Date} [dueDate] - Optional due date for tasks.
 * @property {boolean} [isCompleted] - Optional completion status for tasks.
 */
export type ActivityLogEntry = {
    id: string;
    type: 'call' | 'email' | 'meeting' | 'note' | 'task' | 'stage_change';
    description: string;
    timestamp: Date;
    createdBy: string;
    dueDate?: Date;
    isCompleted?: boolean;
};

export type CompetitorInfo = {
    id: string;
    name: string;
    strengths: string;
    weaknesses: string;
    ourAdvantage: string;
};

export type DealDocument = {
    id: string;
    name: string;
    type: 'Proposal' | 'Contract' | 'SOW' | 'Presentation';
    url: string; // mock URL
    uploadedAt: Date;
};

export type SentimentAnalysis = {
    overall: 'Positive' | 'Neutral' | 'Negative' | 'Mixed';
    lastInteraction: string;
    trend: 'improving' | 'declining' | 'stable';
};

/**
 * @typedef {Object} SalesDealExtended - An extended SalesDeal type with more details.
 */
export type SalesDealExtended = SalesDeal & {
    company: string;
    industry: string;
    ownerId: string;
    createdAt: Date;
    expectedCloseDate: Date;
    leadSource: string;
    productsServices: string[];
    contacts: SalesContact[];
    activityLog: ActivityLogEntry[];
    lossReason?: string;
    probability?: number;
    nextSteps?: string;
    aiProbability?: number | null; // AI-predicted probability
    aiRiskAssessment?: 'Low' | 'Medium' | 'High'; // AI-predicted risk level
    aiSuggestedActions?: string[]; // AI-suggested actions
    forecastCategory?: number; // e.g., 1-5 for Commit, Best Case, Pipeline
    competitors?: CompetitorInfo[];
    documents?: DealDocument[];
    dealHealthScore?: number; // 0-100, calculated by AI
    sentimentAnalysis?: SentimentAnalysis;
};

/**
 * @typedef {Object} SalesTeamMember
 * @property {string} id - Unique ID of the team member.
 * @property {string} name - Full name of the team member.
 * @property {string} email - Email of the team member.
 * @property {string} role - Role within the sales team (e.g., 'Account Executive', 'Sales Manager').
 * @property {string} avatarUrl - URL to their avatar image.
 */
export type SalesTeamMember = {
    id: string;
    name: string;
    email: string;
    role: string;
    avatarUrl: string;
};

/**
 * @typedef {Object} DashboardSettings
 * @property {boolean} showAiInsights - Whether to show AI insights by default.
 * @property {string} defaultView - Default view for deals ('table' | 'cards').
 * @property {number} itemsPerPage - Number of deals to show per page.
 * @property {string[]} visibleColumns - Which columns are visible in the table view.
 */
export type DashboardSettings = {
    showAiInsights: boolean;
    defaultView: 'table' | 'cards';
    itemsPerPage: number;
    visibleColumns: string[];
};

// --- End of New Type Definitions ---

// --- Start of Mock Data Generation (for demonstration) ---

const MOCK_SALES_TEAM: SalesTeamMember[] = [
    { id: 'usr-001', name: 'Alice Johnson', email: 'alice@example.com', role: 'Account Executive', avatarUrl: 'https://i.pravatar.cc/150?img=1' },
    { id: 'usr-002', name: 'Bob Smith', email: 'bob@example.com', role: 'Account Executive', avatarUrl: 'https://i.pravatar.cc/150?img=2' },
    { id: 'usr-003', name: 'Charlie Brown', email: 'charlie@example.com', role: 'Sales Manager', avatarUrl: 'https://i.pravatar.cc/150?img=3' },
    { id: 'usr-004', name: 'Diana Prince', email: 'diana@example.com', role: 'Account Executive', avatarUrl: 'https://i.pravatar.cc/150?img=4' },
];

const MOCK_COMPANIES = [
    'Tech Innovators Inc.', 'Global Solutions Co.', 'Pioneer Analytics', 'Quantum Leap Ltd.', 'Nexus Systems',
    'Apex Technologies', 'Bright Future Corp.', 'Dynamic Ventures', 'Elite Innovations', 'Fusion Dynamics',
    'Grand Scale Enterprises', 'Horizon Group', 'Infinite Edge', 'Junction Point', 'Keystone Labs',
    'Luminous Logic', 'Momentum Labs', 'Nova Solutions', 'Optimal Outcomes', 'Prime Innovations'
];
const MOCK_COMPETITORS = ['Synergy Corp', 'Innovatech', 'Future Proof Inc.', 'Legacy Solutions'];
const MOCK_INDUSTRIES = ['Technology', 'Healthcare', 'Finance', 'Manufacturing', 'Retail', 'Education', 'Logistics', 'Energy', 'Automotive'];
const MOCK_PRODUCTS_SERVICES = ['Cloud Hosting', 'Custom Software Development', 'Data Analytics Platform', 'Cybersecurity Suite', 'IT Consulting', 'Managed Services', 'Enterprise AI', 'Digital Marketing Package', 'Hardware Integration'];
const MOCK_LEAD_SOURCES = ['Website', 'Referral', 'Cold Call', 'Event', 'Partner', 'Social Media', 'Webinar', 'Advertisement'];
const MOCK_LOSS_REASONS = ['Budget Constraints', 'Competitor Won', 'No Decision', 'Lack of Features', 'Poor Fit', 'Timing Issues'];

const generateRandomDate = (start: Date, end: Date): Date => new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));

const generateMockActivity = (dealId: string, createdBy: string, createdAt: Date): ActivityLogEntry[] => {
    const activities: ActivityLogEntry[] = [];
    const numActivities = Math.floor(Math.random() * 5) + 1; // 1 to 5 activities
    for (let i = 0; i < numActivities; i++) {
        const typeOptions: ActivityLogEntry['type'][] = ['call', 'email', 'meeting', 'note', 'task'];
        const type = typeOptions[Math.floor(Math.random() * typeOptions.length)];
        const timestamp = generateRandomDate(createdAt, addDays(createdAt, 30 * i));
        let description = '';
        switch (type) {
            case 'call': description = `Called client to discuss next steps.`; break;
            case 'email': description = `Sent follow-up email with proposal summary.`; break;
            case 'meeting': description = `Had a discovery meeting with key stakeholders.`; break;
            case 'note': description = `Client expressed interest in feature X.`; break;
            case 'task': description = `Prepare revised proposal for review.`; break;
        }
        activities.push({ id: `act-${dealId}-${i}-${Math.random().toString(36).substr(2, 9)}`, type, description, timestamp, createdBy, dueDate: type === 'task' ? addDays(timestamp, Math.floor(Math.random() * 7)) : undefined, isCompleted: type === 'task' ? Math.random() > 0.5 : undefined });
    }
    return activities.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
};

export const generateMockSalesDeal = (index: number): SalesDealExtended => {
    const id = `deal-${index + 1}-${Math.random().toString(36).substr(2, 9)}`;
    const name = `Project ${MOCK_COMPANIES[index % MOCK_COMPANIES.length]} - ${MOCK_PRODUCTS_SERVICES[Math.floor(Math.random() * MOCK_PRODUCTS_SERVICES.length)]}`;
    const value = Math.floor(Math.random() * (250000 - 5000) + 5000);
    const stages: SalesDeal['stage'][] = ['Prospecting', 'Qualification', 'Proposal', 'Negotiation', 'Closed Won', 'Closed Lost'];
    const owner = MOCK_SALES_TEAM[Math.floor(Math.random() * MOCK_SALES_TEAM.length)];
    const createdAt = generateRandomDate(subDays(new Date(), 365), subDays(new Date(), 30));
    const expectedCloseDate = generateRandomDate(addDays(createdAt, 30), addDays(createdAt, 180));
    let stage: SalesDeal['stage'] = stages[Math.floor(Math.random() * stages.length)];
    let status: SalesDeal['status'] = 'Open';
    let lossReason: string | undefined;

    if (stage === 'Closed Won') status = 'Closed Won';
    else if (stage === 'Closed Lost') {
        status = 'Closed Lost';
        lossReason = MOCK_LOSS_REASONS[Math.floor(Math.random() * MOCK_LOSS_REASONS.length)];
    } else {
        const openStages = ['Prospecting', 'Qualification', 'Proposal', 'Negotiation'];
        stage = openStages[Math.floor(Math.random() * openStages.length)];
    }

    const productsServices = Array.from({ length: Math.floor(Math.random() * 3) + 1 }, () => MOCK_PRODUCTS_SERVICES[Math.floor(Math.random() * MOCK_PRODUCTS_SERVICES.length)]);
    const contacts: SalesContact[] = [{ id: `con-${id}-1`, name: `${owner.name.split(' ')[0]} Contact`, email: `contact${index}@${MOCK_COMPANIES[index % MOCK_COMPANIES.length].toLowerCase().replace(/\s/g, '')}.com`, phone: `+1-${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}`, title: Math.random() > 0.5 ? 'CTO' : 'Head of Procurement', company: MOCK_COMPANIES[index % MOCK_COMPANIES.length] }];
    const activityLog = generateMockActivity(id, owner.name, createdAt);
    const competitors: CompetitorInfo[] = Math.random() > 0.5 ? [{ id: `comp-${id}-1`, name: MOCK_COMPETITORS[Math.floor(Math.random() * MOCK_COMPETITORS.length)], strengths: 'Established brand', weaknesses: 'Higher cost', ourAdvantage: 'Superior feature set and support' }] : [];
    const documents: DealDocument[] = stage === 'Proposal' || stage === 'Negotiation' || stage === 'Closed Won' ? [{ id: `doc-${id}-1`, name: 'Initial Proposal.pdf', type: 'Proposal', url: '#', uploadedAt: addDays(createdAt, 10) }] : [];

    return { id, name, value, stage, status, company: MOCK_COMPANIES[index % MOCK_COMPANIES.length], industry: MOCK_INDUSTRIES[Math.floor(Math.random() * MOCK_INDUSTRIES.length)], ownerId: owner.id, createdAt, expectedCloseDate, leadSource: MOCK_LEAD_SOURCES[Math.floor(Math.random() * MOCK_LEAD_SOURCES.length)], productsServices, contacts, activityLog, lossReason, probability: stage === 'Closed Won' ? 100 : (stage === 'Closed Lost' ? 0 : Math.floor(Math.random() * 90) + 10), nextSteps: Math.random() > 0.3 ? `Follow up on proposal by ${format(addDays(new Date(), Math.floor(Math.random() * 7)), 'MMM dd')}` : undefined, aiProbability: Math.random() > 0.5 ? Math.floor(Math.random() * 95) + 5 : undefined, aiRiskAssessment: Math.random() > 0.6 ? (Math.random() > 0.5 ? 'High' : 'Medium') : 'Low', aiSuggestedActions: Math.random() > 0.4 ? ['Schedule demo of new feature', 'Send case study relevant to industry'] : undefined, forecastCategory: Math.floor(Math.random() * 5) + 1, competitors, documents, dealHealthScore: Math.floor(Math.random() * 70) + 30, sentimentAnalysis: { overall: 'Positive', lastInteraction: 'Client seemed enthusiastic on the last call.', trend: 'improving' } };
};

export const generateMockSalesDeals = (count: number): SalesDealExtended[] => Array.from({ length: count }, (_, i) => generateMockSalesDeal(i));

// --- End of Mock Data Generation ---

// --- Start of Utility Functions ---

export const formatCurrency = (value: number): string => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value);
export const formatDate = (dateInput: Date | string | null | undefined, formatStr: string = 'MMM dd, yyyy'): string => {
    if (!dateInput) return 'N/A';
    try {
        const date = typeof dateInput === 'string' ? parseISO(dateInput) : dateInput;
        return format(date, formatStr);
    } catch (e) {
        console.error("Error formatting date:", e);
        return 'Invalid Date';
    }
};
export const getDaysBetween = (date1: Date | string, date2: Date | string): number => {
    const d1 = typeof date1 === 'string' ? parseISO(date1) : date1;
    const d2 = typeof date2 === 'string' ? parseISO(date2) : date2;
    return Math.ceil(Math.abs(d2.getTime() - d1.getTime()) / (1000 * 60 * 60 * 24));
};
export const debounce = <T extends (...args: any[]) => any>(func: T, delay: number) => {
    let timeout: NodeJS.Timeout;
    return function (this: any, ...args: Parameters<T>) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), delay);
    } as T;
};
export const useToast = () => {
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info'; id: string } | null>(null);
    const showToast = useCallback((message: string, type: 'success' | 'error' | 'info' = 'info') => {
        const id = Date.now().toString();
        setToast({ message, type, id });
        setTimeout(() => setToast(prev => (prev?.id === id ? null : prev)), 3000);
    }, []);
    const ToastComponent: React.FC = () => {
        if (!toast) return null;
        const base = "fixed bottom-4 right-4 p-4 rounded-lg shadow-lg text-white flex items-center gap-2 z-50 transition-all duration-300 ease-out transform";
        let typeClasses = "", Icon = InformationCircleIcon;
        if (toast.type === 'success') { typeClasses = "bg-green-600"; Icon = CheckCircleIcon; }
        else if (toast.type === 'error') { typeClasses = "bg-red-600"; Icon = XMarkIcon; }
        else { typeClasses = "bg-blue-600"; Icon = InformationCircleIcon; }
        return <div className={`${base} ${typeClasses}`}><Icon className="h-6 w-6" /><span>{toast.message}</span><button onClick={() => setToast(null)} className="ml-4 p-1 rounded-full hover:bg-white/20 transition-colors"><XMarkIcon className="h-4 w-4" /></button></div>;
    };
    return { showToast, ToastComponent };
};

// --- End of Utility Functions ---

// --- Start of New Component Definitions ---

export type SalesFilterBarProps = {
    searchTerm: string; onSearchChange: (term: string) => void; selectedStage: string; onStageChange: (stage: string) => void; selectedOwnerId: string; onOwnerChange: (ownerId: string) => void; startDate: Date | null; onStartDateChange: (date: Date | null) => void; endDate: Date | null; onEndDateChange: (date: Date | null) => void; teamMembers: SalesTeamMember[]; currentView: string; onViewChange: (view: string) => void; sortBy: string; onSortChange: (key: string) => void; sortOrder: 'asc' | 'desc'; onSortOrderChange: (order: 'asc' | 'desc') => void;
};
export const SalesFilterBar: React.FC<SalesFilterBarProps> = React.memo(({ searchTerm, onSearchChange, selectedStage, onStageChange, selectedOwnerId, onOwnerChange, startDate, onStartDateChange, endDate, onEndDateChange, teamMembers, currentView, onViewChange, sortBy, onSortChange, sortOrder, onSortOrderChange }) => {
    const stageOptions = [{ value: '', label: 'All Stages' }, ...['Prospecting', 'Qualification', 'Proposal', 'Negotiation', 'Closed Won', 'Closed Lost'].map(s => ({ value: s, label: s }))];
    const ownerOptions = [{ value: '', label: 'All Owners' }, ...teamMembers.map(t => ({ value: t.id, label: t.name }))];
    const sortOptions = [{ value: 'name', label: 'Deal Name' }, { value: 'value', label: 'Value' }, { value: 'stage', label: 'Stage' }, { value: 'expectedCloseDate', label: 'Close Date' }, { value: 'createdAt', label: 'Created At' }];
    const debouncedSearch = useMemo(() => debounce(onSearchChange, 300), [onSearchChange]);

    return (
        <Card className="p-4 bg-gray-800/70 rounded-lg shadow-xl">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="relative flex-grow min-w-0 lg:w-1/4">
                    <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input type="text" placeholder="Search deals..." defaultValue={searchTerm} onChange={(e) => debouncedSearch(e.target.value)} className="pl-10 pr-4 py-2 w-full bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-cyan-500 focus:border-cyan-500" />
                </div>
                <div className="flex flex-col sm:flex-row gap-4 lg:w-3/4 justify-end">
                    <Select label="Stage" value={selectedStage} onChange={(e) => onStageChange(e.target.value)} options={stageOptions} className="bg-gray-700 border-gray-600 text-white" />
                    <Select label="Owner" value={selectedOwnerId} onChange={(e) => onOwnerChange(e.target.value)} options={ownerOptions} className="bg-gray-700 border-gray-600 text-white" />
                    <div className="flex items-center gap-2">
                        <label className="text-gray-400 text-sm whitespace-nowrap hidden sm:block">Close Date:</label>
                        <DatePicker selected={startDate} onChange={(date: Date | null) => onStartDateChange(date)} selectsStart startDate={startDate} endDate={endDate} placeholderText="Start" className="bg-gray-700 border-gray-600 rounded-lg px-3 py-2 text-white w-32 focus:ring-cyan-500 focus:border-cyan-500" dateFormat="MMM dd, yy" isClearable />
                        <span className="text-gray-400">-</span>
                        <DatePicker selected={endDate} onChange={(date: Date | null) => onEndDateChange(date)} selectsEnd startDate={startDate} endDate={endDate} minDate={startDate} placeholderText="End" className="bg-gray-700 border-gray-600 rounded-lg px-3 py-2 text-white w-32 focus:ring-cyan-500 focus:border-cyan-500" dateFormat="MMM dd, yy" isClearable />
                    </div>
                </div>
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-4 pt-4 border-t border-gray-700">
                <div className="flex items-center gap-2">
                    <Select label="Sort By" value={sortBy} onChange={(e) => onSortChange(e.target.value)} options={sortOptions} className="bg-gray-700 border-gray-600 text-white w-36" />
                    <Button onClick={() => onSortOrderChange(sortOrder === 'asc' ? 'desc' : 'asc')} className="p-2 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-lg">{sortOrder === 'asc' ? <ChevronUpIcon className="h-5 w-5" /> : <ChevronDownIcon className="h-5 w-5" />}</Button>
                </div>
                <div className="flex bg-gray-700 rounded-lg p-1">
                    {[
                        { key: 'pipeline', label: 'Pipeline', icon: FunnelIcon },
                        { key: 'board', label: 'Board', icon: ViewColumnsIcon },
                        { key: 'list', label: 'List', icon: ListBulletIcon },
                        { key: 'forecast', label: 'Forecast', icon: PresentationChartLineIcon },
                        { key: 'analytics', label: 'Analytics', icon: ChartBarIcon },
                        { key: 'settings', label: 'Settings', icon: Cog8ToothIcon }
                    ].map(({ key, label, icon: Icon }) => (
                        <Button key={key} onClick={() => onViewChange(key)} className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${currentView === key ? 'bg-cyan-600 text-white' : 'text-gray-300 hover:bg-gray-600'}`} title={`${label} View`}>
                            <Icon className="h-5 w-5 inline-block md:mr-1" /><span className="hidden md:inline">{label}</span>
                        </Button>
                    ))}
                </div>
            </div>
        </Card>
    );
});

export type SalesDealTableProps = {
    deals: SalesDealExtended[]; onDealClick: (deal: SalesDealExtended) => void; visibleColumns: string[]; onDeleteDeal: (dealId: string) => void; teamMembers: SalesTeamMember[]; currentPage: number; itemsPerPage: number; onPageChange: (page: number) => void; totalDeals: number; sortBy: string; sortOrder: 'asc' | 'desc'; onSortChange: (key: string) => void; onSortOrderChange: (order: 'asc' | 'desc') => void;
};
export const SalesDealTable: React.FC<SalesDealTableProps> = React.memo(({ deals, onDealClick, visibleColumns, onDeleteDeal, teamMembers, currentPage, itemsPerPage, onPageChange, totalDeals, sortBy, sortOrder, onSortChange, onSortOrderChange }) => {
    const totalPages = Math.ceil(totalDeals / itemsPerPage);
    const getOwnerName = (ownerId: string) => teamMembers.find(m => m.id === ownerId)?.name || 'N/A';
    const renderColumn = (deal: SalesDealExtended, column: string) => {
        switch (column) {
            case 'name': return <span className="font-semibold text-white">{deal.name}</span>;
            case 'company': return <span className="text-gray-300">{deal.company}</span>;
            case 'value': return <span className="text-cyan-300">{formatCurrency(deal.value)}</span>;
            case 'stage':
                const stageColor = { Prospecting: 'bg-blue-600', Qualification: 'bg-indigo-600', Proposal: 'bg-purple-600', Negotiation: 'bg-yellow-600', 'Closed Won': 'bg-green-600', 'Closed Lost': 'bg-red-600' }[deal.stage] || 'bg-gray-600';
                return <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${stageColor} text-white`}>{deal.stage}</span>;
            case 'owner': return <span className="text-gray-400">{getOwnerName(deal.ownerId)}</span>;
            case 'expectedCloseDate': return <span className="text-gray-400">{formatDate(deal.expectedCloseDate)}</span>;
            case 'createdAt': return <span className="text-gray-500 text-xs">{formatDate(deal.createdAt, 'MM/dd/yy')}</span>;
            case 'leadSource': return <span className="text-gray-400">{deal.leadSource}</span>;
            case 'status':
                const statusColor = { Open: 'text-blue-400', 'Closed Won': 'text-green-400', 'Closed Lost': 'text-red-400' }[deal.status] || 'text-gray-400';
                return <span className={`font-medium ${statusColor}`}>{deal.status}</span>;
            default: return <span className="text-gray-400">{String((deal as any)[column])}</span>;
        }
    };
    const headers = [{ key: 'name', label: 'Deal Name', sortable: true }, { key: 'company', label: 'Company', sortable: false }, { key: 'value', label: 'Value', sortable: true }, { key: 'stage', label: 'Stage', sortable: true }, { key: 'owner', label: 'Owner', sortable: false }, { key: 'expectedCloseDate', label: 'Close Date', sortable: true }, { key: 'createdAt', label: 'Created At', sortable: true }, { key: 'leadSource', label: 'Lead Source', sortable: false }, { key: 'status', label: 'Status', sortable: false }];
    const visibleHeaders = headers.filter(h => visibleColumns.includes(h.key));
    const handleSortClick = (key: string) => { if (sortBy === key) onSortOrderChange(sortOrder === 'asc' ? 'desc' : 'asc'); else { onSortChange(key); onSortOrderChange('asc'); } };

    return (
        <Card title="All Sales Deals" className="overflow-hidden bg-gray-800/70">
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-700">
                    <thead className="bg-gray-700"><tr>{visibleHeaders.map(h => <th key={h.key} scope="col" className={`px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider ${h.sortable ? 'cursor-pointer hover:text-white' : ''}`} onClick={() => h.sortable && handleSortClick(h.key)}><div className="flex items-center">{h.label}{sortBy === h.key && (sortOrder === 'asc' ? <ChevronUpIcon className="ml-1 h-4 w-4" /> : <ChevronDownIcon className="ml-1 h-4 w-4" />)}</div></th>)}<th scope="col" className="relative px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th></tr></thead>
                    <tbody className="bg-gray-800 divide-y divide-gray-700">
                        {deals.length === 0 ? (<tr><td colSpan={visibleHeaders.length + 1} className="px-6 py-4 text-sm text-gray-500 text-center">No deals found.</td></tr>) : (deals.map((deal) => (<tr key={deal.id} className="hover:bg-gray-700/50 cursor-pointer" onClick={() => onDealClick(deal)}>{visibleHeaders.map(h => (<td key={`${deal.id}-${h.key}`} className="px-6 py-4 whitespace-nowrap text-sm">{renderColumn(deal, h.key)}</td>))}<td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium"><div className="flex items-center gap-2"><Button onClick={(e) => { e.stopPropagation(); onDealClick(deal); }} className="text-cyan-400 hover:text-cyan-300 p-1 rounded-md hover:bg-gray-700" title="Edit"><PencilSquareIcon className="h-5 w-5" /></Button><Button onClick={(e) => { e.stopPropagation(); onDeleteDeal(deal.id); }} className="text-red-400 hover:text-red-300 p-1 rounded-md hover:bg-gray-700" title="Delete"><TrashIcon className="h-5 w-5" /></Button></div></td></tr>)))}
                    </tbody>
                </table>
            </div>
            {totalPages > 1 && (<div className="flex justify-between items-center px-4 py-3 bg-gray-700/50 rounded-b-lg border-t border-gray-700"><div className="text-sm text-gray-400">Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, totalDeals)} of {totalDeals} deals</div><nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"><Button onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1} className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-600 bg-gray-700 text-sm font-medium text-gray-400 hover:bg-gray-600 disabled:opacity-50">Previous</Button>{Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (<Button key={p} onClick={() => onPageChange(p)} className={`relative inline-flex items-center px-4 py-2 border border-gray-600 bg-gray-700 text-sm font-medium ${currentPage === p ? 'z-10 bg-cyan-600 text-white' : 'text-gray-400 hover:bg-gray-600'}`}>{p}</Button>))}<Button onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages} className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-600 bg-gray-700 text-sm font-medium text-gray-400 hover:bg-gray-600 disabled:opacity-50">Next</Button></nav></div>)}
        </Card>
    );
});

export type DealDetailModalProps = {
    deal: SalesDealExtended | null; onSave: (deal: SalesDealExtended) => void; onClose: () => void; teamMembers: SalesTeamMember[]; getAiProbabilityForDeal: (deal: SalesDealExtended) => Promise<void>; isLoadingAi: boolean; aiProbability: number | null; showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
};
export const DealDetailModal: React.FC<DealDetailModalProps> = ({ deal, onSave, onClose, teamMembers, getAiProbabilityForDeal, isLoadingAi, aiProbability, showToast }) => {
    const [editedDeal, setEditedDeal] = useState<SalesDealExtended | null>(deal);
    const [activeTab, setActiveTab] = useState<'overview' | 'activity' | 'notes' | 'contacts' | 'ai'>('overview');
    const [newActivityDescription, setNewActivityDescription] = useState<string>('');
    const [newActivityType, setNewActivityType] = useState<ActivityLogEntry['type']>('note');
    useEffect(() => { setEditedDeal(deal); if (deal) setActiveTab('overview'); }, [deal]);
    if (!deal || !editedDeal) return null;

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => setEditedDeal(p => p ? { ...p, [e.target.name]: e.target.value } : null);
    const handleDateChange = (date: Date | null, field: keyof SalesDealExtended) => setEditedDeal(p => p ? { ...p, [field]: date } : null);
    const handleSave = () => { if (editedDeal) { onSave(editedDeal); showToast('Deal updated!', 'success'); } };
    const handleAddActivity = () => {
        if (newActivityDescription.trim() === '') { showToast('Description empty.', 'error'); return; }
        const newActivity: ActivityLogEntry = { id: `act-${editedDeal.id}-${Date.now()}`, type: newActivityType, description: newActivityDescription, timestamp: new Date(), createdBy: 'Current User' };
        setEditedDeal(p => p ? { ...p, activityLog: [...p.activityLog, newActivity].sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime()) } : null);
        setNewActivityDescription(''); setNewActivityType('note'); showToast('Activity added!', 'success');
    };
    const stageOptions = ['Prospecting', 'Qualification', 'Proposal', 'Negotiation', 'Closed Won', 'Closed Lost'];
    const statusOptions = ['Open', 'Closed Won', 'Closed Lost'];
    const leadSourceOptions = MOCK_LEAD_SOURCES;
    const activityTypeOptions: { value: ActivityLogEntry['type'], label: string }[] = [{ value: 'note', label: 'Note' }, { value: 'call', label: 'Call' }, { value: 'email', label: 'Email' }, { value: 'meeting', label: 'Meeting' }, { value: 'task', label: 'Task' }, { value: 'stage_change', label: 'Stage Change' }];
    const aiRiskColor = (risk: string | undefined) => ({ Low: 'text-green-400', Medium: 'text-yellow-400', High: 'text-red-400' }[risk || ''] || 'text-gray-400');

    return (
        <Modal isOpen={!!deal} onClose={onClose} title={`Deal: ${deal.name}`} size="lg">
            <div className="flex flex-col md:flex-row border-b border-gray-700">
                <div className="flex-none p-4 bg-gray-800/50 rounded-tl-lg md:rounded-bl-lg md:rounded-tr-none overflow-x-auto"><nav className="flex md:flex-col space-x-4 md:space-x-0 md:space-y-2">
                    <Button onClick={() => setActiveTab('overview')} className={`flex items-center px-4 py-2 rounded-md text-sm font-medium ${activeTab === 'overview' ? 'bg-cyan-600 text-white' : 'text-gray-300 hover:bg-gray-700'}`}><DocumentTextIcon className="h-5 w-5 mr-2" /> Overview</Button>
                    <Button onClick={() => setActiveTab('activity')} className={`flex items-center px-4 py-2 rounded-md text-sm font-medium ${activeTab === 'activity' ? 'bg-cyan-600 text-white' : 'text-gray-300 hover:bg-gray-700'}`}><ClockIcon className="h-5 w-5 mr-2" /> Activity</Button>
                    <Button onClick={() => setActiveTab('contacts')} className={`flex items-center px-4 py-2 rounded-md text-sm font-medium ${activeTab === 'contacts' ? 'bg-cyan-600 text-white' : 'text-gray-300 hover:bg-gray-700'}`}><UserIcon className="h-5 w-5 mr-2" /> Contacts</Button>
                    <Button onClick={() => setActiveTab('ai')} className={`flex items-center px-4 py-2 rounded-md text-sm font-medium ${activeTab === 'ai' ? 'bg-cyan-600 text-white' : 'text-gray-300 hover:bg-gray-700'}`}><PuzzlePieceIcon className="h-5 w-5 mr-2" /> AI Insights</Button>
                </nav></div>
                <div className="flex-grow p-6 bg-gray-900 overflow-y-auto max-h-[70vh]">
                    {activeTab === 'overview' && (<div className="space-y-4">
                        <h3 className="text-xl font-semibold text-white mb-4">Deal Overview</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Input label="Deal Name" name="name" value={editedDeal.name} onChange={handleInputChange} />
                            <Input label="Company" name="company" value={editedDeal.company} onChange={handleInputChange} />
                            <Input label="Industry" name="industry" value={editedDeal.industry} onChange={handleInputChange} />
                            <Input label="Value" name="value" type="number" value={editedDeal.value} onChange={handleInputChange} prefix="$" />
                            <Select label="Stage" name="stage" value={editedDeal.stage} onChange={handleInputChange} options={stageOptions.map(s => ({ value: s, label: s }))} />
                            <Select label="Status" name="status" value={editedDeal.status} onChange={handleInputChange} options={statusOptions.map(s => ({ value: s, label: s }))} />
                            <Select label="Owner" name="ownerId" value={editedDeal.ownerId} onChange={handleInputChange} options={teamMembers.map(m => ({ value: m.id, label: m.name }))} />
                            <Select label="Lead Source" name="leadSource" value={editedDeal.leadSource} onChange={handleInputChange} options={leadSourceOptions.map(s => ({ value: s, label: s }))} />
                            <div><label className="block text-sm font-medium text-gray-300 mb-1">Expected Close Date</label><DatePicker selected={editedDeal.expectedCloseDate} onChange={(d: Date | null) => handleDateChange(d, 'expectedCloseDate')} className="w-full bg-gray-700 border-gray-600 rounded-lg px-3 py-2 text-white" dateFormat="MMM dd, yyyy" /></div>
                            <div><label className="block text-sm font-medium text-gray-300 mb-1">Created At</label><Input name="createdAt" value={formatDate(editedDeal.createdAt, 'MMM dd, yyyy HH:mm')} disabled /></div>
                            <Input label="Probability (%)" name="probability" type="number" value={editedDeal.probability || ''} onChange={handleInputChange} min="0" max="100" />
                            <Input label="Next Steps" name="nextSteps" value={editedDeal.nextSteps || ''} onChange={handleInputChange} />
                        </div>
                    </div>)}
                    {activeTab === 'activity' && (<div><h3 className="text-xl font-semibold text-white mb-4">Activity Log</h3>
                        <div className="border border-gray-700 rounded-lg p-4 bg-gray-800"><h4 className="text-lg font-medium text-white mb-2">Add Activity</h4>
                            <Select label="Type" value={newActivityType} onChange={(e) => setNewActivityType(e.target.value as any)} options={activityTypeOptions} className="mb-3 bg-gray-700" />
                            <textarea className="w-full p-2 bg-gray-700 border-gray-600 rounded-lg text-white" placeholder="Description..." value={newActivityDescription} onChange={(e) => setNewActivityDescription(e.target.value)}></textarea>
                            <Button onClick={handleAddActivity} className="mt-3 bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-2 px-4 rounded-lg flex items-center"><PlusIcon className="h-5 w-5 mr-2" /> Add</Button>
                        </div>
                        <ul className="space-y-4 mt-4">{editedDeal.activityLog.map(act => <li key={act.id} className="p-4 bg-gray-800 rounded-lg border-gray-700 flex justify-between"><div className="flex-grow"><p className="font-semibold text-white flex items-center gap-2">{act.type.charAt(0).toUpperCase() + act.type.slice(1)} <span className="text-sm text-gray-400 font-normal">by {act.createdBy}</span></p><p className="text-gray-300 mt-1">{act.description}</p></div><div className="text-sm text-gray-500">{formatDate(act.timestamp, 'MMM dd, hh:mm a')}</div></li>)}</ul>
                    </div>)}
                    {activeTab === 'contacts' && (<div><h3 className="text-xl font-semibold text-white mb-4">Deal Contacts</h3><ul className="space-y-4">{editedDeal.contacts.map(c => <li key={c.id} className="p-4 bg-gray-800 rounded-lg border-gray-700"><p className="font-semibold text-white">{c.name}</p><p className="text-sm text-gray-400">{c.title} at {c.company}</p><p className="text-sm text-gray-400">Email: <a href={`mailto:${c.email}`} className="text-cyan-400 hover:underline">{c.email}</a></p></li>)}</ul></div>)}
                    {activeTab === 'ai' && (<div><h3 className="text-xl font-semibold text-white mb-4">AI Insights</h3><div className="space-y-4">
                        <div className="p-4 bg-gray-800 rounded-lg border-gray-700"><div className="flex justify-between mb-3"><p className="text-lg font-medium text-white">Probability to Close</p><Button onClick={() => getAiProbabilityForDeal(editedDeal)} disabled={isLoadingAi} className="bg-cyan-700 hover:bg-cyan-800 text-white py-1 px-3 rounded-lg text-sm flex items-center">{isLoadingAi ? <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path></svg> : <RocketLaunchIcon className="h-4 w-4 mr-2" />}{isLoadingAi ? 'Recalculating...' : 'Recalculate'}</Button></div><p className="text-4xl font-bold text-cyan-300">{isLoadingAi ? '...' : (aiProbability !== null ? `${aiProbability.toFixed(1)}%` : 'N/A')}</p></div>
                        <div className="p-4 bg-gray-800 rounded-lg border-gray-700"><p className="text-lg font-medium text-white mb-2">AI Risk Assessment</p><p className={`text-2xl font-bold ${aiRiskColor(editedDeal.aiRiskAssessment)}`}>{editedDeal.aiRiskAssessment || 'N/A'}</p></div>
                        <div className="p-4 bg-gray-800 rounded-lg border-gray-700"><p className="text-lg font-medium text-white mb-2">AI Suggested Actions</p>{editedDeal.aiSuggestedActions && editedDeal.aiSuggestedActions.length > 0 ? (<ul className="list-disc list-inside space-y-2 text-gray-300">{editedDeal.aiSuggestedActions.map((a, i) => <li key={i}>{a}</li>)}</ul>) : (<p className="text-gray-500">No actions suggested.</p>)}</div>
                    </div></div>)}
                </div>
            </div>
            <div className="flex justify-end p-4 bg-gray-800/50 rounded-b-lg border-t border-gray-700">
                <Button onClick={onClose} className="mr-2 px-6 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg">Cancel</Button>
                <Button onClick={handleSave} className="px-6 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg">Save</Button>
            </div>
        </Modal>
    );
};

export type AddDealModalProps = {
    isOpen: boolean; onClose: () => void; onAddDeal: (deal: SalesDealExtended) => void; teamMembers: SalesTeamMember[]; showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
};
export const AddDealModal: React.FC<AddDealModalProps> = ({ isOpen, onClose, onAddDeal, teamMembers, showToast }) => {
    const [newDealData, setNewDealData] = useState<Partial<SalesDealExtended>>({});
    useEffect(() => { if (isOpen) setNewDealData({ name: '', value: 0, stage: 'Prospecting', status: 'Open', company: '', industry: '', ownerId: teamMembers.length > 0 ? teamMembers[0].id : '', expectedCloseDate: addDays(new Date(), 30), leadSource: 'Website', probability: 10 }); }, [isOpen, teamMembers]);
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => setNewDealData(p => ({ ...p, [e.target.name]: e.target.name === 'value' ? parseFloat(e.target.value) : e.target.value }));
    const handleDateChange = (date: Date | null) => setNewDealData(p => ({ ...p, expectedCloseDate: date || undefined }));
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newDealData.name || !newDealData.company || !newDealData.value) { showToast('Please fill required fields.', 'error'); return; }
        const dealToSave: SalesDealExtended = { id: `deal-${Date.now()}`, createdAt: new Date(), ...newDealData, productsServices: [], contacts: [], activityLog: [], value: newDealData.value || 0, stage: newDealData.stage || 'Prospecting', status: newDealData.status || 'Open', company: newDealData.company, industry: newDealData.industry || '', ownerId: newDealData.ownerId || '', expectedCloseDate: newDealData.expectedCloseDate || new Date(), leadSource: newDealData.leadSource || 'Website', name: newDealData.name };
        onAddDeal(dealToSave); showToast('New deal added!', 'success'); onClose();
    };
    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Add New Deal" size="md">
            <form onSubmit={handleSubmit} className="space-y-4 p-6 bg-gray-900 overflow-y-auto max-h-[70vh]">
                <Input label="Deal Name" name="name" value={newDealData.name || ''} onChange={handleInputChange} required />
                <Input label="Company" name="company" value={newDealData.company || ''} onChange={handleInputChange} required />
                <Input label="Value" name="value" type="number" value={newDealData.value || 0} onChange={handleInputChange} prefix="$" required />
                <Select label="Owner" name="ownerId" value={newDealData.ownerId || ''} onChange={handleInputChange} options={teamMembers.map(m => ({ value: m.id, label: m.name }))} />
                <div><label className="block text-sm font-medium text-gray-300 mb-1">Expected Close Date</label><DatePicker selected={newDealData.expectedCloseDate} onChange={handleDateChange} className="w-full bg-gray-700 border-gray-600 rounded-lg px-3 py-2 text-white" required /></div>
                <div className="flex justify-end pt-4 border-t border-gray-700"><Button type="button" onClick={onClose} className="mr-2 px-6 py-2 bg-gray-600">Cancel</Button><Button type="submit" className="px-6 py-2 bg-cyan-600 flex items-center"><PlusIcon className="h-5 w-5 mr-2" /> Create</Button></div>
            </form>
        </Modal>
    );
};

export type AnalyticsDashboardProps = { salesDeals: SalesDealExtended[]; teamMembers: SalesTeamMember[]; };
export const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({ salesDeals, teamMembers }) => {
    const salesVelocityData = useMemo(() => {/* ... complex logic ... */ return [];}, [salesDeals]);
    const winLossReasonData = useMemo(() => {/* ... complex logic ... */ return [];}, [salesDeals]);
    const kpiData = useMemo(() => ({ totalPipelineValue: salesDeals.reduce((s, d) => d.status !== 'Closed Won' ? s + d.value : s, 0), winRate: 50, avgDealSize: 25000, avgSalesCycleLength: 45 }), [salesDeals]);
    const PIE_COLORS = ['#06b6d4', '#3b82f6', '#8b5cf6', '#10b981', '#f97316', '#ef4444'];

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold text-white">Sales Analytics</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="text-center p-5 bg-gray-800/70"><p className="text-3xl font-bold text-white flex items-center justify-center gap-2"><CurrencyDollarIcon className="h-8 w-8 text-cyan-400" />{formatCurrency(kpiData.totalPipelineValue)}</p><p className="text-sm text-gray-400 mt-1">Pipeline Value</p></Card>
                <Card className="text-center p-5 bg-gray-800/70"><p className="text-3xl font-bold text-white flex items-center justify-center gap-2"><TrophyIcon className="h-8 w-8 text-green-400" />{kpiData.winRate.toFixed(1)}%</p><p className="text-sm text-gray-400 mt-1">Win Rate</p></Card>
                <Card className="text-center p-5 bg-gray-800/70"><p className="text-3xl font-bold text-white flex items-center justify-center gap-2"><CurrencyDollarIcon className="h-8 w-8 text-indigo-400" />{formatCurrency(kpiData.avgDealSize)}</p><p className="text-sm text-gray-400 mt-1">Avg Deal Size</p></Card>
                <Card className="text-center p-5 bg-gray-800/70"><p className="text-3xl font-bold text-white flex items-center justify-center gap-2"><CalendarDaysIcon className="h-8 w-8 text-yellow-400" />{kpiData.avgSalesCycleLength.toFixed(0)} days</p><p className="text-sm text-gray-400 mt-1">Avg Sales Cycle</p></Card>
            </div>
            {/* Additional charts would go here */}
        </div>
    );
};

export type DashboardSettingsViewProps = { settings: DashboardSettings; onSaveSettings: (newSettings: DashboardSettings) => void; showToast: (message: string, type?: 'success' | 'error' | 'info') => void; };
export const DashboardSettingsView: React.FC<DashboardSettingsViewProps> = ({ settings, onSaveSettings, showToast }) => {
    const [tempSettings, setTempSettings] = useState<DashboardSettings>(settings);
    useEffect(() => { setTempSettings(settings); }, [settings]);
    const handleToggle = (key: keyof DashboardSettings) => setTempSettings(p => ({ ...p, [key]: !p[key] }));
    const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => { const { name, value } = e.target; setTempSettings(p => ({ ...p, [name]: name === 'itemsPerPage' ? parseInt(value) : value as any })); };
    const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); onSaveSettings(tempSettings); showToast('Settings saved!', 'success'); };

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold text-white">Dashboard Settings</h2>
            <Card title="Display Preferences" className="p-6 bg-gray-800/70"><form onSubmit={handleSubmit} className="space-y-6">
                <div className="flex items-center justify-between"><label className="text-lg font-medium text-white">Show AI Insights</label><Button type="button" onClick={() => handleToggle('showAiInsights')} className={`relative inline-flex h-6 w-11 border-2 rounded-full cursor-pointer ${tempSettings.showAiInsights ? 'bg-cyan-600' : 'bg-gray-600'}`}><span className={`inline-block h-5 w-5 rounded-full bg-white shadow transform ${tempSettings.showAiInsights ? 'translate-x-5' : 'translate-x-0'}`}></span></Button></div>
                <div className="flex justify-end pt-6 border-t border-gray-700"><Button type="submit" className="px-6 py-2 bg-cyan-600 hover:bg-cyan-700">Save</Button></div>
            </form></Card>
        </div>
    );
};

export const PIPELINE_STAGES = ['Prospecting', 'Qualification', 'Proposal', 'Negotiation', 'Closed Won', 'Closed Lost'];
export const STAGE_COLORS: { [key: string]: string } = { Prospecting: '#06b6d4', Qualification: '#3b82f6', Proposal: '#8b5cf6', Negotiation: '#facc15', 'Closed Won': '#10b981', 'Closed Lost': '#ef4444' };

const SalesPipelineView: React.FC = () => {
    const context = useContext(DataContext);
    if (!context) throw new Error("SalesPipelineView must be within DataProvider");

    const initialSalesDeals = useMemo(() => context.salesDeals?.length > 0 ? context.salesDeals.map(d => ({ ...d, createdAt: new Date(d.createdAt), expectedCloseDate: new Date(d.expectedCloseDate) })) as SalesDealExtended[] : generateMockSalesDeals(200), [context.salesDeals]);
    const [_salesDeals, set_SalesDeals] = useState<SalesDealExtended[]>(initialSalesDeals);
    const { showToast, ToastComponent } = useToast();
    const [aiProbability, setAiProbability] = useState<number | null>(null);
    const [isLoadingAi, setIsLoadingAi] = useState(false);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [filterStage, setFilterStage] = useState<string>('');
    const [filterOwnerId, setFilterOwnerId] = useState<string>('');
    const [filterStartDate, setFilterStartDate] = useState<Date | null>(null);
    const [filterEndDate, setFilterEndDate] = useState<Date | null>(null);
    const [sortBy, setSortBy] = useState<string>('expectedCloseDate');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [itemsPerPage, setItemsPerPage] = useState<number>(10);
    const [selectedDealForDetail, setSelectedDealForDetail] = useState<SalesDealExtended | null>(null);
    const [isAddDealModalOpen, setIsAddDealModalOpen] = useState<boolean>(false);
    const [isConfirmDeleteModalOpen, setIsConfirmDeleteModalOpen] = useState<boolean>(false);
    const [dealToDelete, setDealToDelete] = useState<string | null>(null);
    const [currentView, setCurrentView] = useState<'pipeline' | 'board' | 'list' | 'forecast' | 'analytics' | 'settings'>('pipeline');
    const [dashboardSettings, setDashboardSettings] = useState<DashboardSettings>({ showAiInsights: true, defaultView: 'table', itemsPerPage: 10, visibleColumns: ['name', 'company', 'value', 'stage', 'owner', 'expectedCloseDate'] });
    useEffect(() => { setItemsPerPage(dashboardSettings.itemsPerPage); }, [dashboardSettings.itemsPerPage]);
    const teamMembers: SalesTeamMember[] = MOCK_SALES_TEAM;

    const filteredAndSortedDeals = useMemo(() => {
        let filtered = _salesDeals;
        if (searchTerm) filtered = filtered.filter(d => d.name.toLowerCase().includes(searchTerm.toLowerCase()));
        if (filterStage) filtered = filtered.filter(d => d.stage === filterStage);
        if (filterOwnerId) filtered = filtered.filter(d => d.ownerId === filterOwnerId);
        if (filterStartDate) filtered = filtered.filter(d => isBefore(filterStartDate, d.expectedCloseDate));
        if (filterEndDate) filtered = filtered.filter(d => isBefore(d.expectedCloseDate, addDays(filterEndDate, 1)));
        if (sortBy) filtered = [...filtered].sort((a, b) => {
            let valA = (a as any)[sortBy], valB = (b as any)[sortBy];
            if (typeof valA === 'string') return sortOrder === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
            return sortOrder === 'asc' ? valA - valB : valB - valA;
        });
        return filtered;
    }, [_salesDeals, searchTerm, filterStage, filterOwnerId, filterStartDate, filterEndDate, sortBy, sortOrder]);

    const paginatedDeals = useMemo(() => filteredAndSortedDeals.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage), [filteredAndSortedDeals, currentPage, itemsPerPage]);

    const pipelineData = useMemo(() => PIPELINE_STAGES.map(stage => ({ name: stage, value: _salesDeals.filter(d => d.stage === stage).length, fill: STAGE_COLORS[stage] })).filter(d => d.value > 0), [_salesDeals]);
    const kpiData = useMemo(() => ({ pipelineValue: _salesDeals.reduce((s, d) => d.status !== 'Closed Won' ? s + d.value : s, 0), winRate: 50, avgDealSize: 25000 }), [_salesDeals]);

    const handleAddDeal = useCallback((newDeal: SalesDealExtended) => set_SalesDeals(p => [...p, newDeal]), []);
    const handleUpdateDeal = useCallback((updatedDeal: SalesDealExtended) => { set_SalesDeals(p => p.map(d => d.id === updatedDeal.id ? updatedDeal : d)); setSelectedDealForDetail(null); }, []);
    const handleDeleteDeal = useCallback((dealId: string) => { setDealToDelete(dealId); setIsConfirmDeleteModalOpen(true); }, []);
    const confirmDeleteDeal = useCallback(() => { if (dealToDelete) { set_SalesDeals(p => p.filter(d => d.id !== dealToDelete)); setDealToDelete(null); setIsConfirmDeleteModalOpen(false); } }, [dealToDelete]);
    const handleDealStageChange = (dealId: string, newStage: string) => set_SalesDeals(p => p.map(d => d.id === dealId ? { ...d, stage: newStage } : d));
    const onDragEnd = (result: DropResult) => {
        const { destination, source, draggableId } = result;
        if (!destination || (destination.droppableId === source.droppableId && destination.index === source.index)) return;
        handleDealStageChange(draggableId, destination.droppableId);
    };
    
    const getAiProbability = async (deal: SalesDealExtended) => {
        setIsLoadingAi(true);
        setAiProbability(null);
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.NEXT_PUBLIC_GOOGLE_GEMINI_API_KEY as string });
            const prompt = `Estimate the probability to close for this deal: ${deal.name}, Value: $${deal.value}, Stage: ${deal.stage}. Respond with only a number (0-100).`;
            const model = ai.getGenerativeModel({ model: 'gemini-pro' });
            const result = await model.generateContent(prompt);
            const text = result.response.text();
            const prob = parseFloat(text);
            if (!isNaN(prob)) { setAiProbability(prob); set_SalesDeals(p => p.map(d => d.id === deal.id ? { ...d, aiProbability: prob } : d)); }
        } catch (err) { console.error("AI Error:", err); }
        finally { setIsLoadingAi(false); }
    };

    return (
        <div className="space-y-6 min-h-screen bg-gray-900 text-white p-6">
            <h1 className="text-4xl font-extrabold text-white">Mega Sales Dashboard</h1>
            <SalesFilterBar searchTerm={searchTerm} onSearchChange={setSearchTerm} selectedStage={filterStage} onStageChange={setFilterStage} selectedOwnerId={filterOwnerId} onOwnerChange={setFilterOwnerId} startDate={filterStartDate} onStartDateChange={setFilterStartDate} endDate={filterEndDate} onEndDateChange={setFilterEndDate} teamMembers={teamMembers} currentView={currentView} onViewChange={setCurrentView as any} sortBy={sortBy} onSortChange={setSortBy} sortOrder={sortOrder} onSortOrderChange={setSortOrder} />
            
            {currentView === 'pipeline' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card title="Sales Funnel" className="p-6 bg-gray-800/70">
                        <ResponsiveContainer width="100%" height={300}>
                            <FunnelChart><Tooltip contentStyle={{ backgroundColor: '#1a202c', color: '#fff' }} /><Funnel dataKey="value" data={pipelineData} isAnimationActive><LabelList position="right" fill="#fff" dataKey="name" /></Funnel></FunnelChart>
                        </ResponsiveContainer>
                    </Card>
                    <Card title="Top Open Deals" className="p-6 bg-gray-800/70">
                        {_salesDeals.filter(d => d.status === 'Open').slice(0, 5).map(deal => (<div key={deal.id}>{deal.name}</div>))}
                        <Button onClick={() => setIsAddDealModalOpen(true)} className="mt-6 w-full bg-cyan-600 hover:bg-cyan-700"><PlusIcon className="h-5 w-5 mr-2" /> Add New Deal</Button>
                    </Card>
                </div>
            )}
            
            {currentView === 'board' && (
                 <DragDropContext onDragEnd={onDragEnd}>
                    <div className="flex gap-4 overflow-x-auto p-2">
                        {PIPELINE_STAGES.filter(s => s !== 'Closed Won' && s !== 'Closed Lost').map(stage => (
                            <Droppable droppableId={stage} key={stage}>
                                {(provided) => (
                                    <div {...provided.droppableProps} ref={provided.innerRef} className="bg-gray-800 rounded-lg w-80 flex-shrink-0">
                                        <h3 className="p-3 text-lg font-semibold text-white border-b border-gray-700">{stage}</h3>
                                        <div className="p-2 space-y-2 min-h-[400px]">
                                            {filteredAndSortedDeals.filter(d => d.stage === stage).map((deal, index) => (
                                                <Draggable key={deal.id} draggableId={deal.id} index={index}>
                                                    {(provided) => (
                                                        <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} onClick={() => setSelectedDealForDetail(deal)} className="bg-gray-700 p-3 rounded-md shadow hover:bg-gray-600 cursor-pointer">
                                                            <p className="font-bold text-white">{deal.name}</p>
                                                            <p className="text-sm text-gray-300">{deal.company}</p>
                                                            <p className="text-sm font-semibold text-cyan-300 mt-1">{formatCurrency(deal.value)}</p>
                                                        </div>
                                                    )}
                                                </Draggable>
                                            ))}
                                            {provided.placeholder}
                                        </div>
                                    </div>
                                )}
                            </Droppable>
                        ))}
                    </div>
                </DragDropContext>
            )}

            {currentView === 'list' && <SalesDealTable deals={paginatedDeals} onDealClick={setSelectedDealForDetail} visibleColumns={dashboardSettings.visibleColumns} onDeleteDeal={handleDeleteDeal} teamMembers={teamMembers} currentPage={currentPage} itemsPerPage={itemsPerPage} onPageChange={setCurrentPage} totalDeals={filteredAndSortedDeals.length} sortBy={sortBy} sortOrder={sortOrder} onSortChange={setSortBy} onSortOrderChange={setSortOrder} />}
            {currentView === 'analytics' && <AnalyticsDashboard salesDeals={_salesDeals} teamMembers={teamMembers} />}
            {currentView === 'settings' && <DashboardSettingsView settings={dashboardSettings} onSaveSettings={setDashboardSettings} showToast={showToast} />}
            
            <DealDetailModal deal={selectedDealForDetail} onClose={() => setSelectedDealForDetail(null)} onSave={handleUpdateDeal} teamMembers={teamMembers} getAiProbabilityForDeal={getAiProbability} isLoadingAi={isLoadingAi} aiProbability={aiProbability} showToast={showToast} />
            <AddDealModal isOpen={isAddDealModalOpen} onClose={() => setIsAddDealModalOpen(false)} onAddDeal={handleAddDeal} teamMembers={teamMembers} showToast={showToast} />
            <Modal isOpen={isConfirmDeleteModalOpen} onClose={() => setIsConfirmDeleteModalOpen(false)} title="Confirm Delete" size="sm">
                <div className="p-6 text-gray-300">
                    <p>Are you sure you want to delete this deal?</p>
                    <div className="flex justify-end gap-2 mt-6"><Button onClick={() => setIsConfirmDeleteModalOpen(false)} className="px-4 py-2 bg-gray-600">Cancel</Button><Button onClick={confirmDeleteDeal} className="px-4 py-2 bg-red-600">Delete</Button></div>
                </div>
            </Modal>
            <ToastComponent />
        </div>
    );
};

export default SalesPipelineView;

================================================================================
// APPENDED FROM REPO: diplomat-bit/Fuckyou | ORIGINAL PATH: diplomat-bit-Fuckyou-70f83c5/components/views/megadashboard/business/SalesPipelineView.tsx
================================================================================

// components/views/megadashboard/business/SalesPipelineView.tsx
import React, { useContext, useMemo, useState } from 'react';
import Card from '../../../Card';
import { DataContext } from '../../../../context/DataContext';
import { FunnelChart, Funnel, Tooltip, ResponsiveContainer, LabelList } from 'recharts';
import type { SalesDeal } from '../../../../types';

const SalesPipelineView: React.FC = () => {
    const context = useContext(DataContext);
    if (!context) throw new Error("SalesPipelineView must be within DataProvider");
    
    const { salesDeals } = context;
    const [selectedDeal, setSelectedDeal] = useState<SalesDeal | null>(null);
    const [aiProbability, setAiProbability] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const pipelineData = useMemo(() => {
        const stages = { Prospecting: 0, Qualification: 0, Proposal: 0, 'Closed Won': 0 };
        salesDeals.forEach(deal => {
            if(deal.stage in stages) stages[deal.stage]++;
        });
        return [
            { value: stages.Prospecting, name: 'Prospecting', fill: '#06b6d4' },
            { value: stages.Qualification, name: 'Qualification', fill: '#3b82f6' },
            { value: stages.Proposal, name: 'Proposal', fill: '#8b5cf6' },
            { value: stages['Closed Won'], name: 'Won', fill: '#10b981' },
        ];
    }, [salesDeals]);

    const kpiData = useMemo(() => ({
        pipelineValue: salesDeals.reduce((sum, d) => d.status !== 'Closed Won' ? sum + d.value : sum, 0),
        winRate: (salesDeals.filter(d => d.status === 'Closed Won').length / salesDeals.length) * 100,
        avgDealSize: salesDeals.reduce((sum, d) => sum + d.value, 0) / salesDeals.length,
    }), [salesDeals]);

    const getAiProbability = async (deal: SalesDeal) => {
        setSelectedDeal(deal);
        setIsLoading(true);
        setAiProbability(null);
        try {
            const response = await fetch('https://ce47fe80-dabc-4ad0-b0e7-cf285695b8b8.mock.pstmn.io/ai/advisor/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: `Based on this deal (Value: $${deal.value}, Stage: ${deal.stage}), estimate the probability to close as a percentage. Respond with only the number.`,
                    sessionId: 'session-sales-pipeline-123'
                })
            });
            const data = await response.json();
            setAiProbability(parseFloat(data.text));
        } catch (err) { console.error(err); } finally { setIsLoading(false); }
    };

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold text-white tracking-wider">Sales Pipeline</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="text-center"><p className="text-3xl font-bold text-white">${(kpiData.pipelineValue / 1000).toFixed(0)}k</p><p className="text-sm text-gray-400 mt-1">Pipeline Value</p></Card>
                <Card className="text-center"><p className="text-3xl font-bold text-white">{kpiData.winRate.toFixed(1)}%</p><p className="text-sm text-gray-400 mt-1">Win Rate</p></Card>
                <Card className="text-center"><p className="text-3xl font-bold text-white">${(kpiData.avgDealSize / 1000).toFixed(0)}k</p><p className="text-sm text-gray-400 mt-1">Avg. Deal Size</p></Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card title="Sales Funnel">
                    <ResponsiveContainer width="100%" height={300}>
                        <FunnelChart><Tooltip /><Funnel dataKey="value" data={pipelineData} isAnimationActive><LabelList position="right" fill="#fff" stroke="none" dataKey="name" /></Funnel></FunnelChart>
                    </ResponsiveContainer>
                </Card>
                <Card title="Top Deals">
                    <div className="space-y-2">
                        {salesDeals.slice(0, 5).map(deal => (
                            <div key={deal.id} className="p-2 bg-gray-800/50 rounded-lg flex justify-between items-center">
                                <div><p className="font-semibold text-white">{deal.name}</p><p className="text-xs text-gray-400">{deal.stage} - ${deal.value.toLocaleString()}</p></div>
                                <button onClick={() => getAiProbability(deal)} className="text-xs text-cyan-400 hover:underline">AI Probability</button>
                            </div>
                        ))}
                    </div>
                     {selectedDeal && <div className="mt-4 p-2 bg-gray-900/50 rounded text-center"><p className="text-sm">AI Probability for {selectedDeal.name}: <strong className="text-cyan-300">{isLoading ? '...' : `${aiProbability}%`}</strong></p></div>}
                </Card>
            </div>
        </div>
    );
};

export default SalesPipelineView;

================================================================================
// APPENDED FROM REPO: diplomat-bit/magic | ORIGINAL PATH: diplomat-bit-magic-a3f5ff1/components/views/megadashboard/business/SalesPipelineView.tsx
================================================================================

// components/views/megadashboard/business/SalesPipelineView.tsx
import React, { useContext, useMemo, useState } from 'react';
import Card from '../../../Card';
import { DataContext } from '../../../../context/DataContext';
import { FunnelChart, Funnel, Tooltip, ResponsiveContainer, LabelList } from 'recharts';
import type { SalesDeal } from '../../../../types';

const SalesPipelineView: React.FC = () => {
    const context = useContext(DataContext);
    if (!context) throw new Error("SalesPipelineView must be within DataProvider");
    
    const { salesDeals } = context;
    const [selectedDeal, setSelectedDeal] = useState<SalesDeal | null>(null);
    const [aiProbability, setAiProbability] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const pipelineData = useMemo(() => {
        const stages = { Prospecting: 0, Qualification: 0, Proposal: 0, 'Closed Won': 0 };
        salesDeals.forEach(deal => {
            if(deal.stage in stages) stages[deal.stage]++;
        });
        return [
            { value: stages.Prospecting, name: 'Prospecting', fill: '#06b6d4' },
            { value: stages.Qualification, name: 'Qualification', fill: '#3b82f6' },
            { value: stages.Proposal, name: 'Proposal', fill: '#8b5cf6' },
            { value: stages['Closed Won'], name: 'Won', fill: '#10b981' },
        ];
    }, [salesDeals]);

    const kpiData = useMemo(() => ({
        pipelineValue: salesDeals.reduce((sum, d) => d.status !== 'Closed Won' ? sum + d.value : sum, 0),
        winRate: (salesDeals.filter(d => d.status === 'Closed Won').length / salesDeals.length) * 100,
        avgDealSize: salesDeals.reduce((sum, d) => sum + d.value, 0) / salesDeals.length,
    }), [salesDeals]);

    const getAiProbability = async (deal: SalesDeal) => {
        setSelectedDeal(deal);
        setIsLoading(true);
        setAiProbability(null);
        try {
            const response = await fetch('https://ce47fe80-dabc-4ad0-b0e7-cf285695b8b8.mock.pstmn.io/ai/advisor/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: `Based on this deal (Value: $${deal.value}, Stage: ${deal.stage}), estimate the probability to close as a percentage. Respond with only the number.`,
                    sessionId: 'session-sales-pipeline-123'
                })
            });
            const data = await response.json();
            setAiProbability(parseFloat(data.text));
        } catch (err) { console.error(err); } finally { setIsLoading(false); }
    };

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold text-white tracking-wider">Sales Pipeline</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="text-center"><p className="text-3xl font-bold text-white">${(kpiData.pipelineValue / 1000).toFixed(0)}k</p><p className="text-sm text-gray-400 mt-1">Pipeline Value</p></Card>
                <Card className="text-center"><p className="text-3xl font-bold text-white">{kpiData.winRate.toFixed(1)}%</p><p className="text-sm text-gray-400 mt-1">Win Rate</p></Card>
                <Card className="text-center"><p className="text-3xl font-bold text-white">${(kpiData.avgDealSize / 1000).toFixed(0)}k</p><p className="text-sm text-gray-400 mt-1">Avg. Deal Size</p></Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card title="Sales Funnel">
                    <ResponsiveContainer width="100%" height={300}>
                        <FunnelChart><Tooltip /><Funnel dataKey="value" data={pipelineData} isAnimationActive><LabelList position="right" fill="#fff" stroke="none" dataKey="name" /></Funnel></FunnelChart>
                    </ResponsiveContainer>
                </Card>
                <Card title="Top Deals">
                    <div className="space-y-2">
                        {salesDeals.slice(0, 5).map(deal => (
                            <div key={deal.id} className="p-2 bg-gray-800/50 rounded-lg flex justify-between items-center">
                                <div><p className="font-semibold text-white">{deal.name}</p><p className="text-xs text-gray-400">{deal.stage} - ${deal.value.toLocaleString()}</p></div>
                                <button onClick={() => getAiProbability(deal)} className="text-xs text-cyan-400 hover:underline">AI Probability</button>
                            </div>
                        ))}
                    </div>
                     {selectedDeal && <div className="mt-4 p-2 bg-gray-900/50 rounded text-center"><p className="text-sm">AI Probability for {selectedDeal.name}: <strong className="text-cyan-300">{isLoading ? '...' : `${aiProbability}%`}</strong></p></div>}
                </Card>
            </div>
        </div>
    );
};

export default SalesPipelineView;