import fs from 'node:fs/promises';
import { TOOLS_REGISTRY } from '../data/toolsRegistry';
import { LOCALES } from '../data/internationalSeo';
import { getLocalizedToolName } from '../data/internationalLocalization';
import { getToolSeoContent, type ToolSeoContent } from '../data/toolSeo';

const TARGETS = LOCALES.filter((locale) => locale.code !== 'en').map((locale) => locale.code);
const GOOGLE_CODES: Record<string, string> = {
  pt: 'pt',
  es: 'es',
  de: 'de',
  fr: 'fr',
  it: 'it',
  ja: 'ja',
  ko: 'ko',
  zh: 'zh-CN',
  ru: 'ru',
  ar: 'ar',
  hi: 'hi',
};

const MAX_CHARS = 4200;
const CONCURRENCY = 4;

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function translateText(text: string, locale: string, toolName: string, localizedToolName: string): Promise<string> {
  if (!text.trim()) return text;

  const marker = '__TOOL_NAME_9f3a__';
  const protectedText = text.split(toolName).join(marker);
  const url = new URL('https://translate.googleapis.com/translate_a/single');
  url.searchParams.set('client', 'gtx');
  url.searchParams.set('sl', 'en');
  url.searchParams.set('tl', GOOGLE_CODES[locale]);
  url.searchParams.set('dt', 't');
  url.searchParams.set('q', protectedText);

  for (let attempt = 1; attempt <= 4; attempt++) {
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error('HTTP ' + response.status);
      const data = await response.json() as any[];
      const translated = Array.isArray(data?.[0])
        ? data[0].map((part: any[]) => String(part?.[0] ?? '')).join('')
        : '';
      if (!translated) throw new Error('empty translation');
      return translated.split(marker).join(localizedToolName);
    } catch (error) {
      if (attempt === 4) {
        console.warn('translation fallback', locale, toolName, error);
        return text.split(toolName).join(localizedToolName);
      }
      await sleep(500 * attempt);
    }
  }
  return text;
}

async function translateArray(values: string[], locale: string, toolName: string, localizedToolName: string): Promise<string[]> {
  const result: string[] = [];
  for (const value of values) {
    result.push(await translateText(value, locale, toolName, localizedToolName));
  }
  return result;
}

async function translateTool(tool: typeof TOOLS_REGISTRY[number], locale: string): Promise<[string, ToolSeoContent]> {
  const base = getToolSeoContent(tool);
  const localizedToolName = getLocalizedToolName(tool, locale as any);

  const [intro, why, steps, useCases, tips, limitations, faqQ, faqA, formula] = await Promise.all([
    translateText(base.intro, locale, tool.name, localizedToolName),
    translateText(base.why, locale, tool.name, localizedToolName),
    translateArray(base.steps, locale, tool.name, localizedToolName),
    translateArray(base.useCases, locale, tool.name, localizedToolName),
    translateArray(base.tips, locale, tool.name, localizedToolName),
    translateArray(base.limitations, locale, tool.name, localizedToolName),
    translateArray(base.faq.map((item) => item.q), locale, tool.name, localizedToolName),
    translateArray(base.faq.map((item) => item.a), locale, tool.name, localizedToolName),
    base.formula ? translateText(base.formula, locale, tool.name, localizedToolName) : Promise.resolve(undefined),
  ]);

  return [tool.slug, {
    intro,
    why,
    steps,
    useCases,
    tips,
    limitations,
    faq: base.faq.map((_, index) => ({ q: faqQ[index], a: faqA[index] })),
    visual: base.visual,
    formula,
  }];
}

async function mapConcurrent<T, R>(items: T[], worker: (item: T) => Promise<R>): Promise<R[]> {
  const output: R[] = new Array(items.length);
  let cursor = 0;
  async function run() {
    while (true) {
      const index = cursor++;
      if (index >= items.length) return;
      output[index] = await worker(items[index]);
    }
  }
  await Promise.all(Array.from({ length: Math.min(CONCURRENCY, items.length) }, run));
  return output;
}

const generated: Record<string, Record<string, ToolSeoContent>> = {};
for (const locale of TARGETS) {
  console.log('Generating', locale, 'for', TOOLS_REGISTRY.length, 'tools');
  const entries = await mapConcurrent(TOOLS_REGISTRY, (tool) => translateTool(tool, locale));
  generated[locale] = Object.fromEntries(entries);
}

const output = `// AUTO-GENERATED. Do not edit manually.\nimport type { LocaleCode } from '@/data/internationalSeo';\nimport type { ToolSeoContent } from '@/data/toolSeo';\n\nexport const GENERATED_LOCALIZED_TOOL_SEO: Partial<Record<LocaleCode, Record<string, ToolSeoContent>>> = ${JSON.stringify(generated, null, 2)};\n`;
await fs.writeFile('data/generatedLocalizedToolSeo.ts', output, 'utf8');
console.log('Wrote data/generatedLocalizedToolSeo.ts');
