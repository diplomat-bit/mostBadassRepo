// REPOSITORY SOURCE: diplomat-bit/Citibank_Demo_Business_Inc_Demonstration- | PATH: diplomat-bit-Citibank_Demo_Business_Inc_Demonstration--ab2501d/types/models/crypto/crypto-asset.ts
================================================================================

// types/models/crypto/crypto-asset.ts
export interface CryptoAsset {
  ticker: string;
  name: string;
  value: number; // Total value in USD
  amount: number; // Amount of the asset owned
  color: string;
}