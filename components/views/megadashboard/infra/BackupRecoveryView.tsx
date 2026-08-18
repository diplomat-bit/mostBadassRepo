// REPOSITORY SOURCE: diplomat-bit/almost | PATH: diplomat-bit-almost-93a5466/components/views/megadashboard/infra/BackupRecoveryView.tsx
================================================================================

// components/views/megadashboard/infra/BackupRecoveryView.tsx
import React, { useContext, useState } from 'react';
import Card from '../../../Card';
import { DataContext } from '../../../../context/DataContext';
import { GoogleGenAI } from "@google/genai";

const BackupRecoveryView: React.FC = () => {
    const context = useContext(DataContext);
    if (!context) throw new Error("BackupRecoveryView must be within DataProvider");
    
    const { backupJobs } = context;
    const [isSimulatorOpen, setSimulatorOpen] = useState(false);
    const [scenario, setScenario] = useState("Primary database corruption");
    const [plan, setPlan] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSimulate = async () => {
        setIsLoading(true); setPlan('');
        try {
            // NOTE: The API key is not needed for this specific API call as per the instruction.
            // However, the GoogleGenAI SDK requires an API key for initialization.
            // In a real-world scenario, you would use an API key that is securely managed.
            // For this example, we'll use a placeholder or environment variable if available.
            const apiKey = process.env.REACT_APP_GEMINI_API_KEY || "YOUR_PLACEHOLDER_API_KEY"; // Replace with your actual API key management strategy
            const ai = new GoogleGenAI({apiKey: apiKey});
            
            // Constructing the prompt to be sent to the AI model.
            // The prompt is designed to elicit a disaster recovery plan based on the provided scenario.
            const prompt = `Generate a high-level disaster recovery plan (DRP) for this scenario: "${scenario}". Include steps for failover, data restoration, and post-recovery validation.`;
            
            // Calling the Gemini API to generate content.
            // We are using the 'gemini-2.5-flash' model for its speed and efficiency.
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash', 
                contents: [{ role: "user", parts: [{ text: prompt }] }]
            });
            
            // Extracting the text content from the AI's response.
            setPlan(response.response.candidates[0].content.parts[0].text);
        } catch(err) { 
            console.error("Error simulating DR plan:", err); 
            setPlan("Failed to generate DR plan. Please check console for errors.");
        } finally { 
            setIsLoading(false); 
        }
    };

    return (
        <>
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <h2 className="text-3xl font-bold text-white tracking-wider">Backup & Recovery</h2>
                    <button onClick={() => setSimulatorOpen(true)} className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg text-sm font-medium">AI DR Plan Simulator</button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card className="text-center"><p className="text-3xl font-bold text-green-400">100%</p><p className="text-sm text-gray-400 mt-1">Backup Success (24h)</p></Card>
                    <Card className="text-center"><p className="text-3xl font-bold text-white">4h</p><p className="text-sm text-gray-400 mt-1">Recovery Point Objective</p></Card>
                    <Card className="text-center"><p className="text-3xl font-bold text-white">1h</p><p className="text-sm text-gray-400 mt-1">Recovery Time Objective</p></Card>
                </div>
                <Card title="Recent Backup Jobs">
                    <table className="w-full text-sm">
                        <thead className="text-xs text-gray-300 uppercase bg-gray-900/30"><tr><th>Service</th><th>Status</th><th>Timestamp</th><th>Duration</th></tr></thead>
                        <tbody>{backupJobs.map(job => <tr key={job.id}><td>{job.service}</td><td><span className="text-green-400">{job.status}</span></td><td>{job.timestamp}</td><td>{job.duration}</td></tr>)}</tbody>
                    </table>
                </Card>
            </div>
            {isSimulatorOpen && (
                 <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50" onClick={() => setSimulatorOpen(false)}>
                    <div className="bg-gray-800 rounded-lg shadow-2xl max-w-2xl w-full" onClick={e=>e.stopPropagation()}>
                        <div className="p-4 border-b border-gray-700"><h3 className="text-lg font-semibold text-white">AI DR Plan Simulator</h3></div>
                        <div className="p-6 space-y-4">
                            <input 
                                type="text" 
                                value={scenario} 
                                onChange={e => setScenario(e.target.value)} 
                                className="w-full bg-gray-700/50 p-2 rounded text-white focus:outline-none focus:ring-2 focus:ring-cyan-500" 
                                placeholder="Enter disaster scenario..."
                            />
                            <button 
                                onClick={handleSimulate} 
                                disabled={isLoading} 
                                className="w-full py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded disabled:opacity-50 font-medium transition-colors duration-200"
                            >
                                {isLoading ? 'Simulating...' : 'Simulate DR Plan'}
                            </button>
                            {plan && (
                                <Card title="Simulated Plan">
                                    <div className="min-h-[10rem] max-h-60 overflow-y-auto text-sm text-gray-300 whitespace-pre-line p-4 border border-gray-700 rounded-md">
                                        {plan}
                                    </div>
                                </Card>
                            )}
                        </div>
                        <div className="p-4 border-t border-gray-700 flex justify-end">
                            <button onClick={() => setSimulatorOpen(false)} className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg text-sm font-medium">Close</button>
                        </div>
                    </div>
                 </div>
            )}
        </>
    );
};

export default BackupRecoveryView;

================================================================================
// APPENDED FROM REPO: diplomat-bit/Citibank_Demo_Business_Inc_Demonstration- | ORIGINAL PATH: diplomat-bit-Citibank_Demo_Business_Inc_Demonstration--ab2501d/components/views/megadashboard/infra/BackupRecoveryView.tsx
================================================================================

import React, { useContext, useState, useEffect, useCallback, useMemo } from 'react';
import Card from '../../../Card';
import { DataContext } from '../../../../context/DataContext';
import { GoogleGenAI } from "@google/genai";
import { LineChart, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Line, Bar, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default Leaflet icon not showing up
// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});


/**
 * @file BackupRecoveryView.tsx
 * @description This file implements a comprehensive Backup & Recovery management dashboard.
 * It integrates features for managing backup jobs, defining recovery policies, simulating disaster recovery,
 * configuring storage targets, monitoring backup health, advanced reporting, and AI-powered insights.
 * The aim is to provide a "real-world" enterprise-grade interface for infrastructure resilience.
 */

// --- GLOBAL UTILITIES AND CONSTANTS ---
/**
 * Generates a unique ID string.
 * @returns {string} A unique ID.
 */
export const generateUniqueId = (): string => Math.random().toString(36).substr(2, 9);

/**
 * Formats a timestamp into a human-readable date and time string.
 * @param {string | Date} timestamp - The timestamp to format.
 * @returns {string} Formatted date and time.
 */
export const formatTimestamp = (timestamp: string | Date): string => {
    const date = new Date(timestamp);
    return date.toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
    });
};

/**
 * Converts bytes to a human-readable size string (e.g., KB, MB, GB).
 * @param {number} bytes - The number of bytes.
 * @returns {string} Formatted size string.
 */
