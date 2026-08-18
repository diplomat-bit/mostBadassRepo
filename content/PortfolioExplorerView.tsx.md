// REPOSITORY SOURCE: diplomat-bit/Citibank_Demo_Business_Inc_Demonstration- | PATH: diplomat-bit-Citibank_Demo_Business_Inc_Demonstration--ab2501d/content/PortfolioExplorerView.tsx.md
================================================================================

import React, { useState, useMemo, useEffect, useCallback, useReducer, createContext, useContext, ReactNode } from 'react';
import { ResponsiveTreeMap } from '@nivo/treemap';
import { ResponsiveLine } from '@nivo/line';
import { ResponsiveSunburst } from '@nivo/sunburst';
import { ResponsiveHeatMap } from '@nivo/heatmap';

// region: --- ICONS (SVG) ---
const LoadingSpinnerIcon = () => (
  <svg width="38" height="38" viewBox="0 0 38 38" xmlns="http://www.w3.org/2000/svg" stroke="#fff">
    <g fill="none" fillRule="evenodd">
      <g transform="translate(1 1)" strokeWidth="2">
        <circle strokeOpacity=".5" cx="18" cy="18" r="18"/>
        <path d="M36 18c0-9.94-8.06-18-18-18">
          <animateTransform attributeName="transform" type="rotate" from="0 18 18" to="360 18 18" dur="1s" repeatCount="indefinite"/>
        </path>
      </g>
    </g>
  </svg>
);

const LightbulbIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
        <path d="M2 6a6 6 0 1 1 10.174 4.31c-.203.196-.359.4-.453.619l-.762 1.769A.5.5 0 0 1 10.5 13h-5a.5.5 0 0 1-.46-.302l-.761-1.77a1.964 1.964 0 0 0-.453-.618A5.984 5.984 0 0 1 2 6zm6-5a5 5 0 0 0-3.479 8.592c.263.254.514.564.676.941L5.83 12h4.342l.632-1.467c.162-.377.413-.687.676-.941A5 5 0 0 0 8 1z"/>
        <path d="M5 14a1 1 0 0 1 1-1h4a1 1 0 1 1 0 2H6a1 1 0 0 1-1-1zm.246-3.437a.5.5 0 0 1-.496-.864l.247-.451a.5.5 0 1 1 .864.496l-.247.451a.5.5 0 0 1-.368.368z"/>
    </svg>
);


// region: --- TYPE DEFINITIONS ---

export type Currency = 'USD' | 'EUR' | 'GBP' | 'JPY' | 'CAD';
export type AssetClass = 'Equities' | 'Fixed Income' | 'Real Estate' | 'Commodities' | 'Digital Assets' | 'Cash Equivalents';
export type Region = 'North America' | 'Europe' | 'Asia Pacific' | 'Latin America' | 'Middle East & Africa' | 'Global';
export type MarketCap = 'Large Cap' | 'Mid Cap' | 'Small Cap' | 'Micro Cap';
export type Sector = 'Technology' | 'Healthcare' | 'Financials' | 'Consumer Discretionary' | 'Consumer Staples' | 'Industrials' | 'Energy' | 'Utilities' | 'Real Estate' | 'Materials' | 'Communication Services';
export type PerformanceTimeframe = '1D' | '1W' | '1M' | '3M' | 'YTD' | '1Y' | '5Y';
export type VisualizationMode = 'Treemap' | 'Sunburst' | 'DataTable' | 'Heatmap';
export type GroupingMode = 'AssetClass' | 'Region' | 'Sector' | 'MarketCap';

export interface HistoricalDataPoint {
  date: string;
  value: number;
}

export interface NewsArticle {
    title: string;
    source: string;
    timestamp: string;
    sentiment: 'positive' | 'negative' | 'neutral';
    aiSummary?: string;
}

export interface Asset {
  id: string;
  ticker: string;
  name: string;
  assetClass: AssetClass;
  region: Region;
  sector: Sector;
  marketCap: MarketCap;
  currency: Currency;
  currentPrice: number;
  marketValue: number;
  costBasis: number;
  quantity: number;
  performance: Record<PerformanceTimeframe, number>;
  historicalData: HistoricalDataPoint[];
  analystRating: {
    buy: number;
    hold: number;
    sell: number;
  };
  newsFeed: NewsArticle[];
  esgScore: {
      environmental: number;
      social: number;
      governance: number;
      total: number;
  };
  riskMetrics: {
      beta: number;
      sharpeRatio: number;
      volatility: number;
  };
  aiInsight: string; // AI-generated summary/insight for this asset
}

export interface TreemapNode {
  id: string;
  name: string;
  value: number;
  color: string;
  performance: number;
  children?: TreemapNode[];
  data: Asset | {};
}

export interface FilterState {
  assetClasses: Set<AssetClass>;
  regions: Set<Region>;
  sectors: Set<Sector>;
  marketCaps: Set<MarketCap>;
  searchTerm: string;
  performanceRange: [number, number];
  esgMinScore: number;
}

export type FilterAction =
  | { type: 'TOGGLE_ASSET_CLASS'; payload: AssetClass }
  | { type: 'TOGGLE_REGION'; payload: Region }
  | { type: 'TOGGLE_SECTOR'; payload: Sector }
  | { type: 'TOGGLE_MARKET_CAP'; payload: MarketCap }
  | { type: 'SET_SEARCH_TERM'; payload: string }
  | { type: 'SET_PERFORMANCE_RANGE'; payload: [number, number] }
  | { type: 'SET_ESG_MIN_SCORE'; payload: number }
  | { type: 'RESET_FILTERS' };

export interface PortfolioExplorerSettings {
    currency: Currency;
    colorTheme: 'performance' | 'sector' | 'region';
    animationStiffness: number;
    showBreadcrumbs: boolean;
}

// endregion: --- MOCK DATA GENERATION ---

