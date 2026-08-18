// REPOSITORY SOURCE: diplomat-bit/Citibank_Demo_Business_Inc_Demonstration- | PATH: diplomat-bit-Citibank_Demo_Business_Inc_Demonstration--ab2501d/oracle_core/digital_twin/personalTwinModel.ts
================================================================================

/**
 * @file personalTwinModel.ts
 * @description Defines the comprehensive data schema for an individual user's Digital Twin.
 * This model serves as the core data structure for the Quantum Oracle, encompassing a holistic
 * view of the user's life across finance, health, productivity, and personal dimensions.
 * The schema is designed to be extensible, strongly-typed, and ready for advanced AI/ML analysis
 * and hyper-personalization.
 */

// =================================================================
// GENERIC & UTILITY TYPES
// =================================================================

/**
 * Represents a data point with its value, timestamp, and the source of the data.
 * This ensures traceability and temporal context for all captured metrics.
 */
export interface TimeSeriesDataPoint<T> {
  value: T;
  timestamp: string; // ISO 8601 format
  source: string; // e.g., 'Plaid API', 'Apple HealthKit', 'Manual Entry', 'AI Inference'
  confidence?: number; // 0.0 to 1.0, for inferred data
}

/**
 * Represents a monetary value with currency code.
 */
export interface Money {
  amount: number;
  currency: string; // ISO 4217 currency code (e.g., 'USD', 'EUR')
}

/**
 * Geographic location data.
 */
export interface GeoLocation {
  latitude: number;
  longitude: number;
  address?: string;
}

// =================================================================
// FINANCIAL TWIN - Schema for the user's complete financial life
// =================================================================

export enum AccountType {
  CHECKING = 'checking',
  SAVINGS = 'savings',
  CREDIT_CARD = 'credit_card',
  INVESTMENT = 'investment',
  BROKERAGE = 'brokerage',
  RETIREMENT_401K = '401k',
  RETIREMENT_IRA = 'ira',
  LOAN = 'loan',
  MORTGAGE = 'mortgage',
  STUDENT_LOAN = 'student_loan',
  OTHER = 'other',
}

export enum AssetClass {
  CASH = 'cash',
  EQUITY = 'equity',
  FIXED_INCOME = 'fixed_income',
  REAL_ESTATE = 'real_estate',
  COMMODITY = 'commodity',
  CRYPTOCURRENCY = 'cryptocurrency',
  NFT = 'nft',
  PRIVATE_EQUITY = 'private_equity',
  COLLECTIBLE = 'collectible',
}

export interface BankAccount {
  id: string;
  institution: string;
  accountName: string;
  accountType: AccountType;
  mask: string; // Last 4 digits
  balance: TimeSeriesDataPoint<Money>;
  interestRate?: number;
}

export interface InvestmentHolding {
  ticker: string;
  name: string;
  isin?: string;
  quantity: number;
  assetClass: AssetClass;
  currentValue: Money;
  costBasis: Money;
}

export interface InvestmentAccount extends BankAccount {
  holdings: InvestmentHolding[];
  performance: {
    '1D': number;
    '1W': number;
    '1M': number;
    '1Y': number;
    YTD: number;
  };
}

export interface PhysicalAsset {
  id: string;
  description: string;
  assetClass: AssetClass.REAL_ESTATE | AssetClass.COLLECTIBLE;
  estimatedValue: TimeSeriesDataPoint<Money>;
  location?: GeoLocation;
  purchaseDate?: string;
}

export interface CryptoWallet {
  id: string;
  walletAddress: string;
  blockchain: string; // e.g., 'Ethereum', 'Bitcoin'
  holdings: {
    asset: string; // e.g., 'ETH', 'BTC'
    quantity: number;
    currentValue: Money;
  }[];
}

export interface Loan {
  id: string;
  type: AccountType.LOAN | AccountType.MORTGAGE | AccountType.STUDENT_LOAN;
  lender: string;
  originalPrincipal: Money;
  outstandingBalance: TimeSeriesDataPoint<Money>;
  interestRate: number;
  termMonths: number;
  monthlyPayment: Money;
  maturityDate: string;
}

