// REPOSITORY SOURCE: diplomat-bit/Citibank_Demo_Business_Inc_Demonstration- | PATH: diplomat-bit-Citibank_Demo_Business_Inc_Demonstration--ab2501d/types/models/ai/ml-model.ts
================================================================================

// types/models/ai/ml-model.ts
export interface MLModel {
    id: string;
    name: string;
    version: number;
    accuracy: number;
    status: 'Production' | 'Staging' | 'Archived' | 'Training';
    lastTrained: string;
    performanceHistory: { date: string; accuracy: number }[];
}