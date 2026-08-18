// REPOSITORY SOURCE: diplomat-bit/Citibank_Demo_Business_Inc_Demonstration- | PATH: diplomat-bit-Citibank_Demo_Business_Inc_Demonstration--ab2501d/types/models/dashboard/nexus-graph-data.ts
================================================================================

// types/models/dashboard/nexus-graph-data.ts
import type { NexusNode } from './nexus-node';
import type { NexusLink } from './nexus-link';

export interface NexusGraphData {
    nodes: NexusNode[];
    links: NexusLink[];
}