// REPOSITORY SOURCE: diplomat-bit/garbage-typescript | PATH: diplomat-bit-garbage-typescript-95791a2/src/resources/accounts/accounts.ts
================================================================================

// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../core/resource';
import * as OverdraftSettingsAPI from './overdraft-settings';
import {
  OverdraftSettingRetrieveOverdraftSettingsResponse,
  OverdraftSettingUpdateOverdraftSettingsParams,
  OverdraftSettings,
} from './overdraft-settings';
import * as StatementsAPI from './statements';
import { StatementListResponse, StatementRetrievePdfParams, Statements } from './statements';
import * as TransactionsAPI from './transactions';
import {
  TransactionRetrieveArchivedParams,
  TransactionRetrieveArchivedResponse,
  TransactionRetrievePendingResponse,
  Transactions,
} from './transactions';
import { APIPromise } from '../../core/api-promise';
import { buildHeaders } from '../../internal/headers';
import { RequestOptions } from '../../internal/request-options';
import { path } from '../../internal/utils/path';

export class Accounts extends APIResource {
  transactions: TransactionsAPI.Transactions = new TransactionsAPI.Transactions(this._client);
  statements: StatementsAPI.Statements = new StatementsAPI.Statements(this._client);
  overdraftSettings: OverdraftSettingsAPI.OverdraftSettings = new OverdraftSettingsAPI.OverdraftSettings(
    this._client,
  );

  /**
   * Close Financial Account
   *
   * @example
   * ```ts
   * await client.accounts.delete('string');
   * ```
   */
  delete(accountID: string, options?: RequestOptions): APIPromise<void> {
    return this._client.delete(path`/accounts/${accountID}`, {
      ...options,
      headers: buildHeaders([{ Accept: '*/*' }, options?.headers]),
    });
  }

  /**
   * Link an External Financial Institution
   *
   * @example
   * ```ts
   * const response = await client.accounts.link({
   *   institutionId: 'string',
   *   publicToken: 'string',
   * });
   * ```
   */
  link(body: AccountLinkParams, options?: RequestOptions): APIPromise<AccountLinkResponse> {
    return this._client.post('/accounts/link', { body, ...options });
  }

  /**
   * Open a New Quantum Internal Account
   *
   * @example
   * ```ts
   * const response = await client.accounts.open({
   *   currency: 'USD',
   *   initialDeposit: 8885.832056335083,
   *   productType: 'high_yield_vault',
   *   owners: ['string', 'string'],
   * });
   * ```
   */
  open(body: AccountOpenParams, options?: RequestOptions): APIPromise<AccountOpenResponse> {
    return this._client.post('/accounts/open', { body, ...options });
  }

  /**
   * Get Historical Balance Snapshots
   *
   * @example
   * ```ts
   * const response =
   *   await client.accounts.retrieveBalanceHistory('string');
   * ```
   */
  retrieveBalanceHistory(
    accountID: string,
    query: AccountRetrieveBalanceHistoryParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<AccountRetrieveBalanceHistoryResponse> {
    return this._client.get(path`/accounts/${accountID}/balance-history`, { query, ...options });
  }

  /**
   * get Account Details
   *
   * @example
   * ```ts
   * const response = await client.accounts.retrieveDetails(
   *   'string',
   * );
   * ```
   */
  retrieveDetails(accountID: string, options?: RequestOptions): APIPromise<AccountRetrieveDetailsResponse> {
    return this._client.get(path`/accounts/${accountID}/details`, options);
  }

  /**
   * list Accounts
   *
   * @example
   * ```ts
   * const response = await client.accounts.retrieveMe();
   * ```
   */
  retrieveMe(options?: RequestOptions): APIPromise<AccountRetrieveMeResponse> {
    return this._client.get('/accounts/me', options);
  }
}

export interface AccountLinkResponse {
  linkSessionId?: string;

  status?: string;
}

export interface AccountOpenResponse {
  id: string;

  currency: string;

  currentBalance: number;

  institutionName: string;

  type: string;

  name?: string;
}

export interface AccountRetrieveBalanceHistoryResponse {
  history?: Array<AccountRetrieveBalanceHistoryResponse.History>;
}

export namespace AccountRetrieveBalanceHistoryResponse {
  export interface History {
    balance?: number;

