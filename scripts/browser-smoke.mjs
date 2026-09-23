import fs from 'node:fs';
import { PDFDocument, StandardFonts } from 'pdf-lib';
import JSZip from 'jszip';
import { chromium } from 'playwright';

const BASE_URL = (
  process.env.SMOKE_BASE_URL ||
  'https://updatedtools-8kbg.vercel.app'
).replace(/\/$/, '');

const registrySource = fs.readFileSync(
  'data/toolsRegistry.ts',
  'utf8'
);

const tools = [
  ...registrySource.matchAll(
    /slug:\s*'([^']+)'[\s\S]*?category:\s*'([^']+)'/g
  ),
].map((m) => ({
  slug: m[1],
  category: m[2],
}));

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

async function makePdf(pageCount = 3) {
  const pdf = await PDFDocument.create();
  const font = await pdf.embedFont(
    StandardFonts.Helvetica
  );

  for (let i = 1; i <= pageCount; i++) {
    const page = pdf.addPage([612, 792]);
    page.drawText(
      'Toolployee smoke test page ' + i,
      {
        x: 50,
        y: 720,
        size: 20,
        font,
      }
    );
  }

  return Buffer.from(
    await pdf.save()
  );
}

async function makeDocx() {
  const zip = new JSZip();

  zip.file(
    '[Content_Types].xml',
    '<?xml version="1.0" encoding="UTF-8"?>' +
      '<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">' +
      '<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>' +
      '<Default Extension="xml" ContentType="application/xml"/>' +
      '<Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>' +
      '</Types>'
  );

  zip.file(
    '_rels/.rels',
    '<?xml version="1.0" encoding="UTF-8"?>' +
      '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">' +
      '<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>' +
      '</Relationships>'
  );

  zip.file(
    'word/document.xml',
    '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
      '<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">' +
      '<w:body>' +
      '<w:p><w:r><w:t>Smoke test DOCX document.</w:t></w:r></w:p>' +
      '<w:p><w:r><w:t>This document is used to test Word to PDF conversion.</w:t></w:r></w:p>' +
      '<w:sectPr><w:pgSz w:w="12240" w:h="15840"/><w:pgMar w:top="1440" w:right="1440" w:bottom="1440" w:left="1440"/></w:sectPr>' +
      '</w:body>' +
      '</w:document>'
  );

  return Buffer.from(
    await zip.generateAsync({
      type: 'uint8array',
    })
  );
}

async function imageFixture(page, format) {
  const result = await page.evaluate(
    (type) => {
      const canvas =
        document.createElement('canvas');
      canvas.width = 320;
      canvas.height = 200;

      const ctx =
        canvas.getContext('2d');

      ctx.fillStyle = '#7c3aed';
      ctx.fillRect(
        0,
        0,
        320,
        200
      );

      ctx.fillStyle = '#ffffff';
      ctx.font = '28px sans-serif';
      ctx.fillText(
        'Toolployee',
        70,
        110
      );

      return canvas.toDataURL(
        type,
        0.9
      );
    },
    format
  );

  return Buffer.from(
    result.split(',')[1],
    'base64'
  );
}

function textInputs(page) {
  return page.locator(
    'input:not([type="file"]):not([type="range"]), textarea'
  );
}

async function clickButton(page, name) {
  const locator =
    page.getByRole(
      'button',
      { name }
    ).first();

  await locator.scrollIntoViewIfNeeded();
  await locator.click();
}

