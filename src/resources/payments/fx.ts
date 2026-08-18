// REPOSITORY SOURCE: diplomat-bit/garbage-typescript | PATH: diplomat-bit-garbage-typescript-95791a2/src/resources/payments/fx.ts
================================================================================

// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../core/resource';
import { APIPromise } from '../../core/api-promise';
import { buildHeaders } from '../../internal/headers';
import { RequestOptions } from '../../internal/request-options';

export class Fx extends APIResource {
  /**
   * Book a Forward FX Deal
   *
   * @example
   * ```ts
   * await client.payments.fx.bookDeal({
   *   amount: 9860.991425096323,
   *   pair: 'string',
   *   valueDate: '1972-06-20',
   * });
   * ```
   */
  bookDeal(body: FxBookDealParams, options?: RequestOptions): APIPromise<void> {
    return this._client.post('/payments/fx/deals', {
      body,
      ...options,
      headers: buildHeaders([{ Accept: '*/*' }, options?.headers]),
    });
  }

  /**
   * Execute Currency Conversion
   *
   * @example
   * ```ts
   * await client.payments.fx.executeConversion({
   *   amount: 7305.266093092808,
   *   from: 'string',
   *   to: 'string',
   * });
   * ```
   */
  executeConversion(body: FxExecuteConversionParams, options?: RequestOptions): APIPromise<void> {
    return this._client.post('/payments/fx/convert', {
      body,
      ...options,
      headers: buildHeaders([{ Accept: '*/*' }, options?.headers]),
    });
  }

  /**
   * Market FX Rates
   *
   * @example
   * ```ts
   * const response = await client.payments.fx.getRates({
   *   pair: 'EURUSD',
   * });
   * ```
   */
  getRates(query: FxGetRatesParams, options?: RequestOptions): APIPromise<FxGetRatesResponse> {
    return this._client.get('/payments/fx/rates', { query, ...options });
  }
}

export interface FxGetRatesResponse {
  midRate?: number;

  timestamp?: string;
}

export interface FxBookDealParams {
  amount: number;

  pair: string;

  valueDate: string;
}

export interface FxExecuteConversionParams {
  amount: number;

  from: string;

  to: string;
}

export interface FxGetRatesParams {
  pair: string;
}

export declare namespace Fx {
  export {
    type FxGetRatesResponse as FxGetRatesResponse,
    type FxBookDealParams as FxBookDealParams,
    type FxExecuteConversionParams as FxExecuteConversionParams,
    type FxGetRatesParams as FxGetRatesParams,
  };
}


================================================================================
// APPENDED FROM REPO: diplomat-bit/jocall3-node | ORIGINAL PATH: diplomat-bit-jocall3-node-fae6abf/src/resources/payments/fx.ts
================================================================================

// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../resource';
import { isRequestOptions } from '../../core';
import * as Core from '../../core';

export class Fx extends APIResource {
  /**
   * Executes an instant currency conversion between two currencies, either from a
   * balance or into a specified account.
   *
   * @example
   * ```ts
   * const response = await client.payments.fx.convert();
   * ```
   */
  convert(body: FxConvertParams, options?: Core.RequestOptions): Core.APIPromise<unknown> {
    return this._client.post('/payments/fx/convert', { body, ...options });
  }

  /**
   * Retrieves current and AI-predicted future foreign exchange rates for a specified
   * currency pair, including bid/ask spreads and historical volatility data for
   * informed decisions.
   *
   * @example
   * ```ts
   * const response = await client.payments.fx.getRates();
   * ```
   */
  getRates(query?: FxGetRatesParams, options?: Core.RequestOptions): Core.APIPromise<FxGetRatesResponse>;
  getRates(options?: Core.RequestOptions): Core.APIPromise<FxGetRatesResponse>;
  getRates(
    query: FxGetRatesParams | Core.RequestOptions = {},
    options?: Core.RequestOptions,
  ): Core.APIPromise<FxGetRatesResponse> {
    if (isRequestOptions(query)) {
      return this.getRates({}, query);
    }
    return this._client.get('/payments/fx/rates', { query, ...options });
  }
}

export type FxConvertResponse = unknown;

export interface FxGetRatesResponse {
  /**
   * Real-time foreign exchange rates.
   */
  currentRate: unknown;

  historicalVolatility?: unknown;
}

export interface FxConvertParams {}

export interface FxGetRatesParams {
  /**
   * The base currency code (e.g., USD).
   */
  baseCurrency?: string;

  /**
   * Number of days into the future to provide an AI-driven prediction.
   */
  forecastDays?: number;

  /**
   * The target currency code (e.g., EUR).
   */
  targetCurrency?: string;
}

export declare namespace Fx {
  export {
    type FxConvertResponse as FxConvertResponse,
    type FxGetRatesResponse as FxGetRatesResponse,
    type FxConvertParams as FxConvertParams,
    type FxGetRatesParams as FxGetRatesParams,
  };
}


================================================================================
// APPENDED FROM REPO: diplomat-bit/jocall3-typescript | ORIGINAL PATH: diplomat-bit-jocall3-typescript-b730718/src/resources/payments/fx.ts
================================================================================

// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../core/resource';
import { APIPromise } from '../../core/api-promise';
import { RequestOptions } from '../../internal/request-options';

export class Fx extends APIResource {
  /**
   * Executes an instant currency conversion between two currencies, either from a
   * balance or into a specified account.
   *
   * @example
   * ```ts
   * const response = await client.payments.fx.convertCurrency();
   * ```
   */
  convertCurrency(body: FxConvertCurrencyParams, options?: RequestOptions): APIPromise<unknown> {
    return this._client.post('/payments/fx/convert', { body, ...options });
  }

  /**
   * Retrieves current and AI-predicted future foreign exchange rates for a specified
   * currency pair, including bid/ask spreads and historical volatility data for
   * informed decisions.
   *
   * @example
   * ```ts
   * const response = await client.payments.fx.retrieveRates();
   * ```
   */
  retrieveRates(
    query: FxRetrieveRatesParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<FxRetrieveRatesResponse> {
    return this._client.get('/payments/fx/rates', { query, ...options });
  }
}

export type FxConvertCurrencyResponse = unknown;

export interface FxRetrieveRatesResponse {
  /**
   * Real-time foreign exchange rates.
   */
  currentRate: unknown;

  historicalVolatility?: unknown;
}

export interface FxConvertCurrencyParams {}

export interface FxRetrieveRatesParams {
  /**
   * The base currency code (e.g., USD).
   */
  baseCurrency?: string;

  /**
   * Number of days into the future to provide an AI-driven prediction.
   */
  forecastDays?: number;

  /**
   * The target currency code (e.g., EUR).
   */
  targetCurrency?: string;
}

export declare namespace Fx {
  export {
    type FxConvertCurrencyResponse as FxConvertCurrencyResponse,
    type FxRetrieveRatesResponse as FxRetrieveRatesResponse,
    type FxConvertCurrencyParams as FxConvertCurrencyParams,
    type FxRetrieveRatesParams as FxRetrieveRatesParams,
  };
}
