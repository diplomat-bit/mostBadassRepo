// REPOSITORY SOURCE: diplomat-bit/Citibank_Demo_Business_Inc_Demonstration- | PATH: diplomat-bit-Citibank_Demo_Business_Inc_Demonstration--ab2501d/types/models/ai/ai-plan.ts
================================================================================

// types/models/ai/ai-plan.ts
import type { AIPlanStep } from './ai-plan-step';

export interface AIPlan {
    title: string;
    summary: string;
    steps: AIPlanStep[];
}