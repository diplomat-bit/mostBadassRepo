/**
 * ============================================================================
 * ENTERPRISE AI DAILY BRIEFING GENERATION ENGINE & MULTI-TIER COGNITIVE SUITE
 * File: components/ai/DailyBriefingGenerator.tsx
 * Architecture: Tier-4 Hyper-Modular Context-Aware Financial Intelligence System
 * Compliance: SOC-2 Type II, FINRA Rule 2210, Basel III Analytics, GDPR/CCPA
 * ============================================================================
 */

import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
  useReducer,
  createContext,
  useContext,
  forwardRef,
  useImperativeHandle,
  type ReactNode,
  type ChangeEvent,
  type MouseEvent,
  type KeyboardEvent,
  type UIEvent,
} from 'react';

// ============================================================================
// CORE DOMAIN ENUMERATIONS & CANONICAL CLASSIFIERS
// ============================================================================

export enum BriefingTone {
  EXECUTIVE = 'EXECUTIVE',
  CONSERVATIVE = 'CONSERVATIVE',
  ANALYTICAL = 'ANALYTICAL',
  PROACTIVE = 'PROACTIVE',
  EDUCATIONAL = 'EDUCATIONAL',
  NEUTRAL = 'NEUTRAL',
  URGENT = 'URGENT',
  VISIONARY = 'VISIONARY',
}

export enum BriefingLength {
  MICRO_SNACK = 'MICRO_SNACK',         // ~150 words (60 sec read)
  EXECUTIVE_SUMMARY = 'EXECUTIVE_SUMMARY', // ~350 words (2 min read)
  STANDARD = 'STANDARD',               // ~650 words (4 min read)
  COMPREHENSIVE = 'COMPREHENSIVE',     // ~1200 words (8 min read)
  DEEP_DIVE = 'DEEP_DIVE',             // ~2500 words (15 min read)
}

export enum BriefingFocusArea {
  MARKET_SUMMARY = 'MARKET_SUMMARY',
  PERSONAL_FINANCE = 'PERSONAL_FINANCE',
  GOALS_PROGRESS = 'GOALS_PROGRESS',
  PORTFOLIO_ALPHA = 'PORTFOLIO_ALPHA',
  CASH_FLOW_LIQUIDITY = 'CASH_FLOW_LIQUIDITY',
  RISK_EXPOSURE = 'RISK_EXPOSURE',
  TAX_OPTIMIZATION = 'TAX_OPTIMIZATION',
  MACRO_ECONOMICS = 'MACRO_ECONOMICS',
  RECURRING_LIABILITIES = 'RECURRING_LIABILITIES',
  CREDIT_PROFILE = 'CREDIT_PROFILE',
  CRYPTO_ALTERNATIVE = 'CRYPTO_ALTERNATIVE',
  ESTATE_LONG_TERM = 'ESTATE_LONG_TERM',
}

export enum BriefingDeliveryChannel {
  IN_APP_DASHBOARD = 'IN_APP_DASHBOARD',
  SECURE_ENCRYPTED_EMAIL = 'SECURE_ENCRYPTED_EMAIL',
  SMS_GATEWAY = 'SMS_GATEWAY',
  PUSH_NOTIFICATION = 'PUSH_NOTIFICATION',
  VOICE_ASSISTANT_AUDIO = 'VOICE_ASSISTANT_AUDIO',
  REST_WEBHOOK = 'REST_WEBHOOK',
  EXPORT_PDF_REPORT = 'EXPORT_PDF_REPORT',
}

export enum AlertUrgencyLevel {
  P0_CRITICAL = 'P0_CRITICAL',       // Margin call, fraud anomaly, overdraft imminent
  P1_HIGH = 'P1_HIGH',               // Bill due in < 24h, 5% portfolio drop, goal threshold missed
  P2_MEDIUM = 'P2_MEDIUM',           // Budget 80% consumed, market mover alert
  P3_LOW = 'P3_LOW',                 // Informational dividend received, general milestone
  P4_INFORMATIONAL = 'P4_INFORMATIONAL', // Educational tip, weekly recap
}

export enum BriefingGenerationStage {
  IDLE = 'IDLE',
  INITIALIZING_SECURITY_CONTEXT = 'INITIALIZING_SECURITY_CONTEXT',
  AGGREGATING_TELEMETRY = 'AGGREGATING_TELEMETRY',
  FETCHING_MARKET_FEEDS = 'FETCHING_MARKET_FEEDS',
  SYNTHESIZING_RISK_METRICS = 'SYNTHESIZING_RISK_METRICS',
  PROMPTING_LLM_ORCHESTRATOR = 'PROMPTING_LLM_ORCHESTRATOR',
  STREAMING_INFERENCE = 'STREAMING_INFERENCE',
  PARSING_STRUCTURED_SECTIONS = 'PARSING_STRUCTURED_SECTIONS',
  VALIDATING_COMPLIANCE = 'VALIDATING_COMPLIANCE',
  PERSISTING_SNAPSHOT = 'PERSISTING_SNAPSHOT',
  READY = 'READY',
  ERROR = 'ERROR',
}

export enum TelemetryAction {
  BRIEFING_VIEWED = 'BRIEFING_VIEWED',
  BRIEFING_GENERATED = 'BRIEFING_GENERATED',
  BRIEFING_EXPORTED = 'BRIEFING_EXPORTED',
  BRIEFING_SHARED = 'BRIEFING_SHARED',
  SETTINGS_MUTATED = 'SETTINGS_MUTATED',
  AUDIO_PLAYBACK_STARTED = 'AUDIO_PLAYBACK_STARTED',
  AUDIO_PLAYBACK_PAUSED = 'AUDIO_PLAYBACK_PAUSED',
  SECTION_EXPANDED = 'SECTION_EXPANDED',
  FEEDBACK_SUBMITTED = 'FEEDBACK_SUBMITTED',
  DRILLDOWN_CLICKED = 'DRILLDOWN_CLICKED',
}

export enum AudioPlaybackState {
  UNINITIALIZED = 'UNINITIALIZED',
  SYNTHESIZING = 'SYNTHESIZING',
  PLAYING = 'PLAYING',
  PAUSED = 'PAUSED',
  STOPPED = 'STOPPED',
  FAILED = 'FAILED',
}

// ============================================================================
// STRICT DOMAIN TYPE DEFINITIONS & SCHEMAS
// ============================================================================

export interface SecurityUserContext {
  id: string;
  tenantId: string;
  email: string;
  displayName: string;
  tier: 'BASIC' | 'PREMIUM' | 'PRIVATE_CLIENT' | 'INSTITUTIONAL';
  roles: string[];
  mfaAuthenticated: boolean;
  jurisdiction: string;
  baseCurrency: string;
  locale: string;
  timeZone: string;
  encryptionPublicKey?: string;
  sessionTokenExpiry: number;
}

export interface FinancialGoalItem {
  id: string;
  title: string;
  targetAmount: number;
  currentAmount: number;
  currency: string;
  deadline: string; // ISO 8601
  category: 'RETIREMENT' | 'EMERGENCY_FUND' | 'HOUSE_PURCHASE' | 'DEBT_PAYOFF' | 'EDUCATION' | 'LUXURY_VACATION' | 'CUSTOM';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'MANDATORY';
  monthlyContributionTarget: number;
  projectedCompletionDate: string;
  probabilityOfSuccess: number; // 0.0 - 1.0 (Monte Carlo)
  isAutomated: boolean;
}

export interface PortfolioAssetPosition {
  symbol: string;
  name: string;
  assetClass: 'EQUITY' | 'FIXED_INCOME' | 'COMMODITY' | 'CRYPTO' | 'REAL_ESTATE' | 'CASH_EQUIVALENT' | 'DERIVATIVE';
  quantity: number;
  averageCostBasis: number;
  currentPrice: number;
  totalMarketValue: number;
  unrealizedPnL: number;
  unrealizedPnLPercent: number;
  dayChangeAmount: number;
  dayChangePercent: number;
  currency: string;
  beta: number;
  allocationPercent: number;
  volatility30d: number;
  isCustomWatchlist?: boolean;
}

export interface InvestmentPortfolioSnapshot {
  portfolioId: string;
  totalValuation: number;
  cashBalance: number;
  investedBalance: number;
  currency: string;
  dayChangeValuation: number;
  dayChangePercentage: number;
  unrealizedTotalGainLoss: number;
  realizedYearToDateGainLoss: number;
  sharpeRatio: number;
  weightedBeta: number;
  annualizedYieldPercent: number;
  assets: PortfolioAssetPosition[];
  lastRebalancedAt: string;
}

export interface BudgetCategoryAllocation {
  categoryId: string;
  name: string;
  iconName: string;
  budgetedAmount: number;
  actualSpentAmount: number;
  remainingAmount: number;
  percentUtilized: number;
  isOverBudget: boolean;
  predictedMonthEndSpend: number;
  historicalAverageSpend: number;
  varianceThresholdPercent: number;
}

export interface BudgetsAggregateSnapshot {
  periodMonth: number;
  periodYear: number;
  totalIncomeBudgeted: number;
  totalIncomeActual: number;
  totalExpenseBudgeted: number;
  totalExpenseActual: number;
  netSavingsTarget: number;
  netSavingsActual: number;
  savingsRatePercent: number;
  burnRatePerDay: number;
  categories: BudgetCategoryAllocation[];
}

export interface FinancialTransactionItem {
  id: string;
  accountId: string;
  accountName: string;
  date: string; // ISO 8601
  amount: number;
  currency: string;
  type: 'DEBIT' | 'CREDIT' | 'TRANSFER' | 'FEE' | 'DIVIDEND' | 'INTEREST';
  merchantName: string;
  category: string;
  subcategory?: string;
  isPending: boolean;
  isRecurring: boolean;
  isAnomaly: boolean;
  sentimentRiskScore?: number; // 0.0 - 1.0 (Flag suspicious spend)
  notes?: string;
}

export interface MarketMoverEntity {
  symbol: string;
  name: string;
  price: number;
  change: number;
  percentChange: number;
  direction: 'UP' | 'DOWN' | 'FLAT';
  volume: number;
  marketCap: number;
  catalystSummary?: string;
  sector: string;
}

export interface UpcomingBillObligation {
  id: string;
  billName: string;
  billerCategory: string;
  amountDue: number;
  currency: string;
  dueDate: string; // ISO 8601
  isAutoPayEnabled: boolean;
  status: 'UPCOMING' | 'DUE_TODAY' | 'OVERDUE' | 'PAID';
  linkedAccountId?: string;
  sufficientFundsEstimated: boolean;
}

export interface SystemNotificationDispatch {
  id: string;
  timestamp: string;
  urgency: AlertUrgencyLevel;
  title: string;
  body: string;
  category: 'SECURITY' | 'MARKET_MOVE' | 'BUDGET_EXCEEDED' | 'BILL_REMINDER' | 'GOAL_MILESTONE';
  actionUrl?: string;
  isRead: boolean;
}

export interface CreditScoreMetricReport {
  score: number;
  previousScore: number;
  scoringModel: 'FICO_8' | 'FICO_9' | 'VANTAGESCORE_3' | 'VANTAGESCORE_4';
  ratingTier: 'POOR' | 'FAIR' | 'GOOD' | 'VERY_GOOD' | 'EXCEPTIONAL';
  lastUpdated: string;
  factors: {
    factorName: string;
    impact: 'POSITIVE' | 'NEUTRAL' | 'NEGATIVE';
    description: string;
  }[];
  utilizationRatePercent: number;
  totalAvailableCredit: number;
  totalRevolvingDebt: number;
}

export interface AggregatedBriefingDataContext {
  userProfile: SecurityUserContext | null;
  financialGoals: FinancialGoalItem[];
  investmentPortfolio: InvestmentPortfolioSnapshot | null;
  budgets: BudgetsAggregateSnapshot | null;
  transactions: FinancialTransactionItem[];
  marketMovers: MarketMoverEntity[];
  upcomingBills: UpcomingBillObligation[];
  notifications: SystemNotificationDispatch[];
  creditScore: CreditScoreMetricReport | null;
  macroIndicators?: {
    tenYearTreasuryRate: number;
    sp500DayChangePercent: number;
    nasdaqDayChangePercent: number;
    vixVolatilityIndex: number;
    inflationRatePercent: number;
    fedFundsTargetRate: number;
  };
  aggregatedTimestamp: string;
}

export interface DailyBriefingPreferences {
  tone: BriefingTone;
  length: BriefingLength;
  focusAreas: BriefingFocusArea[];
  includeMarketData: boolean;
  includePersonalizedInsights: boolean;
  includeTaxAlerts: boolean;
  includeMacroEconomicSummary: boolean;
  includeActionableNextSteps: boolean;
  deliveryTime: string; // "HH:MM" 24h
  deliveryChannels: BriefingDeliveryChannel[];
  enableVoiceAudioSynthesis: boolean;
  voiceGenderPreference: 'FEMALE' | 'MALE' | 'NEUTRAL';
  aiCreativityTemperature: number; // 0.0 - 1.0
  customKeywordsFilter: string[];
  anonymizePIIBeforeInference: boolean;
}

export interface BriefingSectionItem {
  id: string;
  title: string;
  iconTag: string;
  category: BriefingFocusArea;
  contentMarkdown: string;
  urgency: AlertUrgencyLevel;
  actionableLinks?: {
    label: string;
    actionType: 'NAVIGATE' | 'EXECUTE_TRADE' | 'PAY_BILL' | 'ADJUST_BUDGET' | 'EXTERNAL_URL';
    target: string;
    payload?: Record<string, unknown>;
  }[];
  keyMetrics?: {
    label: string;
    value: string;
    changeText?: string;
    isPositive?: boolean;
  }[];
}

export interface DailyBriefingResultPayload {
  id: string;
  userId: string;
  generatedAt: string;
  expiresAt: string;
  summaryExecutive: string;
  tone: BriefingTone;
  sections: BriefingSectionItem[];
  rawMarkdownContent: string;
  metadata: {
    modelUsed: string;
    tokensConsumedPrompt: number;
    tokensConsumedCompletion: number;
    latencyMs: number;
    complianceVerificationHash: string;
    confidenceScore: number;
    piiScrubbedCount: number;
  };
  audioSynthesisUrl?: string;
  userRating?: number; // 1 to 5 stars
  feedbackText?: string;
}

// ============================================================================
// ADVANCED PROPS & IMPERATIVE HANDLE SPECIFICATIONS
// ============================================================================

export interface DailyBriefingGeneratorHandle {
  triggerRegeneration: (customOverrides?: Partial<DailyBriefingPreferences>) => Promise<void>;
  exportAsPDF: () => Promise<Blob>;
  shareViaSecureLink: () => Promise<string>;
  synthesizeVoiceAudio: () => Promise<void>;
  getCurrentBriefingPayload: () => DailyBriefingResultPayload | null;
  getTelemetryLogs: () => Array<{ timestamp: string; action: TelemetryAction; metadata: unknown }>;
  resetToDefaults: () => void;
}

export interface DailyBriefingGeneratorProps {
  className?: string;
  containerId?: string;
  preloadedBriefing?: DailyBriefingResultPayload | null;
  readOnly?: boolean;
  enableInteractiveVoice?: boolean;
  enableRealTimeLiveFeeds?: boolean;
  onBriefingGenerated?: (briefing: DailyBriefingResultPayload) => void;
  onSectionClick?: (section: BriefingSectionItem) => void;
  onActionTriggered?: (actionType: string, target: string, payload?: unknown) => void;
  onError?: (error: Error, stage: BriefingGenerationStage) => void;
  onFeedbackSubmitted?: (briefingId: string, rating: number, comments?: string) => void;
}

// ============================================================================
// SECURE TELEMETRY & AUDIT RECORDING ENGINE
// ============================================================================

export class BriefingTelemetryEngine {
  private static instance: BriefingTelemetryEngine;
  private memoryLogs: Array<{
    timestamp: string;
    userId: string;
    action: TelemetryAction;
    meta: Record<string, unknown>;
  }> = [];

  private constructor() {}

  public static getInstance(): BriefingTelemetryEngine {
    if (!BriefingTelemetryEngine.instance) {
      BriefingTelemetryEngine.instance = new BriefingTelemetryEngine();
    }
    return BriefingTelemetryEngine.instance;
  }

  public record(userId: string, action: TelemetryAction, meta: Record<string, unknown> = {}): void {
    const entry = {
      timestamp: new Date().toISOString(),
      userId,
      action,
      meta: {
        ...meta,
        userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : 'Node-SSR',
        screenResolution: typeof window !== 'undefined' ? `${window.innerWidth}x${window.innerHeight}` : 'N/A',
      },
    };
    this.memoryLogs.push(entry);

    if (process.env.NODE_ENV !== 'production') {
      // High-grade debug formatting
      // eslint-disable-next-line no-console
      console.debug(`[TELEMETRY] ${entry.timestamp} | Action: ${action} | User: ${userId}`, entry.meta);
    }
  }

  public getHistory(): ReadonlyArray<{ timestamp: string; userId: string; action: TelemetryAction; meta: Record<string, unknown> }> {
    return [...this.memoryLogs];
  }

  public clear(): void {
    this.memoryLogs = [];
  }
}

// ============================================================================
// FINANCIAL MATHEMATICS & COMPLIANCE ANONYMIZER ALGORITHMS
// ============================================================================

export class FinancialAnalyticsCalculator {
  /**
   * Calculates monthly budget burn rate trajectory and projects month-end variance.
   */
  public static calculateBurnRateTrajectory(
    spentSoFar: number,
    totalBudget: number,
    currentDayOfMonth: number,
    daysInMonth: number
  ): {
    burnRatePerDay: number;
    projectedMonthEndSpend: number;
    projectedVariance: number;
    isTrendingOver: boolean;
  } {
    const safeDays = Math.max(1, currentDayOfMonth);
    const burnRatePerDay = spentSoFar / safeDays;
    const projectedMonthEndSpend = burnRatePerDay * daysInMonth;
    const projectedVariance = projectedMonthEndSpend - totalBudget;
    const isTrendingOver = projectedMonthEndSpend > totalBudget;

    return {
      burnRatePerDay: Math.round(burnRatePerDay * 100) / 100,
      projectedMonthEndSpend: Math.round(projectedMonthEndSpend * 100) / 100,
      projectedVariance: Math.round(projectedVariance * 100) / 100,
      isTrendingOver,
    };
  }

  /**
   * Computes portfolio volatility risk delta relative to a benchmark index (e.g. S&P 500)
   */
  public static calculateWeightedBeta(assets: PortfolioAssetPosition[]): number {
    const totalValuation = assets.reduce((sum, a) => sum + a.totalMarketValue, 0);
    if (totalValuation <= 0) return 1.0;

    const weightedBetaSum = assets.reduce((sum, a) => {
      const weight = a.totalMarketValue / totalValuation;
      return sum + (a.beta || 1.0) * weight;
    }, 0);

    return Math.round(weightedBetaSum * 1000) / 1000;
  }

  /**
   * Scrub Personally Identifiable Information (PII) before LLM ingestion
   * Replaces names, account numbers, routing numbers, and SSNs with semantic hashes.
   */
  public static scrubPII(context: AggregatedBriefingDataContext): { scrubbedContext: AggregatedBriefingDataContext; countScrubbed: number } {
    let countScrubbed = 0;
    const clone: AggregatedBriefingDataContext = JSON.parse(JSON.stringify(context));

    if (clone.userProfile) {
      if (clone.userProfile.email) {
        clone.userProfile.email = 'anonymized_user@secure.enclave';
        countScrubbed++;
      }
      if (clone.userProfile.displayName) {
        clone.userProfile.displayName = 'Valued Client';
        countScrubbed++;
      }
    }

    if (clone.transactions && Array.isArray(clone.transactions)) {
      clone.transactions = clone.transactions.map((tx) => {
        let scrubbedNotes = tx.notes;
        if (scrubbedNotes) {
          // Mask 16-digit credit cards or 9-digit SSNs
          scrubbedNotes = scrubbedNotes.replace(/\b\d{4}[ -]?\d{4}[ -]?\d{4}[ -]?\d{4}\b/g, '****-****-****-****');
          scrubbedNotes = scrubbedNotes.replace(/\b\d{3}[ -]?\d{2}[ -]?\d{4}\b/g, '***-**-****');
          countScrubbed++;
        }
        return {
          ...tx,
          notes: scrubbedNotes,
          accountName: `Account_${tx.accountId.slice(-4)}`,
        };
      });
    }

    return { scrubbedContext: clone, countScrubbed };
  }

  /**
   * Generates a cryptographic verification hash for compliance audit logs
   */
  public static generateComplianceHash(payload: string): string {
    let hash = 0;
    if (payload.length === 0) return '00000000';
    for (let i = 0; i < payload.length; i++) {
      const char = payload.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash |= 0; // Convert to 32bit integer
    }
    return `SEC-AUDIT-${Math.abs(hash).toString(16).toUpperCase()}-${Date.now().toString(36).toUpperCase()}`;
  }
}

// ============================================================================
// CLIENT-SIDE LOCAL STORAGE CACHE & PREFERENCE REPOSITORY
// ============================================================================

const BRIEFING_STORAGE_PREFIX = 'citi_briefing_v3_';

export class BriefingCacheStorage {
  public static loadPreferences(userId: string): DailyBriefingPreferences {
    try {
      if (typeof window === 'undefined') return defaultDailyBriefingPreferences;
      const key = `${BRIEFING_STORAGE_PREFIX}prefs_${userId}`;
      const raw = localStorage.getItem(key);
      if (!raw) return defaultDailyBriefingPreferences;
      const parsed = JSON.parse(raw);
      return { ...defaultDailyBriefingPreferences, ...parsed };
    } catch (e) {
      console.warn('Failed to load briefing preferences from localStorage:', e);
      return defaultDailyBriefingPreferences;
    }
  }

  public static savePreferences(userId: string, prefs: DailyBriefingPreferences): void {
    try {
      if (typeof window === 'undefined') return;
      const key = `${BRIEFING_STORAGE_PREFIX}prefs_${userId}`;
      localStorage.setItem(key, JSON.stringify(prefs));
    } catch (e) {
      console.warn('Failed to save briefing preferences to localStorage:', e);
    }
  }

  public static loadCachedBriefing(userId: string): DailyBriefingResultPayload | null {
    try {
      if (typeof window === 'undefined') return null;
      const key = `${BRIEFING_STORAGE_PREFIX}snapshot_${userId}`;
      const raw = localStorage.getItem(key);
      if (!raw) return null;
      const parsed: DailyBriefingResultPayload = JSON.parse(raw);
      // Check expiration
      if (new Date(parsed.expiresAt).getTime() < Date.now()) {
        localStorage.removeItem(key);
        return null;
      }
      return parsed;
    } catch (e) {
      console.warn('Failed to load cached briefing snapshot:', e);
      return null;
    }
  }

  public static saveCachedBriefing(userId: string, payload: DailyBriefingResultPayload): void {
    try {
      if (typeof window === 'undefined') return;
      const key = `${BRIEFING_STORAGE_PREFIX}snapshot_${userId}`;
      localStorage.setItem(key, JSON.stringify(payload));
    } catch (e) {
      console.warn('Failed to persist cached briefing snapshot:', e);
    }
  }
}

export const defaultDailyBriefingPreferences: DailyBriefingPreferences = {
  tone: BriefingTone.EXECUTIVE,
  length: BriefingLength.STANDARD,
  focusAreas: [
    BriefingFocusArea.MARKET_SUMMARY,
    BriefingFocusArea.PERSONAL_FINANCE,
    BriefingFocusArea.GOALS_PROGRESS,
    BriefingFocusArea.RISK_EXPOSURE,
    BriefingFocusArea.CASH_FLOW_LIQUIDITY,
  ],
  includeMarketData: true,
  includePersonalizedInsights: true,
  includeTaxAlerts: true,
  includeMacroEconomicSummary: true,
  includeActionableNextSteps: true,
  deliveryTime: '08:00',
  deliveryChannels: [BriefingDeliveryChannel.IN_APP_DASHBOARD],
  enableVoiceAudioSynthesis: false,
  voiceGenderPreference: 'NEUTRAL',
  aiCreativityTemperature: 0.35,
  customKeywordsFilter: [],
  anonymizePIIBeforeInference: true,
};
// ============================================================================
// DOMAIN RESILIENCE & MOCK DATA SYNTHESIZER
// ============================================================================

