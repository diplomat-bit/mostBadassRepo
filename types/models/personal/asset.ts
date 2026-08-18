// REPOSITORY SOURCE: diplomat-bit/Citibank_Demo_Business_Inc_Demonstration- | PATH: diplomat-bit-Citibank_Demo_Business_Inc_Demonstration--ab2501d/types/models/personal/asset.ts
================================================================================

// types/models/personal/asset.ts
export interface Asset {
  name: string;
  value: number;
  color: string;
  performanceYTD?: number;
  esgRating?: number;
  description?: string;
}