const MOCK_ASSET_CLASSES: AssetClass[] = ['Equities', 'Fixed Income', 'Real Estate', 'Commodities', 'Digital Assets', 'Cash Equivalents'];
const MOCK_REGIONS: Region[] = ['North America', 'Europe', 'Asia Pacific', 'Latin America', 'Middle East & Africa'];
const MOCK_SECTORS: Sector[] = ['Technology', 'Healthcare', 'Financials', 'Consumer Discretionary', 'Consumer Staples', 'Industrials', 'Energy', 'Utilities', 'Real Estate', 'Materials', 'Communication Services'];
const MOCK_MARKET_CAPS: MarketCap[] = ['Large Cap', 'Mid Cap', 'Small Cap'];
const MOCK_CURRENCIES: Currency[] = ['USD'];

const MOCK_TICKERS = {
    'Equities': ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'TSLA', 'NVDA', 'JPM', 'JNJ', 'V', 'PG', 'XOM', 'UNH', 'HD', 'MA', 'BAC', 'DIS', 'PFE', 'KO', 'PEP', 'WMT', 'INTC', 'CSCO', 'CRM', 'ADBE', 'NFLX', 'ORCL', 'T', 'VZ', 'CVX', 'ABBV'],
    'Fixed Income': ['BND', 'AGG', 'LQD', 'HYG', 'TIP', 'IEF', 'TLT', 'MUB', 'SHY', 'VCIT'],
    'Real Estate': ['VNQ', 'IYR', 'O', 'SPG', 'PLD', 'AMT', 'CCI', 'EQIX', 'DLR', 'WELL'],
    'Commodities': ['GLD', 'SLV', 'USO', 'DBC', 'CORN', 'WEAT', 'UNG', 'DBA', 'GSG', 'IAU'],
    'Digital Assets': ['BTC', 'ETH', 'SOL', 'ADA', 'XRP', 'DOT', 'DOGE', 'AVAX', 'MATIC', 'LINK'],
    'Cash Equivalents': ['BIL', 'SHV', 'MINT', 'JPST', 'USFR', 'GBIL', 'SGOV', 'ICSH', 'NEAR', 'VUSB']
};

export const generateRandomString = (length: number): string => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  return Array.from({ length }, () => characters.charAt(Math.floor(Math.random() * characters.length))).join('');
};

export const generateHistoricalData = (days: number, initialValue: number): HistoricalDataPoint[] => {
  const data: HistoricalDataPoint[] = [];
  let currentValue = initialValue;
  for (let i = days; i > 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const fluctuation = (Math.random() - 0.49) * (initialValue / 50);
    currentValue += fluctuation;
    if (currentValue < 0) currentValue = 0;
    data.push({ date: date.toISOString().split('T')[0], value: parseFloat(currentValue.toFixed(2)) });
  }
  return data;
};

export const generateMockAsset = (id: string): Asset => {
  const assetClass = MOCK_ASSET_CLASSES[Math.floor(Math.random() * MOCK_ASSET_CLASSES.length)];
  const availableTickers = MOCK_TICKERS[assetClass] || ['GENERIC'];
  const ticker = availableTickers[Math.floor(Math.random() * availableTickers.length)] + `-${generateRandomString(2)}`;
  const quantity = Math.random() * 1000 + 10;
  const currentPrice = Math.random() * 500 + 5;
  const marketValue = quantity * currentPrice;
  const costBasis = marketValue * (1 + (Math.random() - 0.5) * 0.4); // +/- 20% cost basis
  const oneDayPerf = (Math.random() - 0.5) * 0.05; // +/- 2.5%

  return {
    id,
    ticker,
    name: `${ticker} Company Inc.`,
    assetClass,
    region: MOCK_REGIONS[Math.floor(Math.random() * MOCK_REGIONS.length)],
    sector: MOCK_SECTORS[Math.floor(Math.random() * MOCK_SECTORS.length)],
    marketCap: MOCK_MARKET_CAPS[Math.floor(Math.random() * MOCK_MARKET_CAPS.length)],
    currency: MOCK_CURRENCIES[Math.floor(Math.random() * MOCK_CURRENCIES.length)],
    currentPrice,
    marketValue,
    costBasis,
    quantity,
    performance: {
      '1D': oneDayPerf,
      '1W': (Math.random() - 0.5) * 0.1,  // +/- 5%
      '1M': (Math.random() - 0.5) * 0.2,  // +/- 10%
      '3M': (Math.random() - 0.5) * 0.3,  // +/- 15%
      'YTD': (Math.random() - 0.5) * 0.4, // +/- 20%
      '1Y': (Math.random() - 0.5) * 0.6,  // +/- 30%
      '5Y': (Math.random() - 0.2) * 2.0,  // more likely positive over 5Y
    },
    historicalData: generateHistoricalData(365, currentPrice),
    analystRating: {
        buy: Math.floor(Math.random() * 20),
        hold: Math.floor(Math.random() * 15),
        sell: Math.floor(Math.random() * 5),
    },
    newsFeed: Array.from({ length: Math.floor(Math.random() * 5) + 3 }, () => ({
        title: `News article about ${ticker}`,
        source: ['Reuters', 'Bloomberg', 'WSJ', 'Financial Times'][Math.floor(Math.random() * 4)],
        timestamp: new Date(Date.now() - Math.random() * 1000 * 60 * 60 * 24 * 7).toISOString(),
        sentiment: (['positive', 'negative', 'neutral'] as const)[Math.floor(Math.random() * 3)],
    })),
    esgScore: {
        environmental: Math.floor(Math.random() * 100),
        social: Math.floor(Math.random() * 100),
        governance: Math.floor(Math.random() * 100),
        total: Math.floor(Math.random() * 100),
    },
    riskMetrics: {
        beta: parseFloat((Math.random() * 1.5 + 0.5).toFixed(2)), // 0.5 to 2.0
        sharpeRatio: parseFloat((Math.random() * 2 - 0.5).toFixed(2)), // -0.5 to 1.5
        volatility: parseFloat((Math.random() * 0.3 + 0.1).toFixed(2)), // 10% to 40%
    },
    aiInsight: `This ${ticker} holding shows strong momentum, outperforming its sector peers over the last quarter. However, its high beta (${(Math.random() * 1.5 + 0.5).toFixed(2)}) suggests higher volatility compared to the market. Recent positive news sentiment may indicate continued short-term growth potential.`
  };
};

