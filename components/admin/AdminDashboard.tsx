import React, { useState, useEffect, useMemo, useCallback, useRef, useReducer } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Users,
  Activity,
  PlugZap,
  Server,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Search,
  Filter,
  Download,
  RefreshCw,
  Settings,
  ShieldAlert,
  Database,
  Cpu,
  HardDrive,
  Terminal,
  ExternalLink,
  Play,
  Pause,
  Trash2,
  Plus,
  Edit3,
  Sliders,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  FileText,
  TrendingUp,
  TrendingDown,
  Layers,
  Radio,
  Shield,
  Zap,
  Info,
  Check,
  AlertCircle,
  MoreVertical,
  ChevronRight,
  Calendar,
  UserCheck,
  UserMinus,
  DollarSign,
  Percent,
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

// ============================================================================
// 1. ARCHITECTURAL TYPES & DOMAIN MODELS
// ============================================================================

export type AnomalySeverity = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
export type AnomalyStatus = 'ACTIVE' | 'INVESTIGATING' | 'RESOLVED' | 'DISMISSED';
export type AnomalyCategory = 'FRAUD' | 'SYSTEM_EXPLOIT' | 'RATE_LIMIT' | 'UNUSUAL_VOLUME' | 'GEO_SUSPICIOUS';

export interface Anomaly {
  id: string;
  timestamp: string;
  severity: AnomalySeverity;
  status: AnomalyStatus;
  category: AnomalyCategory;
  description: string;
  entityType: 'USER' | 'TRANSACTION' | 'API_KEY' | 'IP_ADDRESS';
  entityId: string;
  metadata: {
    ipAddress?: string;
    location?: string;
    amount?: number;
    thresholdExceeded?: number;
    actualValue?: number;
    userAgent?: string;
    resolvedBy?: string;
    resolvedAt?: string;
    resolutionNotes?: string;
  };
}

export type WebhookStatus = 'ACTIVE' | 'PAUSED' | 'FAILED';
export type WebhookEvent = 
  | 'user.created' 
  | 'user.deleted' 
  | 'transaction.success' 
  | 'transaction.failed' 
  | 'security.anomaly' 
  | 'system.degraded'
  | 'integration.offline';

export interface WebhookDeliveryLog {
  id: string;
  timestamp: string;
  event: WebhookEvent;
  statusCode: number;
  durationMs: number;
  success: boolean;
  payloadPreview: string;
}

export interface Webhook {
  id: string;
  name: string;
  callbackUrl: string;
  status: WebhookStatus;
  events: WebhookEvent[];
  lastTriggered: string;
  failureCount: number;
  secret: string;
  deliveryLogs: WebhookDeliveryLog[];
  createdAt: string;
}

export type IntegrationStatus = 'OPERATIONAL' | 'DEGRADED' | 'OUTAGE';

export interface IntegrationMetric {
  timestamp: string;
  latencyMs: number;
  errorRate: number;
  throughput: number;
}

export interface Integration {
  id: string;
  name: string;
  provider: string;
  status: IntegrationStatus;
  apiCalls24h: number;
  errorRate24h: number;
  averageLatencyMs: number;
  metricsHistory: IntegrationMetric[];
  lastSyncTime: string;
  category: 'AUTH' | 'PAYMENT' | 'CRM' | 'CLOUD' | 'COMMUNICATION';
}

export interface SystemHealth {
  overallStatus: 'OPERATIONAL' | 'DEGRADED' | 'CRITICAL';
  uptime: string;
  averageResponseTime: number;
  cpu: {
    usage: number;
    cores: number;
    history: number[];
  };
  memory: {
    totalGB: number;
    usedGB: number;
    history: number[];
  };
  disk: {
    totalGB: number;
    usedGB: number;
    history: number[];
  };
  database: {
    status: 'CONNECTED' | 'DISCONNECTED';
    activeConnections: number;
    latencyMs: number;
    history: number[];
  };
}

export interface UserMetrics {
  totalUsers: number;
  newUsersToday: number;
  activeUsers24h: number;
  growthLast30d: number;
  churnRate: number;
  conversionRate: number;
}

export interface UserGrowthPoint {
  name: string;
  users: number;
  activeUsers: number;
  revenue: number;
}

export type LogLevel = 'INFO' | 'WARN' | 'ERROR' | 'DEBUG';
export type LogCategory = 'AUTH' | 'BILLING' | 'API' | 'SYSTEM' | 'SECURITY';

export interface ActivityLog {
  id: string;
  timestamp: string;
  level: LogLevel;
  category: LogCategory;
  message: string;
  operator: string;
  ipAddress: string;
}

export interface AuditTrailEntry {
  id: string;
  timestamp: string;
  actor: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
  action: string;
  target: string;
  ipAddress: string;
  status: 'SUCCESS' | 'FAILURE';
  changes?: {
    field: string;
    oldValue: string;
    newValue: string;
  }[];
}

// ============================================================================
// 2. CONFIGURATION & CONSTANTS
// ============================================================================

export const API_BASE_URL = 'https://ce47fe80-dabc-4ad0-b0e7-cf285695b8b8.mock.pstmn.io';

export const WEBHOOK_EVENTS: { value: WebhookEvent; label: string; description: string }[] = [
  { value: 'user.created', label: 'User Created', description: 'Triggered when a new user registers.' },
  { value: 'user.deleted', label: 'User Deleted', description: 'Triggered when a user account is removed.' },
  { value: 'transaction.success', label: 'Transaction Success', description: 'Triggered on successful financial transactions.' },
  { value: 'transaction.failed', label: 'Transaction Failed', description: 'Triggered when a transaction fails or is declined.' },
  { value: 'security.anomaly', label: 'Security Anomaly', description: 'Triggered when the AI engine detects suspicious activity.' },
  { value: 'system.degraded', label: 'System Degraded', description: 'Triggered when system performance drops below thresholds.' },
  { value: 'integration.offline', label: 'Integration Offline', description: 'Triggered when a third-party integration goes down.' },
];

export const INTEGRATION_PROVIDERS = [
  { id: 'google', name: 'Google Cloud Auth', provider: 'Google', category: 'AUTH' },
  { id: 'stripe', name: 'Stripe Payments', provider: 'Stripe', category: 'PAYMENT' },
  { id: 'salesforce', name: 'Salesforce CRM', provider: 'Salesforce', category: 'CRM' },
  { id: 'aws', name: 'Amazon Web Services', provider: 'AWS', category: 'CLOUD' },
  { id: 'twilio', name: 'Twilio SMS', provider: 'Twilio', category: 'COMMUNICATION' },
  { id: 'sendgrid', name: 'SendGrid Email', provider: 'SendGrid', category: 'COMMUNICATION' },
  { id: 'auth0', name: 'Auth0 Identity', provider: 'Auth0', category: 'AUTH' },
] as const;

// ============================================================================
// 3. HIGH-FIDELITY GENERATIVE DATA FUNCTIONS
// ============================================================================

export const generateSystemHealth = (existingHistory?: { cpu: number[]; memory: number[]; disk: number[]; db: number[] }): SystemHealth => {
  const overallRand = Math.random();
  const overallStatus = overallRand > 0.95 ? 'CRITICAL' : overallRand > 0.85 ? 'DEGRADED' : 'OPERATIONAL';
  
  const cpuBase = overallStatus === 'CRITICAL' ? 85 : overallStatus === 'DEGRADED' ? 65 : 25;
  const memBase = overallStatus === 'CRITICAL' ? 90 : overallStatus === 'DEGRADED' ? 75 : 45;
  const dbBase = overallStatus === 'CRITICAL' ? 120 : overallStatus === 'DEGRADED' ? 60 : 12;

  const nextCpu = Math.min(100, Math.max(0, Math.floor(cpuBase + Math.random() * 20)));
  const nextMem = Math.min(100, Math.max(0, Math.floor(memBase + Math.random() * 10)));
  const nextDisk = Math.min(100, Math.max(0, Math.floor(68 + Math.random() * 0.5))); // Disk grows very slowly
  const nextDb = Math.min(500, Math.max(1, Math.floor(dbBase + Math.random() * 15)));

  const updateHistory = (history: number[] | undefined, nextVal: number, maxLen = 20): number[] => {
    if (!history || history.length === 0) {
      return Array.from({ length: maxLen }, () => Math.max(0, Math.floor(nextVal - 10 + Math.random() * 20)));
    }
    const updated = [...history, nextVal];
    if (updated.length > maxLen) updated.shift();
    return updated;
  };

  return {
    overallStatus,
    uptime: `${(99.95 + Math.random() * 0.04).toFixed(3)}%`,
    averageResponseTime: Math.floor(85 + Math.random() * 45),
    cpu: {
      usage: nextCpu,
      cores: 16,
      history: updateHistory(existingHistory?.cpu, nextCpu),
    },
    memory: {
      totalGB: 64,
      usedGB: parseFloat(((64 * nextMem) / 100).toFixed(1)),
      history: updateHistory(existingHistory?.memory, nextMem),
    },
    disk: {
      totalGB: 1024,
      usedGB: parseFloat(((1024 * nextDisk) / 100).toFixed(1)),
      history: updateHistory(existingHistory?.disk, nextDisk),
    },
    database: {
      status: overallStatus === 'CRITICAL' && Math.random() > 0.8 ? 'DISCONNECTED' : 'CONNECTED',
      activeConnections: Math.floor(120 + Math.random() * 80),
      latencyMs: nextDb,
      history: updateHistory(existingHistory?.db, nextDb),
    },
  };
};

export const generateUserMetrics = (): UserMetrics => {
  const totalUsers = 142850 + Math.floor(Math.random() * 1250);
  return {
    totalUsers,
    newUsersToday: Math.floor(180 + Math.random() * 75),
    activeUsers24h: Math.floor(totalUsers * (0.12 + Math.random() * 0.04)),
    growthLast30d: parseFloat((8.4 + Math.random() * 3.2).toFixed(2)),
    churnRate: parseFloat((1.8 + Math.random() * 0.6).toFixed(2)),
    conversionRate: parseFloat((3.2 + Math.random() * 1.1).toFixed(2)),
  };
};

export const generateUserGrowthData = (months = 12): UserGrowthPoint[] => {
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const data: UserGrowthPoint[] = [];
  let userCount = 85000;
  let revenueBase = 120000;

  const now = new Date();
  const startMonth = (now.getMonth() - months + 13) % 12;

  for (let i = 0; i < months; i++) {
    const monthIndex = (startMonth + i) % 12;
    const growthFactor = 1 + (0.04 + Math.random() * 0.08);
    userCount = Math.floor(userCount * growthFactor);
    revenueBase = Math.floor(revenueBase * (growthFactor - 0.02 + Math.random() * 0.05));
    
    data.push({
      name: monthNames[monthIndex],
      users: userCount,
      activeUsers: Math.floor(userCount * (0.15 + Math.random() * 0.05)),
      revenue: revenueBase,
    });
  }
  return data;
};

export const generateAnomalies = (count = 10): Anomaly[] => {
  const severities: AnomalySeverity[] = ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'];
  const statuses: AnomalyStatus[] = ['ACTIVE', 'INVESTIGATING', 'RESOLVED', 'DISMISSED'];
  const categories: AnomalyCategory[] = ['FRAUD', 'SYSTEM_EXPLOIT', 'RATE_LIMIT', 'UNUSUAL_VOLUME', 'GEO_SUSPICIOUS'];
  const entityTypes: Anomaly['entityType'][] = ['USER', 'TRANSACTION', 'API_KEY', 'IP_ADDRESS'];

  const descriptions: Record<AnomalyCategory, string[]> = {
    FRAUD: [
      'Multiple high-value transactions from unverified device.',
      'Rapid succession of micro-transactions matching card-testing patterns.',
      'Account takeover suspected: sudden change of email followed by withdrawal request.',
    ],
    SYSTEM_EXPLOIT: [
      'SQL injection pattern detected in query parameters.',
      'Buffer overflow attempt blocked by Web Application Firewall.',
      'Unusual payload size detected on public endpoint /api/v1/upload.',
    ],
    RATE_LIMIT: [
      'IP address exceeded global rate limit on authentication endpoints.',
      'API key executing concurrent requests far exceeding tier limits.',
      'Brute-force login attempts detected on administrative portal.',
    ],
    UNUSUAL_VOLUME: [
      'Outbound data transfer spike: 45GB transferred in under 10 minutes.',
      'Sudden 400% surge in API requests from single corporate tenant.',
      'Database write operations spiked to 15,000 IOPS.',
    ],
    GEO_SUSPICIOUS: [
      'Impossible travel time: login from Tokyo 15 minutes after login from London.',
      'Access attempt from sanctioned country IP range.',
      'VPN/Proxy network routing detected on high-privilege account.',
    ],
  };

  const operators = ['Sarah Connor', 'John Doe', 'Ellen Ripley', 'Marcus Aurelius', 'Ada Lovelace'];

  return Array.from({ length: count }, (_, i) => {
    const category = categories[Math.floor(Math.random() * categories.length)];
    const severity = severities[Math.floor(Math.random() * (i === 0 ? 2 : 4))]; // Ensure at least some high/critical
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const entityType = entityTypes[Math.floor(Math.random() * entityTypes.length)];
    const descList = descriptions[category];
    const description = descList[Math.floor(Math.random() * descList.length)];

    const isResolved = status === 'RESOLVED' || status === 'DISMISSED';
    const resolvedAt = isResolved ? new Date(Date.now() - Math.random() * 86400000 * 3).toISOString() : undefined;
    const resolvedBy = isResolved ? operators[Math.floor(Math.random() * operators.length)] : undefined;
    const resolutionNotes = isResolved ? 'Investigated logs, verified identity, and applied security patches.' : undefined;

    return {
      id: `anom-${1000 + i}`,
      timestamp: new Date(Date.now() - i * 3600000 * (1 + Math.random() * 3)).toISOString(),
      severity,
      status,
      category,
      description,
      entityType,
      entityId: `${entityType.substring(0, 3).toLowerCase()}-${Math.floor(100000 + Math.random() * 900000)}`,
      metadata: {
        ipAddress: `192.168.${Math.floor(1 + Math.random() * 254)}.${Math.floor(1 + Math.random() * 254)}`,
        location: ['San Francisco, US', 'Frankfurt, DE', 'Singapore, SG', 'Sydney, AU', 'São Paulo, BR'][Math.floor(Math.random() * 5)],
        amount: category === 'FRAUD' ? parseFloat((500 + Math.random() * 9500).toFixed(2)) : undefined,
        thresholdExceeded: category === 'RATE_LIMIT' ? 100 : undefined,
        actualValue: category === 'RATE_LIMIT' ? Math.floor(1200 + Math.random() * 800) : undefined,
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        resolvedBy,
        resolvedAt,
        resolutionNotes,
      },
    };
  });
};

export const generateWebhooks = (): Webhook[] => {
  const urls = [
    'https://api.enterprise-partner.com/v2/webhooks/receiver',
    'https://hooks.slack.com/services/T00000000/B00000000/XXXXXXXXXXXXXXXXXXXXXXXX',
    'https://zapier.com/hooks/catch/123456/abcde/',
    'https://requestb.in/17g8z91',
    'https://internal-analytics.quantumcore.io/ingest',
  ];

  const names = [
    'Enterprise Sync Engine',
    'Slack Security Alerts Channel',
    'Zapier CRM Automation Pipeline',
    'Debug RequestBin Endpoint',
    'Internal Analytics Ingestion Node',
  ];

  return Array.from({ length: urls.length }, (_, i) => {
    const status: WebhookStatus = i === 3 ? 'FAILED' : i === 4 ? 'PAUSED' : 'ACTIVE';
    const failureCount = status === 'FAILED' ? Math.floor(5 + Math.random() * 15) : 0;
    
    const deliveryLogs: WebhookDeliveryLog[] = Array.from({ length: 5 }, (_, logIdx) => {
      const isSuccess = status === 'ACTIVE' ? Math.random() > 0.05 : Math.random() > 0.8;
      const statusCode = isSuccess ? 200 : [400, 404, 500, 502, 504][Math.floor(Math.random() * 5)];
      const event = WEBHOOK_EVENTS[Math.floor(Math.random() * WEBHOOK_EVENTS.length)].value;
      
      return {
        id: `log-${i}-${logIdx}`,
        timestamp: new Date(Date.now() - logIdx * 7200000).toISOString(),
        event,
        statusCode,
        durationMs: Math.floor(45 + Math.random() * 350),
        success: isSuccess,
        payloadPreview: JSON.stringify({
          event,
          timestamp: Date.now(),
          data: { id: `evt-${Math.floor(Math.random() * 10000)}`, status: 'processed' }
        }),
      };
    });

    return {
      id: `wh-${2000 + i}`,
      name: names[i],
      callbackUrl: urls[i],
      status,
      events: i === 0 ? ['user.created', 'transaction.success'] : i === 1 ? ['security.anomaly', 'system.degraded'] : ['user.created', 'user.deleted', 'transaction.success', 'transaction.failed', 'security.anomaly'],
      lastTriggered: new Date(Date.now() - Math.random() * 3600000).toISOString(),
      failureCount,
      secret: `whsec_${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`,
      deliveryLogs,
      createdAt: new Date(Date.now() - 86400000 * 30 * i).toISOString(),
    };
  });
};

export const generateIntegrations = (): Integration[] => {
  return INTEGRATION_PROVIDERS.map((prov, i) => {
    const statusRand = Math.random();
    const status: IntegrationStatus = statusRand > 0.92 ? 'OUTAGE' : statusRand > 0.8 ? 'DEGRADED' : 'OPERATIONAL';
    
    const errorRate24h = status === 'OPERATIONAL' 
      ? parseFloat((Math.random() * 0.4).toFixed(3)) 
      : status === 'DEGRADED' 
        ? parseFloat((1.5 + Math.random() * 4.5).toFixed(2)) 
        : parseFloat((15 + Math.random() * 85).toFixed(2));

    const averageLatencyMs = status === 'OPERATIONAL'
      ? Math.floor(45 + Math.random() * 80)
      : status === 'DEGRADED'
        ? Math.floor(250 + Math.random() * 600)
        : Math.floor(1500 + Math.random() * 3500);

    const metricsHistory: IntegrationMetric[] = Array.from({ length: 12 }, (_, idx) => {
      const timeOffset = (12 - idx) * 2 * 3600000; // 2-hour intervals
      const histStatusRand = Math.random();
      const histStatus = histStatusRand > 0.95 ? 'DEGRADED' : 'OPERATIONAL';
      
      return {
        timestamp: new Date(Date.now() - timeOffset).toISOString(),
        latencyMs: histStatus === 'OPERATIONAL' ? Math.floor(45 + Math.random() * 80) : Math.floor(250 + Math.random() * 400),
        errorRate: histStatus === 'OPERATIONAL' ? parseFloat((Math.random() * 0.5).toFixed(2)) : parseFloat((2 + Math.random() * 5).toFixed(2)),
        throughput: Math.floor(1200 + Math.random() * 800),
      };
    });

    return {
      id: prov.id,
      name: prov.name,
      provider: prov.provider,
      status,
      apiCalls24h: Math.floor(85000 + Math.random() * 165000),
      errorRate24h,
      averageLatencyMs,
      metricsHistory,
      lastSyncTime: new Date(Date.now() - Math.random() * 300000).toISOString(),
      category: prov.category,
    };
  });
};

export const generateActivityLogs = (count = 15): ActivityLog[] => {
  const levels: LogLevel[] = ['INFO', 'WARN', 'ERROR', 'DEBUG'];
  const categories: LogCategory[] = ['AUTH', 'BILLING', 'API', 'SYSTEM', 'SECURITY'];
  
  const messages: Record<LogCategory, string[]> = {
    AUTH: [
      'User login successful via OAuth2 provider.',
      'Multi-factor authentication challenge issued.',
      'Password reset token generated for administrative user.',
      'Failed login attempt from unrecognized IP address.',
    ],
    BILLING: [
      'Subscription invoice generated successfully.',
      'Payment gateway webhook processed: charge.succeeded.',
      'Dunning email dispatched for failed subscription renewal.',
      'Refund processed for transaction tx_982341.',
    ],
    API: [
      'API key rotation completed for client application.',
      'Rate limit threshold reached for tenant corporate-alpha.',
      'Deprecated API endpoint /v1/legacy accessed.',
      'GraphQL query complexity limit exceeded.',
    ],
    SYSTEM: [
      'Database connection pool scaled up to 45 active connections.',
      'Redis cache eviction policy triggered: volatile-lru.',
      'Background worker job queue cleared.',
      'Server cluster health check completed successfully.',
    ],
    SECURITY: [
      'WAF blocked cross-site scripting (XSS) attempt.',
      'SSL certificate renewal verified by Let\'s Encrypt.',
      'File integrity monitor detected modification in /etc/nginx/conf.d.',
      'SSH login attempt blocked after 5 consecutive failures.',
    ],
  };

  const operators = ['System Daemon', 'Sarah Connor', 'John Doe', 'Ellen Ripley', 'Marcus Aurelius', 'Ada Lovelace'];

  return Array.from({ length: count }, (_, i) => {
    const category = categories[Math.floor(Math.random() * categories.length)];
    const level = levels[Math.floor(Math.random() * (i % 5 === 0 ? 3 : 2))]; // Bias towards INFO/WARN
    const msgList = messages[category];
    const message = msgList[Math.floor(Math.random() * msgList.length)];

    return {
      id: `log-${5000 + i}`,
      timestamp: new Date(Date.now() - i * 600000 * (1 + Math.random() * 2)).toISOString(),
      level,
      category,
      message,
      operator: level === 'SYSTEM' || level === 'SECURITY' ? 'System Daemon' : operators[Math.floor(Math.random() * operators.length)],
      ipAddress: `10.0.${Math.floor(1 + Math.random() * 254)}.${Math.floor(1 + Math.random() * 254)}`,
    };
  });
};

export const generateAuditTrail = (count = 10): AuditTrailEntry[] => {
  const actors = [
    { id: 'usr-101', name: 'Sarah Connor', email: 'sconnor@quantumcore.io', role: 'Super Admin' },
    { id: 'usr-102', name: 'John Doe', email: 'jdoe@quantumcore.io', role: 'Security Engineer' },
    { id: 'usr-103', name: 'Ellen Ripley', email: 'eripley@quantumcore.io', role: 'Operations Lead' },
    { id: 'usr-104', name: 'Marcus Aurelius', email: 'maurelius@quantumcore.io', role: 'Compliance Officer' },
  ];

  const actions = [
    { action: 'Update Webhook Configuration', target: 'Webhook: Slack Security Alerts Channel' },
    { action: 'Resolve Security Anomaly', target: 'Anomaly: anom-1002' },
    { action: 'Rotate API Secret Key', target: 'Integration: Stripe Payments' },
    { action: 'Modify System Rate Limits', target: 'Global API Gateway Settings' },
    { action: 'Export Financial Audit Logs', target: 'Billing Database Table' },
    { action: 'Revoke Administrative Access', target: 'User: jsmith@quantumcore.io' },
  ];

  return Array.from({ length: count }, (_, i) => {
    const actor = actors[Math.floor(Math.random() * actors.length)];
    const act = actions[Math.floor(Math.random() * actions.length)];
    const status = Math.random() > 0.05 ? 'SUCCESS' : 'FAILURE';

    const changes = Math.random() > 0.3 ? [
      {
        field: 'status',
        oldValue: 'ACTIVE',
        newValue: 'PAUSED',
      },
      {
        field: 'retry_policy',
        oldValue: 'exponential_backoff',
        newValue: 'immediate_retry',
      }
    ] : undefined;

    return {
      id: `audit-${8000 + i}`,
      timestamp: new Date(Date.now() - i * 7200000 * (1 + Math.random() * 1.5)).toISOString(),
      actor,
      action: act.action,
      target: act.target,
      ipAddress: `192.168.10.${Math.floor(10 + Math.random() * 80)}`,
      status,
      changes,
    };
  });
};

// ============================================================================
// 4. UTILITY HELPER FUNCTIONS
// ============================================================================

export const formatDistanceToNow = (dateString: string): string => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (seconds < 5) return 'Just now';
  if (seconds < 60) return `${seconds}s ago`;
  
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  
  const months = Math.floor(days / 30);
  if (months < 12) return `${months}mo ago`;
  
  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
};

export const formatBytes = (bytes: number, decimals = 2): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

export const formatNumber = (num: number): string => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
  }
  return num.toString();
};

export const formatCurrency = (num: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(num);
};

export const cn = (...classes: (string | undefined | null | boolean | { [key: string]: boolean })[]): string => {
  const result: string[] = [];
  for (const item of classes) {
    if (!item) continue;
    if (typeof item === 'string') {
      result.push(item);
    } else if (typeof item === 'object') {
      for (const key in item) {
        if (item[key]) {
          result.push(key);
        }
      }
    }
  }
  return result.join(' ');
};