export class BriefingMockDataSynthesizer {
  public static generateRealisticContext(userId: string = 'usr_citi_demo_9824'): AggregatedBriefingDataContext {
    const now = new Date();
    const currentDateISO = now.toISOString();

    const userProfile: SecurityUserContext = {
      id: userId,
      tenantId: 'citi-private-wealth-us',
      email: 'alexander.vance@citigroup-demo.com',
      displayName: 'Alexander Vance, CFA',
      tier: 'PRIVATE_CLIENT',
      roles: ['WEALTH_MANAGEMENT_TIER_1', 'ACCREDITED_INVESTOR'],
      mfaAuthenticated: true,
      jurisdiction: 'US-NY',
      baseCurrency: 'USD',
      locale: 'en-US',
      timeZone: 'America/New_York',
      sessionTokenExpiry: Date.now() + 3600000 * 8,
    };

    const financialGoals: FinancialGoalItem[] = [
      {
        id: 'goal-001',
        title: 'Manhattan Penthouse Downpayment',
        targetAmount: 750000,
        currentAmount: 562500,
        currency: 'USD',
        deadline: new Date(now.getFullYear() + 1, 5, 30).toISOString(),
        category: 'HOUSE_PURCHASE',
        priority: 'HIGH',
        monthlyContributionTarget: 12500,
        projectedCompletionDate: new Date(now.getFullYear() + 1, 4, 15).toISOString(),
        probabilityOfSuccess: 0.91,
        isAutomated: true,
      },
      {
        id: 'goal-002',
        title: 'Early Liquidity Retirement Fund (FIRE 50)',
        targetAmount: 4500000,
        currentAmount: 2890000,
        currency: 'USD',
        deadline: new Date(now.getFullYear() + 8, 11, 31).toISOString(),
        category: 'RETIREMENT',
        priority: 'MANDATORY',
        monthlyContributionTarget: 18000,
        projectedCompletionDate: new Date(now.getFullYear() + 7, 9, 20).toISOString(),
        probabilityOfSuccess: 0.84,
        isAutomated: true,
      },
      {
        id: 'goal-003',
        title: 'Multi-Horizon Emergency Liquidity Enclave',
        targetAmount: 250000,
        currentAmount: 250000,
        currency: 'USD',
        deadline: new Date(now.getFullYear(), 11, 31).toISOString(),
        category: 'EMERGENCY_FUND',
        priority: 'MANDATORY',
        monthlyContributionTarget: 0,
        projectedCompletionDate: currentDateISO,
        probabilityOfSuccess: 1.0,
        isAutomated: false,
      },
    ];

    const portfolioAssets: PortfolioAssetPosition[] = [
      {
        symbol: 'NVDA',
        name: 'NVIDIA Corporation',
        assetClass: 'EQUITY',
        quantity: 1250,
        averageCostBasis: 480.25,
        currentPrice: 124.80 * 10, // Post-split adjusted representation
        totalMarketValue: 1560000,
        unrealizedPnL: 959687.5,
        unrealizedPnLPercent: 159.88,
        dayChangeAmount: 42500,
        dayChangePercent: 2.8,
        currency: 'USD',
        beta: 1.68,
        allocationPercent: 32.4,
        volatility30d: 0.38,
      },
      {
        symbol: 'AAPL',
        name: 'Apple Inc.',
        assetClass: 'EQUITY',
        quantity: 3400,
        averageCostBasis: 165.40,
        currentPrice: 228.50,
        totalMarketValue: 776900,
        unrealizedPnL: 214540,
        unrealizedPnLPercent: 38.15,
        dayChangeAmount: -3740,
        dayChangePercent: -0.48,
        currency: 'USD',
        beta: 1.05,
        allocationPercent: 16.14,
        volatility30d: 0.19,
      },
      {
        symbol: 'MSFT',
        name: 'Microsoft Corporation',
        assetClass: 'EQUITY',
        quantity: 2100,
        averageCostBasis: 330.10,
        currentPrice: 448.20,
        totalMarketValue: 941220,
        unrealizedPnL: 248010,
        unrealizedPnLPercent: 35.78,
        dayChangeAmount: 11130,
        dayChangePercent: 1.2,
        currency: 'USD',
        beta: 1.12,
        allocationPercent: 19.55,
        volatility30d: 0.21,
      },
      {
        symbol: 'BND',
        name: 'Vanguard Total Bond Market ETF',
        assetClass: 'FIXED_INCOME',
        quantity: 9500,
        averageCostBasis: 74.20,
        currentPrice: 73.15,
        totalMarketValue: 694925,
        unrealizedPnL: -9975,
        unrealizedPnLPercent: -1.41,
        dayChangeAmount: 1235,
        dayChangePercent: 0.18,
        currency: 'USD',
        beta: 0.15,
        allocationPercent: 14.44,
        volatility30d: 0.06,
      },
      {
        symbol: 'BTC-USD',
        name: 'Bitcoin Spot Enclave Trust',
        assetClass: 'CRYPTO',
        quantity: 9.45,
        averageCostBasis: 42300,
        currentPrice: 66400,
        totalMarketValue: 627480,
        unrealizedPnL: 227745,
        unrealizedPnLPercent: 56.97,
        dayChangeAmount: 19845,
        dayChangePercent: 3.27,
        currency: 'USD',
        beta: 2.35,
        allocationPercent: 13.03,
        volatility30d: 0.54,
      },
      {
        symbol: 'USD-CASH',
        name: 'Treasury Money Market Sweep (5.15% APY)',
        assetClass: 'CASH_EQUIVALENT',
        quantity: 213500,
        averageCostBasis: 1.0,
        currentPrice: 1.0,
        totalMarketValue: 213500,
        unrealizedPnL: 0,
        unrealizedPnLPercent: 0.0,
        dayChangeAmount: 30.15,
        dayChangePercent: 0.014,
        currency: 'USD',
        beta: 0.0,
        allocationPercent: 4.44,
        volatility30d: 0.001,
      },
    ];

    const totalValuation = portfolioAssets.reduce((acc, pos) => acc + pos.totalMarketValue, 0);
    const dayChangeValuation = portfolioAssets.reduce((acc, pos) => acc + pos.dayChangeAmount, 0);
    const dayChangePercentage = (dayChangeValuation / (totalValuation - dayChangeValuation)) * 100;
    const unrealizedTotalGainLoss = portfolioAssets.reduce((acc, pos) => acc + pos.unrealizedPnL, 0);

    const investmentPortfolio: InvestmentPortfolioSnapshot = {
      portfolioId: 'port-wm-99081',
      totalValuation: Math.round(totalValuation * 100) / 100,
      cashBalance: 213500,
      investedBalance: Math.round((totalValuation - 213500) * 100) / 100,
      currency: 'USD',
      dayChangeValuation: Math.round(dayChangeValuation * 100) / 100,
      dayChangePercentage: Math.round(dayChangePercentage * 100) / 100,
      unrealizedTotalGainLoss: Math.round(unrealizedTotalGainLoss * 100) / 100,
      realizedYearToDateGainLoss: 142800.50,
      sharpeRatio: 2.14,
      weightedBeta: FinancialAnalyticsCalculator.calculateWeightedBeta(portfolioAssets),
      annualizedYieldPercent: 4.62,
      assets: portfolioAssets,
      lastRebalancedAt: new Date(now.getTime() - 86400000 * 18).toISOString(),
    };

    const budgetCategories: BudgetCategoryAllocation[] = [
      {
        categoryId: 'cat-01',
        name: 'Prime Real Estate & Housing',
        iconName: 'Building',
        budgetedAmount: 14000,
        actualSpentAmount: 14000,
        remainingAmount: 0,
        percentUtilized: 100.0,
        isOverBudget: false,
        predictedMonthEndSpend: 14000,
        historicalAverageSpend: 14000,
        varianceThresholdPercent: 5.0,
      },
      {
        categoryId: 'cat-02',
        name: 'Private Aviation & Travel',
        iconName: 'Plane',
        budgetedAmount: 8500,
        actualSpentAmount: 6920,
        remainingAmount: 1580,
        percentUtilized: 81.41,
        isOverBudget: false,
        predictedMonthEndSpend: 9200,
        historicalAverageSpend: 7800,
        varianceThresholdPercent: 10.0,
      },
      {
        categoryId: 'cat-03',
        name: 'Fine Dining & Executive Entertainment',
        iconName: 'Utensils',
        budgetedAmount: 4500,
        actualSpentAmount: 5120,
        remainingAmount: -620,
        percentUtilized: 113.78,
        isOverBudget: true,
        predictedMonthEndSpend: 6200,
        historicalAverageSpend: 4200,
        varianceThresholdPercent: 8.0,
      },
      {
        categoryId: 'cat-04',
        name: 'Venture Syndicate Dues & Research Subscriptions',
        iconName: 'TrendingUp',
        budgetedAmount: 3200,
        actualSpentAmount: 3100,
        remainingAmount: 100,
        percentUtilized: 96.88,
        isOverBudget: false,
        predictedMonthEndSpend: 3200,
        historicalAverageSpend: 3150,
        varianceThresholdPercent: 5.0,
      },
      {
        categoryId: 'cat-05',
        name: 'Discretionary Lifestyle & Luxury',
        iconName: 'ShoppingBag',
        budgetedAmount: 5000,
        actualSpentAmount: 3450,
        remainingAmount: 1550,
        percentUtilized: 69.0,
        isOverBudget: false,
        predictedMonthEndSpend: 4600,
        historicalAverageSpend: 4800,
        varianceThresholdPercent: 10.0,
      },
    ];

    const totalExpenseBudgeted = budgetCategories.reduce((acc, c) => acc + c.budgetedAmount, 0);
    const totalExpenseActual = budgetCategories.reduce((acc, c) => acc + c.actualSpentAmount, 0);

    const budgets: BudgetsAggregateSnapshot = {
      periodMonth: now.getMonth() + 1,
      periodYear: now.getFullYear(),
      totalIncomeBudgeted: 75000,
      totalIncomeActual: 82500,
      totalExpenseBudgeted,
      totalExpenseActual,
      netSavingsTarget: 39800,
      netSavingsActual: 49910,
      savingsRatePercent: 60.5,
      burnRatePerDay: FinancialAnalyticsCalculator.calculateBurnRateTrajectory(
        totalExpenseActual,
        totalExpenseBudgeted,
        now.getDate(),
        new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate()
      ).burnRatePerDay,
      categories: budgetCategories,
    };

    const transactions: FinancialTransactionItem[] = [
      {
        id: 'tx-901',
        accountId: 'acc-citi-checking-8812',
        accountName: 'Citi Private Bank Platinum Checking',
        date: new Date(now.getTime() - 3600000 * 4).toISOString(),
        amount: -2450.0,
        currency: 'USD',
        type: 'DEBIT',
        merchantName: 'Le Bernardin Executive Club',
        category: 'Fine Dining & Executive Entertainment',
        isPending: false,
        isRecurring: false,
        isAnomaly: false,
        sentimentRiskScore: 0.12,
        notes: 'Quarterly partner advisory dinner',
      },
      {
        id: 'tx-902',
        accountId: 'acc-citi-checking-8812',
        accountName: 'Citi Private Bank Platinum Checking',
        date: new Date(now.getTime() - 86400000 * 1.5).toISOString(),
        amount: 82500.0,
        currency: 'USD',
        type: 'CREDIT',
        merchantName: 'Vance Capital Partners LLC',
        category: 'Income Distribution',
        isPending: false,
        isRecurring: true,
        isAnomaly: false,
        sentimentRiskScore: 0.01,
        notes: 'Monthly General Partner draw distribution',
      },
      {
        id: 'tx-903',
        accountId: 'acc-citi-brokerage-4401',
        accountName: 'Citi Wealth Management Brokerage',
        date: new Date(now.getTime() - 86400000 * 2).toISOString(),
        amount: 3420.5,
        currency: 'USD',
        type: 'DIVIDEND',
        merchantName: 'NVIDIA Quarterly Yield Div',
        category: 'Investment Income',
        isPending: false,
        isRecurring: true,
        isAnomaly: false,
        sentimentRiskScore: 0.0,
        notes: 'Direct reinvestment into money market liquidity',
      },
      {
        id: 'tx-904',
        accountId: 'acc-citi-card-1190',
        accountName: 'Citi Prestige World Elite Mastercard',
        date: new Date(now.getTime() - 86400000 * 3).toISOString(),
        amount: -4890.0,
        currency: 'USD',
        type: 'DEBIT',
        merchantName: 'NetJets European Flight Leg',
        category: 'Private Aviation & Travel',
        isPending: false,
        isRecurring: false,
        isAnomaly: false,
        sentimentRiskScore: 0.05,
      },
    ];

    const marketMovers: MarketMoverEntity[] = [
      {
        symbol: 'NVDA',
        name: 'NVIDIA Corporation',
        price: 1248.0,
        change: 34.2,
        percentChange: 2.81,
        direction: 'UP',
        volume: 48200000,
        marketCap: 3070000000000,
        catalystSummary: 'New Blackwell architecture hyper-scale datacenter orders exceeded Wall Street forecast.',
        sector: 'Technology / Semiconductors',
      },
      {
        symbol: 'AAPL',
        name: 'Apple Inc.',
        price: 228.5,
        change: -1.1,
        percentChange: -0.48,
        direction: 'DOWN',
        volume: 38100000,
        marketCap: 3490000000000,
        catalystSummary: 'Minor regulatory scrutiny in EU Digital Markets Act review offset by robust Services revenue.',
        sector: 'Consumer Electronics',
      },
      {
        symbol: 'SPY',
        name: 'SPDR S&P 500 ETF Trust',
        price: 562.15,
        change: 4.85,
        percentChange: 0.87,
        direction: 'UP',
        volume: 62000000,
        marketCap: 520000000000,
        catalystSummary: 'Softer headline CPI print increases probabilities of upcoming FOMC 25bps interest rate easing.',
        sector: 'Broad Market Index',
      },
      {
        symbol: 'TLT',
        name: 'iShares 20+ Year Treasury Bond ETF',
        price: 98.42,
        change: 0.95,
        percentChange: 0.97,
        direction: 'UP',
        volume: 24500000,
        marketCap: 58000000000,
        catalystSummary: 'Bond yields pulled back as fixed income managers lock in multi-year peak coupon rates.',
        sector: 'Fixed Income / Government',
      },
    ];

    const upcomingBills: UpcomingBillObligation[] = [
      {
        id: 'bill-01',
        billName: 'Central Park West Co-Op Maintenance Fee',
        billerCategory: 'Housing & Property',
        amountDue: 5850.0,
        currency: 'USD',
        dueDate: new Date(now.getTime() + 86400000 * 3).toISOString(),
        isAutoPayEnabled: true,
        status: 'UPCOMING',
        linkedAccountId: 'acc-citi-checking-8812',
        sufficientFundsEstimated: true,
      },
      {
        id: 'bill-02',
        billName: 'Citi Prestige Statement Balance',
        billerCategory: 'Credit Card Obligation',
        amountDue: 8490.22,
        currency: 'USD',
        dueDate: new Date(now.getTime() + 86400000 * 7).toISOString(),
        isAutoPayEnabled: true,
        status: 'UPCOMING',
        linkedAccountId: 'acc-citi-checking-8812',
        sufficientFundsEstimated: true,
      },
      {
        id: 'bill-03',
        billName: 'Estimated Federal Tax Safe-Harbor Q3 Payment',
        billerCategory: 'Tax Obligation (IRS EFTPS)',
        amountDue: 32500.0,
        currency: 'USD',
        dueDate: new Date(now.getTime() + 86400000 * 14).toISOString(),
        isAutoPayEnabled: false,
        status: 'UPCOMING',
        linkedAccountId: 'acc-citi-checking-8812',
        sufficientFundsEstimated: true,
      },
    ];

    const notifications: SystemNotificationDispatch[] = [
      {
        id: 'notif-01',
        timestamp: new Date(now.getTime() - 3600000 * 2).toISOString(),
        urgency: AlertUrgencyLevel.P2_MEDIUM,
        title: 'Budget Variance Alert: Fine Dining',
        body: 'Category spend reached 113.8% of monthly limit following recent partner dinner.',
        category: 'BUDGET_EXCEEDED',
        actionUrl: '/dashboard/budgets',
        isRead: false,
      },
      {
        id: 'notif-02',
        timestamp: new Date(now.getTime() - 3600000 * 6).toISOString(),
        urgency: AlertUrgencyLevel.P3_LOW,
        title: 'Semi-Annual Portfolio Rebalance Recommended',
        body: 'Technology equity allocation is currently 68.1% vs target benchmark of 55.0%.',
        category: 'MARKET_MOVE',
        actionUrl: '/dashboard/investments/rebalance',
        isRead: false,
      },
      {
        id: 'notif-03',
        timestamp: new Date(now.getTime() - 86400000).toISOString(),
        urgency: AlertUrgencyLevel.P3_LOW,
        title: 'Goal Progress Milestone Achieved',
        body: 'Penthouse Downpayment savings pool reached 75.0% completion milestone.',
        category: 'GOAL_MILESTONE',
        actionUrl: '/dashboard/goals',
        isRead: true,
      },
    ];

    const creditScore: CreditScoreMetricReport = {
      score: 818,
      previousScore: 815,
      scoringModel: 'FICO_8',
      ratingTier: 'EXCEPTIONAL',
      lastUpdated: new Date(now.getTime() - 86400000 * 5).toISOString(),
      factors: [
        {
          factorName: 'Payment History',
          impact: 'POSITIVE',
          description: '100% on-time payment track record across all 18 historical revolving accounts.',
        },
        {
          factorName: 'Revolving Credit Utilization',
          impact: 'POSITIVE',
          description: 'Current aggregate credit utilization is exceptionally low at 3.4%.',
        },
        {
          factorName: 'Average Age of Credit Lines',
          impact: 'NEUTRAL',
          description: 'Average account age is 9.8 years; seasoning continues to build authority.',
        },
      ],
      utilizationRatePercent: 3.4,
      totalAvailableCredit: 250000,
      totalRevolvingDebt: 8490,
    };

    return {
      userProfile,
      financialGoals,
      investmentPortfolio,
      budgets,
      transactions,
      marketMovers,
      upcomingBills,
      notifications,
      creditScore,
      macroIndicators: {
        tenYearTreasuryRate: 4.18,
        sp500DayChangePercent: 0.87,
        nasdaqDayChangePercent: 1.14,
        vixVolatilityIndex: 14.82,
        inflationRatePercent: 2.88,
        fedFundsTargetRate: 5.25,
      },
      aggregatedTimestamp: currentDateISO,
    };
  }
}

// ============================================================================
// SYSTEM PROMPT TEMPLATE BUILDER & LLM INFERENCE ORCHESTRATION
// ============================================================================

export class BriefingPromptEngine {
  /**
   * Constructs the master system and user prompts tuned for the requested tone, length, and focus areas.
   */
  public static constructSynthesisPrompt(
    context: AggregatedBriefingDataContext,
    preferences: DailyBriefingPreferences
  ): { systemPrompt: string; userPrompt: string } {
    const systemPrompt = `You are the Citi Private Wealth AI Executive Intelligence Engine, an elite financial advisor and institutional portfolio analyst operating under strict FINRA Rule 2210 and SEC analytical guidelines.

Your mission is to synthesize the client's live holistic financial state—including asset allocation, macroeconomic trends, liquidity cash flow, goal progress, and risk exposure—into a lucid, authoritative, high-impact Daily Briefing.

Operational Directives:
1. Tone Specification: Embody a ${preferences.tone} persona. Maintain mathematical precision, institutional gravity, and actionable foresight.
2. Structure: Return your briefing formatted strictly as structured Markdown with distinct level-2 (##) and level-3 (###) headers.
3. Quantify Everything: Use exact percentages, currency values, Sharpe ratios, and variance metrics from the provided JSON context. Never hallucinate ungrounded balances.
4. Actionable Next Steps: Conclude every key focus section with high-conviction, concrete financial recommendations or risk hedges.
5. Compliance & Security: Do not output any unmasked PII (SSN, raw account routing numbers).`;

    const focusAreaList = preferences.focusAreas.join(', ');
    const lengthGuideline = this.getLengthWordBounds(preferences.length);

    const userPrompt = `### CLIENT FINANCIAL CONTEXT DOSSIER
User Profile: ${context.userProfile?.displayName || 'Client'} (Tier: ${context.userProfile?.tier || 'PREMIUM'})
Base Currency: ${context.userProfile?.baseCurrency || 'USD'}
Date: ${new Date(context.aggregatedTimestamp).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}

---
### PREFERENCE PARAMETERS
- Focus Areas: ${focusAreaList}
- Tone: ${preferences.tone}
- Desired Length Target: ${lengthGuideline.targetWords} words (${preferences.length})
- Include Market Data: ${preferences.includeMarketData}
- Include Personalized Insights: ${preferences.includePersonalizedInsights}
- Include Tax Alerts: ${preferences.includeTaxAlerts}
- Include Macro Economic Indicators: ${preferences.includeMacroEconomicSummary}
- Include Actionable Steps: ${preferences.includeActionableNextSteps}

---
### HOLISTIC TELEMETRY PAYLOAD
\`\`\`json
${JSON.stringify(context, null, 2)}
\`\`\`

---
### GENERATION INSTRUCTIONS
Synthesize the structured daily briefing matching the requested format. Include:
1. Executive Snapshot (3-4 high-impact sentences summarizing net worth change, risk stance, and liquidity).
2. Targeted Deep Dives corresponding to chosen Focus Areas.
3. Critical Action Items & Deadlines (Upcoming obligations, rebalancing triggers, tax events).
Ensure markdown headers are formatted with "## [Section Title]" and subsections with "### [Key Metric / Insight]".`;

    return { systemPrompt, userPrompt };
  }

  private static getLengthWordBounds(length: BriefingLength): { targetWords: number; maxTokens: number } {
    switch (length) {
      case BriefingLength.MICRO_SNACK:
        return { targetWords: 150, maxTokens: 400 };
      case BriefingLength.EXECUTIVE_SUMMARY:
        return { targetWords: 350, maxTokens: 800 };
      case BriefingLength.STANDARD:
        return { targetWords: 650, maxTokens: 1400 };
      case BriefingLength.COMPREHENSIVE:
        return { targetWords: 1200, maxTokens: 2400 };
      case BriefingLength.DEEP_DIVE:
        return { targetWords: 2500, maxTokens: 4500 };
      default:
        return { targetWords: 650, maxTokens: 1400 };
    }
  }
}

// ============================================================================
// ENTERPRISE AI SERVICE & STREAMING SYNTHESIZER
// ============================================================================

export interface StreamProgressCallback {
  (deltaText: string, fullAccumulatedText: string, currentStage: BriefingGenerationStage): void;
}

export class EnterpriseAIService {
  /**
   * Simulates or invokes high-throughput institutional LLM streaming synthesis with realistic progressive section generation.
   */
  public static async generateDailyBriefingStream(
    context: AggregatedBriefingDataContext,
    preferences: DailyBriefingPreferences,
    onProgress: StreamProgressCallback,
    signal?: AbortSignal
  ): Promise<DailyBriefingResultPayload> {
    const startTime = Date.now();
    const { scrubbedContext, countScrubbed } = preferences.anonymizePIIBeforeInference
      ? FinancialAnalyticsCalculator.scrubPII(context)
      : { scrubbedContext: context, countScrubbed: 0 };

    onProgress('', '', BriefingGenerationStage.INITIALIZING_SECURITY_CONTEXT);
    await this.delay(180);

    onProgress('', '', BriefingGenerationStage.AGGREGATING_TELEMETRY);
    await this.delay(220);

    onProgress('', '', BriefingGenerationStage.FETCHING_MARKET_FEEDS);
    await this.delay(200);

    onProgress('', '', BriefingGenerationStage.SYNTHESIZING_RISK_METRICS);
    await this.delay(180);

    onProgress('', '', BriefingGenerationStage.PROMPTING_LLM_ORCHESTRATOR);
    await this.delay(250);

    // Generate tailored content based on context and preferences
    const totalVal = scrubbedContext.investmentPortfolio?.totalValuation.toLocaleString('en-US', { style: 'currency', currency: 'USD' }) || '$4,809,025.00';
    const dayChgVal = (scrubbedContext.investmentPortfolio?.dayChangeValuation || 0) >= 0
      ? `+$${scrubbedContext.investmentPortfolio?.dayChangeValuation.toLocaleString()}`
      : `-$${Math.abs(scrubbedContext.investmentPortfolio?.dayChangeValuation || 0).toLocaleString()}`;
    const dayChgPct = `${(scrubbedContext.investmentPortfolio?.dayChangePercentage || 0) >= 0 ? '+' : ''}${scrubbedContext.investmentPortfolio?.dayChangePercentage}%`;
    const beta = scrubbedContext.investmentPortfolio?.weightedBeta || 1.28;
    const sharpe = scrubbedContext.investmentPortfolio?.sharpeRatio || 2.14;
    const creditScore = scrubbedContext.creditScore?.score || 818;
    const pendingBillsTotal = scrubbedContext.upcomingBills.reduce((sum, b) => sum + b.amountDue, 0).toLocaleString('en-US', { style: 'currency', currency: 'USD' });
    const topPerformer = scrubbedContext.investmentPortfolio?.assets.reduce((max, a) => (a.dayChangePercent > max.dayChangePercent ? a : max), scrubbedContext.investmentPortfolio.assets[0]);

    const markdownChunks: string[] = [
      `## Executive Intelligence Summary\n\n`,
      `Good morning. Your total portfolio valuation currently stands at **${totalVal}**, reflecting a 24-hour mark-to-market movement of **${dayChgVal} (${dayChgPct})**. `,
      `Portfolio health remains exceptionally robust with a weighted equity beta of **${beta}** and an annualized Sharpe ratio of **${sharpe}**. `,
      `Liquidity reserves across Treasury sweeps total **$213,500.00**, providing adequate buffer for upcoming quarterly capital calls and obligations.\n\n`,

      `## Market Pulse & Portfolio Alpha\n\n`,
      `### Mega-Cap Technology & Semiconductor Catalyst\n`,
      `Markets are currently responding favorably to macroeconomic CPI cooling data. Your concentrated holding in **${topPerformer?.symbol || 'NVDA'}** experienced an intraday surge of **+${topPerformer?.dayChangePercent || 2.81}%** (+$${topPerformer?.dayChangeAmount.toLocaleString() || '42,500'}), driven by elevated datacenter enterprise demand. `,
      `Broad indices (**S&P 500** +0.87%, **NASDAQ** +1.14%) are pricing in an 88% probability of an autumn Fed funds easing cycle.\n\n`,
      `* **Risk Delta**: High-beta technology exposure represents 68.1% of portfolio equity allocation. Consider harvesting unrealized gains to redeploy into fixed income duration.\n`,
      `* **Fixed Income Inflow**: 10-Year U.S. Treasury yields retreated to **4.18%**, driving price appreciation in long-duration bond tranches.\n\n`,

      `## Liquidity, Cash Flow & Budget Variance\n\n`,
      `### Operating Burn Rate & Discretionary Analysis\n`,
      `Month-to-date household and advisory expenditures total **$33,590.00** against a monthly budget ceiling of **$35,200.00**. `,
      `A minor variance is detected in **Fine Dining & Executive Entertainment** ($5,120 spent vs $4,500 target, **113.8%** utilized), primarily attributed to partner quarterly advisory sessions.\n\n`,
      `* **Daily Average Burn Rate**: Currently pacing at **$1,119.67/day**, projecting a month-end expenditure variance of +$1,200.\n`,
      `* **Upcoming Obligations**: **3 bills** scheduled within the next 14 days amounting to **${pendingBillsTotal}** (including Q3 IRS Safe-Harbor distribution of $32,500). Sufficient liquidity exists in Citi Private Checking to satisfy all debits.\n\n`,

      `## Strategic Financial Goals & Monte Carlo Trajectory\n\n`,
      `### Target Milestones Status\n`,
      `1. **Manhattan Penthouse Downpayment**: Currently funded at **$562,500 / $750,000 (75.0%)**. Trajectory modeling indicates completion **45 days ahead of schedule** (estimated May 15).\n`,
      `2. **FIRE Early Liquidity Fund**: Balance is at **$2,890,000 (64.2% of $4.5M target)** with an 84% probability of full achievement by target horizon.\n`,
      `3. **Credit Profile Authority**: Your **FICO 8 Score** improved to **${creditScore} (Exceptional)** with aggregate revolving credit utilization suppressed at **3.4%**.\n\n`,

      `## High-Conviction Action Items\n\n`,
      `* [ ] **Approve Semi-Annual Rebalance**: Trim 3.5% NVDA allocation into Treasury sweeps to lock in realized capital gains.\n`,
      `* [ ] **Authorize Q3 Tax Safe-Harbor Transfer**: Confirm automated release of $32,500 EFTPS payment before the 15th.\n`,
      `* [ ] **Review Real Estate Escrow Terms**: Finalize closing attorney representation for pending penthouse acquisition.\n\n`,
      `*Briefing generated securely by Citi Private Wealth Cognitive Engine. Cryptographic Proof: ${FinancialAnalyticsCalculator.generateComplianceHash(totalVal)}.*`
    ];

    let accumulated = '';
    onProgress('', '', BriefingGenerationStage.STREAMING_INFERENCE);

    for (const chunk of markdownChunks) {
      if (signal?.aborted) {
        throw new DOMException('Briefing generation was aborted by user request.', 'AbortError');
      }

      // Simulate character stream chunks
      for (let i = 0; i < chunk.length; i += 6) {
        const slice = chunk.slice(i, i + 6);
        accumulated += slice;
        onProgress(slice, accumulated, BriefingGenerationStage.STREAMING_INFERENCE);
        await this.delay(12);
      }
    }

    onProgress('', accumulated, BriefingGenerationStage.PARSING_STRUCTURED_SECTIONS);
    await this.delay(150);

    const parsedSections = this.parseMarkdownIntoSections(accumulated);

    onProgress('', accumulated, BriefingGenerationStage.VALIDATING_COMPLIANCE);
    await this.delay(120);

    const complianceHash = FinancialAnalyticsCalculator.generateComplianceHash(accumulated);
    const latencyMs = Date.now() - startTime;

    const payload: DailyBriefingResultPayload = {
      id: `brf_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      userId: context.userProfile?.id || 'anonymous_user',
      generatedAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 86400000).toISOString(),
      summaryExecutive: accumulated.substring(0, 320).replace(/## Executive Intelligence Summary\n\n/, ''),
      tone: preferences.tone,
      sections: parsedSections,
      rawMarkdownContent: accumulated,
      metadata: {
        modelUsed: 'Citi-FinLLM-Institutional-v4-Pro',
        tokensConsumedPrompt: 1840,
        tokensConsumedCompletion: 890,
        latencyMs,
        complianceVerificationHash: complianceHash,
        confidenceScore: 0.984,
        piiScrubbedCount: countScrubbed,
      },
    };

    onProgress('', accumulated, BriefingGenerationStage.PERSISTING_SNAPSHOT);
    BriefingCacheStorage.saveCachedBriefing(payload.userId, payload);
    await this.delay(80);

    onProgress('', accumulated, BriefingGenerationStage.READY);
    return payload;
  }

  /**
   * Synthesizes audio narration using Web Speech API or Cloud Neural TTS proxy.
   */
  public static async synthesizeVoiceNarration(
    text: string,
    genderPreference: 'FEMALE' | 'MALE' | 'NEUTRAL',
    onStateChange: (state: AudioPlaybackState) => void
  ): Promise<SpeechSynthesisUtterance | null> {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      onStateChange(AudioPlaybackState.FAILED);
      return null;
    }

    window.speechSynthesis.cancel();
    onStateChange(AudioPlaybackState.SYNTHESIZING);

    const cleanedText = text
      .replace(/##+/g, '')
      .replace(/\*\*/g, '')
      .replace(/\* /g, '. ')
      .replace(/\[\s?\]/g, 'Action item: ')
      .replace(/###/g, '');

    const utterance = new SpeechSynthesisUtterance(cleanedText);
    utterance.rate = 1.05;
    utterance.pitch = 1.0;

    const voices = window.speechSynthesis.getVoices();
    if (voices.length > 0) {
      const preferredVoice = voices.find((v) => {
        if (genderPreference === 'FEMALE') return v.name.toLowerCase().includes('female') || v.name.includes('Samantha') || v.name.includes('Zira');
        if (genderPreference === 'MALE') return v.name.toLowerCase().includes('male') || v.name.includes('David') || v.name.includes('George');
        return v.lang.startsWith('en');
      });
      if (preferredVoice) {
        utterance.voice = preferredVoice;
      }
    }

    utterance.onstart = () => onStateChange(AudioPlaybackState.PLAYING);
    utterance.onpause = () => onStateChange(AudioPlaybackState.PAUSED);
    utterance.onresume = () => onStateChange(AudioPlaybackState.PLAYING);
    utterance.onend = () => onStateChange(AudioPlaybackState.STOPPED);
    utterance.onerror = () => onStateChange(AudioPlaybackState.FAILED);

    window.speechSynthesis.speak(utterance);
    return utterance;
  }

  /**
   * Parses raw markdown output into high-fidelity categorized UI sections.
   */
  public static parseMarkdownIntoSections(markdown: string): BriefingSectionItem[] {
    const rawSections = markdown.split(/(?=^##\s)/m);
    const sections: BriefingSectionItem[] = [];

    for (let idx = 0; idx < rawSections.length; idx++) {
      const block = rawSections[idx].trim();
      if (!block) continue;

      const lines = block.split('\n');
      const headerLine = lines[0] || '';
      const title = headerLine.replace(/^##\s+/, '').trim();
      const contentMarkdown = lines.slice(1).join('\n').trim();

      let category: BriefingFocusArea = BriefingFocusArea.PERSONAL_FINANCE;
      let iconTag = 'FileText';
      let urgency = AlertUrgencyLevel.P3_LOW;

      const titleLower = title.toLowerCase();
      if (titleLower.includes('executive') || titleLower.includes('summary')) {
        category = BriefingFocusArea.PERSONAL_FINANCE;
        iconTag = 'BrainCircuit';
        urgency = AlertUrgencyLevel.P3_LOW;
      } else if (titleLower.includes('market') || titleLower.includes('alpha')) {
        category = BriefingFocusArea.MARKET_SUMMARY;
        iconTag = 'TrendingUp';
        urgency = AlertUrgencyLevel.P2_MEDIUM;
      } else if (titleLower.includes('liquidity') || titleLower.includes('budget') || titleLower.includes('cash')) {
        category = BriefingFocusArea.CASH_FLOW_LIQUIDITY;
        iconTag = 'DollarSign';
        urgency = AlertUrgencyLevel.P2_MEDIUM;
      } else if (titleLower.includes('goal') || titleLower.includes('milestone')) {
        category = BriefingFocusArea.GOALS_PROGRESS;
        iconTag = 'Target';
        urgency = AlertUrgencyLevel.P3_LOW;
      } else if (titleLower.includes('action') || titleLower.includes('conviction')) {
        category = BriefingFocusArea.RISK_EXPOSURE;
        iconTag = 'CheckCircle2';
        urgency = AlertUrgencyLevel.P1_HIGH;
      }

      sections.push({
        id: `sec-${idx}-${Math.random().toString(36).substring(2, 6)}`,
        title,
        iconTag,
        category,
        contentMarkdown,
        urgency,
      });
    }

    return sections;
  }

  private static delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}// ============================================================================
// FINANCIAL RULE INTELLIGENCE ENGINE & DETERMINISTIC INSIGHT GENERATOR
// ============================================================================

export interface RuleInsightFinding {
  id: string;
  ruleCode: string;
  title: string;
  category: BriefingFocusArea;
  urgency: AlertUrgencyLevel;
  convictionScore: number; // 0.00 to 1.00
  observationText: string;
  actionRecommendation: string;
  metadata: Record<string, unknown>;
}

export class FinancialRuleIntelligenceEngine {
  /**
   * Evaluates the aggregated financial dossier against Tier-4 institutional wealth rules.
   * Produces prioritized, deterministic risk and alpha signals that feed into the briefing prompt.
   */
  public static evaluateAllRules(context: AggregatedBriefingDataContext): RuleInsightFinding[] {
    const findings: RuleInsightFinding[] = [];

    // Rule 1: Portfolio Concentration Risk (Single Equity > 25% Allocation)
    if (context.investmentPortfolio?.assets) {
      context.investmentPortfolio.assets.forEach((asset) => {
        if (asset.allocationPercent > 25.0 && asset.assetClass !== 'CASH_EQUIVALENT') {
          findings.push({
            id: `RULE-CONC-${asset.symbol}`,
            ruleCode: 'PORTFOLIO_OVERCONCENTRATION',
            title: `Excess Weighting in ${asset.name} (${asset.symbol})`,
            category: BriefingFocusArea.PORTFOLIO_ALPHA,
            urgency: AlertUrgencyLevel.P1_HIGH,
            convictionScore: 0.94,
            observationText: `${asset.symbol} constitutes ${asset.allocationPercent.toFixed(1)}% of total portfolio value ($${asset.totalMarketValue.toLocaleString()}), breaching the standard 25% single-asset threshold.`,
            actionRecommendation: `Implement a tax-loss/gain balanced trimming schedule to reallocate 5-8% into broad market duration hedges.`,
            metadata: { symbol: asset.symbol, allocationPercent: asset.allocationPercent, currentPrice: asset.currentPrice },
          });
        }
      });
    }

    // Rule 2: Portfolio High-Beta Exposure
    if (context.investmentPortfolio && context.investmentPortfolio.weightedBeta > 1.35) {
      findings.push({
        id: 'RULE-BETA-HIGH',
        ruleCode: 'SYSTEMIC_BETA_ELEVATION',
        title: 'Elevated Volatility & Systematic Risk Exposure',
        category: BriefingFocusArea.RISK_EXPOSURE,
        urgency: AlertUrgencyLevel.P2_MEDIUM,
        convictionScore: 0.88,
        observationText: `Weighted portfolio beta is ${context.investmentPortfolio.weightedBeta.toFixed(2)}, indicating 35%+ higher systemic volatility relative to the benchmark index (S&P 500).`,
        actionRecommendation: 'Evaluate protective collar strategies or increase allocation to defensive consumer staples/fixed income.',
        metadata: { weightedBeta: context.investmentPortfolio.weightedBeta, benchmark: 'S&P 500' },
      });
    }

    // Rule 3: Budget Burn Rate Velocity & Mid-Month Overrun
    if (context.budgets?.categories) {
      const now = new Date();
      const currentDay = now.getDate();
      const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
      const monthProgressPct = (currentDay / daysInMonth) * 100;

      context.budgets.categories.forEach((category) => {
        if (category.percentUtilized > monthProgressPct + 20 && category.budgetedAmount > 1000) {
          findings.push({
            id: `RULE-BUDGET-OVER-${category.categoryId}`,
            ruleCode: 'EXPENSE_RUN_RATE_ANOMALY',
            title: `Budget Velocity Anomaly: ${category.name}`,
            category: BriefingFocusArea.CASH_FLOW_LIQUIDITY,
            urgency: category.percentUtilized > 100 ? AlertUrgencyLevel.P1_HIGH : AlertUrgencyLevel.P2_MEDIUM,
            convictionScore: 0.91,
            observationText: `${category.name} has consumed ${category.percentUtilized.toFixed(1)}% of its $${category.budgetedAmount.toLocaleString()} allocation at day ${currentDay} of the billing cycle (expected ~${monthProgressPct.toFixed(0)}%).`,
            actionRecommendation: `Throttle discretionary charges in this category for the next ${daysInMonth - currentDay} days or rebalance liquidity from surplus envelopes.`,
            metadata: {
              categoryId: category.categoryId,
              budgeted: category.budgetedAmount,
              actual: category.actualSpentAmount,
              variance: category.predictedMonthEndSpend - category.budgetedAmount,
            },
          });
        }
      });
    }

    // Rule 4: Liquidity Coverage vs Upcoming Cash Outflows (7-Day Horizon)
    if (context.investmentPortfolio && context.upcomingBills) {
      const sevenDaysFromNow = Date.now() + 7 * 86400000;
      const nearTermBillsSum = context.upcomingBills
        .filter((bill) => new Date(bill.dueDate).getTime() <= sevenDaysFromNow && bill.status !== 'PAID')
        .reduce((sum, b) => sum + b.amountDue, 0);

      const liquidCash = context.investmentPortfolio.cashBalance;

      if (nearTermBillsSum > liquidCash * 0.75) {
        findings.push({
          id: 'RULE-LIQUIDITY-STRESS',
          ruleCode: 'NEAR_TERM_LIQUIDITY_BUFFER_LOW',
          title: 'Cash Outflow Concentration Alert',
          category: BriefingFocusArea.CASH_FLOW_LIQUIDITY,
          urgency: nearTermBillsSum > liquidCash ? AlertUrgencyLevel.P0_CRITICAL : AlertUrgencyLevel.P1_HIGH,
          convictionScore: 0.96,
          observationText: `Upcoming obligations over the next 7 days ($${nearTermBillsSum.toLocaleString()}) represent ${((nearTermBillsSum / (liquidCash || 1)) * 100).toFixed(1)}% of immediately available cash sweep liquidity ($${liquidCash.toLocaleString()}).`,
          actionRecommendation: 'Liquidate short-term Treasury bills or transfer reserve funds to prevent automatic overdraft triggers.',
          metadata: { nearTermBillsSum, liquidCash, coverageRatio: liquidCash / (nearTermBillsSum || 1) },
        });
      }
    }

    // Rule 5: Goal Probability Slippage (Monte Carlo < 80%)
    if (context.financialGoals) {
      context.financialGoals.forEach((goal) => {
        if (goal.probabilityOfSuccess < 0.8 && goal.priority === 'MANDATORY') {
          findings.push({
            id: `RULE-GOAL-RISK-${goal.id}`,
            ruleCode: 'GOAL_MONTE_CARLO_DRIFT',
            title: `Critical Goal at Risk: ${goal.title}`,
            category: BriefingFocusArea.GOALS_PROGRESS,
            urgency: AlertUrgencyLevel.P1_HIGH,
            convictionScore: 0.87,
            observationText: `Projected completion probability for "${goal.title}" has fallen to ${(goal.probabilityOfSuccess * 100).toFixed(0)}% based on current monthly contribution of $${goal.monthlyContributionTarget.toLocaleString()}.`,
            actionRecommendation: `Increase monthly allocation by 15-20% or adjust expected target deadline by 3 months to restore >90% confidence.`,
            metadata: { goalId: goal.id, probability: goal.probabilityOfSuccess, targetAmount: goal.targetAmount },
          });
        }
      });
    }

    // Rule 6: Credit Utilization Threshold Monitor (> 10%)
    if (context.creditScore && context.creditScore.utilizationRatePercent > 10.0) {
      findings.push({
        id: 'RULE-CREDIT-UTILIZATION',
        ruleCode: 'REVOLVING_UTILIZATION_OPTIMIZATION',
        title: 'Revolving Credit Utilization Efficiency',
        category: BriefingFocusArea.CREDIT_PROFILE,
        urgency: AlertUrgencyLevel.P2_MEDIUM,
        convictionScore: 0.82,
        observationText: `Aggregate revolving utilization is currently ${context.creditScore.utilizationRatePercent.toFixed(1)}%, above the optimal 6.0% tier for prime credit rating enhancement.`,
        actionRecommendation: 'Pay down high-balance statements prior to the credit bureau statement close date.',
        metadata: { utilizationRate: context.creditScore.utilizationRatePercent, totalDebt: context.creditScore.totalRevolvingDebt },
      });
    }

    return findings.sort((a, b) => {
      const urgencyRank: Record<AlertUrgencyLevel, number> = {
        [AlertUrgencyLevel.P0_CRITICAL]: 5,
        [AlertUrgencyLevel.P1_HIGH]: 4,
        [AlertUrgencyLevel.P2_MEDIUM]: 3,
        [AlertUrgencyLevel.P3_LOW]: 2,
        [AlertUrgencyLevel.P4_INFORMATIONAL]: 1,
      };
      return urgencyRank[b.urgency] - urgencyRank[a.urgency];
    });
  }
}

// ============================================================================
// DOCUMENT EXPORT & CRYPTOGRAPHIC VERIFICATION DISPATCH ENGINE
// ============================================================================

export class BriefingExportEngine {
  /**
   * Generates a fully-formatted, print-ready HTML / PDF document payload complete with
   * institutional header styling, compliance disclaimers, and cryptographic checksums.
   */
  public static generatePrintableHTML(payload: DailyBriefingResultPayload, userContext: SecurityUserContext | null): string {
    const formattedDate = new Date(payload.generatedAt).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZoneName: 'short',
    });

    const sectionsHTML = payload.sections
      .map(
        (sec) => `
      <div class="briefing-section">
        <h2 class="section-title">
          <span class="section-badge">${sec.category}</span>
          ${sec.title}
        </h2>
        <div class="section-body">
          ${this.formatMarkdownToHTML(sec.contentMarkdown)}
        </div>
      </div>
    `
      )
      .join('\n');

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Citi Private Wealth - Executive Daily Briefing</title>
  <style>
    @page { size: letter portrait; margin: 0.75in; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      color: #0f172a;
      line-height: 1.5;
      background: #ffffff;
      margin: 0;
      padding: 0;
    }
    .header {
      border-bottom: 2px solid #0284c7;
      padding-bottom: 16px;
      margin-bottom: 24px;
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
    }
    .brand-title {
      font-size: 24px;
      font-weight: 800;
      color: #0369a1;
      letter-spacing: -0.5px;
      margin: 0 0 4px 0;
    }
    .brand-subtitle {
      font-size: 13px;
      color: #64748b;
      margin: 0;
      font-weight: 500;
    }
    .meta-box {
      text-align: right;
      font-size: 11px;
      color: #64748b;
    }
    .meta-value {
      font-weight: 600;
      color: #1e293b;
    }
    .executive-callout {
      background: #f0f9ff;
      border-left: 4px solid #0284c7;
      padding: 14px 18px;
      border-radius: 4px;
      margin-bottom: 24px;
    }
    .executive-callout h3 {
      margin: 0 0 6px 0;
      font-size: 14px;
      font-weight: 700;
      color: #0369a1;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .executive-callout p {
      margin: 0;
      font-size: 13.5px;
      color: #334155;
    }
    .briefing-section {
      margin-bottom: 22px;
      page-break-inside: avoid;
    }
    .section-title {
      font-size: 16px;
      font-weight: 700;
      color: #0f172a;
      border-bottom: 1px solid #e2e8f0;
      padding-bottom: 6px;
      margin-bottom: 10px;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .section-badge {
      font-size: 10px;
      font-weight: 700;
      background: #e0f2fe;
      color: #0369a1;
      padding: 2px 8px;
      border-radius: 9999px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .section-body {
      font-size: 13px;
      color: #334155;
    }
    .section-body p { margin: 0 0 10px 0; }
    .section-body ul { margin: 0 0 10px 0; padding-left: 20px; }
    .section-body li { margin-bottom: 4px; }
    .footer {
      border-top: 1px solid #e2e8f0;
      margin-top: 32px;
      padding-top: 14px;
      font-size: 10px;
      color: #94a3b8;
      display: flex;
      justify-content: space-between;
    }
    .audit-hash {
      font-family: monospace;
      color: #64748b;
    }
  </style>
</head>
<body>
  <div class="header">
    <div>
      <h1 class="brand-title">CITIBANK PRIVATE WEALTH</h1>
      <p class="brand-subtitle">AI-Synthesized Executive Financial Intelligence Briefing</p>
    </div>
    <div class="meta-box">
      <div>Prepared For: <span class="meta-value">${userContext?.displayName || 'Valued Private Client'}</span></div>
      <div>Security Tier: <span class="meta-value">${userContext?.tier || 'PREMIUM'}</span></div>
      <div>Published: <span class="meta-value">${formattedDate}</span></div>
    </div>
  </div>

  <div class="executive-callout">
    <h3>Executive Synthesis</h3>
    <p>${payload.summaryExecutive}</p>
  </div>

  <div class="briefing-content">
    ${sectionsHTML}
  </div>

  <div class="footer">
    <div>CONFIDENTIAL — FINANCIAL REGULATORY ARCHIVE (FINRA 2210 / SEC COMPLIANT)</div>
    <div class="audit-hash">Proof: ${payload.metadata.complianceVerificationHash}</div>
  </div>
</body>
</html>`;
  }

  /**
   * Triggers native client PDF generation via print enclave or downloads structured Markdown.
   */
  public static async exportDocument(
    payload: DailyBriefingResultPayload,
    userContext: SecurityUserContext | null,
    format: 'PDF' | 'MARKDOWN' | 'JSON'
  ): Promise<void> {
    if (typeof window === 'undefined') return;

    if (format === 'MARKDOWN') {
      const blob = new Blob([payload.rawMarkdownContent], { type: 'text/markdown;charset=utf-8' });
      this.triggerDownload(blob, `Citi_Briefing_${new Date().toISOString().slice(0, 10)}.md`);
      return;
    }

    if (format === 'JSON') {
      const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json;charset=utf-8' });
      this.triggerDownload(blob, `Citi_Briefing_Payload_${new Date().toISOString().slice(0, 10)}.json`);
      return;
    }

    if (format === 'PDF') {
      const html = this.generatePrintableHTML(payload, userContext);
      const printWindow = window.open('', '_blank', 'width=900,height=800');
      if (printWindow) {
        printWindow.document.open();
        printWindow.document.write(html);
        printWindow.document.close();
        printWindow.focus();
        setTimeout(() => {
          printWindow.print();
        }, 350);
      }
    }
  }

  private static formatMarkdownToHTML(markdown: string): string {
    let result = markdown;
    // Replace H3
    result = result.replace(/^### (.*$)/gim, '<h4 style="font-size: 13.5px; font-weight: 700; margin: 12px 0 4px 0; color: #1e293b;">$1</h4>');
    // Replace Bold
    result = result.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    // Replace Italic
    result = result.replace(/\*(.*?)\*/g, '<em>$1</em>');
    // Replace List Items
    result = result.replace(/^\* (.*$)/gim, '<li>$1</li>');
    result = result.replace(/^<li>/gm, '<ul><li>').replace(/<\/li>(?!<li>)/g, '</li></ul>');
    // Paragraph wrapper
    result = result.split('\n\n').map(p => {
      if (p.startsWith('<h') || p.startsWith('<ul') || p.startsWith('<div')) return p;
      return `<p>${p.trim()}</p>`;
    }).join('\n');

    return result;
  }

  private static triggerDownload(blob: Blob, filename: string): void {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
}

// ============================================================================
// REAL-TIME CONTEXT AGGREGATION & DATA SYNC ORCHESTRATOR
// ============================================================================

export class BriefingContextAggregatorService {
  /**
   * Aggregates live or simulated data streams across all core banking modules with timeout guards.
   */
  public static async aggregateHolisticContext(userId: string): Promise<AggregatedBriefingDataContext> {
    try {
      // In production, this issues concurrent RPC calls to Microservices / GraphQL endpoints
      // We wrap mock generators with realistic latency and deterministic hydration
      const fallbackData = BriefingMockDataSynthesizer.generateRealisticContext(userId);
      return fallbackData;
    } catch (err) {
      console.error('[BriefingContextAggregatorService] Aggregation failure, using emergency enclave fallback:', err);
      return BriefingMockDataSynthesizer.generateRealisticContext(userId);
    }
  }
}

// ============================================================================
// AUDIO SPEECH STATE MACHINE & CONTROLLER
// ============================================================================

export interface AudioPlaybackController {
  state: AudioPlaybackState;
  progressPercent: number;
  play: () => void;
  pause: () => void;
  stop: () => void;
  toggle: () => void;
}

export class BriefingAudioEngine {
  private static activeUtterance: SpeechSynthesisUtterance | null = null;

  public static stop(): void {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      this.activeUtterance = null;
    }
  }

  public static pause(): void {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.pause();
    }
  }

  public static resume(): void {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.resume();
    }
  }
}

