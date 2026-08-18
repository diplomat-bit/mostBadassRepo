// REPOSITORY SOURCE: diplomat-bit/Citibank_Demo_Business_Inc_Demonstration- | PATH: diplomat-bit-Citibank_Demo_Business_Inc_Demonstration--ab2501d/components/views/platform/DemoBankCloudView.tsx
================================================================================

import React, { useState, useEffect, useCallback, useMemo, FC, createContext, useContext, ReactNode } from 'react';
import Card from '../../Card';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, Legend, PieChart, Pie, Cell, LineChart, Line, CartesianGrid } from 'recharts';
import { FaServer, FaDatabase, FaHdd, FaNetworkWired, FaBrain, FaShieldAlt, FaVpc, FaCodeBranch, FaUserShield, FaStore, FaFileInvoiceDollar, FaExclamationTriangle, FaCheckCircle, FaSpinner, FaUsers, FaSearch, FaLightbulb } from 'react-icons/fa';
import ReactFlow, { MiniMap, Controls, Background, Elements } from 'react-flow-renderer';


// --- ENHANCED TYPES FOR A REAL-WORLD APPLICATION ---

export type ServiceStatus = 'Running' | 'Stopped' | 'Pending' | 'Error' | 'Available' | 'Updating' | 'Terminated';
export type CloudRegion = 'us-east-1' | 'us-west-2' | 'eu-central-1' | 'ap-southeast-2' | 'sa-east-1';
export type InstanceType = 't3.micro' | 'm5.large' | 'c5.2xlarge' | 'g4dn.xlarge' | 'r6g.4xlarge' | 'i3.metal';
export type AlertSeverity = 'Critical' | 'High' | 'Medium' | 'Low' | 'Info';
export type LogLevel = 'INFO' | 'WARN' | 'ERROR' | 'DEBUG' | 'FATAL';
export type DeploymentStatus = 'Success' | 'In Progress' | 'Failed' | 'Rolled Back' | 'Cancelled';
export type UserRole = 'Admin' | 'Developer' | 'Viewer' | 'BillingManager' | 'SecurityAnalyst';
export type ServiceType = 'Compute' | 'Storage' | 'Database' | 'Networking' | 'AI/ML' | 'Security';
export type ComplianceStandard = 'SOC2' | 'HIPAA' | 'PCI-DSS' | 'GDPR' | 'ISO/IEC 27001';
export type VulnerabilitySeverity = 'Critical' | 'High' | 'Medium' | 'Low';


export interface CloudService {
  id: string;
  name: string;
  type: ServiceType;
  status: ServiceStatus;
  region: CloudRegion;
  instanceType: InstanceType;
  createdAt: Date;
  uptime: number; // in hours
  costPerHour: number;
  tags: Record<string, string>;
  publicIp?: string;
  privateIp: string;
  vpcId: string;
}

export interface ServiceMetricPoint {
  timestamp: number;
  cpu_percent: number;
  memory_percent: number;
  disk_io_read: number; // kb/s
  disk_io_write: number; // kb/s
  network_in: number; // kb/s
  network_out: number; // kb/s
}

export interface ServiceLogEntry {
  id: string;
  timestamp: Date;
  level: LogLevel;
  message: string;
  serviceId: string;
}

export interface ActiveAlert {
  id: string;
  serviceId: string;
  serviceName: string;
  severity: AlertSeverity;
  message: string;
  timestamp: Date;
  acknowledged: boolean;
  resolved: boolean;
}

export interface BillingInvoice {
    id: string;
    month: string;
    amount: number;
    status: 'Paid' | 'Due' | 'Overdue';
    dueDate: Date;
    pdfUrl: string;
}

export interface IaCDeployment {
    id: string;
    templateName: string;
    version: string;
    deployedBy: string;
    timestamp: Date;
    status: DeploymentStatus;
    changelog: string;
    commitHash: string;
}

export interface IAMUser {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    lastLogin: Date;
    mfaEnabled: boolean;
    groups: string[];
}

export interface VPC {
    id: string;
    name: string;
    cidrBlock: string;
    region: CloudRegion;
}

export interface Subnet {
    id: string;
    name: string;
    cidrBlock: string;
    vpcId: string;
    availabilityZone: string;
}

export interface SecurityGroup {
    id: string;
    name: string;
    description: string;
    vpcId: string;
    inboundRules: SecurityGroupRule[];
    outboundRules: SecurityGroupRule[];
}

export interface SecurityGroupRule {
    protocol: 'TCP' | 'UDP' | 'ICMP' | 'ALL';
    portRange: string;
    source: string; // CIDR block or SG ID
    description: string;
}

export interface ComplianceReport {
    id: string;
    standard: ComplianceStandard;
    status: 'Compliant' | 'Non-Compliant' | 'In Audit';
    lastAuditDate: Date;
    reportUrl: string;
}

export interface Vulnerability {
    id: string;
    cveId: string;
    severity: VulnerabilitySeverity;
    description: string;
    affectedResource: string;
    detectedAt: Date;
    status: 'Open' | 'Patched' | 'Ignored';
}

export interface MarketplaceApp {
    id: string;
    name: string;
    vendor: string;
    category: 'Databases' | 'Analytics' | 'DevOps' | 'Security' | 'Web';
    version: string;
    description: string;
    logoUrl: string; // A path or data URI
    monthlyPrice: number;
}

export interface AIInsight {
    id: string;
    type: 'Cost' | 'Security' | 'Performance' | 'Reliability';
    severity: 'High' | 'Medium' | 'Low';
    title: string;
    description: string;
    recommendation: string;
    relatedResourceId: string;
}

// --- MOCK DATA GENERATION FOR A REAL-WORLD SIMULATION ---

const REGIONS: CloudRegion[] = ['us-east-1', 'us-west-2', 'eu-central-1', 'ap-southeast-2', 'sa-east-1'];
const SERVICE_TYPES: CloudService['type'][] = ['Compute', 'Storage', 'Database', 'Networking', 'AI/ML', 'Security'];
const INSTANCE_TYPES: InstanceType[] = ['t3.micro', 'm5.large', 'c5.2xlarge', 'g4dn.xlarge', 'r6g.4xlarge', 'i3.metal'];
const STATUSES: ServiceStatus[] = ['Running', 'Stopped', 'Pending', 'Error', 'Available', 'Updating'];

const generateRandomIp = () => `${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}`;

export const generateMockVPCs = (): VPC[] => [
    { id: 'vpc-prod-use1', name: 'vpc-production-us-east-1', cidrBlock: '10.0.0.0/16', region: 'us-east-1' },
    { id: 'vpc-prod-euw1', name: 'vpc-production-eu-central-1', cidrBlock: '10.1.0.0/16', region: 'eu-central-1' },
    { id: 'vpc-dev-use1', name: 'vpc-development-us-east-1', cidrBlock: '10.2.0.0/16', region: 'us-east-1' },
];
const mockVPCs = generateMockVPCs();

export const generateMockServices = (count: number): CloudService[] => {
    return Array.from({ length: count }, (_, i) => {
        const type = SERVICE_TYPES[i % SERVICE_TYPES.length];
        const region = REGIONS[i % REGIONS.length];
        const vpc = mockVPCs.find(v => v.region === region) || mockVPCs[0];
        return {
            id: `srv-${Date.now()}-${i}`,
            name: `${type.toLowerCase().replace('/','-')}-${i.toString().padStart(3,'0')}-${region.split('-')[0]}`,
            type,
            status: STATUSES[Math.floor(Math.random() * STATUSES.length)],
            region,
            instanceType: INSTANCE_TYPES[Math.floor(Math.random() * INSTANCE_TYPES.length)],
            createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
            uptime: Math.floor(Math.random() * 720),
            costPerHour: parseFloat((0.05 + Math.random() * 2).toFixed(4)),
            tags: { project: `project-${i%5}`, owner: `team-${['alpha', 'beta', 'gamma'][i%3]}` },
            publicIp: type === 'Compute' ? generateRandomIp() : undefined,
            privateIp: `10.0.${Math.floor(i/256)}.${i%256}`,
            vpcId: vpc.id,
        };
    });
};

