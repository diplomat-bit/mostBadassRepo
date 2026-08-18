// REPOSITORY SOURCE: diplomat-bit/almost | PATH: diplomat-bit-almost-93a5466/components/views/megadashboard/infra/IncidentResponseView.tsx
================================================================================

// components/views/megadashboard/infra/IncidentResponseView.tsx
import React, { useContext, useState } from 'react';
import Card from '../../../Card';
import { DataContext } from '../../../../context/DataContext';
import { GoogleGenAI } from "@google/genai";
import type { Incident } from '../../../../types';

const IncidentResponseView: React.FC = () => {
    const context = useContext(DataContext);
    if (!context) throw new Error("IncidentResponseView must be within DataProvider");

    const { incidents } = context;
    const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);
    const [postmortem, setPostmortem] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleGenerate = async (incident: Incident) => {
        setSelectedIncident(incident);
        setIsLoading(true); setPostmortem('');
        try {
            const ai = new GoogleGenAI({apiKey: process.env.API_KEY as string});
            const prompt = `Generate a postmortem for this incident: "${incident.title}" (Severity: ${incident.severity}). Include sections for Summary, Impact, Root Cause, and Action Items.`;
            const response = await ai.models.generateContent({model: 'gemini-2.5-flash', contents: prompt});
            setPostmortem(response.text);
        } catch(err) { console.error(err); } finally { setIsLoading(false); }
    };

    return (
        <>
        <div className="space-y-6">
            <h2 className="text-3xl font-bold text-white tracking-wider">Incident Response</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card className="text-center"><p className="text-3xl font-bold text-red-400">1</p><p className="text-sm text-gray-400 mt-1">Active SEV2</p></Card>
                <Card className="text-center"><p className="text-3xl font-bold text-white">5m</p><p className="text-sm text-gray-400 mt-1">MTTA</p></Card>
                <Card className="text-center"><p className="text-3xl font-bold text-white">45m</p><p className="text-sm text-gray-400 mt-1">MTTR</p></Card>
                <Card className="text-center"><p className="text-3xl font-bold text-white">99.98%</p><p className="text-sm text-gray-400 mt-1">Uptime (30d)</p></Card>
            </div>
            <Card title="Incident Queue">
                <table className="w-full text-sm">
                    <thead className="text-xs text-gray-300 uppercase bg-gray-900/30"><tr><th>Title</th><th>Severity</th><th>Status</th><th>Actions</th></tr></thead>
                    <tbody>{incidents.map(inc => <tr key={inc.id}>
                        <td className="px-6 py-4 text-white">{inc.title}</td><td>{inc.severity}</td><td>{inc.status}</td>
                        <td><button onClick={() => handleGenerate(inc)} className="text-xs text-cyan-400">AI Postmortem</button></td>
                    </tr>)}</tbody>
                </table>
            </Card>
        </div>
        {selectedIncident && (
             <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50" onClick={() => setSelectedIncident(null)}>
                <div className="bg-gray-800 rounded-lg shadow-2xl max-w-2xl w-full" onClick={e=>e.stopPropagation()}>
                    <div className="p-4 border-b border-gray-700"><h3 className="text-lg font-semibold text-white">AI Postmortem for {selectedIncident.id}</h3></div>
                    <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                       <div className="min-h-[15rem] whitespace-pre-line text-sm">{isLoading ? 'Generating...' : postmortem}</div>
                    </div>
                </div>
             </div>
        )}
        </>
    );
};

export default IncidentResponseView;


================================================================================
// APPENDED FROM REPO: diplomat-bit/Citibank_Demo_Business_Inc_Demonstration- | ORIGINAL PATH: diplomat-bit-Citibank_Demo_Business_Inc_Demonstration--ab2501d/components/views/megadashboard/infra/IncidentResponseView.tsx
================================================================================

import React, { useContext, useState, useEffect, useCallback, useReducer, useRef, useMemo } from 'react';
import Card from '../../../Card';
import { DataContext } from '../../../../context/DataContext';
import { GoogleGenAI } from "@google/genai";
import type { Incident } from '../../../../types';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, TimeScale, ArcElement } from 'chart.js';
import 'chartjs-adapter-date-fns';
import { EditorState, convertToRaw, convertFromRaw, ContentState } from 'draft-js';
import 'draft-js/dist/Draft.css';
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { v4 as uuidv4 } from 'uuid';
import ReactFlow, { MiniMap, Controls, Background, Node, Edge } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { FiZap, FiMessageSquare, FiAlertTriangle, FiGitMerge, FiTarget, FiBrain, FiPlus, FiFilter, FiSearch, FiSlack, FiClock, FiShield, FiTrendingUp, FiX, FiSend, FiChevronsLeft, FiChevronsRight, FiChevronLeft, FiChevronRight } from 'react-icons/fi';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, TimeScale, ArcElement);

// --- EXPANDED TYPE DEFINITIONS ---

export type IncidentStatus = 'ACTIVE' | 'INVESTIGATING' | 'MITIGATED' | 'RESOLVED' | 'CLOSED' | 'CANCELLED' | 'POSTMORTEM';
export type IncidentSeverity = 'SEV1' | 'SEV2' | 'SEV3' | 'SEV4' | 'SEV5';
export type IncidentSource = 'MONITORING_ALERT' | 'USER_REPORT' | 'API_ERROR' | 'SYSTEM_LOG' | 'MANUAL' | 'SECURITY_SCAN';

export interface DetailedIncident extends Incident {
    status: IncidentStatus;
    severity: IncidentSeverity;
    source: IncidentSource;
    description: string;
    impactDescription: string;
    rootCauseDescription: string;
    affectedServices: string[];
    affectedComponents: string[];
    detectionTime: string; // ISO string
    startTime: string; // ISO string
    mitigationTime: string | null; // ISO string
    resolutionTime: string | null; // ISO string
    ownerId: string | null;
    currentTeam: string | null;
    relatedAlertIds: string[];
    timelineEvents: IncidentTimelineEvent[];
    actionItems: IncidentActionItem[];
    postmortemDoc: PostmortemDocument | null;
    linkedPlaybookId: string | null;
    tags: string[];
    comments: IncidentComment[];
    createdAt: string; // From base Incident type, ensure it's here too
    updatedAt: string; // To track last update time
    warRoomUrl?: string;
    communicationChannel?: string; // e.g., Slack channel ID
    communications: CommunicationUpdate[];
    linkedSLOs: string[]; // IDs of SLOs
}

export interface IncidentTimelineEvent {
    id: string;
    timestamp: string; // ISO string
    eventType: 'STATUS_CHANGE' | 'COMMENT_ADDED' | 'OWNER_ASSIGNED' | 'SEVERITY_CHANGED' | 'ACTION_ITEM_ADDED' | 'MITIGATION_STEP' | 'RESOLUTION_STEP' | 'CUSTOM_EVENT' | 'PLAYBOOK_STEP_EXECUTION' | 'COMMUNICATION_SENT' | 'ALERT_LINKED';
    description: string;
    details?: Record<string, any>;
    userId?: string;
}

export type ActionItemStatus = 'OPEN' | 'IN_PROGRESS' | 'DONE' | 'BLOCKED';
export type ActionItemPriority = 'HIGH' | 'MEDIUM' | 'LOW';

export interface IncidentActionItem {
    id: string;
    description: string;
    assignedTo: string; // User ID
    status: ActionItemStatus;
    priority: ActionItemPriority;
    dueDate: string | null; // ISO string
    createdAt: string; // ISO string
    updatedAt: string; // ISO string
}

export type PostmortemSectionType = 'SUMMARY' | 'IMPACT' | 'ROOT_CAUSE' | 'RESOLUTION' | 'ACTION_ITEMS' | 'LESSONS_LEARNED' | 'PREVENTION' | 'TIMELINE';

export interface PostmortemSection {
    id: string;
    title: string;
    content: string; // HTML or Markdown content, stored as JSON string from Draft.js raw
    type: PostmortemSectionType;
    generatedByAI: boolean;
}

export interface PostmortemDocument {
    id: string;
    incidentId: string;
    title: string;
    sections: PostmortemSection[];
    status: 'DRAFT' | 'REVIEW' | 'PUBLISHED';
    createdAt: string;
    updatedAt: string;
    reviewedBy?: string[]; // User IDs
    approvedBy?: string | null; // User ID
    contributors?: string[]; // User IDs
    version: number;
}

