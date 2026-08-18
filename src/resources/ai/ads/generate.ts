// REPOSITORY SOURCE: diplomat-bit/garbage-typescript | PATH: diplomat-bit-garbage-typescript-95791a2/src/resources/ai/ads/generate.ts
================================================================================

// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../../core/resource';
import { APIPromise } from '../../../core/api-promise';
import { RequestOptions } from '../../../internal/request-options';

export class Generate extends APIResource {
  /**
   * Generate High-Conversion Ad Copy
   *
   * @example
   * ```ts
   * const response = await client.ai.ads.generate.copy({
   *   productDescription: 'string',
   *   targetAudience: 'string',
   * });
   * ```
   */
  copy(body: GenerateCopyParams, options?: RequestOptions): APIPromise<GenerateCopyResponse> {
    return this._client.post('/ai/ads/generate/copy', { body, ...options });
  }

  /**
   * Generate a Standard Video Ad with Veo 2.0
   *
   * @example
   * ```ts
   * const response = await client.ai.ads.generate.video({
   *   lengthSeconds: 15,
   *   prompt: 'string',
   *   style: 'Cyberpunk',
   * });
   * ```
   */
  video(body: GenerateVideoParams, options?: RequestOptions): APIPromise<GenerateVideoResponse> {
    return this._client.post('/ai/ads/generate/video', { body, ...options });
  }
}

export interface GenerateCopyResponse {
  bodyText?: string;

  headlines?: Array<string>;
}

export interface GenerateVideoResponse {
  operationId?: string;
}

export interface GenerateCopyParams {
  productDescription: string;

  targetAudience: string;
}

export interface GenerateVideoParams {
  lengthSeconds: 15 | 30 | 60;

  /**
   * Visual description
   */
  prompt: string;

  style: 'Cinematic' | 'Minimalist' | 'Cyberpunk' | 'Professional';
}

export declare namespace Generate {
  export {
    type GenerateCopyResponse as GenerateCopyResponse,
    type GenerateVideoResponse as GenerateVideoResponse,
    type GenerateCopyParams as GenerateCopyParams,
    type GenerateVideoParams as GenerateVideoParams,
  };
}