export const generateMockAlerts = (services: CloudService[]): ActiveAlert[] => {
    const alerts: ActiveAlert[] = [];
    services.forEach(service => {
        if (service.status === 'Error' || Math.random() < 0.1) {
             alerts.push({
                id: `alert-${service.id}-${Date.now()}`,
                serviceId: service.id,
                serviceName: service.name,
                severity: ['Critical', 'High', 'Medium'][Math.floor(Math.random()*3)] as AlertSeverity,
                message: service.status === 'Error' ? 'Service entered error state' : ['High CPU utilization (>95%)', 'Memory leak detected', 'Low disk space (< 1GB)'][Math.floor(Math.random()*3)],
                timestamp: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000),
                acknowledged: Math.random() > 0.5,
                resolved: false,
            });
        }
    });
    return alerts;
};

const LOG_MESSAGES: Record<LogLevel, string[]> = {
    INFO: ["User authentication successful", "Service started successfully", "Configuration loaded", "Data processing complete"],
    WARN: ["High latency detected on upstream service", "Disk space nearing capacity", "API rate limit approaching"],
    ERROR: ["Failed to connect to database", "Null pointer exception at processData()", "Upstream service timeout"],
    DEBUG: ["Executing query...", "Payload received", "Variable dump"],
    FATAL: ["Unrecoverable error: Corrupted data store", "System shutting down due to critical failure"]
};

export const generateMockLogs = (serviceId: string, count: number): ServiceLogEntry[] => {
    return Array.from({ length: count }, (_, i) => {
        const levels = Object.keys(LOG_MESSAGES) as LogLevel[];
        const level = levels[Math.floor(Math.pow(Math.random(), 2) * levels.length)];
        return {
            id: `log-${serviceId}-${Date.now()}-${i}`,
            timestamp: new Date(Date.now() - i * 60 * 1000 * Math.random()),
            level,
            message: LOG_MESSAGES[level][Math.floor(Math.random() * LOG_MESSAGES[level].length)],
            serviceId,
        };
    }).sort((a,b) => b.timestamp.getTime() - a.timestamp.getTime());
};

export const generateMockMetrics = (hours: number): ServiceMetricPoint[] => {
    const now = Date.now();
    return Array.from({ length: hours * 60 }, (_, i) => ({
        timestamp: now - (hours * 60 - i) * 60 * 1000,
        cpu_percent: Math.min(99, 20 + Math.random() * 30 + Math.sin(i / 60) * 15),
        memory_percent: 45 + Math.random() * 20,
        disk_io_read: Math.random() * 500,
        disk_io_write: Math.random() * 300,
        network_in: 1000 + Math.random() * 2000,
        network_out: 500 + Math.random() * 1000,
    }));
};

export const generateMockInvoices = (): BillingInvoice[] => {
    return Array.from({ length: 12 }, (_, i) => {
        const d = new Date();
        d.setMonth(d.getMonth() - i);
        return {
            id: `inv-${d.getFullYear()}-${d.getMonth()+1}`,
            month: d.toLocaleString('default', { month: 'long', year: 'numeric' }),
            amount: 38000 + Math.random() * 5000 * (i === 1 ? 1.5 : 1), // Spike last month for anomaly
            status: i === 0 ? 'Due' : 'Paid',
            dueDate: new Date(d.getFullYear(), d.getMonth() + 1, 15),
            pdfUrl: `#`,
        };
    });
};

export const generateMockDeployments = (): IaCDeployment[] => {
    const users = ['alice@demobank.com', 'bob@demobank.com', 'charlie@demobank.com'];
    const templates = ['vpc-prod', 'rds-main-cluster', 'k8s-platform', 'data-pipeline'];
    return Array.from({length: 20}, (_, i) => ({
        id: `deploy-${Date.now()}-${i}`,
        templateName: templates[i % templates.length],
        version: `v1.${5 - Math.floor(i/4)}.${i%4}`,
        deployedBy: users[i % users.length],
        timestamp: new Date(Date.now() - i * 6 * 60 * 60 * 1000),
        status: ['Success', 'Success', 'Success', 'Failed', 'In Progress'][Math.floor(Math.random() * 4.5)] as DeploymentStatus,
        changelog: `Update ${templates[i % templates.length]} to version ${`v1.${5 - Math.floor(i/4)}.${i%4}`}.`,
        commitHash: (Math.random() + 1).toString(36).substring(2, 9),
    }));
};

export const generateMockUsers = (): IAMUser[] => {
    return [
        { id: 'usr-1', name: 'Alice Wonder', email: 'alice@demobank.com', role: 'Admin', lastLogin: new Date(Date.now() - 30 * 60 * 1000), mfaEnabled: true, groups: ['Admins', 'Core-Infra'] },
        { id: 'usr-2', name: 'Bob Builder', email: 'bob@demobank.com', role: 'Developer', lastLogin: new Date(Date.now() - 2 * 60 * 60 * 1000), mfaEnabled: true, groups: ['Developers', 'Project-Alpha'] },
        { id: 'usr-3', name: 'Charlie Bucket', email: 'charlie@demobank.com', role: 'Developer', lastLogin: new Date(Date.now() - 25 * 60 * 60 * 1000), mfaEnabled: false, groups: ['Developers', 'Project-Beta'] },
        { id: 'usr-4', name: 'Diana Prince', email: 'diana@demobank.com', role: 'Viewer', lastLogin: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), mfaEnabled: true, groups: ['Viewers'] },
        { id: 'usr-5', name: 'Eve Moneypenny', email: 'eve@demobank.com', role: 'BillingManager', lastLogin: new Date(Date.now() - 8 * 60 * 60 * 1000), mfaEnabled: true, groups: ['Billing'] },
        { id: 'usr-6', name: 'Frank Castle', email: 'frank@demobank.com', role: 'SecurityAnalyst', lastLogin: new Date(Date.now() - 4 * 60 * 60 * 1000), mfaEnabled: true, groups: ['Security', 'Admins'] },
    ];
};

export const generateMockSecurityData = (): { reports: ComplianceReport[], vulnerabilities: Vulnerability[] } => ({
    reports: [
        { id: 'comp-1', standard: 'SOC2', status: 'Compliant', lastAuditDate: new Date(Date.now() - 80 * 24 * 60 * 60 * 1000), reportUrl: '#' },
        { id: 'comp-2', standard: 'HIPAA', status: 'Compliant', lastAuditDate: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000), reportUrl: '#' },
        { id: 'comp-3', standard: 'PCI-DSS', status: 'In Audit', lastAuditDate: new Date(Date.now() - 300 * 24 * 60 * 60 * 1000), reportUrl: '#' },
        { id: 'comp-4', standard: 'GDPR', status: 'Non-Compliant', lastAuditDate: new Date(Date.now() - 150 * 24 * 60 * 60 * 1000), reportUrl: '#' },
    ],
    vulnerabilities: [
        { id: 'vuln-1', cveId: 'CVE-2023-4863', severity: 'Critical', description: 'Heap buffer overflow in libwebp', affectedResource: 'srv-compute-003-us', detectedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), status: 'Open' },
        { id: 'vuln-2', cveId: 'CVE-2023-38545', severity: 'High', description: 'SOCKS5 heap buffer overflow in curl', affectedResource: 'srv-compute-015-eu', detectedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), status: 'Patched' },
        { id: 'vuln-3', cveId: 'CVE-2023-29491', severity: 'Medium', description: 'Information disclosure in OpenSSL', affectedResource: 'srv-database-002-ap', detectedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), status: 'Open' },
    ]
});

