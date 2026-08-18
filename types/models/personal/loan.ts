// REPOSITORY SOURCE: diplomat-bit/Citibank_Demo_Business_Inc_Demonstration- | PATH: diplomat-bit-Citibank_Demo_Business_Inc_Demonstration--ab2501d/types/models/personal/loan.ts
================================================================================

// types/models/personal/loan.ts
export interface Loan {
  id: string;
  name: string;
  outstandingBalance: number;
  monthlyPayment: number;
  nextPaymentDate: string;
}