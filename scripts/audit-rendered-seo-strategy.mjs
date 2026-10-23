import fs from 'node:fs';

const registry = fs.readFileSync('data/toolsRegistry.ts', 'utf8');
const seo = fs.readFileSync('data/toolSeo.ts', 'utf8');
const timetable = fs.readFileSync('data/timeTableSeo.ts', 'utf8');
const mergeGuide = fs.readFileSync('data/mergePdfLocalizedGuide.ts', 'utf8');
const component = fs.readFileSync('components/ToolSeoContent.tsx', 'utf8');

const errors = [];
const warnings = [];
const normalize = (value) => value
  .normalize('NFKC')
  .toLocaleLowerCase()
  .replace(/[’‘]/g, "'")
  .replace(/[^\p{L}\p{N}]+/gu, ' ')
  .trim()
  .replace(/\s+/g, ' ');

const tools = [...registry.matchAll(/\{\s*name\s*:\s*'([^']+)'[\s\S]*?\}/g)]
  .map(([block, name]) => ({
    name,
    slug: block.match(/\bslug\s*:\s*'([^']+)'/)?.[1],
    category: block.match(/\bcategory\s*:\s*'([^']+)'/)?.[1],
  }))
  .filter((tool) => tool.slug && tool.category && tool.category !== 'Festival');
const regular = tools.filter((tool) => tool.category !== 'Time Table');
const timetableTools = tools.filter((tool) => tool.category === 'Time Table');

const profileStart = seo.indexOf('const profiles: Record');
const profileEnd = seo.indexOf('\n  };', profileStart);
if (profileStart < 0 || profileEnd < 0) {
  errors.push('Could not locate the explicit English tool SEO profile registry.');
}
const profileSource = profileStart >= 0 && profileEnd > profileStart
  ? seo.slice(profileStart, profileEnd)
  : '';
const profileBlocks = [...profileSource.matchAll(/^\s{4}'([^']+)':\s*\{([\s\S]*?)(?=\n\s{4}'[^']+':\s*\{|$)/gm)]
  .map((match) => ({ slug: match[1], source: match[2] }));
const profileBySlug = new Map(profileBlocks.map((profile) => [profile.slug, profile]));

