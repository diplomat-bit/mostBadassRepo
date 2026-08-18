// REPOSITORY SOURCE: diplomat-bit/garbage-typescript | PATH: diplomat-bit-garbage-typescript-95791a2/src/resources/users/me/biometrics.ts
================================================================================

// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../../core/resource';
import { APIPromise } from '../../../core/api-promise';
import { buildHeaders } from '../../../internal/headers';
import { RequestOptions } from '../../../internal/request-options';

export class Biometrics extends APIResource {
  /**
   * Enroll New Biometric Signature
   *
   * @example
   * ```ts
   * await client.users.me.biometrics.enroll({
   *   biometricType: 'facial_recognition',
   *   signature: 'string',
   * });
   * ```
   */
  enroll(body: BiometricEnrollParams, options?: RequestOptions): APIPromise<void> {
    return this._client.post('/users/me/biometrics/enroll', {
      body,
      ...options,
      headers: buildHeaders([{ Accept: '*/*' }, options?.headers]),
    });
  }

  /**
   * Remove All Biometric Data
   *
   * @example
   * ```ts
   * await client.users.me.biometrics.removeAll();
   * ```
   */
  removeAll(options?: RequestOptions): APIPromise<void> {
    return this._client.delete('/users/me/biometrics', {
      ...options,
      headers: buildHeaders([{ Accept: '*/*' }, options?.headers]),
    });
  }

  /**
   * Get Biometric Enrollment Status
   *
   * @example
   * ```ts
   * const response =
   *   await client.users.me.biometrics.retrieveStatus();
   * ```
   */
  retrieveStatus(options?: RequestOptions): APIPromise<BiometricRetrieveStatusResponse> {
    return this._client.get('/users/me/biometrics', options);
  }

  /**
   * Verify Biometric Data for Sensitive Operations
   *
   * @example
   * ```ts
   * const response = await client.users.me.biometrics.verify({
   *   biometricSignature: 'string',
   * });
   * ```
   */
  verify(body: BiometricVerifyParams, options?: RequestOptions): APIPromise<BiometricVerifyResponse> {
    return this._client.post('/users/me/biometrics/verify', { body, ...options });
  }
}

export interface BiometricRetrieveStatusResponse {
  biometricsEnrolled?: boolean;

  lastUsed?: string;
}

export interface BiometricVerifyResponse {
  verificationStatus?: string;
}

export interface BiometricEnrollParams {
  biometricType: 'fingerprint' | 'facial_recognition';

  /**
   * Public key or hash of signature
   */
  signature: string;
}

export interface BiometricVerifyParams {
  biometricSignature: string;
}

export declare namespace Biometrics {
  export {
    type BiometricRetrieveStatusResponse as BiometricRetrieveStatusResponse,
    type BiometricVerifyResponse as BiometricVerifyResponse,
    type BiometricEnrollParams as BiometricEnrollParams,
    type BiometricVerifyParams as BiometricVerifyParams,
  };
}


================================================================================
// APPENDED FROM REPO: diplomat-bit/jocall3-node | ORIGINAL PATH: diplomat-bit-jocall3-node-fae6abf/src/resources/users/me/biometrics.ts
================================================================================

// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../../resource';
import * as Core from '../../../core';

export class Biometrics extends APIResource {
  /**
   * Retrieves the current status of biometric enrollments for the authenticated
   * user.
   *
   * @example
   * ```ts
   * const response =
   *   await client.users.me.biometrics.retrieveStatus();
   * ```
   */
  retrieveStatus(options?: Core.RequestOptions): Core.APIPromise<unknown> {
    return this._client.get('/users/me/biometrics', options);
  }

  /**
   * Performs real-time biometric verification to authorize sensitive actions or
   * access protected resources, using a one-time biometric signature.
   *
   * @example
   * ```ts
   * const response = await client.users.me.biometrics.verify();
   * ```
   */
  verify(body: BiometricVerifyParams, options?: Core.RequestOptions): Core.APIPromise<unknown> {
    return this._client.post('/users/me/biometrics/verify', { body, ...options });
  }
}

/**
 * Current biometric enrollment status for a user.
 */
export type BiometricRetrieveStatusResponse = unknown;

export type BiometricVerifyResponse = unknown;

export interface BiometricVerifyParams {}

export declare namespace Biometrics {
  export {
    type BiometricRetrieveStatusResponse as BiometricRetrieveStatusResponse,
    type BiometricVerifyResponse as BiometricVerifyResponse,
    type BiometricVerifyParams as BiometricVerifyParams,
  };
}


================================================================================
// APPENDED FROM REPO: diplomat-bit/jocall3-typescript | ORIGINAL PATH: diplomat-bit-jocall3-typescript-b730718/src/resources/users/me/biometrics.ts
================================================================================

// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../../core/resource';
import { APIPromise } from '../../../core/api-promise';
import { RequestOptions } from '../../../internal/request-options';

export class Biometrics extends APIResource {
  /**
   * Retrieves the current status of biometric enrollments for the authenticated
   * user.
   *
   * @example
   * ```ts
   * const response =
   *   await client.users.me.biometrics.retrieveStatus();
   * ```
   */
  retrieveStatus(options?: RequestOptions): APIPromise<BiometricRetrieveStatusResponse> {
    return this._client.get('/users/me/biometrics', options);
  }

  /**
   * Performs real-time biometric verification to authorize sensitive actions or
   * access protected resources, using a one-time biometric signature.
   *
   * @example
   * ```ts
   * const response = await client.users.me.biometrics.verify({
   *   biometricSignature:
   *     'base64encoded_one_time_fingerprint_proof',
   *   biometricType: 'fingerprint',
   *   deviceId: 'dev_mobile_android_ddeeff',
   * });
   * ```
   */
  verify(body: BiometricVerifyParams, options?: RequestOptions): APIPromise<BiometricVerifyResponse> {
    return this._client.post('/users/me/biometrics/verify', { body, ...options });
  }
}

/**
 * Current biometric enrollment status for a user.
 */
export interface BiometricRetrieveStatusResponse {
  biometricsEnrolled: boolean;

  enrolledBiometrics: Array<BiometricRetrieveStatusResponse.EnrolledBiometric>;

  lastUsed?: string;
}

export namespace BiometricRetrieveStatusResponse {
  export interface EnrolledBiometric {
    deviceId?: string;

    enrollmentDate?: string;

    type?: string;
  }
}

export interface BiometricVerifyResponse {
  message?: string;

  verificationStatus?: string;
}

export interface BiometricVerifyParams {
  biometricSignature: string;

  biometricType: string;

  deviceId: string;
}

export declare namespace Biometrics {
  export {
    type BiometricRetrieveStatusResponse as BiometricRetrieveStatusResponse,
    type BiometricVerifyResponse as BiometricVerifyResponse,
    type BiometricVerifyParams as BiometricVerifyParams,
  };
}
