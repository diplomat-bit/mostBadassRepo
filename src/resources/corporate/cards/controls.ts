// REPOSITORY SOURCE: diplomat-bit/jocall3-node | PATH: diplomat-bit-jocall3-node-fae6abf/src/resources/corporate/cards/controls.ts
================================================================================

// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../../resource';
import * as Core from '../../../core';

export class Controls extends APIResource {
  /**
   * Updates the sophisticated spending controls, limits, and policy overrides for a
   * specific corporate card, enabling real-time adjustments for security and budget
   * adherence.
   *
   * @example
   * ```ts
   * const control =
   *   await client.corporate.cards.controls.update(
   *     'corp_card_xyz987654',
   *   );
   * ```
   */
  update(
    cardId: string,
    body?: ControlUpdateParams | null | undefined,
    options?: Core.RequestOptions,
  ): Core.APIPromise<ControlUpdateResponse> {
    return this._client.put(`/corporate/cards/${cardId}/controls`, { body, ...options });
  }
}

export interface ControlUpdateResponse {
  /**
   * Granular spending controls for a corporate card.
   */
  controls: unknown;
}

export interface ControlUpdateParams {}

export declare namespace Controls {
  export {
    type ControlUpdateResponse as ControlUpdateResponse,
    type ControlUpdateParams as ControlUpdateParams,
  };
}


================================================================================
// APPENDED FROM REPO: diplomat-bit/jocall3-typescript | ORIGINAL PATH: diplomat-bit-jocall3-typescript-b730718/src/resources/corporate/cards/controls.ts
================================================================================

// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../../core/resource';
import { APIPromise } from '../../../core/api-promise';
import { RequestOptions } from '../../../internal/request-options';
import { path } from '../../../internal/utils/path';

export class Controls extends APIResource {
  /**
   * Updates the sophisticated spending controls, limits, and policy overrides for a
   * specific corporate card, enabling real-time adjustments for security and budget
   * adherence.
   *
   * @example
   * ```ts
   * const control =
   *   await client.corporate.cards.controls.update(
   *     'corp_card_xyz987654',
   *   );
   * ```
   */
  update(
    cardID: string,
    body?: ControlUpdateParams | null | undefined,
    options?: RequestOptions,
  ): APIPromise<ControlUpdateResponse> {
    return this._client.put(path`/corporate/cards/${cardID}/controls`, { body, ...options });
  }
}

export interface ControlUpdateResponse {
  /**
   * Granular spending controls for a corporate card.
   */
  controls: unknown;
}

export interface ControlUpdateParams {}

export declare namespace Controls {
  export {
    type ControlUpdateResponse as ControlUpdateResponse,
    type ControlUpdateParams as ControlUpdateParams,
  };
}