function stringArray(block, key) {
  const match = block.match(new RegExp('\\b' + key + ':\\s*\\[([\\s\\S]*?)\\]'));
  return match ? [...match[1].matchAll(/'((?:\\\\'|[^'])*)'/g)].map((item) => item[1].replace(/\\\\'/g, "'")) : [];
}
function faqPairs(block) {
  const match = block.match(/\bfaq:\s*\[([\s\S]*?)\]\s*\}/);
  if (!match) return [];
  return [...match[1].matchAll(/\{\s*q:\s*'((?:\\\\'|[^'])*)'\s*,\s*a:\s*'((?:\\\\'|[^'])*)'\s*\}/g)]
    .map((item) => ({ q: item[1].replace(/\\\\'/g, "'"), a: item[2].replace(/\\\\'/g, "'") }));
}
function checkUniqueWithin(slug, label, values) {
  const seen = new Set();
  for (const value of values) {
    const key = normalize(value);
    if (!key) errors.push(slug + ': empty ' + label + ' entry.');
    else if (seen.has(key)) errors.push(slug + ': duplicate ' + label + ' entry inside one tool profile: ' + value);
    seen.add(key);
  }
}
function shingles(text, size = 4) {
  const words = normalize(text).split(' ').filter(Boolean);
  if (words.length < size) return new Set(words.length ? [words.join(' ')] : []);
  return new Set(Array.from({ length: words.length - size + 1 }, (_, i) => words.slice(i, i + size).join(' ')));
}
function similarity(a, b) {
  const left = shingles(a);
  const right = shingles(b);
  if (!left.size || !right.size) return 0;
  let overlap = 0;
  for (const token of left) if (right.has(token)) overlap += 1;
  return overlap / (left.size + right.size - overlap);
}

if (tools.length !== 112) errors.push('Expected 112 non-festival catalog tools; found ' + tools.length + '.');
if (regular.length !== 87) errors.push('Expected 87 non-timetable tools eligible for explicit profiles; found ' + regular.length + '.');
if (timetableTools.length !== 25) errors.push('Expected 25 timetable tools on the dedicated guide engine; found ' + timetableTools.length + '.');
const missingProfiles = regular.filter((tool) => !profileBySlug.has(tool.slug));
if (missingProfiles.length) errors.push('Missing explicit English SEO profiles: ' + missingProfiles.map((tool) => tool.slug).join(', '));
const unknownProfiles = profileBlocks.filter((profile) => !regular.some((tool) => tool.slug === profile.slug));
if (unknownProfiles.length) errors.push('SEO profiles not mapped to eligible catalog tools: ' + unknownProfiles.map((profile) => profile.slug).join(', '));

const uniqueContent = [];
for (const tool of regular) {
  const profile = profileBySlug.get(tool.slug);
  if (!profile) continue;
  const examples = stringArray(profile.source, 'examples');
  const mistakes = stringArray(profile.source, 'mistakes');
  const faqs = faqPairs(profile.source);
  if (examples.length < 3) errors.push(tool.slug + ': needs at least 3 tool-specific examples; found ' + examples.length + '.');
  if (mistakes.length < 3) errors.push(tool.slug + ': needs at least 3 tool-specific common mistakes; found ' + mistakes.length + '.');
  if (faqs.length < 1) errors.push(tool.slug + ': needs at least 1 tool-specific FAQ.');
  checkUniqueWithin(tool.slug, 'examples', examples);
  checkUniqueWithin(tool.slug, 'common mistakes', mistakes);
  checkUniqueWithin(tool.slug, 'FAQ questions', faqs.map((faq) => faq.q));
  for (const [label, values] of [['example', examples], ['mistake', mistakes], ['FAQ answer', faqs.map((faq) => faq.a)]]) {
    for (const value of values) {
      if (value.trim().length < 18) errors.push(tool.slug + ': ' + label + ' is too short to be useful: ' + value);
      uniqueContent.push({ slug: tool.slug, label, value });
    }
  }
}
const exactAcrossTools = new Map();
for (const item of uniqueContent) {
  const key = normalize(item.value);
  const prior = exactAcrossTools.get(key);
  if (prior && prior.slug !== item.slug && ['example', 'mistake'].includes(item.label)) {
    warnings.push('Repeated tool-specific ' + item.label + ' across ' + prior.slug + ' and ' + item.slug + ': ' + item.value);
  } else if (!prior) exactAcrossTools.set(key, item);
}
const similarityPairs = [];
const distinct = uniqueContent.filter((item) => ['example', 'mistake'].includes(item.label) && normalize(item.value).split(' ').length >= 7);
for (let i = 0; i < distinct.length; i += 1) {
  for (let j = i + 1; j < distinct.length; j += 1) {
    if (distinct[i].slug === distinct[j].slug) continue;
    const score = similarity(distinct[i].value, distinct[j].value);
    if (score >= 0.78 && normalize(distinct[i].value) !== normalize(distinct[j].value)) {
      similarityPairs.push({ a: distinct[i], b: distinct[j], score: Number(score.toFixed(2)) });
    }
  }
}
for (const pair of similarityPairs.slice(0, 30)) {
  warnings.push('Potential near-duplicate ' + pair.a.label + ' (' + pair.score + ' Jaccard): ' + pair.a.slug + ' / ' + pair.b.slug);
}

const expectedEnglishSections = [
  'What ' + ' + tool.name + ' + ' does',
  'How to use ',
  'Practical use cases for ',
  'Best practices and common mistakes',
  'Limitations and final quality checks',
  'Frequently asked questions about ',
];
for (const marker of expectedEnglishSections.slice(1)) {
  if (!seo.includes(marker)) errors.push('English SEO guide builder is missing required Merge PDF benchmark section: ' + marker);
}
if (!seo.includes('Formula, assumptions, or output interpretation')) errors.push('Optional technical interpretation section is missing from the English guide builder.');
if (!seo.includes('const TASK_BY_SLUG') || !seo.includes('const LOCALIZED_TASK_PURPOSE')) errors.push('Localized tool-purpose mapping is missing.');
if (!seo.includes('heading: labels.what +') || !seo.includes('heading: labels.uses +') || !seo.includes('heading: labels.practices') || !seo.includes('heading: labels.limits')) {
  errors.push('Localized guide builder is missing one or more purpose/use-case/practices/limitations sections.');
}
if (!seo.includes('heading: replaceTool(({pt:') || !seo.includes('const localizedSpecificFaq')) errors.push('Localized guide builder is missing localized workflow heading or tool-named FAQs.');
if (!component.includes('const introLead = seo.intro.trim().match') || !component.includes('const seenParagraphs = new Set<string>()')) {
  errors.push('Rendered article must deduplicate repeated intro leads and repeated paragraphs within each section.');
}
if (!mergeGuide.includes('headings: [') || !mergeGuide.includes('paragraphs: [') || !mergeGuide.includes('bullets: [')) {
  errors.push('Merge PDF localized benchmark must retain section headings, explanatory paragraphs, and actionable bullets.');
}
const timetableGuideChecks = [
  ['localized timetable engine', timetable.includes('getTimeTableSeoContent')],
  ['localized timetable names', timetable.includes('getTimeTableLocalizedName')],
  ['steps', timetable.includes('steps:')],
  ['use cases', timetable.includes('useCases:')],
  ['tips', timetable.includes('tips:')],
  ['FAQs', timetable.includes('faq:')],
];
for (const [label, ok] of timetableGuideChecks) if (!ok) errors.push('Dedicated timetable guide is missing ' + label + '.');

console.log('SEO content strategy audit');
console.log('Catalog: ' + tools.length + ' tools; ' + regular.length + ' explicit-profile tools; ' + timetableTools.length + ' dedicated timetable tools.');
console.log('Explicit profile coverage: ' + (regular.length - missingProfiles.length) + '/' + regular.length + '.');
console.log('Benchmark sections checked: purpose, step-by-step workflow, use cases, best practices/mistakes, limitations/quality checks, FAQs, optional technical interpretation.');
console.log('Tool-specific content entries checked: ' + uniqueContent.length + '; near-duplicate pairs flagged: ' + similarityPairs.length + '.');
if (warnings.length) {
  console.warn('SEO content audit warnings (' + warnings.length + '):');
  for (const warning of warnings.slice(0, 60)) console.warn('! ' + warning);
  if (warnings.length > 60) console.warn('... ' + (warnings.length - 60) + ' additional warnings omitted.');
}
if (errors.length) {
  console.error('SEO content strategy audit FAILED (' + errors.length + ' errors):');
  for (const error of errors) console.error('x ' + error);
  process.exit(1);
}
console.log('SEO content strategy audit passed.');
