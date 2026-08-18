// REPOSITORY SOURCE: diplomat-bit/garbage-typescript | PATH: diplomat-bit-garbage-typescript-95791a2/src/resources/marketplace/offers.ts
================================================================================

// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../core/resource';
import { APIPromise } from '../../core/api-promise';
import { buildHeaders } from '../../internal/headers';
import { RequestOptions } from '../../internal/request-options';
import { path } from '../../internal/utils/path';

export class Offers extends APIResource {
  /**
   * List AI-Targeted Loyalty Offers
   *
   * @example
   * ```ts
   * const response =
   *   await client.marketplace.offers.listOffers();
   * ```
   */
  listOffers(options?: RequestOptions): APIPromise<OfferListOffersResponse> {
    return this._client.get('/marketplace/offers', options);
  }

  /**
   * Redeem Marketplace Reward
   *
   * @example
   * ```ts
   * await client.marketplace.offers.redeemOffer('string');
   * ```
   */
  redeemOffer(offerID: string, options?: RequestOptions): APIPromise<void> {
    return this._client.post(path`/marketplace/offers/${offerID}/redeem`, {
      ...options,
      headers: buildHeaders([{ Accept: '*/*' }, options?.headers]),
    });
  }
}

export interface OfferListOffersResponse {
  data?: Array<unknown>;
}

export declare namespace Offers {
  export { type OfferListOffersResponse as OfferListOffersResponse };
}


================================================================================
// APPENDED FROM REPO: diplomat-bit/jocall3-node | ORIGINAL PATH: diplomat-bit-jocall3-node-fae6abf/src/resources/marketplace/offers.ts
================================================================================

// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../resource';
import * as Core from '../../core';

export class Offers extends APIResource {
  /**
   * Redeems a personalized, exclusive offer from the Plato AI marketplace, often
   * resulting in a discount, special rate, or credit to the user's account.
   *
   * @example
   * ```ts
   * const response = await client.marketplace.offers.redeem(
   *   'offer_home_ins_promo_1',
   * );
   * ```
   */
  redeem(
    offerId: string,
    body?: OfferRedeemParams | null | undefined,
    options?: Core.RequestOptions,
  ): Core.APIPromise<unknown> {
    return this._client.post(`/marketplace/offers/${offerId}/redeem`, { body, ...options });
  }
}

export type OfferRedeemResponse = unknown;

export interface OfferRedeemParams {}

export declare namespace Offers {
  export { type OfferRedeemResponse as OfferRedeemResponse, type OfferRedeemParams as OfferRedeemParams };
}


================================================================================
// APPENDED FROM REPO: diplomat-bit/jocall3-typescript | ORIGINAL PATH: diplomat-bit-jocall3-typescript-b730718/src/resources/marketplace/offers.ts
================================================================================

// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../core/resource';

export class Offers extends APIResource {}
