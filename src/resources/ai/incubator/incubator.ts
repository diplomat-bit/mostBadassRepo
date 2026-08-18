// REPOSITORY SOURCE: diplomat-bit/garbage-typescript | PATH: diplomat-bit-garbage-typescript-95791a2/src/resources/ai/incubator/incubator.ts
================================================================================

// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../../core/resource';
import * as AnalysisAPI from './analysis';
import {
  Analysis,
  AnalysisCompetitorsParams,
  AnalysisCompetitorsResponse,
  AnalysisSwotParams,
  AnalysisSwotResponse,
} from './analysis';
import * as PitchAPI from './pitch';
import {
  Pitch,
  PitchCreateParams,
  PitchCreateResponse,
  PitchRetrieveDetailsResponse,
  PitchUpdateFeedbackParams,
} from './pitch';
import { APIPromise } from '../../../core/api-promise';
import { RequestOptions } from '../../../internal/request-options';

export class Incubator extends APIResource {
  pitch: PitchAPI.Pitch = new PitchAPI.Pitch(this._client);
  analysis: AnalysisAPI.Analysis = new AnalysisAPI.Analysis(this._client);

  /**
   * List All User Business Pitches
   *
   * @example
   * ```ts
   * const response =
   *   await client.ai.incubator.retrievePitches();
   * ```
   */
  retrievePitches(options?: RequestOptions): APIPromise<IncubatorRetrievePitchesResponse> {
    return this._client.get('/ai/incubator/pitches', options);
  }

  /**
   * Rapid Idea Validation Engine
   *
   * @example
   * ```ts
   * const response = await client.ai.incubator.validate({
   *   concept: 'string',
   * });
   * ```
   */
  validate(body: IncubatorValidateParams, options?: RequestOptions): APIPromise<IncubatorValidateResponse> {
    return this._client.post('/ai/incubator/validate', { body, ...options });
  }
}

export interface IncubatorRetrievePitchesResponse {
  data?: Array<unknown>;
}

export interface IncubatorValidateResponse {
  criticalFlaws?: Array<string>;

  feasibilityScore?: number;
}

export interface IncubatorValidateParams {
  concept: string;
}

Incubator.Pitch = Pitch;
Incubator.Analysis = Analysis;

export declare namespace Incubator {
  export {
    type IncubatorRetrievePitchesResponse as IncubatorRetrievePitchesResponse,
    type IncubatorValidateResponse as IncubatorValidateResponse,
    type IncubatorValidateParams as IncubatorValidateParams,
  };

  export {
    Pitch as Pitch,
    type PitchCreateResponse as PitchCreateResponse,
    type PitchRetrieveDetailsResponse as PitchRetrieveDetailsResponse,
    type PitchCreateParams as PitchCreateParams,
    type PitchUpdateFeedbackParams as PitchUpdateFeedbackParams,
  };

  export {
    Analysis as Analysis,
    type AnalysisCompetitorsResponse as AnalysisCompetitorsResponse,
    type AnalysisSwotResponse as AnalysisSwotResponse,
    type AnalysisCompetitorsParams as AnalysisCompetitorsParams,
    type AnalysisSwotParams as AnalysisSwotParams,
  };
}


================================================================================
// APPENDED FROM REPO: diplomat-bit/jocall3-node | ORIGINAL PATH: diplomat-bit-jocall3-node-fae6abf/src/resources/ai/incubator/incubator.ts
================================================================================

// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../../resource';
import * as Core from '../../../core';
import * as AnalysisAPI from './analysis';
import { Analysis } from './analysis';

export class Incubator extends APIResource {
  analysis: AnalysisAPI.Analysis = new AnalysisAPI.Analysis(this._client);

  /**
   * Submits a detailed business plan to the Quantum Weaver AI for rigorous analysis,
   * market validation, and seed funding consideration. This initiates the AI-driven
   * incubation journey, aiming to transform innovative ideas into commercially
   * successful ventures.
   *
   * @example
   * ```ts
   * const response = await client.ai.incubator.generatePitch({
   *   financialProjections: {
   *     seedRoundAmount: 2500000,
   *     valuationPreMoney: 10000000,
   *     projectionYears: 3,
   *     revenueForecast: [500000, 2000000, 6000000],
   *     profitabilityEstimate:
   *       'Achieve profitability within 18 months.',
   *   },
   * });
   * ```
   */
  generatePitch(body: IncubatorGeneratePitchParams, options?: Core.RequestOptions): Core.APIPromise<unknown> {
    return this._client.post('/ai/incubator/pitch', { body, ...options });
  }
}

