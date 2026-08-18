// REPOSITORY SOURCE: diplomat-bit/Citibank_Demo_Business_Inc_Demonstration- | PATH: diplomat-bit-Citibank_Demo_Business_Inc_Demonstration--ab2501d/components/dashboard/widgets/AIInsightsWidget.tsx
================================================================================

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { 
    Sparkles, 
    TrendingUp, 
    AlertTriangle, 
    ShieldCheck, 
    RefreshCw, 
    X, 
    ChevronRight, 
    ArrowRight,
    Zap,
    BrainCircuit,
    Lock,
    DollarSign,
    PieChart
} from 'lucide-react';

// Types for the AI Insights ecosystem
export type InsightSeverity = 'low' | 'medium' | 'high' | 'critical';
export type InsightCategory = 'financial' | 'security' | 'opportunity' | 'predictive' | 'budget';

export interface AIInsight {
    id: string;
    category: InsightCategory;
    severity: InsightSeverity;
    title: string;
    description: string;
    detailedAnalysis?: string;
    actionLabel?: string;
    actionUrl?: string;
    confidenceScore: number;
    timestamp: Date;
    isRead: boolean;
    tags: string[];
}

interface AIInsightsWidgetProps {
    userId?: string;
    financialContext?: {
        totalBalance: number;
        monthlySpending: number;
        savingsRate: number;
    };
    refreshInterval?: number; // in milliseconds
    onInsightAction?: (insight: AIInsight) => void;
    className?: string;
}

// Utility for formatting currency
const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(amount);
};

// Mock AI Service generator (simulating the backend logic defined in api/gemini_openai_proxy_api.yaml)
// In a real implementation, this would call the actual API endpoint.
const generateAIInsights = async (context: any): Promise<AIInsight[]> => {
    // Simulating API latency
    await new Promise(resolve => setTimeout(resolve, 1500));

    const insights: AIInsight[] = [
        {
            id: `ins-${Math.random().toString(36).substr(2, 9)}`,
            category: 'opportunity',
            severity: 'high',
            title: 'High Yield Savings Opportunity',
            description: `Based on your average balance of ${formatCurrency(context?.totalBalance || 15000)}, moving 20% to a high-yield account could earn you an extra $450 annually.`,
            detailedAnalysis: "Our AI analysis of current market rates indicates that your operational liquidity is higher than necessary for monthly expenses. The volatility index suggests a low-risk environment for short-term automated investment sweeping.",
            actionLabel: 'Review Portfolio',
            confidenceScore: 0.94,
            timestamp: new Date(),
            isRead: false,
            tags: ['Savings', 'Interest', 'Optimization']
        },
        {
            id: `ins-${Math.random().toString(36).substr(2, 9)}`,
            category: 'predictive',
            severity: 'medium',
            title: 'Projected Subscription Increase',
            description: 'We detected a pattern of 15% yearly increase in your SaaS subscriptions. You may exceed your tech budget by Q3.',
            actionLabel: 'Audit Subscriptions',
            confidenceScore: 0.88,
            timestamp: new Date(),
            isRead: false,
            tags: ['Budget', 'Forecasting']
        },
        {
            id: `ins-${Math.random().toString(36).substr(2, 9)}`,
            category: 'security',
            severity: 'low',
            title: 'Unusual Geo-Location Activity',
            description: 'A login attempt from a new device in Singapore was blocked by Quantum Shield. No action required, just notifying you.',
            actionLabel: 'View Security Logs',
            confidenceScore: 0.99,
            timestamp: new Date(),
            isRead: false,
            tags: ['Security', 'Auth']
        }
    ];

    // Randomly add a critical alert for demonstration
    if (Math.random() > 0.7) {
        insights.unshift({
            id: `ins-crit-${Math.random().toString(36).substr(2, 9)}`,
            category: 'budget',
            severity: 'critical',
            title: 'Spending Velocity Alert',
            description: 'Your spending rate this week is 240% higher than your 6-month rolling average.',
            actionLabel: 'Analyze Spending',
            confidenceScore: 0.98,
            timestamp: new Date(),
            isRead: false,
            tags: ['Spending', 'Alert']
        });
    }

    return insights;
};

