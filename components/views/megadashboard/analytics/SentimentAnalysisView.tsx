// REPOSITORY SOURCE: diplomat-bit/almost | PATH: diplomat-bit-almost-93a5466/components/views/megadashboard/analytics/SentimentAnalysisView.tsx
================================================================================

// components/views/megadashboard/analytics/SentimentAnalysisView.tsx
import React from 'react';
import Card from '../../../Card';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const sentimentTrendData = [
    { name: 'Jan', positive: 85, negative: 10 },
    { name: 'Feb', positive: 88, negative: 8 },
    { name: 'Mar', positive: 82, negative: 15 },
    { name: 'Apr', positive: 90, negative: 5 },
    { name: 'May', positive: 92, negative: 4 },
    { name: 'Jun', positive: 91, negative: 6 },
];

const emergingTopics = [
    { topic: 'Mobile App Speed', sentiment: 'Negative', volume: 125 },
    { topic: 'New Savings Feature', sentiment: 'Positive', volume: 350 },
    { topic: 'Customer Support Wait Times', sentiment: 'Negative', volume: 88 },
];

const SentimentAnalysisView: React.FC = () => {
    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold text-white tracking-wider">AI Sentiment Analysis Engine</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="text-center"><p className="text-3xl font-bold text-green-400">91%</p><p className="text-sm text-gray-400 mt-1">Overall Positive Sentiment</p></Card>
                <Card className="text-center"><p className="text-3xl font-bold text-white">3</p><p className="text-sm text-gray-400 mt-1">Emerging Negative Topics</p></Card>
                <Card className="text-center"><p className="text-3xl font-bold text-white">1.2M</p><p className="text-sm text-gray-400 mt-1">Sources Analyzed (24h)</p></Card>
            </div>

            <Card title="Sentiment Trend (Last 6 Months)">
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={sentimentTrendData}>
                        <XAxis dataKey="name" stroke="#9ca3af" />
                        <YAxis stroke="#9ca3af" unit="%" />
                        <Tooltip contentStyle={{ backgroundColor: 'rgba(31, 41, 55, 0.8)', borderColor: '#4b5563' }} />
                        <Legend />
                        <Line type="monotone" dataKey="positive" name="Positive" stroke="#10b981" strokeWidth={2} />
                        <Line type="monotone" dataKey="negative" name="Negative" stroke="#ef4444" strokeWidth={2} />
                    </LineChart>
                </ResponsiveContainer>
            </Card>

            <Card title="AI-Detected Emerging Topics">
                 <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-400">
                        <thead className="text-xs text-gray-300 uppercase bg-gray-900/30">
                            <tr>
                                <th scope="col" className="px-6 py-3">Topic</th>
                                <th scope="col" className="px-6 py-3">Sentiment</th>
                                <th scope="col" className="px-6 py-3">Mention Volume</th>
                            </tr>
                        </thead>
                        <tbody>
                            {emergingTopics.map((topic, index) => (
                                <tr key={index} className="border-b border-gray-800 hover:bg-gray-800/50">
                                    <td className="px-6 py-4 font-medium text-white">{topic.topic}</td>
                                    <td className="px-6 py-4">
                                        <span className={topic.sentiment === 'Positive' ? 'text-green-400' : 'text-red-400'}>{topic.sentiment}</span>
                                    </td>
                                    <td className="px-6 py-4">{topic.volume}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
};

export default SentimentAnalysisView;

================================================================================
// APPENDED FROM REPO: diplomat-bit/Citibank_Demo_Business_Inc_Demonstration- | ORIGINAL PATH: diplomat-bit-Citibank_Demo_Business_Inc_Demonstration--ab2501d/components/views/megadashboard/analytics/SentimentAnalysisView.tsx
================================================================================

import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import Card from '../../../Card';
import {
    LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend,
    BarChart, Bar, CartesianGrid, PieChart, Pie, Cell, RadarChart, PolarGrid,
    PolarAngleAxis, PolarRadiusAxis, Radar, AreaChart, Area, ComposedChart, Scatter
} from 'recharts';
import { FaRobot, FaLightbulb, FaExclamationTriangle, FaChartLine, FaTwitter, FaReddit, FaSalesforce, FaZendesk, FaNewspaper, FaEnvelope, FaGlobe, FaUsers, FaTag } from 'react-icons/fa';

// --- Expanded Interfaces and Types ---

export type SentimentCategory = 'Positive' | 'Negative' | 'Neutral' | 'Mixed';
export type SentimentTrend = 'increasing' | 'decreasing' | 'stable' | 'critical' | 'emerging';
export type TimeGranularity = 'daily' | 'weekly' | 'monthly' | 'quarterly';
export type DataSource = 'social_media' | 'reviews' | 'support_tickets' | 'news_articles' | 'forums' | 'surveys' | 'emails' | 'salesforce' | 'zendesk' | 'twitter' | 'reddit';
export type ProductService = 'checking_account' | 'savings_account' | 'credit_card' | 'loans' | 'investments' | 'mobile_app' | 'website' | 'customer_support' | 'business_banking' | 'wealth_management';
export type GeoRegion = 'North America' | 'Europe' | 'Asia' | 'South America' | 'Africa' | 'Oceania' | 'Middle East';
export type DemographicGroup = 'Gen Z' | 'Millennials' | 'Gen X' | 'Baby Boomers' | 'Seniors' | 'High-Net-Worth' | 'Students' | 'Small Business Owners';
export type Competitor = 'GlobalBank Inc.' | 'MegaCorp Financial' | 'FinTech Innovators' | 'Community Credit Union';

export interface SentimentSummary {
    totalMentions: number;
    positivePercentage: number;
    negativePercentage: number;
    neutralPercentage: number;
    mixedPercentage: number;
    overallScore: number; // e.g., -1 to 1 or 0 to 100
    scoreChange24h: number;
    previousPeriodScore: number;
}

export interface DetailedSentimentTrendData {
    timestamp: string; // ISO string
    positive: number;
    negative: number;
    neutral: number;
    total: number;
    averageScore: number; // -1 to 1
    predictedScore?: number;
    upperBound?: number;
    lowerBound?: number;
    name?: string;
}

export interface TopicDetail {
    id: string;
    topicName: string;
    keywords: string[];
    sentiment: SentimentCategory;
    volume: number;
    trend: SentimentTrend;
    impactScore: number; // 0-10, how much it affects overall sentiment/business
    description: string;
    relatedTopics: string[];
    sampleMentions: SampleMention[];
    rootCauses?: string[];
    suggestedActions?: string[];
}

export interface SampleMention {
    id: string;
    text: string;
    source: DataSource;
    sourceId: string; // e.g., tweet ID, review ID
    sentiment: SentimentCategory;
    timestamp: string;
    matchedKeywords: string[];
    analysisScore: number;
    userHandle?: string;
    link?: string;
    product: ProductService;
    region: GeoRegion;
}

export interface EntitySentiment {
    entity: string;
    entityType: 'PERSON' | 'ORGANIZATION' | 'LOCATION' | 'PRODUCT' | 'SERVICE' | 'EVENT' | 'OTHER';
    sentiment: SentimentCategory;
    volume: number;
    mentions: SampleMention[];
}

export interface SentimentBySource {
    source: DataSource;
    positive: number;
    negative: number;
    neutral: number;
    total: number;
    overallScore: number;
}

export interface SentimentByProduct {
    product: ProductService;
    positive: number;
    negative: number;
    neutral: number;
    total: number;
    overallScore: number;
    keyIssues: TopicDetail[];
}

export interface SentimentByGeo {
    region: GeoRegion;
    positive: number;
    negative: number;
    neutral: number;
    total: number;
    overallScore: number;
    topTopics: TopicDetail[];
}

export interface SentimentByDemographic {
    demographic: DemographicGroup;
    positive: number;
    negative: number;
    neutral: number;
    total: number;
    overallScore: number;
    keyFeedback: SampleMention[];
}

export interface KeywordSentimentAggregate {
    keyword: string;
    sentiment: SentimentCategory;
    volume: number;
    positiveCount: number;
    negativeCount: number;
    neutralCount: number;
    averageScore: number;
    trend: SentimentTrend;
    sampleMentions: SampleMention[];
}

export interface AnomalyDetectionResult {
    id: string;
    timestamp: string;
    anomalyType: 'sentiment_drop' | 'volume_spike' | 'topic_shift' | 'correlation_break';
    description: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    affectedTopics: string[];
    affectedSources: DataSource[];
    currentSentiment: number;
    expectedSentiment: number;
    actionItems: string[];
    status: 'detected' | 'investigated' | 'resolved' | 'pending_action';
    assignedTo?: string;
}

export interface AlertConfiguration {
    id: string;
    name: string;
    type: 'sentiment_drop' | 'volume_spike' | 'keyword_mention' | 'topic_emergence';
    threshold: number;
    sentimentCategory?: SentimentCategory;
    keyword?: string;
    productService?: ProductService;
    source?: DataSource;
    recipients: string[];
    isActive: boolean;
}

export interface UserConfiguration {
    id: string;
    username: string;
    role: 'admin' | 'analyst' | 'viewer';
    email: string;
    preferences: {
        defaultDashboard: string;
        emailNotifications: boolean;
        darkMode: boolean;
    };
    accessLevel: string[];
}

export interface ReportGenerationStatus {
    id: string;
    reportName: string;
    type: 'daily_summary' | 'weekly_deep_dive' | 'custom';
    status: 'pending' | 'generating' | 'completed' | 'failed';
    generatedAt?: string;
    downloadUrl?: string;
    requestedBy: string;
    parameters: any;
}

export interface AuditLogEntry {
    id: string;
    timestamp: string;
    user: string;
    action: string;
    details: string;
    targetId?: string;
    targetType?: string;
}

export interface CompetitiveSentiment {
    competitor: Competitor;
    overallScore: number;
    shareOfVoice: number; // percentage
    positiveMentions: number;
    negativeMentions: number;
    keyStrengths: string[];
    keyWeaknesses: string[];
}

export interface AIInsight {
    id: string;
    type: 'summary' | 'recommendation' | 'prediction' | 'risk' | 'opportunity' | 'comms_draft';
    title: string;
    content: string;
    severity?: 'low' | 'medium' | 'high';
    relatedTopics: string[];
    confidenceScore: number; // 0 to 1
}

// --- Mock AI Service ---
const aiService = {
    getInsights: async (data: any): Promise<AIInsight[]> => {
        return new Promise(resolve => setTimeout(() => resolve([
            { id: 'ai-1', type: 'summary', title: 'Executive Summary', content: 'Overall sentiment is strong at 86.2, driven by positive feedback on the "New Savings Feature" and "Digital Wallet Integration". However, a critical rising trend in negative sentiment around "Customer Support Wait Times" and "Mobile App Speed" requires immediate attention. These issues are most prominent on Twitter and App Store reviews.', relatedTopics: ['New Savings Feature', 'Customer Support Wait Times'], confidenceScore: 0.95 },
            { id: 'ai-2', type: 'recommendation', title: 'Actionable Recommendation: Support Wait Times', content: 'Allocate additional staff to peak-hour support queues and introduce a callback feature to mitigate frustration. Launch a targeted in-app survey to gather specific feedback on support interactions.', severity: 'high', relatedTopics: ['Customer Support Wait Times'], confidenceScore: 0.88 },
            { id: 'ai-3', type: 'prediction', title: 'Q3 Sentiment Forecast', content: 'If current trends continue, overall sentiment may dip by 2-3 points next quarter due to escalating mobile app performance complaints. A successful Q3 app update could counteract this, potentially boosting sentiment by 5 points.', relatedTopics: ['Mobile App Speed'], confidenceScore: 0.75 },
            { id: 'ai-4', type: 'risk', title: 'Risk Analysis: High Fees Perception', content: 'Mentions of "high fees," particularly from Millennial and Gen Z demographics on Reddit, are increasing. This poses a significant churn risk and could damage brand perception among younger customers.', severity: 'medium', relatedTopics: ['Fees and Charges Transparency'], confidenceScore: 0.91 },
            { id: 'ai-5', type: 'opportunity', title: 'Opportunity: Wealth Management', content: 'Positive sentiment around "Investment Portfolio Performance" is high. This presents an opportunity to cross-sell wealth management services. Consider a targeted marketing campaign for high-performing investment customers.', relatedTopics: ['Investment Portfolio Performance'], confidenceScore: 0.82 },
            { id: 'ai-6', type: 'comms_draft', title: 'Draft Tweet for App Speed Issues', content: 'We\'ve heard your feedback on our app\'s performance and our team is working on significant improvements for our next update. We appreciate your patience and are committed to providing you with the best mobile banking experience. Stay tuned for details.', relatedTopics: ['Mobile App Speed'], confidenceScore: 0.98 },
        ]), 1000));
    },
    queryData: async (query: string): Promise<string> => {
         return new Promise(resolve => setTimeout(() => {
            if (query.toLowerCase().includes("negative topics")) {
                resolve("The top 3 negative topics are: Customer Support Wait Times, Mobile App Speed, and ATM Network Availability.");
            } else if (query.toLowerCase().includes("compare")) {
                resolve("Compared to GlobalBank Inc., our overall sentiment is 5 points higher, but their mobile app sentiment is currently leading by 3 points.");
            } else {
                resolve("I can help with sentiment data. Try asking 'what are the top negative topics?' or 'compare our sentiment to GlobalBank Inc.'.");
            }
        }, 800));
    }
};

// --- Utility Functions ---
export const getSentimentColor = (sentiment: SentimentCategory | string) => {
    switch (sentiment) {
        case 'Positive': return 'text-green-400';
        case 'Negative': return 'text-red-400';
        case 'Neutral': return 'text-blue-400';
        case 'Mixed': return 'text-yellow-400';
        case 'critical': return 'text-red-500 font-bold';
        case 'increasing': return 'text-green-500';
        case 'decreasing': return 'text-orange-400';
        default: return 'text-gray-400';
    }
};

export const formatNumber = (num: number): string => {
    if (Math.abs(num) >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (Math.abs(num) >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
};

export const calculateOverallScore = (positive: number, negative: number, neutral: number, total: number): number => {
    if (total === 0) return 0;
    return ((positive - negative) / total) * 100;
};

// --- Large Dummy Data Generation ---
const allDataSources: DataSource[] = ['social_media', 'reviews', 'support_tickets', 'news_articles', 'forums', 'surveys', 'emails', 'salesforce', 'zendesk', 'twitter', 'reddit'];
const allProducts: ProductService[] = ['checking_account', 'savings_account', 'credit_card', 'loans', 'investments', 'mobile_app', 'website', 'customer_support', 'business_banking', 'wealth_management'];
const allRegions: GeoRegion[] = ['North America', 'Europe', 'Asia', 'South America', 'Africa', 'Oceania', 'Middle East'];
const allDemographics: DemographicGroup[] = ['Gen Z', 'Millennials', 'Gen X', 'Baby Boomers', 'Seniors', 'High-Net-Worth', 'Students', 'Small Business Owners'];
const allCompetitors: Competitor[] = ['GlobalBank Inc.', 'MegaCorp Financial', 'FinTech Innovators', 'Community Credit Union'];

// Base topics from original
const baseEmergingTopics = [
    { topic: 'Mobile App Speed', sentiment: 'Negative', volume: 125, trend: 'increasing', impactScore: 7.2 },
    { topic: 'New Savings Feature', sentiment: 'Positive', volume: 350, trend: 'stable', impactScore: 8.9 },
    { topic: 'Customer Support Wait Times', sentiment: 'Negative', volume: 88, trend: 'critical', impactScore: 9.1 },
    { topic: 'Online Banking Security', sentiment: 'Neutral', volume: 210, trend: 'stable', impactScore: 6.5 },
    { topic: 'Credit Card Rewards Program', sentiment: 'Positive', volume: 420, trend: 'increasing', impactScore: 9.5 },
    { topic: 'ATM Network Availability', sentiment: 'Negative', volume: 60, trend: 'critical', impactScore: 8.0 },
    { topic: 'Mortgage Application Process', sentiment: 'Neutral', volume: 180, trend: 'decreasing', impactScore: 5.8 },
    { topic: 'Investment Portfolio Performance', sentiment: 'Positive', volume: 290, trend: 'increasing', impactScore: 8.7 },
];

// Expanded detailed topic definitions
const detailedTopics: TopicDetail[] = [
    ...baseEmergingTopics.map((t, idx) => ({
        id: `topic-${idx}`, topicName: t.topic, keywords: t.topic.toLowerCase().split(' ').filter(k => k.length > 3),
        sentiment: t.sentiment as SentimentCategory, volume: t.volume * 10, trend: t.trend as SentimentTrend, impactScore: t.impactScore,
        description: `This topic covers customer feedback and discussions related to ${t.topic.toLowerCase()}.`,
        relatedTopics: [], sampleMentions: [], rootCauses: [], suggestedActions: []
    })),
    { id: 'topic-100', topicName: 'Fraud Protection Measures', keywords: ['fraud', 'protection', 'secure', 'scam'], sentiment: 'Positive', volume: 5000, trend: 'stable', impactScore: 9.2, description: 'Discussions around security features and fraud prevention.', relatedTopics: ['Online Banking Security'], sampleMentions: [], rootCauses: ['Strong 2FA implementation'], suggestedActions: ['Highlight security features in marketing'] },
    { id: 'topic-101', topicName: 'Branch Experience', keywords: ['branch', 'in-person', 'teller', 'visit'], sentiment: 'Neutral', volume: 2000, trend: 'decreasing', impactScore: 6.0, description: 'Feedback on physical branch visits and staff.', relatedTopics: [], sampleMentions: [], rootCauses: [], suggestedActions: [] },
    { id: 'topic-102', topicName: 'Account Setup Process', keywords: ['setup', 'onboarding', 'new account'], sentiment: 'Positive', volume: 3800, trend: 'increasing', impactScore: 8.5, description: 'Ease and speed of setting up new accounts.', relatedTopics: ['Website Navigation Issues'], sampleMentions: [], rootCauses: ['Streamlined digital onboarding flow'], suggestedActions: ['Simplify document upload process further'] },
    { id: 'topic-103', topicName: 'Fees and Charges Transparency', keywords: ['fees', 'charges', 'hidden', 'transparent'], sentiment: 'Negative', volume: 1900, trend: 'critical', impactScore: 7.8, description: 'Concerns about hidden or unclear fees, particularly overdraft and international transfer fees.', relatedTopics: ['International Transfer Fees'], sampleMentions: [], rootCauses: ['Complex fee schedule document', 'Unexpected overdraft charges'], suggestedActions: ['Create an interactive fee calculator', 'Send proactive alerts before overdraft occurs'] },
    { id: 'topic-104', topicName: 'Digital Banking Features', keywords: ['digital', 'online', 'app features'], sentiment: 'Positive', volume: 6000, trend: 'increasing', impactScore: 9.3, description: 'Overall satisfaction with digital banking tools like budget planners and savings goals.', relatedTopics: ['Mobile App Speed', 'Digital Wallet Integration'], sampleMentions: [], rootCauses: [], suggestedActions: [] },
    { id: 'topic-105', topicName: 'Technical Glitches/Bugs', keywords: ['bug', 'glitch', 'error', 'crash'], sentiment: 'Negative', volume: 2800, trend: 'increasing', impactScore: 8.5, description: 'Reports of technical issues with digital platforms, especially after recent updates.', relatedTopics: ['Mobile App Speed'], sampleMentions: [], rootCauses: ['Recent OS update incompatibility', 'Server-side latency'], suggestedActions: ['Increase QA testing on older devices', 'Publish a public status page'] },
    { id: 'topic-106', topicName: 'Personalized Offers', keywords: ['personalized', 'offers', 'custom', 'recommendations'], sentiment: 'Positive', volume: 1800, trend: 'increasing', impactScore: 7.5, description: 'Customer response to personalized banking offers and product recommendations.', relatedTopics: [], sampleMentions: [], rootCauses: [], suggestedActions: [] },
    { id: 'topic-107', topicName: 'International Transfer Fees', keywords: ['international', 'wire', 'transfer fee', 'fx rate'], sentiment: 'Negative', volume: 950, trend: 'increasing', impactScore: 8.2, description: 'Complaints about the cost and transparency of international money transfers.', relatedTopics: ['Fees and Charges Transparency'], sampleMentions: [], rootCauses: [], suggestedActions: [] },
    { id: 'topic-108', topicName: 'Financial Advisor Responsiveness', keywords: ['advisor', 'wealth manager', 'responsive', 'callback'], sentiment: 'Negative', volume: 550, trend: 'critical', impactScore: 8.5, description: 'Feedback concerning the responsiveness and availability of personal financial advisors.', relatedTopics: ['Wealth Management'], sampleMentions: [], rootCauses: [], suggestedActions: [] },
];

// Generate more data dynamically
const generateRandomData = (count: number, startDate: Date): DetailedSentimentTrendData[] => {
    const data = [];
    let currentPositive = 70; let currentNegative = 15;
    for (let i = 0; i < count; i++) {
        const date = new Date(startDate);
        date.setDate(startDate.getDate() + i);
        currentPositive = Math.max(50, Math.min(95, currentPositive + (Math.random() - 0.5) * 5));
        currentNegative = Math.max(5, Math.min(30, currentNegative + (Math.random() - 0.5) * 4));
        const currentNeutral = 100 - currentPositive - currentNegative;
        const total = Math.floor(10000 + Math.random() * 50000);
        const avgScore = (currentPositive - currentNegative) / 100;
        data.push({
            timestamp: date.toISOString(), positive: Math.round(currentPositive), negative: Math.round(currentNegative),
            neutral: Math.round(currentNeutral), total, averageScore: parseFloat(avgScore.toFixed(2)),
            name: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        });
    }
    return data;
};

const generateRandomMentions = (count: number, topics: TopicDetail[], sources: DataSource[], products: ProductService[], regions: GeoRegion[]): SampleMention[] => {
    const mentions: SampleMention[] = [];
    for (let i = 0; i < count; i++) {
        const topic = topics[Math.floor(Math.random() * topics.length)];
        const sentiment = topic.sentiment !== 'Neutral' ? topic.sentiment : (Math.random() > 0.5 ? 'Positive' : 'Negative');
        mentions.push({
            id: `mention-${Math.random().toString(36).substr(2, 9)}`,
            text: `This is a sample mention about ${topic.topicName}. The experience was generally ${sentiment.toLowerCase()}.`,
            source: sources[Math.floor(Math.random() * sources.length)],
            sourceId: `src-${Math.random().toString(36).substr(2, 5)}`,
            sentiment: sentiment,
            timestamp: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
            matchedKeywords: topic.keywords,
            analysisScore: parseFloat((Math.random() * (sentiment === 'Positive' ? 1 : -1)).toFixed(2)),
            product: products[Math.floor(Math.random() * products.length)],
            region: regions[Math.floor(Math.random() * regions.length)],
            userHandle: `@user${Math.floor(Math.random() * 9000) + 1000}`
        });
    }
    return mentions;
};
detailedTopics.forEach(topic => {
    topic.sampleMentions = generateRandomMentions(5, [topic], allDataSources, allProducts, allRegions);
});

// Full datasets
const totalMentionsOverall = 2580000;
const sentimentSummaryData: SentimentSummary = {
    totalMentions: totalMentionsOverall, positivePercentage: 68.4, negativePercentage: 21.2, neutralPercentage: 10.4, mixedPercentage: 0,
    overallScore: 68.4 - 21.2, scoreChange24h: -1.2, previousPeriodScore: 48.4,
};

const sentimentDailyTrendData = generateRandomData(30, new Date(Date.now() - 30 * 24 * 60 * 60 * 1000));
const sentimentMonthlyTrendData = Array.from({ length: 12 }, (_, i) => {
    const date = new Date(); date.setMonth(date.getMonth() - (11 - i));
    const positive = 60 + Math.random() * 15 - (11 - i) * 0.5;
    const negative = 25 + Math.random() * 10 + (11 - i) * 0.3;
    const total = 180000 + Math.random() * 50000;
    const avgScore = (positive - negative) / 100;
    const predictedScore = avgScore + (Math.random() - 0.4) * 0.1;
    return {
        timestamp: date.toISOString(), positive, negative, neutral: 100 - positive - negative, total, averageScore: avgScore,
        name: date.toLocaleString('en-US', { month: 'short' }),
        predictedScore: i > 8 ? predictedScore : undefined,
        upperBound: i > 8 ? predictedScore + 0.05 : undefined,
        lowerBound: i > 8 ? predictedScore - 0.05 : undefined,
    };
});

const sentimentBySourceData: SentimentBySource[] = allDataSources.map(source => {
    const total = Math.floor(50000 + Math.random() * 200000);
    const positive = Math.round(total * (0.5 + Math.random() * 0.3));
    const negative = Math.round(total * (0.1 + Math.random() * 0.3));
    const neutral = total - positive - negative;
    return { source, positive, negative, neutral, total, overallScore: calculateOverallScore(positive, negative, neutral, total) };
});

const sentimentByProductData: SentimentByProduct[] = allProducts.map(product => {
    const total = Math.floor(30000 + Math.random() * 150000);
    const positive = Math.round(total * (0.6 + Math.random() * 0.25));
    const negative = Math.round(total * (0.1 + Math.random() * 0.15));
    const neutral = total - positive - negative;
    return { product, positive, negative, neutral, total, overallScore: calculateOverallScore(positive, negative, neutral, total), keyIssues: detailedTopics.filter(t => t.sentiment === 'Negative').slice(0, 2) };
});

const sentimentByGeoData: SentimentByGeo[] = allRegions.map(region => {
    const total = Math.floor(80000 + Math.random() * 200000);
    const positive = Math.round(total * (0.55 + Math.random() * 0.3));
    const negative = Math.round(total * (0.1 + Math.random() * 0.2));
    const neutral = total - positive - negative;
    return { region, positive, negative, neutral, total, overallScore: calculateOverallScore(positive, negative, neutral, total), topTopics: detailedTopics.slice(0, 3) };
});

const sentimentByDemographicData: SentimentByDemographic[] = allDemographics.map(demographic => {
    const total = Math.floor(60000 + Math.random() * 150000);
    const positive = Math.round(total * (0.5 + Math.random() * 0.35));
    const negative = Math.round(total * (0.15 + Math.random() * 0.15));
    const neutral = total - positive - negative;
    return { demographic, positive, negative, neutral, total, overallScore: calculateOverallScore(positive, negative, neutral, total), keyFeedback: generateRandomMentions(2, detailedTopics, ['surveys'], [allProducts[0]], [allRegions[0]]) };
});

const keywordSentimentData: KeywordSentimentAggregate[] = detailedTopics.flatMap(topic =>
    topic.keywords.map(kw => ({
        keyword: kw, sentiment: topic.sentiment, volume: Math.floor(topic.volume * (0.2 + Math.random() * 0.5)),
        positiveCount: topic.sentiment === 'Positive' ? Math.floor(topic.volume * 0.8) : Math.floor(topic.volume * 0.1),
        negativeCount: topic.sentiment === 'Negative' ? Math.floor(topic.volume * 0.8) : Math.floor(topic.volume * 0.1),
        neutralCount: Math.floor(topic.volume * 0.1), averageScore: topic.sentiment === 'Positive' ? 0.8 : -0.8,
        trend: topic.trend, sampleMentions: []
    }))
).slice(0, 20);

const anomalyDetectionResults: AnomalyDetectionResult[] = [
    { id: 'anom-001', timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), anomalyType: 'sentiment_drop', description: 'Significant drop in positive sentiment for Mobile App Speed.', severity: 'high', affectedTopics: ['Mobile App Speed'], affectedSources: ['twitter', 'reviews'], currentSentiment: 0.3, expectedSentiment: 0.8, actionItems: ['Investigate app update issues', 'Notify dev team'], status: 'investigated', assignedTo: 'dev_team_lead' },
    { id: 'anom-002', timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), anomalyType: 'volume_spike', description: 'Unusual spike in mentions for New Savings Feature.', severity: 'medium', affectedTopics: ['New Savings Feature'], affectedSources: ['news_articles'], currentSentiment: 0.9, expectedSentiment: 0.7, actionItems: ['Monitor news coverage', 'Amplify positive PR'], status: 'resolved', assignedTo: 'marketing_team' },
    { id: 'anom-003', timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), anomalyType: 'topic_shift', description: 'Emergence of "ATM Network Availability" as a critical negative topic in Asia.', severity: 'high', affectedTopics: ['ATM Network Availability'], affectedSources: ['support_tickets', 'forums'], currentSentiment: -0.6, expectedSentiment: -0.1, actionItems: ['Identify affected ATMs', 'Dispatch maintenance'], status: 'pending_action', assignedTo: 'ops_manager_asia' },
    { id: 'anom-004', timestamp: new Date(Date.now() - 1 * 24 * 30 * 60 * 1000).toISOString(), anomalyType: 'sentiment_drop', description: 'Sudden increase in "technical issues" mentions.', severity: 'critical', affectedTopics: ['Technical Glitches/Bugs'], affectedSources: ['social_media'], currentSentiment: -0.7, expectedSentiment: -0.2, actionItems: ['Escalate to engineering', 'Prepare customer comms'], status: 'detected', assignedTo: 'on_call_engineer' },
];

const competitiveData: CompetitiveSentiment[] = allCompetitors.map(c => ({
    competitor: c, overallScore: 30 + Math.random() * 30, shareOfVoice: 15 + Math.random() * 10,
    positiveMentions: 100000 + Math.random() * 50000, negativeMentions: 50000 + Math.random() * 50000,
    keyStrengths: ['Low Fees', 'Good Mobile App'], keyWeaknesses: ['Poor Customer Service', 'Limited Branch Network']
}));

const CHART_COLORS = ['#10b981', '#ef4444', '#3b82f6', '#f59e0b', '#8b5cf6', '#ec4899'];
const PIE_COLORS = ['#10b981', '#ef4444', '#3b82f6'];

// --- Sub-components ---
const MetricCard: React.FC<{ title: string; value: string | number; subtext: string; valueColorClass?: string; icon?: React.ReactNode }> = ({ title, value, subtext, valueColorClass = 'text-white', icon }) => (
    <Card className="flex items-center p-4">
        {icon && <div className="text-3xl text-gray-500 mr-4">{icon}</div>}
        <div className="flex-grow">
            <p className="text-sm text-gray-400">{title}</p>
            <p className={`text-3xl font-bold ${valueColorClass}`}>{value}</p>
            <p className="text-xs text-gray-500 mt-1">{subtext}</p>
        </div>
    </Card>
);

const ChartCard: React.FC<{ title: string; children: React.ReactNode; className?: string }> = ({ title, children, className }) => (
    <Card title={title} className={className}>
        <div className="h-80">
            {children}
        </div>
    </Card>
);

const AIChatbot: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
    const [messages, setMessages] = useState<{ user: string; text: string }[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim()) return;
        const newMessages = [...messages, { user: 'You', text: input }];
        setMessages(newMessages);
        setInput('');
        setIsLoading(true);
        const aiResponse = await aiService.queryData(input);
        setMessages([...newMessages, { user: 'AI Assistant', text: aiResponse }]);
        setIsLoading(false);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed bottom-20 right-8 w-96 h-[32rem] bg-gray-800 border border-gray-700 rounded-lg shadow-2xl flex flex-col z-50">
            <div className="flex justify-between items-center p-3 border-b border-gray-700">
                <h3 className="text-lg font-bold text-white flex items-center"><FaRobot className="mr-2" /> AI Sentiment Analyst</h3>
                <button onClick={onClose} className="text-gray-400 hover:text-white">&times;</button>
            </div>
            <div className="flex-grow p-4 overflow-y-auto">
                {messages.map((msg, idx) => (
                    <div key={idx} className={`mb-3 ${msg.user === 'You' ? 'text-right' : 'text-left'}`}>
                        <div className={`inline-block p-2 rounded-lg ${msg.user === 'You' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-200'}`}>
                            {msg.text}
                        </div>
                    </div>
                ))}
                {isLoading && <div className="text-left"><div className="inline-block p-2 rounded-lg bg-gray-700 text-gray-200">Thinking...</div></div>}
                <div ref={messagesEndRef} />
            </div>
            <div className="p-3 border-t border-gray-700 flex">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                    placeholder="Ask about sentiment data..."
                    className="flex-grow bg-gray-900 text-white border border-gray-600 rounded-l-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button onClick={handleSend} className="bg-blue-600 text-white px-4 rounded-r-md hover:bg-blue-700">Send</button>
            </div>
        </div>
    );
};

