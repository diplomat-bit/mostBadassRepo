// REPOSITORY SOURCE: diplomat-bit/Citibank_Demo_Business_Inc_Demonstration- | PATH: diplomat-bit-Citibank_Demo_Business_Inc_Demonstration--ab2501d/components/views/platform/DemoBankSocialView.tsx
================================================================================

import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import Card from '../../Card';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, AreaChart, Area, PieChart, Pie, Cell, LineChart, Line, CartesianGrid, ComposedChart, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { ChevronDown, ChevronUp, Search, Filter, Plus, Edit, Trash2, Calendar as CalendarIcon, Download, Settings, BarChart2, MessageSquare, Users, Target, ThumbsUp, Share2, Eye, Repeat, Heart, Zap, BrainCircuit, Bot, Send, ArrowRight, Check, X, MoreVertical, Star, TrendingUp, Sparkles, Wand2 } from 'lucide-react';

// SECTION 1: ADVANCED TYPES AND INTERFACES
// ==========================================

export type SocialPlatform = 'X' | 'LinkedIn' | 'Instagram' | 'Facebook' | 'TikTok';
export type PostStatus = 'Published' | 'Scheduled' | 'Draft' | 'Needs Approval' | 'Archived';
export type Sentiment = 'Positive' | 'Negative' | 'Neutral';
export type CampaignGoal = 'Brand Awareness' | 'Lead Generation' | 'Conversions' | 'Engagement' | 'Website Traffic';
export type MediaType = 'Image' | 'Video' | 'Text' | 'Link' | 'Carousel';
export type UserRole = 'Admin' | 'Editor' | 'Viewer' | 'Strategist';

export interface SocialProfile {
    platform: SocialPlatform;
    handle: string;
    followers: number;
    profileUrl: string;
    avatarUrl: string;
}

export interface AIInsight {
    id: string;
    type: 'Suggestion' | 'Observation' | 'Warning';
    text: string;
    actionable: boolean;
    relatedMetric?: keyof PostAnalytics;
}

export interface PostAnalytics {
    impressions: number;
    reach: number;
    engagementRate: number;
    videoViews: number;
    ctr: number; // Click-through rate
    costPerEngagement: number;
}

export interface Post {
    id: string;
    platform: SocialPlatform;
    author: string;
    authorAvatar: string;
    content: string;
    media: { type: MediaType; url: string; altText?: string }[];
    status: PostStatus;
    likes: number;
    shares: number;
    comments: number;
    analytics: PostAnalytics;
    createdAt: Date;
    scheduledAt?: Date;
    publishedAt?: Date;
    tags: string[];
    campaignId?: string;
    aiInsights: AIInsight[];
}

export interface Mention {
    id: string;
    platform: SocialPlatform;
    author: string;
    authorAvatar: string;
    content: string;
    timestamp: Date;
    sentiment: Sentiment;
    url: string;
    isRead: boolean;
    isFlagged: boolean;
    assignedTo?: string; // User ID
}

export interface Campaign {
    id: string;
    name: string;
    goal: CampaignGoal;
    startDate: Date;
    endDate: Date;
    budget: number;
    spent: number;
    posts: string[]; // array of post IDs
    kpi: {
        impressions: number;
        clicks: number;
        conversions: number;
        ctr: number;
        cpc: number;
        roi: number;
    };
    targetAudience: {
        ageRange: [number, number];
        locations: string[];
        interests: string[];
    };
}

export interface AnalyticsDataPoint {
    date: string;
    impressions: number;
    engagement: number;
    followers: number;
    mentions: number;
    sentimentScore: number; // e.g., from -1 to 1
}

export interface DemographicData {
    age: Record<string, number>;
    gender: { male: number; female: number; other: number };
    location: { name: string; value: number }[];
}

export interface Competitor {
    name: string;
    profiles: SocialProfile[];
    monthlyFollowerGrowth: number;
    avgEngagementRate: number;
    postsPerWeek: number;
    sentiment: { positive: number, neutral: number, negative: number };
}

export interface AppSettings {
    theme: 'dark' | 'light';
    notifications: {
        newMentions: boolean;
        approvalRequests: boolean;
        campaignUpdates: boolean;
        aiAlerts: boolean;
    };
    connectedAccounts: SocialPlatform[];
    user: {
        name: string;
        email: string;
        role: UserRole;
        avatar: string;
    }
}

// SECTION 2: MOCK DATA GENERATION
// =================================

