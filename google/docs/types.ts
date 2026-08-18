// REPOSITORY SOURCE: diplomat-bit/Citibank_Demo_Business_Inc_Demonstration- | PATH: diplomat-bit-Citibank_Demo_Business_Inc_Demonstration--ab2501d/google/docs/types.ts
================================================================================

// google/docs/types.ts
// The Grammar of the Word. Defines the structure of a document.

export interface Document {
    id: string;
    title: string;
    content: string; // Could be a more complex format like Delta
    lastModified: string;
}