export const generateMockPortfolio = (numAssets: number = 150): Asset[] => {
  return Array.from({ length: numAssets }, (_, i) => generateMockAsset(`asset-${i}`));
};


// endregion: --- UTILITY FUNCTIONS ---

export const formatCurrency = (value: number, currency: Currency = 'USD'): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
};

export const formatPercentage = (value: number): string => {
  return `${(value * 100).toFixed(2)}%`;
};

export const getPerformanceColor = (performance: number): string => {
  if (performance > 0.01) return '#2e7d32'; // Strong green
  if (performance > 0) return '#66bb6a'; // Light green
  if (performance < -0.01) return '#c62828'; // Strong red
  if (performance < 0) return '#ef5350'; // Light red
  return '#757575'; // Neutral grey
};

// endregion: --- STYLES ---

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    backgroundColor: '#121212',
    color: '#E0E0E0',
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    overflow: 'hidden',
  },
  mainContent: {
    display: 'flex',
    flexGrow: 1,
    overflow: 'hidden',
  },
  header: {
    padding: '16px 24px',
    backgroundColor: '#1E1E1E',
    borderBottom: '1px solid #333',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexShrink: 0,
  },
  headerTitle: {
    fontSize: '24px',
    fontWeight: 600,
    margin: 0,
    color: '#FFFFFF'
  },
  summaryBar: {
    display: 'flex',
    gap: '32px',
  },
  summaryItem: {
    textAlign: 'center',
  },
  summaryLabel: {
    fontSize: '12px',
    color: '#B0B0B0',
    textTransform: 'uppercase',
  },
  summaryValue: {
    fontSize: '18px',
    fontWeight: 500,
    color: '#FFFFFF'
  },
  filterPanel: {
    width: '280px',
    backgroundColor: '#1E1E1E',
    padding: '20px',
    overflowY: 'auto',
    borderRight: '1px solid #333',
    flexShrink: 0,
  },
  filterGroup: {
    marginBottom: '24px',
  },
  filterTitle: {
    fontSize: '14px',
    fontWeight: 600,
    color: '#FFFFFF',
    marginBottom: '12px',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    borderBottom: '1px solid #444',
    paddingBottom: '8px',
  },
  checkboxLabel: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '8px',
    fontSize: '14px',
    cursor: 'pointer',
  },
  checkboxInput: {
    marginRight: '8px',
  },
  searchInput: {
    width: '100%',
    padding: '8px',
    backgroundColor: '#333',
    border: '1px solid #555',
    borderRadius: '4px',
    color: '#E0E0E0',
    boxSizing: 'border-box',
  },
  visualizationContainer: {
    flexGrow: 1,
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
  },
  assetDetailPanel: {
    width: '350px',
    backgroundColor: '#1E1E1E',
    overflowY: 'auto',
    borderLeft: '1px solid #333',
    flexShrink: 0,
    display: 'flex',
    flexDirection: 'column'
  },
  assetDetailContent: {
    padding: '20px',
  },
  assetDetailHeader: {
    borderBottom: '1px solid #444',
    paddingBottom: '12px',
    marginBottom: '16px',
  },
  assetDetailTicker: {
    fontSize: '22px',
    fontWeight: 'bold',
    margin: 0,
    color: '#FFF'
  },
  assetDetailName: {
    fontSize: '14px',
    color: '#B0B0B0',
    margin: '4px 0 0',
  },
  assetDetailSection: {
    marginBottom: '20px',
  },
  assetDetailSectionTitle: {
    fontSize: '14px',
    fontWeight: 600,
    color: '#FFFFFF',
    marginBottom: '10px',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  assetDetailRow: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '14px',
    marginBottom: '8px',
  },
  assetDetailLabel: {
    color: '#B0B0B0',
  },
  assetDetailValue: {
    color: '#FFFFFF',
    fontWeight: 500,
  },
  chartContainer: {
    height: '200px',
    marginTop: '16px',
  },
  viewControls: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '10px',
    padding: '10px 20px',
    backgroundColor: '#252525',
    borderBottom: '1px solid #333',
    flexWrap: 'wrap',
  },
  viewButton: {
    padding: '8px 16px',
    border: '1px solid #555',
    backgroundColor: 'transparent',
    color: '#B0B0B0',
    cursor: 'pointer',
    borderRadius: '4px',
    transition: 'all 0.2s ease',
  },
  activeViewButton: {
    backgroundColor: '#007AFF',
    color: '#FFFFFF',
    borderColor: '#007AFF',
  },
  dataTable: {
      width: '100%',
      borderCollapse: 'collapse',
      fontSize: '14px',
  },
  dataTableHead: {
      backgroundColor: '#333',
      position: 'sticky',
      top: 0,
  },
  dataTableTh: {
      padding: '12px',
      textAlign: 'left',
      borderBottom: '1px solid #444',
      cursor: 'pointer',
  },
  dataTableTd: {
      padding: '12px',
      borderBottom: '1px solid #2a2a2a',
  },
  dataTableRow: {
      transition: 'background-color 0.2s ease',
      cursor: 'pointer',
  },
  dataTableRowHover: {
      backgroundColor: '#252525',
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(18, 18, 18, 0.8)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
    gap: '20px',
    fontSize: '24px',
    color: '#FFF',
  },
  tooltip: {
      background: '#2a2a2a',
      padding: '12px',
      border: '1px solid #444',
      borderRadius: '4px',
      color: '#FFF',
      fontSize: '14px'
  },
  tabsContainer: {
      display: 'flex',
      borderBottom: '1px solid #333',
      flexShrink: 0
  },
  tabButton: {
      padding: '12px 16px',
      border: 'none',
      background: 'none',
      color: '#B0B0B0',
      cursor: 'pointer',
      fontSize: '14px',
      borderBottom: '2px solid transparent',
  },
  activeTabButton: {
      color: '#FFFFFF',
      borderBottom: '2px solid #007AFF',
  },
  aiInsightCard: {
    background: 'rgba(0, 122, 255, 0.1)',
    borderLeft: '3px solid #007AFF',
    padding: '12px',
    borderRadius: '4px',
    fontSize: '13px',
    lineHeight: 1.5,
    margin: '16px 0',
  }
};