export const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// --- ENUMERATIONS ---
export enum BackupStatus { SUCCESS = 'SUCCESS', FAILED = 'FAILED', IN_PROGRESS = 'IN_PROGRESS', SCHEDULED = 'SCHEDULED', CANCELLED = 'CANCELLED', PARTIAL = 'PARTIAL' }
export enum RPOUnit { MINUTES = 'MINUTES', HOURS = 'HOURS', DAYS = 'DAYS' }
export enum RTOUnit { MINUTES = 'MINUTES', HOURS = 'HOURS', DAYS = 'DAYS' }
export enum BackupFrequency { HOURLY = 'HOURLY', DAILY = 'DAILY', WEEKLY = 'WEEKLY', MONTHLY = 'MONTHLY', CUSTOM = 'CUSTOM' }
export enum BackupType { FULL = 'FULL', INCREMENTAL = 'INCREMENTAL', DIFFERENTIAL = 'DIFFERENTIAL' }
export enum StorageTargetType { S3 = 'AWS S3', AZURE_BLOB = 'Azure Blob Storage', GCS = 'Google Cloud Storage', NFS = 'NFS Share', LOCAL = 'Local Disk' }
export enum AlertSeverity { INFO = 'INFO', WARNING = 'WARNING', CRITICAL = 'CRITICAL', HIGH = 'HIGH', MEDIUM = 'MEDIUM', LOW = 'LOW' }
export enum ComplianceStandard { GDPR = 'GDPR', HIPAA = 'HIPAA', PCI_DSS = 'PCI DSS', ISO_27001 = 'ISO 27001' }
export enum DRDrillStatus { PENDING = 'PENDING', IN_PROGRESS = 'IN_PROGRESS', COMPLETED_SUCCESS = 'COMPLETED_SUCCESS', COMPLETED_FAILED = 'COMPLETED_FAILED', SCHEDULED = 'SCHEDULED' }
export enum PlaybookStatus { DRAFT = 'DRAFT', ACTIVE = 'ACTIVE', DEPRECATED = 'DEPRECATED' }
export enum AnomalyType { DURATION = 'DURATION', SIZE = 'SIZE', FREQUENCY = 'FREQUENCY', FAILURE_RATE = 'FAILURE_RATE' }
export enum EncryptionAlgorithm { AES_256 = 'AES-256', AES_128 = 'AES-128', RSA_2048 = 'RSA-2048' }

// --- INTERFACES FOR NEW DATA STRUCTURES ---

export interface DetailedBackupJob {
    id: string;
    service: string;
    type: BackupType;
    status: BackupStatus;
    timestamp: string;
    duration: string;
    size: number; // in bytes
    policyId?: string;
    storageTargetId?: string;
    recoveryPoint?: string;
    logs: string[];
    progress: number; // 0-100
    sourceDataCenter: string;
    destinationDataCenter: string;
    throughputBps: number;
}

export interface BackupPolicy {
    id: string;
    name: string;
    description: string;
    services: string[];
    frequency: BackupFrequency;
    schedule: string;
    retentionDays: number;
    backupType: BackupType;
    rpoUnit: RPOUnit;
    rpoValue: number;
    enabled: boolean;
    storageTargetId: string;
    lastUpdated: string;
    encryptionEnabled: boolean;
    encryptionAlgorithm?: EncryptionAlgorithm;
    networkThrottlingBps?: number;
    tags: string[];
}

export interface StorageTarget {
    id: string;
    name: string;
    type: StorageTargetType;
    location: string;
    coordinates: [number, number]; // [lat, lng]
    endpoint?: string;
    accessKeyId?: string;
    secretAccessKey?: string;
    mountPath?: string;
    capacityBytes: number;
    usedBytes: number;
    enabled: boolean;
    createdAt: string;
    isImmutable: boolean;
    lifecycleRules: string; // e.g., "Move to Glacier after 90 days"
    monthlyCostEstimate: number; // in USD
}

export interface RecoveryStep {
    id: string;
    name: string;
    type: 'manual' | 'automated';
    command?: string;
    description: string;
    estimatedDurationMinutes: number;
}

export interface RecoveryPlan {
    id: string;
    name: string;
    description: string;
    targetServices: string[];
    rtoUnit: RTOUnit;
    rtoValue: number;
    recoverySteps: RecoveryStep[];
    validationSteps: string[];
    associatedPolicies: string[];
    lastTested: string | null;
    status: PlaybookStatus;
    createdBy: string;
    lastModifiedBy: string;
    version: string;
    aiGeneratedSummary?: string;
    aiOptimizedSteps?: RecoveryStep[];
}

export interface DRDrill {
    id: string;
    planId: string;
    planName: string;
    startTime: string;
    endTime: string | null;
    status: DRDrillStatus;
    triggeredBy: string;
    outcome: string;
    logs: string[];
    durationMinutes: number | null;
    testRecoveryPoint?: string;
}

export interface AlertRule {
    id: string;
    name: string;
    description: string;
    condition: string;
    severity: AlertSeverity;
    notificationChannels: string[];
    enabled: boolean;
    lastTriggered: string | null;
}

export interface AuditLog {
    id: string;
    timestamp: string;
    actor: string;
    action: string;
    target: string;
    details: string;
    ipAddress: string;
}

export interface ComplianceReport {
    id: string;
    standard: ComplianceStandard;
    generationDate: string;
    periodStart: string;
    periodEnd: string;
    complianceStatus: string;
    findings: string[];
    recommendations: string[];
    generatedBy: string;
    reportFileUrl?: string;
}

export interface BackupAnomaly {
    id: string;
    timestamp: string;
    jobId: string;
    service: string;
    type: AnomalyType;
    description: string;
    severity: 'LOW' | 'MEDIUM' | 'HIGH';
    status: 'NEW' | 'INVESTIGATING' | 'RESOLVED';
}

// --- MOCK DATA GENERATORS ---
const MOCK_SERVICES = ['Database A', 'Microservice X', 'Payment Gateway', 'User Auth', 'Analytics Engine', 'CMS Backend'];
const MOCK_DATACENTERS = {
    'us-east-1': { name: 'N. Virginia', coords: [38.95, -77.45] as [number, number] },
    'eu-west-1': { name: 'Ireland', coords: [53.34, -6.26] as [number, number] },
    'ap-southeast-2': { name: 'Sydney', coords: [-33.86, 151.20] as [number, number] },
};

const generateMockDetailedBackupJob = (count: number): DetailedBackupJob[] => {
    return Array.from({ length: count }, () => {
        const status = Object.values(BackupStatus)[Math.floor(Math.random() * Object.values(BackupStatus).length)];
        const service = MOCK_SERVICES[Math.floor(Math.random() * MOCK_SERVICES.length)];
        const timestamp = new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString();
        const durationSeconds = Math.floor(Math.random() * 3600) + 60;
        const size = Math.floor(Math.random() * (500 * 1024 * 1024)) + (10 * 1024 * 1024);
        const progress = status === BackupStatus.IN_PROGRESS ? Math.floor(Math.random() * 99) + 1 : (status === BackupStatus.SUCCESS ? 100 : 0);
        const dataCenters = Object.keys(MOCK_DATACENTERS);
        const source = dataCenters[Math.floor(Math.random() * dataCenters.length)];
        const destination = dataCenters.filter(dc => dc !== source)[Math.floor(Math.random() * (dataCenters.length - 1))];

        return {
            id: generateUniqueId(),
            service,
            type: Object.values(BackupType)[Math.floor(Math.random() * Object.values(BackupType).length)],
            status,
            timestamp: formatTimestamp(timestamp),
            duration: `${Math.floor(durationSeconds / 60)}m ${durationSeconds % 60}s`,
            size,
            logs: [`Backup started for ${service}`, `Phase 1 complete`, `Transferring data...`, `Backup finished. Status: ${status}`],
            progress,
            recoveryPoint: formatTimestamp(new Date(new Date(timestamp).getTime() - Math.random() * 60 * 60 * 1000)),
            sourceDataCenter: source,
            destinationDataCenter: destination,
            throughputBps: Math.floor(Math.random() * 100000000) + 50000000,
        };
    }).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
};

