// REPOSITORY SOURCE: diplomat-bit/garbage-typescript | PATH: diplomat-bit-garbage-typescript-95791a2/src/resources/sustainability/sustainability.ts
================================================================================

// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../core/resource';
import * as ImpactAPI from './impact';
import {
  Impact,
  ImpactListGlobalGreenProjectsParams,
  ImpactListGlobalGreenProjectsResponse,
  ImpactRetrievePortfolioImpactResponse,
} from './impact';
import * as OffsetsAPI from './offsets';
import { OffsetPurchaseCreditsParams, OffsetRetireCreditsParams, Offsets } from './offsets';
import { APIPromise } from '../../core/api-promise';
import { RequestOptions } from '../../internal/request-options';

export class Sustainability extends APIResource {
  offsets: OffsetsAPI.Offsets = new OffsetsAPI.Offsets(this._client);
  impact: ImpactAPI.Impact = new ImpactAPI.Impact(this._client);

  /**
   * Analysis of ledger data through Gemini to estimate CO2e output.
   *
   * @example
   * ```ts
   * const response =
   *   await client.sustainability.retrieveCarbonFootprint();
   * ```
   */
  retrieveCarbonFootprint(
    options?: RequestOptions,
  ): APIPromise<SustainabilityRetrieveCarbonFootprintResponse> {
    return this._client.get('/sustainability/carbon-footprint', options);
  }
}

export interface SustainabilityRetrieveCarbonFootprintResponse {
  period: string;

  status: 'OPTIMAL' | 'HIGH_OUTPUT' | 'CRITICAL';

  totalKgCO2e: number;

  aiRecommendations?: Array<string>;

  breakdown?: Array<SustainabilityRetrieveCarbonFootprintResponse.Breakdown>;
}

export namespace SustainabilityRetrieveCarbonFootprintResponse {
  export interface Breakdown {
    category?: string;

    value?: number;
  }
}

Sustainability.Offsets = Offsets;
Sustainability.Impact = Impact;

export declare namespace Sustainability {
  export { type SustainabilityRetrieveCarbonFootprintResponse as SustainabilityRetrieveCarbonFootprintResponse };

  export {
    Offsets as Offsets,
    type OffsetPurchaseCreditsParams as OffsetPurchaseCreditsParams,
    type OffsetRetireCreditsParams as OffsetRetireCreditsParams,
  };

  export {
    Impact as Impact,
    type ImpactListGlobalGreenProjectsResponse as ImpactListGlobalGreenProjectsResponse,
    type ImpactRetrievePortfolioImpactResponse as ImpactRetrievePortfolioImpactResponse,
    type ImpactListGlobalGreenProjectsParams as ImpactListGlobalGreenProjectsParams,
  };
}


================================================================================
// APPENDED FROM REPO: diplomat-bit/jocall3-node | ORIGINAL PATH: diplomat-bit-jocall3-node-fae6abf/src/resources/sustainability/sustainability.ts
================================================================================

// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../resource';
import * as Core from '../../core';
import * as ImpactAPI from './impact';
import { Impact } from './impact';
import * as OffsetsAPI from './offsets';
import { Offsets } from './offsets';

export class Sustainability extends APIResource {
  offsets: OffsetsAPI.Offsets = new OffsetsAPI.Offsets(this._client);
  impact: ImpactAPI.Impact = new ImpactAPI.Impact(this._client);

  /**
   * Generates a detailed report of the user's estimated carbon footprint based on
   * transaction data, lifestyle choices, and AI-driven impact assessments, offering
   * insights and reduction strategies.
   */
  getFootprint(options?: Core.RequestOptions): Core.APIPromise<unknown> {
    return this._client.get('/sustainability/carbon-footprint', options);
  }
}

export type SustainabilityGetFootprintResponse = unknown;

Sustainability.Offsets = Offsets;
Sustainability.Impact = Impact;

export declare namespace Sustainability {
  export { type SustainabilityGetFootprintResponse as SustainabilityGetFootprintResponse };

  export { Offsets as Offsets };

  export { Impact as Impact };
}


================================================================================
// APPENDED FROM REPO: diplomat-bit/jocall3-typescript | ORIGINAL PATH: diplomat-bit-jocall3-typescript-b730718/src/resources/sustainability/sustainability.ts
================================================================================

// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../core/resource';
import * as ImpactAPI from './impact';
import { Impact } from './impact';
import * as OffsetsAPI from './offsets';
import { Offsets } from './offsets';
import { APIPromise } from '../../core/api-promise';
import { RequestOptions } from '../../internal/request-options';

export class Sustainability extends APIResource {
  offsets: OffsetsAPI.Offsets = new OffsetsAPI.Offsets(this._client);
  impact: ImpactAPI.Impact = new ImpactAPI.Impact(this._client);

  /**
   * Generates a detailed report of the user's estimated carbon footprint based on
   * transaction data, lifestyle choices, and AI-driven impact assessments, offering
   * insights and reduction strategies.
   */
  retrieveCarbonFootprint(options?: RequestOptions): APIPromise<unknown> {
    return this._client.get('/sustainability/carbon-footprint', options);
  }
}

export type SustainabilityRetrieveCarbonFootprintResponse = unknown;

Sustainability.Offsets = Offsets;
Sustainability.Impact = Impact;

export declare namespace Sustainability {
  export { type SustainabilityRetrieveCarbonFootprintResponse as SustainabilityRetrieveCarbonFootprintResponse };

  export { Offsets as Offsets };

  export { Impact as Impact };
}
