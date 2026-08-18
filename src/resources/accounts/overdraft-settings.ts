// REPOSITORY SOURCE: diplomat-bit/garbage-typescript | PATH: diplomat-bit-garbage-typescript-95791a2/src/resources/accounts/overdraft-settings.ts
================================================================================

// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../core/resource';
import { APIPromise } from '../../core/api-promise';
import { buildHeaders } from '../../internal/headers';
import { RequestOptions } from '../../internal/request-options';
import { path } from '../../internal/utils/path';

export class OverdraftSettings extends APIResource {
  /**
   * Get Overdraft Settings
   *
   * @example
   * ```ts
   * const response =
   *   await client.accounts.overdraftSettings.retrieveOverdraftSettings(
   *     'string',
   *   );
   * ```
   */
  retrieveOverdraftSettings(
    accountID: string,
    options?: RequestOptions,
  ): APIPromise<OverdraftSettingRetrieveOverdraftSettingsResponse> {
    return this._client.get(path`/accounts/${accountID}/overdraft-settings`, options);
  }

  /**
   * Update Overdraft Settings
   *
   * @example
   * ```ts
   * await client.accounts.overdraftSettings.updateOverdraftSettings(
   *   'string',
   *   { enabled: true, limit: 2541.91725603093 },
   * );
   * ```
   */
  updateOverdraftSettings(
    accountID: string,
    body: OverdraftSettingUpdateOverdraftSettingsParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<void> {
    return this._client.put(path`/accounts/${accountID}/overdraft-settings`, {
      body,
      ...options,
      headers: buildHeaders([{ Accept: '*/*' }, options?.headers]),
    });
  }
}

export interface OverdraftSettingRetrieveOverdraftSettingsResponse {
  enabled?: boolean;

  feePreference?: string;

  limit?: number;
}

export interface OverdraftSettingUpdateOverdraftSettingsParams {
  enabled?: boolean;

  limit?: number;
}

export declare namespace OverdraftSettings {
  export {
    type OverdraftSettingRetrieveOverdraftSettingsResponse as OverdraftSettingRetrieveOverdraftSettingsResponse,
    type OverdraftSettingUpdateOverdraftSettingsParams as OverdraftSettingUpdateOverdraftSettingsParams,
  };
}
