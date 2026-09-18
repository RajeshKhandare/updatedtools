'use client';

import React, { useState } from 'react';
import {
  PDFDocument,
  StandardFonts,
  rgb,
  degrees,
} from 'pdf-lib';
import JSZip from 'jszip';
import {
  Upload,
  Download,
  ArrowUp,
  ArrowDown,
  Trash2,
  Loader2,
  ShieldAlert,
} from 'lucide-react';

const card =
  'w-full max-w-5xl mx-auto rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 sm:p-8 space-y-5';

const input =
  'w-full rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 px-4 py-3 text-sm text-zinc-900 dark:text-white';

const MAX = 100 * 1024 * 1024;
const MAX_FILES = 20;

function save(
  bytes: Uint8Array,
  name: string,
  type: string
) {
  const blob = new Blob([bytes as any], {
    type,
  });

  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');

  a.href = url;
  a.download = name;
  a.click();

  setTimeout(() => {
    URL.revokeObjectURL(url);
  }, 1000);
}

async function renderPdf(
  file: File,
  scale = 1.5,
  gray = false
) {
  const pdfjs: any = await import(
    'pdfjs-dist/legacy/build/pdf.mjs'
  );

  pdfjs.GlobalWorkerOptions.workerSrc =
    '/pdf.worker.min.mjs';

  const data = new Uint8Array(
    await file.arrayBuffer()
  );

  const doc = await pdfjs.getDocument({
    data,
  }).promise;

  const pages: {
    blob: Blob;
    w: number;
    h: number;
  }[] = [];

  for (
    let i = 1;
    i <= doc.numPages;
    i++
  ) {
    const page = await doc.getPage(i);

    const viewport =
      page.getViewport({
        scale,
      });

    const canvas =
      document.createElement('canvas');

    canvas.width = Math.ceil(
      viewport.width
    );

    canvas.height = Math.ceil(
      viewport.height
    );

    const ctx =
      canvas.getContext('2d');

    if (!ctx) {
      throw new Error(
        'Browser canvas is unavailable.'
      );
    }

    if (gray) {
      ctx.filter = 'grayscale(1)';
    }

    await page.render({
      canvasContext: ctx,
      viewport,
    }).promise;

    const blob: Blob =
      await new Promise(
        (resolve, reject) => {
          canvas.toBlob(
            (value) => {
              if (value) {
                resolve(value);
              } else {
                reject(
                  new Error(
                    'Could not create JPG image.'
                  )
                );
              }
            },
            'image/jpeg',
            0.9
          );
        }
      );

    pages.push({
      blob,
      w: canvas.width,
      h: canvas.height,
    });
  }

  return pages;
}

async function pdfToDocx(file: File) {
  const pdfjs: any = await import(
    'pdfjs-dist/legacy/build/pdf.mjs'
  );

  pdfjs.GlobalWorkerOptions.workerSrc =
    '/pdf.worker.min.mjs';

  pdfjs.GlobalWorkerOptions.workerSrc =
    'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.10.38/pdf.worker.min.mjs';

  const data = new Uint8Array(
    await file.arrayBuffer()
  );

  const doc = await pdfjs.getDocument({
    data,
  }).promise;

  let body = '';

  for (
    let i = 1;
    i <= doc.numPages;
    i++
  ) {
    const page = await doc.getPage(i);

    const textContent =
      await page.getTextContent();

    const text = textContent.items
      .map((item: any) =>
        String(item.str || '')
      )
      .join(' ')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    body +=
      `<w:p><w:r><w:t xml:space="preserve">${text}</w:t></w:r></w:p>`;
  }

  const zip = new JSZip();

  zip.file(
    '[Content_Types].xml',
    '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
      '<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">' +
      '<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>' +
      '<Default Extension="xml" ContentType="application/xml"/>' +
      '<Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>' +
      '</Types>'
  );

  zip.file(
    '_rels/.rels',
    '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
      '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">' +
      '<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>' +
      '</Relationships>'
  );

  zip.file(
    'word/document.xml',
    '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
      '<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">' +
      `<w:body>${body}` +
      '<w:sectPr>' +
      '<w:pgSz w:w="12240" w:h="15840"/>' +
      '<w:pgMar w:top="1440" w:right="1440" w:bottom="1440" w:left="1440"/>' +
      '</w:sectPr>' +
      '</w:body>' +
      '</w:document>'
  );

  return zip.generateAsync({
    type: 'uint8array',
  });
}

