// REPOSITORY SOURCE: diplomat-bit/garbage-typescript | PATH: diplomat-bit-garbage-typescript-95791a2/src/resources/corporate/anomalies.ts
================================================================================

// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../core/resource';
import { APIPromise } from '../../core/api-promise';
import { buildHeaders } from '../../internal/headers';
import { RequestOptions } from '../../internal/request-options';
import { path } from '../../internal/utils/path';

export class Anomalies extends APIResource {
  /**
   * List detected anomalies
   *
   * @example
   * ```ts
   * const response =
   *   await client.corporate.anomalies.listDetected();
   * ```
   */
  listDetected(options?: RequestOptions): APIPromise<AnomalyListDetectedResponse> {
    return this._client.get('/corporate/anomalies', options);
  }

  /**
   * Update anomaly status
   *
   * @example
   * ```ts
   * await client.corporate.anomalies.updateStatus('string', {
   *   status: 'investigating',
   * });
   * ```
   */
  updateStatus(
    anomalyID: string,
    body: AnomalyUpdateStatusParams,
    options?: RequestOptions,
  ): APIPromise<void> {
    return this._client.put(path`/corporate/anomalies/${anomalyID}/status`, {
      body,
      ...options,
      headers: buildHeaders([{ Accept: '*/*' }, options?.headers]),
    });
  }
}

export interface AnomalyListDetectedResponse {
  data?: Array<unknown>;
}

export interface AnomalyUpdateStatusParams {
  status: 'dismissed' | 'investigating' | 'resolved';
}

export declare namespace Anomalies {
  export {
    type AnomalyListDetectedResponse as AnomalyListDetectedResponse,
    type AnomalyUpdateStatusParams as AnomalyUpdateStatusParams,
  };
}


================================================================================
// APPENDED FROM REPO: diplomat-bit/jocall3-typescript | ORIGINAL PATH: diplomat-bit-jocall3-typescript-b730718/src/resources/corporate/anomalies.ts
================================================================================

// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../core/resource';
import { APIPromise } from '../../core/api-promise';
import { RequestOptions } from '../../internal/request-options';
import { path } from '../../internal/utils/path';

export class Anomalies extends APIResource {
  /**
   * Retrieves a comprehensive list of AI-detected financial anomalies across
   * transactions, payments, and corporate cards that require immediate review and
   * potential action to mitigate risk and ensure compliance.
   *
   * @example
   * ```ts
   * const anomalies = await client.corporate.anomalies.list();
   * ```
   */
  list(query: AnomalyListParams | null | undefined = {}, options?: RequestOptions): APIPromise<unknown> {
    return this._client.get('/corporate/anomalies', { query, ...options });
  }

  /**
   * Updates the review status of a specific financial anomaly, allowing compliance
   * officers to mark it as dismissed, resolved, or escalate for further
   * investigation after thorough AI-assisted and human review.
   *
   * @example
   * ```ts
   * const response =
   *   await client.corporate.anomalies.updateStatus(
   *     'anom_risk-2024-07-21-D1E2F3',
   *   );
   * ```
   */
  updateStatus(
    anomalyID: string,
    body: AnomalyUpdateStatusParams,
    options?: RequestOptions,
  ): APIPromise<unknown> {
    return this._client.put(path`/corporate/anomalies/${anomalyID}/status`, { body, ...options });
  }
}

export type AnomalyListResponse = unknown;

export type AnomalyUpdateStatusResponse = unknown;

export interface AnomalyListParams {
  /**
   * End date for filtering results (inclusive, YYYY-MM-DD).
   */
  endDate?: string;

  /**
   * Filter anomalies by the type of financial entity they are related to.
   */
  entityType?: string;

  /**
   * Maximum number of items to return in a single page.
   */
  limit?: number;

  /**
   * Number of items to skip before starting to collect the result set.
   */
  offset?: number;

  /**
   * Filter anomalies by their AI-assessed severity level.
   */
  severity?: string;

  /**
   * Start date for filtering results (inclusive, YYYY-MM-DD).
   */
  startDate?: string;

  /**
   * Filter anomalies by their current review status.
   */
  status?: string;
}

export interface AnomalyUpdateStatusParams {}

export declare namespace Anomalies {
  export {
    type AnomalyListResponse as AnomalyListResponse,
    type AnomalyUpdateStatusResponse as AnomalyUpdateStatusResponse,
    type AnomalyListParams as AnomalyListParams,
    type AnomalyUpdateStatusParams as AnomalyUpdateStatusParams,
  };
}
