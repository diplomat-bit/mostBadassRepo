// REPOSITORY SOURCE: diplomat-bit/jocall3-node | PATH: diplomat-bit-jocall3-node-fae6abf/src/_shims/bun-runtime.ts
================================================================================

/**
 * Disclaimer: modules in _shims aren't intended to be imported by SDK users.
 */
import { type Shims } from './registry';
import { getRuntime as getWebRuntime } from './web-runtime';
import { ReadStream as FsReadStream } from 'node:fs';

export function getRuntime(): Shims {
  const runtime = getWebRuntime();
  function isFsReadStream(value: any): value is FsReadStream {
    return value instanceof FsReadStream;
  }
  return { ...runtime, isFsReadStream };
}
