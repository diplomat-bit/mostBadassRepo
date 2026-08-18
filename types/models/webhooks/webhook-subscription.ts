// REPOSITORY SOURCE: diplomat-bit/Citibank_Demo_Business_Inc_Demonstration- | PATH: diplomat-bit-Citibank_Demo_Business_Inc_Demonstration--ab2501d/types/models/webhooks/webhook-subscription.ts
================================================================================

// types/models/webhooks/webhook-subscription.ts
export interface WebhookSubscription {
    id: string;
    targetUrl: string;
    topics: string[];
    isActive: boolean;
}
