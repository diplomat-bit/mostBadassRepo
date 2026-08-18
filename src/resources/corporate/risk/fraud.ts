// REPOSITORY SOURCE: diplomat-bit/garbage-typescript | PATH: diplomat-bit-garbage-typescript-95791a2/src/resources/corporate/risk/fraud.ts
================================================================================

// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

export * from './fraud/index';


================================================================================
// APPENDED FROM REPO: diplomat-bit/jocall3-node | ORIGINAL PATH: diplomat-bit-jocall3-node-fae6abf/src/resources/corporate/risk/fraud.ts
================================================================================

// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../../resource';
import { isRequestOptions } from '../../../core';
import * as Core from '../../../core';

export class Fraud extends APIResource {
  /**
   * Retrieves a list of AI-powered fraud detection rules currently active for the
   * organization, including their parameters, thresholds, and associated actions
   * (e.g., flag, block, alert).
   *
   * @example
   * ```ts
   * const response =
   *   await client.corporate.risk.fraud.listRules();
   * ```
   */
  listRules(query?: FraudListRulesParams, options?: Core.RequestOptions): Core.APIPromise<unknown>;
  listRules(options?: Core.RequestOptions): Core.APIPromise<unknown>;
  listRules(
    query: FraudListRulesParams | Core.RequestOptions = {},
    options?: Core.RequestOptions,
  ): Core.APIPromise<unknown> {
    if (isRequestOptions(query)) {
      return this.listRules({}, query);
    }
    return this._client.get('/corporate/risk/fraud/rules', { query, ...options });
  }
}

export type FraudListRulesResponse = unknown;

export interface FraudListRulesParams {
  /**
   * Maximum number of items to return in a single page.
   */
  limit?: number;

  /**
   * Number of items to skip before starting to collect the result set.
   */
  offset?: number;
}

export declare namespace Fraud {
  export {
    type FraudListRulesResponse as FraudListRulesResponse,
    type FraudListRulesParams as FraudListRulesParams,
  };
}


================================================================================
// APPENDED FROM REPO: diplomat-bit/jocall3-typescript | ORIGINAL PATH: diplomat-bit-jocall3-typescript-b730718/src/resources/corporate/risk/fraud.ts
================================================================================

// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

export * from './fraud/index';
