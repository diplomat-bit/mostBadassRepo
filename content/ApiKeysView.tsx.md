// REPOSITORY SOURCE: diplomat-bit/Citibank_Demo_Business_Inc_Demonstration- | PATH: diplomat-bit-Citibank_Demo_Business_Inc_Demonstration--ab2501d/content/ApiKeysView.tsx.md
================================================================================

```tsx
import React, { useState, useEffect, useMemo, useCallback, useRef, FC } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, AreaChart, Area
} from 'recharts';
import { ComposableMap, Geographies, Geography, Marker } from 'react-simple-maps';
import {
    FiKey, FiPlusCircle, FiEye, FiRotateCw, FiTrash2, FiCopy, FiCheck, FiAlertTriangle, FiShield,
    FiX, FiChevronDown, FiChevronRight, FiCpu, FiGlobe, FiClock, FiCode, FiTerminal, FiSearch,
    FiLock, FiFileText, FiActivity, FiUsers, FiServer, FiDatabase, FiSettings, FiLifeBuoy, FiDownloadCloud, FiShare2
} from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { v4 as uuidv4 } from 'uuid';

// --- TYPE DEFINITIONS ---
// Based on the elaborate chronicle from the original markdown

type ApiKeyStatus = 'active' | 'inactive' | 'revoked';
type RateLimitProfile = 'low-volume' | 'sustained-high' | 'bursty' | 'enterprise-unlimited';
type AnomalySeverity = 'Informational' | 'Low' | 'Medium' | 'High' | 'Critical';

interface Permission {
    id: string;
    resource: string;
    description: string;
    actions: {
        read: boolean;
        write: boolean;
        delete: boolean;
        execute: boolean;
    };
}

interface PermissionCategory {
    id: string;
    name: string;
    description: string;
    permissions: Permission[];
    subCategories?: PermissionCategory[];
}

interface ApiKey {
    id: string;
    name: string;
    description: string;
    keyPrefix: string;
    last4: string;
    createdBy: string;
    creatorEmail: string;
    createdAt: string;
    lastUsedAt: string | null;
    expiresAt: string | null;
    status: ApiKeyStatus;
    permissions: Record<string, Permission['actions']>;
    ipRestrictions: string[];
    rateLimitProfile: RateLimitProfile;
    healthScore: number;
    metadata: {
        project: string;
        environment: 'development' | 'staging' | 'production';
        ownerTeam: string;
    };
}

interface UsageLog {
    id: string;
    timestamp: string;
    ipAddress: string;
    location: {
        city: string;
        country: string;
        lat: number;
        lon: number;
    };
    endpoint: string;
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
    statusCode: number;
    latencyMs: number;
    userAgent: string;
}

interface ThreatIntel {
    ipAddress: string;
    isKnownBotnet: boolean;
    isTorExitNode: boolean;
    isProxy: boolean;
    associatedThreats: string[];
}

interface SecurityAnomaly {
    id: string;
    timestamp: string;
    type: string;
    description: string;
    severity: AnomalySeverity;
    logReference: string;
    mitigationStatus: 'pending' | 'in_progress' | 'resolved' | 'ignored';
    threatIntel?: ThreatIntel;
}

interface AuditLog {
    id:string;
    timestamp: string;
    actor: string;
    action: string;
    details: string;
}

// --- MOCK DATA & SERVICES ---
// Simulating a comprehensive backend as described in "The Scribe's Workshop"

const MOCK_PERMISSIONS_HIERARCHY: PermissionCategory[] = [
    {
        id: 'user_data', name: 'User Data API', description: 'Access to user profiles and related data.',
        permissions: [
            { id: 'user_profile', resource: 'user:profile', description: 'Read and manage user profiles.', actions: { read: false, write: false, delete: false, execute: false } },
            { id: 'user_auth', resource: 'user:auth_events', description: 'Access user authentication events.', actions: { read: false, write: false, delete: false, execute: false } },
        ],
        subCategories: [
            {
                id: 'pii_data', name: 'PII Data', description: 'Sensitive Personally Identifiable Information.',
                permissions: [
                    { id: 'pii_contact', resource: 'user:profile:pii:contact', description: 'Access user email and phone number.', actions: { read: false, write: false, delete: false, execute: false } },
                    { id: 'pii_address', resource: 'user:profile:pii:address', description: 'Access user physical address.', actions: { read: false, write: false, delete: false, execute: false } },
                ]
            }
        ]
    },
    {
        id: 'finance_api', name: 'Financial API', description: 'Access to financial records and transactions.',
        permissions: [
            { id: 'transactions', resource: 'finance:transactions', description: 'Read and create transactions.', actions: { read: false, write: false, delete: false, execute: false } },
            { id: 'accounts', resource: 'finance:accounts', description: 'View financial accounts.', actions: { read: false, write: false, delete: false, execute: false } },
            { id: 'invoices', resource: 'finance:invoices', description: 'Manage invoices.', actions: { read: false, write: false, delete: false, execute: false } },
        ]
    },
    {
        id: 'compute_api', name: 'Compute API', description: 'Manage virtual machines and serverless functions.',
        permissions: [
            { id: 'vm_manage', resource: 'compute:vm:manage', description: 'Start, stop, and reboot virtual machines.', actions: { read: false, write: false, delete: false, execute: true } },
            { id: 'functions_deploy', resource: 'compute:functions:deploy', description: 'Deploy and manage serverless functions.', actions: { read: false, write: false, delete: false, execute: true } },
        ]
    },
     {
        id: 'admin_api', name: 'Platform Administration API', description: 'High-privilege access to manage the platform.',
        permissions: [
            { id: 'admin_users', resource: 'admin:users', description: 'Manage all platform users.', actions: { read: false, write: false, delete: false, execute: false } },
            { id: 'admin_billing', resource: 'admin:billing', description: 'Access and manage billing information.', actions: { read: false, write: false, delete: false, execute: false } },
            { id: 'admin_system', resource: 'admin:system', description: 'Control system-level settings.', actions: { read: false, write: false, delete: false, execute: false } },
        ]
    },
];

const MOCK_API_KEYS: ApiKey[] = [
    {
        id: 'apk_1', name: 'Main Production Backend', description: 'Primary key for our main application backend services.',
        keyPrefix: 'prod_live', last4: 'a1b2', createdBy: 'Alice Johnson', creatorEmail: 'alice@example.com',
        createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        lastUsedAt: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
        expiresAt: new Date(Date.now() + 335 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'active',
        permissions: { 'finance:transactions': { read: true, write: true, delete: false, execute: false }, 'user:profile': { read: true, write: false, delete: false, execute: false } },
        ipRestrictions: ['192.168.1.0/24'], rateLimitProfile: 'sustained-high', healthScore: 95,
        metadata: { project: 'Phoenix', environment: 'production', ownerTeam: 'Backend Core' }
    },
    {
        id: 'apk_2', name: 'Staging Analytics Service', description: 'Key for the data analytics pipeline in the staging environment.',
        keyPrefix: 'stg_read', last4: 'c3d4', createdBy: 'Bob Williams', creatorEmail: 'bob@example.com',
        createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
        lastUsedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        expiresAt: null,
        status: 'active',
        permissions: { 'finance:transactions': { read: true, write: false, delete: false, execute: false }, 'finance:accounts': { read: true, write: false, delete: false, execute: false } },
        ipRestrictions: [], rateLimitProfile: 'bursty', healthScore: 78,
        metadata: { project: 'Eagle Eye', environment: 'staging', ownerTeam: 'Data Science' }
    },
    {
        id: 'apk_3', name: 'Third-Party Integration (Legacy)', description: 'Key for an old partner integration, to be deprecated.',
        keyPrefix: 'ext_legecy', last4: 'e5f6', createdBy: 'System', creatorEmail: 'system@example.com',
        createdAt: new Date(Date.now() - 730 * 24 * 60 * 60 * 1000).toISOString(),
        lastUsedAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
        expiresAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'inactive',
        permissions: { 'finance:invoices': { read: true, write: true, delete: false, execute: false } },
        ipRestrictions: ['203.0.113.55'], rateLimitProfile: 'low-volume', healthScore: 45,
        metadata: { project: 'Legacy Connect', environment: 'production', ownerTeam: 'Integrations' }
    },
    {
        id: 'apk_4', name: 'Revoked Key - Public Leak', description: 'This key was found on a public GitHub repository and was immediately revoked.',
        keyPrefix: 'prod_live', last4: 'g7h8', createdBy: 'Carol White', creatorEmail: 'carol@example.com',
        createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
        lastUsedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
        expiresAt: null,
        status: 'revoked',
        permissions: { 'admin:users': { read: true, write: true, delete: true, execute: false } },
        ipRestrictions: [], rateLimitProfile: 'sustained-high', healthScore: 0,
        metadata: { project: 'Admin UI', environment: 'production', ownerTeam: 'Platform Ops' }
    }
];

const MOCK_USAGE_LOGS: UsageLog[] = Array.from({ length: 100 }, (_, i) => ({
    id: `log_${i}`,
    timestamp: new Date(Date.now() - i * 30 * 60 * 1000).toISOString(),
    ipAddress: i % 10 === 0 ? '104.18.21.189' : `192.168.1.${Math.floor(Math.random() * 254) + 1}`,
    location: i % 10 === 0 ? { city: 'Bucharest', country: 'RO', lat: 44.43, lon: 26.1 } : { city: 'San Francisco', country: 'US', lat: 37.77, lon: -122.41 },
    endpoint: i % 3 === 0 ? '/api/v1/finance/transactions' : i % 3 === 1 ? '/api/v1/user/profile' : '/api/v1/finance/accounts',
    method: i % 2 === 0 ? 'GET' : 'POST',
    statusCode: i % 15 === 0 ? 403 : i % 20 === 0 ? 500 : 200,
    latencyMs: Math.floor(Math.random() * 200) + 50,
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36'
}));

const MOCK_ANOMALIES: SecurityAnomaly[] = [
    {
        id: 'anom_1', timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), type: 'Geospatial Anomaly',
        description: 'Request originated from a new and unusual geographic location (Bucharest, RO) for this key.',
        severity: 'Medium', logReference: 'log_0', mitigationStatus: 'pending',
        threatIntel: { ipAddress: '104.18.21.189', isKnownBotnet: false, isTorExitNode: false, isProxy: true, associatedThreats: ['Potential Credential Stuffing Origin'] }
    },
    {
        id: 'anom_2', timestamp: new Date(Date.now() - 10 * 60 * 60 * 1000).toISOString(), type: 'Temporal Deviation',
        description: 'High volume of requests detected outside of normal operating hours (3:15 AM UTC).',
        severity: 'High', logReference: 'log_20', mitigationStatus: 'pending',
    },
    {
        id: 'anom_3', timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), type: 'Permission Escalation Attempt',
        description: 'Multiple failed attempts to access a forbidden endpoint (/api/v1/admin/users).',
        severity: 'Critical', logReference: 'log_30', mitigationStatus: 'resolved',
    }
];

const MOCK_AUDIT_LOGS: AuditLog[] = [
    { id: 'audit_1', timestamp: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), actor: 'Alice Johnson', action: 'Key Created', details: 'Generated key "Main Production Backend"' },
    { id: 'audit_2', timestamp: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(), actor: 'Alice Johnson', action: 'Policy Update', details: 'Added IP restriction: 192.168.1.0/24' },
    { id: 'audit_3', timestamp: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), actor: 'Automated System', action: 'Key Revoked', details: 'Key apk_4 automatically revoked due to public leak detection.' },
    { id: 'audit_4', timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), actor: 'System', action: 'Health Score Update', details: 'Health score decreased to 78 due to inactivity.' },
];

const mockApiKeysService = {
    async getApiKeys(): Promise<ApiKey[]> {
        await new Promise(res => setTimeout(res, 500));
        return MOCK_API_KEYS;
    },
    async generateApiKey(details: Omit<ApiKey, 'id' | 'keyPrefix' | 'last4' | 'createdAt' | 'healthScore'>): Promise<{ key: string, apiKey: ApiKey }> {
        await new Promise(res => setTimeout(res, 1000));
        const newKey: ApiKey = {
            id: `apk_${uuidv4()}`,
            keyPrefix: `${details.metadata.environment.substring(0,4)}_${details.name.substring(0,4).toLowerCase()}`,
            last4: Math.random().toString(16).substring(2, 6),
            createdAt: new Date().toISOString(),
            healthScore: 100,
            ...details,
        };
        MOCK_API_KEYS.push(newKey);
        return { key: `${newKey.keyPrefix}_${uuidv4().replace(/-/g, '')}`, apiKey: newKey };
    },
    async revokeApiKey(id: string): Promise<ApiKey> {
        await new Promise(res => setTimeout(res, 500));
        const key = MOCK_API_KEYS.find(k => k.id === id);
        if (key) {
            key.status = 'revoked';
            key.healthScore = 0;
            MOCK_AUDIT_LOGS.push({ id: `audit_${uuidv4()}`, timestamp: new Date().toISOString(), actor: 'Current User', action: 'Key Revoked', details: `Manually revoked key "${key.name}"` });
            return key;
        }
        throw new Error("Key not found");
    },
    async getApiKeyDetails(id: string): Promise<{ usage: UsageLog[], anomalies: SecurityAnomaly[], audit: AuditLog[] }> {
        await new Promise(res => setTimeout(res, 750));
        return { usage: MOCK_USAGE_LOGS, anomalies: MOCK_ANOMALIES, audit: MOCK_AUDIT_LOGS };
    }
};

const mockAiService = {
    async getPermissionRecommendations(purpose: string): Promise<Record<string, Permission['actions']>> {
        await new Promise(res => setTimeout(res, 1500));
        if (purpose.toLowerCase().includes('analytics')) {
            return { 'finance:transactions': { read: true, write: false, delete: false, execute: false }, 'finance:accounts': { read: true, write: false, delete: false, execute: false } };
        }
        if (purpose.toLowerCase().includes('backend')) {
            return { 'finance:transactions': { read: true, write: true, delete: false, execute: false }, 'user:profile': { read: true, write: true, delete: false, execute: false } };
        }
        return {};
    },
    async simulateApiCall(permissions: Record<string, Permission['actions']>, method: string, endpoint: string): Promise<{ allowed: boolean, reason: string }> {
        await new Promise(res => setTimeout(res, 500));
        // A very simplified simulation logic
        let allowed = false;
        let reason = "No matching permission found.";
        const requiredAction = method === 'GET' ? 'read' : method === 'POST' ? 'write' : 'delete';
        
        for (const [resource, actions] of Object.entries(permissions)) {
             const resourceRegex = new RegExp(`^/api/v1/${resource.replace(/:/g, '/')}(\/.*)?$`);
             if (resourceRegex.test(endpoint) && actions[requiredAction]) {
                 allowed = true;
                 reason = `Allowed by permission '${resource}' with '${requiredAction}' access.`;
                 break;
             }
        }
        if (!allowed) {
           reason = `Call to ${method} ${endpoint} is denied. The key does not have the required permission.`;
        }
        return { allowed, reason };
    }
};

// --- UI HELPER COMPONENTS ---

const TooltipWrapper: FC<{ content: string, children: React.ReactElement }> = ({ content, children }) => {
    const [visible, setVisible] = useState(false);
    return (
        <div className="relative inline-block" onMouseEnter={() => setVisible(true)} onMouseLeave={() => setVisible(false)}>
            {children}
            <AnimatePresence>
                {visible && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute bottom-full mb-2 w-max max-w-xs p-2 text-sm bg-gray-800 text-white rounded-md shadow-lg z-50"
                    >
                        {content}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

const StatusPill: FC<{ status: ApiKeyStatus }> = ({ status }) => {
    const statusStyles = {
        active: 'bg-green-100 text-green-800',
        inactive: 'bg-yellow-100 text-yellow-800',
        revoked: 'bg-red-100 text-red-800',
    };
    return (
        <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusStyles[status]}`}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
    );
};

