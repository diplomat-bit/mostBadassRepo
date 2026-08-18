// REPOSITORY SOURCE: diplomat-bit/Citibank_Demo_Business_Inc_Demonstration- | PATH: diplomat-bit-Citibank_Demo_Business_Inc_Demonstration--ab2501d/types/models/personal/portfolio-asset.ts
================================================================================

// types/models/personal/portfolio-asset.ts
export interface PortfolioAsset {
  id: string;
  name: string;
  ticker?: string;
  assetClass: 'Equities' | 'Fixed Income' | 'Alternatives' | 'Digital Assets' | 'Cash & Equivalents';
  region: 'North America' | 'Europe' | 'Asia' | 'Emerging Markets' | 'Global';
  value: number; // in USD
  change24h: number; // percentage change
}