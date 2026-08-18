// REPOSITORY SOURCE: diplomat-bit/garbage-typescript | PATH: diplomat-bit-garbage-typescript-95791a2/src/resources/system/webhooks.ts
================================================================================

// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../core/resource';
import { APIPromise } from '../../core/api-promise';
import { buildHeaders } from '../../internal/headers';
import { RequestOptions } from '../../internal/request-options';
import { path } from '../../internal/utils/path';

export class Webhooks extends APIResource {
  /**
   * List Registered Webhooks
   *
   * @example
   * ```ts
   * const webhooks = await client.system.webhooks.list();
   * ```
   */
  list(options?: RequestOptions): APIPromise<WebhookListResponse> {
    return this._client.get('/system/webhooks', options);
  }

  /**
   * Delete Webhook
   *
   * @example
   * ```ts
   * await client.system.webhooks.delete('string');
   * ```
   */
  delete(webhookID: string, options?: RequestOptions): APIPromise<void> {
    return this._client.delete(path`/system/webhooks/${webhookID}`, {
      ...options,
      headers: buildHeaders([{ Accept: '*/*' }, options?.headers]),
    });
  }

  /**
   * Register Real-time Event Hook
   *
   * @example
   * ```ts
   * await client.system.webhooks.register({
   *   events: ['transaction.created', 'login.alert'],
   *   url: 'https://QXorJcnKcPtwaBORGsE.lotvPA2bCjZTqn4UyIZX-1yPZ-pK2dDKa7B1wNvGVcmWq9Fk',
   *   secret: 'string',
   * });
   * ```
   */
  register(body: WebhookRegisterParams, options?: RequestOptions): APIPromise<void> {
    return this._client.post('/system/webhooks', {
      body,
      ...options,
      headers: buildHeaders([{ Accept: '*/*' }, options?.headers]),
    });
  }
}

export interface WebhookListResponse {
  data?: Array<unknown>;
}

export interface WebhookRegisterParams {
  events: Array<string>;

  url: string;

  /**
   * HMAC signing secret
   */
  secret?: string;
}

export declare namespace Webhooks {
  export {
    type WebhookListResponse as WebhookListResponse,
    type WebhookRegisterParams as WebhookRegisterParams,
  };
}


================================================================================
// APPENDED FROM REPO: diplomat-bit/jocall3-typescript | ORIGINAL PATH: diplomat-bit-jocall3-typescript-b730718/src/resources/system/webhooks.ts
================================================================================

// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../core/resource';

export class Webhooks extends APIResource {}