const AIInsightsWidget: React.FC<AIInsightsWidgetProps> = ({
    userId,
    financialContext = { totalBalance: 24500, monthlySpending: 3200, savingsRate: 0.15 },
    refreshInterval = 300000,
    onInsightAction,
    className = ''
}) => {
    const [insights, setInsights] = useState<AIInsight[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
    const [selectedInsight, setSelectedInsight] = useState<AIInsight | null>(null);
    const [isAnimating, setIsAnimating] = useState<boolean>(false);
    
    // Ref for interval management
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    const fetchInsights = useCallback(async (isBackgroundRefresh = false) => {
        if (!isBackgroundRefresh) setIsLoading(true);
        setIsAnimating(true);
        
        try {
            const data = await generateAIInsights(financialContext);
            setInsights(prev => {
                // Merge strategy: keep read status of existing IDs, add new ones
                const existingMap = new Map(prev.map(i => [i.id, i]));
                const merged = data.map(newItem => {
                    const existing = existingMap.get(newItem.id);
                    return existing ? { ...newItem, isRead: existing.isRead } : newItem;
                });
                return merged;
            });
            setLastUpdated(new Date());
        } catch (error) {
            console.error("Failed to generate AI insights:", error);
            // In a real app, dispatch to error logging service
        } finally {
            if (!isBackgroundRefresh) setIsLoading(false);
            setTimeout(() => setIsAnimating(false), 500); // Allow animation to finish
        }
    }, [financialContext]);

    // Initial load and interval setup
    useEffect(() => {
        fetchInsights();

        if (refreshInterval > 0) {
            intervalRef.current = setInterval(() => {
                fetchInsights(true);
            }, refreshInterval);
        }

        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [fetchInsights, refreshInterval]);

    const handleDismiss = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        setInsights(prev => prev.filter(i => i.id !== id));
    };

    const handleMarkAsRead = (id: string) => {
        setInsights(prev => prev.map(i => i.id === id ? { ...i, isRead: true } : i));
    };

    const handleInsightClick = (insight: AIInsight) => {
        handleMarkAsRead(insight.id);
        setSelectedInsight(selectedInsight?.id === insight.id ? null : insight);
    };

    const handleActionClick = (insight: AIInsight, e: React.MouseEvent) => {
        e.stopPropagation();
        if (onInsightAction) {
            onInsightAction(insight);
        } else {
            console.log(`Action triggered for ${insight.id}: ${insight.actionLabel}`);
            // Logic to navigate or open modal would go here
        }
    };

    const getSeverityColor = (severity: InsightSeverity) => {
        switch (severity) {
            case 'critical': return 'bg-red-500/10 text-red-600 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800';
            case 'high': return 'bg-orange-500/10 text-orange-600 border-orange-200 dark:bg-orange-900/20 dark:text-orange-400 dark:border-orange-800';
            case 'medium': return 'bg-yellow-500/10 text-yellow-600 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-800';
            case 'low': return 'bg-blue-500/10 text-blue-600 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800';
            default: return 'bg-gray-100 text-gray-600 border-gray-200';
        }
    };

    const getCategoryIcon = (category: InsightCategory) => {
        switch (category) {
            case 'financial': return <DollarSign className="w-4 h-4" />;
            case 'security': return <Lock className="w-4 h-4" />;
            case 'opportunity': return <TrendingUp className="w-4 h-4" />;
            case 'predictive': return <BrainCircuit className="w-4 h-4" />;
            case 'budget': return <PieChart className="w-4 h-4" />;
            default: return <Sparkles className="w-4 h-4" />;
        }
    };

    return (
        <div className={`flex flex-col h-full bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden transition-all duration-300 ${className}`}>
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-800 bg-gradient-to-r from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
                <div className="flex items-center gap-2">
                    <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg text-indigo-600 dark:text-indigo-400">
                        <Sparkles className="w-5 h-5" />
                    </div>
                    <div>
                        <h2 className="font-semibold text-gray-900 dark:text-white leading-tight">AI Financial Advisor</h2>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                            {lastUpdated ? `Updated ${lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}` : 'Initializing...'}
                        </p>
                    </div>
                </div>
                <button 
                    onClick={() => fetchInsights(false)}
                    disabled={isLoading}
                    className={`p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    aria-label="Refresh Insights"
                >
                    <RefreshCw className={`w-4 h-4 text-gray-500 dark:text-gray-400 ${isLoading || isAnimating ? 'animate-spin' : ''}`} />
                </button>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
                {isLoading && insights.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-48 space-y-3">
                        <div className="animate-pulse p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-full">
                            <BrainCircuit className="w-8 h-8 text-indigo-500/50" />
                        </div>
                        <p className="text-sm text-gray-400 animate-pulse">Analyzing financial vectors...</p>
                    </div>
                ) : insights.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-48 text-center px-4">
                        <ShieldCheck className="w-12 h-12 text-green-500 mb-2 opacity-80" />
                        <h3 className="text-gray-900 dark:text-white font-medium">All Systems Nominal</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            Our AI hasn't detected any anomalies or optimization opportunities at this moment.
                        </p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {insights.map((insight) => (
                            <div 
                                key={insight.id}
                                onClick={() => handleInsightClick(insight)}
                                className={`
                                    group relative flex flex-col gap-3 p-4 rounded-xl border transition-all duration-200 cursor-pointer
                                    ${selectedInsight?.id === insight.id 
                                        ? 'bg-indigo-50/50 border-indigo-200 dark:bg-indigo-900/10 dark:border-indigo-800 shadow-md scale-[1.01]' 
                                        : 'bg-white border-gray-200 hover:border-indigo-200 dark:bg-gray-800/50 dark:border-gray-700 dark:hover:border-indigo-900/50 hover:shadow-sm'
                                    }
                                    ${insight.isRead ? 'opacity-90' : 'opacity-100'}
                                `}
                            >
                                {/* Insight Header Row */}
                                <div className="flex items-start gap-3">
                                    <div className={`
                                        flex-shrink-0 mt-1 w-2 h-2 rounded-full
                                        ${insight.isRead ? 'bg-transparent' : 'bg-indigo-500'}
                                    `} />
                                    
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className={`
                                                inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold uppercase tracking-wider border
                                                ${getSeverityColor(insight.severity)}
                                            `}>
                                                {getCategoryIcon(insight.category)}
                                                {insight.category}
                                            </span>
                                            <span className="text-[10px] text-gray-400 font-mono">
                                                {Math.round(insight.confidenceScore * 100)}% CONFIDENCE
                                            </span>
                                        </div>
                                        
                                        <h4 className={`text-sm font-semibold text-gray-900 dark:text-gray-100 ${insight.isRead ? 'font-medium' : 'font-bold'}`}>
                                            {insight.title}
                                        </h4>
                                        
                                        <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 leading-relaxed line-clamp-2">
                                            {insight.description}
                                        </p>
                                    </div>

                                    <button 
                                        onClick={(e) => handleDismiss(insight.id, e)}
                                        className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-opacity text-gray-400 hover:text-gray-600"
                                    >
                                        <X className="w-3.5 h-3.5" />
                                    </button>
                                </div>

                                {/* Expanded Content */}
                                {selectedInsight?.id === insight.id && (
                                    <div className="mt-2 pl-5 animate-in fade-in slide-in-from-top-2 duration-200">
                                        {insight.detailedAnalysis && (
                                            <div className="mb-4 p-3 bg-white dark:bg-gray-900 rounded-lg border border-gray-100 dark:border-gray-700 text-xs text-gray-600 dark:text-gray-300">
                                                <div className="flex items-center gap-2 mb-1 text-indigo-600 dark:text-indigo-400 font-medium text-[10px] uppercase">
                                                    <Zap className="w-3 h-3" />
                                                    Deep Analysis
                                                </div>
                                                {insight.detailedAnalysis}
                                            </div>
                                        )}
                                        
                                        <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-gray-700/50">
                                            <div className="flex gap-1">
                                                {insight.tags.map(tag => (
                                                    <span key={tag} className="text-[10px] text-gray-400 px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 rounded">
                                                        #{tag}
                                                    </span>
                                                ))}
                                            </div>
                                            {insight.actionLabel && (
                                                <button
                                                    onClick={(e) => handleActionClick(insight, e)}
                                                    className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-xs font-medium rounded-lg hover:bg-indigo-600 dark:hover:bg-gray-200 transition-colors shadow-sm"
                                                >
                                                    {insight.actionLabel}
                                                    <ArrowRight className="w-3 h-3" />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                )}
                                
                                {/* Collapsed Interaction Hint */}
                                {selectedInsight?.id !== insight.id && (
                                    <div className="flex justify-end mt-1">
                                        <div className="text-[10px] text-indigo-500 flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity font-medium">
                                            View Details <ChevronRight className="w-3 h-3" />
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
            
            {/* Footer / Status */}
            <div className="px-4 py-3 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-200 dark:border-gray-800 text-[10px] text-gray-400 flex justify-between items-center">
                <span className="flex items-center gap-1.5">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                    </span>
                    AI Engine Online
                </span>
                <span>Powered by Multiverse Financial Projection</span>
            </div>
        </div>
    );
};

export default AIInsightsWidget;