const MOCK_AUTHORS = [
    { name: 'Alice Johnson', avatar: 'https://i.pravatar.cc/40?u=alice' },
    { name: 'Bob Williams', avatar: 'https://i.pravatar.cc/40?u=bob' },
    { name: 'Charlie Brown', avatar: 'https://i.pravatar.cc/40?u=charlie' },
    { name: 'Diana Miller', avatar: 'https://i.pravatar.cc/40?u=diana' }
];
const MOCK_TAGS = ['#fintech', '#innovation', '#banking', '#digitalfinance', '#AI', '#security', '#investment', '#futureofmoney', '#wealthtech'];
const MOCK_CAMPAIGNS = ['Q3 Product Launch', 'Summer Savings Sprint', 'Future of Finance Forum', 'Cybersecurity Awareness Month'];
const MOCK_LOCATIONS = ['New York', 'London', 'San Francisco', 'Singapore', 'Tokyo', 'Berlin', 'Toronto'];
const MOCK_INTERESTS = ['Finance', 'Technology', 'Startups', 'Venture Capital', 'Economics', 'Cryptocurrency'];

const getRandomElement = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
const getRandomNumber = (min: number, max: number, isFloat: boolean = false): number => {
    const num = Math.random() * (max - min) + min;
    return isFloat ? num : Math.floor(num);
};
const generateRandomDate = (start: Date, end: Date): Date => new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));

const generateMockAIInsight = (id: number): AIInsight => {
    const insights = [
        { type: 'Suggestion', text: 'This post type performs well on weekends. Consider scheduling for Saturday AM.', actionable: true, relatedMetric: 'engagementRate' },
        { type: 'Observation', text: 'Posts with video content have a 45% higher engagement rate on this platform.', actionable: false, relatedMetric: 'videoViews' },
        { type: 'Warning', text: 'Negative sentiment detected in comments. Review immediately.', actionable: true },
        { type: 'Suggestion', text: 'The hashtag #wealthtech is trending. Consider including it in your next relevant post.', actionable: true },
        { type: 'Observation', text: 'Impressions are 20% above average for a weekday post.', actionable: false, relatedMetric: 'impressions' }
    ] as const;
    const insight = getRandomElement(insights);
    return { id: `insight_${id}`, ...insight };
};

export const generateMockPost = (id: number, status?: PostStatus): Post => {
    const likes = getRandomNumber(50, 5000);
    const comments = getRandomNumber(10, 500);
    const shares = getRandomNumber(5, 1000);
    const impressions = likes * getRandomNumber(20, 50);
    const reach = impressions * getRandomNumber(0.7, 0.9, true);
    const engagementRate = ((likes + comments + shares) / reach) * 100;
    const author = getRandomElement(MOCK_AUTHORS);
    const postStatus = status || getRandomElement<PostStatus>(['Published', 'Scheduled', 'Draft', 'Needs Approval']);
    const createdAt = generateRandomDate(new Date(2023, 0, 1), new Date());
    let scheduledAt, publishedAt;
    if (postStatus === 'Scheduled') {
        scheduledAt = generateRandomDate(new Date(), new Date(new Date().getTime() + 30 * 24 * 60 * 60 * 1000));
    }
    if (postStatus === 'Published') {
        publishedAt = generateRandomDate(createdAt, new Date());
    }

    return {
        id: `post_${id}`,
        platform: getRandomElement<SocialPlatform>(['X', 'LinkedIn', 'Instagram', 'Facebook', 'TikTok']),
        author: author.name,
        authorAvatar: author.avatar,
        content: `This is mock content for post ${id}. We're excited about the future of digital banking. ${getRandomElement(MOCK_TAGS)}`,
        media: [{ type: getRandomElement(['Image', 'Video']), url: `https://picsum.photos/seed/${id}/800/600` }],
        status: postStatus,
        likes, shares, comments,
        analytics: {
            impressions, reach, engagementRate, videoViews: getRandomNumber(0, impressions / 2),
            ctr: getRandomNumber(1, 5, true), costPerEngagement: getRandomNumber(0.1, 1.5, true)
        },
        createdAt, scheduledAt, publishedAt,
        tags: [getRandomElement(MOCK_TAGS), getRandomElement(MOCK_TAGS)],
        campaignId: Math.random() > 0.5 ? `campaign_${getRandomNumber(1, 4)}` : undefined,
        aiInsights: Array.from({ length: getRandomNumber(0, 3) }, (_, i) => generateMockAIInsight(id * 10 + i))
    };
};

export const generateMockMention = (id: number): Mention => ({
    id: `mention_${id}`,
    platform: getRandomElement<SocialPlatform>(['X', 'Facebook']),
    author: `@user${getRandomNumber(100, 999)}`,
    authorAvatar: `https://i.pravatar.cc/40?u=user${id}`,
    content: `Hey @DemoBank, I have a question about my account. Can you help? #support`,
    timestamp: generateRandomDate(new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000), new Date()),
    sentiment: getRandomElement<Sentiment>(['Positive', 'Negative', 'Neutral']),
    url: '#',
    isRead: Math.random() > 0.3,
    isFlagged: Math.random() > 0.8,
});

