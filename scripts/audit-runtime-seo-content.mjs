import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import Module, { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
import ts from 'typescript';

// Load the real TypeScript SEO builders so this audit inspects their runtime output,
// not just regexes over source templates. The resolver also supports the project's @/ alias.
const originalResolve = Module._resolveFilename;
Module._resolveFilename = function (request, parent, isMain, options) {
  const resolvedRequest = request.startsWith('@/') ? path.join(process.cwd(), request.slice(2)) : request;
  return originalResolve.call(this, resolvedRequest, parent, isMain, options);
};
require.extensions['.ts'] = (module, filename) => {
  const source = fs.readFileSync(filename, 'utf8');
  const compiled = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2022,
      jsx: ts.JsxEmit.ReactJSX,
      esModuleInterop: true,
      moduleResolution: ts.ModuleResolutionKind.Node10,
    },
    fileName: filename,
  });
  module._compile(compiled.outputText, filename);
};

const { TOOLS_REGISTRY } = require(path.join(process.cwd(), 'data/toolsRegistry.ts'));
const { getLocalizedToolSeoContent } = require(path.join(process.cwd(), 'data/toolSeo.ts'));
const { GENERATED_LOCALIZED_TOOL_SEO } = require(path.join(process.cwd(), 'data/generatedLocalizedToolSeo.ts'));
const { getLocalizedToolName } = require(path.join(process.cwd(), 'data/internationalLocalization.ts'));
const locales = ['en', 'pt', 'es', 'de', 'fr', 'it', 'ja', 'ko', 'zh', 'ru', 'ar', 'hi'];
const tools = TOOLS_REGISTRY.filter((tool) => tool.category !== 'Festival');
const errors = [];
const warnings = [];
const pages = [];
const crossPageParagraphs = new Map();
const normalize = (value) => String(value ?? '')
  .normalize('NFKC')
  .toLocaleLowerCase()
  .replace(/c\+\+/gu, 'cplusplus')
  .replace(/c#/gu, 'csharp')
  .replace(/\.net/gu, ' dotnet ')
  .replace(/[’‘]/g, "'")
  .replace(/[^\p{L}\p{N}]+/gu, ' ')
  .trim()
  .replace(/\s+/g, ' ');
const introLead = (intro) => String(intro ?? '').trim().match(/^.*?[.!?](?=\s|$)/)?.[0]?.trim() ?? '';
const stripIntroLead = (paragraph, lead) => {
  const value = String(paragraph ?? '').trim();
  return lead && value.toLocaleLowerCase().startsWith(lead.toLocaleLowerCase())
    ? value.slice(lead.length).replace(/^\s+/, '').trim()
    : value;
};
function shingles(text, size = 5) {
  const words = normalize(text).split(' ').filter(Boolean);
  if (words.length < size) return new Set();
  return new Set(Array.from({ length: words.length - size + 1 }, (_, i) => words.slice(i, i + size).join(' ')));
}
function jaccardSets(left, right) {
  if (!left.size || !right.size) return 0;
  let overlap = 0;
  for (const token of left) if (right.has(token)) overlap += 1;
  return overlap / (left.size + right.size - overlap);
}
const isFaqHeading = (heading) => /\bfaq\b|frequently asked questions|preguntas frecuentes|perguntas frequentes|häufige fragen|questions fréquentes|domande frequenti|よくある質問|자주 묻는 질문|常见问题|常见问答|часто задаваемые вопросы|الأسئلة الشائعة|अक्सर पूछे जाने वाले सवाल/i.test(heading);

for (const locale of locales) {
  const localizedNames = new Map();
  for (const tool of tools) {
    const localizedName = getLocalizedToolName(tool, locale);
    const nameKey = String(localizedName).normalize('NFKC').toLocaleLowerCase().replace(/[’‘]/g, "'").replace(/\s+/g, ' ').trim();
    const priorName = localizedNames.get(nameKey);
    if (priorName && priorName.slug !== tool.slug) {
      errors.push({ type: 'duplicate-localized-tool-name', locale, slugA: priorName.slug, slugB: tool.slug, name: localizedName });
    } else if (!priorName) {
      localizedNames.set(nameKey, { slug: tool.slug, name: localizedName });
    }
    let seo;
    try {
      seo = getLocalizedToolSeoContent(tool, locale);
    } catch (error) {
      errors.push({ type: 'builder-exception', locale, slug: tool.slug, detail: String(error?.stack ?? error).slice(0, 1200) });
      continue;
    }
    const sections = Array.isArray(seo.articleSections) ? seo.articleSections : [];
    const renderedSections = sections.filter((section) => !isFaqHeading(section.heading));
    const hasGeneratedCopy = locale !== 'en' && tool.category !== 'Time Table' && tool.category !== 'Festival' && tool.slug !== 'merge-pdf' && Boolean(GENERATED_LOCALIZED_TOOL_SEO[locale]?.[tool.slug]);
    if (sections.length < 6 && !hasGeneratedCopy) errors.push({ type: 'missing-guide-sections', locale, slug: tool.slug, count: sections.length });
    // Generated localized pages render their translated intro, explanation, workflow,
    // use cases, tips, limitations and FAQs as dedicated sections. They intentionally
    // do not receive synthetic article sections that repeat those same fields.
    // Keep checking real localized prose even when synthetic duplicate article sections are omitted.
    const auditSections = renderedSections.length ? renderedSections : hasGeneratedCopy ? [
      { heading: 'Localized intro', paragraphs: [seo.intro] },
      { heading: 'Localized explanation', paragraphs: [seo.why] },
    ] : renderedSections;
    if (!String(seo.intro ?? '').trim()) errors.push({ type: 'missing-intro', locale, slug: tool.slug });
    if (!String(seo.why ?? '').trim()) errors.push({ type: 'missing-why', locale, slug: tool.slug });
    if (!Array.isArray(seo.steps) || seo.steps.length < 3) errors.push({ type: 'missing-workflow-steps', locale, slug: tool.slug });
    if (!Array.isArray(seo.useCases) || seo.useCases.length < 2) errors.push({ type: 'missing-use-cases', locale, slug: tool.slug });
    if (!Array.isArray(seo.tips) || seo.tips.length < 2) errors.push({ type: 'missing-best-practices', locale, slug: tool.slug, minimum: 2 });
    if (!Array.isArray(seo.limitations) || seo.limitations.length < 2) errors.push({ type: 'missing-limitations', locale, slug: tool.slug });
    if (!Array.isArray(seo.faq) || seo.faq.length < 2) errors.push({ type: 'missing-faq', locale, slug: tool.slug });

    const lead = introLead(seo.intro);
    const seenOnPage = new Map();
    let paragraphCount = 0;
    for (const section of auditSections) {
      if (!String(section.heading ?? '').trim()) errors.push({ type: 'empty-section-heading', locale, slug: tool.slug });
      const paragraphs = Array.isArray(section.paragraphs) ? section.paragraphs : [];
      if (!paragraphs.length && !(section.bullets?.length)) errors.push({ type: 'empty-guide-section', locale, slug: tool.slug, heading: section.heading });
      const seenInSection = new Set();
      for (const raw of paragraphs) {
        const paragraph = stripIntroLead(raw, lead);
        const key = normalize(paragraph);
        if (!key) continue;
        if (seenInSection.has(key)) {
          warnings.push({ type: 'duplicate-paragraph-within-section', locale, slug: tool.slug, heading: section.heading, sample: paragraph.slice(0, 180) });
          continue;
        }
        seenInSection.add(key);
        paragraphCount += 1;
        const prior = seenOnPage.get(key);
        if (prior && prior.heading !== section.heading) {
          warnings.push({ type: 'duplicate-paragraph-across-sections', locale, slug: tool.slug, sections: [prior.heading, section.heading], sample: paragraph.slice(0, 180) });
        } else if (!prior) {
          seenOnPage.set(key, { heading: section.heading, paragraph });
        }
        const list = crossPageParagraphs.get(locale) ?? [];
        list.push({ slug: tool.slug, heading: section.heading, paragraph, key });
        crossPageParagraphs.set(locale, list);
      }
    }
    pages.push({ locale, slug: tool.slug, sectionCount: sections.length, renderedArticleSectionCount: renderedSections.length, paragraphCount, faqCount: seo.faq.length });
  }
}

const nearDuplicatePairs = [];
let nearDuplicateCount = 0;
const exactDuplicatePairs = [];
for (const [locale, items] of crossPageParagraphs) {
  const byText = new Map();
  for (const item of items) {
    const prior = byText.get(item.key);
    if (prior && prior.slug !== item.slug) {
      exactDuplicatePairs.push({ locale, slugA: prior.slug, slugB: item.slug, headingA: prior.heading, headingB: item.heading, sample: item.paragraph.slice(0, 180) });
    } else if (!prior) {
      byText.set(item.key, item);
    }
  }
  // Compare only substantive paragraphs; the per-locale cap keeps CI cost predictable.
  const substantive = items.filter((item) => item.key.split(' ').length >= 14);
  // Exact copies are reported separately. Deduplicate them before similarity work and
  // precompute shingles once per paragraph to keep all-locale CI runtime predictable.
  const uniqueSubstantive = [...new Map(substantive.map((item) => [item.key, item])).values()];
  const candidates = uniqueSubstantive.slice(0, 900).map((item) => ({ ...item, shingles: shingles(item.paragraph) }));
  for (let i = 0; i < candidates.length; i += 1) {
    for (let j = i + 1; j < candidates.length; j += 1) {
      if (candidates[i].slug === candidates[j].slug) continue;
      const score = jaccardSets(candidates[i].shingles, candidates[j].shingles);
      if (score >= 0.88) {
        nearDuplicateCount += 1;
        if (nearDuplicatePairs.length < 5000) {
          nearDuplicatePairs.push({
            locale,
            slugA: candidates[i].slug,
            slugB: candidates[j].slug,
            score: Number(score.toFixed(3)),
            sampleA: candidates[i].paragraph.slice(0, 140),
            sampleB: candidates[j].paragraph.slice(0, 140),
          });
        }
      }
    }
  }
}
for (const duplicate of exactDuplicatePairs.slice(0, 120)) {
  warnings.push({ type: 'exact-paragraph-across-tools', ...duplicate });
}
for (const duplicate of nearDuplicatePairs.slice(0, 120)) {
  warnings.push({ type: 'near-duplicate-paragraph-across-tools', ...duplicate });
}

const report = {
  generatedAt: new Date().toISOString(),
  tools: tools.length,
  locales: locales.length,
  expectedPages: tools.length * locales.length,
  inspectedPages: pages.length,
  totalArticleParagraphs: pages.reduce((sum, page) => sum + page.paragraphCount, 0),
  exactCrossToolDuplicatePairs: exactDuplicatePairs.length,
  nearDuplicatePairs: nearDuplicateCount,
  errors,
  warnings: warnings.slice(0, 500),
  pages,
};
const reportPath = path.join(process.env.RUNNER_TEMP || os.tmpdir(), 'toolployee-runtime-seo-content-audit.json');
fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
console.log('Runtime SEO content audit');
console.log('Inspected ' + pages.length + '/' + (tools.length * locales.length) + ' actual builder outputs (' + tools.length + ' tools × ' + locales.length + ' locales).');
console.log('Article paragraphs: ' + report.totalArticleParagraphs + '; exact cross-tool duplicate pairs: ' + exactDuplicatePairs.length + '; near-duplicate pairs: ' + nearDuplicatePairs.length + '.');
console.log('Machine-readable report: ' + reportPath);
if (warnings.length) {
  console.warn('Runtime SEO audit warnings (' + warnings.length + '); first 30:');
  for (const warning of warnings.slice(0, 30)) console.warn(JSON.stringify(warning));
}
if (errors.length) {
  const errorCounts = {};
  for (const error of errors) errorCounts[error.type] = (errorCounts[error.type] ?? 0) + 1;
  console.error('Runtime SEO content audit FAILED (' + errors.length + ' errors). Error counts: ' + JSON.stringify(errorCounts) + '; first 80:');
  const builderErrors = errors.filter((error) => error.type === 'builder-exception');
  const otherErrors = errors.filter((error) => error.type !== 'builder-exception');
  console.error('Builder exceptions (first 20):');
  for (const error of builderErrors.slice(0, 20)) console.error(JSON.stringify(error));
  console.error('Other errors (first 60):');
  for (const error of otherErrors.slice(0, 60)) console.error(JSON.stringify(error));
  process.exit(1);
}
console.log('Runtime SEO content audit passed.');
