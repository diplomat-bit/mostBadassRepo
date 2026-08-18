// REPOSITORY SOURCE: diplomat-bit/Citibank_Demo_Business_Inc_Demonstration- | PATH: diplomat-bit-Citibank_Demo_Business_Inc_Demonstration--ab2501d/integrations/connectors/stripe/adapter.ts
================================================================================

```typescript
import {
  Stripe,
  PaymentIntent,
  Charge,
  Refund,
  Customer,
  Product,
  Price,
  Order,
  OrderReturn,
  Invoice,
  Subscription,
  BalanceTransaction,
  Payout,
  Transfer,
  Dispute,
  Account,
  Coupon,
  PromotionCode,
} from 'stripe'; // Ensure this is installed: npm install stripe

// Define interfaces for normalized data
export interface NormalizedPaymentIntent {
  id: string;
  amount: number;
  currency: string;
  status: string;
  created: number; // Timestamp
  customer_id?: string | null;
  description?: string | null;
  metadata?: object | null;
}

export interface NormalizedCharge {
  id: string;
  amount: number;
  currency: string;
  status: string;
  created: number; // Timestamp
  payment_intent_id?: string | null;
  customer_id?: string | null;
  description?: string | null;
  metadata?: object | null;
}

export interface NormalizedRefund {
  id: string;
  amount: number;
  currency: string;
  created: number; // Timestamp
  charge_id: string;
  reason?: string | null;
  metadata?: object | null;
}

export interface NormalizedCustomer {
  id: string;
  email?: string | null;
  name?: string | null;
  phone?: string | null;
  created: number; // Timestamp
  metadata?: object | null;
}

export interface NormalizedProduct {
  id: string;
  name: string;
  description?: string | null;
  active: boolean;
  created: number; // Timestamp
  metadata?: object | null;
}

export interface NormalizedPrice {
  id: string;
  unit_amount: number;
  currency: string;
  product_id: string;
  recurring?: { interval: string } | null; // e.g., 'month', if subscription
  active: boolean;
  created: number; // Timestamp
  metadata?: object | null;
}

export interface NormalizedOrder {
  id: string;
  amount_total: number;
  currency: string;
  created: number; // Timestamp
  customer_id?: string | null;
  status: string;
  items: Array<{
    type: string; // 'sku' | 'product'
    parent?: string | null;  // SKU or Product ID
    quantity: number;
  }>;
  metadata?: object | null;
}

export interface NormalizedOrderReturn {
  id: string;
  order_id: string;
  amount_total: number;
  currency: string;
  created: number; // Timestamp
  items: Array<{
    type: string; // 'sku' | 'product'
    parent?: string | null;  // SKU or Product ID
    quantity: number;
  }>;
  metadata?: object | null;
}

export interface NormalizedInvoice {
  id: string;
  amount_due: number;
  currency: string;
  status: string;
  created: number; // Timestamp
  customer_id: string;
  invoice_pdf?: string | null; // URL
  hosted_invoice_url?: string | null;  // URL
  metadata?: object | null;
}

export interface NormalizedSubscription {
  id: string;
  status: string;
  created: number; // Timestamp
  current_period_start: number;
  current_period_end: number;
  customer_id: string;
  plan_id: string;  // Associated with a Price object
  metadata?: object | null;
}

export interface NormalizedBalanceTransaction {
  id: string;
  amount: number;
  currency: string;
  created: number; // Timestamp
  type: string;
  source?: string | null; // ID of the source object (e.g., charge)
  description?: string | null;
  metadata?: object | null;
}

export interface NormalizedPayout {
  id: string;
  amount: number;
  currency: string;
  status: string;
  created: number; // Timestamp
  method: string;
  description?: string | null;
  metadata?: object | null;
}

export interface NormalizedTransfer {
  id: string;
  amount: number;
  currency: string;
  created: number; // Timestamp
  destination: string; // Account ID
  description?: string | null;
  metadata?: object | null;
}

export interface NormalizedDispute {
  id: string;
  amount: number;
  currency: string;
  status: string;
  created: number; // Timestamp
  charge_id: string;
  reason: string;
  metadata?: object | null;
}


export interface NormalizedAccount {
    id: string;
    type: string; // 'express', 'standard', 'custom'
    email?: string | null;
    business_type?: string | null;
    country: string;
    capabilities?: {
        card_payments?: string | null; // 'active', 'inactive', 'pending'
        transfers?: string | null;
    } | null;
    created: number; // Timestamp
    metadata?: object | null;
}

export interface NormalizedCoupon {
  id: string;
  name?: string | null;
  percent_off?: number | null;
  amount_off?: number | null;
  currency?: string | null;
  duration: string; // 'once', 'repeating', 'forever'
  valid: boolean;
  created: number; // Timestamp
  metadata?: object | null;
}

export interface NormalizedPromotionCode {
  id: string;
  code: string;
  active: boolean;
  coupon_id: string;
  created: number; // Timestamp
  metadata?: object | null;
}


export class StripeDataAdapter {
  private stripe: Stripe;

  constructor(apiKey: string) {
    if (!apiKey) {
      throw new Error("Stripe API key is required.");
    }
    this.stripe = new Stripe(apiKey, { apiVersion: '2023-10-16' });  // Use a recent API version
  }


  // Helper function to handle null/undefined and return null
  private safeGet<T>(value: T | null | undefined, defaultValue: any = null): any {
    return value === null || value === undefined ? defaultValue : value;
  }

  // Payment Intents
  async normalizePaymentIntent(paymentIntent: PaymentIntent): Promise<NormalizedPaymentIntent> {
    return {
      id: paymentIntent.id,
      amount: this.safeGet(paymentIntent.amount),
      currency: this.safeGet(paymentIntent.currency),
      status: this.safeGet(paymentIntent.status),
      created: this.safeGet(paymentIntent.created),
      customer_id: this.safeGet(paymentIntent.customer),
      description: this.safeGet(paymentIntent.description),
      metadata: this.safeGet(paymentIntent.metadata),
    };
  }

  async getPaymentIntent(paymentIntentId: string): Promise<NormalizedPaymentIntent | null> {
    try {
      const paymentIntent = await this.stripe.paymentIntents.retrieve(paymentIntentId);
      return this.normalizePaymentIntent(paymentIntent);
    } catch (error: any) {
      // Handle potential Stripe API errors.  Log the error.
      console.error(`Error retrieving PaymentIntent ${paymentIntentId}:`, error);
      if (error.code === 'resource_missing') {
          return null;  // PaymentIntent not found
      }
      // Re-throw or handle the error appropriately for your application.
      throw error;
    }
  }


  // Charges
  async normalizeCharge(charge: Charge): Promise<NormalizedCharge> {
    return {
      id: charge.id,
      amount: this.safeGet(charge.amount),
      currency: this.safeGet(charge.currency),
      status: this.safeGet(charge.status),
      created: this.safeGet(charge.created),
      payment_intent_id: this.safeGet(charge.payment_intent),
      customer_id: this.safeGet(charge.customer),
      description: this.safeGet(charge.description),
      metadata: this.safeGet(charge.metadata),
    };
  }

  async getCharge(chargeId: string): Promise<NormalizedCharge | null> {
    try {
      const charge = await this.stripe.charges.retrieve(chargeId);
      return this.normalizeCharge(charge);
    } catch (error: any) {
      console.error(`Error retrieving Charge ${chargeId}:`, error);
      if (error.code === 'resource_missing') {
          return null; // Charge not found
      }
      throw error;
    }
  }


  // Refunds
  async normalizeRefund(refund: Refund): Promise<NormalizedRefund> {
    return {
      id: refund.id,
      amount: this.safeGet(refund.amount),
      currency: this.safeGet(refund.currency),
      created: this.safeGet(refund.created),
      charge_id: this.safeGet(refund.charge),
      reason: this.safeGet(refund.reason),
      metadata: this.safeGet(refund.metadata),
    };
  }

  async getRefund(refundId: string): Promise<NormalizedRefund | null> {
    try {
      const refund = await this.stripe.refunds.retrieve(refundId);
      return this.normalizeRefund(refund);
    } catch (error: any) {
      console.error(`Error retrieving Refund ${refundId}:`, error);
      if (error.code === 'resource_missing') {
          return null; // Refund not found
      }
      throw error;
    }
  }

  // Customers
  async normalizeCustomer(customer: Customer): Promise<NormalizedCustomer> {
    return {
      id: customer.id,
      email: this.safeGet(customer.email),
      name: this.safeGet(customer.name),
      phone: this.safeGet(customer.phone),
      created: this.safeGet(customer.created),
      metadata: this.safeGet(customer.metadata),
    };
  }

  async getCustomer(customerId: string): Promise<NormalizedCustomer | null> {
    try {
      const customer = await this.stripe.customers.retrieve(customerId);
      return this.normalizeCustomer(customer);
    } catch (error: any) {
      console.error(`Error retrieving Customer ${customerId}:`, error);
      if (error.code === 'resource_missing') {
          return null;  // Customer not found
      }
      throw error;
    }
  }


  // Products
  async normalizeProduct(product: Product): Promise<NormalizedProduct> {
    return {
      id: product.id,
      name: this.safeGet(product.name),
      description: this.safeGet(product.description),
      active: this.safeGet(product.active),
      created: this.safeGet(product.created),
      metadata: this.safeGet(product.metadata),
    };
  }

  async getProduct(productId: string): Promise<NormalizedProduct | null> {
    try {
      const product = await this.stripe.products.retrieve(productId);
      return this.normalizeProduct(product);
    } catch (error: any) {
      console.error(`Error retrieving Product ${productId}:`, error);
      if (error.code === 'resource_missing') {
        return null;  // Product not found
      }
      throw error;
    }
  }

  // Prices
  async normalizePrice(price: Price): Promise<NormalizedPrice> {
    return {
      id: price.id,
      unit_amount: this.safeGet(price.unit_amount),
      currency: this.safeGet(price.currency),
      product_id: this.safeGet(price.product),
      recurring: price.recurring ? { interval: this.safeGet(price.recurring.interval) } : null,
      active: this.safeGet(price.active),
      created: this.safeGet(price.created),
      metadata: this.safeGet(price.metadata),
    };
  }

  async getPrice(priceId: string): Promise<NormalizedPrice | null> {
    try {
      const price = await this.stripe.prices.retrieve(priceId);
      return this.normalizePrice(price);
    } catch (error: any) {
      console.error(`Error retrieving Price ${priceId}:`, error);
      if (error.code === 'resource_missing') {
          return null; // Price not found
      }
      throw error;
    }
  }

    // Orders (Stripe Orders API is deprecated, but normalizing for legacy support)
    async normalizeOrder(order: Order): Promise<NormalizedOrder> {
      return {
          id: order.id,
          amount_total: this.safeGet(order.amount_total),
          currency: this.safeGet(order.currency),
          created: this.safeGet(order.created),
          customer_id: this.safeGet(order.customer),
          status: this.safeGet(order.status),
          items: order.items.map(item => ({
              type: this.safeGet(item.type),
              parent: item.type === 'sku' ? this.safeGet(item.parent) : this.safeGet(item.product), // Corrected property
              quantity: this.safeGet(item.quantity),
          })),
          metadata: this.safeGet(order.metadata),
      };
    }

    async getOrder(orderId: string): Promise<NormalizedOrder | null> {
      try {
          const order = await this.stripe.orders.retrieve(orderId);
          return this.normalizeOrder(order);
      } catch (error: any) {
          console.error(`Error retrieving Order ${orderId}:`, error);
          if (error.code === 'resource_missing') {
              return null; // Order not found
          }
          throw error;
      }
    }


    // Order Returns
    async normalizeOrderReturn(orderReturn: OrderReturn): Promise<NormalizedOrderReturn> {
      return {
          id: orderReturn.id,
          order_id: this.safeGet(orderReturn.order),
          amount_total: this.safeGet(orderReturn.amount_total),
          currency: this.safeGet(orderReturn.currency),
          created: this.safeGet(orderReturn.created),
          items: orderReturn.items.map(item => ({
              type: this.safeGet(item.type),
              parent: this.safeGet(item.parent), // Corrected property
              quantity: this.safeGet(item.quantity),
          })),
          metadata: this.safeGet(orderReturn.metadata),
      };
    }

    async getOrderReturn(orderReturnId: string): Promise<NormalizedOrderReturn | null> {
      try {
          const orderReturn = await this.stripe.orderReturns.retrieve(orderReturnId);
          return this.normalizeOrderReturn(orderReturn);
      } catch (error: any) {
          console.error(`Error retrieving OrderReturn ${orderReturnId}:`, error);
          if (error.code === 'resource_missing') {
              return null; // OrderReturn not found
          }
          throw error;
      }
    }


  // Invoices
  async normalizeInvoice(invoice: Invoice): Promise<NormalizedInvoice> {
    return {
      id: invoice.id,
      amount_due: this.safeGet(invoice.amount_due),
      currency: this.safeGet(invoice.currency),
      status: this.safeGet(invoice.status),
      created: this.safeGet(invoice.created),
      customer_id: this.safeGet(invoice.customer),
      invoice_pdf: this.safeGet(invoice.invoice_pdf),
      hosted_invoice_url: this.safeGet(invoice.hosted_invoice_url),
      metadata: this.safeGet(invoice.metadata),
    };
  }

  async getInvoice(invoiceId: string): Promise<NormalizedInvoice | null> {
    try {
      const invoice = await this.stripe.invoices.retrieve(invoiceId);
      return this.normalizeInvoice(invoice);
    } catch (error: any) {
      console.error(`Error retrieving Invoice ${invoiceId}:`, error);
      if (error.code === 'resource_missing') {
        return null;  // Invoice not found
      }
      throw error;
    }
  }


  // Subscriptions
  async normalizeSubscription(subscription: Subscription): Promise<NormalizedSubscription> {
    return {
      id: subscription.id,
      status: this.safeGet(subscription.status),
      created: this.safeGet(subscription.created),
      current_period_start: this.safeGet(subscription.current_period_start),
      current_period_end: this.safeGet(subscription.current_period_end),
      customer_id: this.safeGet(subscription.customer),
      plan_id: this.safeGet(subscription.plan.id),  // Assuming plan is populated
      metadata: this.safeGet(subscription.metadata),
    };
  }

  async getSubscription(subscriptionId: string): Promise<NormalizedSubscription | null> {
    try {
      const subscription = await this.stripe.subscriptions.retrieve(subscriptionId);
      return this.normalizeSubscription(subscription);
    } catch (error: any) {
      console.error(`Error retrieving Subscription ${subscriptionId}:`, error);
      if (error.code === 'resource_missing') {
        return null; // Subscription not found
      }
      throw error;
    }
  }


  // Balance Transactions
  async normalizeBalanceTransaction(balanceTransaction: BalanceTransaction): Promise<NormalizedBalanceTransaction> {
    return {
      id: balanceTransaction.id,
      amount: this.safeGet(balanceTransaction.amount),
      currency: this.safeGet(balanceTransaction.currency),
      created: this.safeGet(balanceTransaction.created),
      type: this.safeGet(balanceTransaction.type),
      source: this.safeGet(balanceTransaction.source),
      description: this.safeGet(balanceTransaction.description),
      metadata: this.safeGet(balanceTransaction.metadata),
    };
  }


  async getBalanceTransaction(balanceTransactionId: string): Promise<NormalizedBalanceTransaction | null> {
    try {
        const balanceTransaction = await this.stripe.balanceTransactions.retrieve(balanceTransactionId);
        return this.normalizeBalanceTransaction(balanceTransaction);
    } catch (error: any) {
        console.error(`Error retrieving BalanceTransaction ${balanceTransactionId}:`, error);
        if (error.code === 'resource_missing') {
            return null; // BalanceTransaction not found
        }
        throw error;
    }
  }


  // Payouts
  async normalizePayout(payout: Payout): Promise<NormalizedPayout> {
    return {
      id: payout.id,
      amount: this.safeGet(payout.amount),
      currency: this.safeGet(payout.currency),
      status: this.safeGet(payout.status),
      created: this.safeGet(payout.created),
      method: this.safeGet(payout.method),
      description: this.safeGet(payout.description),
      metadata: this.safeGet(payout.metadata),
    };
  }

  async getPayout(payoutId: string): Promise<NormalizedPayout | null> {
    try {
      const payout = await this.stripe.payouts.retrieve(payoutId);
      return this.normalizePayout(payout);
    } catch (error: any) {
      console.error(`Error retrieving Payout ${payoutId}:`, error);
      if (error.code === 'resource_missing') {
        return null;  // Payout not found
      }
      throw error;
    }
  }


  // Transfers
  async normalizeTransfer(transfer: Transfer): Promise<NormalizedTransfer> {
    return {
      id: transfer.id,
      amount: this.safeGet(transfer.amount),
      currency: this.safeGet(transfer.currency),
      created: this.safeGet(transfer.created),
      destination: this.safeGet(transfer.destination), // Account ID
      description: this.safeGet(transfer.description),
      metadata: this.safeGet(transfer.metadata),
    };
  }

  async getTransfer(transferId: string): Promise<NormalizedTransfer | null> {
    try {
      const transfer = await this.stripe.transfers.retrieve(transferId);
      return this.normalizeTransfer(transfer);
    } catch (error: any) {
      console.error(`Error retrieving Transfer ${transferId}:`, error);
      if (error.code === 'resource_missing') {
        return null;  // Transfer not found
      }
      throw error;
    }
  }


  // Disputes
  async normalizeDispute(dispute: Dispute): Promise<NormalizedDispute> {
    return {
      id: dispute.id,
      amount: this.safeGet(dispute.amount),
      currency: this.safeGet(dispute.currency),
      status: this.safeGet(dispute.status),
      created: this.safeGet(dispute.created),
      charge_id: this.safeGet(dispute.charge),
      reason: this.safeGet(dispute.reason),
      metadata: this.safeGet(dispute.metadata),
    };
  }

  async getDispute(disputeId: string): Promise<NormalizedDispute | null> {
    try {
      const dispute = await this.stripe.disputes.retrieve(disputeId);
      return this.normalizeDispute(dispute);
    } catch (error: any) {
      console.error(`Error retrieving Dispute ${disputeId}:`, error);
      if (error.code === 'resource_missing') {
        return null;  // Dispute not found
      }
      throw error;
    }
  }


  // Accounts (Connect accounts)
  async normalizeAccount(account: Account): Promise<NormalizedAccount> {
    return {
      id: account.id,
      type: this.safeGet(account.type),
      email: this.safeGet(account.email),
      business_type: this.safeGet(account.business_type),
      country: this.safeGet(account.country),
      capabilities: this.safeGet(account.capabilities),
      created: this.safeGet(account.created),
      metadata: this.safeGet(account.metadata),
    };
  }

  async getAccount(accountId: string): Promise<NormalizedAccount | null> {
    try {
      const account = await this.stripe.accounts.retrieve(accountId);
      return this.normalizeAccount(account);
    } catch (error: any) {
      console.error(`Error retrieving Account ${accountId}:`, error);
      if (error.code === 'resource_missing') {
          return null; // Account not found
      }
      throw error;
    }
  }


  // Coupons
  async normalizeCoupon(coupon: Coupon): Promise<NormalizedCoupon> {
    return {
      id: coupon.id,
      name: this.safeGet(coupon.name),
      percent_off: this.safeGet(coupon.percent_off),
      amount_off: this.safeGet(coupon.amount_off),
      currency: this.safeGet(coupon.currency),
      duration: this.safeGet(coupon.duration),
      valid: this.safeGet(coupon.valid),
      created: this.safeGet(coupon.created),
      metadata: this.safeGet(coupon.metadata),
    };
  }

  async getCoupon(couponId: string): Promise<NormalizedCoupon | null> {
    try {
      const coupon = await this.stripe.coupons.retrieve(couponId);
      return this.normalizeCoupon(coupon);
    } catch (error: any) {
      console.error(`Error retrieving Coupon ${couponId}:`, error);
      if (error.code === 'resource_missing') {
          return null;  // Coupon not found
      }
      throw error;
    }
  }


  // Promotion Codes
  async normalizePromotionCode(promotionCode: PromotionCode): Promise<NormalizedPromotionCode> {
    return {
      id: promotionCode.id,
      code: this.safeGet(promotionCode.code),
      active: this.safeGet(promotionCode.active),
      coupon_id: this.safeGet(promotionCode.coupon),
      created: this.safeGet(promotionCode.created),
      metadata: this.safeGet(promotionCode.metadata),
    };
  }


  async getPromotionCode(promotionCodeId: string): Promise<NormalizedPromotionCode | null> {
    try {
        const promotionCode = await this.stripe.promotionCodes.retrieve(promotionCodeId);
        return this.normalizePromotionCode(promotionCode);
    } catch (error: any) {
        console.error(`Error retrieving PromotionCode ${promotionCodeId}:`, error);
        if (error.code === 'resource_missing') {
            return null; // PromotionCode not found
        }
        throw error;
    }
  }

  // ---  Batch Operations and Data Fetching (Examples) ---

  // Example: Get a list of recent charges.  Add pagination as needed.
  async getRecentCharges(limit: number = 10): Promise<NormalizedCharge[]> {
    try {
      const charges = await this.stripe.charges.list({ limit });
      return Promise.all(charges.data.map(charge => this.normalizeCharge(charge)));
    } catch (error: any) {
      console.error("Error listing charges:", error);
      throw error;  // Or handle appropriately.
    }
  }

  // Example: Get a list of active products.  Add pagination as needed.
  async getActiveProducts(limit: number = 10): Promise<NormalizedProduct[]> {
    try {
      const products = await this.stripe.products.list({ active: true, limit });
      return Promise.all(products.data.map(product => this.normalizeProduct(product)));
    } catch (error: any) {
      console.error("Error listing active products:", error);
      throw error;
    }
  }

  // Example:  Fetch all invoices for a customer (using pagination)
  async getAllInvoicesForCustomer(customerId: string): Promise<NormalizedInvoice[]> {
      const allInvoices: NormalizedInvoice[] = [];
      let hasMore = true;
      let startingAfter: string | null = null;

      try {
          while (hasMore) {
              const invoices = await this.stripe.invoices.list(
                  {
                      customer: customerId,
                      limit: 100, // Max allowed
                      ...(startingAfter ? { starting_after: startingAfter } : {}),
                  }
              );

              const normalizedInvoices = await Promise.all(invoices.data.map(invoice => this.normalizeInvoice(invoice)));
              allInvoices.push(...normalizedInvoices);

              hasMore = invoices.has_more;
              startingAfter = invoices.data.length > 0 ? invoices.data[invoices.data.length - 1].id : null;
          }
      } catch (error: any) {
          console.error(`Error fetching invoices for customer ${customerId}:`, error);
          throw error;
      }

      return allInvoices;
  }
}
```