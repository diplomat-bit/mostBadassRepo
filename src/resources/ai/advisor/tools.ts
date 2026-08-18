// REPOSITORY SOURCE: diplomat-bit/garbage-typescript | PATH: diplomat-bit-garbage-typescript-95791a2/src/resources/ai/advisor/tools.ts
================================================================================

// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../../core/resource';
import { APIPromise } from '../../../core/api-promise';
import { buildHeaders } from '../../../internal/headers';
import { RequestOptions } from '../../../internal/request-options';
import { path } from '../../../internal/utils/path';

export class Tools extends APIResource {
  /**
   * List AI-Executable Financial Tools
   *
   * @example
   * ```ts
   * const tools = await client.ai.advisor.tools.list();
   * ```
   */
  list(options?: RequestOptions): APIPromise<ToolListResponse> {
    return this._client.get('/ai/advisor/tools', options);
  }

  /**
   * Grant AI Execution Permission for Tool
   *
   * @example
   * ```ts
   * await client.ai.advisor.tools.enable('string');
   * ```
   */
  enable(toolID: string, options?: RequestOptions): APIPromise<void> {
    return this._client.post(path`/ai/advisor/tools/${toolID}/enable`, {
      ...options,
      headers: buildHeaders([{ Accept: '*/*' }, options?.headers]),
    });
  }
}

export interface ToolListResponse {
  data?: Array<unknown>;
}

export declare namespace Tools {
  export { type ToolListResponse as ToolListResponse };
}


================================================================================
// APPENDED FROM REPO: diplomat-bit/jocall3-node | ORIGINAL PATH: diplomat-bit-jocall3-node-fae6abf/src/resources/ai/advisor/tools.ts
================================================================================

// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../../resource';
import { isRequestOptions } from '../../../core';
import * as Core from '../../../core';

export class Tools extends APIResource {
  /**
   * Retrieves a dynamic manifest of all integrated AI tools that Quantum can invoke
   * and execute, providing details on their capabilities, parameters, and access
   * requirements.
   *
   * @example
   * ```ts
   * const tools = await client.ai.advisor.tools.list();
   * ```
   */
  list(query?: ToolListParams, options?: Core.RequestOptions): Core.APIPromise<unknown>;
  list(options?: Core.RequestOptions): Core.APIPromise<unknown>;
  list(
    query: ToolListParams | Core.RequestOptions = {},
    options?: Core.RequestOptions,
  ): Core.APIPromise<unknown> {
    if (isRequestOptions(query)) {
      return this.list({}, query);
    }
    return this._client.get('/ai/advisor/tools', { query, ...options });
  }
}

export type ToolListResponse = unknown;

export interface ToolListParams {
  /**
   * Maximum number of items to return in a single page.
   */
  limit?: number;

  /**
   * Number of items to skip before starting to collect the result set.
   */
  offset?: number;
}

export declare namespace Tools {
  export { type ToolListResponse as ToolListResponse, type ToolListParams as ToolListParams };
}


================================================================================
// APPENDED FROM REPO: diplomat-bit/jocall3-typescript | ORIGINAL PATH: diplomat-bit-jocall3-typescript-b730718/src/resources/ai/advisor/tools.ts
================================================================================

// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../../core/resource';
import { APIPromise } from '../../../core/api-promise';
import { RequestOptions } from '../../../internal/request-options';

export class Tools extends APIResource {
  /**
   * Retrieves a dynamic manifest of all integrated AI tools that Quantum can invoke
   * and execute, providing details on their capabilities, parameters, and access
   * requirements.
   *
   * @example
   * ```ts
   * const tools = await client.ai.advisor.tools.list();
   * ```
   */
  list(query: ToolListParams | null | undefined = {}, options?: RequestOptions): APIPromise<unknown> {
    return this._client.get('/ai/advisor/tools', { query, ...options });
  }
}

export type ToolListResponse = unknown;

export interface ToolListParams {
  /**
   * Maximum number of items to return in a single page.
   */
  limit?: number;

  /**
   * Number of items to skip before starting to collect the result set.
   */
  offset?: number;
}

export declare namespace Tools {
  export { type ToolListResponse as ToolListResponse, type ToolListParams as ToolListParams };
}
