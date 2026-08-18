// REPOSITORY SOURCE: diplomat-bit/Citibank_Demo_Business_Inc_Demonstration- | PATH: diplomat-bit-Citibank_Demo_Business_Inc_Demonstration--ab2501d/types/gamification.ts
================================================================================

// types/gamification.ts

export interface GamificationState {
    score: number;
    level: number;
    levelName: string;
    progress: number; // Percentage to next level
    credits: number;
}

export interface RewardPoints {
    balance: number;
    lastEarned: number;
    lastRedeemed: number;
    currency: string;
}

export interface RewardItem {
    id: string;
    name: string;
    cost: number; // in reward points
    type: 'cashback' | 'giftcard' | 'impact';
    description: string;
    iconName: string;
}
