// REPOSITORY SOURCE: diplomat-bit/garbage-typescript | PATH: diplomat-bit-garbage-typescript-95791a2/src/resources/users/me/security.ts
================================================================================

// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../../core/resource';
import { APIPromise } from '../../../core/api-promise';
import { RequestOptions } from '../../../internal/request-options';

export class Security extends APIResource {
  /**
   * Retrieve Security Access Logs
   *
   * @example
   * ```ts
   * const response =
   *   await client.users.me.security.retrieveLog();
   * ```
   */
  retrieveLog(
    query: SecurityRetrieveLogParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<SecurityRetrieveLogResponse> {
    return this._client.get('/users/me/security/log', { query, ...options });
  }

  /**
   * Rotate API/Access Keys
   *
   * @example
   * ```ts
   * const response =
   *   await client.users.me.security.rotateKeys();
   * ```
   */
  rotateKeys(options?: RequestOptions): APIPromise<SecurityRotateKeysResponse> {
    return this._client.post('/users/me/security/rotate-keys', options);
  }
}

export interface SecurityRetrieveLogResponse {
  data?: Array<SecurityRetrieveLogResponse.Data>;
}

export namespace SecurityRetrieveLogResponse {
  export interface Data {
    event?: string;

    ipAddress?: string;

    location?: Data.Location;

    timestamp?: string;
  }

  export namespace Data {
    export interface Location {
      city?: string;

      country?: string;

      latitude?: number;

      longitude?: number;
    }
  }
}

export interface SecurityRotateKeysResponse {
  newExpiry?: string;

  status?: string;
}

export interface SecurityRetrieveLogParams {
  limit?: number;

  offset?: number;
}

export declare namespace Security {
  export {
    type SecurityRetrieveLogResponse as SecurityRetrieveLogResponse,
    type SecurityRotateKeysResponse as SecurityRotateKeysResponse,
    type SecurityRetrieveLogParams as SecurityRetrieveLogParams,
  };
}


================================================================================
// APPENDED FROM REPO: diplomat-bit/jocall3-node | ORIGINAL PATH: diplomat-bit-jocall3-node-fae6abf/src/resources/users/me/security.ts
================================================================================

// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../../resource';

export class Security extends APIResource {}


================================================================================
// APPENDED FROM REPO: diplomat-bit/jocall3-typescript | ORIGINAL PATH: diplomat-bit-jocall3-typescript-b730718/src/resources/users/me/security.ts
================================================================================

// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../../core/resource';

export class Security extends APIResource {}
