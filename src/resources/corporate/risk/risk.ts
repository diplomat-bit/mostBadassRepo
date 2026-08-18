// REPOSITORY SOURCE: diplomat-bit/garbage-typescript | PATH: diplomat-bit-garbage-typescript-95791a2/src/resources/corporate/risk/risk.ts
================================================================================

// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../../core/resource';
import * as FraudAPI from './fraud/fraud';
import { Fraud, FraudAnalyzeTransactionParams, FraudAnalyzeTransactionResponse } from './fraud/fraud';
import { APIPromise } from '../../../core/api-promise';
import { RequestOptions } from '../../../internal/request-options';

export class Risk extends APIResource {
  fraud: FraudAPI.Fraud = new FraudAPI.Fraud(this._client);

  /**
   * Get Aggregate Risk Exposure
   *
   * @example
   * ```ts
   * const response =
   *   await client.corporate.risk.getRiskExposure();
   * ```
   */
  getRiskExposure(options?: RequestOptions): APIPromise<RiskGetRiskExposureResponse> {
    return this._client.get('/corporate/risk/exposure', options);
  }

  /**
   * Simulates extreme market conditions (e.g., 2008 crash, hyperinflation) against
   * the corporate ledger.
   *
   * @example
   * ```ts
   * const response = await client.corporate.risk.runStressTest({
   *   scenarioType: 'MARKET_CRASH',
   *   intensity: 0.9115157435249488,
   * });
   * ```
   */
  runStressTest(
    body: RiskRunStressTestParams,
    options?: RequestOptions,
  ): APIPromise<RiskRunStressTestResponse> {
    return this._client.post('/corporate/risk/stress-test', { body, ...options });
  }
}

export interface RiskGetRiskExposureResponse {
  assetConcentration?: unknown;

  counterpartyRisk?: Array<unknown>;

  valueAtRisk?: number;
}

export interface RiskRunStressTestResponse {
  aiNarrative?: string;

  liquidityGap?: number;

  resilienceScore?: number;
}

export interface RiskRunStressTestParams {
  scenarioType: 'BANK_RUN' | 'MARKET_CRASH' | 'REGULATORY_SHOCK' | 'DEPEGGING';

  intensity?: number;
}

Risk.Fraud = Fraud;

export declare namespace Risk {
  export {
    type RiskGetRiskExposureResponse as RiskGetRiskExposureResponse,
    type RiskRunStressTestResponse as RiskRunStressTestResponse,
    type RiskRunStressTestParams as RiskRunStressTestParams,
  };

  export {
    Fraud as Fraud,
    type FraudAnalyzeTransactionResponse as FraudAnalyzeTransactionResponse,
    type FraudAnalyzeTransactionParams as FraudAnalyzeTransactionParams,
  };
}


================================================================================
// APPENDED FROM REPO: diplomat-bit/jocall3-node | ORIGINAL PATH: diplomat-bit-jocall3-node-fae6abf/src/resources/corporate/risk/risk.ts
================================================================================

// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../../resource';
import * as FraudAPI from './fraud';
import { Fraud, FraudListRulesParams, FraudListRulesResponse } from './fraud';

export class Risk extends APIResource {
  fraud: FraudAPI.Fraud = new FraudAPI.Fraud(this._client);
}

Risk.Fraud = Fraud;

export declare namespace Risk {
  export {
    Fraud as Fraud,
    type FraudListRulesResponse as FraudListRulesResponse,
    type FraudListRulesParams as FraudListRulesParams,
  };
}


================================================================================
// APPENDED FROM REPO: diplomat-bit/jocall3-typescript | ORIGINAL PATH: diplomat-bit-jocall3-typescript-b730718/src/resources/corporate/risk/risk.ts
================================================================================

// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../../core/resource';
import * as FraudAPI from './fraud/fraud';
import { Fraud } from './fraud/fraud';

export class Risk extends APIResource {
  fraud: FraudAPI.Fraud = new FraudAPI.Fraud(this._client);
}

Risk.Fraud = Fraud;

export declare namespace Risk {
  export { Fraud as Fraud };
}
