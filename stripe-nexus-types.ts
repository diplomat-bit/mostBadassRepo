// REPOSITORY SOURCE: diplomat-bit/Fuckyou | PATH: diplomat-bit-Fuckyou-70f83c5/stripe-nexus-types.ts
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
      