const generateMockStorageTargets = (count: number): StorageTarget[] => {
    return Array.from({ length: count }, (_, i) => {
        const type = Object.values(StorageTargetType)[Math.floor(Math.random() * Object.values(StorageTargetType).length)];
        const dataCenterKeys = Object.keys(MOCK_DATACENTERS);
        const location = dataCenterKeys[i % dataCenterKeys.length];
        const totalCapacity = Math.random() * (10e12) + (1e12); // 1TB to 10TB
        const usedCapacity = Math.random() * totalCapacity * 0.8;
        return {
            id: `storage-${generateUniqueId()}`,
            name: `${type} Target ${i + 1}`,
            type,
            location,
            coordinates: MOCK_DATACENTERS[location].coords,
            capacityBytes: totalCapacity,
            usedBytes: usedCapacity,
            enabled: Math.random() > 0.05,
            createdAt: formatTimestamp(new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000)),
            isImmutable: Math.random() > 0.5,
            lifecycleRules: "Move to cold storage after 180 days, delete after 365 days.",
            monthlyCostEstimate: Math.floor(Math.random() * 500) + 50,
        };
    });
};

const generateMockBackupPolicies = (count: number, storageTargets: StorageTarget[]): BackupPolicy[] => {
    return Array.from({ length: count }, (_, i) => {
        const frequency = Object.values(BackupFrequency)[Math.floor(Math.random() * Object.values(BackupFrequency).length)];
        const services = Array.from({ length: Math.floor(Math.random() * 3) + 1 }, () => MOCK_SERVICES[Math.floor(Math.random() * MOCK_SERVICES.length)]);
        return {
            id: `policy-${generateUniqueId()}`,
            name: `Policy ${String.fromCharCode(65 + i)} - ${frequency}`,
            description: `Automated backup policy for ${services.join(', ')} with ${frequency} frequency.`,
            services: Array.from(new Set(services)),
            frequency,
            schedule: frequency === BackupFrequency.HOURLY ? 'Every 4 hours' : 'Daily at 2 AM',
            retentionDays: Math.floor(Math.random() * 365) + 7,
            backupType: Object.values(BackupType)[Math.floor(Math.random() * Object.values(BackupType).length)],
            rpoUnit: Object.values(RPOUnit)[Math.floor(Math.random() * Object.values(RPOUnit).length)],
            rpoValue: Math.floor(Math.random() * 12) + 1,
            enabled: Math.random() > 0.1,
            storageTargetId: storageTargets[Math.floor(Math.random() * storageTargets.length)].id,
            lastUpdated: formatTimestamp(new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000)),
            encryptionEnabled: Math.random() > 0.2,
            encryptionAlgorithm: EncryptionAlgorithm.AES_256,
            networkThrottlingBps: Math.random() > 0.7 ? 100000000 : undefined,
            tags: ['critical', 'database', `tier-${Math.floor(Math.random() * 3) + 1}`].slice(0, Math.floor(Math.random() * 3) + 1)
        };
    });
};

const generateMockRecoveryPlans = (count: number, policies: BackupPolicy[]): RecoveryPlan[] => {
    return Array.from({ length: count }, () => {
        const targetServices = Array.from(new Set(Array.from({ length: Math.floor(Math.random() * 3) + 1 }, () => MOCK_SERVICES[Math.floor(Math.random() * MOCK_SERVICES.length)])));
        const associatedPolicies = policies.filter(p => targetServices.some(ts => p.services.includes(ts))).map(p => p.id).slice(0, 2);
        return {
            id: `plan-${generateUniqueId()}`,
            name: `DR Plan for ${targetServices[0]}`,
            description: `Detailed recovery playbook for ${targetServices.join(', ')} to ensure business continuity.`,
            targetServices,
            rtoUnit: Object.values(RTOUnit)[Math.floor(Math.random() * Object.values(RTOUnit).length)],
            rtoValue: Math.floor(Math.random() * 8) + 1,
            recoverySteps: [
                { id: generateUniqueId(), name: "Declare Disaster", type: 'manual', description: "Activate emergency communication channels and notify stakeholders.", estimatedDurationMinutes: 15 },
                { id: generateUniqueId(), name: "Failover Network", type: 'automated', command: "promote-dr-network.sh", description: "Promote DR site network routes to become primary.", estimatedDurationMinutes: 5 },
                { id: generateUniqueId(), name: "Restore Database", type: 'automated', command: "restore-db.sh --latest", description: "Restore database from latest available backup.", estimatedDurationMinutes: 60 },
                { id: generateUniqueId(), name: "Verify Application", type: 'manual', description: "Perform smoke tests on critical application endpoints.", estimatedDurationMinutes: 30 }
            ],
            validationSteps: ["Check service endpoints.", "Perform data integrity checks.", "Conduct user acceptance testing."],
            associatedPolicies,
            lastTested: Math.random() > 0.5 ? formatTimestamp(new Date(Date.now() - Math.random() * 180 * 24 * 60 * 60 * 1000)) : null,
            status: Object.values(PlaybookStatus)[Math.floor(Math.random() * Object.values(PlaybookStatus).length)],
            createdBy: 'admin@example.com',
            lastModifiedBy: 'admin@example.com',
            version: `1.${Math.floor(Math.random() * 10)}`,
            aiGeneratedSummary: `AI-powered summary: This plan focuses on rapid failover for ${targetServices[0]} using a multi-region strategy.`,
        };
    });
};

const generateMockDRDrills = (count: number, plans: RecoveryPlan[]): DRDrill[] => {
    return Array.from({ length: count }, () => {
        const plan = plans[Math.floor(Math.random() * plans.length)];
        const status = Object.values(DRDrillStatus)[Math.floor(Math.random() * Object.values(DRDrillStatus).length)];
        const startTime = new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000);
        const durationMinutes = status === DRDrillStatus.IN_PROGRESS ? null : Math.floor(Math.random() * 240) + 30;
        const endTime = durationMinutes ? new Date(startTime.getTime() + durationMinutes * 60 * 1000) : null;
        return {
            id: `drill-${generateUniqueId()}`, planId: plan.id, planName: plan.name, startTime: formatTimestamp(startTime),
            endTime: endTime ? formatTimestamp(endTime) : null, status, triggeredBy: Math.random() > 0.7 ? 'system' : 'ops_user@example.com',
            outcome: status === DRDrillStatus.COMPLETED_SUCCESS ? 'Successfully validated RTO/RPO targets.' : (status === DRDrillStatus.COMPLETED_FAILED ? 'Identified issues in step 3, requiring plan revision.' : 'N/A'),
            logs: ["Drill initiated.", "Service failover started.", "Data restoration validation passed."], durationMinutes,
            testRecoveryPoint: formatTimestamp(new Date(startTime.getTime() - Math.random() * 24 * 60 * 60 * 1000))
        };
    }).sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime());
};

