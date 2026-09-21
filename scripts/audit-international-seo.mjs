import fs from 'node:fs';

const localeSource = fs.readFileSync('data/internationalSeo.ts', 'utf8');
const seedSource = fs.readFileSync('data/internationalKeywordSeeds.ts', 'utf8');
const registrySource = fs.readFileSync('data/toolsRegistry.ts', 'utf8');
const matrixSource = fs.readFileSync('data/internationalSeoMatrix.ts', 'utf8');

const localeMatches = [...localeSource.matchAll(/code:'([^']+)'/g)].map((m) => m[1]);
const seedMatches = [...seedSource.matchAll(/locale:'([^']+)'/g)].map((m) => m[1]);
const toolMatches = [...registrySource.matchAll(/slug:\s*'([^']+)'/g)].map((m) => m[1]);

if (new Set(toolMatches).size !== 87) throw new Error(`Expected 87 tools, found ${new Set(toolMatches).size}`);
if (localeMatches.length !== 12) throw new Error(`Expected 12 locales, found ${localeMatches.length}`);
if (seedMatches.length !== 11) throw new Error(`Expected 11 non-English seed markets, found ${seedMatches.length}`);
const hasMatrixGenerator = /TOOLS_REGISTRY\.flatMap\(\(tool\)\s*=>\s*INTERNATIONAL_KEYWORD_SEEDS\.map\(\(market\)/s.test(matrixSource);
if (!hasMatrixGenerator) throw new Error('International SEO matrix is not generated from every tool × seed market');
const expectedMatrixRows = 87 * 11;

const missingSeeds = localeMatches
  .filter((code) => code !== 'en')
  .filter((code) => !seedMatches.includes(code === 'pt' ? 'pt-BR' : code === 'zh' ? 'zh-CN' : code));
if (missingSeeds.length) throw new Error(`Missing keyword seeds: ${missingSeeds.join(', ')}`);

console.log(`International SEO foundation OK: 87 tools, ${localeMatches.length} locales, ${seedMatches.length} non-English seed markets, ${expectedMatrixRows} research rows.`);
console.log('No search-volume/difficulty claims are encoded; current country/language data must be validated before indexing localized pages.');