const HealthScore: FC<{ score: number }> = ({ score }) => {
    const getColor = () => {
        if (score > 80) return 'text-green-500';
        if (score > 50) return 'text-yellow-500';
        return 'text-red-500';
    };
    return (
        <TooltipWrapper content={`AI-calculated health score based on security posture, usage patterns, and age. Score: ${score}/100.`}>
            <div className="flex items-center">
                <FiShield className={`mr-1 ${getColor()}`} />
                <span className={`font-semibold ${getColor()}`}>{score}</span>
            </div>
        </TooltipWrapper>
    );
};

const CopyButton: FC<{ text: string }> = ({ text }) => {
    const [copied, setCopied] = useState(false);
    const handleCopy = () => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };
    return (
        <button onClick={handleCopy} className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded">
            {copied ? <FiCheck className="text-green-500" /> : <FiCopy />}
        </button>
    );
};

const Modal: FC<{ isOpen: boolean, onClose: () => void, title: string, children: React.ReactNode, size?: 'sm' | 'md' | 'lg' | 'xl' | 'full' }> = ({ isOpen, onClose, title, children, size = 'lg' }) => {
    const sizeClasses = {
        sm: 'max-w-sm',
        md: 'max-w-md',
        lg: 'max-w-3xl',
        xl: 'max-w-5xl',
        full: 'max-w-full h-full'
    };
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className={`bg-gray-900 border border-gray-700 rounded-lg shadow-xl w-full ${sizeClasses[size]} flex flex-col`}
                style={{maxHeight: '90vh'}}
            >
                <header className="flex items-center justify-between p-4 border-b border-gray-700">
                    <h2 className="text-xl font-semibold text-white">{title}</h2>
                    <button onClick={onClose} className="p-1 text-gray-400 hover:text-white rounded-full hover:bg-gray-800">
                        <FiX size={20} />
                    </button>
                </header>
                <main className="p-6 overflow-y-auto flex-grow">{children}</main>
            </motion.div>
        </div>
    );
};

