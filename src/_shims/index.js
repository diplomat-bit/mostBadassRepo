// REPOSITORY SOURCE: diplomat-bit/jocall3-node | PATH: diplomat-bit-jocall3-node-fae6abf/src/_shims/index.js
================================================================================

/**
 * Disclaimer: modules in _shims aren't intended to be imported by SDK users.
 */
const shims = require('./registry');
const auto = require('jocall3-node/_shims/auto/runtime');
exports.init = () => {
  if (!shims.kind) shims.setShims(auto.getRuntime(), { auto: true });
};
for (const property of Object.keys(shims)) {
  Object.defineProperty(exports, property, {
    get() {
      return shims[property];
    },
  });
}

exports.init();
