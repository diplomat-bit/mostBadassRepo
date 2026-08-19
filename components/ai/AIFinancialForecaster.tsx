import React, { useState, useEffect, useCallback, useMemo, useReducer, createContext, useContext, useRef } from 'react';

/**
 * QUANTUM CORE FINANCIAL ORACLE v4.0
 * Module: ai.oracle.simulation_interface
 * 
 * An enterprise-grade, self-contained, zero-dependency financial forecasting,
 * risk analysis, and regulatory compliance simulation application.
 * Powered by a high-performance stochastic engine and simulated AI Oracle.
 * 
 * Features:
 * - Geometric Brownian Motion (GBM) & Monte Carlo Simulation Engine
 * - Black-Scholes Option Pricing & Greeks Hedging Simulator
 * - Value at Risk (VaR) & Conditional Value at Risk (CVaR) Risk Analytics
 * - Basel III Liquidity Coverage Ratio (LCR) & CCAR Stress Testing
 * - Interactive AI Oracle Chat & Narrative Generator
 * - Custom SVG Responsive Charting Engine (Line, Area, Confidence Bands, Histograms)
 * - Multi-Scenario Branching & Transaction Ledger State Management
 */

// ============================================================================
// 1. ENTERPRISE TYPE DEFINITIONS & SCHEMAS
// ============================================================================

export interface FinancialScenario {
  id: string;
  name: string;
  description: string;
  baseValue: number;          // Initial revenue/asset value ($M)
  growthRate: number;         // Annual growth rate (drift μ, %)
  volatility: number;         // Annual volatility (diffusion σ, %)
  horizonYears: number;       // Simulation time horizon (T)
  operatingExpenses: number;  // Annual OpEx as % of revenue
  capitalExpenditures: number;// Annual CapEx ($M)
  taxRate: number;            // Corporate tax rate (%)
  debtRatio: number;          // Debt-to-Equity ratio (%)
  interestRate: number;       // Cost of debt (%)
  riskFreeRate: number;       // Risk-free rate for discounting (%)
  liquidityReserve: number;   // Cash & high-quality liquid assets ($M)
  stressScenario: 'none' | 'pandemic' | 'financial_crisis' | 'inflation_shock' | 'tech_bubble';
}

export interface SimulationPath {
  pathId: number;
  values: number[];
}

export interface PercentileData {
  year: number;
  p10: number;
  p25: number;
  p50: number;
  p75: number;
  p90: number;
  mean: number;
}

export interface RiskMetrics {
  valueAtRisk95: number;
  valueAtRisk99: number;
  conditionalVaR95: number;
  conditionalVaR99: number;
  maxDrawdown: number;
  sharpeRatio: number;
  sortinoRatio: number;
  volatilityIndex: number;
  probabilityOfInsolvency: number;
}

export interface ComplianceMetrics {
  basel3Lcr: number;          // Liquidity Coverage Ratio (%)
  ccarStatus: 'PASS' | 'WARNING' | 'FAIL';
  doddFrankScore: number;     // Stress test score (0-100)
  capitalAdequacyRatio: number; // CAR (%)
  netStableFundingRatio: number; // NSFR (%)
  auditTrailHash: string;
}

export interface AIOpinion {
  narrativeSummary: string;
  keyImpacts: Array<{
    metric: string;
    value: string;
    change: string;
    severity: 'low' | 'medium' | 'high';
    description: string;
  }>;
  recommendations: Array<{
    id: string;
    title: string;
    description: string;
    impactScore: number; // 1-10
    feasibilityScore: number; // 1-10
    category: 'hedging' | 'liquidity' | 'capital' | 'operations';
  }>;
  hedgingStrategy: {
    recommendedOptions: 'calls' | 'puts' | 'collar' | 'none';
    strikePrice: number;
    premiumCost: number;
    deltaHedgingRatio: number;
    estimatedRiskReduction: number;
  };
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'oracle';
  text: string;
  timestamp: Date;
  metadata?: any;
}

export interface SimulationResult {
  scenarioId: string;
  timestamp: number;
  percentiles: PercentileData[];
  rawPaths: SimulationPath[];
  riskMetrics: RiskMetrics;
  complianceMetrics: ComplianceMetrics;
  aiOpinion: AIOpinion;
}

export interface AppState {
  scenarios: FinancialScenario[];
  activeScenarioId: string;
  simulationResults: Record<string, SimulationResult>;
  isSimulating: boolean;
  chatHistory: ChatMessage[];
  isChatLoading: boolean;
  activeTab: 'dashboard' | 'builder' | 'montecarlo' | 'oracle' | 'compliance' | 'ledger';
  ledger: Array<{
    id: string;
    timestamp: number;
    action: string;
    details: string;
    hash: string;
  }>;
}

// ============================================================================
// 2. HIGH-PERFORMANCE MATHEMATICAL & STOCHASTIC ENGINE
// ============================================================================

/**
 * Box-Muller Transform for generating standard normal random variables (mean=0, stdDev=1).
 * Uses high-precision floating point arithmetic.
 */
export const boxMullerTransform = (): { z0: number; z1: number } => {
  let u1 = 0;
  let u2 = 0;
  // Avoid 0 to prevent log(0)
  while (u1 === 0) u1 = Math.random();
  while (u2 === 0) u2 = Math.random();

  const r = Math.sqrt(-2.0 * Math.log(u1));
  const theta = 2.0 * Math.PI * u2;

  return {
    z0: r * Math.cos(theta),
    z1: r * Math.sin(theta)
  };
};

/**
 * Generates a single path of Geometric Brownian Motion (GBM).
 * dS_t = \mu S_t dt + \sigma S_t dW_t
 * Analytical solution: S_t = S_0 \exp( (\mu - \sigma^2 / 2)t + \sigma W_t )
 */
export const generateGBMPath = (
  S0: number,
  mu: number, // Annual drift (decimal)
  sigma: number, // Annual volatility (decimal)
  T: number, // Time horizon in years
  steps: number, // Number of steps
  stressFactor: number = 1.0
): number[] => {
  const dt = T / steps;
  const path: number[] = [S0];
  let currentS = S0;

  // Apply stress factor to volatility and drift if active
  const adjustedMu = mu * (stressFactor < 1.0 ? stressFactor * 0.5 : 1.0);
  const adjustedSigma = sigma * stressFactor;

  for (let i = 1; i <= steps; i++) {
    const { z0 } = boxMullerTransform();
    const exponent = (adjustedMu - 0.5 * adjustedSigma * adjustedSigma) * dt + adjustedSigma * z0 * Math.sqrt(dt);
    currentS = currentS * Math.exp(exponent);
    path.push(Math.max(0, currentS)); // Prevent negative asset values
  }

  return path;
};

/**
 * Calculates the Black-Scholes option price and Greeks for hedging strategies.
 */
export const calculateBlackScholes = (
  S: number, // Current stock price
  K: number, // Strike price
  T: number, // Time to expiration in years
  r: number, // Risk-free interest rate (decimal)
  sigma: number, // Volatility (decimal)
  optionType: 'call' | 'put'
): { price: number; delta: number; gamma: number; vega: number; theta: number; rho: number } => {
  if (T <= 0) {
    const payoff = optionType === 'call' ? Math.max(0, S - K) : Math.max(0, K - S);
    return { price: payoff, delta: 0, gamma: 0, vega: 0, theta: 0, rho: 0 };
  }

  const d1 = (Math.log(S / K) + (r + 0.5 * sigma * sigma) * T) / (sigma * Math.sqrt(T));
  const d2 = d1 - sigma * Math.sqrt(T);

  // Cumulative normal distribution helper
  const cnd = (x: number): number => {
    const a1 = 0.319381530;
    const a2 = -0.356563782;
    const a3 = 1.781477937;
    const a4 = -1.821255978;
    const a5 = 1.330274429;
    const L = Math.abs(x);
    const K_val = 1.0 / (1.0 + 0.2316419 * L);
    let d = 1.0 - 1.0 / Math.sqrt(2 * Math.PI) * Math.exp(-L * L / 2) * 
            (a1 * K_val + a2 * Math.pow(K_val, 2) + a3 * Math.pow(K_val, 3) + a4 * Math.pow(K_val, 4) + a5 * Math.pow(K_val, 5));
    if (x < 0) d = 1.0 - d;
    return d;
  };

  // Normal probability density function helper
  const npdf = (x: number): number => {
    return (1.0 / Math.sqrt(2 * Math.PI)) * Math.exp(-0.5 * x * x);
  };

  const Nd1 = cnd(d1);
  const Nd2 = cnd(d2);
  const N_d1 = cnd(-d1);
  const N_d2 = cnd(-d2);

  let price = 0;
  let delta = 0;

  if (optionType === 'call') {
    price = S * Nd1 - K * Math.exp(-r * T) * Nd2;
    delta = Nd1;
  } else {
    price = K * Math.exp(-r * T) * N_d2 - S * N_d1;
    delta = Nd1 - 1;
  }

  const gamma = npdf(d1) / (S * sigma * Math.sqrt(T));
  const vega = S * Math.sqrt(T) * npdf(d1);
  
  let theta = 0;
  if (optionType === 'call') {
    theta = -(S * npdf(d1) * sigma) / (2 * Math.sqrt(T)) - r * K * Math.exp(-r * T) * Nd2;
  } else {
    theta = -(S * npdf(d1) * sigma) / (2 * Math.sqrt(T)) + r * K * Math.exp(-r * T) * N_d2;
  }

  let rho = 0;
  if (optionType === 'call') {
    rho = K * T * Math.exp(-r * T) * Nd2;
  } else {
    rho = -K * T * Math.exp(-r * T) * N_d2;
  }

  return { price, delta, gamma, vega, theta, rho };
};

/**
 * Runs a comprehensive Monte Carlo simulation with thousands of paths.
 * Computes percentiles, Value at Risk (VaR), Conditional Value at Risk (CVaR),
 * and stress-tested compliance metrics.
 */
export const runMonteCarloSimulation = (
  scenario: FinancialScenario,
  numPaths: number = 2000
): SimulationResult => {
  const {
    id: scenarioId,
    baseValue,
    growthRate,
    volatility,
    horizonYears,
    operatingExpenses,
    capitalExpenditures,
    taxRate,
    debtRatio,
    interestRate,
    riskFreeRate,
    liquidityReserve,
    stressScenario
  } = scenario;

  const mu = growthRate / 100;
  const sigma = volatility / 100;
  const stepsPerYear = 12; // Monthly steps
  const totalSteps = horizonYears * stepsPerYear;

  // Determine stress factor based on scenario
  let stressFactor = 1.0;
  let stressDriftAdjustment = 0.0;
  if (stressScenario === 'pandemic') {
    stressFactor = 1.8;
    stressDriftAdjustment = -0.15;
  } else if (stressScenario === 'financial_crisis') {
    stressFactor = 2.2;
    stressDriftAdjustment = -0.25;
  } else if (stressScenario === 'inflation_shock') {
    stressFactor = 1.5;
    stressDriftAdjustment = -0.05;
  } else if (stressScenario === 'tech_bubble') {
    stressFactor = 2.0;
    stressDriftAdjustment = -0.20;
  }

  const adjustedMu = mu + stressDriftAdjustment;
  const adjustedSigma = sigma * stressFactor;

  // Generate paths
  const rawPaths: SimulationPath[] = [];
  for (let p = 0; p < numPaths; p++) {
    const values = generateGBMPath(baseValue, adjustedMu, adjustedSigma, horizonYears, totalSteps, 1.0);
    rawPaths.push({ pathId: p, values });
  }

  // Calculate percentiles for each year
  const percentiles: PercentileData[] = [];
  for (let year = 0; year <= horizonYears; year++) {
    const stepIndex = year * stepsPerYear;
    const valuesAtYear = rawPaths.map(p => p.values[stepIndex]).sort((a, b) => a - b);

    const p10 = valuesAtYear[Math.floor(numPaths * 0.10)];
    const p25 = valuesAtYear[Math.floor(numPaths * 0.25)];
    const p50 = valuesAtYear[Math.floor(numPaths * 0.50)];
    const p75 = valuesAtYear[Math.floor(numPaths * 0.75)];
    const p90 = valuesAtYear[Math.floor(numPaths * 0.90)];
    const mean = valuesAtYear.reduce((sum, val) => sum + val, 0) / numPaths;

    percentiles.push({
      year,
      p10,
      p25,
      p50,
      p75,
      p90,
      mean
    });
  }

  // Calculate terminal returns for risk metrics
  const terminalValues = rawPaths.map(p => p.values[totalSteps]);
  const initialValue = baseValue;
  const terminalReturns = terminalValues.map(v => (v - initialValue) / initialValue).sort((a, b) => a - b);

  // Value at Risk (VaR)
  // VaR 95% is the 5th percentile of returns
  const var95Index = Math.floor(numPaths * 0.05);
  const valueAtRisk95 = -terminalReturns[var95Index];

  // VaR 99% is the 1st percentile of returns
  const var99Index = Math.floor(numPaths * 0.01);
  const valueAtRisk99 = -terminalReturns[var99Index];

  // Conditional Value at Risk (CVaR) / Expected Shortfall
  const conditionalVaR95 = -terminalReturns.slice(0, var95Index + 1).reduce((sum, val) => sum + val, 0) / (var95Index + 1);
  const conditionalVaR99 = -terminalReturns.slice(0, var99Index + 1).reduce((sum, val) => sum + val, 0) / (var99Index + 1);

  // Max Drawdown calculation across all paths
  let totalMaxDrawdown = 0;
  for (const path of rawPaths) {
    let peak = path.values[0];
    let maxDd = 0;
    for (const val of path.values) {
      if (val > peak) {
        peak = val;
      }
      const dd = peak > 0 ? (peak - val) / peak : 0;
      if (dd > maxDd) {
        maxDd = dd;
      }
    }
    totalMaxDrawdown += maxDd;
  }
  const averageMaxDrawdown = totalMaxDrawdown / numPaths;

  // Sharpe & Sortino Ratios
  const annualReturns = rawPaths.map(p => {
    const terminal = p.values[totalSteps];
    const cagr = terminal > 0 ? Math.pow(terminal / baseValue, 1 / horizonYears) - 1 : -1.0;
    return cagr;
  });

  const avgAnnualReturn = annualReturns.reduce((sum, r) => sum + r, 0) / numPaths;
  const rf = riskFreeRate / 100;

  const variance = annualReturns.reduce((sum, r) => sum + Math.pow(r - avgAnnualReturn, 2), 0) / (numPaths - 1);
  const stdDev = Math.sqrt(variance);
  const sharpeRatio = stdDev > 0 ? (avgAnnualReturn - rf) / stdDev : 0;

  const downsideVariance = annualReturns
    .filter(r => r < rf)
    .reduce((sum, r) => sum + Math.pow(r - rf, 2), 0) / numPaths;
  const downsideStdDev = Math.sqrt(downsideVariance);
  const sortinoRatio = downsideStdDev > 0 ? (avgAnnualReturn - rf) / downsideStdDev : 0;

  // Probability of Insolvency (value drops below 10% of initial value at any point)
  const insolventPaths = rawPaths.filter(p => p.values.some(v => v < baseValue * 0.10)).length;
  const probabilityOfInsolvency = insolventPaths / numPaths;

  const riskMetrics: RiskMetrics = {
    valueAtRisk95: Math.max(0, valueAtRisk95),
    valueAtRisk99: Math.max(0, valueAtRisk99),
    conditionalVaR95: Math.max(0, conditionalVaR95),
    conditionalVaR99: Math.max(0, conditionalVaR99),
    maxDrawdown: averageMaxDrawdown,
    sharpeRatio,
    sortinoRatio,
    volatilityIndex: adjustedSigma,
    probabilityOfInsolvency
  };

  // Compliance Metrics (Basel III, CCAR, Dodd-Frank)
  // Basel III Liquidity Coverage Ratio (LCR) = HQLA / Net Cash Outflows over 30 days
  // Let's simulate net cash outflows as a function of volatility, debt ratio, and operating expenses
  const simulatedMonthlyOpEx = (baseValue * (operatingExpenses / 100)) / 12;
  const simulatedDebtService = (baseValue * (debtRatio / 100) * (interestRate / 100)) / 12;
  const stressOutflowMultiplier = 1.0 + (adjustedSigma * 1.5) + (stressScenario !== 'none' ? 0.5 : 0.0);
  const netCashOutflows30Days = (simulatedMonthlyOpEx + simulatedDebtService) * stressOutflowMultiplier;
  const basel3Lcr = netCashOutflows30Days > 0 ? (liquidityReserve / netCashOutflows30Days) * 100 : 999.9;

  // Capital Adequacy Ratio (CAR) = (Tier 1 Capital + Tier 2 Capital) / Risk Weighted Assets
  // Tier 1 Capital is simulated as liquidity reserve + 20% of baseValue
  // Risk Weighted Assets is simulated as baseValue * (1.0 + adjustedSigma)
  const tier1Capital = liquidityReserve + (baseValue * 0.20);
  const riskWeightedAssets = baseValue * (1.0 + adjustedSigma);
  const capitalAdequacyRatio = riskWeightedAssets > 0 ? (tier1Capital / riskWeightedAssets) * 100 : 100;

  // Net Stable Funding Ratio (NSFR) = Available Stable Funding / Required Stable Funding
  const availableStableFunding = tier1Capital + (baseValue * (debtRatio / 100) * 0.5);
  const requiredStableFunding = baseValue * 0.4;
  const netStableFundingRatio = requiredStableFunding > 0 ? (availableStableFunding / requiredStableFunding) * 100 : 100;

  // CCAR Status
  let ccarStatus: 'PASS' | 'WARNING' | 'FAIL' = 'PASS';
  if (basel3Lcr < 100 || capitalAdequacyRatio < 8 || probabilityOfInsolvency > 0.15) {
    ccarStatus = 'FAIL';
  } else if (basel3Lcr < 120 || capitalAdequacyRatio < 10.5 || probabilityOfInsolvency > 0.05) {
    ccarStatus = 'WARNING';
  }

  // Dodd-Frank Score (0-100)
  const doddFrankScore = Math.max(0, Math.min(100, Math.round(
    100 - (probabilityOfInsolvency * 300) - (averageMaxDrawdown * 50) + (Math.min(200, basel3Lcr) / 10)
  )));

  // Generate a mock cryptographic hash for audit trail
  const auditTrailHash = Array.from({ length: 32 })
    .map(() => Math.floor(Math.random() * 16).toString(16))
    .join('');

  const complianceMetrics: ComplianceMetrics = {
    basel3Lcr,
    ccarStatus,
    doddFrankScore,
    capitalAdequacyRatio,
    netStableFundingRatio,
    auditTrailHash
  };

  // Generate AI Opinion
  const aiOpinion = generateAIOpinion(scenario, riskMetrics, complianceMetrics, percentiles);

  return {
    scenarioId,
    timestamp: Date.now(),
    percentiles,
    rawPaths,
    riskMetrics,
    complianceMetrics,
    aiOpinion
  };
};

/**
 * Generates highly detailed, context-aware AI opinions, narrative summaries,
 * key impacts, and actionable recommendations based on simulation results.
 */
export const generateAIOpinion = (
  scenario: FinancialScenario,
  risk: RiskMetrics,
  compliance: ComplianceMetrics,
  percentiles: PercentileData[]
): AIOpinion => {
  const terminalP50 = percentiles[percentiles.length - 1].p50;
  const terminalP10 = percentiles[percentiles.length - 1].p10;
  const terminalP90 = percentiles[percentiles.length - 1].p90;
  const growthMultiplier = terminalP50 / scenario.baseValue;
  const totalGrowthPct = (growthMultiplier - 1) * 100;

  // Narrative Summary Generation
  let narrativeSummary = '';
  if (scenario.stressScenario !== 'none') {
    narrativeSummary = `Under the stressed conditions of the "${scenario.stressScenario.replace('_', ' ').toUpperCase()}" scenario, the financial model projects a highly volatile trajectory. `;
  } else {
    narrativeSummary = `Under normal market conditions, the base model projects a steady expansion. `;
  }

  narrativeSummary += `Starting from an initial asset base of $${scenario.baseValue.toFixed(1)}M, the median (P50) projection reaches $${terminalP50.toFixed(1)}M over ${scenario.horizonYears} years, representing a cumulative growth of ${totalGrowthPct.toFixed(1)}%. However, due to an annual volatility of ${scenario.volatility}%, there is a significant dispersion of outcomes. The pessimistic (P10) downside is bounded at $${terminalP10.toFixed(1)}M, while the optimistic (P90) upside could reach $${terminalP90.toFixed(1)}M. `;

  if (compliance.ccarStatus === 'FAIL') {
    narrativeSummary += `CRITICAL WARNING: The current configuration fails the Comprehensive Capital Analysis and Review (CCAR) stress test. This is primarily driven by a Liquidity Coverage Ratio (LCR) of ${compliance.basel3Lcr.toFixed(1)}%, which falls below the regulatory minimum of 100%. Immediate capital preservation and hedging measures are highly recommended.`;
  } else if (compliance.ccarStatus === 'WARNING') {
    narrativeSummary += `CAUTION: The model indicates elevated risk levels. While the CCAR stress test passes, the capital adequacy buffers are thin, and the Dodd-Frank stress score is at ${compliance.doddFrankScore}/100. Volatility mitigation strategies should be explored.`;
  } else {
    narrativeSummary += `The financial posture remains exceptionally robust. The Liquidity Coverage Ratio (LCR) is optimal at ${compliance.basel3Lcr.toFixed(1)}%, and the Capital Adequacy Ratio (CAR) of ${compliance.capitalAdequacyRatio.toFixed(1)}% provides a substantial buffer against market shocks.`;
  }

  // Key Impacts
  const keyImpacts: AIOpinion['keyImpacts'] = [
    {
      metric: 'Capital Growth (P50)',
      value: `$${terminalP50.toFixed(1)}M`,
      change: `${totalGrowthPct >= 0 ? '+' : ''}${totalGrowthPct.toFixed(1)}%`,
      severity: totalGrowthPct > 20 ? 'low' : totalGrowthPct > 0 ? 'medium' : 'high',
      description: 'The median projected asset value at the end of the simulation horizon.'
    },
    {
      metric: 'Value at Risk (95% VaR)',
      value: `${(risk.valueAtRisk95 * 100).toFixed(1)}%`,
      change: 'Downside Risk',
      severity: risk.valueAtRisk95 > 0.3 ? 'high' : risk.valueAtRisk95 > 0.15 ? 'medium' : 'low',
      description: 'The maximum expected loss over the horizon with 95% confidence.'
    },
    {
      metric: 'Liquidity Coverage Ratio',
      value: `${compliance.basel3Lcr.toFixed(1)}%`,
      change: compliance.basel3Lcr >= 100 ? 'Compliant' : 'Non-Compliant',
      severity: compliance.basel3Lcr >= 120 ? 'low' : compliance.basel3Lcr >= 100 ? 'medium' : 'high',
      description: 'Basel III metric measuring high-quality liquid assets against 30-day stressed outflows.'
    },
    {
      metric: 'Insolvency Probability',
      value: `${(risk.probabilityOfInsolvency * 100).toFixed(1)}%`,
      change: 'Tail Risk',
      severity: risk.probabilityOfInsolvency > 0.1 ? 'high' : risk.probabilityOfInsolvency > 0.02 ? 'medium' : 'low',
      description: 'The probability that the asset value drops below 10% of its initial value.'
    }
  ];

  // Recommendations
  const recommendations: AIOpinion['recommendations'] = [];

  if (compliance.basel3Lcr < 120) {
    recommendations.push({
      id: 'REC-001',
      title: 'Increase High-Quality Liquid Assets (HQLA)',
      description: `Your Liquidity Coverage Ratio is currently at ${compliance.basel3Lcr.toFixed(1)}%. We recommend increasing your cash reserves or short-term government bond holdings by $${(scenario.baseValue * 0.05).toFixed(1)}M to secure a safer liquidity buffer.`,
      impactScore: 9,
      feasibilityScore: 8,
      category: 'liquidity'
    });
  }

  if (risk.valueAtRisk95 > 0.25) {
    recommendations.push({
      id: 'REC-002',
      title: 'Implement Put Option Hedging Strategy',
      description: `With a 95% Value at Risk of ${(risk.valueAtRisk95 * 100).toFixed(1)}%, the downside exposure is severe. Purchasing protective put options with a strike price at 90% of current value will cap your maximum loss.`,
      impactScore: 8,
      feasibilityScore: 7,
      category: 'hedging'
    });
  }

  if (scenario.debtRatio > 50 && scenario.interestRate > 5) {
    recommendations.push({
      id: 'REC-003',
      title: 'Deleverage Balance Sheet / Debt Restructuring',
      description: `Your debt-to-equity ratio is high at ${scenario.debtRatio}%. Restructuring high-interest debt or issuing equity to pay down debt will reduce fixed interest expenses and improve CCAR stress test performance.`,
      impactScore: 7,
      feasibilityScore: 5,
      category: 'capital'
    });
  }

  if (scenario.operatingExpenses > 40) {
    recommendations.push({
      id: 'REC-004',
      title: 'Optimize Operating Expenditures (OpEx)',
      description: `Operating expenses are high at ${scenario.operatingExpenses}% of revenue. Implementing cost-control measures to reduce OpEx by 5% will significantly improve cash flow stability and terminal value.`,
      impactScore: 6,
      feasibilityScore: 6,
      category: 'operations'
    });
  }

  // Fallback recommendation if none triggered
  if (recommendations.length === 0) {
    recommendations.push({
      id: 'REC-005',
      title: 'Opportunistic Capital Reinvestment',
      description: 'Your financial metrics are exceptionally strong. Consider allocating excess liquidity into high-yield capital expenditures or strategic acquisitions to accelerate growth.',
      impactScore: 7,
      feasibilityScore: 9,
      category: 'capital'
    });
  }

  // Hedging Strategy Calculation using Black-Scholes
  const strikePrice = scenario.baseValue * 0.95; // 5% out of the money put
  const bs = calculateBlackScholes(
    scenario.baseValue,
    strikePrice,
    1.0, // 1 year option
    scenario.riskFreeRate / 100,
    scenario.volatility / 100,
    'put'
  );

  const hedgingStrategy: AIOpinion['hedgingStrategy'] = {
    recommendedOptions: risk.valueAtRisk95 > 0.2 ? 'puts' : 'none',
    strikePrice,
    premiumCost: bs.price,
    deltaHedgingRatio: Math.abs(bs.delta),
    estimatedRiskReduction: risk.valueAtRisk95 > 0.2 ? 45 : 0
  };

  return {
    narrativeSummary,
    keyImpacts,
    recommendations,
    hedgingStrategy
  };
};

// ============================================================================
// 3. STATE MANAGEMENT & REDUCER SYSTEM
// ============================================================================

export const INITIAL_STATE: AppState = {
  scenarios: [
    {
      id: '1',
      name: 'Base Case',
      description: 'Standard operating scenario with moderate growth and historical volatility.',
      baseValue: 100,
      growthRate: 12,
      volatility: 15,
      horizonYears: 5,
      operatingExpenses: 35,
      capitalExpenditures: 10,
      taxRate: 21,
      debtRatio: 30,
      interestRate: 6,
      riskFreeRate: 4.5,
      liquidityReserve: 25,
      stressScenario: 'none'
    }
  ],
  activeScenarioId: '1',
  simulationResults: {},
  isSimulating: false,
  chatHistory: [
    {
      id: 'init',
      sender: 'oracle',
      text: 'Welcome to the Quantum Core Financial Oracle. I have loaded your Base Case scenario. Engage the simulation engine or ask me any questions about your financial risk and compliance posture.',
      timestamp: new Date()
    }
  ],
  isChatLoading: false,
  activeTab: 'dashboard',
  ledger: [
    {
      id: 'L-001',
      timestamp: Date.now(),
      action: 'SYSTEM_INIT',
      details: 'Quantum Core Financial Oracle initialized with Base Case scenario.',
      hash: '8f9a2b3c4d5e6f7a8b9c0d1e2f3a4b5c'
    }
  ]
};

export type AppAction =
  | { type: 'SET_ACTIVE_TAB'; payload: AppState['activeTab'] }
  | { type: 'ADD_SCENARIO'; payload: FinancialScenario }
  | { type: 'UPDATE_SCENARIO'; payload: { id: string; updates: Partial<FinancialScenario> } }
  | { type: 'REMOVE_SCENARIO'; payload: string }
  | { type: 'SET_ACTIVE_SCENARIO'; payload: string }
  | { type: 'START_SIMULATION' }
  | { type: 'COMPLETE_SIMULATION'; payload: { scenarioId: string; result: SimulationResult } }
  | { type: 'ADD_CHAT_MESSAGE'; payload: ChatMessage }
  | { type: 'SET_CHAT_LOADING'; payload: boolean }
  | { type: 'ADD_LEDGER_ENTRY'; payload: { action: string; details: string } };

export const appReducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
    case 'SET_ACTIVE_TAB':
      return { ...state, activeTab: action.payload };
    case 'ADD_SCENARIO':
      return {
        ...state,
        scenarios: [...state.scenarios, action.payload],
        activeScenarioId: action.payload.id
      };
    case 'UPDATE_SCENARIO':
      return {
        ...state,
        scenarios: state.scenarios.map(s =>
          s.id === action.payload.id ? { ...s, ...action.payload.updates } : s
        )
      };
    case 'REMOVE_SCENARIO': {
      const filtered = state.scenarios.filter(s => s.id !== action.payload);
      const nextActive = state.activeScenarioId === action.payload ? filtered[0]?.id || '' : state.activeScenarioId;
      return {
        ...state,
        scenarios: filtered,
        activeScenarioId: nextActive
      };
    }
    case 'SET_ACTIVE_SCENARIO':
      return { ...state, activeScenarioId: action.payload };
    case 'START_SIMULATION':
      return { ...state, isSimulating: true };
    case 'COMPLETE_SIMULATION':
      return {
        ...state,
        isSimulating: false,
        simulationResults: {
          ...state.simulationResults,
          [action.payload.scenarioId]: action.payload.result
        }
      };
    case 'ADD_CHAT_MESSAGE':
      return {
        ...state,
        chatHistory: [...state.chatHistory, action.payload]
      };
    case 'SET_CHAT_LOADING':
      return { ...state, isChatLoading: action.payload };
    case 'ADD_LEDGER_ENTRY': {
      const id = `L-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;
      const timestamp = Date.now();
      const hash = Array.from({ length: 32 })
        .map(() => Math.floor(Math.random() * 16).toString(16))
        .join('');
      return {
        ...state,
        ledger: [
          ...state.ledger,
          {
            id,
            timestamp,
            action: action.payload.action,
            details: action.payload.details,
            hash
          }
        ]
      };
    }
    default:
      return state;
  }
};

// ============================================================================
// 4. REACT CONTEXT & PROVIDER SYSTEM
// ============================================================================

interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  runSimulationForActiveScenario: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, INITIAL_STATE);

  const runSimulationForActiveScenario = useCallback(() => {
    const activeScenario = state.scenarios.find(s => s.id === state.activeScenarioId);
    if (!activeScenario) return;

    dispatch({ type: 'START_SIMULATION' });
    dispatch({
      type: 'ADD_LEDGER_ENTRY',
      payload: {
        action: 'SIMULATION_START',
        details: `Started Monte Carlo simulation for scenario: ${activeScenario.name}`
      }
    });

    // Simulate async processing to allow UI to show loading state
    setTimeout(() => {
      try {
        const result = runMonteCarloSimulation(activeScenario, 2000);
        dispatch({
          type: 'COMPLETE_SIMULATION',
          payload: { scenarioId: activeScenario.id, result }
        });
        dispatch({
          type: 'ADD_LEDGER_ENTRY',
          payload: {
            action: 'SIMULATION_COMPLETE',
            details: `Completed simulation for ${activeScenario.name}. CCAR Status: ${result.complianceMetrics.ccarStatus}`
          }
        });
      } catch (error: any) {
        console.error('Simulation failed:', error);
        dispatch({
          type: 'ADD_LEDGER_ENTRY',
          payload: {
            action: 'SIMULATION_ERROR',
            details: `Simulation failed for ${activeScenario.name}: ${error.message}`
          }
        });
      }
    }, 600);
  }, [state.activeScenarioId, state.scenarios]);

  // Run initial simulation on mount
  useEffect(() => {
    runSimulationForActiveScenario();
  }, [state.activeScenarioId]);

  const value = useMemo(() => ({
    state,
    dispatch,
    runSimulationForActiveScenario
  }), [state, runSimulationForActiveScenario]);

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};// ============================================================================
// 5. ZERO-DEPENDENCY ENTERPRISE UI SYSTEM
// ============================================================================

/**
 * High-performance, accessible SVG Icon component with pre-compiled paths.
 */
export const Icon: React.FC<{
  name: 'chart' | 'brain' | 'shield' | 'alert' | 'check' | 'refresh' | 'settings' | 'plus' | 'trash' | 'trending' | 'chat' | 'ledger' | 'download' | 'info' | 'close' | 'user' | 'oracle' | 'scale' | 'database' | 'lock' | 'arrowRight' | 'help';
  className?: string;
}> = ({ name, className = "w-4 h-4" }) => {
  const paths: Record<string, string> = {
    chart: "M3 3v18h18 M18 17V9 M13 17V5 M8 17v-3",
    brain: "M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 5.76 0 2.5 2.5 0 0 1 0 5.58",
    shield: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z",
    alert: "M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z M12 9v4 M12 17h.01",
    check: "M20 6L9 17l-5-5",
    refresh: "M23 4v6h-6 M1 20v-6h6",
    settings: "M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.1a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z",
    plus: "M12 5v14M5 12h14",
    trash: "M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2",
    trending: "M23 6l-9.5 9.5-5-5L1 18",
    chat: "M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z",
    ledger: "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z M14 2v6h6 M16 13H8M16 17H8M10 9H8",
    download: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3",
    info: "M12 16v-4M12 8h.01 M22 12A10 10 0 1 1 12 2a10 10 0 0 1 10 10z",
    close: "M18 6L6 18M6 6l12 12",
    user: "M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z",
    oracle: "M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5",
    scale: "M16 16v1a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h11a2 2 0 0 1 2 2v1M18 8h4a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2h-4M21 12h.01",
    database: "M12 5c5.523 0 10-1.79 10-4s-4.477-4-10-4-10 1.79-10 4 4.477 4 10 4z M12 12c5.523 0 10-1.79 10-4s-4.477-4-10-4-10 1.79-10 4 4.477 4 10 4z M12 19c5.523 0 10-1.79 10-4s-4.477-4-10-4-10 1.79-10 4 4.477 4 10 4z",
    lock: "M17 11a5 5 0 0 0-10 0M5 11h14a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2z",
    arrowRight: "M5 12h14M12 5l7 7-7 7",
    help: "M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3M12 17h.01 M22 12A10 10 0 1 1 12 2a10 10 0 0 1 10 10z"
  };

  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={paths[name] || paths.chart} />
    </svg>
  );
};

/**
 * Enterprise Card Component with sub-sections.
 */
export const Card: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = "" }) => (
  <div className={`bg-slate-900/40 border border-slate-800/80 rounded-xl shadow-2xl backdrop-blur-md overflow-hidden transition-all duration-300 hover:border-slate-700/50 ${className}`}>
    {children}
  </div>
);

export const CardHeader: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = "" }) => (
  <div className={`px-6 py-4 border-b border-slate-800/60 flex items-center justify-between ${className}`}>
    {children}
  </div>
);

export const CardBody: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = "" }) => (
  <div className={`p-6 ${className}`}>
    {children}
  </div>
);

export const CardFooter: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = "" }) => (
  <div className={`px-6 py-4 border-t border-slate-800/60 bg-slate-950/30 flex items-center justify-between ${className}`}>
    {children}
  </div>
);

/**
 * Highly customizable, accessible Button component.
 */
export const Button: React.FC<{
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive' | 'glow';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  className?: string;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
}> = ({
  onClick,
  children,
  variant = "primary",
  size = "md",
  className = "",
  disabled = false,
  type = "button"
}) => {
  const base = "inline-flex items-center justify-center font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-950 focus:ring-blue-500 disabled:opacity-40 disabled:pointer-events-none select-none";
  
  const variants = {
    primary: "bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-900/20 border border-blue-500/30",
    secondary: "bg-slate-800 hover:bg-slate-700 text-slate-100 border border-slate-700/50",
    outline: "border border-slate-700 hover:border-slate-600 hover:bg-slate-800/40 text-slate-300",
    ghost: "hover:bg-slate-800/50 text-slate-400 hover:text-slate-200",
    destructive: "bg-red-950/40 hover:bg-red-900/60 text-red-400 border border-red-900/50",
    glow: "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-[0_0_15px_rgba(59,130,246,0.5)] border border-blue-400/30"
  };

  const sizes = {
    sm: "h-8 px-3 text-xs rounded-md gap-1.5",
    md: "h-10 px-4 py-2 text-sm rounded-lg gap-2",
    lg: "h-12 px-6 text-base rounded-xl gap-2.5",
    icon: "h-9 w-9 rounded-md"
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {children}
    </button>
  );
};

/**
 * Robust Input component with error state and styling.
 */
export const Input: React.FC<{
  label?: string;
  error?: string;
  helperText?: string;
  className?: string;
  [key: string]: any;
}> = ({ label, error, helperText, className = "", ...props }) => {
  const id = useRef(`input-${Math.random().toString(36).substring(2, 9)}`).current;
  return (
    <div className="space-y-1.5 w-full">
      {label && (
        <label htmlFor={id} className="block text-xs font-bold text-slate-400 uppercase tracking-wider">
          {label}
        </label>
      )}
      <input
        id={id}
        {...props}
        className={`flex h-10 w-full rounded-lg border bg-slate-950/50 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200 ${
          error ? 'border-red-500/60 focus:ring-red-500/30' : 'border-slate-800 hover:border-slate-700'
        } ${className}`}
      />
      {error && <p className="text-xs text-red-400 font-medium">{error}</p>}
      {!error && helperText && <p className="text-xs text-slate-500">{helperText}</p>}
    </div>
  );
};

/**
 * Custom Slider component with visual track and value display.
 */
export const Slider: React.FC<{
  label: string;
  min: number;
  max: number;
  step?: number;
  value: number;
  suffix?: string;
  onChange: (val: number) => void;
  helperText?: string;
}> = ({ label, min, max, step = 1, value, suffix = "", onChange, helperText }) => {
  const percentage = ((value - min) / (max - min)) * 100;

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">{label}</label>
        <span className="font-mono text-xs font-bold bg-slate-800/80 text-blue-400 px-2 py-0.5 rounded border border-slate-700/50">
          {value}
          {suffix}
        </span>
      </div>
      <div className="relative w-full h-6 flex items-center">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
          style={{
            background: `linear-gradient(to right, rgb(59, 130, 246) 0%, rgb(59, 130, 246) ${percentage}%, rgb(30, 41, 59) ${percentage}%, rgb(30, 41, 59) 100%)`
          }}
        />
      </div>
      {helperText && <p className="text-[11px] text-slate-500 leading-normal">{helperText}</p>}
    </div>
  );
};

/**
 * Badge component for status and metrics.
 */
export const Badge: React.FC<{
  children: React.ReactNode;
  color?: 'slate' | 'green' | 'blue' | 'amber' | 'red' | 'purple';
  className?: string;
}> = ({ children, color = "slate", className = "" }) => {
  const colors = {
    slate: "bg-slate-800/80 text-slate-300 border-slate-700/50",
    green: "bg-emerald-950/40 text-emerald-400 border-emerald-900/50",
    blue: "bg-blue-950/40 text-blue-400 border-blue-900/50",
    amber: "bg-amber-950/40 text-amber-400 border-amber-900/50",
    red: "bg-red-950/40 text-red-400 border-red-900/50",
    purple: "bg-purple-950/40 text-purple-400 border-purple-900/50"
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border ${colors[color]} ${className}`}>
      {children}
    </span>
  );
};

