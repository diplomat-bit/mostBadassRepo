// REPOSITORY SOURCE: diplomat-bit/garbage-typescript | PATH: diplomat-bit-garbage-typescript-95791a2/src/resources/corporate/treasury/treasury.ts
================================================================================

// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../../core/resource';
import * as CashFlowAPI from './cash-flow';
import { CashFlow, CashFlowForecastParams, CashFlowForecastResponse } from './cash-flow';
import * as LiquidityAPI from './liquidity';
import {
  Liquidity,
  LiquidityConfigurePoolingParams,
  LiquidityOptimizeParams,
  LiquidityOptimizeResponse,
} from './liquidity';
import * as SweepingAPI from './sweeping';
import { Sweeping, SweepingConfigureRulesParams, SweepingExecuteSweepParams } from './sweeping';
import { APIPromise } from '../../../core/api-promise';
import { buildHeaders } from '../../../internal/headers';
import { RequestOptions } from '../../../internal/request-options';

export class Treasury extends APIResource {
  cashFlow: CashFlowAPI.CashFlow = new CashFlowAPI.CashFlow(this._client);
  liquidity: LiquidityAPI.Liquidity = new LiquidityAPI.Liquidity(this._client);
  sweeping: SweepingAPI.Sweeping = new SweepingAPI.Sweeping(this._client);

  /**
   * Execute bulk payouts
   *
   * @example
   * ```ts
   * await client.corporate.treasury.executeBulkPayouts({
   *   payouts: [
   *     { recipient_id: 'string', amount: 5744.972374072148 },
   *     { recipient_id: 'string', amount: 4503.646628538282 },
   *   ],
   * });
   * ```
   */
  executeBulkPayouts(body: TreasuryExecuteBulkPayoutsParams, options?: RequestOptions): APIPromise<void> {
    return this._client.post('/corporate/treasury/bulk-payouts', {
      body,
      ...options,
      headers: buildHeaders([{ Accept: '*/*' }, options?.headers]),
    });
  }

  /**
   * Get current liquidity positions
   *
   * @example
   * ```ts
   * const response =
   *   await client.corporate.treasury.getLiquidityPositions();
   * ```
   */
  getLiquidityPositions(options?: RequestOptions): APIPromise<TreasuryGetLiquidityPositionsResponse> {
    return this._client.get('/corporate/treasury/liquidity-positions', options);
  }
}

export interface TreasuryGetLiquidityPositionsResponse {
  positions?: Array<unknown>;

  total_liquidity?: number;
}

export interface TreasuryExecuteBulkPayoutsParams {
  payouts: Array<TreasuryExecuteBulkPayoutsParams.Payout>;
}

export namespace TreasuryExecuteBulkPayoutsParams {
  export interface Payout {
    amount?: number;

    recipient_id?: string;
  }
}

Treasury.CashFlow = CashFlow;
Treasury.Liquidity = Liquidity;
Treasury.Sweeping = Sweeping;

export declare namespace Treasury {
  export {
    type TreasuryGetLiquidityPositionsResponse as TreasuryGetLiquidityPositionsResponse,
    type TreasuryExecuteBulkPayoutsParams as TreasuryExecuteBulkPayoutsParams,
  };

  export {
    CashFlow as CashFlow,
    type CashFlowForecastResponse as CashFlowForecastResponse,
    type CashFlowForecastParams as CashFlowForecastParams,
  };

  export {
    Liquidity as Liquidity,
    type LiquidityOptimizeResponse as LiquidityOptimizeResponse,
    type LiquidityConfigurePoolingParams as LiquidityConfigurePoolingParams,
    type LiquidityOptimizeParams as LiquidityOptimizeParams,
  };

  export {
    Sweeping as Sweeping,
    type SweepingConfigureRulesParams as SweepingConfigureRulesParams,
    type SweepingExecuteSweepParams as SweepingExecuteSweepParams,
  };
}


================================================================================
// APPENDED FROM REPO: diplomat-bit/jocall3-node | ORIGINAL PATH: diplomat-bit-jocall3-node-fae6abf/src/resources/corporate/treasury/treasury.ts
================================================================================

// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../../resource';
import { isRequestOptions } from '../../../core';
import * as Core from '../../../core';
import * as SweepingAPI from './sweeping';
import { Sweeping } from './sweeping';

export class Treasury extends APIResource {
  sweeping: SweepingAPI.Sweeping = new SweepingAPI.Sweeping(this._client);

