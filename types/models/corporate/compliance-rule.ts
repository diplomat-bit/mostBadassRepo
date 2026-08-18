// REPOSITORY SOURCE: diplomat-bit/Citibank_Demo_Business_Inc_Demonstration- | PATH: diplomat-bit-Citibank_Demo_Business_Inc_Demonstration--ab2501d/types/models/corporate/compliance-rule.ts
================================================================================

// types/models/corporate/compliance-rule.ts
export interface ComplianceRule {
    id: string;
    name: string;
    description: string;
    action: 'flag_for_review' | 'block';
    active: boolean;
}