const generateMockAlertRules = (count: number): AlertRule[] => {
    const conditions = ["Backup Failure Rate > 10%", "RPO Breach for Database A", "Storage Target Capacity > 90%", "No successful backup in 24h"];
    return Array.from({ length: count }, (_, i) => ({
        id: `alert-${generateUniqueId()}`, name: `Alert Rule ${i + 1}`, description: `Alert when ${conditions[i % conditions.length]}.`,
        condition: conditions[i % conditions.length], severity: Object.values(AlertSeverity)[Math.floor(Math.random() * Object.values(AlertSeverity).length)],
        notificationChannels: ['email:ops@example.com', 'slack:#alerts'], enabled: Math.random() > 0.1,
        lastTriggered: Math.random() > 0.5 ? formatTimestamp(new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000)) : null
    }));
};

const generateMockAuditLogs = (count: number): AuditLog[] => {
    const actions = ["Created Backup Policy", "Modified Storage Target", "Triggered DR Drill", "Deleted Backup Job", "Viewed Recovery Plan"];
    const actors = ["admin@example.com", "ops_user@example.com", "system"];
    const targets = ["Policy-001", "Storage-AWS-S3", "Plan-WebApp", "Job-DBA-20231026", "ComplianceReport-GDPR"];
    return Array.from({ length: count }, () => ({
        id: `audit-${generateUniqueId()}`, timestamp: formatTimestamp(new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000)),
        actor: actors[Math.floor(Math.random() * actors.length)], action: actions[Math.floor(Math.random() * actions.length)],
        target: targets[Math.floor(Math.random() * targets.length)], details: `Details for action.`, ipAddress: `192.168.1.${Math.floor(Math.random() * 255)}`
    })).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
};

const generateMockComplianceReports = (count: number): ComplianceReport[] => {
    return Array.from({ length: count }, () => {
        const standard = Object.values(ComplianceStandard)[Math.floor(Math.random() * Object.values(ComplianceStandard).length)];
        const generationDate = new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000);
        const periodStart = new Date(generationDate.getTime() - 90 * 24 * 60 * 60 * 1000);
        const complianceStatus = Math.random() > 0.8 ? 'Non-Compliant (Minor)' : 'Compliant';
        return {
            id: `report-${generateUniqueId()}`, standard, generationDate: formatTimestamp(generationDate),
            periodStart: formatTimestamp(periodStart), periodEnd: formatTimestamp(generationDate), complianceStatus,
            findings: complianceStatus !== 'Compliant' ? [`Finding: Minor RPO breach for service X`, `Recommendation: Adjust policy 'HourlyDB' to lower RPO.`] : [],
            recommendations: complianceStatus !== 'Compliant' ? [`Review policy settings for ${standard}.`] : [],
            generatedBy: 'compliance_officer@example.com', reportFileUrl: `https://example.com/reports/${standard.toLowerCase()}-${generateUniqueId()}.pdf`
        };
    }).sort((a, b) => new Date(b.generationDate).getTime() - new Date(a.generationDate).getTime());
};

const generateMockAnomalies = (count: number, jobs: DetailedBackupJob[]): BackupAnomaly[] => {
    return Array.from({ length: count }, () => {
        const job = jobs[Math.floor(Math.random() * jobs.length)];
        return {
            id: `anomaly-${generateUniqueId()}`,
            timestamp: formatTimestamp(new Date(new Date(job.timestamp).getTime() + 10000)),
            jobId: job.id,
            service: job.service,
            type: Object.values(AnomalyType)[Math.floor(Math.random() * Object.values(AnomalyType).length)],
            description: "Backup duration increased by 50% compared to rolling average.",
            severity: Math.random() > 0.7 ? 'HIGH' : 'MEDIUM',
            status: 'NEW'
        };
    }).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
};

const generateAnalyticsData = () => {
    const data = [];
    for (let i = 30; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        data.push({
            date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            success: Math.floor(Math.random() * 20) + 80, // 80-100
            failed: Math.floor(Math.random() * 10),     // 0-10
            dataBackedUpGB: Math.floor(Math.random() * 500) + 1200 + i * 10,
            costUSD: Math.floor(Math.random() * 20) + 100 + i,
        });
    }
    return data;
};

// --- REACT COMPONENTS ---

export interface ActionButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> { label: string; onClick: () => void; isLoading?: boolean; loadingText?: string; variant?: 'primary' | 'secondary' | 'danger' | 'success'; }
export const ActionButton: React.FC<ActionButtonProps> = ({ label, onClick, isLoading = false, loadingText = 'Processing...', variant = 'primary', className, disabled, ...rest }) => {
    const baseStyle = "px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200";
    let variantStyle = "";
    switch (variant) {
        case 'primary': variantStyle = "bg-cyan-600 hover:bg-cyan-700 text-white"; break;
        case 'secondary': variantStyle = "bg-gray-600 hover:bg-gray-700 text-white"; break;
        case 'danger': variantStyle = "bg-red-600 hover:bg-red-700 text-white"; break;
        case 'success': variantStyle = "bg-green-600 hover:bg-green-700 text-white"; break;
    }
    return <button onClick={onClick} disabled={isLoading || disabled} className={`${baseStyle} ${variantStyle} ${isLoading ? 'opacity-50 cursor-not-allowed' : ''} ${className || ''}`} {...rest}>{isLoading ? loadingText : label}</button>;
};

export interface ModalProps { isOpen: boolean; onClose: () => void; title: string; children: React.ReactNode; className?: string; widthClass?: string; }
export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, className, widthClass = 'max-w-2xl' }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50" onClick={onClose}>
            <div className={`bg-gray-800 rounded-lg shadow-2xl w-full ${widthClass} ${className || ''}`} onClick={e => e.stopPropagation()}>
                <div className="p-4 border-b border-gray-700 flex justify-between items-center"><h3 className="text-lg font-semibold text-white">{title}</h3><button onClick={onClose} className="text-gray-400 hover:text-white"><svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg></button></div>
                <div className="p-6">{children}</div>
            </div>
        </div>
    );
};

