import fs from 'node:fs';

const registry = fs.readFileSync('data/toolsRegistry.ts', 'utf8');
const seoSource = fs.readFileSync('data/toolSeo.ts', 'utf8');
const localizedPage = fs.readFileSync('app/[locale]/tools/[slug]/page.tsx', 'utf8');
const englishPage = fs.readFileSync('app/tools/[slug]/page.tsx', 'utf8');
const englishClient = fs.readFileSync('components/EnglishToolPageClient.tsx', 'utf8');
const localeSource = fs.readFileSync('data/internationalSeo.ts', 'utf8');
const generatedSource = fs.readFileSync('data/generatedLocalizedToolSeo.ts', 'utf8');
const mergeGuide = fs.readFileSync('data/mergePdfLocalizedGuide.ts', 'utf8');

const localeBlock = localeSource.split('export const LOCALES')[1]?.split('];')[0] ?? '';
const locales = [...localeBlock.matchAll(/code\s*:\s*'([^']+)'/g)].map((match) => match[1]);
const entries = [...registry.matchAll(/\{\s*name\s*:\s*'([^']+)'[\s\S]*?\}/g)]
  .map(([block, name]) => {
    const slug = block.match(/\bslug\s*:\s*'([^']+)'/)?.[1];
    const category = block.match(/\bcategory\s*:\s*'([^']+)'/)?.[1];
    const description = block.match(/\bdescription\s*:\s*'((?:\\'|[^'])*)'/)?.[1]?.replace(/\\'/g, "'");
    const keyword = block.match(/\btargetKeyword\s*:\s*'([^']+)'/)?.[1];
    return { name, slug, category, description, keyword };
  })
  .filter((tool) => tool.category && tool.category !== 'Festival' && tool.slug);


const errors = [];
const warnings = [];
const duplicates = (values) => {
  const seen = new Set();
  const repeated = new Set();
  for (const value of values) {
    const normalized = value.trim().toLocaleLowerCase();
    if (seen.has(normalized)) repeated.add(value);
    seen.add(normalized);
  }
  return [...repeated];
};

if (entries.length !== 112) errors.push(`Expected 112 non-festival tools; parsed ${entries.length}`);
if (new Set(entries.map((tool) => tool.slug)).size !== entries.length) errors.push('Duplicate tool slugs found');
if (locales.length !== 12) errors.push(`Expected 12 locales; parsed ${locales.length}`);

const duplicateKeywords = duplicates(entries.map((tool) => tool.keyword));
if (duplicateKeywords.length) errors.push(`Duplicate target keywords: ${duplicateKeywords.join(', ')}`);
const duplicateDescriptions = duplicates(entries.map((tool) => tool.description));
if (duplicateDescriptions.length) warnings.push(`Repeated registry descriptions: ${duplicateDescriptions.join(', ')}`);

for (const tool of entries) {
  if (!tool.description.trim() || tool.description.length < 35) errors.push(`${tool.slug}: missing/too-short source description`);
  if (!tool.keyword.trim() || tool.keyword.length < 4) errors.push(`${tool.slug}: missing target keyword`);
}

if (!englishPage.includes('targetKeyword') || !englishPage.includes('Toolployee')) errors.push('English metadata title template is missing');
if (!englishClient.includes('tool.targetKeyword') || !englishClient.includes('tool.name')) errors.push('Visible English H1 is not derived from each tool target keyword/name');
if (!/generateMetadata/.test(localizedPage) || !/getLocalizedToolSeoContent\(tool, locale\.code\)/.test(localizedPage)) errors.push('Localized metadata is not derived from localized SEO content');
if (!/LOCALIZED_GENERIC/.test(seoSource) || !/GENERATED_LOCALIZED_TOOL_SEO\[locale\]\?\.\[tool\.slug\]/.test(seoSource)) errors.push('Localized fallback/translation lookup is missing');

