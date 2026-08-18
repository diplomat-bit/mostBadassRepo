// REPOSITORY SOURCE: diplomat-bit/garbage-typescript | PATH: diplomat-bit-garbage-typescript-95791a2/src/resources/payments/international.ts
================================================================================

// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../core/resource';
import { APIPromise } from '../../core/api-promise';
import { buildHeaders } from '../../internal/headers';
import { RequestOptions } from '../../internal/request-options';
import { path } from '../../internal/utils/path';

export class International extends APIResource {
  /**
   * EU SEPA Credit Transfer
   *
   * @example
   * ```ts
   * await client.payments.international.executeSepa({
   *   amount: 4090.998569865607,
   *   iban: 'string',
   * });
   * ```
   */
  executeSepa(body: InternationalExecuteSepaParams, options?: RequestOptions): APIPromise<void> {
    return this._client.post('/payments/international/sepa', {
      body,
      ...options,
      headers: buildHeaders([{ Accept: '*/*' }, options?.headers]),
    });
  }

  /**
   * Global SWIFT Transaction
   *
   * @example
   * ```ts
   * await client.payments.international.executeSwift({
   *   amount: 981.8703637183601,
   *   bic: 'string',
   *   currency: 'string',
   *   iban: 'string',
   * });
   * ```
   */
  executeSwift(body: InternationalExecuteSwiftParams, options?: RequestOptions): APIPromise<void> {
    return this._client.post('/payments/international/swift', {
      body,
      ...options,
      headers: buildHeaders([{ Accept: '*/*' }, options?.headers]),
    });
  }

  /**
   * Get international payment status
   *
   * @example
   * ```ts
   * const response =
   *   await client.payments.international.getStatus('string');
   * ```
   */
  getStatus(paymentID: string, options?: RequestOptions): APIPromise<InternationalGetStatusResponse> {
    return this._client.get(path`/payments/international/${paymentID}/status`, options);
  }
}

export interface InternationalGetStatusResponse {
  fx_rate?: number;

  status?: string;
}

export interface InternationalExecuteSepaParams {
  amount: number;

  iban: string;
}

export interface InternationalExecuteSwiftParams {
  amount: number;

  bic: string;

  currency: string;

  iban: string;
}

export declare namespace International {
  export {
    type InternationalGetStatusResponse as InternationalGetStatusResponse,
    type InternationalExecuteSepaParams as InternationalExecuteSepaParams,
    type InternationalExecuteSwiftParams as InternationalExecuteSwiftParams,
  };
}


================================================================================
// APPENDED FROM REPO: diplomat-bit/jocall3-node | ORIGINAL PATH: diplomat-bit-jocall3-node-fae6abf/src/resources/payments/international.ts
================================================================================

// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../resource';

export class International extends APIResource {}


================================================================================
// APPENDED FROM REPO: diplomat-bit/jocall3-typescript | ORIGINAL PATH: diplomat-bit-jocall3-typescript-b730718/src/resources/payments/international.ts
================================================================================

// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../core/resource';
import { APIPromise } from '../../core/api-promise';
import { RequestOptions } from '../../internal/request-options';
import { path } from '../../internal/utils/path';

export class International extends APIResource {
  /**
   * Retrieves the current processing status and details of an initiated
   * international payment.
   *
   * @example
   * ```ts
   * const response =
   *   await client.payments.international.retrieveStatus(
   *     'int_pmt_xyz7890',
   *   );
   * ```
   */
  retrieveStatus(paymentID: string, options?: RequestOptions): APIPromise<unknown> {
    return this._client.get(path`/payments/international/${paymentID}/status`, options);
  }
}

export type InternationalRetrieveStatusResponse = unknown;

export declare namespace International {
  export { type InternationalRetrieveStatusResponse as InternationalRetrieveStatusResponse };
}
