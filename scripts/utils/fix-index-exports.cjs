// REPOSITORY SOURCE: diplomat-bit/garbage-typescript | PATH: diplomat-bit-garbage-typescript-95791a2/scripts/utils/fix-index-exports.cjs
================================================================================

const fs = require('fs');
const path = require('path');

const indexJs =
  process.env['DIST_PATH'] ?
    path.resolve(process.env['DIST_PATH'], 'index.js')
  : path.resolve(__dirname, '..', '..', 'dist', 'index.js');

let before = fs.readFileSync(indexJs, 'utf8');
let after = before.replace(
  /^(\s*Object\.defineProperty\s*\(exports,\s*["']__esModule["'].+)$/m,
  `exports = module.exports = function (...args) {
    return new exports.default(...args)
  }
  $1`.replace(/^  /gm, ''),
);
fs.writeFileSync(indexJs, after, 'utf8');


================================================================================
// APPENDED FROM REPO: diplomat-bit/jocall3-node | ORIGINAL PATH: diplomat-bit-jocall3-node-fae6abf/scripts/utils/fix-index-exports.cjs
================================================================================

const fs = require('fs');
const path = require('path');

const indexJs =
  process.env['DIST_PATH'] ?
    path.resolve(process.env['DIST_PATH'], 'index.js')
  : path.resolve(__dirname, '..', '..', 'dist', 'index.js');

let before = fs.readFileSync(indexJs, 'utf8');
let after = before.replace(
  /^\s*exports\.default\s*=\s*(\w+)/m,
  'exports = module.exports = $1;\nexports.default = $1',
);
fs.writeFileSync(indexJs, after, 'utf8');


================================================================================
// APPENDED FROM REPO: diplomat-bit/jocall3-typescript | ORIGINAL PATH: diplomat-bit-jocall3-typescript-b730718/scripts/utils/fix-index-exports.cjs
================================================================================

const fs = require('fs');
const path = require('path');

const indexJs =
  process.env['DIST_PATH'] ?
    path.resolve(process.env['DIST_PATH'], 'index.js')
  : path.resolve(__dirname, '..', '..', 'dist', 'index.js');

let before = fs.readFileSync(indexJs, 'utf8');
let after = before.replace(
  /^(\s*Object\.defineProperty\s*\(exports,\s*["']__esModule["'].+)$/m,
  `exports = module.exports = function (...args) {
    return new exports.default(...args)
  }
  $1`.replace(/^  /gm, ''),
);
fs.writeFileSync(indexJs, after, 'utf8');
