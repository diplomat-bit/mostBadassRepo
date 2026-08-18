// REPOSITORY SOURCE: diplomat-bit/Citibank_Demo_Business_Inc_Demonstration- | PATH: diplomat-bit-Citibank_Demo_Business_Inc_Demonstration--ab2501d/content/FinancialGoalsView.tsx.md
================================================================================

---
# The Declared Objectives

These are the stars by which you navigate. A goal is not a destination to be reached, but a point of light that gives absolute direction to the journey. It is the "why" that fuels the "how." To set a goal is to declare your North Star, to give your will a celestial anchor, ensuring that every action taken is in service of a greater, declared campaign.

---

### A Fable for the Builder: The Grand Campaign

(There are goals, and then there are Goals. There is saving for a new gadget, and then there is saving for a new life. A 'Down Payment for a Condo.' A 'Trip to Neo-Tokyo.' These are not items on a to-do list. They are grand campaigns, epic journeys that require not just discipline, but strategy. This file is the campaign map.)

(When a goal of this magnitude is declared, the AI's role shifts. It is no longer just an advisor. It becomes a general, a master strategist, your partner in planning the campaign. Its primary logic is 'Critical Path Analysis.' It looks at the objective (`targetAmount`), the timeline (`targetDate`), and the available resources (your financial data), and it plots a course.)

(The `AIGoalPlan` is the strategic brief for the campaign. It is a masterpiece of multi-domain thinking. "Automate Savings"... that is logistics, ensuring the supply lines are strong and reliable. "Review Subscriptions"... that is reconnaissance, identifying and eliminating waste in your own ranks. "Explore Travel ETFs"... that is diplomacy and trade, seeking alliances with external forces (the market) that can accelerate your progress. Each step is a piece of sound, personalized, navigational advice.)

(Notice that one goal has a `plan: null`. This is deliberate. This is the AI waiting for your command. It is the general standing before the map table, ready to plan the campaign with you. When you ask it to generate a plan, you are not asking a machine for a calculation. You are entering into a strategic partnership. You provide the vision, the 'what' and 'why.' The AI provides the tactical genius, the 'how.')

(This is the pinnacle of the human-machine collaboration we envisioned. Not a machine that tells you what to do, but a machine that helps you figure out how to do the great things you have already decided to do. It is the ultimate force multiplier for your own will, the perfect partner for the grand campaigns of your life.)

---
import React, {
    useState,
    useEffect,
    useCallback,
    useMemo,
    createContext,
    useContext,
    useReducer,
    ReactNode,
    Component,
    useRef
} from 'react';

//================================================================================
// SECTION 1: CORE TYPES & INTERFACE DEFINITIONS
// Description: Defines the fundamental data structures for the financial goals feature.
// These types ensure data consistency and provide strong typing across the application.
//================================================================================

/**
 * @export
 * @enum {string}
 * @description Represents the possible statuses of a financial goal.
 */
export enum GoalStatus {
    ACTIVE = 'Active',
    COMPLETED = 'Completed',
    ARCHIVED = 'Archived',
    ON_HOLD = 'On Hold',
    AT_RISK = 'At Risk',
}

/**
 * @export
 * @enum {string}
 * @description Categories for financial goals to help with organization and reporting.
 */
export enum GoalCategory {
    HOUSING = 'Housing',
    TRAVEL = 'Travel',
    EDUCATION = 'Education',
    RETIREMENT = 'Retirement',
    INVESTMENT = 'Investment',
    MAJOR_PURCHASE = 'Major Purchase',
    EMERGENCY_FUND = 'Emergency Fund',
    DEBT_REPAYMENT = 'Debt Repayment',
    BUSINESS = 'Business Venture',
    CHARITY = 'Charitable Giving',
    CUSTOM = 'Custom',
}

/**
 * @export
 * @enum {string}
 * @description Defines the frequency of recurring contributions.
 */
export enum ContributionFrequency {
    ONCE = 'Once',
    DAILY = 'Daily',
    WEEKLY = 'Weekly',
    BI_WEEKLY = 'Bi-Weekly',
    MONTHLY = 'Monthly',
    QUARTERLY = 'Quarterly',
    ANNUALLY = 'Annually',
}

/**
 * @export
 * @enum {string}
 * @description Represents the user's tolerance for investment risk.
 */
export enum RiskProfile {
    CONSERVATIVE = 'Conservative',
    MODERATE = 'Moderate',
    AGGRESSIVE = 'Aggressive',
}

/**
 * @export
 * @interface AIGoalPlanStep
 * @description Represents a single actionable step within an AI-generated plan.
 */
export interface AIGoalPlanStep {
    id: string;
    title: string;
    description: string;
    category: 'Savings' | 'Investment' | 'Budgeting' | 'Income' | 'Debt' | 'Learning';
    difficulty: 'Easy' | 'Medium' | 'Hard';
    isCompleted: boolean;
    estimatedImpact: {
        amount: number;
        currency: string;
        timeframe: 'monthly' | 'annually' | 'one-time';
    };
    actionLink?: {
        text: string;
        url: string; // Internal app link
        external?: boolean;
    };
    dependencies?: string[]; // IDs of other steps that must be completed first
}

/**
 * @export
 * @interface AIGoalPlan
 * @description The strategic brief generated by the AI for a specific goal.
 */
export interface AIGoalPlan {
    id: string;
    goalId: string;
    generatedAt: string; // ISO 8601 date string
    summary: string;
    steps: AIGoalPlanStep[];
    confidenceScore: number; // 0 to 1
    projectedCompletionDate: string; // ISO 8601 date string
    warnings: string[];
}

/**
 * @export
 * @interface Contribution
 * @description Represents a single financial contribution towards a goal.
 */
export interface Contribution {
    id: string;
    goalId: string;
    amount: number;
    date: string; // ISO 8601 date string
    source: string; // e.g., 'Manual Transfer', 'Automated Savings', 'Paycheck', 'Investment Gain'
    notes?: string;
}

/**
 * @export
 * @interface Milestone
 * @description A significant checkpoint in the progress of a financial goal.
 */
export interface Milestone {
    id: string;
    goalId: string;
    name: string;
    targetAmount: number;
    achievedDate?: string; // ISO 8601 date string
}

/**
 * @export
 * @interface RecurringContribution
 * @description Defines an automated, recurring contribution schedule.
 */
export interface RecurringContribution {
    id: string;
    goalId: string;
    amount: number;
    frequency: ContributionFrequency;
    startDate: string; // ISO 8601 date string
    endDate?: string; // ISO 8601 date string
    nextContributionDate: string; // ISO 8601 date string
    linkedAccountId: string;
}

/**
 * @export
 * @interface FinancialGoal
 * @description The core data structure for a user's financial goal.
 */
export interface FinancialGoal {
    id: string;
    userId: string;
    name: string;
    description?: string;
    targetAmount: number;
    currentAmount: number;
    targetDate: string; // ISO 8601 date string
    creationDate: string; // ISO 8601 date string
    category: GoalCategory;
    status: GoalStatus;
    priority: number; // 1-5, 1 being highest
    icon: string; // e.g., 'home', 'car', 'plane'
    plan: AIGoalPlan | null;
    contributions: Contribution[];
    milestones: Milestone[];
    recurringContributions: RecurringContribution[];
    riskProfile: RiskProfile;
    linkedAccountIds: string[]; // IDs of bank/investment accounts funding this goal
}

/**
 * @export
 * @interface UserPreferences
 * @description User-specific settings that affect display and calculations.
 */
export interface UserPreferences {
    currency: 'USD' | 'EUR' | 'JPY' | 'GBP';
    language: 'en-US' | 'es-ES' | 'fr-FR' | 'ja-JP';
    theme: 'light' | 'dark' | 'system';
    notifications: {
        milestones: boolean;
        progressUpdates: boolean;
        aiSuggestions: boolean;
    };
}

/**
 * @export
 * @interface AIInsight
 * @description An AI-generated insight or recommendation.
 */
export interface AIInsight {
    id: string;
    type: 'Opportunity' | 'Warning' | 'Observation';
    title: string;
    message: string;
    relatedGoalId?: string;
    actionable: boolean;
    actionText?: string;
    actionLink?: string;
    timestamp: string;
}

//================================================================================
// SECTION 2: MOCK API SERVICE
// Description: A simulated API service to mimic backend interactions. In a real
// application, these methods would make HTTP requests to a server. This allows
// for realistic data fetching, creation, updating, and deletion logic.
//================================================================================

/**
 * @export
 * @class FinancialGoalsAPIService
 * @description Simulates a backend API for managing financial goals.
 */
export class FinancialGoalsAPIService {
    private static goals: FinancialGoal[] = MOCK_FINANCIAL_GOALS;
    private static userPreferences: UserPreferences = {
        currency: 'USD',
        language: 'en-US',
        theme: 'dark',
        notifications: {
            milestones: true,
            progressUpdates: true,
            aiSuggestions: true,
        },
    };
    private static insights: AIInsight[] = MOCK_AI_INSIGHTS;

    private static simulateNetworkDelay(delay: number = 500): Promise < void > {
        return new Promise(resolve => setTimeout(resolve, delay));
    }

    /**
     * @static
     * @memberof FinancialGoalsAPIService
     * @description Fetches all financial goals for the current user.
     * @returns {Promise<FinancialGoal[]>} A promise that resolves to an array of goals.
     */
    static async fetchGoals(): Promise < FinancialGoal[] > {
        await this.simulateNetworkDelay();
        console.log('API: Fetched all goals.');
        return JSON.parse(JSON.stringify(this.goals)); // Deep copy
    }

    /**
     * @static
     * @memberof FinancialGoalsAPIService
     * @description Fetches all AI insights for the user.
     * @returns {Promise<AIInsight[]>}
     */
    static async fetchInsights(): Promise < AIInsight[] > {
        await this.simulateNetworkDelay(700);
        console.log('API: Fetched AI insights.');
        return JSON.parse(JSON.stringify(this.insights));
    }


    /**
     * @static
     * @memberof FinancialGoalsAPIService
     * @description Fetches a single financial goal by its ID.
     * @param {string} goalId The ID of the goal to fetch.
     * @returns {Promise<FinancialGoal | null>} A promise that resolves to the goal or null if not found.
     */
    static async fetchGoalById(goalId: string): Promise < FinancialGoal | null > {
        await this.simulateNetworkDelay(300);
        const goal = this.goals.find(g => g.id === goalId);
        if (goal) {
            console.log(`API: Fetched goal ${goalId}.`);
            return JSON.parse(JSON.stringify(goal));
        }
        console.error(`API: Goal with id ${goalId} not found.`);
        return null;
    }

    /**
     * @static
     * @memberof FinancialGoalsAPIService
     * @description Creates a new financial goal.
     * @param {Omit<FinancialGoal, 'id' | 'creationDate' | 'currentAmount' | 'contributions' | 'milestones' | 'recurringContributions' | 'plan'>} goalData Data for the new goal.
     * @returns {Promise<FinancialGoal>} A promise that resolves to the newly created goal.
     */
    static async createGoal(goalData: Omit < FinancialGoal, 'id' | 'creationDate' | 'currentAmount' | 'contributions' | 'milestones' | 'recurringContributions' | 'plan' > ): Promise < FinancialGoal > {
        await this.simulateNetworkDelay(800);
        const newGoal: FinancialGoal = {
            ...goalData,
            id: `goal-${Date.now()}`,
            creationDate: new Date().toISOString(),
            currentAmount: 0,
            contributions: [],
            milestones: this.generateDefaultMilestones(goalData.targetAmount),
            recurringContributions: [],
            plan: null,
            status: GoalStatus.ACTIVE,
        };
        this.goals.push(newGoal);
        console.log(`API: Created new goal with id ${newGoal.id}.`);
        return JSON.parse(JSON.stringify(newGoal));
    }


    /**
     * @static
     * @memberof FinancialGoalsAPIService
     * @description Updates an existing financial goal.
     * @param {string} goalId The ID of the goal to update.
     * @param {Partial<FinancialGoal>} updates The fields to update.
     * @returns {Promise<FinancialGoal>} A promise that resolves to the updated goal.
     */
    static async updateGoal(goalId: string, updates: Partial < FinancialGoal > ): Promise < FinancialGoal > {
        await this.simulateNetworkDelay();
        const goalIndex = this.goals.findIndex(g => g.id === goalId);
        if (goalIndex === -1) {
            throw new Error(`Goal with id ${goalId} not found.`);
        }
        this.goals[goalIndex] = { ...this.goals[goalIndex],
            ...updates
        };
        console.log(`API: Updated goal ${goalId}.`);
        return JSON.parse(JSON.stringify(this.goals[goalIndex]));
    }

    /**
     * @static
     * @memberof FinancialGoalsAPIService
     * @description Deletes a financial goal.
     * @param {string} goalId The ID of the goal to delete.
     * @returns {Promise<void>}
     */
    static async deleteGoal(goalId: string): Promise < void > {
        await this.simulateNetworkDelay(1000);
        const initialLength = this.goals.length;
        this.goals = this.goals.filter(g => g.id !== goalId);
        if (this.goals.length === initialLength) {
            throw new Error(`Goal with id ${goalId} not found for deletion.`);
        }
        console.log(`API: Deleted goal ${goalId}.`);
    }

    /**
     * @static
     * @memberof FinancialGoalsAPIService
     * @description Adds a contribution to a specific goal.
     * @param {string} goalId The goal to contribute to.
     * @param {Omit<Contribution, 'id' | 'goalId'>} contributionData The contribution details.
     * @returns {Promise<FinancialGoal>} The updated goal object.
     */
    static async addContribution(goalId: string, contributionData: Omit < Contribution, 'id' | 'goalId' > ): Promise < FinancialGoal > {
        await this.simulateNetworkDelay(400);
        const goalIndex = this.goals.findIndex(g => g.id === goalId);
        if (goalIndex === -1) {
            throw new Error(`Goal with id ${goalId} not found.`);
        }

        const newContribution: Contribution = {
            ...contributionData,
            id: `contrib-${Date.now()}`,
            goalId,
        };

        const goal = this.goals[goalIndex];
        goal.contributions.push(newContribution);
        goal.currentAmount += newContribution.amount;
        goal.milestones.forEach(milestone => {
            if (!milestone.achievedDate && goal.currentAmount >= milestone.targetAmount) {
                milestone.achievedDate = new Date().toISOString();
            }
        });

        if (goal.currentAmount >= goal.targetAmount) {
            goal.status = GoalStatus.COMPLETED;
        }

        this.goals[goalIndex] = goal;
        console.log(`API: Added contribution to goal ${goalId}.`);
        return JSON.parse(JSON.stringify(goal));
    }


    /**
     * @static
     * @memberof FinancialGoalsAPIService
     * @description Generates a new AI plan for a goal. This is a complex simulation of an AI call.
     * @param {string} goalId The ID of the goal.
     * @returns {Promise<AIGoalPlan>} A promise resolving to the new AI plan.
     */
    static async generateAIPlan(goalId: string): Promise < AIGoalPlan > {
        await this.simulateNetworkDelay(2500); // AI generation takes longer
        const goal = this.goals.find(g => g.id === goalId);
        if (!goal) {
            throw new Error(`Goal with id ${goalId} not found.`);
        }

        const warnings: string[] = [];
        const {
            totalDays
        } = timeUntil(goal.targetDate);
        const requiredMonthly = calculateMonthlyContribution(goal);

        if (requiredMonthly > 5000) { // Arbitrary high number for a warning
            warnings.push("The required monthly contribution is very high. Achieving this goal may require significant changes to your budget or income.");
        }
        if (totalDays < 365 && goal.riskProfile === RiskProfile.AGGRESSIVE) {
            warnings.push("Your timeline is short for an aggressive investment strategy. Consider a more conservative approach to reduce short-term market risk.");
        }

        // Dynamically generate steps based on goal properties
        const steps: AIGoalPlanStep[] = [];
        steps.push({
            id: `step-${Date.now()}-1`,
            title: `Automate a recurring transfer of ${formatCurrency(requiredMonthly, 'USD')}.`,
            description: 'Set up a recurring monthly transfer from your primary account to a dedicated savings or investment account for this goal. Consistency is key to success.',
            category: 'Savings',
            difficulty: 'Easy',
            isCompleted: false,
            estimatedImpact: {
                amount: requiredMonthly,
                currency: 'USD',
                timeframe: 'monthly'
            },
            actionLink: {
                text: 'Set up transfer',
                url: '/transfers/setup'
            }
        });

        steps.push({
            id: `step-${Date.now()}-2`,
            title: 'Review and optimize spending categories.',
            description: 'Analyze your monthly budget for non-essential spending. Categories like "Dining Out" or "Subscriptions" are often areas where you can find extra savings to accelerate your progress.',
            category: 'Budgeting',
            difficulty: 'Easy',
            isCompleted: false,
            estimatedImpact: {
                amount: Math.round(Math.random() * 200 + 50),
                currency: 'USD',
                timeframe: 'monthly'
            },
            actionLink: {
                text: 'Analyze subscriptions',
                url: '/insights/subscriptions'
            }
        });

        if (goal.riskProfile !== RiskProfile.CONSERVATIVE && totalDays > 365) {
            steps.push({
                id: `step-${Date.now()}-3`,
                title: `Explore ${goal.category}-related ETFs.`,
                description: `For a long-term goal like '${goal.name}', consider investing a portion of your savings into a low-cost Exchange-Traded Fund (ETF) related to your goal's category for potential growth.`,
                category: 'Investment',
                difficulty: 'Medium',
                isCompleted: false,
                estimatedImpact: {
                    amount: Math.round(goal.targetAmount * 0.05),
                    currency: 'USD',
                    timeframe: 'annually'
                },
                actionLink: {
                    text: 'Explore ETFs',
                    url: '/invest/explore'
                }
            });
        }

        if (goal.category === GoalCategory.HOUSING) {
            steps.push({
                id: `step-${Date.now()}-4`,
                title: 'Research First-Time Home Buyer Programs',
                description: 'Investigate local and national programs that offer assistance with down payments or closing costs. This could significantly reduce your target amount.',
                category: 'Learning',
                difficulty: 'Medium',
                isCompleted: false,
                estimatedImpact: {
                    amount: 5000,
                    currency: 'USD',
                    timeframe: 'one-time'
                },
                actionLink: {
                    text: 'Learn more at HUD.gov',
                    url: 'https://www.hud.gov/',
                    external: true
                }
            });
        }


        const newPlan: AIGoalPlan = {
            id: `plan-${Date.now()}`,
            goalId,
            generatedAt: new Date().toISOString(),
            summary: `A strategic plan tailored for your '${goal.name}' goal, factoring in your timeline and risk profile.`,
            confidenceScore: Math.random() * 0.3 + 0.65, // 0.65 - 0.95
            projectedCompletionDate: new Date(new Date(goal.targetDate).getTime() - (Math.random() * 30 * 24 * 60 * 60 * 1000)).toISOString(),
            steps,
            warnings
        };

        const goalIndex = this.goals.findIndex(g => g.id === goalId);
        this.goals[goalIndex].plan = newPlan;
        console.log(`API: Generated AI plan for goal ${goalId}.`);

        return JSON.parse(JSON.stringify(newPlan));
    }


    /**
     * @static
     * @memberof FinancialGoalsAPIService
     * @description Fetches the user's preferences.
     * @returns {Promise<UserPreferences>}
     */
    static async fetchUserPreferences(): Promise < UserPreferences > {
        await this.simulateNetworkDelay(100);
        return JSON.parse(JSON.stringify(this.userPreferences));
    }

    /**
     * @static
     * @memberof FinancialGoalsAPIService
     * @description Helper to generate default milestones for a new goal.
     * @param {number} targetAmount The target amount of the goal.
     * @returns {Milestone[]} An array of milestones.
     */
    private static generateDefaultMilestones(targetAmount: number): Milestone[] {
        const milestonePercentages = [0.1, 0.25, 0.5, 0.75, 1.0];
        const milestoneNames = ['First Step!', 'Quarter Mark!', 'Halfway There!', 'Almost There!', 'Goal Achieved!'];
        return milestonePercentages.map((p, index) => ({
            id: `milestone-${Date.now()}-${index}`,
            goalId: '', // Will be filled in when goal is created
            name: milestoneNames[index],
            targetAmount: Math.round(targetAmount * p),
        }));
    }
}

//================================================================================
// SECTION 3: UTILITY & HELPER FUNCTIONS
// Description: A collection of pure functions for formatting, calculations, and
// data manipulation. These are used throughout the components to keep them lean.
//================================================================================

/**
 * @export
 * @function formatCurrency
 * @description Formats a number into a currency string based on user preferences.
 * @param {number} amount The number to format.
 * @param {string} currency The currency code (e.g., 'USD').
 * @param {string} [locale='en-US'] The locale for formatting.
 * @returns {string} The formatted currency string.
 */
export function formatCurrency(amount: number, currency: string, locale: string = 'en-US'): string {
    return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(amount);
}

/**
 * @export
 * @function formatDate
 * @description Formats an ISO date string into a more readable format.
 * @param {string} dateString The ISO 8601 date string.
 * @param {Intl.DateTimeFormatOptions} [options] Formatting options.
 * @returns {string} The formatted date string.
 */
export function formatDate(dateString: string, options ? : Intl.DateTimeFormatOptions): string {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    const defaultOptions: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    };
    return date.toLocaleDateString(undefined, options || defaultOptions);
}

