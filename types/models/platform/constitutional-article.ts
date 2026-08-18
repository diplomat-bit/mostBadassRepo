// REPOSITORY SOURCE: diplomat-bit/Citibank_Demo_Business_Inc_Demonstration- | PATH: diplomat-bit-Citibank_Demo_Business_Inc_Demonstration--ab2501d/types/models/platform/constitutional-article.ts
================================================================================

// types/models/platform/constitutional-article.ts
import React from 'react';

export interface ConstitutionalArticle {
    id: number;
    romanNumeral: string;
    title: string;
    content: React.ReactNode; 
    iconName: string;
}