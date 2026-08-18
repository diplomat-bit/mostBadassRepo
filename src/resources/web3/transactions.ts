// REPOSITORY SOURCE: diplomat-bit/garbage-typescript | PATH: diplomat-bit-garbage-typescript-95791a2/src/resources/web3/transactions.ts
================================================================================

// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../core/resource';
import { APIPromise } from '../../core/api-promise';
import { buildHeaders } from '../../internal/headers';
import { RequestOptions } from '../../internal/request-options';

export class Transactions extends APIResource {
  /**
   * Cross-chain Asset Bridge
   *
   * @example
   * ```ts
   * await client.web3.transactions.bridge({
   *   token: 'string',
   *   amount: 'string',
   *   destChain: 'string',
   *   sourceChain: 'string',
   * });
   * ```
   */
  bridge(body: TransactionBridgeParams, options?: RequestOptions): APIPromise<void> {
    return this._client.post('/web3/transactions/bridge', {
      body,
      ...options,
      headers: buildHeaders([{ Accept: '*/*' }, options?.headers]),
    });
  }

  /**
   * Initiate a Web3 transaction
   *
   * @example
   * ```ts
   * await client.web3.transactions.initiate({
   *   amount: 8684.340121544215,
   *   asset: 'string',
   *   wallet_id: 'string',
   * });
   * ```
   */
  initiate(body: TransactionInitiateParams, options?: RequestOptions): APIPromise<void> {
    return this._client.post('/web3/transactions/initiate', {
      body,
      ...options,
      headers: buildHeaders([{ Accept: '*/*' }, options?.headers]),
    });
  }

  /**
   * Initiate On-chain Transfer
   *
   * @example
   * ```ts
   * const response = await client.web3.transactions.send({
   *   token: 'string',
   *   amount: 'string',
   *   to: 'string',
   * });
   * ```
   */
  send(body: TransactionSendParams, options?: RequestOptions): APIPromise<TransactionSendResponse> {
    return this._client.post('/web3/transactions/send', { body, ...options });
  }

  /**
   * Execute Multi-chain Token Swap
   *
   * @example
   * ```ts
   * await client.web3.transactions.swap({
   *   amount: 'string',
   *   fromToken: 'string',
   *   toToken: 'string',
   * });
   * ```
   */
  swap(body: TransactionSwapParams, options?: RequestOptions): APIPromise<void> {
    return this._client.post('/web3/transactions/swap', {
      body,
      ...options,
      headers: buildHeaders([{ Accept: '*/*' }, options?.headers]),
    });
  }
}

export interface TransactionSendResponse {
  txHash?: string;
}

export interface TransactionBridgeParams {
  token: string;

  amount: string;

  destChain: string;

  sourceChain: string;
}

export interface TransactionInitiateParams {
  amount: number;

  asset: string;

  wallet_id: string;
}

export interface TransactionSendParams {
  token: string;

  amount: string;

  to: string;
}

export interface TransactionSwapParams {
  amount: string;

  fromToken: string;

  toToken: string;
}

export declare namespace Transactions {
  export {
    type TransactionSendResponse as TransactionSendResponse,
    type TransactionBridgeParams as TransactionBridgeParams,
    type TransactionInitiateParams as TransactionInitiateParams,
    type TransactionSendParams as TransactionSendParams,
    type TransactionSwapParams as TransactionSwapParams,
  };
}


================================================================================
// APPENDED FROM REPO: diplomat-bit/jocall3-node | ORIGINAL PATH: diplomat-bit-jocall3-node-fae6abf/src/resources/web3/transactions.ts
================================================================================

// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../resource';

export class Transactions extends APIResource {}


================================================================================
// APPENDED FROM REPO: diplomat-bit/jocall3-typescript | ORIGINAL PATH: diplomat-bit-jocall3-typescript-b730718/src/resources/web3/transactions.ts
================================================================================

// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../core/resource';
import { APIPromise } from '../../core/api-promise';
import { RequestOptions } from '../../internal/request-options';

export class Transactions extends APIResource {
  /**
   * Prepares and initiates a cryptocurrency transfer from a connected wallet to a
   * specified recipient address. Requires user confirmation (e.g., via wallet
   * signature).
   *
   * @example
   * ```ts
   * const response = await client.web3.transactions.initiate();
   * ```
   */
  initiate(body: TransactionInitiateParams, options?: RequestOptions): APIPromise<unknown> {
    return this._client.post('/web3/transactions/initiate', { body, ...options });
  }
}

export type TransactionInitiateResponse = unknown;

export interface TransactionInitiateParams {}

export declare namespace Transactions {
  export {
    type TransactionInitiateResponse as TransactionInitiateResponse,
    type TransactionInitiateParams as TransactionInitiateParams,
  };
}