export const exportToCSV = (data: any[], filename: string): void => {
  if (!data || !data.length) return;
  
  const headers = Object.keys(data[0]).join(',');
  const rows = data.map(row => {
    return Object.values(row).map(val => {
      const str = typeof val === 'object' ? JSON.stringify(val) : String(val);
      return `"${str.replace(/"/g, '""')}"`;
    }).join(',');
  });
  
  const csvContent = 'data:text/csv;charset=utf-8,' + [headers, ...rows].join('\n');
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `${filename}_${new Date().toISOString().split('T')[0]}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};// ============================================================================
// 5. STATE MANAGEMENT (REDUCER, ACTIONS, & STATE MACHINE)
// ============================================================================

export interface DashboardState {
  loading: boolean;
  error: string | null;
  activeTab: string;
  systemHealth: SystemHealth;
  userMetrics: UserMetrics;
  userGrowthData: UserGrowthPoint[];
  anomalies: Anomaly[];
  webhooks: Webhook[];
  integrations: Integration[];
  activityLogs: ActivityLog[];
  auditTrail: AuditTrailEntry[];
  filters: {
    anomalySeverity: AnomalySeverity | 'ALL';
    anomalyStatus: AnomalyStatus | 'ALL';
    anomalyCategory: AnomalyCategory | 'ALL';
    anomalySearch: string;
    webhookSearch: string;
    integrationCategory: 'ALL' | 'AUTH' | 'PAYMENT' | 'CRM' | 'CLOUD' | 'COMMUNICATION';
    logLevel: LogLevel | 'ALL';
    logCategory: LogCategory | 'ALL';
    logSearch: string;
    auditSearch: string;
  };
  modals: {
    resolveAnomaly: Anomaly | null;
    webhookForm: Webhook | null; // null for closed, Webhook with empty fields for create, existing for edit
    webhookLogs: Webhook | null;
    systemTerminal: boolean;
  };
  terminalLogs: string[];
  isLivePolling: boolean;
}

export type DashboardAction =
  | { type: 'FETCH_INIT' }
  | { type: 'FETCH_SUCCESS'; payload: { anomalies: Anomaly[]; webhooks: Webhook[] } }
  | { type: 'FETCH_FAILURE'; payload: string }
  | { type: 'POLL_SYSTEM_HEALTH'; payload: SystemHealth }
  | { type: 'POLL_USER_METRICS'; payload: UserMetrics }
  | { type: 'POLL_REALTIME_EVENTS'; payload: { anomaly?: Anomaly; log?: ActivityLog; audit?: AuditTrailEntry } }
  | { type: 'SET_ACTIVE_TAB'; payload: string }
  | { type: 'SET_FILTER'; payload: { key: keyof DashboardState['filters']; value: any } }
  | { type: 'RESET_FILTERS' }
  | { type: 'OPEN_MODAL'; payload: { key: keyof DashboardState['modals']; data: any } }
  | { type: 'CLOSE_MODAL'; payload: { key: keyof DashboardState['modals'] } }
  | { type: 'RESOLVE_ANOMALY_SUBMIT'; payload: { id: string; notes: string; operator: string } }
  | { type: 'DISMISS_ANOMALY_SUBMIT'; payload: { id: string; notes: string; operator: string } }
  | { type: 'SAVE_WEBHOOK'; payload: Webhook }
  | { type: 'DELETE_WEBHOOK'; payload: string }
  | { type: 'TOGGLE_WEBHOOK_STATUS'; payload: string }
  | { type: 'SYNC_INTEGRATION_START'; payload: string }
  | { type: 'SYNC_INTEGRATION_SUCCESS'; payload: { id: string; metrics: IntegrationMetric; latency: number; errorRate: number } }
  | { type: 'SYNC_INTEGRATION_FAILURE'; payload: { id: string; errorRate: number } }
  | { type: 'ADD_TERMINAL_LOG'; payload: string }
  | { type: 'CLEAR_TERMINAL_LOGS' }
  | { type: 'TOGGLE_LIVE_POLLING' };

export const initialDashboardState = (): DashboardState => {
  const initialHealth = generateSystemHealth();
  return {
    loading: true,
    error: null,
    activeTab: 'overview',
    systemHealth: initialHealth,
    userMetrics: generateUserMetrics(),
    userGrowthData: generateUserGrowthData(12),
    anomalies: [],
    webhooks: [],
    integrations: generateIntegrations(),
    activityLogs: generateActivityLogs(25),
    auditTrail: generateAuditTrail(15),
    filters: {
      anomalySeverity: 'ALL',
      anomalyStatus: 'ALL',
      anomalyCategory: 'ALL',
      anomalySearch: '',
      webhookSearch: '',
      integrationCategory: 'ALL',
      logLevel: 'ALL',
      logCategory: 'ALL',
      logSearch: '',
      auditSearch: '',
    },
    modals: {
      resolveAnomaly: null,
      webhookForm: null,
      webhookLogs: null,
      systemTerminal: false,
    },
    terminalLogs: [
      `[${new Date().toISOString()}] Quantum Core Admin Terminal initialized.`,
      `[${new Date().toISOString()}] Establishing secure connection to cluster nodes...`,
      `[${new Date().toISOString()}] Connection established. 16 cores active.`,
    ],
    isLivePolling: true,
  };
};

export function dashboardReducer(state: DashboardState, action: DashboardAction): DashboardState {
  switch (action.type) {
    case 'FETCH_INIT':
      return { ...state, loading: true, error: null };
    
    case 'FETCH_SUCCESS':
      return {
        ...state,
        loading: false,
        anomalies: action.payload.anomalies,
        webhooks: action.payload.webhooks,
      };
    
    case 'FETCH_FAILURE':
      return { ...state, loading: false, error: action.payload };
    
    case 'POLL_SYSTEM_HEALTH':
      return {
        ...state,
        systemHealth: action.payload,
      };
    
    case 'POLL_USER_METRICS':
      return {
        ...state,
        userMetrics: action.payload,
      };

    case 'POLL_REALTIME_EVENTS': {
      const { anomaly, log, audit } = action.payload;
      let updatedAnomalies = [...state.anomalies];
      let updatedLogs = [...state.activityLogs];
      let updatedAudit = [...state.auditTrail];

      if (anomaly) {
        updatedAnomalies = [anomaly, ...updatedAnomalies];
        if (updatedAnomalies.length > 50) updatedAnomalies.pop();
      }
      if (log) {
        updatedLogs = [log, ...updatedLogs];
        if (updatedLogs.length > 100) updatedLogs.pop();
      }
      if (audit) {
        updatedAudit = [audit, ...updatedAudit];
        if (updatedAudit.length > 50) updatedAudit.pop();
      }

      return {
        ...state,
        anomalies: updatedAnomalies,
        activityLogs: updatedLogs,
        auditTrail: updatedAudit,
      };
    }
    
    case 'SET_ACTIVE_TAB':
      return { ...state, activeTab: action.payload };
    
    case 'SET_FILTER':
      return {
        ...state,
        filters: {
          ...state.filters,
          [action.payload.key]: action.payload.value,
        },
      };
    
    case 'RESET_FILTERS':
      return {
        ...state,
        filters: initialDashboardState().filters,
      };
    
    case 'OPEN_MODAL':
      return {
        ...state,
        modals: {
          ...state.modals,
          [action.payload.key]: action.payload.data,
        },
      };
    
    case 'CLOSE_MODAL':
      return {
        ...state,
        modals: {
          ...state.modals,
          [action.payload.key]: null,
        },
      };
    
    case 'RESOLVE_ANOMALY_SUBMIT': {
      const { id, notes, operator } = action.payload;
      const updatedAnomalies = state.anomalies.map((anom) => {
        if (anom.id === id) {
          return {
            ...anom,
            status: 'RESOLVED' as const,
            metadata: {
              ...anom.metadata,
              resolvedBy: operator,
              resolvedAt: new Date().toISOString(),
              resolutionNotes: notes,
            },
          };
        }
        return anom;
      });

      const newAuditEntry: AuditTrailEntry = {
        id: `audit-${Math.floor(10000 + Math.random() * 90000)}`,
        timestamp: new Date().toISOString(),
        actor: {
          id: 'usr-current',
          name: operator,
          email: `${operator.toLowerCase().replace(/\s+/g, '')}@quantumcore.io`,
          role: 'Administrator',
        },
        action: 'Resolve Security Anomaly',
        target: `Anomaly: ${id}`,
        ipAddress: '127.0.0.1',
        status: 'SUCCESS',
        changes: [
          { field: 'status', oldValue: 'ACTIVE', newValue: 'RESOLVED' },
          { field: 'resolutionNotes', oldValue: '', newValue: notes },
        ],
      };

      return {
        ...state,
        anomalies: updatedAnomalies,
        auditTrail: [newAuditEntry, ...state.auditTrail],
        modals: { ...state.modals, resolveAnomaly: null },
      };
    }

    case 'DISMISS_ANOMALY_SUBMIT': {
      const { id, notes, operator } = action.payload;
      const updatedAnomalies = state.anomalies.map((anom) => {
        if (anom.id === id) {
          return {
            ...anom,
            status: 'DISMISSED' as const,
            metadata: {
              ...anom.metadata,
              resolvedBy: operator,
              resolvedAt: new Date().toISOString(),
              resolutionNotes: notes,
            },
          };
        }
        return anom;
      });

      const newAuditEntry: AuditTrailEntry = {
        id: `audit-${Math.floor(10000 + Math.random() * 90000)}`,
        timestamp: new Date().toISOString(),
        actor: {
          id: 'usr-current',
          name: operator,
          email: `${operator.toLowerCase().replace(/\s+/g, '')}@quantumcore.io`,
          role: 'Administrator',
        },
        action: 'Dismiss Security Anomaly',
        target: `Anomaly: ${id}`,
        ipAddress: '127.0.0.1',
        status: 'SUCCESS',
        changes: [
          { field: 'status', oldValue: 'ACTIVE', newValue: 'DISMISSED' },
          { field: 'resolutionNotes', oldValue: '', newValue: notes },
        ],
      };

      return {
        ...state,
        anomalies: updatedAnomalies,
        auditTrail: [newAuditEntry, ...state.auditTrail],
        modals: { ...state.modals, resolveAnomaly: null },
      };
    }
    
    case 'SAVE_WEBHOOK': {
      const webhook = action.payload;
      const exists = state.webhooks.some((wh) => wh.id === webhook.id);
      let updatedWebhooks: Webhook[];

      const auditChanges: AuditTrailEntry['changes'] = [];

      if (exists) {
        const oldWh = state.webhooks.find((wh) => wh.id === webhook.id)!;
        if (oldWh.callbackUrl !== webhook.callbackUrl) {
          auditChanges.push({ field: 'callbackUrl', oldValue: oldWh.callbackUrl, newValue: webhook.callbackUrl });
        }
        if (oldWh.status !== webhook.status) {
          auditChanges.push({ field: 'status', oldValue: oldWh.status, newValue: webhook.status });
        }
        if (JSON.stringify(oldWh.events) !== JSON.stringify(webhook.events)) {
          auditChanges.push({ field: 'events', oldValue: oldWh.events.join(','), newValue: webhook.events.join(',') });
        }

        updatedWebhooks = state.webhooks.map((wh) => (wh.id === webhook.id ? webhook : wh));
      } else {
        auditChanges.push({ field: 'id', oldValue: '', newValue: webhook.id });
        auditChanges.push({ field: 'callbackUrl', oldValue: '', newValue: webhook.callbackUrl });
        updatedWebhooks = [webhook, ...state.webhooks];
      }

      const newAuditEntry: AuditTrailEntry = {
        id: `audit-${Math.floor(10000 + Math.random() * 90000)}`,
        timestamp: new Date().toISOString(),
        actor: {
          id: 'usr-current',
          name: 'Sarah Connor',
          email: 'sconnor@quantumcore.io',
          role: 'Super Admin',
        },
        action: exists ? 'Update Webhook Configuration' : 'Create Webhook Subscription',
        target: `Webhook: ${webhook.name}`,
        ipAddress: '127.0.0.1',
        status: 'SUCCESS',
        changes: auditChanges.length > 0 ? auditChanges : undefined,
      };

      return {
        ...state,
        webhooks: updatedWebhooks,
        auditTrail: [newAuditEntry, ...state.auditTrail],
        modals: { ...state.modals, webhookForm: null },
      };
    }
    
    case 'DELETE_WEBHOOK': {
      const webhookId = action.payload;
      const targetWh = state.webhooks.find((wh) => wh.id === webhookId);
      const updatedWebhooks = state.webhooks.filter((wh) => wh.id !== webhookId);

      const newAuditEntry: AuditTrailEntry = {
        id: `audit-${Math.floor(10000 + Math.random() * 90000)}`,
        timestamp: new Date().toISOString(),
        actor: {
          id: 'usr-current',
          name: 'Sarah Connor',
          email: 'sconnor@quantumcore.io',
          role: 'Super Admin',
        },
        action: 'Delete Webhook Subscription',
        target: `Webhook: ${targetWh?.name || webhookId}`,
        ipAddress: '127.0.0.1',
        status: 'SUCCESS',
      };

      return {
        ...state,
        webhooks: updatedWebhooks,
        auditTrail: [newAuditEntry, ...state.auditTrail],
      };
    }
    
    case 'TOGGLE_WEBHOOK_STATUS': {
      const webhookId = action.payload;
      let newStatus: WebhookStatus = 'ACTIVE';
      const updatedWebhooks = state.webhooks.map((wh) => {
        if (wh.id === webhookId) {
          newStatus = wh.status === 'ACTIVE' ? 'PAUSED' : 'ACTIVE';
          return { ...wh, status: newStatus };
        }
        return wh;
      });

      const targetWh = state.webhooks.find((wh) => wh.id === webhookId);

      const newAuditEntry: AuditTrailEntry = {
        id: `audit-${Math.floor(10000 + Math.random() * 90000)}`,
        timestamp: new Date().toISOString(),
        actor: {
          id: 'usr-current',
          name: 'Sarah Connor',
          email: 'sconnor@quantumcore.io',
          role: 'Super Admin',
        },
        action: 'Toggle Webhook Status',
        target: `Webhook: ${targetWh?.name || webhookId}`,
        ipAddress: '127.0.0.1',
        status: 'SUCCESS',
        changes: [{ field: 'status', oldValue: targetWh?.status || 'UNKNOWN', newValue: newStatus }],
      };

      return {
        ...state,
        webhooks: updatedWebhooks,
        auditTrail: [newAuditEntry, ...state.auditTrail],
      };
    }
    
    case 'SYNC_INTEGRATION_START': {
      const id = action.payload;
      const updatedIntegrations = state.integrations.map((integ) => {
        if (integ.id === id) {
          return { ...integ, lastSyncTime: new Date().toISOString() };
        }
        return integ;
      });
      return {
        ...state,
        integrations: updatedIntegrations,
      };
    }
    
    case 'SYNC_INTEGRATION_SUCCESS': {
      const { id, metrics, latency, errorRate } = action.payload;
      const updatedIntegrations = state.integrations.map((integ) => {
        if (integ.id === id) {
          const updatedHistory = [...integ.metricsHistory, metrics];
          if (updatedHistory.length > 12) updatedHistory.shift();
          return {
            ...integ,
            status: 'OPERATIONAL' as const,
            averageLatencyMs: latency,
            errorRate24h: errorRate,
            metricsHistory: updatedHistory,
            lastSyncTime: new Date().toISOString(),
          };
        }
        return integ;
      });
      return {
        ...state,
        integrations: updatedIntegrations,
      };
    }
    
    case 'SYNC_INTEGRATION_FAILURE': {
      const { id, errorRate } = action.payload;
      const updatedIntegrations = state.integrations.map((integ) => {
        if (integ.id === id) {
          return {
            ...integ,
            status: 'DEGRADED' as const,
            errorRate24h: errorRate,
            lastSyncTime: new Date().toISOString(),
          };
        }
        return integ;
      });
      return {
        ...state,
        integrations: updatedIntegrations,
      };
    }
    
    case 'ADD_TERMINAL_LOG': {
      const updatedLogs = [...state.terminalLogs, `[${new Date().toISOString()}] ${action.payload}`];
      if (updatedLogs.length > 150) updatedLogs.shift();
      return {
        ...state,
        terminalLogs: updatedLogs,
      };
    }
    
    case 'CLEAR_TERMINAL_LOGS':
      return {
        ...state,
        terminalLogs: [],
      };
    
    case 'TOGGLE_LIVE_POLLING':
      return {
        ...state,
        isLivePolling: !state.isLivePolling,
      };
    
    default:
      return state;
  }
}

// ============================================================================
// 6. API SERVICE LAYER & DATA ORCHESTRATOR
// ============================================================================

export class AdminDashboardService {
  private static timeoutMs = 6000;

  private static async fetchWithTimeout(resource: string, options: RequestInit = {}): Promise<Response> {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), this.timeoutMs);
    try {
      const response = await fetch(resource, {
        ...options,
        signal: controller.signal,
      });
      clearTimeout(id);
      return response;
    } catch (error) {
      clearTimeout(id);
      throw error;
    }
  }

  public static async fetchDashboardData(): Promise<{ anomalies: Anomaly[]; webhooks: Webhook[] }> {
    try {
      const [anomaliesRes, webhooksRes] = await Promise.all([
        this.fetchWithTimeout(`${API_BASE_URL}/corporate/anomalies`),
        this.fetchWithTimeout(`${API_BASE_URL}/developers/webhooks`),
      ]);

      if (!anomaliesRes.ok) {
        throw new Error(`Anomalies API returned status ${anomaliesRes.status}`);
      }
      if (!webhooksRes.ok) {
        throw new Error(`Webhooks API returned status ${webhooksRes.status}`);
      }

      const anomaliesData = await anomaliesRes.json();
      const webhooksData = await webhooksRes.json();

      // Map API response to our strict domain models
      const anomalies: Anomaly[] = (anomaliesData.data || anomaliesData || []).map((item: any, idx: number) => {
        // Normalize severity
        let severity: AnomalySeverity = 'MEDIUM';
        const rawSev = String(item.severity).toUpperCase();
        if (rawSev === 'CRITICAL') severity = 'CRITICAL';
        else if (rawSev === 'HIGH') severity = 'HIGH';
        else if (rawSev === 'LOW') severity = 'LOW';

        // Normalize entityType
        let entityType: Anomaly['entityType'] = 'USER';
        const rawEnt = String(item.entityType).toUpperCase();
        if (rawEnt === 'TRANSACTION') entityType = 'TRANSACTION';
        else if (rawEnt === 'API_KEY') entityType = 'API_KEY';
        else if (rawEnt === 'IP_ADDRESS') entityType = 'IP_ADDRESS';

        return {
          id: item.id || `anom-api-${1000 + idx}`,
          timestamp: item.timestamp || new Date().toISOString(),
          severity,
          status: (item.status?.toUpperCase() as AnomalyStatus) || 'ACTIVE',
          category: (item.category?.toUpperCase() as AnomalyCategory) || 'FRAUD',
          description: item.description || 'Suspicious activity detected by AI engine.',
          entityType,
          entityId: item.entityId || `ent-${Math.floor(100000 + Math.random() * 900000)}`,
          metadata: {
            ipAddress: item.metadata?.ipAddress || '192.168.1.1',
            location: item.metadata?.location || 'Unknown Location',
            amount: item.metadata?.amount ? parseFloat(item.metadata.amount) : undefined,
            thresholdExceeded: item.metadata?.thresholdExceeded,
            actualValue: item.metadata?.actualValue,
            userAgent: item.metadata?.userAgent,
          },
        };
      });

      const webhooks: Webhook[] = (webhooksData.data || webhooksData || []).map((item: any, idx: number) => {
        return {
          id: item.id || `wh-api-${2000 + idx}`,
          name: item.name || `Webhook Endpoint ${idx + 1}`,
          callbackUrl: item.callbackUrl || 'https://api.endpoint.com/webhook',
          status: (item.status?.toUpperCase() as WebhookStatus) || 'ACTIVE',
          events: (item.events || []).map((e: string) => e.toLowerCase() as WebhookEvent),
          lastTriggered: item.lastTriggered || new Date().toISOString(),
          failureCount: typeof item.failureCount === 'number' ? item.failureCount : 0,
          secret: item.secret || `whsec_${Math.random().toString(36).substring(2, 15)}`,
          deliveryLogs: (item.deliveryLogs || []).map((log: any, logIdx: number) => ({
            id: log.id || `log-${idx}-${logIdx}`,
            timestamp: log.timestamp || new Date().toISOString(),
            event: (log.event || 'user.created') as WebhookEvent,
            statusCode: log.statusCode || 200,
            durationMs: log.durationMs || 120,
            success: typeof log.success === 'boolean' ? log.success : log.statusCode === 200,
            payloadPreview: log.payloadPreview || '{}',
          })),
          createdAt: item.createdAt || new Date().toISOString(),
        };
      });

      return { anomalies, webhooks };
    } catch (error) {
      console.warn('AdminDashboardService: API fetch failed, falling back to high-fidelity generative data.', error);
      // Fallback to high-fidelity generative data
      return {
        anomalies: generateAnomalies(12),
        webhooks: generateWebhooks(),
      };
    }
  }
}

// ============================================================================
// 7. CUSTOM REACT HOOKS
// ============================================================================

export function useInterval(callback: () => void, delay: number | null) {
  const savedCallback = useRef(callback);

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    if (delay !== null) {
      const id = setInterval(() => savedCallback.current(), delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}

export function useDashboardData() {
  const [state, dispatch] = useReducer(dashboardReducer, null, initialDashboardState);

  const loadInitialData = useCallback(async () => {
    dispatch({ type: 'FETCH_INIT' });
    try {
      const data = await AdminDashboardService.fetchDashboardData();
      dispatch({ type: 'FETCH_SUCCESS', payload: data });
      dispatch({ type: 'ADD_TERMINAL_LOG', payload: 'Successfully synchronized core database and webhook registries.' });
    } catch (err) {
      dispatch({ type: 'FETCH_FAILURE', payload: err instanceof Error ? err.message : 'An unknown error occurred.' });
      dispatch({ type: 'ADD_TERMINAL_LOG', payload: 'CRITICAL: Failed to synchronize core database. Operating in offline fallback mode.' });
    }
  }, []);

  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  // Live Polling Engine
  useInterval(
    () => {
      if (!state.isLivePolling) return;

      // 1. Poll System Health
      const nextHealth = generateSystemHealth({
        cpu: state.systemHealth.cpu.history,
        memory: state.systemHealth.memory.history,
        disk: state.systemHealth.disk.history,
        db: state.systemHealth.database.history,
      });
      dispatch({ type: 'POLL_SYSTEM_HEALTH', payload: nextHealth });

      // Log health warnings to terminal
      if (nextHealth.overallStatus === 'CRITICAL') {
        dispatch({ type: 'ADD_TERMINAL_LOG', payload: `WARNING: System health degraded to CRITICAL. CPU: ${nextHealth.cpu.usage}%, DB Latency: ${nextHealth.database.latencyMs}ms.` });
      }

      // 2. Poll User Metrics (slow growth)
      if (Math.random() > 0.7) {
        const nextMetrics = {
          ...state.userMetrics,
          totalUsers: state.userMetrics.totalUsers + Math.floor(Math.random() * 3),
          newUsersToday: state.userMetrics.newUsersToday + (Math.random() > 0.5 ? 1 : 0),
          activeUsers24h: Math.floor((state.userMetrics.totalUsers + 3) * (0.12 + Math.random() * 0.04)),
        };
        dispatch({ type: 'POLL_USER_METRICS', payload: nextMetrics });
      }

      // 3. Simulate Real-Time Security & System Events
      const eventRand = Math.random();
      if (eventRand > 0.85) {
        // Generate a live anomaly or log
        const isAnomaly = eventRand > 0.95;
        if (isAnomaly) {
          const [newAnomaly] = generateAnomalies(1);
          const [newLog] = generateActivityLogs(1);
          newLog.category = 'SECURITY';
          newLog.level = 'ERROR';
          newLog.message = `AI Engine flagged anomaly: ${newAnomaly.description}`;
          
          dispatch({
            type: 'POLL_REALTIME_EVENTS',
            payload: { anomaly: newAnomaly, log: newLog },
          });
          dispatch({ type: 'ADD_TERMINAL_LOG', payload: `SECURITY ALERT: ${newAnomaly.description} [Severity: ${newAnomaly.severity}]` });
        } else {
          const [newLog] = generateActivityLogs(1);
          dispatch({
            type: 'POLL_REALTIME_EVENTS',
            payload: { log: newLog },
          });
          if (newLog.level === 'ERROR' || newLog.level === 'WARN') {
            dispatch({ type: 'ADD_TERMINAL_LOG', payload: `SYSTEM LOG [${newLog.level}]: ${newLog.message}` });
          }
        }
      }
    },
    state.isLivePolling ? 4000 : null
  );

  return { state, dispatch, reload: loadInitialData };
}
// ============================================================================
// 8. SUB-COMPONENTS & UI MODULES
// ============================================================================

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ComponentType<{ className?: string }>;
  description?: string;
  change?: string | number;
  changeType?: 'increase' | 'decrease' | 'neutral';
  trendData?: { value: number }[];
  loading?: boolean;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon: Icon,
  description,
  change,
  changeType = 'neutral',
  trendData,
  loading = false,
}) => {
  return (
    <Card className="relative overflow-hidden transition-all duration-200 hover:shadow-md border-slate-200 dark:border-slate-800">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-semibold tracking-tight text-muted-foreground">
          {title}
        </CardTitle>
        <div className="rounded-lg bg-slate-100 p-2 text-slate-900 dark:bg-slate-800 dark:text-slate-50">
          <Icon className="h-4 w-4" />
        </div>
      </CardHeader>
      <CardContent className="space-y-1">
        {loading ? (
          <div className="h-8 w-24 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
        ) : (
          <div className="text-2xl font-bold tracking-tight">{value}</div>
        )}
        
        <div className="flex items-center space-x-2">
          {change !== undefined && (
            <span
              className={cn(
                "inline-flex items-center text-xs font-medium px-1.5 py-0.5 rounded-md",
                changeType === 'increase' && "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400",
                changeType === 'decrease' && "bg-rose-50 text-rose-700 dark:bg-rose-950/30 dark:text-rose-400",
                changeType === 'neutral' && "bg-slate-50 text-slate-700 dark:bg-slate-950/30 dark:text-slate-400"
              )}
            >
              {changeType === 'increase' && <ArrowUpRight className="mr-0.5 h-3 w-3" />}
              {changeType === 'decrease' && <ArrowDownRight className="mr-0.5 h-3 w-3" />}
              {change}
            </span>
          )}
          {description && (
            <span className="text-xs text-muted-foreground">{description}</span>
          )}
        </div>

        {trendData && trendData.length > 0 && (
          <div className="absolute bottom-0 left-0 right-0 h-10 opacity-40">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id={`gradient-${title.replace(/\s+/g, '')}`} x1="0" y1="0" x2="0" y2="1">
                    <stop 
                      offset="0%" 
                      stopColor={changeType === 'increase' ? '#10b981' : changeType === 'decrease' ? '#f43f5e' : '#64748b'} 
                      stopOpacity={0.4} 
                    />
                    <stop 
                      offset="100%" 
                      stopColor={changeType === 'increase' ? '#10b981' : changeType === 'decrease' ? '#f43f5e' : '#64748b'} 
                      stopOpacity={0} 
                    />
                  </linearGradient>
                </defs>
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke={changeType === 'increase' ? '#10b981' : changeType === 'decrease' ? '#f43f5e' : '#64748b'}
                  strokeWidth={1.5}
                  fill={`url(#gradient-${title.replace(/\s+/g, '')})`}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

interface TerminalConsoleProps {
  logs: string[];
  onExecuteCommand: (command: string) => void;
  onClear: () => void;
  isOpen: boolean;
  onClose: () => void;
}

export const TerminalConsole: React.FC<TerminalConsoleProps> = ({
  logs,
  onExecuteCommand,
  onClear,
  isOpen,
  onClose,
}) => {
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const terminalEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (terminalEndRef.current) {
      terminalEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed) return;

    onExecuteCommand(trimmed);
    setHistory((prev) => [...prev, trimmed]);
    setHistoryIndex(-1);
    setInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (history.length === 0) return;
      const nextIdx = historyIndex === -1 ? history.length - 1 : Math.max(0, historyIndex - 1);
      setHistoryIndex(nextIdx);
      setInput(history[nextIdx]);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex === -1) return;
      if (historyIndex === history.length - 1) {
        setHistoryIndex(-1);
        setInput('');
      } else {
        const nextIdx = historyIndex + 1;
        setHistoryIndex(nextIdx);
        setInput(history[nextIdx]);
      }
    }
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl bg-slate-950 text-slate-100 border-slate-800 font-mono p-0 overflow-hidden shadow-2xl">
        <DialogHeader className="px-4 py-3 border-b border-slate-800 flex flex-row items-center justify-between space-y-0 bg-slate-900">
          <div className="flex items-center space-x-2">
            <Terminal className="h-4 w-4 text-emerald-400 animate-pulse" />
            <DialogTitle className="text-sm font-bold text-slate-200">Quantum Core Secure Terminal v4.1.9</DialogTitle>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={onClear}
              className="h-7 w-7 text-slate-400 hover:text-slate-100 hover:bg-slate-800"
              title="Clear Terminal Logs"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        </DialogHeader>
        
        <div className="p-4 h-[450px] overflow-y-auto space-y-1.5 text-xs leading-relaxed scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent">
          <div className="text-slate-500 mb-2">
            Type <span className="text-emerald-400">/help</span> to view available administrative commands.
          </div>
          {logs.map((log, idx) => {
            let colorClass = 'text-slate-300';
            if (log.includes('WARNING') || log.includes('[WARN]')) colorClass = 'text-amber-400';
            if (log.includes('CRITICAL') || log.includes('SECURITY ALERT') || log.includes('[ERROR]')) colorClass = 'text-rose-400 font-semibold';
            if (log.includes('SUCCESS') || log.includes('Successfully')) colorClass = 'text-emerald-400';
            if (log.startsWith('>')) colorClass = 'text-sky-400 font-medium';

            return (
              <div key={idx} className={cn("whitespace-pre-wrap break-all", colorClass)}>
                {log}
              </div>
            );
          })}
          <div ref={terminalEndRef} />
        </div>

        <form onSubmit={handleSubmit} className="border-t border-slate-800 bg-slate-900 p-3 flex items-center space-x-2">
          <span className="text-emerald-400 font-bold text-sm select-none">quantum-core:~#</span>
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Execute secure cluster command..."
            className="flex-1 bg-transparent border-none text-slate-100 focus-visible:ring-0 focus-visible:ring-offset-0 font-mono text-sm p-0 h-auto"
            autoFocus
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck={false}
          />
          <Button 
            type="submit" 
            size="sm" 
            className="bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold h-7 px-3"
          >
            EXEC
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

interface AnomalySeverityBadgeProps {
  severity: AnomalySeverity;
}

export const AnomalySeverityBadge: React.FC<AnomalySeverityBadgeProps> = ({ severity }) => {
  const styles: Record<AnomalySeverity, string> = {
    CRITICAL: 'bg-rose-500/10 text-rose-500 border-rose-500/20 dark:bg-rose-500/20 dark:text-rose-400',
    HIGH: 'bg-orange-500/10 text-orange-500 border-orange-500/20 dark:bg-orange-500/20 dark:text-orange-400',
    MEDIUM: 'bg-amber-500/10 text-amber-500 border-amber-500/20 dark:bg-amber-500/20 dark:text-amber-400',
    LOW: 'bg-sky-500/10 text-sky-500 border-sky-500/20 dark:bg-sky-500/20 dark:text-sky-400',
  };

  return (
    <Badge variant="outline" className={cn("font-semibold tracking-wide text-[10px] uppercase px-2 py-0.5", styles[severity])}>
      {severity}
    </Badge>
  );
};

interface AnomalyStatusBadgeProps {
  status: AnomalyStatus;
}

export const AnomalyStatusBadge: React.FC<AnomalyStatusBadgeProps> = ({ status }) => {
  const styles: Record<AnomalyStatus, string> = {
    ACTIVE: 'bg-rose-500 text-white dark:bg-rose-600',
    INVESTIGATING: 'bg-amber-500 text-slate-950 dark:bg-amber-600 dark:text-white',
    RESOLVED: 'bg-emerald-500 text-white dark:bg-emerald-600',
    DISMISSED: 'bg-slate-500 text-white dark:bg-slate-600',
  };

  return (
    <Badge className={cn("font-semibold text-[10px] uppercase px-2 py-0.5", styles[status])}>
      {status}
    </Badge>
  );
};

interface IntegrationStatusBadgeProps {
  status: IntegrationStatus;
}

export const IntegrationStatusBadge: React.FC<IntegrationStatusBadgeProps> = ({ status }) => {
  const styles: Record<IntegrationStatus, string> = {
    OPERATIONAL: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20 dark:bg-emerald-500/20 dark:text-emerald-400',
    DEGRADED: 'bg-amber-500/10 text-amber-500 border-amber-500/20 dark:bg-amber-500/20 dark:text-amber-400',
    OUTAGE: 'bg-rose-500/10 text-rose-500 border-rose-500/20 dark:bg-rose-500/20 dark:text-rose-400',
  };

  return (
    <Badge variant="outline" className={cn("font-semibold text-[10px] uppercase px-2 py-0.5", styles[status])}>
      {status}
    </Badge>
  );
};

interface WebhookStatusBadgeProps {
  status: WebhookStatus;
}

export const WebhookStatusBadge: React.FC<WebhookStatusBadgeProps> = ({ status }) => {
  const styles: Record<WebhookStatus, string> = {
    ACTIVE: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20 dark:bg-emerald-500/20 dark:text-emerald-400',
    PAUSED: 'bg-slate-500/10 text-slate-500 border-slate-500/20 dark:bg-slate-500/20 dark:text-slate-400',
    FAILED: 'bg-rose-500/10 text-rose-500 border-rose-500/20 dark:bg-rose-500/20 dark:text-rose-400',
  };

  return (
    <Badge variant="outline" className={cn("font-semibold text-[10px] uppercase px-2 py-0.5", styles[status])}>
      {status}
    </Badge>
  );
};interface SystemHealthCardProps {
  title: string;
  value: string | number;
  status: 'OPERATIONAL' | 'DEGRADED' | 'CRITICAL' | 'CONNECTED' | 'DISCONNECTED';
  history: number[];
  icon: React.ComponentType<{ className?: string }>;
  color: 'emerald' | 'amber' | 'rose' | 'blue';
  children?: React.ReactNode;
}

export const SystemHealthCard: React.FC<SystemHealthCardProps> = ({
  title,
  value,
  status,
  history,
  icon: Icon,
  color,
  children,
}) => {
  const chartData = useMemo(() => history.map((val, idx) => ({ id: idx, value: val })), [history]);

  const colorMap = {
    emerald: {
      text: 'text-emerald-500 dark:text-emerald-400',
      bg: 'bg-emerald-500/10 dark:bg-emerald-500/20',
      border: 'border-emerald-500/20 dark:border-emerald-500/30',
      stroke: '#10b981',
    },
    amber: {
      text: 'text-amber-500 dark:text-amber-400',
      bg: 'bg-amber-500/10 dark:bg-amber-500/20',
      border: 'border-amber-500/20 dark:border-amber-500/30',
      stroke: '#f59e0b',
    },
    rose: {
      text: 'text-rose-500 dark:text-rose-400',
      bg: 'bg-rose-500/10 dark:bg-rose-500/20',
      border: 'border-rose-500/20 dark:border-rose-500/30',
      stroke: '#f43f5e',
    },
    blue: {
      text: 'text-blue-500 dark:text-blue-400',
      bg: 'bg-blue-500/10 dark:bg-blue-500/20',
      border: 'border-blue-500/20 dark:border-blue-500/30',
      stroke: '#3b82f6',
    },
  };

  const activeColor = colorMap[color];

  return (
    <Card className="border-slate-200 dark:border-slate-800 overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="space-y-1">
          <CardTitle className="text-sm font-semibold text-muted-foreground">{title}</CardTitle>
          <div className="flex items-center space-x-2">
            <span className="text-2xl font-bold tracking-tight">{value}</span>
            <Badge 
              variant="outline" 
              className={cn(
                "text-[10px] font-bold px-1.5 py-0",
                status === 'OPERATIONAL' || status === 'CONNECTED' ? 'bg-emerald-500/10 text-emerald-700 border-emerald-500/20 dark:bg-emerald-500/20 dark:text-emerald-400' :
                status === 'DEGRADED' ? 'bg-amber-500/10 text-amber-700 border-amber-500/20 dark:bg-amber-500/20 dark:text-amber-400' :
                'bg-rose-500/10 text-rose-700 border-rose-500/20 dark:bg-rose-500/20 dark:text-rose-400'
              )}
            >
              {status}
            </Badge>
          </div>
        </div>
        <div className={cn("rounded-lg p-2", activeColor.bg, activeColor.text)}>
          <Icon className="h-4 w-4" />
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {children}
        <div className="h-12 w-100 opacity-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id={`grad-${title.replace(/\s+/g, '')}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={activeColor.stroke} stopOpacity={0.3} />
                  <stop offset="100%" stopColor={activeColor.stroke} stopOpacity={0} />
                </linearGradient>
              </defs>
              <Area
                type="monotone"
                dataKey="value"
                stroke={activeColor.stroke}
                strokeWidth={1.5}
                fill={`url(#grad-${title.replace(/\s+/g, '')})`}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

interface SystemHealthGridProps {
  health: SystemHealth;
}

export const SystemHealthGrid: React.FC<SystemHealthGridProps> = ({ health }) => {
  const cpuColor = health.cpu.usage > 80 ? 'rose' : health.cpu.usage > 60 ? 'amber' : 'emerald';
  const memColor = (health.memory.usedGB / health.memory.totalGB) > 0.8 ? 'rose' : (health.memory.usedGB / health.memory.totalGB) > 0.6 ? 'amber' : 'emerald';
  const diskColor = (health.disk.usedGB / health.disk.totalGB) > 0.85 ? 'rose' : (health.disk.usedGB / health.disk.totalGB) > 0.7 ? 'amber' : 'blue';
  const dbColor = health.database.status === 'DISCONNECTED' ? 'rose' : health.database.latencyMs > 100 ? 'amber' : 'emerald';

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <SystemHealthCard
        title="CPU Cluster Load"
        value={`${health.cpu.usage}%`}
        status={health.cpu.usage > 80 ? 'CRITICAL' : health.cpu.usage > 60 ? 'DEGRADED' : 'OPERATIONAL'}
        history={health.cpu.history}
        icon={Cpu}
        color={cpuColor}
      >
        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Cores Active</span>
            <span className="font-semibold text-foreground">{health.cpu.cores} / {health.cpu.cores}</span>
          </div>
          <Progress value={health.cpu.usage} className="h-1.5" />
        </div>
      </SystemHealthCard>

      <SystemHealthCard
        title="System Memory"
        value={`${health.memory.usedGB} GB`}
        status={(health.memory.usedGB / health.memory.totalGB) > 0.8 ? 'CRITICAL' : (health.memory.usedGB / health.memory.totalGB) > 0.6 ? 'DEGRADED' : 'OPERATIONAL'}
        history={health.memory.history}
        icon={HardDrive}
        color={memColor}
      >
        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Total Capacity</span>
            <span className="font-semibold text-foreground">{health.memory.totalGB} GB</span>
          </div>
          <Progress value={(health.memory.usedGB / health.memory.totalGB) * 100} className="h-1.5" />
        </div>
      </SystemHealthCard>

      <SystemHealthCard
        title="Persistent Storage"
        value={`${health.disk.usedGB} GB`}
        status={(health.disk.usedGB / health.disk.totalGB) > 0.85 ? 'CRITICAL' : 'OPERATIONAL'}
        history={health.disk.history}
        icon={Database}
        color={diskColor}
      >
        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Available Space</span>
            <span className="font-semibold text-foreground">{(health.disk.totalGB - health.disk.usedGB).toFixed(1)} GB</span>
          </div>
          <Progress value={(health.disk.usedGB / health.disk.totalGB) * 100} className="h-1.5" />
        </div>
      </SystemHealthCard>

      <SystemHealthCard
        title="Database Latency"
        value={`${health.database.latencyMs}ms`}
        status={health.database.status === 'CONNECTED' ? (health.database.latencyMs > 100 ? 'DEGRADED' : 'OPERATIONAL') : 'CRITICAL'}
        history={health.database.history}
        icon={Server}
        color={dbColor}
      >
        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Active Connections</span>
            <span className="font-semibold text-foreground">{health.database.activeConnections}</span>
          </div>
          <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div 
              className={cn(
                "h-full transition-all duration-500",
                health.database.status === 'CONNECTED' ? 'bg-emerald-500' : 'bg-rose-500'
              )}
              style={{ width: '100%' }}
            />
          </div>
        </div>
      </SystemHealthCard>
    </div>
  );
};

interface AnomalyDetailsDialogProps {
  anomaly: Anomaly | null;
  isOpen: boolean;
  onClose: () => void;
  onResolve: (id: string, notes: string) => void;
  onDismiss: (id: string, notes: string) => void;
}

export const AnomalyDetailsDialog: React.FC<AnomalyDetailsDialogProps> = ({
  anomaly,
  isOpen,
  onClose,
  onResolve,
  onDismiss,
}) => {
  const [notes, setNotes] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (anomaly) {
      setNotes(anomaly.metadata.resolutionNotes || '');
      setError(null);
    }
  }, [anomaly]);

  if (!anomaly) return null;

  const handleResolveSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!notes.trim()) {
      setError('Resolution notes are required to resolve an anomaly.');
      return;
    }
    onResolve(anomaly.id, notes);
    setNotes('');
  };

  const handleDismissSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!notes.trim()) {
      setError('Resolution notes are required to dismiss an anomaly.');
      return;
    }
    onDismiss(anomaly.id, notes);
    setNotes('');
  };

  const isResolved = anomaly.status === 'RESOLVED' || anomaly.status === 'DISMISSED';

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl border-slate-200 dark:border-slate-800">
        <DialogHeader>
          <div className="flex items-center space-x-2">
            <ShieldAlert className="h-5 w-5 text-rose-500" />
            <DialogTitle className="text-lg font-bold">Security Anomaly Investigation</DialogTitle>
          </div>
          <DialogDescription>
            Detailed diagnostic information compiled by the Quantum Core AI Threat Detection Engine.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4 bg-slate-50 dark:bg-slate-900 p-4 rounded-lg border border-slate-100 dark:border-slate-800 text-sm">
            <div className="space-y-1">
              <span className="text-xs text-muted-foreground block">Anomaly ID</span>
              <span className="font-mono font-semibold">{anomaly.id}</span>
            </div>
            <div className="space-y-1">
              <span className="text-xs text-muted-foreground block">Severity & Status</span>
              <div className="flex items-center space-x-2 mt-0.5">
                <AnomalySeverityBadge severity={anomaly.severity} />
                <AnomalyStatusBadge status={anomaly.status} />
              </div>
            </div>
            <div className="space-y-1">
              <span className="text-xs text-muted-foreground block">Category</span>
              <Badge variant="secondary" className="font-semibold text-[10px] tracking-wider uppercase">
                {anomaly.category.replace('_', ' ')}
              </Badge>
            </div>
            <div className="space-y-1">
              <span className="text-xs text-muted-foreground block">Detected Timestamp</span>
              <span className="font-medium">{new Date(anomaly.timestamp).toLocaleString()}</span>
            </div>
            <div className="space-y-1">
              <span className="text-xs text-muted-foreground block">Target Entity Type</span>
              <span className="font-semibold">{anomaly.entityType}</span>
            </div>
            <div className="space-y-1">
              <span className="text-xs text-muted-foreground block">Target Entity ID</span>
              <span className="font-mono font-semibold">{anomaly.entityId}</span>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Threat Description</h4>
            <p className="text-sm text-muted-foreground bg-slate-50 dark:bg-slate-900 p-3 rounded-lg border border-slate-100 dark:border-slate-800 leading-relaxed">
              {anomaly.description}
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Diagnostic Metadata</h4>
            <div className="grid grid-cols-2 gap-2 text-xs font-mono bg-slate-950 text-slate-300 p-3 rounded-lg">
              {anomaly.metadata.ipAddress && (
                <div>
                  <span className="text-slate-500">IP_ADDRESS:</span> {anomaly.metadata.ipAddress}
                </div>
              )}
              {anomaly.metadata.location && (
                <div>
                  <span className="text-slate-500">GEO_LOCATION:</span> {anomaly.metadata.location}
                </div>
              )}
              {anomaly.metadata.amount !== undefined && (
                <div>
                  <span className="text-slate-500">TX_AMOUNT:</span> {formatCurrency(anomaly.metadata.amount)}
                </div>
              )}
              {anomaly.metadata.thresholdExceeded !== undefined && (
                <div>
                  <span className="text-slate-500">LIMIT_THRESHOLD:</span> {anomaly.metadata.thresholdExceeded} req/s
                </div>
              )}
              {anomaly.metadata.actualValue !== undefined && (
                <div>
                  <span className="text-slate-500">ACTUAL_VALUE:</span> {anomaly.metadata.actualValue} req/s
                </div>
              )}
              {anomaly.metadata.userAgent && (
                <div className="col-span-2 truncate" title={anomaly.metadata.userAgent}>
                  <span className="text-slate-500">USER_AGENT:</span> {anomaly.metadata.userAgent}
                </div>
              )}
            </div>
          </div>

          {isResolved ? (
            <div className="bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/30 p-4 rounded-lg space-y-2">
              <div className="flex items-center space-x-2 text-emerald-800 dark:text-emerald-400 font-semibold text-sm">
                <CheckCircle2 className="h-4 w-4" />
                <span>Case Resolved</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs text-emerald-700 dark:text-emerald-500">
                <div>
                  <span className="font-semibold">Resolved By:</span> {anomaly.metadata.resolvedBy || 'System'}
                </div>
                <div>
                  <span className="font-semibold">Resolved At:</span> {anomaly.metadata.resolvedAt ? new Date(anomaly.metadata.resolvedAt).toLocaleString() : 'N/A'}
                </div>
              </div>
              <div className="text-xs text-emerald-800 dark:text-emerald-400 mt-1">
                <span className="font-semibold block">Resolution Notes:</span>
                <p className="mt-0.5 italic">{anomaly.metadata.resolutionNotes}</p>
              </div>
            </div>
          ) : (
            <form className="space-y-3">
              <div className="space-y-1.5">
                <label htmlFor="resolution-notes" className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                  Investigation & Resolution Notes
                </label>
                <textarea
                  id="resolution-notes"
                  value={notes}
                  onChange={(e) => {
                    setNotes(e.target.value);
                    if (error) setError(null);
                  }}
                  placeholder="Document findings, actions taken, and mitigation steps..."
                  className="w-full min-h-[80px] rounded-md border border-slate-200 dark:border-slate-800 bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                />
                {error && (
                  <p className="text-xs text-rose-500 flex items-center">
                    <AlertCircle className="h-3 w-3 mr-1" />
                    {error}
                  </p>
                )}
              </div>

              <DialogFooter className="gap-2 sm:gap-0">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleDismissSubmit}
                  className="border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  <XCircle className="mr-2 h-4 w-4 text-slate-500" />
                  Dismiss Alert
                </Button>
                <Button
                  type="button"
                  onClick={handleResolveSubmit}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white"
                >
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  Resolve Case
                </Button>
              </DialogFooter>
            </form>
          )}
        </div>
      </Dialog>
    </Dialog>
  );
};