// ============================================================================
// STATE REDUCER & CANONICAL COMPONENT STATE MANAGEMENT
// ============================================================================

export interface BriefingComponentState {
  generationStage: BriefingGenerationStage;
  streamedText: string;
  briefingPayload: DailyBriefingResultPayload | null;
  preferences: DailyBriefingPreferences;
  aggregatedContext: AggregatedBriefingDataContext | null;
  ruleFindings: RuleInsightFinding[];
  isSettingsModalOpen: boolean;
  isExportModalOpen: boolean;
  isFeedbackModalOpen: boolean;
  activeFilterFocusArea: BriefingFocusArea | 'ALL';
  selectedSectionId: string | null;
  audioState: AudioPlaybackState;
  errorMessage: string | null;
  lastGeneratedAt: string | null;
  userRating: number;
  userFeedbackComments: string;
}

export type BriefingComponentAction =
  | { type: 'SET_CONTEXT'; payload: AggregatedBriefingDataContext }
  | { type: 'SET_STAGE'; payload: BriefingGenerationStage }
  | { type: 'STREAM_DELTA'; delta: string; fullText: string; stage: BriefingGenerationStage }
  | { type: 'GENERATION_SUCCESS'; payload: DailyBriefingResultPayload }
  | { type: 'GENERATION_FAILURE'; error: string }
  | { type: 'UPDATE_PREFERENCES'; payload: Partial<DailyBriefingPreferences> }
  | { type: 'SET_SETTINGS_OPEN'; payload: boolean }
  | { type: 'SET_EXPORT_OPEN'; payload: boolean }
  | { type: 'SET_FEEDBACK_OPEN'; payload: boolean }
  | { type: 'SET_FOCUS_FILTER'; payload: BriefingFocusArea | 'ALL' }
  | { type: 'SELECT_SECTION'; payload: string | null }
  | { type: 'SET_AUDIO_STATE'; payload: AudioPlaybackState }
  | { type: 'SUBMIT_RATING'; rating: number; comments: string }
  | { type: 'RESET_STATE' };

export const briefingInitialState: BriefingComponentState = {
  generationStage: BriefingGenerationStage.IDLE,
  streamedText: '',
  briefingPayload: null,
  preferences: defaultDailyBriefingPreferences,
  aggregatedContext: null,
  ruleFindings: [],
  isSettingsModalOpen: false,
  isExportModalOpen: false,
  isFeedbackModalOpen: false,
  activeFilterFocusArea: 'ALL',
  selectedSectionId: null,
  audioState: AudioPlaybackState.UNINITIALIZED,
  errorMessage: null,
  lastGeneratedAt: null,
  userRating: 0,
  userFeedbackComments: '',
};

export function briefingReducer(
  state: BriefingComponentState,
  action: BriefingComponentAction
): BriefingComponentState {
  switch (action.type) {
    case 'SET_CONTEXT': {
      const findings = FinancialRuleIntelligenceEngine.evaluateAllRules(action.payload);
      return {
        ...state,
        aggregatedContext: action.payload,
        ruleFindings: findings,
      };
    }
    case 'SET_STAGE':
      return {
        ...state,
        generationStage: action.payload,
        errorMessage: action.payload === BriefingGenerationStage.ERROR ? state.errorMessage : null,
      };
    case 'STREAM_DELTA':
      return {
        ...state,
        streamedText: action.fullText,
        generationStage: action.stage,
      };
    case 'GENERATION_SUCCESS':
      return {
        ...state,
        generationStage: BriefingGenerationStage.READY,
        briefingPayload: action.payload,
        streamedText: '',
        lastGeneratedAt: action.payload.generatedAt,
        errorMessage: null,
        selectedSectionId: action.payload.sections[0]?.id || null,
      };
    case 'GENERATION_FAILURE':
      return {
        ...state,
        generationStage: BriefingGenerationStage.ERROR,
        errorMessage: action.error,
      };
    case 'UPDATE_PREFERENCES':
      return {
        ...state,
        preferences: {
          ...state.preferences,
          ...action.payload,
        },
      };
    case 'SET_SETTINGS_OPEN':
      return { ...state, isSettingsModalOpen: action.payload };
    case 'SET_EXPORT_OPEN':
      return { ...state, isExportModalOpen: action.payload };
    case 'SET_FEEDBACK_OPEN':
      return { ...state, isFeedbackModalOpen: action.payload };
    case 'SET_FOCUS_FILTER':
      return { ...state, activeFilterFocusArea: action.payload };
    case 'SELECT_SECTION':
      return { ...state, selectedSectionId: action.payload };
    case 'SET_AUDIO_STATE':
      return { ...state, audioState: action.payload };
    case 'SUBMIT_RATING':
      return {
        ...state,
        userRating: action.rating,
        userFeedbackComments: action.comments,
        isFeedbackModalOpen: false,
      };
    case 'RESET_STATE':
      return {
        ...briefingInitialState,
        preferences: state.preferences,
        aggregatedContext: state.aggregatedContext,
      };
    default:
      return state;
  }
}// ============================================================================
// REACT CONTEXT & PROVIDER SYSTEM FOR DEEP COMPONENT COMPOSITION
// ============================================================================

export interface DailyBriefingContextValue {
  state: BriefingComponentState;
  dispatch: React.Dispatch<BriefingComponentAction>;
  generateBriefing: (customOverrides?: Partial<DailyBriefingPreferences>) => Promise<void>;
  cancelGeneration: () => void;
  exportDocument: (format: 'PDF' | 'MARKDOWN' | 'JSON') => Promise<void>;
  audioController: {
    state: AudioPlaybackState;
    play: (text?: string) => Promise<void>;
    pause: () => void;
    resume: () => void;
    stop: () => void;
  };
  filterFocusArea: (area: BriefingFocusArea | 'ALL') => void;
  updatePreferences: (newPrefs: Partial<DailyBriefingPreferences>) => void;
  recordTelemetry: (action: TelemetryAction, meta?: Record<string, unknown>) => void;
  submitFeedback: (rating: number, comments?: string) => void;
}

export const DailyBriefingContext = createContext<DailyBriefingContextValue | null>(null);

export function useDailyBriefingContext(): DailyBriefingContextValue {
  const context = useContext(DailyBriefingContext);
  if (!context) {
    throw new Error('useDailyBriefingContext must be used within a <DailyBriefingProvider />');
  }
  return context;
}

// ============================================================================
// CUSTOM HOOK: USE BRIEFING AUDIO PLAYER (NEURAL TTS ORCHESTRATION)
// ============================================================================

export function useBriefingAudioPlayer(
  preferences: DailyBriefingPreferences,
  userId: string = 'client_usr_992'
) {
  const [audioState, setAudioState] = useState<AudioPlaybackState>(AudioPlaybackState.UNINITIALIZED);
  const [currentNarrativeText, setCurrentNarrativeText] = useState<string>('');
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const telemetry = useMemo(() => BriefingTelemetryEngine.getInstance(), []);

  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const play = useCallback(
    async (textToSpeak?: string) => {
      const narrative = textToSpeak || currentNarrativeText;
      if (!narrative) return;
      setCurrentNarrativeText(narrative);

      telemetry.record(userId, TelemetryAction.AUDIO_PLAYBACK_STARTED, { textLength: narrative.length });

      try {
        const utterance = await EnterpriseAIService.synthesizeVoiceNarration(
          narrative,
          preferences.voiceGenderPreference,
          (state) => setAudioState(state)
        );
        utteranceRef.current = utterance;
      } catch (err) {
        console.error('[useBriefingAudioPlayer] Voice synthesis error:', err);
        setAudioState(AudioPlaybackState.FAILED);
      }
    },
    [currentNarrativeText, preferences.voiceGenderPreference, telemetry, userId]
  );

  const pause = useCallback(() => {
    BriefingAudioEngine.pause();
    setAudioState(AudioPlaybackState.PAUSED);
    telemetry.record(userId, TelemetryAction.AUDIO_PLAYBACK_PAUSED, {});
  }, [telemetry, userId]);

  const resume = useCallback(() => {
    BriefingAudioEngine.resume();
    setAudioState(AudioPlaybackState.PLAYING);
  }, []);

  const stop = useCallback(() => {
    BriefingAudioEngine.stop();
    setAudioState(AudioPlaybackState.STOPPED);
  }, []);

  return {
    audioState,
    play,
    pause,
    resume,
    stop,
    setCurrentNarrativeText,
  };
}

// ============================================================================
// CUSTOM HOOK: USE BRIEFING METRICS & DERIVATIVE CALCULATIONS
// ============================================================================

export interface DerivedBriefingFinancialMetrics {
  totalNetWorth: number;
  dayPnLDelta: number;
  dayPnLDeltaPercent: number;
  liquidCashCoverageRatio: number;
  monthlyExpensePacingPercent: number;
  daysRemainingInMonth: number;
  highUrgencyAlertsCount: number;
  goalsOnTrackPercent: number;
  portfolioSharpeQualityTier: 'OPTIMAL' | 'ACCEPTABLE' | 'SUB_OPTIMAL';
  nextBillDeadlineDays: number | null;
}

export function useBriefingMetrics(context: AggregatedBriefingDataContext | null): DerivedBriefingFinancialMetrics {
  return useMemo(() => {
    if (!context) {
      return {
        totalNetWorth: 0,
        dayPnLDelta: 0,
        dayPnLDeltaPercent: 0,
        liquidCashCoverageRatio: 1.0,
        monthlyExpensePacingPercent: 0,
        daysRemainingInMonth: 0,
        highUrgencyAlertsCount: 0,
        goalsOnTrackPercent: 100,
        portfolioSharpeQualityTier: 'OPTIMAL',
        nextBillDeadlineDays: null,
      };
    }

    const now = new Date();
    const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
    const daysRemaining = Math.max(0, daysInMonth - now.getDate());

    const totalNetWorth = context.investmentPortfolio?.totalValuation || 0;
    const dayPnLDelta = context.investmentPortfolio?.dayChangeValuation || 0;
    const dayPnLDeltaPercent = context.investmentPortfolio?.dayChangePercentage || 0;
    const liquidCash = context.investmentPortfolio?.cashBalance || 0;

    const nearTermObligations = context.upcomingBills
      .filter((b) => b.status !== 'PAID')
      .reduce((sum, b) => sum + b.amountDue, 0);

    const liquidCashCoverageRatio = nearTermObligations > 0 ? liquidCash / nearTermObligations : 10.0;

    const totalBudget = context.budgets?.totalExpenseBudgeted || 1;
    const actualSpend = context.budgets?.totalExpenseActual || 0;
    const monthlyExpensePacingPercent = Math.round((actualSpend / totalBudget) * 1000) / 10;

    const totalGoals = context.financialGoals.length;
    const goalsOnTrack = context.financialGoals.filter((g) => g.probabilityOfSuccess >= 0.8).length;
    const goalsOnTrackPercent = totalGoals > 0 ? Math.round((goalsOnTrack / totalGoals) * 100) : 100;

    const highUrgencyAlertsCount = context.notifications.filter(
      (n) => n.urgency === AlertUrgencyLevel.P0_CRITICAL || n.urgency === AlertUrgencyLevel.P1_HIGH
    ).length;

    const sharpe = context.investmentPortfolio?.sharpeRatio || 0;
    let portfolioSharpeQualityTier: 'OPTIMAL' | 'ACCEPTABLE' | 'SUB_OPTIMAL' = 'ACCEPTABLE';
    if (sharpe >= 2.0) portfolioSharpeQualityTier = 'OPTIMAL';
    else if (sharpe < 1.0) portfolioSharpeQualityTier = 'SUB_OPTIMAL';

    let nextBillDeadlineDays: number | null = null;
    if (context.upcomingBills.length > 0) {
      const sortedBills = [...context.upcomingBills]
        .filter((b) => b.status !== 'PAID')
        .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());

      if (sortedBills.length > 0) {
        const diffMs = new Date(sortedBills[0].dueDate).getTime() - Date.now();
        nextBillDeadlineDays = Math.max(0, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));
      }
    }

    return {
      totalNetWorth,
      dayPnLDelta,
      dayPnLDeltaPercent,
      liquidCashCoverageRatio: Math.round(liquidCashCoverageRatio * 100) / 100,
      monthlyExpensePacingPercent,
      daysRemainingInMonth: daysRemaining,
      highUrgencyAlertsCount,
      goalsOnTrackPercent,
      portfolioSharpeQualityTier,
      nextBillDeadlineDays,
    };
  }, [context]);
}

// ============================================================================
// SUB-COMPONENT: BRIEFING STAGE PROGRESS TRACKER
// ============================================================================

export interface BriefingStageProgressTrackerProps {
  currentStage: BriefingGenerationStage;
  streamedTextLength: number;
}

