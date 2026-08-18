// REPOSITORY SOURCE: diplomat-bit/Citibank_Demo_Business_Inc_Demonstration- | PATH: diplomat-bit-Citibank_Demo_Business_Inc_Demonstration--ab2501d/types/models/crypto/payment-operation.ts
================================================================================

// types/models/crypto/payment-operation.ts
import type { PaymentOperationStatus } from './payment-operation-status';

export interface PaymentOperation {
  id: string;
  description: string;
  amount: number;
  status: PaymentOperationStatus;
  type: 'ACH' | 'Wire' | 'Crypto';
  date: string;
}