export const generateMockCampaign = (id: number, name: string): Campaign => {
    const budget = getRandomNumber(5000, 50000);
    const spent = budget * getRandomNumber(0.4, 1.1, true);
    const impressions = getRandomNumber(100000, 2000000);
    const clicks = impressions * getRandomNumber(0.01, 0.05, true);
    const conversions = clicks * getRandomNumber(0.02, 0.1, true);
    return {
        id: `campaign_${id}`,
        name,
        goal: getRandomElement<CampaignGoal>(['Brand Awareness', 'Lead Generation', 'Conversions', 'Engagement']),
        startDate: new Date(2023, id * 2, 1),
        endDate: new Date(2023, id * 2 + 1, 28),
        budget, spent,
        posts: Array.from({ length: getRandomNumber(5, 15) }, (_, i) => `post_${id * 10 + i}`),
        kpi: {
            impressions, clicks, conversions,
            ctr: (clicks / impressions) * 100,
            cpc: spent / clicks,
            roi: (conversions * 50 - spent) / spent * 100,
        },
        targetAudience: {
            ageRange: [25, 55],
            locations: [getRandomElement(MOCK_LOCATIONS), getRandomElement(MOCK_LOCATIONS)],
            interests: [getRandomElement(MOCK_INTERESTS), getRandomElement(MOCK_INTERESTS)]
        }
    };
};

export const generateMockAnalytics = (days: number): AnalyticsDataPoint[] => {
    const data: AnalyticsDataPoint[] = [];
    let followers = 1_200_000;
    for (let i = days - 1; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        followers += getRandomNumber(-100, 500);
        data.push({
            date: date.toISOString().split('T')[0],
            impressions: getRandomNumber(20000, 50000),
            engagement: getRandomNumber(500, 3000),
            followers: followers,
            mentions: getRandomNumber(20, 150),
            sentimentScore: getRandomNumber(-0.5, 0.8, true),
        });
    }
    return data;
};

export const MOCK_DEMOGRAPHICS: DemographicData = {
    age: { '18-24': 25, '25-34': 35, '35-44': 20, '45-54': 15, '55+': 5 },
    gender: { male: 48, female: 50, other: 2 },
    location: [
        { name: 'New York', value: 22 }, { name: 'London', value: 18 },
        { name: 'San Francisco', value: 15 }, { name: 'Singapore', value: 11 },
        { name: 'Tokyo', value: 8 }, { name: 'Other', value: 26 }
    ],
};

export const MOCK_COMPETITORS: Competitor[] = [
    { name: 'FinCorp', profiles: [], monthlyFollowerGrowth: 1500, avgEngagementRate: 2.1, postsPerWeek: 8, sentiment: { positive: 50, neutral: 35, negative: 15 } },
    { name: 'FutureBank', profiles: [], monthlyFollowerGrowth: 2200, avgEngagementRate: 3.2, postsPerWeek: 12, sentiment: { positive: 65, neutral: 25, negative: 10 } },
    { name: 'CapitalOne', profiles: [], monthlyFollowerGrowth: 1800, avgEngagementRate: 2.5, postsPerWeek: 10, sentiment: { positive: 55, neutral: 30, negative: 15 } },
];


// SECTION 3: HELPER FUNCTIONS & UTILS
// ===================================

