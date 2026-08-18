// REPOSITORY SOURCE: diplomat-bit/Citibank_Demo_Business_Inc_Demonstration- | PATH: diplomat-bit-Citibank_Demo_Business_Inc_Demonstration--ab2501d/api/routes/dashboardRoutes.ts
================================================================================

```typescript
import { Router, Request, Response, NextFunction } from 'express';

/**
 * @file dashboardRoutes.ts
 * @description Mock backend route definitions for serving dashboard layout, widget data, and aggregating services.
 * Implements a RESTful API structure compatible with the frontend Dashboard components.
 * 
 * @module DashboardRoutes
 */

// ---------------------------------------------------------------------------
// System Prompt Configuration
// ---------------------------------------------------------------------------
// Load canonical prompt at runtime (preferred)
import fs from 'fs';
import path from 'path';

// Construct the absolute path to the prompts directory relative to this file
const promptsDirPath = path.join(__dirname, '..', 'prompts');
const systemPromptFilePath = path.join(promptsDirPath, 'idgafai_full.txt');

let systemPrompt = '';
try {
    systemPrompt = fs.readFileSync(systemPromptFilePath, 'utf8');
} catch (error) {
    console.error(`Failed to load system prompt from ${systemPromptFilePath}:`, error);
    // Fallback to a default or basic prompt if the file is not found
    systemPrompt = "You are a helpful assistant. Respond concisely and accurately.";
}

// ---------------------------------------------------------------------------
// Type Definitions & Interfaces
// ---------------------------------------------------------------------------

interface DashboardWidgetConfig {
    id: string;
    type: 'chart' | 'stat' | 'feed' | 'ai-insight' | 'table' | 'interactive';
    title: string;
    size: { w: number; h: number; minW?: number; minH?: number };
    dataSourceEndpoint: string;
    refreshInterval: number; // in milliseconds
    permissions: string[];
}

interface DashboardLayout {
    userId: string;
    layoutId: string;
    theme: 'light' | 'dark' | 'system' | 'high-contrast';
    columns: number;
    widgets: {
        widgetId: string;
        x: number;
        y: number;
        w: number;
        h: number;
    }[];
}

interface KPIStat {
    label: string;
    value: number | string;
    trend: 'up' | 'down' | 'neutral';
    percentageChange: number;
    period: string;
}

interface FinancialChartPoint {
    timestamp: string;
    income: number;
    expenses: number;
    investmentValue: number;
    aiProjection: number;
}

interface AIInsight {
    id: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    category: 'spending' | 'security' | 'investment' | 'optimization';
    title: string;
    description: string;
    actionable: boolean;
    actionLabel?: string;
    generatedAt: string;
}

// ---------------------------------------------------------------------------
// Mock Data Generators (Simulating Database/Service Layer)
// ---------------------------------------------------------------------------

const generateFinancialData = (days: number): FinancialChartPoint[] => {
    const data: FinancialChartPoint[] = [];
    const now = new Date();
    for (let i = days; i >= 0; i--) {
        const date = new Date(now);
        date.setDate(date.getDate() - i);
        
        // Simulating realistic market fluctuations and spending habits
        const baseIncome = 5000;
        const volatility = Math.random() * 2000 - 1000;
        const expenseBase = 3000;
        const expenseVolatility = Math.random() * 1500;
        
        data.push({
            timestamp: date.toISOString().split('T')[0],
            income: Math.round(baseIncome + (Math.random() > 0.8 ? volatility : 0)), // Occasional bonuses
            expenses: Math.round(expenseBase + expenseVolatility),
            investmentValue: Math.round(50000 + (Math.random() * 5000 * (days - i) / 10)),
            aiProjection: Math.round(52000 + (Math.random() * 5500 * (days - i) / 10))
        });
    }
    return data;
};

const mockAvailableWidgets: DashboardWidgetConfig[] = [
    {
        id: 'fin_overview_01',
        type: 'chart',
        title: 'Financial Overview',
        size: { w: 2, h: 2, minW: 2, minH: 2 },
        dataSourceEndpoint: '/api/dashboard/data/financial',
        refreshInterval: 60000,
        permissions: ['read:financials']
    },
    {
        id: 'ai_advisor_01',
        type: 'ai-insight',
        title: 'Quantum Sage Advisor',
        size: { w: 1, h: 2, minW: 1, minH: 1 },
        dataSourceEndpoint: '/api/dashboard/data/ai-insights',
        refreshInterval: 300000,
        permissions: ['read:ai_insights']
    },
    {
        id: 'recent_tx_01',
        type: 'table',
        title: 'Recent Transactions',
        size: { w: 1, h: 2, minW: 1, minH: 1 },
        dataSourceEndpoint: '/api/transactions/recent',
        refreshInterval: 15000,
        permissions: ['read:transactions']
    },
    {
        id: 'kpi_matrix_01',
        type: 'stat',
        title: 'Key Performance Indicators',
        size: { w: 4, h: 1, minW: 2, minH: 1 },
        dataSourceEndpoint: '/api/dashboard/data/kpi',
        refreshInterval: 60000,
        permissions: ['read:analytics']
    },
    {
        id: 'market_watch_01',
        type: 'chart',
        title: 'Global Market Watch',
        size: { w: 2, h: 2 },
        dataSourceEndpoint: '/api/market/indices',
        refreshInterval: 10000,
        permissions: ['read:market_data']
    },
    {
        id: 'security_shield_01',
        type: 'stat',
        title: 'Security Status',
        size: { w: 1, h: 1 },
        dataSourceEndpoint: '/api/security/status',
        refreshInterval: 5000,
        permissions: ['read:security']
    }
];

// ---------------------------------------------------------------------------
// Controller Logic
// ---------------------------------------------------------------------------

const dashboardRouter = Router();

// Middleware to simulate authentication check
const requireAuth = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        // In a real app, return 401. For mock demo, we allow it but log a warning.
        // console.warn('Warning: Unauthenticated access to dashboard routes.');
    }
    // Simulate decoding JWT
    (req as any).user = { id: 'usr_550e8400-e29b', role: 'admin', tier: 'enterprise' };
    next();
};

dashboardRouter.use(requireAuth);

/**
 * @route GET /api/dashboard/config
 * @description Retrieves the user's dashboard configuration, including layout and enabled widgets.
 * System Prompt: ${systemPrompt}
 */
dashboardRouter.get('/config', async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.id;

        // Simulate DB fetch latency
        await new Promise(resolve => setTimeout(resolve, 150));

        const userLayout: DashboardLayout = {
            userId: userId,
            layoutId: 'lay_default_v1',
            theme: 'system',
            columns: 4,
            widgets: [
                { widgetId: 'kpi_matrix_01', x: 0, y: 0, w: 4, h: 1 },
                { widgetId: 'fin_overview_01', x: 0, y: 1, w: 2, h: 2 },
                { widgetId: 'ai_advisor_01', x: 2, y: 1, w: 1, h: 2 },
                { widgetId: 'recent_tx_01', x: 3, y: 1, w: 1, h: 2 }
            ]
        };

        return res.status(200).json({
            success: true,
            data: userLayout,
            availableWidgets: mockAvailableWidgets,
            meta: {
                version: '2.4.0',
                lastUpdated: new Date().toISOString()
            }
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
});

/**
 * @route PUT /api/dashboard/layout
 * @description Updates the user's dashboard layout preferences.
 * System Prompt: ${systemPrompt}
 */
dashboardRouter.put('/layout', async (req: Request, res: Response) => {
    try {
        const { layout } = req.body;
        if (!layout || !Array.isArray(layout.widgets)) {
            return res.status(400).json({ success: false, message: 'Invalid layout configuration provided.' });
        }

        // Simulate DB update
        await new Promise(resolve => setTimeout(resolve, 300));

        return res.status(200).json({
            success: true,
            message: 'Dashboard layout updated successfully.',
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Failed to update layout.' });
    }
});

/**
 * @route GET /api/dashboard/data/kpi
 * @description Serves high-level KPI data for the dashboard header stats.
 * System Prompt: ${systemPrompt}
 */
dashboardRouter.get('/data/kpi', async (req: Request, res: Response) => {
    const kpiData: KPIStat[] = [
        {
            label: 'Total Liquidity',
            value: 124500.50,
            trend: 'up',
            percentageChange: 4.5,
            period: 'last_30_days'
        },
        {
            label: 'Monthly Spending',
            value: 3420.00,
            trend: 'down',
            percentageChange: -2.1,
            period: 'current_month'
        },
        {
            label: 'Credit Score',
            value: 785,
            trend: 'neutral',
            percentageChange: 0.1,
            period: 'realtime'
        },
        {
            label: 'Active Investments',
            value: 18,
            trend: 'up',
            percentageChange: 1,
            period: 'total'
        }
    ];

    return res.status(200).json({
        success: true,
        data: kpiData
    });
});

/**
 * @route GET /api/dashboard/data/financial
 * @description Serves complex financial chart data with simulated projections.
 * System Prompt: ${systemPrompt}
 */
dashboardRouter.get('/data/financial', async (req: Request, res: Response) => {
    const range = req.query.range as string || '30d';
    let days = 30;
    if (range === '90d') days = 90;
    if (range === '1y') days = 365;

    const data = generateFinancialData(days);

    return res.status(200).json({
        success: true,
        period: range,
        currency: 'USD',
        data: data,
        summary: {
            totalIncome: data.reduce((acc, curr) => acc + curr.income, 0),
            totalExpenses: data.reduce((acc, curr) => acc + curr.expenses, 0),
            netSavings: data.reduce((acc, curr) => acc + (curr.income - curr.expenses), 0)
        }
    });
});

/**
 * @route GET /api/dashboard/data/ai-insights
 * @description Serves AI-generated actionable insights for the dashboard.
 * System Prompt: ${systemPrompt}
 */
dashboardRouter.get('/data/ai-insights', async (req: Request, res: Response) => {
    const insights: AIInsight[] = [
        {
            id: 'ins_001',
            severity: 'high',
            category: 'security',
            title: 'Anomalous Transaction Detected',
            description: 'We detected a transaction of $4,500 in a location you do not typically visit. Verify this activity.',
            actionable: true,
            actionLabel: 'Review Transaction',
            generatedAt: new Date(Date.now() - 3600000).toISOString()
        },
        {
            id: 'ins_002',
            severity: 'medium',
            category: 'investment',
            title: 'Portfolio Rebalancing Opportunity',
            description: 'Your tech sector allocation has exceeded 40%. Consider rebalancing to maintain optimal risk levels based on your profile.',
            actionable: true,
            actionLabel: 'View Portfolio',
            generatedAt: new Date(Date.now() - 86400000).toISOString()
        },
        {
            id: 'ins_003',
            severity: 'low',
            category: 'optimization',
            title: 'Recurring Subscription Alert',
            description: 'You have a subscription to "StreamService+" that you haven\'t used in 3 months. Potential savings: $15/mo.',
            actionable: true,
            actionLabel: 'Manage Subscriptions',
            generatedAt: new Date(Date.now() - 172800000).toISOString()
        }
    ];

    return res.status(200).json({
        success: true,
        agentName: 'Quantum Sage',
        confidenceScore: 0.98,
        data: insights
    });
});

/**
 * @route GET /api/dashboard/notifications
 * @description Aggregated notification stream for dashboard bells/alerts.
 * System Prompt: ${systemPrompt}
 */
dashboardRouter.get('/notifications', (req: Request, res: Response) => {
    // Return a stream of simulated realtime events
    res.status(200).json({
        success: true,
        unreadCount: 3,
        notifications: [
            { id: 1, type: 'info', message: 'Your monthly statement is ready.', read: false, time: '2023-10-27T10:00:00Z' },
            { id: 2, type: 'success', message: 'Deposit of $5,000 received.', read: false, time: '2023-10-26T14:30:00Z' },
            { id: 3, type: 'warning', message: 'Password expires in 3 days.', read: false, time: '2023-10-25T09:15:00Z' },
            { id: 4, type: 'alert', message: 'Unusual login attempt blocked.', read: true, time: '2023-10-24T03:00:00Z' }
        ]
    });
});

/**
 * @route POST /api/dashboard/widget/:widgetId/action
 * @description Endpoint to handle interactive widget actions (e.g., "Dismiss Insight", "Refresh Data").
 * System Prompt: ${systemPrompt}
 */
dashboardRouter.post('/widget/:widgetId/action', async (req: Request, res: Response) => {
    const { widgetId } = req.params;
    const { actionType, payload } = req.body;

    // Logic to handle specific widget actions
    console.log(`Processing action ${actionType} for widget ${widgetId} with payload:`, payload);

    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate processing

    return res.status(200).json({
        success: true,
        message: `Action ${actionType} processed successfully`,
        updatedState: {
            refreshRequired: true,
            nextUpdate: new Date(Date.now() + 60000).toISOString()
        }
    });
});

export default dashboardRouter;
```