// endregion: --- FILTER LOGIC (useReducer) ---

export const initialFilterState: FilterState = {
  assetClasses: new Set(MOCK_ASSET_CLASSES),
  regions: new Set(MOCK_REGIONS),
  sectors: new Set(MOCK_SECTORS),
  marketCaps: new Set(MOCK_MARKET_CAPS),
  searchTerm: '',
  performanceRange: [-1, 1],
  esgMinScore: 0,
};

export const filterReducer = (state: FilterState, action: FilterAction): FilterState => {
  const toggleItem = <T>(set: Set<T>, item: T) => {
    const newSet = new Set(set);
    if (newSet.has(item)) {
      newSet.delete(item);
    } else {
      newSet.add(item);
    }
    return newSet;
  };

  switch (action.type) {
    case 'TOGGLE_ASSET_CLASS':
      return { ...state, assetClasses: toggleItem(state.assetClasses, action.payload) };
    case 'TOGGLE_REGION':
      return { ...state, regions: toggleItem(state.regions, action.payload) };
    case 'TOGGLE_SECTOR':
      return { ...state, sectors: toggleItem(state.sectors, action.payload) };
    case 'TOGGLE_MARKET_CAP':
        return { ...state, marketCaps: toggleItem(state.marketCaps, action.payload) };
    case 'SET_SEARCH_TERM':
      return { ...state, searchTerm: action.payload };
    case 'SET_PERFORMANCE_RANGE':
      return { ...state, performanceRange: action.payload };
    case 'SET_ESG_MIN_SCORE':
        return { ...state, esgMinScore: action.payload };
    case 'RESET_FILTERS':
      return initialFilterState;
    default:
      return state;
  }
};

// endregion: --- CONTEXT FOR SETTINGS ---
export const PortfolioSettingsContext = createContext<PortfolioExplorerSettings>({
    currency: 'USD',
    colorTheme: 'performance',
    animationStiffness: 90,
    showBreadcrumbs: true,
});

// region: --- SUB-COMPONENTS ---

export const SummaryHeader: React.FC<{ assets: Asset[]; timeframe: PerformanceTimeframe }> = React.memo(({ assets, timeframe }) => {
    const { currency } = useContext(PortfolioSettingsContext);

    const summary = useMemo(() => {
        if (!assets.length) {
            return { totalValue: 0, totalCost: 0, overallChange: 0, overallReturn: 0 };
        }
        const totalValue = assets.reduce((sum, asset) => sum + asset.marketValue, 0);
        const totalCost = assets.reduce((sum, asset) => sum + asset.costBasis, 0);
        const weightedPerf = assets.reduce((sum, asset) => sum + asset.performance[timeframe] * asset.marketValue, 0);
        const overallChange = totalValue > 0 ? weightedPerf / totalValue : 0;
        const overallReturn = totalValue - totalCost;
        return { totalValue, totalCost, overallChange, overallReturn };
    }, [assets, timeframe]);
    
    const perfColor = getPerformanceColor(summary.overallChange);
    const returnColor = getPerformanceColor(summary.overallReturn / summary.totalCost);

    return (
        <div style={styles.summaryBar}>
            <div style={styles.summaryItem}>
                <div style={styles.summaryLabel}>Total Value</div>
                <div style={styles.summaryValue}>{formatCurrency(summary.totalValue, currency)}</div>
            </div>
            <div style={styles.summaryItem}>
                <div style={styles.summaryLabel}>Total Return</div>
                <div style={{...styles.summaryValue, color: returnColor }}>
                    {formatCurrency(summary.overallReturn, currency)}
                </div>
            </div>
            <div style={styles.summaryItem}>
                <div style={styles.summaryLabel}>Performance ({timeframe})</div>
                <div style={{...styles.summaryValue, color: perfColor }}>{formatPercentage(summary.overallChange)}</div>
            </div>
            <div style={styles.summaryItem}>
                <div style={styles.summaryLabel}>Asset Count</div>
                <div style={styles.summaryValue}>{assets.length}</div>
            </div>
        </div>
    );
});

export const FilterCheckboxGroup: React.FC<{ title: string; options: readonly string[]; selected: Set<string>; onToggle: (option: any) => void; }> = React.memo(({ title, options, selected, onToggle }) => (
    <div style={styles.filterGroup}>
        <h3 style={styles.filterTitle}>{title}</h3>
        {options.map(option => (
            <label key={option} style={styles.checkboxLabel}>
                <input
                    type="checkbox"
                    style={styles.checkboxInput}
                    checked={selected.has(option)}
                    onChange={() => onToggle(option)}
                />
                {option}
            </label>
        ))}
    </div>
));

export const FilterPanel: React.FC<{ dispatch: React.Dispatch<FilterAction>; filterState: FilterState }> = React.memo(({ dispatch, filterState }) => {
    return (
        <div style={styles.filterPanel}>
            <div style={styles.filterGroup}>
                <h3 style={styles.filterTitle}>Search</h3>
                <input
                    type="text"
                    placeholder="Search by name or ticker..."
                    style={styles.searchInput}
                    value={filterState.searchTerm}
                    onChange={(e) => dispatch({ type: 'SET_SEARCH_TERM', payload: e.target.value })}
                />
            </div>

            <FilterCheckboxGroup
                title="Asset Class"
                options={MOCK_ASSET_CLASSES}
                selected={filterState.assetClasses}
                onToggle={(option) => dispatch({ type: 'TOGGLE_ASSET_CLASS', payload: option })}
            />
            <FilterCheckboxGroup
                title="Region"
                options={MOCK_REGIONS}
                selected={filterState.regions}
                onToggle={(option) => dispatch({ type: 'TOGGLE_REGION', payload: option })}
            />
            <FilterCheckboxGroup
                title="Sector"
                options={MOCK_SECTORS}
                selected={filterState.sectors}
                onToggle={(option) => dispatch({ type: 'TOGGLE_SECTOR', payload: option })}
            />
             <FilterCheckboxGroup
                title="Market Cap"
                options={MOCK_MARKET_CAPS}
                selected={filterState.marketCaps}
                onToggle={(option) => dispatch({ type: 'TOGGLE_MARKET_CAP', payload: option })}
            />

            <div style={styles.filterGroup}>
                <h3 style={styles.filterTitle}>ESG Score (min)</h3>
                <input
                    type="range"
                    min="0"
                    max="100"
                    value={filterState.esgMinScore}
                    onChange={(e) => dispatch({ type: 'SET_ESG_MIN_SCORE', payload: parseInt(e.target.value, 10)})}
                    style={{width: '100%'}}
                />
                <div style={{textAlign: 'center', fontSize: '14px'}}>{filterState.esgMinScore}</div>
            </div>
            
            <button onClick={() => dispatch({type: 'RESET_FILTERS'})} style={{...styles.viewButton, width: '100%'}}>
                Reset All Filters
            </button>
        </div>
    );
});

