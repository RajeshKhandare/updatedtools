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
if (!/export function fitSeoMetaDescription/.test(seoSource)) errors.push('Readable meta description length helper is missing');
if (!/fitSeoMetaDescription\(rawDescription\)/.test(englishPage)) errors.push('English metadata does not use the readable description helper');
if (!/fitSeoMetaDescription\(expandedDescription\)/.test(localizedPage)) errors.push('Localized metadata does not use the readable description helper');
for (const locale of ['pt', 'es', 'de', 'fr', 'it', 'ja', 'ko', 'zh', 'ru', 'ar', 'hi']) {
  if (!new RegExp(locale + ": ' ").test(localizedPage)) errors.push('Localized meta-description suffix is missing for ' + locale);
}
if (!/minUsefulLength/.test(localizedPage)) errors.push('Localized metadata does not expand short search snippets');

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
const focusStart = seoSource.indexOf('const profiles: Record');
const focusEnd = seoSource.indexOf('\n  };', focusStart);
const explicitToolProfiles = focusStart >= 0 && focusEnd > focusStart
  ? [...seoSource.slice(focusStart, focusEnd).matchAll(/^\s{4}'([^']+)':\s*\{/gm)].map((match) => match[1])
  : [];
const regularTools = entries.filter((tool) => tool.category !== 'Time Table');
const profileSlugs = new Set(explicitToolProfiles);
const missingEnglishProfiles = regularTools.filter((tool) => !profileSlugs.has(tool.slug));
if (missingEnglishProfiles.length) {
  errors.push(`Tool-specific English SEO profiles missing for: ${missingEnglishProfiles.map((tool) => tool.slug).join(', ')}`);
}

const profileSource = focusStart >= 0 && focusEnd > focusStart
  ? seoSource.slice(focusStart, focusEnd)
  : '';
const profileHeaders = [...profileSource.matchAll(/^\s{4}'([^']+)':\s*\{/gm)]
  .map((match) => ({ slug: match[1], index: match.index }));
