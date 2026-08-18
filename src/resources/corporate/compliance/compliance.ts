// REPOSITORY SOURCE: diplomat-bit/garbage-typescript | PATH: diplomat-bit-garbage-typescript-95791a2/src/resources/corporate/compliance/compliance.ts
================================================================================

// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../../core/resource';
import * as AuditsAPI from './audits';
import {
  AuditRequestAuditParams,
  AuditRequestAuditResponse,
  AuditRetrieveReportResponse,
  Audits,
} from './audits';
import { APIPromise } from '../../../core/api-promise';
import { RequestOptions } from '../../../internal/request-options';

export class Compliance extends APIResource {
  audits: AuditsAPI.Audits = new AuditsAPI.Audits(this._client);

  /**
   * Adverse Media Sentiment Screening
   *
   * @example
   * ```ts
   * const response =
   *   await client.corporate.compliance.screenMedia({
   *     query: 'string',
   *     depth: 'shallow',
   *   });
   * ```
   */
  screenMedia(
    body: ComplianceScreenMediaParams,
    options?: RequestOptions,
  ): APIPromise<ComplianceScreenMediaResponse> {
    return this._client.post('/corporate/compliance/media', { body, ...options });
  }

  /**
   * Politically Exposed Person (PEP) Screening
   *
   * @example
   * ```ts
   * const response =
   *   await client.corporate.compliance.screenPep({
   *     fullName: 'string',
   *     dob: '1959-07-22',
   *   });
   * ```
   */
  screenPep(
    body: ComplianceScreenPepParams,
    options?: RequestOptions,
  ): APIPromise<ComplianceScreenPepResponse> {
    return this._client.post('/corporate/compliance/pep', { body, ...options });
  }

  /**
   * Enhanced Global Sanctions Screening
   *
   * @example
   * ```ts
   * const response =
   *   await client.corporate.compliance.screenSanctions({
   *     entities: [
   *       { name: 'string', country: 'string' },
   *       { name: 'string', country: 'string' },
   *     ],
   *     checkType: 'enhanced_due_diligence',
   *   });
   * ```
   */
  screenSanctions(
    body: ComplianceScreenSanctionsParams,
    options?: RequestOptions,
  ): APIPromise<ComplianceScreenSanctionsResponse> {
    return this._client.post('/corporate/compliance/sanctions', { body, ...options });
  }
}

export interface ComplianceScreenMediaResponse {
  negativeNewsLinks?: Array<string>;

  sentimentScore?: number;
}

export interface ComplianceScreenPepResponse {
  details?: string;

  isMatch?: boolean;
}

export interface ComplianceScreenSanctionsResponse {
  hits?: Array<unknown>;

  riskLevel?: 'Low' | 'Medium' | 'High' | 'Critical';
}

export interface ComplianceScreenMediaParams {
  query: string;

  depth?: 'shallow' | 'deep';
}

export interface ComplianceScreenPepParams {
  fullName: string;

  dob?: string;
}

export interface ComplianceScreenSanctionsParams {
  entities: Array<ComplianceScreenSanctionsParams.Entity>;

  checkType?: 'standard' | 'enhanced_due_diligence';
}

export namespace ComplianceScreenSanctionsParams {
  export interface Entity {
    country?: string;

    name?: string;
  }
}

Compliance.Audits = Audits;

export declare namespace Compliance {
  export {
    type ComplianceScreenMediaResponse as ComplianceScreenMediaResponse,
    type ComplianceScreenPepResponse as ComplianceScreenPepResponse,
    type ComplianceScreenSanctionsResponse as ComplianceScreenSanctionsResponse,
    type ComplianceScreenMediaParams as ComplianceScreenMediaParams,
    type ComplianceScreenPepParams as ComplianceScreenPepParams,
    type ComplianceScreenSanctionsParams as ComplianceScreenSanctionsParams,
  };

  export {
    Audits as Audits,
    type AuditRequestAuditResponse as AuditRequestAuditResponse,
    type AuditRetrieveReportResponse as AuditRetrieveReportResponse,
    type AuditRequestAuditParams as AuditRequestAuditParams,
  };
}


================================================================================
// APPENDED FROM REPO: diplomat-bit/jocall3-node | ORIGINAL PATH: diplomat-bit-jocall3-node-fae6abf/src/resources/corporate/compliance/compliance.ts
================================================================================

// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../../resource';
import * as AuditsAPI from './audits';
import { AuditRequestParams, AuditRequestResponse, Audits } from './audits';

export class Compliance extends APIResource {
  audits: AuditsAPI.Audits = new AuditsAPI.Audits(this._client);
}

Compliance.Audits = Audits;

export declare namespace Compliance {
  export {
    Audits as Audits,
    type AuditRequestResponse as AuditRequestResponse,
    type AuditRequestParams as AuditRequestParams,
  };
}


================================================================================
// APPENDED FROM REPO: diplomat-bit/jocall3-typescript | ORIGINAL PATH: diplomat-bit-jocall3-typescript-b730718/src/resources/corporate/compliance/compliance.ts
================================================================================

// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../../core/resource';
import * as AuditsAPI from './audits';
import { AuditRequestParams, AuditRequestResponse, AuditRetrieveReportResponse, Audits } from './audits';

export class Compliance extends APIResource {
  audits: AuditsAPI.Audits = new AuditsAPI.Audits(this._client);
}

Compliance.Audits = Audits;

export declare namespace Compliance {
  export {
    Audits as Audits,
    type AuditRequestResponse as AuditRequestResponse,
    type AuditRetrieveReportResponse as AuditRetrieveReportResponse,
    type AuditRequestParams as AuditRequestParams,
  };
}