export const HistoricalPriceChart: React.FC<{ data: HistoricalDataPoint[], assetName: string }> = React.memo(({ data, assetName }) => {
  const chartData = [{
    id: assetName,
    data: data.map(d => ({ x: d.date, y: d.value })),
  }];

  return (
    <div style={styles.chartContainer}>
      <ResponsiveLine
        data={chartData}
        margin={{ top: 10, right: 10, bottom: 40, left: 50 }}
        xScale={{ type: 'time', format: '%Y-%m-%d', useUTC: false, precision: 'day' }}
        xFormat="time:%Y-%m-%d"
        yScale={{ type: 'linear', min: 'auto', max: 'auto', stacked: false, reverse: false }}
        axisTop={null}
        axisRight={null}
        axisBottom={{
          format: '%b %d',
          tickValues: 'every 2 months',
          legend: 'Date',
          legendOffset: 36,
          legendPosition: 'middle',
        }}
        axisLeft={{
          legend: 'Price',
          legendOffset: -40,
          legendPosition: 'middle',
        }}
        enableGridX={false}
        colors={['#007AFF']}
        pointSize={4}
        pointColor={{ theme: 'background' }}
        pointBorderWidth={2}
        pointBorderColor={{ from: 'serieColor' }}
        useMesh={true}
        theme={{
          textColor: '#B0B0B0',
          fontSize: 12,
          axis: {
            domain: { line: { stroke: '#555' } },
            legend: { text: { fill: '#B0B0B0' } },
            ticks: { line: { stroke: '#555' }, text: { fill: '#B0B0B0' } },
          },
          grid: { line: { stroke: '#333' } },
          tooltip: {
            container: {
              background: '#2a2a2a',
              color: '#FFF',
            },
          },
        }}
      />
    </div>
  );
});

type AssetDetailTab = 'overview' | 'performance' | 'ai_insights';

export const AssetDetailPanel: React.FC<{ asset: Asset | null }> = React.memo(({ asset }) => {
    const [activeTab, setActiveTab] = useState<AssetDetailTab>('overview');
    
    useEffect(() => {
        // Reset to overview tab when a new asset is selected
        setActiveTab('overview');
    }, [asset]);
    
    if (!asset) {
        return <div style={{...styles.assetDetailPanel, padding: '20px' }}>Select an asset to see details.</div>;
    }

    const { currency } = useContext(PortfolioSettingsContext);
    
    const renderTabContent = () => {
        switch (activeTab) {
            case 'overview':
                return <>
                    <div style={styles.assetDetailSection}>
                        <h3 style={styles.assetDetailSectionTitle}>Key Information</h3>
                        <div style={styles.assetDetailRow}><span style={styles.assetDetailLabel}>Asset Class</span><span style={styles.assetDetailValue}>{asset.assetClass}</span></div>
                        <div style={styles.assetDetailRow}><span style={styles.assetDetailLabel}>Region</span><span style={styles.assetDetailValue}>{asset.region}</span></div>
                        <div style={styles.assetDetailRow}><span style={styles.assetDetailLabel}>Sector</span><span style={styles.assetDetailValue}>{asset.sector}</span></div>
                        <div style={styles.assetDetailRow}><span style={styles.assetDetailLabel}>Market Cap</span><span style={styles.assetDetailValue}>{asset.marketCap}</span></div>
                    </div>
                    <div style={styles.assetDetailSection}>
                        <h3 style={styles.assetDetailSectionTitle}>Market Data</h3>
                        <div style={styles.assetDetailRow}><span style={styles.assetDetailLabel}>Current Price</span><span style={styles.assetDetailValue}>{formatCurrency(asset.currentPrice, currency)}</span></div>
                        <div style={styles.assetDetailRow}><span style={styles.assetDetailLabel}>Market Value</span><span style={styles.assetDetailValue}>{formatCurrency(asset.marketValue, currency)}</span></div>
                        <div style={styles.assetDetailRow}><span style={styles.assetDetailLabel}>Quantity</span><span style={styles.assetDetailValue}>{asset.quantity.toFixed(4)}</span></div>
                        <div style={styles.assetDetailRow}><span style={styles.assetDetailLabel}>Cost Basis</span><span style={styles.assetDetailValue}>{formatCurrency(asset.costBasis, currency)}</span></div>
                    </div>
                </>;
            case 'performance':
                return <>
                    <div style={styles.assetDetailSection}>
                        <h3 style={styles.assetDetailSectionTitle}>Performance</h3>
                        {Object.entries(asset.performance).map(([timeframe, value]) => (
                            <div style={styles.assetDetailRow} key={timeframe}>
                                <span style={styles.assetDetailLabel}>{timeframe}</span>
                                <span style={{ ...styles.assetDetailValue, color: getPerformanceColor(value) }}>{formatPercentage(value)}</span>
                            </div>
                        ))}
                    </div>
                    <div style={styles.assetDetailSection}>
                        <h3 style={styles.assetDetailSectionTitle}>1Y Historical Performance</h3>
                        <HistoricalPriceChart data={asset.historicalData} assetName={asset.name} />
                    </div>
                </>;
            case 'ai_insights':
                return <>
                    <div style={styles.assetDetailSection}>
                        <h3 style={styles.assetDetailSectionTitle}>AI-Powered Summary</h3>
                        <div style={styles.aiInsightCard}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                                <LightbulbIcon /> <strong>Automated Analysis</strong>
                            </div>
                            {asset.aiInsight}
                        </div>
                    </div>
                     <div style={styles.assetDetailSection}>
                        <h3 style={styles.assetDetailSectionTitle}>Risk Analysis</h3>
                        <div style={styles.assetDetailRow}><span style={styles.assetDetailLabel}>Beta</span><span style={styles.assetDetailValue}>{asset.riskMetrics.beta}</span></div>
                        <div style={styles.assetDetailRow}><span style={styles.assetDetailLabel}>Sharpe Ratio</span><span style={styles.assetDetailValue}>{asset.riskMetrics.sharpeRatio}</span></div>
                        <div style={styles.assetDetailRow}><span style={styles.assetDetailLabel}>Volatility (1Y)</span><span style={styles.assetDetailValue}>{formatPercentage(asset.riskMetrics.volatility)}</span></div>
                    </div>
                    <div style={styles.assetDetailSection}>
                        <h3 style={styles.assetDetailSectionTitle}>ESG Profile</h3>
                        <div style={styles.assetDetailRow}><span style={styles.assetDetailLabel}>Total Score</span><span style={styles.assetDetailValue}>{asset.esgScore.total}/100</span></div>
                        <div style={styles.assetDetailRow}><span style={styles.assetDetailLabel}>Environmental</span><span style={styles.assetDetailValue}>{asset.esgScore.environmental}/100</span></div>
                        <div style={styles.assetDetailRow}><span style={styles.assetDetailLabel}>Social</span><span style={styles.assetDetailValue}>{asset.esgScore.social}/100</span></div>
                        <div style={styles.assetDetailRow}><span style={styles.assetDetailLabel}>Governance</span><span style={styles.assetDetailValue}>{asset.esgScore.governance}/100</span></div>
                    </div>
                </>;
        }
    };
    
    return (
        <div style={styles.assetDetailPanel}>
            <div style={{padding: '20px 20px 0 20px'}}>
                <div style={styles.assetDetailHeader}>
                    <h2 style={styles.assetDetailTicker}>{asset.ticker}</h2>
                    <p style={styles.assetDetailName}>{asset.name}</p>
                </div>
            </div>
            <div style={styles.tabsContainer}>
                <button onClick={() => setActiveTab('overview')} style={{...styles.tabButton, ...(activeTab === 'overview' ? styles.activeTabButton : {})}}>Overview</button>
                <button onClick={() => setActiveTab('performance')} style={{...styles.tabButton, ...(activeTab === 'performance' ? styles.activeTabButton : {})}}>Performance</button>
                <button onClick={() => setActiveTab('ai_insights')} style={{...styles.tabButton, ...(activeTab === 'ai_insights' ? styles.activeTabButton : {})}}>AI Insights</button>
            </div>
            <div style={styles.assetDetailContent}>
                {renderTabContent()}
            </div>
        </div>
    );
});

