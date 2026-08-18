// REPOSITORY SOURCE: diplomat-bit/aibanking.dev-demai-jocalll3 | PATH: diplomat-bit-aibanking.dev-demai-jocalll3-f8b6983/components/AIInsights.tsx
================================================================================



import React, { useContext } from 'react';
import Card from './Card';
import type { AIInsight } from '../types';
import { DataContext } from '../context/DataContext';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';


const UrgencyIndicator: React.FC<{ urgency: 'low' | 'medium' | 'high' }> = ({ urgency }) => {
    const urgencyClasses = {
        low: 'bg-blue-500',
        medium: 'bg-yellow-500',
        high: 'bg-red-500',
    };
    return <span className={`absolute top-2 right-2 h-3 w-3 rounded-full ${urgencyClasses[urgency]}`}></span>;
};


const AIInsights: React.FC = () => {
    const context = useContext(DataContext);
    if (!context) throw new Error("AIInsights must be within a DataProvider");
    const { aiInsights, isInsightsLoading } = context;

  return (
    <Card title="AI Advisor Insights" className="h-full" isLoading={isInsightsLoading}>
        <div className="space-y-4">
            {aiInsights.map(insight => (
                <div key={insight.id} className="relative p-4 bg-gray-700/50 rounded-lg border border-gray-600/50 hover:border-cyan-400/50 transition-all duration-200">
                    <UrgencyIndicator urgency={insight.urgency} />
                    <h4 className="font-bold text-gray-100">{insight.title}</h4>
                    <p className="text-sm text-gray-300 mt-1">{insight.description}</p>
                    {insight.chartData && insight.chartData.length > 0 && (
                        <div className="mt-3 h-28 pr-4">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={insight.chartData} layout="vertical" margin={{ top: 5, right: 0, left: 0, bottom: 5 }}>
                                    <XAxis type="number" hide />
                                    <YAxis 
                                        type="category" 
                                        dataKey="name" 
                                        axisLine={false} 
                                        tickLine={false} 
                                        fontSize={11} 
                                        stroke="#9ca3af" 
                                        width={85}
                                        style={{ textTransform: 'capitalize' }}
                                    />
                                    <Tooltip 
                                        cursor={{ fill: 'rgba(100,116,139,0.1)' }}
                                        contentStyle={{
                                            backgroundColor: 'rgba(31, 41, 55, 0.8)',
                                            borderColor: '#4b5563',
                                            fontSize: '12px',
                                        }}
                                        formatter={(value: number) => [`$${value.toFixed(2)}`, 'Spent']}
                                    />
                                    <Bar dataKey="value" fill="#06b6d4" radius={[0, 4, 4, 0]} barSize={12} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    )}
                </div>
            ))}
        </div>
    </Card>
  );
};

export default AIInsights;

================================================================================
// APPENDED FROM REPO: diplomat-bit/aibanking.dev-jocall3-new | ORIGINAL PATH: diplomat-bit-aibanking.dev-jocall3-new-84d7a30/components/AIInsights.tsx
================================================================================


import React, { useContext, useState, useMemo } from 'react';
import Card from './Card';
import type { AIInsight } from '../types';
import { DataContext } from '../context/DataContext';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, Cell, LineChart, Line, CartesianGrid } from 'recharts';

// --- GEIN-Enhanced Component Ecosystem for Hyper-Scale AI-Driven Trading ---

// FIX: EnhancedAIInsight now correctly extends AIInsight by omitting the incompatible 'details' property
export interface EnhancedAIInsight extends Omit<AIInsight, 'details'> {
    confidenceScore: number;
    actionable: boolean;
    actionType?: 'rebalance_portfolio' | 'set_stop_loss' | 'execute_trade' | 'liquidity_provision';
    details?: {
        asset?: string;
        currentAllocation?: number;
        suggestedAllocation?: number;
        currentPrice?: number;
        suggestedStopLoss?: number;
        tradeType?: 'buy' | 'sell';
        quantity?: number;
        targetPool?: string;
    };
    tags: string[];
    // --- GEIN (Generative Edge & Intelligence Nexus) Implementation ---
    geinFactor: number; // Proprietary metric for insight quality and uniqueness.
    correlationId: string; // Links related insights across different models/timeframes.
    sourceModel: string; // The specific AI model that generated the insight.
    timeToLive: number; // Validity period of the insight in seconds.
    riskAnalysis: {
        volatilityIndex: number;
        sharpeRatio: number;
        maxDrawdown: number;
    };
    backtestData: { name: string; value: number }[];
    alternativeActions: {
        actionType: string;
        rationale: string;
        confidence: number;
    }[];
    // Added missing properties
    urgency: 'low' | 'medium' | 'high';
    title: string;
    description: string;
    chartData?: { name: string; value: number }[];
}

// --- Self-Contained SVG Icons for a Richer UI without external dependencies ---

const BoltIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 inline-block" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5.2a1 1 0 01-1.17.986l-3.2-1.1a1 1 0 00-1.26.95l.5 3.5a1 1 0 01-.45.95l-2.7 2.1a1 1 0 00-.55 1.34l3.2 5.9a1 1 0 01.05.52 1 1 0 01-1.6 1.04l-1.4-1.4a1 1 0 00-1.4 1.4l1.4 1.4a3 3 0 004.2 0l9.4-9.4a1 1 0 01-.1-1.5l-5.9-3.2a1 1 0 01-.5-.05l-3.5-.5a1 1 0 00-.95 1.26l1.1 3.2A1 1 0 018.8 11V2a1 1 0 011.3-.954z" clipRule="evenodd" />
    </svg>
);

const CloseIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
);

// --- Enhanced Urgency Indicator with Labels ---

const UrgencyIndicator: React.FC<{ urgency: 'low' | 'medium' | 'high' }> = ({ urgency }) => {
    const urgencyConfig = useMemo(() => ({
        low: { class: 'bg-blue-500', label: 'Low' },
        medium: { class: 'bg-yellow-500', label: 'Medium' },
        high: { class: 'bg-red-500', label: 'High' },
    }), []);
    
    return (
        <div className="absolute top-3 right-3 flex items-center text-xs font-semibold">
            <span className={`h-2.5 w-2.5 rounded-full ${urgencyConfig[urgency].class} mr-2`}></span>
            <span className="text-gray-400">{urgencyConfig[urgency].label} Urgency</span>
        </div>
    );
};

// --- Self-Contained "App-in-App" Action Modal with Multi-Tab Analysis ---

