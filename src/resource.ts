// REPOSITORY SOURCE: diplomat-bit/garbage-typescript | PATH: diplomat-bit-garbage-typescript-95791a2/src/resource.ts
================================================================================

/** @deprecated Import from ./core/resource instead */
export * from './core/resource';


================================================================================
// APPENDED FROM REPO: diplomat-bit/jocall3-node | ORIGINAL PATH: diplomat-bit-jocall3-node-fae6abf/src/resource.ts
================================================================================

// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import type { Jocall3 } from './index';

export abstract class APIResource {
  protected _client: Jocall3;

  constructor(client: Jocall3) {
    this._client = client;
  }
}


================================================================================
// APPENDED FROM REPO: diplomat-bit/jocall3-typescript | ORIGINAL PATH: diplomat-bit-jocall3-typescript-b730718/src/resource.ts
================================================================================

/** @deprecated Import from ./core/resource instead */
export * from './core/resource';
