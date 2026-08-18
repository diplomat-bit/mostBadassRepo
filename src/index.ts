// REPOSITORY SOURCE: diplomat-bit/garbage-typescript | PATH: diplomat-bit-garbage-typescript-95791a2/src/index.ts
================================================================================

// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

export { Garbage as default } from './client';

export { type Uploadable, toFile } from './core/uploads';
export { APIPromise } from './core/api-promise';
export { Garbage, type ClientOptions } from './client';
export {
  GarbageError,
  APIError,
  APIConnectionError,
  APIConnectionTimeoutError,
  APIUserAbortError,
  NotFoundError,
  ConflictError,
  RateLimitError,
  BadRequestError,
  AuthenticationError,
  InternalServerError,
  PermissionDeniedError,
  UnprocessableEntityError,
} from './core/error';


================================================================================
// APPENDED FROM REPO: diplomat-bit/jocall3-node | ORIGINAL PATH: diplomat-bit-jocall3-node-fae6abf/src/index.ts
================================================================================

// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { type Agent } from './_shims/index';
import * as Core from './core';
import * as Errors from './error';
import * as Uploads from './uploads';
import * as API from './resources/index';
import {
  AccountLinkParams,
  AccountLinkResponse,
  AccountListParams,
  AccountListResponse,
  AccountRetrieveResponse,
  Accounts,
} from './resources/accounts/accounts';
import { AI } from './resources/ai/ai';
import { Corporate } from './resources/corporate/corporate';
import { Lending } from './resources/lending/lending';
import {
  Marketplace,
  MarketplaceListProductsParams,
  MarketplaceListProductsResponse,
} from './resources/marketplace/marketplace';
import { Payments } from './resources/payments/payments';
import {
  Sustainability,
  SustainabilityGetFootprintResponse,
} from './resources/sustainability/sustainability';
import {
  TransactionCategorizeParams,
  TransactionCategorizeResponse,
  TransactionListParams,
  TransactionListResponse,
  TransactionRetrieveResponse,
  Transactions,
} from './resources/transactions/transactions';
import {
  UserLoginParams,
  UserLoginResponse,
  UserRegisterParams,
  UserRegisterResponse,
  Users,
} from './resources/users/users';
import { Web3 } from './resources/web3/web3';

const environments = {
  production: 'https://api.quantum-core.finance/v1',
  sandbox: 'https://sandbox.quantum-core.finance/v1',
  gemini_direct: 'https://generativelanguage.googleapis.com/v1beta',
};
type Environment = keyof typeof environments;

export interface ClientOptions {
  /**
   * Defaults to process.env['JOCALL3_API_KEY'].
   */
  apiKey?: string | undefined;

  /**
   * Defaults to process.env['GEMINI_API_KEY'].
   */
  geminiAPIKey?: string | undefined;

  /**
   * Specifies the environment to use for the API.
   *
   * Each environment maps to a different base URL:
   * - `production` corresponds to `https://api.quantum-core.finance/v1`
   * - `sandbox` corresponds to `https://sandbox.quantum-core.finance/v1`
   * - `gemini_direct` corresponds to `https://generativelanguage.googleapis.com/v1beta`
   */
  environment?: Environment | undefined;

  /**
   * Override the default base URL for the API, e.g., "https://api.example.com/v2/"
   *
   * Defaults to process.env['JOCALL3_BASE_URL'].
   */
  baseURL?: string | null | undefined;

  /**
   * The maximum amount of time (in milliseconds) that the client should wait for a response
   * from the server before timing out a single request.
   *
   * Note that request timeouts are retried by default, so in a worst-case scenario you may wait
   * much longer than this timeout before the promise succeeds or fails.
   *
   * @unit milliseconds
   */
  timeout?: number | undefined;

  /**
   * An HTTP agent used to manage HTTP(S) connections.
   *
   * If not provided, an agent will be constructed by default in the Node.js environment,
   * otherwise no agent is used.
   */
  httpAgent?: Agent | undefined;

  /**
   * Specify a custom `fetch` function implementation.
   *
   * If not provided, we use `node-fetch` on Node.js and otherwise expect that `fetch` is
   * defined globally.
   */
  fetch?: Core.Fetch | undefined;

  /**
   * The maximum number of times that the client will retry a request in case of a
   * temporary failure, like a network error or a 5XX error from the server.
   *
   * @default 2
   */
  maxRetries?: number | undefined;

  /**
   * Default headers to include with every request to the API.
   *
   * These can be removed in individual requests by explicitly setting the
   * header to `undefined` or `null` in request options.
   */
  defaultHeaders?: Core.Headers | undefined;

