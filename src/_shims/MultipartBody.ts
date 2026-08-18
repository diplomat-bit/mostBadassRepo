// REPOSITORY SOURCE: diplomat-bit/jocall3-node | PATH: diplomat-bit-jocall3-node-fae6abf/src/_shims/MultipartBody.ts
================================================================================

/**
 * Disclaimer: modules in _shims aren't intended to be imported by SDK users.
 */
export class MultipartBody {
  constructor(public body: any) {}
  get [Symbol.toStringTag](): string {
    return 'MultipartBody';
  }
}
