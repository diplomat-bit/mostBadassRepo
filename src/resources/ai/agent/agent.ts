// REPOSITORY SOURCE: diplomat-bit/garbage-typescript | PATH: diplomat-bit-garbage-typescript-95791a2/src/resources/ai/agent/agent.ts
================================================================================

// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../../core/resource';
import * as PromptsAPI from './prompts';
import { PromptCreateParams, PromptListResponse, Prompts } from './prompts';
import { APIPromise } from '../../../core/api-promise';
import { RequestOptions } from '../../../internal/request-options';

export class Agent extends APIResource {
  prompts: PromptsAPI.Prompts = new PromptsAPI.Prompts(this._client);

  /**
   * List Quantum Agent Capabilities
   *
   * @example
   * ```ts
   * const response =
   *   await client.ai.agent.retrieveCapabilities();
   * ```
   */
  retrieveCapabilities(options?: RequestOptions): APIPromise<AgentRetrieveCapabilitiesResponse> {
    return this._client.get('/ai/agent/capabilities', options);
  }
}

export interface AgentRetrieveCapabilitiesResponse {
  data?: Array<AgentRetrieveCapabilitiesResponse.Data>;
}

export namespace AgentRetrieveCapabilitiesResponse {
  export interface Data {
    description?: string;

    enabled?: boolean;

    name?: string;

    requiresHumanApproval?: boolean;
  }
}

Agent.Prompts = Prompts;

export declare namespace Agent {
  export { type AgentRetrieveCapabilitiesResponse as AgentRetrieveCapabilitiesResponse };

  export {
    Prompts as Prompts,
    type PromptListResponse as PromptListResponse,
    type PromptCreateParams as PromptCreateParams,
  };
}