export interface Transaction {
  id: string;
  accountId: string;
  date: string;
  amount: number; // Negative for debits, positive for credits
  description: string;
  merchant?: string;
  category: string[]; // e.g., ['Food & Drink', 'Restaurants']
  geolocation?: GeoLocation;
  paymentMethod: 'card' | 'transfer' | 'cash' | 'crypto';
  status: 'pending' | 'posted' | 'cleared';
  aiInsights?: {
    isRecurring: boolean;
    isDiscretionary: boolean;
    sentiment?: 'positive' | 'negative' | 'neutral';
    relatedGoalId?: string;
  };
}

export interface IncomeStream {
  id: string;
  source: string; // e.g., 'Employer A', 'Freelance Project X'
  type: 'salary' | 'bonus' | 'freelance' | 'investment' | 'rental' | 'other';
  amount: Money;
  frequency: 'weekly' | 'bi-weekly' | 'monthly' | 'quarterly' | 'annually' | 'one-time';
  nextPayDate?: string;
}

export interface FinancialGoal {
  id:string;
  name: string;
  targetAmount: Money;
  currentAmount: Money;
  targetDate: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  type: 'retirement' | 'house_down_payment' | 'education' | 'travel' | 'emergency_fund' | 'other';
  linkedAccountIds?: string[];
  aiProjection: {
    isOnTrack: boolean;
    projectedCompletionDate: string;
    suggestedContribution: Money;
  };
}

export interface CreditReport {
    bureau: 'Equifax' | 'Experian' | 'TransUnion';
    score: TimeSeriesDataPoint<number>;
    factors: {
        paymentHistory: 'excellent' | 'good' | 'fair' | 'poor';
        creditUtilization: 'excellent' | 'good' | 'fair' | 'poor';
        lengthOfCreditHistory: 'excellent' | 'good' | 'fair' | 'poor';
        newCredit: 'excellent' | 'good' | 'fair' | 'poor';
        creditMix: 'excellent' | 'good' | 'fair' | 'poor';
    };
    inquiries: number;
    publicRecords: number;
}


export interface FinancialProfile {
  netWorth: TimeSeriesDataPoint<Money>;
  assets: {
    bankAccounts: BankAccount[];
    investmentAccounts: InvestmentAccount[];
    cryptoWallets: CryptoWallet[];
    physicalAssets: PhysicalAsset[];
  };
  liabilities: {
    creditCards: BankAccount[]; // Using BankAccount for credit cards
    loans: Loan[];
  };
  income: {
    streams: IncomeStream[];
    totalAnnualIncome: Money;
  };
  expenses: {
    // AI-derived spending categories and averages
    monthlyByCategory: Record<string, TimeSeriesDataPoint<Money>>;
    fixedVsVariableRatio: TimeSeriesDataPoint<number>; // e.g., 0.6 means 60% fixed
  };
  transactions: Transaction[];
  goals: FinancialGoal[];
  credit: {
      reports: CreditReport[];
      averageScore: TimeSeriesDataPoint<number>;
  };
  insurancePolicies: any[]; // To be defined
  taxInformation: any; // To be defined
  aiFinancialAnalysis: {
    riskTolerance: TimeSeriesDataPoint<'conservative' | 'moderate' | 'aggressive'>;
    financialHealthScore: TimeSeriesDataPoint<number>; // 0-100
    savingsRate: TimeSeriesDataPoint<number>;
    emergencyFundStatus: {
        isSufficient: boolean;
        monthsCovered: number;
        targetMonths: number;
    };
    debtToIncomeRatio: TimeSeriesDataPoint<number>;
    subscriptionAnalysis: {
        totalMonthlyCost: Money;
        subscriptions: { name: string; cost: Money; lastUsed?: string }[];
    }
  };
}

// =================================================================
// HEALTH & WELLNESS TWIN - Schema for physical and mental health
// =================================================================

export enum ExerciseIntensity {
    LIGHT = 'light',
    MODERATE = 'moderate',
    VIGOROUS = 'vigorous',
}

export interface ActivityLog {
    id: string;
    type: string; // e.g., 'Running', 'Weightlifting', 'Yoga'
    startTime: string;
    endTime: string;
    durationMinutes: number;
    intensity?: ExerciseIntensity;
    caloriesBurned?: number;
    distanceKm?: number;
    reps?: number;
    sets?: number;
    weightKg?: number;
}

export interface SleepSession {
    startTime: string;
    endTime: string;
    durationMinutes: number;
    stages: {
        awakeMinutes: number;
        remMinutes: number;
        lightMinutes: number;
        deepMinutes: number;
    };
    qualityScore: TimeSeriesDataPoint<number>; // 0-100
}

