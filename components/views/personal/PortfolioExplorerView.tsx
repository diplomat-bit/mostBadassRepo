// REPOSITORY SOURCE: diplomat-bit/almost | PATH: diplomat-bit-almost-93a5466/components/views/personal/PortfolioExplorerView.tsx
================================================================================

// components/views/personal/PortfolioExplorerView.tsx
import React, { useContext, useMemo, useState } from 'react';
import Card from '../../Card';
import { DataContext } from '../../../context/DataContext';
import { PortfolioAsset } from '../../../types';
// FIX: Imported 'Cell' from recharts to be used inside the Treemap component.
import { ResponsiveContainer, Treemap, Tooltip, Cell } from 'recharts';

const ASSET_CLASSES = ['All', 'Equities', 'Fixed Income', 'Alternatives', 'Digital Assets', 'Cash & Equivalents'];
const REGIONS = ['All', 'North America', 'Europe', 'Asia', 'Emerging Markets', 'Global'];

type SortKey = 'name' | 'value' | 'change24h';
type SortDirection = 'asc' | 'desc';

// Custom Content Renderer for Treemap
const CustomTreemapContent = (props: any) => {
    const { depth, x, y, width, height, index, name, value, change24h } = props;
    const isRoot = depth === 0;

    if (isRoot || width < 50 || height < 30) return null;

    return (
        <g>
            <rect
                x={x}
                y={y}
                width={width}
                height={height}
                style={{
                    fill: 'transparent',
                    stroke: '#fff',
                    strokeWidth: 2 / (depth + 1e-10),
                    strokeOpacity: 1 / (depth + 1e-10),
                }}
            />
            <foreignObject x={x + 4} y={y + 4} width={width - 8} height={height - 8}>
                <div style={{ 
                    width: '100%', 
                    height: '100%', 
                    display: 'flex', 
                    flexDirection: 'column', 
                    justifyContent: 'space-between', 
                    color: 'white',
                    fontSize: '12px'
                }}>
                    <div className="font-semibold truncate">{name}</div>
                    <div>
                        <div className="font-mono text-sm">${value.toLocaleString(undefined, {maximumFractionDigits: 0})}</div>
                        <div className={`font-mono text-xs ${change24h >= 0 ? 'text-green-300' : 'text-red-300'}`}>
                            {change24h >= 0 ? '+' : ''}{change24h.toFixed(2)}%
                        </div>
                    </div>
                </div>
            </foreignObject>
        </g>
    );
};


