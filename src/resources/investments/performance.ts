// REPOSITORY SOURCE: diplomat-bit/garbage-typescript | PATH: diplomat-bit-garbage-typescript-95791a2/src/resources/investments/performance.ts
================================================================================

// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../core/resource';
import { APIPromise } from '../../core/api-promise';
import { RequestOptions } from '../../internal/request-options';

export class Performance extends APIResource {
  /**
   * Get Historical Performance Curves
   *
   * @example
   * ```ts
   * const response =
   *   await client.investments.performance.getHistorical();
   * ```
   */
  getHistorical(
    query: PerformanceGetHistoricalParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<PerformanceGetHistoricalResponse> {
    return this._client.get('/investments/performance/historical', { query, ...options });
  }
}

export interface PerformanceGetHistoricalResponse {
  benchmarkComparison?: number;

  points?: Array<unknown>;
}

export interface PerformanceGetHistoricalParams {
  range?: '1m' | '3m' | '1y' | '5y' | 'max';
}

export declare namespace Performance {
  export {
    type PerformanceGetHistoricalResponse as PerformanceGetHistoricalResponse,
    type PerformanceGetHistoricalParams as PerformanceGetHistoricalParams,
  };
}


================================================================================
// APPENDED FROM REPO: diplomat-bit/jocall3-typescript | ORIGINAL PATH: diplomat-bit-jocall3-typescript-b730718/src/resources/investments/performance.ts
================================================================================

// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../core/resource';

export class Performance extends APIResource {}