export const TreemapVisualization: React.FC<{ 
    data: TreemapNode; 
    onNodeClick: (node: any) => void;
    timeframe: PerformanceTimeframe;
}> = React.memo(({ data, onNodeClick, timeframe }) => {
    const { animationStiffness } = useContext(PortfolioSettingsContext);
    
    return (
        <ResponsiveTreeMap
            data={data}
            identity="id"
            value="value"
            valueFormat=".02s"
            margin={{ top: 10, right: 10, bottom: 10, left: 10 }}
            labelSkipSize={12}
            labelTextColor={{ from: 'color', modifiers: [['darker', 2.5]] }}
            parentLabelPosition="left"
            parentLabelTextColor={{ from: 'color', modifiers: [['darker', 2]] }}
            borderColor={{ from: 'color', modifiers: [['darker', 0.2]] }}
            theme={{
                tooltip: {
                    container: {
                        background: '#2a2a2a',
                        color: '#FFF',
                        border: '1px solid #444'
                    },
                },
            }}
            colors={node => node.data.color}
            animate={true}
            motionStiffness={animationStiffness}
            motionDamping={12}
            onClick={onNodeClick}
            tooltip={({ node }) => (
                <div style={styles.tooltip}>
                    <strong>{node.data.name}</strong>
                    <br />
                    Value: {formatCurrency(node.data.value)}
                    <br />
                    Performance ({timeframe}): <span style={{ color: getPerformanceColor(node.data.performance) }}>{formatPercentage(node.data.performance)}</span>
                </div>
            )}
        />
    );
});

export const SunburstVisualization: React.FC<{ 
    data: TreemapNode; 
    onNodeClick: (node: any) => void;
    timeframe: PerformanceTimeframe;
}> = React.memo(({ data, onNodeClick, timeframe }) => {
    const { animationStiffness } = useContext(PortfolioSettingsContext);

    return (
        <ResponsiveSunburst
            data={data}
            margin={{ top: 10, right: 10, bottom: 10, left: 10 }}
            id="name"
            value="value"
            cornerRadius={3}
            borderColor={{ theme: 'background' }}
            colors={node => node.data.color}
            childColor={{ from: 'color', modifiers: [['brighter', 0.1]] }}
            enableArcLabels={true}
            arcLabelsSkipAngle={10}
            arcLabelsTextColor={{ from: 'color', modifiers: [['darker', 1.4]] }}
            motionStiffness={animationStiffness}
            motionDamping={15}
            onClick={onNodeClick}
            theme={{
                tooltip: {
                    container: {
                        background: '#2a2a2a',
                        color: '#FFF',
                        border: '1px solid #444'
                    },
                },
            }}
            tooltip={({ id, value, data }) => (
                 <div style={styles.tooltip}>
                    <strong>{id}</strong>
                    <br />
                    Value: {formatCurrency(value)}
                    <br />
                    Performance ({timeframe}): <span style={{ color: getPerformanceColor((data as any).performance) }}>{formatPercentage((data as any).performance)}</span>
                </div>
            )}
        />
    );
});


