// REPOSITORY SOURCE: diplomat-bit/garbage-typescript | PATH: diplomat-bit-garbage-typescript-95791a2/src/resources/sustainability/impact.ts
================================================================================

// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../core/resource';
import { APIPromise } from '../../core/api-promise';
import { RequestOptions } from '../../internal/request-options';

export class Impact extends APIResource {
  /**
   * Search Global Green Projects
   *
   * @example
   * ```ts
   * const response =
   *   await client.sustainability.impact.listGlobalGreenProjects();
   * ```
   */
  listGlobalGreenProjects(
    query: ImpactListGlobalGreenProjectsParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<ImpactListGlobalGreenProjectsResponse> {
    return this._client.get('/sustainability/impact/projects', { query, ...options });
  }

  /**
   * ESG Portfolio Impact Analysis
   *
   * @example
   * ```ts
   * const response =
   *   await client.sustainability.impact.retrievePortfolioImpact();
   * ```
   */
  retrievePortfolioImpact(options?: RequestOptions): APIPromise<ImpactRetrievePortfolioImpactResponse> {
    return this._client.get('/sustainability/impact/portfolio', options);
  }
}

export interface ImpactListGlobalGreenProjectsResponse {
  data?: Array<unknown>;
}

export interface ImpactRetrievePortfolioImpactResponse {
  esgScore?: number;

  fossilFuelExposure?: number;

  greenProjectInvolvement?: Array<string>;

  socialJusticeRating?: string;
}

export interface ImpactListGlobalGreenProjectsParams {
  continent?: string;
}

export declare namespace Impact {
  export {
    type ImpactListGlobalGreenProjectsResponse as ImpactListGlobalGreenProjectsResponse,
    type ImpactRetrievePortfolioImpactResponse as ImpactRetrievePortfolioImpactResponse,
    type ImpactListGlobalGreenProjectsParams as ImpactListGlobalGreenProjectsParams,
  };
}


================================================================================
// APPENDED FROM REPO: diplomat-bit/jocall3-node | ORIGINAL PATH: diplomat-bit-jocall3-node-fae6abf/src/resources/sustainability/impact.ts
================================================================================

// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../resource';

export class Impact extends APIResource {}


================================================================================
// APPENDED FROM REPO: diplomat-bit/jocall3-typescript | ORIGINAL PATH: diplomat-bit-jocall3-typescript-b730718/src/resources/sustainability/impact.ts
================================================================================

// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../core/resource';

export class Impact extends APIResource {}
