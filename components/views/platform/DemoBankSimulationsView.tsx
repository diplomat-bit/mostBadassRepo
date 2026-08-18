// REPOSITORY SOURCE: diplomat-bit/Citibank_Demo_Business_Inc_Demonstration- | PATH: diplomat-bit-Citibank_Demo_Business_Inc_Demonstration--ab2501d/components/views/platform/DemoBankSimulationsView.tsx
================================================================================

// components/views/platform/DemoBankSimulationsView.tsx
import React, { useState, useEffect, useMemo, useCallback, useRef, memo } from 'react';
import Card from '../../Card';
import { GoogleGenAI, Type } from "@google/genai";

// SECTION: Type Definitions for a Real-World Application
// =========================================================

/**
 * @export
 * @enum {string}
 * @description Represents the status of a simulation job.
 */
export enum SimulationStatus {
    PENDING = 'Pending',
    QUEUED = 'Queued',
    RUNNING = 'Running',
    COMPLETED = 'Completed',
    FAILED = 'Failed',
    CANCELLED = 'Cancelled',
}

/**
 * @export
 * @enum {string}
 * @description The type of simulation model to be used.
 */
export enum SimulationModel {
    MONTE_CARLO = 'Monte Carlo',
    HISTORICAL = 'Historical Simulation',
    VAR = 'Value at Risk (VaR)',
    STRESS_TESTING = 'Stress Testing',
    BLACK_SCHOLES = 'Black-Scholes',
    AGENT_BASED = 'Agent-Based Model',
    QUANTUM_ANNEALING = 'Quantum Annealing',
}

/**
 * @export
 * @enum {string}
 * @description Categories of asset classes.
 */
export enum AssetClass {
    EQUITIES = 'Equities',
    FIXED_INCOME = 'Fixed Income',
    COMMODITIES = 'Commodities',
    FOREX = 'Foreign Exchange',
    DERIVATIVES = 'Derivatives',
    REAL_ESTATE = 'Real Estate',
    CRYPTOCURRENCY = 'Cryptocurrency',
    PRIVATE_EQUITY = 'Private Equity',
}

/**
 * @export
 * @enum {string}
 * @description Types of stress test scenarios.
 */
export enum StressScenarioType {
    INTEREST_RATE_SHOCK = 'Interest Rate Shock',
    MARKET_CRASH = 'Market Crash',
    INFLATION_SURGE = 'Inflation Surge',
    CREDIT_DEFAULT_EVENT = 'Credit Default Event',
    GEOPOLITICAL_CRISIS = 'Geopolitical Crisis',
    PANDEMIC_OUTBREAK = 'Pandemic Outbreak',
    CYBERSECURITY_ATTACK = 'Cybersecurity Attack',
}

/**
 * @export
 * @enum {string}
 * @description User roles within the simulation platform.
 */
export enum UserRole {
    ANALYST = 'Analyst',
    MANAGER = 'Manager',
    ADMIN = 'Administrator',
    GUEST = 'Guest',
}

/**
 * @export
 * @interface User
 * @description Represents a user of the platform.
 */
export interface User {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    avatarUrl?: string;
}

/**
 * @export
 * @interface PortfolioAsset
 * @description Represents a single asset within a portfolio.
 */
export interface PortfolioAsset {
    id: string;
    ticker: string;
    name: string;
    assetClass: AssetClass;
    quantity: number;
    marketValue: number; // in USD
    weight: number; // percentage of portfolio
}

/**
 * @export
 * @interface Portfolio
 * @description Represents a collection of assets for simulation.
 */
export interface Portfolio {
    id: string;
    name: string;
    description: string;
    totalValue: number;
    assets: PortfolioAsset[];
    lastRebalanced: string; // ISO 8601 date string
    riskProfile: 'Conservative' | 'Moderate' | 'Aggressive';
}

/**
 * @export
 * @interface MarketEvent
 * @description Represents a significant market event injected into a simulation.
 */
export interface MarketEvent {
    step: number;
    eventName: string;
    description: string;
    impact: {
        [key in AssetClass]?: number; // e.g., { Equities: -0.15 } for a 15% drop
    };
}

/**
 * @export
 * @interface SimulationConfig
 * @description Detailed configuration for a simulation run.
 */
export interface SimulationConfig {
    model: SimulationModel;
    simulationSteps: number;
    timeHorizonDays: number;
    confidenceLevel: number; // e.g., 0.95 for 95%
    initialParameters: {
        volatilityIndex: number;
        interestRateChange: number;
        marketSentiment: 'Bearish' | 'Neutral' | 'Bullish';
        [key: string]: any;
    };
    portfolioId: string;
    stressScenarios: StressScenarioType[];
    marketEvents?: MarketEvent[];
}

/**
 * @export
 * @interface SimulationResultPoint
 * @description A single data point in a simulation result timeseries.
 */
export interface SimulationResultPoint {
    step: number;
    timestamp: string; // ISO 8601 date string
    portfolioValue: number;
    var: number; // Value at Risk
    cvar: number; // Conditional Value at Risk
    [key: string]: any; // for additional metrics
}

/**
 * @export
 * @interface SimulationMetrics
 * @description Advanced performance and risk metrics.
 */
export interface SimulationMetrics {
    finalPortfolioValue: number;
    totalReturn: number;
    maxDrawdown: number;
    sharpeRatio: number;
    sortinoRatio: number;
    alpha: number;
    beta: number;
    meanVaR: number;
    meanCVaR: number;
}

/**
 * @export
 * @interface SimulationResult
 * @description The complete results of a simulation.
 */
export interface SimulationResult {
    summary: SimulationMetrics;
    timeseries: SimulationResultPoint[];
    assetPerformance: {
        [ticker: string]: {
            initialValue: number;
            finalValue: number;
            return: number;
        }
    };
}

/**
 * @export
 * @interface SimulationLog
 * @description A log entry for a simulation job.
 */
