// REPOSITORY SOURCE: diplomat-bit/aibankingmtls | PATH: diplomat-bit-aibankingmtls-6a06a68/generate-names.cjs
================================================================================

const fs = require('fs');
const path = require('path');

const modelsDir = path.join(__dirname, 'models');
const files = fs.readdirSync(modelsDir);

const names = files
  .filter(file => file.endsWith('.ts') && file !== 'index.ts')
  .map(file => file.replace('.ts', ''));

const outputContent = `export const modelNames: string[] = ${JSON.stringify(names, null, 2)};\n`;

fs.writeFileSync(path.join(__dirname, 'src', 'modelNames.ts'), outputContent);
console.log(`Generated src/modelNames.ts with ${names.length} model names.`);
