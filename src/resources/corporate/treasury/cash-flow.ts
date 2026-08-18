// REPOSITORY SOURCE: diplomat-bit/garbage-typescript | PATH: diplomat-bit-garbage-typescript-95791a2/src/resources/corporate/treasury/cash-flow.ts
================================================================================

// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../../core/resource';
import { APIPromise } from '../../../core/api-promise';
import { RequestOptions } from '../../../internal/request-options';

export class CashFlow extends APIResource {
  /**
   * Corporate Cash Flow Projection
   *
   * @example
   * ```ts
   * const response =
   *   await client.corporate.treasury.cashFlow.forecast();
   * ```
   */
  forecast(
    query: CashFlowForecastParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<CashFlowForecastResponse> {
    return this._client.get('/corporate/treasury/cash-flow/forecast', { query, ...options });
  }
}

export interface CashFlowForecastResponse {
  aiRecommendations?: Array<string>;

  forecastId?: string;

  projectedRunway?: number;
}

export interface CashFlowForecastParams {
  horizonDays?: number;
}

export declare namespace CashFlow {
  export {
    type CashFlowForecastResponse as CashFlowForecastResponse,
    type CashFlowForecastParams as CashFlowForecastParams,
  };
}