export interface StatusBadgeProps { status: string; type?: 'success' | 'warning' | 'error' | 'info' | 'default'; }
export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, type }) => {
    let colorClass = 'bg-gray-700 text-gray-300';
    switch (type || status.toLowerCase()) {
        case 'success': case 'completed_success': case 'compliant': colorClass = 'bg-green-700 text-green-300'; break;
        case 'warning': case 'partial': case 'in_progress': colorClass = 'bg-yellow-700 text-yellow-300'; break;
        case 'error': case 'failed': case 'non-compliant (critical)': colorClass = 'bg-red-700 text-red-300'; break;
        case 'info': case 'scheduled': case 'pending': colorClass = 'bg-blue-700 text-blue-300'; break;
        case 'active': colorClass = 'bg-purple-700 text-purple-300'; break;
        case 'draft': colorClass = 'bg-indigo-700 text-indigo-300'; break;
        default: colorClass = 'bg-gray-700 text-gray-300'; break;
    }
    return <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${colorClass}`}>{status.replace(/_/g, ' ')}</span>;
};

export interface ProgressBarProps { progress: number; label?: string; color?: string; }
export const ProgressBar: React.FC<ProgressBarProps> = ({ progress, label, color = 'bg-cyan-500' }) => {
    const clampedProgress = Math.max(0, Math.min(100, progress));
    return (
        <div className="w-full bg-gray-700 rounded-full h-2.5">
            <div className={`h-2.5 rounded-full ${color}`} style={{ width: `${clampedProgress}%` }} role="progressbar" aria-valuenow={clampedProgress} aria-valuemin={0} aria-valuemax={100}></div>
            {label && <p className="text-xs text-gray-400 mt-1">{label}: {clampedProgress}%</p>}
        </div>
    );
};

export interface CollapsibleSectionProps { title: string; children: React.ReactNode; defaultOpen?: boolean; }
export const CollapsibleSection: React.FC<CollapsibleSectionProps> = ({ title, children, defaultOpen = false }) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);
    return (
        <Card className="p-0">
            <div className="flex justify-between items-center p-4 cursor-pointer hover:bg-gray-700/50 transition-colors duration-150" onClick={() => setIsOpen(!isOpen)}>
                <h4 className="text-lg font-semibold text-white">{title}</h4>
                <svg className={`h-5 w-5 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
            </div>
            {isOpen && <div className="p-4 border-t border-gray-700">{children}</div>}
        </Card>
    );
};

// ... (Forms for BackupPolicy, RecoveryPlan, StorageTarget would be here, but are omitted for brevity to focus on the main component structure)
// NOTE: In a real implementation, these forms would be extensive components. For this example, we assume they exist and are managed via modals.

