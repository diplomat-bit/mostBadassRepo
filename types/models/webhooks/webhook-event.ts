// REPOSITORY SOURCE: diplomat-bit/Citibank_Demo_Business_Inc_Demonstration- | PATH: diplomat-bit-Citibank_Demo_Business_Inc_Demonstration--ab2501d/types/models/webhooks/webhook-event.ts
================================================================================

// types/models/webhooks/webhook-event.ts
export interface WebhookEvent {
    id: string;
    topic: string;
    payload: Record<string, any>;
    createdAt: string;
}
