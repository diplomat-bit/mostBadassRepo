// REPOSITORY SOURCE: diplomat-bit/Citibank_Demo_Business_Inc_Demonstration- | PATH: diplomat-bit-Citibank_Demo_Business_Inc_Demonstration--ab2501d/types/models/system/notification.ts
================================================================================

// types/models/system/notification.ts
import type { View } from '../ui/view';

export interface Notification {
    id: string;
    message: string;
    timestamp: string;
    read: boolean;
    view?: View;
}