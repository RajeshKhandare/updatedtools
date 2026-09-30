import { setTimeout as sleep } from 'node:timers/promises';

const BASE_URL = (
  process.env.SMOKE_BASE_URL ||
  'https://updatedtools.rajeshkhandare788.workers.dev'
).replace(/\/$/, '');

const LOCALES = [
  'en', 'pt', 'es', 'de', 'fr', 'it',
  'ja', 'ko', 'zh', 'ru', 'ar', 'hi',
];

// English is the default site locale and intentionally uses /tools/*. Other locales use /<locale>/tools/*.

const fs = await import('node:fs');
const registrySource = fs.readFileSync('data/toolsRegistry.ts', 'utf8');
const TOOL_SLUGS = [...registrySource.matchAll(/slug:\\s*'([^']+)'[\\s\\S]*?category:\\s*'([^']+)'/g)]
  .filter(([, , category]) => category !== 'Festival')
  .map(([, slug]) => slug);

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

async function check(url, locale) {
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const response = await fetch(url, {
        redirect: 'follow',
        signal: AbortSignal.timeout(20000),
        headers: { 'user-agent': 'Toolployee-localized-route-smoke/1.0' },
      });

      const html = await response.text();

      assert(response.ok, `${url}: HTTP ${response.status}`);
      assert(html.length > 1000, `${url}: unexpectedly small HTML response`);
      assert(!/Application error|Unhandled Runtime Error|Tool not found/i.test(html),
        `${url}: application/tool error marker found`);

      const lang = html.match(/<html[^>]*\blang=["']([^"']+)["']/i)?.[1]?.toLowerCase();
      if (lang) {
        assert(lang === locale || lang.startsWith(locale + '-'),
          `${url}: html lang is ${lang}, expected ${locale}`);
      }

      const dir = html.match(/<html[^>]*\bdir=["']([^"']+)["']/i)?.[1]?.toLowerCase();
      if (locale === 'ar') {
        assert(dir === 'rtl', `${url}: Arabic page is not RTL`);
      } else if (dir) {
        assert(dir === 'ltr', `${url}: unexpected dir=${dir}`);
      }

      return;
    } catch (error) {
      if (attempt === 3) throw error;
      await sleep(500 * attempt);
    }
  }
}

async function main() {
  const expected = LOCALES.length * TOOL_SLUGS.length;
  assert(TOOL_SLUGS.length === 112, `Expected 112 localized tools, found ${TOOL_SLUGS.length}`);

  console.log(`Checking ${expected} localized tool routes (${LOCALES.length} locales × ${TOOL_SLUGS.length} tools) on ${BASE_URL}`);

  const failures = [];
  let cursor = 0;
  const concurrency = 12;

  async function worker() {
    while (true) {
      const index = cursor++;
      if (index >= expected) return;

      const locale = LOCALES[Math.floor(index / TOOL_SLUGS.length)];
      const slug = TOOL_SLUGS[index % TOOL_SLUGS.length];
      const path = locale === 'en' ? `/tools/${slug}` : `/${locale}/tools/${slug}`;
      const url = `${BASE_URL}${path}`;

      try {
        await check(url, locale);
      } catch (error) {
        failures.push({ locale, slug, url, error: String(error?.message || error) });
      }
    }
  }

  await Promise.all(Array.from({ length: concurrency }, worker));

  const passed = expected - failures.length;
  console.log(JSON.stringify({
    baseUrl: BASE_URL,
    locales: LOCALES.length,
    tools: TOOL_SLUGS.length,
    tested: expected,
    passed,
    failed: failures.length,
    failures,
  }, null, 2));

  if (failures.length) process.exit(1);
  console.log(`GREEN: all ${expected} localized tool routes are reachable and render without application errors.`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