const ActionModal: React.FC<{ insight: EnhancedAIInsight; onClose: () => void }> = ({ insight, onClose }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [activeTab, setActiveTab] = useState<'overview' | 'risk' | 'backtest' | 'alternatives'>('overview');

    const handleExecute = () => {
        setIsLoading(true);
        console.log(`Executing HFT action: ${insight.actionType} for insight ${insight.id} with details:`, insight.details);
        setTimeout(() => {
            setIsLoading(false);
            onClose();
        }, 1500);
    };

    const renderOverview = () => {
        switch (insight.actionType) {
            case 'rebalance_portfolio':
                return (
                    <>
                        <h4 className="text-lg font-semibold text-gray-100 mb-2">Rebalance: {insight.details?.asset}</h4>
                        <p className="text-sm text-gray-400 mb-4">Adjust allocation from {insight.details?.currentAllocation}% to {insight.details?.suggestedAllocation}%. This is a high-conviction trade based on predictive market analytics.</p>
                        <div className="space-y-2">
                            <label htmlFor="allocation" className="block text-sm font-medium text-gray-300">New Allocation (%)</label>
                            <input type="range" id="allocation" min="0" max="100" defaultValue={insight.details?.suggestedAllocation} className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-cyan-500" />
                        </div>
                    </>
                );
            case 'set_stop_loss':
                return (
                    <>
                        <h4 className="text-lg font-semibold text-gray-100 mb-2">Set Stop-Loss: {insight.details?.asset}</h4>
                        <p className="text-sm text-gray-400 mb-4">Current Price: ${insight.details?.currentPrice?.toFixed(2)}. The AI suggests a new stop-loss to mitigate downside risk from volatility spikes.</p>
                        <div className="p-3 bg-red-900/20 border border-red-500/50 rounded text-red-300 text-center text-lg font-bold">
                            Suggested Stop: ${insight.details?.suggestedStopLoss}
                        </div>
                    </>
                );
            case 'execute_trade':
                return (
                    <>
                         <h4 className="text-lg font-semibold text-gray-100 mb-2">Execute Trade: {insight.details?.tradeType?.toUpperCase()} {insight.details?.asset}</h4>
                         <p className="text-sm text-gray-400 mb-4">Quantity: {insight.details?.quantity}. Based on short-term momentum indicators and order book imbalance.</p>
                    </>
                );
            case 'liquidity_provision':
                 return (
                    <>
                         <h4 className="text-lg font-semibold text-gray-100 mb-2">Provide Liquidity: {insight.details?.targetPool}</h4>
                         <p className="text-sm text-gray-400 mb-4">Projected APR is surging. Deploy capital to capture yield farming opportunities.</p>
                    </>
                );
            default:
                return <p className="text-gray-400">Review the insight details before proceeding.</p>;
        }
    };

    const renderRisk = () => (
        <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
                <div className="p-3 bg-gray-800 rounded text-center">
                    <div className="text-xs text-gray-500">Volatility</div>
                    <div className="text-lg font-bold text-yellow-400">{insight.riskAnalysis.volatilityIndex}</div>
                </div>
                <div className="p-3 bg-gray-800 rounded text-center">
                    <div className="text-xs text-gray-500">Sharpe Ratio</div>
                    <div className="text-lg font-bold text-green-400">{insight.riskAnalysis.sharpeRatio}</div>
                </div>
                <div className="p-3 bg-gray-800 rounded text-center">
                    <div className="text-xs text-gray-500">Max Drawdown</div>
                    <div className="text-lg font-bold text-red-400">{insight.riskAnalysis.maxDrawdown}%</div>
                </div>
            </div>
            <div className="text-xs text-gray-400 bg-gray-800 p-3 rounded border border-gray-700">
                <strong className="text-gray-300">GEIN Factor Analysis:</strong> This insight was generated with a GEIN Factor of {insight.geinFactor}, indicating a highly unique market edge derived from proprietary data streams.
            </div>
        </div>
    );

    const renderBacktest = () => (
        <div className="h-64 w-full bg-gray-800 p-2 rounded border border-gray-700">
            <p className="text-xs text-gray-400 mb-2 text-center">Simulated Performance (Last 30 Days)</p>
            <ResponsiveContainer width="100%" height="90%">
                <LineChart data={insight.backtestData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="name" stroke="#9CA3AF" fontSize={10} />
                    <YAxis stroke="#9CA3AF" fontSize={10} />
                    <Tooltip contentStyle={{ backgroundColor: '#1F2937', borderColor: '#4B5563', color: '#F3F4F6' }} />
                    <Line type="monotone" dataKey="value" stroke="#10B981" strokeWidth={2} dot={false} />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );

    const renderAlternatives = () => (
        <div className="space-y-3">
            {insight.alternativeActions.map((alt, idx) => (
                <div key={idx} className="p-3 bg-gray-800 border border-gray-700 rounded hover:border-gray-500 cursor-pointer transition-colors">
                    <div className="flex justify-between mb-1">
                        <span className="font-semibold text-gray-200 capitalize">{alt.actionType.replace('_', ' ')}</span>
                        <span className="text-xs text-cyan-400 font-mono">{alt.confidence}% Conf.</span>
                    </div>
                    <p className="text-xs text-gray-400">{alt.rationale}</p>
                </div>
            ))}
        </div>
    );

    return (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center backdrop-blur-sm">
            <div className="bg-gray-900 w-full max-w-2xl rounded-xl border border-gray-700 shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                <div className="flex justify-between items-center p-4 border-b border-gray-800 bg-gray-800/50">
                    <h3 className="text-xl font-bold text-white flex items-center"><BoltIcon /> Strategic Execution Module</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors"><CloseIcon /></button>
                </div>
                
                <div className="flex border-b border-gray-800">
                    <button onClick={() => setActiveTab('overview')} className={`flex-1 py-3 text-sm font-medium transition-colors ${activeTab === 'overview' ? 'bg-gray-800 text-white border-b-2 border-cyan-500' : 'text-gray-400 hover:bg-gray-800/50'}`}>Overview</button>
                    <button onClick={() => setActiveTab('risk')} className={`flex-1 py-3 text-sm font-medium transition-colors ${activeTab === 'risk' ? 'bg-gray-800 text-white border-b-2 border-cyan-500' : 'text-gray-400 hover:bg-gray-800/50'}`}>Risk Analysis</button>
                    <button onClick={() => setActiveTab('backtest')} className={`flex-1 py-3 text-sm font-medium transition-colors ${activeTab === 'backtest' ? 'bg-gray-800 text-white border-b-2 border-cyan-500' : 'text-gray-400 hover:bg-gray-800/50'}`}>Backtest</button>
                    <button onClick={() => setActiveTab('alternatives')} className={`flex-1 py-3 text-sm font-medium transition-colors ${activeTab === 'alternatives' ? 'bg-gray-800 text-white border-b-2 border-cyan-500' : 'text-gray-400 hover:bg-gray-800/50'}`}>Alternatives</button>
                </div>

                <div className="p-6 min-h-[300px]">
                    {activeTab === 'overview' && renderOverview()}
                    {activeTab === 'risk' && renderRisk()}
                    {activeTab === 'backtest' && renderBacktest()}
                    {activeTab === 'alternatives' && renderAlternatives()}
                </div>

                <div className="p-4 border-t border-gray-800 bg-gray-800/30 flex justify-end gap-3">
                    <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white transition-colors">Cancel</button>
                    <button 
                        onClick={handleExecute} 
                        disabled={isLoading}
                        className="px-6 py-2 bg-cyan-600 hover:bg-cyan-500 text-white text-sm font-bold rounded shadow-lg shadow-cyan-500/20 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                    >
                        {isLoading ? (
                            <>
                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                Initiating...
                            </>
                        ) : 'Execute Strategy'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export const AIInsights: React.FC = () => {
    const context = useContext(DataContext);
    const [selectedInsight, setSelectedInsight] = useState<EnhancedAIInsight | null>(null);

    // Mock data generation if context data is limited
    const insights: EnhancedAIInsight[] = useMemo(() => {
        const baseInsights = context?.financialGoals || []; // Using financialGoals as a seed for mock insights
        
        // FIX: Added missing properties 'severity' and 'timestamp' to satisfy EnhancedAIInsight type.
        return [
            {
                id: 'ins_1',
                title: 'Portfolio Imbalance Detected',
                description: 'Crypto exposure has exceeded 20% due to recent ETH rally. Rebalancing recommended to maintain risk parity.',
                urgency: 'high',
                confidenceScore: 92,
                actionable: true,
                actionType: 'rebalance_portfolio',
                details: { asset: 'ETH', currentAllocation: 22, suggestedAllocation: 15 },
                tags: ['Risk', 'Crypto', 'Rebalance'],
                geinFactor: 0.85,
                correlationId: 'corr_eth_rally_q3',
                sourceModel: 'Sentinel-Prime-v4',
                timeToLive: 3600,
                riskAnalysis: { volatilityIndex: 65, sharpeRatio: 1.8, maxDrawdown: 12 },
                backtestData: Array.from({length: 30}, (_, i) => ({ name: `Day ${i}`, value: 100 + Math.random() * 20 + i })),
                alternativeActions: [
                    { actionType: 'hedge_with_options', rationale: 'Buy protective puts to lock in gains without selling.', confidence: 75 },
                    { actionType: 'do_nothing', rationale: 'Allow drift if momentum indicators remain strong.', confidence: 40 }
                ],
                message: 'Portfolio Imbalance',
                type: 'Warning',
                severity: 'High',
                timestamp: new Date().toISOString()
            },
            {
                id: 'ins_2',
                title: 'Stop-Loss Opportunity',
                description: 'TSLA volatility approaching critical threshold. Dynamic stop-loss adjustment suggested.',
                urgency: 'medium',
                confidenceScore: 88,
                actionable: true,
                actionType: 'set_stop_loss',
                details: { asset: 'TSLA', currentPrice: 245.50, suggestedStopLoss: 230.00 },
                tags: ['Equity', 'Protection'],
                geinFactor: 0.78,
                correlationId: 'corr_tech_volatility',
                sourceModel: 'Risk-Overseer-v9',
                timeToLive: 7200,
                riskAnalysis: { volatilityIndex: 45, sharpeRatio: 1.2, maxDrawdown: 25 },
                backtestData: Array.from({length: 30}, (_, i) => ({ name: `Day ${i}`, value: 100 - Math.random() * 10 })),
                alternativeActions: [],
                message: 'Stop-Loss Update',
                type: 'Opportunity',
                severity: 'Medium',
                timestamp: new Date().toISOString()
            },
             {
                id: 'ins_3',
                title: 'Liquidity Pool Yield Spike',
                description: 'USDC-ETH pool on Uniswap v3 showing 45% APR. Capital deployment advised.',
                urgency: 'low',
                confidenceScore: 65,
                actionable: true,
                actionType: 'liquidity_provision',
                details: { targetPool: 'USDC-ETH (0.05%)' },
                tags: ['DeFi', 'Yield'],
                geinFactor: 0.92,
                correlationId: 'corr_defi_yields',
                sourceModel: 'Yield-Hunter-Alpha',
                timeToLive: 1800,
                riskAnalysis: { volatilityIndex: 80, sharpeRatio: 2.5, maxDrawdown: 5 },
                backtestData: Array.from({length: 30}, (_, i) => ({ name: `Day ${i}`, value: 100 + Math.random() * 5 })),
                alternativeActions: [],
                message: 'High Yield Alert',
                type: 'Opportunity',
                severity: 'Low',
                timestamp: new Date().toISOString()
            }
        ];
    }, [context]);

    return (
        <Card title="AI Strategic Insights" className="h-full border-l-4 border-purple-500">
            <div className="space-y-4 pr-2 max-h-[400px] overflow-y-auto custom-scrollbar">
                {insights.map(insight => (
                    <div 
                        key={insight.id} 
                        className="relative p-4 bg-gray-800/50 rounded-lg border border-gray-700 hover:border-cyan-500/50 transition-all duration-300 group cursor-pointer hover:bg-gray-800"
                        onClick={() => setSelectedInsight(insight)}
                    >
                        <UrgencyIndicator urgency={insight.urgency} />
                        <h4 className="font-bold text-gray-200 pr-24">{insight.title}</h4>
                        <p className="text-sm text-gray-400 mt-1 line-clamp-2">{insight.description}</p>
                        
                        <div className="mt-3 flex items-center justify-between">
                            <div className="flex gap-2">
                                {insight.tags.map(tag => (
                                    <span key={tag} className="text-[10px] uppercase font-bold px-2 py-0.5 bg-gray-700 rounded text-gray-300">{tag}</span>
                                ))}
                            </div>
                            <div className="flex items-center text-xs font-mono text-cyan-400 opacity-80 group-hover:opacity-100">
                                <span className="mr-2">Score: {insight.confidenceScore}</span>
                                <BoltIcon />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            {selectedInsight && <ActionModal insight={selectedInsight} onClose={() => setSelectedInsight(null)} />}
        </Card>
    );
};

export default AIInsights;


================================================================================
// APPENDED FROM REPO: diplomat-bit/almost | ORIGINAL PATH: diplomat-bit-almost-93a5466/components/AIInsights.tsx
================================================================================

import React, { useContext, useState, useMemo, useEffect, useRef, useCallback } from 'react';
import { 
    BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, Cell, 
    LineChart, Line, CartesianGrid, AreaChart, Area, PieChart, Pie 
} from 'recharts';
import { GoogleGenAI } from "@google/genai";

/**
 * QUANTUM FINANCIAL - ELITE BUSINESS DEMO ENGINE
 * VERSION: 4.0.0 "GOLDEN TICKET"
 * 
 * PHILOSOPHY: 
 * - High-Performance, Secure, Professional.
 * - "Kick the tires" - Full interactive simulation.
 * - Homomorphic Internal App Storage (Encrypted).
 * - Generative AI Integration (Gemini 3 Flash).
 * - Audit-First Architecture.
 */

// --- TYPES & INTERFACES ---

export interface AuditEntry {
    id: string;
    timestamp: string;
    action: string;
    actor: string;
    severity: 'INFO' | 'WARN' | 'CRITICAL';
    details: string;
    checksum: string; // Simulated cryptographic link
}

export interface EnhancedAIInsight {
    id: string;
    title: string;
    description: string;
    urgency: 'low' | 'medium' | 'high';
    confidenceScore: number;
    actionable: boolean;
    actionType: 'rebalance_portfolio' | 'set_stop_loss' | 'execute_trade' | 'liquidity_provision' | 'wire_transfer' | 'fraud_alert';
    details?: any;
    tags: string[];
    geinFactor: number;
    riskAnalysis: {
        volatilityIndex: number;
        sharpeRatio: number;
        maxDrawdown: number;
    };
    backtestData: { name: string; value: number }[];
    alternativeActions: {
        actionType: string;
        rationale: string;
        confidence: number;
    }[];
}

// --- SECURE HOMOMORPHIC VAULT (SIMULATED INTERNAL STORAGE) ---
// This storage is closure-bound and not accessible via the window object or browser dev tools.
const QuantumVault = (() => {
    const _storage = new WeakMap<object, Map<string, string>>();
    const _key = { id: 'quantum-internal-ref' };
    _storage.set(_key, new Map());

    const encrypt = (data: string) => btoa(`QUANTUM_SECURE_${data}_${Date.now()}`);
    const decrypt = (data: string) => atob(data).replace(/^QUANTUM_SECURE_/, '').split('_')[0];

    return {
        set: (key: string, value: any) => {
            const encryptedValue = encrypt(JSON.stringify(value));
            _storage.get(_key)?.set(key, encryptedValue);
        },
        get: (key: string) => {
            const val = _storage.get(_key)?.get(key);
            return val ? JSON.parse(decrypt(val)) : null;
        },
        has: (key: string) => _storage.get(_key)?.has(key)
    };
})();

// --- AUDIT LOGGING SYSTEM ---
const useAuditLogger = () => {
    const [logs, setLogs] = useState<AuditEntry[]>([]);
    
    const logAction = useCallback((action: string, details: string, severity: AuditEntry['severity'] = 'INFO') => {
        const newEntry: AuditEntry = {
            id: `LOG-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
            timestamp: new Date().toISOString(),
            action,
            actor: 'SYSTEM_AUTH_USER_01',
            severity,
            details,
            checksum: Math.random().toString(16).slice(2)
        };
        setLogs(prev => [newEntry, ...prev].slice(0, 100));
        // Persist to internal vault
        const currentLogs = QuantumVault.get('audit_trail') || [];
        QuantumVault.set('audit_trail', [newEntry, ...currentLogs]);
    }, []);

    return { logs, logAction };
};

// --- ICONS ---

const BoltIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5.2a1 1 0 01-1.17.986l-3.2-1.1a1 1 0 00-1.26.95l.5 3.5a1 1 0 01-.45.95l-2.7 2.1a1 1 0 00-.55 1.34l3.2 5.9a1 1 0 01.05.52 1 1 0 01-1.6 1.04l-1.4-1.4a1 1 0 00-1.4 1.4l1.4 1.4a3 3 0 004.2 0l9.4-9.4a1 1 0 01-.1-1.5l-5.9-3.2a1 1 0 01-.5-.05l-3.5-.5a1 1 0 00-.95 1.26l1.1 3.2A1 1 0 018.8 11V2a1 1 0 011.3-.954z" clipRule="evenodd" />
    </svg>
);

const ShieldIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
);

const ChatIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
    </svg>
);

// --- COMPONENTS ---

const Card: React.FC<{ title: string; children: React.ReactNode; className?: string; icon?: React.ReactNode }> = ({ title, children, className, icon }) => (
    <div className={`bg-gray-900/80 backdrop-blur-md border border-gray-800 rounded-xl overflow-hidden shadow-2xl ${className}`}>
        <div className="px-6 py-4 border-b border-gray-800 flex items-center justify-between bg-gradient-to-r from-gray-900 to-gray-800">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
                {icon} {title}
            </h3>
            <div className="flex gap-1">
                <div className="w-2 h-2 rounded-full bg-red-500/50"></div>
                <div className="w-2 h-2 rounded-full bg-yellow-500/50"></div>
                <div className="w-2 h-2 rounded-full bg-green-500/50"></div>
            </div>
        </div>
        <div className="p-6">{children}</div>
    </div>
);

// --- AI CHATBOT ENGINE ---

const QuantumChat: React.FC<{ onAction: (action: string, data: any) => void }> = ({ onAction }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<{ role: 'user' | 'ai'; content: string }[]>([
        { role: 'ai', content: "Welcome to Quantum Financial. I am your AI co-pilot. Think of this as the cockpit of a high-performance vehicle. How can I help you navigate your global finances today?" }
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim()) return;
        const userMsg = input;
        setInput('');
        setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
        setIsTyping(true);

        try {
            // Initialize Google GenAI with Vercel Secret
            const genAI = new GoogleGenAI(process.env.GEMINI_API_KEY || '');
            const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });

            const prompt = `
                You are the Quantum Financial AI Assistant. 
                Context: Global Business Banking Demo.
                User Instruction: ${userMsg}
                
                Capabilities:
                1. Create Wire Transfers
                2. Generate Fraud Reports
                3. Rebalance Portfolios
                4. Analyze Risk
                
                If the user wants to "create" or "do" something, respond with a JSON block at the end of your message like this:
                ACTION: {"type": "WIRE_TRANSFER", "amount": 50000, "recipient": "Global Corp"}
                
                Tone: Elite, Professional, Secure.
            `;

            const result = await model.generateContent(prompt);
            const response = await result.response;
            const text = response.text();

            // Parse Action
            const actionMatch = text.match(/ACTION: ({.*})/);
            if (actionMatch) {
                const actionData = JSON.parse(actionMatch[1]);
                onAction(actionData.type, actionData);
            }

            setMessages(prev => [...prev, { role: 'ai', content: text.replace(/ACTION: {.*}/, '') }]);
        } catch (error) {
            setMessages(prev => [...prev, { role: 'ai', content: "I apologize, but I'm experiencing a momentary synchronization delay with the global markets. Please try again." }]);
        } finally {
            setIsTyping(false);
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-[100]">
            {isOpen ? (
                <div className="w-96 h-[500px] bg-gray-900 border border-cyan-500/30 rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-10 duration-300">
                    <div className="p-4 bg-cyan-900/20 border-b border-gray-800 flex justify-between items-center">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
                            <span className="font-bold text-cyan-400 text-sm tracking-widest uppercase">Quantum AI Co-Pilot</span>
                        </div>
                        <button onClick={() => setIsOpen(false)} className="text-gray-500 hover:text-white">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                    </div>
                    <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
                        {messages.map((m, i) => (
                            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[80%] p-3 rounded-xl text-sm ${m.role === 'user' ? 'bg-cyan-600 text-white' : 'bg-gray-800 text-gray-300 border border-gray-700'}`}>
                                    {m.content}
                                </div>
                            </div>
                        ))}
                        {isTyping && <div className="text-xs text-cyan-500 animate-pulse">AI is calculating market vectors...</div>}
                    </div>
                    <div className="p-4 border-t border-gray-800 bg-gray-950">
                        <div className="flex gap-2">
                            <input 
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                                placeholder="Command the system..."
                                className="flex-1 bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500 transition-colors"
                            />
                            <button onClick={handleSend} className="bg-cyan-600 p-2 rounded-lg hover:bg-cyan-500">
                                <BoltIcon />
                            </button>
                        </div>
                    </div>
                </div>
            ) : (
                <button 
                    onClick={() => setIsOpen(true)}
                    className="w-16 h-16 bg-cyan-600 rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-transform group"
                >
                    <div className="absolute inset-0 rounded-full bg-cyan-400 animate-ping opacity-20"></div>
                    <ChatIcon />
                </button>
            )}
        </div>
    );
};

// --- STRIPE SIMULATION MODAL ---

const StripeCheckoutModal: React.FC<{ amount: number; recipient: string; onClose: () => void; onComplete: () => void }> = ({ amount, recipient, onClose, onComplete }) => {
    const [step, setStep] = useState(1);
    const [isProcessing, setIsProcessing] = useState(false);

    const handlePay = () => {
        setIsProcessing(true);
        setTimeout(() => {
            setIsProcessing(false);
            setStep(2);
            onComplete();
        }, 2500);
    };

    return (
        <div className="fixed inset-0 bg-black/90 z-[110] flex items-center justify-center backdrop-blur-xl">
            <div className="bg-white w-full max-w-md rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)] text-gray-900">
                <div className="p-8">
                    <div className="flex justify-between items-center mb-8">
                        <div className="text-2xl font-bold tracking-tighter text-indigo-600">Stripe</div>
                        <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                    </div>

                    {step === 1 ? (
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className="mb-6">
                                <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Payment to</label>
                                <div className="text-lg font-semibold">{recipient}</div>
                            </div>
                            <div className="mb-8">
                                <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Amount</label>
                                <div className="text-4xl font-black">${amount.toLocaleString()}</div>
                            </div>
                            
                            <div className="space-y-4">
                                <div className="p-4 border border-gray-200 rounded-xl flex items-center gap-4">
                                    <div className="w-12 h-8 bg-gray-100 rounded flex items-center justify-center font-bold text-[10px]">VISA</div>
                                    <div className="flex-1">
                                        <div className="text-sm font-medium">•••• 4242</div>
                                        <div className="text-xs text-gray-400">Expires 12/26</div>
                                    </div>
                                </div>
                                <button 
                                    onClick={handlePay}
                                    disabled={isProcessing}
                                    className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-indigo-700 transition-all disabled:opacity-50 flex items-center justify-center gap-3"
                                >
                                    {isProcessing ? (
                                        <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    ) : `Pay $${amount.toLocaleString()}`}
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-12 animate-in zoom-in duration-500">
                            <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                            </div>
                            <h2 className="text-2xl font-bold mb-2">Payment Successful</h2>
                            <p className="text-gray-500 mb-8">Transaction ID: ch_3N5k9L2eZvKYlo2C1</p>
                            <button onClick={onClose} className="w-full bg-gray-900 text-white py-4 rounded-xl font-bold">Return to Quantum</button>
                        </div>
                    )}
                </div>
                <div className="bg-gray-50 p-4 text-center text-[10px] text-gray-400 uppercase tracking-widest font-bold">
                    Secure Encrypted Transaction via Quantum Financial
                </div>
            </div>
        </div>
    );
};

// --- MAIN COMPONENT ---

export const AIInsights: React.FC = () => {
    const { logs, logAction } = useAuditLogger();
    const [selectedInsight, setSelectedInsight] = useState<EnhancedAIInsight | null>(null);
    const [showStripe, setShowStripe] = useState(false);
    const [stripeData, setStripeData] = useState({ amount: 0, recipient: '' });

    // Mock Data Generation
    const insights: EnhancedAIInsight[] = useMemo(() => [
        {
            id: 'ins_1',
            title: 'Anomalous Outflow Detected',
            description: 'A series of high-velocity transfers to a non-whitelisted entity in Singapore has been flagged by our neural monitors.',
            urgency: 'high',
            confidenceScore: 98,
            actionable: true,
            actionType: 'fraud_alert',
            details: { entity: 'SG-Global-Trade', amount: 1250000 },
            tags: ['Security', 'Fraud', 'Critical'],
            geinFactor: 0.99,
            riskAnalysis: { volatilityIndex: 88, sharpeRatio: 0.5, maxDrawdown: 40 },
            backtestData: Array.from({length: 20}, (_, i) => ({ name: `T-${20-i}`, value: 50 + Math.random() * 50 })),
            alternativeActions: [
                { actionType: 'freeze_account', rationale: 'Immediate cessation of all outbound liquidity.', confidence: 95 },
                { actionType: 'manual_review', rationale: 'Escalate to human compliance officer.', confidence: 80 }
            ]
        },
        {
            id: 'ins_2',
            title: 'Yield Optimization: EUR/USD',
            description: 'Predictive models suggest a 48-hour window of increased volatility in the Eurozone. Hedging recommended.',
            urgency: 'medium',
            confidenceScore: 84,
            actionable: true,
            actionType: 'execute_trade',
            details: { pair: 'EUR/USD', strategy: 'Short-Gamma' },
            tags: ['FX', 'Yield', 'Alpha'],
            geinFactor: 0.82,
            riskAnalysis: { volatilityIndex: 34, sharpeRatio: 2.1, maxDrawdown: 5 },
            backtestData: Array.from({length: 20}, (_, i) => ({ name: `T-${20-i}`, value: 100 + i * 2 + Math.random() * 5 })),
            alternativeActions: [
                { actionType: 'spot_buy', rationale: 'Direct exposure to the underlying asset.', confidence: 60 }
            ]
        },
        {
            id: 'ins_3',
            title: 'Liquidity Provision Opportunity',
            description: 'Quantum Pool #42 is showing a 12% APR spike due to institutional rebalancing.',
            urgency: 'low',
            confidenceScore: 72,
            actionable: true,
            actionType: 'liquidity_provision',
            details: { pool: 'Quantum-Alpha-IV' },
            tags: ['Treasury', 'Passive'],
            geinFactor: 0.75,
            riskAnalysis: { volatilityIndex: 12, sharpeRatio: 3.5, maxDrawdown: 2 },
            backtestData: Array.from({length: 20}, (_, i) => ({ name: `T-${20-i}`, value: 100 + Math.sin(i) * 10 })),
            alternativeActions: []
        }
    ], []);

    const handleAIAction = (type: string, data: any) => {
        logAction(`AI_TRIGGERED_${type}`, JSON.stringify(data), 'INFO');
        if (type === 'WIRE_TRANSFER') {
            setStripeData({ amount: data.amount || 1000, recipient: data.recipient || 'Unknown Entity' });
            setShowStripe(true);
        }
    };

    const executeStrategy = (insight: EnhancedAIInsight) => {
        logAction(`STRATEGY_EXECUTION_${insight.actionType}`, `Executing strategy for ${insight.id}`, 'CRITICAL');
        setSelectedInsight(null);
        alert(`Strategy ${insight.actionType} initiated. Check Audit Logs for progress.`);
    };

    return (
        <div className="min-h-screen bg-[#05070a] text-gray-300 p-8 font-sans selection:bg-cyan-500/30">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center shadow-[0_0_20px_rgba(6,182,212,0.5)]">
                            <ShieldIcon />
                        </div>
                        <h1 className="text-4xl font-black text-white tracking-tighter uppercase italic">Quantum Financial</h1>
                    </div>
                    <p className="text-gray-500 font-medium tracking-widest text-xs uppercase">Global Institutional Command Center // Secure Node 0x4F2</p>
                </div>
                <div className="flex gap-4">
                    <div className="bg-gray-900 border border-gray-800 px-6 py-3 rounded-xl flex flex-col items-end">
                        <span className="text-[10px] text-gray-500 font-bold uppercase">Total Liquidity</span>
                        <span className="text-2xl font-mono text-cyan-400 font-bold">$4,290,122,004.82</span>
                    </div>
                    <div className="bg-gray-900 border border-gray-800 px-6 py-3 rounded-xl flex flex-col items-end">
                        <span className="text-[10px] text-gray-500 font-bold uppercase">System Health</span>
                        <span className="text-2xl font-mono text-green-400 font-bold">99.99%</span>
                    </div>
                </div>
            </div>

            {/* Main Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                {/* Left Column: Insights */}
                <div className="lg:col-span-4 space-y-8">
                    <Card title="Strategic Intelligence" icon={<BoltIcon />} className="border-l-4 border-l-cyan-500">
                        <div className="space-y-4">
                            {insights.map(insight => (
                                <div 
                                    key={insight.id}
                                    onClick={() => setSelectedInsight(insight)}
                                    className="group relative p-4 bg-gray-800/30 border border-gray-800 rounded-xl hover:border-cyan-500/50 transition-all cursor-pointer overflow-hidden"
                                >
                                    <div className={`absolute top-0 right-0 w-1 h-full ${insight.urgency === 'high' ? 'bg-red-500' : insight.urgency === 'medium' ? 'bg-yellow-500' : 'bg-blue-500'}`}></div>
                                    <div className="flex justify-between items-start mb-2">
                                        <h4 className="font-bold text-white group-hover:text-cyan-400 transition-colors">{insight.title}</h4>
                                        <span className="text-[10px] font-mono text-gray-500">{insight.confidenceScore}% CONF</span>
                                    </div>
                                    <p className="text-xs text-gray-400 line-clamp-2 mb-3">{insight.description}</p>
                                    <div className="flex gap-2">
                                        {insight.tags.map(t => (
                                            <span key={t} className="text-[9px] px-2 py-0.5 bg-gray-900 rounded border border-gray-700 text-gray-500 uppercase font-bold">{t}</span>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>

                    <Card title="Global Market Vectors" icon={<BoltIcon />}>
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={Array.from({length: 12}, (_, i) => ({ name: i, val: 4000 + Math.random() * 2000 }))}>
                                    <defs>
                                        <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3}/>
                                            <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                    <Area type="monotone" dataKey="val" stroke="#06b6d4" fillOpacity={1} fill="url(#colorVal)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </Card>
                </div>

                {/* Center Column: Detailed Analysis */}
                <div className="lg:col-span-5 space-y-8">
                    <Card title="Real-Time Performance Engine" className="h-full">
                        <div className="grid grid-cols-2 gap-4 mb-8">
                            <div className="p-4 bg-gray-800/20 rounded-xl border border-gray-800">
                                <div className="text-[10px] text-gray-500 uppercase font-bold mb-1">Alpha Generation</div>
                                <div className="text-xl font-mono text-white">+14.2%</div>
                            </div>
                            <div className="p-4 bg-gray-800/20 rounded-xl border border-gray-800">
                                <div className="text-[10px] text-gray-500 uppercase font-bold mb-1">Risk Exposure</div>
                                <div className="text-xl font-mono text-yellow-500">MODERATE</div>
                            </div>
                        </div>
                        <div className="h-[400px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={Array.from({length: 8}, (_, i) => ({ name: `Node ${i}`, value: Math.random() * 100 }))}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} />
                                    <XAxis dataKey="name" stroke="#4b5563" fontSize={10} />
                                    <YAxis stroke="#4b5563" fontSize={10} />
                                    <Tooltip 
                                        contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px' }}
                                        itemStyle={{ color: '#06b6d4' }}
                                    />
                                    <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                                        {Array.from({length: 8}).map((_, index) => (
                                            <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#06b6d4' : '#3b82f6'} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="mt-8 p-4 bg-cyan-900/10 border border-cyan-500/20 rounded-xl">
                            <div className="flex items-center gap-3 text-cyan-400 mb-2">
                                <BoltIcon />
                                <span className="text-sm font-bold uppercase tracking-widest">AI Optimization Active</span>
                            </div>
                            <p className="text-xs text-gray-400 leading-relaxed">
                                Our proprietary GEIN (Generative Edge & Intelligence Nexus) is currently re-routing liquidity through the Frankfurt-Singapore corridor to minimize latency and maximize yield.
                            </p>
                        </div>
                    </Card>
                </div>

                {/* Right Column: Audit & Security */}
                <div className="lg:col-span-3 space-y-8">
                    <Card title="Immutable Audit Trail" icon={<ShieldIcon />}>
                        <div className="space-y-4 max-h-[600px] overflow-y-auto custom-scrollbar pr-2">
                            {logs.length === 0 && <div className="text-center py-8 text-gray-600 italic text-sm">No sensitive actions recorded in current session.</div>}
                            {logs.map(log => (
                                <div key={log.id} className="p-3 bg-gray-950 border-l-2 border-gray-800 rounded-r-lg">
                                    <div className="flex justify-between items-center mb-1">
                                        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${log.severity === 'CRITICAL' ? 'bg-red-900/40 text-red-400' : 'bg-gray-800 text-gray-400'}`}>
                                            {log.severity}
                                        </span>
                                        <span className="text-[8px] font-mono text-gray-600">{new Date(log.timestamp).toLocaleTimeString()}</span>
                                    </div>
                                    <div className="text-[11px] font-bold text-gray-300 mb-1">{log.action}</div>
                                    <div className="text-[9px] text-gray-500 font-mono truncate">{log.details}</div>
                                    <div className="mt-2 text-[8px] text-cyan-900 font-mono uppercase tracking-tighter">SIG: {log.checksum}</div>
                                </div>
                            ))}
                        </div>
                    </Card>

                    <Card title="Security Status" icon={<ShieldIcon />}>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-3 bg-green-900/10 border border-green-500/20 rounded-lg">
                                <span className="text-xs font-bold text-green-500">MFA STATUS</span>
                                <span className="text-xs font-mono text-white">VERIFIED</span>
                            </div>
                            <div className="flex items-center justify-between p-3 bg-cyan-900/10 border border-cyan-500/20 rounded-lg">
                                <span className="text-xs font-bold text-cyan-500">ENCRYPTION</span>
                                <span className="text-xs font-mono text-white">AES-GCM-256</span>
                            </div>
                            <div className="flex items-center justify-between p-3 bg-purple-900/10 border border-purple-500/20 rounded-lg">
                                <span className="text-xs font-bold text-purple-500">VAULT MODE</span>
                                <span className="text-xs font-mono text-white">HOMOMORPHIC</span>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>

            {/* Modals */}
            {selectedInsight && (
                <div className="fixed inset-0 bg-black/80 z-[105] flex items-center justify-center backdrop-blur-md p-4">
                    <div className="bg-gray-900 w-full max-w-2xl rounded-2xl border border-gray-700 shadow-2xl overflow-hidden animate-in zoom-in duration-200">
                        <div className="p-6 border-b border-gray-800 flex justify-between items-center bg-gradient-to-r from-gray-900 to-gray-800">
                            <h3 className="text-xl font-bold text-white flex items-center gap-3">
                                <BoltIcon /> Strategic Execution Module
                            </h3>
                            <button onClick={() => setSelectedInsight(null)} className="text-gray-500 hover:text-white">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>
                        <div className="p-8">
                            <div className="mb-8">
                                <div className="text-xs font-bold text-cyan-500 uppercase tracking-widest mb-2">Insight Analysis</div>
                                <h2 className="text-2xl font-bold text-white mb-4">{selectedInsight.title}</h2>
                                <p className="text-gray-400 leading-relaxed">{selectedInsight.description}</p>
                            </div>

                            <div className="grid grid-cols-3 gap-6 mb-8">
                                <div className="p-4 bg-gray-800/50 rounded-xl border border-gray-700 text-center">
                                    <div className="text-[10px] text-gray-500 uppercase font-bold mb-1">Volatility</div>
                                    <div className="text-xl font-mono text-white">{selectedInsight.riskAnalysis.volatilityIndex}</div>
                                </div>
                                <div className="p-4 bg-gray-800/50 rounded-xl border border-gray-700 text-center">
                                    <div className="text-[10px] text-gray-500 uppercase font-bold mb-1">Sharpe</div>
                                    <div className="text-xl font-mono text-green-400">{selectedInsight.riskAnalysis.sharpeRatio}</div>
                                </div>
                                <div className="p-4 bg-gray-800/50 rounded-xl border border-gray-700 text-center">
                                    <div className="text-[10px] text-gray-500 uppercase font-bold mb-1">Max DD</div>
                                    <div className="text-xl font-mono text-red-400">{selectedInsight.riskAnalysis.maxDrawdown}%</div>
                                </div>
                            </div>

                            <div className="h-48 mb-8 bg-gray-950 rounded-xl border border-gray-800 p-4">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={selectedInsight.backtestData}>
                                        <Line type="monotone" dataKey="value" stroke="#06b6d4" strokeWidth={3} dot={false} />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>

                            <div className="flex gap-4">
                                <button 
                                    onClick={() => setSelectedInsight(null)}
                                    className="flex-1 px-6 py-4 bg-gray-800 text-white font-bold rounded-xl hover:bg-gray-700 transition-colors"
                                >
                                    Decline Strategy
                                </button>
                                <button 
                                    onClick={() => executeStrategy(selectedInsight)}
                                    className="flex-1 px-6 py-4 bg-cyan-600 text-white font-bold rounded-xl hover:bg-cyan-500 shadow-[0_0_30px_rgba(6,182,212,0.4)] transition-all transform hover:scale-[1.02]"
                                >
                                    Execute Strategy
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {showStripe && (
                <StripeCheckoutModal 
                    amount={stripeData.amount} 
                    recipient={stripeData.recipient} 
                    onClose={() => setShowStripe(false)} 
                    onComplete={() => logAction('STRIPE_PAYMENT_SUCCESS', `Paid ${stripeData.amount} to ${stripeData.recipient}`, 'INFO')}
                />
            )}

            {/* Chatbot */}
            <QuantumChat onAction={handleAIAction} />

            {/* Footer Branding */}
            <div className="mt-12 pt-8 border-t border-gray-900 flex justify-between items-center text-[10px] text-gray-600 font-bold uppercase tracking-[0.2em]">
                <div>© 2024 Quantum Financial Institutional Group. All Rights Reserved.</div>
                <div className="flex gap-6">
                    <span className="hover:text-cyan-500 cursor-pointer transition-colors">Terms of Service</span>
                    <span className="hover:text-cyan-500 cursor-pointer transition-colors">Privacy Protocol</span>
                    <span className="hover:text-cyan-500 cursor-pointer transition-colors">Regulatory Disclosures</span>
                </div>
            </div>
        </div>
    );
};

export default AIInsights;

================================================================================
// APPENDED FROM REPO: diplomat-bit/Citibank_Demo_Business_Inc_Demonstration- | ORIGINAL PATH: diplomat-bit-Citibank_Demo_Business_Inc_Demonstration--ab2501d/components/AIInsights.tsx
================================================================================

// components/AIInsights.tsx
import React, { useContext, useEffect, useState, useCallback, useMemo } from 'react';
import { DataContext } from '../context/DataContext';
import Card from './Card';

//region Core Components & Utilities

// Urgency Indicator (existing)
const UrgencyIndicator: React.FC<{ urgency: 'low' | 'medium' | 'high' | 'critical' | 'informational' }> = ({ urgency }) => {
    const colors = {
        informational: 'bg-blue-500',
        low: 'bg-cyan-500',
        medium: 'bg-yellow-500',
        high: 'bg-red-500',
        critical: 'bg-purple-600 animate-pulse', // Added critical and animation
    };
    return <div className={`w-2.5 h-2.5 rounded-full ${colors[urgency]}`} title={`Urgency: ${urgency}`}></div>;
};

// Insight Type Icon Map (new)
const InsightTypeIconMap: { [key: string]: string } = {
    'general': '💡',
    'predictive': '🔮',
    'actionable': '🚀',
    'correlation': '🔗',
    'anomaly': '🚨',
    'sentiment': '😊',
    'geospatial': '🗺️',
    'multimedia': '🖼️',
    'risk': '⚠️',
    'opportunity': '✨',
    'efficiency': '⚙️',
    'compliance': '⚖️',
    'market': '📈',
    'customer': '👤',
    'security': '🛡️',
    'ethical': '⚖️',
    'resource': '📦',
    'sustainability': '🌱',
    'trend': '📊',
    'forecasting': '🗓️',
    'optimization': '🎯',
    'recommendation': '👍',
};

// Utility for generating unique IDs (new)
export const generateUniqueId = (): string => Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

// Expanded Insight Data Structure (conceptual, assumes DataContext provides this)
export interface ExtendedAIInsight {
    id: string;
    title: string;
    description: string;
    urgency: 'low' | 'medium' | 'high' | 'critical' | 'informational';
    type: 'general' | 'predictive' | 'actionable' | 'correlation' | 'anomaly' | 'sentiment' | 'geospatial' | 'multimedia' | 'risk' | 'opportunity' | 'efficiency' | 'compliance' | 'market' | 'customer' | 'security' | 'ethical' | 'resource' | 'sustainability' | 'trend' | 'forecasting' | 'optimization' | 'recommendation';
    timestamp: string; // ISO string
    source: string; // e.g., 'Sales Data', 'Marketing Analytics', 'IoT Sensors'
    dataPoints?: any[]; // Raw data points supporting the insight
    metrics?: { [key: string]: any }; // Key metrics related to the insight
    relatedEntities?: { type: string; id: string; name: string }[];
    recommendedActions?: { id: string; description: string; priority: 'low' | 'medium' | 'high'; status: 'pending' | 'in-progress' | 'completed' | 'deferred' }[];
    predictions?: { target: string; value: number; confidence: number; trend: 'up' | 'down' | 'stable' }[];
    visualizations?: { type: 'chart' | 'map' | 'graph'; data: any; options?: any }[];
    explanation?: string; // Explainable AI (XAI)
    feedback?: { rating: number; comment: string; timestamp: string }[];
    modelVersion?: string;
    ethicalConsiderations?: { aspect: string; score: number; details: string }[]; // Ethical AI
    tags?: string[];
    status?: 'active' | 'archived' | 'dismissed' | 'resolved';
    impactScore?: number; // Calculated impact
}

//endregion

//region Advanced Insight Rendering Components

// InsightDetailCard: Provides an expandable view for an insight with more data
export const InsightDetailCard: React.FC<{ insight: ExtendedAIInsight }> = ({ insight }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const { dismissInsight, markInsightAsActioned } = useContext(DataContext)!;

    const handleDismiss = useCallback(() => {
        dismissInsight(insight.id);
    }, [insight.id, dismissInsight]);

    const handleActioned = useCallback((actionId: string) => {
        markInsightAsActioned(insight.id, actionId);
    }, [insight.id, markInsightAsActioned]);

    return (
        <div className="bg-gray-700 p-4 rounded-lg shadow-lg border border-gray-600 hover:border-blue-500 transition-all duration-200">
            <div className="flex items-start justify-between gap-3 cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>
                <div className="flex items-start gap-3 flex-grow">
                    <UrgencyIndicator urgency={insight.urgency} />
                    <span className="text-xl">{InsightTypeIconMap[insight.type] || '❓'}</span>
                    <div>
                        <p className="font-semibold text-white text-lg">{insight.title}</p>
                        <p className="text-sm text-gray-300">{insight.description}</p>
                        <div className="flex items-center gap-2 mt-1 text-xs text-gray-400">
                            <span>Source: {insight.source}</span>
                            <span>| Generated: {new Date(insight.timestamp).toLocaleString()}</span>
                            {insight.modelVersion && <span>| Model: {insight.modelVersion}</span>}
                            {insight.status && <span className={`capitalize px-2 py-0.5 rounded-full text-white text-xs ${insight.status === 'active' ? 'bg-green-600' : 'bg-gray-500'}`}>{insight.status}</span>}
                        </div>
                    </div>
                </div>
                <div className="flex-shrink-0 text-gray-400">
                    <button className="ml-2 focus:outline-none" onClick={(e) => { e.stopPropagation(); setIsExpanded(!isExpanded); }}>
                        {isExpanded ? '▲' : '▼'}
                    </button>
                </div>
            </div>

            {isExpanded && (
                <div className="mt-4 pt-4 border-t border-gray-600 space-y-3">
                    {insight.explanation && (
                        <div>
                            <h4 className="font-medium text-blue-300">Why this insight? (XAI)</h4>
                            <p className="text-sm text-gray-300">{insight.explanation}</p>
                        </div>
                    )}

                    {insight.metrics && Object.keys(insight.metrics).length > 0 && (
                        <div>
                            <h4 className="font-medium text-blue-300">Key Metrics</h4>
                            <ul className="list-disc list-inside text-sm text-gray-300">
                                {Object.entries(insight.metrics).map(([key, value]) => (
                                    <li key={key}><strong>{key}:</strong> {typeof value === 'object' ? JSON.stringify(value) : String(value)}</li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {insight.predictions && insight.predictions.length > 0 && (
                        <div>
                            <h4 className="font-medium text-blue-300">Predictions</h4>
                            <ul className="space-y-1">
                                {insight.predictions.map((p, i) => (
                                    <li key={i} className="bg-gray-800 p-2 rounded text-sm text-gray-300">
                                        Predicting <strong>{p.target}</strong>: {p.value.toFixed(2)} ({p.confidence * 100}% confidence, trend: {p.trend})
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {insight.recommendedActions && insight.recommendedActions.length > 0 && (
                        <div>
                            <h4 className="font-medium text-blue-300">Recommended Actions</h4>
                            <ul className="space-y-2">
                                {insight.recommendedActions.map(action => (
                                    <li key={action.id} className="flex items-center justify-between bg-gray-800 p-2 rounded text-sm text-gray-300">
                                        <span>
                                            <span className={`px-2 py-0.5 rounded-full text-xs text-white ${action.priority === 'high' ? 'bg-red-700' : action.priority === 'medium' ? 'bg-yellow-700' : 'bg-blue-700'}`}>
                                                {action.priority.toUpperCase()}
                                            </span>
                                            <span className="ml-2">{action.description}</span>
                                        </span>
                                        <span className={`capitalize px-2 py-0.5 rounded-full text-white text-xs ${action.status === 'completed' ? 'bg-green-600' : action.status === 'in-progress' ? 'bg-yellow-600' : 'bg-gray-500'}`}>
                                            {action.status}
                                        </span>
                                        {action.status === 'pending' && (
                                            <button
                                                className="ml-2 px-3 py-1 bg-green-500 hover:bg-green-600 rounded text-xs text-white"
                                                onClick={() => handleActioned(action.id)}
                                            >
                                                Mark as Actioned
                                            </button>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {insight.visualizations && insight.visualizations.length > 0 && (
                        <div>
                            <h4 className="font-medium text-blue-300">Visualizations</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                                {insight.visualizations.map((vis, i) => (
                                    <div key={i} className="bg-gray-800 p-3 rounded h-48 flex items-center justify-center text-gray-400 text-sm">
                                        {/* Placeholder for complex visualization rendering */}
                                        <p>Dynamic {vis.type} visualization goes here (Data: {JSON.stringify(vis.data).substring(0, 50)}...)</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {insight.ethicalConsiderations && insight.ethicalConsiderations.length > 0 && (
                        <div>
                            <h4 className="font-medium text-blue-300">Ethical AI Review</h4>
                            <ul className="space-y-1">
                                {insight.ethicalConsiderations.map((ec, i) => (
                                    <li key={i} className="bg-gray-800 p-2 rounded text-sm text-gray-300">
                                        <strong>{ec.aspect}</strong>: Score {ec.score.toFixed(1)}/10. {ec.details}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {insight.feedback && insight.feedback.length > 0 && (
                        <div>
                            <h4 className="font-medium text-blue-300">User Feedback</h4>
                            <ul className="space-y-1">
                                {insight.feedback.map((f, i) => (
                                    <li key={i} className="bg-gray-800 p-2 rounded text-sm text-gray-300">
                                        <span className="text-yellow-400">{f.rating} ★</span>: "{f.comment}" (on {new Date(f.timestamp).toLocaleDateString()})
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    <div className="flex justify-end gap-2 mt-4">
                        <button
                            className="px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded-md text-sm transition-colors"
                            onClick={handleDismiss}
                        >
                            Dismiss Insight
                        </button>
                        {/* More action buttons can be added here, e.g., "Share", "Follow Up", "Integrate into Workflow" */}
                    </div>
                </div>
            )}
        </div>
    );
};

// InsightFeedbackModule: Allows users to provide feedback on an insight
export const InsightFeedbackModule: React.FC<{ insightId: string; onFeedbackSubmit: (insightId: string, rating: number, comment: string) => void }> = ({ insightId, onFeedbackSubmit }) => {
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = useCallback(() => {
        if (rating > 0) {
            onFeedbackSubmit(insightId, rating, comment);
            setSubmitted(true);
            setTimeout(() => setSubmitted(false), 3000); // Reset submitted state
            setRating(0);
            setComment('');
        }
    }, [insightId, rating, comment, onFeedbackSubmit]);

    return (
        <div className="bg-gray-800 p-4 rounded-lg mt-3">
            <h5 className="text-white font-medium mb-2">Provide Feedback</h5>
            <div className="flex items-center gap-2 mb-2">
                {[1, 2, 3, 4, 5].map((star) => (
                    <span
                        key={star}
                        className={`text-2xl cursor-pointer ${star <= rating ? 'text-yellow-400' : 'text-gray-500'}`}
                        onClick={() => setRating(star)}
                    >
                        ★
                    </span>
                ))}
            </div>
            <textarea
                className="w-full p-2 bg-gray-700 text-white rounded-md border border-gray-600 focus:ring-blue-500 focus:border-blue-500 text-sm"
                placeholder="Optional: Share your thoughts on this insight..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={2}
            />
            <button
                className="mt-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={handleSubmit}
                disabled={rating === 0}
            >
                Submit Feedback
            </button>
            {submitted && <span className="ml-3 text-green-400 text-sm">Feedback submitted! Thank you.</span>}
        </div>
    );
};

// InsightQueryInterface: Allows users to ask questions about insights or data
export const InsightQueryInterface: React.FC<{ onQuerySubmit: (query: string) => void; isLoading: boolean; queryResults: string[] }> = ({ onQuerySubmit, isLoading, queryResults }) => {
    const [query, setQuery] = useState('');

    const handleSubmit = useCallback((e: React.FormEvent) => {
        e.preventDefault();
        if (query.trim()) {
            onQuerySubmit(query);
            setQuery('');
        }
    }, [query, onQuerySubmit]);

    return (
        <Card title="Query AI for Insights" className="mt-6 bg-gray-800 border border-gray-700">
            <form onSubmit={handleSubmit} className="flex gap-2">
                <input
                    type="text"
                    className="flex-grow p-2 bg-gray-700 text-white rounded-md border border-gray-600 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Ask a question about your data or insights..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    disabled={isLoading}
                />
                <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={isLoading || !query.trim()}
                >
                    {isLoading ? 'Thinking...' : 'Query'}
                </button>
            </form>
            {isLoading && <div className="mt-3 text-center text-blue-400">Processing your query...</div>}
            {queryResults.length > 0 && (
                <div className="mt-4 p-3 bg-gray-700 rounded-md border border-gray-600">
                    <h5 className="text-white font-medium mb-2">AI Response:</h5>
                    <ul className="space-y-2">
                        {queryResults.map((result, index) => (
                            <li key={index} className="text-sm text-gray-300">
                                <span className="text-blue-400">»</span> {result}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </Card>
    );
};

// AI Insights Preferences Manager (new)
export const AIInsightsPreferenceManager: React.FC<{
    currentPreferences: {
        insightTypes: string[];
        urgencyThreshold: string;
        dataSources: string[];
        realtimeUpdates: boolean;
        explanationLevel: 'none' | 'basic' | 'detailed';
        modelSelection: string;
    };
    onSavePreferences: (prefs: any) => void;
    availableInsightTypes: string[];
    availableDataSources: string[];
    availableModels: { id: string; name: string; version: string; description: string }[];
}> = ({ currentPreferences, onSavePreferences, availableInsightTypes, availableDataSources, availableModels }) => {
    const [prefs, setPrefs] = useState(currentPreferences);

    useEffect(() => {
        setPrefs(currentPreferences);
    }, [currentPreferences]);

    const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value, type, checked } = e.target as HTMLInputElement;
        if (name === 'insightTypes' || name === 'dataSources') {
            const valArray = Array.from((e.target as HTMLSelectElement).options)
                .filter(option => option.selected)
                .map(option => option.value);
            setPrefs(prev => ({ ...prev, [name]: valArray }));
        } else {
            setPrefs(prev => ({
                ...prev,
                [name]: type === 'checkbox' ? checked : value,
            }));
        }
    }, []);

    const handleSave = useCallback(() => {
        onSavePreferences(prefs);
    }, [prefs, onSavePreferences]);

    return (
        <Card title="AI Insights Preferences" className="mt-6 bg-gray-800 border border-gray-700">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-300">
                <div>
                    <label htmlFor="insightTypes" className="block text-sm font-medium text-white mb-1">Preferred Insight Types</label>
                    <select
                        multiple
                        id="insightTypes"
                        name="insightTypes"
                        value={prefs.insightTypes}
                        onChange={handleChange}
                        className="w-full p-2 bg-gray-700 text-white rounded-md border border-gray-600 focus:ring-blue-500 focus:border-blue-500 h-32"
                    >
                        {availableInsightTypes.map(type => (
                            <option key={type} value={type} className="capitalize">{type.replace(/([A-Z])/g, ' $1')}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label htmlFor="dataSources" className="block text-sm font-medium text-white mb-1">Included Data Sources</label>
                    <select
                        multiple
                        id="dataSources"
                        name="dataSources"
                        value={prefs.dataSources}
                        onChange={handleChange}
                        className="w-full p-2 bg-gray-700 text-white rounded-md border border-gray-600 focus:ring-blue-500 focus:border-blue-500 h-32"
                    >
                        {availableDataSources.map(source => (
                            <option key={source} value={source}>{source}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label htmlFor="urgencyThreshold" className="block text-sm font-medium text-white mb-1">Minimum Urgency Threshold</label>
                    <select
                        id="urgencyThreshold"
                        name="urgencyThreshold"
                        value={prefs.urgencyThreshold}
                        onChange={handleChange}
                        className="w-full p-2 bg-gray-700 text-white rounded-md border border-gray-600 focus:ring-blue-500 focus:border-blue-500"
                    >
                        <option value="informational">Informational</option>
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                        <option value="critical">Critical</option>
                    </select>
                </div>
                <div>
                    <label htmlFor="explanationLevel" className="block text-sm font-medium text-white mb-1">Explanation Level (XAI)</label>
                    <select
                        id="explanationLevel"
                        name="explanationLevel"
                        value={prefs.explanationLevel}
                        onChange={handleChange}
                        className="w-full p-2 bg-gray-700 text-white rounded-md border border-gray-600 focus:ring-blue-500 focus:border-blue-500"
                    >
                        <option value="none">None</option>
                        <option value="basic">Basic</option>
                        <option value="detailed">Detailed</option>
                    </select>
                </div>
                <div className="flex items-center">
                    <input
                        type="checkbox"
                        id="realtimeUpdates"
                        name="realtimeUpdates"
                        checked={prefs.realtimeUpdates}
                        onChange={handleChange}
                        className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <label htmlFor="realtimeUpdates" className="ml-2 block text-sm text-white">Enable Real-time Updates</label>
                </div>
                <div>
                    <label htmlFor="modelSelection" className="block text-sm font-medium text-white mb-1">AI Model Version</label>
                    <select
                        id="modelSelection"
                        name="modelSelection"
                        value={prefs.modelSelection}
                        onChange={handleChange}
                        className="w-full p-2 bg-gray-700 text-white rounded-md border border-gray-600 focus:ring-blue-500 focus:border-blue-500"
                    >
                        {availableModels.map(model => (
                            <option key={model.id} value={model.id}>{model.name} (v{model.version})</option>
                        ))}
                    </select>
                    <p className="text-xs text-gray-400 mt-1">
                        <span className="font-semibold">{availableModels.find(m => m.id === prefs.modelSelection)?.name || 'N/A'} (v{availableModels.find(m => m.id === prefs.modelSelection)?.version || 'N/A'}):</span>
                        {availableModels.find(m => m.id === prefs.modelSelection)?.description || 'No description available.'}
                    </p>
                </div>
            </div>
            <button
                className="mt-6 px-5 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md text-sm transition-colors"
                onClick={handleSave}
            >
                Save Preferences
            </button>
        </Card>
    );
};

// AI System Health and Performance Monitor (new)
export const AIPerformanceDashboard: React.FC<{
    aiSystemStatus: 'operational' | 'degraded' | 'offline';
    lastHeartbeat: string;
    insightGenerationRate: number; // Insights per minute
    averageResponseTime: number; // ms
    dataProcessingVolume: number; // GB/hour
    modelAccuracyHistory: { timestamp: string; accuracy: number }[];
    resourceUtilization: { cpu: number; memory: number; gpu?: number }; // %
}> = ({ aiSystemStatus, lastHeartbeat, insightGenerationRate, averageResponseTime, dataProcessingVolume, modelAccuracyHistory, resourceUtilization }) => {
    const statusColor = useMemo(() => {
        switch (aiSystemStatus) {
            case 'operational': return 'bg-green-500';
            case 'degraded': return 'bg-yellow-500';
            case 'offline': return 'bg-red-500';
            default: return 'bg-gray-500';
        }
    }, [aiSystemStatus]);

    const latestAccuracy = useMemo(() => modelAccuracyHistory[modelAccuracyHistory.length - 1]?.accuracy || 0, [modelAccuracyHistory]);

    return (
        <Card title="AI System Performance" className="mt-6 bg-gray-800 border border-gray-700">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-gray-300 text-sm">
                <div className="p-3 bg-gray-700 rounded-md">
                    <p className="font-medium text-white">System Status:</p>
                    <div className="flex items-center gap-2 mt-1">
                        <div className={`w-3 h-3 rounded-full ${statusColor}`}></div>
                        <span className="capitalize">{aiSystemStatus}</span>
                    </div>
                    <p className="text-xs text-gray-400 mt-1">Last Heartbeat: {new Date(lastHeartbeat).toLocaleString()}</p>
                </div>
                <div className="p-3 bg-gray-700 rounded-md">
                    <p className="font-medium text-white">Insight Generation Rate:</p>
                    <p className="text-xl mt-1">{insightGenerationRate.toFixed(1)} <span className="text-gray-400 text-sm">insights/min</span></p>
                </div>
                <div className="p-3 bg-gray-700 rounded-md">
                    <p className="font-medium text-white">Avg. Response Time:</p>
                    <p className="text-xl mt-1">{averageResponseTime.toFixed(0)} <span className="text-gray-400 text-sm">ms</span></p>
                </div>
                <div className="p-3 bg-gray-700 rounded-md">
                    <p className="font-medium text-white">Data Processing Volume:</p>
                    <p className="text-xl mt-1">{dataProcessingVolume.toFixed(2)} <span className="text-gray-400 text-sm">GB/hour</span></p>
                </div>
                <div className="p-3 bg-gray-700 rounded-md">
                    <p className="font-medium text-white">Model Accuracy:</p>
                    <p className="text-xl mt-1">{latestAccuracy.toFixed(2)}%</p>
                    <div className="w-full bg-gray-600 rounded-full h-2 mt-1">
                        <div className="h-2 rounded-full bg-purple-500" style={{ width: `${latestAccuracy}%` }}></div>
                    </div>
                    <p className="text-xs text-gray-400 mt-1">Trend analysis available...</p>
                </div>
                <div className="p-3 bg-gray-700 rounded-md">
                    <p className="font-medium text-white">Resource Utilization:</p>
                    <p className="mt-1">CPU: {resourceUtilization.cpu.toFixed(1)}%</p>
                    <div className="w-full bg-gray-600 rounded-full h-2">
                        <div className="h-2 rounded-full bg-red-500" style={{ width: `${resourceUtilization.cpu}%` }}></div>
                    </div>
                    <p className="mt-1">Memory: {resourceUtilization.memory.toFixed(1)}%</p>
                    <div className="w-full bg-gray-600 rounded-full h-2">
                        <div className="h-2 rounded-full bg-blue-500" style={{ width: `${resourceUtilization.memory}%` }}></div>
                    </div>
                    {resourceUtilization.gpu && (
                        <>
                            <p className="mt-1">GPU: {resourceUtilization.gpu.toFixed(1)}%</p>
                            <div className="w-full bg-gray-600 rounded-full h-2">
                                <div className="h-2 rounded-full bg-green-500" style={{ width: `${resourceUtilization.gpu}%` }}></div>
                            </div>
                        </>
                    )}
                </div>
            </div>
            <p className="text-xs text-gray-500 mt-4">Real-time telemetry streams into the Quantum AI Observability Platform. Anomalies automatically alert designated teams.</p>
        </Card>
    );
};

// HistoricalInsightArchive: For searching and reviewing past insights
export const HistoricalInsightArchive: React.FC<{
    historicalInsights: ExtendedAIInsight[];
    onSearch: (query: string, filters: any) => void;
    isLoading: boolean;
    totalResults: number;
}> = ({ historicalInsights, onSearch, isLoading, totalResults }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filters, setFilters] = useState({ type: 'all', urgency: 'all', status: 'all', startDate: '', endDate: '' });

    const handleFilterChange = useCallback((e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
    }, []);

    const handleSearch = useCallback((e: React.FormEvent) => {
        e.preventDefault();
        onSearch(searchTerm, filters);
    }, [searchTerm, filters, onSearch]);

    return (
        <Card title="Historical Insight Archive" className="mt-6 bg-gray-800 border border-gray-700">
            <form onSubmit={handleSearch} className="mb-4 space-y-3">
                <input
                    type="text"
                    className="w-full p-2 bg-gray-700 text-white rounded-md border border-gray-600 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Search insight titles, descriptions, or explanations..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    disabled={isLoading}
                />
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm text-gray-300">
                    <div>
                        <label className="block mb-1">Type:</label>
                        <select name="type" value={filters.type} onChange={handleFilterChange} className="w-full p-2 bg-gray-700 rounded-md border border-gray-600">
                            <option value="all">All</option>
                            {Object.keys(InsightTypeIconMap).map(type => (
                                <option key={type} value={type} className="capitalize">{type.replace(/([A-Z])/g, ' $1')}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block mb-1">Urgency:</label>
                        <select name="urgency" value={filters.urgency} onChange={handleFilterChange} className="w-full p-2 bg-gray-700 rounded-md border border-gray-600">
                            <option value="all">All</option>
                            <option value="critical">Critical</option>
                            <option value="high">High</option>
                            <option value="medium">Medium</option>
                            <option value="low">Low</option>
                            <option value="informational">Informational</option>
                        </select>
                    </div>
                    <div>
                        <label className="block mb-1">Status:</label>
                        <select name="status" value={filters.status} onChange={handleFilterChange} className="w-full p-2 bg-gray-700 rounded-md border border-gray-600">
                            <option value="all">All</option>
                            <option value="active">Active</option>
                            <option value="resolved">Resolved</option>
                            <option value="dismissed">Dismissed</option>
                            <option value="archived">Archived</option>
                        </select>
                    </div>
                    <div>
                        <label className="block mb-1">Date Range:</label>
                        <div className="flex gap-1">
                            <input type="date" name="startDate" value={filters.startDate} onChange={handleFilterChange} className="w-1/2 p-2 bg-gray-700 rounded-md border border-gray-600" />
                            <input type="date" name="endDate" value={filters.endDate} onChange={handleFilterChange} className="w-1/2 p-2 bg-gray-700 rounded-md border border-gray-600" />
                        </div>
                    </div>
                </div>
                <button
                    type="submit"
                    className="w-full px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={isLoading}
                >
                    {isLoading ? 'Searching...' : `Search Archive (${totalResults} results)`}
                </button>
            </form>

            {isLoading ? (
                <div className="text-center text-gray-400 py-8">Accessing the Chronos Insight Vault...</div>
            ) : (
                <ul className="space-y-4 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
                    {historicalInsights.length === 0 ? (
                        <li className="text-center text-gray-400">No historical insights found matching your criteria.</li>
                    ) : (
                        historicalInsights.map(insight => (
                            <InsightDetailCard key={insight.id} insight={insight} />
                        ))
                    )}
                </ul>
            )}
        </Card>
    );
};

// Insight Timeline: Visualize insights over time
export const InsightTimeline: React.FC<{ insights: ExtendedAIInsight[] }> = ({ insights }) => {
    const sortedInsights = useMemo(() =>
        [...insights].sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()),
        [insights]
    );

    if (sortedInsights.length === 0) {
        return <Card title="Insight Timeline" className="mt-6 bg-gray-800 border border-gray-700"><div className="text-center text-gray-400 py-4">No insights to display on the timeline.</div></Card>;
    }

    return (
        <Card title="Insight Timeline (Temporal View)" className="mt-6 bg-gray-800 border border-gray-700">
            <div className="relative border-l-2 border-blue-500 pl-6 pb-6 pt-2">
                {sortedInsights.map((insight, index) => (
                    <div key={insight.id} className="mb-8 relative">
                        <div className="absolute -left-3.5 -top-1.5 w-7 h-7 bg-blue-700 rounded-full flex items-center justify-center text-white text-sm border-2 border-blue-500">
                            {InsightTypeIconMap[insight.type] || '❓'}
                        </div>
                        <div className="ml-0 p-3 bg-gray-700 rounded-lg shadow-md border border-gray-600">
                            <p className="text-xs text-gray-400 mb-1">{new Date(insight.timestamp).toLocaleString()}</p>
                            <p className="font-semibold text-white">{insight.title}</p>
                            <p className="text-sm text-gray-300">{insight.description}</p>
                            <div className="mt-2 flex items-center gap-2">
                                <UrgencyIndicator urgency={insight.urgency} />
                                <span className={`capitalize text-xs px-2 py-0.5 rounded-full ${insight.status === 'active' ? 'bg-green-600' : 'bg-gray-500'}`}>{insight.status}</span>
                                <span className="text-xs text-blue-400">{insight.source}</span>
                            </div>
                            {insight.recommendedActions && insight.recommendedActions.length > 0 && (
                                <div className="mt-2 text-xs text-gray-400 italic">
                                    {insight.recommendedActions.length} action{insight.recommendedActions.length > 1 ? 's' : ''} recommended.
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
            <p className="text-xs text-gray-500 mt-4">Powered by Chronos Temporal Analysis Engine.</p>
        </Card>
    );
};

// AI Collaboration Hub: Share and annotate insights
export const CollaborativeAnnotationModule: React.FC<{
    insights: ExtendedAIInsight[];
    users: { id: string; name: string; avatar: string }[];
    onAddComment: (insightId: string, userId: string, comment: string) => void;
    onAssignInsight: (insightId: string, userId: string) => void;
}> = ({ insights, users, onAddComment, onAssignInsight }) => {
    const [selectedInsightId, setSelectedInsightId] = useState<string | null>(null);
    const [newComment, setNewComment] = useState('');
    const [assignedUserId, setAssignedUserId] = useState<string>('');
    const currentUser = { id: 'user-123', name: 'You (AI Lead)', avatar: 'https://i.pravatar.cc/30?img=6' }; // Mock current user

    const selectedInsight = useMemo(() => insights.find(i => i.id === selectedInsightId), [insights, selectedInsightId]);

    const handleAddComment = useCallback(() => {
        if (selectedInsightId && newComment.trim()) {
            onAddComment(selectedInsightId, currentUser.id, newComment.trim());
            setNewComment('');
        }
    }, [selectedInsightId, newComment, onAddComment, currentUser.id]);

    const handleAssign = useCallback(() => {
        if (selectedInsightId && assignedUserId) {
            onAssignInsight(selectedInsightId, assignedUserId);
        }
    }, [selectedInsightId, assignedUserId, onAssignInsight]);

    return (
        <Card title="AI Collaboration Hub" className="mt-6 bg-gray-800 border border-gray-700">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-1 border-r border-gray-700 pr-4">
                    <h5 className="text-white font-medium mb-3">Insights for Review</h5>
                    <ul className="space-y-2 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
                        {insights.map(insight => (
                            <li
                                key={insight.id}
                                className={`p-3 rounded-lg cursor-pointer transition-colors ${selectedInsightId === insight.id ? 'bg-blue-800 border border-blue-600' : 'bg-gray-700 hover:bg-gray-600'}`}
                                onClick={() => setSelectedInsightId(insight.id)}
                            >
                                <div className="flex items-center gap-2">
                                    <UrgencyIndicator urgency={insight.urgency} />
                                    <span className="font-semibold text-white text-sm">{insight.title}</span>
                                </div>
                                <p className="text-xs text-gray-400 mt-1">Source: {insight.source} | {new Date(insight.timestamp).toLocaleDateString()}</p>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="md:col-span-2">
                    {selectedInsight ? (
                        <div>
                            <h5 className="text-white font-medium text-lg mb-2">{selectedInsight.title}</h5>
                            <p className="text-sm text-gray-300 mb-4">{selectedInsight.description}</p>

                            <div className="mb-6">
                                <h6 className="text-blue-300 text-sm font-medium mb-2">Assignments</h6>
                                <div className="flex items-center gap-2">
                                    <select
                                        value={assignedUserId}
                                        onChange={(e) => setAssignedUserId(e.target.value)}
                                        className="p-2 bg-gray-700 text-white rounded-md border border-gray-600 text-sm flex-grow"
                                    >
                                        <option value="">Assign to...</option>
                                        {users.map(user => (
                                            <option key={user.id} value={user.id}>{user.name}</option>
                                        ))}
                                    </select>
                                    <button
                                        onClick={handleAssign}
                                        className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm disabled:opacity-50"
                                        disabled={!assignedUserId}
                                    >
                                        Assign
                                    </button>
                                </div>
                                {selectedInsight.relatedEntities?.filter(e => e.type === 'user').map(assigned => (
                                    <p key={assigned.id} className="text-xs text-gray-400 mt-1">Assigned to: {assigned.name}</p>
                                ))}
                            </div>

                            <h6 className="text-blue-300 text-sm font-medium mb-2">Discussion Thread</h6>
                            <div className="max-h-60 overflow-y-auto pr-2 custom-scrollbar bg-gray-700 p-3 rounded-md mb-4 space-y-3">
                                {selectedInsight.feedback?.filter(f => f.comment && f.comment !== '')
                                    .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
                                    .map((f, i) => (
                                        <div key={i} className="flex items-start gap-2">
                                            <img src={`https://i.pravatar.cc/30?img=${i + 1}`} alt="User Avatar" className="w-8 h-8 rounded-full" />
                                            <div>
                                                <p className="font-semibold text-white text-sm">{users.find(u => u.id === 'user-123')?.name || 'Anonymous'}</p> {/* Mock user mapping */}
                                                <p className="text-xs text-gray-400">{f.comment}</p>
                                                <p className="text-xxs text-gray-500 mt-1">{new Date(f.timestamp).toLocaleString()}</p>
                                            </div>
                                        </div>
                                    )) || <p className="text-center text-gray-400">No comments yet. Start the discussion!</p>}
                            </div>

                            <div className="flex gap-2">
                                <textarea
                                    value={newComment}
                                    onChange={(e) => setNewComment(e.target.value)}
                                    className="flex-grow p-2 bg-gray-700 text-white rounded-md border border-gray-600 focus:ring-blue-500 focus:border-blue-500 text-sm"
                                    placeholder="Add a comment..."
                                    rows={2}
                                />
                                <button
                                    onClick={handleAddComment}
                                    className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md text-sm self-end disabled:opacity-50"
                                    disabled={!newComment.trim()}
                                >
                                    Post
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center text-gray-400 py-10">Select an insight to view collaboration details.</div>
                    )}
                </div>
            </div>
            <p className="text-xs text-gray-500 mt-4">Nexus Collaboration Engine streamlines multi-expert insight analysis and workflow integration.</p>
        </Card>
    );
};


//endregion

//region Main AIInsights Component (Expanded)
const AIInsights: React.FC = () => {
    const context = useContext(DataContext);
    if (!context) return <div>Loading AI Context...</div>;

    const {
        aiInsights, isInsightsLoading, generateDashboardInsights,
        // Expanded context capabilities (conceptual, assume DataContext handles these)
        dismissInsight, markInsightAsActioned, provideInsightFeedback,
        submitAIQuery, aiQueryResults, isQueryingAI,
        aiPreferences, updateAIPreferences,
        aiSystemStatus, aiPerformanceMetrics,
        fetchHistoricalInsights, historicalInsights, isHistoricalInsightsLoading, historicalInsightTotal,
        addInsightComment, assignInsight,
        availableInsightTypes, availableDataSources, availableAIModels,
    } = context;

    const [activeTab, setActiveTab] = useState<'current' | 'preferences' | 'performance' | 'archive' | 'timeline' | 'collaborate'>('current');
    const [mockAiQueryResults, setMockAiQueryResults] = useState<string[]>([]);
    const [isMockQuerying, setIsMockQuerying] = useState(false);
    const [mockHistoricalInsights, setMockHistoricalInsights] = useState<ExtendedAIInsight[]>([]);
    const [mockHistoricalTotal, setMockHistoricalTotal] = useState(0);
    const [isMockHistoricalLoading, setIsMockHistoricalLoading] = useState(false);

    // Mock functions for features not fully implemented in DataContext
    const mockSubmitAIQuery = useCallback((query: string) => {
        setIsMockQuerying(true);
        setMockAiQueryResults([]);
        setTimeout(() => {
            const mockResponse = `Based on your query "${query}", the AI suggests: Key trends indicate a 15% growth in Q3. Consider reallocating resources to high-performing regions.`;
            setMockAiQueryResults([mockResponse]);
            setIsMockQuerying(false);
        }, 2000);
    }, []);

    const mockFetchHistoricalInsights = useCallback((query: string, filters: any) => {
        setIsMockHistoricalLoading(true);
        setMockHistoricalInsights([]);
        setTimeout(() => {
            const filtered = aiInsights.filter(insight => {
                const matchesSearch = !query || insight.title.toLowerCase().includes(query.toLowerCase()) || insight.description.toLowerCase().includes(query.toLowerCase()) || (insight.explanation?.toLowerCase().includes(query.toLowerCase()));
                const matchesType = filters.type === 'all' || insight.type === filters.type;
                const matchesUrgency = filters.urgency === 'all' || insight.urgency === filters.urgency;
                const matchesStatus = filters.status === 'all' || insight.status === filters.status;
                const insightDate = new Date(insight.timestamp).getTime();
                const startDate = filters.startDate ? new Date(filters.startDate).getTime() : 0;
                const endDate = filters.endDate ? new Date(filters.endDate).getTime() : Infinity;
                const matchesDate = insightDate >= startDate && insightDate <= endDate;
                return matchesSearch && matchesType && matchesUrgency && matchesStatus && matchesDate;
            });
            setMockHistoricalInsights(filtered);
            setMockHistoricalTotal(filtered.length);
            setIsMockHistoricalLoading(false);
        }, 1500);
    }, [aiInsights]);


    const mockUpdateAIPreferences = useCallback((newPrefs: any) => {
        console.log("Saving new AI preferences:", newPrefs);
        // In a real app, this would call DataContext.updateAIPreferences
        // For now, we'll just log and assume success.
        alert('AI Preferences updated successfully! (Mock)');
    }, []);

    const mockProvideInsightFeedback = useCallback((insightId: string, rating: number, comment: string) => {
        console.log(`Feedback for ${insightId}: Rating=${rating}, Comment="${comment}"`);
        // In a real app, this would call DataContext.provideInsightFeedback
        // For now, it just logs.
    }, []);

    const mockAddInsightComment = useCallback((insightId: string, userId: string, comment: string) => {
        console.log(`User ${userId} commented on ${insightId}: "${comment}"`);
        // Mocking the addition to an insight's feedback array
        // In a real app, DataContext.addInsightComment would handle this,
        // causing a re-render of aiInsights and thus this component.
    }, []);

    const mockAssignInsight = useCallback((insightId: string, userId: string) => {
        console.log(`Insight ${insightId} assigned to user ${userId}`);
        // Similar to addInsightComment, this would update aiInsights in DataContext
    }, []);


    // Initial insight generation on component mount
    useEffect(() => {
        if (aiInsights.length === 0 && !isInsightsLoading) {
            generateDashboardInsights();
        }
    }, [aiInsights.length, isInsightsLoading, generateDashboardInsights]);

    // Mock data for AI Performance Dashboard
    const mockAiPerformanceMetrics = useMemo(() => ({
        lastHeartbeat: new Date().toISOString(),
        insightGenerationRate: 15.3,
        averageResponseTime: 120,
        dataProcessingVolume: 5.8,
        modelAccuracyHistory: [
            { timestamp: new Date(Date.now() - 3600000).toISOString(), accuracy: 88.5 },
            { timestamp: new Date(Date.now() - 1800000).toISOString(), accuracy: 89.1 },
            { timestamp: new Date().toISOString(), accuracy: 90.2 },
        ],
        resourceUtilization: { cpu: 75.2, memory: 45.1, gpu: 88.9 },
    }), []);

    // Mock available models and users for Collaboration Hub
    const mockAvailableAIModels = useMemo(() => [
        { id: 'quantum-v3.2', name: 'Quantum Core', version: '3.2', description: 'Advanced general intelligence model with enhanced predictive capabilities.' },
        { id: 'symphony-v1.1', name: 'Symphony-XAI', version: '1.1', description: 'Specialized model for explainable AI, providing detailed reasoning for insights.' },
        { id: 'chronos-v2.0', name: 'Chronos-Temporal', version: '2.0', description: 'Optimized for real-time anomaly detection and temporal forecasting.' },
    ], []);

    const mockCollaborationUsers = useMemo(() => [
        { id: 'user-123', name: 'You (AI Lead)', avatar: 'https://i.pravatar.cc/30?img=6' },
        { id: 'user-456', name: 'Dr. Evelyn Reed (Data Scientist)', avatar: 'https://i.pravatar.cc/30?img=12' },
        { id: 'user-789', name: 'Mr. Alex Chen (Operations Manager)', avatar: 'https://i.pravatar.cc/30?img=22' },
        { id: 'user-101', name: 'Ms. Sarah Miller (Marketing Analyst)', avatar: 'https://i.pravatar.cc/30?img=34' },
    ], []);

    const mockAvailableInsightTypes = useMemo(() => Object.keys(InsightTypeIconMap), []);
    const mockAvailableDataSources = useMemo(() => ['Sales Data', 'Marketing Analytics', 'Customer Support Logs', 'IoT Sensor Data', 'Financial Reports', 'Social Media Feeds'], []);
    const mockAIPreferences = useMemo(() => ({
        insightTypes: ['predictive', 'actionable', 'anomaly'],
        urgencyThreshold: 'medium',
        dataSources: ['Sales Data', 'Marketing Analytics'],
        realtimeUpdates: true,
        explanationLevel: 'detailed',
        modelSelection: 'quantum-v3.2',
    }), []);


    return (
        <div className="p-6 bg-gray-900 min-h-screen text-gray-100">
            <h1 className="text-4xl font-bold mb-8 text-blue-400">Quantum AI Insights Core</h1>
            <p className="text-lg text-gray-300 mb-8">
                The nerve center of your data universe. Quantum AI constantly monitors, analyzes, and predicts, surfacing critical intelligence and actionable recommendations to drive unparalleled efficiency and innovation. This dashboard represents a decade of evolutionary upgrades, incorporating multi-modal AI, XAI, ethical review, and collaborative intelligence.
            </p>

            {/* Navigation Tabs */}
            <div className="mb-6 border-b border-gray-700">
                <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                    <button
                        onClick={() => setActiveTab('current')}
                        className={`whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${activeTab === 'current' ? 'border-blue-500 text-blue-300' : 'border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-300'}`}
                    >
                        Current Insights
                    </button>
                    <button
                        onClick={() => setActiveTab('timeline')}
                        className={`whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${activeTab === 'timeline' ? 'border-blue-500 text-blue-300' : 'border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-300'}`}
                    >
                        Timeline View
                    </button>
                    <button
                        onClick={() => setActiveTab('archive')}
                        className={`whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${activeTab === 'archive' ? 'border-blue-500 text-blue-300' : 'border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-300'}`}
                    >
                        Archive
                    </button>
                    <button
                        onClick={() => setActiveTab('collaborate')}
                        className={`whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${activeTab === 'collaborate' ? 'border-blue-500 text-blue-300' : 'border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-300'}`}
                    >
                        Collaboration Hub
                    </button>
                    <button
                        onClick={() => setActiveTab('preferences')}
                        className={`whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${activeTab === 'preferences' ? 'border-blue-500 text-blue-300' : 'border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-300'}`}
                    >
                        Preferences
                    </button>
                    <button
                        onClick={() => setActiveTab('performance')}
                        className={`whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${activeTab === 'performance' ? 'border-blue-500 text-blue-300' : 'border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-200'}`}
                    >
                        AI Performance
                    </button>
                </nav>
            </div>

            {/* Tab Content */}
            <div>
                {activeTab === 'current' && (
                    <>
                        <Card title="Current AI Insights" className="bg-gray-800 border border-gray-700">
                            {isInsightsLoading ? (
                                <div className="text-center text-gray-400 py-8">Quantum is analyzing your data in real-time. Please stand by for intelligence drop...</div>
                            ) : (
                                <ul className="space-y-4">
                                    {aiInsights.length === 0 ? (
                                        <li className="text-center text-gray-400 py-4">No active insights at the moment. All systems nominal.</li>
                                    ) : (
                                        aiInsights.map((insight: ExtendedAIInsight) => (
                                            <div key={insight.id}>
                                                <InsightDetailCard insight={insight} />
                                                <InsightFeedbackModule
                                                    insightId={insight.id}
                                                    onFeedbackSubmit={provideInsightFeedback || mockProvideInsightFeedback}
                                                />
                                            </div>
                                        ))
                                    )}
                                </ul>
                            )}
                        </Card>
                        <InsightQueryInterface
                            onQuerySubmit={submitAIQuery || mockSubmitAIQuery}
                            isLoading={isQueryingAI || isMockQuerying}
                            queryResults={aiQueryResults || mockAiQueryResults}
                        />
                    </>
                )}

                {activeTab === 'timeline' && (
                    <InsightTimeline insights={aiInsights as ExtendedAIInsight[]} />
                )}

                {activeTab === 'archive' && (
                    <HistoricalInsightArchive
                        historicalInsights={historicalInsights || mockHistoricalInsights}
                        onSearch={fetchHistoricalInsights || mockFetchHistoricalInsights}
                        isLoading={isHistoricalInsightsLoading || isMockHistoricalLoading}
                        totalResults={historicalInsightTotal || mockHistoricalTotal}
                    />
                )}

                {activeTab === 'collaborate' && (
                    <CollaborativeAnnotationModule
                        insights={aiInsights as ExtendedAIInsight[]}
                        users={mockCollaborationUsers}
                        onAddComment={addInsightComment || mockAddInsightComment}
                        onAssignInsight={assignInsight || mockAssignInsight}
                    />
                )}

                {activeTab === 'preferences' && (
                    <AIInsightsPreferenceManager
                        currentPreferences={aiPreferences || mockAIPreferences}
                        onSavePreferences={updateAIPreferences || mockUpdateAIPreferences}
                        availableInsightTypes={availableInsightTypes || mockAvailableInsightTypes}
                        availableDataSources={availableDataSources || mockAvailableDataSources}
                        availableModels={availableAIModels || mockAvailableAIModels}
                    />
                )}

                {activeTab === 'performance' && (
                    <AIPerformanceDashboard
                        aiSystemStatus={aiSystemStatus || 'operational'} // Mock if not in context
                        lastHeartbeat={aiPerformanceMetrics?.lastHeartbeat || mockAiPerformanceMetrics.lastHeartbeat}
                        insightGenerationRate={aiPerformanceMetrics?.insightGenerationRate || mockAiPerformanceMetrics.insightGenerationRate}
                        averageResponseTime={aiPerformanceMetrics?.averageResponseTime || mockAiPerformanceMetrics.averageResponseTime}
                        dataProcessingVolume={aiPerformanceMetrics?.dataProcessingVolume || mockAiPerformanceMetrics.dataProcessingVolume}
                        modelAccuracyHistory={aiPerformanceMetrics?.modelAccuracyHistory || mockAiPerformanceMetrics.modelAccuracyHistory}
                        resourceUtilization={aiPerformanceMetrics?.resourceUtilization || mockAiPerformanceMetrics.resourceUtilization}
                    />
                )}
            </div>
        </div>
    );
};

export default AIInsights;
//endregion

================================================================================
// APPENDED FROM REPO: diplomat-bit/Fuckyou | ORIGINAL PATH: diplomat-bit-Fuckyou-70f83c5/components/AIInsights.tsx
================================================================================

import React, { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import { 
    BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, Cell, 
    LineChart, Line, CartesianGrid, AreaChart, Area, PieChart, Pie 
} from 'recharts';

/**
 * QUANTUM FINANCIAL - ELITE BUSINESS DEMO ENGINE
 * VERSION: 4.0.0 "GOLDEN TICKET"
 * 
 * PHILOSOPHY: 
 * - High-Performance, Secure, Professional.
 * - "Kick the tires" - Full interactive simulation.
 * - Generative AI Integration (Backend Proxied).
 * - Audit-First Architecture.
 */

// --- TYPES & INTERFACES ---

export interface AuditEntry {
    id: string;
    timestamp: string;
    action: string;
    actor: string;
    severity: 'INFO' | 'WARN' | 'CRITICAL';
    details: string;
    checksum: string; // Simulated cryptographic link
}

export interface EnhancedAIInsight {
    id: string;
    title: string;
    description: string;
    urgency: 'low' | 'medium' | 'high';
    confidenceScore: number;
    actionable: boolean;
    actionType: 'rebalance_portfolio' | 'set_stop_loss' | 'execute_trade' | 'liquidity_provision' | 'wire_transfer' | 'fraud_alert';
    details?: any;
    tags: string[];
    geinFactor: number;
    riskAnalysis: {
        volatilityIndex: number;
        sharpeRatio: number;
        maxDrawdown: number;
    };
    backtestData: { name: string; value: number }[];
    alternativeActions: {
        actionType: string;
        rationale: string;
        confidence: number;
    }[];
}

// --- AUDIT LOGGING SYSTEM ---
const useAuditLogger = () => {
    const [logs, setLogs] = useState<AuditEntry[]>(() => [
        {
            id: 'LOG-INIT001',
            timestamp: new Date(Date.now() - 60000 * 5).toISOString(),
            action: 'SYSTEM_BOOT',
            actor: 'SYSTEM_KERNEL',
            severity: 'INFO',
            details: 'Quantum Financial Engine v4.0.0 initialized successfully.',
            checksum: 'a1b2c3d4'
        },
        {
            id: 'LOG-INIT002',
            timestamp: new Date(Date.now() - 60000 * 4).toISOString(),
            action: 'SECURE_NODE_CONNECT',
            actor: 'SYSTEM_AUTH_USER_01',
            severity: 'INFO',
            details: 'Connected to secure node 0x4F2 (Frankfurt).',
            checksum: 'e5f6g7h8'
        },
        {
            id: 'LOG-INIT003',
            timestamp: new Date(Date.now() - 60000 * 3).toISOString(),
            action: 'MFA_VERIFICATION',
            actor: 'SYSTEM_AUTH_USER_01',
            severity: 'INFO',
            details: 'Multi-factor authentication verified successfully.',
            checksum: 'i9j0k1l2'
        }
    ]);
    
    const logAction = useCallback((action: string, details: string, severity: AuditEntry['severity'] = 'INFO') => {
        const newEntry: AuditEntry = {
            id: `LOG-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
            timestamp: new Date().toISOString(),
            action,
            actor: 'SYSTEM_AUTH_USER_01',
            severity,
            details,
            checksum: Math.random().toString(16).slice(2)
        };
        setLogs(prev => [newEntry, ...prev].slice(0, 100));
    }, []);

    return { logs, logAction };
};

// --- ICONS ---

const BoltIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5.2a1 1 0 01-1.17.986l-3.2-1.1a1 1 0 00-1.26.95l.5 3.5a1 1 0 01-.45.95l-2.7 2.1a1 1 0 00-.55 1.34l3.2 5.9a1 1 0 01.05.52 1 1 0 01-1.6 1.04l-1.4-1.4a1 1 0 00-1.4 1.4l1.4 1.4a3 3 0 004.2 0l9.4-9.4a1 1 0 01-.1-1.5l-5.9-3.2a1 1 0 01-.5-.05l-3.5-.5a1 1 0 00-.95 1.26l1.1 3.2A1 1 0 018.8 11V2a1 1 0 011.3-.954z" clipRule="evenodd" />
    </svg>
);

const ShieldIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
);

const ChatIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
    </svg>
);

// --- COMPONENTS ---

const Card: React.FC<{ 
    title: React.ReactNode; 
    children: React.ReactNode; 
    className?: string; 
    icon?: React.ReactNode;
    bodyClassName?: string;
    action?: React.ReactNode;
}> = ({ title, children, className = '', icon, bodyClassName = 'p-6', action }) => (
    <div className={`bg-gray-900/80 backdrop-blur-md border border-gray-800 rounded-xl overflow-hidden shadow-2xl flex flex-col ${className}`}>
        <div className="px-6 py-4 border-b border-gray-800 flex items-center justify-between bg-gradient-to-r from-gray-900 to-gray-800 shrink-0">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
                {icon} {title}
            </h3>
            {action ? action : (
                <div className="flex gap-1">
                    <div className="w-2 h-2 rounded-full bg-red-500/50"></div>
                    <div className="w-2 h-2 rounded-full bg-yellow-500/50"></div>
                    <div className="w-2 h-2 rounded-full bg-green-500/50"></div>
                </div>
            )}
        </div>
        <div className={`flex-1 ${bodyClassName}`}>{children}</div>
    </div>
);

// --- AI CHATBOT ENGINE ---

const QuantumChat: React.FC<{ onAction: (action: string, data: any) => void }> = ({ onAction }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<{ role: 'user' | 'ai'; content: string }[]>([
        { role: 'ai', content: "Welcome to Quantum Financial. I am your AI co-pilot. Think of this as the cockpit of a high-performance vehicle. How can I help you navigate your global finances today?" }
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim()) return;
        const userMsg = input;
        setInput('');
        setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
        setIsTyping(true);

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: userMsg })
            });

            if (!response.ok) throw new Error('API Error');

            const data = await response.json();
            const text = data.response || data.text || data.reply || data.message || (typeof data === 'string' ? data : '');

            // Parse Action
            const actionMatch = text.match(/ACTION:\s*({.*})/);
            if (actionMatch) {
                try {
                    const actionData = JSON.parse(actionMatch[1]);
                    onAction(actionData.type, actionData);
                } catch (e) {
                    console.error("Failed to parse action JSON", e);
                }
            }

            setMessages(prev => [...prev, { role: 'ai', content: text.replace(/ACTION:\s*{.*}/, '') }]);
        } catch (error) {
            setMessages(prev => [...prev, { role: 'ai', content: "I apologize, but I'm experiencing a momentary synchronization delay with the global markets. Please try again." }]);
        } finally {
            setIsTyping(false);
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-[100]">
            {isOpen ? (
                <Card
                    title={<span className="text-sm tracking-widest uppercase text-cyan-400">Quantum AI Co-Pilot</span>}
                    icon={<div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>}
                    className="w-96 h-[500px] animate-in slide-in-from-bottom-10 duration-300"
                    bodyClassName="p-0 flex flex-col"
                    action={
                        <button onClick={() => setIsOpen(false)} className="text-gray-500 hover:text-white">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                    }
                >
                    <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
                        {messages.map((m, i) => (
                            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[80%] p-3 rounded-xl text-sm ${m.role === 'user' ? 'bg-cyan-600 text-white' : 'bg-gray-800 text-gray-300 border border-gray-700'}`}>
                                    {m.content}
                                </div>
                            </div>
                        ))}
                        {isTyping && <div className="text-xs text-cyan-500 animate-pulse">AI is calculating market vectors...</div>}
                    </div>
                    
                    {/* Quick Prompts */}
                    <div className="px-4 py-2 bg-gray-950 border-t border-gray-900 flex gap-2 overflow-x-auto shrink-0 custom-scrollbar">
                        {[
                            { label: 'Analyze Risk', text: 'Analyze current portfolio risk exposure.' },
                            { label: 'Trigger Wire', text: 'Initiate a wire transfer of $50,000 to SG-Global-Trade.' },
                            { label: 'Optimize Yield', text: 'What is the best yield optimization strategy right now?' }
                        ].map((p, idx) => (
                            <button
                                key={idx}
                                onClick={() => {
                                    setInput(p.text);
                                }}
                                className="shrink-0 px-2 py-1 bg-gray-900 hover:bg-gray-800 border border-gray-800 rounded text-[10px] text-cyan-400 font-medium transition-colors"
                            >
                                {p.label}
                            </button>
                        ))}
                    </div>

                    <div className="p-4 border-t border-gray-800 bg-gray-950 shrink-0">
                        <div className="flex gap-2">
                            <input 
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                                placeholder="Command the system..."
                                className="flex-1 bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500 transition-colors"
                            />
                            <button onClick={handleSend} className="bg-cyan-600 p-2 rounded-lg hover:bg-cyan-500">
                                <BoltIcon />
                            </button>
                        </div>
                    </div>
                </Card>
            ) : (
                <button 
                    onClick={() => setIsOpen(true)}
                    className="w-16 h-16 bg-cyan-600 rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-transform group"
                >
                    <div className="absolute inset-0 rounded-full bg-cyan-400 animate-ping opacity-20"></div>
                    <ChatIcon />
                </button>
            )}
        </div>
    );
};

// --- STRIPE SIMULATION MODAL ---

const StripeCheckoutModal: React.FC<{ amount: number; recipient: string; onClose: () => void; onComplete: () => void }> = ({ amount, recipient, onClose, onComplete }) => {
    const [step, setStep] = useState(1);
    const [isProcessing, setIsProcessing] = useState(false);

    const handlePay = () => {
        setIsProcessing(true);
        setTimeout(() => {
            setIsProcessing(false);
            setStep(2);
            onComplete();
        }, 2500);
    };

    return (
        <div className="fixed inset-0 bg-black/90 z-[110] flex items-center justify-center backdrop-blur-xl p-4">
            <Card
                title={<span className="text-indigo-400">Stripe Secure Payment</span>}
                icon={<ShieldIcon />}
                className="w-full max-w-md"
                action={
                    <button onClick={onClose} className="text-gray-500 hover:text-white">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                }
            >
                {step === 1 ? (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 text-gray-300">
                        <div className="mb-6">
                            <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Payment to</label>
                            <div className="text-lg font-semibold text-white">{recipient}</div>
                        </div>
                        <div className="mb-8">
                            <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Amount</label>
                            <div className="text-4xl font-black text-white">${amount.toLocaleString()}</div>
                        </div>
                        
                        <div className="space-y-4">
                            <div className="p-4 bg-gray-800 border border-gray-700 rounded-xl flex items-center gap-4">
                                <div className="w-12 h-8 bg-gray-900 rounded flex items-center justify-center font-bold text-[10px] text-white">VISA</div>
                                <div className="flex-1">
                                    <div className="text-sm font-medium text-white">•••• 4242</div>
                                    <div className="text-xs text-gray-400">Expires 12/28</div>
                                </div>
                            </div>
                            <button 
                                onClick={handlePay}
                                disabled={isProcessing}
                                className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-indigo-700 transition-all disabled:opacity-50 flex items-center justify-center gap-3"
                            >
                                {isProcessing ? (
                                    <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
                                ) : `Pay $${amount.toLocaleString()}`}
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-12 animate-in zoom-in duration-500 text-gray-300">
                        <div className="w-20 h-20 bg-green-900/30 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6 border border-green-500/30">
                            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                        </div>
                        <h2 className="text-2xl font-bold mb-2 text-white">Payment Successful</h2>
                        <p className="text-gray-500 mb-8">Transaction ID: ch_3N5k9L2eZvKYlo2C1</p>
                        <button onClick={onClose} className="w-full bg-gray-800 text-white py-4 rounded-xl font-bold hover:bg-gray-700">Return to Quantum</button>
                    </div>
                )}
                <div className="mt-6 pt-4 border-t border-gray-800 text-center text-[10px] text-gray-500 uppercase tracking-widest font-bold">
                    Secure Encrypted Transaction via Quantum Financial
                </div>
            </Card>
        </div>
    );
};

// --- MAIN COMPONENT ---

export const AIInsights: React.FC = () => {
    const { logs, logAction } = useAuditLogger();
    const [selectedInsight, setSelectedInsight] = useState<EnhancedAIInsight | null>(null);
    const [showStripe, setShowStripe] = useState(false);
    const [stripeData, setStripeData] = useState({ amount: 0, recipient: '' });
    const [filter, setFilter] = useState<'all' | 'high' | 'medium' | 'low'>('all');
    const [centerView, setCenterView] = useState<'performance' | 'allocation'>('performance');

    // Mock Data Generation
    const insights: EnhancedAIInsight[] = useMemo(() => [
        {
            id: 'ins_1',
            title: 'Anomalous Outflow Detected',
            description: 'A series of high-velocity transfers to a non-whitelisted entity in Singapore has been flagged by our neural monitors.',
            urgency: 'high',
            confidenceScore: 98,
            actionable: true,
            actionType: 'fraud_alert',
            details: { entity: 'SG-Global-Trade', amount: 1250000 },
            tags: ['Security', 'Fraud', 'Critical'],
            geinFactor: 0.99,
            riskAnalysis: { volatilityIndex: 88, sharpeRatio: 0.5, maxDrawdown: 40 },
            backtestData: Array.from({length: 20}, (_, i) => ({ name: `T-${20-i}`, value: 50 + Math.random() * 50 })),
            alternativeActions: [
                { actionType: 'freeze_account', rationale: 'Immediate cessation of all outbound liquidity.', confidence: 95 },
                { actionType: 'manual_review', rationale: 'Escalate to human compliance officer.', confidence: 80 }
            ]
        },
        {
            id: 'ins_2',
            title: 'Yield Optimization: EUR/USD',
            description: 'Predictive models suggest a 48-hour window of increased volatility in the Eurozone. Hedging recommended.',
            urgency: 'medium',
            confidenceScore: 84,
            actionable: true,
            actionType: 'execute_trade',
            details: { pair: 'EUR/USD', strategy: 'Short-Gamma' },
            tags: ['FX', 'Yield', 'Alpha'],
            geinFactor: 0.82,
            riskAnalysis: { volatilityIndex: 34, sharpeRatio: 2.1, maxDrawdown: 5 },
            backtestData: Array.from({length: 20}, (_, i) => ({ name: `T-${20-i}`, value: 100 + i * 2 + Math.random() * 5 })),
            alternativeActions: [
                { actionType: 'spot_buy', rationale: 'Direct exposure to the underlying asset.', confidence: 60 }
            ]
        },
        {
            id: 'ins_3',
            title: 'Liquidity Provision Opportunity',
            description: 'Quantum Pool #42 is showing a 12% APR spike due to institutional rebalancing.',
            urgency: 'low',
            confidenceScore: 72,
            actionable: true,
            actionType: 'liquidity_provision',
            details: { pool: 'Quantum-Alpha-IV' },
            tags: ['Treasury', 'Passive'],
            geinFactor: 0.75,
            riskAnalysis: { volatilityIndex: 12, sharpeRatio: 3.5, maxDrawdown: 2 },
            backtestData: Array.from({length: 20}, (_, i) => ({ name: `T-${20-i}`, value: 100 + Math.sin(i) * 10 })),
            alternativeActions: []
        }
    ], []);

    const filteredInsights = useMemo(() => {
        if (filter === 'all') return insights;
        return insights.filter(i => i.urgency === filter);
    }, [insights, filter]);

    const allocationData = [
        { name: 'USD Liquidity', value: 45, color: '#06b6d4' },
        { name: 'EUR Hedged', value: 25, color: '#3b82f6' },
        { name: 'SGD Yield Pools', value: 20, color: '#8b5cf6' },
        { name: 'Alpha Vaults', value: 10, color: '#ec4899' }
    ];

    const handleAIAction = (type: string, data: any) => {
        const normalizedType = type.toUpperCase();
        logAction(`AI_TRIGGERED_${normalizedType}`, JSON.stringify(data), 'INFO');
        if (normalizedType === 'WIRE_TRANSFER') {
            setStripeData({ amount: data.amount || 1000, recipient: data.recipient || 'Unknown Entity' });
            setShowStripe(true);
        } else {
            alert(`AI Action Triggered: ${normalizedType}\nDetails: ${JSON.stringify(data)}`);
        }
    };

    const executeStrategy = (insight: EnhancedAIInsight) => {
        const actionName = `STRATEGY_EXECUTION_${insight.actionType.toUpperCase()}`;
        logAction(actionName, `Executing strategy for ${insight.id}: ${insight.title}`, 'CRITICAL');
        setSelectedInsight(null);
        
        // Simulate multi-step execution in the audit log
        setTimeout(() => {
            logAction(`${actionName}_PENDING`, `Securing liquidity channels for ${insight.id}...`, 'INFO');
        }, 1500);
        setTimeout(() => {
            logAction(`${actionName}_SUCCESS`, `Strategy ${insight.id} successfully executed. Position established.`, 'INFO');
        }, 3500);
    };

    return (
        <div className="min-h-screen bg-[#05070a] text-gray-300 p-8 font-sans selection:bg-cyan-500/30">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center shadow-[0_0_20px_rgba(6,182,212,0.5)]">
                            <ShieldIcon />
                        </div>
                        <h1 className="text-4xl font-black text-white tracking-tighter uppercase italic">Quantum Financial</h1>
                    </div>
                    <p className="text-gray-500 font-medium tracking-widest text-xs uppercase">Global Institutional Command Center // Secure Node 0x4F2</p>
                </div>
                <div className="flex gap-4">
                    <div className="bg-gray-900 border border-gray-800 px-6 py-3 rounded-xl flex flex-col items-end">
                        <span className="text-[10px] text-gray-500 font-bold uppercase">Total Liquidity</span>
                        <span className="text-2xl font-mono text-cyan-400 font-bold">$4,290,122,004.82</span>
                    </div>
                    <div className="bg-gray-900 border border-gray-800 px-6 py-3 rounded-xl flex flex-col items-end">
                        <span className="text-[10px] text-gray-500 font-bold uppercase">System Health</span>
                        <span className="text-2xl font-mono text-green-400 font-bold">99.99%</span>
                    </div>
                </div>
            </div>

            {/* Main Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                {/* Left Column: Insights */}
                <div className="lg:col-span-4 space-y-8">
                    <Card 
                        title="Strategic Intelligence" 
                        icon={<BoltIcon />} 
                        className="border-l-4 border-l-cyan-500"
                        action={
                            <div className="flex gap-1 bg-gray-950 p-1 rounded-lg border border-gray-800">
                                {(['all', 'high', 'medium', 'low'] as const).map(f => (
                                    <button
                                        key={f}
                                        onClick={() => setFilter(f)}
                                        className={`px-2 py-1 text-[10px] font-bold uppercase rounded transition-colors ${filter === f ? 'bg-cyan-600 text-white' : 'text-gray-500 hover:text-gray-300'}`}
                                    >
                                        {f}
                                    </button>
                                ))}
                            </div>
                        }
                    >
                        <div className="space-y-4">
                            {filteredInsights.map(insight => (
                                <div 
                                    key={insight.id}
                                    onClick={() => setSelectedInsight(insight)}
                                    className="group relative p-4 bg-gray-800/30 border border-gray-800 rounded-xl hover:border-cyan-500/50 transition-all cursor-pointer overflow-hidden"
                                >
                                    <div className={`absolute top-0 right-0 w-1 h-full ${insight.urgency === 'high' ? 'bg-red-500' : insight.urgency === 'medium' ? 'bg-yellow-500' : 'bg-blue-500'}`}></div>
                                    <div className="flex justify-between items-start mb-2">
                                        <h4 className="font-bold text-white group-hover:text-cyan-400 transition-colors">{insight.title}</h4>
                                        <div className="text-right">
                                            <span className="text-[10px] font-mono text-gray-500 block">{insight.confidenceScore}% CONF</span>
                                            <span className="text-[9px] font-mono text-cyan-500 block">GEIN: {insight.geinFactor}</span>
                                        </div>
                                    </div>
                                    <p className="text-xs text-gray-400 line-clamp-2 mb-3">{insight.description}</p>
                                    <div className="flex gap-2">
                                        {insight.tags.map(t => (
                                            <span key={t} className="text-[9px] px-2 py-0.5 bg-gray-900 rounded border border-gray-700 text-gray-500 uppercase font-bold">{t}</span>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>

                    <Card title="Global Market Vectors" icon={<BoltIcon />}>
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={Array.from({length: 12}, (_, i) => ({ name: i, val: 4000 + Math.random() * 2000 }))}>
                                    <defs>
                                        <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3}/>
                                            <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                    <Area type="monotone" dataKey="val" stroke="#06b6d4" fillOpacity={1} fill="url(#colorVal)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </Card>
                </div>

                {/* Center Column: Detailed Analysis */}
                <div className="lg:col-span-5 space-y-8">
                    <Card 
                        title="Real-Time Performance Engine" 
                        className="h-full"
                        action={
                            <div className="flex gap-1 bg-gray-950 p-1 rounded-lg border border-gray-800">
                                <button
                                    onClick={() => setCenterView('performance')}
                                    className={`px-2 py-1 text-[10px] font-bold uppercase rounded transition-colors ${centerView === 'performance' ? 'bg-cyan-600 text-white' : 'text-gray-500 hover:text-gray-300'}`}
                                >
                                    Performance
                                </button>
                                <button
                                    onClick={() => setCenterView('allocation')}
                                    className={`px-2 py-1 text-[10px] font-bold uppercase rounded transition-colors ${centerView === 'allocation' ? 'bg-cyan-600 text-white' : 'text-gray-500 hover:text-gray-300'}`}
                                >
                                    Allocation
                                </button>
                            </div>
                        }
                    >
                        <div className="grid grid-cols-2 gap-4 mb-8">
                            <div className="p-4 bg-gray-800/20 rounded-xl border border-gray-800">
                                <div className="text-[10px] text-gray-500 uppercase font-bold mb-1">Alpha Generation</div>
                                <div className="text-xl font-mono text-white">+14.2%</div>
                            </div>
                            <div className="p-4 bg-gray-800/20 rounded-xl border border-gray-800">
                                <div className="text-[10px] text-gray-500 uppercase font-bold mb-1">Risk Exposure</div>
                                <div className="text-xl font-mono text-yellow-500">MODERATE</div>
                            </div>
                        </div>
                        <div className="h-[400px]">
                            {centerView === 'performance' ? (
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={Array.from({length: 8}, (_, i) => ({ name: `Node ${i}`, value: Math.random() * 100 }))}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} />
                                        <XAxis dataKey="name" stroke="#4b5563" fontSize={10} />
                                        <YAxis stroke="#4b5563" fontSize={10} />
                                        <Tooltip 
                                            contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px' }}
                                            itemStyle={{ color: '#06b6d4' }}
                                        />
                                        <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                                            {Array.from({length: 8}).map((_, index) => (
                                                <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#06b6d4' : '#3b82f6'} />
                                            ))}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            ) : (
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={allocationData}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={60}
                                            outerRadius={100}
                                            paddingAngle={5}
                                            dataKey="value"
                                        >
                                            {allocationData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                        <Tooltip 
                                            contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px' }}
                                            itemStyle={{ color: '#fff' }}
                                        />
                                    </PieChart>
                                </ResponsiveContainer>
                            )}
                        </div>
                        {centerView === 'allocation' && (
                            <div className="grid grid-cols-2 gap-2 mt-4">
                                {allocationData.map((item, idx) => (
                                    <div key={idx} className="flex items-center gap-2 text-xs">
                                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                                        <span className="text-gray-400">{item.name}:</span>
                                        <span className="font-mono font-bold text-white">{item.value}%</span>
                                    </div>
                                ))}
                            </div>
                        )}
                        <div className="mt-8 p-4 bg-cyan-900/10 border border-cyan-500/20 rounded-xl">
                            <div className="flex items-center gap-3 text-cyan-400 mb-2">
                                <BoltIcon />
                                <span className="text-sm font-bold uppercase tracking-widest">AI Optimization Active</span>
                            </div>
                            <p className="text-xs text-gray-400 leading-relaxed">
                                Our proprietary GEIN (Generative Edge & Intelligence Nexus) is currently re-routing liquidity through the Frankfurt-Singapore corridor to minimize latency and maximize yield.
                            </p>
                        </div>
                    </Card>
                </div>

                {/* Right Column: Audit & Security */}
                <div className="lg:col-span-3 space-y-8">
                    <Card title="Immutable Audit Trail" icon={<ShieldIcon />}>
                        <div className="space-y-4 max-h-[600px] overflow-y-auto custom-scrollbar pr-2">
                            {logs.length === 0 && <div className="text-center py-8 text-gray-600 italic text-sm">No sensitive actions recorded in current session.</div>}
                            {logs.map(log => (
                                <div key={log.id} className="p-3 bg-gray-950 border-l-2 border-gray-800 rounded-r-lg">
                                    <div className="flex justify-between items-center mb-1">
                                        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${log.severity === 'CRITICAL' ? 'bg-red-900/40 text-red-400' : 'bg-gray-800 text-gray-400'}`}>
                                            {log.severity}
                                        </span>
                                        <span className="text-[8px] font-mono text-gray-600">{new Date(log.timestamp).toLocaleTimeString()}</span>
                                    </div>
                                    <div className="text-[11px] font-bold text-gray-300 mb-1">{log.action}</div>
                                    <div className="text-[9px] text-gray-500 font-mono truncate">{log.details}</div>
                                    <div className="mt-2 text-[8px] text-cyan-900 font-mono uppercase tracking-tighter">SIG: {log.checksum}</div>
                                </div>
                            ))}
                        </div>
                    </Card>

                    <Card title="Security Status" icon={<ShieldIcon />}>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-3 bg-green-900/10 border border-green-500/20 rounded-lg">
                                <span className="text-xs font-bold text-green-500">MFA STATUS</span>
                                <span className="text-xs font-mono text-white">VERIFIED</span>
                            </div>
                            <div className="flex items-center justify-between p-3 bg-cyan-900/10 border border-cyan-500/20 rounded-lg">
                                <span className="text-xs font-bold text-cyan-500">ENCRYPTION</span>
                                <span className="text-xs font-mono text-white">AES-GCM-256</span>
                            </div>
                            <div className="flex items-center justify-between p-3 bg-purple-900/10 border border-purple-500/20 rounded-lg">
                                <span className="text-xs font-bold text-purple-500">VAULT MODE</span>
                                <span className="text-xs font-mono text-white">HOMOMORPHIC</span>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>

            {/* Modals */}
            {selectedInsight && (
                <div className="fixed inset-0 bg-black/80 z-[105] flex items-center justify-center backdrop-blur-md p-4">
                    <Card
                        title="Strategic Execution Module"
                        icon={<BoltIcon />}
                        className="w-full max-w-2xl animate-in zoom-in duration-200"
                        bodyClassName="p-8"
                        action={
                            <button onClick={() => setSelectedInsight(null)} className="text-gray-500 hover:text-white">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        }
                    >
                        <div className="mb-8">
                            <div className="text-xs font-bold text-cyan-500 uppercase tracking-widest mb-2">Insight Analysis</div>
                            <h2 className="text-2xl font-bold text-white mb-4">{selectedInsight.title}</h2>
                            <p className="text-gray-400 leading-relaxed mb-4">{selectedInsight.description}</p>
                            {selectedInsight.details && (
                                <div className="p-3 bg-gray-950 border border-gray-800 rounded-lg font-mono text-xs text-gray-400">
                                    <span className="text-gray-500">METADATA:</span> {JSON.stringify(selectedInsight.details)}
                                </div>
                            )}
                        </div>

                        <div className="grid grid-cols-3 gap-6 mb-8">
                            <div className="p-4 bg-gray-800/50 rounded-xl border border-gray-700 text-center">
                                <div className="text-[10px] text-gray-500 uppercase font-bold mb-1">Volatility</div>
                                <div className="text-xl font-mono text-white">{selectedInsight.riskAnalysis.volatilityIndex}</div>
                            </div>
                            <div className="p-4 bg-gray-800/50 rounded-xl border border-gray-700 text-center">
                                <div className="text-[10px] text-gray-500 uppercase font-bold mb-1">Sharpe</div>
                                <div className="text-xl font-mono text-green-400">{selectedInsight.riskAnalysis.sharpeRatio}</div>
                            </div>
                            <div className="p-4 bg-gray-800/50 rounded-xl border border-gray-700 text-center">
                                <div className="text-[10px] text-gray-500 uppercase font-bold mb-1">Max DD</div>
                                <div className="text-xl font-mono text-red-400">{selectedInsight.riskAnalysis.maxDrawdown}%</div>
                            </div>
                        </div>

                        <div className="h-48 mb-8 bg-gray-950 rounded-xl border border-gray-800 p-4">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={selectedInsight.backtestData}>
                                    <Line type="monotone" dataKey="value" stroke="#06b6d4" strokeWidth={3} dot={false} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>

                        {selectedInsight.alternativeActions && selectedInsight.alternativeActions.length > 0 && (
                            <div className="mb-8">
                                <div className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Alternative AI Recommendations</div>
                                <div className="space-y-3">
                                    {selectedInsight.alternativeActions.map((alt, idx) => (
                                        <div key={idx} className="p-3 bg-gray-950 border border-gray-800 rounded-lg flex justify-between items-center">
                                            <div>
                                                <div className="text-xs font-bold text-white uppercase">{alt.actionType.replace('_', ' ')}</div>
                                                <div className="text-[11px] text-gray-400">{alt.rationale}</div>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-xs font-mono text-cyan-400 font-bold">{alt.confidence}%</div>
                                                <div className="text-[9px] text-gray-500 uppercase font-bold">Confidence</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="flex gap-4">
                            <button 
                                onClick={() => setSelectedInsight(null)}
                                className="flex-1 px-6 py-4 bg-gray-800 text-white font-bold rounded-xl hover:bg-gray-700 transition-colors"
                            >
                                Decline Strategy
                            </button>
                            <button 
                                onClick={() => executeStrategy(selectedInsight)}
                                className="flex-1 px-6 py-4 bg-cyan-600 text-white font-bold rounded-xl hover:bg-cyan-500 shadow-[0_0_30px_rgba(6,182,212,0.4)] transition-all transform hover:scale-[1.02]"
                            >
                                Execute Strategy
                            </button>
                        </div>
                    </Card>
                </div>
            )}

            {showStripe && (
                <StripeCheckoutModal 
                    amount={stripeData.amount} 
                    recipient={stripeData.recipient} 
                    onClose={() => setShowStripe(false)} 
                    onComplete={() => logAction('STRIPE_PAYMENT_SUCCESS', `Paid ${stripeData.amount} to ${stripeData.recipient}`, 'INFO')}
                />
            )}

            {/* Chatbot */}
            <QuantumChat onAction={handleAIAction} />

            {/* Footer Branding */}
            <div className="mt-12 pt-8 border-t border-gray-900 flex justify-between items-center text-[10px] text-gray-600 font-bold uppercase tracking-[0.2em]">
                <div>© 2026 Quantum Financial Institutional Group. All Rights Reserved.</div>
                <div className="flex gap-6">
                    <span className="hover:text-cyan-500 cursor-pointer transition-colors">Terms of Service</span>
                    <span className="hover:text-cyan-500 cursor-pointer transition-colors">Privacy Protocol</span>
                    <span className="hover:text-cyan-500 cursor-pointer transition-colors">Regulatory Disclosures</span>
                </div>
            </div>
        </div>
    );
};

export default AIInsights;

================================================================================
// APPENDED FROM REPO: diplomat-bit/G20 | ORIGINAL PATH: diplomat-bit-G20-0199fa7/components/AIInsights.tsx
================================================================================



import React, { useContext } from 'react';
import Card from './Card';
import type { AIInsight } from '../types';
import { DataContext } from '../context/DataContext';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';


const UrgencyIndicator: React.FC<{ urgency: 'low' | 'medium' | 'high' }> = ({ urgency }) => {
    const urgencyClasses = {
        low: 'bg-blue-500',
        medium: 'bg-yellow-500',
        high: 'bg-red-500',
    };
    return <span className={`absolute top-2 right-2 h-3 w-3 rounded-full ${urgencyClasses[urgency]}`}></span>;
};


const AIInsights: React.FC = () => {
    const context = useContext(DataContext);
    if (!context) throw new Error("AIInsights must be within a DataProvider");
    const { aiInsights, isInsightsLoading } = context;

  return (
    <Card title="AI Advisor Insights" className="h-full" isLoading={isInsightsLoading}>
        <div className="space-y-4">
            {aiInsights.map(insight => (
                <div key={insight.id} className="relative p-4 bg-gray-700/50 rounded-lg border border-gray-600/50 hover:border-cyan-400/50 transition-all duration-200">
                    <UrgencyIndicator urgency={insight.urgency} />
                    <h4 className="font-bold text-gray-100">{insight.title}</h4>
                    <p className="text-sm text-gray-300 mt-1">{insight.description}</p>
                    {insight.chartData && insight.chartData.length > 0 && (
                        <div className="mt-3 h-28 pr-4">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={insight.chartData} layout="vertical" margin={{ top: 5, right: 0, left: 0, bottom: 5 }}>
                                    <XAxis type="number" hide />
                                    <YAxis 
                                        type="category" 
                                        dataKey="name" 
                                        axisLine={false} 
                                        tickLine={false} 
                                        fontSize={11} 
                                        stroke="#9ca3af" 
                                        width={85}
                                        style={{ textTransform: 'capitalize' }}
                                    />
                                    <Tooltip 
                                        cursor={{ fill: 'rgba(100,116,139,0.1)' }}
                                        contentStyle={{
                                            backgroundColor: 'rgba(31, 41, 55, 0.8)',
                                            borderColor: '#4b5563',
                                            fontSize: '12px',
                                        }}
                                        formatter={(value: number) => [`$${value.toFixed(2)}`, 'Spent']}
                                    />
                                    <Bar dataKey="value" fill="#06b6d4" radius={[0, 4, 4, 0]} barSize={12} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    )}
                </div>
            ))}
        </div>
    </Card>
  );
};

export default AIInsights;

================================================================================
// APPENDED FROM REPO: diplomat-bit/jamesburvelocallaghaniiiand | ORIGINAL PATH: diplomat-bit-jamesburvelocallaghaniiiand-9414e97/components/AIInsights.tsx
================================================================================

import React, { useContext, useState, useMemo } from 'react';
import Card from './Card';
import type { AIInsight } from '../types';
import { DataContext } from '../context/DataContext';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, Cell, LineChart, Line, CartesianGrid } from 'recharts';

// --- GEIN-Enhanced Component Ecosystem for Hyper-Scale AI-Driven Trading ---

// Expanded AIInsight type to represent a deeply interconnected, multi-faceted data structure.
export interface EnhancedAIInsight extends AIInsight {
    confidenceScore: number;
    actionable: boolean;
    actionType?: 'rebalance_portfolio' | 'set_stop_loss' | 'execute_trade' | 'liquidity_provision';
    details?: {
        asset?: string;
        currentAllocation?: number;
        suggestedAllocation?: number;
        currentPrice?: number;
        suggestedStopLoss?: number;
        tradeType?: 'buy' | 'sell';
        quantity?: number;
        targetPool?: string;
    };
    tags: string[];
    // --- GEIN (Generative Edge & Intelligence Nexus) Implementation ---
    geinFactor: number; // Proprietary metric for insight quality and uniqueness.
    correlationId: string; // Links related insights across different models/timeframes.
    sourceModel: string; // The specific AI model that generated the insight.
    timeToLive: number; // Validity period of the insight in seconds.
    riskAnalysis: {
        volatilityIndex: number;
        sharpeRatio: number;
        maxDrawdown: number;
    };
    backtestData: { name: string; value: number }[];
    alternativeActions: {
        actionType: string;
        rationale: string;
        confidence: number;
    }[];
    // Added missing properties
    urgency: 'low' | 'medium' | 'high';
    title: string;
    description: string;
    chartData?: { name: string; value: number }[];
}

// --- Self-Contained SVG Icons for a Richer UI without external dependencies ---

const BoltIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 inline-block" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5.2a1 1 0 01-1.17.986l-3.2-1.1a1 1 0 00-1.26.95l.5 3.5a1 1 0 01-.45.95l-2.7 2.1a1 1 0 00-.55 1.34l3.2 5.9a1 1 0 01.05.52 1 1 0 01-1.6 1.04l-1.4-1.4a1 1 0 00-1.4 1.4l1.4 1.4a3 3 0 004.2 0l9.4-9.4a1 1 0 01-.1-1.5l-5.9-3.2a1 1 0 01-.5-.05l-3.5-.5a1 1 0 00-.95 1.26l1.1 3.2A1 1 0 018.8 11V2a1 1 0 011.3-.954z" clipRule="evenodd" />
    </svg>
);

const CloseIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
);

const InfoIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500 group-hover/info:text-cyan-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

// --- Enhanced Urgency Indicator with Labels ---

const UrgencyIndicator: React.FC<{ urgency: 'low' | 'medium' | 'high' }> = ({ urgency }) => {
    const urgencyConfig = useMemo(() => ({
        low: { class: 'bg-blue-500', label: 'Low' },
        medium: { class: 'bg-yellow-500', label: 'Medium' },
        high: { class: 'bg-red-500', label: 'High' },
    }), []);
    
    return (
        <div className="absolute top-3 right-3 flex items-center text-xs font-semibold">
            <span className={`h-2.5 w-2.5 rounded-full ${urgencyConfig[urgency].class} mr-2`}></span>
            <span className="text-gray-400">{urgencyConfig[urgency].label} Urgency</span>
        </div>
    );
};

const getEducationalText = (actionType?: string) => {
    switch (actionType) {
        case 'rebalance_portfolio':
            return 'Rebalancing adjusts your portfolio\'s asset allocation to maintain your desired risk level. It involves selling assets that have grown and buying those that have shrunk.';
        case 'set_stop_loss':
            return 'A stop-loss is an order to sell a security when it reaches a certain price. It\'s designed to limit an investor\'s loss on a security position.';
        case 'execute_trade':
            return 'This involves buying or selling a security based on a specific market signal, such as momentum, volatility, or order book analysis.';
        case 'liquidity_provision':
            return 'Providing liquidity means depositing a pair of assets into a decentralized exchange pool to facilitate trading. In return, you earn fees from the trades that occur.';
        default:
            return 'This is a general insight. Review the details for more information.';
    }
};

// --- Self-Contained "App-in-App" Action Modal with Multi-Tab Analysis ---

const ActionModal: React.FC<{ insight: EnhancedAIInsight; onClose: () => void }> = ({ insight, onClose }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [activeTab, setActiveTab] = useState<'overview' | 'risk' | 'backtest' | 'alternatives'>('overview');

    const handleExecute = () => {
        setIsLoading(true);
        console.log(`Executing HFT action: ${insight.actionType} for insight ${insight.id} with details:`, insight.details);
        setTimeout(() => {
            setIsLoading(false);
            onClose();
        }, 1500);
    };

    const renderOverview = () => {
        switch (insight.actionType) {
            case 'rebalance_portfolio':
                return (
                    <>
                        <h4 className="text-lg font-semibold text-gray-100 mb-2">Rebalance: {insight.details?.asset}</h4>
                        <p className="text-sm text-gray-400 mb-4">Adjust allocation from {insight.details?.currentAllocation}% to {insight.details?.suggestedAllocation}%. This is a high-conviction trade based on predictive market analytics.</p>
                        <div className="space-y-2">
                            <label htmlFor="allocation" className="block text-sm font-medium text-gray-300">New Allocation (%)</label>
                            <input type="range" id="allocation" min="0" max="100" defaultValue={insight.details?.suggestedAllocation} className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-cyan-500" />
                        </div>
                    </>
                );
            case 'set_stop_loss':
                return (
                    <>
                        <h4 className="text-lg font-semibold text-gray-100 mb-2">Set Stop-Loss: {insight.details?.asset}</h4>
                        <p className="text-sm text-gray-400 mb-4">Current Price: ${insight.details?.currentPrice?.toFixed(2)}. The AI suggests a new stop-loss to mitigate downside risk from volatility spikes.</p>
                        <div className="p-3 bg-red-900/20 border border-red-500/50 rounded text-red-300 text-center text-lg font-bold">
                            Suggested Stop: ${insight.details?.suggestedStopLoss}
                        </div>
                    </>
                );
            case 'execute_trade':
                return (
                    <>
                         <h4 className="text-lg font-semibold text-gray-100 mb-2">Execute Trade: {insight.details?.tradeType?.toUpperCase()} {insight.details?.asset}</h4>
                         <p className="text-sm text-gray-400 mb-4">Quantity: {insight.details?.quantity}. Based on short-term momentum indicators and order book imbalance.</p>
                    </>
                );
            case 'liquidity_provision':
                 return (
                    <>
                         <h4 className="text-lg font-semibold text-gray-100 mb-2">Provide Liquidity: {insight.details?.targetPool}</h4>
                         <p className="text-sm text-gray-400 mb-4">Projected APR is surging. Deploy capital to capture yield farming opportunities.</p>
                    </>
                );
            default:
                return <p className="text-gray-400">Review the insight details before proceeding.</p>;
        }
    };

    const renderRisk = () => (
        <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
                <div className="p-3 bg-gray-800 rounded text-center">
                    <div className="text-xs text-gray-500">Volatility</div>
                    <div className="text-lg font-bold text-yellow-400">{insight.riskAnalysis.volatilityIndex}</div>
                </div>
                <div className="p-3 bg-gray-800 rounded text-center">
                    <div className="text-xs text-gray-500">Sharpe Ratio</div>
                    <div className="text-lg font-bold text-green-400">{insight.riskAnalysis.sharpeRatio}</div>
                </div>
                <div className="p-3 bg-gray-800 rounded text-center">
                    <div className="text-xs text-gray-500">Max Drawdown</div>
                    <div className="text-lg font-bold text-red-400">{insight.riskAnalysis.maxDrawdown}%</div>
                </div>
            </div>
            <div className="text-xs text-gray-400 bg-gray-800 p-3 rounded border border-gray-700">
                <strong className="text-gray-300">GEIN Factor Analysis:</strong> This insight was generated with a GEIN Factor of {insight.geinFactor}, indicating a highly unique market edge derived from proprietary data streams.
            </div>
        </div>
    );

    const renderBacktest = () => (
        <div className="h-64 w-full bg-gray-800 p-2 rounded border border-gray-700">
            <p className="text-xs text-gray-400 mb-2 text-center">Simulated Performance (Last 30 Days)</p>
            <ResponsiveContainer width="100%" height="90%">
                <LineChart data={insight.backtestData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="name" stroke="#9CA3AF" fontSize={10} />
                    <YAxis stroke="#9CA3AF" fontSize={10} />
                    <Tooltip contentStyle={{ backgroundColor: '#1F2937', borderColor: '#4B5563', color: '#F3F4F6' }} />
                    <Line type="monotone" dataKey="value" stroke="#10B981" strokeWidth={2} dot={false} />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );

    const renderAlternatives = () => (
        <div className="space-y-3">
            {insight.alternativeActions.map((alt, idx) => (
                <div key={idx} className="p-3 bg-gray-800 border border-gray-700 rounded hover:border-gray-500 cursor-pointer transition-colors">
                    <div className="flex justify-between mb-1">
                        <span className="font-semibold text-gray-200 capitalize">{alt.actionType.replace('_', ' ')}</span>
                        <span className="text-xs text-cyan-400 font-mono">{alt.confidence}% Conf.</span>
                    </div>
                    <p className="text-xs text-gray-400">{alt.rationale}</p>
                </div>
            ))}
        </div>
    );

    return (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center backdrop-blur-sm">
            <div className="bg-gray-900 w-full max-w-2xl rounded-xl border border-gray-700 shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                <div className="flex justify-between items-center p-4 border-b border-gray-800 bg-gray-800/50">
                    <h3 className="text-xl font-bold text-white flex items-center"><BoltIcon /> Strategic Execution Module</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors"><CloseIcon /></button>
                </div>
                
                <div className="flex border-b border-gray-800">
                    <button onClick={() => setActiveTab('overview')} className={`flex-1 py-3 text-sm font-medium transition-colors ${activeTab === 'overview' ? 'bg-gray-800 text-white border-b-2 border-cyan-500' : 'text-gray-400 hover:bg-gray-800/50'}`}>Overview</button>
                    <button onClick={() => setActiveTab('risk')} className={`flex-1 py-3 text-sm font-medium transition-colors ${activeTab === 'risk' ? 'bg-gray-800 text-white border-b-2 border-cyan-500' : 'text-gray-400 hover:bg-gray-800/50'}`}>Risk Analysis</button>
                    <button onClick={() => setActiveTab('backtest')} className={`flex-1 py-3 text-sm font-medium transition-colors ${activeTab === 'backtest' ? 'bg-gray-800 text-white border-b-2 border-cyan-500' : 'text-gray-400 hover:bg-gray-800/50'}`}>Backtest</button>
                    <button onClick={() => setActiveTab('alternatives')} className={`flex-1 py-3 text-sm font-medium transition-colors ${activeTab === 'alternatives' ? 'bg-gray-800 text-white border-b-2 border-cyan-500' : 'text-gray-400 hover:bg-gray-800/50'}`}>Alternatives</button>
                </div>

                <div className="p-6 min-h-[300px]">
                    {activeTab === 'overview' && renderOverview()}
                    {activeTab === 'risk' && renderRisk()}
                    {activeTab === 'backtest' && renderBacktest()}
                    {activeTab === 'alternatives' && renderAlternatives()}
                </div>

                <div className="p-4 border-t border-gray-800 bg-gray-800/30 flex justify-end gap-3">
                    <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white transition-colors">Cancel</button>
                    <button 
                        onClick={handleExecute} 
                        disabled={isLoading}
                        className="px-6 py-2 bg-cyan-600 hover:bg-cyan-500 text-white text-sm font-bold rounded shadow-lg shadow-cyan-500/20 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                    >
                        {isLoading ? (
                            <>
                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                Initiating...
                            </>
                        ) : 'Execute Strategy'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export const AIInsights: React.FC = () => {
    const context = useContext(DataContext);
    const [selectedInsight, setSelectedInsight] = useState<EnhancedAIInsight | null>(null);

    // Mock data generation if context data is limited
    const insights: EnhancedAIInsight[] = useMemo(() => {
        const baseInsights = context?.financialGoals || []; // Using financialGoals as a seed for mock insights
        
        return [
            {
                id: 'ins_1',
                title: 'Portfolio Imbalance Detected',
                description: 'Crypto exposure has exceeded 20% due to recent ETH rally. Rebalancing recommended to maintain risk parity.',
                urgency: 'high',
                confidenceScore: 92,
                actionable: true,
                actionType: 'rebalance_portfolio',
                details: { asset: 'ETH', currentAllocation: 22, suggestedAllocation: 15 },
                tags: ['Risk', 'Crypto', 'Rebalance'],
                geinFactor: 0.85,
                correlationId: 'corr_eth_rally_q3',
                sourceModel: 'Sentinel-Prime-v4',
                timeToLive: 3600,
                riskAnalysis: { volatilityIndex: 65, sharpeRatio: 1.8, maxDrawdown: 12 },
                backtestData: Array.from({length: 30}, (_, i) => ({ name: `Day ${i}`, value: 100 + Math.random() * 20 + i })),
                alternativeActions: [
                    { actionType: 'hedge_with_options', rationale: 'Buy protective puts to lock in gains without selling.', confidence: 75 },
                    { actionType: 'do_nothing', rationale: 'Allow drift if momentum indicators remain strong.', confidence: 40 }
                ],
                message: 'Portfolio Imbalance',
                type: 'Warning'
            },
            {
                id: 'ins_2',
                title: 'Stop-Loss Opportunity',
                description: 'TSLA volatility approaching critical threshold. Dynamic stop-loss adjustment suggested.',
                urgency: 'medium',
                confidenceScore: 88,
                actionable: true,
                actionType: 'set_stop_loss',
                details: { asset: 'TSLA', currentPrice: 245.50, suggestedStopLoss: 230.00 },
                tags: ['Equity', 'Protection'],
                geinFactor: 0.78,
                correlationId: 'corr_tech_volatility',
                sourceModel: 'Risk-Overseer-v9',
                timeToLive: 7200,
                riskAnalysis: { volatilityIndex: 45, sharpeRatio: 1.2, maxDrawdown: 25 },
                backtestData: Array.from({length: 30}, (_, i) => ({ name: `Day ${i}`, value: 100 - Math.random() * 10 })),
                alternativeActions: [],
                message: 'Stop-Loss Update',
                type: 'Opportunity'
            },
             {
                id: 'ins_3',
                title: 'Liquidity Pool Yield Spike',
                description: 'USDC-ETH pool on Uniswap v3 showing 45% APR. Capital deployment advised.',
                urgency: 'low',
                confidenceScore: 65,
                actionable: true,
                actionType: 'liquidity_provision',
                details: { targetPool: 'USDC-ETH (0.05%)' },
                tags: ['DeFi', 'Yield'],
                geinFactor: 0.92,
                correlationId: 'corr_defi_yields',
                sourceModel: 'Yield-Hunter-Alpha',
                timeToLive: 1800,
                riskAnalysis: { volatilityIndex: 80, sharpeRatio: 2.5, maxDrawdown: 5 },
                backtestData: Array.from({length: 30}, (_, i) => ({ name: `Day ${i}`, value: 100 + Math.random() * 5 })),
                alternativeActions: [],
                message: 'High Yield Alert',
                type: 'Opportunity'
            }
        ];
    }, [context]);

    return (
        <Card title="AI Strategic Insights" className="h-full border-l-4 border-purple-500">
            <div className="space-y-4 pr-2 max-h-[400px] overflow-y-auto custom-scrollbar">
                {insights.map(insight => (
                    <div 
                        key={insight.id} 
                        className="relative p-4 bg-gray-800/50 rounded-lg border border-gray-700 hover:border-cyan-500/50 transition-all duration-300 group cursor-pointer hover:bg-gray-800"
                        onClick={() => setSelectedInsight(insight)}
                    >
                        <UrgencyIndicator urgency={insight.urgency} />
                        <h4 className="font-bold text-gray-200 pr-24">{insight.title}</h4>
                        <p className="text-sm text-gray-400 mt-1 line-clamp-2">{insight.description}</p>
                        
                        <div className="mt-3 flex items-center justify-between">
                            <div className="flex gap-2 items-center">
                                {insight.tags.map(tag => (
                                    <span key={tag} className="text-[10px] uppercase font-bold px-2 py-0.5 bg-gray-700 rounded text-gray-300">{tag}</span>
                                ))}
                                <div className="relative group/info ml-2">
                                    <InfoIcon />
                                    <div className="absolute bottom-full mb-2 w-64 p-3 bg-gray-900 border border-gray-700 rounded-lg shadow-lg text-xs text-gray-300 opacity-0 group-hover/info:opacity-100 transition-opacity duration-200 pointer-events-none z-10 -translate-x-1/2 left-1/2">
                                        {getEducationalText(insight.actionType)}
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center text-xs font-mono text-cyan-400 opacity-80 group-hover:opacity-100">
                                <span className="mr-2">Score: {insight.confidenceScore}</span>
                                <BoltIcon />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            {selectedInsight && <ActionModal insight={selectedInsight} onClose={() => setSelectedInsight(null)} />}
        </Card>
    );
};

export default AIInsights;

================================================================================
// APPENDED FROM REPO: diplomat-bit/magic | ORIGINAL PATH: diplomat-bit-magic-a3f5ff1/components/AIInsights.tsx
================================================================================

import React, { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import { 
    BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, Cell, 
    LineChart, Line, CartesianGrid, AreaChart, Area, PieChart, Pie 
} from 'recharts';

/**
 * QUANTUM FINANCIAL - ELITE BUSINESS DEMO ENGINE
 * VERSION: 4.0.0 "GOLDEN TICKET"
 * 
 * PHILOSOPHY: 
 * - High-Performance, Secure, Professional.
 * - "Kick the tires" - Full interactive simulation.
 * - Generative AI Integration (Backend Proxied).
 * - Audit-First Architecture.
 */

// --- TYPES & INTERFACES ---

export interface AuditEntry {
    id: string;
    timestamp: string;
    action: string;
    actor: string;
    severity: 'INFO' | 'WARN' | 'CRITICAL';
    details: string;
    checksum: string; // Simulated cryptographic link
}

export interface EnhancedAIInsight {
    id: string;
    title: string;
    description: string;
    urgency: 'low' | 'medium' | 'high';
    confidenceScore: number;
    actionable: boolean;
    actionType: 'rebalance_portfolio' | 'set_stop_loss' | 'execute_trade' | 'liquidity_provision' | 'wire_transfer' | 'fraud_alert';
    details?: any;
    tags: string[];
    geinFactor: number;
    riskAnalysis: {
        volatilityIndex: number;
        sharpeRatio: number;
        maxDrawdown: number;
    };
    backtestData: { name: string; value: number }[];
    alternativeActions: {
        actionType: string;
        rationale: string;
        confidence: number;
    }[];
}

// --- AUDIT LOGGING SYSTEM ---
const useAuditLogger = () => {
    const [logs, setLogs] = useState<AuditEntry[]>(() => [
        {
            id: 'LOG-INIT001',
            timestamp: new Date(Date.now() - 60000 * 5).toISOString(),
            action: 'SYSTEM_BOOT',
            actor: 'SYSTEM_KERNEL',
            severity: 'INFO',
            details: 'Quantum Financial Engine v4.0.0 initialized successfully.',
            checksum: 'a1b2c3d4'
        },
        {
            id: 'LOG-INIT002',
            timestamp: new Date(Date.now() - 60000 * 4).toISOString(),
            action: 'SECURE_NODE_CONNECT',
            actor: 'SYSTEM_AUTH_USER_01',
            severity: 'INFO',
            details: 'Connected to secure node 0x4F2 (Frankfurt).',
            checksum: 'e5f6g7h8'
        },
        {
            id: 'LOG-INIT003',
            timestamp: new Date(Date.now() - 60000 * 3).toISOString(),
            action: 'MFA_VERIFICATION',
            actor: 'SYSTEM_AUTH_USER_01',
            severity: 'INFO',
            details: 'Multi-factor authentication verified successfully.',
            checksum: 'i9j0k1l2'
        }
    ]);
    
    const logAction = useCallback((action: string, details: string, severity: AuditEntry['severity'] = 'INFO') => {
        const newEntry: AuditEntry = {
            id: `LOG-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
            timestamp: new Date().toISOString(),
            action,
            actor: 'SYSTEM_AUTH_USER_01',
            severity,
            details,
            checksum: Math.random().toString(16).slice(2)
        };
        setLogs(prev => [newEntry, ...prev].slice(0, 100));
    }, []);

    return { logs, logAction };
};

// --- ICONS ---

const BoltIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5.2a1 1 0 01-1.17.986l-3.2-1.1a1 1 0 00-1.26.95l.5 3.5a1 1 0 01-.45.95l-2.7 2.1a1 1 0 00-.55 1.34l3.2 5.9a1 1 0 01.05.52 1 1 0 01-1.6 1.04l-1.4-1.4a1 1 0 00-1.4 1.4l1.4 1.4a3 3 0 004.2 0l9.4-9.4a1 1 0 01-.1-1.5l-5.9-3.2a1 1 0 01-.5-.05l-3.5-.5a1 1 0 00-.95 1.26l1.1 3.2A1 1 0 018.8 11V2a1 1 0 011.3-.954z" clipRule="evenodd" />
    </svg>
);

const ShieldIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
);

const ChatIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
    </svg>
);

// --- COMPONENTS ---

const Card: React.FC<{ 
    title: React.ReactNode; 
    children: React.ReactNode; 
    className?: string; 
    icon?: React.ReactNode;
    bodyClassName?: string;
    action?: React.ReactNode;
}> = ({ title, children, className = '', icon, bodyClassName = 'p-6', action }) => (
    <div className={`bg-gray-900/80 backdrop-blur-md border border-gray-800 rounded-xl overflow-hidden shadow-2xl flex flex-col ${className}`}>
        <div className="px-6 py-4 border-b border-gray-800 flex items-center justify-between bg-gradient-to-r from-gray-900 to-gray-800 shrink-0">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
                {icon} {title}
            </h3>
            {action ? action : (
                <div className="flex gap-1">
                    <div className="w-2 h-2 rounded-full bg-red-500/50"></div>
                    <div className="w-2 h-2 rounded-full bg-yellow-500/50"></div>
                    <div className="w-2 h-2 rounded-full bg-green-500/50"></div>
                </div>
            )}
        </div>
        <div className={`flex-1 ${bodyClassName}`}>{children}</div>
    </div>
);

// --- AI CHATBOT ENGINE ---

const QuantumChat: React.FC<{ onAction: (action: string, data: any) => void }> = ({ onAction }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<{ role: 'user' | 'ai'; content: string }[]>([
        { role: 'ai', content: "Welcome to Quantum Financial. I am your AI co-pilot. Think of this as the cockpit of a high-performance vehicle. How can I help you navigate your global finances today?" }
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim()) return;
        const userMsg = input;
        setInput('');
        setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
        setIsTyping(true);

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: userMsg })
            });

            if (!response.ok) throw new Error('API Error');

            const data = await response.json();
            const text = data.response || data.text || data.reply || data.message || (typeof data === 'string' ? data : '');

            // Parse Action
            const actionMatch = text.match(/ACTION:\s*({.*})/);
            if (actionMatch) {
                try {
                    const actionData = JSON.parse(actionMatch[1]);
                    onAction(actionData.type, actionData);
                } catch (e) {
                    console.error("Failed to parse action JSON", e);
                }
            }

            setMessages(prev => [...prev, { role: 'ai', content: text.replace(/ACTION:\s*{.*}/, '') }]);
        } catch (error) {
            setMessages(prev => [...prev, { role: 'ai', content: "I apologize, but I'm experiencing a momentary synchronization delay with the global markets. Please try again." }]);
        } finally {
            setIsTyping(false);
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-[100]">
            {isOpen ? (
                <Card
                    title={<span className="text-sm tracking-widest uppercase text-cyan-400">Quantum AI Co-Pilot</span>}
                    icon={<div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>}
                    className="w-96 h-[500px] animate-in slide-in-from-bottom-10 duration-300"
                    bodyClassName="p-0 flex flex-col"
                    action={
                        <button onClick={() => setIsOpen(false)} className="text-gray-500 hover:text-white">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                    }
                >
                    <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
                        {messages.map((m, i) => (
                            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[80%] p-3 rounded-xl text-sm ${m.role === 'user' ? 'bg-cyan-600 text-white' : 'bg-gray-800 text-gray-300 border border-gray-700'}`}>
                                    {m.content}
                                </div>
                            </div>
                        ))}
                        {isTyping && <div className="text-xs text-cyan-500 animate-pulse">AI is calculating market vectors...</div>}
                    </div>
                    
                    {/* Quick Prompts */}
                    <div className="px-4 py-2 bg-gray-950 border-t border-gray-900 flex gap-2 overflow-x-auto shrink-0 custom-scrollbar">
                        {[
                            { label: 'Analyze Risk', text: 'Analyze current portfolio risk exposure.' },
                            { label: 'Trigger Wire', text: 'Initiate a wire transfer of $50,000 to SG-Global-Trade.' },
                            { label: 'Optimize Yield', text: 'What is the best yield optimization strategy right now?' }
                        ].map((p, idx) => (
                            <button
                                key={idx}
                                onClick={() => {
                                    setInput(p.text);
                                }}
                                className="shrink-0 px-2 py-1 bg-gray-900 hover:bg-gray-800 border border-gray-800 rounded text-[10px] text-cyan-400 font-medium transition-colors"
                            >
                                {p.label}
                            </button>
                        ))}
                    </div>

                    <div className="p-4 border-t border-gray-800 bg-gray-950 shrink-0">
                        <div className="flex gap-2">
                            <input 
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                                placeholder="Command the system..."
                                className="flex-1 bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500 transition-colors"
                            />
                            <button onClick={handleSend} className="bg-cyan-600 p-2 rounded-lg hover:bg-cyan-500">
                                <BoltIcon />
                            </button>
                        </div>
                    </div>
                </Card>
            ) : (
                <button 
                    onClick={() => setIsOpen(true)}
                    className="w-16 h-16 bg-cyan-600 rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-transform group"
                >
                    <div className="absolute inset-0 rounded-full bg-cyan-400 animate-ping opacity-20"></div>
                    <ChatIcon />
                </button>
            )}
        </div>
    );
};

// --- STRIPE SIMULATION MODAL ---

const StripeCheckoutModal: React.FC<{ amount: number; recipient: string; onClose: () => void; onComplete: () => void }> = ({ amount, recipient, onClose, onComplete }) => {
    const [step, setStep] = useState(1);
    const [isProcessing, setIsProcessing] = useState(false);

    const handlePay = () => {
        setIsProcessing(true);
        setTimeout(() => {
            setIsProcessing(false);
            setStep(2);
            onComplete();
        }, 2500);
    };

    return (
        <div className="fixed inset-0 bg-black/90 z-[110] flex items-center justify-center backdrop-blur-xl p-4">
            <Card
                title={<span className="text-indigo-400">Stripe Secure Payment</span>}
                icon={<ShieldIcon />}
                className="w-full max-w-md"
                action={
                    <button onClick={onClose} className="text-gray-500 hover:text-white">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                }
            >
                {step === 1 ? (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 text-gray-300">
                        <div className="mb-6">
                            <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Payment to</label>
                            <div className="text-lg font-semibold text-white">{recipient}</div>
                        </div>
                        <div className="mb-8">
                            <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Amount</label>
                            <div className="text-4xl font-black text-white">${amount.toLocaleString()}</div>
                        </div>
                        
                        <div className="space-y-4">
                            <div className="p-4 bg-gray-800 border border-gray-700 rounded-xl flex items-center gap-4">
                                <div className="w-12 h-8 bg-gray-900 rounded flex items-center justify-center font-bold text-[10px] text-white">VISA</div>
                                <div className="flex-1">
                                    <div className="text-sm font-medium text-white">•••• 4242</div>
                                    <div className="text-xs text-gray-400">Expires 12/28</div>
                                </div>
                            </div>
                            <button 
                                onClick={handlePay}
                                disabled={isProcessing}
                                className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-indigo-700 transition-all disabled:opacity-50 flex items-center justify-center gap-3"
                            >
                                {isProcessing ? (
                                    <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
                                ) : `Pay $${amount.toLocaleString()}`}
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-12 animate-in zoom-in duration-500 text-gray-300">
                        <div className="w-20 h-20 bg-green-900/30 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6 border border-green-500/30">
                            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                        </div>
                        <h2 className="text-2xl font-bold mb-2 text-white">Payment Successful</h2>
                        <p className="text-gray-500 mb-8">Transaction ID: ch_3N5k9L2eZvKYlo2C1</p>
                        <button onClick={onClose} className="w-full bg-gray-800 text-white py-4 rounded-xl font-bold hover:bg-gray-700">Return to Quantum</button>
                    </div>
                )}
                <div className="mt-6 pt-4 border-t border-gray-800 text-center text-[10px] text-gray-500 uppercase tracking-widest font-bold">
                    Secure Encrypted Transaction via Quantum Financial
                </div>
            </Card>
        </div>
    );
};

// --- MAIN COMPONENT ---

export const AIInsights: React.FC = () => {
    const { logs, logAction } = useAuditLogger();
    const [selectedInsight, setSelectedInsight] = useState<EnhancedAIInsight | null>(null);
    const [showStripe, setShowStripe] = useState(false);
    const [stripeData, setStripeData] = useState({ amount: 0, recipient: '' });
    const [filter, setFilter] = useState<'all' | 'high' | 'medium' | 'low'>('all');
    const [centerView, setCenterView] = useState<'performance' | 'allocation'>('performance');

    // Mock Data Generation
    const insights: EnhancedAIInsight[] = useMemo(() => [
        {
            id: 'ins_1',
            title: 'Anomalous Outflow Detected',
            description: 'A series of high-velocity transfers to a non-whitelisted entity in Singapore has been flagged by our neural monitors.',
            urgency: 'high',
            confidenceScore: 98,
            actionable: true,
            actionType: 'fraud_alert',
            details: { entity: 'SG-Global-Trade', amount: 1250000 },
            tags: ['Security', 'Fraud', 'Critical'],
            geinFactor: 0.99,
            riskAnalysis: { volatilityIndex: 88, sharpeRatio: 0.5, maxDrawdown: 40 },
            backtestData: Array.from({length: 20}, (_, i) => ({ name: `T-${20-i}`, value: 50 + Math.random() * 50 })),
            alternativeActions: [
                { actionType: 'freeze_account', rationale: 'Immediate cessation of all outbound liquidity.', confidence: 95 },
                { actionType: 'manual_review', rationale: 'Escalate to human compliance officer.', confidence: 80 }
            ]
        },
        {
            id: 'ins_2',
            title: 'Yield Optimization: EUR/USD',
            description: 'Predictive models suggest a 48-hour window of increased volatility in the Eurozone. Hedging recommended.',
            urgency: 'medium',
            confidenceScore: 84,
            actionable: true,
            actionType: 'execute_trade',
            details: { pair: 'EUR/USD', strategy: 'Short-Gamma' },
            tags: ['FX', 'Yield', 'Alpha'],
            geinFactor: 0.82,
            riskAnalysis: { volatilityIndex: 34, sharpeRatio: 2.1, maxDrawdown: 5 },
            backtestData: Array.from({length: 20}, (_, i) => ({ name: `T-${20-i}`, value: 100 + i * 2 + Math.random() * 5 })),
            alternativeActions: [
                { actionType: 'spot_buy', rationale: 'Direct exposure to the underlying asset.', confidence: 60 }
            ]
        },
        {
            id: 'ins_3',
            title: 'Liquidity Provision Opportunity',
            description: 'Quantum Pool #42 is showing a 12% APR spike due to institutional rebalancing.',
            urgency: 'low',
            confidenceScore: 72,
            actionable: true,
            actionType: 'liquidity_provision',
            details: { pool: 'Quantum-Alpha-IV' },
            tags: ['Treasury', 'Passive'],
            geinFactor: 0.75,
            riskAnalysis: { volatilityIndex: 12, sharpeRatio: 3.5, maxDrawdown: 2 },
            backtestData: Array.from({length: 20}, (_, i) => ({ name: `T-${20-i}`, value: 100 + Math.sin(i) * 10 })),
            alternativeActions: []
        }
    ], []);

    const filteredInsights = useMemo(() => {
        if (filter === 'all') return insights;
        return insights.filter(i => i.urgency === filter);
    }, [insights, filter]);

    const allocationData = [
        { name: 'USD Liquidity', value: 45, color: '#06b6d4' },
        { name: 'EUR Hedged', value: 25, color: '#3b82f6' },
        { name: 'SGD Yield Pools', value: 20, color: '#8b5cf6' },
        { name: 'Alpha Vaults', value: 10, color: '#ec4899' }
    ];

    const handleAIAction = (type: string, data: any) => {
        const normalizedType = type.toUpperCase();
        logAction(`AI_TRIGGERED_${normalizedType}`, JSON.stringify(data), 'INFO');
        if (normalizedType === 'WIRE_TRANSFER') {
            setStripeData({ amount: data.amount || 1000, recipient: data.recipient || 'Unknown Entity' });
            setShowStripe(true);
        } else {
            alert(`AI Action Triggered: ${normalizedType}\nDetails: ${JSON.stringify(data)}`);
        }
    };

    const executeStrategy = (insight: EnhancedAIInsight) => {
        const actionName = `STRATEGY_EXECUTION_${insight.actionType.toUpperCase()}`;
        logAction(actionName, `Executing strategy for ${insight.id}: ${insight.title}`, 'CRITICAL');
        setSelectedInsight(null);
        
        // Simulate multi-step execution in the audit log
        setTimeout(() => {
            logAction(`${actionName}_PENDING`, `Securing liquidity channels for ${insight.id}...`, 'INFO');
        }, 1500);
        setTimeout(() => {
            logAction(`${actionName}_SUCCESS`, `Strategy ${insight.id} successfully executed. Position established.`, 'INFO');
        }, 3500);
    };

    return (
        <div className="min-h-screen bg-[#05070a] text-gray-300 p-8 font-sans selection:bg-cyan-500/30">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center shadow-[0_0_20px_rgba(6,182,212,0.5)]">
                            <ShieldIcon />
                        </div>
                        <h1 className="text-4xl font-black text-white tracking-tighter uppercase italic">Quantum Financial</h1>
                    </div>
                    <p className="text-gray-500 font-medium tracking-widest text-xs uppercase">Global Institutional Command Center // Secure Node 0x4F2</p>
                </div>
                <div className="flex gap-4">
                    <div className="bg-gray-900 border border-gray-800 px-6 py-3 rounded-xl flex flex-col items-end">
                        <span className="text-[10px] text-gray-500 font-bold uppercase">Total Liquidity</span>
                        <span className="text-2xl font-mono text-cyan-400 font-bold">$4,290,122,004.82</span>
                    </div>
                    <div className="bg-gray-900 border border-gray-800 px-6 py-3 rounded-xl flex flex-col items-end">
                        <span className="text-[10px] text-gray-500 font-bold uppercase">System Health</span>
                        <span className="text-2xl font-mono text-green-400 font-bold">99.99%</span>
                    </div>
                </div>
            </div>

            {/* Main Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                {/* Left Column: Insights */}
                <div className="lg:col-span-4 space-y-8">
                    <Card 
                        title="Strategic Intelligence" 
                        icon={<BoltIcon />} 
                        className="border-l-4 border-l-cyan-500"
                        action={
                            <div className="flex gap-1 bg-gray-950 p-1 rounded-lg border border-gray-800">
                                {(['all', 'high', 'medium', 'low'] as const).map(f => (
                                    <button
                                        key={f}
                                        onClick={() => setFilter(f)}
                                        className={`px-2 py-1 text-[10px] font-bold uppercase rounded transition-colors ${filter === f ? 'bg-cyan-600 text-white' : 'text-gray-500 hover:text-gray-300'}`}
                                    >
                                        {f}
                                    </button>
                                ))}
                            </div>
                        }
                    >
                        <div className="space-y-4">
                            {filteredInsights.map(insight => (
                                <div 
                                    key={insight.id}
                                    onClick={() => setSelectedInsight(insight)}
                                    className="group relative p-4 bg-gray-800/30 border border-gray-800 rounded-xl hover:border-cyan-500/50 transition-all cursor-pointer overflow-hidden"
                                >
                                    <div className={`absolute top-0 right-0 w-1 h-full ${insight.urgency === 'high' ? 'bg-red-500' : insight.urgency === 'medium' ? 'bg-yellow-500' : 'bg-blue-500'}`}></div>
                                    <div className="flex justify-between items-start mb-2">
                                        <h4 className="font-bold text-white group-hover:text-cyan-400 transition-colors">{insight.title}</h4>
                                        <div className="text-right">
                                            <span className="text-[10px] font-mono text-gray-500 block">{insight.confidenceScore}% CONF</span>
                                            <span className="text-[9px] font-mono text-cyan-500 block">GEIN: {insight.geinFactor}</span>
                                        </div>
                                    </div>
                                    <p className="text-xs text-gray-400 line-clamp-2 mb-3">{insight.description}</p>
                                    <div className="flex gap-2">
                                        {insight.tags.map(t => (
                                            <span key={t} className="text-[9px] px-2 py-0.5 bg-gray-900 rounded border border-gray-700 text-gray-500 uppercase font-bold">{t}</span>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>

                    <Card title="Global Market Vectors" icon={<BoltIcon />}>
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={Array.from({length: 12}, (_, i) => ({ name: i, val: 4000 + Math.random() * 2000 }))}>
                                    <defs>
                                        <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3}/>
                                            <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                    <Area type="monotone" dataKey="val" stroke="#06b6d4" fillOpacity={1} fill="url(#colorVal)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </Card>
                </div>

                {/* Center Column: Detailed Analysis */}
                <div className="lg:col-span-5 space-y-8">
                    <Card 
                        title="Real-Time Performance Engine" 
                        className="h-full"
                        action={
                            <div className="flex gap-1 bg-gray-950 p-1 rounded-lg border border-gray-800">
                                <button
                                    onClick={() => setCenterView('performance')}
                                    className={`px-2 py-1 text-[10px] font-bold uppercase rounded transition-colors ${centerView === 'performance' ? 'bg-cyan-600 text-white' : 'text-gray-500 hover:text-gray-300'}`}
                                >
                                    Performance
                                </button>
                                <button
                                    onClick={() => setCenterView('allocation')}
                                    className={`px-2 py-1 text-[10px] font-bold uppercase rounded transition-colors ${centerView === 'allocation' ? 'bg-cyan-600 text-white' : 'text-gray-500 hover:text-gray-300'}`}
                                >
                                    Allocation
                                </button>
                            </div>
                        }
                    >
                        <div className="grid grid-cols-2 gap-4 mb-8">
                            <div className="p-4 bg-gray-800/20 rounded-xl border border-gray-800">
                                <div className="text-[10px] text-gray-500 uppercase font-bold mb-1">Alpha Generation</div>
                                <div className="text-xl font-mono text-white">+14.2%</div>
                            </div>
                            <div className="p-4 bg-gray-800/20 rounded-xl border border-gray-800">
                                <div className="text-[10px] text-gray-500 uppercase font-bold mb-1">Risk Exposure</div>
                                <div className="text-xl font-mono text-yellow-500">MODERATE</div>
                            </div>
                        </div>
                        <div className="h-[400px]">
                            {centerView === 'performance' ? (
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={Array.from({length: 8}, (_, i) => ({ name: `Node ${i}`, value: Math.random() * 100 }))}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} />
                                        <XAxis dataKey="name" stroke="#4b5563" fontSize={10} />
                                        <YAxis stroke="#4b5563" fontSize={10} />
                                        <Tooltip 
                                            contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px' }}
                                            itemStyle={{ color: '#06b6d4' }}
                                        />
                                        <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                                            {Array.from({length: 8}).map((_, index) => (
                                                <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#06b6d4' : '#3b82f6'} />
                                            ))}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            ) : (
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={allocationData}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={60}
                                            outerRadius={100}
                                            paddingAngle={5}
                                            dataKey="value"
                                        >
                                            {allocationData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                        <Tooltip 
                                            contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px' }}
                                            itemStyle={{ color: '#fff' }}
                                        />
                                    </PieChart>
                                </ResponsiveContainer>
                            )}
                        </div>
                        {centerView === 'allocation' && (
                            <div className="grid grid-cols-2 gap-2 mt-4">
                                {allocationData.map((item, idx) => (
                                    <div key={idx} className="flex items-center gap-2 text-xs">
                                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                                        <span className="text-gray-400">{item.name}:</span>
                                        <span className="font-mono font-bold text-white">{item.value}%</span>
                                    </div>
                                ))}
                            </div>
                        )}
                        <div className="mt-8 p-4 bg-cyan-900/10 border border-cyan-500/20 rounded-xl">
                            <div className="flex items-center gap-3 text-cyan-400 mb-2">
                                <BoltIcon />
                                <span className="text-sm font-bold uppercase tracking-widest">AI Optimization Active</span>
                            </div>
                            <p className="text-xs text-gray-400 leading-relaxed">
                                Our proprietary GEIN (Generative Edge & Intelligence Nexus) is currently re-routing liquidity through the Frankfurt-Singapore corridor to minimize latency and maximize yield.
                            </p>
                        </div>
                    </Card>
                </div>

                {/* Right Column: Audit & Security */}
                <div className="lg:col-span-3 space-y-8">
                    <Card title="Immutable Audit Trail" icon={<ShieldIcon />}>
                        <div className="space-y-4 max-h-[600px] overflow-y-auto custom-scrollbar pr-2">
                            {logs.length === 0 && <div className="text-center py-8 text-gray-600 italic text-sm">No sensitive actions recorded in current session.</div>}
                            {logs.map(log => (
                                <div key={log.id} className="p-3 bg-gray-950 border-l-2 border-gray-800 rounded-r-lg">
                                    <div className="flex justify-between items-center mb-1">
                                        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${log.severity === 'CRITICAL' ? 'bg-red-900/40 text-red-400' : 'bg-gray-800 text-gray-400'}`}>
                                            {log.severity}
                                        </span>
                                        <span className="text-[8px] font-mono text-gray-600">{new Date(log.timestamp).toLocaleTimeString()}</span>
                                    </div>
                                    <div className="text-[11px] font-bold text-gray-300 mb-1">{log.action}</div>
                                    <div className="text-[9px] text-gray-500 font-mono truncate">{log.details}</div>
                                    <div className="mt-2 text-[8px] text-cyan-900 font-mono uppercase tracking-tighter">SIG: {log.checksum}</div>
                                </div>
                            ))}
                        </div>
                    </Card>

                    <Card title="Security Status" icon={<ShieldIcon />}>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-3 bg-green-900/10 border border-green-500/20 rounded-lg">
                                <span className="text-xs font-bold text-green-500">MFA STATUS</span>
                                <span className="text-xs font-mono text-white">VERIFIED</span>
                            </div>
                            <div className="flex items-center justify-between p-3 bg-cyan-900/10 border border-cyan-500/20 rounded-lg">
                                <span className="text-xs font-bold text-cyan-500">ENCRYPTION</span>
                                <span className="text-xs font-mono text-white">AES-GCM-256</span>
                            </div>
                            <div className="flex items-center justify-between p-3 bg-purple-900/10 border border-purple-500/20 rounded-lg">
                                <span className="text-xs font-bold text-purple-500">VAULT MODE</span>
                                <span className="text-xs font-mono text-white">HOMOMORPHIC</span>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>

            {/* Modals */}
            {selectedInsight && (
                <div className="fixed inset-0 bg-black/80 z-[105] flex items-center justify-center backdrop-blur-md p-4">
                    <Card
                        title="Strategic Execution Module"
                        icon={<BoltIcon />}
                        className="w-full max-w-2xl animate-in zoom-in duration-200"
                        bodyClassName="p-8"
                        action={
                            <button onClick={() => setSelectedInsight(null)} className="text-gray-500 hover:text-white">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        }
                    >
                        <div className="mb-8">
                            <div className="text-xs font-bold text-cyan-500 uppercase tracking-widest mb-2">Insight Analysis</div>
                            <h2 className="text-2xl font-bold text-white mb-4">{selectedInsight.title}</h2>
                            <p className="text-gray-400 leading-relaxed mb-4">{selectedInsight.description}</p>
                            {selectedInsight.details && (
                                <div className="p-3 bg-gray-950 border border-gray-800 rounded-lg font-mono text-xs text-gray-400">
                                    <span className="text-gray-500">METADATA:</span> {JSON.stringify(selectedInsight.details)}
                                </div>
                            )}
                        </div>

                        <div className="grid grid-cols-3 gap-6 mb-8">
                            <div className="p-4 bg-gray-800/50 rounded-xl border border-gray-700 text-center">
                                <div className="text-[10px] text-gray-500 uppercase font-bold mb-1">Volatility</div>
                                <div className="text-xl font-mono text-white">{selectedInsight.riskAnalysis.volatilityIndex}</div>
                            </div>
                            <div className="p-4 bg-gray-800/50 rounded-xl border border-gray-700 text-center">
                                <div className="text-[10px] text-gray-500 uppercase font-bold mb-1">Sharpe</div>
                                <div className="text-xl font-mono text-green-400">{selectedInsight.riskAnalysis.sharpeRatio}</div>
                            </div>
                            <div className="p-4 bg-gray-800/50 rounded-xl border border-gray-700 text-center">
                                <div className="text-[10px] text-gray-500 uppercase font-bold mb-1">Max DD</div>
                                <div className="text-xl font-mono text-red-400">{selectedInsight.riskAnalysis.maxDrawdown}%</div>
                            </div>
                        </div>

                        <div className="h-48 mb-8 bg-gray-950 rounded-xl border border-gray-800 p-4">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={selectedInsight.backtestData}>
                                    <Line type="monotone" dataKey="value" stroke="#06b6d4" strokeWidth={3} dot={false} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>

                        {selectedInsight.alternativeActions && selectedInsight.alternativeActions.length > 0 && (
                            <div className="mb-8">
                                <div className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Alternative AI Recommendations</div>
                                <div className="space-y-3">
                                    {selectedInsight.alternativeActions.map((alt, idx) => (
                                        <div key={idx} className="p-3 bg-gray-950 border border-gray-800 rounded-lg flex justify-between items-center">
                                            <div>
                                                <div className="text-xs font-bold text-white uppercase">{alt.actionType.replace('_', ' ')}</div>
                                                <div className="text-[11px] text-gray-400">{alt.rationale}</div>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-xs font-mono text-cyan-400 font-bold">{alt.confidence}%</div>
                                                <div className="text-[9px] text-gray-500 uppercase font-bold">Confidence</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="flex gap-4">
                            <button 
                                onClick={() => setSelectedInsight(null)}
                                className="flex-1 px-6 py-4 bg-gray-800 text-white font-bold rounded-xl hover:bg-gray-700 transition-colors"
                            >
                                Decline Strategy
                            </button>
                            <button 
                                onClick={() => executeStrategy(selectedInsight)}
                                className="flex-1 px-6 py-4 bg-cyan-600 text-white font-bold rounded-xl hover:bg-cyan-500 shadow-[0_0_30px_rgba(6,182,212,0.4)] transition-all transform hover:scale-[1.02]"
                            >
                                Execute Strategy
                            </button>
                        </div>
                    </Card>
                </div>
            )}

            {showStripe && (
                <StripeCheckoutModal 
                    amount={stripeData.amount} 
                    recipient={stripeData.recipient} 
                    onClose={() => setShowStripe(false)} 
                    onComplete={() => logAction('STRIPE_PAYMENT_SUCCESS', `Paid ${stripeData.amount} to ${stripeData.recipient}`, 'INFO')}
                />
            )}

            {/* Chatbot */}
            <QuantumChat onAction={handleAIAction} />

            {/* Footer Branding */}
            <div className="mt-12 pt-8 border-t border-gray-900 flex justify-between items-center text-[10px] text-gray-600 font-bold uppercase tracking-[0.2em]">
                <div>© 2026 Quantum Financial Institutional Group. All Rights Reserved.</div>
                <div className="flex gap-6">
                    <span className="hover:text-cyan-500 cursor-pointer transition-colors">Terms of Service</span>
                    <span className="hover:text-cyan-500 cursor-pointer transition-colors">Privacy Protocol</span>
                    <span className="hover:text-cyan-500 cursor-pointer transition-colors">Regulatory Disclosures</span>
                </div>
            </div>
        </div>
    );
};

export default AIInsights;