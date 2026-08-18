// REPOSITORY SOURCE: diplomat-bit/garbage-typescript | PATH: diplomat-bit-garbage-typescript-95791a2/src/resources/system/notifications.ts
================================================================================

// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../core/resource';
import { APIPromise } from '../../core/api-promise';
import { buildHeaders } from '../../internal/headers';
import { RequestOptions } from '../../internal/request-options';

export class Notifications extends APIResource {
  /**
   * List notification templates
   *
   * @example
   * ```ts
   * const response =
   *   await client.system.notifications.listTemplates();
   * ```
   */
  listTemplates(options?: RequestOptions): APIPromise<NotificationListTemplatesResponse> {
    return this._client.get('/system/notifications/templates', options);
  }

  /**
   * Send push notification
   *
   * @example
   * ```ts
   * await client.system.notifications.sendPush({
   *   body: 'string',
   *   title: 'string',
   *   user_id: 'string',
   * });
   * ```
   */
  sendPush(body: NotificationSendPushParams, options?: RequestOptions): APIPromise<void> {
    return this._client.post('/system/notifications/push', {
      body,
      ...options,
      headers: buildHeaders([{ Accept: '*/*' }, options?.headers]),
    });
  }
}

export type NotificationListTemplatesResponse = Array<unknown>;

export interface NotificationSendPushParams {
  body: string;

  title: string;

  user_id: string;
}

export declare namespace Notifications {
  export {
    type NotificationListTemplatesResponse as NotificationListTemplatesResponse,
    type NotificationSendPushParams as NotificationSendPushParams,
  };
}


================================================================================
// APPENDED FROM REPO: diplomat-bit/jocall3-typescript | ORIGINAL PATH: diplomat-bit-jocall3-typescript-b730718/src/resources/system/notifications.ts
================================================================================

// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../core/resource';

export class Notifications extends APIResource {}