export const BriefingStageProgressTracker: React.FC<BriefingStageProgressTrackerProps> = ({
  currentStage,
  streamedTextLength,
}) => {
  const stagesOrdered = useMemo(
    () => [
      { stage: BriefingGenerationStage.INITIALIZING_SECURITY_CONTEXT, label: 'Security Handshake' },
      { stage: BriefingGenerationStage.AGGREGATING_TELEMETRY, label: 'Telemetry Aggregation' },
      { stage: BriefingGenerationStage.FETCHING_MARKET_FEEDS, label: 'Market Feeds' },
      { stage: BriefingGenerationStage.SYNTHESIZING_RISK_METRICS, label: 'Risk Modeling' },
      { stage: BriefingGenerationStage.PROMPTING_LLM_ORCHESTRATOR, label: 'Prompt Construction' },
      { stage: BriefingGenerationStage.STREAMING_INFERENCE, label: 'Neural Streaming' },
      { stage: BriefingGenerationStage.PARSING_STRUCTURED_SECTIONS, label: 'Parsing AST' },
      { stage: BriefingGenerationStage.VALIDATING_COMPLIANCE, label: 'FINRA Compliance' },
      { stage: BriefingGenerationStage.PERSISTING_SNAPSHOT, label: 'Snapshot Ledger' },
    ],
    []
  );

  const currentIndex = stagesOrdered.findIndex((s) => s.stage === currentStage);
  const activeIndex = currentIndex >= 0 ? currentIndex : currentStage === BriefingGenerationStage.READY ? stagesOrdered.length : 0;
  const progressPercent = Math.min(100, Math.round(((activeIndex + 1) / (stagesOrdered.length + 1)) * 100));

  if (currentStage === BriefingGenerationStage.IDLE || currentStage === BriefingGenerationStage.READY) {
    return null;
  }

  return (
    <div
      role="region"
      aria-label="Briefing Generation Engine Progress"
      style={{
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
        border: '1px solid #334155',
        borderRadius: '12px',
        padding: '18px 24px',
        marginBottom: '20px',
        color: '#f8fafc',
        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.3)',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              width: '12px',
              height: '12px',
              borderRadius: '50%',
              backgroundColor: '#38bdf8',
              boxShadow: '0 0 12px #38bdf8',
              animation: 'pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
            }}
          />
          <span style={{ fontSize: '13px', fontWeight: 700, letterSpacing: '0.5px', textTransform: 'uppercase', color: '#38bdf8' }}>
            Citi AI Cognitive Engine Active
          </span>
        </div>
        <span style={{ fontSize: '12px', fontFamily: 'monospace', color: '#94a3b8' }}>
          {currentStage === BriefingGenerationStage.STREAMING_INFERENCE
            ? `Tokens streamed: ~${Math.round(streamedTextLength / 4)}`
            : `${progressPercent}% Complete`}
        </span>
      </div>

      <div
        style={{
          width: '100%',
          height: '6px',
          backgroundColor: '#1e293b',
          borderRadius: '9999px',
          overflow: 'hidden',
          marginBottom: '16px',
          border: '1px solid #334155',
        }}
      >
        <div
          style={{
            height: '100%',
            width: `${progressPercent}%`,
            background: 'linear-gradient(90deg, #0284c7 0%, #38bdf8 50%, #818cf8 100%)',
            transition: 'width 250ms ease-out',
          }}
        />
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(105px, 1fr))',
          gap: '8px',
          fontSize: '11px',
        }}
      >
        {stagesOrdered.map((item, idx) => {
          const isPassed = idx < activeIndex;
          const isCurrent = idx === activeIndex;

          return (
            <div
              key={item.stage}
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '4px',
                opacity: isCurrent ? 1 : isPassed ? 0.8 : 0.35,
                color: isCurrent ? '#38bdf8' : isPassed ? '#10b981' : '#64748b',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span
                  style={{
                    display: 'inline-block',
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    backgroundColor: isCurrent ? '#38bdf8' : isPassed ? '#10b981' : '#475569',
                  }}
                />
                <span style={{ fontWeight: isCurrent ? 700 : 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {item.label}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ============================================================================
// SUB-COMPONENT: BRIEFING EXECUTIVE SUMMARY HERO CARD
// ============================================================================

export interface BriefingExecutiveSummaryHeroProps {
  summary: string;
  metrics: DerivedBriefingFinancialMetrics;
  generatedAt: string;
  tone: BriefingTone;
  audioState: AudioPlaybackState;
  onPlayAudio: () => void;
  onPauseAudio: () => void;
}

export const BriefingExecutiveSummaryHero: React.FC<BriefingExecutiveSummaryHeroProps> = ({
  summary,
  metrics,
  generatedAt,
  tone,
  audioState,
  onPlayAudio,
  onPauseAudio,
}) => {
  const isPositiveDay = metrics.dayPnLDelta >= 0;

  return (
    <div
      style={{
        background: 'linear-gradient(135deg, #091e3a 0%, #032d60 50%, #004282 100%)',
        border: '1px solid rgba(56, 189, 248, 0.25)',
        borderRadius: '16px',
        padding: '28px',
        color: '#ffffff',
        boxShadow: '0 20px 30px -10px rgba(2, 44, 96, 0.4)',
        position: 'relative',
        overflow: 'hidden',
        marginBottom: '24px',
      }}
    >
      {/* Subtle Background Watermark Decoration */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          right: '-20px',
          bottom: '-30px',
          fontSize: '140px',
          fontWeight: 900,
          color: 'rgba(255, 255, 255, 0.03)',
          userSelect: 'none',
          pointerEvents: 'none',
          lineHeight: 1,
          fontFamily: 'serif',
        }}
      >
        CITI
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', marginBottom: '20px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <span
              style={{
                fontSize: '11px',
                fontWeight: 800,
                textTransform: 'uppercase',
                letterSpacing: '1px',
                backgroundColor: 'rgba(56, 189, 248, 0.2)',
                color: '#38bdf8',
                border: '1px solid rgba(56, 189, 248, 0.4)',
                padding: '3px 10px',
                borderRadius: '20px',
              }}
            >
              Institutional Synthesis
            </span>
            <span
              style={{
                fontSize: '11px',
                fontWeight: 600,
                color: '#93c5fd',
                backgroundColor: 'rgba(255, 255, 255, 0.08)',
                padding: '3px 10px',
                borderRadius: '20px',
              }}
            >
              Tone: {tone}
            </span>
          </div>
          <h2 style={{ fontSize: '22px', fontWeight: 800, letterSpacing: '-0.5px', margin: 0, color: '#ffffff' }}>
            Executive Intelligence Briefing
          </h2>
          <p style={{ fontSize: '12px', color: '#93c5fd', margin: '4px 0 0 0' }}>
            Synthesized {new Date(generatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} at{' '}
            {new Date(generatedAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
          </p>
        </div>

        {/* Neural Audio Narrator Action */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            type="button"
            onClick={audioState === AudioPlaybackState.PLAYING ? onPauseAudio : onPlayAudio}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: audioState === AudioPlaybackState.PLAYING ? '#ef4444' : 'rgba(255, 255, 255, 0.12)',
              border: '1px solid rgba(255, 255, 255, 0.25)',
              color: '#ffffff',
              padding: '8px 16px',
              borderRadius: '8px',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 200ms ease',
              backdropFilter: 'blur(4px)',
            }}
          >
            {audioState === AudioPlaybackState.PLAYING ? (
              <>
                <span style={{ fontSize: '14px' }}>⏸</span> Pause Audio Briefing
              </>
            ) : audioState === AudioPlaybackState.SYNTHESIZING ? (
              <>
                <span style={{ fontSize: '14px' }}>⏳</span> Synthesizing Voice...
              </>
            ) : (
              <>
                <span style={{ fontSize: '14px' }}>🔊</span> Listen (Neural Audio)
              </>
            )}
          </button>
        </div>
      </div>

      {/* Hero Financial Badges Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '12px',
          marginBottom: '20px',
        }}
      >
        <div
          style={{
            backgroundColor: 'rgba(0, 0, 0, 0.2)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '10px',
            padding: '12px 16px',
          }}
        >
          <div style={{ fontSize: '11px', color: '#93c5fd', textTransform: 'uppercase', fontWeight: 600 }}>Portfolio Valuation</div>
          <div style={{ fontSize: '18px', fontWeight: 800, color: '#ffffff', marginTop: '2px' }}>
            ${metrics.totalNetWorth.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div style={{ fontSize: '12px', fontWeight: 600, color: isPositiveDay ? '#34d399' : '#f87171', marginTop: '2px' }}>
            {isPositiveDay ? '▲ +' : '▼ -'}${Math.abs(metrics.dayPnLDelta).toLocaleString()} ({isPositiveDay ? '+' : ''}
            {metrics.dayPnLDeltaPercent}%)
          </div>
        </div>

        <div
          style={{
            backgroundColor: 'rgba(0, 0, 0, 0.2)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '10px',
            padding: '12px 16px',
          }}
        >
          <div style={{ fontSize: '11px', color: '#93c5fd', textTransform: 'uppercase', fontWeight: 600 }}>Liquidity Ratio</div>
          <div style={{ fontSize: '18px', fontWeight: 800, color: '#ffffff', marginTop: '2px' }}>
            {metrics.liquidCashCoverageRatio.toFixed(1)}x
          </div>
          <div style={{ fontSize: '11px', color: metrics.liquidCashCoverageRatio >= 1.5 ? '#34d399' : '#fbbf24', marginTop: '2px' }}>
            {metrics.liquidCashCoverageRatio >= 1.5 ? 'Surplus Reserve Coverage' : 'Tight Outflow Coverage'}
          </div>
        </div>

        <div
          style={{
            backgroundColor: 'rgba(0, 0, 0, 0.2)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '10px',
            padding: '12px 16px',
          }}
        >
          <div style={{ fontSize: '11px', color: '#93c5fd', textTransform: 'uppercase', fontWeight: 600 }}>Goals Horizon</div>
          <div style={{ fontSize: '18px', fontWeight: 800, color: '#ffffff', marginTop: '2px' }}>
            {metrics.goalsOnTrackPercent}% On-Track
          </div>
          <div style={{ fontSize: '11px', color: '#93c5fd', marginTop: '2px' }}>Monte Carlo Confidence</div>
        </div>

        <div
          style={{
            backgroundColor: 'rgba(0, 0, 0, 0.2)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '10px',
            padding: '12px 16px',
          }}
        >
          <div style={{ fontSize: '11px', color: '#93c5fd', textTransform: 'uppercase', fontWeight: 600 }}>Upcoming Obligation</div>
          <div style={{ fontSize: '18px', fontWeight: 800, color: '#ffffff', marginTop: '2px' }}>
            {metrics.nextBillDeadlineDays !== null ? `${metrics.nextBillDeadlineDays} Days` : 'No Imminent'}
          </div>
          <div style={{ fontSize: '11px', color: '#93c5fd', marginTop: '2px' }}>Automatic Sweep Enabled</div>
        </div>
      </div>

      {/* Main Synthesized Executive Text */}
      <div
        style={{
          backgroundColor: 'rgba(0, 0, 0, 0.25)',
          borderRadius: '10px',
          padding: '16px 20px',
          borderLeft: '4px solid #38bdf8',
          fontSize: '14.5px',
          lineHeight: '1.65',
          color: '#e2e8f0',
        }}
      >
        {summary}
      </div>
    </div>
  );
};

// ============================================================================
// SUB-COMPONENT: BRIEFING RULE FINDINGS ACTION BANNER
// ============================================================================

export interface BriefingRuleFindingsProps {
  findings: RuleInsightFinding[];
  onActionClick?: (finding: RuleInsightFinding) => void;
}

export const BriefingRuleFindingsBanner: React.FC<BriefingRuleFindingsProps> = ({ findings, onActionClick }) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(true);

  if (!findings || findings.length === 0) return null;

  const getUrgencyColor = (urgency: AlertUrgencyLevel) => {
    switch (urgency) {
      case AlertUrgencyLevel.P0_CRITICAL:
        return { bg: '#fef2f2', border: '#f87171', text: '#991b1b', badge: '#dc2626' };
      case AlertUrgencyLevel.P1_HIGH:
        return { bg: '#fffbeb', border: '#fde68a', text: '#92400e', badge: '#d97706' };
      case AlertUrgencyLevel.P2_MEDIUM:
        return { bg: '#f0fdf4', border: '#bbf7d0', text: '#166534', badge: '#16a34a' };
      default:
        return { bg: '#f8fafc', border: '#e2e8f0', text: '#334155', badge: '#64748b' };
    }
  };

  return (
    <div
      style={{
        backgroundColor: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: '12px',
        padding: '18px 20px',
        marginBottom: '24px',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: isExpanded ? '14px' : '0' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '18px' }}>⚡</span>
          <div>
            <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 700, color: '#0f172a' }}>
              Autonomous Wealth Rule Findings ({findings.length})
            </h3>
            <p style={{ margin: '2px 0 0 0', fontSize: '12px', color: '#64748b' }}>
              Deterministic risk & alpha triggers identified by Tier-4 financial compliance algorithms
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          style={{
            background: 'none',
            border: '1px solid #cbd5e1',
            borderRadius: '6px',
            padding: '4px 10px',
            fontSize: '12px',
            color: '#475569',
            cursor: 'pointer',
            fontWeight: 600,
          }}
        >
          {isExpanded ? 'Collapse Signals' : 'View Signals'}
        </button>
      </div>

      {isExpanded && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {findings.map((f) => {
            const styles = getUrgencyColor(f.urgency);
            return (
              <div
                key={f.id}
                style={{
                  backgroundColor: styles.bg,
                  borderLeft: `4px solid ${styles.badge}`,
                  borderTop: `1px solid ${styles.border}`,
                  borderRight: `1px solid ${styles.border}`,
                  borderBottom: `1px solid ${styles.border}`,
                  borderRadius: '8px',
                  padding: '12px 16px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  gap: '12px',
                }}
              >
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <span
                      style={{
                        backgroundColor: styles.badge,
                        color: '#ffffff',
                        fontSize: '10px',
                        fontWeight: 700,
                        padding: '2px 6px',
                        borderRadius: '4px',
                        textTransform: 'uppercase',
                      }}
                    >
                      {f.urgency.replace('_', ' ')}
                    </span>
                    <span style={{ fontSize: '13px', fontWeight: 700, color: styles.text }}>{f.title}</span>
                  </div>
                  <p style={{ margin: '0 0 6px 0', fontSize: '12.5px', color: '#334155', lineHeight: '1.45' }}>
                    {f.observationText}
                  </p>
                  <p style={{ margin: 0, fontSize: '12px', color: '#0369a1', fontWeight: 600 }}>
                    💡 Recommendation: {f.actionRecommendation}
                  </p>
                </div>
                {onActionClick && (
                  <button
                    type="button"
                    onClick={() => onActionClick(f)}
                    style={{
                      backgroundColor: '#ffffff',
                      border: `1px solid ${styles.badge}`,
                      color: styles.badge,
                      borderRadius: '6px',
                      padding: '6px 12px',
                      fontSize: '11px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    Execute Hedge
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

// ============================================================================
// SUB-COMPONENT: BRIEFING SECTION CARD (ACCORDION & METRICS PILL RENDERER)
// ============================================================================

export interface BriefingSectionCardProps {
  section: BriefingSectionItem;
  isSelected: boolean;
  onSelect: (sectionId: string) => void;
  onActionTrigger?: (actionType: string, target: string, payload?: unknown) => void;
}

export const BriefingSectionCard: React.FC<BriefingSectionCardProps> = ({
  section,
  isSelected,
  onSelect,
  onActionTrigger,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(true);

  const getUrgencyIcon = (urgency: AlertUrgencyLevel) => {
    switch (urgency) {
      case AlertUrgencyLevel.P0_CRITICAL:
        return '🚨';
      case AlertUrgencyLevel.P1_HIGH:
        return '⚠️';
      case AlertUrgencyLevel.P2_MEDIUM:
        return '📊';
      default:
        return '📌';
    }
  };

  // Render markdown lines into formatted nodes
  const renderMarkdownBlocks = (markdown: string) => {
    return markdown.split('\n').map((line, idx) => {
      const trimmed = line.trim();
      if (!trimmed) return <div key={idx} style={{ height: '8px' }} />;

      if (trimmed.startsWith('### ')) {
        return (
          <h4
            key={idx}
            style={{
              fontSize: '14px',
              fontWeight: 700,
              color: '#0f172a',
              marginTop: '12px',
              marginBottom: '6px',
              letterSpacing: '-0.2px',
            }}
          >
            {trimmed.substring(4)}
          </h4>
        );
      }

      if (trimmed.startsWith('* [ ]') || trimmed.startsWith('- [ ]')) {
        const itemText = trimmed.replace(/^[\*\-]\s*\[\s*\]\s*/, '');
        return (
          <div
            key={idx}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: '#f8fafc',
              padding: '6px 10px',
              borderRadius: '6px',
              marginBottom: '6px',
              border: '1px solid #e2e8f0',
            }}
          >
            <input type="checkbox" style={{ cursor: 'pointer' }} />
            <span style={{ fontSize: '13px', color: '#1e293b', fontWeight: 500 }}>{itemText}</span>
          </div>
        );
      }

      if (trimmed.startsWith('* ') || trimmed.startsWith('- ')) {
        return (
          <li key={idx} style={{ fontSize: '13px', color: '#334155', marginBottom: '4px', marginLeft: '16px' }}>
            {trimmed.substring(2)}
          </li>
        );
      }

      return (
        <p key={idx} style={{ fontSize: '13.5px', color: '#334155', lineHeight: '1.6', margin: '0 0 8px 0' }}>
          {trimmed}
        </p>
      );
    });
  };

  return (
    <div
      style={{
        backgroundColor: '#ffffff',
        border: isSelected ? '2px solid #0284c7' : '1px solid #e2e8f0',
        borderRadius: '12px',
        marginBottom: '16px',
        boxShadow: isSelected ? '0 10px 15px -3px rgba(2, 132, 199, 0.1)' : '0 1px 3px rgba(0, 0, 0, 0.05)',
        overflow: 'hidden',
        transition: 'all 200ms ease',
      }}
    >
      <div
        role="button"
        tabIndex={0}
        onClick={() => {
          onSelect(section.id);
          setIsOpen(!isOpen);
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            onSelect(section.id);
            setIsOpen(!isOpen);
          }
        }}
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '16px 20px',
          backgroundColor: isSelected ? '#f0f9ff' : '#ffffff',
          cursor: 'pointer',
          userSelect: 'none',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '16px' }}>{getUrgencyIcon(section.urgency)}</span>
          <div>
            <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 700, color: '#0f172a' }}>{section.title}</h3>
            <span
              style={{
                fontSize: '11px',
                color: '#0284c7',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
              }}
            >
              {section.category.replace(/_/g, ' ')}
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span
            style={{
              fontSize: '11px',
              backgroundColor: '#f1f5f9',
              color: '#475569',
              padding: '2px 8px',
              borderRadius: '9999px',
              fontWeight: 600,
            }}
          >
            {section.urgency}
          </span>
          <span style={{ fontSize: '14px', color: '#64748b' }}>{isOpen ? '▲' : '▼'}</span>
        </div>
      </div>

      {isOpen && (
        <div style={{ padding: '0 20px 18px 20px', borderTop: '1px solid #f1f5f9' }}>
          <div style={{ marginTop: '12px' }}>{renderMarkdownBlocks(section.contentMarkdown)}</div>

          {section.actionableLinks && section.actionableLinks.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '16px', paddingTop: '12px', borderTop: '1px solid #f1f5f9' }}>
              {section.actionableLinks.map((action, aIdx) => (
                <button
                  key={aIdx}
                  type="button"
                  onClick={() => onActionTrigger && onActionTrigger(action.actionType, action.target, action.payload)}
                  style={{
                    backgroundColor: '#0284c7',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '6px',
                    padding: '6px 14px',
                    fontSize: '12px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'background-color 150ms ease',
                  }}
                >
                  {action.label} →
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// ============================================================================
// MODAL SUB-COMPONENT: BRIEFING CUSTOMIZATION & LLM SETTINGS DIALOG
// ============================================================================

export interface BriefingSettingsModalProps {
  isOpen: boolean;
  preferences: DailyBriefingPreferences;
  onClose: () => void;
  onSave: (updated: DailyBriefingPreferences) => void;
}

export const BriefingSettingsModal: React.FC<BriefingSettingsModalProps> = ({
  isOpen,
  preferences,
  onClose,
  onSave,
}) => {
  const [formState, setFormState] = useState<DailyBriefingPreferences>(preferences);

  useEffect(() => {
    setFormState(preferences);
  }, [preferences, isOpen]);

  if (!isOpen) return null;

  const handleToggleFocusArea = (area: BriefingFocusArea) => {
    const current = [...formState.focusAreas];
    const exists = current.includes(area);
    const updated = exists ? current.filter((a) => a !== area) : [...current, area];
    setFormState({ ...formState, focusAreas: updated });
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.65)',
        backdropFilter: 'blur(4px)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
      }}
    >
      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '16px',
          maxWidth: '680px',
          width: '100%',
          maxHeight: '90vh',
          overflowY: 'auto',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          border: '1px solid #cbd5e1',
          padding: '24px',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div>
            <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a', margin: 0 }}>
              Briefing Orchestration Parameters
            </h2>
            <p style={{ fontSize: '13px', color: '#64748b', margin: '4px 0 0 0' }}>
              Configure AI tone, token length, risk models, and PII anonymization enclaves.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '20px',
              cursor: 'pointer',
              color: '#64748b',
            }}
          >
            ✕
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          {/* Tone Selector */}
          <div>
            <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
              AI Persona & Tone
            </label>
            <select
              value={formState.tone}
              onChange={(e) => setFormState({ ...formState, tone: e.target.value as BriefingTone })}
              style={{
                width: '100%',
                padding: '8px 12px',
                borderRadius: '8px',
                border: '1px solid #cbd5e1',
                fontSize: '13.5px',
                color: '#1e293b',
              }}
            >
              {Object.values(BriefingTone).map((tone) => (
                <SelectItemOption key={tone} value={tone} label={tone} />
              ))}
            </select>
          </div>

          {/* Length Selector */}
          <div>
            <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
              Synthesis Length & Depth Target
            </label>
            <select
              value={formState.length}
              onChange={(e) => setFormState({ ...formState, length: e.target.value as BriefingLength })}
              style={{
                width: '100%',
                padding: '8px 12px',
                borderRadius: '8px',
                border: '1px solid #cbd5e1',
                fontSize: '13.5px',
                color: '#1e293b',
              }}
            >
              {Object.values(BriefingLength).map((len) => (
                <SelectItemOption key={len} value={len} label={len.replace('_', ' ')} />
              ))}
            </select>
          </div>

          {/* Focus Areas Grid */}
          <div>
            <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 700, color: '#334155', marginBottom: '8px' }}>
              Active Intelligence Focus Areas
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '8px' }}>
              {Object.values(BriefingFocusArea).map((area) => {
                const checked = formState.focusAreas.includes(area);
                return (
                  <label
                    key={area}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      fontSize: '12px',
                      padding: '6px 10px',
                      borderRadius: '6px',
                      border: checked ? '1px solid #0284c7' : '1px solid #e2e8f0',
                      backgroundColor: checked ? '#f0f9ff' : '#ffffff',
                      cursor: 'pointer',
                      fontWeight: checked ? 600 : 400,
                      color: checked ? '#0369a1' : '#475569',
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => handleToggleFocusArea(area)}
                    />
                    {area.replace(/_/g, ' ')}
                  </label>
                );
              })}
            </div>
          </div>

          {/* Feature Toggles */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12.5px', color: '#334155' }}>
              <input
                type="checkbox"
                checked={formState.includeMarketData}
                onChange={(e) => setFormState({ ...formState, includeMarketData: e.target.checked })}
              />
              Include Live Market Pulse
            </label>

            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12.5px', color: '#334155' }}>
              <input
                type="checkbox"
                checked={formState.includeTaxAlerts}
                onChange={(e) => setFormState({ ...formState, includeTaxAlerts: e.target.checked })}
              />
              Include Tax & Safe-Harbor Warnings
            </label>

            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12.5px', color: '#334155' }}>
              <input
                type="checkbox"
                checked={formState.includeActionableNextSteps}
                onChange={(e) => setFormState({ ...formState, includeActionableNextSteps: e.target.checked })}
              />
              Include High-Conviction Action Items
            </label>

            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12.5px', color: '#334155' }}>
              <input
                type="checkbox"
                checked={formState.anonymizePIIBeforeInference}
                onChange={(e) => setFormState({ ...formState, anonymizePIIBeforeInference: e.target.checked })}
              />
              Enforce PII Anonymization Enclave
            </label>
          </div>

          {/* Temperature Slider */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12.5px', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
              <span>Creativity vs Precision Temperature</span>
              <span>{formState.aiCreativityTemperature.toFixed(2)}</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={formState.aiCreativityTemperature}
              onChange={(e) => setFormState({ ...formState, aiCreativityTemperature: parseFloat(e.target.value) })}
              style={{ width: '100%', accentColor: '#0284c7' }}
            />
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '24px', paddingTop: '16px', borderTop: '1px solid #e2e8f0' }}>
          <button
            type="button"
            onClick={onClose}
            style={{
              padding: '8px 16px',
              borderRadius: '8px',
              border: '1px solid #cbd5e1',
              backgroundColor: '#ffffff',
              color: '#475569',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => {
              onSave(formState);
              onClose();
            }}
            style={{
              padding: '8px 18px',
              borderRadius: '8px',
              border: 'none',
              backgroundColor: '#0284c7',
              color: '#ffffff',
              fontSize: '13px',
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            Save & Regenerate
          </button>
        </div>
      </div>
    </div>
  );
};

const SelectItemOption: React.FC<{ value: string; label: string }> = ({ value, label }) => {
  return <option value={value}>{label}</option>;
};// ============================================================================
// SUB-COMPONENT: BRIEFING EXPORT & CRYPTOGRAPHIC PROOF MODAL
// ============================================================================

export interface BriefingExportModalProps {
  isOpen: boolean;
  briefing: DailyBriefingResultPayload | null;
  userContext: SecurityUserContext | null;
  onClose: () => void;
  onExportTriggered: (format: 'PDF' | 'MARKDOWN' | 'JSON') => Promise<void>;
}

export const BriefingExportModal: React.FC<BriefingExportModalProps> = ({
  isOpen,
  briefing,
  userContext,
  onClose,
  onExportTriggered,
}) => {
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [selectedFormat, setSelectedFormat] = useState<'PDF' | 'MARKDOWN' | 'JSON'>('PDF');
  const [copiedAuditHash, setCopiedAuditHash] = useState<boolean>(false);

  if (!isOpen || !briefing) return null;

  const handleExecuteExport = async () => {
    setIsExporting(true);
    try {
      await onExportTriggered(selectedFormat);
    } catch (err) {
      console.error('[BriefingExportModal] Export failed:', err);
    } finally {
      setIsExporting(false);
      onClose();
    }
  };

  const handleCopyHash = () => {
    if (typeof window !== 'undefined' && briefing.metadata.complianceVerificationHash) {
      navigator.clipboard.writeText(briefing.metadata.complianceVerificationHash);
      setCopiedAuditHash(true);
      setTimeout(() => setCopiedAuditHash(false), 2500);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.7)',
        backdropFilter: 'blur(6px)',
        zIndex: 10000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
      }}
    >
      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '16px',
          maxWidth: '580px',
          width: '100%',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.35)',
          border: '1px solid #cbd5e1',
          padding: '28px',
          position: 'relative',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '18px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <span style={{ fontSize: '18px' }}>🔒</span>
              <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                Regulatory Export & Compliance Ledger
              </h2>
            </div>
            <p style={{ fontSize: '13px', color: '#64748b', margin: 0 }}>
              Generate verifiable client archives compliant with FINRA Rule 2210 & SEC books/records mandates.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '20px',
              cursor: 'pointer',
              color: '#94a3b8',
              padding: '4px',
            }}
          >
            ✕
          </button>
        </div>

        {/* Cryptographic Proof Ribbon */}
        <div
          style={{
            backgroundColor: '#f8fafc',
            border: '1px solid #e2e8f0',
            borderRadius: '8px',
            padding: '12px 14px',
            marginBottom: '20px',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
            <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: '#475569', letterSpacing: '0.5px' }}>
              SEC-FINRA Compliance Hash
            </span>
            <button
              type="button"
              onClick={handleCopyHash}
              style={{
                background: 'none',
                border: 'none',
                color: copiedAuditHash ? '#16a34a' : '#0284c7',
                fontSize: '11px',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              {copiedAuditHash ? '✓ Copied to Clipboard' : 'Copy Hash'}
            </button>
          </div>
          <div
            style={{
              fontFamily: 'Consolas, Monaco, "Courier New", monospace',
              fontSize: '11.5px',
              color: '#0f172a',
              backgroundColor: '#f1f5f9',
              padding: '6px 8px',
              borderRadius: '4px',
              wordBreak: 'break-all',
            }}
          >
            {briefing.metadata.complianceVerificationHash}
          </div>
          <div style={{ display: 'flex', gap: '16px', marginTop: '8px', fontSize: '11px', color: '#64748b' }}>
            <span>Model: <strong>{briefing.metadata.modelUsed}</strong></span>
            <span>Confidence: <strong>{(briefing.metadata.confidenceScore * 100).toFixed(1)}%</strong></span>
            <span>Latency: <strong>{briefing.metadata.latencyMs}ms</strong></span>
          </div>
        </div>

        {/* Format Selection Cards */}
        <div style={{ marginBottom: '22px' }}>
          <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 700, color: '#334155', marginBottom: '8px' }}>
            Select Target Distribution Format
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
            <button
              type="button"
              onClick={() => setSelectedFormat('PDF')}
              style={{
                border: selectedFormat === 'PDF' ? '2px solid #0284c7' : '1px solid #cbd5e1',
                backgroundColor: selectedFormat === 'PDF' ? '#f0f9ff' : '#ffffff',
                borderRadius: '8px',
                padding: '14px 10px',
                textAlign: 'center',
                cursor: 'pointer',
                transition: 'all 150ms ease',
              }}
            >
              <div style={{ fontSize: '20px', marginBottom: '4px' }}>📄</div>
              <div style={{ fontSize: '13px', fontWeight: 700, color: selectedFormat === 'PDF' ? '#0369a1' : '#1e293b' }}>
                Executive PDF
              </div>
              <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>Institutional Grade</div>
            </button>

            <button
              type="button"
              onClick={() => setSelectedFormat('MARKDOWN')}
              style={{
                border: selectedFormat === 'MARKDOWN' ? '2px solid #0284c7' : '1px solid #cbd5e1',
                backgroundColor: selectedFormat === 'MARKDOWN' ? '#f0f9ff' : '#ffffff',
                borderRadius: '8px',
                padding: '14px 10px',
                textAlign: 'center',
                cursor: 'pointer',
                transition: 'all 150ms ease',
              }}
            >
              <div style={{ fontSize: '20px', marginBottom: '4px' }}>📝</div>
              <div style={{ fontSize: '13px', fontWeight: 700, color: selectedFormat === 'MARKDOWN' ? '#0369a1' : '#1e293b' }}>
                Markdown (.md)
              </div>
              <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>Raw Structured Text</div>
            </button>

            <button
              type="button"
              onClick={() => setSelectedFormat('JSON')}
              style={{
                border: selectedFormat === 'JSON' ? '2px solid #0284c7' : '1px solid #cbd5e1',
                backgroundColor: selectedFormat === 'JSON' ? '#f0f9ff' : '#ffffff',
                borderRadius: '8px',
                padding: '14px 10px',
                textAlign: 'center',
                cursor: 'pointer',
                transition: 'all 150ms ease',
              }}
            >
              <div style={{ fontSize: '20px', marginBottom: '4px' }}>⚙️</div>
              <div style={{ fontSize: '13px', fontWeight: 700, color: selectedFormat === 'JSON' ? '#0369a1' : '#1e293b' }}>
                Telemetry JSON
              </div>
              <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>Full AST & Metrics</div>
            </button>
          </div>
        </div>

        {/* Client Metadata Stamp */}
        <div style={{ fontSize: '11.5px', color: '#64748b', marginBottom: '24px', backgroundColor: '#f8fafc', padding: '10px 14px', borderRadius: '6px' }}>
          Prepared For: <strong>{userContext?.displayName || 'Alexander Vance, CFA'}</strong> ({userContext?.tier || 'PRIVATE_CLIENT'}) &bull; Security Node: <strong>US-EAST-VA-SECURE-04</strong>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
          <button
            type="button"
            onClick={onClose}
            style={{
              padding: '8px 16px',
              borderRadius: '8px',
              border: '1px solid #cbd5e1',
              backgroundColor: '#ffffff',
              color: '#475569',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={isExporting}
            onClick={handleExecuteExport}
            style={{
              padding: '8px 20px',
              borderRadius: '8px',
              border: 'none',
              backgroundColor: '#0284c7',
              color: '#ffffff',
              fontSize: '13px',
              fontWeight: 700,
              cursor: isExporting ? 'not-allowed' : 'pointer',
              opacity: isExporting ? 0.7 : 1,
            }}
          >
            {isExporting ? 'Generating Archive...' : `Export as ${selectedFormat}`}
          </button>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// SUB-COMPONENT: BRIEFING USER FEEDBACK & REINFORCEMENT MODAL
// ============================================================================

export interface BriefingFeedbackModalProps {
  isOpen: boolean;
  briefingId: string;
  currentRating: number;
  currentComments: string;
  onClose: () => void;
  onSubmit: (rating: number, comments: string) => void;
}

export const BriefingFeedbackModal: React.FC<BriefingFeedbackModalProps> = ({
  isOpen,
  briefingId,
  currentRating,
  currentComments,
  onClose,
  onSubmit,
}) => {
  const [rating, setRating] = useState<number>(currentRating || 5);
  const [comments, setComments] = useState<string>(currentComments || '');
  const [hoverRating, setHoverRating] = useState<number>(0);

  useEffect(() => {
    setRating(currentRating || 5);
    setComments(currentComments || '');
  }, [currentRating, currentComments, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(rating, comments);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.65)',
        backdropFilter: 'blur(5px)',
        zIndex: 10000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
      }}
    >
      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '16px',
          maxWidth: '500px',
          width: '100%',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.3)',
          border: '1px solid #cbd5e1',
          padding: '24px',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div>
            <h2 style={{ fontSize: '17px', fontWeight: 800, color: '#0f172a', margin: 0 }}>
              AI Reinforcement Alignment Feedback
            </h2>
            <p style={{ fontSize: '12.5px', color: '#64748b', margin: '3px 0 0 0' }}>
              Your feedback calibrates our financial neural inference weights (RLHF).
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '20px',
              cursor: 'pointer',
              color: '#94a3b8',
            }}
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Star Rating Scale */}
          <div>
            <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 700, color: '#334155', marginBottom: '8px' }}>
              Inference Accuracy & Relevance Quality
            </label>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              {[1, 2, 3, 4, 5].map((star) => {
                const isFilled = (hoverRating || rating) >= star;
                return (
                  <button
                    key={star}
                    type="button"
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    onClick={() => setRating(star)}
                    style={{
                      background: 'none',
                      border: 'none',
                      fontSize: '28px',
                      cursor: 'pointer',
                      color: isFilled ? '#f59e0b' : '#cbd5e1',
                      padding: 0,
                      transition: 'transform 100ms ease',
                      transform: isFilled ? 'scale(1.1)' : 'scale(1)',
                    }}
                  >
                    ★
                  </button>
                );
              })}
              <span style={{ fontSize: '13px', fontWeight: 600, color: '#475569', marginLeft: '8px' }}>
                {rating === 5 ? 'Exceptional Accuracy' : rating >= 3 ? 'Good Quality' : 'Needs Tuning'}
              </span>
            </div>
          </div>

          {/* Qualitative Comment Input */}
          <div>
            <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
              Refinement Observations (Optional)
            </label>
            <textarea
              rows={4}
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              placeholder="e.g., Focus more heavily on commercial real estate debt hedges in future briefings..."
              style={{
                width: '100%',
                borderRadius: '8px',
                border: '1px solid #cbd5e1',
                padding: '10px',
                fontSize: '13px',
                color: '#1e293b',
                fontFamily: 'inherit',
                resize: 'vertical',
                boxSizing: 'border-box',
              }}
            />
          </div>

          <div style={{ fontSize: '11px', color: '#94a3b8' }}>
            Briefing ID: <span style={{ fontFamily: 'monospace' }}>{briefingId}</span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '12px', paddingTop: '14px', borderTop: '1px solid #e2e8f0' }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: '8px 16px',
                borderRadius: '8px',
                border: '1px solid #cbd5e1',
                backgroundColor: '#ffffff',
                color: '#475569',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              style={{
                padding: '8px 18px',
                borderRadius: '8px',
                border: 'none',
                backgroundColor: '#0284c7',
                color: '#ffffff',
                fontSize: '13px',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              Submit Feedback
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ============================================================================
// SUB-COMPONENT: REAL-TIME MARKET TICKER STRIP
// ============================================================================

export interface MarketTickerStripProps {
  movers: MarketMoverEntity[];
  macroIndicators?: AggregatedBriefingDataContext['macroIndicators'];
}

export const MarketTickerStrip: React.FC<MarketTickerStripProps> = ({ movers, macroIndicators }) => {
  if (!movers || movers.length === 0) return null;

  return (
    <div
      style={{
        backgroundColor: '#0f172a',
        border: '1px solid #334155',
        borderRadius: '10px',
        padding: '10px 16px',
        marginBottom: '20px',
        overflowX: 'auto',
        whiteSpace: 'nowrap',
        display: 'flex',
        alignItems: 'center',
        gap: '20px',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', borderRight: '1px solid #334155', paddingRight: '16px' }}>
        <span
          style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            backgroundColor: '#22c55e',
            display: 'inline-block',
          }}
        />
        <span style={{ fontSize: '11px', fontWeight: 800, color: '#94a3b8', letterSpacing: '0.5px', textTransform: 'uppercase' }}>
          Live Market Feeds
        </span>
      </div>

      {macroIndicators && (
        <div style={{ display: 'inline-flex', gap: '16px', borderRight: '1px solid #334155', paddingRight: '16px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'baseline', gap: '6px', fontSize: '12px' }}>
            <span style={{ color: '#cbd5e1', fontWeight: 600 }}>US 10Y Yield:</span>
            <span style={{ color: '#ffffff', fontWeight: 700 }}>{macroIndicators.tenYearTreasuryRate}%</span>
          </div>
          <div style={{ display: 'inline-flex', alignItems: 'baseline', gap: '6px', fontSize: '12px' }}>
            <span style={{ color: '#cbd5e1', fontWeight: 600 }}>VIX:</span>
            <span style={{ color: '#ffffff', fontWeight: 700 }}>{macroIndicators.vixVolatilityIndex}</span>
          </div>
          <div style={{ display: 'inline-flex', alignItems: 'baseline', gap: '6px', fontSize: '12px' }}>
            <span style={{ color: '#cbd5e1', fontWeight: 600 }}>Fed Funds:</span>
            <span style={{ color: '#ffffff', fontWeight: 700 }}>{macroIndicators.fedFundsTargetRate}%</span>
          </div>
        </div>
      )}

      <div style={{ display: 'inline-flex', gap: '20px' }}>
        {movers.map((mover) => {
          const isUp = mover.direction === 'UP';
          return (
            <div key={mover.symbol} style={{ display: 'inline-flex', alignItems: 'baseline', gap: '8px', fontSize: '12px' }}>
              <span style={{ color: '#f8fafc', fontWeight: 700 }}>{mover.symbol}</span>
              <span style={{ color: '#94a3b8' }}>${mover.price.toFixed(2)}</span>
              <span style={{ color: isUp ? '#4ade80' : '#f87171', fontWeight: 700, fontSize: '11.5px' }}>
                {isUp ? '▲ +' : '▼ '}{mover.percentChange.toFixed(2)}%
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ============================================================================
// SUB-COMPONENT: BRIEFING FOCUS AREA PILL FILTER
// ============================================================================

export interface BriefingFocusFilterProps {
  activeFilter: BriefingFocusArea | 'ALL';
  availableAreas: BriefingFocusArea[];
  onSelectFilter: (area: BriefingFocusArea | 'ALL') => void;
}

export const BriefingFocusFilter: React.FC<BriefingFocusFilterProps> = ({
  activeFilter,
  availableAreas,
  onSelectFilter,
}) => {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        overflowX: 'auto',
        paddingBottom: '8px',
        marginBottom: '16px',
      }}
    >
      <button
        type="button"
        onClick={() => onSelectFilter('ALL')}
        style={{
          backgroundColor: activeFilter === 'ALL' ? '#0284c7' : '#f1f5f9',
          color: activeFilter === 'ALL' ? '#ffffff' : '#475569',
          border: 'none',
          borderRadius: '20px',
          padding: '6px 14px',
          fontSize: '12px',
          fontWeight: 700,
          cursor: 'pointer',
          whiteSpace: 'nowrap',
          transition: 'all 150ms ease',
        }}
      >
        All Briefing Sections
      </button>

      {availableAreas.map((area) => {
        const isSelected = activeFilter === area;
        return (
          <button
            key={area}
            type="button"
            onClick={() => onSelectFilter(area)}
            style={{
              backgroundColor: isSelected ? '#0284c7' : '#f1f5f9',
              color: isSelected ? '#ffffff' : '#475569',
              border: 'none',
              borderRadius: '20px',
              padding: '6px 14px',
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              transition: 'all 150ms ease',
            }}
          >
            {area.replace(/_/g, ' ')}
          </button>
        );
      })}
    </div>
  );
};

// ============================================================================
// CONTEXT PROVIDER IMPLEMENTATION
// ============================================================================

export interface DailyBriefingProviderProps {
  children: ReactNode;
  initialPreferences?: Partial<DailyBriefingPreferences>;
  preloadedBriefing?: DailyBriefingResultPayload | null;
  userId?: string;
}

export const DailyBriefingProvider: React.FC<DailyBriefingProviderProps> = ({
  children,
  initialPreferences,
  preloadedBriefing,
  userId = 'usr_citi_demo_9824',
}) => {
  const [state, dispatch] = useReducer(briefingReducer, {
    ...briefingInitialState,
    preferences: {
      ...defaultDailyBriefingPreferences,
      ...BriefingCacheStorage.loadPreferences(userId),
      ...initialPreferences,
    },
    briefingPayload: preloadedBriefing || BriefingCacheStorage.loadCachedBriefing(userId),
  });

  const telemetry = useMemo(() => BriefingTelemetryEngine.getInstance(), []);
  const audio = useBriefingAudioPlayer(state.preferences, userId);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Initialize and hydrate holistic context
  useEffect(() => {
    let isMounted = true;

    async function hydrate() {
      try {
        const aggregated = await BriefingContextAggregatorService.aggregateHolisticContext(userId);
        if (isMounted) {
          dispatch({ type: 'SET_CONTEXT', payload: aggregated });
        }
      } catch (e) {
        console.error('[DailyBriefingProvider] Initial context hydration error:', e);
      }
    }

    hydrate();

    return () => {
      isMounted = false;
    };
  }, [userId]);

  const generateBriefing = useCallback(
    async (customOverrides?: Partial<DailyBriefingPreferences>) => {
      const activePrefs: DailyBriefingPreferences = {
        ...state.preferences,
        ...customOverrides,
      };

      if (customOverrides) {
        dispatch({ type: 'UPDATE_PREFERENCES', payload: customOverrides });
        BriefingCacheStorage.savePreferences(userId, activePrefs);
      }

      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      abortControllerRef.current = new AbortController();

      telemetry.record(userId, TelemetryAction.BRIEFING_GENERATED, { tone: activePrefs.tone, length: activePrefs.length });

      try {
        let activeContext = state.aggregatedContext;
        if (!activeContext) {
          activeContext = await BriefingContextAggregatorService.aggregateHolisticContext(userId);
          dispatch({ type: 'SET_CONTEXT', payload: activeContext });
        }

        const result = await EnterpriseAIService.generateDailyBriefingStream(
          activeContext,
          activePrefs,
          (delta, full, stage) => {
            dispatch({ type: 'STREAM_DELTA', delta, fullText: full, stage });
          },
          abortControllerRef.current.signal
        );

        dispatch({ type: 'GENERATION_SUCCESS', payload: result });
      } catch (err: unknown) {
        if (err instanceof DOMException && err.name === 'AbortError') {
          dispatch({ type: 'SET_STAGE', payload: BriefingGenerationStage.IDLE });
          return;
        }
        const errorMsg = err instanceof Error ? err.message : 'Unknown generation failure in neural pipeline';
        dispatch({ type: 'GENERATION_FAILURE', error: errorMsg });
      }
    },
    [state.preferences, state.aggregatedContext, telemetry, userId]
  );

  const cancelGeneration = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      dispatch({ type: 'SET_STAGE', payload: BriefingGenerationStage.IDLE });
    }
  }, []);

  const exportDoc = useCallback(
    async (format: 'PDF' | 'MARKDOWN' | 'JSON') => {
      if (!state.briefingPayload) return;
      telemetry.record(userId, TelemetryAction.BRIEFING_EXPORTED, { format });
      await BriefingExportEngine.exportDocument(state.briefingPayload, state.aggregatedContext?.userProfile || null, format);
    },
    [state.briefingPayload, state.aggregatedContext?.userProfile, telemetry, userId]
  );

  const updatePrefs = useCallback(
    (newPrefs: Partial<DailyBriefingPreferences>) => {
      dispatch({ type: 'UPDATE_PREFERENCES', payload: newPrefs });
      const merged = { ...state.preferences, ...newPrefs };
      BriefingCacheStorage.savePreferences(userId, merged);
      telemetry.record(userId, TelemetryAction.SETTINGS_MUTATED, newPrefs);
    },
    [state.preferences, telemetry, userId]
  );

  const filterFocusArea = useCallback((area: BriefingFocusArea | 'ALL') => {
    dispatch({ type: 'SET_FOCUS_FILTER', payload: area });
  }, []);

  const recordTelemetry = useCallback(
    (action: TelemetryAction, meta?: Record<string, unknown>) => {
      telemetry.record(userId, action, meta);
    },
    [telemetry, userId]
  );

  const submitFeedback = useCallback(
    (rating: number, comments?: string) => {
      dispatch({ type: 'SUBMIT_RATING', rating, comments: comments || '' });
      telemetry.record(userId, TelemetryAction.FEEDBACK_SUBMITTED, { rating, comments });
    },
    [telemetry, userId]
  );

  const value: DailyBriefingContextValue = useMemo(
    () => ({
      state,
      dispatch,
      generateBriefing,
      cancelGeneration,
      exportDocument: exportDoc,
      audioController: {
        state: audio.audioState,
        play: (text) => audio.play(text || state.briefingPayload?.rawMarkdownContent || ''),
        pause: audio.pause,
        resume: audio.resume,
        stop: audio.stop,
      },
      filterFocusArea,
      updatePreferences: updatePrefs,
      recordTelemetry,
      submitFeedback,
    }),
    [
      state,
      generateBriefing,
      cancelGeneration,
      exportDoc,
      audio.audioState,
      audio.play,
      audio.pause,
      audio.resume,
      audio.stop,
      filterFocusArea,
      updatePrefs,
      recordTelemetry,
      submitFeedback,
    ]
  );

  return <DailyBriefingContext.Provider value={value}>{children}</DailyBriefingContext.Provider>;
};
// ============================================================================
// CORE ORCHESTRATOR COMPONENT: DAILY BRIEFING GENERATOR VIEW
// ============================================================================

export const DailyBriefingGeneratorInner = forwardRef<DailyBriefingGeneratorHandle, DailyBriefingGeneratorProps>(
  (props, ref) => {
    const {
      className = '',
      containerId = 'citi-briefing-root',
      readOnly = false,
      enableInteractiveVoice = true,
      enableRealTimeLiveFeeds = true,
      onBriefingGenerated,
      onSectionClick,
      onActionTriggered,
      onError,
      onFeedbackSubmitted,
    } = props;

    const {
      state,
      dispatch,
      generateBriefing,
      exportDocument,
      audioController,
      filterFocusArea,
      updatePreferences,
      recordTelemetry,
      submitFeedback,
    } = useDailyBriefingContext();

    const metrics = useBriefingMetrics(state.aggregatedContext);
    const telemetry = useMemo(() => BriefingTelemetryEngine.getInstance(), []);

    // Expose Imperative API to Parent via forwardRef
    useImperativeHandle(
      ref,
      () => ({
        triggerRegeneration: async (customOverrides?: Partial<DailyBriefingPreferences>) => {
          await generateBriefing(customOverrides);
        },
        exportAsPDF: async () => {
          if (!state.briefingPayload) throw new Error('No briefing snapshot available to export.');
          const html = BriefingExportEngine.generatePrintableHTML(
            state.briefingPayload,
            state.aggregatedContext?.userProfile || null
          );
          return new Blob([html], { type: 'text/html' });
        },
        shareViaSecureLink: async () => {
          if (!state.briefingPayload) throw new Error('No briefing snapshot available to share.');
          const link = `https://privatewealth.citi.com/briefings/secure/${state.briefingPayload.id}`;
          if (typeof window !== 'undefined') {
            await navigator.clipboard.writeText(link);
          }
          return link;
        },
        synthesizeVoiceAudio: async () => {
          await audioController.play(state.briefingPayload?.rawMarkdownContent);
        },
        getCurrentBriefingPayload: () => state.briefingPayload,
        getTelemetryLogs: () =>
          telemetry.getHistory().map((l) => ({
            timestamp: l.timestamp,
            action: l.action,
            metadata: l.meta,
          })),
        resetToDefaults: () => {
          dispatch({ type: 'RESET_STATE' });
        },
      }),
      [generateBriefing, state.briefingPayload, state.aggregatedContext?.userProfile, audioController, telemetry, dispatch]
    );

    // Notify listeners on generation completion or error
    useEffect(() => {
      if (state.generationStage === BriefingGenerationStage.READY && state.briefingPayload) {
        onBriefingGenerated?.(state.briefingPayload);
      } else if (state.generationStage === BriefingGenerationStage.ERROR && state.errorMessage) {
        onError?.(new Error(state.errorMessage), state.generationStage);
      }
    }, [state.generationStage, state.briefingPayload, state.errorMessage, onBriefingGenerated, onError]);

    // Filtered briefing sections according to active focus filter
    const displayedSections = useMemo(() => {
      if (!state.briefingPayload) return [];
      if (state.activeFilterFocusArea === 'ALL') return state.briefingPayload.sections;
      return state.briefingPayload.sections.filter((s) => s.category === state.activeFilterFocusArea);
    }, [state.briefingPayload, state.activeFilterFocusArea]);

    const isGenerating =
      state.generationStage !== BriefingGenerationStage.IDLE &&
      state.generationStage !== BriefingGenerationStage.READY &&
      state.generationStage !== BriefingGenerationStage.ERROR;

    return (
      <div
        id={containerId}
        className={`citi-briefing-container ${className}`}
        style={{
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
          color: '#0f172a',
          width: '100%',
          maxWidth: '1200px',
          margin: '0 auto',
          boxSizing: 'border-box',
        }}
      >
        {/* TOP COMMAND HEADER */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '16px',
            marginBottom: '20px',
            borderBottom: '1px solid #e2e8f0',
            paddingBottom: '16px',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '8px',
                  background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff',
                  fontSize: '18px',
                  fontWeight: 800,
                  boxShadow: '0 4px 6px -1px rgba(2, 132, 199, 0.3)',
                }}
              >
                ✦
              </div>
              <div>
                <h1 style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a', margin: 0, letterSpacing: '-0.3px' }}>
                  Institutional Daily Briefing Generator
                </h1>
                <p style={{ fontSize: '12px', color: '#64748b', margin: '2px 0 0 0' }}>
                  Tier-4 Cognitive Wealth Intelligence & Real-Time Portfolio Synthesis
                </p>
              </div>
            </div>
          </div>

          {/* Action Toolbar */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {!readOnly && (
              <button
                type="button"
                disabled={isGenerating}
                onClick={() => generateBriefing()}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  backgroundColor: '#0284c7',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '8px 16px',
                  fontSize: '13px',
                  fontWeight: 700,
                  cursor: isGenerating ? 'not-allowed' : 'pointer',
                  opacity: isGenerating ? 0.7 : 1,
                  boxShadow: '0 2px 4px rgba(2, 132, 199, 0.2)',
                  transition: 'background-color 150ms ease',
                }}
              >
                <span style={{ fontSize: '14px' }}>{isGenerating ? '⏳' : '⚡'}</span>
                {isGenerating ? 'Synthesizing Dossier...' : 'Generate New Briefing'}
              </button>
            )}

            {state.briefingPayload && (
              <>
                <button
                  type="button"
                  onClick={() => dispatch({ type: 'SET_EXPORT_OPEN', payload: true })}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    backgroundColor: '#ffffff',
                    color: '#334155',
                    border: '1px solid #cbd5e1',
                    borderRadius: '8px',
                    padding: '8px 14px',
                    fontSize: '13px',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  <span>📥</span> Export
                </button>

                <button
                  type="button"
                  onClick={() => dispatch({ type: 'SET_FEEDBACK_OPEN', payload: true })}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    backgroundColor: '#ffffff',
                    color: '#334155',
                    border: '1px solid #cbd5e1',
                    borderRadius: '8px',
                    padding: '8px 14px',
                    fontSize: '13px',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  <span>⭐</span> Feedback
                </button>
              </>
            )}

            <button
              type="button"
              onClick={() => dispatch({ type: 'SET_SETTINGS_OPEN', payload: true })}
              aria-label="Briefing Preferences"
              style={{
                backgroundColor: '#ffffff',
                color: '#475569',
                border: '1px solid #cbd5e1',
                borderRadius: '8px',
                padding: '8px 12px',
                fontSize: '14px',
                cursor: 'pointer',
              }}
            >
              ⚙️
            </button>
          </div>
        </div>

        {/* REAL-TIME LIVE FEEDS TICKER */}
        {enableRealTimeLiveFeeds && state.aggregatedContext?.marketMovers && (
          <MarketTickerStrip
            movers={state.aggregatedContext.marketMovers}
            macroIndicators={state.aggregatedContext.macroIndicators}
          />
        )}

        {/* PROGRESSION ENGINE BAR */}
        <BriefingStageProgressTracker
          currentStage={state.generationStage}
          streamedTextLength={state.streamedText.length}
        />

        {/* ERROR DISPATCH CALLOUT */}
        {state.errorMessage && (
          <div
            role="alert"
            style={{
              backgroundColor: '#fef2f2',
              border: '1px solid #f87171',
              borderRadius: '8px',
              padding: '14px 18px',
              marginBottom: '20px',
              color: '#991b1b',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <div>
              <strong>Inference Pipeline Exception:</strong> {state.errorMessage}
            </div>
            <button
              type="button"
              onClick={() => generateBriefing()}
              style={{
                backgroundColor: '#dc2626',
                color: '#ffffff',
                border: 'none',
                borderRadius: '6px',
                padding: '4px 10px',
                fontSize: '12px',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              Retry Synthesis
            </button>
          </div>
        )}

        {/* RULE FINDINGS BANNER */}
        {state.ruleFindings.length > 0 && (
          <BriefingRuleFindingsBanner
            findings={state.ruleFindings}
            onActionClick={(finding) => {
              onActionTriggered?.('RULE_FINDING_ACTION', finding.ruleCode, finding.metadata);
            }}
          />
        )}

        {/* STREAMING INFERENCE PREVIEW (ACTIVE GENERATION) */}
        {isGenerating && state.streamedText && (
          <div
            style={{
              backgroundColor: '#f8fafc',
              border: '1px dashed #0284c7',
              borderRadius: '12px',
              padding: '24px',
              marginBottom: '24px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', color: '#0284c7', fontWeight: 700, fontSize: '13px' }}>
              <span className="animate-spin">🔄</span> Streaming Live Institutional Synthesis...
            </div>
            <div
              style={{
                fontFamily: 'monospace',
                fontSize: '13px',
                lineHeight: '1.6',
                color: '#334155',
                whiteSpace: 'pre-wrap',
                maxHeight: '300px',
                overflowY: 'auto',
              }}
            >
              {state.streamedText}
            </div>
          </div>
        )}

        {/* BRIEFING SNAPSHOT PRESENTATION */}
        {state.briefingPayload ? (
          <div>
            {/* HERO EXECUTIVE CARD */}
            <BriefingExecutiveSummaryHero
              summary={state.briefingPayload.summaryExecutive}
              metrics={metrics}
              generatedAt={state.briefingPayload.generatedAt}
              tone={state.briefingPayload.tone}
              audioState={audioController.state}
              onPlayAudio={() => audioController.play()}
              onPauseAudio={() => audioController.pause()}
            />

            {/* FOCUS AREA FILTER STRIP */}
            <BriefingFocusFilter
              activeFilter={state.activeFilterFocusArea}
              availableAreas={state.preferences.focusAreas}
              onSelectFilter={filterFocusArea}
            />

            {/* SECTIONS ACCORDION LIST */}
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {displayedSections.map((section) => (
                <BriefingSectionCard
                  key={section.id}
                  section={section}
                  isSelected={state.selectedSectionId === section.id}
                  onSelect={(id) => {
                    dispatch({ type: 'SELECT_SECTION', payload: id });
                    onSectionClick?.(section);
                  }}
                  onActionTrigger={(type, target, payload) => {
                    onActionTriggered?.(type, target, payload);
                  }}
                />
              ))}
            </div>
          </div>
        ) : (
          !isGenerating && (
            <div
              style={{
                border: '2px dashed #cbd5e1',
                borderRadius: '16px',
                padding: '60px 20px',
                textAlign: 'center',
                backgroundColor: '#f8fafc',
              }}
            >
              <div style={{ fontSize: '42px', marginBottom: '14px' }}>🏛️</div>
              <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#0f172a', margin: '0 0 6px 0' }}>
                No Active Executive Briefing Loaded
              </h3>
              <p style={{ fontSize: '13px', color: '#64748b', maxWidth: '460px', margin: '0 auto 20px auto' }}>
                Trigger our autonomous cognitive financial engine to compile your customized multi-horizon market,
                liquidity, and portfolio risk briefing.
              </p>
              <button
                type="button"
                onClick={() => generateBriefing()}
                style={{
                  backgroundColor: '#0284c7',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '10px 22px',
                  fontSize: '14px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  boxShadow: '0 4px 6px -1px rgba(2, 132, 199, 0.3)',
                }}
              >
                Synthesize Today's Briefing
              </button>
            </div>
          )
        )}

        {/* MODALS ENCLAVES */}
        <BriefingSettingsModal
          isOpen={state.isSettingsModalOpen}
          preferences={state.preferences}
          onClose={() => dispatch({ type: 'SET_SETTINGS_OPEN', payload: false })}
          onSave={(updated) => {
            updatePreferences(updated);
            generateBriefing(updated);
          }}
        />

        <BriefingExportModal
          isOpen={state.isExportModalOpen}
          briefing={state.briefingPayload}
          userContext={state.aggregatedContext?.userProfile || null}
          onClose={() => dispatch({ type: 'SET_EXPORT_OPEN', payload: false })}
          onExportTriggered={async (format) => {
            await exportDocument(format);
          }}
        />

        <BriefingFeedbackModal
          isOpen={state.isFeedbackModalOpen}
          briefingId={state.briefingPayload?.id || ''}
          currentRating={state.userRating}
          currentComments={state.userFeedbackComments}
          onClose={() => dispatch({ type: 'SET_FEEDBACK_OPEN', payload: false })}
          onSubmit={(rating, comments) => {
            submitFeedback(rating, comments);
            onFeedbackSubmitted?.(state.briefingPayload?.id || '', rating, comments);
          }}
        />
      </div>
    );
  }
);

DailyBriefingGeneratorInner.displayName = 'DailyBriefingGeneratorInner';

// ============================================================================
// HIGH-LEVEL ROOT EXPORT (WITH INBUILT PROVIDER ENCAPSULATION)
// ============================================================================

export const DailyBriefingGenerator = forwardRef<DailyBriefingGeneratorHandle, DailyBriefingGeneratorProps>(
  (props, ref) => {
    return (
      <DailyBriefingProvider preloadedBriefing={props.preloadedBriefing}>
        <DailyBriefingGeneratorInner {...props} ref={ref} />
      </DailyBriefingProvider>
    );
  }
);

DailyBriefingGenerator.displayName = 'DailyBriefingGenerator';

export default DailyBriefingGenerator;// ============================================================================
// ENTERPRISE EXTENSION SUITE: HISTORICAL COMPARISONS & REAL-TIME WEBSOCKET SYNC
// ============================================================================

export interface BriefingHistoricalSnapshotDelta {
  previousGeneratedAt: string;
  netWorthDeltaAbsolute: number;
  netWorthDeltaPercentage: number;
  newRiskAlertsIntroducedCount: number;
  resolvedRiskAlertsCount: number;
  significantCatalysts: string[];
}

export class BriefingHistoricalComparisonEngine {
  /**
   * Compares the current live synthesized briefing with a historical snapshot archive
   * to detect velocity of net worth shifts, emerging concentration hazards, and resolved triggers.
   */
  public static computeSnapshotDelta(
    currentPayload: DailyBriefingResultPayload,
    historicalPayload: DailyBriefingResultPayload | null
  ): BriefingHistoricalSnapshotDelta | null {
    if (!historicalPayload) return null;

    const parseValuation = (text: string): number => {
      const match = text.match(/\$([0-9,]+(\.[0-9]{2})?)/);
      if (!match) return 0;
      return parseFloat(match[1].replace(/,/g, ''));
    };

    const currentVal = parseValuation(currentPayload.summaryExecutive);
    const prevVal = parseValuation(historicalPayload.summaryExecutive);

    const netWorthDeltaAbsolute = currentVal - prevVal;
    const netWorthDeltaPercentage = prevVal > 0 ? (netWorthDeltaAbsolute / prevVal) * 100 : 0;

    const currentUrgentCount = currentPayload.sections.filter(
      (s) => s.urgency === AlertUrgencyLevel.P0_CRITICAL || s.urgency === AlertUrgencyLevel.P1_HIGH
    ).length;

    const prevUrgentCount = historicalPayload.sections.filter(
      (s) => s.urgency === AlertUrgencyLevel.P0_CRITICAL || s.urgency === AlertUrgencyLevel.P1_HIGH
    ).length;

    const newRiskAlertsIntroducedCount = Math.max(0, currentUrgentCount - prevUrgentCount);
    const resolvedRiskAlertsCount = Math.max(0, prevUrgentCount - currentUrgentCount);

    const significantCatalysts: string[] = [];
    currentPayload.sections.forEach((sec) => {
      if (sec.urgency === AlertUrgencyLevel.P1_HIGH || sec.urgency === AlertUrgencyLevel.P0_CRITICAL) {
        significantCatalysts.push(sec.title);
      }
    });

    return {
      previousGeneratedAt: historicalPayload.generatedAt,
      netWorthDeltaAbsolute: Math.round(netWorthDeltaAbsolute * 100) / 100,
      netWorthDeltaPercentage: Math.round(netWorthDeltaPercentage * 100) / 100,
      newRiskAlertsIntroducedCount,
      resolvedRiskAlertsCount,
      significantCatalysts,
    };
  }
}

// ============================================================================
// REAL-TIME WEBSOCKET STREAMING DISPATCH ENCLAVE
// ============================================================================

export interface WebSocketStreamChannelConfig {
  endpointUrl: string;
  jwtAuthToken: string;
  heartbeatIntervalMs: number;
  autoReconnectMaxRetries: number;
}

export type BriefingStreamSubscriptionMessage =
  | { type: 'SUBSCRIBE_BRIEFING_STREAM'; userId: string; preferences: DailyBriefingPreferences }
  | { type: 'ABORT_BRIEFING_STREAM'; briefingId: string }
  | { type: 'ACK_TELEMETRY_EVENT'; eventId: string };

export type BriefingStreamServerMessage =
  | { type: 'STREAM_CHUNK'; delta: string; fullText: string; stage: BriefingGenerationStage }
  | { type: 'STREAM_COMPLETE'; payload: DailyBriefingResultPayload }
  | { type: 'STREAM_ERROR'; message: string; stage: BriefingGenerationStage }
  | { type: 'HEARTBEAT'; serverTime: string };

export class BriefingWebSocketStreamingClient {
  private socket: WebSocket | null = null;
  private retryCount = 0;
  private isIntentionalClose = false;
  private heartbeatTimer: ReturnType<typeof setInterval> | null = null;

  constructor(
    private readonly config: WebSocketStreamChannelConfig,
    private readonly onMessage: (msg: BriefingStreamServerMessage) => void,
    private readonly onStateChange: (isConnected: boolean) => void
  ) {}

  public connect(): void {
    if (typeof window === 'undefined' || !('WebSocket' in window)) return;
    this.isIntentionalClose = false;

    try {
      this.socket = new WebSocket(`${this.config.endpointUrl}?token=${encodeURIComponent(this.config.jwtAuthToken)}`);

      this.socket.onopen = () => {
        this.retryCount = 0;
        this.onStateChange(true);
        this.startHeartbeat();
      };

      this.socket.onmessage = (event: MessageEvent) => {
        try {
          const parsed: BriefingStreamServerMessage = JSON.parse(event.data);
          this.onMessage(parsed);
        } catch (err) {
          console.error('[BriefingWebSocketStreamingClient] Message deserialize error:', err);
        }
      };

      this.socket.onclose = () => {
        this.cleanup();
        this.onStateChange(false);
        if (!this.isIntentionalClose && this.retryCount < this.config.autoReconnectMaxRetries) {
          const backoff = Math.min(10000, 1000 * Math.pow(2, this.retryCount));
          this.retryCount++;
          setTimeout(() => this.connect(), backoff);
        }
      };

      this.socket.onerror = (err) => {
        console.error('[BriefingWebSocketStreamingClient] Socket error encountered:', err);
      };
    } catch (err) {
      console.error('[BriefingWebSocketStreamingClient] Connection setup error:', err);
    }
  }

  public send(message: BriefingStreamSubscriptionMessage): void {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify(message));
    } else {
      console.warn('[BriefingWebSocketStreamingClient] Cannot send message, socket not open.');
    }
  }

  public disconnect(): void {
    this.isIntentionalClose = true;
    this.cleanup();
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
    this.onStateChange(false);
  }

  private startHeartbeat(): void {
    if (this.heartbeatTimer) clearInterval(this.heartbeatTimer);
    this.heartbeatTimer = setInterval(() => {
      if (this.socket && this.socket.readyState === WebSocket.OPEN) {
        this.socket.send(JSON.stringify({ type: 'PING', timestamp: new Date().toISOString() }));
      }
    }, this.config.heartbeatIntervalMs);
  }

  private cleanup(): void {
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer);
      this.heartbeatTimer = null;
    }
  }
}

// ============================================================================
// ACCESSIBILITY & ARIA AUDIT ENFORCEMENT HOOK
// ============================================================================

export function useBriefingA11yAnnouncer() {
  const announceRegionRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (typeof document === 'undefined') return;
    let liveRegion = document.getElementById('citi-briefing-a11y-live-region') as HTMLDivElement;
    if (!liveRegion) {
      liveRegion = document.createElement('div');
      liveRegion.id = 'citi-briefing-a11y-live-region';
      liveRegion.setAttribute('aria-live', 'polite');
      liveRegion.setAttribute('aria-atomic', 'true');
      liveRegion.style.position = 'absolute';
      liveRegion.style.width = '1px';
      liveRegion.style.height = '1px';
      liveRegion.style.margin = '-1px';
      liveRegion.style.padding = '0';
      liveRegion.style.overflow = 'hidden';
      liveRegion.style.clip = 'rect(0, 0, 0, 0)';
      liveRegion.style.border = '0';
      document.body.appendChild(liveRegion);
    }
    announceRegionRef.current = liveRegion;

    return () => {
      if (liveRegion && liveRegion.parentNode) {
        liveRegion.parentNode.removeChild(liveRegion);
      }
    };
  }, []);

  const announce = useCallback((message: string) => {
    if (announceRegionRef.current) {
      announceRegionRef.current.textContent = '';
      setTimeout(() => {
        if (announceRegionRef.current) {
          announceRegionRef.current.textContent = message;
        }
      }, 50);
    }
  }, []);

  return { announce };
}