/**
 * Custom Select component.
 */
export const Select: React.FC<{
  label?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: Array<{ value: string; label: string }>;
  className?: string;
}> = ({ label, value, onChange, options, className = "" }) => {
  const id = useRef(`select-${Math.random().toString(36).substring(2, 9)}`).current;
  return (
    <div className="space-y-1.5 w-full">
      {label && (
        <label htmlFor={id} className="block text-xs font-bold text-slate-400 uppercase tracking-wider">
          {label}
        </label>
      )}
      <div className="relative">
        <select
          id={id}
          value={value}
          onChange={onChange}
          className={`flex h-10 w-full rounded-lg border border-slate-800 bg-slate-950/50 px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 appearance-none cursor-pointer transition-all duration-200 ${className}`}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value} className="bg-slate-950 text-slate-100">
              {opt.label}
            </option>
          ))}
        </select>
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-slate-500">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// 6. ADVANCED SVG CHARTING ENGINE
// ============================================================================

interface InteractiveFinancialChartProps {
  result: SimulationResult | null;
  height?: number;
}

/**
 * A highly sophisticated, responsive SVG charting engine.
 * Renders confidence bands (P10-P90, P25-P75), median (P50), mean,
 * and individual raw stochastic paths with interactive hover tracking.
 */
export const InteractiveFinancialChart: React.FC<InteractiveFinancialChartProps> = ({
  result,
  height = 400
}) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [containerWidth, setContainerWidth] = useState<number>(800);
  const containerRef = useRef<HTMLDivElement>(null);

  // Handle responsiveness
  useEffect(() => {
    if (!containerRef.current) return;
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setContainerWidth(entry.contentRect.width);
      }
    });
    resizeObserver.observe(containerRef.current);
    return () => resizeObserver.disconnect();
  }, []);

  if (!result) {
    return (
      <div className="w-full flex flex-col items-center justify-center text-slate-500 border border-dashed border-slate-800 rounded-xl bg-slate-950/20" style={{ height: `${height}px` }}>
        <Icon name="chart" className="w-12 h-12 text-slate-700 mb-3 animate-pulse" />
        <p className="text-sm font-medium">Awaiting simulation execution...</p>
      </div>
    );
  }

  const { percentiles, rawPaths } = result;
  const padding = { top: 30, right: 40, bottom: 40, left: 60 };
  const chartWidth = containerWidth - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  // Find global min and max values for scaling
  const allValues = percentiles.flatMap(p => [p.p10, p.p90]);
  const maxVal = Math.max(...allValues) * 1.05;
  const minVal = Math.max(0, Math.min(...allValues) * 0.95);
  const valRange = maxVal - minVal;

  const numYears = percentiles.length - 1;

  // Coordinate mapping helpers
  const getX = (year: number) => padding.left + (year / numYears) * chartWidth;
  const getY = (val: number) => padding.top + chartHeight - ((val - minVal) / valRange) * chartHeight;

  // Generate SVG path for confidence bands
  const generateAreaPath = (lowKey: 'p10' | 'p25', highKey: 'p90' | 'p75') => {
    const pointsLow = percentiles.map((p) => ({ x: getX(p.year), y: getY(p[lowKey]) }));
    const pointsHigh = percentiles.map((p) => ({ x: getX(p.year), y: getY(p[highKey]) }));

    const lowPath = pointsLow.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
    const highPath = [...pointsHigh].reverse().map((p) => `L ${p.x} ${p.y}`).join(' ');

    return `${lowPath} ${highPath} Z`;
  };

  // Generate SVG path for lines
  const generateLinePath = (key: 'p50' | 'mean') => {
    return percentiles
      .map((p, i) => `${i === 0 ? 'M' : 'L'} ${getX(p.year)} ${getY(p[key])}`)
      .join(' ');
  };

  // Generate paths for a subset of raw stochastic paths to show Monte Carlo dispersion
  const pathsToRender = rawPaths.slice(0, 15); // Render 15 paths for visual texture
  const stepsPerYear = (rawPaths[0]?.values.length - 1) / numYears || 12;

  const generateRawPath = (pathValues: number[]) => {
    return pathValues
      .map((val, stepIndex) => {
        const year = stepIndex / stepsPerYear;
        return `${stepIndex === 0 ? 'M' : 'L'} ${getX(year)} ${getY(val)}`;
      })
      .join(' ');
  };

  // Handle mouse movement for interactive tracking
  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!containerRef.current) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const mouseX = e.clientX - rect.left - padding.left;
    const pct = Math.max(0, Math.min(1, mouseX / chartWidth));
    const yearIndex = Math.round(pct * numYears);
    setHoveredIndex(yearIndex);
  };

  const handleMouseLeave = () => {
    setHoveredIndex(null);
  };

  // Format currency helper
  const formatCurrency = (val: number) => {
    return `$${val.toFixed(1)}M`;
  };

  // Generate Y-axis ticks
  const yTicks = Array.from({ length: 5 }).map((_, i) => {
    const val = minVal + (valRange * i) / 4;
    return { val, y: getY(val) };
  });

  // Generate X-axis ticks
  const xTicks = percentiles.map((p) => ({ year: p.year, x: getX(p.year) }));

  const hoveredData = hoveredIndex !== null ? percentiles[hoveredIndex] : null;

  return (
    <div ref={containerRef} className="w-full relative select-none">
      <svg
        width="100%"
        height={height}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="overflow-visible"
      >
        <defs>
          {/* Gradients for confidence bands */}
          <linearGradient id="p10-p90-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgb(59, 130, 246)" stopOpacity="0.08" />
            <stop offset="100%" stopColor="rgb(59, 130, 246)" stopOpacity="0.02" />
          </linearGradient>
          <linearGradient id="p25-p75-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgb(99, 102, 241)" stopOpacity="0.15" />
            <stop offset="100%" stopColor="rgb(99, 102, 241)" stopOpacity="0.05" />
          </linearGradient>
          {/* Glow filter for median line */}
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Y-Axis Gridlines */}
        {yTicks.map((tick, i) => (
          <g key={i} className="opacity-40">
            <line
              x1={padding.left}
              y1={tick.y}
              x2={padding.left + chartWidth}
              y2={tick.y}
              stroke="#1e293b"
              strokeWidth="1"
              strokeDasharray="4 4"
            />
            <text
              x={padding.left - 10}
              y={tick.y + 4}
              fill="#64748b"
              fontSize="10"
              fontFamily="monospace"
              textAnchor="end"
            >
              {formatCurrency(tick.val)}
            </text>
          </g>
        ))}

        {/* X-Axis Labels */}
        {xTicks.map((tick, i) => (
          <g key={i} className="opacity-40">
            <line
              x1={tick.x}
              y1={padding.top}
              x2={tick.x}
              y2={padding.top + chartHeight}
              stroke="#1e293b"
              strokeWidth="1"
              strokeDasharray="4 4"
            />
            <text
              x={tick.x}
              y={padding.top + chartHeight + 20}
              fill="#64748b"
              fontSize="10"
              fontFamily="monospace"
              textAnchor="middle"
            >
              Yr {tick.year}
            </text>
          </g>
        ))}

        {/* Raw Stochastic Paths (Monte Carlo visual texture) */}
        {pathsToRender.map((path, i) => (
          <path
            key={path.pathId}
            d={generateRawPath(path.values)}
            fill="none"
            stroke="rgb(59, 130, 246)"
            strokeWidth="1"
            strokeOpacity="0.12"
          />
        ))}

        {/* P10 - P90 Confidence Band */}
        <path
          d={generateAreaPath('p10', 'p90')}
          fill="url(#p10-p90-grad)"
          stroke="rgba(59, 130, 246, 0.15)"
          strokeWidth="1"
        />

        {/* P25 - P75 Confidence Band */}
        <path
          d={generateAreaPath('p25', 'p75')}
          fill="url(#p25-p75-grad)"
          stroke="rgba(99, 102, 241, 0.25)"
          strokeWidth="1"
        />

        {/* Mean Path (Dashed) */}
        <path
          d={generateLinePath('mean')}
          fill="none"
          stroke="rgba(148, 163, 184, 0.5)"
          strokeWidth="1.5"
          strokeDasharray="5 5"
        />

        {/* Median P50 Path (Solid Glow) */}
        <path
          d={generateLinePath('p50')}
          fill="none"
          stroke="rgb(59, 130, 246)"
          strokeWidth="3"
          filter="url(#glow)"
        />

        {/* Interactive Vertical Tracker Line */}
        {hoveredIndex !== null && (
          <g>
            <line
              x1={getX(hoveredIndex)}
              y1={padding.top}
              x2={getX(hoveredIndex)}
              y2={padding.top + chartHeight}
              stroke="#3b82f6"
              strokeWidth="1.5"
            />
            {/* Interactive Dots */}
            <circle cx={getX(hoveredIndex)} cy={getY(hoveredData!.p50)} r="6" fill="#3b82f6" stroke="#0f172a" strokeWidth="2" />
            <circle cx={getX(hoveredIndex)} cy={getY(hoveredData!.p90)} r="4" fill="#60a5fa" stroke="#0f172a" strokeWidth="1.5" />
            <circle cx={getX(hoveredIndex)} cy={getY(hoveredData!.p10)} r="4" fill="#60a5fa" stroke="#0f172a" strokeWidth="1.5" />
          </g>
        )}
      </svg>

      {/* Floating Tooltip Card */}
      {hoveredIndex !== null && hoveredData && (
        <div
          className="absolute z-30 bg-slate-950/95 border border-slate-800 rounded-lg p-4 shadow-2xl backdrop-blur-md text-xs space-y-2 pointer-events-none transition-all duration-100"
          style={{
            left: `${Math.min(containerWidth - 180, Math.max(10, getX(hoveredIndex) - 80))}px`,
            top: `${padding.top + 10}px`,
            width: "160px"
          }}
        >
          <div className="font-bold text-slate-200 border-b border-slate-800 pb-1 flex justify-between">
            <span>Year {hoveredData.year}</span>
            <span className="text-blue-400">Projection</span>
          </div>
          <div className="space-y-1 font-mono">
            <div className="flex justify-between text-slate-400">
              <span>P90 (High):</span>
              <span className="text-slate-200 font-bold">{formatCurrency(hoveredData.p90)}</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>P75:</span>
              <span className="text-slate-300">{formatCurrency(hoveredData.p75)}</span>
            </div>
            <div className="flex justify-between text-blue-400 font-bold">
              <span>P50 (Median):</span>
              <span>{formatCurrency(hoveredData.p50)}</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>P25:</span>
              <span className="text-slate-300">{formatCurrency(hoveredData.p25)}</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>P10 (Low):</span>
              <span className="text-slate-200 font-bold">{formatCurrency(hoveredData.p10)}</span>
            </div>
            <div className="flex justify-between text-slate-500 border-t border-slate-900 pt-1">
              <span>Mean:</span>
              <span>{formatCurrency(hoveredData.mean)}</span>
            </div>
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="flex flex-wrap justify-center gap-6 mt-4 text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 bg-blue-500 rounded-full shadow-[0_0_8px_rgba(59,130,246,0.6)]"></span>
          <span className="font-medium text-slate-300">Median Projection (P50)</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-6 h-3 bg-indigo-500/20 border border-indigo-500/40 rounded"></span>
          <span>Interquartile Range (P25 - P75)</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-6 h-3 bg-blue-500/10 border border-blue-500/20 rounded"></span>
          <span>Outer Confidence Band (P10 - P90)</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-4 border-t-2 border-dashed border-slate-600"></span>
          <span>Mean Path</span>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// 7. RISK DISTRIBUTION HISTOGRAM
// ============================================================================

interface RiskDistributionHistogramProps {
  result: SimulationResult | null;
  height?: number;
}

/**
 * Renders a probability distribution histogram of terminal values.
 * Highlights Value at Risk (VaR) and Conditional Value at Risk (CVaR) thresholds.
 */
export const RiskDistributionHistogram: React.FC<RiskDistributionHistogramProps> = ({
  result,
  height = 220
}) => {
  if (!result) return null;

  const { rawPaths, riskMetrics, percentiles } = result;
  const terminalValues = rawPaths.map(p => p.values[p.values.length - 1]).sort((a, b) => a - b);
  const numPaths = terminalValues.length;

  // Create bins for the histogram
  const numBins = 30;
  const minVal = terminalValues[0];
  const maxVal = terminalValues[numPaths - 1];
  const binWidth = (maxVal - minVal) / numBins;

  const bins = Array.from({ length: numBins }).map((_, i) => {
    const binMin = minVal + i * binWidth;
    const binMax = binMin + binWidth;
    const count = terminalValues.filter(v => v >= binMin && v < binMax).length;
    return {
      binMin,
      binMax,
      count,
      pct: count / numPaths
    };
  });

  const maxPct = Math.max(...bins.map(b => b.pct));

  // Calculate coordinates for VaR thresholds
  // VaR 95% is the 5th percentile of terminal values
  const var95Val = terminalValues[Math.floor(numPaths * 0.05)];
  const var99Val = terminalValues[Math.floor(numPaths * 0.01)];

  const padding = { top: 20, right: 20, bottom: 30, left: 40 };
  const chartWidth = 500; // Fixed internal coordinate space for SVG
  const chartHeight = height - padding.top - padding.bottom;

  const getX = (val: number) => padding.left + ((val - minVal) / (maxVal - minVal)) * (chartWidth - padding.left - padding.right);
  const getY = (pct: number) => padding.top + chartHeight - (pct / maxPct) * chartHeight;

  return (
    <div className="w-full bg-slate-950/40 border border-slate-800/80 rounded-xl p-5 space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h4 className="text-sm font-bold text-slate-200">Terminal Value Probability Distribution</h4>
          <p className="text-xs text-slate-500">Monte Carlo frequency distribution of terminal assets</p>
        </div>
        <div className="flex gap-4 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 bg-amber-500/80 rounded-sm"></span>
            <span className="text-slate-400">95% VaR Threshold</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 bg-red-500/80 rounded-sm"></span>
            <span className="text-slate-400">99% VaR Threshold</span>
          </div>
        </div>
      </div>

      <div className="relative w-full overflow-hidden">
        <svg viewBox={`0 0 ${chartWidth} ${height}`} width="100%" height={height} className="overflow-visible">
          {/* Grid lines */}
          {[0, 0.5, 1].map((tick, i) => (
            <line
              key={i}
              x1={padding.left}
              y1={padding.top + (chartHeight * tick)}
              x2={chartWidth - padding.right}
              y2={padding.top + (chartHeight * tick)}
              stroke="#1e293b"
              strokeWidth="1"
              strokeDasharray="4 4"
              className="opacity-40"
            />
          ))}

          {/* Histogram Bars */}
          {bins.map((bin, i) => {
            const x1 = getX(bin.binMin);
            const x2 = getX(bin.binMax);
            const y = getY(bin.pct);
            const barWidth = Math.max(1, x2 - x1 - 1);
            const barHeight = padding.top + chartHeight - y;

            // Determine color based on VaR thresholds
            let fill = "rgba(59, 130, 246, 0.4)";
            let stroke = "rgba(59, 130, 246, 0.6)";
            if (bin.binMax < var99Val) {
              fill = "rgba(239, 68, 68, 0.4)";
              stroke = "rgba(239, 68, 68, 0.6)";
            } else if (bin.binMax < var95Val) {
              fill = "rgba(245, 158, 11, 0.4)";
              stroke = "rgba(245, 158, 11, 0.6)";
            }

            return (
              <rect
                key={i}
                x={x1}
                y={y}
                width={barWidth}
                height={Math.max(0, barHeight)}
                fill={fill}
                stroke={stroke}
                strokeWidth="1"
              />
            );
          })}

          {/* VaR 95% Line */}
          <line
            x1={getX(var95Val)}
            y1={padding.top}
            x2={getX(var95Val)}
            y2={padding.top + chartHeight}
            stroke="#f59e0b"
            strokeWidth="2"
            strokeDasharray="3 3"
          />

          {/* VaR 99% Line */}
          <line
            x1={getX(var99Val)}
            y1={padding.top}
            x2={getX(var99Val)}
            y2={padding.top + chartHeight}
            stroke="#ef4444"
            strokeWidth="2"
            strokeDasharray="3 3"
          />

          {/* X-Axis Labels */}
          <text
            x={padding.left}
            y={padding.top + chartHeight + 18}
            fill="#64748b"
            fontSize="9"
            fontFamily="monospace"
          >
            ${minVal.toFixed(0)}M
          </text>
          <text
            x={chartWidth - padding.right}
            y={padding.top + chartHeight + 18}
            fill="#64748b"
            fontSize="9"
            fontFamily="monospace"
            textAnchor="end"
          >
            ${maxVal.toFixed(0)}M
          </text>
          <text
            x={(chartWidth) / 2}
            y={padding.top + chartHeight + 18}
            fill="#64748b"
            fontSize="9"
            fontFamily="monospace"
            textAnchor="middle"
          >
            Median: ${percentiles[percentiles.length - 1].p50.toFixed(1)}M
          </text>
        </svg>
      </div>
    </div>
  );
};// ============================================================================
// 8. SUB-SYSTEM COMPONENT: DASHBOARD TAB
// ============================================================================

export const DashboardTab: React.FC = () => {
  const { state, runSimulationForActiveScenario } = useApp();
  const activeScenario = state.scenarios.find(s => s.id === state.activeScenarioId) || state.scenarios[0];
  const result = state.simulationResults[activeScenario.id];

  const formatCurrency = (val: number) => `$${val.toFixed(2)}M`;
  const formatPercent = (val: number) => `${(val * 100).toFixed(1)}%`;

  if (!result) {
    return (
      <div className="flex flex-col items-center justify-center h-96 space-y-4">
        <Icon name="refresh" className="w-12 h-12 text-blue-500 animate-spin" />
        <p className="text-slate-400 text-sm font-medium">Synthesizing initial stochastic projections...</p>
      </div>
    );
  }

  const { riskMetrics, complianceMetrics, aiOpinion, percentiles } = result;
  const terminalP50 = percentiles[percentiles.length - 1].p50;
  const totalGrowth = ((terminalP50 - activeScenario.baseValue) / activeScenario.baseValue) * 100;

  return (
    <div className="space-y-6">
      {/* Top KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardBody className="space-y-2">
            <div className="flex justify-between items-start">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Terminal Value (P50)</span>
              <Badge color="blue">Median</Badge>
            </div>
            <div className="text-2xl font-black text-slate-100 font-mono">
              {formatCurrency(terminalP50)}
            </div>
            <div className="flex items-center gap-1 text-xs font-semibold text-emerald-400">
              <Icon name="trending" className="w-3.5 h-3.5" />
              <span>+{totalGrowth.toFixed(1)}% cumulative</span>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="space-y-2">
            <div className="flex justify-between items-start">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Value at Risk (95% VaR)</span>
              <Badge color={riskMetrics.valueAtRisk95 > 0.25 ? 'red' : 'amber'}>Risk Exposure</Badge>
            </div>
            <div className="text-2xl font-black text-slate-100 font-mono">
              {formatPercent(riskMetrics.valueAtRisk95)}
            </div>
            <p className="text-[11px] text-slate-500 leading-normal">
              Max expected loss with 95% confidence over horizon.
            </p>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="space-y-2">
            <div className="flex justify-between items-start">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Liquidity Coverage (LCR)</span>
              <Badge color={complianceMetrics.basel3Lcr >= 100 ? 'green' : 'red'}>Basel III</Badge>
            </div>
            <div className="text-2xl font-black text-slate-100 font-mono">
              {complianceMetrics.basel3Lcr.toFixed(1)}%
            </div>
            <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden">
              <div 
                className={`h-full rounded-full ${complianceMetrics.basel3Lcr >= 100 ? 'bg-emerald-500' : 'bg-red-500'}`}
                style={{ width: `${Math.min(100, (complianceMetrics.basel3Lcr / 150) * 100)}%` }}
              />
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="space-y-2">
            <div className="flex justify-between items-start">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">CCAR Stress Status</span>
              <Badge color={complianceMetrics.ccarStatus === 'PASS' ? 'green' : complianceMetrics.ccarStatus === 'WARNING' ? 'amber' : 'red'}>
                {complianceMetrics.ccarStatus}
              </Badge>
            </div>
            <div className="text-2xl font-black text-slate-100 font-mono">
              {complianceMetrics.doddFrankScore}/100
            </div>
            <p className="text-[11px] text-slate-500 leading-normal">
              Dodd-Frank stress test score based on capital adequacy.
            </p>
          </CardBody>
        </Card>
      </div>

      {/* Main Dashboard Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Quick Chart View */}
        <div className="lg:col-span-8 space-y-6">
          <Card>
            <CardHeader>
              <div>
                <h3 className="text-base font-bold text-slate-200">Stochastic Projection Overview</h3>
                <p className="text-xs text-slate-500">Active Scenario: {activeScenario.name}</p>
              </div>
              <Button size="sm" variant="outline" onClick={runSimulationForActiveScenario}>
                <Icon name="refresh" className="w-3.5 h-3.5 mr-1.5" /> Re-Simulate
              </Button>
            </CardHeader>
            <CardBody>
              <InteractiveFinancialChart result={result} height={300} />
            </CardBody>
          </Card>

          {/* Key Impacts Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {aiOpinion.keyImpacts.map((impact, idx) => (
              <Card key={idx}>
                <CardBody className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{impact.metric}</span>
                    <Badge color={impact.severity === 'high' ? 'red' : impact.severity === 'medium' ? 'amber' : 'green'}>
                      {impact.severity} severity
                    </Badge>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-xl font-black text-slate-100 font-mono">{impact.value}</span>
                    <span className={`text-xs font-bold ${impact.change.startsWith('+') ? 'text-emerald-400' : 'text-slate-400'}`}>
                      {impact.change}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed">{impact.description}</p>
                </CardBody>
              </Card>
            ))}
          </div>
        </div>

        {/* Right: AI Oracle Summary & Recommendations */}
        <div className="lg:col-span-4 space-y-6">
          <Card className="h-full flex flex-col">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Icon name="brain" className="text-blue-400 w-5 h-5" />
                <h3 className="text-base font-bold text-slate-200">Oracle Executive Opinion</h3>
              </div>
            </CardHeader>
            <CardBody className="flex-grow space-y-4">
              <div className="bg-slate-950/60 border border-slate-800/60 rounded-lg p-4 text-xs text-slate-300 leading-relaxed space-y-2">
                <p className="font-semibold text-blue-400">Summary Narrative:</p>
                <p>{aiOpinion.narrativeSummary}</p>
              </div>

              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Priority Actions</h4>
                <div className="space-y-2 max-h-[240px] overflow-y-auto pr-1 custom-scrollbar">
                  {aiOpinion.recommendations.map((rec) => (
                    <div 
                      key={rec.id} 
                      className="p-3 bg-slate-950/40 border border-slate-800/80 rounded-lg space-y-1.5 hover:border-slate-700/50 transition-all"
                    >
                      <div className="flex justify-between items-start gap-2">
                        <span className="text-xs font-bold text-slate-200 leading-snug">{rec.title}</span>
                        <Badge color={rec.category === 'hedging' ? 'purple' : rec.category === 'liquidity' ? 'blue' : 'amber'}>
                          {rec.category}
                        </Badge>
                      </div>
                      <p className="text-[11px] text-slate-400 leading-relaxed">{rec.description}</p>
                      <div className="flex gap-3 text-[10px] font-mono text-slate-500 pt-1 border-t border-slate-900">
                        <span>Impact: <strong className="text-blue-400">{rec.impactScore}/10</strong></span>
                        <span>Feasibility: <strong className="text-indigo-400">{rec.feasibilityScore}/10</strong></span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// 9. SUB-SYSTEM COMPONENT: SCENARIO BUILDER TAB
// ============================================================================

export const ScenarioBuilderTab: React.FC = () => {
  const { state, dispatch } = useApp();
  const activeScenario = state.scenarios.find(s => s.id === state.activeScenarioId) || state.scenarios[0];

  const handleUpdate = (key: keyof FinancialScenario, val: any) => {
    dispatch({
      type: 'UPDATE_SCENARIO',
      payload: { id: activeScenario.id, updates: { [key]: val } }
    });
    dispatch({
      type: 'ADD_LEDGER_ENTRY',
      payload: {
        action: 'SCENARIO_UPDATE',
        details: `Updated parameter [${String(key)}] to [${val}] on scenario: ${activeScenario.name}`
      }
    });
  };

  const handleAddScenario = () => {
    const newId = `S-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;
    const newScenario: FinancialScenario = {
      id: newId,
      name: `Scenario ${state.scenarios.length + 1}`,
      description: 'Custom user-defined financial projection scenario.',
      baseValue: 100,
      growthRate: 10,
      volatility: 15,
      horizonYears: 5,
      operatingExpenses: 30,
      capitalExpenditures: 5,
      taxRate: 21,
      debtRatio: 20,
      interestRate: 5,
      riskFreeRate: 4.0,
      liquidityReserve: 20,
      stressScenario: 'none'
    };

    dispatch({ type: 'ADD_SCENARIO', payload: newScenario });
    dispatch({
      type: 'ADD_LEDGER_ENTRY',
      payload: {
        action: 'SCENARIO_CREATE',
        details: `Created new scenario: ${newScenario.name}`
      }
    });
  };

  const handleRemoveScenario = (id: string) => {
    if (state.scenarios.length <= 1) return;
    const target = state.scenarios.find(s => s.id === id);
    dispatch({ type: 'REMOVE_SCENARIO', payload: id });
    dispatch({
      type: 'ADD_LEDGER_ENTRY',
      payload: {
        action: 'SCENARIO_DELETE',
        details: `Deleted scenario: ${target?.name || id}`
      }
    });
  };

  const loadPreset = (preset: 'conservative' | 'aggressive' | 'hyper_growth' | 'stressed') => {
    let updates: Partial<FinancialScenario> = {};
    if (preset === 'conservative') {
      updates = {
        growthRate: 5,
        volatility: 8,
        debtRatio: 10,
        liquidityReserve: 40,
        stressScenario: 'none'
      };
    } else if (preset === 'aggressive') {
      updates = {
        growthRate: 25,
        volatility: 30,
        debtRatio: 60,
        liquidityReserve: 15,
        stressScenario: 'none'
      };
    } else if (preset === 'hyper_growth') {
      updates = {
        growthRate: 40,
        volatility: 35,
        debtRatio: 40,
        liquidityReserve: 10,
        stressScenario: 'none'
      };
    } else if (preset === 'stressed') {
      updates = {
        growthRate: -5,
        volatility: 25,
        debtRatio: 50,
        liquidityReserve: 15,
        stressScenario: 'financial_crisis'
      };
    }

    dispatch({
      type: 'UPDATE_SCENARIO',
      payload: { id: activeScenario.id, updates }
    });
    dispatch({
      type: 'ADD_LEDGER_ENTRY',
      payload: {
        action: 'PRESET_LOAD',
        details: `Loaded preset [${preset}] into scenario: ${activeScenario.name}`
      }
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Left: Scenario List & Presets */}
      <div className="lg:col-span-4 space-y-6">
        <Card>
          <CardHeader>
            <h3 className="text-base font-bold text-slate-200">Active Scenarios</h3>
            <Button size="sm" variant="outline" onClick={handleAddScenario}>
              <Icon name="plus" className="w-3.5 h-3.5 mr-1.5" /> Add
            </Button>
          </CardHeader>
          <CardBody className="space-y-3">
            {state.scenarios.map((s) => (
              <div
                key={s.id}
                onClick={() => dispatch({ type: 'SET_ACTIVE_SCENARIO', payload: s.id })}
                className={`group flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-all ${
                  state.activeScenarioId === s.id
                    ? 'bg-blue-950/30 border-blue-500/50 shadow-lg shadow-blue-950/10'
                    : 'bg-slate-950/20 border-slate-800/80 hover:border-slate-700/50'
                }`}
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${state.activeScenarioId === s.id ? 'bg-blue-400' : 'bg-slate-600'}`} />
                    <span className="font-bold text-sm text-slate-200">{s.name}</span>
                  </div>
                  <p className="text-xs text-slate-500 line-clamp-1">{s.description}</p>
                </div>
                {state.scenarios.length > 1 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveScenario(s.id);
                    }}
                    className="p-1.5 rounded text-slate-500 hover:text-red-400 hover:bg-red-950/30 opacity-0 group-hover:opacity-100 transition-all"
                  >
                    <Icon name="trash" className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <h3 className="text-base font-bold text-slate-200">Quick Presets</h3>
          </CardHeader>
          <CardBody className="grid grid-cols-2 gap-2">
            <Button variant="outline" size="sm" onClick={() => loadPreset('conservative')}>
              Conservative
            </Button>
            <Button variant="outline" size="sm" onClick={() => loadPreset('aggressive')}>
              Aggressive
            </Button>
            <Button variant="outline" size="sm" onClick={() => loadPreset('hyper_growth')}>
              Hyper Growth
            </Button>
            <Button variant="outline" size="sm" onClick={() => loadPreset('stressed')}>
              Stressed Crisis
            </Button>
          </CardBody>
        </Card>
      </div>

      {/* Right: Parameter Configuration Form */}
      <div className="lg:col-span-8">
        <Card>
          <CardHeader>
            <div>
              <h3 className="text-base font-bold text-slate-200">Model Parameters</h3>
              <p className="text-xs text-slate-500">Configure stochastic and operational variables for {activeScenario.name}</p>
            </div>
          </CardHeader>
          <CardBody className="space-y-6">
            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Scenario Name"
                value={activeScenario.name}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleUpdate('name', e.target.value)}
              />
              <Input
                label="Description"
                value={activeScenario.description}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleUpdate('description', e.target.value)}
              />
            </div>

            <div className="border-t border-slate-800/60 pt-6 space-y-6">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Stochastic Engine Variables</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Slider
                  label="Initial Asset Value"
                  min={10}
                  max={1000}
                  step={10}
                  value={activeScenario.baseValue}
                  suffix="M"
                  onChange={(val) => handleUpdate('baseValue', val)}
                  helperText="The starting capital or asset base (S_0) for the simulation."
                />
                <Slider
                  label="Annual Growth Rate (Drift)"
                  min={-20}
                  max={60}
                  step={1}
                  value={activeScenario.growthRate}
                  suffix="%"
                  onChange={(val) => handleUpdate('growthRate', val)}
                  helperText="The expected annual rate of return or drift parameter (μ)."
                />
                <Slider
                  label="Annual Volatility (Diffusion)"
                  min={2}
                  max={80}
                  step={1}
                  value={activeScenario.volatility}
                  suffix="%"
                  onChange={(val) => handleUpdate('volatility', val)}
                  helperText="The standard deviation of returns representing market uncertainty (σ)."
                />
                <Slider
                  label="Time Horizon"
                  min={1}
                  max={10}
                  step={1}
                  value={activeScenario.horizonYears}
                  suffix=" Years"
                  onChange={(val) => handleUpdate('horizonYears', val)}
                  helperText="The duration of the simulation path in years (T)."
                />
              </div>
            </div>

            <div className="border-t border-slate-800/60 pt-6 space-y-6">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Operational & Capital Structure</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Slider
                  label="Operating Expenses (OpEx)"
                  min={5}
                  max={80}
                  step={1}
                  value={activeScenario.operatingExpenses}
                  suffix="%"
                  onChange={(val) => handleUpdate('operatingExpenses', val)}
                  helperText="Annual operating expenses calculated as a percentage of revenue."
                />
                <Slider
                  label="Capital Expenditures (CapEx)"
                  min={0}
                  max={100}
                  step={5}
                  value={activeScenario.capitalExpenditures}
                  suffix="M"
                  onChange={(val) => handleUpdate('capitalExpenditures', val)}
                  helperText="Annual capital reinvestment required for operations."
                />
                <Slider
                  label="Debt-to-Equity Ratio"
                  min={0}
                  max={200}
                  step={5}
                  value={activeScenario.debtRatio}
                  suffix="%"
                  onChange={(val) => handleUpdate('debtRatio', val)}
                  helperText="Leverage ratio used to calculate interest expenses and risk weightings."
                />
                <Slider
                  label="Cost of Debt (Interest Rate)"
                  min={1}
                  max={20}
                  step={0.5}
                  value={activeScenario.interestRate}
                  suffix="%"
                  onChange={(val) => handleUpdate('interestRate', val)}
                  helperText="The annual interest rate paid on outstanding debt."
                />
                <Slider
                  label="Liquidity Reserve (HQLA)"
                  min={5}
                  max={200}
                  step={5}
                  value={activeScenario.liquidityReserve}
                  suffix="M"
                  onChange={(val) => handleUpdate('liquidityReserve', val)}
                  helperText="High-Quality Liquid Assets held to meet short-term obligations."
                />
                <Select
                  label="Macro Stress Scenario Preset"
                  value={activeScenario.stressScenario}
                  onChange={(e) => handleUpdate('stressScenario', e.target.value)}
                  options={[
                    { value: 'none', label: 'None (Standard Market Conditions)' },
                    { value: 'pandemic', label: 'Pandemic Shock (High Volatility, Low Drift)' },
                    { value: 'financial_crisis', label: 'Systemic Financial Crisis (Extreme Volatility, Negative Drift)' },
                    { value: 'inflation_shock', label: 'Stagflationary Shock (Moderate Volatility, Low Growth)' },
                    { value: 'tech_bubble', label: 'Tech Bubble Burst (High Volatility, Severe Drawdowns)' }
                  ]}
                />
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

// ============================================================================
// 10. SUB-SYSTEM COMPONENT: MONTE CARLO SIMULATION TAB
// ============================================================================

export const MonteCarloTab: React.FC = () => {
  const { state, runSimulationForActiveScenario } = useApp();
  const activeScenario = state.scenarios.find(s => s.id === state.activeScenarioId) || state.scenarios[0];
  const result = state.simulationResults[activeScenario.id];

  const formatCurrency = (val: number) => `$${val.toFixed(2)}M`;
  const formatPercent = (val: number) => `${(val * 100).toFixed(2)}%`;

  return (
    <div className="space-y-6">
      {/* Simulation Controls Header */}
      <Card>
        <CardBody className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h3 className="text-base font-bold text-slate-200">Monte Carlo Stochastic Engine</h3>
            <p className="text-xs text-slate-500">
              Running 2,000 independent Geometric Brownian Motion paths for {activeScenario.name}.
            </p>
          </div>
          <Button variant="glow" onClick={runSimulationForActiveScenario} disabled={state.isSimulating}>
            {state.isSimulating ? (
              <>
                <Icon name="refresh" className="w-4 h-4 animate-spin mr-2" />
                Simulating Paths...
              </>
            ) : (
              <>
                <Icon name="brain" className="w-4 h-4 mr-2" />
                Execute Simulation
              </>
            )}
          </Button>
        </CardBody>
      </Card>

      {/* Main Visualizations */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 space-y-6">
          <Card>
            <CardHeader>
              <h3 className="text-base font-bold text-slate-200">Stochastic Path Dispersion</h3>
            </CardHeader>
            <CardBody>
              <InteractiveFinancialChart result={result} height={350} />
            </CardBody>
          </Card>

          <RiskDistributionHistogram result={result} height={240} />
        </div>

        {/* Detailed Risk Metrics Panel */}
        <div className="lg:col-span-4 space-y-6">
          <Card>
            <CardHeader>
              <h3 className="text-base font-bold text-slate-200">Risk & Performance Analytics</h3>
            </CardHeader>
            <CardBody className="p-0">
              {result ? (
                <div className="divide-y divide-slate-800/60 font-mono text-xs">
                  <div className="p-4 flex justify-between items-center">
                    <span className="text-slate-400 font-sans">Sharpe Ratio</span>
                    <span className="font-bold text-blue-400">{result.riskMetrics.sharpeRatio.toFixed(2)}</span>
                  </div>
                  <div className="p-4 flex justify-between items-center">
                    <span className="text-slate-400 font-sans">Sortino Ratio</span>
                    <span className="font-bold text-indigo-400">{result.riskMetrics.sortinoRatio.toFixed(2)}</span>
                  </div>
                  <div className="p-4 flex justify-between items-center">
                    <span className="text-slate-400 font-sans">Max Drawdown (Avg)</span>
                    <span className="font-bold text-amber-500">{formatPercent(result.riskMetrics.maxDrawdown)}</span>
                  </div>
                  <div className="p-4 flex justify-between items-center">
                    <span className="text-slate-400 font-sans">95% Value at Risk (VaR)</span>
                    <span className="font-bold text-amber-500">{formatPercent(result.riskMetrics.valueAtRisk95)}</span>
                  </div>
                  <div className="p-4 flex justify-between items-center">
                    <span className="text-slate-400 font-sans">99% Value at Risk (VaR)</span>
                    <span className="font-bold text-red-500">{formatPercent(result.riskMetrics.valueAtRisk99)}</span>
                  </div>
                  <div className="p-4 flex justify-between items-center">
                    <span className="text-slate-400 font-sans">95% Conditional VaR (CVaR)</span>
                    <span className="font-bold text-amber-600">{formatPercent(result.riskMetrics.conditionalVaR95)}</span>
                  </div>
                  <div className="p-4 flex justify-between items-center">
                    <span className="text-slate-400 font-sans">99% Conditional VaR (CVaR)</span>
                    <span className="font-bold text-red-600">{formatPercent(result.riskMetrics.conditionalVaR99)}</span>
                  </div>
                  <div className="p-4 flex justify-between items-center">
                    <span className="text-slate-400 font-sans">Insolvency Probability</span>
                    <span className={`font-bold ${result.riskMetrics.probabilityOfInsolvency > 0.1 ? 'text-red-500' : 'text-emerald-400'}`}>
                      {formatPercent(result.riskMetrics.probabilityOfInsolvency)}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="p-6 text-center text-slate-500">
                  Awaiting simulation execution...
                </div>
              )}
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
};// ============================================================================
// 11. SUB-SYSTEM COMPONENT: AI ORACLE TAB
// ============================================================================

/**
 * Interactive AI Oracle Chat Interface.
 * Simulates a highly sophisticated, context-aware financial co-pilot.
 * Uses active scenario parameters and Monte Carlo simulation results to
 * generate precise, mathematically grounded answers to user queries.
 */
export const AIOracleTab: React.FC = () => {
  const { state, dispatch } = useApp();
  const [inputMessage, setInputMessage] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  const activeScenario = state.scenarios.find(s => s.id === state.activeScenarioId) || state.scenarios[0];
  const result = state.simulationResults[activeScenario.id];

  // Auto-scroll to bottom of chat when history updates
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [state.chatHistory, state.isChatLoading]);

  /**
   * Generates a highly contextualized, mathematically accurate response
   * from the AI Oracle based on user input and current simulation state.
   */
  const generateOracleResponse = (userText: string): string => {
    if (!result) {
      return "I am currently unable to analyze your financial posture because the Monte Carlo simulation engine has not been executed. Please run the simulation first so I can ingest the stochastic path data.";
    }

    const text = userText.toLowerCase();
    const { riskMetrics, complianceMetrics, percentiles } = result;
    const terminalP50 = percentiles[percentiles.length - 1].p50;
    const terminalP10 = percentiles[percentiles.length - 1].p10;
    const terminalP90 = percentiles[percentiles.length - 1].p90;

    // Keyword-based routing for context-aware responses
    if (text.includes('risk') || text.includes('var') || text.includes('drawdown') || text.includes('insolvent')) {
      return `Based on our 2,000-path Monte Carlo simulation for "${activeScenario.name}":
- The 95% Value at Risk (VaR) is ${(riskMetrics.valueAtRisk95 * 100).toFixed(2)}%, meaning there is a 5% chance of losing more than this proportion of your initial capital.
- The 99% VaR stands at ${(riskMetrics.valueAtRisk99 * 100).toFixed(2)}%.
- The Conditional VaR (CVaR) at 95% confidence is ${(riskMetrics.conditionalVaR95 * 100).toFixed(2)}%, representing the average loss in the worst 5% of outcomes.
- The average Maximum Drawdown across all simulated paths is ${(riskMetrics.maxDrawdown * 100).toFixed(2)}%.
- The probability of insolvency (assets dropping below 10% of initial value) is ${(riskMetrics.probabilityOfInsolvency * 100).toFixed(2)}%.

${riskMetrics.probabilityOfInsolvency > 0.05 
  ? "WARNING: Your tail risk is elevated. I strongly recommend implementing protective put options or increasing your high-quality liquid assets (HQLA) to buffer against systemic shocks." 
  : "Your risk profile is well within conservative institutional boundaries."}`;
    }

    if (text.includes('hedge') || text.includes('option') || text.includes('put') || text.includes('call') || text.includes('collar')) {
      const strike = result.aiOpinion.hedgingStrategy.strikePrice;
      const premium = result.aiOpinion.hedgingStrategy.premiumCost;
      const delta = result.aiOpinion.hedgingStrategy.deltaHedgingRatio;
      
      return `To mitigate the downside risk of "${activeScenario.name}", I have calculated an optimal hedging strategy using the Black-Scholes model:
- Recommended Instrument: Protective Put Options (5% Out-of-the-Money)
- Strike Price: $${strike.toFixed(2)}M (protecting against drops below 95% of your initial asset base of $${activeScenario.baseValue}M)
- Estimated Option Premium: $${premium.toFixed(3)}M per unit of asset exposure (calculated at a risk-free rate of ${activeScenario.riskFreeRate}% and volatility of ${activeScenario.volatility}%)
- Delta Hedging Ratio: -${delta.toFixed(3)} (requires shorting ${Math.round(delta * 100)}% of the underlying asset value per option contract to maintain delta-neutrality)
- Projected Risk Reduction: This hedge is estimated to reduce your 95% Value at Risk by approximately ${result.aiOpinion.hedgingStrategy.estimatedRiskReduction}%.

Would you like me to log this hedging transaction in the system ledger?`;
    }

    if (text.includes('compliance') || text.includes('basel') || text.includes('lcr') || text.includes('ccar') || text.includes('dodd')) {
      return `Regulatory Compliance Audit for "${activeScenario.name}":
- Basel III Liquidity Coverage Ratio (LCR): ${complianceMetrics.basel3Lcr.toFixed(1)}% (Regulatory Minimum: 100%). ${complianceMetrics.basel3Lcr >= 100 ? "STATUS: COMPLIANT" : "STATUS: NON-COMPLIANT - IMMEDIATE ACTION REQUIRED"}
- Capital Adequacy Ratio (CAR): ${complianceMetrics.capitalAdequacyRatio.toFixed(1)}% (Regulatory Minimum: 8.0%).
- Net Stable Funding Ratio (NSFR): ${complianceMetrics.netStableFundingRatio.toFixed(1)}% (Regulatory Minimum: 100%).
- CCAR Stress Test Status: ${complianceMetrics.ccarStatus}
- Dodd-Frank Stress Score: ${complianceMetrics.doddFrankScore}/100

Cryptographic Audit Hash: ${complianceMetrics.auditTrailHash}

${complianceMetrics.ccarStatus === 'FAIL' 
  ? "CRITICAL: The scenario fails CCAR stress testing due to insufficient liquidity reserves relative to stressed cash outflows. You must increase your HQLA or reduce leverage." 
  : "The scenario successfully passes all simulated regulatory stress tests."}`;
    }

    if (text.includes('growth') || text.includes('projection') || text.includes('forecast') || text.includes('median') || text.includes('mean')) {
      return `Stochastic Growth Analysis for "${activeScenario.name}" over a ${activeScenario.horizonYears}-year horizon:
- Initial Asset Base: $${activeScenario.baseValue.toFixed(1)}M
- Median (P50) Terminal Value: $${terminalP50.toFixed(2)}M (representing a cumulative growth of ${(((terminalP50 - activeScenario.baseValue) / activeScenario.baseValue) * 100).toFixed(1)}%)
- Optimistic (P90) Terminal Value: $${terminalP90.toFixed(2)}M
- Pessimistic (P10) Terminal Value: $${terminalP10.toFixed(2)}M
- Expected Annual Drift (μ): ${activeScenario.growthRate}%
- Expected Annual Volatility (σ): ${activeScenario.volatility}%

The wide dispersion between P10 and P90 highlights the impact of compounding volatility over time. Under the median path, your capital structure remains highly viable.`;
    }

    // Default fallback response
    return `I am the Quantum Core Financial Oracle. I have fully ingested the parameters of "${activeScenario.name}" and the corresponding 2,000-path Monte Carlo simulation.

I can assist you with:
1. **Risk Analysis**: Value at Risk (VaR), Conditional VaR (CVaR), drawdowns, and insolvency probabilities.
2. **Hedging Strategies**: Black-Scholes option pricing, strike recommendations, and delta hedging ratios.
3. **Regulatory Compliance**: Basel III LCR, CCAR stress testing, and Dodd-Frank capital adequacy.
4. **Growth Projections**: Percentile distributions (P10, P50, P90) and drift/diffusion dynamics.

What specific dimension of your financial model would you like me to analyze?`;
  };

  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputMessage.trim() || state.isChatLoading) return;

    const userMessage: ChatMessage = {
      id: `M-${Date.now()}`,
      sender: 'user',
      text: inputMessage,
      timestamp: new Date()
    };

    dispatch({ type: 'ADD_CHAT_MESSAGE', payload: userMessage });
    setInputMessage('');
    dispatch({ type: 'SET_CHAT_LOADING', payload: true });

    // Simulate AI thinking delay
    setTimeout(() => {
      const oracleText = generateOracleResponse(userMessage.text);
      const oracleMessage: ChatMessage = {
        id: `M-${Date.now() + 1}`,
        sender: 'oracle',
        text: oracleText,
        timestamp: new Date()
      };
      dispatch({ type: 'ADD_CHAT_MESSAGE', payload: oracleMessage });
      dispatch({ type: 'SET_CHAT_LOADING', payload: false });
      dispatch({
        type: 'ADD_LEDGER_ENTRY',
        payload: {
          action: 'ORACLE_QUERY',
          details: `Processed user query: "${userMessage.text.substring(0, 30)}..."`
        }
      });
    }, 800);
  };

  const handleQuickPrompt = (promptText: string) => {
    setInputMessage(promptText);
    // Small timeout to allow state to update before submitting
    setTimeout(() => {
      const userMessage: ChatMessage = {
        id: `M-${Date.now()}`,
        sender: 'user',
        text: promptText,
        timestamp: new Date()
      };
      dispatch({ type: 'ADD_CHAT_MESSAGE', payload: userMessage });
      dispatch({ type: 'SET_CHAT_LOADING', payload: true });

      setTimeout(() => {
        const oracleText = generateOracleResponse(promptText);
        const oracleMessage: ChatMessage = {
          id: `M-${Date.now() + 1}`,
          sender: 'oracle',
          text: oracleText,
          timestamp: new Date()
        };
        dispatch({ type: 'ADD_CHAT_MESSAGE', payload: oracleMessage });
        dispatch({ type: 'SET_CHAT_LOADING', payload: false });
      }, 600);
    }, 50);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[calc(100vh-220px)] min-h-[550px]">
      {/* Left: Quick Prompts & Context Panel */}
      <div className="lg:col-span-4 flex flex-col gap-6 h-full">
        <Card className="flex flex-col h-full">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Icon name="brain" className="text-blue-400 w-5 h-5" />
              <h3 className="text-base font-bold text-slate-200">Oracle Context</h3>
            </div>
          </CardHeader>
          <CardBody className="flex-grow space-y-4 overflow-y-auto custom-scrollbar">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Active Model</span>
              <div className="p-3 bg-slate-950/50 border border-slate-800/80 rounded-lg">
                <div className="font-bold text-sm text-slate-200">{activeScenario.name}</div>
                <p className="text-xs text-slate-400 mt-1">{activeScenario.description}</p>
                <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-slate-900 font-mono text-[10px] text-slate-400">
                  <div>Drift (μ): <span className="text-blue-400 font-bold">{activeScenario.growthRate}%</span></div>
                  <div>Volatility (σ): <span className="text-indigo-400 font-bold">{activeScenario.volatility}%</span></div>
                  <div>Base (S0): <span className="text-emerald-400 font-bold">${activeScenario.baseValue}M</span></div>
                  <div>Horizon (T): <span className="text-amber-400 font-bold">{activeScenario.horizonYears} Yrs</span></div>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Suggested Queries</span>
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => handleQuickPrompt("Analyze the downside risk and insolvency probability.")}
                  className="text-left p-2.5 bg-slate-950/30 border border-slate-800/60 hover:border-blue-500/40 hover:bg-blue-950/10 rounded-lg text-xs text-slate-300 transition-all"
                >
                  📊 Analyze Downside Risk & VaR
                </button>
                <button
                  onClick={() => handleQuickPrompt("What is the optimal hedging strategy using options?")}
                  className="text-left p-2.5 bg-slate-950/30 border border-slate-800/60 hover:border-blue-500/40 hover:bg-blue-950/10 rounded-lg text-xs text-slate-300 transition-all"
                >
                  🛡️ Calculate Black-Scholes Hedge
                </button>
                <button
                  onClick={() => handleQuickPrompt("Audit our regulatory compliance and Basel III LCR.")}
                  className="text-left p-2.5 bg-slate-950/30 border border-slate-800/60 hover:border-blue-500/40 hover:bg-blue-950/10 rounded-lg text-xs text-slate-300 transition-all"
                >
                  ⚖️ Audit Regulatory Compliance
                </button>
                <button
                  onClick={() => handleQuickPrompt("Explain the stochastic growth projection percentiles.")}
                  className="text-left p-2.5 bg-slate-950/30 border border-slate-800/60 hover:border-blue-500/40 hover:bg-blue-950/10 rounded-lg text-xs text-slate-300 transition-all"
                >
                  📈 Explain Growth Percentiles
                </button>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Right: Chat Interface */}
      <div className="lg:col-span-8 flex flex-col h-full">
        <Card className="flex flex-col h-full overflow-hidden">
          {/* Chat Header */}
          <div className="px-6 py-4 border-b border-slate-800/60 bg-slate-950/20 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-9 h-9 rounded-lg bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
                  <Icon name="oracle" className="w-5 h-5" />
                </div>
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-slate-950 rounded-full"></span>
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-200">Quantum Core Oracle</h3>
                <p className="text-[10px] text-slate-500 font-mono">v4.0 // ACTIVE_SESSION</p>
              </div>
            </div>
            <Badge color="blue">AES-256 Encrypted</Badge>
          </div>

          {/* Chat Messages Area */}
          <div className="flex-grow p-6 overflow-y-auto space-y-4 custom-scrollbar bg-slate-950/10">
            {state.chatHistory.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-3 max-w-[85%] ${msg.sender === 'user' ? 'ml-auto flex-row-reverse' : 'mr-auto'}`}
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 border ${
                  msg.sender === 'user'
                    ? 'bg-slate-800 border-slate-700 text-slate-300'
                    : 'bg-blue-950/40 border-blue-900/50 text-blue-400'
                }`}>
                  <Icon name={msg.sender === 'user' ? 'user' : 'oracle'} className="w-4 h-4" />
                </div>
                <div className={`rounded-xl p-4 text-xs leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/10'
                    : 'bg-slate-900/80 border border-slate-800/80 text-slate-300 whitespace-pre-line'
                }`}>
                  {msg.text}
                  <div className={`text-[9px] mt-2 font-mono ${msg.sender === 'user' ? 'text-blue-200 text-right' : 'text-slate-500'}`}>
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                  </div>
                </div>
              </div>
            ))}

            {/* Typing Indicator */}
            {state.isChatLoading && (
              <div className="flex gap-3 max-w-[80%] mr-auto">
                <div className="w-8 h-8 rounded-lg bg-blue-950/40 border border-blue-900/50 text-blue-400 flex items-center justify-center flex-shrink-0">
                  <Icon name="oracle" className="w-4 h-4" />
                </div>
                <div className="bg-slate-900/80 border border-slate-800/80 rounded-xl p-4 flex items-center gap-1.5">
                  <span className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                  <span className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                  <span className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Chat Input Form */}
          <div className="p-4 border-t border-slate-800/60 bg-slate-950/30">
            <form onSubmit={handleSendMessage} className="flex gap-2">
              <Input
                value={inputMessage}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInputMessage(e.target.value)}
                placeholder="Ask the Oracle about risk, hedging, compliance, or growth..."
                disabled={state.isChatLoading}
                className="flex-grow bg-slate-950/80 border-slate-800 focus:border-blue-500"
              />
              <Button type="submit" variant="primary" disabled={state.isChatLoading || !inputMessage.trim()}>
                <Icon name="arrowRight" className="w-4 h-4" />
              </Button>
            </form>
          </div>
        </Card>
      </div>
    </div>
  );
};