export type IncubatorGeneratePitchResponse = unknown;

export interface IncubatorGeneratePitchParams {
  /**
   * Key financial metrics and projections for the next 3-5 years.
   */
  financialProjections: unknown;
}

Incubator.Analysis = Analysis;

export declare namespace Incubator {
  export {
    type IncubatorGeneratePitchResponse as IncubatorGeneratePitchResponse,
    type IncubatorGeneratePitchParams as IncubatorGeneratePitchParams,
  };

  export { Analysis as Analysis };
}


================================================================================
// APPENDED FROM REPO: diplomat-bit/jocall3-typescript | ORIGINAL PATH: diplomat-bit-jocall3-typescript-b730718/src/resources/ai/incubator/incubator.ts
================================================================================

// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../../core/resource';
import * as AnalysisAPI from './analysis';
import { Analysis } from './analysis';
import * as PitchAPI from './pitch';
import {
  Pitch,
  PitchRetrieveDetailsResponse,
  PitchSubmitFeedbackParams,
  PitchSubmitFeedbackResponse,
} from './pitch';
import { APIPromise } from '../../../core/api-promise';
import { RequestOptions } from '../../../internal/request-options';

export class Incubator extends APIResource {
  analysis: AnalysisAPI.Analysis = new AnalysisAPI.Analysis(this._client);
  pitch: PitchAPI.Pitch = new PitchAPI.Pitch(this._client);

  /**
   * Retrieves a summary list of all business pitches submitted by the authenticated
   * user to Quantum Weaver.
   *
   * @example
   * ```ts
   * const response = await client.ai.incubator.listPitches();
   * ```
   */
  listPitches(
    query: IncubatorListPitchesParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<unknown> {
    return this._client.get('/ai/incubator/pitches', { query, ...options });
  }

  /**
   * Submits a detailed business plan to the Quantum Weaver AI for rigorous analysis,
   * market validation, and seed funding consideration. This initiates the AI-driven
   * incubation journey, aiming to transform innovative ideas into commercially
   * successful ventures.
   *
   * @example
   * ```ts
   * const response = await client.ai.incubator.submitPitch({
   *   financialProjections: {
   *     seedRoundAmount: 2500000,
   *     valuationPreMoney: 10000000,
   *     projectionYears: 3,
   *     revenueForecast: [500000, 2000000, 6000000],
   *     profitabilityEstimate:
   *       'Achieve profitability within 18 months.',
   *   },
   * });
   * ```
   */
  submitPitch(body: IncubatorSubmitPitchParams, options?: RequestOptions): APIPromise<unknown> {
    return this._client.post('/ai/incubator/pitch', { body, ...options });
  }
}

export type IncubatorListPitchesResponse = unknown;

export type IncubatorSubmitPitchResponse = unknown;

export interface IncubatorListPitchesParams {
  /**
   * Maximum number of items to return in a single page.
   */
  limit?: number;

  /**
   * Number of items to skip before starting to collect the result set.
   */
  offset?: number;

  /**
   * Filter pitches by their current stage.
   */
  status?: string;
}

export interface IncubatorSubmitPitchParams {
  /**
   * Key financial metrics and projections for the next 3-5 years.
   */
  financialProjections: unknown;
}

Incubator.Analysis = Analysis;
Incubator.Pitch = Pitch;

export declare namespace Incubator {
  export {
    type IncubatorListPitchesResponse as IncubatorListPitchesResponse,
    type IncubatorSubmitPitchResponse as IncubatorSubmitPitchResponse,
    type IncubatorListPitchesParams as IncubatorListPitchesParams,
    type IncubatorSubmitPitchParams as IncubatorSubmitPitchParams,
  };

  export { Analysis as Analysis };

  export {
    Pitch as Pitch,
    type PitchRetrieveDetailsResponse as PitchRetrieveDetailsResponse,
    type PitchSubmitFeedbackResponse as PitchSubmitFeedbackResponse,
    type PitchSubmitFeedbackParams as PitchSubmitFeedbackParams,
  };
}
