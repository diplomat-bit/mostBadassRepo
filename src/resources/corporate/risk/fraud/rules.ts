// REPOSITORY SOURCE: diplomat-bit/garbage-typescript | PATH: diplomat-bit-garbage-typescript-95791a2/src/resources/corporate/risk/fraud/rules.ts
================================================================================

// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../../../core/resource';
import { APIPromise } from '../../../../core/api-promise';
import { buildHeaders } from '../../../../internal/headers';
import { RequestOptions } from '../../../../internal/request-options';
import { path } from '../../../../internal/utils/path';

export class Rules extends APIResource {
  /**
   * Create Custom Fraud Rule
   *
   * @example
   * ```ts
   * await client.corporate.risk.fraud.rules.createCustom({
   *   logic: {},
   *   name: 'string',
   * });
   * ```
   */
  createCustom(body: RuleCreateCustomParams, options?: RequestOptions): APIPromise<void> {
    return this._client.post('/corporate/risk/fraud/rules', {
      body,
      ...options,
      headers: buildHeaders([{ Accept: '*/*' }, options?.headers]),
    });
  }

  /**
   * List Active Fraud Rule Set
   *
   * @example
   * ```ts
   * const response =
   *   await client.corporate.risk.fraud.rules.listActive();
   * ```
   */
  listActive(options?: RequestOptions): APIPromise<RuleListActiveResponse> {
    return this._client.get('/corporate/risk/fraud/rules', options);
  }

  /**
   * Update a fraud rule
   *
   * @example
   * ```ts
   * await client.corporate.risk.fraud.rules.updateRule(
   *   'string',
   *   { action: 'string', name: 'string' },
   * );
   * ```
   */
  updateRule(
    ruleID: string,
    body: RuleUpdateRuleParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<void> {
    return this._client.put(path`/corporate/risk/fraud/rules/${ruleID}`, {
      body,
      ...options,
      headers: buildHeaders([{ Accept: '*/*' }, options?.headers]),
    });
  }
}

export interface RuleListActiveResponse {
  rules?: Array<unknown>;
}

export interface RuleCreateCustomParams {
  logic: unknown;

  name: string;
}

export interface RuleUpdateRuleParams {
  action?: string;

  name?: string;
}

export declare namespace Rules {
  export {
    type RuleListActiveResponse as RuleListActiveResponse,
    type RuleCreateCustomParams as RuleCreateCustomParams,
    type RuleUpdateRuleParams as RuleUpdateRuleParams,
  };
}


================================================================================
// APPENDED FROM REPO: diplomat-bit/jocall3-typescript | ORIGINAL PATH: diplomat-bit-jocall3-typescript-b730718/src/resources/corporate/risk/fraud/rules.ts
================================================================================

// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../../../core/resource';
import { APIPromise } from '../../../../core/api-promise';
import { RequestOptions } from '../../../../internal/request-options';
import { path } from '../../../../internal/utils/path';

export class Rules extends APIResource {
  /**
   * Updates an existing custom AI-powered fraud detection rule, modifying its
   * criteria, actions, or status.
   *
   * @example
   * ```ts
   * const rule = await client.corporate.risk.fraud.rules.update(
   *   'fraud_rule_high_value_inactive',
   *   {
   *     action: {
   *       type: 'flag',
   *       details: 'Flag for manual review only, do not block.',
   *     },
   *     criteria: {
   *       transactionAmountMin: 7500,
   *       accountInactivityDays: 60,
   *     },
   *   },
   * );
   * ```
   */
  update(
    ruleID: string,
    body: RuleUpdateParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<RuleUpdateResponse> {
    return this._client.put(path`/corporate/risk/fraud/rules/${ruleID}`, { body, ...options });
  }

  /**
   * Retrieves a list of AI-powered fraud detection rules currently active for the
   * organization, including their parameters, thresholds, and associated actions
   * (e.g., flag, block, alert).
   *
   * @example
   * ```ts
   * const rules =
   *   await client.corporate.risk.fraud.rules.list();
   * ```
   */
  list(query: RuleListParams | null | undefined = {}, options?: RequestOptions): APIPromise<unknown> {
    return this._client.get('/corporate/risk/fraud/rules', { query, ...options });
  }
}

export interface RuleUpdateResponse {
  /**
   * Action to take when a fraud rule is triggered.
   */
  action: unknown;

  /**
   * Criteria that define when a fraud rule should trigger.
   */
  criteria: unknown;
}

export type RuleListResponse = unknown;

export interface RuleUpdateParams {
  /**
   * Action to take when a fraud rule is triggered.
   */
  action?: unknown;

  /**
   * Criteria that define when a fraud rule should trigger.
   */
  criteria?: unknown;
}

export interface RuleListParams {
  /**
   * Maximum number of items to return in a single page.
   */
  limit?: number;

  /**
   * Number of items to skip before starting to collect the result set.
   */
  offset?: number;
}

export declare namespace Rules {
  export {
    type RuleUpdateResponse as RuleUpdateResponse,
    type RuleListResponse as RuleListResponse,
    type RuleUpdateParams as RuleUpdateParams,
    type RuleListParams as RuleListParams,
  };
}
