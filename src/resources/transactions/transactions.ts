// REPOSITORY SOURCE: diplomat-bit/garbage-typescript | PATH: diplomat-bit-garbage-typescript-95791a2/src/resources/transactions/transactions.ts
================================================================================

// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../core/resource';
import * as InsightsAPI from './insights';
import { InsightGetCashFlowPredictionResponse, InsightGetSpendingTrendsResponse, Insights } from './insights';
import * as RecurringAPI from './recurring';
import { Recurring, RecurringCreateParams, RecurringListResponse } from './recurring';
import { APIPromise } from '../../core/api-promise';
import { buildHeaders } from '../../internal/headers';
import { RequestOptions } from '../../internal/request-options';
import { path } from '../../internal/utils/path';

export class Transactions extends APIResource {
  recurring: RecurringAPI.Recurring = new RecurringAPI.Recurring(this._client);
  insights: InsightsAPI.Insights = new InsightsAPI.Insights(this._client);

  /**
   * Get Transaction Deep Metadata
   *
   * @example
   * ```ts
   * const transaction = await client.transactions.retrieve(
   *   'string',
   * );
   * ```
   */
  retrieve(transactionID: string, options?: RequestOptions): APIPromise<TransactionRetrieveResponse> {
    return this._client.get(path`/transactions/${transactionID}`, options);
  }

  /**
   * Global Transaction Search & Filter
   *
   * @example
   * ```ts
   * const transactions = await client.transactions.list();
   * ```
   */
  list(
    query: TransactionListParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<TransactionListResponse> {
    return this._client.get('/transactions', { query, ...options });
  }

  /**
   * Attach Manual Notes to Transaction
   *
   * @example
   * ```ts
   * await client.transactions.addNotes('string', {
   *   notes: 'string',
   * });
   * ```
   */
  addNotes(
    transactionID: string,
    body: TransactionAddNotesParams,
    options?: RequestOptions,
  ): APIPromise<void> {
    return this._client.put(path`/transactions/${transactionID}/notes`, {
      body,
      ...options,
      headers: buildHeaders([{ Accept: '*/*' }, options?.headers]),
    });
  }

  /**
   * Override AI Categorization
   *
   * @example
   * ```ts
   * const response = await client.transactions.categorize(
   *   'string',
   *   { category: 'string' },
   * );
   * ```
   */
  categorize(
    transactionID: string,
    body: TransactionCategorizeParams,
    options?: RequestOptions,
  ): APIPromise<TransactionCategorizeResponse> {
    return this._client.put(path`/transactions/${transactionID}/categorize`, { body, ...options });
  }

  /**
   * Initiate Transaction Dispute
   *
   * @example
   * ```ts
   * await client.transactions.initiateDispute('string', {
   *   reason: 'service_not_rendered',
   *   evidenceFiles: ['string', 'string'],
   * });
   * ```
   */
  initiateDispute(
    transactionID: string,
    body: TransactionInitiateDisputeParams,
    options?: RequestOptions,
  ): APIPromise<void> {
    return this._client.post(path`/transactions/${transactionID}/dispute`, {
      body,
      ...options,
      headers: buildHeaders([{ Accept: '*/*' }, options?.headers]),
    });
  }

  /**
   * Split Transaction Across Multiple Categories
   *
   * @example
   * ```ts
   * await client.transactions.split('string', {
   *   splits: [
   *     { category: 'string', amount: 9448.960685756352 },
   *     { category: 'string', amount: 2797.3194260200084 },
   *   ],
   * });
   * ```
   */
  split(transactionID: string, body: TransactionSplitParams, options?: RequestOptions): APIPromise<void> {
    return this._client.post(path`/transactions/${transactionID}/split`, {
      body,
      ...options,
      headers: buildHeaders([{ Accept: '*/*' }, options?.headers]),
    });
  }
}

export interface TransactionRetrieveResponse {
  id: string;

  amount: number;

  currency: string;

  date: string;

  description: string;

  category?: string;

  notes?: string;
}

export interface TransactionListResponse {
  value?: string;
}

export interface TransactionCategorizeResponse {
  id: string;

