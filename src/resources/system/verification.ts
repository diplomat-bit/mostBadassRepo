// REPOSITORY SOURCE: diplomat-bit/garbage-typescript | PATH: diplomat-bit-garbage-typescript-95791a2/src/resources/system/verification.ts
================================================================================

// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../core/resource';
import { APIPromise } from '../../core/api-promise';
import { buildHeaders } from '../../internal/headers';
import { RequestOptions } from '../../internal/request-options';

export class Verification extends APIResource {
  /**
   * Compare biometric samples
   *
   * @example
   * ```ts
   * await client.system.verification.compareBiometric({
   *   sample_a: 'string',
   *   sample_b: 'string',
   * });
   * ```
   */
  compareBiometric(body: VerificationCompareBiometricParams, options?: RequestOptions): APIPromise<void> {
    return this._client.post('/system/verification/biometric-comparison', {
      body,
      ...options,
      headers: buildHeaders([{ Accept: '*/*' }, options?.headers]),
    });
  }

  /**
   * Verify identity document
   *
   * @example
   * ```ts
   * await client.system.verification.verifyDocument();
   * ```
   */
  verifyDocument(options?: RequestOptions): APIPromise<void> {
    return this._client.post('/system/verification/document', {
      ...options,
      headers: buildHeaders([{ Accept: '*/*' }, options?.headers]),
    });
  }
}

export interface VerificationCompareBiometricParams {
  sample_a: string;

  sample_b: string;
}

export declare namespace Verification {
  export { type VerificationCompareBiometricParams as VerificationCompareBiometricParams };
}


================================================================================
// APPENDED FROM REPO: diplomat-bit/jocall3-typescript | ORIGINAL PATH: diplomat-bit-jocall3-typescript-b730718/src/resources/system/verification.ts
================================================================================

// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../core/resource';

export class Verification extends APIResource {}
