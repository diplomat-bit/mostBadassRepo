// REPOSITORY SOURCE: diplomat-bit/garbage-typescript | PATH: diplomat-bit-garbage-typescript-95791a2/src/resources/ai/advisor/chat.ts
================================================================================

// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../../core/resource';
import { APIPromise } from '../../../core/api-promise';
import { RequestOptions } from '../../../internal/request-options';

export class Chat extends APIResource {
  /**
   * The primary orchestration point. Connects Postman Data to Gemini Logic.
   *
   * @example
   * ```ts
   * const chat = await client.ai.advisor.chat.create({
   *   message: 'string',
   *   contextAccountIds: ['string', 'string'],
   *   mode: 'expert_financial',
   * });
   * ```
   */
  create(body: ChatCreateParams, options?: RequestOptions): APIPromise<ChatCreateResponse> {
    return this._client.post('/ai/advisor/chat', { body, ...options });
  }

  /**
   * Get Full Chat Transcript
   *
   * @example
   * ```ts
   * const response =
   *   await client.ai.advisor.chat.retrieveHistory();
   * ```
   */
  retrieveHistory(options?: RequestOptions): APIPromise<ChatRetrieveHistoryResponse> {
    return this._client.get('/ai/advisor/chat/history', options);
  }
}

export interface ChatCreateResponse {
  reply?: string;

  sessionId?: string;

  suggestedActions?: Array<unknown>;
}

export interface ChatRetrieveHistoryResponse {
  messages?: Array<unknown>;
}

export interface ChatCreateParams {
  message: string;

  contextAccountIds?: Array<string>;

  mode?: string;

  stream?: boolean;
}

export declare namespace Chat {
  export {
    type ChatCreateResponse as ChatCreateResponse,
    type ChatRetrieveHistoryResponse as ChatRetrieveHistoryResponse,
    type ChatCreateParams as ChatCreateParams,
  };
}