async function docxToPdf(file: File) {
  const zip = await JSZip.loadAsync(
    await file.arrayBuffer()
  );

  const xml =
    await zip
      .file('word/document.xml')
      ?.async('string');

  if (!xml) {
    throw new Error(
      'Valid DOCX document.xml was not found.'
    );
  }

  const text = xml
    .replace(
      /<w:tab\s*\/?>/g,
      '\t'
    )
    .replace(
      /<w:br\s*\/?>/g,
      '\n'
    )
    .replace(
      /<\/w:p>/g,
      '\n'
    )
    .replace(
      /<[^>]+>/g,
      ''
    )
    .replace(
      /&amp;/g,
      '&'
    )
    .replace(
      /&lt;/g,
      '<'
    )
    .replace(
      /&gt;/g,
      '>'
    );

  const pdf =
    await PDFDocument.create();

  const font =
    await pdf.embedFont(
      StandardFonts.Helvetica
    );

  let page =
    pdf.addPage([612, 792]);

  let y = 750;

  const lines =
    text.split(/\r?\n/);

  for (const raw of lines) {
    const words =
      raw.split(/\s+/);

    let line = '';

    for (const word of words) {
      const test = line
        ? `${line} ${word}`
        : word;

      if (
        font.widthOfTextAtSize(
          test,
          11
        ) > 500
      ) {
        if (y < 50) {
          page =
            pdf.addPage([
              612,
              792,
            ]);

          y = 750;
        }

        page.drawText(
          line,
          {
            x: 55,
            y,
            size: 11,
            font,
          }
        );

        y -= 16;

        line = word;
      } else {
        line = test;
      }
    }

    if (y < 50) {
      page =
        pdf.addPage([
          612,
          792,
        ]);

      y = 750;
    }

    page.drawText(
      line,
      {
        x: 55,
        y,
        size: 11,
        font,
      }
    );

    y -= 16;
  }

  return pdf.save();
}