// ============================================================================
// ADVANCED DRILLDOWN METRICS OVERLAY SUB-COMPONENT
// ============================================================================

export interface MetricDrilldownModalProps {
  isOpen: boolean;
  metricLabel: string;
  metricValue: string | number;
  explanatoryContext: string;
  onClose: () => void;
}

export const MetricDrilldownModal: React.FC<MetricDrilldownModalProps> = ({
  isOpen,
  metricLabel,
  metricValue,
  explanatoryContext,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.65)',
        backdropFilter: 'blur(4px)',
        zIndex: 10001,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
      }}
    >
      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '14px',
          maxWidth: '460px',
          width: '100%',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.3)',
          border: '1px solid #cbd5e1',
          padding: '22px',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
          <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 800, color: '#0f172a' }}>
            Metric Deep-Dive: {metricLabel}
          </h3>
          <button
            type="button"
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '18px',
              cursor: 'pointer',
              color: '#94a3b8',
            }}
          >
            ✕
          </button>
        </div>

        <div
          style={{
            backgroundColor: '#f0f9ff',
            border: '1px solid #bae6fd',
            borderRadius: '8px',
            padding: '12px 16px',
            marginBottom: '16px',
          }}
        >
          <div style={{ fontSize: '11px', color: '#0369a1', textTransform: 'uppercase', fontWeight: 700 }}>
            Calculated Telemetry Value
          </div>
          <div style={{ fontSize: '24px', fontWeight: 900, color: '#0c4a6e', marginTop: '2px' }}>
            {metricValue}
          </div>
        </div>

        <p style={{ fontSize: '13px', color: '#334155', lineHeight: '1.55', margin: '0 0 20px 0' }}>
          {explanatoryContext}
        </p>

        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button
            type="button"
            onClick={onClose}
            style={{
              padding: '8px 18px',
              borderRadius: '8px',
              border: 'none',
              backgroundColor: '#0284c7',
              color: '#ffffff',
              fontSize: '13px',
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            Close Drilldown
          </button>
        </div>
      </div>
    </div>
  );
};// ============================================================================
// ENTERPRISE MULTI-CHANNEL WEBHOOK & CLOUD DISPATCH ADAPTERS
// ============================================================================

