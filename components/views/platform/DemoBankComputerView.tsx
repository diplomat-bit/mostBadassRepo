// REPOSITORY SOURCE: diplomat-bit/Citibank_Demo_Business_Inc_Demonstration- | PATH: diplomat-bit-Citibank_Demo_Business_Inc_Demonstration--ab2501d/components/views/platform/DemoBankComputerView.tsx
================================================================================

import React, { useState, useEffect, useMemo, useCallback, useReducer, createContext, useContext, useRef, FC, ReactNode } from 'react';
import Card from '../../Card';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, BarChart, Bar, AreaChart, Area, PieChart, Pie, Cell, RadialBarChart, RadialBar, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from 'recharts';

// SECTION: Advanced Type Definitions for a Real-World Application
// ===============================================================

export type InstanceStatus = 'Running' | 'Stopped' | 'Pending' | 'Terminated' | 'Rebooting' | 'Provisioning';
export type Region = 'us-east-1' | 'us-west-2' | 'eu-west-1' | 'eu-west-2' | 'ap-southeast-1' | 'ap-northeast-1';
export type InstanceType = 't3.micro' | 'm5.large' | 'c5.2xlarge' | 'r5.4xlarge' | 'g4dn.xlarge' | 'p3.2xlarge';
export type ActionType = 'start' | 'stop' | 'reboot' | 'terminate' | 'resize';
export type MetricType = 'cpu' | 'memory' | 'diskIO' | 'networkIn' | 'networkOut' | 'gpu_temp' | 'gpu_util';
export type LogLevel = 'INFO' | 'WARN' | 'ERROR' | 'DEBUG' | 'CRITICAL';
export type NotificationType = 'success' | 'error' | 'info' | 'warning';
export type AInsightCategory = 'Cost' | 'Performance' | 'Security' | 'Reliability';
export type AInsightSeverity = 'Low' | 'Medium' | 'High' | 'Critical';

export interface VirtualMachine {
  id: string;
  name: string;
  region: Region;
  type: InstanceType;
  status: InstanceStatus;
  ipAddress: string;
  publicIpAddress: string;
  createdAt: string;
  uptime: number; // in hours
  tags: { key: string; value: string }[];
  storage: {
    id: string;
    type: 'gp3' | 'io2' | 'st1';
    totalGb: number;
    usedGb: number;
    iops: number;
  }[];
  securityGroupId: string;
  amiId: string;
  cpuCores: number;
  memoryGb: number;
}

export interface MetricDataPoint {
  timestamp: number;
  value: number;
}

export interface LogEntry {
  id: string;
  timestamp: string;
  level: LogLevel;
  message: string;
  context: Record<string, any>;
}

export interface SecurityEvent {
  id: string;
  timestamp: string;
  type: 'Failed Login' | 'Firewall Block' | 'Malware Detected' | 'Anomalous API Call' | 'IAM Policy Change';
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  sourceIp: string;
  details: string;
  targetResourceId: string;
}

export interface AutoscalingGroup {
  id: string;
  name: string;
  region: Region;
  minInstances: number;
  maxInstances: number;
  desiredInstances: number;
  currentInstances: number;
  instanceType: InstanceType;
  healthCheckStatus: 'Healthy' | 'Unhealthy';
  launchTemplateId: string;
}

export interface CostDataPoint {
  month: string;
  compute: number;
  storage: number;
  network: number;
  database: number;
  ai_services: number;
}

export interface Notification {
  id: number;
  type: NotificationType;
  message: string;
}

export interface AIInsight {
    id: string;
    category: AInsightCategory;
    severity: AInsightSeverity;
    title: string;
    description: string;
    recommendation: string;
    resourceId: string;
    potentialSavings?: number;
}

export interface SecurityGroupRule {
    id: string;
    protocol: 'TCP' | 'UDP' | 'ICMP' | 'ALL';
    portRange: string;
    source: string; // CIDR block or another security group ID
    description: string;
}

export interface SecurityGroup {
    id: string;
    name: string;
    description: string;
    inboundRules: SecurityGroupRule[];
    outboundRules: SecurityGroupRule[];
}

export interface KubernetesCluster {
    id: string;
    name: string;
    region: Region;
    version: string;
    status: 'ACTIVE' | 'UPDATING' | 'DEGRADED';
    nodePools: number;
    totalNodes: number;
    totalCpu: number;
    totalMemoryGb: number;
}

// SECTION: Mock Data Generation and API Service
// ============================================
// Simulates a backend API for a realistic frontend experience.

const REGIONS: Region[] = ['us-east-1', 'us-west-2', 'eu-west-1', 'eu-west-2', 'ap-southeast-1', 'ap-northeast-1'];
const INSTANCE_TYPES: InstanceType[] = ['t3.micro', 'm5.large', 'c5.2xlarge', 'r5.4xlarge', 'g4dn.xlarge', 'p3.2xlarge'];
const STATUSES: InstanceStatus[] = ['Running', 'Stopped', 'Pending', 'Terminated', 'Provisioning'];
const LOG_MESSAGES = [
  "User authentication successful for 'admin'", "Database connection established", "API request to /api/v1/users completed in 25ms",
  "High CPU usage detected", "Disk space is running low on /dev/sda1", "Failed to connect to upstream service: payment-gateway",
  "Uncaught exception: NullPointerException", "Starting background job: daily-report-generation", "Cache cleared for user_session_data",
  "New deployment initiated for service 'frontend-web'", "Scaling down worker pool due to low traffic", "Security scan detected 2 medium vulnerabilities",
];
const INSTANCE_TYPE_SPECS: Record<InstanceType, { cpu: number; mem: number }> = {
    't3.micro': { cpu: 2, mem: 1 },
    'm5.large': { cpu: 2, mem: 8 },
    'c5.2xlarge': { cpu: 8, mem: 16 },
    'r5.4xlarge': { cpu: 16, mem: 128 },
    'g4dn.xlarge': { cpu: 4, mem: 16 },
    'p3.2xlarge': { cpu: 8, mem: 61 },
};