const BackupAnalyticsDashboard: React.FC<{ analyticsData: any[] }> = ({ analyticsData }) => {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
                <h5 className="text-lg font-semibold text-white mb-4">Backup Success Rate (Last 30 Days)</h5>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={analyticsData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#4A5568" />
                        <XAxis dataKey="date" stroke="#A0AEC0" />
                        <YAxis stroke="#A0AEC0" />
                        <Tooltip contentStyle={{ backgroundColor: '#2D3748', border: '1px solid #4A5568' }} />
                        <Legend />
                        <Bar dataKey="success" stackId="a" fill="#48BB78" name="Successful" />
                        <Bar dataKey="failed" stackId="a" fill="#F56565" name="Failed" />
                    </BarChart>
                </ResponsiveContainer>
            </Card>
            <Card>
                <h5 className="text-lg font-semibold text-white mb-4">Data Growth & Cost (Last 30 Days)</h5>
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={analyticsData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#4A5568" />
                        <XAxis dataKey="date" stroke="#A0AEC0" />
                        <YAxis yAxisId="left" stroke="#38B2AC" label={{ value: 'GB', angle: -90, position: 'insideLeft', stroke: '#A0AEC0' }} />
                        <YAxis yAxisId="right" orientation="right" stroke="#D69E2E" label={{ value: 'USD', angle: -90, position: 'insideRight', stroke: '#A0AEC0' }} />
                        <Tooltip contentStyle={{ backgroundColor: '#2D3748', border: '1px solid #4A5568' }} />
                        <Legend />
                        <Line yAxisId="left" type="monotone" dataKey="dataBackedUpGB" stroke="#38B2AC" name="Data Backed Up (GB)" />
                        <Line yAxisId="right" type="monotone" dataKey="costUSD" stroke="#D69E2E" name="Estimated Cost (USD)" />
                    </LineChart>
                </ResponsiveContainer>
            </Card>
        </div>
    );
};

const GeoRedundancyMap: React.FC<{ targets: StorageTarget[] }> = ({ targets }) => {
    return (
        <Card>
            <MapContainer center={[20, 0]} zoom={2} style={{ height: '400px', width: '100%' }} className="bg-gray-700 rounded-lg">
                <TileLayer
                    url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                />
                {targets.map(target => (
                    <Marker key={target.id} position={target.coordinates}>
                        <Popup>
                            <div className="text-sm">
                                <p className="font-bold">{target.name}</p>
                                <p>{target.type} @ {target.location}</p>
                                <p>Used: {formatBytes(target.usedBytes)} / {formatBytes(target.capacityBytes)}</p>
                                <p>Status: {target.enabled ? 'Enabled' : 'Disabled'}</p>
                            </div>
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>
        </Card>
    );
};


// --- MAIN BACKUPRECOVERYVIEW COMPONENT ---

const BackupRecoveryView: React.FC = () => {
    const context = useContext(DataContext);
    if (!context) throw new Error("BackupRecoveryView must be within DataProvider");

    const { backupJobs: initialBackupJobs, services: availableServices } = context;

    // --- Core State Management ---
    const [detailedBackupJobs, setDetailedBackupJobs] = useState<DetailedBackupJob[]>(() => generateMockDetailedBackupJob(50));
    const [storageTargets, setStorageTargets] = useState<StorageTarget[]>(() => generateMockStorageTargets(3));
    const [backupPolicies, setBackupPolicies] = useState<BackupPolicy[]>(() => generateMockBackupPolicies(5, storageTargets));
    const [recoveryPlans, setRecoveryPlans] = useState<RecoveryPlan[]>(() => generateMockRecoveryPlans(5, backupPolicies));
    const [drDrills, setDrDrills] = useState<DRDrill[]>(() => generateMockDRDrills(10, recoveryPlans));
    const [alertRules, setAlertRules] = useState<AlertRule[]>(() => generateMockAlertRules(4));
    const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => generateMockAuditLogs(50));
    const [complianceReports, setComplianceReports] = useState<ComplianceReport[]>(() => generateMockComplianceReports(3));
    const [anomalies, setAnomalies] = useState<BackupAnomaly[]>(() => generateMockAnomalies(5, detailedBackupJobs));
    const [analyticsData, setAnalyticsData] = useState<any[]>(() => generateAnalyticsData());
    
    // --- UI State Management ---
    const [isSimulatorOpen, setSimulatorOpen] = useState(false);
    const [scenario, setScenario] = useState("Primary database corruption");
    const [aiPlan, setAiPlan] = useState('');
    const [isAiLoading, setIsAiLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('jobs'); // e.g. jobs, policies, plans, storage, etc.
    // ... extensive state for modals, forms, sorting, filtering, pagination ...
    
    // --- Derived State & Memorized Values ---
    const successfulBackups24h = useMemo(() => detailedBackupJobs.filter(job => job.status === BackupStatus.SUCCESS && new Date(job.timestamp).getTime() > Date.now() - 24 * 3600 * 1000).length, [detailedBackupJobs]);
    const totalBackups24h = useMemo(() => detailedBackupJobs.filter(job => new Date(job.timestamp).getTime() > Date.now() - 24 * 3600 * 1000).length, [detailedBackupJobs]);
    const backupSuccessRate = useMemo(() => totalBackups24h > 0 ? (successfulBackups24h / totalBackups24h * 100).toFixed(2) : 'N/A', [successfulBackups24h, totalBackups24h]);
    const totalStorageCapacity = useMemo(() => storageTargets.reduce((sum, t) => sum + t.capacityBytes, 0), [storageTargets]);
    const totalStorageUsed = useMemo(() => storageTargets.reduce((sum, t) => sum + t.usedBytes, 0), [storageTargets]);
    const storageUtilization = useMemo(() => totalStorageCapacity > 0 ? (totalStorageUsed / totalStorageCapacity * 100).toFixed(2) : '0', [totalStorageCapacity, totalStorageUsed]);

    // --- API & State Update Handlers ---
    const handleSimulate = async () => {
        setIsAiLoading(true); setAiPlan('');
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.REACT_APP_GEMINI_API_KEY as string });
            const prompt = `Generate a high-level disaster recovery plan (DRP) for this scenario: "${scenario}". Include steps for failover, data restoration, and post-recovery validation. Make it detailed, around 500 words, and structured with headings.`;
            const model = ai.getGenerativeModel({ model: 'gemini-pro' });
            const result = await model.generateContent(prompt);
            const response = await result.response;
            const text = response.text();
            setAiPlan(text);
        } catch (err) {
            console.error("AI Simulation Error:", err);
            setAiPlan("Failed to generate plan. Please check API key and try again. Error: " + (err as Error).message);
        } finally {
            setIsAiLoading(false);
        }
    };
    
    // In a real application, these would be in separate files and much more complex.
    const renderTable = (data: any[], columns: { key: string, label: string, render?: (item: any) => React.ReactNode }[]) => (
        <table className="w-full text-sm text-gray-300">
            <thead className="text-xs text-gray-300 uppercase bg-gray-900/30">
                <tr>{columns.map(c => <th key={c.key} scope="col" className="px-4 py-2 text-left">{c.label}</th>)}</tr>
            </thead>
            <tbody>
                {data.map(item => (
                    <tr key={item.id} className="border-b border-gray-700 hover:bg-gray-800/50">
                        {columns.map(col => <td key={col.key} className="px-4 py-2">{col.render ? col.render(item) : item[col.key]}</td>)}
                    </tr>
                ))}
            </tbody>
        </table>
    );
    
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold text-white tracking-wider">Backup & Recovery Operations Center</h2>
                <div className="flex space-x-3">
                    <ActionButton label="Manual Backup" onClick={() => alert('Open Manual Backup Modal')} variant="primary" />
                    <ActionButton label="AI DR Plan Simulator" onClick={() => setSimulatorOpen(true)} variant="secondary" />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="text-center"><p className="text-3xl font-bold text-green-400">{backupSuccessRate}%</p><p className="text-sm text-gray-400 mt-1">Backup Success (24h)</p></Card>
                <Card className="text-center"><p className="text-3xl font-bold text-white">4h</p><p className="text-sm text-gray-400 mt-1">Avg. RPO</p></Card>
                <Card className="text-center"><p className="text-3xl font-bold text-white">2h</p><p className="text-sm text-gray-400 mt-1">Avg. RTO</p></Card>
                <Card className="text-center"><p className="text-3xl font-bold text-cyan-400">{storageUtilization}%</p><p className="text-sm text-gray-400 mt-1">Storage Utilization</p></Card>
            </div>
            
            <CollapsibleSection title="Analytics & Reporting" defaultOpen={true}>
                <BackupAnalyticsDashboard analyticsData={analyticsData} />
            </CollapsibleSection>
            
            <CollapsibleSection title="AI-Powered Anomaly Detection" defaultOpen={true}>
                {renderTable(anomalies, [
                    { key: 'timestamp', label: 'Timestamp' },
                    { key: 'service', label: 'Service' },
                    { key: 'type', label: 'Anomaly Type', render: (item) => <StatusBadge status={item.type} type="warning" /> },
                    { key: 'description', label: 'Description' },
                    { key: 'severity', label: 'Severity', render: (item) => <StatusBadge status={item.severity} type="error" /> },
                    { key: 'status', label: 'Status', render: (item) => <StatusBadge status={item.status} type="info" /> },
                    { key: 'actions', label: 'Actions', render: () => <ActionButton label="Investigate" onClick={() => {}} variant="secondary" className="px-2 py-1"/> }
                ])}
            </CollapsibleSection>

            <CollapsibleSection title="Geographic Redundancy" defaultOpen={true}>
                <GeoRedundancyMap targets={storageTargets} />
            </CollapsibleSection>
            
            <CollapsibleSection title="Recent Backup Jobs">
                {renderTable(detailedBackupJobs.slice(0, 10), [
                     { key: 'service', label: 'Service' },
                     { key: 'type', label: 'Type' },
                     { key: 'status', label: 'Status', render: (item) => <StatusBadge status={item.status}/> },
                     { key: 'timestamp', label: 'Timestamp' },
                     { key: 'duration', label: 'Duration' },
                     { key: 'size', label: 'Size', render: (item) => formatBytes(item.size) },
                     { key: 'progress', label: 'Progress', render: (item) => <ProgressBar progress={item.progress} /> },
                     { key: 'actions', label: 'Actions', render: () => <ActionButton label="Details" onClick={() => {}} variant="secondary" className="px-2 py-1"/>}
                ])}
            </CollapsibleSection>

            <CollapsibleSection title="Backup Policies">
                <div className="mb-4 flex justify-end">
                    <ActionButton label="Create New Policy" onClick={() => {}} />
                </div>
                 {renderTable(backupPolicies, [
                     { key: 'name', label: 'Name' },
                     { key: 'services', label: 'Services', render: (item) => item.services.join(', ') },
                     { key: 'frequency', label: 'Frequency' },
                     { key: 'retentionDays', label: 'Retention', render: (item) => `${item.retentionDays} days` },
                     { key: 'status', label: 'Status', render: (item) => <StatusBadge status={item.enabled ? 'ACTIVE' : 'DISABLED'} type={item.enabled ? 'success' : 'error'}/> },
                     { key: 'actions', label: 'Actions', render: () => <><ActionButton label="Edit" onClick={() => {}} variant="secondary" className="px-2 py-1 mr-2"/><ActionButton label="Delete" onClick={() => {}} variant="danger" className="px-2 py-1"/></>}
                ])}
            </CollapsibleSection>

            <CollapsibleSection title="Recovery Plans & DR Drills">
                <div className="mb-4 flex justify-end space-x-2">
                    <ActionButton label="Create New Plan" onClick={() => {}} />
                    <ActionButton label="Trigger DR Drill" onClick={() => {}} variant="danger" />
                </div>
                <h4 className="text-xl font-semibold text-white mb-3">Recovery Plans</h4>
                {renderTable(recoveryPlans, [
                     { key: 'name', label: 'Name' },
                     { key: 'targetServices', label: 'Target Services', render: (item) => item.targetServices.join(', ') },
                     { key: 'rtoValue', label: 'RTO', render: (item) => `${item.rtoValue} ${item.rtoUnit}` },
                     { key: 'status', label: 'Status', render: (item) => <StatusBadge status={item.status}/> },
                     { key: 'lastTested', label: 'Last Tested', render: (item) => item.lastTested || 'Never' },
                     { key: 'actions', label: 'Actions', render: () => <><ActionButton label="Edit" onClick={() => {}} variant="secondary" className="px-2 py-1 mr-2"/><ActionButton label="Delete" onClick={() => {}} variant="danger" className="px-2 py-1"/></>}
                ])}
                <h4 className="text-xl font-semibold text-white my-3">Recent DR Drills</h4>
                {renderTable(drDrills.slice(0, 5), [
                     { key: 'planName', label: 'Plan' },
                     { key: 'startTime', label: 'Start Time' },
                     { key: 'status', label: 'Status', render: (item) => <StatusBadge status={item.status}/> },
                     { key: 'outcome', label: 'Outcome' },
                     { key: 'actions', label: 'Actions', render: () => <ActionButton label="View Logs" onClick={() => {}} variant="secondary" className="px-2 py-1"/>}
                ])}
            </CollapsibleSection>

            <CollapsibleSection title="Storage Targets">
                <div className="mb-4 flex justify-end">
                    <ActionButton label="Add New Target" onClick={() => {}} />
                </div>
                {renderTable(storageTargets, [
                    { key: 'name', label: 'Name' },
                    { key: 'type', label: 'Type' },
                    { key: 'location', label: 'Location' },
                    { key: 'capacityBytes', label: 'Capacity', render: (item) => formatBytes(item.capacityBytes) },
                    { key: 'usedBytes', label: 'Used', render: (item) => formatBytes(item.usedBytes) },
                    { key: 'utilization', label: 'Utilization', render: (item) => <ProgressBar progress={(item.usedBytes / item.capacityBytes) * 100} /> },
                    { key: 'status', label: 'Status', render: (item) => <StatusBadge status={item.enabled ? 'ACTIVE' : 'DISABLED'} type={item.enabled ? 'success' : 'error'}/> },
                    { key: 'actions', label: 'Actions', render: () => <><ActionButton label="Edit" onClick={() => {}} variant="secondary" className="px-2 py-1 mr-2"/><ActionButton label="Delete" onClick={() => {}} variant="danger" className="px-2 py-1"/></>}
                ])}
            </CollapsibleSection>

            <CollapsibleSection title="Audit Logs">
                {renderTable(auditLogs.slice(0, 15), [
                    { key: 'timestamp', label: 'Timestamp' },
                    { key: 'actor', label: 'Actor' },
                    { key: 'action', label: 'Action' },
                    { key: 'target', label: 'Target' },
                    { key: 'ipAddress', label: 'IP Address' }
                ])}
            </CollapsibleSection>

            <Modal isOpen={isSimulatorOpen} onClose={() => setSimulatorOpen(false)} title="AI DR Plan Simulator">
                <div className="p-6 space-y-4">
                    <label htmlFor="scenarioInput" className="block text-sm font-medium text-gray-400">Describe your disaster scenario:</label>
                    <textarea id="scenarioInput" value={scenario} onChange={e => setScenario(e.target.value)}
                        className="w-full bg-gray-700/50 p-2 rounded border border-gray-600 focus:border-cyan-500 outline-none min-h-[100px]"
                        placeholder="e.g., 'Primary data center outage affecting all services', 'Ransomware attack encrypting critical databases'"
                    />
                    <ActionButton label="Simulate DR Plan" onClick={handleSimulate} isLoading={isAiLoading} loadingText="Simulating..." className="w-full"/>
                    {aiPlan && (
                        <Card title="Simulated Plan">
                            <div className="min-h-[10rem] max-h-60 overflow-y-auto text-sm text-gray-300 whitespace-pre-line p-2 bg-gray-900/30 rounded">
                                {aiPlan}
                            </div>
                        </Card>
                    )}
                </div>
            </Modal>
        </div>
    );
};

