// REPOSITORY SOURCE: diplomat-bit/Citibank_Demo_Business_Inc_Demonstration- | PATH: diplomat-bit-Citibank_Demo_Business_Inc_Demonstration--ab2501d/types/credit.ts
================================================================================

// types/credit.ts

export interface CreditScore {
  score: number;
  change: number; // Point change in the last period
  rating: 'Excellent' | 'Good' | 'Fair' | 'Poor';
  totalCreditLimit?: number;
  totalCreditUsed?: number;
}

export interface CreditFactor {
    name: 'Payment History' | 'Credit Utilization' | 'Credit Age' | 'New Credit' | 'Credit Mix';
    status: 'Excellent' | 'Good' | 'Fair' | 'Poor';
    description: string;
}
