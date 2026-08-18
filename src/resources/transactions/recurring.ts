// REPOSITORY SOURCE: diplomat-bit/garbage-typescript | PATH: diplomat-bit-garbage-typescript-95791a2/src/resources/transactions/recurring.ts
================================================================================

// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../core/resource';
import { APIPromise } from '../../core/api-promise';
import { buildHeaders } from '../../internal/headers';
import { RequestOptions } from '../../internal/request-options';
import { path } from '../../internal/utils/path';

export class Recurring extends APIResource {
  /**
   * Manually Create Recurring Schedule
   *
   * @example
   * ```ts
   * await client.transactions.recurring.create({
   *   amount: 2136.462018591201,
   *   category: 'string',
   *   frequency: 'string',
   * });
   * ```
   */
  create(body: RecurringCreateParams, options?: RequestOptions): APIPromise<void> {
    return this._client.post('/transactions/recurring', {
      body,
      ...options,
      headers: buildHeaders([{ Accept: '*/*' }, options?.headers]),
    });
  }

  /**
   * List Detected Subscriptions
   *
   * @example
   * ```ts
   * const recurrings =
   *   await client.transactions.recurring.list();
   * ```
   */
  list(options?: RequestOptions): APIPromise<RecurringListResponse> {
    return this._client.get('/transactions/recurring', options);
  }

  /**
   * Cancel Recurring Payment Detection
   *
   * @example
   * ```ts
   * await client.transactions.recurring.cancel('string');
   * ```
   */
  cancel(recurringID: string, options?: RequestOptions): APIPromise<void> {
    return this._client.delete(path`/transactions/recurring/${recurringID}`, {
      ...options,
      headers: buildHeaders([{ Accept: '*/*' }, options?.headers]),
    });
  }
}

export interface RecurringListResponse {
  data?: Array<RecurringListResponse.Data>;
}

export namespace RecurringListResponse {
  export interface Data {
    id?: string;

    description?: string;

    frequency?: string;

    nextExpectedDate?: string;
  }
}

export interface RecurringCreateParams {
  amount: number;

  category: string;

  frequency: string;
}

export declare namespace Recurring {
  export {
    type RecurringListResponse as RecurringListResponse,
    type RecurringCreateParams as RecurringCreateParams,
  };
}


================================================================================
// APPENDED FROM REPO: diplomat-bit/jocall3-node | ORIGINAL PATH: diplomat-bit-jocall3-node-fae6abf/src/resources/transactions/recurring.ts
================================================================================

// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../resource';
import { isRequestOptions } from '../../core';
import * as Core from '../../core';

export class Recurring extends APIResource {
  /**
   * Retrieves a list of all detected or user-defined recurring transactions, useful
   * for budget tracking and subscription management.
   *
   * @example
   * ```ts
   * const recurrings =
   *   await client.transactions.recurring.list();
   * ```
   */
  list(query?: RecurringListParams, options?: Core.RequestOptions): Core.APIPromise<unknown>;
  list(options?: Core.RequestOptions): Core.APIPromise<unknown>;
  list(
    query: RecurringListParams | Core.RequestOptions = {},
    options?: Core.RequestOptions,
  ): Core.APIPromise<unknown> {
    if (isRequestOptions(query)) {
      return this.list({}, query);
    }
    return this._client.get('/transactions/recurring', { query, ...options });
  }
}

export type RecurringListResponse = unknown;

export interface RecurringListParams {
  /**
   * Maximum number of items to return in a single page.
   */
  limit?: number;

  /**
   * Number of items to skip before starting to collect the result set.
   */
  offset?: number;
}

export declare namespace Recurring {
  export {
    type RecurringListResponse as RecurringListResponse,
    type RecurringListParams as RecurringListParams,
  };
}


================================================================================
// APPENDED FROM REPO: diplomat-bit/jocall3-typescript | ORIGINAL PATH: diplomat-bit-jocall3-typescript-b730718/src/resources/transactions/recurring.ts
================================================================================

// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../core/resource';
import { APIPromise } from '../../core/api-promise';
import { RequestOptions } from '../../internal/request-options';

export class Recurring extends APIResource {
  /**
   * Retrieves a list of all detected or user-defined recurring transactions, useful
   * for budget tracking and subscription management.
   *
   * @example
   * ```ts
   * const recurrings =
   *   await client.transactions.recurring.list();
   * ```
   */
  list(
    query: RecurringListParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<RecurringListResponse> {
    return this._client.get('/transactions/recurring', { query, ...options });
  }
}

export interface RecurringListResponse {
  data: Array<RecurringListResponse.Data>;

  limit: number;

  offset: number;

  total: number;

  nextOffset?: number;
}

export namespace RecurringListResponse {
  export interface Data {
    id?: string;

    aiConfidenceScore?: number;

    amount?: number;

    category?: string;

    currency?: string;

    description?: string;

    frequency?: string;

    lastPaidDate?: string;

    linkedAccountId?: string;

    nextDueDate?: string;

    status?: string;
  }
}

export interface RecurringListParams {
  /**
   * Maximum number of items to return in a single page.
   */
  limit?: number;

  /**
   * Number of items to skip before starting to collect the result set.
   */
  offset?: number;
}

export declare namespace Recurring {
  export {
    type RecurringListResponse as RecurringListResponse,
    type RecurringListParams as RecurringListParams,
  };
}
