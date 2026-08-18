// REPOSITORY SOURCE: diplomat-bit/aibanking.dev-demai-jocalll3 | PATH: diplomat-bit-aibanking.dev-demai-jocalll3-f8b6983/components/InvestmentPortfolio.tsx.md
================================================================================

# The Story of `InvestmentPortfolio.tsx`: The Observatory

While the `BalanceSummary` shows the total value of a user's liquid assets, the `InvestmentPortfolio` provides a deeper, more cosmic view. It is the observatory, the celestial map that shows how the user's wealth is distributed across the different asset classes—the constellations of their financial universe.

## The Orrery of Wealth: The `PieChart`

At the heart of the observatory is a magnificent orrery, a `PieChart` powered by the `recharts` library. This is not a simple chart; it is a dynamic model of the user's portfolio.

-   **The Celestial Bodies**: Each `asset` from the `DataContext` (Stocks, Bonds, Crypto, Real Estate) is represented as a colored slice of the pie. The size of the slice is directly proportional to its `value`, providing an immediate, intuitive understanding of the portfolio's composition.
-   **The Colors of the Cosmos**: Each asset class is given a distinct `color` from the `MOCK_ASSETS` data. These colors are used to paint the slices of the pie, making the chart a vibrant and beautiful celestial map.
-   **The Legend**: A `Legend` stands beside the chart, a key that explains the meaning of each color, ensuring the map is easy to read and understand.
-   **The Telescope (`Tooltip`)**: When the user hovers over a slice of the pie, a `Tooltip` appears, a magical telescope that provides detailed information about that specific asset class, showing its name and precise value.

## The Grand Totals: The Numbers

Beside the celestial map, the observatory displays the two most important numbers for any investor:

1.  **Total Value**: The sum of all asset values is displayed in a bold, 5xl font. This is the total gravitational pull of the user's investment universe.
2.  **Weighted Performance (YTD)**: This is a more subtle and intelligent calculation. The component doesn't just average the performance of each asset; it calculates a *weighted* average based on the value of each holding. This provides a true and accurate measure of the portfolio's overall growth for the year, displayed in a confident, green font.

## The Calculation Chamber: `useMemo`

Like its cousin, the `BalanceSummary`, the `InvestmentPortfolio` performs its calculations within the efficient and sacred space of a `useMemo` hook. It calculates the `totalValue` and `weightedPerformance` only when the underlying `assets` data changes, ensuring peak performance and preventing unnecessary work.

The `InvestmentPortfolio` component serves a vital role. It elevates the user's perspective from the day-to-day flow of transactions to a grand, strategic view of their accumulated wealth, showing them not just what they have, but how it is structured and how it is growing. It is their personal observatory for navigating the cosmos of investment.


================================================================================
// APPENDED FROM REPO: diplomat-bit/almost | ORIGINAL PATH: diplomat-bit-almost-93a5466/components/InvestmentPortfolio.tsx.md
================================================================================

import React, { useMemo, useCallback } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useDataContext } from '../context/DataContext';
import { AssetHolding } from '../types/financialTypes';
// Replacement Rationale: Renamed calculateOWPI (Obfuscated Weighted Performance Index) 
// to a standard function name (calculatePortfolioPerformance) for clarity and maintainability.
import { calculatePortfolioPerformance, getRiskAdjustedColor } from '../utils/financialCalculations'; 
import { AiSuggestionEngine } from '../services/AiSuggestionEngine';

// --- Constants ---

// Standardized color palette for financial visualization categories
const STANDARD_COLOR_PALETTE: { [key: string]: string } = {
    'StandardDerivatives': '#3b82f6', // Blue (Standard Derivatives -> Hedge/Complex)
    'RealEstateHoldings': '#10b981', // Emerald Green (Real Estate)
    'CorporateEquity': '#f59e0b', // Amber (Corporate Stocks)
    'LegacyEquities': '#8b5cf6', // Violet (Index Funds/Established Equities)
    'CashReserves': '#9ca3af', // Gray (Cash)
    'AlternativeAssets': '#ef4444', // Red (Crypto/Hedge/Other)
};

// --- Component Definition ---

/**
 * InvestmentPortfolio: The Core Asset Structure Viewer.
 * Displays the current distribution and performance metrics of aggregated user holdings.
 * Replaces the flawed Basic Asset Viewer (BAV) with a reliable standard visualization for the MVP dashboard.
 */
