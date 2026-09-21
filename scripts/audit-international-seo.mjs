import fs from 'node:fs';

const localeSource = fs.readFileSync('data/internationalSeo.ts', 'utf8');
const seedSource = fs.readFileSync('data/internationalKeywordSeeds.ts', 'utf8');
const registrySource = fs.readFileSync('data/toolsRegistry.ts', 'utf8');

const localeMatches = [...localeSource.matchAll(/code:'([^']+)'/g)].map((m) => m[1]);
const seedMatches = [...seedSource.matchAll(/locale:'([^']+)'/g)].map((m) => m[1]);
const toolMatches = [...registrySource.matchAll(/slug:\s*'([^']+)'/g)].map((m) => m[1]);

if (new Set(toolMatches).size !== 87) throw new Error(`Expected 87 tools, found ${new Set(toolMatches).size}`);
if (localeMatches.length !== 12) throw new Error(`Expected 12 locales, found ${localeMatches.length}`);

const missingSeeds = localeMatches
  .filter((code) => code !== 'en')
  .filter((code) => !seedMatches.includes(code === 'pt' ? 'pt-BR' : code === 'zh' ? 'zh-CN' : code));
if (missingSeeds.length) throw new Error(`Missing keyword seeds: ${missingSeeds.join(', ')}`);

console.log(`International SEO foundation OK: 87 tools, ${localeMatches.length} locales, ${seedMatches.length} non-English seed markets.`);
console.log('No search-volume/difficulty claims are encoded; current country/language data must be validated before indexing localized pages.');