export default BackupRecoveryView;

================================================================================
// APPENDED FROM REPO: diplomat-bit/Fuckyou | ORIGINAL PATH: diplomat-bit-Fuckyou-70f83c5/components/views/megadashboard/infra/BackupRecoveryView.tsx
================================================================================

// components/views/megadashboard/infra/BackupRecoveryView.tsx
import React, { useContext, useState } from 'react';
import Card from '../../../Card';
import { DataContext } from '../../../../context/DataContext';
import { GoogleGenAI } from "@google/genai";

const BackupRecoveryView: React.FC = () => {
    const context = useContext(DataContext);
    if (!context) throw new Error("BackupRecoveryView must be within DataProvider");
    
    const { backupJobs } = context;
    const [isSimulatorOpen, setSimulatorOpen] = useState(false);
    const [scenario, setScenario] = useState("Primary database corruption");
    const [plan, setPlan] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSimulate = async () => {
        setIsLoading(true); setPlan('');
        try {
            // NOTE: The API key is not needed for this specific API call as per the instruction.
            // However, the GoogleGenAI SDK requires an API key for initialization.
            // In a real-world scenario, you would use an API key that is securely managed.
            // For this example, we'll use a placeholder or environment variable if available.
            const apiKey = process.env.REACT_APP_GEMINI_API_KEY || "YOUR_PLACEHOLDER_API_KEY"; // Replace with your actual API key management strategy
            const ai = new GoogleGenAI({apiKey: apiKey});
            
            // Constructing the prompt to be sent to the AI model.
            // The prompt is designed to elicit a disaster recovery plan based on the provided scenario.
            const prompt = `Generate a high-level disaster recovery plan (DRP) for this scenario: "${scenario}". Include steps for failover, data restoration, and post-recovery validation.`;
            
            // Calling the Gemini API to generate content.
            // We are using the 'gemini-2.5-flash' model for its speed and efficiency.
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash', 
                contents: [{ role: "user", parts: [{ text: prompt }] }]
            });
            
            // Extracting the text content from the AI's response.
            setPlan(response.response.candidates[0].content.parts[0].text);
        } catch(err) { 
            console.error("Error simulating DR plan:", err); 
            setPlan("Failed to generate DR plan. Please check console for errors.");
        } finally { 
            setIsLoading(false); 
        }
    };

    return (
        <>
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <h2 className="text-3xl font-bold text-white tracking-wider">Backup & Recovery</h2>
                    <button onClick={() => setSimulatorOpen(true)} className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg text-sm font-medium">AI DR Plan Simulator</button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card className="text-center"><p className="text-3xl font-bold text-green-400">100%</p><p className="text-sm text-gray-400 mt-1">Backup Success (24h)</p></Card>
                    <Card className="text-center"><p className="text-3xl font-bold text-white">4h</p><p className="text-sm text-gray-400 mt-1">Recovery Point Objective</p></Card>
                    <Card className="text-center"><p className="text-3xl font-bold text-white">1h</p><p className="text-sm text-gray-400 mt-1">Recovery Time Objective</p></Card>
                </div>
                <Card title="Recent Backup Jobs">
                    <table className="w-full text-sm">
                        <thead className="text-xs text-gray-300 uppercase bg-gray-900/30"><tr><th>Service</th><th>Status</th><th>Timestamp</th><th>Duration</th></tr></thead>
                        <tbody>{backupJobs.map(job => <tr key={job.id}><td>{job.service}</td><td><span className="text-green-400">{job.status}</span></td><td>{job.timestamp}</td><td>{job.duration}</td></tr>)}</tbody>
                    </table>
                </Card>
            </div>
            {isSimulatorOpen && (
                 <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50" onClick={() => setSimulatorOpen(false)}>
                    <div className="bg-gray-800 rounded-lg shadow-2xl max-w-2xl w-full" onClick={e=>e.stopPropagation()}>
                        <div className="p-4 border-b border-gray-700"><h3 className="text-lg font-semibold text-white">AI DR Plan Simulator</h3></div>
                        <div className="p-6 space-y-4">
                            <input 
                                type="text" 
                                value={scenario} 
                                onChange={e => setScenario(e.target.value)} 
                                className="w-full bg-gray-700/50 p-2 rounded text-white focus:outline-none focus:ring-2 focus:ring-cyan-500" 
                                placeholder="Enter disaster scenario..."
                            />
                            <button 
                                onClick={handleSimulate} 
                                disabled={isLoading} 
                                className="w-full py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded disabled:opacity-50 font-medium transition-colors duration-200"
                            >
                                {isLoading ? 'Simulating...' : 'Simulate DR Plan'}
                            </button>
                            {plan && (
                                <Card title="Simulated Plan">
                                    <div className="min-h-[10rem] max-h-60 overflow-y-auto text-sm text-gray-300 whitespace-pre-line p-4 border border-gray-700 rounded-md">
                                        {plan}
                                    </div>
                                </Card>
                            )}
                        </div>
                        <div className="p-4 border-t border-gray-700 flex justify-end">
                            <button onClick={() => setSimulatorOpen(false)} className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg text-sm font-medium">Close</button>
                        </div>
                    </div>
                 </div>
            )}
        </>
    );
};