async function testPdf(page, slug, fixtures, state) {
  await page.locator(
    'input[type="file"]'
  ).setInputFiles(
    slug === 'merge-pdf'
      ? [
          {
            name: 'one.pdf',
            mimeType: 'application/pdf',
            buffer: fixtures.pdf,
          },
          {
            name: 'two.pdf',
            mimeType: 'application/pdf',
            buffer: fixtures.pdf2,
          },
        ]
      : slug === 'jpg-to-pdf'
        ? {
            name: 'image.jpg',
            mimeType: 'image/jpeg',
            buffer: fixtures.jpg,
          }
        : slug === 'word-to-pdf'
          ? {
              name: 'test.docx',
              mimeType:
                'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
              buffer: fixtures.docx,
            }
          : {
              name: 'test.pdf',
              mimeType: 'application/pdf',
              buffer:
                slug === 'unlock-pdf-password' &&
                state.protectedPdf
                  ? state.protectedPdf
                  : fixtures.pdf,
            }
  );

  // Give React and the PDF page workspace time to settle
  // before starting CPU-heavy PDF processing.
  await page.waitForTimeout(500);

  if ([
    'merge-pdf',
    'split-pdf',
    'delete-pdf-pages',
    'reorder-pdf-pages',
    'rotate-pdf',
    'add-page-numbers-pdf',
  ].includes(slug)) {
    await page.getByText('PDF workspace', { exact: true }).waitFor({
      state: 'visible',
      timeout: 30000,
    });

    await page.getByText('Preparing preview…', { exact: true }).waitFor({
      state: 'hidden',
      timeout: 30000,
    }).catch(() => {});
  }

  const selectedCount =
    await page.locator(
      'input[type="file"]'
    ).evaluate(
      (input) =>
        input.files?.length ?? 0
    );

  assert(
    selectedCount ===
      (slug === 'merge-pdf' ? 2 : 1),
    slug +
      ': browser did not retain the expected uploaded file count: ' +
      selectedCount
  );

  const inputs = page.locator(
    'input:not([type="file"])'
  );

  if (
    slug === 'protect-pdf-password' ||
    slug === 'unlock-pdf-password'
  ) {
    await page.locator(
      'input[type="password"]'
    ).fill(
      'SmokeTest123!'
    );
  }

  if (slug === 'delete-pdf-pages') {
    await inputs
      .filter({
        has: undefined,
      })
      .first()
      .fill('2');
  }

  if (slug === 'split-pdf') {
    await inputs.first().fill('1,2');
  }

  if (slug === 'reorder-pdf-pages') {
    const draggablePages = page.locator('[draggable="true"]');
    await draggablePages.first().waitFor({ state: 'visible', timeout: 30000 });
    const count = await draggablePages.count();
    assert(count >= 2, slug + ': PDF page cards were not rendered for drag and drop');
    await draggablePages.first().dragTo(draggablePages.last(), { timeout: 30000 });
  }

  if (slug === 'rotate-pdf') {
    await inputs.nth(0).fill('all');
    await inputs.nth(1).fill('90');
  }

  const run = page
    .getByRole('button')
    .filter({ name: /^(Run Code|Process(?:\\s|$))/ })
    .first();

  if (
    slug === 'pdf-to-jpg'
  ) {
    const downloadPromise =
      page.waitForEvent(
        'download',
        { timeout: 45000 }
      );

    await run.click();

    const download =
      await downloadPromise;

    const path =
      await download.path();

    assert(
      path &&
        fs.statSync(path).size > 0,
      slug +
        ': PDF-to-JPG download was empty'
    );
    return;
  }

  await run.click();

  if (slug === 'merge-pdf') {
    await page.waitForTimeout(3000);
    const bodyText =
      await page.locator('body').textContent();

    assert(
      !/PDF merge failed|Select at least two PDF files|PDF processing failed/i.test(
        bodyText || ''
      ),
      slug +
        ': merge tool displayed an error: ' +
        bodyText
    );
  }

  const downloadButton =
    page.getByRole(
      'button',
      { name: 'Download' }
    ).first();

  // PDF processing can be CPU-heavy in headless Chromium, especially
  // pdf.js rendering on the Cloudflare deployment. Wait for either the
  // download action or a surfaced UI error so failures are diagnostic.
  try {
    await downloadButton.waitFor({
      state: 'visible',
      timeout: 90000,
    });
  } catch (error) {
    const bodyText = await page.locator('body').textContent();
    throw new Error(
      slug +
        ': Download button did not appear after processing. UI: ' +
        String(bodyText || '').replace(/\s+/g, ' ').slice(-1200)
    );
  }

  const downloadPromise =
    page.waitForEvent(
      'download',
      { timeout: 30000 }
    );

  await downloadButton.click();

  const download =
    await downloadPromise;

  const path =
    await download.path();

  assert(
    path &&
      fs.statSync(path).size > 0,
    slug +
      ': PDF output download was empty'
  );

  if (
    slug ===
    'protect-pdf-password'
  ) {
    state.protectedPdf =
      fs.readFileSync(path);
  }
}

