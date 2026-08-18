// REPOSITORY SOURCE: diplomat-bit/jocall3-node | PATH: diplomat-bit-jocall3-node-fae6abf/src/resources/corporate/cards/cards.ts
================================================================================

// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../../resource';
import { isRequestOptions } from '../../../core';
import * as Core from '../../../core';
import * as ControlsAPI from './controls';
import { ControlUpdateParams, ControlUpdateResponse, Controls } from './controls';

export class Cards extends APIResource {
  controls: ControlsAPI.Controls = new ControlsAPI.Controls(this._client);

  /**
   * Retrieves a comprehensive list of all physical and virtual corporate cards
   * associated with the user's organization, including their status, assigned
   * holder, and current spending controls.
   *
   * @example
   * ```ts
   * const cards = await client.corporate.cards.list();
   * ```
   */
  list(query?: CardListParams, options?: Core.RequestOptions): Core.APIPromise<unknown>;
  list(options?: Core.RequestOptions): Core.APIPromise<unknown>;
  list(
    query: CardListParams | Core.RequestOptions = {},
    options?: Core.RequestOptions,
  ): Core.APIPromise<unknown> {
    if (isRequestOptions(query)) {
      return this.list({}, query);
    }
    return this._client.get('/corporate/cards', { query, ...options });
  }

  /**
   * Immediately changes the frozen status of a corporate card, preventing or
   * allowing transactions in real-time, critical for security and expense
   * management.
   *
   * @example
   * ```ts
   * const response = await client.corporate.cards.freeze(
   *   'corp_card_xyz987654',
   * );
   * ```
   */
  freeze(
    cardId: string,
    body: CardFreezeParams,
    options?: Core.RequestOptions,
  ): Core.APIPromise<CardFreezeResponse> {
    return this._client.post(`/corporate/cards/${cardId}/freeze`, { body, ...options });
  }

  /**
   * Creates and issues a new virtual corporate card with specified spending limits,
   * merchant restrictions, and expiration dates, ideal for secure online purchases
   * and temporary projects.
   *
   * @example
   * ```ts
   * const response = await client.corporate.cards.issueVirtual({
   *   controls: {
   *     atmWithdrawals: false,
   *     contactlessPayments: false,
   *     onlineTransactions: true,
   *     internationalTransactions: false,
   *     monthlyLimit: 1000,
   *     dailyLimit: 500,
   *     singleTransactionLimit: 200,
   *     merchantCategoryRestrictions: ['Advertising'],
   *     vendorRestrictions: ['Facebook Ads', 'Google Ads'],
   *   },
   * });
   * ```
   */
  issueVirtual(
    body: CardIssueVirtualParams,
    options?: Core.RequestOptions,
  ): Core.APIPromise<CardIssueVirtualResponse> {
    return this._client.post('/corporate/cards/virtual', { body, ...options });
  }
}

export type CardListResponse = unknown;

export interface CardFreezeResponse {
  /**
   * Granular spending controls for a corporate card.
   */
  controls: unknown;
}

export interface CardIssueVirtualResponse {
  /**
   * Granular spending controls for a corporate card.
   */
  controls: unknown;
}

export interface CardListParams {
  /**
   * Maximum number of items to return in a single page.
   */
  limit?: number;

  /**
   * Number of items to skip before starting to collect the result set.
   */
  offset?: number;
}

export interface CardFreezeParams {}

export interface CardIssueVirtualParams {
  /**
   * Granular spending controls for a corporate card.
   */
  controls: unknown;
}

Cards.Controls = Controls;

export declare namespace Cards {
  export {
    type CardListResponse as CardListResponse,
    type CardFreezeResponse as CardFreezeResponse,
    type CardIssueVirtualResponse as CardIssueVirtualResponse,
    type CardListParams as CardListParams,
    type CardFreezeParams as CardFreezeParams,
    type CardIssueVirtualParams as CardIssueVirtualParams,
  };

  export {
    Controls as Controls,
    type ControlUpdateResponse as ControlUpdateResponse,
    type ControlUpdateParams as ControlUpdateParams,
  };
}


================================================================================
// APPENDED FROM REPO: diplomat-bit/jocall3-typescript | ORIGINAL PATH: diplomat-bit-jocall3-typescript-b730718/src/resources/corporate/cards/cards.ts
================================================================================

// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../../core/resource';
import * as ControlsAPI from './controls';
import { ControlUpdateParams, ControlUpdateResponse, Controls } from './controls';
import { APIPromise } from '../../../core/api-promise';
import { RequestOptions } from '../../../internal/request-options';
import { path } from '../../../internal/utils/path';

