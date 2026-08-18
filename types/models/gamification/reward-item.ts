// REPOSITORY SOURCE: diplomat-bit/Citibank_Demo_Business_Inc_Demonstration- | PATH: diplomat-bit-Citibank_Demo_Business_Inc_Demonstration--ab2501d/types/models/gamification/reward-item.ts
================================================================================

// types/models/gamification/reward-item.ts
export interface RewardItem {
    id: string;
    name: string;
    cost: number; // in reward points
    type: 'cashback' | 'giftcard' | 'impact';
    description: string;
    iconName: string;
}