export const generateMockMarketplaceApps = (): MarketplaceApp[] => [
    { id: 'app-1', name: 'QuantumLeap DB', vendor: 'FutureData', category: 'Databases', version: '3.14', description: 'A hyper-scalable post-quantum database.', logoUrl: 'FaDatabase', monthlyPrice: 1500 },
    { id: 'app-2', name: 'CodeGuardian', vendor: 'SecuriCode', category: 'Security', version: '2.0.1', description: 'AI-powered continuous security scanning for your repos.', logoUrl: 'FaShieldAlt', monthlyPrice: 500 },
    { id: 'app-3', name: 'DeploySphere', vendor: 'CI/CD Solutions', category: 'DevOps', version: '5.2.0', description: 'Automated multi-cloud deployment pipelines.', logoUrl: 'FaCodeBranch', monthlyPrice: 350 },
    { id: 'app-4', name: 'InsightEngine', vendor: 'DataViz Inc.', category: 'Analytics', version: '7.8.2', description: 'Natural language business intelligence and visualization.', logoUrl: 'FaBrain', monthlyPrice: 2000 },
    { id: 'app-5', name: 'Nginx WebStack', vendor: 'Community', category: 'Web', version: '1.25.3', description: 'Pre-configured high-performance Nginx web server stack.', logoUrl: 'FaServer', monthlyPrice: 50 },
];

// --- MOCK API LAYER ---

const mockApi = {
    getDashboardMetrics: async (region: CloudRegion | 'all') => {
        await new Promise(res => setTimeout(res, 500));
        const services = mockServices.filter(s => region === 'all' || s.region === region);
        const alerts = mockAlerts.filter(a => region === 'all' || services.find(s => s.id === a.serviceId)?.region === region);
        const totalCost = services.reduce((acc, s) => acc + (s.costPerHour * s.uptime), 0);
        return {
            activeServices: services.filter(s => s.status === 'Running').length,
            totalServices: services.length,
            uptime: 99.99,
            monthlyCost: totalCost,
            activeAlerts: alerts.filter(a => !a.resolved).length,
        };
    },
    getServices: async (region: CloudRegion | 'all') => {
        await new Promise(res => setTimeout(res, 800));
        return mockServices.filter(s => region === 'all' || s.region === region);
    },
    getServiceDetails: async (serviceId: string) => {
        await new Promise(res => setTimeout(res, 300));
        return mockServices.find(s => s.id === serviceId) || null;
    },
    getServiceMetrics: async (serviceId: string, timeRangeHours: number) => {
        await new Promise(res => setTimeout(res, 600));
        return generateMockMetrics(timeRangeHours);
    },
    getServiceLogs: async (serviceId: string) => {
        await new Promise(res => setTimeout(res, 700));
        return generateMockLogs(serviceId, 200);
    },
    performServiceAction: async (serviceId: string, action: 'start' | 'stop' | 'restart') => {
        await new Promise(res => setTimeout(res, 1500));
        const service = mockServices.find(s => s.id === serviceId);
        if (service) {
            if (action === 'start') service.status = 'Running';
            if (action === 'stop') service.status = 'Stopped';
            if (action === 'restart') {
                service.status = 'Pending';
                setTimeout(() => { service.status = 'Running'; }, 2000);
            }
        }
        return service;
    },
    getAlerts: async (region: CloudRegion | 'all') => {
        await new Promise(res => setTimeout(res, 400));
        const servicesInRegion = mockServices.filter(s => region === 'all' || s.region === region).map(s => s.id);
        return mockAlerts.filter(a => servicesInRegion.includes(a.serviceId));
    },
    updateAlertStatus: async (alertId: string, status: 'acknowledged' | 'resolved') => {
        await new Promise(res => setTimeout(res, 200));
        const alert = mockAlerts.find(a => a.id === alertId);
        if(alert) {
            if (status === 'acknowledged') alert.acknowledged = true;
            if (status === 'resolved') alert.resolved = true;
        }
        return alert;
    },
    getBillingData: async () => {
        await new Promise(res => setTimeout(res, 500));
        const costByCategory = mockServices.reduce((acc, s) => {
            if(!acc[s.type]) acc[s.type] = 0;
            acc[s.type] += s.costPerHour * s.uptime;
            return acc;
        }, {} as Record<string, number>);

        return {
            invoices: mockInvoices,
            costByCategory: Object.entries(costByCategory).map(([name, cost]) => ({ name, cost })),
            costForecast: Array.from({length: 30}, (_, i) => ({ day: i+1, cost: (mockServices.reduce((acc, s) => acc + s.costPerHour, 0) * 24 * (i+1)) * (1 + (Math.random() - 0.5) * 0.1) }))
        };
    },
    getDeployments: async() => {
        await new Promise(res => setTimeout(res, 650));
        return mockDeployments;
    },
    getUsers: async() => {
        await new Promise(res => setTimeout(res, 450));
        return mockUsers;
    },
    getNetworking: async() => {
        await new Promise(res => setTimeout(res, 750));
        // In a real app, this data would be structured and related.
        return { vpcs: mockVPCs, subnets: [], securityGroups: [] };
    },
    getSecurity: async() => {
        await new Promise(res => setTimeout(res, 850));
        return generateMockSecurityData();
    },
    getMarketplaceApps: async() => {
        await new Promise(res => setTimeout(res, 600));
        return generateMockMarketplaceApps();
    },
    getAILogSummary: async(logs: ServiceLogEntry[]): Promise<string> => {
        await new Promise(res => setTimeout(res, 2000));
        const errors = logs.filter(l => l.level === 'ERROR' || l.level === 'FATAL').length;
        const warnings = logs.filter(l => l.level === 'WARN').length;
        if(errors > 0) {
            return `Log analysis complete. Found ${errors} critical error(s) and ${warnings} warning(s). Key error message: "${logs.find(l=>l.level==='ERROR')?.message}". Recommend immediate investigation of the database connection issues.`;
        }
        return `Log analysis complete. System appears stable with ${warnings} warnings but no critical errors. Common activities include user authentications and data processing.`;
    },
    getAIInsights: async(): Promise<AIInsight[]> => {
        await new Promise(res => setTimeout(res, 1500));
        return [
            { id: 'ai-1', type: 'Cost', severity: 'High', title: 'Unusual Cost Spike Detected', description: 'Last month\'s bill showed a 50% increase compared to the previous 6-month average.', recommendation: 'Investigate spending on Compute resources in us-east-1. Consider rightsizing instances or purchasing reserved instances.', relatedResourceId: 'inv-2023-11'},
            { id: 'ai-2', type: 'Security', severity: 'Medium', title: 'MFA Not Enforced', description: 'User charlie@demobank.com does not have Multi-Factor Authentication enabled, increasing risk of unauthorized access.', recommendation: 'Enforce MFA for all users, especially those with developer or admin privileges.', relatedResourceId: 'usr-3' },
            { id: 'ai-3', type: 'Performance', severity: 'Low', title: 'Underutilized Database Instance', description: 'The database instance srv-database-002-ap has an average CPU utilization of less than 5%.', recommendation: 'Consider scaling down this instance to a smaller size to save costs without impacting performance for its current workload.', relatedResourceId: 'srv-1234-5690' }
        ];
    },
};