export class Cards extends APIResource {
  controls: ControlsAPI.Controls = new ControlsAPI.Controls(this._client);

  /**
   * Retrieves a comprehensive list of all physical and virtual corporate cards
   * associated with the user's organization, including their status, assigned
   * holder, and current spending controls.
   *
   * @example
   * ```ts
   * const cards = await client.corporate.cards.list();
   * ```
   */
  list(query: CardListParams | null | undefined = {}, options?: RequestOptions): APIPromise<unknown> {
    return this._client.get('/corporate/cards', { query, ...options });
  }

  /**
   * Immediately changes the frozen status of a corporate card, preventing or
   * allowing transactions in real-time, critical for security and expense
   * management.
   *
   * @example
   * ```ts
   * const response = await client.corporate.cards.freeze(
   *   'corp_card_xyz987654',
   * );
   * ```
   */
  freeze(cardID: string, body: CardFreezeParams, options?: RequestOptions): APIPromise<CardFreezeResponse> {
    return this._client.post(path`/corporate/cards/${cardID}/freeze`, { body, ...options });
  }

  /**
   * Creates and issues a new virtual corporate card with specified spending limits,
   * merchant restrictions, and expiration dates, ideal for secure online purchases
   * and temporary projects.
   *
   * @example
   * ```ts
   * const response = await client.corporate.cards.issueVirtual({
   *   controls: {
   *     atmWithdrawals: false,
   *     contactlessPayments: false,
   *     onlineTransactions: true,
   *     internationalTransactions: false,
   *     monthlyLimit: 1000,
   *     dailyLimit: 500,
   *     singleTransactionLimit: 200,
   *     merchantCategoryRestrictions: ['Advertising'],
   *     vendorRestrictions: ['Facebook Ads', 'Google Ads'],
   *   },
   * });
   * ```
   */
  issueVirtual(body: CardIssueVirtualParams, options?: RequestOptions): APIPromise<CardIssueVirtualResponse> {
    return this._client.post('/corporate/cards/virtual', { body, ...options });
  }

  /**
   * Retrieves a paginated list of transactions made with a specific corporate card,
   * including AI categorization and compliance flags.
   *
   * @example
   * ```ts
   * const response =
   *   await client.corporate.cards.listTransactions(
   *     'corp_card_xyz987654',
   *   );
   * ```
   */
  listTransactions(
    cardID: string,
    query: CardListTransactionsParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<unknown> {
    return this._client.get(path`/corporate/cards/${cardID}/transactions`, { query, ...options });
  }
}

export type CardListResponse = unknown;

export interface CardFreezeResponse {
  /**
   * Granular spending controls for a corporate card.
   */
  controls: unknown;
}

export interface CardIssueVirtualResponse {
  /**
   * Granular spending controls for a corporate card.
   */
  controls: unknown;
}

export type CardListTransactionsResponse = unknown;

export interface CardListParams {
  /**
   * Maximum number of items to return in a single page.
   */
  limit?: number;

  /**
   * Number of items to skip before starting to collect the result set.
   */
  offset?: number;
}

export interface CardFreezeParams {}

export interface CardIssueVirtualParams {
  /**
   * Granular spending controls for a corporate card.
   */
  controls: unknown;
}

export interface CardListTransactionsParams {
  /**
   * End date for filtering results (inclusive, YYYY-MM-DD).
   */
  endDate?: string;

  /**
   * Maximum number of items to return in a single page.
   */
  limit?: number;

  /**
   * Number of items to skip before starting to collect the result set.
   */
  offset?: number;

  /**
   * Start date for filtering results (inclusive, YYYY-MM-DD).
   */
  startDate?: string;
}

Cards.Controls = Controls;

export declare namespace Cards {
  export {
    type CardListResponse as CardListResponse,
    type CardFreezeResponse as CardFreezeResponse,
    type CardIssueVirtualResponse as CardIssueVirtualResponse,
    type CardListTransactionsResponse as CardListTransactionsResponse,
    type CardListParams as CardListParams,
    type CardFreezeParams as CardFreezeParams,
    type CardIssueVirtualParams as CardIssueVirtualParams,
    type CardListTransactionsParams as CardListTransactionsParams,
  };

  export {
    Controls as Controls,
    type ControlUpdateResponse as ControlUpdateResponse,
    type ControlUpdateParams as ControlUpdateParams,
  };
}