const generateRandomIp = () => `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;

export const generateVMInstances = (count: number): VirtualMachine[] => {
  return Array.from({ length: count }, (_, i) => {
    const region = REGIONS[i % REGIONS.length];
    const type = INSTANCE_TYPES[i % INSTANCE_TYPES.length];
    const status = STATUSES[Math.floor(Math.random() * STATUSES.length)];
    const specs = INSTANCE_TYPE_SPECS[type];
    const totalGb = [64, 128, 256, 512, 1024][i % 5];
    return {
      id: `i-${Math.random().toString(36).substring(2, 12)}`,
      name: `${['web', 'db', 'api', 'cache', 'worker', 'ml-gpu'][i % 6]}-${region.replace(/-/g, '')}-${String(i+1).padStart(2,'0')}`,
      region, type,
      status: status === 'Terminated' ? 'Terminated' : (Math.random() > 0.1 ? 'Running' : 'Stopped'),
      ipAddress: generateRandomIp(),
      publicIpAddress: generateRandomIp(),
      createdAt: new Date(Date.now() - Math.random() * 60 * 24 * 60 * 60 * 1000).toISOString(),
      uptime: Math.floor(Math.random() * 2000),
      tags: [{ key: 'Project', value: 'DemoBank' }, { key: 'Environment', value: ['prod', 'staging', 'dev'][i % 3] }, { key: 'Owner', value: ['TeamA', 'TeamB', 'TeamC'][i % 3] }],
      storage: [{ id: `vol-${Math.random().toString(36).substring(2, 12)}`, type: 'gp3', totalGb, usedGb: Math.floor(Math.random() * totalGb), iops: 3000 }],
      securityGroupId: `sg-${Math.random().toString(36).substring(2, 10)}`,
      amiId: `ami-${Math.random().toString(36).substring(2, 12)}`,
      cpuCores: specs.cpu,
      memoryGb: specs.mem,
    };
  });
};

export const generateMetricData = (metricType: MetricType, points: number): MetricDataPoint[] => {
  const now = Date.now();
  return Array.from({ length: points }, (_, i) => {
    let value = 0;
    switch (metricType) {
      case 'cpu': value = 40 + Math.sin(i / 20) * 30 + Math.random() * 10; break;
      case 'memory': value = 50 + Math.cos(i / 15) * 25 + Math.random() * 15; break;
      case 'diskIO': value = 100 + Math.random() * 1000; break;
      case 'networkIn': value = 500 + Math.random() * 500; break;
      case 'networkOut': value = 300 + Math.random() * 400; break;
      case 'gpu_temp': value = 60 + Math.sin(i / 10) * 15 + Math.random() * 5; break;
      case 'gpu_util': value = 50 + Math.cos(i / 12) * 40 + Math.random() * 10; break;
    }
    return {
      timestamp: now - (points - i) * 60 * 1000, // One point per minute
      value: Math.max(0, metricType.includes('util') || metricType === 'memory' ? Math.min(100, value) : value),
    };
  });
};

export const generateLogs = (count: number): LogEntry[] => {
  return Array.from({ length: count }, (_, i) => ({
    id: `log-${Date.now() - i * 1000}-${Math.random()}`,
    timestamp: new Date(Date.now() - i * Math.random() * 60000).toISOString(),
    level: ['INFO', 'WARN', 'ERROR', 'DEBUG', 'CRITICAL'][Math.floor(Math.random() * 5)] as LogLevel,
    message: LOG_MESSAGES[Math.floor(Math.random() * LOG_MESSAGES.length)],
    context: { userId: `user-${Math.floor(Math.random() * 100)}`, traceId: `trace-${Math.random().toString(36).substring(2,10)}` }
  }));
};

export const generateSecurityEvents = (count: number): SecurityEvent[] => {
  return Array.from({ length: count }, (_, i) => ({
    id: `sec-${Date.now() - i * 10000}-${Math.random()}`,
    timestamp: new Date(Date.now() - i * Math.random() * 3600000).toISOString(),
    type: ['Failed Login', 'Firewall Block', 'Malware Detected', 'Anomalous API Call'][Math.floor(Math.random() * 4)] as any,
    severity: ['Low', 'Medium', 'High', 'Critical'][Math.floor(Math.random() * 4)] as any,
    sourceIp: generateRandomIp(),
    details: 'Suspicious activity detected from known malicious actor network.',
    targetResourceId: `i-${Math.random().toString(36).substring(2, 12)}`,
  }));
};

export const generateAutoscalingGroups = (count: number): AutoscalingGroup[] => {
  return Array.from({ length: count }, (_, i) => {
    const desired = 5 + Math.floor(Math.random() * 10);
    return {
      id: `asg-${Math.random().toString(36).substring(2, 10)}`,
      name: `asg-${['web-fleet', 'api-workers', 'batch-processors'][i % 3]}-${i}`,
      region: REGIONS[i % REGIONS.length], minInstances: 2, maxInstances: desired + 5, desiredInstances: desired,
      currentInstances: desired + Math.floor(Math.random() * 3) - 1,
      instanceType: INSTANCE_TYPES[i % INSTANCE_TYPES.length],
      healthCheckStatus: Math.random() > 0.1 ? 'Healthy' : 'Unhealthy',
      launchTemplateId: `lt-${Math.random().toString(36).substring(2, 12)}`,
    };
  });
};

export const generateK8sClusters = (count: number): KubernetesCluster[] => {
  return Array.from({length: count}, (_, i) => ({
    id: `eks-${Math.random().toString(36).substring(2, 12)}`,
    name: `demobank-cluster-${['prod', 'staging', 'dev'][i%3]}-${i}`,
    region: REGIONS[i % REGIONS.length],
    version: ['1.28', '1.27', '1.26'][i%3],
    status: Math.random() > 0.15 ? 'ACTIVE' : 'DEGRADED',
    nodePools: 3 + i,
    totalNodes: (3 + i) * 5,
    totalCpu: (3 + i) * 5 * 8, // 8 vCPU per node
    totalMemoryGb: (3 + i) * 5 * 32, // 32GB RAM per node
  }));
};

const DUMMY_COST_DATA: CostDataPoint[] = [
    { month: 'Jan', compute: 4000, storage: 2400, network: 1200, database: 3000, ai_services: 500 },
    { month: 'Feb', compute: 3000, storage: 1398, network: 980, database: 2800, ai_services: 650 },
    { month: 'Mar', compute: 2000, storage: 9800, network: 1500, database: 3200, ai_services: 700 },
    { month: 'Apr', compute: 2780, storage: 3908, network: 1100, database: 3100, ai_services: 820 },
    { month: 'May', compute: 1890, storage: 4800, network: 1700, database: 2500, ai_services: 950 },
    { month: 'Jun', compute: 2390, storage: 3800, network: 1300, database: 2900, ai_services: 1100 },
];

let mockInstancesCache = generateVMInstances(128);
let mockK8sClustersCache = generateK8sClusters(5);

// Mock API Service
export const mockApiService = {
  fetchInstances: (filters: any): Promise<{ instances: VirtualMachine[], total: number }> => {
    return new Promise(resolve => {
      setTimeout(() => {
        let allInstances = mockInstancesCache; // Use a cached list
        if (filters.query) {
          allInstances = allInstances.filter(i => i.name.includes(filters.query) || i.ipAddress.includes(filters.query));
        }
        if (filters.region) allInstances = allInstances.filter(i => i.region === filters.region);
        if (filters.status) allInstances = allInstances.filter(i => i.status === filters.status);
        if (filters.sortBy) {
          allInstances.sort((a, b) => {
            const aVal = a[filters.sortBy as keyof VirtualMachine];
            const bVal = b[filters.sortBy as keyof VirtualMachine];
            if (aVal < bVal) return filters.sortOrder === 'asc' ? -1 : 1;
            if (aVal > bVal) return filters.sortOrder === 'asc' ? 1 : -1;
            return 0;
          });
        }
        const total = allInstances.length;
        const page = filters.page || 1;
        const limit = filters.limit || 10;
        const paginated = allInstances.slice((page - 1) * limit, page * limit);
        resolve({ instances: paginated, total: total });
      }, 500 + Math.random() * 500);
    });
  },
  fetchInstanceDetails: (instanceId: string): Promise<VirtualMachine> => new Promise((resolve, reject) => {
    setTimeout(() => {
        const instance = mockInstancesCache.find(i => i.id === instanceId);
        if (instance) resolve(instance);
        else reject(new Error("Instance not found"));
    }, 300);
  }),
  performInstanceAction: (instanceId: string, action: ActionType): Promise<{ status: InstanceStatus }> => new Promise(resolve => {
    setTimeout(() => {
        const instance = mockInstancesCache.find(i => i.id === instanceId);
        if(instance) {
            let newStatus: InstanceStatus = instance.status;
            switch(action) {
                case 'start': newStatus = 'Running'; break;
                case 'stop': newStatus = 'Stopped'; break;
                case 'reboot': newStatus = 'Rebooting'; 
                    setTimeout(() => {
                        const idx = mockInstancesCache.findIndex(i => i.id === instanceId);
                        if(idx !== -1) mockInstancesCache[idx].status = 'Running';
                    }, 5000);
                    break;
                case 'terminate': newStatus = 'Terminated'; break;
            }
            instance.status = newStatus;
            resolve({ status: newStatus });
        }
    }, 1000);
  }),
  fetchMetrics: (instanceId: string, metric: MetricType) => new Promise(res => setTimeout(() => res(generateMetricData(metric, 60)), 400)),
  fetchLogs: (instanceId: string) => new Promise(res => setTimeout(() => res(generateLogs(100)), 600)),
  fetchSecurityEvents: () => new Promise(res => setTimeout(() => res(generateSecurityEvents(50)), 500)),
  fetchAutoscalingGroups: () => new Promise(res => setTimeout(() => res(generateAutoscalingGroups(5)), 500)),
  fetchCostData: () => new Promise(res => setTimeout(() => res(DUMMY_COST_DATA), 300)),
  fetchK8sClusters: () => new Promise(res => setTimeout(() => res(mockK8sClustersCache), 450)),
  fetchSecurityGroup: (sgId: string): Promise<SecurityGroup> => new Promise(res => setTimeout(() => res({
    id: sgId, name: `sg-${sgId.substring(3, 8)}`, description: 'Default web server security group',
    inboundRules: [
        { id: 'sgr-1', protocol: 'TCP', portRange: '80', source: '0.0.0.0/0', description: 'Allow HTTP traffic' },
        { id: 'sgr-2', protocol: 'TCP', portRange: '443', source: '0.0.0.0/0', description: 'Allow HTTPS traffic' },
        { id: 'sgr-3', protocol: 'TCP', portRange: '22', source: '10.0.0.0/16', description: 'Allow SSH from internal network' },
    ],
    outboundRules: [{ id: 'sgr-o1', protocol: 'ALL', portRange: 'ALL', source: '0.0.0.0/0', description: 'Allow all outbound traffic' }]
  }), 350)),
};

// Mock AI Service for Insights and Recommendations
const mockAIService = {
    getInsightsForResource: (resourceId: string): Promise<AIInsight[]> => new Promise(res => setTimeout(() => res([
        { id: 'ai-1', resourceId, category: 'Cost', severity: 'Medium', title: 'Instance is Underutilized', description: 'CPU utilization has averaged under 10% for the past 14 days.', recommendation: 'Consider resizing this instance from c5.2xlarge to a smaller type like c5.large to save costs.', potentialSavings: 120.50 },
        { id: 'ai-2', resourceId, category: 'Security', severity: 'High', title: 'Unrestricted Inbound Access', description: 'Security group allows inbound traffic from 0.0.0.0/0 on port 22 (SSH).', recommendation: 'Restrict SSH access to a specific IP address range or use a bastion host for enhanced security.'},
        { id: 'ai-3', resourceId, category: 'Performance', severity: 'Low', title: 'Disk I/O Nearing Limit', description: 'The attached gp3 volume is frequently hitting its baseline IOPS limit.', recommendation: 'Consider increasing the provisioned IOPS on the volume to prevent performance bottlenecks during peak load.'},
        { id: 'ai-4', resourceId, category: 'Reliability', severity: 'Medium', title: 'Not Part of an Auto Scaling Group', description: 'This instance is a single point of failure. If it goes down, the application may become unavailable.', recommendation: 'Deploy this instance behind a load balancer within an Auto Scaling Group to ensure high availability.'},
    ])), 700)),
};


// SECTION: Reusable UI Components
// ===================================

export const Spinner: FC<{ size?: 'sm' | 'md' | 'lg' }> = ({ size = 'md' }) => {
    const sizeClasses = { sm: 'w-4 h-4 border-2', md: 'w-8 h-8 border-4', lg: 'w-12 h-12 border-4' };
    return <div className={`animate-spin rounded-full ${sizeClasses[size]} border-blue-500 border-t-transparent`}></div>;
};

export const StatusIndicator: FC<{ status: InstanceStatus }> = ({ status }) => {
    const colorMap: Record<InstanceStatus, string> = {
        Running: 'bg-green-500', Stopped: 'bg-gray-500', Pending: 'bg-yellow-500',
        Rebooting: 'bg-blue-500 animate-pulse', Terminated: 'bg-red-500', Provisioning: 'bg-purple-500 animate-pulse',
    };
    return <span className={`inline-block w-3 h-3 rounded-full ${colorMap[status]}`} title={status} />;
};

export const Pill: FC<{ children: ReactNode, color?: string }> = ({ children, color = 'bg-gray-700' }) => (
    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${color} text-white`}>{children}</span>
);

