// REPOSITORY SOURCE: diplomat-bit/garbage-typescript | PATH: diplomat-bit-garbage-typescript-95791a2/src/resources/ai/incubator/pitch.ts
================================================================================

// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../../core/resource';
import { APIPromise } from '../../../core/api-promise';
import { buildHeaders } from '../../../internal/headers';
import { RequestOptions } from '../../../internal/request-options';
import { path } from '../../../internal/utils/path';

export class Pitch extends APIResource {
  /**
   * Submit a High-Potential Business Plan
   *
   * @example
   * ```ts
   * const pitch = await client.ai.incubator.pitch.create({
   *   businessPlan: 'string',
   *   financialProjections: {},
   *   foundingTeam: [],
   *   marketOpportunity: 'string',
   * });
   * ```
   */
  create(body: PitchCreateParams, options?: RequestOptions): APIPromise<PitchCreateResponse> {
    return this._client.post('/ai/incubator/pitch', { body, ...options });
  }

  /**
   * Get Full Pitch AI Deep Dive
   *
   * @example
   * ```ts
   * const response =
   *   await client.ai.incubator.pitch.retrieveDetails('string');
   * ```
   */
  retrieveDetails(pitchID: string, options?: RequestOptions): APIPromise<PitchRetrieveDetailsResponse> {
    return this._client.get(path`/ai/incubator/pitch/${pitchID}/details`, options);
  }

  /**
   * Submit Answers to AI Follow-up Questions
   *
   * @example
   * ```ts
   * await client.ai.incubator.pitch.updateFeedback('string', {
   *   answers: [],
   * });
   * ```
   */
  updateFeedback(
    pitchID: string,
    body: PitchUpdateFeedbackParams,
    options?: RequestOptions,
  ): APIPromise<void> {
    return this._client.put(path`/ai/incubator/pitch/${pitchID}/feedback`, {
      body,
      ...options,
      headers: buildHeaders([{ Accept: '*/*' }, options?.headers]),
    });
  }
}

export interface PitchCreateResponse {
  pitchId?: string;

  status?: string;
}

export interface PitchRetrieveDetailsResponse {
  aiFeedback?: string;

  fundingEligibility?: boolean;
}

export interface PitchCreateParams {
  /**
   * Full text of the concept
   */
  businessPlan: string;

  financialProjections: unknown;

  foundingTeam: Array<unknown>;

  marketOpportunity: string;
}

export interface PitchUpdateFeedbackParams {
  answers: Array<unknown>;
}

export declare namespace Pitch {
  export {
    type PitchCreateResponse as PitchCreateResponse,
    type PitchRetrieveDetailsResponse as PitchRetrieveDetailsResponse,
    type PitchCreateParams as PitchCreateParams,
    type PitchUpdateFeedbackParams as PitchUpdateFeedbackParams,
  };
}


================================================================================
// APPENDED FROM REPO: diplomat-bit/jocall3-typescript | ORIGINAL PATH: diplomat-bit-jocall3-typescript-b730718/src/resources/ai/incubator/pitch.ts
================================================================================

// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../../core/resource';
import { APIPromise } from '../../../core/api-promise';
import { RequestOptions } from '../../../internal/request-options';
import { path } from '../../../internal/utils/path';

export class Pitch extends APIResource {
  /**
   * Retrieves the granular AI-driven analysis, strategic feedback, market validation
   * results, and any outstanding questions from Quantum Weaver for a specific
   * business pitch.
   *
   * @example
   * ```ts
   * const response =
   *   await client.ai.incubator.pitch.retrieveDetails(
   *     'pitch_qw_synergychain-xyz',
   *   );
   * ```
   */
  retrieveDetails(pitchID: string, options?: RequestOptions): APIPromise<PitchRetrieveDetailsResponse> {
    return this._client.get(path`/ai/incubator/pitch/${pitchID}/details`, options);
  }

  /**
   * Allows the entrepreneur to respond to specific questions or provide additional
   * details requested by Quantum Weaver, moving the pitch forward in the incubation
   * process.
   *
   * @example
   * ```ts
   * const response =
   *   await client.ai.incubator.pitch.submitFeedback(
   *     'pitch_qw_synergychain-xyz',
   *   );
   * ```
   */
  submitFeedback(
    pitchID: string,
    body?: PitchSubmitFeedbackParams | null | undefined,
    options?: RequestOptions,
  ): APIPromise<unknown> {
    return this._client.put(path`/ai/incubator/pitch/${pitchID}/feedback`, { body, ...options });
  }
}

export interface PitchRetrieveDetailsResponse {
  /**
   * AI-generated coaching plan for the entrepreneur.
   */
  aiCoachingPlan?: unknown;

  /**
   * AI's detailed financial model analysis.
   */
  aiFinancialModel?: PitchRetrieveDetailsResponse.AIFinancialModel;

  /**
   * AI's detailed market analysis.
   */
  aiMarketAnalysis?: unknown;

  /**
   * AI's assessment of risks associated with the venture.
   */
  aiRiskAssessment?: unknown;
}

export namespace PitchRetrieveDetailsResponse {
  /**
   * AI's detailed financial model analysis.
   */
  export interface AIFinancialModel {
    costStructureAnalysis?: unknown;

    revenueBreakdown?: unknown;
  }
}

export type PitchSubmitFeedbackResponse = unknown;

export interface PitchSubmitFeedbackParams {}

export declare namespace Pitch {
  export {
    type PitchRetrieveDetailsResponse as PitchRetrieveDetailsResponse,
    type PitchSubmitFeedbackResponse as PitchSubmitFeedbackResponse,
    type PitchSubmitFeedbackParams as PitchSubmitFeedbackParams,
  };
}
