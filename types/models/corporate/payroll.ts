// REPOSITORY SOURCE: diplomat-bit/Citibank_Demo_Business_Inc_Demonstration- | PATH: diplomat-bit-Citibank_Demo_Business_Inc_Demonstration--ab2501d/types/models/corporate/payroll.ts
================================================================================

// types/models/corporate/payroll.ts

export type PayRunStatus = 'Pending' | 'Processing' | 'Paid' | 'Failed';

export interface PayRun {
    id: string;
    periodStart: string; // YYYY-MM-DD
    periodEnd: string; // YYYY-MM-DD
    payDate: string; // YYYY-MM-DD
    totalAmount: number;
    employeeCount: number;
    status: PayRunStatus;
}