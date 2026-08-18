// REPOSITORY SOURCE: diplomat-bit/garbage-typescript | PATH: diplomat-bit-garbage-typescript-95791a2/src/resources/lending/decisions.ts
================================================================================

// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../core/resource';
import { APIPromise } from '../../core/api-promise';
import { RequestOptions } from '../../internal/request-options';
import { path } from '../../internal/utils/path';

export class Decisions extends APIResource {
  /**
   * Fetches the deep neural logic behind why a loan was approved or denied.
   *
   * @example
   * ```ts
   * const response =
   *   await client.lending.decisions.getRationale('string');
   * ```
   */
  getRationale(decisionID: string, options?: RequestOptions): APIPromise<DecisionGetRationaleResponse> {
    return this._client.get(path`/lending/decisions/${decisionID}/rationale`, options);
  }
}

export interface DecisionGetRationaleResponse {
  approved?: boolean;

  nextSteps?: string;

  reasoningNodes?: Array<string>;

  riskVectorAnalysis?: unknown;
}

export declare namespace Decisions {
  export { type DecisionGetRationaleResponse as DecisionGetRationaleResponse };
}


================================================================================
// APPENDED FROM REPO: diplomat-bit/jocall3-node | ORIGINAL PATH: diplomat-bit-jocall3-node-fae6abf/src/resources/lending/decisions.ts
================================================================================

// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../resource';

export class Decisions extends APIResource {}


================================================================================
// APPENDED FROM REPO: diplomat-bit/jocall3-typescript | ORIGINAL PATH: diplomat-bit-jocall3-typescript-b730718/src/resources/lending/decisions.ts
================================================================================

// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../core/resource';

export class Decisions extends APIResource {}