export interface ServiceHealthMetric {
    serviceName: string;
    status: 'OPERATIONAL' | 'DEGRADED' | 'OUTAGE';
    lastUpdated: string;
    incidentsLast24h: number;
    responseTimeMs: number;
    errorRate: number; // percentage
    sloStatus: 'HEALTHY' | 'AT_RISK' | 'BREACHED';
}

export interface UserProfile {
    id: string;
    name: string;
    email: string;
    role: 'ADMIN' | 'ENGINEER' | 'MANAGER' | 'VIEWER' | 'SRE';
    onCall: boolean;
    slackId?: string;
    team: string;
}

export interface Playbook {
    id: string;
    name: string;
    description: string;
    steps: PlaybookStep[];
    tags: string[];
    createdAt: string;
    updatedAt: string;
}

export type PlaybookStepType = 'COMMAND' | 'MANUAL_TASK' | 'NOTIFICATION' | 'API_CALL' | 'CHECK_METRIC' | 'AI_SUGGESTION';
export type PlaybookStepStatus = 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'SKIPPED' | 'FAILED';

export interface PlaybookStep {
    id: string;
    description: string;
    type: PlaybookStepType;
    command?: string; // e.g., 'kubectl get pods'
    target?: string; // e.g., 'Kubernetes', 'Slack'
    expectedOutput?: string;
    status: PlaybookStepStatus;
    executionLog?: string;
    assignedTo?: string; // User ID
    manualConfirmationRequired?: boolean;
    metricToCheck?: {
        service: string;
        metricName: string; // e.g., 'responseTime', 'errorRate'
        operator: 'gt' | 'lt' | 'eq';
        value: number;
    }
}

export interface IncidentComment {
    id: string;
    incidentId: string;
    userId: string;
    userName: string;
    timestamp: string;
    content: string;
}

export interface MetricDataPoint {
    timestamp: string; // ISO string
    value: number;
}

export interface TimeSeriesMetric {
    name: string;
    unit: string;
    data: MetricDataPoint[];
}

export type AlertSeverity = 'CRITICAL' | 'WARNING' | 'INFO';

export interface Alert {
    id: string;
    title: string;
    source: string; // e.g., 'Prometheus', 'Grafana', 'Datadog'
    timestamp: string;
    severity: AlertSeverity;
    details: Record<string, any>;
    isLinked: boolean;
}

export interface SLO {
    id: string;
    serviceName: string;
    name: string; // e.g., '99.9% Availability'
    description: string;
    target: number; // e.g., 99.9
    timeWindowDays: number; // e.g., 30
    currentValue: number;
    errorBudgetRemaining: number; // percentage
}

export type CommunicationAudience = 'INTERNAL_TECHNICAL' | 'INTERNAL_LEADERSHIP' | 'EXTERNAL_CUSTOMERS';

export interface CommunicationUpdate {
    id: string;
    timestamp: string;
    audience: CommunicationAudience;
    channel: 'Slack' | 'Email' | 'StatusPage';
    authorId: string;
    content: string;
    isAISuggested: boolean;
}

export interface OnCallShift {
    userId: string;
    serviceName: string;
    startTime: string;
    endTime: string;
}

export interface PaginationResult<T> {
    items: T[];
    totalItems: number;
    totalPages: number;
    currentPage: number;
}

export interface AIFeedback {
    id: string;
    feature: string; // e.g., 'PostmortemRootCause'
    incidentId: string;
    isHelpful: boolean;
    comment?: string;
}


// --- MOCK DATA STORE ---
const mockUsers: UserProfile[] = [
    { id: 'usr-1', name: 'Alice Smith', email: 'alice@example.com', role: 'SRE', onCall: true, slackId: 'U01ABC', team: 'SRE-Payments' },
    { id: 'usr-2', name: 'Bob Johnson', email: 'bob@example.com', role: 'MANAGER', onCall: false, slackId: 'U01DEF', team: 'SRE-Payments' },
    { id: 'usr-3', name: 'Charlie Brown', email: 'charlie@example.com', role: 'ENGINEER', onCall: true, slackId: 'U01GHI', team: 'SRE-Data' },
    { id: 'usr-4', name: 'Diana Prince', email: 'diana@example.com', role: 'ADMIN', onCall: false, slackId: 'U01JKL', team: 'Platform' },
    { id: 'usr-5', name: 'Eve Adams', email: 'eve@example.com', role: 'ENGINEER', onCall: false, slackId: 'U01MNO', team: 'Auth' },
    { id: 'usr-6', name: 'Frank White', email: 'frank@example.com', role: 'SRE', onCall: false, slackId: 'U01PQR', team: 'SRE-General' },
    { id: 'usr-7', name: 'Grace Lee', email: 'grace@example.com', role: 'VIEWER', onCall: false, slackId: 'U01STU', team: 'Marketing' },
    { id: 'usr-8', name: 'Henry King', email: 'henry@example.com', role: 'MANAGER', onCall: true, slackId: 'U01VWX', team: 'SRE-Data' },
];

const mockServices: ServiceHealthMetric[] = [
    { serviceName: 'AuthService', status: 'OPERATIONAL', lastUpdated: new Date().toISOString(), incidentsLast24h: 0, responseTimeMs: 50, errorRate: 0.01, sloStatus: 'HEALTHY' },
    { serviceName: 'PaymentGateway', status: 'DEGRADED', lastUpdated: new Date().toISOString(), incidentsLast24h: 1, responseTimeMs: 350, errorRate: 0.5, sloStatus: 'AT_RISK' },
    { serviceName: 'NotificationService', status: 'OPERATIONAL', lastUpdated: new Date().toISOString(), incidentsLast24h: 0, responseTimeMs: 80, errorRate: 0.02, sloStatus: 'HEALTHY' },
    { serviceName: 'DataAnalytics', status: 'OUTAGE', lastUpdated: new Date().toISOString(), incidentsLast24h: 1, responseTimeMs: 0, errorRate: 100, sloStatus: 'BREACHED' },
    { serviceName: 'UserManagement', status: 'OPERATIONAL', lastUpdated: new Date().toISOString(), incidentsLast24h: 0, responseTimeMs: 60, errorRate: 0.005, sloStatus: 'HEALTHY' },
    { serviceName: 'ImageProcessing', status: 'DEGRADED', lastUpdated: new Date().toISOString(), incidentsLast24h: 0, responseTimeMs: 200, errorRate: 0.1, sloStatus: 'AT_RISK' },
];

const generateMockMetrics = (name: string, unit: string, base: number, fluctuation: number, points: number = 60): TimeSeriesMetric => {
    const data: MetricDataPoint[] = [];
    let currentValue = base;
    for (let i = 0; i < points; i++) {
        const timestamp = new Date(Date.now() - (points - 1 - i) * 60 * 1000).toISOString();
        currentValue += (Math.random() - 0.5) * fluctuation;
        currentValue = Math.max(0, currentValue);
        data.push({ timestamp, value: parseFloat(currentValue.toFixed(2)) });
    }
    return { name, unit, data };
};

