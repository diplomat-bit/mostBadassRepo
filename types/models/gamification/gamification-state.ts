// REPOSITORY SOURCE: diplomat-bit/Citibank_Demo_Business_Inc_Demonstration- | PATH: diplomat-bit-Citibank_Demo_Business_Inc_Demonstration--ab2501d/types/models/gamification/gamification-state.ts
================================================================================

// types/models/gamification/gamification-state.ts
export interface GamificationState {
    score: number;
    level: number;
    levelName: string;
    progress: number; // Percentage to next level
    credits: number;
}