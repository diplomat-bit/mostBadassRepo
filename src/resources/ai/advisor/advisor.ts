// REPOSITORY SOURCE: diplomat-bit/garbage-typescript | PATH: diplomat-bit-garbage-typescript-95791a2/src/resources/ai/advisor/advisor.ts
================================================================================

// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../../core/resource';
import * as ChatAPI from './chat';
import { Chat, ChatCreateParams, ChatCreateResponse, ChatRetrieveHistoryResponse } from './chat';
import * as ToolsAPI from './tools';
import { ToolListResponse, Tools } from './tools';

export class Advisor extends APIResource {
  chat: ChatAPI.Chat = new ChatAPI.Chat(this._client);
  tools: ToolsAPI.Tools = new ToolsAPI.Tools(this._client);
}

Advisor.Chat = Chat;
Advisor.Tools = Tools;

export declare namespace Advisor {
  export {
    Chat as Chat,
    type ChatCreateResponse as ChatCreateResponse,
    type ChatRetrieveHistoryResponse as ChatRetrieveHistoryResponse,
    type ChatCreateParams as ChatCreateParams,
  };

  export { Tools as Tools, type ToolListResponse as ToolListResponse };
}


================================================================================
// APPENDED FROM REPO: diplomat-bit/jocall3-node | ORIGINAL PATH: diplomat-bit-jocall3-node-fae6abf/src/resources/ai/advisor/advisor.ts
================================================================================

// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../../resource';
import { isRequestOptions } from '../../../core';
import * as Core from '../../../core';
import * as ToolsAPI from './tools';
import { ToolListParams, ToolListResponse, Tools } from './tools';

export class Advisor extends APIResource {
  tools: ToolsAPI.Tools = new ToolsAPI.Tools(this._client);

  /**
   * Initiates or continues a sophisticated conversation with Quantum, the AI
   * Advisor. Quantum can provide advanced financial insights, execute complex tasks
   * via an expanding suite of intelligent tools, and learn from user interactions to
   * offer hyper-personalized guidance.
   *
   * @example
   * ```ts
   * const response = await client.ai.advisor.chat();
   * ```
   */
  chat(body?: AdvisorChatParams, options?: Core.RequestOptions): Core.APIPromise<unknown>;
  chat(options?: Core.RequestOptions): Core.APIPromise<unknown>;
  chat(
    body: AdvisorChatParams | Core.RequestOptions = {},
    options?: Core.RequestOptions,
  ): Core.APIPromise<unknown> {
    if (isRequestOptions(body)) {
      return this.chat({}, body);
    }
    return this._client.post('/ai/advisor/chat', { body, ...options });
  }
}

export type AdvisorChatResponse = unknown;

export interface AdvisorChatParams {
  /**
   * Optional: The output from a tool function that the AI previously requested to be
   * executed.
   */
  functionResponse?: unknown;
}

Advisor.Tools = Tools;

export declare namespace Advisor {
  export { type AdvisorChatResponse as AdvisorChatResponse, type AdvisorChatParams as AdvisorChatParams };

  export { Tools as Tools, type ToolListResponse as ToolListResponse, type ToolListParams as ToolListParams };
}


================================================================================
// APPENDED FROM REPO: diplomat-bit/jocall3-typescript | ORIGINAL PATH: diplomat-bit-jocall3-typescript-b730718/src/resources/ai/advisor/advisor.ts
================================================================================

// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../../core/resource';
import * as ToolsAPI from './tools';
import { ToolListParams, ToolListResponse, Tools } from './tools';
import { APIPromise } from '../../../core/api-promise';
import { RequestOptions } from '../../../internal/request-options';

export class Advisor extends APIResource {
  tools: ToolsAPI.Tools = new ToolsAPI.Tools(this._client);

  /**
   * Initiates or continues a sophisticated conversation with Quantum, the AI
   * Advisor. Quantum can provide advanced financial insights, execute complex tasks
   * via an expanding suite of intelligent tools, and learn from user interactions to
   * offer hyper-personalized guidance.
   *
   * @example
   * ```ts
   * const response = await client.ai.advisor.chat();
   * ```
   */
  chat(body: AdvisorChatParams | null | undefined = {}, options?: RequestOptions): APIPromise<unknown> {
    return this._client.post('/ai/advisor/chat', { body, ...options });
  }

  /**
   * Fetches the full conversation history with the Quantum AI Advisor for a given
   * session or user.
   *
   * @example
   * ```ts
   * const response = await client.ai.advisor.retrieveHistory();
   * ```
   */
  retrieveHistory(
    query: AdvisorRetrieveHistoryParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<unknown> {
    return this._client.get('/ai/advisor/chat/history', { query, ...options });
  }
}

export type AdvisorChatResponse = unknown;

export type AdvisorRetrieveHistoryResponse = unknown;

export interface AdvisorChatParams {
  /**
   * Optional: The output from a tool function that the AI previously requested to be
   * executed.
   */
  functionResponse?: unknown;
}

export interface AdvisorRetrieveHistoryParams {
  /**
   * Maximum number of items to return in a single page.
   */
  limit?: number;

  /**
   * Number of items to skip before starting to collect the result set.
   */
  offset?: number;

  /**
   * Optional: Filter history by a specific session ID. If omitted, recent
   * conversations will be returned.
   */
  sessionId?: string;
}

Advisor.Tools = Tools;

export declare namespace Advisor {
  export {
    type AdvisorChatResponse as AdvisorChatResponse,
    type AdvisorRetrieveHistoryResponse as AdvisorRetrieveHistoryResponse,
    type AdvisorChatParams as AdvisorChatParams,
    type AdvisorRetrieveHistoryParams as AdvisorRetrieveHistoryParams,
  };

  export { Tools as Tools, type ToolListResponse as ToolListResponse, type ToolListParams as ToolListParams };
}
