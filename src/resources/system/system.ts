// REPOSITORY SOURCE: diplomat-bit/garbage-typescript | PATH: diplomat-bit-garbage-typescript-95791a2/src/resources/system/system.ts
================================================================================

// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../core/resource';
import * as NotificationsAPI from './notifications';
import {
  NotificationListTemplatesResponse,
  NotificationSendPushParams,
  Notifications,
} from './notifications';
import * as SandboxAPI from './sandbox';
import { Sandbox, SandboxSimulateErrorParams, SandboxSimulateErrorResponse } from './sandbox';
import * as VerificationAPI from './verification';
import { Verification, VerificationCompareBiometricParams } from './verification';
import * as WebhooksAPI from './webhooks';
import { WebhookListResponse, WebhookRegisterParams, Webhooks } from './webhooks';
import { APIPromise } from '../../core/api-promise';
import { RequestOptions } from '../../internal/request-options';

export class System extends APIResource {
  webhooks: WebhooksAPI.Webhooks = new WebhooksAPI.Webhooks(this._client);
  sandbox: SandboxAPI.Sandbox = new SandboxAPI.Sandbox(this._client);
  verification: VerificationAPI.Verification = new VerificationAPI.Verification(this._client);
  notifications: NotificationsAPI.Notifications = new NotificationsAPI.Notifications(this._client);

  /**
   * Get Immutable System Audit Trail
   *
   * @example
   * ```ts
   * const response = await client.system.getAuditLogs();
   * ```
   */
  getAuditLogs(
    query: SystemGetAuditLogsParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<SystemGetAuditLogsResponse> {
    return this._client.get('/system/audit-logs', { query, ...options });
  }

  /**
   * Get Global Infrastructure Health
   *
   * @example
   * ```ts
   * const response = await client.system.getStatus();
   * ```
   */
  getStatus(options?: RequestOptions): APIPromise<SystemGetStatusResponse> {
    return this._client.get('/system/status', options);
  }
}

export interface SystemGetAuditLogsResponse {
  data?: Array<SystemGetAuditLogsResponse.Data>;
}

export namespace SystemGetAuditLogsResponse {
  export interface Data {
    id?: string;

    action?: string;

    actor?: string;

    impact?: string;

    timestamp?: string;
  }
}

export interface SystemGetStatusResponse {
  activeNodes?: number;

  apiStatus?: string;

  geminiUptime?: string;

  mockServerLatency?: number;
}

export interface SystemGetAuditLogsParams {
  actorId?: string;

  limit?: number;

  offset?: number;
}

System.Webhooks = Webhooks;
System.Sandbox = Sandbox;
System.Verification = Verification;
System.Notifications = Notifications;

export declare namespace System {
  export {
    type SystemGetAuditLogsResponse as SystemGetAuditLogsResponse,
    type SystemGetStatusResponse as SystemGetStatusResponse,
    type SystemGetAuditLogsParams as SystemGetAuditLogsParams,
  };

  export {
    Webhooks as Webhooks,
    type WebhookListResponse as WebhookListResponse,
    type WebhookRegisterParams as WebhookRegisterParams,
  };

  export {
    Sandbox as Sandbox,
    type SandboxSimulateErrorResponse as SandboxSimulateErrorResponse,
    type SandboxSimulateErrorParams as SandboxSimulateErrorParams,
  };

  export {
    Verification as Verification,
    type VerificationCompareBiometricParams as VerificationCompareBiometricParams,
  };

  export {
    Notifications as Notifications,
    type NotificationListTemplatesResponse as NotificationListTemplatesResponse,
    type NotificationSendPushParams as NotificationSendPushParams,
  };
}


================================================================================
// APPENDED FROM REPO: diplomat-bit/jocall3-typescript | ORIGINAL PATH: diplomat-bit-jocall3-typescript-b730718/src/resources/system/system.ts
================================================================================

// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../core/resource';
import * as AuditLogsAPI from './audit-logs';
import { AuditLogs } from './audit-logs';
import * as NotificationsAPI from './notifications';
import { Notifications } from './notifications';
import * as SandboxAPI from './sandbox';
import { Sandbox } from './sandbox';
import * as StatusAPI from './status';
import { Status } from './status';
import * as VerificationAPI from './verification';
import { Verification } from './verification';
import * as WebhooksAPI from './webhooks';
import { Webhooks } from './webhooks';

export class System extends APIResource {
  status: StatusAPI.Status = new StatusAPI.Status(this._client);
  webhooks: WebhooksAPI.Webhooks = new WebhooksAPI.Webhooks(this._client);
  auditLogs: AuditLogsAPI.AuditLogs = new AuditLogsAPI.AuditLogs(this._client);
  sandbox: SandboxAPI.Sandbox = new SandboxAPI.Sandbox(this._client);
  verification: VerificationAPI.Verification = new VerificationAPI.Verification(this._client);
  notifications: NotificationsAPI.Notifications = new NotificationsAPI.Notifications(this._client);
}

System.Status = Status;
System.Webhooks = Webhooks;
System.AuditLogs = AuditLogs;
System.Sandbox = Sandbox;
System.Verification = Verification;
System.Notifications = Notifications;

export declare namespace System {
  export { Status as Status };

  export { Webhooks as Webhooks };

  export { AuditLogs as AuditLogs };

  export { Sandbox as Sandbox };

  export { Verification as Verification };

  export { Notifications as Notifications };
}
