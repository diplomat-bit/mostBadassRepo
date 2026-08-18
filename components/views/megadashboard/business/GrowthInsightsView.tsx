// REPOSITORY SOURCE: diplomat-bit/almost | PATH: diplomat-bit-almost-93a5466/components/views/megadashboard/business/GrowthInsightsView.tsx
================================================================================

// components/views/megadashboard/business/GrowthInsightsView.tsx
import React, { useContext, useMemo, useState } from 'react';
import Card from '../../../Card';
import { DataContext } from '../../../../context/DataContext';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { GoogleGenAI } from "@google/genai";

const GrowthInsightsView: React.FC = () => {
    const context = useContext(DataContext);
    if (!context) throw new Error("GrowthInsightsView must be within DataProvider");
    
    const { growthMetrics } = context; // Placeholder, using static data for now
    const [aiSummary, setAiSummary] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const chartData = [ { month: 'Jan', mau: 12000 }, { month: 'Feb', mau: 12500 }, { month: 'Mar', mau: 14000 }, { month: 'Apr', mau: 15500 }, { month: 'May', mau: 18000 }, { month: 'Jun', mau: 21000 }];

    const handleGenerateSummary = async () => {
        setIsLoading(true); setAiSummary('');
        try {
            const ai = new GoogleGenAI({apiKey: process.env.API_KEY as string});
            const prompt = `Summarize the key takeaways from this user growth data: ${JSON.stringify(chartData)}. Highlight the trend and any potential inflection points.`;
            const response = await ai.models.generateContent({model: 'gemini-2.5-flash', contents: prompt});
            setAiSummary(response.text);
        } catch(err) { console.error(err); } finally { setIsLoading(false); }
    };

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold text-white tracking-wider">Growth Insights</h2>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="text-center"><p className="text-3xl font-bold text-white">21,000</p><p className="text-sm text-gray-400 mt-1">Monthly Active Users</p></Card>
                <Card className="text-center"><p className="text-3xl font-bold text-red-400">2.1%</p><p className="text-sm text-gray-400 mt-1">Monthly Churn</p></Card>
                <Card className="text-center"><p className="text-3xl font-bold text-white">$125</p><p className="text-sm text-gray-400 mt-1">LTV</p></Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <Card title="Monthly Active User Growth">
                        <ResponsiveContainer width="100%" height={300}>
                             <AreaChart data={chartData}><XAxis dataKey="month" stroke="#9ca3af" /><YAxis stroke="#9ca3af" /><Tooltip contentStyle={{ backgroundColor: 'rgba(31, 41, 55, 0.8)', borderColor: '#4b5563' }}/><Area type="monotone" dataKey="mau" stroke="#8884d8" fill="#8884d8" fillOpacity={0.3} /></AreaChart>
                        </ResponsiveContainer>
                    </Card>
                </div>
                <Card title="AI Trend Summary">
                    <div className="flex flex-col justify-between h-full">
                        <div className="min-h-[10rem] text-sm text-gray-300 italic">{isLoading ? 'Analyzing...' : aiSummary}</div>
                        <button onClick={handleGenerateSummary} disabled={isLoading} className="w-full py-2 bg-cyan-600/50 hover:bg-cyan-600 rounded disabled:opacity-50">{isLoading ? '...' : 'Generate AI Summary'}</button>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default GrowthInsightsView;


================================================================================
// APPENDED FROM REPO: diplomat-bit/Citibank_Demo_Business_Inc_Demonstration- | ORIGINAL PATH: diplomat-bit-Citibank_Demo_Business_Inc_Demonstration--ab2501d/components/views/megadashboard/business/GrowthInsightsView.tsx
================================================================================

// components/views/megadashboard/business/GrowthInsightsView.tsx
import React, { useContext, useMemo, useState, useEffect, useCallback } from 'react';
import Card from '../../../Card';
import { DataContext } from '../../../../context/DataContext';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, BarChart, Bar, CartesianGrid, PieChart, Pie, Cell, Legend, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { GoogleGenerativeAI } from "@google/generative-ai";

// --- Utility Types and Interfaces for Growth Metrics ---

/**
 * Represents a single data point for time-series charts.
 */
interface TimeSeriesDataPoint {
    time: string; // e.g., 'Jan', '2023-01-01', 'W1'
    value: number;
    [key: string]: any; // Allow for additional keys like 'mau', 'dau', etc.
}

/**
 * Represents a metric with its current value, trend, and comparison data.
 */
interface GrowthMetricSummary {
    key: string;
    label: string;
    value: string;
    trend: number; // percentage change vs. previous period
    unit?: string;
    isGood?: boolean; // For coloring (green for good, red for bad)
}

/**
 * Structure for AI-generated forecasts.
 */
interface ForecastData {
    period: string; // e.g., 'Q3 2024'
    actual?: number; // Optional, if historical data is included
    forecast: number;
    upperBound: number;
    lowerBound: number;
}

/**
 * Structure for anomaly detection.
 */
interface Anomaly {
    timestamp: string;
    metric: string;
    value: number;
    expectedRange: [number, number];
    severity: 'low' | 'medium' | 'high';
    description: string;
}

/**
 * Interface for segmentation data.
 */
interface SegmentData {
    segment: string;
    value: number;
    change: number; // percentage change
    users: number;
    conversionRate?: number;
    arpu?: number;
}

/**
 * Interface for retention cohort data.
 */
interface CohortData {
    acquisitionMonth: string;
    usersAcquired: number;
    retentionMonths: {
        [monthOffset: string]: number; // e.g., 'M0': 1000, 'M1': 800 (users retained)
    };
}

/**
 * Interface for feature adoption metrics.
 */
interface FeatureAdoptionMetric {
    feature: string;
    totalUsers: number;
    activeUsers: number;
    adoptionRate: number; // percentage
    engagementScore: number; // 0-100
    change: number; // vs previous period
}

/**
 * Interface for A/B test suggestions.
 */
interface ABTestSuggestion {
    id: string;
    hypothesis: string;
    metricToImpact: string;
    potentialGain: string;
    status: 'draft' | 'ready' | 'running';
}

/**
 * Interface for campaign suggestions.
 */
interface CampaignSuggestion {
    id: string;
    name: string;
    targetSegment: string;
    goal: string;
    estimatedImpact: string;
    status: 'draft' | 'ready' | 'running';
}

/**
 * Represents a custom defined metric.
 */
interface CustomMetricDefinition {
    id: string;
    name: string;
    description: string;
    formula: string; // e.g., "DAU / MAU * 100"
    isPublic: boolean;
    createdBy: string;
}

interface NaturalLanguageQuery {
    id: number;
    query: string;
    response: string;
    status: 'pending' | 'complete' | 'error';
}

interface ScenarioSimulation {
    scenario: string;
    impact: Record<string, { change: string, reason: string }>;
}

// --- Constants and Configuration ---
const GROWTH_METRIC_COLORS = {
    mau: '#8884d8',
    dau: '#82ca9d',
    newUsers: '#ffc658',
    churn: '#ff7300',
    ltv: '#0088fe',
    arpu: '#00c49f',
    cac: '#ffbb28',
    conversion: '#a4de6c',
};

const CHART_PERIODS = ['Daily', 'Weekly', 'Monthly', 'Quarterly', 'Annually'];
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF', '#FF194F'];

// --- Helper Functions for Data Generation and Manipulation ---

/**
 * Generates mock time series data.
 */
const generateMockTimeSeries = (
    count: number,
    startValue: number,
    fluctuationRange: number,
    trend: 'up' | 'down' | 'stable' = 'stable',
    keyName: string = 'value',
    labelPrefix: string = 'Day'
): TimeSeriesDataPoint[] => {
    let data: TimeSeriesDataPoint[] = [];
    let currentValue = startValue;
    for (let i = 0; i < count; i++) {
        const fluctuation = (Math.random() * fluctuationRange * 2 - fluctuationRange) / 100;
        currentValue *= (1 + fluctuation);
        if (trend === 'up') currentValue *= 1.01;
        if (trend === 'down') currentValue *= 0.99;
        currentValue = Math.max(0, currentValue);

        data.push({
            time: `${labelPrefix} ${i + 1}`,
            [keyName]: Math.round(currentValue),
        });
    }
    return data;
};

/**
 * Generates mock retention cohort data.
 */
const generateMockRetentionCohorts = (numCohorts: number, baseUsers: number): CohortData[] => {
    const cohorts: CohortData[] = [];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const currentYear = new Date().getFullYear();

    for (let i = 0; i < numCohorts; i++) {
        const acquisitionMonthIndex = (new Date().getMonth() - i + 12) % 12;
        const acquisitionMonth = `${months[acquisitionMonthIndex]} ${currentYear - (i >= new Date().getMonth() + 1 ? 1 : 0)}`;
        const usersAcquired = Math.round(baseUsers * (1 + (Math.random() - 0.5) * 0.2));
        const retentionMonths: { [monthOffset: string]: number } = { 'M0': usersAcquired };

        let previousMonthUsers = usersAcquired;
        for (let j = 1; j <= numCohorts - i; j++) {
            const retentionRate = 0.95 - (j * 0.05) - (Math.random() * 0.02);
            previousMonthUsers = Math.round(previousMonthUsers * retentionRate);
            retentionMonths[`M${j}`] = Math.max(0, previousMonthUsers);
        }

        cohorts.push({ acquisitionMonth, usersAcquired, retentionMonths });
    }
    return cohorts.reverse();
};

/**
 * Generates mock segmentation data.
 */
const generateMockSegmentData = (): SegmentData[] => {
    const segments = [
        { name: 'US East', baseValue: 50000, baseUsers: 150000 },
        { name: 'US West', baseValue: 45000, baseUsers: 140000 },
        { name: 'Europe', baseValue: 30000, baseUsers: 90000 },
        { name: 'Asia', baseValue: 25000, baseUsers: 75000 },
        { name: 'Other', baseValue: 10000, baseUsers: 30000 },
    ];
    return segments.map(s => {
        const value = Math.round(s.baseValue * (1 + (Math.random() - 0.5) * 0.1));
        const users = Math.round(s.baseUsers * (1 + (Math.random() - 0.5) * 0.1));
        const change = parseFloat(((Math.random() * 10 - 5)).toFixed(2));
        const conversionRate = parseFloat((Math.random() * (0.1 - 0.02) + 0.02).toFixed(4));
        const arpu = parseFloat((Math.random() * (150 - 50) + 50).toFixed(2));
        return { segment: s.name, value, change, users, conversionRate, arpu };
    });
};

/**
 * Generates mock funnel conversion data.
 */
const generateMockFunnelData = (): TimeSeriesDataPoint[] => {
    const steps = ['Visitors', 'Signups', 'Trial Starts', 'Paid Subscribers', 'Active Users'];
    let current = 250000;
    const data = steps.map(step => {
        current = Math.round(current * (0.8 - Math.random() * 0.2));
        return { time: step, value: current };
    });
    data[0].value = 300000;
    return data;
};

/**
 * Generates mock feature adoption data.
 */
const generateMockFeatureAdoption = (): FeatureAdoptionMetric[] => {
    return [
        { feature: 'Dashboard Customization', totalUsers: 200000, activeUsers: 120000, adoptionRate: 60, engagementScore: 75, change: 3.2 },
        { feature: 'Advanced Reporting', totalUsers: 210000, activeUsers: 63000, adoptionRate: 30, engagementScore: 60, change: 1.8 },
        { feature: 'Team Collaboration', totalUsers: 180000, activeUsers: 99000, adoptionRate: 55, engagementScore: 80, change: 4.1 },
        { feature: 'Integrations Hub', totalUsers: 150000, activeUsers: 45000, adoptionRate: 30, engagementScore: 50, change: -1.5 },
        { feature: 'Mobile App Usage', totalUsers: 250000, activeUsers: 175000, adoptionRate: 70, engagementScore: 85, change: 5.5 },
    ];
};

/**
 * Formats a number for display.
 */
const formatNumber = (num: number, unit?: string, isCurrency: boolean = false): string => {
    if (isNaN(num)) return 'N/A';
    const formatted = new Intl.NumberFormat('en-US', {
        notation: 'compact',
        compactDisplay: 'short',
        maximumFractionDigits: 1
    }).format(num);
    return isCurrency ? `$${formatted}` : `${formatted}${unit || ''}`;
};

/**
 * Formats a percentage.
 */
const formatPercentage = (num: number): string => {
    if (isNaN(num)) return 'N/A';
    return `${num.toFixed(1)}%`;
};

/**
 * Calculates percentage change.
 */
const calculatePercentageChange = (current: number, previous: number): number => {
    if (previous === 0) return current > 0 ? 100 : 0;
    return ((current - previous) / previous) * 100;
};

// --- AI Interaction Service (within this file for simplicity as per directive) ---

/**
 * Manages interactions with Google GenAI.
 */
class AIGrowthService {
    private ai: GoogleGenerativeAI | null = null;
    private model: string = 'gemini-1.5-flash';

    constructor(apiKey: string | undefined) {
        if (!apiKey) {
            console.warn("API_KEY is missing. AI features will be disabled or simulated.");
        } else {
            this.ai = new GoogleGenerativeAI(apiKey);
        }
    }

    private async generateContent(prompt: string, fallback: any) {
        if (!this.ai) return fallback;
        try {
            const result = await this.ai.getGenerativeModel({ model: this.model }).generateContent(prompt);
            const text = result.response.text();
            const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/);
            if (jsonMatch && jsonMatch[1]) {
                return JSON.parse(jsonMatch[1]);
            }
            // Sometimes the AI returns JSON without the markdown wrapper
            try {
                return JSON.parse(text);
            } catch {
                // If it's not JSON, return the raw text
                return text;
            }
        } catch (error) {
            console.error(`AI generation failed for prompt: ${prompt.substring(0, 100)}...`, error);
            return fallback;
        }
    }
    
    public async generateSummary(data: any, context: string = ''): Promise<string> {
        const prompt = `Please provide a concise summary, highlight key trends, and identify potential inflection points from the following growth data: ${JSON.stringify(data)}. ${context}`;
        const fallback = "AI summary not available. Please check API key and network connection.";
        return this.generateContent(prompt, fallback);
    }

    public async generateForecast(historicalData: TimeSeriesDataPoint[], periodsToForecast: number = 3): Promise<ForecastData[]> {
        const prompt = `Given the following historical time-series data: ${JSON.stringify(historicalData)}.
            Provide a forecast for the next ${periodsToForecast} periods.
            Include the forecasted value, and a plausible upper and lower bound for each period.
            Format the output as a JSON array of objects, each with 'period', 'forecast', 'upperBound', 'lowerBound'.
            Example: [{"period": "Month 1", "forecast": 1000, "upperBound": 1100, "lowerBound": 900}]`;

        const lastDataPoint = historicalData[historicalData.length - 1];
        const fallback: ForecastData[] = [];
        if (lastDataPoint) {
            let lastValue = (lastDataPoint as any).value || (lastDataPoint as any).mau;
            for (let i = 1; i <= periodsToForecast; i++) {
                const forecast = Math.round(lastValue * (1.05 + Math.random() * 0.02));
                fallback.push({
                    period: `Future M${i}`,
                    forecast,
                    upperBound: Math.round(forecast * 1.1),
                    lowerBound: Math.round(forecast * 0.9),
                });
                lastValue = forecast;
            }
        }
        return this.generateContent(prompt, fallback);
    }
    
    public async analyzeAnomalies(data: TimeSeriesDataPoint[], metricName: string): Promise<Anomaly[]> {
        const prompt = `Analyze the following time-series data for ${metricName} and identify any significant anomalies (spikes or drops).
            For each anomaly, provide its timestamp, metric, value, an estimated expected range if it were normal, a severity ('low', 'medium', 'high'), and a brief description.
            Format the output as a JSON array of objects matching the Anomaly interface.
            Data: ${JSON.stringify(data)}`;

        const fallback: Anomaly[] = [
            {
                timestamp: 'May 15',
                metric: metricName,
                value: 25000,
                expectedRange: [18000, 22000],
                severity: 'high',
                description: `Simulated: Unexpected spike in ${metricName} likely due to viral marketing or external event.`
            }
        ];
        return this.generateContent(prompt, fallback);
    }

    public async generateRecommendations(summary: string, trends: any): Promise<(ABTestSuggestion | CampaignSuggestion)[]> {
        const prompt = `Based on the following growth summary and trends, suggest 2-3 actionable growth strategies.
            Format the output as a JSON array of either ABTestSuggestion or CampaignSuggestion interfaces.
            Summary: ${summary}
            Trends: ${JSON.stringify(trends)}`;
        const fallback = [
            { id: 'abtest-001', hypothesis: 'Redesigning signup flow increases conversion by 5%', metricToImpact: 'Signup Conversion Rate', potentialGain: '+5%', status: 'draft' },
            { id: 'campaign-001', name: 'Win-back dormant users', targetSegment: 'Users inactive for >90 days', goal: 'Re-engage 10% of dormant users', estimatedImpact: '+2% MAU', status: 'draft' },
        ];
        return this.generateContent(prompt, fallback);
    }

    public async queryDataWithNL(query: string, dataContext: any): Promise<string> {
        const prompt = `You are a data analyst AI. A user has asked the following question: "${query}". 
        Based on the available data context below, provide a clear, data-driven answer. If you cannot answer from the data, explain why.
        Data Context: ${JSON.stringify(dataContext, null, 2).substring(0, 4000)}...`; // Truncate to avoid excessive length
        const fallback = `I am unable to process your request at the moment. The data context seems to indicate a positive trend in MAU and LTV, while churn is decreasing. Please try rephrasing your question.`;
        return this.generateContent(prompt, fallback);
    }
    
    public async simulateScenario(scenario: string, baseMetrics: any): Promise<ScenarioSimulation> {
        const prompt = `You are a growth strategy AI. A user wants to simulate a scenario: "${scenario}".
        Based on the current base metrics provided below, predict the potential impact on MAU, Churn Rate, and LTV.
        Provide a percentage change for each metric and a brief justification for your prediction.
        Format the output as a JSON object: { scenario: "...", impact: { "MAU": { "change": "+X%", "reason": "..." }, "Churn Rate": { ... }, "LTV": { ... } } }.
        Base Metrics: ${JSON.stringify(baseMetrics)}`;

        const fallback: ScenarioSimulation = {
            scenario,
            impact: {
                "MAU": { change: "+5%", reason: "Simulated: Increased marketing is likely to boost user acquisition." },
                "Churn Rate": { change: "-1%", reason: "Simulated: Better onboarding could improve retention slightly." },
                "LTV": { change: "+3%", reason: "Simulated: Higher engagement from new features may increase lifetime value." }
            }
        };
        return this.generateContent(prompt, fallback);
    }
}