export default BackupRecoveryView;

================================================================================
// APPENDED FROM REPO: diplomat-bit/magic | ORIGINAL PATH: diplomat-bit-magic-a3f5ff1/components/views/megadashboard/infra/BackupRecoveryView.tsx
================================================================================

// components/views/megadashboard/infra/BackupRecoveryView.tsx
import React, { useContext, useState } from 'react';
import Card from '../../../Card';
import { DataContext } from '../../../../context/DataContext';
import { GoogleGenAI } from "@google/genai";

const BackupRecoveryView: React.FC = () => {
    const context = useContext(DataContext);
    if (!context) throw new Error("BackupRecoveryView must be within DataProvider");
    
    const { backupJobs } = context;
    const [isSimulatorOpen, setSimulatorOpen] = useState(false);
    const [scenario, setScenario] = useState("Primary database corruption");
    const [plan, setPlan] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSimulate = async () => {
        setIsLoading(true); setPlan('');
        try {
            // NOTE: The API key is not needed for this specific API call as per the instruction.
            // However, the GoogleGenAI SDK requires an API key for initialization.
            // In a real-world scenario, you would use an API key that is securely managed.
            // For this example, we'll use a placeholder or environment variable if available.
            const apiKey = process.env.REACT_APP_GEMINI_API_KEY || "YOUR_PLACEHOLDER_API_KEY"; // Replace with your actual API key management strategy
            const ai = new GoogleGenAI({apiKey: apiKey});
            
            // Constructing the prompt to be sent to the AI model.
            // The prompt is designed to elicit a disaster recovery plan based on the provided scenario.
            const prompt = `Generate a high-level disaster recovery plan (DRP) for this scenario: "${scenario}". Include steps for failover, data restoration, and post-recovery validation.`;
            
            // Calling the Gemini API to generate content.
            // We are using the 'gemini-2.5-flash' model for its speed and efficiency.
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash', 
                contents: [{ role: "user", parts: [{ text: prompt }] }]
            });
            
            // Extracting the text content from the AI's response.
            setPlan(response.response.candidates[0].content.parts[0].text);
        } catch(err) { 
            console.error("Error simulating DR plan:", err); 
            setPlan("Failed to generate DR plan. Please check console for errors.");
        } finally { 
            setIsLoading(false); 
        }
    };

    return (
        <>
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <h2 className="text-3xl font-bold text-white tracking-wider">Backup & Recovery</h2>
                    <button onClick={() => setSimulatorOpen(true)} className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg text-sm font-medium">AI DR Plan Simulator</button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card className="text-center"><p className="text-3xl font-bold text-green-400">100%</p><p className="text-sm text-gray-400 mt-1">Backup Success (24h)</p></Card>
                    <Card className="text-center"><p className="text-3xl font-bold text-white">4h</p><p className="text-sm text-gray-400 mt-1">Recovery Point Objective</p></Card>
                    <Card className="text-center"><p className="text-3xl font-bold text-white">1h</p><p className="text-sm text-gray-400 mt-1">Recovery Time Objective</p></Card>
                </div>
                <Card title="Recent Backup Jobs">
                    <table className="w-full text-sm">
                        <thead className="text-xs text-gray-300 uppercase bg-gray-900/30"><tr><th>Service</th><th>Status</th><th>Timestamp</th><th>Duration</th></tr></thead>
                        <tbody>{backupJobs.map(job => <tr key={job.id}><td>{job.service}</td><td><span className="text-green-400">{job.status}</span></td><td>{job.timestamp}</td><td>{job.duration}</td></tr>)}</tbody>
                    </table>
                </Card>
            </div>
            {isSimulatorOpen && (
                 <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50" onClick={() => setSimulatorOpen(false)}>
                    <div className="bg-gray-800 rounded-lg shadow-2xl max-w-2xl w-full" onClick={e=>e.stopPropagation()}>
                        <div className="p-4 border-b border-gray-700"><h3 className="text-lg font-semibold text-white">AI DR Plan Simulator</h3></div>
                        <div className="p-6 space-y-4">
                            <input 
                                type="text" 
                                value={scenario} 
                                onChange={e => setScenario(e.target.value)} 
                                className="w-full bg-gray-700/50 p-2 rounded text-white focus:outline-none focus:ring-2 focus:ring-cyan-500" 
                                placeholder="Enter disaster scenario..."
                            />
                            <button 
                                onClick={handleSimulate} 
                                disabled={isLoading} 
                                className="w-full py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded disabled:opacity-50 font-medium transition-colors duration-200"
                            >
                                {isLoading ? 'Simulating...' : 'Simulate DR Plan'}
                            </button>
                            {plan && (
                                <Card title="Simulated Plan">
                                    <div className="min-h-[10rem] max-h-60 overflow-y-auto text-sm text-gray-300 whitespace-pre-line p-4 border border-gray-700 rounded-md">
                                        {plan}
                                    </div>
                                </Card>
                            )}
                        </div>
                        <div className="p-4 border-t border-gray-700 flex justify-end">
                            <button onClick={() => setSimulatorOpen(false)} className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg text-sm font-medium">Close</button>
                        </div>
                    </div>
                 </div>
            )}
        </>
    );
};

export default BackupRecoveryView;