export interface SimulationLog {
    timestamp: string; // ISO 8601 date string
    level: 'INFO' | 'WARN' | 'ERROR' | 'DEBUG';
    message: string;
}

/**
 * @export
 * @enum {string}
 * @description Different types of AI-generated insights.
 */
export enum AIInsightType {
    RISK_ASSESSMENT = 'Risk Assessment',
    OPPORTUNITY_IDENTIFICATION = 'Opportunity Identification',
    NARRATIVE_SUMMARY = 'Narrative Summary',
    RECOMMENDATION = 'Recommendation',
}

/**
 * @export
 * @interface AIInsight
 * @description Represents an AI-generated insight about a simulation.
 */
export interface AIInsight {
    id: string;
    simulationId: string;
    type: AIInsightType;
    title: string;
    content: string;
    confidenceScore: number; // 0 to 1
    generatedAt: string; // ISO 8601
}

/**
 * @export
 * @interface Simulation
 * @description The core object representing a simulation job.
 */
export interface Simulation {
    id: string;
    name: string;
    description: string;
    status: SimulationStatus;
    submittedBy: User;
    submittedAt: string; // ISO 8601 date string
    startedAt?: string;
    completedAt?: string;
    progress: number; // 0 to 100
    config: SimulationConfig;
    results?: SimulationResult;
    logs?: SimulationLog[];
    computeHours: number;
    aiInsights?: AIInsight[];
}

/**
 * @export
 * @type {Object.<SimulationStatus, string>}
 * @description Maps simulation statuses to Tailwind CSS color classes.
 */
export const STATUS_COLORS: { [key in SimulationStatus]: string } = {
    [SimulationStatus.PENDING]: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    [SimulationStatus.QUEUED]: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    [SimulationStatus.RUNNING]: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30 animate-pulse',
    [SimulationStatus.COMPLETED]: 'bg-green-500/20 text-green-400 border-green-500/30',
    [SimulationStatus.FAILED]: 'bg-red-500/20 text-red-400 border-red-500/30',
    [SimulationStatus.CANCELLED]: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
};


// SECTION: Mock Data and API Layer
// =========================================================

/**
 * @export
 * @description A collection of names and tickers for mock data generation.
 */
export const MOCK_ASSET_LIBRARY = {
    [AssetClass.EQUITIES]: [
        { ticker: 'AAPL', name: 'Apple Inc.' }, { ticker: 'MSFT', name: 'Microsoft Corporation' },
        { ticker: 'GOOGL', name: 'Alphabet Inc.' }, { ticker: 'AMZN', name: 'Amazon.com, Inc.' },
        { ticker: 'TSLA', name: 'Tesla, Inc.' }, { ticker: 'NVDA', name: 'NVIDIA Corporation' },
        { ticker: 'JPM', name: 'JPMorgan Chase & Co.' }, { ticker: 'V', name: 'Visa Inc.' },
    ],
    [AssetClass.FIXED_INCOME]: [
        { ticker: 'BND', name: 'Vanguard Total Bond Market ETF' }, { ticker: 'AGG', name: 'iShares Core U.S. Aggregate Bond ETF' },
        { ticker: 'LQD', name: 'iShares iBoxx $ Investment Grade Corporate Bond ETF' }, { ticker: 'HYG', name: 'iShares iBoxx $ High Yield Corporate Bond ETF' },
    ],
    [AssetClass.COMMODITIES]: [
        { ticker: 'GLD', name: 'SPDR Gold Shares' }, { ticker: 'SLV', name: 'iShares Silver Trust' },
        { ticker: 'USO', name: 'United States Oil Fund' },
    ],
    [AssetClass.FOREX]: [
        { ticker: 'EURUSD', name: 'Euro/US Dollar' }, { ticker: 'USDJPY', name: 'US Dollar/Japanese Yen' },
        { ticker: 'GBPUSD', name: 'British Pound/US Dollar' },
    ],
    [AssetClass.CRYPTOCURRENCY]: [
        { ticker: 'BTC', name: 'Bitcoin' }, { ticker: 'ETH', name: 'Ethereum' }, { ticker: 'SOL', name: 'Solana' },
    ]
};

/**
 * @export
 * @description A list of mock users for the platform.
 */
export const MOCK_USERS: User[] = [
    { id: 'u_001', name: 'Alice Johnson', email: 'alice.j@demobank.com', role: UserRole.MANAGER, avatarUrl: `https://i.pravatar.cc/150?u=u_001` },
    { id: 'u_002', name: 'Bob Williams', email: 'bob.w@demobank.com', role: UserRole.ANALYST, avatarUrl: `https://i.pravatar.cc/150?u=u_002` },
    { id: 'u_003', name: 'Charlie Brown', email: 'charlie.b@demobank.com', role: UserRole.ANALYST, avatarUrl: `https://i.pravatar.cc/150?u=u_003` },
    { id: 'u_004', name: 'Diana Prince', email: 'diana.p@demobank.com', role: UserRole.ADMIN, avatarUrl: `https://i.pravatar.cc/150?u=u_004` },
];

/**
 * @export
 * @function generateMockPortfolio
 * @description Generates a random portfolio of assets.
 * @param {string} id The portfolio ID.
 * @param {string} name The portfolio name.
 * @param {'Conservative' | 'Moderate' | 'Aggressive'} riskProfile The risk profile.
 * @returns {Portfolio} A mock portfolio object.
 */