    timestamp?: string;
  }
}

export interface AccountRetrieveDetailsResponse {
  id: string;

  currency: string;

  currentBalance: number;

  institutionName: string;

  type: string;

  name?: string;
}

export interface AccountRetrieveMeResponse {
  value?: string;
}

export interface AccountLinkParams {
  institutionId: string;

  publicToken: string;
}

export interface AccountOpenParams {
  currency: string;

  initialDeposit: number;

  productType: 'quantum_checking' | 'elite_savings' | 'high_yield_vault';

  /**
   * User IDs for joint accounts
   */
  owners?: Array<string>;
}

export interface AccountRetrieveBalanceHistoryParams {
  period?: '1d' | '7d' | '30d' | '1y' | 'all';
}

Accounts.Transactions = Transactions;
Accounts.Statements = Statements;
Accounts.OverdraftSettings = OverdraftSettings;

export declare namespace Accounts {
  export {
    type AccountLinkResponse as AccountLinkResponse,
    type AccountOpenResponse as AccountOpenResponse,
    type AccountRetrieveBalanceHistoryResponse as AccountRetrieveBalanceHistoryResponse,
    type AccountRetrieveDetailsResponse as AccountRetrieveDetailsResponse,
    type AccountRetrieveMeResponse as AccountRetrieveMeResponse,
    type AccountLinkParams as AccountLinkParams,
    type AccountOpenParams as AccountOpenParams,
    type AccountRetrieveBalanceHistoryParams as AccountRetrieveBalanceHistoryParams,
  };

  export {
    Transactions as Transactions,
    type TransactionRetrieveArchivedResponse as TransactionRetrieveArchivedResponse,
    type TransactionRetrievePendingResponse as TransactionRetrievePendingResponse,
    type TransactionRetrieveArchivedParams as TransactionRetrieveArchivedParams,
  };

  export {
    Statements as Statements,
    type StatementListResponse as StatementListResponse,
    type StatementRetrievePdfParams as StatementRetrievePdfParams,
  };

  export {
    OverdraftSettings as OverdraftSettings,
    type OverdraftSettingRetrieveOverdraftSettingsResponse as OverdraftSettingRetrieveOverdraftSettingsResponse,
    type OverdraftSettingUpdateOverdraftSettingsParams as OverdraftSettingUpdateOverdraftSettingsParams,
  };
}


================================================================================
// APPENDED FROM REPO: diplomat-bit/jocall3-node | ORIGINAL PATH: diplomat-bit-jocall3-node-fae6abf/src/resources/accounts/accounts.ts
================================================================================

// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../resource';
import { isRequestOptions } from '../../core';
import * as Core from '../../core';
import * as OverdraftAPI from './overdraft';
import { Overdraft, OverdraftGetResponse, OverdraftUpdateParams, OverdraftUpdateResponse } from './overdraft';
import * as StatementsAPI from './statements';
import { StatementListParams, StatementListResponse, Statements } from './statements';
import * as TransactionsAPI from './transactions';
import { TransactionListPendingParams, TransactionListPendingResponse, Transactions } from './transactions';

export class Accounts extends APIResource {
  transactions: TransactionsAPI.Transactions = new TransactionsAPI.Transactions(this._client);
  statements: StatementsAPI.Statements = new StatementsAPI.Statements(this._client);
  overdraft: OverdraftAPI.Overdraft = new OverdraftAPI.Overdraft(this._client);

  /**
   * Retrieves comprehensive analytics for a specific financial account, including
   * historical balance trends, projected cash flow, and AI-driven insights into
   * spending patterns.
   *
   * @example
   * ```ts
   * const account = await client.accounts.retrieve(
   *   'acc_chase_checking_4567',
   * );
   * ```
   */
  retrieve(accountId: string, options?: Core.RequestOptions): Core.APIPromise<AccountRetrieveResponse> {
    return this._client.get(`/accounts/${accountId}/details`, options);
  }

