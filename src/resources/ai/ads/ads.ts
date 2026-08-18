// REPOSITORY SOURCE: diplomat-bit/garbage-typescript | PATH: diplomat-bit-garbage-typescript-95791a2/src/resources/ai/ads/ads.ts
================================================================================

// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../../core/resource';
import * as GenerateAPI from './generate';
import {
  Generate,
  GenerateCopyParams,
  GenerateCopyResponse,
  GenerateVideoParams,
  GenerateVideoResponse,
} from './generate';
import { APIPromise } from '../../../core/api-promise';
import { RequestOptions } from '../../../internal/request-options';
import { path } from '../../../internal/utils/path';

export class Ads extends APIResource {
  generate: GenerateAPI.Generate = new GenerateAPI.Generate(this._client);

  /**
   * Poll for Video Gen Status
   *
   * @example
   * ```ts
   * const ad = await client.ai.ads.retrieve('string');
   * ```
   */
  retrieve(operationID: string, options?: RequestOptions): APIPromise<AdRetrieveResponse> {
    return this._client.get(path`/ai/ads/operations/${operationID}`, options);
  }

  /**
   * List All Generated Ad Assets
   *
   * @example
   * ```ts
   * const ads = await client.ai.ads.list();
   * ```
   */
  list(options?: RequestOptions): APIPromise<AdListResponse> {
    return this._client.get('/ai/ads', options);
  }

  /**
   * AI Campaign Efficiency Optimizer
   *
   * @example
   * ```ts
   * const response = await client.ai.ads.optimize({
   *   campaignData: {},
   * });
   * ```
   */
  optimize(body: AdOptimizeParams, options?: RequestOptions): APIPromise<AdOptimizeResponse> {
    return this._client.post('/ai/ads/optimize', { body, ...options });
  }
}

export interface AdRetrieveResponse {
  progress?: number;

  status?: string;

  videoUri?: string;
}

export interface AdListResponse {
  data?: Array<unknown>;
}

export interface AdOptimizeResponse {
  suggestedChanges?: Array<string>;
}

export interface AdOptimizeParams {
  campaignData: unknown;
}

Ads.Generate = Generate;

export declare namespace Ads {
  export {
    type AdRetrieveResponse as AdRetrieveResponse,
    type AdListResponse as AdListResponse,
    type AdOptimizeResponse as AdOptimizeResponse,
    type AdOptimizeParams as AdOptimizeParams,
  };

  export {
    Generate as Generate,
    type GenerateCopyResponse as GenerateCopyResponse,
    type GenerateVideoResponse as GenerateVideoResponse,
    type GenerateCopyParams as GenerateCopyParams,
    type GenerateVideoParams as GenerateVideoParams,
  };
}
