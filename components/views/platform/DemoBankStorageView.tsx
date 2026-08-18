// REPOSITORY SOURCE: diplomat-bit/Citibank_Demo_Business_Inc_Demonstration- | PATH: diplomat-bit-Citibank_Demo_Business_Inc_Demonstration--ab2501d/components/views/platform/DemoBankStorageView.tsx
================================================================================

import React, { useState, useEffect, useCallback, useMemo, useReducer, createContext, useContext, useRef } from 'react';
import Card from '../../Card';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, PieChart, Pie, Cell, BarChart, Bar, CartesianGrid, LineChart, Line, ComposedChart, Treemap } from 'recharts';

//================================================================================================
// SECTION: ENHANCED TYPES AND INTERFACES FOR A REAL-WORLD APPLICATION
//================================================================================================

export type StorageItemType = 'folder' | 'file';
export type StorageClass = 'Standard' | 'Infrequent Access' | 'Glacier' | 'Deep Archive';
export type Region = 'us-east-1' | 'us-west-2' | 'eu-central-1' | 'ap-southeast-2';
export type Permissions = 'read-only' | 'read-write' | 'full-control';
export type SortDirection = 'asc' | 'desc';
export type SortableField = 'name' | 'size' | 'lastModified' | 'type' | 'storageClass';

export interface StorageItemVersion {
    versionId: string;
    lastModified: string;
    sizeBytes: number;
    isLatest: boolean;
}

export interface StorageItem {
    id: string;
    name: string;
    path: string;
    type: StorageItemType;
    sizeBytes: number;
    lastModified: string;
    createdAt: string;
    owner: string;
    storageClass: StorageClass;
    region: Region;
    metadata?: Record<string, string>;
    tags?: string[];
    permissions: Record<string, Permissions>; // key is user/group id
    versionId?: string;
    isEncrypted: boolean;
    replicationStatus?: 'PENDING' | 'COMPLETED' | 'FAILED';
    versionHistory?: StorageItemVersion[];
    eTag?: string;
}

export interface BreadcrumbItem {
    name: string;
    path: string;
}

export interface AuditLog {
    id: string;
    timestamp: string;
    user: string;
    action: 'UPLOAD' | 'DOWNLOAD' | 'DELETE' | 'RENAME' | 'UPDATE_PERMISSIONS' | 'CREATE_FOLDER' | 'LIFECYCLE_TRANSITION';
    targetPath: string;
    details: string;
    status: 'SUCCESS' | 'FAILURE';
    clientIp: string;
}

export interface LifecyclePolicy {
    id: string;
    name: string;
    prefix: string;
    isEnabled: boolean;
    rules: LifecycleRule[];
}

export interface LifecycleRule {
    id: string;
    action: 'TRANSITION' | 'EXPIRATION';
    days: number;
    targetStorageClass?: StorageClass;
}

export interface CostDataPoint {
    month: string;
    storageCost: number;
    retrievalCost: number;
    dataTransferCost: number;
    requestsCost: number;
    totalCost: number;
}

export interface StorageMetrics {
    totalStorageBytes: number;
    totalObjects: number;
    capacityBytes: number;
    durability: number;
    iopsData: { time: string; reads: number; writes: number }[];
    storageByClass: { name: StorageClass; value: number }[];
    storageByRegion: { name: Region; value: number }[];
    costForecast: CostDataPoint[];
}

export type AInsightType = 'COST_SAVING' | 'SECURITY' | 'EFFICIENCY';

export interface AInsight {
    id: string;
    type: AInsightType;
    title: string;
    description: string;
    recommendation: string;
    relatedPath?: string;
    severity: 'LOW' | 'MEDIUM' | 'HIGH';
}

//================================================================================================
// SECTION: EXPANDED SVG ICONS
//================================================================================================

export const icons = {
    folder: () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-cyan-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" /></svg>,
    file: () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>,
    csv: () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 001 1h14a1 1 0 001-1V4a1 1 0 00-1-1H3zm3.5 3a.5.5 0 01.5.5v1a.5.5 0 01-1 0v-1a.5.5 0 01.5-.5zM6 9.5a.5.5 0 01.5-.5h1a.5.5 0 010 1h-1a.5.5 0 01-.5-.5zm0 2a.5.5 0 01.5-.5h1a.5.5 0 010 1h-1a.5.5 0 01-.5-.5zm3-4.5a.5.5 0 01.5.5v1a.5.5 0 01-1 0v-1a.5.5 0 01.5-.5zm0 2a.5.5 0 01.5-.5h4a.5.5 0 010 1h-4a.5.5 0 01-.5-.5zm0 2a.5.5 0 01.5-.5h4a.5.5 0 010 1h-4a.5.5 0 01-.5-.5zm3-4.5a.5.5 0 01.5.5v1a.5.5 0 01-1 0v-1a.5.5 0 01.5-.5z" clipRule="evenodd" /></svg>,
    json: () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M7 2a1 1 0 00-1 1v1a1 1 0 001 1h1a1 1 0 001-1V3a1 1 0 00-1-1H7zm5 0a1 1 0 00-1 1v1a1 1 0 001 1h1a1 1 0 001-1V3a1 1 0 00-1-1h-1zM3 9a1 1 0 00-1 1v1a1 1 0 001 1h1a1 1 0 001-1v-1a1 1 0 00-1-1H3zm12 0a1 1 0 00-1 1v1a1 1 0 001 1h1a1 1 0 001-1v-1a1 1 0 00-1-1h-1zM7 16a1 1 0 00-1 1v1a1 1 0 001 1h1a1 1 0 001-1v-1a1 1 0 00-1-1H7zm5 0a1 1 0 00-1 1v1a1 1 0 001 1h1a1 1 0 001-1v-1a1 1 0 00-1-1h-1z" clipRule="evenodd" /></svg>,
    model: () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-400" viewBox="0 0 20 20" fill="currentColor"><path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 001.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" /><path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" /></svg>,
    zip: () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-orange-400" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm1 2a1 1 0 011-1h1a1 1 0 110 2H6a1 1 0 01-1-1zm3 0a1 1 0 011-1h1a1 1 0 110 2H9a1 1 0 01-1-1zm3 0a1 1 0 011-1h1a1 1 0 110 2h-1a1 1 0 01-1-1zm-4 5a1 1 0 100 2h4a1 1 0 100-2H8z" clipRule="evenodd" /></svg>,
    info: () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" /></svg>,
    download: () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" /></svg>,
    delete: () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 012 0v6a1 1 0 11-2 0V8z" clipRule="evenodd" /></svg>,
    edit: () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" /><path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" /></svg>,
    search: () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>,
    up: () => <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" /></svg>,
    down: () => <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" /></svg>,
    loading: () => <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>,
    ai: () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.293 2.293a1 1 0 010 1.414L10 12l-2 3h4l2 3-2.293 2.293a1 1 0 01-1.414 0L3 12m18 0l-2.293-2.293a1 1 0 00-1.414 0L12 14l-2-3h4l-2-3 2.293-2.293a1 1 0 000-1.414L18 3z" /></svg>,
    cost: () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm0 6a2 2 0 00-2 2v2a2 2 0 002 2h12a2 2 0 002-2v-2a2 2 0 00-2-2H4z" clipRule="evenodd" /></svg>,
    policy: () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor"><path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" /><path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" /></svg>,
};


