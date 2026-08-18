// REPOSITORY SOURCE: diplomat-bit/Citibank_Demo_Business_Inc_Demonstration- | PATH: diplomat-bit-Citibank_Demo_Business_Inc_Demonstration--ab2501d/components/dashboard/widgets/RecentAlertsWidget.tsx
================================================================================

import React, { useState, useEffect, useCallback, useMemo } from 'react';

// -----------------------------------------------------------------------------
// Types & Interfaces
// -----------------------------------------------------------------------------

type AlertSeverity = 'CRITICAL' | 'WARNING' | 'INFO' | 'SUCCESS';
type AlertCategory = 'SECURITY' | 'FINANCE' | 'SYSTEM' | 'AI_GOVERNANCE';

interface Alert {
    id: string;
    severity: AlertSeverity;
    category: AlertCategory;
    title: string;
    message: string;
    timestamp: Date;
    isRead: boolean;
    source: string;
    actionRequired: boolean;
    aiAnalysis?: string | null;
}

interface AlertFilter {
    severity?: AlertSeverity;
    category?: AlertCategory;
    showRead?: boolean;
}

// -----------------------------------------------------------------------------
// Icons (SVG)
// -----------------------------------------------------------------------------

const Icons = {
    ShieldAlert: () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-500">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
        </svg>
    ),
    WarningTriangle: () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-yellow-500">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
            <line x1="12" y1="9" x2="12" y2="13"></line>
            <line x1="12" y1="17" x2="12.01" y2="17"></line>
        </svg>
    ),
    InfoCircle: () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-500">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="16" x2="12" y2="12"></line>
            <line x1="12" y1="8" x2="12.01" y2="8"></line>
        </svg>
    ),
    CheckCircle: () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-500">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
        </svg>
    ),
    BrainCircuit: () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 4.5a2.5 2.5 0 0 0-4.96-.46 2.5 2.5 0 0 0-1.98 3 2.5 2.5 0 0 0-1.32 4.24 3 3 0 0 0 .34 5.58 2.5 2.5 0 0 0 2.96 3.08 2.5 2.5 0 0 0 4.91.05L12 20V4.5Z" />
            <path d="M16 8a2.5 2.5 0 0 1 4.96.46 2.5 2.5 0 0 1 1.98 3 2.5 2.5 0 0 1 1.32 4.24 3 3 0 0 1-.34 5.58 2.5 2.5 0 0 1-2.96 3.08 2.5 2.5 0 0 1-4.91.05L16 20V8Z" />
            <line x1="12" y1="12" x2="16" y2="12" />
        </svg>
    ),
    X: () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
    ),
    RefreshCw: () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M23 4v6h-6"></path>
            <path d="M1 20v-6h6"></path>
            <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
        </svg>
    )
};

// -----------------------------------------------------------------------------
// Mock Data Service
// -----------------------------------------------------------------------------

const generateId = () => Math.random().toString(36).substr(2, 9);

const MOCK_ALERTS: Alert[] = [
    {
        id: generateId(),
        severity: 'CRITICAL',
        category: 'SECURITY',
        title: 'Unauthorized Access Attempt',
        message: 'Multiple failed login attempts detected from IP 192.168.1.105 via API Gateway.',
        timestamp: new Date(Date.now() - 1000 * 60 * 5), // 5 mins ago
        isRead: false,
        source: 'Security Policy Definitions',
        actionRequired: true,
    },
    {
        id: generateId(),
        severity: 'WARNING',
        category: 'FINANCE',
        title: 'Projected Budget Variance',
        message: 'Q4 marketing spend is projected to exceed allocated budget by 12% based on current run rate.',
        timestamp: new Date(Date.now() - 1000 * 60 * 45), // 45 mins ago
        isRead: false,
        source: 'Multiverse Financial Projection',
        actionRequired: true,
    },
    {
        id: generateId(),
        severity: 'INFO',
        category: 'AI_GOVERNANCE',
        title: 'Model Retraining Complete',
        message: 'The Gemini OpenAI Proxy API model has successfully completed its weekly fine-tuning cycle.',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
        isRead: true,
        source: 'AI Task Manager Service',
        actionRequired: false,
    },
    {
        id: generateId(),
        severity: 'CRITICAL',
        category: 'SYSTEM',
        title: 'Quantum Authentication Drift',
        message: 'Biometric quantum authentication coherence dropped below 98%. Recalibration recommended.',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5), // 5 hours ago
        isRead: false,
        source: 'Biometric Quantum Authentication',
        actionRequired: true,
    },
    {
        id: generateId(),
        severity: 'SUCCESS',
        category: 'FINANCE',
        title: 'Dividend Distribution Executed',
        message: 'Automated dividend distribution for Q3 processed successfully for 45,000 shareholders.',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
        isRead: true,
        source: 'Hyper-Personalized Economic Governance',
        actionRequired: false,
    }
];

