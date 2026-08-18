// REPOSITORY SOURCE: diplomat-bit/garbage-typescript | PATH: diplomat-bit-garbage-typescript-95791a2/src/resources/corporate/treasury/sweeping.ts
================================================================================

// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../../core/resource';
import { APIPromise } from '../../../core/api-promise';
import { buildHeaders } from '../../../internal/headers';
import { RequestOptions } from '../../../internal/request-options';

export class Sweeping extends APIResource {
  /**
   * Configure Automated Cash Sweeping
   *
   * @example
   * ```ts
   * await client.corporate.treasury.sweeping.configureRules({
   *   sourceAccount: 'string',
   *   targetAccount: 'string',
   *   threshold: 151.0206397332503,
   *   frequency: 'weekly',
   * });
   * ```
   */
  configureRules(body: SweepingConfigureRulesParams, options?: RequestOptions): APIPromise<void> {
    return this._client.post('/corporate/treasury/sweeping/rules', {
      body,
      ...options,
      headers: buildHeaders([{ Accept: '*/*' }, options?.headers]),
    });
  }

  /**
   * Manual Sweep Trigger
   *
   * @example
   * ```ts
   * await client.corporate.treasury.sweeping.executeSweep({
   *   ruleId: 'string',
   * });
   * ```
   */
  executeSweep(body: SweepingExecuteSweepParams, options?: RequestOptions): APIPromise<void> {
    return this._client.post('/corporate/treasury/sweeping/execute', {
      body,
      ...options,
      headers: buildHeaders([{ Accept: '*/*' }, options?.headers]),
    });
  }
}

export interface SweepingConfigureRulesParams {
  sourceAccount: string;

  targetAccount: string;

  threshold: number;

  frequency?: 'daily' | 'weekly' | 'monthly';
}

export interface SweepingExecuteSweepParams {
  ruleId: string;
}

export declare namespace Sweeping {
  export {
    type SweepingConfigureRulesParams as SweepingConfigureRulesParams,
    type SweepingExecuteSweepParams as SweepingExecuteSweepParams,
  };
}


================================================================================
// APPENDED FROM REPO: diplomat-bit/jocall3-node | ORIGINAL PATH: diplomat-bit-jocall3-node-fae6abf/src/resources/corporate/treasury/sweeping.ts
================================================================================

// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../../resource';

export class Sweeping extends APIResource {}


================================================================================
// APPENDED FROM REPO: diplomat-bit/jocall3-typescript | ORIGINAL PATH: diplomat-bit-jocall3-typescript-b730718/src/resources/corporate/treasury/sweeping.ts
================================================================================

// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../../core/resource';

export class Sweeping extends APIResource {}
