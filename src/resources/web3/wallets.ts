// REPOSITORY SOURCE: diplomat-bit/garbage-typescript | PATH: diplomat-bit-garbage-typescript-95791a2/src/resources/web3/wallets.ts
================================================================================

// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../core/resource';
import { APIPromise } from '../../core/api-promise';
import { buildHeaders } from '../../internal/headers';
import { RequestOptions } from '../../internal/request-options';
import { path } from '../../internal/utils/path';

export class Wallets extends APIResource {
  /**
   * Create Non-Custodial Wallet
   *
   * @example
   * ```ts
   * const wallet = await client.web3.wallets.create({
   *   network: 'ETH',
   * });
   * ```
   */
  create(body: WalletCreateParams, options?: RequestOptions): APIPromise<WalletCreateResponse> {
    return this._client.post('/web3/wallets', { body, ...options });
  }

  /**
   * List Connected Wallets
   *
   * @example
   * ```ts
   * const wallets = await client.web3.wallets.list();
   * ```
   */
  list(options?: RequestOptions): APIPromise<WalletListResponse> {
    return this._client.get('/web3/wallets', options);
  }

  /**
   * Get Multi-chain Token Balances
   *
   * @example
   * ```ts
   * const response = await client.web3.wallets.getBalances(
   *   'string',
   * );
   * ```
   */
  getBalances(walletID: string, options?: RequestOptions): APIPromise<WalletGetBalancesResponse> {
    return this._client.get(path`/web3/wallets/${walletID}/balances`, options);
  }

  /**
   * Link External Web3 Wallet (MetaMask/Phantom)
   *
   * @example
   * ```ts
   * await client.web3.wallets.link({
   *   address: 'string',
   *   provider: 'string',
   *   signature: 'string',
   * });
   * ```
   */
  link(body: WalletLinkParams, options?: RequestOptions): APIPromise<void> {
    return this._client.post('/web3/wallets/connect', {
      body,
      ...options,
      headers: buildHeaders([{ Accept: '*/*' }, options?.headers]),
    });
  }
}

export interface WalletCreateResponse {
  id: string;

  address: string;

  network: string;
}

export interface WalletListResponse {
  data?: Array<WalletListResponse.Data>;
}

export namespace WalletListResponse {
  export interface Data {
    id: string;

    address: string;

    network: string;
  }
}

export interface WalletGetBalancesResponse {
  balances?: Array<WalletGetBalancesResponse.Balance>;
}

export namespace WalletGetBalancesResponse {
  export interface Balance {
    amount?: string;

    symbol?: string;
  }
}

export interface WalletCreateParams {
  network: string;
}

export interface WalletLinkParams {
  address: string;

  provider: string;

  signature: string;
}

export declare namespace Wallets {
  export {
    type WalletCreateResponse as WalletCreateResponse,
    type WalletListResponse as WalletListResponse,
    type WalletGetBalancesResponse as WalletGetBalancesResponse,
    type WalletCreateParams as WalletCreateParams,
    type WalletLinkParams as WalletLinkParams,
  };
}


================================================================================
// APPENDED FROM REPO: diplomat-bit/jocall3-node | ORIGINAL PATH: diplomat-bit-jocall3-node-fae6abf/src/resources/web3/wallets.ts
================================================================================

// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../resource';
import { isRequestOptions } from '../../core';
import * as Core from '../../core';

export class Wallets extends APIResource {
  /**
   * Initiates the process to securely connect a new cryptocurrency wallet to the
   * user's profile, typically involving a signed message or OAuth flow from the
   * wallet provider.
   *
   * @example
   * ```ts
   * const wallet = await client.web3.wallets.create();
   * ```
   */
  create(body: WalletCreateParams, options?: Core.RequestOptions): Core.APIPromise<unknown> {
    return this._client.post('/web3/wallets', { body, ...options });
  }

  /**
   * Retrieves a list of all securely linked cryptocurrency wallets (e.g., MetaMask,
   * Ledger integration), showing their addresses, associated networks, and
   * verification status.
   *
   * @example
   * ```ts
   * const wallets = await client.web3.wallets.list();
   * ```
   */
  list(query?: WalletListParams, options?: Core.RequestOptions): Core.APIPromise<unknown>;
  list(options?: Core.RequestOptions): Core.APIPromise<unknown>;
  list(
    query: WalletListParams | Core.RequestOptions = {},
    options?: Core.RequestOptions,
  ): Core.APIPromise<unknown> {
    if (isRequestOptions(query)) {
      return this.list({}, query);
    }
    return this._client.get('/web3/wallets', { query, ...options });
  }