// ============================================================================
// 12. SUB-SYSTEM COMPONENT: REGULATORY COMPLIANCE TAB
// ============================================================================

/**
 * Detailed Regulatory Compliance & Stress Testing Dashboard.
 * Simulates Basel III Liquidity Coverage Ratio (LCR), Capital Adequacy Ratio (CAR),
 * Net Stable Funding Ratio (NSFR), and CCAR Stress Testing.
 */
export const ComplianceTab: React.FC = () => {
  const { state, dispatch } = useApp();
  const activeScenario = state.scenarios.find(s => s.id === state.activeScenarioId) || state.scenarios[0];
  const result = state.simulationResults[activeScenario.id];

  const triggerStressScenario = (stressType: FinancialScenario['stressScenario']) => {
    dispatch({
      type: 'UPDATE_SCENARIO',
      payload: { id: activeScenario.id, updates: { stressScenario: stressType } }
    });
    dispatch({
      type: 'ADD_LEDGER_ENTRY',
      payload: {
        action: 'STRESS_TRIGGER',
        details: `Triggered macro stress scenario: ${stressType.toUpperCase()} on ${activeScenario.name}`
      }
    });
  };

  if (!result) return null;

  const { complianceMetrics, riskMetrics } = result;

  return (
    <div className="space-y-6">
      {/* Compliance Status Banner */}
      <Card className="bg-gradient-to-r from-slate-900 via-slate-950 to-slate-900">
        <CardBody className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <Icon name="shield" className="text-emerald-400 w-5 h-5" />
              <h3 className="text-base font-bold text-slate-200">Regulatory Compliance Posture</h3>
            </div>
            <p className="text-xs text-slate-400 max-w-2xl">
              Real-time audit of capital adequacy, liquidity buffers, and stress-testing compliance under Basel III and Dodd-Frank Act guidelines.
            </p>
          </div>
          <div className="flex gap-4">
            <div className="text-center px-4 py-2 bg-slate-950/60 border border-slate-800/80 rounded-lg">
              <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">CCAR Status</div>
              <Badge color={complianceMetrics.ccarStatus === 'PASS' ? 'green' : complianceMetrics.ccarStatus === 'WARNING' ? 'amber' : 'red'} className="mt-1">
                {complianceMetrics.ccarStatus}
              </Badge>
            </div>
            <div className="text-center px-4 py-2 bg-slate-950/60 border border-slate-800/80 rounded-lg">
              <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Dodd-Frank Score</div>
              <div className="text-lg font-black text-slate-200 font-mono mt-0.5">{complianceMetrics.doddFrankScore}/100</div>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Regulatory Metrics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Basel III Liquidity Coverage Ratio */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Icon name="scale" className="text-blue-400 w-4 h-4" />
              <h4 className="text-sm font-bold text-slate-200">Basel III LCR</h4>
            </div>
            <Badge color={complianceMetrics.basel3Lcr >= 100 ? 'green' : 'red'}>
              {complianceMetrics.basel3Lcr >= 100 ? 'Compliant' : 'Breach'}
            </Badge>
          </CardHeader>
          <CardBody className="space-y-4">
            <div className="text-center py-4">
              <div className="text-4xl font-black text-slate-100 font-mono">
                {complianceMetrics.basel3Lcr.toFixed(1)}%
              </div>
              <span className="text-[10px] text-slate-500 font-mono">Regulatory Minimum: 100.0%</span>
            </div>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between text-slate-400">
                <span>High-Quality Liquid Assets (HQLA):</span>
                <span className="font-mono text-slate-200 font-bold">${activeScenario.liquidityReserve.toFixed(1)}M</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Stressed Net Outflows (30d):</span>
                <span className="font-mono text-slate-200 font-bold">
                  ${(activeScenario.liquidityReserve / (complianceMetrics.basel3Lcr / 100)).toFixed(1)}M
                </span>
              </div>
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Measures the stock of unencumbered high-quality liquid assets that can be converted into cash to meet liquidity needs over a 30-day stress horizon.
            </p>
          </CardBody>
        </Card>

        {/* Capital Adequacy Ratio (CAR) */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Icon name="database" className="text-indigo-400 w-4 h-4" />
              <h4 className="text-sm font-bold text-slate-200">Capital Adequacy Ratio</h4>
            </div>
            <Badge color={complianceMetrics.capitalAdequacyRatio >= 8 ? 'green' : 'red'}>
              {complianceMetrics.capitalAdequacyRatio >= 8 ? 'Compliant' : 'Breach'}
            </Badge>
          </CardHeader>
          <CardBody className="space-y-4">
            <div className="text-center py-4">
              <div className="text-4xl font-black text-slate-100 font-mono">
                {complianceMetrics.capitalAdequacyRatio.toFixed(1)}%
              </div>
              <span className="text-[10px] text-slate-500 font-mono">Regulatory Minimum: 8.0%</span>
            </div>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between text-slate-400">
                <span>Tier 1 Capital Buffer:</span>
                <span className="font-mono text-slate-200 font-bold">
                  ${(activeScenario.liquidityReserve + (activeScenario.baseValue * 0.20)).toFixed(1)}M
                </span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Risk-Weighted Assets (RWA):</span>
                <span className="font-mono text-slate-200 font-bold">
                  ${(activeScenario.baseValue * (1.0 + riskMetrics.volatilityIndex)).toFixed(1)}M
                </span>
              </div>
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Measures the ratio of a financial institution's capital to its risk-weighted assets, ensuring it can absorb a reasonable amount of loss.
            </p>
          </CardBody>
        </Card>

        {/* Net Stable Funding Ratio (NSFR) */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Icon name="lock" className="text-purple-400 w-4 h-4" />
              <h4 className="text-sm font-bold text-slate-200">Net Stable Funding Ratio</h4>
            </div>
            <Badge color={complianceMetrics.netStableFundingRatio >= 100 ? 'green' : 'red'}>
              {complianceMetrics.netStableFundingRatio >= 100 ? 'Compliant' : 'Breach'}
            </Badge>
          </CardHeader>
          <CardBody className="space-y-4">
            <div className="text-center py-4">
              <div className="text-4xl font-black text-slate-100 font-mono">
                {complianceMetrics.netStableFundingRatio.toFixed(1)}%
              </div>
              <span className="text-[10px] text-slate-500 font-mono">Regulatory Minimum: 100.0%</span>
            </div>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between text-slate-400">
                <span>Available Stable Funding (ASF):</span>
                <span className="font-mono text-slate-200 font-bold">
                  ${(activeScenario.liquidityReserve + (activeScenario.baseValue * 0.20) + (activeScenario.baseValue * (activeScenario.debtRatio / 100) * 0.5)).toFixed(1)}M
                </span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Required Stable Funding (RSF):</span>
                <span className="font-mono text-slate-200 font-bold">
                  ${(activeScenario.baseValue * 0.4).toFixed(1)}M
                </span>
              </div>
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Ensures that a financial institution maintains a stable funding profile in relation to the composition of its assets and off-balance sheet activities.
            </p>
          </CardBody>
        </Card>
      </div>

      {/* Interactive Stress Testing Controls */}
      <Card>
        <CardHeader>
          <div>
            <h4 className="text-sm font-bold text-slate-200">Macro Stress Testing Simulator</h4>
            <p className="text-xs text-slate-500">Inject systemic macroeconomic shocks to evaluate balance sheet resilience.</p>
          </div>
          <Badge color={activeScenario.stressScenario !== 'none' ? 'red' : 'slate'}>
            Active Stress: {activeScenario.stressScenario.toUpperCase()}
          </Badge>
        </CardHeader>
        <CardBody className="grid grid-cols-2 md:grid-cols-5 gap-3">
          <Button
            variant={activeScenario.stressScenario === 'none' ? 'primary' : 'outline'}
            size="sm"
            onClick={() => triggerStressScenario('none')}
          >
            Standard Market
          </Button>
          <Button
            variant={activeScenario.stressScenario === 'pandemic' ? 'destructive' : 'outline'}
            size="sm"
            onClick={() => triggerStressScenario('pandemic')}
          >
            Pandemic Shock
          </Button>
          <Button
            variant={activeScenario.stressScenario === 'financial_crisis' ? 'destructive' : 'outline'}
            size="sm"
            onClick={() => triggerStressScenario('financial_crisis')}
          >
            Financial Crisis
          </Button>
          <Button
            variant={activeScenario.stressScenario === 'inflation_shock' ? 'destructive' : 'outline'}
            size="sm"
            onClick={() => triggerStressScenario('inflation_shock')}
          >
            Inflation Shock
          </Button>
          <Button
            variant={activeScenario.stressScenario === 'tech_bubble' ? 'destructive' : 'outline'}
            size="sm"
            onClick={() => triggerStressScenario('tech_bubble')}
          >
            Tech Bubble Burst
          </Button>
        </CardBody>
      </Card>
    </div>
  );
};

// ============================================================================
// 13. SUB-SYSTEM COMPONENT: TRANSACTION LEDGER TAB
// ============================================================================

/**
 * Cryptographically hashed transaction ledger.
 * Simulates an immutable audit trail of all model updates, simulation runs,
 * and strategic decisions made within the application.
 */
export const LedgerTab: React.FC = () => {
  const { state } = useApp();

  return (
    <Card className="h-[calc(100vh-220px)] min-h-[500px] flex flex-col">
      <CardHeader>
        <div>
          <h3 className="text-base font-bold text-slate-200">Immutable Audit Ledger</h3>
          <p className="text-xs text-slate-500">Cryptographically hashed record of all system actions and parameter modifications.</p>
        </div>
        <Badge color="purple">SHA-256 Hashed</Badge>
      </CardHeader>
      <CardBody className="flex-grow overflow-y-auto custom-scrollbar p-0">
        <div className="min-w-full divide-y divide-slate-800/60">
          {/* Table Header */}
          <div className="grid grid-cols-12 gap-4 px-6 py-3 bg-slate-950/40 text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">
            <div className="col-span-2">Ledger ID</div>
            <div className="col-span-2">Timestamp</div>
            <div className="col-span-2">Action</div>
            <div className="col-span-3">Details</div>
            <div className="col-span-3 text-right">Cryptographic Hash</div>
          </div>

          {/* Table Body */}
          <div className="divide-y divide-slate-800/40 font-mono text-xs">
            {state.ledger.slice().reverse().map((entry) => (
              <div key={entry.id} className="grid grid-cols-12 gap-4 px-6 py-4 items-center hover:bg-slate-900/20 transition-colors">
                <div className="col-span-2 text-blue-400 font-bold">{entry.id}</div>
                <div className="col-span-2 text-slate-500">
                  {new Date(entry.timestamp).toLocaleString()}
                </div>
                <div className="col-span-2">
                  <Badge color={
                    entry.action.startsWith('SIMULATION') ? 'blue' :
                    entry.action.startsWith('SCENARIO') ? 'amber' :
                    entry.action.startsWith('STRESS') ? 'red' : 'slate'
                  }>
                    {entry.action}
                  </Badge>
                </div>
                <div className="col-span-3 text-slate-300 font-sans leading-relaxed">
                  {entry.details}
                </div>
                <div className="col-span-3 text-right text-slate-500 text-[10px] truncate" title={entry.hash}>
                  {entry.hash}
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardBody>
    </Card>
  );
};

// ============================================================================
// 14. MAIN APPLICATION ENTRY POINT
// ============================================================================

/**
 * Inner layout component that consumes the AppContext.
 */
const AIFinancialForecasterInner: React.FC = () => {
  const { state, dispatch } = useApp();
  const activeScenario = state.scenarios.find(s => s.id === state.activeScenarioId) || state.scenarios[0];
  const result = state.simulationResults[activeScenario.id];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans antialiased selection:bg-blue-500/30 selection:text-blue-200">
      {/* Background Ambient Glows */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-900/10 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-900/10 blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-6 md:py-10 space-y-8">
        {/* Header Section */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-800/60 pb-6">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-slate-500 text-xs font-mono uppercase tracking-widest">
              <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
              Quantum Core v4.0 // Oracle Simulation Interface
            </div>
            <h1 className="text-3xl font-black tracking-tight bg-gradient-to-r from-slate-100 via-slate-200 to-slate-400 bg-clip-text text-transparent">
              Quantum Oracle
            </h1>
            <p className="text-slate-400 text-sm max-w-2xl">
              Engage the stochastic simulation engine and AI Oracle for deep financial risk modeling, Black-Scholes hedging, and regulatory stress testing.
            </p>
          </div>

          {/* Global System Status Badges */}
          <div className="flex flex-wrap items-center gap-3">
            {result && (
              <Badge color={result.riskMetrics.probabilityOfInsolvency > 0.1 ? 'red' : 'green'}>
                RISK INDEX: {Math.round(result.riskMetrics.volatilityIndex * 100)}/100
              </Badge>
            )}
            <Badge color="blue">AUDITED</Badge>
            <Badge color="purple">AES-256</Badge>
          </div>
        </header>

        {/* Navigation Tabs */}
        <nav className="flex flex-wrap gap-2 border-b border-slate-800/40 pb-px">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: 'chart' },
            { id: 'builder', label: 'Scenario Builder', icon: 'settings' },
            { id: 'montecarlo', label: 'Monte Carlo Engine', icon: 'trending' },
            { id: 'oracle', label: 'AI Oracle Chat', icon: 'brain' },
            { id: 'compliance', label: 'Regulatory Compliance', icon: 'shield' },
            { id: 'ledger', label: 'Audit Ledger', icon: 'ledger' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => dispatch({ type: 'SET_ACTIVE_TAB', payload: tab.id as AppState['activeTab'] })}
              className={`flex items-center gap-2 px-4 py-3 text-xs font-bold uppercase tracking-wider border-b-2 transition-all duration-200 ${
                state.activeTab === tab.id
                  ? 'border-blue-500 text-blue-400 bg-blue-950/10'
                  : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-800'
              }`}
            >
              <Icon name={tab.icon as any} className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </nav>

        {/* Main Tab Content Router */}
        <main className="relative min-h-[500px]">
          {state.activeTab === 'dashboard' && <DashboardTab />}
          {state.activeTab === 'builder' && <ScenarioBuilderTab />}
          {state.activeTab === 'montecarlo' && <MonteCarloTab />}
          {state.activeTab === 'oracle' && <AIOracleTab />}
          {state.activeTab === 'compliance' && <ComplianceTab />}
          {state.activeTab === 'ledger' && <LedgerTab />}
        </main>

        {/* Footer Section */}
        <footer className="border-t border-slate-800/60 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-slate-500 gap-4">
          <div>
            &copy; {new Date().getFullYear()} Quantum Core Financial Systems. All Rights Reserved.
          </div>
          <div className="flex gap-6 font-mono">
            <span>System Status: <span className="text-emerald-400 font-bold">Operational</span></span>
            <span>Engine: <span className="text-blue-400 font-bold">GBM v4.0</span></span>
            <span>Environment: <span className="text-indigo-400 font-bold">US-EAST-1</span></span>
          </div>
        </footer>
      </div>
    </div>
  );
};

/**
 * The default export component wrapping the entire application with the AppProvider.
 */
export default function AIFinancialForecaster() {
  return (
    <AppProvider>
      <AIFinancialForecasterInner />
    </AppProvider>
  );
}// ============================================================================
// 15. ADVANCED SENSITIVITY ANALYSIS ENGINE
// ============================================================================

export interface SensitivityGridPoint {
  growthRate: number;
  volatility: number;
  terminalP50: number;
  valueAtRisk95: number;
  insolvencyRisk: number;
}

/**
 * Generates a 2D matrix of financial outcomes across varying growth rates and volatilities.
 * Uses analytical approximations of Geometric Brownian Motion for high-performance rendering.
 */
export const generateSensitivityMatrix = (
  baseValue: number,
  growthRange: number[],
  volatilityRange: number[],
  horizonYears: number,
  riskFreeRate: number = 0.045
): SensitivityGridPoint[][] => {
  const matrix: SensitivityGridPoint[][] = [];

  for (const muPct of growthRange) {
    const row: SensitivityGridPoint[] = [];
    const mu = muPct / 100;

    for (const sigmaPct of volatilityRange) {
      const sigma = sigmaPct / 100;

      // Analytical median (P50) terminal value under GBM: S_0 * exp(mu * T)
      const terminalP50 = baseValue * Math.exp(mu * horizonYears);

      // Analytical 95% Value at Risk (VaR) approximation:
      // VaR_95 = 1 - exp( (mu - 0.5 * sigma^2)*T - 1.645 * sigma * sqrt(T) )
      const driftTerm = (mu - 0.5 * sigma * sigma) * horizonYears;
      const diffusionTerm = 1.645 * sigma * Math.sqrt(horizonYears);
      const terminalP05 = baseValue * Math.exp(driftTerm - diffusionTerm);
      const valueAtRisk95 = Math.max(0, (baseValue - terminalP05) / baseValue);

      // Insolvency risk: Probability that the asset value drops below 10% of initial value
      // Using the running minimum distribution of GBM (reflection principle / barrier probability)
      const barrier = baseValue * 0.10;
      const d1 = (Math.log(baseValue / barrier) + (mu - 0.5 * sigma * sigma) * horizonYears) / (sigma * Math.sqrt(horizonYears));
      const d2 = d1 - 2 * (mu - 0.5 * sigma * sigma) * Math.log(baseValue / barrier) / (sigma * sigma * Math.sqrt(horizonYears));
      
      // Standard normal cumulative distribution approximation
      const normCDF = (x: number): number => {
        const t = 1 / (1 + 0.2316419 * Math.abs(x));
        const d = 0.39894228 * Math.exp(-x * x / 2);
        const p = d * t * (0.31938153 + t * (-0.356563782 + t * (1.781477937 + t * (-1.821255978 + t * 1.330274429))));
        return x >= 0 ? 1 - p : p;
      };

      const probTouchBarrier = normCDF(-d1) + Math.pow(barrier / baseValue, (2 * mu) / (sigma * sigma) - 1) * normCDF(-d2);
      const insolvencyRisk = Math.max(0, Math.min(1, isNaN(probTouchBarrier) ? 0 : probTouchBarrier));

      row.push({
        growthRate: muPct,
        volatility: sigmaPct,
        terminalP50,
        valueAtRisk95,
        insolvencyRisk
      });
    }
    matrix.push(row);
  }

  return matrix;
};

/**
 * Interactive 2D Heatmap component for multi-dimensional parameter sensitivity analysis.
 */
export const SensitivityAnalysisView: React.FC<{ baseValue: number; horizonYears: number }> = ({
  baseValue,
  horizonYears
}) => {
  const growthRange = [-10, -5, 0, 5, 10, 15, 20, 25, 30];
  const volatilityRange = [5, 10, 15, 20, 25, 30, 40, 50, 60];
  const [metric, setMetric] = useState<'terminalP50' | 'valueAtRisk95' | 'insolvencyRisk'>('terminalP50');
  const [hoveredCell, setHoveredCell] = useState<SensitivityGridPoint | null>(null);

  const matrix = useMemo(() => {
    return generateSensitivityMatrix(baseValue, growthRange, volatilityRange, horizonYears);
  }, [baseValue, horizonYears]);

  // Helper to determine cell background color based on value intensity
  const getCellColor = (point: SensitivityGridPoint) => {
    if (metric === 'terminalP50') {
      const maxVal = baseValue * Math.exp(0.30 * horizonYears);
      const minVal = baseValue * Math.exp(-0.10 * horizonYears);
      const pct = (point.terminalP50 - minVal) / (maxVal - minVal);
      return `rgba(59, 130, 246, ${Math.max(0.1, Math.min(0.9, pct))})`; // Blue scale
    } else if (metric === 'valueAtRisk95') {
      return `rgba(245, 158, 11, ${Math.max(0.1, Math.min(0.9, point.valueAtRisk95))})`; // Amber scale
    } else {
      return `rgba(239, 68, 68, ${Math.max(0.1, Math.min(0.9, point.insolvencyRisk))})`; // Red scale
    }
  };

  return (
    <Card className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h3 className="text-base font-bold text-slate-200">Multi-Dimensional Sensitivity Matrix</h3>
          <p className="text-xs text-slate-500">Analyze how terminal outcomes shift under simultaneous parameter variations.</p>
        </div>
        <div className="flex gap-2">
          <Button
            size="sm"
            variant={metric === 'terminalP50' ? 'primary' : 'outline'}
            onClick={() => setMetric('terminalP50')}
          >
            Terminal Value (P50)
          </Button>
          <Button
            size="sm"
            variant={metric === 'valueAtRisk95' ? 'primary' : 'outline'}
            onClick={() => setMetric('valueAtRisk95')}
          >
            95% VaR
          </Button>
          <Button
            size="sm"
            variant={metric === 'insolvencyRisk' ? 'primary' : 'outline'}
            onClick={() => setMetric('insolvencyRisk')}
          >
            Insolvency Risk
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Heatmap Grid */}
        <div className="lg:col-span-8 overflow-x-auto custom-scrollbar">
          <div className="min-w-[500px] space-y-1">
            {/* Volatility Header */}
            <div className="flex items-center">
              <div className="w-20 text-[10px] font-bold text-slate-500 uppercase tracking-wider text-right pr-3">
                Drift \ Vol
              </div>
              <div className="flex-grow grid grid-cols-9 gap-1 text-center text-[10px] font-bold text-slate-400 font-mono">
                {volatilityRange.map((vol) => (
                  <div key={vol}>{vol}%</div>
                ))}
              </div>
            </div>

            {/* Matrix Rows */}
            {matrix.map((row, rIdx) => (
              <div key={rIdx} className="flex items-center">
                <div className="w-20 text-[10px] font-bold text-slate-400 font-mono text-right pr-3">
                  {growthRange[rIdx]}%
                </div>
                <div className="flex-grow grid grid-cols-9 gap-1">
                  {row.map((point, cIdx) => (
                    <div
                      key={cIdx}
                      onMouseEnter={() => setHoveredCell(point)}
                      onMouseLeave={() => setHoveredCell(null)}
                      className="h-10 rounded cursor-crosshair transition-all duration-150 hover:scale-105 hover:ring-2 hover:ring-white/40 flex items-center justify-center text-[10px] font-mono font-bold text-slate-100"
                      style={{ backgroundColor: getCellColor(point) }}
                    >
                      {metric === 'terminalP50' && `$${point.terminalP50.toFixed(0)}M`}
                      {metric === 'valueAtRisk95' && `${(point.valueAtRisk95 * 100).toFixed(0)}%`}
                      {metric === 'insolvencyRisk' && `${(point.insolvencyRisk * 100).toFixed(0)}%`}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Hover Details Panel */}
        <div className="lg:col-span-4">
          <Card className="bg-slate-950/60 border-slate-800/80 p-4 h-full flex flex-col justify-center min-h-[180px]">
            {hoveredCell ? (
              <div className="space-y-3">
                <div className="border-b border-slate-800 pb-2">
                  <h4 className="text-xs font-bold text-blue-400 uppercase tracking-wider">Scenario Coordinates</h4>
                  <div className="flex justify-between text-sm font-mono font-bold text-slate-200 mt-1">
                    <span>Drift (μ): {hoveredCell.growthRate}%</span>
                    <span>Volatility (σ): {hoveredCell.volatility}%</span>
                  </div>
                </div>
                <div className="space-y-1.5 font-mono text-xs">
                  <div className="flex justify-between text-slate-400">
                    <span>Terminal Value (P50):</span>
                    <span className="text-slate-200 font-bold">${hoveredCell.terminalP50.toFixed(2)}M</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>95% Value at Risk:</span>
                    <span className="text-amber-400 font-bold">{(hoveredCell.valueAtRisk95 * 100).toFixed(1)}%</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Insolvency Probability:</span>
                    <span className={`font-bold ${hoveredCell.insolvencyRisk > 0.1 ? 'text-red-400' : 'text-emerald-400'}`}>
                      {(hoveredCell.insolvencyRisk * 100).toFixed(1)}%
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center text-slate-500 text-xs py-6">
                <Icon name="info" className="w-8 h-8 mx-auto mb-2 text-slate-700" />
                Hover over any cell in the sensitivity matrix to inspect detailed risk metrics.
              </div>
            )}
          </Card>
        </div>
      </div>
    </Card>
  );
};

// ============================================================================
// 16. MODERN PORTFOLIO THEORY (MPT) EFFICIENT FRONTIER SIMULATOR
// ============================================================================

export interface AssetDefinition {
  id: string;
  name: string;
  expectedReturn: number; // Annual return (%)
  volatility: number;     // Annual volatility (%)
}

export interface EfficientFrontierPoint {
  weights: Record<string, number>;
  expectedReturn: number;
  volatility: number;
  sharpeRatio: number;
}

/**
 * Generates random portfolios to construct the Markowitz Efficient Frontier.
 */
export const generateEfficientFrontier = (
  assets: AssetDefinition[],
  correlations: number[][],
  riskFreeRate: number = 4.5,
  numPortfolios: number = 1000
): {
  frontier: EfficientFrontierPoint[];
  maxSharpe: EfficientFrontierPoint;
  minVol: EfficientFrontierPoint;
} => {
  const frontier: EfficientFrontierPoint[] = [];
  const rf = riskFreeRate / 100;

  let maxSharpe: EfficientFrontierPoint = { weights: {}, expectedReturn: 0, volatility: 999, sharpeRatio: -999 };
  let minVol: EfficientFrontierPoint = { weights: {}, expectedReturn: 0, volatility: 999, sharpeRatio: -999 };

  for (let p = 0; p < numPortfolios; p++) {
    // Generate random weights that sum to 1
    const rawWeights = assets.map(() => Math.random());
    const sumWeights = rawWeights.reduce((sum, w) => sum + w, 0);
    const weights: Record<string, number> = {};
    assets.forEach((asset, idx) => {
      weights[asset.id] = rawWeights[idx] / sumWeights;
    });

    // Calculate expected portfolio return
    let expectedReturn = 0;
    assets.forEach((asset) => {
      expectedReturn += weights[asset.id] * (asset.expectedReturn / 100);
    });

    // Calculate portfolio variance: w^T * Covariance * w
    let portfolioVariance = 0;
    for (let i = 0; i < assets.length; i++) {
      for (let j = 0; j < assets.length; j++) {
        const w_i = weights[assets[i].id];
        const w_j = weights[assets[j].id];
        const sigma_i = assets[i].volatility / 100;
        const sigma_j = assets[j].volatility / 100;
        const rho_ij = correlations[i][j];
        portfolioVariance += w_i * w_j * sigma_i * sigma_j * rho_ij;
      }
    }

    const volatility = Math.sqrt(portfolioVariance);
    const sharpeRatio = volatility > 0 ? (expectedReturn - rf) / volatility : 0;

    const point: EfficientFrontierPoint = {
      weights,
      expectedReturn: expectedReturn * 100,
      volatility: volatility * 100,
      sharpeRatio
    };

    frontier.push(point);

    if (sharpeRatio > maxSharpe.sharpeRatio) {
      maxSharpe = point;
    }
    if (volatility * 100 < minVol.volatility) {
      minVol = point;
    }
  }

  return { frontier, maxSharpe, minVol };
};

/**
 * Interactive Portfolio Optimization Dashboard.
 */
export const PortfolioOptimizerView: React.FC = () => {
  const [assets, setAssets] = useState<AssetDefinition[]>([
    { id: 'A', name: 'Core Equities (US)', expectedReturn: 12, volatility: 16 },
    { id: 'B', name: 'Fixed Income (Bonds)', expectedReturn: 5, volatility: 6 },
    { id: 'C', name: 'Alternative Assets (Crypto/Gold)', expectedReturn: 22, volatility: 35 }
  ]);

  // Correlation matrix: A-A, A-B, A-C, etc.
  const correlations = [
    [1.0, 0.15, 0.45],  // US Equities
    [0.15, 1.0, -0.10], // Bonds
    [0.45, -0.10, 1.0]  // Alternatives
  ];

  const { frontier, maxSharpe, minVol } = useMemo(() => {
    return generateEfficientFrontier(assets, correlations, 4.5, 1200);
  }, [assets]);

  const handleAssetUpdate = (id: string, key: 'expectedReturn' | 'volatility', val: number) => {
    setAssets(prev => prev.map(asset => asset.id === id ? { ...asset, [key]: val } : asset));
  };

  // SVG Charting coordinates
  const padding = { top: 20, right: 20, bottom: 40, left: 50 };
  const width = 500;
  const height = 300;

  const maxReturn = Math.max(...frontier.map(p => p.expectedReturn)) * 1.05;
  const minReturn = Math.min(...frontier.map(p => p.expectedReturn)) * 0.95;
  const maxVol = Math.max(...frontier.map(p => p.volatility)) * 1.05;
  const minVolVal = Math.min(...frontier.map(p => p.volatility)) * 0.95;

  const getX = (v: number) => padding.left + ((v - minVolVal) / (maxVol - minVolVal)) * (width - padding.left - padding.right);
  const getY = (r: number) => padding.top + height - padding.bottom - ((r - minReturn) / (maxReturn - minReturn)) * (height - padding.top - padding.bottom);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Left: Asset Parameters */}
      <div className="lg:col-span-5 space-y-6">
        <Card>
          <CardHeader>
            <h3 className="text-base font-bold text-slate-200">Asset Allocation Sandbox</h3>
          </CardHeader>
          <CardBody className="space-y-6">
            {assets.map((asset) => (
              <div key={asset.id} className="space-y-4 p-4 bg-slate-950/40 border border-slate-800/80 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-bold text-slate-200">{asset.name}</span>
                  <Badge color={asset.id === 'A' ? 'blue' : asset.id === 'B' ? 'green' : 'purple'}>
                    Asset {asset.id}
                  </Badge>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Slider
                    label="Expected Return"
                    min={1}
                    max={40}
                    step={0.5}
                    value={asset.expectedReturn}
                    suffix="%"
                    onChange={(val) => handleAssetUpdate(asset.id, 'expectedReturn', val)}
                  />
                  <Slider
                    label="Volatility"
                    min={2}
                    max={60}
                    step={0.5}
                    value={asset.volatility}
                    suffix="%"
                    onChange={(val) => handleAssetUpdate(asset.id, 'volatility', val)}
                  />
                </div>
              </div>
            ))}
          </CardBody>
        </Card>
      </div>

      {/* Right: Efficient Frontier Visualization */}
      <div className="lg:col-span-7 space-y-6">
        <Card>
          <CardHeader>
            <div>
              <h3 className="text-base font-bold text-slate-200">Markowitz Efficient Frontier</h3>
              <p className="text-xs text-slate-500">Stochastic portfolio optimization across 1,200 simulated allocations.</p>
            </div>
          </CardHeader>
          <CardBody className="space-y-6">
            <div className="relative overflow-hidden bg-slate-950/40 border border-slate-800/80 rounded-xl p-4">
              <svg viewBox={`0 0 ${width} ${height}`} width="100%" height={height} className="overflow-visible">
                {/* Grid Lines */}
                {[0, 0.25, 0.5, 0.75, 1].map((tick, i) => (
                  <line
                    key={i}
                    x1={padding.left}
                    y1={padding.top + (height - padding.top - padding.bottom) * tick}
                    x2={width - padding.right}
                    y2={padding.top + (height - padding.top - padding.bottom) * tick}
                    stroke="#1e293b"
                    strokeWidth="1"
                    strokeDasharray="4 4"
                    className="opacity-40"
                  />
                ))}

                {/* Simulated Portfolios Scatter Plot */}
                {frontier.map((point, idx) => (
                  <circle
                    key={idx}
                    cx={getX(point.volatility)}
                    cy={getY(point.expectedReturn)}
                    r="1.5"
                    fill="rgba(99, 102, 241, 0.25)"
                  />
                ))}

                {/* Optimal Portfolios */}
                {/* Max Sharpe Portfolio */}
                <circle
                  cx={getX(maxSharpe.volatility)}
                  cy={getY(maxSharpe.expectedReturn)}
                  r="6"
                  fill="#f59e0b"
                  stroke="#0f172a"
                  strokeWidth="2"
                  className="cursor-pointer"
                />
                {/* Min Volatility Portfolio */}
                <circle
                  cx={getX(minVol.volatility)}
                  cy={getY(minVol.expectedReturn)}
                  r="6"
                  fill="#10b981"
                  stroke="#0f172a"
                  strokeWidth="2"
                  className="cursor-pointer"
                />

                {/* Axis Labels */}
                <text
                  x={width / 2}
                  y={height - 5}
                  fill="#64748b"
                  fontSize="10"
                  fontFamily="monospace"
                  textAnchor="middle"
                >
                  Portfolio Volatility (Risk) %
                </text>
                <text
                  x={10}
                  y={height / 2}
                  fill="#64748b"
                  fontSize="10"
                  fontFamily="monospace"
                  textAnchor="middle"
                  transform={`rotate(-90, 10, ${height / 2})`}
                >
                  Expected Return %
                </text>
              </svg>
            </div>

            {/* Optimal Allocation Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-amber-950/20 border border-amber-900/40 rounded-lg space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">Max Sharpe Ratio</span>
                  <Badge color="amber">Optimal Return/Risk</Badge>
                </div>
                <div className="font-mono text-xs space-y-1 text-slate-300">
                  <div>Expected Return: <strong className="text-slate-100">{maxSharpe.expectedReturn.toFixed(2)}%</strong></div>
                  <div>Volatility: <strong className="text-slate-100">{maxSharpe.volatility.toFixed(2)}%</strong></div>
                  <div>Sharpe Ratio: <strong className="text-amber-400">{maxSharpe.sharpeRatio.toFixed(2)}</strong></div>
                  <div className="pt-2 border-t border-amber-900/30 mt-2">
                    <div className="text-[10px] text-slate-500 uppercase font-bold">Allocation Weights:</div>
                    {assets.map(asset => (
                      <div key={asset.id} className="flex justify-between text-[11px] mt-0.5">
                        <span>{asset.name}:</span>
                        <span className="font-bold text-slate-200">{((maxSharpe.weights[asset.id] || 0) * 100).toFixed(1)}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-4 bg-emerald-950/20 border border-emerald-900/40 rounded-lg space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Minimum Variance</span>
                  <Badge color="green">Lowest Risk</Badge>
                </div>
                <div className="font-mono text-xs space-y-1 text-slate-300">
                  <div>Expected Return: <strong className="text-slate-100">{minVol.expectedReturn.toFixed(2)}%</strong></div>
                  <div>Volatility: <strong className="text-slate-100">{minVol.volatility.toFixed(2)}%</strong></div>
                  <div>Sharpe Ratio: <strong className="text-emerald-400">{minVol.sharpeRatio.toFixed(2)}</strong></div>
                  <div className="pt-2 border-t border-emerald-900/30 mt-2">
                    <div className="text-[10px] text-slate-500 uppercase font-bold">Allocation Weights:</div>
                    {assets.map(asset => (
                      <div key={asset.id} className="flex justify-between text-[11px] mt-0.5">
                        <span>{asset.name}:</span>
                        <span className="font-bold text-slate-200">{((minVol.weights[asset.id] || 0) * 100).toFixed(1)}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

// ============================================================================
// 17. HISTORICAL REGIME BACKTESTING ENGINE
// ============================================================================

export interface HistoricalRegime {
  id: string;
  name: string;
  description: string;
  annualReturn: number;
  volatility: number;
  durationMonths: number;
}

export interface BacktestResult {
  regimeId: string;
  equityCurve: number[];
  totalReturn: number;
  maxDrawdown: number;
  sharpeRatio: number;
}

/**
 * Runs a historical backtest simulation of a portfolio allocation across a specific market regime.
 */
export const runRegimeBacktest = (
  regime: HistoricalRegime,
  initialCapital: number,
  allocationWeights: Record<string, number>,
  assets: AssetDefinition[]
): BacktestResult => {
  const dt = 1 / 12; // Monthly steps
  const equityCurve: number[] = [initialCapital];
  let currentCapital = initialCapital;

  // Calculate weighted portfolio return and volatility
  let portfolioReturn = 0;
  let portfolioVolatility = 0;

  assets.forEach((asset) => {
    const weight = allocationWeights[asset.id] || 0;
    portfolioReturn += weight * (regime.annualReturn / 100);
    portfolioVolatility += weight * (regime.volatility / 100);
  });

  let peak = initialCapital;
  let maxDrawdown = 0;

  for (let m = 1; m <= regime.durationMonths; m++) {
    const { z0 } = boxMullerTransform();
    const exponent = (portfolioReturn - 0.5 * portfolioVolatility * portfolioVolatility) * dt + portfolioVolatility * z0 * Math.sqrt(dt);
    currentCapital = currentCapital * Math.exp(exponent);
    equityCurve.push(currentCapital);

    if (currentCapital > peak) {
      peak = currentCapital;
    }
    const drawdown = (peak - currentCapital) / peak;
    if (drawdown > maxDrawdown) {
      maxDrawdown = drawdown;
    }
  }

  const totalReturn = (currentCapital - initialCapital) / initialCapital;
  const rf = 0.045; // Risk-free rate
  const sharpeRatio = portfolioVolatility > 0 ? (portfolioReturn - rf) / portfolioVolatility : 0;

  return {
    regimeId: regime.id,
    equityCurve,
    totalReturn,
    maxDrawdown,
    sharpeRatio
  };
};

/**
 * Interactive Historical Backtesting Dashboard.
 */
export const HistoricalBacktesterView: React.FC = () => {
  const regimes: HistoricalRegime[] = [
    {
      id: 'gfc',
      name: 'Great Financial Crisis (2008)',
      description: 'Severe systemic banking crisis characterized by extreme volatility and asset liquidations.',
      annualReturn: -22,
      volatility: 35,
      durationMonths: 18
    },
    {
      id: 'covid',
      name: 'COVID-19 Market Shock (2020)',
      description: 'Rapid liquidity crash followed by an unprecedented central bank-fueled recovery.',
      annualReturn: 15,
      volatility: 28,
      durationMonths: 12
    },
    {
      id: 'dotcom',
      name: 'Dot-Com Bubble Burst (2000)',
      description: 'Extended valuation correction in technology and growth equities.',
      annualReturn: -12,
      volatility: 22,
      durationMonths: 36
    },
    {
      id: 'stagflation',
      name: '1970s Stagflation Regime',
      description: 'High inflation, low growth, and stagnant equity returns with elevated commodity volatility.',
      annualReturn: 2,
      volatility: 18,
      durationMonths: 48
    }
  ];

  const assets: AssetDefinition[] = [
    { id: 'A', name: 'Core Equities (US)', expectedReturn: 12, volatility: 16 },
    { id: 'B', name: 'Fixed Income (Bonds)', expectedReturn: 5, volatility: 6 },
    { id: 'C', name: 'Alternative Assets (Crypto/Gold)', expectedReturn: 22, volatility: 35 }
  ];

  const [selectedRegimeId, setSelectedRegimeId] = useState<string>('gfc');
  const [allocation, setAllocation] = useState<Record<string, number>>({ A: 0.6, B: 0.3, C: 0.1 });
  const [backtest, setBacktest] = useState<BacktestResult | null>(null);

  const activeRegime = regimes.find(r => r.id === selectedRegimeId) || regimes[0];

  const executeBacktest = useCallback(() => {
    const result = runRegimeBacktest(activeRegime, 100, allocation, assets);
    setBacktest(result);
  }, [selectedRegimeId, allocation]);

  useEffect(() => {
    executeBacktest();
  }, [selectedRegimeId]);

  const handleWeightChange = (assetId: string, val: number) => {
    setAllocation(prev => {
      const updated = { ...prev, [assetId]: val / 100 };
      // Normalize other weights to ensure sum is 1.0
      const otherIds = Object.keys(updated).filter(id => id !== assetId);
      const remainingWeight = 1.0 - updated[assetId];
      const currentOtherSum = otherIds.reduce((sum, id) => sum + (prev[id] || 0), 0);

      if (currentOtherSum > 0) {
        otherIds.forEach(id => {
          updated[id] = (prev[id] / currentOtherSum) * remainingWeight;
        });
      } else {
        otherIds.forEach(id => {
          updated[id] = remainingWeight / otherIds.length;
        });
      }
      return updated;
    });
  };

  // SVG Charting coordinates
  const padding = { top: 20, right: 20, bottom: 30, left: 50 };
  const width = 500;
  const height = 220;

  const maxVal = backtest ? Math.max(...backtest.equityCurve) * 1.05 : 120;
  const minVal = backtest ? Math.min(...backtest.equityCurve) * 0.95 : 80;

  const getX = (index: number, total: number) => padding.left + (index / total) * (width - padding.left - padding.right);
  const getY = (val: number) => padding.top + height - padding.bottom - ((val - minVal) / (maxVal - minVal)) * (height - padding.top - padding.bottom);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Left: Regime Selection & Allocation */}
      <div className="lg:col-span-4 space-y-6">
        <Card>
          <CardHeader>
            <h3 className="text-base font-bold text-slate-200">Regime Backtester</h3>
          </CardHeader>
          <CardBody className="space-y-4">
            <Select
              label="Select Historical Regime"
              value={selectedRegimeId}
              onChange={(e) => setSelectedRegimeId(e.target.value)}
              options={regimes.map(r => ({ value: r.id, label: r.name }))}
            />
            <p className="text-xs text-slate-400 leading-relaxed bg-slate-950/40 p-3 border border-slate-800/60 rounded-lg">
              {activeRegime.description}
            </p>

            <div className="border-t border-slate-800/60 pt-4 space-y-4">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Backtest Allocation</h4>
              {assets.map(asset => (
                <Slider
                  key={asset.id}
                  label={asset.name}
                  min={0}
                  max={100}
                  step={5}
                  value={Math.round((allocation[asset.id] || 0) * 100)}
                  suffix="%"
                  onChange={(val) => handleWeightChange(asset.id, val)}
                />
              ))}
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Right: Backtest Performance Chart */}
      <div className="lg:col-span-8 space-y-6">
        <Card>
          <CardHeader>
            <div>
              <h3 className="text-base font-bold text-slate-200">Equity Curve Simulation</h3>
              <p className="text-xs text-slate-500">Stochastic backtest starting with $100M initial capital.</p>
            </div>
            <Button size="sm" variant="outline" onClick={executeBacktest}>
              <Icon name="refresh" className="w-3.5 h-3.5 mr-1.5" /> Run Backtest
            </Button>
          </CardHeader>
          <CardBody className="space-y-6">
            {backtest && (
              <>
                <div className="relative overflow-hidden bg-slate-950/40 border border-slate-800/80 rounded-xl p-4">
                  <svg viewBox={`0 0 ${width} ${height}`} width="100%" height={height} className="overflow-visible">
                    {/* Grid Lines */}
                    {[0, 0.5, 1].map((tick, i) => (
                      <line
                        key={i}
                        x1={padding.left}
                        y1={padding.top + (height - padding.top - padding.bottom) * tick}
                        x2={width - padding.right}
                        y2={padding.top + (height - padding.top - padding.bottom) * tick}
                        stroke="#1e293b"
                        strokeWidth="1"
                        strokeDasharray="4 4"
                        className="opacity-40"
                      />
                    ))}

                    {/* Equity Curve Path */}
                    <path
                      d={backtest.equityCurve
                        .map((val, idx) => `${idx === 0 ? 'M' : 'L'} ${getX(idx, backtest.equityCurve.length - 1)} ${getY(val)}`)
                        .join(' ')}
                      fill="none"
                      stroke="#3b82f6"
                      strokeWidth="2.5"
                    />

                    {/* Axis Labels */}
                    <text
                      x={padding.left}
                      y={height - 5}
                      fill="#64748b"
                      fontSize="9"
                      fontFamily="monospace"
                    >
                      Month 0
                    </text>
                    <text
                      x={width - padding.right}
                      y={height - 5}
                      fill="#64748b"
                      fontSize="9"
                      fontFamily="monospace"
                      textAnchor="end"
                    >
                      Month {activeRegime.durationMonths}
                    </text>
                  </svg>
                </div>

                {/* Backtest KPI Grid */}
                <div className="grid grid-cols-3 gap-4 font-mono text-xs">
                  <div className="p-3 bg-slate-950/40 border border-slate-800/80 rounded-lg text-center">
                    <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Total Return</div>
                    <div className={`text-lg font-black mt-1 ${backtest.totalReturn >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                      {(backtest.totalReturn * 100).toFixed(1)}%
                    </div>
                  </div>
                  <div className="p-3 bg-slate-950/40 border border-slate-800/80 rounded-lg text-center">
                    <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Max Drawdown</div>
                    <div className="text-lg font-black text-amber-500 mt-1">
                      {(backtest.maxDrawdown * 100).toFixed(1)}%
                    </div>
                  </div>
                  <div className="p-3 bg-slate-950/40 border border-slate-800/80 rounded-lg text-center">
                    <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Sharpe Ratio</div>
                    <div className="text-lg font-black text-blue-400 mt-1">
                      {backtest.sharpeRatio.toFixed(2)}
                    </div>
                  </div>
                </div>
              </>
            )}
          </CardBody>
        </Card>
      </div>
    </div>
  );
};// ============================================================================
// 18. CCAR STRESS TESTING & CAPITAL ADEQUACY PLANNER
// ============================================================================

export interface CCARQuarterProjection {
  quarter: string;
  cet1Capital: number;
  rwa: number;
  cet1Ratio: number;
  netIncome: number;
  capitalActions: number;
}

/**
 * Simulates a 9-quarter CCAR (Comprehensive Capital Analysis and Review) stress testing horizon.
 * Projects CET1 Capital, Risk-Weighted Assets, and pro-forma capital ratios under macroeconomic stress.
 */
export const projectCCARHorizon = (
  baseValue: number,
  volatilityIndex: number,
  liquidityReserve: number,
  debtRatio: number,
  interestRate: number,
  stressSeverity: 'baseline' | 'adverse' | 'severely_adverse',
  haircutPct: number,
  quarterlyDividend: number,
  quarterlyBuyback: number,
  capitalIssuance: number
): CCARQuarterProjection[] => {
  const projections: CCARQuarterProjection[] = [];
  
  // Initial capital position
  let currentCET1 = liquidityReserve + (baseValue * 0.20);
  let currentRWA = baseValue * (1.0 + volatilityIndex);
  
  const severityMultiplier = stressSeverity === 'baseline' ? 0.0 : stressSeverity === 'adverse' ? 1.5 : 3.0;
  const baseQuarterlyRevenue = (baseValue * 0.15); // Simulated quarterly revenue
  const baseQuarterlyOpEx = (baseValue * 0.08);    // Simulated quarterly OpEx
  const quarterlyInterest = (baseValue * (debtRatio / 100) * (interestRate / 100)) / 4;

  for (let q = 1; q <= 9; q++) {
    const quarterLabel = `Q${q}`;
    
    // Macroeconomic stress impacts on revenue and credit losses
    const revenueShock = 1.0 - (severityMultiplier * 0.04) - (haircutPct / 100);
    const lossProvisionMultiplier = 1.0 + (severityMultiplier * 0.35);
    
    const stressedRevenue = baseQuarterlyRevenue * revenueShock;
    const stressedOpEx = baseQuarterlyOpEx * (1.0 + (severityMultiplier * 0.02));
    const creditLossProvisions = (baseValue * 0.01) * lossProvisionMultiplier;
    
    const preTaxIncome = stressedRevenue - stressedOpEx - quarterlyInterest - creditLossProvisions;
    const tax = preTaxIncome > 0 ? preTaxIncome * 0.21 : 0;
    const netIncome = preTaxIncome - tax;
    
    // Capital actions (outflows)
    const dividends = quarterlyDividend;
    const buybacks = quarterlyBuyback;
    const issuance = capitalIssuance;
    const netCapitalActions = dividends + buybacks - issuance;
    
    // Update CET1 Capital
    currentCET1 = currentCET1 + netIncome - netCapitalActions;
    
    // Stressed RWA expansion due to credit migration and market volatility
    const rwaGrowth = 1.0 + (severityMultiplier * 0.015) - (haircutPct / 200);
    currentRWA = currentRWA * rwaGrowth;
    
    const cet1Ratio = (currentCET1 / currentRWA) * 100;
    
    projections.push({
      quarter: quarterLabel,
      cet1Capital: Math.max(0, currentCET1),
      rwa: currentRWA,
      cet1Ratio: Math.max(0, cet1Ratio),
      netIncome,
      capitalActions: netCapitalActions
    });
  }
  
  return projections;
};

/**
 * Interactive CCAR Stress Planner Component.
 */
export const CCARStressPlannerView: React.FC = () => {
  const { state } = useApp();
  const activeScenario = state.scenarios.find(s => s.id === state.activeScenarioId) || state.scenarios[0];
  const result = state.simulationResults[activeScenario.id];
  
  const [severity, setSeverity] = useState<'baseline' | 'adverse' | 'severely_adverse'>('severely_adverse');
  const [haircut, setHaircut] = useState<number>(10);
  const [dividend, setDividend] = useState<number>(1.5);
  const [buyback, setBuyback] = useState<number>(1.0);
  const [issuance, setIssuance] = useState<number>(0.0);

  const volatilityIndex = result ? result.riskMetrics.volatilityIndex : 0.15;
  const liquidityReserve = activeScenario.liquidityReserve;

  const projections = useMemo(() => {
    return projectCCARHorizon(
      activeScenario.baseValue,
      volatilityIndex,
      liquidityReserve,
      activeScenario.debtRatio,
      activeScenario.interestRate,
      severity,
      haircut,
      dividend,
      buyback,
      issuance
    );
  }, [activeScenario, volatilityIndex, severity, haircut, dividend, buyback, issuance]);

  // SVG Charting coordinates
  const padding = { top: 20, right: 30, bottom: 30, left: 50 };
  const width = 600;
  const height = 240;

  const maxRatio = Math.max(...projections.map(p => p.cet1Ratio)) * 1.1;
  const minRatio = Math.min(...projections.map(p => p.cet1Ratio)) * 0.9;
  const ratioRange = maxRatio - minRatio;

  const getX = (index: number) => padding.left + (index / 8) * (width - padding.left - padding.right);
  const getY = (val: number) => padding.top + height - padding.bottom - ((val - minRatio) / ratioRange) * (height - padding.top - padding.bottom);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Left: Stress Parameters */}
      <div className="lg:col-span-4 space-y-6">
        <Card>
          <CardHeader>
            <h3 className="text-base font-bold text-slate-200">CCAR Capital Actions</h3>
          </CardHeader>
          <CardBody className="space-y-5">
            <Select
              label="Stress Scenario Severity"
              value={severity}
              onChange={(e) => setSeverity(e.target.value as any)}
              options={[
                { value: 'baseline', label: 'Baseline (Normal Conditions)' },
                { value: 'adverse', label: 'Adverse (Moderate Recession)' },
                { value: 'severely_adverse', label: 'Severely Adverse (Deep Systemic Crisis)' }
              ]}
            />

            <Slider
              label="Asset Haircut (Stressed Write-downs)"
              min={0}
              max={30}
              step={1}
              value={haircut}
              suffix="%"
              onChange={setHaircut}
              helperText="Simulated balance sheet asset write-downs under stress."
            />

            <Slider
              label="Quarterly Dividend Payout"
              min={0}
              max={10}
              step={0.5}
              value={dividend}
              suffix="M"
              onChange={setDividend}
              helperText="Planned quarterly common stock dividend distributions."
            />

            <Slider
              label="Quarterly Share Repurchases"
              min={0}
              max={10}
              step={0.5}
              value={buyback}
              suffix="M"
              onChange={setBuyback}
              helperText="Planned quarterly equity buybacks."
            />

            <Slider
              label="Quarterly Capital Issuance"
              min={0}
              max={10}
              step={0.5}
              value={issuance}
              suffix="M"
              onChange={setIssuance}
              helperText="Planned quarterly common equity issuance to raise capital."
            />
          </CardBody>
        </Card>
      </div>

      {/* Right: Projections & Chart */}
      <div className="lg:col-span-8 space-y-6">
        <Card>
          <CardHeader>
            <div>
              <h3 className="text-base font-bold text-slate-200">9-Quarter CET1 Ratio Projection</h3>
              <p className="text-xs text-slate-500">Regulatory Minimum: 4.5% // Capital Conservation Buffer: 7.0%</p>
            </div>
            <Badge color={projections[8].cet1Ratio >= 7.0 ? 'green' : projections[8].cet1Ratio >= 4.5 ? 'amber' : 'red'}>
              Terminal Ratio: {projections[8].cet1Ratio.toFixed(2)}%
            </Badge>
          </CardHeader>
          <CardBody className="space-y-6">
            {/* SVG Line Chart */}
            <div className="relative overflow-hidden bg-slate-950/40 border border-slate-800/80 rounded-xl p-4">
              <svg viewBox={`0 0 ${width} ${height}`} width="100%" height={height} className="overflow-visible">
                {/* Regulatory Threshold Lines */}
                <line
                  x1={padding.left}
                  y1={getY(7.0)}
                  x2={width - padding.right}
                  y2={getY(7.0)}
                  stroke="rgba(16, 185, 129, 0.4)"
                  strokeWidth="1.5"
                  strokeDasharray="4 4"
                />
                <text x={width - padding.right - 10} y={getY(7.0) - 6} fill="#10b981" fontSize="8" fontFamily="monospace" textAnchor="end">
                  CCB Buffer (7.0%)
                </text>

                <line
                  x1={padding.left}
                  y1={getY(4.5)}
                  x2={width - padding.right}
                  y2={getY(4.5)}
                  stroke="rgba(239, 68, 68, 0.4)"
                  strokeWidth="1.5"
                  strokeDasharray="4 4"
                />
                <text x={width - padding.right - 10} y={getY(4.5) - 6} fill="#ef4444" fontSize="8" fontFamily="monospace" textAnchor="end">
                  Reg Minimum (4.5%)
                </text>

                {/* Grid Lines */}
                {[0, 0.5, 1].map((tick, i) => (
                  <line
                    key={i}
                    x1={padding.left}
                    y1={padding.top + (height - padding.top - padding.bottom) * tick}
                    x2={width - padding.right}
                    y2={padding.top + (height - padding.top - padding.bottom) * tick}
                    stroke="#1e293b"
                    strokeWidth="1"
                    strokeDasharray="4 4"
                    className="opacity-20"
                  />
                ))}

                {/* CET1 Ratio Path */}
                <path
                  d={projections
                    .map((p, idx) => `${idx === 0 ? 'M' : 'L'} ${getX(idx)} ${getY(p.cet1Ratio)}`)
                    .join(' ')}
                  fill="none"
                  stroke="#3b82f6"
                  strokeWidth="3"
                />

                {/* Data Points */}
                {projections.map((p, idx) => (
                  <circle
                    key={idx}
                    cx={getX(idx)}
                    cy={getY(p.cet1Ratio)}
                    r="4"
                    fill={p.cet1Ratio >= 7.0 ? '#10b981' : p.cet1Ratio >= 4.5 ? '#f59e0b' : '#ef4444'}
                    stroke="#0f172a"
                    strokeWidth="1.5"
                  />
                ))}

                {/* Axis Labels */}
                {projections.map((p, idx) => (
                  <text
                    key={idx}
                    x={getX(idx)}
                    y={height - 10}
                    fill="#64748b"
                    fontSize="9"
                    fontFamily="monospace"
                    textAnchor="middle"
                  >
                    {p.quarter}
                  </text>
                ))}
              </svg>
            </div>

            {/* Projection Table */}
            <div className="overflow-x-auto custom-scrollbar border border-slate-800/60 rounded-lg">
              <table className="min-w-full divide-y divide-slate-800/60 font-mono text-xs text-slate-300">
                <thead className="bg-slate-950/40 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  <tr>
                    <th className="px-4 py-2.5 text-left">Quarter</th>
                    <th className="px-4 py-2.5 text-right">Net Income</th>
                    <th className="px-4 py-2.5 text-right">Capital Actions</th>
                    <th className="px-4 py-2.5 text-right">CET1 Capital</th>
                    <th className="px-4 py-2.5 text-right">RWA</th>
                    <th className="px-4 py-2.5 text-right">CET1 Ratio</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/40">
                  {projections.map((p, idx) => (
                    <tr key={idx} className="hover:bg-slate-900/20">
                      <td className="px-4 py-2 font-bold text-slate-200">{p.quarter}</td>
                      <td className={`px-4 py-2 text-right ${p.netIncome >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                        ${p.netIncome.toFixed(2)}M
                      </td>
                      <td className="px-4 py-2 text-right text-slate-400">${p.capitalActions.toFixed(2)}M</td>
                      <td className="px-4 py-2 text-right text-slate-200">${p.cet1Capital.toFixed(1)}M</td>
                      <td className="px-4 py-2 text-right text-slate-400">${p.rwa.toFixed(1)}M</td>
                      <td className="px-4 py-2 text-right">
                        <span className={`font-bold px-1.5 py-0.5 rounded ${
                          p.cet1Ratio >= 7.0 ? 'text-emerald-400 bg-emerald-950/20' :
                          p.cet1Ratio >= 4.5 ? 'text-amber-400 bg-amber-950/20' : 'text-red-400 bg-red-950/20'
                        }`}>
                          {p.cet1Ratio.toFixed(2)}%
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

// ============================================================================
// 19. BASEL III LIQUIDITY STRESS RUN-OFF SIMULATOR
// ============================================================================

export interface DailyLiquidityPoint {
  day: number;
  hqla: number;
  outflow: number;
  inflow: number;
  netOutflow: number;
  lcr: number;
}

/**
 * Simulates a 30-day systemic liquidity run under Basel III guidelines.
 */
export const simulateLiquidityRunOff = (
  initialHQLA: number,
  baseValue: number,
  retailRunOffRate: number, // %
  wholesaleRunOffRate: number, // %
  drawdownRate: number, // %
  monetizationHaircut: number // %
): DailyLiquidityPoint[] => {
  const points: DailyLiquidityPoint[] = [];
  
  // Simulated balance sheet liabilities
  const retailDeposits = baseValue * 0.40;
  const wholesaleFunding = baseValue * 0.30;
  const committedLines = baseValue * 0.15;
  const contractualInflows = baseValue * 0.05;

  let currentHQLA = initialHQLA * (1.0 - (monetizationHaircut / 100));

  for (let day = 1; day <= 30; day++) {
    // Daily run-off rates (stochastic with standard normal noise)
    const { z0 } = boxMullerTransform();
    const noiseFactor = 1.0 + (z0 * 0.15);

    const dailyRetailOutflow = (retailDeposits * (retailRunOffRate / 100) / 30) * Math.max(0, noiseFactor);
    const dailyWholesaleOutflow = (wholesaleFunding * (wholesaleRunOffRate / 100) / 30) * Math.max(0, noiseFactor);
    const dailyDrawdown = (committedLines * (drawdownRate / 100) / 30);

    const totalOutflow = dailyRetailOutflow + dailyWholesaleOutflow + dailyDrawdown;
    const totalInflow = (contractualInflows / 30) * Math.max(0, 1.0 + (z0 * 0.05));

    const netOutflow = totalOutflow - totalInflow;
    currentHQLA = Math.max(0, currentHQLA - netOutflow);

    // Cumulative 30-day LCR projection
    const cumulativeOutflow = (retailDeposits * (retailRunOffRate / 100)) + 
                              (wholesaleFunding * (wholesaleRunOffRate / 100)) + 
                              (committedLines * (drawdownRate / 100));
    const cumulativeInflow = contractualInflows;
    const net30dOutflow = cumulativeOutflow - cumulativeInflow;
    const lcr = net30dOutflow > 0 ? (currentHQLA / net30dOutflow) * 100 : 999.9;

    points.push({
      day,
      hqla: currentHQLA,
      outflow: totalOutflow,
      inflow: totalInflow,
      netOutflow,
      lcr
    });
  }

  return points;
};

/**
 * Interactive Liquidity Stress Run-Off Simulator Component.
 */
export const LiquidityRunOffSimulator: React.FC = () => {
  const { state } = useApp();
  const activeScenario = state.scenarios.find(s => s.id === state.activeScenarioId) || state.scenarios[0];

  const [retailRunOff, setRetailRunOff] = useState<number>(10);
  const [wholesaleRunOff, setWholesaleRunOff] = useState<number>(40);
  const [drawdown, setDrawdown] = useState<number>(20);
  const [haircut, setHaircut] = useState<number>(5);

  const points = useMemo(() => {
    return simulateLiquidityRunOff(
      activeScenario.liquidityReserve,
      activeScenario.baseValue,
      retailRunOff,
      wholesaleRunOff,
      drawdown,
      haircut
    );
  }, [activeScenario, retailRunOff, wholesaleRunOff, drawdown, haircut]);

  const breachDay = points.findIndex(p => p.hqla <= 0) + 1;

  // SVG Charting coordinates
  const padding = { top: 20, right: 20, bottom: 30, left: 50 };
  const width = 600;
  const height = 220;

  const maxHQLA = activeScenario.liquidityReserve * 1.1;
  const getX = (day: number) => padding.left + ((day - 1) / 29) * (width - padding.left - padding.right);
  const getY = (val: number) => padding.top + height - padding.bottom - (val / maxHQLA) * (height - padding.top - padding.bottom);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Left: Run-off Parameters */}
      <div className="lg:col-span-4 space-y-6">
        <Card>
          <CardHeader>
            <h3 className="text-base font-bold text-slate-200">Run-off Parameters</h3>
          </CardHeader>
          <CardBody className="space-y-5">
            <Slider
              label="Retail Deposit Run-off Rate"
              min={5}
              max={30}
              step={1}
              value={retailRunOff}
              suffix="%"
              onChange={setRetailRunOff}
              helperText="Basel III retail deposit run-off rate under systemic stress."
            />

            <Slider
              label="Wholesale Funding Run-off Rate"
              min={10}
              max={100}
              step={5}
              value={wholesaleRunOff}
              suffix="%"
              onChange={setWholesaleRunOff}
              helperText="Run-off rate for unsecured wholesale funding liabilities."
            />

            <Slider
              label="Committed Line Drawdowns"
              min={5}
              max={50}
              step={1}
              value={drawdown}
              suffix="%"
              onChange={setDrawdown}
              helperText="Drawdown rate on committed credit and liquidity facilities."
            />

            <Slider
              label="HQLA Monetization Haircut"
              min={0}
              max={20}
              step={0.5}
              value={haircut}
              suffix="%"
              onChange={setHaircut}
              helperText="Liquidation haircut applied to high-quality liquid assets."
            />
          </CardBody>
        </Card>
      </div>

      {/* Right: Liquidity Curve Chart */}
      <div className="lg:col-span-8 space-y-6">
        <Card>
          <CardHeader>
            <div>
              <h3 className="text-base font-bold text-slate-200">30-Day Daily HQLA Trajectory</h3>
              <p className="text-xs text-slate-500">Simulating daily cash outflows against liquid reserves.</p>
            </div>
            {breachDay > 0 ? (
              <Badge color="red">Technical Insolvency: Day {breachDay}</Badge>
            ) : (
              <Badge color="green">Liquidity Buffer Intact</Badge>
            )}
          </CardHeader>
          <CardBody className="space-y-6">
            {/* SVG Line Chart */}
            <div className="relative overflow-hidden bg-slate-950/40 border border-slate-800/80 rounded-xl p-4">
              <svg viewBox={`0 0 ${width} ${height}`} width="100%" height={height} className="overflow-visible">
                {/* Grid Lines */}
                {[0, 0.5, 1].map((tick, i) => (
                  <line
                    key={i}
                    x1={padding.left}
                    y1={padding.top + (height - padding.top - padding.bottom) * tick}
                    x2={width - padding.right}
                    y2={padding.top + (height - padding.top - padding.bottom) * tick}
                    stroke="#1e293b"
                    strokeWidth="1"
                    strokeDasharray="4 4"
                    className="opacity-20"
                  />
                ))}

                {/* HQLA Curve Path */}
                <path
                  d={points
                    .map((p) => `${p.day === 1 ? 'M' : 'L'} ${getX(p.day)} ${getY(p.hqla)}`)
                    .join(' ')}
                  fill="none"
                  stroke={breachDay > 0 ? '#ef4444' : '#10b981'}
                  strokeWidth="3"
                />

                {/* Breach Day Indicator */}
                {breachDay > 0 && (
                  <g>
                    <line
                      x1={getX(breachDay)}
                      y1={padding.top}
                      x2={getX(breachDay)}
                      y2={height - padding.bottom}
                      stroke="#ef4444"
                      strokeWidth="1.5"
                      strokeDasharray="3 3"
                    />
                    <circle cx={getX(breachDay)} cy={getY(0)} r="5" fill="#ef4444" />
                  </g>
                )}

                {/* Axis Labels */}
                <text x={padding.left} y={height - 5} fill="#64748b" fontSize="9" fontFamily="monospace">
                  Day 1
                </text>
                <text x={width - padding.right} y={height - 5} fill="#64748b" fontSize="9" fontFamily="monospace" textAnchor="end">
                  Day 30
                </text>
              </svg>
            </div>

            {/* Daily Cash Flow Summary */}
            <div className="grid grid-cols-3 gap-4 font-mono text-xs">
              <div className="p-3 bg-slate-950/40 border border-slate-800/80 rounded-lg text-center">
                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Avg Daily Outflow</div>
                <div className="text-lg font-black text-red-400 mt-1">
                  ${(points.reduce((sum, p) => sum + p.outflow, 0) / 30).toFixed(2)}M
                </div>
              </div>
              <div className="p-3 bg-slate-950/40 border border-slate-800/80 rounded-lg text-center">
                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Avg Daily Inflow</div>
                <div className="text-lg font-black text-emerald-400 mt-1">
                  ${(points.reduce((sum, p) => sum + p.inflow, 0) / 30).toFixed(2)}M
                </div>
              </div>
              <div className="p-3 bg-slate-950/40 border border-slate-800/80 rounded-lg text-center">
                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Terminal HQLA</div>
                <div className={`text-lg font-black mt-1 ${points[29].hqla > 0 ? 'text-blue-400' : 'text-red-500'}`}>
                  ${points[29].hqla.toFixed(2)}M
                </div>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

// ============================================================================
// 20. RUNTIME UI HIJACK & UPGRADE PORTAL
// ============================================================================

import { createPortal } from 'react-dom';

/**
 * A highly sophisticated runtime extension component.
 * Uses MutationObserver to dynamically inject advanced analytics tabs
 * into the already-rendered Quantum Core UI, rendering the new views
 * via React Portals directly into the main content area.
 */
export const EnterpriseSuiteExtension: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string | null>(null);
  const [navContainer, setNavContainer] = useState<Element | null>(null);
  const [mainContainer, setMainContainer] = useState<Element | null>(null);
  const [, forceUpdate] = useState({});

  // Scan DOM for Quantum Core elements
  useEffect(() => {
    const findContainers = () => {
      const nav = document.querySelector('nav.flex.flex-wrap');
      const main = document.querySelector('main.relative');
      if (nav && main) {
        setNavContainer(nav);
        setMainContainer(main);
      }
    };

    findContainers();

    const observer = new MutationObserver(() => {
      findContainers();
    });

    observer.observe(document.body, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, []);

  // Intercept clicks on original tabs to clear our custom active tab
  useEffect(() => {
    if (!navContainer) return;

    const handleOriginalTabClick = (e: Event) => {
      const target = e.currentTarget as HTMLElement;
      // If it's one of our custom tabs, ignore
      if (target.getAttribute('data-custom-tab')) return;
      
      setActiveTab(null);
      
      // Restore active styling to original tabs
      const originalTabs = navContainer.querySelectorAll('button:not([data-custom-tab])');
      originalTabs.forEach(tab => {
        tab.classList.remove('border-transparent', 'text-slate-400');
        tab.classList.add('border-blue-500', 'text-blue-400', 'bg-blue-950/10');
      });

      // Remove active styling from our custom tabs
      const customTabs = navContainer.querySelectorAll('button[data-custom-tab]');
      customTabs.forEach(tab => {
        tab.classList.remove('border-blue-500', 'text-blue-400', 'bg-blue-950/10');
        tab.classList.add('border-transparent', 'text-slate-400');
      });
    };

    const originalButtons = navContainer.querySelectorAll('button:not([data-custom-tab])');
    originalButtons.forEach(btn => btn.addEventListener('click', handleOriginalTabClick));

    return () => {
      originalButtons.forEach(btn => btn.removeEventListener('click', handleOriginalTabClick));
    };
  }, [navContainer]);

  // Hide original main content when our custom tab is active
  useEffect(() => {
    if (!mainContainer) return;
    const originalChildren = Array.from(mainContainer.children) as HTMLElement[];
    
    if (activeTab) {
      originalChildren.forEach(child => {
        if (!child.getAttribute('data-custom-content')) {
          child.style.display = 'none';
        }
      });
    } else {
      originalChildren.forEach(child => {
        child.style.display = '';
      });
    }
  }, [activeTab, mainContainer]);

  const handleCustomTabClick = (tabId: string) => {
    setActiveTab(tabId);

    if (!navContainer) return;

    // De-activate original tabs
    const originalTabs = navContainer.querySelectorAll('button:not([data-custom-tab])');
    originalTabs.forEach(tab => {
      tab.classList.remove('border-blue-500', 'text-blue-400', 'bg-blue-950/10');
      tab.classList.add('border-transparent', 'text-slate-400');
    });

    // Update active styling on custom tabs
    const customTabs = navContainer.querySelectorAll('button[data-custom-tab]');
    customTabs.forEach(tab => {
      const id = tab.getAttribute('data-custom-tab');
      if (id === tabId) {
        tab.classList.remove('border-transparent', 'text-slate-400');
        tab.classList.add('border-blue-500', 'text-blue-400', 'bg-blue-950/10');
      } else {
        tab.classList.remove('border-blue-500', 'text-blue-400', 'bg-blue-950/10');
        tab.classList.add('border-transparent', 'text-slate-400');
      }
    });
  };

  if (!navContainer || !mainContainer) return null;

  // Custom tabs definition
  const customTabs = [
    { id: 'sensitivity', label: 'Sensitivity Matrix', icon: 'chart' },
    { id: 'portfolio', label: 'Portfolio Optimizer', icon: 'trending' },
    { id: 'backtest', label: 'Regime Backtest', icon: 'ledger' },
    { id: 'ccar', label: 'CCAR Planner', icon: 'shield' },
    { id: 'liquidity', label: 'Liquidity Stress', icon: 'scale' }
  ];

  return (
    <>
      {/* Portal 1: Inject Custom Tab Buttons into Navigation Bar */}
      {createPortal(
        <>
          {customTabs.map(tab => {
            // Check if already injected to prevent duplicates
            const exists = navContainer.querySelector(`[data-custom-tab="${tab.id}"]`);
            if (exists) return null;

            return (
              <button
                key={tab.id}
                data-custom-tab={tab.id}
                onClick={() => handleCustomTabClick(tab.id)}
                className="flex items-center gap-2 px-4 py-3 text-xs font-bold uppercase tracking-wider border-b-2 border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-800 transition-all duration-200"
              >
                <Icon name={tab.icon as any} className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </>,
        navContainer
      )}

      {/* Portal 2: Render Custom Views into Main Content Area */}
      {activeTab && createPortal(
        <div data-custom-content="true" className="space-y-6 animate-fadeIn">
          {activeTab === 'sensitivity' && (
            <SensitivityAnalysisView
              baseValue={state.scenarios.find(s => s.id === state.activeScenarioId)?.baseValue || 100}
              horizonYears={state.scenarios.find(s => s.id === state.activeScenarioId)?.horizonYears || 5}
            />
          )}
          {activeTab === 'portfolio' && <PortfolioOptimizerView />}
          {activeTab === 'backtest' && <HistoricalBacktesterView />}
          {activeTab === 'ccar' && <CCARStressPlannerView />}
          {activeTab === 'liquidity' && <LiquidityRunOffSimulator />}
        </div>,
        mainContainer
      )}
    </>
  );
};

/**
 * Self-mounting initializer that injects the EnterpriseSuiteExtension
 * into the DOM automatically when the application loads.
 */
if (typeof window !== 'undefined') {
  const mountExtension = () => {
    const id = 'quantum-core-extension-root';
    if (document.getElementById(id)) return;

    const root = document.createElement('div');
    root.id = id;
    document.body.appendChild(root);

    // Dynamic import of ReactDOM to ensure compatibility
    import('react-dom').then(({ render }) => {
      render(
        <AppProvider>
          <EnterpriseSuiteExtension />
        </AppProvider>,
        root
      );
    }).catch(err => console.error('Failed to load React-DOM for extension:', err));
  };

  if (document.readyState === 'complete') {
    mountExtension();
  } else {
    window.addEventListener('load', mountExtension);
  }
}// ============================================================================
// 21. MACROECONOMIC FACTOR MODEL & DYNAMIC PARAMETER MAPPING
// ============================================================================

export interface MacroeconomicState {
  gdpGrowth: number;       // % YoY
  inflationRate: number;   // % YoY
  unemploymentRate: number;// %
  fedFundsRate: number;    // %
  creditSpread: number;    // bps (e.g., Baa - Aaa)
}

/**
 * Maps macroeconomic factors to the drift (μ) and volatility (σ) of a financial scenario.
 * Uses a multi-factor linear regression model approximation to simulate systemic macro impacts.
 */
export const mapMacroToGBM = (
  baseScenario: FinancialScenario,
  macro: MacroeconomicState
): { adjustedGrowth: number; adjustedVolatility: number } => {
  // Baseline macro assumptions
  const baseGDP = 2.5;
  const baseInflation = 2.0;
  const baseUnemployment = 4.5;
  const baseFedFunds = 4.0;
  const baseSpread = 150;

  // Sensitivity coefficients (betas)
  const betaGDP = 1.2;        // Positive GDP growth increases asset growth
  const betaInflation = -0.4;  // High inflation hurts real growth
  const betaUnemployment = -1.5; // High unemployment hurts growth
  const betaFedFunds = -0.5;   // High interest rates increase cost of capital, lowering growth
  const betaSpread = -0.02;    // Credit spread widening lowers growth

  // Volatility sensitivities
  const volGDP = -0.8;        // Low GDP growth increases volatility
  const volInflation = 0.5;   // High inflation increases volatility
  const volUnemployment = 1.2; // High unemployment increases volatility
  const volFedFunds = 0.3;    // High rates increase market stress
  const volSpread = 0.05;     // Credit spread widening increases volatility

  // Calculate deviations from baseline
  const dGDP = macro.gdpGrowth - baseGDP;
  const dInflation = macro.inflationRate - baseInflation;
  const dUnemployment = macro.unemploymentRate - baseUnemployment;
  const dFedFunds = macro.fedFundsRate - baseFedFunds;
  const dSpread = macro.creditSpread - baseSpread;

  // Compute adjusted growth rate (drift)
  const growthAdjustment = (dGDP * betaGDP) + (dInflation * betaInflation) + 
                           (dUnemployment * betaUnemployment) + (dFedFunds * betaFedFunds) + 
                           (dSpread * betaSpread);
  const adjustedGrowth = baseScenario.growthRate + growthAdjustment;

  // Compute adjusted volatility (diffusion)
  const volAdjustment = (dGDP * volGDP) + (dInflation * volInflation) + 
                         (dUnemployment * volUnemployment) + (dFedFunds * volFedFunds) + 
                         (dSpread * volSpread);
  const adjustedVolatility = Math.max(2.0, baseScenario.volatility + volAdjustment);

  return {
    adjustedGrowth,
    adjustedVolatility
  };
};

/**
 * Interactive Macroeconomic Factor Model View.
 */
export const MacroFactorModelView: React.FC = () => {
  const { state, dispatch } = useApp();
  const activeScenario = state.scenarios.find(s => s.id === state.activeScenarioId) || state.scenarios[0];

  const [macro, setMacro] = useState<MacroeconomicState>({
    gdpGrowth: 2.5,
    inflationRate: 2.0,
    unemploymentRate: 4.5,
    fedFundsRate: 4.0,
    creditSpread: 150
  });

  const { adjustedGrowth, adjustedVolatility } = useMemo(() => {
    return mapMacroToGBM(activeScenario, macro);
  }, [activeScenario, macro]);

  const applyMacroParameters = () => {
    dispatch({
      type: 'UPDATE_SCENARIO',
      payload: {
        id: activeScenario.id,
        updates: {
          growthRate: Math.round(adjustedGrowth * 10) / 10,
          volatility: Math.round(adjustedVolatility * 10) / 10
        }
      }
    });
    dispatch({
      type: 'ADD_LEDGER_ENTRY',
      payload: {
        action: 'MACRO_APPLY',
        details: `Applied macro factor adjustments to ${activeScenario.name}. Growth: ${adjustedGrowth.toFixed(1)}%, Volatility: ${adjustedVolatility.toFixed(1)}%`
      }
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Left: Macro Factor Controls */}
      <div className="lg:col-span-5 space-y-6">
        <Card>
          <CardHeader>
            <h3 className="text-base font-bold text-slate-200">Macroeconomic Factors</h3>
          </CardHeader>
          <CardBody className="space-y-5">
            <Slider
              label="GDP Growth Rate"
              min={-5}
              max={8}
              step={0.1}
              value={macro.gdpGrowth}
              suffix="%"
              onChange={(val) => setMacro(prev => ({ ...prev, gdpGrowth: val }))}
              helperText="Annualized real GDP growth rate."
            />
            <Slider
              label="Inflation Rate (CPI)"
              min={-1}
              max={12}
              step={0.1}
              value={macro.inflationRate}
              suffix="%"
              onChange={(val) => setMacro(prev => ({ ...prev, inflationRate: val }))}
              helperText="Consumer Price Index year-over-year change."
            />
            <Slider
              label="Unemployment Rate"
              min={2}
              max={15}
              step={0.1}
              value={macro.unemploymentRate}
              suffix="%"
              onChange={(val) => setMacro(prev => ({ ...prev, unemploymentRate: val }))}
              helperText="Percentage of the labor force that is unemployed."
            />
            <Slider
              label="Federal Funds Rate"
              min={0}
              max={8}
              step={0.25}
              value={macro.fedFundsRate}
              suffix="%"
              onChange={(val) => setMacro(prev => ({ ...prev, fedFundsRate: val }))}
              helperText="Central bank benchmark interest rate."
            />
            <Slider
              label="Credit Spread (Baa - Aaa)"
              min={50}
              max={500}
              step={10}
              value={macro.creditSpread}
              suffix=" bps"
              onChange={(val) => setMacro(prev => ({ ...prev, creditSpread: val }))}
              helperText="Yield spread between corporate bonds representing credit risk."
            />
          </CardBody>
        </Card>
      </div>

      {/* Right: Parameter Mapping & Impact Analysis */}
      <div className="lg:col-span-7 space-y-6">
        <Card>
          <CardHeader>
            <div>
              <h3 className="text-base font-bold text-slate-200">Stochastic Parameter Mapping</h3>
              <p className="text-xs text-slate-500">Dynamic translation of macroeconomic stress into GBM parameters.</p>
            </div>
          </CardHeader>
          <CardBody className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-slate-950/40 border border-slate-800/80 rounded-lg text-center space-y-1">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Adjusted Growth (Drift)</span>
                <div className="text-2xl font-black text-blue-400 font-mono">
                  {adjustedGrowth.toFixed(2)}%
                </div>
                <div className="text-[10px] text-slate-500">
                  Original: {activeScenario.growthRate}%
                </div>
              </div>

              <div className="p-4 bg-slate-950/40 border border-slate-800/80 rounded-lg text-center space-y-1">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Adjusted Volatility (Diffusion)</span>
                <div className="text-2xl font-black text-indigo-400 font-mono">
                  {adjustedVolatility.toFixed(2)}%
                </div>
                <div className="text-[10px] text-slate-500">
                  Original: {activeScenario.volatility}%
                </div>
              </div>
            </div>

            <div className="p-4 bg-slate-950/20 border border-slate-800/60 rounded-lg space-y-3">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Macro Scenario Assessment</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                {macro.gdpGrowth < 0 && macro.inflationRate > 5 ? (
                  <span className="text-red-400 font-semibold">STAGFLATIONARY CRISIS: </span>
                ) : macro.gdpGrowth < 0 ? (
                  <span className="text-amber-400 font-semibold">ECONOMIC RECESSION: </span>
                ) : macro.inflationRate > 4 ? (
                  <span className="text-amber-400 font-semibold">INFLATIONARY OVERHEATING: </span>
                ) : (
                  <span className="text-emerald-400 font-semibold">GOLDILOCKS EXPANSION: </span>
                )}
                The combination of a {macro.gdpGrowth}% GDP growth rate and {macro.inflationRate}% inflation rate creates a 
                {macro.gdpGrowth < 1.0 ? ' highly challenging' : ' supportive'} environment for capital growth. 
                The credit spread of {macro.creditSpread} bps indicates {macro.creditSpread > 200 ? 'elevated systemic default risk' : 'stable corporate credit conditions'}.
              </p>
            </div>

            <Button variant="glow" className="w-full" onClick={applyMacroParameters}>
              Apply Adjusted Parameters to Active Scenario
            </Button>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

// ============================================================================
// 22. BLACK-LITTERMAN PORTFOLIO OPTIMIZATION ENGINE
// ============================================================================

/**
 * Performs matrix multiplication of two 2D arrays.
 */
export const multiplyMatrices = (A: number[][], B: number[][]): number[][] => {
  const rowsA = A.length;
  const colsA = A[0].length;
  const rowsB = B.length;
  const colsB = B[0].length;

  if (colsA !== rowsB) {
    throw new Error('Incompatible matrix dimensions for multiplication.');
  }

  const result: number[][] = Array.from({ length: rowsA }, () => Array(colsB).fill(0));

  for (let i = 0; i < rowsA; i++) {
    for (let j = 0; j < colsB; j++) {
      let sum = 0;
      for (let k = 0; k < colsA; k++) {
        sum += A[i][k] * B[k][j];
      }
      result[i][j] = sum;
    }
  }

  return result;
};

/**
 * Computes the inverse of a 3x3 matrix using Cramer's Rule.
 */
export const invertMatrix3x3 = (A: number[][]): number[][] => {
  const n = A.length;
  if (n !== 3 || A[0].length !== 3) {
    throw new Error('Matrix must be exactly 3x3 for this optimized implementation.');
  }

  const det = A[0][0] * (A[1][1] * A[2][2] - A[1][2] * A[2][1]) -
              A[0][1] * (A[1][0] * A[2][2] - A[1][2] * A[2][0]) +
              A[0][2] * (A[1][0] * A[2][1] - A[1][1] * A[2][0]);

  if (Math.abs(det) < 1e-9) {
    throw new Error('Matrix is singular and cannot be inverted.');
  }

  const invDet = 1.0 / det;
  const inv: number[][] = Array.from({ length: 3 }, () => Array(3).fill(0));

  inv[0][0] = (A[1][1] * A[2][2] - A[1][2] * A[2][1]) * invDet;
  inv[0][1] = (A[0][2] * A[2][1] - A[0][1] * A[2][2]) * invDet;
  inv[0][2] = (A[0][1] * A[1][2] - A[0][2] * A[1][1]) * invDet;

  inv[1][0] = (A[1][2] * A[2][0] - A[1][0] * A[2][2]) * invDet;
  inv[1][1] = (A[0][0] * A[2][2] - A[0][2] * A[2][0]) * invDet;
  inv[1][2] = (A[0][2] * A[1][0] - A[0][0] * A[1][2]) * invDet;

  inv[2][0] = (A[1][0] * A[2][1] - A[1][1] * A[2][0]) * invDet;
  inv[2][1] = (A[0][1] * A[2][0] - A[0][0] * A[2][1]) * invDet;
  inv[2][2] = (A[0][0] * A[1][1] - A[0][1] * A[1][0]) * invDet;

  return inv;
};

export interface BlackLittermanResult {
  posteriorReturns: number[];
  posteriorWeights: number[];
}

/**
 * Computes the Black-Litterman posterior returns and portfolio weights.
 * Combines market equilibrium returns with subjective investor views.
 */
export const runBlackLitterman = (
  marketWeights: number[], // [Equities, Bonds, Alternatives]
  covariance: number[][],  // 3x3 covariance matrix
  viewsP: number[][],      // K x 3 matrix mapping views to assets
  viewsQ: number[],        // K-dimensional vector of view returns
  omega: number[][],       // K x K uncertainty matrix of views
  riskAversion: number = 3.0,
  tau: number = 0.05
): BlackLittermanResult => {
  const numAssets = marketWeights.length;

  // 1. Calculate Implied Equilibrium Excess Returns (Pi)
  // Pi = delta * Sigma * w_mkt
  const Pi: number[][] = Array.from({ length: numAssets }, () => [0]);
  for (let i = 0; i < numAssets; i++) {
    let sum = 0;
    for (let j = 0; j < numAssets; j++) {
      sum += covariance[i][j] * marketWeights[j];
    }
    Pi[i][0] = riskAversion * sum;
  }

  // 2. Scale Covariance Matrix by Tau
  const tauSigma: number[][] = covariance.map(row => row.map(val => val * tau));
  const invTauSigma = invertMatrix3x3(tauSigma);

  // 3. Compute Posterior Returns (E[R])
  // E[R] = [ (tau * Sigma)^-1 + P^T * Omega^-1 * P ]^-1 * [ (tau * Sigma)^-1 * Pi + P^T * Omega^-1 * Q ]
  const P_T: number[][] = Array.from({ length: numAssets }, (_, i) => 
    Array.from({ length: viewsP.length }, (_, j) => viewsP[j][i])
  );

  // For simplicity in 3x3, assume 1 view (K=1)
  // Omega is 1x1, so Omega^-1 is just 1 / omega[0][0]
  const invOmega = 1.0 / omega[0][0];

  // Compute P^T * Omega^-1 * P
  const PT_invOmega_P: number[][] = Array.from({ length: numAssets }, () => Array(numAssets).fill(0));
  for (let i = 0; i < numAssets; i++) {
    for (let j = 0; j < numAssets; j++) {
      PT_invOmega_P[i][j] = P_T[i][0] * invOmega * viewsP[0][j];
    }
  }

  // Sum of inverse matrices: (tau * Sigma)^-1 + P^T * Omega^-1 * P
  const sumInv: number[][] = Array.from({ length: numAssets }, () => Array(numAssets).fill(0));
  for (let i = 0; i < numAssets; i++) {
    for (let j = 0; j < numAssets; j++) {
      sumInv[i][j] = invTauSigma[i][j] + PT_invOmega_P[i][j];
    }
  }

  const posteriorCovariance = invertMatrix3x3(sumInv);

  // Compute (tau * Sigma)^-1 * Pi
  const term1: number[][] = multiplyMatrices(invTauSigma, Pi);

  // Compute P^T * Omega^-1 * Q
  const term2: number[][] = Array.from({ length: numAssets }, () => [0]);
  for (let i = 0; i < numAssets; i++) {
    term2[i][0] = P_T[i][0] * invOmega * viewsQ[0];
  }

  // Sum of terms
  const sumTerms: number[][] = Array.from({ length: numAssets }, () => [0]);
  for (let i = 0; i < numAssets; i++) {
    sumTerms[i][0] = term1[i][0] + term2[i][0];
  }

  // Posterior Returns
  const posteriorReturnsMat = multiplyMatrices(posteriorCovariance, sumTerms);
  const posteriorReturns = posteriorReturnsMat.map(row => row[0]);

  // 4. Compute Posterior Weights
  // w = (delta * Sigma)^-1 * E[R]
  const deltaSigma: number[][] = covariance.map(row => row.map(val => val * riskAversion));
  const invDeltaSigma = invertMatrix3x3(deltaSigma);
  const posteriorWeightsMat = multiplyMatrices(invDeltaSigma, posteriorReturnsMat);
  const rawWeights = posteriorWeightsMat.map(row => row[0]);

  // Normalize weights to sum to 1.0
  const sumWeights = rawWeights.reduce((sum, w) => sum + w, 0);
  const posteriorWeights = rawWeights.map(w => w / sumWeights);

  return {
    posteriorReturns,
    posteriorWeights
  };
};

/**
 * Interactive Black-Litterman Portfolio Optimization View.
 */
export const BlackLittermanView: React.FC = () => {
  const [marketWeights, setMarketWeights] = useState<number[]>([0.60, 0.30, 0.10]); // Equities, Bonds, Alts
  const [viewReturn, setViewReturn] = useState<number>(15.0); // Subjective view on Equities
  const [viewUncertainty, setViewUncertainty] = useState<number>(2.0); // Variance of view

  const covariance = [
    [0.0256, 0.0014, 0.0120], // Equities (16% vol)
    [0.0014, 0.0036, -0.0010], // Bonds (6% vol)
    [0.0120, -0.0010, 0.1225]  // Alternatives (35% vol)
  ];

  const blResult = useMemo(() => {
    const viewsP = [[1, 0, 0]]; // View is 100% on Equities
    const viewsQ = [viewReturn / 100];
    const omega = [[viewUncertainty / 1000]]; // Scale uncertainty

    try {
      return runBlackLitterman(marketWeights, covariance, viewsP, viewsQ, omega);
    } catch (e) {
      console.error(e);
      return null;
    }
  }, [marketWeights, viewReturn, viewUncertainty]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Left: Market Weights & Views */}
      <div className="lg:col-span-5 space-y-6">
        <Card>
          <CardHeader>
            <h3 className="text-base font-bold text-slate-200">Black-Litterman Inputs</h3>
          </CardHeader>
          <CardBody className="space-y-5">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Market Equilibrium Weights</h4>
            <Slider
              label="Equities Weight"
              min={10}
              max={90}
              step={5}
              value={Math.round(marketWeights[0] * 100)}
              suffix="%"
              onChange={(val) => setMarketWeights([val / 100, (100 - val - marketWeights[2] * 100) / 100, marketWeights[2]])}
            />
            <Slider
              label="Alternatives Weight"
              min={0}
              max={30}
              step={5}
              value={Math.round(marketWeights[2] * 100)}
              suffix="%"
              onChange={(val) => setMarketWeights([marketWeights[0], (100 - marketWeights[0] * 100 - val) / 100, val / 100])}
            />

            <div className="border-t border-slate-800/60 pt-4 space-y-4">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Subjective Investor View</h4>
              <Slider
                label="Equities Expected Return View"
                min={2}
                max={30}
                step={0.5}
                value={viewReturn}
                suffix="%"
                onChange={setViewReturn}
                helperText="Your subjective expectation of US Equities return."
              />
              <Slider
                label="View Uncertainty (Variance)"
                min={1}
                max={10}
                step={0.5}
                value={viewUncertainty}
                suffix="x"
                onChange={setViewUncertainty}
                helperText="Lower values indicate higher confidence in your view."
              />
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Right: Posterior Allocation Results */}
      <div className="lg:col-span-7 space-y-6">
        <Card>
          <CardHeader>
            <div>
              <h3 className="text-base font-bold text-slate-200">Posterior Portfolio Allocation</h3>
              <p className="text-xs text-slate-500">Optimized asset weights combining market equilibrium and investor views.</p>
            </div>
          </CardHeader>
          <CardBody className="space-y-6">
            {blResult ? (
              <div className="space-y-6">
                {/* Allocation Comparison */}
                <div className="space-y-4">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Pro-Forma Weights Comparison</h4>
                  <div className="space-y-3">
                    {[
                      { name: 'Core Equities (US)', mkt: marketWeights[0], post: blResult.posteriorWeights[0], color: 'bg-blue-500' },
                      { name: 'Fixed Income (Bonds)', mkt: marketWeights[1], post: blResult.posteriorWeights[1], color: 'bg-emerald-500' },
                      { name: 'Alternative Assets', mkt: marketWeights[2], post: blResult.posteriorWeights[2], color: 'bg-purple-500' }
                    ].map((asset, idx) => (
                      <div key={idx} className="space-y-1.5">
                        <div className="flex justify-between text-xs font-medium">
                          <span className="text-slate-300">{asset.name}</span>
                          <span className="font-mono text-slate-400">
                            Market: <strong className="text-slate-200">{(asset.mkt * 100).toFixed(0)}%</strong> // Posterior: <strong className="text-blue-400">{(asset.post * 100).toFixed(1)}%</strong>
                          </span>
                        </div>
                        <div className="w-full bg-slate-950 h-2.5 rounded-full overflow-hidden flex gap-0.5">
                          <div className={`${asset.color} h-full opacity-40`} style={{ width: `${asset.mkt * 100}%` }} title="Market Weight" />
                          <div className={`${asset.color} h-full`} style={{ width: `${asset.post * 100}%` }} title="Posterior Weight" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Posterior Returns */}
                <div className="p-4 bg-slate-950/40 border border-slate-800/80 rounded-lg space-y-2">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Posterior Expected Excess Returns</h4>
                  <div className="grid grid-cols-3 gap-4 text-center font-mono text-xs">
                    <div>
                      <div className="text-slate-500">Equities</div>
                      <div className="text-lg font-black text-blue-400 mt-1">{(blResult.posteriorReturns[0] * 100).toFixed(2)}%</div>
                    </div>
                    <div>
                      <div className="text-slate-500">Bonds</div>
                      <div className="text-lg font-black text-emerald-400 mt-1">{(blResult.posteriorReturns[1] * 100).toFixed(2)}%</div>
                    </div>
                    <div>
                      <div className="text-slate-500">Alternatives</div>
                      <div className="text-lg font-black text-purple-400 mt-1">{(blResult.posteriorReturns[2] * 100).toFixed(2)}%</div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center text-slate-500 py-12">
                Failed to compute Black-Litterman optimization.
              </div>
            )}
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

// ============================================================================
// 23. COPULA-BASED JOINT RISK SIMULATION ENGINE
// ============================================================================

/**
 * Performs Cholesky Decomposition of a symmetric positive-definite matrix.
 * Used to generate correlated random variables.
 */
export const choleskyDecomposition = (matrix: number[][]): number[][] => {
  const n = matrix.length;
  const L: number[][] = Array.from({ length: n }, () => Array(n).fill(0));

  for (let i = 0; i < n; i++) {
    for (let j = 0; j <= i; j++) {
      let sum = 0;
      for (let k = 0; k < j; k++) {
        sum += L[i][k] * L[j][k];
      }

      if (i === j) {
        L[i][j] = Math.sqrt(Math.max(0, matrix[i][i] - sum));
      } else {
        L[i][j] = (matrix[i][j] - sum) / L[j][j];
      }
    }
  }

  return L;
};

/**
 * Simulates joint asset returns using a Gaussian Copula framework.
 * Captures non-linear tail dependencies between multiple assets.
 */
export const simulateGaussianCopula = (
  correlations: number[][],
  numSteps: number
): number[][] => {
  const n = correlations.length;
  const L = choleskyDecomposition(correlations);
  const simulatedPaths: number[][] = Array.from({ length: n }, () => []);

  for (let step = 0; step < numSteps; step++) {
    // Generate independent standard normal variables
    const Z_ind = Array.from({ length: n }, () => boxMullerTransform().z0);

    // Multiply by Cholesky factor to get correlated standard normals
    const Z_corr: number[] = Array(n).fill(0);
    for (let i = 0; i < n; i++) {
      let sum = 0;
      for (let j = 0; j <= i; j++) {
        sum += L[i][j] * Z_ind[j];
      }
      Z_corr[i] = sum;
    }

    // Store correlated variables
    for (let i = 0; i < n; i++) {
      simulatedPaths[i].push(Z_corr[i]);
    }
  }

  return simulatedPaths;
};

/**
 * Interactive Joint Risk Simulation Dashboard.
 */
export const JointRiskSimulationView: React.FC = () => {
  const [correlationAB, setCorrelationAB] = useState<number>(15); // Equities & Bonds (%)
  const [correlationAC, setCorrelationAC] = useState<number>(45); // Equities & Alts (%)
  const [correlationBC, setCorrelationBC] = useState<number>(-10); // Bonds & Alts (%)

  const correlations = useMemo(() => {
    const rhoAB = correlationAB / 100;
    const rhoAC = correlationAC / 100;
    const rhoBC = correlationBC / 100;
    return [
      [1.0, rhoAB, rhoAC],
      [rhoAB, 1.0, rhoBC],
      [rhoAC, rhoBC, 1.0]
    ];
  }, [correlationAB, correlationAC, correlationBC]);

  const simulatedPaths = useMemo(() => {
    try {
      return simulateGaussianCopula(correlations, 500);
    } catch (e) {
      console.error('Cholesky decomposition failed due to non-positive definite matrix:', e);
      return null;
    }
  }, [correlations]);

  // SVG Scatter Plot coordinates
  const padding = { top: 20, right: 20, bottom: 30, left: 40 };
  const width = 500;
  const height = 240;

  const getX = (val: number) => padding.left + ((val + 3) / 6) * (width - padding.left - padding.right);
  const getY = (val: number) => padding.top + height - padding.bottom - ((val + 3) / 6) * (height - padding.top - padding.bottom);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Left: Correlation Controls */}
      <div className="lg:col-span-4 space-y-6">
        <Card>
          <CardHeader>
            <h3 className="text-base font-bold text-slate-200">Asset Correlations</h3>
          </CardHeader>
          <CardBody className="space-y-5">
            <Slider
              label="Equities & Bonds Correlation"
              min={-80}
              max={80}
              step={5}
              value={correlationAB}
              suffix="%"
              onChange={setCorrelationAB}
              helperText="Measures the linear relationship between Equities and Bonds."
            />
            <Slider
              label="Equities & Alternatives Correlation"
              min={-80}
              max={80}
              step={5}
              value={correlationAC}
              suffix="%"
              onChange={setCorrelationAC}
              helperText="Measures the linear relationship between Equities and Alternatives."
            />
            <Slider
              label="Bonds & Alternatives Correlation"
              min={-80}
              max={80}
              step={5}
              value={correlationBC}
              suffix="%"
              onChange={setCorrelationBC}
              helperText="Measures the linear relationship between Bonds and Alternatives."
            />
          </CardBody>
        </Card>
      </div>

      {/* Right: Copula Scatter Plot */}
      <div className="lg:col-span-8 space-y-6">
        <Card>
          <CardHeader>
            <div>
              <h3 className="text-base font-bold text-slate-200">Gaussian Copula Joint Dependency</h3>
              <p className="text-xs text-slate-500">Visualizing 500 simulated joint return realizations (Equities vs Alternatives).</p>
            </div>
          </CardHeader>
          <CardBody className="space-y-6">
            {simulatedPaths ? (
              <div className="relative overflow-hidden bg-slate-950/40 border border-slate-800/80 rounded-xl p-4">
                <svg viewBox={`0 0 ${width} ${height}`} width="100%" height={height} className="overflow-visible">
                  {/* Grid Lines */}
                  {[0, 0.5, 1].map((tick, i) => (
                    <line
                      key={i}
                      x1={padding.left}
                      y1={padding.top + (height - padding.top - padding.bottom) * tick}
                      x2={width - padding.right}
                      y2={padding.top + (height - padding.top - padding.bottom) * tick}
                      stroke="#1e293b"
                      strokeWidth="1"
                      strokeDasharray="4 4"
                      className="opacity-20"
                    />
                  ))}

                  {/* Scatter Points */}
                  {simulatedPaths[0].map((valX, idx) => {
                    const valY = simulatedPaths[2][idx];
                    return (
                      <circle
                        key={idx}
                        cx={getX(valX)}
                        cy={getY(valY)}
                        r="2"
                        fill="rgba(59, 130, 246, 0.6)"
                      />
                    );
                  })}

                  {/* Axis Labels */}
                  <text x={width / 2} y={height - 5} fill="#64748b" fontSize="9" fontFamily="monospace" textAnchor="middle">
                    Equities Realization (Std Dev)
                  </text>
                  <text x={10} y={height / 2} fill="#64748b" fontSize="9" fontFamily="monospace" textAnchor="middle" transform={`rotate(-90, 10, ${height / 2})`}>
                    Alternatives Realization (Std Dev)
                  </text>
                </svg>
              </div>
            ) : (
              <div className="p-12 text-center text-red-400 bg-red-950/10 border border-red-900/30 rounded-xl">
                <Icon name="alert" className="w-8 h-8 mx-auto mb-2" />
                Correlation matrix is not positive-definite. Please adjust the correlation sliders to ensure a mathematically valid matrix.
              </div>
            )}
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

// ============================================================================
// 24. RUNTIME EXTENSION UPGRADE PORTAL (RE-REGISTRATION)
// ============================================================================

/**
 * Upgraded Runtime Extension Component.
 * Dynamically registers the new advanced views (Macro Factor Model, Black-Litterman, Gaussian Copula)
 * into the existing navigation bar and main content router.
 */
export const UpgradedEnterpriseSuiteExtension: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string | null>(null);
  const [navContainer, setNavContainer] = useState<Element | null>(null);
  const [mainContainer, setMainContainer] = useState<Element | null>(null);

  useEffect(() => {
    const findContainers = () => {
      const nav = document.querySelector('nav.flex.flex-wrap');
      const main = document.querySelector('main.relative');
      if (nav && main) {
        setNavContainer(nav);
        setMainContainer(main);
      }
    };

    findContainers();
    const observer = new MutationObserver(() => findContainers());
    observer.observe(document.body, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!navContainer) return;

    const handleOriginalTabClick = (e: Event) => {
      const target = e.currentTarget as HTMLElement;
      if (target.getAttribute('data-upgraded-tab')) return;
      
      setActiveTab(null);
      
      const originalTabs = navContainer.querySelectorAll('button:not([data-upgraded-tab])');
      originalTabs.forEach(tab => {
        tab.classList.remove('border-transparent', 'text-slate-400');
        tab.classList.add('border-blue-500', 'text-blue-400', 'bg-blue-950/10');
      });

      const customTabs = navContainer.querySelectorAll('button[data-upgraded-tab]');
      customTabs.forEach(tab => {
        tab.classList.remove('border-blue-500', 'text-blue-400', 'bg-blue-950/10');
        tab.classList.add('border-transparent', 'text-slate-400');
      });
    };

    const originalButtons = navContainer.querySelectorAll('button:not([data-upgraded-tab])');
    originalButtons.forEach(btn => btn.addEventListener('click', handleOriginalTabClick));

    return () => {
      originalButtons.forEach(btn => btn.removeEventListener('click', handleOriginalTabClick));
    };
  }, [navContainer]);

  useEffect(() => {
    if (!mainContainer) return;
    const originalChildren = Array.from(mainContainer.children) as HTMLElement[];
    
    if (activeTab) {
      originalChildren.forEach(child => {
        if (!child.getAttribute('data-upgraded-content')) {
          child.style.display = 'none';
        }
      });
    } else {
      originalChildren.forEach(child => {
        child.style.display = '';
      });
    }
  }, [activeTab, mainContainer]);

  const handleCustomTabClick = (tabId: string) => {
    setActiveTab(tabId);

    if (!navContainer) return;

    const originalTabs = navContainer.querySelectorAll('button:not([data-upgraded-tab])');
    originalTabs.forEach(tab => {
      tab.classList.remove('border-blue-500', 'text-blue-400', 'bg-blue-950/10');
      tab.classList.add('border-transparent', 'text-slate-400');
    });

    const customTabs = navContainer.querySelectorAll('button[data-upgraded-tab]');
    customTabs.forEach(tab => {
      const id = tab.getAttribute('data-upgraded-tab');
      if (id === tabId) {
        tab.classList.remove('border-transparent', 'text-slate-400');
        tab.classList.add('border-blue-500', 'text-blue-400', 'bg-blue-950/10');
      } else {
        tab.classList.remove('border-blue-500', 'text-blue-400', 'bg-blue-950/10');
        tab.classList.add('border-transparent', 'text-slate-400');
      }
    });
  };

  if (!navContainer || !mainContainer) return null;

  const upgradedTabs = [
    { id: 'macro', label: 'Macro Factor Model', icon: 'database' },
    { id: 'blacklitterman', label: 'Black-Litterman', icon: 'brain' },
    { id: 'copula', label: 'Copula Joint Risk', icon: 'scale' }
  ];

  return (
    <>
      {createPortal(
        <>
          {upgradedTabs.map(tab => {
            const exists = navContainer.querySelector(`[data-upgraded-tab="${tab.id}"]`);
            if (exists) return null;

            return (
              <button
                key={tab.id}
                data-upgraded-tab={tab.id}
                onClick={() => handleCustomTabClick(tab.id)}
                className="flex items-center gap-2 px-4 py-3 text-xs font-bold uppercase tracking-wider border-b-2 border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-800 transition-all duration-200"
              >
                <Icon name={tab.icon as any} className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </>,
        navContainer
      )}

      {activeTab && createPortal(
        <div data-upgraded-content="true" className="space-y-6 animate-fadeIn">
          {activeTab === 'macro' && <MacroFactorModelView />}
          {activeTab === 'blacklitterman' && <BlackLittermanView />}
          {activeTab === 'copula' && <JointRiskSimulationView />}
        </div>,
        mainContainer
      )}
    </>
  );
};

if (typeof window !== 'undefined') {
  const mountUpgradedExtension = () => {
    const id = 'quantum-core-upgraded-extension-root';
    if (document.getElementById(id)) return;

    const root = document.createElement('div');
    root.id = id;
    document.body.appendChild(root);

    import('react-dom').then(({ render }) => {
      render(
        <AppProvider>
          <UpgradedEnterpriseSuiteExtension />
        </AppProvider>,
        root
      );
    }).catch(err => console.error('Failed to load React-DOM for upgraded extension:', err));
  };

  if (document.readyState === 'complete') {
    mountUpgradedExtension();
  } else {
    window.addEventListener('load', mountUpgradedExtension);
  }
}// ============================================================================
// 25. EXTREME VALUE THEORY (EVT) & BLOCK MAXIMA TAIL RISK ANALYZER
// ============================================================================

export interface GEVParameters {
  location: number; // mu (μ)
  scale: number;    // sigma (σ)
  shape: number;    // xi (ξ)
}

export interface EVTMetrics {
  evtValueAtRisk99: number;
  evtExpectedShortfall99: number;
  evtValueAtRisk999: number;
  evtExpectedShortfall999: number;
  parameters: GEVParameters;
}

/**
 * Fits a Generalized Extreme Value (GEV) distribution to block maxima data
 * using an analytical Method of L-Moments approximation.
 * This is highly robust for tail risk estimation in financial time series.
 */
export const fitGEVDistribution = (blockMaxima: number[]): GEVParameters => {
  const n = blockMaxima.length;
  if (n < 3) {
    return { location: 0.15, scale: 0.05, shape: 0.1 }; // Fallback parameters
  }

  // Sort block maxima in ascending order
  const sorted = [...blockMaxima].sort((a, b) => a - b);

  // Calculate L-Moments
  let b0 = 0;
  let b1 = 0;
  let b2 = 0;

  for (let i = 0; i < n; i++) {
    const val = sorted[i];
    b0 += val;
    b1 += val * (i / (n - 1));
    b2 += val * (i * (i - 1)) / ((n - 1) * (n - 2));
  }

  b0 = b0 / n;
  b1 = b1 / n;
  b2 = b2 / n;

  const l1 = b0;
  const l2 = 2 * b1 - b0;
  const l3 = 6 * b2 - 6 * b1 + b0;

  // L-Skewness
  const t3 = l2 !== 0 ? l3 / l2 : 0;

  // Approximation of shape parameter (xi) based on L-Skewness
  // Using Hosking's rational approximation
  const z = t3;
  const g = (2 / (3 + z)) - (Math.log(2) / Math.log(3));
  const shape = 7.859 * g + 2.9554 * g * g; // xi (ξ)

  // Scale parameter (sigma)
  const gammaFn = (x: number): number => {
    // Lanczos approximation for Gamma function
    const g_val = 7;
    const p = [
      0.99999999999980993, 676.5203681218851, -1259.1392167224028,
      771.32342877765313, -176.61502916214059, 12.507343278686905,
      -0.13857109526572012, 9.9843695780195716e-6, 1.5056327351493116e-7
    ];
    if (x < 0.5) return Math.PI / (Math.sin(Math.PI * x) * gammaFn(1 - x));
    x -= 1;
    let a = p[0];
    const t = x + g_val + 0.5;
    for (let i = 1; i < p.length; i++) {
      a += p[i] / (x + i);
    }
    return Math.sqrt(2 * Math.PI) * Math.pow(t, x + 0.5) * Math.exp(-t) * a;
  };

  let scale = 0.05;
  if (Math.abs(shape) > 1e-5) {
    scale = (l2 * shape) / ((1 - Math.pow(2, -shape)) * gammaFn(1 + shape));
  } else {
    scale = l2 / Math.log(2);
  }

  // Location parameter (mu)
  let location = l1;
  if (Math.abs(shape) > 1e-5) {
    location = l1 - (scale / shape) * (1 - gammaFn(1 + shape));
  } else {
    const eulerMascheroni = 0.57721566490153286;
    location = l1 - scale * eulerMascheroni;
  }

  return {
    location: isNaN(location) ? 0.15 : location,
    scale: isNaN(scale) || scale <= 0 ? 0.05 : scale,
    shape: isNaN(shape) ? 0.1 : shape
  };
};

/**
 * Calculates EVT-based Value at Risk (VaR) and Expected Shortfall (ES)
 * using the fitted Generalized Extreme Value (GEV) distribution parameters.
 */
export const calculateEVTMetrics = (
  params: GEVParameters,
  blockMaxima: number[]
): EVTMetrics => {
  const { location: mu, scale: sigma, shape: xi } = params;

  // Quantile function of GEV: Q(p) = mu - (sigma / xi) * (1 - (-ln(p))^-xi)
  const calculateGEVQuantile = (p: number): number => {
    if (Math.abs(xi) > 1e-5) {
      return mu - (sigma / xi) * (1 - Math.pow(-Math.log(p), -xi));
    } else {
      return mu - sigma * Math.log(-Math.log(p));
    }
  };

  // EVT Value at Risk
  const evtValueAtRisk99 = calculateGEVQuantile(0.99);
  const evtValueAtRisk999 = calculateGEVQuantile(0.999);

  // Expected Shortfall approximation via numerical integration of tail quantiles
  const calculateExpectedShortfall = (alpha: number, steps: number = 100): number => {
    let sum = 0;
    const stepSize = (1 - alpha) / steps;
    for (let i = 0; i < steps; i++) {
      const p = alpha + (i + 0.5) * stepSize;
      sum += calculateGEVQuantile(p);
    }
    return sum / steps;
  };

  const evtExpectedShortfall99 = calculateExpectedShortfall(0.99);
  const evtExpectedShortfall999 = calculateExpectedShortfall(0.999);

  return {
    evtValueAtRisk99,
    evtExpectedShortfall99,
    evtValueAtRisk999,
    evtExpectedShortfall999,
    parameters: params
  };
};

// ============================================================================
// 26. INTEREST RATE TERM STRUCTURE & YIELD CURVE SIMULATOR
// ============================================================================

export interface YieldCurvePoint {
  maturityYears: number;
  maturityLabel: string;
  baselineYield: number;
  simulatedYield: number;
}

export interface InterestRateSimulation {
  shortRatePath: number[];
  yieldCurve: YieldCurvePoint[];
}

/**
 * Simulates the short-term interest rate path using the Cox-Ingersoll-Ross (CIR) model.
 * dr_t = a(b - r_t)dt + \sigma \sqrt{r_t} dW_t
 * Then constructs the analytical yield curve term structure.
 */
export const simulateCIRTermStructure = (
  initialRate: number, // r_0 (decimal)
  meanReversionSpeed: number, // a (decimal)
  longTermMean: number, // b (decimal)
  volatility: number, // sigma (decimal)
  horizonYears: number,
  steps: number = 12
): InterestRateSimulation => {
  const dt = horizonYears / steps;
  const shortRatePath: number[] = [initialRate];
  let currentRate = initialRate;

  // Simulate short rate path
  for (let i = 1; i <= steps; i++) {
    const { z0 } = boxMullerTransform();
    // CIR drift and diffusion
    const drift = meanReversionSpeed * (longTermMean - currentRate) * dt;
    const diffusion = volatility * Math.sqrt(Math.max(0.0001, currentRate)) * z0 * Math.sqrt(dt);
    currentRate = currentRate + drift + diffusion;
    shortRatePath.push(Math.max(0.0001, currentRate)); // Prevent negative rates
  }

  // Analytical CIR Bond Pricing to derive yields for various maturities
  // P(t, T) = A(t, T) * exp(-B(t, T) * r_t)
  const calculateCIRYield = (r: number, T: number): number => {
    if (T <= 0) return r;

    const h = Math.sqrt(meanReversionSpeed * meanReversionSpeed + 2 * volatility * volatility);
    const expTerm = Math.exp(h * T) - 1;
    const denominator = 2 * h + (meanReversionSpeed + h) * expTerm;

    const B = (2 * expTerm) / denominator;
    const A = Math.pow(
      (2 * h * Math.exp((meanReversionSpeed + h) * T / 2)) / denominator,
      (2 * meanReversionSpeed * longTermMean) / (volatility * volatility)
    );

    const bondPrice = A * Math.exp(-B * r);
    // Yield to maturity: y(t, T) = -ln(P(t, T)) / T
    return -Math.log(bondPrice) / T;
  };

  const maturities = [
    { years: 1/12, label: '1M' },
    { years: 3/12, label: '3M' },
    { years: 6/12, label: '6M' },
    { years: 1.0, label: '1Y' },
    { years: 2.0, label: '2Y' },
    { years: 5.0, label: '5Y' },
    { years: 10.0, label: '10Y' },
    { years: 30.0, label: '30Y' }
  ];

  const terminalRate = shortRatePath[shortRatePath.length - 1];

  const yieldCurve: YieldCurvePoint[] = maturities.map((m) => {
    const baselineYield = calculateCIRYield(initialRate, m.years) * 100;
    const simulatedYield = calculateCIRYield(terminalRate, m.years) * 100;
    return {
      maturityYears: m.years,
      maturityLabel: m.label,
      baselineYield,
      simulatedYield
    };
  });

  return {
    shortRatePath: shortRatePath.map(r => r * 100),
    yieldCurve
  };
};

// ============================================================================
// 27. INTERACTIVE YIELD CURVE & EVT TAIL RISK DASHBOARD
// ============================================================================

/**
 * Interactive Extreme Value Theory (EVT) Tail Risk Analyzer View.
 */
export const EVTTailRiskView: React.FC = () => {
  const { state } = useApp();
  const activeScenario = state.scenarios.find(s => s.id === state.activeScenarioId) || state.scenarios[0];
  const result = state.simulationResults[activeScenario.id];

  const evtData = useMemo(() => {
    if (!result) return null;

    // Extract block maxima (worst drawdowns from each path)
    const blockMaxima = result.rawPaths.map((path) => {
      let peak = path.values[0];
      let maxDd = 0;
      for (const val of path.values) {
        if (val > peak) peak = val;
        const dd = peak > 0 ? (peak - val) / peak : 0;
        if (dd > maxDd) maxDd = dd;
      }
      return maxDd;
    });

    const params = fitGEVDistribution(blockMaxima);
    return calculateEVTMetrics(params, blockMaxima);
  }, [result]);

  if (!result || !evtData) {
    return (
      <div className="p-12 text-center text-slate-500">
        <Icon name="refresh" className="w-12 h-12 mx-auto mb-3 animate-spin text-blue-500" />
        <p className="text-sm font-medium">Synthesizing Extreme Value Theory tail metrics...</p>
      </div>
    );
  }

  const formatPercent = (val: number) => `${(val * 100).toFixed(2)}%`;

  // SVG coordinates for GEV PDF curve
  const padding = { top: 20, right: 20, bottom: 30, left: 50 };
  const width = 500;
  const height = 200;

  const { location: mu, scale: sigma, shape: xi } = evtData.parameters;

  // GEV Probability Density Function (PDF)
  const gevPDF = (x: number): number => {
    const tx = 1 + xi * ((x - mu) / sigma);
    if (tx <= 0) return 0;
    const term1 = Math.pow(tx, -1 / xi - 1);
    const term2 = Math.exp(-Math.pow(tx, -1 / xi));
    return (1 / sigma) * term1 * term2;
  };

  const xMin = Math.max(0, mu - 3 * sigma);
  const xMax = mu + 6 * sigma;
  const xRange = xMax - xMin;

  const points = Array.from({ length: 100 }).map((_, i) => {
    const x = xMin + (i / 99) * xRange;
    const y = gevPDF(x);
    return { x, y };
  });

  const maxY = Math.max(...points.map(p => p.y)) * 1.1;

  const getX = (val: number) => padding.left + ((val - xMin) / xRange) * (width - padding.left - padding.right);
  const getY = (val: number) => padding.top + height - padding.bottom - (val / maxY) * (height - padding.top - padding.bottom);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Left: EVT Metrics Panel */}
      <div className="lg:col-span-5 space-y-6">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Icon name="alert" className="text-red-400 w-5 h-5" />
              <h3 className="text-base font-bold text-slate-200">EVT Tail Risk Analytics</h3>
            </div>
          </CardHeader>
          <CardBody className="space-y-4 font-mono text-xs">
            <div className="p-3 bg-slate-950/40 border border-slate-800/80 rounded-lg space-y-2">
              <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider font-sans">GEV Fitted Parameters</div>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div>
                  <div className="text-slate-500">Location (μ)</div>
                  <div className="text-slate-200 font-bold mt-0.5">{mu.toFixed(4)}</div>
                </div>
                <div>
                  <div className="text-slate-500">Scale (σ)</div>
                  <div className="text-slate-200 font-bold mt-0.5">{sigma.toFixed(4)}</div>
                </div>
                <div>
                  <div className="text-slate-500">Shape (ξ)</div>
                  <div className="text-slate-200 font-bold mt-0.5">{xi.toFixed(4)}</div>
                </div>
              </div>
            </div>

            <div className="divide-y divide-slate-800/60">
              <div className="py-3 flex justify-between items-center">
                <span className="text-slate-400 font-sans">99% EVT Value at Risk (VaR)</span>
                <span className="font-bold text-amber-500">{formatPercent(evtData.evtValueAtRisk99)}</span>
              </div>
              <div className="py-3 flex justify-between items-center">
                <span className="text-slate-400 font-sans">99% EVT Expected Shortfall (ES)</span>
                <span className="font-bold text-amber-600">{formatPercent(evtData.evtExpectedShortfall99)}</span>
              </div>
              <div className="py-3 flex justify-between items-center">
                <span className="text-slate-400 font-sans">99.9% EVT Value at Risk (VaR)</span>
                <span className="font-bold text-red-500">{formatPercent(evtData.evtValueAtRisk999)}</span>
              </div>
              <div className="py-3 flex justify-between items-center">
                <span className="text-slate-400 font-sans">99.9% EVT Expected Shortfall (ES)</span>
                <span className="font-bold text-red-600">{formatPercent(evtData.evtExpectedShortfall999)}</span>
              </div>
            </div>

            <p className="text-[11px] text-slate-500 leading-relaxed font-sans">
              Extreme Value Theory (EVT) models the asymptotic behavior of extreme tail losses, providing far more accurate risk estimates for black swan events than standard normal distributions.
            </p>
          </CardBody>
        </Card>
      </div>

      {/* Right: GEV PDF Chart */}
      <div className="lg:col-span-7 space-y-6">
        <Card>
          <CardHeader>
            <div>
              <h3 className="text-base font-bold text-slate-200">Generalized Extreme Value (GEV) PDF</h3>
              <p className="text-xs text-slate-500">Fitted probability density function of maximum drawdowns.</p>
            </div>
          </CardHeader>
          <CardBody className="space-y-6">
            <div className="relative overflow-hidden bg-slate-950/40 border border-slate-800/80 rounded-xl p-4">
              <svg viewBox={`0 0 ${width} ${height}`} width="100%" height={height} className="overflow-visible">
                {/* Grid Lines */}
                {[0, 0.5, 1].map((tick, i) => (
                  <line
                    key={i}
                    x1={padding.left}
                    y1={padding.top + (height - padding.top - padding.bottom) * tick}
                    x2={width - padding.right}
                    y2={padding.top + (height - padding.top - padding.bottom) * tick}
                    stroke="#1e293b"
                    strokeWidth="1"
                    strokeDasharray="4 4"
                    className="opacity-20"
                  />
                ))}

                {/* GEV PDF Path */}
                <path
                  d={points
                    .map((p, idx) => `${idx === 0 ? 'M' : 'L'} ${getX(p.x)} ${getY(p.y)}`)
                    .join(' ')}
                  fill="none"
                  stroke="#ef4444"
                  strokeWidth="2.5"
                />

                {/* VaR Threshold Lines */}
                <line
                  x1={getX(evtData.evtValueAtRisk99)}
                  y1={padding.top}
                  x2={getX(evtData.evtValueAtRisk99)}
                  y2={height - padding.bottom}
                  stroke="#f59e0b"
                  strokeWidth="1.5"
                  strokeDasharray="3 3"
                />
                <text x={getX(evtData.evtValueAtRisk99) - 6} y={padding.top + 15} fill="#f59e0b" fontSize="8" fontFamily="monospace" textAnchor="end">
                  99% VaR
                </text>

                {/* Axis Labels */}
                <text x={padding.left} y={height - 5} fill="#64748b" fontSize="9" fontFamily="monospace">
                  {(xMin * 100).toFixed(0)}% Drawdown
                </text>
                <text x={width - padding.right} y={height - 5} fill="#64748b" fontSize="9" fontFamily="monospace" textAnchor="end">
                  {(xMax * 100).toFixed(0)}% Drawdown
                </text>
              </svg>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

/**
 * Interactive Interest Rate Term Structure & Yield Curve Simulator View.
 */
export const YieldCurveSimulatorView: React.FC = () => {
  const [initialRate, setInitialRate] = useState<number>(4.5); // %
  const [meanReversion, setMeanReversion] = useState<number>(15); // %
  const [longTermMean, setLongTermMean] = useState<number>(5.0); // %
  const [volatility, setVolatility] = useState<number>(12); // %

  const simulation = useMemo(() => {
    return simulateCIRTermStructure(
      initialRate / 100,
      meanReversion / 100,
      longTermMean / 100,
      volatility / 100,
      5.0
    );
  }, [initialRate, meanReversion, longTermMean, volatility]);

  // SVG coordinates for Yield Curve
  const padding = { top: 20, right: 30, bottom: 30, left: 50 };
  const width = 500;
  const height = 220;

  const yields = simulation.yieldCurve.flatMap(p => [p.baselineYield, p.simulatedYield]);
  const maxYield = Math.max(...yields) * 1.1;
  const minYield = Math.max(0, Math.min(...yields) * 0.9);
  const yieldRange = maxYield - minYield;

  const getX = (index: number) => padding.left + (index / 7) * (width - padding.left - padding.right);
  const getY = (val: number) => padding.top + height - padding.bottom - ((val - minYield) / yieldRange) * (height - padding.top - padding.bottom);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Left: CIR Parameters */}
      <div className="lg:col-span-4 space-y-6">
        <Card>
          <CardHeader>
            <h3 className="text-base font-bold text-slate-200">CIR Model Parameters</h3>
          </CardHeader>
          <CardBody className="space-y-5">
            <Slider
              label="Initial Short Rate (r0)"
              min={1}
              max={15}
              step={0.25}
              value={initialRate}
              suffix="%"
              onChange={setInitialRate}
              helperText="The starting short-term interest rate."
            />
            <Slider
              label="Mean Reversion Speed (a)"
              min={5}
              max={80}
              step={5}
              value={meanReversion}
              suffix="%"
              onChange={setMeanReversion}
              helperText="The speed at which the rate reverts to the long-term mean."
            />
            <Slider
              label="Long-Term Mean Rate (b)"
              min={1}
              max={15}
              step={0.25}
              value={longTermMean}
              suffix="%"
              onChange={setLongTermMean}
              helperText="The long-term equilibrium interest rate level."
            />
            <Slider
              label="Interest Rate Volatility (σ)"
              min={2}
              max={40}
              step={1}
              value={volatility}
              suffix="%"
              onChange={setVolatility}
              helperText="The volatility of the short-term interest rate."
            />
          </CardBody>
        </Card>
      </div>

      {/* Right: Yield Curve Chart */}
      <div className="lg:col-span-8 space-y-6">
        <Card>
          <CardHeader>
            <div>
              <h3 className="text-base font-bold text-slate-200">Simulated Yield Curve Term Structure</h3>
              <p className="text-xs text-slate-500">Cox-Ingersoll-Ross (CIR) analytical yield curve projection.</p>
            </div>
          </CardHeader>
          <CardBody className="space-y-6">
            <div className="relative overflow-hidden bg-slate-950/40 border border-slate-800/80 rounded-xl p-4">
              <svg viewBox={`0 0 ${width} ${height}`} width="100%" height={height} className="overflow-visible">
                {/* Grid Lines */}
                {[0, 0.5, 1].map((tick, i) => (
                  <line
                    key={i}
                    x1={padding.left}
                    y1={padding.top + (height - padding.top - padding.bottom) * tick}
                    x2={width - padding.right}
                    y2={padding.top + (height - padding.top - padding.bottom) * tick}
                    stroke="#1e293b"
                    strokeWidth="1"
                    strokeDasharray="4 4"
                    className="opacity-20"
                  />
                ))}

                {/* Baseline Yield Curve Path */}
                <path
                  d={simulation.yieldCurve
                    .map((p, idx) => `${idx === 0 ? 'M' : 'L'} ${getX(idx)} ${getY(p.baselineYield)}`)
                    .join(' ')}
                  fill="none"
                  stroke="rgba(148, 163, 184, 0.4)"
                  strokeWidth="2"
                  strokeDasharray="4 4"
                />

                {/* Simulated Yield Curve Path */}
                <path
                  d={simulation.yieldCurve
                    .map((p, idx) => `${idx === 0 ? 'M' : 'L'} ${getX(idx)} ${getY(p.simulatedYield)}`)
                    .join(' ')}
                  fill="none"
                  stroke="#3b82f6"
                  strokeWidth="3"
                />

                {/* Data Points */}
                {simulation.yieldCurve.map((p, idx) => (
                  <circle
                    key={idx}
                    cx={getX(idx)}
                    cy={getY(p.simulatedYield)}
                    r="4"
                    fill="#3b82f6"
                    stroke="#0f172a"
                    strokeWidth="1.5"
                  />
                ))}

                {/* Axis Labels */}
                {simulation.yieldCurve.map((p, idx) => (
                  <text
                    key={idx}
                    x={getX(idx)}
                    y={height - 10}
                    fill="#64748b"
                    fontSize="9"
                    fontFamily="monospace"
                    textAnchor="middle"
                  >
                    {p.maturityLabel}
                  </text>
                ))}
              </svg>
            </div>

            {/* Legend */}
            <div className="flex justify-center gap-6 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <span className="w-4 border-t-2 border-dashed border-slate-600"></span>
                <span>Baseline Yield Curve (t=0)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-4 border-t-2 border-blue-500"></span>
                <span>Simulated Yield Curve (t=T)</span>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

// ============================================================================
// 28. UPGRADED RUNTIME EXTENSION PORTAL v3
// ============================================================================

/**
 * Supercharged Runtime Extension Component.
 * Dynamically registers the new advanced views (EVT Tail Risk, Yield Curve Term Structure)
 * into the existing navigation bar and main content router.
 */
export const SuperchargedEnterpriseSuiteExtension: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string | null>(null);
  const [navContainer, setNavContainer] = useState<Element | null>(null);
  const [mainContainer, setMainContainer] = useState<Element | null>(null);

  useEffect(() => {
    const findContainers = () => {
      const nav = document.querySelector('nav.flex.flex-wrap');
      const main = document.querySelector('main.relative');
      if (nav && main) {
        setNavContainer(nav);
        setMainContainer(main);
      }
    };

    findContainers();
    const observer = new MutationObserver(() => findContainers());
    observer.observe(document.body, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!navContainer) return;

    const handleOriginalTabClick = (e: Event) => {
      const target = e.currentTarget as HTMLElement;
      if (target.getAttribute('data-supercharged-tab')) return;
      
      setActiveTab(null);
      
      const originalTabs = navContainer.querySelectorAll('button:not([data-supercharged-tab])');
      originalTabs.forEach(tab => {
        tab.classList.remove('border-transparent', 'text-slate-400');
        tab.classList.add('border-blue-500', 'text-blue-400', 'bg-blue-950/10');
      });

      const customTabs = navContainer.querySelectorAll('button[data-supercharged-tab]');
      customTabs.forEach(tab => {
        tab.classList.remove('border-blue-500', 'text-blue-400', 'bg-blue-950/10');
        tab.classList.add('border-transparent', 'text-slate-400');
      });
    };

    const originalButtons = navContainer.querySelectorAll('button:not([data-supercharged-tab])');
    originalButtons.forEach(btn => btn.addEventListener('click', handleOriginalTabClick));

    return () => {
      originalButtons.forEach(btn => btn.removeEventListener('click', handleOriginalTabClick));
    };
  }, [navContainer]);

  useEffect(() => {
    if (!mainContainer) return;
    const originalChildren = Array.from(mainContainer.children) as HTMLElement[];
    
    if (activeTab) {
      originalChildren.forEach(child => {
        if (!child.getAttribute('data-supercharged-content')) {
          child.style.display = 'none';
        }
      });
    } else {
      originalChildren.forEach(child => {
        child.style.display = '';
      });
    }
  }, [activeTab, mainContainer]);

  const handleCustomTabClick = (tabId: string) => {
    setActiveTab(tabId);

    if (!navContainer) return;

    const originalTabs = navContainer.querySelectorAll('button:not([data-supercharged-tab])');
    originalTabs.forEach(tab => {
      tab.classList.remove('border-blue-500', 'text-blue-400', 'bg-blue-950/10');
      tab.classList.add('border-transparent', 'text-slate-400');
    });

    const customTabs = navContainer.querySelectorAll('button[data-supercharged-tab]');
    customTabs.forEach(tab => {
      const id = tab.getAttribute('data-supercharged-tab');
      if (id === tabId) {
        tab.classList.remove('border-transparent', 'text-slate-400');
        tab.classList.add('border-blue-500', 'text-blue-400', 'bg-blue-950/10');
      } else {
        tab.classList.remove('border-blue-500', 'text-blue-400', 'bg-blue-950/10');
        tab.classList.add('border-transparent', 'text-slate-400');
      }
    });
  };

  if (!navContainer || !mainContainer) return null;

  const superchargedTabs = [
    { id: 'evt', label: 'EVT Tail Risk', icon: 'alert' },
    { id: 'yieldcurve', label: 'Yield Curve CIR', icon: 'trending' }
  ];

  return (
    <>
      {createPortal(
        <>
          {superchargedTabs.map(tab => {
            const exists = navContainer.querySelector(`[data-supercharged-tab="${tab.id}"]`);
            if (exists) return null;

            return (
              <button
                key={tab.id}
                data-supercharged-tab={tab.id}
                onClick={() => handleCustomTabClick(tab.id)}
                className="flex items-center gap-2 px-4 py-3 text-xs font-bold uppercase tracking-wider border-b-2 border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-800 transition-all duration-200"
              >
                <Icon name={tab.icon as any} className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </>,
        navContainer
      )}

      {activeTab && createPortal(
        <div data-supercharged-content="true" className="space-y-6 animate-fadeIn">
          {activeTab === 'evt' && <EVTTailRiskView />}
          {activeTab === 'yieldcurve' && <YieldCurveSimulatorView />}
        </div>,
        mainContainer
      )}
    </>
  );
};

if (typeof window !== 'undefined') {
  const mountSuperchargedExtension = () => {
    const id = 'quantum-core-supercharged-extension-root';
    if (document.getElementById(id)) return;

    const root = document.createElement('div');
    root.id = id;
    document.body.appendChild(root);

    import('react-dom').then(({ render }) => {
      render(
        <AppProvider>
          <SuperchargedEnterpriseSuiteExtension />
        </AppProvider>,
        root
      );
    }).catch(err => console.error('Failed to load React-DOM for supercharged extension:', err));
  };

  if (document.readyState === 'complete') {
    mountSuperchargedExtension();
  } else {
    window.addEventListener('load', mountSuperchargedExtension);
  }
}// ============================================================================
// 29. HESTON STOCHASTIC VOLATILITY SIMULATION ENGINE
// ============================================================================

export interface HestonParameters {
  initialPrice: number;     // S_0
  initialVolatility: number;// V_0 (variance)
  meanReversionSpeed: number;// kappa (κ)
  longTermVariance: number;  // theta (θ)
  volOfVol: number;          // xi (ξ)
  correlation: number;       // rho (ρ) between asset and volatility shocks
  drift: number;             // mu (μ)
  horizonYears: number;      // T
}

export interface HestonPath {
  priceValues: number[];
  volValues: number[];
}

/**
 * Generates correlated asset price and volatility paths using the Heston Stochastic Volatility Model.
 * Uses Euler-Maruyama discretization with full truncation to prevent negative variance.
 * 
 * dS_t = mu * S_t * dt + sqrt(V_t) * S_t * dW^1_t
 * dV_t = kappa * (theta - V_t) * dt + xi * sqrt(V_t) * dW^2_t
 * d<W^1, W^2>_t = rho * dt
 */
export const generateHestonPaths = (
  params: HestonParameters,
  numPaths: number = 500,
  steps: number = 60
): HestonPath[] => {
  const {
    initialPrice,
    initialVolatility,
    meanReversionSpeed: kappa,
    longTermVariance: theta,
    volOfVol: xi,
    correlation: rho,
    drift: mu,
    horizonYears: T
  } = params;

  const dt = T / steps;
  const paths: HestonPath[] = [];

  for (let p = 0; p < numPaths; p++) {
    const priceValues: number[] = [initialPrice];
    const volValues: number[] = [initialVolatility];

    let currentS = initialPrice;
    let currentV = initialVolatility;

    for (let t = 1; t <= steps; t++) {
      // Generate two independent standard normal variables
      const { z0: Z1 } = boxMullerTransform();
      const { z0: Z_temp } = boxMullerTransform();

      // Correlate the second normal variable using Cholesky correlation
      const Z2 = rho * Z1 + Math.sqrt(1 - rho * rho) * Z_temp;

      // Euler-Maruyama step for variance (with full truncation to handle negative variance)
      const vPlus = Math.max(0, currentV);
      const dV = kappa * (theta - vPlus) * dt + xi * Math.sqrt(vPlus) * Math.sqrt(dt) * Z2;
      currentV = currentV + dV;
      volValues.push(Math.max(0.0001, currentV)); // Keep variance strictly positive for next steps

      // Euler-Maruyama step for asset price
      const dS = mu * currentS * dt + Math.sqrt(vPlus) * currentS * Math.sqrt(dt) * Z1;
      currentS = currentS + dS;
      priceValues.push(Math.max(0.01, currentS)); // Prevent asset price from dropping to zero
    }

    paths.push({ priceValues, volValues });
  }

  return paths;
};

// ============================================================================
// 30. INTERACTIVE HESTON MODEL SIMULATION VIEW
// ============================================================================

export const HestonSimulationView: React.FC = () => {
  const { state } = useApp();
  const activeScenario = state.scenarios.find(s => s.id === state.activeScenarioId) || state.scenarios[0];

  const [initialVol, setInitialVol] = useState<number>(15); // % (standard deviation)
  const [kappa, setKappa] = useState<number>(2.0);          // Mean reversion speed
  const [theta, setTheta] = useState<number>(20);           // % Long-term volatility target
  const [volOfVol, setVolOfVol] = useState<number>(30);     // % Volatility of volatility
  const [rho, setRho] = useState<number>(-50);              // % Correlation (typically negative for equities)

  const hestonParams = useMemo<HestonParameters>(() => {
    return {
      initialPrice: activeScenario.baseValue,
      initialVolatility: Math.pow(initialVol / 100, 2), // Convert std dev % to variance
      meanReversionSpeed: kappa,
      longTermVariance: Math.pow(theta / 100, 2),
      volOfVol: volOfVol / 100,
      correlation: rho / 100,
      drift: activeScenario.growthRate / 100,
      horizonYears: activeScenario.horizonYears
    };
  }, [activeScenario, initialVol, kappa, theta, volOfVol, rho]);

  const paths = useMemo(() => {
    return generateHestonPaths(hestonParams, 15, 60); // Generate 15 paths for visualization
  }, [hestonParams]);

  // SVG coordinates mapping
  const padding = { top: 20, right: 20, bottom: 30, left: 50 };
  const width = 500;
  const height = 200;

  const allPrices = paths.flatMap(p => p.priceValues);
  const maxPrice = Math.max(...allPrices) * 1.05;
  const minPrice = Math.max(0, Math.min(...allPrices) * 0.95);
  const priceRange = maxPrice - minPrice;

  const allVols = paths.flatMap(p => p.volValues.map(v => Math.sqrt(v) * 100)); // Convert variance back to volatility %
  const maxVol = Math.max(...allVols) * 1.05;
  const minVol = Math.max(0, Math.min(...allVols) * 0.95);
  const volRange = maxVol - minVol;

  const getX = (stepIndex: number, totalSteps: number) => {
    return padding.left + (stepIndex / totalSteps) * (width - padding.left - padding.right);
  };

  const getYPrice = (val: number) => {
    return padding.top + height - padding.bottom - ((val - minPrice) / priceRange) * (height - padding.top - padding.bottom);
  };

  const getYVol = (val: number) => {
    return padding.top + height - padding.bottom - ((val - minVol) / volRange) * (height - padding.top - padding.bottom);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Left: Heston Parameters */}
      <div className="lg:col-span-4 space-y-6">
        <Card>
          <CardHeader>
            <h3 className="text-base font-bold text-slate-200">Heston Volatility Parameters</h3>
          </CardHeader>
          <CardBody className="space-y-5">
            <Slider
              label="Initial Volatility (V0)"
              min={5}
              max={60}
              step={1}
              value={initialVol}
              suffix="%"
              onChange={setInitialVol}
              helperText="Starting volatility level (expressed as annualized standard deviation)."
            />
            <Slider
              label="Mean Reversion Speed (κ)"
              min={0.5}
              max={10.0}
              step={0.1}
              value={kappa}
              suffix=""
              onChange={setKappa}
              helperText="The rate at which volatility reverts back to its long-term mean."
            />
            <Slider
              label="Long-Term Volatility (θ)"
              min={5}
              max={60}
              step={1}
              value={theta}
              suffix="%"
              onChange={setTheta}
              helperText="The long-term equilibrium volatility target."
            />
            <Slider
              label="Volatility of Volatility (ξ)"
              min={5}
              max={100}
              step={5}
              value={volOfVol}
              suffix="%"
              onChange={setVolOfVol}
              helperText="The variance of the volatility process itself."
            />
            <Slider
              label="Asset-Vol Correlation (ρ)"
              min={-90}
              max={90}
              step={5}
              value={rho}
              suffix="%"
              onChange={setRho}
              helperText="Correlation between asset price shocks and volatility shocks (leverage effect)."
            />
          </CardBody>
        </Card>
      </div>

      {/* Right: Dual Stochastic Charts */}
      <div className="lg:col-span-8 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Asset Price Paths */}
          <Card>
            <CardHeader>
              <div>
                <h4 className="text-sm font-bold text-slate-200">Stochastic Asset Price Paths</h4>
                <p className="text-xs text-slate-500">Heston model price realizations over time.</p>
              </div>
            </CardHeader>
            <CardBody>
              <div className="relative overflow-hidden bg-slate-950/40 border border-slate-800/80 rounded-xl p-4">
                <svg viewBox={`0 0 ${width} ${height}`} width="100%" height={height} className="overflow-visible">
                  {/* Grid Lines */}
                  {[0, 0.5, 1].map((tick, i) => (
                    <line
                      key={i}
                      x1={padding.left}
                      y1={padding.top + (height - padding.top - padding.bottom) * tick}
                      x2={width - padding.right}
                      y2={padding.top + (height - padding.top - padding.bottom) * tick}
                      stroke="#1e293b"
                      strokeWidth="1"
                      strokeDasharray="4 4"
                      className="opacity-20"
                    />
                  ))}

                  {/* Paths */}
                  {paths.map((path, idx) => (
                    <path
                      key={idx}
                      d={path.priceValues
                        .map((val, sIdx) => `${sIdx === 0 ? 'M' : 'L'} ${getX(sIdx, path.priceValues.length - 1)} ${getYPrice(val)}`)
                        .join(' ')}
                      fill="none"
                      stroke="rgb(59, 130, 246)"
                      strokeWidth="1.5"
                      strokeOpacity="0.4"
                    />
                  ))}

                  {/* Axis Labels */}
                  <text x={padding.left} y={height - 5} fill="#64748b" fontSize="9" fontFamily="monospace">
                    t = 0
                  </text>
                  <text x={width - padding.right} y={height - 5} fill="#64748b" fontSize="9" fontFamily="monospace" textAnchor="end">
                    t = {activeScenario.horizonYears} Yrs
                  </text>
                </svg>
              </div>
            </CardBody>
          </Card>

          {/* Volatility Paths */}
          <Card>
            <CardHeader>
              <div>
                <h4 className="text-sm font-bold text-slate-200">Stochastic Volatility Paths</h4>
                <p className="text-xs text-slate-500">Annualized volatility (%) process realizations.</p>
              </div>
            </CardHeader>
            <CardBody>
              <div className="relative overflow-hidden bg-slate-950/40 border border-slate-800/80 rounded-xl p-4">
                <svg viewBox={`0 0 ${width} ${height}`} width="100%" height={height} className="overflow-visible">
                  {/* Grid Lines */}
                  {[0, 0.5, 1].map((tick, i) => (
                    <line
                      key={i}
                      x1={padding.left}
                      y1={padding.top + (height - padding.top - padding.bottom) * tick}
                      x2={width - padding.right}
                      y2={padding.top + (height - padding.top - padding.bottom) * tick}
                      stroke="#1e293b"
                      strokeWidth="1"
                      strokeDasharray="4 4"
                      className="opacity-20"
                    />
                  ))}

                  {/* Paths */}
                  {paths.map((path, idx) => (
                    <path
                      key={idx}
                      d={path.volValues
                        .map((val, sIdx) => `${sIdx === 0 ? 'M' : 'L'} ${getX(sIdx, path.volValues.length - 1)} ${getYVol(Math.sqrt(val) * 100)}`)
                        .join(' ')}
                      fill="none"
                      stroke="rgb(168, 85, 247)"
                      strokeWidth="1.5"
                      strokeOpacity="0.4"
                    />
                  ))}

                  {/* Axis Labels */}
                  <text x={padding.left} y={height - 5} fill="#64748b" fontSize="9" fontFamily="monospace">
                    t = 0
                  </text>
                  <text x={width - padding.right} y={height - 5} fill="#64748b" fontSize="9" fontFamily="monospace" textAnchor="end">
                    t = {activeScenario.horizonYears} Yrs
                  </text>
                </svg>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// 31. CREDIT VALUATION ADJUSTMENT (CVA) & CDS PRICING ENGINE
// ============================================================================

export interface CreditRiskParameters {
  hazardRate: number;       // lambda (λ) constant default intensity
  recoveryRate: number;     // R (recovery rate in default, e.g., 40%)
  counterpartyExposure: number; // Current exposure ($M)
  discountRate: number;     // Risk-free rate for discounting
}

export interface CDSTermPoint {
  tenorYears: number;
  survivalProbability: number;
  cumulativeDefaultProbability: number;
  fairCDSSpreadBps: number;
}

/**
 * Calculates survival probabilities, default probabilities, and fair CDS spreads
 * across a term structure using a reduced-form hazard rate model.
 * Also computes Credit Valuation Adjustment (CVA) for counterparty credit risk.
 */
export const calculateCreditAndCVA = (
  params: CreditRiskParameters,
  tenors: number[] = [1, 2, 3, 5, 7, 10]
): { termStructure: CDSTermPoint[]; cva: number; expectedLoss: number } => {
  const { hazardRate, recoveryRate, counterpartyExposure, discountRate } = params;
  const termStructure: CDSTermPoint[] = [];

  // Survival probability: P(t) = exp(-lambda * t)
  // Cumulative default probability: F(t) = 1 - exp(-lambda * t)
  tenors.forEach((t) => {
    const survivalProbability = Math.exp(-hazardRate * t);
    const cumulativeDefaultProbability = 1 - survivalProbability;

    // Fair CDS Spread (bps) approximation: Spread = lambda * (1 - R) * 10000
    const fairCDSSpreadBps = hazardRate * (1 - recoveryRate) * 10000;

    termStructure.push({
      tenorYears: t,
      survivalProbability,
      cumulativeDefaultProbability,
      fairCDSSpreadBps
    });
  });

  // Calculate Credit Valuation Adjustment (CVA)
  // CVA = (1 - R) * sum_{i=1}^N EE(t_i) * dPD(t_{i-1}, t_i) * D(t_i)
  // For a constant exposure and flat hazard rate, we discretize quarterly over 5 years
  let cva = 0;
  const steps = 20; // 5 years quarterly
  const dt = 0.25;
  let prevSurvival = 1.0;

  for (let i = 1; i <= steps; i++) {
    const t = i * dt;
    const currentSurvival = Math.exp(-hazardRate * t);
    const marginalDefaultProb = prevSurvival - currentSurvival;
    const discountFactor = Math.exp(-discountRate * t);

    // Expected Exposure (EE) is assumed constant for this baseline model
    cva += (1 - recoveryRate) * counterpartyExposure * marginalDefaultProb * discountFactor;
    prevSurvival = currentSurvival;
  }

  const expectedLoss = counterpartyExposure * (1 - Math.exp(-hazardRate * 5.0)) * (1 - recoveryRate);

  return {
    termStructure,
    cva,
    expectedLoss
  };
};

// ============================================================================
// 32. INTERACTIVE CREDIT RISK & CVA DASHBOARD
// ============================================================================

export const CreditRiskDashboardView: React.FC = () => {
  const { state } = useApp();
  const activeScenario = state.scenarios.find(s => s.id === state.activeScenarioId) || state.scenarios[0];

  const [hazardRate, setHazardRate] = useState<number>(3.0); // % (annual default intensity)
  const [recoveryRate, setRecoveryRate] = useState<number>(40); // %
  const [exposure, setExposure] = useState<number>(50); // $M

  const creditParams = useMemo<CreditRiskParameters>(() => {
    return {
      hazardRate: hazardRate / 100,
      recoveryRate: recoveryRate / 100,
      counterpartyExposure: exposure,
      discountRate: activeScenario.riskFreeRate / 100
    };
  }, [activeScenario, hazardRate, recoveryRate, exposure]);

  const { termStructure, cva, expectedLoss } = useMemo(() => {
    return calculateCreditAndCVA(creditParams);
  }, [creditParams]);

  // SVG coordinates mapping
  const padding = { top: 20, right: 30, bottom: 30, left: 50 };
  const width = 500;
  const height = 200;

  const getX = (tenor: number) => {
    return padding.left + (tenor / 10) * (width - padding.left - padding.right);
  };

  const getY = (prob: number) => {
    return padding.top + height - padding.bottom - prob * (height - padding.top - padding.bottom);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Left: Credit Parameters */}
      <div className="lg:col-span-4 space-y-6">
        <Card>
          <CardHeader>
            <h3 className="text-base font-bold text-slate-200">Credit Risk Parameters</h3>
          </CardHeader>
          <CardBody className="space-y-5">
            <Slider
              label="Annual Hazard Rate (λ)"
              min={0.5}
              max={15.0}
              step={0.1}
              value={hazardRate}
              suffix="%"
              onChange={setHazardRate}
              helperText="The constant default intensity representing the probability of default in an infinitesimal time interval."
            />
            <Slider
              label="Recovery Rate (R)"
              min={10}
              max={80}
              step={5}
              value={recoveryRate}
              suffix="%"
              onChange={setRecoveryRate}
              helperText="The percentage of exposure recovered in the event of default."
            />
            <Slider
              label="Counterparty Exposure"
              min={5}
              max={200}
              step={5}
              value={exposure}
              suffix="M"
              onChange={setExposure}
              helperText="The total financial exposure to the counterparty."
            />
          </CardBody>
        </Card>

        {/* CVA & Expected Loss KPIs */}
        <div className="grid grid-cols-2 gap-4">
          <Card>
            <CardBody className="space-y-1 text-center">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Credit Valuation Adj (CVA)</span>
              <div className="text-xl font-black text-red-400 font-mono">
                ${cva.toFixed(2)}M
              </div>
              <p className="text-[9px] text-slate-500">Stressed portfolio adjustment.</p>
            </CardBody>
          </Card>

          <Card>
            <CardBody className="space-y-1 text-center">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">5-Year Expected Loss</span>
              <div className="text-xl font-black text-amber-500 font-mono">
                ${expectedLoss.toFixed(2)}M
              </div>
              <p className="text-[9px] text-slate-500">Unhedged default loss.</p>
            </CardBody>
          </Card>
        </div>
      </div>

      {/* Right: Survival Probability Curve & Term Structure Table */}
      <div className="lg:col-span-8 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Survival Curve Chart */}
          <Card>
            <CardHeader>
              <div>
                <h4 className="text-sm font-bold text-slate-200">Survival Probability Curve</h4>
                <p className="text-xs text-slate-500">Probability of counterparty survival over a 10-year horizon.</p>
              </div>
            </CardHeader>
            <CardBody>
              <div className="relative overflow-hidden bg-slate-950/40 border border-slate-800/80 rounded-xl p-4">
                <svg viewBox={`0 0 ${width} ${height}`} width="100%" height={height} className="overflow-visible">
                  {/* Grid Lines */}
                  {[0, 0.5, 1].map((tick, i) => (
                    <line
                      key={i}
                      x1={padding.left}
                      y1={padding.top + (height - padding.top - padding.bottom) * tick}
                      x2={width - padding.right}
                      y2={padding.top + (height - padding.top - padding.bottom) * tick}
                      stroke="#1e293b"
                      strokeWidth="1"
                      strokeDasharray="4 4"
                      className="opacity-20"
                    />
                  ))}

                  {/* Survival Curve Path */}
                  <path
                    d={termStructure
                      .map((p, idx) => `${idx === 0 ? 'M' : 'L'} ${getX(p.tenorYears)} ${getY(p.survivalProbability)}`)
                      .join(' ')}
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="3"
                  />

                  {/* Data Points */}
                  {termStructure.map((p, idx) => (
                    <circle
                      key={idx}
                      cx={getX(p.tenorYears)}
                      cy={getY(p.survivalProbability)}
                      r="4"
                      fill="#10b981"
                      stroke="#0f172a"
                      strokeWidth="1.5"
                    />
                  ))}

                  {/* Axis Labels */}
                  {termStructure.map((p, idx) => (
                    <text
                      key={idx}
                      x={getX(p.tenorYears)}
                      y={height - 10}
                      fill="#64748b"
                      fontSize="9"
                      fontFamily="monospace"
                      textAnchor="middle"
                    >
                      {p.tenorYears}Y
                    </text>
                  ))}
                </svg>
              </div>
            </CardBody>
          </Card>

          {/* Term Structure Table */}
          <Card>
            <CardHeader>
              <h4 className="text-sm font-bold text-slate-200">CDS Term Structure</h4>
            </CardHeader>
            <CardBody className="p-0">
              <div className="overflow-x-auto custom-scrollbar">
                <table className="min-w-full divide-y divide-slate-800/60 font-mono text-xs text-slate-300">
                  <thead className="bg-slate-950/40 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    <tr>
                      <th className="px-4 py-2.5 text-left">Tenor</th>
                      <th className="px-4 py-2.5 text-right">Survival Prob</th>
                      <th className="px-4 py-2.5 text-right">Default Prob</th>
                      <th className="px-4 py-2.5 text-right">CDS Spread</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/40">
                    {termStructure.map((p, idx) => (
                      <tr key={idx} className="hover:bg-slate-900/20">
                        <td className="px-4 py-2 font-bold text-slate-200">{p.tenorYears}Y</td>
                        <td className="px-4 py-2 text-right text-emerald-400">{(p.survivalProbability * 100).toFixed(1)}%</td>
                        <td className="px-4 py-2 text-right text-red-400">{(p.cumulativeDefaultProbability * 100).toFixed(1)}%</td>
                        <td className="px-4 py-2 text-right text-blue-400 font-bold">{p.fairCDSSpreadBps.toFixed(0)} bps</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// 33. LIABILITY-DRIVEN INVESTMENT (LDI) STRATEGY SIMULATOR
// ============================================================================

export interface LiabilityProfile {
  maturityYears: number;
  amount: number; // Stressed cash outflow ($M)
}

export interface LDISimulationPoint {
  year: number;
  assetValue: number;
  liabilityValue: number;
  fundingRatio: number;
}

/**
 * Simulates a Liability-Driven Investment (LDI) strategy over time.
 * Compares a standard asset portfolio against a stream of future liabilities,
 * calculating the funding ratio and immunization effectiveness.
 */
export const simulateLDIPortfolio = (
  initialAssets: number,
  liabilities: LiabilityProfile[],
  assetGrowth: number,      // Annual return (%)
  assetVolatility: number,  // Annual volatility (%)
  discountRate: number,     // Discount rate for liabilities (%)
  horizonYears: number = 10
): LDISimulationPoint[] => {
  const points: LDISimulationPoint[] = [];
  let currentAssets = initialAssets;

  // Calculate initial present value of liabilities
  const calculatePV = (rate: number) => {
    return liabilities.reduce((sum, l) => sum + l.amount / Math.pow(1 + rate, l.maturityYears), 0);
  };

  for (let year = 0; year <= horizonYears; year++) {
    // Present value of remaining liabilities at current year
    const remainingLiabilities = liabilities.filter(l => l.maturityYears > year);
    const liabilityValue = remainingLiabilities.reduce((sum, l) => {
      const remainingMaturity = l.maturityYears - year;
      return sum + l.amount / Math.pow(1 + discountRate / 100, remainingMaturity);
    }, 0);

    const fundingRatio = liabilityValue > 0 ? (currentAssets / liabilityValue) * 100 : 100;

    points.push({
      year,
      assetValue: currentAssets,
      liabilityValue,
      fundingRatio
    });

    // Evolve assets for next year using stochastic GBM step
    if (year < horizonYears) {
      const { z0 } = boxMullerTransform();
      const mu = assetGrowth / 100;
      const sigma = assetVolatility / 100;
      const exponent = (mu - 0.5 * sigma * sigma) + sigma * z0;
      currentAssets = currentAssets * Math.exp(exponent);
    }
  }

  return points;
};

// ============================================================================
// 34. INTERACTIVE LDI IMMUNIZATION VIEW
// ============================================================================

export const LDIImmunizationView: React.FC = () => {
  const { state } = useApp();
  const activeScenario = state.scenarios.find(s => s.id === state.activeScenarioId) || state.scenarios[0];

  const [initialAssets, setInitialAssets] = useState<number>(100); // $M
  const [liability1, setLiability1] = useState<number>(30);       // $M at Year 3
  const [liability2, setLiability2] = useState<number>(50);       // $M at Year 5
  const [liability3, setLiability3] = useState<number>(60);       // $M at Year 10

  const liabilities = useMemo<LiabilityProfile[]>(() => {
    return [
      { maturityYears: 3, amount: liability1 },
      { maturityYears: 5, amount: liability2 },
      { maturityYears: 10, amount: liability3 }
    ];
  }, [liability1, liability2, liability3]);

  const ldiPoints = useMemo(() => {
    return simulateLDIPortfolio(
      initialAssets,
      liabilities,
      activeScenario.growthRate,
      activeScenario.volatility,
      activeScenario.riskFreeRate,
      10
    );
  }, [activeScenario, initialAssets, liabilities]);

  // SVG coordinates mapping
  const padding = { top: 20, right: 30, bottom: 30, left: 50 };
  const width = 500;
  const height = 220;

  const maxVal = Math.max(...ldiPoints.flatMap(p => [p.assetValue, p.liabilityValue])) * 1.1;
  const getX = (year: number) => padding.left + (year / 10) * (width - padding.left - padding.right);
  const getY = (val: number) => padding.top + height - padding.bottom - (val / maxVal) * (height - padding.top - padding.bottom);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Left: LDI Parameters */}
      <div className="lg:col-span-4 space-y-6">
        <Card>
          <CardHeader>
            <h3 className="text-base font-bold text-slate-200">LDI Asset & Liability Sandbox</h3>
          </CardHeader>
          <CardBody className="space-y-5">
            <Slider
              label="Initial Dedicated Assets"
              min={50}
              max={200}
              step={5}
              value={initialAssets}
              suffix="M"
              onChange={setInitialAssets}
              helperText="Dedicated capital allocated to immunize future liabilities."
            />
            <Slider
              label="Year 3 Liability Outflow"
              min={10}
              max={100}
              step={5}
              value={liability1}
              suffix="M"
              onChange={setLiability1}
              helperText="Stressed cash outflow required at Year 3."
            />
            <Slider
              label="Year 5 Liability Outflow"
              min={10}
              max={100}
              step={5}
              value={liability2}
              suffix="M"
              onChange={setLiability2}
              helperText="Stressed cash outflow required at Year 5."
            />
            <Slider
              label="Year 10 Liability Outflow"
              min={10}
              max={100}
              step={5}
              value={liability3}
              suffix="M"
              onChange={setLiability3}
              helperText="Stressed cash outflow required at Year 10."
            />
          </CardBody>
        </Card>
      </div>

      {/* Right: LDI Trajectory Chart */}
      <div className="lg:col-span-8 space-y-6">
        <Card>
          <CardHeader>
            <div>
              <h3 className="text-base font-bold text-slate-200">Asset vs Liability Trajectory</h3>
              <p className="text-xs text-slate-500">Stochastic asset evolution vs present value of liabilities.</p>
            </div>
            <Badge color={ldiPoints[10].fundingRatio >= 100 ? 'green' : 'red'}>
              Terminal Funding Ratio: {ldiPoints[10].fundingRatio.toFixed(1)}%
            </Badge>
          </CardHeader>
          <CardBody className="space-y-6">
            {/* SVG Line Chart */}
            <div className="relative overflow-hidden bg-slate-950/40 border border-slate-800/80 rounded-xl p-4">
              <svg viewBox={`0 0 ${width} ${height}`} width="100%" height={height} className="overflow-visible">
                {/* Grid Lines */}
                {[0, 0.5, 1].map((tick, i) => (
                  <line
                    key={i}
                    x1={padding.left}
                    y1={padding.top + (height - padding.top - padding.bottom) * tick}
                    x2={width - padding.right}
                    y2={padding.top + (height - padding.top - padding.bottom) * tick}
                    stroke="#1e293b"
                    strokeWidth="1"
                    strokeDasharray="4 4"
                    className="opacity-20"
                  />
                ))}

                {/* Liability Curve Path */}
                <path
                  d={ldiPoints
                    .map((p) => `${p.year === 0 ? 'M' : 'L'} ${getX(p.year)} ${getY(p.liabilityValue)}`)
                    .join(' ')}
                  fill="none"
                  stroke="#ef4444"
                  strokeWidth="2.5"
                  strokeDasharray="4 4"
                />

                {/* Asset Curve Path */}
                <path
                  d={ldiPoints
                    .map((p) => `${p.year === 0 ? 'M' : 'L'} ${getX(p.year)} ${getY(p.assetValue)}`)
                    .join(' ')}
                  fill="none"
                  stroke="#3b82f6"
                  strokeWidth="3"
                />

                {/* Data Points */}
                {ldiPoints.map((p, idx) => (
                  <circle
                    key={idx}
                    cx={getX(p.year)}
                    cy={getY(p.assetValue)}
                    r="3.5"
                    fill="#3b82f6"
                    stroke="#0f172a"
                    strokeWidth="1.5"
                  />
                ))}

                {/* Axis Labels */}
                {ldiPoints.map((p, idx) => (
                  <text
                    key={idx}
                    x={getX(p.year)}
                    y={height - 10}
                    fill="#64748b"
                    fontSize="9"
                    fontFamily="monospace"
                    textAnchor="middle"
                  >
                    Yr {p.year}
                  </text>
                ))}
              </svg>
            </div>

            {/* Legend */}
            <div className="flex justify-center gap-6 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <span className="w-4 border-t-2 border-blue-500"></span>
                <span>Dedicated Asset Portfolio</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-4 border-t-2 border-dashed border-red-500"></span>
                <span>Present Value of Liabilities</span>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

// ============================================================================
// 35. ULTIMATE RUNTIME EXTENSION UPGRADE PORTAL (RE-REGISTRATION)
// ============================================================================

/**
 * Ultimate Runtime Extension Component.
 * Dynamically registers the new advanced views (Heston Stochastic Volatility,
 * Credit Valuation Adjustment, Liability-Driven Investment) into the existing
 * navigation bar and main content router.
 */
export const UltimateEnterpriseSuiteExtension: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string | null>(null);
  const [navContainer, setNavContainer] = useState<Element | null>(null);
  const [mainContainer, setMainContainer] = useState<Element | null>(null);

  useEffect(() => {
    const findContainers = () => {
      const nav = document.querySelector('nav.flex.flex-wrap');
      const main = document.querySelector('main.relative');
      if (nav && main) {
        setNavContainer(nav);
        setMainContainer(main);
      }
    };

    findContainers();
    const observer = new MutationObserver(() => findContainers());
    observer.observe(document.body, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!navContainer) return;

    const handleOriginalTabClick = (e: Event) => {
      const target = e.currentTarget as HTMLElement;
      if (target.getAttribute('data-ultimate-tab')) return;
      
      setActiveTab(null);
      
      const originalTabs = navContainer.querySelectorAll('button:not([data-ultimate-tab])');
      originalTabs.forEach(tab => {
        tab.classList.remove('border-transparent', 'text-slate-400');
        tab.classList.add('border-blue-500', 'text-blue-400', 'bg-blue-950/10');
      });

      const customTabs = navContainer.querySelectorAll('button[data-ultimate-tab]');
      customTabs.forEach(tab => {
        tab.classList.remove('border-blue-500', 'text-blue-400', 'bg-blue-950/10');
        tab.classList.add('border-transparent', 'text-slate-400');
      });
    };

    const originalButtons = navContainer.querySelectorAll('button:not([data-ultimate-tab])');
    originalButtons.forEach(btn => btn.addEventListener('click', handleOriginalTabClick));

    return () => {
      originalButtons.forEach(btn => btn.removeEventListener('click', handleOriginalTabClick));
    };
  }, [navContainer]);

  useEffect(() => {
    if (!mainContainer) return;
    const originalChildren = Array.from(mainContainer.children) as HTMLElement[];
    
    if (activeTab) {
      originalChildren.forEach(child => {
        if (!child.getAttribute('data-ultimate-content')) {
          child.style.display = 'none';
        }
      });
    } else {
      originalChildren.forEach(child => {
        child.style.display = '';
      });
    }
  }, [activeTab, mainContainer]);

  const handleCustomTabClick = (tabId: string) => {
    setActiveTab(tabId);

    if (!navContainer) return;

    const originalTabs = navContainer.querySelectorAll('button:not([data-ultimate-tab])');
    originalTabs.forEach(tab => {
      tab.classList.remove('border-blue-500', 'text-blue-400', 'bg-blue-950/10');
      tab.classList.add('border-transparent', 'text-slate-400');
    });

    const customTabs = navContainer.querySelectorAll('button[data-ultimate-tab]');
    customTabs.forEach(tab => {
      const id = tab.getAttribute('data-ultimate-tab');
      if (id === tabId) {
        tab.classList.remove('border-transparent', 'text-slate-400');
        tab.classList.add('border-blue-500', 'text-blue-400', 'bg-blue-950/10');
      } else {
        tab.classList.remove('border-blue-500', 'text-blue-400', 'bg-blue-950/10');
        tab.classList.add('border-transparent', 'text-slate-400');
      }
    });
  };

  if (!navContainer || !mainContainer) return null;

  const ultimateTabs = [
    { id: 'heston', label: 'Heston Volatility', icon: 'trending' },
    { id: 'creditrisk', label: 'Credit Risk & CVA', icon: 'shield' },
    { id: 'ldi', label: 'LDI Immunization', icon: 'scale' }
  ];

  return (
    <>
      {createPortal(
        <>
          {ultimateTabs.map(tab => {
            const exists = navContainer.querySelector(`[data-ultimate-tab="${tab.id}"]`);
            if (exists) return null;

            return (
              <button
                key={tab.id}
                data-ultimate-tab={tab.id}
                onClick={() => handleCustomTabClick(tab.id)}
                className="flex items-center gap-2 px-4 py-3 text-xs font-bold uppercase tracking-wider border-b-2 border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-800 transition-all duration-200"
              >
                <Icon name={tab.icon as any} className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </>,
        navContainer
      )}

      {activeTab && createPortal(
        <div data-ultimate-content="true" className="space-y-6 animate-fadeIn">
          {activeTab === 'heston' && <HestonSimulationView />}
          {activeTab === 'creditrisk' && <CreditRiskDashboardView />}
          {activeTab === 'ldi' && <LDIImmunizationView />}
        </div>,
        mainContainer
      )}
    </>
  );
};

if (typeof window !== 'undefined') {
  const mountUltimateExtension = () => {
    const id = 'quantum-core-ultimate-extension-root';
    if (document.getElementById(id)) return;

    const root = document.createElement('div');
    root.id = id;
    document.body.appendChild(root);

    import('react-dom').then(({ render }) => {
      render(
        <AppProvider>
          <UltimateEnterpriseSuiteExtension />
        </AppProvider>,
        root
      );
    }).catch(err => console.error('Failed to load React-DOM for ultimate extension:', err));
  };

  if (document.readyState === 'complete') {
    mountUltimateExtension();
  } else {
    window.addEventListener('load', mountUltimateExtension);
  }
}// ============================================================================
// 36. SYSTEMIC RISK & NETWORK CONTAGION SIMULATOR (DEBTRANK)
// ============================================================================

export interface FinancialInstitution {
  id: string;
  name: string;
  externalAssets: number; // $B
  interbankAssets: number; // $B
  externalLiabilities: number; // $B
  interbankLiabilities: number; // $B
  capital: number; // Equity ($B)
  state: 'active' | 'stressed' | 'defaulted';
  relativeLoss: number; // h_i in [0, 1]
}

export interface InterbankExposure {
  creditorId: string; // Lender
  debtorId: string; // Borrower
  amount: number; // $B
}

export interface ContagionStepResult {
  step: number;
  institutions: FinancialInstitution[];
  systemicLoss: number; // Total capital lost in the system ($B)
  activeDefaults: string[];
}

/**
 * Simulates systemic risk propagation across a network of financial institutions
 * using the feedback-loop DebtRank algorithm (Battiston et al., 2012).
 */
export const runDebtRankSimulation = (
  nodes: FinancialInstitution[],
  links: InterbankExposure[],
  shockedNodeId: string,
  initialShockPct: number // e.g., 0.50 for 50% loss of capital
): ContagionStepResult[] => {
  const N = nodes.length;
  const steps: ContagionStepResult[] = [];

  // Deep copy institutions to track state over steps
  let currentNodes: FinancialInstitution[] = nodes.map((node) => ({
    ...node,
    relativeLoss: node.id === shockedNodeId ? initialShockPct : 0,
    state: node.id === shockedNodeId ? (initialShockPct >= 1.0 ? 'defaulted' : 'stressed') : 'active'
  }));

  // Construct exposure matrix: W[i][j] is the exposure of i to j (i lent to j)
  const W: Record<string, Record<string, number>> = {};
  nodes.forEach((n1) => {
    W[n1.id] = {};
    nodes.forEach((n2) => {
      W[n1.id][n2.id] = 0;
    });
  });

  links.forEach((link) => {
    if (W[link.creditorId] && W[link.creditorId][link.debtorId] !== undefined) {
      W[link.creditorId][link.debtorId] = link.amount;
    }
  });

  // Step 0: Initial State
  let totalCapital0 = nodes.reduce((sum, n) => sum + n.capital, 0);
  let systemicLoss0 = currentNodes.reduce((sum, n) => sum + n.relativeLoss * n.capital, 0);
  steps.push({
    step: 0,
    institutions: currentNodes.map(n => ({ ...n })),
    systemicLoss: systemicLoss0,
    activeDefaults: currentNodes.filter(n => n.state === 'defaulted').map(n => n.id)
  });

  let converged = false;
  let currentStep = 1;
  const maxSteps = 20;

  // Track relative loss from previous step to compute marginal shock propagation
  let prevLosses = currentNodes.map(n => n.relativeLoss);

  while (!converged && currentStep < maxSteps) {
    const nextNodes = currentNodes.map(n => ({ ...n }));
    const nextLosses = [...prevLosses];
    let changed = false;

    for (let i = 0; i < N; i++) {
      const creditor = currentNodes[i];
      if (creditor.state === 'defaulted') continue;

      // Calculate incoming shock from all debtors j
      let capitalLoss = 0;
      for (let j = 0; j < N; j++) {
        if (i === j) continue;
        const debtor = currentNodes[j];
        const exposure = W[creditor.id][debtor.id];

        // Marginal increase in debtor's distress propagates to creditor
        const marginalDistress = debtor.relativeLoss - prevLosses[j];
        if (marginalDistress > 0) {
          capitalLoss += exposure * marginalDistress;
        }
      }

      if (capitalLoss > 0) {
        const newRelativeLoss = Math.min(1.0, creditor.relativeLoss + (capitalLoss / creditor.capital));
        if (newRelativeLoss > creditor.relativeLoss) {
          nextNodes[i].relativeLoss = newRelativeLoss;
          nextNodes[i].state = newRelativeLoss >= 1.0 ? 'defaulted' : 'stressed';
          nextLosses[i] = newRelativeLoss;
          changed = true;
        }
      }
    }

    if (!changed) {
      converged = true;
    } else {
      currentNodes = nextNodes;
      prevLosses = nextLosses;
      const systemicLoss = currentNodes.reduce((sum, n) => sum + n.relativeLoss * n.capital, 0);
      steps.push({
        step: currentStep,
        institutions: currentNodes.map(n => ({ ...n })),
        systemicLoss,
        activeDefaults: currentNodes.filter(n => n.state === 'defaulted').map(n => n.id)
      });
      currentStep++;
    }
  }

  return steps;
};

// ============================================================================
// 37. INTERACTIVE SYSTEMIC RISK & NETWORK CONTAGION VIEW
// ============================================================================

export const SystemicRiskContagionView: React.FC = () => {
  const initialInstitutions: FinancialInstitution[] = [
    { id: 'G-SIB1', name: 'Apex Global Bank', externalAssets: 800, interbankAssets: 200, externalLiabilities: 750, interbankLiabilities: 180, capital: 70, state: 'active', relativeLoss: 0 },
    { id: 'G-SIB2', name: 'Meridian Trust', externalAssets: 600, interbankAssets: 150, externalLiabilities: 560, interbankLiabilities: 140, capital: 50, state: 'active', relativeLoss: 0 },
    { id: 'G-SIB3', name: 'Summit Capital', externalAssets: 500, interbankAssets: 120, externalLiabilities: 470, interbankLiabilities: 110, capital: 40, state: 'active', relativeLoss: 0 },
    { id: 'G-SIB4', name: 'Vanguard Credit', externalAssets: 400, interbankAssets: 100, externalLiabilities: 375, interbankLiabilities: 95, capital: 30, state: 'active', relativeLoss: 0 },
    { id: 'G-SIB5', name: 'Horizon Bancorp', externalAssets: 300, interbankAssets: 80, externalLiabilities: 280, interbankLiabilities: 75, capital: 25, state: 'active', relativeLoss: 0 }
  ];

  const initialExposures: InterbankExposure[] = [
    { creditorId: 'G-SIB1', debtorId: 'G-SIB2', amount: 45 },
    { creditorId: 'G-SIB1', debtorId: 'G-SIB3', amount: 30 },
    { creditorId: 'G-SIB2', debtorId: 'G-SIB1', amount: 40 },
    { creditorId: 'G-SIB2', debtorId: 'G-SIB4', amount: 25 },
    { creditorId: 'G-SIB3', debtorId: 'G-SIB2', amount: 35 },
    { creditorId: 'G-SIB3', debtorId: 'G-SIB5', amount: 20 },
    { creditorId: 'G-SIB4', debtorId: 'G-SIB1', amount: 15 },
    { creditorId: 'G-SIB4', debtorId: 'G-SIB3', amount: 25 },
    { creditorId: 'G-SIB5', debtorId: 'G-SIB4', amount: 30 }
  ];

  const [shockedNode, setShockedNode] = useState<string>('G-SIB1');
  const [shockPct, setShockPct] = useState<number>(100); // Default 100% capital write-down
  const [simulationSteps, setSimulationSteps] = useState<ContagionStepResult[]>([]);
  const [currentStepIdx, setCurrentStepIdx] = useState<number>(0);

  const executeContagion = useCallback(() => {
    const results = runDebtRankSimulation(initialInstitutions, initialExposures, shockedNode, shockPct / 100);
    setSimulationSteps(results);
    setCurrentStepIdx(results.length - 1); // Show final converged state by default
  }, [shockedNode, shockPct]);

  useEffect(() => {
    executeContagion();
  }, [shockedNode, shockPct]);

  const activeStep = simulationSteps[currentStepIdx];
  const totalSystemicLoss = activeStep ? activeStep.systemicLoss : 0;
  const totalInitialCapital = initialInstitutions.reduce((sum, inst) => sum + inst.capital, 0);
  const systemicLossPct = (totalSystemicLoss / totalInitialCapital) * 100;

  // SVG coordinates for network visualization (circular layout)
  const width = 500;
  const height = 350;
  const centerX = width / 2;
  const centerY = height / 2;
  const radius = 120;

  const getNodeCoords = (index: number, total: number) => {
    const angle = (index / total) * 2 * Math.PI - Math.PI / 2;
    return {
      x: centerX + radius * Math.cos(angle),
      y: centerY + radius * Math.sin(angle)
    };
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Left: Contagion Parameters */}
      <div className="lg:col-span-4 space-y-6">
        <Card>
          <CardHeader>
            <h3 className="text-base font-bold text-slate-200">Contagion Parameters</h3>
          </CardHeader>
          <CardBody className="space-y-5">
            <Select
              label="Trigger Institution (Shock Source)"
              value={shockedNode}
              onChange={(e) => setShockedNode(e.target.value)}
              options={initialInstitutions.map(inst => ({ value: inst.id, label: inst.name }))}
            />

            <Slider
              label="Initial Capital Write-down"
              min={10}
              max={100}
              step={5}
              value={shockPct}
              suffix="%"
              onChange={setShockPct}
              helperText="The percentage of capital lost by the trigger institution at step 0."
            />

            {simulationSteps.length > 1 && (
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Contagion Step: {currentStepIdx} / {simulationSteps.length - 1}
                </label>
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={currentStepIdx === 0}
                    onClick={() => setCurrentStepIdx(prev => Math.max(0, prev - 1))}
                  >
                    Prev
                  </Button>
                  <input
                    type="range"
                    min={0}
                    max={simulationSteps.length - 1}
                    value={currentStepIdx}
                    onChange={(e) => setCurrentStepIdx(Number(e.target.value))}
                    className="flex-grow h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
                  />
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={currentStepIdx === simulationSteps.length - 1}
                    onClick={() => setCurrentStepIdx(prev => Math.min(simulationSteps.length - 1, prev + 1))}
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </CardBody>
        </Card>

        {/* Systemic Impact KPIs */}
        <div className="grid grid-cols-2 gap-4">
          <Card>
            <CardBody className="space-y-1 text-center">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Systemic Capital Loss</span>
              <div className="text-xl font-black text-red-400 font-mono">
                ${totalSystemicLoss.toFixed(1)}B
              </div>
              <p className="text-[9px] text-slate-500">Total equity destroyed.</p>
            </CardBody>
          </Card>

          <Card>
            <CardBody className="space-y-1 text-center">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Systemic Vulnerability</span>
              <div className="text-xl font-black text-amber-500 font-mono">
                {systemicLossPct.toFixed(1)}%
              </div>
              <p className="text-[9px] text-slate-500">Proportion of total capital.</p>
            </CardBody>
          </Card>
        </div>
      </div>

      {/* Right: Network Contagion Graph */}
      <div className="lg:col-span-8 space-y-6">
        <Card>
          <CardHeader>
            <div>
              <h3 className="text-base font-bold text-slate-200">Interbank Exposure Network</h3>
              <p className="text-xs text-slate-500">Visualizing systemic shock propagation and cascading defaults.</p>
            </div>
            {activeStep && (
              <Badge color={activeStep.activeDefaults.length > 0 ? 'red' : 'green'}>
                Defaults: {activeStep.activeDefaults.length}
              </Badge>
            )}
          </CardHeader>
          <CardBody className="space-y-6">
            {activeStep ? (
              <div className="relative overflow-hidden bg-slate-950/40 border border-slate-800/80 rounded-xl p-4">
                <svg viewBox={`0 0 ${width} ${height}`} width="100%" height={height} className="overflow-visible">
                  {/* Draw Interbank Exposure Links */}
                  {initialExposures.map((link, idx) => {
                    const creditorIdx = initialInstitutions.findIndex(inst => inst.id === link.creditorId);
                    const debtorIdx = initialInstitutions.findIndex(inst => inst.id === link.debtorId);
                    if (creditorIdx === -1 || debtorIdx === -1) return null;

                    const start = getNodeCoords(creditorIdx, initialInstitutions.length);
                    const end = getNodeCoords(debtorIdx, initialInstitutions.length);

                    // Determine link color based on debtor's distress
                    const debtorNode = activeStep.institutions[debtorIdx];
                    const strokeColor = debtorNode.relativeLoss > 0.8 ? 'rgba(239, 68, 68, 0.6)' : debtorNode.relativeLoss > 0.2 ? 'rgba(245, 158, 11, 0.4)' : 'rgba(148, 163, 184, 0.15)';
                    const strokeWidth = Math.max(1, (link.amount / 10));

                    return (
                      <g key={idx}>
                        <line
                          x1={start.x}
                          y1={start.y}
                          x2={end.x}
                          y2={end.y}
                          stroke={strokeColor}
                          strokeWidth={strokeWidth}
                        />
                        {/* Arrowhead indicator */}
                        <circle
                          cx={end.x - (end.x - start.x) * 0.15}
                          cy={end.y - (end.y - start.y) * 0.15}
                          r="3"
                          fill={strokeColor}
                        />
                      </g>
                    );
                  })}

                  {/* Draw Institution Nodes */}
                  {activeStep.institutions.map((inst, idx) => {
                    const coords = getNodeCoords(idx, activeStep.institutions.length);
                    const nodeColor = inst.state === 'defaulted' ? '#ef4444' : inst.state === 'stressed' ? '#f59e0b' : '#3b82f6';
                    const pulseClass = inst.state === 'stressed' ? 'animate-pulse' : '';

                    return (
                      <g key={inst.id} className="cursor-pointer">
                        {/* Outer glow ring representing capital loss */}
                        <circle
                          cx={coords.x}
                          cy={coords.y}
                          r="24"
                          fill="none"
                          stroke={nodeColor}
                          strokeWidth="2"
                          strokeDasharray={`${inst.relativeLoss * 150} 150`}
                          className={pulseClass}
                        />
                        {/* Inner solid node */}
                        <circle
                          cx={coords.x}
                          cy={coords.y}
                          r="18"
                          fill="#0f172a"
                          stroke={nodeColor}
                          strokeWidth="3"
                        />
                        {/* Label */}
                        <text
                          x={coords.x}
                          y={coords.y + 4}
                          fill="#f1f5f9"
                          fontSize="8"
                          fontWeight="bold"
                          textAnchor="middle"
                        >
                          {inst.id}
                        </text>
                        {/* Hover tooltip text */}
                        <text
                          x={coords.x}
                          y={coords.y - 28}
                          fill="#94a3b8"
                          fontSize="8"
                          fontFamily="monospace"
                          textAnchor="middle"
                        >
                          Loss: {(inst.relativeLoss * 100).toFixed(0)}%
                        </text>
                      </g>
                    );
                  })}
                </svg>
              </div>
            ) : (
              <div className="p-12 text-center text-slate-500">
                Awaiting contagion execution...
              </div>
            )}
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

// ============================================================================
// 38. DYNAMIC HEDGING & DELTA-GAMMA PORTFOLIO IMMUNIZATION ENGINE
// ============================================================================

export interface HedgingStepResult {
  day: number;
  underlyingPrice: number;
  portfolioValue: number;
  deltaHedgeUnits: number;
  gammaHedgeUnits: number;
  transactionCosts: number;
  trackingError: number;
  deltaExposure: number;
  gammaExposure: number;
}

/**
 * Simulates a dynamic Delta-Gamma hedging strategy over a 30-day horizon.
 * Rebalances a portfolio containing a short option position, underlying assets,
 * and a secondary option to immunize both delta and gamma exposures.
 */
export const simulateDeltaGammaHedging = (
  initialPrice: number,
  volatility: number,
  riskFreeRate: number,
  strikePrice: number,
  rebalanceFrequency: 'daily' | 'weekly',
  transactionCostPct: number = 0.001 // 10 bps
): HedgingStepResult[] => {
  const steps = 30;
  const dt = 1 / 365; // Daily step size
  const results: HedgingStepResult[] = [];

  let currentPrice = initialPrice;
  let portfolioValue = 0;
  let deltaHedgeUnits = 0;
  let gammaHedgeUnits = 0;
  let cumulativeCosts = 0;

  // Target option to hedge: Short 1,000 Call Options with 30 days to maturity
  const targetOptionQty = -1000;
  const targetStrike = strikePrice;
  let targetT = 30 * dt;

  // Hedging instrument: Call Option with 60 days to maturity
  const hedgeStrike = strikePrice * 1.05; // 5% OTM
  let hedgeT = 60 * dt;

  for (let day = 0; day <= steps; day++) {
    const currentTargetT = Math.max(0.0001, targetT - day * dt);
    const currentHedgeT = Math.max(0.0001, hedgeT - day * dt);

    // Calculate Greeks for target option
    const targetBS = calculateBlackScholes(currentPrice, targetStrike, currentTargetT, riskFreeRate, volatility, 'call');
    const targetDelta = targetBS.delta * targetOptionQty;
    const targetGamma = targetBS.gamma * targetOptionQty;

    // Calculate Greeks for hedging option
    const hedgeBS = calculateBlackScholes(currentPrice, hedgeStrike, currentHedgeT, riskFreeRate, volatility, 'call');
    const hedgeDelta = hedgeBS.delta;
    const hedgeGamma = hedgeBS.gamma;

    // Rebalancing logic
    const shouldRebalance = rebalanceFrequency === 'daily' || day % 5 === 0 || day === 0;

    if (shouldRebalance) {
      // Gamma Neutrality: targetGamma + gammaHedgeUnits * hedgeGamma = 0
      const nextGammaHedgeUnits = hedgeGamma > 0 ? -targetGamma / hedgeGamma : 0;

      // Delta Neutrality: targetDelta + gammaHedgeUnits * hedgeDelta + deltaHedgeUnits = 0
      const nextDeltaHedgeUnits = -(targetDelta + nextGammaHedgeUnits * hedgeDelta);

      // Calculate transaction costs
      const deltaTrade = Math.abs(nextDeltaHedgeUnits - deltaHedgeUnits);
      const gammaTrade = Math.abs(nextGammaHedgeUnits - gammaHedgeUnits);
      const cost = (deltaTrade * currentPrice + gammaTrade * hedgeBS.price) * transactionCostPct;

      cumulativeCosts += cost;
      deltaHedgeUnits = nextDeltaHedgeUnits;
      gammaHedgeUnits = nextGammaHedgeUnits;
    }

    // Portfolio Value: Short Option + Delta Hedge + Gamma Hedge - Cumulative Costs
    portfolioValue = (targetBS.price * targetOptionQty) + 
                     (deltaHedgeUnits * currentPrice) + 
                     (gammaHedgeUnits * hedgeBS.price) - 
                     cumulativeCosts;

    // Tracking Error: Deviation from initial portfolio value (ideally zero for perfect hedge)
    const trackingError = portfolioValue;

    // Residual exposures
    const deltaExposure = targetDelta + (gammaHedgeUnits * hedgeDelta) + deltaHedgeUnits;
    const gammaExposure = targetGamma + (gammaHedgeUnits * hedgeGamma);

    results.push({
      day,
      underlyingPrice: currentPrice,
      portfolioValue,
      deltaHedgeUnits,
      gammaHedgeUnits,
      transactionCosts: cumulativeCosts,
      trackingError,
      deltaExposure,
      gammaExposure
    });

    // Evolve underlying price using stochastic GBM step
    if (day < steps) {
      const { z0 } = boxMullerTransform();
      const exponent = (riskFreeRate - 0.5 * volatility * volatility) * dt + volatility * z0 * Math.sqrt(dt);
      currentPrice = currentPrice * Math.exp(exponent);
    }
  }

  return results;
};

// ============================================================================
// 39. INTERACTIVE DYNAMIC HEDGING SIMULATOR VIEW
// ============================================================================

export const DynamicHedgingSimulatorView: React.FC = () => {
  const { state } = useApp();
  const activeScenario = state.scenarios.find(s => s.id === state.activeScenarioId) || state.scenarios[0];

  const [frequency, setFrequency] = useState<'daily' | 'weekly'>('daily');
  const [costPct, setCostPct] = useState<number>(10); // bps
  const [strike, setStrike] = useState<number>(100);

  const hedgingResults = useMemo(() => {
    return simulateDeltaGammaHedging(
      activeScenario.baseValue,
      activeScenario.volatility / 100,
      activeScenario.riskFreeRate / 100,
      strike,
      frequency,
      costPct / 10000
    );
  }, [activeScenario, frequency, costPct, strike]);

  // SVG coordinates mapping
  const padding = { top: 20, right: 30, bottom: 30, left: 50 };
  const width = 500;
  const height = 220;

  const trackingErrors = hedgingResults.map(r => r.trackingError);
  const maxError = Math.max(...trackingErrors) * 1.1;
  const minError = Math.min(...trackingErrors) * 1.1;
  const errorRange = maxError - minError;

  const getX = (day: number) => padding.left + (day / 30) * (width - padding.left - padding.right);
  const getY = (val: number) => padding.top + height - padding.bottom - ((val - minError) / errorRange) * (height - padding.top - padding.bottom);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Left: Hedging Parameters */}
      <div className="lg:col-span-4 space-y-6">
        <Card>
          <CardHeader>
            <h3 className="text-base font-bold text-slate-200">Hedging Parameters</h3>
          </CardHeader>
          <CardBody className="space-y-5">
            <Select
              label="Rebalancing Frequency"
              value={frequency}
              onChange={(e) => setFrequency(e.target.value as any)}
              options={[
                { value: 'daily', label: 'Daily Rebalancing' },
                { value: 'weekly', label: 'Weekly Rebalancing' }
              ]}
            />

            <Slider
              label="Transaction Cost (bps)"
              min={0}
              max={50}
              step={5}
              value={costPct}
              suffix=" bps"
              onChange={setCostPct}
              helperText="Brokerage and slippage costs per trade."
            />

            <Slider
              label="Option Strike Price"
              min={50}
              max={150}
              step={5}
              value={strike}
              suffix=""
              onChange={setStrike}
              helperText="Strike price of the short call option position."
            />
          </CardBody>
        </Card>

        {/* Hedging Performance KPIs */}
        <div className="grid grid-cols-2 gap-4">
          <Card>
            <CardBody className="space-y-1 text-center">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Total Hedging Cost</span>
              <div className="text-xl font-black text-red-400 font-mono">
                ${hedgingResults[30].transactionCosts.toFixed(3)}M
              </div>
              <p className="text-[9px] text-slate-500">Cumulative slippage.</p>
            </CardBody>
          </Card>

          <Card>
            <CardBody className="space-y-1 text-center">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Max Tracking Error</span>
              <div className="text-xl font-black text-amber-500 font-mono">
                ${Math.max(...hedgingResults.map(r => Math.abs(r.trackingError))).toFixed(2)}M
              </div>
              <p className="text-[9px] text-slate-500">Peak portfolio variance.</p>
            </CardBody>
          </Card>
        </div>
      </div>

      {/* Right: Tracking Error Chart */}
      <div className="lg:col-span-8 space-y-6">
        <Card>
          <CardHeader>
            <div>
              <h3 className="text-base font-bold text-slate-200">Delta-Gamma Tracking Error</h3>
              <p className="text-xs text-slate-500">Daily pro-forma portfolio value deviation from zero.</p>
            </div>
            <Badge color={Math.abs(hedgingResults[30].trackingError) < 5 ? 'green' : 'red'}>
              Terminal Error: ${hedgingResults[30].trackingError.toFixed(2)}M
            </Badge>
          </CardHeader>
          <CardBody className="space-y-6">
            {/* SVG Line Chart */}
            <div className="relative overflow-hidden bg-slate-950/40 border border-slate-800/80 rounded-xl p-4">
              <svg viewBox={`0 0 ${width} ${height}`} width="100%" height={height} className="overflow-visible">
                {/* Zero Line */}
                <line
                  x1={padding.left}
                  y1={getY(0)}
                  x2={width - padding.right}
                  y2={getY(0)}
                  stroke="rgba(148, 163, 184, 0.3)"
                  strokeWidth="1.5"
                  strokeDasharray="4 4"
                />

                {/* Grid Lines */}
                {[0, 0.5, 1].map((tick, i) => (
                  <line
                    key={i}
                    x1={padding.left}
                    y1={padding.top + (height - padding.top - padding.bottom) * tick}
                    x2={width - padding.right}
                    y2={padding.top + (height - padding.top - padding.bottom) * tick}
                    stroke="#1e293b"
                    strokeWidth="1"
                    strokeDasharray="4 4"
                    className="opacity-20"
                  />
                ))}

                {/* Tracking Error Path */}
                <path
                  d={hedgingResults
                    .map((r) => `${r.day === 0 ? 'M' : 'L'} ${getX(r.day)} ${getY(r.trackingError)}`)
                    .join(' ')}
                  fill="none"
                  stroke="#3b82f6"
                  strokeWidth="3"
                />

                {/* Data Points */}
                {hedgingResults.map((r, idx) => (
                  <circle
                    key={idx}
                    cx={getX(r.day)}
                    cy={getY(r.trackingError)}
                    r="3.5"
                    fill="#3b82f6"
                    stroke="#0f172a"
                    strokeWidth="1.5"
                  />
                ))}

                {/* Axis Labels */}
                <text x={padding.left} y={height - 5} fill="#64748b" fontSize="9" fontFamily="monospace">
                  Day 0
                </text>
                <text x={width - padding.right} y={height - 5} fill="#64748b" fontSize="9" fontFamily="monospace" textAnchor="end">
                  Day 30
                </text>
              </svg>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

// ============================================================================
// 40. FINAL MASTER INTEGRATION & SELF-MOUNTING ORCHESTRATOR
// ============================================================================

/**
 * Master Runtime Extension Component.
 * Dynamically registers all advanced views (v1, v2, v3, and v4 extensions)
 * into the existing navigation bar and main content router.
 */
export const MasterEnterpriseSuiteExtension: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string | null>(null);
  const [navContainer, setNavContainer] = useState<Element | null>(null);
  const [mainContainer, setMainContainer] = useState<Element | null>(null);

  useEffect(() => {
    const findContainers = () => {
      const nav = document.querySelector('nav.flex.flex-wrap');
      const main = document.querySelector('main.relative');
      if (nav && main) {
        setNavContainer(nav);
        setMainContainer(main);
      }
    };

    findContainers();
    const observer = new MutationObserver(() => findContainers());
    observer.observe(document.body, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!navContainer) return;

    const handleOriginalTabClick = (e: Event) => {
      const target = e.currentTarget as HTMLElement;
      if (target.getAttribute('data-master-tab')) return;
      
      setActiveTab(null);
      
      const originalTabs = navContainer.querySelectorAll('button:not([data-master-tab])');
      originalTabs.forEach(tab => {
        tab.classList.remove('border-transparent', 'text-slate-400');
        tab.classList.add('border-blue-500', 'text-blue-400', 'bg-blue-950/10');
      });

      const customTabs = navContainer.querySelectorAll('button[data-master-tab]');
      customTabs.forEach(tab => {
        tab.classList.remove('border-blue-500', 'text-blue-400', 'bg-blue-950/10');
        tab.classList.add('border-transparent', 'text-slate-400');
      });
    };

    const originalButtons = navContainer.querySelectorAll('button:not([data-master-tab])');
    originalButtons.forEach(btn => btn.addEventListener('click', handleOriginalTabClick));

    return () => {
      originalButtons.forEach(btn => btn.removeEventListener('click', handleOriginalTabClick));
    };
  }, [navContainer]);

  useEffect(() => {
    if (!mainContainer) return;
    const originalChildren = Array.from(mainContainer.children) as HTMLElement[];
    
    if (activeTab) {
      originalChildren.forEach(child => {
        if (!child.getAttribute('data-master-content')) {
          child.style.display = 'none';
        }
      });
    } else {
      originalChildren.forEach(child => {
        child.style.display = '';
      });
    }
  }, [activeTab, mainContainer]);

  const handleCustomTabClick = (tabId: string) => {
    setActiveTab(tabId);

    if (!navContainer) return;

    const originalTabs = navContainer.querySelectorAll('button:not([data-master-tab])');
    originalTabs.forEach(tab => {
      tab.classList.remove('border-blue-500', 'text-blue-400', 'bg-blue-950/10');
      tab.classList.add('border-transparent', 'text-slate-400');
    });

    const customTabs = navContainer.querySelectorAll('button[data-master-tab]');
    customTabs.forEach(tab => {
      const id = tab.getAttribute('data-master-tab');
      if (id === tabId) {
        tab.classList.remove('border-transparent', 'text-slate-400');
        tab.classList.add('border-blue-500', 'text-blue-400', 'bg-blue-950/10');
      } else {
        tab.classList.remove('border-blue-500', 'text-blue-400', 'bg-blue-950/10');
        tab.classList.add('border-transparent', 'text-slate-400');
      }
    });
  };

  if (!navContainer || !mainContainer) return null;

  const masterTabs = [
    { id: 'contagion', label: 'Network Contagion', icon: 'shield' },
    { id: 'hedging', label: 'Delta-Gamma Hedge', icon: 'trending' }
  ];

  return (
    <>
      {createPortal(
        <>
          {masterTabs.map(tab => {
            const exists = navContainer.querySelector(`[data-master-tab="${tab.id}"]`);
            if (exists) return null;

            return (
              <button
                key={tab.id}
                data-master-tab={tab.id}
                onClick={() => handleCustomTabClick(tab.id)}
                className="flex items-center gap-2 px-4 py-3 text-xs font-bold uppercase tracking-wider border-b-2 border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-800 transition-all duration-200"
              >
                <Icon name={tab.icon as any} className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </>,
        navContainer
      )}

      {activeTab && createPortal(
        <div data-master-content="true" className="space-y-6 animate-fadeIn">
          {activeTab === 'contagion' && <SystemicRiskContagionView />}
          {activeTab === 'hedging' && <DynamicHedgingSimulatorView />}
        </div>,
        mainContainer
      )}
    </>
  );
};

if (typeof window !== 'undefined') {
  const mountMasterExtension = () => {
    const id = 'quantum-core-master-extension-root';
    if (document.getElementById(id)) return;

    const root = document.createElement('div');
    root.id = id;
    document.body.appendChild(root);

    import('react-dom').then(({ render }) => {
      render(
        <AppProvider>
          <MasterEnterpriseSuiteExtension />
        </AppProvider>,
        root
      );
    }).catch(err => console.error('Failed to load React-DOM for master extension:', err));
  };

  if (document.readyState === 'complete') {
    mountMasterExtension();
  } else {
    window.addEventListener('load', mountMasterExtension);
  }
}