export interface IconProps extends React.SVGProps<SVGSVGElement> {
  icon: 'cpu' | 'ram' | 'disk' | 'network' | 'search' | 'filter' | 'chevron-down' | 'sort-asc' | 'sort-desc' | 'close' | 'gpu' | 'lock' | 'tag' | 'insight';
}

export const Icon: FC<IconProps> = ({ icon, className, ...props }) => {
    const icons = {
        cpu: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M12 6V4m0 16v-2M8 8a2 2 0 100-4 2 2 0 000 4zm8 0a2 2 0 100-4 2 2 0 000 4zm-8 8a2 2 0 100-4 2 2 0 000 4zm8 0a2 2 0 100-4 2 2 0 000 4z" />,
        ram: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h12a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM10 12h4" />,
        disk: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15V7m0 8a2 2 0 100 4 2 2 0 000-4zM12 7a2 2 0 110-4 2 2 0 010 4zM5 12a7 7 0 1114 0 7 7 0 01-14 0z" />,
        network: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m4.632 2.684c.202.404.316.86.316 1.342 0 .482-.114.938-.316 1.342M3 12c0-2.485 1.58-4.635 3.75-5.485m10.5 0A9.002 9.002 0 0121 12c0 2.485-1.58 4.635-3.75 5.485" />,
        search: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />,
        filter: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L12 14.414V19a1 1 0 01-1.447.894L7 18.5V14.414L3.293 6.707A1 1 0 013 6V4z" />,
        'chevron-down': <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />,
        'sort-asc': <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />,
        'sort-desc': <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4 4m0 0l4-4m-4 4V4" />,
        close: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />,
        gpu: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15H4a2 2 0 01-2-2V7a2 2 0 012-2h1m11 0h1a2 2 0 012 2v6a2 2 0 01-2 2h-1m-6 0h.01M5 12h.01M19 12h.01M5 9h.01M19 9h.01M10 15h4a2 2 0 002-2V7a2 2 0 00-2-2h-4a2 2 0 00-2 2v6a2 2 0 002 2z" />,
        lock: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />,
        tag: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5a2 2 0 012 2v5a2 2 0 01-2 2H7a2 2 0 01-2-2V5a2 2 0 012-2z M17 17h.01M17 13h5a2 2 0 012 2v5a2 2 0 01-2 2h-5a2 2 0 01-2-2v-5a2 2 0 012-2z"/>,
        insight: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />,
    };
    return <svg xmlns="http://www.w3.org/2000/svg" className={className || "w-6 h-6"} fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}>{icons[icon]}</svg>;
};