/**
 * @export
 * @function timeUntil
 * @description Calculates the time remaining until a target date.
 * @param {string} targetDateString The ISO 8601 target date string.
 * @returns {{years: number, months: number, days: number, totalDays: number}}
 */
export function timeUntil(targetDateString: string): {
    years: number,
    months: number,
    days: number,
    totalDays: number
} {
    const now = new Date();
    const target = new Date(targetDateString);
    if (target <= now) return {
        years: 0,
        months: 0,
        days: 0,
        totalDays: 0
    };

    const totalDays = Math.ceil((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    let years = target.getFullYear() - now.getFullYear();
    let months = target.getMonth() - now.getMonth();
    let days = target.getDate() - now.getDate();

    if (days < 0) {
        months--;
        const prevMonth = new Date(target.getFullYear(), target.getMonth(), 0);
        days += prevMonth.getDate();
    }
    if (months < 0) {
        years--;
        months += 12;
    }

    return {
        years,
        months,
        days,
        totalDays
    };
}


/**
 * @export
 * @function calculateProgress
 * @description Calculates the completion percentage of a goal.
 * @param {number} currentAmount The current amount saved.
 * @param {number} targetAmount The target amount of the goal.
 * @returns {number} The progress as a percentage (0-100).
 */
export function calculateProgress(currentAmount: number, targetAmount: number): number {
    if (targetAmount <= 0) return 100;
    const progress = (currentAmount / targetAmount) * 100;
    return Math.min(Math.max(progress, 0), 100);
}

/**
 * @export
 * @function calculateMonthlyContribution
 * @description Calculates the required monthly contribution to reach a goal.
 * @param {FinancialGoal} goal The financial goal.
 * @returns {number} The required monthly contribution amount.
 */
export function calculateMonthlyContribution(goal: Pick < FinancialGoal, 'targetAmount' | 'currentAmount' | 'targetDate' > ): number {
    const remainingAmount = goal.targetAmount - goal.currentAmount;
    if (remainingAmount <= 0) return 0;

    const {
        totalDays
    } = timeUntil(goal.targetDate);
    const monthsRemaining = totalDays / 30.44; // Average days in a month

    if (monthsRemaining <= 0) return remainingAmount;

    return remainingAmount / monthsRemaining;
}


/**
 * @export
 * @function getGoalStatusColor
 * @description Returns a color code based on the goal's status or progress.
 * @param {FinancialGoal} goal The financial goal.
 * @returns {string} A Tailwind CSS color class name.
 */
export function getGoalStatusColor(goal: FinancialGoal): string {
    if (goal.status === GoalStatus.COMPLETED) {
        return 'text-green-400';
    }
    if (goal.status === GoalStatus.ARCHIVED || goal.status === GoalStatus.ON_HOLD) {
        return 'text-gray-500';
    }
    if (goal.status === GoalStatus.AT_RISK) {
        return 'text-red-400';
    }


    const requiredMonthly = calculateMonthlyContribution(goal);
    // Assume we can get actual recent monthly contribution
    const actualMonthly = goal.recurringContributions.reduce((sum, rc) => {
        if (rc.frequency === ContributionFrequency.MONTHLY) return sum + rc.amount;
        if (rc.frequency === ContributionFrequency.WEEKLY) return sum + rc.amount * 4.33;
        // Add other frequencies
        return sum;
    }, 0) || (requiredMonthly * (0.5 + Math.random() * 0.6)); // Mock actual contribution

    if (actualMonthly >= requiredMonthly * 0.9) {
        return 'text-blue-400'; // On track
    } else if (actualMonthly >= requiredMonthly * 0.5) {
        return 'text-yellow-400'; // Needs attention
    } else {
        return 'text-red-400'; // At risk
    }
}

/**
 * @export
 * @function getCategoryIcon
 * @description Returns an SVG icon component for a given goal category.
 * @param {GoalCategory} category
 * @returns {JSX.Element}
 */
export function getCategoryIcon(category: GoalCategory): JSX.Element {
    const iconProps = {
        className: "w-8 h-8"
    };
    switch (category) {
        case GoalCategory.HOUSING:
            return <svg { ...iconProps
            }
            viewBox = "0 0 24 24"
            fill = "currentColor" > < path d = "M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" / > < /svg>;
        case GoalCategory.TRAVEL:
            return <svg { ...iconProps
            }
            viewBox = "0 0 24 24"
            fill = "currentColor" > < path d = "M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" / > < /svg>;
        case GoalCategory.EDUCATION:
            return <svg { ...iconProps
            }
            viewBox = "0 0 24 24"
            fill = "currentColor" > < path d = "M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82zM12 3L1 9l11 6 9-4.91V17h2V9L12 3z" / > < /svg>;
        case GoalCategory.RETIREMENT:
            return <svg { ...iconProps
            }
            viewBox = "0 0 24 24"
            fill = "currentColor" > < path d = "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1.25 14.25L7.5 13l1.41-1.41L10 12.17l4.59-4.59L16 9l-5.25 5.25z" / > < /svg>;
        case GoalCategory.MAJOR_PURCHASE:
            return <svg { ...iconProps
            }
            viewBox = "0 0 24 24"
            fill = "currentColor" > < path d = "M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z" / > < /svg>;
        case GoalCategory.BUSINESS:
            return <svg { ...iconProps
            }
            viewBox = "0 0 24 24"
            fill = "currentColor" > < path d = "M12 7V3H2v18h20V7H12zM6 19H4v-2h2v2zm0-4H4v-2h2v2zm0-4H4V9h2v2zm0-4H4V5h2v2zm4 12H8v-2h2v2zm0-4H8v-2h2v2zm0-4H8V9h2v2zm0-4H8V5h2v2zm10 12h-8v-2h2v-2h-2v-2h2v-2h-2V9h8v10zm-2-8h-2v2h2v-2zm0 4h-2v2h2v-2z" / > < /svg>;
        default:
            return <svg { ...iconProps
            }
            viewBox = "0 0 24 24"
            fill = "currentColor" > < path d = "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" / > < /svg>;
    }
}


//================================================================================
// SECTION 4: STATE MANAGEMENT (CONTEXT & REDUCER)
// Description: Centralized state management for financial goals using React's
// Context API and a useReducer hook. This pattern simplifies state logic and
// avoids prop drilling through the component tree.
//================================================================================

type FinancialGoalsState = {
    goals: FinancialGoal[];
    insights: AIInsight[];
    isLoading: boolean;
    error: Error | null;
    selectedGoalId: string | null;
    userPreferences: UserPreferences | null;
};

type Action = {
    type: 'FETCH_INIT'
} | {
    type: 'FETCH_SUCCESS',
    payload: {
        goals: FinancialGoal[],
        preferences: UserPreferences,
        insights: AIInsight[]
    }
} | {
    type: 'FETCH_FAILURE',
    payload: Error
} | {
    type: 'SELECT_GOAL',
    payload: string | null
} | {
    type: 'ADD_GOAL_SUCCESS',
    payload: FinancialGoal
} | {
    type: 'UPDATE_GOAL_SUCCESS',
    payload: FinancialGoal
} | {
    type: 'DELETE_GOAL_SUCCESS',
    payload: string
} | {
    type: 'UPDATE_PLAN_SUCCESS',
    payload: {
        goalId: string,
        plan: AIGoalPlan
    }
};


const initialState: FinancialGoalsState = {
    goals: [],
    insights: [],
    isLoading: true,
    error: null,
    selectedGoalId: null,
    userPreferences: null,
};

const financialGoalsReducer = (state: FinancialGoalsState, action: Action): FinancialGoalsState => {
    switch (action.type) {
        case 'FETCH_INIT':
            return { ...state,
                isLoading: true,
                error: null
            };
        case 'FETCH_SUCCESS':
            return {
                ...state,
                isLoading: false,
                goals: action.payload.goals,
                userPreferences: action.payload.preferences,
                insights: action.payload.insights,
            };
        case 'FETCH_FAILURE':
            return { ...state,
                isLoading: false,
                error: action.payload
            };
        case 'SELECT_GOAL':
            return { ...state,
                selectedGoalId: action.payload
            };
        case 'ADD_GOAL_SUCCESS':
            return { ...state,
                goals: [...state.goals, action.payload]
            };
        case 'UPDATE_GOAL_SUCCESS':
            return {
                ...state,
                goals: state.goals.map(g => g.id === action.payload.id ? action.payload : g),
            };
        case 'DELETE_GOAL_SUCCESS':
            return {
                ...state,
                goals: state.goals.filter(g => g.id !== action.payload),
                selectedGoalId: state.selectedGoalId === action.payload ? null : state.selectedGoalId,
            };
        case 'UPDATE_PLAN_SUCCESS':
            return {
                ...state,
                goals: state.goals.map(g => g.id === action.payload.goalId ? { ...g,
                    plan: action.payload.plan
                } : g),
            };
        default:
            return state;
    }
};

type FinancialGoalsContextType = {
    state: FinancialGoalsState;
    dispatch: React.Dispatch < Action > ;
    actions: {
        selectGoal: (goalId: string | null) => void;
        createGoal: (goalData: Omit < FinancialGoal, 'id' | 'creationDate' | 'currentAmount' | 'contributions' | 'milestones' | 'recurringContributions' | 'plan' > ) => Promise < void > ;
        updateGoal: (goalId: string, updates: Partial < FinancialGoal > ) => Promise < void > ;
        deleteGoal: (goalId: string) => Promise < void > ;
        addContribution: (goalId: string, contributionData: Omit < Contribution, 'id' | 'goalId' > ) => Promise < void > ;
        generateAIPlan: (goalId: string) => Promise < void > ;
    };
};

const FinancialGoalsContext = createContext < FinancialGoalsContextType | undefined > (undefined);

/**
 * @export
 * @function FinancialGoalsProvider
 * @description Provides the financial goals state and actions to its children.
 * @param {{ children: ReactNode }} { children }
 * @returns {JSX.Element}
 */
export const FinancialGoalsProvider: React.FC < {
    children: ReactNode
} > = ({
    children
}) => {
    const [state, dispatch] = useReducer(financialGoalsReducer, initialState);

    useEffect(() => {
        const loadInitialData = async () => {
            dispatch({
                type: 'FETCH_INIT'
            });
            try {
                const [goals, preferences, insights] = await Promise.all([
                    FinancialGoalsAPIService.fetchGoals(),
                    FinancialGoalsAPIService.fetchUserPreferences(),
                    FinancialGoalsAPIService.fetchInsights(),
                ]);
                dispatch({
                    type: 'FETCH_SUCCESS',
                    payload: {
                        goals,
                        preferences,
                        insights
                    }
                });
            } catch (error) {
                dispatch({
                    type: 'FETCH_FAILURE',
                    payload: error as Error
                });
            }
        };
        loadInitialData();
    }, []);

    const actions = useMemo(() => ({
        selectGoal: (goalId: string | null) => {
            dispatch({
                type: 'SELECT_GOAL',
                payload: goalId
            });
        },
        createGoal: async (goalData: Omit < FinancialGoal, 'id' | 'creationDate' | 'currentAmount' | 'contributions' | 'milestones' | 'recurringContributions' | 'plan' > ) => {
            const newGoal = await FinancialGoalsAPIService.createGoal(goalData);
            dispatch({
                type: 'ADD_GOAL_SUCCESS',
                payload: newGoal
            });
        },
        updateGoal: async (goalId: string, updates: Partial < FinancialGoal > ) => {
            const updatedGoal = await FinancialGoalsAPIService.updateGoal(goalId, updates);
            dispatch({
                type: 'UPDATE_GOAL_SUCCESS',
                payload: updatedGoal
            });
        },
        deleteGoal: async (goalId: string) => {
            await FinancialGoalsAPIService.deleteGoal(goalId);
            dispatch({
                type: 'DELETE_GOAL_SUCCESS',
                payload: goalId
            });
        },
        addContribution: async (goalId: string, contributionData: Omit < Contribution, 'id' | 'goalId' > ) => {
            const updatedGoal = await FinancialGoalsAPIService.addContribution(goalId, contributionData);
            dispatch({
                type: 'UPDATE_GOAL_SUCCESS',
                payload: updatedGoal
            });
        },
        generateAIPlan: async (goalId: string) => {
            const plan = await FinancialGoalsAPIService.generateAIPlan(goalId);
            dispatch({
                type: 'UPDATE_PLAN_SUCCESS',
                payload: {
                    goalId,
                    plan
                }
            });
        },
    }), []);

    return ( <
        FinancialGoalsContext.Provider value = {
            {
                state,
                dispatch,
                actions
            }
        } > {
            children
        } <
        /FinancialGoalsContext.Provider>
    );
};

/**
 * @export
 * @function useFinancialGoals
 * @description Custom hook to access the financial goals context.
 * @returns {FinancialGoalsContextType}
 */
export const useFinancialGoals = (): FinancialGoalsContextType => {
    const context = useContext(FinancialGoalsContext);
    if (!context) {
        throw new Error('useFinancialGoals must be used within a FinancialGoalsProvider');
    }
    return context;
};


//================================================================================
// SECTION 5: REUSABLE UI COMPONENTS
// Description: A suite of smaller, generic components used to build the main view.
// These include loaders, modals, buttons, and progress bars.
//================================================================================

/**
 * @export
 * @component Spinner
 * @description A simple loading spinner component.
 * @returns {JSX.Element}
 */
export const Spinner: React.FC = () => ( <
    div className = "flex justify-center items-center p-8" >
    <
    div className = "animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500" > < /div> <
    /div>
);

/**
 * @export
 * @component ProgressBar
 * @description A visual progress bar.
 * @param {{ progress: number }} { progress }
 * @returns {JSX.Element}
 */
export const ProgressBar: React.FC < {
    progress: number
} > = ({
    progress
}) => {
    const clampedProgress = Math.min(Math.max(progress, 0), 100);
    return ( <
        div className = "w-full bg-gray-700 rounded-full h-2.5" >
        <
        div className = "bg-blue-500 h-2.5 rounded-full transition-all duration-500 ease-out"
        style = {
            {
                width: `${clampedProgress}%`
            }
        } >
        < /div> <
        /div>
    );
};

/**
 * @export
 * @component Modal
 * @description A generic modal component.
 * @param {{ isOpen: boolean; onClose: () => void; title: string; children: ReactNode }} { isOpen, onClose, title, children }
 * @returns {JSX.Element | null}
 */
export const Modal: React.FC < {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: ReactNode;
    size ? : 'md' | 'lg' | 'xl';
} > = ({
    isOpen,
    onClose,
    title,
    children,
    size = 'md'
}) => {
    if (!isOpen) return null;
    const sizeClasses = {
        md: 'max-w-2xl',
        lg: 'max-w-4xl',
        xl: 'max-w-6xl',
    };

    return ( <
        div className = "fixed inset-0 bg-black bg-opacity-70 z-50 flex justify-center items-center"
        onClick = {
            onClose
        } >
        <
        div className = {
            `bg-gray-800 text-white rounded-lg shadow-xl w-full p-6 m-4 ${sizeClasses[size]}`
        }
        onClick = {
            e => e.stopPropagation()
        } >
        <
        div className = "flex justify-between items-center border-b border-gray-700 pb-3 mb-4" >
        <
        h2 className = "text-2xl font-bold" > {
            title
        } < /h2> <
        button onClick = {
            onClose
        }
        className = "text-gray-400 hover:text-white"
        aria-label = "Close modal" >
        <
        svg className = "w-6 h-6"
        fill = "none"
        stroke = "currentColor"
        viewBox = "0 0 24 24" > < path strokeLinecap = "round"
        strokeLinejoin = "round"
        strokeWidth = {
            2
        }
        d = "M6 18L18 6M6 6l12 12" / > < /svg> <
        /button> <
        /div> <
        div className = "max-h-[80vh] overflow-y-auto" > {
            children
        } < /div> <
        /div> <
        /div>
    );
};

/**
 * @export
 * @component ErrorBoundary
 * @description A simple error boundary to catch JS errors in child components.
 */
export class ErrorBoundary extends Component < {
    children: ReactNode
}, {
    hasError: boolean
} > {
    constructor(props: {
        children: ReactNode
    }) {
        super(props);
        this.state = {
            hasError: false
        };
    }

    static getDerivedStateFromError(error: Error) {
        return {
            hasError: true
        };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        console.error("Uncaught error:", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return ( <
                div className = "p-4 bg-red-900 text-red-100 rounded-lg" >
                <
                h2 className = "font-bold text-lg" > Something went wrong. < /h2> <
                p > Please try refreshing the page. < /p> <
                /div>
            );
        }

        return this.props.children;
    }
}


//================================================================================
// SECTION 6: GOAL-SPECIFIC SUB-COMPONENTS
// Description: Components that are directly related to displaying and
// interacting with financial goals.
//================================================================================

/**
 * @export
 * @component GoalItem
 * @description A card representing a single financial goal in a list.
 * @param {{ goal: FinancialGoal }} { goal }
 * @returns {JSX.Element}
 */
export const GoalItem: React.FC < {
    goal: FinancialGoal
} > = ({
    goal
}) => {
    const {
        actions,
        state
    } = useFinancialGoals();
    const progress = calculateProgress(goal.currentAmount, goal.targetAmount);
    const {
        totalDays
    } = timeUntil(goal.targetDate);
    const preferences = state.userPreferences;

    if (!preferences) return null;

    return ( <
        div className = "bg-gray-800 p-5 rounded-lg border border-gray-700 hover:border-blue-500 transition-all cursor-pointer flex flex-col justify-between"
        onClick = {
            () => actions.selectGoal(goal.id)
        } >
        <
        div >
        <
        div className = "flex items-start justify-between" >
        <
        div className = "flex items-center space-x-4" > {
            getCategoryIcon(goal.category)
        } <
        div >
        <
        h3 className = "text-xl font-bold" > {
            goal.name
        } < /h3> <
        p className = {
            `text-sm font-semibold ${getGoalStatusColor(goal)}`
        } > {
            totalDays > 0 ? `${totalDays} days left` : 'Overdue'
        } < /p> <
        /div> <
        /div> <
        div className = "text-right" >
        <
        p className = "text-2xl font-semibold" > {
            formatCurrency(goal.currentAmount, preferences.currency, preferences.language)
        } < /p> <
        p className = "text-sm text-gray-400" > of {
            formatCurrency(goal.targetAmount, preferences.currency, preferences.language)
        } < /p> <
        /div> <
        /div> <
        /div> <
        div className = "mt-4" >
        <
        div className = "flex justify-between text-sm mb-1" >
        <
        span > Progress < /span> <
        span className = "font-bold" > {
            progress.toFixed(1)
        } % < /span> <
        /div> <
        ProgressBar progress = {
            progress
        }
        /> <
        /div> <
        /div>
    );
};

/**
 * @export
 * @component GoalList
 * @description Displays a list of GoalItem components with filtering and sorting.
 * @returns {JSX.Element}
 */
export const GoalList: React.FC = () => {
    const {
        state
    } = useFinancialGoals();
    const [filter, setFilter] = useState < GoalStatus | 'All' > (GoalStatus.ACTIVE);
    const [sortBy, setSortBy] = useState < 'priority' | 'targetDate' | 'progress' > ('priority');
    const [isAddingGoal, setIsAddingGoal] = useState(false);

    const sortedAndFilteredGoals = useMemo(() => {
        const filtered = state.goals.filter(goal => filter === 'All' || goal.status === filter);
        return filtered.sort((a, b) => {
            switch (sortBy) {
                case 'priority':
                    return b.priority - a.priority;
                case 'targetDate':
                    return new Date(a.targetDate).getTime() - new Date(b.targetDate).getTime();
                case 'progress':
                    const progressA = calculateProgress(a.currentAmount, a.targetAmount);
                    const progressB = calculateProgress(b.currentAmount, b.targetAmount);
                    return progressB - progressA;
                default:
                    return 0;
            }
        });
    }, [state.goals, filter, sortBy]);

    return ( <
        div >
        <
        Modal isOpen = {
            isAddingGoal
        }
        onClose = {
            () => setIsAddingGoal(false)
        }
        title = "Declare a New Campaign" >
        <
        AddOrEditGoalForm onClose = {
            () => setIsAddingGoal(false)
        }
        /> <
        /Modal> <
        div className = "flex justify-between items-center mb-4 flex-wrap gap-4" >
        <
        h2 className = "text-2xl font-bold" > Your Campaigns < /h2> <
        div className = "flex items-center gap-4" >
        <
        select value = {
            filter
        }
        onChange = {
            e => setFilter(e.target.value as GoalStatus | 'All')
        }
        className = "bg-gray-700 rounded-md p-2" >
        <
        option value = "All" > All < /option> {
            Object.values(GoalStatus).map(s => < option key = {
                s
            }
            value = {
                s
            } > {
                s
            } < /option>)
        } <
        /select> <
        button onClick = {
            () => setIsAddingGoal(true)
        }
        className = "bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg" > +Declare New < /button> <
        /div> <
        /div> {
            sortedAndFilteredGoals.length > 0 ? ( <
                div className = "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6" > {
                    sortedAndFilteredGoals.map(goal => ( <
                        GoalItem key = {
                            goal.id
                        }
                        goal = {
                            goal
                        }
                        />
                    ))
                } <
                /div>
            ) : ( <
                div className = "text-center py-16 bg-gray-800 rounded-lg" >
                <
                h3 className = "text-xl font-semibold" > No campaigns here. < /h3> <
                p className = "text-gray-400 mt-2" > Declare a new objective to begin your journey. < /p> <
                /div>
            )
        } <
        /div>
    );
};


/**
 * @export
 * @component AIGoalPlanDisplay
 * @description Displays the AI-generated plan for a goal.
 * @param {{ plan: AIGoalPlan, goalId: string }} { plan, goalId }
 * @returns {JSX.Element}
 */
export const AIGoalPlanDisplay: React.FC < {
    plan: AIGoalPlan;
    goalId: string
} > = ({
    plan,
    goalId
}) => {
    const {
        actions,
        state
    } = useFinancialGoals();
    const goal = state.goals.find(g => g.id === goalId);

    const handleToggleStep = async (stepId: string, isCompleted: boolean) => {
        if (!goal || !goal.plan) return;
        const updatedSteps = goal.plan.steps.map(s => s.id === stepId ? { ...s,
            isCompleted
        } : s);
        const updatedPlan = { ...goal.plan,
            steps: updatedSteps
        };
        await actions.updateGoal(goalId, {
            plan: updatedPlan
        });
    };

    return ( <
        div className = "bg-gray-900 p-6 rounded-lg border border-gray-700" >
        <
        h3 className = "text-xl font-bold mb-1" > AI Strategic Brief < /h3> <
        p className = "text-sm text-gray-400 mb-4" > Generated on {
            formatDate(plan.generatedAt)
        } < /p> <
        p className = "mb-6 italic" > "{plan.summary}" < /p> {
            plan.warnings.length > 0 && ( <
                div className = "bg-yellow-900 border border-yellow-700 text-yellow-200 p-4 rounded-md mb-6" >
                <
                h4 className = "font-bold" > Strategic Warnings < /h4> <
                ul className = "list-disc list-inside mt-2 text-sm" > {
                    plan.warnings.map((warning, i) => < li key = {
                        i
                    } > {
                        warning
                    } < /li>)} <
                    /ul> <
                    /div>
            )
        } <
        div className = "space-y-4" > {
            plan.steps.map(step => ( <
                div key = {
                    step.id
                }
                className = "bg-gray-800 p-4 rounded-md" >
                <
                div className = "flex items-start" >
                <
                input type = "checkbox"
                checked = {
                    step.isCompleted
                }
                onChange = {
                    e => handleToggleStep(step.id, e.target.checked)
                }
                id = {
                    `step-${step.id}`
                }
                className = "mt-1.5 mr-3 h-5 w-5" / >
                <
                label htmlFor = {
                    `step-${step.id}`
                }
                className = "flex-1" >
                <
                h4 className = {
                    `font-semibold ${step.isCompleted ? 'line-through text-gray-500' : ''}`
                } > {
                    step.title
                } < /h4> <
                p className = "text-sm text-gray-300 mt-1" > {
                    step.description
                } < /p> <
                div className = "flex items-center space-x-4 text-xs mt-2 text-gray-400" >
                <
                span > Category: {
                    step.category
                } < /span> <
                span > Difficulty: {
                    step.difficulty
                } < /span> <
                /div> {
                    step.actionLink && ( <
                        a href = {
                            step.actionLink.url
                        }
                        target = {
                            step.actionLink.external ? "_blank" : "_self"
                        }
                        rel = "noopener noreferrer"
                        className = "text-blue-400 hover:underline text-sm mt-2 inline-block" > {
                            step.actionLink.text
                        } &
                        rarr; <
                        /a>
                    )
                } <
                /label> <
                /div> <
                /div>
            ))
        } <
        /div> <
        /div>
    );
};


/**
 * @export
 * @component GoalDetailView
 * @description A detailed view for a single selected goal.
 * @returns {JSX.Element | null}
 */
export const GoalDetailView: React.FC = () => {
    const {
        state,
        actions
    } = useFinancialGoals();
    const [isPlanLoading, setIsPlanLoading] = useState(false);
    const selectedGoal = useMemo(() => state.goals.find(g => g.id === state.selectedGoalId), [state.goals, state.selectedGoalId]);

    const handleGeneratePlan = useCallback(async () => {
        if (selectedGoal) {
            setIsPlanLoading(true);
            try {
                await actions.generateAIPlan(selectedGoal.id);
            } catch (e) {
                console.error("Failed to generate plan", e);
                // Here you'd show an error toast to the user
            } finally {
                setIsPlanLoading(false);
            }
        }
    }, [selectedGoal, actions]);


    if (!selectedGoal) {
        return ( <
            div className = "flex items-center justify-center h-full bg-gray-900 rounded-lg p-6 sticky top-8" >
            <
            div className = "text-center" >
            <
            svg className = "mx-auto h-12 w-12 text-gray-500"
            fill = "none"
            viewBox = "0 0 24 24"
            stroke = "currentColor"
            aria-hidden = "true" >
            <
            path vectorEffect = "non-scaling-stroke"
            strokeLinecap = "round"
            strokeLinejoin = "round"
            strokeWidth = {
                2
            }
            d = "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" / >
            <
            /svg> <
            h3 className = "mt-2 text-lg font-medium text-white" > Select a Campaign < /h3> <
            p className = "mt-1 text-sm text-gray-400" > Choose a campaign from the list to view its strategic details. < /p> <
            /div> <
            /div>
        );
    }

    const {
        name,
        plan
    } = selectedGoal;

    return ( <
        div className = "p-6 bg-gray-900 rounded-lg h-full overflow-y-auto sticky top-8" >
        <
        div className = "flex justify-between items-start" >
        <
        div >
        <
        h2 className = "text-3xl font-bold" > {
            name
        } < /h2> <
        p className = "text-gray-400" > {
            selectedGoal.category
        } - Priority {
            selectedGoal.priority
        } < /p> <
        /div> <
        button onClick = {
            () => actions.selectGoal(null)
        }
        className = "text-gray-400 hover:text-white"
        aria-label = "Close details" >
        <
        svg className = "w-6 h-6"
        fill = "none"
        stroke = "currentColor"
        viewBox = "0 0 24 24" > < path strokeLinecap = "round"
        strokeLinejoin = "round"
        strokeWidth = {
            2
        }
        d = "M6 18L18 6M6 6l12 12" / > < /svg> <
        /button> <
        /div>

        <
        div className = "my-8 space-y-6" > { /* Detailed stats and charts could go here */ } <
        MilestoneTracker goal = {
            selectedGoal
        }
        /> <
        /div>

        {
            plan ? ( <
                AIGoalPlanDisplay plan = {
                    plan
                }
                goalId = {
                    selectedGoal.id
                }
                />
            ) : ( <
                div className = "text-center p-8 bg-gray-800 rounded-lg" >
                <
                h3 className = "text-xl font-semibold mb-2" > Your campaign map is ready. < /h3> <
                p className = "text-gray-400 mb-6" > Let our AI strategist plot the most effective course to achieve your goal. < /p> <
                button onClick = {
                    handleGeneratePlan
                }
                disabled = {
                    isPlanLoading
                }
                className = "bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg disabled:bg-blue-800 disabled:cursor-not-allowed" > {
                    isPlanLoading ? 'Generating...' : 'Generate Strategic Plan'
                } <
                /button> <
                /div>
            )
        } <
        ScenarioSimulator goal = {
            selectedGoal
        }
        /> <
        /div>
    );
};

//================================================================================
// SECTION 7: MAIN VIEW COMPONENT
// Description: The top-level component that orchestrates the entire financial
// goals feature view. It uses the provider and renders the main layout.
//================================================================================

/**
 * @export
 * @component FinancialGoalsView
 * @description The main view for managing financial goals.
 * @returns {JSX.Element}
 */
export const FinancialGoalsView: React.FC = () => {
    const {
        state
    } = useFinancialGoals();

    if (state.isLoading) {
        return <div className = "bg-black text-white min-h-screen" > < Spinner / > < /div>;
    }

    if (state.error) {
        return <div className = "text-red-500 p-8" > Error: {
            state.error.message
        } < /div>;
    }

    return ( <
        ErrorBoundary >
        <
        div className = "bg-black text-white min-h-screen p-8 font-sans" >
        <
        header className = "mb-10" >
        <
        h1 className = "text-5xl font-extrabold tracking-tight" > The Grand Campaign < /h1> <
        p className = "text-gray-400 mt-2" > Declare your objectives. Chart your course. Achieve your vision. < /p> <
        /div> <
        main className = "grid grid-cols-1 lg:grid-cols-3 gap-8" >
        <
        div className = "lg:col-span-2" >
        <
        GoalList / >
        <
        /div> <
        div className = "lg:col-span-1" >
        <
        GoalDetailView / >
        <
        /div> <
        /main> <
        /div> <
        /ErrorBoundary>
    );
}

// This is a wrapper component that includes the provider
export const FinancialGoalsViewWithProvider: React.FC = () => ( <
    FinancialGoalsProvider >
    <
    FinancialGoalsView / >
    <
    /FinancialGoalsProvider>
);


//================================================================================
// SECTION 8: MOCK DATA
// Description: Comprehensive mock data to simulate a real user's state. This
// data is used by the mock API service to provide a realistic development
// and testing environment without a live backend.
//================================================================================

export const MOCK_AI_PLAN: AIGoalPlan = {
    id: 'plan-1',
    goalId: 'goal-1',
    generatedAt: '2023-10-26T10:00:00Z',
    summary: 'An aggressive, investment-focused plan to maximize growth for your condo down payment, balancing automated savings with market exposure.',
    confidenceScore: 0.88,
    projectedCompletionDate: '2028-05-15T00:00:00Z',
    warnings: ["Market volatility may impact your projected completion date. Review your portfolio quarterly."],
    steps: [{
        id: 'step-1-1',
        title: 'Automate a bi-weekly transfer of $400.',
        description: 'Set up a recurring bi-weekly transfer of $400 from your checking account to a high-yield savings account dedicated to this goal.',
        category: 'Savings',
        difficulty: 'Easy',
        isCompleted: true,
        estimatedImpact: {
            amount: 866,
            currency: 'USD',
            timeframe: 'monthly'
        },
        actionLink: {
            text: 'Set up automated transfer',
            url: '/transfers'
        },
    }, {
        id: 'step-1-2',
        title: 'Review and optimize your monthly budget.',
        description: 'Analyze your spending from the last 3 months to identify categories where you can cut back, such as dining out or subscriptions. Aim to free up an additional $150 per month.',
        category: 'Budgeting',
        difficulty: 'Medium',
        isCompleted: false,
        estimatedImpact: {
            amount: 150,
            currency: 'USD',
            timeframe: 'monthly'
        },
        actionLink: {
            text: 'Analyze Spending',
            url: '/insights/spending'
        },
    }, {
        id: 'step-1-3',
        title: 'Explore Real Estate Investment Trusts (REITs).',
        description: 'Since your goal is housing-related, consider allocating a portion of your savings to a low-cost REIT ETF to potentially grow your funds faster than a traditional savings account. This carries market risk.',
        category: 'Investment',
        difficulty: 'Hard',
        isCompleted: false,
        estimatedImpact: {
            amount: 4000,
            currency: 'USD',
            timeframe: 'annually'
        },
        actionLink: {
            text: 'Explore Real Estate ETFs',
            url: '/invest/reits'
        },
    }, ],
};

export const MOCK_CONTRIBUTIONS: Contribution[] = Array.from({
    length: 50
}, (_, i) => ({
    id: `contrib-${i}`,
    goalId: 'goal-1',
    amount: 100 + Math.random() * 800,
    date: new Date(Date.now() - i * 15 * 24 * 60 * 60 * 1000).toISOString(),
    source: i % 3 === 0 ? 'Automated Savings' : 'Manual Transfer',
}));


export const MOCK_FINANCIAL_GOALS: FinancialGoal[] = [{
    id: 'goal-1',
    userId: 'user-123',
    name: 'Down Payment for a Condo',
    description: 'Saving for a 20% down payment on a condo in the city center.',
    targetAmount: 100000,
    currentAmount: 45250,
    targetDate: '2028-12-31T00:00:00Z',
    creationDate: '2022-01-15T00:00:00Z',
    category: GoalCategory.HOUSING,
    status: GoalStatus.ACTIVE,
    priority: 5,
    icon: 'home',
    plan: MOCK_AI_PLAN,
    contributions: MOCK_CONTRIBUTIONS,
    milestones: [{
        id: 'm1-1',
        goalId: 'goal-1',
        name: '10% Achieved',
        targetAmount: 10000,
        achievedDate: '2022-08-20T00:00:00Z'
    }, {
        id: 'm1-2',
        goalId: 'goal-1',
        name: '25% Achieved',
        targetAmount: 25000,
        achievedDate: '2023-05-10T00:00:00Z'
    }, {
        id: 'm1-3',
        goalId: 'goal-1',
        name: 'Halfway There!',
        targetAmount: 50000,
    }, ],
    recurringContributions: [{
        id: 'rc-1',
        goalId: 'goal-1',
        amount: 400,
        frequency: ContributionFrequency.BI_WEEKLY,
        startDate: '2022-02-01T00:00:00Z',
        nextContributionDate: '2023-11-10T00:00:00Z',
        linkedAccountId: 'acc-checking-1'
    }, ],
    riskProfile: RiskProfile.AGGRESSIVE,
    linkedAccountIds: ['acc-checking-1', 'acc-invest-1']
}, {
    id: 'goal-2',
    userId: 'user-123',
    name: 'Trip to Neo-Tokyo',
    description: 'A 3-week immersive trip to Japan, exploring both modern cities and ancient temples.',
    targetAmount: 8000,
    currentAmount: 2100,
    targetDate: '2025-06-01T00:00:00Z',
    creationDate: '2023-03-01T00:00:00Z',
    category: GoalCategory.TRAVEL,
    status: GoalStatus.ACTIVE,
    priority: 4,
    icon: 'plane',
    plan: null,
    contributions: [],
    milestones: [{
        id: 'm2-1',
        goalId: 'goal-2',
        name: '25% Achieved',
        targetAmount: 2000,
        achievedDate: '2023-10-15T00:00:00Z'
    }, {
        id: 'm2-2',
        goalId: 'goal-2',
        name: 'Flights Booked',
        targetAmount: 4000
    }, ],
    recurringContributions: [{
        id: 'rc-2',
        goalId: 'goal-2',
        amount: 150,
        frequency: ContributionFrequency.MONTHLY,
        startDate: '2023-03-01T00:00:00Z',
        nextContributionDate: '2023-11-01T00:00:00Z',
        linkedAccountId: 'acc-checking-1'
    }, ],
    riskProfile: RiskProfile.CONSERVATIVE,
    linkedAccountIds: ['acc-savings-1']
}, {
    id: 'goal-3',
    userId: 'user-123',
    name: 'Emergency Fund',
    description: 'Building a fund to cover 6 months of living expenses.',
    targetAmount: 30000,
    currentAmount: 30000,
    targetDate: '2024-01-01T00:00:00Z',
    creationDate: '2021-01-01T00:00:00Z',
    category: GoalCategory.EMERGENCY_FUND,
    status: GoalStatus.COMPLETED,
    priority: 5,
    icon: 'shield',
    plan: null,
    contributions: [],
    milestones: [],
    recurringContributions: [],
    riskProfile: RiskProfile.CONSERVATIVE,
    linkedAccountIds: ['acc-savings-hysa-1']
}, {
    id: 'goal-4',
    userId: 'user-123',
    name: 'New Graphics Card',
    description: 'Saving up for the latest and greatest GPU for my gaming rig.',
    targetAmount: 1200,
    currentAmount: 500,
    targetDate: '2024-03-01T00:00:00Z',
    creationDate: '2023-09-01T00:00:00Z',
    category: GoalCategory.MAJOR_PURCHASE,
    status: GoalStatus.ON_HOLD,
    priority: 2,
    icon: 'chip',
    plan: null,
    contributions: [],
    milestones: [],
    recurringContributions: [],
    riskProfile: RiskProfile.CONSERVATIVE,
    linkedAccountIds: []
}, ];

export const MOCK_AI_INSIGHTS: AIInsight[] = [{
    id: 'insight-1',
    type: 'Opportunity',
    title: 'Accelerate Your Condo Goal',
    message: 'We noticed your High-Yield Savings Account has a lower APY than competitors. Switching could earn you an extra $50/year towards your condo.',
    relatedGoalId: 'goal-1',
    actionable: true,
    actionText: 'Compare Savings Accounts',
    actionLink: '/marketplace/savings',
    timestamp: new Date().toISOString()
}, {
    id: 'insight-2',
    type: 'Warning',
    title: 'Travel Goal At Risk',
    message: 'Your current contribution rate for the "Trip to Neo-Tokyo" goal is slightly behind schedule. Consider a one-time boost or a small increase in your monthly transfer.',
    relatedGoalId: 'goal-2',
    actionable: true,
    actionText: 'Adjust Contribution',
    actionLink: '/goals/goal-2/contribute',
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
}]

//================================================================================
// SECTION 9: ADVANCED COMPONENTS & FEATURES
// Description: More complex components to provide deeper functionality, such as
// scenario simulation, adding/editing goals, and detailed charting.
//================================================================================

/**
 * @export
 * @interface SimulationParams
 * @description Parameters for running a financial scenario simulation.
 */
export interface SimulationParams {
    monthlyContributionChange: number;
    oneTimeContribution: number;
    expectedAnnualReturn: number; // percentage
    inflationRate: number; // percentage
    timeframeExtensionMonths: number;
}

/**
 * @export
 * @function runProjectionSimulation
 * @description A pure function that calculates the outcome of a financial simulation.
 * @param {FinancialGoal} goal The base goal for the simulation.
 * @param {SimulationParams} params The simulation parameters.
 * @returns {{ projectedAmount: number; projectedDate: string; originalProjectedDate: string; dataPoints: {date: string; value: number}[] }}
 */
export function runProjectionSimulation(goal: FinancialGoal, params: SimulationParams): {
    projectedAmount: number;
    projectedDate: string;
    originalProjectedDate: string;
    dataPoints: {
        date: string;
        value: number
    } []
} {
    // This is a simplified simulation logic. A real one would be much more complex.
    const now = new Date();
    const targetDate = new Date(goal.targetDate);
    targetDate.setMonth(targetDate.getMonth() + params.timeframeExtensionMonths);

    const monthlyReturnRate = Math.pow(1 + params.expectedAnnualReturn / 100, 1 / 12) - 1;
    const baseMonthlyContribution = calculateMonthlyContribution(goal);
    const simulatedMonthlyContribution = baseMonthlyContribution + params.monthlyContributionChange;

    let currentAmount = goal.currentAmount + params.oneTimeContribution;
    const dataPoints: {
        date: string;
        value: number
    } [] = [{
        date: now.toISOString(),
        value: currentAmount
    }];
    let projectedDate = new Date(goal.targetDate);

    let months = 0;
    while (currentAmount < goal.targetAmount && months < 1200) { // 100 year limit
        currentAmount *= (1 + monthlyReturnRate);
        currentAmount += simulatedMonthlyContribution;
        months++;
        const currentDate = new Date(now);
        currentDate.setMonth(now.getMonth() + months);
        dataPoints.push({
            date: currentDate.toISOString(),
            value: Math.round(currentAmount * 100) / 100
        });
        if (currentAmount >= goal.targetAmount) {
            projectedDate = currentDate;
            break;
        }
    }

    // A very basic original projection for comparison
    const originalMonths = (goal.targetAmount - goal.currentAmount) / (baseMonthlyContribution || 1);
    const originalProjectedDate = new Date(now);
    originalProjectedDate.setMonth(now.getMonth() + originalMonths);

    return {
        projectedAmount: currentAmount,
        projectedDate: projectedDate.toISOString(),
        originalProjectedDate: originalProjectedDate.toISOString(),
        dataPoints,
    };
}


/**
 * @export
 * @component ScenarioSimulator
 * @description UI for running 'what-if' scenarios on a financial goal.
 * @param {{ goal: FinancialGoal }} { goal }
 * @returns {JSX.Element}
 */
export const ScenarioSimulator: React.FC < {
    goal: FinancialGoal
} > = ({
    goal
}) => {
    const [params, setParams] = useState < SimulationParams > ({
        monthlyContributionChange: 0,
        oneTimeContribution: 0,
        expectedAnnualReturn: 5,
        inflationRate: 2,
        timeframeExtensionMonths: 0,
    });
    const [result, setResult] = useState < ReturnType < typeof runProjectionSimulation > | null > (null);

    const handleParamChange = (field: keyof SimulationParams, value: number) => {
        setParams(prev => ({ ...prev,
            [field]: value
        }));
    };

    const runSim = () => {
        const simResult = runProjectionSimulation(goal, params);
        setResult(simResult);
    };

    return ( <
        div className = "mt-8 p-6 bg-gray-800 border border-gray-700 rounded-lg" >
        <
        h3 className = "text-xl font-bold mb-4" > Scenario Simulator < /h3> <
        div className = "grid grid-cols-1 md:grid-cols-2 gap-6" > { /* Controls */ } <
        div className = "space-y-4" >
        <
        div >
        <
        label className = "block text-sm font-medium text-gray-300" > Monthly Contribution Change < /label> <
        input type = "number"
        value = {
            params.monthlyContributionChange
        }
        onChange = {
            e => handleParamChange('monthlyContributionChange', Number(e.target.value))
        }
        className = "w-full bg-gray-700 rounded-md p-2 mt-1" /
        >
        <
        /div> <
        div >
        <
        label className = "block text-sm font-medium text-gray-300" > One - Time Contribution < /label> <
        input type = "number"
        value = {
            params.oneTimeContribution
        }
        onChange = {
            e => handleParamChange('oneTimeContribution', Number(e.target.value))
        }
        className = "w-full bg-gray-700 rounded-md p-2 mt-1" /
        >
        <
        /div> <
        div >
        <
        label className = "block text-sm font-medium text-gray-300" > Expected Annual Return( % ) < /label> <
        input type = "range"
        min = "0"
        max = "15"
        step = "0.5"
        value = {
            params.expectedAnnualReturn
        }
        onChange = {
            e => handleParamChange('expectedAnnualReturn', Number(e.target.value))
        }
        className = "w-full" /
        >
        <
        span > {
            params.expectedAnnualReturn.toFixed(1)
        } % < /span> <
        /div> <
        button onClick = {
            runSim
        }
        className = "w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg" >
        Run Simulation <
        /button> <
        /div> { /* Results */ } <
        div > {
            result ? ( <
                div className = "space-y-3" >
                <
                h4 className = "font-semibold text-lg" > Simulation Results < /h4> <
                p > New Projected Date: < strong className = "text-green-400" > {
                    formatDate(result.projectedDate)
                } < /strong></p >
                <
                p > Original Projected Date: < span className = "text-gray-400" > {
                    formatDate(result.originalProjectedDate)
                } < /span></p > { /* Chart would go here */ } <
                div className = "h-40 bg-gray-700 rounded-md flex items-center justify-center" >
                <
                p className = "text-gray-500" > Projection Chart Placeholder < /p> <
                /div> <
                /div>
            ) : ( <
                div className = "flex items-center justify-center h-full text-gray-500 rounded-lg bg-gray-900" >
                <
                p > Adjust parameters and run the simulation. < /p> <
                /div>
            )
        } <
        /div> <
        /div> <
        /div>
    );
};


/**
 * @export
 * @component AddOrEditGoalForm
 * @description A form, likely within a modal, for creating or editing a goal.
 * @param {{ goal?: FinancialGoal; onClose: () => void; }} { goal, onClose }
 * @returns {JSX.Element}
 */
export const AddOrEditGoalForm: React.FC < {
    goal ? : FinancialGoal;
    onClose: () => void;
} > = ({
    goal,
    onClose
}) => {
    const {
        actions
    } = useFinancialGoals();
    const [formData, setFormData] = useState({
        name: goal ? .name || '',
        targetAmount: goal ? .targetAmount || 0,
        targetDate: goal ? .targetDate.split('T')[0] || '',
        category: goal ? .category || GoalCategory.CUSTOM,
        priority: goal ? .priority || 3,
        riskProfile: goal ? .riskProfile || RiskProfile.MODERATE,
        linkedAccountIds: goal ? .linkedAccountIds || [],
    });
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent < HTMLInputElement | HTMLSelectElement > ) => {
        const {
            name,
            value
        } = e.target;
        setFormData(prev => ({ ...prev,
            [name]: name === 'targetAmount' || name === 'priority' ? Number(value) : value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            if (goal) {
                // Update logic
                await actions.updateGoal(goal.id, {
                    ...formData,
                    targetDate: new Date(formData.targetDate).toISOString()
                });
            } else {
                // Create logic
                await actions.createGoal({
                    userId: 'user-123',
                    name: formData.name,
                    targetAmount: formData.targetAmount,
                    targetDate: new Date(formData.targetDate).toISOString(),
                    category: formData.category,
                    priority: formData.priority,
                    status: GoalStatus.ACTIVE,
                    icon: 'star',
                    riskProfile: formData.riskProfile,
                    linkedAccountIds: formData.linkedAccountIds
                });
            }
            onClose();
        } catch (err) {
            console.error("Failed to save goal", err);
            // Show error message
        } finally {
            setIsLoading(false);
        }
    };

    return ( <
        form onSubmit = {
            handleSubmit
        }
        className = "space-y-4" >
        <
        div >
        <
        label htmlFor = "name" > Goal Name < /label> <
        input id = "name"
        name = "name"
        value = {
            formData.name
        }
        onChange = {
            handleChange
        }
        required className = "w-full bg-gray-700 rounded-md p-2 mt-1" / >
        <
        /div> <
        div className = "grid grid-cols-1 md:grid-cols-2 gap-4" >
        <
        div >
        <
        label htmlFor = "targetAmount" > Target Amount < /label> <
        input id = "targetAmount"
        name = "targetAmount"
        type = "number"
        value = {
            formData.targetAmount
        }
        onChange = {
            handleChange
        }
        required className = "w-full bg-gray-700 rounded-md p-2 mt-1" / >
        <
        /div> <
        div >
        <
        label htmlFor = "targetDate" > Target Date < /label> <
        input id = "targetDate"
        name = "targetDate"
        type = "date"
        value = {
            formData.targetDate
        }
        onChange = {
            handleChange
        }
        required className = "w-full bg-gray-700 rounded-md p-2 mt-1" / >
        <
        /div> <
        /div> <
        div className = "grid grid-cols-1 md:grid-cols-2 gap-4" >
        <
        div >
        <
        label htmlFor = "category" > Category < /label> <
        select id = "category"
        name = "category"
        value = {
            formData.category
        }
        onChange = {
            handleChange
        }
        className = "w-full bg-gray-700 rounded-md p-2 mt-1" > {
            Object.values(GoalCategory).map(cat => ( <
                option key = {
                    cat
                }
                value = {
                    cat
                } > {
                    cat
                } < /option>
            ))
        } <
        /select> <
        /div> <
        div >
        <
        label htmlFor = "riskProfile" > Risk Profile < /label> <
        select id = "riskProfile"
        name = "riskProfile"
        value = {
            formData.riskProfile
        }
        onChange = {
            handleChange
        }
        className = "w-full bg-gray-700 rounded-md p-2 mt-1" > {
            Object.values(RiskProfile).map(prof => ( <
                option key = {
                    prof
                }
                value = {
                    prof
                } > {
                    prof
                } < /option>
            ))
        } <
        /select> <
        /div> <
        /div> <
        div >
        <
        label htmlFor = "priority" > Priority(1 - 5) < /label> <
        input id = "priority"
        name = "priority"
        type = "range"
        min = "1"
        max = "5"
        value = {
            formData.priority
        }
        onChange = {
            handleChange
        }
        className = "w-full" / >
        <
        /div> <
        div className = "flex justify-end space-x-3 pt-4" >
        <
        button type = "button"
        onClick = {
            onClose
        }
        className = "bg-gray-600 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded-lg" >
        Cancel <
        /button> <
        button type = "submit"
        disabled = {
            isLoading
        }
        className = "bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg disabled:opacity-50" > {
            isLoading ? 'Saving...' : (goal ? 'Save Changes' : 'Create Goal')
        } <
        /button> <
        /div> <
        /form>
    );
};

export const MilestoneTracker: React.FC < {
    goal: FinancialGoal
} > = ({
    goal
}) => {
    const {
        milestones,
        currentAmount,
        targetAmount
    } = goal;
    if (!milestones || milestones.length === 0) return null;

    return ( <
        div >
        <
        h4 className = "font-bold text-lg mb-4" > Milestones < /h4> <
        div className = "relative" > { /* Progress line */ } <
        div className = "absolute left-4 top-0 h-full w-0.5 bg-gray-700" > < /div> {
            milestones.map((milestone, index) => {
                const isAchieved = milestone.achievedDate || currentAmount >= milestone.targetAmount;
                return ( <
                    div key = {
                        milestone.id
                    }
                    className = "flex items-start mb-6" >
                    <
                    div className = {
                        `z-10 flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${isAchieved ? 'bg-green-500' : 'bg-gray-600'}`
                    } > {
                        isAchieved ? ( <
                            svg className = "w-5 h-5 text-white"
                            fill = "currentColor"
                            viewBox = "0 0 20 20" > < path fillRule = "evenodd"
                            d = "M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule = "evenodd" / > < /svg>
                        ) : ( <
                            div className = "w-3 h-3 bg-gray-400 rounded-full" > < /div>
                        )
                    } <
                    /div> <
                    div className = "ml-4" >
                    <
                    p className = {
                        `font-semibold ${isAchieved ? 'text-white' : 'text-gray-400'}`
                    } > {
                        milestone.name
                    } < /p> <
                    p className = "text-sm text-gray-500" >
                    Target: {
                        formatCurrency(milestone.targetAmount, 'USD')
                    } {
                        isAchieved && milestone.achievedDate && `(Achieved on ${formatDate(milestone.achievedDate)})`
                    } <
                    /p> <
                    /div> <
                    /div>
                );
            })
        } <
        /div> <
        /div>
    );
};