export interface NutritionLog {
    id: string;
    timestamp: string;
    mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
    foodItems: {
        name: string;
        calories: number;
        macronutrients: {
            proteinGrams: number;
            carbohydratesGrams: number;
            fatGrams: number;
        };
        micronutrients?: Record<string, { amount: number; unit: string }>; // e.g., Vitamin C, Iron
    }[];
}

export interface HealthProfile {
    vitals: {
        heartRateBpm: TimeSeriesDataPoint<number>[];
        restingHeartRateBpm: TimeSeriesDataPoint<number>[];
        heartRateVariabilityMs: TimeSeriesDataPoint<number>[];
        bloodPressure: TimeSeriesDataPoint<{ systolic: number; diastolic: number }>[];
        bodyTemperatureCelsius: TimeSeriesDataPoint<number>[];
        respiratoryRateBpm: TimeSeriesDataPoint<number>[];
        oxygenSaturationPercent: TimeSeriesDataPoint<number>[];
    };
    biometrics: {
        heightCm: TimeSeriesDataPoint<number>;
        weightKg: TimeSeriesDataPoint<number>[];
        bodyMassIndex: TimeSeriesDataPoint<number>[];
        bodyFatPercentage: TimeSeriesDataPoint<number>[];
        waistCircumferenceCm: TimeSeriesDataPoint<number>[];
    };
    activity: {
        dailySteps: TimeSeriesDataPoint<number>[];
        dailyDistanceKm: TimeSeriesDataPoint<number>[];
        dailyCaloriesBurned: TimeSeriesDataPoint<number>[];
        dailyActiveMinutes: TimeSeriesDataPoint<number>[];
        vo2Max: TimeSeriesDataPoint<number>[];
        exerciseLogs: ActivityLog[];
    };
    sleep: {
        sessions: SleepSession[];
        averageSleepDurationMinutes: TimeSeriesDataPoint<number>;
        sleepConsistencyScore: TimeSeriesDataPoint<number>; // 0-100
    };
    nutrition: {
        logs: NutritionLog[];
        dailyCaloricIntake: TimeSeriesDataPoint<number>[];
        dailyMacronutrientRatio: TimeSeriesDataPoint<{ protein: number; carbs: number; fat: number }>[];
        hydrationMl: TimeSeriesDataPoint<number>[];
    };
    mentalWellness: {
        stressLevel: TimeSeriesDataPoint<number>[]; // 0-10 scale
        moodLog: TimeSeriesDataPoint<'happy' | 'sad' | 'anxious' | 'calm' | 'energetic' | 'tired'>[];
        mindfulnessMinutes: TimeSeriesDataPoint<number>[];
    };
    medicalHistory: {
        conditions: { name: string; diagnosisDate: string }[];
        allergies: { substance: string; reaction: string }[];
        medications: { name: string; dosage: string; frequency: string }[];
        vaccinations: { name: string; date: string }[];
    };
    healthGoals: {
        id: string;
        description: string;
        target: { metric: string; value: number };
        deadline: string;
    }[];
    aiHealthAnalysis: {
        overallHealthScore: TimeSeriesDataPoint<number>; // 0-100
        riskFactors: { condition: string; riskLevel: 'low' | 'medium' | 'high'; evidence: string[] }[];
        readinessScore: TimeSeriesDataPoint<number>; // Physical and mental readiness for the day
    };
}


// =================================================================
// PRODUCTIVITY & PERSONAL TWIN - Schema for work, learning, and life
// =================================================================

export interface Task {
    id: string;
    projectId?: string;
    title: string;
    status: 'todo' | 'in_progress' | 'done' | 'blocked';
    priority: 'low' | 'medium' | 'high';
    creationDate: string;
    dueDate?: string;
    completionDate?: string;
    timeSpentMinutes?: number;
}

export interface KnowledgeGraphNode {
    id: string;
    skill: string;
    proficiency: TimeSeriesDataPoint<'novice' | 'advanced_beginner' | 'competent' | 'proficient' | 'expert'>;
    lastUsed: string;
    relatedSkills: string[]; // IDs of other nodes
}

