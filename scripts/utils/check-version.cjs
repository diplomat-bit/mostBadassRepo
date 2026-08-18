// REPOSITORY SOURCE: diplomat-bit/garbage-typescript | PATH: diplomat-bit-garbage-typescript-95791a2/scripts/utils/check-version.cjs
================================================================================

const fs = require('fs');
const path = require('path');

const main = () => {
  const pkg = require('../../package.json');
  const version = pkg['version'];
  if (!version) throw 'The version property is not set in the package.json file';
  if (typeof version !== 'string') {
    throw `Unexpected type for the package.json version field; got ${typeof version}, expected string`;
  }

  const versionFile = path.resolve(__dirname, '..', '..', 'src', 'version.ts');
  const contents = fs.readFileSync(versionFile, 'utf8');
  const output = contents.replace(/(export const VERSION = ')(.*)(')/g, `$1${version}$3`);
  fs.writeFileSync(versionFile, output);
};

if (require.main === module) {
  main();
}


================================================================================
// APPENDED FROM REPO: diplomat-bit/jocall3-node | ORIGINAL PATH: diplomat-bit-jocall3-node-fae6abf/scripts/utils/check-version.cjs
================================================================================

const fs = require('fs');
const path = require('path');

const main = () => {
  const pkg = require('../../package.json');
  const version = pkg['version'];
  if (!version) throw 'The version property is not set in the package.json file';
  if (typeof version !== 'string') {
    throw `Unexpected type for the package.json version field; got ${typeof version}, expected string`;
  }

  const versionFile = path.resolve(__dirname, '..', '..', 'src', 'version.ts');
  const contents = fs.readFileSync(versionFile, 'utf8');
  const output = contents.replace(/(export const VERSION = ')(.*)(')/g, `$1${version}$3`);
  fs.writeFileSync(versionFile, output);
};

if (require.main === module) {
  main();
}


================================================================================
// APPENDED FROM REPO: diplomat-bit/jocall3-typescript | ORIGINAL PATH: diplomat-bit-jocall3-typescript-b730718/scripts/utils/check-version.cjs
================================================================================

const fs = require('fs');
const path = require('path');

const main = () => {
  const pkg = require('../../package.json');
  const version = pkg['version'];
  if (!version) throw 'The version property is not set in the package.json file';
  if (typeof version !== 'string') {
    throw `Unexpected type for the package.json version field; got ${typeof version}, expected string`;
  }

  const versionFile = path.resolve(__dirname, '..', '..', 'src', 'version.ts');
  const contents = fs.readFileSync(versionFile, 'utf8');
  const output = contents.replace(/(export const VERSION = ')(.*)(')/g, `$1${version}$3`);
  fs.writeFileSync(versionFile, output);
};

if (require.main === module) {
  main();
}
