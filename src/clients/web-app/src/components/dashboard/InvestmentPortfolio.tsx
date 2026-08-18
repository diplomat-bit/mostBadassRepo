// REPOSITORY SOURCE: diplomat-bit/Citibank_Demo_Business_Inc_Demonstration- | PATH: diplomat-bit-Citibank_Demo_Business_Inc_Demonstration--ab2501d/src/clients/web-app/src/components/dashboard/InvestmentPortfolio.tsx
================================================================================

import React, { useState, useEffect, useMemo } from 'react';
import {
    Box,
    Card,
    CardContent,
    Typography,
    Grid,
    CircularProgress,
    Alert,
    Tabs,
    Tab,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Chip,
    Avatar,
    ToggleButtonGroup,
    ToggleButton,
    useTheme,
    Skeleton,
} from '@mui/material';
import {
    TrendingUp,
    TrendingDown,
    ShowChart,
    PieChart,
    ListAlt,
    AutoAwesome,
    WarningAmber,
    InfoOutlined,
    CheckCircleOutline,
} from '@mui/icons-material';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart as RechartsPieChart,
    Pie,
    Cell,
    Legend,
} from 'recharts';

// --- MOCK DATA & TYPES ---
// In a real application, these would be fetched from a secure API endpoint.

interface Holding {
    id: string;
    symbol: string;
    name: string;
    quantity: number;
    avgCost: number;
    currentPrice: number;
    dayChange: number;
    dayChangePercent: number;
    totalValue: number;
    logoUrl?: string;
    assetClass: 'Stock' | 'Crypto' | 'ETF' | 'Mutual Fund';
}

interface HistoricalDataPoint {
    date: string;
    value: number;
}

interface PortfolioData {
    totalValue: number;
    dayChange: number;
    dayChangePercent: number;
    totalReturn: number;
    totalReturnPercent: number;
    holdings: Holding[];
    historicalData: {
        '1D': HistoricalDataPoint[];
        '1W': HistoricalDataPoint[];
        '1M': HistoricalDataPoint[];
        '1Y': HistoricalDataPoint[];
        'ALL': HistoricalDataPoint[];
    };
}

interface AIInsight {
    id: string;
    title: string;
    summary: string;
    severity: 'info' | 'warning' | 'positive';
    recommendation: string;
}

// Mock API fetch function
const fetchPortfolioData = async (userId: string): Promise<PortfolioData> => {
    console.log(`Fetching portfolio data for user: ${userId}`);
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Mock data generation
    const generateHistoricalData = (days: number, initialValue: number) => {
        let data = [];
        let value = initialValue;
        for (let i = days; i > 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            value *= 1 + (Math.random() - 0.48) / 50; // Simulate daily fluctuations
            data.push({ date: date.toISOString().split('T')[0], value: parseFloat(value.toFixed(2)) });
        }
        return data;
    };

    return {
        totalValue: 125680.45,
        dayChange: 1230.78,
        dayChangePercent: 0.98,
        totalReturn: 25680.45,
        totalReturnPercent: 25.68,
        holdings: [
            { id: '1', symbol: 'AAPL', name: 'Apple Inc.', quantity: 50, avgCost: 150.25, currentPrice: 172.50, dayChange: 2.10, dayChangePercent: 1.23, totalValue: 8625, logoUrl: '/assets/logos/aapl.png', assetClass: 'Stock' },
            { id: '2', symbol: 'TSLA', name: 'Tesla, Inc.', quantity: 20, avgCost: 200.00, currentPrice: 180.50, dayChange: -5.50, dayChangePercent: -2.96, totalValue: 3610, logoUrl: '/assets/logos/tsla.png', assetClass: 'Stock' },
            { id: '3', symbol: 'BTC', name: 'Bitcoin', quantity: 0.5, avgCost: 45000, currentPrice: 68000.00, dayChange: 1500.00, dayChangePercent: 2.25, totalValue: 34000, logoUrl: '/assets/logos/btc.png', assetClass: 'Crypto' },
            { id: '4', symbol: 'ETH', name: 'Ethereum', quantity: 10, avgCost: 2500, currentPrice: 3550.00, dayChange: 250.00, dayChangePercent: 7.57, totalValue: 35500, logoUrl: '/assets/logos/eth.png', assetClass: 'Crypto' },
            { id: '5', symbol: 'VTI', name: 'Vanguard Total Stock Market ETF', quantity: 150, avgCost: 200.50, currentPrice: 246.27, dayChange: 1.15, dayChangePercent: 0.47, totalValue: 36940.50, logoUrl: '/assets/logos/vti.png', assetClass: 'ETF' },
            { id: '6', symbol: 'VXUS', name: 'Vanguard Total International Stock ETF', quantity: 100, avgCost: 55.00, currentPrice: 60.05, dayChange: -0.20, dayChangePercent: -0.33, totalValue: 6004.95, logoUrl: '/assets/logos/vxus.png', assetClass: 'ETF' },
        ],
        historicalData: {
            '1D': generateHistoricalData(1, 124449.67),
            '1W': generateHistoricalData(7, 123000),
            '1M': generateHistoricalData(30, 120000),
            '1Y': generateHistoricalData(365, 105000),
            'ALL': generateHistoricalData(1095, 80000),
        },
    };
};

