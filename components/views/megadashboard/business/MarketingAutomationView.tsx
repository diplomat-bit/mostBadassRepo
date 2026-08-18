// REPOSITORY SOURCE: diplomat-bit/almost | PATH: diplomat-bit-almost-93a5466/components/views/megadashboard/business/MarketingAutomationView.tsx
================================================================================

// components/views/megadashboard/business/MarketingAutomationView.tsx
import React, { useContext, useMemo, useState } from 'react';
import Card from '../../../Card';
import { DataContext } from '../../../../context/DataContext';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { GoogleGenAI } from "@google/genai";

const MarketingAutomationView: React.FC = () => {
    const context = useContext(DataContext);
    if (!context) throw new Error("MarketingAutomationView must be within DataProvider");
    
    const { marketingCampaigns } = context;
    const [isCopyModalOpen, setCopyModalOpen] = useState(false);
    const [productDesc, setProductDesc] = useState("Our new AI-powered savings tool");
    const [adCopy, setAdCopy] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const kpiData = useMemo(() => ({
        leads: marketingCampaigns.reduce((sum, c) => sum + (c.revenueGenerated / 100), 0),
        conversionRate: (marketingCampaigns.reduce((sum, c) => sum + c.revenueGenerated, 0) / marketingCampaigns.reduce((sum, c) => sum + c.cost, 0)),
        cpc: marketingCampaigns.reduce((sum, c) => sum + c.cost, 0) / marketingCampaigns.reduce((sum, c) => sum + (c.revenueGenerated / 100), 0),
    }), [marketingCampaigns]);

    const handleGenerateCopy = async () => {
        setIsLoading(true); setAdCopy('');
        try {
            const ai = new GoogleGenAI({apiKey: process.env.API_KEY as string});
            const prompt = `Write 3 short, punchy ad copy headlines for this product: "${productDesc}"`;
            const response = await ai.models.generateContent({model: 'gemini-2.5-flash', contents: prompt});
            setAdCopy(response.text);
        } catch(err) { console.error(err); } finally { setIsLoading(false); }
    };

    return (
        <>
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <h2 className="text-3xl font-bold text-white tracking-wider">Marketing Automation</h2>
                    <button onClick={() => setCopyModalOpen(true)} className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg text-sm font-medium">AI Ad Copy Generator</button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card className="text-center"><p className="text-3xl font-bold text-white">{kpiData.leads.toLocaleString(undefined, {maximumFractionDigits: 0})}</p><p className="text-sm text-gray-400 mt-1">Leads Generated</p></Card>
                    <Card className="text-center"><p className="text-3xl font-bold text-white">{kpiData.conversionRate.toFixed(1)}x</p><p className="text-sm text-gray-400 mt-1">ROAS</p></Card>
                    <Card className="text-center"><p className="text-3xl font-bold text-white">${kpiData.cpc.toFixed(2)}</p><p className="text-sm text-gray-400 mt-1">Cost Per Lead</p></Card>
                </div>

                <Card title="Campaign Performance (Revenue Generated)">
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={marketingCampaigns}><XAxis dataKey="name" stroke="#9ca3af" /><YAxis stroke="#9ca3af" /><Tooltip contentStyle={{ backgroundColor: 'rgba(31, 41, 55, 0.8)', borderColor: '#4b5563' }}/><Legend /><Bar dataKey="revenueGenerated" fill="#82ca9d" name="Revenue" /><Bar dataKey="cost" fill="#ef4444" name="Cost" /></BarChart>
                    </ResponsiveContainer>
                </Card>
            </div>
             {isCopyModalOpen && (
                 <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50" onClick={() => setCopyModalOpen(false)}>
                    <div className="bg-gray-800 rounded-lg shadow-2xl max-w-lg w-full" onClick={e=>e.stopPropagation()}>
                        <div className="p-4 border-b border-gray-700"><h3 className="text-lg font-semibold text-white">AI Ad Copy Generator</h3></div>
                        <div className="p-6 space-y-4">
                            <input type="text" value={productDesc} onChange={e => setProductDesc(e.target.value)} className="w-full bg-gray-700/50 p-2 rounded" />
                            <button onClick={handleGenerateCopy} disabled={isLoading} className="w-full py-2 bg-cyan-600 rounded disabled:opacity-50">{isLoading ? 'Generating...' : 'Generate Copy'}</button>
                            {adCopy && <div className="p-3 bg-gray-900/50 rounded whitespace-pre-line text-sm">{adCopy}</div>}
                        </div>
                    </div>
                 </div>
            )}
        </>
    );
};

export default MarketingAutomationView;


================================================================================
// APPENDED FROM REPO: diplomat-bit/Citibank_Demo_Business_Inc_Demonstration- | ORIGINAL PATH: diplomat-bit-Citibank_Demo_Business_Inc_Demonstration--ab2501d/components/views/megadashboard/business/MarketingAutomationView.tsx
================================================================================

import React, { useContext, useMemo, useState, useEffect, useCallback, createContext } from 'react';
import Card from '../../../Card';
import { DataContext } from '../../../../context/DataContext';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, LineChart, Line, PieChart, Pie, Cell, ScatterChart, Scatter, ZAxis } from 'recharts';
import { GoogleGenerativeAI } from "@google/generative-ai";

// --- New Imports for icons/utility (assuming they exist or are simple placeholders) ---
// Note: In a real project, these would be imported from a UI library like 'react-icons'
// For this exercise, we'll assume their availability or simple text rendering.
const IconPlus = () => <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>;
const IconEdit = () => <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>;
const IconDelete = () => <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>;
const IconCopy = () => <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m-4 4v7a2 2 0 01-2 2H6a2 2 0 01-2-2v-7a2 2 0 012-2h10a2 2 0 012 2z" /></svg>;
const IconCog = () => <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>;
const IconChartBar = () => <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>;
const IconFunnel = () => <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L14 12.414V17a1 1 0 01-.293.707l-2 2A1 1 0 0111 19v-6.586l-6.707-6.707A1 1 0 014 5V4z" /></svg>;
const IconCheckCircle = () => <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>;
const IconXCircle = () => <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" /></svg>;
const IconClock = () => <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const IconCurrencyDollar = () => <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.592 1L19 10.5M12 8V4m0 12v4m-5.463-2.634A9.999 9.999 0 0112 11c-1.11 0-2.08.402-2.592 1L5 10.5" /></svg>;
const IconUsers = () => <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h2a2 2 0 002-2V8a2 2 0 00-2-2h-2m-4 5h4m-4 0v-2m4 2v2M12 8V4m0 16v-4m-6-2H4a2 2 0 01-2-2V7a2 2 0 012-2h2m4 5v-2m-4 2v2" /></svg>;
const IconMail = () => <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8m-18 8V6a2 2 0 012-2h14a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2z" /></svg>;
const IconShare = () => <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.516 3.909a3 3 0 00.756-.992l2.454-7.362a1 1 0 00-.707-1.121 1 1 0 00-.974.225l-2.454 7.362a3 3 0 00-2.502 3.124M5 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.516 3.909a3 3 0 00.756-.992l2.454-7.362a1 1 0 00-.707-1.121 1 1 0 00-.974.225l-2.454 7.362a3 3 0 00-2.502 3.124" /></svg>;
const IconCalendar = () => <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>;
const IconLightBulb = () => <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6 1.11l-.422.245M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7.414 2.586a2 2 0 112.828 0m-8.485 2.121H17.5" /></svg>;
const IconHashtag = () => <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" /></svg>;
const IconPlay = () => <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const IconStop = () => <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 10h6v4H9z" /></svg>;
const IconEye = () => <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>;
const IconPaperAirplane = () => <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>;
const IconTerminal = () => <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 9l3 3-3 3m5 0h6M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>;


// --- UTILITY FUNCTIONS AND INTERFACES (to be exported) ---

/**
 * @interface Pagination
 * @property {number} currentPage - The current page number.
 * @property {number} totalPages - The total number of pages.
 * @property {number} pageSize - The number of items per page.
 * @property {number} totalItems - The total number of items.
 */
export interface Pagination {
    currentPage: number;
    totalPages: number;
    pageSize: number;
    totalItems: number;
}

/**
 * @function generatePaginationControls
 * @description Generates an array of page numbers for pagination controls.
 * @param {Pagination} pagination - Pagination object.
 * @returns {Array<number|string>} An array of page numbers or '...' for ellipses.
 */
export const generatePaginationControls = (pagination: Pagination): (number | string)[] => {
    const { currentPage, totalPages } = pagination;
    const pageNumbers: (number | string)[] = [];
    if (totalPages <= 7) {
        for (let i = 1; i <= totalPages; i++) {
            pageNumbers.push(i);
        }
    } else {
        pageNumbers.push(1);
        if (currentPage > 3) pageNumbers.push('...');
        if (currentPage > 2) pageNumbers.push(currentPage - 1);
        if (currentPage > 1) pageNumbers.push(currentPage);
        if (currentPage < totalPages) pageNumbers.push(currentPage + 1);
        if (currentPage < totalPages - 2) pageNumbers.push('...');
        pageNumbers.push(totalPages);
    }
    return Array.from(new Set(pageNumbers)); // Remove duplicates
};

/**
 * @function formatDate
 * @description Formats a date string into a readable format.
 * @param {string | Date} dateInput - The date string or Date object.
 * @returns {string} Formatted date string.
 */
export const formatDate = (dateInput: string | Date): string => {
    const date = new Date(dateInput);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
};

/**
 * @function formatCurrency
 * @description Formats a number as a currency string.
 * @param {number} amount - The amount to format.
 * @param {string} currency - The currency symbol (e.g., 'USD').
 * @returns {string} Formatted currency string.
 */
export const formatCurrency = (amount: number, currency: string = 'USD'): string => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(amount);
};

/**
 * @function debounce
 * @description Debounces a function call.
 * @param {Function} func - The function to debounce.
 * @param {number} delay - The delay in milliseconds.
 * @returns {Function} The debounced function.
 */
export function debounce<T extends (...args: any[]) => any>(func: T, delay: number): (...args: Parameters<T>) => void {
    let timeout: NodeJS.Timeout;
    return function (this: any, ...args: Parameters<T>): void {
        const context = this;
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(context, args), delay);
    };
}

// --- DATA INTERFACES FOR NEW FEATURES (to be exported) ---

/**
 * @interface MarketingCampaignDetail
 * @augments {MarketingCampaign}
 * @property {string} campaignId - Unique identifier for the campaign.
 * @property {string} description - Detailed description of the campaign.
 * @property {string} channel - Primary marketing channel (e.g., 'Email', 'Social Media', 'PPC').
 * @property {string} objective - Main goal of the campaign (e.g., 'Lead Generation', 'Brand Awareness', 'Sales').
 * @property {Date} startDate - Campaign start date.
 * @property {Date} endDate - Campaign end date.
 * @property {number} budget - Total allocated budget for the campaign.
 * @property {string[]} audienceSegments - IDs of target audience segments.
 * @property {string[]} adCreatives - URLs or IDs of ad creatives used.
 * @property {string} status - Current status of the campaign ('Planned', 'Active', 'Paused', 'Completed').
 * @property {object} analytics - Detailed analytics data for the campaign.
 * @property {number} analytics.impressions - Number of times ads were shown.
 * @property {number} analytics.clicks - Number of clicks on ads.
 * @property {number} analytics.conversions - Number of desired actions taken.
 * @property {number} analytics.ctr - Click-Through Rate.
 * @property {number} analytics.cpa - Cost Per Acquisition.
 * @property {number} analytics.roi - Return on Investment.
 */
export interface MarketingCampaignDetail {
    campaignId: string;
    name: string;
    description: string;
    channel: 'Email' | 'Social Media' | 'PPC' | 'Content Marketing' | 'SEO' | 'Affiliate';
    objective: 'Lead Generation' | 'Brand Awareness' | 'Sales' | 'Customer Retention' | 'Engagement';
    startDate: Date;
    endDate: Date;
    budget: number;
    cost: number; // Existing property
    revenueGenerated: number; // Existing property
    audienceSegments: string[];
    adCreatives: string[];
    status: 'Planned' | 'Active' | 'Paused' | 'Completed' | 'Archived';
    analytics: {
        impressions: number;
        clicks: number;
        conversions: number;
        ctr: number; // (clicks / impressions) * 100
        cpa: number; // (cost / conversions)
        roi: number; // ((revenueGenerated - cost) / cost) * 100
    };
    notes?: string;
    owner?: string; // User ID
    tags?: string[];
}

/**
 * @interface AudienceSegment
 * @property {string} id - Unique segment ID.
 * @property {string} name - Name of the segment.
 * @property {string} description - Description of the segment.
 * @property {object[]} rules - Array of rules defining the segment.
 * @property {string} rules.field - Field to filter on (e.g., 'age', 'location', 'purchaseHistory').
 * @property {string} rules.operator - Comparison operator (e.g., 'equals', 'greaterThan', 'contains').
 * @property {string | number | string[]} rules.value - Value to compare against.
 * @property {number} estimatedSize - Estimated number of contacts in this segment.
 * @property {Date} createdAt - Date segment was created.
 * @property {Date} lastModified - Date segment was last modified.
 */
export interface AudienceSegment {
    id: string;
    name: string;
    description: string;
    rules: { field: string; operator: string; value: any }[];
    estimatedSize: number;
    createdAt: Date;
    lastModified: Date;
}

/**
 * @interface WorkflowNode
 * @property {string} id - Unique ID of the node.
 * @property {string} type - Type of node (e.g., 'trigger', 'action', 'condition').
 * @property {string} name - Display name of the node.
 * @property {object} properties - Configuration properties for the node.
 * @property {string[]} nextNodes - IDs of connected nodes.
 * @property {number} x - X coordinate for visual placement.
 * @property {number} y - Y coordinate for visual placement.
 */
export interface WorkflowNode {
    id: string;
    type: 'trigger' | 'action' | 'condition' | 'end';
    name: string;
    properties: any;
    nextNodes: string[]; // IDs of nodes this node connects to
    position: { x: number; y: number }; // For visual layout
}

/**
 * @interface MarketingWorkflow
 * @property {string} id - Unique workflow ID.
 * @property {string} name - Name of the workflow.
 * @property {string} description - Description of the workflow.
 * @property {WorkflowNode[]} nodes - Array of nodes in the workflow.
 * @property {string} status - Workflow status ('Draft', 'Active', 'Paused', 'Archived').
 * @property {Date} createdAt - Creation timestamp.
 * @property {Date} lastModified - Last modified timestamp.
 * @property {string} triggerType - The main trigger type (e.g., 'new_lead', 'purchase').
 * @property {boolean} isActive - Is the workflow currently active?
 */
export interface MarketingWorkflow {
    id: string;
    name: string;
    description: string;
    nodes: WorkflowNode[];
    status: 'Draft' | 'Active' | 'Paused' | 'Archived';
    createdAt: Date;
    lastModified: Date;
    triggerType: string;
    isActive: boolean;
}

/**
 * @interface EmailTemplate
 * @property {string} id - Unique template ID.
 * @property {string} name - Template name.
 * @property {string} subject - Default email subject.
 * @property {string} htmlContent - HTML content of the email.
 * @property {string} plainTextContent - Plain text fallback.
 * @property {Date} createdAt - Creation date.
 * @property {Date} lastModified - Last modified date.
 * @property {string[]} tags - Categorization tags.
 */
export interface EmailTemplate {
    id: string;
    name: string;
    subject: string;
    htmlContent: string;
    plainTextContent: string;
    createdAt: Date;
    lastModified: Date;
    tags: string[];
}

