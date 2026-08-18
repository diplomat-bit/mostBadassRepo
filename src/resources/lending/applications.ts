// REPOSITORY SOURCE: diplomat-bit/garbage-typescript | PATH: diplomat-bit-garbage-typescript-95791a2/src/resources/lending/applications.ts
================================================================================

// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../core/resource';
import { APIPromise } from '../../core/api-promise';
import { RequestOptions } from '../../internal/request-options';
import { path } from '../../internal/utils/path';

export class Applications extends APIResource {
  /**
   * Submit Advanced Credit Application
   *
   * @example
   * ```ts
   * const response = await client.lending.applications.submit({
   *   amount: 3369.535449899852,
   *   employmentData: {
   *     employer: 'string',
   *     monthlyIncome: 22.870503510263873,
   *     tenureMonths: 5190,
   *   },
   *   loanType: 'BUSINESS_EXPANSION',
   *   termMonths: 7703,
   *   collateralId: 'string',
   * });
   * ```
   */
  submit(body: ApplicationSubmitParams, options?: RequestOptions): APIPromise<ApplicationSubmitResponse> {
    return this._client.post('/lending/applications', { body, ...options });
  }

  /**
   * Track Loan Processing
   *
   * @example
   * ```ts
   * const response =
   *   await client.lending.applications.trackStatus('string');
   * ```
   */
  trackStatus(appID: string, options?: RequestOptions): APIPromise<ApplicationTrackStatusResponse> {
    return this._client.get(path`/lending/applications/${appID}/status`, options);
  }
}

export interface ApplicationSubmitResponse {
  applicationId?: string;

  status?: string;
}

export interface ApplicationTrackStatusResponse {
  status?: string;

  underwriterQueuePos?: number;
}

export interface ApplicationSubmitParams {
  amount: number;

  employmentData: ApplicationSubmitParams.EmploymentData;

  loanType: 'MORTGAGE' | 'PERSONAL' | 'AUTO' | 'BUSINESS_EXPANSION';

  termMonths: number;

  assets?: Array<unknown>;

  collateralId?: string;

  liabilities?: Array<unknown>;
}

export namespace ApplicationSubmitParams {
  export interface EmploymentData {
    employer: string;

    monthlyIncome: number;

    tenureMonths?: number;
  }
}

export declare namespace Applications {
  export {
    type ApplicationSubmitResponse as ApplicationSubmitResponse,
    type ApplicationTrackStatusResponse as ApplicationTrackStatusResponse,
    type ApplicationSubmitParams as ApplicationSubmitParams,
  };
}


================================================================================
// APPENDED FROM REPO: diplomat-bit/jocall3-typescript | ORIGINAL PATH: diplomat-bit-jocall3-typescript-b730718/src/resources/lending/applications.ts
================================================================================

// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../core/resource';

export class Applications extends APIResource {}