// --- Main Component ---
const SentimentAnalysisView: React.FC = () => {
    const [activeTab, setActiveTab] = useState('overview');
    const [dateRange, setDateRange] = useState('last_30_days');
    const [isLoading, setIsLoading] = useState(false);
    const [selectedTopicDetail, setSelectedTopicDetail] = useState<TopicDetail | null>(null);
    const [aiInsights, setAiInsights] = useState<AIInsight[]>([]);
    const [isChatbotOpen, setIsChatbotOpen] = useState(false);
    
    useEffect(() => {
        setIsLoading(true);
        if(activeTab === 'ai_insights' && aiInsights.length === 0){
             aiService.getInsights({}).then(insights => {
                setAiInsights(insights);
                setIsLoading(false);
            });
        } else {
            const timer = setTimeout(() => setIsLoading(false), 1000);
            return () => clearTimeout(timer);
        }
    }, [activeTab, dateRange]);

    const handleTopicClick = useCallback((topic: TopicDetail) => {
        setSelectedTopicDetail(topic);
    }, []);

    const renderHeader = () => (
        <>
            <h1 className="text-5xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 mb-4">
                Advanced AI Sentiment Platform
            </h1>
            <p className="text-center text-gray-400 mb-8">Harnessing generative AI to deliver deep, actionable insights from customer feedback across all channels.</p>

            <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-bold text-white">Sentiment Analysis Dashboard</h2>
                <div className="flex space-x-2">
                    <select
                        className="bg-gray-800 text-white border border-gray-700 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={dateRange}
                        onChange={(e) => setDateRange(e.target.value)}
                    >
                        <option value="last_24_hours">Last 24 Hours</option>
                        <option value="last_7_days">Last 7 Days</option>
                        <option value="last_30_days">Last 30 Days</option>
                        <option value="last_90_days">Last 90 Days</option>
                    </select>
                    <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md shadow-md transition duration-300">
                        Refresh
                    </button>
                </div>
            </div>
        </>
    );

    const renderTabs = () => {
        const tabs = [
            { id: 'overview', label: 'Overview' }, { id: 'ai_insights', label: 'AI Insights' },
            { id: 'trends', label: 'Trends' }, { id: 'topics', label: 'Topics' }, { id: 'sources', label: 'Sources' },
            { id: 'products', label: 'Products' }, { id: 'geodemographics', label: 'Geo/Demographics' },
            { id: 'keywords', label: 'Keywords' }, { id: 'anomalies', label: 'Anomalies' },
            { id: 'competition', label: 'Competition' }, { id: 'forecast', label: 'Forecast' },
            { id: 'settings', label: 'Settings' }
        ];
        return (
            <nav className="mb-8 border-b border-gray-700 overflow-x-auto">
                <ul className="flex flex-nowrap -mb-px text-sm font-medium text-center text-gray-400">
                    {tabs.map(tab => (
                        <li key={tab.id} className="mr-2 flex-shrink-0">
                            <button
                                className={`inline-block p-4 border-b-2 whitespace-nowrap ${activeTab === tab.id ? 'text-blue-500 border-blue-500' : 'border-transparent hover:text-gray-300 hover:border-gray-300'}`}
                                onClick={() => setActiveTab(tab.id)}
                            >
                                {tab.label} {tab.id === 'ai_insights' && '✨'}
                            </button>
                        </li>
                    ))}
                </ul>
            </nav>
        );
    };

    const renderContent = () => {
        if (isLoading) {
            return (
                <div className="flex items-center justify-center p-8 text-blue-400 text-lg h-96">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Analyzing sentiment data...
                </div>
            );
        }

        switch (activeTab) {
            case 'overview': return renderOverview();
            case 'ai_insights': return renderAIInsights();
            case 'trends': return renderTrends();
            case 'topics': return renderTopics();
            case 'sources': return renderSources();
            case 'products': return renderProducts();
            case 'geodemographics': return renderGeoDemographics();
            case 'keywords': return renderKeywords();
            case 'anomalies': return renderAnomalies();
            case 'competition': return renderCompetition();
            case 'forecast': return renderForecast();
            case 'settings': return <p>Settings content here...</p>;
            default: return <p>Not Implemented</p>;
        }
    };
    
    const renderOverview = () => (
         <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <MetricCard title="Overall Score" value={sentimentSummaryData.overallScore.toFixed(1)} subtext={`24h change: ${sentimentSummaryData.scoreChange24h}%`} valueColorClass={sentimentSummaryData.scoreChange24h >= 0 ? 'text-green-400' : 'text-red-400'} />
                <MetricCard title="Total Mentions" value={formatNumber(sentimentSummaryData.totalMentions)} subtext={`In ${dateRange.replace('_', ' ')}`} />
                <MetricCard title="Positive Sentiment" value={`${sentimentSummaryData.positivePercentage.toFixed(1)}%`} subtext="Share of voice" valueColorClass="text-green-400" />
                <MetricCard title="Negative Sentiment" value={`${sentimentSummaryData.negativePercentage.toFixed(1)}%`} subtext="Share of voice" valueColorClass="text-red-400" />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                <ChartCard title="Sentiment Trend (Last 12 Months)" className="lg:col-span-3">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={sentimentMonthlyTrendData}>
                            <defs>
                                <linearGradient id="colorPositive" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/><stop offset="95%" stopColor="#10b981" stopOpacity={0}/></linearGradient>
                                <linearGradient id="colorNegative" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#ef4444" stopOpacity={0.8}/><stop offset="95%" stopColor="#ef4444" stopOpacity={0}/></linearGradient>
                            </defs>
                            <XAxis dataKey="name" stroke="#9ca3af" />
                            <YAxis stroke="#9ca3af" unit="%" />
                            <Tooltip contentStyle={{ backgroundColor: 'rgba(31, 41, 55, 0.8)', borderColor: '#4b5563' }} />
                            <Legend />
                            <Area type="monotone" dataKey="positive" name="Positive" stroke="#10b981" fillOpacity={1} fill="url(#colorPositive)" />
                            <Area type="monotone" dataKey="negative" name="Negative" stroke="#ef4444" fillOpacity={1} fill="url(#colorNegative)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </ChartCard>
                <Card title="Sentiment Distribution" className="lg:col-span-2">
                     <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie data={[{ name: 'Positive', value: sentimentSummaryData.positivePercentage }, { name: 'Negative', value: sentimentSummaryData.negativePercentage }, { name: 'Neutral', value: sentimentSummaryData.neutralPercentage }]} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={60} outerRadius={80} labelLine={false} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                                {PIE_COLORS.map((color, index) => <Cell key={`cell-${index}`} fill={color} />)}
                            </Pie>
                            <Tooltip contentStyle={{ backgroundColor: 'rgba(31, 41, 55, 0.8)', borderColor: '#4b5563' }} />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </Card>
            </div>
             <Card title="AI-Detected Emerging Topics (Top 5 Critical)">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-400">
                        <thead className="text-xs text-gray-300 uppercase bg-gray-900/30">
                            <tr>
                                <th scope="col" className="px-6 py-3">Topic</th>
                                <th scope="col" className="px-6 py-3">Sentiment</th>
                                <th scope="col" className="px-6 py-3">Mention Volume</th>
                                <th scope="col" className="px-6 py-3">Trend</th>
                                <th scope="col" className="px-6 py-3">Impact Score</th>
                                <th scope="col" className="px-6 py-3">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {detailedTopics.filter(t => t.trend === 'critical' || t.sentiment === 'Negative').sort((a,b) => b.impactScore - a.impactScore).slice(0, 5).map((topic, index) => (
                                <tr key={index} className="border-b border-gray-800 hover:bg-gray-800/50">
                                    <td className="px-6 py-4 font-medium text-white">{topic.topicName}</td>
                                    <td className="px-6 py-4"><span className={getSentimentColor(topic.sentiment)}>{topic.sentiment}</span></td>
                                    <td className="px-6 py-4">{formatNumber(topic.volume)}</td>
                                    <td className="px-6 py-4"><span className={getSentimentColor(topic.trend)}>{topic.trend}</span></td>
                                    <td className="px-6 py-4">{topic.impactScore.toFixed(1)}</td>
                                    <td className="px-6 py-4"><button onClick={() => {handleTopicClick(topic); setActiveTab('topics')}} className="text-blue-500 hover:text-blue-400">Details</button></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
    
    const renderAIInsights = () => (
        <div className="space-y-6">
            <h3 className="text-2xl font-bold text-gray-200">AI-Generated Insights & Recommendations</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {aiInsights.map(insight => (
                    <Card key={insight.id} className={`border-l-4 ${insight.severity === 'high' ? 'border-red-500' : insight.severity === 'medium' ? 'border-yellow-500' : 'border-blue-500'}`}>
                        <h4 className="font-bold text-lg mb-2 text-white flex items-center">
                            {insight.type === 'summary' && <FaLightbulb className="mr-2 text-yellow-400"/>}
                            {insight.type === 'recommendation' && <FaLightbulb className="mr-2 text-green-400"/>}
                            {insight.type === 'prediction' && <FaChartLine className="mr-2 text-purple-400"/>}
                            {insight.type === 'risk' && <FaExclamationTriangle className="mr-2 text-red-400"/>}
                            {insight.title}
                        </h4>
                        <p className="text-gray-300 text-sm mb-3">{insight.content}</p>
                        <div className="text-xs text-gray-500">Confidence: {(insight.confidenceScore * 100).toFixed(0)}%</div>
                    </Card>
                ))}
            </div>
        </div>
    );
    
    const renderTrends = () => (
         <div className="space-y-6">
             <h3 className="text-2xl font-bold text-gray-200">Detailed Sentiment Trend Analysis</h3>
            <ChartCard title="Daily Sentiment Trend (Last 30 Days)">
                <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={sentimentDailyTrendData}>
                        <XAxis dataKey="name" stroke="#9ca3af" />
                        <YAxis yAxisId="left" stroke="#9ca3af" unit="%" />
                        <YAxis yAxisId="right" orientation="right" stroke="#9ca3af" />
                        <Tooltip contentStyle={{ backgroundColor: 'rgba(31, 41, 55, 0.8)', borderColor: '#4b5563' }} />
                        <Legend />
                        <CartesianGrid stroke="#4b5563" strokeDasharray="3 3" />
                        <Area yAxisId="left" type="monotone" dataKey="positive" fill="#10b981" stroke="#10b981" name="Positive %" />
                        <Area yAxisId="left" type="monotone" dataKey="negative" fill="#ef4444" stroke="#ef4444" name="Negative %" />
                        <Line yAxisId="right" type="monotone" dataKey="total" stroke="#f59e0b" name="Total Mentions" />
                    </ComposedChart>
                </ResponsiveContainer>
            </ChartCard>
        </div>
    );

    const renderTopics = () => (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
                <Card title="All Detected Topics & Their Sentiment">
                    <div className="overflow-x-auto max-h-[80vh]">
                        <table className="w-full text-sm text-left text-gray-400">
                             <thead className="text-xs text-gray-300 uppercase bg-gray-900/30 sticky top-0">
                                <tr>
                                    <th scope="col" className="px-6 py-3">Topic Name</th>
                                    <th scope="col" className="px-6 py-3">Sentiment</th>
                                    <th scope="col" className="px-6 py-3">Volume</th>
                                    <th scope="col" className="px-6 py-3">Impact</th>
                                </tr>
                            </thead>
                            <tbody>
                                {detailedTopics.sort((a,b) => b.volume - a.volume).map((topic) => (
                                    <tr key={topic.id} className="border-b border-gray-800 hover:bg-gray-800/50 cursor-pointer" onClick={() => handleTopicClick(topic)}>
                                        <td className="px-6 py-4 font-medium text-white">{topic.topicName}</td>
                                        <td className="px-6 py-4"><span className={getSentimentColor(topic.sentiment)}>{topic.sentiment}</span></td>
                                        <td className="px-6 py-4">{formatNumber(topic.volume)}</td>
                                        <td className="px-6 py-4">{topic.impactScore.toFixed(1)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Card>
            </div>
            <div className="lg:col-span-1">
                {selectedTopicDetail ? (
                    <Card title={selectedTopicDetail.topicName} className="sticky top-6">
                         <div className="grid grid-cols-2 gap-4 mb-6">
                            <div><p className="text-gray-400">Sentiment:</p><p className={`text-xl font-semibold ${getSentimentColor(selectedTopicDetail.sentiment)}`}>{selectedTopicDetail.sentiment}</p></div>
                            <div><p className="text-gray-400">Volume:</p><p className="text-xl font-semibold text-white">{formatNumber(selectedTopicDetail.volume)}</p></div>
                            <div><p className="text-gray-400">Trend:</p><p className={`text-xl font-semibold ${getSentimentColor(selectedTopicDetail.trend)}`}>{selectedTopicDetail.trend}</p></div>
                            <div><p className="text-gray-400">Impact Score:</p><p className="text-xl font-semibold text-white">{selectedTopicDetail.impactScore.toFixed(1)}</p></div>
                        </div>
                        <p className="text-gray-300 mb-4">{selectedTopicDetail.description}</p>
                        <div className="mt-6">
                            <h4 className="text-lg font-bold text-gray-200 mb-3">AI-Suggested Root Causes</h4>
                            <ul className="list-disc list-inside text-sm text-gray-300 space-y-1">
                                {selectedTopicDetail.rootCauses?.length ? selectedTopicDetail.rootCauses.map((cause, i) => <li key={i}>{cause}</li>) : <li>No specific root causes identified.</li>}
                            </ul>
                        </div>
                        <div className="mt-6">
                            <h4 className="text-lg font-bold text-gray-200 mb-3">Sample Mentions</h4>
                            <div className="space-y-4 max-h-60 overflow-y-auto pr-2">
                                {selectedTopicDetail.sampleMentions.map((mention, idx) => (
                                    <div key={idx} className="bg-gray-700 p-3 rounded-md border border-gray-600">
                                        <p className="text-sm text-gray-300 mb-2 italic">"{mention.text}"</p>
                                        <div className="flex items-center text-xs text-gray-400"><FaTwitter className="mr-2"/>{mention.userHandle}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </Card>
                ) : (
                    <Card className="flex items-center justify-center h-64">
                        <p className="text-gray-500">Select a topic to see details</p>
                    </Card>
                )}
            </div>
        </div>
    );
    
    const renderSources = () => (
        <Card title="Sentiment Performance by Source">
             <ResponsiveContainer width="100%" height={500}>
                <BarChart data={sentimentBySourceData} layout="vertical" margin={{ top: 20, right: 30, left: 100, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#4b5563" />
                    <XAxis type="number" stroke="#9ca3af" />
                    <YAxis type="category" dataKey="source" stroke="#9ca3af" />
                    <Tooltip contentStyle={{ backgroundColor: 'rgba(31, 41, 55, 0.8)', borderColor: '#4b5563' }} />
                    <Legend />
                    <Bar dataKey="positive" stackId="a" fill="#10b981" name="Positive"/>
                    <Bar dataKey="negative" stackId="a" fill="#ef4444" name="Negative"/>
                    <Bar dataKey="neutral" stackId="a" fill="#3b82f6" name="Neutral"/>
                </BarChart>
            </ResponsiveContainer>
        </Card>
    );
    const renderProducts = () => (<Card title="Sentiment by Product/Service">Content for Products/Services tab.</Card>);
    const renderGeoDemographics = () => (<Card title="Geographic and Demographic Sentiment Insights">Content for Geo/Demographics tab.</Card>);
    const renderKeywords = () => (<Card title="Keyword-Level Sentiment Analysis">Content for Keywords tab.</Card>);
    const renderAnomalies = () => (<Card title="Real-time Anomaly Detection & Alerts">Content for Anomaly Detection tab.</Card>);
    const renderCompetition = () => (
         <Card title="Competitive Landscape">
            <ResponsiveContainer width="100%" height={400}>
                <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                    <CartesianGrid stroke="#4b5563" />
                    <XAxis type="number" dataKey="overallScore" name="Sentiment Score" unit="" stroke="#9ca3af"/>
                    <YAxis type="number" dataKey="shareOfVoice" name="Share of Voice" unit="%" stroke="#9ca3af"/>
                    <Tooltip cursor={{ strokeDasharray: '3 3' }} contentStyle={{ backgroundColor: 'rgba(31, 41, 55, 0.8)', borderColor: '#4b5563' }} />
                    <Legend/>
                    {allCompetitors.map((c, i) => (
                         <Scatter key={c} name={c} data={[competitiveData.find(d => d.competitor === c)]} fill={CHART_COLORS[i+1]}/>
                    ))}
                    <Scatter name="Our Brand" data={[{overallScore: sentimentSummaryData.overallScore, shareOfVoice: 25}]} fill={CHART_COLORS[0]} shape="star"/>
                </ScatterChart>
            </ResponsiveContainer>
        </Card>
    );

    const renderForecast = () => (
        <ChartCard title="Sentiment Score Forecast (Next 3 Months)">
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={sentimentMonthlyTrendData}>
                    <XAxis dataKey="name" stroke="#9ca3af" />
                    <YAxis stroke="#9ca3af" domain={[0, 1]}/>
                    <Tooltip contentStyle={{ backgroundColor: 'rgba(31, 41, 55, 0.8)', borderColor: '#4b5563' }} />
                    <Legend />
                    <Line type="monotone" dataKey="averageScore" stroke="#8884d8" name="Historical Score" />
                    <Line type="monotone" dataKey="predictedScore" stroke="#82ca9d" name="Predicted Score" strokeDasharray="5 5" />
                    <Area type="monotone" dataKey="upperBound" fill="#82ca9d" stroke={false} stackId="pred" />
                    <Area type="monotone" dataKey="lowerBound" fill="#82ca9d" stroke={false} stackId="pred" />
                </LineChart>
            </ResponsiveContainer>
        </ChartCard>
    );
    
    return (
        <div className="p-6 bg-gray-900 min-h-screen text-white font-sans">
            {renderHeader()}
            {renderTabs()}
            {renderContent()}

            <button
                onClick={() => setIsChatbotOpen(!isChatbotOpen)}
                className="fixed bottom-6 right-6 bg-purple-600 text-white rounded-full p-4 shadow-lg hover:bg-purple-700 transition-transform transform hover:scale-110 z-40"
                aria-label="Open AI Chatbot"
            >
                <FaRobot size={24} />
            </button>
            <AIChatbot isOpen={isChatbotOpen} onClose={() => setIsChatbotOpen(false)} />
        </div>
    );
};

export default SentimentAnalysisView;

================================================================================
// APPENDED FROM REPO: diplomat-bit/Fuckyou | ORIGINAL PATH: diplomat-bit-Fuckyou-70f83c5/components/views/megadashboard/analytics/SentimentAnalysisView.tsx
================================================================================

// components/views/megadashboard/analytics/SentimentAnalysisView.tsx
import React from 'react';
import Card from '../../../Card';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const sentimentTrendData = [
    { name: 'Jan', positive: 85, negative: 10 },
    { name: 'Feb', positive: 88, negative: 8 },
    { name: 'Mar', positive: 82, negative: 15 },
    { name: 'Apr', positive: 90, negative: 5 },
    { name: 'May', positive: 92, negative: 4 },
    { name: 'Jun', positive: 91, negative: 6 },
];

const emergingTopics = [
    { topic: 'Mobile App Speed', sentiment: 'Negative', volume: 125 },
    { topic: 'New Savings Feature', sentiment: 'Positive', volume: 350 },
    { topic: 'Customer Support Wait Times', sentiment: 'Negative', volume: 88 },
];

const SentimentAnalysisView: React.FC = () => {
    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold text-white tracking-wider">AI Sentiment Analysis Engine</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="text-center"><p className="text-3xl font-bold text-green-400">91%</p><p className="text-sm text-gray-400 mt-1">Overall Positive Sentiment</p></Card>
                <Card className="text-center"><p className="text-3xl font-bold text-white">3</p><p className="text-sm text-gray-400 mt-1">Emerging Negative Topics</p></Card>
                <Card className="text-center"><p className="text-3xl font-bold text-white">1.2M</p><p className="text-sm text-gray-400 mt-1">Sources Analyzed (24h)</p></Card>
            </div>

            <Card title="Sentiment Trend (Last 6 Months)">
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={sentimentTrendData}>
                        <XAxis dataKey="name" stroke="#9ca3af" />
                        <YAxis stroke="#9ca3af" unit="%" />
                        <Tooltip contentStyle={{ backgroundColor: 'rgba(31, 41, 55, 0.8)', borderColor: '#4b5563' }} />
                        <Legend />
                        <Line type="monotone" dataKey="positive" name="Positive" stroke="#10b981" strokeWidth={2} />
                        <Line type="monotone" dataKey="negative" name="Negative" stroke="#ef4444" strokeWidth={2} />
                    </LineChart>
                </ResponsiveContainer>
            </Card>

            <Card title="AI-Detected Emerging Topics">
                 <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-400">
                        <thead className="text-xs text-gray-300 uppercase bg-gray-900/30">
                            <tr>
                                <th scope="col" className="px-6 py-3">Topic</th>
                                <th scope="col" className="px-6 py-3">Sentiment</th>
                                <th scope="col" className="px-6 py-3">Mention Volume</th>
                            </tr>
                        </thead>
                        <tbody>
                            {emergingTopics.map((topic, index) => (
                                <tr key={index} className="border-b border-gray-800 hover:bg-gray-800/50">
                                    <td className="px-6 py-4 font-medium text-white">{topic.topic}</td>
                                    <td className="px-6 py-4">
                                        <span className={topic.sentiment === 'Positive' ? 'text-green-400' : 'text-red-400'}>{topic.sentiment}</span>
                                    </td>
                                    <td className="px-6 py-4">{topic.volume}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
};

export default SentimentAnalysisView;

================================================================================
// APPENDED FROM REPO: diplomat-bit/magic | ORIGINAL PATH: diplomat-bit-magic-a3f5ff1/components/views/megadashboard/analytics/SentimentAnalysisView.tsx
================================================================================

// components/views/megadashboard/analytics/SentimentAnalysisView.tsx
import React from 'react';
import Card from '../../../Card';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const sentimentTrendData = [
    { name: 'Jan', positive: 85, negative: 10 },
    { name: 'Feb', positive: 88, negative: 8 },
    { name: 'Mar', positive: 82, negative: 15 },
    { name: 'Apr', positive: 90, negative: 5 },
    { name: 'May', positive: 92, negative: 4 },
    { name: 'Jun', positive: 91, negative: 6 },
];

const emergingTopics = [
    { topic: 'Mobile App Speed', sentiment: 'Negative', volume: 125 },
    { topic: 'New Savings Feature', sentiment: 'Positive', volume: 350 },
    { topic: 'Customer Support Wait Times', sentiment: 'Negative', volume: 88 },
];

const SentimentAnalysisView: React.FC = () => {
    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold text-white tracking-wider">AI Sentiment Analysis Engine</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="text-center"><p className="text-3xl font-bold text-green-400">91%</p><p className="text-sm text-gray-400 mt-1">Overall Positive Sentiment</p></Card>
                <Card className="text-center"><p className="text-3xl font-bold text-white">3</p><p className="text-sm text-gray-400 mt-1">Emerging Negative Topics</p></Card>
                <Card className="text-center"><p className="text-3xl font-bold text-white">1.2M</p><p className="text-sm text-gray-400 mt-1">Sources Analyzed (24h)</p></Card>
            </div>

            <Card title="Sentiment Trend (Last 6 Months)">
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={sentimentTrendData}>
                        <XAxis dataKey="name" stroke="#9ca3af" />
                        <YAxis stroke="#9ca3af" unit="%" />
                        <Tooltip contentStyle={{ backgroundColor: 'rgba(31, 41, 55, 0.8)', borderColor: '#4b5563' }} />
                        <Legend />
                        <Line type="monotone" dataKey="positive" name="Positive" stroke="#10b981" strokeWidth={2} />
                        <Line type="monotone" dataKey="negative" name="Negative" stroke="#ef4444" strokeWidth={2} />
                    </LineChart>
                </ResponsiveContainer>
            </Card>

            <Card title="AI-Detected Emerging Topics">
                 <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-400">
                        <thead className="text-xs text-gray-300 uppercase bg-gray-900/30">
                            <tr>
                                <th scope="col" className="px-6 py-3">Topic</th>
                                <th scope="col" className="px-6 py-3">Sentiment</th>
                                <th scope="col" className="px-6 py-3">Mention Volume</th>
                            </tr>
                        </thead>
                        <tbody>
                            {emergingTopics.map((topic, index) => (
                                <tr key={index} className="border-b border-gray-800 hover:bg-gray-800/50">
                                    <td className="px-6 py-4 font-medium text-white">{topic.topic}</td>
                                    <td className="px-6 py-4">
                                        <span className={topic.sentiment === 'Positive' ? 'text-green-400' : 'text-red-400'}>{topic.sentiment}</span>
                                    </td>
                                    <td className="px-6 py-4">{topic.volume}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
};

export default SentimentAnalysisView;