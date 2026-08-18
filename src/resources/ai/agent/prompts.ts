// REPOSITORY SOURCE: diplomat-bit/garbage-typescript | PATH: diplomat-bit-garbage-typescript-95791a2/src/resources/ai/agent/prompts.ts
================================================================================

// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../../core/resource';
import { APIPromise } from '../../../core/api-promise';
import { buildHeaders } from '../../../internal/headers';
import { RequestOptions } from '../../../internal/request-options';

export class Prompts extends APIResource {
  /**
   * Update System Instructions for Gemini Engine
   *
   * @example
   * ```ts
   * await client.ai.agent.prompts.create({
   *   systemPrompt: 'string',
   * });
   * ```
   */
  create(body: PromptCreateParams, options?: RequestOptions): APIPromise<void> {
    return this._client.put('/ai/agent/prompts', {
      body,
      ...options,
      headers: buildHeaders([{ Accept: '*/*' }, options?.headers]),
    });
  }

  /**
   * Retrieve Current System System Prompts
   *
   * @example
   * ```ts
   * const prompts = await client.ai.agent.prompts.list();
   * ```
   */
  list(options?: RequestOptions): APIPromise<PromptListResponse> {
    return this._client.get('/ai/agent/prompts', options);
  }
}

export interface PromptListResponse {
  systemPrompt?: string;

  version?: string;
}

export interface PromptCreateParams {
  systemPrompt: string;
}

export declare namespace Prompts {
  export { type PromptListResponse as PromptListResponse, type PromptCreateParams as PromptCreateParams };
}
