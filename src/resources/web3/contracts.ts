// REPOSITORY SOURCE: diplomat-bit/garbage-typescript | PATH: diplomat-bit-garbage-typescript-95791a2/src/resources/web3/contracts.ts
================================================================================

// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../core/resource';
import { APIPromise } from '../../core/api-promise';
import { buildHeaders } from '../../internal/headers';
import { RequestOptions } from '../../internal/request-options';

export class Contracts extends APIResource {
  /**
   * Deploy Financial Smart Contract
   *
   * @example
   * ```ts
   * await client.web3.contracts.deploy({
   *   abi: {},
   *   bytecode: 'string',
   * });
   * ```
   */
  deploy(body: ContractDeployParams, options?: RequestOptions): APIPromise<void> {
    return this._client.post('/web3/contracts/deploy', {
      body,
      ...options,
      headers: buildHeaders([{ Accept: '*/*' }, options?.headers]),
    });
  }
}

export interface ContractDeployParams {
  abi: unknown;

  bytecode: string;
}

export declare namespace Contracts {
  export { type ContractDeployParams as ContractDeployParams };
}


================================================================================
// APPENDED FROM REPO: diplomat-bit/jocall3-typescript | ORIGINAL PATH: diplomat-bit-jocall3-typescript-b730718/src/resources/web3/contracts.ts
================================================================================

// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../core/resource';

export class Contracts extends APIResource {}