const fetchAIInsights = async (portfolio: PortfolioData): Promise<AIInsight[]> => {
    console.log('Generating AI insights for portfolio:', portfolio.totalValue);
    await new Promise(resolve => setTimeout(resolve, 2000));
    return [
        { id: '1', title: 'High Concentration in Tech Sector', severity: 'warning', summary: 'Over 45% of your stock portfolio is concentrated in the technology sector (AAPL, TSLA). This exposes you to sector-specific risks.', recommendation: 'Consider diversifying into other sectors like Healthcare or Consumer Staples to reduce concentration risk. Look at ETFs like VHT or VDC.' },
        { id: '2', title: 'Strong Crypto Performance', severity: 'positive', summary: 'Your cryptocurrency holdings (BTC, ETH) have significantly outperformed the rest of your portfolio over the last quarter.', recommendation: 'Performance is strong, but volatility is high. Consider rebalancing by taking some profits to maintain your target asset allocation.' },
        { id: '3', title: 'Tax-Loss Harvesting Opportunity', severity: 'info', summary: 'Your position in TSLA is currently at an unrealized loss. You may be able to sell this position to offset capital gains from other investments.', recommendation: 'Consult with a financial advisor to see if tax-loss harvesting is appropriate for your situation before year-end.' },
    ];
};

// --- HELPER COMPONENTS ---

const StatCard = ({ title, value, change, changePercent, isLoading }: { title: string; value: string; change?: string; changePercent?: string; isLoading: boolean; }) => {
    const isPositive = change ? !change.startsWith('-') : true;
    const theme = useTheme();

    if (isLoading) {
        return (
            <Card sx={{ height: '100%' }}>
                <CardContent>
                    <Skeleton variant="text" width="60%" />
                    <Skeleton variant="text" width="80%" sx={{ fontSize: '2rem', my: 1 }} />
                    <Skeleton variant="text" width="40%" />
                </CardContent>
            </Card>
        );
    }

    return (
        <Card sx={{ height: '100%' }}>
            <CardContent>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                    {title}
                </Typography>
                <Typography variant="h4" component="div" fontWeight="bold">
                    {value}
                </Typography>
                {change && changePercent && (
                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 1, color: isPositive ? theme.palette.success.main : theme.palette.error.main }}>
                        {isPositive ? <TrendingUp sx={{ mr: 0.5 }} /> : <TrendingDown sx={{ mr: 0.5 }} />}
                        <Typography variant="body2" component="span" fontWeight="medium">
                            {change} ({changePercent})
                        </Typography>
                        <Typography variant="caption" color="text.secondary" sx={{ ml: 0.5 }}>
                            Today
                        </Typography>
                    </Box>
                )}
            </CardContent>
        </Card>
    );
};

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <Paper elevation={3} sx={{ padding: '10px', backgroundColor: 'rgba(255, 255, 255, 0.9)' }}>
                <Typography variant="caption">{new Date(label).toLocaleDateString()}</Typography>
                <Typography variant="body2" fontWeight="bold">
                    {`Value: ${payload[0].value.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}`}
                </Typography>
            </Paper>
        );
    }
    return null;
};

const AIInsightCard = ({ insight }: { insight: AIInsight }) => {
    const theme = useTheme();
    const severityMap = {
        info: { icon: <InfoOutlined />, color: theme.palette.info.main },
        warning: { icon: <WarningAmber />, color: theme.palette.warning.main },
        positive: { icon: <CheckCircleOutline />, color: theme.palette.success.main },
    };

    return (
        <Card sx={{ mb: 2, borderLeft: `4px solid ${severityMap[insight.severity].color}` }}>
            <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Avatar sx={{ bgcolor: severityMap[insight.severity].color, mr: 2 }}>
                        {severityMap[insight.severity].icon}
                    </Avatar>
                    <Typography variant="h6" component="div">{insight.title}</Typography>
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
                    {insight.summary}
                </Typography>
                <Alert severity={insight.severity} icon={false} sx={{ backgroundColor: theme.palette.action.hover }}>
                    <strong>Recommendation:</strong> {insight.recommendation}
                </Alert>
            </CardContent>
        </Card>
    );
};