const aiService = new AIGrowthService(process.env.REACT_APP_GOOGLE_API_KEY);

// --- Sub-Components ---

export const MetricCardGrid: React.FC<{ metrics: GrowthMetricSummary[] }> = ({ metrics }) => (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {metrics.map((metric) => (
            <Card key={metric.key} className="text-center p-4 transition-transform transform hover:scale-105">
                <p className={`text-3xl font-bold ${metric.isGood ? 'text-green-400' : 'text-red-400'} text-white`}>{metric.value}</p>
                <p className="text-sm text-gray-400 mt-1">{metric.label}</p>
                {metric.trend !== undefined && (
                    <p className={`text-xs mt-2 ${metric.trend >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                        {metric.trend > 0 ? '▲' : '▼'} {Math.abs(metric.trend).toFixed(1)}% vs. prev.
                    </p>
                )}
            </Card>
        ))}
    </div>
);

export const TrendChartSection: React.FC<{
    mauData: TimeSeriesDataPoint[]; dauData: TimeSeriesDataPoint[]; newUsersData: TimeSeriesDataPoint[]; churnData: TimeSeriesDataPoint[]; ltvData: TimeSeriesDataPoint[]; arpuData: TimeSeriesDataPoint[]; selectedPeriod: string; onPeriodChange: (period: string) => void;
}> = ({ mauData, dauData, newUsersData, churnData, ltvData, arpuData, selectedPeriod, onPeriodChange }) => {

    const chartConfigs = useMemo(() => [
        { title: 'Monthly Active Users (MAU)', data: mauData, dataKey: 'mau', stroke: GROWTH_METRIC_COLORS.mau, fill: GROWTH_METRIC_COLORS.mau, type: 'area' },
        { title: 'Daily Active Users (DAU)', data: dauData, dataKey: 'dau', stroke: GROWTH_METRIC_COLORS.dau, fill: GROWTH_METRIC_COLORS.dau, type: 'area' },
        { title: 'New Users', data: newUsersData, dataKey: 'newUsers', stroke: GROWTH_METRIC_COLORS.newUsers, fill: GROWTH_METRIC_COLORS.newUsers, type: 'bar' },
        { title: 'Monthly Churn Rate', data: churnData, dataKey: 'churn', stroke: GROWTH_METRIC_COLORS.churn, fill: GROWTH_METRIC_COLORS.churn, type: 'line', unit: '%' },
        { title: 'Customer Lifetime Value (LTV)', data: ltvData, dataKey: 'ltv', stroke: GROWTH_METRIC_COLORS.ltv, fill: GROWTH_METRIC_COLORS.ltv, type: 'area', unit: '$' },
        { title: 'Average Revenue Per User (ARPU)', data: arpuData, dataKey: 'arpu', stroke: GROWTH_METRIC_COLORS.arpu, fill: GROWTH_METRIC_COLORS.arpu, type: 'line', unit: '$' },
    ], [mauData, dauData, newUsersData, churnData, ltvData, arpuData]);

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h3 className="text-xl font-semibold text-white">Detailed Growth Trends</h3>
                <div className="flex space-x-2">
                    {CHART_PERIODS.map(period => (
                        <button key={period} onClick={() => onPeriodChange(period)} className={`px-3 py-1 text-sm rounded ${selectedPeriod === period ? 'bg-cyan-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}>
                            {period}
                        </button>
                    ))}
                </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {chartConfigs.map((config) => (
                    <Card key={config.title} title={config.title}>
                        <ResponsiveContainer width="100%" height={250}>
                            {config.type === 'area' ? (
                                <AreaChart data={config.data}>
                                    <XAxis dataKey="time" stroke="#9ca3af" />
                                    <YAxis stroke="#9ca3af" tickFormatter={(value) => formatNumber(value, config.unit)} />
                                    <Tooltip contentStyle={{ backgroundColor: 'rgba(31, 41, 55, 0.8)', borderColor: '#4b5563' }} formatter={(value: number) => formatNumber(value, config.unit)} />
                                    <Area type="monotone" dataKey={config.dataKey} stroke={config.stroke} fill={config.fill} fillOpacity={0.3} />
                                </AreaChart>
                            ) : config.type === 'line' ? (
                                <LineChart data={config.data}>
                                    <XAxis dataKey="time" stroke="#9ca3af" />
                                    <YAxis stroke="#9ca3af" tickFormatter={(value) => formatNumber(value, config.unit)} />
                                    <Tooltip contentStyle={{ backgroundColor: 'rgba(31, 41, 55, 0.8)', borderColor: '#4b5563' }} formatter={(value: number) => formatNumber(value, config.unit)} />
                                    <Line type="monotone" dataKey={config.dataKey} stroke={config.stroke} dot={false} />
                                </LineChart>
                            ) : (
                                <BarChart data={config.data}>
                                    <XAxis dataKey="time" stroke="#9ca3af" />
                                    <YAxis stroke="#9ca3af" tickFormatter={(value) => formatNumber(value, config.unit)} />
                                    <Tooltip contentStyle={{ backgroundColor: 'rgba(31, 41, 55, 0.8)', borderColor: '#4b5563' }} formatter={(value: number) => formatNumber(value, config.unit)} />
                                    <Bar dataKey={config.dataKey} fill={config.fill} />
                                </BarChart>
                            )}
                        </ResponsiveContainer>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export const RetentionCohortChart: React.FC<{ cohortData: CohortData[] }> = ({ cohortData }) => {
    const maxRetentionMonths = useMemo(() => {
        if (!cohortData.length) return 0;
        return Math.max(...cohortData.map(c => Object.keys(c.retentionMonths).length));
    }, [cohortData]);

    const retentionColumns = useMemo(() => {
        const columns: string[] = ['Acquisition Month', 'Acquired Users'];
        for (let i = 0; i < maxRetentionMonths; i++) {
            columns.push(`M${i}`);
        }
        return columns;
    }, [maxRetentionMonths]);

    const getRetentionPercentage = (acquired: number, retained: number) => {
        if (acquired === 0) return 0;
        return (retained / acquired) * 100;
    };

    return (
        <Card title="Retention Cohorts" className="overflow-x-auto">
            <table className="min-w-full text-sm text-gray-300">
                <thead>
                    <tr className="bg-gray-700 text-gray-200">
                        {retentionColumns.map(col => (
                            <th key={col} className="px-4 py-2 text-left font-semibold border-b border-gray-600 whitespace-nowrap">{col}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {cohortData.map((cohort, idx) => (
                        <tr key={cohort.acquisitionMonth} className={idx % 2 === 0 ? 'bg-gray-800' : 'bg-gray-800/70'}>
                            <td className="px-4 py-2 border-b border-gray-700 whitespace-nowrap">{cohort.acquisitionMonth}</td>
                            <td className="px-4 py-2 border-b border-gray-700 whitespace-nowrap">{formatNumber(cohort.usersAcquired)}</td>
                            {Array.from({ length: maxRetentionMonths }).map((_, monthOffset) => {
                                const retainedUsers = cohort.retentionMonths[`M${monthOffset}`] || 0;
                                const percentage = getRetentionPercentage(cohort.usersAcquired, retainedUsers);
                                const cellColor = monthOffset === 0 ? 'text-white' :
                                    percentage > 70 ? 'bg-green-900/50 text-green-300' :
                                        percentage > 40 ? 'bg-yellow-900/50 text-yellow-300' : 'bg-red-900/50 text-red-300';
                                return (
                                    <td key={`${cohort.acquisitionMonth}-M${monthOffset}`} className={`px-4 py-2 border-b border-gray-700 whitespace-nowrap text-center`}>
                                        <div className={`p-1 rounded ${cellColor}`}>
                                            {monthOffset === 0 ? formatNumber(retainedUsers) : `${percentage.toFixed(1)}%`}
                                        </div>
                                    </td>
                                );
                            })}
                        </tr>
                    ))}
                </tbody>
            </table>
        </Card>
    );
};

export const FunnelConversionChart: React.FC<{ funnelData: TimeSeriesDataPoint[] }> = ({ funnelData }) => {
    const CustomTooltip = ({ active, payload }: any) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload;
            const prevValue = funnelData.find((_, i) => funnelData[i+1]?.time === data.time)?.value || data.value;
            const conversion = (data.value / prevValue * 100);
            return (
                <div className="bg-gray-800 p-3 rounded shadow-lg border border-gray-600 text-white text-sm">
                    <p className="font-semibold">{data.time}</p>
                    <p>Users: <span className="text-cyan-400">{formatNumber(data.value)}</span></p>
                    <p>Conversion from previous: <span className="text-green-400">{formatPercentage(conversion)}</span></p>
                </div>
            );
        }
        return null;
    };

    return (
        <Card title="Conversion Funnel Analysis">
            <ResponsiveContainer width="100%" height={300}>
                <BarChart layout="vertical" data={funnelData.slice().reverse()} margin={{ top: 20, right: 30, left: 40, bottom: 5 }}>
                    <XAxis type="number" stroke="#9ca3af" tickFormatter={(value) => formatNumber(value)} />
                    <YAxis dataKey="time" type="category" stroke="#9ca3af" width={100} />
                    <Tooltip content={CustomTooltip} />
                    <Bar dataKey="value" fill="#8884d8" barSize={30}>
                        {funnelData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </Card>
    );
};

export const ForecastingSection: React.FC<{
    historicalData: TimeSeriesDataPoint[]; selectedPeriod: string; forecasts: ForecastData[]; isLoadingForecast: boolean; onGenerateForecast: () => void;
}> = ({ historicalData, selectedPeriod, forecasts, isLoadingForecast, onGenerateForecast }) => {

    const chartData = useMemo(() => {
        const histData = historicalData.map(d => ({ ...d, type: 'actual' }));
        const forecastData = forecasts.map(f => ({
            time: f.period,
            value: f.forecast,
            bounds: [f.lowerBound, f.upperBound],
            type: 'forecast'
        }));
        return [...histData, ...forecastData];
    }, [historicalData, forecasts]);

    return (
        <Card title={`Growth Forecast (${selectedPeriod})`} className="flex flex-col h-full">
            <div className="flex-grow">
                <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#4b5563" />
                        <XAxis dataKey="time" stroke="#9ca3af" />
                        <YAxis stroke="#9ca3af" tickFormatter={(value) => formatNumber(value)} />
                        <Tooltip contentStyle={{ backgroundColor: 'rgba(31, 41, 55, 0.8)', borderColor: '#4b5563' }} />
                        <Legend />
                        <Area type="monotone" dataKey="value" stroke={GROWTH_METRIC_COLORS.mau} fill={GROWTH_METRIC_COLORS.mau} fillOpacity={0.3} name="Actual/Forecast" />
                        <Area type="monotone" dataKey="bounds" stroke="#82ca9d" fill="#82ca9d" strokeDasharray="5 5" fillOpacity={0.2} name="Confidence Interval" />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
            <button onClick={onGenerateForecast} disabled={isLoadingForecast} className="w-full mt-4 py-2 bg-purple-600/50 hover:bg-purple-600 rounded disabled:opacity-50 text-white">
                {isLoadingForecast ? 'Generating Forecast...' : 'Generate AI Forecast'}
            </button>
            <div className="mt-4 text-sm text-gray-400 italic">
                <p>AI-powered forecast based on historical data and projected trends.</p>
                {forecasts.length > 0 && (
                    <div className="mt-2 grid grid-cols-2 gap-2">
                        {forecasts.map((f, i) => (
                            <div key={i} className="flex justify-between items-center text-xs bg-gray-700 p-2 rounded">
                                <span>{f.period}:</span>
                                <span>{formatNumber(f.forecast)} ({formatNumber(f.lowerBound)}-{formatNumber(f.upperBound)})</span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </Card>
    );
};

export const AnomalyDetectionSection: React.FC<{
    anomalies: Anomaly[]; isLoadingAnomalies: boolean; onAnalyzeAnomalies: () => void;
}> = ({ anomalies, isLoadingAnomalies, onAnalyzeAnomalies }) => (
    <Card title="Anomaly Detection" className="flex flex-col h-full">
        <div className="flex-grow min-h-[10rem]">
            {isLoadingAnomalies ? (
                <p className="text-gray-400 italic">Analyzing data for anomalies...</p>
            ) : anomalies.length === 0 ? (
                <p className="text-gray-400">No significant anomalies detected in the selected period.</p>
            ) : (
                <ul className="space-y-3 text-sm">
                    {anomalies.map((anomaly, index) => (
                        <li key={index} className="border-l-4 border-red-500 pl-3 py-1">
                            <p className="font-semibold text-white">{anomaly.timestamp} - {anomaly.metric}</p>
                            <p className="text-gray-300">Value: <span className="text-red-400 font-bold">{formatNumber(anomaly.value)}</span> (Expected: {formatNumber(anomaly.expectedRange[0])}-{formatNumber(anomaly.expectedRange[1])})</p>
                            <p className="text-gray-400 italic text-xs mt-1">{anomaly.description}</p>
                            <span className={`text-xs px-2 py-0.5 rounded-full ${anomaly.severity === 'high' ? 'bg-red-900 text-red-300' : anomaly.severity === 'medium' ? 'bg-yellow-900 text-yellow-300' : 'bg-green-900 text-green-300'}`}>
                                {anomaly.severity}
                            </span>
                        </li>
                    ))}
                </ul>
            )}
        </div>
        <button onClick={onAnalyzeAnomalies} disabled={isLoadingAnomalies} className="w-full mt-4 py-2 bg-red-600/50 hover:bg-red-600 rounded disabled:opacity-50 text-white">
            {isLoadingAnomalies ? 'Detecting...' : 'Run Anomaly Detection'}
        </button>
    </Card>
);

export const SegmentationTable: React.FC<{ segmentData: SegmentData[] }> = ({ segmentData }) => (
    <Card title="User Segmentation Breakdown" className="overflow-x-auto">
        <table className="min-w-full text-sm text-gray-300">
            <thead>
                <tr className="bg-gray-700 text-gray-200">
                    <th className="px-4 py-2 text-left font-semibold border-b border-gray-600">Segment</th>
                    <th className="px-4 py-2 text-left font-semibold border-b border-gray-600">Total Users</th>
                    <th className="px-4 py-2 text-left font-semibold border-b border-gray-600">Growth (%)</th>
                    <th className="px-4 py-2 text-left font-semibold border-b border-gray-600">Conversion Rate</th>
                    <th className="px-4 py-2 text-left font-semibold border-b border-gray-600">ARPU</th>
                    <th className="px-4 py-2 text-left font-semibold border-b border-gray-600">Value Contributed</th>
                </tr>
            </thead>
            <tbody>
                {segmentData.map((segment, idx) => (
                    <tr key={segment.segment} className={idx % 2 === 0 ? 'bg-gray-800' : 'bg-gray-800/70'}>
                        <td className="px-4 py-2 border-b border-gray-700 whitespace-nowrap">{segment.segment}</td>
                        <td className="px-4 py-2 border-b border-gray-700 whitespace-nowrap">{formatNumber(segment.users)}</td>
                        <td className={`px-4 py-2 border-b border-gray-700 whitespace-nowrap ${segment.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                            {segment.change > 0 ? '▲' : '▼'} {formatPercentage(Math.abs(segment.change))}
                        </td>
                        <td className="px-4 py-2 border-b border-gray-700 whitespace-nowrap">{formatPercentage(segment.conversionRate! * 100)}</td>
                        <td className="px-4 py-2 border-b border-gray-700 whitespace-nowrap">{formatNumber(segment.arpu!, '$', true)}</td>
                        <td className="px-4 py-2 border-b border-gray-700 whitespace-nowrap">{formatNumber(segment.value, '$', true)}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    </Card>
);

export const ActionableInsightsPanel: React.FC<{
    insights: (ABTestSuggestion | CampaignSuggestion)[]; isLoadingInsights: boolean; onGenerateInsights: () => void;
}> = ({ insights, isLoadingInsights, onGenerateInsights }) => (
    <Card title="Actionable Growth Insights" className="flex flex-col h-full">
        <div className="flex-grow min-h-[10rem]">
            {isLoadingInsights ? (
                <p className="text-gray-400 italic">Generating actionable recommendations...</p>
            ) : insights.length === 0 ? (
                <p className="text-gray-400">Click to generate AI-powered growth strategies.</p>
            ) : (
                <div className="space-y-4">
                    {insights.map((insight, index) => (
                        <div key={insight.id} className="p-3 bg-gray-700 rounded shadow">
                            {'hypothesis' in insight ? (
                                <>
                                    <h4 className="font-semibold text-cyan-400">A/B Test Suggestion: {insight.id}</h4>
                                    <p className="text-sm text-gray-300">Hypothesis: <span className="italic">{insight.hypothesis}</span></p>
                                    <p className="text-xs text-gray-400 mt-1">Impacts: {insight.metricToImpact} | Potential Gain: {insight.potentialGain}</p>
                                </>
                            ) : (
                                <>
                                    <h4 className="font-semibold text-purple-400">Campaign Suggestion: {insight.name}</h4>
                                    <p className="text-sm text-gray-300">Goal: <span className="italic">{insight.goal}</span></p>
                                    <p className="text-xs text-gray-400 mt-1">Target: {insight.targetSegment} | Est. Impact: {insight.estimatedImpact}</p>
                                </>
                            )}
                            <span className="text-xs px-2 py-0.5 mt-2 inline-block rounded-full bg-blue-900 text-blue-300 capitalize">{insight.status}</span>
                            <button className="ml-3 text-xs text-blue-400 hover:underline">Launch/Review</button>
                        </div>
                    ))}
                </div>
            )}
        </div>
        <button onClick={onGenerateInsights} disabled={isLoadingInsights} className="w-full mt-4 py-2 bg-blue-600/50 hover:bg-blue-600 rounded disabled:opacity-50 text-white">
            {isLoadingInsights ? 'Generating Insights...' : 'Generate Actionable Insights'}
        </button>
    </Card>
);

export const AdvancedFilterPanel: React.FC<{
    selectedDateRange: string; onDateRangeChange: (range: string) => void; selectedSegment: string; onSegmentChange: (segment: string) => void; availableSegments: string[];
}> = ({ selectedDateRange, onDateRangeChange, selectedSegment, onSegmentChange, availableSegments }) => {
    const dateRanges = ['Last 7 Days', 'Last 30 Days', 'Last 90 Days', 'This Quarter', 'Last Year', 'All Time'];
    return (
        <Card title="Advanced Filters">
            <div className="space-y-4">
                <div>
                    <label htmlFor="date-range" className="block text-sm font-medium text-gray-300 mb-1">Date Range</label>
                    <select id="date-range" value={selectedDateRange} onChange={(e) => onDateRangeChange(e.target.value)} className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white text-sm focus:ring-cyan-500 focus:border-cyan-500">
                        {dateRanges.map(range => (<option key={range} value={range}>{range}</option>))}
                    </select>
                </div>
                <div>
                    <label htmlFor="segment-filter" className="block text-sm font-medium text-gray-300 mb-1">Segment Filter</label>
                    <select id="segment-filter" value={selectedSegment} onChange={(e) => onSegmentChange(e.target.value)} className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white text-sm focus:ring-cyan-500 focus:border-cyan-500">
                        <option value="All">All Segments</option>
                        {availableSegments.map(segment => (<option key={segment} value={segment}>{segment}</option>))}
                    </select>
                </div>
                <button className="w-full py-2 bg-green-600/50 hover:bg-green-600 rounded text-white">Apply Filters</button>
            </div>
        </Card>
    );
};

export const FeatureAdoptionMetrics: React.FC<{ featureAdoptionData: FeatureAdoptionMetric[] }> = ({ featureAdoptionData }) => (
    <Card title="Feature Adoption & Engagement" className="overflow-x-auto">
        <table className="min-w-full text-sm text-gray-300">
            <thead>
                <tr className="bg-gray-700 text-gray-200">
                    <th className="px-4 py-2 text-left font-semibold border-b border-gray-600">Feature</th>
                    <th className="px-4 py-2 text-left font-semibold border-b border-gray-600">Adoption Rate</th>
                    <th className="px-4 py-2 text-left font-semibold border-b border-gray-600">Engagement Score</th>
                    <th className="px-4 py-2 text-left font-semibold border-b border-gray-600">Change (30D)</th>
                </tr>
            </thead>
            <tbody>
                {featureAdoptionData.map((feature, idx) => (
                    <tr key={feature.feature} className={idx % 2 === 0 ? 'bg-gray-800' : 'bg-gray-800/70'}>
                        <td className="px-4 py-2 border-b border-gray-700 whitespace-nowrap">{feature.feature}</td>
                        <td className="px-4 py-2 border-b border-gray-700 whitespace-nowrap">{formatPercentage(feature.adoptionRate)}</td>
                        <td className="px-4 py-2 border-b border-gray-700 whitespace-nowrap">{feature.engagementScore.toFixed(0)}/100</td>
                        <td className={`px-4 py-2 border-b border-gray-700 whitespace-nowrap ${feature.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                            {feature.change > 0 ? '▲' : '▼'} {formatPercentage(Math.abs(feature.change))}
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    </Card>
);

export const CustomMetricBuilder: React.FC<{
    onSaveMetric: (metric: CustomMetricDefinition) => void; existingMetrics: CustomMetricDefinition[];
}> = ({ onSaveMetric, existingMetrics }) => {
    const [name, setName] = useState('');
    const [formula, setFormula] = useState('');
    const [description, setDescription] = useState('');
    const [isPublic, setIsPublic] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (name && formula) {
            onSaveMetric({
                id: `custom-${existingMetrics.length + 1}`, name, formula, description, isPublic, createdBy: 'Current User'
            });
            setName(''); setFormula(''); setDescription(''); setIsPublic(false);
        }
    };

    return (
        <Card title="Custom Metric Builder">
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="metric-name" className="block text-sm font-medium text-gray-300 mb-1">Metric Name</label>
                    <input type="text" id="metric-name" value={name} onChange={(e) => setName(e.target.value)} className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white text-sm" placeholder="e.g., Conversion Rate to Paid" required />
                </div>
                <div>
                    <label htmlFor="metric-formula" className="block text-sm font-medium text-gray-300 mb-1">Formula (e.g., DAU / MAU * 100)</label>
                    <textarea id="metric-formula" value={formula} onChange={(e) => setFormula(e.target.value)} className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white text-sm resize-y" rows={3} placeholder="Enter mathematical formula using existing metrics" required ></textarea>
                </div>
                <div>
                    <label htmlFor="metric-description" className="block text-sm font-medium text-gray-300 mb-1">Description</label>
                    <input type="text" id="metric-description" value={description} onChange={(e) => setDescription(e.target.value)} className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white text-sm" placeholder="Brief description of the metric" />
                </div>
                <div className="flex items-center">
                    <input type="checkbox" id="is-public" checked={isPublic} onChange={(e) => setIsPublic(e.target.checked)} className="h-4 w-4 text-cyan-600 focus:ring-cyan-500 border-gray-600 rounded bg-gray-700" />
                    <label htmlFor="is-public" className="ml-2 block text-sm text-gray-300">Make this metric public?</label>
                </div>
                <button type="submit" className="w-full py-2 bg-indigo-600/50 hover:bg-indigo-600 rounded text-white">Save Custom Metric</button>
            </form>
            <div className="mt-6">
                <h3 className="text-lg font-semibold text-gray-200 mb-3">Your Custom Metrics</h3>
                {existingMetrics.length === 0 ? (<p className="text-gray-400 italic text-sm">No custom metrics defined yet.</p>) : (
                    <ul className="space-y-2">
                        {existingMetrics.map(metric => (
                            <li key={metric.id} className="bg-gray-700 p-2 rounded text-sm flex justify-between items-center">
                                <div>
                                    <p className="text-white font-medium">{metric.name}</p>
                                    <p className="text-gray-400 text-xs italic">Formula: {metric.formula}</p>
                                </div>
                                <span className={`px-2 py-0.5 rounded-full text-xs ${metric.isPublic ? 'bg-green-900 text-green-300' : 'bg-gray-900 text-gray-300'}`}>{metric.isPublic ? 'Public' : 'Private'}</span>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </Card>
    );
};

export const NaturalLanguageQueryInterface: React.FC<{
    onQuery: (query: string) => void;
    history: NaturalLanguageQuery[];
}> = ({ onQuery, history }) => {
    const [query, setQuery] = useState('');

    const handleQuery = () => {
        if (query.trim()) {
            onQuery(query.trim());
            setQuery('');
        }
    };
    
    return (
        <Card title="Ask AI About Your Data">
            <div className="space-y-4">
                <div className="h-64 overflow-y-auto bg-gray-800 p-3 rounded space-y-3">
                    {history.map(item => (
                        <div key={item.id}>
                            <p className="text-cyan-400 text-sm font-semibold">You: {item.query}</p>
                            <p className="text-gray-300 text-sm mt-1 whitespace-pre-wrap">{item.status === 'pending' ? 'Thinking...' : item.response}</p>
                        </div>
                    ))}
                </div>
                <div className="flex space-x-2">
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleQuery()}
                        placeholder="e.g., 'What was our biggest driver of new users last month?'"
                        className="flex-grow p-2 bg-gray-700 border border-gray-600 rounded text-white text-sm"
                    />
                    <button onClick={handleQuery} className="py-2 px-4 bg-cyan-600/50 hover:bg-cyan-600 rounded text-white">Ask</button>
                </div>
            </div>
        </Card>
    );
};

export const ScenarioModelingTool: React.FC<{
    onSimulate: (scenario: string) => void;
    simulationResult: ScenarioSimulation | null;
    isLoading: boolean;
}> = ({ onSimulate, simulationResult, isLoading }) => {
    const [scenario, setScenario] = useState('');
    
    return (
        <Card title="AI-Powered Scenario Modeler">
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Describe a scenario:</label>
                    <textarea
                        value={scenario}
                        onChange={e => setScenario(e.target.value)}
                        placeholder="e.g., 'Double marketing spend on social media and launch a referral program with 20% discounts.'"
                        className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white text-sm"
                        rows={3}
                    />
                </div>
                <button onClick={() => onSimulate(scenario)} disabled={isLoading || !scenario} className="w-full py-2 bg-purple-600/50 hover:bg-purple-600 rounded text-white disabled:opacity-50">
                    {isLoading ? "Simulating..." : "Simulate Impact"}
                </button>
                {simulationResult && (
                    <div className="mt-4 p-3 bg-gray-800 rounded">
                        <h4 className="font-semibold text-purple-400">Simulation for: "{simulationResult.scenario}"</h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-2 text-center">
                            {Object.entries(simulationResult.impact).map(([metric, result]) => (
                                <div key={metric} className="p-2 bg-gray-700 rounded">
                                    <p className="text-sm text-gray-400">{metric}</p>
                                    <p className={`text-xl font-bold ${result.change.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>{result.change}</p>
                                    <p className="text-xs text-gray-500 italic mt-1">{result.reason}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </Card>
    );
};


/**
 * Main Growth Insights View Component.
 */
const GrowthInsightsView: React.FC = () => {
    const context = useContext(DataContext);
    if (!context) throw new Error("GrowthInsightsView must be within DataProvider");

    const [aiSummary, setAiSummary] = useState('');
    const [isLoadingSummary, setIsLoadingSummary] = useState(false);
    const [selectedPeriod, setSelectedPeriod] = useState<string>('Monthly');

    const [forecasts, setForecasts] = useState<ForecastData[]>([]);
    const [isLoadingForecast, setIsLoadingForecast] = useState(false);

    const [anomalies, setAnomalies] = useState<Anomaly[]>([]);
    const [isLoadingAnomalies, setIsLoadingAnomalies] = useState(false);

    const [actionableInsights, setActionableInsights] = useState<(ABTestSuggestion | CampaignSuggestion)[]>([]);
    const [isLoadingInsights, setIsLoadingInsights] = useState(false);

    const [selectedDateRange, setSelectedDateRange] = useState('Last 30 Days');
    const [selectedSegment, setSelectedSegment] = useState('All');

    const [customMetrics, setCustomMetrics] = useState<CustomMetricDefinition[]>([]);
    
    const [nlqHistory, setNlqHistory] = useState<NaturalLanguageQuery[]>([]);
    const [simulationResult, setSimulationResult] = useState<ScenarioSimulation | null>(null);
    const [isSimulating, setIsSimulating] = useState(false);

    // --- Mock Data Generation based on selectedPeriod ---
    const mauData = useMemo(() => generateMockTimeSeries(selectedPeriod === 'Daily' ? 30 : selectedPeriod === 'Weekly' ? 12 : 6, 20000, 7, 'up', 'mau', selectedPeriod.substring(0, 1)), [selectedPeriod]);
    const dauData = useMemo(() => generateMockTimeSeries(selectedPeriod === 'Daily' ? 30 : selectedPeriod === 'Weekly' ? 12 : 6, 8000, 10, 'up', 'dau', selectedPeriod.substring(0, 1)), [selectedPeriod]);
    const newUsersData = useMemo(() => generateMockTimeSeries(selectedPeriod === 'Daily' ? 30 : selectedPeriod === 'Weekly' ? 12 : 6, 1500, 15, 'up', 'newUsers', selectedPeriod.substring(0, 1)), [selectedPeriod]);
    const churnData = useMemo(() => generateMockTimeSeries(selectedPeriod === 'Daily' ? 30 : selectedPeriod === 'Weekly' ? 12 : 6, 2.1, 0.5, 'down', 'churn', selectedPeriod.substring(0, 1)), [selectedPeriod]);
    const ltvData = useMemo(() => generateMockTimeSeries(selectedPeriod === 'Daily' ? 30 : selectedPeriod === 'Weekly' ? 12 : 6, 125, 8, 'up', 'ltv', selectedPeriod.substring(0, 1)), [selectedPeriod]);
    const arpuData = useMemo(() => generateMockTimeSeries(selectedPeriod === 'Daily' ? 30 : selectedPeriod === 'Weekly' ? 12 : 6, 15, 5, 'up', 'arpu', selectedPeriod.substring(0, 1)), [selectedPeriod]);

    const retentionCohorts = useMemo(() => generateMockRetentionCohorts(6, 5000), []);
    const segmentData = useMemo(() => generateMockSegmentData(), []);
    const funnelData = useMemo(() => generateMockFunnelData(), []);
    const featureAdoptionData = useMemo(() => generateMockFeatureAdoption(), []);

    const availableSegments = useMemo(() => segmentData.map(s => s.segment), [segmentData]);
    
    const latestMau = mauData.length > 0 ? (mauData[mauData.length - 1] as any).mau : 0;
    const prevMau = mauData.length > 1 ? (mauData[mauData.length - 2] as any).mau : 0;
    const mauTrend = calculatePercentageChange(latestMau, prevMau);
    const latestChurn = churnData.length > 0 ? (churnData[churnData.length - 1] as any).churn : 0;
    const latestLTV = ltvData.length > 0 ? (ltvData[ltvData.length - 1] as any).ltv : 0;
    const latestARPU = arpuData.length > 0 ? (arpuData[arpuData.length - 1] as any).arpu : 0;

    const summaryMetrics: GrowthMetricSummary[] = useMemo(() => {
        const latestDau = dauData.length > 0 ? (dauData[dauData.length - 1] as any).dau : 0;
        const prevDau = dauData.length > 1 ? (dauData[dauData.length - 2] as any).dau : 0;
        const dauTrend = calculatePercentageChange(latestDau, prevDau);
        const prevChurn = churnData.length > 1 ? (churnData[churnData.length - 2] as any).churn : 0;
        const churnTrend = calculatePercentageChange(latestChurn, prevChurn);
        const prevLTV = ltvData.length > 1 ? (ltvData[ltvData.length - 2] as any).ltv : 0;
        const ltvTrend = calculatePercentageChange(latestLTV, prevLTV);
        const latestNewUsers = newUsersData.length > 0 ? (newUsersData[newUsersData.length - 1] as any).newUsers : 0;
        const prevNewUsers = newUsersData.length > 1 ? (newUsersData[newUsersData.length - 2] as any).newUsers : 0;
        const newUsersTrend = calculatePercentageChange(latestNewUsers, prevNewUsers);
        const prevARPU = arpuData.length > 1 ? (arpuData[arpuData.length - 2] as any).arpu : 0;
        const arpuTrend = calculatePercentageChange(latestARPU, prevARPU);
        
        return [
            { key: 'mau', label: 'Monthly Active Users', value: formatNumber(latestMau), trend: mauTrend, isGood: mauTrend >= 0 },
            { key: 'dau', label: 'Daily Active Users', value: formatNumber(latestDau), trend: dauTrend, isGood: dauTrend >= 0 },
            { key: 'newUsers', label: 'New Users (Period)', value: formatNumber(latestNewUsers), trend: newUsersTrend, isGood: newUsersTrend >= 0 },
            { key: 'churn', label: 'Monthly Churn Rate', value: formatPercentage(latestChurn), trend: churnTrend, isGood: churnTrend <= 0 },
            { key: 'ltv', label: 'Customer Lifetime Value', value: formatNumber(latestLTV, '$', true), trend: ltvTrend, isGood: ltvTrend >= 0 },
            { key: 'arpu', label: 'ARPU', value: formatNumber(latestARPU, '$', true), trend: arpuTrend, isGood: arpuTrend >= 0 },
            { key: 'arr', label: 'Annual Recurring Revenue', value: formatNumber(latestARPU * latestMau * 12, '$', true), trend: (mauTrend + arpuTrend) / 2, isGood: (mauTrend + arpuTrend) / 2 >= 0 },
            { key: 'cac', label: 'Customer Acquisition Cost', value: formatNumber(75), trend: -5, isGood: true },
            { key: 'conversion', label: 'Trial-to-Paid Conv.', value: formatPercentage(15), trend: 2, isGood: true },
            { key: 'referral', label: 'Referral Signups', value: formatNumber(1500), trend: 10, isGood: true },
        ];
    }, [mauData, dauData, newUsersData, churnData, ltvData, arpuData, latestMau, latestARPU, mauTrend, latestLTV, latestChurn]);


    // --- AI Interaction Handlers ---
    const handleGenerateSummary = useCallback(async () => {
        setIsLoadingSummary(true);
        setAiSummary('');
        const summary = await aiService.generateSummary(mauData, `Focus on the ${selectedPeriod} trend.`);
        setAiSummary(summary);
        setIsLoadingSummary(false);
    }, [mauData, selectedPeriod]);

    const handleGenerateForecast = useCallback(async () => {
        setIsLoadingForecast(true);
        setForecasts([]);
        const forecastResult = await aiService.generateForecast(mauData, selectedPeriod === 'Daily' ? 7 : selectedPeriod === 'Weekly' ? 4 : 3);
        setForecasts(forecastResult);
        setIsLoadingForecast(false);
    }, [mauData, selectedPeriod]);

    const handleAnalyzeAnomalies = useCallback(async () => {
        setIsLoadingAnomalies(true);
        setAnomalies([]);
        const detectedAnomalies = await aiService.analyzeAnomalies(mauData, 'MAU');
        setAnomalies(detectedAnomalies);
        setIsLoadingAnomalies(false);
    }, [mauData]);

    const handleGenerateActionableInsights = useCallback(async () => {
        setIsLoadingInsights(true);
        setActionableInsights([]);
        const churnTrend = calculatePercentageChange(latestChurn, churnData.length > 1 ? (churnData[churnData.length - 2] as any).churn : 0);
        const ltvTrend = calculatePercentageChange(latestLTV, ltvData.length > 1 ? (ltvData[ltvData.length - 2] as any).ltv : 0);
        const generatedInsights = await aiService.generateRecommendations(aiSummary, { mauTrend, churnTrend, ltvTrend, segmentData });
        setActionableInsights(generatedInsights);
        setIsLoadingInsights(false);
    }, [aiSummary, mauTrend, latestChurn, latestLTV, segmentData, churnData, ltvData]);
    
    const handleNlQuery = useCallback(async (query: string) => {
        const queryId = Date.now();
        setNlqHistory(prev => [...prev, {id: queryId, query, response: '', status: 'pending'}]);
        
        const dataContext = { summaryMetrics, mauData, segmentData }; // Provide relevant context
        const response = await aiService.queryDataWithNL(query, dataContext);
        
        setNlqHistory(prev => prev.map(item => item.id === queryId ? {...item, response, status: 'complete'} : item));
    }, [summaryMetrics, mauData, segmentData]);
    
    const handleSimulateScenario = useCallback(async (scenario: string) => {
        setIsSimulating(true);
        setSimulationResult(null);
        const baseMetrics = { MAU: latestMau, "Churn Rate": latestChurn, LTV: latestLTV };
        const result = await aiService.simulateScenario(scenario, baseMetrics);
        setSimulationResult(result);
        setIsSimulating(false);
    }, [latestMau, latestChurn, latestLTV]);

    const handleSaveCustomMetric = (metric: CustomMetricDefinition) => {
        setCustomMetrics(prev => [...prev, metric]);
    };

    return (
        <div className="space-y-8 p-4 md:p-8 bg-gray-900 min-h-screen">
            <h2 className="text-4xl font-extrabold text-white tracking-wide border-b border-gray-700 pb-4">Comprehensive Growth Insights Dashboard</h2>

            <MetricCardGrid metrics={summaryMetrics} />

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                <div className="lg:col-span-3">
                    <TrendChartSection mauData={mauData} dauData={dauData} newUsersData={newUsersData} churnData={churnData} ltvData={ltvData} arpuData={arpuData} selectedPeriod={selectedPeriod} onPeriodChange={setSelectedPeriod} />
                </div>
                <div className="lg:col-span-1 flex flex-col space-y-6">
                    <Card title="AI Trend Summary" className="flex flex-col h-full">
                        <div className="flex-grow min-h-[10rem] text-sm text-gray-300 italic overflow-y-auto">
                            {isLoadingSummary ? <p>Analyzing...</p> : aiSummary || 'Click "Generate AI Summary" to get an automated analysis.'}
                        </div>
                        <button onClick={handleGenerateSummary} disabled={isLoadingSummary} className="w-full mt-4 py-2 bg-cyan-600/50 hover:bg-cyan-600 rounded disabled:opacity-50 text-white">
                            {isLoadingSummary ? 'Analyzing...' : 'Generate AI Summary'}
                        </button>
                    </Card>
                    <AdvancedFilterPanel selectedDateRange={selectedDateRange} onDateRangeChange={setSelectedDateRange} selectedSegment={selectedSegment} onSegmentChange={setSelectedSegment} availableSegments={availableSegments}/>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <NaturalLanguageQueryInterface onQuery={handleNlQuery} history={nlqHistory} />
                <ScenarioModelingTool onSimulate={handleSimulateScenario} simulationResult={simulationResult} isLoading={isSimulating} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <RetentionCohortChart cohortData={retentionCohorts} />
                <FunnelConversionChart funnelData={funnelData} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ForecastingSection historicalData={mauData} selectedPeriod={selectedPeriod} forecasts={forecasts} isLoadingForecast={isLoadingForecast} onGenerateForecast={handleGenerateForecast}/>
                <AnomalyDetectionSection anomalies={anomalies} isLoadingAnomalies={isLoadingAnomalies} onAnalyzeAnomalies={handleAnalyzeAnomalies} />
            </div>

            <SegmentationTable segmentData={segmentData} />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ActionableInsightsPanel insights={actionableInsights} isLoadingInsights={isLoadingInsights} onGenerateInsights={handleGenerateActionableInsights} />
                <FeatureAdoptionMetrics featureAdoptionData={featureAdoptionData} />
            </div>

            <CustomMetricBuilder onSaveMetric={handleSaveCustomMetric} existingMetrics={customMetrics} />

            <Card title="Growth Strategy Playbook" className="space-y-4">
                <h3 className="text-xl font-semibold text-white mb-3">Popular Growth Strategies</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm text-gray-300">
                    <div className="p-4 bg-gray-800 rounded shadow">
                        <h4 className="font-bold text-cyan-400">Onboarding Flow Optimization</h4>
                        <p className="mt-1">Analyze user drop-off points in the initial signup and first-use experience. Implement A/B tests on key screens, messaging, and calls-to-action to improve new user activation.</p>
                    </div>
                    <div className="p-4 bg-gray-800 rounded shadow">
                        <h4 className="font-bold text-green-400">Referral Program Enhancement</h4>
                        <p className="mt-1">Boost viral growth by optimizing your referral program. Experiment with different incentives for both referrer and referee, and simplify sharing mechanisms.</p>
                    </div>
                    <div className="p-4 bg-gray-800 rounded shadow">
                        <h4 className="font-bold text-purple-400">Churn Reduction Tactics</h4>
                        <p className="mt-1">Identify segments with high churn rates and proactively engage them. Develop targeted campaigns (email, in-app) offering support, new features, or exclusive content.</p>
                    </div>
                    <div className="p-4 bg-gray-800 rounded shadow">
                        <h4 className="font-bold text-yellow-400">Pricing Page Optimization</h4>
                        <p className="mt-1">A/B test different pricing tiers, feature comparisons, and calls-to-action on your pricing page. Analyze conversion rates and ARPU to find the optimal strategy.</p>
                    </div>
                    <div className="p-4 bg-gray-800 rounded shadow">
                        <h4 className="font-bold text-red-400">Feature Prioritization based on Impact</h4>
                        <p className="mt-1">Use data from feature adoption and engagement to prioritize development. Focus on features that drive the most user growth, retention, or revenue.</p>
                    </div>
                    <div className="p-4 bg-gray-800 rounded shadow">
                        <h4 className="font-bold text-indigo-400">Content Marketing for SEO Growth</h4>
                        <p className="mt-1">Invest in high-quality content that targets relevant keywords to drive organic traffic. Track search rankings, unique visitors, and conversion from content.</p>
                    </div>
                </div>
            </Card>

            <Card title="Data Quality & Latency" className="text-sm text-gray-400">
                <p>Last Data Refresh: {new Date().toLocaleString()} (approx. 5 minutes ago)</p>
                <p>Data Source Status: <span className="text-green-500">All Systems Operational</span></p>
                <p>AI Model Version: <span className="text-blue-400">Gemini-1.5-Flash (API v1.0)</span></p>
                <p className="mt-2 text-xs italic">Note: Real-time data streams and AI processing may introduce minor latency. Forecasts and insights are based on available data up to the last refresh.</p>
            </Card>

            <Card title="A/B Experiment Tracker">
                <h3 className="text-lg font-semibold text-white mb-3">Current & Past Experiments</h3>
                <div className="overflow-x-auto">
                    <table className="min-w-full text-sm text-gray-300">
                        <thead>
                            <tr className="bg-gray-700 text-gray-200">
                                <th className="px-4 py-2 text-left font-semibold border-b border-gray-600">Experiment Name</th>
                                <th className="px-4 py-2 text-left font-semibold border-b border-gray-600">Hypothesis</th>
                                <th className="px-4 py-2 text-left font-semibold border-b border-gray-600">Status</th>
                                <th className="px-4 py-2 text-left font-semibold border-b border-gray-600">Result</th>
                                <th className="px-4 py-2 text-left font-semibold border-b border-gray-600">Impact</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="bg-gray-800">
                                <td className="px-4 py-2 border-b border-gray-700">Signup Form v2</td>
                                <td className="px-4 py-2 border-b border-gray-700">Simplified form increases conversion.</td>
                                <td className="px-4 py-2 border-b border-gray-700"><span className="px-2 py-0.5 rounded-full bg-green-900 text-green-300">Completed</span></td>
                                <td className="px-4 py-2 border-b border-gray-700 text-green-400">Winner (Variant B)</td>
                                <td className="px-4 py-2 border-b border-gray-700 text-green-400">+3.2% Signup Rate</td>
                            </tr>
                            <tr className="bg-gray-800/70">
                                <td className="px-4 py-2 border-b border-gray-700">Homepage CTA Color</td>
                                <td className="px-4 py-2 border-b border-gray-700">Green CTA performs better.</td>
                                <td className="px-4 py-2 border-b border-gray-700"><span className="px-2 py-0.5 rounded-full bg-blue-900 text-blue-300">Running</span></td>
                                <td className="px-4 py-2 border-b border-gray-700 text-yellow-400">In Progress</td>
                                <td className="px-4 py-2 border-b border-gray-700 text-yellow-400">N/A</td>
                            </tr>
                            {actionableInsights.filter(i => 'hypothesis' in i).map((insight: any) => (
                                <tr key={insight.id} className="bg-gray-800/70">
                                    <td className="px-4 py-2 border-b border-gray-700 italic">{insight.id} (AI Suggestion)</td>
                                    <td className="px-4 py-2 border-b border-gray-700 italic">{insight.hypothesis}</td>
                                    <td className="px-4 py-2 border-b border-gray-700"><span className="px-2 py-0.5 rounded-full bg-orange-900 text-orange-300">{insight.status}</span></td>
                                    <td className="px-4 py-2 border-b border-gray-700 text-gray-400">Pending</td>
                                    <td className="px-4 py-2 border-b border-gray-700 italic">{insight.potentialGain}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <button className="mt-4 w-full py-2 bg-yellow-700/50 hover:bg-yellow-700 rounded text-white">Manage Experiments</button>
            </Card>

            <Card title="Market & Competitive Insights (AI-Powered)">
                <h3 className="text-lg font-semibold text-white mb-3">Recent Market Landscape Analysis</h3>
                <div className="text-sm text-gray-300 space-y-3">
                    <p className="italic">"AI analysis indicates growing market demand for AI-driven automation fueled by recent advancements in LLMs. Competitors like Mixpanel and Amplitude have launched new AI modules, suggesting a window of opportunity for product diversification."</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-3 bg-gray-800 rounded">
                            <h4 className="font-bold text-lg text-blue-400">Competitive Landscape</h4>
                            <ul className="list-disc list-inside mt-2">
                                <li>Competitor A: Strong in Enterprise, launched new AI module last month.</li>
                                <li>Competitor B: Dominant in SMB, recently closed $50M funding round.</li>
                            </ul>
                        </div>
                        <div className="p-3 bg-gray-800 rounded">
                            <h4 className="font-bold text-lg text-purple-400">Market Trends</h4>
                            <ul className="list-disc list-inside mt-2">
                                <li>Increased demand for "predictive analytics" (+15% in search queries).</li>
                                <li>Shift towards "no-code/low-code" solutions.</li>
                            </ul>
                        </div>
                    </div>
                    <button className="mt-4 w-full py-2 bg-teal-700/50 hover:bg-teal-700 rounded text-white">Generate Full Market Report</button>
                </div>
            </Card>

            <Card title="Subscription Plan Distribution">
                <h3 className="text-lg font-semibold text-white mb-3">User Distribution Across Plans</h3>
                <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                        <Pie data={[{ name: 'Free Tier', value: 150000 }, { name: 'Starter', value: 80000 }, { name: 'Professional', value: 40000 }, { name: 'Enterprise', value: 10000 }]} cx="50%" cy="50%" labelLine={false} outerRadius={100} fill="#8884d8" dataKey="value" label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}>
                            {[{ name: 'Free Tier', value: 150000 }, { name: 'Starter', value: 80000 }, { name: 'Professional', value: 40000 }, { name: 'Enterprise', value: 10000 }].map((entry, index) => (<Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />))}
                        </Pie>
                        <Tooltip contentStyle={{ backgroundColor: 'rgba(31, 41, 55, 0.8)', borderColor: '#4b5563' }} />
                        <Legend />
                    </PieChart>
                </ResponsiveContainer>
            </Card>
        </div>
    );
};

export default GrowthInsightsView;

================================================================================
// APPENDED FROM REPO: diplomat-bit/Fuckyou | ORIGINAL PATH: diplomat-bit-Fuckyou-70f83c5/components/views/megadashboard/business/GrowthInsightsView.tsx
================================================================================

// components/views/megadashboard/business/GrowthInsightsView.tsx
import React, { useContext, useMemo, useState } from 'react';
import Card from '../../../Card';
import { DataContext } from '../../../../context/DataContext';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { GoogleGenAI } from "@google/genai";

const GrowthInsightsView: React.FC = () => {
    const context = useContext(DataContext);
    if (!context) throw new Error("GrowthInsightsView must be within DataProvider");
    
    const { growthMetrics } = context; // Placeholder, using static data for now
    const [aiSummary, setAiSummary] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const chartData = [ { month: 'Jan', mau: 12000 }, { month: 'Feb', mau: 12500 }, { month: 'Mar', mau: 14000 }, { month: 'Apr', mau: 15500 }, { month: 'May', mau: 18000 }, { month: 'Jun', mau: 21000 }];

    const handleGenerateSummary = async () => {
        setIsLoading(true); setAiSummary('');
        try {
            const ai = new GoogleGenAI({apiKey: process.env.API_KEY as string});
            const prompt = `Summarize the key takeaways from this user growth data: ${JSON.stringify(chartData)}. Highlight the trend and any potential inflection points.`;
            const response = await ai.models.generateContent({model: 'gemini-2.5-flash', contents: prompt});
            setAiSummary(response.text);
        } catch(err) { console.error(err); } finally { setIsLoading(false); }
    };

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold text-white tracking-wider">Growth Insights</h2>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="text-center"><p className="text-3xl font-bold text-white">21,000</p><p className="text-sm text-gray-400 mt-1">Monthly Active Users</p></Card>
                <Card className="text-center"><p className="text-3xl font-bold text-red-400">2.1%</p><p className="text-sm text-gray-400 mt-1">Monthly Churn</p></Card>
                <Card className="text-center"><p className="text-3xl font-bold text-white">$125</p><p className="text-sm text-gray-400 mt-1">LTV</p></Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <Card title="Monthly Active User Growth">
                        <ResponsiveContainer width="100%" height={300}>
                             <AreaChart data={chartData}><XAxis dataKey="month" stroke="#9ca3af" /><YAxis stroke="#9ca3af" /><Tooltip contentStyle={{ backgroundColor: 'rgba(31, 41, 55, 0.8)', borderColor: '#4b5563' }}/><Area type="monotone" dataKey="mau" stroke="#8884d8" fill="#8884d8" fillOpacity={0.3} /></AreaChart>
                        </ResponsiveContainer>
                    </Card>
                </div>
                <Card title="AI Trend Summary">
                    <div className="flex flex-col justify-between h-full">
                        <div className="min-h-[10rem] text-sm text-gray-300 italic">{isLoading ? 'Analyzing...' : aiSummary}</div>
                        <button onClick={handleGenerateSummary} disabled={isLoading} className="w-full py-2 bg-cyan-600/50 hover:bg-cyan-600 rounded disabled:opacity-50">{isLoading ? '...' : 'Generate AI Summary'}</button>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default GrowthInsightsView;


================================================================================
// APPENDED FROM REPO: diplomat-bit/magic | ORIGINAL PATH: diplomat-bit-magic-a3f5ff1/components/views/megadashboard/business/GrowthInsightsView.tsx
================================================================================

// components/views/megadashboard/business/GrowthInsightsView.tsx
import React, { useContext, useMemo, useState } from 'react';
import Card from '../../../Card';
import { DataContext } from '../../../../context/DataContext';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { GoogleGenAI } from "@google/genai";

const GrowthInsightsView: React.FC = () => {
    const context = useContext(DataContext);
    if (!context) throw new Error("GrowthInsightsView must be within DataProvider");
    
    const { growthMetrics } = context; // Placeholder, using static data for now
    const [aiSummary, setAiSummary] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const chartData = [ { month: 'Jan', mau: 12000 }, { month: 'Feb', mau: 12500 }, { month: 'Mar', mau: 14000 }, { month: 'Apr', mau: 15500 }, { month: 'May', mau: 18000 }, { month: 'Jun', mau: 21000 }];

    const handleGenerateSummary = async () => {
        setIsLoading(true); setAiSummary('');
        try {
            const ai = new GoogleGenAI({apiKey: process.env.API_KEY as string});
            const prompt = `Summarize the key takeaways from this user growth data: ${JSON.stringify(chartData)}. Highlight the trend and any potential inflection points.`;
            const response = await ai.models.generateContent({model: 'gemini-2.5-flash', contents: prompt});
            setAiSummary(response.text);
        } catch(err) { console.error(err); } finally { setIsLoading(false); }
    };

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold text-white tracking-wider">Growth Insights</h2>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="text-center"><p className="text-3xl font-bold text-white">21,000</p><p className="text-sm text-gray-400 mt-1">Monthly Active Users</p></Card>
                <Card className="text-center"><p className="text-3xl font-bold text-red-400">2.1%</p><p className="text-sm text-gray-400 mt-1">Monthly Churn</p></Card>
                <Card className="text-center"><p className="text-3xl font-bold text-white">$125</p><p className="text-sm text-gray-400 mt-1">LTV</p></Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <Card title="Monthly Active User Growth">
                        <ResponsiveContainer width="100%" height={300}>
                             <AreaChart data={chartData}><XAxis dataKey="month" stroke="#9ca3af" /><YAxis stroke="#9ca3af" /><Tooltip contentStyle={{ backgroundColor: 'rgba(31, 41, 55, 0.8)', borderColor: '#4b5563' }}/><Area type="monotone" dataKey="mau" stroke="#8884d8" fill="#8884d8" fillOpacity={0.3} /></AreaChart>
                        </ResponsiveContainer>
                    </Card>
                </div>
                <Card title="AI Trend Summary">
                    <div className="flex flex-col justify-between h-full">
                        <div className="min-h-[10rem] text-sm text-gray-300 italic">{isLoading ? 'Analyzing...' : aiSummary}</div>
                        <button onClick={handleGenerateSummary} disabled={isLoading} className="w-full py-2 bg-cyan-600/50 hover:bg-cyan-600 rounded disabled:opacity-50">{isLoading ? '...' : 'Generate AI Summary'}</button>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default GrowthInsightsView;
