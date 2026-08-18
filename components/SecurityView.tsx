// REPOSITORY SOURCE: diplomat-bit/aibanking.dev-demai-jocalll3 | PATH: diplomat-bit-aibanking.dev-demai-jocalll3-f8b6983/components/SecurityView.tsx
================================================================================

import React, { useContext, useState } from 'react';
import Card from './Card';
import { DataContext } from '../context/DataContext';
import PlaidLinkButton from './PlaidLinkButton';

const SecurityView: React.FC = () => {
    const context = useContext(DataContext);
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
    const [settings, setSettings] = useState({ twoFactor: true, biometric: false });


    if (!context) {
        throw new Error("SecurityView must be within a DataProvider.");
    }
    const { linkedAccounts, handlePlaidSuccess, unlinkAccount } = context;

    const handleToggle = (setting: 'twoFactor' | 'biometric') => {
        setSettings(prev => ({...prev, [setting]: !prev[setting]}));
    }

    const PasswordModal: React.FC = () => (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 backdrop-blur-sm" onClick={() => setIsPasswordModalOpen(false)}>
            <div className="bg-gray-800 rounded-lg shadow-2xl max-w-md w-full border border-gray-700" onClick={e => e.stopPropagation()}>
                <div className="p-4 border-b border-gray-700">
                    <h3 className="text-lg font-semibold text-white">Change Password</h3>
                </div>
                <div className="p-6 space-y-4">
                    <input type="password" placeholder="Current Password" className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-cyan-500" />
                    <input type="password" placeholder="New Password" className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-cyan-500" />
                    <input type="password" placeholder="Confirm New Password" className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-cyan-500" />
                    <button onClick={() => { alert('Password changed successfully!'); setIsPasswordModalOpen(false); }} className="w-full py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg">Update Password</button>
                </div>
            </div>
        </div>
    );

    return (
        <div className="space-y-6">
            <Card title="Linked Accounts & Data Sources">
                <div className="space-y-4">
                    {linkedAccounts.length > 0 ? (
                        linkedAccounts.map(account => (
                            <div key={account.id} className="flex justify-between items-center p-4 bg-gray-800 rounded-lg">
                                <div>
                                    <h4 className="font-semibold text-white">{account.name}</h4>
                                    <p className="text-sm text-gray-400">Account ending in •••• {account.mask}</p>
                                </div>
                                <button onClick={() => unlinkAccount(account.id)} className="text-xs text-red-400 hover:text-red-300">Unlink</button>
                            </div>
                        ))
                    ) : (
                        <p className="text-center text-gray-400 py-4">You haven't linked any bank accounts yet. Link an account to import your transactions automatically.</p>
                    )}
                    <PlaidLinkButton onSuccess={handlePlaidSuccess} />
                </div>
            </Card>
            
            <Card title="Security Settings">
                <div className="space-y-4">
                    <div className="flex justify-between items-center p-4 bg-gray-800 rounded-lg">
                        <div>
                            <h4 className="font-semibold text-white">Two-Factor Authentication (2FA)</h4>
                            <p className="text-sm text-gray-400">Add an extra layer of security to your account.</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" checked={settings.twoFactor} onChange={() => handleToggle('twoFactor')} className="sr-only peer" />
                          <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-cyan-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-600"></div>
                        </label>
                    </div>
                     <div className="flex justify-between items-center p-4 bg-gray-800 rounded-lg">
                        <div>
                            <h4 className="font-semibold text-white">Biometric Login</h4>
                            <p className="text-sm text-gray-400">Use your fingerprint or face to log in.</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" checked={settings.biometric} onChange={() => handleToggle('biometric')} className="sr-only peer" />
                          <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-cyan-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-600"></div>
                        </label>
                    </div>
                     <div className="flex justify-between items-center p-4 bg-gray-800 rounded-lg">
                         <h4 className="font-semibold text-white">Change Password</h4>
                         <button onClick={() => setIsPasswordModalOpen(true)} className="px-4 py-2 bg-cyan-600/50 hover:bg-cyan-600 text-white rounded-lg text-sm">Change</button>
                    </div>
                </div>
            </Card>

            <Card title="Recent Login Activity">
                <div className="space-y-3">
                    <div className="flex justify-between items-center text-sm p-2 rounded-lg hover:bg-gray-800">
                        <p className="text-gray-300"><span className="font-mono">Chrome on Windows</span> - New York, USA</p>
                        <p className="text-gray-400">Today, 10:30 AM</p>
                    </div>
                    <div className="flex justify-between items-center text-sm p-2 rounded-lg hover:bg-gray-800">
                        <p className="text-gray-300"><span className="font-mono">Safari on macOS</span> - New York, USA</p>
                        <p className="text-gray-400">Yesterday, 8:15 PM</p>
                    </div>
                     <div className="flex justify-between items-center text-sm p-2 rounded-lg hover:bg-gray-800">
                        <p className="text-gray-300"><span className="font-mono">QuantumBank App on iOS</span> - New York, USA</p>
                        <p className="text-gray-400">2 days ago, 11:00 AM</p>
                    </div>
                </div>
            </Card>
            {isPasswordModalOpen && <PasswordModal />}
        </div>
    );
};

export default SecurityView;


================================================================================
// APPENDED FROM REPO: diplomat-bit/aibanking.dev-jocall3-new | ORIGINAL PATH: diplomat-bit-aibanking.dev-jocall3-new-84d7a30/components/SecurityView.tsx
================================================================================


import React, { useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { DataContext } from '../context/DataContext';
import Card from './Card';
import PlaidLinkButton from './PlaidLinkButton';
import { 
    LoginActivity, Device, DataSharingPolicy, TransactionRule, ThreatAlert, 
    AuditLogEntry, APIKey, TrustedContact, SecurityAwarenessModule, SecurityScoreMetric, UserProfile 
} from '../types';

// --- AI/ML Integration Placeholder Types (Simulated for expansion) ---
interface AISecurityInsight {
    id: string;
    timestamp: string;
    severity: 'Low' | 'Medium' | 'High' | 'Critical';
    summary: string;
    recommendation: string;
    sourceModel: string;
}

// --- Constants for Billion Dollar Features ---
const AI_INSIGHT_ENGINE_VERSION = "ChaosEngine v0.0.1-Garbage";
const MAX_AUDIT_LOG_DISPLAY = 5;

// --- Helper Components ---

export const SecuritySettingToggle: React.FC<{
    id: string;
    title: string;
    description: string;
    defaultChecked: boolean;
    onToggle?: (checked: boolean) => void;
    disabled?: boolean;
    aiImpact?: 'High' | 'Medium' | 'Low' | 'None';
}> = ({ id, title, description, defaultChecked, onToggle, disabled, aiImpact = 'None' }) => {
    const [isChecked, setIsChecked] = useState(defaultChecked);
    const { showSystemAlert } = useContext(DataContext) || {};

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newState = e.target.checked;
        setIsChecked(newState);
        onToggle && onToggle(newState);
        
        if (showSystemAlert) {
            const impactColor = aiImpact === 'High' ? 'text-red-400' : aiImpact === 'Medium' ? 'text-yellow-400' : 'text-green-400';
            showSystemAlert(`Configuration Change Detected: ${title} set to ${newState ? 'Enabled' : 'Disabled'}. AI Risk Assessment: ${aiImpact}.`, 'info');
        }
    };

    const aiIndicator = useMemo(() => {
        if (aiImpact === 'None') return null;
        const colorMap = {
            High: 'bg-red-500',
            Medium: 'bg-yellow-500',
            Low: 'bg-blue-500',
        };
        return (
            <span className={`ml-3 px-2 py-0.5 text-xs font-bold rounded-full text-white ${colorMap[aiImpact]}`}>
                AI {aiImpact}
            </span>
        );
    }, [aiImpact]);

    return (
        <li className="py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-gray-800/70">
            <div className="flex-grow">
                <label htmlFor={`toggle-${id}`} className="font-bold text-lg text-white cursor-pointer flex items-center">
                    {title}
                    {aiIndicator}
                </label>
                <p className="text-sm text-gray-400 max-w-xl mt-1">{description}</p>
            </div>
            <div className="flex items-center mt-2 sm:mt-0">
                <span className={`mr-3 text-sm font-medium ${isChecked ? 'text-green-400' : 'text-red-400'}`}>
                    {isChecked ? 'ACTIVE' : 'INACTIVE'}
                </span>
                <input
                    type="checkbox"
                    id={`toggle-${id}`}
                    className="toggle toggle-cyan toggle-lg"
                    checked={isChecked}
                    onChange={handleChange}
                    disabled={disabled}
                    aria-label={`Toggle for ${title}`}
                />
            </div>
        </li>
    );
};

export const NotificationToast: React.FC<{
    message: string;
    type: 'success' | 'error' | 'info' | 'warning' | 'critical';
    onClose: () => void;
    isVisible: boolean;
}> = ({ message, type, onClose, isVisible }) => {
    const typeClasses = {
        success: 'bg-green-700 border-green-500',
        error: 'bg-red-700 border-red-500',
        info: 'bg-blue-700 border-blue-500',
        warning: 'bg-yellow-700 border-yellow-500',
        critical: 'bg-purple-800 border-purple-500'
    };
    
    const iconMap = {
        success: <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
        error: <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
        info: <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
        warning: <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.938 5.002c-.77-1.333-2.688-1.333-3.458 0L3.308 18.002c-.77 1.333.192 3 1.732 3z" /></svg>,
        critical: <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.938 5.002c-.77-1.333-2.688-1.333-3.458 0L3.308 18.002c-.77 1.333.192 3 1.732 3z" /></svg>
    };

    useEffect(() => {
        let timer: ReturnType<typeof setTimeout>;
        if (isVisible) {
            const duration = type === 'critical' ? 15000 : 7000;
            timer = setTimeout(() => { onClose(); }, duration);
        }
        return () => clearTimeout(timer);
    }, [isVisible, onClose, type]);

    if (!isVisible) return null;
    return (
        <div className={`fixed bottom-8 right-8 p-5 rounded-xl shadow-2xl text-white flex items-start space-x-4 transition-all duration-500 ease-out transform border-l-8 ${typeClasses[type]} ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'}`} style={{zIndex: 1000, minWidth: '300px'}}>
            <div className="flex-shrink-0 mt-1">
                {iconMap[type]}
            </div>
            <div className="flex-grow">
                <span className="text-sm font-bold block capitalize">{type} Alert</span>
                <span className="text-base font-medium">{message}</span>
            </div>
            <button onClick={onClose} className="p-1 rounded-full hover:bg-black/20 focus:outline-none flex-shrink-0 mt-0.5 transition-colors">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
        </div>
    );
};

// --- AI Insight Display Component ---
const AISecurityInsightCard: React.FC<{ insight: AISecurityInsight }> = ({ insight }) => {
    const severityClasses = {
        Critical: 'border-red-600 bg-red-900/20 text-red-300',
        High: 'border-orange-600 bg-orange-900/20 text-orange-300',
        Medium: 'border-yellow-600 bg-yellow-900/20 text-yellow-300',
        Low: 'border-green-600 bg-green-900/20 text-green-300',
    };

    return (
        <div className={`p-4 rounded-xl border-l-4 shadow-lg transition-all duration-300 hover:shadow-xl ${severityClasses[insight.severity]}`}>
            <div className="flex justify-between items-start mb-2">
                <h4 className="font-extrabold text-lg">{insight.summary}</h4>
                <span className={`text-xs font-semibold px-2 py-1 rounded-full ${severityClasses[insight.severity].replace('border-', 'bg-').replace('/20', '/40')}`}>{insight.severity}</span>
            </div>
            <p className="text-sm text-gray-300 mb-3">{insight.recommendation}</p>
            <div className="text-xs text-gray-400 flex justify-between border-t border-current pt-2 mt-2">
                <span>Engine: {insight.sourceModel}</span>
                <span>Detected: {new Date(insight.timestamp).toLocaleString()}</span>
            </div>
        </div>
    );
};

// --- Main Component ---

const SecurityView: React.FC = () => {
    const context = useContext(DataContext);
    const { 
        linkedAccounts, unlinkAccount, handlePlaidSuccess, 
        securityMetrics, auditLogs, threatAlerts, 
        dataSharingPolicies, apiKeys, trustedContacts, 
        securityAwarenessModules, showSystemAlert,
        transactionRules 
    } = context || {};

    const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' | 'info' | 'warning' | 'critical'; isVisible: boolean } | null>(null);
    const [loginActivity, setLoginActivity] = useState<LoginActivity[]>([]);
    const [devices, setDevices] = useState<Device[]>([]);
    const [aiInsights, setAiInsights] = useState<AISecurityInsight[]>([]);
    const [activeTab, setActiveTab] = useState<'overview' | 'policies' | 'keys' | 'ai_analysis'>('overview');
    const [securityScore, setSecurityScore] = useState<number>(75); // Initial mock score

    // --- Mock Data Initialization & AI Simulation ---
    useEffect(() => {
        const now = new Date();
        const pastDate = (days: number) => new Date(now.getTime() - days * 24 * 60 * 60 * 1000).toISOString();

        // Mock Login Activity
        setLoginActivity([
            { id: '1', device: 'Quantum Workstation', browser: 'Chrome 125 (Secure)', os: 'Linux Kernel 6.8', location: 'HQ Server Room', ip: '10.0.0.5', timestamp: pastDate(0.01), isCurrent: true, userAgent: 'EnterpriseAgent/1.0' },
            { id: '2', device: 'Personal Mobile', browser: 'Safari', os: 'iOS 18.0 Beta', location: 'Remote Office', ip: '203.0.113.45', timestamp: pastDate(1.5), isCurrent: false, userAgent: 'MobileSafari/605.1.15' },
            { id: '3', device: 'Legacy VM', browser: 'IE 11', os: 'Windows Server 2012', location: 'Decommissioned Zone', ip: '192.168.1.100', timestamp: pastDate(15), isCurrent: false, userAgent: 'MSIE 11.0;' },
        ]);

        // Mock Devices
        setDevices([
            { id: 'dvc_1', name: 'Primary Workstation', type: 'Desktop', model: 'Custom Build X9', lastActivity: pastDate(0.01), location: 'HQ Server Room', ip: '10.0.0.5', isCurrent: true, permissions: ['read_all', 'write_transactions', 'admin_config'], status: 'active', firstSeen: pastDate(500), userAgent: 'EnterpriseAgent/1.0', pushNotificationsEnabled: true, biometricAuthEnabled: true, encryptionStatus: 'AES-256-GCM' },
            { id: 'dvc_2', name: 'Executive Tablet', type: 'Tablet', model: 'Pad Pro 14', lastActivity: pastDate(0.5), location: 'Remote Office', ip: '203.0.113.45', isCurrent: false, permissions: ['read_reports'], status: 'active', firstSeen: pastDate(120), userAgent: 'MobileSafari/605.1.15', pushNotificationsEnabled: false, biometricAuthEnabled: true, encryptionStatus: 'full' },
        ]);

        // Mock AI Insights based on potential issues
        setAiInsights([
            { 
                id: 'ai_001', 
                timestamp: pastDate(0.1), 
                severity: 'High', 
                summary: 'Unusual Data Access Pattern Detected', 
                recommendation: 'Review recent read operations from Device ID dvc_2 between 02:00 and 04:00 UTC. Initiate temporary read-only lock.', 
                sourceModel: 'BehavioralAnomaly_v3' 
            },
            { 
                id: 'ai_002', 
                timestamp: pastDate(1), 
                severity: 'Medium', 
                summary: 'Outdated OS Detected on Active Device', 
                recommendation: 'Update OS on "Legacy VM" (IP 192.168.1.100) to a supported version or isolate it to a sandbox network segment.', 
                sourceModel: 'VulnerabilityScanner_v1' 
            },
        ]);

        // Simulate loading security metrics if available
        if (securityMetrics && securityMetrics.length > 0) {
            const scoreMetric = securityMetrics.find(m => m.metricName === 'OverallSecurityScore');
            if (scoreMetric) {
                setSecurityScore(Math.round(parseFloat(scoreMetric.currentValue) * 100));
            }
        }

    }, [securityMetrics]);

    // --- Handlers ---
    const showNotification = useCallback((message: string, type: 'success' | 'error' | 'info' | 'warning' | 'critical') => {
        setNotification({ message, type, isVisible: true });
    }, []);

    const closeNotification = useCallback(() => {
        setNotification(prev => prev ? { ...prev, isVisible: false } : null);
    }, []);

    const handleUnlink = (id: string) => {
        if (unlinkAccount) {
            unlinkAccount(id);
            showNotification(`Financial Source ID ${id} successfully revoked access.`, 'success');
        }
    };

    const handlePolicyToggle = (policy: DataSharingPolicy, enabled: boolean) => {
        // In a real app, this would call an API to update the policy state
        console.log(`Policy ${policy.policyId} toggled to ${enabled}`);
        showNotification(`Data Sharing Policy "${policy.policyName}" updated to ${enabled ? 'Active' : 'Inactive'}.`, 'info');
    };

    const handleAPIKeyRevoke = (keyId: string) => {
        // In a real app, this would call an API to revoke the key
        showNotification(`API Key ${keyId.substring(0, 8)}... has been immediately revoked and invalidated.`, 'critical');
    };

    // --- Render Helpers ---

    const renderLinkedAccounts = useMemo(() => (
        <Card title="Financial Data Sources (Plaid Integration)" className="lg:col-span-2">
            <div className="space-y-4">
                <p className="text-gray-400 text-sm border-b border-gray-800 pb-3">Securely manage connections to external financial institutions via encrypted tokenization. Last sync: {new Date().toLocaleTimeString()}</p>
                {linkedAccounts && linkedAccounts.length > 0 ? (
                    <div className="space-y-3">
                        {linkedAccounts.map(account => (
                            <div key={account.id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 bg-gray-800/70 rounded-lg border border-cyan-700/50 shadow-md">
                                <div className="flex items-center mb-2 sm:mb-0">
                                    <div className="w-12 h-12 rounded-xl bg-cyan-900/70 flex items-center justify-center text-cyan-300 mr-4 flex-shrink-0">
                                        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" /></svg>
                                    </div>
                                    <div>
                                        <p className="font-bold text-lg text-white">{account.name}</p>
                                        <p className="text-sm text-gray-400">Institution ID: {account.institutionId} | Mask: {account.mask}</p>
                                    </div>
                                </div>
                                <div className="flex space-x-2 mt-2 sm:mt-0">
                                    <button 
                                        onClick={() => showNotification(`Initiating re-authentication for ${account.name}...`, 'info')}
                                        className="px-3 py-1.5 bg-indigo-900/30 hover:bg-indigo-900/50 text-indigo-300 rounded-lg text-sm transition-colors border border-indigo-700"
                                    >
                                        Re-sync
                                    </button>
                                    <button 
                                        onClick={() => handleUnlink(account.id)}
                                        className="px-3 py-1.5 bg-red-900/50 hover:bg-red-900/70 text-red-300 rounded-lg text-sm transition-colors border border-red-700"
                                    >
                                        Revoke Access
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="p-6 bg-gray-800/50 rounded-lg text-center border border-dashed border-gray-700">
                        <p className="text-gray-500 italic mb-3">No external financial data sources are currently integrated.</p>
                        {handlePlaidSuccess && <PlaidLinkButton onSuccess={handlePlaidSuccess} label="Connect New Financial Source" className="w-full sm:w-auto" />}
                    </div>
                )}
            </div>
        </Card>
    ), [linkedAccounts, handlePlaidSuccess, handleUnlink, showNotification]);

    const renderSecuritySettings = useMemo(() => (
        <Card title="Core Authentication & Access Controls" className="lg:col-span-1">
            <ul className="divide-y divide-gray-700/50">
                <SecuritySettingToggle 
                    id="2fa_quantum"
                    title="Quantum 2FA (Hardware Key Required)" 
                    description="Mandatory FIDO2/WebAuthn hardware key enforcement for all administrative roles. Software TOTP is deprecated." 
                    defaultChecked={true} 
                    aiImpact='High'
                />
                <SecuritySettingToggle 
                    id="biometric_device"
                    title="Device Biometric Trust" 
                    description="Enforce device-level biometric verification for any transaction exceeding $10,000 or configuration change." 
                    defaultChecked={true} 
                    aiImpact='Medium'
                />
                <SecuritySettingToggle 
                    id="session_timeout"
                    title="Zero-Trust Session Invalidation" 
                    description="Sessions automatically terminate after 15 minutes of inactivity, requiring re-authentication via context-aware challenge." 
                    defaultChecked={true} 
                    aiImpact='High'
                />
                <li className="py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-gray-800/70">
                     <div className="flex-grow">
                        <span className="font-bold text-lg text-white flex items-center">Master Credential Management</span>
                        <p className="text-sm text-gray-400">Last rotation: 2024-01-15. Next mandatory rotation: 2025-01-15.</p>
                     </div>
                     <button className="px-6 py-2 bg-indigo-700 hover:bg-indigo-600 text-white font-semibold rounded-lg text-sm transition-colors shadow-lg mt-2 sm:mt-0">
                        Initiate Credential Rotation Protocol
                     </button>
                </li>
            </ul>
        </Card>
    ), []);

    const renderRecentActivity = useMemo(() => (
        <Card title="Real-Time Login Telemetry" className="lg:col-span-1">
            <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                {loginActivity.map(activity => (
                    <div key={activity.id} className="flex items-start justify-between p-3 bg-gray-800/50 rounded-lg border-l-4 border-gray-700 hover:bg-gray-700/50 transition-colors">
                        <div className="flex-grow min-w-0">
                            <p className="font-bold text-white truncate flex items-center gap-2">
                                {activity.device}
                                {activity.isCurrent && <span className="px-2 py-0.5 bg-green-600/50 text-green-200 text-xs rounded-full font-medium flex-shrink-0">LIVE SESSION</span>}
                            </p>
                            <p className="text-xs text-gray-400 mt-1">
                                <span className="font-mono bg-gray-700/50 px-1 rounded mr-1">{activity.ip}</span> 
                                @ {activity.location} ({activity.os})
                            </p>
                        </div>
                        <span className="text-xs text-gray-500 ml-2 flex-shrink-0">{new Date(activity.timestamp).toLocaleTimeString()}</span>
                    </div>
                ))}
            </div>
        </Card>
    ), [loginActivity]);

    const renderActiveDevices = useMemo(() => (
        <Card title="Managed Endpoints Inventory" className="lg:col-span-2">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {devices.map(device => (
                    <div key={device.id} className="p-4 bg-gray-800/50 rounded-lg border border-indigo-700/50 flex flex-col shadow-lg">
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-indigo-900/70 rounded-lg flex items-center justify-center text-indigo-300 flex-shrink-0">
                                    {device.type === 'Mobile' ? (
                                         <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
                                    ) : (
                                         <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                                    )}
                                </div>
                                <p className="font-bold text-white truncate">{device.name}</p>
                            </div>
                            <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${device.status === 'active' ? 'bg-green-600/30 text-green-300' : 'bg-red-600/30 text-red-300'}`}>
                                {device.status.toUpperCase()}
                            </span>
                        </div>
                        <p className="text-xs text-gray-400 mb-2">Model: {device.model} ({device.type})</p>
                        <p className="text-xs text-gray-500 truncate">IP: {device.ip} | Last Seen: {new Date(device.lastActivity).toLocaleTimeString()}</p>
                        <div className="mt-3 pt-2 border-t border-gray-700">
                            <p className="text-xs font-semibold text-cyan-400">Permissions Granted: {device.permissions.length}</p>
                            <div className="flex flex-wrap gap-1 mt-1">
                                {device.permissions.slice(0, 3).map(p => (
                                    <span key={p} className="text-[10px] bg-gray-700 text-gray-300 px-1 rounded">{p}</span>
                                ))}
                                {device.permissions.length > 3 && <span className="text-[10px] text-gray-500">+{device.permissions.length - 3} more</span>}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </Card>
    ), [devices]);

    const renderDataPolicies = useMemo(() => (
        <Card title="Data Governance & Sharing Policies" className="lg:col-span-2">
            <p className="text-sm text-gray-400 mb-4">Define granular controls over how internal and external data sets are processed, stored, and shared. Managed by AI Policy Engine.</p>
            <div className="space-y-4">
                {(dataSharingPolicies || []).map(policy => (
                    <div key={policy.policyId} className="p-4 bg-gray-800/70 rounded-lg border border-purple-700/50 flex flex-col md:flex-row justify-between items-start md:items-center">
                        <div className="flex-grow mb-2 md:mb-0">
                            <p className="font-bold text-white text-lg">{policy.policyName}</p>
                            <p className="text-xs text-gray-400 mt-1">Scope: {policy.scope} | Last Reviewed: {policy.lastReviewed}</p>
                        </div>
                        <div className="flex items-center space-x-4">
                            <span className={`text-sm font-semibold ${policy.isActive ? 'text-green-400' : 'text-red-400'}`}>
                                {policy.isActive ? 'ACTIVE' : 'DRAFT'}
                            </span>
                            <SecuritySettingToggle
                                id={`policy-${policy.policyId}`}
                                title="Enable Policy"
                                description={`Toggle activation for ${policy.policyName}`}
                                defaultChecked={policy.isActive}
                                onToggle={(checked) => handlePolicyToggle(policy, checked)}
                                aiImpact='Medium'
                            />
                        </div>
                    </div>
                ))}
            </div>
        </Card>
    ), [dataSharingPolicies, handlePolicyToggle]);

    const renderAPIKeys = useMemo(() => (
        <Card title="System API Key Management" className="lg:col-span-2">
            <p className="text-sm text-gray-400 mb-4">Manage programmatic access tokens. Keys are automatically rotated by the Quantum Key Vault every 90 days.</p>
            <div className="space-y-3">
                {(apiKeys || []).map(key => (
                    <div key={key.id} className="flex justify-between items-center p-3 bg-gray-800/70 rounded-lg border border-yellow-700/50">
                        <div className="flex items-center min-w-0">
                            <svg className="w-5 h-5 text-yellow-400 mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M6 16h.01" /></svg>
                            <div>
                                <p className="font-mono text-sm text-white truncate">{key.keyName} ({key.id.substring(0, 8)}...)</p>
                                <p className="text-xs text-gray-500">Created: {key.creationDate} | Permissions: {key.scopes.join(', ')}</p>
                            </div>
                        </div>
                        <button 
                            onClick={() => handleAPIKeyRevoke(key.id)}
                            className="px-3 py-1 bg-red-900/30 hover:bg-red-900/50 text-red-300 rounded-md text-xs transition-colors flex-shrink-0 ml-4"
                        >
                            Revoke Now
                        </button>
                    </div>
                ))}
            </div>
        </Card>
    ), [apiKeys, handleAPIKeyRevoke]);

    const renderAIAnalysis = useMemo(() => (
        <div className="space-y-6">
            <Card title={`AI Threat Intelligence Feed (${AI_INSIGHT_ENGINE_VERSION})`}>
                <div className="flex justify-between items-center mb-4 border-b border-gray-800 pb-3">
                    <p className="text-gray-400 text-sm">Real-time behavioral analysis and predictive threat modeling.</p>
                    <span className="text-sm font-bold text-cyan-400">Total Insights: {aiInsights.length}</span>
                </div>
                <div className="space-y-4">
                    {aiInsights.length > 0 ? (
                        aiInsights.map(insight => (
                            <AISecurityInsightCard key={insight.id} insight={insight} />
                        ))
                    ) : (
                        <div className="p-6 bg-gray-800/50 rounded-lg text-center border border-dashed border-gray-700">
                            <p className="text-gray-500 italic">AI Engine reports no immediate high-priority anomalies at this time.</p>
                        </div>
                    )}
                </div>
            </Card>

            <Card title="Security Awareness Training Modules">
                <p className="text-sm text-gray-400 mb-4">Track mandatory compliance training completion status across the organization.</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {(securityAwarenessModules || []).map(module => (
                        <div key={module.moduleId} className="p-4 bg-gray-800/70 rounded-lg border border-green-700/50">
                            <p className="font-bold text-white">{module.title}</p>
                            <p className="text-xs text-gray-400 mt-1">Status: {module.completionRate}% Complete</p>
                            <div className="w-full bg-gray-700 rounded-full h-2.5 mt-2">
                                <div className="bg-green-500 h-2.5 rounded-full" style={{ width: `${module.completionRate}%` }}></div>
                            </div>
                        </div>
                    ))}
                </div>
            </Card>
        </div>
    ), [aiInsights, securityAwarenessModules]);

    const renderAuditLogs = useMemo(() => {
        const displayLogs = (auditLogs || []).slice(0, MAX_AUDIT_LOG_DISPLAY);
        return (
            <Card title={`System Audit Trail (Last ${displayLogs.length} Entries)`} className="lg:col-span-2">
                <p className="text-sm text-gray-400 mb-3">Immutable record of all configuration changes, data access events, and administrative actions.</p>
                <div className="overflow-x-auto max-h-[500px] custom-scrollbar">
                    <table className="min-w-full divide-y divide-gray-700">
                        <thead className="sticky top-0 bg-gray-800 z-10">
                            <tr>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Time</th>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">User/System</th>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Action</th>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Target</th>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-800">
                            {displayLogs.map((log: AuditLogEntry) => (
                                <tr key={log.id} className="hover:bg-gray-800/50 transition-colors">
                                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">{new Date(log.timestamp).toLocaleTimeString()}</td>
                                    <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-white">{log.userId.includes('sys_') ? 'SYSTEM' : log.userId}</td>
                                    <td className="px-4 py-2 text-sm text-cyan-400">{log.action}</td>
                                    <td className="px-4 py-2 text-sm text-gray-400">{log.targetResource}</td>
                                    <td className="px-4 py-2 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${log.success ? 'bg-green-900/50 text-green-300' : 'bg-red-900/50 text-red-300'}`}>
                                            {log.success ? 'SUCCESS' : 'FAILURE'}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {displayLogs.length < (auditLogs?.length || 0) && (
                    <p className="text-center text-sm text-gray-500 mt-3">Displaying first {MAX_AUDIT_LOG_DISPLAY} logs. Load full history via dedicated Audit Console.</p>
                )}
            </Card>
        );
    }, [auditLogs]);

    const renderSecurityScoreGauge = useMemo(() => {
        const radius = 50;
        const circumference = 2 * Math.PI * radius;
        const offset = circumference - (securityScore / 100) * circumference;
        const color = securityScore >= 90 ? 'stroke-green-500' : securityScore >= 70 ? 'stroke-yellow-500' : 'stroke-red-500';

        return (
            <div className="flex flex-col items-center p-6 bg-gray-800/70 rounded-xl shadow-inner border border-gray-700">
                <h3 className="text-xl font-bold text-white mb-3">Quantum Security Index (QSI)</h3>
                <svg width="120" height="120" viewBox="0 0 120 120" className="transform -rotate-90">
                    {/* Background Circle */}
                    <circle
                        cx="60"
                        cy="60"
                        r={radius}
                        fill="transparent"
                        stroke="#374151"
                        strokeWidth="10"
                    />
                    {/* Progress Arc */}
                    <circle
                        cx="60"
                        cy="60"
                        r={radius}
                        fill="transparent"
                        stroke={color.replace('stroke-', '')}
                        strokeWidth="10"
                        strokeDasharray={circumference}
                        strokeDashoffset={offset}
                        strokeLinecap="round"
                        className="transition-all duration-1000 ease-out"
                    />
                    {/* Text */}
                    <text
                        x="60"
                        y="60"
                        dominantBaseline="middle"
                        textAnchor="middle"
                        className="fill-current text-white"
                        fontSize="20"
                        fontWeight="bold"
                    >
                        {securityScore}%
                    </text>
                </svg>
                <p className="text-sm text-gray-400 mt-2">Target: 95%</p>
            </div>
        );
    }, [securityScore]);

    const renderTrustedContacts = useMemo(() => (
        <Card title="Emergency Trusted Contacts" className="lg:col-span-1">
            <p className="text-sm text-gray-400 mb-4">Contacts authorized for emergency account recovery or high-risk alerts.</p>
            <div className="space-y-3">
                {(trustedContacts || []).map((contact: TrustedContact) => (
                    <div key={contact.id} className="flex justify-between items-center p-3 bg-gray-800/50 rounded-lg border border-gray-700">
                        <div className="flex items-center">
                            <div className="w-8 h-8 bg-pink-900/50 rounded-full flex items-center justify-center text-pink-300 mr-3">
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                            </div>
                            <div>
                                <p className="font-semibold text-white">{contact.name}</p>
                                <p className="text-xs text-gray-400">{contact.relationship}</p>
                            </div>
                        </div>
                        <span className={`text-xs font-medium px-2 py-0.5 rounded ${contact.verified ? 'bg-green-900/30 text-green-400' : 'bg-red-900/30 text-red-400'}`}>
                            {contact.verified ? 'Verified' : 'Pending'}
                        </span>
                    </div>
                ))}
            </div>
        </Card>
    ), [trustedContacts]);


    // --- Tab Content Rendering ---
    const renderContent = () => {
        switch (activeTab) {
            case 'overview':
                return (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {renderSecurityScoreGauge}
                        {renderRecentActivity}
                        {renderActiveDevices}
                        {renderLinkedAccounts}
                        {renderSecuritySettings}
                    </div>
                );
            case 'policies':
                return (
                    <div className="grid grid-cols-1 gap-6">
                        {renderDataPolicies}
                        <Card title="Transaction Rule Engine" className="lg:col-span-2">
                            <p className="text-sm text-gray-400 mb-4">Define automated responses to financial events based on predefined risk thresholds.</p>
                            <div className="space-y-3">
                                {(transactionRules || []).map((rule: TransactionRule) => (
                                    <div key={rule.ruleId} className="p-3 bg-gray-800/70 rounded-lg border border-cyan-700/50 flex justify-between items-center">
                                        <div>
                                            <p className="font-bold text-white">{rule.name}</p>
                                            <p className="text-xs text-gray-400">Trigger: {rule.triggerCondition} | Action: {rule.action}</p>
                                        </div>
                                        <span className={`text-xs font-medium px-2 py-0.5 rounded ${rule.isEnabled ? 'bg-green-900/30 text-green-400' : 'bg-red-900/30 text-red-400'}`}>
                                            {rule.isEnabled ? 'ACTIVE' : 'DISABLED'}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    </div>
                );
            case 'keys':
                return (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {renderAPIKeys}
                        {renderTrustedContacts}
                        <Card title="Threat Alert History" className="lg:col-span-3">
                            <p className="text-sm text-gray-400 mb-4">Historical record of confirmed security incidents.</p>
                            <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                                {(threatAlerts || []).map((alert: ThreatAlert) => (
                                    <div key={alert.alertId} className="p-3 bg-red-900/30 rounded-lg border border-red-600 flex justify-between items-center">
                                        <div>
                                            <p className="font-bold text-red-300">{alert.title}</p>
                                            <p className="text-xs text-gray-300">{alert.description}</p>
                                        </div>
                                        <span className="text-xs text-gray-300">{new Date(alert.timestamp).toLocaleDateString()}</span>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    </div>
                );
            case 'ai_analysis':
                return (
                    <div className="grid grid-cols-1 gap-6">
                        {renderAIAnalysis}
                        {renderAuditLogs}
                    </div>
                );
            default:
                return null;
        }
    };

    // --- Tab Navigation ---
    const tabs: { id: typeof activeTab, label: string }[] = [
        { id: 'overview', label: 'Overview & Access' },
        { id: 'policies', label: 'Governance & Rules' },
        { id: 'keys', label: 'API & Contacts' },
        { id: 'ai_analysis', label: 'AI Threat Analysis' },
    ];

    return (
        <div className="space-y-8 p-4 sm:p-8">
            <header className="pb-4 border-b border-gray-700">
                <h1 className="text-4xl font-extrabold text-white tracking-tighter">Enterprise Security Command Center</h1>
                <p className="text-lg text-gray-400 mt-1">Centralized control plane for data integrity, access management, and threat mitigation. Engine Version: {AI_INSIGHT_ENGINE_VERSION}</p>
            </header>

            {/* Tab Navigation */}
            <div className="flex border-b border-gray-700 overflow-x-auto">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`px-6 py-3 text-lg font-semibold transition-all duration-300 whitespace-nowrap
                            ${activeTab === tab.id 
                                ? 'text-cyan-400 border-b-4 border-cyan-500' 
                                : 'text-gray-400 hover:text-white hover:border-b-4 hover:border-gray-600'
                            }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            <main>
                {renderContent()}
            </main>

            {notification && (
                <NotificationToast 
                    message={notification.message} 
                    type={notification.type} 
                    isVisible={notification.isVisible} 
                    onClose={closeNotification} 
                />
            )}
        </div>
    );
};

export default SecurityView;


================================================================================
// APPENDED FROM REPO: diplomat-bit/almost | ORIGINAL PATH: diplomat-bit-almost-93a5466/components/SecurityView (1).tsx
================================================================================


import React, { useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { DataContext } from '../context/DataContext';
import Card from './Card';
import PlaidLinkButton from './PlaidLinkButton';
import { 
    LoginActivity, Device, DataSharingPolicy, TransactionRule, ThreatAlert, 
    AuditLogEntry, APIKey, TrustedContact, SecurityAwarenessModule, SecurityScoreMetric, UserProfile 
} from '../types';

// --- AI/ML Integration Placeholder Types (Simulated for expansion) ---
interface AISecurityInsight {
    id: string;
    timestamp: string;
    severity: 'Low' | 'Medium' | 'High' | 'Critical';
    summary: string;
    recommendation: string;
    sourceModel: string;
}

// --- Constants for Billion Dollar Features ---
const AI_INSIGHT_ENGINE_VERSION = "ChaosEngine v0.0.1-Garbage";
const MAX_AUDIT_LOG_DISPLAY = 5;

// --- Helper Components ---

export const SecuritySettingToggle: React.FC<{
    id: string;
    title: string;
    description: string;
    defaultChecked: boolean;
    onToggle?: (checked: boolean) => void;
    disabled?: boolean;
    aiImpact?: 'High' | 'Medium' | 'Low' | 'None';
}> = ({ id, title, description, defaultChecked, onToggle, disabled, aiImpact = 'None' }) => {
    const [isChecked, setIsChecked] = useState(defaultChecked);
    const { showSystemAlert } = useContext(DataContext) || {};

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newState = e.target.checked;
        setIsChecked(newState);
        onToggle && onToggle(newState);
        
        if (showSystemAlert) {
            const impactColor = aiImpact === 'High' ? 'text-red-400' : aiImpact === 'Medium' ? 'text-yellow-400' : 'text-green-400';
            showSystemAlert(`Configuration Change Detected: ${title} set to ${newState ? 'Enabled' : 'Disabled'}. AI Risk Assessment: ${aiImpact}.`, 'info');
        }
    };

    const aiIndicator = useMemo(() => {
        if (aiImpact === 'None') return null;
        const colorMap = {
            High: 'bg-red-500',
            Medium: 'bg-yellow-500',
            Low: 'bg-blue-500',
        };
        return (
            <span className={`ml-3 px-2 py-0.5 text-xs font-bold rounded-full text-white ${colorMap[aiImpact]}`}>
                AI {aiImpact}
            </span>
        );
    }, [aiImpact]);

    return (
        <li className="py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-gray-800/70">
            <div className="flex-grow">
                <label htmlFor={`toggle-${id}`} className="font-bold text-lg text-white cursor-pointer flex items-center">
                    {title}
                    {aiIndicator}
                </label>
                <p className="text-sm text-gray-400 max-w-xl mt-1">{description}</p>
            </div>
            <div className="flex items-center mt-2 sm:mt-0">
                <span className={`mr-3 text-sm font-medium ${isChecked ? 'text-green-400' : 'text-red-400'}`}>
                    {isChecked ? 'ACTIVE' : 'INACTIVE'}
                </span>
                <input
                    type="checkbox"
                    id={`toggle-${id}`}
                    className="toggle toggle-cyan toggle-lg"
                    checked={isChecked}
                    onChange={handleChange}
                    disabled={disabled}
                    aria-label={`Toggle for ${title}`}
                />
            </div>
        </li>
    );
};

export const NotificationToast: React.FC<{
    message: string;
    type: 'success' | 'error' | 'info' | 'warning' | 'critical';
    onClose: () => void;
    isVisible: boolean;
}> = ({ message, type, onClose, isVisible }) => {
    const typeClasses = {
        success: 'bg-green-700 border-green-500',
        error: 'bg-red-700 border-red-500',
        info: 'bg-blue-700 border-blue-500',
        warning: 'bg-yellow-700 border-yellow-500',
        critical: 'bg-purple-800 border-purple-500'
    };
    
    const iconMap = {
        success: <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
        error: <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
        info: <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
        warning: <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.938 5.002c-.77-1.333-2.688-1.333-3.458 0L3.308 18.002c-.77 1.333.192 3 1.732 3z" /></svg>,
        critical: <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.938 5.002c-.77-1.333-2.688-1.333-3.458 0L3.308 18.002c-.77 1.333.192 3 1.732 3z" /></svg>
    };

    useEffect(() => {
        let timer: ReturnType<typeof setTimeout>;
        if (isVisible) {
            const duration = type === 'critical' ? 15000 : 7000;
            timer = setTimeout(() => { onClose(); }, duration);
        }
        return () => clearTimeout(timer);
    }, [isVisible, onClose, type]);

    if (!isVisible) return null;
    return (
        <div className={`fixed bottom-8 right-8 p-5 rounded-xl shadow-2xl text-white flex items-start space-x-4 transition-all duration-500 ease-out transform border-l-8 ${typeClasses[type]} ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'}`} style={{zIndex: 1000, minWidth: '300px'}}>
            <div className="flex-shrink-0 mt-1">
                {iconMap[type]}
            </div>
            <div className="flex-grow">
                <span className="text-sm font-bold block capitalize">{type} Alert</span>
                <span className="text-base font-medium">{message}</span>
            </div>
            <button onClick={onClose} className="p-1 rounded-full hover:bg-black/20 focus:outline-none flex-shrink-0 mt-0.5 transition-colors">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
        </div>
    );
};

// --- AI Insight Display Component ---
const AISecurityInsightCard: React.FC<{ insight: AISecurityInsight }> = ({ insight }) => {
    const severityClasses = {
        Critical: 'border-red-600 bg-red-900/20 text-red-300',
        High: 'border-orange-600 bg-orange-900/20 text-orange-300',
        Medium: 'border-yellow-600 bg-yellow-900/20 text-yellow-300',
        Low: 'border-green-600 bg-green-900/20 text-green-300',
    };

    return (
        <div className={`p-4 rounded-xl border-l-4 shadow-lg transition-all duration-300 hover:shadow-xl ${severityClasses[insight.severity]}`}>
            <div className="flex justify-between items-start mb-2">
                <h4 className="font-extrabold text-lg">{insight.summary}</h4>
                <span className={`text-xs font-semibold px-2 py-1 rounded-full ${severityClasses[insight.severity].replace('border-', 'bg-').replace('/20', '/40')}`}>{insight.severity}</span>
            </div>
            <p className="text-sm text-gray-300 mb-3">{insight.recommendation}</p>
            <div className="text-xs text-gray-400 flex justify-between border-t border-current pt-2 mt-2">
                <span>Engine: {insight.sourceModel}</span>
                <span>Detected: {new Date(insight.timestamp).toLocaleString()}</span>
            </div>
        </div>
    );
};

// --- Main Component ---

const SecurityView: React.FC = () => {
    const context = useContext(DataContext);
    const { 
        linkedAccounts, unlinkAccount, handlePlaidSuccess, 
        securityMetrics, auditLogs, threatAlerts, 
        dataSharingPolicies, apiKeys, trustedContacts, 
        securityAwarenessModules, showSystemAlert,
        transactionRules 
    } = context || {};

    const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' | 'info' | 'warning' | 'critical'; isVisible: boolean } | null>(null);
    const [loginActivity, setLoginActivity] = useState<LoginActivity[]>([]);
    const [devices, setDevices] = useState<Device[]>([]);
    const [aiInsights, setAiInsights] = useState<AISecurityInsight[]>([]);
    const [activeTab, setActiveTab] = useState<'overview' | 'policies' | 'keys' | 'ai_analysis'>('overview');
    const [securityScore, setSecurityScore] = useState<number>(75); // Initial mock score

    // --- Mock Data Initialization & AI Simulation ---
    useEffect(() => {
        const now = new Date();
        const pastDate = (days: number) => new Date(now.getTime() - days * 24 * 60 * 60 * 1000).toISOString();

        // Mock Login Activity
        setLoginActivity([
            { id: '1', device: 'Quantum Workstation', browser: 'Chrome 125 (Secure)', os: 'Linux Kernel 6.8', location: 'HQ Server Room', ip: '10.0.0.5', timestamp: pastDate(0.01), isCurrent: true, userAgent: 'EnterpriseAgent/1.0' },
            { id: '2', device: 'Personal Mobile', browser: 'Safari', os: 'iOS 18.0 Beta', location: 'Remote Office', ip: '203.0.113.45', timestamp: pastDate(1.5), isCurrent: false, userAgent: 'MobileSafari/605.1.15' },
            { id: '3', device: 'Legacy VM', browser: 'IE 11', os: 'Windows Server 2012', location: 'Decommissioned Zone', ip: '192.168.1.100', timestamp: pastDate(15), isCurrent: false, userAgent: 'MSIE 11.0;' },
        ]);

        // Mock Devices
        setDevices([
            { id: 'dvc_1', name: 'Primary Workstation', type: 'Desktop', model: 'Custom Build X9', lastActivity: pastDate(0.01), location: 'HQ Server Room', ip: '10.0.0.5', isCurrent: true, permissions: ['read_all', 'write_transactions', 'admin_config'], status: 'active', firstSeen: pastDate(500), userAgent: 'EnterpriseAgent/1.0', pushNotificationsEnabled: true, biometricAuthEnabled: true, encryptionStatus: 'AES-256-GCM' },
            { id: 'dvc_2', name: 'Executive Tablet', type: 'Tablet', model: 'Pad Pro 14', lastActivity: pastDate(0.5), location: 'Remote Office', ip: '203.0.113.45', isCurrent: false, permissions: ['read_reports'], status: 'active', firstSeen: pastDate(120), userAgent: 'MobileSafari/605.1.15', pushNotificationsEnabled: false, biometricAuthEnabled: true, encryptionStatus: 'full' },
        ]);

        // Mock AI Insights based on potential issues
        setAiInsights([
            { 
                id: 'ai_001', 
                timestamp: pastDate(0.1), 
                severity: 'High', 
                summary: 'Unusual Data Access Pattern Detected', 
                recommendation: 'Review recent read operations from Device ID dvc_2 between 02:00 and 04:00 UTC. Initiate temporary read-only lock.', 
                sourceModel: 'BehavioralAnomaly_v3' 
            },
            { 
                id: 'ai_002', 
                timestamp: pastDate(1), 
                severity: 'Medium', 
                summary: 'Outdated OS Detected on Active Device', 
                recommendation: 'Update OS on "Legacy VM" (IP 192.168.1.100) to a supported version or isolate it to a sandbox network segment.', 
                sourceModel: 'VulnerabilityScanner_v1' 
            },
        ]);

        // Simulate loading security metrics if available
        if (securityMetrics && securityMetrics.length > 0) {
            const scoreMetric = securityMetrics.find(m => m.metricName === 'OverallSecurityScore');
            if (scoreMetric) {
                setSecurityScore(Math.round(parseFloat(scoreMetric.currentValue) * 100));
            }
        }

    }, [securityMetrics]);

    // --- Handlers ---
    const showNotification = useCallback((message: string, type: 'success' | 'error' | 'info' | 'warning' | 'critical') => {
        setNotification({ message, type, isVisible: true });
    }, []);

    const closeNotification = useCallback(() => {
        setNotification(prev => prev ? { ...prev, isVisible: false } : null);
    }, []);

    const handleUnlink = (id: string) => {
        if (unlinkAccount) {
            unlinkAccount(id);
            showNotification(`Financial Source ID ${id} successfully revoked access.`, 'success');
        }
    };

    const handlePolicyToggle = (policy: DataSharingPolicy, enabled: boolean) => {
        // In a real app, this would call an API to update the policy state
        console.log(`Policy ${policy.policyId} toggled to ${enabled}`);
        showNotification(`Data Sharing Policy "${policy.policyName}" updated to ${enabled ? 'Active' : 'Inactive'}.`, 'info');
    };

    const handleAPIKeyRevoke = (keyId: string) => {
        // In a real app, this would call an API to revoke the key
        showNotification(`API Key ${keyId.substring(0, 8)}... has been immediately revoked and invalidated.`, 'critical');
    };

    // --- Render Helpers ---

    const renderLinkedAccounts = useMemo(() => (
        <Card title="Financial Data Sources (Plaid Integration)" className="lg:col-span-2">
            <div className="space-y-4">
                <p className="text-gray-400 text-sm border-b border-gray-800 pb-3">Securely manage connections to external financial institutions via encrypted tokenization. Last sync: {new Date().toLocaleTimeString()}</p>
                {linkedAccounts && linkedAccounts.length > 0 ? (
                    <div className="space-y-3">
                        {linkedAccounts.map(account => (
                            <div key={account.id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 bg-gray-800/70 rounded-lg border border-cyan-700/50 shadow-md">
                                <div className="flex items-center mb-2 sm:mb-0">
                                    <div className="w-12 h-12 rounded-xl bg-cyan-900/70 flex items-center justify-center text-cyan-300 mr-4 flex-shrink-0">
                                        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" /></svg>
                                    </div>
                                    <div>
                                        <p className="font-bold text-lg text-white">{account.name}</p>
                                        <p className="text-sm text-gray-400">Institution ID: {account.institutionId} | Mask: {account.mask}</p>
                                    </div>
                                </div>
                                <div className="flex space-x-2 mt-2 sm:mt-0">
                                    <button 
                                        onClick={() => showNotification(`Initiating re-authentication for ${account.name}...`, 'info')}
                                        className="px-3 py-1.5 bg-indigo-900/30 hover:bg-indigo-900/50 text-indigo-300 rounded-lg text-sm transition-colors border border-indigo-700"
                                    >
                                        Re-sync
                                    </button>
                                    <button 
                                        onClick={() => handleUnlink(account.id)}
                                        className="px-3 py-1.5 bg-red-900/50 hover:bg-red-900/70 text-red-300 rounded-lg text-sm transition-colors border border-red-700"
                                    >
                                        Revoke Access
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="p-6 bg-gray-800/50 rounded-lg text-center border border-dashed border-gray-700">
                        <p className="text-gray-500 italic mb-3">No external financial data sources are currently integrated.</p>
                        {handlePlaidSuccess && <PlaidLinkButton onSuccess={handlePlaidSuccess} label="Connect New Financial Source" className="w-full sm:w-auto" />}
                    </div>
                )}
            </div>
        </Card>
    ), [linkedAccounts, handlePlaidSuccess, handleUnlink, showNotification]);

    const renderSecuritySettings = useMemo(() => (
        <Card title="Core Authentication & Access Controls" className="lg:col-span-1">
            <ul className="divide-y divide-gray-700/50">
                <SecuritySettingToggle 
                    id="2fa_quantum"
                    title="Quantum 2FA (Hardware Key Required)" 
                    description="Mandatory FIDO2/WebAuthn hardware key enforcement for all administrative roles. Software TOTP is deprecated." 
                    defaultChecked={true} 
                    aiImpact='High'
                />
                <SecuritySettingToggle 
                    id="biometric_device"
                    title="Device Biometric Trust" 
                    description="Enforce device-level biometric verification for any transaction exceeding $10,000 or configuration change." 
                    defaultChecked={true} 
                    aiImpact='Medium'
                />
                <SecuritySettingToggle 
                    id="session_timeout"
                    title="Zero-Trust Session Invalidation" 
                    description="Sessions automatically terminate after 15 minutes of inactivity, requiring re-authentication via context-aware challenge." 
                    defaultChecked={true} 
                    aiImpact='High'
                />
                <li className="py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-gray-800/70">
                     <div className="flex-grow">
                        <span className="font-bold text-lg text-white flex items-center">Master Credential Management</span>
                        <p className="text-sm text-gray-400">Last rotation: 2024-01-15. Next mandatory rotation: 2025-01-15.</p>
                     </div>
                     <button className="px-6 py-2 bg-indigo-700 hover:bg-indigo-600 text-white font-semibold rounded-lg text-sm transition-colors shadow-lg mt-2 sm:mt-0">
                        Initiate Credential Rotation Protocol
                     </button>
                </li>
            </ul>
        </Card>
    ), []);

    const renderRecentActivity = useMemo(() => (
        <Card title="Real-Time Login Telemetry" className="lg:col-span-1">
            <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                {loginActivity.map(activity => (
                    <div key={activity.id} className="flex items-start justify-between p-3 bg-gray-800/50 rounded-lg border-l-4 border-gray-700 hover:bg-gray-700/50 transition-colors">
                        <div className="flex-grow min-w-0">
                            <p className="font-bold text-white truncate flex items-center gap-2">
                                {activity.device}
                                {activity.isCurrent && <span className="px-2 py-0.5 bg-green-600/50 text-green-200 text-xs rounded-full font-medium flex-shrink-0">LIVE SESSION</span>}
                            </p>
                            <p className="text-xs text-gray-400 mt-1">
                                <span className="font-mono bg-gray-700/50 px-1 rounded mr-1">{activity.ip}</span> 
                                @ {activity.location} ({activity.os})
                            </p>
                        </div>
                        <span className="text-xs text-gray-500 ml-2 flex-shrink-0">{new Date(activity.timestamp).toLocaleTimeString()}</span>
                    </div>
                ))}
            </div>
        </Card>
    ), [loginActivity]);

    const renderActiveDevices = useMemo(() => (
        <Card title="Managed Endpoints Inventory" className="lg:col-span-2">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {devices.map(device => (
                    <div key={device.id} className="p-4 bg-gray-800/50 rounded-lg border border-indigo-700/50 flex flex-col shadow-lg">
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-indigo-900/70 rounded-lg flex items-center justify-center text-indigo-300 flex-shrink-0">
                                    {device.type === 'Mobile' ? (
                                         <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
                                    ) : (
                                         <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                                    )}
                                </div>
                                <p className="font-bold text-white truncate">{device.name}</p>
                            </div>
                            <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${device.status === 'active' ? 'bg-green-600/30 text-green-300' : 'bg-red-600/30 text-red-300'}`}>
                                {device.status.toUpperCase()}
                            </span>
                        </div>
                        <p className="text-xs text-gray-400 mb-2">Model: {device.model} ({device.type})</p>
                        <p className="text-xs text-gray-500 truncate">IP: {device.ip} | Last Seen: {new Date(device.lastActivity).toLocaleTimeString()}</p>
                        <div className="mt-3 pt-2 border-t border-gray-700">
                            <p className="text-xs font-semibold text-cyan-400">Permissions Granted: {device.permissions.length}</p>
                            <div className="flex flex-wrap gap-1 mt-1">
                                {device.permissions.slice(0, 3).map(p => (
                                    <span key={p} className="text-[10px] bg-gray-700 text-gray-300 px-1 rounded">{p}</span>
                                ))}
                                {device.permissions.length > 3 && <span className="text-[10px] text-gray-500">+{device.permissions.length - 3} more</span>}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </Card>
    ), [devices]);

    const renderDataPolicies = useMemo(() => (
        <Card title="Data Governance & Sharing Policies" className="lg:col-span-2">
            <p className="text-sm text-gray-400 mb-4">Define granular controls over how internal and external data sets are processed, stored, and shared. Managed by AI Policy Engine.</p>
            <div className="space-y-4">
                {(dataSharingPolicies || []).map(policy => (
                    <div key={policy.policyId} className="p-4 bg-gray-800/70 rounded-lg border border-purple-700/50 flex flex-col md:flex-row justify-between items-start md:items-center">
                        <div className="flex-grow mb-2 md:mb-0">
                            <p className="font-bold text-white text-lg">{policy.policyName}</p>
                            <p className="text-xs text-gray-400 mt-1">Scope: {policy.scope} | Last Reviewed: {policy.lastReviewed}</p>
                        </div>
                        <div className="flex items-center space-x-4">
                            <span className={`text-sm font-semibold ${policy.isActive ? 'text-green-400' : 'text-red-400'}`}>
                                {policy.isActive ? 'ACTIVE' : 'DRAFT'}
                            </span>
                            <SecuritySettingToggle
                                id={`policy-${policy.policyId}`}
                                title="Enable Policy"
                                description={`Toggle activation for ${policy.policyName}`}
                                defaultChecked={policy.isActive}
                                onToggle={(checked) => handlePolicyToggle(policy, checked)}
                                aiImpact='Medium'
                            />
                        </div>
                    </div>
                ))}
            </div>
        </Card>
    ), [dataSharingPolicies, handlePolicyToggle]);

    const renderAPIKeys = useMemo(() => (
        <Card title="System API Key Management" className="lg:col-span-2">
            <p className="text-sm text-gray-400 mb-4">Manage programmatic access tokens. Keys are automatically rotated by the Quantum Key Vault every 90 days.</p>
            <div className="space-y-3">
                {(apiKeys || []).map(key => (
                    <div key={key.id} className="flex justify-between items-center p-3 bg-gray-800/70 rounded-lg border border-yellow-700/50">
                        <div className="flex items-center min-w-0">
                            <svg className="w-5 h-5 text-yellow-400 mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M6 16h.01" /></svg>
                            <div>
                                <p className="font-mono text-sm text-white truncate">{key.keyName} ({key.id.substring(0, 8)}...)</p>
                                <p className="text-xs text-gray-500">Created: {key.creationDate} | Permissions: {key.scopes.join(', ')}</p>
                            </div>
                        </div>
                        <button 
                            onClick={() => handleAPIKeyRevoke(key.id)}
                            className="px-3 py-1 bg-red-900/30 hover:bg-red-900/50 text-red-300 rounded-md text-xs transition-colors flex-shrink-0 ml-4"
                        >
                            Revoke Now
                        </button>
                    </div>
                ))}
            </div>
        </Card>
    ), [apiKeys, handleAPIKeyRevoke]);

    const renderAIAnalysis = useMemo(() => (
        <div className="space-y-6">
            <Card title={`AI Threat Intelligence Feed (${AI_INSIGHT_ENGINE_VERSION})`}>
                <div className="flex justify-between items-center mb-4 border-b border-gray-800 pb-3">
                    <p className="text-gray-400 text-sm">Real-time behavioral analysis and predictive threat modeling.</p>
                    <span className="text-sm font-bold text-cyan-400">Total Insights: {aiInsights.length}</span>
                </div>
                <div className="space-y-4">
                    {aiInsights.length > 0 ? (
                        aiInsights.map(insight => (
                            <AISecurityInsightCard key={insight.id} insight={insight} />
                        ))
                    ) : (
                        <div className="p-6 bg-gray-800/50 rounded-lg text-center border border-dashed border-gray-700">
                            <p className="text-gray-500 italic">AI Engine reports no immediate high-priority anomalies at this time.</p>
                        </div>
                    )}
                </div>
            </Card>

            <Card title="Security Awareness Training Modules">
                <p className="text-sm text-gray-400 mb-4">Track mandatory compliance training completion status across the organization.</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {(securityAwarenessModules || []).map(module => (
                        <div key={module.moduleId} className="p-4 bg-gray-800/70 rounded-lg border border-green-700/50">
                            <p className="font-bold text-white">{module.title}</p>
                            <p className="text-xs text-gray-400 mt-1">Status: {module.completionRate}% Complete</p>
                            <div className="w-full bg-gray-700 rounded-full h-2.5 mt-2">
                                <div className="bg-green-500 h-2.5 rounded-full" style={{ width: `${module.completionRate}%` }}></div>
                            </div>
                        </div>
                    ))}
                </div>
            </Card>
        </div>
    ), [aiInsights, securityAwarenessModules]);

    const renderAuditLogs = useMemo(() => {
        const displayLogs = (auditLogs || []).slice(0, MAX_AUDIT_LOG_DISPLAY);
        return (
            <Card title={`System Audit Trail (Last ${displayLogs.length} Entries)`} className="lg:col-span-2">
                <p className="text-sm text-gray-400 mb-3">Immutable record of all configuration changes, data access events, and administrative actions.</p>
                <div className="overflow-x-auto max-h-[500px] custom-scrollbar">
                    <table className="min-w-full divide-y divide-gray-700">
                        <thead className="sticky top-0 bg-gray-800 z-10">
                            <tr>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Time</th>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">User/System</th>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Action</th>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Target</th>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-800">
                            {displayLogs.map((log: AuditLogEntry) => (
                                <tr key={log.id} className="hover:bg-gray-800/50 transition-colors">
                                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">{new Date(log.timestamp).toLocaleTimeString()}</td>
                                    <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-white">{log.userId.includes('sys_') ? 'SYSTEM' : log.userId}</td>
                                    <td className="px-4 py-2 text-sm text-cyan-400">{log.action}</td>
                                    <td className="px-4 py-2 text-sm text-gray-400">{log.targetResource}</td>
                                    <td className="px-4 py-2 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${log.success ? 'bg-green-900/50 text-green-300' : 'bg-red-900/50 text-red-300'}`}>
                                            {log.success ? 'SUCCESS' : 'FAILURE'}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {displayLogs.length < (auditLogs?.length || 0) && (
                    <p className="text-center text-sm text-gray-500 mt-3">Displaying first {MAX_AUDIT_LOG_DISPLAY} logs. Load full history via dedicated Audit Console.</p>
                )}
            </Card>
        );
    }, [auditLogs]);

    const renderSecurityScoreGauge = useMemo(() => {
        const radius = 50;
        const circumference = 2 * Math.PI * radius;
        const offset = circumference - (securityScore / 100) * circumference;
        const color = securityScore >= 90 ? 'stroke-green-500' : securityScore >= 70 ? 'stroke-yellow-500' : 'stroke-red-500';

        return (
            <div className="flex flex-col items-center p-6 bg-gray-800/70 rounded-xl shadow-inner border border-gray-700">
                <h3 className="text-xl font-bold text-white mb-3">Quantum Security Index (QSI)</h3>
                <svg width="120" height="120" viewBox="0 0 120 120" className="transform -rotate-90">
                    {/* Background Circle */}
                    <circle
                        cx="60"
                        cy="60"
                        r={radius}
                        fill="transparent"
                        stroke="#374151"
                        strokeWidth="10"
                    />
                    {/* Progress Arc */}
                    <circle
                        cx="60"
                        cy="60"
                        r={radius}
                        fill="transparent"
                        stroke={color.replace('stroke-', '')}
                        strokeWidth="10"
                        strokeDasharray={circumference}
                        strokeDashoffset={offset}
                        strokeLinecap="round"
                        className="transition-all duration-1000 ease-out"
                    />
                    {/* Text */}
                    <text
                        x="60"
                        y="60"
                        dominantBaseline="middle"
                        textAnchor="middle"
                        className="fill-current text-white"
                        fontSize="20"
                        fontWeight="bold"
                    >
                        {securityScore}%
                    </text>
                </svg>
                <p className="text-sm text-gray-400 mt-2">Target: 95%</p>
            </div>
        );
    }, [securityScore]);

    const renderTrustedContacts = useMemo(() => (
        <Card title="Emergency Trusted Contacts" className="lg:col-span-1">
            <p className="text-sm text-gray-400 mb-4">Contacts authorized for emergency account recovery or high-risk alerts.</p>
            <div className="space-y-3">
                {(trustedContacts || []).map((contact: TrustedContact) => (
                    <div key={contact.id} className="flex justify-between items-center p-3 bg-gray-800/50 rounded-lg border border-gray-700">
                        <div className="flex items-center">
                            <div className="w-8 h-8 bg-pink-900/50 rounded-full flex items-center justify-center text-pink-300 mr-3">
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                            </div>
                            <div>
                                <p className="font-semibold text-white">{contact.name}</p>
                                <p className="text-xs text-gray-400">{contact.relationship}</p>
                            </div>
                        </div>
                        <span className={`text-xs font-medium px-2 py-0.5 rounded ${contact.verified ? 'bg-green-900/30 text-green-400' : 'bg-red-900/30 text-red-400'}`}>
                            {contact.verified ? 'Verified' : 'Pending'}
                        </span>
                    </div>
                ))}
            </div>
        </Card>
    ), [trustedContacts]);


    // --- Tab Content Rendering ---
    const renderContent = () => {
        switch (activeTab) {
            case 'overview':
                return (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {renderSecurityScoreGauge}
                        {renderRecentActivity}
                        {renderActiveDevices}
                        {renderLinkedAccounts}
                        {renderSecuritySettings}
                    </div>
                );
            case 'policies':
                return (
                    <div className="grid grid-cols-1 gap-6">
                        {renderDataPolicies}
                        <Card title="Transaction Rule Engine" className="lg:col-span-2">
                            <p className="text-sm text-gray-400 mb-4">Define automated responses to financial events based on predefined risk thresholds.</p>
                            <div className="space-y-3">
                                {(transactionRules || []).map((rule: TransactionRule) => (
                                    <div key={rule.ruleId} className="p-3 bg-gray-800/70 rounded-lg border border-cyan-700/50 flex justify-between items-center">
                                        <div>
                                            <p className="font-bold text-white">{rule.name}</p>
                                            <p className="text-xs text-gray-400">Trigger: {rule.triggerCondition} | Action: {rule.action}</p>
                                        </div>
                                        <span className={`text-xs font-medium px-2 py-0.5 rounded ${rule.isEnabled ? 'bg-green-900/30 text-green-400' : 'bg-red-900/30 text-red-400'}`}>
                                            {rule.isEnabled ? 'ACTIVE' : 'DISABLED'}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    </div>
                );
            case 'keys':
                return (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {renderAPIKeys}
                        {renderTrustedContacts}
                        <Card title="Threat Alert History" className="lg:col-span-3">
                            <p className="text-sm text-gray-400 mb-4">Historical record of confirmed security incidents.</p>
                            <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                                {(threatAlerts || []).map((alert: ThreatAlert) => (
                                    <div key={alert.alertId} className="p-3 bg-red-900/30 rounded-lg border border-red-600 flex justify-between items-center">
                                        <div>
                                            <p className="font-bold text-red-300">{alert.title}</p>
                                            <p className="text-xs text-gray-300">{alert.description}</p>
                                        </div>
                                        <span className="text-xs text-gray-300">{new Date(alert.timestamp).toLocaleDateString()}</span>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    </div>
                );
            case 'ai_analysis':
                return (
                    <div className="grid grid-cols-1 gap-6">
                        {renderAIAnalysis}
                        {renderAuditLogs}
                    </div>
                );
            default:
                return null;
        }
    };

    // --- Tab Navigation ---
    const tabs: { id: typeof activeTab, label: string }[] = [
        { id: 'overview', label: 'Overview & Access' },
        { id: 'policies', label: 'Governance & Rules' },
        { id: 'keys', label: 'API & Contacts' },
        { id: 'ai_analysis', label: 'AI Threat Analysis' },
    ];

    return (
        <div className="space-y-8 p-4 sm:p-8">
            <header className="pb-4 border-b border-gray-700">
                <h1 className="text-4xl font-extrabold text-white tracking-tighter">Enterprise Security Command Center</h1>
                <p className="text-lg text-gray-400 mt-1">Centralized control plane for data integrity, access management, and threat mitigation. Engine Version: {AI_INSIGHT_ENGINE_VERSION}</p>
            </header>

            {/* Tab Navigation */}
            <div className="flex border-b border-gray-700 overflow-x-auto">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`px-6 py-3 text-lg font-semibold transition-all duration-300 whitespace-nowrap
                            ${activeTab === tab.id 
                                ? 'text-cyan-400 border-b-4 border-cyan-500' 
                                : 'text-gray-400 hover:text-white hover:border-b-4 hover:border-gray-600'
                            }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            <main>
                {renderContent()}
            </main>

            {notification && (
                <NotificationToast 
                    message={notification.message} 
                    type={notification.type} 
                    isVisible={notification.isVisible} 
                    onClose={closeNotification} 
                />
            )}
        </div>
    );
};

export default SecurityView;


================================================================================
// APPENDED FROM REPO: diplomat-bit/almost | ORIGINAL PATH: diplomat-bit-almost-93a5466/components/SecurityView (5).tsx
================================================================================

import React, { useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { DataContext } from '../context/DataContext';
import Card from './Card';
import PlaidLinkButton from './PlaidLinkButton';
import { 
    LoginActivity, Device, DataSharingPolicy, TransactionRule, ThreatAlert, 
    AuditLogEntry, APIKey, TrustedContact, SecurityAwarenessModule, SecurityScoreMetric, UserProfile 
} from '../types';

// --- AI/ML & Future Tech Integration Placeholder Types (Massively Expanded) ---
interface AISecurityInsight {
    id: string;
    timestamp: string;
    severity: 'Low' | 'Medium' | 'High' | 'Critical';
    summary: string;
    recommendation: string;
    sourceModel: string;
    relatedEntities: string[]; // e.g., ['dvc_1', 'user_abc']
}

interface HFTAlgorithmRule {
    id: string;
    name: string;
    description: string;
    targetAlgorithm: string;
    condition: string;
    action: 'PAUSE_ALGO' | 'ALERT_ONLY' | 'THROTTLE_ORDERS' | 'EXECUTE_COUNTER_TRADE';
    isEnabled: boolean;
    lastTriggered: string | null;
}

interface QuantumEncryptionStatus {
    id: string;
    systemComponent: string;
    algorithm: 'NTRU-HPS' | 'Kyber' | 'Dilithium' | 'SPHINCS+' | 'Legacy (RSA-4096)';
    status: 'MIGRATED' | 'PENDING' | 'AT_RISK' | 'FAILED';
    migrationEta: string;
    quantumThreatVector: string;
}

interface SecurityIncident {
    id: string;
    title: string;
    severity: 'Low' | 'Medium' | 'High' | 'Critical';
    status: 'Open' | 'Investigating' | 'Resolved' | 'Contained';
    reportedBy: string;
    timestamp: string;
    assignedTo: string;
    summary: string;
}

// --- GEIN (Global Enterprise Intelligence Network) Types ---
interface GEINStreamChunk {
    id: string;
    timestamp: string;
    sourceNode: string;
    dataType: 'TRANSACTION' | 'LOG' | 'THREAT_SIG' | 'USER_BEHAVIOR' | 'NETWORK_PACKET';
    payload: string;
    geinScore: number; // 0-1 confidence score of relevance
}

interface GEINConsoleMessage {
    id: string;
    role: 'user' | 'gein' | 'system';
    text: string;
    isStreaming?: boolean;
}

interface CognitiveCoreStatus {
    name: string;
    status: 'NOMINAL' | 'DEGRADED' | 'OFFLINE' | 'THINKING';
    load: number; // Percentage
    primaryTask: string;
}

// --- Constants for Billion Dollar Features ---
const AI_INSIGHT_ENGINE_VERSION = "GEIN Cognitive Engine v3.0-Hydra";
const MAX_AUDIT_LOG_DISPLAY = 10;
const GLOBAL_LOCKDOWN_STATE = false; // Simulated global state

// --- Helper Components ---

export const SecuritySettingToggle: React.FC<{
    id: string;
    title: string;
    description: string;
    defaultChecked: boolean;
    onToggle?: (checked: boolean) => void;
    disabled?: boolean;
    aiImpact?: 'High' | 'Medium' | 'Low' | 'None';
}> = ({ id, title, description, defaultChecked, onToggle, disabled, aiImpact = 'None' }) => {
    const [isChecked, setIsChecked] = useState(defaultChecked);
    const { showSystemAlert } = useContext(DataContext) || {};

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newState = e.target.checked;
        setIsChecked(newState);
        onToggle && onToggle(newState);
        
        if (showSystemAlert) {
            const impactColor = aiImpact === 'High' ? 'text-red-400' : aiImpact === 'Medium' ? 'text-yellow-400' : 'text-green-400';
            showSystemAlert(`Configuration Change Detected: ${title} set to ${newState ? 'Enabled' : 'Disabled'}. AI Risk Assessment: ${aiImpact}.`, 'info');
        }
    };

    const aiIndicator = useMemo(() => {
        if (aiImpact === 'None') return null;
        const colorMap = {
            High: 'bg-red-500',
            Medium: 'bg-yellow-500',
            Low: 'bg-blue-500',
        };
        return (
            <span className={`ml-3 px-2 py-0.5 text-xs font-bold rounded-full text-white ${colorMap[aiImpact]}`}>
                AI {aiImpact}
            </span>
        );
    }, [aiImpact]);

    return (
        <li className="py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-gray-800/70">
            <div className="flex-grow">
                <label htmlFor={`toggle-${id}`} className="font-bold text-lg text-white cursor-pointer flex items-center">
                    {title}
                    {aiIndicator}
                </label>
                <p className="text-sm text-gray-400 max-w-xl mt-1">{description}</p>
            </div>
            <div className="flex items-center mt-2 sm:mt-0">
                <span className={`mr-3 text-sm font-medium ${isChecked ? 'text-green-400' : 'text-red-400'}`}>
                    {isChecked ? 'ACTIVE' : 'INACTIVE'}
                </span>
                <input
                    type="checkbox"
                    id={`toggle-${id}`}
                    className="toggle toggle-cyan toggle-lg"
                    checked={isChecked}
                    onChange={handleChange}
                    disabled={disabled}
                    aria-label={`Toggle for ${title}`}
                />
            </div>
        </li>
    );
};

export const NotificationToast: React.FC<{
    message: string;
    type: 'success' | 'error' | 'info' | 'warning' | 'critical';
    onClose: () => void;
    isVisible: boolean;
}> = ({ message, type, onClose, isVisible }) => {
    const typeClasses = {
        success: 'bg-green-700 border-green-500',
        error: 'bg-red-700 border-red-500',
        info: 'bg-blue-700 border-blue-500',
        warning: 'bg-yellow-700 border-yellow-500',
        critical: 'bg-purple-800 border-purple-500'
    };
    
    const iconMap = {
        success: <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
        error: <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
        info: <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
        warning: <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.938 5.002c-.77-1.333-2.688-1.333-3.458 0L3.308 18.002c-.77 1.333.192 3 1.732 3z" /></svg>,
        critical: <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.938 5.002c-.77-1.333-2.688-1.333-3.458 0L3.308 18.002c-.77 1.333.192 3 1.732 3z" /></svg>
    };

    useEffect(() => {
        let timer: ReturnType<typeof setTimeout>;
        if (isVisible) {
            const duration = type === 'critical' ? 15000 : 7000;
            timer = setTimeout(() => { onClose(); }, duration);
        }
        return () => clearTimeout(timer);
    }, [isVisible, onClose, type]);

    if (!isVisible) return null;
    return (
        <div className={`fixed bottom-8 right-8 p-5 rounded-xl shadow-2xl text-white flex items-start space-x-4 transition-all duration-500 ease-out transform border-l-8 ${typeClasses[type]} ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'}`} style={{zIndex: 1000, minWidth: '300px'}}>
            <div className="flex-shrink-0 mt-1">
                {iconMap[type]}
            </div>
            <div className="flex-grow">
                <span className="text-sm font-bold block capitalize">{type} Alert</span>
                <span className="text-base font-medium">{message}</span>
            </div>
            <button onClick={onClose} className="p-1 rounded-full hover:bg-black/20 focus:outline-none flex-shrink-0 mt-0.5 transition-colors">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
        </div>
    );
};

const AISecurityInsightCard: React.FC<{ insight: AISecurityInsight }> = ({ insight }) => {
    const severityClasses = {
        Critical: 'border-red-600 bg-red-900/20 text-red-300',
        High: 'border-orange-600 bg-orange-900/20 text-orange-300',
        Medium: 'border-yellow-600 bg-yellow-900/20 text-yellow-300',
        Low: 'border-green-600 bg-green-900/20 text-green-300',
    };

    return (
        <div className={`p-4 rounded-xl border-l-4 shadow-lg transition-all duration-300 hover:shadow-xl ${severityClasses[insight.severity]}`}>
            <div className="flex justify-between items-start mb-2">
                <h4 className="font-extrabold text-lg">{insight.summary}</h4>
                <span className={`text-xs font-semibold px-2 py-1 rounded-full ${severityClasses[insight.severity].replace('border-', 'bg-').replace('/20', '/40')}`}>{insight.severity}</span>
            </div>
            <p className="text-sm text-gray-300 mb-3">{insight.recommendation}</p>
            <div className="text-xs text-gray-400 flex justify-between border-t border-current pt-2 mt-2">
                <span>Engine: {insight.sourceModel}</span>
                <span>Detected: {new Date(insight.timestamp).toLocaleString()}</span>
            </div>
        </div>
    );
};

// --- Main Component ---

const SecurityView: React.FC = () => {
    const context = useContext(DataContext);
    const { 
        linkedAccounts, unlinkAccount, handlePlaidSuccess, 
        securityMetrics, auditLogs, threatAlerts, 
        dataSharingPolicies, apiKeys, trustedContacts, 
        securityAwarenessModules, showSystemAlert 
    } = context || {};

    const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' | 'info' | 'warning' | 'critical'; isVisible: boolean } | null>(null);
    const [loginActivity, setLoginActivity] = useState<LoginActivity[]>([]);
    const [devices, setDevices] = useState<Device[]>([]);
    const [aiInsights, setAiInsights] = useState<AISecurityInsight[]>([]);
    const [hftRules, setHftRules] = useState<HFTAlgorithmRule[]>([]);
    const [quantumStatuses, setQuantumStatuses] = useState<QuantumEncryptionStatus[]>([]);
    const [incidents, setIncidents] = useState<SecurityIncident[]>([]);
    const [activeTab, setActiveTab] = useState<'overview' | 'policies' | 'keys' | 'ai_analysis' | 'hft' | 'quantum' | 'incidents' | 'gein_command'>('overview');
    const [securityScore, setSecurityScore] = useState<number>(75);

    // --- GEIN State ---
    const [geinConsoleHistory, setGeinConsoleHistory] = useState<GEINConsoleMessage[]>([]);
    const [geinInputStream, setGeinInputStream] = useState<GEINStreamChunk[]>([]);
    const [geinSystemInstruction, setGeinSystemInstruction] = useState<string>("You are GEIN, a global enterprise intelligence network. Your purpose is to provide unparalleled, real-time security analysis with a focus on predictive threat mitigation. Be concise, authoritative, and data-driven.");
    const [geinThinkingBudget, setGeinThinkingBudget] = useState<number>(5000); // Default budget
    const [cognitiveCores, setCognitiveCores] = useState<CognitiveCoreStatus[]>([]);
    const [geinConsoleInput, setGeinConsoleInput] = useState<string>("");

    // --- Mock Data Initialization & AI Simulation ---
    useEffect(() => {
        const now = new Date();
        const pastDate = (days: number) => new Date(now.getTime() - days * 24 * 60 * 60 * 1000).toISOString();

        setLoginActivity([
            { id: '1', device: 'Quantum Workstation', browser: 'Chrome 125 (Secure)', os: 'Linux Kernel 6.8', location: 'HQ Server Room', ip: '10.0.0.5', timestamp: pastDate(0.01), isCurrent: true, userAgent: 'EnterpriseAgent/1.0' },
            { id: '2', device: 'Personal Mobile', browser: 'Safari', os: 'iOS 18.0 Beta', location: 'Remote Office', ip: '203.0.113.45', timestamp: pastDate(1.5), isCurrent: false, userAgent: 'MobileSafari/605.1.15' },
            { id: '3', device: 'Legacy VM', browser: 'IE 11', os: 'Windows Server 2012', location: 'Decommissioned Zone', ip: '192.168.1.100', timestamp: pastDate(15), isCurrent: false, userAgent: 'MSIE 11.0;' },
        ]);

        setDevices([
            { id: 'dvc_1', name: 'Primary Workstation', type: 'Desktop', model: 'Custom Build X9', lastActivity: pastDate(0.01), location: 'HQ Server Room', ip: '10.0.0.5', isCurrent: true, permissions: ['read_all', 'write_transactions', 'admin_config'], status: 'active', firstSeen: pastDate(500), userAgent: 'EnterpriseAgent/1.0', pushNotificationsEnabled: true, biometricAuthEnabled: true, encryptionStatus: 'AES-256-GCM' },
            { id: 'dvc_2', name: 'Executive Tablet', type: 'Tablet', model: 'Pad Pro 14', lastActivity: pastDate(0.5), location: 'Remote Office', ip: '203.0.113.45', isCurrent: false, permissions: ['read_reports'], status: 'active', firstSeen: pastDate(120), userAgent: 'MobileSafari/605.1.15', pushNotificationsEnabled: false, biometricAuthEnabled: true, encryptionStatus: 'full' },
        ]);

        setAiInsights([
            { id: 'ai_001', timestamp: pastDate(0.1), severity: 'High', summary: 'Unusual Data Access Pattern Detected', recommendation: 'Review recent read operations from Device ID dvc_2 between 02:00 and 04:00 UTC. Initiate temporary read-only lock.', sourceModel: 'BehavioralAnomaly_v3', relatedEntities: ['dvc_2'] },
            { id: 'ai_002', timestamp: pastDate(1), severity: 'Medium', summary: 'Outdated OS Detected on Active Device', recommendation: 'Update OS on "Legacy VM" (IP 192.168.1.100) to a supported version or isolate it to a sandbox network segment.', sourceModel: 'VulnerabilityScanner_v1', relatedEntities: ['dvc_3'] },
            { id: 'ai_003', timestamp: pastDate(2), severity: 'Critical', summary: 'Potential HFT Algo Manipulation Detected', recommendation: 'Circuit breaker triggered for "MomentumBot_v9". Review order book for spoofing patterns. All related API keys have been frozen.', sourceModel: 'MarketIntegrity_v4', relatedEntities: ['hft_rule_1', 'api_key_2'] },
        ]);

        setHftRules([
            { id: 'hft_rule_1', name: 'Flash Crash Circuit Breaker', description: 'Automatically pauses all trading algorithms if market index drops > 5% in 2 minutes.', targetAlgorithm: 'All', condition: 'INDEX_DROP > 5%', action: 'PAUSE_ALGO', isEnabled: true, lastTriggered: pastDate(2) },
            { id: 'hft_rule_2', name: 'Latency Anomaly Alert', description: 'Alerts trading desk if order execution latency exceeds 10ms for any algorithm.', targetAlgorithm: 'All', condition: 'LATENCY > 10ms', action: 'ALERT_ONLY', isEnabled: true, lastTriggered: pastDate(0.2) },
            { id: 'hft_rule_3', name: 'Counter-Trade on Spoofing', description: 'Executes a small counter-trade if AI detects high-confidence order book spoofing.', targetAlgorithm: 'MarketMaker_v3', condition: 'AI_SPOOF_CONFIDENCE > 0.95', action: 'EXECUTE_COUNTER_TRADE', isEnabled: false, lastTriggered: null },
        ]);

        setQuantumStatuses([
            { id: 'qs_1', systemComponent: 'Core Transaction Ledger', algorithm: 'Dilithium', status: 'MIGRATED', migrationEta: 'Complete', quantumThreatVector: 'Shor\'s Algorithm' },
            { id: 'qs_2', systemComponent: 'API Key Vault', algorithm: 'Kyber', status: 'PENDING', migrationEta: 'Q3 2025', quantumThreatVector: 'Shor\'s Algorithm' },
            { id: 'qs_3', systemComponent: 'User Authentication DB', algorithm: 'NTRU-HPS', status: 'MIGRATED', migrationEta: 'Complete', quantumThreatVector: 'Grover\'s Algorithm' },
            { id: 'qs_4', systemComponent: 'Legacy Reporting System', algorithm: 'Legacy (RSA-4096)', status: 'AT_RISK', migrationEta: 'Q1 2026', quantumThreatVector: 'Shor\'s Algorithm' },
        ]);

        setIncidents([
            { id: 'inc_1', title: 'Phishing Attempt on Executive Account', severity: 'Medium', status: 'Resolved', reportedBy: 'user_jane_doe', timestamp: pastDate(5), assignedTo: 'secops_team_a', summary: 'Targeted phishing email detected and blocked. User credentials rotated as a precaution.' },
            { id: 'inc_2', title: 'DDoS Attack on Public API Gateway', severity: 'High', status: 'Contained', reportedBy: 'SYSTEM_MONITOR', timestamp: pastDate(1), assignedTo: 'netops_team', summary: 'Volumetric attack mitigated by cloud provider. Monitoring for residual effects.' },
        ]);

        // GEIN Initialization
        setGeinConsoleHistory([{ id: 'init', role: 'system', text: 'GEIN Cognitive Engine v3.0-Hydra online. Awaiting operator command.' }]);
        setCognitiveCores([
            { name: 'Predictive Analytics', status: 'NOMINAL', load: 78, primaryTask: 'Market Volatility Forecasting' },
            { name: 'Threat Correlation', status: 'NOMINAL', load: 65, primaryTask: 'Cross-referencing Dark Web Intel' },
            { name: 'Quantum Heuristics', status: 'NOMINAL', load: 42, primaryTask: 'Simulating PQC Algorithm Failure Modes' },
            { name: 'Behavioral Biometrics', status: 'DEGRADED', load: 95, primaryTask: 'Re-calibrating User Keystroke Dynamics' },
        ]);

        if (securityMetrics && securityMetrics.length > 0) {
            const scoreMetric = securityMetrics.find(m => m.metricName === 'OverallSecurityScore');
            if (scoreMetric) setSecurityScore(Math.round(parseFloat(scoreMetric.currentValue) * 100));
        }

        // Simulate GEIN data stream
        const streamInterval = setInterval(() => {
            const dataTypes: GEINStreamChunk['dataType'][] = ['TRANSACTION', 'LOG', 'THREAT_SIG', 'USER_BEHAVIOR', 'NETWORK_PACKET'];
            const sources = ['LD4', 'AWS-US-EAST-1', 'HK-EXCHANGE', 'DARK-WEB-MONITOR', 'INTERNAL-AUDIT'];
            const newChunk: GEINStreamChunk = {
                id: `strm_${Date.now()}`,
                timestamp: new Date().toISOString(),
                sourceNode: sources[Math.floor(Math.random() * sources.length)],
                dataType: dataTypes[Math.floor(Math.random() * dataTypes.length)],
                payload: `0x${[...Array(16)].map(() => Math.floor(Math.random() * 16).toString(16)).join('')}`,
                geinScore: Math.random(),
            };
            setGeinInputStream(prev => [newChunk, ...prev.slice(0, 99)]);
        }, 1500);

        return () => clearInterval(streamInterval);

    }, [securityMetrics]);

    // --- Handlers ---
    const showNotification = useCallback((message: string, type: 'success' | 'error' | 'info' | 'warning' | 'critical') => {
        setNotification({ message, type, isVisible: true });
    }, []);

    const closeNotification = useCallback(() => {
        setNotification(prev => prev ? { ...prev, isVisible: false } : null);
    }, []);

    const handleUnlink = (id: string) => {
        if (unlinkAccount) {
            unlinkAccount(id);
            showNotification(`Financial Source ID ${id} successfully revoked access.`, 'success');
        }
    };

    const handlePolicyToggle = (policy: DataSharingPolicy, enabled: boolean) => {
        console.log(`Policy ${policy.policyId} toggled to ${enabled}`);
        showNotification(`Data Sharing Policy "${policy.policyName}" updated to ${enabled ? 'Active' : 'Inactive'}.`, 'info');
    };

    const handleAPIKeyRevoke = (keyId: string) => {
        showNotification(`API Key ${keyId.substring(0, 8)}... has been immediately revoked and invalidated.`, 'critical');
    };

    const handleGlobalLockdown = () => {
        const confirmation = window.confirm("CRITICAL ACTION: Are you sure you want to initiate Global Lockdown Protocol? This will immediately freeze all transactions, terminate all user sessions, and restrict API access.");
        if (confirmation) {
            showNotification("GLOBAL LOCKDOWN PROTOCOL INITIATED. System entering restricted state.", 'critical');
            // In a real app, this would trigger a series of critical API calls.
        }
    };

    const handleGeinQuery = async () => {
        if (!geinConsoleInput.trim()) return;

        const userMessage: GEINConsoleMessage = { id: `user_${Date.now()}`, role: 'user', text: geinConsoleInput };
        setGeinConsoleHistory(prev => [...prev, userMessage]);
        setGeinConsoleInput("");

        // Simulate GEIN "thinking" and streaming response
        const geinResponseId = `gein_${Date.now()}`;
        const thinkingMessage: GEINConsoleMessage = { id: geinResponseId, role: 'gein', text: '', isStreaming: true };
        setGeinConsoleHistory(prev => [...prev, thinkingMessage]);

        const responseChunks = [
            "Analyzing query against ",
            `${geinInputStream.length} real-time data points... `,
            "Correlating with active threat vectors... ",
            "CONFIRMED: The anomalous activity on dvc_2 correlates with a new zero-day exploit signature (CVE-2025-9999) detected by the Dark Web Monitor node. ",
            "RECOMMENDATION: Isolate dvc_2 immediately. ",
            "Execute containment protocol 'Chimera'. ",
            "I have already drafted the execution plan. Awaiting your authorization."
        ];

        let currentText = "";
        for (const chunk of responseChunks) {
            await new Promise(resolve => setTimeout(resolve, Math.random() * 200 + 50));
            currentText += chunk;
            setGeinConsoleHistory(prev => prev.map(msg => 
                msg.id === geinResponseId ? { ...msg, text: currentText } : msg
            ));
        }

        setGeinConsoleHistory(prev => prev.map(msg => 
            msg.id === geinResponseId ? { ...msg, isStreaming: false } : msg
        ));
    };

    // --- Render Helpers ---

    const renderLinkedAccounts = useMemo(() => (
        <Card title="Financial Data Sources (Plaid Integration)" className="lg:col-span-2">
            <div className="space-y-4">
                <p className="text-gray-400 text-sm border-b border-gray-800 pb-3">Securely manage connections to external financial institutions via encrypted tokenization. Last sync: {new Date().toLocaleTimeString()}</p>
                {linkedAccounts && linkedAccounts.length > 0 ? (
                    <div className="space-y-3">
                        {linkedAccounts.map(account => (
                            <div key={account.id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 bg-gray-800/70 rounded-lg border border-cyan-700/50 shadow-md">
                                <div className="flex items-center mb-2 sm:mb-0">
                                    <div className="w-12 h-12 rounded-xl bg-cyan-900/70 flex items-center justify-center text-cyan-300 mr-4 flex-shrink-0">
                                        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" /></svg>
                                    </div>
                                    <div>
                                        <p className="font-bold text-lg text-white">{account.name}</p>
                                        <p className="text-sm text-gray-400">Institution ID: {account.institutionId} | Mask: {account.mask}</p>
                                    </div>
                                </div>
                                <div className="flex space-x-2 mt-2 sm:mt-0">
                                    <button onClick={() => showNotification(`Initiating re-authentication for ${account.name}...`, 'info')} className="px-3 py-1.5 bg-indigo-900/30 hover:bg-indigo-900/50 text-indigo-300 rounded-lg text-sm transition-colors border border-indigo-700">Re-sync</button>
                                    <button onClick={() => handleUnlink(account.id)} className="px-3 py-1.5 bg-red-900/50 hover:bg-red-900/70 text-red-300 rounded-lg text-sm transition-colors border border-red-700">Revoke Access</button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="p-6 bg-gray-800/50 rounded-lg text-center border border-dashed border-gray-700">
                        <p className="text-gray-500 italic mb-3">No external financial data sources are currently integrated.</p>
                        {handlePlaidSuccess && <PlaidLinkButton onSuccess={handlePlaidSuccess} label="Connect New Financial Source" className="w-full sm:w-auto" />}
                    </div>
                )}
            </div>
        </Card>
    ), [linkedAccounts, handlePlaidSuccess, handleUnlink, showNotification]);

    const renderSecuritySettings = useMemo(() => (
        <Card title="Core Authentication & Access Controls" className="lg:col-span-1">
            <ul className="divide-y divide-gray-700/50">
                <SecuritySettingToggle id="2fa_quantum" title="Quantum 2FA (Hardware Key Required)" description="Mandatory FIDO2/WebAuthn hardware key enforcement for all administrative roles. Software TOTP is deprecated." defaultChecked={true} aiImpact='High' />
                <SecuritySettingToggle id="biometric_device" title="Device Biometric Trust" description="Enforce device-level biometric verification for any transaction exceeding $10,000 or configuration change." defaultChecked={true} aiImpact='Medium' />
                <SecuritySettingToggle id="session_timeout" title="Zero-Trust Session Invalidation" description="Sessions automatically terminate after 15 minutes of inactivity, requiring re-authentication via context-aware challenge." defaultChecked={true} aiImpact='High' />
                <li className="py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-gray-800/70">
                     <div className="flex-grow">
                        <span className="font-bold text-lg text-white flex items-center">Master Credential Management</span>
                        <p className="text-sm text-gray-400">Last rotation: 2024-01-15. Next mandatory rotation: 2025-01-15.</p>
                     </div>
                     <button className="px-6 py-2 bg-indigo-700 hover:bg-indigo-600 text-white font-semibold rounded-lg text-sm transition-colors shadow-lg mt-2 sm:mt-0">Initiate Credential Rotation Protocol</button>
                </li>
            </ul>
        </Card>
    ), []);

    const renderRecentActivity = useMemo(() => (
        <Card title="Real-Time Login Telemetry" className="lg:col-span-1">
            <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                {loginActivity.map(activity => (
                    <div key={activity.id} className="flex items-start justify-between p-3 bg-gray-800/50 rounded-lg border-l-4 border-gray-700 hover:bg-gray-700/50 transition-colors">
                        <div className="flex-grow min-w-0">
                            <p className="font-bold text-white truncate flex items-center gap-2">{activity.device}{activity.isCurrent && <span className="px-2 py-0.5 bg-green-600/50 text-green-200 text-xs rounded-full font-medium flex-shrink-0">LIVE SESSION</span>}</p>
                            <p className="text-xs text-gray-400 mt-1"><span className="font-mono bg-gray-700/50 px-1 rounded mr-1">{activity.ip}</span> @ {activity.location} ({activity.os})</p>
                        </div>
                        <span className="text-xs text-gray-500 ml-2 flex-shrink-0">{new Date(activity.timestamp).toLocaleTimeString()}</span>
                    </div>
                ))}
            </div>
        </Card>
    ), [loginActivity]);

    const renderActiveDevices = useMemo(() => (
        <Card title="Managed Endpoints Inventory" className="lg:col-span-2">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {devices.map(device => (
                    <div key={device.id} className="p-4 bg-gray-800/50 rounded-lg border border-indigo-700/50 flex flex-col shadow-lg">
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-indigo-900/70 rounded-lg flex items-center justify-center text-indigo-300 flex-shrink-0">{device.type === 'Mobile' ? (<svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>) : (<svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>)}</div>
                                <p className="font-bold text-white truncate">{device.name}</p>
                            </div>
                            <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${device.status === 'active' ? 'bg-green-600/30 text-green-300' : 'bg-red-600/30 text-red-300'}`}>{device.status.toUpperCase()}</span>
                        </div>
                        <p className="text-xs text-gray-400 mb-2">Model: {device.model} ({device.type})</p>
                        <p className="text-xs text-gray-500 truncate">IP: {device.ip} | Last Seen: {new Date(device.lastActivity).toLocaleTimeString()}</p>
                        <div className="mt-3 pt-2 border-t border-gray-700">
                            <p className="text-xs font-semibold text-cyan-400">Permissions Granted: {device.permissions.length}</p>
                            <div className="flex flex-wrap gap-1 mt-1">{device.permissions.slice(0, 3).map(p => (<span key={p} className="text-[10px] bg-gray-700 text-gray-300 px-1 rounded">{p}</span>))}{device.permissions.length > 3 && <span className="text-[10px] text-gray-500">+{device.permissions.length - 3} more</span>}</div>
                        </div>
                    </div>
                ))}
            </div>
        </Card>
    ), [devices]);

    const renderDataPolicies = useMemo(() => (
        <Card title="Data Governance & Sharing Policies" className="lg:col-span-2">
            <p className="text-sm text-gray-400 mb-4">Define granular controls over how internal and external data sets are processed, stored, and shared. Managed by AI Policy Engine.</p>
            <div className="space-y-4">
                {(dataSharingPolicies || []).map(policy => (
                    <div key={policy.policyId} className="p-4 bg-gray-800/70 rounded-lg border border-purple-700/50 flex flex-col md:flex-row justify-between items-start md:items-center">
                        <div className="flex-grow mb-2 md:mb-0">
                            <p className="font-bold text-white text-lg">{policy.policyName}</p>
                            <p className="text-xs text-gray-400 mt-1">Scope: {policy.scope} | Last Reviewed: {policy.lastReviewed}</p>
                        </div>
                        <div className="flex items-center space-x-4">
                            <span className={`text-sm font-semibold ${policy.isActive ? 'text-green-400' : 'text-red-400'}`}>{policy.isActive ? 'ACTIVE' : 'DRAFT'}</span>
                            <SecuritySettingToggle id={`policy-${policy.policyId}`} title="Enable Policy" description={`Toggle activation for ${policy.policyName}`} defaultChecked={policy.isActive} onToggle={(checked) => handlePolicyToggle(policy, checked)} aiImpact='Medium' />
                        </div>
                    </div>
                ))}
            </div>
        </Card>
    ), [dataSharingPolicies, handlePolicyToggle]);

    const renderAPIKeys = useMemo(() => (
        <Card title="System API Key Management" className="lg:col-span-2">
            <p className="text-sm text-gray-400 mb-4">Manage programmatic access tokens. Keys are automatically rotated by the Quantum Key Vault every 90 days.</p>
            <div className="space-y-3">
                {(apiKeys || []).map(key => (
                    <div key={key.id} className="flex justify-between items-center p-3 bg-gray-800/70 rounded-lg border border-yellow-700/50">
                        <div className="flex items-center min-w-0">
                            <svg className="w-5 h-5 text-yellow-400 mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M6 16h.01" /></svg>
                            <div>
                                <p className="font-mono text-sm text-white truncate">{key.keyName} ({key.id.substring(0, 8)}...)</p>
                                <p className="text-xs text-gray-500">Created: {key.creationDate} | Permissions: {key.scopes.join(', ')}</p>
                            </div>
                        </div>
                        <button onClick={() => handleAPIKeyRevoke(key.id)} className="px-3 py-1 bg-red-900/30 hover:bg-red-900/50 text-red-300 rounded-md text-xs transition-colors flex-shrink-0 ml-4">Revoke Now</button>
                    </div>
                ))}
            </div>
        </Card>
    ), [apiKeys, handleAPIKeyRevoke]);

    const renderAIAnalysis = useMemo(() => (
        <div className="space-y-6">
            <Card title={`AI Threat Intelligence Feed (${AI_INSIGHT_ENGINE_VERSION})`}>
                <div className="flex justify-between items-center mb-4 border-b border-gray-800 pb-3">
                    <p className="text-gray-400 text-sm">Real-time behavioral analysis and predictive threat modeling.</p>
                    <span className="text-sm font-bold text-cyan-400">Total Insights: {aiInsights.length}</span>
                </div>
                <div className="space-y-4">
                    {aiInsights.length > 0 ? (aiInsights.map(insight => (<AISecurityInsightCard key={insight.id} insight={insight} />))) : (<div className="p-6 bg-gray-800/50 rounded-lg text-center border border-dashed border-gray-700"><p className="text-gray-500 italic">AI Engine reports no immediate high-priority anomalies at this time.</p></div>)}
                </div>
            </Card>
            <Card title="Security Awareness Training Modules">
                <p className="text-sm text-gray-400 mb-4">Track mandatory compliance training completion status across the organization.</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {(securityAwarenessModules || []).map(module => (
                        <div key={module.moduleId} className="p-4 bg-gray-800/70 rounded-lg border border-green-700/50">
                            <p className="font-bold text-white">{module.title}</p>
                            <p className="text-xs text-gray-400 mt-1">Status: {module.completionRate}% Complete</p>
                            <div className="w-full bg-gray-700 rounded-full h-2.5 mt-2"><div className="bg-green-500 h-2.5 rounded-full" style={{ width: `${module.completionRate}%` }}></div></div>
                        </div>
                    ))}
                </div>
            </Card>
        </div>
    ), [aiInsights, securityAwarenessModules]);

    const renderAuditLogs = useMemo(() => {
        const displayLogs = (auditLogs || []).slice(0, MAX_AUDIT_LOG_DISPLAY);
        return (
            <Card title={`System Audit Trail (Last ${displayLogs.length} Entries)`} className="lg:col-span-2">
                <p className="text-sm text-gray-400 mb-3">Immutable record of all configuration changes, data access events, and administrative actions.</p>
                <div className="overflow-x-auto max-h-[500px] custom-scrollbar">
                    <table className="min-w-full divide-y divide-gray-700">
                        <thead className="sticky top-0 bg-gray-800 z-10"><tr><th className="px-4 py-2 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Time</th><th className="px-4 py-2 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">User/System</th><th className="px-4 py-2 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Action</th><th className="px-4 py-2 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Target</th><th className="px-4 py-2 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Status</th></tr></thead>
                        <tbody className="divide-y divide-gray-800">{displayLogs.map((log: AuditLogEntry) => (<tr key={log.id} className="hover:bg-gray-800/50 transition-colors"><td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">{new Date(log.timestamp).toLocaleTimeString()}</td><td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-white">{log.userId.includes('sys_') ? 'SYSTEM' : log.userId}</td><td className="px-4 py-2 text-sm text-cyan-400">{log.action}</td><td className="px-4 py-2 text-sm text-gray-400">{log.targetResource}</td><td className="px-4 py-2 whitespace-nowrap"><span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${log.success ? 'bg-green-900/50 text-green-300' : 'bg-red-900/50 text-red-300'}`}>{log.success ? 'SUCCESS' : 'FAILURE'}</span></td></tr>))}</tbody>
                    </table>
                </div>
                {displayLogs.length < (auditLogs?.length || 0) && (<p className="text-center text-sm text-gray-500 mt-3">Displaying first {MAX_AUDIT_LOG_DISPLAY} logs. Load full history via dedicated Audit Console.</p>)}
            </Card>
        );
    }, [auditLogs]);

    const renderSecurityScoreGauge = useMemo(() => {
        const radius = 50; const circumference = 2 * Math.PI * radius; const offset = circumference - (securityScore / 100) * circumference; const color = securityScore >= 90 ? 'stroke-green-500' : securityScore >= 70 ? 'stroke-yellow-500' : 'stroke-red-500';
        return (
            <div className="flex flex-col items-center p-6 bg-gray-800/70 rounded-xl shadow-inner border border-gray-700">
                <h3 className="text-xl font-bold text-white mb-3">Quantum Security Index (QSI)</h3>
                <svg width="120" height="120" viewBox="0 0 120 120" className="transform -rotate-90"><circle cx="60" cy="60" r={radius} fill="transparent" stroke="#374151" strokeWidth="10" /><circle cx="60" cy="60" r={radius} fill="transparent" stroke={color.replace('stroke-', '')} strokeWidth="10" strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round" className="transition-all duration-1000 ease-out" /><text x="60" y="60" dominantBaseline="middle" textAnchor="middle" className="fill-current text-white" fontSize="20" fontWeight="bold">{securityScore}%</text></svg>
                <p className="text-sm text-gray-400 mt-2">Target: 95%</p>
            </div>
        );
    }, [securityScore]);

    const renderTrustedContacts = useMemo(() => (
        <Card title="Emergency Trusted Contacts" className="lg:col-span-1">
            <p className="text-sm text-gray-400 mb-4">Contacts authorized for emergency account recovery or high-risk alerts.</p>
            <div className="space-y-3">
                {(trustedContacts || []).map((contact: TrustedContact) => (
                    <div key={contact.id} className="flex justify-between items-center p-3 bg-gray-800/50 rounded-lg border border-gray-700">
                        <div className="flex items-center">
                            <div className="w-8 h-8 bg-pink-900/50 rounded-full flex items-center justify-center text-pink-300 mr-3"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg></div>
                            <div><p className="font-semibold text-white">{contact.name}</p><p className="text-xs text-gray-400">{contact.relationship}</p></div>
                        </div>
                        <span className={`text-xs font-medium px-2 py-0.5 rounded ${contact.verified ? 'bg-green-900/30 text-green-400' : 'bg-red-900/30 text-red-400'}`}>{contact.verified ? 'Verified' : 'Pending'}</span>
                    </div>
                ))}
            </div>
        </Card>
    ), [trustedContacts]);

    const renderHFTView = useMemo(() => (
        <Card title="High-Frequency Trading (HFT) Security Module">
            <p className="text-sm text-gray-400 mb-4">Real-time monitoring and automated circuit breakers for algorithmic trading infrastructure.</p>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-4">
                    <h3 className="text-lg font-bold text-white">Algorithmic Kill Switches & Rules</h3>
                    {hftRules.map(rule => (
                        <div key={rule.id} className="p-4 bg-gray-800/70 rounded-lg border border-red-700/50">
                            <div className="flex justify-between items-center">
                                <p className="font-bold text-lg text-white">{rule.name}</p>
                                <SecuritySettingToggle id={`hft-${rule.id}`} title="" description="" defaultChecked={rule.isEnabled} />
                            </div>
                            <p className="text-sm text-gray-400 mt-1">{rule.description}</p>
                            <div className="text-xs mt-2 pt-2 border-t border-gray-700 flex justify-between">
                                <span className="font-mono bg-gray-900 px-2 py-1 rounded">IF {rule.condition} THEN {rule.action}</span>
                                <span className="text-gray-500">Last Triggered: {rule.lastTriggered ? new Date(rule.lastTriggered).toLocaleString() : 'Never'}</span>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="space-y-4">
                    <h3 className="text-lg font-bold text-white">System Latency</h3>
                    <div className="p-4 bg-gray-800/70 rounded-lg text-center">
                        <p className="text-5xl font-mono font-extrabold text-green-400">0.72ms</p>
                        <p className="text-sm text-gray-400">Exchange Co-location (LD4)</p>
                    </div>
                    <button className="w-full py-2 bg-blue-700 hover:bg-blue-600 rounded-lg font-semibold">Define New HFT Rule</button>
                </div>
            </div>
        </Card>
    ), [hftRules]);

    const renderQuantumView = useMemo(() => (
        <Card title="Quantum Threat Mitigation & Future Tech">
            <p className="text-sm text-gray-400 mb-4">Tracking the enterprise-wide migration to post-quantum cryptography (PQC) and other next-generation security paradigms.</p>
            <div className="overflow-x-auto custom-scrollbar">
                <table className="min-w-full divide-y divide-gray-700">
                    <thead className="bg-gray-800"><tr><th className="px-4 py-2 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">System Component</th><th className="px-4 py-2 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">PQC Algorithm</th><th className="px-4 py-2 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Status</th><th className="px-4 py-2 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Migration ETA</th></tr></thead>
                    <tbody className="divide-y divide-gray-800">
                        {quantumStatuses.map(qs => (
                            <tr key={qs.id} className="hover:bg-gray-800/50">
                                <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-white">{qs.systemComponent}</td>
                                <td className="px-4 py-3 whitespace-nowrap text-sm font-mono text-cyan-400">{qs.algorithm}</td>
                                <td className="px-4 py-3 whitespace-nowrap text-sm"><span className={`px-2 py-0.5 rounded-full text-xs font-bold ${qs.status === 'MIGRATED' ? 'bg-green-600/30 text-green-300' : qs.status === 'PENDING' ? 'bg-yellow-600/30 text-yellow-300' : 'bg-red-600/30 text-red-300'}`}>{qs.status}</span></td>
                                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-400">{qs.migrationEta}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </Card>
    ), [quantumStatuses]);

    const renderIncidentResponseView = useMemo(() => (
        <div className="space-y-6">
            <Card title="Incident Response & Emergency Protocols" className="border-2 border-red-500/50 shadow-red-500/20 shadow-2xl">
                <div className="flex flex-col md:flex-row justify-between items-center p-4 bg-red-900/30 rounded-lg">
                    <div>
                        <h3 className="text-xl font-extrabold text-red-300">Global Lockdown Protocol</h3>
                        <p className="text-red-400 max-w-2xl">Immediately freeze all transactions, terminate sessions, revoke temporary keys, and place the system in a restricted, audit-only state. REQUIRES C-LEVEL AUTHENTICATION.</p>
                    </div>
                    <button onClick={handleGlobalLockdown} className="mt-4 md:mt-0 px-8 py-4 bg-red-700 hover:bg-red-600 text-white font-bold rounded-lg text-lg transition-transform hover:scale-105 shadow-lg flex-shrink-0">INITIATE LOCKDOWN</button>
                </div>
            </Card>
            <Card title="Active Security Incidents">
                <div className="space-y-4">
                    {incidents.map(incident => (
                        <div key={incident.id} className="p-4 bg-gray-800/70 rounded-lg border-l-4 border-yellow-500">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="font-bold text-lg text-white">{incident.title}</p>
                                    <p className="text-xs text-gray-400">Reported: {new Date(incident.timestamp).toLocaleString()} | Assigned: {incident.assignedTo}</p>
                                </div>
                                <span className={`px-3 py-1 rounded-full text-sm font-bold ${incident.status === 'Resolved' ? 'bg-green-600/30 text-green-300' : 'bg-yellow-600/30 text-yellow-300'}`}>{incident.status}</span>
                            </div>
                            <p className="text-sm text-gray-300 mt-2">{incident.summary}</p>
                        </div>
                    ))}
                    <button className="w-full py-3 bg-green-700 hover:bg-green-600 rounded-lg font-semibold text-lg">Report New Incident</button>
                </div>
            </Card>
        </div>
    ), [incidents]);

    const renderGeinCommandView = useMemo(() => (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            <div className="xl:col-span-2 space-y-6">
                <Card title="GEIN Command Console">
                    <div className="h-[600px] flex flex-col">
                        <div className="flex-grow p-4 bg-gray-900/70 rounded-t-lg overflow-y-auto custom-scrollbar space-y-4">
                            {geinConsoleHistory.map(msg => (
                                <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-xl p-3 rounded-lg ${msg.role === 'user' ? 'bg-blue-800' : 'bg-gray-700'}`}>
                                        <p className="text-white whitespace-pre-wrap">{msg.text}{msg.isStreaming && <span className="inline-block w-2 h-4 bg-cyan-400 animate-pulse ml-1"></span>}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="flex p-2 bg-gray-800 rounded-b-lg border-t border-gray-700">
                            <input type="text" value={geinConsoleInput} onChange={(e) => setGeinConsoleInput(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleGeinQuery()} placeholder="Query GEIN... (e.g., 'Summarize anomalous activity on dvc_2')" className="flex-grow bg-transparent text-white placeholder-gray-500 focus:outline-none px-3" />
                            <button onClick={handleGeinQuery} className="px-6 py-2 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-md transition-colors">Send</button>
                        </div>
                    </div>
                </Card>
                <Card title="GEIN Configuration">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">System Instruction</label>
                            <textarea value={geinSystemInstruction} onChange={(e) => setGeinSystemInstruction(e.target.value)} rows={5} className="w-full p-2 bg-gray-900 rounded-md text-sm text-gray-300 border border-gray-700 focus:ring-cyan-500 focus:border-cyan-500"></textarea>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">Thinking Budget: {geinThinkingBudget === 0 ? 'Disabled' : `${geinThinkingBudget} tokens`}</label>
                            <input type="range" min="0" max="10000" step="500" value={geinThinkingBudget} onChange={(e) => setGeinThinkingBudget(Number(e.target.value))} className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer" />
                            <p className="text-xs text-gray-500 mt-1">Controls enhanced quality processing. Higher values may increase latency and token usage. 0 disables thinking.</p>
                        </div>
                    </div>
                </Card>
            </div>
            <div className="space-y-6">
                <Card title="Cognitive Core Status">
                    <div className="space-y-3">
                        {cognitiveCores.map(core => (
                            <div key={core.name} className="p-3 bg-gray-800/50 rounded-lg">
                                <div className="flex justify-between items-center">
                                    <p className="font-bold text-white">{core.name}</p>
                                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${core.status === 'NOMINAL' ? 'bg-green-600/30 text-green-300' : 'bg-yellow-600/30 text-yellow-300'}`}>{core.status}</span>
                                </div>
                                <p className="text-xs text-gray-400 mt-1 truncate">Task: {core.primaryTask}</p>
                                <div className="w-full bg-gray-700 rounded-full h-1.5 mt-2"><div className="bg-cyan-500 h-1.5 rounded-full" style={{ width: `${core.load}%` }}></div></div>
                            </div>
                        ))}
                    </div>
                </Card>
                <Card title="Real-Time Data Ingestion Stream">
                    <div className="h-[400px] overflow-y-auto custom-scrollbar space-y-2 font-mono text-xs">
                        {geinInputStream.map(chunk => (
                            <div key={chunk.id} className="flex gap-2 items-center text-gray-400">
                                <span className="text-gray-600">{new Date(chunk.timestamp).toLocaleTimeString()}</span>
                                <span className="text-purple-400 w-28 truncate">{chunk.sourceNode}</span>
                                <span className="text-cyan-400 w-24">{chunk.dataType}</span>
                                <span className="flex-grow truncate">{chunk.payload}</span>
                                <span style={{ color: `rgba(255, 255, 255, ${chunk.geinScore})` }}>{chunk.geinScore.toFixed(2)}</span>
                            </div>
                        ))}
                    </div>
                </Card>
            </div>
        </div>
    ), [geinConsoleHistory, geinConsoleInput, geinSystemInstruction, geinThinkingBudget, cognitiveCores, geinInputStream, handleGeinQuery]);

    // --- Tab Content Rendering ---
    const renderContent = () => {
        switch (activeTab) {
            case 'overview': return (<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">{renderSecurityScoreGauge}{renderRecentActivity}{renderActiveDevices}{renderLinkedAccounts}{renderSecuritySettings}</div>);
            case 'policies': return (<div className="grid grid-cols-1 gap-6">{renderDataPolicies}<Card title="Transaction Rule Engine"><p className="text-sm text-gray-400 mb-4">Define automated responses to financial events based on predefined risk thresholds.</p><div className="space-y-3">{(context?.transactionRules || []).map((rule: TransactionRule) => (<div key={rule.ruleId} className="p-3 bg-gray-800/70 rounded-lg border border-cyan-700/50 flex justify-between items-center"><div><p className="font-bold text-white">{rule.name}</p><p className="text-xs text-gray-400">Trigger: {rule.triggerCondition} | Action: {rule.action}</p></div><span className={`text-xs font-medium px-2 py-0.5 rounded ${rule.isEnabled ? 'bg-green-900/30 text-green-400' : 'bg-red-900/30 text-red-400'}`}>{rule.isEnabled ? 'ACTIVE' : 'DISABLED'}</span></div>))}</div></Card></div>);
            case 'keys': return (<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">{renderAPIKeys}{renderTrustedContacts}<Card title="Threat Alert History" className="lg:col-span-3"><p className="text-sm text-gray-400 mb-4">Historical record of confirmed security incidents.</p><div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">{(threatAlerts || []).map((alert: ThreatAlert) => (<div key={alert.alertId} className="p-3 bg-red-900/30 rounded-lg border border-red-600 flex justify-between items-center"><div><p className="font-bold text-red-300">{alert.title}</p><p className="text-xs text-gray-300">{alert.description}</p></div><span className="text-xs text-gray-300">{new Date(alert.timestamp).toLocaleDateString()}</span></div>))}</div></Card></div>);
            case 'ai_analysis': return (<div className="grid grid-cols-1 gap-6">{renderAIAnalysis}{renderAuditLogs}</div>);
            case 'hft': return renderHFTView;
            case 'quantum': return renderQuantumView;
            case 'incidents': return renderIncidentResponseView;
            case 'gein_command': return renderGeinCommandView;
            default: return null;
        }
    };

    const tabs: { id: typeof activeTab, label: string }[] = [
        { id: 'overview', label: 'Overview & Access' }, { id: 'policies', label: 'Governance & Rules' }, { id: 'keys', label: 'API & Contacts' }, { id: 'ai_analysis', label: 'AI Threat Analysis' }, { id: 'hft', label: 'HFT Security' }, { id: 'quantum', label: 'Future Tech' }, { id: 'incidents', label: 'Incident Response' }, { id: 'gein_command', label: 'GEIN Command' },
    ];

    return (
        <div className="space-y-8 p-4 sm:p-8">
            <header className="pb-4 border-b border-gray-700">
                <h1 className="text-4xl font-extrabold text-white tracking-tighter">Enterprise Security Command Center</h1>
                <p className="text-lg text-gray-400 mt-1">Centralized control plane for data integrity, access management, and threat mitigation. Engine: {AI_INSIGHT_ENGINE_VERSION}</p>
            </header>

            <div className="flex border-b border-gray-700 overflow-x-auto custom-scrollbar">{tabs.map((tab) => (<button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`px-6 py-3 text-lg font-semibold transition-all duration-300 whitespace-nowrap ${activeTab === tab.id ? 'text-cyan-400 border-b-4 border-cyan-500' : 'text-gray-400 hover:text-white hover:border-b-4 hover:border-gray-600'}`}>{tab.label}</button>))}</div>

            <main>{renderContent()}</main>

            {notification && (<NotificationToast message={notification.message} type={notification.type} isVisible={notification.isVisible} onClose={closeNotification} />)}
        </div>
    );
};

export default SecurityView;

================================================================================
// APPENDED FROM REPO: diplomat-bit/almost | ORIGINAL PATH: diplomat-bit-almost-93a5466/components/SecurityView (2).tsx
================================================================================

// components/SecurityView.tsx
// RE-ENACTED & EXPANDED: This component has been resurrected from its deprecated state.
// It is now the "AegisVault," the full-featured security and access control center
// for the user's financial kingdom. It provides transparent controls for data sharing,
// account security, and activity monitoring.

import React, { useContext, useState } from 'react';
import { DataContext } from '../context/DataContext';
import Card from './Card';
import PlaidLinkButton from './PlaidLinkButton';

// ================================================================================================
// TYPE DEFINITIONS & MOCK DATA
// ================================================================================================

interface LoginActivity {
    id: string;
    device: string;
    location: string;
    ip: string;
    timestamp: string;
    isCurrent: boolean;
}

const MOCK_LOGIN_ACTIVITY: LoginActivity[] = [
    { id: '1', device: 'Chrome on macOS', location: 'New York, USA', ip: '192.168.1.1', timestamp: '2 minutes ago', isCurrent: true },
    { id: '2', device: 'DemoBank App on iOS', location: 'New York, USA', ip: '172.16.0.1', timestamp: '3 days ago', isCurrent: false },
    { id: '3', device: 'Chrome on Windows', location: 'Chicago, USA', ip: '10.0.0.1', timestamp: '1 week ago', isCurrent: false },
];

// ================================================================================================
// SUB-COMPONENTS
// ================================================================================================

/**
 * @description A reusable component for displaying a single security setting with a toggle.
 */
const SecuritySettingToggle: React.FC<{
    title: string;
    description: string;
    defaultChecked: boolean;
}> = ({ title, description, defaultChecked }) => (
    <li className="py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <div>
            <h4 className="font-semibold text-white">{title}</h4>
            <p className="text-sm text-gray-400 max-w-md mt-1">{description}</p>
        </div>
        <input
            type="checkbox"
            className="toggle toggle-cyan mt-2 sm:mt-0"
            defaultChecked={defaultChecked}
            aria-label={`Toggle for ${title}`}
        />
    </li>
);

/**
 * @description A modal for simulating a password change flow.
 */
const ChangePasswordModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 backdrop-blur-sm" onClick={onClose}>
            <div className="bg-gray-800 rounded-lg shadow-2xl max-w-md w-full border border-gray-700" onClick={e => e.stopPropagation()}>
                <div className="p-4 border-b border-gray-700">
                    <h3 className="text-lg font-semibold text-white">Change Password</h3>
                </div>
                <div className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-300">Current Password</label>
                        <input type="password" className="mt-1 w-full bg-gray-700/50 border-gray-600 rounded-md p-2 text-white" />
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-300">New Password</label>
                        <input type="password" className="mt-1 w-full bg-gray-700/50 border-gray-600 rounded-md p-2 text-white" />
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-300">Confirm New Password</label>
                        <input type="password" className="mt-1 w-full bg-gray-700/50 border-gray-600 rounded-md p-2 text-white" />
                    </div>
                    <button onClick={() => { alert('Password changed successfully.'); onClose(); }} className="w-full py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg mt-2">
                        Update Password
                    </button>
                </div>
            </div>
        </div>
    );
};

// ================================================================================================
// MAIN VIEW COMPONENT: SecurityView (AegisVault)
// ================================================================================================

const SecurityView: React.FC = () => {
    const context = useContext(DataContext);
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
    
    if (!context) {
        throw new Error("SecurityView must be within a DataProvider.");
    }
    
    // FIX: Destructure missing functions from context to resolve property not found errors.
    const { linkedAccounts, unlinkAccount, handlePlaidSuccess } = context;

    return (
        <>
            <div className="space-y-6">
                <h2 className="text-3xl font-bold text-white tracking-wider">Security & Access (AegisVault)</h2>
                
                {/* Linked Accounts & Data Sources Card */}
                <Card title="Linked Accounts & Data Sources" titleTooltip="Manage connections to external financial institutions. You have full control to link or unlink accounts at any time.">
                    <p className="text-sm text-gray-400 mb-4">
                        These are the external accounts you've securely connected via Plaid. This allows Demo Bank to provide a holistic view of your finances. Your credentials are never stored by us.
                    </p>
                    <div className="space-y-3 mb-6">
                        {linkedAccounts.length > 0 ? linkedAccounts.map(account => (
                            <div key={account.id} className="flex justify-between items-center p-3 bg-gray-800/50 rounded-lg border border-gray-700/60">
                                <div>
                                    <h4 className="font-semibold text-white">{account.name}</h4>
                                    <p className="text-sm text-gray-400">Account ending in **** {account.mask}</p>
                                </div>
                                <button onClick={() => unlinkAccount(account.id)} className="px-3 py-1 bg-red-600/50 hover:bg-red-600 text-white rounded-lg text-xs font-medium">
                                    Unlink
                                </button>
                            </div>
                        )) : (
                            <p className="text-center text-gray-500 py-4">No accounts linked yet.</p>
                        )}
                    </div>
                    <PlaidLinkButton onSuccess={handlePlaidSuccess} />
                </Card>

                {/* Security Settings Card */}
                <Card title="Security Settings">
                    <ul className="divide-y divide-gray-700/60">
                        <SecuritySettingToggle
                            title="Two-Factor Authentication (2FA)"
                            description="Requires a code from your authenticator app or SMS in addition to your password for enhanced security."
                            defaultChecked={true}
                        />
                        <SecuritySettingToggle
                            title="Biometric Login"
                            description="Enable passwordless login using your device's Face ID or Touch ID for a faster and more secure experience."
                            defaultChecked={false}
                        />
                        <li className="py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center">
                            <div>
                                <h4 className="font-semibold text-white">Change Password</h4>
                                <p className="text-sm text-gray-400 max-w-md mt-1">It's a good practice to update your password regularly.</p>
                            </div>
                            <button onClick={() => setIsPasswordModalOpen(true)} className="mt-2 sm:mt-0 px-4 py-2 bg-gray-600/50 hover:bg-gray-600 text-white rounded-lg text-xs font-medium">
                                Change
                            </button>
                        </li>
                    </ul>
                </Card>

                {/* Login Activity Card */}
                <Card title="Recent Login Activity">
                     <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left text-gray-400">
                            <thead className="text-xs text-gray-300 uppercase bg-gray-900/30">
                                <tr>
                                    <th className="px-6 py-3">Device</th>
                                    <th className="px-6 py-3">Location</th>
                                    <th className="px-6 py-3">Timestamp</th>
                                </tr>
                            </thead>
                            <tbody>
                                {MOCK_LOGIN_ACTIVITY.map(activity => (
                                    <tr key={activity.id} className={`border-b border-gray-800 ${activity.isCurrent ? 'bg-cyan-500/10' : 'hover:bg-gray-800/50'}`}>
                                        <td className="px-6 py-4 font-medium text-white">{activity.device} {activity.isCurrent && <span className="text-xs text-cyan-300">(Current)</span>}</td>
                                        <td className="px-6 py-4">{activity.location}</td>
                                        <td className="px-6 py-4">{activity.timestamp}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Card>
            </div>
            <ChangePasswordModal isOpen={isPasswordModalOpen} onClose={() => setIsPasswordModalOpen(false)} />
        </>
    );
};

export default SecurityView;


================================================================================
// APPENDED FROM REPO: diplomat-bit/almost | ORIGINAL PATH: diplomat-bit-almost-93a5466/components/SecurityView (3).tsx
================================================================================

import React, { useState } from 'react';
// axios removed as direct API key submission from frontend is not the secure approach
import './SecurityView.css'; // This CSS will be provided in Part 2, assuming general layout styles are still relevant

// =================================================================================
// REPLACEMENT RATIONALE:
// The original SecurityView component presented a form for directly inputting
// and submitting over 200 system-level backend API keys from the frontend
// to a generic backend endpoint. This approach is fundamentally flawed and
// highly insecure for a production application for several reasons:
// 1. Exposure Risk: Sensitive API keys should never be directly exposed to
//    the client-side (frontend) code or manually handled by end-users.
// 2. Security Best Practices: Production-grade applications must manage
//    sensitive credentials (like API keys, database passwords, etc.) using
//    dedicated, secure secret management services.
//
// SYSTEM SECRETS MANAGEMENT:
// In alignment with security best practices and the refactoring plan's goal
// to "Integrate AWS Secrets Manager or Vault for all sensitive values,"
// system-level API keys and other sensitive credentials are to be managed
// exclusively by the backend infrastructure. This involves:
// - Storing secrets in secure services like AWS Secrets Manager, Google Secret Manager,
//   Azure Key Vault, or HashiCorp Vault.
// - Ensuring secrets are encrypted at rest and in transit.
// - Implementing automatic key rotation where possible.
// - Granting access to secrets only to authorized backend services using
//   Identity and Access Management (IAM) roles or service accounts.
// - Never exposing these keys to client-side code, environmental variables on the frontend,
//   or manual input forms in the UI for system-level credentials.
//
// REPLACEMENT:
// This component has been refactored to remove the insecure API key input forms.
// A "SecurityView" on the frontend for a secure, production-ready application
// should instead focus on:
// 1. Providing an overview of the application's security posture.
// 2. Allowing users to manage their *own* security settings (e.g., password changes,
//    multi-factor authentication setup).
// 3. Facilitating secure initiation of external integrations (e.g., OAuth flows
//    for connecting user bank accounts via Plaid Link), where sensitive tokens
//    are securely exchanged and managed on the backend, not directly inputted by the user.
//
// For the MVP, system-level API keys are assumed to be managed via AWS Secrets Manager
// or similar infrastructure by backend services. This frontend view is repurposed
// to reflect general application security information and placeholders for future
// user-specific security settings or secure integration management.
// =================================================================================

// Placeholder interface for future user-specific security settings
interface UserSecuritySettings {
  twoFactorEnabled: boolean;
  lastPasswordChange: string;
  // Add other user-specific security settings as needed for the MVP or future modules
}

const SecurityView: React.FC = () => {
  // Mock state for user security settings, demonstrating a more appropriate use case
  const [userSettings, setUserSettings] = useState<UserSecuritySettings>({
    twoFactorEnabled: false,
    lastPasswordChange: '2023-01-01', // Example date
  });
  const [statusMessage, setStatusMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'user-settings' | 'integrations'>('overview');

  // Example function for a user-centric security action (e.g., toggling 2FA)
  const handleToggleTwoFactor = async () => {
    setIsLoading(true);
    setStatusMessage('Updating 2FA status...');
    try {
      // In a real application, this would call a secure backend API endpoint
      // to update the user's 2FA status. The backend would handle the actual
      // logic for enabling/disabling 2FA (e.g., verifying OTPs, managing keys).
      // Example: await secureBackendApi.post('/user/toggle-2fa', { enabled: !userSettings.twoFactorEnabled });
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      setUserSettings(prev => ({ ...prev, twoFactorEnabled: !prev.twoFactorEnabled }));
      setStatusMessage('2FA status updated successfully.');
    } catch (error) {
      setStatusMessage('Failed to update 2FA status.');
      console.error('2FA update error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Example for initiating a secure external service connection (e.g., connecting a bank via Plaid)
  const handleConnectPlaid = async () => {
    setIsLoading(true);
    setStatusMessage('Initiating Plaid connection...');
    try {
      // For bank aggregation (MVP candidate), this would involve a secure backend endpoint
      // that generates a Plaid Link token. The frontend then uses this token to launch
      // the Plaid Link UI, allowing the user to securely connect their bank account.
      // The resulting Plaid 'public_token' is then sent to the backend to exchange for
      // an 'access_token', which the backend stores and uses. The frontend never sees raw API keys.
      // Example: const response = await secureBackendApi.post('/plaid/create-link-token');
      // Plaid.create({ token: response.data.link_token, onSuccess: (public_token) => sendToBackend(public_token) }).open();
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API call
      setStatusMessage('Plaid connection initiated. (Note: A real implementation would launch Plaid Link securely.)');
    } catch (error) {
      setStatusMessage('Failed to initiate Plaid connection.');
      console.error('Plaid connection error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="settings-container">
      <h1>Security Overview & Settings</h1>
      <p className="subtitle">
        This section provides an overview of the application's security posture and allows management of user-specific security settings and integrations.
      </p>

      <div className="tabs">
        <button onClick={() => setActiveTab('overview')} className={activeTab === 'overview' ? 'active' : ''}>
          Security Overview
        </button>
        <button onClick={() => setActiveTab('user-settings')} className={activeTab === 'user-settings' ? 'active' : ''}>
          Your Security Settings
        </button>
        <button onClick={() => setActiveTab('integrations')} className={activeTab === 'integrations' ? 'active' : ''}>
          External Integrations
        </button>
      </div>

      <div className="settings-form"> {/* Reusing settings-form for general layout styling */}
        {activeTab === 'overview' && (
          <div className="form-section">
            <h2>System Security Posture & Secrets Management</h2>
            <p>
              <strong>Important:</strong> All system-level sensitive credentials (e.g., API keys for payment gateways, cloud services, backend integrations)
              are securely managed on the backend using an enterprise-grade secrets management solution (e.g., AWS Secrets Manager, HashiCorp Vault).
              These keys are never exposed to the frontend, stored in client-side code, or manually entered via this user interface.
              Access to secrets is strictly controlled through IAM roles, service accounts, and least-privilege principles.
            </p>
            <p>
              This architecture ensures robust security, minimizes the risk of credential compromise, and facilitates compliant key rotation and auditing.
            </p>
            <h3>Authentication & Authorization</h3>
            <ul>
              <li>User authentication is implemented with secure JSON Web Tokens (JWTs) and robust session management.</li>
              <li>Role-based access control (RBAC) enforces granular permissions across the application, ensuring users only access authorized features and data.</li>
              <li>Sensitive operations (e.g., financial transactions, configuration changes) may require re-authentication or multi-factor verification.</li>
            </ul>
          </div>
        )}

        {activeTab === 'user-settings' && (
          <div className="form-section">
            <h2>Your Account Security Settings</h2>
            <div className="input-group">
              <label>Multi-Factor Authentication (2FA)</label>
              <p>Status: {userSettings.twoFactorEnabled ? 'Enabled' : 'Disabled'}</p>
              <button onClick={handleToggleTwoFactor} disabled={isLoading} className="action-button">
                {isLoading ? 'Updating...' : (userSettings.twoFactorEnabled ? 'Disable 2FA' : 'Enable 2FA')}
              </button>
            </div>
            <div className="input-group">
              <label>Last Password Change</label>
              <p>{userSettings.lastPasswordChange}</p>
              <button disabled={isLoading} className="action-button">Change Password</button> {/* Placeholder for change password flow */}
            </div>
            {/* Add more user-specific security settings here for the MVP, e.g., Linked Devices, Session Management */}
          </div>
        )}

        {activeTab === 'integrations' && (
          <div className="form-section">
            <h2>Manage External Financial Integrations</h2>
            <p>
              Connect your personal financial accounts to enable features like multi-bank aggregation, transaction intelligence, and treasury automation.
              These integrations utilize secure OAuth2 and Open Banking protocols, ensuring your sensitive bank credentials are never directly handled by this application.
            </p>
            <div className="input-group">
              <label>Plaid Integration (Bank Account Aggregation)</label>
              <p>Status: Not Connected</p> {/* In a real app, this would dynamically show connected status */}
              <button onClick={handleConnectPlaid} disabled={isLoading} className="action-button">
                {isLoading ? 'Connecting...' : 'Connect Bank Account (via Plaid Link)'}
              </button>
              <p className="note">Securely link your bank accounts through Plaid to view aggregated financial data.</p>
            </div>
            {/* Add more external integration options here relevant to the MVP (e.g., accounting software, other financial APIs) */}
          </div>
        )}

        {statusMessage && <p className="status-message">{statusMessage}</p>}
      </div>
    </div>
  );
};

export default SecurityView;

================================================================================
// APPENDED FROM REPO: diplomat-bit/almost | ORIGINAL PATH: diplomat-bit-almost-93a5466/components/SecurityView (4).tsx
================================================================================

```typescript
import React, { useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { DataContext } from '../context/DataContext';
import Card from './Card';
import PlaidLinkButton from './PlaidLinkButton';
import {
    LoginActivity, Device, DataSharingPolicy, TransactionRule, ThreatAlert,
    AuditLogEntry, APIKey, TrustedContact, SecurityAwarenessModule, SecurityScoreMetric, UserProfile
} from '../types';

// --- AI/ML Integration Placeholder Types (Simulated for expansion) ---
interface A_AISecurityInsight {
    id: string;
    timestamp: string;
    severity: 'Low' | 'Medium' | 'High' | 'Critical';
    summary: string;
    recommendation: string;
    sourceModel: string;
}

// --- Constants for The James Burvel O’Callaghan III Code Billion Dollar Features ---
const A_AI_INSIGHT_ENGINE_VERSION = "ChaosEngine v0.0.1-Garbage-O'Callaghan";
const A_MAX_AUDIT_LOG_DISPLAY = 50; // Increased for depth and detail
const A_MAX_THREAT_ALERTS_DISPLAY = 25; // New Constant
const A_SECURITY_SCORE_TARGET = 98; // Explicit Target
const A_ENTERPRISE_BRANDING = "The James Burvel O'Callaghan III Code™ - SecurityView"; // Deterministic Branding
const A_UI_REFRESH_INTERVAL = 60000; // Auto Refresh
const A_DEFAULT_RISK_THRESHOLD = 0.75; // Risk Threshold

// --- Company Entity Definition (The James Burvel O’Callaghan III Code) ---
interface A_JBOCO_Company {
    companyId: string;
    companyName: string;
    industry: string;
    headquarters: string;
    securityContact: string;
    dataRetentionPolicy: string;
    complianceCertifications: string[];
    incidentResponsePlan: string;
    threatIntelligenceFeed: string;
    securityBudget: number;
    employeeCount: number;
    technologyStack: string[];
    riskAppetite: string;
    insurancePolicy: string;
    legalJurisdiction: string;
    businessContinuityPlan: string;
    disasterRecoveryPlan: string;
    vendorSecurityAssessment: string;
}

const A_JBOCO_AlphaCorp: A_JBOCO_Company = {
    companyId: "AlphaCorp001",
    companyName: "AlphaCorp Global Solutions",
    industry: "Technology Consulting",
    headquarters: "New York, NY",
    securityContact: "security@alphacorp.com",
    dataRetentionPolicy: "7 years",
    complianceCertifications: ["ISO 27001", "SOC 2"],
    incidentResponsePlan: "AlphaCorp Incident Response v3.0",
    threatIntelligenceFeed: "DarkTrace Enterprise",
    securityBudget: 5000000,
    employeeCount: 5000,
    technologyStack: ["AWS", "Azure", "GCP", "Kubernetes"],
    riskAppetite: "Moderate",
    insurancePolicy: "CyberGuard Premium",
    legalJurisdiction: "Delaware",
    businessContinuityPlan: "AlphaCorp BCP 2024",
    disasterRecoveryPlan: "AlphaCorp DRP 2024",
    vendorSecurityAssessment: "Annual SOC 2 Type II"
};

// --- Helper Components (The James Burvel O’Callaghan III Code) ---
export const A_SecuritySettingToggle: React.FC<{
    id: string;
    title: string;
    description: string;
    defaultChecked: boolean;
    onToggle?: (checked: boolean) => void;
    disabled?: boolean;
    aiImpact?: 'High' | 'Medium' | 'Low' | 'None';
    jbocoBranding?: string; // Explicitly Pass Branding
}> = ({ id, title, description, defaultChecked, onToggle, disabled, aiImpact = 'None', jbocoBranding = A_ENTERPRISE_BRANDING }) => {
    const [A_isChecked, A_setIsChecked] = useState(defaultChecked);
    const { showSystemAlert } = useContext(DataContext) || {};

    const A_handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const A_newState = e.target.checked;
        A_setIsChecked(A_newState);
        onToggle && onToggle(A_newState);
        if (showSystemAlert) {
            const A_impactColor = aiImpact === 'High' ? 'text-red-400' : aiImpact === 'Medium' ? 'text-yellow-400' : 'text-green-400';
            showSystemAlert(`${jbocoBranding}: Configuration Change Detected: ${title} set to ${A_newState ? 'Enabled' : 'Disabled'}. AI Risk Assessment: ${aiImpact}.`, 'info');
        }
    };

    const A_aiIndicator = useMemo(() => {
        if (aiImpact === 'None') return null;
        const A_colorMap = {
            High: 'bg-red-500',
            Medium: 'bg-yellow-500',
            Low: 'bg-blue-500',
        };
        return (
            <span className={`ml-3 px-2 py-0.5 text-xs font-bold rounded-full text-white ${A_colorMap[aiImpact]}`}>
                AI {aiImpact}
            </span>
        );
    }, [aiImpact]);

    return (
        <li className="py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-gray-800/70">
            <div className="flex-grow">
                <label htmlFor={`toggle-${id}`} className="font-bold text-lg text-white cursor-pointer flex items-center">
                    {title}
                    {A_aiIndicator}
                </label>
                <p className="text-sm text-gray-400 max-w-xl mt-1">{description}</p>
            </div>
            <div className="flex items-center mt-2 sm:mt-0">
                <span className={`mr-3 text-sm font-medium ${A_isChecked ? 'text-green-400' : 'text-red-400'}`}>
                    {A_isChecked ? 'ACTIVE' : 'INACTIVE'}
                </span>
                <input
                    type="checkbox"
                    id={`toggle-${id}`}
                    className="toggle toggle-cyan toggle-lg"
                    checked={A_isChecked}
                    onChange={A_handleChange}
                    disabled={disabled}
                    aria-label={`Toggle for ${title}`}
                />
            </div>
        </li>
    );
};

export const B_NotificationToast: React.FC<{
    message: string;
    type: 'success' | 'error' | 'info' | 'warning' | 'critical';
    onClose: () => void;
    isVisible: boolean;
    jbocoBranding?: string; // Explicitly Pass Branding
}> = ({ message, type, onClose, isVisible, jbocoBranding = A_ENTERPRISE_BRANDING }) => {
    const B_typeClasses = {
        success: 'bg-green-700 border-green-500',
        error: 'bg-red-700 border-red-500',
        info: 'bg-blue-700 border-blue-500',
        warning: 'bg-yellow-700 border-yellow-500',
        critical: 'bg-purple-800 border-purple-500'
    };

    const B_iconMap = {
        success: <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
        error: <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
        info: <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
        warning: <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.938 5.002c-.77-1.333-2.688-1.333-3.458 0L3.308 18.002c-.77 1.333.192 3 1.732 3z" /></svg>,
        critical: <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.938 5.002c-.77-1.333-2.688-1.333-3.458 0L3.308 18.002c-.77 1.333.192 3 1.732 3z" /></svg>
    };

    useEffect(() => {
        let B_timer: ReturnType<typeof setTimeout>;
        if (isVisible) {
            const B_duration = type === 'critical' ? 15000 : 7000;
            B_timer = setTimeout(() => { onClose(); }, B_duration);
        }
        return () => clearTimeout(B_timer);
    }, [isVisible, onClose, type]);

    if (!isVisible) return null;
    return (
        <div className={`fixed bottom-8 right-8 p-5 rounded-xl shadow-2xl text-white flex items-start space-x-4 transition-all duration-500 ease-out transform border-l-8 ${B_typeClasses[type]} ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'}`} style={{ zIndex: 1000, minWidth: '300px' }}>
            <div className="flex-shrink-0 mt-1">
                {B_iconMap[type]}
            </div>
            <div className="flex-grow">
                <span className="text-sm font-bold block capitalize">{type} Alert - {jbocoBranding}</span>
                <span className="text-base font-medium">{message}</span>
            </div>
            <button onClick={onClose} className="p-1 rounded-full hover:bg-black/20 focus:outline-none flex-shrink-0 mt-0.5 transition-colors">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
        </div>
    );
};

// --- AI Insight Display Component (The James Burvel O’Callaghan III Code) ---
const C_AISecurityInsightCard: React.FC<{ insight: A_AISecurityInsight; jbocoBranding?: string; }> = ({ insight, jbocoBranding = A_ENTERPRISE_BRANDING }) => {
    const C_severityClasses = {
        Critical: 'border-red-600 bg-red-900/20 text-red-300',
        High: 'border-orange-600 bg-orange-900/20 text-orange-300',
        Medium: 'border-yellow-600 bg-yellow-900/20 text-yellow-300',
        Low: 'border-green-600 bg-green-900/20 text-green-300',
    };

    return (
        <div className={`p-4 rounded-xl border-l-4 shadow-lg transition-all duration-300 hover:shadow-xl ${C_severityClasses[insight.severity]}`}>
            <div className="flex justify-between items-start mb-2">
                <h4 className="font-extrabold text-lg">{insight.summary} - {jbocoBranding}</h4>
                <span className={`text-xs font-semibold px-2 py-1 rounded-full ${C_severityClasses[insight.severity].replace('border-', 'bg-').replace('/20', '/40')}`}>{insight.severity}</span>
            </div>
            <p className="text-sm text-gray-300 mb-3">{insight.recommendation}</p>
            <div className="text-xs text-gray-400 flex justify-between border-t border-current pt-2 mt-2">
                <span>Engine: {insight.sourceModel}</span>
                <span>Detected: {new Date(insight.timestamp).toLocaleString()}</span>
            </div>
        </div>
    );
};

// --- Expert Level Function Composition (The James Burvel O’Callaghan III Code) ---
const D_expertFunction = (initialValue: number) => (
    (x: number) => (y: number) => (z: number) => (a: number) => (b: number) => (c: number) => (d: number) => (e: number) => (f: number) => (g: number) => (h: number) => (i: number) => (j: number) => (k: number) => (l: number) => (m: number) => (n: number) => (o: number) => (p: number) => (q: number) => (r: number) => (s: number) => (t: number) => (u: number) => (v: number) => (w: number) => (xx: number) => (yy: number) => (zz: number) => (aa: number) => (bb: number) => (cc: number) => (dd: number) => (ee: number) => (ff: number) => (gg: number) => (hh: number) => (ii: number) => (jj: number) => (kk: number) => (ll: number) => (mm: number) => (nn: number) => (oo: number) => (pp: number) => (qq: number) => (rr: number) => (ss: number) => (tt: number) => (uu: number) => (vv: number) => (ww: number) => (xxx: number) => (yyy: number) => (zzz: number) => (aaaa: number) => (bbbb: number) => (cccc: number) => (dddd: number) => (eeee: number) => (ffff: number) => (gggg: number) => (hhhh: number) => (iiii: number) => (jjjj: number) => (kkkk: number) => (llll: number) => (mmmm: number) => (nnnn: number) => (oooo: number) => (pppp: number) => (qqqq: number) => (rrrr: number) => (ssss: number) => (tttt: number) => (uuuu: number) => (vvvv: number) => (wwww: number) => (xxxxx: number) => (yyyyy: number) => (zzzzz: number) => (aaaaa: number) => (bbbbb: number) => (ccccc: number) => (ddddd: number) => (eeeee: number) => (fffff: number) => (ggggg: number) => (hhhhh: number) => (iiiii: number) => (jjjjj: number) => (kkkkk: number) => (lllll: number) => (mmmmm: number) => (nnnnn: number) => (ooooo: number) => (ppppp: number) => (qqqqq: number) => (rrrrr: number) => (sssss: number) => (ttttt: number) => (uuuuu: number) => (vvvvv: number) => (wwwww: number) => (xxxxx: number) => (yyyyyy: number) => (zzzzzz: number) => (aaaaaa: number) => (bbbbbb: number) => (cccccc: number) => (dddddd: number) => (eeeeee: number) => (ffffff: number) => (gggggg: number) => (hhhhhh: number) => (iiiiii: number) => (jjjjjj: number) => (kkkkkk: number) => (llllll: number) => (mmmmmm: number) => (nnnnnn: number) => (oooooo: number) => (pppppp: number) => (qqqqqq: number) => (rrrrrr: number) => (ssssss: number) => (tttttt: number) => (uuuuuu: number) => (vvvvvv: number) => (wwwwww: number) => (xxxxxxx: number) => (yyyyyyy: number) => (zzzzzzz: number) => initialValue + x + y + z + a + b + c + d + e + f + g + h + i + j + k + l + m + n + o + p + q + r + s + t + u + v + w + xx + yy + zz + aa + bb + cc + dd + ee + ff + gg + hh + ii + jj + kk + ll + mm + nn + oo + pp + qq + rr + ss + tt + uu + vv + ww + xxx + yyy + zzz + aaaa + bbbb + cccc + dddd + eeee + ffff + gggg + hhhh + iiii + jjjj + kkkk + llll + mmmm + nnnn + oooo + pppp + qqqq + rrrr + ssss + tttt + uuuu + vvvv + wwww + xxxxx + yyyyy + zzzzz + aaaaa + bbbbb + ccccc + ddddd + eeeee + fffff + ggggg + hhhhh + iiiii + jjjjj + kkkkk + lllll + mmmmm + nnnnn + ooooo + ppppp + qqqqq + rrrrr + sssss + ttttt + uuuuu + vvvvv + wwwww + xxxxxx + yyyyyy + zzzzzz + aaaaaa + bbbbbb + cccccc + dddddd + eeeeee + ffffff + gggggg + hhhhhh + iiiiii + jjjjjj + kkkkkk + llllll + mmmmmm + nnnnnn + oooooo + pppppp + qqqqqq + rrrrrr + ssssss + tttttt + uuuuuu + vvvvvv + wwwwww + xxxxxx + yyyyyyy + zzzzzzz
);

// --- Main Component (The James Burvel O’Callaghan III Code) ---
const SecurityView: React.FC<{ jbocoBranding?: string; }> = ({ jbocoBranding = A_ENTERPRISE_BRANDING }) => {
    const E_context = useContext(DataContext);
    const {
        linkedAccounts, unlinkAccount, handlePlaidSuccess,
        securityMetrics, auditLogs, threatAlerts,
        dataSharingPolicies, apiKeys, trustedContacts,
        securityAwarenessModules, showSystemAlert,
        transactionRules, userProfile
    } = E_context || {};

    const [F_notification, F_setNotification] = useState<{ message: string; type: 'success' | 'error' | 'info' | 'warning' | 'critical'; isVisible: boolean } | null>(null);
    const [G_loginActivity, G_setLoginActivity] = useState<LoginActivity[]>([]);
    const [H_devices, H_setDevices] = useState<Device[]>([]);
    const [I_aiInsights, I_setAiInsights] = useState<A_AISecurityInsight[]>([]);
    const [J_activeTab, J_setActiveTab] = useState<'overview' | 'policies' | 'keys' | 'ai_analysis' | 'user_profile'>('overview'); // Extended Tab
    const [K_securityScore, K_setSecurityScore] = useState<number>(75); // Initial mock score
    const [L_threatAlertsDisplay, L_setThreatAlertsDisplay] = useState<ThreatAlert[]>([]); // For controlled display
    const [M_riskThreshold, M_setRiskThreshold] = useState<number>(A_DEFAULT_RISK_THRESHOLD); // Dynamic Risk
    const [N_userAvatar, N_setUserAvatar] = useState<string | null>(null); // User Avatar
    const [O_lastSyncTimestamp, O_setLastSyncTimestamp] = useState<number>(Date.now()); // Sync Timestamp
    const [P_auditLogPage, P_setAuditLogPage] = useState<number>(1); // Audit Log Pagination

    // --- Mock Data Initialization & AI Simulation (The James Burvel O’Callaghan III Code) ---
    useEffect(() => {
        const Q_now = new Date();
        const Q_pastDate = (days: number) => new Date(Q_now.getTime() - days * 24 * 60 * 60 * 1000).toISOString();

        // Mock Login Activity (Expanded and Detailed)
        G_setLoginActivity([
            { id: '1', device: 'Quantum Workstation', browser: 'Chrome 125 (Secure)', os: 'Linux Kernel 6.8', location: 'HQ Server Room', ip: '10.0.0.5', timestamp: Q_pastDate(0.01), isCurrent: true, userAgent: 'EnterpriseAgent/1.0', country: 'US', city: 'New York', hardwareId: 'HW-2024-Q1', authenticationMethod: 'FIDO2' },
            { id: '2', device: 'Personal Mobile', browser: 'Safari', os: 'iOS 18.0 Beta', location: 'Remote Office', ip: '203.0.113.45', timestamp: Q_pastDate(1.5), isCurrent: false, userAgent: 'MobileSafari/605.1.15', country: 'CA', city: 'Toronto', hardwareId: 'MB-2023-Pro', authenticationMethod: 'Biometric' },
            { id: '3', device: 'Legacy VM', browser: 'IE 11', os: 'Windows Server 2012', location: 'Decommissioned Zone', ip: '192.168.1.100', timestamp: Q_pastDate(15), isCurrent: false, userAgent: 'MSIE 11.0;', country: 'Unknown', city: 'Unknown', hardwareId: 'VM-Legacy', authenticationMethod: 'Password' },
            { id: '4', device: 'Backup Server', browser: 'N/A', os: 'Linux CentOS 7', location: 'Data Center B', ip: '172.16.0.20', timestamp: Q_pastDate(30), isCurrent: false, userAgent: 'BackupAgent/2.0', country: 'US', city: 'Chicago', hardwareId: 'SRV-Backup-01', authenticationMethod: 'SSH Key' },
            { id: '5', device: 'Admin Laptop', browser: 'Firefox', os: 'macOS Sonoma', location: 'Home Office', ip: '10.1.10.50', timestamp: Q_pastDate(0.2), isCurrent: false, userAgent: 'Mozilla/5.0', country: 'GB', city: 'London', hardwareId: 'LB-Admin-2024', authenticationMethod: 'TOTP' },
        ]);

        // Mock Devices (Expanded Device Details)
        H_setDevices([
            { id: 'dvc_1', name: 'Primary Workstation', type: 'Desktop', model: 'Custom Build X9', lastActivity: Q_pastDate(0.01), location: 'HQ Server Room', ip: '10.0.0.5', isCurrent: true, permissions: ['read_all', 'write_transactions', 'admin_config', 'execute_scripts'], status: 'active', firstSeen: Q_pastDate(500), userAgent: 'EnterpriseAgent/1.0', pushNotificationsEnabled: true, biometricAuthEnabled: true, encryptionStatus: 'AES-256-GCM', osVersion: 'Linux Kernel 6.8', firewallStatus: 'Active', antivirusStatus: 'Up-to-date', diskSpace: 512, memory: 32, cpuCores: 8, lastScan: Q_pastDate(0.001) },
            { id: 'dvc_2', name: 'Executive Tablet', type: 'Tablet', model: 'Pad Pro 14', lastActivity: Q_pastDate(0.5), location: 'Remote Office', ip: '203.0.113.45', isCurrent: false, permissions: ['read_reports', 'view_dashboards'], status: 'active', firstSeen: Q_pastDate(120), userAgent: 'MobileSafari/605.1.15', pushNotificationsEnabled: false, biometricAuthEnabled: true, encryptionStatus: 'full', osVersion: 'iOS 18.0 Beta', firewallStatus: 'Inactive', antivirusStatus: 'N/A', diskSpace: 256, memory: 8, cpuCores: 4, lastScan: Q_pastDate(1) },
            { id: 'dvc_3', name: 'Dev Server', type: 'Server', model: 'Dell PowerEdge', lastActivity: Q_pastDate(2), location: 'Data Center A', ip: '192.168.2.10', isCurrent: false, permissions: ['deploy_code', 'access_database'], status: 'active', firstSeen: Q_pastDate(365), userAgent: 'ServerAgent/1.0', pushNotificationsEnabled: false, biometricAuthEnabled: false, encryptionStatus: 'partial', osVersion: 'Ubuntu 22.04', firewallStatus: 'Active', antivirusStatus: 'Active', diskSpace: 1024, memory: 64, cpuCores: 16, lastScan: Q_pastDate(0.5) },
        ]);

        // Mock AI Insights (More diverse insights)
        I_setAiInsights([
            { id: 'ai_001', timestamp: Q_pastDate(0.1), severity: 'High', summary: 'Unusual Data Access Pattern Detected', recommendation: 'Review recent read operations from Device ID dvc_2 between 02:00 and 04:00 UTC. Initiate temporary read-only lock. Analyze user behavior for anomalies.', sourceModel: 'BehavioralAnomaly_v3' },
            { id: 'ai_002', timestamp: Q_pastDate(1), severity: 'Medium', summary: 'Outdated OS Detected on Active Device', recommendation: 'Update OS on "Legacy VM" (IP 192.168.1.100) to a supported version or isolate it to a sandbox network segment. Schedule automated patch deployment.', sourceModel: 'VulnerabilityScanner_v1' },
            { id: 'ai_003', timestamp: Q_pastDate(0.5), severity: 'Low', summary: 'Potential Phishing Attempt Detected', recommendation: 'Monitor email activity for user associated with Device ID dvc_1. Provide security awareness training.', sourceModel: 'EmailAnalysis_v1' },
            { id: 'ai_004', timestamp: Q_pastDate(2), severity: 'Critical', summary: 'Unauthorized Access Attempt from External IP', recommendation: 'Block IP address 45.123.45.67 immediately. Investigate source and scope of the intrusion attempt. Initiate forensic analysis.', sourceModel: 'IntrusionDetection_v2' },
        ]);

        // Mock Threat Alerts (Comprehensive Threat Scenarios)
        if (threatAlerts === undefined || threatAlerts.length === 0) {
            const R_mockThreatAlerts: ThreatAlert[] = [
                { alertId: 'ta_001', timestamp: Q_pastDate(0.02), title: 'Ransomware Attack Detected', description: 'System files encrypted. Source: Unknown. Isolate affected systems immediately.', severity: 'Critical', status: 'Active' },
                { alertId: 'ta_002', timestamp: Q_pastDate(0.1), title: 'DDoS Attack on Web Servers', description: 'High traffic volume detected. Mitigation in progress. Monitor server performance.', severity: 'High', status: 'Mitigated' },
                { alertId: 'ta_003', timestamp: Q_pastDate(0.5), title: 'SQL Injection Attempt', description: 'Attempt to inject malicious SQL code. Prevented by firewall. Review logs for further activity.', severity: 'Medium', status: 'Resolved' },
                { alertId: 'ta_004', timestamp: Q_pastDate(2), title: 'Account Compromise Detected', description: 'Unusual login activity detected. User account locked. Initiate password reset.', severity: 'High', status: 'Active' },
                { alertId: 'ta_005', timestamp: Q_pastDate(7), title: 'Malware Detected in Email Attachment', description: 'Malicious attachment blocked. Sender: suspicious@example.com. Update antivirus definitions.', severity: 'Low', status: 'Resolved' },
                { alertId: 'ta_006', timestamp: Q_pastDate(14), title: 'Data Exfiltration Attempt', description: 'Large volume of data transferred to external IP. Investigate user activity and data sensitivity.', severity: 'Critical', status: 'Active' },
            ];
        }
        if (threatAlerts) L_setThreatAlertsDisplay(threatAlerts.slice(0, A_MAX_THREAT_ALERTS_DISPLAY)); // Initial Display

        // Simulate loading security metrics if available
        if (securityMetrics && securityMetrics.length > 0) {
            const S_scoreMetric = securityMetrics.find(m => m.metricName === 'OverallSecurityScore');
            if (S_scoreMetric) {
                K_setSecurityScore(Math.round(parseFloat(S_scoreMetric.currentValue) * 100));
            }
        }

        // Fetch User Avatar (Mock Implementation)
        if (userProfile) {
            N_setUserAvatar(userProfile.avatarUrl || 'https://via.placeholder.com/150'); // Default Placeholder
        }

        // Periodic UI Refresh
        const T_refreshInterval = setInterval(() => {
            O_setLastSyncTimestamp(Date.now());
            // Simulate background data sync
            console.log(`${jbocoBranding}: Auto-refreshing UI data...`);
        }, A_UI_REFRESH_INTERVAL);

        return () => clearInterval(T_refreshInterval); // Cleanup Interval

    }, [securityMetrics, threatAlerts, userProfile, jbocoBranding]);

    // --- Handlers (The James Burvel O’Callaghan III Code) ---
    const U_showNotification = useCallback((message: string, type: 'success' | 'error' | 'info' | 'warning' | 'critical') => {
        F_setNotification({ message, type, isVisible: true });
    }, []);

    const V_closeNotification = useCallback(() => {
        F_setNotification(prev => prev ? { ...prev, isVisible: false } : null);
    }, []);

    const W_handleUnlink = (id: string) => {
        if (unlinkAccount) {
            unlinkAccount(id);
            U_showNotification(`${jbocoBranding}: Financial Source ID ${id} successfully revoked access.`, 'success');
        }
    };

    const X_handlePolicyToggle = (policy: DataSharingPolicy, enabled: boolean) => {
        console.log(`${jbocoBranding}: Policy ${policy.policyId} toggled to ${enabled}`);
        U_showNotification(`${jbocoBranding}: Data Sharing Policy "${policy.policyName}" updated to ${enabled ? 'Active' : 'Inactive'}.`, 'info');
    };

    const Y_handleAPIKeyRevoke = (keyId: string) => {
        U_showNotification(`${jbocoBranding}: API Key ${keyId.substring(0, 8)}... has been immediately revoked and invalidated.`, 'critical');
    };

    const Z_handleRiskThresholdChange = (newThreshold: number) => {
        M_setRiskThreshold(newThreshold);
        U_showNotification(`${jbocoBranding}: Risk Threshold updated to ${newThreshold.toFixed(2)}.`, 'info');
    };

    const AA_handleThreatAlertDismiss = (alertId: string) => {
        // Mock implementation to simulate dismissing the alert.
        const AA_updatedAlerts = L_threatAlertsDisplay.filter(alert => alert.alertId !== alertId);
        L_setThreatAlertsDisplay(AA_updatedAlerts);
        U_showNotification(`${jbocoBranding}: Threat Alert ${alertId.substring(0, 8)} dismissed.`, 'success');
    };

    const BB_handleAuditLogPageChange = (newPage: number) => {
        P_setAuditLogPage(newPage);
    };

    // --- Render Helpers (The James Burvel O’Callaghan III Code) ---
    const CC_renderLinkedAccounts = useMemo(() => (
        <Card title={`Financial Data Sources (Plaid Integration) - ${jbocoBranding}`} className="lg:col-span-2">
            <div className="space-y-4">
                <p className="text-gray-400 text-sm border-b border-gray-800 pb-3">Securely manage connections to external financial institutions via encrypted tokenization. Last sync: {new Date(O_lastSyncTimestamp).toLocaleTimeString()}</p>
                {linkedAccounts && linkedAccounts.length >

================================================================================
// APPENDED FROM REPO: diplomat-bit/almost | ORIGINAL PATH: diplomat-bit-almost-93a5466/components/SecurityView.tsx
================================================================================


import React, { useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { DataContext } from '../context/DataContext';
import Card from './Card';
import PlaidLinkButton from './PlaidLinkButton';
import { 
    LoginActivity, Device, DataSharingPolicy, TransactionRule, ThreatAlert, 
    AuditLogEntry, APIKey, TrustedContact, SecurityAwarenessModule, SecurityScoreMetric, UserProfile 
} from '../types';

// --- AI/ML Integration Placeholder Types (Simulated for expansion) ---
interface AISecurityInsight {
    id: string;
    timestamp: string;
    severity: 'Low' | 'Medium' | 'High' | 'Critical';
    summary: string;
    recommendation: string;
    sourceModel: string;
}

// --- Constants for Billion Dollar Features ---
const AI_INSIGHT_ENGINE_VERSION = "ChaosEngine v0.0.1-Garbage";
const MAX_AUDIT_LOG_DISPLAY = 5;

// --- Helper Components ---

export const SecuritySettingToggle: React.FC<{
    id: string;
    title: string;
    description: string;
    defaultChecked: boolean;
    onToggle?: (checked: boolean) => void;
    disabled?: boolean;
    aiImpact?: 'High' | 'Medium' | 'Low' | 'None';
}> = ({ id, title, description, defaultChecked, onToggle, disabled, aiImpact = 'None' }) => {
    const [isChecked, setIsChecked] = useState(defaultChecked);
    const { showSystemAlert } = useContext(DataContext) || {};

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newState = e.target.checked;
        setIsChecked(newState);
        onToggle && onToggle(newState);
        
        if (showSystemAlert) {
            const impactColor = aiImpact === 'High' ? 'text-red-400' : aiImpact === 'Medium' ? 'text-yellow-400' : 'text-green-400';
            showSystemAlert(`Configuration Change Detected: ${title} set to ${newState ? 'Enabled' : 'Disabled'}. AI Risk Assessment: ${aiImpact}.`, 'info');
        }
    };

    const aiIndicator = useMemo(() => {
        if (aiImpact === 'None') return null;
        const colorMap = {
            High: 'bg-red-500',
            Medium: 'bg-yellow-500',
            Low: 'bg-blue-500',
        };
        return (
            <span className={`ml-3 px-2 py-0.5 text-xs font-bold rounded-full text-white ${colorMap[aiImpact]}`}>
                AI {aiImpact}
            </span>
        );
    }, [aiImpact]);

    return (
        <li className="py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-gray-800/70">
            <div className="flex-grow">
                <label htmlFor={`toggle-${id}`} className="font-bold text-lg text-white cursor-pointer flex items-center">
                    {title}
                    {aiIndicator}
                </label>
                <p className="text-sm text-gray-400 max-w-xl mt-1">{description}</p>
            </div>
            <div className="flex items-center mt-2 sm:mt-0">
                <span className={`mr-3 text-sm font-medium ${isChecked ? 'text-green-400' : 'text-red-400'}`}>
                    {isChecked ? 'ACTIVE' : 'INACTIVE'}
                </span>
                <input
                    type="checkbox"
                    id={`toggle-${id}`}
                    className="toggle toggle-cyan toggle-lg"
                    checked={isChecked}
                    onChange={handleChange}
                    disabled={disabled}
                    aria-label={`Toggle for ${title}`}
                />
            </div>
        </li>
    );
};

export const NotificationToast: React.FC<{
    message: string;
    type: 'success' | 'error' | 'info' | 'warning' | 'critical';
    onClose: () => void;
    isVisible: boolean;
}> = ({ message, type, onClose, isVisible }) => {
    const typeClasses = {
        success: 'bg-green-700 border-green-500',
        error: 'bg-red-700 border-red-500',
        info: 'bg-blue-700 border-blue-500',
        warning: 'bg-yellow-700 border-yellow-500',
        critical: 'bg-purple-800 border-purple-500'
    };
    
    const iconMap = {
        success: <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
        error: <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
        info: <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
        warning: <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.938 5.002c-.77-1.333-2.688-1.333-3.458 0L3.308 18.002c-.77 1.333.192 3 1.732 3z" /></svg>,
        critical: <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.938 5.002c-.77-1.333-2.688-1.333-3.458 0L3.308 18.002c-.77 1.333.192 3 1.732 3z" /></svg>
    };

    useEffect(() => {
        let timer: ReturnType<typeof setTimeout>;
        if (isVisible) {
            const duration = type === 'critical' ? 15000 : 7000;
            timer = setTimeout(() => { onClose(); }, duration);
        }
        return () => clearTimeout(timer);
    }, [isVisible, onClose, type]);

    if (!isVisible) return null;
    return (
        <div className={`fixed bottom-8 right-8 p-5 rounded-xl shadow-2xl text-white flex items-start space-x-4 transition-all duration-500 ease-out transform border-l-8 ${typeClasses[type]} ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'}`} style={{zIndex: 1000, minWidth: '300px'}}>
            <div className="flex-shrink-0 mt-1">
                {iconMap[type]}
            </div>
            <div className="flex-grow">
                <span className="text-sm font-bold block capitalize">{type} Alert</span>
                <span className="text-base font-medium">{message}</span>
            </div>
            <button onClick={onClose} className="p-1 rounded-full hover:bg-black/20 focus:outline-none flex-shrink-0 mt-0.5 transition-colors">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
        </div>
    );
};

// --- AI Insight Display Component ---
const AISecurityInsightCard: React.FC<{ insight: AISecurityInsight }> = ({ insight }) => {
    const severityClasses = {
        Critical: 'border-red-600 bg-red-900/20 text-red-300',
        High: 'border-orange-600 bg-orange-900/20 text-orange-300',
        Medium: 'border-yellow-600 bg-yellow-900/20 text-yellow-300',
        Low: 'border-green-600 bg-green-900/20 text-green-300',
    };

    return (
        <div className={`p-4 rounded-xl border-l-4 shadow-lg transition-all duration-300 hover:shadow-xl ${severityClasses[insight.severity]}`}>
            <div className="flex justify-between items-start mb-2">
                <h4 className="font-extrabold text-lg">{insight.summary}</h4>
                <span className={`text-xs font-semibold px-2 py-1 rounded-full ${severityClasses[insight.severity].replace('border-', 'bg-').replace('/20', '/40')}`}>{insight.severity}</span>
            </div>
            <p className="text-sm text-gray-300 mb-3">{insight.recommendation}</p>
            <div className="text-xs text-gray-400 flex justify-between border-t border-current pt-2 mt-2">
                <span>Engine: {insight.sourceModel}</span>
                <span>Detected: {new Date(insight.timestamp).toLocaleString()}</span>
            </div>
        </div>
    );
};

// --- Main Component ---

const SecurityView: React.FC = () => {
    const context = useContext(DataContext);
    const { 
        linkedAccounts, unlinkAccount, handlePlaidSuccess, 
        securityMetrics, auditLogs, threatAlerts, 
        dataSharingPolicies, apiKeys, trustedContacts, 
        securityAwarenessModules, showSystemAlert,
        transactionRules 
    } = context || {};

    const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' | 'info' | 'warning' | 'critical'; isVisible: boolean } | null>(null);
    const [loginActivity, setLoginActivity] = useState<LoginActivity[]>([]);
    const [devices, setDevices] = useState<Device[]>([]);
    const [aiInsights, setAiInsights] = useState<AISecurityInsight[]>([]);
    const [activeTab, setActiveTab] = useState<'overview' | 'policies' | 'keys' | 'ai_analysis'>('overview');
    const [securityScore, setSecurityScore] = useState<number>(75); // Initial mock score

    // --- Mock Data Initialization & AI Simulation ---
    useEffect(() => {
        const now = new Date();
        const pastDate = (days: number) => new Date(now.getTime() - days * 24 * 60 * 60 * 1000).toISOString();

        // Mock Login Activity
        setLoginActivity([
            { id: '1', device: 'Quantum Workstation', browser: 'Chrome 125 (Secure)', os: 'Linux Kernel 6.8', location: 'HQ Server Room', ip: '10.0.0.5', timestamp: pastDate(0.01), isCurrent: true, userAgent: 'EnterpriseAgent/1.0' },
            { id: '2', device: 'Personal Mobile', browser: 'Safari', os: 'iOS 18.0 Beta', location: 'Remote Office', ip: '203.0.113.45', timestamp: pastDate(1.5), isCurrent: false, userAgent: 'MobileSafari/605.1.15' },
            { id: '3', device: 'Legacy VM', browser: 'IE 11', os: 'Windows Server 2012', location: 'Decommissioned Zone', ip: '192.168.1.100', timestamp: pastDate(15), isCurrent: false, userAgent: 'MSIE 11.0;' },
        ]);

        // Mock Devices
        setDevices([
            { id: 'dvc_1', name: 'Primary Workstation', type: 'Desktop', model: 'Custom Build X9', lastActivity: pastDate(0.01), location: 'HQ Server Room', ip: '10.0.0.5', isCurrent: true, permissions: ['read_all', 'write_transactions', 'admin_config'], status: 'active', firstSeen: pastDate(500), userAgent: 'EnterpriseAgent/1.0', pushNotificationsEnabled: true, biometricAuthEnabled: true, encryptionStatus: 'AES-256-GCM' },
            { id: 'dvc_2', name: 'Executive Tablet', type: 'Tablet', model: 'Pad Pro 14', lastActivity: pastDate(0.5), location: 'Remote Office', ip: '203.0.113.45', isCurrent: false, permissions: ['read_reports'], status: 'active', firstSeen: pastDate(120), userAgent: 'MobileSafari/605.1.15', pushNotificationsEnabled: false, biometricAuthEnabled: true, encryptionStatus: 'full' },
        ]);

        // Mock AI Insights based on potential issues
        setAiInsights([
            { 
                id: 'ai_001', 
                timestamp: pastDate(0.1), 
                severity: 'High', 
                summary: 'Unusual Data Access Pattern Detected', 
                recommendation: 'Review recent read operations from Device ID dvc_2 between 02:00 and 04:00 UTC. Initiate temporary read-only lock.', 
                sourceModel: 'BehavioralAnomaly_v3' 
            },
            { 
                id: 'ai_002', 
                timestamp: pastDate(1), 
                severity: 'Medium', 
                summary: 'Outdated OS Detected on Active Device', 
                recommendation: 'Update OS on "Legacy VM" (IP 192.168.1.100) to a supported version or isolate it to a sandbox network segment.', 
                sourceModel: 'VulnerabilityScanner_v1' 
            },
        ]);

        // Simulate loading security metrics if available
        if (securityMetrics && securityMetrics.length > 0) {
            const scoreMetric = securityMetrics.find(m => m.metricName === 'OverallSecurityScore');
            if (scoreMetric) {
                setSecurityScore(Math.round(parseFloat(scoreMetric.currentValue) * 100));
            }
        }

    }, [securityMetrics]);

    // --- Handlers ---
    const showNotification = useCallback((message: string, type: 'success' | 'error' | 'info' | 'warning' | 'critical') => {
        setNotification({ message, type, isVisible: true });
    }, []);

    const closeNotification = useCallback(() => {
        setNotification(prev => prev ? { ...prev, isVisible: false } : null);
    }, []);

    const handleUnlink = (id: string) => {
        if (unlinkAccount) {
            unlinkAccount(id);
            showNotification(`Financial Source ID ${id} successfully revoked access.`, 'success');
        }
    };

    const handlePolicyToggle = (policy: DataSharingPolicy, enabled: boolean) => {
        // In a real app, this would call an API to update the policy state
        console.log(`Policy ${policy.policyId} toggled to ${enabled}`);
        showNotification(`Data Sharing Policy "${policy.policyName}" updated to ${enabled ? 'Active' : 'Inactive'}.`, 'info');
    };

    const handleAPIKeyRevoke = (keyId: string) => {
        // In a real app, this would call an API to revoke the key
        showNotification(`API Key ${keyId.substring(0, 8)}... has been immediately revoked and invalidated.`, 'critical');
    };

    // --- Render Helpers ---

    const renderLinkedAccounts = useMemo(() => (
        <Card title="Financial Data Sources (Plaid Integration)" className="lg:col-span-2">
            <div className="space-y-4">
                <p className="text-gray-400 text-sm border-b border-gray-800 pb-3">Securely manage connections to external financial institutions via encrypted tokenization. Last sync: {new Date().toLocaleTimeString()}</p>
                {linkedAccounts && linkedAccounts.length > 0 ? (
                    <div className="space-y-3">
                        {linkedAccounts.map(account => (
                            <div key={account.id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 bg-gray-800/70 rounded-lg border border-cyan-700/50 shadow-md">
                                <div className="flex items-center mb-2 sm:mb-0">
                                    <div className="w-12 h-12 rounded-xl bg-cyan-900/70 flex items-center justify-center text-cyan-300 mr-4 flex-shrink-0">
                                        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" /></svg>
                                    </div>
                                    <div>
                                        <p className="font-bold text-lg text-white">{account.name}</p>
                                        <p className="text-sm text-gray-400">Institution ID: {account.institutionId} | Mask: {account.mask}</p>
                                    </div>
                                </div>
                                <div className="flex space-x-2 mt-2 sm:mt-0">
                                    <button 
                                        onClick={() => showNotification(`Initiating re-authentication for ${account.name}...`, 'info')}
                                        className="px-3 py-1.5 bg-indigo-900/30 hover:bg-indigo-900/50 text-indigo-300 rounded-lg text-sm transition-colors border border-indigo-700"
                                    >
                                        Re-sync
                                    </button>
                                    <button 
                                        onClick={() => handleUnlink(account.id)}
                                        className="px-3 py-1.5 bg-red-900/50 hover:bg-red-900/70 text-red-300 rounded-lg text-sm transition-colors border border-red-700"
                                    >
                                        Revoke Access
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="p-6 bg-gray-800/50 rounded-lg text-center border border-dashed border-gray-700">
                        <p className="text-gray-500 italic mb-3">No external financial data sources are currently integrated.</p>
                        {handlePlaidSuccess && <PlaidLinkButton onSuccess={handlePlaidSuccess} label="Connect New Financial Source" className="w-full sm:w-auto" />}
                    </div>
                )}
            </div>
        </Card>
    ), [linkedAccounts, handlePlaidSuccess, handleUnlink, showNotification]);

    const renderSecuritySettings = useMemo(() => (
        <Card title="Core Authentication & Access Controls" className="lg:col-span-1">
            <ul className="divide-y divide-gray-700/50">
                <SecuritySettingToggle 
                    id="2fa_quantum"
                    title="Quantum 2FA (Hardware Key Required)" 
                    description="Mandatory FIDO2/WebAuthn hardware key enforcement for all administrative roles. Software TOTP is deprecated." 
                    defaultChecked={true} 
                    aiImpact='High'
                />
                <SecuritySettingToggle 
                    id="biometric_device"
                    title="Device Biometric Trust" 
                    description="Enforce device-level biometric verification for any transaction exceeding $10,000 or configuration change." 
                    defaultChecked={true} 
                    aiImpact='Medium'
                />
                <SecuritySettingToggle 
                    id="session_timeout"
                    title="Zero-Trust Session Invalidation" 
                    description="Sessions automatically terminate after 15 minutes of inactivity, requiring re-authentication via context-aware challenge." 
                    defaultChecked={true} 
                    aiImpact='High'
                />
                <li className="py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-gray-800/70">
                     <div className="flex-grow">
                        <span className="font-bold text-lg text-white flex items-center">Master Credential Management</span>
                        <p className="text-sm text-gray-400">Last rotation: 2024-01-15. Next mandatory rotation: 2025-01-15.</p>
                     </div>
                     <button className="px-6 py-2 bg-indigo-700 hover:bg-indigo-600 text-white font-semibold rounded-lg text-sm transition-colors shadow-lg mt-2 sm:mt-0">
                        Initiate Credential Rotation Protocol
                     </button>
                </li>
            </ul>
        </Card>
    ), []);

    const renderRecentActivity = useMemo(() => (
        <Card title="Real-Time Login Telemetry" className="lg:col-span-1">
            <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                {loginActivity.map(activity => (
                    <div key={activity.id} className="flex items-start justify-between p-3 bg-gray-800/50 rounded-lg border-l-4 border-gray-700 hover:bg-gray-700/50 transition-colors">
                        <div className="flex-grow min-w-0">
                            <p className="font-bold text-white truncate flex items-center gap-2">
                                {activity.device}
                                {activity.isCurrent && <span className="px-2 py-0.5 bg-green-600/50 text-green-200 text-xs rounded-full font-medium flex-shrink-0">LIVE SESSION</span>}
                            </p>
                            <p className="text-xs text-gray-400 mt-1">
                                <span className="font-mono bg-gray-700/50 px-1 rounded mr-1">{activity.ip}</span> 
                                @ {activity.location} ({activity.os})
                            </p>
                        </div>
                        <span className="text-xs text-gray-500 ml-2 flex-shrink-0">{new Date(activity.timestamp).toLocaleTimeString()}</span>
                    </div>
                ))}
            </div>
        </Card>
    ), [loginActivity]);

    const renderActiveDevices = useMemo(() => (
        <Card title="Managed Endpoints Inventory" className="lg:col-span-2">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {devices.map(device => (
                    <div key={device.id} className="p-4 bg-gray-800/50 rounded-lg border border-indigo-700/50 flex flex-col shadow-lg">
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-indigo-900/70 rounded-lg flex items-center justify-center text-indigo-300 flex-shrink-0">
                                    {device.type === 'Mobile' ? (
                                         <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
                                    ) : (
                                         <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                                    )}
                                </div>
                                <p className="font-bold text-white truncate">{device.name}</p>
                            </div>
                            <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${device.status === 'active' ? 'bg-green-600/30 text-green-300' : 'bg-red-600/30 text-red-300'}`}>
                                {device.status.toUpperCase()}
                            </span>
                        </div>
                        <p className="text-xs text-gray-400 mb-2">Model: {device.model} ({device.type})</p>
                        <p className="text-xs text-gray-500 truncate">IP: {device.ip} | Last Seen: {new Date(device.lastActivity).toLocaleTimeString()}</p>
                        <div className="mt-3 pt-2 border-t border-gray-700">
                            <p className="text-xs font-semibold text-cyan-400">Permissions Granted: {device.permissions.length}</p>
                            <div className="flex flex-wrap gap-1 mt-1">
                                {device.permissions.slice(0, 3).map(p => (
                                    <span key={p} className="text-[10px] bg-gray-700 text-gray-300 px-1 rounded">{p}</span>
                                ))}
                                {device.permissions.length > 3 && <span className="text-[10px] text-gray-500">+{device.permissions.length - 3} more</span>}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </Card>
    ), [devices]);

    const renderDataPolicies = useMemo(() => (
        <Card title="Data Governance & Sharing Policies" className="lg:col-span-2">
            <p className="text-sm text-gray-400 mb-4">Define granular controls over how internal and external data sets are processed, stored, and shared. Managed by AI Policy Engine.</p>
            <div className="space-y-4">
                {(dataSharingPolicies || []).map(policy => (
                    <div key={policy.policyId} className="p-4 bg-gray-800/70 rounded-lg border border-purple-700/50 flex flex-col md:flex-row justify-between items-start md:items-center">
                        <div className="flex-grow mb-2 md:mb-0">
                            <p className="font-bold text-white text-lg">{policy.policyName}</p>
                            <p className="text-xs text-gray-400 mt-1">Scope: {policy.scope} | Last Reviewed: {policy.lastReviewed}</p>
                        </div>
                        <div className="flex items-center space-x-4">
                            <span className={`text-sm font-semibold ${policy.isActive ? 'text-green-400' : 'text-red-400'}`}>
                                {policy.isActive ? 'ACTIVE' : 'DRAFT'}
                            </span>
                            <SecuritySettingToggle
                                id={`policy-${policy.policyId}`}
                                title="Enable Policy"
                                description={`Toggle activation for ${policy.policyName}`}
                                defaultChecked={policy.isActive}
                                onToggle={(checked) => handlePolicyToggle(policy, checked)}
                                aiImpact='Medium'
                            />
                        </div>
                    </div>
                ))}
            </div>
        </Card>
    ), [dataSharingPolicies, handlePolicyToggle]);

    const renderAPIKeys = useMemo(() => (
        <Card title="System API Key Management" className="lg:col-span-2">
            <p className="text-sm text-gray-400 mb-4">Manage programmatic access tokens. Keys are automatically rotated by the Quantum Key Vault every 90 days.</p>
            <div className="space-y-3">
                {(apiKeys || []).map(key => (
                    <div key={key.id} className="flex justify-between items-center p-3 bg-gray-800/70 rounded-lg border border-yellow-700/50">
                        <div className="flex items-center min-w-0">
                            <svg className="w-5 h-5 text-yellow-400 mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M6 16h.01" /></svg>
                            <div>
                                <p className="font-mono text-sm text-white truncate">{key.keyName} ({key.id.substring(0, 8)}...)</p>
                                <p className="text-xs text-gray-500">Created: {key.creationDate} | Permissions: {key.scopes.join(', ')}</p>
                            </div>
                        </div>
                        <button 
                            onClick={() => handleAPIKeyRevoke(key.id)}
                            className="px-3 py-1 bg-red-900/30 hover:bg-red-900/50 text-red-300 rounded-md text-xs transition-colors flex-shrink-0 ml-4"
                        >
                            Revoke Now
                        </button>
                    </div>
                ))}
            </div>
        </Card>
    ), [apiKeys, handleAPIKeyRevoke]);

    const renderAIAnalysis = useMemo(() => (
        <div className="space-y-6">
            <Card title={`AI Threat Intelligence Feed (${AI_INSIGHT_ENGINE_VERSION})`}>
                <div className="flex justify-between items-center mb-4 border-b border-gray-800 pb-3">
                    <p className="text-gray-400 text-sm">Real-time behavioral analysis and predictive threat modeling.</p>
                    <span className="text-sm font-bold text-cyan-400">Total Insights: {aiInsights.length}</span>
                </div>
                <div className="space-y-4">
                    {aiInsights.length > 0 ? (
                        aiInsights.map(insight => (
                            <AISecurityInsightCard key={insight.id} insight={insight} />
                        ))
                    ) : (
                        <div className="p-6 bg-gray-800/50 rounded-lg text-center border border-dashed border-gray-700">
                            <p className="text-gray-500 italic">AI Engine reports no immediate high-priority anomalies at this time.</p>
                        </div>
                    )}
                </div>
            </Card>

            <Card title="Security Awareness Training Modules">
                <p className="text-sm text-gray-400 mb-4">Track mandatory compliance training completion status across the organization.</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {(securityAwarenessModules || []).map(module => (
                        <div key={module.moduleId} className="p-4 bg-gray-800/70 rounded-lg border border-green-700/50">
                            <p className="font-bold text-white">{module.title}</p>
                            <p className="text-xs text-gray-400 mt-1">Status: {module.completionRate}% Complete</p>
                            <div className="w-full bg-gray-700 rounded-full h-2.5 mt-2">
                                <div className="bg-green-500 h-2.5 rounded-full" style={{ width: `${module.completionRate}%` }}></div>
                            </div>
                        </div>
                    ))}
                </div>
            </Card>
        </div>
    ), [aiInsights, securityAwarenessModules]);

    const renderAuditLogs = useMemo(() => {
        const displayLogs = (auditLogs || []).slice(0, MAX_AUDIT_LOG_DISPLAY);
        return (
            <Card title={`System Audit Trail (Last ${displayLogs.length} Entries)`} className="lg:col-span-2">
                <p className="text-sm text-gray-400 mb-3">Immutable record of all configuration changes, data access events, and administrative actions.</p>
                <div className="overflow-x-auto max-h-[500px] custom-scrollbar">
                    <table className="min-w-full divide-y divide-gray-700">
                        <thead className="sticky top-0 bg-gray-800 z-10">
                            <tr>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Time</th>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">User/System</th>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Action</th>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Target</th>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-800">
                            {displayLogs.map((log: AuditLogEntry) => (
                                <tr key={log.id} className="hover:bg-gray-800/50 transition-colors">
                                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">{new Date(log.timestamp).toLocaleTimeString()}</td>
                                    <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-white">{log.userId.includes('sys_') ? 'SYSTEM' : log.userId}</td>
                                    <td className="px-4 py-2 text-sm text-cyan-400">{log.action}</td>
                                    <td className="px-4 py-2 text-sm text-gray-400">{log.targetResource}</td>
                                    <td className="px-4 py-2 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${log.success ? 'bg-green-900/50 text-green-300' : 'bg-red-900/50 text-red-300'}`}>
                                            {log.success ? 'SUCCESS' : 'FAILURE'}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {displayLogs.length < (auditLogs?.length || 0) && (
                    <p className="text-center text-sm text-gray-500 mt-3">Displaying first {MAX_AUDIT_LOG_DISPLAY} logs. Load full history via dedicated Audit Console.</p>
                )}
            </Card>
        );
    }, [auditLogs]);

    const renderSecurityScoreGauge = useMemo(() => {
        const radius = 50;
        const circumference = 2 * Math.PI * radius;
        const offset = circumference - (securityScore / 100) * circumference;
        const color = securityScore >= 90 ? 'stroke-green-500' : securityScore >= 70 ? 'stroke-yellow-500' : 'stroke-red-500';

        return (
            <div className="flex flex-col items-center p-6 bg-gray-800/70 rounded-xl shadow-inner border border-gray-700">
                <h3 className="text-xl font-bold text-white mb-3">Quantum Security Index (QSI)</h3>
                <svg width="120" height="120" viewBox="0 0 120 120" className="transform -rotate-90">
                    {/* Background Circle */}
                    <circle
                        cx="60"
                        cy="60"
                        r={radius}
                        fill="transparent"
                        stroke="#374151"
                        strokeWidth="10"
                    />
                    {/* Progress Arc */}
                    <circle
                        cx="60"
                        cy="60"
                        r={radius}
                        fill="transparent"
                        stroke={color.replace('stroke-', '')}
                        strokeWidth="10"
                        strokeDasharray={circumference}
                        strokeDashoffset={offset}
                        strokeLinecap="round"
                        className="transition-all duration-1000 ease-out"
                    />
                    {/* Text */}
                    <text
                        x="60"
                        y="60"
                        dominantBaseline="middle"
                        textAnchor="middle"
                        className="fill-current text-white"
                        fontSize="20"
                        fontWeight="bold"
                    >
                        {securityScore}%
                    </text>
                </svg>
                <p className="text-sm text-gray-400 mt-2">Target: 95%</p>
            </div>
        );
    }, [securityScore]);

    const renderTrustedContacts = useMemo(() => (
        <Card title="Emergency Trusted Contacts" className="lg:col-span-1">
            <p className="text-sm text-gray-400 mb-4">Contacts authorized for emergency account recovery or high-risk alerts.</p>
            <div className="space-y-3">
                {(trustedContacts || []).map((contact: TrustedContact) => (
                    <div key={contact.id} className="flex justify-between items-center p-3 bg-gray-800/50 rounded-lg border border-gray-700">
                        <div className="flex items-center">
                            <div className="w-8 h-8 bg-pink-900/50 rounded-full flex items-center justify-center text-pink-300 mr-3">
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                            </div>
                            <div>
                                <p className="font-semibold text-white">{contact.name}</p>
                                <p className="text-xs text-gray-400">{contact.relationship}</p>
                            </div>
                        </div>
                        <span className={`text-xs font-medium px-2 py-0.5 rounded ${contact.verified ? 'bg-green-900/30 text-green-400' : 'bg-red-900/30 text-red-400'}`}>
                            {contact.verified ? 'Verified' : 'Pending'}
                        </span>
                    </div>
                ))}
            </div>
        </Card>
    ), [trustedContacts]);


    // --- Tab Content Rendering ---
    const renderContent = () => {
        switch (activeTab) {
            case 'overview':
                return (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {renderSecurityScoreGauge}
                        {renderRecentActivity}
                        {renderActiveDevices}
                        {renderLinkedAccounts}
                        {renderSecuritySettings}
                    </div>
                );
            case 'policies':
                return (
                    <div className="grid grid-cols-1 gap-6">
                        {renderDataPolicies}
                        <Card title="Transaction Rule Engine" className="lg:col-span-2">
                            <p className="text-sm text-gray-400 mb-4">Define automated responses to financial events based on predefined risk thresholds.</p>
                            <div className="space-y-3">
                                {(transactionRules || []).map((rule: TransactionRule) => (
                                    <div key={rule.ruleId} className="p-3 bg-gray-800/70 rounded-lg border border-cyan-700/50 flex justify-between items-center">
                                        <div>
                                            <p className="font-bold text-white">{rule.name}</p>
                                            <p className="text-xs text-gray-400">Trigger: {rule.triggerCondition} | Action: {rule.action}</p>
                                        </div>
                                        <span className={`text-xs font-medium px-2 py-0.5 rounded ${rule.isEnabled ? 'bg-green-900/30 text-green-400' : 'bg-red-900/30 text-red-400'}`}>
                                            {rule.isEnabled ? 'ACTIVE' : 'DISABLED'}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    </div>
                );
            case 'keys':
                return (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {renderAPIKeys}
                        {renderTrustedContacts}
                        <Card title="Threat Alert History" className="lg:col-span-3">
                            <p className="text-sm text-gray-400 mb-4">Historical record of confirmed security incidents.</p>
                            <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                                {(threatAlerts || []).map((alert: ThreatAlert) => (
                                    <div key={alert.alertId} className="p-3 bg-red-900/30 rounded-lg border border-red-600 flex justify-between items-center">
                                        <div>
                                            <p className="font-bold text-red-300">{alert.title}</p>
                                            <p className="text-xs text-gray-300">{alert.description}</p>
                                        </div>
                                        <span className="text-xs text-gray-300">{new Date(alert.timestamp).toLocaleDateString()}</span>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    </div>
                );
            case 'ai_analysis':
                return (
                    <div className="grid grid-cols-1 gap-6">
                        {renderAIAnalysis}
                        {renderAuditLogs}
                    </div>
                );
            default:
                return null;
        }
    };

    // --- Tab Navigation ---
    const tabs: { id: typeof activeTab, label: string }[] = [
        { id: 'overview', label: 'Overview & Access' },
        { id: 'policies', label: 'Governance & Rules' },
        { id: 'keys', label: 'API & Contacts' },
        { id: 'ai_analysis', label: 'AI Threat Analysis' },
    ];

    return (
        <div className="space-y-8 p-4 sm:p-8">
            <header className="pb-4 border-b border-gray-700">
                <h1 className="text-4xl font-extrabold text-white tracking-tighter">Enterprise Security Command Center</h1>
                <p className="text-lg text-gray-400 mt-1">Centralized control plane for data integrity, access management, and threat mitigation. Engine Version: {AI_INSIGHT_ENGINE_VERSION}</p>
            </header>

            {/* Tab Navigation */}
            <div className="flex border-b border-gray-700 overflow-x-auto">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`px-6 py-3 text-lg font-semibold transition-all duration-300 whitespace-nowrap
                            ${activeTab === tab.id 
                                ? 'text-cyan-400 border-b-4 border-cyan-500' 
                                : 'text-gray-400 hover:text-white hover:border-b-4 hover:border-gray-600'
                            }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            <main>
                {renderContent()}
            </main>

            {notification && (
                <NotificationToast 
                    message={notification.message} 
                    type={notification.type} 
                    isVisible={notification.isVisible} 
                    onClose={closeNotification} 
                />
            )}
        </div>
    );
};

export default SecurityView;


================================================================================
// APPENDED FROM REPO: diplomat-bit/Citibank_Demo_Business_Inc_Demonstration- | ORIGINAL PATH: diplomat-bit-Citibank_Demo_Business_Inc_Demonstration--ab2501d/components/SecurityView.tsx
================================================================================

// components/SecurityView.tsx
// RE-ENACTED & EXPANDED: This component has been resurrected from its deprecated state.
// It is now the "AegisVault," the full-featured security and access control center
// for the user's financial kingdom. It provides transparent controls for data sharing,
// account security, and activity monitoring. It has evolved into a comprehensive
// security operations platform, incorporating advanced threat intelligence, privacy controls,
// device management, emergency protocols, and developer security features after
// a decade of expert upgrades and feature expansion, aiming to be the world's most robust personal
// financial security application.

import React, { useContext, useState } from 'react';
import { DataContext } from '../context/DataContext';
import Card from './Card';
import PlaidLinkButton from './PlaidLinkButton';

// ================================================================================================
// TYPE DEFINITIONS & MOCK DATA (EXPANDED)
// ================================================================================================

interface LoginActivity {
    id: string;
    device: string;
    location: string;
    ip: string;
    timestamp: string;
    isCurrent: boolean;
}

const MOCK_LOGIN_ACTIVITY: LoginActivity[] = [
    { id: '1', device: 'Chrome on macOS', location: 'New York, USA', ip: '192.168.1.1', timestamp: '2 minutes ago', isCurrent: true },
    { id: '2', device: 'DemoBank App on iOS', location: 'New York, USA', ip: '172.16.0.1', timestamp: '3 days ago', isCurrent: false },
    { id: '3', device: 'Chrome on Windows', location: 'Chicago, USA', ip: '10.0.0.1', timestamp: '1 week ago', isCurrent: false },
    { id: '4', device: 'Firefox on Linux', location: 'London, UK', ip: '88.201.54.123', timestamp: '2 weeks ago', isCurrent: false },
    { id: '5', device: 'DemoBank App on Android', location: 'Berlin, Germany', ip: '212.1.2.3', timestamp: '1 month ago', isCurrent: false },
];

// New Type Definitions
export interface Device {
    id: string;
    name: string;
    type: string;
    lastActivity: string;
    location: string;
    ip: string;
    isCurrent: boolean;
    permissions: string[];
    status: 'active' | 'locked' | 'revoked';
}

export interface DataSharingPolicy {
    id: string;
    partner: string;
    dataCategories: string[];
    purpose: string;
    active: boolean;
    lastUpdated: string;
}

export interface TransactionRule {
    id: string;
    name: string;
    type: 'spend_limit' | 'unusual_location' | 'large_withdrawal' | 'new_beneficiary';
    threshold?: number;
    currency?: string;
    location?: string;
    active: boolean;
}

export interface ThreatAlert {
    id: string;
    severity: 'critical' | 'high' | 'medium' | 'low';
    category: string;
    description: string;
    timestamp: string;
    status: 'new' | 'investigating' | 'resolved';
    actionableItems?: string[];
}

export interface AuditLogEntry {
    id: string;
    timestamp: string;
    action: string;
    user: string;
    details: string;
    ipAddress: string;
    level: 'info' | 'warning' | 'error';
}

export interface APIKey {
    id: string;
    name: string;
    keyPrefix: string;
    created: string;
    expires?: string;
    status: 'active' | 'revoked' | 'expired';
    permissions: string[];
}

export interface TrustedContact {
    id: string;
    name: string;
    email: string;
    phone?: string;
    relation: string;
    accessLevel: 'view_only' | 'limited_action' | 'full_control'; // for inheritance, not direct access
}

export interface SecurityAwarenessModule {
    id: string;
    title: string;
    description: string;
    completionStatus: 'not_started' | 'in_progress' | 'completed';
    lastAccessed: string;
    url: string;
}

// New Mock Data
const MOCK_DEVICES: Device[] = [
    { id: 'dev1', name: 'My MacBook Pro', type: 'Laptop', lastActivity: '2 minutes ago', location: 'New York, USA', ip: '192.168.1.1', isCurrent: true, permissions: ['Full Access'], status: 'active' },
    { id: 'dev2', name: 'iPhone 15 Pro', type: 'Mobile', lastActivity: '3 hours ago', location: 'New York, USA', ip: '172.16.0.1', isCurrent: false, permissions: ['Limited Access', 'Biometric Login'], status: 'active' },
    { id: 'dev3', name: 'iPad Air', type: 'Tablet', lastActivity: '1 day ago', location: 'Home Network', ip: '10.0.0.1', isCurrent: false, permissions: ['Read-Only'], status: 'active' },
    { id: 'dev4', name: 'Old Android Tablet', type: 'Tablet', lastActivity: '3 months ago', location: 'Boston, USA', ip: '68.12.34.56', isCurrent: false, permissions: ['Read-Only'], status: 'revoked' },
];

const MOCK_DATA_SHARING_POLICIES: DataSharingPolicy[] = [
    { id: 'ds1', partner: 'CreditScorePlus Inc.', dataCategories: ['Transaction History', 'Account Balances'], purpose: 'Credit Score Analysis', active: true, lastUpdated: '2023-10-26' },
    { id: 'ds2', partner: 'Financial Insights AI', dataCategories: ['Spending Habits (Anonymized)'], purpose: 'Personalized Budgeting Advice', active: true, lastUpdated: '2023-10-20' },
    { id: 'ds3', partner: 'Marketing Analytics Co.', dataCategories: ['Demographic Information'], purpose: 'Targeted Marketing', active: false, lastUpdated: '2023-09-15' },
    { id: 'ds4', partner: 'Research Institute for Economic Trends', dataCategories: ['Aggregated Spending Data (Anonymized)'], purpose: 'Economic Research', active: true, lastUpdated: '2024-01-01' },
];

const MOCK_TRANSACTION_RULES: TransactionRule[] = [
    { id: 'tr1', name: 'High Value Transaction Alert', type: 'large_withdrawal', threshold: 5000, currency: 'USD', active: true },
    { id: 'tr2', name: 'International Travel Alert', type: 'unusual_location', location: 'International', active: false },
    { id: 'tr3', name: 'Daily Spending Limit', type: 'spend_limit', threshold: 1000, currency: 'USD', active: true },
    { id: 'tr4', name: 'New Beneficiary Approval', type: 'new_beneficiary', active: true },
];

const MOCK_THREAT_ALERTS: ThreatAlert[] = [
    { id: 'ta1', severity: 'critical', category: 'Phishing Attempt', description: 'Suspicious login attempt from Nigeria detected.', timestamp: '2024-03-01T10:30:00Z', status: 'new', actionableItems: ['Change password', 'Review login activity', 'Contact support'] },
    { id: 'ta2', severity: 'high', category: 'Unusual Activity', description: 'Large transfer initiated to new beneficiary account.', timestamp: '2024-02-28T15:00:00Z', status: 'investigating', actionableItems: ['Verify transfer', 'Contact recipient', 'Lock account temporarily'] },
    { id: 'ta3', severity: 'medium', category: 'Software Vulnerability', description: 'Outdated browser detected on a linked device.', timestamp: '2024-02-27T08:00:00Z', status: 'resolved' },
    { id: 'ta4', severity: 'low', category: 'Security Recommendation', description: 'Consider enabling FIDO2 security key for primary login.', timestamp: '2024-02-25T09:00:00Z', status: 'new', actionableItems: ['Explore FIDO2 options'] },
];

const MOCK_AUDIT_LOGS: AuditLogEntry[] = [
    { id: 'al1', timestamp: '2024-03-01T10:35:00Z', action: 'Login Success', user: 'self', details: 'Successful login from current device.', ipAddress: '192.168.1.1', level: 'info' },
    { id: 'al2', timestamp: '2024-03-01T10:30:00Z', action: 'Login Attempt Failed', user: 'unknown', details: 'Incorrect password entered.', ipAddress: '41.203.X.X', level: 'warning' },
    { id: 'al3', timestamp: '2024-02-29T11:00:00Z', action: 'Data Sharing Policy Updated', user: 'self', details: 'Disabled sharing with Marketing Analytics Co.', ipAddress: '192.168.1.1', level: 'info' },
    { id: 'al4', timestamp: '2024-02-28T15:05:00Z', action: 'Transaction Rule Created', user: 'self', details: 'Added high value transaction alert ($5000).', ipAddress: '172.16.0.1', level: 'info' },
    { id: 'al5', timestamp: '2024-02-27T10:00:00Z', action: 'Device Access Revoked', user: 'self', details: 'Revoked access for Old Android Tablet.', ipAddress: '192.168.1.1', level: 'warning' },
];

const MOCK_API_KEYS: APIKey[] = [
    { id: 'api1', name: 'My Analytics Dashboard', keyPrefix: 'pk_live_abcd', created: '2023-08-01', status: 'active', permissions: ['Read Accounts', 'Read Transactions'] },
    { id: 'api2', name: 'Budgeting App Integration', keyPrefix: 'pk_test_efgh', created: '2023-11-10', expires: '2024-05-10', status: 'active', permissions: ['Read Accounts', 'Create Categories'] },
    { id: 'api3', name: 'Expired Test Key', keyPrefix: 'pk_test_ijkl', created: '2023-01-01', expires: '2023-02-01', status: 'expired', permissions: ['Read Accounts'] },
];

const MOCK_TRUSTED_CONTACTS: TrustedContact[] = [
    { id: 'tc1', name: 'Jane Doe', email: 'jane.doe@example.com', phone: '+1-555-123-4567', relation: 'Spouse', accessLevel: 'limited_action' },
    { id: 'tc2', name: 'John Smith', email: 'john.smith@example.com', phone: '+1-555-987-6543', relation: 'Family Member', accessLevel: 'view_only' },
];

const MOCK_SECURITY_AWARENESS_MODULES: SecurityAwarenessModule[] = [
    { id: 'sa1', title: 'Phishing & Social Engineering Protection', description: 'Learn to identify and avoid common phishing scams and social engineering tactics.', completionStatus: 'in_progress', lastAccessed: '2024-02-20', url: '/security-awareness/phishing' },
    { id: 'sa2', title: 'Strong Password Best Practices', description: 'Understand how to create and manage truly strong, unique passwords.', completionStatus: 'completed', lastAccessed: '2023-11-01', url: '/security-awareness/passwords' },
    { id: 'sa3', title: 'Understanding 2FA and MFA', description: 'A deep dive into multi-factor authentication and its importance.', completionStatus: 'not_started', lastAccessed: 'N/A', url: '/security-awareness/mfa' },
];

// ================================================================================================
// SUB-COMPONENTS (EXPANDED & NEW)
// ================================================================================================

/**
 * @description A reusable component for displaying a single security setting with a toggle.
 */
export const SecuritySettingToggle: React.FC<{
    title: string;
    description: string;
    defaultChecked: boolean;
    onToggle?: (checked: boolean) => void;
    disabled?: boolean;
}> = ({ title, description, defaultChecked, onToggle, disabled }) => (
    <li className="py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <div>
            <h4 className="font-semibold text-white">{title}</h4>
            <p className="text-sm text-gray-400 max-w-md mt-1">{description}</p>
        </div>
        <input
            type="checkbox"
            className="toggle toggle-cyan mt-2 sm:mt-0"
            defaultChecked={defaultChecked}
            onChange={(e) => onToggle && onToggle(e.target.checked)}
            disabled={disabled}
            aria-label={`Toggle for ${title}`}
        />
    </li>
);

/**
 * @description A modal for simulating a password change flow.
 */
export const ChangePasswordModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');

    const handleSubmit = () => {
        if (!currentPassword || !newPassword || !confirmNewPassword) {
            alert('All fields are required.');
            return;
        }
        if (newPassword !== confirmNewPassword) {
            alert('New password and confirmation do not match.');
            return;
        }
        if (newPassword.length < 8) {
            alert('New password must be at least 8 characters long.');
            return;
        }
        // Simulate API call
        alert('Password changed successfully. Please log in with your new password.');
        onClose();
        setCurrentPassword('');
        setNewPassword('');
        setConfirmNewPassword('');
    };

    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 backdrop-blur-sm" onClick={onClose}>
            <div className="bg-gray-800 rounded-lg shadow-2xl max-w-md w-full border border-gray-700" onClick={e => e.stopPropagation()}>
                <div className="p-4 border-b border-gray-700">
                    <h3 className="text-lg font-semibold text-white">Change Password</h3>
                </div>
                <div className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-300">Current Password</label>
                        <input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} className="mt-1 w-full bg-gray-700/50 border-gray-600 rounded-md p-2 text-white" />
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-300">New Password</label>
                        <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="mt-1 w-full bg-gray-700/50 border-gray-600 rounded-md p-2 text-white" />
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-300">Confirm New Password</label>
                        <input type="password" value={confirmNewPassword} onChange={(e) => setConfirmNewPassword(e.target.value)} className="mt-1 w-full bg-gray-700/50 border-gray-600 rounded-md p-2 text-white" />
                    </div>
                    <button onClick={handleSubmit} className="w-full py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg mt-2">
                        Update Password
                    </button>
                </div>
            </div>
        </div>
    );
};

// New Sub-Components (Exported)
/**
 * @description Card for managing authorized devices.
 */
export const DeviceManagementCard: React.FC = () => {
    const [devices, setDevices] = useState<Device[]>(MOCK_DEVICES);

    const handleRevokeDevice = (id: string) => {
        alert(`Device ${id} access revoked.`);
        setDevices(devices.map(d => d.id === id ? { ...d, status: 'revoked' } : d));
    };

    const handleRemoteLock = (id: string) => {
        alert(`Device ${id} remotely locked.`);
        setDevices(devices.map(d => d.id === id ? { ...d, status: 'locked' } : d));
    };

    return (
        <Card title="Authorized Devices & Sessions" titleTooltip="Manage all devices that have access to your account. Revoke access or initiate remote actions.">
            <p className="text-sm text-gray-400 mb-4">
                These devices have been used to access your account. Regularly review this list and revoke access for any unfamiliar, lost, or compromised devices.
            </p>
            <div className="space-y-3">
                {devices.length > 0 ? devices.map(device => (
                    <div key={device.id} className={`flex flex-col sm:flex-row justify-between items-start sm:items-center p-3 rounded-lg border ${device.isCurrent ? 'bg-cyan-900/10 border-cyan-700/60' : device.status === 'revoked' ? 'bg-red-900/10 border-red-800/60' : 'bg-gray-800/50 border-gray-700/60'}`}>
                        <div>
                            <h4 className="font-semibold text-white">{device.name} {device.isCurrent && <span className="text-xs text-cyan-300">(Current Session)</span>}</h4>
                            <p className="text-sm text-gray-400">{device.type} - {device.location} ({device.ip})</p>
                            <p className="text-xs text-gray-500">Last Active: {device.lastActivity} | Status: {device.status.charAt(0).toUpperCase() + device.status.slice(1)}</p>
                            <p className="text-xs text-gray-500">Permissions: {device.permissions.join(', ')}</p>
                        </div>
                        <div className="flex gap-2 mt-2 sm:mt-0">
                            {device.status === 'active' && !device.isCurrent && (
                                <button onClick={() => handleRemoteLock(device.id)} className="px-3 py-1 bg-yellow-600/50 hover:bg-yellow-600 text-white rounded-lg text-xs font-medium">
                                    Lock Device
                                </button>
                            )}
                            {device.status === 'active' && (
                                <button onClick={() => handleRevokeDevice(device.id)} className="px-3 py-1 bg-red-600/50 hover:bg-red-600 text-white rounded-lg text-xs font-medium">
                                    Revoke Access
                                </button>
                            )}
                            {device.status === 'revoked' && (
                                <span className="px-3 py-1 bg-gray-600/50 text-gray-300 rounded-lg text-xs font-medium">Access Revoked</span>
                            )}
                        </div>
                    </div>
                )) : (
                    <p className="text-center text-gray-500 py-4">No authorized devices found.</p>
                )}
            </div>
            <div className="mt-4 pt-4 border-t border-gray-700/60 text-sm text-gray-400">
                <p>Don't recognize a device or session? Revoke its access immediately and consider changing your password.</p>
            </div>
        </Card>
    );
};

/**
 * @description Modal for requesting data portability.
 */
export const DataPortabilityModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    const [status, setStatus] = useState<'idle' | 'processing' | 'completed'>('idle');

    const handleSubmitRequest = () => {
        setStatus('processing');
        setTimeout(() => {
            setStatus('completed');
            alert('Your data portability request has been submitted. You will receive an email with instructions shortly.');
            onClose();
            setStatus('idle'); // Reset for next time
        }, 3000);
    };

    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 backdrop-blur-sm" onClick={onClose}>
            <div className="bg-gray-800 rounded-lg shadow-2xl max-w-md w-full border border-gray-700" onClick={e => e.stopPropagation()}>
                <div className="p-4 border-b border-gray-700">
                    <h3 className="text-lg font-semibold text-white">Request Your Data</h3>
                </div>
                <div className="p-6 space-y-4">
                    <p className="text-gray-300 text-sm">
                        Confirm below to request a complete copy of your personal data, including transaction history,
                        account details, and profile information, in a structured, commonly used, and machine-readable format (e.g., JSON, CSV).
                        This data will be securely delivered to your registered email address within 30 days.
                    </p>
                    {status === 'processing' ? (
                        <p className="text-center text-cyan-400">Processing your request... Please wait.</p>
                    ) : (
                        <button onClick={handleSubmitRequest} className="w-full py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg mt-2">
                            Confirm Data Request
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

/**
 * @description Card for managing data privacy and sharing policies.
 */
export const DataPrivacyControlsCard: React.FC = () => {
    const [policies, setPolicies] = useState<DataSharingPolicy[]>(MOCK_DATA_SHARING_POLICIES);
    const [isDataPortabilityModalOpen, setIsDataPortabilityModalOpen] = useState(false);

    const handleTogglePolicy = (id: string) => {
        setPolicies(policies.map(p =>
            p.id === id ? { ...p, active: !p.active, lastUpdated: new Date().toISOString().slice(0, 10) } : p
        ));
    };

    return (
        <Card title="Data Privacy & Sharing" titleTooltip="Granular controls over how your data is shared with third-party partners and services.">
            <p className="text-sm text-gray-400 mb-4">
                You have full control over what data is shared with integrated services. Review and adjust your preferences below.
                We adhere to strict data protection regulations (e.g., GDPR, CCPA, CCPA, etc.).
            </p>
            <ul className="divide-y divide-gray-700/60 mb-6">
                {policies.map(policy => (
                    <li key={policy.id} className="py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center">
                        <div>
                            <h4 className="font-semibold text-white">{policy.partner}</h4>
                            <p className="text-sm text-gray-400 max-w-md mt-1">
                                Sharing: <span className="font-medium text-cyan-400">{policy.dataCategories.join(', ')}</span> for <span className="italic">{policy.purpose}</span>.
                            </p>
                            <p className="text-xs text-gray-500 mt-1">Last updated: {policy.lastUpdated}</p>
                        </div>
                        <input
                            type="checkbox"
                            className="toggle toggle-cyan mt-2 sm:mt-0"
                            checked={policy.active}
                            onChange={() => handleTogglePolicy(policy.id)}
                            aria-label={`Toggle data sharing for ${policy.partner}`}
                        />
                    </li>
                ))}
                <li className="py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center">
                    <div>
                        <h4 className="font-semibold text-white">Data Portability</h4>
                        <p className="text-sm text-gray-400 max-w-md mt-1">Request a copy of all your personal data in a machine-readable format.</p>
                    </div>
                    <button onClick={() => setIsDataPortabilityModalOpen(true)} className="mt-2 sm:mt-0 px-4 py-2 bg-gray-600/50 hover:bg-gray-600 text-white rounded-lg text-xs font-medium">
                        Request Data
                    </button>
                </li>
                 <SecuritySettingToggle
                    title="Anonymize Spending Data"
                    description="Automatically anonymize your spending habits before they are used for any internal or third-party analytical purposes."
                    defaultChecked={true}
                />
            </ul>
            <DataPortabilityModal isOpen={isDataPortabilityModalOpen} onClose={() => setIsDataPortabilityModalOpen(false)} />
        </Card>
    );
};

/**
 * @description Modal for adding a new transaction rule.
 */
export const AddTransactionRuleModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    onAddRule: (rule: Omit<TransactionRule, 'id'>) => void;
}> = ({ isOpen, onClose, onAddRule }) => {
    if (!isOpen) return null;

    const [name, setName] = useState('');
    const [type, setType] = useState<'spend_limit' | 'unusual_location' | 'large_withdrawal' | 'new_beneficiary'>('spend_limit');
    const [threshold, setThreshold] = useState('');
    const [location, setLocation] = useState('');

    const handleSubmit = () => {
        if (!name) {
            alert('Please provide a rule name.');
            return;
        }
        const newRule: Omit<TransactionRule, 'id'> = { name, type, active: true };
        if (type === 'spend_limit' || type === 'large_withdrawal') {
            newRule.threshold = parseFloat(threshold);
            newRule.currency = 'USD'; // Assuming USD for simplicity
        }
        if (type === 'unusual_location') {
            newRule.location = location;
        }
        onAddRule(newRule);
        onClose();
        // Reset form
        setName('');
        setType('spend_limit');
        setThreshold('');
        setLocation('');
    };

    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 backdrop-blur-sm" onClick={onClose}>
            <div className="bg-gray-800 rounded-lg shadow-2xl max-w-md w-full border border-gray-700" onClick={e => e.stopPropagation()}>
                <div className="p-4 border-b border-gray-700">
                    <h3 className="text-lg font-semibold text-white">Add New Transaction Rule</h3>
                </div>
                <div className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-300">Rule Name</label>
                        <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="mt-1 w-full bg-gray-700/50 border-gray-600 rounded-md p-2 text-white" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300">Rule Type</label>
                        <select value={type} onChange={(e) => setType(e.target.value as any)} className="mt-1 w-full bg-gray-700/50 border-gray-600 rounded-md p-2 text-white">
                            <option value="spend_limit">Daily/Weekly Spending Limit</option>
                            <option value="large_withdrawal">Large Withdrawal Alert</option>
                            <option value="unusual_location">Unusual Location Activity</option>
                            <option value="new_beneficiary">Require Approval for New Beneficiary</option>
                        </select>
                    </div>
                    {(type === 'spend_limit' || type === 'large_withdrawal') && (
                        <div>
                            <label className="block text-sm font-medium text-gray-300">Threshold Amount (USD)</label>
                            <input type="number" value={threshold} onChange={(e) => setThreshold(e.target.value)} className="mt-1 w-full bg-gray-700/50 border-gray-600 rounded-md p-2 text-white" />
                        </div>
                    )}
                    {type === 'unusual_location' && (
                        <div>
                            <label className="block text-sm font-medium text-gray-300">Specific Location (e.g., 'International')</label>
                            <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} className="mt-1 w-full bg-gray-700/50 border-gray-600 rounded-md p-2 text-white" />
                        </div>
                    )}
                    <button onClick={handleSubmit} className="w-full py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg mt-2">
                        Create Rule
                    </button>
                </div>
            </div>
        </div>
    );
};

/**
 * @description Card for managing transaction monitoring rules.
 */
export const TransactionMonitoringCard: React.FC = () => {
    const [rules, setRules] = useState<TransactionRule[]>(MOCK_TRANSACTION_RULES);
    const [isAddRuleModalOpen, setIsAddRuleModalOpen] = useState(false);

    const handleToggleRule = (id: string) => {
        setRules(rules.map(r => r.id === id ? { ...r, active: !r.active } : r));
    };

    const handleAddRule = (newRule: Omit<TransactionRule, 'id'>) => {
        const id = `tr${rules.length + 1}`;
        setRules([...rules, { id, ...newRule }]);
        setIsAddRuleModalOpen(false);
    };

    const handleDeleteRule = (id: string) => {
        if (window.confirm("Are you sure you want to delete this rule?")) {
            setRules(rules.filter(r => r.id !== id));
        }
    };

    return (
        <Card title="Transaction Monitoring & Alerts" titleTooltip="Set up custom rules to monitor your transactions and receive alerts for suspicious or high-value activities.">
            <p className="text-sm text-gray-400 mb-4">
                Proactively secure your finances by defining rules for transactions. Get notified about unusual spending, large withdrawals, or activity in specific locations.
            </p>
            <ul className="divide-y divide-gray-700/60 mb-6">
                {rules.length > 0 ? rules.map(rule => (
                    <li key={rule.id} className="py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center">
                        <div>
                            <h4 className="font-semibold text-white">{rule.name}</h4>
                            <p className="text-sm text-gray-400 max-w-md mt-1">
                                Type: {rule.type.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                                {rule.threshold && ` | Threshold: ${rule.currency || '$'}{rule.threshold.toLocaleString()}`}
                                {rule.location && ` | Location: ${rule.location}`}
                            </p>
                        </div>
                        <div className="flex gap-2 mt-2 sm:mt-0 items-center">
                            <input
                                type="checkbox"
                                className="toggle toggle-cyan"
                                checked={rule.active}
                                onChange={() => handleToggleRule(rule.id)}
                                aria-label={`Toggle rule for ${rule.name}`}
                            />
                            <button onClick={() => handleDeleteRule(rule.id)} className="px-3 py-1 bg-red-600/50 hover:bg-red-600 text-white rounded-lg text-xs font-medium">
                                Delete
                            </button>
                        </div>
                    </li>
                )) : (
                    <p className="text-center text-gray-500 py-4">No custom transaction rules defined yet.</p>
                )}
            </ul>
            <button onClick={() => setIsAddRuleModalOpen(true)} className="w-full py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg text-sm font-medium">
                Add New Transaction Rule
            </button>
            <AddTransactionRuleModal isOpen={isAddRuleModalOpen} onClose={() => setIsAddRuleModalOpen(false)} onAddRule={handleAddRule} />
        </Card>
    );
};

/**
 * @description Card for displaying threat intelligence and alerts.
 */
export const ThreatAlertsCard: React.FC = () => {
    const [alerts, setAlerts] = useState<ThreatAlert[]>(MOCK_THREAT_ALERTS);

    const handleResolveAlert = (id: string) => {
        setAlerts(alerts.map(a => a.id === id ? { ...a, status: 'resolved' } : a));
        alert(`Alert ${id} marked as resolved.`);
    };

    const getSeverityClass = (severity: 'critical' | 'high' | 'medium' | 'low') => {
        switch (severity) {
            case 'critical': return 'text-red-500 bg-red-900/20 border-red-800';
            case 'high': return 'text-orange-500 bg-orange-900/20 border-orange-800';
            case 'medium': return 'text-yellow-500 bg-yellow-900/20 border-yellow-800';
            case 'low': return 'text-gray-500 bg-gray-900/20 border-gray-800';
            default: return 'text-gray-400 bg-gray-800/20 border-gray-700';
        }
    };

    return (
        <Card title="Threat Intelligence & Alerts" titleTooltip="View real-time security alerts and recommendations from our advanced threat detection systems.">
            <p className="text-sm text-gray-400 mb-4">
                Our advanced Aegis AI continuously monitors for potential threats to your account, including phishing attempts, unusual login patterns, and detected vulnerabilities.
            </p>
            <div className="space-y-4">
                {alerts.length > 0 ? alerts.map(alert => (
                    <div key={alert.id} className={`p-4 rounded-lg border flex flex-col sm:flex-row justify-between items-start sm:items-center ${getSeverityClass(alert.severity)}`}>
                        <div>
                            <h4 className="font-semibold text-white flex items-center gap-2">
                                <span className={`px-2 py-0.5 rounded-full text-xs font-bold uppercase ${getSeverityClass(alert.severity)} bg-opacity-50`}>
                                    {alert.severity}
                                </span>
                                {alert.category}
                            </h4>
                            <p className="text-sm text-gray-300 mt-1 max-w-md">{alert.description}</p>
                            <p className="text-xs text-gray-400 mt-1">Detected: {new Date(alert.timestamp).toLocaleString()}</p>
                            {alert.actionableItems && alert.actionableItems.length > 0 && (
                                <p className="text-xs text-gray-300 mt-2">
                                    <span className="font-semibold">Suggested Actions:</span> {alert.actionableItems.join(', ')}.
                                </p>
                            )}
                        </div>
                        <div className="mt-2 sm:mt-0 flex gap-2">
                            {alert.status !== 'resolved' ? (
                                <button onClick={() => handleResolveAlert(alert.id)} className="px-3 py-1 bg-green-600/50 hover:bg-green-600 text-white rounded-lg text-xs font-medium">
                                    Mark as Resolved
                                </button>
                            ) : (
                                <span className="px-3 py-1 bg-gray-600/50 text-gray-300 rounded-lg text-xs font-medium">Resolved</span>
                            )}
                            <button className="px-3 py-1 bg-blue-600/50 hover:bg-blue-600 text-white rounded-lg text-xs font-medium">
                                View Details
                            </button>
                        </div>
                    </div>
                )) : (
                    <p className="text-center text-gray-500 py-4">No active threat alerts at this time. Stay vigilant!</p>
                )}
            </div>
            <div className="mt-6 pt-4 border-t border-gray-700/60 text-sm text-gray-400">
                <p>For critical alerts, immediate action is recommended. Contact support if you need assistance.</p>
            </div>
        </Card>
    );
};

/**
 * @description Card for viewing comprehensive audit logs.
 */
export const AuditLogViewerCard: React.FC = () => {
    const [logs, setLogs] = useState<AuditLogEntry[]>(MOCK_AUDIT_LOGS);
    const [filter, setFilter] = useState('');
    const [levelFilter, setLevelFilter] = useState<'all' | 'info' | 'warning' | 'error'>('all');

    const filteredLogs = logs.filter(log =>
        (levelFilter === 'all' || log.level === levelFilter) &&
        (log.action.toLowerCase().includes(filter.toLowerCase()) ||
        log.details.toLowerCase().includes(filter.toLowerCase()) ||
        log.ipAddress.toLowerCase().includes(filter.toLowerCase()) ||
        log.user.toLowerCase().includes(filter.toLowerCase()))
    );

    const getLevelClass = (level: 'info' | 'warning' | 'error') => {
        switch (level) {
            case 'info': return 'text-blue-400';
            case 'warning': return 'text-yellow-400';
            case 'error': return 'text-red-400';
        }
    };

    return (
        <Card title="Comprehensive Audit Logs" titleTooltip="Detailed record of all security-related activities on your account.">
            <p className="text-sm text-gray-400 mb-4">
                A complete history of logins, setting changes, data access, and other sensitive actions, providing full transparency and accountability.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mb-4">
                <input
                    type="text"
                    placeholder="Filter logs by keyword"
                    className="flex-grow bg-gray-700/50 border-gray-600 rounded-md p-2 text-white text-sm"
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                />
                <select
                    value={levelFilter}
                    onChange={(e) => setLevelFilter(e.target.value as any)}
                    className="w-full sm:w-auto bg-gray-700/50 border-gray-600 rounded-md p-2 text-white text-sm"
                >
                    <option value="all">All Levels</option>
                    <option value="info">Info</option>
                    <option value="warning">Warning</option>
                    <option value="error">Error</option>
                </select>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-400">
                    <thead className="text-xs text-gray-300 uppercase bg-gray-900/30">
                        <tr>
                            <th className="px-4 py-2">Timestamp</th>
                            <th className="px-4 py-2">Level</th>
                            <th className="px-4 py-2">Action</th>
                            <th className="px-4 py-2">User</th>
                            <th className="px-4 py-2">Details</th>
                            <th className="px-4 py-2">IP Address</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredLogs.length > 0 ? filteredLogs.map(log => (
                            <tr key={log.id} className="border-b border-gray-800 hover:bg-gray-800/50">
                                <td className="px-4 py-3 whitespace-nowrap">{new Date(log.timestamp).toLocaleString()}</td>
                                <td className={`px-4 py-3 ${getLevelClass(log.level)}`}>{log.level.toUpperCase()}</td>
                                <td className="px-4 py-3 font-medium text-white">{log.action}</td>
                                <td className="px-4 py-3">{log.user}</td>
                                <td className="px-4 py-3">{log.details}</td>
                                <td className="px-4 py-3">{log.ipAddress}</td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan={6} className="text-center text-gray-500 py-4">No audit logs matching your filter.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            <div className="mt-6 pt-4 border-t border-gray-700/60 text-sm text-gray-400 flex justify-between items-center">
                <button className="px-4 py-2 bg-blue-600/50 hover:bg-blue-600 text-white rounded-lg text-xs font-medium">
                    Export Logs (CSV)
                </button>
                <span className="text-gray-500">Logs retained for 7 years as per compliance policies.</span>
            </div>
        </Card>
    );
};

/**
 * @description Card for displaying security posture and recommendations.
 */
export const SecurityPostureCard: React.FC = () => {
    const securityScore = 85; // Example score, dynamically calculated in real app
    const recommendations = [
        "Enable Biometric Login on all devices for quicker access.",
        "Review Data Sharing Policies and disable unnecessary ones.",
        "Set up a high-value transaction alert for transfers over $10,000.",
        "Consider using a FIDO2 security key for advanced 2FA to prevent phishing.",
        "Complete the 'Phishing & Social Engineering Protection' awareness module.",
        "Regularly review your linked accounts and unlink any inactive ones.",
    ];

    return (
        <Card title="Security Posture & Recommendations" titleTooltip="An intelligent assessment of your current security configuration with personalized recommendations.">
            <p className="text-sm text-gray-400 mb-4">
                Our Aegis AI continuously analyzes your security settings and behavior to provide a personalized security score and actionable recommendations to enhance your protection.
            </p>
            <div className="flex items-center gap-4 mb-6">
                <div className="radial-progress text-cyan-500" style={{ "--value": securityScore, "--size": "5rem", "--thickness": "5px" } as React.CSSProperties} role="progressbar" aria-valuenow={securityScore} aria-label="Security Score">
                    <span className="text-xl font-bold text-white">{securityScore}%</span>
                </div>
                <div>
                    <h4 className="font-semibold text-white text-lg">Your Current Security Score: <span className="text-cyan-400">{securityScore}%</span></h4>
                    <p className="text-sm text-gray-400">Excellent! You have strong security practices. Keep it up!</p>
                </div>
            </div>
            <h4 className="font-semibold text-white mb-2">Personalized Recommendations:</h4>
            <ul className="list-disc list-inside space-y-2 text-sm text-gray-300">
                {recommendations.map((rec, index) => (
                    <li key={index} className="flex items-start">
                        <span className="mr-2 text-cyan-400 text-lg">▪</span> {rec}
                    </li>
                ))}
            </ul>
            <div className="mt-6 pt-4 border-t border-gray-700/60 text-sm text-gray-400">
                <p>Implement these recommendations to achieve the highest level of security.</p>
            </div>
        </Card>
    );
};

/**
 * @description Modal for managing FIDO2 security keys.
 */
export const FidoSecurityKeyModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    const [keys, setKeys] = useState<{ id: string; name: string; added: string }[]>([
        { id: 'key1', name: 'My YubiKey 5C NFC', added: '2023-01-15' },
    ]);
    const [newKeyName, setNewKeyName] = useState('');

    const handleRegisterKey = () => {
        if (!newKeyName) {
            alert('Please enter a name for the security key.');
            return;
        }
        alert(`Simulating registration for key: "${newKeyName}". Please connect and touch your security key.`);
        setTimeout(() => {
            const newId = `key${keys.length + 1}`;
            setKeys([...keys, { id: newId, name: newKeyName, added: new Date().toISOString().slice(0, 10) }]);
            setNewKeyName('');
            alert('Security key registered successfully!');
        }, 2000);
    };

    const handleRemoveKey = (id: string) => {
        if (window.confirm('Are you sure you want to remove this security key? You will no longer be able to use it for login.')) {
            setKeys(keys.filter(k => k.id !== id));
            alert('Security key removed.');
        }
    };

    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 backdrop-blur-sm" onClick={onClose}>
            <div className="bg-gray-800 rounded-lg shadow-2xl max-w-md w-full border border-gray-700" onClick={e => e.stopPropagation()}>
                <div className="p-4 border-b border-gray-700">
                    <h3 className="text-lg font-semibold text-white">Manage FIDO2 Security Keys</h3>
                </div>
                <div className="p-6 space-y-6">
                    <p className="text-gray-300 text-sm">
                        Physical security keys offer the highest level of protection against phishing and account takeover.
                        Register your FIDO2/WebAuthn compatible keys here for unphishable multi-factor authentication.
                    </p>

                    <div>
                        <h4 className="font-semibold text-white mb-2">Registered Keys:</h4>
                        {keys.length > 0 ? (
                            <ul className="space-y-2">
                                {keys.map(key => (
                                    <li key={key.id} className="flex justify-between items-center p-2 bg-gray-700/50 rounded-md">
                                        <span className="text-gray-200">{key.name} <span className="text-xs text-gray-400"> (Added: {key.added})</span></span>
                                        <button onClick={() => handleRemoveKey(key.id)} className="px-3 py-1 bg-red-600/50 hover:bg-red-600 text-white rounded-lg text-xs font-medium">
                                            Remove
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-gray-500 text-center">No security keys registered yet.</p>
                        )}
                    </div>

                    <div className="border-t border-gray-700 pt-4">
                        <h4 className="font-semibold text-white mb-2">Register New Key:</h4>
                        <label className="block text-sm font-medium text-gray-300">Key Name (e.g., "Work YubiKey")</label>
                        <input type="text" value={newKeyName} onChange={(e) => setNewKeyName(e.target.value)} className="mt-1 w-full bg-gray-700/50 border-gray-600 rounded-md p-2 text-white" />
                        <button onClick={handleRegisterKey} className="w-full py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg mt-4">
                            Start Registration
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

/**
 * @description Card for advanced authentication options.
 */
export const AdvancedAuthenticationCard: React.FC = () => {
    const [isFidoModalOpen, setIsFidoModalOpen] = useState(false);
    return (
        <Card title="Advanced Authentication Options" titleTooltip="Explore next-generation authentication methods for superior security and convenience.">
            <ul className="divide-y divide-gray-700/60">
                <SecuritySettingToggle
                    title="Adaptive Authentication"
                    description="Our system intelligently assesses login attempts based on location, device, and behavior. Unusual activity may trigger additional verification steps."
                    defaultChecked={true}
                />
                <SecuritySettingToggle
                    title="Geo-fencing for Transactions"
                    description="Restrict transactions to specific geographical regions or block international transactions to prevent fraud. Set your trusted zones."
                    defaultChecked={false}
                />
                <li className="py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center">
                    <div>
                        <h4 className="font-semibold text-white">FIDO2 / WebAuthn Security Keys</h4>
                        <p className="text-sm text-gray-400 max-w-md mt-1">
                            Use a physical security key (like YubiKey) for unphishable, hardware-backed two-factor authentication.
                        </p>
                    </div>
                    <button onClick={() => setIsFidoModalOpen(true)} className="mt-2 sm:mt-0 px-4 py-2 bg-cyan-600/50 hover:bg-cyan-600 text-white rounded-lg text-xs font-medium">
                        Manage Keys
                    </button>
                </li>
                <SecuritySettingToggle
                    title="Login IP Whitelisting"
                    description="Restrict account access to a predefined list of trusted IP addresses for maximum control (advanced users). Requires careful configuration."
                    defaultChecked={false}
                />
                 <SecuritySettingToggle
                    title="Time-Based One-Time Passwords (TOTP)"
                    description="Generate 6-digit codes using an authenticator app (e.g., Google Authenticator, Authy) as an alternative to SMS 2FA."
                    defaultChecked={true} // Assuming most users would have this
                />
            </ul>
            <FidoSecurityKeyModal isOpen={isFidoModalOpen} onClose={() => setIsFidoModalOpen(false)} />
        </Card>
    );
};

/**
 * @description Modal for emergency account lock.
 */
export const LockAccountModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    const handleConfirmLock = () => {
        alert('Emergency account locked successfully! You will be logged out and require re-verification to regain access. Contact support for assistance.');
        onClose();
        // Simulate actual logout and account state change
        // window.location.href = '/logout';
    };

    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 backdrop-blur-sm" onClick={onClose}>
            <div className="bg-gray-800 rounded-lg shadow-2xl max-w-md w-full border border-gray-700" onClick={e => e.stopPropagation()}>
                <div className="p-4 border-b border-gray-700 bg-red-900/20">
                    <h3 className="text-lg font-semibold text-red-400">Emergency Account Lock Confirmation</h3>
                </div>
                <div className="p-6 space-y-4">
                    <p className="text-red-300 text-sm">
                        Activating the emergency account lock will immediately:
                        <ul className="list-disc list-inside mt-2 ml-4">
                            <li>Freeze all outgoing transactions and payments.</li>
                            <li>Log out all active sessions on all devices.</li>
                            <li>Require advanced identity verification to unlock your account.</li>
                            <li>Notify your trusted emergency contacts (if configured).</li>
                        </ul>
                    </p>
                    <p className="text-red-300 font-bold mt-4">
                        Only proceed if you strongly suspect your account is compromised or unauthorized activity is occurring.
                    </p>
                    <button onClick={handleConfirmLock} className="w-full py-2 bg-red-700 hover:bg-red-800 text-white rounded-lg mt-2">
                        Confirm & Lock Account
                    </button>
                    <button onClick={onClose} className="w-full py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg mt-2">
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

/**
 * @description Modal for configuring Dead Man's Switch (Inheritance Planning).
 */
export const DeadManSwitchModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    const [beneficiaries, setBeneficiaries] = useState<TrustedContact[]>(MOCK_TRUSTED_CONTACTS);
    const [inactivityPeriod, setInactivityPeriod] = useState('90'); // days
    const [newBeneficiary, setNewBeneficiary] = useState<Omit<TrustedContact, 'id'>>({ name: '', email: '', relation: '', accessLevel: 'view_only' });

    const handleAddBeneficiary = () => {
        if (!newBeneficiary.name || !newBeneficiary.email) {
            alert('Name and email are required for a beneficiary.');
            return;
        }
        setBeneficiaries([...beneficiaries, { id: `ben${beneficiaries.length + 1}`, ...newBeneficiary }]);
        setNewBeneficiary({ name: '', email: '', relation: '', accessLevel: 'view_only' });
    };

    const handleRemoveBeneficiary = (id: string) => {
        setBeneficiaries(beneficiaries.filter(b => b.id !== id));
    };

    const handleSaveSettings = () => {
        alert('Dead Man\'s Switch settings saved successfully!');
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 backdrop-blur-sm" onClick={onClose}>
            <div className="bg-gray-800 rounded-lg shadow-2xl max-w-lg w-full border border-gray-700" onClick={e => e.stopPropagation()}>
                <div className="p-4 border-b border-gray-700">
                    <h3 className="text-lg font-semibold text-white">Dead Man's Switch (Inheritance)</h3>
                </div>
                <div className="p-6 space-y-6">
                    <p className="text-gray-300 text-sm">
                        This feature allows you to designate trusted individuals who will be granted limited access
                        or instructions to your financial assets if your account remains inactive for a specified period.
                        This ensures your legacy is protected and managed according to your wishes.
                    </p>

                    <div>
                        <h4 className="font-semibold text-white mb-2">Inactivity Period:</h4>
                        <p className="text-sm text-gray-300 mb-2">After how many days of no login or activity should the protocol activate?</p>
                        <select value={inactivityPeriod} onChange={(e) => setInactivityPeriod(e.target.value)} className="w-full bg-gray-700/50 border-gray-600 rounded-md p-2 text-white">
                            <option value="30">30 Days</option>
                            <option value="60">60 Days</option>
                            <option value="90">90 Days (Recommended)</option>
                            <option value="180">180 Days</option>
                            <option value="365">365 Days</option>
                        </select>
                    </div>

                    <div>
                        <h4 className="font-semibold text-white mb-2">Designated Beneficiaries:</h4>
                        {beneficiaries.length > 0 ? (
                            <ul className="space-y-2 mb-4">
                                {beneficiaries.map(ben => (
                                    <li key={ben.id} className="flex justify-between items-center p-2 bg-gray-700/50 rounded-md">
                                        <div>
                                            <span className="text-gray-200 font-medium">{ben.name}</span>
                                            <p className="text-xs text-gray-400">{ben.email} ({ben.relation}, Access: {ben.accessLevel.replace('_', ' ')})</p>
                                        </div>
                                        <button onClick={() => handleRemoveBeneficiary(ben.id)} className="px-3 py-1 bg-red-600/50 hover:bg-red-600 text-white rounded-lg text-xs font-medium">
                                            Remove
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-gray-500 text-center mb-4">No beneficiaries added yet.</p>
                        )}

                        <div className="bg-gray-700/30 p-4 rounded-md space-y-3">
                            <h5 className="font-semibold text-white">Add New Beneficiary:</h5>
                            <div>
                                <label className="block text-xs font-medium text-gray-300">Name</label>
                                <input type="text" value={newBeneficiary.name} onChange={(e) => setNewBeneficiary({ ...newBeneficiary, name: e.target.value })} className="mt-1 w-full bg-gray-700/50 border-gray-600 rounded-md p-2 text-white text-sm" />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-300">Email</label>
                                <input type="email" value={newBeneficiary.email} onChange={(e) => setNewBeneficiary({ ...newBeneficiary, email: e.target.value })} className="mt-1 w-full bg-gray-700/50 border-gray-600 rounded-md p-2 text-white text-sm" />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-300">Relation (Optional)</label>
                                <input type="text" value={newBeneficiary.relation} onChange={(e) => setNewBeneficiary({ ...newBeneficiary, relation: e.target.value })} className="mt-1 w-full bg-gray-700/50 border-gray-600 rounded-md p-2 text-white text-sm" />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-300">Access Level</label>
                                <select value={newBeneficiary.accessLevel} onChange={(e) => setNewBeneficiary({ ...newBeneficiary, accessLevel: e.target.value as TrustedContact['accessLevel'] })} className="mt-1 w-full bg-gray-700/50 border-gray-600 rounded-md p-2 text-white text-sm">
                                    <option value="view_only">View Only (Recommended)</option>
                                    <option value="limited_action">Limited Actions (e.g., Pay Bills)</option>
                                    <option value="full_control">Full Control (Use with extreme caution)</option>
                                </select>
                            </div>
                            <button onClick={handleAddBeneficiary} className="w-full py-2 bg-blue-600/50 hover:bg-blue-600 text-white rounded-lg text-sm font-medium">
                                Add Beneficiary
                            </button>
                        </div>
                    </div>

                    <button onClick={handleSaveSettings} className="w-full py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg mt-4">
                        Save Dead Man's Switch Settings
                    </button>
                </div>
            </div>
        </div>
    );
};

/**
 * @description Card for emergency protocols and recovery.
 */
export const EmergencyActionsCard: React.FC = () => {
    const [isLockAccountModalOpen, setIsLockAccountModalOpen] = useState(false);
    const [isDeadManSwitchModalOpen, setIsDeadManSwitchModalOpen] = useState(false);

    return (
        <Card title="Emergency Protocols & Recovery" titleTooltip="Critical tools for protecting your assets in emergencies or for planning future access.">
            <p className="text-sm text-gray-400 mb-4">
                Prepare for the unexpected. These features allow you to quickly respond to security incidents or securely plan for asset transfer and recovery.
            </p>
            <ul className="divide-y divide-gray-700/60">
                <li className="py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center">
                    <div>
                        <h4 className="font-semibold text-white">Emergency Account Lock</h4>
                        <p className="text-sm text-red-400 max-w-md mt-1">
                            Immediately freeze all account activity, block transactions, and restrict logins if you suspect a breach or unauthorized access. This requires re-verification to unlock.
                        </p>
                    </div>
                    <button onClick={() => setIsLockAccountModalOpen(true)} className="mt-2 sm:mt-0 px-4 py-2 bg-red-700/50 hover:bg-red-700 text-white rounded-lg text-xs font-medium">
                        Activate Lock
                    </button>
                </li>
                <li className="py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center">
                    <div>
                        <h4 className="font-semibold text-white">Dead Man's Switch (Inheritance Planning)</h4>
                        <p className="text-sm text-gray-400 max-w-md mt-1">
                            Automate the secure transfer of your financial assets and account access to trusted beneficiaries if your account becomes inactive for a prolonged period.
                        </p>
                    </div>
                    <button onClick={() => setIsDeadManSwitchModalOpen(true)} className="mt-2 sm:mt-0 px-4 py-2 bg-gray-600/50 hover:bg-gray-600 text-white rounded-lg text-xs font-medium">
                        Configure
                    </button>
                </li>
                <li className="py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center">
                    <div>
                        <h4 className="font-semibold text-white">Secure Encrypted Backups</h4>
                        <p className="text-sm text-gray-400 max-w-md mt-1">
                            Manage and download encrypted backups of your essential account data, recovery keys, and personalized security settings.
                        </p>
                    </div>
                    <button className="mt-2 sm:mt-0 px-4 py-2 bg-gray-600/50 hover:bg-gray-600 text-white rounded-lg text-xs font-medium">
                        Manage Backups
                    </button>
                </li>
                <li className="py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center">
                    <div>
                        <h4 className="font-semibold text-white">Identity Theft Protection Resources</h4>
                        <p className="text-sm text-gray-400 max-w-md mt-1">
                            Access guides and resources on what to do if you suspect identity theft or a data breach involving your personal information.
                        </p>
                    </div>
                    <a href="/identity-theft-resources" target="_blank" rel="noopener noreferrer" className="mt-2 sm:mt-0 px-4 py-2 bg-blue-600/50 hover:bg-blue-600 text-white rounded-lg text-xs font-medium">
                        View Resources
                    </a>
                </li>
            </ul>
            <LockAccountModal isOpen={isLockAccountModalOpen} onClose={() => setIsLockAccountModalOpen(false)} />
            <DeadManSwitchModal isOpen={isDeadManSwitchModalOpen} onClose={() => setIsDeadManSwitchModalOpen(false)} />
        </Card>
    );
};

/**
 * @description Modal for creating a new API key.
 */
export const CreateAPIKeyModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    onCreateKey: (newKeyData: Omit<APIKey, 'id' | 'keyPrefix' | 'created' | 'status'>) => void;
}> = ({ isOpen, onClose, onCreateKey }) => {
    if (!isOpen) return null;

    const [name, setName] = useState('');
    const [permissions, setPermissions] = useState<string[]>([]);
    const [expires, setExpires] = useState('');

    const availablePermissions = ['Read Accounts', 'Read Transactions', 'Create Categories', 'Manage Webhooks', 'Full Access', 'Manage Beneficiaries'];

    const handleTogglePermission = (permission: string) => {
        setPermissions(prev =>
            prev.includes(permission)
                ? prev.filter(p => p !== permission)
                : [...prev, permission]
        );
    };

    const handleSubmit = () => {
        if (!name || permissions.length === 0) {
            alert('Please provide a name and select at least one permission.');
            return;
        }
        onCreateKey({
            name,
            permissions,
            expires: expires || undefined,
        });
        // Reset form
        setName('');
        setPermissions([]);
        setExpires('');
    };

    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 backdrop-blur-sm" onClick={onClose}>
            <div className="bg-gray-800 rounded-lg shadow-2xl max-w-md w-full border border-gray-700" onClick={e => e.stopPropagation()}>
                <div className="p-4 border-b border-gray-700">
                    <h3 className="text-lg font-semibold text-white">Generate New API Key</h3>
                </div>
                <div className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-300">Key Name</label>
                        <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="mt-1 w-full bg-gray-700/50 border-gray-600 rounded-md p-2 text-white" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300">Permissions</label>
                        <div className="mt-2 space-y-2 max-h-40 overflow-y-auto pr-2 custom-scrollbar">
                            {availablePermissions.map(perm => (
                                <div key={perm} className="flex items-center">
                                    <input
                                        type="checkbox"
                                        id={`perm-${perm}`}
                                        checked={permissions.includes(perm)}
                                        onChange={() => handleTogglePermission(perm)}
                                        className="checkbox checkbox-cyan"
                                    />
                                    <label htmlFor={`perm-${perm}`} className="ml-2 text-sm text-gray-300">{perm}</label>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300">Expiration Date (Optional)</label>
                        <input type="date" value={expires} onChange={(e) => setExpires(e.target.value)} className="mt-1 w-full bg-gray-700/50 border-gray-600 rounded-md p-2 text-white" />
                    </div>
                    <button onClick={handleSubmit} className="w-full py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg mt-2">
                        Generate Key
                    </button>
                </div>
            </div>
        </div>
    );
};

/**
 * @description Card for managing API keys.
 */
export const APIKeyManagementCard: React.FC = () => {
    const [apiKeys, setApiKeys] = useState<APIKey[]>(MOCK_API_KEYS);
    const [isCreateAPIKeyModalOpen, setIsCreateAPIKeyModalOpen] = useState(false);

    const handleRevokeKey = (id: string) => {
        if (window.confirm("Are you sure you want to revoke this API key? This action cannot be undone.")) {
            setApiKeys(apiKeys.map(key => key.id === id ? { ...key, status: 'revoked' } : key));
            alert('API Key revoked.');
        }
    };

    const handleCreateKey = (newKeyData: Omit<APIKey, 'id' | 'keyPrefix' | 'created' | 'status'>) => {
        const newId = `api${apiKeys.length + 1}`;
        const newKeyPrefix = `pk_${Math.random().toString(36).substring(2, 6)}`;
        const created = new Date().toISOString().slice(0, 10);
        const newKey: APIKey = {
            id: newId,
            keyPrefix: newKeyPrefix,
            created,
            status: 'active',
            ...newKeyData,
        };
        setApiKeys([...apiKeys, newKey]);
        alert(`New API Key generated: ${newKeyPrefix}**************** Please copy it now, it will not be shown again.`);
        setIsCreateAPIKeyModalOpen(false);
    };

    return (
        <Card title="API Key Management & Webhooks" titleTooltip="Generate and manage API keys for integrating with custom applications and developer tools.">
            <p className="text-sm text-gray-400 mb-4">
                For developers and advanced users, manage API keys to programmatically access your account data (with explicit permissions).
                Handle these keys with extreme care, as they grant powerful access to your financial information. You can also configure secure webhook endpoints.
            </p>
            <div className="space-y-3 mb-6">
                {apiKeys.length > 0 ? apiKeys.map(key => (
                    <div key={key.id} className={`flex flex-col sm:flex-row justify-between items-start sm:items-center p-3 rounded-lg border ${key.status === 'active' ? 'bg-gray-800/50 border-gray-700/60' : 'bg-red-900/10 border-red-800/60 opacity-70'}`}>
                        <div>
                            <h4 className="font-semibold text-white">{key.name}</h4>
                            <p className="text-sm text-gray-400">Key: {key.keyPrefix}**************** ({key.status})</p>
                            <p className="text-xs text-gray-500">Created: {key.created} {key.expires && `| Expires: ${key.expires}`}</p>
                            <p className="text-xs text-gray-500">Permissions: {key.permissions.join(', ')}</p>
                        </div>
                        <div className="flex gap-2 mt-2 sm:mt-0">
                            {key.status === 'active' && (
                                <button onClick={() => handleRevokeKey(key.id)} className="px-3 py-1 bg-red-600/50 hover:bg-red-600 text-white rounded-lg text-xs font-medium">
                                    Revoke
                                </button>
                            )}
                            <button className="px-3 py-1 bg-gray-600/50 hover:bg-gray-600 text-white rounded-lg text-xs font-medium">
                                View Logs
                            </button>
                        </div>
                    </div>
                )) : (
                    <p className="text-center text-gray-500 py-4">No API keys generated yet.</p>
                )}
            </div>
            <button onClick={() => setIsCreateAPIKeyModalOpen(true)} className="w-full py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg text-sm font-medium">
                Generate New API Key
            </button>
            <div className="mt-6 pt-4 border-t border-gray-700/60 text-sm text-gray-400">
                <h4 className="font-semibold text-white mb-2">Webhook Management:</h4>
                <p>Configure secure webhook endpoints to receive real-time notifications about account activities directly to your applications.</p>
                <button className="mt-3 px-4 py-2 bg-gray-600/50 hover:bg-gray-600 text-white rounded-lg text-xs font-medium">
                    Manage Webhooks
                </button>
            </div>
            <CreateAPIKeyModal isOpen={isCreateAPIKeyModalOpen} onClose={() => setIsCreateAPIKeyModalOpen(false)} onCreateKey={handleCreateKey} />
        </Card>
    );
};

/**
 * @description Card for security awareness training and resources.
 */
export const SecurityAwarenessTrainingCard: React.FC = () => {
    const [modules, setModules] = useState<SecurityAwarenessModule[]>(MOCK_SECURITY_AWARENESS_MODULES);

    const handleMarkCompleted = (id: string) => {
        setModules(modules.map(mod => mod.id === id ? { ...mod, completionStatus: 'completed', lastAccessed: new Date().toISOString().slice(0, 10) } : mod));
        alert('Module marked as completed!');
    };

    const getStatusClass = (status: 'not_started' | 'in_progress' | 'completed') => {
        switch (status) {
            case 'completed': return 'text-green-400 bg-green-900/20';
            case 'in_progress': return 'text-yellow-400 bg-yellow-900/20';
            case 'not_started': return 'text-gray-400 bg-gray-700/20';
        }
    };

    return (
        <Card title="Security Awareness & Training" titleTooltip="Access a library of educational modules to enhance your personal cybersecurity knowledge.">
            <p className="text-sm text-gray-400 mb-4">
                Empower yourself with knowledge. Our interactive security awareness modules are designed to help you recognize threats and adopt best practices for financial security.
            </p>
            <ul className="divide-y divide-gray-700/60">
                {modules.map(module => (
                    <li key={module.id} className="py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center">
                        <div>
                            <h4 className="font-semibold text-white">{module.title}</h4>
                            <p className="text-sm text-gray-400 max-w-md mt-1">{module.description}</p>
                            <p className="text-xs text-gray-500 mt-1">Status: <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${getStatusClass(module.completionStatus)}`}>{module.completionStatus.replace('_', ' ')}</span></p>
                            {module.lastAccessed !== 'N/A' && <p className="text-xs text-gray-500">Last Accessed: {module.lastAccessed}</p>}
                        </div>
                        <div className="flex gap-2 mt-2 sm:mt-0">
                            {module.completionStatus !== 'completed' && (
                                <button onClick={() => handleMarkCompleted(module.id)} className="px-3 py-1 bg-green-600/50 hover:bg-green-600 text-white rounded-lg text-xs font-medium">
                                    Mark Complete
                                </button>
                            )}
                            <a href={module.url} target="_blank" rel="noopener noreferrer" className="px-3 py-1 bg-blue-600/50 hover:bg-blue-600 text-white rounded-lg text-xs font-medium">
                                {module.completionStatus === 'not_started' ? 'Start Module' : 'Continue Module'}
                            </a>
                        </div>
                    </li>
                ))}
            </ul>
            <div className="mt-6 pt-4 border-t border-gray-700/60 text-sm text-gray-400">
                <p>Completing these modules can significantly reduce your risk exposure. New modules are added quarterly.</p>
            </div>
        </Card>
    );
};


// ================================================================================================
// MAIN VIEW COMPONENT: SecurityView (AegisVault) (EXPANDED)
// ================================================================================================

const SecurityView: React.FC = () => {
    const context = useContext(DataContext);
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
    
    if (!context) {
        throw new Error("SecurityView must be within a DataProvider.");
    }
    
    const { linkedAccounts, unlinkAccount, handlePlaidSuccess } = context;

    return (
        <>
            <div className="space-y-8"> {/* Increased spacing */}
                <h2 className="text-4xl font-extrabold text-white tracking-wider mb-6 leading-tight">AegisVault: Your Security Command Center</h2>
                <p className="text-lg text-gray-300 max-w-2xl">
                    Welcome to the AegisVault, your ultimate control center for securing your financial life.
                    Here, you wield the power of advanced security protocols, granular privacy controls,
                    and proactive threat intelligence, all designed to make your financial kingdom impenetrable.
                    Our AI-driven systems, honed by a decade of expert upgrades, provide you with the most
                    comprehensive and intuitive security experience available.
                </p>
                
                {/* Linked Accounts & Data Sources Card */}
                <Card title="Linked Accounts & Data Sources" titleTooltip="Manage connections to external financial institutions. You have full control to link or unlink accounts at any time.">
                    <p className="text-sm text-gray-400 mb-4">
                        These are the external accounts you've securely connected via Plaid. This allows Demo Bank to provide a holistic view of your finances. Your credentials are never stored by us. We use bank-level encryption and tokenization.
                    </p>
                    <div className="space-y-3 mb-6">
                        {linkedAccounts.length > 0 ? linkedAccounts.map(account => (
                            <div key={account.id} className="flex justify-between items-center p-3 bg-gray-800/50 rounded-lg border border-gray-700/60">
                                <div>
                                    <h4 className="font-semibold text-white">{account.name}</h4>
                                    <p className="text-sm text-gray-400">Account ending in **** {account.mask}</p>
                                    <p className="text-xs text-gray-500">Last synced: {new Date().toLocaleDateString()}</p>
                                </div>
                                <button onClick={() => unlinkAccount(account.id)} className="px-3 py-1 bg-red-600/50 hover:bg-red-600 text-white rounded-lg text-xs font-medium">
                                    Unlink
                                </button>
                            </div>
                        )) : (
                            <p className="text-center text-gray-500 py-4">No accounts linked yet. Link an account to get a unified financial view.</p>
                        )}
                    </div>
                    <PlaidLinkButton onSuccess={handlePlaidSuccess} />
                </Card>

                {/* Security Settings Card (Expanded) */}
                <Card title="Account Security Essentials">
                    <ul className="divide-y divide-gray-700/60">
                        <SecuritySettingToggle
                            title="Two-Factor Authentication (2FA)"
                            description="Requires a code from your authenticator app or SMS in addition to your password for enhanced security against unauthorized access. Always recommended."
                            defaultChecked={true}
                        />
                        <SecuritySettingToggle
                            title="Biometric Login"
                            description="Enable passwordless login using your device's Face ID, Touch ID, or fingerprint for a faster and more secure experience. Device specific."
                            defaultChecked={false}
                        />
                        <li className="py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center">
                            <div>
                                <h4 className="font-semibold text-white">Change Password</h4>
                                <p className="text-sm text-gray-400 max-w-md mt-1">It's a good practice to update your password regularly, especially after any suspicious activity.</p>
                            </div>
                            <button onClick={() => setIsPasswordModalOpen(true)} className="mt-2 sm:mt-0 px-4 py-2 bg-gray-600/50 hover:bg-gray-600 text-white rounded-lg text-xs font-medium">
                                Change
                            </button>
                        </li>
                        <SecuritySettingToggle
                            title="Email Security Alerts"
                            description="Receive instant email notifications for all critical account activities (e.g., logins, password changes, large transactions)."
                            defaultChecked={true}
                        />
                         <SecuritySettingToggle
                            title="SMS Security Alerts"
                            description="Receive instant SMS notifications for all critical account activities. (Requires verified phone number)."
                            defaultChecked={true}
                        />
                        <SecuritySettingToggle
                            title="Automatic Logout on Inactivity"
                            description="Automatically log out of your session after a period of inactivity to prevent unauthorized access if you step away from your device."
                            defaultChecked={true}
                        />
                        <SecuritySettingToggle
                            title="Session Timeout (30 minutes)"
                            description="Your session will automatically expire after 30 minutes of inactivity, requiring you to re-authenticate."
                            defaultChecked={true}
                            disabled={true} // Non-configurable for security
                        />
                    </ul>
                </Card>

                {/* Login Activity Card */}
                <Card title="Recent Login Activity">
                     <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left text-gray-400">
                            <thead className="text-xs text-gray-300 uppercase bg-gray-900/30">
                                <tr>
                                    <th className="px-6 py-3">Device</th>
                                    <th className="px-6 py-3">Location</th>
                                    <th className="px-6 py-3">IP Address</th>
                                    <th className="px-6 py-3">Timestamp</th>
                                </tr>
                            </thead>
                            <tbody>
                                {MOCK_LOGIN_ACTIVITY.map(activity => (
                                    <tr key={activity.id} className={`border-b border-gray-800 ${activity.isCurrent ? 'bg-cyan-500/10' : 'hover:bg-gray-800/50'}`}>
                                        <td className="px-6 py-4 font-medium text-white">{activity.device} {activity.isCurrent && <span className="text-xs text-cyan-300">(Current)</span>}</td>
                                        <td className="px-6 py-4">{activity.location}</td>
                                        <td className="px-6 py-4">{activity.ip}</td>
                                        <td className="px-6 py-4">{activity.timestamp}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Card>

                {/* NEW CARDS - Ordered logically */}
                <SecurityPostureCard />
                <AdvancedAuthenticationCard />
                <DeviceManagementCard />
                <DataPrivacyControlsCard />
                <TransactionMonitoringCard />
                <ThreatAlertsCard />
                <AuditLogViewerCard />
                <EmergencyActionsCard />
                <APIKeyManagementCard />
                <SecurityAwarenessTrainingCard /> {/* New Card for training */}

            </div>
            {/* All modals */}
            <ChangePasswordModal isOpen={isPasswordModalOpen} onClose={() => setIsPasswordModalOpen(false)} />
            {/* Modals from sub-components are handled within their respective components for encapsulation. */}
        </>
    );
};

export default SecurityView;

================================================================================
// APPENDED FROM REPO: diplomat-bit/Fuckyou | ORIGINAL PATH: diplomat-bit-Fuckyou-70f83c5/components/SecurityView (1).tsx
================================================================================


import React, { useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { DataContext } from '../context/DataContext';
import Card from './Card';
import PlaidLinkButton from './PlaidLinkButton';
import { 
    LoginActivity, Device, DataSharingPolicy, TransactionRule, ThreatAlert, 
    AuditLogEntry, APIKey, TrustedContact, SecurityAwarenessModule, SecurityScoreMetric, UserProfile 
} from '../types';

// --- AI/ML Integration Placeholder Types (Simulated for expansion) ---
interface AISecurityInsight {
    id: string;
    timestamp: string;
    severity: 'Low' | 'Medium' | 'High' | 'Critical';
    summary: string;
    recommendation: string;
    sourceModel: string;
}

// --- Constants for Billion Dollar Features ---
const AI_INSIGHT_ENGINE_VERSION = "ChaosEngine v0.0.1-Garbage";
const MAX_AUDIT_LOG_DISPLAY = 5;

// --- Helper Components ---

export const SecuritySettingToggle: React.FC<{
    id: string;
    title: string;
    description: string;
    defaultChecked: boolean;
    onToggle?: (checked: boolean) => void;
    disabled?: boolean;
    aiImpact?: 'High' | 'Medium' | 'Low' | 'None';
}> = ({ id, title, description, defaultChecked, onToggle, disabled, aiImpact = 'None' }) => {
    const [isChecked, setIsChecked] = useState(defaultChecked);
    const { showSystemAlert } = useContext(DataContext) || {};

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newState = e.target.checked;
        setIsChecked(newState);
        onToggle && onToggle(newState);
        
        if (showSystemAlert) {
            const impactColor = aiImpact === 'High' ? 'text-red-400' : aiImpact === 'Medium' ? 'text-yellow-400' : 'text-green-400';
            showSystemAlert(`Configuration Change Detected: ${title} set to ${newState ? 'Enabled' : 'Disabled'}. AI Risk Assessment: ${aiImpact}.`, 'info');
        }
    };

    const aiIndicator = useMemo(() => {
        if (aiImpact === 'None') return null;
        const colorMap = {
            High: 'bg-red-500',
            Medium: 'bg-yellow-500',
            Low: 'bg-blue-500',
        };
        return (
            <span className={`ml-3 px-2 py-0.5 text-xs font-bold rounded-full text-white ${colorMap[aiImpact]}`}>
                AI {aiImpact}
            </span>
        );
    }, [aiImpact]);

    return (
        <li className="py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-gray-800/70">
            <div className="flex-grow">
                <label htmlFor={`toggle-${id}`} className="font-bold text-lg text-white cursor-pointer flex items-center">
                    {title}
                    {aiIndicator}
                </label>
                <p className="text-sm text-gray-400 max-w-xl mt-1">{description}</p>
            </div>
            <div className="flex items-center mt-2 sm:mt-0">
                <span className={`mr-3 text-sm font-medium ${isChecked ? 'text-green-400' : 'text-red-400'}`}>
                    {isChecked ? 'ACTIVE' : 'INACTIVE'}
                </span>
                <input
                    type="checkbox"
                    id={`toggle-${id}`}
                    className="toggle toggle-cyan toggle-lg"
                    checked={isChecked}
                    onChange={handleChange}
                    disabled={disabled}
                    aria-label={`Toggle for ${title}`}
                />
            </div>
        </li>
    );
};

export const NotificationToast: React.FC<{
    message: string;
    type: 'success' | 'error' | 'info' | 'warning' | 'critical';
    onClose: () => void;
    isVisible: boolean;
}> = ({ message, type, onClose, isVisible }) => {
    const typeClasses = {
        success: 'bg-green-700 border-green-500',
        error: 'bg-red-700 border-red-500',
        info: 'bg-blue-700 border-blue-500',
        warning: 'bg-yellow-700 border-yellow-500',
        critical: 'bg-purple-800 border-purple-500'
    };
    
    const iconMap = {
        success: <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
        error: <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
        info: <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
        warning: <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.938 5.002c-.77-1.333-2.688-1.333-3.458 0L3.308 18.002c-.77 1.333.192 3 1.732 3z" /></svg>,
        critical: <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.938 5.002c-.77-1.333-2.688-1.333-3.458 0L3.308 18.002c-.77 1.333.192 3 1.732 3z" /></svg>
    };

    useEffect(() => {
        let timer: ReturnType<typeof setTimeout>;
        if (isVisible) {
            const duration = type === 'critical' ? 15000 : 7000;
            timer = setTimeout(() => { onClose(); }, duration);
        }
        return () => clearTimeout(timer);
    }, [isVisible, onClose, type]);

    if (!isVisible) return null;
    return (
        <div className={`fixed bottom-8 right-8 p-5 rounded-xl shadow-2xl text-white flex items-start space-x-4 transition-all duration-500 ease-out transform border-l-8 ${typeClasses[type]} ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'}`} style={{zIndex: 1000, minWidth: '300px'}}>
            <div className="flex-shrink-0 mt-1">
                {iconMap[type]}
            </div>
            <div className="flex-grow">
                <span className="text-sm font-bold block capitalize">{type} Alert</span>
                <span className="text-base font-medium">{message}</span>
            </div>
            <button onClick={onClose} className="p-1 rounded-full hover:bg-black/20 focus:outline-none flex-shrink-0 mt-0.5 transition-colors">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
        </div>
    );
};

// --- AI Insight Display Component ---
const AISecurityInsightCard: React.FC<{ insight: AISecurityInsight }> = ({ insight }) => {
    const severityClasses = {
        Critical: 'border-red-600 bg-red-900/20 text-red-300',
        High: 'border-orange-600 bg-orange-900/20 text-orange-300',
        Medium: 'border-yellow-600 bg-yellow-900/20 text-yellow-300',
        Low: 'border-green-600 bg-green-900/20 text-green-300',
    };

    return (
        <div className={`p-4 rounded-xl border-l-4 shadow-lg transition-all duration-300 hover:shadow-xl ${severityClasses[insight.severity]}`}>
            <div className="flex justify-between items-start mb-2">
                <h4 className="font-extrabold text-lg">{insight.summary}</h4>
                <span className={`text-xs font-semibold px-2 py-1 rounded-full ${severityClasses[insight.severity].replace('border-', 'bg-').replace('/20', '/40')}`}>{insight.severity}</span>
            </div>
            <p className="text-sm text-gray-300 mb-3">{insight.recommendation}</p>
            <div className="text-xs text-gray-400 flex justify-between border-t border-current pt-2 mt-2">
                <span>Engine: {insight.sourceModel}</span>
                <span>Detected: {new Date(insight.timestamp).toLocaleString()}</span>
            </div>
        </div>
    );
};

// --- Main Component ---

const SecurityView: React.FC = () => {
    const context = useContext(DataContext);
    const { 
        linkedAccounts, unlinkAccount, handlePlaidSuccess, 
        securityMetrics, auditLogs, threatAlerts, 
        dataSharingPolicies, apiKeys, trustedContacts, 
        securityAwarenessModules, showSystemAlert,
        transactionRules 
    } = context || {};

    const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' | 'info' | 'warning' | 'critical'; isVisible: boolean } | null>(null);
    const [loginActivity, setLoginActivity] = useState<LoginActivity[]>([]);
    const [devices, setDevices] = useState<Device[]>([]);
    const [aiInsights, setAiInsights] = useState<AISecurityInsight[]>([]);
    const [activeTab, setActiveTab] = useState<'overview' | 'policies' | 'keys' | 'ai_analysis'>('overview');
    const [securityScore, setSecurityScore] = useState<number>(75); // Initial mock score

    // --- Mock Data Initialization & AI Simulation ---
    useEffect(() => {
        const now = new Date();
        const pastDate = (days: number) => new Date(now.getTime() - days * 24 * 60 * 60 * 1000).toISOString();

        // Mock Login Activity
        setLoginActivity([
            { id: '1', device: 'Quantum Workstation', browser: 'Chrome 125 (Secure)', os: 'Linux Kernel 6.8', location: 'HQ Server Room', ip: '10.0.0.5', timestamp: pastDate(0.01), isCurrent: true, userAgent: 'EnterpriseAgent/1.0' },
            { id: '2', device: 'Personal Mobile', browser: 'Safari', os: 'iOS 18.0 Beta', location: 'Remote Office', ip: '203.0.113.45', timestamp: pastDate(1.5), isCurrent: false, userAgent: 'MobileSafari/605.1.15' },
            { id: '3', device: 'Legacy VM', browser: 'IE 11', os: 'Windows Server 2012', location: 'Decommissioned Zone', ip: '192.168.1.100', timestamp: pastDate(15), isCurrent: false, userAgent: 'MSIE 11.0;' },
        ]);

        // Mock Devices
        setDevices([
            { id: 'dvc_1', name: 'Primary Workstation', type: 'Desktop', model: 'Custom Build X9', lastActivity: pastDate(0.01), location: 'HQ Server Room', ip: '10.0.0.5', isCurrent: true, permissions: ['read_all', 'write_transactions', 'admin_config'], status: 'active', firstSeen: pastDate(500), userAgent: 'EnterpriseAgent/1.0', pushNotificationsEnabled: true, biometricAuthEnabled: true, encryptionStatus: 'AES-256-GCM' },
            { id: 'dvc_2', name: 'Executive Tablet', type: 'Tablet', model: 'Pad Pro 14', lastActivity: pastDate(0.5), location: 'Remote Office', ip: '203.0.113.45', isCurrent: false, permissions: ['read_reports'], status: 'active', firstSeen: pastDate(120), userAgent: 'MobileSafari/605.1.15', pushNotificationsEnabled: false, biometricAuthEnabled: true, encryptionStatus: 'full' },
        ]);

        // Mock AI Insights based on potential issues
        setAiInsights([
            { 
                id: 'ai_001', 
                timestamp: pastDate(0.1), 
                severity: 'High', 
                summary: 'Unusual Data Access Pattern Detected', 
                recommendation: 'Review recent read operations from Device ID dvc_2 between 02:00 and 04:00 UTC. Initiate temporary read-only lock.', 
                sourceModel: 'BehavioralAnomaly_v3' 
            },
            { 
                id: 'ai_002', 
                timestamp: pastDate(1), 
                severity: 'Medium', 
                summary: 'Outdated OS Detected on Active Device', 
                recommendation: 'Update OS on "Legacy VM" (IP 192.168.1.100) to a supported version or isolate it to a sandbox network segment.', 
                sourceModel: 'VulnerabilityScanner_v1' 
            },
        ]);

        // Simulate loading security metrics if available
        if (securityMetrics && securityMetrics.length > 0) {
            const scoreMetric = securityMetrics.find(m => m.metricName === 'OverallSecurityScore');
            if (scoreMetric) {
                setSecurityScore(Math.round(parseFloat(scoreMetric.currentValue) * 100));
            }
        }

    }, [securityMetrics]);

    // --- Handlers ---
    const showNotification = useCallback((message: string, type: 'success' | 'error' | 'info' | 'warning' | 'critical') => {
        setNotification({ message, type, isVisible: true });
    }, []);

    const closeNotification = useCallback(() => {
        setNotification(prev => prev ? { ...prev, isVisible: false } : null);
    }, []);

    const handleUnlink = (id: string) => {
        if (unlinkAccount) {
            unlinkAccount(id);
            showNotification(`Financial Source ID ${id} successfully revoked access.`, 'success');
        }
    };

    const handlePolicyToggle = (policy: DataSharingPolicy, enabled: boolean) => {
        // In a real app, this would call an API to update the policy state
        console.log(`Policy ${policy.policyId} toggled to ${enabled}`);
        showNotification(`Data Sharing Policy "${policy.policyName}" updated to ${enabled ? 'Active' : 'Inactive'}.`, 'info');
    };

    const handleAPIKeyRevoke = (keyId: string) => {
        // In a real app, this would call an API to revoke the key
        showNotification(`API Key ${keyId.substring(0, 8)}... has been immediately revoked and invalidated.`, 'critical');
    };

    // --- Render Helpers ---

    const renderLinkedAccounts = useMemo(() => (
        <Card title="Financial Data Sources (Plaid Integration)" className="lg:col-span-2">
            <div className="space-y-4">
                <p className="text-gray-400 text-sm border-b border-gray-800 pb-3">Securely manage connections to external financial institutions via encrypted tokenization. Last sync: {new Date().toLocaleTimeString()}</p>
                {linkedAccounts && linkedAccounts.length > 0 ? (
                    <div className="space-y-3">
                        {linkedAccounts.map(account => (
                            <div key={account.id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 bg-gray-800/70 rounded-lg border border-cyan-700/50 shadow-md">
                                <div className="flex items-center mb-2 sm:mb-0">
                                    <div className="w-12 h-12 rounded-xl bg-cyan-900/70 flex items-center justify-center text-cyan-300 mr-4 flex-shrink-0">
                                        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" /></svg>
                                    </div>
                                    <div>
                                        <p className="font-bold text-lg text-white">{account.name}</p>
                                        <p className="text-sm text-gray-400">Institution ID: {account.institutionId} | Mask: {account.mask}</p>
                                    </div>
                                </div>
                                <div className="flex space-x-2 mt-2 sm:mt-0">
                                    <button 
                                        onClick={() => showNotification(`Initiating re-authentication for ${account.name}...`, 'info')}
                                        className="px-3 py-1.5 bg-indigo-900/30 hover:bg-indigo-900/50 text-indigo-300 rounded-lg text-sm transition-colors border border-indigo-700"
                                    >
                                        Re-sync
                                    </button>
                                    <button 
                                        onClick={() => handleUnlink(account.id)}
                                        className="px-3 py-1.5 bg-red-900/50 hover:bg-red-900/70 text-red-300 rounded-lg text-sm transition-colors border border-red-700"
                                    >
                                        Revoke Access
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="p-6 bg-gray-800/50 rounded-lg text-center border border-dashed border-gray-700">
                        <p className="text-gray-500 italic mb-3">No external financial data sources are currently integrated.</p>
                        {handlePlaidSuccess && <PlaidLinkButton onSuccess={handlePlaidSuccess} label="Connect New Financial Source" className="w-full sm:w-auto" />}
                    </div>
                )}
            </div>
        </Card>
    ), [linkedAccounts, handlePlaidSuccess, handleUnlink, showNotification]);

    const renderSecuritySettings = useMemo(() => (
        <Card title="Core Authentication & Access Controls" className="lg:col-span-1">
            <ul className="divide-y divide-gray-700/50">
                <SecuritySettingToggle 
                    id="2fa_quantum"
                    title="Quantum 2FA (Hardware Key Required)" 
                    description="Mandatory FIDO2/WebAuthn hardware key enforcement for all administrative roles. Software TOTP is deprecated." 
                    defaultChecked={true} 
                    aiImpact='High'
                />
                <SecuritySettingToggle 
                    id="biometric_device"
                    title="Device Biometric Trust" 
                    description="Enforce device-level biometric verification for any transaction exceeding $10,000 or configuration change." 
                    defaultChecked={true} 
                    aiImpact='Medium'
                />
                <SecuritySettingToggle 
                    id="session_timeout"
                    title="Zero-Trust Session Invalidation" 
                    description="Sessions automatically terminate after 15 minutes of inactivity, requiring re-authentication via context-aware challenge." 
                    defaultChecked={true} 
                    aiImpact='High'
                />
                <li className="py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-gray-800/70">
                     <div className="flex-grow">
                        <span className="font-bold text-lg text-white flex items-center">Master Credential Management</span>
                        <p className="text-sm text-gray-400">Last rotation: 2024-01-15. Next mandatory rotation: 2025-01-15.</p>
                     </div>
                     <button className="px-6 py-2 bg-indigo-700 hover:bg-indigo-600 text-white font-semibold rounded-lg text-sm transition-colors shadow-lg mt-2 sm:mt-0">
                        Initiate Credential Rotation Protocol
                     </button>
                </li>
            </ul>
        </Card>
    ), []);

    const renderRecentActivity = useMemo(() => (
        <Card title="Real-Time Login Telemetry" className="lg:col-span-1">
            <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                {loginActivity.map(activity => (
                    <div key={activity.id} className="flex items-start justify-between p-3 bg-gray-800/50 rounded-lg border-l-4 border-gray-700 hover:bg-gray-700/50 transition-colors">
                        <div className="flex-grow min-w-0">
                            <p className="font-bold text-white truncate flex items-center gap-2">
                                {activity.device}
                                {activity.isCurrent && <span className="px-2 py-0.5 bg-green-600/50 text-green-200 text-xs rounded-full font-medium flex-shrink-0">LIVE SESSION</span>}
                            </p>
                            <p className="text-xs text-gray-400 mt-1">
                                <span className="font-mono bg-gray-700/50 px-1 rounded mr-1">{activity.ip}</span> 
                                @ {activity.location} ({activity.os})
                            </p>
                        </div>
                        <span className="text-xs text-gray-500 ml-2 flex-shrink-0">{new Date(activity.timestamp).toLocaleTimeString()}</span>
                    </div>
                ))}
            </div>
        </Card>
    ), [loginActivity]);

    const renderActiveDevices = useMemo(() => (
        <Card title="Managed Endpoints Inventory" className="lg:col-span-2">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {devices.map(device => (
                    <div key={device.id} className="p-4 bg-gray-800/50 rounded-lg border border-indigo-700/50 flex flex-col shadow-lg">
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-indigo-900/70 rounded-lg flex items-center justify-center text-indigo-300 flex-shrink-0">
                                    {device.type === 'Mobile' ? (
                                         <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
                                    ) : (
                                         <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                                    )}
                                </div>
                                <p className="font-bold text-white truncate">{device.name}</p>
                            </div>
                            <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${device.status === 'active' ? 'bg-green-600/30 text-green-300' : 'bg-red-600/30 text-red-300'}`}>
                                {device.status.toUpperCase()}
                            </span>
                        </div>
                        <p className="text-xs text-gray-400 mb-2">Model: {device.model} ({device.type})</p>
                        <p className="text-xs text-gray-500 truncate">IP: {device.ip} | Last Seen: {new Date(device.lastActivity).toLocaleTimeString()}</p>
                        <div className="mt-3 pt-2 border-t border-gray-700">
                            <p className="text-xs font-semibold text-cyan-400">Permissions Granted: {device.permissions.length}</p>
                            <div className="flex flex-wrap gap-1 mt-1">
                                {device.permissions.slice(0, 3).map(p => (
                                    <span key={p} className="text-[10px] bg-gray-700 text-gray-300 px-1 rounded">{p}</span>
                                ))}
                                {device.permissions.length > 3 && <span className="text-[10px] text-gray-500">+{device.permissions.length - 3} more</span>}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </Card>
    ), [devices]);

    const renderDataPolicies = useMemo(() => (
        <Card title="Data Governance & Sharing Policies" className="lg:col-span-2">
            <p className="text-sm text-gray-400 mb-4">Define granular controls over how internal and external data sets are processed, stored, and shared. Managed by AI Policy Engine.</p>
            <div className="space-y-4">
                {(dataSharingPolicies || []).map(policy => (
                    <div key={policy.policyId} className="p-4 bg-gray-800/70 rounded-lg border border-purple-700/50 flex flex-col md:flex-row justify-between items-start md:items-center">
                        <div className="flex-grow mb-2 md:mb-0">
                            <p className="font-bold text-white text-lg">{policy.policyName}</p>
                            <p className="text-xs text-gray-400 mt-1">Scope: {policy.scope} | Last Reviewed: {policy.lastReviewed}</p>
                        </div>
                        <div className="flex items-center space-x-4">
                            <span className={`text-sm font-semibold ${policy.isActive ? 'text-green-400' : 'text-red-400'}`}>
                                {policy.isActive ? 'ACTIVE' : 'DRAFT'}
                            </span>
                            <SecuritySettingToggle
                                id={`policy-${policy.policyId}`}
                                title="Enable Policy"
                                description={`Toggle activation for ${policy.policyName}`}
                                defaultChecked={policy.isActive}
                                onToggle={(checked) => handlePolicyToggle(policy, checked)}
                                aiImpact='Medium'
                            />
                        </div>
                    </div>
                ))}
            </div>
        </Card>
    ), [dataSharingPolicies, handlePolicyToggle]);

    const renderAPIKeys = useMemo(() => (
        <Card title="System API Key Management" className="lg:col-span-2">
            <p className="text-sm text-gray-400 mb-4">Manage programmatic access tokens. Keys are automatically rotated by the Quantum Key Vault every 90 days.</p>
            <div className="space-y-3">
                {(apiKeys || []).map(key => (
                    <div key={key.id} className="flex justify-between items-center p-3 bg-gray-800/70 rounded-lg border border-yellow-700/50">
                        <div className="flex items-center min-w-0">
                            <svg className="w-5 h-5 text-yellow-400 mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M6 16h.01" /></svg>
                            <div>
                                <p className="font-mono text-sm text-white truncate">{key.keyName} ({key.id.substring(0, 8)}...)</p>
                                <p className="text-xs text-gray-500">Created: {key.creationDate} | Permissions: {key.scopes.join(', ')}</p>
                            </div>
                        </div>
                        <button 
                            onClick={() => handleAPIKeyRevoke(key.id)}
                            className="px-3 py-1 bg-red-900/30 hover:bg-red-900/50 text-red-300 rounded-md text-xs transition-colors flex-shrink-0 ml-4"
                        >
                            Revoke Now
                        </button>
                    </div>
                ))}
            </div>
        </Card>
    ), [apiKeys, handleAPIKeyRevoke]);

    const renderAIAnalysis = useMemo(() => (
        <div className="space-y-6">
            <Card title={`AI Threat Intelligence Feed (${AI_INSIGHT_ENGINE_VERSION})`}>
                <div className="flex justify-between items-center mb-4 border-b border-gray-800 pb-3">
                    <p className="text-gray-400 text-sm">Real-time behavioral analysis and predictive threat modeling.</p>
                    <span className="text-sm font-bold text-cyan-400">Total Insights: {aiInsights.length}</span>
                </div>
                <div className="space-y-4">
                    {aiInsights.length > 0 ? (
                        aiInsights.map(insight => (
                            <AISecurityInsightCard key={insight.id} insight={insight} />
                        ))
                    ) : (
                        <div className="p-6 bg-gray-800/50 rounded-lg text-center border border-dashed border-gray-700">
                            <p className="text-gray-500 italic">AI Engine reports no immediate high-priority anomalies at this time.</p>
                        </div>
                    )}
                </div>
            </Card>

            <Card title="Security Awareness Training Modules">
                <p className="text-sm text-gray-400 mb-4">Track mandatory compliance training completion status across the organization.</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {(securityAwarenessModules || []).map(module => (
                        <div key={module.moduleId} className="p-4 bg-gray-800/70 rounded-lg border border-green-700/50">
                            <p className="font-bold text-white">{module.title}</p>
                            <p className="text-xs text-gray-400 mt-1">Status: {module.completionRate}% Complete</p>
                            <div className="w-full bg-gray-700 rounded-full h-2.5 mt-2">
                                <div className="bg-green-500 h-2.5 rounded-full" style={{ width: `${module.completionRate}%` }}></div>
                            </div>
                        </div>
                    ))}
                </div>
            </Card>
        </div>
    ), [aiInsights, securityAwarenessModules]);

    const renderAuditLogs = useMemo(() => {
        const displayLogs = (auditLogs || []).slice(0, MAX_AUDIT_LOG_DISPLAY);
        return (
            <Card title={`System Audit Trail (Last ${displayLogs.length} Entries)`} className="lg:col-span-2">
                <p className="text-sm text-gray-400 mb-3">Immutable record of all configuration changes, data access events, and administrative actions.</p>
                <div className="overflow-x-auto max-h-[500px] custom-scrollbar">
                    <table className="min-w-full divide-y divide-gray-700">
                        <thead className="sticky top-0 bg-gray-800 z-10">
                            <tr>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Time</th>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">User/System</th>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Action</th>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Target</th>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-800">
                            {displayLogs.map((log: AuditLogEntry) => (
                                <tr key={log.id} className="hover:bg-gray-800/50 transition-colors">
                                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">{new Date(log.timestamp).toLocaleTimeString()}</td>
                                    <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-white">{log.userId.includes('sys_') ? 'SYSTEM' : log.userId}</td>
                                    <td className="px-4 py-2 text-sm text-cyan-400">{log.action}</td>
                                    <td className="px-4 py-2 text-sm text-gray-400">{log.targetResource}</td>
                                    <td className="px-4 py-2 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${log.success ? 'bg-green-900/50 text-green-300' : 'bg-red-900/50 text-red-300'}`}>
                                            {log.success ? 'SUCCESS' : 'FAILURE'}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {displayLogs.length < (auditLogs?.length || 0) && (
                    <p className="text-center text-sm text-gray-500 mt-3">Displaying first {MAX_AUDIT_LOG_DISPLAY} logs. Load full history via dedicated Audit Console.</p>
                )}
            </Card>
        );
    }, [auditLogs]);

    const renderSecurityScoreGauge = useMemo(() => {
        const radius = 50;
        const circumference = 2 * Math.PI * radius;
        const offset = circumference - (securityScore / 100) * circumference;
        const color = securityScore >= 90 ? 'stroke-green-500' : securityScore >= 70 ? 'stroke-yellow-500' : 'stroke-red-500';

        return (
            <div className="flex flex-col items-center p-6 bg-gray-800/70 rounded-xl shadow-inner border border-gray-700">
                <h3 className="text-xl font-bold text-white mb-3">Quantum Security Index (QSI)</h3>
                <svg width="120" height="120" viewBox="0 0 120 120" className="transform -rotate-90">
                    {/* Background Circle */}
                    <circle
                        cx="60"
                        cy="60"
                        r={radius}
                        fill="transparent"
                        stroke="#374151"
                        strokeWidth="10"
                    />
                    {/* Progress Arc */}
                    <circle
                        cx="60"
                        cy="60"
                        r={radius}
                        fill="transparent"
                        stroke={color.replace('stroke-', '')}
                        strokeWidth="10"
                        strokeDasharray={circumference}
                        strokeDashoffset={offset}
                        strokeLinecap="round"
                        className="transition-all duration-1000 ease-out"
                    />
                    {/* Text */}
                    <text
                        x="60"
                        y="60"
                        dominantBaseline="middle"
                        textAnchor="middle"
                        className="fill-current text-white"
                        fontSize="20"
                        fontWeight="bold"
                    >
                        {securityScore}%
                    </text>
                </svg>
                <p className="text-sm text-gray-400 mt-2">Target: 95%</p>
            </div>
        );
    }, [securityScore]);

    const renderTrustedContacts = useMemo(() => (
        <Card title="Emergency Trusted Contacts" className="lg:col-span-1">
            <p className="text-sm text-gray-400 mb-4">Contacts authorized for emergency account recovery or high-risk alerts.</p>
            <div className="space-y-3">
                {(trustedContacts || []).map((contact: TrustedContact) => (
                    <div key={contact.id} className="flex justify-between items-center p-3 bg-gray-800/50 rounded-lg border border-gray-700">
                        <div className="flex items-center">
                            <div className="w-8 h-8 bg-pink-900/50 rounded-full flex items-center justify-center text-pink-300 mr-3">
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                            </div>
                            <div>
                                <p className="font-semibold text-white">{contact.name}</p>
                                <p className="text-xs text-gray-400">{contact.relationship}</p>
                            </div>
                        </div>
                        <span className={`text-xs font-medium px-2 py-0.5 rounded ${contact.verified ? 'bg-green-900/30 text-green-400' : 'bg-red-900/30 text-red-400'}`}>
                            {contact.verified ? 'Verified' : 'Pending'}
                        </span>
                    </div>
                ))}
            </div>
        </Card>
    ), [trustedContacts]);


    // --- Tab Content Rendering ---
    const renderContent = () => {
        switch (activeTab) {
            case 'overview':
                return (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {renderSecurityScoreGauge}
                        {renderRecentActivity}
                        {renderActiveDevices}
                        {renderLinkedAccounts}
                        {renderSecuritySettings}
                    </div>
                );
            case 'policies':
                return (
                    <div className="grid grid-cols-1 gap-6">
                        {renderDataPolicies}
                        <Card title="Transaction Rule Engine" className="lg:col-span-2">
                            <p className="text-sm text-gray-400 mb-4">Define automated responses to financial events based on predefined risk thresholds.</p>
                            <div className="space-y-3">
                                {(transactionRules || []).map((rule: TransactionRule) => (
                                    <div key={rule.ruleId} className="p-3 bg-gray-800/70 rounded-lg border border-cyan-700/50 flex justify-between items-center">
                                        <div>
                                            <p className="font-bold text-white">{rule.name}</p>
                                            <p className="text-xs text-gray-400">Trigger: {rule.triggerCondition} | Action: {rule.action}</p>
                                        </div>
                                        <span className={`text-xs font-medium px-2 py-0.5 rounded ${rule.isEnabled ? 'bg-green-900/30 text-green-400' : 'bg-red-900/30 text-red-400'}`}>
                                            {rule.isEnabled ? 'ACTIVE' : 'DISABLED'}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    </div>
                );
            case 'keys':
                return (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {renderAPIKeys}
                        {renderTrustedContacts}
                        <Card title="Threat Alert History" className="lg:col-span-3">
                            <p className="text-sm text-gray-400 mb-4">Historical record of confirmed security incidents.</p>
                            <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                                {(threatAlerts || []).map((alert: ThreatAlert) => (
                                    <div key={alert.alertId} className="p-3 bg-red-900/30 rounded-lg border border-red-600 flex justify-between items-center">
                                        <div>
                                            <p className="font-bold text-red-300">{alert.title}</p>
                                            <p className="text-xs text-gray-300">{alert.description}</p>
                                        </div>
                                        <span className="text-xs text-gray-300">{new Date(alert.timestamp).toLocaleDateString()}</span>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    </div>
                );
            case 'ai_analysis':
                return (
                    <div className="grid grid-cols-1 gap-6">
                        {renderAIAnalysis}
                        {renderAuditLogs}
                    </div>
                );
            default:
                return null;
        }
    };

    // --- Tab Navigation ---
    const tabs: { id: typeof activeTab, label: string }[] = [
        { id: 'overview', label: 'Overview & Access' },
        { id: 'policies', label: 'Governance & Rules' },
        { id: 'keys', label: 'API & Contacts' },
        { id: 'ai_analysis', label: 'AI Threat Analysis' },
    ];

    return (
        <div className="space-y-8 p-4 sm:p-8">
            <header className="pb-4 border-b border-gray-700">
                <h1 className="text-4xl font-extrabold text-white tracking-tighter">Enterprise Security Command Center</h1>
                <p className="text-lg text-gray-400 mt-1">Centralized control plane for data integrity, access management, and threat mitigation. Engine Version: {AI_INSIGHT_ENGINE_VERSION}</p>
            </header>

            {/* Tab Navigation */}
            <div className="flex border-b border-gray-700 overflow-x-auto">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`px-6 py-3 text-lg font-semibold transition-all duration-300 whitespace-nowrap
                            ${activeTab === tab.id 
                                ? 'text-cyan-400 border-b-4 border-cyan-500' 
                                : 'text-gray-400 hover:text-white hover:border-b-4 hover:border-gray-600'
                            }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            <main>
                {renderContent()}
            </main>

            {notification && (
                <NotificationToast 
                    message={notification.message} 
                    type={notification.type} 
                    isVisible={notification.isVisible} 
                    onClose={closeNotification} 
                />
            )}
        </div>
    );
};

export default SecurityView;


================================================================================
// APPENDED FROM REPO: diplomat-bit/Fuckyou | ORIGINAL PATH: diplomat-bit-Fuckyou-70f83c5/components/SecurityView_1.tsx
================================================================================


import React, { useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { DataContext } from '../context/DataContext';
import Card from './Card';
import PlaidLinkButton from './PlaidLinkButton';
import { 
    LoginActivity, Device, DataSharingPolicy, TransactionRule, ThreatAlert, 
    AuditLogEntry, APIKey, TrustedContact, SecurityAwarenessModule, SecurityScoreMetric, UserProfile 
} from '../types';

// --- AI/ML Integration Placeholder Types (Simulated for expansion) ---
interface AISecurityInsight {
    id: string;
    timestamp: string;
    severity: 'Low' | 'Medium' | 'High' | 'Critical';
    summary: string;
    recommendation: string;
    sourceModel: string;
}

// --- Constants for Billion Dollar Features ---
const AI_INSIGHT_ENGINE_VERSION = "ChaosEngine v0.0.1-Garbage";
const MAX_AUDIT_LOG_DISPLAY = 5;

// --- Helper Components ---

export const SecuritySettingToggle: React.FC<{
    id: string;
    title: string;
    description: string;
    defaultChecked: boolean;
    onToggle?: (checked: boolean) => void;
    disabled?: boolean;
    aiImpact?: 'High' | 'Medium' | 'Low' | 'None';
}> = ({ id, title, description, defaultChecked, onToggle, disabled, aiImpact = 'None' }) => {
    const [isChecked, setIsChecked] = useState(defaultChecked);
    const { showSystemAlert } = useContext(DataContext) || {};

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newState = e.target.checked;
        setIsChecked(newState);
        onToggle && onToggle(newState);
        
        if (showSystemAlert) {
            const impactColor = aiImpact === 'High' ? 'text-red-400' : aiImpact === 'Medium' ? 'text-yellow-400' : 'text-green-400';
            showSystemAlert(`Configuration Change Detected: ${title} set to ${newState ? 'Enabled' : 'Disabled'}. AI Risk Assessment: ${aiImpact}.`, 'info');
        }
    };

    const aiIndicator = useMemo(() => {
        if (aiImpact === 'None') return null;
        const colorMap = {
            High: 'bg-red-500',
            Medium: 'bg-yellow-500',
            Low: 'bg-blue-500',
        };
        return (
            <span className={`ml-3 px-2 py-0.5 text-xs font-bold rounded-full text-white ${colorMap[aiImpact]}`}>
                AI {aiImpact}
            </span>
        );
    }, [aiImpact]);

    return (
        <li className="py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-gray-800/70">
            <div className="flex-grow">
                <label htmlFor={`toggle-${id}`} className="font-bold text-lg text-white cursor-pointer flex items-center">
                    {title}
                    {aiIndicator}
                </label>
                <p className="text-sm text-gray-400 max-w-xl mt-1">{description}</p>
            </div>
            <div className="flex items-center mt-2 sm:mt-0">
                <span className={`mr-3 text-sm font-medium ${isChecked ? 'text-green-400' : 'text-red-400'}`}>
                    {isChecked ? 'ACTIVE' : 'INACTIVE'}
                </span>
                <input
                    type="checkbox"
                    id={`toggle-${id}`}
                    className="toggle toggle-cyan toggle-lg"
                    checked={isChecked}
                    onChange={handleChange}
                    disabled={disabled}
                    aria-label={`Toggle for ${title}`}
                />
            </div>
        </li>
    );
};

export const NotificationToast: React.FC<{
    message: string;
    type: 'success' | 'error' | 'info' | 'warning' | 'critical';
    onClose: () => void;
    isVisible: boolean;
}> = ({ message, type, onClose, isVisible }) => {
    const typeClasses = {
        success: 'bg-green-700 border-green-500',
        error: 'bg-red-700 border-red-500',
        info: 'bg-blue-700 border-blue-500',
        warning: 'bg-yellow-700 border-yellow-500',
        critical: 'bg-purple-800 border-purple-500'
    };
    
    const iconMap = {
        success: <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
        error: <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
        info: <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
        warning: <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.938 5.002c-.77-1.333-2.688-1.333-3.458 0L3.308 18.002c-.77 1.333.192 3 1.732 3z" /></svg>,
        critical: <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.938 5.002c-.77-1.333-2.688-1.333-3.458 0L3.308 18.002c-.77 1.333.192 3 1.732 3z" /></svg>
    };

    useEffect(() => {
        let timer: ReturnType<typeof setTimeout>;
        if (isVisible) {
            const duration = type === 'critical' ? 15000 : 7000;
            timer = setTimeout(() => { onClose(); }, duration);
        }
        return () => clearTimeout(timer);
    }, [isVisible, onClose, type]);

    if (!isVisible) return null;
    return (
        <div className={`fixed bottom-8 right-8 p-5 rounded-xl shadow-2xl text-white flex items-start space-x-4 transition-all duration-500 ease-out transform border-l-8 ${typeClasses[type]} ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'}`} style={{zIndex: 1000, minWidth: '300px'}}>
            <div className="flex-shrink-0 mt-1">
                {iconMap[type]}
            </div>
            <div className="flex-grow">
                <span className="text-sm font-bold block capitalize">{type} Alert</span>
                <span className="text-base font-medium">{message}</span>
            </div>
            <button onClick={onClose} className="p-1 rounded-full hover:bg-black/20 focus:outline-none flex-shrink-0 mt-0.5 transition-colors">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
        </div>
    );
};

// --- AI Insight Display Component ---
const AISecurityInsightCard: React.FC<{ insight: AISecurityInsight }> = ({ insight }) => {
    const severityClasses = {
        Critical: 'border-red-600 bg-red-900/20 text-red-300',
        High: 'border-orange-600 bg-orange-900/20 text-orange-300',
        Medium: 'border-yellow-600 bg-yellow-900/20 text-yellow-300',
        Low: 'border-green-600 bg-green-900/20 text-green-300',
    };

    return (
        <div className={`p-4 rounded-xl border-l-4 shadow-lg transition-all duration-300 hover:shadow-xl ${severityClasses[insight.severity]}`}>
            <div className="flex justify-between items-start mb-2">
                <h4 className="font-extrabold text-lg">{insight.summary}</h4>
                <span className={`text-xs font-semibold px-2 py-1 rounded-full ${severityClasses[insight.severity].replace('border-', 'bg-').replace('/20', '/40')}`}>{insight.severity}</span>
            </div>
            <p className="text-sm text-gray-300 mb-3">{insight.recommendation}</p>
            <div className="text-xs text-gray-400 flex justify-between border-t border-current pt-2 mt-2">
                <span>Engine: {insight.sourceModel}</span>
                <span>Detected: {new Date(insight.timestamp).toLocaleString()}</span>
            </div>
        </div>
    );
};

// --- Main Component ---

const SecurityView: React.FC = () => {
    const context = useContext(DataContext);
    const { 
        linkedAccounts, unlinkAccount, handlePlaidSuccess, 
        securityMetrics, auditLogs, threatAlerts, 
        dataSharingPolicies, apiKeys, trustedContacts, 
        securityAwarenessModules, showSystemAlert,
        transactionRules 
    } = context || {};

    const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' | 'info' | 'warning' | 'critical'; isVisible: boolean } | null>(null);
    const [loginActivity, setLoginActivity] = useState<LoginActivity[]>([]);
    const [devices, setDevices] = useState<Device[]>([]);
    const [aiInsights, setAiInsights] = useState<AISecurityInsight[]>([]);
    const [activeTab, setActiveTab] = useState<'overview' | 'policies' | 'keys' | 'ai_analysis'>('overview');
    const [securityScore, setSecurityScore] = useState<number>(75); // Initial mock score

    // --- Mock Data Initialization & AI Simulation ---
    useEffect(() => {
        const now = new Date();
        const pastDate = (days: number) => new Date(now.getTime() - days * 24 * 60 * 60 * 1000).toISOString();

        // Mock Login Activity
        setLoginActivity([
            { id: '1', device: 'Quantum Workstation', browser: 'Chrome 125 (Secure)', os: 'Linux Kernel 6.8', location: 'HQ Server Room', ip: '10.0.0.5', timestamp: pastDate(0.01), isCurrent: true, userAgent: 'EnterpriseAgent/1.0' },
            { id: '2', device: 'Personal Mobile', browser: 'Safari', os: 'iOS 18.0 Beta', location: 'Remote Office', ip: '203.0.113.45', timestamp: pastDate(1.5), isCurrent: false, userAgent: 'MobileSafari/605.1.15' },
            { id: '3', device: 'Legacy VM', browser: 'IE 11', os: 'Windows Server 2012', location: 'Decommissioned Zone', ip: '192.168.1.100', timestamp: pastDate(15), isCurrent: false, userAgent: 'MSIE 11.0;' },
        ]);

        // Mock Devices
        setDevices([
            { id: 'dvc_1', name: 'Primary Workstation', type: 'Desktop', model: 'Custom Build X9', lastActivity: pastDate(0.01), location: 'HQ Server Room', ip: '10.0.0.5', isCurrent: true, permissions: ['read_all', 'write_transactions', 'admin_config'], status: 'active', firstSeen: pastDate(500), userAgent: 'EnterpriseAgent/1.0', pushNotificationsEnabled: true, biometricAuthEnabled: true, encryptionStatus: 'AES-256-GCM' },
            { id: 'dvc_2', name: 'Executive Tablet', type: 'Tablet', model: 'Pad Pro 14', lastActivity: pastDate(0.5), location: 'Remote Office', ip: '203.0.113.45', isCurrent: false, permissions: ['read_reports'], status: 'active', firstSeen: pastDate(120), userAgent: 'MobileSafari/605.1.15', pushNotificationsEnabled: false, biometricAuthEnabled: true, encryptionStatus: 'full' },
        ]);

        // Mock AI Insights based on potential issues
        setAiInsights([
            { 
                id: 'ai_001', 
                timestamp: pastDate(0.1), 
                severity: 'High', 
                summary: 'Unusual Data Access Pattern Detected', 
                recommendation: 'Review recent read operations from Device ID dvc_2 between 02:00 and 04:00 UTC. Initiate temporary read-only lock.', 
                sourceModel: 'BehavioralAnomaly_v3' 
            },
            { 
                id: 'ai_002', 
                timestamp: pastDate(1), 
                severity: 'Medium', 
                summary: 'Outdated OS Detected on Active Device', 
                recommendation: 'Update OS on "Legacy VM" (IP 192.168.1.100) to a supported version or isolate it to a sandbox network segment.', 
                sourceModel: 'VulnerabilityScanner_v1' 
            },
        ]);

        // Simulate loading security metrics if available
        if (securityMetrics && securityMetrics.length > 0) {
            const scoreMetric = securityMetrics.find(m => m.metricName === 'OverallSecurityScore');
            if (scoreMetric) {
                setSecurityScore(Math.round(parseFloat(scoreMetric.currentValue) * 100));
            }
        }

    }, [securityMetrics]);

    // --- Handlers ---
    const showNotification = useCallback((message: string, type: 'success' | 'error' | 'info' | 'warning' | 'critical') => {
        setNotification({ message, type, isVisible: true });
    }, []);

    const closeNotification = useCallback(() => {
        setNotification(prev => prev ? { ...prev, isVisible: false } : null);
    }, []);

    const handleUnlink = (id: string) => {
        if (unlinkAccount) {
            unlinkAccount(id);
            showNotification(`Financial Source ID ${id} successfully revoked access.`, 'success');
        }
    };

    const handlePolicyToggle = (policy: DataSharingPolicy, enabled: boolean) => {
        // In a real app, this would call an API to update the policy state
        console.log(`Policy ${policy.policyId} toggled to ${enabled}`);
        showNotification(`Data Sharing Policy "${policy.policyName}" updated to ${enabled ? 'Active' : 'Inactive'}.`, 'info');
    };

    const handleAPIKeyRevoke = (keyId: string) => {
        // In a real app, this would call an API to revoke the key
        showNotification(`API Key ${keyId.substring(0, 8)}... has been immediately revoked and invalidated.`, 'critical');
    };

    // --- Render Helpers ---

    const renderLinkedAccounts = useMemo(() => (
        <Card title="Financial Data Sources (Plaid Integration)" className="lg:col-span-2">
            <div className="space-y-4">
                <p className="text-gray-400 text-sm border-b border-gray-800 pb-3">Securely manage connections to external financial institutions via encrypted tokenization. Last sync: {new Date().toLocaleTimeString()}</p>
                {linkedAccounts && linkedAccounts.length > 0 ? (
                    <div className="space-y-3">
                        {linkedAccounts.map(account => (
                            <div key={account.id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 bg-gray-800/70 rounded-lg border border-cyan-700/50 shadow-md">
                                <div className="flex items-center mb-2 sm:mb-0">
                                    <div className="w-12 h-12 rounded-xl bg-cyan-900/70 flex items-center justify-center text-cyan-300 mr-4 flex-shrink-0">
                                        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" /></svg>
                                    </div>
                                    <div>
                                        <p className="font-bold text-lg text-white">{account.name}</p>
                                        <p className="text-sm text-gray-400">Institution ID: {account.institutionId} | Mask: {account.mask}</p>
                                    </div>
                                </div>
                                <div className="flex space-x-2 mt-2 sm:mt-0">
                                    <button 
                                        onClick={() => showNotification(`Initiating re-authentication for ${account.name}...`, 'info')}
                                        className="px-3 py-1.5 bg-indigo-900/30 hover:bg-indigo-900/50 text-indigo-300 rounded-lg text-sm transition-colors border border-indigo-700"
                                    >
                                        Re-sync
                                    </button>
                                    <button 
                                        onClick={() => handleUnlink(account.id)}
                                        className="px-3 py-1.5 bg-red-900/50 hover:bg-red-900/70 text-red-300 rounded-lg text-sm transition-colors border border-red-700"
                                    >
                                        Revoke Access
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="p-6 bg-gray-800/50 rounded-lg text-center border border-dashed border-gray-700">
                        <p className="text-gray-500 italic mb-3">No external financial data sources are currently integrated.</p>
                        {handlePlaidSuccess && <PlaidLinkButton onSuccess={handlePlaidSuccess} label="Connect New Financial Source" className="w-full sm:w-auto" />}
                    </div>
                )}
            </div>
        </Card>
    ), [linkedAccounts, handlePlaidSuccess, handleUnlink, showNotification]);

    const renderSecuritySettings = useMemo(() => (
        <Card title="Core Authentication & Access Controls" className="lg:col-span-1">
            <ul className="divide-y divide-gray-700/50">
                <SecuritySettingToggle 
                    id="2fa_quantum"
                    title="Quantum 2FA (Hardware Key Required)" 
                    description="Mandatory FIDO2/WebAuthn hardware key enforcement for all administrative roles. Software TOTP is deprecated." 
                    defaultChecked={true} 
                    aiImpact='High'
                />
                <SecuritySettingToggle 
                    id="biometric_device"
                    title="Device Biometric Trust" 
                    description="Enforce device-level biometric verification for any transaction exceeding $10,000 or configuration change." 
                    defaultChecked={true} 
                    aiImpact='Medium'
                />
                <SecuritySettingToggle 
                    id="session_timeout"
                    title="Zero-Trust Session Invalidation" 
                    description="Sessions automatically terminate after 15 minutes of inactivity, requiring re-authentication via context-aware challenge." 
                    defaultChecked={true} 
                    aiImpact='High'
                />
                <li className="py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-gray-800/70">
                     <div className="flex-grow">
                        <span className="font-bold text-lg text-white flex items-center">Master Credential Management</span>
                        <p className="text-sm text-gray-400">Last rotation: 2024-01-15. Next mandatory rotation: 2025-01-15.</p>
                     </div>
                     <button className="px-6 py-2 bg-indigo-700 hover:bg-indigo-600 text-white font-semibold rounded-lg text-sm transition-colors shadow-lg mt-2 sm:mt-0">
                        Initiate Credential Rotation Protocol
                     </button>
                </li>
            </ul>
        </Card>
    ), []);

    const renderRecentActivity = useMemo(() => (
        <Card title="Real-Time Login Telemetry" className="lg:col-span-1">
            <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                {loginActivity.map(activity => (
                    <div key={activity.id} className="flex items-start justify-between p-3 bg-gray-800/50 rounded-lg border-l-4 border-gray-700 hover:bg-gray-700/50 transition-colors">
                        <div className="flex-grow min-w-0">
                            <p className="font-bold text-white truncate flex items-center gap-2">
                                {activity.device}
                                {activity.isCurrent && <span className="px-2 py-0.5 bg-green-600/50 text-green-200 text-xs rounded-full font-medium flex-shrink-0">LIVE SESSION</span>}
                            </p>
                            <p className="text-xs text-gray-400 mt-1">
                                <span className="font-mono bg-gray-700/50 px-1 rounded mr-1">{activity.ip}</span> 
                                @ {activity.location} ({activity.os})
                            </p>
                        </div>
                        <span className="text-xs text-gray-500 ml-2 flex-shrink-0">{new Date(activity.timestamp).toLocaleTimeString()}</span>
                    </div>
                ))}
            </div>
        </Card>
    ), [loginActivity]);

    const renderActiveDevices = useMemo(() => (
        <Card title="Managed Endpoints Inventory" className="lg:col-span-2">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {devices.map(device => (
                    <div key={device.id} className="p-4 bg-gray-800/50 rounded-lg border border-indigo-700/50 flex flex-col shadow-lg">
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-indigo-900/70 rounded-lg flex items-center justify-center text-indigo-300 flex-shrink-0">
                                    {device.type === 'Mobile' ? (
                                         <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
                                    ) : (
                                         <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                                    )}
                                </div>
                                <p className="font-bold text-white truncate">{device.name}</p>
                            </div>
                            <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${device.status === 'active' ? 'bg-green-600/30 text-green-300' : 'bg-red-600/30 text-red-300'}`}>
                                {device.status.toUpperCase()}
                            </span>
                        </div>
                        <p className="text-xs text-gray-400 mb-2">Model: {device.model} ({device.type})</p>
                        <p className="text-xs text-gray-500 truncate">IP: {device.ip} | Last Seen: {new Date(device.lastActivity).toLocaleTimeString()}</p>
                        <div className="mt-3 pt-2 border-t border-gray-700">
                            <p className="text-xs font-semibold text-cyan-400">Permissions Granted: {device.permissions.length}</p>
                            <div className="flex flex-wrap gap-1 mt-1">
                                {device.permissions.slice(0, 3).map(p => (
                                    <span key={p} className="text-[10px] bg-gray-700 text-gray-300 px-1 rounded">{p}</span>
                                ))}
                                {device.permissions.length > 3 && <span className="text-[10px] text-gray-500">+{device.permissions.length - 3} more</span>}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </Card>
    ), [devices]);

    const renderDataPolicies = useMemo(() => (
        <Card title="Data Governance & Sharing Policies" className="lg:col-span-2">
            <p className="text-sm text-gray-400 mb-4">Define granular controls over how internal and external data sets are processed, stored, and shared. Managed by AI Policy Engine.</p>
            <div className="space-y-4">
                {(dataSharingPolicies || []).map(policy => (
                    <div key={policy.policyId} className="p-4 bg-gray-800/70 rounded-lg border border-purple-700/50 flex flex-col md:flex-row justify-between items-start md:items-center">
                        <div className="flex-grow mb-2 md:mb-0">
                            <p className="font-bold text-white text-lg">{policy.policyName}</p>
                            <p className="text-xs text-gray-400 mt-1">Scope: {policy.scope} | Last Reviewed: {policy.lastReviewed}</p>
                        </div>
                        <div className="flex items-center space-x-4">
                            <span className={`text-sm font-semibold ${policy.isActive ? 'text-green-400' : 'text-red-400'}`}>
                                {policy.isActive ? 'ACTIVE' : 'DRAFT'}
                            </span>
                            <SecuritySettingToggle
                                id={`policy-${policy.policyId}`}
                                title="Enable Policy"
                                description={`Toggle activation for ${policy.policyName}`}
                                defaultChecked={policy.isActive}
                                onToggle={(checked) => handlePolicyToggle(policy, checked)}
                                aiImpact='Medium'
                            />
                        </div>
                    </div>
                ))}
            </div>
        </Card>
    ), [dataSharingPolicies, handlePolicyToggle]);

    const renderAPIKeys = useMemo(() => (
        <Card title="System API Key Management" className="lg:col-span-2">
            <p className="text-sm text-gray-400 mb-4">Manage programmatic access tokens. Keys are automatically rotated by the Quantum Key Vault every 90 days.</p>
            <div className="space-y-3">
                {(apiKeys || []).map(key => (
                    <div key={key.id} className="flex justify-between items-center p-3 bg-gray-800/70 rounded-lg border border-yellow-700/50">
                        <div className="flex items-center min-w-0">
                            <svg className="w-5 h-5 text-yellow-400 mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M6 16h.01" /></svg>
                            <div>
                                <p className="font-mono text-sm text-white truncate">{key.keyName} ({key.id.substring(0, 8)}...)</p>
                                <p className="text-xs text-gray-500">Created: {key.creationDate} | Permissions: {key.scopes.join(', ')}</p>
                            </div>
                        </div>
                        <button 
                            onClick={() => handleAPIKeyRevoke(key.id)}
                            className="px-3 py-1 bg-red-900/30 hover:bg-red-900/50 text-red-300 rounded-md text-xs transition-colors flex-shrink-0 ml-4"
                        >
                            Revoke Now
                        </button>
                    </div>
                ))}
            </div>
        </Card>
    ), [apiKeys, handleAPIKeyRevoke]);

    const renderAIAnalysis = useMemo(() => (
        <div className="space-y-6">
            <Card title={`AI Threat Intelligence Feed (${AI_INSIGHT_ENGINE_VERSION})`}>
                <div className="flex justify-between items-center mb-4 border-b border-gray-800 pb-3">
                    <p className="text-gray-400 text-sm">Real-time behavioral analysis and predictive threat modeling.</p>
                    <span className="text-sm font-bold text-cyan-400">Total Insights: {aiInsights.length}</span>
                </div>
                <div className="space-y-4">
                    {aiInsights.length > 0 ? (
                        aiInsights.map(insight => (
                            <AISecurityInsightCard key={insight.id} insight={insight} />
                        ))
                    ) : (
                        <div className="p-6 bg-gray-800/50 rounded-lg text-center border border-dashed border-gray-700">
                            <p className="text-gray-500 italic">AI Engine reports no immediate high-priority anomalies at this time.</p>
                        </div>
                    )}
                </div>
            </Card>

            <Card title="Security Awareness Training Modules">
                <p className="text-sm text-gray-400 mb-4">Track mandatory compliance training completion status across the organization.</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {(securityAwarenessModules || []).map(module => (
                        <div key={module.moduleId} className="p-4 bg-gray-800/70 rounded-lg border border-green-700/50">
                            <p className="font-bold text-white">{module.title}</p>
                            <p className="text-xs text-gray-400 mt-1">Status: {module.completionRate}% Complete</p>
                            <div className="w-full bg-gray-700 rounded-full h-2.5 mt-2">
                                <div className="bg-green-500 h-2.5 rounded-full" style={{ width: `${module.completionRate}%` }}></div>
                            </div>
                        </div>
                    ))}
                </div>
            </Card>
        </div>
    ), [aiInsights, securityAwarenessModules]);

    const renderAuditLogs = useMemo(() => {
        const displayLogs = (auditLogs || []).slice(0, MAX_AUDIT_LOG_DISPLAY);
        return (
            <Card title={`System Audit Trail (Last ${displayLogs.length} Entries)`} className="lg:col-span-2">
                <p className="text-sm text-gray-400 mb-3">Immutable record of all configuration changes, data access events, and administrative actions.</p>
                <div className="overflow-x-auto max-h-[500px] custom-scrollbar">
                    <table className="min-w-full divide-y divide-gray-700">
                        <thead className="sticky top-0 bg-gray-800 z-10">
                            <tr>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Time</th>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">User/System</th>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Action</th>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Target</th>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-800">
                            {displayLogs.map((log: AuditLogEntry) => (
                                <tr key={log.id} className="hover:bg-gray-800/50 transition-colors">
                                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">{new Date(log.timestamp).toLocaleTimeString()}</td>
                                    <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-white">{log.userId.includes('sys_') ? 'SYSTEM' : log.userId}</td>
                                    <td className="px-4 py-2 text-sm text-cyan-400">{log.action}</td>
                                    <td className="px-4 py-2 text-sm text-gray-400">{log.targetResource}</td>
                                    <td className="px-4 py-2 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${log.success ? 'bg-green-900/50 text-green-300' : 'bg-red-900/50 text-red-300'}`}>
                                            {log.success ? 'SUCCESS' : 'FAILURE'}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {displayLogs.length < (auditLogs?.length || 0) && (
                    <p className="text-center text-sm text-gray-500 mt-3">Displaying first {MAX_AUDIT_LOG_DISPLAY} logs. Load full history via dedicated Audit Console.</p>
                )}
            </Card>
        );
    }, [auditLogs]);

    const renderSecurityScoreGauge = useMemo(() => {
        const radius = 50;
        const circumference = 2 * Math.PI * radius;
        const offset = circumference - (securityScore / 100) * circumference;
        const color = securityScore >= 90 ? 'stroke-green-500' : securityScore >= 70 ? 'stroke-yellow-500' : 'stroke-red-500';

        return (
            <div className="flex flex-col items-center p-6 bg-gray-800/70 rounded-xl shadow-inner border border-gray-700">
                <h3 className="text-xl font-bold text-white mb-3">Quantum Security Index (QSI)</h3>
                <svg width="120" height="120" viewBox="0 0 120 120" className="transform -rotate-90">
                    {/* Background Circle */}
                    <circle
                        cx="60"
                        cy="60"
                        r={radius}
                        fill="transparent"
                        stroke="#374151"
                        strokeWidth="10"
                    />
                    {/* Progress Arc */}
                    <circle
                        cx="60"
                        cy="60"
                        r={radius}
                        fill="transparent"
                        stroke={color.replace('stroke-', '')}
                        strokeWidth="10"
                        strokeDasharray={circumference}
                        strokeDashoffset={offset}
                        strokeLinecap="round"
                        className="transition-all duration-1000 ease-out"
                    />
                    {/* Text */}
                    <text
                        x="60"
                        y="60"
                        dominantBaseline="middle"
                        textAnchor="middle"
                        className="fill-current text-white"
                        fontSize="20"
                        fontWeight="bold"
                    >
                        {securityScore}%
                    </text>
                </svg>
                <p className="text-sm text-gray-400 mt-2">Target: 95%</p>
            </div>
        );
    }, [securityScore]);

    const renderTrustedContacts = useMemo(() => (
        <Card title="Emergency Trusted Contacts" className="lg:col-span-1">
            <p className="text-sm text-gray-400 mb-4">Contacts authorized for emergency account recovery or high-risk alerts.</p>
            <div className="space-y-3">
                {(trustedContacts || []).map((contact: TrustedContact) => (
                    <div key={contact.id} className="flex justify-between items-center p-3 bg-gray-800/50 rounded-lg border border-gray-700">
                        <div className="flex items-center">
                            <div className="w-8 h-8 bg-pink-900/50 rounded-full flex items-center justify-center text-pink-300 mr-3">
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                            </div>
                            <div>
                                <p className="font-semibold text-white">{contact.name}</p>
                                <p className="text-xs text-gray-400">{contact.relationship}</p>
                            </div>
                        </div>
                        <span className={`text-xs font-medium px-2 py-0.5 rounded ${contact.verified ? 'bg-green-900/30 text-green-400' : 'bg-red-900/30 text-red-400'}`}>
                            {contact.verified ? 'Verified' : 'Pending'}
                        </span>
                    </div>
                ))}
            </div>
        </Card>
    ), [trustedContacts]);


    // --- Tab Content Rendering ---
    const renderContent = () => {
        switch (activeTab) {
            case 'overview':
                return (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {renderSecurityScoreGauge}
                        {renderRecentActivity}
                        {renderActiveDevices}
                        {renderLinkedAccounts}
                        {renderSecuritySettings}
                    </div>
                );
            case 'policies':
                return (
                    <div className="grid grid-cols-1 gap-6">
                        {renderDataPolicies}
                        <Card title="Transaction Rule Engine" className="lg:col-span-2">
                            <p className="text-sm text-gray-400 mb-4">Define automated responses to financial events based on predefined risk thresholds.</p>
                            <div className="space-y-3">
                                {(transactionRules || []).map((rule: TransactionRule) => (
                                    <div key={rule.ruleId} className="p-3 bg-gray-800/70 rounded-lg border border-cyan-700/50 flex justify-between items-center">
                                        <div>
                                            <p className="font-bold text-white">{rule.name}</p>
                                            <p className="text-xs text-gray-400">Trigger: {rule.triggerCondition} | Action: {rule.action}</p>
                                        </div>
                                        <span className={`text-xs font-medium px-2 py-0.5 rounded ${rule.isEnabled ? 'bg-green-900/30 text-green-400' : 'bg-red-900/30 text-red-400'}`}>
                                            {rule.isEnabled ? 'ACTIVE' : 'DISABLED'}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    </div>
                );
            case 'keys':
                return (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {renderAPIKeys}
                        {renderTrustedContacts}
                        <Card title="Threat Alert History" className="lg:col-span-3">
                            <p className="text-sm text-gray-400 mb-4">Historical record of confirmed security incidents.</p>
                            <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                                {(threatAlerts || []).map((alert: ThreatAlert) => (
                                    <div key={alert.alertId} className="p-3 bg-red-900/30 rounded-lg border border-red-600 flex justify-between items-center">
                                        <div>
                                            <p className="font-bold text-red-300">{alert.title}</p>
                                            <p className="text-xs text-gray-300">{alert.description}</p>
                                        </div>
                                        <span className="text-xs text-gray-300">{new Date(alert.timestamp).toLocaleDateString()}</span>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    </div>
                );
            case 'ai_analysis':
                return (
                    <div className="grid grid-cols-1 gap-6">
                        {renderAIAnalysis}
                        {renderAuditLogs}
                    </div>
                );
            default:
                return null;
        }
    };

    // --- Tab Navigation ---
    const tabs: { id: typeof activeTab, label: string }[] = [
        { id: 'overview', label: 'Overview & Access' },
        { id: 'policies', label: 'Governance & Rules' },
        { id: 'keys', label: 'API & Contacts' },
        { id: 'ai_analysis', label: 'AI Threat Analysis' },
    ];

    return (
        <div className="space-y-8 p-4 sm:p-8">
            <header className="pb-4 border-b border-gray-700">
                <h1 className="text-4xl font-extrabold text-white tracking-tighter">Enterprise Security Command Center</h1>
                <p className="text-lg text-gray-400 mt-1">Centralized control plane for data integrity, access management, and threat mitigation. Engine Version: {AI_INSIGHT_ENGINE_VERSION}</p>
            </header>

            {/* Tab Navigation */}
            <div className="flex border-b border-gray-700 overflow-x-auto">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`px-6 py-3 text-lg font-semibold transition-all duration-300 whitespace-nowrap
                            ${activeTab === tab.id 
                                ? 'text-cyan-400 border-b-4 border-cyan-500' 
                                : 'text-gray-400 hover:text-white hover:border-b-4 hover:border-gray-600'
                            }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            <main>
                {renderContent()}
            </main>

            {notification && (
                <NotificationToast 
                    message={notification.message} 
                    type={notification.type} 
                    isVisible={notification.isVisible} 
                    onClose={closeNotification} 
                />
            )}
        </div>
    );
};

export default SecurityView;


================================================================================
// APPENDED FROM REPO: diplomat-bit/Fuckyou | ORIGINAL PATH: diplomat-bit-Fuckyou-70f83c5/components/SecurityView (5).tsx
================================================================================

import React, { useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { DataContext } from '../context/DataContext';
import Card from './Card';
import PlaidLinkButton from './PlaidLinkButton';
import { 
    LoginActivity, Device, DataSharingPolicy, TransactionRule, ThreatAlert, 
    AuditLogEntry, APIKey, TrustedContact, SecurityAwarenessModule, SecurityScoreMetric, UserProfile 
} from '../types';

// --- AI/ML & Future Tech Integration Placeholder Types (Massively Expanded) ---
interface AISecurityInsight {
    id: string;
    timestamp: string;
    severity: 'Low' | 'Medium' | 'High' | 'Critical';
    summary: string;
    recommendation: string;
    sourceModel: string;
    relatedEntities: string[]; // e.g., ['dvc_1', 'user_abc']
}

interface HFTAlgorithmRule {
    id: string;
    name: string;
    description: string;
    targetAlgorithm: string;
    condition: string;
    action: 'PAUSE_ALGO' | 'ALERT_ONLY' | 'THROTTLE_ORDERS' | 'EXECUTE_COUNTER_TRADE';
    isEnabled: boolean;
    lastTriggered: string | null;
}

interface QuantumEncryptionStatus {
    id: string;
    systemComponent: string;
    algorithm: 'NTRU-HPS' | 'Kyber' | 'Dilithium' | 'SPHINCS+' | 'Legacy (RSA-4096)';
    status: 'MIGRATED' | 'PENDING' | 'AT_RISK' | 'FAILED';
    migrationEta: string;
    quantumThreatVector: string;
}

interface SecurityIncident {
    id: string;
    title: string;
    severity: 'Low' | 'Medium' | 'High' | 'Critical';
    status: 'Open' | 'Investigating' | 'Resolved' | 'Contained';
    reportedBy: string;
    timestamp: string;
    assignedTo: string;
    summary: string;
}

// --- GEIN (Global Enterprise Intelligence Network) Types ---
interface GEINStreamChunk {
    id: string;
    timestamp: string;
    sourceNode: string;
    dataType: 'TRANSACTION' | 'LOG' | 'THREAT_SIG' | 'USER_BEHAVIOR' | 'NETWORK_PACKET';
    payload: string;
    geinScore: number; // 0-1 confidence score of relevance
}

interface GEINConsoleMessage {
    id: string;
    role: 'user' | 'gein' | 'system';
    text: string;
    isStreaming?: boolean;
}

interface CognitiveCoreStatus {
    name: string;
    status: 'NOMINAL' | 'DEGRADED' | 'OFFLINE' | 'THINKING';
    load: number; // Percentage
    primaryTask: string;
}

// --- Constants for Billion Dollar Features ---
const AI_INSIGHT_ENGINE_VERSION = "GEIN Cognitive Engine v3.0-Hydra";
const MAX_AUDIT_LOG_DISPLAY = 10;
const GLOBAL_LOCKDOWN_STATE = false; // Simulated global state

// --- Helper Components ---

export const SecuritySettingToggle: React.FC<{
    id: string;
    title: string;
    description: string;
    defaultChecked: boolean;
    onToggle?: (checked: boolean) => void;
    disabled?: boolean;
    aiImpact?: 'High' | 'Medium' | 'Low' | 'None';
}> = ({ id, title, description, defaultChecked, onToggle, disabled, aiImpact = 'None' }) => {
    const [isChecked, setIsChecked] = useState(defaultChecked);
    const { showSystemAlert } = useContext(DataContext) || {};

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newState = e.target.checked;
        setIsChecked(newState);
        onToggle && onToggle(newState);
        
        if (showSystemAlert) {
            const impactColor = aiImpact === 'High' ? 'text-red-400' : aiImpact === 'Medium' ? 'text-yellow-400' : 'text-green-400';
            showSystemAlert(`Configuration Change Detected: ${title} set to ${newState ? 'Enabled' : 'Disabled'}. AI Risk Assessment: ${aiImpact}.`, 'info');
        }
    };

    const aiIndicator = useMemo(() => {
        if (aiImpact === 'None') return null;
        const colorMap = {
            High: 'bg-red-500',
            Medium: 'bg-yellow-500',
            Low: 'bg-blue-500',
        };
        return (
            <span className={`ml-3 px-2 py-0.5 text-xs font-bold rounded-full text-white ${colorMap[aiImpact]}`}>
                AI {aiImpact}
            </span>
        );
    }, [aiImpact]);

    return (
        <li className="py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-gray-800/70">
            <div className="flex-grow">
                <label htmlFor={`toggle-${id}`} className="font-bold text-lg text-white cursor-pointer flex items-center">
                    {title}
                    {aiIndicator}
                </label>
                <p className="text-sm text-gray-400 max-w-xl mt-1">{description}</p>
            </div>
            <div className="flex items-center mt-2 sm:mt-0">
                <span className={`mr-3 text-sm font-medium ${isChecked ? 'text-green-400' : 'text-red-400'}`}>
                    {isChecked ? 'ACTIVE' : 'INACTIVE'}
                </span>
                <input
                    type="checkbox"
                    id={`toggle-${id}`}
                    className="toggle toggle-cyan toggle-lg"
                    checked={isChecked}
                    onChange={handleChange}
                    disabled={disabled}
                    aria-label={`Toggle for ${title}`}
                />
            </div>
        </li>
    );
};

export const NotificationToast: React.FC<{
    message: string;
    type: 'success' | 'error' | 'info' | 'warning' | 'critical';
    onClose: () => void;
    isVisible: boolean;
}> = ({ message, type, onClose, isVisible }) => {
    const typeClasses = {
        success: 'bg-green-700 border-green-500',
        error: 'bg-red-700 border-red-500',
        info: 'bg-blue-700 border-blue-500',
        warning: 'bg-yellow-700 border-yellow-500',
        critical: 'bg-purple-800 border-purple-500'
    };
    
    const iconMap = {
        success: <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
        error: <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
        info: <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
        warning: <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.938 5.002c-.77-1.333-2.688-1.333-3.458 0L3.308 18.002c-.77 1.333.192 3 1.732 3z" /></svg>,
        critical: <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.938 5.002c-.77-1.333-2.688-1.333-3.458 0L3.308 18.002c-.77 1.333.192 3 1.732 3z" /></svg>
    };

    useEffect(() => {
        let timer: ReturnType<typeof setTimeout>;
        if (isVisible) {
            const duration = type === 'critical' ? 15000 : 7000;
            timer = setTimeout(() => { onClose(); }, duration);
        }
        return () => clearTimeout(timer);
    }, [isVisible, onClose, type]);

    if (!isVisible) return null;
    return (
        <div className={`fixed bottom-8 right-8 p-5 rounded-xl shadow-2xl text-white flex items-start space-x-4 transition-all duration-500 ease-out transform border-l-8 ${typeClasses[type]} ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'}`} style={{zIndex: 1000, minWidth: '300px'}}>
            <div className="flex-shrink-0 mt-1">
                {iconMap[type]}
            </div>
            <div className="flex-grow">
                <span className="text-sm font-bold block capitalize">{type} Alert</span>
                <span className="text-base font-medium">{message}</span>
            </div>
            <button onClick={onClose} className="p-1 rounded-full hover:bg-black/20 focus:outline-none flex-shrink-0 mt-0.5 transition-colors">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
        </div>
    );
};

const AISecurityInsightCard: React.FC<{ insight: AISecurityInsight }> = ({ insight }) => {
    const severityClasses = {
        Critical: 'border-red-600 bg-red-900/20 text-red-300',
        High: 'border-orange-600 bg-orange-900/20 text-orange-300',
        Medium: 'border-yellow-600 bg-yellow-900/20 text-yellow-300',
        Low: 'border-green-600 bg-green-900/20 text-green-300',
    };

    return (
        <div className={`p-4 rounded-xl border-l-4 shadow-lg transition-all duration-300 hover:shadow-xl ${severityClasses[insight.severity]}`}>
            <div className="flex justify-between items-start mb-2">
                <h4 className="font-extrabold text-lg">{insight.summary}</h4>
                <span className={`text-xs font-semibold px-2 py-1 rounded-full ${severityClasses[insight.severity].replace('border-', 'bg-').replace('/20', '/40')}`}>{insight.severity}</span>
            </div>
            <p className="text-sm text-gray-300 mb-3">{insight.recommendation}</p>
            <div className="text-xs text-gray-400 flex justify-between border-t border-current pt-2 mt-2">
                <span>Engine: {insight.sourceModel}</span>
                <span>Detected: {new Date(insight.timestamp).toLocaleString()}</span>
            </div>
        </div>
    );
};

// --- Main Component ---

const SecurityView: React.FC = () => {
    const context = useContext(DataContext);
    const { 
        linkedAccounts, unlinkAccount, handlePlaidSuccess, 
        securityMetrics, auditLogs, threatAlerts, 
        dataSharingPolicies, apiKeys, trustedContacts, 
        securityAwarenessModules, showSystemAlert 
    } = context || {};

    const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' | 'info' | 'warning' | 'critical'; isVisible: boolean } | null>(null);
    const [loginActivity, setLoginActivity] = useState<LoginActivity[]>([]);
    const [devices, setDevices] = useState<Device[]>([]);
    const [aiInsights, setAiInsights] = useState<AISecurityInsight[]>([]);
    const [hftRules, setHftRules] = useState<HFTAlgorithmRule[]>([]);
    const [quantumStatuses, setQuantumStatuses] = useState<QuantumEncryptionStatus[]>([]);
    const [incidents, setIncidents] = useState<SecurityIncident[]>([]);
    const [activeTab, setActiveTab] = useState<'overview' | 'policies' | 'keys' | 'ai_analysis' | 'hft' | 'quantum' | 'incidents' | 'gein_command'>('overview');
    const [securityScore, setSecurityScore] = useState<number>(75);

    // --- GEIN State ---
    const [geinConsoleHistory, setGeinConsoleHistory] = useState<GEINConsoleMessage[]>([]);
    const [geinInputStream, setGeinInputStream] = useState<GEINStreamChunk[]>([]);
    const [geinSystemInstruction, setGeinSystemInstruction] = useState<string>("You are GEIN, a global enterprise intelligence network. Your purpose is to provide unparalleled, real-time security analysis with a focus on predictive threat mitigation. Be concise, authoritative, and data-driven.");
    const [geinThinkingBudget, setGeinThinkingBudget] = useState<number>(5000); // Default budget
    const [cognitiveCores, setCognitiveCores] = useState<CognitiveCoreStatus[]>([]);
    const [geinConsoleInput, setGeinConsoleInput] = useState<string>("");

    // --- Mock Data Initialization & AI Simulation ---
    useEffect(() => {
        const now = new Date();
        const pastDate = (days: number) => new Date(now.getTime() - days * 24 * 60 * 60 * 1000).toISOString();

        setLoginActivity([
            { id: '1', device: 'Quantum Workstation', browser: 'Chrome 125 (Secure)', os: 'Linux Kernel 6.8', location: 'HQ Server Room', ip: '10.0.0.5', timestamp: pastDate(0.01), isCurrent: true, userAgent: 'EnterpriseAgent/1.0' },
            { id: '2', device: 'Personal Mobile', browser: 'Safari', os: 'iOS 18.0 Beta', location: 'Remote Office', ip: '203.0.113.45', timestamp: pastDate(1.5), isCurrent: false, userAgent: 'MobileSafari/605.1.15' },
            { id: '3', device: 'Legacy VM', browser: 'IE 11', os: 'Windows Server 2012', location: 'Decommissioned Zone', ip: '192.168.1.100', timestamp: pastDate(15), isCurrent: false, userAgent: 'MSIE 11.0;' },
        ]);

        setDevices([
            { id: 'dvc_1', name: 'Primary Workstation', type: 'Desktop', model: 'Custom Build X9', lastActivity: pastDate(0.01), location: 'HQ Server Room', ip: '10.0.0.5', isCurrent: true, permissions: ['read_all', 'write_transactions', 'admin_config'], status: 'active', firstSeen: pastDate(500), userAgent: 'EnterpriseAgent/1.0', pushNotificationsEnabled: true, biometricAuthEnabled: true, encryptionStatus: 'AES-256-GCM' },
            { id: 'dvc_2', name: 'Executive Tablet', type: 'Tablet', model: 'Pad Pro 14', lastActivity: pastDate(0.5), location: 'Remote Office', ip: '203.0.113.45', isCurrent: false, permissions: ['read_reports'], status: 'active', firstSeen: pastDate(120), userAgent: 'MobileSafari/605.1.15', pushNotificationsEnabled: false, biometricAuthEnabled: true, encryptionStatus: 'full' },
        ]);

        setAiInsights([
            { id: 'ai_001', timestamp: pastDate(0.1), severity: 'High', summary: 'Unusual Data Access Pattern Detected', recommendation: 'Review recent read operations from Device ID dvc_2 between 02:00 and 04:00 UTC. Initiate temporary read-only lock.', sourceModel: 'BehavioralAnomaly_v3', relatedEntities: ['dvc_2'] },
            { id: 'ai_002', timestamp: pastDate(1), severity: 'Medium', summary: 'Outdated OS Detected on Active Device', recommendation: 'Update OS on "Legacy VM" (IP 192.168.1.100) to a supported version or isolate it to a sandbox network segment.', sourceModel: 'VulnerabilityScanner_v1', relatedEntities: ['dvc_3'] },
            { id: 'ai_003', timestamp: pastDate(2), severity: 'Critical', summary: 'Potential HFT Algo Manipulation Detected', recommendation: 'Circuit breaker triggered for "MomentumBot_v9". Review order book for spoofing patterns. All related API keys have been frozen.', sourceModel: 'MarketIntegrity_v4', relatedEntities: ['hft_rule_1', 'api_key_2'] },
        ]);

        setHftRules([
            { id: 'hft_rule_1', name: 'Flash Crash Circuit Breaker', description: 'Automatically pauses all trading algorithms if market index drops > 5% in 2 minutes.', targetAlgorithm: 'All', condition: 'INDEX_DROP > 5%', action: 'PAUSE_ALGO', isEnabled: true, lastTriggered: pastDate(2) },
            { id: 'hft_rule_2', name: 'Latency Anomaly Alert', description: 'Alerts trading desk if order execution latency exceeds 10ms for any algorithm.', targetAlgorithm: 'All', condition: 'LATENCY > 10ms', action: 'ALERT_ONLY', isEnabled: true, lastTriggered: pastDate(0.2) },
            { id: 'hft_rule_3', name: 'Counter-Trade on Spoofing', description: 'Executes a small counter-trade if AI detects high-confidence order book spoofing.', targetAlgorithm: 'MarketMaker_v3', condition: 'AI_SPOOF_CONFIDENCE > 0.95', action: 'EXECUTE_COUNTER_TRADE', isEnabled: false, lastTriggered: null },
        ]);

        setQuantumStatuses([
            { id: 'qs_1', systemComponent: 'Core Transaction Ledger', algorithm: 'Dilithium', status: 'MIGRATED', migrationEta: 'Complete', quantumThreatVector: 'Shor\'s Algorithm' },
            { id: 'qs_2', systemComponent: 'API Key Vault', algorithm: 'Kyber', status: 'PENDING', migrationEta: 'Q3 2025', quantumThreatVector: 'Shor\'s Algorithm' },
            { id: 'qs_3', systemComponent: 'User Authentication DB', algorithm: 'NTRU-HPS', status: 'MIGRATED', migrationEta: 'Complete', quantumThreatVector: 'Grover\'s Algorithm' },
            { id: 'qs_4', systemComponent: 'Legacy Reporting System', algorithm: 'Legacy (RSA-4096)', status: 'AT_RISK', migrationEta: 'Q1 2026', quantumThreatVector: 'Shor\'s Algorithm' },
        ]);

        setIncidents([
            { id: 'inc_1', title: 'Phishing Attempt on Executive Account', severity: 'Medium', status: 'Resolved', reportedBy: 'user_jane_doe', timestamp: pastDate(5), assignedTo: 'secops_team_a', summary: 'Targeted phishing email detected and blocked. User credentials rotated as a precaution.' },
            { id: 'inc_2', title: 'DDoS Attack on Public API Gateway', severity: 'High', status: 'Contained', reportedBy: 'SYSTEM_MONITOR', timestamp: pastDate(1), assignedTo: 'netops_team', summary: 'Volumetric attack mitigated by cloud provider. Monitoring for residual effects.' },
        ]);

        // GEIN Initialization
        setGeinConsoleHistory([{ id: 'init', role: 'system', text: 'GEIN Cognitive Engine v3.0-Hydra online. Awaiting operator command.' }]);
        setCognitiveCores([
            { name: 'Predictive Analytics', status: 'NOMINAL', load: 78, primaryTask: 'Market Volatility Forecasting' },
            { name: 'Threat Correlation', status: 'NOMINAL', load: 65, primaryTask: 'Cross-referencing Dark Web Intel' },
            { name: 'Quantum Heuristics', status: 'NOMINAL', load: 42, primaryTask: 'Simulating PQC Algorithm Failure Modes' },
            { name: 'Behavioral Biometrics', status: 'DEGRADED', load: 95, primaryTask: 'Re-calibrating User Keystroke Dynamics' },
        ]);

        if (securityMetrics && securityMetrics.length > 0) {
            const scoreMetric = securityMetrics.find(m => m.metricName === 'OverallSecurityScore');
            if (scoreMetric) setSecurityScore(Math.round(parseFloat(scoreMetric.currentValue) * 100));
        }

        // Simulate GEIN data stream
        const streamInterval = setInterval(() => {
            const dataTypes: GEINStreamChunk['dataType'][] = ['TRANSACTION', 'LOG', 'THREAT_SIG', 'USER_BEHAVIOR', 'NETWORK_PACKET'];
            const sources = ['LD4', 'AWS-US-EAST-1', 'HK-EXCHANGE', 'DARK-WEB-MONITOR', 'INTERNAL-AUDIT'];
            const newChunk: GEINStreamChunk = {
                id: `strm_${Date.now()}`,
                timestamp: new Date().toISOString(),
                sourceNode: sources[Math.floor(Math.random() * sources.length)],
                dataType: dataTypes[Math.floor(Math.random() * dataTypes.length)],
                payload: `0x${[...Array(16)].map(() => Math.floor(Math.random() * 16).toString(16)).join('')}`,
                geinScore: Math.random(),
            };
            setGeinInputStream(prev => [newChunk, ...prev.slice(0, 99)]);
        }, 1500);

        return () => clearInterval(streamInterval);

    }, [securityMetrics]);

    // --- Handlers ---
    const showNotification = useCallback((message: string, type: 'success' | 'error' | 'info' | 'warning' | 'critical') => {
        setNotification({ message, type, isVisible: true });
    }, []);

    const closeNotification = useCallback(() => {
        setNotification(prev => prev ? { ...prev, isVisible: false } : null);
    }, []);

    const handleUnlink = (id: string) => {
        if (unlinkAccount) {
            unlinkAccount(id);
            showNotification(`Financial Source ID ${id} successfully revoked access.`, 'success');
        }
    };

    const handlePolicyToggle = (policy: DataSharingPolicy, enabled: boolean) => {
        console.log(`Policy ${policy.policyId} toggled to ${enabled}`);
        showNotification(`Data Sharing Policy "${policy.policyName}" updated to ${enabled ? 'Active' : 'Inactive'}.`, 'info');
    };

    const handleAPIKeyRevoke = (keyId: string) => {
        showNotification(`API Key ${keyId.substring(0, 8)}... has been immediately revoked and invalidated.`, 'critical');
    };

    const handleGlobalLockdown = () => {
        const confirmation = window.confirm("CRITICAL ACTION: Are you sure you want to initiate Global Lockdown Protocol? This will immediately freeze all transactions, terminate all user sessions, and restrict API access.");
        if (confirmation) {
            showNotification("GLOBAL LOCKDOWN PROTOCOL INITIATED. System entering restricted state.", 'critical');
            // In a real app, this would trigger a series of critical API calls.
        }
    };

    const handleGeinQuery = async () => {
        if (!geinConsoleInput.trim()) return;

        const userMessage: GEINConsoleMessage = { id: `user_${Date.now()}`, role: 'user', text: geinConsoleInput };
        setGeinConsoleHistory(prev => [...prev, userMessage]);
        setGeinConsoleInput("");

        // Simulate GEIN "thinking" and streaming response
        const geinResponseId = `gein_${Date.now()}`;
        const thinkingMessage: GEINConsoleMessage = { id: geinResponseId, role: 'gein', text: '', isStreaming: true };
        setGeinConsoleHistory(prev => [...prev, thinkingMessage]);

        const responseChunks = [
            "Analyzing query against ",
            `${geinInputStream.length} real-time data points... `,
            "Correlating with active threat vectors... ",
            "CONFIRMED: The anomalous activity on dvc_2 correlates with a new zero-day exploit signature (CVE-2025-9999) detected by the Dark Web Monitor node. ",
            "RECOMMENDATION: Isolate dvc_2 immediately. ",
            "Execute containment protocol 'Chimera'. ",
            "I have already drafted the execution plan. Awaiting your authorization."
        ];

        let currentText = "";
        for (const chunk of responseChunks) {
            await new Promise(resolve => setTimeout(resolve, Math.random() * 200 + 50));
            currentText += chunk;
            setGeinConsoleHistory(prev => prev.map(msg => 
                msg.id === geinResponseId ? { ...msg, text: currentText } : msg
            ));
        }

        setGeinConsoleHistory(prev => prev.map(msg => 
            msg.id === geinResponseId ? { ...msg, isStreaming: false } : msg
        ));
    };

    // --- Render Helpers ---

    const renderLinkedAccounts = useMemo(() => (
        <Card title="Financial Data Sources (Plaid Integration)" className="lg:col-span-2">
            <div className="space-y-4">
                <p className="text-gray-400 text-sm border-b border-gray-800 pb-3">Securely manage connections to external financial institutions via encrypted tokenization. Last sync: {new Date().toLocaleTimeString()}</p>
                {linkedAccounts && linkedAccounts.length > 0 ? (
                    <div className="space-y-3">
                        {linkedAccounts.map(account => (
                            <div key={account.id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 bg-gray-800/70 rounded-lg border border-cyan-700/50 shadow-md">
                                <div className="flex items-center mb-2 sm:mb-0">
                                    <div className="w-12 h-12 rounded-xl bg-cyan-900/70 flex items-center justify-center text-cyan-300 mr-4 flex-shrink-0">
                                        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" /></svg>
                                    </div>
                                    <div>
                                        <p className="font-bold text-lg text-white">{account.name}</p>
                                        <p className="text-sm text-gray-400">Institution ID: {account.institutionId} | Mask: {account.mask}</p>
                                    </div>
                                </div>
                                <div className="flex space-x-2 mt-2 sm:mt-0">
                                    <button onClick={() => showNotification(`Initiating re-authentication for ${account.name}...`, 'info')} className="px-3 py-1.5 bg-indigo-900/30 hover:bg-indigo-900/50 text-indigo-300 rounded-lg text-sm transition-colors border border-indigo-700">Re-sync</button>
                                    <button onClick={() => handleUnlink(account.id)} className="px-3 py-1.5 bg-red-900/50 hover:bg-red-900/70 text-red-300 rounded-lg text-sm transition-colors border border-red-700">Revoke Access</button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="p-6 bg-gray-800/50 rounded-lg text-center border border-dashed border-gray-700">
                        <p className="text-gray-500 italic mb-3">No external financial data sources are currently integrated.</p>
                        {handlePlaidSuccess && <PlaidLinkButton onSuccess={handlePlaidSuccess} label="Connect New Financial Source" className="w-full sm:w-auto" />}
                    </div>
                )}
            </div>
        </Card>
    ), [linkedAccounts, handlePlaidSuccess, handleUnlink, showNotification]);

    const renderSecuritySettings = useMemo(() => (
        <Card title="Core Authentication & Access Controls" className="lg:col-span-1">
            <ul className="divide-y divide-gray-700/50">
                <SecuritySettingToggle id="2fa_quantum" title="Quantum 2FA (Hardware Key Required)" description="Mandatory FIDO2/WebAuthn hardware key enforcement for all administrative roles. Software TOTP is deprecated." defaultChecked={true} aiImpact='High' />
                <SecuritySettingToggle id="biometric_device" title="Device Biometric Trust" description="Enforce device-level biometric verification for any transaction exceeding $10,000 or configuration change." defaultChecked={true} aiImpact='Medium' />
                <SecuritySettingToggle id="session_timeout" title="Zero-Trust Session Invalidation" description="Sessions automatically terminate after 15 minutes of inactivity, requiring re-authentication via context-aware challenge." defaultChecked={true} aiImpact='High' />
                <li className="py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-gray-800/70">
                     <div className="flex-grow">
                        <span className="font-bold text-lg text-white flex items-center">Master Credential Management</span>
                        <p className="text-sm text-gray-400">Last rotation: 2024-01-15. Next mandatory rotation: 2025-01-15.</p>
                     </div>
                     <button className="px-6 py-2 bg-indigo-700 hover:bg-indigo-600 text-white font-semibold rounded-lg text-sm transition-colors shadow-lg mt-2 sm:mt-0">Initiate Credential Rotation Protocol</button>
                </li>
            </ul>
        </Card>
    ), []);

    const renderRecentActivity = useMemo(() => (
        <Card title="Real-Time Login Telemetry" className="lg:col-span-1">
            <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                {loginActivity.map(activity => (
                    <div key={activity.id} className="flex items-start justify-between p-3 bg-gray-800/50 rounded-lg border-l-4 border-gray-700 hover:bg-gray-700/50 transition-colors">
                        <div className="flex-grow min-w-0">
                            <p className="font-bold text-white truncate flex items-center gap-2">{activity.device}{activity.isCurrent && <span className="px-2 py-0.5 bg-green-600/50 text-green-200 text-xs rounded-full font-medium flex-shrink-0">LIVE SESSION</span>}</p>
                            <p className="text-xs text-gray-400 mt-1"><span className="font-mono bg-gray-700/50 px-1 rounded mr-1">{activity.ip}</span> @ {activity.location} ({activity.os})</p>
                        </div>
                        <span className="text-xs text-gray-500 ml-2 flex-shrink-0">{new Date(activity.timestamp).toLocaleTimeString()}</span>
                    </div>
                ))}
            </div>
        </Card>
    ), [loginActivity]);

    const renderActiveDevices = useMemo(() => (
        <Card title="Managed Endpoints Inventory" className="lg:col-span-2">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {devices.map(device => (
                    <div key={device.id} className="p-4 bg-gray-800/50 rounded-lg border border-indigo-700/50 flex flex-col shadow-lg">
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-indigo-900/70 rounded-lg flex items-center justify-center text-indigo-300 flex-shrink-0">{device.type === 'Mobile' ? (<svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>) : (<svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>)}</div>
                                <p className="font-bold text-white truncate">{device.name}</p>
                            </div>
                            <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${device.status === 'active' ? 'bg-green-600/30 text-green-300' : 'bg-red-600/30 text-red-300'}`}>{device.status.toUpperCase()}</span>
                        </div>
                        <p className="text-xs text-gray-400 mb-2">Model: {device.model} ({device.type})</p>
                        <p className="text-xs text-gray-500 truncate">IP: {device.ip} | Last Seen: {new Date(device.lastActivity).toLocaleTimeString()}</p>
                        <div className="mt-3 pt-2 border-t border-gray-700">
                            <p className="text-xs font-semibold text-cyan-400">Permissions Granted: {device.permissions.length}</p>
                            <div className="flex flex-wrap gap-1 mt-1">{device.permissions.slice(0, 3).map(p => (<span key={p} className="text-[10px] bg-gray-700 text-gray-300 px-1 rounded">{p}</span>))}{device.permissions.length > 3 && <span className="text-[10px] text-gray-500">+{device.permissions.length - 3} more</span>}</div>
                        </div>
                    </div>
                ))}
            </div>
        </Card>
    ), [devices]);

    const renderDataPolicies = useMemo(() => (
        <Card title="Data Governance & Sharing Policies" className="lg:col-span-2">
            <p className="text-sm text-gray-400 mb-4">Define granular controls over how internal and external data sets are processed, stored, and shared. Managed by AI Policy Engine.</p>
            <div className="space-y-4">
                {(dataSharingPolicies || []).map(policy => (
                    <div key={policy.policyId} className="p-4 bg-gray-800/70 rounded-lg border border-purple-700/50 flex flex-col md:flex-row justify-between items-start md:items-center">
                        <div className="flex-grow mb-2 md:mb-0">
                            <p className="font-bold text-white text-lg">{policy.policyName}</p>
                            <p className="text-xs text-gray-400 mt-1">Scope: {policy.scope} | Last Reviewed: {policy.lastReviewed}</p>
                        </div>
                        <div className="flex items-center space-x-4">
                            <span className={`text-sm font-semibold ${policy.isActive ? 'text-green-400' : 'text-red-400'}`}>{policy.isActive ? 'ACTIVE' : 'DRAFT'}</span>
                            <SecuritySettingToggle id={`policy-${policy.policyId}`} title="Enable Policy" description={`Toggle activation for ${policy.policyName}`} defaultChecked={policy.isActive} onToggle={(checked) => handlePolicyToggle(policy, checked)} aiImpact='Medium' />
                        </div>
                    </div>
                ))}
            </div>
        </Card>
    ), [dataSharingPolicies, handlePolicyToggle]);

    const renderAPIKeys = useMemo(() => (
        <Card title="System API Key Management" className="lg:col-span-2">
            <p className="text-sm text-gray-400 mb-4">Manage programmatic access tokens. Keys are automatically rotated by the Quantum Key Vault every 90 days.</p>
            <div className="space-y-3">
                {(apiKeys || []).map(key => (
                    <div key={key.id} className="flex justify-between items-center p-3 bg-gray-800/70 rounded-lg border border-yellow-700/50">
                        <div className="flex items-center min-w-0">
                            <svg className="w-5 h-5 text-yellow-400 mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M6 16h.01" /></svg>
                            <div>
                                <p className="font-mono text-sm text-white truncate">{key.keyName} ({key.id.substring(0, 8)}...)</p>
                                <p className="text-xs text-gray-500">Created: {key.creationDate} | Permissions: {key.scopes.join(', ')}</p>
                            </div>
                        </div>
                        <button onClick={() => handleAPIKeyRevoke(key.id)} className="px-3 py-1 bg-red-900/30 hover:bg-red-900/50 text-red-300 rounded-md text-xs transition-colors flex-shrink-0 ml-4">Revoke Now</button>
                    </div>
                ))}
            </div>
        </Card>
    ), [apiKeys, handleAPIKeyRevoke]);

    const renderAIAnalysis = useMemo(() => (
        <div className="space-y-6">
            <Card title={`AI Threat Intelligence Feed (${AI_INSIGHT_ENGINE_VERSION})`}>
                <div className="flex justify-between items-center mb-4 border-b border-gray-800 pb-3">
                    <p className="text-gray-400 text-sm">Real-time behavioral analysis and predictive threat modeling.</p>
                    <span className="text-sm font-bold text-cyan-400">Total Insights: {aiInsights.length}</span>
                </div>
                <div className="space-y-4">
                    {aiInsights.length > 0 ? (aiInsights.map(insight => (<AISecurityInsightCard key={insight.id} insight={insight} />))) : (<div className="p-6 bg-gray-800/50 rounded-lg text-center border border-dashed border-gray-700"><p className="text-gray-500 italic">AI Engine reports no immediate high-priority anomalies at this time.</p></div>)}
                </div>
            </Card>
            <Card title="Security Awareness Training Modules">
                <p className="text-sm text-gray-400 mb-4">Track mandatory compliance training completion status across the organization.</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {(securityAwarenessModules || []).map(module => (
                        <div key={module.moduleId} className="p-4 bg-gray-800/70 rounded-lg border border-green-700/50">
                            <p className="font-bold text-white">{module.title}</p>
                            <p className="text-xs text-gray-400 mt-1">Status: {module.completionRate}% Complete</p>
                            <div className="w-full bg-gray-700 rounded-full h-2.5 mt-2"><div className="bg-green-500 h-2.5 rounded-full" style={{ width: `${module.completionRate}%` }}></div></div>
                        </div>
                    ))}
                </div>
            </Card>
        </div>
    ), [aiInsights, securityAwarenessModules]);

    const renderAuditLogs = useMemo(() => {
        const displayLogs = (auditLogs || []).slice(0, MAX_AUDIT_LOG_DISPLAY);
        return (
            <Card title={`System Audit Trail (Last ${displayLogs.length} Entries)`} className="lg:col-span-2">
                <p className="text-sm text-gray-400 mb-3">Immutable record of all configuration changes, data access events, and administrative actions.</p>
                <div className="overflow-x-auto max-h-[500px] custom-scrollbar">
                    <table className="min-w-full divide-y divide-gray-700">
                        <thead className="sticky top-0 bg-gray-800 z-10"><tr><th className="px-4 py-2 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Time</th><th className="px-4 py-2 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">User/System</th><th className="px-4 py-2 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Action</th><th className="px-4 py-2 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Target</th><th className="px-4 py-2 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Status</th></tr></thead>
                        <tbody className="divide-y divide-gray-800">{displayLogs.map((log: AuditLogEntry) => (<tr key={log.id} className="hover:bg-gray-800/50 transition-colors"><td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">{new Date(log.timestamp).toLocaleTimeString()}</td><td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-white">{log.userId.includes('sys_') ? 'SYSTEM' : log.userId}</td><td className="px-4 py-2 text-sm text-cyan-400">{log.action}</td><td className="px-4 py-2 text-sm text-gray-400">{log.targetResource}</td><td className="px-4 py-2 whitespace-nowrap"><span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${log.success ? 'bg-green-900/50 text-green-300' : 'bg-red-900/50 text-red-300'}`}>{log.success ? 'SUCCESS' : 'FAILURE'}</span></td></tr>))}</tbody>
                    </table>
                </div>
                {displayLogs.length < (auditLogs?.length || 0) && (<p className="text-center text-sm text-gray-500 mt-3">Displaying first {MAX_AUDIT_LOG_DISPLAY} logs. Load full history via dedicated Audit Console.</p>)}
            </Card>
        );
    }, [auditLogs]);

    const renderSecurityScoreGauge = useMemo(() => {
        const radius = 50; const circumference = 2 * Math.PI * radius; const offset = circumference - (securityScore / 100) * circumference; const color = securityScore >= 90 ? 'stroke-green-500' : securityScore >= 70 ? 'stroke-yellow-500' : 'stroke-red-500';
        return (
            <div className="flex flex-col items-center p-6 bg-gray-800/70 rounded-xl shadow-inner border border-gray-700">
                <h3 className="text-xl font-bold text-white mb-3">Quantum Security Index (QSI)</h3>
                <svg width="120" height="120" viewBox="0 0 120 120" className="transform -rotate-90"><circle cx="60" cy="60" r={radius} fill="transparent" stroke="#374151" strokeWidth="10" /><circle cx="60" cy="60" r={radius} fill="transparent" stroke={color.replace('stroke-', '')} strokeWidth="10" strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round" className="transition-all duration-1000 ease-out" /><text x="60" y="60" dominantBaseline="middle" textAnchor="middle" className="fill-current text-white" fontSize="20" fontWeight="bold">{securityScore}%</text></svg>
                <p className="text-sm text-gray-400 mt-2">Target: 95%</p>
            </div>
        );
    }, [securityScore]);

    const renderTrustedContacts = useMemo(() => (
        <Card title="Emergency Trusted Contacts" className="lg:col-span-1">
            <p className="text-sm text-gray-400 mb-4">Contacts authorized for emergency account recovery or high-risk alerts.</p>
            <div className="space-y-3">
                {(trustedContacts || []).map((contact: TrustedContact) => (
                    <div key={contact.id} className="flex justify-between items-center p-3 bg-gray-800/50 rounded-lg border border-gray-700">
                        <div className="flex items-center">
                            <div className="w-8 h-8 bg-pink-900/50 rounded-full flex items-center justify-center text-pink-300 mr-3"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg></div>
                            <div><p className="font-semibold text-white">{contact.name}</p><p className="text-xs text-gray-400">{contact.relationship}</p></div>
                        </div>
                        <span className={`text-xs font-medium px-2 py-0.5 rounded ${contact.verified ? 'bg-green-900/30 text-green-400' : 'bg-red-900/30 text-red-400'}`}>{contact.verified ? 'Verified' : 'Pending'}</span>
                    </div>
                ))}
            </div>
        </Card>
    ), [trustedContacts]);

    const renderHFTView = useMemo(() => (
        <Card title="High-Frequency Trading (HFT) Security Module">
            <p className="text-sm text-gray-400 mb-4">Real-time monitoring and automated circuit breakers for algorithmic trading infrastructure.</p>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-4">
                    <h3 className="text-lg font-bold text-white">Algorithmic Kill Switches & Rules</h3>
                    {hftRules.map(rule => (
                        <div key={rule.id} className="p-4 bg-gray-800/70 rounded-lg border border-red-700/50">
                            <div className="flex justify-between items-center">
                                <p className="font-bold text-lg text-white">{rule.name}</p>
                                <SecuritySettingToggle id={`hft-${rule.id}`} title="" description="" defaultChecked={rule.isEnabled} />
                            </div>
                            <p className="text-sm text-gray-400 mt-1">{rule.description}</p>
                            <div className="text-xs mt-2 pt-2 border-t border-gray-700 flex justify-between">
                                <span className="font-mono bg-gray-900 px-2 py-1 rounded">IF {rule.condition} THEN {rule.action}</span>
                                <span className="text-gray-500">Last Triggered: {rule.lastTriggered ? new Date(rule.lastTriggered).toLocaleString() : 'Never'}</span>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="space-y-4">
                    <h3 className="text-lg font-bold text-white">System Latency</h3>
                    <div className="p-4 bg-gray-800/70 rounded-lg text-center">
                        <p className="text-5xl font-mono font-extrabold text-green-400">0.72ms</p>
                        <p className="text-sm text-gray-400">Exchange Co-location (LD4)</p>
                    </div>
                    <button className="w-full py-2 bg-blue-700 hover:bg-blue-600 rounded-lg font-semibold">Define New HFT Rule</button>
                </div>
            </div>
        </Card>
    ), [hftRules]);

    const renderQuantumView = useMemo(() => (
        <Card title="Quantum Threat Mitigation & Future Tech">
            <p className="text-sm text-gray-400 mb-4">Tracking the enterprise-wide migration to post-quantum cryptography (PQC) and other next-generation security paradigms.</p>
            <div className="overflow-x-auto custom-scrollbar">
                <table className="min-w-full divide-y divide-gray-700">
                    <thead className="bg-gray-800"><tr><th className="px-4 py-2 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">System Component</th><th className="px-4 py-2 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">PQC Algorithm</th><th className="px-4 py-2 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Status</th><th className="px-4 py-2 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Migration ETA</th></tr></thead>
                    <tbody className="divide-y divide-gray-800">
                        {quantumStatuses.map(qs => (
                            <tr key={qs.id} className="hover:bg-gray-800/50">
                                <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-white">{qs.systemComponent}</td>
                                <td className="px-4 py-3 whitespace-nowrap text-sm font-mono text-cyan-400">{qs.algorithm}</td>
                                <td className="px-4 py-3 whitespace-nowrap text-sm"><span className={`px-2 py-0.5 rounded-full text-xs font-bold ${qs.status === 'MIGRATED' ? 'bg-green-600/30 text-green-300' : qs.status === 'PENDING' ? 'bg-yellow-600/30 text-yellow-300' : 'bg-red-600/30 text-red-300'}`}>{qs.status}</span></td>
                                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-400">{qs.migrationEta}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </Card>
    ), [quantumStatuses]);

    const renderIncidentResponseView = useMemo(() => (
        <div className="space-y-6">
            <Card title="Incident Response & Emergency Protocols" className="border-2 border-red-500/50 shadow-red-500/20 shadow-2xl">
                <div className="flex flex-col md:flex-row justify-between items-center p-4 bg-red-900/30 rounded-lg">
                    <div>
                        <h3 className="text-xl font-extrabold text-red-300">Global Lockdown Protocol</h3>
                        <p className="text-red-400 max-w-2xl">Immediately freeze all transactions, terminate sessions, revoke temporary keys, and place the system in a restricted, audit-only state. REQUIRES C-LEVEL AUTHENTICATION.</p>
                    </div>
                    <button onClick={handleGlobalLockdown} className="mt-4 md:mt-0 px-8 py-4 bg-red-700 hover:bg-red-600 text-white font-bold rounded-lg text-lg transition-transform hover:scale-105 shadow-lg flex-shrink-0">INITIATE LOCKDOWN</button>
                </div>
            </Card>
            <Card title="Active Security Incidents">
                <div className="space-y-4">
                    {incidents.map(incident => (
                        <div key={incident.id} className="p-4 bg-gray-800/70 rounded-lg border-l-4 border-yellow-500">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="font-bold text-lg text-white">{incident.title}</p>
                                    <p className="text-xs text-gray-400">Reported: {new Date(incident.timestamp).toLocaleString()} | Assigned: {incident.assignedTo}</p>
                                </div>
                                <span className={`px-3 py-1 rounded-full text-sm font-bold ${incident.status === 'Resolved' ? 'bg-green-600/30 text-green-300' : 'bg-yellow-600/30 text-yellow-300'}`}>{incident.status}</span>
                            </div>
                            <p className="text-sm text-gray-300 mt-2">{incident.summary}</p>
                        </div>
                    ))}
                    <button className="w-full py-3 bg-green-700 hover:bg-green-600 rounded-lg font-semibold text-lg">Report New Incident</button>
                </div>
            </Card>
        </div>
    ), [incidents]);

    const renderGeinCommandView = useMemo(() => (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            <div className="xl:col-span-2 space-y-6">
                <Card title="GEIN Command Console">
                    <div className="h-[600px] flex flex-col">
                        <div className="flex-grow p-4 bg-gray-900/70 rounded-t-lg overflow-y-auto custom-scrollbar space-y-4">
                            {geinConsoleHistory.map(msg => (
                                <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-xl p-3 rounded-lg ${msg.role === 'user' ? 'bg-blue-800' : 'bg-gray-700'}`}>
                                        <p className="text-white whitespace-pre-wrap">{msg.text}{msg.isStreaming && <span className="inline-block w-2 h-4 bg-cyan-400 animate-pulse ml-1"></span>}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="flex p-2 bg-gray-800 rounded-b-lg border-t border-gray-700">
                            <input type="text" value={geinConsoleInput} onChange={(e) => setGeinConsoleInput(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleGeinQuery()} placeholder="Query GEIN... (e.g., 'Summarize anomalous activity on dvc_2')" className="flex-grow bg-transparent text-white placeholder-gray-500 focus:outline-none px-3" />
                            <button onClick={handleGeinQuery} className="px-6 py-2 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-md transition-colors">Send</button>
                        </div>
                    </div>
                </Card>
                <Card title="GEIN Configuration">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">System Instruction</label>
                            <textarea value={geinSystemInstruction} onChange={(e) => setGeinSystemInstruction(e.target.value)} rows={5} className="w-full p-2 bg-gray-900 rounded-md text-sm text-gray-300 border border-gray-700 focus:ring-cyan-500 focus:border-cyan-500"></textarea>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">Thinking Budget: {geinThinkingBudget === 0 ? 'Disabled' : `${geinThinkingBudget} tokens`}</label>
                            <input type="range" min="0" max="10000" step="500" value={geinThinkingBudget} onChange={(e) => setGeinThinkingBudget(Number(e.target.value))} className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer" />
                            <p className="text-xs text-gray-500 mt-1">Controls enhanced quality processing. Higher values may increase latency and token usage. 0 disables thinking.</p>
                        </div>
                    </div>
                </Card>
            </div>
            <div className="space-y-6">
                <Card title="Cognitive Core Status">
                    <div className="space-y-3">
                        {cognitiveCores.map(core => (
                            <div key={core.name} className="p-3 bg-gray-800/50 rounded-lg">
                                <div className="flex justify-between items-center">
                                    <p className="font-bold text-white">{core.name}</p>
                                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${core.status === 'NOMINAL' ? 'bg-green-600/30 text-green-300' : 'bg-yellow-600/30 text-yellow-300'}`}>{core.status}</span>
                                </div>
                                <p className="text-xs text-gray-400 mt-1 truncate">Task: {core.primaryTask}</p>
                                <div className="w-full bg-gray-700 rounded-full h-1.5 mt-2"><div className="bg-cyan-500 h-1.5 rounded-full" style={{ width: `${core.load}%` }}></div></div>
                            </div>
                        ))}
                    </div>
                </Card>
                <Card title="Real-Time Data Ingestion Stream">
                    <div className="h-[400px] overflow-y-auto custom-scrollbar space-y-2 font-mono text-xs">
                        {geinInputStream.map(chunk => (
                            <div key={chunk.id} className="flex gap-2 items-center text-gray-400">
                                <span className="text-gray-600">{new Date(chunk.timestamp).toLocaleTimeString()}</span>
                                <span className="text-purple-400 w-28 truncate">{chunk.sourceNode}</span>
                                <span className="text-cyan-400 w-24">{chunk.dataType}</span>
                                <span className="flex-grow truncate">{chunk.payload}</span>
                                <span style={{ color: `rgba(255, 255, 255, ${chunk.geinScore})` }}>{chunk.geinScore.toFixed(2)}</span>
                            </div>
                        ))}
                    </div>
                </Card>
            </div>
        </div>
    ), [geinConsoleHistory, geinConsoleInput, geinSystemInstruction, geinThinkingBudget, cognitiveCores, geinInputStream, handleGeinQuery]);

    // --- Tab Content Rendering ---
    const renderContent = () => {
        switch (activeTab) {
            case 'overview': return (<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">{renderSecurityScoreGauge}{renderRecentActivity}{renderActiveDevices}{renderLinkedAccounts}{renderSecuritySettings}</div>);
            case 'policies': return (<div className="grid grid-cols-1 gap-6">{renderDataPolicies}<Card title="Transaction Rule Engine"><p className="text-sm text-gray-400 mb-4">Define automated responses to financial events based on predefined risk thresholds.</p><div className="space-y-3">{(context?.transactionRules || []).map((rule: TransactionRule) => (<div key={rule.ruleId} className="p-3 bg-gray-800/70 rounded-lg border border-cyan-700/50 flex justify-between items-center"><div><p className="font-bold text-white">{rule.name}</p><p className="text-xs text-gray-400">Trigger: {rule.triggerCondition} | Action: {rule.action}</p></div><span className={`text-xs font-medium px-2 py-0.5 rounded ${rule.isEnabled ? 'bg-green-900/30 text-green-400' : 'bg-red-900/30 text-red-400'}`}>{rule.isEnabled ? 'ACTIVE' : 'DISABLED'}</span></div>))}</div></Card></div>);
            case 'keys': return (<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">{renderAPIKeys}{renderTrustedContacts}<Card title="Threat Alert History" className="lg:col-span-3"><p className="text-sm text-gray-400 mb-4">Historical record of confirmed security incidents.</p><div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">{(threatAlerts || []).map((alert: ThreatAlert) => (<div key={alert.alertId} className="p-3 bg-red-900/30 rounded-lg border border-red-600 flex justify-between items-center"><div><p className="font-bold text-red-300">{alert.title}</p><p className="text-xs text-gray-300">{alert.description}</p></div><span className="text-xs text-gray-300">{new Date(alert.timestamp).toLocaleDateString()}</span></div>))}</div></Card></div>);
            case 'ai_analysis': return (<div className="grid grid-cols-1 gap-6">{renderAIAnalysis}{renderAuditLogs}</div>);
            case 'hft': return renderHFTView;
            case 'quantum': return renderQuantumView;
            case 'incidents': return renderIncidentResponseView;
            case 'gein_command': return renderGeinCommandView;
            default: return null;
        }
    };

    const tabs: { id: typeof activeTab, label: string }[] = [
        { id: 'overview', label: 'Overview & Access' }, { id: 'policies', label: 'Governance & Rules' }, { id: 'keys', label: 'API & Contacts' }, { id: 'ai_analysis', label: 'AI Threat Analysis' }, { id: 'hft', label: 'HFT Security' }, { id: 'quantum', label: 'Future Tech' }, { id: 'incidents', label: 'Incident Response' }, { id: 'gein_command', label: 'GEIN Command' },
    ];

    return (
        <div className="space-y-8 p-4 sm:p-8">
            <header className="pb-4 border-b border-gray-700">
                <h1 className="text-4xl font-extrabold text-white tracking-tighter">Enterprise Security Command Center</h1>
                <p className="text-lg text-gray-400 mt-1">Centralized control plane for data integrity, access management, and threat mitigation. Engine: {AI_INSIGHT_ENGINE_VERSION}</p>
            </header>

            <div className="flex border-b border-gray-700 overflow-x-auto custom-scrollbar">{tabs.map((tab) => (<button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`px-6 py-3 text-lg font-semibold transition-all duration-300 whitespace-nowrap ${activeTab === tab.id ? 'text-cyan-400 border-b-4 border-cyan-500' : 'text-gray-400 hover:text-white hover:border-b-4 hover:border-gray-600'}`}>{tab.label}</button>))}</div>

            <main>{renderContent()}</main>

            {notification && (<NotificationToast message={notification.message} type={notification.type} isVisible={notification.isVisible} onClose={closeNotification} />)}
        </div>
    );
};

export default SecurityView;

================================================================================
// APPENDED FROM REPO: diplomat-bit/Fuckyou | ORIGINAL PATH: diplomat-bit-Fuckyou-70f83c5/components/SecurityView (2).tsx
================================================================================

// components/SecurityView.tsx
// RE-ENACTED & EXPANDED: This component has been resurrected from its deprecated state.
// It is now the "AegisVault," the full-featured security and access control center
// for the user's financial kingdom. It provides transparent controls for data sharing,
// account security, and activity monitoring.

import React, { useContext, useState } from 'react';
import { DataContext } from '../context/DataContext';
import Card from './Card';
import PlaidLinkButton from './PlaidLinkButton';

// ================================================================================================
// TYPE DEFINITIONS & MOCK DATA
// ================================================================================================

interface LoginActivity {
    id: string;
    device: string;
    location: string;
    ip: string;
    timestamp: string;
    isCurrent: boolean;
}

const MOCK_LOGIN_ACTIVITY: LoginActivity[] = [
    { id: '1', device: 'Chrome on macOS', location: 'New York, USA', ip: '192.168.1.1', timestamp: '2 minutes ago', isCurrent: true },
    { id: '2', device: 'DemoBank App on iOS', location: 'New York, USA', ip: '172.16.0.1', timestamp: '3 days ago', isCurrent: false },
    { id: '3', device: 'Chrome on Windows', location: 'Chicago, USA', ip: '10.0.0.1', timestamp: '1 week ago', isCurrent: false },
];

// ================================================================================================
// SUB-COMPONENTS
// ================================================================================================

/**
 * @description A reusable component for displaying a single security setting with a toggle.
 */
const SecuritySettingToggle: React.FC<{
    title: string;
    description: string;
    defaultChecked: boolean;
}> = ({ title, description, defaultChecked }) => (
    <li className="py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <div>
            <h4 className="font-semibold text-white">{title}</h4>
            <p className="text-sm text-gray-400 max-w-md mt-1">{description}</p>
        </div>
        <input
            type="checkbox"
            className="toggle toggle-cyan mt-2 sm:mt-0"
            defaultChecked={defaultChecked}
            aria-label={`Toggle for ${title}`}
        />
    </li>
);

/**
 * @description A modal for simulating a password change flow.
 */
const ChangePasswordModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 backdrop-blur-sm" onClick={onClose}>
            <div className="bg-gray-800 rounded-lg shadow-2xl max-w-md w-full border border-gray-700" onClick={e => e.stopPropagation()}>
                <div className="p-4 border-b border-gray-700">
                    <h3 className="text-lg font-semibold text-white">Change Password</h3>
                </div>
                <div className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-300">Current Password</label>
                        <input type="password" className="mt-1 w-full bg-gray-700/50 border-gray-600 rounded-md p-2 text-white" />
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-300">New Password</label>
                        <input type="password" className="mt-1 w-full bg-gray-700/50 border-gray-600 rounded-md p-2 text-white" />
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-300">Confirm New Password</label>
                        <input type="password" className="mt-1 w-full bg-gray-700/50 border-gray-600 rounded-md p-2 text-white" />
                    </div>
                    <button onClick={() => { alert('Password changed successfully.'); onClose(); }} className="w-full py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg mt-2">
                        Update Password
                    </button>
                </div>
            </div>
        </div>
    );
};

// ================================================================================================
// MAIN VIEW COMPONENT: SecurityView (AegisVault)
// ================================================================================================

const SecurityView: React.FC = () => {
    const context = useContext(DataContext);
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
    
    if (!context) {
        throw new Error("SecurityView must be within a DataProvider.");
    }
    
    // FIX: Destructure missing functions from context to resolve property not found errors.
    const { linkedAccounts, unlinkAccount, handlePlaidSuccess } = context;

    return (
        <>
            <div className="space-y-6">
                <h2 className="text-3xl font-bold text-white tracking-wider">Security & Access (AegisVault)</h2>
                
                {/* Linked Accounts & Data Sources Card */}
                <Card title="Linked Accounts & Data Sources" titleTooltip="Manage connections to external financial institutions. You have full control to link or unlink accounts at any time.">
                    <p className="text-sm text-gray-400 mb-4">
                        These are the external accounts you've securely connected via Plaid. This allows Demo Bank to provide a holistic view of your finances. Your credentials are never stored by us.
                    </p>
                    <div className="space-y-3 mb-6">
                        {linkedAccounts.length > 0 ? linkedAccounts.map(account => (
                            <div key={account.id} className="flex justify-between items-center p-3 bg-gray-800/50 rounded-lg border border-gray-700/60">
                                <div>
                                    <h4 className="font-semibold text-white">{account.name}</h4>
                                    <p className="text-sm text-gray-400">Account ending in **** {account.mask}</p>
                                </div>
                                <button onClick={() => unlinkAccount(account.id)} className="px-3 py-1 bg-red-600/50 hover:bg-red-600 text-white rounded-lg text-xs font-medium">
                                    Unlink
                                </button>
                            </div>
                        )) : (
                            <p className="text-center text-gray-500 py-4">No accounts linked yet.</p>
                        )}
                    </div>
                    <PlaidLinkButton onSuccess={handlePlaidSuccess} />
                </Card>

                {/* Security Settings Card */}
                <Card title="Security Settings">
                    <ul className="divide-y divide-gray-700/60">
                        <SecuritySettingToggle
                            title="Two-Factor Authentication (2FA)"
                            description="Requires a code from your authenticator app or SMS in addition to your password for enhanced security."
                            defaultChecked={true}
                        />
                        <SecuritySettingToggle
                            title="Biometric Login"
                            description="Enable passwordless login using your device's Face ID or Touch ID for a faster and more secure experience."
                            defaultChecked={false}
                        />
                        <li className="py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center">
                            <div>
                                <h4 className="font-semibold text-white">Change Password</h4>
                                <p className="text-sm text-gray-400 max-w-md mt-1">It's a good practice to update your password regularly.</p>
                            </div>
                            <button onClick={() => setIsPasswordModalOpen(true)} className="mt-2 sm:mt-0 px-4 py-2 bg-gray-600/50 hover:bg-gray-600 text-white rounded-lg text-xs font-medium">
                                Change
                            </button>
                        </li>
                    </ul>
                </Card>

                {/* Login Activity Card */}
                <Card title="Recent Login Activity">
                     <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left text-gray-400">
                            <thead className="text-xs text-gray-300 uppercase bg-gray-900/30">
                                <tr>
                                    <th className="px-6 py-3">Device</th>
                                    <th className="px-6 py-3">Location</th>
                                    <th className="px-6 py-3">Timestamp</th>
                                </tr>
                            </thead>
                            <tbody>
                                {MOCK_LOGIN_ACTIVITY.map(activity => (
                                    <tr key={activity.id} className={`border-b border-gray-800 ${activity.isCurrent ? 'bg-cyan-500/10' : 'hover:bg-gray-800/50'}`}>
                                        <td className="px-6 py-4 font-medium text-white">{activity.device} {activity.isCurrent && <span className="text-xs text-cyan-300">(Current)</span>}</td>
                                        <td className="px-6 py-4">{activity.location}</td>
                                        <td className="px-6 py-4">{activity.timestamp}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Card>
            </div>
            <ChangePasswordModal isOpen={isPasswordModalOpen} onClose={() => setIsPasswordModalOpen(false)} />
        </>
    );
};

export default SecurityView;


================================================================================
// APPENDED FROM REPO: diplomat-bit/Fuckyou | ORIGINAL PATH: diplomat-bit-Fuckyou-70f83c5/components/SecurityView (3).tsx
================================================================================

import React, { useState } from 'react';
// axios removed as direct API key submission from frontend is not the secure approach
import './SecurityView.css'; // This CSS will be provided in Part 2, assuming general layout styles are still relevant

// =================================================================================
// REPLACEMENT RATIONALE:
// The original SecurityView component presented a form for directly inputting
// and submitting over 200 system-level backend API keys from the frontend
// to a generic backend endpoint. This approach is fundamentally flawed and
// highly insecure for a production application for several reasons:
// 1. Exposure Risk: Sensitive API keys should never be directly exposed to
//    the client-side (frontend) code or manually handled by end-users.
// 2. Security Best Practices: Production-grade applications must manage
//    sensitive credentials (like API keys, database passwords, etc.) using
//    dedicated, secure secret management services.
//
// SYSTEM SECRETS MANAGEMENT:
// In alignment with security best practices and the refactoring plan's goal
// to "Integrate AWS Secrets Manager or Vault for all sensitive values,"
// system-level API keys and other sensitive credentials are to be managed
// exclusively by the backend infrastructure. This involves:
// - Storing secrets in secure services like AWS Secrets Manager, Google Secret Manager,
//   Azure Key Vault, or HashiCorp Vault.
// - Ensuring secrets are encrypted at rest and in transit.
// - Implementing automatic key rotation where possible.
// - Granting access to secrets only to authorized backend services using
//   Identity and Access Management (IAM) roles or service accounts.
// - Never exposing these keys to client-side code, environmental variables on the frontend,
//   or manual input forms in the UI for system-level credentials.
//
// REPLACEMENT:
// This component has been refactored to remove the insecure API key input forms.
// A "SecurityView" on the frontend for a secure, production-ready application
// should instead focus on:
// 1. Providing an overview of the application's security posture.
// 2. Allowing users to manage their *own* security settings (e.g., password changes,
//    multi-factor authentication setup).
// 3. Facilitating secure initiation of external integrations (e.g., OAuth flows
//    for connecting user bank accounts via Plaid Link), where sensitive tokens
//    are securely exchanged and managed on the backend, not directly inputted by the user.
//
// For the MVP, system-level API keys are assumed to be managed via AWS Secrets Manager
// or similar infrastructure by backend services. This frontend view is repurposed
// to reflect general application security information and placeholders for future
// user-specific security settings or secure integration management.
// =================================================================================

// Placeholder interface for future user-specific security settings
interface UserSecuritySettings {
  twoFactorEnabled: boolean;
  lastPasswordChange: string;
  // Add other user-specific security settings as needed for the MVP or future modules
}

const SecurityView: React.FC = () => {
  // Mock state for user security settings, demonstrating a more appropriate use case
  const [userSettings, setUserSettings] = useState<UserSecuritySettings>({
    twoFactorEnabled: false,
    lastPasswordChange: '2023-01-01', // Example date
  });
  const [statusMessage, setStatusMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'user-settings' | 'integrations'>('overview');

  // Example function for a user-centric security action (e.g., toggling 2FA)
  const handleToggleTwoFactor = async () => {
    setIsLoading(true);
    setStatusMessage('Updating 2FA status...');
    try {
      // In a real application, this would call a secure backend API endpoint
      // to update the user's 2FA status. The backend would handle the actual
      // logic for enabling/disabling 2FA (e.g., verifying OTPs, managing keys).
      // Example: await secureBackendApi.post('/user/toggle-2fa', { enabled: !userSettings.twoFactorEnabled });
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      setUserSettings(prev => ({ ...prev, twoFactorEnabled: !prev.twoFactorEnabled }));
      setStatusMessage('2FA status updated successfully.');
    } catch (error) {
      setStatusMessage('Failed to update 2FA status.');
      console.error('2FA update error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Example for initiating a secure external service connection (e.g., connecting a bank via Plaid)
  const handleConnectPlaid = async () => {
    setIsLoading(true);
    setStatusMessage('Initiating Plaid connection...');
    try {
      // For bank aggregation (MVP candidate), this would involve a secure backend endpoint
      // that generates a Plaid Link token. The frontend then uses this token to launch
      // the Plaid Link UI, allowing the user to securely connect their bank account.
      // The resulting Plaid 'public_token' is then sent to the backend to exchange for
      // an 'access_token', which the backend stores and uses. The frontend never sees raw API keys.
      // Example: const response = await secureBackendApi.post('/plaid/create-link-token');
      // Plaid.create({ token: response.data.link_token, onSuccess: (public_token) => sendToBackend(public_token) }).open();
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API call
      setStatusMessage('Plaid connection initiated. (Note: A real implementation would launch Plaid Link securely.)');
    } catch (error) {
      setStatusMessage('Failed to initiate Plaid connection.');
      console.error('Plaid connection error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="settings-container">
      <h1>Security Overview & Settings</h1>
      <p className="subtitle">
        This section provides an overview of the application's security posture and allows management of user-specific security settings and integrations.
      </p>

      <div className="tabs">
        <button onClick={() => setActiveTab('overview')} className={activeTab === 'overview' ? 'active' : ''}>
          Security Overview
        </button>
        <button onClick={() => setActiveTab('user-settings')} className={activeTab === 'user-settings' ? 'active' : ''}>
          Your Security Settings
        </button>
        <button onClick={() => setActiveTab('integrations')} className={activeTab === 'integrations' ? 'active' : ''}>
          External Integrations
        </button>
      </div>

      <div className="settings-form"> {/* Reusing settings-form for general layout styling */}
        {activeTab === 'overview' && (
          <div className="form-section">
            <h2>System Security Posture & Secrets Management</h2>
            <p>
              <strong>Important:</strong> All system-level sensitive credentials (e.g., API keys for payment gateways, cloud services, backend integrations)
              are securely managed on the backend using an enterprise-grade secrets management solution (e.g., AWS Secrets Manager, HashiCorp Vault).
              These keys are never exposed to the frontend, stored in client-side code, or manually entered via this user interface.
              Access to secrets is strictly controlled through IAM roles, service accounts, and least-privilege principles.
            </p>
            <p>
              This architecture ensures robust security, minimizes the risk of credential compromise, and facilitates compliant key rotation and auditing.
            </p>
            <h3>Authentication & Authorization</h3>
            <ul>
              <li>User authentication is implemented with secure JSON Web Tokens (JWTs) and robust session management.</li>
              <li>Role-based access control (RBAC) enforces granular permissions across the application, ensuring users only access authorized features and data.</li>
              <li>Sensitive operations (e.g., financial transactions, configuration changes) may require re-authentication or multi-factor verification.</li>
            </ul>
          </div>
        )}

        {activeTab === 'user-settings' && (
          <div className="form-section">
            <h2>Your Account Security Settings</h2>
            <div className="input-group">
              <label>Multi-Factor Authentication (2FA)</label>
              <p>Status: {userSettings.twoFactorEnabled ? 'Enabled' : 'Disabled'}</p>
              <button onClick={handleToggleTwoFactor} disabled={isLoading} className="action-button">
                {isLoading ? 'Updating...' : (userSettings.twoFactorEnabled ? 'Disable 2FA' : 'Enable 2FA')}
              </button>
            </div>
            <div className="input-group">
              <label>Last Password Change</label>
              <p>{userSettings.lastPasswordChange}</p>
              <button disabled={isLoading} className="action-button">Change Password</button> {/* Placeholder for change password flow */}
            </div>
            {/* Add more user-specific security settings here for the MVP, e.g., Linked Devices, Session Management */}
          </div>
        )}

        {activeTab === 'integrations' && (
          <div className="form-section">
            <h2>Manage External Financial Integrations</h2>
            <p>
              Connect your personal financial accounts to enable features like multi-bank aggregation, transaction intelligence, and treasury automation.
              These integrations utilize secure OAuth2 and Open Banking protocols, ensuring your sensitive bank credentials are never directly handled by this application.
            </p>
            <div className="input-group">
              <label>Plaid Integration (Bank Account Aggregation)</label>
              <p>Status: Not Connected</p> {/* In a real app, this would dynamically show connected status */}
              <button onClick={handleConnectPlaid} disabled={isLoading} className="action-button">
                {isLoading ? 'Connecting...' : 'Connect Bank Account (via Plaid Link)'}
              </button>
              <p className="note">Securely link your bank accounts through Plaid to view aggregated financial data.</p>
            </div>
            {/* Add more external integration options here relevant to the MVP (e.g., accounting software, other financial APIs) */}
          </div>
        )}

        {statusMessage && <p className="status-message">{statusMessage}</p>}
      </div>
    </div>
  );
};

export default SecurityView;

================================================================================
// APPENDED FROM REPO: diplomat-bit/Fuckyou | ORIGINAL PATH: diplomat-bit-Fuckyou-70f83c5/components/SecurityView.tsx
================================================================================


import React, { useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { DataContext } from '../context/DataContext';
import Card from './Card';
import PlaidLinkButton from './PlaidLinkButton';
import { 
    LoginActivity, Device, DataSharingPolicy, TransactionRule, ThreatAlert, 
    AuditLogEntry, APIKey, TrustedContact, SecurityAwarenessModule, SecurityScoreMetric, UserProfile 
} from '../types';

// --- AI/ML Integration Placeholder Types (Simulated for expansion) ---
interface AISecurityInsight {
    id: string;
    timestamp: string;
    severity: 'Low' | 'Medium' | 'High' | 'Critical';
    summary: string;
    recommendation: string;
    sourceModel: string;
}

// --- Constants for Billion Dollar Features ---
const AI_INSIGHT_ENGINE_VERSION = "ChaosEngine v0.0.1-Garbage";
const MAX_AUDIT_LOG_DISPLAY = 5;

// --- Helper Components ---

export const SecuritySettingToggle: React.FC<{
    id: string;
    title: string;
    description: string;
    defaultChecked: boolean;
    onToggle?: (checked: boolean) => void;
    disabled?: boolean;
    aiImpact?: 'High' | 'Medium' | 'Low' | 'None';
}> = ({ id, title, description, defaultChecked, onToggle, disabled, aiImpact = 'None' }) => {
    const [isChecked, setIsChecked] = useState(defaultChecked);
    const { showSystemAlert } = useContext(DataContext) || {};

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newState = e.target.checked;
        setIsChecked(newState);
        onToggle && onToggle(newState);
        
        if (showSystemAlert) {
            const impactColor = aiImpact === 'High' ? 'text-red-400' : aiImpact === 'Medium' ? 'text-yellow-400' : 'text-green-400';
            showSystemAlert(`Configuration Change Detected: ${title} set to ${newState ? 'Enabled' : 'Disabled'}. AI Risk Assessment: ${aiImpact}.`, 'info');
        }
    };

    const aiIndicator = useMemo(() => {
        if (aiImpact === 'None') return null;
        const colorMap = {
            High: 'bg-red-500',
            Medium: 'bg-yellow-500',
            Low: 'bg-blue-500',
        };
        return (
            <span className={`ml-3 px-2 py-0.5 text-xs font-bold rounded-full text-white ${colorMap[aiImpact]}`}>
                AI {aiImpact}
            </span>
        );
    }, [aiImpact]);

    return (
        <li className="py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-gray-800/70">
            <div className="flex-grow">
                <label htmlFor={`toggle-${id}`} className="font-bold text-lg text-white cursor-pointer flex items-center">
                    {title}
                    {aiIndicator}
                </label>
                <p className="text-sm text-gray-400 max-w-xl mt-1">{description}</p>
            </div>
            <div className="flex items-center mt-2 sm:mt-0">
                <span className={`mr-3 text-sm font-medium ${isChecked ? 'text-green-400' : 'text-red-400'}`}>
                    {isChecked ? 'ACTIVE' : 'INACTIVE'}
                </span>
                <input
                    type="checkbox"
                    id={`toggle-${id}`}
                    className="toggle toggle-cyan toggle-lg"
                    checked={isChecked}
                    onChange={handleChange}
                    disabled={disabled}
                    aria-label={`Toggle for ${title}`}
                />
            </div>
        </li>
    );
};

export const NotificationToast: React.FC<{
    message: string;
    type: 'success' | 'error' | 'info' | 'warning' | 'critical';
    onClose: () => void;
    isVisible: boolean;
}> = ({ message, type, onClose, isVisible }) => {
    const typeClasses = {
        success: 'bg-green-700 border-green-500',
        error: 'bg-red-700 border-red-500',
        info: 'bg-blue-700 border-blue-500',
        warning: 'bg-yellow-700 border-yellow-500',
        critical: 'bg-purple-800 border-purple-500'
    };
    
    const iconMap = {
        success: <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
        error: <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
        info: <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
        warning: <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.938 5.002c-.77-1.333-2.688-1.333-3.458 0L3.308 18.002c-.77 1.333.192 3 1.732 3z" /></svg>,
        critical: <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.938 5.002c-.77-1.333-2.688-1.333-3.458 0L3.308 18.002c-.77 1.333.192 3 1.732 3z" /></svg>
    };

    useEffect(() => {
        let timer: ReturnType<typeof setTimeout>;
        if (isVisible) {
            const duration = type === 'critical' ? 15000 : 7000;
            timer = setTimeout(() => { onClose(); }, duration);
        }
        return () => clearTimeout(timer);
    }, [isVisible, onClose, type]);

    if (!isVisible) return null;
    return (
        <div className={`fixed bottom-8 right-8 p-5 rounded-xl shadow-2xl text-white flex items-start space-x-4 transition-all duration-500 ease-out transform border-l-8 ${typeClasses[type]} ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'}`} style={{zIndex: 1000, minWidth: '300px'}}>
            <div className="flex-shrink-0 mt-1">
                {iconMap[type]}
            </div>
            <div className="flex-grow">
                <span className="text-sm font-bold block capitalize">{type} Alert</span>
                <span className="text-base font-medium">{message}</span>
            </div>
            <button onClick={onClose} className="p-1 rounded-full hover:bg-black/20 focus:outline-none flex-shrink-0 mt-0.5 transition-colors">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
        </div>
    );
};

// --- AI Insight Display Component ---
const AISecurityInsightCard: React.FC<{ insight: AISecurityInsight }> = ({ insight }) => {
    const severityClasses = {
        Critical: 'border-red-600 bg-red-900/20 text-red-300',
        High: 'border-orange-600 bg-orange-900/20 text-orange-300',
        Medium: 'border-yellow-600 bg-yellow-900/20 text-yellow-300',
        Low: 'border-green-600 bg-green-900/20 text-green-300',
    };

    return (
        <div className={`p-4 rounded-xl border-l-4 shadow-lg transition-all duration-300 hover:shadow-xl ${severityClasses[insight.severity]}`}>
            <div className="flex justify-between items-start mb-2">
                <h4 className="font-extrabold text-lg">{insight.summary}</h4>
                <span className={`text-xs font-semibold px-2 py-1 rounded-full ${severityClasses[insight.severity].replace('border-', 'bg-').replace('/20', '/40')}`}>{insight.severity}</span>
            </div>
            <p className="text-sm text-gray-300 mb-3">{insight.recommendation}</p>
            <div className="text-xs text-gray-400 flex justify-between border-t border-current pt-2 mt-2">
                <span>Engine: {insight.sourceModel}</span>
                <span>Detected: {new Date(insight.timestamp).toLocaleString()}</span>
            </div>
        </div>
    );
};

// --- Main Component ---

const SecurityView: React.FC = () => {
    const context = useContext(DataContext);
    const { 
        linkedAccounts, unlinkAccount, handlePlaidSuccess, 
        securityMetrics, auditLogs, threatAlerts, 
        dataSharingPolicies, apiKeys, trustedContacts, 
        securityAwarenessModules, showSystemAlert,
        transactionRules 
    } = context || {};

    const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' | 'info' | 'warning' | 'critical'; isVisible: boolean } | null>(null);
    const [loginActivity, setLoginActivity] = useState<LoginActivity[]>([]);
    const [devices, setDevices] = useState<Device[]>([]);
    const [aiInsights, setAiInsights] = useState<AISecurityInsight[]>([]);
    const [activeTab, setActiveTab] = useState<'overview' | 'policies' | 'keys' | 'ai_analysis'>('overview');
    const [securityScore, setSecurityScore] = useState<number>(75); // Initial mock score

    // --- Mock Data Initialization & AI Simulation ---
    useEffect(() => {
        const now = new Date();
        const pastDate = (days: number) => new Date(now.getTime() - days * 24 * 60 * 60 * 1000).toISOString();

        // Mock Login Activity
        setLoginActivity([
            { id: '1', device: 'Quantum Workstation', browser: 'Chrome 125 (Secure)', os: 'Linux Kernel 6.8', location: 'HQ Server Room', ip: '10.0.0.5', timestamp: pastDate(0.01), isCurrent: true, userAgent: 'EnterpriseAgent/1.0' },
            { id: '2', device: 'Personal Mobile', browser: 'Safari', os: 'iOS 18.0 Beta', location: 'Remote Office', ip: '203.0.113.45', timestamp: pastDate(1.5), isCurrent: false, userAgent: 'MobileSafari/605.1.15' },
            { id: '3', device: 'Legacy VM', browser: 'IE 11', os: 'Windows Server 2012', location: 'Decommissioned Zone', ip: '192.168.1.100', timestamp: pastDate(15), isCurrent: false, userAgent: 'MSIE 11.0;' },
        ]);

        // Mock Devices
        setDevices([
            { id: 'dvc_1', name: 'Primary Workstation', type: 'Desktop', model: 'Custom Build X9', lastActivity: pastDate(0.01), location: 'HQ Server Room', ip: '10.0.0.5', isCurrent: true, permissions: ['read_all', 'write_transactions', 'admin_config'], status: 'active', firstSeen: pastDate(500), userAgent: 'EnterpriseAgent/1.0', pushNotificationsEnabled: true, biometricAuthEnabled: true, encryptionStatus: 'AES-256-GCM' },
            { id: 'dvc_2', name: 'Executive Tablet', type: 'Tablet', model: 'Pad Pro 14', lastActivity: pastDate(0.5), location: 'Remote Office', ip: '203.0.113.45', isCurrent: false, permissions: ['read_reports'], status: 'active', firstSeen: pastDate(120), userAgent: 'MobileSafari/605.1.15', pushNotificationsEnabled: false, biometricAuthEnabled: true, encryptionStatus: 'full' },
        ]);

        // Mock AI Insights based on potential issues
        setAiInsights([
            { 
                id: 'ai_001', 
                timestamp: pastDate(0.1), 
                severity: 'High', 
                summary: 'Unusual Data Access Pattern Detected', 
                recommendation: 'Review recent read operations from Device ID dvc_2 between 02:00 and 04:00 UTC. Initiate temporary read-only lock.', 
                sourceModel: 'BehavioralAnomaly_v3' 
            },
            { 
                id: 'ai_002', 
                timestamp: pastDate(1), 
                severity: 'Medium', 
                summary: 'Outdated OS Detected on Active Device', 
                recommendation: 'Update OS on "Legacy VM" (IP 192.168.1.100) to a supported version or isolate it to a sandbox network segment.', 
                sourceModel: 'VulnerabilityScanner_v1' 
            },
        ]);

        // Simulate loading security metrics if available
        if (securityMetrics && securityMetrics.length > 0) {
            const scoreMetric = securityMetrics.find(m => m.metricName === 'OverallSecurityScore');
            if (scoreMetric) {
                setSecurityScore(Math.round(parseFloat(scoreMetric.currentValue) * 100));
            }
        }

    }, [securityMetrics]);

    // --- Handlers ---
    const showNotification = useCallback((message: string, type: 'success' | 'error' | 'info' | 'warning' | 'critical') => {
        setNotification({ message, type, isVisible: true });
    }, []);

    const closeNotification = useCallback(() => {
        setNotification(prev => prev ? { ...prev, isVisible: false } : null);
    }, []);

    const handleUnlink = (id: string) => {
        if (unlinkAccount) {
            unlinkAccount(id);
            showNotification(`Financial Source ID ${id} successfully revoked access.`, 'success');
        }
    };

    const handlePolicyToggle = (policy: DataSharingPolicy, enabled: boolean) => {
        // In a real app, this would call an API to update the policy state
        console.log(`Policy ${policy.policyId} toggled to ${enabled}`);
        showNotification(`Data Sharing Policy "${policy.policyName}" updated to ${enabled ? 'Active' : 'Inactive'}.`, 'info');
    };

    const handleAPIKeyRevoke = (keyId: string) => {
        // In a real app, this would call an API to revoke the key
        showNotification(`API Key ${keyId.substring(0, 8)}... has been immediately revoked and invalidated.`, 'critical');
    };

    // --- Render Helpers ---

    const renderLinkedAccounts = useMemo(() => (
        <Card title="Financial Data Sources (Plaid Integration)" className="lg:col-span-2">
            <div className="space-y-4">
                <p className="text-gray-400 text-sm border-b border-gray-800 pb-3">Securely manage connections to external financial institutions via encrypted tokenization. Last sync: {new Date().toLocaleTimeString()}</p>
                {linkedAccounts && linkedAccounts.length > 0 ? (
                    <div className="space-y-3">
                        {linkedAccounts.map(account => (
                            <div key={account.id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 bg-gray-800/70 rounded-lg border border-cyan-700/50 shadow-md">
                                <div className="flex items-center mb-2 sm:mb-0">
                                    <div className="w-12 h-12 rounded-xl bg-cyan-900/70 flex items-center justify-center text-cyan-300 mr-4 flex-shrink-0">
                                        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" /></svg>
                                    </div>
                                    <div>
                                        <p className="font-bold text-lg text-white">{account.name}</p>
                                        <p className="text-sm text-gray-400">Institution ID: {account.institutionId} | Mask: {account.mask}</p>
                                    </div>
                                </div>
                                <div className="flex space-x-2 mt-2 sm:mt-0">
                                    <button 
                                        onClick={() => showNotification(`Initiating re-authentication for ${account.name}...`, 'info')}
                                        className="px-3 py-1.5 bg-indigo-900/30 hover:bg-indigo-900/50 text-indigo-300 rounded-lg text-sm transition-colors border border-indigo-700"
                                    >
                                        Re-sync
                                    </button>
                                    <button 
                                        onClick={() => handleUnlink(account.id)}
                                        className="px-3 py-1.5 bg-red-900/50 hover:bg-red-900/70 text-red-300 rounded-lg text-sm transition-colors border border-red-700"
                                    >
                                        Revoke Access
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="p-6 bg-gray-800/50 rounded-lg text-center border border-dashed border-gray-700">
                        <p className="text-gray-500 italic mb-3">No external financial data sources are currently integrated.</p>
                        {handlePlaidSuccess && <PlaidLinkButton onSuccess={handlePlaidSuccess} label="Connect New Financial Source" className="w-full sm:w-auto" />}
                    </div>
                )}
            </div>
        </Card>
    ), [linkedAccounts, handlePlaidSuccess, handleUnlink, showNotification]);

    const renderSecuritySettings = useMemo(() => (
        <Card title="Core Authentication & Access Controls" className="lg:col-span-1">
            <ul className="divide-y divide-gray-700/50">
                <SecuritySettingToggle 
                    id="2fa_quantum"
                    title="Quantum 2FA (Hardware Key Required)" 
                    description="Mandatory FIDO2/WebAuthn hardware key enforcement for all administrative roles. Software TOTP is deprecated." 
                    defaultChecked={true} 
                    aiImpact='High'
                />
                <SecuritySettingToggle 
                    id="biometric_device"
                    title="Device Biometric Trust" 
                    description="Enforce device-level biometric verification for any transaction exceeding $10,000 or configuration change." 
                    defaultChecked={true} 
                    aiImpact='Medium'
                />
                <SecuritySettingToggle 
                    id="session_timeout"
                    title="Zero-Trust Session Invalidation" 
                    description="Sessions automatically terminate after 15 minutes of inactivity, requiring re-authentication via context-aware challenge." 
                    defaultChecked={true} 
                    aiImpact='High'
                />
                <li className="py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-gray-800/70">
                     <div className="flex-grow">
                        <span className="font-bold text-lg text-white flex items-center">Master Credential Management</span>
                        <p className="text-sm text-gray-400">Last rotation: 2024-01-15. Next mandatory rotation: 2025-01-15.</p>
                     </div>
                     <button className="px-6 py-2 bg-indigo-700 hover:bg-indigo-600 text-white font-semibold rounded-lg text-sm transition-colors shadow-lg mt-2 sm:mt-0">
                        Initiate Credential Rotation Protocol
                     </button>
                </li>
            </ul>
        </Card>
    ), []);

    const renderRecentActivity = useMemo(() => (
        <Card title="Real-Time Login Telemetry" className="lg:col-span-1">
            <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                {loginActivity.map(activity => (
                    <div key={activity.id} className="flex items-start justify-between p-3 bg-gray-800/50 rounded-lg border-l-4 border-gray-700 hover:bg-gray-700/50 transition-colors">
                        <div className="flex-grow min-w-0">
                            <p className="font-bold text-white truncate flex items-center gap-2">
                                {activity.device}
                                {activity.isCurrent && <span className="px-2 py-0.5 bg-green-600/50 text-green-200 text-xs rounded-full font-medium flex-shrink-0">LIVE SESSION</span>}
                            </p>
                            <p className="text-xs text-gray-400 mt-1">
                                <span className="font-mono bg-gray-700/50 px-1 rounded mr-1">{activity.ip}</span> 
                                @ {activity.location} ({activity.os})
                            </p>
                        </div>
                        <span className="text-xs text-gray-500 ml-2 flex-shrink-0">{new Date(activity.timestamp).toLocaleTimeString()}</span>
                    </div>
                ))}
            </div>
        </Card>
    ), [loginActivity]);

    const renderActiveDevices = useMemo(() => (
        <Card title="Managed Endpoints Inventory" className="lg:col-span-2">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {devices.map(device => (
                    <div key={device.id} className="p-4 bg-gray-800/50 rounded-lg border border-indigo-700/50 flex flex-col shadow-lg">
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-indigo-900/70 rounded-lg flex items-center justify-center text-indigo-300 flex-shrink-0">
                                    {device.type === 'Mobile' ? (
                                         <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
                                    ) : (
                                         <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                                    )}
                                </div>
                                <p className="font-bold text-white truncate">{device.name}</p>
                            </div>
                            <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${device.status === 'active' ? 'bg-green-600/30 text-green-300' : 'bg-red-600/30 text-red-300'}`}>
                                {device.status.toUpperCase()}
                            </span>
                        </div>
                        <p className="text-xs text-gray-400 mb-2">Model: {device.model} ({device.type})</p>
                        <p className="text-xs text-gray-500 truncate">IP: {device.ip} | Last Seen: {new Date(device.lastActivity).toLocaleTimeString()}</p>
                        <div className="mt-3 pt-2 border-t border-gray-700">
                            <p className="text-xs font-semibold text-cyan-400">Permissions Granted: {device.permissions.length}</p>
                            <div className="flex flex-wrap gap-1 mt-1">
                                {device.permissions.slice(0, 3).map(p => (
                                    <span key={p} className="text-[10px] bg-gray-700 text-gray-300 px-1 rounded">{p}</span>
                                ))}
                                {device.permissions.length > 3 && <span className="text-[10px] text-gray-500">+{device.permissions.length - 3} more</span>}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </Card>
    ), [devices]);

    const renderDataPolicies = useMemo(() => (
        <Card title="Data Governance & Sharing Policies" className="lg:col-span-2">
            <p className="text-sm text-gray-400 mb-4">Define granular controls over how internal and external data sets are processed, stored, and shared. Managed by AI Policy Engine.</p>
            <div className="space-y-4">
                {(dataSharingPolicies || []).map(policy => (
                    <div key={policy.policyId} className="p-4 bg-gray-800/70 rounded-lg border border-purple-700/50 flex flex-col md:flex-row justify-between items-start md:items-center">
                        <div className="flex-grow mb-2 md:mb-0">
                            <p className="font-bold text-white text-lg">{policy.policyName}</p>
                            <p className="text-xs text-gray-400 mt-1">Scope: {policy.scope} | Last Reviewed: {policy.lastReviewed}</p>
                        </div>
                        <div className="flex items-center space-x-4">
                            <span className={`text-sm font-semibold ${policy.isActive ? 'text-green-400' : 'text-red-400'}`}>
                                {policy.isActive ? 'ACTIVE' : 'DRAFT'}
                            </span>
                            <SecuritySettingToggle
                                id={`policy-${policy.policyId}`}
                                title="Enable Policy"
                                description={`Toggle activation for ${policy.policyName}`}
                                defaultChecked={policy.isActive}
                                onToggle={(checked) => handlePolicyToggle(policy, checked)}
                                aiImpact='Medium'
                            />
                        </div>
                    </div>
                ))}
            </div>
        </Card>
    ), [dataSharingPolicies, handlePolicyToggle]);

    const renderAPIKeys = useMemo(() => (
        <Card title="System API Key Management" className="lg:col-span-2">
            <p className="text-sm text-gray-400 mb-4">Manage programmatic access tokens. Keys are automatically rotated by the Quantum Key Vault every 90 days.</p>
            <div className="space-y-3">
                {(apiKeys || []).map(key => (
                    <div key={key.id} className="flex justify-between items-center p-3 bg-gray-800/70 rounded-lg border border-yellow-700/50">
                        <div className="flex items-center min-w-0">
                            <svg className="w-5 h-5 text-yellow-400 mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M6 16h.01" /></svg>
                            <div>
                                <p className="font-mono text-sm text-white truncate">{key.keyName} ({key.id.substring(0, 8)}...)</p>
                                <p className="text-xs text-gray-500">Created: {key.creationDate} | Permissions: {key.scopes.join(', ')}</p>
                            </div>
                        </div>
                        <button 
                            onClick={() => handleAPIKeyRevoke(key.id)}
                            className="px-3 py-1 bg-red-900/30 hover:bg-red-900/50 text-red-300 rounded-md text-xs transition-colors flex-shrink-0 ml-4"
                        >
                            Revoke Now
                        </button>
                    </div>
                ))}
            </div>
        </Card>
    ), [apiKeys, handleAPIKeyRevoke]);

    const renderAIAnalysis = useMemo(() => (
        <div className="space-y-6">
            <Card title={`AI Threat Intelligence Feed (${AI_INSIGHT_ENGINE_VERSION})`}>
                <div className="flex justify-between items-center mb-4 border-b border-gray-800 pb-3">
                    <p className="text-gray-400 text-sm">Real-time behavioral analysis and predictive threat modeling.</p>
                    <span className="text-sm font-bold text-cyan-400">Total Insights: {aiInsights.length}</span>
                </div>
                <div className="space-y-4">
                    {aiInsights.length > 0 ? (
                        aiInsights.map(insight => (
                            <AISecurityInsightCard key={insight.id} insight={insight} />
                        ))
                    ) : (
                        <div className="p-6 bg-gray-800/50 rounded-lg text-center border border-dashed border-gray-700">
                            <p className="text-gray-500 italic">AI Engine reports no immediate high-priority anomalies at this time.</p>
                        </div>
                    )}
                </div>
            </Card>

            <Card title="Security Awareness Training Modules">
                <p className="text-sm text-gray-400 mb-4">Track mandatory compliance training completion status across the organization.</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {(securityAwarenessModules || []).map(module => (
                        <div key={module.moduleId} className="p-4 bg-gray-800/70 rounded-lg border border-green-700/50">
                            <p className="font-bold text-white">{module.title}</p>
                            <p className="text-xs text-gray-400 mt-1">Status: {module.completionRate}% Complete</p>
                            <div className="w-full bg-gray-700 rounded-full h-2.5 mt-2">
                                <div className="bg-green-500 h-2.5 rounded-full" style={{ width: `${module.completionRate}%` }}></div>
                            </div>
                        </div>
                    ))}
                </div>
            </Card>
        </div>
    ), [aiInsights, securityAwarenessModules]);

    const renderAuditLogs = useMemo(() => {
        const displayLogs = (auditLogs || []).slice(0, MAX_AUDIT_LOG_DISPLAY);
        return (
            <Card title={`System Audit Trail (Last ${displayLogs.length} Entries)`} className="lg:col-span-2">
                <p className="text-sm text-gray-400 mb-3">Immutable record of all configuration changes, data access events, and administrative actions.</p>
                <div className="overflow-x-auto max-h-[500px] custom-scrollbar">
                    <table className="min-w-full divide-y divide-gray-700">
                        <thead className="sticky top-0 bg-gray-800 z-10">
                            <tr>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Time</th>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">User/System</th>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Action</th>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Target</th>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-800">
                            {displayLogs.map((log: AuditLogEntry) => (
                                <tr key={log.id} className="hover:bg-gray-800/50 transition-colors">
                                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">{new Date(log.timestamp).toLocaleTimeString()}</td>
                                    <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-white">{log.userId.includes('sys_') ? 'SYSTEM' : log.userId}</td>
                                    <td className="px-4 py-2 text-sm text-cyan-400">{log.action}</td>
                                    <td className="px-4 py-2 text-sm text-gray-400">{log.targetResource}</td>
                                    <td className="px-4 py-2 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${log.success ? 'bg-green-900/50 text-green-300' : 'bg-red-900/50 text-red-300'}`}>
                                            {log.success ? 'SUCCESS' : 'FAILURE'}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {displayLogs.length < (auditLogs?.length || 0) && (
                    <p className="text-center text-sm text-gray-500 mt-3">Displaying first {MAX_AUDIT_LOG_DISPLAY} logs. Load full history via dedicated Audit Console.</p>
                )}
            </Card>
        );
    }, [auditLogs]);

    const renderSecurityScoreGauge = useMemo(() => {
        const radius = 50;
        const circumference = 2 * Math.PI * radius;
        const offset = circumference - (securityScore / 100) * circumference;
        const color = securityScore >= 90 ? 'stroke-green-500' : securityScore >= 70 ? 'stroke-yellow-500' : 'stroke-red-500';

        return (
            <div className="flex flex-col items-center p-6 bg-gray-800/70 rounded-xl shadow-inner border border-gray-700">
                <h3 className="text-xl font-bold text-white mb-3">Quantum Security Index (QSI)</h3>
                <svg width="120" height="120" viewBox="0 0 120 120" className="transform -rotate-90">
                    {/* Background Circle */}
                    <circle
                        cx="60"
                        cy="60"
                        r={radius}
                        fill="transparent"
                        stroke="#374151"
                        strokeWidth="10"
                    />
                    {/* Progress Arc */}
                    <circle
                        cx="60"
                        cy="60"
                        r={radius}
                        fill="transparent"
                        stroke={color.replace('stroke-', '')}
                        strokeWidth="10"
                        strokeDasharray={circumference}
                        strokeDashoffset={offset}
                        strokeLinecap="round"
                        className="transition-all duration-1000 ease-out"
                    />
                    {/* Text */}
                    <text
                        x="60"
                        y="60"
                        dominantBaseline="middle"
                        textAnchor="middle"
                        className="fill-current text-white"
                        fontSize="20"
                        fontWeight="bold"
                    >
                        {securityScore}%
                    </text>
                </svg>
                <p className="text-sm text-gray-400 mt-2">Target: 95%</p>
            </div>
        );
    }, [securityScore]);

    const renderTrustedContacts = useMemo(() => (
        <Card title="Emergency Trusted Contacts" className="lg:col-span-1">
            <p className="text-sm text-gray-400 mb-4">Contacts authorized for emergency account recovery or high-risk alerts.</p>
            <div className="space-y-3">
                {(trustedContacts || []).map((contact: TrustedContact) => (
                    <div key={contact.id} className="flex justify-between items-center p-3 bg-gray-800/50 rounded-lg border border-gray-700">
                        <div className="flex items-center">
                            <div className="w-8 h-8 bg-pink-900/50 rounded-full flex items-center justify-center text-pink-300 mr-3">
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                            </div>
                            <div>
                                <p className="font-semibold text-white">{contact.name}</p>
                                <p className="text-xs text-gray-400">{contact.relationship}</p>
                            </div>
                        </div>
                        <span className={`text-xs font-medium px-2 py-0.5 rounded ${contact.verified ? 'bg-green-900/30 text-green-400' : 'bg-red-900/30 text-red-400'}`}>
                            {contact.verified ? 'Verified' : 'Pending'}
                        </span>
                    </div>
                ))}
            </div>
        </Card>
    ), [trustedContacts]);


    // --- Tab Content Rendering ---
    const renderContent = () => {
        switch (activeTab) {
            case 'overview':
                return (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {renderSecurityScoreGauge}
                        {renderRecentActivity}
                        {renderActiveDevices}
                        {renderLinkedAccounts}
                        {renderSecuritySettings}
                    </div>
                );
            case 'policies':
                return (
                    <div className="grid grid-cols-1 gap-6">
                        {renderDataPolicies}
                        <Card title="Transaction Rule Engine" className="lg:col-span-2">
                            <p className="text-sm text-gray-400 mb-4">Define automated responses to financial events based on predefined risk thresholds.</p>
                            <div className="space-y-3">
                                {(transactionRules || []).map((rule: TransactionRule) => (
                                    <div key={rule.ruleId} className="p-3 bg-gray-800/70 rounded-lg border border-cyan-700/50 flex justify-between items-center">
                                        <div>
                                            <p className="font-bold text-white">{rule.name}</p>
                                            <p className="text-xs text-gray-400">Trigger: {rule.triggerCondition} | Action: {rule.action}</p>
                                        </div>
                                        <span className={`text-xs font-medium px-2 py-0.5 rounded ${rule.isEnabled ? 'bg-green-900/30 text-green-400' : 'bg-red-900/30 text-red-400'}`}>
                                            {rule.isEnabled ? 'ACTIVE' : 'DISABLED'}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    </div>
                );
            case 'keys':
                return (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {renderAPIKeys}
                        {renderTrustedContacts}
                        <Card title="Threat Alert History" className="lg:col-span-3">
                            <p className="text-sm text-gray-400 mb-4">Historical record of confirmed security incidents.</p>
                            <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                                {(threatAlerts || []).map((alert: ThreatAlert) => (
                                    <div key={alert.alertId} className="p-3 bg-red-900/30 rounded-lg border border-red-600 flex justify-between items-center">
                                        <div>
                                            <p className="font-bold text-red-300">{alert.title}</p>
                                            <p className="text-xs text-gray-300">{alert.description}</p>
                                        </div>
                                        <span className="text-xs text-gray-300">{new Date(alert.timestamp).toLocaleDateString()}</span>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    </div>
                );
            case 'ai_analysis':
                return (
                    <div className="grid grid-cols-1 gap-6">
                        {renderAIAnalysis}
                        {renderAuditLogs}
                    </div>
                );
            default:
                return null;
        }
    };

    // --- Tab Navigation ---
    const tabs: { id: typeof activeTab, label: string }[] = [
        { id: 'overview', label: 'Overview & Access' },
        { id: 'policies', label: 'Governance & Rules' },
        { id: 'keys', label: 'API & Contacts' },
        { id: 'ai_analysis', label: 'AI Threat Analysis' },
    ];

    return (
        <div className="space-y-8 p-4 sm:p-8">
            <header className="pb-4 border-b border-gray-700">
                <h1 className="text-4xl font-extrabold text-white tracking-tighter">Enterprise Security Command Center</h1>
                <p className="text-lg text-gray-400 mt-1">Centralized control plane for data integrity, access management, and threat mitigation. Engine Version: {AI_INSIGHT_ENGINE_VERSION}</p>
            </header>

            {/* Tab Navigation */}
            <div className="flex border-b border-gray-700 overflow-x-auto">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`px-6 py-3 text-lg font-semibold transition-all duration-300 whitespace-nowrap
                            ${activeTab === tab.id 
                                ? 'text-cyan-400 border-b-4 border-cyan-500' 
                                : 'text-gray-400 hover:text-white hover:border-b-4 hover:border-gray-600'
                            }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            <main>
                {renderContent()}
            </main>

            {notification && (
                <NotificationToast 
                    message={notification.message} 
                    type={notification.type} 
                    isVisible={notification.isVisible} 
                    onClose={closeNotification} 
                />
            )}
        </div>
    );
};

export default SecurityView;


================================================================================
// APPENDED FROM REPO: diplomat-bit/G20 | ORIGINAL PATH: diplomat-bit-G20-0199fa7/components/SecurityView.tsx
================================================================================

import React from 'react';

const SecurityView: React.FC = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">Security & Privacy</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-800/50 backdrop-blur-md p-6 rounded-2xl border border-gray-700">
          <h3 className="text-sm font-medium text-gray-400 mb-2">Two-Factor Authentication</h3>
          <p className="text-green-400 font-bold">Enabled</p>
          <button className="mt-4 text-sm text-blue-400 hover:underline">Manage 2FA Settings</button>
        </div>
        <div className="bg-gray-800/50 backdrop-blur-md p-6 rounded-2xl border border-gray-700">
          <h3 className="text-sm font-medium text-gray-400 mb-2">Login History</h3>
          <p className="text-gray-300">Last login: Today, 12:45 PM from San Francisco, CA</p>
          <button className="mt-4 text-sm text-blue-400 hover:underline">View Full History</button>
        </div>
      </div>
    </div>
  );
};

export default SecurityView;


================================================================================
// APPENDED FROM REPO: diplomat-bit/jamesburvelocallaghaniiiand | ORIGINAL PATH: diplomat-bit-jamesburvelocallaghaniiiand-9414e97/components/SecurityView.tsx
================================================================================

```typescript
import React, { useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { DataContext } from '../context/DataContext';
import Card from './Card';
import PlaidLinkButton from './PlaidLinkButton';
import {
    LoginActivity, Device, DataSharingPolicy, TransactionRule, ThreatAlert,
    AuditLogEntry, APIKey, TrustedContact, SecurityAwarenessModule, SecurityScoreMetric, UserProfile
} from '../types';

// --- AI/ML Integration Placeholder Types (Simulated for expansion) ---
interface A_AISecurityInsight {
    id: string;
    timestamp: string;
    severity: 'Low' | 'Medium' | 'High' | 'Critical';
    summary: string;
    recommendation: string;
    sourceModel: string;
}

// --- Constants for The James Burvel O’Callaghan III Code Billion Dollar Features ---
const A_AI_INSIGHT_ENGINE_VERSION = "ChaosEngine v0.0.1-Garbage-O'Callaghan";
const A_MAX_AUDIT_LOG_DISPLAY = 50; // Increased for depth and detail
const A_MAX_THREAT_ALERTS_DISPLAY = 25; // New Constant
const A_SECURITY_SCORE_TARGET = 98; // Explicit Target
const A_ENTERPRISE_BRANDING = "The James Burvel O'Callaghan III Code™ - SecurityView"; // Deterministic Branding
const A_UI_REFRESH_INTERVAL = 60000; // Auto Refresh
const A_DEFAULT_RISK_THRESHOLD = 0.75; // Risk Threshold

// --- Company Entity Definition (The James Burvel O’Callaghan III Code) ---
interface A_JBOCO_Company {
    companyId: string;
    companyName: string;
    industry: string;
    headquarters: string;
    securityContact: string;
    dataRetentionPolicy: string;
    complianceCertifications: string[];
    incidentResponsePlan: string;
    threatIntelligenceFeed: string;
    securityBudget: number;
    employeeCount: number;
    technologyStack: string[];
    riskAppetite: string;
    insurancePolicy: string;
    legalJurisdiction: string;
    businessContinuityPlan: string;
    disasterRecoveryPlan: string;
    vendorSecurityAssessment: string;
}

const A_JBOCO_AlphaCorp: A_JBOCO_Company = {
    companyId: "AlphaCorp001",
    companyName: "AlphaCorp Global Solutions",
    industry: "Technology Consulting",
    headquarters: "New York, NY",
    securityContact: "security@alphacorp.com",
    dataRetentionPolicy: "7 years",
    complianceCertifications: ["ISO 27001", "SOC 2"],
    incidentResponsePlan: "AlphaCorp Incident Response v3.0",
    threatIntelligenceFeed: "DarkTrace Enterprise",
    securityBudget: 5000000,
    employeeCount: 5000,
    technologyStack: ["AWS", "Azure", "GCP", "Kubernetes"],
    riskAppetite: "Moderate",
    insurancePolicy: "CyberGuard Premium",
    legalJurisdiction: "Delaware",
    businessContinuityPlan: "AlphaCorp BCP 2024",
    disasterRecoveryPlan: "AlphaCorp DRP 2024",
    vendorSecurityAssessment: "Annual SOC 2 Type II"
};

// --- Helper Components (The James Burvel O’Callaghan III Code) ---
export const A_SecuritySettingToggle: React.FC<{
    id: string;
    title: string;
    description: string;
    defaultChecked: boolean;
    onToggle?: (checked: boolean) => void;
    disabled?: boolean;
    aiImpact?: 'High' | 'Medium' | 'Low' | 'None';
    jbocoBranding?: string; // Explicitly Pass Branding
}> = ({ id, title, description, defaultChecked, onToggle, disabled, aiImpact = 'None', jbocoBranding = A_ENTERPRISE_BRANDING }) => {
    const [A_isChecked, A_setIsChecked] = useState(defaultChecked);
    const { showSystemAlert } = useContext(DataContext) || {};

    const A_handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const A_newState = e.target.checked;
        A_setIsChecked(A_newState);
        onToggle && onToggle(A_newState);
        if (showSystemAlert) {
            const A_impactColor = aiImpact === 'High' ? 'text-red-400' : aiImpact === 'Medium' ? 'text-yellow-400' : 'text-green-400';
            showSystemAlert(`${jbocoBranding}: Configuration Change Detected: ${title} set to ${A_newState ? 'Enabled' : 'Disabled'}. AI Risk Assessment: ${aiImpact}.`, 'info');
        }
    };

    const A_aiIndicator = useMemo(() => {
        if (aiImpact === 'None') return null;
        const A_colorMap = {
            High: 'bg-red-500',
            Medium: 'bg-yellow-500',
            Low: 'bg-blue-500',
        };
        return (
            <span className={`ml-3 px-2 py-0.5 text-xs font-bold rounded-full text-white ${A_colorMap[aiImpact]}`}>
                AI {aiImpact}
            </span>
        );
    }, [aiImpact]);

    return (
        <li className="py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-gray-800/70">
            <div className="flex-grow">
                <label htmlFor={`toggle-${id}`} className="font-bold text-lg text-white cursor-pointer flex items-center">
                    {title}
                    {A_aiIndicator}
                </label>
                <p className="text-sm text-gray-400 max-w-xl mt-1">{description}</p>
            </div>
            <div className="flex items-center mt-2 sm:mt-0">
                <span className={`mr-3 text-sm font-medium ${A_isChecked ? 'text-green-400' : 'text-red-400'}`}>
                    {A_isChecked ? 'ACTIVE' : 'INACTIVE'}
                </span>
                <input
                    type="checkbox"
                    id={`toggle-${id}`}
                    className="toggle toggle-cyan toggle-lg"
                    checked={A_isChecked}
                    onChange={A_handleChange}
                    disabled={disabled}
                    aria-label={`Toggle for ${title}`}
                />
            </div>
        </li>
    );
};

export const B_NotificationToast: React.FC<{
    message: string;
    type: 'success' | 'error' | 'info' | 'warning' | 'critical';
    onClose: () => void;
    isVisible: boolean;
    jbocoBranding?: string; // Explicitly Pass Branding
}> = ({ message, type, onClose, isVisible, jbocoBranding = A_ENTERPRISE_BRANDING }) => {
    const B_typeClasses = {
        success: 'bg-green-700 border-green-500',
        error: 'bg-red-700 border-red-500',
        info: 'bg-blue-700 border-blue-500',
        warning: 'bg-yellow-700 border-yellow-500',
        critical: 'bg-purple-800 border-purple-500'
    };

    const B_iconMap = {
        success: <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
        error: <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
        info: <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
        warning: <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.938 5.002c-.77-1.333-2.688-1.333-3.458 0L3.308 18.002c-.77 1.333.192 3 1.732 3z" /></svg>,
        critical: <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.938 5.002c-.77-1.333-2.688-1.333-3.458 0L3.308 18.002c-.77 1.333.192 3 1.732 3z" /></svg>
    };

    useEffect(() => {
        let B_timer: ReturnType<typeof setTimeout>;
        if (isVisible) {
            const B_duration = type === 'critical' ? 15000 : 7000;
            B_timer = setTimeout(() => { onClose(); }, B_duration);
        }
        return () => clearTimeout(B_timer);
    }, [isVisible, onClose, type]);

    if (!isVisible) return null;
    return (
        <div className={`fixed bottom-8 right-8 p-5 rounded-xl shadow-2xl text-white flex items-start space-x-4 transition-all duration-500 ease-out transform border-l-8 ${B_typeClasses[type]} ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'}`} style={{ zIndex: 1000, minWidth: '300px' }}>
            <div className="flex-shrink-0 mt-1">
                {B_iconMap[type]}
            </div>
            <div className="flex-grow">
                <span className="text-sm font-bold block capitalize">{type} Alert - {jbocoBranding}</span>
                <span className="text-base font-medium">{message}</span>
            </div>
            <button onClick={onClose} className="p-1 rounded-full hover:bg-black/20 focus:outline-none flex-shrink-0 mt-0.5 transition-colors">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
        </div>
    );
};

// --- AI Insight Display Component (The James Burvel O’Callaghan III Code) ---
const C_AISecurityInsightCard: React.FC<{ insight: A_AISecurityInsight; jbocoBranding?: string; }> = ({ insight, jbocoBranding = A_ENTERPRISE_BRANDING }) => {
    const C_severityClasses = {
        Critical: 'border-red-600 bg-red-900/20 text-red-300',
        High: 'border-orange-600 bg-orange-900/20 text-orange-300',
        Medium: 'border-yellow-600 bg-yellow-900/20 text-yellow-300',
        Low: 'border-green-600 bg-green-900/20 text-green-300',
    };

    return (
        <div className={`p-4 rounded-xl border-l-4 shadow-lg transition-all duration-300 hover:shadow-xl ${C_severityClasses[insight.severity]}`}>
            <div className="flex justify-between items-start mb-2">
                <h4 className="font-extrabold text-lg">{insight.summary} - {jbocoBranding}</h4>
                <span className={`text-xs font-semibold px-2 py-1 rounded-full ${C_severityClasses[insight.severity].replace('border-', 'bg-').replace('/20', '/40')}`}>{insight.severity}</span>
            </div>
            <p className="text-sm text-gray-300 mb-3">{insight.recommendation}</p>
            <div className="text-xs text-gray-400 flex justify-between border-t border-current pt-2 mt-2">
                <span>Engine: {insight.sourceModel}</span>
                <span>Detected: {new Date(insight.timestamp).toLocaleString()}</span>
            </div>
        </div>
    );
};

// --- Expert Level Function Composition (The James Burvel O’Callaghan III Code) ---
const D_expertFunction = (initialValue: number) => (
    (x: number) => (y: number) => (z: number) => (a: number) => (b: number) => (c: number) => (d: number) => (e: number) => (f: number) => (g: number) => (h: number) => (i: number) => (j: number) => (k: number) => (l: number) => (m: number) => (n: number) => (o: number) => (p: number) => (q: number) => (r: number) => (s: number) => (t: number) => (u: number) => (v: number) => (w: number) => (xx: number) => (yy: number) => (zz: number) => (aa: number) => (bb: number) => (cc: number) => (dd: number) => (ee: number) => (ff: number) => (gg: number) => (hh: number) => (ii: number) => (jj: number) => (kk: number) => (ll: number) => (mm: number) => (nn: number) => (oo: number) => (pp: number) => (qq: number) => (rr: number) => (ss: number) => (tt: number) => (uu: number) => (vv: number) => (ww: number) => (xxx: number) => (yyy: number) => (zzz: number) => (aaaa: number) => (bbbb: number) => (cccc: number) => (dddd: number) => (eeee: number) => (ffff: number) => (gggg: number) => (hhhh: number) => (iiii: number) => (jjjj: number) => (kkkk: number) => (llll: number) => (mmmm: number) => (nnnn: number) => (oooo: number) => (pppp: number) => (qqqq: number) => (rrrr: number) => (ssss: number) => (tttt: number) => (uuuu: number) => (vvvv: number) => (wwww: number) => (xxxxx: number) => (yyyyy: number) => (zzzzz: number) => (aaaaa: number) => (bbbbb: number) => (ccccc: number) => (ddddd: number) => (eeeee: number) => (fffff: number) => (ggggg: number) => (hhhhh: number) => (iiiii: number) => (jjjjj: number) => (kkkkk: number) => (lllll: number) => (mmmmm: number) => (nnnnn: number) => (ooooo: number) => (ppppp: number) => (qqqqq: number) => (rrrrr: number) => (sssss: number) => (ttttt: number) => (uuuuu: number) => (vvvvv: number) => (wwwww: number) => (xxxxx: number) => (yyyyyy: number) => (zzzzzz: number) => (aaaaaa: number) => (bbbbbb: number) => (cccccc: number) => (dddddd: number) => (eeeeee: number) => (ffffff: number) => (gggggg: number) => (hhhhhh: number) => (iiiiii: number) => (jjjjjj: number) => (kkkkkk: number) => (llllll: number) => (mmmmmm: number) => (nnnnnn: number) => (oooooo: number) => (pppppp: number) => (qqqqqq: number) => (rrrrrr: number) => (ssssss: number) => (tttttt: number) => (uuuuuu: number) => (vvvvvv: number) => (wwwwww: number) => (xxxxxxx: number) => (yyyyyyy: number) => (zzzzzzz: number) => initialValue + x + y + z + a + b + c + d + e + f + g + h + i + j + k + l + m + n + o + p + q + r + s + t + u + v + w + xx + yy + zz + aa + bb + cc + dd + ee + ff + gg + hh + ii + jj + kk + ll + mm + nn + oo + pp + qq + rr + ss + tt + uu + vv + ww + xxx + yyy + zzz + aaaa + bbbb + cccc + dddd + eeee + ffff + gggg + hhhh + iiii + jjjj + kkkk + llll + mmmm + nnnn + oooo + pppp + qqqq + rrrr + ssss + tttt + uuuu + vvvv + wwww + xxxxx + yyyyy + zzzzz + aaaaa + bbbbb + ccccc + ddddd + eeeee + fffff + ggggg + hhhhh + iiiii + jjjjj + kkkkk + lllll + mmmmm + nnnnn + ooooo + ppppp + qqqqq + rrrrr + sssss + ttttt + uuuuu + vvvvv + wwwww + xxxxxx + yyyyyy + zzzzzz + aaaaaa + bbbbbb + cccccc + dddddd + eeeeee + ffffff + gggggg + hhhhhh + iiiiii + jjjjjj + kkkkkk + llllll + mmmmmm + nnnnnn + oooooo + pppppp + qqqqqq + rrrrrr + ssssss + tttttt + uuuuuu + vvvvvv + wwwwww + xxxxxx + yyyyyyy + zzzzzzz
);

// --- Main Component (The James Burvel O’Callaghan III Code) ---
const SecurityView: React.FC<{ jbocoBranding?: string; }> = ({ jbocoBranding = A_ENTERPRISE_BRANDING }) => {
    const E_context = useContext(DataContext);
    const {
        linkedAccounts, unlinkAccount, handlePlaidSuccess,
        securityMetrics, auditLogs, threatAlerts,
        dataSharingPolicies, apiKeys, trustedContacts,
        securityAwarenessModules, showSystemAlert,
        transactionRules, userProfile
    } = E_context || {};

    const [F_notification, F_setNotification] = useState<{ message: string; type: 'success' | 'error' | 'info' | 'warning' | 'critical'; isVisible: boolean } | null>(null);
    const [G_loginActivity, G_setLoginActivity] = useState<LoginActivity[]>([]);
    const [H_devices, H_setDevices] = useState<Device[]>([]);
    const [I_aiInsights, I_setAiInsights] = useState<A_AISecurityInsight[]>([]);
    const [J_activeTab, J_setActiveTab] = useState<'overview' | 'policies' | 'keys' | 'ai_analysis' | 'user_profile'>('overview'); // Extended Tab
    const [K_securityScore, K_setSecurityScore] = useState<number>(75); // Initial mock score
    const [L_threatAlertsDisplay, L_setThreatAlertsDisplay] = useState<ThreatAlert[]>([]); // For controlled display
    const [M_riskThreshold, M_setRiskThreshold] = useState<number>(A_DEFAULT_RISK_THRESHOLD); // Dynamic Risk
    const [N_userAvatar, N_setUserAvatar] = useState<string | null>(null); // User Avatar
    const [O_lastSyncTimestamp, O_setLastSyncTimestamp] = useState<number>(Date.now()); // Sync Timestamp
    const [P_auditLogPage, P_setAuditLogPage] = useState<number>(1); // Audit Log Pagination

    // --- Mock Data Initialization & AI Simulation (The James Burvel O’Callaghan III Code) ---
    useEffect(() => {
        const Q_now = new Date();
        const Q_pastDate = (days: number) => new Date(Q_now.getTime() - days * 24 * 60 * 60 * 1000).toISOString();

        // Mock Login Activity (Expanded and Detailed)
        G_setLoginActivity([
            { id: '1', device: 'Quantum Workstation', browser: 'Chrome 125 (Secure)', os: 'Linux Kernel 6.8', location: 'HQ Server Room', ip: '10.0.0.5', timestamp: Q_pastDate(0.01), isCurrent: true, userAgent: 'EnterpriseAgent/1.0', country: 'US', city: 'New York', hardwareId: 'HW-2024-Q1', authenticationMethod: 'FIDO2' },
            { id: '2', device: 'Personal Mobile', browser: 'Safari', os: 'iOS 18.0 Beta', location: 'Remote Office', ip: '203.0.113.45', timestamp: Q_pastDate(1.5), isCurrent: false, userAgent: 'MobileSafari/605.1.15', country: 'CA', city: 'Toronto', hardwareId: 'MB-2023-Pro', authenticationMethod: 'Biometric' },
            { id: '3', device: 'Legacy VM', browser: 'IE 11', os: 'Windows Server 2012', location: 'Decommissioned Zone', ip: '192.168.1.100', timestamp: Q_pastDate(15), isCurrent: false, userAgent: 'MSIE 11.0;', country: 'Unknown', city: 'Unknown', hardwareId: 'VM-Legacy', authenticationMethod: 'Password' },
            { id: '4', device: 'Backup Server', browser: 'N/A', os: 'Linux CentOS 7', location: 'Data Center B', ip: '172.16.0.20', timestamp: Q_pastDate(30), isCurrent: false, userAgent: 'BackupAgent/2.0', country: 'US', city: 'Chicago', hardwareId: 'SRV-Backup-01', authenticationMethod: 'SSH Key' },
            { id: '5', device: 'Admin Laptop', browser: 'Firefox', os: 'macOS Sonoma', location: 'Home Office', ip: '10.1.10.50', timestamp: Q_pastDate(0.2), isCurrent: false, userAgent: 'Mozilla/5.0', country: 'GB', city: 'London', hardwareId: 'LB-Admin-2024', authenticationMethod: 'TOTP' },
        ]);

        // Mock Devices (Expanded Device Details)
        H_setDevices([
            { id: 'dvc_1', name: 'Primary Workstation', type: 'Desktop', model: 'Custom Build X9', lastActivity: Q_pastDate(0.01), location: 'HQ Server Room', ip: '10.0.0.5', isCurrent: true, permissions: ['read_all', 'write_transactions', 'admin_config', 'execute_scripts'], status: 'active', firstSeen: Q_pastDate(500), userAgent: 'EnterpriseAgent/1.0', pushNotificationsEnabled: true, biometricAuthEnabled: true, encryptionStatus: 'AES-256-GCM', osVersion: 'Linux Kernel 6.8', firewallStatus: 'Active', antivirusStatus: 'Up-to-date', diskSpace: 512, memory: 32, cpuCores: 8, lastScan: Q_pastDate(0.001) },
            { id: 'dvc_2', name: 'Executive Tablet', type: 'Tablet', model: 'Pad Pro 14', lastActivity: Q_pastDate(0.5), location: 'Remote Office', ip: '203.0.113.45', isCurrent: false, permissions: ['read_reports', 'view_dashboards'], status: 'active', firstSeen: Q_pastDate(120), userAgent: 'MobileSafari/605.1.15', pushNotificationsEnabled: false, biometricAuthEnabled: true, encryptionStatus: 'full', osVersion: 'iOS 18.0 Beta', firewallStatus: 'Inactive', antivirusStatus: 'N/A', diskSpace: 256, memory: 8, cpuCores: 4, lastScan: Q_pastDate(1) },
            { id: 'dvc_3', name: 'Dev Server', type: 'Server', model: 'Dell PowerEdge', lastActivity: Q_pastDate(2), location: 'Data Center A', ip: '192.168.2.10', isCurrent: false, permissions: ['deploy_code', 'access_database'], status: 'active', firstSeen: Q_pastDate(365), userAgent: 'ServerAgent/1.0', pushNotificationsEnabled: false, biometricAuthEnabled: false, encryptionStatus: 'partial', osVersion: 'Ubuntu 22.04', firewallStatus: 'Active', antivirusStatus: 'Active', diskSpace: 1024, memory: 64, cpuCores: 16, lastScan: Q_pastDate(0.5) },
        ]);

        // Mock AI Insights (More diverse insights)
        I_setAiInsights([
            { id: 'ai_001', timestamp: Q_pastDate(0.1), severity: 'High', summary: 'Unusual Data Access Pattern Detected', recommendation: 'Review recent read operations from Device ID dvc_2 between 02:00 and 04:00 UTC. Initiate temporary read-only lock. Analyze user behavior for anomalies.', sourceModel: 'BehavioralAnomaly_v3' },
            { id: 'ai_002', timestamp: Q_pastDate(1), severity: 'Medium', summary: 'Outdated OS Detected on Active Device', recommendation: 'Update OS on "Legacy VM" (IP 192.168.1.100) to a supported version or isolate it to a sandbox network segment. Schedule automated patch deployment.', sourceModel: 'VulnerabilityScanner_v1' },
            { id: 'ai_003', timestamp: Q_pastDate(0.5), severity: 'Low', summary: 'Potential Phishing Attempt Detected', recommendation: 'Monitor email activity for user associated with Device ID dvc_1. Provide security awareness training.', sourceModel: 'EmailAnalysis_v1' },
            { id: 'ai_004', timestamp: Q_pastDate(2), severity: 'Critical', summary: 'Unauthorized Access Attempt from External IP', recommendation: 'Block IP address 45.123.45.67 immediately. Investigate source and scope of the intrusion attempt. Initiate forensic analysis.', sourceModel: 'IntrusionDetection_v2' },
        ]);

        // Mock Threat Alerts (Comprehensive Threat Scenarios)
        if (threatAlerts === undefined || threatAlerts.length === 0) {
            const R_mockThreatAlerts: ThreatAlert[] = [
                { alertId: 'ta_001', timestamp: Q_pastDate(0.02), title: 'Ransomware Attack Detected', description: 'System files encrypted. Source: Unknown. Isolate affected systems immediately.', severity: 'Critical', status: 'Active' },
                { alertId: 'ta_002', timestamp: Q_pastDate(0.1), title: 'DDoS Attack on Web Servers', description: 'High traffic volume detected. Mitigation in progress. Monitor server performance.', severity: 'High', status: 'Mitigated' },
                { alertId: 'ta_003', timestamp: Q_pastDate(0.5), title: 'SQL Injection Attempt', description: 'Attempt to inject malicious SQL code. Prevented by firewall. Review logs for further activity.', severity: 'Medium', status: 'Resolved' },
                { alertId: 'ta_004', timestamp: Q_pastDate(2), title: 'Account Compromise Detected', description: 'Unusual login activity detected. User account locked. Initiate password reset.', severity: 'High', status: 'Active' },
                { alertId: 'ta_005', timestamp: Q_pastDate(7), title: 'Malware Detected in Email Attachment', description: 'Malicious attachment blocked. Sender: suspicious@example.com. Update antivirus definitions.', severity: 'Low', status: 'Resolved' },
                { alertId: 'ta_006', timestamp: Q_pastDate(14), title: 'Data Exfiltration Attempt', description: 'Large volume of data transferred to external IP. Investigate user activity and data sensitivity.', severity: 'Critical', status: 'Active' },
            ];
        }
        if (threatAlerts) L_setThreatAlertsDisplay(threatAlerts.slice(0, A_MAX_THREAT_ALERTS_DISPLAY)); // Initial Display

        // Simulate loading security metrics if available
        if (securityMetrics && securityMetrics.length > 0) {
            const S_scoreMetric = securityMetrics.find(m => m.metricName === 'OverallSecurityScore');
            if (S_scoreMetric) {
                K_setSecurityScore(Math.round(parseFloat(S_scoreMetric.currentValue) * 100));
            }
        }

        // Fetch User Avatar (Mock Implementation)
        if (userProfile) {
            N_setUserAvatar(userProfile.avatarUrl || 'https://via.placeholder.com/150'); // Default Placeholder
        }

        // Periodic UI Refresh
        const T_refreshInterval = setInterval(() => {
            O_setLastSyncTimestamp(Date.now());
            // Simulate background data sync
            console.log(`${jbocoBranding}: Auto-refreshing UI data...`);
        }, A_UI_REFRESH_INTERVAL);

        return () => clearInterval(T_refreshInterval); // Cleanup Interval

    }, [securityMetrics, threatAlerts, userProfile, jbocoBranding]);

    // --- Handlers (The James Burvel O’Callaghan III Code) ---
    const U_showNotification = useCallback((message: string, type: 'success' | 'error' | 'info' | 'warning' | 'critical') => {
        F_setNotification({ message, type, isVisible: true });
    }, []);

    const V_closeNotification = useCallback(() => {
        F_setNotification(prev => prev ? { ...prev, isVisible: false } : null);
    }, []);

    const W_handleUnlink = (id: string) => {
        if (unlinkAccount) {
            unlinkAccount(id);
            U_showNotification(`${jbocoBranding}: Financial Source ID ${id} successfully revoked access.`, 'success');
        }
    };

    const X_handlePolicyToggle = (policy: DataSharingPolicy, enabled: boolean) => {
        console.log(`${jbocoBranding}: Policy ${policy.policyId} toggled to ${enabled}`);
        U_showNotification(`${jbocoBranding}: Data Sharing Policy "${policy.policyName}" updated to ${enabled ? 'Active' : 'Inactive'}.`, 'info');
    };

    const Y_handleAPIKeyRevoke = (keyId: string) => {
        U_showNotification(`${jbocoBranding}: API Key ${keyId.substring(0, 8)}... has been immediately revoked and invalidated.`, 'critical');
    };

    const Z_handleRiskThresholdChange = (newThreshold: number) => {
        M_setRiskThreshold(newThreshold);
        U_showNotification(`${jbocoBranding}: Risk Threshold updated to ${newThreshold.toFixed(2)}.`, 'info');
    };

    const AA_handleThreatAlertDismiss = (alertId: string) => {
        // Mock implementation to simulate dismissing the alert.
        const AA_updatedAlerts = L_threatAlertsDisplay.filter(alert => alert.alertId !== alertId);
        L_setThreatAlertsDisplay(AA_updatedAlerts);
        U_showNotification(`${jbocoBranding}: Threat Alert ${alertId.substring(0, 8)} dismissed.`, 'success');
    };

    const BB_handleAuditLogPageChange = (newPage: number) => {
        P_setAuditLogPage(newPage);
    };

    // --- Render Helpers (The James Burvel O’Callaghan III Code) ---
    const CC_renderLinkedAccounts = useMemo(() => (
        <Card title={`Financial Data Sources (Plaid Integration) - ${jbocoBranding}`} className="lg:col-span-2">
            <div className="space-y-4">
                <p className="text-gray-400 text-sm border-b border-gray-800 pb-3">Securely manage connections to external financial institutions via encrypted tokenization. Last sync: {new Date(O_lastSyncTimestamp).toLocaleTimeString()}</p>
                {linkedAccounts && linkedAccounts.length >

================================================================================
// APPENDED FROM REPO: diplomat-bit/magic | ORIGINAL PATH: diplomat-bit-magic-a3f5ff1/components/SecurityView (1).tsx
================================================================================


import React, { useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { DataContext } from '../context/DataContext';
import Card from './Card';
import PlaidLinkButton from './PlaidLinkButton';
import { 
    LoginActivity, Device, DataSharingPolicy, TransactionRule, ThreatAlert, 
    AuditLogEntry, APIKey, TrustedContact, SecurityAwarenessModule, SecurityScoreMetric, UserProfile 
} from '../types';

// --- AI/ML Integration Placeholder Types (Simulated for expansion) ---
interface AISecurityInsight {
    id: string;
    timestamp: string;
    severity: 'Low' | 'Medium' | 'High' | 'Critical';
    summary: string;
    recommendation: string;
    sourceModel: string;
}

// --- Constants for Billion Dollar Features ---
const AI_INSIGHT_ENGINE_VERSION = "ChaosEngine v0.0.1-Garbage";
const MAX_AUDIT_LOG_DISPLAY = 5;

// --- Helper Components ---

export const SecuritySettingToggle: React.FC<{
    id: string;
    title: string;
    description: string;
    defaultChecked: boolean;
    onToggle?: (checked: boolean) => void;
    disabled?: boolean;
    aiImpact?: 'High' | 'Medium' | 'Low' | 'None';
}> = ({ id, title, description, defaultChecked, onToggle, disabled, aiImpact = 'None' }) => {
    const [isChecked, setIsChecked] = useState(defaultChecked);
    const { showSystemAlert } = useContext(DataContext) || {};

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newState = e.target.checked;
        setIsChecked(newState);
        onToggle && onToggle(newState);
        
        if (showSystemAlert) {
            const impactColor = aiImpact === 'High' ? 'text-red-400' : aiImpact === 'Medium' ? 'text-yellow-400' : 'text-green-400';
            showSystemAlert(`Configuration Change Detected: ${title} set to ${newState ? 'Enabled' : 'Disabled'}. AI Risk Assessment: ${aiImpact}.`, 'info');
        }
    };

    const aiIndicator = useMemo(() => {
        if (aiImpact === 'None') return null;
        const colorMap = {
            High: 'bg-red-500',
            Medium: 'bg-yellow-500',
            Low: 'bg-blue-500',
        };
        return (
            <span className={`ml-3 px-2 py-0.5 text-xs font-bold rounded-full text-white ${colorMap[aiImpact]}`}>
                AI {aiImpact}
            </span>
        );
    }, [aiImpact]);

    return (
        <li className="py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-gray-800/70">
            <div className="flex-grow">
                <label htmlFor={`toggle-${id}`} className="font-bold text-lg text-white cursor-pointer flex items-center">
                    {title}
                    {aiIndicator}
                </label>
                <p className="text-sm text-gray-400 max-w-xl mt-1">{description}</p>
            </div>
            <div className="flex items-center mt-2 sm:mt-0">
                <span className={`mr-3 text-sm font-medium ${isChecked ? 'text-green-400' : 'text-red-400'}`}>
                    {isChecked ? 'ACTIVE' : 'INACTIVE'}
                </span>
                <input
                    type="checkbox"
                    id={`toggle-${id}`}
                    className="toggle toggle-cyan toggle-lg"
                    checked={isChecked}
                    onChange={handleChange}
                    disabled={disabled}
                    aria-label={`Toggle for ${title}`}
                />
            </div>
        </li>
    );
};

export const NotificationToast: React.FC<{
    message: string;
    type: 'success' | 'error' | 'info' | 'warning' | 'critical';
    onClose: () => void;
    isVisible: boolean;
}> = ({ message, type, onClose, isVisible }) => {
    const typeClasses = {
        success: 'bg-green-700 border-green-500',
        error: 'bg-red-700 border-red-500',
        info: 'bg-blue-700 border-blue-500',
        warning: 'bg-yellow-700 border-yellow-500',
        critical: 'bg-purple-800 border-purple-500'
    };
    
    const iconMap = {
        success: <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
        error: <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
        info: <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
        warning: <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.938 5.002c-.77-1.333-2.688-1.333-3.458 0L3.308 18.002c-.77 1.333.192 3 1.732 3z" /></svg>,
        critical: <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.938 5.002c-.77-1.333-2.688-1.333-3.458 0L3.308 18.002c-.77 1.333.192 3 1.732 3z" /></svg>
    };

    useEffect(() => {
        let timer: ReturnType<typeof setTimeout>;
        if (isVisible) {
            const duration = type === 'critical' ? 15000 : 7000;
            timer = setTimeout(() => { onClose(); }, duration);
        }
        return () => clearTimeout(timer);
    }, [isVisible, onClose, type]);

    if (!isVisible) return null;
    return (
        <div className={`fixed bottom-8 right-8 p-5 rounded-xl shadow-2xl text-white flex items-start space-x-4 transition-all duration-500 ease-out transform border-l-8 ${typeClasses[type]} ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'}`} style={{zIndex: 1000, minWidth: '300px'}}>
            <div className="flex-shrink-0 mt-1">
                {iconMap[type]}
            </div>
            <div className="flex-grow">
                <span className="text-sm font-bold block capitalize">{type} Alert</span>
                <span className="text-base font-medium">{message}</span>
            </div>
            <button onClick={onClose} className="p-1 rounded-full hover:bg-black/20 focus:outline-none flex-shrink-0 mt-0.5 transition-colors">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
        </div>
    );
};

// --- AI Insight Display Component ---
const AISecurityInsightCard: React.FC<{ insight: AISecurityInsight }> = ({ insight }) => {
    const severityClasses = {
        Critical: 'border-red-600 bg-red-900/20 text-red-300',
        High: 'border-orange-600 bg-orange-900/20 text-orange-300',
        Medium: 'border-yellow-600 bg-yellow-900/20 text-yellow-300',
        Low: 'border-green-600 bg-green-900/20 text-green-300',
    };

    return (
        <div className={`p-4 rounded-xl border-l-4 shadow-lg transition-all duration-300 hover:shadow-xl ${severityClasses[insight.severity]}`}>
            <div className="flex justify-between items-start mb-2">
                <h4 className="font-extrabold text-lg">{insight.summary}</h4>
                <span className={`text-xs font-semibold px-2 py-1 rounded-full ${severityClasses[insight.severity].replace('border-', 'bg-').replace('/20', '/40')}`}>{insight.severity}</span>
            </div>
            <p className="text-sm text-gray-300 mb-3">{insight.recommendation}</p>
            <div className="text-xs text-gray-400 flex justify-between border-t border-current pt-2 mt-2">
                <span>Engine: {insight.sourceModel}</span>
                <span>Detected: {new Date(insight.timestamp).toLocaleString()}</span>
            </div>
        </div>
    );
};

// --- Main Component ---

const SecurityView: React.FC = () => {
    const context = useContext(DataContext);
    const { 
        linkedAccounts, unlinkAccount, handlePlaidSuccess, 
        securityMetrics, auditLogs, threatAlerts, 
        dataSharingPolicies, apiKeys, trustedContacts, 
        securityAwarenessModules, showSystemAlert,
        transactionRules 
    } = context || {};

    const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' | 'info' | 'warning' | 'critical'; isVisible: boolean } | null>(null);
    const [loginActivity, setLoginActivity] = useState<LoginActivity[]>([]);
    const [devices, setDevices] = useState<Device[]>([]);
    const [aiInsights, setAiInsights] = useState<AISecurityInsight[]>([]);
    const [activeTab, setActiveTab] = useState<'overview' | 'policies' | 'keys' | 'ai_analysis'>('overview');
    const [securityScore, setSecurityScore] = useState<number>(75); // Initial mock score

    // --- Mock Data Initialization & AI Simulation ---
    useEffect(() => {
        const now = new Date();
        const pastDate = (days: number) => new Date(now.getTime() - days * 24 * 60 * 60 * 1000).toISOString();

        // Mock Login Activity
        setLoginActivity([
            { id: '1', device: 'Quantum Workstation', browser: 'Chrome 125 (Secure)', os: 'Linux Kernel 6.8', location: 'HQ Server Room', ip: '10.0.0.5', timestamp: pastDate(0.01), isCurrent: true, userAgent: 'EnterpriseAgent/1.0' },
            { id: '2', device: 'Personal Mobile', browser: 'Safari', os: 'iOS 18.0 Beta', location: 'Remote Office', ip: '203.0.113.45', timestamp: pastDate(1.5), isCurrent: false, userAgent: 'MobileSafari/605.1.15' },
            { id: '3', device: 'Legacy VM', browser: 'IE 11', os: 'Windows Server 2012', location: 'Decommissioned Zone', ip: '192.168.1.100', timestamp: pastDate(15), isCurrent: false, userAgent: 'MSIE 11.0;' },
        ]);

        // Mock Devices
        setDevices([
            { id: 'dvc_1', name: 'Primary Workstation', type: 'Desktop', model: 'Custom Build X9', lastActivity: pastDate(0.01), location: 'HQ Server Room', ip: '10.0.0.5', isCurrent: true, permissions: ['read_all', 'write_transactions', 'admin_config'], status: 'active', firstSeen: pastDate(500), userAgent: 'EnterpriseAgent/1.0', pushNotificationsEnabled: true, biometricAuthEnabled: true, encryptionStatus: 'AES-256-GCM' },
            { id: 'dvc_2', name: 'Executive Tablet', type: 'Tablet', model: 'Pad Pro 14', lastActivity: pastDate(0.5), location: 'Remote Office', ip: '203.0.113.45', isCurrent: false, permissions: ['read_reports'], status: 'active', firstSeen: pastDate(120), userAgent: 'MobileSafari/605.1.15', pushNotificationsEnabled: false, biometricAuthEnabled: true, encryptionStatus: 'full' },
        ]);

        // Mock AI Insights based on potential issues
        setAiInsights([
            { 
                id: 'ai_001', 
                timestamp: pastDate(0.1), 
                severity: 'High', 
                summary: 'Unusual Data Access Pattern Detected', 
                recommendation: 'Review recent read operations from Device ID dvc_2 between 02:00 and 04:00 UTC. Initiate temporary read-only lock.', 
                sourceModel: 'BehavioralAnomaly_v3' 
            },
            { 
                id: 'ai_002', 
                timestamp: pastDate(1), 
                severity: 'Medium', 
                summary: 'Outdated OS Detected on Active Device', 
                recommendation: 'Update OS on "Legacy VM" (IP 192.168.1.100) to a supported version or isolate it to a sandbox network segment.', 
                sourceModel: 'VulnerabilityScanner_v1' 
            },
        ]);

        // Simulate loading security metrics if available
        if (securityMetrics && securityMetrics.length > 0) {
            const scoreMetric = securityMetrics.find(m => m.metricName === 'OverallSecurityScore');
            if (scoreMetric) {
                setSecurityScore(Math.round(parseFloat(scoreMetric.currentValue) * 100));
            }
        }

    }, [securityMetrics]);

    // --- Handlers ---
    const showNotification = useCallback((message: string, type: 'success' | 'error' | 'info' | 'warning' | 'critical') => {
        setNotification({ message, type, isVisible: true });
    }, []);

    const closeNotification = useCallback(() => {
        setNotification(prev => prev ? { ...prev, isVisible: false } : null);
    }, []);

    const handleUnlink = (id: string) => {
        if (unlinkAccount) {
            unlinkAccount(id);
            showNotification(`Financial Source ID ${id} successfully revoked access.`, 'success');
        }
    };

    const handlePolicyToggle = (policy: DataSharingPolicy, enabled: boolean) => {
        // In a real app, this would call an API to update the policy state
        console.log(`Policy ${policy.policyId} toggled to ${enabled}`);
        showNotification(`Data Sharing Policy "${policy.policyName}" updated to ${enabled ? 'Active' : 'Inactive'}.`, 'info');
    };

    const handleAPIKeyRevoke = (keyId: string) => {
        // In a real app, this would call an API to revoke the key
        showNotification(`API Key ${keyId.substring(0, 8)}... has been immediately revoked and invalidated.`, 'critical');
    };

    // --- Render Helpers ---

    const renderLinkedAccounts = useMemo(() => (
        <Card title="Financial Data Sources (Plaid Integration)" className="lg:col-span-2">
            <div className="space-y-4">
                <p className="text-gray-400 text-sm border-b border-gray-800 pb-3">Securely manage connections to external financial institutions via encrypted tokenization. Last sync: {new Date().toLocaleTimeString()}</p>
                {linkedAccounts && linkedAccounts.length > 0 ? (
                    <div className="space-y-3">
                        {linkedAccounts.map(account => (
                            <div key={account.id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 bg-gray-800/70 rounded-lg border border-cyan-700/50 shadow-md">
                                <div className="flex items-center mb-2 sm:mb-0">
                                    <div className="w-12 h-12 rounded-xl bg-cyan-900/70 flex items-center justify-center text-cyan-300 mr-4 flex-shrink-0">
                                        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" /></svg>
                                    </div>
                                    <div>
                                        <p className="font-bold text-lg text-white">{account.name}</p>
                                        <p className="text-sm text-gray-400">Institution ID: {account.institutionId} | Mask: {account.mask}</p>
                                    </div>
                                </div>
                                <div className="flex space-x-2 mt-2 sm:mt-0">
                                    <button 
                                        onClick={() => showNotification(`Initiating re-authentication for ${account.name}...`, 'info')}
                                        className="px-3 py-1.5 bg-indigo-900/30 hover:bg-indigo-900/50 text-indigo-300 rounded-lg text-sm transition-colors border border-indigo-700"
                                    >
                                        Re-sync
                                    </button>
                                    <button 
                                        onClick={() => handleUnlink(account.id)}
                                        className="px-3 py-1.5 bg-red-900/50 hover:bg-red-900/70 text-red-300 rounded-lg text-sm transition-colors border border-red-700"
                                    >
                                        Revoke Access
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="p-6 bg-gray-800/50 rounded-lg text-center border border-dashed border-gray-700">
                        <p className="text-gray-500 italic mb-3">No external financial data sources are currently integrated.</p>
                        {handlePlaidSuccess && <PlaidLinkButton onSuccess={handlePlaidSuccess} label="Connect New Financial Source" className="w-full sm:w-auto" />}
                    </div>
                )}
            </div>
        </Card>
    ), [linkedAccounts, handlePlaidSuccess, handleUnlink, showNotification]);

    const renderSecuritySettings = useMemo(() => (
        <Card title="Core Authentication & Access Controls" className="lg:col-span-1">
            <ul className="divide-y divide-gray-700/50">
                <SecuritySettingToggle 
                    id="2fa_quantum"
                    title="Quantum 2FA (Hardware Key Required)" 
                    description="Mandatory FIDO2/WebAuthn hardware key enforcement for all administrative roles. Software TOTP is deprecated." 
                    defaultChecked={true} 
                    aiImpact='High'
                />
                <SecuritySettingToggle 
                    id="biometric_device"
                    title="Device Biometric Trust" 
                    description="Enforce device-level biometric verification for any transaction exceeding $10,000 or configuration change." 
                    defaultChecked={true} 
                    aiImpact='Medium'
                />
                <SecuritySettingToggle 
                    id="session_timeout"
                    title="Zero-Trust Session Invalidation" 
                    description="Sessions automatically terminate after 15 minutes of inactivity, requiring re-authentication via context-aware challenge." 
                    defaultChecked={true} 
                    aiImpact='High'
                />
                <li className="py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-gray-800/70">
                     <div className="flex-grow">
                        <span className="font-bold text-lg text-white flex items-center">Master Credential Management</span>
                        <p className="text-sm text-gray-400">Last rotation: 2024-01-15. Next mandatory rotation: 2025-01-15.</p>
                     </div>
                     <button className="px-6 py-2 bg-indigo-700 hover:bg-indigo-600 text-white font-semibold rounded-lg text-sm transition-colors shadow-lg mt-2 sm:mt-0">
                        Initiate Credential Rotation Protocol
                     </button>
                </li>
            </ul>
        </Card>
    ), []);

    const renderRecentActivity = useMemo(() => (
        <Card title="Real-Time Login Telemetry" className="lg:col-span-1">
            <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                {loginActivity.map(activity => (
                    <div key={activity.id} className="flex items-start justify-between p-3 bg-gray-800/50 rounded-lg border-l-4 border-gray-700 hover:bg-gray-700/50 transition-colors">
                        <div className="flex-grow min-w-0">
                            <p className="font-bold text-white truncate flex items-center gap-2">
                                {activity.device}
                                {activity.isCurrent && <span className="px-2 py-0.5 bg-green-600/50 text-green-200 text-xs rounded-full font-medium flex-shrink-0">LIVE SESSION</span>}
                            </p>
                            <p className="text-xs text-gray-400 mt-1">
                                <span className="font-mono bg-gray-700/50 px-1 rounded mr-1">{activity.ip}</span> 
                                @ {activity.location} ({activity.os})
                            </p>
                        </div>
                        <span className="text-xs text-gray-500 ml-2 flex-shrink-0">{new Date(activity.timestamp).toLocaleTimeString()}</span>
                    </div>
                ))}
            </div>
        </Card>
    ), [loginActivity]);

    const renderActiveDevices = useMemo(() => (
        <Card title="Managed Endpoints Inventory" className="lg:col-span-2">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {devices.map(device => (
                    <div key={device.id} className="p-4 bg-gray-800/50 rounded-lg border border-indigo-700/50 flex flex-col shadow-lg">
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-indigo-900/70 rounded-lg flex items-center justify-center text-indigo-300 flex-shrink-0">
                                    {device.type === 'Mobile' ? (
                                         <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
                                    ) : (
                                         <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                                    )}
                                </div>
                                <p className="font-bold text-white truncate">{device.name}</p>
                            </div>
                            <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${device.status === 'active' ? 'bg-green-600/30 text-green-300' : 'bg-red-600/30 text-red-300'}`}>
                                {device.status.toUpperCase()}
                            </span>
                        </div>
                        <p className="text-xs text-gray-400 mb-2">Model: {device.model} ({device.type})</p>
                        <p className="text-xs text-gray-500 truncate">IP: {device.ip} | Last Seen: {new Date(device.lastActivity).toLocaleTimeString()}</p>
                        <div className="mt-3 pt-2 border-t border-gray-700">
                            <p className="text-xs font-semibold text-cyan-400">Permissions Granted: {device.permissions.length}</p>
                            <div className="flex flex-wrap gap-1 mt-1">
                                {device.permissions.slice(0, 3).map(p => (
                                    <span key={p} className="text-[10px] bg-gray-700 text-gray-300 px-1 rounded">{p}</span>
                                ))}
                                {device.permissions.length > 3 && <span className="text-[10px] text-gray-500">+{device.permissions.length - 3} more</span>}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </Card>
    ), [devices]);

    const renderDataPolicies = useMemo(() => (
        <Card title="Data Governance & Sharing Policies" className="lg:col-span-2">
            <p className="text-sm text-gray-400 mb-4">Define granular controls over how internal and external data sets are processed, stored, and shared. Managed by AI Policy Engine.</p>
            <div className="space-y-4">
                {(dataSharingPolicies || []).map(policy => (
                    <div key={policy.policyId} className="p-4 bg-gray-800/70 rounded-lg border border-purple-700/50 flex flex-col md:flex-row justify-between items-start md:items-center">
                        <div className="flex-grow mb-2 md:mb-0">
                            <p className="font-bold text-white text-lg">{policy.policyName}</p>
                            <p className="text-xs text-gray-400 mt-1">Scope: {policy.scope} | Last Reviewed: {policy.lastReviewed}</p>
                        </div>
                        <div className="flex items-center space-x-4">
                            <span className={`text-sm font-semibold ${policy.isActive ? 'text-green-400' : 'text-red-400'}`}>
                                {policy.isActive ? 'ACTIVE' : 'DRAFT'}
                            </span>
                            <SecuritySettingToggle
                                id={`policy-${policy.policyId}`}
                                title="Enable Policy"
                                description={`Toggle activation for ${policy.policyName}`}
                                defaultChecked={policy.isActive}
                                onToggle={(checked) => handlePolicyToggle(policy, checked)}
                                aiImpact='Medium'
                            />
                        </div>
                    </div>
                ))}
            </div>
        </Card>
    ), [dataSharingPolicies, handlePolicyToggle]);

    const renderAPIKeys = useMemo(() => (
        <Card title="System API Key Management" className="lg:col-span-2">
            <p className="text-sm text-gray-400 mb-4">Manage programmatic access tokens. Keys are automatically rotated by the Quantum Key Vault every 90 days.</p>
            <div className="space-y-3">
                {(apiKeys || []).map(key => (
                    <div key={key.id} className="flex justify-between items-center p-3 bg-gray-800/70 rounded-lg border border-yellow-700/50">
                        <div className="flex items-center min-w-0">
                            <svg className="w-5 h-5 text-yellow-400 mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M6 16h.01" /></svg>
                            <div>
                                <p className="font-mono text-sm text-white truncate">{key.keyName} ({key.id.substring(0, 8)}...)</p>
                                <p className="text-xs text-gray-500">Created: {key.creationDate} | Permissions: {key.scopes.join(', ')}</p>
                            </div>
                        </div>
                        <button 
                            onClick={() => handleAPIKeyRevoke(key.id)}
                            className="px-3 py-1 bg-red-900/30 hover:bg-red-900/50 text-red-300 rounded-md text-xs transition-colors flex-shrink-0 ml-4"
                        >
                            Revoke Now
                        </button>
                    </div>
                ))}
            </div>
        </Card>
    ), [apiKeys, handleAPIKeyRevoke]);

    const renderAIAnalysis = useMemo(() => (
        <div className="space-y-6">
            <Card title={`AI Threat Intelligence Feed (${AI_INSIGHT_ENGINE_VERSION})`}>
                <div className="flex justify-between items-center mb-4 border-b border-gray-800 pb-3">
                    <p className="text-gray-400 text-sm">Real-time behavioral analysis and predictive threat modeling.</p>
                    <span className="text-sm font-bold text-cyan-400">Total Insights: {aiInsights.length}</span>
                </div>
                <div className="space-y-4">
                    {aiInsights.length > 0 ? (
                        aiInsights.map(insight => (
                            <AISecurityInsightCard key={insight.id} insight={insight} />
                        ))
                    ) : (
                        <div className="p-6 bg-gray-800/50 rounded-lg text-center border border-dashed border-gray-700">
                            <p className="text-gray-500 italic">AI Engine reports no immediate high-priority anomalies at this time.</p>
                        </div>
                    )}
                </div>
            </Card>

            <Card title="Security Awareness Training Modules">
                <p className="text-sm text-gray-400 mb-4">Track mandatory compliance training completion status across the organization.</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {(securityAwarenessModules || []).map(module => (
                        <div key={module.moduleId} className="p-4 bg-gray-800/70 rounded-lg border border-green-700/50">
                            <p className="font-bold text-white">{module.title}</p>
                            <p className="text-xs text-gray-400 mt-1">Status: {module.completionRate}% Complete</p>
                            <div className="w-full bg-gray-700 rounded-full h-2.5 mt-2">
                                <div className="bg-green-500 h-2.5 rounded-full" style={{ width: `${module.completionRate}%` }}></div>
                            </div>
                        </div>
                    ))}
                </div>
            </Card>
        </div>
    ), [aiInsights, securityAwarenessModules]);

    const renderAuditLogs = useMemo(() => {
        const displayLogs = (auditLogs || []).slice(0, MAX_AUDIT_LOG_DISPLAY);
        return (
            <Card title={`System Audit Trail (Last ${displayLogs.length} Entries)`} className="lg:col-span-2">
                <p className="text-sm text-gray-400 mb-3">Immutable record of all configuration changes, data access events, and administrative actions.</p>
                <div className="overflow-x-auto max-h-[500px] custom-scrollbar">
                    <table className="min-w-full divide-y divide-gray-700">
                        <thead className="sticky top-0 bg-gray-800 z-10">
                            <tr>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Time</th>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">User/System</th>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Action</th>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Target</th>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-800">
                            {displayLogs.map((log: AuditLogEntry) => (
                                <tr key={log.id} className="hover:bg-gray-800/50 transition-colors">
                                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">{new Date(log.timestamp).toLocaleTimeString()}</td>
                                    <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-white">{log.userId.includes('sys_') ? 'SYSTEM' : log.userId}</td>
                                    <td className="px-4 py-2 text-sm text-cyan-400">{log.action}</td>
                                    <td className="px-4 py-2 text-sm text-gray-400">{log.targetResource}</td>
                                    <td className="px-4 py-2 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${log.success ? 'bg-green-900/50 text-green-300' : 'bg-red-900/50 text-red-300'}`}>
                                            {log.success ? 'SUCCESS' : 'FAILURE'}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {displayLogs.length < (auditLogs?.length || 0) && (
                    <p className="text-center text-sm text-gray-500 mt-3">Displaying first {MAX_AUDIT_LOG_DISPLAY} logs. Load full history via dedicated Audit Console.</p>
                )}
            </Card>
        );
    }, [auditLogs]);

    const renderSecurityScoreGauge = useMemo(() => {
        const radius = 50;
        const circumference = 2 * Math.PI * radius;
        const offset = circumference - (securityScore / 100) * circumference;
        const color = securityScore >= 90 ? 'stroke-green-500' : securityScore >= 70 ? 'stroke-yellow-500' : 'stroke-red-500';

        return (
            <div className="flex flex-col items-center p-6 bg-gray-800/70 rounded-xl shadow-inner border border-gray-700">
                <h3 className="text-xl font-bold text-white mb-3">Quantum Security Index (QSI)</h3>
                <svg width="120" height="120" viewBox="0 0 120 120" className="transform -rotate-90">
                    {/* Background Circle */}
                    <circle
                        cx="60"
                        cy="60"
                        r={radius}
                        fill="transparent"
                        stroke="#374151"
                        strokeWidth="10"
                    />
                    {/* Progress Arc */}
                    <circle
                        cx="60"
                        cy="60"
                        r={radius}
                        fill="transparent"
                        stroke={color.replace('stroke-', '')}
                        strokeWidth="10"
                        strokeDasharray={circumference}
                        strokeDashoffset={offset}
                        strokeLinecap="round"
                        className="transition-all duration-1000 ease-out"
                    />
                    {/* Text */}
                    <text
                        x="60"
                        y="60"
                        dominantBaseline="middle"
                        textAnchor="middle"
                        className="fill-current text-white"
                        fontSize="20"
                        fontWeight="bold"
                    >
                        {securityScore}%
                    </text>
                </svg>
                <p className="text-sm text-gray-400 mt-2">Target: 95%</p>
            </div>
        );
    }, [securityScore]);

    const renderTrustedContacts = useMemo(() => (
        <Card title="Emergency Trusted Contacts" className="lg:col-span-1">
            <p className="text-sm text-gray-400 mb-4">Contacts authorized for emergency account recovery or high-risk alerts.</p>
            <div className="space-y-3">
                {(trustedContacts || []).map((contact: TrustedContact) => (
                    <div key={contact.id} className="flex justify-between items-center p-3 bg-gray-800/50 rounded-lg border border-gray-700">
                        <div className="flex items-center">
                            <div className="w-8 h-8 bg-pink-900/50 rounded-full flex items-center justify-center text-pink-300 mr-3">
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                            </div>
                            <div>
                                <p className="font-semibold text-white">{contact.name}</p>
                                <p className="text-xs text-gray-400">{contact.relationship}</p>
                            </div>
                        </div>
                        <span className={`text-xs font-medium px-2 py-0.5 rounded ${contact.verified ? 'bg-green-900/30 text-green-400' : 'bg-red-900/30 text-red-400'}`}>
                            {contact.verified ? 'Verified' : 'Pending'}
                        </span>
                    </div>
                ))}
            </div>
        </Card>
    ), [trustedContacts]);


    // --- Tab Content Rendering ---
    const renderContent = () => {
        switch (activeTab) {
            case 'overview':
                return (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {renderSecurityScoreGauge}
                        {renderRecentActivity}
                        {renderActiveDevices}
                        {renderLinkedAccounts}
                        {renderSecuritySettings}
                    </div>
                );
            case 'policies':
                return (
                    <div className="grid grid-cols-1 gap-6">
                        {renderDataPolicies}
                        <Card title="Transaction Rule Engine" className="lg:col-span-2">
                            <p className="text-sm text-gray-400 mb-4">Define automated responses to financial events based on predefined risk thresholds.</p>
                            <div className="space-y-3">
                                {(transactionRules || []).map((rule: TransactionRule) => (
                                    <div key={rule.ruleId} className="p-3 bg-gray-800/70 rounded-lg border border-cyan-700/50 flex justify-between items-center">
                                        <div>
                                            <p className="font-bold text-white">{rule.name}</p>
                                            <p className="text-xs text-gray-400">Trigger: {rule.triggerCondition} | Action: {rule.action}</p>
                                        </div>
                                        <span className={`text-xs font-medium px-2 py-0.5 rounded ${rule.isEnabled ? 'bg-green-900/30 text-green-400' : 'bg-red-900/30 text-red-400'}`}>
                                            {rule.isEnabled ? 'ACTIVE' : 'DISABLED'}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    </div>
                );
            case 'keys':
                return (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {renderAPIKeys}
                        {renderTrustedContacts}
                        <Card title="Threat Alert History" className="lg:col-span-3">
                            <p className="text-sm text-gray-400 mb-4">Historical record of confirmed security incidents.</p>
                            <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                                {(threatAlerts || []).map((alert: ThreatAlert) => (
                                    <div key={alert.alertId} className="p-3 bg-red-900/30 rounded-lg border border-red-600 flex justify-between items-center">
                                        <div>
                                            <p className="font-bold text-red-300">{alert.title}</p>
                                            <p className="text-xs text-gray-300">{alert.description}</p>
                                        </div>
                                        <span className="text-xs text-gray-300">{new Date(alert.timestamp).toLocaleDateString()}</span>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    </div>
                );
            case 'ai_analysis':
                return (
                    <div className="grid grid-cols-1 gap-6">
                        {renderAIAnalysis}
                        {renderAuditLogs}
                    </div>
                );
            default:
                return null;
        }
    };

    // --- Tab Navigation ---
    const tabs: { id: typeof activeTab, label: string }[] = [
        { id: 'overview', label: 'Overview & Access' },
        { id: 'policies', label: 'Governance & Rules' },
        { id: 'keys', label: 'API & Contacts' },
        { id: 'ai_analysis', label: 'AI Threat Analysis' },
    ];

    return (
        <div className="space-y-8 p-4 sm:p-8">
            <header className="pb-4 border-b border-gray-700">
                <h1 className="text-4xl font-extrabold text-white tracking-tighter">Enterprise Security Command Center</h1>
                <p className="text-lg text-gray-400 mt-1">Centralized control plane for data integrity, access management, and threat mitigation. Engine Version: {AI_INSIGHT_ENGINE_VERSION}</p>
            </header>

            {/* Tab Navigation */}
            <div className="flex border-b border-gray-700 overflow-x-auto">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`px-6 py-3 text-lg font-semibold transition-all duration-300 whitespace-nowrap
                            ${activeTab === tab.id 
                                ? 'text-cyan-400 border-b-4 border-cyan-500' 
                                : 'text-gray-400 hover:text-white hover:border-b-4 hover:border-gray-600'
                            }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            <main>
                {renderContent()}
            </main>

            {notification && (
                <NotificationToast 
                    message={notification.message} 
                    type={notification.type} 
                    isVisible={notification.isVisible} 
                    onClose={closeNotification} 
                />
            )}
        </div>
    );
};

export default SecurityView;


================================================================================
// APPENDED FROM REPO: diplomat-bit/magic | ORIGINAL PATH: diplomat-bit-magic-a3f5ff1/components/SecurityView (5).tsx
================================================================================

import React, { useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { DataContext } from '../context/DataContext';
import Card from './Card';
import PlaidLinkButton from './PlaidLinkButton';
import { 
    LoginActivity, Device, DataSharingPolicy, TransactionRule, ThreatAlert, 
    AuditLogEntry, APIKey, TrustedContact, SecurityAwarenessModule, SecurityScoreMetric, UserProfile 
} from '../types';

// --- AI/ML & Future Tech Integration Placeholder Types (Massively Expanded) ---
interface AISecurityInsight {
    id: string;
    timestamp: string;
    severity: 'Low' | 'Medium' | 'High' | 'Critical';
    summary: string;
    recommendation: string;
    sourceModel: string;
    relatedEntities: string[]; // e.g., ['dvc_1', 'user_abc']
}

interface HFTAlgorithmRule {
    id: string;
    name: string;
    description: string;
    targetAlgorithm: string;
    condition: string;
    action: 'PAUSE_ALGO' | 'ALERT_ONLY' | 'THROTTLE_ORDERS' | 'EXECUTE_COUNTER_TRADE';
    isEnabled: boolean;
    lastTriggered: string | null;
}

interface QuantumEncryptionStatus {
    id: string;
    systemComponent: string;
    algorithm: 'NTRU-HPS' | 'Kyber' | 'Dilithium' | 'SPHINCS+' | 'Legacy (RSA-4096)';
    status: 'MIGRATED' | 'PENDING' | 'AT_RISK' | 'FAILED';
    migrationEta: string;
    quantumThreatVector: string;
}

interface SecurityIncident {
    id: string;
    title: string;
    severity: 'Low' | 'Medium' | 'High' | 'Critical';
    status: 'Open' | 'Investigating' | 'Resolved' | 'Contained';
    reportedBy: string;
    timestamp: string;
    assignedTo: string;
    summary: string;
}

// --- GEIN (Global Enterprise Intelligence Network) Types ---
interface GEINStreamChunk {
    id: string;
    timestamp: string;
    sourceNode: string;
    dataType: 'TRANSACTION' | 'LOG' | 'THREAT_SIG' | 'USER_BEHAVIOR' | 'NETWORK_PACKET';
    payload: string;
    geinScore: number; // 0-1 confidence score of relevance
}

interface GEINConsoleMessage {
    id: string;
    role: 'user' | 'gein' | 'system';
    text: string;
    isStreaming?: boolean;
}

interface CognitiveCoreStatus {
    name: string;
    status: 'NOMINAL' | 'DEGRADED' | 'OFFLINE' | 'THINKING';
    load: number; // Percentage
    primaryTask: string;
}

// --- Constants for Billion Dollar Features ---
const AI_INSIGHT_ENGINE_VERSION = "GEIN Cognitive Engine v3.0-Hydra";
const MAX_AUDIT_LOG_DISPLAY = 10;
const GLOBAL_LOCKDOWN_STATE = false; // Simulated global state

// --- Helper Components ---

export const SecuritySettingToggle: React.FC<{
    id: string;
    title: string;
    description: string;
    defaultChecked: boolean;
    onToggle?: (checked: boolean) => void;
    disabled?: boolean;
    aiImpact?: 'High' | 'Medium' | 'Low' | 'None';
}> = ({ id, title, description, defaultChecked, onToggle, disabled, aiImpact = 'None' }) => {
    const [isChecked, setIsChecked] = useState(defaultChecked);
    const { showSystemAlert } = useContext(DataContext) || {};

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newState = e.target.checked;
        setIsChecked(newState);
        onToggle && onToggle(newState);
        
        if (showSystemAlert) {
            const impactColor = aiImpact === 'High' ? 'text-red-400' : aiImpact === 'Medium' ? 'text-yellow-400' : 'text-green-400';
            showSystemAlert(`Configuration Change Detected: ${title} set to ${newState ? 'Enabled' : 'Disabled'}. AI Risk Assessment: ${aiImpact}.`, 'info');
        }
    };

    const aiIndicator = useMemo(() => {
        if (aiImpact === 'None') return null;
        const colorMap = {
            High: 'bg-red-500',
            Medium: 'bg-yellow-500',
            Low: 'bg-blue-500',
        };
        return (
            <span className={`ml-3 px-2 py-0.5 text-xs font-bold rounded-full text-white ${colorMap[aiImpact]}`}>
                AI {aiImpact}
            </span>
        );
    }, [aiImpact]);

    return (
        <li className="py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-gray-800/70">
            <div className="flex-grow">
                <label htmlFor={`toggle-${id}`} className="font-bold text-lg text-white cursor-pointer flex items-center">
                    {title}
                    {aiIndicator}
                </label>
                <p className="text-sm text-gray-400 max-w-xl mt-1">{description}</p>
            </div>
            <div className="flex items-center mt-2 sm:mt-0">
                <span className={`mr-3 text-sm font-medium ${isChecked ? 'text-green-400' : 'text-red-400'}`}>
                    {isChecked ? 'ACTIVE' : 'INACTIVE'}
                </span>
                <input
                    type="checkbox"
                    id={`toggle-${id}`}
                    className="toggle toggle-cyan toggle-lg"
                    checked={isChecked}
                    onChange={handleChange}
                    disabled={disabled}
                    aria-label={`Toggle for ${title}`}
                />
            </div>
        </li>
    );
};

export const NotificationToast: React.FC<{
    message: string;
    type: 'success' | 'error' | 'info' | 'warning' | 'critical';
    onClose: () => void;
    isVisible: boolean;
}> = ({ message, type, onClose, isVisible }) => {
    const typeClasses = {
        success: 'bg-green-700 border-green-500',
        error: 'bg-red-700 border-red-500',
        info: 'bg-blue-700 border-blue-500',
        warning: 'bg-yellow-700 border-yellow-500',
        critical: 'bg-purple-800 border-purple-500'
    };
    
    const iconMap = {
        success: <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
        error: <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
        info: <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
        warning: <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.938 5.002c-.77-1.333-2.688-1.333-3.458 0L3.308 18.002c-.77 1.333.192 3 1.732 3z" /></svg>,
        critical: <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.938 5.002c-.77-1.333-2.688-1.333-3.458 0L3.308 18.002c-.77 1.333.192 3 1.732 3z" /></svg>
    };

    useEffect(() => {
        let timer: ReturnType<typeof setTimeout>;
        if (isVisible) {
            const duration = type === 'critical' ? 15000 : 7000;
            timer = setTimeout(() => { onClose(); }, duration);
        }
        return () => clearTimeout(timer);
    }, [isVisible, onClose, type]);

    if (!isVisible) return null;
    return (
        <div className={`fixed bottom-8 right-8 p-5 rounded-xl shadow-2xl text-white flex items-start space-x-4 transition-all duration-500 ease-out transform border-l-8 ${typeClasses[type]} ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'}`} style={{zIndex: 1000, minWidth: '300px'}}>
            <div className="flex-shrink-0 mt-1">
                {iconMap[type]}
            </div>
            <div className="flex-grow">
                <span className="text-sm font-bold block capitalize">{type} Alert</span>
                <span className="text-base font-medium">{message}</span>
            </div>
            <button onClick={onClose} className="p-1 rounded-full hover:bg-black/20 focus:outline-none flex-shrink-0 mt-0.5 transition-colors">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
        </div>
    );
};

const AISecurityInsightCard: React.FC<{ insight: AISecurityInsight }> = ({ insight }) => {
    const severityClasses = {
        Critical: 'border-red-600 bg-red-900/20 text-red-300',
        High: 'border-orange-600 bg-orange-900/20 text-orange-300',
        Medium: 'border-yellow-600 bg-yellow-900/20 text-yellow-300',
        Low: 'border-green-600 bg-green-900/20 text-green-300',
    };

    return (
        <div className={`p-4 rounded-xl border-l-4 shadow-lg transition-all duration-300 hover:shadow-xl ${severityClasses[insight.severity]}`}>
            <div className="flex justify-between items-start mb-2">
                <h4 className="font-extrabold text-lg">{insight.summary}</h4>
                <span className={`text-xs font-semibold px-2 py-1 rounded-full ${severityClasses[insight.severity].replace('border-', 'bg-').replace('/20', '/40')}`}>{insight.severity}</span>
            </div>
            <p className="text-sm text-gray-300 mb-3">{insight.recommendation}</p>
            <div className="text-xs text-gray-400 flex justify-between border-t border-current pt-2 mt-2">
                <span>Engine: {insight.sourceModel}</span>
                <span>Detected: {new Date(insight.timestamp).toLocaleString()}</span>
            </div>
        </div>
    );
};

// --- Main Component ---

const SecurityView: React.FC = () => {
    const context = useContext(DataContext);
    const { 
        linkedAccounts, unlinkAccount, handlePlaidSuccess, 
        securityMetrics, auditLogs, threatAlerts, 
        dataSharingPolicies, apiKeys, trustedContacts, 
        securityAwarenessModules, showSystemAlert 
    } = context || {};

    const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' | 'info' | 'warning' | 'critical'; isVisible: boolean } | null>(null);
    const [loginActivity, setLoginActivity] = useState<LoginActivity[]>([]);
    const [devices, setDevices] = useState<Device[]>([]);
    const [aiInsights, setAiInsights] = useState<AISecurityInsight[]>([]);
    const [hftRules, setHftRules] = useState<HFTAlgorithmRule[]>([]);
    const [quantumStatuses, setQuantumStatuses] = useState<QuantumEncryptionStatus[]>([]);
    const [incidents, setIncidents] = useState<SecurityIncident[]>([]);
    const [activeTab, setActiveTab] = useState<'overview' | 'policies' | 'keys' | 'ai_analysis' | 'hft' | 'quantum' | 'incidents' | 'gein_command'>('overview');
    const [securityScore, setSecurityScore] = useState<number>(75);

    // --- GEIN State ---
    const [geinConsoleHistory, setGeinConsoleHistory] = useState<GEINConsoleMessage[]>([]);
    const [geinInputStream, setGeinInputStream] = useState<GEINStreamChunk[]>([]);
    const [geinSystemInstruction, setGeinSystemInstruction] = useState<string>("You are GEIN, a global enterprise intelligence network. Your purpose is to provide unparalleled, real-time security analysis with a focus on predictive threat mitigation. Be concise, authoritative, and data-driven.");
    const [geinThinkingBudget, setGeinThinkingBudget] = useState<number>(5000); // Default budget
    const [cognitiveCores, setCognitiveCores] = useState<CognitiveCoreStatus[]>([]);
    const [geinConsoleInput, setGeinConsoleInput] = useState<string>("");

    // --- Mock Data Initialization & AI Simulation ---
    useEffect(() => {
        const now = new Date();
        const pastDate = (days: number) => new Date(now.getTime() - days * 24 * 60 * 60 * 1000).toISOString();

        setLoginActivity([
            { id: '1', device: 'Quantum Workstation', browser: 'Chrome 125 (Secure)', os: 'Linux Kernel 6.8', location: 'HQ Server Room', ip: '10.0.0.5', timestamp: pastDate(0.01), isCurrent: true, userAgent: 'EnterpriseAgent/1.0' },
            { id: '2', device: 'Personal Mobile', browser: 'Safari', os: 'iOS 18.0 Beta', location: 'Remote Office', ip: '203.0.113.45', timestamp: pastDate(1.5), isCurrent: false, userAgent: 'MobileSafari/605.1.15' },
            { id: '3', device: 'Legacy VM', browser: 'IE 11', os: 'Windows Server 2012', location: 'Decommissioned Zone', ip: '192.168.1.100', timestamp: pastDate(15), isCurrent: false, userAgent: 'MSIE 11.0;' },
        ]);

        setDevices([
            { id: 'dvc_1', name: 'Primary Workstation', type: 'Desktop', model: 'Custom Build X9', lastActivity: pastDate(0.01), location: 'HQ Server Room', ip: '10.0.0.5', isCurrent: true, permissions: ['read_all', 'write_transactions', 'admin_config'], status: 'active', firstSeen: pastDate(500), userAgent: 'EnterpriseAgent/1.0', pushNotificationsEnabled: true, biometricAuthEnabled: true, encryptionStatus: 'AES-256-GCM' },
            { id: 'dvc_2', name: 'Executive Tablet', type: 'Tablet', model: 'Pad Pro 14', lastActivity: pastDate(0.5), location: 'Remote Office', ip: '203.0.113.45', isCurrent: false, permissions: ['read_reports'], status: 'active', firstSeen: pastDate(120), userAgent: 'MobileSafari/605.1.15', pushNotificationsEnabled: false, biometricAuthEnabled: true, encryptionStatus: 'full' },
        ]);

        setAiInsights([
            { id: 'ai_001', timestamp: pastDate(0.1), severity: 'High', summary: 'Unusual Data Access Pattern Detected', recommendation: 'Review recent read operations from Device ID dvc_2 between 02:00 and 04:00 UTC. Initiate temporary read-only lock.', sourceModel: 'BehavioralAnomaly_v3', relatedEntities: ['dvc_2'] },
            { id: 'ai_002', timestamp: pastDate(1), severity: 'Medium', summary: 'Outdated OS Detected on Active Device', recommendation: 'Update OS on "Legacy VM" (IP 192.168.1.100) to a supported version or isolate it to a sandbox network segment.', sourceModel: 'VulnerabilityScanner_v1', relatedEntities: ['dvc_3'] },
            { id: 'ai_003', timestamp: pastDate(2), severity: 'Critical', summary: 'Potential HFT Algo Manipulation Detected', recommendation: 'Circuit breaker triggered for "MomentumBot_v9". Review order book for spoofing patterns. All related API keys have been frozen.', sourceModel: 'MarketIntegrity_v4', relatedEntities: ['hft_rule_1', 'api_key_2'] },
        ]);

        setHftRules([
            { id: 'hft_rule_1', name: 'Flash Crash Circuit Breaker', description: 'Automatically pauses all trading algorithms if market index drops > 5% in 2 minutes.', targetAlgorithm: 'All', condition: 'INDEX_DROP > 5%', action: 'PAUSE_ALGO', isEnabled: true, lastTriggered: pastDate(2) },
            { id: 'hft_rule_2', name: 'Latency Anomaly Alert', description: 'Alerts trading desk if order execution latency exceeds 10ms for any algorithm.', targetAlgorithm: 'All', condition: 'LATENCY > 10ms', action: 'ALERT_ONLY', isEnabled: true, lastTriggered: pastDate(0.2) },
            { id: 'hft_rule_3', name: 'Counter-Trade on Spoofing', description: 'Executes a small counter-trade if AI detects high-confidence order book spoofing.', targetAlgorithm: 'MarketMaker_v3', condition: 'AI_SPOOF_CONFIDENCE > 0.95', action: 'EXECUTE_COUNTER_TRADE', isEnabled: false, lastTriggered: null },
        ]);

        setQuantumStatuses([
            { id: 'qs_1', systemComponent: 'Core Transaction Ledger', algorithm: 'Dilithium', status: 'MIGRATED', migrationEta: 'Complete', quantumThreatVector: 'Shor\'s Algorithm' },
            { id: 'qs_2', systemComponent: 'API Key Vault', algorithm: 'Kyber', status: 'PENDING', migrationEta: 'Q3 2025', quantumThreatVector: 'Shor\'s Algorithm' },
            { id: 'qs_3', systemComponent: 'User Authentication DB', algorithm: 'NTRU-HPS', status: 'MIGRATED', migrationEta: 'Complete', quantumThreatVector: 'Grover\'s Algorithm' },
            { id: 'qs_4', systemComponent: 'Legacy Reporting System', algorithm: 'Legacy (RSA-4096)', status: 'AT_RISK', migrationEta: 'Q1 2026', quantumThreatVector: 'Shor\'s Algorithm' },
        ]);

        setIncidents([
            { id: 'inc_1', title: 'Phishing Attempt on Executive Account', severity: 'Medium', status: 'Resolved', reportedBy: 'user_jane_doe', timestamp: pastDate(5), assignedTo: 'secops_team_a', summary: 'Targeted phishing email detected and blocked. User credentials rotated as a precaution.' },
            { id: 'inc_2', title: 'DDoS Attack on Public API Gateway', severity: 'High', status: 'Contained', reportedBy: 'SYSTEM_MONITOR', timestamp: pastDate(1), assignedTo: 'netops_team', summary: 'Volumetric attack mitigated by cloud provider. Monitoring for residual effects.' },
        ]);

        // GEIN Initialization
        setGeinConsoleHistory([{ id: 'init', role: 'system', text: 'GEIN Cognitive Engine v3.0-Hydra online. Awaiting operator command.' }]);
        setCognitiveCores([
            { name: 'Predictive Analytics', status: 'NOMINAL', load: 78, primaryTask: 'Market Volatility Forecasting' },
            { name: 'Threat Correlation', status: 'NOMINAL', load: 65, primaryTask: 'Cross-referencing Dark Web Intel' },
            { name: 'Quantum Heuristics', status: 'NOMINAL', load: 42, primaryTask: 'Simulating PQC Algorithm Failure Modes' },
            { name: 'Behavioral Biometrics', status: 'DEGRADED', load: 95, primaryTask: 'Re-calibrating User Keystroke Dynamics' },
        ]);

        if (securityMetrics && securityMetrics.length > 0) {
            const scoreMetric = securityMetrics.find(m => m.metricName === 'OverallSecurityScore');
            if (scoreMetric) setSecurityScore(Math.round(parseFloat(scoreMetric.currentValue) * 100));
        }

        // Simulate GEIN data stream
        const streamInterval = setInterval(() => {
            const dataTypes: GEINStreamChunk['dataType'][] = ['TRANSACTION', 'LOG', 'THREAT_SIG', 'USER_BEHAVIOR', 'NETWORK_PACKET'];
            const sources = ['LD4', 'AWS-US-EAST-1', 'HK-EXCHANGE', 'DARK-WEB-MONITOR', 'INTERNAL-AUDIT'];
            const newChunk: GEINStreamChunk = {
                id: `strm_${Date.now()}`,
                timestamp: new Date().toISOString(),
                sourceNode: sources[Math.floor(Math.random() * sources.length)],
                dataType: dataTypes[Math.floor(Math.random() * dataTypes.length)],
                payload: `0x${[...Array(16)].map(() => Math.floor(Math.random() * 16).toString(16)).join('')}`,
                geinScore: Math.random(),
            };
            setGeinInputStream(prev => [newChunk, ...prev.slice(0, 99)]);
        }, 1500);

        return () => clearInterval(streamInterval);

    }, [securityMetrics]);

    // --- Handlers ---
    const showNotification = useCallback((message: string, type: 'success' | 'error' | 'info' | 'warning' | 'critical') => {
        setNotification({ message, type, isVisible: true });
    }, []);

    const closeNotification = useCallback(() => {
        setNotification(prev => prev ? { ...prev, isVisible: false } : null);
    }, []);

    const handleUnlink = (id: string) => {
        if (unlinkAccount) {
            unlinkAccount(id);
            showNotification(`Financial Source ID ${id} successfully revoked access.`, 'success');
        }
    };

    const handlePolicyToggle = (policy: DataSharingPolicy, enabled: boolean) => {
        console.log(`Policy ${policy.policyId} toggled to ${enabled}`);
        showNotification(`Data Sharing Policy "${policy.policyName}" updated to ${enabled ? 'Active' : 'Inactive'}.`, 'info');
    };

    const handleAPIKeyRevoke = (keyId: string) => {
        showNotification(`API Key ${keyId.substring(0, 8)}... has been immediately revoked and invalidated.`, 'critical');
    };

    const handleGlobalLockdown = () => {
        const confirmation = window.confirm("CRITICAL ACTION: Are you sure you want to initiate Global Lockdown Protocol? This will immediately freeze all transactions, terminate all user sessions, and restrict API access.");
        if (confirmation) {
            showNotification("GLOBAL LOCKDOWN PROTOCOL INITIATED. System entering restricted state.", 'critical');
            // In a real app, this would trigger a series of critical API calls.
        }
    };

    const handleGeinQuery = async () => {
        if (!geinConsoleInput.trim()) return;

        const userMessage: GEINConsoleMessage = { id: `user_${Date.now()}`, role: 'user', text: geinConsoleInput };
        setGeinConsoleHistory(prev => [...prev, userMessage]);
        setGeinConsoleInput("");

        // Simulate GEIN "thinking" and streaming response
        const geinResponseId = `gein_${Date.now()}`;
        const thinkingMessage: GEINConsoleMessage = { id: geinResponseId, role: 'gein', text: '', isStreaming: true };
        setGeinConsoleHistory(prev => [...prev, thinkingMessage]);

        const responseChunks = [
            "Analyzing query against ",
            `${geinInputStream.length} real-time data points... `,
            "Correlating with active threat vectors... ",
            "CONFIRMED: The anomalous activity on dvc_2 correlates with a new zero-day exploit signature (CVE-2025-9999) detected by the Dark Web Monitor node. ",
            "RECOMMENDATION: Isolate dvc_2 immediately. ",
            "Execute containment protocol 'Chimera'. ",
            "I have already drafted the execution plan. Awaiting your authorization."
        ];

        let currentText = "";
        for (const chunk of responseChunks) {
            await new Promise(resolve => setTimeout(resolve, Math.random() * 200 + 50));
            currentText += chunk;
            setGeinConsoleHistory(prev => prev.map(msg => 
                msg.id === geinResponseId ? { ...msg, text: currentText } : msg
            ));
        }

        setGeinConsoleHistory(prev => prev.map(msg => 
            msg.id === geinResponseId ? { ...msg, isStreaming: false } : msg
        ));
    };

    // --- Render Helpers ---

    const renderLinkedAccounts = useMemo(() => (
        <Card title="Financial Data Sources (Plaid Integration)" className="lg:col-span-2">
            <div className="space-y-4">
                <p className="text-gray-400 text-sm border-b border-gray-800 pb-3">Securely manage connections to external financial institutions via encrypted tokenization. Last sync: {new Date().toLocaleTimeString()}</p>
                {linkedAccounts && linkedAccounts.length > 0 ? (
                    <div className="space-y-3">
                        {linkedAccounts.map(account => (
                            <div key={account.id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 bg-gray-800/70 rounded-lg border border-cyan-700/50 shadow-md">
                                <div className="flex items-center mb-2 sm:mb-0">
                                    <div className="w-12 h-12 rounded-xl bg-cyan-900/70 flex items-center justify-center text-cyan-300 mr-4 flex-shrink-0">
                                        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" /></svg>
                                    </div>
                                    <div>
                                        <p className="font-bold text-lg text-white">{account.name}</p>
                                        <p className="text-sm text-gray-400">Institution ID: {account.institutionId} | Mask: {account.mask}</p>
                                    </div>
                                </div>
                                <div className="flex space-x-2 mt-2 sm:mt-0">
                                    <button onClick={() => showNotification(`Initiating re-authentication for ${account.name}...`, 'info')} className="px-3 py-1.5 bg-indigo-900/30 hover:bg-indigo-900/50 text-indigo-300 rounded-lg text-sm transition-colors border border-indigo-700">Re-sync</button>
                                    <button onClick={() => handleUnlink(account.id)} className="px-3 py-1.5 bg-red-900/50 hover:bg-red-900/70 text-red-300 rounded-lg text-sm transition-colors border border-red-700">Revoke Access</button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="p-6 bg-gray-800/50 rounded-lg text-center border border-dashed border-gray-700">
                        <p className="text-gray-500 italic mb-3">No external financial data sources are currently integrated.</p>
                        {handlePlaidSuccess && <PlaidLinkButton onSuccess={handlePlaidSuccess} label="Connect New Financial Source" className="w-full sm:w-auto" />}
                    </div>
                )}
            </div>
        </Card>
    ), [linkedAccounts, handlePlaidSuccess, handleUnlink, showNotification]);

    const renderSecuritySettings = useMemo(() => (
        <Card title="Core Authentication & Access Controls" className="lg:col-span-1">
            <ul className="divide-y divide-gray-700/50">
                <SecuritySettingToggle id="2fa_quantum" title="Quantum 2FA (Hardware Key Required)" description="Mandatory FIDO2/WebAuthn hardware key enforcement for all administrative roles. Software TOTP is deprecated." defaultChecked={true} aiImpact='High' />
                <SecuritySettingToggle id="biometric_device" title="Device Biometric Trust" description="Enforce device-level biometric verification for any transaction exceeding $10,000 or configuration change." defaultChecked={true} aiImpact='Medium' />
                <SecuritySettingToggle id="session_timeout" title="Zero-Trust Session Invalidation" description="Sessions automatically terminate after 15 minutes of inactivity, requiring re-authentication via context-aware challenge." defaultChecked={true} aiImpact='High' />
                <li className="py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-gray-800/70">
                     <div className="flex-grow">
                        <span className="font-bold text-lg text-white flex items-center">Master Credential Management</span>
                        <p className="text-sm text-gray-400">Last rotation: 2024-01-15. Next mandatory rotation: 2025-01-15.</p>
                     </div>
                     <button className="px-6 py-2 bg-indigo-700 hover:bg-indigo-600 text-white font-semibold rounded-lg text-sm transition-colors shadow-lg mt-2 sm:mt-0">Initiate Credential Rotation Protocol</button>
                </li>
            </ul>
        </Card>
    ), []);

    const renderRecentActivity = useMemo(() => (
        <Card title="Real-Time Login Telemetry" className="lg:col-span-1">
            <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                {loginActivity.map(activity => (
                    <div key={activity.id} className="flex items-start justify-between p-3 bg-gray-800/50 rounded-lg border-l-4 border-gray-700 hover:bg-gray-700/50 transition-colors">
                        <div className="flex-grow min-w-0">
                            <p className="font-bold text-white truncate flex items-center gap-2">{activity.device}{activity.isCurrent && <span className="px-2 py-0.5 bg-green-600/50 text-green-200 text-xs rounded-full font-medium flex-shrink-0">LIVE SESSION</span>}</p>
                            <p className="text-xs text-gray-400 mt-1"><span className="font-mono bg-gray-700/50 px-1 rounded mr-1">{activity.ip}</span> @ {activity.location} ({activity.os})</p>
                        </div>
                        <span className="text-xs text-gray-500 ml-2 flex-shrink-0">{new Date(activity.timestamp).toLocaleTimeString()}</span>
                    </div>
                ))}
            </div>
        </Card>
    ), [loginActivity]);

    const renderActiveDevices = useMemo(() => (
        <Card title="Managed Endpoints Inventory" className="lg:col-span-2">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {devices.map(device => (
                    <div key={device.id} className="p-4 bg-gray-800/50 rounded-lg border border-indigo-700/50 flex flex-col shadow-lg">
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-indigo-900/70 rounded-lg flex items-center justify-center text-indigo-300 flex-shrink-0">{device.type === 'Mobile' ? (<svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>) : (<svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>)}</div>
                                <p className="font-bold text-white truncate">{device.name}</p>
                            </div>
                            <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${device.status === 'active' ? 'bg-green-600/30 text-green-300' : 'bg-red-600/30 text-red-300'}`}>{device.status.toUpperCase()}</span>
                        </div>
                        <p className="text-xs text-gray-400 mb-2">Model: {device.model} ({device.type})</p>
                        <p className="text-xs text-gray-500 truncate">IP: {device.ip} | Last Seen: {new Date(device.lastActivity).toLocaleTimeString()}</p>
                        <div className="mt-3 pt-2 border-t border-gray-700">
                            <p className="text-xs font-semibold text-cyan-400">Permissions Granted: {device.permissions.length}</p>
                            <div className="flex flex-wrap gap-1 mt-1">{device.permissions.slice(0, 3).map(p => (<span key={p} className="text-[10px] bg-gray-700 text-gray-300 px-1 rounded">{p}</span>))}{device.permissions.length > 3 && <span className="text-[10px] text-gray-500">+{device.permissions.length - 3} more</span>}</div>
                        </div>
                    </div>
                ))}
            </div>
        </Card>
    ), [devices]);

    const renderDataPolicies = useMemo(() => (
        <Card title="Data Governance & Sharing Policies" className="lg:col-span-2">
            <p className="text-sm text-gray-400 mb-4">Define granular controls over how internal and external data sets are processed, stored, and shared. Managed by AI Policy Engine.</p>
            <div className="space-y-4">
                {(dataSharingPolicies || []).map(policy => (
                    <div key={policy.policyId} className="p-4 bg-gray-800/70 rounded-lg border border-purple-700/50 flex flex-col md:flex-row justify-between items-start md:items-center">
                        <div className="flex-grow mb-2 md:mb-0">
                            <p className="font-bold text-white text-lg">{policy.policyName}</p>
                            <p className="text-xs text-gray-400 mt-1">Scope: {policy.scope} | Last Reviewed: {policy.lastReviewed}</p>
                        </div>
                        <div className="flex items-center space-x-4">
                            <span className={`text-sm font-semibold ${policy.isActive ? 'text-green-400' : 'text-red-400'}`}>{policy.isActive ? 'ACTIVE' : 'DRAFT'}</span>
                            <SecuritySettingToggle id={`policy-${policy.policyId}`} title="Enable Policy" description={`Toggle activation for ${policy.policyName}`} defaultChecked={policy.isActive} onToggle={(checked) => handlePolicyToggle(policy, checked)} aiImpact='Medium' />
                        </div>
                    </div>
                ))}
            </div>
        </Card>
    ), [dataSharingPolicies, handlePolicyToggle]);

    const renderAPIKeys = useMemo(() => (
        <Card title="System API Key Management" className="lg:col-span-2">
            <p className="text-sm text-gray-400 mb-4">Manage programmatic access tokens. Keys are automatically rotated by the Quantum Key Vault every 90 days.</p>
            <div className="space-y-3">
                {(apiKeys || []).map(key => (
                    <div key={key.id} className="flex justify-between items-center p-3 bg-gray-800/70 rounded-lg border border-yellow-700/50">
                        <div className="flex items-center min-w-0">
                            <svg className="w-5 h-5 text-yellow-400 mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M6 16h.01" /></svg>
                            <div>
                                <p className="font-mono text-sm text-white truncate">{key.keyName} ({key.id.substring(0, 8)}...)</p>
                                <p className="text-xs text-gray-500">Created: {key.creationDate} | Permissions: {key.scopes.join(', ')}</p>
                            </div>
                        </div>
                        <button onClick={() => handleAPIKeyRevoke(key.id)} className="px-3 py-1 bg-red-900/30 hover:bg-red-900/50 text-red-300 rounded-md text-xs transition-colors flex-shrink-0 ml-4">Revoke Now</button>
                    </div>
                ))}
            </div>
        </Card>
    ), [apiKeys, handleAPIKeyRevoke]);

    const renderAIAnalysis = useMemo(() => (
        <div className="space-y-6">
            <Card title={`AI Threat Intelligence Feed (${AI_INSIGHT_ENGINE_VERSION})`}>
                <div className="flex justify-between items-center mb-4 border-b border-gray-800 pb-3">
                    <p className="text-gray-400 text-sm">Real-time behavioral analysis and predictive threat modeling.</p>
                    <span className="text-sm font-bold text-cyan-400">Total Insights: {aiInsights.length}</span>
                </div>
                <div className="space-y-4">
                    {aiInsights.length > 0 ? (aiInsights.map(insight => (<AISecurityInsightCard key={insight.id} insight={insight} />))) : (<div className="p-6 bg-gray-800/50 rounded-lg text-center border border-dashed border-gray-700"><p className="text-gray-500 italic">AI Engine reports no immediate high-priority anomalies at this time.</p></div>)}
                </div>
            </Card>
            <Card title="Security Awareness Training Modules">
                <p className="text-sm text-gray-400 mb-4">Track mandatory compliance training completion status across the organization.</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {(securityAwarenessModules || []).map(module => (
                        <div key={module.moduleId} className="p-4 bg-gray-800/70 rounded-lg border border-green-700/50">
                            <p className="font-bold text-white">{module.title}</p>
                            <p className="text-xs text-gray-400 mt-1">Status: {module.completionRate}% Complete</p>
                            <div className="w-full bg-gray-700 rounded-full h-2.5 mt-2"><div className="bg-green-500 h-2.5 rounded-full" style={{ width: `${module.completionRate}%` }}></div></div>
                        </div>
                    ))}
                </div>
            </Card>
        </div>
    ), [aiInsights, securityAwarenessModules]);

    const renderAuditLogs = useMemo(() => {
        const displayLogs = (auditLogs || []).slice(0, MAX_AUDIT_LOG_DISPLAY);
        return (
            <Card title={`System Audit Trail (Last ${displayLogs.length} Entries)`} className="lg:col-span-2">
                <p className="text-sm text-gray-400 mb-3">Immutable record of all configuration changes, data access events, and administrative actions.</p>
                <div className="overflow-x-auto max-h-[500px] custom-scrollbar">
                    <table className="min-w-full divide-y divide-gray-700">
                        <thead className="sticky top-0 bg-gray-800 z-10"><tr><th className="px-4 py-2 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Time</th><th className="px-4 py-2 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">User/System</th><th className="px-4 py-2 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Action</th><th className="px-4 py-2 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Target</th><th className="px-4 py-2 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Status</th></tr></thead>
                        <tbody className="divide-y divide-gray-800">{displayLogs.map((log: AuditLogEntry) => (<tr key={log.id} className="hover:bg-gray-800/50 transition-colors"><td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">{new Date(log.timestamp).toLocaleTimeString()}</td><td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-white">{log.userId.includes('sys_') ? 'SYSTEM' : log.userId}</td><td className="px-4 py-2 text-sm text-cyan-400">{log.action}</td><td className="px-4 py-2 text-sm text-gray-400">{log.targetResource}</td><td className="px-4 py-2 whitespace-nowrap"><span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${log.success ? 'bg-green-900/50 text-green-300' : 'bg-red-900/50 text-red-300'}`}>{log.success ? 'SUCCESS' : 'FAILURE'}</span></td></tr>))}</tbody>
                    </table>
                </div>
                {displayLogs.length < (auditLogs?.length || 0) && (<p className="text-center text-sm text-gray-500 mt-3">Displaying first {MAX_AUDIT_LOG_DISPLAY} logs. Load full history via dedicated Audit Console.</p>)}
            </Card>
        );
    }, [auditLogs]);

    const renderSecurityScoreGauge = useMemo(() => {
        const radius = 50; const circumference = 2 * Math.PI * radius; const offset = circumference - (securityScore / 100) * circumference; const color = securityScore >= 90 ? 'stroke-green-500' : securityScore >= 70 ? 'stroke-yellow-500' : 'stroke-red-500';
        return (
            <div className="flex flex-col items-center p-6 bg-gray-800/70 rounded-xl shadow-inner border border-gray-700">
                <h3 className="text-xl font-bold text-white mb-3">Quantum Security Index (QSI)</h3>
                <svg width="120" height="120" viewBox="0 0 120 120" className="transform -rotate-90"><circle cx="60" cy="60" r={radius} fill="transparent" stroke="#374151" strokeWidth="10" /><circle cx="60" cy="60" r={radius} fill="transparent" stroke={color.replace('stroke-', '')} strokeWidth="10" strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round" className="transition-all duration-1000 ease-out" /><text x="60" y="60" dominantBaseline="middle" textAnchor="middle" className="fill-current text-white" fontSize="20" fontWeight="bold">{securityScore}%</text></svg>
                <p className="text-sm text-gray-400 mt-2">Target: 95%</p>
            </div>
        );
    }, [securityScore]);

    const renderTrustedContacts = useMemo(() => (
        <Card title="Emergency Trusted Contacts" className="lg:col-span-1">
            <p className="text-sm text-gray-400 mb-4">Contacts authorized for emergency account recovery or high-risk alerts.</p>
            <div className="space-y-3">
                {(trustedContacts || []).map((contact: TrustedContact) => (
                    <div key={contact.id} className="flex justify-between items-center p-3 bg-gray-800/50 rounded-lg border border-gray-700">
                        <div className="flex items-center">
                            <div className="w-8 h-8 bg-pink-900/50 rounded-full flex items-center justify-center text-pink-300 mr-3"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg></div>
                            <div><p className="font-semibold text-white">{contact.name}</p><p className="text-xs text-gray-400">{contact.relationship}</p></div>
                        </div>
                        <span className={`text-xs font-medium px-2 py-0.5 rounded ${contact.verified ? 'bg-green-900/30 text-green-400' : 'bg-red-900/30 text-red-400'}`}>{contact.verified ? 'Verified' : 'Pending'}</span>
                    </div>
                ))}
            </div>
        </Card>
    ), [trustedContacts]);

    const renderHFTView = useMemo(() => (
        <Card title="High-Frequency Trading (HFT) Security Module">
            <p className="text-sm text-gray-400 mb-4">Real-time monitoring and automated circuit breakers for algorithmic trading infrastructure.</p>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-4">
                    <h3 className="text-lg font-bold text-white">Algorithmic Kill Switches & Rules</h3>
                    {hftRules.map(rule => (
                        <div key={rule.id} className="p-4 bg-gray-800/70 rounded-lg border border-red-700/50">
                            <div className="flex justify-between items-center">
                                <p className="font-bold text-lg text-white">{rule.name}</p>
                                <SecuritySettingToggle id={`hft-${rule.id}`} title="" description="" defaultChecked={rule.isEnabled} />
                            </div>
                            <p className="text-sm text-gray-400 mt-1">{rule.description}</p>
                            <div className="text-xs mt-2 pt-2 border-t border-gray-700 flex justify-between">
                                <span className="font-mono bg-gray-900 px-2 py-1 rounded">IF {rule.condition} THEN {rule.action}</span>
                                <span className="text-gray-500">Last Triggered: {rule.lastTriggered ? new Date(rule.lastTriggered).toLocaleString() : 'Never'}</span>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="space-y-4">
                    <h3 className="text-lg font-bold text-white">System Latency</h3>
                    <div className="p-4 bg-gray-800/70 rounded-lg text-center">
                        <p className="text-5xl font-mono font-extrabold text-green-400">0.72ms</p>
                        <p className="text-sm text-gray-400">Exchange Co-location (LD4)</p>
                    </div>
                    <button className="w-full py-2 bg-blue-700 hover:bg-blue-600 rounded-lg font-semibold">Define New HFT Rule</button>
                </div>
            </div>
        </Card>
    ), [hftRules]);

    const renderQuantumView = useMemo(() => (
        <Card title="Quantum Threat Mitigation & Future Tech">
            <p className="text-sm text-gray-400 mb-4">Tracking the enterprise-wide migration to post-quantum cryptography (PQC) and other next-generation security paradigms.</p>
            <div className="overflow-x-auto custom-scrollbar">
                <table className="min-w-full divide-y divide-gray-700">
                    <thead className="bg-gray-800"><tr><th className="px-4 py-2 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">System Component</th><th className="px-4 py-2 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">PQC Algorithm</th><th className="px-4 py-2 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Status</th><th className="px-4 py-2 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Migration ETA</th></tr></thead>
                    <tbody className="divide-y divide-gray-800">
                        {quantumStatuses.map(qs => (
                            <tr key={qs.id} className="hover:bg-gray-800/50">
                                <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-white">{qs.systemComponent}</td>
                                <td className="px-4 py-3 whitespace-nowrap text-sm font-mono text-cyan-400">{qs.algorithm}</td>
                                <td className="px-4 py-3 whitespace-nowrap text-sm"><span className={`px-2 py-0.5 rounded-full text-xs font-bold ${qs.status === 'MIGRATED' ? 'bg-green-600/30 text-green-300' : qs.status === 'PENDING' ? 'bg-yellow-600/30 text-yellow-300' : 'bg-red-600/30 text-red-300'}`}>{qs.status}</span></td>
                                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-400">{qs.migrationEta}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </Card>
    ), [quantumStatuses]);

    const renderIncidentResponseView = useMemo(() => (
        <div className="space-y-6">
            <Card title="Incident Response & Emergency Protocols" className="border-2 border-red-500/50 shadow-red-500/20 shadow-2xl">
                <div className="flex flex-col md:flex-row justify-between items-center p-4 bg-red-900/30 rounded-lg">
                    <div>
                        <h3 className="text-xl font-extrabold text-red-300">Global Lockdown Protocol</h3>
                        <p className="text-red-400 max-w-2xl">Immediately freeze all transactions, terminate sessions, revoke temporary keys, and place the system in a restricted, audit-only state. REQUIRES C-LEVEL AUTHENTICATION.</p>
                    </div>
                    <button onClick={handleGlobalLockdown} className="mt-4 md:mt-0 px-8 py-4 bg-red-700 hover:bg-red-600 text-white font-bold rounded-lg text-lg transition-transform hover:scale-105 shadow-lg flex-shrink-0">INITIATE LOCKDOWN</button>
                </div>
            </Card>
            <Card title="Active Security Incidents">
                <div className="space-y-4">
                    {incidents.map(incident => (
                        <div key={incident.id} className="p-4 bg-gray-800/70 rounded-lg border-l-4 border-yellow-500">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="font-bold text-lg text-white">{incident.title}</p>
                                    <p className="text-xs text-gray-400">Reported: {new Date(incident.timestamp).toLocaleString()} | Assigned: {incident.assignedTo}</p>
                                </div>
                                <span className={`px-3 py-1 rounded-full text-sm font-bold ${incident.status === 'Resolved' ? 'bg-green-600/30 text-green-300' : 'bg-yellow-600/30 text-yellow-300'}`}>{incident.status}</span>
                            </div>
                            <p className="text-sm text-gray-300 mt-2">{incident.summary}</p>
                        </div>
                    ))}
                    <button className="w-full py-3 bg-green-700 hover:bg-green-600 rounded-lg font-semibold text-lg">Report New Incident</button>
                </div>
            </Card>
        </div>
    ), [incidents]);

    const renderGeinCommandView = useMemo(() => (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            <div className="xl:col-span-2 space-y-6">
                <Card title="GEIN Command Console">
                    <div className="h-[600px] flex flex-col">
                        <div className="flex-grow p-4 bg-gray-900/70 rounded-t-lg overflow-y-auto custom-scrollbar space-y-4">
                            {geinConsoleHistory.map(msg => (
                                <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-xl p-3 rounded-lg ${msg.role === 'user' ? 'bg-blue-800' : 'bg-gray-700'}`}>
                                        <p className="text-white whitespace-pre-wrap">{msg.text}{msg.isStreaming && <span className="inline-block w-2 h-4 bg-cyan-400 animate-pulse ml-1"></span>}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="flex p-2 bg-gray-800 rounded-b-lg border-t border-gray-700">
                            <input type="text" value={geinConsoleInput} onChange={(e) => setGeinConsoleInput(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleGeinQuery()} placeholder="Query GEIN... (e.g., 'Summarize anomalous activity on dvc_2')" className="flex-grow bg-transparent text-white placeholder-gray-500 focus:outline-none px-3" />
                            <button onClick={handleGeinQuery} className="px-6 py-2 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-md transition-colors">Send</button>
                        </div>
                    </div>
                </Card>
                <Card title="GEIN Configuration">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">System Instruction</label>
                            <textarea value={geinSystemInstruction} onChange={(e) => setGeinSystemInstruction(e.target.value)} rows={5} className="w-full p-2 bg-gray-900 rounded-md text-sm text-gray-300 border border-gray-700 focus:ring-cyan-500 focus:border-cyan-500"></textarea>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">Thinking Budget: {geinThinkingBudget === 0 ? 'Disabled' : `${geinThinkingBudget} tokens`}</label>
                            <input type="range" min="0" max="10000" step="500" value={geinThinkingBudget} onChange={(e) => setGeinThinkingBudget(Number(e.target.value))} className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer" />
                            <p className="text-xs text-gray-500 mt-1">Controls enhanced quality processing. Higher values may increase latency and token usage. 0 disables thinking.</p>
                        </div>
                    </div>
                </Card>
            </div>
            <div className="space-y-6">
                <Card title="Cognitive Core Status">
                    <div className="space-y-3">
                        {cognitiveCores.map(core => (
                            <div key={core.name} className="p-3 bg-gray-800/50 rounded-lg">
                                <div className="flex justify-between items-center">
                                    <p className="font-bold text-white">{core.name}</p>
                                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${core.status === 'NOMINAL' ? 'bg-green-600/30 text-green-300' : 'bg-yellow-600/30 text-yellow-300'}`}>{core.status}</span>
                                </div>
                                <p className="text-xs text-gray-400 mt-1 truncate">Task: {core.primaryTask}</p>
                                <div className="w-full bg-gray-700 rounded-full h-1.5 mt-2"><div className="bg-cyan-500 h-1.5 rounded-full" style={{ width: `${core.load}%` }}></div></div>
                            </div>
                        ))}
                    </div>
                </Card>
                <Card title="Real-Time Data Ingestion Stream">
                    <div className="h-[400px] overflow-y-auto custom-scrollbar space-y-2 font-mono text-xs">
                        {geinInputStream.map(chunk => (
                            <div key={chunk.id} className="flex gap-2 items-center text-gray-400">
                                <span className="text-gray-600">{new Date(chunk.timestamp).toLocaleTimeString()}</span>
                                <span className="text-purple-400 w-28 truncate">{chunk.sourceNode}</span>
                                <span className="text-cyan-400 w-24">{chunk.dataType}</span>
                                <span className="flex-grow truncate">{chunk.payload}</span>
                                <span style={{ color: `rgba(255, 255, 255, ${chunk.geinScore})` }}>{chunk.geinScore.toFixed(2)}</span>
                            </div>
                        ))}
                    </div>
                </Card>
            </div>
        </div>
    ), [geinConsoleHistory, geinConsoleInput, geinSystemInstruction, geinThinkingBudget, cognitiveCores, geinInputStream, handleGeinQuery]);

    // --- Tab Content Rendering ---
    const renderContent = () => {
        switch (activeTab) {
            case 'overview': return (<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">{renderSecurityScoreGauge}{renderRecentActivity}{renderActiveDevices}{renderLinkedAccounts}{renderSecuritySettings}</div>);
            case 'policies': return (<div className="grid grid-cols-1 gap-6">{renderDataPolicies}<Card title="Transaction Rule Engine"><p className="text-sm text-gray-400 mb-4">Define automated responses to financial events based on predefined risk thresholds.</p><div className="space-y-3">{(context?.transactionRules || []).map((rule: TransactionRule) => (<div key={rule.ruleId} className="p-3 bg-gray-800/70 rounded-lg border border-cyan-700/50 flex justify-between items-center"><div><p className="font-bold text-white">{rule.name}</p><p className="text-xs text-gray-400">Trigger: {rule.triggerCondition} | Action: {rule.action}</p></div><span className={`text-xs font-medium px-2 py-0.5 rounded ${rule.isEnabled ? 'bg-green-900/30 text-green-400' : 'bg-red-900/30 text-red-400'}`}>{rule.isEnabled ? 'ACTIVE' : 'DISABLED'}</span></div>))}</div></Card></div>);
            case 'keys': return (<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">{renderAPIKeys}{renderTrustedContacts}<Card title="Threat Alert History" className="lg:col-span-3"><p className="text-sm text-gray-400 mb-4">Historical record of confirmed security incidents.</p><div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">{(threatAlerts || []).map((alert: ThreatAlert) => (<div key={alert.alertId} className="p-3 bg-red-900/30 rounded-lg border border-red-600 flex justify-between items-center"><div><p className="font-bold text-red-300">{alert.title}</p><p className="text-xs text-gray-300">{alert.description}</p></div><span className="text-xs text-gray-300">{new Date(alert.timestamp).toLocaleDateString()}</span></div>))}</div></Card></div>);
            case 'ai_analysis': return (<div className="grid grid-cols-1 gap-6">{renderAIAnalysis}{renderAuditLogs}</div>);
            case 'hft': return renderHFTView;
            case 'quantum': return renderQuantumView;
            case 'incidents': return renderIncidentResponseView;
            case 'gein_command': return renderGeinCommandView;
            default: return null;
        }
    };

    const tabs: { id: typeof activeTab, label: string }[] = [
        { id: 'overview', label: 'Overview & Access' }, { id: 'policies', label: 'Governance & Rules' }, { id: 'keys', label: 'API & Contacts' }, { id: 'ai_analysis', label: 'AI Threat Analysis' }, { id: 'hft', label: 'HFT Security' }, { id: 'quantum', label: 'Future Tech' }, { id: 'incidents', label: 'Incident Response' }, { id: 'gein_command', label: 'GEIN Command' },
    ];

    return (
        <div className="space-y-8 p-4 sm:p-8">
            <header className="pb-4 border-b border-gray-700">
                <h1 className="text-4xl font-extrabold text-white tracking-tighter">Enterprise Security Command Center</h1>
                <p className="text-lg text-gray-400 mt-1">Centralized control plane for data integrity, access management, and threat mitigation. Engine: {AI_INSIGHT_ENGINE_VERSION}</p>
            </header>

            <div className="flex border-b border-gray-700 overflow-x-auto custom-scrollbar">{tabs.map((tab) => (<button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`px-6 py-3 text-lg font-semibold transition-all duration-300 whitespace-nowrap ${activeTab === tab.id ? 'text-cyan-400 border-b-4 border-cyan-500' : 'text-gray-400 hover:text-white hover:border-b-4 hover:border-gray-600'}`}>{tab.label}</button>))}</div>

            <main>{renderContent()}</main>

            {notification && (<NotificationToast message={notification.message} type={notification.type} isVisible={notification.isVisible} onClose={closeNotification} />)}
        </div>
    );
};

export default SecurityView;

================================================================================
// APPENDED FROM REPO: diplomat-bit/magic | ORIGINAL PATH: diplomat-bit-magic-a3f5ff1/components/SecurityView (2).tsx
================================================================================

// components/SecurityView.tsx
// RE-ENACTED & EXPANDED: This component has been resurrected from its deprecated state.
// It is now the "AegisVault," the full-featured security and access control center
// for the user's financial kingdom. It provides transparent controls for data sharing,
// account security, and activity monitoring.

import React, { useContext, useState } from 'react';
import { DataContext } from '../context/DataContext';
import Card from './Card';
import PlaidLinkButton from './PlaidLinkButton';

// ================================================================================================
// TYPE DEFINITIONS & MOCK DATA
// ================================================================================================

interface LoginActivity {
    id: string;
    device: string;
    location: string;
    ip: string;
    timestamp: string;
    isCurrent: boolean;
}

const MOCK_LOGIN_ACTIVITY: LoginActivity[] = [
    { id: '1', device: 'Chrome on macOS', location: 'New York, USA', ip: '192.168.1.1', timestamp: '2 minutes ago', isCurrent: true },
    { id: '2', device: 'DemoBank App on iOS', location: 'New York, USA', ip: '172.16.0.1', timestamp: '3 days ago', isCurrent: false },
    { id: '3', device: 'Chrome on Windows', location: 'Chicago, USA', ip: '10.0.0.1', timestamp: '1 week ago', isCurrent: false },
];

// ================================================================================================
// SUB-COMPONENTS
// ================================================================================================

/**
 * @description A reusable component for displaying a single security setting with a toggle.
 */
const SecuritySettingToggle: React.FC<{
    title: string;
    description: string;
    defaultChecked: boolean;
}> = ({ title, description, defaultChecked }) => (
    <li className="py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <div>
            <h4 className="font-semibold text-white">{title}</h4>
            <p className="text-sm text-gray-400 max-w-md mt-1">{description}</p>
        </div>
        <input
            type="checkbox"
            className="toggle toggle-cyan mt-2 sm:mt-0"
            defaultChecked={defaultChecked}
            aria-label={`Toggle for ${title}`}
        />
    </li>
);

/**
 * @description A modal for simulating a password change flow.
 */
const ChangePasswordModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 backdrop-blur-sm" onClick={onClose}>
            <div className="bg-gray-800 rounded-lg shadow-2xl max-w-md w-full border border-gray-700" onClick={e => e.stopPropagation()}>
                <div className="p-4 border-b border-gray-700">
                    <h3 className="text-lg font-semibold text-white">Change Password</h3>
                </div>
                <div className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-300">Current Password</label>
                        <input type="password" className="mt-1 w-full bg-gray-700/50 border-gray-600 rounded-md p-2 text-white" />
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-300">New Password</label>
                        <input type="password" className="mt-1 w-full bg-gray-700/50 border-gray-600 rounded-md p-2 text-white" />
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-300">Confirm New Password</label>
                        <input type="password" className="mt-1 w-full bg-gray-700/50 border-gray-600 rounded-md p-2 text-white" />
                    </div>
                    <button onClick={() => { alert('Password changed successfully.'); onClose(); }} className="w-full py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg mt-2">
                        Update Password
                    </button>
                </div>
            </div>
        </div>
    );
};

// ================================================================================================
// MAIN VIEW COMPONENT: SecurityView (AegisVault)
// ================================================================================================

const SecurityView: React.FC = () => {
    const context = useContext(DataContext);
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
    
    if (!context) {
        throw new Error("SecurityView must be within a DataProvider.");
    }
    
    // FIX: Destructure missing functions from context to resolve property not found errors.
    const { linkedAccounts, unlinkAccount, handlePlaidSuccess } = context;

    return (
        <>
            <div className="space-y-6">
                <h2 className="text-3xl font-bold text-white tracking-wider">Security & Access (AegisVault)</h2>
                
                {/* Linked Accounts & Data Sources Card */}
                <Card title="Linked Accounts & Data Sources" titleTooltip="Manage connections to external financial institutions. You have full control to link or unlink accounts at any time.">
                    <p className="text-sm text-gray-400 mb-4">
                        These are the external accounts you've securely connected via Plaid. This allows Demo Bank to provide a holistic view of your finances. Your credentials are never stored by us.
                    </p>
                    <div className="space-y-3 mb-6">
                        {linkedAccounts.length > 0 ? linkedAccounts.map(account => (
                            <div key={account.id} className="flex justify-between items-center p-3 bg-gray-800/50 rounded-lg border border-gray-700/60">
                                <div>
                                    <h4 className="font-semibold text-white">{account.name}</h4>
                                    <p className="text-sm text-gray-400">Account ending in **** {account.mask}</p>
                                </div>
                                <button onClick={() => unlinkAccount(account.id)} className="px-3 py-1 bg-red-600/50 hover:bg-red-600 text-white rounded-lg text-xs font-medium">
                                    Unlink
                                </button>
                            </div>
                        )) : (
                            <p className="text-center text-gray-500 py-4">No accounts linked yet.</p>
                        )}
                    </div>
                    <PlaidLinkButton onSuccess={handlePlaidSuccess} />
                </Card>

                {/* Security Settings Card */}
                <Card title="Security Settings">
                    <ul className="divide-y divide-gray-700/60">
                        <SecuritySettingToggle
                            title="Two-Factor Authentication (2FA)"
                            description="Requires a code from your authenticator app or SMS in addition to your password for enhanced security."
                            defaultChecked={true}
                        />
                        <SecuritySettingToggle
                            title="Biometric Login"
                            description="Enable passwordless login using your device's Face ID or Touch ID for a faster and more secure experience."
                            defaultChecked={false}
                        />
                        <li className="py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center">
                            <div>
                                <h4 className="font-semibold text-white">Change Password</h4>
                                <p className="text-sm text-gray-400 max-w-md mt-1">It's a good practice to update your password regularly.</p>
                            </div>
                            <button onClick={() => setIsPasswordModalOpen(true)} className="mt-2 sm:mt-0 px-4 py-2 bg-gray-600/50 hover:bg-gray-600 text-white rounded-lg text-xs font-medium">
                                Change
                            </button>
                        </li>
                    </ul>
                </Card>

                {/* Login Activity Card */}
                <Card title="Recent Login Activity">
                     <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left text-gray-400">
                            <thead className="text-xs text-gray-300 uppercase bg-gray-900/30">
                                <tr>
                                    <th className="px-6 py-3">Device</th>
                                    <th className="px-6 py-3">Location</th>
                                    <th className="px-6 py-3">Timestamp</th>
                                </tr>
                            </thead>
                            <tbody>
                                {MOCK_LOGIN_ACTIVITY.map(activity => (
                                    <tr key={activity.id} className={`border-b border-gray-800 ${activity.isCurrent ? 'bg-cyan-500/10' : 'hover:bg-gray-800/50'}`}>
                                        <td className="px-6 py-4 font-medium text-white">{activity.device} {activity.isCurrent && <span className="text-xs text-cyan-300">(Current)</span>}</td>
                                        <td className="px-6 py-4">{activity.location}</td>
                                        <td className="px-6 py-4">{activity.timestamp}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Card>
            </div>
            <ChangePasswordModal isOpen={isPasswordModalOpen} onClose={() => setIsPasswordModalOpen(false)} />
        </>
    );
};

export default SecurityView;


================================================================================
// APPENDED FROM REPO: diplomat-bit/magic | ORIGINAL PATH: diplomat-bit-magic-a3f5ff1/components/SecurityView (3).tsx
================================================================================

import React, { useState } from 'react';
// axios removed as direct API key submission from frontend is not the secure approach
import './SecurityView.css'; // This CSS will be provided in Part 2, assuming general layout styles are still relevant

// =================================================================================
// REPLACEMENT RATIONALE:
// The original SecurityView component presented a form for directly inputting
// and submitting over 200 system-level backend API keys from the frontend
// to a generic backend endpoint. This approach is fundamentally flawed and
// highly insecure for a production application for several reasons:
// 1. Exposure Risk: Sensitive API keys should never be directly exposed to
//    the client-side (frontend) code or manually handled by end-users.
// 2. Security Best Practices: Production-grade applications must manage
//    sensitive credentials (like API keys, database passwords, etc.) using
//    dedicated, secure secret management services.
//
// SYSTEM SECRETS MANAGEMENT:
// In alignment with security best practices and the refactoring plan's goal
// to "Integrate AWS Secrets Manager or Vault for all sensitive values,"
// system-level API keys and other sensitive credentials are to be managed
// exclusively by the backend infrastructure. This involves:
// - Storing secrets in secure services like AWS Secrets Manager, Google Secret Manager,
//   Azure Key Vault, or HashiCorp Vault.
// - Ensuring secrets are encrypted at rest and in transit.
// - Implementing automatic key rotation where possible.
// - Granting access to secrets only to authorized backend services using
//   Identity and Access Management (IAM) roles or service accounts.
// - Never exposing these keys to client-side code, environmental variables on the frontend,
//   or manual input forms in the UI for system-level credentials.
//
// REPLACEMENT:
// This component has been refactored to remove the insecure API key input forms.
// A "SecurityView" on the frontend for a secure, production-ready application
// should instead focus on:
// 1. Providing an overview of the application's security posture.
// 2. Allowing users to manage their *own* security settings (e.g., password changes,
//    multi-factor authentication setup).
// 3. Facilitating secure initiation of external integrations (e.g., OAuth flows
//    for connecting user bank accounts via Plaid Link), where sensitive tokens
//    are securely exchanged and managed on the backend, not directly inputted by the user.
//
// For the MVP, system-level API keys are assumed to be managed via AWS Secrets Manager
// or similar infrastructure by backend services. This frontend view is repurposed
// to reflect general application security information and placeholders for future
// user-specific security settings or secure integration management.
// =================================================================================

// Placeholder interface for future user-specific security settings
interface UserSecuritySettings {
  twoFactorEnabled: boolean;
  lastPasswordChange: string;
  // Add other user-specific security settings as needed for the MVP or future modules
}

const SecurityView: React.FC = () => {
  // Mock state for user security settings, demonstrating a more appropriate use case
  const [userSettings, setUserSettings] = useState<UserSecuritySettings>({
    twoFactorEnabled: false,
    lastPasswordChange: '2023-01-01', // Example date
  });
  const [statusMessage, setStatusMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'user-settings' | 'integrations'>('overview');

  // Example function for a user-centric security action (e.g., toggling 2FA)
  const handleToggleTwoFactor = async () => {
    setIsLoading(true);
    setStatusMessage('Updating 2FA status...');
    try {
      // In a real application, this would call a secure backend API endpoint
      // to update the user's 2FA status. The backend would handle the actual
      // logic for enabling/disabling 2FA (e.g., verifying OTPs, managing keys).
      // Example: await secureBackendApi.post('/user/toggle-2fa', { enabled: !userSettings.twoFactorEnabled });
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      setUserSettings(prev => ({ ...prev, twoFactorEnabled: !prev.twoFactorEnabled }));
      setStatusMessage('2FA status updated successfully.');
    } catch (error) {
      setStatusMessage('Failed to update 2FA status.');
      console.error('2FA update error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Example for initiating a secure external service connection (e.g., connecting a bank via Plaid)
  const handleConnectPlaid = async () => {
    setIsLoading(true);
    setStatusMessage('Initiating Plaid connection...');
    try {
      // For bank aggregation (MVP candidate), this would involve a secure backend endpoint
      // that generates a Plaid Link token. The frontend then uses this token to launch
      // the Plaid Link UI, allowing the user to securely connect their bank account.
      // The resulting Plaid 'public_token' is then sent to the backend to exchange for
      // an 'access_token', which the backend stores and uses. The frontend never sees raw API keys.
      // Example: const response = await secureBackendApi.post('/plaid/create-link-token');
      // Plaid.create({ token: response.data.link_token, onSuccess: (public_token) => sendToBackend(public_token) }).open();
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API call
      setStatusMessage('Plaid connection initiated. (Note: A real implementation would launch Plaid Link securely.)');
    } catch (error) {
      setStatusMessage('Failed to initiate Plaid connection.');
      console.error('Plaid connection error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="settings-container">
      <h1>Security Overview & Settings</h1>
      <p className="subtitle">
        This section provides an overview of the application's security posture and allows management of user-specific security settings and integrations.
      </p>

      <div className="tabs">
        <button onClick={() => setActiveTab('overview')} className={activeTab === 'overview' ? 'active' : ''}>
          Security Overview
        </button>
        <button onClick={() => setActiveTab('user-settings')} className={activeTab === 'user-settings' ? 'active' : ''}>
          Your Security Settings
        </button>
        <button onClick={() => setActiveTab('integrations')} className={activeTab === 'integrations' ? 'active' : ''}>
          External Integrations
        </button>
      </div>

      <div className="settings-form"> {/* Reusing settings-form for general layout styling */}
        {activeTab === 'overview' && (
          <div className="form-section">
            <h2>System Security Posture & Secrets Management</h2>
            <p>
              <strong>Important:</strong> All system-level sensitive credentials (e.g., API keys for payment gateways, cloud services, backend integrations)
              are securely managed on the backend using an enterprise-grade secrets management solution (e.g., AWS Secrets Manager, HashiCorp Vault).
              These keys are never exposed to the frontend, stored in client-side code, or manually entered via this user interface.
              Access to secrets is strictly controlled through IAM roles, service accounts, and least-privilege principles.
            </p>
            <p>
              This architecture ensures robust security, minimizes the risk of credential compromise, and facilitates compliant key rotation and auditing.
            </p>
            <h3>Authentication & Authorization</h3>
            <ul>
              <li>User authentication is implemented with secure JSON Web Tokens (JWTs) and robust session management.</li>
              <li>Role-based access control (RBAC) enforces granular permissions across the application, ensuring users only access authorized features and data.</li>
              <li>Sensitive operations (e.g., financial transactions, configuration changes) may require re-authentication or multi-factor verification.</li>
            </ul>
          </div>
        )}

        {activeTab === 'user-settings' && (
          <div className="form-section">
            <h2>Your Account Security Settings</h2>
            <div className="input-group">
              <label>Multi-Factor Authentication (2FA)</label>
              <p>Status: {userSettings.twoFactorEnabled ? 'Enabled' : 'Disabled'}</p>
              <button onClick={handleToggleTwoFactor} disabled={isLoading} className="action-button">
                {isLoading ? 'Updating...' : (userSettings.twoFactorEnabled ? 'Disable 2FA' : 'Enable 2FA')}
              </button>
            </div>
            <div className="input-group">
              <label>Last Password Change</label>
              <p>{userSettings.lastPasswordChange}</p>
              <button disabled={isLoading} className="action-button">Change Password</button> {/* Placeholder for change password flow */}
            </div>
            {/* Add more user-specific security settings here for the MVP, e.g., Linked Devices, Session Management */}
          </div>
        )}

        {activeTab === 'integrations' && (
          <div className="form-section">
            <h2>Manage External Financial Integrations</h2>
            <p>
              Connect your personal financial accounts to enable features like multi-bank aggregation, transaction intelligence, and treasury automation.
              These integrations utilize secure OAuth2 and Open Banking protocols, ensuring your sensitive bank credentials are never directly handled by this application.
            </p>
            <div className="input-group">
              <label>Plaid Integration (Bank Account Aggregation)</label>
              <p>Status: Not Connected</p> {/* In a real app, this would dynamically show connected status */}
              <button onClick={handleConnectPlaid} disabled={isLoading} className="action-button">
                {isLoading ? 'Connecting...' : 'Connect Bank Account (via Plaid Link)'}
              </button>
              <p className="note">Securely link your bank accounts through Plaid to view aggregated financial data.</p>
            </div>
            {/* Add more external integration options here relevant to the MVP (e.g., accounting software, other financial APIs) */}
          </div>
        )}

        {statusMessage && <p className="status-message">{statusMessage}</p>}
      </div>
    </div>
  );
};

export default SecurityView;

================================================================================
// APPENDED FROM REPO: diplomat-bit/magic | ORIGINAL PATH: diplomat-bit-magic-a3f5ff1/components/SecurityView.tsx
================================================================================


import React, { useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { DataContext } from '../context/DataContext';
import Card from './Card';
import PlaidLinkButton from './PlaidLinkButton';
import { 
    LoginActivity, Device, DataSharingPolicy, TransactionRule, ThreatAlert, 
    AuditLogEntry, APIKey, TrustedContact, SecurityAwarenessModule, SecurityScoreMetric, UserProfile 
} from '../types';

// --- AI/ML Integration Placeholder Types (Simulated for expansion) ---
interface AISecurityInsight {
    id: string;
    timestamp: string;
    severity: 'Low' | 'Medium' | 'High' | 'Critical';
    summary: string;
    recommendation: string;
    sourceModel: string;
}

// --- Constants for Billion Dollar Features ---
const AI_INSIGHT_ENGINE_VERSION = "ChaosEngine v0.0.1-Garbage";
const MAX_AUDIT_LOG_DISPLAY = 5;

// --- Helper Components ---

export const SecuritySettingToggle: React.FC<{
    id: string;
    title: string;
    description: string;
    defaultChecked: boolean;
    onToggle?: (checked: boolean) => void;
    disabled?: boolean;
    aiImpact?: 'High' | 'Medium' | 'Low' | 'None';
}> = ({ id, title, description, defaultChecked, onToggle, disabled, aiImpact = 'None' }) => {
    const [isChecked, setIsChecked] = useState(defaultChecked);
    const { showSystemAlert } = useContext(DataContext) || {};

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newState = e.target.checked;
        setIsChecked(newState);
        onToggle && onToggle(newState);
        
        if (showSystemAlert) {
            const impactColor = aiImpact === 'High' ? 'text-red-400' : aiImpact === 'Medium' ? 'text-yellow-400' : 'text-green-400';
            showSystemAlert(`Configuration Change Detected: ${title} set to ${newState ? 'Enabled' : 'Disabled'}. AI Risk Assessment: ${aiImpact}.`, 'info');
        }
    };

    const aiIndicator = useMemo(() => {
        if (aiImpact === 'None') return null;
        const colorMap = {
            High: 'bg-red-500',
            Medium: 'bg-yellow-500',
            Low: 'bg-blue-500',
        };
        return (
            <span className={`ml-3 px-2 py-0.5 text-xs font-bold rounded-full text-white ${colorMap[aiImpact]}`}>
                AI {aiImpact}
            </span>
        );
    }, [aiImpact]);

    return (
        <li className="py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-gray-800/70">
            <div className="flex-grow">
                <label htmlFor={`toggle-${id}`} className="font-bold text-lg text-white cursor-pointer flex items-center">
                    {title}
                    {aiIndicator}
                </label>
                <p className="text-sm text-gray-400 max-w-xl mt-1">{description}</p>
            </div>
            <div className="flex items-center mt-2 sm:mt-0">
                <span className={`mr-3 text-sm font-medium ${isChecked ? 'text-green-400' : 'text-red-400'}`}>
                    {isChecked ? 'ACTIVE' : 'INACTIVE'}
                </span>
                <input
                    type="checkbox"
                    id={`toggle-${id}`}
                    className="toggle toggle-cyan toggle-lg"
                    checked={isChecked}
                    onChange={handleChange}
                    disabled={disabled}
                    aria-label={`Toggle for ${title}`}
                />
            </div>
        </li>
    );
};

export const NotificationToast: React.FC<{
    message: string;
    type: 'success' | 'error' | 'info' | 'warning' | 'critical';
    onClose: () => void;
    isVisible: boolean;
}> = ({ message, type, onClose, isVisible }) => {
    const typeClasses = {
        success: 'bg-green-700 border-green-500',
        error: 'bg-red-700 border-red-500',
        info: 'bg-blue-700 border-blue-500',
        warning: 'bg-yellow-700 border-yellow-500',
        critical: 'bg-purple-800 border-purple-500'
    };
    
    const iconMap = {
        success: <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
        error: <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
        info: <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
        warning: <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.938 5.002c-.77-1.333-2.688-1.333-3.458 0L3.308 18.002c-.77 1.333.192 3 1.732 3z" /></svg>,
        critical: <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.938 5.002c-.77-1.333-2.688-1.333-3.458 0L3.308 18.002c-.77 1.333.192 3 1.732 3z" /></svg>
    };

    useEffect(() => {
        let timer: ReturnType<typeof setTimeout>;
        if (isVisible) {
            const duration = type === 'critical' ? 15000 : 7000;
            timer = setTimeout(() => { onClose(); }, duration);
        }
        return () => clearTimeout(timer);
    }, [isVisible, onClose, type]);

    if (!isVisible) return null;
    return (
        <div className={`fixed bottom-8 right-8 p-5 rounded-xl shadow-2xl text-white flex items-start space-x-4 transition-all duration-500 ease-out transform border-l-8 ${typeClasses[type]} ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'}`} style={{zIndex: 1000, minWidth: '300px'}}>
            <div className="flex-shrink-0 mt-1">
                {iconMap[type]}
            </div>
            <div className="flex-grow">
                <span className="text-sm font-bold block capitalize">{type} Alert</span>
                <span className="text-base font-medium">{message}</span>
            </div>
            <button onClick={onClose} className="p-1 rounded-full hover:bg-black/20 focus:outline-none flex-shrink-0 mt-0.5 transition-colors">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
        </div>
    );
};

// --- AI Insight Display Component ---
const AISecurityInsightCard: React.FC<{ insight: AISecurityInsight }> = ({ insight }) => {
    const severityClasses = {
        Critical: 'border-red-600 bg-red-900/20 text-red-300',
        High: 'border-orange-600 bg-orange-900/20 text-orange-300',
        Medium: 'border-yellow-600 bg-yellow-900/20 text-yellow-300',
        Low: 'border-green-600 bg-green-900/20 text-green-300',
    };

    return (
        <div className={`p-4 rounded-xl border-l-4 shadow-lg transition-all duration-300 hover:shadow-xl ${severityClasses[insight.severity]}`}>
            <div className="flex justify-between items-start mb-2">
                <h4 className="font-extrabold text-lg">{insight.summary}</h4>
                <span className={`text-xs font-semibold px-2 py-1 rounded-full ${severityClasses[insight.severity].replace('border-', 'bg-').replace('/20', '/40')}`}>{insight.severity}</span>
            </div>
            <p className="text-sm text-gray-300 mb-3">{insight.recommendation}</p>
            <div className="text-xs text-gray-400 flex justify-between border-t border-current pt-2 mt-2">
                <span>Engine: {insight.sourceModel}</span>
                <span>Detected: {new Date(insight.timestamp).toLocaleString()}</span>
            </div>
        </div>
    );
};

// --- Main Component ---

const SecurityView: React.FC = () => {
    const context = useContext(DataContext);
    const { 
        linkedAccounts, unlinkAccount, handlePlaidSuccess, 
        securityMetrics, auditLogs, threatAlerts, 
        dataSharingPolicies, apiKeys, trustedContacts, 
        securityAwarenessModules, showSystemAlert,
        transactionRules 
    } = context || {};

    const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' | 'info' | 'warning' | 'critical'; isVisible: boolean } | null>(null);
    const [loginActivity, setLoginActivity] = useState<LoginActivity[]>([]);
    const [devices, setDevices] = useState<Device[]>([]);
    const [aiInsights, setAiInsights] = useState<AISecurityInsight[]>([]);
    const [activeTab, setActiveTab] = useState<'overview' | 'policies' | 'keys' | 'ai_analysis'>('overview');
    const [securityScore, setSecurityScore] = useState<number>(75); // Initial mock score

    // --- Mock Data Initialization & AI Simulation ---
    useEffect(() => {
        const now = new Date();
        const pastDate = (days: number) => new Date(now.getTime() - days * 24 * 60 * 60 * 1000).toISOString();

        // Mock Login Activity
        setLoginActivity([
            { id: '1', device: 'Quantum Workstation', browser: 'Chrome 125 (Secure)', os: 'Linux Kernel 6.8', location: 'HQ Server Room', ip: '10.0.0.5', timestamp: pastDate(0.01), isCurrent: true, userAgent: 'EnterpriseAgent/1.0' },
            { id: '2', device: 'Personal Mobile', browser: 'Safari', os: 'iOS 18.0 Beta', location: 'Remote Office', ip: '203.0.113.45', timestamp: pastDate(1.5), isCurrent: false, userAgent: 'MobileSafari/605.1.15' },
            { id: '3', device: 'Legacy VM', browser: 'IE 11', os: 'Windows Server 2012', location: 'Decommissioned Zone', ip: '192.168.1.100', timestamp: pastDate(15), isCurrent: false, userAgent: 'MSIE 11.0;' },
        ]);

        // Mock Devices
        setDevices([
            { id: 'dvc_1', name: 'Primary Workstation', type: 'Desktop', model: 'Custom Build X9', lastActivity: pastDate(0.01), location: 'HQ Server Room', ip: '10.0.0.5', isCurrent: true, permissions: ['read_all', 'write_transactions', 'admin_config'], status: 'active', firstSeen: pastDate(500), userAgent: 'EnterpriseAgent/1.0', pushNotificationsEnabled: true, biometricAuthEnabled: true, encryptionStatus: 'AES-256-GCM' },
            { id: 'dvc_2', name: 'Executive Tablet', type: 'Tablet', model: 'Pad Pro 14', lastActivity: pastDate(0.5), location: 'Remote Office', ip: '203.0.113.45', isCurrent: false, permissions: ['read_reports'], status: 'active', firstSeen: pastDate(120), userAgent: 'MobileSafari/605.1.15', pushNotificationsEnabled: false, biometricAuthEnabled: true, encryptionStatus: 'full' },
        ]);

        // Mock AI Insights based on potential issues
        setAiInsights([
            { 
                id: 'ai_001', 
                timestamp: pastDate(0.1), 
                severity: 'High', 
                summary: 'Unusual Data Access Pattern Detected', 
                recommendation: 'Review recent read operations from Device ID dvc_2 between 02:00 and 04:00 UTC. Initiate temporary read-only lock.', 
                sourceModel: 'BehavioralAnomaly_v3' 
            },
            { 
                id: 'ai_002', 
                timestamp: pastDate(1), 
                severity: 'Medium', 
                summary: 'Outdated OS Detected on Active Device', 
                recommendation: 'Update OS on "Legacy VM" (IP 192.168.1.100) to a supported version or isolate it to a sandbox network segment.', 
                sourceModel: 'VulnerabilityScanner_v1' 
            },
        ]);

        // Simulate loading security metrics if available
        if (securityMetrics && securityMetrics.length > 0) {
            const scoreMetric = securityMetrics.find(m => m.metricName === 'OverallSecurityScore');
            if (scoreMetric) {
                setSecurityScore(Math.round(parseFloat(scoreMetric.currentValue) * 100));
            }
        }

    }, [securityMetrics]);

    // --- Handlers ---
    const showNotification = useCallback((message: string, type: 'success' | 'error' | 'info' | 'warning' | 'critical') => {
        setNotification({ message, type, isVisible: true });
    }, []);

    const closeNotification = useCallback(() => {
        setNotification(prev => prev ? { ...prev, isVisible: false } : null);
    }, []);

    const handleUnlink = (id: string) => {
        if (unlinkAccount) {
            unlinkAccount(id);
            showNotification(`Financial Source ID ${id} successfully revoked access.`, 'success');
        }
    };

    const handlePolicyToggle = (policy: DataSharingPolicy, enabled: boolean) => {
        // In a real app, this would call an API to update the policy state
        console.log(`Policy ${policy.policyId} toggled to ${enabled}`);
        showNotification(`Data Sharing Policy "${policy.policyName}" updated to ${enabled ? 'Active' : 'Inactive'}.`, 'info');
    };

    const handleAPIKeyRevoke = (keyId: string) => {
        // In a real app, this would call an API to revoke the key
        showNotification(`API Key ${keyId.substring(0, 8)}... has been immediately revoked and invalidated.`, 'critical');
    };

    // --- Render Helpers ---

    const renderLinkedAccounts = useMemo(() => (
        <Card title="Financial Data Sources (Plaid Integration)" className="lg:col-span-2">
            <div className="space-y-4">
                <p className="text-gray-400 text-sm border-b border-gray-800 pb-3">Securely manage connections to external financial institutions via encrypted tokenization. Last sync: {new Date().toLocaleTimeString()}</p>
                {linkedAccounts && linkedAccounts.length > 0 ? (
                    <div className="space-y-3">
                        {linkedAccounts.map(account => (
                            <div key={account.id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 bg-gray-800/70 rounded-lg border border-cyan-700/50 shadow-md">
                                <div className="flex items-center mb-2 sm:mb-0">
                                    <div className="w-12 h-12 rounded-xl bg-cyan-900/70 flex items-center justify-center text-cyan-300 mr-4 flex-shrink-0">
                                        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" /></svg>
                                    </div>
                                    <div>
                                        <p className="font-bold text-lg text-white">{account.name}</p>
                                        <p className="text-sm text-gray-400">Institution ID: {account.institutionId} | Mask: {account.mask}</p>
                                    </div>
                                </div>
                                <div className="flex space-x-2 mt-2 sm:mt-0">
                                    <button 
                                        onClick={() => showNotification(`Initiating re-authentication for ${account.name}...`, 'info')}
                                        className="px-3 py-1.5 bg-indigo-900/30 hover:bg-indigo-900/50 text-indigo-300 rounded-lg text-sm transition-colors border border-indigo-700"
                                    >
                                        Re-sync
                                    </button>
                                    <button 
                                        onClick={() => handleUnlink(account.id)}
                                        className="px-3 py-1.5 bg-red-900/50 hover:bg-red-900/70 text-red-300 rounded-lg text-sm transition-colors border border-red-700"
                                    >
                                        Revoke Access
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="p-6 bg-gray-800/50 rounded-lg text-center border border-dashed border-gray-700">
                        <p className="text-gray-500 italic mb-3">No external financial data sources are currently integrated.</p>
                        {handlePlaidSuccess && <PlaidLinkButton onSuccess={handlePlaidSuccess} label="Connect New Financial Source" className="w-full sm:w-auto" />}
                    </div>
                )}
            </div>
        </Card>
    ), [linkedAccounts, handlePlaidSuccess, handleUnlink, showNotification]);

    const renderSecuritySettings = useMemo(() => (
        <Card title="Core Authentication & Access Controls" className="lg:col-span-1">
            <ul className="divide-y divide-gray-700/50">
                <SecuritySettingToggle 
                    id="2fa_quantum"
                    title="Quantum 2FA (Hardware Key Required)" 
                    description="Mandatory FIDO2/WebAuthn hardware key enforcement for all administrative roles. Software TOTP is deprecated." 
                    defaultChecked={true} 
                    aiImpact='High'
                />
                <SecuritySettingToggle 
                    id="biometric_device"
                    title="Device Biometric Trust" 
                    description="Enforce device-level biometric verification for any transaction exceeding $10,000 or configuration change." 
                    defaultChecked={true} 
                    aiImpact='Medium'
                />
                <SecuritySettingToggle 
                    id="session_timeout"
                    title="Zero-Trust Session Invalidation" 
                    description="Sessions automatically terminate after 15 minutes of inactivity, requiring re-authentication via context-aware challenge." 
                    defaultChecked={true} 
                    aiImpact='High'
                />
                <li className="py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-gray-800/70">
                     <div className="flex-grow">
                        <span className="font-bold text-lg text-white flex items-center">Master Credential Management</span>
                        <p className="text-sm text-gray-400">Last rotation: 2024-01-15. Next mandatory rotation: 2025-01-15.</p>
                     </div>
                     <button className="px-6 py-2 bg-indigo-700 hover:bg-indigo-600 text-white font-semibold rounded-lg text-sm transition-colors shadow-lg mt-2 sm:mt-0">
                        Initiate Credential Rotation Protocol
                     </button>
                </li>
            </ul>
        </Card>
    ), []);

    const renderRecentActivity = useMemo(() => (
        <Card title="Real-Time Login Telemetry" className="lg:col-span-1">
            <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                {loginActivity.map(activity => (
                    <div key={activity.id} className="flex items-start justify-between p-3 bg-gray-800/50 rounded-lg border-l-4 border-gray-700 hover:bg-gray-700/50 transition-colors">
                        <div className="flex-grow min-w-0">
                            <p className="font-bold text-white truncate flex items-center gap-2">
                                {activity.device}
                                {activity.isCurrent && <span className="px-2 py-0.5 bg-green-600/50 text-green-200 text-xs rounded-full font-medium flex-shrink-0">LIVE SESSION</span>}
                            </p>
                            <p className="text-xs text-gray-400 mt-1">
                                <span className="font-mono bg-gray-700/50 px-1 rounded mr-1">{activity.ip}</span> 
                                @ {activity.location} ({activity.os})
                            </p>
                        </div>
                        <span className="text-xs text-gray-500 ml-2 flex-shrink-0">{new Date(activity.timestamp).toLocaleTimeString()}</span>
                    </div>
                ))}
            </div>
        </Card>
    ), [loginActivity]);

    const renderActiveDevices = useMemo(() => (
        <Card title="Managed Endpoints Inventory" className="lg:col-span-2">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {devices.map(device => (
                    <div key={device.id} className="p-4 bg-gray-800/50 rounded-lg border border-indigo-700/50 flex flex-col shadow-lg">
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-indigo-900/70 rounded-lg flex items-center justify-center text-indigo-300 flex-shrink-0">
                                    {device.type === 'Mobile' ? (
                                         <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
                                    ) : (
                                         <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                                    )}
                                </div>
                                <p className="font-bold text-white truncate">{device.name}</p>
                            </div>
                            <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${device.status === 'active' ? 'bg-green-600/30 text-green-300' : 'bg-red-600/30 text-red-300'}`}>
                                {device.status.toUpperCase()}
                            </span>
                        </div>
                        <p className="text-xs text-gray-400 mb-2">Model: {device.model} ({device.type})</p>
                        <p className="text-xs text-gray-500 truncate">IP: {device.ip} | Last Seen: {new Date(device.lastActivity).toLocaleTimeString()}</p>
                        <div className="mt-3 pt-2 border-t border-gray-700">
                            <p className="text-xs font-semibold text-cyan-400">Permissions Granted: {device.permissions.length}</p>
                            <div className="flex flex-wrap gap-1 mt-1">
                                {device.permissions.slice(0, 3).map(p => (
                                    <span key={p} className="text-[10px] bg-gray-700 text-gray-300 px-1 rounded">{p}</span>
                                ))}
                                {device.permissions.length > 3 && <span className="text-[10px] text-gray-500">+{device.permissions.length - 3} more</span>}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </Card>
    ), [devices]);

    const renderDataPolicies = useMemo(() => (
        <Card title="Data Governance & Sharing Policies" className="lg:col-span-2">
            <p className="text-sm text-gray-400 mb-4">Define granular controls over how internal and external data sets are processed, stored, and shared. Managed by AI Policy Engine.</p>
            <div className="space-y-4">
                {(dataSharingPolicies || []).map(policy => (
                    <div key={policy.policyId} className="p-4 bg-gray-800/70 rounded-lg border border-purple-700/50 flex flex-col md:flex-row justify-between items-start md:items-center">
                        <div className="flex-grow mb-2 md:mb-0">
                            <p className="font-bold text-white text-lg">{policy.policyName}</p>
                            <p className="text-xs text-gray-400 mt-1">Scope: {policy.scope} | Last Reviewed: {policy.lastReviewed}</p>
                        </div>
                        <div className="flex items-center space-x-4">
                            <span className={`text-sm font-semibold ${policy.isActive ? 'text-green-400' : 'text-red-400'}`}>
                                {policy.isActive ? 'ACTIVE' : 'DRAFT'}
                            </span>
                            <SecuritySettingToggle
                                id={`policy-${policy.policyId}`}
                                title="Enable Policy"
                                description={`Toggle activation for ${policy.policyName}`}
                                defaultChecked={policy.isActive}
                                onToggle={(checked) => handlePolicyToggle(policy, checked)}
                                aiImpact='Medium'
                            />
                        </div>
                    </div>
                ))}
            </div>
        </Card>
    ), [dataSharingPolicies, handlePolicyToggle]);

    const renderAPIKeys = useMemo(() => (
        <Card title="System API Key Management" className="lg:col-span-2">
            <p className="text-sm text-gray-400 mb-4">Manage programmatic access tokens. Keys are automatically rotated by the Quantum Key Vault every 90 days.</p>
            <div className="space-y-3">
                {(apiKeys || []).map(key => (
                    <div key={key.id} className="flex justify-between items-center p-3 bg-gray-800/70 rounded-lg border border-yellow-700/50">
                        <div className="flex items-center min-w-0">
                            <svg className="w-5 h-5 text-yellow-400 mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M6 16h.01" /></svg>
                            <div>
                                <p className="font-mono text-sm text-white truncate">{key.keyName} ({key.id.substring(0, 8)}...)</p>
                                <p className="text-xs text-gray-500">Created: {key.creationDate} | Permissions: {key.scopes.join(', ')}</p>
                            </div>
                        </div>
                        <button 
                            onClick={() => handleAPIKeyRevoke(key.id)}
                            className="px-3 py-1 bg-red-900/30 hover:bg-red-900/50 text-red-300 rounded-md text-xs transition-colors flex-shrink-0 ml-4"
                        >
                            Revoke Now
                        </button>
                    </div>
                ))}
            </div>
        </Card>
    ), [apiKeys, handleAPIKeyRevoke]);

    const renderAIAnalysis = useMemo(() => (
        <div className="space-y-6">
            <Card title={`AI Threat Intelligence Feed (${AI_INSIGHT_ENGINE_VERSION})`}>
                <div className="flex justify-between items-center mb-4 border-b border-gray-800 pb-3">
                    <p className="text-gray-400 text-sm">Real-time behavioral analysis and predictive threat modeling.</p>
                    <span className="text-sm font-bold text-cyan-400">Total Insights: {aiInsights.length}</span>
                </div>
                <div className="space-y-4">
                    {aiInsights.length > 0 ? (
                        aiInsights.map(insight => (
                            <AISecurityInsightCard key={insight.id} insight={insight} />
                        ))
                    ) : (
                        <div className="p-6 bg-gray-800/50 rounded-lg text-center border border-dashed border-gray-700">
                            <p className="text-gray-500 italic">AI Engine reports no immediate high-priority anomalies at this time.</p>
                        </div>
                    )}
                </div>
            </Card>

            <Card title="Security Awareness Training Modules">
                <p className="text-sm text-gray-400 mb-4">Track mandatory compliance training completion status across the organization.</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {(securityAwarenessModules || []).map(module => (
                        <div key={module.moduleId} className="p-4 bg-gray-800/70 rounded-lg border border-green-700/50">
                            <p className="font-bold text-white">{module.title}</p>
                            <p className="text-xs text-gray-400 mt-1">Status: {module.completionRate}% Complete</p>
                            <div className="w-full bg-gray-700 rounded-full h-2.5 mt-2">
                                <div className="bg-green-500 h-2.5 rounded-full" style={{ width: `${module.completionRate}%` }}></div>
                            </div>
                        </div>
                    ))}
                </div>
            </Card>
        </div>
    ), [aiInsights, securityAwarenessModules]);

    const renderAuditLogs = useMemo(() => {
        const displayLogs = (auditLogs || []).slice(0, MAX_AUDIT_LOG_DISPLAY);
        return (
            <Card title={`System Audit Trail (Last ${displayLogs.length} Entries)`} className="lg:col-span-2">
                <p className="text-sm text-gray-400 mb-3">Immutable record of all configuration changes, data access events, and administrative actions.</p>
                <div className="overflow-x-auto max-h-[500px] custom-scrollbar">
                    <table className="min-w-full divide-y divide-gray-700">
                        <thead className="sticky top-0 bg-gray-800 z-10">
                            <tr>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Time</th>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">User/System</th>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Action</th>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Target</th>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-800">
                            {displayLogs.map((log: AuditLogEntry) => (
                                <tr key={log.id} className="hover:bg-gray-800/50 transition-colors">
                                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">{new Date(log.timestamp).toLocaleTimeString()}</td>
                                    <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-white">{log.userId.includes('sys_') ? 'SYSTEM' : log.userId}</td>
                                    <td className="px-4 py-2 text-sm text-cyan-400">{log.action}</td>
                                    <td className="px-4 py-2 text-sm text-gray-400">{log.targetResource}</td>
                                    <td className="px-4 py-2 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${log.success ? 'bg-green-900/50 text-green-300' : 'bg-red-900/50 text-red-300'}`}>
                                            {log.success ? 'SUCCESS' : 'FAILURE'}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {displayLogs.length < (auditLogs?.length || 0) && (
                    <p className="text-center text-sm text-gray-500 mt-3">Displaying first {MAX_AUDIT_LOG_DISPLAY} logs. Load full history via dedicated Audit Console.</p>
                )}
            </Card>
        );
    }, [auditLogs]);

    const renderSecurityScoreGauge = useMemo(() => {
        const radius = 50;
        const circumference = 2 * Math.PI * radius;
        const offset = circumference - (securityScore / 100) * circumference;
        const color = securityScore >= 90 ? 'stroke-green-500' : securityScore >= 70 ? 'stroke-yellow-500' : 'stroke-red-500';

        return (
            <div className="flex flex-col items-center p-6 bg-gray-800/70 rounded-xl shadow-inner border border-gray-700">
                <h3 className="text-xl font-bold text-white mb-3">Quantum Security Index (QSI)</h3>
                <svg width="120" height="120" viewBox="0 0 120 120" className="transform -rotate-90">
                    {/* Background Circle */}
                    <circle
                        cx="60"
                        cy="60"
                        r={radius}
                        fill="transparent"
                        stroke="#374151"
                        strokeWidth="10"
                    />
                    {/* Progress Arc */}
                    <circle
                        cx="60"
                        cy="60"
                        r={radius}
                        fill="transparent"
                        stroke={color.replace('stroke-', '')}
                        strokeWidth="10"
                        strokeDasharray={circumference}
                        strokeDashoffset={offset}
                        strokeLinecap="round"
                        className="transition-all duration-1000 ease-out"
                    />
                    {/* Text */}
                    <text
                        x="60"
                        y="60"
                        dominantBaseline="middle"
                        textAnchor="middle"
                        className="fill-current text-white"
                        fontSize="20"
                        fontWeight="bold"
                    >
                        {securityScore}%
                    </text>
                </svg>
                <p className="text-sm text-gray-400 mt-2">Target: 95%</p>
            </div>
        );
    }, [securityScore]);

    const renderTrustedContacts = useMemo(() => (
        <Card title="Emergency Trusted Contacts" className="lg:col-span-1">
            <p className="text-sm text-gray-400 mb-4">Contacts authorized for emergency account recovery or high-risk alerts.</p>
            <div className="space-y-3">
                {(trustedContacts || []).map((contact: TrustedContact) => (
                    <div key={contact.id} className="flex justify-between items-center p-3 bg-gray-800/50 rounded-lg border border-gray-700">
                        <div className="flex items-center">
                            <div className="w-8 h-8 bg-pink-900/50 rounded-full flex items-center justify-center text-pink-300 mr-3">
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                            </div>
                            <div>
                                <p className="font-semibold text-white">{contact.name}</p>
                                <p className="text-xs text-gray-400">{contact.relationship}</p>
                            </div>
                        </div>
                        <span className={`text-xs font-medium px-2 py-0.5 rounded ${contact.verified ? 'bg-green-900/30 text-green-400' : 'bg-red-900/30 text-red-400'}`}>
                            {contact.verified ? 'Verified' : 'Pending'}
                        </span>
                    </div>
                ))}
            </div>
        </Card>
    ), [trustedContacts]);


    // --- Tab Content Rendering ---
    const renderContent = () => {
        switch (activeTab) {
            case 'overview':
                return (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {renderSecurityScoreGauge}
                        {renderRecentActivity}
                        {renderActiveDevices}
                        {renderLinkedAccounts}
                        {renderSecuritySettings}
                    </div>
                );
            case 'policies':
                return (
                    <div className="grid grid-cols-1 gap-6">
                        {renderDataPolicies}
                        <Card title="Transaction Rule Engine" className="lg:col-span-2">
                            <p className="text-sm text-gray-400 mb-4">Define automated responses to financial events based on predefined risk thresholds.</p>
                            <div className="space-y-3">
                                {(transactionRules || []).map((rule: TransactionRule) => (
                                    <div key={rule.ruleId} className="p-3 bg-gray-800/70 rounded-lg border border-cyan-700/50 flex justify-between items-center">
                                        <div>
                                            <p className="font-bold text-white">{rule.name}</p>
                                            <p className="text-xs text-gray-400">Trigger: {rule.triggerCondition} | Action: {rule.action}</p>
                                        </div>
                                        <span className={`text-xs font-medium px-2 py-0.5 rounded ${rule.isEnabled ? 'bg-green-900/30 text-green-400' : 'bg-red-900/30 text-red-400'}`}>
                                            {rule.isEnabled ? 'ACTIVE' : 'DISABLED'}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    </div>
                );
            case 'keys':
                return (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {renderAPIKeys}
                        {renderTrustedContacts}
                        <Card title="Threat Alert History" className="lg:col-span-3">
                            <p className="text-sm text-gray-400 mb-4">Historical record of confirmed security incidents.</p>
                            <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                                {(threatAlerts || []).map((alert: ThreatAlert) => (
                                    <div key={alert.alertId} className="p-3 bg-red-900/30 rounded-lg border border-red-600 flex justify-between items-center">
                                        <div>
                                            <p className="font-bold text-red-300">{alert.title}</p>
                                            <p className="text-xs text-gray-300">{alert.description}</p>
                                        </div>
                                        <span className="text-xs text-gray-300">{new Date(alert.timestamp).toLocaleDateString()}</span>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    </div>
                );
            case 'ai_analysis':
                return (
                    <div className="grid grid-cols-1 gap-6">
                        {renderAIAnalysis}
                        {renderAuditLogs}
                    </div>
                );
            default:
                return null;
        }
    };

    // --- Tab Navigation ---
    const tabs: { id: typeof activeTab, label: string }[] = [
        { id: 'overview', label: 'Overview & Access' },
        { id: 'policies', label: 'Governance & Rules' },
        { id: 'keys', label: 'API & Contacts' },
        { id: 'ai_analysis', label: 'AI Threat Analysis' },
    ];

    return (
        <div className="space-y-8 p-4 sm:p-8">
            <header className="pb-4 border-b border-gray-700">
                <h1 className="text-4xl font-extrabold text-white tracking-tighter">Enterprise Security Command Center</h1>
                <p className="text-lg text-gray-400 mt-1">Centralized control plane for data integrity, access management, and threat mitigation. Engine Version: {AI_INSIGHT_ENGINE_VERSION}</p>
            </header>

            {/* Tab Navigation */}
            <div className="flex border-b border-gray-700 overflow-x-auto">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`px-6 py-3 text-lg font-semibold transition-all duration-300 whitespace-nowrap
                            ${activeTab === tab.id 
                                ? 'text-cyan-400 border-b-4 border-cyan-500' 
                                : 'text-gray-400 hover:text-white hover:border-b-4 hover:border-gray-600'
                            }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            <main>
                {renderContent()}
            </main>

            {notification && (
                <NotificationToast 
                    message={notification.message} 
                    type={notification.type} 
                    isVisible={notification.isVisible} 
                    onClose={closeNotification} 
                />
            )}
        </div>
    );
};

export default SecurityView;