export const generateMockPortfolio = (id: string, name: string, riskProfile: 'Conservative' | 'Moderate' | 'Aggressive'): Portfolio => {
    const assets: PortfolioAsset[] = [];
    let totalValue = 0;
    const numAssets = 5 + Math.floor(Math.random() * 10);

    for (let i = 0; i < numAssets; i++) {
        const assetClasses = Object.keys(MOCK_ASSET_LIBRARY) as AssetClass[];
        const randomClass = assetClasses[Math.floor(Math.random() * assetClasses.length)];
        const assetPool = MOCK_ASSET_LIBRARY[randomClass];
        const randomAsset = assetPool[Math.floor(Math.random() * assetPool.length)];

        if (!assets.some(a => a.ticker === randomAsset.ticker)) {
            const marketValue = 50000 + Math.random() * 200000;
            totalValue += marketValue;
            assets.push({
                id: `asset_${id}_${i}`,
                ticker: randomAsset.ticker,
                name: randomAsset.name,
                assetClass: randomClass,
                quantity: Math.round(marketValue / (50 + Math.random() * 200)),
                marketValue: marketValue,
                weight: 0,
            });
        }
    }

    assets.forEach(asset => asset.weight = (asset.marketValue / totalValue) * 100);

    return {
        id,
        name,
        description: `A ${riskProfile.toLowerCase()} portfolio named ${name}.`,
        totalValue,
        assets,
        lastRebalanced: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
        riskProfile,
    };
};

/**
 * @export
 * @description A list of mock portfolios available for simulation.
 */
export const MOCK_PORTFOLIOS: Portfolio[] = [
    generateMockPortfolio('p_001', 'Global Growth Fund', 'Aggressive'),
    generateMockPortfolio('p_002', 'Conservative Income Portfolio', 'Conservative'),
    generateMockPortfolio('p_003', 'Emerging Markets High-Risk', 'Aggressive'),
    generateMockPortfolio('p_004', 'Tech Sector Focus', 'Moderate'),
    generateMockPortfolio('p_005', 'Crypto Blue Chip', 'Aggressive'),
];

/**
 * @export
 * @function generateMockAIInsight
 * @description Generates a mock AI insight for a simulation.
 * @param {string} simulationId The ID of the simulation.
 * @returns {AIInsight} A mock AI insight.
 */
export const generateMockAIInsight = (simulationId: string): AIInsight => {
    const insightTypes = Object.values(AIInsightType);
    const type = insightTypes[Math.floor(Math.random() * insightTypes.length)];
    let title = '';
    let content = '';

    switch (type) {
        case AIInsightType.RISK_ASSESSMENT:
            title = 'Concentration Risk Detected in Equities';
            content = 'The simulation indicates a significant downside risk due to over-concentration in the technology sector. A market correction in tech could lead to a drawdown exceeding 25%. Consider diversifying into defensive sectors like healthcare or utilities.';
            break;
        case AIInsightType.OPPORTUNITY_IDENTIFICATION:
            title = 'Potential Upside in Commodities';
            content = 'Under the simulated inflationary scenario, commodities, particularly gold (GLD), showed strong positive returns, acting as an effective hedge. Increasing allocation to commodities could improve the portfolio\'s Sharpe ratio by up to 0.3.';
            break;
        case AIInsightType.RECOMMENDATION:
            title = 'Rebalancing Recommendation';
            content = 'It is recommended to rebalance the portfolio by reducing the weight of NVDA from 15% to 10% and reallocating the capital to the BND bond ETF to lower overall portfolio volatility.';
            break;
        case AIInsightType.NARRATIVE_SUMMARY:
        default:
            title = 'Simulation Narrative Summary';
            content = 'The portfolio demonstrated resilience in the base case scenario, achieving a 7.5% annualized return. However, it proved vulnerable to the Interest Rate Shock stress test, highlighting a need for better duration management in the fixed income sleeve.';
            break;
    }

    return {
        id: `ai_${simulationId}_${Math.random().toString(36).substr(2, 9)}`,
        simulationId,
        type,
        title,
        content,
        confidenceScore: 0.85 + Math.random() * 0.14,
        generatedAt: new Date().toISOString(),
    };
};

/**
 * @export
 * @function generateMockSimulationResult
 * @description Generates a realistic-looking simulation result.
 * @param {SimulationConfig} config The configuration used for the simulation.
 * @returns {SimulationResult} A mock simulation result object.
 */
export const generateMockSimulationResult = (config: SimulationConfig): SimulationResult => {
    const timeseries: SimulationResultPoint[] = [];
    const portfolio = MOCK_PORTFOLIOS.find(p => p.id === config.portfolioId)!;
    let currentValue = portfolio.totalValue;
    const baseDrift = (config.initialParameters.marketSentiment === 'Bullish' ? 0.0005 : (config.initialParameters.marketSentiment === 'Bearish' ? -0.0005 : 0));
    const volatility = config.initialParameters.volatilityIndex * 0.02;

    for (let i = 0; i < config.simulationSteps; i++) {
        const randomShock = (Math.random() - 0.5) * volatility;
        currentValue *= (1 + baseDrift + randomShock);
        timeseries.push({
            step: i,
            timestamp: new Date(Date.now() + i * 24 * 60 * 60 * 1000).toISOString(),
            portfolioValue: currentValue,
            var: currentValue * volatility * 1.645,
            cvar: currentValue * volatility * 2.06,
        });
    }

    const finalValue = timeseries[timeseries.length - 1].portfolioValue;
    const totalReturn = (finalValue / portfolio.totalValue) - 1;

    const assetPerformance: { [ticker: string]: any } = {};
    portfolio.assets.forEach(asset => {
        const assetReturn = totalReturn + (Math.random() - 0.5) * 0.1;
        assetPerformance[asset.ticker] = {
            initialValue: asset.marketValue,
            finalValue: asset.marketValue * (1 + assetReturn),
            return: assetReturn,
        };
    });

    const summary: SimulationMetrics = {
        finalPortfolioValue: finalValue,
        totalReturn: totalReturn,
        maxDrawdown: Math.random() * 0.15 + 0.05,
        sharpeRatio: (totalReturn / (volatility * Math.sqrt(config.simulationSteps))) * Math.sqrt(252),
        sortinoRatio: (totalReturn / (volatility * Math.sqrt(config.simulationSteps))) * Math.sqrt(252) * 1.2,
        alpha: (Math.random() - 0.5) * 0.02,
        beta: 0.8 + Math.random() * 0.4,
        meanVaR: timeseries.reduce((acc, p) => acc + p.var, 0) / timeseries.length,
        meanCVaR: timeseries.reduce((acc, p) => acc + p.cvar, 0) / timeseries.length,
    };

    return { summary, timeseries, assetPerformance };
};

