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
const CONCURRENCY = 4; // bounded to keep translation generation stable

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

async function translateMany(values: string[], locale: string, toolName: string, localizedToolName: string): Promise<string[]> {
  if (!values.length) return [];

  const output: string[] = [];
  let chunk: string[] = [];
  let chars = 0;

  const flush = async () => {
    if (!chunk.length) return;
    const markers = chunk.map((_, index) => `__ITEM_${index}_7c1f__`);
    const source = chunk.map((value, index) => `${markers[index]}\\n${value}`).join('\\n');
    const translated = await translateText(source, locale, toolName, localizedToolName);
    const parsed = markers.map((marker, index) => {
      const start = translated.indexOf(marker);
      if (start < 0) return null;
      const contentStart = start + marker.length;
      const nextMarker = markers[index + 1];
      const end = nextMarker ? translated.indexOf(nextMarker, contentStart) : translated.length;
      if (end < 0) return null;
      return translated.slice(contentStart, end).trim();
    });
    if (parsed.some((value) => value === null || value === '')) {
      for (const value of chunk) output.push(await translateText(value, locale, toolName, localizedToolName));
    } else {
      output.push(...(parsed as string[]));
    }
    chunk = [];
    chars = 0;
  };

  for (const value of values) {
    if (chunk.length && chars + value.length > 4200) await flush();
    chunk.push(value);
    chars += value.length + 24;
  }
  await flush();
  return output;
}
async function translateTool(tool: typeof TOOLS_REGISTRY[number], locale: string): Promise<[string, ToolSeoContent]> {
  const base = getToolSeoContent(tool);
  const localizedToolName = getLocalizedToolName(tool, locale as any);

  const values = [
    base.intro,
    base.why,
    ...base.steps,
    ...base.useCases,
    ...base.tips,
    ...base.limitations,
    ...base.faq.map((item) => item.q),
    ...base.faq.map((item) => item.a),
    ...(base.formula ? [base.formula] : []),
  ];

  const translated = await translateMany(values, locale, tool.name, localizedToolName);
  let cursor = 0;
  const intro = translated[cursor++];
  const why = translated[cursor++];
  const steps = translated.slice(cursor, cursor + base.steps.length); cursor += base.steps.length;
  const useCases = translated.slice(cursor, cursor + base.useCases.length); cursor += base.useCases.length;
  const tips = translated.slice(cursor, cursor + base.tips.length); cursor += base.tips.length;
  const limitations = translated.slice(cursor, cursor + base.limitations.length); cursor += base.limitations.length;
  const faqQ = translated.slice(cursor, cursor + base.faq.length); cursor += base.faq.length;
  const faqA = translated.slice(cursor, cursor + base.faq.length); cursor += base.faq.length;
  const formula = base.formula ? translated[cursor] : undefined;

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
