// REPOSITORY SOURCE: diplomat-bit/Citibank_Demo_Business_Inc_Demonstration- | PATH: diplomat-bit-Citibank_Demo_Business_Inc_Demonstration--ab2501d/types/models/dashboard/nexus-node.ts
================================================================================

// types/models/dashboard/nexus-node.ts
export interface NexusNode {
    id: string;
    label: string;
    type: string; // e.g., 'Transaction', 'Goal', 'Anomaly'
    value: number; // For sizing the node
    color: string;
}