// REPOSITORY SOURCE: diplomat-bit/my-appaibanking | PATH: diplomat-bit-my-appaibanking-43962ef/src/lib/stripe-nexus-types.ts
================================================================================


export interface Charge {
    id: string;
    amount: number;
    amount_refunded: number;
    currency: string;
    status: string;
    refunded: boolean;
    payment_intent: string;
    description?: string;
}
      