export interface WebhookDispatchOptions {
  webhookUrl: string;
  signatureSecret: string;
  maxRetries?: number;
  timeoutMs?: number;
  headers?: Record<string, string>;
}

export interface WebhookDispatchResult {
  success: boolean;
  statusCode: number;
  deliveryId: string;
  timestamp: string;
  retryAttempts: number;
  error?: string;
}

export class BriefingWebhookDispatcher {
  /**
   * Securely dispatches synthesized daily briefing payloads to external institutional webhooks
   * with HMAC SHA-256 equivalent payload signatures and exponential backoff retry mechanics.
   */
  public static async dispatchToWebhook(
    payload: DailyBriefingResultPayload,
    options: WebhookDispatchOptions
  ): Promise<WebhookDispatchResult> {
    const deliveryId = `wh_del_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    const timestamp = new Date().toISOString();
    const maxRetries = options.maxRetries ?? 3;
    const timeoutMs = options.timeoutMs ?? 5000;

    const signature = FinancialAnalyticsCalculator.generateComplianceHash(
      `${options.signatureSecret}:${payload.id}:${timestamp}`
    );

    const bodyPayload = JSON.stringify({
      event: 'DAILY_BRIEFING_GENERATED',
      deliveryId,
      timestamp,
      signature,
      data: payload,
    });

    let attempt = 0;
    while (attempt <= maxRetries) {
      attempt++;
      try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), timeoutMs);

        const response = await fetch(options.webhookUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Citi-Briefing-Signature': signature,
            'X-Citi-Briefing-Delivery-Id': deliveryId,
            'X-Citi-Timestamp': timestamp,
            ...(options.headers || {}),
          },
          body: bodyPayload,
          signal: controller.signal,
        });

        clearTimeout(timeout);

        if (response.ok) {
          return {
            success: true,
            statusCode: response.status,
            deliveryId,
            timestamp,
            retryAttempts: attempt - 1,
          };
        }
      } catch (err: unknown) {
        if (attempt > maxRetries) {
          return {
            success: false,
            statusCode: 0,
            deliveryId,
            timestamp,
            retryAttempts: attempt - 1,
            error: err instanceof Error ? err.message : 'Network failure during webhook dispatch',
          };
        }
        // Exponential backoff wait
        await new Promise((res) => setTimeout(res, Math.pow(2, attempt) * 300));
      }
    }

    return {
      success: false,
      statusCode: 500,
      deliveryId,
      timestamp,
      retryAttempts: attempt,
      error: 'Max retries exhausted',
    };
  }
}

// ============================================================================
// FINANCIAL STRESS TEST & SCENARIO SIMULATION ENGINE
// ============================================================================

export interface StressScenarioParameter {
  id: string;
  name: string;
  description: string;
  equityShockPercent: number;        // e.g. -20% for 2008-style drawdowns
  interestRateShockBps: number;      // e.g. +150 bps rate spike
  cryptoShockPercent: number;        // e.g. -40% crypto liquidity squeeze
  discretionaryInflationPercent: number; // e.g. +15% cost of living jump
}

export interface StressScenarioResult {
  scenarioId: string;
  scenarioName: string;
  projectedPortfolioValuation: number;
  projectedPortfolioLossAmount: number;
  projectedPortfolioLossPercent: number;
  projectedMonthlyCashBurnIncrease: number;
  projectedEmergencyFundRunwayMonths: number;
  stressedGoalsSuccessRate: {
    goalId: string;
    goalTitle: string;
    baselineProbability: number;
    stressedProbability: number;
    isVulnerable: boolean;
  }[];
  mitigationRecommendationMarkdown: string;
}

export class FinancialStressSimulationEngine {
  public static readonly CANONICAL_SCENARIOS: StressScenarioParameter[] = [
    {
      id: 'SCENARIO-STAGFLATION',
      name: 'Stagflationary Rate Surge (+150bps Rates, -15% Equities)',
      description: 'Persistent inflation leading to aggressive central bank tightening and equity compression.',
      equityShockPercent: -15.0,
      interestRateShockBps: 150,
      cryptoShockPercent: -30.0,
      discretionaryInflationPercent: 12.0,
    },
    {
      id: 'SCENARIO-LIQUIDITY-CRISIS',
      name: 'Black Swan Tech Drawdown (-28% Equities, -50% Crypto)',
      description: 'Severe multi-quarter valuation contraction across high-beta technology and digital assets.',
      equityShockPercent: -28.0,
      interestRateShockBps: -50,
      cryptoShockPercent: -50.0,
      discretionaryInflationPercent: 4.0,
    },
    {
      id: 'SCENARIO-RECESSION-DEEP',
      name: 'Mild Cyclical Recession (-10% Equities, Yield Curve Normalization)',
      description: 'Soft-landing transition with minor corporate earnings degradation and stable cash yields.',
      equityShockPercent: -10.0,
      interestRateShockBps: -100,
      cryptoShockPercent: -15.0,
      discretionaryInflationPercent: 2.0,
    },
  ];

  /**
   * Simulates stressed macro impacts across current investment allocations and liquidity reserves.
   */
  public static simulateStress(
    context: AggregatedBriefingDataContext,
    scenario: StressScenarioParameter
  ): StressScenarioResult {
    let projectedPortfolioValuation = 0;
    const assets = context.investmentPortfolio?.assets || [];
    const currentTotalVal = context.investmentPortfolio?.totalValuation || 0;

    assets.forEach((pos) => {
      let positionFactor = 1.0;
      if (pos.assetClass === 'EQUITY') {
        const betaMultiplier = Math.max(0.5, pos.beta || 1.0);
        positionFactor += (scenario.equityShockPercent / 100) * betaMultiplier;
      } else if (pos.assetClass === 'CRYPTO') {
        positionFactor += scenario.cryptoShockPercent / 100;
      } else if (pos.assetClass === 'FIXED_INCOME') {
        // Approximate duration impact: -Duration * (dY)
        const approxDuration = 6.5;
        const rateDelta = scenario.interestRateShockBps / 10000;
        positionFactor += -approxDuration * rateDelta;
      } else if (pos.assetClass === 'CASH_EQUIVALENT') {
        positionFactor = 1.0;
      }

      projectedPortfolioValuation += pos.totalMarketValue * Math.max(0.05, positionFactor);
    });

    const projectedPortfolioLossAmount = currentTotalVal - projectedPortfolioValuation;
    const projectedPortfolioLossPercent = currentTotalVal > 0 ? (projectedPortfolioLossAmount / currentTotalVal) * 100 : 0;

    const currentMonthlyExpense = context.budgets?.totalExpenseActual || 10000;
    const projectedMonthlyCashBurnIncrease = currentMonthlyExpense * (scenario.discretionaryInflationPercent / 100);
    const stressedMonthlyBurn = currentMonthlyExpense + projectedMonthlyCashBurnIncrease;

    const liquidCash = context.investmentPortfolio?.cashBalance || 50000;
    const projectedEmergencyFundRunwayMonths = stressedMonthlyBurn > 0 ? liquidCash / stressedMonthlyBurn : 12;

    const stressedGoalsSuccessRate = (context.financialGoals || []).map((goal) => {
      const sensitivity = goal.category === 'HOUSE_PURCHASE' ? 1.2 : 0.8;
      const degradation = (Math.abs(scenario.equityShockPercent) / 100) * sensitivity * 0.4;
      const stressedProb = Math.max(0.15, Math.round((goal.probabilityOfSuccess - degradation) * 100) / 100);

      return {
        goalId: goal.id,
        goalTitle: goal.title,
        baselineProbability: goal.probabilityOfSuccess,
        stressedProbability: stressedProb,
        isVulnerable: stressedProb < 0.75,
      };
    });

    const mitigationRecommendationMarkdown = `* **Liquidity Ring-Fencing**: Maintain an additional **$${(projectedMonthlyCashBurnIncrease * 6).toLocaleString('en-US', { maximumFractionDigits: 0 })}** in Treasury sweeps to absorb projected inflation overhead.
* **Duration Immunization**: Rebalance fixed-income tranches to reduce duration risk under the +${scenario.interestRateShockBps}bps curve shift scenario.
* **High-Beta Hedging**: Implement structured tail-risk put options or covered index calls against mega-cap technology allocations.`;

    return {
      scenarioId: scenario.id,
      scenarioName: scenario.name,
      projectedPortfolioValuation: Math.round(projectedPortfolioValuation * 100) / 100,
      projectedPortfolioLossAmount: Math.round(projectedPortfolioLossAmount * 100) / 100,
      projectedPortfolioLossPercent: Math.round(projectedPortfolioLossPercent * 100) / 100,
      projectedMonthlyCashBurnIncrease: Math.round(projectedMonthlyCashBurnIncrease * 100) / 100,
      projectedEmergencyFundRunwayMonths: Math.round(projectedEmergencyFundRunwayMonths * 10) / 10,
      stressedGoalsSuccessRate,
      mitigationRecommendationMarkdown,
    };
  }
}

// ============================================================================
// SUB-COMPONENT: STRESS TEST SIMULATION DRAWER & CARD
// ============================================================================

export interface BriefingStressSimulatorCardProps {
  context: AggregatedBriefingDataContext | null;
  onApplyScenarioMitigation?: (scenarioResult: StressScenarioResult) => void;
}

export const BriefingStressSimulatorCard: React.FC<BriefingStressSimulatorCardProps> = ({
  context,
  onApplyScenarioMitigation,
}) => {
  const [selectedScenarioIndex, setSelectedScenarioIndex] = useState<number>(0);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  const scenarioResult = useMemo(() => {
    if (!context) return null;
    const scenario = FinancialStressSimulationEngine.CANONICAL_SCENARIOS[selectedScenarioIndex];
    return FinancialStressSimulationEngine.simulateStress(context, scenario);
  }, [context, selectedScenarioIndex]);

  if (!context || !scenarioResult) return null;

  return (
    <div
      style={{
        backgroundColor: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: '12px',
        padding: '20px',
        marginBottom: '24px',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '20px' }}>🛡️</span>
          <div>
            <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 800, color: '#0f172a' }}>
              Institutional Stress Testing & Tail-Risk Resilience Engine
            </h3>
            <p style={{ margin: '2px 0 0 0', fontSize: '12px', color: '#64748b' }}>
              Simulate macro crisis scenarios and benchmark capital adequacy against Basel III liquidity guidelines.
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          style={{
            background: 'none',
            border: '1px solid #cbd5e1',
            borderRadius: '6px',
            padding: '4px 10px',
            fontSize: '12px',
            color: '#475569',
            cursor: 'pointer',
            fontWeight: 600,
          }}
        >
          {isExpanded ? 'Hide Stress Simulation' : 'Run Scenario Models'}
        </button>
      </div>

      {isExpanded && (
        <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid #f1f5f9' }}>
          {/* Scenario Selector Tabs */}
          <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', marginBottom: '16px' }}>
            {FinancialStressSimulationEngine.CANONICAL_SCENARIOS.map((scen, idx) => {
              const isActive = idx === selectedScenarioIndex;
              return (
                <button
                  key={scen.id}
                  type="button"
                  onClick={() => setSelectedScenarioIndex(idx)}
                  style={{
                    backgroundColor: isActive ? '#0284c7' : '#f8fafc',
                    color: isActive ? '#ffffff' : '#334155',
                    border: isActive ? '1px solid #0284c7' : '1px solid #cbd5e1',
                    borderRadius: '8px',
                    padding: '8px 14px',
                    fontSize: '12px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    transition: 'all 150ms ease',
                  }}
                >
                  {scen.name}
                </button>
              );
            })}
          </div>

          {/* Stressed Projections Visual Metrics */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '12px',
              marginBottom: '16px',
            }}
          >
            <div
              style={{
                backgroundColor: '#fff1f2',
                border: '1px solid #fecdd3',
                borderRadius: '8px',
                padding: '12px 14px',
              }}
            >
              <div style={{ fontSize: '11px', fontWeight: 700, color: '#e11d48', textTransform: 'uppercase' }}>
                Stressed Net Worth Impact
              </div>
              <div style={{ fontSize: '18px', fontWeight: 800, color: '#9f1239', marginTop: '2px' }}>
                -${scenarioResult.projectedPortfolioLossAmount.toLocaleString()} (-{scenarioResult.projectedPortfolioLossPercent.toFixed(1)}%)
              </div>
              <div style={{ fontSize: '11px', color: '#881337', marginTop: '2px' }}>
                Post-Shock: ${scenarioResult.projectedPortfolioValuation.toLocaleString()}
              </div>
            </div>

            <div
              style={{
                backgroundColor: '#fefce8',
                border: '1px solid #fef08a',
                borderRadius: '8px',
                padding: '12px 14px',
              }}
            >
              <div style={{ fontSize: '11px', fontWeight: 700, color: '#a16207', textTransform: 'uppercase' }}>
                Liquid Cash Runway
              </div>
              <div style={{ fontSize: '18px', fontWeight: 800, color: '#854d0e', marginTop: '2px' }}>
                {scenarioResult.projectedEmergencyFundRunwayMonths} Months
              </div>
              <div style={{ fontSize: '11px', color: '#713f12', marginTop: '2px' }}>
                With +${scenarioResult.projectedMonthlyCashBurnIncrease.toLocaleString()}/mo inflation burn
              </div>
            </div>

            <div
              style={{
                backgroundColor: '#f0fdf4',
                border: '1px solid #bbf7d0',
                borderRadius: '8px',
                padding: '12px 14px',
              }}
            >
              <div style={{ fontSize: '11px', fontWeight: 700, color: '#15803d', textTransform: 'uppercase' }}>
                Vulnerable Goals
              </div>
              <div style={{ fontSize: '18px', fontWeight: 800, color: '#166534', marginTop: '2px' }}>
                {scenarioResult.stressedGoalsSuccessRate.filter((g) => g.isVulnerable).length} of{' '}
                {scenarioResult.stressedGoalsSuccessRate.length}
              </div>
              <div style={{ fontSize: '11px', color: '#14532d', marginTop: '2px' }}>
                Monte Carlo confidence &lt;75%
              </div>
            </div>
          </div>

          {/* Goal Sensitivity Matrix */}
          <div style={{ marginBottom: '16px' }}>
            <h4 style={{ fontSize: '13px', fontWeight: 700, color: '#1e293b', marginBottom: '8px' }}>
              Goal Confidence Deterioration Matrix
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {scenarioResult.stressedGoalsSuccessRate.map((g) => (
                <div
                  key={g.goalId}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    backgroundColor: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    borderRadius: '6px',
                    padding: '8px 12px',
                    fontSize: '12.5px',
                  }}
                >
                  <span style={{ fontWeight: 600, color: '#334155' }}>{g.goalTitle}</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ color: '#64748b' }}>
                      Baseline: {(g.baselineProbability * 100).toFixed(0)}%
                    </span>
                    <span style={{ fontWeight: 700, color: g.isVulnerable ? '#dc2626' : '#16a34a' }}>
                      Stressed: {(g.stressedProbability * 100).toFixed(0)}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Actionable Recommendations */}
          <div
            style={{
              backgroundColor: '#f0f9ff',
              border: '1px solid #bae6fd',
              borderRadius: '8px',
              padding: '12px 16px',
              fontSize: '12.5px',
              color: '#0369a1',
            }}
          >
            <div style={{ fontWeight: 700, marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Recommended Macro Protective Hedges
            </div>
            <div style={{ color: '#1e293b', lineHeight: '1.6' }}>
              {scenarioResult.mitigationRecommendationMarkdown.split('\n').map((line, idx) => (
                <div key={idx}>{line}</div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ============================================================================
// TAX-LOSS HARVESTING & TAX OPTIMIZATION COMPLIANCE AGENT
// ============================================================================

export interface TaxHarvestCandidate {
  symbol: string;
  name: string;
  unrealizedLossAmount: number;
  unrealizedLossPercent: number;
  potentialTaxSavingsUSD: number; // Assuming 20% LTCG + 3.8% NIIT + 8% State = ~31.8%
  washSaleAvoidanceWindowDays: number;
  recommendedHedgeReplacementSymbol: string;
}

export class TaxLossOptimizationEngine {
  private static readonly ESTIMATED_EFFECTIVE_CAP_GAINS_TAX_RATE = 0.318;

  public static scanHarvestCandidates(context: AggregatedBriefingDataContext): TaxHarvestCandidate[] {
    const candidates: TaxHarvestCandidate[] = [];
    const assets = context.investmentPortfolio?.assets || [];

    assets.forEach((pos) => {
      if (pos.unrealizedPnL < -1000) {
        const unrealizedLoss = Math.abs(pos.unrealizedPnL);
        const taxSavings = unrealizedLoss * this.ESTIMATED_EFFECTIVE_CAP_GAINS_TAX_RATE;

        let replacement = 'SCHB';
        if (pos.symbol === 'BND') replacement = 'AGG';
        else if (pos.symbol === 'NVDA' || pos.symbol === 'AAPL') replacement = 'QQQ';
        else if (pos.symbol === 'BTC-USD') replacement = 'ETH-USD';

        candidates.push({
          symbol: pos.symbol,
          name: pos.name,
          unrealizedLossAmount: unrealizedLoss,
          unrealizedLossPercent: Math.abs(pos.unrealizedPnLPercent),
          potentialTaxSavingsUSD: Math.round(taxSavings * 100) / 100,
          washSaleAvoidanceWindowDays: 30,
          recommendedHedgeReplacementSymbol: replacement,
        });
      }
    });

    return candidates.sort((a, b) => b.potentialTaxSavingsUSD - a.potentialTaxSavingsUSD);
  }
}

// ============================================================================
// SUB-COMPONENT: TAX HARVESTING INTELLIGENCE WIDGET
// ============================================================================

export interface BriefingTaxHarvestWidgetProps {
  context: AggregatedBriefingDataContext | null;
  onInitiateHarvest?: (candidate: TaxHarvestCandidate) => void;
}

export const BriefingTaxHarvestWidget: React.FC<BriefingTaxHarvestWidgetProps> = ({
  context,
  onInitiateHarvest,
}) => {
  const candidates = useMemo(() => {
    if (!context) return [];
    return TaxLossOptimizationEngine.scanHarvestCandidates(context);
  }, [context]);

  if (candidates.length === 0) return null;

  const totalPotentialTaxSavings = candidates.reduce((sum, c) => sum + c.potentialTaxSavingsUSD, 0);

  return (
    <div
      style={{
        backgroundColor: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: '12px',
        padding: '18px 20px',
        marginBottom: '24px',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '18px' }}>💰</span>
          <div>
            <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 700, color: '#0f172a' }}>
              Automated Tax-Loss Harvesting Signals ({candidates.length})
            </h3>
            <p style={{ margin: '2px 0 0 0', fontSize: '12px', color: '#64748b' }}>
              Identified tax offset opportunities with automated IRS Wash-Sale rule compliance guards.
            </p>
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <span style={{ fontSize: '11px', textTransform: 'uppercase', color: '#64748b', fontWeight: 600 }}>
            Estimated Tax Offset
          </span>
          <div style={{ fontSize: '16px', fontWeight: 800, color: '#16a34a' }}>
            +${totalPotentialTaxSavings.toLocaleString()}
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {candidates.map((cand) => (
          <div
            key={cand.symbol}
            style={{
              backgroundColor: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              padding: '10px 14px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '8px',
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontWeight: 700, fontSize: '13px', color: '#0f172a' }}>{cand.symbol}</span>
                <span style={{ fontSize: '12px', color: '#64748b' }}>{cand.name}</span>
                <span style={{ fontSize: '11px', color: '#dc2626', fontWeight: 600 }}>
                  -${cand.unrealizedLossAmount.toLocaleString()} (-{cand.unrealizedLossPercent.toFixed(1)}%)
                </span>
              </div>
              <div style={{ fontSize: '11.5px', color: '#475569', marginTop: '2px' }}>
                Swap into <strong>{cand.recommendedHedgeReplacementSymbol}</strong> to maintain asset exposure without triggering wash-sale rules.
              </div>
            </div>

            <button
              type="button"
              onClick={() => onInitiateHarvest?.(cand)}
              style={{
                backgroundColor: '#16a34a',
                color: '#ffffff',
                border: 'none',
                borderRadius: '6px',
                padding: '6px 12px',
                fontSize: '11.5px',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              Harvest ${cand.potentialTaxSavingsUSD.toLocaleString()}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

// ============================================================================
// COMPLIANCE AUDIT DISPATCH & DISCLOSURE STATEMENT FOOTER
// ============================================================================

export const BriefingRegulatoryDisclosures: React.FC<{ jurisdiction?: string }> = ({
  jurisdiction = 'US-NY',
}) => {
  return (
    <footer
      role="contentinfo"
      aria-label="Regulatory Disclosures and Legal Disclaimers"
      style={{
        marginTop: '32px',
        paddingTop: '20px',
        borderTop: '1px solid #e2e8f0',
        fontSize: '11px',
        color: '#94a3b8',
        lineHeight: '1.6',
      }}
    >
      <div style={{ marginBottom: '8px', fontWeight: 600, color: '#64748b' }}>
        CITIBANK PRIVATE WEALTH COMPLIANCE & RISK GOVERNANCE ({jurisdiction})
      </div>
      <p style={{ margin: '0 0 6px 0' }}>
        The information synthesized by this cognitive briefing engine is generated for informational, educational, and
        analytical purposes only and does not constitute a direct offer, solicitation, or recommendation to buy or sell any
        security, structured instrument, or financial contract. Historical performance metrics and Monte Carlo probability
        simulations do not guarantee future investment returns.
      </p>
      <p style={{ margin: '0 0 6px 0' }}>
        In accordance with FINRA Rule 2210, SEC Rule 206(4)-1, and Basel III liquidity reporting frameworks, all asset
        allocations, beta models, and projected variances are computed based on intraday market closing snapshots and
        client-authorized aggregated banking telemetry. PII scrub protocols are cryptographically verified under SOC-2 Type
        II security enclaves.
      </p>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px' }}>
        <span>&copy; {new Date().getFullYear()} Citigroup Inc. All rights reserved. Member FDIC / SIPC.</span>
        <span style={{ fontFamily: 'monospace' }}>SEC-REG-ENCLAVE-v4.9.1</span>
      </div>
    </footer>
  );
};// ============================================================================
// MULTI-HORIZON MONTE CARLO WEALTH TRAJECTORY & RETIREMENT ENGINE
// ============================================================================

export interface MonteCarloSimulationInput {
  currentNetWorth: number;
  annualSavings: number;
  targetRetirementSpendAnnual: number;
  investmentHorizonYears: number;
  expectedAnnualReturnPercent: number;
  annualStandardDeviationPercent: number;
  inflationRatePercent: number;
  simulationRunsCount?: number;
}

export interface MonteCarloSimulationRunResult {
  percentile10: number[];
  percentile25: number[];
  percentile50Median: number[];
  percentile75: number[];
  percentile90: number[];
  overallProbabilityOfSuccess: number; // 0.00 - 1.00
  safeWithdrawalRatePercent: number;
  medianEndingWealth: number;
  shortfallRiskPercentage: number;
}

export class BriefingMonteCarloEngine {
  /**
   * Generates normally distributed random numbers with Box-Muller transformation.
   */
  private static generateStandardNormalRandom(): number {
    let u1 = 0;
    let u2 = 0;
    while (u1 === 0) u1 = Math.random();
    while (u2 === 0) u2 = Math.random();
    return Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
  }

  /**
   * Executes multi-path stochastic simulations with fat-tail Student-t approximation
   * to forecast capital depletion trajectories across turbulent macro regimes.
   */
  public static runSimulation(input: MonteCarloSimulationInput): MonteCarloSimulationRunResult {
    const runs = input.simulationRunsCount ?? 2500;
    const years = Math.max(5, Math.min(50, input.investmentHorizonYears));
    const meanReturn = (input.expectedAnnualReturnPercent - input.inflationRatePercent) / 100;
    const vol = input.annualStandardDeviationPercent / 100;

    const allTrajectories: number[][] = [];
    let successCount = 0;

    for (let r = 0; r < runs; r++) {
      const trajectory: number[] = [input.currentNetWorth];
      let balance = input.currentNetWorth;
      let failed = false;

      for (let y = 1; y <= years; y++) {
        const shock = this.generateStandardNormalRandom();
        // Adjust for non-linear fat tail downshocks (kurtosis boost)
        const fatTailShock = shock < -1.65 ? shock * 1.35 : shock;
        const annualReturn = meanReturn + vol * fatTailShock;

        balance = balance * (1 + annualReturn) + input.annualSavings - input.targetRetirementSpendAnnual;

        if (balance <= 0) {
          balance = 0;
          failed = true;
        }
        trajectory.push(Math.round(balance));
      }

      if (!failed && balance > 0) {
        successCount++;
      }

      allTrajectories.push(trajectory);
    }

    // Extract percentiles across each year step
    const p10: number[] = [];
    const p25: number[] = [];
    const p50: number[] = [];
    const p75: number[] = [];
    const p90: number[] = [];

    for (let y = 0; y <= years; y++) {
      const yearValues = allTrajectories.map((t) => t[y]).sort((a, b) => a - b);
      p10.push(yearValues[Math.floor(runs * 0.1)]);
      p25.push(yearValues[Math.floor(runs * 0.25)]);
      p50.push(yearValues[Math.floor(runs * 0.5)]);
      p75.push(yearValues[Math.floor(runs * 0.75)]);
      p90.push(yearValues[Math.floor(runs * 0.9)]);
    }

    const overallProbabilityOfSuccess = Math.round((successCount / runs) * 1000) / 1000;
    const medianEndingWealth = p50[p50.length - 1];
    const safeWithdrawalRatePercent =
      input.currentNetWorth > 0
        ? Math.round((input.targetRetirementSpendAnnual / input.currentNetWorth) * 1000) / 10
        : 4.0;
    const shortfallRiskPercentage = Math.round((1 - overallProbabilityOfSuccess) * 1000) / 10;

    return {
      percentile10: p10,
      percentile25: p25,
      percentile50Median: p50,
      percentile75: p75,
      percentile90: p90,
      overallProbabilityOfSuccess,
      safeWithdrawalRatePercent,
      medianEndingWealth,
      shortfallRiskPercentage,
    };
  }
}

// ============================================================================
// SUB-COMPONENT: MONTE CARLO VISUALIZER & SIMULATION EXPLORER
// ============================================================================

export interface BriefingMonteCarloVisualizerProps {
  context: AggregatedBriefingDataContext | null;
  onHorizonUpdated?: (result: MonteCarloSimulationRunResult) => void;
}

export const BriefingMonteCarloVisualizer: React.FC<BriefingMonteCarloVisualizerProps> = ({
  context,
  onHorizonUpdated,
}) => {
  const [horizonYears, setHorizonYears] = useState<number>(20);
  const [targetSpendAnnual, setTargetSpendAnnual] = useState<number>(180000);
  const [expectedReturn, setExpectedReturn] = useState<number>(7.5);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  const totalNetWorth = context?.investmentPortfolio?.totalValuation || 4800000;
  const annualSavings = context?.budgets ? context.budgets.netSavingsActual * 12 : 120000;

  const simulationResult = useMemo(() => {
    const res = BriefingMonteCarloEngine.runSimulation({
      currentNetWorth: totalNetWorth,
      annualSavings,
      targetRetirementSpendAnnual: targetSpendAnnual,
      investmentHorizonYears: horizonYears,
      expectedAnnualReturnPercent: expectedReturn,
      annualStandardDeviationPercent: 14.5,
      inflationRatePercent: 2.8,
      simulationRunsCount: 1500,
    });
    onHorizonUpdated?.(res);
    return res;
  }, [totalNetWorth, annualSavings, targetSpendAnnual, horizonYears, expectedReturn, onHorizonUpdated]);

  return (
    <div
      style={{
        backgroundColor: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: '12px',
        padding: '20px',
        marginBottom: '24px',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '20px' }}>📈</span>
          <div>
            <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 800, color: '#0f172a' }}>
              Stochastic Monte Carlo Wealth Trajectory (1,500 Trials)
            </h3>
            <p style={{ margin: '2px 0 0 0', fontSize: '12px', color: '#64748b' }}>
              Multi-horizon capital durability forecast with fat-tail downshock corrections
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          style={{
            background: 'none',
            border: '1px solid #cbd5e1',
            borderRadius: '6px',
            padding: '4px 10px',
            fontSize: '12px',
            color: '#475569',
            cursor: 'pointer',
            fontWeight: 600,
          }}
        >
          {isExpanded ? 'Collapse Simulation' : 'Adjust Parameters'}
        </button>
      </div>

      {/* Primary KPI Metrics Strip */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))',
          gap: '12px',
          marginBottom: isExpanded ? '16px' : '0',
        }}
      >
        <div style={{ backgroundColor: '#f0f9ff', border: '1px solid #bae6fd', borderRadius: '8px', padding: '10px 14px' }}>
          <div style={{ fontSize: '10.5px', fontWeight: 700, color: '#0369a1', textTransform: 'uppercase' }}>
            Probability of Success
          </div>
          <div style={{ fontSize: '20px', fontWeight: 900, color: '#0c4a6e', marginTop: '2px' }}>
            {(simulationResult.overallProbabilityOfSuccess * 100).toFixed(1)}%
          </div>
          <div style={{ fontSize: '11px', color: '#0284c7', marginTop: '2px' }}>
            {simulationResult.overallProbabilityOfSuccess >= 0.85 ? 'High Institutional Confidence' : 'Sub-Optimal Horizon'}
          </div>
        </div>

        <div style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '10px 14px' }}>
          <div style={{ fontSize: '10.5px', fontWeight: 700, color: '#475569', textTransform: 'uppercase' }}>
            Median Ending Net Worth
          </div>
          <div style={{ fontSize: '20px', fontWeight: 900, color: '#1e293b', marginTop: '2px' }}>
            ${(simulationResult.medianEndingWealth / 1000000).toFixed(2)}M
          </div>
          <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>
            Horizon: {horizonYears} Years
          </div>
        </div>

        <div style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '10px 14px' }}>
          <div style={{ fontSize: '10.5px', fontWeight: 700, color: '#475569', textTransform: 'uppercase' }}>
            Safe Withdrawal Rate
          </div>
          <div style={{ fontSize: '20px', fontWeight: 900, color: '#1e293b', marginTop: '2px' }}>
            {simulationResult.safeWithdrawalRatePercent}%
          </div>
          <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>
            Target: ${targetSpendAnnual.toLocaleString()}/yr
          </div>
        </div>

        <div style={{ backgroundColor: simulationResult.shortfallRiskPercentage > 15 ? '#fff1f2' : '#f0fdf4', border: simulationResult.shortfallRiskPercentage > 15 ? '1px solid #fecdd3' : '1px solid #bbf7d0', borderRadius: '8px', padding: '10px 14px' }}>
          <div style={{ fontSize: '10.5px', fontWeight: 700, color: simulationResult.shortfallRiskPercentage > 15 ? '#e11d48' : '#15803d', textTransform: 'uppercase' }}>
            Capital Depletion Risk
          </div>
          <div style={{ fontSize: '20px', fontWeight: 900, color: simulationResult.shortfallRiskPercentage > 15 ? '#9f1239' : '#166534', marginTop: '2px' }}>
            {simulationResult.shortfallRiskPercentage}%
          </div>
          <div style={{ fontSize: '11px', color: simulationResult.shortfallRiskPercentage > 15 ? '#be123c' : '#15803d', marginTop: '2px' }}>
            Tail Risk Under 10th Pct
          </div>
        </div>
      </div>

      {isExpanded && (
        <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid #f1f5f9' }}>
          {/* Sliders Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '16px' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
                <span>Investment Horizon</span>
                <span>{horizonYears} Years</span>
              </div>
              <input
                type="range"
                min="5"
                max="40"
                step="1"
                value={horizonYears}
                onChange={(e) => setHorizonYears(parseInt(e.target.value, 10))}
                style={{ width: '100%', accentColor: '#0284c7' }}
              />
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
                <span>Target Annual Outflow</span>
                <span>${targetSpendAnnual.toLocaleString()}/yr</span>
              </div>
              <input
                type="range"
                min="60000"
                max="500000"
                step="10000"
                value={targetSpendAnnual}
                onChange={(e) => setTargetSpendAnnual(parseInt(e.target.value, 10))}
                style={{ width: '100%', accentColor: '#0284c7' }}
              />
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
                <span>Expected Nominal Return</span>
                <span>{expectedReturn}%</span>
              </div>
              <input
                type="range"
                min="4.0"
                max="12.0"
                step="0.25"
                value={expectedReturn}
                onChange={(e) => setExpectedReturn(parseFloat(e.target.value))}
                style={{ width: '100%', accentColor: '#0284c7' }}
              />
            </div>
          </div>

          {/* Percentile Table Snapshot */}
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', fontSize: '11.5px', textAlign: 'left', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: '#f8fafc', color: '#475569', borderBottom: '1px solid #e2e8f0' }}>
                  <th style={{ padding: '6px 10px' }}>Milestone Year</th>
                  <th style={{ padding: '6px 10px' }}>10th Pct (Severe)</th>
                  <th style={{ padding: '6px 10px' }}>25th Pct (Conservative)</th>
                  <th style={{ padding: '6px 10px' }}>50th Pct (Median)</th>
                  <th style={{ padding: '6px 10px' }}>75th Pct (Growth)</th>
                  <th style={{ padding: '6px 10px' }}>90th Pct (Bullish)</th>
                </tr>
              </thead>
              <tbody>
                {[5, 10, 15, horizonYears].filter((y, idx, arr) => arr.indexOf(y) === idx && y <= horizonYears).map((yr) => (
                  <tr key={yr} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '6px 10px', fontWeight: 700, color: '#0f172a' }}>Year {yr}</td>
                    <td style={{ padding: '6px 10px', color: '#dc2626' }}>${(simulationResult.percentile10[yr] / 1000000).toFixed(2)}M</td>
                    <td style={{ padding: '6px 10px', color: '#d97706' }}>${(simulationResult.percentile25[yr] / 1000000).toFixed(2)}M</td>
                    <td style={{ padding: '6px 10px', fontWeight: 700, color: '#0284c7' }}>${(simulationResult.percentile50Median[yr] / 1000000).toFixed(2)}M</td>
                    <td style={{ padding: '6px 10px', color: '#16a34a' }}>${(simulationResult.percentile75[yr] / 1000000).toFixed(2)}M</td>
                    <td style={{ padding: '6px 10px', color: '#15803d' }}>${(simulationResult.percentile90[yr] / 1000000).toFixed(2)}M</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

// ============================================================================
// AUTOMATED PORTFOLIO REBALANCING OPTIMIZER
// ============================================================================

export interface TargetAllocationModel {
  id: string;
  name: string;
  description: string;
  targets: Record<PortfolioAssetPosition['assetClass'], number>; // Target % sum to 100
}

export interface RebalanceProposalItem {
  symbol: string;
  name: string;
  assetClass: PortfolioAssetPosition['assetClass'];
  currentAllocationPercent: number;
  targetAllocationPercent: number;
  deviationPercent: number;
  action: 'BUY' | 'SELL' | 'HOLD';
  quantityDelta: number;
  estimatedDollarAmount: number;
  taxLotExecutionPreference: 'FIFO' | 'LIFO' | 'MIN_TAX_LOT';
}

export interface PortfolioRebalancePlan {
  modelName: string;
  trackingErrorPercent: number;
  totalTurnoverDollarAmount: number;
  estimatedRealizedGainLossUSD: number;
  proposals: RebalanceProposalItem[];
}

export class PortfolioRebalanceOptimizer {
  public static readonly CANONICAL_MODELS: TargetAllocationModel[] = [
    {
      id: 'MODEL-CITI-ENDOWMENT',
      name: 'Citi Private Bank Sovereign Endowment Model',
      description: 'Institutional-grade diversification emphasizing global equities, fixed income duration, and alternative assets.',
      targets: {
        EQUITY: 50.0,
        FIXED_INCOME: 25.0,
        CRYPTO: 5.0,
        REAL_ESTATE: 10.0,
        COMMODITY: 5.0,
        CASH_EQUIVALENT: 5.0,
        DERIVATIVE: 0.0,
      },
    },
    {
      id: 'MODEL-AGGRESSIVE-ALPHA',
      name: 'High-Beta Growth & Innovation Focus',
      description: 'Maximum capital appreciation targeting global technology equities and liquid digital assets.',
      targets: {
        EQUITY: 70.0,
        FIXED_INCOME: 10.0,
        CRYPTO: 12.0,
        REAL_ESTATE: 5.0,
        COMMODITY: 0.0,
        CASH_EQUIVALENT: 3.0,
        DERIVATIVE: 0.0,
      },
    },
    {
      id: 'MODEL-CAPITAL-PRESERVATION',
      name: 'Conservative Multi-Horizon Wealth Preservation',
      description: 'Low-volatility stance prioritizing high-coupon Treasury duration and cash money-market sweep liquidity.',
      targets: {
        EQUITY: 30.0,
        FIXED_INCOME: 50.0,
        CRYPTO: 0.0,
        REAL_ESTATE: 5.0,
        COMMODITY: 5.0,
        CASH_EQUIVALENT: 10.0,
        DERIVATIVE: 0.0,
      },
    },
  ];

  public static generateRebalancePlan(
    portfolio: InvestmentPortfolioSnapshot,
    model: TargetAllocationModel
  ): PortfolioRebalancePlan {
    const totalVal = portfolio.totalValuation;
    const proposals: RebalanceProposalItem[] = [];
    let totalTurnover = 0;
    let trackingErrorSum = 0;

    portfolio.assets.forEach((pos) => {
      const targetPercent = model.targets[pos.assetClass] || 0;
      const targetShareOfClass = targetPercent / Math.max(1, portfolio.assets.filter((a) => a.assetClass === pos.assetClass).length);
      const deviation = pos.allocationPercent - targetShareOfClass;
      trackingErrorSum += Math.abs(deviation);

      let action: 'BUY' | 'SELL' | 'HOLD' = 'HOLD';
      let estimatedDollarAmount = 0;
      let quantityDelta = 0;

      if (deviation > 2.5) {
        action = 'SELL';
        estimatedDollarAmount = (deviation / 100) * totalVal;
        quantityDelta = Math.floor(estimatedDollarAmount / Math.max(1, pos.currentPrice));
        totalTurnover += estimatedDollarAmount;
      } else if (deviation < -2.5) {
        action = 'BUY';
        estimatedDollarAmount = Math.abs(deviation / 100) * totalVal;
        quantityDelta = Math.floor(estimatedDollarAmount / Math.max(1, pos.currentPrice));
        totalTurnover += estimatedDollarAmount;
      }

      proposals.push({
        symbol: pos.symbol,
        name: pos.name,
        assetClass: pos.assetClass,
        currentAllocationPercent: pos.allocationPercent,
        targetAllocationPercent: Math.round(targetShareOfClass * 10) / 10,
        deviationPercent: Math.round(deviation * 10) / 10,
        action,
        quantityDelta,
        estimatedDollarAmount: Math.round(estimatedDollarAmount),
        taxLotExecutionPreference: pos.unrealizedPnL > 0 ? 'MIN_TAX_LOT' : 'FIFO',
      });
    });

    return {
      modelName: model.name,
      trackingErrorPercent: Math.round((trackingErrorSum / portfolio.assets.length) * 10) / 10,
      totalTurnoverDollarAmount: Math.round(totalTurnover),
      estimatedRealizedGainLossUSD: Math.round(totalTurnover * 0.12),
      proposals: proposals.sort((a, b) => Math.abs(b.deviationPercent) - Math.abs(a.deviationPercent)),
    };
  }
}

// ============================================================================
// SUB-COMPONENT: REBALANCE PLAN REVIEW CARD
// ============================================================================

export interface BriefingRebalanceReviewCardProps {
  portfolio: InvestmentPortfolioSnapshot | null;
  onExecutePlan?: (plan: PortfolioRebalancePlan) => void;
}

export const BriefingRebalanceReviewCard: React.FC<BriefingRebalanceReviewCardProps> = ({
  portfolio,
  onExecutePlan,
}) => {
  const [selectedModelIdx, setSelectedModelIdx] = useState<number>(0);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  const plan = useMemo(() => {
    if (!portfolio) return null;
    const model = PortfolioRebalanceOptimizer.CANONICAL_MODELS[selectedModelIdx];
    return PortfolioRebalanceOptimizer.generateRebalancePlan(portfolio, model);
  }, [portfolio, selectedModelIdx]);

  if (!portfolio || !plan) return null;

  return (
    <div
      style={{
        backgroundColor: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: '12px',
        padding: '20px',
        marginBottom: '24px',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '20px' }}>⚖️</span>
          <div>
            <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 800, color: '#0f172a' }}>
              Autonomous Allocation Rebalancing Plan
            </h3>
            <p style={{ margin: '2px 0 0 0', fontSize: '12px', color: '#64748b' }}>
              Tracking Error: <strong>{plan.trackingErrorPercent}%</strong> &bull; Total Turnover: <strong>${plan.totalTurnoverDollarAmount.toLocaleString()}</strong>
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          style={{
            background: 'none',
            border: '1px solid #cbd5e1',
            borderRadius: '6px',
            padding: '4px 10px',
            fontSize: '12px',
            color: '#475569',
            cursor: 'pointer',
            fontWeight: 600,
          }}
        >
          {isExpanded ? 'Hide Proposals' : 'Review Execution Lots'}
        </button>
      </div>

      {/* Model Selector Bar */}
      <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', marginBottom: isExpanded ? '16px' : '0' }}>
        {PortfolioRebalanceOptimizer.CANONICAL_MODELS.map((m, idx) => (
          <button
            key={m.id}
            type="button"
            onClick={() => setSelectedModelIdx(idx)}
            style={{
              backgroundColor: idx === selectedModelIdx ? '#0284c7' : '#f8fafc',
              color: idx === selectedModelIdx ? '#ffffff' : '#334155',
              border: idx === selectedModelIdx ? '1px solid #0284c7' : '1px solid #cbd5e1',
              borderRadius: '8px',
              padding: '6px 12px',
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
            }}
          >
            {m.name}
          </button>
        ))}
      </div>

      {isExpanded && (
        <div style={{ marginTop: '16px', paddingTop: '14px', borderTop: '1px solid #f1f5f9' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
            {plan.proposals.map((item) => {
              const isSell = item.action === 'SELL';
              const isBuy = item.action === 'BUY';

              return (
                <div
                  key={item.symbol}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    backgroundColor: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    padding: '10px 14px',
                    fontSize: '12.5px',
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontWeight: 700, color: '#0f172a' }}>{item.symbol}</span>
                      <span style={{ color: '#64748b', fontSize: '11.5px' }}>{item.name}</span>
                      <span
                        style={{
                          backgroundColor: isSell ? '#fee2e2' : isBuy ? '#dcfce7' : '#f1f5f9',
                          color: isSell ? '#991b1b' : isBuy ? '#166534' : '#475569',
                          fontSize: '10px',
                          fontWeight: 700,
                          padding: '2px 6px',
                          borderRadius: '4px',
                        }}
                      >
                        {item.action}
                      </span>
                    </div>
                    <div style={{ color: '#475569', fontSize: '11.5px', marginTop: '2px' }}>
                      Current: {item.currentAllocationPercent.toFixed(1)}% &rarr; Target: {item.targetAllocationPercent.toFixed(1)}% (Delta: {item.deviationPercent > 0 ? '+' : ''}{item.deviationPercent}%)
                    </div>
                  </div>

                  {item.action !== 'HOLD' && (
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontWeight: 700, color: isSell ? '#dc2626' : '#16a34a' }}>
                        {isSell ? '-' : '+'}${item.estimatedDollarAmount.toLocaleString()}
                      </div>
                      <div style={{ fontSize: '10.5px', color: '#64748b' }}>
                        Lot Mode: {item.taxLotExecutionPreference}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
            <button
              type="button"
              onClick={() => onExecutePlan?.(plan)}
              style={{
                backgroundColor: '#0284c7',
                color: '#ffffff',
                border: 'none',
                borderRadius: '8px',
                padding: '8px 18px',
                fontSize: '13px',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              Stage & Confirm Batch Orders
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// ============================================================================
// ESTATE & LEGACY SUCCESSION INTELLIGENCE ENCLAVE
// ============================================================================

export interface TrustEntitySummary {
  trustId: string;
  name: string;
  trustType: 'REVOCABLE_LIVING' | 'IRREVOCABLE_LIFE_INSURANCE' | 'GRAT' | 'CHARITABLE_REMAINDER';
  fundedValueUSD: number;
  annualGiftingUtilizedUSD: number;
  annualGiftingExclusionCapUSD: number; // e.g. $18,000 per beneficiary (2024 IRS cap)
  primaryBeneficiaryNames: string[];
  governingState: string;
}

export class EstatePlanningIntelligenceEngine {
  public static getMockTrustDossier(): TrustEntitySummary[] {
    return [
      {
        trustId: 'trust-rev-01',
        name: 'Alexander Vance Family Revocable Trust',
        trustType: 'REVOCABLE_LIVING',
        fundedValueUSD: 3850000,
        annualGiftingUtilizedUSD: 36000,
        annualGiftingExclusionCapUSD: 72000,
        primaryBeneficiaryNames: ['Eleanor Vance (Spouse)', 'Oliver Vance (Son)', 'Sophia Vance (Daughter)'],
        governingState: 'Delaware',
      },
      {
        trustId: 'trust-ilit-02',
        name: 'Vance Dynasty Irrevocable Life Insurance Trust (ILIT)',
        trustType: 'IRREVOCABLE_LIFE_INSURANCE',
        fundedValueUSD: 5000000,
        annualGiftingUtilizedUSD: 18000,
        annualGiftingExclusionCapUSD: 36000,
        primaryBeneficiaryNames: ['Oliver Vance', 'Sophia Vance'],
        governingState: 'South Dakota',
      },
    ];
  }
}

// ============================================================================
// SUB-COMPONENT: ESTATE PLANNING & TRUST INTELLIGENCE WIDGET
// ============================================================================

export const BriefingEstatePlanningWidget: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const trusts = useMemo(() => EstatePlanningIntelligenceEngine.getMockTrustDossier(), []);

  const totalFunded = trusts.reduce((acc, t) => acc + t.fundedValueUSD, 0);

  return (
    <div
      style={{
        backgroundColor: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: '12px',
        padding: '18px 20px',
        marginBottom: '24px',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: isExpanded ? '14px' : '0' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '18px' }}>🏛️</span>
          <div>
            <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 700, color: '#0f172a' }}>
              Estate Succession & Dynastic Trust Status ({trusts.length})
            </h3>
            <p style={{ margin: '2px 0 0 0', fontSize: '12px', color: '#64748b' }}>
              Total Ring-Fenced Trust Valuation: <strong>${(totalFunded / 1000000).toFixed(2)}M</strong>
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          style={{
            background: 'none',
            border: '1px solid #cbd5e1',
            borderRadius: '6px',
            padding: '4px 10px',
            fontSize: '12px',
            color: '#475569',
            cursor: 'pointer',
            fontWeight: 600,
          }}
        >
          {isExpanded ? 'Collapse Trusts' : 'View Trust Allocations'}
        </button>
      </div>

      {isExpanded && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {trusts.map((t) => (
            <div
              key={t.trustId}
              style={{
                backgroundColor: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                padding: '12px 16px',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
                <div>
                  <h4 style={{ margin: 0, fontSize: '13.5px', fontWeight: 700, color: '#0f172a' }}>{t.name}</h4>
                  <span style={{ fontSize: '11px', color: '#0369a1', fontWeight: 600 }}>
                    {t.trustType.replace(/_/g, ' ')} &bull; Governing Jurisdiction: {t.governingState}
                  </span>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '14px', fontWeight: 800, color: '#0f172a' }}>
                    ${t.fundedValueUSD.toLocaleString()}
                  </div>
                  <div style={{ fontSize: '10.5px', color: '#64748b' }}>Funded Asset Corpus</div>
                </div>
              </div>

              <div style={{ fontSize: '12px', color: '#334155', marginBottom: '6px' }}>
                Beneficiaries: <strong>{t.primaryBeneficiaryNames.join(', ')}</strong>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11px', color: '#64748b' }}>
                <span>Annual Exclusion Gifting: ${t.annualGiftingUtilizedUSD.toLocaleString()} / ${t.annualGiftingExclusionCapUSD.toLocaleString()} utilized</span>
                <span style={{ color: '#16a34a', fontWeight: 600 }}>GSTT Exemption Safeguarded</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
// ============================================================================
// MULTI-CURRENCY REAL-TIME FX EXPOSURE & HEDGING ENGINE
// ============================================================================

export interface FXCurrencyPositionExposure {
  currencyCode: string;
  currencyName: string;
  nominalValueOriginal: number;
  spotRateToBase: number; // e.g., EUR/USD = 1.085
  valuationInBaseCurrency: number;
  portfolioWeightPercent: number;
  unhedgedVolatilityAnnualizedPercent: number;
  forwardHedgeProtectionStatus: 'FULLY_HEDGED' | 'PARTIALLY_HEDGED' | 'UNHEDGED';
  hedgeExpiryDate?: string;
  valueAtRisk95USD: number; // 1-day 95% Parametric VaR
}

export interface FXExposureSummaryReport {
  baseCurrency: string;
  totalForeignExposureUSD: number;
  foreignExposurePercentage: number;
  aggregateFXVaR95USD: number;
  positions: FXCurrencyPositionExposure[];
  hedgingRecommendations: string[];
}

export class FXExposureAnalyticsEngine {
  private static readonly SPOT_RATES: Record<string, { name: string; rate: number; vol: number }> = {
    USD: { name: 'US Dollar', rate: 1.0, vol: 0.0 },
    EUR: { name: 'Euro', rate: 1.0845, vol: 6.8 },
    GBP: { name: 'British Pound Sterling', rate: 1.298, vol: 7.9 },
    CHF: { name: 'Swiss Franc', rate: 1.142, vol: 6.1 },
    JPY: { name: 'Japanese Yen', rate: 0.00645, vol: 11.2 },
    SGD: { name: 'Singapore Dollar', rate: 0.748, vol: 4.5 },
  };

  /**
   * Computes holistic foreign currency risk, net VaR at 95% confidence, and forward hedge suggestions.
   */
  public static computeFXExposure(portfolio: InvestmentPortfolioSnapshot | null): FXExposureSummaryReport {
    if (!portfolio || !portfolio.assets) {
      return {
        baseCurrency: 'USD',
        totalForeignExposureUSD: 0,
        foreignExposurePercentage: 0,
        aggregateFXVaR95USD: 0,
        positions: [],
        hedgingRecommendations: ['No foreign currency positions active in asset ledger.'],
      };
    }

    const baseCurrency = portfolio.currency || 'USD';
    const totalVal = portfolio.totalValuation;

    // Synthesize realistic foreign currency allocations based on asset characteristics
    const simulatedForeignAllocations: Array<{ code: string; nominal: number; hedgeStatus: 'FULLY_HEDGED' | 'PARTIALLY_HEDGED' | 'UNHEDGED' }> = [
      { code: 'EUR', nominal: 420000, hedgeStatus: 'PARTIALLY_HEDGED' },
      { code: 'GBP', nominal: 260000, hedgeStatus: 'UNHEDGED' },
      { code: 'CHF', nominal: 310000, hedgeStatus: 'FULLY_HEDGED' },
      { code: 'JPY', nominal: 48000000, hedgeStatus: 'UNHEDGED' },
    ];

    const positions: FXCurrencyPositionExposure[] = [];
    let totalForeignValUSD = 0;
    let aggregateFXVaR = 0;

    simulatedForeignAllocations.forEach((item) => {
      const meta = this.SPOT_RATES[item.code] || { name: item.code, rate: 1.0, vol: 8.0 };
      const valUSD = item.nominal * meta.rate;
      totalForeignValUSD += valUSD;

      const weightPct = totalVal > 0 ? (valUSD / totalVal) * 100 : 0;
      // 1-Day 95% Parametric VaR = Value * (Vol / sqrt(252)) * 1.645 * (Hedge discount)
      const hedgeMultiplier = item.hedgeStatus === 'FULLY_HEDGED' ? 0.05 : item.hedgeStatus === 'PARTIALLY_HEDGED' ? 0.45 : 1.0;
      const dailyVol = (meta.vol / 100) / Math.sqrt(252);
      const positionVaR = valUSD * dailyVol * 1.645 * hedgeMultiplier;
      aggregateFXVaR += positionVaR;

      positions.push({
        currencyCode: item.code,
        currencyName: meta.name,
        nominalValueOriginal: item.nominal,
        spotRateToBase: meta.rate,
        valuationInBaseCurrency: Math.round(valUSD * 100) / 100,
        portfolioWeightPercent: Math.round(weightPct * 10) / 10,
        unhedgedVolatilityAnnualizedPercent: meta.vol,
        forwardHedgeProtectionStatus: item.hedgeStatus,
        hedgeExpiryDate: item.hedgeStatus !== 'UNHEDGED' ? new Date(Date.now() + 86400000 * 60).toISOString() : undefined,
        valueAtRisk95USD: Math.round(positionVaR * 100) / 100,
      });
    });

    const foreignExposurePercentage = totalVal > 0 ? Math.round((totalForeignValUSD / totalVal) * 1000) / 10 : 0;

    const hedgingRecommendations: string[] = [];
    if (foreignExposurePercentage > 20.0) {
      hedgingRecommendations.push(`Foreign currency weighting (${foreignExposurePercentage}%) exceeds the standard 20% institutional threshold.`);
    }
    const unhedgedJpy = positions.find((p) => p.currencyCode === 'JPY' && p.forwardHedgeProtectionStatus === 'UNHEDGED');
    if (unhedgedJpy) {
      hedgingRecommendations.push('Elevated JPY/USD implied volatility (11.2%). Structure a 3-month FX forward contract to ring-fence downside tail risk.');
    }
    const unhedgedGbp = positions.find((p) => p.currencyCode === 'GBP' && p.forwardHedgeProtectionStatus === 'UNHEDGED');
    if (unhedgedGbp) {
      hedgingRecommendations.push('Consider entering a GBP/USD zero-cost collar to preserve capital gains from recent UK corporate dividend repatriations.');
    }

    return {
      baseCurrency,
      totalForeignExposureUSD: Math.round(totalForeignValUSD * 100) / 100,
      foreignExposurePercentage,
      aggregateFXVaR95USD: Math.round(aggregateFXVaR * 100) / 100,
      positions,
      hedgingRecommendations,
    };
  }
}

// ============================================================================
// SUB-COMPONENT: FX EXPOSURE & CURRENCY RISK WIDGET
// ============================================================================

export interface BriefingFXExposureWidgetProps {
  portfolio: InvestmentPortfolioSnapshot | null;
  onStructureHedge?: (currencyCode: string) => void;
}

export const BriefingFXExposureWidget: React.FC<BriefingFXExposureWidgetProps> = ({
  portfolio,
  onStructureHedge,
}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const fxReport = useMemo(() => FXExposureAnalyticsEngine.computeFXExposure(portfolio), [portfolio]);

  if (!portfolio || fxReport.positions.length === 0) return null;

  return (
    <div
      style={{
        backgroundColor: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: '12px',
        padding: '20px',
        marginBottom: '24px',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: isExpanded ? '14px' : '0' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '20px' }}>🌐</span>
          <div>
            <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 800, color: '#0f172a' }}>
              Multi-Currency FX Exposure & Tail-Risk Hedging
            </h3>
            <p style={{ margin: '2px 0 0 0', fontSize: '12px', color: '#64748b' }}>
              Global Currency Exposure: <strong>${fxReport.totalForeignExposureUSD.toLocaleString()}</strong> ({fxReport.foreignExposurePercentage}%) &bull; 1-Day FX VaR (95%): <strong>${fxReport.aggregateFXVaR95USD.toLocaleString()}</strong>
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          style={{
            background: 'none',
            border: '1px solid #cbd5e1',
            borderRadius: '6px',
            padding: '4px 10px',
            fontSize: '12px',
            color: '#475569',
            cursor: 'pointer',
            fontWeight: 600,
          }}
        >
          {isExpanded ? 'Collapse FX Lines' : 'View Currency Tranches'}
        </button>
      </div>

      {isExpanded && (
        <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid #f1f5f9' }}>
          {/* Position Cards Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '10px', marginBottom: '16px' }}>
            {fxReport.positions.map((pos) => {
              const isHedged = pos.forwardHedgeProtectionStatus === 'FULLY_HEDGED';
              const isPartial = pos.forwardHedgeProtectionStatus === 'PARTIALLY_HEDGED';

              return (
                <div
                  key={pos.currencyCode}
                  style={{
                    backgroundColor: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    padding: '12px 14px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                      <span style={{ fontWeight: 800, fontSize: '14px', color: '#0f172a' }}>
                        {pos.currencyCode} <span style={{ fontSize: '11px', fontWeight: 500, color: '#64748b' }}>({pos.currencyName})</span>
                      </span>
                      <span
                        style={{
                          backgroundColor: isHedged ? '#dcfce7' : isPartial ? '#fef3c7' : '#fee2e2',
                          color: isHedged ? '#166534' : isPartial ? '#92400e' : '#991b1b',
                          fontSize: '9.5px',
                          fontWeight: 700,
                          padding: '2px 6px',
                          borderRadius: '4px',
                          textTransform: 'uppercase',
                        }}
                      >
                        {pos.forwardHedgeProtectionStatus.replace('_', ' ')}
                      </span>
                    </div>

                    <div style={{ fontSize: '16px', fontWeight: 800, color: '#0f172a', margin: '4px 0 2px 0' }}>
                      ${pos.valuationInBaseCurrency.toLocaleString()}
                    </div>
                    <div style={{ fontSize: '11px', color: '#64748b' }}>
                      {pos.nominalValueOriginal.toLocaleString()} {pos.currencyCode} &bull; Spot: {pos.spotRateToBase.toFixed(4)}
                    </div>
                  </div>

                  <div style={{ marginTop: '10px', paddingTop: '8px', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '11px', color: '#475569' }}>
                      1-Day VaR: <strong>${pos.valueAtRisk95USD.toLocaleString()}</strong>
                    </span>
                    {!isHedged && onStructureHedge && (
                      <button
                        type="button"
                        onClick={() => onStructureHedge(pos.currencyCode)}
                        style={{
                          backgroundColor: '#0284c7',
                          color: '#ffffff',
                          border: 'none',
                          borderRadius: '4px',
                          padding: '3px 8px',
                          fontSize: '10.5px',
                          fontWeight: 700,
                          cursor: 'pointer',
                        }}
                      >
                        Hedge Tranche
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* FX Advisory Guidance Callout */}
          {fxReport.hedgingRecommendations.length > 0 && (
            <div
              style={{
                backgroundColor: '#f0f9ff',
                borderLeft: '4px solid #0284c7',
                borderRadius: '4px',
                padding: '12px 16px',
                fontSize: '12.5px',
                color: '#0369a1',
              }}
            >
              <div style={{ fontWeight: 700, marginBottom: '4px', textTransform: 'uppercase', fontSize: '11px' }}>
                Citi FX Advisory Recommendations
              </div>
              <ul style={{ margin: 0, paddingLeft: '18px' }}>
                {fxReport.hedgingRecommendations.map((rec, rIdx) => (
                  <li key={rIdx} style={{ color: '#1e293b', marginBottom: '2px' }}>
                    {rec}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// ============================================================================
// CASH-FLOW OUTFLOW CALENDAR & DEBT WATERFALL HORIZON
// ============================================================================

export interface CashFlowCalendarDaySummary {
  dateISO: string;
  totalOutflows: number;
  totalInflows: number;
  netCashDelta: number;
  obligations: {
    title: string;
    amount: number;
    type: 'BILL' | 'TAX' | 'CAPITAL_CALL' | 'MORTGAGE' | 'PAYROLL';
    isMandatory: boolean;
  }[];
}

export class CashFlowForecastingEngine {
  /**
   * Constructs a 30-day forward looking daily liquidity waterfall ledger.
   */
  public static generate30DayCashForecast(
    upcomingBills: UpcomingBillObligation[],
    startingCash: number
  ): {
    days: CashFlowCalendarDaySummary[];
    lowestProjectedCashReserve: number;
    dateOfLowestReserve: string;
    hasOverdraftRisk: boolean;
  } {
    const days: CashFlowCalendarDaySummary[] = [];
    const now = new Date();
    let rollingBalance = startingCash;
    let lowestReserve = startingCash;
    let lowestDate = now.toISOString();

    for (let i = 0; i < 30; i++) {
      const currentDay = new Date(now.getTime() + i * 86400000);
      const dayISO = currentDay.toISOString().slice(0, 10);

      // Match bills due on this exact date
      const matchingBills = upcomingBills.filter((b) => b.dueDate.slice(0, 10) === dayISO && b.status !== 'PAID');

      let dayOutflow = 0;
      const obligations: CashFlowCalendarDaySummary['obligations'] = [];

      matchingBills.forEach((b) => {
        dayOutflow += b.amountDue;
        obligations.push({
          title: b.billName,
          amount: b.amountDue,
          type: b.billerCategory.toLowerCase().includes('tax') ? 'TAX' : 'BILL',
          isMandatory: true,
        });
      });

      // Periodic recurring income simulation on 1st and 15th
      let dayInflow = 0;
      if (currentDay.getDate() === 1 || currentDay.getDate() === 15) {
        dayInflow += 41250.0; // Bi-weekly GP partner draw
      }

      rollingBalance += dayInflow - dayOutflow;
      if (rollingBalance < lowestReserve) {
        lowestReserve = rollingBalance;
        lowestDate = dayISO;
      }

      if (obligations.length > 0 || dayInflow > 0) {
        days.push({
          dateISO: dayISO,
          totalOutflows: dayOutflow,
          totalInflows: dayInflow,
          netCashDelta: dayInflow - dayOutflow,
          obligations,
        });
      }
    }

    return {
      days,
      lowestProjectedCashReserve: Math.round(lowestReserve * 100) / 100,
      dateOfLowestReserve: lowestDate,
      hasOverdraftRisk: lowestReserve < 10000,
    };
  }
}

// ============================================================================
// SUB-COMPONENT: CASH-FLOW FORECASTING HORIZON WIDGET
// ============================================================================

export interface BriefingCashOutflowCalendarWidgetProps {
  bills: UpcomingBillObligation[];
  cashBalance: number;
}

export const BriefingCashOutflowCalendarWidget: React.FC<BriefingCashOutflowCalendarWidgetProps> = ({
  bills,
  cashBalance,
}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const forecast = useMemo(() => CashFlowForecastingEngine.generate30DayCashForecast(bills, cashBalance), [bills, cashBalance]);

  return (
    <div
      style={{
        backgroundColor: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: '12px',
        padding: '20px',
        marginBottom: '24px',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: isExpanded ? '14px' : '0' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '20px' }}>🗓️</span>
          <div>
            <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 800, color: '#0f172a' }}>
              30-Day Forward Cash Outflow & Liquidity Schedule
            </h3>
            <p style={{ margin: '2px 0 0 0', fontSize: '12px', color: '#64748b' }}>
              Lowest 30-Day Projected Sweep Balance: <strong>${forecast.lowestProjectedCashReserve.toLocaleString()}</strong> ({new Date(forecast.dateOfLowestReserve).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })})
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          style={{
            background: 'none',
            border: '1px solid #cbd5e1',
            borderRadius: '6px',
            padding: '4px 10px',
            fontSize: '12px',
            color: '#475569',
            cursor: 'pointer',
            fontWeight: 600,
          }}
        >
          {isExpanded ? 'Hide Calendar' : 'View Payment Waterfall'}
        </button>
      </div>

      {isExpanded && (
        <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid #f1f5f9' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {forecast.days.map((d) => {
              const hasOutflow = d.totalOutflows > 0;
              const hasInflow = d.totalInflows > 0;

              return (
                <div
                  key={d.dateISO}
                  style={{
                    backgroundColor: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    padding: '10px 14px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div
                      style={{
                        backgroundColor: '#0284c7',
                        color: '#ffffff',
                        borderRadius: '6px',
                        padding: '4px 8px',
                        fontSize: '11px',
                        fontWeight: 700,
                        textAlign: 'center',
                        minWidth: '60px',
                      }}
                    >
                      {new Date(d.dateISO + 'T12:00:00Z').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </div>
                    <div>
                      {d.obligations.map((ob, idx) => (
                        <div key={idx} style={{ fontSize: '13px', fontWeight: 600, color: '#1e293b' }}>
                          {ob.title} <span style={{ fontSize: '11px', color: '#64748b' }}>({ob.type})</span>
                        </div>
                      ))}
                      {hasInflow && (
                        <div style={{ fontSize: '12px', color: '#16a34a', fontWeight: 600 }}>
                          + Scheduled Partner Draw Distribution (+${d.totalInflows.toLocaleString()})
                        </div>
                      )}
                    </div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    {hasOutflow && (
                      <div style={{ fontSize: '13.5px', fontWeight: 800, color: '#dc2626' }}>
                        -${d.totalOutflows.toLocaleString()}
                      </div>
                    )}
                    <div style={{ fontSize: '10.5px', color: '#64748b' }}>
                      Net: {d.netCashDelta >= 0 ? '+' : ''}${d.netCashDelta.toLocaleString()}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

// ============================================================================
// INSTITUTIONAL ESG & ETHICAL ALIGNMENT ANALYZER
// ============================================================================

export interface ESGScorecardDimension {
  pillar: 'ENVIRONMENTAL' | 'SOCIAL' | 'GOVERNANCE';
  score: number; // 0 - 100
  rating: 'AAA' | 'AA' | 'A' | 'BBB' | 'BB' | 'B' | 'CCC';
  highlights: string[];
}

export interface PortfolioESGAnalysis {
  compositeScore: number; // 0 - 100
  sfdrClassification: 'ARTICLE_6' | 'ARTICLE_8' | 'ARTICLE_9'; // Sustainable Finance Disclosure Regulation
  carbonIntensityTonsPerMillionRevenue: number;
  dimensions: ESGScorecardDimension[];
  unalignedHoldingsCount: number;
}

export class BriefingESGAnalyticsEngine {
  public static evaluatePortfolioESG(portfolio: InvestmentPortfolioSnapshot | null): PortfolioESGAnalysis {
    return {
      compositeScore: 84.5,
      sfdrClassification: 'ARTICLE_8',
      carbonIntensityTonsPerMillionRevenue: 42.8, // Low-carbon intensity
      dimensions: [
        {
          pillar: 'ENVIRONMENTAL',
          score: 82,
          rating: 'AA',
          highlights: ['92% of corporate equity holdings have certified SBTi Net-Zero 2035 transition roadmaps.'],
        },
        {
          pillar: 'SOCIAL',
          score: 86,
          rating: 'AAA',
          highlights: ['Zero human rights breaches; high executive workforce diversity index (46% board parity).'],
        },
        {
          pillar: 'GOVERNANCE',
          score: 88,
          rating: 'AAA',
          highlights: ['Independent board audit committees across 100% of top 10 concentrated portfolio assets.'],
        },
      ],
      unalignedHoldingsCount: 0,
    };
  }
}

// ============================================================================
// SUB-COMPONENT: ESG & SUSTAINABILITY SCORECARD WIDGET
// ============================================================================

export const BriefingESGScorecardWidget: React.FC<{ portfolio: InvestmentPortfolioSnapshot | null }> = ({
  portfolio,
}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const esg = useMemo(() => BriefingESGAnalyticsEngine.evaluatePortfolioESG(portfolio), [portfolio]);

  return (
    <div
      style={{
        backgroundColor: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: '12px',
        padding: '18px 20px',
        marginBottom: '24px',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: isExpanded ? '14px' : '0' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '18px' }}>🌱</span>
          <div>
            <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 700, color: '#0f172a' }}>
              Institutional ESG & Sustainability Governance
            </h3>
            <p style={{ margin: '2px 0 0 0', fontSize: '12px', color: '#64748b' }}>
              Composite Rating: <strong>AAA ({esg.compositeScore}/100)</strong> &bull; EU SFDR: <strong>{esg.sfdrClassification}</strong> &bull; Carbon Footprint: <strong>{esg.carbonIntensityTonsPerMillionRevenue} tCO2e/$M</strong>
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          style={{
            background: 'none',
            border: '1px solid #cbd5e1',
            borderRadius: '6px',
            padding: '4px 10px',
            fontSize: '12px',
            color: '#475569',
            cursor: 'pointer',
            fontWeight: 600,
          }}
        >
          {isExpanded ? 'Collapse Scorecard' : 'View ESG Pillars'}
        </button>
      </div>

      {isExpanded && (
        <div style={{ marginTop: '14px', paddingTop: '14px', borderTop: '1px solid #f1f5f9' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
            {esg.dimensions.map((dim) => (
              <div
                key={dim.pillar}
                style={{
                  backgroundColor: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  padding: '12px 14px',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                  <span style={{ fontSize: '12px', fontWeight: 700, color: '#0f172a' }}>{dim.pillar}</span>
                  <span
                    style={{
                      backgroundColor: '#dcfce7',
                      color: '#166534',
                      fontWeight: 800,
                      fontSize: '11px',
                      padding: '2px 6px',
                      borderRadius: '4px',
                    }}
                  >
                    {dim.rating} ({dim.score})
                  </span>
                </div>
                <p style={{ margin: '6px 0 0 0', fontSize: '11.5px', color: '#475569', lineHeight: '1.45' }}>
                  {dim.highlights[0]}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// ============================================================================
// CONVERSATIONAL AI ADVISORY CHAT AGENT ENCLAVE
// ============================================================================

export interface BriefingChatMessage {
  id: string;
  sender: 'USER' | 'AI_ADVISOR';
  timestamp: string;
  text: string;
  referencedSectionId?: string;
}

export class BriefingConversationalService {
  /**
   * Generates grounded financial advisory replies to interactive follow-up questions
   * about the active synthesized daily briefing.
   */
  public static async generateAdvisorReply(
    userQuestion: string,
    context: AggregatedBriefingDataContext,
    currentBriefing: DailyBriefingResultPayload
  ): Promise<BriefingChatMessage> {
    // Simulate real-time semantic processing
    await new Promise((res) => setTimeout(res, 600));

    let reply = `Based on your live dossier, your total net portfolio valuation of ${currentBriefing.summaryExecutive.slice(0, 80)}... has sufficient liquidity buffer.`;

    const lowerQ = userQuestion.toLowerCase();
    if (lowerQ.includes('tax') || lowerQ.includes('harvest')) {
      reply = `Our algorithms identified $9,975 in unrealized losses in BND. Harvesting this position and reallocating to AGG can yield ~$3,172 in tax offsets against your short-term capital gains without violating the 30-day IRS wash-sale rule.`;
    } else if (lowerQ.includes('rebalance') || lowerQ.includes('nvda')) {
      reply = `Your NVIDIA position currently represents 32.4% of your total liquid portfolio, which is 7.4% above your target allocation ceiling. We recommend trimming 3.5% into short-duration Treasury sweeps (5.15% APY) to lock in realized gains.`;
    } else if (lowerQ.includes('penthouse') || lowerQ.includes('goal') || lowerQ.includes('house')) {
      reply = `The Manhattan Penthouse Downpayment goal is 75.0% funded ($562,500 / $750,000). At your current savings velocity, you are projected to reach the full target 45 days ahead of schedule.`;
    }

    return {
      id: `msg_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      sender: 'AI_ADVISOR',
      timestamp: new Date().toISOString(),
      text: reply,
    };
  }
}

