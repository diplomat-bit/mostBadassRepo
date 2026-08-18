// REPOSITORY SOURCE: diplomat-bit/Citibank_Demo_Business_Inc_Demonstration- | PATH: diplomat-bit-Citibank_Demo_Business_Inc_Demonstration--ab2501d/src/clients/web-app/src/lib/api.ts
================================================================================

/**
 * @file src/clients/web-app/src/lib/api.ts
 * @description A TypeScript-based API client/SDK for the web app to communicate with the backend API gateway.
 * This file provides a centralized, type-safe, and extensible way to interact with all backend services.
 * It handles authentication, error handling, and request/response lifecycle.
 */

// --- Configuration ---

/**
 * The base URL for the API gateway.
 * It's recommended to use environment variables to configure this for different environments
 * (development, staging, production).
 * Example for Vite: `VITE_API_BASE_URL` in a `.env` file.
 */
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api/v1';

// --- Authentication Provider ---

/**
 * A placeholder for the function that retrieves the authentication token (e.g., JWT).
 * This function should be implemented by the application's authentication layer
 * (e.g., using Auth0, Firebase Auth, or a custom solution) and set via `setAuthTokenProvider`.
 * @returns A promise that resolves to the authentication token string or null if not authenticated.
 */
let getAuthToken: () => Promise<string | null> = async () => {
  console.warn('Auth token provider not implemented. Use `setAuthTokenProvider` to configure it.');
  return null;
};

/**
 * Sets the function used by the API client to retrieve the authentication token.
 * This should be called once when the application initializes.
 * @param provider - A function that returns a promise resolving to the auth token.
 */
export const setAuthTokenProvider = (provider: () => Promise<string | null>): void => {
  getAuthToken = provider;
};

// --- Custom Error Handling ---

/**
 * Represents a structured error response from the API.
 */
export interface ApiErrorPayload {
  message: string;
  code?: string;
  details?: Record<string, any> | string[];
  timestamp: string;
  path: string;
  requestId?: string;
}

/**
 * Custom error class for API-related errors.
 * This class standardizes error handling by providing access to the HTTP status
 * and the structured error payload from the backend.
 */
export class ApiError extends Error {
  public readonly status: number;
  public readonly payload: ApiErrorPayload;

  constructor(status: number, payload: ApiErrorPayload) {
    super(payload.message || 'An unknown API error occurred.');
    this.name = 'ApiError';
    this.status = status;
    this.payload = payload;
  }
}

// --- Core Request Logic ---

/**
 * The core request function that handles all HTTP communication with the API.
 * It automatically adds the Authorization header, handles JSON serialization/deserialization,
 * and implements standardized error handling.
 *
 * @template T - The expected type of the successful response data.
 * @param method - The HTTP method (e.g., 'GET', 'POST', 'PUT', 'DELETE').
 * @param path - The API endpoint path (e.g., '/users/me').
 * @param body - The request payload for 'POST', 'PUT', 'PATCH' methods.
 * @param options - Optional additional request options.
 * @returns A promise that resolves to the response data of type T.
 * @throws {ApiError} - Throws an ApiError for non-successful HTTP responses (status >= 400).
 * @throws {Error} - Throws a generic Error for network failures or other unexpected issues.
 */
async function request<T>(
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH',
  path: string,
  body?: unknown,
  options: RequestInit = {}
): Promise<T> {
  const token = await getAuthToken();
  const headers = new Headers(options.headers || {});

  headers.set('Content-Type', 'application/json');
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const config: RequestInit = {
    ...options,
    method,
    headers,
    body: body ? JSON.stringify(body) : null,
  };

  try {
    const response = await fetch(`${API_BASE_URL}${path}`, config);

    if (!response.ok) {
      let errorPayload: ApiErrorPayload;
      try {
        // Attempt to parse the structured error from the backend
        errorPayload = await response.json();
      } catch (e) {
        // If parsing fails, create a generic error payload
        errorPayload = {
          message: `HTTP Error: ${response.status} ${response.statusText}`,
          timestamp: new Date().toISOString(),
          path,
        };
      }
      throw new ApiError(response.status, errorPayload);
    }

    // Handle 204 No Content response
    if (response.status === 204) {
      return null as T;
    }

    return (await response.json()) as T;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    // Handle network errors or other exceptions
    console.error('API Request Failed:', error);
    throw new Error('A network error occurred. Please try again.');
  }
}

// --- API Type Definitions ---