  /**
   * Default query parameters to include with every request to the API.
   *
   * These can be removed in individual requests by explicitly setting the
   * param to `undefined` in request options.
   */
  defaultQuery?: Core.DefaultQuery | undefined;
}

/**
 * API Client for interfacing with the Jocall3 API.
 */
export class Jocall3 extends Core.APIClient {
  apiKey: string;
  geminiAPIKey: string;

  private _options: ClientOptions;

  /**
   * API Client for interfacing with the Jocall3 API.
   *
   * @param {string | undefined} [opts.apiKey=process.env['JOCALL3_API_KEY'] ?? undefined]
   * @param {string | undefined} [opts.geminiAPIKey=process.env['GEMINI_API_KEY'] ?? undefined]
   * @param {Environment} [opts.environment=production] - Specifies the environment URL to use for the API.
   * @param {string} [opts.baseURL=process.env['JOCALL3_BASE_URL'] ?? https://api.quantum-core.finance/v1] - Override the default base URL for the API.
   * @param {number} [opts.timeout=1 minute] - The maximum amount of time (in milliseconds) the client will wait for a response before timing out.
   * @param {number} [opts.httpAgent] - An HTTP agent used to manage HTTP(s) connections.
   * @param {Core.Fetch} [opts.fetch] - Specify a custom `fetch` function implementation.
   * @param {number} [opts.maxRetries=2] - The maximum number of times the client will retry a request.
   * @param {Core.Headers} opts.defaultHeaders - Default headers to include with every request to the API.
   * @param {Core.DefaultQuery} opts.defaultQuery - Default query parameters to include with every request to the API.
   */
  constructor({
    baseURL = Core.readEnv('JOCALL3_BASE_URL'),
    apiKey = Core.readEnv('JOCALL3_API_KEY'),
    geminiAPIKey = Core.readEnv('GEMINI_API_KEY'),
    ...opts
  }: ClientOptions = {}) {
    if (apiKey === undefined) {
      throw new Errors.Jocall3Error(
        "The JOCALL3_API_KEY environment variable is missing or empty; either provide it, or instantiate the Jocall3 client with an apiKey option, like new Jocall3({ apiKey: 'My API Key' }).",
      );
    }
    if (geminiAPIKey === undefined) {
      throw new Errors.Jocall3Error(
        "The GEMINI_API_KEY environment variable is missing or empty; either provide it, or instantiate the Jocall3 client with an geminiAPIKey option, like new Jocall3({ geminiAPIKey: 'My Gemini API Key' }).",
      );
    }

    const options: ClientOptions = {
      apiKey,
      geminiAPIKey,
      ...opts,
      baseURL,
      environment: opts.environment ?? 'production',
    };

    if (baseURL && opts.environment) {
      throw new Errors.Jocall3Error(
        'Ambiguous URL; The `baseURL` option (or JOCALL3_BASE_URL env var) and the `environment` option are given. If you want to use the environment you must pass baseURL: null',
      );
    }

    super({
      baseURL: options.baseURL || environments[options.environment || 'production'],
      baseURLOverridden: baseURL ? baseURL !== environments[options.environment || 'production'] : false,
      timeout: options.timeout ?? 60000 /* 1 minute */,
      httpAgent: options.httpAgent,
      maxRetries: options.maxRetries,
      fetch: options.fetch,
    });

    this._options = options;

    this.apiKey = apiKey;
    this.geminiAPIKey = geminiAPIKey;
  }

  users: API.Users = new API.Users(this);
  accounts: API.Accounts = new API.Accounts(this);
  transactions: API.Transactions = new API.Transactions(this);
  ai: API.AI = new API.AI(this);
  corporate: API.Corporate = new API.Corporate(this);
  web3: API.Web3 = new API.Web3(this);
  payments: API.Payments = new API.Payments(this);
  sustainability: API.Sustainability = new API.Sustainability(this);
  marketplace: API.Marketplace = new API.Marketplace(this);
  lending: API.Lending = new API.Lending(this);