  /**
   * Retrieves the current balances of all recognized crypto assets within a specific
   * connected wallet.
   *
   * @example
   * ```ts
   * const response = await client.web3.wallets.getBalance(
   *   'wallet_conn_eth_0xabc123',
   * );
   * ```
   */
  getBalance(
    walletId: string,
    query?: WalletGetBalanceParams,
    options?: Core.RequestOptions,
  ): Core.APIPromise<unknown>;
  getBalance(walletId: string, options?: Core.RequestOptions): Core.APIPromise<unknown>;
  getBalance(
    walletId: string,
    query: WalletGetBalanceParams | Core.RequestOptions = {},
    options?: Core.RequestOptions,
  ): Core.APIPromise<unknown> {
    if (isRequestOptions(query)) {
      return this.getBalance(walletId, {}, query);
    }
    return this._client.get(`/web3/wallets/${walletId}/balances`, { query, ...options });
  }
}

export type WalletCreateResponse = unknown;

export type WalletListResponse = unknown;

export type WalletGetBalanceResponse = unknown;

export interface WalletCreateParams {}

export interface WalletListParams {
  /**
   * Maximum number of items to return in a single page.
   */
  limit?: number;

  /**
   * Number of items to skip before starting to collect the result set.
   */
  offset?: number;
}

export interface WalletGetBalanceParams {
  /**
   * Maximum number of items to return in a single page.
   */
  limit?: number;

  /**
   * Number of items to skip before starting to collect the result set.
   */
  offset?: number;
}

export declare namespace Wallets {
  export {
    type WalletCreateResponse as WalletCreateResponse,
    type WalletListResponse as WalletListResponse,
    type WalletGetBalanceResponse as WalletGetBalanceResponse,
    type WalletCreateParams as WalletCreateParams,
    type WalletListParams as WalletListParams,
    type WalletGetBalanceParams as WalletGetBalanceParams,
  };
}


================================================================================
// APPENDED FROM REPO: diplomat-bit/jocall3-typescript | ORIGINAL PATH: diplomat-bit-jocall3-typescript-b730718/src/resources/web3/wallets.ts
================================================================================

// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../core/resource';
import { APIPromise } from '../../core/api-promise';
import { RequestOptions } from '../../internal/request-options';
import { path } from '../../internal/utils/path';

export class Wallets extends APIResource {
  /**
   * Initiates the process to securely connect a new cryptocurrency wallet to the
   * user's profile, typically involving a signed message or OAuth flow from the
   * wallet provider.
   *
   * @example
   * ```ts
   * const wallet = await client.web3.wallets.create();
   * ```
   */
  create(body: WalletCreateParams, options?: RequestOptions): APIPromise<unknown> {
    return this._client.post('/web3/wallets', { body, ...options });
  }

  /**
   * Retrieves a list of all securely linked cryptocurrency wallets (e.g., MetaMask,
   * Ledger integration), showing their addresses, associated networks, and
   * verification status.
   *
   * @example
   * ```ts
   * const wallets = await client.web3.wallets.list();
   * ```
   */
  list(query: WalletListParams | null | undefined = {}, options?: RequestOptions): APIPromise<unknown> {
    return this._client.get('/web3/wallets', { query, ...options });
  }

  /**
   * Retrieves the current balances of all recognized crypto assets within a specific
   * connected wallet.
   *
   * @example
   * ```ts
   * const response = await client.web3.wallets.retrieveBalances(
   *   'wallet_conn_eth_0xabc123',
   * );
   * ```
   */
  retrieveBalances(
    walletID: string,
    query: WalletRetrieveBalancesParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<unknown> {
    return this._client.get(path`/web3/wallets/${walletID}/balances`, { query, ...options });
  }
}

export type WalletCreateResponse = unknown;

export type WalletListResponse = unknown;

export type WalletRetrieveBalancesResponse = unknown;

export interface WalletCreateParams {}

export interface WalletListParams {
  /**
   * Maximum number of items to return in a single page.
   */
  limit?: number;

  /**
   * Number of items to skip before starting to collect the result set.
   */
  offset?: number;
}

export interface WalletRetrieveBalancesParams {
  /**
   * Maximum number of items to return in a single page.
   */
  limit?: number;

  /**
   * Number of items to skip before starting to collect the result set.
   */
  offset?: number;
}

export declare namespace Wallets {
  export {
    type WalletCreateResponse as WalletCreateResponse,
    type WalletListResponse as WalletListResponse,
    type WalletRetrieveBalancesResponse as WalletRetrieveBalancesResponse,
    type WalletCreateParams as WalletCreateParams,
    type WalletListParams as WalletListParams,
    type WalletRetrieveBalancesParams as WalletRetrieveBalancesParams,
  };
}