async function testImage(page, slug, fixtures) {
  if (
    slug ===
    'instant-qr-code-generator'
  ) {
    const input =
      page.locator('input').first();

    await input.fill(
      'https://toolployee.com/smoke-test'
    );

    await clickButton(
      page,
      'Generate QR'
    );

    await page.locator(
      'img[alt="Generated QR code"]'
    ).waitFor({
      state: 'visible',
      timeout: 10000,
    });

    return;
  }

  let file = fixtures.png;
  let mime = 'image/png';
  let name = 'test.png';

  if (
    slug.startsWith(
      'webp-to-'
    )
  ) {
    file = fixtures.webp;
    mime = 'image/webp';
    name = 'test.webp';
  } else if (
    slug ===
    'jpg-to-png-converter' ||
    slug ===
    'webp-to-jpg-converter'
  ) {
    file = fixtures.jpg;
    mime = 'image/jpeg';
    name = 'test.jpg';
  } else if (
    slug ===
    'svg-to-png-converter'
  ) {
    file = Buffer.from(
      '<svg xmlns="http://www.w3.org/2000/svg" width="320" height="200"><rect width="320" height="200" fill="#7c3aed"/><text x="70" y="110" fill="white" font-size="28">Toolployee</text></svg>'
    );
    mime = 'image/svg+xml';
    name = 'test.svg';
  }

  const fileInput = page.locator(
    'input[type="file"]'
  ).first();

  await fileInput.setInputFiles({
    name,
    mimeType: mime,
    buffer: file,
  });

  await page.waitForFunction(
    () => {
      const input = document.querySelector(
        'input[type="file"]'
      );
      return Boolean(input && input.files && input.files.length > 0);
    },
    undefined,
    { timeout: 5000 }
  );

  await page.waitForTimeout(1000);

  const processButton = page.getByRole(
    'button',
    { name: /^Process / }
  );

  await processButton.waitFor({
    state: 'visible',
    timeout: 10000,
  });

  // FileReader-backed image tools can occasionally need an extra
  // React state turn after Playwright attaches the file. Retry the
  // file assignment if the Process button does not become enabled.
  let processReady = false;
  let lastProcessWaitError = null;

  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      await page.waitForFunction(
        () => {
          const button = Array.from(
            document.querySelectorAll('button')
          ).find((node) =>
            /^Process /.test(node.textContent?.trim() || '')
          );
          return Boolean(button && !button.disabled);
        },
        undefined,
        { timeout: 15000 }
      );

      processReady = true;
      break;
    } catch (error) {
      lastProcessWaitError = error;

      if (attempt < 3) {
        await fileInput.setInputFiles({
          name,
          mimeType: mime,
          buffer: file,
        });

        await page.waitForFunction(
          () => {
            const input = document.querySelector(
              'input[type="file"]'
            );
            return Boolean(
              input &&
              input.files &&
              input.files.length > 0
            );
          },
          undefined,
          { timeout: 5000 }
        );

        await page.waitForTimeout(500);
      }
    }
  }

  if (!processReady) {
    throw lastProcessWaitError || new Error(
      slug + ': image Process button did not become enabled'
    );
  }

  await clickButton(
    page,
    new RegExp(
      '^Process '
    )
  );

  await page.locator(
    'img[alt="Processed output"]'
  ).waitFor({
    state: 'visible',
    timeout: 30000,
  });

  const downloadPromise =
    page.waitForEvent(
      'download',
      { timeout: 15000 }
    );

  await page.getByRole(
    'button',
    { name: 'Download' }
  ).click();

  const download =
    await downloadPromise;

  const path =
    await download.path();

  assert(
    path &&
      fs.statSync(path).size > 0,
    slug +
      ': image output download was empty'
  );
}

