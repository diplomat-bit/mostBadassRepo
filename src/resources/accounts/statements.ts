// REPOSITORY SOURCE: diplomat-bit/garbage-typescript | PATH: diplomat-bit-garbage-typescript-95791a2/src/resources/accounts/statements.ts
================================================================================

// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../core/resource';
import { APIPromise } from '../../core/api-promise';
import { buildHeaders } from '../../internal/headers';
import { RequestOptions } from '../../internal/request-options';
import { path } from '../../internal/utils/path';

export class Statements extends APIResource {
  /**
   * List Available Statements
   *
   * @example
   * ```ts
   * const statements = await client.accounts.statements.list(
   *   'string',
   * );
   * ```
   */
  list(accountID: string, options?: RequestOptions): APIPromise<StatementListResponse> {
    return this._client.get(path`/accounts/${accountID}/statements`, options);
  }

  /**
   * Download Statement PDF
   *
   * @example
   * ```ts
   * await client.accounts.statements.retrievePdf('string', {
   *   accountId: 'string',
   * });
   * ```
   */
  retrievePdf(
    statementID: string,
    params: StatementRetrievePdfParams,
    options?: RequestOptions,
  ): APIPromise<void> {
    const { accountId } = params;
    return this._client.get(path`/accounts/${accountId}/statements/${statementID}/pdf`, {
      ...options,
      headers: buildHeaders([{ Accept: '*/*' }, options?.headers]),
    });
  }
}

export interface StatementListResponse {
  data?: Array<StatementListResponse.Data>;
}

export namespace StatementListResponse {
  export interface Data {
    id?: string;

    issueDate?: string;

    period?: string;
  }
}

export interface StatementRetrievePdfParams {
  accountId: string;
}

export declare namespace Statements {
  export {
    type StatementListResponse as StatementListResponse,
    type StatementRetrievePdfParams as StatementRetrievePdfParams,
  };
}


================================================================================
// APPENDED FROM REPO: diplomat-bit/jocall3-node | ORIGINAL PATH: diplomat-bit-jocall3-node-fae6abf/src/resources/accounts/statements.ts
================================================================================

// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../resource';
import { isRequestOptions } from '../../core';
import * as Core from '../../core';

export class Statements extends APIResource {
  /**
   * Fetches digital statements for a specific account, allowing filtering by date
   * range and format.
   *
   * @example
   * ```ts
   * const statements = await client.accounts.statements.list(
   *   'acc_chase_checking_4567',
   * );
   * ```
   */
  list(
    accountId: string,
    query?: StatementListParams,
    options?: Core.RequestOptions,
  ): Core.APIPromise<StatementListResponse>;
  list(accountId: string, options?: Core.RequestOptions): Core.APIPromise<StatementListResponse>;
  list(
    accountId: string,
    query: StatementListParams | Core.RequestOptions = {},
    options?: Core.RequestOptions,
  ): Core.APIPromise<StatementListResponse> {
    if (isRequestOptions(query)) {
      return this.list(accountId, {}, query);
    }
    return this._client.get(`/accounts/${accountId}/statements`, { query, ...options });
  }
}

export interface StatementListResponse {
  /**
   * Map of available download URLs for different formats.
   */
  downloadUrls: unknown;
}

export interface StatementListParams {
  /**
   * Desired format for the statement. Use 'application/json' Accept header for
   * download links.
   */
  format?: string;

  /**
   * Month for the statement (1-12).
   */
  month?: number;

  /**
   * Year for the statement.
   */
  year?: number;
}

export declare namespace Statements {
  export {
    type StatementListResponse as StatementListResponse,
    type StatementListParams as StatementListParams,
  };
}


================================================================================
// APPENDED FROM REPO: diplomat-bit/jocall3-typescript | ORIGINAL PATH: diplomat-bit-jocall3-typescript-b730718/src/resources/accounts/statements.ts
================================================================================

// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../core/resource';
import { APIPromise } from '../../core/api-promise';
import { RequestOptions } from '../../internal/request-options';
import { path } from '../../internal/utils/path';

export class Statements extends APIResource {
  /**
   * Fetches digital statements for a specific account, allowing filtering by date
   * range and format.
   *
   * @example
   * ```ts
   * const statements = await client.accounts.statements.list(
   *   'acc_chase_checking_4567',
   * );
   * ```
   */
  list(
    accountID: string,
    query: StatementListParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<StatementListResponse> {
    return this._client.get(path`/accounts/${accountID}/statements`, { query, ...options });
  }
}

export interface StatementListResponse {
  accountId: string;

  downloadUrls: StatementListResponse.DownloadURLs;

  period: string;

  statementId: string;
}

export namespace StatementListResponse {
  export interface DownloadURLs {
    csv?: string;

    pdf?: string;
  }
}

export interface StatementListParams {
  /**
   * Desired format for the statement. Use 'application/json' Accept header for
   * download links.
   */
  format?: string;

  /**
   * Month for the statement (1-12).
   */
  month?: number;

  /**
   * Year for the statement.
   */
  year?: number;
}

export declare namespace Statements {
  export {
    type StatementListResponse as StatementListResponse,
    type StatementListParams as StatementListParams,
  };
}