interface WebhookFormDialogProps {
  webhook: Webhook | null; // If non-null, dialog is open. If id is empty, it's a create.
  isOpen: boolean;
  onClose: () => void;
  onSave: (webhook: Webhook) => void;
}

export const WebhookFormDialog: React.FC<WebhookFormDialogProps> = ({
  webhook,
  isOpen,
  onClose,
  onSave,
}) => {
  const [name, setName] = useState('');
  const [callbackUrl, setCallbackUrl] = useState('');
  const [secret, setSecret] = useState('');
  const [status, setStatus] = useState<WebhookStatus>('ACTIVE');
  const [selectedEvents, setSelectedEvents] = useState<WebhookEvent[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (webhook) {
      setName(webhook.name || '');
      setCallbackUrl(webhook.callbackUrl || '');
      setSecret(webhook.secret || '');
      setStatus(webhook.status || 'ACTIVE');
      setSelectedEvents(webhook.events || []);
      setErrors({});
    }
  }, [webhook]);

  if (!webhook) return null;

  const generateSecret = () => {
    const rand = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    setSecret(`whsec_${rand}`);
  };

  const handleEventToggle = (event: WebhookEvent) => {
    setSelectedEvents((prev) =>
      prev.includes(event) ? prev.filter((e) => e !== event) : [...prev, event]
    );
    if (errors.events) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next.events;
        return next;
      });
    }
  };

  const validate = (): boolean => {
    const nextErrors: Record<string, string> = {};
    if (!name.trim()) nextErrors.name = 'Webhook name is required.';
    
    if (!callbackUrl.trim()) {
      nextErrors.callbackUrl = 'Callback URL is required.';
    } else {
      try {
        new URL(callbackUrl);
      } catch {
        nextErrors.callbackUrl = 'Please enter a valid absolute URL (e.g., https://api.domain.com/hook).';
      }
    }

    if (!secret.trim()) nextErrors.secret = 'Signing secret is required.';
    if (selectedEvents.length === 0) nextErrors.events = 'Select at least one event subscription.';

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const savedWebhook: Webhook = {
      id: webhook.id || `wh-${Math.floor(10000 + Math.random() * 90000)}`,
      name,
      callbackUrl,
      secret,
      status,
      events: selectedEvents,
      lastTriggered: webhook.lastTriggered || new Date(0).toISOString(),
      failureCount: webhook.failureCount || 0,
      deliveryLogs: webhook.deliveryLogs || [],
      createdAt: webhook.createdAt || new Date().toISOString(),
    };

    onSave(savedWebhook);
  };

  const isEdit = !!webhook.id;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-xl border-slate-200 dark:border-slate-800">
        <DialogHeader>
          <div className="flex items-center space-x-2">
            <PlugZap className="h-5 w-5 text-emerald-500" />
            <DialogTitle className="text-lg font-bold">
              {isEdit ? 'Edit Webhook Subscription' : 'Register New Webhook Endpoint'}
            </DialogTitle>
          </div>
          <DialogDescription>
            Configure secure HTTP POST callbacks to receive real-time event payloads from the Quantum Core cluster.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          <div className="space-y-1.5">
            <label htmlFor="wh-name" className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              Endpoint Name
            </label>
            <Input
              id="wh-name"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (errors.name) setErrors((prev) => ({ ...prev, name: '' }));
              }}
              placeholder="e.g., Slack Security Alerts Channel"
              className={cn(errors.name && "border-rose-500 focus-visible:ring-rose-500")}
            />
            {errors.name && (
              <p className="text-xs text-rose-500 flex items-center mt-1">
                <AlertCircle className="h-3 w-3 mr-1" />
                {errors.name}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <label htmlFor="wh-url" className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              Callback URL
            </label>
            <Input
              id="wh-url"
              value={callbackUrl}
              onChange={(e) => {
                setCallbackUrl(e.target.value);
                if (errors.callbackUrl) setErrors((prev) => ({ ...prev, callbackUrl: '' }));
              }}
              placeholder="https://api.yourdomain.com/v1/webhooks"
              className={cn("font-mono text-xs", errors.callbackUrl && "border-rose-500 focus-visible:ring-rose-500")}
            />
            {errors.callbackUrl && (
              <p className="text-xs text-rose-500 flex items-center mt-1">
                <AlertCircle className="h-3 w-3 mr-1" />
                {errors.callbackUrl}
              </p>
            )}
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-2 space-y-1.5">
              <label htmlFor="wh-secret" className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                Signing Secret
              </label>
              <div className="flex space-x-2">
                <Input
                  id="wh-secret"
                  value={secret}
                  onChange={(e) => {
                    setSecret(e.target.value);
                    if (errors.secret) setErrors((prev) => ({ ...prev, secret: '' }));
                  }}
                  placeholder="whsec_..."
                  className={cn("font-mono text-xs flex-1", errors.secret && "border-rose-500 focus-visible:ring-rose-500")}
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={generateSecret}
                  className="border-slate-200 dark:border-slate-800 text-xs px-2.5"
                >
                  Generate
                </Button>
              </div>
              {errors.secret && (
                <p className="text-xs text-rose-500 flex items-center mt-1">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  {errors.secret}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <label htmlFor="wh-status" className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                Status
              </label>
              <div className="flex items-center space-x-2 h-10">
                <Switch
                  id="wh-status"
                  checked={status === 'ACTIVE'}
                  onCheckedChange={(checked) => setStatus(checked ? 'ACTIVE' : 'PAUSED')}
                />
                <span className="text-xs font-semibold">{status}</span>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                Event Subscriptions
              </label>
              <span className="text-xs text-muted-foreground">
                {selectedEvents.length} selected
              </span>
            </div>
            
            <div className="grid gap-2 max-h-[180px] overflow-y-auto border border-slate-200 dark:border-slate-800 rounded-lg p-3 bg-slate-50 dark:bg-slate-900/50 scrollbar-thin">
              {WEBHOOK_EVENTS.map((evt) => {
                const isChecked = selectedEvents.includes(evt.value);
                return (
                  <div
                    key={evt.value}
                    onClick={() => handleEventToggle(evt.value)}
                    className={cn(
                      "flex items-start space-x-3 p-2 rounded-md cursor-pointer transition-colors",
                      isChecked 
                        ? "bg-emerald-500/5 border border-emerald-500/20 dark:bg-emerald-500/10" 
                        : "hover:bg-slate-100 dark:hover:bg-slate-800 border border-transparent"
                    )}
                  >
                    <div className={cn(
                      "mt-0.5 flex h-4 w-4 items-center justify-center rounded border text-current",
                      isChecked 
                        ? "border-emerald-500 bg-emerald-500 text-white" 
                        : "border-slate-300 dark:border-slate-700"
                    )}>
                      {isChecked && <Check className="h-3 w-3 stroke-[3]" />}
                    </div>
                    <div className="space-y-0.5">
                      <span className="text-xs font-semibold text-slate-900 dark:text-slate-100">
                        {evt.label}
                      </span>
                      <p className="text-[10px] text-muted-foreground leading-normal">
                        {evt.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
            {errors.events && (
              <p className="text-xs text-rose-500 flex items-center mt-1">
                <AlertCircle className="h-3 w-3 mr-1" />
                {errors.events}
              </p>
            )}
          </div>

          <DialogFooter className="pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-emerald-600 hover:bg-emerald-500 text-white"
            >
              {isEdit ? 'Save Changes' : 'Create Subscription'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

interface WebhookLogsDialogProps {
  webhook: Webhook | null;
  isOpen: boolean;
  onClose: () => void;
}

export const WebhookLogsDialog: React.FC<WebhookLogsDialogProps> = ({
  webhook,
  isOpen,
  onClose,
}) => {
  const [expandedLogId, setExpandedLogId] = useState<string | null>(null);
  const [simulatingId, setSimulatingId] = useState<string | null>(null);

  if (!webhook) return null;

  const handleSimulateRetry = (logId: string) => {
    setSimulatingId(logId);
    setTimeout(() => {
      setSimulatingId(null);
    }, 1500);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-3xl border-slate-200 dark:border-slate-800">
        <DialogHeader>
          <div className="flex items-center space-x-2">
            <Activity className="h-5 w-5 text-emerald-500" />
            <DialogTitle className="text-lg font-bold">Delivery Logs: {webhook.name}</DialogTitle>
          </div>
          <DialogDescription className="font-mono text-xs truncate">
            {webhook.callbackUrl}
          </DialogDescription>
        </DialogHeader>

        <div className="py-2 space-y-4">
          <div className="flex items-center justify-between text-xs text-muted-foreground bg-slate-50 dark:bg-slate-900 p-3 rounded-lg border border-slate-100 dark:border-slate-800">
            <div>
              <span className="font-semibold text-slate-900 dark:text-slate-100">Total Deliveries (24h):</span> {webhook.deliveryLogs.length}
            </div>
            <div>
              <span className="font-semibold text-slate-900 dark:text-slate-100">Success Rate:</span>{' '}
              {webhook.deliveryLogs.length > 0
                ? `${((webhook.deliveryLogs.filter((l) => l.success).length / webhook.deliveryLogs.length) * 100).toFixed(1)}%`
                : '100%'}
            </div>
            <div>
              <span className="font-semibold text-slate-900 dark:text-slate-100">Failure Count:</span>{' '}
              <span className={cn(webhook.failureCount > 0 && "text-rose-500 font-bold")}>
                {webhook.failureCount}
              </span>
            </div>
          </div>

          <div className="border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden">
            <Table>
              <TableHeader className="bg-slate-50 dark:bg-slate-900">
                <TableRow>
                  <TableHead className="w-[180px]">Timestamp</TableHead>
                  <TableHead>Event Type</TableHead>
                  <TableHead className="w-[100px]">Status</TableHead>
                  <TableHead className="w-[100px] text-right">Latency</TableHead>
                  <TableHead className="w-[80px] text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {webhook.deliveryLogs.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                      No delivery logs recorded for this endpoint.
                    </TableCell>
                  </TableRow>
                ) : (
                  webhook.deliveryLogs.map((log) => {
                    const isExpanded = expandedLogId === log.id;
                    const isRetrying = simulatingId === log.id;

                    return (
                      <React.Fragment key={log.id}>
                        <TableRow 
                          className={cn(
                            "cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors",
                            isExpanded && "bg-slate-50 dark:bg-slate-900/30"
                          )}
                          onClick={() => setExpandedLogId(isExpanded ? null : log.id)}
                        >
                          <TableCell className="font-medium text-xs">
                            {new Date(log.timestamp).toLocaleString()}
                          </TableCell>
                          <TableCell className="font-mono text-xs text-slate-600 dark:text-slate-400">
                            {log.event}
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className={cn(
                                "font-bold text-[10px] px-1.5 py-0",
                                log.success
                                  ? "bg-emerald-500/10 text-emerald-700 border-emerald-500/20 dark:bg-emerald-500/20 dark:text-emerald-400"
                                  : "bg-rose-500/10 text-rose-700 border-rose-500/20 dark:bg-rose-500/20 dark:text-rose-400"
                              )}
                            >
                              {log.statusCode} {log.success ? 'OK' : 'ERROR'}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right font-mono text-xs">
                            {log.durationMs}ms
                          </TableCell>
                          <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleSimulateRetry(log.id)}
                              disabled={isRetrying}
                              className="h-7 w-7 text-slate-500 hover:text-slate-900 dark:hover:text-slate-100"
                              title="Simulate Redelivery"
                            >
                              <RefreshCw className={cn("h-3.5 w-3.5", isRetrying && "animate-spin text-emerald-500")} />
                            </Button>
                          </TableCell>
                        </TableRow>
                        {isExpanded && (
                          <TableRow className="bg-slate-950 hover:bg-slate-950">
                            <TableCell colSpan={5} className="p-4">
                              <div className="space-y-2">
                                <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono">
                                  <span>PAYLOAD PREVIEW</span>
                                  <span>JSON FORMAT</span>
                                </div>
                                <pre className="text-xs font-mono text-slate-300 bg-slate-900 p-3 rounded border border-slate-800 overflow-x-auto max-h-[150px] scrollbar-thin">
                                  {JSON.stringify(JSON.parse(log.payloadPreview), null, 2)}
                                </pre>
                              </div>
                            </TableCell>
                          </TableRow>
                        )}
                      </React.Fragment>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </Dialog>
    </Dialog>
  );
};

interface IntegrationCardProps {
  integration: Integration;
  onSync: (id: string) => void;
}

export const IntegrationCard: React.FC<IntegrationCardProps> = ({
  integration,
  onSync,
}) => {
  const [isSyncing, setIsSyncing] = useState(false);

  const handleSyncClick = () => {
    setIsSyncing(true);
    onSync(integration.id);
    setTimeout(() => {
      setIsSyncing(false);
    }, 1200);
  };

  const sparklineData = useMemo(() => {
    return integration.metricsHistory.map((m, idx) => ({ id: idx, latency: m.latencyMs }));
  }, [integration.metricsHistory]);

  return (
    <Card className="border-slate-200 dark:border-slate-800 hover:shadow-md transition-all duration-200">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
        <div className="space-y-1">
          <CardTitle className="text-sm font-bold text-slate-900 dark:text-slate-100">
            {integration.name}
          </CardTitle>
          <CardDescription className="text-xs">
            Provider: {integration.provider}
          </CardDescription>
        </div>
        <IntegrationStatusBadge status={integration.status} />
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-3 gap-2 text-center bg-slate-50 dark:bg-slate-900 p-2.5 rounded-lg border border-slate-100 dark:border-slate-800">
          <div className="space-y-0.5">
            <span className="text-[10px] text-muted-foreground block">Calls (24h)</span>
            <span className="text-xs font-bold text-slate-900 dark:text-slate-100">
              {formatNumber(integration.apiCalls24h)}
            </span>
          </div>
          <div className="space-y-0.5 border-x border-slate-200 dark:border-slate-800">
            <span className="text-[10px] text-muted-foreground block">Error Rate</span>
            <span className={cn(
              "text-xs font-bold",
              integration.errorRate24h > 2 ? "text-rose-500" : "text-slate-900 dark:text-slate-100"
            )}>
              {integration.errorRate24h.toFixed(2)}%
            </span>
          </div>
          <div className="space-y-0.5">
            <span className="text-[10px] text-muted-foreground block">Avg Latency</span>
            <span className="text-xs font-bold text-slate-900 dark:text-slate-100">
              {integration.averageLatencyMs}ms
            </span>
          </div>
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-[10px] text-muted-foreground">
            <span>Latency Sparkline (24h)</span>
            <span>Last Sync: {formatDistanceToNow(integration.lastSyncTime)}</span>
          </div>
          <div className="h-8 w-full opacity-60">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={sparklineData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                <Area
                  type="monotone"
                  dataKey="latency"
                  stroke={integration.status === 'OPERATIONAL' ? '#10b981' : integration.status === 'DEGRADED' ? '#f59e0b' : '#f43f5e'}
                  strokeWidth={1.5}
                  fill={integration.status === 'OPERATIONAL' ? '#10b981' : integration.status === 'DEGRADED' ? '#f59e0b' : '#f43f5e'}
                  fillOpacity={0.1}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </CardContent>
      <CardFooter className="border-t border-slate-100 dark:border-slate-800/50 px-6 py-3 bg-slate-50/50 dark:bg-slate-900/20 flex justify-between items-center">
        <Badge variant="secondary" className="text-[9px] font-semibold tracking-wider uppercase">
          {integration.category}
        </Badge>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleSyncClick}
          disabled={isSyncing}
          className="h-7 text-xs text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
        >
          <RefreshCw className={cn("mr-1.5 h-3 w-3", isSyncing && "animate-spin text-emerald-500")} />
          {isSyncing ? 'Syncing...' : 'Sync Now'}
        </Button>
      </CardFooter>
    </Card>
  );
};interface OverviewTabProps {
  state: DashboardState;
  dispatch: React.Dispatch<DashboardAction>;
  onOpenAnomaly: (anomaly: Anomaly) => void;
}

export const OverviewTab: React.FC<OverviewTabProps> = ({
  state,
  dispatch,
  onOpenAnomaly,
}) => {
  const activeAnomaliesCount = useMemo(() => {
    return state.anomalies.filter((a) => a.status === 'ACTIVE' || a.status === 'INVESTIGATING').length;
  }, [state.anomalies]);

  const activeWebhooksCount = useMemo(() => {
    return state.webhooks.filter((w) => w.status === 'ACTIVE').length;
  }, [state.webhooks]);

  const operationalIntegrationsCount = useMemo(() => {
    return state.integrations.filter((i) => i.status === 'OPERATIONAL').length;
  }, [state.integrations]);

  const recentAnomalies = useMemo(() => {
    return state.anomalies.slice(0, 5);
  }, [state.anomalies]);

  const recentActivity = useMemo(() => {
    return state.activityLogs.slice(0, 6);
  }, [state.activityLogs]);

  const trendData = useMemo(() => {
    return state.userGrowthData.map((d) => ({ value: d.users }));
  }, [state.userGrowthData]);

  const activeTrendData = useMemo(() => {
    return state.userGrowthData.map((d) => ({ value: d.activeUsers }));
  }, [state.userGrowthData]);

  const revenueTrendData = useMemo(() => {
    return state.userGrowthData.map((d) => ({ value: d.revenue }));
  }, [state.userGrowthData]);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-950/95 border border-slate-800 p-3 rounded-lg shadow-xl font-mono text-xs space-y-1.5 text-slate-200">
          <p className="font-bold text-slate-400 border-b border-slate-800 pb-1 mb-1">{label}</p>
          {payload.map((pld: any, idx: number) => (
            <div key={idx} className="flex items-center justify-between space-x-4">
              <span className="flex items-center">
                <span className="w-2 h-2 rounded-full mr-1.5" style={{ backgroundColor: pld.color }} />
                {pld.name}:
              </span>
              <span className="font-bold text-white">
                {pld.name === 'Revenue' ? formatCurrency(pld.value) : formatNumber(pld.value)}
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Top Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Registered Users"
          value={formatNumber(state.userMetrics.totalUsers)}
          icon={Users}
          change={`+${state.userMetrics.growthLast30d}%`}
          changeType="increase"
          description="growth last 30 days"
          trendData={trendData}
        />
        <StatCard
          title="Active Users (24h)"
          value={formatNumber(state.userMetrics.activeUsers24h)}
          icon={Activity}
          change={`${state.userMetrics.conversionRate}%`}
          changeType="neutral"
          description="conversion rate"
          trendData={activeTrendData}
        />
        <StatCard
          title="Active Webhooks"
          value={`${activeWebhooksCount} / ${state.webhooks.length}`}
          icon={PlugZap}
          change={state.webhooks.reduce((acc, curr) => acc + curr.failureCount, 0)}
          changeType={state.webhooks.some((w) => w.status === 'FAILED') ? 'decrease' : 'neutral'}
          description="total delivery failures"
        />
        <StatCard
          title="System Cluster Status"
          value={state.systemHealth.overallStatus}
          icon={Server}
          change={state.systemHealth.uptime}
          changeType={state.systemHealth.overallStatus === 'OPERATIONAL' ? 'increase' : 'decrease'}
          description="overall cluster uptime"
        />
      </div>

      {/* System Health Real-time Grid */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold tracking-wider uppercase text-muted-foreground flex items-center">
            <Cpu className="mr-2 h-4 w-4 text-slate-500" />
            Cluster Resource Telemetry
          </h3>
          <Button
            variant="outline"
            size="sm"
            onClick={() => dispatch({ type: 'OPEN_MODAL', payload: { key: 'systemTerminal', data: true } })}
            className="h-7 text-xs border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 font-mono"
          >
            <Terminal className="mr-1.5 h-3.5 w-3.5 text-emerald-500" />
            Open Secure Terminal
          </Button>
        </div>
        <SystemHealthGrid health={state.systemHealth} />
      </div>

      {/* Charts & Logs Split View */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        {/* User Growth & Revenue Chart */}
        <Card className="col-span-4 border-slate-200 dark:border-slate-800">
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="space-y-1">
              <CardTitle className="text-base font-bold">Growth & Revenue Analytics</CardTitle>
              <CardDescription>Historical user acquisition and monthly recurring revenue (MRR).</CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="text-[10px] font-semibold bg-emerald-500/5 text-emerald-600 border-emerald-500/10">
                Live Sync Active
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={state.userGrowthData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-slate-100 dark:stroke-slate-800/50" />
                  <XAxis 
                    dataKey="name" 
                    stroke="#888888" 
                    fontSize={11} 
                    tickLine={false} 
                    axisLine={false} 
                  />
                  <YAxis 
                    yAxisId="left"
                    stroke="#888888" 
                    fontSize={11} 
                    tickLine={false} 
                    axisLine={false} 
                    tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
                  />
                  <YAxis 
                    yAxisId="right"
                    orientation="right"
                    stroke="#888888" 
                    fontSize={11} 
                    tickLine={false} 
                    axisLine={false} 
                    tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend verticalAlign="top" height={36} iconType="circle" iconSize={8} wrapperStyle={{ fontSize: '12px' }} />
                  <Area 
                    yAxisId="left"
                    type="monotone" 
                    name="Total Users"
                    dataKey="users" 
                    stroke="#3b82f6" 
                    strokeWidth={2}
                    fillOpacity={1} 
                    fill="url(#colorUsers)" 
                  />
                  <Area 
                    yAxisId="right"
                    type="monotone" 
                    name="Revenue"
                    dataKey="revenue" 
                    stroke="#10b981" 
                    strokeWidth={2}
                    fillOpacity={1} 
                    fill="url(#colorRevenue)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity & Anomalies Feed */}
        <div className="col-span-4 lg:col-span-3 space-y-6">
          {/* Active Anomalies Alert Panel */}
          <Card className="border-rose-200 dark:border-rose-950/30 bg-rose-50/30 dark:bg-rose-950/5">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <ShieldAlert className="h-5 w-5 text-rose-500 animate-pulse" />
                  <CardTitle className="text-sm font-bold text-rose-900 dark:text-rose-400">
                    AI Threat Detection Feed
                  </CardTitle>
                </div>
                <Badge variant="outline" className="bg-rose-500/10 text-rose-700 border-rose-500/20 dark:bg-rose-500/20 dark:text-rose-400 font-bold text-[10px]">
                  {activeAnomaliesCount} ACTIVE
                </Badge>
              </div>
              <CardDescription className="text-rose-700/70 dark:text-rose-400/60 text-xs">
                Real-time security anomalies flagged by the Quantum Core AI engine.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 max-h-[280px] overflow-y-auto scrollbar-thin">
              {recentAnomalies.length === 0 ? (
                <div className="text-center py-6 text-xs text-muted-foreground">
                  No security anomalies detected in the last 24 hours.
                </div>
              ) : (
                recentAnomalies.map((anom) => (
                  <div 
                    key={anom.id} 
                    onClick={() => onOpenAnomaly(anom)}
                    className="flex items-start space-x-3 p-2.5 rounded-lg border border-rose-100 dark:border-rose-950/20 bg-white dark:bg-slate-950 hover:bg-rose-50/50 dark:hover:bg-rose-950/10 transition-all duration-150 cursor-pointer"
                  >
                    <div className="flex-shrink-0 mt-0.5">
                      {anom.entityType === 'USER' && <Users className="h-4 w-4 text-slate-500" />}
                      {anom.entityType === 'TRANSACTION' && <DollarSign className="h-4 w-4 text-slate-500" />}
                      {anom.entityType === 'API_KEY' && <PlugZap className="h-4 w-4 text-slate-500" />}
                      {anom.entityType === 'IP_ADDRESS' && <Radio className="h-4 w-4 text-slate-500" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">
                          {anom.description}
                        </p>
                        <AnomalySeverityBadge severity={anom.severity} />
                      </div>
                      <div className="flex items-center justify-between text-[10px] text-muted-foreground mt-1">
                        <span className="font-mono">{anom.entityId}</span>
                        <span className="flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          {formatDistanceToNow(anom.timestamp)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          {/* Recent Activity Log */}
          <Card className="border-slate-200 dark:border-slate-800">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-bold">Recent Activity Log</CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => dispatch({ type: 'SET_ACTIVE_TAB', payload: 'logs' })}
                  className="h-6 text-xs text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 px-2"
                >
                  View All
                  <ChevronRight className="ml-1 h-3.5 w-3.5" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {recentActivity.map((log) => {
                let levelColor = 'bg-slate-500/10 text-slate-500';
                if (log.level === 'ERROR') levelColor = 'bg-rose-500/10 text-rose-500';
                if (log.level === 'WARN') levelColor = 'bg-amber-500/10 text-amber-500';
                if (log.level === 'DEBUG') levelColor = 'bg-sky-500/10 text-sky-500';

                return (
                  <div key={log.id} className="flex items-start space-x-3 text-xs">
                    <Badge className={cn("font-bold text-[9px] px-1.5 py-0 rounded", levelColor)} variant="outline">
                      {log.level}
                    </Badge>
                    <div className="flex-1 min-w-0">
                      <p className="text-slate-700 dark:text-slate-300 leading-normal break-words">
                        {log.message}
                      </p>
                      <div className="flex items-center space-x-2 text-[10px] text-muted-foreground mt-0.5">
                        <span className="font-semibold">{log.operator}</span>
                        <span>•</span>
                        <span>{formatDistanceToNow(log.timestamp)}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

interface AnomaliesTabProps {
  state: DashboardState;
  dispatch: React.Dispatch<DashboardAction>;
  onOpenAnomaly: (anomaly: Anomaly) => void;
}

export const AnomaliesTab: React.FC<AnomaliesTabProps> = ({
  state,
  dispatch,
  onOpenAnomaly,
}) => {
  const filteredAnomalies = useMemo(() => {
    return state.anomalies.filter((anom) => {
      const matchesSeverity = state.filters.anomalySeverity === 'ALL' || anom.severity === state.filters.anomalySeverity;
      const matchesStatus = state.filters.anomalyStatus === 'ALL' || anom.status === state.filters.anomalyStatus;
      const matchesCategory = state.filters.anomalyCategory === 'ALL' || anom.category === state.filters.anomalyCategory;
      
      const searchLower = state.filters.anomalySearch.toLowerCase();
      const matchesSearch = 
        anom.description.toLowerCase().includes(searchLower) ||
        anom.id.toLowerCase().includes(searchLower) ||
        anom.entityId.toLowerCase().includes(searchLower) ||
        (anom.metadata.ipAddress && anom.metadata.ipAddress.toLowerCase().includes(searchLower)) ||
        (anom.metadata.location && anom.metadata.location.toLowerCase().includes(searchLower));

      return matchesSeverity && matchesStatus && matchesCategory && matchesSearch;
    });
  }, [state.anomalies, state.filters]);

  const handleExport = () => {
    const exportData = filteredAnomalies.map((anom) => ({
      id: anom.id,
      timestamp: anom.timestamp,
      severity: anom.severity,
      status: anom.status,
      category: anom.category,
      description: anom.description,
      entityType: anom.entityType,
      entityId: anom.entityId,
      ipAddress: anom.metadata.ipAddress || '',
      location: anom.metadata.location || '',
      amount: anom.metadata.amount || '',
      resolvedBy: anom.metadata.resolvedBy || '',
      resolvedAt: anom.metadata.resolvedAt || '',
    }));
    exportToCSV(exportData, 'quantum_core_anomalies');
  };

  return (
    <Card className="border-slate-200 dark:border-slate-800">
      <CardHeader className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0 pb-4 border-b border-slate-100 dark:border-slate-800/50">
        <div className="space-y-1">
          <CardTitle className="text-lg font-bold">Security Anomaly Registry</CardTitle>
          <CardDescription>
            Audit, investigate, and resolve security threats flagged by the AI engine.
          </CardDescription>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleExport}
            className="h-8 text-xs border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <Download className="mr-1.5 h-3.5 w-3.5" />
            Export CSV
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => dispatch({ type: 'RESET_FILTERS' })}
            className="h-8 text-xs border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <RefreshCw className="mr-1.5 h-3.5 w-3.5" />
            Reset Filters
          </Button>
        </div>
      </CardHeader>

      <CardContent className="pt-6 space-y-4">
        {/* Filters Bar */}
        <div className="grid gap-3 md:grid-cols-4">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search anomalies, IPs, entities..."
              value={state.filters.anomalySearch}
              onChange={(e) => dispatch({ type: 'SET_FILTER', payload: { key: 'anomalySearch', value: e.target.value } })}
              className="pl-9 h-9 text-xs"
            />
          </div>

          <div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full h-9 text-xs justify-between border-slate-200 dark:border-slate-800">
                  <span className="flex items-center">
                    <Filter className="mr-1.5 h-3.5 w-3.5 text-slate-400" />
                    Severity: {state.filters.anomalySeverity}
                  </span>
                  <ChevronRight className="h-3.5 w-3.5 rotate-90 text-slate-400" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <DropdownMenuLabel>Filter by Severity</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {(['ALL', 'CRITICAL', 'HIGH', 'MEDIUM', 'LOW'] as const).map((sev) => (
                  <DropdownMenuItem 
                    key={sev} 
                    onClick={() => dispatch({ type: 'SET_FILTER', payload: { key: 'anomalySeverity', value: sev } })}
                    className="text-xs font-semibold"
                  >
                    {sev}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full h-9 text-xs justify-between border-slate-200 dark:border-slate-800">
                  <span className="flex items-center">
                    <Sliders className="mr-1.5 h-3.5 w-3.5 text-slate-400" />
                    Status: {state.filters.anomalyStatus}
                  </span>
                  <ChevronRight className="h-3.5 w-3.5 rotate-90 text-slate-400" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {(['ALL', 'ACTIVE', 'INVESTIGATING', 'RESOLVED', 'DISMISSED'] as const).map((stat) => (
                  <DropdownMenuItem 
                    key={stat} 
                    onClick={() => dispatch({ type: 'SET_FILTER', payload: { key: 'anomalyStatus', value: stat } })}
                    className="text-xs font-semibold"
                  >
                    {stat}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full h-9 text-xs justify-between border-slate-200 dark:border-slate-800">
                  <span className="flex items-center">
                    <Shield className="mr-1.5 h-3.5 w-3.5 text-slate-400" />
                    Category: {state.filters.anomalyCategory.replace('_', ' ')}
                  </span>
                  <ChevronRight className="h-3.5 w-3.5 rotate-90 text-slate-400" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <DropdownMenuLabel>Filter by Category</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {(['ALL', 'FRAUD', 'SYSTEM_EXPLOIT', 'RATE_LIMIT', 'UNUSUAL_VOLUME', 'GEO_SUSPICIOUS'] as const).map((cat) => (
                  <DropdownMenuItem 
                    key={cat} 
                    onClick={() => dispatch({ type: 'SET_FILTER', payload: { key: 'anomalyCategory', value: cat } })}
                    className="text-xs font-semibold"
                  >
                    {cat.replace('_', ' ')}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Anomalies Table */}
        <div className="border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden">
          <Table>
            <TableHeader className="bg-slate-50 dark:bg-slate-900">
              <TableRow>
                <TableHead className="w-[100px]">ID</TableHead>
                <TableHead className="w-[150px]">Timestamp</TableHead>
                <TableHead className="w-[110px]">Severity</TableHead>
                <TableHead className="w-[130px]">Status</TableHead>
                <TableHead className="w-[150px]">Category</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="w-[140px]">Target Entity</TableHead>
                <TableHead className="w-[80px] text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAnomalies.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center text-muted-foreground py-12 text-xs">
                    No anomalies found matching the selected filter criteria.
                  </TableCell>
                </TableRow>
              ) : (
                filteredAnomalies.map((anom) => (
                  <TableRow key={anom.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors">
                    <TableCell className="font-mono text-xs font-bold">{anom.id}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {new Date(anom.timestamp).toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <AnomalySeverityBadge severity={anom.severity} />
                    </TableCell>
                    <TableCell>
                      <AnomalyStatusBadge status={anom.status} />
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="font-semibold text-[9px] tracking-wider uppercase">
                        {anom.category.replace('_', ' ')}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-xs font-medium max-w-[250px] truncate" title={anom.description}>
                      {anom.description}
                    </TableCell>
                    <TableCell className="text-xs font-mono">
                      <span className="text-slate-400 mr-1">{anom.entityType}:</span>
                      {anom.entityId}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onOpenAnomaly(anom)}
                        className="h-7 w-7 text-slate-500 hover:text-slate-900 dark:hover:text-slate-100"
                        title="Investigate Anomaly"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

interface WebhooksTabProps {
  state: DashboardState;
  dispatch: React.Dispatch<DashboardAction>;
  onOpenForm: (webhook: Webhook | null) => void;
  onOpenLogs: (webhook: Webhook) => void;
}

export const WebhooksTab: React.FC<WebhooksTabProps> = ({
  state,
  dispatch,
  onOpenForm,
  onOpenLogs,
}) => {
  const filteredWebhooks = useMemo(() => {
    return state.webhooks.filter((wh) => {
      const searchLower = state.filters.webhookSearch.toLowerCase();
      return (
        wh.name.toLowerCase().includes(searchLower) ||
        wh.callbackUrl.toLowerCase().includes(searchLower) ||
        wh.id.toLowerCase().includes(searchLower)
      );
    });
  }, [state.webhooks, state.filters.webhookSearch]);

  const handleToggleStatus = (id: string) => {
    dispatch({ type: 'TOGGLE_WEBHOOK_STATUS', payload: id });
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you absolutely sure you want to delete this webhook subscription? This action cannot be undone.')) {
      dispatch({ type: 'DELETE_WEBHOOK', payload: id });
    }
  };

  return (
    <Card className="border-slate-200 dark:border-slate-800">
      <CardHeader className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0 pb-4 border-b border-slate-100 dark:border-slate-800/50">
        <div className="space-y-1">
          <CardTitle className="text-lg font-bold">Developer Webhook Subscriptions</CardTitle>
          <CardDescription>
            Manage secure HTTP POST callbacks to receive real-time event payloads from the Quantum Core cluster.
          </CardDescription>
        </div>
        <Button
          onClick={() => onOpenForm({ id: '', name: '', callbackUrl: '', status: 'ACTIVE', events: [], lastTriggered: '', failureCount: 0, secret: '', deliveryLogs: [], createdAt: '' })}
          className="bg-emerald-600 hover:bg-emerald-500 text-white h-8 text-xs"
        >
          <Plus className="mr-1.5 h-4 w-4" />
          Register Webhook
        </Button>
      </CardHeader>

      <CardContent className="pt-6 space-y-4">
        {/* Search Bar */}
        <div className="relative max-w-md">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search webhooks by name or callback URL..."
            value={state.filters.webhookSearch}
            onChange={(e) => dispatch({ type: 'SET_FILTER', payload: { key: 'webhookSearch', value: e.target.value } })}
            className="pl-9 h-9 text-xs"
          />
        </div>

        {/* Webhooks Table */}
        <div className="border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden">
          <Table>
            <TableHeader className="bg-slate-50 dark:bg-slate-900">
              <TableRow>
                <TableHead>Webhook Endpoint</TableHead>
                <TableHead className="w-[100px]">Status</TableHead>
                <TableHead>Subscribed Events</TableHead>
                <TableHead className="w-[150px]">Last Triggered</TableHead>
                <TableHead className="w-[100px] text-right">Failures</TableHead>
                <TableHead className="w-[100px] text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredWebhooks.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground py-12 text-xs">
                    No webhook subscriptions registered. Click "Register Webhook" to create one.
                  </TableCell>
                </TableRow>
              ) : (
                filteredWebhooks.map((wh) => (
                  <TableRow key={wh.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors">
                    <TableCell className="space-y-1">
                      <div className="font-bold text-xs text-slate-900 dark:text-slate-100">
                        {wh.name}
                      </div>
                      <div className="font-mono text-[10px] text-muted-foreground truncate max-w-[350px]" title={wh.callbackUrl}>
                        {wh.callbackUrl}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={wh.status === 'ACTIVE'}
                          onCheckedChange={() => handleToggleStatus(wh.id)}
                          className="scale-75"
                        />
                        <WebhookStatusBadge status={wh.status} />
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1 max-w-[300px]">
                        {wh.events.map((evt) => (
                          <Badge key={evt} variant="secondary" className="text-[9px] font-semibold px-1.5 py-0">
                            {evt}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {wh.lastTriggered === new Date(0).toISOString() ? 'Never triggered' : formatDistanceToNow(wh.lastTriggered)}
                    </TableCell>
                    <TableCell className={cn("text-right font-mono text-xs font-bold", wh.failureCount > 0 ? "text-rose-500" : "text-slate-500")}>
                      {wh.failureCount}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-7 w-7">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-40">
                          <DropdownMenuItem onClick={() => onOpenForm(wh)} className="text-xs">
                            <Edit3 className="mr-2 h-3.5 w-3.5 text-slate-400" />
                            Edit Config
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => onOpenLogs(wh)} className="text-xs">
                            <Activity className="mr-2 h-3.5 w-3.5 text-slate-400" />
                            Delivery Logs
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => handleDelete(wh.id)} className="text-xs text-rose-600 dark:text-rose-400 focus:text-rose-600">
                            <Trash2 className="mr-2 h-3.5 w-3.5 text-rose-500" />
                            Delete Hook
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

interface IntegrationsTabProps {
  state: DashboardState;
  dispatch: React.Dispatch<DashboardAction>;
}

export const IntegrationsTab: React.FC<IntegrationsTabProps> = ({
  state,
  dispatch,
}) => {
  const [activeCategory, setActiveCategory] = useState<'ALL' | 'AUTH' | 'PAYMENT' | 'CRM' | 'CLOUD' | 'COMMUNICATION'>('ALL');
  const [isSyncingAll, setIsSyncingAll] = useState(false);

  const filteredIntegrations = useMemo(() => {
    if (activeCategory === 'ALL') return state.integrations;
    return state.integrations.filter((i) => i.category === activeCategory);
  }, [state.integrations, activeCategory]);

  const handleSync = (id: string) => {
    dispatch({ type: 'SYNC_INTEGRATION_START', payload: id });
    
    // Simulate API sync call
    setTimeout(() => {
      const isSuccess = Math.random() > 0.08;
      if (isSuccess) {
        const latency = Math.floor(40 + Math.random() * 60);
        const errorRate = parseFloat((Math.random() * 0.3).toFixed(3));
        const metrics: IntegrationMetric = {
          timestamp: new Date().toISOString(),
          latencyMs: latency,
          errorRate,
          throughput: Math.floor(1500 + Math.random() * 500),
        };
        dispatch({
          type: 'SYNC_INTEGRATION_SUCCESS',
          payload: { id, metrics, latency, errorRate },
        });
      } else {
        const errorRate = parseFloat((5 + Math.random() * 15).toFixed(2));
        dispatch({
          type: 'SYNC_INTEGRATION_FAILURE',
          payload: { id, errorRate },
        });
      }
    }, 1200);
  };

  const handleSyncAll = () => {
    setIsSyncingAll(true);
    state.integrations.forEach((integ) => {
      handleSync(integ.id);
    });
    setTimeout(() => {
      setIsSyncingAll(false);
    }, 1500);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div className="space-y-1">
          <h2 className="text-lg font-bold tracking-tight">Third-Party Integrations</h2>
          <p className="text-xs text-muted-foreground">
            Monitor API health, latency metrics, and error rates across external service providers.
          </p>
        </div>
        <Button
          onClick={handleSyncAll}
          disabled={isSyncingAll}
          className="bg-emerald-600 hover:bg-emerald-500 text-white h-8 text-xs"
        >
          <RefreshCw className={cn("mr-1.5 h-3.5 w-3.5", isSyncingAll && "animate-spin")} />
          {isSyncingAll ? 'Syncing Cluster...' : 'Sync All Integrations'}
        </Button>
      </div>

      {/* Category Tabs */}
      <Tabs value={activeCategory} onValueChange={(val) => setActiveCategory(val as any)} className="w-full">
        <TabsList className="grid grid-cols-3 md:grid-cols-6 h-9 p-1 bg-slate-100 dark:bg-slate-900">
          <TabsTrigger value="ALL" className="text-xs">All Services</TabsTrigger>
          <TabsTrigger value="AUTH" className="text-xs">Identity</TabsTrigger>
          <TabsTrigger value="PAYMENT" className="text-xs">Payments</TabsTrigger>
          <TabsTrigger value="CRM" className="text-xs">CRM</TabsTrigger>
          <TabsTrigger value="CLOUD" className="text-xs">Cloud</TabsTrigger>
          <TabsTrigger value="COMMUNICATION" className="text-xs">Comms</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Integrations Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredIntegrations.map((integ) => (
          <IntegrationCard
            key={integ.id}
            integration={integ}
            onSync={handleSync}
          />
        ))}
      </div>
    </div>
  );
};

interface LogsTabProps {
  state: DashboardState;
  dispatch: React.Dispatch<DashboardAction>;
}

export const LogsTab: React.FC<LogsTabProps> = ({
  state,
  dispatch,
}) => {
  const filteredLogs = useMemo(() => {
    return state.activityLogs.filter((log) => {
      const matchesLevel = state.filters.logLevel === 'ALL' || log.level === state.filters.logLevel;
      const matchesCategory = state.filters.logCategory === 'ALL' || log.category === state.filters.logCategory;
      
      const searchLower = state.filters.logSearch.toLowerCase();
      const matchesSearch = 
        log.message.toLowerCase().includes(searchLower) ||
        log.operator.toLowerCase().includes(searchLower) ||
        log.ipAddress.toLowerCase().includes(searchLower) ||
        log.id.toLowerCase().includes(searchLower);

      return matchesLevel && matchesCategory && matchesSearch;
    });
  }, [state.activityLogs, state.filters]);

  const handleExport = () => {
    exportToCSV(filteredLogs, 'quantum_core_activity_logs');
  };

  return (
    <Card className="border-slate-200 dark:border-slate-800">
      <CardHeader className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0 pb-4 border-b border-slate-100 dark:border-slate-800/50">
        <div className="space-y-1">
          <CardTitle className="text-lg font-bold">System Activity Logs</CardTitle>
          <CardDescription>
            Real-time diagnostic stream of cluster events, authentication attempts, and background jobs.
          </CardDescription>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleExport}
            className="h-8 text-xs border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <Download className="mr-1.5 h-3.5 w-3.5" />
            Export Logs
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => dispatch({ type: 'TOGGLE_LIVE_POLLING' })}
            className={cn(
              "h-8 text-xs border-slate-200 dark:border-slate-800",
              state.isLivePolling 
                ? "bg-emerald-500/5 text-emerald-600 border-emerald-500/10 hover:bg-emerald-500/10" 
                : "hover:bg-slate-100 dark:hover:bg-slate-800"
            )}
          >
            {state.isLivePolling ? (
              <>
                <Pause className="mr-1.5 h-3.5 w-3.5" />
                Pause Stream
              </>
            ) : (
              <>
                <Play className="mr-1.5 h-3.5 w-3.5" />
                Resume Stream
              </>
            )}
          </Button>
        </div>
      </CardHeader>

      <CardContent className="pt-6 space-y-4">
        {/* Filters Bar */}
        <div className="grid gap-3 md:grid-cols-3">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search logs, operators, IPs..."
              value={state.filters.logSearch}
              onChange={(e) => dispatch({ type: 'SET_FILTER', payload: { key: 'logSearch', value: e.target.value } })}
              className="pl-9 h-9 text-xs"
            />
          </div>

          <div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full h-9 text-xs justify-between border-slate-200 dark:border-slate-800">
                  <span className="flex items-center">
                    <Sliders className="mr-1.5 h-3.5 w-3.5 text-slate-400" />
                    Log Level: {state.filters.logLevel}
                  </span>
                  <ChevronRight className="h-3.5 w-3.5 rotate-90 text-slate-400" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <DropdownMenuLabel>Filter by Log Level</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {(['ALL', 'INFO', 'WARN', 'ERROR', 'DEBUG'] as const).map((lvl) => (
                  <DropdownMenuItem 
                    key={lvl} 
                    onClick={() => dispatch({ type: 'SET_FILTER', payload: { key: 'logLevel', value: lvl } })}
                    className="text-xs font-semibold"
                  >
                    {lvl}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full h-9 text-xs justify-between border-slate-200 dark:border-slate-800">
                  <span className="flex items-center">
                    <Layers className="mr-1.5 h-3.5 w-3.5 text-slate-400" />
                    Category: {state.filters.logCategory}
                  </span>
                  <ChevronRight className="h-3.5 w-3.5 rotate-90 text-slate-400" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <DropdownMenuLabel>Filter by Category</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {(['ALL', 'AUTH', 'BILLING', 'API', 'SYSTEM', 'SECURITY'] as const).map((cat) => (
                  <DropdownMenuItem 
                    key={cat} 
                    onClick={() => dispatch({ type: 'SET_FILTER', payload: { key: 'logCategory', value: cat } })}
                    className="text-xs font-semibold"
                  >
                    {cat}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Logs Console View */}
        <div className="border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden bg-slate-950 text-slate-200 font-mono text-xs">
          <div className="bg-slate-900 px-4 py-2 border-b border-slate-800 flex items-center justify-between text-[10px] text-slate-400">
            <span>SYSTEM DIAGNOSTIC CONSOLE</span>
            <span className="flex items-center">
              <span className={cn("w-2 h-2 rounded-full mr-1.5", state.isLivePolling ? "bg-emerald-500 animate-pulse" : "bg-slate-500")} />
              {state.isLivePolling ? 'LIVE STREAMING' : 'STREAM PAUSED'}
            </span>
          </div>
          <div className="p-4 h-[450px] overflow-y-auto space-y-2 scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent">
            {filteredLogs.length === 0 ? (
              <div className="text-center text-slate-500 py-12">
                No diagnostic logs found matching the filter criteria.
              </div>
            ) : (
              filteredLogs.map((log) => {
                let levelColor = 'text-slate-400';
                if (log.level === 'ERROR') levelColor = 'text-rose-400 font-bold';
                if (log.level === 'WARN') levelColor = 'text-amber-400 font-semibold';
                if (log.level === 'DEBUG') levelColor = 'text-sky-400';

                return (
                  <div key={log.id} className="flex items-start space-x-2 hover:bg-slate-900/50 py-0.5 px-1 rounded transition-colors">
                    <span className="text-slate-500 select-none">[{new Date(log.timestamp).toISOString()}]</span>
                    <span className={cn("w-14 shrink-0", levelColor)}>[{log.level}]</span>
                    <span className="text-emerald-500 shrink-0">[{log.category}]</span>
                    <span className="text-slate-300 flex-1 break-all">{log.message}</span>
                    <span className="text-slate-500 shrink-0 text-[10px]">({log.operator} @ {log.ipAddress})</span>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

interface AuditTabProps {
  state: DashboardState;
  dispatch: React.Dispatch<DashboardAction>;
}

export const AuditTab: React.FC<AuditTabProps> = ({
  state,
  dispatch,
}) => {
  const [expandedEntryId, setExpandedEntryId] = useState<string | null>(null);

  const filteredAudit = useMemo(() => {
    return state.auditTrail.filter((entry) => {
      const searchLower = state.filters.auditSearch.toLowerCase();
      return (
        entry.actor.name.toLowerCase().includes(searchLower) ||
        entry.actor.email.toLowerCase().includes(searchLower) ||
        entry.action.toLowerCase().includes(searchLower) ||
        entry.target.toLowerCase().includes(searchLower) ||
        entry.ipAddress.toLowerCase().includes(searchLower) ||
        entry.id.toLowerCase().includes(searchLower)
      );
    });
  }, [state.auditTrail, state.filters.auditSearch]);

  const handleExport = () => {
    const exportData = filteredAudit.map((entry) => ({
      id: entry.id,
      timestamp: entry.timestamp,
      actorName: entry.actor.name,
      actorEmail: entry.actor.email,
      actorRole: entry.actor.role,
      action: entry.action,
      target: entry.target,
      ipAddress: entry.ipAddress,
      status: entry.status,
    }));
    exportToCSV(exportData, 'quantum_core_compliance_audit_trail');
  };

  return (
    <Card className="border-slate-200 dark:border-slate-800">
      <CardHeader className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0 pb-4 border-b border-slate-100 dark:border-slate-800/50">
        <div className="space-y-1">
          <CardTitle className="text-lg font-bold">Compliance Audit Trail</CardTitle>
          <CardDescription>
            Immutable cryptographic ledger of administrative actions, configuration changes, and security overrides.
          </CardDescription>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleExport}
          className="h-8 text-xs border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          <Download className="mr-1.5 h-3.5 w-3.5" />
          Export Audit Ledger
        </Button>
      </CardHeader>

      <CardContent className="pt-6 space-y-4">
        {/* Search Bar */}
        <div className="relative max-w-md">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search audit ledger by actor, action, target..."
            value={state.filters.auditSearch}
            onChange={(e) => dispatch({ type: 'SET_FILTER', payload: { key: 'auditSearch', value: e.target.value } })}
            className="pl-9 h-9 text-xs"
          />
        </div>

        {/* Audit Table */}
        <div className="border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden">
          <Table>
            <TableHeader className="bg-slate-50 dark:bg-slate-900">
              <TableRow>
                <TableHead className="w-[180px]">Timestamp</TableHead>
                <TableHead className="w-[200px]">Actor</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Target Resource</TableHead>
                <TableHead className="w-[120px]">IP Address</TableHead>
                <TableHead className="w-[100px]">Status</TableHead>
                <TableHead className="w-[80px] text-right">Details</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAudit.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-muted-foreground py-12 text-xs">
                    No audit trail entries found matching the search criteria.
                  </TableCell>
                </TableRow>
              ) : (
                filteredAudit.map((entry) => {
                  const isExpanded = expandedEntryId === entry.id;

                  return (
                    <React.Fragment key={entry.id}>
                      <TableRow className="hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors">
                        <TableCell className="text-xs font-medium">
                          {new Date(entry.timestamp).toLocaleString()}
                        </TableCell>
                        <TableCell>
                          <div className="space-y-0.5">
                            <div className="text-xs font-bold text-slate-900 dark:text-slate-100">
                              {entry.actor.name}
                            </div>
                            <div className="text-[10px] text-muted-foreground">
                              {entry.actor.email} • <span className="font-semibold">{entry.actor.role}</span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                          {entry.action}
                        </TableCell>
                        <TableCell className="text-xs font-mono text-slate-600 dark:text-slate-400">
                          {entry.target}
                        </TableCell>
                        <TableCell className="text-xs font-mono">
                          {entry.ipAddress}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={cn(
                              "font-bold text-[10px] px-1.5 py-0",
                              entry.status === 'SUCCESS'
                                ? "bg-emerald-500/10 text-emerald-700 border-emerald-500/20 dark:bg-emerald-500/20 dark:text-emerald-400"
                                : "bg-rose-500/10 text-rose-700 border-rose-500/20 dark:bg-rose-500/20 dark:text-rose-400"
                            )}
                          >
                            {entry.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setExpandedEntryId(isExpanded ? null : entry.id)}
                            disabled={!entry.changes}
                            className="h-7 w-7 text-slate-500 hover:text-slate-900 dark:hover:text-slate-100"
                            title="View Change Diff"
                          >
                            <ChevronRight className={cn("h-4 w-4 transition-transform duration-200", isExpanded && "rotate-90")} />
                          </Button>
                        </TableCell>
                      </TableRow>
                      {isExpanded && entry.changes && (
                        <TableRow className="bg-slate-950 hover:bg-slate-950">
                          <TableCell colSpan={7} className="p-4">
                            <div className="space-y-2">
                              <div className="text-[10px] text-slate-500 font-mono">
                                CRYPTOGRAPHIC CHANGE DIFF
                              </div>
                              <div className="grid gap-2">
                                {entry.changes.map((change, idx) => (
                                  <div key={idx} className="grid grid-cols-3 gap-4 text-xs font-mono bg-slate-900 p-2.5 rounded border border-slate-800">
                                    <div>
                                      <span className="text-slate-500">FIELD:</span>{' '}
                                      <span className="text-sky-400 font-bold">{change.field}</span>
                                    </div>
                                    <div className="border-l border-slate-800 pl-4">
                                      <span className="text-rose-400 font-semibold block text-[10px]">OLD VALUE</span>
                                      <span className="text-slate-400 break-all">{change.oldValue || 'NULL'}</span>
                                    </div>
                                    <div className="border-l border-slate-800 pl-4">
                                      <span className="text-emerald-400 font-semibold block text-[10px]">NEW VALUE</span>
                                      <span className="text-slate-200 break-all">{change.newValue || 'NULL'}</span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                    </React.Fragment>
                  );
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

// ============================================================================
// 9. SECURE TERMINAL COMMAND PARSER ENGINE
// ============================================================================

export const executeTerminalCommand = (
  command: string,
  state: DashboardState,
  dispatch: React.Dispatch<DashboardAction>
): string => {
  const args = command.trim().split(/\s+/);
  const cmd = args[0].toLowerCase();

  switch (cmd) {
    case '/help':
      return [
        'Available Administrative Commands:',
        '  /status          - Display cluster status and resource usage.',
        '  /sync [id]       - Trigger synchronization for all or a specific integration.',
        '  /anomalies       - List active security anomalies.',
        '  /webhooks        - List registered webhook endpoints.',
        '  /lockdown        - Simulate emergency cluster lockdown.',
        '  /unlock          - Lift cluster lockdown.',
        '  /clear           - Clear terminal logs.'
      ].join('\n');

    case '/status': {
      const health = state.systemHealth;
      return [
        '--- CLUSTER TELEMETRY STATUS ---',
        `Overall Status : ${health.overallStatus}`,
        `Uptime         : ${health.uptime}`,
        `Avg Latency    : ${health.averageResponseTime}ms`,
        `CPU Load       : ${health.cpu.usage}% (${health.cpu.cores} Cores Active)`,
        `Memory Usage   : ${health.memory.usedGB} GB / ${health.memory.totalGB} GB`,
        `Disk Capacity  : ${health.disk.usedGB} GB / ${health.disk.totalGB} GB`,
        `Database Conn  : ${health.database.status} (${health.database.activeConnections} active connections)`,
        '--------------------------------'
      ].join('\n');
    }

    case '/sync': {
      const targetId = args[1];
      if (targetId) {
        const exists = state.integrations.some((i) => i.id === targetId);
        if (!exists) {
          return `ERROR: Integration with ID "${targetId}" not found.`;
        }
        dispatch({ type: 'SYNC_INTEGRATION_START', payload: targetId });
        return `SUCCESS: Synchronization job dispatched for integration: ${targetId}`;
      } else {
        state.integrations.forEach((integ) => {
          dispatch({ type: 'SYNC_INTEGRATION_START', payload: integ.id });
        });
        return 'SUCCESS: Synchronization jobs dispatched for all third-party integrations.';
      }
    }

    case '/anomalies': {
      const active = state.anomalies.filter((a) => a.status === 'ACTIVE');
      if (active.length === 0) {
        return 'No active security anomalies detected.';
      }
      return [
        '--- ACTIVE SECURITY ANOMALIES ---',
        ...active.map((a) => `  [${a.id}] Severity: ${a.severity} | Category: ${a.category} | ${a.description}`),
        '---------------------------------'
      ].join('\n');
    }

    case '/webhooks': {
      return [
        '--- REGISTERED WEBHOOK ENDPOINTS ---',
        ...state.webhooks.map((w) => `  [${w.id}] ${w.name} | Status: ${w.status} | URL: ${w.callbackUrl}`),
        '------------------------------------'
      ].join('\n');
    }

    case '/lockdown': {
      // Dispatch a critical system log and warning
      const [newLog] = generateActivityLogs(1);
      newLog.category = 'SECURITY';
      newLog.level = 'ERROR';
      newLog.message = 'EMERGENCY LOCKDOWN INITIATED BY ADMINISTRATIVE TERMINAL.';
      
      dispatch({
        type: 'POLL_REALTIME_EVENTS',
        payload: { log: newLog },
      });

      return [
        '!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!',
        'CRITICAL: EMERGENCY CLUSTER LOCKDOWN INITIATED.',
        'All public API gateways are routing to 503 Service Unavailable.',
        'Database connection pool restricted to read-only replicas.',
        'Administrative sessions locked to current terminal node.',
        '!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!'
      ].join('\n');
    }

    case '/unlock': {
      const [newLog] = generateActivityLogs(1);
      newLog.category = 'SECURITY';
      newLog.level = 'INFO';
      newLog.message = 'Emergency cluster lockdown lifted by administrative terminal.';
      
      dispatch({
        type: 'POLL_REALTIME_EVENTS',
        payload: { log: newLog },
      });

      return [
        'SUCCESS: Emergency cluster lockdown lifted.',
        'Public API gateways restored to operational routing.',
        'Database connection pool read-write capabilities restored.'
      ].join('\n');
    }

    case '/clear':
      dispatch({ type: 'CLEAR_TERMINAL_LOGS' });
      return 'Terminal logs cleared.';

    default:
      return `Command not recognized: "${cmd}". Type /help to view available commands.`;
  }
};// ============================================================================
// 10. SECURITY POLICIES & THREAT MITIGATION MODULE
// ============================================================================

export interface SecurityPolicy {
  id: string;
  name: string;
  description: string;
  category: 'WAF' | 'AUTH' | 'RATE_LIMIT' | 'GEO_BLOCKING';
  enabled: boolean;
  severity: AnomalySeverity;
  rulesCount: number;
  lastModified: string;
}

const INITIAL_POLICIES: SecurityPolicy[] = [
  {
    id: 'pol-101',
    name: 'SQL Injection Protection (WAF)',
    description: 'Inspects incoming request parameters and payloads for common SQL injection signatures.',
    category: 'WAF',
    enabled: true,
    severity: 'CRITICAL',
    rulesCount: 24,
    lastModified: new Date(Date.now() - 86400000 * 15).toISOString(),
  },
  {
    id: 'pol-102',
    name: 'Brute-Force Login Mitigation',
    description: 'Temporarily blocks IP addresses after 5 consecutive failed authentication attempts within 3 minutes.',
    category: 'AUTH',
    enabled: true,
    severity: 'HIGH',
    rulesCount: 3,
    lastModified: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    id: 'pol-103',
    name: 'Global API Rate Limiting',
    description: 'Enforces a hard limit of 100 requests per minute per IP address for unauthenticated public endpoints.',
    category: 'RATE_LIMIT',
    enabled: true,
    severity: 'MEDIUM',
    rulesCount: 1,
    lastModified: new Date(Date.now() - 86400000 * 45).toISOString(),
  },
  {
    id: 'pol-104',
    name: 'Sanctioned Countries Geo-Block',
    description: 'Restricts all incoming traffic originating from OFAC sanctioned countries and high-risk IP ranges.',
    category: 'GEO_BLOCKING',
    enabled: false,
    severity: 'CRITICAL',
    rulesCount: 18,
    lastModified: new Date(Date.now() - 86400000 * 120).toISOString(),
  },
  {
    id: 'pol-105',
    name: 'Cross-Site Scripting (XSS) Filter',
    description: 'Sanitizes and blocks malicious scripts embedded in HTTP headers, cookies, and query strings.',
    category: 'WAF',
    enabled: true,
    severity: 'HIGH',
    rulesCount: 14,
    lastModified: new Date(Date.now() - 86400000 * 8).toISOString(),
  },
];

interface SecurityPoliciesTabProps {
  onLogAction: (message: string) => void;
}

export const SecurityPoliciesTab: React.FC<SecurityPoliciesTabProps> = ({ onLogAction }) => {
  const [policies, setPolicies] = useState<SecurityPolicy[]>(INITIAL_POLICIES);
  const [rateLimit, setRateLimit] = useState(100);
  const [mfaEnforced, setMfaEnforced] = useState(true);
  const [blockedCountries, setBlockedCountries] = useState<string[]>(['KP', 'IR', 'SY']);
  const [newCountry, setNewCountry] = useState('');

  const handleTogglePolicy = (id: string) => {
    setPolicies((prev) =>
      prev.map((pol) => {
        if (pol.id === id) {
          const nextState = !pol.enabled;
          onLogAction(`Security policy "${pol.name}" ${nextState ? 'ENABLED' : 'DISABLED'}.`);
          return { ...pol, enabled: nextState, lastModified: new Date().toISOString() };
        }
        return pol;
      })
    );
  };

  const handleAddCountry = (e: React.FormEvent) => {
    e.preventDefault();
    const code = newCountry.trim().toUpperCase();
    if (code.length === 2 && !blockedCountries.includes(code)) {
      setBlockedCountries((prev) => [...prev, code]);
      onLogAction(`Added country code "${code}" to global geo-blocking registry.`);
      setNewCountry('');
    }
  };

  const handleRemoveCountry = (code: string) => {
    setBlockedCountries((prev) => prev.filter((c) => c !== code));
    onLogAction(`Removed country code "${code}" from global geo-blocking registry.`);
  };

  return (
    <div className="grid gap-6 md:grid-cols-3">
      <Card className="md:col-span-2 border-slate-200 dark:border-slate-800">
        <CardHeader>
          <CardTitle className="text-base font-bold">Active Security Policies</CardTitle>
          <CardDescription>
            Configure real-time threat mitigation rules and Web Application Firewall (WAF) policies.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden">
            <Table>
              <TableHeader className="bg-slate-50 dark:bg-slate-900">
                <TableRow>
                  <TableHead>Policy Name</TableHead>
                  <TableHead className="w-[120px]">Category</TableHead>
                  <TableHead className="w-[100px]">Severity</TableHead>
                  <TableHead className="w-[120px]">Last Modified</TableHead>
                  <TableHead className="w-[100px] text-right">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {policies.map((pol) => (
                  <TableRow key={pol.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors">
                    <TableCell className="space-y-1">
                      <div className="font-bold text-xs text-slate-900 dark:text-slate-100">
                        {pol.name}
                      </div>
                      <div className="text-[10px] text-muted-foreground leading-normal">
                        {pol.description}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="text-[9px] font-semibold px-1.5 py-0">
                        {pol.category}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <AnomalySeverityBadge severity={pol.severity} />
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {formatDistanceToNow(pol.lastModified)}
                    </TableCell>
                    <TableCell className="text-right">
                      <Switch
                        checked={pol.enabled}
                        onCheckedChange={() => handleTogglePolicy(pol.id)}
                        className="scale-75"
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-6">
        {/* Rate Limiter Config */}
        <Card className="border-slate-200 dark:border-slate-800">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-bold">Global Rate Limiter</CardTitle>
            <CardDescription className="text-xs">
              Adjust maximum allowable requests per minute per IP address.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-semibold">
                <span>Threshold Limit</span>
                <span className="text-emerald-500 font-mono">{rateLimit} req/min</span>
              </div>
              <input
                type="range"
                min="10"
                max="1000"
                step="10"
                value={rateLimit}
                onChange={(e) => {
                  const val = parseInt(e.target.value);
                  setRateLimit(val);
                }}
                onMouseUp={() => onLogAction(`Global API rate limit threshold adjusted to ${rateLimit} req/min.`)}
                className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />
            </div>
            <div className="flex items-center justify-between text-xs border-t border-slate-100 dark:border-slate-800/50 pt-3">
              <span className="text-muted-foreground">Enforce MFA for Admins</span>
              <Switch
                checked={mfaEnforced}
                onCheckedChange={(checked) => {
                  setMfaEnforced(checked);
                  onLogAction(`Multi-factor authentication enforcement for administrative sessions set to ${checked ? 'ENABLED' : 'DISABLED'}.`);
                }}
                className="scale-75"
              />
            </div>
          </CardContent>
        </Card>

        {/* Geo-Blocking Registry */}
        <Card className="border-slate-200 dark:border-slate-800">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-bold">Geo-Blocking Registry</CardTitle>
            <CardDescription className="text-xs">
              Restrict traffic from specific ISO 3166-1 alpha-2 country codes.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={handleAddCountry} className="flex space-x-2">
              <Input
                placeholder="e.g., RU, CN"
                value={newCountry}
                onChange={(e) => setNewCountry(e.target.value)}
                maxLength={2}
                className="h-8 text-xs font-mono uppercase"
              />
              <Button type="submit" size="sm" className="bg-slate-900 hover:bg-slate-800 text-white dark:bg-slate-100 dark:hover:bg-slate-200 dark:text-slate-950 h-8 text-xs">
                Block
              </Button>
            </form>

            <div className="flex flex-wrap gap-1.5 pt-2">
              {blockedCountries.length === 0 ? (
                <span className="text-xs text-muted-foreground">No countries blocked.</span>
              ) : (
                blockedCountries.map((code) => (
                  <Badge key={code} variant="destructive" className="text-[10px] font-mono font-bold px-2 py-0.5 flex items-center space-x-1">
                    <span>{code}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveCountry(code)}
                      className="hover:text-slate-200 focus:outline-none font-bold text-xs"
                    >
                      ×
                    </button>
                  </Badge>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

// ============================================================================
// 11. DATABASE EXPLORER & SQL QUERY RUNNER
// ============================================================================

export interface TableStat {
  tableName: string;
  rowCount: number;
  size: string;
  indexSize: string;
  bloatPercent: number;
}

const INITIAL_TABLE_STATS: TableStat[] = [
  { tableName: 'users', rowCount: 142850, size: '42.5 MB', indexSize: '18.2 MB', bloatPercent: 2.4 },
  { tableName: 'transactions', rowCount: 1845200, size: '512.8 MB', indexSize: '245.6 MB', bloatPercent: 4.1 },
  { tableName: 'webhooks', rowCount: 5, size: '12 KB', indexSize: '16 KB', bloatPercent: 0.1 },
  { tableName: 'audit_logs', rowCount: 85400, size: '28.4 MB', indexSize: '12.1 MB', bloatPercent: 1.8 },
  { tableName: 'security_anomalies', rowCount: 1240, size: '450 KB', indexSize: '180 KB', bloatPercent: 0.5 },
];

export const DatabaseExplorerTab: React.FC<{ onLogAction: (message: string) => void }> = ({ onLogAction }) => {
  const [query, setQuery] = useState('SELECT * FROM users LIMIT 5;');
  const [queryResult, setQueryResult] = useState<{ headers: string[]; rows: any[][] } | null>(null);
  const [executionTime, setExecutionTime] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isExecuting, setIsExecuting] = useState(false);

  const handleExecuteQuery = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setQueryResult(null);
    setExecutionTime(null);
    setIsExecuting(true);

    const trimmedQuery = query.trim().toLowerCase();

    setTimeout(() => {
      setIsExecuting(false);
      const start = performance.now();

      // Basic SQL parser simulation
      if (!trimmedQuery.startsWith('select')) {
        setError('SECURITY ERROR: Only read-only SELECT queries are permitted in this administrative console.');
        onLogAction('BLOCKED: Unauthorized write/modify query attempt on core database.');
        return;
      }

      if (trimmedQuery.includes('users')) {
        setQueryResult({
          headers: ['id', 'email', 'role', 'status', 'created_at'],
          rows: [
            ['usr-101', 'sconnor@quantumcore.io', 'Super Admin', 'ACTIVE', '2023-01-15 08:30:00'],
            ['usr-102', 'jdoe@quantumcore.io', 'Security Engineer', 'ACTIVE', '2023-02-10 14:15:22'],
            ['usr-103', 'eripley@quantumcore.io', 'Operations Lead', 'ACTIVE', '2023-03-01 11:05:45'],
            ['usr-104', 'maurelius@quantumcore.io', 'Compliance Officer', 'ACTIVE', '2023-04-18 09:00:12'],
            ['usr-105', 'alovelace@quantumcore.io', 'Database Architect', 'ACTIVE', '2023-05-22 16:40:30'],
          ],
        });
      } else if (trimmedQuery.includes('transactions')) {
        setQueryResult({
          headers: ['id', 'user_id', 'amount', 'currency', 'status', 'timestamp'],
          rows: [
            ['tx-982341', 'usr-204', '1250.00', 'USD', 'SUCCESS', '2023-10-24 14:22:10'],
            ['tx-982342', 'usr-512', '45.50', 'USD', 'SUCCESS', '2023-10-24 14:23:15'],
            ['tx-982343', 'usr-109', '8900.00', 'USD', 'FAILED', '2023-10-24 14:25:01'],
            ['tx-982344', 'usr-881', '120.00', 'USD', 'SUCCESS', '2023-10-24 14:26:44'],
            ['tx-982345', 'usr-303', '350.00', 'USD', 'SUCCESS', '2023-10-24 14:28:12'],
          ],
        });
      } else {
        setQueryResult({
          headers: ['status', 'message'],
          rows: [['SUCCESS', 'Query executed successfully, but returned 0 rows.']],
        });
      }

      const end = performance.now();
      setExecutionTime(parseFloat((end - start + Math.random() * 12).toFixed(2)));
      onLogAction(`Executed administrative database query: "${query.substring(0, 40)}..."`);
    }, 800);
  };

  return (
    <div className="grid gap-6 md:grid-cols-3">
      {/* Table Stats */}
      <Card className="border-slate-200 dark:border-slate-800">
        <CardHeader>
          <CardTitle className="text-base font-bold">Database Table Statistics</CardTitle>
          <CardDescription>
            Real-time storage metrics and row counts for core relational tables.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden">
            <Table>
              <TableHeader className="bg-slate-50 dark:bg-slate-900">
                <TableRow>
                  <TableHead>Table</TableHead>
                  <TableHead className="text-right">Rows</TableHead>
                  <TableHead className="text-right">Size</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {INITIAL_TABLE_STATS.map((stat) => (
                  <TableRow key={stat.tableName} className="hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors">
                    <TableCell className="font-mono text-xs font-bold text-slate-900 dark:text-slate-100">
                      {stat.tableName}
                    </TableCell>
                    <TableCell className="text-right text-xs font-mono">
                      {formatNumber(stat.rowCount)}
                    </TableCell>
                    <TableCell className="text-right text-xs font-mono text-muted-foreground">
                      {stat.size}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* SQL Query Runner */}
      <Card className="md:col-span-2 border-slate-200 dark:border-slate-800">
        <CardHeader>
          <CardTitle className="text-base font-bold">Secure SQL Query Runner</CardTitle>
          <CardDescription>
            Execute read-only queries against the cluster database replicas. Write operations are strictly blocked.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleExecuteQuery} className="space-y-3">
            <div className="font-mono text-xs bg-slate-950 text-slate-100 p-3 rounded-lg border border-slate-800">
              <textarea
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full min-h-[80px] bg-transparent border-none focus:outline-none resize-none text-emerald-400 font-mono text-xs leading-relaxed"
                spellCheck={false}
              />
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-muted-foreground">
                Permitted tables: <span className="font-mono text-foreground">users</span>, <span className="font-mono text-foreground">transactions</span>
              </span>
              <Button
                type="submit"
                disabled={isExecuting}
                className="bg-emerald-600 hover:bg-emerald-500 text-white h-8 text-xs font-bold"
              >
                {isExecuting ? (
                  <>
                    <RefreshCw className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                    Executing...
                  </>
                ) : (
                  <>
                    <Play className="mr-1.5 h-3.5 w-3.5" />
                    Run Query
                  </>
                )}
              </Button>
            </div>
          </form>

          {error && (
            <div className="bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/30 p-3 rounded-lg text-xs text-rose-600 dark:text-rose-400 font-mono flex items-start space-x-2">
              <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {executionTime !== null && (
            <div className="text-[10px] text-muted-foreground font-mono">
              Query executed successfully in <span className="text-foreground font-bold">{executionTime}ms</span>.
            </div>
          )}

          {queryResult && (
            <div className="border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden max-h-[200px] overflow-y-auto scrollbar-thin">
              <Table>
                <TableHeader className="bg-slate-50 dark:bg-slate-900">
                  <TableRow>
                    {queryResult.headers.map((header) => (
                      <TableHead key={header} className="font-mono text-[10px] uppercase">
                        {header}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {queryResult.rows.map((row, rowIdx) => (
                    <TableRow key={rowIdx} className="hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors">
                      {row.map((cell, cellIdx) => (
                        <TableCell key={cellIdx} className="font-mono text-xs">
                          {cell}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

// ============================================================================
// 12. MAIN ADMIN DASHBOARD COMPONENT
// ============================================================================

export default function AdminDashboard() {
  const { state, dispatch, reload } = useDashboardData();

  const handleTerminalCommandSubmit = (command: string) => {
    dispatch({ type: 'ADD_TERMINAL_LOG', payload: `> ${command}` });
    const output = executeTerminalCommand(command, state, dispatch);
    dispatch({ type: 'ADD_TERMINAL_LOG', payload: output });
  };

  const handleResolveAnomaly = (id: string, notes: string) => {
    dispatch({
      type: 'RESOLVE_ANOMALY_SUBMIT',
      payload: { id, notes, operator: 'Sarah Connor' },
    });
    dispatch({ type: 'ADD_TERMINAL_LOG', payload: `SUCCESS: Resolved security anomaly ${id}.` });
  };

  const handleDismissAnomaly = (id: string, notes: string) => {
    dispatch({
      type: 'DISMISS_ANOMALY_SUBMIT',
      payload: { id, notes, operator: 'Sarah Connor' },
    });
    dispatch({ type: 'ADD_TERMINAL_LOG', payload: `SUCCESS: Dismissed security anomaly ${id}.` });
  };

  const handleSaveWebhook = (webhook: Webhook) => {
    dispatch({ type: 'SAVE_WEBHOOK', payload: webhook });
    dispatch({ type: 'ADD_TERMINAL_LOG', payload: `SUCCESS: Saved webhook configuration for "${webhook.name}".` });
  };

  const handleLogAction = (message: string) => {
    dispatch({ type: 'ADD_TERMINAL_LOG', payload: message });
  };

  if (state.loading && state.anomalies.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-slate-950 text-slate-100 font-mono space-y-4">
        <RefreshCw className="h-8 w-8 animate-spin text-emerald-500" />
        <div className="text-sm tracking-widest animate-pulse">INITIALIZING QUANTUM CORE SECURE CONSOLE...</div>
      </div>
    );
  }

  if (state.error && state.anomalies.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-slate-950 text-rose-500 font-mono space-y-4 p-6 text-center">
        <ShieldAlert className="h-12 w-12 text-rose-500 animate-bounce" />
        <div className="text-lg font-bold tracking-wider">CRITICAL CONNECTION FAILURE</div>
        <p className="text-xs text-slate-400 max-w-md leading-relaxed">
          {state.error}
        </p>
        <Button onClick={reload} className="bg-rose-600 hover:bg-rose-500 text-white font-bold px-6 py-2 rounded">
          Retry Connection
        </Button>
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-6 p-4 md:p-8 pt-6 bg-slate-50/30 dark:bg-slate-950/10 min-h-screen">
      {/* Dashboard Header */}
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0 border-b border-slate-200 dark:border-slate-800/50 pb-6">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <Shield className="h-6 w-6 text-emerald-500" />
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
              Quantum Core Admin Dashboard
            </h1>
          </div>
          <p className="text-xs text-muted-foreground">
            Enterprise-grade cluster monitoring, threat detection, and developer integration control panel.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => dispatch({ type: 'TOGGLE_LIVE_POLLING' })}
            className={cn(
              "h-8 text-xs border-slate-200 dark:border-slate-800",
              state.isLivePolling 
                ? "bg-emerald-500/5 text-emerald-600 border-emerald-500/10 hover:bg-emerald-500/10" 
                : "hover:bg-slate-100 dark:hover:bg-slate-800"
            )}
          >
            <span className={cn("w-2 h-2 rounded-full mr-1.5", state.isLivePolling ? "bg-emerald-500 animate-pulse" : "bg-slate-400")} />
            {state.isLivePolling ? 'Live Polling Active' : 'Polling Paused'}
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={reload}
            disabled={state.loading}
            className="h-8 text-xs border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <RefreshCw className={cn("mr-1.5 h-3.5 w-3.5", state.loading && "animate-spin")} />
            Sync Cluster
          </Button>

          <Button
            onClick={() => dispatch({ type: 'OPEN_MODAL', payload: { key: 'systemTerminal', data: true } })}
            className="bg-slate-900 hover:bg-slate-800 text-white dark:bg-slate-100 dark:hover:bg-slate-200 dark:text-slate-950 h-8 text-xs font-mono"
          >
            <Terminal className="mr-1.5 h-3.5 w-3.5 text-emerald-500" />
            Terminal
          </Button>
        </div>
      </div>

      {/* Main Tabs Container */}
      <Tabs value={state.activeTab} onValueChange={(val) => dispatch({ type: 'SET_ACTIVE_TAB', payload: val })} className="space-y-6">
        <TabsList className="flex flex-wrap h-auto p-1 bg-slate-100 dark:bg-slate-900/50 border border-slate-200/50 dark:border-slate-800/50 rounded-lg max-w-fit">
          <TabsTrigger value="overview" className="text-xs px-3 py-1.5">Overview</TabsTrigger>
          <TabsTrigger value="anomalies" className="text-xs px-3 py-1.5 flex items-center">
            Anomalies
            {state.anomalies.filter((a) => a.status === 'ACTIVE').length > 0 && (
              <span className="ml-1.5 flex h-2 w-2 rounded-full bg-rose-500" />
            )}
          </TabsTrigger>
          <TabsTrigger value="webhooks" className="text-xs px-3 py-1.5">Webhooks</TabsTrigger>
          <TabsTrigger value="integrations" className="text-xs px-3 py-1.5">Integrations</TabsTrigger>
          <TabsTrigger value="policies" className="text-xs px-3 py-1.5">Security Policies</TabsTrigger>
          <TabsTrigger value="database" className="text-xs px-3 py-1.5">Database Explorer</TabsTrigger>
          <TabsTrigger value="logs" className="text-xs px-3 py-1.5">System Logs</TabsTrigger>
          <TabsTrigger value="audit" className="text-xs px-3 py-1.5">Audit Trail</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6 focus-visible:outline-none">
          <OverviewTab
            state={state}
            dispatch={dispatch}
            onOpenAnomaly={(anom) => dispatch({ type: 'OPEN_MODAL', payload: { key: 'resolveAnomaly', data: anom } })}
          />
        </TabsContent>

        <TabsContent value="anomalies" className="space-y-6 focus-visible:outline-none">
          <AnomaliesTab
            state={state}
            dispatch={dispatch}
            onOpenAnomaly={(anom) => dispatch({ type: 'OPEN_MODAL', payload: { key: 'resolveAnomaly', data: anom } })}
          />
        </TabsContent>

        <TabsContent value="webhooks" className="space-y-6 focus-visible:outline-none">
          <WebhooksTab
            state={state}
            dispatch={dispatch}
            onOpenForm={(wh) => dispatch({ type: 'OPEN_MODAL', payload: { key: 'webhookForm', data: wh } })}
            onOpenLogs={(wh) => dispatch({ type: 'OPEN_MODAL', payload: { key: 'webhookLogs', data: wh } })}
          />
        </TabsContent>

        <TabsContent value="integrations" className="space-y-6 focus-visible:outline-none">
          <IntegrationsTab state={state} dispatch={dispatch} />
        </TabsContent>

        <TabsContent value="policies" className="space-y-6 focus-visible:outline-none">
          <SecurityPoliciesTab onLogAction={handleLogAction} />
        </TabsContent>

        <TabsContent value="database" className="space-y-6 focus-visible:outline-none">
          <DatabaseExplorerTab onLogAction={handleLogAction} />
        </TabsContent>

        <TabsContent value="logs" className="space-y-6 focus-visible:outline-none">
          <LogsTab state={state} dispatch={dispatch} />
        </TabsContent>

        <TabsContent value="audit" className="space-y-6 focus-visible:outline-none">
          <AuditTab state={state} dispatch={dispatch} />
        </TabsContent>
      </Tabs>

      {/* Modals & Dialogs */}
      <AnomalyDetailsDialog
        anomaly={state.modals.resolveAnomaly}
        isOpen={!!state.modals.resolveAnomaly}
        onClose={() => dispatch({ type: 'CLOSE_MODAL', payload: { key: 'resolveAnomaly' } })}
        onResolve={handleResolveAnomaly}
        onDismiss={handleDismissAnomaly}
      />

      <WebhookFormDialog
        webhook={state.modals.webhookForm}
        isOpen={!!state.modals.webhookForm}
        onClose={() => dispatch({ type: 'CLOSE_MODAL', payload: { key: 'webhookForm' } })}
        onSave={handleSaveWebhook}
      />

      <WebhookLogsDialog
        webhook={state.modals.webhookLogs}
        isOpen={!!state.modals.webhookLogs}
        onClose={() => dispatch({ type: 'CLOSE_MODAL', payload: { key: 'webhookLogs' } })}
      />

      <TerminalConsole
        logs={state.terminalLogs}
        onExecuteCommand={handleTerminalCommandSubmit}
        onClear={() => dispatch({ type: 'CLEAR_TERMINAL_LOGS' })}
        isOpen={state.modals.systemTerminal}
        onClose={() => dispatch({ type: 'CLOSE_MODAL', payload: { key: 'systemTerminal' } })}
      />
    </div>
  );
}// ============================================================================
// 13. CLUSTER TOPOLOGY & NODE HEALTH MONITOR
// ============================================================================

export type NodeType = 'GATEWAY' | 'MICROSERVICE' | 'DATABASE' | 'CACHE' | 'WORKER';
export type NodeStatus = 'HEALTHY' | 'DEGRADED' | 'UNHEALTHY' | 'DRAINING';

export interface ClusterNode {
  id: string;
  name: string;
  type: NodeType;
  status: NodeStatus;
  ipAddress: string;
  region: string;
  cpuUsage: number;
  memoryUsage: number;
  uptime: string;
  activeThreads: number;
  version: string;
  metricsHistory: { cpu: number; memory: number; timestamp: string }[];
}

const INITIAL_NODES: ClusterNode[] = [
  {
    id: 'node-gw-01',
    name: 'Edge Gateway Node 01',
    type: 'GATEWAY',
    status: 'HEALTHY',
    ipAddress: '10.0.1.10',
    region: 'us-east-1',
    cpuUsage: 24,
    memoryUsage: 42,
    uptime: '14d 6h 12m',
    activeThreads: 342,
    version: 'v4.1.9',
    metricsHistory: Array.from({ length: 10 }, (_, i) => ({ cpu: 20 + Math.random() * 10, memory: 40 + Math.random() * 5, timestamp: `${i}m ago` })),
  },
  {
    id: 'node-auth-01',
    name: 'Identity & Auth Service',
    type: 'MICROSERVICE',
    status: 'HEALTHY',
    ipAddress: '10.0.2.15',
    region: 'us-east-1',
    cpuUsage: 18,
    memoryUsage: 55,
    uptime: '30d 12h 4m',
    activeThreads: 120,
    version: 'v4.1.9',
    metricsHistory: Array.from({ length: 10 }, (_, i) => ({ cpu: 15 + Math.random() * 8, memory: 50 + Math.random() * 6, timestamp: `${i}m ago` })),
  },
  {
    id: 'node-db-primary',
    name: 'PostgreSQL Primary Cluster',
    type: 'DATABASE',
    status: 'HEALTHY',
    ipAddress: '10.0.5.100',
    region: 'us-east-1',
    cpuUsage: 45,
    memoryUsage: 78,
    uptime: '90d 4h 55m',
    activeThreads: 89,
    version: 'PostgreSQL 15.4',
    metricsHistory: Array.from({ length: 10 }, (_, i) => ({ cpu: 40 + Math.random() * 15, memory: 75 + Math.random() * 4, timestamp: `${i}m ago` })),
  },
  {
    id: 'node-db-replica-01',
    name: 'PostgreSQL Read Replica 01',
    type: 'DATABASE',
    status: 'HEALTHY',
    ipAddress: '10.0.5.101',
    region: 'us-west-2',
    cpuUsage: 12,
    memoryUsage: 62,
    uptime: '45d 18h 22m',
    activeThreads: 45,
    version: 'PostgreSQL 15.4',
    metricsHistory: Array.from({ length: 10 }, (_, i) => ({ cpu: 10 + Math.random() * 5, memory: 60 + Math.random() * 3, timestamp: `${i}m ago` })),
  },
  {
    id: 'node-cache-01',
    name: 'Redis Distributed Cache',
    type: 'CACHE',
    status: 'HEALTHY',
    ipAddress: '10.0.3.50',
    region: 'us-east-1',
    cpuUsage: 8,
    memoryUsage: 34,
    uptime: '120d 1h 10m',
    activeThreads: 12,
    version: 'Redis 7.0.12',
    metricsHistory: Array.from({ length: 10 }, (_, i) => ({ cpu: 5 + Math.random() * 5, memory: 30 + Math.random() * 5, timestamp: `${i}m ago` })),
  },
  {
    id: 'node-worker-01',
    name: 'Background Job Worker 01',
    type: 'WORKER',
    status: 'HEALTHY',
    ipAddress: '10.0.4.10',
    region: 'us-east-1',
    cpuUsage: 68,
    memoryUsage: 82,
    uptime: '6d 22h 40m',
    activeThreads: 64,
    version: 'v4.1.9',
    metricsHistory: Array.from({ length: 10 }, (_, i) => ({ cpu: 60 + Math.random() * 20, memory: 80 + Math.random() * 4, timestamp: `${i}m ago` })),
  },
];

interface ClusterTopologyTabProps {
  onLogAction: (message: string) => void;
}

export const ClusterTopologyTab: React.FC<ClusterTopologyTabProps> = ({ onLogAction }) => {
  const [nodes, setNodes] = useState<ClusterNode[]>(INITIAL_NODES);
  const [selectedNode, setSelectedNode] = useState<ClusterNode | null>(null);
  const [isActionLoading, setIsActionLoading] = useState<string | null>(null);
  const [threadDump, setThreadDump] = useState<string | null>(null);

  // Simulate real-time node metrics updates
  useEffect(() => {
    const interval = setInterval(() => {
      setNodes((prevNodes) =>
        prevNodes.map((node) => {
          if (node.status === 'UNHEALTHY' || node.status === 'DRAINING') return node;

          const cpuDelta = (Math.random() - 0.5) * 10;
          const memDelta = (Math.random() - 0.5) * 4;

          const nextCpu = Math.min(100, Math.max(1, Math.floor(node.cpuUsage + cpuDelta)));
          const nextMem = Math.min(100, Math.max(1, Math.floor(node.memoryUsage + memDelta)));

          const updatedHistory = [...node.metricsHistory.slice(1), { cpu: nextCpu, memory: nextMem, timestamp: 'Just now' }];

          return {
            ...node,
            cpuUsage: nextCpu,
            memoryUsage: nextMem,
            metricsHistory: updatedHistory,
          };
        })
      );
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleRestartNode = (nodeId: string) => {
    setIsActionLoading('RESTART');
    onLogAction(`INITIATING RESTART: Dispatching graceful shutdown signal to cluster node "${nodeId}"...`);

    setNodes((prev) =>
      prev.map((n) => (n.id === nodeId ? { ...n, status: 'DEGRADED' as const, cpuUsage: 0, activeThreads: 0 } : n))
    );

    setTimeout(() => {
      setNodes((prev) =>
        prev.map((n) => (n.id === nodeId ? { ...n, status: 'HEALTHY' as const, cpuUsage: 15, activeThreads: 50 } : n))
      );
      setIsActionLoading(null);
      onLogAction(`SUCCESS: Cluster node "${nodeId}" has successfully restarted and rejoined the cluster topology.`);
      if (selectedNode?.id === nodeId) {
        setSelectedNode((prev) => prev ? { ...prev, status: 'HEALTHY', cpuUsage: 15, activeThreads: 50 } : null);
      }
    }, 3000);
  };

  const handleDrainNode = (nodeId: string) => {
    setIsActionLoading('DRAIN');
    onLogAction(`TRAFFIC DRAIN: Removing cluster node "${nodeId}" from active load balancer pools...`);

    setNodes((prev) =>
      prev.map((n) => {
        if (n.id === nodeId) {
          const nextStatus = n.status === 'DRAINING' ? 'HEALTHY' : 'DRAINING';
          return { ...n, status: nextStatus as any };
        }
        return n;
      })
    );

    setTimeout(() => {
      setIsActionLoading(null);
      const updatedNode = nodes.find((n) => n.id === nodeId);
      const wasDraining = updatedNode?.status === 'DRAINING';
      onLogAction(`SUCCESS: Node "${nodeId}" traffic routing state updated to: ${wasDraining ? 'ACTIVE' : 'DRAINED'}.`);
      if (selectedNode?.id === nodeId) {
        setSelectedNode((prev) => prev ? { ...prev, status: wasDraining ? 'HEALTHY' : 'DRAINING' } : null);
      }
    }, 1500);
  };

  const handleTriggerThreadDump = (node: ClusterNode) => {
    setIsActionLoading('THREAD_DUMP');
    onLogAction(`DIAGNOSTICS: Requesting JVM/Runtime thread dump from node "${node.id}"...`);

    setTimeout(() => {
      const dump = [
        `Full thread dump ${node.version} (${node.ipAddress} - us-east-1):`,
        `Uptime: ${node.uptime} | Active Threads: ${node.activeThreads}`,
        `\n"main" #1 prio=5 os_prio=0 cpu=142.50ms elapsed=1204.50s tid=0x00007f8c8c009000 nid=0x1a03 runnable [0x00007f8c929fe000]`,
        `   java.lang.Thread.State: RUNNABLE`,
        `        at java.net.SocketInputStream.socketRead0(Native Method)`,
        `        at java.net.SocketInputStream.socketRead(SocketInputStream.java:115)`,
        `        at java.net.SocketInputStream.read(SocketInputStream.java:171)`,
        `\n"Cluster-Heartbeat-Thread" #12 daemon prio=10 os_prio=0 cpu=12.40ms elapsed=1200.10s tid=0x00007f8c8c08a000 nid=0x1a12 waiting on condition [0x00007f8c912fd000]`,
        `   java.lang.Thread.State: TIMED_WAITING (sleeping)`,
        `        at java.lang.Thread.sleep(Native Method)`,
        `        at org.quantumcore.cluster.Heartbeat.run(Heartbeat.java:45)`,
        `\n"HikariPool-1 connection adder" #18 daemon prio=5 os_prio=0 cpu=0.89ms elapsed=1198.50s tid=0x00007f8c8c12b000 nid=0x1a1c waiting on condition [0x00007f8c909fc000]`,
        `   java.lang.Thread.State: WAITING (parking)`,
        `        at sun.misc.Unsafe.park(Native Method)`,
        `        at java.util.concurrent.locks.LockSupport.park(LockSupport.java:175)`,
        `\nFound 0 deadlock conditions.`
      ].join('\n');

      setThreadDump(dump);
      setIsActionLoading(null);
      onLogAction(`SUCCESS: Thread dump compiled for node "${node.id}".`);
    }, 1200);
  };

  return (
    <div className="grid gap-6 md:grid-cols-3">
      {/* Node Grid List */}
      <Card className="md:col-span-2 border-slate-200 dark:border-slate-800">
        <CardHeader>
          <CardTitle className="text-base font-bold">Cluster Node Topology</CardTitle>
          <CardDescription>
            Interactive map of active cluster nodes, microservices, and database replicas.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            {nodes.map((node) => {
              const isSelected = selectedNode?.id === node.id;
              let statusColor = 'bg-emerald-500';
              if (node.status === 'DEGRADED') statusColor = 'bg-amber-500';
              if (node.status === 'UNHEALTHY') statusColor = 'bg-rose-500';
              if (node.status === 'DRAINING') statusColor = 'bg-blue-500 animate-pulse';

              return (
                <div
                  key={node.id}
                  onClick={() => setSelectedNode(node)}
                  className={cn(
                    "p-4 rounded-xl border transition-all duration-200 cursor-pointer flex flex-col justify-between space-y-3",
                    isSelected
                      ? "border-emerald-500 bg-emerald-500/5 dark:bg-emerald-500/10 shadow-md"
                      : "border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-950"
                  )}
                >
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className={cn("h-2 w-2 rounded-full", statusColor)} />
                        <span className="font-bold text-xs text-slate-900 dark:text-slate-100">{node.name}</span>
                      </div>
                      <span className="font-mono text-[10px] text-muted-foreground block">{node.id} • {node.ipAddress}</span>
                    </div>
                    <Badge variant="secondary" className="text-[9px] font-semibold tracking-wider uppercase">
                      {node.type}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-center bg-slate-50 dark:bg-slate-900/50 p-2 rounded-lg border border-slate-100 dark:border-slate-800/50">
                    <div className="space-y-0.5">
                      <span className="text-[9px] text-muted-foreground block">CPU Load</span>
                      <span className="text-xs font-bold font-mono text-slate-900 dark:text-slate-100">
                        {node.cpuUsage}%
                      </span>
                    </div>
                    <div className="space-y-0.5 border-l border-slate-200 dark:border-slate-800">
                      <span className="text-[9px] text-muted-foreground block">Memory</span>
                      <span className="text-xs font-bold font-mono text-slate-900 dark:text-slate-100">
                        {node.memoryUsage}%
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                    <span className="flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      {node.uptime}
                    </span>
                    <span className="font-mono">{node.region}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Node Inspector Panel */}
      <div className="space-y-6">
        <Card className="border-slate-200 dark:border-slate-800">
          <CardHeader>
            <CardTitle className="text-sm font-bold">Node Inspector</CardTitle>
            <CardDescription className="text-xs">
              Select a node from the topology map to inspect real-time telemetry and execute administrative actions.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {selectedNode ? (
              <div className="space-y-4">
                <div className="bg-slate-50 dark:bg-slate-900 p-3.5 rounded-lg border border-slate-100 dark:border-slate-800 text-xs space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Node Name:</span>
                    <span className="font-bold text-slate-900 dark:text-slate-100">{selectedNode.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">IP Address:</span>
                    <span className="font-mono font-semibold">{selectedNode.ipAddress}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Active Threads:</span>
                    <span className="font-mono font-semibold">{selectedNode.activeThreads}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Runtime Version:</span>
                    <span className="font-mono font-semibold">{selectedNode.version}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Status:</span>
                    <Badge variant="outline" className="text-[9px] font-bold uppercase">
                      {selectedNode.status}
                    </Badge>
                  </div>
                </div>

                {/* Sparkline Chart */}
                <div className="space-y-1.5">
                  <span className="text-[10px] text-muted-foreground font-semibold block">CPU & Memory History (10m)</span>
                  <div className="h-24 w-full opacity-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={selectedNode.metricsHistory} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                        <defs>
                          <linearGradient id="cpuGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                            <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                          </linearGradient>
                          <linearGradient id="memGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2} />
                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <Area type="monotone" dataKey="cpu" stroke="#10b981" strokeWidth={1.5} fill="url(#cpuGrad)" name="CPU" />
                        <Area type="monotone" dataKey="memory" stroke="#3b82f6" strokeWidth={1.5} fill="url(#memGrad)" name="Memory" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Node Actions */}
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 dark:border-slate-800/50">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleRestartNode(selectedNode.id)}
                    disabled={!!isActionLoading}
                    className="h-8 text-xs border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    <RefreshCw className={cn("mr-1.5 h-3.5 w-3.5", isActionLoading === 'RESTART' && "animate-spin text-emerald-500")} />
                    Restart Node
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDrainNode(selectedNode.id)}
                    disabled={!!isActionLoading}
                    className="h-8 text-xs border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    <Pause className={cn("mr-1.5 h-3.5 w-3.5", isActionLoading === 'DRAIN' && "text-blue-500")} />
                    {selectedNode.status === 'DRAINING' ? 'Activate Node' : 'Drain Traffic'}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleTriggerThreadDump(selectedNode)}
                    disabled={!!isActionLoading}
                    className="h-8 text-xs border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 col-span-2"
                  >
                    <Terminal className="mr-1.5 h-3.5 w-3.5 text-slate-500" />
                    Trigger Thread Dump
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-xs text-muted-foreground">
                No node selected. Click on any node in the topology map to inspect.
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Thread Dump Dialog */}
      <Dialog open={!!threadDump} onOpenChange={(open) => !open && setThreadDump(null)}>
        <DialogContent className="max-w-3xl bg-slate-950 text-slate-100 border-slate-800 font-mono p-0 overflow-hidden shadow-2xl">
          <DialogHeader className="px-4 py-3 border-b border-slate-800 flex flex-row items-center justify-between space-y-0 bg-slate-900">
            <div className="flex items-center space-x-2">
              <Terminal className="h-4 w-4 text-emerald-400" />
              <DialogTitle className="text-sm font-bold text-slate-200">Diagnostic Thread Dump</DialogTitle>
            </div>
          </DialogHeader>
          <div className="p-4 h-[400px] overflow-y-auto text-xs leading-relaxed scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent">
            <pre className="text-slate-300 whitespace-pre-wrap break-all">{threadDump}</pre>
          </div>
          <div className="border-t border-slate-800 bg-slate-900 p-3 flex justify-end">
            <Button
              size="sm"
              onClick={() => setThreadDump(null)}
              className="bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold h-8 px-4"
            >
              Close Dump
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

// ============================================================================
// 14. BACKUP & DISASTER RECOVERY MANAGER
// ============================================================================

export type BackupType = 'FULL' | 'INCREMENTAL' | 'CONFIG';
export type BackupStatus = 'COMPLETED' | 'FAILED' | 'IN_PROGRESS' | 'PENDING';

export interface BackupJob {
  id: string;
  timestamp: string;
  type: BackupType;
  status: BackupStatus;
  sizeBytes: number;
  checksum: string;
  storageProvider: 'AWS_S3' | 'GCS' | 'AZURE_BLOB';
  durationMs: number;
}

const INITIAL_BACKUPS: BackupJob[] = [
  {
    id: 'bak-full-1001',
    timestamp: new Date(Date.now() - 86400000 * 7).toISOString(),
    type: 'FULL',
    status: 'COMPLETED',
    sizeBytes: 542850000, // ~517 MB
    checksum: 'sha256:8f3c2d1e0a9b8c7d6e5f4a3b2c1d0e9f8a7b6c5d4e3f2a1b0c9d8e7f6a5b4c3d',
    storageProvider: 'AWS_S3',
    durationMs: 45200,
  },
  {
    id: 'bak-inc-1002',
    timestamp: new Date(Date.now() - 86400000 * 6).toISOString(),
    type: 'INCREMENTAL',
    status: 'COMPLETED',
    sizeBytes: 12450000, // ~11.8 MB
    checksum: 'sha256:7e6d5c4b3a2f1e0d9c8b7a6f5e4d3c2b1a0f9e8d7c6b5a4f3e2d1c0b9a8f7e6d',
    storageProvider: 'AWS_S3',
    durationMs: 4200,
  },
  {
    id: 'bak-inc-1003',
    timestamp: new Date(Date.now() - 86400000 * 5).toISOString(),
    type: 'INCREMENTAL',
    status: 'COMPLETED',
    sizeBytes: 14890000,
    checksum: 'sha256:6d5c4b3a2f1e0d9c8b7a6f5e4d3c2b1a0f9e8d7c6b5a4f3e2d1c0b9a8f7e6d5c',
    storageProvider: 'AWS_S3',
    durationMs: 4800,
  },
  {
    id: 'bak-cfg-1004',
    timestamp: new Date(Date.now() - 86400000 * 4).toISOString(),
    type: 'CONFIG',
    status: 'COMPLETED',
    sizeBytes: 450000, // ~450 KB
    checksum: 'sha256:5c4b3a2f1e0d9c8b7a6f5e4d3c2b1a0f9e8d7c6b5a4f3e2d1c0b9a8f7e6d5c4b',
    storageProvider: 'GCS',
    durationMs: 1200,
  },
];

export const BackupManagerTab: React.FC<{ onLogAction: (message: string) => void }> = ({ onLogAction }) => {
  const [backups, setBackups] = useState<BackupJob[]>(INITIAL_BACKUPS);
  const [isBackingUp, setIsBackingUp] = useState(false);
  const [backupProgress, setBackupProgress] = useState(0);
  const [backupStep, setBackupStep] = useState('');
  const [isRestoring, setIsRestoring] = useState<string | null>(null);

  const handleTriggerBackup = (type: BackupType) => {
    setIsBackingUp(true);
    setBackupProgress(0);
    setBackupStep('Initializing database snapshot...');
    onLogAction(`BACKUP: Initiating on-demand ${type} backup job...`);

    const steps = [
      { progress: 20, step: 'Locking database tables (read-only replica)...' },
      { progress: 45, step: 'Streaming compressed binary payload to AWS S3...' },
      { progress: 75, step: 'Verifying cryptographic SHA-256 checksum...' },
      { progress: 90, step: 'Releasing database replica locks...' },
      { progress: 100, step: 'Backup job completed successfully.' },
    ];

    let currentStepIdx = 0;
    const interval = setInterval(() => {
      if (currentStepIdx < steps.length) {
        const current = steps[currentStepIdx];
        setBackupProgress(current.progress);
        setBackupStep(current.step);
        onLogAction(`BACKUP PROGRESS: ${current.step} (${current.progress}%)`);
        currentStepIdx++;
      } else {
        clearInterval(interval);
        const newBackup: BackupJob = {
          id: `bak-${type.toLowerCase()}-${Math.floor(1000 + Math.random() * 9000)}`,
          timestamp: new Date().toISOString(),
          type,
          status: 'COMPLETED',
          sizeBytes: type === 'FULL' ? 550000000 : type === 'INCREMENTAL' ? 15000000 : 480000,
          checksum: `sha256:${Math.random().toString(16).substring(2, 15)}${Math.random().toString(16).substring(2, 15)}`,
          storageProvider: 'AWS_S3',
          durationMs: type === 'FULL' ? 48000 : 5000,
        };
        setBackups((prev) => [newBackup, ...prev]);
        setIsBackingUp(false);
        onLogAction(`SUCCESS: Backup job "${newBackup.id}" successfully archived to secure cloud storage.`);
      }
    }, 1500);
  };

  const handleRestoreDryRun = (backupId: string) => {
    setIsRestoring(backupId);
    onLogAction(`RESTORE DRY-RUN: Initiating integrity verification for backup "${backupId}"...`);

    setTimeout(() => {
      setIsRestoring(null);
      onLogAction(`SUCCESS: Restore dry-run completed for backup "${backupId}". Cryptographic checksum matches. Archive is fully restorable.`);
      alert(`Dry-run verification successful for backup ${backupId}.\n\nAll checksums verified. Database schema and data structures are intact.`);
    }, 2500);
  };

  return (
    <div className="grid gap-6 md:grid-cols-3">
      {/* Backup History Table */}
      <Card className="md:col-span-2 border-slate-200 dark:border-slate-800">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 border-b border-slate-100 dark:border-slate-800/50">
          <div className="space-y-1">
            <CardTitle className="text-base font-bold">Backup Archive Registry</CardTitle>
            <CardDescription>
              Historical ledger of automated and manual database snapshots.
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="pt-6 space-y-4">
          <div className="border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden">
            <Table>
              <TableHeader className="bg-slate-50 dark:bg-slate-900">
                <TableRow>
                  <TableHead>Backup ID</TableHead>
                  <TableHead>Timestamp</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead className="text-right">Size</TableHead>
                  <TableHead>Storage</TableHead>
                  <TableHead className="w-[100px] text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {backups.map((bak) => (
                  <TableRow key={bak.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors">
                    <TableCell className="font-mono text-xs font-bold">{bak.id}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {new Date(bak.timestamp).toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="text-[9px] font-semibold px-1.5 py-0">
                        {bak.type}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-mono text-xs">
                      {formatBytes(bak.sizeBytes)}
                    </TableCell>
                    <TableCell className="text-xs font-semibold">
                      {bak.storageProvider}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRestoreDryRun(bak.id)}
                        disabled={!!isRestoring}
                        className="h-7 text-xs text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
                      >
                        {isRestoring === bak.id ? (
                          <RefreshCw className="h-3.5 w-3.5 animate-spin text-emerald-500" />
                        ) : (
                          'Verify'
                        )}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Backup Control Panel */}
      <div className="space-y-6">
        <Card className="border-slate-200 dark:border-slate-800">
          <CardHeader>
            <CardTitle className="text-sm font-bold">Disaster Recovery Controls</CardTitle>
            <CardDescription className="text-xs">
              Trigger manual database snapshots or configure automated backup schedules.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {isBackingUp ? (
              <div className="space-y-3 bg-slate-50 dark:bg-slate-900 p-4 rounded-lg border border-slate-100 dark:border-slate-800">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="truncate">{backupStep}</span>
                  <span className="font-mono text-emerald-500">{backupProgress}%</span>
                </div>
                <Progress value={backupProgress} className="h-2" />
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-2">
                <Button
                  onClick={() => handleTriggerBackup('FULL')}
                  className="bg-slate-900 hover:bg-slate-800 text-white dark:bg-slate-100 dark:hover:bg-slate-200 dark:text-slate-950 h-9 text-xs font-bold"
                >
                  <Database className="mr-1.5 h-4 w-4" />
                  Trigger Full Backup
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleTriggerBackup('INCREMENTAL')}
                  className="border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 h-9 text-xs"
                >
                  <RefreshCw className="mr-1.5 h-4 w-4 text-slate-500" />
                  Trigger Incremental Backup
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleTriggerBackup('CONFIG')}
                  className="border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 h-9 text-xs"
                >
                  <Settings className="mr-1.5 h-4 w-4 text-slate-500" />
                  Backup System Config
                </Button>
              </div>
            )}

            <div className="border-t border-slate-100 dark:border-slate-800/50 pt-4 space-y-3">
              <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">Automated Backup Schedule</h4>
              <div className="bg-slate-50 dark:bg-slate-900 p-3 rounded-lg border border-slate-100 dark:border-slate-800 text-xs space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Full Backup:</span>
                  <span className="font-mono font-semibold">Every Sunday @ 02:00 UTC</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Incremental:</span>
                  <span className="font-mono font-semibold">Every 4 Hours</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Retention Policy:</span>
                  <span className="font-semibold">30 Days (S3 Glacier transition)</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};// ============================================================================
// 15. API KEY MANAGEMENT & DEVELOPER CREDENTIALS
// ============================================================================

export type ApiKeyStatus = 'ACTIVE' | 'REVOKED' | 'EXPIRED';
export type ApiKeyPermission = 'READ' | 'WRITE' | 'ADMIN' | 'BILLING';

export interface ApiKey {
  id: string;
  name: string;
  prefix: string;
  secretMasked: string;
  status: ApiKeyStatus;
  permissions: ApiKeyPermission[];
  rateLimitRps: number;
  createdAt: string;
  expiresAt: string | null;
  lastUsedAt: string | null;
  totalCalls: number;
}

const INITIAL_API_KEYS: ApiKey[] = [
  {
    id: 'key-101',
    name: 'Production Sync Service',
    prefix: 'qk_live_7f3a',
    secretMasked: '••••••••••••••••••••••••••••••••7f3a',
    status: 'ACTIVE',
    permissions: ['READ', 'WRITE'],
    rateLimitRps: 100,
    createdAt: new Date(Date.now() - 86400000 * 60).toISOString(),
    expiresAt: null,
    lastUsedAt: new Date(Date.now() - 120000).toISOString(),
    totalCalls: 1420500,
  },
  {
    id: 'key-102',
    name: 'Stripe Webhook Relay',
    prefix: 'qk_live_9a2b',
    secretMasked: '••••••••••••••••••••••••••••••••9a2b',
    status: 'ACTIVE',
    permissions: ['WRITE'],
    rateLimitRps: 50,
    createdAt: new Date(Date.now() - 86400000 * 30).toISOString(),
    expiresAt: new Date(Date.now() + 86400000 * 335).toISOString(),
    lastUsedAt: new Date(Date.now() - 3600000).toISOString(),
    totalCalls: 485200,
  },
  {
    id: 'key-103',
    name: 'Legacy Analytics Ingestion',
    prefix: 'qk_live_3c4d',
    secretMasked: '••••••••••••••••••••••••••••••••3c4d',
    status: 'EXPIRED',
    permissions: ['READ'],
    rateLimitRps: 10,
    createdAt: new Date(Date.now() - 86400000 * 180).toISOString(),
    expiresAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    lastUsedAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    totalCalls: 98400,
  },
  {
    id: 'key-104',
    name: 'Temporary Compliance Auditor',
    prefix: 'qk_live_1e2f',
    secretMasked: '••••••••••••••••••••••••••••••••1e2f',
    status: 'REVOKED',
    permissions: ['READ', 'BILLING'],
    rateLimitRps: 5,
    createdAt: new Date(Date.now() - 86400000 * 15).toISOString(),
    expiresAt: new Date(Date.now() + 86400000 * 15).toISOString(),
    lastUsedAt: new Date(Date.now() - 86400000 * 12).toISOString(),
    totalCalls: 1250,
  }
];

interface ApiKeyManagerTabProps {
  onLogAction: (message: string) => void;
}

export const ApiKeyManagerTab: React.FC<ApiKeyManagerTabProps> = ({ onLogAction }) => {
  const [keys, setKeys] = useState<ApiKey[]>(INITIAL_API_KEYS);
  const [isCreating, setIsCreating] = useState(false);
  const [newKeyName, setNewKeyName] = useState('');
  const [newKeyPermissions, setNewKeyPermissions] = useState<ApiKeyPermission[]>(['READ']);
  const [newKeyRateLimit, setNewKeyRateLimit] = useState(100);
  const [generatedKey, setGeneratedKey] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleCreateKey = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!newKeyName.trim()) {
      setError('API Key name is required.');
      return;
    }

    const randomHex = Array.from({ length: 32 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
    const rawKey = `qk_live_${randomHex}`;
    const prefix = rawKey.substring(0, 12);
    const secretMasked = `••••••••••••••••••••••••••••••••${randomHex.substring(28)}`;

    const newKey: ApiKey = {
      id: `key-${Math.floor(1000 + Math.random() * 9000)}`,
      name: newKeyName,
      prefix,
      secretMasked,
      status: 'ACTIVE',
      permissions: newKeyPermissions,
      rateLimitRps: newKeyRateLimit,
      createdAt: new Date().toISOString(),
      expiresAt: null,
      lastUsedAt: null,
      totalCalls: 0,
    };

    setKeys((prev) => [newKey, ...prev]);
    setGeneratedKey(rawKey);
    onLogAction(`API KEY CREATED: Generated new credential "${newKeyName}" with permissions: [${newKeyPermissions.join(', ')}].`);
  };

  const handleRevokeKey = (id: string) => {
    const targetKey = keys.find((k) => k.id === id);
    if (!targetKey) return;

    if (confirm(`Are you absolutely sure you want to revoke the API key "${targetKey.name}"? This action is irreversible and will immediately block all associated traffic.`)) {
      setKeys((prev) =>
        prev.map((k) => (k.id === id ? { ...k, status: 'REVOKED' as const } : k))
      );
      onLogAction(`API KEY REVOKED: Revoked credential "${targetKey.name}" (${id}).`);
    }
  };

  const handleTogglePermission = (perm: ApiKeyPermission) => {
    setNewKeyPermissions((prev) =>
      prev.includes(perm) ? prev.filter((p) => p !== perm) : [...prev, perm]
    );
  };

  const handleCloseCreationModal = () => {
    setIsCreating(false);
    setNewKeyName('');
    setNewKeyPermissions(['READ']);
    setNewKeyRateLimit(100);
    setGeneratedKey(null);
    setError(null);
  };

  return (
    <div className="grid gap-6 md:grid-cols-3">
      {/* API Keys Table */}
      <Card className="md:col-span-2 border-slate-200 dark:border-slate-800">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 border-b border-slate-100 dark:border-slate-800/50">
          <div className="space-y-1">
            <CardTitle className="text-base font-bold">Developer API Credentials</CardTitle>
            <CardDescription>
              Manage secure access tokens used by external microservices and partner integrations.
            </CardDescription>
          </div>
          <Button
            onClick={() => setIsCreating(true)}
            className="bg-emerald-600 hover:bg-emerald-500 text-white h-8 text-xs"
          >
            <Plus className="mr-1.5 h-4 w-4" />
            Generate Key
          </Button>
        </CardHeader>
        <CardContent className="pt-6 space-y-4">
          <div className="border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden">
            <Table>
              <TableHeader className="bg-slate-50 dark:bg-slate-900">
                <TableRow>
                  <TableHead>Key Name</TableHead>
                  <TableHead>Permissions</TableHead>
                  <TableHead className="text-right">Rate Limit</TableHead>
                  <TableHead className="text-right">Total Calls</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[80px] text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {keys.map((key) => (
                  <TableRow key={key.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors">
                    <TableCell className="space-y-1">
                      <div className="font-bold text-xs text-slate-900 dark:text-slate-100">
                        {key.name}
                      </div>
                      <div className="font-mono text-[10px] text-muted-foreground">
                        {key.prefix}...
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {key.permissions.map((perm) => (
                          <Badge key={perm} variant="secondary" className="text-[9px] font-semibold px-1.5 py-0">
                            {perm}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell className="text-right font-mono text-xs">
                      {key.rateLimitRps} RPS
                    </TableCell>
                    <TableCell className="text-right font-mono text-xs">
                      {formatNumber(key.totalCalls)}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={cn(
                          "font-bold text-[10px] px-1.5 py-0 uppercase",
                          key.status === 'ACTIVE' && "bg-emerald-500/10 text-emerald-700 border-emerald-500/20 dark:bg-emerald-500/20 dark:text-emerald-400",
                          key.status === 'EXPIRED' && "bg-amber-500/10 text-amber-700 border-amber-500/20 dark:bg-amber-500/20 dark:text-amber-400",
                          key.status === 'REVOKED' && "bg-rose-500/10 text-rose-700 border-rose-500/20 dark:bg-rose-500/20 dark:text-rose-400"
                        )}
                      >
                        {key.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRevokeKey(key.id)}
                        disabled={key.status === 'REVOKED'}
                        className="h-7 w-7 text-rose-500 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/20"
                        title="Revoke API Key"
                      >
                        <Lock className="h-3.5 w-3.5" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* API Key Usage Metrics */}
      <div className="space-y-6">
        <Card className="border-slate-200 dark:border-slate-800">
          <CardHeader>
            <CardTitle className="text-sm font-bold">Credential Security Policies</CardTitle>
            <CardDescription className="text-xs">
              Global security parameters enforced across all developer API keys.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-xs">
            <div className="bg-slate-50 dark:bg-slate-900 p-3.5 rounded-lg border border-slate-100 dark:border-slate-800 space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Key Rotation Policy:</span>
                <span className="font-semibold">Every 180 Days</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Default Rate Limit:</span>
                <span className="font-semibold">100 RPS</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Encryption Standard:</span>
                <span className="font-mono font-semibold">AES-256-GCM</span>
              </div>
            </div>
            <div className="text-muted-foreground leading-relaxed">
              All API keys are cryptographically hashed using SHA-256 before storage. The raw secret is only visible once upon generation.
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Create API Key Dialog */}
      <Dialog open={isCreating} onOpenChange={(open) => !open && handleCloseCreationModal()}>
        <DialogContent className="max-w-md border-slate-200 dark:border-slate-800">
          <DialogHeader>
            <div className="flex items-center space-x-2">
              <PlugZap className="h-5 w-5 text-emerald-500" />
              <DialogTitle className="text-lg font-bold">Generate API Key</DialogTitle>
            </div>
            <DialogDescription>
              Create a new secure credential to authenticate external API requests.
            </DialogDescription>
          </DialogHeader>

          {generatedKey ? (
            <div className="space-y-4 py-2">
              <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/30 p-3 rounded-lg text-xs text-amber-800 dark:text-amber-400 flex items-start space-x-2">
                <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
                <span>
                  Make sure to copy your API key now. You won't be able to see it again for security reasons.
                </span>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-500">Generated Secret Key</label>
                <div className="flex space-x-2">
                  <Input
                    readOnly
                    value={generatedKey}
                    className="font-mono text-xs bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 flex-1"
                  />
                  <Button
                    onClick={() => {
                      navigator.clipboard.writeText(generatedKey);
                      alert('API Key copied to clipboard.');
                    }}
                    className="bg-slate-900 hover:bg-slate-800 text-white dark:bg-slate-100 dark:hover:bg-slate-200 dark:text-slate-950 text-xs px-3"
                  >
                    Copy
                  </Button>
                </div>
              </div>
              <DialogFooter className="pt-2">
                <Button onClick={handleCloseCreationModal} className="bg-emerald-600 hover:bg-emerald-500 text-white w-full">
                  Done
                </Button>
              </DialogFooter>
            </div>
          ) : (
            <form onSubmit={handleCreateKey} className="space-y-4 py-2">
              <div className="space-y-1.5">
                <label htmlFor="key-name" className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                  Key Name
                </label>
                <Input
                  id="key-name"
                  value={newKeyName}
                  onChange={(e) => setNewKeyName(e.target.value)}
                  placeholder="e.g., Production Sync Service"
                  className={cn(error && "border-rose-500 focus-visible:ring-rose-500")}
                />
                {error && (
                  <p className="text-xs text-rose-500 flex items-center mt-1">
                    <AlertCircle className="h-3 w-3 mr-1" />
                    {error}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-900 dark:text-slate-100 block">
                  Permissions
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {(['READ', 'WRITE', 'ADMIN', 'BILLING'] as ApiKeyPermission[]).map((perm) => {
                    const isChecked = newKeyPermissions.includes(perm);
                    return (
                      <div
                        key={perm}
                        onClick={() => handleTogglePermission(perm)}
                        className={cn(
                          "flex items-center space-x-2 p-2 rounded-md cursor-pointer border transition-colors text-xs font-semibold",
                          isChecked
                            ? "bg-emerald-500/5 border-emerald-500/20 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400"
                            : "border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900"
                        )}
                      >
                        <div className={cn(
                          "flex h-4 w-4 items-center justify-center rounded border text-current",
                          isChecked ? "border-emerald-500 bg-emerald-500 text-white" : "border-slate-300 dark:border-slate-700"
                        )}>
                          {isChecked && <Check className="h-3 w-3 stroke-[3]" />}
                        </div>
                        <span>{perm}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="key-rate-limit" className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                  Rate Limit (Requests Per Second)
                </label>
                <Input
                  id="key-rate-limit"
                  type="number"
                  min={1}
                  max={1000}
                  value={newKeyRateLimit}
                  onChange={(e) => setNewKeyRateLimit(parseInt(e.target.value) || 100)}
                  className="font-mono text-xs"
                />
              </div>

              <DialogFooter className="pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCloseCreationModal}
                  className="border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Cancel
                </Button>
                <Button type="submit" className="bg-emerald-600 hover:bg-emerald-500 text-white">
                  Generate Key
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

// ============================================================================
// 16. MULTI-TENANT MANAGEMENT & RESOURCE QUOTAS
// ============================================================================

export type TenantStatus = 'ACTIVE' | 'SUSPENDED' | 'PROVISIONING';
export type TenantTier = 'FREE' | 'GROWTH' | 'ENTERPRISE';

export interface ResourceQuotas {
  maxUsers: number;
  maxStorageGB: number;
  maxApiRequestsPerMonth: number;
}

export interface Tenant {
  id: string;
  name: string;
  domain: string;
  status: TenantStatus;
  tier: TenantTier;
  quotas: ResourceQuotas;
  usage: {
    users: number;
    storageGB: number;
    apiRequestsThisMonth: number;
  };
  createdAt: string;
}

const INITIAL_TENANTS: Tenant[] = [
  {
    id: 'tenant-alpha',
    name: 'Alpha Corp',
    domain: 'alpha.quantumcore.io',
    status: 'ACTIVE',
    tier: 'ENTERPRISE',
    quotas: { maxUsers: 5000, maxStorageGB: 1000, maxApiRequestsPerMonth: 10000000 },
    usage: { users: 3420, storageGB: 642.5, apiRequestsThisMonth: 7850000 },
    createdAt: new Date(Date.now() - 86400000 * 180).toISOString(),
  },
  {
    id: 'tenant-beta',
    name: 'Beta Labs',
    domain: 'beta.quantumcore.io',
    status: 'ACTIVE',
    tier: 'GROWTH',
    quotas: { maxUsers: 500, maxStorageGB: 100, maxApiRequestsPerMonth: 1000000 },
    usage: { users: 412, storageGB: 82.4, apiRequestsThisMonth: 920000 },
    createdAt: new Date(Date.now() - 86400000 * 90).toISOString(),
  },
  {
    id: 'tenant-gamma',
    name: 'Gamma Tech',
    domain: 'gamma.quantumcore.io',
    status: 'SUSPENDED',
    tier: 'FREE',
    quotas: { maxUsers: 50, maxStorageGB: 10, maxApiRequestsPerMonth: 100000 },
    usage: { users: 48, storageGB: 9.8, apiRequestsThisMonth: 99500 },
    createdAt: new Date(Date.now() - 86400000 * 30).toISOString(),
  },
  {
    id: 'tenant-delta',
    name: 'Delta Systems',
    domain: 'delta.quantumcore.io',
    status: 'PROVISIONING',
    tier: 'GROWTH',
    quotas: { maxUsers: 500, maxStorageGB: 100, maxApiRequestsPerMonth: 1000000 },
    usage: { users: 0, storageGB: 0, apiRequestsThisMonth: 0 },
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
  }
];

interface TenantManagerTabProps {
  onLogAction: (message: string) => void;
}

export const TenantManagerTab: React.FC<TenantManagerTabProps> = ({ onLogAction }) => {
  const [tenants, setTenants] = useState<Tenant[]>(INITIAL_TENANTS);
  const [selectedTenant, setSelectedTenant] = useState<Tenant | null>(null);
  const [isEditingQuotas, setIsEditingQuotas] = useState(false);
  const [editMaxUsers, setEditMaxUsers] = useState(0);
  const [editMaxStorage, setEditMaxStorage] = useState(0);
  const [editMaxRequests, setEditMaxRequests] = useState(0);

  const handleToggleTenantStatus = (id: string) => {
    setTenants((prev) =>
      prev.map((t) => {
        if (t.id === id) {
          const nextStatus: TenantStatus = t.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE';
          onLogAction(`TENANT STATUS UPDATE: Set status of tenant "${t.name}" to ${nextStatus}.`);
          return { ...t, status: nextStatus };
        }
        return t;
      })
    );
    if (selectedTenant?.id === id) {
      setSelectedTenant((prev) => prev ? { ...prev, status: prev.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE' } : null);
    }
  };

  const handleOpenQuotaEdit = (tenant: Tenant) => {
    setSelectedTenant(tenant);
    setEditMaxUsers(tenant.quotas.maxUsers);
    setEditMaxStorage(tenant.quotas.maxStorageGB);
    setEditMaxRequests(tenant.quotas.maxApiRequestsPerMonth);
    setIsEditingQuotas(true);
  };

  const handleSaveQuotas = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTenant) return;

    setTenants((prev) =>
      prev.map((t) => {
        if (t.id === selectedTenant.id) {
          const updatedQuotas: ResourceQuotas = {
            maxUsers: editMaxUsers,
            maxStorageGB: editMaxStorage,
            maxApiRequestsPerMonth: editMaxRequests,
          };
          onLogAction(`TENANT QUOTA UPDATE: Adjusted resource quotas for tenant "${t.name}".`);
          return { ...t, quotas: updatedQuotas };
        }
        return t;
      })
    );

    setIsEditingQuotas(false);
    setSelectedTenant(null);
  };

  return (
    <div className="grid gap-6 md:grid-cols-3">
      {/* Tenants Table */}
      <Card className="md:col-span-2 border-slate-200 dark:border-slate-800">
        <CardHeader>
          <CardTitle className="text-base font-bold">Multi-Tenant Registry</CardTitle>
          <CardDescription>
            Monitor tenant resource utilization, subscription tiers, and enforce global usage quotas.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden">
            <Table>
              <TableHeader className="bg-slate-50 dark:bg-slate-900">
                <TableRow>
                  <TableHead>Tenant Name</TableHead>
                  <TableHead>Tier</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">API Usage (Month)</TableHead>
                  <TableHead className="w-[100px] text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tenants.map((tenant) => (
                  <TableRow key={tenant.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors">
                    <TableCell className="space-y-1">
                      <div className="font-bold text-xs text-slate-900 dark:text-slate-100">
                        {tenant.name}
                      </div>
                      <div className="font-mono text-[10px] text-muted-foreground">
                        {tenant.domain}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="text-[9px] font-semibold px-1.5 py-0">
                        {tenant.tier}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={cn(
                          "font-bold text-[10px] px-1.5 py-0 uppercase",
                          tenant.status === 'ACTIVE' && "bg-emerald-500/10 text-emerald-700 border-emerald-500/20 dark:bg-emerald-500/20 dark:text-emerald-400",
                          tenant.status === 'PROVISIONING' && "bg-blue-500/10 text-blue-700 border-blue-500/20 dark:bg-blue-500/20 dark:text-blue-400",
                          tenant.status === 'SUSPENDED' && "bg-rose-500/10 text-rose-700 border-rose-500/20 dark:bg-rose-500/20 dark:text-rose-400"
                        )}
                      >
                        {tenant.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-mono text-xs">
                      {formatNumber(tenant.usage.apiRequestsThisMonth)} / {formatNumber(tenant.quotas.maxApiRequestsPerMonth)}
                    </TableCell>
                    <TableCell className="text-right space-x-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleOpenQuotaEdit(tenant)}
                        className="h-7 w-7 text-slate-500 hover:text-slate-900 dark:hover:text-slate-100"
                        title="Edit Quotas"
                      >
                        <Sliders className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleToggleTenantStatus(tenant.id)}
                        disabled={tenant.status === 'PROVISIONING'}
                        className={cn(
                          "h-7 w-7",
                          tenant.status === 'ACTIVE' ? "text-rose-500 hover:text-rose-700" : "text-emerald-500 hover:text-emerald-700"
                        )}
                        title={tenant.status === 'ACTIVE' ? 'Suspend Tenant' : 'Activate Tenant'}
                      >
                        {tenant.status === 'ACTIVE' ? <Lock className="h-3.5 w-3.5" /> : <Unlock className="h-3.5 w-3.5" />}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Resource Utilization Panel */}
      <div className="space-y-6">
        <Card className="border-slate-200 dark:border-slate-800">
          <CardHeader>
            <CardTitle className="text-sm font-bold">Global Tenant Quotas</CardTitle>
            <CardDescription className="text-xs">
              Enforce system-wide resource limits to prevent noisy-neighbor performance degradation.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-xs">
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-[10px] font-semibold text-muted-foreground mb-1">
                  <span>Total Storage Allocated</span>
                  <span>734.7 GB / 1210 GB</span>
                </div>
                <Progress value={(734.7 / 1210) * 100} className="h-1.5" />
              </div>
              <div>
                <div className="flex justify-between text-[10px] font-semibold text-muted-foreground mb-1">
                  <span>Total API Requests (Month)</span>
                  <span>8.86M / 12.1M</span>
                </div>
                <Progress value={(8.86 / 12.1) * 100} className="h-1.5" />
              </div>
            </div>
            <div className="text-muted-foreground leading-relaxed pt-2 border-t border-slate-100 dark:border-slate-800/50">
              Quotas are evaluated in real-time at the API Gateway layer. Tenants exceeding limits will receive HTTP 429 Too Many Requests.
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Edit Quotas Dialog */}
      <Dialog open={isEditingQuotas} onOpenChange={(open) => !open && setIsEditingQuotas(false)}>
        <DialogContent className="max-w-md border-slate-200 dark:border-slate-800">
          <DialogHeader>
            <div className="flex items-center space-x-2">
              <Sliders className="h-5 w-5 text-emerald-500" />
              <DialogTitle className="text-lg font-bold">Adjust Resource Quotas</DialogTitle>
            </div>
            <DialogDescription>
              Modify resource limits for tenant: <span className="font-bold text-slate-900 dark:text-slate-100">{selectedTenant?.name}</span>
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSaveQuotas} className="space-y-4 py-2">
            <div className="space-y-1.5">
              <label htmlFor="quota-users" className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                Maximum Users
              </label>
              <Input
                id="quota-users"
                type="number"
                value={editMaxUsers}
                onChange={(e) => setEditMaxUsers(parseInt(e.target.value) || 0)}
                className="font-mono text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="quota-storage" className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                Maximum Storage (GB)
              </label>
              <Input
                id="quota-storage"
                type="number"
                value={editMaxStorage}
                onChange={(e) => setEditMaxStorage(parseInt(e.target.value) || 0)}
                className="font-mono text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="quota-requests" className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                Max API Requests Per Month
              </label>
              <Input
                id="quota-requests"
                type="number"
                value={editMaxRequests}
                onChange={(e) => setEditMaxRequests(parseInt(e.target.value) || 0)}
                className="font-mono text-xs"
              />
            </div>

            <DialogFooter className="pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsEditingQuotas(false)}
                className="border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Cancel
              </Button>
              <Button type="submit" className="bg-emerald-600 hover:bg-emerald-500 text-white">
                Save Quotas
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};// ============================================================================
// 17. CLUSTER LOAD BALANCER & TRAFFIC SHAPER
// ============================================================================

export type RoutingStrategy = 'ROUND_ROBIN' | 'LEAST_CONNECTIONS' | 'IP_HASH' | 'WEIGHTED';
export type CircuitBreakerStatus = 'CLOSED' | 'OPEN' | 'HALF_OPEN';

export interface RoutingTarget {
  id: string;
  nodeId: string;
  weight: number;
  activeConnections: number;
  healthy: boolean;
}

export interface LoadBalancerRule {
  id: string;
  pathPattern: string;
  strategy: RoutingStrategy;
  targets: RoutingTarget[];
  circuitBreaker: {
    enabled: boolean;
    failureThreshold: number;
    recoveryTimeoutMs: number;
    status: CircuitBreakerStatus;
  };
}

const INITIAL_LB_RULES: LoadBalancerRule[] = [
  {
    id: 'rule-auth',
    pathPattern: '/api/v1/auth/*',
    strategy: 'IP_HASH',
    targets: [
      { id: 'tgt-auth-1', nodeId: 'node-auth-01', weight: 50, activeConnections: 42, healthy: true },
      { id: 'tgt-auth-2', nodeId: 'node-gw-01', weight: 50, activeConnections: 38, healthy: true },
    ],
    circuitBreaker: {
      enabled: true,
      failureThreshold: 5,
      recoveryTimeoutMs: 15000,
      status: 'CLOSED',
    },
  },
  {
    id: 'rule-tx',
    pathPattern: '/api/v1/transactions/*',
    strategy: 'WEIGHTED',
    targets: [
      { id: 'tgt-tx-1', nodeId: 'node-db-primary', weight: 80, activeConnections: 124, healthy: true },
      { id: 'tgt-tx-2', nodeId: 'node-db-replica-01', weight: 20, activeConnections: 32, healthy: true },
    ],
    circuitBreaker: {
      enabled: true,
      failureThreshold: 3,
      recoveryTimeoutMs: 10000,
      status: 'CLOSED',
    },
  },
  {
    id: 'rule-analytics',
    pathPattern: '/api/v1/analytics/*',
    strategy: 'ROUND_ROBIN',
    targets: [
      { id: 'tgt-an-1', nodeId: 'node-worker-01', weight: 100, activeConnections: 64, healthy: true },
    ],
    circuitBreaker: {
      enabled: false,
      failureThreshold: 10,
      recoveryTimeoutMs: 30000,
      status: 'CLOSED',
    },
  },
];

interface TrafficShaperTabProps {
  onLogAction: (message: string) => void;
}

export const TrafficShaperTab: React.FC<TrafficShaperTabProps> = ({ onLogAction }) => {
  const [rules, setRules] = useState<LoadBalancerRule[]>(INITIAL_LB_RULES);
  const [selectedRule, setSelectedRule] = useState<LoadBalancerRule | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);

  const handleWeightChange = (ruleId: string, targetId: string, newWeight: number) => {
    setRules((prevRules) =>
      prevRules.map((rule) => {
        if (rule.id === ruleId) {
          const updatedTargets = rule.targets.map((tgt) =>
            tgt.id === targetId ? { ...tgt, weight: newWeight } : tgt
          );
          return { ...rule, targets: updatedTargets };
        }
        return rule;
      })
    );
  };

  const handleStrategyChange = (ruleId: string, strategy: RoutingStrategy) => {
    setRules((prevRules) =>
      prevRules.map((rule) => {
        if (rule.id === ruleId) {
          onLogAction(`LOAD BALANCER: Updated routing strategy for "${rule.pathPattern}" to ${strategy}.`);
          return { ...rule, strategy };
        }
        return rule;
      })
    );
  };

  const handleToggleCircuitBreaker = (ruleId: string) => {
    setRules((prevRules) =>
      prevRules.map((rule) => {
        if (rule.id === ruleId) {
          const nextState = !rule.circuitBreaker.enabled;
          onLogAction(`CIRCUIT BREAKER: ${nextState ? 'ENABLED' : 'DISABLED'} for path pattern "${rule.pathPattern}".`);
          return {
            ...rule,
            circuitBreaker: { ...rule.circuitBreaker, enabled: nextState },
          };
        }
        return rule;
      })
    );
  };

  const handleSimulateTrafficSpike = (ruleId: string) => {
    setIsSimulating(true);
    onLogAction(`TRAFFIC SHAPER: Simulating high-volume traffic spike on rule "${ruleId}"...`);

    setRules((prevRules) =>
      prevRules.map((rule) => {
        if (rule.id === ruleId) {
          const updatedTargets = rule.targets.map((tgt) => ({
            ...tgt,
            activeConnections: tgt.activeConnections * 3,
          }));
          const triggerBreaker = rule.circuitBreaker.enabled && Math.random() > 0.3;
          return {
            ...rule,
            targets: updatedTargets,
            circuitBreaker: {
              ...rule.circuitBreaker,
              status: triggerBreaker ? 'OPEN' as const : 'CLOSED' as const,
            },
          };
        }
        return rule;
      })
    );

    setTimeout(() => {
      setRules((prevRules) =>
        prevRules.map((rule) => {
          if (rule.id === ruleId) {
            const updatedTargets = rule.targets.map((tgt) => ({
              ...tgt,
              activeConnections: Math.floor(tgt.activeConnections / 3),
            }));
            return {
              ...rule,
              targets: updatedTargets,
              circuitBreaker: {
                ...rule.circuitBreaker,
                status: rule.circuitBreaker.status === 'OPEN' ? 'HALF_OPEN' as const : 'CLOSED' as const,
              },
            };
          }
          return rule;
        })
      );
      setIsSimulating(false);
      onLogAction(`TRAFFIC SHAPER: Traffic spike simulation completed. Circuit breaker status updated.`);
    }, 4000);
  };

  return (
    <div className="grid gap-6 md:grid-cols-3">
      {/* Load Balancer Rules List */}
      <Card className="md:col-span-2 border-slate-200 dark:border-slate-800">
        <CardHeader>
          <CardTitle className="text-base font-bold">Load Balancer & Traffic Shaper</CardTitle>
          <CardDescription>
            Configure path-based routing rules, adjust node weights, and manage active circuit breakers.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden">
            <Table>
              <TableHeader className="bg-slate-50 dark:bg-slate-900">
                <TableRow>
                  <TableHead>Path Pattern</TableHead>
                  <TableHead>Strategy</TableHead>
                  <TableHead>Targets</TableHead>
                  <TableHead>Circuit Breaker</TableHead>
                  <TableHead className="w-[100px] text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rules.map((rule) => (
                  <TableRow key={rule.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors">
                    <TableCell className="font-mono text-xs font-bold text-slate-900 dark:text-slate-100">
                      {rule.pathPattern}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" className="h-7 text-[10px] font-semibold px-2">
                            {rule.strategy}
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          {(['ROUND_ROBIN', 'LEAST_CONNECTIONS', 'IP_HASH', 'WEIGHTED'] as RoutingStrategy[]).map((strat) => (
                            <DropdownMenuItem key={strat} onClick={() => handleStrategyChange(rule.id, strat)} className="text-xs">
                              {strat}
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                    <TableCell className="text-xs">
                      <div className="space-y-1">
                        {rule.targets.map((tgt) => (
                          <div key={tgt.id} className="flex items-center justify-between space-x-4">
                            <span className="font-mono text-[10px] text-muted-foreground">{tgt.nodeId}</span>
                            <span className="font-semibold">{tgt.weight}% ({tgt.activeConnections} conn)</span>
                          </div>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={rule.circuitBreaker.enabled}
                          onCheckedChange={() => handleToggleCircuitBreaker(rule.id)}
                          className="scale-75"
                        />
                        <Badge
                          variant="outline"
                          className={cn(
                            "text-[9px] font-bold uppercase px-1.5 py-0",
                            rule.circuitBreaker.status === 'CLOSED' && "bg-emerald-500/10 text-emerald-700 border-emerald-500/20 dark:bg-emerald-500/20 dark:text-emerald-400",
                            rule.circuitBreaker.status === 'OPEN' && "bg-rose-500/10 text-rose-700 border-rose-500/20 dark:bg-rose-500/20 dark:text-rose-400 animate-pulse",
                            rule.circuitBreaker.status === 'HALF_OPEN' && "bg-amber-500/10 text-amber-700 border-amber-500/20 dark:bg-amber-500/20 dark:text-amber-400"
                          )}
                        >
                          {rule.circuitBreaker.status}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedRule(rule)}
                        className="h-7 text-xs text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
                      >
                        Configure
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Traffic Control Panel */}
      <div className="space-y-6">
        <Card className="border-slate-200 dark:border-slate-800">
          <CardHeader>
            <CardTitle className="text-sm font-bold">Traffic Control Panel</CardTitle>
            <CardDescription className="text-xs">
              Inspect and adjust routing weights for the selected path pattern.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {selectedRule ? (
              <div className="space-y-4">
                <div className="bg-slate-50 dark:bg-slate-900 p-3 rounded-lg border border-slate-100 dark:border-slate-800 text-xs space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Rule ID:</span>
                    <span className="font-bold">{selectedRule.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Path Pattern:</span>
                    <span className="font-mono font-semibold">{selectedRule.pathPattern}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Routing Strategy:</span>
                    <span className="font-semibold">{selectedRule.strategy}</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">Target Weights</h4>
                  {selectedRule.targets.map((tgt) => (
                    <div key={tgt.id} className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="font-mono text-muted-foreground">{tgt.nodeId}</span>
                        <span className="font-bold">{tgt.weight}%</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        step="5"
                        value={tgt.weight}
                        onChange={(e) => handleWeightChange(selectedRule.id, tgt.id, parseInt(e.target.value))}
                        className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                      />
                    </div>
                  ))}
                </div>

                <div className="pt-2 border-t border-slate-100 dark:border-slate-800/50">
                  <Button
                    onClick={() => handleSimulateTrafficSpike(selectedRule.id)}
                    disabled={isSimulating}
                    className="w-full bg-slate-900 hover:bg-slate-800 text-white dark:bg-slate-100 dark:hover:bg-slate-200 dark:text-slate-950 h-9 text-xs font-bold"
                  >
                    {isSimulating ? (
                      <>
                        <RefreshCw className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                        Simulating Spike...
                      </>
                    ) : (
                      <>
                        <Zap className="mr-1.5 h-4 w-4 text-amber-500" />
                        Simulate Traffic Spike
                      </>
                    )}
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-xs text-muted-foreground">
                No routing rule selected. Click "Configure" on any rule to adjust weights.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

// ============================================================================
// 18. SYSTEM METRICS HISTORICAL REPORT GENERATOR
// ============================================================================

export type ReportType = 'SECURITY_AUDIT' | 'SYSTEM_PERFORMANCE' | 'API_UTILIZATION' | 'BILLING_SUMMARY';
export type ReportFormat = 'PDF' | 'CSV' | 'JSON';

export interface ReportJob {
  id: string;
  name: string;
  type: ReportType;
  format: ReportFormat;
  status: 'PENDING' | 'GENERATING' | 'COMPLETED' | 'FAILED';
  createdAt: string;
  downloadUrl?: string;
  sizeBytes?: number;
}

const INITIAL_REPORTS: ReportJob[] = [
  {
    id: 'rep-1001',
    name: 'Q3 Security Threat Assessment',
    type: 'SECURITY_AUDIT',
    format: 'PDF',
    status: 'COMPLETED',
    createdAt: new Date(Date.now() - 86400000 * 10).toISOString(),
    downloadUrl: '#',
    sizeBytes: 1245000,
  },
  {
    id: 'rep-1002',
    name: 'September API Gateway Utilization',
    type: 'API_UTILIZATION',
    format: 'CSV',
    status: 'COMPLETED',
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    downloadUrl: '#',
    sizeBytes: 452000,
  },
];

interface ReportGeneratorTabProps {
  onLogAction: (message: string) => void;
}

export const ReportGeneratorTab: React.FC<ReportGeneratorTabProps> = ({ onLogAction }) => {
  const [reports, setReports] = useState<ReportJob[]>(INITIAL_REPORTS);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [reportName, setReportName] = useState('');
  const [reportType, setReportType] = useState<ReportType>('SECURITY_AUDIT');
  const [reportFormat, setReportFormat] = useState<ReportFormat>('PDF');

  const handleGenerateReport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportName.trim()) return;

    setIsGenerating(true);
    setGenerationProgress(0);
    onLogAction(`REPORT GENERATOR: Initiating compilation of report "${reportName}"...`);

    const interval = setInterval(() => {
      setGenerationProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          const newReport: ReportJob = {
            id: `rep-${Math.floor(1000 + Math.random() * 9000)}`,
            name: reportName,
            type: reportType,
            format: reportFormat,
            status: 'COMPLETED',
            createdAt: new Date().toISOString(),
            downloadUrl: '#',
            sizeBytes: Math.floor(100000 + Math.random() * 2000000),
          };
          setReports((prevReports) => [newReport, ...prevReports]);
          setIsGenerating(false);
          setReportName('');
          onLogAction(`SUCCESS: Report "${newReport.name}" compiled and ready for download.`);
          return 100;
        }
        return prev + 20;
      });
    }, 800);
  };

  return (
    <div className="grid gap-6 md:grid-cols-3">
      {/* Report Configuration Form */}
      <Card className="border-slate-200 dark:border-slate-800">
        <CardHeader>
          <CardTitle className="text-base font-bold">Configure Report</CardTitle>
          <CardDescription>
            Select parameters to compile historical system metrics and security audit logs.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleGenerateReport} className="space-y-4">
            <div className="space-y-1.5">
              <label htmlFor="rep-name" className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                Report Name
              </label>
              <Input
                id="rep-name"
                value={reportName}
                onChange={(e) => setReportName(e.target.value)}
                placeholder="e.g., Q4 Compliance Audit"
                disabled={isGenerating}
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="rep-type" className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                Report Type
              </label>
              <DropdownMenu>
                <DropdownMenuTrigger asChild disabled={isGenerating}>
                  <Button variant="outline" className="w-full justify-between text-xs">
                    {reportType.replace('_', ' ')}
                    <ChevronRight className="h-3.5 w-3.5 rotate-90 text-slate-400" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56">
                  {(['SECURITY_AUDIT', 'SYSTEM_PERFORMANCE', 'API_UTILIZATION', 'BILLING_SUMMARY'] as ReportType[]).map((type) => (
                    <DropdownMenuItem key={type} onClick={() => setReportType(type)} className="text-xs">
                      {type.replace('_', ' ')}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="rep-format" className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                Output Format
              </label>
              <DropdownMenu>
                <DropdownMenuTrigger asChild disabled={isGenerating}>
                  <Button variant="outline" className="w-full justify-between text-xs">
                    {reportFormat}
                    <ChevronRight className="h-3.5 w-3.5 rotate-90 text-slate-400" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56">
                  {(['PDF', 'CSV', 'JSON'] as ReportFormat[]).map((format) => (
                    <DropdownMenuItem key={format} onClick={() => setReportFormat(format)} className="text-xs">
                      {format}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {isGenerating ? (
              <div className="space-y-2 bg-slate-50 dark:bg-slate-900 p-3 rounded-lg border border-slate-100 dark:border-slate-800">
                <div className="flex justify-between text-xs font-semibold">
                  <span>Compiling metrics...</span>
                  <span className="font-mono text-emerald-500">{generationProgress}%</span>
                </div>
                <Progress value={generationProgress} className="h-1.5" />
              </div>
            ) : (
              <Button
                type="submit"
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold h-9 text-xs"
              >
                <FileText className="mr-1.5 h-4 w-4" />
                Compile Report
              </Button>
            )}
          </form>
        </CardContent>
      </Card>

      {/* Generated Reports Registry */}
      <Card className="md:col-span-2 border-slate-200 dark:border-slate-800">
        <CardHeader>
          <CardTitle className="text-base font-bold">Report Registry</CardTitle>
          <CardDescription>
            Download or audit previously compiled historical reports.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden">
            <Table>
              <TableHeader className="bg-slate-50 dark:bg-slate-900">
                <TableRow>
                  <TableHead>Report Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Format</TableHead>
                  <TableHead>Compiled At</TableHead>
                  <TableHead className="text-right">Size</TableHead>
                  <TableHead className="w-[100px] text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reports.map((rep) => (
                  <TableRow key={rep.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors">
                    <TableCell className="font-bold text-xs text-slate-900 dark:text-slate-100">
                      {rep.name}
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="text-[9px] font-semibold px-1.5 py-0">
                        {rep.type.replace('_', ' ')}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-mono text-xs">{rep.format}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {new Date(rep.createdAt).toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right font-mono text-xs">
                      {rep.sizeBytes ? formatBytes(rep.sizeBytes) : 'N/A'}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => alert(`Downloading report: ${rep.name}`)}
                        className="h-7 text-xs text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
                      >
                        <Download className="mr-1 h-3 w-3" />
                        Download
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// ============================================================================
// 19. ADVANCED SETTINGS & SYSTEM CONFIGURATION
// ============================================================================

export interface ConfigItem {
  key: string;
  value: string;
  type: 'STRING' | 'NUMBER' | 'BOOLEAN' | 'PASSWORD';
  category: 'SMTP' | 'REDIS' | 'DATABASE' | 'SECURITY' | 'LOGGING';
  description: string;
}

const INITIAL_CONFIGS: ConfigItem[] = [
  {
    key: 'smtp_host',
    value: 'smtp.sendgrid.net',
    type: 'STRING',
    category: 'SMTP',
    description: 'Hostname of the outbound SMTP mail server.',
  },
  {
    key: 'smtp_port',
    value: '587',
    type: 'NUMBER',
    category: 'SMTP',
    description: 'Port used for secure TLS SMTP communication.',
  },
  {
    key: 'redis_ttl_seconds',
    value: '3600',
    type: 'NUMBER',
    category: 'REDIS',
    description: 'Default Time-To-Live (TTL) for distributed cache keys.',
  },
  {
    key: 'db_max_connections',
    value: '100',
    type: 'NUMBER',
    category: 'DATABASE',
    description: 'Maximum active connections allowed in the primary database pool.',
  },
  {
    key: 'enforce_strict_ssl',
    value: 'true',
    type: 'BOOLEAN',
    category: 'SECURITY',
    description: 'Enforces strict SSL/TLS verification for all outbound webhook deliveries.',
  },
  {
    key: 'log_retention_days',
    value: '90',
    type: 'NUMBER',
    category: 'LOGGING',
    description: 'Number of days to retain system activity logs before archival.',
  },
];

interface SystemSettingsTabProps {
  onLogAction: (message: string) => void;
}

export const SystemSettingsTab: React.FC<SystemSettingsTabProps> = ({ onLogAction }) => {
  const [configs, setConfigs] = useState<ConfigItem[]>(INITIAL_CONFIGS);
  const [activeCategory, setActiveCategory] = useState<'SMTP' | 'REDIS' | 'DATABASE' | 'SECURITY' | 'LOGGING'>('SMTP');

  const handleValueChange = (key: string, newValue: string) => {
    setConfigs((prevConfigs) =>
      prevConfigs.map((cfg) => (cfg.key === key ? { ...cfg, value: newValue } : cfg))
    );
  };

  const handleSaveConfig = (e: React.FormEvent) => {
    e.preventDefault();
    onLogAction(`SYSTEM CONFIG: Saved administrative settings for category "${activeCategory}".`);
    alert('System configuration updated successfully. Changes will propagate across cluster nodes within 60 seconds.');
  };

  const filteredConfigs = configs.filter((cfg) => cfg.category === activeCategory);

  return (
    <div className="grid gap-6 md:grid-cols-3">
      {/* Category Navigation */}
      <Card className="border-slate-200 dark:border-slate-800">
        <CardHeader>
          <CardTitle className="text-sm font-bold">Configuration Categories</CardTitle>
          <CardDescription className="text-xs">
            Select a category to manage cluster environment variables and system parameters.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-2">
          <div className="space-y-1">
            {(['SMTP', 'REDIS', 'DATABASE', 'SECURITY', 'LOGGING'] as const).map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={cn(
                  "w-full text-left px-3 py-2 rounded-md text-xs font-semibold transition-colors",
                  activeCategory === cat
                    ? "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-950"
                    : "hover:bg-slate-100 dark:hover:bg-slate-900 text-slate-600 dark:text-slate-400"
                )}
              >
                {cat} Settings
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Settings Form */}
      <Card className="md:col-span-2 border-slate-200 dark:border-slate-800">
        <CardHeader>
          <CardTitle className="text-base font-bold">{activeCategory} Configuration</CardTitle>
          <CardDescription>
            Modify environment variables. Write operations are audited and logged to the compliance ledger.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSaveConfig} className="space-y-4">
            {filteredConfigs.map((cfg) => (
              <div key={cfg.key} className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label htmlFor={cfg.key} className="text-xs font-bold font-mono text-slate-900 dark:text-slate-100">
                    {cfg.key.toUpperCase()}
                  </label>
                  <span className="text-[10px] text-muted-foreground font-mono">{cfg.type}</span>
                </div>
                
                {cfg.type === 'BOOLEAN' ? (
                  <div className="flex items-center space-x-2 h-9">
                    <Switch
                      id={cfg.key}
                      checked={cfg.value === 'true'}
                      onCheckedChange={(checked) => handleValueChange(cfg.key, checked ? 'true' : 'false')}
                    />
                    <span className="text-xs font-semibold">{cfg.value === 'true' ? 'Enabled' : 'Disabled'}</span>
                  </div>
                ) : (
                  <Input
                    id={cfg.key}
                    type={cfg.type === 'NUMBER' ? 'number' : 'text'}
                    value={cfg.value}
                    onChange={(e) => handleValueChange(cfg.key, e.target.value)}
                    className="font-mono text-xs"
                  />
                )}
                <p className="text-[10px] text-muted-foreground leading-normal">
                  {cfg.description}
                </p>
              </div>
            ))}

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800/50 flex justify-end">
              <Button type="submit" className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold h-9 text-xs">
                Save Configuration
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

// ============================================================================
// 20. ADVANCED ADMIN DASHBOARD (INTEGRATED ENTRY POINT)
// ============================================================================

export function AdvancedAdminDashboard() {
  const { state, dispatch, reload } = useDashboardData();

  const handleTerminalCommandSubmit = (command: string) => {
    dispatch({ type: 'ADD_TERMINAL_LOG', payload: `> ${command}` });
    const output = executeTerminalCommand(command, state, dispatch);
    dispatch({ type: 'ADD_TERMINAL_LOG', payload: output });
  };

  const handleResolveAnomaly = (id: string, notes: string) => {
    dispatch({
      type: 'RESOLVE_ANOMALY_SUBMIT',
      payload: { id, notes, operator: 'Sarah Connor' },
    });
    dispatch({ type: 'ADD_TERMINAL_LOG', payload: `SUCCESS: Resolved security anomaly ${id}.` });
  };

  const handleDismissAnomaly = (id: string, notes: string) => {
    dispatch({
      type: 'DISMISS_ANOMALY_SUBMIT',
      payload: { id, notes, operator: 'Sarah Connor' },
    });
    dispatch({ type: 'ADD_TERMINAL_LOG', payload: `SUCCESS: Dismissed security anomaly ${id}.` });
  };

  const handleSaveWebhook = (webhook: Webhook) => {
    dispatch({ type: 'SAVE_WEBHOOK', payload: webhook });
    dispatch({ type: 'ADD_TERMINAL_LOG', payload: `SUCCESS: Saved webhook configuration for "${webhook.name}".` });
  };

  const handleLogAction = (message: string) => {
    dispatch({ type: 'ADD_TERMINAL_LOG', payload: message });
  };

  if (state.loading && state.anomalies.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-slate-950 text-slate-100 font-mono space-y-4">
        <RefreshCw className="h-8 w-8 animate-spin text-emerald-500" />
        <div className="text-sm tracking-widest animate-pulse">INITIALIZING QUANTUM CORE SECURE CONSOLE...</div>
      </div>
    );
  }

  if (state.error && state.anomalies.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-slate-950 text-rose-500 font-mono space-y-4 p-6 text-center">
        <ShieldAlert className="h-12 w-12 text-rose-500 animate-bounce" />
        <div className="text-lg font-bold tracking-wider">CRITICAL CONNECTION FAILURE</div>
        <p className="text-xs text-slate-400 max-w-md leading-relaxed">
          {state.error}
        </p>
        <Button onClick={reload} className="bg-rose-600 hover:bg-rose-500 text-white font-bold px-6 py-2 rounded">
          Retry Connection
        </Button>
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-6 p-4 md:p-8 pt-6 bg-slate-50/30 dark:bg-slate-950/10 min-h-screen">
      {/* Dashboard Header */}
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0 border-b border-slate-200 dark:border-slate-800/50 pb-6">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <Shield className="h-6 w-6 text-emerald-500" />
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
              Quantum Core Admin Dashboard
            </h1>
          </div>
          <p className="text-xs text-muted-foreground">
            Enterprise-grade cluster monitoring, threat detection, and developer integration control panel.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => dispatch({ type: 'TOGGLE_LIVE_POLLING' })}
            className={cn(
              "h-8 text-xs border-slate-200 dark:border-slate-800",
              state.isLivePolling 
                ? "bg-emerald-500/5 text-emerald-600 border-emerald-500/10 hover:bg-emerald-500/10" 
                : "hover:bg-slate-100 dark:hover:bg-slate-800"
            )}
          >
            <span className={cn("w-2 h-2 rounded-full mr-1.5", state.isLivePolling ? "bg-emerald-500 animate-pulse" : "bg-slate-400")} />
            {state.isLivePolling ? 'Live Polling Active' : 'Polling Paused'}
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={reload}
            disabled={state.loading}
            className="h-8 text-xs border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <RefreshCw className={cn("mr-1.5 h-3.5 w-3.5", state.loading && "animate-spin")} />
            Sync Cluster
          </Button>

          <Button
            onClick={() => dispatch({ type: 'OPEN_MODAL', payload: { key: 'systemTerminal', data: true } })}
            className="bg-slate-900 hover:bg-slate-800 text-white dark:bg-slate-100 dark:hover:bg-slate-200 dark:text-slate-950 h-8 text-xs font-mono"
          >
            <Terminal className="mr-1.5 h-3.5 w-3.5 text-emerald-500" />
            Terminal
          </Button>
        </div>
      </div>

      {/* Main Tabs Container */}
      <Tabs value={state.activeTab} onValueChange={(val) => dispatch({ type: 'SET_ACTIVE_TAB', payload: val })} className="space-y-6">
        <TabsList className="flex flex-wrap h-auto p-1 bg-slate-100 dark:bg-slate-900/50 border border-slate-200/50 dark:border-slate-800/50 rounded-lg max-w-fit">
          <TabsTrigger value="overview" className="text-xs px-3 py-1.5">Overview</TabsTrigger>
          <TabsTrigger value="anomalies" className="text-xs px-3 py-1.5 flex items-center">
            Anomalies
            {state.anomalies.filter((a) => a.status === 'ACTIVE').length > 0 && (
              <span className="ml-1.5 flex h-2 w-2 rounded-full bg-rose-500" />
            )}
          </TabsTrigger>
          <TabsTrigger value="webhooks" className="text-xs px-3 py-1.5">Webhooks</TabsTrigger>
          <TabsTrigger value="integrations" className="text-xs px-3 py-1.5">Integrations</TabsTrigger>
          <TabsTrigger value="policies" className="text-xs px-3 py-1.5">Security Policies</TabsTrigger>
          <TabsTrigger value="database" className="text-xs px-3 py-1.5">Database Explorer</TabsTrigger>
          <TabsTrigger value="logs" className="text-xs px-3 py-1.5">System Logs</TabsTrigger>
          <TabsTrigger value="audit" className="text-xs px-3 py-1.5">Audit Trail</TabsTrigger>
          <TabsTrigger value="topology" className="text-xs px-3 py-1.5">Cluster Topology</TabsTrigger>
          <TabsTrigger value="backups" className="text-xs px-3 py-1.5">Backup Manager</TabsTrigger>
          <TabsTrigger value="apikeys" className="text-xs px-3 py-1.5">API Keys</TabsTrigger>
          <TabsTrigger value="tenants" className="text-xs px-3 py-1.5">Tenants</TabsTrigger>
          <TabsTrigger value="shaper" className="text-xs px-3 py-1.5">Traffic Shaper</TabsTrigger>
          <TabsTrigger value="reports" className="text-xs px-3 py-1.5">Reports</TabsTrigger>
          <TabsTrigger value="settings" className="text-xs px-3 py-1.5">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6 focus-visible:outline-none">
          <OverviewTab
            state={state}
            dispatch={dispatch}
            onOpenAnomaly={(anom) => dispatch({ type: 'OPEN_MODAL', payload: { key: 'resolveAnomaly', data: anom } })}
          />
        </TabsContent>

        <TabsContent value="anomalies" className="space-y-6 focus-visible:outline-none">
          <AnomaliesTab
            state={state}
            dispatch={dispatch}
            onOpenAnomaly={(anom) => dispatch({ type: 'OPEN_MODAL', payload: { key: 'resolveAnomaly', data: anom } })}
          />
        </TabsContent>

        <TabsContent value="webhooks" className="space-y-6 focus-visible:outline-none">
          <WebhooksTab
            state={state}
            dispatch={dispatch}
            onOpenForm={(wh) => dispatch({ type: 'OPEN_MODAL', payload: { key: 'webhookForm', data: wh } })}
            onOpenLogs={(wh) => dispatch({ type: 'OPEN_MODAL', payload: { key: 'webhookLogs', data: wh } })}
          />
        </TabsContent>

        <TabsContent value="integrations" className="space-y-6 focus-visible:outline-none">
          <IntegrationsTab state={state} dispatch={dispatch} />
        </TabsContent>

        <TabsContent value="policies" className="space-y-6 focus-visible:outline-none">
          <SecurityPoliciesTab onLogAction={handleLogAction} />
        </TabsContent>

        <TabsContent value="database" className="space-y-6 focus-visible:outline-none">
          <DatabaseExplorerTab onLogAction={handleLogAction} />
        </TabsContent>

        <TabsContent value="logs" className="space-y-6 focus-visible:outline-none">
          <LogsTab state={state} dispatch={dispatch} />
        </TabsContent>

        <TabsContent value="audit" className="space-y-6 focus-visible:outline-none">
          <AuditTab state={state} dispatch={dispatch} />
        </TabsContent>

        <TabsContent value="topology" className="space-y-6 focus-visible:outline-none">
          <ClusterTopologyTab onLogAction={handleLogAction} />
        </TabsContent>

        <TabsContent value="backups" className="space-y-6 focus-visible:outline-none">
          <BackupManagerTab onLogAction={handleLogAction} />
        </TabsContent>

        <TabsContent value="apikeys" className="space-y-6 focus-visible:outline-none">
          <ApiKeyManagerTab onLogAction={handleLogAction} />
        </TabsContent>

        <TabsContent value="tenants" className="space-y-6 focus-visible:outline-none">
          <TenantManagerTab onLogAction={handleLogAction} />
        </TabsContent>

        <TabsContent value="shaper" className="space-y-6 focus-visible:outline-none">
          <TrafficShaperTab onLogAction={handleLogAction} />
        </TabsContent>

        <TabsContent value="reports" className="space-y-6 focus-visible:outline-none">
          <ReportGeneratorTab onLogAction={handleLogAction} />
        </TabsContent>

        <TabsContent value="settings" className="space-y-6 focus-visible:outline-none">
          <SystemSettingsTab onLogAction={handleLogAction} />
        </TabsContent>
      </Tabs>

      {/* Modals & Dialogs */}
      <AnomalyDetailsDialog
        anomaly={state.modals.resolveAnomaly}
        isOpen={!!state.modals.resolveAnomaly}
        onClose={() => dispatch({ type: 'CLOSE_MODAL', payload: { key: 'resolveAnomaly' } })}
        onResolve={handleResolveAnomaly}
        onDismiss={handleDismissAnomaly}
      />

      <WebhookFormDialog
        webhook={state.modals.webhookForm}
        isOpen={!!state.modals.webhookForm}
        onClose={() => dispatch({ type: 'CLOSE_MODAL', payload: { key: 'webhookForm' } })}
        onSave={handleSaveWebhook}
      />

      <WebhookLogsDialog
        webhook={state.modals.webhookLogs}
        isOpen={!!state.modals.webhookLogs}
        onClose={() => dispatch({ type: 'CLOSE_MODAL', payload: { key: 'webhookLogs' } })}
      />

      <TerminalConsole
        logs={state.terminalLogs}
        onExecuteCommand={handleTerminalCommandSubmit}
        onClear={() => dispatch({ type: 'CLEAR_TERMINAL_LOGS' })}
        isOpen={state.modals.systemTerminal}
        onClose={() => dispatch({ type: 'CLOSE_MODAL', payload: { key: 'systemTerminal' } })}
      />
    </div>
  );
}// ============================================================================
// 21. GLOBAL ERROR BOUNDARY & THEME PROVIDER WRAPPER
// ============================================================================

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class DashboardErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Quantum Core Dashboard Error Boundary caught an unhandled exception:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center h-screen bg-slate-950 text-rose-500 font-mono p-6 text-center">
          <ShieldAlert className="h-12 w-12 text-rose-500 animate-bounce mb-4" />
          <div className="text-lg font-bold tracking-wider">CRITICAL RUNTIME EXCEPTION DETECTED</div>
          <p className="text-xs text-slate-400 max-w-md leading-relaxed mt-2 mb-6">
            {this.state.error?.message || "An unexpected error occurred in the dashboard rendering pipeline."}
          </p>
          <Button 
            onClick={() => window.location.reload()} 
            className="bg-rose-600 hover:bg-rose-500 text-white font-bold px-6 py-2 rounded"
          >
            Hot Reload Console
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}

export function QuantumCoreDashboardApp() {
  return (
    <DashboardErrorBoundary>
      <AdvancedAdminDashboard />
    </DashboardErrorBoundary>
  );
}