//================================================================================================
// SECTION: UTILITY FUNCTIONS
//================================================================================================

export const formatBytes = (bytes: number, decimals = 2): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

export const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
};

export const getFileExtension = (filename: string): string => {
    return filename.slice(((filename.lastIndexOf(".") - 1) >>> 0) + 2);
};

export const getIconForFile = (filename: string): React.FC => {
    const ext = getFileExtension(filename).toLowerCase();
    switch (ext) {
        case 'csv': return icons.csv;
        case 'json': return icons.json;
        case 'zip': case 'gz': case 'tar': return icons.zip;
        case 'pb': case 'onnx': case 'h5': return icons.model;
        default: return icons.file;
    }
};

export const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="p-4 bg-gray-700/80 backdrop-blur-sm border border-gray-600 rounded-lg shadow-lg text-white">
                <p className="label font-bold text-cyan-300">{`${label}`}</p>
                {payload.map((pld: any, index: number) => (
                    <div key={index} style={{ color: pld.color }}>
                        {`${pld.name}: ${pld.value.toLocaleString()}${pld.unit || ''}`}
                    </div>
                ))}
            </div>
        );
    }
    return null;
};


//================================================================================================
// SECTION: MOCK DATA GENERATION
//================================================================================================

const MOCK_USERS = ['prod-svc-acct', 'data-scientist-01', 'etl-job-runner', 'analytics-platform', 'jane.doe'];
const MOCK_REGIONS: Region[] = ['us-east-1', 'us-west-2', 'eu-central-1', 'ap-southeast-2'];
const MOCK_STORAGE_CLASSES: StorageClass[] = ['Standard', 'Infrequent Access', 'Glacier', 'Deep Archive'];
const MOCK_FILE_EXTENSIONS = ['csv', 'json', 'parquet', 'log', 'txt', 'h5', 'pb', 'onnx', 'zip', 'gz'];
const MOCK_TAGS = ['pii', 'confidential', 'raw-data', 'processed', 'experimental', 'production', 'archive'];

let idCounter = 0;
const generateId = () => `id-${Date.now()}-${idCounter++}`;

export const generateMockStorageItem = (path: string, type: StorageItemType): StorageItem => {
    const isFile = type === 'file';
    const name = isFile
        ? `data_part_${Math.floor(Math.random() * 1000)}.${MOCK_FILE_EXTENSIONS[Math.floor(Math.random() * MOCK_FILE_EXTENSIONS.length)]}`
        : `${['customer-data', 'transaction-logs', 'metrics', 'ml-artifacts'][Math.floor(Math.random() * 4)]}-${Math.floor(Math.random() * 100)}/`;
    const now = new Date();
    const lastModifiedDate = new Date(now.getTime() - Math.random() * 30 * 24 * 60 * 60 * 1000);
    const createdDate = new Date(lastModifiedDate.getTime() - Math.random() * 30 * 24 * 60 * 60 * 1000);
    const sizeBytes = isFile ? Math.floor(Math.random() * 1024 * 1024 * 1024 * 5) : 0; // up to 5GB for files
    const versionId = `v${Math.random().toString(36).substring(2, 15)}`;

    const versionHistory = isFile ? Array.from({ length: Math.floor(Math.random() * 5) + 1 }, (_, i) => {
        const modDate = new Date(lastModifiedDate.getTime() - i * 7 * 24 * 60 * 60 * 1000);
        return {
            versionId: i === 0 ? versionId : `v${Math.random().toString(36).substring(2, 15)}`,
            lastModified: modDate.toISOString(),
            sizeBytes: sizeBytes * (1 - i * 0.1),
            isLatest: i === 0,
        };
    }) : undefined;

    return {
        id: generateId(),
        name,
        path: `${path}${name}`,
        type,
        sizeBytes,
        lastModified: lastModifiedDate.toISOString(),
        createdAt: createdDate.toISOString(),
        owner: MOCK_USERS[Math.floor(Math.random() * MOCK_USERS.length)],
        storageClass: MOCK_STORAGE_CLASSES[Math.floor(Math.random() * MOCK_STORAGE_CLASSES.length)],
        region: MOCK_REGIONS[Math.floor(Math.random() * MOCK_REGIONS.length)],
        metadata: { 'source-system': ['kafka', 'api-gateway', 'batch-process'][Math.floor(Math.random() * 3)], 'data-quality-score': (Math.random() * 100).toFixed(2) },
        tags: [MOCK_TAGS[Math.floor(Math.random() * MOCK_TAGS.length)], MOCK_TAGS[Math.floor(Math.random() * MOCK_TAGS.length)]],
        permissions: { 'admin-group': 'full-control', 'data-scientists': 'read-write', 'auditors': 'read-only' },
        versionId,
        isEncrypted: Math.random() > 0.1, // 90% are encrypted
        replicationStatus: Math.random() > 0.05 ? 'COMPLETED' : 'PENDING',
        versionHistory,
        eTag: Math.random().toString(36).substring(2, 15),
    };
};

