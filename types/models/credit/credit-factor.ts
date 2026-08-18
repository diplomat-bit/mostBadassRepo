// REPOSITORY SOURCE: diplomat-bit/Citibank_Demo_Business_Inc_Demonstration- | PATH: diplomat-bit-Citibank_Demo_Business_Inc_Demonstration--ab2501d/types/models/credit/credit-factor.ts
================================================================================

// types/models/credit/credit-factor.ts
export interface CreditFactor {
    name: 'Payment History' | 'Credit Utilization' | 'Credit Age' | 'New Credit' | 'Credit Mix';
    status: 'Excellent' | 'Good' | 'Fair' | 'Poor';
    description: string;
}