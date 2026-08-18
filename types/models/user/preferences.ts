// REPOSITORY SOURCE: diplomat-bit/Citibank_Demo_Business_Inc_Demonstration- | PATH: diplomat-bit-Citibank_Demo_Business_Inc_Demonstration--ab2501d/types/models/user/preferences.ts
================================================================================

// types/models/user/preferences.ts
export interface UserPreferences {
    theme: 'dark' | 'light';
    notifications: {
        email: boolean;
        push: boolean;
    };
}