export const DataTableVisualization: React.FC<{ 
    assets: Asset[]; 
    onAssetSelect: (asset: Asset) => void;
}> = React.memo(({ assets, onAssetSelect }) => {
    const [sortConfig, setSortConfig] = useState<{ key: keyof Asset | null; direction: 'ascending' | 'descending' }>({ key: 'marketValue', direction: 'descending' });
    const [hoveredRow, setHoveredRow] = useState<string | null>(null);

    const sortedAssets = useMemo(() => {
        let sortableItems = [...assets];
        if (sortConfig.key !== null) {
            sortableItems.sort((a, b) => {
                const aValue = a[sortConfig.key!];
                const bValue = b[sortConfig.key!];

                if (typeof aValue === 'number' && typeof bValue === 'number') {
                    if (aValue < bValue) return sortConfig.direction === 'ascending' ? -1 : 1;
                    if (aValue > bValue) return sortConfig.direction === 'ascending' ? 1 : -1;
                } else if (typeof aValue === 'string' && typeof bValue === 'string') {
                    if (aValue.localeCompare(bValue) < 0) return sortConfig.direction === 'ascending' ? -1 : 1;
                    if (aValue.localeCompare(bValue) > 0) return sortConfig.direction === 'ascending' ? 1 : -1;
                }
                return 0;
            });
        }
        return sortableItems;
    }, [assets, sortConfig]);

    const requestSort = (key: keyof Asset) => {
        let direction: 'ascending' | 'descending' = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    const getSortIndicator = (key: keyof Asset) => {
        if (sortConfig.key !== key) return null;
        return sortConfig.direction === 'ascending' ? ' ▲' : ' ▼';
    };

    const headers: { key: keyof Asset; label: string }[] = [
        { key: 'ticker', label: 'Ticker' },
        { key: 'name', label: 'Name' },
        { key: 'assetClass', label: 'Asset Class' },
        { key: 'marketValue', label: 'Market Value' },
        { key: 'currentPrice', label: 'Price' },
    ];

    return (
        <div style={{ overflow: 'auto', height: '100%' }}>
            <table style={styles.dataTable}>
                <thead style={styles.dataTableHead}>
                    <tr>
                        {headers.map(header => (
                            <th key={header.key} style={styles.dataTableTh} onClick={() => requestSort(header.key)}>
                                {header.label}
                                {getSortIndicator(header.key)}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {sortedAssets.map(asset => (
                        <tr 
                          key={asset.id} 
                          style={{
                              ...styles.dataTableRow,
                              ...(hoveredRow === asset.id ? styles.dataTableRowHover : {})
                          }} 
                          onClick={() => onAssetSelect(asset)}
                          onMouseEnter={() => setHoveredRow(asset.id)}
                          onMouseLeave={() => setHoveredRow(null)}
                        >
                            <td style={styles.dataTableTd}>{asset.ticker}</td>
                            <td style={styles.dataTableTd}>{asset.name}</td>
                            <td style={styles.dataTableTd}>{asset.assetClass}</td>
                            <td style={styles.dataTableTd}>{formatCurrency(asset.marketValue)}</td>
                            <td style={styles.dataTableTd}>{formatCurrency(asset.currentPrice)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
});

export const HeatmapVisualization: React.FC<{ assets: Asset[], groupingMode: GroupingMode, timeframe: PerformanceTimeframe }> = React.memo(({ assets, groupingMode, timeframe }) => {
    const heatmapData = useMemo(() => {
        const groups: { [key: string]: { totalValue: number, weightedPerf: number, count: number } } = {};
        
        assets.forEach(asset => {
            const groupKey = asset[groupingMode.charAt(0).toLowerCase() + groupingMode.slice(1) as keyof Asset] as string;
            if (!groups[groupKey]) {
                groups[groupKey] = { totalValue: 0, weightedPerf: 0, count: 0 };
            }
            groups[groupKey].totalValue += asset.marketValue;
            groups[groupKey].weightedPerf += asset.performance[timeframe] * asset.marketValue;
            groups[groupKey].count += 1;
        });

        const data = Object.entries(groups).map(([key, value]) => ({
            id: key,
            performance: value.totalValue > 0 ? value.weightedPerf / value.totalValue : 0
        }));

        if (data.length === 0) return [];
        
        return [{
            id: 'Performance',
            data: data.map(d => ({ x: d.id, y: d.performance }))
        }];

    }, [assets, groupingMode, timeframe]);

    if (!heatmapData || heatmapData.length === 0 || heatmapData[0].data.length === 0) {
        return <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%'}}>Not enough data for this view.</div>
    }

    return (
        <ResponsiveHeatMap
            data={heatmapData}
            keys={Array.from(new Set(heatmapData.flatMap(d => d.data.map(i => i.x as string))))}
            indexBy="id"
            margin={{ top: 60, right: 60, bottom: 60, left: 60 }}
            forceSquare={false}
            axisTop={{
                tickSize: 5,
                tickPadding: 5,
                tickRotation: -45,
                legend: groupingMode,
                legendOffset: -50
            }}
            colors={{
                type: 'diverging',
                scheme: 'red_green',
                divergeAt: 0.5,
                minValue: -0.05,
                maxValue: 0.05,
            }}
            emptyColor="#555"
            cellComponent="rect"
            enableLabels={true}
            labelTextColor="#ffffff"
            theme={{
                textColor: '#B0B0B0',
                tooltip: {
                    container: {
                        background: '#2a2a2a',
                        color: '#FFF',
                        border: '1px solid #444'
                    },
                },
            }}
            tooltip={({ cell }) => (
                <div style={styles.tooltip}>
                    <strong>{cell.data.x}</strong>
                    <br/>
                    Performance: {formatPercentage(cell.data.y as number)}
                </div>
            )}
        />
    )
})

// endregion: --- MAIN COMPONENT ---

export const PortfolioExplorerView: React.FC = () => {
    const [portfolio, setPortfolio] = useState<Asset[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [loadingMessage, setLoadingMessage] = useState('Initializing...');
    const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
    const [filterState, dispatch] = useReducer(filterReducer, initialFilterState);
    const [timeframe, setTimeframe] = useState<PerformanceTimeframe>('1D');
    const [viewMode, setViewMode] = useState<VisualizationMode>('Treemap');
    const [groupingMode, setGroupingMode] = useState<GroupingMode>('AssetClass');

    const [settings] = useState<PortfolioExplorerSettings>({
        currency: 'USD',
        colorTheme: 'performance',
        animationStiffness: 120,
        showBreadcrumbs: true,
    });

    useEffect(() => {
        setIsLoading(true);
        setLoadingMessage('Connecting to data streams...');
        setTimeout(() => {
            setLoadingMessage('Generating portfolio cosmos...');
            const newPortfolio = generateMockPortfolio(200);
            setPortfolio(newPortfolio);
            setTimeout(() => {
                setIsLoading(false);
            }, 1000);
        }, 500);
    }, []);

    const filteredAssets = useMemo(() => {
        return portfolio.filter(asset => {
            const searchLower = filterState.searchTerm.toLowerCase();
            return (
                filterState.assetClasses.has(asset.assetClass) &&
                filterState.regions.has(asset.region) &&
                filterState.sectors.has(asset.sector) &&
                filterState.marketCaps.has(asset.marketCap) &&
                asset.esgScore.total >= filterState.esgMinScore &&
                (asset.name.toLowerCase().includes(searchLower) || asset.ticker.toLowerCase().includes(searchLower))
            );
        });
    }, [portfolio, filterState]);

    const treemapData = useMemo<TreemapNode>(() => {
        const root: TreemapNode = { id: 'root', name: 'Portfolio', value: 0, color: '#121212', performance: 0, children: [], data: {} };
        const groups: { [key: string]: TreemapNode } = {};

        filteredAssets.forEach(asset => {
            const groupName = asset[groupingMode.charAt(0).toLowerCase() + groupingMode.slice(1) as keyof Asset] as string;
            if (!groups[groupName]) {
                groups[groupName] = {
                    id: groupName,
                    name: groupName,
                    value: 0,
                    performance: 0,
                    color: '#ccc', // Will be overwritten
                    children: [],
                    data: {}
                };
            }
            
            groups[groupName].value += asset.marketValue;
            groups[groupName].performance += asset.performance[timeframe] * asset.marketValue;
            groups[groupName].children!.push({
                id: asset.id,
                name: asset.ticker,
                value: asset.marketValue,
                color: getPerformanceColor(asset.performance[timeframe]),
                performance: asset.performance[timeframe],
                data: asset
            });
        });

        root.children = Object.values(groups).map(group => {
            if (group.value > 0) {
                group.performance = group.performance / group.value;
            }
            group.color = getPerformanceColor(group.performance);
            return group;
        });

        return root;
    }, [filteredAssets, timeframe, groupingMode]);

    const handleNodeClick = useCallback((node: any) => {
        // Nivo nodes have different structures depending on vis type
        const dataPayload = node?.data?.data || node?.data;
        if (dataPayload && dataPayload.id) {
            const asset = portfolio.find(a => a.id === dataPayload.id);
            setSelectedAsset(asset || null);
        } else {
             setSelectedAsset(null);
        }
    }, [portfolio]);

    const renderVisualization = () => {
        switch (viewMode) {
            case 'Treemap':
                return <TreemapVisualization data={treemapData} onNodeClick={handleNodeClick} timeframe={timeframe} />;
            case 'Sunburst':
                return <SunburstVisualization data={treemapData} onNodeClick={handleNodeClick} timeframe={timeframe} />;
            case 'DataTable':
                return <DataTableVisualization assets={filteredAssets} onAssetSelect={setSelectedAsset} />;
            case 'Heatmap':
                return <HeatmapVisualization assets={filteredAssets} groupingMode={groupingMode} timeframe={timeframe} />;
            default:
                return null;
        }
    };
    
    const isChartMode = viewMode === 'Treemap' || viewMode === 'Sunburst';

    return (
        <PortfolioSettingsContext.Provider value={settings}>
            <div style={styles.container}>
                <header style={styles.header}>
                    <h1 style={styles.headerTitle}>The Atlas of Assets</h1>
                    <SummaryHeader assets={filteredAssets} timeframe={timeframe} />
                </header>
                <main style={styles.mainContent}>
                    <FilterPanel filterState={filterState} dispatch={dispatch} />
                    <div style={styles.visualizationContainer}>
                       {isLoading && (
                            <div style={styles.loadingOverlay}>
                                <LoadingSpinnerIcon/>
                                <span>{loadingMessage}</span>
                            </div>
                        )}
                        <div style={styles.viewControls}>
                            <div style={{display: 'flex', gap: '10px'}}>
                                {(['Treemap', 'Sunburst', 'DataTable', 'Heatmap'] as VisualizationMode[]).map(v => (
                                    <button
                                        key={v}
                                        onClick={() => setViewMode(v)}
                                        style={{ ...styles.viewButton, ...(viewMode === v ? styles.activeViewButton : {}) }}
                                    >
                                        {v}
                                    </button>
                                ))}
                            </div>
                             <div style={{display: 'flex', gap: '10px', alignItems: 'center'}}>
                                <label style={{color: '#B0B0B0'}}>Group By:</label>
                                <select 
                                    value={groupingMode} 
                                    onChange={(e) => setGroupingMode(e.target.value as GroupingMode)}
                                    style={{...styles.viewButton, padding: '8px'}}
                                    disabled={!isChartMode}
                                >
                                    <option value="AssetClass">Asset Class</option>
                                    <option value="Region">Region</option>
                                    <option value="Sector">Sector</option>
                                    <option value="MarketCap">Market Cap</option>
                                </select>
                             </div>
                             <div style={{display: 'flex', gap: '10px'}}>
                                {(['1D', '1W', '1M', 'YTD', '1Y'] as PerformanceTimeframe[]).map(t => (
                                    <button
                                        key={t}
                                        onClick={() => setTimeframe(t)}
                                        style={{ ...styles.viewButton, ...(timeframe === t ? styles.activeViewButton : {}) }}
                                    >
                                        {t}
                                    </button>
                                ))}
                            </div>
                        </div>
                        {renderVisualization()}
                    </div>
                    <AssetDetailPanel asset={selectedAsset} />
                </main>
            </div>
        </PortfolioSettingsContext.Provider>
    );
};