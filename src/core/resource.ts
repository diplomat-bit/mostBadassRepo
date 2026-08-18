// REPOSITORY SOURCE: diplomat-bit/garbage-typescript | PATH: diplomat-bit-garbage-typescript-95791a2/src/core/resource.ts
================================================================================

// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import type { Garbage } from '../client';

export abstract class APIResource {
  protected _client: Garbage;

  constructor(client: Garbage) {
    this._client = client;
  }
}


================================================================================
// APPENDED FROM REPO: diplomat-bit/jocall3-typescript | ORIGINAL PATH: diplomat-bit-jocall3-typescript-b730718/src/core/resource.ts
================================================================================

// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import type { Jocall3 } from '../client';

export abstract class APIResource {
  protected _client: Jocall3;

  constructor(client: Jocall3) {
    this._client = client;
  }
}
