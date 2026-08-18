// REPOSITORY SOURCE: diplomat-bit/Citibank_Demo_Business_Inc_Demonstration- | PATH: diplomat-bit-Citibank_Demo_Business_Inc_Demonstration--ab2501d/types/models/integration/integration-platform.ts
================================================================================

// types/models/integration/integration-platform.ts
import React from 'react';
import type { CodeSnippet } from './code-snippet';

export interface IntegrationPlatform {
    name: string;
    logo: React.ReactElement;
    description: string;
    snippets: CodeSnippet[];
}