export const formatNumber = (num: number): string => {
    if (Math.abs(num) >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (Math.abs(num) >= 1000) return (num / 1000).toFixed(1) + 'k';
    return num.toString();
};
export const formatDate = (date: Date, format: 'short' | 'long' = 'short'): string => {
    if (format === 'long') return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};
export const getPercentageChange = (current: number, previous: number): number => {
    if (previous === 0) return current > 0 ? 100 : 0;
    return ((current - previous) / previous) * 100;
};
export const classNames = (...classes: (string | boolean | undefined)[]) => classes.filter(Boolean).join(' ');


// SECTION 4: AI SIMULATION SERVICE
// ================================

export const AIService = {
    generatePostContent: async (prompt: string, platform: SocialPlatform): Promise<string> => {
        console.log(`AI: Generating content for ${platform} with prompt: "${prompt}"`);
        await new Promise(res => setTimeout(res, 1500));
        return `🚀 Elevating your financial journey! Based on your prompt about "${prompt}", we're introducing revolutionary tools to achieve your goals faster. Discover more at our link in bio! #Fintech #Innovation #${platform}`;
    },
    suggestHashtags: async (content: string): Promise<string[]> => {
        console.log('AI: Suggesting hashtags...');
        await new Promise(res => setTimeout(res, 800));
        return ['#DigitalBanking', '#FutureOfFinance', '#SmartInvesting', '#WealthManagement', '#PersonalFinance'];
    },
    getBestPostingTimes: async (platform: SocialPlatform): Promise<{ day: string; time: string; score: number }[]> => {
        console.log(`AI: Calculating best posting times for ${platform}...`);
        await new Promise(res => setTimeout(res, 1200));
        return [
            { day: 'Wednesday', time: '9:00 AM', score: 95 },
            { day: 'Friday', time: '11:00 AM', score: 92 },
            { day: 'Thursday', time: '2:00 PM', score: 88 },
        ];
    }
};

// SECTION 5: REUSABLE UI SUB-COMPONENTS
// =====================================

export const KpiCard: React.FC<{ title: string; value: string; trend: number; description: string; icon: React.ReactElement }> = ({ title, value, trend, description, icon }) => {
    const isPositive = trend >= 0;
    return (
        <Card>
            <div className="flex justify-between items-start">
                <p className="text-sm text-gray-400">{title}</p>
                <div className="p-2 bg-gray-700/50 rounded-md">{icon}</div>
            </div>
            <p className="text-3xl font-bold text-white mt-1">{value}</p>
            <div className="flex items-center mt-2">
                <span className={`flex items-center text-sm font-semibold ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
                    {isPositive ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    {Math.abs(trend).toFixed(1)}%
                </span>
                <p className="text-xs text-gray-500 ml-2">{description}</p>
            </div>
        </Card>
    );
};

export const CustomTooltip: React.FC<any> = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="p-4 bg-gray-800 border border-gray-700 rounded-lg shadow-lg">
                <p className="label text-white font-bold">{`${label}`}</p>
                {payload.map((pld: any, index: number) => (
                    <p key={index} style={{ color: pld.color }} className="intro">
                        {`${pld.name}: ${pld.value.toLocaleString()}`}
                    </p>
                ))}
            </div>
        );
    }
    return null;
};

const platformIcons: Record<SocialPlatform, React.ReactElement> = {
    X: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>,
    LinkedIn: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>,
    Instagram: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.85s-.011 3.584-.069 4.85c-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07s-3.584-.012-4.85-.07c-3.252-.148-4.771-1.691-4.919-4.919-.058-1.265-.069-1.645-.069-4.85s.011-3.584.069-4.85c.149-3.225 1.664-4.771 4.919-4.919 1.266-.057 1.644-.07 4.85-.07zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948s.014 3.667.072 4.947c.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072s3.667-.014 4.947-.072c4.358-.2 6.78-2.618 6.98-6.98.059-1.281.073-1.689.073-4.948s-.014-3.667-.072-4.947c-.2-4.358-2.618-6.78-6.98-6.98-1.281-.058-1.689-.072-4.948-.072zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.162 6.162 6.162 6.162-2.759 6.162-6.162-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4s1.791-4 4-4 4 1.79 4 4-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44 1.441-.645 1.441-1.44-.645-1.44-1.441-1.44z"/></svg>,
    Facebook: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.323-1.325z"/></svg>,
    TikTok: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M12.525.02c1.31-.02 2.61-.01 3.91.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-2.43.05-4.86-.95-6.69-2.8-1.95-2-3.02-4.44-3.02-7.03 0-3.46 2.34-6.63 5.65-7.52 1.34-.36 2.73-.41 4.09-.4.1 2.15-.02 4.3.02 6.45.04 1.88-.34 3.74-1.22 5.31-1.04 1.86-2.94 3.06-5.12 3.13-1.56.05-3.1-.4-4.33-1.28-1.26-.89-2.18-2.22-2.41-3.66-.07-1.14.03-2.3.03-3.45.01-3.47.01-6.95.02-10.42.01-1.6.53-3.18 1.6-4.44 1.06-1.27 2.51-2.07 4.11-2.29 1.7-.23 3.4-.15 5.1.02z"/></svg>,
};


// SECTION 6: CORE VIEW COMPONENTS
// ===================================
// NOTE: I've moved the component implementations before the main view for better readability in this large file.

const DashboardView: React.FC<{ analytics: AnalyticsDataPoint[], posts: Post[] }> = ({ analytics, posts }) => {
    const totalFollowers = analytics[analytics.length-1]?.followers || 0;
    const prevFollowers = analytics[analytics.length-8]?.followers || 0;
    const newFollowers7d = totalFollowers - prevFollowers;
    const followerTrend = getPercentageChange(newFollowers7d, prevFollowers);

    const totalImpressions24h = analytics[analytics.length-1]?.impressions || 0;
    const prevImpressions24h = analytics[analytics.length-2]?.impressions || 0;
    const impressionsTrend = getPercentageChange(totalImpressions24h, prevImpressions24h);
    
    const totalEngagement = posts.reduce((sum, p) => sum + p.likes + p.comments + p.shares, 0);
    const totalReach = posts.reduce((sum, p) => sum + p.analytics.reach, 0);
    const engagementRate = totalReach > 0 ? (totalEngagement / totalReach) * 100 : 0;
    const engagementTrend = getPercentageChange(engagementRate, 2.4);
    
    const followerGrowthData = analytics.slice(-30).map(d => ({ name: d.date.slice(5), followers: d.followers }));
    
    const sentimentDistribution = [ { name: 'Positive', value: 400 }, { name: 'Neutral', value: 300 }, { name: 'Negative', value: 100 } ];
    const COLORS = ['#10B981', '#6B7280', '#EF4444'];
    
    return (
        <div className="space-y-6 animate-fadeIn">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <KpiCard title="Total Followers" value={formatNumber(totalFollowers)} trend={followerTrend} description="vs previous 7 days" icon={<Users className="w-5 h-5 text-indigo-400"/>} />
                <KpiCard title="Engagement Rate" value={`${engagementRate.toFixed(2)}%`} trend={engagementTrend} description="vs previous 30 days" icon={<Heart className="w-5 h-5 text-rose-400"/>} />
                <KpiCard title="Impressions (24h)" value={formatNumber(totalImpressions24h)} trend={impressionsTrend} description="vs previous day" icon={<Eye className="w-5 h-5 text-cyan-400"/>} />
                <KpiCard title="New Followers (7d)" value={`+${formatNumber(newFollowers7d)}`} trend={followerTrend} description="Growth rate" icon={<TrendingUp className="w-5 h-5 text-green-400"/>} />
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                <div className="lg:col-span-3">
                    <Card title="30-Day Follower Growth">
                        <ResponsiveContainer width="100%" height={300}>
                            <AreaChart data={followerGrowthData}>
                                <defs><linearGradient id="colorFollowers" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/><stop offset="95%" stopColor="#8884d8" stopOpacity={0}/></linearGradient></defs>
                                <XAxis dataKey="name" stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => formatNumber(value as number)} />
                                <Tooltip content={<CustomTooltip />} />
                                <Area type="monotone" dataKey="followers" stroke="#8884d8" fill="url(#colorFollowers)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </Card>
                </div>
                <div className="lg:col-span-2">
                    <Card title="Sentiment Analysis">
                         <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie data={sentimentDistribution} cx="50%" cy="50%" labelLine={false} outerRadius={100} fill="#8884d8" dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                                    {sentimentDistribution.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                                </Pie>
                                <Tooltip content={<CustomTooltip />} /><Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </Card>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card title="Top Performing Posts (by Engagement Rate)">
                    <div className="space-y-4">
                        {posts.sort((a,b) => b.analytics.engagementRate - a.analytics.engagementRate).slice(0, 4).map(post => (
                            <div key={post.id} className="flex items-start space-x-3 p-2 bg-gray-900/40 rounded-lg">
                                <div className="text-white mt-1">{platformIcons[post.platform]}</div>
                                <div className="flex-1">
                                    <p className="text-gray-300 text-sm truncate">{post.content}</p>
                                    <div className="flex space-x-4 text-xs text-gray-400 mt-2">
                                        <span className="flex items-center"><ThumbsUp size={12} className="mr-1"/>{formatNumber(post.likes)}</span>
                                        <span className="flex items-center"><MessageSquare size={12} className="mr-1"/>{formatNumber(post.comments)}</span>
                                        <span className="flex items-center"><Share2 size={12} className="mr-1"/>{formatNumber(post.shares)}</span>
                                        <span className="flex items-center font-bold text-indigo-400">{post.analytics.engagementRate.toFixed(2)}% eng.</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>
                 <Card title="AI-Powered Optimization Suggestions">
                    <div className="space-y-3">
                        <div className="flex items-start p-3 bg-indigo-900/30 rounded-lg">
                            <Zap className="h-5 w-5 text-indigo-400 mr-3 mt-1" />
                            <div>
                                <h4 className="font-semibold text-white">Best Time to Post</h4>
                                <p className="text-sm text-gray-300">Your audience on <span className="font-bold">LinkedIn</span> is most active on <span className="font-bold text-indigo-300">Tuesdays at 10 AM</span>. Schedule your next post for maximum reach.</p>
                            </div>
                        </div>
                         <div className="flex items-start p-3 bg-green-900/30 rounded-lg">
                            <BrainCircuit className="h-5 w-5 text-green-400 mr-3 mt-1" />
                            <div>
                                <h4 className="font-semibold text-white">Content Strategy Insight</h4>
                                <p className="text-sm text-gray-300">Video posts explaining market trends have seen a <span className="font-bold text-green-300">35% higher share rate</span> this month. Create more expert analysis videos.</p>
                            </div>
                        </div>
                         <div className="flex items-start p-3 bg-yellow-900/30 rounded-lg">
                            <Sparkles className="h-5 w-5 text-yellow-400 mr-3 mt-1" />
                            <div>
                                <h4 className="font-semibold text-white">Trending Topic Alert</h4>
                                <p className="text-sm text-gray-300">The topic of <span className="font-bold text-yellow-300">"Sustainable Investing"</span> is gaining traction. Draft a post to join the conversation.</p>
                            </div>
                        </div>
                    </div>
                 </Card>
            </div>
        </div>
    );
};

// SECTION 10: THE MAIN VIEW COMPONENT
// ===================================

const DemoBankSocialView: React.FC = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('Dashboard');
    const [allPosts, setAllPosts] = useState<Post[]>([]);
    const [allMentions, setAllMentions] = useState<Mention[]>([]);
    const [allCampaigns, setAllCampaigns] = useState<Campaign[]>([]);
    const [analytics, setAnalytics] = useState<AnalyticsDataPoint[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingPost, setEditingPost] = useState<Post | undefined>(undefined);
    
    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            await new Promise(res => setTimeout(res, 1500));
            setAllPosts(Array.from({ length: 50 }, (_, i) => generateMockPost(i + 1)));
            setAllMentions(Array.from({ length: 30 }, (_, i) => generateMockMention(i + 1)));
            setAllCampaigns(MOCK_CAMPAIGNS.map((name, i) => generateMockCampaign(i + 1, name)));
            setAnalytics(generateMockAnalytics(30));
            setIsLoading(false);
        };
        fetchData();
    }, []);

    const handleOpenModal = (post?: Post) => {
        setEditingPost(post);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setEditingPost(undefined);
        setIsModalOpen(false);
    };

    const handleSavePost = (postToSave: Post) => {
        if(allPosts.find(p => p.id === postToSave.id)) {
            setAllPosts(allPosts.map(p => p.id === postToSave.id ? postToSave : p));
        } else {
            setAllPosts([postToSave, ...allPosts]);
        }
    };

    const handleDeletePost = (id: string) => {
        setAllPosts(allPosts.filter(p => p.id !== id));
    };


    const renderContent = () => {
        if (isLoading) {
            return <div className="text-center py-20 text-white">Loading Social Dashboard...</div>;
        }
        
        switch (activeTab) {
            case 'Dashboard':
                return <DashboardView analytics={analytics} posts={allPosts} />;
            case 'Content':
                 return (
                    <Card title="Content Management" rightHeader={<button className="text-sm text-indigo-400 hover:text-indigo-300">View All</button>}>
                        <PostManagementTable posts={allPosts} onEdit={handleOpenModal} onDelete={handleDeletePost} />
                    </Card>
                );
            case 'Campaigns':
                return <CampaignPerformance campaigns={allCampaigns} />;
            case 'Listening':
                return <SocialListeningFeed mentions={allMentions} />;
            default:
                return <div className="text-center py-20 text-gray-500">This view is under construction.</div>;
        }
    };

    const TABS = ['Dashboard', 'Content', 'Campaigns', 'Listening', 'Analytics', 'Reports'];

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold text-white tracking-wider">Demo Bank Social Hub</h2>
                <div className="flex space-x-2">
                    <button onClick={() => handleOpenModal()} className="flex items-center bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2 px-4 rounded-lg shadow-lg transition-all duration-200 transform hover:scale-105">
                        <Plus className="mr-2 h-5 w-5" /> Create Post
                    </button>
                    <button className="flex items-center bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200">
                        <Settings className="h-5 w-5" />
                    </button>
                </div>
            </div>

            <div className="border-b border-gray-700">
                <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                    {TABS.map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={classNames(
                                activeTab === tab
                                    ? 'border-indigo-500 text-indigo-400'
                                    : 'border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-500',
                                'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-all duration-200'
                            )}
                        >
                            {tab}
                        </button>
                    ))}
                </nav>
            </div>
            
            {renderContent()}

            <CreatePostModal isOpen={isModalOpen} onClose={handleCloseModal} post={editingPost} onSave={handleSavePost} />

        </div>
    );
};

export const PostManagementTable: React.FC<{ posts: Post[]; onEdit: (post: Post) => void; onDelete: (id: string) => void; }> = ({ posts, onEdit, onDelete }) => {
    const [sortedPosts, setSortedPosts] = useState<Post[]>([]);
    const [sortConfig, setSortConfig] = useState<{ key: keyof Post; direction: 'ascending' | 'descending' } | null>(null);

    useEffect(() => { setSortedPosts([...posts]); }, [posts]);

    const requestSort = (key: keyof Post) => {
        let direction: 'ascending' | 'descending' = 'ascending';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });

        setSortedPosts([...sortedPosts].sort((a, b) => {
            if (a[key] < b[key]) return direction === 'ascending' ? -1 : 1;
            if (a[key] > b[key]) return direction === 'ascending' ? 1 : -1;
            return 0;
        }));
    };
    
    const getSortIcon = (key: keyof Post) => {
        if (!sortConfig || sortConfig.key !== key) return <ChevronDown className="h-3 w-3 inline-block ml-1 opacity-30" />;
        return sortConfig.direction === 'ascending' ? <ChevronUp className="h-3 w-3 inline-block ml-1" /> : <ChevronDown className="h-3 w-3 inline-block ml-1" />;
    };

    return (
        <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-400">
                <thead className="text-xs text-gray-300 uppercase bg-gray-900/30">
                    <tr>
                        <th scope="col" className="px-6 py-3 cursor-pointer" onClick={() => requestSort('platform')}>Platform {getSortIcon('platform')}</th>
                        <th scope="col" className="px-6 py-3">Content</th>
                        <th scope="col" className="px-6 py-3 cursor-pointer" onClick={() => requestSort('likes')}>Likes {getSortIcon('likes')}</th>
                        <th scope="col" className="px-6 py-3 cursor-pointer" onClick={() => requestSort('shares')}>Shares {getSortIcon('shares')}</th>
                        <th scope="col" className="px-6 py-3 cursor-pointer" onClick={() => requestSort('status')}>Status {getSortIcon('status')}</th>
                        <th scope="col" className="px-6 py-3 cursor-pointer" onClick={() => requestSort('publishedAt')}>Date {getSortIcon('publishedAt')}</th>
                        <th scope="col" className="px-6 py-3">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {sortedPosts.slice(0, 10).map(post => (
                        <tr key={post.id} className="border-b border-gray-800 hover:bg-gray-800/50">
                            <td className="px-6 py-4 font-bold text-white"><div className="flex items-center gap-2">{platformIcons[post.platform]} {post.platform}</div></td>
                            <td className="px-6 py-4 max-w-sm truncate" title={post.content}>{post.content}</td>
                            <td className="px-6 py-4">{post.likes.toLocaleString()}</td>
                            <td className="px-6 py-4">{post.shares.toLocaleString()}</td>
                            <td className="px-6 py-4">
                                <span className={classNames(
                                    'px-2 py-1 text-xs rounded-full',
                                    post.status === 'Published' && 'bg-green-900 text-green-300',
                                    post.status === 'Scheduled' && 'bg-yellow-900 text-yellow-300',
                                    post.status === 'Draft' && 'bg-gray-700 text-gray-300',
                                    post.status === 'Needs Approval' && 'bg-blue-900 text-blue-300',
                                )}>{post.status}</span>
                            </td>
                            <td className="px-6 py-4">{post.publishedAt ? formatDate(post.publishedAt) : (post.scheduledAt ? `Sched. ${formatDate(post.scheduledAt)}` : 'N/A')}</td>
                            <td className="px-6 py-4 flex space-x-2">
                                <button onClick={() => onEdit(post)} className="text-blue-400 hover:text-blue-300"><Edit size={16} /></button>
                                <button onClick={() => onDelete(post.id)} className="text-red-400 hover:text-red-300"><Trash2 size={16} /></button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export const CampaignPerformance: React.FC<{ campaigns: Campaign[] }> = ({ campaigns }) => (
    <Card title="Campaign Performance">
        <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-400">
                <thead className="text-xs text-gray-300 uppercase bg-gray-900/30">
                    <tr>
                        <th scope="col" className="px-4 py-3">Campaign</th><th scope="col" className="px-4 py-3">Goal</th>
                        <th scope="col" className="px-4 py-3">Budget</th><th scope="col" className="px-4 py-3">Spent</th>
                        <th scope="col" className="px-4 py-3">Impressions</th><th scope="col" className="px-4 py-3">CTR</th>
                        <th scope="col" className="px-4 py-3">ROI</th>
                    </tr>
                </thead>
                <tbody>
                    {campaigns.map(c => (
                        <tr key={c.id} className="border-b border-gray-800 hover:bg-gray-800/50">
                            <td className="px-4 py-4 font-bold text-white">{c.name}</td><td className="px-4 py-4">{c.goal}</td>
                            <td className="px-4 py-4">${c.budget.toLocaleString()}</td><td className="px-4 py-4">${c.spent.toLocaleString()}</td>
                            <td className="px-4 py-4">{formatNumber(c.kpi.impressions)}</td><td className="px-4 py-4">{c.kpi.ctr.toFixed(2)}%</td>
                            <td className={`px-4 py-4 font-semibold ${c.kpi.roi > 0 ? 'text-green-400' : 'text-red-400'}`}>{c.kpi.roi.toFixed(1)}%</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </Card>
);

export const SocialListeningFeed: React.FC<{ mentions: Mention[] }> = ({ mentions }) => {
    const [filter, setFilter] = useState<Sentiment | 'All'>('All');
    const filteredMentions = useMemo(() => mentions.filter(m => filter === 'All' || m.sentiment === filter), [mentions, filter]);

    const getSentimentColor = (sentiment: Sentiment) => ({
        Positive: 'border-l-4 border-green-500', Negative: 'border-l-4 border-red-500', Neutral: 'border-l-4 border-gray-500',
    }[sentiment]);

    return (
        <Card title="Social Listening">
            <div className="flex space-x-2 mb-4">
                {(['All', 'Positive', 'Negative', 'Neutral'] as const).map(f => (
                    <button key={f} onClick={() => setFilter(f)} className={`px-3 py-1 text-sm rounded-full ${filter === f ? 'bg-indigo-600 text-white' : 'bg-gray-700 text-gray-300'}`}>
                        {f}
                    </button>
                ))}
            </div>
            <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                {filteredMentions.map(mention => (
                    <div key={mention.id} className={`p-4 bg-gray-900/50 rounded-lg ${getSentimentColor(mention.sentiment)}`}>
                        <div className="flex items-start space-x-3">
                            <img src={mention.authorAvatar} alt={mention.author} className="w-10 h-10 rounded-full" />
                            <div className="flex-1">
                                <div className="flex justify-between items-center">
                                    <p className="font-bold text-white">{mention.author}</p>
                                    <span className="text-xs text-gray-500">{formatDate(mention.timestamp)}</span>
                                </div>
                                <p className="text-gray-300 mt-1">{mention.content}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </Card>
    );
};


// SECTION 7: MODAL DIALOGS
// ===================================

export const CreatePostModal: React.FC<{ isOpen: boolean; onClose: () => void; post?: Post; onSave: (post: Post) => void; }> = ({ isOpen, onClose, post, onSave }) => {
    const [content, setContent] = useState('');
    const [platform, setPlatform] = useState<SocialPlatform>('X');
    const [scheduledAt, setScheduledAt] = useState<string>('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [suggestedTags, setSuggestedTags] = useState<string[]>([]);

    useEffect(() => {
        if (post) {
            setContent(post.content);
            setPlatform(post.platform);
            setScheduledAt(post.scheduledAt ? post.scheduledAt.toISOString().slice(0, 16) : '');
        } else {
            setContent(''); setPlatform('X'); setScheduledAt('');
        }
    }, [post, isOpen]);

    if (!isOpen) return null;
    
    const handleGenerateContent = async () => {
        setIsGenerating(true);
        const newContent = await AIService.generatePostContent(content || 'our latest financial product', platform);
        setContent(newContent);
        const tags = await AIService.suggestHashtags(newContent);
        setSuggestedTags(tags);
        setIsGenerating(false);
    };

    const handleSave = () => {
        const newPost: Post = post || generateMockPost(999);
        newPost.content = content; newPost.platform = platform;
        newPost.scheduledAt = scheduledAt ? new Date(scheduledAt) : undefined;
        newPost.status = scheduledAt ? 'Scheduled' : 'Draft';
        onSave(newPost);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex justify-center items-center">
            <div className="bg-gray-800 rounded-lg p-8 w-full max-w-2xl border border-gray-700">
                <h3 className="text-2xl font-bold text-white mb-4">{post ? 'Edit Post' : 'Create Post'}</h3>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Platform</label>
                        <select value={platform} onChange={(e) => setPlatform(e.target.value as SocialPlatform)} className="w-full bg-gray-900 border border-gray-700 text-white rounded-md p-2 focus:ring-indigo-500 focus:border-indigo-500">
                            <option>X</option><option>LinkedIn</option><option>Instagram</option><option>Facebook</option><option>TikTok</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Content</label>
                        <textarea rows={6} value={content} onChange={(e) => setContent(e.target.value)} className="w-full bg-gray-900 border border-gray-700 text-white rounded-md p-2 focus:ring-indigo-500 focus:border-indigo-500" placeholder="What's on your mind? Or provide a prompt for AI..." />
                        <button onClick={handleGenerateContent} disabled={isGenerating} className="flex items-center gap-2 mt-2 px-3 py-1 text-sm bg-indigo-600 hover:bg-indigo-500 rounded-md disabled:bg-indigo-800 disabled:cursor-not-allowed">
                             <Wand2 size={14}/> {isGenerating ? 'Generating...' : 'Generate with AI'}
                        </button>
                    </div>
                     {suggestedTags.length > 0 && <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Suggested Hashtags</label>
                        <div className="flex flex-wrap gap-2">
                           {suggestedTags.map(tag => <button key={tag} onClick={() => setContent(c => `${c} ${tag}`)} className="px-2 py-1 text-xs bg-gray-700 hover:bg-gray-600 rounded-full">{tag}</button>)}
                        </div>
                    </div>}
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Schedule (Optional)</label>
                        <input type="datetime-local" value={scheduledAt} onChange={(e) => setScheduledAt(e.target.value)} className="w-full bg-gray-900 border border-gray-700 text-white rounded-md p-2 focus:ring-indigo-500 focus:border-indigo-500" />
                    </div>
                </div>
                <div className="flex justify-end space-x-4 mt-6">
                    <button onClick={onClose} className="px-4 py-2 rounded-md text-white bg-gray-600 hover:bg-gray-500">Cancel</button>
                    <button onClick={handleSave} className="px-4 py-2 rounded-md text-white bg-indigo-600 hover:bg-indigo-500">Save</button>
                </div>
            </div>
        </div>
    );
};

export default DemoBankSocialView;