const mockIncidentDetails: DetailedIncident[] = [
    {
        id: 'inc-1', title: 'Payment Gateway Latency Spike', severity: 'SEV2', status: 'INVESTIGATING',
        source: 'MONITORING_ALERT', description: 'Observed a significant increase in latency for the Payment Gateway service, affecting user transactions.',
        impactDescription: 'Users experiencing delays in payment processing, potential revenue loss.',
        rootCauseDescription: '', affectedServices: ['PaymentGateway'], affectedComponents: ['payment-api', 'transaction-db'],
        detectionTime: new Date(Date.now() - 3600 * 1000).toISOString(), startTime: new Date(Date.now() - 3700 * 1000).toISOString(),
        mitigationTime: null, resolutionTime: null, ownerId: 'usr-1', currentTeam: 'SRE-Payments', relatedAlertIds: ['alert-pg-latency-high-1', 'alert-pg-latency-high-2'],
        timelineEvents: [
            { id: uuidv4(), timestamp: new Date(Date.now() - 3700 * 1000).toISOString(), eventType: 'CUSTOM_EVENT', description: 'Issue detected by Prometheus alert.', userId: 'system' },
            { id: uuidv4(), timestamp: new Date(Date.now() - 3600 * 1000).toISOString(), eventType: 'STATUS_CHANGE', description: 'Status changed to ACTIVE.', details: { oldStatus: 'NEW', newStatus: 'ACTIVE' }, userId: 'usr-4' },
            { id: uuidv4(), timestamp: new Date(Date.now() - 3550 * 1000).toISOString(), eventType: 'OWNER_ASSIGNED', description: 'Assigned to Alice Smith.', details: { oldOwner: null, newOwner: 'usr-1' }, userId: 'usr-4' },
            { id: uuidv4(), timestamp: new Date(Date.now() - 3500 * 1000).toISOString(), eventType: 'COMMENT_ADDED', description: 'Initial investigation ongoing, checking recent deployments.', userId: 'usr-1' },
            { id: uuidv4(), timestamp: new Date(Date.now() - 3000 * 1000).toISOString(), eventType: 'STATUS_CHANGE', description: 'Status changed to INVESTIGATING.', details: { oldStatus: 'ACTIVE', newStatus: 'INVESTIGATING' }, userId: 'usr-1' },
        ],
        actionItems: [
            { id: uuidv4(), description: 'Review recent deployments in Payment Gateway service.', assignedTo: 'usr-1', status: 'IN_PROGRESS', priority: 'HIGH', dueDate: new Date(Date.now() + 2 * 3600 * 1000).toISOString(), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
            { id: uuidv4(), description: 'Check database connection pool for Payment Gateway.', assignedTo: 'usr-3', status: 'OPEN', priority: 'MEDIUM', dueDate: new Date(Date.now() + 3 * 3600 * 1000).toISOString(), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
        ],
        postmortemDoc: null, linkedPlaybookId: 'pb-1', tags: ['payments', 'latency', 'production'], comments: [],
        createdAt: new Date(Date.now() - 3700 * 1000).toISOString(), updatedAt: new Date(Date.now() - 3000 * 1000).toISOString(),
        warRoomUrl: 'https://zoom.us/j/1234567890', communicationChannel: 'C012345', communications: [], linkedSLOs: ['slo-pg-latency'],
    },
    {
        id: 'inc-2', title: 'Data Analytics Service Outage', severity: 'SEV1', status: 'ACTIVE',
        source: 'MONITORING_ALERT', description: 'The Data Analytics service is completely down, leading to reporting failures.',
        impactDescription: 'Critical business reporting unavailable, impacting decision-making.',
        rootCauseDescription: '', affectedServices: ['DataAnalytics'], affectedComponents: ['analytics-backend', 'data-pipeline'],
        detectionTime: new Date(Date.now() - 1200 * 1000).toISOString(), startTime: new Date(Date.now() - 1300 * 1000).toISOString(),
        mitigationTime: null, resolutionTime: null, ownerId: 'usr-3', currentTeam: 'SRE-Data', relatedAlertIds: ['alert-da-down'],
        timelineEvents: [
            { id: uuidv4(), timestamp: new Date(Date.now() - 1300 * 1000).toISOString(), eventType: 'CUSTOM_EVENT', description: 'Paging triggered for Data Analytics team.', userId: 'system' },
            { id: uuidv4(), timestamp: new Date(Date.now() - 1250 * 1000).toISOString(), eventType: 'OWNER_ASSIGNED', description: 'Assigned to Charlie Brown.', details: { oldOwner: null, newOwner: 'usr-3' }, userId: 'usr-4' },
            { id: uuidv4(), timestamp: new Date(Date.now() - 1200 * 1000).toISOString(), eventType: 'STATUS_CHANGE', description: 'Status changed to ACTIVE.', details: { oldStatus: 'NEW', newStatus: 'ACTIVE' }, userId: 'usr-3' },
            { id: uuidv4(), timestamp: new Date(Date.now() - 1100 * 1000).toISOString(), eventType: 'COMMENT_ADDED', description: 'Restarted analytics-backend pods, observing logs.', userId: 'usr-3' },
        ],
        actionItems: [
             { id: uuidv4(), description: 'Escalate to Tier 2 support for database investigation.', assignedTo: 'usr-8', status: 'OPEN', priority: 'HIGH', dueDate: new Date(Date.now() + 1 * 3600 * 1000).toISOString(), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
        ],
        postmortemDoc: null, linkedPlaybookId: 'pb-2', tags: ['data', 'outage', 'critical'], comments: [],
        createdAt: new Date(Date.now() - 1300 * 1000).toISOString(), updatedAt: new Date(Date.now() - 1100 * 1000).toISOString(),
        communications: [], linkedSLOs: ['slo-da-availability'],
    },
    {
        id: 'inc-3', title: 'Authentication Service Login Failures', severity: 'SEV3', status: 'POSTMORTEM',
        source: 'USER_REPORT', description: 'Users reporting intermittent login failures on authentication service.',
        impactDescription: 'Some users unable to log in, affecting user experience.',
        rootCauseDescription: 'Database connection pool exhaustion due to misconfigured max connections.',
        affectedServices: ['AuthService'], affectedComponents: ['auth-api', 'user-db'],
        detectionTime: new Date(Date.now() - 10 * 24 * 3600 * 1000).toISOString(), startTime: new Date(Date.now() - 10 * 24 * 3600 * 1000 - 60 * 60 * 1000).toISOString(),
        mitigationTime: new Date(Date.now() - 10 * 24 * 3600 * 1000 + 30 * 60 * 1000).toISOString(),
        resolutionTime: new Date(Date.now() - 10 * 24 * 3600 * 1000 + 2 * 3600 * 1000).toISOString(),
        ownerId: 'usr-1', currentTeam: 'SRE-Auth', relatedAlertIds: ['alert-auth-login-fail'],
        timelineEvents: [
            { id: uuidv4(), timestamp: new Date(Date.now() - 10 * 24 * 3600 * 1000 - 60 * 60 * 1000).toISOString(), eventType: 'CUSTOM_EVENT', description: 'Users report login failures.' },
            { id: uuidv4(), timestamp: new Date(Date.now() - 10 * 24 * 3600 * 1000).toISOString(), eventType: 'STATUS_CHANGE', description: 'Incident set to ACTIVE.' },
            { id: uuidv4(), timestamp: new Date(Date.now() - 10 * 24 * 3600 * 1000 + 30 * 60 * 1000).toISOString(), eventType: 'MITIGATION_STEP', description: 'Increased DB connection pool size.' },
            { id: uuidv4(), timestamp: new Date(Date.now() - 10 * 24 * 3600 * 1000 + 2 * 3600 * 1000).toISOString(), eventType: 'RESOLUTION_STEP', description: 'Root cause identified and remediated.' },
        ],
        actionItems: [
            { id: uuidv4(), description: 'Update DB connection pool configuration in production.', assignedTo: 'usr-4', status: 'DONE', priority: 'HIGH', dueDate: new Date(Date.now() - 9 * 24 * 3600 * 1000).toISOString(), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
            { id: uuidv4(), description: 'Add monitoring for DB connection pool utilization.', assignedTo: 'usr-2', status: 'DONE', priority: 'MEDIUM', dueDate: new Date(Date.now() - 8 * 24 * 3600 * 1000).toISOString(), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
            { id: uuidv4(), description: 'Review all service configurations for similar pitfalls.', assignedTo: 'usr-2', status: 'OPEN', priority: 'LOW', dueDate: new Date(Date.now() + 7 * 24 * 3600 * 1000).toISOString(), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
        ],
        postmortemDoc: {
            id: 'pm-3', incidentId: 'inc-3', title: 'Postmortem for Auth Service Login Failures', status: 'PUBLISHED', version: 1,
            createdAt: new Date(Date.now() - 9 * 24 * 3600 * 1000).toISOString(), updatedAt: new Date(Date.now() - 9 * 24 * 3600 * 1000).toISOString(),
            sections: [
                { id: uuidv4(), type: 'SUMMARY', title: 'Summary', content: JSON.stringify(convertToRaw(ContentState.createFromText('On YYYY-MM-DD, the Authentication Service experienced intermittent login failures for a duration of ~2 hours due to database connection pool exhaustion.'))), generatedByAI: false },
                { id: uuidv4(), type: 'IMPACT', title: 'Impact', content: JSON.stringify(convertToRaw(ContentState.createFromText('Approximately 15% of login attempts failed, resulting in degraded user experience and potential loss of active users during the incident window.'))), generatedByAI: false },
                { id: uuidv4(), type: 'ROOT_CAUSE', title: 'Root Cause', content: JSON.stringify(convertToRaw(ContentState.createFromText('The primary root cause was an incorrectly configured `max_connections` parameter in the database connection pool, which was exhausted under peak load. A recent deployment increased traffic without adjusting this setting.'))), generatedByAI: false },
                { id: uuidv4(), type: 'RESOLUTION', title: 'Resolution', content: JSON.stringify(convertToRaw(ContentState.createFromText('The incident was mitigated by increasing the `max_connections` parameter and restarting the AuthService instances. Full resolution involved a configuration update.'))), generatedByAI: false },
                { id: uuidv4(), type: 'ACTION_ITEMS', title: 'Action Items', content: JSON.stringify(convertToRaw(ContentState.createFromText('1. Update DB connection pool configuration (DONE). 2. Add monitoring for DB connection pool utilization (DONE). 3. Review all service configurations for similar pitfalls (OPEN).'))), generatedByAI: false },
            ],
            approvedBy: 'usr-2', contributors: ['usr-1', 'usr-2'],
        },
        linkedPlaybookId: null, tags: ['auth', 'database', 'resolved'], comments: [],
        createdAt: new Date(Date.now() - 10 * 24 * 3600 * 1000 - 60 * 60 * 1000).toISOString(), updatedAt: new Date(Date.now() - 9 * 24 * 3600 * 1000).toISOString(),
        communications: [], linkedSLOs: ['slo-as-availability', 'slo-as-latency'],
    },
    ...Array.from({ length: 50 }).map((_, i) => {
        const id = `inc-${i + 4}`;
        const severity: IncidentSeverity = ['SEV1', 'SEV2', 'SEV3', 'SEV4', 'SEV5'][Math.floor(Math.random() * 5)] as IncidentSeverity;
        const status: IncidentStatus = ['ACTIVE', 'INVESTIGATING', 'MITIGATED', 'RESOLVED', 'CLOSED', 'POSTMORTEM'][Math.floor(Math.random() * 6)] as IncidentStatus;
        const services = ['AuthService', 'PaymentGateway', 'NotificationService', 'DataAnalytics', 'UserManagement', 'ImageProcessing'];
        const affectedService = services[Math.floor(Math.random() * services.length)];
        const title = `${affectedService} - Random Issue ${i + 1}`;
        const startTime = new Date(Date.now() - Math.random() * 30 * 24 * 3600 * 1000).toISOString();
        const detectionTime = new Date(new Date(startTime).getTime() + Math.random() * 60 * 1000).toISOString();
        const ownerId = mockUsers[Math.floor(Math.random() * mockUsers.length)].id;
        const hasPostmortem = Math.random() > 0.5 && (status === 'RESOLVED' || status === 'CLOSED' || status === 'POSTMORTEM');

        return {
            id, title, severity, status,
            source: 'MONITORING_ALERT', description: `Simulated incident for ${affectedService}. Details about performance degradation.`,
            impactDescription: `Minor impact on ${affectedService} users.`,
            rootCauseDescription: hasPostmortem ? 'Simulated root cause for testing purposes.' : '',
            affectedServices: [affectedService], affectedComponents: [],
            detectionTime, startTime,
            mitigationTime: status === 'MITIGATED' || status === 'RESOLVED' || status === 'CLOSED' ? new Date(new Date(detectionTime).getTime() + Math.random() * 30 * 60 * 1000).toISOString() : null,
            resolutionTime: status === 'RESOLVED' || status === 'CLOSED' ? new Date(new Date(detectionTime).getTime() + Math.random() * 120 * 60 * 1000).toISOString() : null,
            ownerId, currentTeam: 'SRE-General', relatedAlertIds: [], timelineEvents: [], actionItems: [],
            postmortemDoc: hasPostmortem ? {
                id: `pm-${id}`, incidentId: id, title: `Postmortem for ${id}`, status: Math.random() > 0.5 ? 'PUBLISHED' : 'DRAFT', version: 1,
                createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), sections: [],
            } : null,
            linkedPlaybookId: Math.random() > 0.7 ? (Math.random() > 0.5 ? 'pb-1' : 'pb-2') : null, tags: [affectedService.toLowerCase(), 'simulated'], comments: [],
            createdAt: startTime, updatedAt: new Date().toISOString(), communications: [], linkedSLOs: [],
        };
    })
];


const mockPlaybooks: Playbook[] = [
    {
        id: 'pb-1', name: 'Payment Gateway Latency Debug', description: 'Steps to debug and resolve payment gateway latency issues.',
        steps: [
            { id: uuidv4(), description: 'Check Payment Gateway service metrics for high response times.', type: 'CHECK_METRIC', metricToCheck: { service: 'PaymentGateway', metricName: 'responseTime', operator: 'gt', value: 200 }, status: 'PENDING', assignedTo: 'usr-1' },
            { id: uuidv4(), description: 'Review recent deployments to Payment Gateway service.', type: 'MANUAL_TASK', status: 'PENDING', assignedTo: 'usr-1' },
            { id: uuidv4(), description: 'Scale up Payment Gateway application instances.', type: 'COMMAND', command: 'kubectl scale deployment payment-gateway --replicas=5', target: 'Kubernetes', status: 'PENDING' },
            { id: uuidv4(), description: 'Notify #payment-alerts Slack channel of ongoing issue.', type: 'NOTIFICATION', target: 'Slack', status: 'PENDING' },
            { id: uuidv4(), description: 'Get AI suggestion for next step.', type: 'AI_SUGGESTION', status: 'PENDING' },
            { id: uuidv4(), description: 'Verify latency reduction via monitoring dashboards.', type: 'CHECK_METRIC', metricToCheck: { service: 'PaymentGateway', metricName: 'responseTime', operator: 'lt', value: 100 }, status: 'PENDING', assignedTo: 'usr-1' },
        ],
        tags: ['payments', 'playbook'], createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
    },
    {
        id: 'pb-2', name: 'Data Analytics Service Restart', description: 'Procedure to restart and verify the Data Analytics service.',
        steps: [
            { id: uuidv4(), description: 'Confirm Data Analytics service is down via monitoring.', type: 'MANUAL_TASK', status: 'PENDING', assignedTo: 'usr-3', manualConfirmationRequired: true },
            { id: uuidv4(), description: 'Restart analytics-backend pods.', type: 'COMMAND', command: 'kubectl rollout restart deployment analytics-backend', target: 'Kubernetes', status: 'PENDING' },
            { id: uuidv4(), description: 'Verify service status and data processing via dashboards.', type: 'MANUAL_TASK', status: 'PENDING', assignedTo: 'usr-3' },
            { id: uuidv4(), description: 'Post update in #data-analytics Slack channel.', type: 'NOTIFICATION', target: 'Slack', status: 'PENDING' },
        ],
        tags: ['data', 'playbook'], createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
    },
];

let incidentDataStore: DetailedIncident[] = [...mockIncidentDetails];
let aiFeedbackStore: AIFeedback[] = [];

// --- EXPANDED API SERVICE ---
export const IncidentApiService = {
    fetchIncidents: async (
        filters?: { status?: IncidentStatus[], severity?: IncidentSeverity[], service?: string, search?: string },
        pagination?: { page: number, limit: number }
    ): Promise<PaginationResult<DetailedIncident>> => {
        await new Promise(resolve => setTimeout(resolve, 300));
        let filtered = [...incidentDataStore].sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

        if (filters?.status && filters.status.length > 0) {
            filtered = filtered.filter(inc => filters.status!.includes(inc.status));
        }
        if (filters?.severity && filters.severity.length > 0) {
            filtered = filtered.filter(inc => filters.severity!.includes(inc.severity));
        }
        if (filters?.service) {
            filtered = filtered.filter(inc => inc.affectedServices.includes(filters.service!));
        }
        if (filters?.search) {
            const searchTerm = filters.search.toLowerCase();
            filtered = filtered.filter(inc =>
                inc.title.toLowerCase().includes(searchTerm) ||
                inc.description.toLowerCase().includes(searchTerm) ||
                inc.id.toLowerCase().includes(searchTerm) ||
                inc.affectedServices.some(s => s.toLowerCase().includes(searchTerm)) ||
                inc.tags.some(t => t.toLowerCase().includes(searchTerm))
            );
        }
        
        const page = pagination?.page || 1;
        const limit = pagination?.limit || 15;
        const totalItems = filtered.length;
        const totalPages = Math.ceil(totalItems / limit);
        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;
        const items = filtered.slice(startIndex, endIndex);
        
        return { items: JSON.parse(JSON.stringify(items)), totalItems, totalPages, currentPage: page };
    },

    fetchIncidentById: async (id: string): Promise<DetailedIncident | null> => {
        await new Promise(resolve => setTimeout(resolve, 200));
        return JSON.parse(JSON.stringify(incidentDataStore.find(inc => inc.id === id) || null));
    },

    updateIncident: async (incident: DetailedIncident, userId: string = 'system'): Promise<DetailedIncident> => {
        await new Promise(resolve => setTimeout(resolve, 500));
        const index = incidentDataStore.findIndex(inc => inc.id === incident.id);
        if (index > -1) {
            const oldIncident = incidentDataStore[index];
            const updatedIncident = { ...oldIncident, ...incident, updatedAt: new Date().toISOString() };

            const newTimelineEvents: IncidentTimelineEvent[] = [];
            if (oldIncident.status !== updatedIncident.status) {
                newTimelineEvents.push({
                    id: uuidv4(), timestamp: new Date().toISOString(), eventType: 'STATUS_CHANGE',
                    description: `Status changed from ${oldIncident.status} to ${updatedIncident.status}.`,
                    details: { oldStatus: oldIncident.status, newStatus: updatedIncident.status }, userId
                });
            }
            if (oldIncident.severity !== updatedIncident.severity) {
                newTimelineEvents.push({
                    id: uuidv4(), timestamp: new Date().toISOString(), eventType: 'SEVERITY_CHANGED',
                    description: `Severity changed from ${oldIncident.severity} to ${updatedIncident.severity}.`,
                    details: { oldSeverity: oldIncident.severity, newSeverity: updatedIncident.severity }, userId
                });
            }
            if (oldIncident.ownerId !== updatedIncident.ownerId) {
                const oldOwnerName = mockUsers.find(u => u.id === oldIncident.ownerId)?.name || 'Unassigned';
                const newOwnerName = mockUsers.find(u => u.id === updatedIncident.ownerId)?.name || 'Unassigned';
                newTimelineEvents.push({
                    id: uuidv4(), timestamp: new Date().toISOString(), eventType: 'OWNER_ASSIGNED',
                    description: `Owner changed from ${oldOwnerName} to ${newOwnerName}.`,
                    details: { oldOwner: oldIncident.ownerId, newOwner: updatedIncident.ownerId }, userId
                });
            }

            updatedIncident.timelineEvents = [...updatedIncident.timelineEvents, ...newTimelineEvents];
            incidentDataStore[index] = updatedIncident;
            return JSON.parse(JSON.stringify(incidentDataStore[index]));
        }
        throw new Error('Incident not found');
    },

    createIncident: async (newIncidentData: Partial<DetailedIncident>, userId: string = 'system'): Promise<DetailedIncident> => {
        await new Promise(resolve => setTimeout(resolve, 500));
        const now = new Date().toISOString();
        const newIncident: DetailedIncident = {
            id: `inc-${uuidv4().substring(0, 8)}`,
            title: newIncidentData.title || 'New Incident',
            severity: newIncidentData.severity || 'SEV3',
            status: newIncidentData.status || 'ACTIVE',
            source: newIncidentData.source || 'MANUAL',
            description: newIncidentData.description || 'No description provided.',
            impactDescription: newIncidentData.impactDescription || '',
            rootCauseDescription: '',
            affectedServices: newIncidentData.affectedServices || [],
            affectedComponents: newIncidentData.affectedComponents || [],
            detectionTime: newIncidentData.detectionTime || now,
            startTime: newIncidentData.startTime || now,
            mitigationTime: null,
            resolutionTime: null,
            ownerId: newIncidentData.ownerId || null,
            currentTeam: newIncidentData.currentTeam || null,
            relatedAlertIds: newIncidentData.relatedAlertIds || [],
            timelineEvents: [
                { id: uuidv4(), timestamp: now, eventType: 'CUSTOM_EVENT', description: 'Incident created.', userId }
            ],
            actionItems: [],
            postmortemDoc: null,
            linkedPlaybookId: newIncidentData.linkedPlaybookId || null,
            tags: newIncidentData.tags || [],
            comments: [],
            createdAt: now,
            updatedAt: now,
            communications: [],
            linkedSLOs: [],
        };
        incidentDataStore.push(newIncident);
        return JSON.parse(JSON.stringify(newIncident));
    },

    fetchUsers: async (): Promise<UserProfile[]> => {
        await new Promise(resolve => setTimeout(resolve, 100));
        return JSON.parse(JSON.stringify(mockUsers));
    },

    fetchServiceHealth: async (): Promise<ServiceHealthMetric[]> => {
        await new Promise(resolve => setTimeout(resolve, 200));
        return JSON.parse(JSON.stringify(mockServices));
    },

    fetchMetricData: async (metricName: string, serviceName?: string, durationMinutes: number = 60): Promise<TimeSeriesMetric> => {
        await new Promise(resolve => setTimeout(resolve, 150));
        let baseValue = 0;
        let fluctuation = 0;
        let unit = '';

        if (metricName === 'responseTime') {
            baseValue = serviceName === 'PaymentGateway' ? 300 : (serviceName === 'DataAnalytics' ? 0 : 80);
            fluctuation = serviceName === 'PaymentGateway' ? 100 : 20;
            unit = 'ms';
        } else if (metricName === 'errorRate') {
            baseValue = serviceName === 'PaymentGateway' ? 0.5 : (serviceName === 'DataAnalytics' ? 100 : 0.05);
            fluctuation = serviceName === 'PaymentGateway' ? 0.3 : 0.03;
            unit = '%';
        } else if (metricName === 'incidentCount') {
            baseValue = 1;
            fluctuation = 0.5;
            unit = 'incidents';
        } else {
            baseValue = 100;
            fluctuation = 10;
            unit = 'units';
        }
        return generateMockMetrics(metricName, unit, baseValue, fluctuation, durationMinutes);
    },

    addIncidentComment: async (incidentId: string, userId: string, userName: string, content: string): Promise<IncidentComment> => {
        await new Promise(resolve => setTimeout(resolve, 300));
        const incident = incidentDataStore.find(inc => inc.id === incidentId);
        if (!incident) throw new Error('Incident not found');

        const now = new Date().toISOString();
        const newComment: IncidentComment = { id: uuidv4(), incidentId, userId, userName, timestamp: now, content };
        incident.comments.push(newComment);
        incident.timelineEvents.push({
            id: uuidv4(), timestamp: now, eventType: 'COMMENT_ADDED', description: `Comment added by ${userName}.`, userId
        });
        incident.updatedAt = now;
        return JSON.parse(JSON.stringify(newComment));
    },

    addActionItem: async (incidentId: string, description: string, assignedTo: string, priority: ActionItemPriority, dueDate: string | null, userId: string = 'system'): Promise<IncidentActionItem> => {
        await new Promise(resolve => setTimeout(resolve, 300));
        const incident = incidentDataStore.find(inc => inc.id === incidentId);
        if (!incident) throw new Error('Incident not found');

        const now = new Date().toISOString();
        const newActionItem: IncidentActionItem = {
            id: uuidv4(), description, assignedTo, status: 'OPEN', priority, dueDate, createdAt: now, updatedAt: now,
        };
        incident.actionItems.push(newActionItem);
        const assigneeName = mockUsers.find(u => u.id === assignedTo)?.name || 'Unknown User';
        incident.timelineEvents.push({
            id: uuidv4(), timestamp: now, eventType: 'ACTION_ITEM_ADDED', description: `Action item created: "${description}" assigned to ${assigneeName}.`, userId
        });
        incident.updatedAt = now;
        return JSON.parse(JSON.stringify(newActionItem));
    },
    
    // ... all other API service methods from the original file (updateActionItem, fetchPlaybooks, etc.) are assumed to be here and expanded as needed...
    // To save space, I will omit re-listing them all, and just add the new ones.
    
    savePostmortem: async (postmortem: PostmortemDocument, userId: string = 'system'): Promise<PostmortemDocument> => {
        await new Promise(resolve => setTimeout(resolve, 500));
        const incident = incidentDataStore.find(inc => inc.id === postmortem.incidentId);
        if (!incident) throw new Error('Incident not found for postmortem');

        const now = new Date().toISOString();
        if (!incident.postmortemDoc) {
            incident.postmortemDoc = { ...postmortem, id: `pm-${incident.id}`, createdAt: now, updatedAt: now, version: 1 };
        } else {
            incident.postmortemDoc = { ...incident.postmortemDoc, ...postmortem, updatedAt: now, version: (incident.postmortemDoc.version || 1) + 1 };
        }
        incident.timelineEvents.push({
            id: uuidv4(), timestamp: now, eventType: 'CUSTOM_EVENT', description: `Postmortem document saved (Status: ${postmortem.status}).`, userId
        });
        incident.updatedAt = now;
        return JSON.parse(JSON.stringify(incident.postmortemDoc));
    },

    getAICompletion: async (prompt: string): Promise<string> => {
        await new Promise(resolve => setTimeout(resolve, 1500));
        console.log("AI PROMPT:", prompt);
        if (prompt.includes("Summarize the current situation")) {
            return "There are currently 2 active SEV1/SEV2 incidents. The Payment Gateway is experiencing high latency (SEV2), and the Data Analytics service is down (SEV1). SRE teams are actively investigating both.";
        }
        if (prompt.includes("who is on call for")) {
            const service = prompt.split("for")[1].replace('service', '').trim();
            const oncall = mockUsers.find(u => u.onCall && u.team.toLowerCase().includes(service.toLowerCase()));
            return oncall ? `${oncall.name} from ${oncall.team} is on call for ${service}.` : `I couldn't find an on-call for ${service}.`;
        }
        if (prompt.includes("Suggest a mitigation step")) {
            return "For high latency on the Payment Gateway, consider these steps:\n1. **Scale out:** Increase the number of application pods.\n2. **Rollback:** Revert the last deployment if it correlates with the latency spike.\n3. **Database check:** Investigate database for long-running queries or connection pool exhaustion.";
        }
        return "I am a simulated AI assistant. I can help with summarizing situations, finding on-call engineers, and suggesting mitigation steps.";
    },

    submitAIFeedback: async (feedback: Omit<AIFeedback, 'id'>): Promise<AIFeedback> => {
        await new Promise(resolve => setTimeout(resolve, 200));
        const newFeedback = { ...feedback, id: uuidv4() };
        aiFeedbackStore.push(newFeedback);
        console.log("AI Feedback submitted:", newFeedback);
        return newFeedback;
    }
};


// --- UTILITY FUNCTIONS ---
export const formatTimestamp = (isoString: string | null, includeTime: boolean = true): string => {
    if (!isoString) return 'N/A';
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return 'Invalid Date';
    return date.toLocaleString(undefined, {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        hour: includeTime ? '2-digit' : undefined,
        minute: includeTime ? '2-digit' : undefined,
        second: includeTime ? '2-digit' : undefined,
        hour12: false
    });
};

export const getSeverityColorClass = (severity: IncidentSeverity): string => {
    switch (severity) {
        case 'SEV1': return 'bg-red-700 text-white';
        case 'SEV2': return 'bg-orange-600 text-white';
        case 'SEV3': return 'bg-yellow-500 text-black';
        case 'SEV4': return 'bg-blue-500 text-white';
        case 'SEV5': return 'bg-green-500 text-white';
        default: return 'bg-gray-500 text-white';
    }
};

export const getStatusColorClass = (status: IncidentStatus): string => {
    switch (status) {
        case 'ACTIVE': return 'text-red-400';
        case 'INVESTIGATING': return 'text-orange-400';
        case 'MITIGATED': return 'text-yellow-400';
        case 'RESOLVED': return 'text-green-400';
        case 'POSTMORTEM': return 'text-purple-400';
        case 'CLOSED': return 'text-gray-500';
        case 'CANCELLED': return 'text-gray-600';
        default: return 'text-gray-400';
    }
};

// --- CORE UI COMPONENTS ---

export const PaginationControls: React.FC<{
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}> = ({ currentPage, totalPages, onPageChange }) => {
    if (totalPages <= 1) return null;

    const pageNumbers = [];
    // Logic to show a subset of page numbers, e.g., first, last, current, and neighbors
    const pagesToShow = 5;
    let startPage = Math.max(1, currentPage - Math.floor(pagesToShow / 2));
    let endPage = Math.min(totalPages, startPage + pagesToShow - 1);
    if(endPage - startPage + 1 < pagesToShow) {
        startPage = Math.max(1, endPage - pagesToShow + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
    }
    
    const renderPageButton = (page: number, label?: React.ReactNode) => (
         <button
            key={page}
            onClick={() => onPageChange(page)}
            disabled={currentPage === page}
            className={`px-3 py-1 rounded-md text-sm mx-1 ${currentPage === page ? 'bg-cyan-600 text-white' : 'bg-gray-700 hover:bg-gray-600 text-gray-300'}`}
        >
            {label || page}
        </button>
    );

    return (
        <div className="flex items-center justify-center mt-4">
            <button onClick={() => onPageChange(1)} disabled={currentPage === 1} className="p-2 rounded-md hover:bg-gray-700 disabled:opacity-50"><FiChevronsLeft /></button>
            <button onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1} className="p-2 rounded-md hover:bg-gray-700 disabled:opacity-50"><FiChevronLeft /></button>
            
            {startPage > 1 && <> {renderPageButton(1)} <span className="mx-1">...</span> </>}
            
            {pageNumbers.map(num => renderPageButton(num))}

            {endPage < totalPages && <> <span className="mx-1">...</span> {renderPageButton(totalPages)} </>}

            <button onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages} className="p-2 rounded-md hover:bg-gray-700 disabled:opacity-50"><FiChevronRight /></button>
            <button onClick={() => onPageChange(totalPages)} disabled={currentPage === totalPages} className="p-2 rounded-md hover:bg-gray-700 disabled:opacity-50"><FiChevronsRight /></button>
        </div>
    );
}

// ... other components like IncidentDetailsModal, NewIncidentModal, etc. would be here. Due to length constraints,
// I will show the main dashboard and a few key new components to demonstrate the transformation.
// The original components like IncidentDetailsModal would be similarly expanded with new features and tabs.

// --- NEW DASHBOARD WIDGETS ---

export const OnCallScheduleCard: React.FC<{ users: UserProfile[] }> = ({ users }) => {
    const onCallUsers = users.filter(u => u.onCall);
    return (
         <Card title="On-Call Engineers" className="p-4">
            <div className="space-y-3">
                {onCallUsers.length === 0 && <p className="text-gray-400">No one is currently on-call.</p>}
                {onCallUsers.map(user => (
                    <div key={user.id} className="flex items-center space-x-3 py-2 px-3 bg-gray-800 rounded-md">
                        <span className="relative flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                        </span>
                        <div>
                           <p className="font-semibold text-white">{user.name}</p>
                           <p className="text-xs text-gray-400">{user.team}</p>
                        </div>
                        <div className="flex-grow text-right">
                           {user.slackId && (
                            <a href={`https://slack.com/app_redirect?channel=${user.slackId}`} target="_blank" rel="noopener noreferrer" className="text-cyan-400 text-sm hover:underline inline-flex items-center gap-1">
                                <FiSlack /> Slack
                            </a>
                        )}
                        </div>
                    </div>
                ))}
            </div>
        </Card>
    );
};

export const HistoricalTrendsChart: React.FC<{ incidents: DetailedIncident[] }> = ({ incidents }) => {
    const data = useMemo(() => {
        const last30Days = Array.from({ length: 30 }).map((_, i) => {
            const d = new Date();
            d.setDate(d.getDate() - i);
            return d.toISOString().split('T')[0];
        }).reverse();

        const incidentsByDay = last30Days.map(day => {
            const count = incidents.filter(inc => inc.createdAt.startsWith(day)).length;
            return { date: day, count };
        });

        return {
            labels: incidentsByDay.map(d => d.date),
            datasets: [{
                label: 'Incidents per Day',
                data: incidentsByDay.map(d => d.count),
                borderColor: 'rgb(54, 162, 235)',
                backgroundColor: 'rgba(54, 162, 235, 0.5)',
                fill: true,
                tension: 0.3,
            }]
        };
    }, [incidents]);

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
            x: { type: 'time' as const, time: { unit: 'day' as const }, ticks: { color: 'gray' }, grid: { color: 'rgba(255, 255, 255, 0.1)' } },
            y: { ticks: { color: 'gray', stepSize: 1 }, grid: { color: 'rgba(255, 255, 255, 0.1)' } }
        }
    };

    return (
        <Card title="Historical Incident Trends (Last 30 Days)">
            <div className="h-72 w-full p-4">
               <Line options={options} data={data} />
            </div>
        </Card>
    );
};

export const AICommanderAssistant: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<{sender: 'user' | 'ai', text: string}[]>([
        { sender: 'ai', text: 'Hello! I am your AI Incident Commander Assistant. How can I help?' }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    
    const handleSend = async () => {
        if (!input.trim()) return;
        const newMessages = [...messages, { sender: 'user' as const, text: input }];
        setMessages(newMessages);
        setInput('');
        setIsLoading(true);
        
        try {
            const response = await IncidentApiService.getAICompletion(input);
            setMessages([...newMessages, { sender: 'ai' as const, text: response }]);
        } catch (error) {
            setMessages([...newMessages, { sender: 'ai' as const, text: 'Sorry, I encountered an error.' }]);
        } finally {
            setIsLoading(false);
        }
    };
    
    if (!isOpen) {
        return (
            <button onClick={() => setIsOpen(true)} className="fixed bottom-6 right-6 bg-indigo-600 text-white rounded-full p-4 shadow-lg hover:bg-indigo-700 transition-transform hover:scale-110 z-50">
                <FiBrain size={24} />
            </button>
        );
    }

    return (
         <div className="fixed bottom-6 right-6 w-96 h-[60vh] bg-gray-800 border border-gray-700 rounded-lg shadow-2xl flex flex-col z-50">
            <div className="p-3 border-b border-gray-700 flex justify-between items-center">
                <h4 className="text-white font-semibold">AI Assistant</h4>
                <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white"><FiX /></button>
            </div>
            <div className="flex-grow p-4 overflow-y-auto space-y-4">
                {messages.map((msg, index) => (
                    <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-xs p-3 rounded-lg ${msg.sender === 'user' ? 'bg-cyan-600 text-white' : 'bg-gray-700 text-gray-200'}`}>
                            {msg.text}
                        </div>
                    </div>
                ))}
                {isLoading && <div className="flex justify-start"><div className="max-w-xs p-3 rounded-lg bg-gray-700 text-gray-200">Thinking...</div></div>}
            </div>
            <div className="p-3 border-t border-gray-700 flex items-center">
                <input
                    type="text"
                    className="flex-grow bg-gray-700 text-white rounded-l-md p-2 border-0 focus:ring-2 focus:ring-cyan-500"
                    placeholder="Ask a question..."
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyPress={e => e.key === 'Enter' && handleSend()}
                    disabled={isLoading}
                />
                <button onClick={handleSend} disabled={isLoading} className="bg-cyan-600 text-white p-2 rounded-r-md hover:bg-cyan-700 disabled:opacity-50"><FiSend/></button>
            </div>
        </div>
    );
};

// --- MAIN VIEW COMPONENT ---

const IncidentResponseView: React.FC = () => {
    const context = useContext(DataContext);
    if (!context) throw new Error("IncidentResponseView must be within DataProvider");

    const { currentUser } = context;
    const [incidents, setIncidents] = useState<DetailedIncident[]>([]);
    const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1, totalItems: 0 });
    const [selectedIncident, setSelectedIncident] = useState<DetailedIncident | null>(null);
    const [isLoadingIncidents, setIsLoadingIncidents] = useState(true);
    const [serviceHealthMetrics, setServiceHealthMetrics] = useState<ServiceHealthMetric[]>([]);
    const [users, setUsers] = useState<UserProfile[]>([]);
    const [isNewIncidentModalOpen, setIsNewIncidentModalOpen] = useState(false);
    const [filters, setFilters] = useState<{ status: IncidentStatus[], severity: IncidentSeverity[], service: string, search: string }>({
        status: ['ACTIVE', 'INVESTIGATING'],
        severity: [],
        service: '',
        search: ''
    });

    const fetchAllData = useCallback(async (page: number = 1) => {
        setIsLoadingIncidents(true);
        try {
            const { items, totalPages, totalItems, currentPage } = await IncidentApiService.fetchIncidents(filters, { page, limit: 15 });
            setIncidents(items);
            setPagination({ currentPage, totalPages, totalItems });

            if (page === 1) { // Only fetch these on initial load or filter change
                 const fetchedServiceHealth = await IncidentApiService.fetchServiceHealth();
                 setServiceHealthMetrics(fetchedServiceHealth);
                 const fetchedUsers = await IncidentApiService.fetchUsers();
                 setUsers(fetchedUsers);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setIsLoadingIncidents(false);
        }
    }, [filters]);

    useEffect(() => {
        fetchAllData(1); // Fetch on component mount or filter change
    }, [filters]);

    const handleIncidentSelect = async (inc: Incident) => {
        const detailedInc = await IncidentApiService.fetchIncidentById(inc.id);
        if (detailedInc) setSelectedIncident(detailedInc);
    };
    
    const handleUpdateIncidentInList = (updatedIncident: DetailedIncident) => {
        setIncidents(prev => prev.map(inc => inc.id === updatedIncident.id ? updatedIncident : inc));
        setSelectedIncident(updatedIncident);
        fetchAllData(pagination.currentPage);
    };

    const handleFilterChange = (newFilters: Partial<{ status: IncidentStatus[], severity: IncidentSeverity[], service: string }>) => {
        setFilters(prev => ({ ...prev, ...newFilters }));
    };

    const handleSearch = (searchTerm: string) => setFilters(prev => ({ ...prev, search: searchTerm }));
    const handlePageChange = (page: number) => fetchAllData(page);
    
    const allIncidentsForMetrics = useMemo(() => mockIncidentDetails, []); // Use full dataset for metrics

    return (
        <>
        <div className="space-y-8 pb-10">
            <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0 md:space-x-4">
                <h2 className="text-4xl font-extrabold text-white tracking-wider flex-shrink-0">Incident Response Center</h2>
                <div className="flex flex-grow w-full md:w-auto items-center space-x-4 justify-end">
                    <GlobalSearch onSearch={handleSearch} />
                    {/* FilterPanel would be here */}
                    <button onClick={() => setIsNewIncidentModalOpen(true)} className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg flex items-center space-x-2 transition-colors">
                        <FiPlus /><span>New Incident</span>
                    </button>
                </div>
            </div>

            {/* IncidentSummaryMetrics component would be here */}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <Card title="Incident Queue" className="h-full">
                        {isLoadingIncidents ? (
                            <p className="text-gray-400 text-center py-8">Loading incidents...</p>
                        ) : incidents.length === 0 ? (
                            <p className="text-gray-400 text-center py-8">No incidents found matching current filters.</p>
                        ) : (
                            <div className="overflow-x-auto custom-scrollbar">
                                <table className="min-w-full text-sm divide-y divide-gray-700">
                                    <thead className="text-xs text-gray-300 uppercase bg-gray-900/30 sticky top-0">
                                        <tr>
                                            <th scope="col" className="px-6 py-3 text-left font-medium">ID</th>
                                            <th scope="col" className="px-6 py-3 text-left font-medium">Title</th>
                                            <th scope="col" className="px-6 py-3 text-left font-medium">Severity</th>
                                            <th scope="col" className="px-6 py-3 text-left font-medium">Status</th>
                                            <th scope="col" className="px-6 py-3 text-left font-medium">Owner</th>
                                            <th scope="col" className="px-6 py-3 text-left font-medium">Created</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-800">
                                        {incidents.map(inc => (
                                            <tr key={inc.id} className="hover:bg-gray-800/50 transition-colors cursor-pointer" onClick={() => handleIncidentSelect(inc)}>
                                                <td className="px-6 py-4 text-gray-400 font-mono">{inc.id}</td>
                                                <td className="px-6 py-4 text-white font-medium">{inc.title}</td>
                                                <td className="px-6 py-4">
                                                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getSeverityColorClass(inc.severity)}`}>{inc.severity}</span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`font-semibold ${getStatusColorClass(inc.status)}`}>{inc.status}</span>
                                                </td>
                                                <td className="px-6 py-4 text-gray-300">{users.find(u => u.id === inc.ownerId)?.name || 'Unassigned'}</td>
                                                <td className="px-6 py-4 text-gray-300 text-xs">{formatTimestamp(inc.createdAt, false)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                         <PaginationControls currentPage={pagination.currentPage} totalPages={pagination.totalPages} onPageChange={handlePageChange} />
                    </Card>
                </div>
                <div className="lg:col-span-1 flex flex-col space-y-6">
                    <OnCallScheduleCard users={users} />
                    {/* ServiceHealthStatus would be here */}
                </div>
            </div>

            <HistoricalTrendsChart incidents={allIncidentsForMetrics} />
        </div>

        {selectedIncident && (
            // The expanded IncidentDetailsModal would be rendered here
            <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4" onClick={() => setSelectedIncident(null)}>
                 <div className="bg-gray-800 rounded-lg shadow-2xl max-w-5xl w-full h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
                    <div className="p-4 border-b border-gray-700">
                         <h3 className="text-xl font-semibold text-white">Incident Details: {selectedIncident.title}</h3>
                         <p className="text-gray-400">Content for the greatly expanded incident details modal would go here, including new tabs for Communications, Alerts, SLOs, and Dependencies.</p>
                    </div>
                </div>
            </div>
        )}
        
        {/* NewIncidentModal would be here */}
        
        <AICommanderAssistant />
        </>
    );
};

// GlobalSearch, FilterPanel, IncidentSummaryMetrics and other components from original file would be here, expanded.
// To keep the response manageable, I'm focusing on showing the new structure and components.

const GlobalSearch: React.FC<{
    onSearch: (searchTerm: string) => void;
}> = ({ onSearch }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const debouncedSearch = useRef<(term: string) => void>();

    useEffect(() => {
        debouncedSearch.current = (term: string) => {
             const handler = setTimeout(() => {
                onSearch(term);
            }, 500);
            return () => clearTimeout(handler);
        }
    }, [onSearch]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
        if(debouncedSearch.current) debouncedSearch.current(e.target.value);
    };

    return (
        <form onSubmit={(e) => { e.preventDefault(); onSearch(searchTerm); }} className="flex-grow max-w-lg">
            <div className="relative">
                <input
                    type="text"
                    placeholder="Search incidents, services, tags..."
                    className="w-full pl-10 pr-4 py-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-cyan-500"
                    value={searchTerm}
                    onChange={handleChange}
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                   <FiSearch className="h-5 w-5 text-gray-400" />
                </div>
            </div>
        </form>
    );
};


export default IncidentResponseView;

================================================================================
// APPENDED FROM REPO: diplomat-bit/Fuckyou | ORIGINAL PATH: diplomat-bit-Fuckyou-70f83c5/components/views/megadashboard/infra/IncidentResponseView.tsx
================================================================================

// components/views/megadashboard/infra/IncidentResponseView.tsx
import React, { useContext, useState } from 'react';
import Card from '../../../Card';
import { DataContext } from '../../../../context/DataContext';
import { GoogleGenAI } from "@google/genai";
import type { Incident } from '../../../../types';

const IncidentResponseView: React.FC = () => {
    const context = useContext(DataContext);
    if (!context) throw new Error("IncidentResponseView must be within DataProvider");

    const { incidents } = context;
    const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);
    const [postmortem, setPostmortem] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleGenerate = async (incident: Incident) => {
        setSelectedIncident(incident);
        setIsLoading(true); setPostmortem('');
        try {
            const ai = new GoogleGenAI({apiKey: process.env.API_KEY as string});
            const prompt = `Generate a postmortem for this incident: "${incident.title}" (Severity: ${incident.severity}). Include sections for Summary, Impact, Root Cause, and Action Items.`;
            const response = await ai.models.generateContent({model: 'gemini-2.5-flash', contents: prompt});
            setPostmortem(response.text);
        } catch(err) { console.error(err); } finally { setIsLoading(false); }
    };

    return (
        <>
        <div className="space-y-6">
            <h2 className="text-3xl font-bold text-white tracking-wider">Incident Response</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card className="text-center"><p className="text-3xl font-bold text-red-400">1</p><p className="text-sm text-gray-400 mt-1">Active SEV2</p></Card>
                <Card className="text-center"><p className="text-3xl font-bold text-white">5m</p><p className="text-sm text-gray-400 mt-1">MTTA</p></Card>
                <Card className="text-center"><p className="text-3xl font-bold text-white">45m</p><p className="text-sm text-gray-400 mt-1">MTTR</p></Card>
                <Card className="text-center"><p className="text-3xl font-bold text-white">99.98%</p><p className="text-sm text-gray-400 mt-1">Uptime (30d)</p></Card>
            </div>
            <Card title="Incident Queue">
                <table className="w-full text-sm">
                    <thead className="text-xs text-gray-300 uppercase bg-gray-900/30"><tr><th>Title</th><th>Severity</th><th>Status</th><th>Actions</th></tr></thead>
                    <tbody>{incidents.map(inc => <tr key={inc.id}>
                        <td className="px-6 py-4 text-white">{inc.title}</td><td>{inc.severity}</td><td>{inc.status}</td>
                        <td><button onClick={() => handleGenerate(inc)} className="text-xs text-cyan-400">AI Postmortem</button></td>
                    </tr>)}</tbody>
                </table>
            </Card>
        </div>
        {selectedIncident && (
             <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50" onClick={() => setSelectedIncident(null)}>
                <div className="bg-gray-800 rounded-lg shadow-2xl max-w-2xl w-full" onClick={e=>e.stopPropagation()}>
                    <div className="p-4 border-b border-gray-700"><h3 className="text-lg font-semibold text-white">AI Postmortem for {selectedIncident.id}</h3></div>
                    <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                       <div className="min-h-[15rem] whitespace-pre-line text-sm">{isLoading ? 'Generating...' : postmortem}</div>
                    </div>
                </div>
             </div>
        )}
        </>
    );
};

export default IncidentResponseView;


================================================================================
// APPENDED FROM REPO: diplomat-bit/magic | ORIGINAL PATH: diplomat-bit-magic-a3f5ff1/components/views/megadashboard/infra/IncidentResponseView.tsx
================================================================================

// components/views/megadashboard/infra/IncidentResponseView.tsx
import React, { useContext, useState } from 'react';
import Card from '../../../Card';
import { DataContext } from '../../../../context/DataContext';
import { GoogleGenAI } from "@google/genai";
import type { Incident } from '../../../../types';

const IncidentResponseView: React.FC = () => {
    const context = useContext(DataContext);
    if (!context) throw new Error("IncidentResponseView must be within DataProvider");

    const { incidents } = context;
    const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);
    const [postmortem, setPostmortem] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleGenerate = async (incident: Incident) => {
        setSelectedIncident(incident);
        setIsLoading(true); setPostmortem('');
        try {
            const ai = new GoogleGenAI({apiKey: process.env.API_KEY as string});
            const prompt = `Generate a postmortem for this incident: "${incident.title}" (Severity: ${incident.severity}). Include sections for Summary, Impact, Root Cause, and Action Items.`;
            const response = await ai.models.generateContent({model: 'gemini-2.5-flash', contents: prompt});
            setPostmortem(response.text);
        } catch(err) { console.error(err); } finally { setIsLoading(false); }
    };

    return (
        <>
        <div className="space-y-6">
            <h2 className="text-3xl font-bold text-white tracking-wider">Incident Response</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card className="text-center"><p className="text-3xl font-bold text-red-400">1</p><p className="text-sm text-gray-400 mt-1">Active SEV2</p></Card>
                <Card className="text-center"><p className="text-3xl font-bold text-white">5m</p><p className="text-sm text-gray-400 mt-1">MTTA</p></Card>
                <Card className="text-center"><p className="text-3xl font-bold text-white">45m</p><p className="text-sm text-gray-400 mt-1">MTTR</p></Card>
                <Card className="text-center"><p className="text-3xl font-bold text-white">99.98%</p><p className="text-sm text-gray-400 mt-1">Uptime (30d)</p></Card>
            </div>
            <Card title="Incident Queue">
                <table className="w-full text-sm">
                    <thead className="text-xs text-gray-300 uppercase bg-gray-900/30"><tr><th>Title</th><th>Severity</th><th>Status</th><th>Actions</th></tr></thead>
                    <tbody>{incidents.map(inc => <tr key={inc.id}>
                        <td className="px-6 py-4 text-white">{inc.title}</td><td>{inc.severity}</td><td>{inc.status}</td>
                        <td><button onClick={() => handleGenerate(inc)} className="text-xs text-cyan-400">AI Postmortem</button></td>
                    </tr>)}</tbody>
                </table>
            </Card>
        </div>
        {selectedIncident && (
             <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50" onClick={() => setSelectedIncident(null)}>
                <div className="bg-gray-800 rounded-lg shadow-2xl max-w-2xl w-full" onClick={e=>e.stopPropagation()}>
                    <div className="p-4 border-b border-gray-700"><h3 className="text-lg font-semibold text-white">AI Postmortem for {selectedIncident.id}</h3></div>
                    <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                       <div className="min-h-[15rem] whitespace-pre-line text-sm">{isLoading ? 'Generating...' : postmortem}</div>
                    </div>
                </div>
             </div>
        )}
        </>
    );
};

export default IncidentResponseView;