  amount: number;

  currency: string;

  date: string;

  description: string;

  category?: string;

  notes?: string;
}

export interface TransactionListParams {
  limit?: number;

  maxAmount?: number;

  minAmount?: number;

  offset?: number;

  type?: string;
}

export interface TransactionAddNotesParams {
  notes: string;
}

export interface TransactionCategorizeParams {
  category: string;

  applyToFuture?: boolean;
}

export interface TransactionInitiateDisputeParams {
  reason: 'fraudulent' | 'duplicate' | 'incorrect_amount' | 'service_not_rendered';

  /**
   * URIs to evidence
   */
  evidenceFiles?: Array<string>;
}

export interface TransactionSplitParams {
  splits: Array<TransactionSplitParams.Split>;
}

export namespace TransactionSplitParams {
  export interface Split {
    amount?: number;

    category?: string;
  }
}

Transactions.Recurring = Recurring;
Transactions.Insights = Insights;

export declare namespace Transactions {
  export {
    type TransactionRetrieveResponse as TransactionRetrieveResponse,
    type TransactionListResponse as TransactionListResponse,
    type TransactionCategorizeResponse as TransactionCategorizeResponse,
    type TransactionListParams as TransactionListParams,
    type TransactionAddNotesParams as TransactionAddNotesParams,
    type TransactionCategorizeParams as TransactionCategorizeParams,
    type TransactionInitiateDisputeParams as TransactionInitiateDisputeParams,
    type TransactionSplitParams as TransactionSplitParams,
  };

  export {
    Recurring as Recurring,
    type RecurringListResponse as RecurringListResponse,
    type RecurringCreateParams as RecurringCreateParams,
  };

  export {
    Insights as Insights,
    type InsightGetCashFlowPredictionResponse as InsightGetCashFlowPredictionResponse,
    type InsightGetSpendingTrendsResponse as InsightGetSpendingTrendsResponse,
  };
}


================================================================================
// APPENDED FROM REPO: diplomat-bit/jocall3-node | ORIGINAL PATH: diplomat-bit-jocall3-node-fae6abf/src/resources/transactions/transactions.ts
================================================================================

// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../resource';
import { isRequestOptions } from '../../core';
import * as Core from '../../core';
import * as InsightsAPI from './insights';
import { InsightGetTrendsResponse, Insights } from './insights';
import * as RecurringAPI from './recurring';
import { Recurring, RecurringListParams, RecurringListResponse } from './recurring';

export class Transactions extends APIResource {
  recurring: RecurringAPI.Recurring = new RecurringAPI.Recurring(this._client);
  insights: InsightsAPI.Insights = new InsightsAPI.Insights(this._client);

  /**
   * Retrieves granular information for a single transaction by its unique ID,
   * including AI categorization confidence, merchant details, and associated carbon
   * footprint.
   *
   * @example
   * ```ts
   * const transaction = await client.transactions.retrieve(
   *   'txn_quantum-2024-07-21-A7B8C9',
   * );
   * ```
   */
  retrieve(
    transactionId: string,
    options?: Core.RequestOptions,
  ): Core.APIPromise<TransactionRetrieveResponse> {
    return this._client.get(`/transactions/${transactionId}`, options);
  }

  /**
   * Retrieves a paginated list of the user's transactions, with extensive options
   * for filtering by type, category, date range, amount, and intelligent AI-driven
   * sorting and search capabilities.
   *
   * @example
   * ```ts
   * const transactions = await client.transactions.list();
   * ```
   */
  list(query?: TransactionListParams, options?: Core.RequestOptions): Core.APIPromise<unknown>;
  list(options?: Core.RequestOptions): Core.APIPromise<unknown>;
  list(
    query: TransactionListParams | Core.RequestOptions = {},
    options?: Core.RequestOptions,
  ): Core.APIPromise<unknown> {
    if (isRequestOptions(query)) {
      return this.list({}, query);
    }
    return this._client.get('/transactions', { query, ...options });
  }

