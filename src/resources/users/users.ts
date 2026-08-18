// REPOSITORY SOURCE: diplomat-bit/garbage-typescript | PATH: diplomat-bit-garbage-typescript-95791a2/src/resources/users/users.ts
================================================================================

// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../core/resource';
import * as PasswordResetAPI from './password-reset';
import {
  PasswordReset,
  PasswordResetConfirmParams,
  PasswordResetConfirmResponse,
  PasswordResetInitiateParams,
  PasswordResetInitiateResponse,
} from './password-reset';
import * as MeAPI from './me/me';
import { Me, MeRetrieveResponse } from './me/me';
import { APIPromise } from '../../core/api-promise';
import { buildHeaders } from '../../internal/headers';
import { RequestOptions } from '../../internal/request-options';

export class Users extends APIResource {
  passwordReset: PasswordResetAPI.PasswordReset = new PasswordResetAPI.PasswordReset(this._client);
  me: MeAPI.Me = new MeAPI.Me(this._client);

  /**
   * login User
   *
   * @example
   * ```ts
   * const response = await client.users.login({
   *   email: 'string',
   *   password: 'string',
   * });
   * ```
   */
  login(body: UserLoginParams, options?: RequestOptions): APIPromise<UserLoginResponse> {
    return this._client.post('/users/login', { body, ...options });
  }

  /**
   * logout User
   *
   * @example
   * ```ts
   * await client.users.logout();
   * ```
   */
  logout(options?: RequestOptions): APIPromise<void> {
    return this._client.post('/users/logout', {
      ...options,
      headers: buildHeaders([{ Accept: '*/*' }, options?.headers]),
    });
  }

  /**
   * register User
   *
   * @example
   * ```ts
   * const response = await client.users.register({
   *   email: 'string',
   *   name: 'string',
   *   password: 'string',
   * });
   * ```
   */
  register(body: UserRegisterParams, options?: RequestOptions): APIPromise<UserRegisterResponse> {
    return this._client.post('/users/register', { body, ...options });
  }
}

export interface UserLoginResponse {
  accessToken: string;

  expiresIn?: number;

  refreshToken?: string;

  tokenType?: string;
}

export interface UserRegisterResponse {
  id: string;

  email: string;

  identityVerified: boolean;

  name: string;

  address?: UserRegisterResponse.Address;

  preferences?: unknown;

  securityStatus?: UserRegisterResponse.SecurityStatus;
}

export namespace UserRegisterResponse {
  export interface Address {
    city: string;

    country: string;

    street: string;

    state?: string;

    zip?: string;
  }

  export interface SecurityStatus {
    lastLogin?: string;

    twoFactorEnabled?: boolean;
  }
}

export interface UserLoginParams {
  email: string;

  password: string;
}

export interface UserRegisterParams {
  email: string;

  name: string;

  password: string;
}

Users.PasswordReset = PasswordReset;
Users.Me = Me;

export declare namespace Users {
  export {
    type UserLoginResponse as UserLoginResponse,
    type UserRegisterResponse as UserRegisterResponse,
    type UserLoginParams as UserLoginParams,
    type UserRegisterParams as UserRegisterParams,
  };

  export {
    PasswordReset as PasswordReset,
    type PasswordResetConfirmResponse as PasswordResetConfirmResponse,
    type PasswordResetInitiateResponse as PasswordResetInitiateResponse,
    type PasswordResetConfirmParams as PasswordResetConfirmParams,
    type PasswordResetInitiateParams as PasswordResetInitiateParams,
  };

  export { Me as Me, type MeRetrieveResponse as MeRetrieveResponse };
}


================================================================================
// APPENDED FROM REPO: diplomat-bit/jocall3-node | ORIGINAL PATH: diplomat-bit-jocall3-node-fae6abf/src/resources/users/users.ts
================================================================================

// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../resource';
import * as Core from '../../core';
import * as MeAPI from './me/me';
import { Me, MeRetrieveResponse, MeUpdateParams, MeUpdateResponse } from './me/me';

export class Users extends APIResource {
  me: MeAPI.Me = new MeAPI.Me(this._client);

  /**
   * Authenticates a user and creates a secure session, returning access tokens. May
   * require MFA depending on user settings.
   *
   * @example
   * ```ts
   * const response = await client.users.login();
   * ```
   */
  login(body: UserLoginParams, options?: Core.RequestOptions): Core.APIPromise<unknown> {
    return this._client.post('/users/login', { body, ...options });
  }

  /**
   * Registers a new user account with , initiating the onboarding process. Requires
   * basic user details.
   *
   * @example
   * ```ts
   * const response = await client.users.register();
   * ```
   */
  register(body: UserRegisterParams, options?: Core.RequestOptions): Core.APIPromise<UserRegisterResponse> {
    return this._client.post('/users/register', { body, ...options });
  }
}

export type UserLoginResponse = unknown;

export interface UserRegisterResponse {
  address?: unknown;

  /**
   * User's personalized preferences for the platform.
   */
  preferences?: UserRegisterResponse.Preferences;

  /**
   * Security-related status for the user account.
   */
  securityStatus?: unknown;
}

export namespace UserRegisterResponse {
  /**
   * User's personalized preferences for the platform.
   */
  export interface Preferences {
    /**
     * Preferred channels for receiving notifications.
     */
    notificationChannels?: unknown;
  }
}

export interface UserLoginParams {}

export interface UserRegisterParams {
  address?: unknown;
}

