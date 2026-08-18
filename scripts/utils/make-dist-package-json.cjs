// REPOSITORY SOURCE: diplomat-bit/garbage-typescript | PATH: diplomat-bit-garbage-typescript-95791a2/scripts/utils/make-dist-package-json.cjs
================================================================================

const pkgJson = require(process.env['PKG_JSON_PATH'] || '../../package.json');

function processExportMap(m) {
  for (const key in m) {
    const value = m[key];
    if (typeof value === 'string') m[key] = value.replace(/^\.\/dist\//, './');
    else processExportMap(value);
  }
}
processExportMap(pkgJson.exports);

for (const key of ['types', 'main', 'module']) {
  if (typeof pkgJson[key] === 'string') pkgJson[key] = pkgJson[key].replace(/^(\.\/)?dist\//, './');
}

delete pkgJson.devDependencies;
delete pkgJson.scripts.prepack;
delete pkgJson.scripts.prepublishOnly;
delete pkgJson.scripts.prepare;

console.log(JSON.stringify(pkgJson, null, 2));


================================================================================
// APPENDED FROM REPO: diplomat-bit/jocall3-node | ORIGINAL PATH: diplomat-bit-jocall3-node-fae6abf/scripts/utils/make-dist-package-json.cjs
================================================================================

const pkgJson = require(process.env['PKG_JSON_PATH'] || '../../package.json');

function processExportMap(m) {
  for (const key in m) {
    const value = m[key];
    if (typeof value === 'string') m[key] = value.replace(/^\.\/dist\//, './');
    else processExportMap(value);
  }
}
processExportMap(pkgJson.exports);

for (const key of ['types', 'main', 'module']) {
  if (typeof pkgJson[key] === 'string') pkgJson[key] = pkgJson[key].replace(/^(\.\/)?dist\//, './');
}
// Fix bin paths if present
if (pkgJson.bin) {
  for (const key in pkgJson.bin) {
    if (typeof pkgJson.bin[key] === 'string') {
      pkgJson.bin[key] = pkgJson.bin[key].replace(/^(\.\/)?dist\//, './');
    }
  }
}

delete pkgJson.devDependencies;
delete pkgJson.scripts.prepack;
delete pkgJson.scripts.prepublishOnly;
delete pkgJson.scripts.prepare;

console.log(JSON.stringify(pkgJson, null, 2));


================================================================================
// APPENDED FROM REPO: diplomat-bit/jocall3-typescript | ORIGINAL PATH: diplomat-bit-jocall3-typescript-b730718/scripts/utils/make-dist-package-json.cjs
================================================================================

const pkgJson = require(process.env['PKG_JSON_PATH'] || '../../package.json');

function processExportMap(m) {
  for (const key in m) {
    const value = m[key];
    if (typeof value === 'string') m[key] = value.replace(/^\.\/dist\//, './');
    else processExportMap(value);
  }
}
processExportMap(pkgJson.exports);

for (const key of ['types', 'main', 'module']) {
  if (typeof pkgJson[key] === 'string') pkgJson[key] = pkgJson[key].replace(/^(\.\/)?dist\//, './');
}

delete pkgJson.devDependencies;
delete pkgJson.scripts.prepack;
delete pkgJson.scripts.prepublishOnly;
delete pkgJson.scripts.prepare;

console.log(JSON.stringify(pkgJson, null, 2));
