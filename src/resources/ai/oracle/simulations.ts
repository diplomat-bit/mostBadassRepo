// REPOSITORY SOURCE: diplomat-bit/garbage-typescript | PATH: diplomat-bit-garbage-typescript-95791a2/src/resources/ai/oracle/simulations.ts
================================================================================

// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../../core/resource';
import { APIPromise } from '../../../core/api-promise';
import { RequestOptions } from '../../../internal/request-options';
import { path } from '../../../internal/utils/path';

export class Simulations extends APIResource {
  /**
   * Get Specific Simulation Result
   *
   * @example
   * ```ts
   * const simulation =
   *   await client.ai.oracle.simulations.retrieve('string');
   * ```
   */
  retrieve(simulationID: string, options?: RequestOptions): APIPromise<SimulationRetrieveResponse> {
    return this._client.get(path`/ai/oracle/simulations/${simulationID}`, options);
  }

  /**
   * List All Past Simulations
   *
   * @example
   * ```ts
   * const simulations =
   *   await client.ai.oracle.simulations.list();
   * ```
   */
  list(options?: RequestOptions): APIPromise<SimulationListResponse> {
    return this._client.get('/ai/oracle/simulations', options);
  }
}

export interface SimulationRetrieveResponse {
  simulationId: string;

  status: string;

  outcomeNarrative?: string;

  projectedValue?: number;
}

export interface SimulationListResponse {
  data?: Array<SimulationListResponse.Data>;
}

export namespace SimulationListResponse {
  export interface Data {
    simulationId: string;

    status: string;

    outcomeNarrative?: string;

    projectedValue?: number;
  }
}

export declare namespace Simulations {
  export {
    type SimulationRetrieveResponse as SimulationRetrieveResponse,
    type SimulationListResponse as SimulationListResponse,
  };
}


================================================================================
// APPENDED FROM REPO: diplomat-bit/jocall3-typescript | ORIGINAL PATH: diplomat-bit-jocall3-typescript-b730718/src/resources/ai/oracle/simulations.ts
================================================================================

// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../../core/resource';
import { APIPromise } from '../../../core/api-promise';
import { RequestOptions } from '../../../internal/request-options';
import { path } from '../../../internal/utils/path';

export class Simulations extends APIResource {
  /**
   * Retrieves the full, detailed results of a specific financial simulation by its
   * ID.
   *
   * @example
   * ```ts
   * const simulation =
   *   await client.ai.oracle.simulations.retrieve(
   *     'sim_oracle-growth-2024-xyz',
   *   );
   * ```
   */
  retrieve(simulationID: string, options?: RequestOptions): APIPromise<SimulationRetrieveResponse> {
    return this._client.get(path`/ai/oracle/simulations/${simulationID}`, options);
  }

  /**
   * Retrieves a list of all financial simulations previously run by the user,
   * including their status and summaries.
   *
   * @example
   * ```ts
   * const simulations =
   *   await client.ai.oracle.simulations.list();
   * ```
   */
  list(query: SimulationListParams | null | undefined = {}, options?: RequestOptions): APIPromise<unknown> {
    return this._client.get('/ai/oracle/simulations', { query, ...options });
  }
}

export type SimulationRetrieveResponse = SimulationRetrieveResponse.RiskAnalysis | unknown;

export namespace SimulationRetrieveResponse {
  export interface RiskAnalysis {
    /**
     * AI-driven risk assessment of the simulated scenario.
     */
    riskAnalysis?: unknown;
  }
}

export type SimulationListResponse = unknown;

export interface SimulationListParams {
  /**
   * Maximum number of items to return in a single page.
   */
  limit?: number;

  /**
   * Number of items to skip before starting to collect the result set.
   */
  offset?: number;
}

export declare namespace Simulations {
  export {
    type SimulationRetrieveResponse as SimulationRetrieveResponse,
    type SimulationListResponse as SimulationListResponse,
    type SimulationListParams as SimulationListParams,
  };
}