const PortfolioExplorerView: React.FC = () => {
    const context = useContext(DataContext);
    if (!context) throw new Error("PortfolioExplorerView must be within a DataProvider");

    const { portfolioAssets } = context;

    const [assetClassFilter, setAssetClassFilter] = useState('All');
    const [regionFilter, setRegionFilter] = useState('All');
    const [sortConfig, setSortConfig] = useState<{ key: SortKey; direction: SortDirection }>({ key: 'value', direction: 'desc' });
    
    const filteredAssets = useMemo(() => {
        return portfolioAssets
            .filter(asset => assetClassFilter === 'All' || asset.assetClass === assetClassFilter)
            .filter(asset => regionFilter === 'All' || asset.region === regionFilter);
    }, [portfolioAssets, assetClassFilter, regionFilter]);

    const sortedAssets = useMemo(() => {
        const sortableAssets = [...filteredAssets];
        sortableAssets.sort((a, b) => {
            if (a[sortConfig.key] < b[sortConfig.key]) {
                return sortConfig.direction === 'asc' ? -1 : 1;
            }
            if (a[sortConfig.key] > b[sortConfig.key]) {
                return sortConfig.direction === 'asc' ? 1 : -1;
            }
            return 0;
        });
        return sortableAssets;
    }, [filteredAssets, sortConfig]);

    const totalValue = useMemo(() => filteredAssets.reduce((sum, asset) => sum + asset.value, 0), [filteredAssets]);
    const overallChange = useMemo(() => {
        if (totalValue === 0) return 0;
        const weightedChange = filteredAssets.reduce((sum, asset) => sum + asset.value * asset.change24h, 0);
        return weightedChange / totalValue;
    }, [filteredAssets, totalValue]);

    const handleSort = (key: SortKey) => {
        let direction: SortDirection = 'desc';
        if (sortConfig.key === key && sortConfig.direction === 'desc') {
            direction = 'asc';
        }
        setSortConfig({ key, direction });
    };

    const getColorForChange = (change: number) => {
        if (change > 1) return '#10b981';   // Strong green
        if (change > 0) return '#34d399';    // Green
        if (change < -1) return '#ef4444'; // Strong red
        if (change < 0) return '#f87171';     // Red
        return '#6b7280';                  // Gray
    };

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold text-white tracking-wider">Portfolio Explorer</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="text-center"><p className="text-3xl font-bold text-white">${totalValue.toLocaleString(undefined, {maximumFractionDigits:0})}</p><p className="text-sm text-gray-400 mt-1">Filtered Value</p></Card>
                <Card className="text-center"><p className={`text-3xl font-bold ${overallChange >= 0 ? 'text-green-400' : 'text-red-400'}`}>{overallChange >= 0 ? '+' : ''}{overallChange.toFixed(2)}%</p><p className="text-sm text-gray-400 mt-1">24h Change</p></Card>
                <Card className="text-center"><p className="text-3xl font-bold text-white">{filteredAssets.length}</p><p className="text-sm text-gray-400 mt-1">Assets Shown</p></Card>
            </div>
            
            <Card title="Filters">
                <div className="flex flex-wrap gap-4">
                    <div>
                        <label className="text-sm text-gray-400">Asset Class</label>
                        <select value={assetClassFilter} onChange={e => setAssetClassFilter(e.target.value)} className="w-full mt-1 bg-gray-700/50 border-gray-600 rounded p-2 text-white">
                            {ASSET_CLASSES.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </div>
                     <div>
                        <label className="text-sm text-gray-400">Region</label>
                        <select value={regionFilter} onChange={e => setRegionFilter(e.target.value)} className="w-full mt-1 bg-gray-700/50 border-gray-600 rounded p-2 text-white">
                            {REGIONS.map(r => <option key={r} value={r}>{r}</option>)}
                        </select>
                    </div>
                </div>
            </Card>

            <Card title="Portfolio Composition by Value">
                 <ResponsiveContainer width="100%" height={500}>
                    <Treemap
                        data={sortedAssets}
                        dataKey="value"
                        ratio={4 / 3}
                        stroke="#fff"
                        fill="#8884d8"
                        isAnimationActive={true}
                        content={<CustomTreemapContent />}
                    >
                         {sortedAssets.map((entry, index) => (
                           <Cell key={`cell-${index}`} fill={getColorForChange(entry.change24h)} />
                        ))}
                    </Treemap>
                </ResponsiveContainer>
            </Card>

            <Card title="Asset Details">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-400">
                        <thead className="text-xs text-gray-300 uppercase bg-gray-900/30">
                            <tr>
                                <th onClick={() => handleSort('name')} className="px-6 py-3 cursor-pointer">Name</th>
                                <th onClick={() => handleSort('value')} className="px-6 py-3 cursor-pointer text-right">Value (USD)</th>
                                <th onClick={() => handleSort('change24h')} className="px-6 py-3 cursor-pointer text-right">24h Change</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sortedAssets.map(asset => (
                                <tr key={asset.id} className="border-b border-gray-800 hover:bg-gray-800/50">
                                    <td className="px-6 py-4 font-medium text-white">
                                        {asset.name}
                                        <span className="block text-xs text-gray-500">{asset.ticker} - {asset.assetClass}</span>
                                    </td>
                                    <td className="px-6 py-4 font-mono text-right text-white">${asset.value.toLocaleString()}</td>
                                    <td className={`px-6 py-4 font-mono text-right ${asset.change24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                        {asset.change24h >= 0 ? '+' : ''}{asset.change24h.toFixed(2)}%
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>

        </div>
    );
};

export default PortfolioExplorerView;

================================================================================
// APPENDED FROM REPO: diplomat-bit/Citibank_Demo_Business_Inc_Demonstration- | ORIGINAL PATH: diplomat-bit-Citibank_Demo_Business_Inc_Demonstration--ab2501d/components/views/personal/PortfolioExplorerView.tsx
================================================================================

// components/views/personal/PortfolioExplorerView.tsx
import React, { useContext, useMemo, useState, useEffect, useCallback, useReducer, createContext, FC, ReactNode, useRef } from 'react';
import Card from '../../Card';
import { DataContext } from '../../../context/DataContext';
import { PortfolioAsset } from '../../../types';
// FIX: Imported 'Cell' from recharts to be used inside the Treemap component.
import { ResponsiveContainer, Treemap, Tooltip, Cell, PieChart, Pie, Legend, LineChart, Line, XAxis, YAxis, CartesianGrid, BarChart, Bar, ComposedChart, Area, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ScatterChart, Scatter, ZAxis } from 'recharts';
import { FaFileCsv, FaFilePdf, FaCog, FaChartLine, FaChartPie, FaTable, FaSearch, FaFilter, FaSync, FaExclamationTriangle, FaInfoCircle, FaCalendarAlt, FaStar, FaRegStar, FaBrain, FaFlask, FaShieldAlt, FaComments, FaTimes, FaPaperPlane, FaRobot, FaLightbulb, FaChartBar, FaArrowUp, FaArrowDown, FaBalanceScale } from 'react-icons/fa';

// --- ENHANCED TYPES AND CONSTANTS FOR REAL-WORLD APPLICATION ---

const ASSET_CLASSES = ['All', 'Equities', 'Fixed Income', 'Alternatives', 'Digital Assets', 'Cash & Equivalents', 'Real Estate', 'Commodities', 'Private Equity'];
const REGIONS = ['All', 'North America', 'Europe', 'Asia-Pacific', 'Emerging Markets', 'Global', 'Latin America', 'Africa & Middle East', 'Japan'];
const SECTORS = ['All', 'Information Technology', 'Healthcare', 'Financials', 'Consumer Discretionary', 'Consumer Staples', 'Industrials', 'Energy', 'Utilities', 'Real Estate', 'Materials', 'Communication Services'];
const MARKET_CAP_BANDS = ['All', 'Mega-Cap (> $200B)', 'Large-Cap ($10B - $200B)', 'Mid-Cap ($2B - $10B)', 'Small-Cap ($300M - $2B)', 'Micro-Cap (< $300M)'];
const CURRENCIES = ['USD', 'EUR', 'JPY', 'GBP', 'CAD', 'CHF', 'AUD', 'CNY'];
const RISK_LEVELS = ['All', 'Very Low', 'Low', 'Medium', 'High', 'Very High'];
const ESG_RATINGS = ['All', 'AAA', 'AA', 'A', 'BBB', 'BB', 'B', 'CCC'];

type SortKey = 'name' | 'value' | 'change24h' | 'assetClass' | 'region' | 'sector' | 'marketCap' | 'peRatio' | 'dividendYield' | 'ytdReturn' | 'esgScore' | 'riskLevel';
type SortDirection = 'asc' | 'desc';
type ViewMode = 'treemap' | 'table' | 'allocation' | 'performance' | 'risk' | 'advisor';
type AllocationChartType = 'assetClass' | 'region' | 'sector' | 'riskLevel';
type PerformanceTimeframe = '1D' | '1W' | '1M' | '3M' | 'YTD' | '1Y' | '5Y' | 'MAX';

export interface ESGData {
    rating: 'AAA' | 'AA' | 'A' | 'BBB' | 'BB' | 'B' | 'CCC';
    score: number; // 0-100
    environmentScore: number;
    socialScore: number;
    governanceScore: number;
    controversyLevel: 'None' | 'Low' | 'Moderate' | 'High';
}

export interface TaxLot {
    id: string;
    purchaseDate: string;
    quantity: number;
    purchasePrice: number;
    costBasis: number;
    isLongTerm: boolean;
}

export interface EnhancedPortfolioAsset extends PortfolioAsset {
    sector: string;
    marketCap: number; // in USD
    currency: string;
    peRatio?: number;
    dividendYield?: number;
    beta?: number;
    ytdReturn: number;
    riskLevel: 'Very Low' | 'Low' | 'Medium' | 'High' | 'Very High';
    analystRating?: number; // 1 to 5
    isWatchlisted: boolean;
    esg: ESGData;
    taxLots: TaxLot[];
}

export interface Transaction {
    id: string;
    assetId: string;
    type: 'buy' | 'sell';
    date: string; // ISO 8601
    quantity: number;
    price: number; // price per unit in asset's currency
    fees: number;
    notes?: string;
}

export interface HistoricalDataPoint {
    date: string; // YYYY-MM-DD
    value: number;
    benchmark?: number;
}

export interface NewsArticle {
    id: string;
    source: string;
    headline: string;
    summary: string;
    url:string;
    publishedAt: string; // ISO 8601
    sentiment: 'Positive' | 'Negative' | 'Neutral';
}

export interface PortfolioMetrics {
    beta: number;
    sharpeRatio: number;
    sortinoRatio: number;
    standardDeviation: number;
    valueAtRisk95: number;
    bestPerformer: { name: string; change: number; };
    worstPerformer: { name: string; change: number; };
}

export interface ScenarioResult {
    scenarioName: string;
    projectedReturn: number; // percentage
    projectedValueChange: number; // USD
    confidence: number; // 0 to 1
    narrative: string;
}

export interface AIInsight {
    id: string;
    type: 'Observation' | 'Suggestion' | 'Warning';
    title: string;
    explanation: string;
    priority: 'Low' | 'Medium' | 'High';
    relatedAssetIds?: string[];
}

// --- MOCK AI & FINANCIAL DATA SERVICES ---

class MockAIService {
    private static latency = (ms: number) => new Promise(res => setTimeout(res, ms));

    static async getPortfolioInsights(assets: EnhancedPortfolioAsset[]): Promise<AIInsight[]> {
        await this.latency(1500);
        const insights: AIInsight[] = [];
        const techConcentration = assets.filter(a => a.sector === 'Information Technology').reduce((sum, a) => sum + a.value, 0) / assets.reduce((sum, a) => sum + a.value, 0);

        if (techConcentration > 0.4) {
            insights.push({
                id: 'insight_1',
                type: 'Warning',
                title: 'High Concentration in Technology Sector',
                explanation: `Your portfolio has a ${ (techConcentration * 100).toFixed(0) }% allocation to the Information Technology sector. This concentration exposes you to sector-specific risks. Consider diversifying into other sectors like Healthcare or Consumer Staples to improve resilience.`,
                priority: 'High',
                relatedAssetIds: assets.filter(a => a.sector === 'Information Technology').map(a => a.id),
            });
        }
        
        const highRiskAssets = assets.filter(a => a.riskLevel === 'High' || a.riskLevel === 'Very High');
        if (highRiskAssets.length / assets.length > 0.3) {
             insights.push({
                id: 'insight_2',
                type: 'Observation',
                title: 'Aggressive Risk Profile',
                explanation: `A significant portion of your portfolio (${highRiskAssets.length} assets) is in high or very high-risk categories. This could lead to high returns but also significant volatility. Ensure this aligns with your risk tolerance and investment horizon.`,
                priority: 'Medium',
                relatedAssetIds: highRiskAssets.map(a => a.id),
            });
        }
        
        const lowYieldAssets = assets.filter(a => a.dividendYield && a.dividendYield < 1.0);
        if(lowYieldAssets.length / assets.length > 0.6) {
             insights.push({
                id: 'insight_3',
                type: 'Suggestion',
                title: 'Opportunity for Income Generation',
                explanation: 'Your portfolio is heavily weighted towards growth assets with low dividend yields. To generate more regular income, consider adding positions in companies with a history of stable dividend payments, such as those in the Utilities or Consumer Staples sectors.',
                priority: 'Low',
            });
        }

        insights.push({
            id: 'insight_4',
            type: 'Observation',
            title: 'Strong ESG Profile',
            explanation: 'Your portfolio generally consists of companies with strong ESG ratings. This indicates an alignment with sustainable investing principles, which may also reduce long-term risk.',
            priority: 'Low'
        });

        return insights;
    }

    static async generateChatResponse(message: string, context: { assets: EnhancedPortfolioAsset[] }): Promise<string> {
        await this.latency(1200);
        const lowerMessage = message.toLowerCase();
        if (lowerMessage.includes("worst performer")) {
            const worst = [...context.assets].sort((a,b) => a.change24h - b.change24h)[0];
            return `Your worst performing asset today is ${worst.name} (${worst.ticker}), which is down ${worst.change24h.toFixed(2)}%.`;
        }
        if (lowerMessage.includes("diversified")) {
            const sectors = new Set(context.assets.map(a => a.sector));
            if (sectors.size > 8) {
                return `You seem well-diversified across ${sectors.size} different sectors. Your largest sector is ${[...sectors].sort((a,b) => context.assets.filter(as => as.sector === b).length - context.assets.filter(as => as.sector === a).length)[0]}.`;
            }
            return `Your portfolio is spread across ${sectors.size} sectors. You could improve diversification by adding assets in sectors you're currently underweight in.`;
        }
        return "I can help with questions about your portfolio's performance, risk, and composition. For example, you can ask 'What is my most concentrated sector?' or 'How are my tech stocks performing?'";
    }
}

class MockFinancialDataService {
    private static latency = (ms: number) => new Promise(res => setTimeout(res, ms));

    static async fetchAssetDetails(assetId: string): Promise<{ transactions: Transaction[], news: NewsArticle[], notes: string }> {
        await this.latency(800);
        if (Math.random() < 0.05) throw new Error("Failed to fetch asset details. Network error.");
        return {
            transactions: Array.from({ length: Math.floor(Math.random() * 20) + 1 }, (_, i) => ({
                id: `txn_${assetId}_${i}`, assetId, type: Math.random() > 0.4 ? 'buy' : 'sell',
                date: new Date(Date.now() - Math.random() * 3e10).toISOString(),
                quantity: Math.random() * 100, price: Math.random() * 500 + 10, fees: Math.random() * 5,
            })).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
            news: Array.from({ length: 5 }, (_, i) => ({
                id: `news_${assetId}_${i}`, source: ['Reuters', 'Bloomberg', 'WSJ', 'Financial Times'][Math.floor(Math.random() * 4)],
                headline: `Major News Regarding Asset ${assetId}`, summary: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
                url: '#', publishedAt: new Date(Date.now() - Math.random() * 1e10).toISOString(),
                sentiment: ['Positive', 'Negative', 'Neutral'][Math.floor(Math.random() * 3)] as any,
            })),
            notes: "User notes for this asset go here. Can be used to track investment thesis, price targets, etc."
        };
    }

    static async fetchHistoricalData(assetId: string, timeframe: PerformanceTimeframe): Promise<HistoricalDataPoint[]> {
        await this.latency(1200);
        const days = { '1D': 1, '1W': 7, '1M': 30, '3M': 90, 'YTD': (new Date().getMonth() + 1) * 30, '1Y': 365, '5Y': 1825, 'MAX': 3650 }[timeframe];
        const data: HistoricalDataPoint[] = [];
        let value = Math.random() * 1000 + 100;
        let benchmark = value * (Math.random() * 0.4 + 0.8);
        for (let i = days; i > 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            value += (Math.random() - 0.49) * (value * 0.05);
            benchmark += (Math.random() - 0.495) * (benchmark * 0.04);
            value = Math.max(value, 1);
            benchmark = Math.max(benchmark, 1);
            data.push({ date: date.toISOString().split('T')[0], value, benchmark });
        }
        return data;
    }
    
    static async runPortfolioAnalysis(assets: EnhancedPortfolioAsset[]): Promise<{ metrics: PortfolioMetrics, correlationMatrix: number[][] }> {
        await this.latency(2000);
        if (!assets.length) return { metrics: { beta: 0, sharpeRatio: 0, sortinoRatio: 0, standardDeviation: 0, valueAtRisk95: 0, bestPerformer: { name: 'N/A', change: 0 }, worstPerformer: { name: 'N/A', change: 0 } }, correlationMatrix: [] };
        const sortedByChange = [...assets].sort((a,b) => b.change24h - a.change24h);
        const totalValue = assets.reduce((sum, a) => sum + a.value, 0);
        const metrics: PortfolioMetrics = {
            beta: Math.random() * 0.5 + 0.8, sharpeRatio: Math.random() * 1.5 + 0.5, sortinoRatio: Math.random() * 2.0 + 0.5,
            standardDeviation: Math.random() * 10 + 5, valueAtRisk95: totalValue * (Math.random() * 0.03 + 0.01),
            bestPerformer: { name: sortedByChange[0].name, change: sortedByChange[0].change24h },
            worstPerformer: { name: sortedByChange[sortedByChange.length - 1].name, change: sortedByChange[sortedByChange.length - 1].change24h },
        };
        const correlationMatrix = assets.map(() => assets.map(() => parseFloat((Math.random() * 2 - 1).toFixed(2))));
        assets.forEach((_, i) => correlationMatrix[i][i] = 1);
        return { metrics, correlationMatrix };
    }
    
    static async runStressTest(assets: EnhancedPortfolioAsset[], scenario: string): Promise<ScenarioResult> {
        await this.latency(2500);
        const totalValue = assets.reduce((sum, asset) => sum + asset.value, 0);
        let projectedReturn, narrative;
        switch (scenario) {
            case 'Market Crash (-20%)': 
                projectedReturn = -20 + (Math.random() * 5 - 2.5); 
                narrative = "A broad market downturn significantly impacts equities. Your portfolio's tech and consumer discretionary holdings are most affected. Defensive assets provide some cushion.";
                break;
            case 'Interest Rate Hike': 
                projectedReturn = -5 + (Math.random() * 4 - 2); 
                narrative = "Rising interest rates hurt growth stocks and long-duration bonds. Financial sector assets may see some benefit, but overall portfolio value is projected to decrease moderately.";
                break;
            case 'Inflation Shock': 
                projectedReturn = -12 + (Math.random() * 4 - 2); 
                narrative = "Unexpectedly high inflation erodes real returns and pressures corporate margins. Commodities and Real Estate may outperform, but the broader market suffers.";
                break;
            default: 
                projectedReturn = 0;
                narrative = "No significant impact observed in this scenario."
        }
        return { scenarioName: scenario, projectedReturn, projectedValueChange: totalValue * (projectedReturn / 100), confidence: Math.random() * 0.2 + 0.75, narrative };
    }
}

// --- STATE MANAGEMENT (useReducer) ---

type ExplorerState = {
    assetClassFilter: string; regionFilter: string; sectorFilter: string; marketCapFilter: string; riskLevelFilter: string; searchQuery: string; esgFilter: string;
    sortConfig: { key: SortKey; direction: SortDirection };
    viewMode: ViewMode; isFiltersVisible: boolean; isSettingsVisible: boolean;
    error: string | null;
    analysisData: { metrics: PortfolioMetrics | null; correlationMatrix: number[][] | null; }; isAnalysisRunning: boolean;
    stressTestResults: ScenarioResult[] | null; isStressTestRunning: boolean;
    aiInsights: AIInsight[] | null; isAIInsightLoading: boolean;
    selectedAsset: EnhancedPortfolioAsset | null; isModalOpen: boolean;
    modalData: { transactions: Transaction[]; news: NewsArticle[]; notes: string; historicalData: HistoricalDataPoint[]; } | null;
    isModalLoading: boolean; modalError: string | null;
    watchlist: Set<string>;
    isChatOpen: boolean; chatHistory: { sender: 'user' | 'ai', text: string }[]; isChatLoading: boolean;
};

type ExplorerAction =
    | { type: 'SET_FILTER'; payload: { filter: keyof ExplorerState; value: string } }
    | { type: 'SET_SORT'; payload: SortKey }
    | { type: 'SET_VIEW_MODE'; payload: ViewMode }
    | { type: 'TOGGLE_VISIBILITY'; payload: 'filters' | 'settings' | 'chat' }
    | { type: 'OPEN_ASSET_MODAL'; payload: EnhancedPortfolioAsset }
    | { type: 'CLOSE_ASSET_MODAL' }
    | { type: 'FETCH_MODAL_DATA_START' }
    | { type: 'FETCH_MODAL_DATA_SUCCESS'; payload: Exclude<ExplorerState['modalData'], null> }
    | { type: 'FETCH_MODAL_DATA_FAILURE'; payload: string }
    | { type: 'UPDATE_ASSET_NOTES'; payload: string }
    | { type: 'RUN_ANALYSIS_START' }
    | { type: 'RUN_ANALYSIS_SUCCESS'; payload: { metrics: PortfolioMetrics, correlationMatrix: number[][] } }
    | { type: 'RUN_ANALYSIS_FAILURE'; payload: string }
    | { type: 'RUN_STRESS_TEST_START' }
    | { type: 'RUN_STRESS_TEST_SUCCESS'; payload: ScenarioResult[] }
    | { type: 'RUN_STRESS_TEST_FAILURE'; payload: string }
    | { type: 'FETCH_AI_INSIGHTS_START' }
    | { type: 'FETCH_AI_INSIGHTS_SUCCESS'; payload: AIInsight[] }
    | { type: 'FETCH_AI_INSIGHTS_FAILURE'; payload: string }
    | { type: 'TOGGLE_WATCHLIST'; payload: string }
    | { type: 'SEND_CHAT_MESSAGE'; payload: string }
    | { type: 'RECEIVE_CHAT_RESPONSE'; payload: string };

const initialState: ExplorerState = {
    assetClassFilter: 'All', regionFilter: 'All', sectorFilter: 'All', marketCapFilter: 'All', riskLevelFilter: 'All', searchQuery: '', esgFilter: 'All',
    sortConfig: { key: 'value', direction: 'desc' },
    viewMode: 'treemap', isFiltersVisible: true, isSettingsVisible: false,
    error: null,
    analysisData: { metrics: null, correlationMatrix: null }, isAnalysisRunning: false,
    stressTestResults: null, isStressTestRunning: false,
    aiInsights: null, isAIInsightLoading: true,
    selectedAsset: null, isModalOpen: false, modalData: null, isModalLoading: false, modalError: null,
    watchlist: new Set(),
    isChatOpen: false, chatHistory: [{ sender: 'ai', text: 'Hello! How can I help you analyze your portfolio today?' }], isChatLoading: false,
};

function explorerReducer(state: ExplorerState, action: ExplorerAction): ExplorerState {
    switch (action.type) {
        case 'SET_FILTER': return { ...state, [action.payload.filter as keyof ExplorerState]: action.payload.value };
        case 'SET_SORT':
            const newDirection = state.sortConfig.key === action.payload && state.sortConfig.direction === 'desc' ? 'asc' : 'desc';
            return { ...state, sortConfig: { key: action.payload, direction: newDirection } };
        case 'SET_VIEW_MODE': return { ...state, viewMode: action.payload };
        case 'TOGGLE_VISIBILITY':
            if (action.payload === 'filters') return { ...state, isFiltersVisible: !state.isFiltersVisible };
            if (action.payload === 'settings') return { ...state, isSettingsVisible: !state.isSettingsVisible };
            if (action.payload === 'chat') return { ...state, isChatOpen: !state.isChatOpen };
            return state;
        case 'OPEN_ASSET_MODAL': return { ...state, isModalOpen: true, selectedAsset: action.payload, modalError: null };
        case 'CLOSE_ASSET_MODAL': return { ...state, isModalOpen: false, selectedAsset: null, modalData: null };
        case 'FETCH_MODAL_DATA_START': return { ...state, isModalLoading: true };
        case 'FETCH_MODAL_DATA_SUCCESS': return { ...state, isModalLoading: false, modalData: action.payload };
        case 'FETCH_MODAL_DATA_FAILURE': return { ...state, isModalLoading: false, modalError: action.payload };
        case 'UPDATE_ASSET_NOTES':
             if (!state.modalData) return state;
             return { ...state, modalData: { ...state.modalData, notes: action.payload } };
        case 'RUN_ANALYSIS_START': return { ...state, isAnalysisRunning: true };
        case 'RUN_ANALYSIS_SUCCESS': return { ...state, isAnalysisRunning: false, analysisData: action.payload };
        case 'RUN_ANALYSIS_FAILURE': return { ...state, isAnalysisRunning: false, error: action.payload };
        case 'RUN_STRESS_TEST_START': return { ...state, isStressTestRunning: true, stressTestResults: null };
        case 'RUN_STRESS_TEST_SUCCESS': return { ...state, isStressTestRunning: false, stressTestResults: action.payload };
        case 'RUN_STRESS_TEST_FAILURE': return { ...state, isStressTestRunning: false, error: action.payload };
        case 'FETCH_AI_INSIGHTS_START': return { ...state, isAIInsightLoading: true };
        case 'FETCH_AI_INSIGHTS_SUCCESS': return { ...state, isAIInsightLoading: false, aiInsights: action.payload };
        case 'FETCH_AI_INSIGHTS_FAILURE': return { ...state, isAIInsightLoading: false, error: action.payload };
        case 'TOGGLE_WATCHLIST':
            const newWatchlist = new Set(state.watchlist);
            if (newWatchlist.has(action.payload)) newWatchlist.delete(action.payload);
            else newWatchlist.add(action.payload);
            return { ...state, watchlist: newWatchlist };
        case 'SEND_CHAT_MESSAGE':
            return { ...state, isChatLoading: true, chatHistory: [...state.chatHistory, { sender: 'user', text: action.payload }] };
        case 'RECEIVE_CHAT_RESPONSE':
            return { ...state, isChatLoading: false, chatHistory: [...state.chatHistory, { sender: 'ai', text: action.payload }] };
        default: return state;
    }
}

// --- HELPER FUNCTIONS ---
const formatCurrency = (value: number, currency: string = 'USD') => new Intl.NumberFormat('en-US', { style: 'currency', currency, maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(value);
const formatLargeNumber = (num: number) => {
    if (Math.abs(num) >= 1e12) return `${(num / 1e12).toFixed(2)}T`;
    if (Math.abs(num) >= 1e9) return `${(num / 1e9).toFixed(2)}B`;
    if (Math.abs(num) >= 1e6) return `${(num / 1e6).toFixed(2)}M`;
    return num.toLocaleString();
};
const getColorForChange = (change: number) => {
    if (change > 2) return '#10b981'; if (change > 0) return '#34d399'; if (change === 0) return '#6b7280'; if (change < -2) return '#ef4444'; return '#f87171';
};
const getMarketCapBand = (marketCap: number): string => {
    if (marketCap > 200e9) return 'Mega-Cap (> $200B)'; if (marketCap > 10e9) return 'Large-Cap ($10B - $200B)'; if (marketCap > 2e9) return 'Mid-Cap ($2B - $10B)'; if (marketCap > 300e6) return 'Small-Cap ($300M - $2B)'; return 'Micro-Cap (< $300M)';
}

// --- REUSABLE UI COMPONENTS ---
const ToolbarButton: FC<{ icon: React.ElementType, label: string, onClick?: () => void, isActive?: boolean, disabled?: boolean, notification?: boolean }> = ({ icon: Icon, label, onClick, isActive, disabled, notification }) => (
    <button onClick={onClick} disabled={disabled} className={`relative flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${ isActive ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`} aria-label={label}>
        <Icon className="h-5 w-5" />
        <span>{label}</span>
        {notification && <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-gray-800" />}
    </button>
);
const LoadingSpinner: FC<{ size?: 'sm' | 'md' | 'lg' }> = ({ size = 'md' }) => { const sizeClasses = { sm: 'h-5 w-5', md: 'h-8 w-8', lg: 'h-12 w-12' }; return (<div className="flex justify-center items-center"><div className={`animate-spin rounded-full ${sizeClasses[size]} border-b-2 border-blue-400`}></div></div>); };
const ErrorDisplay: FC<{ message: string }> = ({ message }) => (<div className="bg-red-900/50 border border-red-700 text-red-300 px-4 py-3 rounded-lg relative" role="alert"><FaExclamationTriangle className="inline-block mr-2" /><span className="block sm:inline">{message}</span></div>);
const SkeletonLoader: FC<{ className?: string }> = ({ className = "h-4 bg-gray-700 rounded w-3/4" }) => (<div className={`animate-pulse ${className}`}></div>);

// --- CUSTOM CONTENT RENDERERS & TOOLTIPS ---
const CustomTreemapContent = (props: any) => {
    const { depth, x, y, width, height, index, name, value, change24h, sector } = props;
    if (depth === 0 || width < 60 || height < 40) return null;
    return (<g><rect x={x} y={y} width={width} height={height} style={{ fill: 'transparent', stroke: '#fff', strokeWidth: 2 / (depth + 1e-10), strokeOpacity: 0.5 / (depth + 1e-10) }} /><foreignObject x={x + 5} y={y + 5} width={width - 10} height={height - 10}><div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', color: 'white', fontSize: '12px', overflow: 'hidden' }}><div><div className="font-bold truncate text-sm">{name}</div><div className="text-xs text-gray-300 truncate">{sector}</div></div><div><div className="font-mono text-base">{formatCurrency(value)}</div><div className={`font-mono text-sm ${change24h >= 0 ? 'text-green-300' : 'text-red-300'}`}>{change24h >= 0 ? '+' : ''}{change24h.toFixed(2)}%</div></div></div></foreignObject></g>);
};
const CustomChartTooltip: FC<any> = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (<div className="bg-gray-800/90 border border-gray-600 p-3 rounded-lg shadow-lg"><p className="label text-gray-300">{`${label}`}</p>{payload.map((pld: any, index: number) => (<p key={index} style={{ color: pld.color }} className="intro font-medium">{`${pld.name}: ${formatCurrency(pld.value)}`}</p>))}</div>);
    } return null;
};

// --- ADVANCED SUB-COMPONENTS ---
const AdvancedFilters: FC<{ state: ExplorerState; dispatch: React.Dispatch<ExplorerAction> }> = ({ state, dispatch }) => {
    const handleFilterChange = (filter: keyof ExplorerState, value: string) => dispatch({ type: 'SET_FILTER', payload: { filter, value } });
    const selectClasses = "w-full mt-1 bg-gray-700/50 border-gray-600 rounded p-2 text-white focus:ring-blue-500 focus:border-blue-500";
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <div><label className="text-sm text-gray-400">Asset Class</label><select value={state.assetClassFilter} onChange={e => handleFilterChange('assetClassFilter', e.target.value)} className={selectClasses}>{ASSET_CLASSES.map(c => <option key={c} value={c}>{c}</option>)}</select></div>
            <div><label className="text-sm text-gray-400">Region</label><select value={state.regionFilter} onChange={e => handleFilterChange('regionFilter', e.target.value)} className={selectClasses}>{REGIONS.map(r => <option key={r} value={r}>{r}</option>)}</select></div>
            <div><label className="text-sm text-gray-400">Sector</label><select value={state.sectorFilter} onChange={e => handleFilterChange('sectorFilter', e.target.value)} className={selectClasses}>{SECTORS.map(s => <option key={s} value={s}>{s}</option>)}</select></div>
            <div><label className="text-sm text-gray-400">Market Cap</label><select value={state.marketCapFilter} onChange={e => handleFilterChange('marketCapFilter', e.target.value)} className={selectClasses}>{MARKET_CAP_BANDS.map(m => <option key={m} value={m}>{m}</option>)}</select></div>
            <div><label className="text-sm text-gray-400">Risk Level</label><select value={state.riskLevelFilter} onChange={e => handleFilterChange('riskLevelFilter', e.target.value)} className={selectClasses}>{RISK_LEVELS.map(r => <option key={r} value={r}>{r}</option>)}</select></div>
            <div><label className="text-sm text-gray-400">ESG Rating</label><select value={state.esgFilter} onChange={e => handleFilterChange('esgFilter', e.target.value)} className={selectClasses}>{ESG_RATINGS.map(r => <option key={r} value={r}>{r}</option>)}</select></div>
        </div>
    );
};

const AssetDetailModal: FC<{ isOpen: boolean; onClose: () => void; asset: EnhancedPortfolioAsset | null; modalData: ExplorerState['modalData']; isLoading: boolean; error: string | null; dispatch: React.Dispatch<ExplorerAction>; }> = ({ isOpen, onClose, asset, modalData, isLoading, error, dispatch }) => {
    const [activeTab, setActiveTab] = useState('overview');
    useEffect(() => { if (isOpen) document.body.style.overflow = 'hidden'; else document.body.style.overflow = 'auto'; return () => { document.body.style.overflow = 'auto'; }; }, [isOpen]);
    if (!isOpen || !asset) return null;
    const tabs = ['overview', 'chart', 'fundamentals', 'transactions', 'news', 'tax lots', 'notes'];
    return (<div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex justify-center items-center backdrop-blur-sm" onClick={onClose}><div className="bg-gray-900 border border-gray-700 rounded-lg shadow-xl w-full max-w-5xl h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}><header className="p-4 border-b border-gray-700 flex justify-between items-center"><div><h3 className="text-2xl font-bold text-white">{asset.name} ({asset.ticker})</h3><p className="text-gray-400">{asset.assetClass} - {asset.sector} - {asset.region}</p></div><button onClick={onClose} className="text-gray-400 hover:text-white text-3xl">&times;</button></header><div className="flex-grow flex overflow-hidden"><nav className="w-48 border-r border-gray-700 p-4 flex-shrink-0"><ul>{tabs.map(tab => (<li key={tab}><button onClick={() => setActiveTab(tab)} className={`w-full text-left p-2 rounded capitalize transition-colors ${activeTab === tab ? 'bg-blue-600 text-white' : 'hover:bg-gray-800 text-gray-300'}`}>{tab}</button></li>))}</ul></nav><main className="flex-grow p-6 overflow-y-auto">{isLoading ? <div className="flex justify-center items-center h-full"><LoadingSpinner size="lg" /></div> : error ? <ErrorDisplay message={error} /> : modalData && (<>{activeTab === 'overview' && (<div><h4 className="text-xl font-semibold text-white mb-4">Overview</h4><div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">{/* ... overview cards ... */}</div></div>)}{activeTab === 'chart' && (<div><h4 className="text-xl font-semibold text-white mb-4">Historical Performance</h4><ResponsiveContainer width="100%" height={300}><LineChart data={modalData.historicalData}><CartesianGrid strokeDasharray="3 3" stroke="#4a5568" /><XAxis dataKey="date" stroke="#a0aec0" /><YAxis stroke="#a0aec0" tickFormatter={(val) => formatCurrency(val, asset.currency)} /><Tooltip content={<CustomChartTooltip />} /><Line type="monotone" dataKey="value" name={asset.ticker} stroke="#3b82f6" strokeWidth={2} dot={false} /><Line type="monotone" dataKey="benchmark" name="Benchmark" stroke="#6b7280" strokeWidth={1} dot={false} strokeDasharray="5 5" /></LineChart></ResponsiveContainer></div>)}{activeTab === 'transactions' && (<div><h4 className="text-xl font-semibold text-white mb-4">Transaction History</h4><div className="overflow-auto max-h-[60vh]"><table className="w-full text-sm"><thead><tr className="text-left text-gray-400"><th className="p-2">Date</th><th className="p-2">Type</th><th className="p-2 text-right">Quantity</th><th className="p-2 text-right">Price</th><th className="p-2 text-right">Total</th></tr></thead><tbody>{modalData.transactions.map(tx => (<tr key={tx.id} className="border-t border-gray-700 hover:bg-gray-800"><td className="p-2 text-gray-300">{new Date(tx.date).toLocaleDateString()}</td><td className={`p-2 capitalize font-semibold ${tx.type === 'buy' ? 'text-green-400' : 'text-red-400'}`}>{tx.type}</td><td className="p-2 text-right font-mono text-white">{tx.quantity.toFixed(4)}</td><td className="p-2 text-right font-mono text-white">{formatCurrency(tx.price, asset.currency)}</td><td className="p-2 text-right font-mono text-white">{formatCurrency(tx.price * tx.quantity + tx.fees, asset.currency)}</td></tr>))}</tbody></table></div></div>)}{activeTab === 'news' && (<div><h4 className="text-xl font-semibold text-white mb-4">Related News</h4><ul className="space-y-4">{modalData.news.map(n => (<li key={n.id} className="bg-gray-800/50 p-3 rounded-lg"><a href={n.url} target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-400 hover:underline">{n.headline}</a><p className="text-sm text-gray-400 mt-1">{n.source} - {new Date(n.publishedAt).toLocaleString()}</p><p className="text-sm text-gray-300 mt-2">{n.summary}</p></li>))}</ul></div>)}{activeTab === 'notes' && (<div><h4 className="text-xl font-semibold text-white mb-4">My Notes</h4><textarea value={modalData.notes} onChange={(e) => dispatch({type: 'UPDATE_ASSET_NOTES', payload: e.target.value})} className="w-full h-64 bg-gray-800 text-white p-3 rounded border border-gray-600 focus:ring-blue-500 focus:border-blue-500" placeholder="Your private notes and analysis for this asset..." /><button className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Save Notes</button></div>)}</>)}</main></div></div></div>);
};

const AllocationCharts: FC<{ data: EnhancedPortfolioAsset[] }> = ({ data }) => {
    const [chartType, setChartType] = useState<AllocationChartType>('assetClass');
    const allocationData = useMemo(() => {
        const grouped = data.reduce((acc, asset) => {
            const key = asset[chartType]; if (!acc[key]) acc[key] = { name: key, value: 0 }; acc[key].value += asset.value; return acc;
        }, {} as { [key: string]: { name: string, value: number } }); return Object.values(grouped);
    }, [data, chartType]);
    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF', '#FF19AF', '#19FFFF', '#FFC300'];
    return (<Card title="Portfolio Allocation"><div className="mb-4 flex justify-center flex-wrap gap-2">{(['assetClass', 'region', 'sector', 'riskLevel'] as AllocationChartType[]).map(type => (<button key={type} onClick={() => setChartType(type)} className={`px-3 py-1 rounded text-sm capitalize ${chartType === type ? 'bg-blue-600 text-white' : 'bg-gray-700 hover:bg-gray-600'}`}>{type.replace('Class', ' Class')}</button>))}</div><ResponsiveContainer width="100%" height={400}><PieChart><Pie data={allocationData} cx="50%" cy="50%" labelLine={false} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} outerRadius={150} fill="#8884d8" dataKey="value">{allocationData.map((_, index) => (<Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />))}</Pie><Tooltip formatter={(value: number) => formatCurrency(value)} /><Legend /></PieChart></ResponsiveContainer></Card>);
};

const AIAdvisorView: FC<{ insights: AIInsight[] | null; isLoading: boolean; onRefresh: () => void }> = ({ insights, isLoading, onRefresh }) => {
    const getIcon = (type: AIInsight['type']) => {
        if(type === 'Suggestion') return <FaLightbulb className="text-yellow-400" />;
        if(type === 'Warning') return <FaExclamationTriangle className="text-red-500" />;
        return <FaInfoCircle className="text-blue-400" />;
    };
    return (<Card><div className="flex justify-between items-center mb-4"><h3 className="text-xl font-semibold">AI Advisor</h3><button onClick={onRefresh} disabled={isLoading} className="flex items-center space-x-2 px-3 py-1 bg-gray-700 rounded hover:bg-gray-600 disabled:opacity-50"><FaSync className={isLoading ? 'animate-spin' : ''} /><span>Refresh</span></button></div>{isLoading ? <div className="space-y-4"><SkeletonLoader className="h-10 w-full" /><SkeletonLoader className="h-10 w-full" /><SkeletonLoader className="h-10 w-full" /></div> : !insights || insights.length === 0 ? <p className="text-gray-400">No insights available at this time.</p> : <div className="space-y-4">{insights.map(insight => (<div key={insight.id} className={`p-4 rounded-lg border-l-4 ${insight.priority === 'High' ? 'border-red-500 bg-red-900/20' : insight.priority === 'Medium' ? 'border-yellow-500 bg-yellow-900/20' : 'border-blue-500 bg-blue-900/20'}`}><div className="flex items-start space-x-3"><div className="flex-shrink-0">{getIcon(insight.type)}</div><div><h4 className="font-bold text-white">{insight.title}</h4><p className="text-gray-300 mt-1">{insight.explanation}</p></div></div></div>))}</div>}</Card>);
};

const ChatInterface: FC<{ state: ExplorerState; dispatch: React.Dispatch<ExplorerAction>; onSendMessage: (msg: string) => void }> = ({ state, dispatch, onSendMessage }) => {
    const [message, setMessage] = useState('');
    const chatBodyRef = useRef<HTMLDivElement>(null);
    useEffect(() => { chatBodyRef.current?.scrollTo(0, chatBodyRef.current.scrollHeight); }, [state.chatHistory]);
    const handleSend = () => { if(message.trim()) { onSendMessage(message.trim()); setMessage(''); } };
    return (<div className={`fixed bottom-4 right-4 w-96 bg-gray-900/80 backdrop-blur-md border border-gray-700 rounded-lg shadow-2xl z-50 flex flex-col transition-all duration-300 ${state.isChatOpen ? 'h-[500px] opacity-100' : 'h-0 opacity-0'}`}><header className="flex justify-between items-center p-3 border-b border-gray-700"><h4 className="text-white font-semibold flex items-center"><FaRobot className="mr-2" /> AI Portfolio Assistant</h4><button onClick={() => dispatch({ type: 'TOGGLE_VISIBILITY', payload: 'chat' })} className="text-gray-400 hover:text-white"><FaTimes /></button></header><div ref={chatBodyRef} className="flex-grow p-4 overflow-y-auto space-y-4">{state.chatHistory.map((chat, i) => (<div key={i} className={`flex items-end gap-2 ${chat.sender === 'user' ? 'justify-end' : 'justify-start'}`}><div className={`max-w-xs px-3 py-2 rounded-lg ${chat.sender === 'user' ? 'bg-blue-600 text-white rounded-br-none' : 'bg-gray-700 text-gray-200 rounded-bl-none'}`}>{chat.text}</div></div>))} {state.isChatLoading && <div className="flex justify-start"><div className="bg-gray-700 px-3 py-2 rounded-lg rounded-bl-none"><LoadingSpinner size="sm" /></div></div>}</div><footer className="p-3 border-t border-gray-700"><div className="flex items-center space-x-2"><input type="text" value={message} onChange={e => setMessage(e.target.value)} onKeyPress={e => e.key === 'Enter' && handleSend()} placeholder="Ask a question..." className="w-full bg-gray-800 text-white p-2 rounded border border-gray-600 focus:ring-blue-500 focus:border-blue-500" /><button onClick={handleSend} disabled={state.isChatLoading} className="p-2 bg-blue-600 rounded text-white hover:bg-blue-700 disabled:bg-blue-800"><FaPaperPlane /></button></div></footer></div>);
};

// --- MAIN COMPONENT ---

const PortfolioExplorerView: React.FC = () => {
    const context = useContext(DataContext);
    if (!context) throw new Error("PortfolioExplorerView must be within a DataProvider");
    const { portfolioAssets } = context;

    const enhancedAssets: EnhancedPortfolioAsset[] = useMemo(() => portfolioAssets.map(asset => ({...asset, sector: SECTORS[Math.floor(Math.random() * (SECTORS.length - 1)) + 1], marketCap: Math.random() * 500e9 + 1e9, currency: 'USD', peRatio: Math.random() * 30 + 10, dividendYield: Math.random() * 5, beta: Math.random() * 1.5 + 0.5, ytdReturn: Math.random() * 50 - 15, riskLevel: RISK_LEVELS[Math.floor(Math.random() * (RISK_LEVELS.length - 1)) + 1] as any, isWatchlisted: Math.random() > 0.8, esg: { rating: ESG_RATINGS[Math.floor(Math.random() * (ESG_RATINGS.length - 1)) + 1] as any, score: Math.random()*100, environmentScore: Math.random()*100, socialScore: Math.random()*100, governanceScore: Math.random()*100, controversyLevel: 'Low' }, taxLots: Array.from({length: 3}, (_, i) => ({ id: `lot_${asset.id}_${i}`, purchaseDate: new Date(Date.now() - Math.random() * 1e11).toISOString(), quantity: asset.quantity/3, purchasePrice: asset.value/asset.quantity * (Math.random() * 0.4 + 0.8), costBasis: 0, isLongTerm: Math.random() > 0.3 })) })), [portfolioAssets]);

    const [state, dispatch] = useReducer(explorerReducer, initialState);
    
    useEffect(() => {
        dispatch({ type: 'FETCH_AI_INSIGHTS_START' });
        MockAIService.getPortfolioInsights(enhancedAssets)
            .then(insights => dispatch({ type: 'FETCH_AI_INSIGHTS_SUCCESS', payload: insights }))
            .catch(err => dispatch({ type: 'FETCH_AI_INSIGHTS_FAILURE', payload: err.message }));
    }, [enhancedAssets]);

    const filteredAssets = useMemo(() => enhancedAssets
            .filter(a => state.assetClassFilter === 'All' || a.assetClass === state.assetClassFilter)
            .filter(a => state.regionFilter === 'All' || a.region === state.regionFilter)
            .filter(a => state.sectorFilter === 'All' || a.sector === state.sectorFilter)
            .filter(a => state.riskLevelFilter === 'All' || a.riskLevel === state.riskLevelFilter)
            .filter(a => state.marketCapFilter === 'All' || getMarketCapBand(a.marketCap) === state.marketCapFilter)
            .filter(a => state.esgFilter === 'All' || a.esg.rating === state.esgFilter)
            .filter(a => a.name.toLowerCase().includes(state.searchQuery.toLowerCase()) || a.ticker.toLowerCase().includes(state.searchQuery.toLowerCase())), 
            [enhancedAssets, state.assetClassFilter, state.regionFilter, state.sectorFilter, state.riskLevelFilter, state.marketCapFilter, state.esgFilter, state.searchQuery]);

    const sortedAssets = useMemo(() => {
        const sortable = [...filteredAssets];
        sortable.sort((a, b) => {
            const key = state.sortConfig.key; const aVal = key === 'esgScore' ? a.esg.score : a[key]; const bVal = key === 'esgScore' ? b.esg.score : b[key];
            if (aVal === undefined || aVal === null) return 1; if (bVal === undefined || bVal === null) return -1;
            if (aVal < bVal) return state.sortConfig.direction === 'asc' ? -1 : 1; if (aVal > bVal) return state.sortConfig.direction === 'asc' ? 1 : -1;
            return 0;
        }); return sortable;
    }, [filteredAssets, state.sortConfig]);

    const totalValue = useMemo(() => filteredAssets.reduce((s, a) => s + a.value, 0), [filteredAssets]);
    const overallChange = useMemo(() => { if (totalValue === 0) return 0; const weightedChange = filteredAssets.reduce((s, a) => s + a.value * a.change24h, 0); return weightedChange / totalValue; }, [filteredAssets, totalValue]);

    const handleSort = useCallback((key: SortKey) => dispatch({ type: 'SET_SORT', payload: key }), []);
    const handleAssetClick = useCallback((asset: EnhancedPortfolioAsset) => {
        dispatch({ type: 'OPEN_ASSET_MODAL', payload: asset });
        dispatch({ type: 'FETCH_MODAL_DATA_START' });
        Promise.all([ MockFinancialDataService.fetchAssetDetails(asset.id), MockFinancialDataService.fetchHistoricalData(asset.id, '1Y'), ]).then(([details, history]) => { dispatch({ type: 'FETCH_MODAL_DATA_SUCCESS', payload: { ...details, historicalData: history } }); }).catch(err => { dispatch({ type: 'FETCH_MODAL_DATA_FAILURE', payload: err.message }); });
    }, []);
    const handleChatSend = useCallback((message: string) => {
        dispatch({type: 'SEND_CHAT_MESSAGE', payload: message});
        MockAIService.generateChatResponse(message, { assets: enhancedAssets }).then(res => {
            dispatch({type: 'RECEIVE_CHAT_RESPONSE', payload: res});
        });
    }, [enhancedAssets]);

    const renderSortArrow = (key: SortKey) => state.sortConfig.key === key ? (state.sortConfig.direction === 'desc' ? <FaArrowDown className="inline ml-1"/> : <FaArrowUp className="inline ml-1"/>) : null;

    const renderCurrentView = () => {
        switch (state.viewMode) {
            case 'treemap': return (<Card title="Portfolio Composition by Value"><ResponsiveContainer width="100%" height={500}><Treemap data={sortedAssets} dataKey="value" ratio={16 / 9} stroke="#fff" fill="#8884d8" isAnimationActive content={<CustomTreemapContent />} onClick={(item) => handleAssetClick(item as any)}>{sortedAssets.map((entry, index) => (<Cell key={`cell-${index}`} fill={getColorForChange(entry.change24h)} />))}</Treemap></ResponsiveContainer></Card>);
            case 'table': return (<Card title="Asset Details"><div className="overflow-x-auto"><table className="w-full text-sm text-left text-gray-400"><thead className="text-xs text-gray-300 uppercase bg-gray-900/30"><tr><th onClick={() => handleSort('name')} className="px-6 py-3 cursor-pointer">Name {renderSortArrow('name')}</th><th onClick={() => handleSort('value')} className="px-6 py-3 cursor-pointer text-right">Value {renderSortArrow('value')}</th><th onClick={() => handleSort('change24h')} className="px-6 py-3 cursor-pointer text-right">24h % {renderSortArrow('change24h')}</th><th onClick={() => handleSort('ytdReturn')} className="px-6 py-3 cursor-pointer text-right">YTD % {renderSortArrow('ytdReturn')}</th><th onClick={() => handleSort('sector')} className="px-6 py-3 cursor-pointer">Sector {renderSortArrow('sector')}</th><th onClick={() => handleSort('esgScore')} className="px-6 py-3 cursor-pointer">ESG {renderSortArrow('esgScore')}</th><th className="px-6 py-3"></th></tr></thead><tbody>{sortedAssets.map(asset => (<tr key={asset.id} className="border-b border-gray-800 hover:bg-gray-800/50 cursor-pointer" onClick={() => handleAssetClick(asset)}><td className="px-6 py-4 font-medium text-white">{asset.name}<span className="block text-xs text-gray-500">{asset.ticker} - {asset.assetClass}</span></td><td className="px-6 py-4 font-mono text-right text-white">{formatCurrency(asset.value)}</td><td className={`px-6 py-4 font-mono text-right ${asset.change24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>{asset.change24h >= 0 ? '+' : ''}{asset.change24h.toFixed(2)}%</td><td className={`px-6 py-4 font-mono text-right ${asset.ytdReturn >= 0 ? 'text-green-400' : 'text-red-400'}`}>{asset.ytdReturn >= 0 ? '+' : ''}{asset.ytdReturn.toFixed(2)}%</td><td className="px-6 py-4">{asset.sector}</td><td className="px-6 py-4">{asset.esg.rating} ({asset.esg.score.toFixed(0)})</td><td className="px-6 py-4 text-center"><button onClick={(e) => { e.stopPropagation(); dispatch({ type: 'TOGGLE_WATCHLIST', payload: asset.id })}} className="text-yellow-400 hover:text-yellow-200">{state.watchlist.has(asset.id) ? <FaStar /> : <FaRegStar />}</button></td></tr>))}</tbody></table></div></Card>);
            case 'allocation': return <AllocationCharts data={filteredAssets} />;
            case 'advisor': return <AIAdvisorView insights={state.aiInsights} isLoading={state.isAIInsightLoading} onRefresh={() => { dispatch({type:'FETCH_AI_INSIGHTS_START'}); MockAIService.getPortfolioInsights(enhancedAssets).then(i => dispatch({type:'FETCH_AI_INSIGHTS_SUCCESS', payload:i})).catch(e => dispatch({type:'FETCH_AI_INSIGHTS_FAILURE', payload:e.message})) }} />;
            default: return <ErrorDisplay message={`View mode "${state.viewMode}" is not implemented.`} />;
        }
    }

    return (
        <div className="space-y-6 p-4 md:p-6">
            <header className="flex flex-wrap justify-between items-center gap-4"><h2 className="text-3xl font-bold text-white tracking-wider">Portfolio Explorer</h2><div className="flex items-center space-x-2"><ToolbarButton icon={FaFileCsv} label="Export CSV" /><ToolbarButton icon={FaFilePdf} label="Export PDF" /><ToolbarButton icon={FaCog} label="Settings" onClick={() => dispatch({type: 'TOGGLE_VISIBILITY', payload: 'settings'})} /></div></header>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6"><Card className="text-center"><p className="text-3xl font-bold text-white">{formatCurrency(totalValue)}</p><p className="text-sm text-gray-400 mt-1">Filtered Value</p></Card><Card className="text-center"><p className={`text-3xl font-bold ${overallChange >= 0 ? 'text-green-400' : 'text-red-400'}`}>{overallChange >= 0 ? '+' : ''}{overallChange.toFixed(2)}%</p><p className="text-sm text-gray-400 mt-1">24h Weighted Change</p></Card><Card className="text-center"><p className="text-3xl font-bold text-white">{filteredAssets.length}</p><p className="text-sm text-gray-400 mt-1">Assets Shown</p></Card></div>
            <Card><div className="flex flex-wrap justify-between items-center gap-4"><div className="relative flex-grow max-w-xs"><FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" /><input type="text" placeholder="Search by name or ticker..." value={state.searchQuery} onChange={e => dispatch({type: 'SET_FILTER', payload: {filter: 'searchQuery', value: e.target.value}})} className="w-full bg-gray-700/50 border-gray-600 rounded p-2 pl-10 text-white" /></div><div className="flex items-center space-x-2"><ToolbarButton icon={FaFilter} label={state.isFiltersVisible ? 'Hide Filters' : 'Show Filters'} onClick={() => dispatch({type: 'TOGGLE_VISIBILITY', payload: 'filters'})} isActive={state.isFiltersVisible} /></div></div>{state.isFiltersVisible && (<div className="mt-6 border-t border-gray-700 pt-6"><AdvancedFilters state={state} dispatch={dispatch} /></div>)}</Card>
            <Card><div className="flex flex-wrap gap-2"><ToolbarButton icon={FaChartPie} label="Treemap" onClick={() => dispatch({type: 'SET_VIEW_MODE', payload: 'treemap'})} isActive={state.viewMode === 'treemap'} /><ToolbarButton icon={FaTable} label="Table" onClick={() => dispatch({type: 'SET_VIEW_MODE', payload: 'table'})} isActive={state.viewMode === 'table'} /><ToolbarButton icon={FaChartBar} label="Allocation" onClick={() => dispatch({type: 'SET_VIEW_MODE', payload: 'allocation'})} isActive={state.viewMode === 'allocation'} /><ToolbarButton icon={FaChartLine} label="Performance" onClick={() => dispatch({type: 'SET_VIEW_MODE', payload: 'performance'})} isActive={state.viewMode === 'performance'} /><ToolbarButton icon={FaShieldAlt} label="Risk Analysis" onClick={() => dispatch({type: 'SET_VIEW_MODE', payload: 'risk'})} isActive={state.viewMode === 'risk'} /><ToolbarButton icon={FaBrain} label="AI Advisor" onClick={() => dispatch({type: 'SET_VIEW_MODE', payload: 'advisor'})} isActive={state.viewMode === 'advisor'} notification={!state.isAIInsightLoading && !!state.aiInsights?.some(i => i.priority === 'High')} /></div></Card>
            {renderCurrentView()}
            <AssetDetailModal isOpen={state.isModalOpen} onClose={() => dispatch({ type: 'CLOSE_ASSET_MODAL' })} asset={state.selectedAsset} modalData={state.modalData} isLoading={state.isModalLoading} error={state.modalError} dispatch={dispatch} />
            <button onClick={() => dispatch({type: 'TOGGLE_VISIBILITY', payload: 'chat'})} className="fixed bottom-4 right-4 bg-blue-600 text-white rounded-full p-4 shadow-lg hover:bg-blue-700 transition-transform hover:scale-110 z-40"><FaComments className="h-6 w-6" /></button>
            <ChatInterface state={state} dispatch={dispatch} onSendMessage={handleChatSend} />
        </div>
    );
};

export default PortfolioExplorerView;

================================================================================
// APPENDED FROM REPO: diplomat-bit/Fuckyou | ORIGINAL PATH: diplomat-bit-Fuckyou-70f83c5/components/views/personal/PortfolioExplorerView.tsx
================================================================================

// components/views/personal/PortfolioExplorerView.tsx
import React, { useContext, useMemo, useState } from 'react';
import Card from '../../Card';
import { DataContext } from '../../../context/DataContext';
import { PortfolioAsset } from '../../../types';
// FIX: Imported 'Cell' from recharts to be used inside the Treemap component.
import { ResponsiveContainer, Treemap, Tooltip, Cell } from 'recharts';

const ASSET_CLASSES = ['All', 'Equities', 'Fixed Income', 'Alternatives', 'Digital Assets', 'Cash & Equivalents'];
const REGIONS = ['All', 'North America', 'Europe', 'Asia', 'Emerging Markets', 'Global'];

type SortKey = 'name' | 'value' | 'change24h';
type SortDirection = 'asc' | 'desc';

// Custom Content Renderer for Treemap
const CustomTreemapContent = (props: any) => {
    const { depth, x, y, width, height, index, name, value, change24h } = props;
    const isRoot = depth === 0;

    if (isRoot || width < 50 || height < 30) return null;

    return (
        <g>
            <rect
                x={x}
                y={y}
                width={width}
                height={height}
                style={{
                    fill: 'transparent',
                    stroke: '#fff',
                    strokeWidth: 2 / (depth + 1e-10),
                    strokeOpacity: 1 / (depth + 1e-10),
                }}
            />
            <foreignObject x={x + 4} y={y + 4} width={width - 8} height={height - 8}>
                <div style={{ 
                    width: '100%', 
                    height: '100%', 
                    display: 'flex', 
                    flexDirection: 'column', 
                    justifyContent: 'space-between', 
                    color: 'white',
                    fontSize: '12px'
                }}>
                    <div className="font-semibold truncate">{name}</div>
                    <div>
                        <div className="font-mono text-sm">${value.toLocaleString(undefined, {maximumFractionDigits: 0})}</div>
                        <div className={`font-mono text-xs ${change24h >= 0 ? 'text-green-300' : 'text-red-300'}`}>
                            {change24h >= 0 ? '+' : ''}{change24h.toFixed(2)}%
                        </div>
                    </div>
                </div>
            </foreignObject>
        </g>
    );
};


const PortfolioExplorerView: React.FC = () => {
    const context = useContext(DataContext);
    if (!context) throw new Error("PortfolioExplorerView must be within a DataProvider");

    const { portfolioAssets } = context;

    const [assetClassFilter, setAssetClassFilter] = useState('All');
    const [regionFilter, setRegionFilter] = useState('All');
    const [sortConfig, setSortConfig] = useState<{ key: SortKey; direction: SortDirection }>({ key: 'value', direction: 'desc' });
    
    const filteredAssets = useMemo(() => {
        return portfolioAssets
            .filter(asset => assetClassFilter === 'All' || asset.assetClass === assetClassFilter)
            .filter(asset => regionFilter === 'All' || asset.region === regionFilter);
    }, [portfolioAssets, assetClassFilter, regionFilter]);

    const sortedAssets = useMemo(() => {
        const sortableAssets = [...filteredAssets];
        sortableAssets.sort((a, b) => {
            if (a[sortConfig.key] < b[sortConfig.key]) {
                return sortConfig.direction === 'asc' ? -1 : 1;
            }
            if (a[sortConfig.key] > b[sortConfig.key]) {
                return sortConfig.direction === 'asc' ? 1 : -1;
            }
            return 0;
        });
        return sortableAssets;
    }, [filteredAssets, sortConfig]);

    const totalValue = useMemo(() => filteredAssets.reduce((sum, asset) => sum + asset.value, 0), [filteredAssets]);
    const overallChange = useMemo(() => {
        if (totalValue === 0) return 0;
        const weightedChange = filteredAssets.reduce((sum, asset) => sum + asset.value * asset.change24h, 0);
        return weightedChange / totalValue;
    }, [filteredAssets, totalValue]);

    const handleSort = (key: SortKey) => {
        let direction: SortDirection = 'desc';
        if (sortConfig.key === key && sortConfig.direction === 'desc') {
            direction = 'asc';
        }
        setSortConfig({ key, direction });
    };

    const getColorForChange = (change: number) => {
        if (change > 1) return '#10b981';   // Strong green
        if (change > 0) return '#34d399';    // Green
        if (change < -1) return '#ef4444'; // Strong red
        if (change < 0) return '#f87171';     // Red
        return '#6b7280';                  // Gray
    };

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold text-white tracking-wider">Portfolio Explorer</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="text-center"><p className="text-3xl font-bold text-white">${totalValue.toLocaleString(undefined, {maximumFractionDigits:0})}</p><p className="text-sm text-gray-400 mt-1">Filtered Value</p></Card>
                <Card className="text-center"><p className={`text-3xl font-bold ${overallChange >= 0 ? 'text-green-400' : 'text-red-400'}`}>{overallChange >= 0 ? '+' : ''}{overallChange.toFixed(2)}%</p><p className="text-sm text-gray-400 mt-1">24h Change</p></Card>
                <Card className="text-center"><p className="text-3xl font-bold text-white">{filteredAssets.length}</p><p className="text-sm text-gray-400 mt-1">Assets Shown</p></Card>
            </div>
            
            <Card title="Filters">
                <div className="flex flex-wrap gap-4">
                    <div>
                        <label className="text-sm text-gray-400">Asset Class</label>
                        <select value={assetClassFilter} onChange={e => setAssetClassFilter(e.target.value)} className="w-full mt-1 bg-gray-700/50 border-gray-600 rounded p-2 text-white">
                            {ASSET_CLASSES.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </div>
                     <div>
                        <label className="text-sm text-gray-400">Region</label>
                        <select value={regionFilter} onChange={e => setRegionFilter(e.target.value)} className="w-full mt-1 bg-gray-700/50 border-gray-600 rounded p-2 text-white">
                            {REGIONS.map(r => <option key={r} value={r}>{r}</option>)}
                        </select>
                    </div>
                </div>
            </Card>

            <Card title="Portfolio Composition by Value">
                 <ResponsiveContainer width="100%" height={500}>
                    <Treemap
                        data={sortedAssets}
                        dataKey="value"
                        ratio={4 / 3}
                        stroke="#fff"
                        fill="#8884d8"
                        isAnimationActive={true}
                        content={<CustomTreemapContent />}
                    >
                         {sortedAssets.map((entry, index) => (
                           <Cell key={`cell-${index}`} fill={getColorForChange(entry.change24h)} />
                        ))}
                    </Treemap>
                </ResponsiveContainer>
            </Card>

            <Card title="Asset Details">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-400">
                        <thead className="text-xs text-gray-300 uppercase bg-gray-900/30">
                            <tr>
                                <th onClick={() => handleSort('name')} className="px-6 py-3 cursor-pointer">Name</th>
                                <th onClick={() => handleSort('value')} className="px-6 py-3 cursor-pointer text-right">Value (USD)</th>
                                <th onClick={() => handleSort('change24h')} className="px-6 py-3 cursor-pointer text-right">24h Change</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sortedAssets.map(asset => (
                                <tr key={asset.id} className="border-b border-gray-800 hover:bg-gray-800/50">
                                    <td className="px-6 py-4 font-medium text-white">
                                        {asset.name}
                                        <span className="block text-xs text-gray-500">{asset.ticker} - {asset.assetClass}</span>
                                    </td>
                                    <td className="px-6 py-4 font-mono text-right text-white">${asset.value.toLocaleString()}</td>
                                    <td className={`px-6 py-4 font-mono text-right ${asset.change24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                        {asset.change24h >= 0 ? '+' : ''}{asset.change24h.toFixed(2)}%
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>

        </div>
    );
};

export default PortfolioExplorerView;

================================================================================
// APPENDED FROM REPO: diplomat-bit/magic | ORIGINAL PATH: diplomat-bit-magic-a3f5ff1/components/views/personal/PortfolioExplorerView.tsx
================================================================================

// components/views/personal/PortfolioExplorerView.tsx
import React, { useContext, useMemo, useState } from 'react';
import Card from '../../Card';
import { DataContext } from '../../../context/DataContext';
import { PortfolioAsset } from '../../../types';
// FIX: Imported 'Cell' from recharts to be used inside the Treemap component.
import { ResponsiveContainer, Treemap, Tooltip, Cell } from 'recharts';

const ASSET_CLASSES = ['All', 'Equities', 'Fixed Income', 'Alternatives', 'Digital Assets', 'Cash & Equivalents'];
const REGIONS = ['All', 'North America', 'Europe', 'Asia', 'Emerging Markets', 'Global'];

type SortKey = 'name' | 'value' | 'change24h';
type SortDirection = 'asc' | 'desc';

// Custom Content Renderer for Treemap
const CustomTreemapContent = (props: any) => {
    const { depth, x, y, width, height, index, name, value, change24h } = props;
    const isRoot = depth === 0;

    if (isRoot || width < 50 || height < 30) return null;

    return (
        <g>
            <rect
                x={x}
                y={y}
                width={width}
                height={height}
                style={{
                    fill: 'transparent',
                    stroke: '#fff',
                    strokeWidth: 2 / (depth + 1e-10),
                    strokeOpacity: 1 / (depth + 1e-10),
                }}
            />
            <foreignObject x={x + 4} y={y + 4} width={width - 8} height={height - 8}>
                <div style={{ 
                    width: '100%', 
                    height: '100%', 
                    display: 'flex', 
                    flexDirection: 'column', 
                    justifyContent: 'space-between', 
                    color: 'white',
                    fontSize: '12px'
                }}>
                    <div className="font-semibold truncate">{name}</div>
                    <div>
                        <div className="font-mono text-sm">${value.toLocaleString(undefined, {maximumFractionDigits: 0})}</div>
                        <div className={`font-mono text-xs ${change24h >= 0 ? 'text-green-300' : 'text-red-300'}`}>
                            {change24h >= 0 ? '+' : ''}{change24h.toFixed(2)}%
                        </div>
                    </div>
                </div>
            </foreignObject>
        </g>
    );
};


const PortfolioExplorerView: React.FC = () => {
    const context = useContext(DataContext);
    if (!context) throw new Error("PortfolioExplorerView must be within a DataProvider");

    const { portfolioAssets } = context;

    const [assetClassFilter, setAssetClassFilter] = useState('All');
    const [regionFilter, setRegionFilter] = useState('All');
    const [sortConfig, setSortConfig] = useState<{ key: SortKey; direction: SortDirection }>({ key: 'value', direction: 'desc' });
    
    const filteredAssets = useMemo(() => {
        return portfolioAssets
            .filter(asset => assetClassFilter === 'All' || asset.assetClass === assetClassFilter)
            .filter(asset => regionFilter === 'All' || asset.region === regionFilter);
    }, [portfolioAssets, assetClassFilter, regionFilter]);

    const sortedAssets = useMemo(() => {
        const sortableAssets = [...filteredAssets];
        sortableAssets.sort((a, b) => {
            if (a[sortConfig.key] < b[sortConfig.key]) {
                return sortConfig.direction === 'asc' ? -1 : 1;
            }
            if (a[sortConfig.key] > b[sortConfig.key]) {
                return sortConfig.direction === 'asc' ? 1 : -1;
            }
            return 0;
        });
        return sortableAssets;
    }, [filteredAssets, sortConfig]);

    const totalValue = useMemo(() => filteredAssets.reduce((sum, asset) => sum + asset.value, 0), [filteredAssets]);
    const overallChange = useMemo(() => {
        if (totalValue === 0) return 0;
        const weightedChange = filteredAssets.reduce((sum, asset) => sum + asset.value * asset.change24h, 0);
        return weightedChange / totalValue;
    }, [filteredAssets, totalValue]);

    const handleSort = (key: SortKey) => {
        let direction: SortDirection = 'desc';
        if (sortConfig.key === key && sortConfig.direction === 'desc') {
            direction = 'asc';
        }
        setSortConfig({ key, direction });
    };

    const getColorForChange = (change: number) => {
        if (change > 1) return '#10b981';   // Strong green
        if (change > 0) return '#34d399';    // Green
        if (change < -1) return '#ef4444'; // Strong red
        if (change < 0) return '#f87171';     // Red
        return '#6b7280';                  // Gray
    };

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold text-white tracking-wider">Portfolio Explorer</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="text-center"><p className="text-3xl font-bold text-white">${totalValue.toLocaleString(undefined, {maximumFractionDigits:0})}</p><p className="text-sm text-gray-400 mt-1">Filtered Value</p></Card>
                <Card className="text-center"><p className={`text-3xl font-bold ${overallChange >= 0 ? 'text-green-400' : 'text-red-400'}`}>{overallChange >= 0 ? '+' : ''}{overallChange.toFixed(2)}%</p><p className="text-sm text-gray-400 mt-1">24h Change</p></Card>
                <Card className="text-center"><p className="text-3xl font-bold text-white">{filteredAssets.length}</p><p className="text-sm text-gray-400 mt-1">Assets Shown</p></Card>
            </div>
            
            <Card title="Filters">
                <div className="flex flex-wrap gap-4">
                    <div>
                        <label className="text-sm text-gray-400">Asset Class</label>
                        <select value={assetClassFilter} onChange={e => setAssetClassFilter(e.target.value)} className="w-full mt-1 bg-gray-700/50 border-gray-600 rounded p-2 text-white">
                            {ASSET_CLASSES.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </div>
                     <div>
                        <label className="text-sm text-gray-400">Region</label>
                        <select value={regionFilter} onChange={e => setRegionFilter(e.target.value)} className="w-full mt-1 bg-gray-700/50 border-gray-600 rounded p-2 text-white">
                            {REGIONS.map(r => <option key={r} value={r}>{r}</option>)}
                        </select>
                    </div>
                </div>
            </Card>

            <Card title="Portfolio Composition by Value">
                 <ResponsiveContainer width="100%" height={500}>
                    <Treemap
                        data={sortedAssets}
                        dataKey="value"
                        ratio={4 / 3}
                        stroke="#fff"
                        fill="#8884d8"
                        isAnimationActive={true}
                        content={<CustomTreemapContent />}
                    >
                         {sortedAssets.map((entry, index) => (
                           <Cell key={`cell-${index}`} fill={getColorForChange(entry.change24h)} />
                        ))}
                    </Treemap>
                </ResponsiveContainer>
            </Card>

            <Card title="Asset Details">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-400">
                        <thead className="text-xs text-gray-300 uppercase bg-gray-900/30">
                            <tr>
                                <th onClick={() => handleSort('name')} className="px-6 py-3 cursor-pointer">Name</th>
                                <th onClick={() => handleSort('value')} className="px-6 py-3 cursor-pointer text-right">Value (USD)</th>
                                <th onClick={() => handleSort('change24h')} className="px-6 py-3 cursor-pointer text-right">24h Change</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sortedAssets.map(asset => (
                                <tr key={asset.id} className="border-b border-gray-800 hover:bg-gray-800/50">
                                    <td className="px-6 py-4 font-medium text-white">
                                        {asset.name}
                                        <span className="block text-xs text-gray-500">{asset.ticker} - {asset.assetClass}</span>
                                    </td>
                                    <td className="px-6 py-4 font-mono text-right text-white">${asset.value.toLocaleString()}</td>
                                    <td className={`px-6 py-4 font-mono text-right ${asset.change24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                        {asset.change24h >= 0 ? '+' : ''}{asset.change24h.toFixed(2)}%
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>

        </div>
    );
};

export default PortfolioExplorerView;