const CodeSnippetGenerator: FC<{ apiKey: string }> = ({ apiKey }) => {
    const [language, setLanguage] = useState('curl');
    const snippets = {
        curl: `curl -X GET https://api.example.com/v1/resource \\
  -H "Authorization: Bearer ${apiKey}"`,
        javascript: `// Using Fetch API in JavaScript
const apiKey = process.env.API_KEY; // Best practice: use environment variables

fetch('https://api.example.com/v1/resource', {
  method: 'GET',
  headers: {
    'Authorization': \`Bearer \${apiKey}\`,
    'Content-Type': 'application/json'
  }
})
.then(response => response.json())
.then(data => console.log(data))
.catch(error => console.error('Error:', error));`,
        python: `# Using the requests library in Python
import os
import requests

api_key = os.environ.get("API_KEY") # Best practice: use environment variables

headers = {
    "Authorization": f"Bearer {api_key}",
    "Content-Type": "application/json",
}

response = requests.get("https://api.example.com/v1/resource", headers=headers)

if response.status_code == 200:
    print(response.json())
else:
    print(f"Error: {response.status_code}, {response.text}")`,
        terraform: `# Example for storing the key in AWS Secrets Manager using Terraform
resource "aws_secretsmanager_secret" "api_key" {
  name = "production/MyApplication/ApiKey"
}

resource "aws_secretsmanager_secret_version" "api_key_version" {
  secret_id     = aws_secretsmanager_secret.api_key.id
  secret_string = "${apiKey}"
}
`
    };

    return (
        <div className="bg-gray-800 rounded-lg mt-4">
            <div className="flex border-b border-gray-700">
                {Object.keys(snippets).map(lang => (
                    <button key={lang} onClick={() => setLanguage(lang)}
                        className={`px-4 py-2 text-sm font-medium ${language === lang ? 'text-blue-400 border-b-2 border-blue-400' : 'text-gray-400 hover:bg-gray-700'}`}>
                        {lang.charAt(0).toUpperCase() + lang.slice(1)}
                    </button>
                ))}
            </div>
            <div className="relative p-4">
                <div className="absolute top-4 right-4">
                     <CopyButton text={snippets[language]} />
                </div>
                <SyntaxHighlighter language={language} style={vscDarkPlus} customStyle={{ margin: 0, background: 'transparent' }}>
                    {snippets[language]}
                </SyntaxHighlighter>
            </div>
        </div>
    );
};

