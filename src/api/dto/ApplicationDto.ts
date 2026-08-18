// REPOSITORY SOURCE: diplomat-bit/jamesburvelocallaghaniiiand | PATH: diplomat-bit-jamesburvelocallaghaniiiand-9414e97/src/api/dto/ApplicationDto.ts
================================================================================

export interface ApplicationDto {
    id: string;
    displayName: string;
    appId: string;
    createdDateTime: string;
    applicationType: string;
    accountEnabled: boolean;
    applicationVisibility: 'Visible' | 'Hidden';
    assignmentRequired: boolean;
    isAppProxy: boolean;
}