const emptyLocaleMaps = [...seoSource.matchAll(/\b(es|de|fr|it|ja|ko|zh|ru|ar|hi):\s*\{\s*\}/g)].map((match) => match[1]);
if (emptyLocaleMaps.length) warnings.push(`No category-specific translation overrides currently defined for: ${emptyLocaleMaps.join(', ')}. These locales use translated generic fallback for many tools.`);

const localizedMapStart = seoSource.indexOf('const LOCALIZED_SEO');
const localizedMapEnd = seoSource.indexOf('const LOCALIZED_GENERIC');
const localizedMapSource = seoSource.slice(localizedMapStart, localizedMapEnd);
const localizedMapHeaders = [...localizedMapSource.matchAll(/(pt|es|de|fr|it|ja|ko|zh|ru|ar|hi):\s*\{/g)]
  .map((match) => ({ locale: match[1], index: match.index + match[0].lastIndexOf(match[1]) }));
const expectedCategories = ['PDF', 'Image', 'Compiler', 'Developer', 'Text', 'Converters', 'Finance', 'Calculators', 'YouTube'];
const categoryCoverage = {};
for (let index = 0; index < localizedMapHeaders.length; index += 1) {
  const current = localizedMapHeaders[index];
  const end = localizedMapHeaders[index + 1]?.index ?? localizedMapSource.length;
  const localeText = localizedMapSource.slice(current.index, end);
  const normalizedLocaleText = localeText.replace(/[\"']/g, '');
  const present = expectedCategories.filter((category) => new RegExp('\\b' + category + ':\\s*\\{').test(normalizedLocaleText));
  categoryCoverage[current.locale] = present;
  const missing = expectedCategories.filter((category) => !present.includes(category));
  if (missing.length) errors.push(`Category-specific localized guide coverage incomplete for ${current.locale}: missing ${missing.join(', ')}`);
}
const expectedLocalizedMapLocales = ['pt', 'es', 'de', 'fr', 'it', 'ja', 'ko', 'zh', 'ru', 'ar', 'hi'];
for (const locale of expectedLocalizedMapLocales) {
  if (!categoryCoverage[locale]) errors.push(`No category-specific localized guide map found for ${locale}; localized category coverage is required.`);
}

const generatedEntries = (generatedSource.match(/\b(?:merge-pdf|[a-z0-9]+(?:-[a-z0-9]+)*)\s*:/g) || []).length;
if (generatedEntries < 10) warnings.push('Per-tool localized override dataset is small; localized pages rely on category-specific guides where available and generic localized fallback elsewhere.');
const localizedMergeLocales = [...mergeGuide.matchAll(/^\s{2}(pt|es|de|fr|it|ja|ko|zh|ru|ar|hi):\s*\{/gm)].map((match) => match[1]);
if (localizedMergeLocales.length !== 11) errors.push(`Merge PDF guide should have 11 non-English translations; found ${localizedMergeLocales.length}`);

const genericSignals = [
  'This localized route is part of Toolployee international coverage',
  'Use this page when you need to complete this specific task',
  'The right workflow depends on your input',
];
for (const signal of genericSignals) {
  if (seoSource.includes(signal)) errors.push(`Generic/repeated copy detected in SEO source: "${signal}"`);
}

if (errors.length) {
  console.error('\nTool SEO quality audit FAILED');
  for (const error of errors) console.error(`✗ ${error}`);
  for (const warning of warnings) console.warn(`⚠ ${warning}`);
  process.exit(1);
}

console.log(`Tool SEO structure OK: ${entries.length} regular tools × ${locales.length} locales = ${entries.length * locales.length} route/content pairs.`);
console.log('Verified: unique source slugs/target keywords, source descriptions, English metadata/H1 templates, localized metadata lookup, and 11 explicit Merge PDF translations.');
for (const warning of warnings) console.warn(`SEO QUALITY GAP: ${warning}`);
console.log('Note: structural checks do not certify native-speaker quality. Warnings must be resolved before claiming every localized guide is bespoke.');
