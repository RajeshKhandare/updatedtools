import { setTimeout as sleep } from 'node:timers/promises';

const BASE_URL = (
  process.env.SMOKE_BASE_URL ||
  'https://updatedtools.rajeshkhandare788.workers.dev'
).replace(/\/$/, '');

const LOCALES = [
  'en', 'pt', 'es', 'de', 'fr', 'it',
  'ja', 'ko', 'zh', 'ru', 'ar', 'hi',
];

const TOOL_SLUGS = [
  'merge-pdf','split-pdf','pdf-to-jpg','jpg-to-pdf','protect-pdf-password',
  'unlock-pdf-password','rotate-pdf','compress-pdf','add-page-numbers-pdf',
  'pdf-to-word','word-to-pdf','delete-pdf-pages','reorder-pdf-pages','pdf-grayscale-converter',
  'compress-image','crop-image-online','image-resizer','webp-to-png-converter',
  'webp-to-jpg-converter','png-to-jpg-converter','jpg-to-png-converter',
  'svg-to-png-converter','black-and-white-image-filter','invert-image-colors',
  'flip-rotate-image','instant-qr-code-generator','image-blur-filter',
  'image-color-palette-extractor','online-python-compiler',
  'online-javascript-compiler','online-html-editor','online-cpp-compiler',
  'online-java-compiler','online-csharp-compiler','online-php-runner',
  'online-sql-runner','json-formatter-validator','base64-encoder-decoder',
  'clean-url-slug-generator','html-entity-encoder','css-minifier-cleaner',
  'unix-timestamp-converter','hex-to-rgb-hsl-converter',
  'url-component-encoder-decoder','jwt-token-inspector','uuid-guid-v4-generator',
  'strong-password-generator','user-agent-string-parser','word-character-counter',
  'text-case-converter','remove-duplicate-lines','lorem-ipsum-generator',
  'markdown-to-html-converter','reverse-text-mirror-tool','text-diff-checker',
  'alphabetical-line-sorter','strip-html-tags','find-replace-text',
  'unit-length-converter','weight-mass-converter','temperature-converter',
  'data-size-converter','speed-velocity-converter','time-duration-converter',
  'area-land-converter','pressure-unit-converter','energy-work-converter',
  'power-wattage-converter','sip-wealth-calculator','emi-calculator',
  'lumpsum-calculator','gst-calculator','salary-calculator','fd-calculator',
  'rd-calculator','retirement-calculator','compound-interest-calculator',
  'simple-interest-calculator','percentage-calculator','age-calculator',
  'bmi-calculator','scientific-calculator','discount-calculator',
  'tip-calculator','youtube-thumbnail-downloader','youtube-tag-generator',
  'youtube-money-calculator',
];

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
  assert(TOOL_SLUGS.length === 87, `Expected 87 tools, found ${TOOL_SLUGS.length}`);

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
      const url = `${BASE_URL}/${locale}/tools/${slug}`;

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
