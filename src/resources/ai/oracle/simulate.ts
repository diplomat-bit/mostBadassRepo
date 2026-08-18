// REPOSITORY SOURCE: diplomat-bit/garbage-typescript | PATH: diplomat-bit-garbage-typescript-95791a2/src/resources/ai/oracle/simulate.ts
================================================================================

// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../../core/resource';
import { APIPromise } from '../../../core/api-promise';
import { buildHeaders } from '../../../internal/headers';
import { RequestOptions } from '../../../internal/request-options';

export class Simulate extends APIResource {
  /**
   * Run a 'What-If' Financial Simulation (Standard)
   *
   * @example
   * ```ts
   * const simulate = await client.ai.oracle.simulate.create({
   *   prompt: 'string',
   *   parameters: {},
   * });
   * ```
   */
  create(body: SimulateCreateParams, options?: RequestOptions): APIPromise<SimulateCreateResponse> {
    return this._client.post('/ai/oracle/simulate', { body, ...options });
  }

  /**
   * run Advanced Simulation
   *
   * @example
   * ```ts
   * const response = await client.ai.oracle.simulate.advanced({
   *   prompt: 'string',
   *   scenarios: [
   *     { name: 'string', description: 'string' },
   *     { name: 'string', description: 'string' },
   *   ],
   * });
   * ```
   */
  advanced(body: SimulateAdvancedParams, options?: RequestOptions): APIPromise<SimulateAdvancedResponse> {
    return this._client.post('/ai/oracle/simulate/advanced', { body, ...options });
  }

  /**
   * run Monte Carlo Simulation
   *
   * @example
   * ```ts
   * await client.ai.oracle.simulate.monteCarlo({
   *   iterations: 2896,
   *   variables: ['string', 'string'],
   * });
   * ```
   */
  monteCarlo(body: SimulateMonteCarloParams, options?: RequestOptions): APIPromise<void> {
    return this._client.post('/ai/oracle/simulate/monte-carlo', {
      body,
      ...options,
      headers: buildHeaders([{ Accept: '*/*' }, options?.headers]),
    });
  }
}

export interface SimulateCreateResponse {
  simulationId: string;

  status: string;

  outcomeNarrative?: string;

  projectedValue?: number;
}

export interface SimulateAdvancedResponse {
  simulationId: string;

  status: string;

  outcomeNarrative?: string;

  projectedValue?: number;
}

export interface SimulateCreateParams {
  /**
   * Describe the financial scenario
   */
  prompt: string;

  /**
   * Key variables like duration, rate, or amount
   */
  parameters?: unknown;
}

export interface SimulateAdvancedParams {
  prompt: string;

  scenarios: Array<SimulateAdvancedParams.Scenario>;
}

export namespace SimulateAdvancedParams {
  export interface Scenario {
    name: string;

    description?: string;
  }
}

export interface SimulateMonteCarloParams {
  iterations: number;

  variables: Array<string>;
}

export declare namespace Simulate {
  export {
    type SimulateCreateResponse as SimulateCreateResponse,
    type SimulateAdvancedResponse as SimulateAdvancedResponse,
    type SimulateCreateParams as SimulateCreateParams,
    type SimulateAdvancedParams as SimulateAdvancedParams,
    type SimulateMonteCarloParams as SimulateMonteCarloParams,
  };
}


================================================================================
// APPENDED FROM REPO: diplomat-bit/jocall3-node | ORIGINAL PATH: diplomat-bit-jocall3-node-fae6abf/src/resources/ai/oracle/simulate.ts
================================================================================

// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../../resource';
import * as Core from '../../../core';

export class Simulate extends APIResource {
  /**
   * Engages the Quantum Oracle for highly complex, multi-variable simulations,
   * allowing precise control over numerous financial parameters, market conditions,
   * and personal events to generate deep, predictive insights and sensitivity
   * analysis.
   *
   * @example
   * ```ts
   * const response =
   *   await client.ai.oracle.simulate.runAdvanced();
   * ```
   */
  runAdvanced(body: SimulateRunAdvancedParams, options?: Core.RequestOptions): Core.APIPromise<unknown> {
    return this._client.post('/ai/oracle/simulate/advanced', { body, ...options });
  }