  /**
   * Fetches a comprehensive, real-time list of all external financial accounts
   * linked to the user's profile, including consolidated balances and institutional
   * details.
   *
   * @example
   * ```ts
   * const accounts = await client.accounts.list();
   * ```
   */
  list(query?: AccountListParams, options?: Core.RequestOptions): Core.APIPromise<unknown>;
  list(options?: Core.RequestOptions): Core.APIPromise<unknown>;
  list(
    query: AccountListParams | Core.RequestOptions = {},
    options?: Core.RequestOptions,
  ): Core.APIPromise<unknown> {
    if (isRequestOptions(query)) {
      return this.list({}, query);
    }
    return this._client.get('/accounts/me', { query, ...options });
  }

  /**
   * Begins the secure process of linking a new external financial institution (e.g.,
   * another bank, investment platform) to the user's profile, typically involving a
   * third-party tokenized flow.
   *
   * @example
   * ```ts
   * const response = await client.accounts.link();
   * ```
   */
  link(body: AccountLinkParams, options?: Core.RequestOptions): Core.APIPromise<unknown> {
    return this._client.post('/accounts/link', { body, ...options });
  }
}

export interface AccountRetrieveResponse {
  projectedCashFlow?: unknown;
}

export type AccountListResponse = unknown;

export type AccountLinkResponse = unknown;

export interface AccountListParams {
  /**
   * Maximum number of items to return in a single page.
   */
  limit?: number;

  /**
   * Number of items to skip before starting to collect the result set.
   */
  offset?: number;
}

export interface AccountLinkParams {}

Accounts.Transactions = Transactions;
Accounts.Statements = Statements;
Accounts.Overdraft = Overdraft;

export declare namespace Accounts {
  export {
    type AccountRetrieveResponse as AccountRetrieveResponse,
    type AccountListResponse as AccountListResponse,
    type AccountLinkResponse as AccountLinkResponse,
    type AccountListParams as AccountListParams,
    type AccountLinkParams as AccountLinkParams,
  };

  export {
    Transactions as Transactions,
    type TransactionListPendingResponse as TransactionListPendingResponse,
    type TransactionListPendingParams as TransactionListPendingParams,
  };

  export {
    Statements as Statements,
    type StatementListResponse as StatementListResponse,
    type StatementListParams as StatementListParams,
  };

  export {
    Overdraft as Overdraft,
    type OverdraftUpdateResponse as OverdraftUpdateResponse,
    type OverdraftGetResponse as OverdraftGetResponse,
    type OverdraftUpdateParams as OverdraftUpdateParams,
  };
}


================================================================================
// APPENDED FROM REPO: diplomat-bit/jocall3-typescript | ORIGINAL PATH: diplomat-bit-jocall3-typescript-b730718/src/resources/accounts/accounts.ts
================================================================================

// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../core/resource';
import * as BalanceHistoryAPI from './balance-history';
import { BalanceHistory as BalanceHistoryAPIBalanceHistory } from './balance-history';
import * as OverdraftAPI from './overdraft';
import {
  Overdraft,
  OverdraftRetrieveSettingsResponse,
  OverdraftUpdateSettingsParams,
  OverdraftUpdateSettingsResponse,
} from './overdraft';
import * as StatementsAPI from './statements';
import { StatementListParams, StatementListResponse, Statements } from './statements';
import * as TransactionsAPI from './transactions';
import { TransactionListPendingParams, TransactionListPendingResponse, Transactions } from './transactions';
import { APIPromise } from '../../core/api-promise';
import { RequestOptions } from '../../internal/request-options';
import { path } from '../../internal/utils/path';

export class Accounts extends APIResource {
  transactions: TransactionsAPI.Transactions = new TransactionsAPI.Transactions(this._client);
  balanceHistory: BalanceHistoryAPI.BalanceHistory = new BalanceHistoryAPI.BalanceHistory(this._client);
  statements: StatementsAPI.Statements = new StatementsAPI.Statements(this._client);
  overdraft: OverdraftAPI.Overdraft = new OverdraftAPI.Overdraft(this._client);

