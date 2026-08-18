// REPOSITORY SOURCE: diplomat-bit/garbage-typescript | PATH: diplomat-bit-garbage-typescript-95791a2/src/resources/users/password-reset.ts
================================================================================

// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../core/resource';
import { APIPromise } from '../../core/api-promise';
import { RequestOptions } from '../../internal/request-options';

export class PasswordReset extends APIResource {
  /**
   * Confirm Password Reset with Code
   *
   * @example
   * ```ts
   * const response = await client.users.passwordReset.confirm({
   *   identifier: 'string',
   *   newPassword: 'string',
   *   verificationCode: 'string',
   * });
   * ```
   */
  confirm(
    body: PasswordResetConfirmParams,
    options?: RequestOptions,
  ): APIPromise<PasswordResetConfirmResponse> {
    return this._client.post('/users/password-reset/confirm', { body, ...options });
  }

  /**
   * Initiate Password Reset Flow
   *
   * @example
   * ```ts
   * const response = await client.users.passwordReset.initiate({
   *   identifier: 'string',
   * });
   * ```
   */
  initiate(
    body: PasswordResetInitiateParams,
    options?: RequestOptions,
  ): APIPromise<PasswordResetInitiateResponse> {
    return this._client.post('/users/password-reset/initiate', { body, ...options });
  }
}

export interface PasswordResetConfirmResponse {
  message?: string;
}

export interface PasswordResetInitiateResponse {
  message?: string;
}

export interface PasswordResetConfirmParams {
  identifier: string;

  newPassword: string;

  /**
   * The 6-digit code sent to user
   */
  verificationCode: string;
}

export interface PasswordResetInitiateParams {
  /**
   * Email or phone number
   */
  identifier: string;
}

export declare namespace PasswordReset {
  export {
    type PasswordResetConfirmResponse as PasswordResetConfirmResponse,
    type PasswordResetInitiateResponse as PasswordResetInitiateResponse,
    type PasswordResetConfirmParams as PasswordResetConfirmParams,
    type PasswordResetInitiateParams as PasswordResetInitiateParams,
  };
}


================================================================================
// APPENDED FROM REPO: diplomat-bit/jocall3-typescript | ORIGINAL PATH: diplomat-bit-jocall3-typescript-b730718/src/resources/users/password-reset.ts
================================================================================

// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../core/resource';
import { APIPromise } from '../../core/api-promise';
import { RequestOptions } from '../../internal/request-options';

export class PasswordReset extends APIResource {
  /**
   * Confirms the password reset using the received verification code and sets a new
   * password.
   *
   * @example
   * ```ts
   * const response = await client.users.passwordReset.confirm({
   *   identifier: 'reset.user@example.com',
   *   newPassword: 'MyNewStrongPassword@789',
   *   verificationCode: '654321',
   * });
   * ```
   */
  confirm(
    body: PasswordResetConfirmParams,
    options?: RequestOptions,
  ): APIPromise<PasswordResetConfirmResponse> {
    return this._client.post('/users/password-reset/confirm', { body, ...options });
  }

  /**
   * Starts the password reset flow by sending a verification code or link to the
   * user's registered email or phone.
   *
   * @example
   * ```ts
   * const response = await client.users.passwordReset.initiate({
   *   identifier: 'reset.user@example.com',
   * });
   * ```
   */
  initiate(
    body: PasswordResetInitiateParams,
    options?: RequestOptions,
  ): APIPromise<PasswordResetInitiateResponse> {
    return this._client.post('/users/password-reset/initiate', { body, ...options });
  }
}

export interface PasswordResetConfirmResponse {
  message?: string;
}

export interface PasswordResetInitiateResponse {
  message?: string;
}

export interface PasswordResetConfirmParams {
  identifier: string;

  newPassword: string;

  verificationCode: string;
}

export interface PasswordResetInitiateParams {
  /**
   * Email or phone number
   */
  identifier: string;
}

export declare namespace PasswordReset {
  export {
    type PasswordResetConfirmResponse as PasswordResetConfirmResponse,
    type PasswordResetInitiateResponse as PasswordResetInitiateResponse,
    type PasswordResetConfirmParams as PasswordResetConfirmParams,
    type PasswordResetInitiateParams as PasswordResetInitiateParams,
  };
}