const PermissionSelector: FC<{ value: Record<string, Permission['actions']>, onChange: (value: Record<string, Permission['actions']>) => void }> = ({ value, onChange }) => {
    const [expanded, setExpanded] = useState<Record<string, boolean>>({});

    const handleToggleCategory = (id: string) => {
        setExpanded(prev => ({...prev, [id]: !prev[id]}));
    };

    const handlePermissionChange = (resource: string, action: keyof Permission['actions']) => {
        const newValue = JSON.parse(JSON.stringify(value));
        if (!newValue[resource]) {
            newValue[resource] = { read: false, write: false, delete: false, execute: false };
        }
        newValue[resource][action] = !newValue[resource][action];
        
        // If all are false, remove the key
        if (Object.values(newValue[resource]).every(v => v === false)) {
            delete newValue[resource];
        }

        onChange(newValue);
    };

    const renderCategory = (category: PermissionCategory, level = 0) => (
        <div key={category.id} className={`${level > 0 ? 'ml-6' : ''}`}>
            <div className="flex items-center py-2 cursor-pointer" onClick={() => handleToggleCategory(category.id)}>
                {expanded[category.id] ? <FiChevronDown className="mr-2"/> : <FiChevronRight className="mr-2"/>}
                <span className="font-semibold">{category.name}</span>
                <span className="ml-2 text-sm text-gray-400">{category.description}</span>
            </div>
            {expanded[category.id] && (
                <div className="pl-6 border-l border-gray-700">
                    {category.permissions.map(perm => (
                        <div key={perm.id} className="py-2">
                            <p className="text-gray-300">{perm.resource}</p>
                            <p className="text-sm text-gray-500 mb-2">{perm.description}</p>
                            <div className="flex space-x-4">
                                {Object.keys(perm.actions).map(action => (
                                    <label key={action} className="flex items-center text-sm">
                                        <input
                                            type="checkbox"
                                            className="form-checkbox h-4 w-4 bg-gray-800 border-gray-600 text-blue-500 focus:ring-blue-500"
                                            checked={!!value[perm.resource]?.[action]}
                                            onChange={() => handlePermissionChange(perm.resource, action as keyof Permission['actions'])}
                                        />
                                        <span className="ml-2">{action}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    ))}
                    {category.subCategories?.map(sub => renderCategory(sub, level + 1))}
                </div>
            )}
        </div>
    );

    return <div className="space-y-2">{MOCK_PERMISSIONS_HIERARCHY.map(cat => renderCategory(cat))}</div>;
};


// --- FEATURE COMPONENTS ---

const ApiKeyDetails: FC<{ apiKey: ApiKey }> = ({ apiKey }) => {
    const [details, setDetails] = useState<{ usage: UsageLog[], anomalies: SecurityAnomaly[], audit: AuditLog[] } | null>(null);
    const [activeTab, setActiveTab] = useState('overview');

    useEffect(() => {
        mockApiKeysService.getApiKeyDetails(apiKey.id).then(setDetails);
    }, [apiKey.id]);

    const tabs = ['overview', 'usage_analytics', 'security_center', 'audit_trail', 'settings'];
    
    const renderTabContent = () => {
        if (!details) return <div className="flex justify-center items-center h-64"><FiCpu className="animate-spin text-4xl text-blue-500"/></div>;
        
        switch(activeTab) {
            case 'overview': return <OverviewTab apiKey={apiKey} />;
            case 'usage_analytics': return <UsageAnalyticsTab usage={details.usage} />;
            case 'security_center': return <SecurityCenterTab anomalies={details.anomalies} />;
            case 'audit_trail': return <AuditTrailTab audit={details.audit} />;
            case 'settings': return <SettingsTab apiKey={apiKey} />;
            default: return null;
        }
    };

    return (
        <div className="text-gray-300">
            <div className="flex border-b border-gray-700 mb-6">
                {tabs.map(tab => (
                    <button key={tab} onClick={() => setActiveTab(tab)}
                        className={`px-4 py-2 text-sm font-medium capitalize ${activeTab === tab ? 'text-blue-400 border-b-2 border-blue-400' : 'text-gray-400 hover:bg-gray-800'}`}>
                        {tab.replace('_', ' ')}
                    </button>
                ))}
            </div>
            {renderTabContent()}
        </div>
    );
};

const OverviewTab: FC<{apiKey: ApiKey}> = ({apiKey}) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-4">
                <h3 className="text-lg font-semibold text-white">Key Details</h3>
                <p><strong className="text-gray-400">ID:</strong> {apiKey.id}</p>
                <p><strong className="text-gray-400">Prefix:</strong> {apiKey.keyPrefix}</p>
                <p><strong className="text-gray-400">Created At:</strong> {new Date(apiKey.createdAt).toLocaleString()}</p>
                <p><strong className="text-gray-400">Created By:</strong> {apiKey.createdBy} ({apiKey.creatorEmail})</p>
                <p><strong className="text-gray-400">Last Used:</strong> {apiKey.lastUsedAt ? new Date(apiKey.lastUsedAt).toLocaleString() : 'Never'}</p>
                <p><strong className="text-gray-400">Expires At:</strong> {apiKey.expiresAt ? new Date(apiKey.expiresAt).toLocaleString() : 'Never'}</p>
            </div>
            <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white">Metadata & Policies</h3>
                <p><strong className="text-gray-400">Project:</strong> {apiKey.metadata.project}</p>
                <p><strong className="text-gray-400">Environment:</strong> <span className="capitalize">{apiKey.metadata.environment}</span></p>
                <p><strong className="text-gray-400">Owner Team:</strong> {apiKey.metadata.ownerTeam}</p>
                <p><strong className="text-gray-400">Rate Limit Profile:</strong> <span className="capitalize">{apiKey.rateLimitProfile.replace('-', ' ')}</span></p>
                <p><strong className="text-gray-400">IP Restrictions:</strong> {apiKey.ipRestrictions.length > 0 ? apiKey.ipRestrictions.join(', ') : 'None'}</p>
            </div>
            <div className="md:col-span-3">
                 <h3 className="text-lg font-semibold text-white mb-2">Granted Permissions</h3>
                 <div className="p-4 bg-gray-800 rounded-lg max-h-60 overflow-y-auto">
                    {Object.keys(apiKey.permissions).length > 0 ? (
                        <ul className="list-disc list-inside">
                            {Object.entries(apiKey.permissions).map(([resource, actions]) => (
                                <li key={resource}>
                                    <span className="font-mono text-blue-300">{resource}:</span>
                                    <span className="ml-2 text-gray-300">{Object.entries(actions).filter(([,v]) => v).map(([k]) => k).join(', ')}</span>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-gray-400">No permissions granted.</p>
                    )}
                 </div>
            </div>
        </div>
    );
};

const UsageAnalyticsTab: FC<{ usage: UsageLog[] }> = ({ usage }) => {
    const usageByHour = useMemo(() => {
        const data = Array(24).fill(0).map((_, i) => ({ hour: `${i}:00`, requests: 0 }));
        usage.forEach(log => {
            const hour = new Date(log.timestamp).getHours();
            data[hour].requests++;
        });
        return data;
    }, [usage]);
    
    const geoData = useMemo(() => {
        const locations = {};
        usage.forEach(log => {
            const key = `${log.location.city}, ${log.location.country}`;
            if (!locations[key]) {
                locations[key] = { ...log.location, count: 0 };
            }
            locations[key].count++;
        });
        return Object.values(locations);
    }, [usage]);

    return (
        <div className="space-y-8">
            <div>
                <h3 className="text-lg font-semibold text-white mb-4">Requests Over Last 24 Hours</h3>
                <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={usageByHour}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#4A5568" />
                        <XAxis dataKey="hour" stroke="#A0AEC0"/>
                        <YAxis stroke="#A0AEC0"/>
                        <Tooltip contentStyle={{ backgroundColor: '#1A202C', border: '1px solid #4A5568' }}/>
                        <Area type="monotone" dataKey="requests" stroke="#4299E1" fill="#4299E1" fillOpacity={0.3} />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
             <div>
                <h3 className="text-lg font-semibold text-white mb-4">Request Origins</h3>
                <div className="bg-gray-800 rounded-lg p-2 h-96">
                    <ComposableMap projectionConfig={{ scale: 147 }} style={{ width: "100%", height: "100%" }}>
                        <Geographies geography="/features.json">
                            {({ geographies }) =>
                                geographies.map((geo) => <Geography key={geo.rsmKey} geography={geo} fill="#2D3748" stroke="#1A202C" />)
                            }
                        </Geographies>
                        {geoData.map(({ city, lat, lon, count }) => (
                            <Marker key={city} coordinates={[lon, lat]}>
                                <TooltipWrapper content={`${city}: ${count} requests`}>
                                    <circle r={Math.min(2 + count * 0.5, 10)} fill="#4299E1" stroke="#fff" strokeWidth={1} />
                                </TooltipWrapper>
                            </Marker>
                        ))}
                    </ComposableMap>
                </div>
            </div>
        </div>
    );
};

const SecurityCenterTab: FC<{ anomalies: SecurityAnomaly[] }> = ({ anomalies }) => {
    const severityStyles = {
        Critical: 'border-red-500 bg-red-900/20',
        High: 'border-orange-500 bg-orange-900/20',
        Medium: 'border-yellow-500 bg-yellow-900/20',
        Low: 'border-blue-500 bg-blue-900/20',
        Informational: 'border-gray-500 bg-gray-900/20',
    };
    return (
        <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Adaptive Anomaly Detection Engine (AADE)</h3>
            <p className="text-sm text-gray-400">Our AI spymaster, the AADE, has detected the following behavioral anomalies. Each incident is scored and prioritized for your review.</p>
             {anomalies.map(anomaly => (
                <div key={anomaly.id} className={`p-4 rounded-lg border-l-4 ${severityStyles[anomaly.severity]}`}>
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="font-semibold text-white">{anomaly.type}</p>
                            <p className="text-sm text-gray-300">{anomaly.description}</p>
                            <p className="text-xs text-gray-500 mt-1">{new Date(anomaly.timestamp).toLocaleString()}</p>
                        </div>
                        <div className="text-right">
                             <span className={`px-2 py-1 text-xs font-bold rounded-full ${severityStyles[anomaly.severity].replace('border-', 'bg-').replace('/20', '')} text-white`}>
                                {anomaly.severity}
                            </span>
                            <p className="text-xs text-gray-400 mt-1 capitalize">Status: {anomaly.mitigationStatus.replace('_', ' ')}</p>
                        </div>
                    </div>
                    {anomaly.threatIntel && (
                        <div className="mt-4 p-3 bg-gray-800/50 rounded">
                            <h4 className="font-semibold text-sm text-yellow-300 flex items-center"><FiAlertTriangle className="mr-2"/> Proactive Threat Intelligence</h4>
                            <p className="text-xs mt-1">IP Address <span className="font-mono">{anomaly.threatIntel.ipAddress}</span> is associated with:</p>
                            <ul className="list-disc list-inside text-xs pl-2">
                                {anomaly.threatIntel.isProxy && <li>Known Proxy</li>}
                                {anomaly.threatIntel.associatedThreats.map(t => <li key={t}>{t}</li>)}
                            </ul>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};

const AuditTrailTab: FC<{ audit: AuditLog[] }> = ({ audit }) => {
    return (
        <div className="space-y-4">
             <h3 className="text-lg font-semibold text-white">Immutable Audit Trail</h3>
             <div className="max-h-96 overflow-y-auto">
                {audit.map(log => (
                    <div key={log.id} className="flex items-start space-x-4 py-3 border-b border-gray-800 last:border-b-0">
                        <FiFileText className="text-gray-500 mt-1"/>
                        <div>
                            <p className="text-sm"><strong className="text-white">{log.action}</strong> by <strong className="text-white">{log.actor}</strong></p>
                            <p className="text-sm text-gray-400">{log.details}</p>
                            <p className="text-xs text-gray-500">{new Date(log.timestamp).toLocaleString()}</p>
                        </div>
                    </div>
                ))}
             </div>
        </div>
    );
};

const SettingsTab: FC<{apiKey: ApiKey}> = ({apiKey}) => {
    return (
         <div className="space-y-6">
            <div>
                <h3 className="text-lg font-semibold text-white">General Settings</h3>
                <div className="mt-2 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-300">Key Name</label>
                        <input type="text" defaultValue={apiKey.name} className="mt-1 block w-full bg-gray-800 border-gray-700 rounded-md shadow-sm text-white p-2" />
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-300">Description</label>
                        <textarea defaultValue={apiKey.description} rows={3} className="mt-1 block w-full bg-gray-800 border-gray-700 rounded-md shadow-sm text-white p-2" />
                    </div>
                </div>
            </div>
             <div className="border-t border-gray-700 pt-6">
                 <h3 className="text-lg font-semibold text-red-500">Danger Zone</h3>
                 <div className="mt-2 p-4 bg-red-900/20 border border-red-500/50 rounded-lg flex items-center justify-between">
                     <div>
                        <p className="font-semibold">Revoke API Key</p>
                        <p className="text-sm text-gray-300">Once revoked, this key can never be used again. This action is irreversible.</p>
                     </div>
                      <button className="px-4 py-2 bg-red-600 text-white rounded-md font-semibold hover:bg-red-700">Revoke Key</button>
                 </div>
             </div>
         </div>
    );
};

const GenerateApiKeyModal: FC<{ isOpen: boolean, onClose: () => void, onKeyGenerated: (key: ApiKey) => void }> = ({ isOpen, onClose, onKeyGenerated }) => {
    const [step, setStep] = useState(1);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [permissions, setPermissions] = useState<Record<string, Permission['actions']>>({});
    const [isRecommending, setIsRecommending] = useState(false);
    
    const [newKey, setNewKey] = useState<{key: string, apiKey: ApiKey} | null>(null);

    const handleGetRecommendations = async () => {
        setIsRecommending(true);
        const recommended = await mockAiService.getPermissionRecommendations(description);
        setPermissions(recommended);
        setIsRecommending(false);
    };

    const handleGenerateKey = async () => {
        const generated = await mockApiKeysService.generateApiKey({
            name, description, lastUsedAt: null, expiresAt: null, status: 'active', permissions, ipRestrictions: [],
            rateLimitProfile: 'low-volume',
            metadata: { project: 'New Project', environment: 'development', ownerTeam: 'Unassigned' },
            createdBy: 'Current User',
            creatorEmail: 'you@example.com'
        });
        setNewKey(generated);
        onKeyGenerated(generated.apiKey);
        setStep(3);
    };
    
    const reset = () => {
        setStep(1);
        setName('');
        setDescription('');
        setPermissions({});
        setNewKey(null);
    };
    
    const handleClose = () => {
        reset();
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={handleClose} title={step < 3 ? "Generate New API Key" : "API Key Generated Successfully"} size="xl">
            {step === 1 && (
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-white">Step 1: Declare Intent & Purpose</h3>
                    <p className="text-sm text-gray-400">Clearly stating the key's purpose helps our AI recommend the least-privilege permissions and monitor for anomalous behavior.</p>
                     <div>
                        <label className="block text-sm font-medium text-gray-300">Key Name</label>
                        <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="e.g., Production Backend Service" className="mt-1 block w-full bg-gray-800 border-gray-700 rounded-md shadow-sm text-white p-2" />
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-300">Description / Purpose</label>
                        <textarea value={description} onChange={e => setDescription(e.target.value)} rows={4} placeholder="e.g., This key will be used by our primary backend to process user transactions and read profile data." className="mt-1 block w-full bg-gray-800 border-gray-700 rounded-md shadow-sm text-white p-2" />
                    </div>
                    <div className="flex justify-end pt-4">
                        <button onClick={() => setStep(2)} disabled={!name || !description} className="px-4 py-2 bg-blue-600 text-white rounded-md font-semibold hover:bg-blue-700 disabled:bg-gray-600">Next: Configure Permissions</button>
                    </div>
                </div>
            )}
            {step === 2 && (
                <div>
                    <h3 className="text-lg font-semibold text-white">Step 2: Configure Permissions (The Locksmith's Forge)</h3>
                    <div className="my-4 p-4 bg-blue-900/20 border border-blue-500/50 rounded-lg flex items-center justify-between">
                         <div>
                            <p className="font-semibold">AI Least Privilege Recommender</p>
                            <p className="text-sm text-gray-300">Based on your description, our AI can suggest the minimum viable permission set.</p>
                         </div>
                        <button onClick={handleGetRecommendations} disabled={isRecommending} className="px-4 py-2 bg-blue-600 text-white rounded-md font-semibold hover:bg-blue-700 disabled:bg-gray-600 flex items-center">
                            {isRecommending ? <><FiCpu className="animate-spin mr-2"/> Analyzing...</> : "Ask AI for Suggestions"}
                        </button>
                    </div>
                    <div className="max-h-96 overflow-y-auto p-2 bg-gray-800/50 rounded-md">
                        <PermissionSelector value={permissions} onChange={setPermissions} />
                    </div>
                     <div className="flex justify-between pt-6">
                        <button onClick={() => setStep(1)} className="px-4 py-2 bg-gray-600 text-white rounded-md font-semibold hover:bg-gray-700">Back</button>
                        <button onClick={handleGenerateKey} className="px-4 py-2 bg-green-600 text-white rounded-md font-semibold hover:bg-green-700">Generate Key</button>
                    </div>
                </div>
            )}
            {step === 3 && newKey && (
                <div>
                     <div className="p-4 bg-green-900/20 border border-green-500/50 rounded-lg">
                        <h3 className="text-lg font-semibold text-green-300">Your new API key is ready.</h3>
                        <p className="text-sm text-gray-300">Please copy this key and store it securely. For your security, <strong className="text-white">you will not be able to see it again.</strong></p>
                        <div className="mt-4 flex items-center bg-gray-900 p-2 rounded-md">
                            <span className="font-mono text-green-400 flex-grow">{newKey.key}</span>
                            <CopyButton text={newKey.key} />
                        </div>
                     </div>
                     <h3 className="text-lg font-semibold text-white mt-6 mb-2">Omni-Lingual Code Snippet Architect</h3>
                     <p className="text-sm text-gray-400 mb-4">Here are some examples to get you started. We encourage using environment variables to store your key.</p>
                     <CodeSnippetGenerator apiKey={newKey.key} />
                     <div className="flex justify-end pt-6">
                        <button onClick={handleClose} className="px-4 py-2 bg-blue-600 text-white rounded-md font-semibold hover:bg-blue-700">Done</button>
                    </div>
                </div>
            )}
        </Modal>
    );
};

// --- MAIN VIEW COMPONENT ---

const ApiKeysView = () => {
    const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedKey, setSelectedKey] = useState<ApiKey | null>(null);
    const [isGenerateModalOpen, setGenerateModalOpen] = useState(false);
    
    useEffect(() => {
        setIsLoading(true);
        mockApiKeysService.getApiKeys().then(keys => {
            setApiKeys(keys);
            setIsLoading(false);
        });
    }, []);
    
    const handleKeyGenerated = (newKey: ApiKey) => {
        setApiKeys(prev => [...prev, newKey]);
    };

    const handleRevokeKey = async (id: string) => {
        if (window.confirm("Are you sure you want to revoke this key? This action is irreversible.")) {
            const updatedKey = await mockApiKeysService.revokeApiKey(id);
            setApiKeys(prev => prev.map(k => k.id === id ? updatedKey : k));
        }
    };
    
    return (
        <div className="p-8 bg-gray-900 text-white min-h-screen">
            <header className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold flex items-center"><FiKey className="mr-3 text-blue-400"/> The Keys to the Kingdom</h1>
                    <p className="text-gray-400 mt-1">Manage API keys to grant access to the platform's vast library of data and services.</p>
                </div>
                <button onClick={() => setGenerateModalOpen(true)} className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md font-semibold hover:bg-blue-700">
                    <FiPlusCircle className="mr-2"/> Generate New Key
                </button>
            </header>

            {isLoading ? (
                <div className="flex justify-center items-center h-64"><FiCpu className="animate-spin text-5xl text-blue-500"/></div>
            ) : (
                <div className="bg-gray-800/50 border border-gray-700 rounded-lg shadow-lg">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left text-gray-300">
                            <thead className="text-xs text-gray-400 uppercase bg-gray-800">
                                <tr>
                                    <th scope="col" className="px-6 py-3">Name</th>
                                    <th scope="col" className="px-6 py-3">Key Prefix</th>
                                    <th scope="col" className="px-6 py-3">Health</th>
                                    <th scope="col" className="px-6 py-3">Status</th>
                                    <th scope="col" className="px-6 py-3">Last Used</th>
                                    <th scope="col" className="px-6 py-3">Created</th>
                                    <th scope="col" className="px-6 py-3">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {apiKeys.map(key => (
                                    <tr key={key.id} className="border-b border-gray-700 hover:bg-gray-700/50">
                                        <td className="px-6 py-4 font-medium text-white">{key.name}</td>
                                        <td className="px-6 py-4 font-mono">{key.keyPrefix}_...{key.last4}</td>
                                        <td className="px-6 py-4"><HealthScore score={key.healthScore}/></td>
                                        <td className="px-6 py-4"><StatusPill status={key.status} /></td>
                                        <td className="px-6 py-4">{key.lastUsedAt ? new Date(key.lastUsedAt).toLocaleDateString() : 'Never'}</td>
                                        <td className="px-6 py-4">{new Date(key.createdAt).toLocaleDateString()}</td>
                                        <td className="px-6 py-4">
                                            <div className="flex space-x-2">
                                                <TooltipWrapper content="View Details"><button onClick={() => setSelectedKey(key)} className="p-2 hover:bg-gray-600 rounded-full"><FiEye/></button></TooltipWrapper>
                                                <TooltipWrapper content="Rotate Key"><button className="p-2 hover:bg-gray-600 rounded-full"><FiRotateCw/></button></TooltipWrapper>
                                                {key.status !== 'revoked' && <TooltipWrapper content="Revoke Key"><button onClick={() => handleRevokeKey(key.id)} className="p-2 text-red-500 hover:bg-red-900/50 rounded-full"><FiTrash2/></button></TooltipWrapper>}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
            
            <Modal isOpen={!!selectedKey} onClose={() => setSelectedKey(null)} title={`Details for "${selectedKey?.name}"`} size="xl">
                {selectedKey && <ApiKeyDetails apiKey={selectedKey} />}
            </Modal>

            <GenerateApiKeyModal
                isOpen={isGenerateModalOpen}
                onClose={() => setGenerateModalOpen(false)}
                onKeyGenerated={handleKeyGenerated}
            />
        </div>
    );
};

export default ApiKeysView;
```