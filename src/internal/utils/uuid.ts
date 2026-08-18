// REPOSITORY SOURCE: diplomat-bit/garbage-typescript | PATH: diplomat-bit-garbage-typescript-95791a2/src/internal/utils/uuid.ts
================================================================================

// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

/**
 * https://stackoverflow.com/a/2117523
 */
export let uuid4 = function () {
  const { crypto } = globalThis as any;
  if (crypto?.randomUUID) {
    uuid4 = crypto.randomUUID.bind(crypto);
    return crypto.randomUUID();
  }
  const u8 = new Uint8Array(1);
  const randomByte = crypto ? () => crypto.getRandomValues(u8)[0]! : () => (Math.random() * 0xff) & 0xff;
  return '10000000-1000-4000-8000-100000000000'.replace(/[018]/g, (c) =>
    (+c ^ (randomByte() & (15 >> (+c / 4)))).toString(16),
  );
};


================================================================================
// APPENDED FROM REPO: diplomat-bit/jocall3-typescript | ORIGINAL PATH: diplomat-bit-jocall3-typescript-b730718/src/internal/utils/uuid.ts
================================================================================

// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

/**
 * https://stackoverflow.com/a/2117523
 */
export let uuid4 = function () {
  const { crypto } = globalThis as any;
  if (crypto?.randomUUID) {
    uuid4 = crypto.randomUUID.bind(crypto);
    return crypto.randomUUID();
  }
  const u8 = new Uint8Array(1);
  const randomByte = crypto ? () => crypto.getRandomValues(u8)[0]! : () => (Math.random() * 0xff) & 0xff;
  return '10000000-1000-4000-8000-100000000000'.replace(/[018]/g, (c) =>
    (+c ^ (randomByte() & (15 >> (+c / 4)))).toString(16),
  );
};