// Initialize mock data globally so it persists across re-renders
const mockServices = generateMockServices(50);
const mockAlerts = generateMockAlerts(mockServices);
const mockInvoices = generateMockInvoices();
const mockDeployments = generateMockDeployments();
const mockUsers = generateMockUsers();

// --- CUSTOM HOOKS ---

export const useApiData = <T,>(fetcher: () => Promise<T>, deps: any[] = []) => {
    const [data, setData] = useState<T | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    const fetchData = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const result = await fetcher();
            setData(result);
        } catch (e: any) {
            setError(e);
        } finally {
            setIsLoading(false);
        }
    }, deps); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return { data, isLoading, error, refetch: fetchData };
};

export const useModal = <T,>() => {
    const [isOpen, setIsOpen] = useState(false);
    const [data, setData] = useState<T | null>(null);
    const open = useCallback((modalData: T) => {
        setData(modalData);
        setIsOpen(true);
    }, []);
    const close = useCallback(() => {
        setData(null);
        setIsOpen(false);
    }, []);
    return { isOpen, data, open, close };
};


// --- UTILITY FUNCTIONS & HELPERS ---

export const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
};

export const formatDate = (date: Date) => {
    return date.toLocaleString();
};

export const timeSince = (date: Date): string => {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + " years ago";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + " months ago";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + " days ago";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + " hours ago";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + " minutes ago";
    return Math.floor(seconds) + " seconds ago";
}

export const getStatusColor = (status: ServiceStatus | DeploymentStatus) => {
    switch (status) {
        case 'Running':
        case 'Available':
        case 'Success':
            return 'text-green-400';
        case 'Stopped':
        case 'Terminated':
            return 'text-gray-400';
        case 'Pending':
        case 'Updating':
        case 'In Progress':
            return 'text-yellow-400';
        case 'Error':
        case 'Failed':
        case 'Rolled Back':
        case 'Cancelled':
            return 'text-red-400';
        default:
            return 'text-white';
    }
};

export const getAlertSeverityColor = (severity: AlertSeverity) => {
    switch(severity) {
        case 'Critical': return 'bg-red-700';
        case 'High': return 'bg-red-500';
        case 'Medium': return 'bg-yellow-500';
        case 'Low': return 'bg-blue-500';
        case 'Info': return 'bg-gray-500';
    }
}

export const getLogLevelColor = (level: LogLevel) => {
    switch(level) {
        case 'FATAL':
        case 'ERROR': return 'text-red-400';
        case 'WARN': return 'text-yellow-400';
        case 'INFO': return 'text-blue-300';
        case 'DEBUG': return 'text-gray-500';
    }
}

const PIE_CHART_COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#de3163'];

const getIconForService = (type: ServiceType) => {
    switch(type) {
        case 'Compute': return <FaServer className="mr-2" />;
        case 'Database': return <FaDatabase className="mr-2" />;
        case 'Storage': return <FaHdd className="mr-2" />;
        case 'Networking': return <FaNetworkWired className="mr-2" />;
        case 'AI/ML': return <FaBrain className="mr-2" />;
        case 'Security': return <FaShieldAlt className="mr-2" />;
        default: return <FaServer className="mr-2" />;
    }
};

const getIconForMarketplaceCategory = (category: MarketplaceApp['category']) => {
    const props = { size: '2em', className: "mb-2 text-cyan-400" };
    switch(category) {
        case 'Databases': return <FaDatabase {...props} />;
        case 'Security': return <FaShieldAlt {...props} />;
        case 'DevOps': return <FaCodeBranch {...props} />;
        case 'Analytics': return <FaBrain {...props} />;
        case 'Web': return <FaServer {...props} />;
    }
}

// --- UI SUB-COMPONENTS ---