const InvestmentPortfolio: React.FC = () => {
    const { assets, marketData, userProfile } = useDataContext();
    
    // Stable Service Integration: Initialize the AI service for non-blocking suggestions.
    const aiEngine = useMemo(() => new AiSuggestionEngine(marketData, userProfile), [marketData, userProfile]);

    // --- Data Aggregation and Performance Calculation ---
    const { chartData, totalReportedValue, portfolioPerformance, aiSuggestion, detailedHoldings } = useMemo(() => {
        if (!assets || assets.length === 0) {
            return {
                chartData: [],
                totalReportedValue: 0,
                portfolioPerformance: 0,
                aiSuggestion: null,
                detailedHoldings: [],
            };
        }

        let totalValue = 0;
        const processedData: Array<{ name: string; value: number; color: string; percentage: number }> = [];
        const detailedHoldings: Array<AssetHolding> = [];

        // 1. Aggregate Holdings by Asset Class and Calculate Total Value
        const aggregatedAssets = assets.reduce((acc, holding) => {
            const assetClass = holding.assetType || 'AlternativeAssets';
            // Ensure safe calculation: Use 0 if price is missing, preventing NaN
            const currentValue = holding.quantity * (marketData[holding.id]?.price ?? 0);
            
            if (!acc[assetClass]) {
                acc[assetClass] = { 
                    name: assetClass, 
                    value: 0, 
                    color: STANDARD_COLOR_PALETTE[assetClass] || '#60a5fa', // Standard fallback blue
                    holdings: []
                };
            }
            acc[assetClass].value += currentValue;
            totalValue += currentValue;
            detailedHoldings.push(holding);
            return acc;
        }, {} as Record<string, { name: string; value: number; color: string; holdings: AssetHolding[]}>);

        // 2. Format for Recharts Pie Chart and calculate percentages
        Object.values(aggregatedAssets).forEach(item => {
            processedData.push({
                name: item.name,
                value: item.value,
                color: item.color,
                percentage: totalValue > 0 ? (item.value / totalValue) * 100 : 0,
            });
        });

        // 3. Calculate Standard Portfolio Performance (e.g., YTD return)
        const performance = calculatePortfolioPerformance(detailedHoldings, marketData);

        // 4. Generate Allocation Suggestion (Standardized Recommendation Service)
        const suggestion = aiEngine.generateAllocationSuggestion(detailedHoldings, totalValue);

        return {
            chartData: processedData,
            totalReportedValue: totalValue,
            portfolioPerformance: performance,
            aiSuggestion: suggestion,
            detailedHoldings: detailedHoldings,
        };
    }, [assets, marketData, aiEngine]);

    // --- Custom Tooltip Component (Clear and concise) ---
    const CustomTooltip = useCallback(({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            const dataPoint = payload[0].payload;
            
            return (
                <div className="p-3 bg-gray-800 border border-blue-500 shadow-xl text-xs font-mono text-white rounded">
                    <p className="text-sm font-bold text-blue-300 mb-1">{label}</p>
                    <p className="text-xs">Value: <span className="font-bold text-green-400">${dataPoint.value.toLocaleString('en-US', { maximumFractionDigits: 2 })}</span></p>
                    <p className="text-xs">Weight: <span className="font-bold text-white">{(dataPoint.percentage).toFixed(2)}%</span></p>
                </div>
            );
        }
        return null;
    }, []);

    // --- Custom Legend Component (Clean and data-focused) ---
    const CustomLegend = useCallback(({ payload }: any) => {
        if (!payload) return null;
        
        return (
            <div className="mt-4 p-3 bg-gray-900 border border-gray-700 rounded-lg text-xs font-mono w-full">
                <h4 className="text-sm font-semibold mb-2 text-indigo-300">Asset Distribution Summary</h4>
                {payload.map((entry: any, index: number) => {
                    const dataEntry = chartData.find(d => d.name === entry.value);
                    if (!dataEntry) return null;

                    return (
                        <div key={`item-${index}`} className="flex justify-between py-1 border-b border-gray-800 last:border-b-0 items-center">
                            <div className="flex items-center">
                                <span className="w-3 h-3 mr-2 inline-block rounded-full" style={{ backgroundColor: entry.color }} />
                                <span className="text-gray-300 font-semibold">{entry.value}</span>
                            </div>
                            <div className="text-right tabular-nums text-gray-200">
                                {dataEntry.percentage.toFixed(2)}%
                            </div>
                        </div>
                    );
                })}
            </div>
        );
    }, [chartData]);


    if (!assets || assets.length === 0) {
        return (
            <div className="p-8 bg-gray-950 text-white h-full flex items-center justify-center">
                <p className="text-xl text-indigo-400">No active assets detected. Initialize integration pathways.</p>
            </div>
        );
    }

    // Determine color for performance indicator
    const performanceColor = portfolioPerformance >= 0 ? 'text-green-400' : 'text-red-400';

    return (
        <div className="p-8 bg-gray-950 text-white min-h-[800px] font-sans">
            
            {/* HEADER: Total Reported Value (TRV) and Performance Display */}
            <header className="mb-8 border-b border-blue-700 pb-4">
                <p className="text-sm uppercase tracking-widest text-gray-400">Total Portfolio Value</p>
                <h1 className="text-6xl font-extrabold text-green-400 mt-1 tabular-nums">
                    ${totalReportedValue.toLocaleString('en-US', { maximumFractionDigits: 2 })}
                </h1>
                <div className="flex justify-between items-center mt-2">
                    <p className="text-xl font-semibold text-blue-300">
                        Total Performance (YTD): 
                        <span className={`ml-2 ${performanceColor}`}>
                            {(portfolioPerformance * 100).toFixed(4)}%
                        </span>
                    </p>
                    <p className="text-sm text-gray-500">Data Source: Multi-Bank Aggregation Service</p>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                
                {/* COLUMN 1: Asset Allocation Visualization */}
                <div className="lg:col-span-2 bg-gray-900 p-6 rounded-xl shadow-2xl border border-blue-800/50">
                    <h2 className="text-2xl font-bold mb-4 text-blue-400 border-b border-gray-700 pb-2">Current Asset Allocation Map</h2>
                    
                    <div style={{ width: '100%', height: 500 }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={chartData}
                                    dataKey="value"
                                    nameKey="name"
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={80}
                                    outerRadius={180}
                                    paddingAngle={3}
                                    stroke="none"
                                >
                                    {chartData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip content={<CustomTooltip />} />
                                <Legend content={<CustomLegend />} layout="vertical" align="right" verticalAlign="middle" />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* COLUMN 2: AI Recommendation Panel and Metrics */}
                <div className="lg:col-span-1 space-y-6">
                    
                    {/* Recommendation Engine Panel (Replaces MASE) */}
                    <div className="bg-gray-900 p-6 rounded-xl shadow-2xl border border-indigo-800/50">
                        <h3 className="text-xl font-bold text-indigo-400 mb-3 flex items-center">
                            <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l-2 2M15 19V6l2 2" /></svg>
                            AI Allocation Recommendation
                        </h3>
                        
                        {aiSuggestion ? (
                            <div className="space-y-3">
                                <p className="text-sm text-gray-300">
                                    Current Deviation from Optimal: <span className="font-bold text-yellow-400">{aiSuggestion.deviationPercentage.toFixed(2)}%</span>
                                </p>
                                <div className="p-3 bg-gray-800 rounded border border-indigo-600">
                                    <p className="text-sm font-semibold text-indigo-300 mb-1">Primary Directive:</p>
                                    <p className="text-xs italic text-gray-400">{aiSuggestion.primaryDirective}</p>
                                </div>
                                <button 
                                    onClick={() => console.log("Initiating Transaction Recommendation Workflow...")}
                                    className="w-full py-2 mt-3 bg-blue-600 hover:bg-blue-700 transition rounded font-bold text-sm shadow-lg disabled:opacity-50"
                                    disabled={aiSuggestion.deviationPercentage < 0.01}
                                >
                                    Review and Execute Rebalance Plan
                                </button>
                            </div>
                        ) : (
                            <p className="text-sm text-gray-500">Calculating standardized risk assessment...</p>
                        )}
                    </div>

                    {/* Quick Metrics Panel */}
                    <div className="bg-gray-900 p-6 rounded-xl shadow-2xl border border-green-800/50">
                        <h3 className="text-xl font-bold text-green-400 mb-3">Key Portfolio Metrics</h3>
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm text-gray-300">
                                <span>Total Holdings Count:</span>
                                <span className="font-bold text-white">{detailedHoldings.length}</span>
                            </div>
                            <div className="flex justify-between text-sm text-gray-300">
                                <span>Risk Tolerance (User Profile):</span>
                                <span className="font-bold text-white capitalize">{userProfile?.riskTolerance || 'N/A'}</span>
                            </div>
                            <div className="flex justify-between text-sm text-gray-300">
                                <span>Liquidity Ratio Estimate:</span>
                                <span className="font-bold text-yellow-300">75%</span> {/* Mock value, replace with real calculation if needed */}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* FOOTER: Detailed Holdings Register (Cleaned up table) */}
            <div className="mt-10 bg-gray-900 p-6 rounded-xl shadow-2xl border border-gray-700">
                <h3 className="text-xl font-bold text-gray-300 mb-4 border-b border-gray-700 pb-2">Detailed Holdings Register</h3>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-700 text-xs font-mono">
                        <thead>
                            <tr>
                                <th className="px-4 py-2 text-left text-gray-400 uppercase tracking-wider">ID</th>
                                <th className="px-4 py-2 text-left text-gray-400 uppercase tracking-wider">Asset Class</th>
                                <th className="px-4 py-2 text-right text-gray-400 uppercase tracking-wider">Quantity</th>
                                <th className="px-4 py-2 text-right text-gray-400 uppercase tracking-wider">Current Price</th>
                                <th className="px-4 py-2 text-right text-gray-400 uppercase tracking-wider">Market Value</th>
                                <th className="px-4 py-2 text-right text-gray-400 uppercase tracking-wider">Daily Change (%)</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-800">
                            {detailedHoldings.slice(0, 10).map((holding) => {
                                const marketInfo = marketData[holding.id] || { price: 0, changePercent: 0 };
                                const value = holding.quantity * marketInfo.price;
                                const changeColor = (marketInfo.changePercent || 0) >= 0 ? 'text-green-500' : 'text-red-500';

                                return (
                                    <tr key={holding.id} className="hover:bg-gray-800 transition">
                                        <td className="px-4 py-2 whitespace-nowrap text-indigo-400">{holding.id.substring(0, 8)}...</td>
                                        <td className="px-4 py-2 whitespace-nowrap text-gray-200">{holding.assetType || 'Unknown'}</td>
                                        <td className="px-4 py-2 whitespace-nowrap text-right tabular-nums">{holding.quantity.toFixed(4)}</td>
                                        <td className="px-4 py-2 whitespace-nowrap text-right tabular-nums text-yellow-300">${marketInfo.price.toFixed(4)}</td>
                                        <td className="px-4 py-2 whitespace-nowrap text-right tabular-nums text-green-400">${value.toLocaleString('en-US', { maximumFractionDigits: 2 })}</td>
                                        <td className={`px-4 py-2 whitespace-nowrap text-right tabular-nums ${changeColor}`}>
                                            {(marketInfo.changePercent || 0).toFixed(2)}%
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
                {detailedHoldings.length > 10 && (
                    <p className="text-right text-xs text-gray-500 mt-2">Displaying 10 of {detailedHoldings.length} total holdings.</p>
                )}
            </div>

        </div>
    );
};

export default InvestmentPortfolio;

================================================================================
// APPENDED FROM REPO: diplomat-bit/Citibank_Demo_Business_Inc_Demonstration- | ORIGINAL PATH: diplomat-bit-Citibank_Demo_Business_Inc_Demonstration--ab2501d/components/InvestmentPortfolio.tsx.md
================================================================================


# The Arsenal of Growth
*A Guide to the Investment Portfolio Instrument*

---

## The Concept

The `InvestmentPortfolio.tsx` component provides a clear, high-level intelligence report on the sovereign's arsenal of growth. It's designed to answer two key questions with speed and authority: "What assets do I command?" and "What is their current effectiveness?"

---

### A Simple Metaphor: The War Chest

Think of this instrument as a strategic overview of your war chest and its contents.

-   **The Pie Chart (`composition`)**: This shows you the composition of your arsenal—how much of your power is allocated to each type of asset (Stocks, Bonds, Crypto, etc.). It gives you an immediate sense of the balance and diversity of your power base.

-   **The Total Value (`totalValue`)**: This is the total destructive or creative power of your entire arsenal at this moment.

-   **The Performance (`weightedVelocity`)**: This tells you the overall growth vector of your power. It's not just the performance of one asset, but the combined, weighted-average effectiveness of all assets working in concert.

---

### How It Works

1.  **Assessing the Arsenal**: The component receives the list of all the sovereign's `assets` from the `DataContext`.

2.  **Calculating Total Power**: It then performs two key calculations:
    -   It sums the `value` of all assets to get the **totalValue**.
    -   It calculates the **weightedPerformance** by taking each asset's value, multiplying it by its year-to-date performance, summing those results, and then dividing by the total value. This provides a true measure of the portfolio's overall momentum.

3.  **Visualizing the Components**: It uses a `PieChart` to visualize the composition. Each asset is a "slice" of the pie, sized according to its value relative to the whole. The colors provide clear demarcation between each component of your power.

---

### The Philosophy: Clarity Breeds Command

The world of investing can be a chaotic battlefield of noise and misinformation. The purpose of this instrument is to cut through that chaos. By presenting a simple, visual overview of your holdings and their performance, it replaces doubt with clarity. A sovereign who understands their arsenal at a glance is a sovereign who can make confident, decisive commands about its future deployment.


================================================================================
// APPENDED FROM REPO: diplomat-bit/Fuckyou | ORIGINAL PATH: diplomat-bit-Fuckyou-70f83c5/components/InvestmentPortfolio.tsx.md
================================================================================

import React, { useMemo, useCallback } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useDataContext } from '../context/DataContext';
import { AssetHolding } from '../types/financialTypes';
// Replacement Rationale: Renamed calculateOWPI (Obfuscated Weighted Performance Index) 
// to a standard function name (calculatePortfolioPerformance) for clarity and maintainability.
import { calculatePortfolioPerformance, getRiskAdjustedColor } from '../utils/financialCalculations'; 
import { AiSuggestionEngine } from '../services/AiSuggestionEngine';

// --- Constants ---

// Standardized color palette for financial visualization categories
const STANDARD_COLOR_PALETTE: { [key: string]: string } = {
    'StandardDerivatives': '#3b82f6', // Blue (Standard Derivatives -> Hedge/Complex)
    'RealEstateHoldings': '#10b981', // Emerald Green (Real Estate)
    'CorporateEquity': '#f59e0b', // Amber (Corporate Stocks)
    'LegacyEquities': '#8b5cf6', // Violet (Index Funds/Established Equities)
    'CashReserves': '#9ca3af', // Gray (Cash)
    'AlternativeAssets': '#ef4444', // Red (Crypto/Hedge/Other)
};

// --- Component Definition ---

/**
 * InvestmentPortfolio: The Core Asset Structure Viewer.
 * Displays the current distribution and performance metrics of aggregated user holdings.
 * Replaces the flawed Basic Asset Viewer (BAV) with a reliable standard visualization for the MVP dashboard.
 */
const InvestmentPortfolio: React.FC = () => {
    const { assets, marketData, userProfile } = useDataContext();
    
    // Stable Service Integration: Initialize the AI service for non-blocking suggestions.
    const aiEngine = useMemo(() => new AiSuggestionEngine(marketData, userProfile), [marketData, userProfile]);

    // --- Data Aggregation and Performance Calculation ---
    const { chartData, totalReportedValue, portfolioPerformance, aiSuggestion, detailedHoldings } = useMemo(() => {
        if (!assets || assets.length === 0) {
            return {
                chartData: [],
                totalReportedValue: 0,
                portfolioPerformance: 0,
                aiSuggestion: null,
                detailedHoldings: [],
            };
        }

        let totalValue = 0;
        const processedData: Array<{ name: string; value: number; color: string; percentage: number }> = [];
        const detailedHoldings: Array<AssetHolding> = [];

        // 1. Aggregate Holdings by Asset Class and Calculate Total Value
        const aggregatedAssets = assets.reduce((acc, holding) => {
            const assetClass = holding.assetType || 'AlternativeAssets';
            // Ensure safe calculation: Use 0 if price is missing, preventing NaN
            const currentValue = holding.quantity * (marketData[holding.id]?.price ?? 0);
            
            if (!acc[assetClass]) {
                acc[assetClass] = { 
                    name: assetClass, 
                    value: 0, 
                    color: STANDARD_COLOR_PALETTE[assetClass] || '#60a5fa', // Standard fallback blue
                    holdings: []
                };
            }
            acc[assetClass].value += currentValue;
            totalValue += currentValue;
            detailedHoldings.push(holding);
            return acc;
        }, {} as Record<string, { name: string; value: number; color: string; holdings: AssetHolding[]}>);

        // 2. Format for Recharts Pie Chart and calculate percentages
        Object.values(aggregatedAssets).forEach(item => {
            processedData.push({
                name: item.name,
                value: item.value,
                color: item.color,
                percentage: totalValue > 0 ? (item.value / totalValue) * 100 : 0,
            });
        });

        // 3. Calculate Standard Portfolio Performance (e.g., YTD return)
        const performance = calculatePortfolioPerformance(detailedHoldings, marketData);

        // 4. Generate Allocation Suggestion (Standardized Recommendation Service)
        const suggestion = aiEngine.generateAllocationSuggestion(detailedHoldings, totalValue);

        return {
            chartData: processedData,
            totalReportedValue: totalValue,
            portfolioPerformance: performance,
            aiSuggestion: suggestion,
            detailedHoldings: detailedHoldings,
        };
    }, [assets, marketData, aiEngine]);

    // --- Custom Tooltip Component (Clear and concise) ---
    const CustomTooltip = useCallback(({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            const dataPoint = payload[0].payload;
            
            return (
                <div className="p-3 bg-gray-800 border border-blue-500 shadow-xl text-xs font-mono text-white rounded">
                    <p className="text-sm font-bold text-blue-300 mb-1">{label}</p>
                    <p className="text-xs">Value: <span className="font-bold text-green-400">${dataPoint.value.toLocaleString('en-US', { maximumFractionDigits: 2 })}</span></p>
                    <p className="text-xs">Weight: <span className="font-bold text-white">{(dataPoint.percentage).toFixed(2)}%</span></p>
                </div>
            );
        }
        return null;
    }, []);

    // --- Custom Legend Component (Clean and data-focused) ---
    const CustomLegend = useCallback(({ payload }: any) => {
        if (!payload) return null;
        
        return (
            <div className="mt-4 p-3 bg-gray-900 border border-gray-700 rounded-lg text-xs font-mono w-full">
                <h4 className="text-sm font-semibold mb-2 text-indigo-300">Asset Distribution Summary</h4>
                {payload.map((entry: any, index: number) => {
                    const dataEntry = chartData.find(d => d.name === entry.value);
                    if (!dataEntry) return null;

                    return (
                        <div key={`item-${index}`} className="flex justify-between py-1 border-b border-gray-800 last:border-b-0 items-center">
                            <div className="flex items-center">
                                <span className="w-3 h-3 mr-2 inline-block rounded-full" style={{ backgroundColor: entry.color }} />
                                <span className="text-gray-300 font-semibold">{entry.value}</span>
                            </div>
                            <div className="text-right tabular-nums text-gray-200">
                                {dataEntry.percentage.toFixed(2)}%
                            </div>
                        </div>
                    );
                })}
            </div>
        );
    }, [chartData]);


    if (!assets || assets.length === 0) {
        return (
            <div className="p-8 bg-gray-950 text-white h-full flex items-center justify-center">
                <p className="text-xl text-indigo-400">No active assets detected. Initialize integration pathways.</p>
            </div>
        );
    }

    // Determine color for performance indicator
    const performanceColor = portfolioPerformance >= 0 ? 'text-green-400' : 'text-red-400';

    return (
        <div className="p-8 bg-gray-950 text-white min-h-[800px] font-sans">
            
            {/* HEADER: Total Reported Value (TRV) and Performance Display */}
            <header className="mb-8 border-b border-blue-700 pb-4">
                <p className="text-sm uppercase tracking-widest text-gray-400">Total Portfolio Value</p>
                <h1 className="text-6xl font-extrabold text-green-400 mt-1 tabular-nums">
                    ${totalReportedValue.toLocaleString('en-US', { maximumFractionDigits: 2 })}
                </h1>
                <div className="flex justify-between items-center mt-2">
                    <p className="text-xl font-semibold text-blue-300">
                        Total Performance (YTD): 
                        <span className={`ml-2 ${performanceColor}`}>
                            {(portfolioPerformance * 100).toFixed(4)}%
                        </span>
                    </p>
                    <p className="text-sm text-gray-500">Data Source: Multi-Bank Aggregation Service</p>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                
                {/* COLUMN 1: Asset Allocation Visualization */}
                <div className="lg:col-span-2 bg-gray-900 p-6 rounded-xl shadow-2xl border border-blue-800/50">
                    <h2 className="text-2xl font-bold mb-4 text-blue-400 border-b border-gray-700 pb-2">Current Asset Allocation Map</h2>
                    
                    <div style={{ width: '100%', height: 500 }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={chartData}
                                    dataKey="value"
                                    nameKey="name"
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={80}
                                    outerRadius={180}
                                    paddingAngle={3}
                                    stroke="none"
                                >
                                    {chartData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip content={<CustomTooltip />} />
                                <Legend content={<CustomLegend />} layout="vertical" align="right" verticalAlign="middle" />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* COLUMN 2: AI Recommendation Panel and Metrics */}
                <div className="lg:col-span-1 space-y-6">
                    
                    {/* Recommendation Engine Panel (Replaces MASE) */}
                    <div className="bg-gray-900 p-6 rounded-xl shadow-2xl border border-indigo-800/50">
                        <h3 className="text-xl font-bold text-indigo-400 mb-3 flex items-center">
                            <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l-2 2M15 19V6l2 2" /></svg>
                            AI Allocation Recommendation
                        </h3>
                        
                        {aiSuggestion ? (
                            <div className="space-y-3">
                                <p className="text-sm text-gray-300">
                                    Current Deviation from Optimal: <span className="font-bold text-yellow-400">{aiSuggestion.deviationPercentage.toFixed(2)}%</span>
                                </p>
                                <div className="p-3 bg-gray-800 rounded border border-indigo-600">
                                    <p className="text-sm font-semibold text-indigo-300 mb-1">Primary Directive:</p>
                                    <p className="text-xs italic text-gray-400">{aiSuggestion.primaryDirective}</p>
                                </div>
                                <button 
                                    onClick={() => console.log("Initiating Transaction Recommendation Workflow...")}
                                    className="w-full py-2 mt-3 bg-blue-600 hover:bg-blue-700 transition rounded font-bold text-sm shadow-lg disabled:opacity-50"
                                    disabled={aiSuggestion.deviationPercentage < 0.01}
                                >
                                    Review and Execute Rebalance Plan
                                </button>
                            </div>
                        ) : (
                            <p className="text-sm text-gray-500">Calculating standardized risk assessment...</p>
                        )}
                    </div>

                    {/* Quick Metrics Panel */}
                    <div className="bg-gray-900 p-6 rounded-xl shadow-2xl border border-green-800/50">
                        <h3 className="text-xl font-bold text-green-400 mb-3">Key Portfolio Metrics</h3>
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm text-gray-300">
                                <span>Total Holdings Count:</span>
                                <span className="font-bold text-white">{detailedHoldings.length}</span>
                            </div>
                            <div className="flex justify-between text-sm text-gray-300">
                                <span>Risk Tolerance (User Profile):</span>
                                <span className="font-bold text-white capitalize">{userProfile?.riskTolerance || 'N/A'}</span>
                            </div>
                            <div className="flex justify-between text-sm text-gray-300">
                                <span>Liquidity Ratio Estimate:</span>
                                <span className="font-bold text-yellow-300">75%</span> {/* Mock value, replace with real calculation if needed */}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* FOOTER: Detailed Holdings Register (Cleaned up table) */}
            <div className="mt-10 bg-gray-900 p-6 rounded-xl shadow-2xl border border-gray-700">
                <h3 className="text-xl font-bold text-gray-300 mb-4 border-b border-gray-700 pb-2">Detailed Holdings Register</h3>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-700 text-xs font-mono">
                        <thead>
                            <tr>
                                <th className="px-4 py-2 text-left text-gray-400 uppercase tracking-wider">ID</th>
                                <th className="px-4 py-2 text-left text-gray-400 uppercase tracking-wider">Asset Class</th>
                                <th className="px-4 py-2 text-right text-gray-400 uppercase tracking-wider">Quantity</th>
                                <th className="px-4 py-2 text-right text-gray-400 uppercase tracking-wider">Current Price</th>
                                <th className="px-4 py-2 text-right text-gray-400 uppercase tracking-wider">Market Value</th>
                                <th className="px-4 py-2 text-right text-gray-400 uppercase tracking-wider">Daily Change (%)</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-800">
                            {detailedHoldings.slice(0, 10).map((holding) => {
                                const marketInfo = marketData[holding.id] || { price: 0, changePercent: 0 };
                                const value = holding.quantity * marketInfo.price;
                                const changeColor = (marketInfo.changePercent || 0) >= 0 ? 'text-green-500' : 'text-red-500';

                                return (
                                    <tr key={holding.id} className="hover:bg-gray-800 transition">
                                        <td className="px-4 py-2 whitespace-nowrap text-indigo-400">{holding.id.substring(0, 8)}...</td>
                                        <td className="px-4 py-2 whitespace-nowrap text-gray-200">{holding.assetType || 'Unknown'}</td>
                                        <td className="px-4 py-2 whitespace-nowrap text-right tabular-nums">{holding.quantity.toFixed(4)}</td>
                                        <td className="px-4 py-2 whitespace-nowrap text-right tabular-nums text-yellow-300">${marketInfo.price.toFixed(4)}</td>
                                        <td className="px-4 py-2 whitespace-nowrap text-right tabular-nums text-green-400">${value.toLocaleString('en-US', { maximumFractionDigits: 2 })}</td>
                                        <td className={`px-4 py-2 whitespace-nowrap text-right tabular-nums ${changeColor}`}>
                                            {(marketInfo.changePercent || 0).toFixed(2)}%
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
                {detailedHoldings.length > 10 && (
                    <p className="text-right text-xs text-gray-500 mt-2">Displaying 10 of {detailedHoldings.length} total holdings.</p>
                )}
            </div>

        </div>
    );
};

export default InvestmentPortfolio;

================================================================================
// APPENDED FROM REPO: diplomat-bit/G20 | ORIGINAL PATH: diplomat-bit-G20-0199fa7/components/InvestmentPortfolio.tsx.md
================================================================================

# The Story of `InvestmentPortfolio.tsx`: The Observatory

While the `BalanceSummary` shows the total value of a user's liquid assets, the `InvestmentPortfolio` provides a deeper, more cosmic view. It is the observatory, the celestial map that shows how the user's wealth is distributed across the different asset classes—the constellations of their financial universe.

## The Orrery of Wealth: The `PieChart`

At the heart of the observatory is a magnificent orrery, a `PieChart` powered by the `recharts` library. This is not a simple chart; it is a dynamic model of the user's portfolio.

-   **The Celestial Bodies**: Each `asset` from the `DataContext` (Stocks, Bonds, Crypto, Real Estate) is represented as a colored slice of the pie. The size of the slice is directly proportional to its `value`, providing an immediate, intuitive understanding of the portfolio's composition.
-   **The Colors of the Cosmos**: Each asset class is given a distinct `color` from the `MOCK_ASSETS` data. These colors are used to paint the slices of the pie, making the chart a vibrant and beautiful celestial map.
-   **The Legend**: A `Legend` stands beside the chart, a key that explains the meaning of each color, ensuring the map is easy to read and understand.
-   **The Telescope (`Tooltip`)**: When the user hovers over a slice of the pie, a `Tooltip` appears, a magical telescope that provides detailed information about that specific asset class, showing its name and precise value.

## The Grand Totals: The Numbers

Beside the celestial map, the observatory displays the two most important numbers for any investor:

1.  **Total Value**: The sum of all asset values is displayed in a bold, 5xl font. This is the total gravitational pull of the user's investment universe.
2.  **Weighted Performance (YTD)**: This is a more subtle and intelligent calculation. The component doesn't just average the performance of each asset; it calculates a *weighted* average based on the value of each holding. This provides a true and accurate measure of the portfolio's overall growth for the year, displayed in a confident, green font.

## The Calculation Chamber: `useMemo`

Like its cousin, the `BalanceSummary`, the `InvestmentPortfolio` performs its calculations within the efficient and sacred space of a `useMemo` hook. It calculates the `totalValue` and `weightedPerformance` only when the underlying `assets` data changes, ensuring peak performance and preventing unnecessary work.

The `InvestmentPortfolio` component serves a vital role. It elevates the user's perspective from the day-to-day flow of transactions to a grand, strategic view of their accumulated wealth, showing them not just what they have, but how it is structured and how it is growing. It is their personal observatory for navigating the cosmos of investment.


================================================================================
// APPENDED FROM REPO: diplomat-bit/magic | ORIGINAL PATH: diplomat-bit-magic-a3f5ff1/components/InvestmentPortfolio.tsx.md
================================================================================

import React, { useMemo, useCallback } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useDataContext } from '../context/DataContext';
import { AssetHolding } from '../types/financialTypes';
// Replacement Rationale: Renamed calculateOWPI (Obfuscated Weighted Performance Index) 
// to a standard function name (calculatePortfolioPerformance) for clarity and maintainability.
import { calculatePortfolioPerformance, getRiskAdjustedColor } from '../utils/financialCalculations'; 
import { AiSuggestionEngine } from '../services/AiSuggestionEngine';

// --- Constants ---

// Standardized color palette for financial visualization categories
const STANDARD_COLOR_PALETTE: { [key: string]: string } = {
    'StandardDerivatives': '#3b82f6', // Blue (Standard Derivatives -> Hedge/Complex)
    'RealEstateHoldings': '#10b981', // Emerald Green (Real Estate)
    'CorporateEquity': '#f59e0b', // Amber (Corporate Stocks)
    'LegacyEquities': '#8b5cf6', // Violet (Index Funds/Established Equities)
    'CashReserves': '#9ca3af', // Gray (Cash)
    'AlternativeAssets': '#ef4444', // Red (Crypto/Hedge/Other)
};

// --- Component Definition ---

/**
 * InvestmentPortfolio: The Core Asset Structure Viewer.
 * Displays the current distribution and performance metrics of aggregated user holdings.
 * Replaces the flawed Basic Asset Viewer (BAV) with a reliable standard visualization for the MVP dashboard.
 */
const InvestmentPortfolio: React.FC = () => {
    const { assets, marketData, userProfile } = useDataContext();
    
    // Stable Service Integration: Initialize the AI service for non-blocking suggestions.
    const aiEngine = useMemo(() => new AiSuggestionEngine(marketData, userProfile), [marketData, userProfile]);

    // --- Data Aggregation and Performance Calculation ---
    const { chartData, totalReportedValue, portfolioPerformance, aiSuggestion, detailedHoldings } = useMemo(() => {
        if (!assets || assets.length === 0) {
            return {
                chartData: [],
                totalReportedValue: 0,
                portfolioPerformance: 0,
                aiSuggestion: null,
                detailedHoldings: [],
            };
        }

        let totalValue = 0;
        const processedData: Array<{ name: string; value: number; color: string; percentage: number }> = [];
        const detailedHoldings: Array<AssetHolding> = [];

        // 1. Aggregate Holdings by Asset Class and Calculate Total Value
        const aggregatedAssets = assets.reduce((acc, holding) => {
            const assetClass = holding.assetType || 'AlternativeAssets';
            // Ensure safe calculation: Use 0 if price is missing, preventing NaN
            const currentValue = holding.quantity * (marketData[holding.id]?.price ?? 0);
            
            if (!acc[assetClass]) {
                acc[assetClass] = { 
                    name: assetClass, 
                    value: 0, 
                    color: STANDARD_COLOR_PALETTE[assetClass] || '#60a5fa', // Standard fallback blue
                    holdings: []
                };
            }
            acc[assetClass].value += currentValue;
            totalValue += currentValue;
            detailedHoldings.push(holding);
            return acc;
        }, {} as Record<string, { name: string; value: number; color: string; holdings: AssetHolding[]}>);

        // 2. Format for Recharts Pie Chart and calculate percentages
        Object.values(aggregatedAssets).forEach(item => {
            processedData.push({
                name: item.name,
                value: item.value,
                color: item.color,
                percentage: totalValue > 0 ? (item.value / totalValue) * 100 : 0,
            });
        });

        // 3. Calculate Standard Portfolio Performance (e.g., YTD return)
        const performance = calculatePortfolioPerformance(detailedHoldings, marketData);

        // 4. Generate Allocation Suggestion (Standardized Recommendation Service)
        const suggestion = aiEngine.generateAllocationSuggestion(detailedHoldings, totalValue);

        return {
            chartData: processedData,
            totalReportedValue: totalValue,
            portfolioPerformance: performance,
            aiSuggestion: suggestion,
            detailedHoldings: detailedHoldings,
        };
    }, [assets, marketData, aiEngine]);

    // --- Custom Tooltip Component (Clear and concise) ---
    const CustomTooltip = useCallback(({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            const dataPoint = payload[0].payload;
            
            return (
                <div className="p-3 bg-gray-800 border border-blue-500 shadow-xl text-xs font-mono text-white rounded">
                    <p className="text-sm font-bold text-blue-300 mb-1">{label}</p>
                    <p className="text-xs">Value: <span className="font-bold text-green-400">${dataPoint.value.toLocaleString('en-US', { maximumFractionDigits: 2 })}</span></p>
                    <p className="text-xs">Weight: <span className="font-bold text-white">{(dataPoint.percentage).toFixed(2)}%</span></p>
                </div>
            );
        }
        return null;
    }, []);

    // --- Custom Legend Component (Clean and data-focused) ---
    const CustomLegend = useCallback(({ payload }: any) => {
        if (!payload) return null;
        
        return (
            <div className="mt-4 p-3 bg-gray-900 border border-gray-700 rounded-lg text-xs font-mono w-full">
                <h4 className="text-sm font-semibold mb-2 text-indigo-300">Asset Distribution Summary</h4>
                {payload.map((entry: any, index: number) => {
                    const dataEntry = chartData.find(d => d.name === entry.value);
                    if (!dataEntry) return null;

                    return (
                        <div key={`item-${index}`} className="flex justify-between py-1 border-b border-gray-800 last:border-b-0 items-center">
                            <div className="flex items-center">
                                <span className="w-3 h-3 mr-2 inline-block rounded-full" style={{ backgroundColor: entry.color }} />
                                <span className="text-gray-300 font-semibold">{entry.value}</span>
                            </div>
                            <div className="text-right tabular-nums text-gray-200">
                                {dataEntry.percentage.toFixed(2)}%
                            </div>
                        </div>
                    );
                })}
            </div>
        );
    }, [chartData]);


    if (!assets || assets.length === 0) {
        return (
            <div className="p-8 bg-gray-950 text-white h-full flex items-center justify-center">
                <p className="text-xl text-indigo-400">No active assets detected. Initialize integration pathways.</p>
            </div>
        );
    }

    // Determine color for performance indicator
    const performanceColor = portfolioPerformance >= 0 ? 'text-green-400' : 'text-red-400';

    return (
        <div className="p-8 bg-gray-950 text-white min-h-[800px] font-sans">
            
            {/* HEADER: Total Reported Value (TRV) and Performance Display */}
            <header className="mb-8 border-b border-blue-700 pb-4">
                <p className="text-sm uppercase tracking-widest text-gray-400">Total Portfolio Value</p>
                <h1 className="text-6xl font-extrabold text-green-400 mt-1 tabular-nums">
                    ${totalReportedValue.toLocaleString('en-US', { maximumFractionDigits: 2 })}
                </h1>
                <div className="flex justify-between items-center mt-2">
                    <p className="text-xl font-semibold text-blue-300">
                        Total Performance (YTD): 
                        <span className={`ml-2 ${performanceColor}`}>
                            {(portfolioPerformance * 100).toFixed(4)}%
                        </span>
                    </p>
                    <p className="text-sm text-gray-500">Data Source: Multi-Bank Aggregation Service</p>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                
                {/* COLUMN 1: Asset Allocation Visualization */}
                <div className="lg:col-span-2 bg-gray-900 p-6 rounded-xl shadow-2xl border border-blue-800/50">
                    <h2 className="text-2xl font-bold mb-4 text-blue-400 border-b border-gray-700 pb-2">Current Asset Allocation Map</h2>
                    
                    <div style={{ width: '100%', height: 500 }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={chartData}
                                    dataKey="value"
                                    nameKey="name"
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={80}
                                    outerRadius={180}
                                    paddingAngle={3}
                                    stroke="none"
                                >
                                    {chartData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip content={<CustomTooltip />} />
                                <Legend content={<CustomLegend />} layout="vertical" align="right" verticalAlign="middle" />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* COLUMN 2: AI Recommendation Panel and Metrics */}
                <div className="lg:col-span-1 space-y-6">
                    
                    {/* Recommendation Engine Panel (Replaces MASE) */}
                    <div className="bg-gray-900 p-6 rounded-xl shadow-2xl border border-indigo-800/50">
                        <h3 className="text-xl font-bold text-indigo-400 mb-3 flex items-center">
                            <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l-2 2M15 19V6l2 2" /></svg>
                            AI Allocation Recommendation
                        </h3>
                        
                        {aiSuggestion ? (
                            <div className="space-y-3">
                                <p className="text-sm text-gray-300">
                                    Current Deviation from Optimal: <span className="font-bold text-yellow-400">{aiSuggestion.deviationPercentage.toFixed(2)}%</span>
                                </p>
                                <div className="p-3 bg-gray-800 rounded border border-indigo-600">
                                    <p className="text-sm font-semibold text-indigo-300 mb-1">Primary Directive:</p>
                                    <p className="text-xs italic text-gray-400">{aiSuggestion.primaryDirective}</p>
                                </div>
                                <button 
                                    onClick={() => console.log("Initiating Transaction Recommendation Workflow...")}
                                    className="w-full py-2 mt-3 bg-blue-600 hover:bg-blue-700 transition rounded font-bold text-sm shadow-lg disabled:opacity-50"
                                    disabled={aiSuggestion.deviationPercentage < 0.01}
                                >
                                    Review and Execute Rebalance Plan
                                </button>
                            </div>
                        ) : (
                            <p className="text-sm text-gray-500">Calculating standardized risk assessment...</p>
                        )}
                    </div>

                    {/* Quick Metrics Panel */}
                    <div className="bg-gray-900 p-6 rounded-xl shadow-2xl border border-green-800/50">
                        <h3 className="text-xl font-bold text-green-400 mb-3">Key Portfolio Metrics</h3>
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm text-gray-300">
                                <span>Total Holdings Count:</span>
                                <span className="font-bold text-white">{detailedHoldings.length}</span>
                            </div>
                            <div className="flex justify-between text-sm text-gray-300">
                                <span>Risk Tolerance (User Profile):</span>
                                <span className="font-bold text-white capitalize">{userProfile?.riskTolerance || 'N/A'}</span>
                            </div>
                            <div className="flex justify-between text-sm text-gray-300">
                                <span>Liquidity Ratio Estimate:</span>
                                <span className="font-bold text-yellow-300">75%</span> {/* Mock value, replace with real calculation if needed */}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* FOOTER: Detailed Holdings Register (Cleaned up table) */}
            <div className="mt-10 bg-gray-900 p-6 rounded-xl shadow-2xl border border-gray-700">
                <h3 className="text-xl font-bold text-gray-300 mb-4 border-b border-gray-700 pb-2">Detailed Holdings Register</h3>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-700 text-xs font-mono">
                        <thead>
                            <tr>
                                <th className="px-4 py-2 text-left text-gray-400 uppercase tracking-wider">ID</th>
                                <th className="px-4 py-2 text-left text-gray-400 uppercase tracking-wider">Asset Class</th>
                                <th className="px-4 py-2 text-right text-gray-400 uppercase tracking-wider">Quantity</th>
                                <th className="px-4 py-2 text-right text-gray-400 uppercase tracking-wider">Current Price</th>
                                <th className="px-4 py-2 text-right text-gray-400 uppercase tracking-wider">Market Value</th>
                                <th className="px-4 py-2 text-right text-gray-400 uppercase tracking-wider">Daily Change (%)</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-800">
                            {detailedHoldings.slice(0, 10).map((holding) => {
                                const marketInfo = marketData[holding.id] || { price: 0, changePercent: 0 };
                                const value = holding.quantity * marketInfo.price;
                                const changeColor = (marketInfo.changePercent || 0) >= 0 ? 'text-green-500' : 'text-red-500';

                                return (
                                    <tr key={holding.id} className="hover:bg-gray-800 transition">
                                        <td className="px-4 py-2 whitespace-nowrap text-indigo-400">{holding.id.substring(0, 8)}...</td>
                                        <td className="px-4 py-2 whitespace-nowrap text-gray-200">{holding.assetType || 'Unknown'}</td>
                                        <td className="px-4 py-2 whitespace-nowrap text-right tabular-nums">{holding.quantity.toFixed(4)}</td>
                                        <td className="px-4 py-2 whitespace-nowrap text-right tabular-nums text-yellow-300">${marketInfo.price.toFixed(4)}</td>
                                        <td className="px-4 py-2 whitespace-nowrap text-right tabular-nums text-green-400">${value.toLocaleString('en-US', { maximumFractionDigits: 2 })}</td>
                                        <td className={`px-4 py-2 whitespace-nowrap text-right tabular-nums ${changeColor}`}>
                                            {(marketInfo.changePercent || 0).toFixed(2)}%
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
                {detailedHoldings.length > 10 && (
                    <p className="text-right text-xs text-gray-500 mt-2">Displaying 10 of {detailedHoldings.length} total holdings.</p>
                )}
            </div>

        </div>
    );
};

export default InvestmentPortfolio;