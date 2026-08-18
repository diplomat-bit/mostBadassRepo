// REPOSITORY SOURCE: diplomat-bit/Citibank_Demo_Business_Inc_Demonstration- | PATH: diplomat-bit-Citibank_Demo_Business_Inc_Demonstration--ab2501d/types/models/corporate/access-log.ts
================================================================================

// types/models/corporate/access-log.ts
export interface AccessLog {
    id: string;
    user: string;
    ip: string;
    location: string;
    timestamp: string;
    status: 'Success' | 'Failed';
    riskLevel: 'Low' | 'Medium' | 'High';
}