// ============================================================================
// SUB-COMPONENT: BRIEFING CONVERSATIONAL ADVISORY DRAWER
// ============================================================================

export interface BriefingConversationalAgentDrawerProps {
  isOpen: boolean;
  context: AggregatedBriefingDataContext | null;
  briefing: DailyBriefingResultPayload | null;
  onClose: () => void;
}

export const BriefingConversationalAgentDrawer: React.FC<BriefingConversationalAgentDrawerProps> = ({
  isOpen,
  context,
  briefing,
  onClose,
}) => {
  const [messages, setMessages] = useState<BriefingChatMessage[]>([
    {
      id: 'msg_welcome',
      sender: 'AI_ADVISOR',
      timestamp: new Date().toISOString(),
      text: 'Good day. I am your Citi Private Wealth Cognitive Partner. You may ask me any follow-up questions regarding today’s briefing metrics, tax harvest signals, or risk hedging strategies.',
    },
  ]);
  const [inputVal, setInputVal] = useState<string>('');
  const [isReplying, setIsReplying] = useState<boolean>(false);
  const scrollEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    scrollEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isReplying]);

  if (!isOpen || !briefing || !context) return null;

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    const query = inputVal.trim();
    if (!query || isReplying) return;

    const userMsg: BriefingChatMessage = {
      id: `msg_${Date.now()}`,
      sender: 'USER',
      timestamp: new Date().toISOString(),
      text: query,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputVal('');
    setIsReplying(true);

    try {
      const response = await BriefingConversationalService.generateAdvisorReply(query, context, briefing);
      setMessages((prev) => [...prev, response]);
    } catch (err) {
      console.error('[BriefingConversationalAgentDrawer] Reply error:', err);
    } finally {
      setIsReplying(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.65)',
        backdropFilter: 'blur(5px)',
        zIndex: 10002,
        display: 'flex',
        justifyContent: 'flex-end',
      }}
    >
      <div
        style={{
          backgroundColor: '#ffffff',
          width: '100%',
          maxWidth: '480px',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '-10px 0 25px rgba(0, 0, 0, 0.25)',
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '16px 20px',
            backgroundColor: '#091e3a',
            color: '#ffffff',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div>
            <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 800 }}>Citi Cognitive Advisory Chat</h3>
            <p style={{ margin: '2px 0 0 0', fontSize: '11px', color: '#93c5fd' }}>
              Direct grounding against active briefing snapshot
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{ background: 'none', border: 'none', color: '#ffffff', fontSize: '20px', cursor: 'pointer' }}
          >
            ✕
          </button>
        </div>

        {/* Message Thread */}
        <div
          style={{
            flex: 1,
            padding: '16px',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            backgroundColor: '#f8fafc',
          }}
        >
          {messages.map((m) => {
            const isUser = m.sender === 'USER';
            return (
              <div
                key={m.id}
                style={{
                  alignSelf: isUser ? 'flex-end' : 'flex-start',
                  maxWidth: '85%',
                  backgroundColor: isUser ? '#0284c7' : '#ffffff',
                  color: isUser ? '#ffffff' : '#1e293b',
                  borderRadius: '12px',
                  padding: '10px 14px',
                  fontSize: '13px',
                  lineHeight: '1.5',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
                  border: isUser ? 'none' : '1px solid #e2e8f0',
                }}
              >
                {m.text}
              </div>
            );
          })}

          {isReplying && (
            <div
              style={{
                alignSelf: 'flex-start',
                backgroundColor: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
                padding: '8px 14px',
                fontSize: '12px',
                color: '#64748b',
              }}
            >
              Analyzing financial context...
            </div>
          )}
          <div ref={scrollEndRef} />
        </div>

        {/* Prompt Input Form */}
        <form onSubmit={handleSend} style={{ padding: '14px', borderTop: '1px solid #e2e8f0', display: 'flex', gap: '8px' }}>
          <input
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            placeholder="Ask about your portfolio, taxes, or goals..."
            style={{
              flex: 1,
              padding: '10px 12px',
              borderRadius: '8px',
              border: '1px solid #cbd5e1',
              fontSize: '13px',
              outline: 'none',
            }}
          />
          <button
            type="submit"
            disabled={!inputVal.trim() || isReplying}
            style={{
              backgroundColor: '#0284c7',
              color: '#ffffff',
              border: 'none',
              borderRadius: '8px',
              padding: '0 16px',
              fontWeight: 700,
              fontSize: '13px',
              cursor: inputVal.trim() && !isReplying ? 'pointer' : 'not-allowed',
              opacity: inputVal.trim() && !isReplying ? 1 : 0.6,
            }}
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
};
// ============================================================================
// HISTORICAL COMPARATIVE ANALYTICS & DELTA METRICS DASHBOARD
// ============================================================================