// SECTION: Application State Management (Context & Hooks)
// =========================================================

// --- Notification System ---
const NotificationContext = createContext<{ addNotification: (type: NotificationType, message: string) => void; }>({ addNotification: () => {} });
export const useNotifications = () => useContext(NotificationContext);

export const NotificationProvider: FC<{ children: ReactNode }> = ({ children }) => {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const addNotification = useCallback((type: NotificationType, message: string) => {
        const id = Date.now();
        setNotifications(prev => [...prev, { id, type, message }]);
        setTimeout(() => setNotifications(prev => prev.filter(n => n.id !== id)), 5000);
    }, []);
    return (
        <NotificationContext.Provider value={{ addNotification }}>
            {children}
            <div className="fixed bottom-5 right-5 z-50 space-y-2">
                {notifications.map(n => <NotificationToast key={n.id} notification={n} />)}
            </div>
        </NotificationContext.Provider>
    );
};

export const NotificationToast: FC<{ notification: Notification }> = ({ notification }) => {
    const colors = { success: 'bg-green-600', error: 'bg-red-600', info: 'bg-blue-600', warning: 'bg-yellow-600' };
    return <div className={`px-4 py-3 rounded-md shadow-lg text-white ${colors[notification.type]}`}>{notification.message}</div>;
};

// --- Modal System ---
type ModalState = { isOpen: boolean; content: ReactNode | null };
type ModalAction = { type: 'open'; payload: ReactNode } | { type: 'close' };
const ModalContext = createContext<{ state: ModalState; dispatch: React.Dispatch<ModalAction>; }>({ state: { isOpen: false, content: null }, dispatch: () => {} });

const modalReducer = (state: ModalState, action: ModalAction): ModalState => {
    switch (action.type) {
        case 'open': return { isOpen: true, content: action.payload };
        case 'close': return { isOpen: false, content: null };
        default: return state;
    }
};

export const useModal = () => useContext(ModalContext);

export const ModalProvider: FC<{ children: ReactNode }> = ({ children }) => {
    const [state, dispatch] = useReducer(modalReducer, { isOpen: false, content: null });
    return (
        <ModalContext.Provider value={{ state, dispatch }}>
            {children}
            {state.isOpen && (
                <div className="fixed inset-0 bg-black/70 z-40 flex items-center justify-center" onClick={() => dispatch({ type: 'close' })}>
                    <div className="bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-lg relative" onClick={e => e.stopPropagation()}>
                        <button onClick={() => dispatch({ type: 'close' })} className="absolute top-3 right-3 text-gray-400 hover:text-white"><Icon icon="close" className="w-6 h-6" /></button>
                        {state.content}
                    </div>
                </div>
            )}
        </ModalContext.Provider>
    );
};


// SECTION: Feature Components
// =============================

export interface ConfirmationModalProps { title: string; message: string; onConfirm: () => void; onCancel: () => void; confirmText?: string; cancelText?: string; }
export const ConfirmationModal: FC<ConfirmationModalProps> = ({ title, message, onConfirm, onCancel, confirmText = "Confirm", cancelText = "Cancel" }) => (
    <div>
        <h3 className="text-xl font-bold text-white mb-4">{title}</h3>
        <p className="text-gray-300 mb-6">{message}</p>
        <div className="flex justify-end space-x-4">
            <button onClick={onCancel} className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-500">{cancelText}</button>
            <button onClick={onConfirm} className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-500">{confirmText}</button>
        </div>
    </div>
);

