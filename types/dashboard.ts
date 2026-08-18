// REPOSITORY SOURCE: diplomat-bit/Citibank_Demo_Business_Inc_Demonstration- | PATH: diplomat-bit-Citibank_Demo_Business_Inc_Demonstration--ab2501d/types/dashboard.ts
================================================================================

// types/dashboard.ts
export interface DynamicKpi {
  id: string;
  title: string;
  description: string;
}

// Types for the 27th Module: The Nexus
export interface NexusNode {
    id: string;
    label: string;
    type: string; // e.g., 'Transaction', 'Goal', 'Anomaly'
    value: number; // For sizing the node
    color: string;
}

export interface NexusLink {
    source: string;
    target: string;
    relationship: string;
}

export interface NexusGraphData {
    nodes: NexusNode[];
    links: NexusLink[];
}