// Generic types
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// User and Auth types
export interface UserProfile {
  id: string;
  email: string;
  name?: string;
  avatarUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateUserProfilePayload {
  name?: string;
}

// Integration types
export type IntegrationProvider = 'plaid' | 'aws' | 'gcp' | 'auth0' | 'stripe' | 'sendgrid';

export interface Integration {
  id: string;
  provider: IntegrationProvider;
  status: 'connected' | 'disconnected' | 'error';
  accountId: string;
  metadata?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

// Plaid specific types
export interface PlaidLinkTokenResponse {
  link_token: string;
  expiration: string;
}

export interface PlaidExchangePublicTokenPayload {
  public_token: string;
  metadata: Record<string, any>;
}

export interface PlaidAccount {
  id: string;
  name: string;
  mask: string;
  type: string;
  subtype: string;
  balance: {
    current: number;
    iso_currency_code: string;
  };
}

// AWS specific types
export interface AwsConnectPayload {
  accessKeyId: string;
  secretAccessKey: string;
  region: string;
}

export interface AwsResource {
  id: string;
  type: 's3_bucket' | 'ec2_instance' | 'lambda_function';
  arn: string;
  region: string;
  metadata: Record<string, any>;
}

// GCP specific types
export interface GcpConnectPayload {
  serviceAccountKeyJson: string;
}

// --- API SDK ---

/**
 * A typed SDK for interacting with the backend API.
 * Endpoints are grouped by resource for better organization and discoverability.
 */
export const api = {
  /**
   * Endpoints related to the authenticated user.
   */
  users: {
    /**
     * Retrieves the profile of the currently authenticated user.
     */
    getMe: (): Promise<UserProfile> => request<UserProfile>('GET', '/users/me'),

    /**
     * Updates the profile of the currently authenticated user.
     * @param payload - The fields to update.
     */
    updateMe: (payload: UpdateUserProfilePayload): Promise<UserProfile> =>
      request<UserProfile>('PUT', '/users/me', payload),

    /**
     * Deletes the account of the currently authenticated user.
     */
    deleteMe: (): Promise<void> => request<void>('DELETE', '/users/me'),
  },

  /**
   * Endpoints for managing third-party integrations.
   */
  integrations: {
    /**
     * Lists all connected integrations for the user's account.
     */
    list: (): Promise<Integration[]> => request<Integration[]>('GET', '/integrations'),

    /**
     * Retrieves a specific integration by its ID.
     * @param integrationId - The ID of the integration.
     */
    getById: (integrationId: string): Promise<Integration> =>
      request<Integration>('GET', `/integrations/${integrationId}`),

    /**
     * Deletes an integration.
     * @param integrationId - The ID of the integration to delete.
     */
    delete: (integrationId: string): Promise<void> =>
      request<void>('DELETE', `/integrations/${integrationId}`),

    /**
     * Plaid integration endpoints.
     */
    plaid: {
      /**
       * Creates a new Plaid link_token for initializing the Plaid Link flow.
       */
      createLinkToken: (): Promise<PlaidLinkTokenResponse> =>
        request<PlaidLinkTokenResponse>('POST', '/integrations/plaid/link-token'),

      /**
       * Exchanges a public_token from Plaid Link for an access_token.
       * @param payload - The public token and related metadata.
       */
      exchangePublicToken: (payload: PlaidExchangePublicTokenPayload): Promise<Integration> =>
        request<Integration>('POST', '/integrations/plaid/exchange-token', payload),

      /**
       * Lists financial accounts associated with a Plaid integration.
       * @param integrationId - The ID of the Plaid integration.
       */
      listAccounts: (integrationId: string): Promise<PlaidAccount[]> =>
        request<PlaidAccount[]>('GET', `/integrations/plaid/${integrationId}/accounts`),
    },

    /**
     * AWS integration endpoints.
     */
    aws: {
      /**
       * Connects an AWS account using IAM credentials.
       * @param payload - AWS credentials and region.
       */
      connect: (payload: AwsConnectPayload): Promise<Integration> =>
        request<Integration>('POST', '/integrations/aws/connect', payload),

      /**
       * Lists discovered AWS resources for a given integration.
       * @param integrationId - The ID of the AWS integration.
       */
      listResources: (integrationId: string): Promise<PaginatedResponse<AwsResource>> =>
        request<PaginatedResponse<AwsResource>>('GET', `/integrations/aws/${integrationId}/resources`),
    },

    /**
     * GCP integration endpoints.
     */
    gcp: {
      /**
       * Connects a GCP project using a service account key.
       * @param payload - The GCP service account key JSON.
       */
      connect: (payload: GcpConnectPayload): Promise<Integration> =>
        request<Integration>('POST', '/integrations/gcp/connect', payload),
    },
  },

  /**
   * Endpoints related to billing and subscriptions (e.g., Stripe).
   */
  billing: {
    /**
     * Retrieves the current subscription status for the account.
     */
    getStatus: (): Promise<any> => request<any>('GET', '/billing/status'),

    /**
     * Creates a Stripe Checkout session for subscribing to a plan.
     * @param priceId - The ID of the Stripe price.
     */
    createCheckoutSession: (priceId: string): Promise<{ sessionId: string }> =>
      request<{ sessionId: string }>('POST', '/billing/checkout-session', { priceId }),

    /**
     * Creates a Stripe Portal session for managing an existing subscription.
     */
    createPortalSession: (): Promise<{ url: string }> =>
      request<{ url: string }>('POST', '/billing/portal-session'),
  },
};

// --- Type Exports for Convenience ---
// This allows other parts of the application to import types directly from the api module.
export type {
  UserProfile,
  UpdateUserProfilePayload,
  Integration,
  PlaidLinkTokenResponse,
  PlaidExchangePublicTokenPayload,
  PlaidAccount,
  AwsConnectPayload,
  AwsResource,
  GcpConnectPayload,
};