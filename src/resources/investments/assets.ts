// REPOSITORY SOURCE: diplomat-bit/garbage-typescript | PATH: diplomat-bit-garbage-typescript-95791a2/src/resources/investments/assets.ts
================================================================================

// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../core/resource';
import { APIPromise } from '../../core/api-promise';
import { RequestOptions } from '../../internal/request-options';

export class Assets extends APIResource {
  /**
   * Global Multi-Asset Search (Equities, Crypto, ESG)
   *
   * @example
   * ```ts
   * const response = await client.investments.assets.search({
   *   query: 'query',
   * });
   * ```
   */
  search(query: AssetSearchParams, options?: RequestOptions): APIPromise<AssetSearchResponse> {
    return this._client.get('/investments/assets/search', { query, ...options });
  }
}

export interface AssetSearchResponse {
  hits?: Array<unknown>;
}

export interface AssetSearchParams {
  query: string;

  assetType?: 'EQUITY' | 'CRYPTO' | 'ETF' | 'BOND';
}

export declare namespace Assets {
  export { type AssetSearchResponse as AssetSearchResponse, type AssetSearchParams as AssetSearchParams };
}


================================================================================
// APPENDED FROM REPO: diplomat-bit/jocall3-typescript | ORIGINAL PATH: diplomat-bit-jocall3-typescript-b730718/src/resources/investments/assets.ts
================================================================================

// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../core/resource';
import { APIPromise } from '../../core/api-promise';
import { RequestOptions } from '../../internal/request-options';

export class Assets extends APIResource {
  /**
   * Searches for available investment assets (stocks, ETFs, mutual funds) and
   * returns their ESG impact scores.
   *
   * @example
   * ```ts
   * const response = await client.investments.assets.search();
   * ```
   */
  search(query: AssetSearchParams | null | undefined = {}, options?: RequestOptions): APIPromise<unknown> {
    return this._client.get('/investments/assets/search', { query, ...options });
  }
}

export type AssetSearchResponse = unknown;

export interface AssetSearchParams {
  /**
   * Maximum number of items to return in a single page.
   */
  limit?: number;

  /**
   * Minimum desired ESG score (0-10).
   */
  minESGScore?: number;

  /**
   * Number of items to skip before starting to collect the result set.
   */
  offset?: number;

  /**
   * Search query for asset name or symbol.
   */
  query?: string;
}

export declare namespace Assets {
  export { type AssetSearchResponse as AssetSearchResponse, type AssetSearchParams as AssetSearchParams };
}
