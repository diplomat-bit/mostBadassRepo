// REPOSITORY SOURCE: diplomat-bit/garbage-typescript | PATH: diplomat-bit-garbage-typescript-95791a2/src/resources/transactions/insights.ts
================================================================================

// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../core/resource';
import { APIPromise } from '../../core/api-promise';
import { RequestOptions } from '../../internal/request-options';

export class Insights extends APIResource {
  /**
   * Get Cash Flow Prediction (Gemini Powered)
   *
   * @example
   * ```ts
   * const response =
   *   await client.transactions.insights.getCashFlowPrediction();
   * ```
   */
  getCashFlowPrediction(options?: RequestOptions): APIPromise<InsightGetCashFlowPredictionResponse> {
    return this._client.get('/transactions/insights/future-flow', options);
  }

  /**
   * Get AISpending Trend Analysis
   *
   * @example
   * ```ts
   * const response =
   *   await client.transactions.insights.getSpendingTrends();
   * ```
   */
  getSpendingTrends(options?: RequestOptions): APIPromise<InsightGetSpendingTrendsResponse> {
    return this._client.get('/transactions/insights/spending-trends', options);
  }
}

export interface InsightGetCashFlowPredictionResponse {
  forecastDays?: number;

  projectedLowPoint?: number;

  recommendations?: Array<string>;
}

export interface InsightGetSpendingTrendsResponse {
  aiNarrative?: string;

  anomaliesDetected?: number;

  overallTrend?: string;
}

export declare namespace Insights {
  export {
    type InsightGetCashFlowPredictionResponse as InsightGetCashFlowPredictionResponse,
    type InsightGetSpendingTrendsResponse as InsightGetSpendingTrendsResponse,
  };
}


================================================================================
// APPENDED FROM REPO: diplomat-bit/jocall3-node | ORIGINAL PATH: diplomat-bit-jocall3-node-fae6abf/src/resources/transactions/insights.ts
================================================================================

// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../resource';
import * as Core from '../../core';

export class Insights extends APIResource {
  /**
   * Retrieves AI-generated insights into user spending trends over time, identifying
   * patterns and anomalies.
   *
   * @example
   * ```ts
   * const response =
   *   await client.transactions.insights.getTrends();
   * ```
   */
  getTrends(options?: Core.RequestOptions): Core.APIPromise<unknown> {
    return this._client.get('/transactions/insights/spending-trends', options);
  }
}

export type InsightGetTrendsResponse = unknown;

export declare namespace Insights {
  export { type InsightGetTrendsResponse as InsightGetTrendsResponse };
}


================================================================================
// APPENDED FROM REPO: diplomat-bit/jocall3-typescript | ORIGINAL PATH: diplomat-bit-jocall3-typescript-b730718/src/resources/transactions/insights.ts
================================================================================

// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../core/resource';
import { APIPromise } from '../../core/api-promise';
import { RequestOptions } from '../../internal/request-options';

export class Insights extends APIResource {
  /**
   * Retrieves AI-generated insights into user spending trends over time, identifying
   * patterns and anomalies.
   *
   * @example
   * ```ts
   * const response =
   *   await client.transactions.insights.retrieveSpendingTrends();
   * ```
   */
  retrieveSpendingTrends(options?: RequestOptions): APIPromise<InsightRetrieveSpendingTrendsResponse> {
    return this._client.get('/transactions/insights/spending-trends', options);
  }
}

export interface InsightRetrieveSpendingTrendsResponse {
  aiInsights: Array<InsightRetrieveSpendingTrendsResponse.AIInsight>;

  forecastNextMonth: number;

  overallTrend: string;

  percentageChange: number;

  period: string;

  topCategoriesByChange: Array<InsightRetrieveSpendingTrendsResponse.TopCategoriesByChange>;
}

export namespace InsightRetrieveSpendingTrendsResponse {
  export interface AIInsight {
    id?: string;

    actionableRecommendation?: string;

    category?: string;

    description?: string;

    severity?: string;

    timestamp?: string;

    title?: string;
  }

  export interface TopCategoriesByChange {
    absoluteChange?: number;

    category?: string;

    percentageChange?: number;
  }
}

export declare namespace Insights {
  export { type InsightRetrieveSpendingTrendsResponse as InsightRetrieveSpendingTrendsResponse };
}
