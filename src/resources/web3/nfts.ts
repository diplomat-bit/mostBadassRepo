// REPOSITORY SOURCE: diplomat-bit/garbage-typescript | PATH: diplomat-bit-garbage-typescript-95791a2/src/resources/web3/nfts.ts
================================================================================

// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../core/resource';
import { APIPromise } from '../../core/api-promise';
import { buildHeaders } from '../../internal/headers';
import { RequestOptions } from '../../internal/request-options';

export class NFTs extends APIResource {
  /**
   * List NFT Collection
   *
   * @example
   * ```ts
   * const nfts = await client.web3.nfts.list();
   * ```
   */
  list(options?: RequestOptions): APIPromise<NFTListResponse> {
    return this._client.get('/web3/nfts', options);
  }

  /**
   * Mint Utility NFT
   *
   * @example
   * ```ts
   * await client.web3.nfts.mint({ metadataUri: 'string' });
   * ```
   */
  mint(body: NFTMintParams, options?: RequestOptions): APIPromise<void> {
    return this._client.post('/web3/nfts/mint', {
      body,
      ...options,
      headers: buildHeaders([{ Accept: '*/*' }, options?.headers]),
    });
  }
}

export interface NFTListResponse {
  data?: Array<unknown>;
}

export interface NFTMintParams {
  metadataUri: string;
}

export declare namespace NFTs {
  export { type NFTListResponse as NFTListResponse, type NFTMintParams as NFTMintParams };
}


================================================================================
// APPENDED FROM REPO: diplomat-bit/jocall3-node | ORIGINAL PATH: diplomat-bit-jocall3-node-fae6abf/src/resources/web3/nfts.ts
================================================================================

// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../resource';
import { isRequestOptions } from '../../core';
import * as Core from '../../core';

export class NFTs extends APIResource {
  /**
   * Fetches a comprehensive list of Non-Fungible Tokens (NFTs) owned by the user
   * across all connected wallets and supported blockchain networks, including
   * metadata and market values.
   *
   * @example
   * ```ts
   * const nfts = await client.web3.nfts.list();
   * ```
   */
  list(query?: NFTListParams, options?: Core.RequestOptions): Core.APIPromise<unknown>;
  list(options?: Core.RequestOptions): Core.APIPromise<unknown>;
  list(
    query: NFTListParams | Core.RequestOptions = {},
    options?: Core.RequestOptions,
  ): Core.APIPromise<unknown> {
    if (isRequestOptions(query)) {
      return this.list({}, query);
    }
    return this._client.get('/web3/nfts', { query, ...options });
  }
}

export type NFTListResponse = unknown;

export interface NFTListParams {
  /**
   * Maximum number of items to return in a single page.
   */
  limit?: number;

  /**
   * Number of items to skip before starting to collect the result set.
   */
  offset?: number;
}

export declare namespace NFTs {
  export { type NFTListResponse as NFTListResponse, type NFTListParams as NFTListParams };
}


================================================================================
// APPENDED FROM REPO: diplomat-bit/jocall3-typescript | ORIGINAL PATH: diplomat-bit-jocall3-typescript-b730718/src/resources/web3/nfts.ts
================================================================================

// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../core/resource';
import { APIPromise } from '../../core/api-promise';
import { RequestOptions } from '../../internal/request-options';

export class NFTs extends APIResource {
  /**
   * Fetches a comprehensive list of Non-Fungible Tokens (NFTs) owned by the user
   * across all connected wallets and supported blockchain networks, including
   * metadata and market values.
   *
   * @example
   * ```ts
   * const nfts = await client.web3.nfts.list();
   * ```
   */
  list(query: NFTListParams | null | undefined = {}, options?: RequestOptions): APIPromise<unknown> {
    return this._client.get('/web3/nfts', { query, ...options });
  }
}

export type NFTListResponse = unknown;

export interface NFTListParams {
  /**
   * Maximum number of items to return in a single page.
   */
  limit?: number;

  /**
   * Number of items to skip before starting to collect the result set.
   */
  offset?: number;
}

export declare namespace NFTs {
  export { type NFTListResponse as NFTListResponse, type NFTListParams as NFTListParams };
}