const AI_ANALYSIS_RESPONSES = [
    "Analysis indicates a potential brute-force attack vector. The originating IP corresponds to a known botnet. Recommendation: Immediate IP ban and trigger 2FA for all administrative accounts.",
    "Financial projection models detect an anomaly in ad-spend efficiency. The variance is driven by a 15% increase in CPC. Recommendation: Pause low-performing ad sets via the Marketing Automation View.",
    "System diagnostics show quantum decoherence is within acceptable margins but trending downward. This is likely due to high computational load in the Multiverse Nexus View. Recommendation: Schedule maintenance window.",
    "The biometric hash mismatch suggests a possible spoofing attempt using generative adversarial networks. Security protocols have automatically escalated to Level 4."
];

// -----------------------------------------------------------------------------
// Component Implementation
// -----------------------------------------------------------------------------

const RecentAlertsWidget: React.FC = () => {
    const [alerts, setAlerts] = useState<Alert[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [analyzingId, setAnalyzingId] = useState<string | null>(null);
    const [filter, setFilter] = useState<AlertSeverity | 'ALL'>('ALL');
    const [expandedAlertId, setExpandedAlertId] = useState<string | null>(null);

    // Initial Data Load
    useEffect(() => {
        const timer = setTimeout(() => {
            setAlerts(MOCK_ALERTS);
            setLoading(false);
        }, 800); // Simulate network latency

        return () => clearTimeout(timer);
    }, []);

    // Real-time Alert Simulation
    useEffect(() => {
        const interval = setInterval(() => {
            if (Math.random() > 0.7) { // 30% chance to add a new alert every interval
                const newAlert: Alert = {
                    id: generateId(),
                    severity: Math.random() > 0.8 ? 'CRITICAL' : 'INFO',
                    category: Math.random() > 0.5 ? 'SYSTEM' : 'AI_GOVERNANCE',
                    title: 'New System Event Detected',
                    message: `Real-time event detected at ${new Date().toLocaleTimeString()}. automated diagnostics running.`,
                    timestamp: new Date(),
                    isRead: false,
                    source: 'Global Event Bus',
                    actionRequired: false
                };
                setAlerts(prev => [newAlert, ...prev].slice(0, 50)); // Keep last 50
            }
        }, 15000); // Check every 15 seconds

        return () => clearInterval(interval);
    }, []);

    const handleDismiss = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        setAlerts(prev => prev.filter(alert => alert.id !== id));
    };

    const handleMarkRead = (id: string, e?: React.MouseEvent) => {
        if (e) e.stopPropagation();
        setAlerts(prev => prev.map(a => a.id === id ? { ...a, isRead: true } : a));
    };

    const handleAnalyze = async (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (analyzingId) return; // Prevent multiple concurrent analyses

        const alertToAnalyze = alerts.find(a => a.id === id);
        if (!alertToAnalyze || alertToAnalyze.aiAnalysis) return;

        setAnalyzingId(id);
        
        // Simulate API call to AI Service
        await new Promise(resolve => setTimeout(resolve, 2000));

        const randomAnalysis = AI_ANALYSIS_RESPONSES[Math.floor(Math.random() * AI_ANALYSIS_RESPONSES.length)];
        
        setAlerts(prev => prev.map(a => 
            a.id === id 
                ? { ...a, aiAnalysis: randomAnalysis, isRead: true } 
                : a
        ));
        setAnalyzingId(null);
        setExpandedAlertId(id); // Auto expand to show result
    };

    const toggleExpand = (id: string) => {
        if (expandedAlertId === id) {
            setExpandedAlertId(null);
        } else {
            setExpandedAlertId(id);
            handleMarkRead(id);
        }
    };

    const filteredAlerts = useMemo(() => {
        if (filter === 'ALL') return alerts;
        return alerts.filter(a => a.severity === filter);
    }, [alerts, filter]);

    const getSeverityColor = (severity: AlertSeverity) => {
        switch (severity) {
            case 'CRITICAL': return 'bg-red-50 border-red-200 text-red-900';
            case 'WARNING': return 'bg-yellow-50 border-yellow-200 text-yellow-900';
            case 'INFO': return 'bg-blue-50 border-blue-200 text-blue-900';
            case 'SUCCESS': return 'bg-green-50 border-green-200 text-green-900';
            default: return 'bg-gray-50 border-gray-200 text-gray-900';
        }
    };

    const getSeverityIcon = (severity: AlertSeverity) => {
        switch (severity) {
            case 'CRITICAL': return <Icons.ShieldAlert />;
            case 'WARNING': return <Icons.WarningTriangle />;
            case 'INFO': return <Icons.InfoCircle />;
            case 'SUCCESS': return <Icons.CheckCircle />;
        }
    };

    return (
        <div className="flex flex-col h-full bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden font-sans">
            {/* Header */}
            <div className="px-5 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                <div>
                    <h3 className="text-lg font-semibold text-gray-800">System Alerts</h3>
                    <p className="text-xs text-gray-500 mt-0.5">Real-time monitoring of critical infrastructure</p>
                </div>
                <div className="flex space-x-1 bg-gray-200/50 p-1 rounded-lg">
                    {(['ALL', 'CRITICAL', 'WARNING'] as const).map((f) => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-3 py-1 text-xs font-medium rounded-md transition-all duration-200 ${
                                filter === f 
                                    ? 'bg-white text-gray-800 shadow-sm' 
                                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200/50'
                            }`}
                        >
                            {f.charAt(0) + f.slice(1).toLowerCase()}
                        </button>
                    ))}
                </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto p-2 space-y-2 min-h-[400px]">
                {loading ? (
                    <div className="flex flex-col items-center justify-center h-full text-gray-400 space-y-3">
                        <Icons.RefreshCw />
                        <span className="text-sm animate-pulse">Establishing secure connection...</span>
                    </div>
                ) : filteredAlerts.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-gray-400 space-y-2">
                        <Icons.CheckCircle />
                        <span className="text-sm">All systems nominal. No active alerts.</span>
                    </div>
                ) : (
                    filteredAlerts.map((alert) => (
                        <div 
                            key={alert.id}
                            className={`group relative flex flex-col border rounded-lg transition-all duration-200 hover:shadow-md cursor-pointer ${
                                getSeverityColor(alert.severity)
                            } ${!alert.isRead ? 'border-l-4' : 'opacity-90'}`}
                            onClick={() => toggleExpand(alert.id)}
                            style={{ borderLeftWidth: !alert.isRead ? '4px' : '1px' }}
                        >
                            <div className="p-4 flex items-start space-x-3">
                                <div className="mt-0.5 flex-shrink-0">
                                    {getSeverityIcon(alert.severity)}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-start">
                                        <h4 className="text-sm font-semibold truncate pr-8">
                                            {alert.title}
                                            {!alert.isRead && (
                                                <span className="ml-2 inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800">
                                                    NEW
                                                </span>
                                            )}
                                        </h4>
                                        <span className="text-[10px] text-gray-500 whitespace-nowrap">
                                            {alert.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </div>
                                    <p className="text-sm opacity-90 mt-1 line-clamp-2 leading-relaxed">
                                        {alert.message}
                                    </p>
                                    
                                    <div className="mt-2 flex items-center space-x-3 text-xs opacity-75">
                                        <span className="uppercase tracking-wider font-bold text-[10px]">{alert.category}</span>
                                        <span>•</span>
                                        <span>{alert.source}</span>
                                    </div>
                                </div>

                                {/* Hover Actions */}
                                <button
                                    onClick={(e) => handleDismiss(alert.id, e)}
                                    className="absolute top-2 right-2 p-1.5 rounded-full hover:bg-black/5 text-gray-400 hover:text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity"
                                    aria-label="Dismiss alert"
                                >
                                    <Icons.X />
                                </button>
                            </div>

                            {/* Expanded Content / AI Analysis */}
                            {expandedAlertId === alert.id && (
                                <div className="px-4 pb-4 pt-0 animate-fadeIn">
                                    <div className="mt-2 border-t border-black/5 pt-3">
                                        {alert.aiAnalysis ? (
                                            <div className="bg-white/50 rounded-md p-3 text-sm border border-white/60">
                                                <div className="flex items-center space-x-2 text-purple-600 mb-1">
                                                    <Icons.BrainCircuit />
                                                    <span className="font-semibold text-xs uppercase tracking-wide">AI Security Insight</span>
                                                </div>
                                                <p className="text-gray-700 leading-relaxed text-xs">{alert.aiAnalysis}</p>
                                            </div>
                                        ) : (
                                            <div className="flex justify-between items-center">
                                                <span className="text-xs text-gray-500 italic">
                                                    {alert.actionRequired ? 'Immediate attention recommended.' : 'Information only.'}
                                                </span>
                                                <button
                                                    onClick={(e) => handleAnalyze(alert.id, e)}
                                                    disabled={analyzingId !== null}
                                                    className="flex items-center space-x-2 bg-white/80 hover:bg-white text-gray-700 hover:text-purple-600 px-3 py-1.5 rounded-md text-xs font-medium border border-gray-200 shadow-sm transition-colors"
                                                >
                                                    {analyzingId === alert.id ? (
                                                        <>
                                                            <Icons.RefreshCw />
                                                            <span>Analyzing...</span>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Icons.BrainCircuit />
                                                            <span>Analyze with Gemini</span>
                                                        </>
                                                    )}
                                                </button>
                                            </div>
                                        )}
                                        
                                        <div className="mt-3 flex justify-end space-x-2">
                                            <button className="text-xs text-gray-600 hover:text-gray-900 px-2 py-1">
                                                View Source Logs
                                            </button>
                                            <button 
                                                className="text-xs bg-gray-900 text-white px-3 py-1 rounded hover:bg-gray-800 transition-colors shadow-sm"
                                                onClick={(e) => { e.stopPropagation(); /* Navigate to details */ }}
                                            >
                                                Take Action
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>
            
            {/* Footer Status Bar */}
            <div className="px-4 py-2 border-t border-gray-100 bg-gray-50 text-[10px] text-gray-500 flex justify-between items-center">
                <div className="flex items-center space-x-2">
                    <span className="inline-block w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                    <span>Live Monitoring Active</span>
                </div>
                <span>Sync: {new Date().toLocaleTimeString()}</span>
            </div>
        </div>
    );
};

export default RecentAlertsWidget;