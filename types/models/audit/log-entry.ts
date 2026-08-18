// REPOSITORY SOURCE: diplomat-bit/Citibank_Demo_Business_Inc_Demonstration- | PATH: diplomat-bit-Citibank_Demo_Business_Inc_Demonstration--ab2501d/types/models/audit/log-entry.ts
================================================================================

// types/models/audit/log-entry.ts
export interface LogEntry {
    timestamp: string;
    userId: string;
    action: string;
    details: Record<string, any>;
}