  /**
   * Check whether the base URL is set to its default.
   */
  #baseURLOverridden(): boolean {
    return this.baseURL !== environments[this._options.environment || 'production'];
  }

  protected override defaultQuery(): Core.DefaultQuery | undefined {
    return this._options.defaultQuery;
  }

  protected override defaultHeaders(opts: Core.FinalRequestOptions): Core.Headers {
    return {
      ...super.defaultHeaders(opts),
      ...this._options.defaultHeaders,
    };
  }

  protected override authHeaders(opts: Core.FinalRequestOptions): Core.Headers {
    return {
      ...this.bearerAuth(opts),
      ...this.geminiHeaderAuth(opts),
    };
  }

  protected bearerAuth(opts: Core.FinalRequestOptions): Core.Headers {
    return { Authorization: `Bearer ${this.apiKey}` };
  }

  protected geminiHeaderAuth(opts: Core.FinalRequestOptions): Core.Headers {
    return { 'x-goog-api-key': this.geminiAPIKey };
  }

  static Jocall3 = this;
  static DEFAULT_TIMEOUT = 60000; // 1 minute

  static Jocall3Error = Errors.Jocall3Error;
  static APIError = Errors.APIError;
  static APIConnectionError = Errors.APIConnectionError;
  static APIConnectionTimeoutError = Errors.APIConnectionTimeoutError;
  static APIUserAbortError = Errors.APIUserAbortError;
  static NotFoundError = Errors.NotFoundError;
  static ConflictError = Errors.ConflictError;
  static RateLimitError = Errors.RateLimitError;
  static BadRequestError = Errors.BadRequestError;
  static AuthenticationError = Errors.AuthenticationError;
  static InternalServerError = Errors.InternalServerError;
  static PermissionDeniedError = Errors.PermissionDeniedError;
  static UnprocessableEntityError = Errors.UnprocessableEntityError;

  static toFile = Uploads.toFile;
  static fileFromPath = Uploads.fileFromPath;
}

Jocall3.Users = Users;
Jocall3.Accounts = Accounts;
Jocall3.Transactions = Transactions;
Jocall3.AI = AI;
Jocall3.Corporate = Corporate;
Jocall3.Web3 = Web3;
Jocall3.Payments = Payments;
Jocall3.Sustainability = Sustainability;
Jocall3.Marketplace = Marketplace;
Jocall3.Lending = Lending;

export declare namespace Jocall3 {
  export type RequestOptions = Core.RequestOptions;

  export {
    Users as Users,
    type UserLoginResponse as UserLoginResponse,
    type UserRegisterResponse as UserRegisterResponse,
    type UserLoginParams as UserLoginParams,
    type UserRegisterParams as UserRegisterParams,
  };

  export {
    Accounts as Accounts,
    type AccountRetrieveResponse as AccountRetrieveResponse,
    type AccountListResponse as AccountListResponse,
    type AccountLinkResponse as AccountLinkResponse,
    type AccountListParams as AccountListParams,
    type AccountLinkParams as AccountLinkParams,
  };

  export {
    Transactions as Transactions,
    type TransactionRetrieveResponse as TransactionRetrieveResponse,
    type TransactionListResponse as TransactionListResponse,
    type TransactionCategorizeResponse as TransactionCategorizeResponse,
    type TransactionListParams as TransactionListParams,
    type TransactionCategorizeParams as TransactionCategorizeParams,
  };

  export { AI as AI };

  export { Corporate as Corporate };

  export { Web3 as Web3 };

  export { Payments as Payments };

  export {
    Sustainability as Sustainability,
    type SustainabilityGetFootprintResponse as SustainabilityGetFootprintResponse,
  };

  export {
    Marketplace as Marketplace,
    type MarketplaceListProductsResponse as MarketplaceListProductsResponse,
    type MarketplaceListProductsParams as MarketplaceListProductsParams,
  };

  export { Lending as Lending };
}

export { toFile, fileFromPath } from './uploads';
export {
  Jocall3Error,
  APIError,
  APIConnectionError,
  APIConnectionTimeoutError,
  APIUserAbortError,
  NotFoundError,
  ConflictError,
  RateLimitError,
  BadRequestError,
  AuthenticationError,
  InternalServerError,
  PermissionDeniedError,
  UnprocessableEntityError,
} from './error';

export default Jocall3;


================================================================================
// APPENDED FROM REPO: diplomat-bit/jocall3-typescript | ORIGINAL PATH: diplomat-bit-jocall3-typescript-b730718/src/index.ts
================================================================================

// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

export { Jocall3 as default } from './client';

export { type Uploadable, toFile } from './core/uploads';
export { APIPromise } from './core/api-promise';
export { Jocall3, type ClientOptions } from './client';
export { PagePromise } from './core/pagination';
export {
  Jocall3Error,
  APIError,
  APIConnectionError,
  APIConnectionTimeoutError,
  APIUserAbortError,
  NotFoundError,
  ConflictError,
  RateLimitError,
  BadRequestError,
  AuthenticationError,
  InternalServerError,
  PermissionDeniedError,
  UnprocessableEntityError,
} from './core/error';
