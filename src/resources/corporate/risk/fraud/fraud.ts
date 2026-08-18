// REPOSITORY SOURCE: diplomat-bit/garbage-typescript | PATH: diplomat-bit-garbage-typescript-95791a2/src/resources/corporate/risk/fraud/fraud.ts
================================================================================

// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../../../core/resource';
import * as RulesAPI from './rules';
import { RuleCreateCustomParams, RuleListActiveResponse, RuleUpdateRuleParams, Rules } from './rules';
import { APIPromise } from '../../../../core/api-promise';
import { RequestOptions } from '../../../../internal/request-options';

export class Fraud extends APIResource {
  rules: RulesAPI.Rules = new RulesAPI.Rules(this._client);

  /**
   * Real-time Transaction Fraud Analysis
   *
   * @example
   * ```ts
   * const response =
   *   await client.corporate.risk.fraud.analyzeTransaction({
   *     transactionId: 'string',
   *   });
   * ```
   */
  analyzeTransaction(
    body: FraudAnalyzeTransactionParams,
    options?: RequestOptions,
  ): APIPromise<FraudAnalyzeTransactionResponse> {
    return this._client.post('/corporate/risk/fraud/analyze', { body, ...options });
  }
}

export interface FraudAnalyzeTransactionResponse {
  decision?: 'APPROVE' | 'FLAG' | 'BLOCK';

  riskScore?: number;
}

export interface FraudAnalyzeTransactionParams {
  transactionId: string;
}

Fraud.Rules = Rules;

export declare namespace Fraud {
  export {
    type FraudAnalyzeTransactionResponse as FraudAnalyzeTransactionResponse,
    type FraudAnalyzeTransactionParams as FraudAnalyzeTransactionParams,
  };

  export {
    Rules as Rules,
    type RuleListActiveResponse as RuleListActiveResponse,
    type RuleCreateCustomParams as RuleCreateCustomParams,
    type RuleUpdateRuleParams as RuleUpdateRuleParams,
  };
}


================================================================================
// APPENDED FROM REPO: diplomat-bit/jocall3-typescript | ORIGINAL PATH: diplomat-bit-jocall3-typescript-b730718/src/resources/corporate/risk/fraud/fraud.ts
================================================================================

// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../../../core/resource';
import * as RulesAPI from './rules';
import { RuleListParams, RuleListResponse, RuleUpdateParams, RuleUpdateResponse, Rules } from './rules';

export class Fraud extends APIResource {
  rules: RulesAPI.Rules = new RulesAPI.Rules(this._client);
}

Fraud.Rules = Rules;

export declare namespace Fraud {
  export {
    Rules as Rules,
    type RuleUpdateResponse as RuleUpdateResponse,
    type RuleListResponse as RuleListResponse,
    type RuleUpdateParams as RuleUpdateParams,
    type RuleListParams as RuleListParams,
  };
}