  /**
   * Submits a hypothetical scenario to the Quantum Oracle AI for standard financial
   * impact analysis. The AI simulates the effect on the user's current financial
   * state and provides a summary.
   *
   * @example
   * ```ts
   * const response =
   *   await client.ai.oracle.simulate.runStandard();
   * ```
   */
  runStandard(
    body: SimulateRunStandardParams,
    options?: Core.RequestOptions,
  ): Core.APIPromise<SimulateRunStandardResponse> {
    return this._client.post('/ai/oracle/simulate', { body, ...options });
  }
}

export type SimulateRunAdvancedResponse = unknown;

export interface SimulateRunStandardResponse {
  /**
   * AI-driven risk assessment of the simulated scenario.
   */
  riskAnalysis?: unknown;
}

export interface SimulateRunAdvancedParams {
  /**
   * Optional: Global economic conditions to apply to all scenarios.
   */
  globalEconomicFactors?: unknown;

  /**
   * Optional: Personal financial assumptions to override defaults.
   */
  personalAssumptions?: unknown;
}

export interface SimulateRunStandardParams {}

export declare namespace Simulate {
  export {
    type SimulateRunAdvancedResponse as SimulateRunAdvancedResponse,
    type SimulateRunStandardResponse as SimulateRunStandardResponse,
    type SimulateRunAdvancedParams as SimulateRunAdvancedParams,
    type SimulateRunStandardParams as SimulateRunStandardParams,
  };
}


================================================================================
// APPENDED FROM REPO: diplomat-bit/jocall3-typescript | ORIGINAL PATH: diplomat-bit-jocall3-typescript-b730718/src/resources/ai/oracle/simulate.ts
================================================================================

// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../../core/resource';
import { APIPromise } from '../../../core/api-promise';
import { RequestOptions } from '../../../internal/request-options';

export class Simulate extends APIResource {
  /**
   * Engages the Quantum Oracle for highly complex, multi-variable simulations,
   * allowing precise control over numerous financial parameters, market conditions,
   * and personal events to generate deep, predictive insights and sensitivity
   * analysis.
   *
   * @example
   * ```ts
   * const response =
   *   await client.ai.oracle.simulate.runAdvanced();
   * ```
   */
  runAdvanced(body: SimulateRunAdvancedParams, options?: RequestOptions): APIPromise<unknown> {
    return this._client.post('/ai/oracle/simulate/advanced', { body, ...options });
  }

  /**
   * Submits a hypothetical scenario to the Quantum Oracle AI for standard financial
   * impact analysis. The AI simulates the effect on the user's current financial
   * state and provides a summary.
   *
   * @example
   * ```ts
   * const response =
   *   await client.ai.oracle.simulate.runStandard();
   * ```
   */
  runStandard(
    body: SimulateRunStandardParams,
    options?: RequestOptions,
  ): APIPromise<SimulateRunStandardResponse> {
    return this._client.post('/ai/oracle/simulate', { body, ...options });
  }
}

export type SimulateRunAdvancedResponse = unknown;

export interface SimulateRunStandardResponse {
  /**
   * AI-driven risk assessment of the simulated scenario.
   */
  riskAnalysis?: unknown;
}

export interface SimulateRunAdvancedParams {
  /**
   * Optional: Global economic conditions to apply to all scenarios.
   */
  globalEconomicFactors?: unknown;

  /**
   * Optional: Personal financial assumptions to override defaults.
   */
  personalAssumptions?: unknown;
}

export interface SimulateRunStandardParams {}

export declare namespace Simulate {
  export {
    type SimulateRunAdvancedResponse as SimulateRunAdvancedResponse,
    type SimulateRunStandardResponse as SimulateRunStandardResponse,
    type SimulateRunAdvancedParams as SimulateRunAdvancedParams,
    type SimulateRunStandardParams as SimulateRunStandardParams,
  };
}