/**
 * @interface EmailCampaign
 * @property {string} id - Unique email campaign ID.
 * @property {string} name - Campaign name.
 * @property {string} templateId - ID of the email template used.
 * @property {string} segmentId - ID of the audience segment targeted.
 * @property {string} senderEmail - Sender's email address.
 * @property {string} senderName - Sender's name.
 * @property {Date} scheduledSendTime - When the email is scheduled to send.
 * @property {string} status - Campaign status ('Draft', 'Scheduled', 'Sending', 'Sent', 'Cancelled').
 * @property {object} stats - Performance statistics.
 * @property {number} stats.sent - Number of emails sent.
 * @property {number} stats.opens - Number of unique opens.
 * @property {number} stats.clicks - Number of unique clicks.
 * @property {number} stats.bounces - Number of bounces.
 * @property {number} stats.unsubscribes - Number of unsubscribes.
 */
export interface EmailCampaign {
    id: string;
    name: string;
    templateId: string;
    segmentId: string;
    senderEmail: string;
    senderName: string;
    subject: string;
    scheduledSendTime: Date;
    status: 'Draft' | 'Scheduled' | 'Sending' | 'Sent' | 'Cancelled';
    stats: {
        sent: number;
        opens: number;
        clicks: number;
        bounces: number;
        unsubscribes: number;
    };
    createdAt: Date;
    lastModified: Date;
}

/**
 * @interface SocialPost
 * @property {string} id - Unique post ID.
 * @property {string} content - Text content of the post.
 * @property {string[]} imageUrls - Array of image URLs.
 * @property {string[]} videoUrls - Array of video URLs.
 * @property {'facebook' | 'twitter' | 'linkedin' | 'instagram'} platform - Social media platform.
 * @property {Date} scheduledTime - When the post is scheduled.
 * @property {string} status - Post status ('Draft', 'Scheduled', 'Posted', 'Failed').
 * @property {object} analytics - Post performance metrics.
 * @property {number} analytics.reach - Number of unique users who saw the post.
 * @property {number} analytics.engagement - Number of likes, comments, shares.
 * @property {number} analytics.impressions - Total number of times the post was seen.
 */
export interface SocialPost {
    id: string;
    content: string;
    imageUrls?: string[];
    videoUrls?: string[];
    platform: 'facebook' | 'twitter' | 'linkedin' | 'instagram';
    scheduledTime: Date;
    status: 'Draft' | 'Scheduled' | 'Posted' | 'Failed';
    analytics?: {
        reach: number;
        engagement: number;
        impressions: number;
    };
    createdAt: Date;
    lastModified: Date;
}

/**
 * @interface ABTest
 * @property {string} id - Unique test ID.
 * @property {string} name - Test name.
 * @property {string} description - Description of what's being tested.
 * @property {'ad_copy' | 'landing_page' | 'email_subject'} type - Type of A/B test.
 * @property {string[]} variants - Array of variant IDs or content strings.
 * @property {number[]} trafficDistribution - Percentage distribution for each variant (sums to 100).
 * @property {string} primaryMetric - Metric to optimize for (e.g., 'conversions', 'CTR', 'revenue').
 * @property {Date} startDate - Test start date.
 * @property {Date} endDate - Test end date.
 * @property {string} status - Test status ('Planned', 'Running', 'Completed', 'Archived').
 * @property {object} results - Test results.
 * @property {object[]} results.variantResults - Performance for each variant.
 * @property {number} results.variantResults.conversions - Conversions for this variant.
 * @property {number} results.variantResults.impressions - Impressions for this variant.
 * @property {number} results.variantResults.ctr - CTR for this variant.
 * @property {string | null} results.winningVariantId - ID of the winning variant, if any.
 * @property {number | null} results.confidenceLevel - Statistical confidence.
 */
export interface ABTest {
    id: string;
    name: string;
    description: string;
    type: 'ad_copy' | 'landing_page' | 'email_subject' | 'email_body' | 'cta_button';
    variants: { id: string, name: string, content: string, trafficShare: number, meta?: any }[];
    primaryMetric: 'conversions' | 'clicks' | 'revenue' | 'signups';
    startDate: Date;
    endDate: Date | null;
    status: 'Planned' | 'Running' | 'Completed' | 'Archived';
    results?: {
        variantResults: {
            variantId: string;
            impressions: number;
            clicks: number;
            conversions: number;
            revenue?: number;
            ctr: number;
            conversionRate: number;
        }[];
        winningVariantId: string | null;
        confidenceLevel: number | null; // e.g., 95%
        conclusion: string;
    };
    createdAt: Date;
    lastModified: Date;
    campaignId?: string; // Link to a campaign
}

/**
 * @interface ContactProfile
 * @property {string} id - Unique contact ID.
 * @property {string} email - Contact's email address.
 * @property {string} firstName - First name.
 * @property {string} lastName - Last name.
 * @property {string} phone - Phone number.
 * @property {string} city - City.
 * @property {string} country - Country.
 * @property {Date} signUpDate - Date of signup.
 * @property {string[]} tags - Tags applied to the contact.
 * @property {string[]} segmentIds - IDs of segments this contact belongs to.
 * @property {number} leadScore - Current lead score.
 * @property {object} lastActivity - Last known interaction.
 * @property {Date} lastActivity.date - Date of last activity.
 * @property {string} lastActivity.type - Type of last activity (e.g., 'email_open', 'website_visit', 'purchase').
 */
export interface ContactProfile {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    phone?: string;
    city?: string;
    country?: string;
    signUpDate: Date;
    tags: string[];
    segmentIds: string[];
    leadScore: number;
    lastActivity: {
        date: Date;
        type: string;
        details?: string;
    };
    purchaseHistory?: {
        orderId: string;
        date: Date;
        amount: number;
        items: string[];
    }[];
    websiteVisits?: {
        date: Date;
        page: string;
        duration: number; // in seconds
    }[];
}

/**
 * @interface Notification
 * @property {string} id - Unique notification ID.
 * @property {string} message - Notification message.
 * @property {string} type - Type of notification ('info', 'warning', 'error', 'success').
 * @property {boolean} read - Whether the notification has been read.
 * @property {Date} timestamp - When the notification was created.
 * @property {string} link - Optional link to related resource.
 */
export interface Notification {
    id: string;
    message: string;
    type: 'info' | 'warning' | 'error' | 'success';
    read: boolean;
    timestamp: Date;
    link?: string;
}

/**
 * @interface AuditLogEntry
 * @property {string} id - Unique log entry ID.
 * @property {Date} timestamp - When the event occurred.
 * @property {string} userId - ID of the user who performed the action.
 * @property {string} action - Description of the action (e.g., 'Created Campaign', 'Updated Segment').
 * @property {string} resourceType - Type of resource affected (e.g., 'Campaign', 'Segment').
 * @property {string} resourceId - ID of the resource affected.
 * @property {object} changes - JSON object detailing changes (e.g., old and new values).
 */
export interface AuditLogEntry {
    id: string;
    timestamp: Date;
    userId: string;
    action: string;
    resourceType: string;
    resourceId: string;
    changes?: Record<string, any>;
}

// --- DUMMY DATA GENERATION FUNCTIONS (to be exported) ---

let campaignIdCounter = 1000;
export const generateDummyCampaign = (namePrefix: string = "Campaign"): MarketingCampaignDetail => {
    const id = `CAM-${campaignIdCounter++}`;
    const startDate = new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000); // Last 30 days
    const endDate = new Date(startDate.getTime() + Math.random() * 60 * 24 * 60 * 60 * 1000); // Up to 60 days duration
    const budget = Math.round(Math.random() * 10000 + 500);
    const cost = budget * (0.5 + Math.random() * 0.5); // 50-100% of budget
    const revenue = cost * (0.8 + Math.random() * 2); // 80%-200% ROAS
    const impressions = Math.round(Math.random() * 100000 + 1000);
    const clicks = Math.round(impressions * (0.01 + Math.random() * 0.05)); // 1-6% CTR
    const conversions = Math.round(clicks * (0.005 + Math.random() * 0.02)); // 0.5-2.5% Conversion Rate
    const ctr = (clicks / impressions) * 100;
    const cpa = conversions > 0 ? (cost / conversions) : cost;
    const roi = ((revenue - cost) / cost) * 100;

    const channels = ['Email', 'Social Media', 'PPC', 'Content Marketing', 'SEO', 'Affiliate'];
    const objectives = ['Lead Generation', 'Brand Awareness', 'Sales', 'Customer Retention', 'Engagement'];
    const statuses = ['Planned', 'Active', 'Paused', 'Completed', 'Archived'];

    return {
        campaignId: id,
        name: `${namePrefix} ${campaignIdCounter - 1}`,
        description: `This is a detailed description for ${namePrefix} ${campaignIdCounter - 1}, targeting specific customer demographics to ${objectives[Math.floor(Math.random() * objectives.length)]}.`,
        channel: channels[Math.floor(Math.random() * channels.length)] as any,
        objective: objectives[Math.floor(Math.random() * objectives.length)] as any,
        startDate: startDate,
        endDate: endDate,
        budget: parseFloat(budget.toFixed(2)),
        cost: parseFloat(cost.toFixed(2)),
        revenueGenerated: parseFloat(revenue.toFixed(2)),
        audienceSegments: [`SEG-${Math.floor(Math.random() * 5 + 1)}`],
        adCreatives: [`ad-creative-${Math.random().toString(36).substring(7)}`],
        status: statuses[Math.floor(Math.random() * statuses.length)] as any,
        analytics: {
            impressions: impressions,
            clicks: clicks,
            conversions: conversions,
            ctr: parseFloat(ctr.toFixed(2)),
            cpa: parseFloat(cpa.toFixed(2)),
            roi: parseFloat(roi.toFixed(2)),
        },
        notes: `Initial planning notes: focus on value proposition and clear call to action.`,
        owner: `user-${Math.floor(Math.random() * 3 + 1)}`,
        tags: ['product-launch', 'holiday-sale', 'evergreen'][Math.floor(Math.random() * 3)].split(),
    };
};

let segmentIdCounter = 100;
export const generateDummySegment = (): AudienceSegment => {
    const id = `SEG-${segmentIdCounter++}`;
    const fields = ['age', 'location', 'purchaseHistory', 'websiteActivity', 'emailOpens'];
    const operators = ['equals', 'greaterThan', 'lessThan', 'contains', 'notContains'];
    const values = [25, 35, 'New York', 'California', 'purchased_X', 'visited_pricing_page', true, false];

    const rules = Array.from({ length: Math.floor(Math.random() * 3) + 1 }).map(() => ({
        field: fields[Math.floor(Math.random() * fields.length)],
        operator: operators[Math.floor(Math.random() * operators.length)],
        value: values[Math.floor(Math.random() * values.length)],
    }));

    return {
        id: id,
        name: `Segment ${id}`,
        description: `Customers who ${rules.map(r => `${r.field} ${r.operator} ${r.value}`).join(' and ')}.`,
        rules: rules,
        estimatedSize: Math.floor(Math.random() * 50000) + 100,
        createdAt: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000),
        lastModified: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
    };
};

let workflowIdCounter = 1;
export const generateDummyWorkflow = (): MarketingWorkflow => {
    const id = `WF-${workflowIdCounter++}`;
    const statusOptions = ['Draft', 'Active', 'Paused', 'Archived'];
    const triggerTypes = ['New Lead Signup', 'Product Purchase', 'Cart Abandonment', 'Email Opened', 'Website Visit'];

    const nodes: WorkflowNode[] = [
        {
            id: 'node-start', type: 'trigger', name: 'Start Trigger',
            properties: { event: triggerTypes[Math.floor(Math.random() * triggerTypes.length)], details: 'customer signup' },
            nextNodes: ['node-email-welcome'], position: { x: 50, y: 50 }
        },
        {
            id: 'node-email-welcome', type: 'action', name: 'Send Welcome Email',
            properties: { templateId: 'TPL-001', delay: 'immediate' },
            nextNodes: ['node-condition-open'], position: { x: 250, y: 50 }
        },
        {
            id: 'node-condition-open', type: 'condition', name: 'Email Opened?',
            properties: { condition: 'email_opened', emailId: 'node-email-welcome', timeframe: '24h' },
            nextNodes: ['node-action-tag-engaged', 'node-action-followup'], position: { x: 450, y: 50 }
        },
        {
            id: 'node-action-tag-engaged', type: 'action', name: 'Add Engaged Tag',
            properties: { tag: 'engaged_lead' },
            nextNodes: ['node-end-success'], position: { x: 650, y: 0 }
        },
        {
            id: 'node-action-followup', type: 'action', name: 'Send Follow-up Email',
            properties: { templateId: 'TPL-002', delay: '1d' },
            nextNodes: ['node-end-followup'], position: { x: 650, y: 100 }
        },
        { id: 'node-end-success', type: 'end', name: 'End (Engaged)', properties: {}, nextNodes: [], position: { x: 850, y: 0 } },
        { id: 'node-end-followup', type: 'end', name: 'End (Follow-up)', properties: {}, nextNodes: [], position: { x: 850, y: 100 } },
    ];

    return {
        id: id,
        name: `Customer Onboarding ${id}`,
        description: `Automated journey for new signups based on initial engagement.`,
        nodes: nodes,
        status: statusOptions[Math.floor(Math.random() * statusOptions.length)] as any,
        createdAt: new Date(Date.now() - Math.random() * 180 * 24 * 60 * 60 * 1000),
        lastModified: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
        triggerType: triggerTypes[Math.floor(Math.random() * triggerTypes.length)],
        isActive: Math.random() > 0.5,
    };
};

let emailTemplateIdCounter = 1;
export const generateDummyEmailTemplate = (): EmailTemplate => {
    const id = `TPL-${emailTemplateIdCounter++}`;
    const names = ['Welcome Email', 'Product Update', 'Promotional Offer', 'Cart Reminder', 'Thank You'];
    const subjects = ['Welcome to Our Service!', 'New Features You\'ll Love', 'Exclusive Discount Just For You', 'Don\'t Forget Your Cart!', 'Thank You for Your Purchase'];
    const htmlContent = `<p>Hello {{contact.firstName}},</p><p>This is a beautiful email template for ${names[Math.floor(Math.random() * names.length)]}.</p><p>Best regards,<br>The Team</p>`;
    const plainTextContent = `Hello {{contact.firstName}},\n\nThis is a beautiful email template for ${names[Math.floor(Math.random() * names.length)]}.\n\nBest regards,\nThe Team`;
    const tags = [['welcome', 'onboarding'], ['product', 'update'], ['promo', 'sales'], ['cart', 'abandonment'], ['transactional']];

    return {
        id: id,
        name: names[Math.floor(Math.random() * names.length)],
        subject: subjects[Math.floor(Math.random() * subjects.length)],
        htmlContent: htmlContent,
        plainTextContent: plainTextContent,
        createdAt: new Date(Date.now() - Math.random() * 200 * 24 * 60 * 60 * 1000),
        lastModified: new Date(Date.now() - Math.random() * 60 * 24 * 60 * 60 * 1000),
        tags: tags[Math.floor(Math.random() * tags.length)],
    };
};

let emailCampaignIdCounter = 1;
export const generateDummyEmailCampaign = (templateId: string, segmentId: string): EmailCampaign => {
    const id = `EMC-${emailCampaignIdCounter++}`;
    const names = ['Weekly Newsletter', 'New Feature Announce', 'Holiday Sale Blast', 'Engagement Drive'];
    const statuses = ['Draft', 'Scheduled', 'Sending', 'Sent', 'Cancelled'];

    const sent = Math.floor(Math.random() * 10000);
    const opens = Math.floor(sent * (0.1 + Math.random() * 0.3)); // 10-40% open rate
    const clicks = Math.floor(opens * (0.05 + Math.random() * 0.2)); // 5-25% click-to-open
    const bounces = Math.floor(sent * (0.01 + Math.random() * 0.03)); // 1-4% bounce rate
    const unsubscribes = Math.floor(opens * (0.001 + Math.random() * 0.01)); // 0.1-1.1% unsubscribe

    return {
        id: id,
        name: names[Math.floor(Math.random() * names.length)],
        templateId: templateId,
        segmentId: segmentId,
        senderEmail: 'marketing@example.com',
        senderName: 'Our Team',
        subject: `[Email Campaign] - ${names[Math.floor(Math.random() * names.length)]}`,
        scheduledSendTime: new Date(Date.now() + Math.random() * 30 * 24 * 60 * 60 * 1000 - 15 * 24 * 60 * 60 * 1000), // Some past, some future
        status: statuses[Math.floor(Math.random() * statuses.length)] as any,
        stats: { sent, opens, clicks, bounces, unsubscribes },
        createdAt: new Date(Date.now() - Math.random() * 180 * 24 * 60 * 60 * 1000),
        lastModified: new Date(Date.now() - Math.random() * 10 * 24 * 60 * 60 * 1000),
    };
};

