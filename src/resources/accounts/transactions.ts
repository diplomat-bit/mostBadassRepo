// REPOSITORY SOURCE: diplomat-bit/garbage-typescript | PATH: diplomat-bit-garbage-typescript-95791a2/src/resources/accounts/transactions.ts
================================================================================

// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../core/resource';
import { APIPromise } from '../../core/api-promise';
import { RequestOptions } from '../../internal/request-options';
import { path } from '../../internal/utils/path';

export class Transactions extends APIResource {
  /**
   * Get Historical Ledger Archive
   *
   * @example
   * ```ts
   * const response =
   *   await client.accounts.transactions.retrieveArchived(
   *     'string',
   *   );
   * ```
   */
  retrieveArchived(
    accountID: string,
    query: TransactionRetrieveArchivedParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<TransactionRetrieveArchivedResponse> {
    return this._client.get(path`/accounts/${accountID}/transactions/archived`, { query, ...options });
  }

  /**
   * Get Pending Ledger Entries
   *
   * @example
   * ```ts
   * const response =
   *   await client.accounts.transactions.retrievePending(
   *     'string',
   *   );
   * ```
   */
  retrievePending(
    accountID: string,
    options?: RequestOptions,
  ): APIPromise<TransactionRetrievePendingResponse> {
    return this._client.get(path`/accounts/${accountID}/transactions/pending`, options);
  }
}

export interface TransactionRetrieveArchivedResponse {
  value?: string;
}

export interface TransactionRetrievePendingResponse {
  value?: string;
}

export interface TransactionRetrieveArchivedParams {
  year?: number;
}

export declare namespace Transactions {
  export {
    type TransactionRetrieveArchivedResponse as TransactionRetrieveArchivedResponse,
    type TransactionRetrievePendingResponse as TransactionRetrievePendingResponse,
    type TransactionRetrieveArchivedParams as TransactionRetrieveArchivedParams,
  };
}


================================================================================
// APPENDED FROM REPO: diplomat-bit/jocall3-node | ORIGINAL PATH: diplomat-bit-jocall3-node-fae6abf/src/resources/accounts/transactions.ts
================================================================================

// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../resource';
import { isRequestOptions } from '../../core';
import * as Core from '../../core';

export class Transactions extends APIResource {
  /**
   * Retrieves a list of pending transactions that have not yet cleared for a
   * specific financial account.
   *
   * @example
   * ```ts
   * const response =
   *   await client.accounts.transactions.listPending(
   *     'acc_chase_checking_4567',
   *   );
   * ```
   */
  listPending(
    accountId: string,
    query?: TransactionListPendingParams,
    options?: Core.RequestOptions,
  ): Core.APIPromise<unknown>;
  listPending(accountId: string, options?: Core.RequestOptions): Core.APIPromise<unknown>;
  listPending(
    accountId: string,
    query: TransactionListPendingParams | Core.RequestOptions = {},
    options?: Core.RequestOptions,
  ): Core.APIPromise<unknown> {
    if (isRequestOptions(query)) {
      return this.listPending(accountId, {}, query);
    }
    return this._client.get(`/accounts/${accountId}/transactions/pending`, { query, ...options });
  }
}

export type TransactionListPendingResponse = unknown;

export interface TransactionListPendingParams {
  /**
   * Maximum number of items to return in a single page.
   */
  limit?: number;

  /**
   * Number of items to skip before starting to collect the result set.
   */
  offset?: number;
}

export declare namespace Transactions {
  export {
    type TransactionListPendingResponse as TransactionListPendingResponse,
    type TransactionListPendingParams as TransactionListPendingParams,
  };
}


================================================================================
// APPENDED FROM REPO: diplomat-bit/jocall3-typescript | ORIGINAL PATH: diplomat-bit-jocall3-typescript-b730718/src/resources/accounts/transactions.ts
================================================================================

// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../core/resource';
import { APIPromise } from '../../core/api-promise';
import { RequestOptions } from '../../internal/request-options';
import { path } from '../../internal/utils/path';

export class Transactions extends APIResource {
  /**
   * Retrieves a list of pending transactions that have not yet cleared for a
   * specific financial account.
   *
   * @example
   * ```ts
   * const response =
   *   await client.accounts.transactions.listPending(
   *     'acc_chase_checking_4567',
   *   );
   * ```
   */
  listPending(
    accountID: string,
    query: TransactionListPendingParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<TransactionListPendingResponse> {
    return this._client.get(path`/accounts/${accountID}/transactions/pending`, { query, ...options });
  }
}

export interface TransactionListPendingResponse {
  data: Array<TransactionListPendingResponse.Data>;

  limit: number;

  offset: number;

  total: number;

  nextOffset?: number;
}

export namespace TransactionListPendingResponse {
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

    paymentChannel?: string;

    type?: string;
  }
}

export interface TransactionListPendingParams {
  /**
   * Maximum number of items to return in a single page.
   */
  limit?: number;

  /**
   * Number of items to skip before starting to collect the result set.
   */
  offset?: number;
}

export declare namespace Transactions {
  export {
    type TransactionListPendingResponse as TransactionListPendingResponse,
    type TransactionListPendingParams as TransactionListPendingParams,
  };
}
