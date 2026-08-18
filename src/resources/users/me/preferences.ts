// REPOSITORY SOURCE: diplomat-bit/garbage-typescript | PATH: diplomat-bit-garbage-typescript-95791a2/src/resources/users/me/preferences.ts
================================================================================

// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../../core/resource';
import { APIPromise } from '../../../core/api-promise';
import { RequestOptions } from '../../../internal/request-options';

export class Preferences extends APIResource {
  /**
   * Get User Personalization Preferences
   *
   * @example
   * ```ts
   * const preference =
   *   await client.users.me.preferences.retrieve();
   * ```
   */
  retrieve(options?: RequestOptions): APIPromise<PreferenceRetrieveResponse> {
    return this._client.get('/users/me/preferences', options);
  }

  /**
   * Update User Personalization Preferences
   *
   * @example
   * ```ts
   * const preference = await client.users.me.preferences.update(
   *   { aiInteractionMode: 'string', theme: 'string' },
   * );
   * ```
   */
  update(
    body: PreferenceUpdateParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<PreferenceUpdateResponse> {
    return this._client.put('/users/me/preferences', { body, ...options });
  }
}

export interface PreferenceRetrieveResponse {
  aiInteractionMode?: 'proactive' | 'reactive' | 'silent';

  dataSharingConsent?: boolean;

  preferredLanguage?: string;

  theme?: string;
}

export interface PreferenceUpdateResponse {
  aiInteractionMode?: string;

  theme?: string;
}

export interface PreferenceUpdateParams {
  aiInteractionMode?: string;

  theme?: string;
}

export declare namespace Preferences {
  export {
    type PreferenceRetrieveResponse as PreferenceRetrieveResponse,
    type PreferenceUpdateResponse as PreferenceUpdateResponse,
    type PreferenceUpdateParams as PreferenceUpdateParams,
  };
}


================================================================================
// APPENDED FROM REPO: diplomat-bit/jocall3-typescript | ORIGINAL PATH: diplomat-bit-jocall3-typescript-b730718/src/resources/users/me/preferences.ts
================================================================================

// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../../core/resource';
import { APIPromise } from '../../../core/api-promise';
import { RequestOptions } from '../../../internal/request-options';

export class Preferences extends APIResource {
  /**
   * Retrieves the user's deep personalization preferences, including AI
   * customization settings, notification channel priorities, thematic choices, and
   * data sharing consents.
   *
   * @example
   * ```ts
   * const preference =
   *   await client.users.me.preferences.retrieve();
   * ```
   */
  retrieve(options?: RequestOptions): APIPromise<PreferenceRetrieveResponse> {
    return this._client.get('/users/me/preferences', options);
  }

  /**
   * Updates the user's deep personalization preferences, allowing dynamic control
   * over AI behavior, notification delivery, thematic choices, and data privacy
   * settings.
   *
   * @example
   * ```ts
   * const preference = await client.users.me.preferences.update(
   *   { aiInteractionMode: 'proactive', theme: 'Dark-Quantum' },
   * );
   * ```
   */
  update(
    body: PreferenceUpdateParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<PreferenceUpdateResponse> {
    return this._client.put('/users/me/preferences', { body, ...options });
  }
}

/**
 * User's personalized preferences for the platform.
 */
export interface PreferenceRetrieveResponse {
  aiInteractionMode?: string;

  dataSharingConsent?: boolean;

  /**
   * Preferred channels for receiving notifications.
   */
  notificationChannels?: PreferenceRetrieveResponse.NotificationChannels;

  preferredLanguage?: string;

  theme?: string;

  transactionGrouping?: string;
}

export namespace PreferenceRetrieveResponse {
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
 * User's personalized preferences for the platform.
 */
export interface PreferenceUpdateResponse {
  aiInteractionMode?: string;

  dataSharingConsent?: boolean;

  /**
   * Preferred channels for receiving notifications.
   */
  notificationChannels?: PreferenceUpdateResponse.NotificationChannels;

  preferredLanguage?: string;

  theme?: string;

  transactionGrouping?: string;
}

export namespace PreferenceUpdateResponse {
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

export interface PreferenceUpdateParams {
  aiInteractionMode?: string;

  dataSharingConsent?: boolean;

  /**
   * Preferred channels for receiving notifications.
   */
  notificationChannels?: PreferenceUpdateParams.NotificationChannels;

  preferredLanguage?: string;

  theme?: string;

  transactionGrouping?: string;
}

export namespace PreferenceUpdateParams {
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

export declare namespace Preferences {
  export {
    type PreferenceRetrieveResponse as PreferenceRetrieveResponse,
    type PreferenceUpdateResponse as PreferenceUpdateResponse,
    type PreferenceUpdateParams as PreferenceUpdateParams,
  };
}