let socialPostIdCounter = 1;
export const generateDummySocialPost = (): SocialPost => {
    const id = `SP-${socialPostIdCounter++}`;
    const platforms = ['facebook', 'twitter', 'linkedin', 'instagram'];
    const statuses = ['Draft', 'Scheduled', 'Posted', 'Failed'];
    const contents = [
        "Exciting news! Our new feature is live. Check it out now! #product #update",
        "Happy Friday! What are your plans for the weekend? Let us know! #weekendvibes",
        "Behind the scenes at our office. Great teamwork makes the dream work! #companyculture",
        "Tip of the day: Optimize your marketing with these strategies. Link in bio!",
        "Flash Sale! Get 20% off all premium plans for a limited time. Don't miss out!",
    ];

    const scheduledTime = new Date(Date.now() + Math.random() * 30 * 24 * 60 * 60 * 1000 - 15 * 24 * 60 * 60 * 1000); // Some past, some future
    const platform = platforms[Math.floor(Math.random() * platforms.length)] as any;
    const status = statuses[Math.floor(Math.random() * statuses.length)] as any;

    const reach = status === 'Posted' ? Math.floor(Math.random() * 50000 + 100) : 0;
    const impressions = reach * (1 + Math.random() * 3);
    const engagement = status === 'Posted' ? Math.floor(Math.random() * reach * 0.05 + 1) : 0;

    return {
        id: id,
        content: contents[Math.floor(Math.random() * contents.length)],
        imageUrls: Math.random() > 0.5 ? [`https://via.placeholder.com/150?text=${platform}-${id}`] : [],
        platform: platform,
        scheduledTime: scheduledTime,
        status: status,
        analytics: { reach: reach, engagement: engagement, impressions: impressions },
        createdAt: new Date(Date.now() - Math.random() * 180 * 24 * 60 * 60 * 1000),
        lastModified: new Date(Date.now() - Math.random() * 10 * 24 * 60 * 60 * 1000),
    };
};

let abTestIdCounter = 1;
export const generateDummyABTest = (): ABTest => {
    const id = `ABT-${abTestIdCounter++}`;
    const types = ['ad_copy', 'landing_page', 'email_subject', 'cta_button'];
    const statuses = ['Planned', 'Running', 'Completed', 'Archived'];
    const metrics = ['conversions', 'clicks', 'revenue', 'signups'];

    const type = types[Math.floor(Math.random() * types.length)] as any;
    const status = statuses[Math.floor(Math.random() * statuses.length)] as any;
    const primaryMetric = metrics[Math.floor(Math.random() * metrics.length)] as any;

    const variantAContent = type === 'ad_copy' ? 'Catchy Headline A' : 'Landing Page Layout A';
    const variantBContent = type === 'ad_copy' ? 'Bold Headline B' : 'Landing Page Layout B';

    const impressionsA = status === 'Running' || status === 'Completed' ? Math.floor(Math.random() * 50000 + 1000) : 0;
    const clicksA = impressionsA > 0 ? Math.floor(impressionsA * (0.01 + Math.random() * 0.05)) : 0;
    const conversionsA = clicksA > 0 ? Math.floor(clicksA * (0.01 + Math.random() * 0.03)) : 0;
    const revenueA = conversionsA * (10 + Math.random() * 100);

    const impressionsB = status === 'Running' || status === 'Completed' ? Math.floor(Math.random() * 50000 + 1000) : 0;
    const clicksB = impressionsB > 0 ? Math.floor(impressionsB * (0.01 + Math.random() * 0.06)) : 0; // Slightly better variant B
    const conversionsB = clicksB > 0 ? Math.floor(clicksB * (0.015 + Math.random() * 0.04)) : 0; // Slightly better variant B
    const revenueB = conversionsB * (10 + Math.random() * 110);

    const variantResults = (status === 'Running' || status === 'Completed') ? [
        {
            variantId: `${id}-A`, impressions: impressionsA, clicks: clicksA, conversions: conversionsA, revenue: parseFloat(revenueA.toFixed(2)),
            ctr: clicksA / impressionsA * 100, conversionRate: conversionsA / clicksA * 100
        },
        {
            variantId: `${id}-B`, impressions: impressionsB, clicks: clicksB, conversions: conversionsB, revenue: parseFloat(revenueB.toFixed(2)),
            ctr: clicksB / impressionsB * 100, conversionRate: conversionsB / clicksB * 100
        },
    ] : [];

    let winningVariantId: string | null = null;
    let confidenceLevel: number | null = null;
    let conclusion: string = 'Test still running or no clear winner.';

    if (status === 'Completed' && variantResults.length === 2) {
        const primaryMetricA = variantResults[0][primaryMetric as keyof typeof variantResults[0]];
        const primaryMetricB = variantResults[1][primaryMetric as keyof typeof variantResults[1]];

        if (primaryMetricA > primaryMetricB * 1.05) { // 5% difference for significance
            winningVariantId = `${id}-A`;
            confidenceLevel = 0.95;
            conclusion = `Variant A won by significantly outperforming Variant B in ${primaryMetric}.`;
        } else if (primaryMetricB > primaryMetricA * 1.05) {
            winningVariantId = `${id}-B`;
            confidenceLevel = 0.95;
            conclusion = `Variant B won by significantly outperforming Variant A in ${primaryMetric}.`;
        } else {
            conclusion = `No statistically significant winner found for ${primaryMetric}.`;
        }
    }

    const startDate = new Date(Date.now() - Math.random() * 60 * 24 * 60 * 60 * 1000);
    const endDate = status === 'Running' ? null : (status === 'Completed' ? new Date(startDate.getTime() + Math.random() * 30 * 24 * 60 * 60 * 1000) : null);

    return {
        id: id,
        name: `A/B Test ${id}`,
        description: `Testing different ${type.replace(/_/g, ' ')} variants to improve ${primaryMetric}.`,
        variants: [
            { id: `${id}-A`, name: 'Variant A', content: variantAContent, trafficShare: 50 },
            { id: `${id}-B`, name: 'Variant B', content: variantBContent, trafficShare: 50 },
        ],
        primaryMetric: primaryMetric,
        startDate: startDate,
        endDate: endDate,
        status: status,
        results: {
            variantResults: variantResults,
            winningVariantId: winningVariantId,
            confidenceLevel: confidenceLevel,
            conclusion: conclusion,
        },
        createdAt: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000),
        lastModified: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
        campaignId: `CAM-${Math.floor(Math.random() * 5 + 1)}`,
    };
};

let contactIdCounter = 1;
export const generateDummyContact = (): ContactProfile => {
    const id = `CON-${contactIdCounter++}`;
    const firstNames = ['Alice', 'Bob', 'Charlie', 'Diana', 'Eve', 'Frank', 'Grace'];
    const lastNames = ['Smith', 'Jones', 'Williams', 'Brown', 'Davis', 'Miller', 'Wilson'];
    const cities = ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix', 'London', 'Paris', 'Berlin'];
    const countries = ['USA', 'UK', 'Canada', 'Germany', 'France', 'Australia'];
    const tags = ['prospect', 'customer', 'vip', 'inactive', 'newsletter'];
    const activityTypes = ['email_open', 'website_visit', 'purchase', 'form_submit', 'ad_click'];

    const signUpDate = new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000);
    const lastActivityDate = new Date(signUpDate.getTime() + Math.random() * (Date.now() - signUpDate.getTime()));

    const numTags = Math.floor(Math.random() * 3) + 1;
    const selectedTags = Array.from({ length: numTags }).map(() => tags[Math.floor(Math.random() * tags.length)]);
    const uniqueTags = Array.from(new Set(selectedTags));

    const numSegments = Math.floor(Math.random() * 3);
    const segmentIds = Array.from({ length: numSegments }).map(() => `SEG-${Math.floor(Math.random() * 100) + 1}`);

    const purchaseHistory = Math.random() > 0.6 ? Array.from({ length: Math.floor(Math.random() * 3) + 1 }).map(() => ({
        orderId: `ORD-${Math.random().toString(36).substring(7)}`,
        date: new Date(lastActivityDate.getTime() - Math.random() * 30 * 24 * 60 * 60 * 1000),
        amount: parseFloat((Math.random() * 500 + 20).toFixed(2)),
        items: [`Product ${Math.floor(Math.random() * 5 + 1)}`],
    })) : [];

    const websiteVisits = Math.random() > 0.5 ? Array.from({ length: Math.floor(Math.random() * 5) + 1 }).map(() => ({
        date: new Date(lastActivityDate.getTime() - Math.random() * 15 * 24 * 60 * 60 * 1000),
        page: ['/home', '/pricing', '/blog', '/contact', '/product'][Math.floor(Math.random() * 5)],
        duration: Math.floor(Math.random() * 300) + 30, // 30s to 330s
    })) : [];

    return {
        id: id,
        email: `${firstNames[Math.floor(Math.random() * firstNames.length)].toLowerCase()}.${lastNames[Math.floor(Math.random() * lastNames.length)].toLowerCase()}${contactIdCounter}@example.com`,
        firstName: firstNames[Math.floor(Math.random() * firstNames.length)],
        lastName: lastNames[Math.floor(Math.random() * lastNames.length)],
        phone: `+1-${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}`,
        city: cities[Math.floor(Math.random() * cities.length)],
        country: countries[Math.floor(Math.random() * countries.length)],
        signUpDate: signUpDate,
        tags: uniqueTags,
        segmentIds: segmentIds,
        leadScore: Math.floor(Math.random() * 100),
        lastActivity: {
            date: lastActivityDate,
            type: activityTypes[Math.floor(Math.random() * activityTypes.length)],
            details: `Contact activity on ${lastActivityDate.toDateString()}`,
        },
        purchaseHistory: purchaseHistory,
        websiteVisits: websiteVisits,
    };
};

let notificationIdCounter = 1;
export const generateDummyNotification = (): Notification => {
    const id = `NOT-${notificationIdCounter++}`;
    const types = ['info', 'warning', 'error', 'success'];
    const messages = [
        'Campaign "Summer Sale" started successfully.',
        'Audience segment "High-Value Leads" updated with 50 new contacts.',
        'Workflow "Onboarding Series" paused due to an error.',
        'Email campaign "Product Launch" sent to 10,000 subscribers.',
        'New lead signed up for your newsletter.',
        'Low budget alert: Campaign "Q4 PPC" has less than 10% budget remaining.'
    ];

    return {
        id: id,
        message: messages[Math.floor(Math.random() * messages.length)],
        type: types[Math.floor(Math.random() * types.length)] as any,
        read: Math.random() > 0.7,
        timestamp: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
        link: Math.random() > 0.5 ? `/app/marketing/campaigns/CAM-${Math.floor(Math.random() * 10)}` : undefined,
    };
};

let auditLogIdCounter = 1;
export const generateDummyAuditLogEntry = (): AuditLogEntry => {
    const id = `AUDIT-${auditLogIdCounter++}`;
    const users = ['user-1', 'user-2', 'user-3'];
    const actions = ['Created', 'Updated', 'Deleted', 'Activated', 'Deactivated', 'Scheduled'];
    const resourceTypes = ['Campaign', 'Segment', 'Workflow', 'Email Template', 'Social Post', 'AB Test'];
    const resourceIds = [`CAM-${Math.floor(Math.random() * 100)}`, `SEG-${Math.floor(Math.random() * 100)}`, `WF-${Math.floor(Math.random() * 10)}`];

    const action = actions[Math.floor(Math.random() * actions.length)];
    const resourceType = resourceTypes[Math.floor(Math.random() * resourceTypes.length)];
    const resourceId = resourceIds[Math.floor(Math.random() * resourceIds.length)];

    let changes = undefined;
    if (action === 'Updated') {
        changes = {
            oldValue: { status: 'Paused', budget: 1000 },
            newValue: { status: 'Active', budget: 1500 }
        };
    }

    return {
        id: id,
        timestamp: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
        userId: users[Math.floor(Math.random() * users.length)],
        action: `${action} ${resourceType}`,
        resourceType: resourceType,
        resourceId: resourceId,
        changes: changes,
    };
};