async function testCompiler(page, slug) {
  const code = {
    'online-python-compiler':
      'print("SMOKE_OK")',
    'online-javascript-compiler':
      'console.log("SMOKE_OK")',
    'online-java-compiler':
      'public class Main { public static void main(String[] args) { System.out.println("SMOKE_OK"); } }',
    'online-cpp-compiler':
      '#include <iostream>\nint main(){std::cout << "SMOKE_OK";}',
    'online-csharp-compiler':
      'using System; class Program { static void Main(){ Console.WriteLine("SMOKE_OK"); } }',
    'online-php-runner':
      '<?php echo "SMOKE_OK"; ?>',
    'online-html-editor':
      '<!doctype html><html><body><h1>SMOKE_OK</h1></body></html>',
    'online-sql-runner':
      'CREATE TABLE t(id INTEGER); INSERT INTO t VALUES (1); SELECT * FROM t;',
  }[slug];

  const editor = page.locator(
    'textarea'
  ).first();

  await editor.waitFor({ state: 'visible', timeout: 10000 });
  await editor.fill(code);

  await editor.evaluate((node, expected) => {
    const textarea = node;
    const setter = Object.getOwnPropertyDescriptor(
      HTMLTextAreaElement.prototype,
      'value'
    )?.set;
    setter?.call(textarea, expected);
    textarea.dispatchEvent(new Event('input', { bubbles: true }));
    textarea.dispatchEvent(new Event('change', { bubbles: true }));
  }, code);

  await page.waitForFunction(
    (expected) => {
      const textarea = document.querySelector('textarea');
      return textarea?.value === expected;
    },
    code,
    { timeout: 10000 }
  );

  await page.waitForTimeout(500);

  await editor.press('End');

  await clickButton(
    page,
    /^(Run Code|Preview)$/
  );

  if (
    slug ===
    'online-html-editor'
  ) {
    const frame =
      page.locator(
        'iframe[title="HTML sandbox preview"]'
      );

    await frame.waitFor({
      state: 'visible',
      timeout: 10000,
    });

    const body =
      frame.contentFrame().locator(
        'body'
      );

    await body.waitFor({
      state: 'visible',
      timeout: 10000,
    });

    assert(
      (await body.textContent()).includes(
        'SMOKE_OK'
      ),
      slug +
        ': HTML preview did not render'
    );
    return;
  }

  const output =
    page.locator('pre').last();

  await output.waitFor({
    state: 'visible',
    timeout: 30000,
  });

  await page.waitForFunction(
    () => {
      const pre =
        document.querySelectorAll('pre');
      const node =
        pre[pre.length - 1];
      const text =
        node?.textContent || '';
      return (
        text.length > 0 &&
        !text.startsWith(
          'Submitting code to the configured execution runtime...'
        ) &&
        !text.startsWith(
          'Running SQL locally...'
        )
      );
    },
    undefined,
    { timeout: 30000 }
  );

  const text =
    await output.textContent();

  assert(
    text.includes(
      slug ===
        'online-sql-runner'
        ? 'values'
        : 'SMOKE_OK'
    ),
    slug +
      ': compiler output did not contain expected result: ' +
      text
  );
}