  /**
   * Allows the user to override or refine the AI's categorization for a transaction,
   * improving future AI accuracy and personal financial reporting.
   *
   * @example
   * ```ts
   * const response = await client.transactions.categorize(
   *   'txn_quantum-2024-07-21-A7B8C9',
   * );
   * ```
   */
  categorize(
    transactionId: string,
    body: TransactionCategorizeParams,
    options?: Core.RequestOptions,
  ): Core.APIPromise<TransactionCategorizeResponse> {
    return this._client.put(`/transactions/${transactionId}/categorize`, { body, ...options });
  }
}

export interface TransactionRetrieveResponse {
  /**
   * Geographic location details for a transaction.
   */
  location?: unknown;

  /**
   * Detailed information about a merchant associated with a transaction.
   */
  merchantDetails?: TransactionRetrieveResponse.MerchantDetails;
}

export namespace TransactionRetrieveResponse {
  /**
   * Detailed information about a merchant associated with a transaction.
   */
  export interface MerchantDetails {
    address?: unknown;
  }
}

export type TransactionListResponse = unknown;

export interface TransactionCategorizeResponse {
  /**
   * Geographic location details for a transaction.
   */
  location?: unknown;

  /**
   * Detailed information about a merchant associated with a transaction.
   */
  merchantDetails?: TransactionCategorizeResponse.MerchantDetails;
}

export namespace TransactionCategorizeResponse {
  /**
   * Detailed information about a merchant associated with a transaction.
   */
  export interface MerchantDetails {
    address?: unknown;
  }
}

export interface TransactionListParams {
  /**
   * Filter transactions by their AI-assigned or user-defined category.
   */
  category?: string;

  /**
   * Retrieve transactions up to this date (inclusive).
   */
  endDate?: string;

  /**
   * Maximum number of items to return in a single page.
   */
  limit?: number;

  /**
   * Filter for transactions with an amount less than or equal to this value.
   */
  maxAmount?: number;

  /**
   * Filter for transactions with an amount greater than or equal to this value.
   */
  minAmount?: number;

  /**
   * Number of items to skip before starting to collect the result set.
   */
  offset?: number;

  /**
   * Free-text search across transaction descriptions, merchants, and notes.
   */
  searchQuery?: string;

  /**
   * Retrieve transactions from this date (inclusive).
   */
  startDate?: string;

  /**
   * Filter transactions by type (e.g., income, expense, transfer).
   */
  type?: string;
}

export interface TransactionCategorizeParams {}

Transactions.Recurring = Recurring;
Transactions.Insights = Insights;

export declare namespace Transactions {
  export {
    type TransactionRetrieveResponse as TransactionRetrieveResponse,
    type TransactionListResponse as TransactionListResponse,
    type TransactionCategorizeResponse as TransactionCategorizeResponse,
    type TransactionListParams as TransactionListParams,
    type TransactionCategorizeParams as TransactionCategorizeParams,
  };

  export {
    Recurring as Recurring,
    type RecurringListResponse as RecurringListResponse,
    type RecurringListParams as RecurringListParams,
  };

  export { Insights as Insights, type InsightGetTrendsResponse as InsightGetTrendsResponse };
}


================================================================================
// APPENDED FROM REPO: diplomat-bit/jocall3-typescript | ORIGINAL PATH: diplomat-bit-jocall3-typescript-b730718/src/resources/transactions/transactions.ts
================================================================================

// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../core/resource';
import * as InsightsAPI from './insights';
import { InsightRetrieveSpendingTrendsResponse, Insights } from './insights';
import * as RecurringAPI from './recurring';
import { Recurring, RecurringListParams, RecurringListResponse } from './recurring';
import { APIPromise } from '../../core/api-promise';
import { RequestOptions } from '../../internal/request-options';
import { path } from '../../internal/utils/path';

export class Transactions extends APIResource {
  recurring: RecurringAPI.Recurring = new RecurringAPI.Recurring(this._client);
  insights: InsightsAPI.Insights = new InsightsAPI.Insights(this._client);

