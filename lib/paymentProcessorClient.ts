// REPOSITORY SOURCE: diplomat-bit/jamesburvelocallaghaniiiand | PATH: diplomat-bit-jamesburvelocallaghaniiiand-9414e97/lib/paymentProcessorClient.ts
================================================================================

import { WiseAPIClient } from './wise-api-client';

export class PaymentProcessorClient {
  constructor(private wiseApiClient: WiseAPIClient) {}

  async processPayment(amount: number, currency: string, recipient: string, transactionId: string) {
    try {
      const response = await this.wiseApiClient.processPayment(amount, currency, recipient, transactionId);
      console.log(`Payment processed successfully: ${response}`);
      return response;
    } catch (error) {
      console.error(`Payment processing failed: ${error}`);
      throw error;
    }
  }
}