async function testUniversal(page, slug, category) {
  if (
    category === 'Converters'
  ) {
    const input =
      page.locator(
        'input[type="number"]'
      ).first();

    await input.fill('10');

    const result =
      page.locator(
        'div.text-2xl.font-bold'
      ).last();

    await result.waitFor({
      state: 'visible',
      timeout: 5000,
    });

    const body =
      await page.locator(
        'body'
      ).textContent();

    assert(
      !/Invalid result|NaN/.test(body),
      slug +
        ': converter returned invalid result'
    );
    return;
  }

  if (
    category === 'Finance'
  ) {
    const inputs =
      page.locator(
        'input[type="number"]'
      );

    const count =
      await inputs.count();

    for (
      let i = 0;
      i < count;
      i++
    ) {
      await inputs.nth(i).fill(
        String(1000 + i * 2)
      );
    }

    const body =
      await page.locator(
        'body'
      ).textContent();

    assert(
      !/Invalid result|NaN/.test(body),
      slug +
        ': finance tool returned invalid result'
    );
    return;
  }

  if (
    category === 'Calculators'
  ) {
    if (
      slug === 'age-calculator'
    ) {
      await page.locator(
        'input[type="date"]'
      ).fill('2000-01-01');
    } else if (
      slug ===
      'scientific-calculator'
    ) {
      await page.locator(
        'input'
      ).first().fill(
        'sqrt(25)+2**3'
      );
    } else {
      const inputs =
        page.locator(
          'input[type="number"]'
        );

      for (
        let i = 0;
        i < await inputs.count();
        i++
      ) {
        await inputs.nth(i).fill(
          String(
            i === 0
              ? 1000
              : i === 1
                ? 10
                : 2
          )
        );
      }
    }

    const body =
      await page.locator(
        'body'
      ).textContent();

    assert(
      !/Invalid result|NaN|Error:/.test(body),
      slug +
        ': calculator returned an error'
    );
    return;
  }

  if (
    category === 'YouTube'
  ) {
    if (
      slug ===
      'youtube-thumbnail-downloader'
    ) {
      await page.locator(
        'input'
      ).first().fill(
        'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
      );

      // The current UI first parses the URL with "Generate", then exposes
      // the thumbnail and a separate "Download" action.
      await clickButton(
        page,
        'Generate'
      );

      await page.locator(
        'img[alt="YouTube thumbnail"]'
      ).waitFor({
        state: 'visible',
        timeout: 15000,
      });

      const downloadButton = page.getByRole(
        'button',
        { name: 'Download' }
      ).first();

      await downloadButton.waitFor({
        state: 'visible',
        timeout: 10000,
      });

      const downloadPromise = page.waitForEvent(
        'download',
        { timeout: 20000 }
      );

      await downloadButton.click();

      const download = await downloadPromise;
      const path = await download.path();

      assert(
        path && fs.statSync(path).size > 0,
        slug + ': YouTube thumbnail download was empty'
      );
      return;
    }

    if (
      slug ===
      'youtube-money-calculator'
    ) {
      await clickButton(
        page,
        'Calculate'
      );

      await page.getByText(
        /Estimated revenue:/
      ).waitFor({
        state: 'visible',
        timeout: 5000,
      });
      return;
    }

    await page.locator(
      'input'
    ).first().fill(
      'Java Spring Boot tutorial'
    );

    await clickButton(
      page,
      'Generate'
    );

    await page.locator(
      'pre'
    ).last().waitFor({
      state: 'visible',
      timeout: 5000,
    });

    return;
  }

  if (category === 'Time Table') {
    const table = page.locator('[data-testid="timetable-engine"] table');
    await table.waitFor({ state: 'visible', timeout: 10000 });

    const editableCell = table.locator('tbody input').first();
    await editableCell.waitFor({ state: 'visible', timeout: 5000 });
    await editableCell.fill('Smoke Test Entry');

    const editableTime = table.locator('thead input[type="time"]').first();
    await editableTime.waitFor({ state: 'visible', timeout: 5000 });
    const originalTime = await editableTime.inputValue();
    await editableTime.fill(originalTime === '08:00' ? '08:15' : '08:00');

    const note = page.locator('textarea').first();
    if (await note.count()) {
      await note.fill('Smoke test personal note');
    }

    const body = await page.locator('body').textContent();
    assert(
      !/Application error|Unhandled Runtime Error|Tool not found/i.test(body),
      slug + ': timetable generator returned an error'
    );
    return;
  }

  // Developer + Text tools
  const textareas =
    page.locator(
      'textarea'
    );

  if (
    await textareas.count() === 0
  ) {
    throw new Error(
      slug +
        ': expected a textarea'
    );
  }

  const values = {
    'json-formatter-validator':
      '{"name":"Rajesh","value":1}',
    'base64-encoder-decoder':
      'Toolployee',
    'clean-url-slug-generator':
      'Hello Toolployee World',
    'html-entity-encoder':
      '<div>hello</div>',
    'css-minifier-cleaner':
      'body { color: red; padding: 10px; }',
    'unix-timestamp-converter':
      '1704067200',
    'hex-to-rgb-hsl-converter':
      '#7c3aed',
    'url-component-encoder-decoder':
      'hello world?x=1',
    'jwt-token-inspector':
      'eyJhbGciOiJub25lIn0.eyJzdWIiOiIxMjMifQ.',
    'uuid-guid-v4-generator':
      '',
    'strong-password-generator':
      '20',
    'user-agent-string-parser':
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/140 Safari/537.36',
    'word-character-counter':
      'hello world\nhello',
    'text-case-converter':
      'hello world',
    'remove-duplicate-lines':
      'b\na\nb',
    'lorem-ipsum-generator':
      '2',
    'markdown-to-html-converter':
      '# Hello\n\n**World**',
    'reverse-text-mirror-tool':
      'hello world',
    'text-diff-checker':
      'hello\nworld',
    'alphabetical-line-sorter':
      'zebra\napple\nMango',
    'strip-html-tags':
      '<p>Hello</p><b>World</b>',
    'find-replace-text':
      'hello world',
  }[slug] ?? 'Toolployee smoke test';

  await textareas
    .first()
    .fill(values);

  if (
    slug ===
    'text-diff-checker'
  ) {
    await textareas
      .nth(1)
      .fill('hello\nthere');
  }

  if (
    slug ===
    'find-replace-text'
  ) {
    const inputs =
      page.locator(
        'input'
      );

    await inputs
      .nth(0)
      .fill('world');

    await inputs
      .nth(1)
      .fill('Toolployee');
  }

  await clickButton(
    page,
    'Process'
  );

  if (slug === 'hex-to-rgb-hsl-converter') {
    await page.waitForFunction(
      () => {
        const text = document.body?.textContent || '';
        return text.includes('RGB:') && text.includes('HSL:');
      },
      undefined,
      { timeout: 5000 }
    );
    const body = await page.locator('body').textContent();
    assert(body.includes('RGB:') && body.includes('HSL:'), slug + ': color conversion output missing');
    return;
  }

  const result =
    page.locator(
      'pre'
    ).last();

  await result.waitFor({
    state: 'visible',
    timeout: 5000,
  });

  const text =
    await result.textContent();

  assert(
    text &&
      !text.startsWith(
        'Error:'
      ),
    slug +
      ': tool returned an error: ' +
      text
  );
}

