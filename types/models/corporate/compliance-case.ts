// REPOSITORY SOURCE: diplomat-bit/Citibank_Demo_Business_Inc_Demonstration- | PATH: diplomat-bit-Citibank_Demo_Business_Inc_Demonstration--ab2501d/types/models/corporate/compliance-case.ts
================================================================================

// types/models/corporate/compliance-case.ts
export interface ComplianceCase {
    id: string;
    reason: string;
    entityType: 'PaymentOrder' | 'Counterparty';
    entityId: string;
    status: 'open' | 'closed';
    openedDate: string;
}