  /**
   * Retrieves an advanced AI-driven cash flow forecast for the organization,
   * projecting liquidity, identifying potential surpluses or deficits, and providing
   * recommendations for optimal treasury management.
   *
   * @example
   * ```ts
   * const response =
   *   await client.corporate.treasury.forecastCashFlow();
   * ```
   */
  forecastCashFlow(
    query?: TreasuryForecastCashFlowParams,
    options?: Core.RequestOptions,
  ): Core.APIPromise<TreasuryForecastCashFlowResponse>;
  forecastCashFlow(options?: Core.RequestOptions): Core.APIPromise<TreasuryForecastCashFlowResponse>;
  forecastCashFlow(
    query: TreasuryForecastCashFlowParams | Core.RequestOptions = {},
    options?: Core.RequestOptions,
  ): Core.APIPromise<TreasuryForecastCashFlowResponse> {
    if (isRequestOptions(query)) {
      return this.forecastCashFlow({}, query);
    }
    return this._client.get('/corporate/treasury/cash-flow/forecast', { query, ...options });
  }
}

export interface TreasuryForecastCashFlowResponse {
  /**
   * Forecast of cash inflows by source.
   */
  inflowForecast: unknown;

  /**
   * Forecast of cash outflows by category.
   */
  outflowForecast: unknown;
}

export interface TreasuryForecastCashFlowParams {
  /**
   * The number of days into the future for which to generate the cash flow forecast
   * (e.g., 30, 90, 180).
   */
  forecastHorizonDays?: number;

  /**
   * If true, the forecast will include best-case and worst-case scenario analysis
   * alongside the most likely projection.
   */
  includeScenarioAnalysis?: boolean;
}

Treasury.Sweeping = Sweeping;

export declare namespace Treasury {
  export {
    type TreasuryForecastCashFlowResponse as TreasuryForecastCashFlowResponse,
    type TreasuryForecastCashFlowParams as TreasuryForecastCashFlowParams,
  };

  export { Sweeping as Sweeping };
}


================================================================================
// APPENDED FROM REPO: diplomat-bit/jocall3-typescript | ORIGINAL PATH: diplomat-bit-jocall3-typescript-b730718/src/resources/corporate/treasury/treasury.ts
================================================================================

// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../../core/resource';
import * as PoolingAPI from './pooling';
import { Pooling } from './pooling';
import * as SweepingAPI from './sweeping';
import { Sweeping } from './sweeping';
import { APIPromise } from '../../../core/api-promise';
import { RequestOptions } from '../../../internal/request-options';

export class Treasury extends APIResource {
  sweeping: SweepingAPI.Sweeping = new SweepingAPI.Sweeping(this._client);
  pooling: PoolingAPI.Pooling = new PoolingAPI.Pooling(this._client);

  /**
   * Retrieves an advanced AI-driven cash flow forecast for the organization,
   * projecting liquidity, identifying potential surpluses or deficits, and providing
   * recommendations for optimal treasury management.
   *
   * @example
   * ```ts
   * const response =
   *   await client.corporate.treasury.retrieveCashFlowForecast();
   * ```
   */
  retrieveCashFlowForecast(
    query: TreasuryRetrieveCashFlowForecastParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<TreasuryRetrieveCashFlowForecastResponse> {
    return this._client.get('/corporate/treasury/cash-flow/forecast', { query, ...options });
  }

  /**
   * Provides a real-time overview of the organization's liquidity across all
   * accounts, currencies, and short-term investments.
   *
   * @example
   * ```ts
   * const response =
   *   await client.corporate.treasury.retrieveLiquidityPositions();
   * ```
   */
  retrieveLiquidityPositions(
    options?: RequestOptions,
  ): APIPromise<TreasuryRetrieveLiquidityPositionsResponse> {
    return this._client.get('/corporate/treasury/liquidity-positions', options);
  }
}

export interface TreasuryRetrieveCashFlowForecastResponse {
  /**
   * Forecast of cash inflows by source.
   */
  inflowForecast: unknown;

  /**
   * Forecast of cash outflows by category.
   */
  outflowForecast: unknown;
}

export interface TreasuryRetrieveLiquidityPositionsResponse {
  /**
   * AI's overall assessment of liquidity.
   */
  aiLiquidityAssessment: unknown;

  /**
   * Details on short-term investments contributing to liquidity.
   */
  shortTermInvestments: unknown;
}

export interface TreasuryRetrieveCashFlowForecastParams {
  /**
   * The number of days into the future for which to generate the cash flow forecast
   * (e.g., 30, 90, 180).
   */
  forecastHorizonDays?: number;

  /**
   * If true, the forecast will include best-case and worst-case scenario analysis
   * alongside the most likely projection.
   */
  includeScenarioAnalysis?: boolean;
}

Treasury.Sweeping = Sweeping;
Treasury.Pooling = Pooling;

export declare namespace Treasury {
  export {
    type TreasuryRetrieveCashFlowForecastResponse as TreasuryRetrieveCashFlowForecastResponse,
    type TreasuryRetrieveLiquidityPositionsResponse as TreasuryRetrieveLiquidityPositionsResponse,
    type TreasuryRetrieveCashFlowForecastParams as TreasuryRetrieveCashFlowForecastParams,
  };

  export { Sweeping as Sweeping };

  export { Pooling as Pooling };
}