// --- MOCK API FUNCTIONS (to be exported) ---
// Simulate API calls with artificial delays
export const mockApi = {
    getCampaigns: (): Promise<MarketingCampaignDetail[]> => {
        return new Promise(resolve => {
            setTimeout(() => {
                const existingCampaigns = Array.isArray((globalThis as any).mockCampaigns) ? (globalThis as any).mockCampaigns : [];
                if (existingCampaigns.length === 0) {
                    (globalThis as any).mockCampaigns = Array.from({ length: 20 }).map(() => generateDummyCampaign());
                }
                resolve((globalThis as any).mockCampaigns);
            }, 500);
        });
    },
    getCampaignById: (id: string): Promise<MarketingCampaignDetail | undefined> => {
        return new Promise(resolve => {
            setTimeout(() => {
                resolve((globalThis as any).mockCampaigns.find((c: MarketingCampaignDetail) => c.campaignId === id));
            }, 300);
        });
    },
    saveCampaign: (campaign: MarketingCampaignDetail): Promise<MarketingCampaignDetail> => {
        return new Promise(resolve => {
            setTimeout(() => {
                const index = (globalThis as any).mockCampaigns.findIndex((c: MarketingCampaignDetail) => c.campaignId === campaign.campaignId);
                if (index > -1) {
                    (globalThis as any).mockCampaigns[index] = { ...(globalThis as any).mockCampaigns[index], ...campaign, lastModified: new Date() };
                } else {
                    const newCampaign = { ...campaign, campaignId: `CAM-${campaignIdCounter++}`, createdAt: new Date(), lastModified: new Date() };
                    (globalThis as any).mockCampaigns.push(newCampaign);
                    (globalThis as any).mockAuditLogs.push(generateDummyAuditLogEntry()); // Add audit log
                    resolve(newCampaign);
                    return;
                }
                (globalThis as any).mockAuditLogs.push(generateDummyAuditLogEntry()); // Add audit log
                resolve((globalThis as any).mockCampaigns[index]);
            }, 700);
        });
    },
    deleteCampaign: (id: string): Promise<boolean> => {
        return new Promise(resolve => {
            setTimeout(() => {
                const initialLength = (globalThis as any).mockCampaigns.length;
                (globalThis as any).mockCampaigns = (globalThis as any).mockCampaigns.filter((c: MarketingCampaignDetail) => c.campaignId !== id);
                (globalThis as any).mockAuditLogs.push(generateDummyAuditLogEntry()); // Add audit log
                resolve((globalThis as any).mockCampaigns.length < initialLength);
            }, 400);
        });
    },

    getSegments: (): Promise<AudienceSegment[]> => {
        return new Promise(resolve => {
            setTimeout(() => {
                const existingSegments = Array.isArray((globalThis as any).mockSegments) ? (globalThis as any).mockSegments : [];
                if (existingSegments.length === 0) {
                    (globalThis as any).mockSegments = Array.from({ length: 10 }).map(() => generateDummySegment());
                }
                resolve((globalThis as any).mockSegments);
            }, 500);
        });
    },
    saveSegment: (segment: AudienceSegment): Promise<AudienceSegment> => {
        return new Promise(resolve => {
            setTimeout(() => {
                const index = (globalThis as any).mockSegments.findIndex((s: AudienceSegment) => s.id === segment.id);
                if (index > -1) {
                    (globalThis as any).mockSegments[index] = { ...(globalThis as any).mockSegments[index], ...segment, lastModified: new Date() };
                } else {
                    const newSegment = { ...segment, id: `SEG-${segmentIdCounter++}`, createdAt: new Date(), lastModified: new Date() };
                    (globalThis as any).mockSegments.push(newSegment);
                    (globalThis as any).mockAuditLogs.push(generateDummyAuditLogEntry()); // Add audit log
                    resolve(newSegment);
                    return;
                }
                (globalThis as any).mockAuditLogs.push(generateDummyAuditLogEntry()); // Add audit log
                resolve((globalThis as any).mockSegments[index]);
            }, 700);
        });
    },
    deleteSegment: (id: string): Promise<boolean> => {
        return new Promise(resolve => {
            setTimeout(() => {
                const initialLength = (globalThis as any).mockSegments.length;
                (globalThis as any).mockSegments = (globalThis as any).mockSegments.filter((s: AudienceSegment) => s.id !== id);
                (globalThis as any).mockAuditLogs.push(generateDummyAuditLogEntry()); // Add audit log
                resolve((globalThis as any).mockSegments.length < initialLength);
            }, 400);
        });
    },

    getWorkflows: (): Promise<MarketingWorkflow[]> => {
        return new Promise(resolve => {
            setTimeout(() => {
                const existingWorkflows = Array.isArray((globalThis as any).mockWorkflows) ? (globalThis as any).mockWorkflows : [];
                if (existingWorkflows.length === 0) {
                    (globalThis as any).mockWorkflows = Array.from({ length: 5 }).map(() => generateDummyWorkflow());
                }
                resolve((globalThis as any).mockWorkflows);
            }, 500);
        });
    },
    saveWorkflow: (workflow: MarketingWorkflow): Promise<MarketingWorkflow> => {
        return new Promise(resolve => {
            setTimeout(() => {
                const index = (globalThis as any).mockWorkflows.findIndex((w: MarketingWorkflow) => w.id === workflow.id);
                if (index > -1) {
                    (globalThis as any).mockWorkflows[index] = { ...(globalThis as any).mockWorkflows[index], ...workflow, lastModified: new Date() };
                } else {
                    const newWorkflow = { ...workflow, id: `WF-${workflowIdCounter++}`, createdAt: new Date(), lastModified: new Date() };
                    (globalThis as any).mockWorkflows.push(newWorkflow);
                    (globalThis as any).mockAuditLogs.push(generateDummyAuditLogEntry()); // Add audit log
                    resolve(newWorkflow);
                    return;
                }
                (globalThis as any).mockAuditLogs.push(generateDummyAuditLogEntry()); // Add audit log
                resolve((globalThis as any).mockWorkflows[index]);
            }, 700);
        });
    },
    deleteWorkflow: (id: string): Promise<boolean> => {
        return new Promise(resolve => {
            setTimeout(() => {
                const initialLength = (globalThis as any).mockWorkflows.length;
                (globalThis as any).mockWorkflows = (globalThis as any).mockWorkflows.filter((w: MarketingWorkflow) => w.id !== id);
                (globalThis as any).mockAuditLogs.push(generateDummyAuditLogEntry()); // Add audit log
                resolve((globalThis as any).mockWorkflows.length < initialLength);
            }, 400);
        });
    },

    getEmailTemplates: (): Promise<EmailTemplate[]> => {
        return new Promise(resolve => {
            setTimeout(() => {
                const existingTemplates = Array.isArray((globalThis as any).mockEmailTemplates) ? (globalThis as any).mockEmailTemplates : [];
                if (existingTemplates.length === 0) {
                    (globalThis as any).mockEmailTemplates = Array.from({ length: 15 }).map(() => generateDummyEmailTemplate());
                }
                resolve((globalThis as any).mockEmailTemplates);
            }, 500);
        });
    },
    getEmailCampaigns: (): Promise<EmailCampaign[]> => {
        return new Promise(resolve => {
            setTimeout(() => {
                const existingEmailCampaigns = Array.isArray((globalThis as any).mockEmailCampaigns) ? (globalThis as any).mockEmailCampaigns : [];
                if (existingEmailCampaigns.length === 0 && (globalThis as any).mockEmailTemplates && (globalThis as any).mockSegments) {
                    (globalThis as any).mockEmailCampaigns = Array.from({ length: 10 }).map(() => generateDummyEmailCampaign(
                        (globalThis as any).mockEmailTemplates[Math.floor(Math.random() * (globalThis as any).mockEmailTemplates.length)].id,
                        (globalThis as any).mockSegments[Math.floor(Math.random() * (globalThis as any).mockSegments.length)].id
                    ));
                }
                resolve((globalThis as any).mockEmailCampaigns);
            }, 500);
        });
    },
    saveEmailCampaign: (campaign: EmailCampaign): Promise<EmailCampaign> => {
        return new Promise(resolve => {
            setTimeout(() => {
                const index = (globalThis as any).mockEmailCampaigns.findIndex((c: EmailCampaign) => c.id === campaign.id);
                if (index > -1) {
                    (globalThis as any).mockEmailCampaigns[index] = { ...(globalThis as any).mockEmailCampaigns[index], ...campaign, lastModified: new Date() };
                } else {
                    const newCampaign = { ...campaign, id: `EMC-${emailCampaignIdCounter++}`, createdAt: new Date(), lastModified: new Date() };
                    (globalThis as any).mockEmailCampaigns.push(newCampaign);
                    (globalThis as any).mockAuditLogs.push(generateDummyAuditLogEntry()); // Add audit log
                    resolve(newCampaign);
                    return;
                }
                (globalThis as any).mockAuditLogs.push(generateDummyAuditLogEntry()); // Add audit log
                resolve((globalThis as any).mockEmailCampaigns[index]);
            }, 700);
        });
    },
    deleteEmailCampaign: (id: string): Promise<boolean> => {
        return new Promise(resolve => {
            setTimeout(() => {
                const initialLength = (globalThis as any).mockEmailCampaigns.length;
                (globalThis as any).mockEmailCampaigns = (globalThis as any).mockEmailCampaigns.filter((c: EmailCampaign) => c.id !== id);
                (globalThis as any).mockAuditLogs.push(generateDummyAuditLogEntry()); // Add audit log
                resolve((globalThis as any).mockEmailCampaigns.length < initialLength);
            }, 400);
        });
    },

    getSocialPosts: (): Promise<SocialPost[]> => {
        return new Promise(resolve => {
            setTimeout(() => {
                const existingPosts = Array.isArray((globalThis as any).mockSocialPosts) ? (globalThis as any).mockSocialPosts : [];
                if (existingPosts.length === 0) {
                    (globalThis as any).mockSocialPosts = Array.from({ length: 25 }).map(() => generateDummySocialPost());
                }
                resolve((globalThis as any).mockSocialPosts);
            }, 500);
        });
    },
    saveSocialPost: (post: SocialPost): Promise<SocialPost> => {
        return new Promise(resolve => {
            setTimeout(() => {
                const index = (globalThis as any).mockSocialPosts.findIndex((p: SocialPost) => p.id === post.id);
                if (index > -1) {
                    (globalThis as any).mockSocialPosts[index] = { ...(globalThis as any).mockSocialPosts[index], ...post, lastModified: new Date() };
                } else {
                    const newPost = { ...post, id: `SP-${socialPostIdCounter++}`, createdAt: new Date(), lastModified: new Date() };
                    (globalThis as any).mockSocialPosts.push(newPost);
                    (globalThis as any).mockAuditLogs.push(generateDummyAuditLogEntry()); // Add audit log
                    resolve(newPost);
                    return;
                }
                (globalThis as any).mockAuditLogs.push(generateDummyAuditLogEntry()); // Add audit log
                resolve((globalThis as any).mockSocialPosts[index]);
            }, 700);
        });
    },
    deleteSocialPost: (id: string): Promise<boolean> => {
        return new Promise(resolve => {
            setTimeout(() => {
                const initialLength = (globalThis as any).mockSocialPosts.length;
                (globalThis as any).mockSocialPosts = (globalThis as any).mockSocialPosts.filter((p: SocialPost) => p.id !== id);
                (globalThis as any).mockAuditLogs.push(generateDummyAuditLogEntry()); // Add audit log
                resolve((globalThis as any).mockSocialPosts.length < initialLength);
            }, 400);
        });
    },

    getABTests: (): Promise<ABTest[]> => {
        return new Promise(resolve => {
            setTimeout(() => {
                const existingTests = Array.isArray((globalThis as any).mockABTests) ? (globalThis as any).mockABTests : [];
                if (existingTests.length === 0) {
                    (globalThis as any).mockABTests = Array.from({ length: 8 }).map(() => generateDummyABTest());
                }
                resolve((globalThis as any).mockABTests);
            }, 500);
        });
    },
    saveABTest: (test: ABTest): Promise<ABTest> => {
        return new Promise(resolve => {
            setTimeout(() => {
                const index = (globalThis as any).mockABTests.findIndex((t: ABTest) => t.id === test.id);
                if (index > -1) {
                    (globalThis as any).mockABTests[index] = { ...(globalThis as any).mockABTests[index], ...test, lastModified: new Date() };
                } else {
                    const newTest = { ...test, id: `ABT-${abTestIdCounter++}`, createdAt: new Date(), lastModified: new Date() };
                    (globalThis as any).mockABTests.push(newTest);
                    (globalThis as any).mockAuditLogs.push(generateDummyAuditLogEntry()); // Add audit log
                    resolve(newTest);
                    return;
                }
                (globalThis as any).mockAuditLogs.push(generateDummyAuditLogEntry()); // Add audit log
                resolve((globalThis as any).mockABTests[index]);
            }, 700);
        });
    },
    deleteABTest: (id: string): Promise<boolean> => {
        return new Promise(resolve => {
            setTimeout(() => {
                const initialLength = (globalThis as any).mockABTests.length;
                (globalThis as any).mockABTests = (globalThis as any).mockABTests.filter((t: ABTest) => t.id !== id);
                (globalThis as any).mockAuditLogs.push(generateDummyAuditLogEntry()); // Add audit log
                resolve((globalThis as any).mockABTests.length < initialLength);
            }, 400);
        });
    },

    getContacts: (): Promise<ContactProfile[]> => {
        return new Promise(resolve => {
            setTimeout(() => {
                const existingContacts = Array.isArray((globalThis as any).mockContacts) ? (globalThis as any).mockContacts : [];
                if (existingContacts.length === 0) {
                    (globalThis as any).mockContacts = Array.from({ length: 50 }).map(() => generateDummyContact());
                }
                resolve((globalThis as any).mockContacts);
            }, 500);
        });
    },
    saveContact: (contact: ContactProfile): Promise<ContactProfile> => {
        return new Promise(resolve => {
            setTimeout(() => {
                const index = (globalThis as any).mockContacts.findIndex((c: ContactProfile) => c.id === contact.id);
                if (index > -1) {
                    (globalThis as any).mockContacts[index] = { ...(globalThis as any).mockContacts[index], ...contact };
                } else {
                    const newContact = { ...contact, id: `CON-${contactIdCounter++}`, signUpDate: new Date(), tags: [], leadScore: 0 };
                    (globalThis as any).mockContacts.push(newContact);
                    (globalThis as any).mockAuditLogs.push(generateDummyAuditLogEntry()); // Add audit log
                    resolve(newContact);
                    return;
                }
                (globalThis as any).mockAuditLogs.push(generateDummyAuditLogEntry()); // Add audit log
                resolve((globalThis as any).mockContacts[index]);
            }, 700);
        });
    },
    deleteContact: (id: string): Promise<boolean> => {
        return new Promise(resolve => {
            setTimeout(() => {
                const initialLength = (globalThis as any).mockContacts.length;
                (globalThis as any).mockContacts = (globalThis as any).mockContacts.filter((c: ContactProfile) => c.id !== id);
                (globalThis as any).mockAuditLogs.push(generateDummyAuditLogEntry()); // Add audit log
                resolve((globalThis as any).mockContacts.length < initialLength);
            }, 400);
        });
    },

    getNotifications: (): Promise<Notification[]> => {
        return new Promise(resolve => {
            setTimeout(() => {
                const existingNotifications = Array.isArray((globalThis as any).mockNotifications) ? (globalThis as any).mockNotifications : [];
                if (existingNotifications.length === 0) {
                    (globalThis as any).mockNotifications = Array.from({ length: 15 }).map(() => generateDummyNotification());
                }
                resolve((globalThis as any).mockNotifications);
            }, 300);
        });
    },
    markNotificationAsRead: (id: string): Promise<boolean> => {
        return new Promise(resolve => {
            setTimeout(() => {
                const notification = (globalThis as any).mockNotifications.find((n: Notification) => n.id === id);
                if (notification) {
                    notification.read = true;
                    resolve(true);
                }
                resolve(false);
            }, 100);
        });
    },

    getAuditLogs: (): Promise<AuditLogEntry[]> => {
        return new Promise(resolve => {
            setTimeout(() => {
                const existingLogs = Array.isArray((globalThis as any).mockAuditLogs) ? (globalThis as any).mockAuditLogs : [];
                if (existingLogs.length === 0) {
                    (globalThis as any).mockAuditLogs = Array.from({ length: 30 }).map(() => generateDummyAuditLogEntry());
                }
                resolve((globalThis as any).mockAuditLogs.sort((a: AuditLogEntry, b: AuditLogEntry) => b.timestamp.getTime() - a.timestamp.getTime()));
            }, 500);
        });
    },
};

// Ensure mock data exists globally once
if (typeof globalThis !== 'undefined') {
    if (!(globalThis as any).mockCampaigns) (globalThis as any).mockCampaigns = Array.from({ length: 20 }).map(() => generateDummyCampaign());
    if (!(globalThis as any).mockSegments) (globalThis as any).mockSegments = Array.from({ length: 10 }).map(() => generateDummySegment());
    if (!(globalThis as any).mockWorkflows) (globalThis as any).mockWorkflows = Array.from({ length: 5 }).map(() => generateDummyWorkflow());
    if (!(globalThis as any).mockEmailTemplates) (globalThis as any).mockEmailTemplates = Array.from({ length: 15 }).map(() => generateDummyEmailTemplate());
    if (!(globalThis as any).mockEmailCampaigns && (globalThis as any).mockEmailTemplates && (globalThis as any).mockSegments) (globalThis as any).mockEmailCampaigns = Array.from({ length: 10 }).map(() => generateDummyEmailCampaign(
        (globalThis as any).mockEmailTemplates[Math.floor(Math.random() * (globalThis as any).mockEmailTemplates.length)].id,
        (globalThis as any).mockSegments[Math.floor(Math.random() * (globalThis as any).mockSegments.length)].id
    ));
    if (!(globalThis as any).mockSocialPosts) (globalThis as any).mockSocialPosts = Array.from({ length: 25 }).map(() => generateDummySocialPost());
    if (!(globalThis as any).mockABTests) (globalThis as any).mockABTests = Array.from({ length: 8 }).map(() => generateDummyABTest());
    if (!(globalThis as any).mockContacts) (globalThis as any).mockContacts = Array.from({ length: 50 }).map(() => generateDummyContact());
    if (!(globalThis as any).mockNotifications) (globalThis as any).mockNotifications = Array.from({ length: 15 }).map(() => generateDummyNotification());
    if (!(globalThis as any).mockAuditLogs) (globalThis as any).mockAuditLogs = Array.from({ length: 30 }).map(() => generateDummyAuditLogEntry());
}