export interface ProductivityProfile {
    workPatterns: {
        activeHours: TimeSeriesDataPoint<{ start: string; end: string }>[];
        focusTimeMinutes: TimeSeriesDataPoint<number>[];
        meetingTimeMinutes: TimeSeriesDataPoint<number>[];
        contextSwitches: TimeSeriesDataPoint<number>[];
    };
    taskManagement: {
        tasks: Task[];
        completionRate: TimeSeriesDataPoint<number>; // Percentage
        timeToCompletionHours: TimeSeriesDataPoint<number>; // Average
        procrastinationIndex: TimeSeriesDataPoint<number>; // AI-derived metric
    };
    cognitivePerformance: {
        attentionSpanMinutes: TimeSeriesDataPoint<number>[];
        flowStateProbability: TimeSeriesDataPoint<number>[]; // 0-1
        cognitiveLoadIndex: TimeSeriesDataPoint<number>[]; // 0-100
    };
    learningAndDevelopment: {
        knowledgeGraph: KnowledgeGraphNode[];
        courses: { name: string; status: 'in_progress' | 'completed'; completionDate?: string }[];
        learningGoals: { skill: string; targetProficiency: string }[];
    };
    communication: {
        emailsSent: TimeSeriesDataPoint<number>[];
        emailsReceived: TimeSeriesDataPoint<number>[];
        chatMessagesSent: TimeSeriesDataPoint<number>[];
        averageResponseTimeMinutes: TimeSeriesDataPoint<number>;
    };
    toolsUsage: {
        appUsage: TimeSeriesDataPoint<Record<string, number>>[]; // { appName: minutes }
    };
    aiProductivityAnalysis: {
        peakProductivityTimes: string[]; // e.g., '9-11 AM'
        burnoutRisk: TimeSeriesDataPoint<'low' | 'medium' | 'high'>;
        recommendedActions: { action: string; rationale: string }[];
    };
}

export interface PersonalProfile {
    demographics: {
        birthDate: string;
        gender?: string;
        location: GeoLocation;
        occupation?: string;
    };
    interestsAndHobbies: string[];
    personalityTraits: {
        // Based on the Big Five model
        openness: TimeSeriesDataPoint<number>; // 0-1
        conscientiousness: TimeSeriesDataPoint<number>;
        extraversion: TimeSeriesDataPoint<number>;
        agreeableness: TimeSeriesDataPoint<number>;
        neuroticism: TimeSeriesDataPoint<number>;
    };
    lifeEvents: {
        title: string;
        date: string;
        type: 'education' | 'career' | 'relationship' | 'personal';
        impact: 'positive' | 'negative' | 'neutral';
    }[];
}


// =================================================================
// MASTER DIGITAL TWIN MODEL
// =================================================================

export interface TwinMetadata {
    twinId: string;
    userId: string;
    version: number;
    createdAt: string;
    lastUpdatedAt: string;
    dataSources: { sourceName: string; lastSync: string; permissions: string[] }[];
    consentManagement: {
        [domain in 'financial' | 'health' | 'productivity' | 'personal']: {
            dataSharing: boolean;
            aiAnalysis: boolean;
        }
    };
}

/**
 * The root interface for a user's Personal Digital Twin.
 * This aggregates all aspects of the user's digital footprint into a single,
 * coherent, and analyzable model.
 */
export interface PersonalDigitalTwin {
    metadata: TwinMetadata;
    financials: FinancialProfile;
    health: HealthProfile;
    productivity: ProductivityProfile;
    personal: PersonalProfile;
    simulations: {
        id: string;
        name: string;
        baseScenario: 'current_state';
        modifications: any[];
        results: any;
    }[];
    // A log of significant AI-driven insights and actions taken on behalf of the user.
    oracleLog: {
        timestamp: string;
        type: 'insight' | 'alert' | 'recommendation' | 'action';
        summary: string;
        details: any;
        feedback?: 'accepted' | 'rejected';
    }[];
}