// --- Instance List Components ---
export const SearchAndFilterControls: FC<{ onFiltersChange: (filters: any) => void; }> = ({ onFiltersChange }) => {
    const [query, setQuery] = useState('');
    const [region, setRegion] = useState('');
    const [status, setStatus] = useState('');
    const debounceTimeout = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
        debounceTimeout.current = setTimeout(() => onFiltersChange({ query, region, status }), 300);
        return () => { if (debounceTimeout.current) clearTimeout(debounceTimeout.current) };
    }, [query, region, status, onFiltersChange]);

    return (
        <div className="flex flex-wrap gap-4 items-center">
            <div className="relative flex-grow">
                <Icon icon="search" className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="text" placeholder="Search by name or IP..." value={query} onChange={e => setQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-gray-900/50 border border-gray-700 rounded-md text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"/>
            </div>
            <select value={region} onChange={e => setRegion(e.target.value)} className="bg-gray-900/50 border border-gray-700 rounded-md text-white py-2 px-3 focus:ring-2 focus:ring-blue-500 focus:outline-none">
                <option value="">All Regions</option>{REGIONS.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
            <select value={status} onChange={e => setStatus(e.target.value)} className="bg-gray-900/50 border border-gray-700 rounded-md text-white py-2 px-3 focus:ring-2 focus:ring-blue-500 focus:outline-none">
                <option value="">All Statuses</option>{['Running', 'Stopped', 'Pending', 'Terminated'].map(s => <option key={s} value={s}>{s}</option>)}
            </select>
        </div>
    );
};

export const PaginationControls: FC<{ currentPage: number; totalPages: number; onPageChange: (page: number) => void; }> = ({ currentPage, totalPages, onPageChange }) => {
    if (totalPages <= 1) return null;
    return (
        <div className="flex justify-center items-center space-x-2 mt-4">
            <button onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1} className="px-3 py-1 bg-gray-700 rounded disabled:opacity-50">&laquo;</button>
            <span className="text-gray-300">Page {currentPage} of {totalPages}</span>
            <button onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages} className="px-3 py-1 bg-gray-700 rounded disabled:opacity-50">&raquo;</button>
        </div>
    );
};

// --- Instance Details Components ---
const DetailMetricChart: FC<{ metric: MetricType, instanceId: string, title: string, unit: string, color: string }> = ({ metric, instanceId, title, unit, color }) => {
    const [data, setData] = useState<MetricDataPoint[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        mockApiService.fetchMetrics(instanceId, metric).then(d => setData(d as MetricDataPoint[])).finally(() => setLoading(false));
    }, [instanceId, metric]);

    if (loading) return <div className="h-48 flex items-center justify-center"><Spinner /></div>;
    if (!data.length) return <div className="h-48 flex items-center justify-center text-gray-500">No data available</div>;

    const formattedData = data.map(d => ({ time: new Date(d.timestamp).toLocaleTimeString(), value: d.value.toFixed(2) }));

    return (
        <div>
            <h4 className="text-lg font-semibold text-white mb-2">{title}</h4>
            <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={formattedData}>
                    <defs><linearGradient id={`color${metric}`} x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor={color} stopOpacity={0.8}/><stop offset="95%" stopColor={color} stopOpacity={0}/></linearGradient></defs>
                    <XAxis dataKey="time" stroke="#9ca3af" fontSize={10} tick={{ fill: '#d1d5db' }} />
                    <YAxis stroke="#9ca3af" unit={unit} domain={[0, 'dataMax + 10']} tick={{ fill: '#d1d5db' }} />
                    <Tooltip contentStyle={{ backgroundColor: 'rgba(31, 41, 55, 0.9)', borderColor: '#4b5563' }} />
                    <Area type="monotone" dataKey="value" stroke={color} fillOpacity={1} fill={`url(#color${metric})`} dot={false} />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
};