export default function PdfEngine({
  toolSlug,
  toolName,
}: {
  toolSlug: string;
  toolName: string;
}) {
  const [files, setFiles] =
    useState<File[]>([]);

  const [processing, setProcessing] =
    useState(false);

  const [error, setError] =
    useState('');

  const [pageSpec, setPageSpec] =
    useState('1');

  const [order, setOrder] =
    useState('');

  const [angle, setAngle] =
    useState('90');

  const [output, setOutput] =
    useState<Uint8Array | null>(null);

  const [input2, setInput2] =
    useState('');

  const add = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const incoming = [
      ...(e.target.files || []),
    ];

    const ok = incoming.filter(
      (file) =>
        file.type ===
          'application/pdf' ||
        (toolSlug === 'jpg-to-pdf' &&
          file.type.startsWith(
            'image/'
          )) ||
        (toolSlug === 'word-to-pdf' &&
          file.name
            .toLowerCase()
            .endsWith('.docx'))
    );

    if (
      ok.length + files.length >
      MAX_FILES
    ) {
      setError(
        `Maximum ${MAX_FILES} files.`
      );
      return;
    }

    const incomingSize =
      ok.reduce(
        (sum, file) =>
          sum + file.size,
        0
      );

    const existingSize =
      files.reduce(
        (sum, file) =>
          sum + file.size,
        0
      );

    if (
      incomingSize +
        existingSize >
      MAX
    ) {
      setError(
        'Selected files exceed the 100 MB browser-processing limit.'
      );
      return;
    }

    setFiles((previous) => [
      ...previous,
      ...ok,
    ]);

    setError('');
    setOutput(null);
  };

  const run = async () => {
    if (!files.length) {
      setError(
        'Select a file first.'
      );
      return;
    }

    setProcessing(true);
    setError('');
    setOutput(null);

    try {
      if (
        toolSlug === 'protect-pdf-password' ||
        toolSlug === 'unlock-pdf-password'
      ) {
        if (!input2) {
          throw new Error(
            toolSlug === 'protect-pdf-password'
              ? 'Enter a password.'
              : 'Enter the PDF password.'
          );
        }

        const { createPdfToolkit } =
          await import('pdfstudio');

        const toolkit =
          await createPdfToolkit({
            wasmUrl: '/qpdf.wasm',
          });

        const result =
          toolSlug === 'protect-pdf-password'
            ? await toolkit.lock(
                files[0],
                {
                  userPassword:
                    input2,
                  ownerPassword:
                    input2,
                  keyLength: 256,
                  permissions: {
                    print: 'full',
                    modify: 'none',
                    extract: false,
                    accessibility: true,
                  },
                }
              )
            : await toolkit.unlock(
                files[0],
                {
                  password: input2,
                }
              );

        setOutput(
          new Uint8Array(result)
        );

        return;
      }

      if (
        toolSlug === 'pdf-to-jpg' ||
        toolSlug ===
          'pdf-grayscale-converter'
      ) {
        const pages =
          await renderPdf(
            files[0],
            1.5,
            toolSlug ===
              'pdf-grayscale-converter'
          );

        if (
          toolSlug === 'pdf-to-jpg'
        ) {
          const zip =
            new JSZip();

          pages.forEach(
            (page, index) => {
              zip.file(
                `page-${index + 1}.jpg`,
                page.blob
              );
            }
          );

          const bytes =
            await zip.generateAsync({
              type: 'uint8array',
            });

          save(
            bytes,
            'pdf-pages-jpg.zip',
            'application/zip'
          );

          return;
        }

        const pdf =
          await PDFDocument.create();

        for (const item of pages) {
          const bytes =
            new Uint8Array(
              await item.blob.arrayBuffer()
            );

          const image =
            await pdf.embedJpg(
              bytes
            );

          const page =
            pdf.addPage([
              image.width,
              image.height,
            ]);

          page.drawImage(
            image,
            {
              x: 0,
              y: 0,
              width: image.width,
              height: image.height,
            }
          );
        }

        setOutput(
          await pdf.save()
        );

        return;
      }

      if (
        toolSlug === 'pdf-to-word'
      ) {
        setOutput(
          await pdfToDocx(
            files[0]
          )
        );

        return;
      }

      if (
        toolSlug === 'word-to-pdf'
      ) {
        setOutput(
          await docxToPdf(
            files[0]
          )
        );

        return;
      }

      if (
        toolSlug === 'jpg-to-pdf'
      ) {
        const pdf =
          await PDFDocument.create();

        for (const file of files) {
          const bytes =
            new Uint8Array(
              await file.arrayBuffer()
            );

          let image;

          if (
            file.type ===
            'image/png'
          ) {
            image =
              await pdf.embedPng(
                bytes
              );
          } else {
            image =
              await pdf.embedJpg(
                bytes
              );
          }

          const page =
            pdf.addPage([
              image.width,
              image.height,
            ]);

          page.drawImage(
            image,
            {
              x: 0,
              y: 0,
              width: image.width,
              height: image.height,
            }
          );
        }

        setOutput(
          await pdf.save()
        );

        return;
      }

      const pdf =
        await PDFDocument.load(
          await files[0].arrayBuffer()
        );

      const count =
        pdf.getPageCount();

      const parsePages = (
        spec: string
      ) => {
        const result: number[] =
          [];

        for (const part of spec
          .split(',')
          .map((item) =>
            item.trim()
          )
          .filter(Boolean)) {
          if (
            /^\d+$/.test(part)
          ) {
            const page =
              Number(part) - 1;

            if (
              page < 0 ||
              page >= count
            ) {
              throw new Error(
                `Page ${
                  page + 1
                } is outside the PDF.`
              );
            }

            result.push(page);
          } else if (
            /^(\d+)-(\d+)$/.test(
              part
            )
          ) {
            const match =
              part.match(
                /^(\d+)-(\d+)$/
              );

            if (!match) {
              throw new Error(
                'Invalid page range.'
              );
            }

            const start =
              Number(match[1]);

            const end =
              Number(match[2]);

            if (
              start < 1 ||
              end > count ||
              start > end
            ) {
              throw new Error(
                'Invalid page range.'
              );
            }

            for (
              let page = start;
              page <= end;
              page++
            ) {
              result.push(
                page - 1
              );
            }
          } else {
            throw new Error(
              'Use page numbers like 1,3-5.'
            );
          }
        }

        return Array.from(
          new Set(result)
        );
      };

      if (
        toolSlug === 'split-pdf' ||
        toolSlug ===
          'delete-pdf-pages' ||
        toolSlug ===
          'reorder-pdf-pages'
      ) {
        const indices =
          toolSlug ===
          'reorder-pdf-pages'
            ? parsePages(
                order ||
                  pageSpec
              )
            : toolSlug ===
                'delete-pdf-pages'
              ? pdf
                  .getPageIndices()
                  .filter(
                    (index) =>
                      !parsePages(
                        pageSpec
                      ).includes(
                        index
                      )
                  )
              : parsePages(
                  pageSpec
                );

        if (
          toolSlug ===
            'reorder-pdf-pages' &&
          indices.length !==
            count
        ) {
          throw new Error(
            'Reorder requires every page exactly once.'
          );
        }

        const outPdf =
          await PDFDocument.create();

        const pages =
          await outPdf.copyPages(
            pdf,
            indices
          );

        pages.forEach((page) =>
          outPdf.addPage(page)
        );

        setOutput(
          await outPdf.save()
        );

        return;
      }

      if (
        toolSlug ===
        'rotate-pdf'
      ) {
        const pages =
          pageSpec
            .trim()
            .toLowerCase() ===
          'all'
            ? pdf.getPageIndices()
            : parsePages(
                pageSpec
              );

        const rotation =
          Number(angle) || 90;

        pages.forEach(
          (index) => {
            pdf
              .getPage(index)
              .setRotation(
                degrees(rotation)
              );
          }
        );

        setOutput(
          await pdf.save()
        );

        return;
      }

      if (
        toolSlug ===
        'add-page-numbers-pdf'
      ) {
        const font =
          await pdf.embedFont(
            StandardFonts.Helvetica
          );

        pdf
          .getPages()
          .forEach(
            (page, index) => {
              const text =
                `${index + 1} / ${count}`;

              page.drawText(
                text,
                {
                  x:
                    page.getWidth() /
                      2 -
                    20,
                  y: 20,
                  size: 9,
                  font,
                  color: rgb(
                    0.3,
                    0.3,
                    0.3
                  ),
                }
              );
            }
          );

        setOutput(
          await pdf.save()
        );

        return;
      }

      if (
        toolSlug ===
        'compress-pdf'
      ) {
        setOutput(
          await pdf.save({
            useObjectStreams:
              true,
            addDefaultPage:
              false,
          })
        );

        return;
      }

      if (
        toolSlug === 'merge-pdf'
      ) {
        if (files.length < 2) {
          throw new Error(
            'Select at least two PDF files to merge.'
          );
        }

        const merged =
          await PDFDocument.create();

        for (
          const file of files
        ) {
          const source =
            await PDFDocument.load(
              await file.arrayBuffer()
            );

          const pages =
            await merged.copyPages(
              source,
              source.getPageIndices()
            );

          pages.forEach(
            (page) =>
              merged.addPage(page)
          );
        }

        setOutput(
          await merged.save({
            useObjectStreams: true,
          })
        );

        return;
      }
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : 'PDF processing failed.'
      );
    } finally {
      setProcessing(false);
    }
  };

  const move = (
    index: number,
    direction: number
  ) => {
    const updated = [
      ...files,
    ];

    const target =
      index + direction;

    if (
      target < 0 ||
      target >= updated.length
    ) {
      return;
    }

    [
      updated[index],
      updated[target],
    ] = [
      updated[target],
      updated[index],
    ];

    setFiles(updated);
  };

  return (
    <div className={card}>
      <h3 className="text-lg font-bold">
        {toolName}
      </h3>

      <input
        type="file"
        multiple={
          toolSlug === 'merge-pdf' ||
          toolSlug === 'jpg-to-pdf'
        }
        accept={
          toolSlug === 'jpg-to-pdf'
            ? 'image/jpeg,image/png'
            : toolSlug ===
                'word-to-pdf'
              ? '.docx'
              : '.pdf'
        }
        onChange={add}
      />

      {error && (
        <div className="flex gap-2 text-sm text-rose-500">
          <ShieldAlert className="h-4 w-4" />
          {error}
        </div>
      )}

      <div className="space-y-2">
        {files.map(
          (file, index) => (
            <div
              key={`${file.name}-${index}`}
              className="flex items-center justify-between rounded-xl border p-3 text-xs"
            >
              <span className="truncate">
                {file.name}
              </span>

              <div className="flex gap-1">
                <button
                  className="border rounded p-1"
                  onClick={() =>
                    move(index, -1)
                  }
                >
                  <ArrowUp className="h-3 w-3" />
                </button>

                <button
                  className="border rounded p-1"
                  onClick={() =>
                    move(index, 1)
                  }
                >
                  <ArrowDown className="h-3 w-3" />
                </button>

                <button
                  className="border rounded p-1"
                  onClick={() =>
                    setFiles(
                      files.filter(
                        (_, i) =>
                          i !== index
                      )
                    )
                  }
                >
                  <Trash2 className="h-3 w-3" />
                </button>
              </div>
            </div>
          )
        )}
      </div>

      {[
        'split-pdf',
        'delete-pdf-pages',
        'rotate-pdf',
      ].includes(toolSlug) && (
        <input
          className={input}
          value={pageSpec}
          onChange={(e) =>
            setPageSpec(
              e.target.value
            )
          }
          placeholder="Pages: 1,3-5 (rotate can use all)"
        />
      )}

      {toolSlug ===
        'reorder-pdf-pages' && (
        <input
          className={input}
          value={order}
          onChange={(e) =>
            setOrder(
              e.target.value
            )
          }
          placeholder="Complete order, e.g. 3,1,2"
        />
      )}

      {toolSlug ===
        'rotate-pdf' && (
        <input
          className={input}
          value={angle}
          onChange={(e) =>
            setAngle(
              e.target.value
            )
          }
          placeholder="Rotation: 90, 180, 270"
        />
      )}

      {[
        'protect-pdf-password',
        'unlock-pdf-password',
      ].includes(toolSlug) && (
        <input
          className={input}
          type="password"
          value={input2}
          onChange={(e) =>
            setInput2(
              e.target.value
            )
          }
          placeholder={
            toolSlug ===
            'protect-pdf-password'
              ? 'Password to protect PDF'
              : 'Password to unlock PDF'
          }
        />
      )}

      <button
        className="rounded-xl bg-violet-600 px-5 py-3 text-xs font-bold text-white disabled:opacity-50"
        disabled={processing}
        onClick={run}
      >
        {processing ? (
          <>
            <Loader2 className="inline h-4 w-4 animate-spin" />
            {' '}
            Processing...
          </>
        ) : (
          `Run ${toolName}`
        )}
      </button>

      {output && (
        <button
          className="ml-2 rounded-xl border px-4 py-3 text-xs font-bold"
          onClick={() =>
            save(
              output,
              `${toolSlug}.${
                toolSlug ===
                'pdf-to-word'
                  ? 'docx'
                  : 'pdf'
              }`,
              toolSlug ===
                'pdf-to-word'
                ? 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
                : 'application/pdf'
            )
          }
        >
          <Download className="inline h-4 w-4" />
          {' '}
          Download
        </button>
      )}
    </div>
  );
}
