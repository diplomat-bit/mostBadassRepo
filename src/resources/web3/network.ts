// REPOSITORY SOURCE: diplomat-bit/garbage-typescript | PATH: diplomat-bit-garbage-typescript-95791a2/src/resources/web3/network.ts
================================================================================

// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../core/resource';
import { APIPromise } from '../../core/api-promise';
import { RequestOptions } from '../../internal/request-options';

export class Network extends APIResource {
  /**
   * Get Blockchain Network Health
   *
   * @example
   * ```ts
   * const response = await client.web3.network.getStatus();
   * ```
   */
  getStatus(options?: RequestOptions): APIPromise<NetworkGetStatusResponse> {
    return this._client.get('/web3/network/status', options);
  }
}

export interface NetworkGetStatusResponse {
  ethereum?: unknown;

  polygon?: unknown;

  solana?: unknown;
}

export declare namespace Network {
  export { type NetworkGetStatusResponse as NetworkGetStatusResponse };
}
