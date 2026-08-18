// REPOSITORY SOURCE: diplomat-bit/Citibank_Demo_Business_Inc_Demonstration- | PATH: diplomat-bit-Citibank_Demo_Business_Inc_Demonstration--ab2501d/types/models/corporate/fraud-case.ts
================================================================================

// types/models/corporate/fraud-case.ts
export interface FraudCase {
    id: string;
    description: string;
    amount: number;
    timestamp: string;
    riskScore: number;
    status: 'New' | 'Investigating' | 'Resolved' | 'Dismissed';
}