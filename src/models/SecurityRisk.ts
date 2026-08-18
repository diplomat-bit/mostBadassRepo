// REPOSITORY SOURCE: diplomat-bit/jamesburvelocallaghaniiiand | PATH: diplomat-bit-jamesburvelocallaghaniiiand-9414e97/src/models/SecurityRisk.ts
================================================================================

```typescript
export interface SecurityRisk {
    id: string;
    displayName: string;
    appId: string;
    createdDateTime: string;
    applicationType: string;
    accountEnabled: boolean;
    applicationVisibility: string;
    assignmentRequired: boolean;
    isAppProxy: boolean;
}

export enum AlertLevel {
    High = 'High',
    Medium = 'Medium',
    Low = 'Low',
    Informational = 'Informational'
}
```