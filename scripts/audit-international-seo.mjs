import fs from 'node:fs';

const localeSource = fs.readFileSync('data/internationalSeo.ts', 'utf8');
const seedSource = fs.readFileSync('data/internationalKeywordSeeds.ts', 'utf8');
const registrySource = fs.readFileSync('data/toolsRegistry.ts', 'utf8');
const matrixSource = fs.readFileSync('data/internationalSeoMatrix.ts', 'utf8');
const validationSource = fs.readFileSync('data/internationalKeywordValidation.ts', 'utf8');
const localizationSource = fs.readFileSync('data/internationalLocalization.ts', 'utf8');
const localizedLayoutSource = fs.readFileSync('app/[locale]/tools/[slug]/layout.tsx', 'utf8');
const marketEvidenceSource = fs.readFileSync('data/internationalMarketEvidence.ts', 'utf8');

const localeMatches = [...localeSource.matchAll(/code:'([^']+)'/g)].map((m) => m[1]);
const seedMatches = [...seedSource.matchAll(/locale:'([^']+)'/g)].map((m) => m[1]);
const toolMatches = [...registrySource.matchAll(/slug:\s*'([^']+)'/g)].map((m) => m[1]);

if (new Set(toolMatches).size !== 87) throw new Error(`Expected 87 tools, found ${new Set(toolMatches).size}`);
if (localeMatches.length !== 12) throw new Error(`Expected 12 locales, found ${localeMatches.length}`);
if (seedMatches.length !== 11) throw new Error(`Expected 11 non-English seed markets, found ${seedMatches.length}`);
const hasMatrixGenerator = /TOOLS_REGISTRY\.flatMap\(\(tool\)\s*=>\s*INTERNATIONAL_KEYWORD_SEEDS\.map\(\(market\)/s.test(matrixSource);
if (!hasMatrixGenerator) throw new Error('International SEO matrix is not generated from every tool × seed market');
if (!/getLongTailQueryCandidates/.test(matrixSource) || !/longTailQueryCandidates:/.test(matrixSource)) throw new Error('International SEO matrix must expose long-tail query candidates for every tool × market row');
if (!/LONG_TAIL_QUERY_PATTERNS/.test(localizationSource) || !/getLongTailQueryCandidates/.test(localizationSource)) throw new Error('Long-tail query candidate generation is missing');
const expectedMatrixRows = 87 * 11;
const expectedLocalizationRows = 87 * 12;
const marketEvidenceLocales = [...marketEvidenceSource.matchAll(/locale: '([^']+)'/g)].map((m) => m[1]);
const expectedEvidenceLocales = seedMatches;
if (marketEvidenceLocales.length !== expectedEvidenceLocales.length || expectedEvidenceLocales.some((locale) => !marketEvidenceLocales.includes(locale))) {
  throw new Error('Every non-English seed market must have localized market evidence');
}
const marketEvidenceSourceCount = [...marketEvidenceSource.matchAll(/sourceUrls: \[/g)].length;
if (marketEvidenceSourceCount !== marketEvidenceLocales.length) throw new Error('Every market evidence entry must include source URLs');
const hasCoverageGenerator = /LOCALES\.flatMap\(\(locale\)\s*=>\s*\n?\s*TOOLS_REGISTRY\.map\(\(tool\)/s.test(localizationSource);
if (!hasCoverageGenerator) throw new Error('International localization coverage is not generated from every locale × tool');
if (!/LOCALES\.flatMap/.test(localizedLayoutSource) || !/TOOLS_REGISTRY\.map/.test(localizedLayoutSource)) throw new Error('Localized route is not statically generated for every locale × tool');
const validationLocales = [...validationSource.matchAll(/locale: '([^']+)'/g)].map((m) => m[1]);
const validationSourceCount = [...validationSource.matchAll(/sourceUrls: \[/g)].length;
if (validationLocales.length !== validationSourceCount) throw new Error('Localized keyword validation entries must each include source URLs');
if (validationLocales.some((locale) => !seedMatches.includes(locale))) throw new Error('Localized keyword validation contains an unknown locale');
const validatedRowCount = validationLocales.length;
if (validatedRowCount < 1) throw new Error('Expected at least one evidence-backed localized keyword validation');

const missingSeeds = localeMatches
  .filter((code) => code !== 'en')
  .filter((code) => !seedMatches.includes(code === 'pt' ? 'pt-BR' : code === 'zh' ? 'zh-CN' : code));
if (missingSeeds.length) throw new Error(`Missing keyword seeds: ${missingSeeds.join(', ')}`);

console.log(`International SEO foundation OK: 87 tools, ${localeMatches.length} locales, ${seedMatches.length} non-English seed markets, ${expectedMatrixRows} research rows, ${expectedLocalizationRows} locale × tool coverage rows, long-tail candidates enabled for every matrix row, ${validatedRowCount} evidence-backed validation rows, ${marketEvidenceLocales.length} market evidence sets.`);
console.log('Market evidence supports observed local terminology only. Search-volume/difficulty/traffic claims remain unset until reliable keyword data is supplied.');
