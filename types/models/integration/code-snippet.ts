// REPOSITORY SOURCE: diplomat-bit/Citibank_Demo_Business_Inc_Demonstration- | PATH: diplomat-bit-Citibank_Demo_Business_Inc_Demonstration--ab2501d/types/models/integration/code-snippet.ts
================================================================================

// types/models/integration/code-snippet.ts
export type Language = 'typescript' | 'python' | 'go';

export interface CodeSnippet {
    language: Language;
    label: string;
    code: string;
}