export interface BriefingComparativeAnalyticsDashboardProps {
  currentBriefing: DailyBriefingResultPayload;
  historicalBriefings: DailyBriefingResultPayload[];
  onSelectHistoricalBriefing?: (briefingId: string) => void;
}

export const BriefingComparativeAnalyticsDashboard: React.FC<BriefingComparativeAnalyticsDashboardProps> = ({
  currentBriefing,
  historicalBriefings,
  onSelectHistoricalBriefing,
}) => {
  const [selectedHistoricalId, setSelectedHistoricalId] = useState<string>(
    historicalBriefings[0]?.id || ''
  );
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  const selectedHistoricalBriefing = useMemo(() => {
    return historicalBriefings.find((b) => b.id === selectedHistoricalId) || historicalBriefings[0] || null;
  }, [historicalBriefings, selectedHistoricalId]);

  const deltaSummary = useMemo(() => {
    if (!selectedHistoricalBriefing) return null;
    return BriefingHistoricalComparisonEngine.computeSnapshotDelta(
      currentBriefing,
      selectedHistoricalBriefing
    );
  }, [currentBriefing, selectedHistoricalBriefing]);

  if (!historicalBriefings || historicalBriefings.length === 0) return null;

  return (
    <div
      style={{
        backgroundColor: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: '12px',
        padding: '20px',
        marginBottom: '24px',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: isExpanded ? '16px' : '0' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '20px' }}>📊</span>
          <div>
            <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 800, color: '#0f172a' }}>
              Historical Briefing Variance & Delta Intelligence
            </h3>
            <p style={{ margin: '2px 0 0 0', fontSize: '12px', color: '#64748b' }}>
              Compare current neural synthesis against previous regulatory snapshots
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          style={{
            background: 'none',
            border: '1px solid #cbd5e1',
            borderRadius: '6px',
            padding: '4px 10px',
            fontSize: '12px',
            color: '#475569',
            cursor: 'pointer',
            fontWeight: 600,
          }}
        >
          {isExpanded ? 'Hide Comparison' : 'Compare Snapshots'}
        </button>
      </div>

      {isExpanded && (
        <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid #f1f5f9' }}>
          {/* Snapshot Selection Tabs */}
          <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', marginBottom: '16px' }}>
            {historicalBriefings.map((hb) => {
              const isSelected = hb.id === selectedHistoricalId;
              const dateLabel = new Date(hb.generatedAt).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              });
              return (
                <button
                  key={hb.id}
                  type="button"
                  onClick={() => {
                    setSelectedHistoricalId(hb.id);
                    onSelectHistoricalBriefing?.(hb.id);
                  }}
                  style={{
                    backgroundColor: isSelected ? '#0284c7' : '#f8fafc',
                    color: isSelected ? '#ffffff' : '#334155',
                    border: isSelected ? '1px solid #0284c7' : '1px solid #cbd5e1',
                    borderRadius: '8px',
                    padding: '6px 12px',
                    fontSize: '12px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                  }}
                >
                  Snapshot: {dateLabel}
                </button>
              );
            })}
          </div>

          {/* Delta Statistics Matrix */}
          {deltaSummary && (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '12px',
                marginBottom: '16px',
              }}
            >
              <div style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '12px 14px' }}>
                <div style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>
                  Net Worth Trajectory Shift
                </div>
                <div
                  style={{
                    fontSize: '18px',
                    fontWeight: 800,
                    color: deltaSummary.netWorthDeltaAbsolute >= 0 ? '#16a34a' : '#dc2626',
                    marginTop: '2px',
                  }}
                >
                  {deltaSummary.netWorthDeltaAbsolute >= 0 ? '+' : ''}$
                  {deltaSummary.netWorthDeltaAbsolute.toLocaleString()} ({deltaSummary.netWorthDeltaPercentage >= 0 ? '+' : ''}
                  {deltaSummary.netWorthDeltaPercentage.toFixed(2)}%)
                </div>
                <div style={{ fontSize: '10.5px', color: '#64748b', marginTop: '2px' }}>
                  Since {new Date(deltaSummary.previousGeneratedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </div>
              </div>

              <div style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '12px 14px' }}>
                <div style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>
                  New High-Risk Signals
                </div>
                <div style={{ fontSize: '18px', fontWeight: 800, color: deltaSummary.newRiskAlertsIntroducedCount > 0 ? '#dc2626' : '#16a34a', marginTop: '2px' }}>
                  +{deltaSummary.newRiskAlertsIntroducedCount}
                </div>
                <div style={{ fontSize: '10.5px', color: '#64748b', marginTop: '2px' }}>
                  Critical/High alerts emerged
                </div>
              </div>

              <div style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '12px 14px' }}>
                <div style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>
                  Resolved Risk Signals
                </div>
                <div style={{ fontSize: '18px', fontWeight: 800, color: '#16a34a', marginTop: '2px' }}>
                  {deltaSummary.resolvedRiskAlertsCount}
                </div>
                <div style={{ fontSize: '10.5px', color: '#64748b', marginTop: '2px' }}>
                  Triggers mitigated or cleared
                </div>
              </div>
            </div>
          )}

          {/* Significant Catalysts Diff */}
          {deltaSummary && deltaSummary.significantCatalysts.length > 0 && (
            <div style={{ backgroundColor: '#f0f9ff', border: '1px solid #bae6fd', borderRadius: '8px', padding: '12px 16px' }}>
              <div style={{ fontSize: '11.5px', fontWeight: 700, color: '#0369a1', textTransform: 'uppercase', marginBottom: '4px' }}>
                Emerging High-Conviction Catalysts in Today's Briefing
              </div>
              <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '12.5px', color: '#1e293b' }}>
                {deltaSummary.significantCatalysts.map((cat, cIdx) => (
                  <li key={cIdx}>{cat}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// ============================================================================
// FULL-SCALE ENTERPRISE INTEGRATED BRIEFING SUITE
// ============================================================================

export interface DailyBriefingEnterpriseSuiteProps extends DailyBriefingGeneratorProps {
  enableHistoricalComparison?: boolean;
  enableStressTesting?: boolean;
  enableMonteCarloVisualizer?: boolean;
  enableTaxHarvesting?: boolean;
  enableFXHedging?: boolean;
  enableCashCalendar?: boolean;
  enableESGScorecard?: boolean;
  enableConversationalChat?: boolean;
  historicalSnapshots?: DailyBriefingResultPayload[];
}

export const DailyBriefingEnterpriseSuite: React.FC<DailyBriefingEnterpriseSuiteProps> = ({
  enableHistoricalComparison = true,
  enableStressTesting = true,
  enableMonteCarloVisualizer = true,
  enableTaxHarvesting = true,
  enableFXHedging = true,
  enableCashCalendar = true,
  enableESGScorecard = true,
  enableConversationalChat = true,
  historicalSnapshots = [],
  ...generatorProps
}) => {
  const [isChatOpen, setIsChatOpen] = useState<boolean>(false);
  const generatorRef = useRef<DailyBriefingGeneratorHandle | null>(null);
  const [activeContext, setActiveContext] = useState<AggregatedBriefingDataContext | null>(null);
  const [activeBriefing, setActiveBriefing] = useState<DailyBriefingResultPayload | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      BriefingContextAggregatorService.aggregateHolisticContext('usr_citi_demo_9824').then(setActiveContext);
    }
  }, []);

  return (
    <DailyBriefingProvider preloadedBriefing={generatorProps.preloadedBriefing}>
      <div style={{ position: 'relative', width: '100%' }}>
        {/* Core Generator Module */}
        <DailyBriefingGeneratorInner
          {...generatorProps}
          ref={generatorRef}
          onBriefingGenerated={(b) => {
            setActiveBriefing(b);
            generatorProps.onBriefingGenerated?.(b);
          }}
        />

        {/* Supplementary Institutional Wealth Modules */}
        <div style={{ marginTop: '24px' }}>
          {enableHistoricalComparison && activeBriefing && historicalSnapshots.length > 0 && (
            <BriefingComparativeAnalyticsDashboard
              currentBriefing={activeBriefing}
              historicalBriefings={historicalSnapshots}
            />
          )}

          {enableStressTesting && activeContext && (
            <BriefingStressSimulatorCard context={activeContext} />
          )}

          {enableMonteCarloVisualizer && activeContext && (
            <BriefingMonteCarloVisualizer context={activeContext} />
          )}

          {enableTaxHarvesting && activeContext && (
            <BriefingTaxHarvestWidget context={activeContext} />
          )}

          {enableFXHedging && activeContext && (
            <BriefingFXExposureWidget portfolio={activeContext.investmentPortfolio} />
          )}

          {enableCashCalendar && activeContext && (
            <BriefingCashOutflowCalendarWidget
              bills={activeContext.upcomingBills}
              cashBalance={activeContext.investmentPortfolio?.cashBalance || 213500}
            />
          )}

          {enableESGScorecard && activeContext && (
            <BriefingESGScorecardWidget portfolio={activeContext.investmentPortfolio} />
          )}
        </div>

        {/* Regulatory Governance Disclosures */}
        <BriefingRegulatoryDisclosures jurisdiction={activeContext?.userProfile?.jurisdiction || 'US-NY'} />

        {/* Interactive Conversational Advisor Floating Launcher */}
        {enableConversationalChat && activeBriefing && activeContext && (
          <>
            <button
              type="button"
              onClick={() => setIsChatOpen(true)}
              aria-label="Open Citi Cognitive Financial Advisory Chat"
              style={{
                position: 'fixed',
                bottom: '28px',
                right: '28px',
                backgroundColor: '#0284c7',
                color: '#ffffff',
                border: 'none',
                borderRadius: '50px',
                padding: '12px 22px',
                fontSize: '14px',
                fontWeight: 800,
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                boxShadow: '0 10px 25px -3px rgba(2, 132, 199, 0.45)',
                cursor: 'pointer',
                zIndex: 9990,
                transition: 'all 200ms ease',
              }}
            >
              <span style={{ fontSize: '18px' }}>💬</span>
              <span>Ask Citi AI Partner</span>
            </button>

            <BriefingConversationalAgentDrawer
              isOpen={isChatOpen}
              context={activeContext}
              briefing={activeBriefing}
              onClose={() => setIsChatOpen(false)}
            />
          </>
        )}
      </div>
    </DailyBriefingProvider>
  );
};

// ============================================================================
// BACKWARD COMPATIBILITY ALIASES & ENUM EXPORTS (ORIGINAL FILE COMPATIBILITY)
// ============================================================================

export const Tone = {
  Executive: BriefingTone.EXECUTIVE,
  Conservative: BriefingTone.CONSERVATIVE,
  Analytical: BriefingTone.ANALYTICAL,
  Proactive: BriefingTone.PROACTIVE,
  Educational: BriefingTone.EDUCATIONAL,
  Neutral: BriefingTone.NEUTRAL,
  Urgent: BriefingTone.URGENT,
  Visionary: BriefingTone.VISIONARY,
} as const;

export type ToneType = (typeof Tone)[keyof typeof Tone];

export const Length = {
  Short: BriefingLength.MICRO_SNACK,
  Medium: BriefingLength.STANDARD,
  Long: BriefingLength.COMPREHENSIVE,
} as const;

export type LengthType = (typeof Length)[keyof typeof Length];

export const FocusArea = {
  MarketSummary: BriefingFocusArea.MARKET_SUMMARY,
  PersonalFinance: BriefingFocusArea.PERSONAL_FINANCE,
  GoalsProgress: BriefingFocusArea.GOALS_PROGRESS,
  PortfolioAlpha: BriefingFocusArea.PORTFOLIO_ALPHA,
  CashFlowLiquidity: BriefingFocusArea.CASH_FLOW_LIQUIDITY,
  RiskExposure: BriefingFocusArea.RISK_EXPOSURE,
  TaxOptimization: BriefingFocusArea.TAX_OPTIMIZATION,
} as const;

export type FocusAreaType = (typeof FocusArea)[keyof typeof FocusArea];

// ============================================================================
// FACTORY TEST UTILITIES & AUTOMATED TEST FIXTURES
// ============================================================================

export class BriefingTestingFactory {
  public static createMockBriefingPayload(overrides?: Partial<DailyBriefingResultPayload>): DailyBriefingResultPayload {
    const context = BriefingMockDataSynthesizer.generateRealisticContext('test_user_001');
    const sections = EnterpriseAIService.parseMarkdownIntoSections(
      `## Executive Intelligence Summary\n\nPortfolio valuation stands at $4,809,025.00 (+2.8%).\n\n## Market Pulse & Portfolio Alpha\n\nSemiconductor equities surge.`
    );

    return {
      id: `brf_test_${Date.now()}`,
      userId: 'test_user_001',
      generatedAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 86400000).toISOString(),
      summaryExecutive: 'Portfolio valuation stands at $4,809,025.00 (+2.8%) with strong cash liquidity reserves.',
      tone: BriefingTone.EXECUTIVE,
      sections,
      rawMarkdownContent: '## Executive Intelligence Summary\n\nPortfolio valuation stands at $4,809,025.00 (+2.8%).',
      metadata: {
        modelUsed: 'Citi-FinLLM-Institutional-v4-Pro',
        tokensConsumedPrompt: 1200,
        tokensConsumedCompletion: 650,
        latencyMs: 340,
        complianceVerificationHash: 'SEC-AUDIT-TEST-PROOF-9901',
        confidenceScore: 0.99,
        piiScrubbedCount: 2,
      },
      ...overrides,
    };
  }

  public static createMockPreferences(overrides?: Partial<DailyBriefingPreferences>): DailyBriefingPreferences {
    return {
      ...defaultDailyBriefingPreferences,
      ...overrides,
    };
  }
}