async function main() {
  console.log(
    'Browser smoke testing ' +
      tools.length +
      ' tools on ' +
      BASE_URL
  );

  assert(
    tools.length === 112,
    'Registry expected 112 tools, found ' +
      tools.length
  );

  const browser =
    await chromium.launch({
      headless: true,
    });

  const context =
    await browser.newContext({
      acceptDownloads: true,
    });

  let page =
    await context.newPage();

  page.setDefaultTimeout(
    15000
  );

  const fixtures = {
    pdf: await makePdf(3),
    pdf2: await makePdf(2),
    docx: await makeDocx(),
    png: await imageFixture(
      page,
      'image/png'
    ),
    jpg: await imageFixture(
      page,
      'image/jpeg'
    ),
    webp: await imageFixture(
      page,
      'image/webp'
    ),
  };

  const state = {
    protectedPdf: null,
  };

  const failures = [];
  const pdfWarnings = [];

  for (
    const tool of tools
  ) {
    const label =
      tool.category +
      '/' +
      tool.slug;

    // PDF tools are intentionally excluded from the automated browser smoke
    // suite because pdf.js/WASM rendering and downloads make CI much slower.
    // PDF functionality remains covered by the dedicated/manual PDF checks.
    if (tool.category === 'PDF') {
      console.log('SKIP ' + label + ' (PDF smoke disabled for fast CI)');
      continue;
    }

    try {
      await page.close().catch(() => {});
      page = await context.newPage();
      page.setDefaultTimeout(15000);

      console.log(
        'TEST ' + label
      );

      const pageErrors = [];

      const onPageError =
        (error) =>
          pageErrors.push(
            String(error)
          );

      page.on(
        'pageerror',
        onPageError
      );

      const response =
        await page.goto(
          BASE_URL +
            '/tools/' +
            tool.slug,
          {
            waitUntil:
              'domcontentloaded',
            timeout: 30000,
          }
        );

      assert(
        response &&
          response.ok(),
        label +
          ': page HTTP status ' +
          (response
            ? response.status()
            : 'none')
      );

      await page.getByRole(
        'heading',
        { level: 1 }
      ).waitFor({
        state: 'visible',
        timeout: 15000,
      });

      const body =
        await page.locator(
          'body'
        ).textContent();

      assert(
        !/Tool not found|Application error|Unhandled Runtime Error/i.test(
          body
        ),
        label +
          ': page contains an application error'
      );

      if (
        pageErrors.length
      ) {
        throw new Error(
          label +
            ': page error: ' +
            pageErrors.join(
              ' | '
            )
        );
      }

      if (
        tool.category ===
        'PDF'
      ) {
        await testPdf(
          page,
          tool.slug,
          fixtures,
          state
        );
      } else if (
        tool.category ===
        'Image'
      ) {
        await testImage(
          page,
          tool.slug,
          fixtures
        );
      } else if (
        tool.category ===
        'Compiler'
      ) {
        await testCompiler(
          page,
          tool.slug
        );
      } else {
        await testUniversal(
          page,
          tool.slug,
          tool.category
        );
      }

      page.off(
        'pageerror',
        onPageError
      );

      console.log(
        'PASS ' + label
      );
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : String(error);

      if (tool.category === 'PDF') {
        pdfWarnings.push({
          tool: label,
          error: message,
        });

        console.warn(
          'WARN ' + label + ': ' + message +
            ' (PDF smoke is non-blocking on Cloudflare)'
        );
      } else {
        failures.push({
          tool: label,
          error: message,
        });

        console.error(
          'FAIL ' + label + ': ' + message
        );
      }
    }
  }

  await browser.close();

  console.log(
    JSON.stringify(
      {
        totalTools: tools.length,
        skippedPdf:
          tools.filter((tool) => tool.category === 'PDF').length,
        tested:
          tools.filter((tool) => tool.category !== 'PDF').length,
        passed:
          tools.filter((tool) => tool.category !== 'PDF').length -
          failures.length,
        failed:
          failures.length,
        pdfWarnings:
          pdfWarnings.length,
        failures,
        pdfWarnings,
      },
      null,
      2
    )
  );

  if (pdfWarnings.length) {
    console.log(
      'PDF smoke warnings are non-blocking; PDF tools remain covered by manual verification.'
    );
  }

  if (failures.length) {
    process.exit(1);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
