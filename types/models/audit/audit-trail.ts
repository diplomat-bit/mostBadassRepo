// REPOSITORY SOURCE: diplomat-bit/Citibank_Demo_Business_Inc_Demonstration- | PATH: diplomat-bit-Citibank_Demo_Business_Inc_Demonstration--ab2501d/types/models/audit/audit-trail.ts
================================================================================

// types/models/audit/audit-trail.ts
import type { LogEntry } from './log-entry';

export interface AuditTrail {
    id: string;
    entityId: string;
    entityType: string;
    logs: LogEntry[];
}