// Global state for a complex application should ideally use a state management library
// For the purpose of this exercise and staying within one file, we'll use React Context API.
export interface MarketingAutomationContextType {
    campaigns: MarketingCampaignDetail[];
    segments: AudienceSegment[];
    workflows: MarketingWorkflow[];
    emailTemplates: EmailTemplate[];
    emailCampaigns: EmailCampaign[];
    socialPosts: SocialPost[];
    abTests: ABTest[];
    contacts: ContactProfile[];
    notifications: Notification[];
    auditLogs: AuditLogEntry[];
    loadingState: {
        campaigns: boolean; segments: boolean; workflows: boolean;
        emailTemplates: boolean; emailCampaigns: boolean; socialPosts: boolean;
        abTests: boolean; contacts: boolean; notifications: boolean; auditLogs: boolean;
    };
    fetchCampaigns: () => Promise<void>;
    addOrUpdateCampaign: (campaign: MarketingCampaignDetail) => Promise<void>;
    deleteCampaign: (id: string) => Promise<void>;
    fetchSegments: () => Promise<void>;
    addOrUpdateSegment: (segment: AudienceSegment) => Promise<void>;
    deleteSegment: (id: string) => Promise<void>;
    fetchWorkflows: () => Promise<void>;
    addOrUpdateWorkflow: (workflow: MarketingWorkflow) => Promise<void>;
    deleteWorkflow: (id: string) => Promise<void>;
    fetchEmailTemplates: () => Promise<void>;
    fetchEmailCampaigns: () => Promise<void>;
    addOrUpdateEmailCampaign: (campaign: EmailCampaign) => Promise<void>;
    deleteEmailCampaign: (id: string) => Promise<void>;
    fetchSocialPosts: () => Promise<void>;
    addOrUpdateSocialPost: (post: SocialPost) => Promise<void>;
    deleteSocialPost: (id: string) => Promise<void>;
    fetchABTests: () => Promise<void>;
    addOrUpdateABTest: (test: ABTest) => Promise<void>;
    deleteABTest: (id: string) => Promise<void>;
    fetchContacts: () => Promise<void>;
    addOrUpdateContact: (contact: ContactProfile) => Promise<void>;
    deleteContact: (id: string) => Promise<void>;
    fetchNotifications: () => Promise<void>;
    markNotificationAsRead: (id: string) => Promise<void>;
    fetchAuditLogs: () => Promise<void>;
    getCampaignById: (id: string) => MarketingCampaignDetail | undefined;
    getSegmentById: (id: string) => AudienceSegment | undefined;
}

export const MarketingAutomationInternalContext = createContext<MarketingAutomationContextType | undefined>(undefined);

export const MarketingAutomationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [campaigns, setCampaigns] = useState<MarketingCampaignDetail[]>([]);
    const [segments, setSegments] = useState<AudienceSegment[]>([]);
    const [workflows, setWorkflows] = useState<MarketingWorkflow[]>([]);
    const [emailTemplates, setEmailTemplates] = useState<EmailTemplate[]>([]);
    const [emailCampaigns, setEmailCampaigns] = useState<EmailCampaign[]>([]);
    const [socialPosts, setSocialPosts] = useState<SocialPost[]>([]);
    const [abTests, setABTests] = useState<ABTest[]>([]);
    const [contacts, setContacts] = useState<ContactProfile[]>([]);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([]);
    const [loadingState, setLoadingState] = useState({
        campaigns: true, segments: true, workflows: true,
        emailTemplates: true, emailCampaigns: true, socialPosts: true,
        abTests: true, contacts: true, notifications: true, auditLogs: true,
    });

    const safeAsyncWrapper = useCallback(async <T,>(
        loaderKey: keyof typeof loadingState,
        apiCall: () => Promise<T>,
        setter: React.Dispatch<React.SetStateAction<T>>,
        onSuccess?: (data: T) => void
    ) => {
        setLoadingState(prev => ({ ...prev, [loaderKey]: true }));
        try {
            const data = await apiCall();
            setter(data);
            if (onSuccess) onSuccess(data);
        } catch (error) {
            console.error(`Failed to fetch ${loaderKey}:`, error);
        } finally {
            setLoadingState(prev => ({ ...prev, [loaderKey]: false }));
        }
    }, []);

    // Fetchers
    const fetchCampaigns = useCallback(() => safeAsyncWrapper('campaigns', mockApi.getCampaigns, setCampaigns), [safeAsyncWrapper]);
    const fetchSegments = useCallback(() => safeAsyncWrapper('segments', mockApi.getSegments, setSegments), [safeAsyncWrapper]);
    const fetchWorkflows = useCallback(() => safeAsyncWrapper('workflows', mockApi.getWorkflows, setWorkflows), [safeAsyncWrapper]);
    const fetchEmailTemplates = useCallback(() => safeAsyncWrapper('emailTemplates', mockApi.getEmailTemplates, setEmailTemplates), [safeAsyncWrapper]);
    const fetchEmailCampaigns = useCallback(() => safeAsyncWrapper('emailCampaigns', mockApi.getEmailCampaigns, setEmailCampaigns), [safeAsyncWrapper]);
    const fetchSocialPosts = useCallback(() => safeAsyncWrapper('socialPosts', mockApi.getSocialPosts, setSocialPosts), [safeAsyncWrapper]);
    const fetchABTests = useCallback(() => safeAsyncWrapper('abTests', mockApi.getABTests, setABTests), [safeAsyncWrapper]);
    const fetchContacts = useCallback(() => safeAsyncWrapper('contacts', mockApi.getContacts, setContacts), [safeAsyncWrapper]);
    const fetchNotifications = useCallback(() => safeAsyncWrapper('notifications', mockApi.getNotifications, setNotifications), [safeAsyncWrapper]);
    const fetchAuditLogs = useCallback(() => safeAsyncWrapper('auditLogs', mockApi.getAuditLogs, setAuditLogs), [safeAsyncWrapper]);

    // Add/Update/Delete functions
    const addOrUpdateGeneric = useCallback(async <T extends { id?: string; campaignId?: string }>(
        apiCall: (item: T) => Promise<T>,
        setter: React.Dispatch<React.SetStateAction<T[]>>,
        item: T,
        resourceType: string,
        idKey: keyof T = 'id' as keyof T
    ) => {
        try {
            const updatedItem = await apiCall(item);
            setter(prev => {
                const index = prev.findIndex(i => i[idKey] === item[idKey]);
                if (index > -1) {
                    return [...prev.slice(0, index), updatedItem, ...prev.slice(index + 1)];
                } else {
                    return [...prev, updatedItem];
                }
            });
            await fetchAuditLogs(); // Refresh audit logs on data change
            return updatedItem;
        } catch (error) {
            console.error(`Failed to save ${resourceType}:`, error);
            throw error;
        }
    }, [fetchAuditLogs]);
    

    const deleteGeneric = useCallback(async (
        apiCall: (id: string) => Promise<boolean>,
        setter: React.Dispatch<React.SetStateAction<any[]>>,
        id: string,
        resourceType: string,
        idKey: string = 'id'
    ) => {
        try {
            const success = await apiCall(id);
            if (success) {
                setter(prev => prev.filter(item => item[idKey] !== id));
                await fetchAuditLogs(); // Refresh audit logs on data change
            }
            return success;
        } catch (error) {
            console.error(`Failed to delete ${resourceType}:`, error);
            throw error;
        }
    }, [fetchAuditLogs]);

    const addOrUpdateCampaign = useCallback((campaign: MarketingCampaignDetail) => addOrUpdateGeneric(mockApi.saveCampaign, setCampaigns, campaign, 'campaign', 'campaignId'), [addOrUpdateGeneric]);
    const deleteCampaign = useCallback((id: string) => deleteGeneric(mockApi.deleteCampaign, setCampaigns, id, 'campaign', 'campaignId'), [deleteGeneric]);

    const addOrUpdateSegment = useCallback((segment: AudienceSegment) => addOrUpdateGeneric(mockApi.saveSegment, setSegments, segment, 'segment'), [addOrUpdateGeneric]);
    const deleteSegment = useCallback((id: string) => deleteGeneric(mockApi.deleteSegment, setSegments, id, 'segment'), [deleteGeneric]);

    const addOrUpdateWorkflow = useCallback((workflow: MarketingWorkflow) => addOrUpdateGeneric(mockApi.saveWorkflow, setWorkflows, workflow, 'workflow'), [addOrUpdateGeneric]);
    const deleteWorkflow = useCallback((id: string) => deleteGeneric(mockApi.deleteWorkflow, setWorkflows, id, 'workflow'), [deleteGeneric]);

    const addOrUpdateEmailCampaign = useCallback((campaign: EmailCampaign) => addOrUpdateGeneric(mockApi.saveEmailCampaign, setEmailCampaigns, campaign, 'email campaign'), [addOrUpdateGeneric]);
    const deleteEmailCampaign = useCallback((id: string) => deleteGeneric(mockApi.deleteEmailCampaign, setEmailCampaigns, id, 'email campaign'), [deleteGeneric]);

    const addOrUpdateSocialPost = useCallback((post: SocialPost) => addOrUpdateGeneric(mockApi.saveSocialPost, setSocialPosts, post, 'social post'), [addOrUpdateGeneric]);
    const deleteSocialPost = useCallback((id: string) => deleteGeneric(mockApi.deleteSocialPost, setSocialPosts, id, 'social post'), [deleteGeneric]);

    const addOrUpdateABTest = useCallback((test: ABTest) => addOrUpdateGeneric(mockApi.saveABTest, setABTests, test, 'A/B test'), [addOrUpdateGeneric]);
    const deleteABTest = useCallback((id: string) => deleteGeneric(mockApi.deleteABTest, setABTests, id, 'A/B test'), [deleteGeneric]);

    const addOrUpdateContact = useCallback((contact: ContactProfile) => addOrUpdateGeneric(mockApi.saveContact, setContacts, contact, 'contact'), [addOrUpdateGeneric]);
    const deleteContact = useCallback((id: string) => deleteGeneric(mockApi.deleteContact, setContacts, id, 'contact'), [deleteGeneric]);

    const markNotificationAsRead = useCallback(async (id: string) => {
        try {
            const success = await mockApi.markNotificationAsRead(id);
            if (success) {
                setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
            }
        } catch (error) {
            console.error('Failed to mark notification as read:', error);
        }
    }, []);

    // Getters for specific items
    const getCampaignById = useCallback((id: string) => campaigns.find(c => c.campaignId === id), [campaigns]);
    const getSegmentById = useCallback((id: string) => segments.find(s => s.id === id), [segments]);

    useEffect(() => {
        fetchCampaigns();
        fetchSegments();
        fetchWorkflows();
        fetchEmailTemplates();
        fetchEmailCampaigns();
        fetchSocialPosts();
        fetchABTests();
        fetchContacts();
        fetchNotifications();
        fetchAuditLogs();
    }, [fetchCampaigns, fetchSegments, fetchWorkflows, fetchEmailTemplates, fetchEmailCampaigns, fetchSocialPosts, fetchABTests, fetchContacts, fetchNotifications, fetchAuditLogs]);


    const contextValue = useMemo(() => ({
        campaigns, segments, workflows, emailTemplates, emailCampaigns, socialPosts, abTests, contacts, notifications, auditLogs, loadingState,
        fetchCampaigns, addOrUpdateCampaign, deleteCampaign,
        fetchSegments, addOrUpdateSegment, deleteSegment,
        fetchWorkflows, addOrUpdateWorkflow, deleteWorkflow,
        fetchEmailTemplates, fetchEmailCampaigns, addOrUpdateEmailCampaign, deleteEmailCampaign,
        fetchSocialPosts, addOrUpdateSocialPost, deleteSocialPost,
        fetchABTests, addOrUpdateABTest, deleteABTest,
        fetchContacts, addOrUpdateContact, deleteContact,
        fetchNotifications, markNotificationAsRead,
        fetchAuditLogs,
        getCampaignById, getSegmentById,
    }), [
        campaigns, segments, workflows, emailTemplates, emailCampaigns, socialPosts, abTests, contacts, notifications, auditLogs, loadingState,
        fetchCampaigns, addOrUpdateCampaign, deleteCampaign,
        fetchSegments, addOrUpdateSegment, deleteSegment,
        fetchWorkflows, addOrUpdateWorkflow, deleteWorkflow,
        fetchEmailTemplates, fetchEmailCampaigns, addOrUpdateEmailCampaign, deleteEmailCampaign,
        fetchSocialPosts, addOrUpdateSocialPost, deleteSocialPost,
        fetchABTests, addOrUpdateABTest, deleteABTest,
        fetchContacts, addOrUpdateContact, deleteContact,
        fetchNotifications, markNotificationAsRead,
        fetchAuditLogs,
        getCampaignById, getSegmentById,
    ]);

    return (
        <MarketingAutomationInternalContext.Provider value={contextValue}>
            {children}
        </MarketingAutomationInternalContext.Provider>
    );
};

export const useMarketingAutomation = () => {
    const context = useContext(MarketingAutomationInternalContext);
    if (context === undefined) {
        throw new Error('useMarketingAutomation must be used within a MarketingAutomationProvider');
    }
    return context;
};

// --- COMMON UI COMPONENTS (exported for potential reuse, but defined here for line count) ---

/**
 * @function ExportedModal
 * @description Generic modal component.
 * @param {object} props - Component props.
 * @param {React.ReactNode} props.children - Modal content.
 * @param {string} props.title - Modal title.
 * @param {boolean} props.isOpen - Whether the modal is open.
 * @param {() => void} props.onClose - Callback when modal is closed.
 */
export const ExportedModal: React.FC<{ children: React.ReactNode; title: string; isOpen: boolean; onClose: () => void; className?: string }> = ({ children, title, isOpen, onClose, className = '' }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[100]" onClick={onClose}>
            <div className={`bg-gray-800 rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto ${className}`} onClick={e => e.stopPropagation()}>
                <div className="p-4 border-b border-gray-700 flex justify-between items-center sticky top-0 bg-gray-800 z-10">
                    <h3 className="text-lg font-semibold text-white">{title}</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-white">
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>
                <div className="p-6 space-y-4">
                    {children}
                </div>
            </div>
        </div>
    );
};

/**
 * @function ExportedTable
 * @description Generic table component with sorting and pagination.
 * @param {object} props - Component props.
 * @param {Array<object>} props.data - Array of data objects.
 * @param {Array<{key: string, label: string, render?: (item: any) => React.ReactNode}>} props.columns - Column definitions.
 * @param {string} [props.keyField='id'] - Key field for unique row identification.
 * @param {object} [props.pagination] - Pagination object.
 * @param {(page: number) => void} [props.onPageChange] - Callback for page change.
 * @param {(sortKey: string) => void} [props.onSort] - Callback for sort.
 * @param {string} [props.currentSortKey] - Current sort key.
 * @param {string} [props.sortDirection] - Current sort direction ('asc' | 'desc').
 */
