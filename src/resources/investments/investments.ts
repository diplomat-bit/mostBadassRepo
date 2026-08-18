// REPOSITORY SOURCE: diplomat-bit/garbage-typescript | PATH: diplomat-bit-garbage-typescript-95791a2/src/resources/investments/investments.ts
================================================================================

// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../core/resource';
import * as AssetsAPI from './assets';
import { AssetSearchParams, AssetSearchResponse, Assets } from './assets';
import * as PerformanceAPI from './performance';
import { Performance, PerformanceGetHistoricalParams, PerformanceGetHistoricalResponse } from './performance';
import * as PortfoliosAPI from './portfolios';
import {
  PortfolioCreateParams,
  PortfolioListParams,
  PortfolioListResponse,
  PortfolioRebalanceParams,
  PortfolioRebalanceResponse,
  PortfolioUpdateParams,
  Portfolios,
} from './portfolios';

export class Investments extends APIResource {
  portfolios: PortfoliosAPI.Portfolios = new PortfoliosAPI.Portfolios(this._client);
  assets: AssetsAPI.Assets = new AssetsAPI.Assets(this._client);
  performance: PerformanceAPI.Performance = new PerformanceAPI.Performance(this._client);
}

Investments.Portfolios = Portfolios;
Investments.Assets = Assets;
Investments.Performance = Performance;

export declare namespace Investments {
  export {
    Portfolios as Portfolios,
    type PortfolioListResponse as PortfolioListResponse,
    type PortfolioRebalanceResponse as PortfolioRebalanceResponse,
    type PortfolioCreateParams as PortfolioCreateParams,
    type PortfolioUpdateParams as PortfolioUpdateParams,
    type PortfolioListParams as PortfolioListParams,
    type PortfolioRebalanceParams as PortfolioRebalanceParams,
  };

  export {
    Assets as Assets,
    type AssetSearchResponse as AssetSearchResponse,
    type AssetSearchParams as AssetSearchParams,
  };

  export {
    Performance as Performance,
    type PerformanceGetHistoricalResponse as PerformanceGetHistoricalResponse,
    type PerformanceGetHistoricalParams as PerformanceGetHistoricalParams,
  };
}


================================================================================
// APPENDED FROM REPO: diplomat-bit/jocall3-typescript | ORIGINAL PATH: diplomat-bit-jocall3-typescript-b730718/src/resources/investments/investments.ts
================================================================================

// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../core/resource';
import * as AssetsAPI from './assets';
import { AssetSearchParams, AssetSearchResponse, Assets } from './assets';
import * as PerformanceAPI from './performance';
import { Performance } from './performance';
import * as PortfoliosAPI from './portfolios';
import {
  PortfolioListParams,
  PortfolioListResponse,
  PortfolioRebalanceParams,
  PortfolioRebalanceResponse,
  PortfolioRetrieveResponse,
  PortfolioUpdateParams,
  PortfolioUpdateResponse,
  Portfolios,
} from './portfolios';

export class Investments extends APIResource {
  portfolios: PortfoliosAPI.Portfolios = new PortfoliosAPI.Portfolios(this._client);
  assets: AssetsAPI.Assets = new AssetsAPI.Assets(this._client);
  performance: PerformanceAPI.Performance = new PerformanceAPI.Performance(this._client);
}

Investments.Portfolios = Portfolios;
Investments.Assets = Assets;
Investments.Performance = Performance;

export declare namespace Investments {
  export {
    Portfolios as Portfolios,
    type PortfolioRetrieveResponse as PortfolioRetrieveResponse,
    type PortfolioUpdateResponse as PortfolioUpdateResponse,
    type PortfolioListResponse as PortfolioListResponse,
    type PortfolioRebalanceResponse as PortfolioRebalanceResponse,
    type PortfolioUpdateParams as PortfolioUpdateParams,
    type PortfolioListParams as PortfolioListParams,
    type PortfolioRebalanceParams as PortfolioRebalanceParams,
  };

  export {
    Assets as Assets,
    type AssetSearchResponse as AssetSearchResponse,
    type AssetSearchParams as AssetSearchParams,
  };

  export { Performance as Performance };
}