// --- MAIN COMPONENT ---

export interface InvestmentPortfolioProps {
    userId: string;
}

export const InvestmentPortfolio: React.FC<InvestmentPortfolioProps> = ({ userId }) => {
    const theme = useTheme();
    const [portfolioData, setPortfolioData] = useState<PortfolioData | null>(null);
    const [aiInsights, setAiInsights] = useState<AIInsight[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState(0);
    const [timeRange, setTimeRange] = useState<'1D' | '1W' | '1M' | '1Y' | 'ALL'>('1M');

    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);
                setError(null);
                const data = await fetchPortfolioData(userId);
                setPortfolioData(data);
                const insights = await fetchAIInsights(data);
                setAiInsights(insights);
            } catch (err) {
                setError('Failed to load portfolio data. Please try again later.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, [userId]);

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setActiveTab(newValue);
    };

    const handleTimeRangeChange = (event: React.MouseEvent<HTMLElement>, newTimeRange: '1D' | '1W' | '1M' | '1Y' | 'ALL' | null) => {
        if (newTimeRange !== null) {
            setTimeRange(newTimeRange);
        }
    };

    const allocationData = useMemo(() => {
        if (!portfolioData) return [];
        const allocationMap = new Map<string, number>();
        portfolioData.holdings.forEach(holding => {
            const currentVal = allocationMap.get(holding.assetClass) || 0;
            allocationMap.set(holding.assetClass, currentVal + holding.totalValue);
        });
        return Array.from(allocationMap.entries()).map(([name, value]) => ({ name, value }));
    }, [portfolioData]);

    const COLORS = [theme.palette.primary.main, theme.palette.secondary.main, theme.palette.success.light, theme.palette.warning.light];

    if (error) {
        return <Alert severity="error">{error}</Alert>;
    }

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom fontWeight="bold">
                Investment Portfolio
            </Typography>

            <Grid container spacing={3} sx={{ mb: 3 }}>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard
                        title="Total Value"
                        value={portfolioData?.totalValue.toLocaleString('en-US', { style: 'currency', currency: 'USD' }) ?? ''}
                        change={portfolioData?.dayChange.toLocaleString('en-US', { style: 'currency', currency: 'USD', signDisplay: 'always' })}
                        changePercent={`${portfolioData?.dayChangePercent.toFixed(2)}%`}
                        isLoading={loading}
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard
                        title="Total Return"
                        value={portfolioData?.totalReturn.toLocaleString('en-US', { style: 'currency', currency: 'USD' }) ?? ''}
                        changePercent={`${portfolioData?.totalReturnPercent.toFixed(2)}%`}
                        isLoading={loading}
                    />
                </Grid>
            </Grid>

            <Grid container spacing={3}>
                <Grid item xs={12} lg={8}>
                    <Card>
                        <CardContent>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                <Typography variant="h6">Performance</Typography>
                                <ToggleButtonGroup
                                    value={timeRange}
                                    exclusive
                                    onChange={handleTimeRangeChange}
                                    size="small"
                                >
                                    <ToggleButton value="1D">1D</ToggleButton>
                                    <ToggleButton value="1W">1W</ToggleButton>
                                    <ToggleButton value="1M">1M</ToggleButton>
                                    <ToggleButton value="1Y">1Y</ToggleButton>
                                    <ToggleButton value="ALL">All</ToggleButton>
                                </ToggleButtonGroup>
                            </Box>
                            <Box sx={{ height: 300 }}>
                                {loading ? (
                                    <Skeleton variant="rectangular" width="100%" height="100%" />
                                ) : (
                                    <ResponsiveContainer width="100%" height="100%">
                                        <LineChart data={portfolioData?.historicalData[timeRange]}>
                                            <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
                                            <XAxis dataKey="date" tickFormatter={(tick) => new Date(tick).toLocaleDate-String('en-US', { month: 'short', day: 'numeric' })} stroke={theme.palette.text.secondary} />
                                            <YAxis tickFormatter={(tick) => `$${(tick / 1000)}k`} stroke={theme.palette.text.secondary} />
                                            <Tooltip content={<CustomTooltip />} />
                                            <Line type="monotone" dataKey="value" stroke={theme.palette.primary.main} strokeWidth={2} dot={false} />
                                        </LineChart>
                                    </ResponsiveContainer>
                                )}
                            </Box>
                        </CardContent>
                    </Card>

                    <Card sx={{ mt: 3 }}>
                        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                            <Tabs value={activeTab} onChange={handleTabChange} aria-label="holdings and allocation tabs">
                                <Tab icon={<ListAlt />} iconPosition="start" label="Holdings" />
                                <Tab icon={<PieChart />} iconPosition="start" label="Allocation" />
                            </Tabs>
                        </Box>
                        <Box sx={{ p: activeTab === 1 ? 3 : 0 }}>
                            {activeTab === 0 && (
                                <TableContainer>
                                    <Table>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>Asset</TableCell>
                                                <TableCell align="right">Value</TableCell>
                                                <TableCell align="right">Day's Change</TableCell>
                                                <TableCell align="right">Quantity</TableCell>
                                                <TableCell align="right">Avg. Cost</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {loading ? (
                                                Array.from(new Array(5)).map((_, index) => (
                                                    <TableRow key={index}>
                                                        <TableCell><Skeleton /></TableCell>
                                                        <TableCell><Skeleton /></TableCell>
                                                        <TableCell><Skeleton /></TableCell>
                                                        <TableCell><Skeleton /></TableCell>
                                                        <TableCell><Skeleton /></TableCell>
                                                    </TableRow>
                                                ))
                                            ) : (
                                                portfolioData?.holdings.map((holding) => (
                                                    <TableRow key={holding.id}>
                                                        <TableCell>
                                                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                                <Avatar src={holding.logoUrl} sx={{ width: 32, height: 32, mr: 2, bgcolor: 'primary.light' }}>{holding.symbol.charAt(0)}</Avatar>
                                                                <Box>
                                                                    <Typography variant="body2" fontWeight="bold">{holding.symbol}</Typography>
                                                                    <Typography variant="caption" color="text.secondary">{holding.name}</Typography>
                                                                </Box>
                                                            </Box>
                                                        </TableCell>
                                                        <TableCell align="right">
                                                            <Typography variant="body2" fontWeight="medium">{holding.totalValue.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</Typography>
                                                        </TableCell>
                                                        <TableCell align="right">
                                                            <Chip
                                                                label={`${holding.dayChange.toLocaleString('en-US', { style: 'currency', currency: 'USD', signDisplay: 'always' })} (${holding.dayChangePercent.toFixed(2)}%)`}
                                                                color={holding.dayChange >= 0 ? 'success' : 'error'}
                                                                size="small"
                                                                variant="outlined"
                                                            />
                                                        </TableCell>
                                                        <TableCell align="right">{holding.quantity.toLocaleString()}</TableCell>
                                                        <TableCell align="right">{holding.avgCost.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</TableCell>
                                                    </TableRow>
                                                ))
                                            )}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            )}
                            {activeTab === 1 && (
                                <Box sx={{ height: 300 }}>
                                    {loading ? (
                                        <Skeleton variant="circular" width={250} height={250} sx={{ mx: 'auto' }} />
                                    ) : (
                                        <ResponsiveContainer width="100%" height="100%">
                                            <RechartsPieChart>
                                                <Pie
                                                    data={allocationData}
                                                    cx="50%"
                                                    cy="50%"
                                                    labelLine={false}
                                                    outerRadius={120}
                                                    fill="#8884d8"
                                                    dataKey="value"
                                                    nameKey="name"
                                                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                                >
                                                    {allocationData.map((entry, index) => (
                                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                    ))}
                                                </Pie>
                                                <Tooltip formatter={(value: number) => value.toLocaleString('en-US', { style: 'currency', currency: 'USD' })} />
                                                <Legend />
                                            </RechartsPieChart>
                                        </ResponsiveContainer>
                                    )}
                                </Box>
                            )}
                        </Box>
                    </Card>
                </Grid>

                <Grid item xs={12} lg={4}>
                    <Card>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                <AutoAwesome color="primary" sx={{ mr: 1 }} />
                                <Typography variant="h6">AI-Powered Insights</Typography>
                            </Box>
                            {loading ? (
                                <>
                                    <Skeleton variant="rectangular" height={100} sx={{ mb: 2 }} />
                                    <Skeleton variant="rectangular" height={100} sx={{ mb: 2 }} />
                                </>
                            ) : (
                                aiInsights.map(insight => <AIInsightCard key={insight.id} insight={insight} />)
                            )}
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
};