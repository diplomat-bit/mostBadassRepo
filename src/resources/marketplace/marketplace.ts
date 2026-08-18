// REPOSITORY SOURCE: diplomat-bit/garbage-typescript | PATH: diplomat-bit-garbage-typescript-95791a2/src/resources/marketplace/marketplace.ts
================================================================================

// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../core/resource';
import * as OffersAPI from './offers';
import { OfferListOffersResponse, Offers } from './offers';
import { APIPromise } from '../../core/api-promise';
import { RequestOptions } from '../../internal/request-options';

export class Marketplace extends APIResource {
  offers: OffersAPI.Offers = new OffersAPI.Offers(this._client);

  /**
   * List Financial Products & Add-ons
   *
   * @example
   * ```ts
   * const response = await client.marketplace.listProducts();
   * ```
   */
  listProducts(options?: RequestOptions): APIPromise<MarketplaceListProductsResponse> {
    return this._client.get('/marketplace/products', options);
  }
}

export interface MarketplaceListProductsResponse {
  data?: Array<unknown>;
}

Marketplace.Offers = Offers;

export declare namespace Marketplace {
  export { type MarketplaceListProductsResponse as MarketplaceListProductsResponse };

  export { Offers as Offers, type OfferListOffersResponse as OfferListOffersResponse };
}


================================================================================
// APPENDED FROM REPO: diplomat-bit/jocall3-node | ORIGINAL PATH: diplomat-bit-jocall3-node-fae6abf/src/resources/marketplace/marketplace.ts
================================================================================

// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../resource';
import { isRequestOptions } from '../../core';
import * as Core from '../../core';
import * as OffersAPI from './offers';
import { OfferRedeemParams, OfferRedeemResponse, Offers } from './offers';

export class Marketplace extends APIResource {
  offers: OffersAPI.Offers = new OffersAPI.Offers(this._client);

  /**
   * Retrieves a personalized, AI-curated list of products and services from the
   * Plato AI marketplace, tailored to the user's financial profile, goals, and
   * spending patterns. Includes options for filtering and advanced search.
   *
   * @example
   * ```ts
   * const response = await client.marketplace.listProducts();
   * ```
   */
  listProducts(
    query?: MarketplaceListProductsParams,
    options?: Core.RequestOptions,
  ): Core.APIPromise<unknown>;
  listProducts(options?: Core.RequestOptions): Core.APIPromise<unknown>;
  listProducts(
    query: MarketplaceListProductsParams | Core.RequestOptions = {},
    options?: Core.RequestOptions,
  ): Core.APIPromise<unknown> {
    if (isRequestOptions(query)) {
      return this.listProducts({}, query);
    }
    return this._client.get('/marketplace/products', { query, ...options });
  }
}

export type MarketplaceListProductsResponse = unknown;

export interface MarketplaceListProductsParams {
  /**
   * Filter by AI personalization level (e.g., low, medium, high). 'High' means
   * highly relevant to user's specific needs.
   */
  aiPersonalizationLevel?: string;

  /**
   * Filter products by category (e.g., loans, insurance, credit_cards, investments).
   */
  category?: string;

  /**
   * Maximum number of items to return in a single page.
   */
  limit?: number;

  /**
   * Minimum user rating for products (0-5).
   */
  minRating?: number;

  /**
   * Number of items to skip before starting to collect the result set.
   */
  offset?: number;
}

Marketplace.Offers = Offers;

export declare namespace Marketplace {
  export {
    type MarketplaceListProductsResponse as MarketplaceListProductsResponse,
    type MarketplaceListProductsParams as MarketplaceListProductsParams,
  };

  export {
    Offers as Offers,
    type OfferRedeemResponse as OfferRedeemResponse,
    type OfferRedeemParams as OfferRedeemParams,
  };
}


================================================================================
// APPENDED FROM REPO: diplomat-bit/jocall3-typescript | ORIGINAL PATH: diplomat-bit-jocall3-typescript-b730718/src/resources/marketplace/marketplace.ts
================================================================================

// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../core/resource';
import * as OffersAPI from './offers';
import { Offers } from './offers';

export class Marketplace extends APIResource {
  offers: OffersAPI.Offers = new OffersAPI.Offers(this._client);
}

Marketplace.Offers = Offers;

export declare namespace Marketplace {
  export { Offers as Offers };
}