const LogsTab: FC<{ instanceId: string }> = ({ instanceId }) => {
    const [logs, setLogs] = useState<LogEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [filterLevel, setFilterLevel] = useState<LogLevel | ''>('');

    useEffect(() => {
        setLoading(true);
        mockApiService.fetchLogs(instanceId).then(l => setLogs(l as LogEntry[])).finally(() => setLoading(false));
    }, [instanceId]);
    
    const levelColor: Record<LogLevel, string> = { INFO: 'text-blue-400', WARN: 'text-yellow-400', ERROR: 'text-red-400', DEBUG: 'text-gray-400', CRITICAL: 'text-fuchsia-500' };
    const filteredLogs = logs.filter(log => !filterLevel || log.level === filterLevel);

    if (loading) return <div className="h-96 flex items-center justify-center"><Spinner /></div>;

    return (
        <div className="space-y-4">
            <select onChange={e => setFilterLevel(e.target.value as any)} value={filterLevel} className="bg-gray-700 text-white p-2 rounded">
                <option value="">All Levels</option>
                {['INFO', 'WARN', 'ERROR', 'DEBUG', 'CRITICAL'].map(l => <option key={l} value={l}>{l}</option>)}
            </select>
            <div className="h-96 overflow-y-auto bg-gray-900 p-4 rounded-md font-mono text-sm">
                {filteredLogs.map(log => (
                    <div key={log.id} className="flex gap-4">
                        <span className="text-gray-500">{new Date(log.timestamp).toLocaleTimeString()}</span>
                        <span className={`font-bold w-16 ${levelColor[log.level]}`}>{log.level}</span>
                        <span className="text-gray-300">{log.message}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

const SecurityTab: FC<{ sgId: string }> = ({ sgId }) => {
    const [sg, setSg] = useState<SecurityGroup | null>(null);
    useEffect(() => {
        mockApiService.fetchSecurityGroup(sgId).then(setSg);
    }, [sgId]);

    if (!sg) return <div className="h-96 flex items-center justify-center"><Spinner /></div>;
    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-xl font-bold text-white mb-2">Inbound Rules</h3>
                <div className="overflow-x-auto"><table className="w-full text-sm text-left text-gray-400">
                    <thead className="text-xs text-gray-300 uppercase bg-gray-900/30"><tr><th className="px-4 py-2">Protocol</th><th className="px-4 py-2">Port Range</th><th className="px-4 py-2">Source</th><th className="px-4 py-2">Description</th></tr></thead>
                    <tbody>{sg.inboundRules.map(rule => <tr key={rule.id} className="border-b border-gray-800"><td className="px-4 py-2 font-mono">{rule.protocol}</td><td className="px-4 py-2 font-mono">{rule.portRange}</td><td className="px-4 py-2 font-mono">{rule.source}</td><td className="px-4 py-2">{rule.description}</td></tr>)}</tbody>
                </table></div>
            </div>
             <div>
                <h3 className="text-xl font-bold text-white mb-2">Outbound Rules</h3>
                <div className="overflow-x-auto"><table className="w-full text-sm text-left text-gray-400">
                    <thead className="text-xs text-gray-300 uppercase bg-gray-900/30"><tr><th className="px-4 py-2">Protocol</th><th className="px-4 py-2">Port Range</th><th className="px-4 py-2">Destination</th><th className="px-4 py-2">Description</th></tr></thead>
                    <tbody>{sg.outboundRules.map(rule => <tr key={rule.id} className="border-b border-gray-800"><td className="px-4 py-2 font-mono">{rule.protocol}</td><td className="px-4 py-2 font-mono">{rule.portRange}</td><td className="px-4 py-2 font-mono">{rule.source}</td><td className="px-4 py-2">{rule.description}</td></tr>)}</tbody>
                </table></div>
            </div>
        </div>
    );
};

const AIInsightsTab: FC<{ resourceId: string }> = ({ resourceId }) => {
    const [insights, setInsights] = useState<AIInsight[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        mockAIService.getInsightsForResource(resourceId).then(setInsights).finally(() => setLoading(false));
    }, [resourceId]);
    
    if (loading) return <div className="h-96 flex items-center justify-center"><Spinner /></div>;
    
    const severityColors: Record<AInsightSeverity, string> = { Low: 'border-blue-500', Medium: 'border-yellow-500', High: 'border-orange-500', Critical: 'border-red-500' };
    const iconMap: Record<AInsightCategory, ReactNode> = { Cost: '$', Performance: '⚡️', Security: '🛡️', Reliability: '🔄'};

    return (
        <div className="space-y-4">
            {insights.map(insight => (
                <div key={insight.id} className={`bg-gray-800/50 p-4 rounded-lg border-l-4 ${severityColors[insight.severity]}`}>
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="font-bold text-white text-lg flex items-center gap-2"><span className="text-xl">{iconMap[insight.category]}</span> {insight.title}</p>
                            <p className="text-sm text-gray-400 mt-1">{insight.category} - {insight.severity} Severity</p>
                        </div>
                        {insight.potentialSavings && <Pill color="bg-green-600">Save ~${insight.potentialSavings.toFixed(2)}/mo</Pill>}
                    </div>
                    <p className="text-gray-300 mt-3">{insight.description}</p>
                    <div className="mt-4 bg-gray-900/50 p-3 rounded">
                        <p className="font-semibold text-teal-300">Recommendation:</p>
                        <p className="text-teal-100">{insight.recommendation}</p>
                    </div>
                </div>
            ))}
        </div>
    );
};


export const InstanceDetailsView: FC<{ instance: VirtualMachine | null; onClose: () => void; onAction: (instanceId: string, action: ActionType) => void; }> = ({ instance, onClose, onAction }) => {
    const [activeTab, setActiveTab] = useState('overview');
    if (!instance) return null;

    const tabs = ['overview', 'metrics', 'logs', 'security', 'storage', 'ai insights'];
    const hasGpu = instance.type.startsWith('g') || instance.type.startsWith('p');

    return (
        <div className="fixed top-0 right-0 h-full w-full lg:w-3/5 bg-gray-900/80 backdrop-blur-sm shadow-2xl z-20 transform transition-transform duration-300 ease-in-out" style={{ transform: 'translateX(0)' }}>
            <div className="p-6 h-full flex flex-col">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <h2 className="text-2xl font-bold text-white tracking-wider font-mono">{instance.name}</h2>
                        <div className="flex items-center gap-2 text-gray-400"><StatusIndicator status={instance.status} /><span>{instance.status}</span><span className="text-gray-600">|</span><span>{instance.ipAddress}</span></div>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-white"><Icon icon="close" className="w-8 h-8"/></button>
                </div>
                <div className="flex items-center gap-2 mb-6">
                    <button onClick={() => onAction(instance.id, 'start')} disabled={instance.status === 'Running'} className="px-3 py-1 bg-green-600 text-white rounded disabled:bg-gray-600">Start</button>
                    <button onClick={() => onAction(instance.id, 'stop')} disabled={instance.status === 'Stopped'} className="px-3 py-1 bg-yellow-600 text-white rounded disabled:bg-gray-600">Stop</button>
                    <button onClick={() => onAction(instance.id, 'reboot')} disabled={instance.status !== 'Running'} className="px-3 py-1 bg-blue-600 text-white rounded disabled:bg-gray-600">Reboot</button>
                    <button onClick={() => onAction(instance.id, 'terminate')} className="px-3 py-1 bg-red-700 text-white rounded">Terminate</button>
                </div>
                <div className="border-b border-gray-700 mb-4"><nav className="-mb-px flex space-x-6">
                    {tabs.map(tab => <button key={tab} onClick={() => setActiveTab(tab)} className={`py-3 px-1 border-b-2 font-medium text-sm capitalize ${activeTab === tab ? 'border-blue-500 text-blue-400' : 'border-transparent text-gray-400 hover:text-white hover:border-gray-500'}`}>{tab}</button>)}
                </nav></div>
                <div className="flex-grow overflow-y-auto pr-2">
                    {activeTab === 'overview' && (<div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-300">
                        <div className="bg-gray-800 p-4 rounded"><span className="font-bold text-white">ID:</span> {instance.id}</div>
                        <div className="bg-gray-800 p-4 rounded"><span className="font-bold text-white">Region:</span> {instance.region}</div>
                        <div className="bg-gray-800 p-4 rounded"><span className="font-bold text-white">Type:</span> {instance.type}</div>
                        <div className="bg-gray-800 p-4 rounded"><span className="font-bold text-white">AMI ID:</span> {instance.amiId}</div>
                        <div className="bg-gray-800 p-4 rounded"><span className="font-bold text-white">CPU:</span> {instance.cpuCores} cores</div>
                        <div className="bg-gray-800 p-4 rounded"><span className="font-bold text-white">Memory:</span> {instance.memoryGb} GB</div>
                        <div className="bg-gray-800 p-4 rounded"><span className="font-bold text-white">Public IP:</span> {instance.publicIpAddress}</div>
                        <div className="bg-gray-800 p-4 rounded"><span className="font-bold text-white">Created At:</span> {new Date(instance.createdAt).toLocaleString()}</div>
                        <div className="bg-gray-800 p-4 rounded"><span className="font-bold text-white">Uptime:</span> {instance.uptime} hours</div>
                        <div className="bg-gray-800 p-4 rounded col-span-1 md:col-span-2"><span className="font-bold text-white">Tags:</span><div className="flex flex-wrap gap-2 mt-2">{instance.tags.map(tag => <Pill key={tag.key}>{tag.key}: {tag.value}</Pill>)}</div></div>
                    </div>)}
                    {activeTab === 'metrics' && (<div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                        <Card><DetailMetricChart instanceId={instance.id} metric="cpu" title="CPU Utilization" unit="%" color="#8884d8" /></Card>
                        <Card><DetailMetricChart instanceId={instance.id} metric="memory" title="Memory Usage" unit="%" color="#82ca9d" /></Card>
                        <Card><DetailMetricChart instanceId={instance.id} metric="networkIn" title="Network In" unit="kbps" color="#0ea5e9" /></Card>
                        <Card><DetailMetricChart instanceId={instance.id} metric="networkOut" title="Network Out" unit="kbps" color="#f43f5e" /></Card>
                        {hasGpu && <Card><DetailMetricChart instanceId={instance.id} metric="gpu_util" title="GPU Utilization" unit="%" color="#ffc658" /></Card>}
                        {hasGpu && <Card><DetailMetricChart instanceId={instance.id} metric="gpu_temp" title="GPU Temperature" unit="°C" color="#ff8042" /></Card>}
                    </div>)}
                    {activeTab === 'logs' && <LogsTab instanceId={instance.id} />}
                    {activeTab === 'security' && <SecurityTab sgId={instance.securityGroupId} />}
                    {activeTab === 'storage' && <div className="text-white">Storage management coming soon...</div>}
                    {activeTab === 'ai insights' && <AIInsightsTab resourceId={instance.id} />}
                </div>
            </div>
        </div>
    );
};

// --- Cost Analysis Components ---
export const CostAnalysisView: FC = () => {
    const [costData, setCostData] = useState<CostDataPoint[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => { mockApiService.fetchCostData().then(data => setCostData(data as CostDataPoint[])).finally(() => setLoading(false)); }, []);

    if (loading) return <Card title="Cost Analysis"><div className="h-72 flex justify-center items-center"><Spinner /></div></Card>;
    
    const pieData = ['compute', 'storage', 'network', 'database', 'ai_services'].map(key => ({ name: key.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()), value: costData.reduce((acc, month) => acc + month[key as keyof CostDataPoint], 0) }));
    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF'];

    return (
        <Card title="Cost Analysis (Last 6 Months)">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <h3 className="text-white font-semibold mb-2">Monthly Breakdown</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={costData}>
                            <XAxis dataKey="month" stroke="#9ca3af" />
                            <YAxis stroke="#9ca3af" unit="$" />
                            <Tooltip contentStyle={{ backgroundColor: 'rgba(31, 41, 55, 0.8)', borderColor: '#4b5563' }} />
                            <Legend />
                            <Bar dataKey="compute" stackId="a" fill={COLORS[0]} />
                            <Bar dataKey="storage" stackId="a" fill={COLORS[1]} />
                            <Bar dataKey="network" stackId="a" fill={COLORS[2]} />
                            <Bar dataKey="database" stackId="a" fill={COLORS[3]} />
                            <Bar dataKey="ai_services" stackId="a" fill={COLORS[4]} name="AI Services" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
                <div>
                    <h3 className="text-white font-semibold mb-2">Total Cost Distribution</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>{pieData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}</Pie>
                            <Tooltip contentStyle={{ backgroundColor: 'rgba(31, 41, 55, 0.8)', borderColor: '#4b5563' }} />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </Card>
    );
};

// --- Security Dashboard ---
export const SecurityDashboard: FC = () => {
    const [events, setEvents] = useState<SecurityEvent[]>([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => { mockApiService.fetchSecurityEvents().then(data => setEvents(data as SecurityEvent[])).finally(() => setLoading(false)); }, []);

    const severityColors: Record<SecurityEvent['severity'], string> = { Low: 'bg-blue-500/20 text-blue-300', Medium: 'bg-yellow-500/20 text-yellow-300', High: 'bg-orange-500/20 text-orange-300', Critical: 'bg-red-500/20 text-red-300' };
    if (loading) return <Card title="Recent Security Events"><div className="h-72 flex justify-center items-center"><Spinner /></div></Card>;
    return (
        <Card title="Recent Security Events">
            <div className="overflow-x-auto h-80"><table className="w-full text-sm text-left text-gray-400">
                <thead className="text-xs text-gray-300 uppercase bg-gray-900/30 sticky top-0"><tr><th className="px-6 py-3">Timestamp</th><th className="px-6 py-3">Type</th><th className="px-6 py-3">Severity</th><th className="px-6 py-3">Source IP</th></tr></thead>
                <tbody>{events.slice(0, 15).map(event => (<tr key={event.id} className="border-b border-gray-800 hover:bg-gray-800/50">
                    <td className="px-6 py-4 text-white">{new Date(event.timestamp).toLocaleString()}</td><td className="px-6 py-4">{event.type}</td>
                    <td className="px-6 py-4"><span className={`px-2 py-1 text-xs rounded-full ${severityColors[event.severity]}`}>{event.severity}</span></td>
                    <td className="px-6 py-4 font-mono">{event.sourceIp}</td>
                </tr>))}</tbody>
            </table></div>
        </Card>
    );
};

// --- Kubernetes Dashboard ---
export const KubernetesDashboard: FC = () => {
    const [clusters, setClusters] = useState<KubernetesCluster[]>([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => { mockApiService.fetchK8sClusters().then(data => setClusters(data as KubernetesCluster[])).finally(() => setLoading(false)); }, []);

    if (loading) return <Card title="Kubernetes Clusters"><div className="h-72 flex justify-center items-center"><Spinner /></div></Card>;
    return (
        <Card title="Kubernetes Clusters">
             <div className="overflow-x-auto h-80"><table className="w-full text-sm text-left text-gray-400">
                <thead className="text-xs text-gray-300 uppercase bg-gray-900/30 sticky top-0"><tr><th className="px-6 py-3">Name</th><th className="px-6 py-3">Region</th><th className="px-6 py-3">Version</th><th className="px-6 py-3">Status</th><th className="px-6 py-3">Nodes</th><th className="px-6 py-3">CPU</th><th className="px-6 py-3">Memory</th></tr></thead>
                <tbody>{clusters.map(c => (<tr key={c.id} className="border-b border-gray-800 hover:bg-gray-800/50">
                    <td className="px-6 py-4 text-white font-mono">{c.name}</td>
                    <td className="px-6 py-4">{c.region}</td>
                    <td className="px-6 py-4">{c.version}</td>
                    <td className="px-6 py-4"><Pill color={c.status === 'ACTIVE' ? 'bg-green-600' : 'bg-red-600'}>{c.status}</Pill></td>
                    <td className="px-6 py-4">{c.totalNodes}</td>
                    <td className="px-6 py-4">{c.totalCpu} vCPU</td>
                    <td className="px-6 py-4">{c.totalMemoryGb} GiB</td>
                </tr>))}</tbody>
            </table></div>
        </Card>
    );
};

// SECTION: Main Application View
// ===================================
const DemoBankComputerView: FC = () => {
    const [instances, setInstances] = useState<VirtualMachine[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedInstance, setSelectedInstance] = useState<VirtualMachine | null>(null);
    const [filters, setFilters] = useState({});
    const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0 });
    const [sort, setSort] = useState({ sortBy: 'name', sortOrder: 'asc' });

    const { addNotification } = useNotifications();
    const { dispatch: dispatchModal } = useModal();

    const fetchData = useCallback(() => {
        setLoading(true); setError(null);
        mockApiService.fetchInstances({ ...filters, ...pagination, ...sort })
            .then(data => { setInstances(data.instances); setPagination(prev => ({ ...prev, total: data.total })); })
            .catch(() => { setError("Failed to fetch instances."); addNotification('error', 'Could not load instance data.'); })
            .finally(() => setLoading(false));
    }, [filters, pagination.page, pagination.limit, sort, addNotification]);

    useEffect(() => { fetchData(); }, [fetchData]);

    const handleFiltersChange = useCallback((newFilters: any) => { setPagination(p => ({...p, page: 1})); setFilters(newFilters); }, []);
    const handlePageChange = (newPage: number) => setPagination(p => ({ ...p, page: newPage }));
    const handleSort = (column: keyof VirtualMachine) => setSort(p => ({ sortBy: column, sortOrder: p.sortBy === column && p.sortOrder === 'asc' ? 'desc' : 'asc' }));
    
    const handleAction = useCallback((instanceId: string, action: ActionType) => {
        const instanceName = instances.find(i => i.id === instanceId)?.name || 'this instance';
        const performAction = () => {
            mockApiService.performInstanceAction(instanceId, action).then(res => {
                addNotification('success', `Action '${action}' succeeded for ${instanceName}.`);
                fetchData();
                if (selectedInstance?.id === instanceId) setSelectedInstance(p => p ? {...p, status: res.status} : null);
            }).catch(() => addNotification('error', `Action '${action}' failed for ${instanceName}.`));
            dispatchModal({type: 'close'});
        };
        dispatchModal({type: 'open', payload: <ConfirmationModal title={`Confirm ${action}`} message={`Are you sure you want to ${action} ${instanceName}?`} onConfirm={performAction} onCancel={() => dispatchModal({type: 'close'})}/>});
    }, [addNotification, dispatchModal, fetchData, instances, selectedInstance]);

    const summaryStats = useMemo(() => ({
        total: mockInstancesCache.length,
        running: mockInstancesCache.filter(i => i.status === 'Running').length,
        stopped: mockInstancesCache.filter(i => i.status === 'Stopped').length,
        regions: new Set(mockInstancesCache.map(i => i.region)).size,
    }), []);
    
    const renderSortArrow = (column: keyof VirtualMachine) => (sort.sortBy === column) ? <Icon icon={sort.sortOrder === 'asc' ? 'sort-asc' : 'sort-desc'} className="w-4 h-4 inline ml-1"/> : null;

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold text-white tracking-wider">Demo Bank Compute Dashboard</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="text-center"><p className="text-3xl font-bold text-white">{summaryStats.total}</p><p className="text-sm text-gray-400 mt-1">Total Instances</p></Card>
                <Card className="text-center"><p className="text-3xl font-bold text-white">{summaryStats.running}</p><p className="text-sm text-gray-400 mt-1">Running</p></Card>
                <Card className="text-center"><p className="text-3xl font-bold text-white">{summaryStats.stopped}</p><p className="text-sm text-gray-400 mt-1">Stopped</p></Card>
                <Card className="text-center"><p className="text-3xl font-bold text-white">{summaryStats.regions}</p><p className="text-sm text-gray-400 mt-1">Regions</p></Card>
            </div>
            
            <Card title="Virtual Machine Instances">
                 <div className="p-4"><SearchAndFilterControls onFiltersChange={handleFiltersChange} /></div>
                 <div className="overflow-x-auto">
                    {loading && <div className="h-64 flex items-center justify-center"><Spinner size="lg" /></div>}
                    {!loading && error && <div className="h-64 flex items-center justify-center text-red-400">{error}</div>}
                    {!loading && !error && (
                    <table className="w-full text-sm text-left text-gray-400">
                        <thead className="text-xs text-gray-300 uppercase bg-gray-900/30"><tr>
                            <th className="px-6 py-3 cursor-pointer" onClick={() => handleSort('name')}>Instance Name {renderSortArrow('name')}</th>
                            <th className="px-6 py-3 cursor-pointer" onClick={() => handleSort('status')}>Status {renderSortArrow('status')}</th>
                            <th className="px-6 py-3 cursor-pointer" onClick={() => handleSort('region')}>Region {renderSortArrow('region')}</th>
                            <th className="px-6 py-3 cursor-pointer" onClick={() => handleSort('type')}>Type {renderSortArrow('type')}</th>
                            <th className="px-6 py-3">IP Address</th><th className="px-6 py-3">Actions</th>
                        </tr></thead>
                        <tbody>{instances.map(vm => (
                            <tr key={vm.id} className="border-b border-gray-800 hover:bg-gray-800/50 cursor-pointer" onClick={() => setSelectedInstance(vm)}>
                                <td className="px-6 py-4 font-mono text-white">{vm.name}</td>
                                <td className="px-6 py-4"><div className="flex items-center gap-2"><StatusIndicator status={vm.status} /><span>{vm.status}</span></div></td>
                                <td className="px-6 py-4">{vm.region}</td><td className="px-6 py-4 font-mono">{vm.type}</td><td className="px-6 py-4 font-mono">{vm.ipAddress}</td>
                                <td className="px-6 py-4" onClick={e => e.stopPropagation()}><button onClick={() => handleAction(vm.id, 'reboot')} className="text-blue-400 hover:text-blue-300">Reboot</button></td>
                            </tr>
                        ))}</tbody>
                    </table>
                    )}
                </div>
                <PaginationControls currentPage={pagination.page} totalPages={Math.ceil(pagination.total / pagination.limit)} onPageChange={handlePageChange} />
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <SecurityDashboard />
                <KubernetesDashboard />
            </div>

            <CostAnalysisView />
            
            {selectedInstance && <InstanceDetailsView instance={selectedInstance} onClose={() => setSelectedInstance(null)} onAction={handleAction}/>}
        </div>
    );
};

export const EnhancedDemoBankComputerView: FC = () => (
    <NotificationProvider>
        <ModalProvider>
            <DemoBankComputerView />
        </ModalProvider>
    </NotificationProvider>
);

export default EnhancedDemoBankComputerView;