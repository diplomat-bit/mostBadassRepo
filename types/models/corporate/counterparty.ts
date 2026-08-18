// REPOSITORY SOURCE: diplomat-bit/Citibank_Demo_Business_Inc_Demonstration- | PATH: diplomat-bit-Citibank_Demo_Business_Inc_Demonstration--ab2501d/types/models/corporate/counterparty.ts
================================================================================

// types/models/corporate/counterparty.ts
export interface Counterparty {
    id: string;
    name: string;
    email: string;
    status: 'Verified' | 'Pending';
    createdDate: string;
}