  /**
   * Retrieves granular information for a single transaction by its unique ID,
   * including AI categorization confidence, merchant details, and associated carbon
   * footprint.
   *
   * @example
   * ```ts
   * const transaction = await client.transactions.retrieve(
   *   'txn_quantum-2024-07-21-A7B8C9',
   * );
   * ```
   */
  retrieve(transactionID: string, options?: RequestOptions): APIPromise<TransactionRetrieveResponse> {
    return this._client.get(path`/transactions/${transactionID}`, options);
  }

  /**
   * Retrieves a paginated list of the user's transactions, with extensive options
   * for filtering by type, category, date range, amount, and intelligent AI-driven
   * sorting and search capabilities.
   *
   * @example
   * ```ts
   * const transactions = await client.transactions.list();
   * ```
   */
  list(
    query: TransactionListParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<TransactionListResponse> {
    return this._client.get('/transactions', { query, ...options });
  }

  /**
   * Allows the user to add or update personal notes for a specific transaction.
   *
   * @example
   * ```ts
   * const response = await client.transactions.addNotes(
   *   'txn_quantum-2024-07-21-A7B8C9',
   *   {
   *     notes:
   *       'This was a special coffee for a client meeting.',
   *   },
   * );
   * ```
   */
  addNotes(
    transactionID: string,
    body: TransactionAddNotesParams,
    options?: RequestOptions,
  ): APIPromise<TransactionAddNotesResponse> {
    return this._client.put(path`/transactions/${transactionID}/notes`, { body, ...options });
  }

  /**
   * Allows the user to override or refine the AI's categorization for a transaction,
   * improving future AI accuracy and personal financial reporting.
   *
   * @example
   * ```ts
   * const response = await client.transactions.categorize(
   *   'txn_quantum-2024-07-21-A7B8C9',
   *   {
   *     category: 'Home > Groceries',
   *     applyToFuture: true,
   *     notes: 'Bulk purchase for party',
   *   },
   * );
   * ```
   */
  categorize(
    transactionID: string,
    body: TransactionCategorizeParams,
    options?: RequestOptions,
  ): APIPromise<TransactionCategorizeResponse> {
    return this._client.put(path`/transactions/${transactionID}/categorize`, { body, ...options });
  }
}

export interface TransactionRetrieveResponse {
  id: string;

  accountId: string;

  amount: number;

  category: string;

  currency: string;

  date: string;

  description: string;

  type: string;

  aiCategoryConfidence?: number;

  carbonFootprint?: number;

  disputeStatus?: string;

  location?: TransactionRetrieveResponse.Location;

  merchantDetails?: TransactionRetrieveResponse.MerchantDetails;

  notes?: string;

  paymentChannel?: string;

  postedDate?: string;

  receiptUrl?: string;

  tags?: Array<string>;
}

export namespace TransactionRetrieveResponse {
  export interface Location {
    city?: string;

    latitude?: number;

    longitude?: number;
  }

  export interface MerchantDetails {
    address?: MerchantDetails.Address;

    logoUrl?: string;

    name?: string;

    website?: string;
  }

  export namespace MerchantDetails {
    export interface Address {
      city?: string;

      state?: string;

      zip?: string;
    }
  }
}

export interface TransactionListResponse {
  data: Array<TransactionListResponse.Data>;

  limit: number;

  offset: number;

  total: number;

  nextOffset?: number;
}

export namespace TransactionListResponse {
  export interface Data {
    id?: string;

    accountId?: string;

    aiCategoryConfidence?: number;

    amount?: number;

    carbonFootprint?: number;

    category?: string;

    currency?: string;

    date?: string;

    description?: string;

    disputeStatus?: string;

    location?: Data.Location;

    merchantDetails?: Data.MerchantDetails;

    notes?: string;

    paymentChannel?: string;

    postedDate?: string;

    receiptUrl?: string;

    tags?: Array<string>;

    type?: string;
  }

  export namespace Data {
    export interface Location {
      city?: string;

      latitude?: number;

      longitude?: number;
    }

    export interface MerchantDetails {
      address?: MerchantDetails.Address;

      logoUrl?: string;

