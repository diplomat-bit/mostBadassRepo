// REPOSITORY SOURCE: diplomat-bit/garbage-typescript | PATH: diplomat-bit-garbage-typescript-95791a2/src/resources/corporate/cards.ts
================================================================================

// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../core/resource';
import { APIPromise } from '../../core/api-promise';
import { buildHeaders } from '../../internal/headers';
import { RequestOptions } from '../../internal/request-options';
import { path } from '../../internal/utils/path';

export class Cards extends APIResource {
  /**
   * Get card transactions
   *
   * @example
   * ```ts
   * const response =
   *   await client.corporate.cards.getTransactions('string');
   * ```
   */
  getTransactions(cardID: string, options?: RequestOptions): APIPromise<CardGetTransactionsResponse> {
    return this._client.get(path`/corporate/cards/${cardID}/transactions`, options);
  }

  /**
   * Issue Corporate Virtual Card
   *
   * @example
   * ```ts
   * const response =
   *   await client.corporate.cards.issueVirtualCard({
   *     holderName: 'string',
   *     monthlyLimit: 4001.3564842481064,
   *     purpose: 'string',
   *     metadata: {},
   *   });
   * ```
   */
  issueVirtualCard(
    body: CardIssueVirtualCardParams,
    options?: RequestOptions,
  ): APIPromise<CardIssueVirtualCardResponse> {
    return this._client.post('/corporate/cards/virtual', { body, ...options });
  }

  /**
   * List all corporate cards
   *
   * @example
   * ```ts
   * const response = await client.corporate.cards.listAll();
   * ```
   */
  listAll(
    query: CardListAllParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<CardListAllResponse> {
    return this._client.get('/corporate/cards', { query, ...options });
  }

  /**
   * Request Physical Corporate Card
   *
   * @example
   * ```ts
   * const response =
   *   await client.corporate.cards.requestPhysicalCard({
   *     holderName: 'string',
   *     shippingAddress: {
   *       street: 'string',
   *       city: 'string',
   *       country: 'string',
   *       state: 'string',
   *       zip: 'string',
   *     },
   *   });
   * ```
   */
  requestPhysicalCard(
    body: CardRequestPhysicalCardParams,
    options?: RequestOptions,
  ): APIPromise<CardRequestPhysicalCardResponse> {
    return this._client.post('/corporate/cards/physical', { body, ...options });
  }

  /**
   * Toggle Card Lock
   *
   * @example
   * ```ts
   * await client.corporate.cards.toggleCardLock('string', {
   *   frozen: false,
   * });
   * ```
   */
  toggleCardLock(cardID: string, body: CardToggleCardLockParams, options?: RequestOptions): APIPromise<void> {
    return this._client.post(path`/corporate/cards/${cardID}/freeze`, {
      body,
      ...options,
      headers: buildHeaders([{ Accept: '*/*' }, options?.headers]),
    });
  }

  /**
   * Update Spending Limits & MCC Controls
   *
   * @example
   * ```ts
   * await client.corporate.cards.updateControls('string', {
   *   allowedCategories: ['string', 'string'],
   *   geoRestriction: ['string', 'string'],
   *   monthlyLimit: 4249.638841389152,
   * });
   * ```
   */
  updateControls(
    cardID: string,
    body: CardUpdateControlsParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<void> {
    return this._client.put(path`/corporate/cards/${cardID}/controls`, {
      body,
      ...options,
      headers: buildHeaders([{ Accept: '*/*' }, options?.headers]),
    });
  }
}

export interface CardGetTransactionsResponse {
  data?: Array<CardGetTransactionsResponse.Data>;
}

export namespace CardGetTransactionsResponse {
  export interface Data {
    id: string;

    amount: number;

    currency: string;

    date: string;

    description: string;

    category?: string;

    notes?: string;
  }
}

export interface CardIssueVirtualCardResponse {
  id: string;

  cardNumberMask: string;

  holderName: string;

  status: string;

  frozen?: boolean;
}

export interface CardListAllResponse {
  data?: Array<CardListAllResponse.Data>;

  total?: number;
}

export namespace CardListAllResponse {
  export interface Data {
    id: string;

    cardNumberMask: string;

    holderName: string;

    status: string;

    frozen?: boolean;
  }
}

export interface CardRequestPhysicalCardResponse {
  id: string;

  cardNumberMask: string;

  holderName: string;

  status: string;

  frozen?: boolean;
}

export interface CardIssueVirtualCardParams {
  holderName: string;

  monthlyLimit: number;

  purpose: string;

  metadata?: unknown;
}

export interface CardListAllParams {
  limit?: number;

  offset?: number;
}

export interface CardRequestPhysicalCardParams {
  holderName: string;

  shippingAddress: CardRequestPhysicalCardParams.ShippingAddress;
}

export namespace CardRequestPhysicalCardParams {
  export interface ShippingAddress {
    city: string;

    country: string;

    street: string;

    state?: string;

    zip?: string;
  }
}

export interface CardToggleCardLockParams {
  frozen: boolean;
}

export interface CardUpdateControlsParams {
  allowedCategories?: Array<string>;

  geoRestriction?: Array<string>;

  monthlyLimit?: number;
}

export declare namespace Cards {
  export {
    type CardGetTransactionsResponse as CardGetTransactionsResponse,
    type CardIssueVirtualCardResponse as CardIssueVirtualCardResponse,
    type CardListAllResponse as CardListAllResponse,
    type CardRequestPhysicalCardResponse as CardRequestPhysicalCardResponse,
    type CardIssueVirtualCardParams as CardIssueVirtualCardParams,
    type CardListAllParams as CardListAllParams,
    type CardRequestPhysicalCardParams as CardRequestPhysicalCardParams,
    type CardToggleCardLockParams as CardToggleCardLockParams,
    type CardUpdateControlsParams as CardUpdateControlsParams,
  };
}


================================================================================
// APPENDED FROM REPO: diplomat-bit/jocall3-node | ORIGINAL PATH: diplomat-bit-jocall3-node-fae6abf/src/resources/corporate/cards.ts
================================================================================

// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

export * from './cards/index';


================================================================================
// APPENDED FROM REPO: diplomat-bit/jocall3-typescript | ORIGINAL PATH: diplomat-bit-jocall3-typescript-b730718/src/resources/corporate/cards.ts
================================================================================

// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

export * from './cards/index';