export const ExportedTable: React.FC<{
    data: any[];
    columns: { key: string; label: string; render?: (item: any) => React.ReactNode; sortable?: boolean }[];
    keyField?: string;
    pagination?: Pagination;
    onPageChange?: (page: number) => void;
    onSort?: (sortKey: string) => void;
    currentSortKey?: string;
    sortDirection?: 'asc' | 'desc';
    isLoading?: boolean;
}> = ({ data, columns, keyField = 'id', pagination, onPageChange, onSort, currentSortKey, sortDirection, isLoading }) => {
    const pageControls = pagination ? generatePaginationControls(pagination) : [];

    return (
        <div className="overflow-x-auto relative shadow-md sm:rounded-lg">
            {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75 z-10">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-500"></div>
                </div>
            )}
            <table className="w-full text-sm text-left text-gray-400">
                <thead className="text-xs text-gray-200 uppercase bg-gray-700">
                    <tr>
                        {columns.map(col => (
                            <th key={col.key} scope="col" className="py-3 px-6">
                                {col.sortable ? (
                                    <button onClick={() => onSort && onSort(col.key)} className="flex items-center space-x-1">
                                        <span>{col.label}</span>
                                        {currentSortKey === col.key && (
                                            <span>{sortDirection === 'asc' ? '↑' : '↓'}</span>
                                        )}
                                    </button>
                                ) : (
                                    col.label
                                )}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {data.length === 0 ? (
                        <tr className="bg-gray-800 border-b border-gray-700">
                            <td colSpan={columns.length} className="py-4 px-6 text-center text-gray-500">No data available</td>
                        </tr>
                    ) : (
                        data.map((item, index) => (
                            <tr key={item[keyField] || index} className="bg-gray-800 border-b border-gray-700 hover:bg-gray-700">
                                {columns.map(col => (
                                    <td key={col.key} className="py-4 px-6">
                                        {col.render ? col.render(item) : item[col.key]}
                                    </td>
                                ))}
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
            {pagination && onPageChange && (
                <nav className="flex justify-between items-center pt-4 bg-gray-800 p-4">
                    <span className="text-sm text-gray-400">
                        Showing <span className="font-semibold text-white">{(pagination.currentPage - 1) * pagination.pageSize + 1}</span> to <span className="font-semibold text-white">{Math.min(pagination.currentPage * pagination.pageSize, pagination.totalItems)}</span> of <span className="font-semibold text-white">{pagination.totalItems}</span> entries
                    </span>
                    <ul className="inline-flex items-center -space-x-px">
                        <li>
                            <button
                                onClick={() => onPageChange(pagination.currentPage - 1)}
                                disabled={pagination.currentPage === 1}
                                className="block py-2 px-3 ml-0 leading-tight bg-gray-800 border border-gray-700 text-gray-400 rounded-l-lg hover:bg-gray-700 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <span className="sr-only">Previous</span>
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd"></path></svg>
                            </button>
                        </li>
                        {pageControls.map((page, index) => (
                            <li key={index}>
                                {typeof page === 'number' ? (
                                    <button
                                        onClick={() => onPageChange(page)}
                                        className={`py-2 px-3 leading-tight ${page === pagination.currentPage ? 'bg-cyan-700 text-white' : 'bg-gray-800 text-gray-400'} border border-gray-700 hover:bg-gray-700 hover:text-white`}
                                    >
                                        {page}
                                    </button>
                                ) : (
                                    <span className="py-2 px-3 leading-tight bg-gray-800 border border-gray-700 text-gray-400">...</span>
                                )}
                            </li>
                        ))}
                        <li>
                            <button
                                onClick={() => onPageChange(pagination.currentPage + 1)}
                                disabled={pagination.currentPage === pagination.totalPages}
                                className="block py-2 px-3 leading-tight bg-gray-800 border border-gray-700 text-gray-400 rounded-r-lg hover:bg-gray-700 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <span className="sr-only">Next</span>
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path></svg>
                            </button>
                        </li>
                    </ul>
                </nav>
            )}
        </div>
    );
};

// --- CAMPAIGN MANAGEMENT FEATURES (to be exported) ---

/**
 * @function ExportedCampaignForm
 * @description Form for creating and editing marketing campaigns.
 */
export const ExportedCampaignForm: React.FC<{
    campaign?: MarketingCampaignDetail;
    onSave: (campaign: MarketingCampaignDetail) => void;
    onCancel: () => void;
    isLoading?: boolean;
}> = ({ campaign, onSave, onCancel, isLoading }) => {
    const { segments } = useMarketingAutomation();
    const [formData, setFormData] = useState<MarketingCampaignDetail>(
        campaign || {
            campaignId: '', name: '', description: '', channel: 'PPC', objective: 'Lead Generation',
            startDate: new Date(), endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), budget: 0, cost: 0, revenueGenerated: 0,
            audienceSegments: [], adCreatives: [], status: 'Planned', analytics: { impressions: 0, clicks: 0, conversions: 0, ctr: 0, cpa: 0, roi: 0 },
        }
    );

    useEffect(() => {
        if (campaign) setFormData(campaign);
    }, [campaign]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: (type === 'number' || name === 'budget') ? parseFloat(value) || 0 : value,
        }));
    };

    const handleDateChange = (name: 'startDate' | 'endDate', dateString: string) => {
        setFormData(prev => ({
            ...prev,
            [name]: new Date(dateString),
        }));
    };

    const handleSegmentChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedOptions = Array.from(e.target.selectedOptions).map(option => option.value);
        setFormData(prev => ({
            ...prev,
            audienceSegments: selectedOptions,
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 text-gray-300">
            <div>
                <label className="block text-sm font-medium text-gray-400">Campaign Name</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} required
                    className="mt-1 block w-full bg-gray-700/50 p-2 border border-gray-600 rounded-md focus:ring-cyan-500 focus:border-cyan-500" />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-400">Description</label>
                <textarea name="description" value={formData.description} onChange={handleChange} rows={3}
                    className="mt-1 block w-full bg-gray-700/50 p-2 border border-gray-600 rounded-md focus:ring-cyan-500 focus:border-cyan-500"></textarea>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-400">Channel</label>
                    <select name="channel" value={formData.channel} onChange={handleChange}
                        className="mt-1 block w-full bg-gray-700/50 p-2 border border-gray-600 rounded-md focus:ring-cyan-500 focus:border-cyan-500">
                        <option value="PPC">PPC</option>
                        <option value="Email">Email</option>
                        <option value="Social Media">Social Media</option>
                        <option value="Content Marketing">Content Marketing</option>
                        <option value="SEO">SEO</option>
                        <option value="Affiliate">Affiliate</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-400">Objective</label>
                    <select name="objective" value={formData.objective} onChange={handleChange}
                        className="mt-1 block w-full bg-gray-700/50 p-2 border border-gray-600 rounded-md focus:ring-cyan-500 focus:border-cyan-500">
                        <option value="Lead Generation">Lead Generation</option>
                        <option value="Brand Awareness">Brand Awareness</option>
                        <option value="Sales">Sales</option>
                        <option value="Customer Retention">Customer Retention</option>
                        <option value="Engagement">Engagement</option>
                    </select>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-400">Start Date</label>
                    <input type="date" name="startDate" value={formData.startDate.toISOString().split('T')[0]} onChange={(e) => handleDateChange('startDate', e.target.value)}
                        className="mt-1 block w-full bg-gray-700/50 p-2 border border-gray-600 rounded-md focus:ring-cyan-500 focus:border-cyan-500" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-400">End Date</label>
                    <input type="date" name="endDate" value={formData.endDate.toISOString().split('T')[0]} onChange={(e) => handleDateChange('endDate', e.target.value)}
                        className="mt-1 block w-full bg-gray-700/50 p-2 border border-gray-600 rounded-md focus:ring-cyan-500 focus:border-cyan-500" />
                </div>
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-400">Budget ($)</label>
                <input type="number" name="budget" value={formData.budget} onChange={handleChange} required step="0.01"
                    className="mt-1 block w-full bg-gray-700/50 p-2 border border-gray-600 rounded-md focus:ring-cyan-500 focus:border-cyan-500" />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-400">Target Audience Segments</label>
                <select multiple name="audienceSegments" value={formData.audienceSegments} onChange={handleSegmentChange}
                    className="mt-1 block w-full bg-gray-700/50 p-2 border border-gray-600 rounded-md focus:ring-cyan-500 focus:border-cyan-500 h-24">
                    {segments.map(segment => (
                        <option key={segment.id} value={segment.id}>{segment.name} (Est. Size: {segment.estimatedSize.toLocaleString()})</option>
                    ))}
                </select>
                <p className="text-xs text-gray-500 mt-1">Hold Ctrl/Cmd to select multiple.</p>
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-400">Status</label>
                <select name="status" value={formData.status} onChange={handleChange}
                    className="mt-1 block w-full bg-gray-700/50 p-2 border border-gray-600 rounded-md focus:ring-cyan-500 focus:border-cyan-500">
                    <option value="Planned">Planned</option>
                    <option value="Active">Active</option>
                    <option value="Paused">Paused</option>
                    <option value="Completed">Completed</option>
                    <option value="Archived">Archived</option>
                </select>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
                <button type="button" onClick={onCancel} className="px-4 py-2 text-sm font-medium text-gray-300 rounded-md border border-gray-600 hover:bg-gray-700">Cancel</button>
                <button type="submit" disabled={isLoading} className="px-4 py-2 text-sm font-medium bg-cyan-600 text-white rounded-md hover:bg-cyan-700 disabled:opacity-50 disabled:cursor-not-allowed">
                    {isLoading ? 'Saving...' : (campaign ? 'Update Campaign' : 'Create Campaign')}
                </button>
            </div>
        </form>
    );
};

/**
 * @function ExportedCampaignList
 * @description Displays a list of marketing campaigns with CRUD actions.
 */
export const ExportedCampaignList: React.FC = () => {
    const { campaigns, loadingState, addOrUpdateCampaign, deleteCampaign, getSegmentById } = useMarketingAutomation();
    const [isFormModalOpen, setFormModalOpen] = useState(false);
    const [selectedCampaign, setSelectedCampaign] = useState<MarketingCampaignDetail | undefined>(undefined);
    const [isSaving, setIsSaving] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize] = useState(10);
    const [sortKey, setSortKey] = useState('name');
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
    const [searchTerm, setSearchTerm] = useState('');

    const filteredAndSortedCampaigns = useMemo(() => {
        let sorted = [...campaigns];
        if (sortKey) {
            sorted.sort((a, b) => {
                const aVal = a[sortKey as keyof MarketingCampaignDetail];
                const bVal = b[sortKey as keyof MarketingCampaignDetail];

                if (typeof aVal === 'string' && typeof bVal === 'string') {
                    return sortDirection === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
                }
                if (typeof aVal === 'number' && typeof bVal === 'number') {
                    return sortDirection === 'asc' ? aVal - bVal : bVal - aVal;
                }
                if (aVal instanceof Date && bVal instanceof Date) {
                    return sortDirection === 'asc' ? aVal.getTime() - bVal.getTime() : bVal.getTime() - aVal.getTime();
                }
                return 0;
            });
        }

        if (searchTerm) {
            sorted = sorted.filter(c =>
                c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                c.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                c.channel.toLowerCase().includes(searchTerm.toLowerCase()) ||
                c.status.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        return sorted;
    }, [campaigns, sortKey, sortDirection, searchTerm]);

    const paginatedCampaigns = useMemo(() => {
        const startIndex = (currentPage - 1) * pageSize;
        return filteredAndSortedCampaigns.slice(startIndex, startIndex + pageSize);
    }, [filteredAndSortedCampaigns, currentPage, pageSize]);

    const totalPages = Math.ceil(filteredAndSortedCampaigns.length / pageSize);
    const pagination: Pagination = { currentPage, totalPages, pageSize, totalItems: filteredAndSortedCampaigns.length };

    const handlePageChange = (page: number) => setCurrentPage(page);
    const handleSort = (key: string) => {
        if (key === sortKey) {
            setSortDirection(prev => (prev === 'asc' ? 'desc' : 'asc'));
        } else {
            setSortKey(key);
            setSortDirection('asc');
        }
    };

    const handleAddCampaign = () => {
        setSelectedCampaign(undefined);
        setFormModalOpen(true);
    };

    const handleEditCampaign = (campaign: MarketingCampaignDetail) => {
        setSelectedCampaign(campaign);
        setFormModalOpen(true);
    };

    const handleSaveCampaign = async (campaignData: MarketingCampaignDetail) => {
        setIsSaving(true);
        try {
            await addOrUpdateCampaign(campaignData);
            setFormModalOpen(false);
        } finally {
            setIsSaving(false);
        }
    };

    const handleDeleteCampaign = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this campaign?')) {
            await deleteCampaign(id);
        }
    };

    const campaignColumns = useMemo(() => [
        { key: 'name', label: 'Name', sortable: true },
        { key: 'status', label: 'Status', sortable: true },
        { key: 'channel', label: 'Channel', sortable: true },
        { key: 'budget', label: 'Budget', sortable: true, render: (c: MarketingCampaignDetail) => formatCurrency(c.budget, 'USD') },
        { key: 'revenueGenerated', label: 'Revenue', sortable: true, render: (c: MarketingCampaignDetail) => formatCurrency(c.revenueGenerated, 'USD') },
        { key: 'startDate', label: 'Start Date', sortable: true, render: (c: MarketingCampaignDetail) => formatDate(c.startDate).split(',')[0] },
        { key: 'endDate', label: 'End Date', sortable: true, render: (c: MarketingCampaignDetail) => formatDate(c.endDate).split(',')[0] },
        {
            key: 'audienceSegments',
            label: 'Segments',
            render: (c: MarketingCampaignDetail) => c.audienceSegments.map(segId => getSegmentById(segId)?.name || 'N/A').join(', ')
        },
        {
            key: 'actions',
            label: 'Actions',
            render: (c: MarketingCampaignDetail) => (
                <div className="flex space-x-2">
                    <button onClick={() => handleEditCampaign(c)} className="text-cyan-500 hover:text-cyan-400"><IconEdit /></button>
                    <button onClick={() => handleDeleteCampaign(c.campaignId)} className="text-red-500 hover:text-red-400"><IconDelete /></button>
                </div>
            )
        },
    ], [getSegmentById]);

    return (
        <Card title="Campaign Management">
            <div className="mb-4 flex justify-between items-center">
                <input
                    type="text"
                    placeholder="Search campaigns..."
                    value={searchTerm}
                    onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                    className="p-2 rounded bg-gray-700/50 border border-gray-600 text-white placeholder-gray-400 focus:ring-cyan-500 focus:border-cyan-500"
                />
                <button onClick={handleAddCampaign} className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg text-sm font-medium flex items-center space-x-2">
                    <IconPlus /> <span>Add New Campaign</span>
                </button>
            </div>
            <ExportedTable
                data={paginatedCampaigns}
                columns={campaignColumns}
                keyField="campaignId"
                pagination={pagination}
                onPageChange={handlePageChange}
                onSort={handleSort}
                currentSortKey={sortKey}
                sortDirection={sortDirection}
                isLoading={loadingState.campaigns}
            />

            <ExportedModal
                title={selectedCampaign ? "Edit Campaign" : "Create New Campaign"}
                isOpen={isFormModalOpen}
                onClose={() => setFormModalOpen(false)}
                className="max-w-3xl"
            >
                <ExportedCampaignForm
                    campaign={selectedCampaign}
                    onSave={handleSaveCampaign}
                    onCancel={() => setFormModalOpen(false)}
                    isLoading={isSaving}
                />
            </ExportedModal>
        </Card>
    );
};


/**
 * @function ExportedCampaignAnalytics
 * @description Displays detailed analytics for a selected campaign.
 */
export const ExportedCampaignAnalytics: React.FC<{ campaignId: string }> = ({ campaignId }) => {
    const { getCampaignById, loadingState } = useMarketingAutomation();
    const campaign = useMemo(() => getCampaignById(campaignId), [campaignId, getCampaignById]);

    if (loadingState.campaigns) {
        return <Card title="Campaign Analytics"><div className="text-center p-8"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-500 inline-block"></div><p className="text-gray-400 mt-2">Loading campaign data...</p></div></Card>;
    }

    if (!campaign) {
        return <Card title="Campaign Analytics"><p className="text-red-400">Campaign not found.</p></Card>;
    }

    const { analytics, cost, revenueGenerated, budget } = campaign;
    const kpiData = [
        { name: 'Impressions', value: analytics.impressions, color: '#8884d8' },
        { name: 'Clicks', value: analytics.clicks, color: '#82ca9d' },
        { name: 'Conversions', value: analytics.conversions, color: '#ffc658' },
    ];

    const financialData = [
        { name: 'Budget', value: budget, fill: '#8884d8' },
        { name: 'Cost', value: cost, fill: '#ef4444' },
        { name: 'Revenue', value: revenueGenerated, fill: '#82ca9d' },
    ];

    const performanceMetrics = [
        { label: 'CTR', value: `${analytics.ctr.toFixed(2)}%`, description: 'Click-Through Rate' },
        { label: 'ROAS', value: `${analytics.roi.toFixed(1)}x`, description: 'Return on Ad Spend' },
        { label: 'CPA', value: formatCurrency(analytics.cpa), description: 'Cost Per Acquisition' },
    ];

    return (
        <Card title={`Analytics for: ${campaign.name}`}>
            <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {performanceMetrics.map((metric, index) => (
                        <div key={index} className="bg-gray-700 p-4 rounded-lg flex flex-col items-center">
                            <p className="text-xl font-bold text-white">{metric.value}</p>
                            <p className="text-sm text-gray-400 mt-1">{metric.label} <span className="text-xs">({metric.description})</span></p>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card title="Engagement Overview">
                        <ResponsiveContainer width="100%" height={250}>
                            <BarChart data={kpiData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                <XAxis dataKey="name" stroke="#9ca3af" />
                                <YAxis stroke="#9ca3af" />
                                <Tooltip contentStyle={{ backgroundColor: 'rgba(31, 41, 55, 0.8)', borderColor: '#4b5563' }} />
                                <Bar dataKey="value">
                                    {kpiData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </Card>

                    <Card title="Financial Performance">
                        <ResponsiveContainer width="100%" height={250}>
                            <BarChart data={financialData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                <XAxis dataKey="name" stroke="#9ca3af" />
                                <YAxis stroke="#9ca3af" formatter={(value) => formatCurrency(value, '')} />
                                <Tooltip contentStyle={{ backgroundColor: 'rgba(31, 41, 55, 0.8)', borderColor: '#4b5563' }} formatter={(value: number) => formatCurrency(value)} />
                                <Bar dataKey="value" fill="#82ca9d" />
                            </BarChart>
                        </ResponsiveContainer>
                    </Card>
                </div>
            </div>
        </Card>
    );
};

// --- AUDIENCE SEGMENTATION FEATURES (to be exported) ---

/**
 * @function ExportedSegmentRuleBuilder
 * @description Component to build rules for an audience segment.
 */
export const ExportedSegmentRuleBuilder: React.FC<{
    rules: { field: string; operator: string; value: any }[];
    onChange: (rules: { field: string; operator: string; value: any }[]) => void;
}> = ({ rules, onChange }) => {
    const availableFields = [
        { id: 'emailOpens', name: 'Email Opens', type: 'number' },
        { id: 'purchaseHistory', name: 'Purchase History', type: 'boolean' },
        { id: 'lastActivity', name: 'Last Activity Type', type: 'string' },
        { id: 'leadScore', name: 'Lead Score', type: 'number' },
        { id: 'city', name: 'City', type: 'string' },
        { id: 'country', name: 'Country', type: 'string' },
        { id: 'tags', name: 'Tags', type: 'string-array' },
    ];

    const getOperatorsForFieldType = (type: string) => {
        switch (type) {
            case 'number': return ['equals', 'greaterThan', 'lessThan', 'between'];
            case 'boolean': return ['is'];
            case 'string': return ['equals', 'contains', 'startsWith', 'endsWith', 'notEquals'];
            case 'string-array': return ['containsAny', 'containsAll'];
            default: return ['equals'];
        }
    };

    const handleRuleChange = (index: number, key: string, value: any) => {
        const newRules = [...rules];
        newRules[index] = { ...newRules[index], [key]: value };

        // Reset operator/value if field type changes
        if (key === 'field') {
            const field = availableFields.find(f => f.id === value);
            if (field) {
                newRules[index].operator = getOperatorsForFieldType(field.type)[0];
                newRules[index].value = ''; // Reset value
            }
        }
        onChange(newRules);
    };

    const addRule = () => {
        onChange([...rules, { field: availableFields[0].id, operator: getOperatorsForFieldType(availableFields[0].type)[0], value: '' }]);
    };

    const removeRule = (index: number) => {
        onChange(rules.filter((_, i) => i !== index));
    };

    return (
        <div className="space-y-4">
            {rules.map((rule, index) => {
                const selectedField = availableFields.find(f => f.id === rule.field);
                const fieldType = selectedField?.type || 'string';
                const operators = getOperatorsForFieldType(fieldType);

                return (
                    <div key={index} className="flex flex-wrap items-center gap-2 p-3 bg-gray-700/50 rounded-md">
                        <select
                            value={rule.field}
                            onChange={(e) => handleRuleChange(index, 'field', e.target.value)}
                            className="bg-gray-700 p-2 rounded-md border border-gray-600 text-white"
                        >
                            {availableFields.map(field => (
                                <option key={field.id} value={field.id}>{field.name}</option>
                            ))}
                        </select>
                        <select
                            value={rule.operator}
                            onChange={(e) => handleRuleChange(index, 'operator', e.target.value)}
                            className="bg-gray-700 p-2 rounded-md border border-gray-600 text-white"
                        >
                            {operators.map(op => (
                                <option key={op} value={op}>{op}</option>
                            ))}
                        </select>
                        {(fieldType === 'string' || fieldType === 'string-array') && (
                            <input
                                type="text"
                                value={Array.isArray(rule.value) ? rule.value.join(', ') : rule.value}
                                onChange={(e) => handleRuleChange(index, 'value', fieldType === 'string-array' ? e.target.value.split(',').map(s => s.trim()) : e.target.value)}
                                placeholder={fieldType === 'string-array' ? 'Comma separated values' : 'Value'}
                                className="bg-gray-700 p-2 rounded-md border border-gray-600 text-white flex-grow"
                            />
                        )}
                        {fieldType === 'number' && (
                            <input
                                type="number"
                                value={rule.value}
                                onChange={(e) => handleRuleChange(index, 'value', parseFloat(e.target.value))}
                                className="bg-gray-700 p-2 rounded-md border border-gray-600 text-white"
                            />
                        )}
                        {fieldType === 'boolean' && (
                            <select
                                value={rule.value ? 'true' : 'false'}
                                onChange={(e) => handleRuleChange(index, 'value', e.target.value === 'true')}
                                className="bg-gray-700 p-2 rounded-md border border-gray-600 text-white"
                            >
                                <option value="true">True</option>
                                <option value="false">False</option>
                            </select>
                        )}
                        <button onClick={() => removeRule(index)} className="text-red-400 hover:text-red-300 ml-2">
                            <IconDelete />
                        </button>
                    </div>
                );
            })}
            <button onClick={addRule} className="px-3 py-1 bg-cyan-600 hover:bg-cyan-700 text-white rounded-md text-sm flex items-center space-x-1">
                <IconPlus /> <span>Add Rule</span>
            </button>
        </div>
    );
};

/**
 * @function ExportedAudienceSegmentForm
 * @description Form for creating and editing audience segments.
 */
export const ExportedAudienceSegmentForm: React.FC<{
    segment?: AudienceSegment;
    onSave: (segment: AudienceSegment) => void;
    onCancel: () => void;
    isLoading?: boolean;
}> = ({ segment, onSave, onCancel, isLoading }) => {
    const { contacts } = useMarketingAutomation();
    const [formData, setFormData] = useState<AudienceSegment>(
        segment || {
            id: '', name: '', description: '', rules: [], estimatedSize: 0,
            createdAt: new Date(), lastModified: new Date(),
        }
    );

    useEffect(() => {
        if (segment) setFormData(segment);
    }, [segment]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleRulesChange = (rules: { field: string; operator: string; value: any }[]) => {
        setFormData(prev => ({ ...prev, rules }));
    };

    const calculateEstimatedSize = useMemo(() => {
        // This is a simplified client-side estimation based on mock contacts
        // In a real app, this would be an API call or complex query.
        if (!contacts || contacts.length === 0 || formData.rules.length === 0) return 0;

        let matchedContacts = contacts;
        for (const rule of formData.rules) {
            matchedContacts = matchedContacts.filter(contact => {
                const contactValue = (contact as any)[rule.field]; // Access dynamically
                if (contactValue === undefined || rule.value === undefined) return false;

                switch (rule.operator) {
                    case 'equals': return contactValue === rule.value;
                    case 'greaterThan': return contactValue > rule.value;
                    case 'lessThan': return contactValue < rule.value;
                    case 'contains':
                        if (Array.isArray(contactValue)) return contactValue.includes(rule.value);
                        return String(contactValue).includes(String(rule.value));
                    case 'is': return contactValue === rule.value; // For booleans
                    default: return false;
                }
            });
        }
        return matchedContacts.length;
    }, [formData.rules, contacts]);

    useEffect(() => {
        setFormData(prev => ({ ...prev, estimatedSize: calculateEstimatedSize }));
    }, [calculateEstimatedSize]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 text-gray-300">
            <div>
                <label className="block text-sm font-medium text-gray-400">Segment Name</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} required
                    className="mt-1 block w-full bg-gray-700/50 p-2 border border-gray-600 rounded-md focus:ring-cyan-500 focus:border-cyan-500" />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-400">Description</label>
                <textarea name="description" value={formData.description} onChange={handleChange} rows={2}
                    className="mt-1 block w-full bg-gray-700/50 p-2 border border-gray-600 rounded-md focus:ring-cyan-500 focus:border-cyan-500"></textarea>
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-400">Rules</label>
                <ExportedSegmentRuleBuilder rules={formData.rules} onChange={handleRulesChange} />
            </div>
            <div className="bg-gray-700/50 p-3 rounded-md text-sm text-gray-300">
                Estimated Audience Size: <span className="font-semibold text-white">{formData.estimatedSize.toLocaleString()}</span> contacts
            </div>
            <div className="flex justify-end space-x-3 mt-6">
                <button type="button" onClick={onCancel} className="px-4 py-2 text-sm font-medium text-gray-300 rounded-md border border-gray-600 hover:bg-gray-700">Cancel</button>
                <button type="submit" disabled={isLoading} className="px-4 py-2 text-sm font-medium bg-cyan-600 text-white rounded-md hover:bg-cyan-700 disabled:opacity-50 disabled:cursor-not-allowed">
                    {isLoading ? 'Saving...' : (segment ? 'Update Segment' : 'Create Segment')}
                </button>
            </div>
        </form>
    );
};

/**
 * @function ExportedAudienceSegmentList
 * @description Displays a list of audience segments with CRUD actions.
 */
export const ExportedAudienceSegmentList: React.FC = () => {
    const { segments, loadingState, addOrUpdateSegment, deleteSegment } = useMarketingAutomation();
    const [isFormModalOpen, setFormModalOpen] = useState(false);
    const [selectedSegment, setSelectedSegment] = useState<AudienceSegment | undefined>(undefined);
    const [isSaving, setIsSaving] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize] = useState(10);
    const [sortKey, setSortKey] = useState('name');
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
    const [searchTerm, setSearchTerm] = useState('');

    const filteredAndSortedSegments = useMemo(() => {
        let sorted = [...segments];
        if (sortKey) {
            sorted.sort((a, b) => {
                const aVal = a[sortKey as keyof AudienceSegment];
                const bVal = b[sortKey as keyof AudienceSegment];

                if (typeof aVal === 'string' && typeof bVal === 'string') {
                    return sortDirection === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
                }
                if (typeof aVal === 'number' && typeof bVal === 'number') {
                    return sortDirection === 'asc' ? aVal - bVal : bVal - aVal;
                }
                if (aVal instanceof Date && bVal instanceof Date) {
                    return sortDirection === 'asc' ? aVal.getTime() - bVal.getTime() : bVal.getTime() - aVal.getTime();
                }
                return 0;
            });
        }

        if (searchTerm) {
            sorted = sorted.filter(s =>
                s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                s.description.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        return sorted;
    }, [segments, sortKey, sortDirection, searchTerm]);

    const paginatedSegments = useMemo(() => {
        const startIndex = (currentPage - 1) * pageSize;
        return filteredAndSortedSegments.slice(startIndex, startIndex + pageSize);
    }, [filteredAndSortedSegments, currentPage, pageSize]);

    const totalPages = Math.ceil(filteredAndSortedSegments.length / pageSize);
    const pagination: Pagination = { currentPage, totalPages, pageSize, totalItems: filteredAndSortedSegments.length };

    const handlePageChange = (page: number) => setCurrentPage(page);
    const handleSort = (key: string) => {
        if (key === sortKey) {
            setSortDirection(prev => (prev === 'asc' ? 'desc' : 'asc'));
        } else {
            setSortKey(key);
            setSortDirection('asc');
        }
    };

    const handleAddSegment = () => {
        setSelectedSegment(undefined);
        setFormModalOpen(true);
    };

    const handleEditSegment = (segment: AudienceSegment) => {
        setSelectedSegment(segment);
        setFormModalOpen(true);
    };

    const handleSaveSegment = async (segmentData: AudienceSegment) => {
        setIsSaving(true);
        try {
            await addOrUpdateSegment(segmentData);
            setFormModalOpen(false);
        } finally {
            setIsSaving(false);
        }
    };

    const handleDeleteSegment = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this segment?')) {
            await deleteSegment(id);
        }
    };

    const segmentColumns = useMemo(() => [
        { key: 'name', label: 'Name', sortable: true },
        { key: 'description', label: 'Description', render: (s: AudienceSegment) => s.description.substring(0, 50) + '...' },
        { key: 'rules', label: 'Rules', render: (s: AudienceSegment) => `${s.rules.length} rules` },
        { key: 'estimatedSize', label: 'Est. Size', sortable: true, render: (s: AudienceSegment) => s.estimatedSize.toLocaleString() },
        { key: 'lastModified', label: 'Last Modified', sortable: true, render: (s: AudienceSegment) => formatDate(s.lastModified) },
        {
            key: 'actions',
            label: 'Actions',
            render: (s: AudienceSegment) => (
                <div className="flex space-x-2">
                    <button onClick={() => handleEditSegment(s)} className="text-cyan-500 hover:text-cyan-400"><IconEdit /></button>
                    <button onClick={() => handleDeleteSegment(s.id)} className="text-red-500 hover:text-red-400"><IconDelete /></button>
                </div>
            )
        },
    ], []);

    return (
        <Card title="Audience Segments">
            <div className="mb-4 flex justify-between items-center">
                <input
                    type="text"
                    placeholder="Search segments..."
                    value={searchTerm}
                    onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                    className="p-2 rounded bg-gray-700/50 border border-gray-600 text-white placeholder-gray-400 focus:ring-cyan-500 focus:border-cyan-500"
                />
                <button onClick={handleAddSegment} className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg text-sm font-medium flex items-center space-x-2">
                    <IconPlus /> <span>Create New Segment</span>
                </button>
            </div>
            <ExportedTable
                data={paginatedSegments}
                columns={segmentColumns}
                keyField="id"
                pagination={pagination}
                onPageChange={handlePageChange}
                onSort={handleSort}
                currentSortKey={sortKey}
                sortDirection={sortDirection}
                isLoading={loadingState.segments}
            />

            <ExportedModal
                title={selectedSegment ? "Edit Audience Segment" : "Create New Audience Segment"}
                isOpen={isFormModalOpen}
                onClose={() => setFormModalOpen(false)}
                className="max-w-3xl"
            >
                <ExportedAudienceSegmentForm
                    segment={selectedSegment}
                    onSave={handleSaveSegment}
                    onCancel={() => setFormModalOpen(false)}
                    isLoading={isSaving}
                />
            </ExportedModal>
        </Card>
    );
};

const MarketingAutomationViewContent: React.FC = () => {
    const { campaigns, segments, workflows, emailCampaigns, socialPosts, abTests, contacts } = useMarketingAutomation();

    const [isCopyModalOpen, setCopyModalOpen] = useState(false);
    const [adCopy, setAdCopy] = useState('');
    const [isLoadingAI, setIsLoadingAI] = useState(false);

    const [activeTab, setActiveTab] = useState<'overview' | 'campaigns' | 'segments' | 'workflows' | 'emails' | 'social' | 'abtests' | 'contacts' | 'notifications' | 'audit'>('overview');
    
    const handleGenerateCopy = async (prompt: string) => {
        setIsLoadingAI(true); 
        setAdCopy('');
        try {
            // NOTE: In a real app, the API key should be handled securely on a backend.
            // This is for demonstration purposes only.
            const apiKey = process.env.REACT_APP_GEMINI_API_KEY;
            if (!apiKey) {
                setAdCopy('API key is not configured. Please set REACT_APP_GEMINI_API_KEY.');
                return;
            }
            const genAI = new GoogleGenerativeAI(apiKey);
            const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
            const result = await model.generateContent(prompt);
            const response = await result.response;
            setAdCopy(response.text());
        } catch (err) {
            console.error("AI Generation Error:", err);
            setAdCopy('Failed to generate copy. Check console for details (e.g., API key, network).');
        } finally {
            setIsLoadingAI(false);
        }
    };
    
    const kpiData = useMemo(() => {
        const totalLeads = campaigns.reduce((sum, c) => sum + (c.analytics?.conversions || 0), 0);
        const totalRevenue = campaigns.reduce((sum, c) => sum + c.revenueGenerated, 0);
        const totalCost = campaigns.reduce((sum, c) => sum + c.cost, 0);
        const roas = totalCost > 0 ? (totalRevenue / totalCost) : 0;
        return {
            leads: totalLeads,
            revenue: totalRevenue,
            cost: totalCost,
            roas: roas,
        };
    }, [campaigns]);

    const overviewCampaignChartData = useMemo(() => {
        const channelDataMap = new Map<string, { name: string; revenue: number; cost: number; leads: number }>();
        campaigns.forEach(c => {
            const channel = c.channel || 'Other';
            if (!channelDataMap.has(channel)) {
                channelDataMap.set(channel, { name: channel, revenue: 0, cost: 0, leads: 0 });
            }
            const current = channelDataMap.get(channel)!;
            current.revenue += c.revenueGenerated;
            current.cost += c.cost;
            current.leads += (c.analytics?.conversions || 0);
        });
        return Array.from(channelDataMap.values());
    }, [campaigns]);

    const PIE_COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF', '#FF19A0'];
    const statusPieData = useMemo(() => {
        const statusCounts = campaigns.reduce((acc, c) => {
            acc[c.status] = (acc[c.status] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);
        return Object.entries(statusCounts).map(([status, count]) => ({
            name: status,
            value: count,
        }));
    }, [campaigns]);

    const renderActiveTab = () => {
        switch (activeTab) {
            case 'overview':
                return (
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <Card><h4 className="text-gray-400">Total Leads</h4><p className="text-3xl font-bold text-white">{kpiData.leads.toLocaleString()}</p></Card>
                            <Card><h4 className="text-gray-400">Total Revenue</h4><p className="text-3xl font-bold text-white">{formatCurrency(kpiData.revenue)}</p></Card>
                            <Card><h4 className="text-gray-400">Total Cost</h4><p className="text-3xl font-bold text-white">{formatCurrency(kpiData.cost)}</p></Card>
                            <Card><h4 className="text-gray-400">Overall ROAS</h4><p className="text-3xl font-bold text-white">{kpiData.roas.toFixed(2)}x</p></Card>
                        </div>
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            <Card title="Performance by Channel" className="lg:col-span-2">
                                <ResponsiveContainer width="100%" height={300}>
                                    <BarChart data={overviewCampaignChartData}>
                                        <XAxis dataKey="name" stroke="#9ca3af" />
                                        <YAxis yAxisId="left" orientation="left" stroke="#82ca9d" />
                                        <YAxis yAxisId="right" orientation="right" stroke="#ef4444" />
                                        <Tooltip contentStyle={{ backgroundColor: 'rgba(31, 41, 55, 0.8)', borderColor: '#4b5563' }} />
                                        <Legend />
                                        <Bar yAxisId="left" dataKey="revenue" fill="#82ca9d" name="Revenue" />
                                        <Bar yAxisId="right" dataKey="cost" fill="#ef4444" name="Cost" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </Card>
                            <Card title="Campaign Status">
                                <ResponsiveContainer width="100%" height={300}>
                                    <PieChart>
                                        <Pie data={statusPieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} fill="#8884d8" label>
                                            {statusPieData.map((entry, index) => <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />)}
                                        </Pie>
                                        <Tooltip contentStyle={{ backgroundColor: 'rgba(31, 41, 55, 0.8)', borderColor: '#4b5563' }}/>
                                        <Legend />
                                    </PieChart>
                                </ResponsiveContainer>
                            </Card>
                        </div>
                    </div>
                );
            case 'campaigns': return <ExportedCampaignList />;
            case 'segments': return <ExportedAudienceSegmentList />;
            case 'workflows': return <ExportedWorkflowList />;
            case 'emails': return <div className="space-y-6"><ExportedEmailCampaignList /><ExportedEmailTemplateList /></div>;
            case 'social': return <ExportedSocialPostList />;
            case 'abtests': return <ExportedABTestList />;
            case 'contacts': return <ExportedContactList />;
            case 'notifications': return <ExportedNotificationCenter />;
            case 'audit': return <ExportedAuditLog />;
            default: return null;
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold text-white tracking-wider">Marketing Automation Dashboard</h2>
                <button onClick={() => setCopyModalOpen(true)} className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg text-sm font-medium flex items-center space-x-2">
                    <IconLightBulb /> <span>AI Content Generator</span>
                </button>
            </div>

            <div className="border-b border-gray-700 overflow-x-auto">
                <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                    {['overview', 'campaigns', 'segments', 'workflows', 'emails', 'social', 'abtests', 'contacts', 'notifications', 'audit'].map(tab => (
                        <button key={tab} onClick={() => setActiveTab(tab as any)} className={`capitalize whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm ${activeTab === tab ? 'border-cyan-500 text-cyan-400' : 'border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-500'}`}>
                            {tab.replace('abtests', 'A/B Tests')}
                        </button>
                    ))}
                </nav>
            </div>

            <div className="mt-6">
                {renderActiveTab()}
            </div>

            <ExportedModal
                title="AI Content Generator"
                isOpen={isCopyModalOpen}
                onClose={() => setCopyModalOpen(false)}
                className="max-w-3xl"
            >
                <ExportedAICopyGenerator
                    onGenerate={handleGenerateCopy}
                    isLoading={isLoadingAI}
                    adCopy={adCopy}
                />
            </ExportedModal>
        </div>
    );
};

const MarketingAutomationView: React.FC = () => {
    return (
        <MarketingAutomationProvider>
            <MarketingAutomationViewContent />
        </MarketingAutomationProvider>
    );
};

export default MarketingAutomationView;

================================================================================
// APPENDED FROM REPO: diplomat-bit/Fuckyou | ORIGINAL PATH: diplomat-bit-Fuckyou-70f83c5/components/views/megadashboard/business/MarketingAutomationView.tsx
================================================================================

// components/views/megadashboard/business/MarketingAutomationView.tsx
import React, { useContext, useMemo, useState } from 'react';
import Card from '../../../Card';
import { DataContext } from '../../../../context/DataContext';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { GoogleGenAI } from "@google/genai";

const MarketingAutomationView: React.FC = () => {
    const context = useContext(DataContext);
    if (!context) throw new Error("MarketingAutomationView must be within DataProvider");
    
    const { marketingCampaigns } = context;
    const [isCopyModalOpen, setCopyModalOpen] = useState(false);
    const [productDesc, setProductDesc] = useState("Our new AI-powered savings tool");
    const [adCopy, setAdCopy] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const kpiData = useMemo(() => ({
        leads: marketingCampaigns.reduce((sum, c) => sum + (c.revenueGenerated / 100), 0),
        conversionRate: (marketingCampaigns.reduce((sum, c) => sum + c.revenueGenerated, 0) / marketingCampaigns.reduce((sum, c) => sum + c.cost, 0)),
        cpc: marketingCampaigns.reduce((sum, c) => sum + c.cost, 0) / marketingCampaigns.reduce((sum, c) => sum + (c.revenueGenerated / 100), 0),
    }), [marketingCampaigns]);

    const handleGenerateCopy = async () => {
        setIsLoading(true); setAdCopy('');
        try {
            const ai = new GoogleGenAI({apiKey: process.env.API_KEY as string});
            const prompt = `Write 3 short, punchy ad copy headlines for this product: "${productDesc}"`;
            const response = await ai.models.generateContent({model: 'gemini-2.5-flash', contents: prompt});
            setAdCopy(response.text);
        } catch(err) { console.error(err); } finally { setIsLoading(false); }
    };

    return (
        <>
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <h2 className="text-3xl font-bold text-white tracking-wider">Marketing Automation</h2>
                    <button onClick={() => setCopyModalOpen(true)} className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg text-sm font-medium">AI Ad Copy Generator</button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card className="text-center"><p className="text-3xl font-bold text-white">{kpiData.leads.toLocaleString(undefined, {maximumFractionDigits: 0})}</p><p className="text-sm text-gray-400 mt-1">Leads Generated</p></Card>
                    <Card className="text-center"><p className="text-3xl font-bold text-white">{kpiData.conversionRate.toFixed(1)}x</p><p className="text-sm text-gray-400 mt-1">ROAS</p></Card>
                    <Card className="text-center"><p className="text-3xl font-bold text-white">${kpiData.cpc.toFixed(2)}</p><p className="text-sm text-gray-400 mt-1">Cost Per Lead</p></Card>
                </div>

                <Card title="Campaign Performance (Revenue Generated)">
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={marketingCampaigns}><XAxis dataKey="name" stroke="#9ca3af" /><YAxis stroke="#9ca3af" /><Tooltip contentStyle={{ backgroundColor: 'rgba(31, 41, 55, 0.8)', borderColor: '#4b5563' }}/><Legend /><Bar dataKey="revenueGenerated" fill="#82ca9d" name="Revenue" /><Bar dataKey="cost" fill="#ef4444" name="Cost" /></BarChart>
                    </ResponsiveContainer>
                </Card>
            </div>
             {isCopyModalOpen && (
                 <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50" onClick={() => setCopyModalOpen(false)}>
                    <div className="bg-gray-800 rounded-lg shadow-2xl max-w-lg w-full" onClick={e=>e.stopPropagation()}>
                        <div className="p-4 border-b border-gray-700"><h3 className="text-lg font-semibold text-white">AI Ad Copy Generator</h3></div>
                        <div className="p-6 space-y-4">
                            <input type="text" value={productDesc} onChange={e => setProductDesc(e.target.value)} className="w-full bg-gray-700/50 p-2 rounded" />
                            <button onClick={handleGenerateCopy} disabled={isLoading} className="w-full py-2 bg-cyan-600 rounded disabled:opacity-50">{isLoading ? 'Generating...' : 'Generate Copy'}</button>
                            {adCopy && <div className="p-3 bg-gray-900/50 rounded whitespace-pre-line text-sm">{adCopy}</div>}
                        </div>
                    </div>
                 </div>
            )}
        </>
    );
};

export default MarketingAutomationView;


================================================================================
// APPENDED FROM REPO: diplomat-bit/magic | ORIGINAL PATH: diplomat-bit-magic-a3f5ff1/components/views/megadashboard/business/MarketingAutomationView.tsx
================================================================================

// components/views/megadashboard/business/MarketingAutomationView.tsx
import React, { useContext, useMemo, useState } from 'react';
import Card from '../../../Card';
import { DataContext } from '../../../../context/DataContext';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { GoogleGenAI } from "@google/genai";

const MarketingAutomationView: React.FC = () => {
    const context = useContext(DataContext);
    if (!context) throw new Error("MarketingAutomationView must be within DataProvider");
    
    const { marketingCampaigns } = context;
    const [isCopyModalOpen, setCopyModalOpen] = useState(false);
    const [productDesc, setProductDesc] = useState("Our new AI-powered savings tool");
    const [adCopy, setAdCopy] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const kpiData = useMemo(() => ({
        leads: marketingCampaigns.reduce((sum, c) => sum + (c.revenueGenerated / 100), 0),
        conversionRate: (marketingCampaigns.reduce((sum, c) => sum + c.revenueGenerated, 0) / marketingCampaigns.reduce((sum, c) => sum + c.cost, 0)),
        cpc: marketingCampaigns.reduce((sum, c) => sum + c.cost, 0) / marketingCampaigns.reduce((sum, c) => sum + (c.revenueGenerated / 100), 0),
    }), [marketingCampaigns]);

    const handleGenerateCopy = async () => {
        setIsLoading(true); setAdCopy('');
        try {
            const ai = new GoogleGenAI({apiKey: process.env.API_KEY as string});
            const prompt = `Write 3 short, punchy ad copy headlines for this product: "${productDesc}"`;
            const response = await ai.models.generateContent({model: 'gemini-2.5-flash', contents: prompt});
            setAdCopy(response.text);
        } catch(err) { console.error(err); } finally { setIsLoading(false); }
    };

    return (
        <>
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <h2 className="text-3xl font-bold text-white tracking-wider">Marketing Automation</h2>
                    <button onClick={() => setCopyModalOpen(true)} className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg text-sm font-medium">AI Ad Copy Generator</button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card className="text-center"><p className="text-3xl font-bold text-white">{kpiData.leads.toLocaleString(undefined, {maximumFractionDigits: 0})}</p><p className="text-sm text-gray-400 mt-1">Leads Generated</p></Card>
                    <Card className="text-center"><p className="text-3xl font-bold text-white">{kpiData.conversionRate.toFixed(1)}x</p><p className="text-sm text-gray-400 mt-1">ROAS</p></Card>
                    <Card className="text-center"><p className="text-3xl font-bold text-white">${kpiData.cpc.toFixed(2)}</p><p className="text-sm text-gray-400 mt-1">Cost Per Lead</p></Card>
                </div>

                <Card title="Campaign Performance (Revenue Generated)">
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={marketingCampaigns}><XAxis dataKey="name" stroke="#9ca3af" /><YAxis stroke="#9ca3af" /><Tooltip contentStyle={{ backgroundColor: 'rgba(31, 41, 55, 0.8)', borderColor: '#4b5563' }}/><Legend /><Bar dataKey="revenueGenerated" fill="#82ca9d" name="Revenue" /><Bar dataKey="cost" fill="#ef4444" name="Cost" /></BarChart>
                    </ResponsiveContainer>
                </Card>
            </div>
             {isCopyModalOpen && (
                 <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50" onClick={() => setCopyModalOpen(false)}>
                    <div className="bg-gray-800 rounded-lg shadow-2xl max-w-lg w-full" onClick={e=>e.stopPropagation()}>
                        <div className="p-4 border-b border-gray-700"><h3 className="text-lg font-semibold text-white">AI Ad Copy Generator</h3></div>
                        <div className="p-6 space-y-4">
                            <input type="text" value={productDesc} onChange={e => setProductDesc(e.target.value)} className="w-full bg-gray-700/50 p-2 rounded" />
                            <button onClick={handleGenerateCopy} disabled={isLoading} className="w-full py-2 bg-cyan-600 rounded disabled:opacity-50">{isLoading ? 'Generating...' : 'Generate Copy'}</button>
                            {adCopy && <div className="p-3 bg-gray-900/50 rounded whitespace-pre-line text-sm">{adCopy}</div>}
                        </div>
                    </div>
                 </div>
            )}
        </>
    );
};

export default MarketingAutomationView;
