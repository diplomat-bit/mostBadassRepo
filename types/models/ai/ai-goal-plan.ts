// REPOSITORY SOURCE: diplomat-bit/Citibank_Demo_Business_Inc_Demonstration- | PATH: diplomat-bit-Citibank_Demo_Business_Inc_Demonstration--ab2501d/types/models/ai/ai-goal-plan.ts
================================================================================

// types/models/ai/ai-goal-plan.ts
import type { AIGoalPlanStep } from './ai-goal-plan-step';

export interface AIGoalPlan {
    feasibilitySummary: string;
    monthlyContribution: number;
    steps: AIGoalPlanStep[];
}