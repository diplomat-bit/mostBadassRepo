// REPOSITORY SOURCE: diplomat-bit/jocall3-node | PATH: diplomat-bit-jocall3-node-fae6abf/src/_shims/README.md
================================================================================

# 👋 Wondering what everything in here does?

`jocall3-node` supports a wide variety of runtime environments like Node.js, Deno, Bun, browsers, and various
edge runtimes, as well as both CommonJS (CJS) and EcmaScript Modules (ESM).

To do this, `jocall3-node` provides shims for either using `node-fetch` when in Node (because `fetch` is still experimental there) or the global `fetch` API built into the environment when not in Node.

It uses [conditional exports](https://nodejs.org/api/packages.html#conditional-exports) to
automatically select the correct shims for each environment. However, conditional exports are a fairly new
feature and not supported everywhere. For instance, the TypeScript `"moduleResolution": "node"`

setting doesn't consult the `exports` map, compared to `"moduleResolution": "nodeNext"`, which does.
Unfortunately that's still the default setting, and it can result in errors like
getting the wrong raw `Response` type from `.asResponse()`, for example.

The user can work around these issues by manually importing one of:

- `import 'jocall3-node/shims/node'`
- `import 'jocall3-node/shims/web'`

All of the code here in `_shims` handles selecting the automatic default shims or manual overrides.

### How it works - Runtime

Runtime shims get installed by calling `setShims` exported by `jocall3-node/_shims/registry`.

Manually importing `jocall3-node/shims/node` or `jocall3-node/shims/web`, calls `setShims` with the respective runtime shims.

All client code imports shims from `jocall3-node/_shims/index`, which:

- checks if shims have been set manually
- if not, calls `setShims` with the shims from `jocall3-node/_shims/auto/runtime`
- re-exports the installed shims from `jocall3-node/_shims/registry`.

`jocall3-node/_shims/auto/runtime` exports web runtime shims.
If the `node` export condition is set, the export map replaces it with `jocall3-node/_shims/auto/runtime-node`.

### How it works - Type time

All client code imports shim types from `jocall3-node/_shims/index`, which selects the manual types from `jocall3-node/_shims/manual-types` if they have been declared, otherwise it exports the auto types from `jocall3-node/_shims/auto/types`.

`jocall3-node/_shims/manual-types` exports an empty namespace.
Manually importing `jocall3-node/shims/node` or `jocall3-node/shims/web` merges declarations into this empty namespace, so they get picked up by `jocall3-node/_shims/index`.

`jocall3-node/_shims/auto/types` exports web type definitions.
If the `node` export condition is set, the export map replaces it with `jocall3-node/_shims/auto/types-node`, though TS only picks this up if `"moduleResolution": "nodenext"` or `"moduleResolution": "bundler"`.