      name?: string;

      website?: string;
    }

    export namespace MerchantDetails {
      export interface Address {
        city?: string;

        state?: string;

        zip?: string;
      }
    }
  }
}

export interface TransactionAddNotesResponse {
  id: string;

  accountId: string;

  amount: number;

  category: string;

  currency: string;

  date: string;

  description: string;

  type: string;

  aiCategoryConfidence?: number;

  carbonFootprint?: number;

  disputeStatus?: string;

  location?: TransactionAddNotesResponse.Location;

  merchantDetails?: TransactionAddNotesResponse.MerchantDetails;

  notes?: string;

  paymentChannel?: string;

  postedDate?: string;

  receiptUrl?: string;

  tags?: Array<string>;
}

export namespace TransactionAddNotesResponse {
  export interface Location {
    city?: string;

    latitude?: number;

    longitude?: number;
  }

  export interface MerchantDetails {
    address?: MerchantDetails.Address;

    logoUrl?: string;

    name?: string;

    website?: string;
  }

  export namespace MerchantDetails {
    export interface Address {
      city?: string;

      state?: string;

      zip?: string;
    }
  }
}

export interface TransactionCategorizeResponse {
  id: string;

  accountId: string;

  amount: number;

  category: string;

  currency: string;

  date: string;

  description: string;

  type: string;

  aiCategoryConfidence?: number;

  carbonFootprint?: number;

  disputeStatus?: string;

  location?: TransactionCategorizeResponse.Location;

  merchantDetails?: TransactionCategorizeResponse.MerchantDetails;

  notes?: string;

  paymentChannel?: string;

  postedDate?: string;

  receiptUrl?: string;

  tags?: Array<string>;
}

export namespace TransactionCategorizeResponse {
  export interface Location {
    city?: string;

    latitude?: number;

    longitude?: number;
  }

  export interface MerchantDetails {
    address?: MerchantDetails.Address;

    logoUrl?: string;

    name?: string;

    website?: string;
  }

  export namespace MerchantDetails {
    export interface Address {
      city?: string;

      state?: string;

      zip?: string;
    }
  }
}

export interface TransactionListParams {
  /**
   * Filter transactions by their AI-assigned or user-defined category.
   */
  category?: string;

  /**
   * Retrieve transactions up to this date (inclusive).
   */
  endDate?: string;

  /**
   * Maximum number of items to return in a single page.
   */
  limit?: number;

  /**
   * Filter for transactions with an amount less than or equal to this value.
   */
  maxAmount?: number;

  /**
   * Filter for transactions with an amount greater than or equal to this value.
   */
  minAmount?: number;

  /**
   * Number of items to skip before starting to collect the result set.
   */
  offset?: number;

  /**
   * Free-text search across transaction descriptions, merchants, and notes.
   */
  searchQuery?: string;

  /**
   * Retrieve transactions from this date (inclusive).
   */
  startDate?: string;

  /**
   * Filter transactions by type (e.g., income, expense, transfer).
   */
  type?: string;
}

export interface TransactionAddNotesParams {
  notes: string;
}

export interface TransactionCategorizeParams {
  category: string;

  applyToFuture?: boolean;

  notes?: string;
}

Transactions.Recurring = Recurring;
Transactions.Insights = Insights;

export declare namespace Transactions {
  export {
    type TransactionRetrieveResponse as TransactionRetrieveResponse,
    type TransactionListResponse as TransactionListResponse,
    type TransactionAddNotesResponse as TransactionAddNotesResponse,
    type TransactionCategorizeResponse as TransactionCategorizeResponse,
    type TransactionListParams as TransactionListParams,
    type TransactionAddNotesParams as TransactionAddNotesParams,
    type TransactionCategorizeParams as TransactionCategorizeParams,
  };

  export {
    Recurring as Recurring,
    type RecurringListResponse as RecurringListResponse,
    type RecurringListParams as RecurringListParams,
  };

  export {
    Insights as Insights,
    type InsightRetrieveSpendingTrendsResponse as InsightRetrieveSpendingTrendsResponse,
  };
}