export const generateMockDirectoryListing = (path: string, count = 50): StorageItem[] => {
    const items: StorageItem[] = [];
    const numFolders = Math.floor(count * 0.2); // 20% folders
    for (let i = 0; i < numFolders; i++) items.push(generateMockStorageItem(path, 'folder'));
    for (let i = 0; i < count - numFolders; i++) items.push(generateMockStorageItem(path, 'file'));
    return items;
};

export const generateMockAuditLogs = (count = 100): AuditLog[] => {
    const logs: AuditLog[] = [];
    const actions: AuditLog['action'][] = ['UPLOAD', 'DOWNLOAD', 'DELETE', 'RENAME', 'UPDATE_PERMISSIONS', 'CREATE_FOLDER'];
    const now = new Date();
    for (let i = 0; i < count; i++) {
        logs.push({
            id: generateId(),
            timestamp: new Date(now.getTime() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
            user: MOCK_USERS[Math.floor(Math.random() * MOCK_USERS.length)],
            action: actions[Math.floor(Math.random() * actions.length)],
            targetPath: `/datalake-prod/analytics-datasets/quarterly/${Math.random().toString(36).substring(7)}.csv`,
            details: 'Action performed via automated ETL pipeline.',
            status: Math.random() > 0.05 ? 'SUCCESS' : 'FAILURE',
            clientIp: `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
        });
    }
    return logs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
};

const mockLifecyclePolicies: LifecyclePolicy[] = [
    { id: 'policy-1', name: 'Log Archival', prefix: '/datalake-prod/transaction-logs/', isEnabled: true, rules: [
        { id: 'rule-1a', action: 'TRANSITION', days: 30, targetStorageClass: 'Infrequent Access' },
        { id: 'rule-1b', action: 'TRANSITION', days: 90, targetStorageClass: 'Glacier' },
        { id: 'rule-1c', action: 'EXPIRATION', days: 365 },
    ]},
    { id: 'policy-2', name: 'ML Artifact Cleanup', prefix: '/datalake-prod/ml-artifacts/experimental/', isEnabled: true, rules: [
        { id: 'rule-2a', action: 'EXPIRATION', days: 60 },
    ]},
    { id: 'policy-3', name: 'Temp Data Deletion', prefix: '/datalake-prod/temp/', isEnabled: false, rules: [
        { id: 'rule-3a', action: 'EXPIRATION', days: 7 },
    ]},
];

//================================================================================================
// SECTION: MOCK API SERVICE
//================================================================================================

const MOCK_FILE_SYSTEM: Record<string, StorageItem[]> = {
    '/datalake-prod/': generateMockDirectoryListing('/datalake-prod/', 30),
    '/datalake-prod/production-backups/': generateMockDirectoryListing('/datalake-prod/production-backups/', 100),
    '/datalake-prod/analytics-datasets/': generateMockDirectoryListing('/datalake-prod/analytics-datasets/', 200),
    '/datalake-prod/ml-models/': generateMockDirectoryListing('/datalake-prod/ml-models/', 50),
    '/datalake-prod/user-assets/': generateMockDirectoryListing('/datalake-prod/user-assets/', 80),
};
MOCK_FILE_SYSTEM['/datalake-prod/'][0] = { ...generateMockStorageItem('/datalake-prod/', 'folder'), name: 'production-backups/', path: '/datalake-prod/production-backups/', sizeBytes: 150 * 1e12 };
MOCK_FILE_SYSTEM['/datalake-prod/'][1] = { ...generateMockStorageItem('/datalake-prod/', 'folder'), name: 'analytics-datasets/', path: '/datalake-prod/analytics-datasets/', sizeBytes: 80 * 1e12 };
MOCK_FILE_SYSTEM['/datalake-prod/'][2] = { ...generateMockStorageItem('/datalake-prod/', 'folder'), name: 'ml-models/', path: '/datalake-prod/ml-models/', sizeBytes: 45 * 1e12 };
MOCK_FILE_SYSTEM['/datalake-prod/'][3] = { ...generateMockStorageItem('/datalake-prod/', 'folder'), name: 'user-assets/', path: '/datalake-prod/user-assets/', sizeBytes: 75 * 1e12 };
MOCK_FILE_SYSTEM['/datalake-prod/'][4] = { ...generateMockStorageItem('/datalake-prod/', 'file'), name: 'archive.zip', sizeBytes: 2 * 1e12 };

export const mockStorageAPI = {
    getDirectoryListing: (path: string): Promise<StorageItem[]> => new Promise(resolve => {
        setTimeout(() => {
            const items = MOCK_FILE_SYSTEM[path] || (MOCK_FILE_SYSTEM[path] = generateMockDirectoryListing(path, 50));
            resolve(JSON.parse(JSON.stringify(items))); // Deep copy
        }, 500 + Math.random() * 800);
    }),
    getItemDetails: (itemId: string): Promise<StorageItem | null> => new Promise(resolve => {
        setTimeout(() => {
            for (const path in MOCK_FILE_SYSTEM) {
                const item = MOCK_FILE_SYSTEM[path].find(i => i.id === itemId);
                if (item) { resolve(item); return; }
            }
            resolve(null);
        }, 300 + Math.random() * 300);
    }),
    searchItems: (query: string): Promise<StorageItem[]> => new Promise(resolve => {
        setTimeout(() => {
            if (!query) { resolve([]); return; }
            const results: StorageItem[] = [];
            const lowerCaseQuery = query.toLowerCase();
            for (const path in MOCK_FILE_SYSTEM) {
                MOCK_FILE_SYSTEM[path].forEach(item => {
                    if (item.name.toLowerCase().includes(lowerCaseQuery)) results.push(item);
                });
            }
            resolve(results);
        }, 700 + Math.random() * 500);
    }),
    deleteItem: (itemId: string, path: string): Promise<boolean> => new Promise(resolve => {
        setTimeout(() => {
            if (MOCK_FILE_SYSTEM[path]) {
                const index = MOCK_FILE_SYSTEM[path].findIndex(i => i.id === itemId);
                if (index > -1) { MOCK_FILE_SYSTEM[path].splice(index, 1); resolve(true); return; }
            }
            resolve(false);
        }, 1000 + Math.random() * 500);
    }),
    getAuditLogs: (): Promise<AuditLog[]> => new Promise(resolve => setTimeout(() => resolve(generateMockAuditLogs(100)), 800)),
    getStorageMetrics: (): Promise<StorageMetrics> => new Promise(resolve => {
        setTimeout(() => {
            const iopsData = Array.from({ length: 30 }, (_, i) => {
                const date = new Date(); date.setHours(date.getHours() - i);
                return { time: date.toLocaleTimeString(), reads: Math.floor(Math.random() * 5000 + 1000), writes: Math.floor(Math.random() * 3000 + 500) };
            }).reverse();
            const costForecast: CostDataPoint[] = Array.from({length: 12}, (_, i) => {
                const month = new Date(2024, i, 1).toLocaleString('default', { month: 'short' });
                const storageCost = 50000 + i * 2000 + Math.random() * 5000;
                return {
                    month, storageCost, retrievalCost: storageCost * 0.1, dataTransferCost: storageCost * 0.05, requestsCost: storageCost * 0.02,
                    totalCost: storageCost * 1.17,
                }
            });
            resolve({
                totalStorageBytes: 352 * 1e12, totalObjects: 12543876, capacityBytes: 1 * 1e15, durability: 99.999999999, iopsData,
                storageByClass: [{ name: 'Standard', value: 200e12 }, { name: 'Infrequent Access', value: 100e12 }, { name: 'Glacier', value: 50e12 }, { name: 'Deep Archive', value: 2e12 }],
                storageByRegion: [{ name: 'us-east-1', value: 180e12 }, { name: 'us-west-2', value: 95e12 }, { name: 'eu-central-1', value: 65e12 }, { name: 'ap-southeast-2', value: 12e12 }],
                costForecast,
            });
        }, 600);
    }),
    getLifecyclePolicies: (): Promise<LifecyclePolicy[]> => new Promise(resolve => setTimeout(() => resolve(JSON.parse(JSON.stringify(mockLifecyclePolicies))), 500)),
    getAInsights: (): Promise<AInsight[]> => new Promise(resolve => setTimeout(() => resolve([
        { id: 'ai-1', type: 'COST_SAVING', severity: 'MEDIUM', title: 'Optimize Log Storage Costs', description: 'Over 25TB of logs in /transaction-logs/ are older than 30 days and stored in Standard class.', recommendation: 'Apply a lifecycle policy to transition these logs to Infrequent Access after 30 days and Glacier after 90 days to save an estimated $5,200/month.', relatedPath: '/datalake-prod/transaction-logs/' },
        { id: 'ai-2', type: 'SECURITY', severity: 'HIGH', title: 'Unusual Access to PII Data', description: 'The user `etl-job-runner` has downloaded 50GB of data tagged with "pii" from /customer-data/ in the last 24 hours, which is a 500% anomaly.', recommendation: 'Verify if this access is legitimate. Consider tightening permissions for this service account to be read-only on a subset of data.', relatedPath: '/datalake-prod/customer-data/' },
        { id: 'ai-3', type: 'EFFICIENCY', severity: 'LOW', title: 'Small Object Aggregation', description: 'The folder /metrics/ contains over 1 million files smaller than 128KB, leading to high request overhead.', recommendation: 'Implement a batch process to aggregate these small files into larger Parquet or Avro files to improve query performance and reduce request costs.', relatedPath: '/datalake-prod/metrics/' },
    ])), 1200),
};

//================================================================================================
// SECTION: CUSTOM HOOKS
//================================================================================================

export const useDebounce = <T>(value: T, delay: number): T => {
    const [debouncedValue, setDebouncedValue] = useState<T>(value);
    useEffect(() => {
        const handler = setTimeout(() => setDebouncedValue(value), delay);
        return () => clearTimeout(handler);
    }, [value, delay]);
    return debouncedValue;
};

const useClickOutside = (ref: React.RefObject<HTMLElement>, handler: (event: MouseEvent | TouchEvent) => void) => {
    useEffect(() => {
        const listener = (event: MouseEvent | TouchEvent) => {
            if (!ref.current || ref.current.contains(event.target as Node)) return;
            handler(event);
        };
        document.addEventListener('mousedown', listener);
        document.addEventListener('touchstart', listener);
        return () => {
            document.removeEventListener('mousedown', listener);
            document.removeEventListener('touchstart', listener);
        };
    }, [ref, handler]);
};


//================================================================================================
// SECTION: REUSABLE UI COMPONENTS
//================================================================================================

export const LoadingSpinner: React.FC<{ text?: string }> = ({ text = "Loading..." }) => (
    <div className="flex items-center justify-center space-x-2 text-gray-400 p-8"><icons.loading /><span>{text}</span></div>
);
export const ErrorDisplay: React.FC<{ message: string }> = ({ message }) => (
    <div className="p-4 bg-red-900/50 border border-red-700 rounded-lg text-red-300"><p className="font-bold">An error occurred:</p><p>{message}</p></div>
);
export const Modal: React.FC<{ isOpen: boolean; onClose: () => void; title: string; children: React.ReactNode }> = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center" onClick={onClose}>
            <div className="bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-lg border border-gray-700" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center pb-3 mb-4 border-b border-gray-700">
                    <h3 className="text-xl font-semibold text-white">{title}</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-white text-2xl font-bold">&times;</button>
                </div>
                <div>{children}</div>
            </div>
        </div>
    );
};
export const Tab: React.FC<{ title: string, isActive: boolean, onClick: () => void; icon?: React.ReactNode }> = ({ title, isActive, onClick, icon }) => (
    <button onClick={onClick} className={`px-4 py-2 text-sm font-medium transition-colors duration-200 flex items-center gap-2 ${isActive ? 'border-b-2 border-cyan-400 text-cyan-300' : 'border-b-2 border-transparent text-gray-400 hover:text-white hover:border-gray-500'}`}>
        {icon}{title}
    </button>
);


//================================================================================================
// SECTION: ADVANCED CHART COMPONENTS
//================================================================================================

export const StorageClassPieChart: React.FC<{ data: { name: string; value: number }[] }> = ({ data }) => {
    const COLORS = ['#06b6d4', '#22d3ee', '#67e8f9', '#a5f3fc'];
    return (
        <ResponsiveContainer width="100%" height={300}>
            <PieChart><Pie data={data} cx="50%" cy="50%" labelLine={false} outerRadius={100} fill="#8884d8" dataKey="value" nameKey="name" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                    {data.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}</Pie><Tooltip content={<CustomTooltip />} /><Legend />
            </PieChart>
        </ResponsiveContainer>
    );
};
export const IopsLineChart: React.FC<{ data: { time: string; reads: number; writes: number }[] }> = ({ data }) => (
    <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}><CartesianGrid strokeDasharray="3 3" stroke="#4b5563" /><XAxis dataKey="time" stroke="#9ca3af" /><YAxis stroke="#9ca3af" />
            <Tooltip content={<CustomTooltip />} /><Legend /><Line type="monotone" dataKey="reads" stroke="#34d399" strokeWidth={2} name="Read Ops/sec" dot={false} />
            <Line type="monotone" dataKey="writes" stroke="#f87171" strokeWidth={2} name="Write Ops/sec" dot={false} /></LineChart>
    </ResponsiveContainer>
);
export const DataDistributionMap: React.FC<{ data: { name: Region; value: number }[] }> = ({ data }) => {
    const maxVal = Math.max(...data.map(d => d.value));
    const getRadius = (value: number) => 10 + (value / maxVal) * 40;
    const regionPositions: Record<Region, { x: string; y: string; label: string }> = {
        'us-east-1': { x: '30%', y: '40%', label: 'US East' }, 'us-west-2': { x: '15%', y: '35%', label: 'US West' },
        'eu-central-1': { x: '55%', y: '30%', label: 'EU Central' }, 'ap-southeast-2': { x: '85%', y: '70%', label: 'APAC SE' },
    };
    return (
        <div className="relative w-full h-[300px] bg-gray-800 rounded-lg overflow-hidden">
            <svg width="100%" height="100%" viewBox="0 0 500 250">
                <path d="M499.5 125q0 40-20 68t-54 44-77 20-88-2-81-22-63-44-36-64q0-41 20-69t54-44 77-20 88 2 81 22 63 44 36 64z" fill="#374151" />
                {data.map(d => (
                    <g key={d.name} transform={`translate(${regionPositions[d.name].x}, ${regionPositions[d.name].y})`}>
                        <circle cx={0} cy={0} r={getRadius(d.value)} fill="#10b981" fillOpacity="0.6" stroke="#10b981" strokeWidth="2" />
                        <text x="0" y="0" textAnchor="middle" dy=".3em" fill="#fff" fontSize="10">{regionPositions[d.name].label}</text>
                        <text x="0" y={getRadius(d.value) + 12} textAnchor="middle" fill="#9ca3af" fontSize="8">{formatBytes(d.value)}</text>
                    </g>
                ))}
            </svg>
        </div>
    );
};
export const CostForecastChart: React.FC<{data: CostDataPoint[]}> = ({data}) => (
    <ResponsiveContainer width="100%" height={300}>
        <ComposedChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#4b5563" />
            <XAxis dataKey="month" stroke="#9ca3af" />
            <YAxis stroke="#9ca3af" tickFormatter={(value) => `$${(value as number / 1000)}k`} />
            <Tooltip content={<CustomTooltip />} unit="$" formatter={(value: number) => value.toLocaleString()} />
            <Legend />
            <Bar dataKey="storageCost" stackId="a" fill="#0e7490" name="Storage" />
            <Bar dataKey="retrievalCost" stackId="a" fill="#059669" name="Retrieval" />
            <Bar dataKey="dataTransferCost" stackId="a" fill="#047857" name="Transfer" />
            <Bar dataKey="requestsCost" stackId="a" fill="#065f46" name="Requests" />
            <Line type="monotone" dataKey="totalCost" stroke="#f59e0b" name="Total (Trend)" />
        </ComposedChart>
    </ResponsiveContainer>
)

//================================================================================================
// SECTION: CORE FEATURE COMPONENTS
//================================================================================================

export const DetailsSidePanel: React.FC<{ item: StorageItem | null; onClose: () => void }> = ({ item, onClose }) => {
    const [activeTab, setActiveTab] = useState('Details');
    if (!item) return null;

    const renderDetail = (label: string, value: React.ReactNode, isMono = false) => (
        <div className="flex justify-between py-2 border-b border-gray-800"><span className="text-gray-400">{label}:</span>
        <span className={`${isMono ? 'font-mono' : ''} text-white text-right`}>{value}</span></div>
    );

    return (
        <div className="bg-gray-900/80 backdrop-blur-sm p-6 w-full md:w-1/3 lg:w-1/4 border-l border-gray-700 h-full overflow-y-auto">
            <div className="flex justify-between items-center mb-6"><h3 className="text-xl font-bold text-white truncate">{item.name}</h3>
                <button onClick={onClose} className="text-gray-400 hover:text-white text-2xl">&times;</button></div>
            <div className="border-b border-gray-700 mb-4"><nav className="-mb-px flex space-x-4">
                <Tab title="Details" isActive={activeTab === 'Details'} onClick={() => setActiveTab('Details')} />
                <Tab title="Permissions" isActive={activeTab === 'Permissions'} onClick={() => setActiveTab('Permissions')} />
                {item.versionHistory && <Tab title="Versions" isActive={activeTab === 'Versions'} onClick={() => setActiveTab('Versions')} />}
            </nav></div>
            <div className="space-y-4 text-sm">
                {activeTab === 'Details' && (<>
                    {renderDetail('Size', formatBytes(item.sizeBytes), true)}
                    {renderDetail('Last Modified', formatDate(item.lastModified))}
                    {renderDetail('Created', formatDate(item.createdAt))}
                    {renderDetail('Storage Class', <span className="text-white bg-cyan-800/50 px-2 py-1 rounded-md text-xs">{item.storageClass}</span>)}
                    {renderDetail('Region', item.region)}
                    {renderDetail('Owner', item.owner, true)}
                    {renderDetail('Encrypted', <span className={`text-white text-xs px-2 py-1 rounded-md ${item.isEncrypted ? 'bg-green-800/50' : 'bg-red-800/50'}`}>{item.isEncrypted ? 'Yes' : 'No'}</span>)}
                    {renderDetail('Replication', item.replicationStatus)}
                    {renderDetail('ETag', item.eTag, true)}
                    <div className="pt-4"><h4 className="font-semibold text-gray-300 mb-2">Tags</h4><div className="flex flex-wrap gap-2">
                        {item.tags?.map(tag => <span key={tag} className="bg-gray-700 text-xs text-gray-300 px-2 py-1 rounded-full">{tag}</span>)}</div></div>
                    <div className="pt-4"><h4 className="font-semibold text-gray-300 mb-2">Metadata</h4><pre className="bg-gray-800 p-2 rounded text-xs text-gray-400 overflow-x-auto">{JSON.stringify(item.metadata, null, 2)}</pre></div>
                </>)}
                {activeTab === 'Permissions' && Object.entries(item.permissions).map(([user, perm]) => renderDetail(user, perm, true))}
                {activeTab === 'Versions' && (<table className="w-full text-sm text-left">
                    <thead className="text-xs text-gray-400"><tr><th className="py-2">Version ID</th><th>Modified</th><th>Size</th></tr></thead>
                    <tbody>{item.versionHistory?.map(v => (
                        <tr key={v.versionId} className={`border-t border-gray-800 ${v.isLatest ? 'bg-cyan-900/30' : ''}`}>
                            <td className="py-2 font-mono truncate" title={v.versionId}>{v.versionId.substring(0, 8)}... {v.isLatest && <span className="text-xs text-cyan-300">(Latest)</span>}</td>
                            <td>{formatDate(v.lastModified)}</td><td>{formatBytes(v.sizeBytes)}</td></tr>))}
                    </tbody></table>)}
            </div>
        </div>
    );
};

export const InteractiveFileBrowser: React.FC<{ onItemSelected: (item: StorageItem) => void }> = ({ onItemSelected }) => {
    const [currentPath, setCurrentPath] = useState('/datalake-prod/');
    const [items, setItems] = useState<StorageItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [breadcrumbs, setBreadcrumbs] = useState<BreadcrumbItem[]>([]);
    const [sortConfig, setSortConfig] = useState<{ key: SortableField; direction: SortDirection }>({ key: 'name', direction: 'asc' });
    const [searchTerm, setSearchTerm] = useState('');
    const debouncedSearchTerm = useDebounce(searchTerm, 500);
    const [isSearching, setIsSearching] = useState(false);
    const contextMenuRef = useRef<HTMLDivElement>(null);
    const [contextMenu, setContextMenu] = useState<{ x: number, y: number, item: StorageItem } | null>(null);
    useClickOutside(contextMenuRef, () => setContextMenu(null));

    const buildBreadcrumbs = (path: string) => {
        const parts = path.split('/').filter(p => p);
        const crumbs: BreadcrumbItem[] = [{ name: 'datalake-prod', path: '/datalake-prod/' }];
        let current = '/datalake-prod/';
        for (let i = 1; i < parts.length; i++) { current += `${parts[i]}/`; crumbs.push({ name: parts[i], path: current }); }
        setBreadcrumbs(crumbs);
    };

    const loadDirectory = useCallback((path: string) => {
        setIsLoading(true); setError(null);
        mockStorageAPI.getDirectoryListing(path)
            .then(data => { setItems(data); setCurrentPath(path); buildBreadcrumbs(path); })
            .catch(() => setError('Failed to load directory content.'))
            .finally(() => setIsLoading(false));
    }, []);

    useEffect(() => { loadDirectory(currentPath); }, [loadDirectory]);

    useEffect(() => {
        if (debouncedSearchTerm) { setIsSearching(true); mockStorageAPI.searchItems(debouncedSearchTerm).then(setItems).finally(() => setIsSearching(false)); }
        else { loadDirectory(currentPath); }
    }, [debouncedSearchTerm, currentPath, loadDirectory]);

    const handleItemClick = (item: StorageItem) => {
        if (item.type === 'folder') { loadDirectory(item.path); } else { onItemSelected(item); }
    };
    const handleItemRightClick = (e: React.MouseEvent, item: StorageItem) => {
        e.preventDefault();
        setContextMenu({ x: e.clientX, y: e.clientY, item });
    };

    const sortedItems = useMemo(() => {
        return [...items].sort((a, b) => {
            if (a.type === 'folder' && b.type !== 'folder') return -1; if (a.type !== 'folder' && b.type === 'folder') return 1;
            let aVal, bVal;
            if (sortConfig.key === 'size') { aVal = a.sizeBytes; bVal = b.sizeBytes; }
            else if (sortConfig.key === 'lastModified') { aVal = new Date(a.lastModified).getTime(); bVal = new Date(b.lastModified).getTime(); }
            else { aVal = a[sortConfig.key] || ''; bVal = b[sortConfig.key] || ''; }
            if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1; if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
            return 0;
        });
    }, [items, sortConfig]);

    const requestSort = (key: SortableField) => {
        let direction: SortDirection = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') { direction = 'desc'; }
        setSortConfig({ key, direction });
    };

    const getSortIndicator = (key: SortableField) => {
        if (sortConfig.key !== key) return null;
        return sortConfig.direction === 'asc' ? <icons.up /> : <icons.down />;
    };

    return (<Card title="Storage Browser">
        <div className="flex flex-col md:flex-row justify-between items-center mb-4 space-y-2 md:space-y-0">
            <div className="flex-grow text-sm text-gray-400">{breadcrumbs.map((crumb, index) => (
                <span key={crumb.path}><button onClick={() => loadDirectory(crumb.path)} className="hover:text-cyan-300 hover:underline">{crumb.name}</button>
                {index < breadcrumbs.length - 1 && <span className="mx-1">/</span>}</span>))}</div>
            <div className="relative w-full md:w-64"><span className="absolute inset-y-0 left-0 flex items-center pl-3"><icons.search /></span>
                <input type="text" placeholder="Search in storage..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-white"/></div>
        </div>
        <div className="overflow-x-auto"><table className="w-full text-sm text-left text-gray-400">
            <thead className="text-xs text-gray-300 uppercase bg-gray-900/30"><tr>
                {['Name', 'Size', 'Last Modified', 'Storage Class'].map(header => {
                    const key = header.toLowerCase().replace(' ', '') as SortableField;
                    return (<th scope="col" className="px-6 py-3 cursor-pointer" key={key} onClick={() => requestSort(key)}>
                        <div className="flex items-center gap-1">{header} {getSortIndicator(key)}</div></th>)})}
                <th scope="col" className="px-6 py-3">Actions</th></tr></thead>
            <tbody>
                {isLoading || isSearching ? (<tr><td colSpan={5} className="text-center p-8"><LoadingSpinner text={isSearching ? "Searching..." : "Loading items..."} /></td></tr>)
                : error ? (<tr><td colSpan={5}><ErrorDisplay message={error} /></td></tr>)
                : sortedItems.length === 0 ? (<tr><td colSpan={5} className="text-center p-8 text-gray-500">No items found.</td></tr>)
                : (sortedItems.map(item => (<tr key={item.id} onContextMenu={(e) => handleItemRightClick(e, item)} className="border-b border-gray-800 hover:bg-gray-800/50 group">
                    <td className="px-6 py-4 font-medium text-white">
                        <button onClick={() => handleItemClick(item)} className="flex items-center gap-2 hover:text-cyan-300">
                            {item.type === 'folder' ? <icons.folder /> : React.createElement(getIconForFile(item.name))}<span className="truncate max-w-xs">{item.name}</span></button></td>
                    <td className="px-6 py-4 font-mono">{item.type === 'file' ? formatBytes(item.sizeBytes) : '--'}</td>
                    <td className="px-6 py-4">{formatDate(item.lastModified)}</td><td className="px-6 py-4">{item.storageClass}</td>
                    <td className="px-6 py-4"><div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-1 hover:bg-gray-700 rounded" title="Details" onClick={() => onItemSelected(item)}><icons.info /></button>
                        <button className="p-1 hover:bg-gray-700 rounded" title="Download"><icons.download /></button>
                        <button className="p-1 hover:bg-gray-700 rounded" title="Rename"><icons.edit /></button>
                        <button className="p-1 hover:bg-gray-700 rounded text-red-500" title="Delete"><icons.delete /></button></div></td>
                </tr>)))}</tbody></table></div>
        {contextMenu && (<div ref={contextMenuRef} style={{ top: contextMenu.y, left: contextMenu.x }} className="absolute z-10 w-48 py-2 bg-gray-800 border border-gray-700 rounded-md shadow-lg">
            <a href="#" className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700">Open</a>
            <a href="#" className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700">Get Info</a>
            <a href="#" className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700">Download</a>
            <div className="border-t border-gray-700 my-1" />
            <a href="#" className="block px-4 py-2 text-sm text-red-400 hover:bg-gray-700">Delete</a>
        </div>)}
    </Card>);
};

export const AuditLogViewer: React.FC = () => {
    const [logs, setLogs] = useState<AuditLog[]>([]); const [isLoading, setIsLoading] = useState(true);
    useEffect(() => { mockStorageAPI.getAuditLogs().then(setLogs).finally(() => setIsLoading(false)); }, []);
    return (<Card title="Recent Activity Audit Log"><div className="overflow-y-auto h-96">
        {isLoading ? <LoadingSpinner text="Loading audit logs..."/> : (<table className="w-full text-sm text-left text-gray-400">
            <thead className="text-xs text-gray-300 uppercase bg-gray-900/30 sticky top-0"><tr>
                <th scope="col" className="px-6 py-3">Timestamp</th><th scope="col" className="px-6 py-3">User</th>
                <th scope="col" className="px-6 py-3">Action</th><th scope="col" className="px-6 py-3">Target</th><th scope="col" className="px-6 py-3">Status</th></tr></thead>
            <tbody className="divide-y divide-gray-800">{logs.map(log => (<tr key={log.id} className="hover:bg-gray-800/50">
                <td className="px-6 py-4 whitespace-nowrap">{formatDate(log.timestamp)}</td><td className="px-6 py-4 font-mono">{log.user}</td>
                <td className="px-6 py-4"><span className={`px-2 py-1 text-xs rounded-full ${log.action.includes('DELETE') ? 'bg-red-900/70 text-red-300' : log.action.includes('UPLOAD') ? 'bg-green-900/70 text-green-300' : 'bg-blue-900/70 text-blue-300'}`}>{log.action}</span></td>
                <td className="px-6 py-4 truncate max-w-xs" title={log.targetPath}>{log.targetPath}</td>
                <td className="px-6 py-4"><span className={log.status === 'SUCCESS' ? 'text-green-400' : 'text-red-400'}>{log.status}</span></td></tr>))}
            </tbody></table>)}</div></Card>);
};

export const AIInsightModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
    const [insights, setInsights] = useState<AInsight[]>([]); const [isLoading, setIsLoading] = useState(true);
    useEffect(() => { if(isOpen) { setIsLoading(true); mockStorageAPI.getAInsights().then(setInsights).finally(() => setIsLoading(false)); } }, [isOpen]);
    const severityColor: Record<AInsight['severity'], string> = { HIGH: 'border-red-500', MEDIUM: 'border-yellow-500', LOW: 'border-blue-500' };
    return (<Modal isOpen={isOpen} onClose={onClose} title="AI Storage Assistant"><div className="max-h-[70vh] overflow-y-auto pr-2">
        {isLoading ? <LoadingSpinner /> : <div className="space-y-4">
            {insights.map(insight => (<div key={insight.id} className={`p-4 bg-gray-900/50 rounded-lg border-l-4 ${severityColor[insight.severity]}`}>
                <h4 className="font-bold text-white flex items-center gap-2"><icons.ai/> {insight.title}</h4>
                <p className="text-sm text-gray-300 mt-2">{insight.description}</p>
                <p className="text-sm text-cyan-300 mt-2 bg-gray-800 p-2 rounded">{insight.recommendation}</p>
            </div>))}
        </div>}</div></Modal>);
};

//================================================================================================
// SECTION: MAIN VIEW COMPONENT
//================================================================================================

const DemoBankStorageView: React.FC = () => {
    const [activeTab, setActiveTab] = useState('Overview');
    const [selectedItem, setSelectedItem] = useState<StorageItem | null>(null);
    const [metrics, setMetrics] = useState<StorageMetrics | null>(null);
    const [isLoadingMetrics, setIsLoadingMetrics] = useState(true);
    const [isAIModalOpen, setAIModalOpen] = useState(false);

    useEffect(() => {
        setIsLoadingMetrics(true);
        mockStorageAPI.getStorageMetrics().then(setMetrics).finally(() => setIsLoadingMetrics(false));
    }, []);

    const renderOverview = () => (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {isLoadingMetrics || !metrics ? Array.from({length: 4}).map((_, i) => <Card key={i}><LoadingSpinner/></Card>) : <>
                    <Card className="text-center"><p className="text-3xl font-bold text-white">{formatBytes(metrics.totalStorageBytes)}</p><p className="text-sm text-gray-400 mt-1">Total Data Stored</p></Card>
                    <Card className="text-center"><p className="text-3xl font-bold text-white">{formatBytes(metrics.capacityBytes)}</p><p className="text-sm text-gray-400 mt-1">Total Capacity</p></Card>
                    <Card className="text-center"><p className="text-3xl font-bold text-white">{metrics.totalObjects.toLocaleString()}</p><p className="text-sm text-gray-400 mt-1">Total Objects</p></Card>
                    <Card className="text-center"><p className="text-3xl font-bold text-white">{metrics.durability.toFixed(9)}%</p><p className="text-sm text-gray-400 mt-1">Durability</p></Card>
                </>}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card title="Cost Forecast (Monthly)">{isLoadingMetrics || !metrics ? <LoadingSpinner/> : <CostForecastChart data={metrics.costForecast} />}</Card>
                <Card title="I/O Operations (Last 30 hours)">{isLoadingMetrics || !metrics ? <LoadingSpinner/> : <IopsLineChart data={metrics.iopsData} />}</Card>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card title="Storage by Class">{isLoadingMetrics || !metrics ? <LoadingSpinner/> : <StorageClassPieChart data={metrics.storageByClass.map(d => ({...d, name: d.name.replace(' ', '\n')}))} />}</Card>
                <Card title="Data Distribution by Region">{isLoadingMetrics || !metrics ? <LoadingSpinner/> : <DataDistributionMap data={metrics.storageByRegion} />}</Card>
            </div>
        </div>
    );

    const renderContent = () => {
        switch(activeTab) {
            case 'Browser': return <InteractiveFileBrowser onItemSelected={setSelectedItem} />;
            case 'Audit Logs': return <AuditLogViewer />;
            case 'Overview': default: return renderOverview();
        }
    };

    return (<>
        <div className="flex h-full">
            <div className="flex-grow space-y-6 transition-all duration-300 ease-in-out" style={{width: selectedItem ? 'calc(100% - 25rem)' : '100%'}}>
                <div className="flex justify-between items-center">
                    <h2 className="text-3xl font-bold text-white tracking-wider">Cloud Storage Management</h2>
                     <button onClick={() => setAIModalOpen(true)} className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-purple-600 rounded-lg hover:bg-purple-700 transition-colors">
                        <icons.ai /> AI Assistant
                    </button>
                </div>
                <div className="border-b border-gray-700"><nav className="-mb-px flex space-x-4">
                    <Tab title="Overview" isActive={activeTab === 'Overview'} onClick={() => setActiveTab('Overview')} />
                    <Tab title="Browser" isActive={activeTab === 'Browser'} onClick={() => setActiveTab('Browser')} />
                    <Tab title="Audit Logs" isActive={activeTab === 'Audit Logs'} onClick={() => setActiveTab('Audit Logs')} />
                </nav></div>
                <div className="mt-6">{renderContent()}</div>
            </div>
            <div className={`transition-all duration-300 ease-in-out ${selectedItem ? 'w-[25rem]' : 'w-0'}`} style={{ transform: selectedItem ? 'translateX(0)' : 'translateX(100%)', overflow: 'hidden'}}>
                {selectedItem && <DetailsSidePanel item={selectedItem} onClose={() => setSelectedItem(null)} />}
            </div>
        </div>
        <AIInsightModal isOpen={isAIModalOpen} onClose={() => setAIModalOpen(false)} />
    </>);
};

export default DemoBankStorageView;