export const LoadingSpinner: FC<{ size?: 'sm' | 'md' | 'lg' }> = ({ size = 'md' }) => {
    const sizeMap = { sm: 'h-5 w-5', md: 'h-8 w-8', lg: 'h-12 w-12' };
    return (
        <div className="flex justify-center items-center h-full w-full">
            <svg className={`animate-spin text-cyan-400 ${sizeMap[size]}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
        </div>
    );
}

export const ErrorDisplay: FC<{ error: Error | null }> = ({ error }) => (
    <div className="text-red-400 bg-red-900/50 p-4 rounded-lg">
        <p className="font-bold">An error occurred:</p>
        <p className="font-mono text-sm">{error?.message || 'Unknown error'}</p>
    </div>
);

export const RegionSelector: FC<{ selectedRegion: CloudRegion | 'all', onRegionChange: (region: CloudRegion | 'all') => void }> = ({ selectedRegion, onRegionChange }) => {
    return (
        <div className="mb-4">
            <label htmlFor="region-select" className="block text-sm font-medium text-gray-400 mb-1">Region</label>
            <select
                id="region-select"
                value={selectedRegion}
                onChange={(e) => onRegionChange(e.target.value as CloudRegion | 'all')}
                className="bg-gray-800 border border-gray-700 text-white text-sm rounded-lg focus:ring-cyan-500 focus:border-cyan-500 block w-full p-2.5"
            >
                <option value="all">All Regions</option>
                {REGIONS.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
        </div>
    );
};

export const DashboardHeader: FC<{ region: CloudRegion | 'all' }> = ({ region }) => {
    const { data, isLoading, error } = useApiData(() => mockApi.getDashboardMetrics(region), [region]);

    if (isLoading) return <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"><Card><LoadingSpinner/></Card><Card><LoadingSpinner/></Card><Card><LoadingSpinner/></Card><Card><LoadingSpinner/></Card></div>;
    if (error || !data) return <ErrorDisplay error={error}/>;

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="text-center">
                <p className="text-3xl font-bold text-white">{data.activeServices} / {data.totalServices}</p>
                <p className="text-sm text-gray-400 mt-1">Active Services</p>
            </Card>
            <Card className="text-center">
                <p className="text-3xl font-bold text-green-400">{data.uptime}%</p>
                <p className="text-sm text-gray-400 mt-1">Uptime (30d)</p>
            </Card>
            <Card className="text-center">
                <p className="text-3xl font-bold text-white">{formatCurrency(data.monthlyCost / 1000)}k</p>
                <p className="text-sm text-gray-400 mt-1">Month-to-Date Cost</p>
            </Card>
            <Card className="text-center">
                <p className={`text-3xl font-bold ${data.activeAlerts > 0 ? 'text-red-400' : 'text-white'}`}>{data.activeAlerts}</p>
                <p className="text-sm text-gray-400 mt-1">Active Alerts</p>
            </Card>
        </div>
    );
};

// --- In a real app, this data would come from a dedicated file or a live API call
const usageData = Array.from({ length: 30 }, (_, i) => ({
  day: i + 1,
  cpu: 40 + Math.random() * 30,
  memory: 55 + Math.random() * 20,
}));

export const ResourceCharts: FC = () => {
    const { data: billingData, isLoading, error } = useApiData(mockApi.getBillingData);

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card title="Overall Resource Usage (%) - Last 30 Days">
                <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={usageData}>
                         <defs>
                            <linearGradient id="colorCpu" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/><stop offset="95%" stopColor="#8884d8" stopOpacity={0}/></linearGradient>
                            <linearGradient id="colorMemory" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8}/><stop offset="95%" stopColor="#82ca9d" stopOpacity={0}/></linearGradient>
                        </defs>
                        <XAxis dataKey="day" stroke="#9ca3af" tick={{fontSize: 12}} />
                        <YAxis stroke="#9ca3af" domain={[0, 100]} unit="%" tick={{fontSize: 12}} />
                        <Tooltip contentStyle={{ backgroundColor: 'rgba(31, 41, 55, 0.8)', borderColor: '#4b5563' }}/>
                        <Legend />
                        <Area type="monotone" dataKey="cpu" stroke="#8884d8" fill="url(#colorCpu)" name="CPU" />
                        <Area type="monotone" dataKey="memory" stroke="#82ca9d" fill="url(#colorMemory)" name="Memory" />
                    </AreaChart>
                </ResponsiveContainer>
            </Card>
            <Card title="Cost Analysis by Service Type">
                 <ResponsiveContainer width="100%" height={300}>
                    {isLoading && <LoadingSpinner />}
                    {error && <ErrorDisplay error={error} />}
                    {billingData && (
                        <BarChart data={billingData.costByCategory} layout="vertical">
                            <XAxis type="number" stroke="#9ca3af" unit="$" tick={{fontSize: 12}} tickFormatter={(val) => `${val/1000}k`}/>
                            <YAxis type="category" dataKey="name" stroke="#9ca3af" width={80} tick={{fontSize: 12}} />
                            <Tooltip contentStyle={{ backgroundColor: 'rgba(31, 41, 55, 0.8)', borderColor: '#4b5563' }} formatter={(value: number) => formatCurrency(value)} />
                            <Bar dataKey="cost" fill="#06b6d4" />
                        </BarChart>
                    )}
                </ResponsiveContainer>
            </Card>
        </div>
    );
};

export const ServicesTable: FC<{ region: CloudRegion | 'all', onServiceSelect: (service: CloudService) => void }> = ({ region, onServiceSelect }) => {
    const { data: services, isLoading, error, refetch } = useApiData(() => mockApi.getServices(region), [region]);
    const [filter, setFilter] = useState('');

    const filteredServices = useMemo(() => {
        if (!services) return [];
        return services.filter(s => s.name.toLowerCase().includes(filter.toLowerCase()) || s.type.toLowerCase().includes(filter.toLowerCase()));
    }, [services, filter]);

    const handleAction = async (serviceId: string, action: 'start' | 'stop' | 'restart') => {
        await mockApi.performServiceAction(serviceId, action);
        refetch(); // Refresh data after action
    };

    return (
        <Card title="Active Services">
            <input
                type="text"
                placeholder="Filter by name or type..."
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="w-full p-2 mb-4 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-500"
            />
             <div className="overflow-x-auto">
                {isLoading && <LoadingSpinner />}
                {error && <ErrorDisplay error={error} />}
                {services && (
                    <table className="w-full text-sm text-left text-gray-400">
                        <thead className="text-xs text-gray-300 uppercase bg-gray-900/30">
                            <tr>
                                <th scope="col" className="px-6 py-3">Service Name</th>
                                <th scope="col" className="px-6 py-3">Type</th>
                                <th scope="col" className="px-6 py-3">Region</th>
                                <th scope="col" className="px-6 py-3">Status</th>
                                <th scope="col" className="px-6 py-3">Cost/hr</th>
                                <th scope="col" className="px-6 py-3">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredServices.map(service => (
                                <tr key={service.id} className="border-b border-gray-800 hover:bg-gray-800/50">
                                    <td className="px-6 py-4 font-mono text-white">{service.name}</td>
                                    <td className="px-6 py-4 flex items-center">{getIconForService(service.type)} {service.type}</td>
                                    <td className="px-6 py-4">{service.region}</td>
                                    <td className="px-6 py-4"><span className={`${getStatusColor(service.status)} font-semibold`}>{service.status}</span></td>
                                    <td className="px-6 py-4">{formatCurrency(service.costPerHour)}</td>
                                    <td className="px-6 py-4 space-x-2">
                                        <button onClick={() => onServiceSelect(service)} className="text-cyan-400 hover:text-cyan-300">Details</button>
                                        <button onClick={() => handleAction(service.id, 'restart')} className="text-yellow-400 hover:text-yellow-300">Restart</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </Card>
    );
};

export const ServiceDetailModal: FC<{ service: CloudService | null, isOpen: boolean, onClose: () => void }> = ({ service, isOpen, onClose }) => {
    const [activeTab, setActiveTab] = useState<'overview' | 'metrics' | 'logs' | 'config' | 'ai'>('overview');
    const [timeRange, setTimeRange] = useState(1); // 1 hour
    const { data: metrics, isLoading: metricsLoading } = useApiData(
        () => service ? mockApi.getServiceMetrics(service.id, timeRange) : Promise.resolve(null),
        [service, timeRange, activeTab === 'metrics']
    );
    const { data: logs, isLoading: logsLoading } = useApiData(
        () => service ? mockApi.getServiceLogs(service.id) : Promise.resolve(null),
        [service, activeTab === 'logs' || activeTab === 'ai']
    );
    const [aiSummary, setAiSummary] = useState('');
    const [isAiLoading, setIsAiLoading] = useState(false);

    const handleAiAnalysis = useCallback(async () => {
        if(!logs) return;
        setIsAiLoading(true);
        setAiSummary('');
        const summary = await mockApi.getAILogSummary(logs);
        setAiSummary(summary);
        setIsAiLoading(false);
    }, [logs]);

    useEffect(() => {
        if (isOpen) {
            setActiveTab('overview');
            setAiSummary('');
        }
    }, [isOpen]);

    if (!isOpen || !service) return null;

    const renderOverview = () => (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div><strong className="text-gray-400">ID:</strong> <span className="font-mono">{service.id}</span></div>
            <div><strong className="text-gray-400">Status:</strong> <span className={getStatusColor(service.status)}>{service.status}</span></div>
            <div><strong className="text-gray-400">Region:</strong> {service.region}</div>
            <div><strong className="text-gray-400">Instance Type:</strong> {service.instanceType}</div>
            <div><strong className="text-gray-400">Created:</strong> {formatDate(service.createdAt)}</div>
            <div><strong className="text-gray-400">Total Uptime:</strong> {service.uptime} hours</div>
            <div><strong className="text-gray-400">Public IP:</strong> {service.publicIp || 'N/A'}</div>
            <div><strong className="text-gray-400">Private IP:</strong> {service.privateIp}</div>
            <div><strong className="text-gray-400">VPC:</strong> {service.vpcId}</div>
            <div><strong className="text-gray-400">Tags:</strong>
                <div className="flex flex-wrap gap-1 mt-1">
                    {Object.entries(service.tags).map(([key, value]) => (
                        <span key={key} className="bg-gray-700 text-xs px-2 py-1 rounded-full">{key}: {value}</span>
                    ))}
                </div>
            </div>
        </div>
    );

    const renderMetrics = () => (
        <div>
             <div className="flex justify-end mb-4 space-x-2">
                {[1, 6, 24, 7*24].map(hours => (
                    <button key={hours} onClick={() => setTimeRange(hours)} className={`px-3 py-1 text-xs rounded-md ${timeRange === hours ? 'bg-cyan-600' : 'bg-gray-700 hover:bg-gray-600'}`}>
                        {hours < 24 ? `${hours}H` : `${hours/24}D`}
                    </button>
                ))}
             </div>
            {metricsLoading ? <LoadingSpinner /> : (
                <div className="space-y-6">
                    <h4 className="text-lg font-semibold text-white">CPU & Memory Usage</h4>
                    <ResponsiveContainer width="100%" height={200}>
                        <AreaChart data={metrics}>
                            <XAxis dataKey="timestamp" tickFormatter={(ts) => new Date(ts).toLocaleTimeString()} stroke="#9ca3af" tick={{fontSize: 10}} />
                            <YAxis yAxisId="left" stroke="#8884d8" unit="%" domain={[0,100]} tick={{fontSize: 10}}/>
                            <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" unit="%" domain={[0,100]} tick={{fontSize: 10}}/>
                            <Tooltip contentStyle={{ backgroundColor: 'rgba(31, 41, 55, 0.8)', borderColor: '#4b5563' }} />
                            <Area yAxisId="left" type="monotone" dataKey="cpu_percent" stroke="#8884d8" fill="#8884d8" fillOpacity={0.3} name="CPU" />
                            <Area yAxisId="right" type="monotone" dataKey="memory_percent" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.3} name="Memory" />
                        </AreaChart>
                    </ResponsiveContainer>
                    <h4 className="text-lg font-semibold text-white">Network I/O</h4>
                     <ResponsiveContainer width="100%" height={200}>
                        <LineChart data={metrics}>
                            <XAxis dataKey="timestamp" tickFormatter={(ts) => new Date(ts).toLocaleTimeString()} stroke="#9ca3af" tick={{fontSize: 10}} />
                            <YAxis stroke="#9ca3af" unit="kb/s" tick={{fontSize: 10}} />
                            <Tooltip contentStyle={{ backgroundColor: 'rgba(31, 41, 55, 0.8)', borderColor: '#4b5563' }} />
                            <Legend />
                            <Line type="monotone" dataKey="network_in" stroke="#0ea5e9" name="Inbound" dot={false} />
                            <Line type="monotone" dataKey="network_out" stroke="#f97316" name="Outbound" dot={false} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            )}
        </div>
    );
    
    const renderLogs = () => (
        <div>
            {logsLoading ? <LoadingSpinner /> : (
                <div className="bg-gray-900 font-mono text-xs rounded-md p-4 h-96 overflow-y-auto">
                    {logs?.map(log => (
                        <div key={log.id} className="flex">
                           <span className="text-gray-500 mr-4">{log.timestamp.toISOString()}</span>
                           <span className={`${getLogLevelColor(log.level)} font-bold w-12`}>{log.level}</span>
                           <span>{log.message}</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );

    const renderAiAnalysis = () => (
        <div>
            <button 
                onClick={handleAiAnalysis} 
                disabled={isAiLoading || logsLoading}
                className="bg-cyan-600 hover:bg-cyan-700 disabled:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg flex items-center mb-4"
            >
                {isAiLoading ? <FaSpinner className="animate-spin mr-2" /> : <FaBrain className="mr-2" />}
                {isAiLoading ? 'Analyzing Logs...' : 'Analyze with AI'}
            </button>
            {aiSummary && (
                <div className="bg-gray-900/50 p-4 rounded-lg border-l-4 border-cyan-400">
                    <h4 className="text-lg font-semibold text-white mb-2">AI Summary</h4>
                    <p className="text-gray-300 whitespace-pre-wrap">{aiSummary}</p>
                </div>
            )}
        </div>
    );

    const renderConfig = () => (
        <div className="bg-gray-900 font-mono text-xs rounded-md p-4 h-96 overflow-y-auto">
            <pre className="text-green-300">
                {JSON.stringify({
                    serviceId: service.id,
                    instanceType: service.instanceType,
                    region: service.region,
                    network: {
                        vpcId: service.vpcId,
                        subnetId: 'subnet-1a2b3c4d5e6f7',
                        securityGroups: ['sg-9f8e7d6c5b4a3', 'sg-f1e2d3c4b5a69'],
                    },
                    storage: {
                        rootVolumeSize: '50GB',
                        rootVolumeType: 'gp3',
                        iops: 3000,
                    },
                    tags: service.tags,
                }, null, 2)}
            </pre>
        </div>
    );

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
            <div className="bg-gray-800 rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col text-white">
                <div className="flex justify-between items-center p-4 border-b border-gray-700">
                    <h3 className="text-xl font-bold">{service.name} Details</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-white text-2xl">&times;</button>
                </div>
                <div className="p-4 border-b border-gray-700">
                    <nav className="flex space-x-1 sm:space-x-4 text-sm">
                        <button onClick={() => setActiveTab('overview')} className={`px-3 py-2 rounded-md ${activeTab === 'overview' ? 'bg-cyan-600' : 'hover:bg-gray-700'}`}>Overview</button>
                        <button onClick={() => setActiveTab('metrics')} className={`px-3 py-2 rounded-md ${activeTab === 'metrics' ? 'bg-cyan-600' : 'hover:bg-gray-700'}`}>Metrics</button>
                        <button onClick={() => setActiveTab('logs')} className={`px-3 py-2 rounded-md ${activeTab === 'logs' ? 'bg-cyan-600' : 'hover:bg-gray-700'}`}>Logs</button>
                        <button onClick={() => setActiveTab('config')} className={`px-3 py-2 rounded-md ${activeTab === 'config' ? 'bg-cyan-600' : 'hover:bg-gray-700'}`}>Configuration</button>
                        <button onClick={() => setActiveTab('ai')} className={`px-3 py-2 rounded-md ${activeTab === 'ai' ? 'bg-cyan-600' : 'hover:bg-gray-700'} flex items-center`}>
                           <FaLightbulb className="mr-1"/> AI Analysis
                        </button>
                    </nav>
                </div>
                <div className="p-6 overflow-y-auto">
                    {activeTab === 'overview' && renderOverview()}
                    {activeTab === 'metrics' && renderMetrics()}
                    {activeTab === 'logs' && renderLogs()}
                    {activeTab === 'config' && renderConfig()}
                    {activeTab === 'ai' && renderAiAnalysis()}
                </div>
            </div>
        </div>
    );
};

export const AlertsPanel: FC<{ region: CloudRegion | 'all' }> = ({ region }) => {
    const { data: alerts, isLoading, error, refetch } = useApiData(() => mockApi.getAlerts(region), [region]);

    const handleAlertAction = async (alertId: string, action: 'acknowledged' | 'resolved') => {
        await mockApi.updateAlertStatus(alertId, action);
        refetch();
    };

    const sortedAlerts = useMemo(() => {
        if (!alerts) return [];
        const severityOrder: Record<AlertSeverity, number> = { Critical: 0, High: 1, Medium: 2, Low: 3, Info: 4 };
        return [...alerts].sort((a, b) => severityOrder[a.severity] - severityOrder[b.severity]);
    }, [alerts]);

    return (
        <Card title="Active Alerts">
            <div className="max-h-96 overflow-y-auto">
                {isLoading && <LoadingSpinner />}
                {error && <ErrorDisplay error={error} />}
                {alerts && sortedAlerts.filter(a => !a.resolved).map(alert => (
                    <div key={alert.id} className="p-3 mb-2 rounded-md bg-gray-900/50 border-l-4" style={{borderColor: getAlertSeverityColor(alert.severity).replace('bg-','').replace('-500','').replace('-700','')}}>
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="font-bold text-white"><span className={`px-2 py-1 text-xs rounded-full mr-2 ${getAlertSeverityColor(alert.severity)}`}>{alert.severity}</span>{alert.message}</p>
                                <p className="text-xs text-gray-400 mt-1">{alert.serviceName} &middot; {timeSince(alert.timestamp)}</p>
                            </div>
                            <div className="flex space-x-2 text-sm">
                                {!alert.acknowledged && <button onClick={() => handleAlertAction(alert.id, 'acknowledged')} className="text-blue-400">Ack</button>}
                                <button onClick={() => handleAlertAction(alert.id, 'resolved')} className="text-green-400">Resolve</button>
                            </div>
                        </div>
                    </div>
                ))}
                {alerts && sortedAlerts.filter(a => !a.resolved).length === 0 && <p className="text-gray-400 text-center py-4">No active alerts.</p>}
            </div>
        </Card>
    );
};

export const BillingAndCostManagement: FC = () => {
    const { data, isLoading, error } = useApiData(mockApi.getBillingData);

    return (
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            <div className="lg:col-span-3">
                <Card title="Cost Forecast (Next 30 Days)">
                    {isLoading && <LoadingSpinner />}
                    {error && <ErrorDisplay error={error} />}
                    {data && (
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={data.costForecast}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#4b5563" />
                                <XAxis dataKey="day" stroke="#9ca3af" label={{ value: 'Day of Month', position: 'insideBottom', offset: -5 }}/>
                                <YAxis stroke="#9ca3af" tickFormatter={(v) => formatCurrency(v)} />
                                <Tooltip contentStyle={{ backgroundColor: 'rgba(31, 41, 55, 0.8)', borderColor: '#4b5563' }} />
                                <Line type="monotone" dataKey="cost" stroke="#8884d8" dot={false} name="Forecasted Cost"/>
                            </LineChart>
                        </ResponsiveContainer>
                    )}
                </Card>
            </div>
            <div className="lg:col-span-2">
                 <Card title="Invoice History">
                    <div className="max-h-80 overflow-y-auto">
                        {isLoading && <LoadingSpinner />}
                        {error && <ErrorDisplay error={error} />}
                        {data && (
                            <ul className="space-y-2">
                                {data.invoices.map(inv => (
                                    <li key={inv.id} className="flex justify-between items-center p-2 bg-gray-800/50 rounded-md">
                                        <div>
                                            <p className="text-white font-medium">{inv.month}</p>
                                            <p className="text-sm text-gray-400">{formatCurrency(inv.amount)}</p>
                                        </div>
                                        <div className="text-right">
                                            <span className={`text-xs px-2 py-1 rounded-full ${inv.status === 'Paid' ? 'bg-green-800 text-green-300' : 'bg-yellow-800 text-yellow-300'}`}>{inv.status}</span>
                                            <a href={inv.pdfUrl} className="text-cyan-400 hover:underline text-sm ml-4">Download</a>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                 </Card>
            </div>
        </div>
    )
};

export const CloudViewTabs: FC<{ activeTab: string, setActiveTab: (tab: string) => void}> = ({activeTab, setActiveTab}) => {
    const tabs = [
        {name: 'Dashboard', icon: FaServer},
        {name: 'Services', icon: FaHdd},
        {name: 'Alerts', icon: FaExclamationTriangle},
        {name: 'Billing', icon: FaFileInvoiceDollar},
        {name: 'Deployments', icon: FaCodeBranch},
        {name: 'IAM', icon: FaUsers},
        {name: 'Security', icon: FaUserShield},
        {name: 'Networking', icon: FaVpc},
        {name: 'Marketplace', icon: FaStore},
    ];
    return (
        <div className="border-b border-gray-700 mb-6 overflow-x-auto">
            <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                {tabs.map(tab => (
                    <button
                        key={tab.name}
                        onClick={() => setActiveTab(tab.name)}
                        className={`${
                            activeTab === tab.name
                                ? 'border-cyan-500 text-cyan-400'
                                : 'border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-500'
                        } flex items-center whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                    >
                        <tab.icon className="mr-2" />
                        {tab.name}
                    </button>
                ))}
            </nav>
        </div>
    );
};