for (let index = 0; index < profileHeaders.length; index += 1) {
  const current = profileHeaders[index];
  const end = profileHeaders[index + 1]?.index ?? profileSource.length;
  const block = profileSource.slice(current.index, end);
  const countArrayStrings = (property) => {
    const match = block.match(new RegExp(property + ':\\s*\\[([\\s\\S]*?)\\]'));
    return match ? (match[1].match(/'[^']*'/g) || []).length : 0;
  };
  const exampleCount = countArrayStrings('examples');
  const mistakeCount = countArrayStrings('mistakes');
  const faqCount = (block.match(/\\{\\s*q:/g) || []).length;
  if (exampleCount < 3) errors.push(`${current.slug}: expected at least 3 tool-specific examples; found ${exampleCount}`);
  if (mistakeCount < 3) errors.push(`${current.slug}: expected at least 3 tool-specific common mistakes; found ${mistakeCount}`);
  if (faqCount < 1) errors.push(`${current.slug}: at least 1 tool-specific FAQ is required`);
  if (!/focus:/.test(block) && !/examples:/.test(block)) errors.push(`${current.slug}: SEO profile has no tool-specific focus or examples`);
}
const guideBuilderStart = seoSource.indexOf('function withStructuredGuide');
const guideBuilder = seoSource.slice(guideBuilderStart, seoSource.indexOf('type LocalizedTaskKey', guideBuilderStart));
for (const marker of [
  'How to use ',
  'Practical use cases for ',
  'Best practices and common mistakes',
  'Limitations and final quality checks',
  'Frequently asked questions about ',
  'faqParagraphs',
]) {
  if (!guideBuilder.includes(marker)) errors.push(`English detailed SEO guide is missing required content marker: ${marker}`);
}
const localizedBuilderStart = seoSource.indexOf('export function getLocalizedToolSeoContent');
const localizedBuilder = seoSource.slice(localizedBuilderStart);
const requiredLocalizedSections = [
  'heading: labels.what +',
  'heading: replaceTool(({pt:',
  'heading: labels.uses +',
  'heading: labels.practices',
  'heading: labels.limits',
  'heading: replaceTool(({pt:',
];
if (localizedBuilderStart < 0) errors.push('Localized per-tool SEO guide builder is missing');
for (const marker of requiredLocalizedSections) {
  if (!localizedBuilder.includes(marker)) errors.push(`Localized guide builder is missing required detailed section marker: ${marker}`);
}
for (const locale of expectedLocalizedMapLocales) {
  if (!localizedBuilder.includes(`${locale}: {`)) errors.push(`Localized per-tool guide templates are missing locale-specific copy for ${locale}`);
}
if (!localizedBuilder.includes('articleSections: [') || !localizedBuilder.includes('const localizedSpecificFaq')) {
  errors.push('Localized per-tool guide must provide article sections and tool-named FAQs');
}
const expectedRuntimeLocalizedGuides = regularTools.length * (locales.length - 1);
const taskMapStart = seoSource.indexOf('const TASK_BY_SLUG');
const taskMapEnd = seoSource.indexOf('const LOCALIZED_TASK_PURPOSE', taskMapStart);
if (taskMapStart < 0 || taskMapEnd < 0) {
  errors.push('Tool-specific localized task-purpose map is missing');
} else {
  const taskMapSource = seoSource.slice(taskMapStart, taskMapEnd);
  const taskMapEntries = [...taskMapSource.matchAll(/'([^']+)':\s*'([^']+)'/g)];
  const mappedSlugs = new Set(taskMapEntries.map((match) => match[1]));
  const taskMappedTools = entries.filter((tool) => tool.category !== 'Time Table');
  const missingTaskPurpose = taskMappedTools.filter((tool) => !mappedSlugs.has(tool.slug));
  if (missingTaskPurpose.length) errors.push('Localized task-purpose mapping missing for: ' + missingTaskPurpose.map((tool) => tool.slug).join(', '));
  const taskKeys = new Set(taskMapEntries.map((match) => match[2]));
  const purposeStart = seoSource.indexOf('const LOCALIZED_TASK_PURPOSE');
  const purposeSource = seoSource.slice(purposeStart);
  const localeHeaders = [...purposeSource.matchAll(/^  (pt|es|de|fr|it|ja|ko|zh|ru|ar|hi): \{/gm)];
  const foundLocales = new Set(localeHeaders.map((match) => match[1]));
  for (const locale of expectedLocalizedMapLocales) {
    if (!foundLocales.has(locale)) errors.push('Localized task-purpose map is missing locale ' + locale);
  }
  for (let index = 0; index < localeHeaders.length; index += 1) {
    const locale = localeHeaders[index][1];
    const blockStart = localeHeaders[index].index + localeHeaders[index][0].length;
    const blockEnd = localeHeaders[index + 1]?.index ?? purposeSource.indexOf('\n};', blockStart);
    const localeBlock = purposeSource.slice(blockStart, blockEnd < 0 ? undefined : blockEnd);
    const missingKeys = [...taskKeys].filter((key) => !localeBlock.includes("'" + key + "':") && !localeBlock.includes(key + ':'));
    if (missingKeys.length) errors.push('Localized task-purpose copy for ' + locale + ' is missing task keys: ' + missingKeys.join(', '));
  }
}

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
console.log(`Verified: unique source slugs/target keywords, source descriptions, English metadata/H1 templates, localized metadata lookup, ${explicitToolProfiles.length} explicit tool-specific English profiles, 11 explicit Merge PDF translations, and tool-specific localized task-purpose coverage for all ${regularTools.length} non-timetable tools across 11 non-English locales (${expectedRuntimeLocalizedGuides} slots), with timetable tools handled by their dedicated guide engine.`);
console.log(`Localized category guide coverage OK: ${Object.keys(categoryCoverage).length} locales × ${expectedCategories.length} categories = ${Object.values(categoryCoverage).reduce((total, categories) => total + categories.length, 0)} locale-category checks.`);
for (const warning of warnings) console.warn(`SEO QUALITY GAP: ${warning}`);
console.log('Quality note: the audit verifies structural coverage and locale-specific templates, not human/native-speaker review of every generated paragraph.');
