// REPOSITORY SOURCE: diplomat-bit/garbage-typescript | PATH: diplomat-bit-garbage-typescript-95791a2/src/resources/corporate/treasury/liquidity.ts
================================================================================

// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../../core/resource';
import { APIPromise } from '../../../core/api-promise';
import { buildHeaders } from '../../../internal/headers';
import { RequestOptions } from '../../../internal/request-options';

export class Liquidity extends APIResource {
  /**
   * Configure liquidity pooling
   *
   * @example
   * ```ts
   * await client.corporate.treasury.liquidity.configurePooling({
   *   source_account_ids: ['string', 'string'],
   *   target_account_id: 'string',
   * });
   * ```
   */
  configurePooling(
    body: LiquidityConfigurePoolingParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<void> {
    return this._client.post('/corporate/treasury/liquidity/pooling', {
      body,
      ...options,
      headers: buildHeaders([{ Accept: '*/*' }, options?.headers]),
    });
  }

  /**
   * AI Liquidity Optimization Engine
   *
   * @example
   * ```ts
   * const response =
   *   await client.corporate.treasury.liquidity.optimize({
   *     sweepExcess: true,
   *     targetReserve: 3283.3648412254447,
   *   });
   * ```
   */
  optimize(
    body: LiquidityOptimizeParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<LiquidityOptimizeResponse> {
    return this._client.post('/corporate/treasury/liquidity/optimize', { body, ...options });
  }
}

export interface LiquidityOptimizeResponse {
  projectedYield?: number;

  strategyId?: string;
}

export interface LiquidityConfigurePoolingParams {
  source_account_ids?: Array<string>;

  target_account_id?: string;
}

export interface LiquidityOptimizeParams {
  sweepExcess?: boolean;

  targetReserve?: number;
}

export declare namespace Liquidity {
  export {
    type LiquidityOptimizeResponse as LiquidityOptimizeResponse,
    type LiquidityConfigurePoolingParams as LiquidityConfigurePoolingParams,
    type LiquidityOptimizeParams as LiquidityOptimizeParams,
  };
}
