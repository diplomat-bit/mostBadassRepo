// REPOSITORY SOURCE: diplomat-bit/garbage-typescript | PATH: diplomat-bit-garbage-typescript-95791a2/src/resources/system/sandbox.ts
================================================================================

// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../core/resource';
import { APIPromise } from '../../core/api-promise';
import { buildHeaders } from '../../internal/headers';
import { RequestOptions } from '../../internal/request-options';

export class Sandbox extends APIResource {
  /**
   * Reset Sandbox Ledger Data
   *
   * @example
   * ```ts
   * await client.system.sandbox.reset();
   * ```
   */
  reset(options?: RequestOptions): APIPromise<void> {
    return this._client.post('/system/sandbox/reset', {
      ...options,
      headers: buildHeaders([{ Accept: '*/*' }, options?.headers]),
    });
  }

  /**
   * Force Specific API Error (For Testing)
   *
   * @example
   * ```ts
   * const response = await client.system.sandbox.simulateError({
   *   errorCode: 500,
   * });
   * ```
   */
  simulateError(
    body: SandboxSimulateErrorParams,
    options?: RequestOptions,
  ): APIPromise<SandboxSimulateErrorResponse> {
    return this._client.post('/system/sandbox/simulate-error', { body, ...options });
  }
}

export interface SandboxSimulateErrorResponse {
  code: string;

  message: string;

  timestamp?: string;
}

export interface SandboxSimulateErrorParams {
  errorCode: number;
}

export declare namespace Sandbox {
  export {
    type SandboxSimulateErrorResponse as SandboxSimulateErrorResponse,
    type SandboxSimulateErrorParams as SandboxSimulateErrorParams,
  };
}


================================================================================
// APPENDED FROM REPO: diplomat-bit/jocall3-typescript | ORIGINAL PATH: diplomat-bit-jocall3-typescript-b730718/src/resources/system/sandbox.ts
================================================================================

// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../core/resource';

export class Sandbox extends APIResource {}
