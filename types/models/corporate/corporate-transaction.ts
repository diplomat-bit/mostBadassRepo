// REPOSITORY SOURCE: diplomat-bit/Citibank_Demo_Business_Inc_Demonstration- | PATH: diplomat-bit-Citibank_Demo_Business_Inc_Demonstration--ab2501d/types/models/corporate/corporate-transaction.ts
================================================================================

// types/models/corporate/corporate-transaction.ts
export interface CorporateTransaction {
    id: string;
    cardId: string;
    holderName: string;
    merchant: string;
    amount: number;
    status: 'Pending' | 'Approved';
    timestamp: string;
}