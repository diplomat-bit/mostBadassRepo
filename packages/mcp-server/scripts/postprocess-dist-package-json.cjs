// REPOSITORY SOURCE: diplomat-bit/jocall3-node | PATH: diplomat-bit-jocall3-node-fae6abf/packages/mcp-server/scripts/postprocess-dist-package-json.cjs
================================================================================

const fs = require('fs');
const pkgJson = require('../dist/package.json');
const parentPkgJson = require('../../../package.json');

for (const dep in pkgJson.dependencies) {
  // ensure we point to NPM instead of a local directory
  if (dep === 'jocall3-node') {
    pkgJson.dependencies[dep] = '^' + parentPkgJson.version;
  }
}

fs.writeFileSync('dist/package.json', JSON.stringify(pkgJson, null, 2));
