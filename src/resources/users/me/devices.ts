// REPOSITORY SOURCE: diplomat-bit/garbage-typescript | PATH: diplomat-bit-garbage-typescript-95791a2/src/resources/users/me/devices.ts
================================================================================

// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../../core/resource';
import { APIPromise } from '../../../core/api-promise';
import { buildHeaders } from '../../../internal/headers';
import { RequestOptions } from '../../../internal/request-options';
import { path } from '../../../internal/utils/path';

export class Devices extends APIResource {
  /**
   * List Connected Devices
   *
   * @example
   * ```ts
   * const devices = await client.users.me.devices.list();
   * ```
   */
  list(options?: RequestOptions): APIPromise<DeviceListResponse> {
    return this._client.get('/users/me/devices', options);
  }

  /**
   * De-register a Device
   *
   * @example
   * ```ts
   * await client.users.me.devices.deregister('string');
   * ```
   */
  deregister(deviceID: string, options?: RequestOptions): APIPromise<void> {
    return this._client.delete(path`/users/me/devices/${deviceID}`, {
      ...options,
      headers: buildHeaders([{ Accept: '*/*' }, options?.headers]),
    });
  }

  /**
   * Register New Trusted Device
   *
   * @example
   * ```ts
   * await client.users.me.devices.register({
   *   deviceId: 'string',
   *   type: 'string',
   *   pushToken: 'string',
   * });
   * ```
   */
  register(body: DeviceRegisterParams, options?: RequestOptions): APIPromise<void> {
    return this._client.post('/users/me/devices', {
      body,
      ...options,
      headers: buildHeaders([{ Accept: '*/*' }, options?.headers]),
    });
  }
}

export interface DeviceListResponse {
  data?: Array<DeviceListResponse.Data>;
}

export namespace DeviceListResponse {
  export interface Data {
    id?: string;

    os?: string;

    trustLevel?: 'trusted' | 'untrusted';

    type?: string;
  }
}

export interface DeviceRegisterParams {
  deviceId: string;

  type: string;

  pushToken?: string;
}

export declare namespace Devices {
  export { type DeviceListResponse as DeviceListResponse, type DeviceRegisterParams as DeviceRegisterParams };
}


================================================================================
// APPENDED FROM REPO: diplomat-bit/jocall3-node | ORIGINAL PATH: diplomat-bit-jocall3-node-fae6abf/src/resources/users/me/devices.ts
================================================================================

// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../../resource';
import { isRequestOptions } from '../../../core';
import * as Core from '../../../core';

export class Devices extends APIResource {
  /**
   * Retrieves a list of all devices linked to the user's account, including mobile
   * phones, tablets, and desktops, indicating their last active status and security
   * posture.
   *
   * @example
   * ```ts
   * const devices = await client.users.me.devices.list();
   * ```
   */
  list(query?: DeviceListParams, options?: Core.RequestOptions): Core.APIPromise<unknown>;
  list(options?: Core.RequestOptions): Core.APIPromise<unknown>;
  list(
    query: DeviceListParams | Core.RequestOptions = {},
    options?: Core.RequestOptions,
  ): Core.APIPromise<unknown> {
    if (isRequestOptions(query)) {
      return this.list({}, query);
    }
    return this._client.get('/users/me/devices', { query, ...options });
  }
}

export type DeviceListResponse = unknown;

export interface DeviceListParams {
  /**
   * Maximum number of items to return in a single page.
   */
  limit?: number;

  /**
   * Number of items to skip before starting to collect the result set.
   */
  offset?: number;
}

export declare namespace Devices {
  export { type DeviceListResponse as DeviceListResponse, type DeviceListParams as DeviceListParams };
}


================================================================================
// APPENDED FROM REPO: diplomat-bit/jocall3-typescript | ORIGINAL PATH: diplomat-bit-jocall3-typescript-b730718/src/resources/users/me/devices.ts
================================================================================

// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../../core/resource';
import { APIPromise } from '../../../core/api-promise';
import { RequestOptions } from '../../../internal/request-options';

export class Devices extends APIResource {
  /**
   * Retrieves a list of all devices linked to the user's account, including mobile
   * phones, tablets, and desktops, indicating their last active status and security
   * posture.
   *
   * @example
   * ```ts
   * const devices = await client.users.me.devices.list();
   * ```
   */
  list(
    query: DeviceListParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<DeviceListResponse> {
    return this._client.get('/users/me/devices', { query, ...options });
  }
}

export interface DeviceListResponse {
  data: Array<DeviceListResponse.Data>;

  limit: number;

  offset: number;

  total: number;

  nextOffset?: number;
}

export namespace DeviceListResponse {
  export interface Data {
    id?: string;

    ipAddress?: string;

    lastActive?: string;

    model?: string;

    os?: string;

    pushToken?: string;

    trustLevel?: string;

    type?: string;
  }
}

export interface DeviceListParams {
  /**
   * Maximum number of items to return in a single page.
   */
  limit?: number;

  /**
   * Number of items to skip before starting to collect the result set.
   */
  offset?: number;
}

export declare namespace Devices {
  export { type DeviceListResponse as DeviceListResponse, type DeviceListParams as DeviceListParams };
}