// Example of a function to initialize a new Digital Twin
export function createNewDigitalTwin(userId: string): PersonalDigitalTwin {
    const now = new Date().toISOString();
    return {
        metadata: {
            twinId: `twin_${crypto.randomUUID()}`,
            userId: userId,
            version: 1,
            createdAt: now,
            lastUpdatedAt: now,
            dataSources: [],
            consentManagement: {
                financial: { dataSharing: false, aiAnalysis: false },
                health: { dataSharing: false, aiAnalysis: false },
                productivity: { dataSharing: false, aiAnalysis: false },
                personal: { dataSharing: false, aiAnalysis: false },
            },
        },
        financials: {
            netWorth: { value: { amount: 0, currency: 'USD' }, timestamp: now, source: 'initialization' },
            assets: { bankAccounts: [], investmentAccounts: [], cryptoWallets: [], physicalAssets: [] },
            liabilities: { creditCards: [], loans: [] },
            income: { streams: [], totalAnnualIncome: { amount: 0, currency: 'USD' } },
            expenses: { monthlyByCategory: {}, fixedVsVariableRatio: { value: 0, timestamp: now, source: 'initialization' } },
            transactions: [],
            goals: [],
            credit: { reports: [], averageScore: { value: 0, timestamp: now, source: 'initialization' } },
            insurancePolicies: [],
            taxInformation: {},
            aiFinancialAnalysis: {
                riskTolerance: { value: 'moderate', timestamp: now, source: 'initial_assessment' },
                financialHealthScore: { value: 0, timestamp: now, source: 'initialization' },
                savingsRate: { value: 0, timestamp: now, source: 'initialization' },
                emergencyFundStatus: { isSufficient: false, monthsCovered: 0, targetMonths: 3 },
                debtToIncomeRatio: { value: 0, timestamp: now, source: 'initialization' },
                subscriptionAnalysis: { totalMonthlyCost: { amount: 0, currency: 'USD'}, subscriptions: [] }
            }
        },
        health: {
            vitals: { heartRateBpm: [], restingHeartRateBpm: [], heartRateVariabilityMs: [], bloodPressure: [], bodyTemperatureCelsius: [], respiratoryRateBpm: [], oxygenSaturationPercent: [] },
            biometrics: { heightCm: { value: 0, timestamp: now, source: 'manual_entry' }, weightKg: [], bodyMassIndex: [], bodyFatPercentage: [], waistCircumferenceCm: [] },
            activity: { dailySteps: [], dailyDistanceKm: [], dailyCaloriesBurned: [], dailyActiveMinutes: [], vo2Max: [], exerciseLogs: [] },
            sleep: { sessions: [], averageSleepDurationMinutes: { value: 0, timestamp: now, source: 'initialization'}, sleepConsistencyScore: { value: 0, timestamp: now, source: 'initialization'}},
            nutrition: { logs: [], dailyCaloricIntake: [], dailyMacronutrientRatio: [], hydrationMl: [] },
            mentalWellness: { stressLevel: [], moodLog: [], mindfulnessMinutes: [] },
            medicalHistory: { conditions: [], allergies: [], medications: [], vaccinations: [] },
            healthGoals: [],
            aiHealthAnalysis: {
                overallHealthScore: { value: 0, timestamp: now, source: 'initialization' },
                riskFactors: [],
                readinessScore: { value: 50, timestamp: now, source: 'initialization' },
            }
        },
        productivity: {
            workPatterns: { activeHours: [], focusTimeMinutes: [], meetingTimeMinutes: [], contextSwitches: [] },
            taskManagement: { tasks: [], completionRate: { value: 0, timestamp: now, source: 'initialization' }, timeToCompletionHours: { value: 0, timestamp: now, source: 'initialization' }, procrastinationIndex: { value: 0, timestamp: now, source: 'initialization' } },
            cognitivePerformance: { attentionSpanMinutes: [], flowStateProbability: [], cognitiveLoadIndex: [] },
            learningAndDevelopment: { knowledgeGraph: [], courses: [], learningGoals: [] },
            communication: { emailsSent: [], emailsReceived: [], chatMessagesSent: [], averageResponseTimeMinutes: [] },
            toolsUsage: { appUsage: [] },
            aiProductivityAnalysis: { peakProductivityTimes: [], burnoutRisk: { value: 'low', timestamp: now, source: 'initialization' }, recommendedActions: [] }
        },
        personal: {
            demographics: { birthDate: '', location: { latitude: 0, longitude: 0 } },
            interestsAndHobbies: [],
            personalityTraits: {
                openness: { value: 0.5, timestamp: now, source: 'initial_assessment' },
                conscientiousness: { value: 0.5, timestamp: now, source: 'initial_assessment' },
                extraversion: { value: 0.5, timestamp: now, source: 'initial_assessment' },
                agreeableness: { value: 0.5, timestamp: now, source: 'initial_assessment' },
                neuroticism: { value: 0.5, timestamp: now, source: 'initial_assessment' },
            },
            lifeEvents: []
        },
        simulations: [],
        oracleLog: [{
            timestamp: now,
            type: 'insight',
            summary: 'Digital Twin Initialized',
            details: { message: `Digital Twin for user ${userId} was created successfully.` }
        }]
    };
}