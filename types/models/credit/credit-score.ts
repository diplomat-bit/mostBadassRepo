// REPOSITORY SOURCE: diplomat-bit/Citibank_Demo_Business_Inc_Demonstration- | PATH: diplomat-bit-Citibank_Demo_Business_Inc_Demonstration--ab2501d/types/models/credit/credit-score.ts
================================================================================

// types/models/credit/credit-score.ts
export interface CreditScore {
  score: number;
  change: number; // Point change in the last period
  rating: 'Excellent' | 'Good' | 'Fair' | 'Poor';
  totalCreditLimit?: number;
  totalCreditUsed?: number;
}