/**
 * @export
 * @function generateMockSimulation
 * @description Generates a single mock simulation job.
 * @param {Partial<Simulation>} override Overrides for the generated simulation.
 * @returns {Simulation} A mock simulation object.
 */
export const generateMockSimulation = (override: Partial<Simulation> = {}): Simulation => {
    const id = `sim_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const submittedAt = new Date(Date.now() - Math.random() * 60 * 24 * 60 * 60 * 1000);
    const status = Object.values(SimulationStatus)[Math.floor(Math.random() * Object.values(SimulationStatus).length)];
    const user = MOCK_USERS[Math.floor(Math.random() * MOCK_USERS.length)];
    const portfolio = MOCK_PORTFOLIOS[Math.floor(Math.random() * MOCK_PORTFOLIOS.length)];

    const config: SimulationConfig = {
        model: Object.values(SimulationModel)[Math.floor(Math.random() * Object.values(SimulationModel).length)],
        simulationSteps: 252,
        timeHorizonDays: 252,
        confidenceLevel: 0.95,
        initialParameters: {
            volatilityIndex: Math.random(),
            interestRateChange: (Math.random() - 0.5) * 100,
            marketSentiment: ['Bearish', 'Neutral', 'Bullish'][Math.floor(Math.random() * 3)] as any,
        },
        portfolioId: portfolio.id,
        stressScenarios: [Object.values(StressScenarioType)[Math.floor(Math.random() * Object.values(StressScenarioType).length)]],
    };

    let completedAt: string | undefined;
    let progress = 0;
    let results: SimulationResult | undefined;
    let aiInsights: AIInsight[] | undefined;

    if (status === SimulationStatus.COMPLETED) {
        progress = 100;
        completedAt = new Date(submittedAt.getTime() + (10 + Math.random() * 50) * 60 * 1000).toISOString();
        results = generateMockSimulationResult(config);
        aiInsights = [generateMockAIInsight(id), generateMockAIInsight(id)];
    } else if (status === SimulationStatus.RUNNING) {
        progress = Math.floor(10 + Math.random() * 80);
    } else if (status === SimulationStatus.FAILED || status === SimulationStatus.CANCELLED) {
        progress = Math.floor(10 + Math.random() * 80);
        completedAt = new Date(submittedAt.getTime() + (10 + Math.random() * 50) * 60 * 1000).toISOString();
    }

    return {
        id, name: `${config.model} for ${portfolio.name}`,
        description: `A ${config.model} simulation run on the ${portfolio.name} portfolio under ${config.initialParameters.marketSentiment} conditions.`,
        status, submittedBy: user, submittedAt: submittedAt.toISOString(),
        completedAt, progress, config, results, aiInsights, computeHours: Math.random() * 5,
        ...override,
    };
};

/**
 * @export
 * @class MockSimulationAPI
 * @description Simulates a backend API for managing simulations.
 */
export class MockSimulationAPI {
    private simulations: Simulation[] = [];

    constructor(count: number = 50) {
        for (let i = 0; i < count; i++) this.simulations.push(generateMockSimulation());
        this.simulations.sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());
    }

    private simulateLatency<T>(data: T, delay: number = 500): Promise<T> {
        return new Promise(resolve => setTimeout(() => resolve(data), delay + Math.random() * 300));
    }

    async getSimulations(page: number = 1, limit: number = 10, filter: { status?: SimulationStatus, user?: string } = {}): Promise<{ data: Simulation[], total: number }> {
        let filtered = this.simulations;
        if (filter.status) filtered = filtered.filter(s => s.status === filter.status);
        if (filter.user) filtered = filtered.filter(s => s.submittedBy.name.toLowerCase().includes(filter.user.toLowerCase()));
        const paginated = filtered.slice((page - 1) * limit, page * limit);
        return this.simulateLatency({ data: paginated, total: filtered.length });
    }

    async getSimulationById(id: string): Promise<Simulation | null> {
        const simulation = this.simulations.find(s => s.id === id);
        if (simulation && (simulation.status === SimulationStatus.RUNNING || simulation.status === SimulationStatus.QUEUED)) {
            simulation.progress = Math.min(100, simulation.progress + Math.floor(Math.random() * 5));
            if (simulation.progress >= 100) {
                simulation.status = SimulationStatus.COMPLETED;
                simulation.completedAt = new Date().toISOString();
                simulation.results = generateMockSimulationResult(simulation.config);
                simulation.aiInsights = [generateMockAIInsight(id)];
            }
        }
        return this.simulateLatency(simulation || null);
    }

    async createSimulation(config: SimulationConfig, name: string, description: string): Promise<Simulation> {
        const newSim = generateMockSimulation({
            id: `sim_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`, name, description, config,
            status: SimulationStatus.QUEUED, submittedAt: new Date().toISOString(), progress: 0,
            submittedBy: MOCK_USERS[1],
        });
        this.simulations.unshift(newSim);
        setTimeout(() => {
            const found = this.simulations.find(s => s.id === newSim.id);
            if (found) found.status = SimulationStatus.RUNNING;
        }, 5000);
        return this.simulateLatency(newSim, 200);
    }

    async cancelSimulation(id: string): Promise<boolean> {
        const simIndex = this.simulations.findIndex(s => s.id === id);
        if (simIndex !== -1) {
            const sim = this.simulations[simIndex];
            if (sim.status === SimulationStatus.QUEUED || sim.status === SimulationStatus.RUNNING) {
                this.simulations[simIndex] = { ...sim, status: SimulationStatus.CANCELLED, completedAt: new Date().toISOString() };
                return this.simulateLatency(true);
            }
        }
        return this.simulateLatency(false);
    }
}

/** @description A singleton instance of the mock API. */
export const api = new MockSimulationAPI();

// SECTION: Utility and Helper Functions
// =========================================================
export const formatCurrency = (value: number): string => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value);
export const formatPercentage = (value: number): string => new Intl.NumberFormat('en-US', { style: 'percent', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value);
export const formatDate = (date: string | Date): string => new Date(date).toLocaleString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
export const timeAgo = (date: string | Date): string => {
    const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);
    let interval = seconds / 31536000; if (interval > 1) return Math.floor(interval) + " years ago";
    interval = seconds / 2592000; if (interval > 1) return Math.floor(interval) + " months ago";
    interval = seconds / 86400; if (interval > 1) return Math.floor(interval) + " days ago";
    interval = seconds / 3600; if (interval > 1) return Math.floor(interval) + " hours ago";
    interval = seconds / 60; if (interval > 1) return Math.floor(interval) + " minutes ago";
    return Math.floor(seconds) + " seconds ago";
};
export const truncateString = (str: string, num: number): string => str.length <= num ? str : str.slice(0, num) + '...';

// SECTION: Reusable UI Components
// =========================================================

export const StatusIndicator: React.FC<{ status: SimulationStatus }> = memo(({ status }) => (
    <div className={`px-3 py-1 text-xs font-medium rounded-full inline-flex items-center border ${STATUS_COLORS[status]}`}>
        <span className={`w-2 h-2 mr-2 rounded-full ${STATUS_COLORS[status].split(' ')[0]}`} />{status}
    </div>
));

export const ProgressBar: React.FC<{ progress: number }> = memo(({ progress }) => (
    <div className="w-full bg-gray-700 rounded-full h-2"><div className="bg-cyan-500 h-2 rounded-full" style={{ width: `${progress}%` }} /></div>
));

export const UserProfileChip: React.FC<{ user: User }> = memo(({ user }) => (
    <div className="flex items-center space-x-2">
        <img src={user.avatarUrl} alt={user.name} className="w-8 h-8 rounded-full" />
        <div><p className="text-sm font-medium text-white">{user.name}</p><p className="text-xs text-gray-400">{user.role}</p></div>
    </div>
));

export interface PaginationProps { currentPage: number; totalItems: number; itemsPerPage: number; onPageChange: (page: number) => void; }
export const Pagination: React.FC<PaginationProps> = memo(({ currentPage, totalItems, itemsPerPage, onPageChange }) => {
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    if (totalPages <= 1) return null;
    return (
        <nav className="flex items-center justify-between text-sm text-gray-400 mt-4">
            <div>Showing <span className="font-bold text-white">{(currentPage - 1) * itemsPerPage + 1}</span> to <span className="font-bold text-white">{Math.min(currentPage * itemsPerPage, totalItems)}</span> of <span className="font-bold text-white">{totalItems}</span> results</div>
            <ul className="inline-flex -space-x-px">
                <li><button onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1} className="px-3 py-2 ml-0 leading-tight bg-gray-800 border border-gray-700 rounded-l-lg hover:bg-gray-700 disabled:opacity-50">Previous</button></li>
                {[...Array(totalPages).keys()].map(i => i + 1).map(number => (<li key={number}><button onClick={() => onPageChange(number)} className={`px-3 py-2 leading-tight border border-gray-700 ${currentPage === number ? 'bg-cyan-600 text-white' : 'bg-gray-800 hover:bg-gray-700'}`}>{number}</button></li>))}
                <li><button onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages} className="px-3 py-2 leading-tight bg-gray-800 border border-gray-700 rounded-r-lg hover:bg-gray-700 disabled:opacity-50">Next</button></li>
            </ul>
        </nav>
    );
});

export interface SimulationHistoryTableProps { simulations: Simulation[]; isLoading: boolean; onViewDetails: (id: string) => void; }
export const SimulationHistoryTable: React.FC<SimulationHistoryTableProps> = memo(({ simulations, isLoading, onViewDetails }) => {
    if (isLoading) return <div className="w-full text-center py-10"><p className="text-gray-400">Loading simulation history...</p></div>;
    if (simulations.length === 0) return <div className="w-full text-center py-10"><p className="text-gray-400">No simulations found.</p></div>;
    return (
        <div className="overflow-x-auto">
            <table className="min-w-full text-sm text-left text-gray-400">
                <thead className="text-xs text-gray-400 uppercase bg-gray-700/50">
                    <tr>
                        <th scope="col" className="px-6 py-3">Simulation Name</th><th scope="col" className="px-6 py-3">Status</th>
                        <th scope="col" className="px-6 py-3">Submitted By</th><th scope="col" className="px-6 py-3">Submitted At</th>
                        <th scope="col" className="px-6 py-3">Progress</th><th scope="col" className="px-6 py-3"></th>
                    </tr>
                </thead>
                <tbody>
                    {simulations.map(sim => (
                        <tr key={sim.id} className="border-b border-gray-700 hover:bg-gray-800/50">
                            <th scope="row" className="px-6 py-4 font-medium text-white whitespace-nowrap">{truncateString(sim.name, 40)}</th>
                            <td className="px-6 py-4"><StatusIndicator status={sim.status} /></td><td className="px-6 py-4">{sim.submittedBy.name}</td>
                            <td className="px-6 py-4">{timeAgo(sim.submittedAt)}</td>
                            <td className="px-6 py-4">{sim.status === SimulationStatus.RUNNING ? (<div className="flex items-center space-x-2"><ProgressBar progress={sim.progress} /><span className="text-xs">{sim.progress}%</span></div>) : (<span>-</span>)}</td>
                            <td className="px-6 py-4 text-right"><button onClick={() => onViewDetails(sim.id)} className="font-medium text-cyan-500 hover:underline">View</button></td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
});

export interface MockChartProps { data: { x: number; y: number }[]; title: string; xAxisLabel: string; yAxisLabel: string; color: string; }
export const MockLineChart: React.FC<MockChartProps> = memo(({ data, title, xAxisLabel, yAxisLabel, color }) => {
    const width = 500, height = 300, padding = 50;
    const maxX = Math.max(...data.map(d => d.x)), maxY = Math.max(...data.map(d => d.y));
    const minX = Math.min(...data.map(d => d.x)), minY = Math.min(...data.map(d => d.y));
    const getX = (x: number) => padding + ((x - minX) / (maxX - minX)) * (width - 2 * padding);
    const getY = (y: number) => height - padding - ((y - minY) / (maxY - minY)) * (height - 2 * padding);
    const path = data.map((d, i) => `${i === 0 ? 'M' : 'L'} ${getX(d.x)} ${getY(d.y)}`).join(' ');
    return (
        <div className="p-4 bg-gray-900/50 rounded"><h4 className="text-lg font-semibold text-white mb-2">{title}</h4>
            <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto">
                <line x1={padding} y1={padding} x2={padding} y2={height - padding} stroke="#4A5568" /><text x={10} y={padding} dy=".3em" fill="#A0AEC0" fontSize="10">{formatCurrency(maxY)}</text>
                <text x={10} y={height - padding} fill="#A0AEC0" fontSize="10">{formatCurrency(minY)}</text><text transform={`rotate(-90) translate(-${height / 2}, 15)`} textAnchor="middle" fill="#A0AEC0" fontSize="12">{yAxisLabel}</text>
                <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="#4A5568" /><text x={padding} y={height - padding + 20} fill="#A0AEC0" fontSize="10">{minX}</text>
                <text x={width - padding} y={height - padding + 20} textAnchor="end" fill="#A0AEC0" fontSize="10">{maxX}</text><text x={width / 2} y={height - 10} textAnchor="middle" fill="#A0AEC0" fontSize="12">{xAxisLabel}</text>
                {[...Array(5)].map((_, i) => (<line key={i} x1={padding} y1={padding + i * (height - 2 * padding) / 4} x2={width - padding} y2={padding + i * (height - 2 * padding) / 4} stroke="#2D3748" strokeDasharray="2,2" />))}
                <path d={path} fill="none" stroke={color} strokeWidth="2" />
            </svg>
        </div>
    );
});

export const AIInsightCard: React.FC<{ insight: AIInsight }> = memo(({ insight }) => {
    const iconMap = {
        [AIInsightType.RISK_ASSESSMENT]: '⚠️',
        [AIInsightType.OPPORTUNITY_IDENTIFICATION]: '💡',
        [AIInsightType.RECOMMENDATION]: '✅',
        [AIInsightType.NARRATIVE_SUMMARY]: '📝',
    };
    return (
        <Card>
            <h5 className="text-lg font-bold text-white mb-2 flex items-center">
                <span className="text-2xl mr-3">{iconMap[insight.type]}</span> {insight.title}
            </h5>
            <p className="text-gray-300 text-sm mb-3">{insight.content}</p>
            <div className="text-xs text-gray-500 flex justify-between items-center">
                <span>{insight.type}</span>
                <span>Confidence: {formatPercentage(insight.confidenceScore)}</span>
            </div>
        </Card>
    );
});

export interface SimulationDetailViewProps { simulationId: string; onBack: () => void; }
export const SimulationDetailView: React.FC<SimulationDetailViewProps> = ({ simulationId, onBack }) => {
    const [simulation, setSimulation] = useState<Simulation | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'summary' | 'results' | 'ai_insights' | 'config' | 'logs'>('summary');
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    const fetchSimulation = useCallback(async () => {
        try {
            const data = await api.getSimulationById(simulationId);
            setSimulation(data);
            if (data?.status !== SimulationStatus.RUNNING && data?.status !== SimulationStatus.QUEUED && intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        } catch (error) {
            console.error("Failed to fetch simulation details", error);
            if (intervalRef.current) clearInterval(intervalRef.current);
        } finally {
            setIsLoading(false);
        }
    }, [simulationId]);

    useEffect(() => {
        setIsLoading(true); fetchSimulation();
        intervalRef.current = setInterval(fetchSimulation, 5000);
        return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
    }, [fetchSimulation]);

    if (isLoading) return <div className="text-center p-10 text-white">Loading simulation details...</div>;
    if (!simulation) return <div className="text-center p-10 text-red-500">Simulation not found.</div>;
    
    const renderSummary = () => (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.entries(simulation.results?.summary || {}).map(([key, value]) => (
                <Card key={key} title={key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}>
                    {simulation.results ? (
                        <p className={`text-3xl font-bold ${typeof value === 'number' ? (value >= 0 ? 'text-green-400' : 'text-red-400') : 'text-white'}`}>
                            {key.toLowerCase().includes('return') || key.toLowerCase().includes('drawdown') ? formatPercentage(value) :
                             key.toLowerCase().includes('value') || key.toLowerCase().includes('var') ? formatCurrency(value) : value.toFixed(2)}
                        </p>
                    ) : <p className="text-gray-400">N/A</p>}
                </Card>
            ))}
        </div>
    );

    const renderResults = () => {
        if (!simulation.results) return <p className="text-gray-400">Results are not available for this simulation.</p>;
        const chartData = simulation.results.timeseries.map(p => ({ x: p.step, y: p.portfolioValue }));
        return (
            <div className="space-y-6">
                <MockLineChart data={chartData} title="Portfolio Value Over Time" xAxisLabel="Simulation Steps" yAxisLabel="Portfolio Value (USD)" color="#2dd4bf" />
                <Card title="Asset Performance">
                     <table className="min-w-full text-sm text-left text-gray-400">
                        <thead className="text-xs text-gray-400 uppercase bg-gray-700/50"><tr><th scope="col" className="px-6 py-3">Asset (Ticker)</th><th scope="col" className="px-6 py-3">Initial Value</th><th scope="col" className="px-6 py-3">Final Value</th><th scope="col" className="px-6 py-3">Return</th></tr></thead>
                        <tbody>{Object.entries(simulation.results.assetPerformance).map(([ticker, perf]) => (<tr key={ticker} className="border-b border-gray-700"><td className="px-6 py-4 font-medium text-white">{ticker}</td><td className="px-6 py-4">{formatCurrency(perf.initialValue)}</td><td className="px-6 py-4">{formatCurrency(perf.finalValue)}</td><td className={`px-6 py-4 font-semibold ${perf.return >= 0 ? 'text-green-400' : 'text-red-400'}`}>{formatPercentage(perf.return)}</td></tr>))}</tbody>
                    </table>
                </Card>
            </div>
        );
    };

    const renderAIInsights = () => {
        if (!simulation.aiInsights || simulation.aiInsights.length === 0) return <p className="text-gray-400">No AI insights available for this simulation.</p>;
        return <div className="grid grid-cols-1 md:grid-cols-2 gap-6">{simulation.aiInsights.map(insight => <AIInsightCard key={insight.id} insight={insight} />)}</div>;
    };
    
    const renderConfig = () => <Card title="Simulation Configuration"><pre className="text-xs text-gray-300 whitespace-pre-wrap font-mono bg-gray-900/50 p-4 rounded max-h-96 overflow-auto">{JSON.stringify(simulation.config, null, 2)}</pre></Card>;
    const renderLogs = () => <Card title="Execution Logs"><div className="text-xs text-gray-300 font-mono bg-gray-900/50 p-4 rounded max-h-96 overflow-auto"><p><span className="text-green-400">[INFO]</span> {simulation.submittedAt} - Simulation job created by {simulation.submittedBy.email}.</p>{simulation.status === SimulationStatus.QUEUED && <p><span className="text-blue-400">[INFO]</span> {new Date(new Date(simulation.submittedAt).getTime() + 5000).toISOString()} - Job queued.</p>}{simulation.status === SimulationStatus.RUNNING && <p><span className="text-cyan-400">[INFO]</span> {simulation.startedAt || new Date(new Date(simulation.submittedAt).getTime() + 15000).toISOString()} - Job started execution.</p>}{simulation.status === SimulationStatus.RUNNING && <p><span className="text-cyan-400">[DEBUG]</span> {new Date().toISOString()} - Running step {Math.floor(simulation.progress / 100 * simulation.config.simulationSteps)} of {simulation.config.simulationSteps}...</p>}{simulation.status === SimulationStatus.FAILED && <p><span className="text-red-400">[ERROR]</span> {simulation.completedAt} - Memory allocation failed.</p>}{simulation.status === SimulationStatus.COMPLETED && <p><span className="text-green-400">[INFO]</span> {simulation.completedAt} - Simulation completed successfully.</p>}</div></Card>;

    const tabContent = { summary: renderSummary(), results: renderResults(), ai_insights: renderAIInsights(), config: renderConfig(), logs: renderLogs() };
    
    return (
        <div className="space-y-6">
            <button onClick={onBack} className="text-cyan-400 hover:text-cyan-300">&larr; Back to all simulations</button>
            <div className="flex justify-between items-start">
                <div><h2 className="text-3xl font-bold text-white tracking-wider">{simulation.name}</h2><p className="text-gray-400 mt-1">{simulation.description}</p></div>
                <div className="flex items-center space-x-4"><StatusIndicator status={simulation.status} />{(simulation.status === SimulationStatus.RUNNING || simulation.status === SimulationStatus.QUEUED) && (<button onClick={() => api.cancelSimulation(simulation.id)} className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded text-sm">Cancel Job</button>)}</div>
            </div>
            <div className="flex border-b border-gray-700">
                {(['summary', 'results', 'ai_insights', 'config', 'logs'] as const).map(tab => (
                    <button key={tab} onClick={() => setActiveTab(tab)} className={`px-4 py-2 -mb-px border-b-2 text-sm font-medium ${activeTab === tab ? 'border-cyan-500 text-cyan-400' : 'border-transparent text-gray-400 hover:text-white'}`}>{tab.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}</button>
                ))}
            </div>
            <div className="mt-6">{tabContent[activeTab]}</div>
        </div>
    );
};


// SECTION: Main View Component
// =========================================================

const DemoBankSimulationsView: React.FC = () => {
    const [prompt, setPrompt] = useState("a high-volatility market with a potential interest rate hike");
    const [generatedParams, setGeneratedParams] = useState<any>(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [activeView, setActiveView] = useState<'dashboard' | 'simulationDetail'>('dashboard');
    const [activeTab, setActiveTab] = useState<'generator' | 'history'>('generator');
    const [selectedSimulationId, setSelectedSimulationId] = useState<string | null>(null);
    const [simulations, setSimulations] = useState<Simulation[]>([]);
    const [isLoadingSimulations, setIsLoadingSimulations] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalSimulations, setTotalSimulations] = useState(0);
    const itemsPerPage = 10;
    
    const stats = useMemo(() => ({
        active: simulations.filter(s => s.status === SimulationStatus.RUNNING || s.status === SimulationStatus.QUEUED).length,
        pending: simulations.filter(s => s.status === SimulationStatus.PENDING).length,
        completed: simulations.filter(s => s.status === SimulationStatus.COMPLETED).length,
    }), [simulations]);

    const fetchSimulations = useCallback(async (page: number) => {
        setIsLoadingSimulations(true);
        try {
            const response = await api.getSimulations(page, itemsPerPage);
            setSimulations(response.data);
            setTotalSimulations(response.total);
        } catch (error) {
            console.error("Failed to fetch simulations:", error);
        } finally {
            setIsLoadingSimulations(false);
        }
    }, []);
    
    useEffect(() => {
        if (activeView === 'dashboard' && activeTab === 'history') {
            fetchSimulations(currentPage);
        }
    }, [activeView, activeTab, currentPage, fetchSimulations]);

    const handleGenerate = async () => {
        setIsGenerating(true); setGeneratedParams(null);
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
            const schema = {
                type: Type.OBJECT,
                properties: {
                    volatilityIndex: { type: Type.NUMBER, description: "Volatility index from 0.0 (calm) to 1.0 (extreme)." },
                    interestRateChange: { type: Type.NUMBER, description: "Expected interest rate change in basis points." },
                    marketSentiment: { type: Type.STRING, enum: ['Bearish', 'Neutral', 'Bullish'] },
                    simulationSteps: { type: Type.NUMBER, description: "Number of steps/days to simulate, typically 252 for a year." }
                },
                required: ['volatilityIndex', 'interestRateChange', 'marketSentiment', 'simulationSteps']
            };
            const fullPrompt = `You are a quantitative analyst. Generate a set of parameters for a financial market simulation based on this scenario: "${prompt}". Provide realistic and coherent values.`;
            const response = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: fullPrompt, config: { responseMimeType: "application/json", responseSchema: schema } });
            setGeneratedParams(JSON.parse(response.text));
        } catch (error) {
            console.error(error);
            setGeneratedParams({ error: "Failed to generate parameters. Please check your API key and try again." });
        } finally {
            setIsGenerating(false);
        }
    };
    
    const handleViewDetails = (id: string) => { setSelectedSimulationId(id); setActiveView('simulationDetail'); };
    const handleBackToDashboard = () => { setSelectedSimulationId(null); setActiveView('dashboard'); fetchSimulations(currentPage); };

    const renderDashboard = () => (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold text-white tracking-wider">Financial Simulation Hub</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card className="text-center"><p className="text-3xl font-bold text-white">{stats.active}</p><p className="text-sm text-gray-400 mt-1">Active Simulations</p></Card>
                <Card className="text-center"><p className="text-3xl font-bold text-white">521k</p><p className="text-sm text-gray-400 mt-1">Core Hours Used (MTD)</p></Card>
                <Card className="text-center"><p className="text-3xl font-bold text-white">{stats.pending}</p><p className="text-sm text-gray-400 mt-1">Pending Jobs</p></Card>
                <Card className="text-center"><p className="text-3xl font-bold text-green-400">{stats.completed}</p><p className="text-sm text-gray-400 mt-1">Completed Today</p></Card>
            </div>
            
            <div className="flex border-b border-gray-700">
                <button onClick={() => setActiveTab('generator')} className={`px-4 py-2 -mb-px border-b-2 text-sm font-medium ${activeTab === 'generator' ? 'border-cyan-500 text-cyan-400' : 'border-transparent text-gray-400 hover:text-white'}`}>AI Parameter Generator</button>
                <button onClick={() => setActiveTab('history')} className={`px-4 py-2 -mb-px border-b-2 text-sm font-medium ${activeTab === 'history' ? 'border-cyan-500 text-cyan-400' : 'border-transparent text-gray-400 hover:text-white'}`}>Simulation History</button>
            </div>
            
            {activeTab === 'generator' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                     <Card title="AI Simulation Parameter Generator">
                        <p className="text-gray-400 mb-4">Describe the market conditions you want to simulate. Our AI will generate the initial parameters for a Monte Carlo simulation.</p>
                        <textarea value={prompt} onChange={e => setPrompt(e.target.value)} className="w-full h-24 bg-gray-700/50 p-3 rounded text-white font-mono text-sm focus:ring-cyan-500 focus:border-cyan-500" placeholder="e.g., a recessionary environment with deflationary pressures and low consumer confidence" />
                        <button onClick={handleGenerate} disabled={isGenerating} className="w-full mt-4 py-2 bg-cyan-600 hover:bg-cyan-700 rounded disabled:opacity-50 transition-colors">{isGenerating ? 'Generating Parameters...' : 'Generate Parameters'}</button>
                    </Card>
                    <Card title="Generated Parameters">
                        {(isGenerating || generatedParams) ? (
                            <>
                                <pre className="text-xs text-gray-300 whitespace-pre-wrap font-mono bg-gray-900/50 p-4 rounded max-h-96 overflow-auto">
                                    {isGenerating ? 'Generating...' : JSON.stringify(generatedParams, null, 2)}
                                </pre>
                                {generatedParams && !generatedParams.error && <button className="w-full mt-4 py-2 bg-green-600 hover:bg-green-700 rounded transition-colors">Launch Simulation with these Parameters</button>}
                            </>
                        ) : (
                            <div className="flex items-center justify-center h-full text-gray-500">
                                <p>Generated parameters will appear here.</p>
                            </div>
                        )}
                    </Card>
                </div>
            )}
            
             {activeTab === 'history' && (
                <Card title="Simulation History">
                    <SimulationHistoryTable simulations={simulations} isLoading={isLoadingSimulations} onViewDetails={handleViewDetails} />
                    <Pagination currentPage={currentPage} totalItems={totalSimulations} itemsPerPage={itemsPerPage} onPageChange={setCurrentPage} />
                </Card>
            )}
        </div>
    );

    return (
        <>
            {activeView === 'dashboard' && renderDashboard()}
            {activeView === 'simulationDetail' && selectedSimulationId && (
                <SimulationDetailView simulationId={selectedSimulationId} onBack={handleBackToDashboard} />
            )}
        </>
    );
};

export default DemoBankSimulationsView;