  /**
   * Fetches a comprehensive, real-time list of all external financial accounts
   * linked to the user's profile, including consolidated balances and institutional
   * details.
   *
   * @example
   * ```ts
   * const accounts = await client.accounts.list();
   * ```
   */
  list(
    query: AccountListParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<AccountListResponse> {
    return this._client.get('/accounts/me', { query, ...options });
  }

  /**
   * Begins the secure process of linking a new external financial institution (e.g.,
   * another bank, investment platform) to the user's profile, typically involving a
   * third-party tokenized flow.
   *
   * @example
   * ```ts
   * const response = await client.accounts.link({
   *   countryCode: 'US',
   *   institutionName: 'Bank of America',
   * });
   * ```
   */
  link(body: AccountLinkParams, options?: RequestOptions): APIPromise<AccountLinkResponse> {
    return this._client.post('/accounts/link', { body, ...options });
  }

  /**
   * Retrieves comprehensive analytics for a specific financial account, including
   * historical balance trends, projected cash flow, and AI-driven insights into
   * spending patterns.
   *
   * @example
   * ```ts
   * const response = await client.accounts.retrieveDetails(
   *   'acc_chase_checking_4567',
   * );
   * ```
   */
  retrieveDetails(accountID: string, options?: RequestOptions): APIPromise<AccountRetrieveDetailsResponse> {
    return this._client.get(path`/accounts/${accountID}/details`, options);
  }
}

export interface AccountListResponse {
  data: Array<AccountListResponse.Data>;

  limit: number;

  offset: number;

  total: number;

  nextOffset?: number;
}

export namespace AccountListResponse {
  export interface Data {
    id?: string;

    availableBalance?: number;

    currency?: string;

    currentBalance?: number;

    externalId?: string;

    institutionName?: string;

    lastUpdated?: string;

    mask?: string;

    name?: string;

    subtype?: string;

    type?: string;
  }
}

export interface AccountLinkResponse {
  authUri: string;

  linkSessionId: string;

  status: string;

  message?: string;
}

export interface AccountRetrieveDetailsResponse {
  id: string;

  currency: string;

  currentBalance: number;

  institutionName: string;

  lastUpdated: string;

  name: string;

  type: string;

  accountHolder?: string;

  availableBalance?: number;

  balanceHistory?: Array<AccountRetrieveDetailsResponse.BalanceHistory>;

  externalId?: string;

  interestRate?: number;

  mask?: string;

  openedDate?: string;

  projectedCashFlow?: AccountRetrieveDetailsResponse.ProjectedCashFlow;

  subtype?: string;

  transactionsCount?: number;
}

export namespace AccountRetrieveDetailsResponse {
  export interface BalanceHistory {
    balance?: number;

    date?: string;
  }

  export interface ProjectedCashFlow {
    confidenceScore?: number;

    days30?: number;

    days90?: number;
  }
}

export interface AccountListParams {
  /**
   * Maximum number of items to return in a single page.
   */
  limit?: number;

  /**
   * Number of items to skip before starting to collect the result set.
   */
  offset?: number;
}

export interface AccountLinkParams {
  countryCode: string;

  institutionName: string;
}

Accounts.Transactions = Transactions;
Accounts.BalanceHistory = BalanceHistoryAPIBalanceHistory;
Accounts.Statements = Statements;
Accounts.Overdraft = Overdraft;

export declare namespace Accounts {
  export {
    type AccountListResponse as AccountListResponse,
    type AccountLinkResponse as AccountLinkResponse,
    type AccountRetrieveDetailsResponse as AccountRetrieveDetailsResponse,
    type AccountListParams as AccountListParams,
    type AccountLinkParams as AccountLinkParams,
  };

  export {
    Transactions as Transactions,
    type TransactionListPendingResponse as TransactionListPendingResponse,
    type TransactionListPendingParams as TransactionListPendingParams,
  };

  export { BalanceHistoryAPIBalanceHistory as BalanceHistory };

  export {
    Statements as Statements,
    type StatementListResponse as StatementListResponse,
    type StatementListParams as StatementListParams,
  };

  export {
    Overdraft as Overdraft,
    type OverdraftRetrieveSettingsResponse as OverdraftRetrieveSettingsResponse,
    type OverdraftUpdateSettingsResponse as OverdraftUpdateSettingsResponse,
    type OverdraftUpdateSettingsParams as OverdraftUpdateSettingsParams,
  };
}
