// REPOSITORY SOURCE: diplomat-bit/garbage-typescript | PATH: diplomat-bit-garbage-typescript-95791a2/src/internal/utils/env.ts
================================================================================

// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

/**
 * Read an environment variable.
 *
 * Trims beginning and trailing whitespace.
 *
 * Will return undefined if the environment variable doesn't exist or cannot be accessed.
 */
export const readEnv = (env: string): string | undefined => {
  if (typeof (globalThis as any).process !== 'undefined') {
    return (globalThis as any).process.env?.[env]?.trim() ?? undefined;
  }
  if (typeof (globalThis as any).Deno !== 'undefined') {
    return (globalThis as any).Deno.env?.get?.(env)?.trim();
  }
  return undefined;
};


================================================================================
// APPENDED FROM REPO: diplomat-bit/jocall3-typescript | ORIGINAL PATH: diplomat-bit-jocall3-typescript-b730718/src/internal/utils/env.ts
================================================================================

// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

/**
 * Read an environment variable.
 *
 * Trims beginning and trailing whitespace.
 *
 * Will return undefined if the environment variable doesn't exist or cannot be accessed.
 */
export const readEnv = (env: string): string | undefined => {
  if (typeof (globalThis as any).process !== 'undefined') {
    return (globalThis as any).process.env?.[env]?.trim() ?? undefined;
  }
  if (typeof (globalThis as any).Deno !== 'undefined') {
    return (globalThis as any).Deno.env?.get?.(env)?.trim();
  }
  return undefined;
};