Users.Me = Me;

export declare namespace Users {
  export {
    type UserLoginResponse as UserLoginResponse,
    type UserRegisterResponse as UserRegisterResponse,
    type UserLoginParams as UserLoginParams,
    type UserRegisterParams as UserRegisterParams,
  };

  export {
    Me as Me,
    type MeRetrieveResponse as MeRetrieveResponse,
    type MeUpdateResponse as MeUpdateResponse,
    type MeUpdateParams as MeUpdateParams,
  };
}


================================================================================
// APPENDED FROM REPO: diplomat-bit/jocall3-typescript | ORIGINAL PATH: diplomat-bit-jocall3-typescript-b730718/src/resources/users/users.ts
================================================================================

// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../core/resource';
import * as PasswordResetAPI from './password-reset';
import {
  PasswordReset,
  PasswordResetConfirmParams,
  PasswordResetConfirmResponse,
  PasswordResetInitiateParams,
  PasswordResetInitiateResponse,
} from './password-reset';
import * as MeAPI from './me/me';
import { Me, MeRetrieveResponse, MeUpdateParams, MeUpdateResponse } from './me/me';
import { APIPromise } from '../../core/api-promise';
import { RequestOptions } from '../../internal/request-options';

export class Users extends APIResource {
  passwordReset: PasswordResetAPI.PasswordReset = new PasswordResetAPI.PasswordReset(this._client);
  me: MeAPI.Me = new MeAPI.Me(this._client);

  /**
   * Authenticates a user and creates a secure session, returning access tokens. May
   * require MFA depending on user settings.
   *
   * @example
   * ```ts
   * const response = await client.users.login({
   *   email: 'quantum.visionary@demobank.com',
   *   password: 'YourSecurePassword123',
   * });
   * ```
   */
  login(body: UserLoginParams, options?: RequestOptions): APIPromise<UserLoginResponse> {
    return this._client.post('/users/login', { body, ...options });
  }

  /**
   * Registers a new user account with , initiating the onboarding process. Requires
   * basic user details.
   *
   * @example
   * ```ts
   * const response = await client.users.register({
   *   email: 'alice.w@example.com',
   *   name: 'Alice Wonderland',
   *   password: 'SecureP@ssw0rd2024!',
   *   phone: '+1-555-987-6543',
   * });
   * ```
   */
  register(body: UserRegisterParams, options?: RequestOptions): APIPromise<UserRegisterResponse> {
    return this._client.post('/users/register', { body, ...options });
  }
}

export interface UserLoginResponse {
  accessToken: string;

  expiresIn: number;

  refreshToken: string;

  tokenType: string;
}

export interface UserRegisterResponse {
  id: string;

  email: string;

  identityVerified: boolean;

  name: string;

  address?: UserRegisterResponse.Address;

  aiPersona?: string;

  dateOfBirth?: string;

  gamificationLevel?: number;

  loyaltyPoints?: number;

  loyaltyTier?: string;

  phone?: string;

  /**
   * User's personalized preferences for the platform.
   */
  preferences?: UserRegisterResponse.Preferences;

  /**
   * Security-related status for the user account.
   */
  securityStatus?: UserRegisterResponse.SecurityStatus;
}

export namespace UserRegisterResponse {
  export interface Address {
    city?: string;

    country?: string;

    state?: string;

    street?: string;

    zip?: string;
  }

  /**
   * User's personalized preferences for the platform.
   */
  export interface Preferences {
    aiInteractionMode?: string;

    dataSharingConsent?: boolean;

    /**
     * Preferred channels for receiving notifications.
     */
    notificationChannels?: Preferences.NotificationChannels;

    preferredLanguage?: string;

    theme?: string;

    transactionGrouping?: string;
  }

  export namespace Preferences {
    /**
     * Preferred channels for receiving notifications.
     */
    export interface NotificationChannels {
      email?: boolean;

      inApp?: boolean;

      push?: boolean;

      sms?: boolean;
    }
  }

  /**
   * Security-related status for the user account.
   */
  export interface SecurityStatus {
    biometricsEnrolled?: boolean;

    lastLogin?: string;

    lastLoginIp?: string;

    twoFactorEnabled?: boolean;
  }
}

export interface UserLoginParams {
  email: string;

  password: string;
}

export interface UserRegisterParams {
  email: string;

  name: string;

  password: string;

  address?: UserRegisterParams.Address;

  phone?: string;
}

export namespace UserRegisterParams {
  export interface Address {
    city?: string;

    country?: string;

    state?: string;

    street?: string;

    zip?: string;
  }
}

Users.PasswordReset = PasswordReset;
Users.Me = Me;

export declare namespace Users {
  export {
    type UserLoginResponse as UserLoginResponse,
    type UserRegisterResponse as UserRegisterResponse,
    type UserLoginParams as UserLoginParams,
    type UserRegisterParams as UserRegisterParams,
  };

  export {
    PasswordReset as PasswordReset,
    type PasswordResetConfirmResponse as PasswordResetConfirmResponse,
    type PasswordResetInitiateResponse as PasswordResetInitiateResponse,
    type PasswordResetConfirmParams as PasswordResetConfirmParams,
    type PasswordResetInitiateParams as PasswordResetInitiateParams,
  };

  export {
    Me as Me,
    type MeRetrieveResponse as MeRetrieveResponse,
    type MeUpdateResponse as MeUpdateResponse,
    type MeUpdateParams as MeUpdateParams,
  };
}