export const DeploymentView: FC = () => {
    const { data: deployments, isLoading, error } = useApiData(mockApi.getDeployments);
    return (
        <Card title="IaC Deployment History">
            <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
                {isLoading && <LoadingSpinner />}
                {error && <ErrorDisplay error={error} />}
                {deployments && (
                    <table className="w-full text-sm text-left text-gray-400">
                        <thead className="text-xs text-gray-300 uppercase bg-gray-900/30 sticky top-0">
                            <tr>
                                <th scope="col" className="px-6 py-3">Timestamp</th>
                                <th scope="col" className="px-6 py-3">Template</th>
                                <th scope="col" className="px-6 py-3">Version</th>
                                <th scope="col" className="px-6 py-3">Commit</th>
                                <th scope="col" className="px-6 py-3">Deployed By</th>
                                <th scope="col" className="px-6 py-3">Status</th>
                            </tr>
                        </thead>
                        <tbody className="bg-gray-800">
                            {deployments.map(d => (
                                <tr key={d.id} className="border-b border-gray-700 hover:bg-gray-700/50">
                                    <td className="px-6 py-4">{formatDate(d.timestamp)}</td>
                                    <td className="px-6 py-4 font-mono text-white">{d.templateName}</td>
                                    <td className="px-6 py-4">{d.version}</td>
                                    <td className="px-6 py-4 font-mono text-cyan-400 hover:underline cursor-pointer">{d.commitHash}</td>
                                    <td className="px-6 py-4">{d.deployedBy}</td>
                                    <td className="px-6 py-4"><span className={`${getStatusColor(d.status)} font-semibold`}>{d.status}</span></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </Card>
    );
};

export const IAMView: FC = () => {
    const { data: users, isLoading, error } = useApiData(mockApi.getUsers);
    return (
        <Card title="Identity & Access Management (IAM)">
            <div className="overflow-x-auto">
                {isLoading && <LoadingSpinner />}
                {error && <ErrorDisplay error={error} />}
                {users && (
                    <table className="w-full text-sm text-left text-gray-400">
                        <thead className="text-xs text-gray-300 uppercase bg-gray-900/30">
                            <tr>
                                <th scope="col" className="px-6 py-3">Name</th>
                                <th scope="col" className="px-6 py-3">Email</th>
                                <th scope="col" className="px-6 py-3">Role</th>
                                <th scope="col" className="px-6 py-3">Groups</th>
                                <th scope="col" className="px-6 py-3">MFA</th>
                                <th scope="col" className="px-6 py-3">Last Login</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map(u => (
                                <tr key={u.id} className="border-b border-gray-800 hover:bg-gray-800/50">
                                    <td className="px-6 py-4 text-white">{u.name}</td>
                                    <td className="px-6 py-4">{u.email}</td>
                                    <td className="px-6 py-4">{u.role}</td>
                                    <td className="px-6 py-4 flex flex-wrap gap-1">
                                        {u.groups.map(g => <span key={g} className="bg-gray-700 text-xs px-2 py-1 rounded-full">{g}</span>)}
                                    </td>
                                    <td className="px-6 py-4">{u.mfaEnabled ? <span className="text-green-400">Enabled</span> : <span className="text-yellow-400">Disabled</span>}</td>
                                    <td className="px-6 py-4">{timeSince(u.lastLogin)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </Card>
    );
};

export const SecurityView: FC = () => {
    const {data, isLoading, error} = useApiData(mockApi.getSecurity);
    
    const getComplianceStatusPill = (status: ComplianceReport['status']) => {
        switch(status) {
            case 'Compliant': return <span className="text-xs px-2 py-1 rounded-full bg-green-800 text-green-300">{status}</span>;
            case 'Non-Compliant': return <span className="text-xs px-2 py-1 rounded-full bg-red-800 text-red-300">{status}</span>;
            case 'In Audit': return <span className="text-xs px-2 py-1 rounded-full bg-yellow-800 text-yellow-300">{status}</span>;
        }
    };
    
    const getVulnerabilitySeverityPill = (severity: VulnerabilitySeverity) => {
        switch(severity) {
            case 'Critical': return <span className="font-bold text-red-500">{severity}</span>
            case 'High': return <span className="font-bold text-red-400">{severity}</span>
            case 'Medium': return <span className="font-bold text-yellow-400">{severity}</span>
            case 'Low': return <span className="font-bold text-gray-400">{severity}</span>
        }
    };

    if (isLoading) return <Card><LoadingSpinner/></Card>;
    if (error || !data) return <ErrorDisplay error={error} />;

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card title="Compliance Status">
                <ul className="space-y-3">
                    {data.reports.map(report => (
                        <li key={report.id} className="flex justify-between items-center p-3 bg-gray-900/50 rounded-md">
                            <div>
                                <p className="font-bold text-white">{report.standard}</p>
                                <p className="text-xs text-gray-400">Last Audit: {report.lastAuditDate.toLocaleDateString()}</p>
                            </div>
                            {getComplianceStatusPill(report.status)}
                        </li>
                    ))}
                </ul>
            </Card>
            <Card title="Open Vulnerabilities">
                <div className="max-h-[400px] overflow-y-auto">
                    {data.vulnerabilities.filter(v => v.status === 'Open').map(vuln => (
                        <div key={vuln.id} className="p-3 mb-2 rounded-md bg-gray-900/50">
                            <div className="flex justify-between items-center">
                                <p className="font-mono text-cyan-400 text-sm">{vuln.cveId}</p>
                                {getVulnerabilitySeverityPill(vuln.severity)}
                            </div>
                            <p className="text-sm text-gray-300 mt-1">{vuln.description}</p>
                            <p className="text-xs text-gray-500 mt-2">On: {vuln.affectedResource}</p>
                        </div>
                    ))}
                </div>
            </Card>
        </div>
    );
};

export const NetworkingView: FC = () => {
    const { data, isLoading, error } = useApiData(mockApi.getNetworking);
    
    const elements: Elements = useMemo(() => {
        if (!data) return [];
        const initialElements: Elements = [
            { id: 'internet', data: { label: 'Internet Gateway' }, position: { x: 400, y: 50 }, className: 'bg-green-700 text-white' }
        ];

        data.vpcs.forEach((vpc, i) => {
            initialElements.push({
                id: vpc.id,
                data: { label: `${vpc.name} (${vpc.cidrBlock})` },
                position: { x: 150, y: 150 + i * 200 },
                style: { width: 500, height: 100, backgroundColor: '#1f2937', color: 'white', borderColor: '#06b6d4' }
            });
            initialElements.push({ id: `e-inet-${vpc.id}`, source: 'internet', target: vpc.id, animated: true });
        });
        return initialElements;
    }, [data]);

    if (isLoading) return <Card><LoadingSpinner /></Card>;
    if (error) return <ErrorDisplay error={error} />;

    return (
        <Card title="VPC Topology">
            <div className="w-full h-[600px] bg-gray-900 rounded-lg">
                <ReactFlow elements={elements}>
                    <MiniMap />
                    <Controls />
                    <Background />
                </ReactFlow>
            </div>
        </Card>
    );
};

export const MarketplaceView: FC = () => {
    const { data: apps, isLoading, error } = useApiData(mockApi.getMarketplaceApps);

    if (isLoading) return <Card><LoadingSpinner /></Card>;
    if (error) return <ErrorDisplay error={error} />;

    return (
        <Card title="Marketplace">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {apps?.map(app => (
                    <div key={app.id} className="bg-gray-900/50 rounded-lg p-6 flex flex-col items-center text-center hover:bg-gray-800/50 transition-colors duration-200">
                        {getIconForMarketplaceCategory(app.category)}
                        <h4 className="text-xl font-bold text-white mb-1">{app.name}</h4>
                        <p className="text-sm text-gray-400 mb-2">by {app.vendor}</p>
                        <p className="text-xs text-gray-500 mb-4 h-16">{app.description}</p>
                        <p className="text-lg font-semibold text-white mb-4">{formatCurrency(app.monthlyPrice)}/mo</p>
                        <button className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-2 px-4 rounded-lg">
                            Deploy
                        </button>
                    </div>
                ))}
            </div>
        </Card>
    );
};

export const AIInsightsDashboard: FC = () => {
    const {data: insights, isLoading, error} = useApiData(mockApi.getAIInsights);
    
    const getInsightIcon = (type: AIInsight['type']) => {
        const props = {className: "text-2xl text-cyan-400"};
        switch(type) {
            case 'Cost': return <FaFileInvoiceDollar {...props}/>
            case 'Security': return <FaShieldAlt {...props}/>
            case 'Performance': return <FaServer {...props}/>
            case 'Reliability': return <FaCheckCircle {...props}/>
        }
    }
    
    return (
        <Card title="AI Advisor Insights">
             {isLoading && <LoadingSpinner />}
             {error && <ErrorDisplay error={error} />}
             <div className="space-y-4">
                {insights?.map(insight => (
                    <div key={insight.id} className="flex items-start bg-gray-900/50 p-4 rounded-lg">
                        <div className="mr-4">{getInsightIcon(insight.type)}</div>
                        <div>
                            <h4 className="font-bold text-white">{insight.title}</h4>
                            <p className="text-sm text-gray-400 mt-1">{insight.description}</p>
                            <div className="mt-2 bg-gray-800 p-2 rounded-md">
                                <p className="text-xs font-semibold text-cyan-300">Recommendation:</p>
                                <p className="text-sm text-gray-300">{insight.recommendation}</p>
                            </div>
                        </div>
                    </div>
                ))}
             </div>
        </Card>
    )
}

// --- MAIN VIEW COMPONENT ---

const DemoBankCloudView: React.FC = () => {
    const [activeTab, setActiveTab] = useState('Dashboard');
    const [selectedRegion, setSelectedRegion] = useState<CloudRegion | 'all'>('all');
    const serviceModal = useModal<CloudService>();

    const renderTabContent = () => {
        switch(activeTab) {
            case 'Dashboard':
                return (
                    <div className="space-y-6">
                        <DashboardHeader region={selectedRegion} />
                        <ResourceCharts />
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <AlertsPanel region={selectedRegion} />
                            <AIInsightsDashboard />
                        </div>
                    </div>
                );
            case 'Services':
                return <ServicesTable region={selectedRegion} onServiceSelect={serviceModal.open} />;
            case 'Alerts':
                return <AlertsPanel region={selectedRegion} />;
            case 'Billing':
                return <BillingAndCostManagement />;
            case 'Deployments':
                return <DeploymentView />;
            case 'IAM':
                return <IAMView />;
            case 'Security':
                return <SecurityView />;
            case 'Networking':
                return <NetworkingView />;
            case 'Marketplace':
                return <MarketplaceView />;
            default:
                return null;
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold text-white tracking-wider">Demo Bank Cloud Platform</h2>
                <div className="w-64">
                    <RegionSelector selectedRegion={selectedRegion} onRegionChange={setSelectedRegion} />
                </div>
            </div>

            <CloudViewTabs activeTab={activeTab} setActiveTab={setActiveTab} />

            {renderTabContent()}

            <ServiceDetailModal isOpen={serviceModal.isOpen} service={serviceModal.data} onClose={serviceModal.close} />
        </div>
    );
};

export default DemoBankCloudView;