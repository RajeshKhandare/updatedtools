'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { ArrowDown, ArrowUp, Check, Loader2 } from 'lucide-react';

type PageItem = {
  fileIndex: number;
  pageIndex: number;
  label: string;
  src: string;
};

type Props = {
  files: File[];
  mode: 'merge' | 'split' | 'delete' | 'reorder' | 'rotate' | 'page-numbers';
  selectedPages: number[];
  onSelectedPagesChange: (pages: number[]) => void;
  onReorderChange: (pages: number[]) => void;
};

const PREVIEW_LIMIT = 60;

export default function PdfPageWorkspace({
  files,
  mode,
  selectedPages,
  onSelectedPagesChange,
  onReorderChange,
}: Props) {
  const [pages, setPages] = useState<PageItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [notice, setNotice] = useState('');
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;
    const urls: string[] = [];

    const load = async () => {
      if (!files.length) {
        setPages([]);
        setNotice('');
        return;
      }

      setLoading(true);
      setNotice('');

      try {
        const pdfjs: any = await import(
          'pdfjs-dist/legacy/build/pdf.mjs'
        );
        // The preview runs many page renders, so use the bundled PDF.js
        // worker instead of disabling workers. postinstall copies this file
        // to /pdf.worker.min.mjs for static/Cloudflare deployments.
        pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';
        const next: PageItem[] = [];

        for (let fileIndex = 0; fileIndex < files.length; fileIndex += 1) {
          const data = new Uint8Array(await files[fileIndex].arrayBuffer());
          const doc = await pdfjs.getDocument({ data }).promise;
          const limit = Math.min(
            doc.numPages,
            (mode === 'reorder' ? 200 : PREVIEW_LIMIT) - next.length
          );

          for (let pageIndex = 1; pageIndex <= limit; pageIndex += 1) {
            if (cancelled) return;

            const page = await doc.getPage(pageIndex);
            const viewport = page.getViewport({ scale: 0.32 });
            const canvas = document.createElement('canvas');
            canvas.width = Math.max(1, Math.ceil(viewport.width));
            canvas.height = Math.max(1, Math.ceil(viewport.height));

            const ctx = canvas.getContext('2d');
            if (!ctx) continue;

            await page.render({
              canvasContext: ctx,
              viewport,
            }).promise;

            const src = canvas.toDataURL('image/jpeg', 0.78);
            urls.push(src);

            next.push({
              fileIndex,
              pageIndex: pageIndex - 1,
              label: files.length > 1
                ? `${files[fileIndex].name} • Page ${pageIndex}`
                : `Page ${pageIndex}`,
              src,
            });
          }

          if (next.length >= PREVIEW_LIMIT) break;
        }

        if (cancelled) return;

        setPages(next);

        const previewLimit = mode === 'reorder' ? 200 : PREVIEW_LIMIT;
        if (next.length >= previewLimit) {
          setNotice(
            mode === 'reorder'
              ? `Showing the first 200 pages. For PDFs with more pages, use the order field below; processing still uses the complete PDF.`
              : `Showing the first ${PREVIEW_LIMIT} pages for a fast preview. Processing still uses the complete PDF.`
          );
        } else {
          setNotice('');
        }
      } catch (error) {
        if (!cancelled) {
          setPages([]);
          setNotice(
            error instanceof Error
              ? error.message
              : 'Could not create the PDF preview.'
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();

    return () => {
      cancelled = true;
      urls.length = 0;
    };
  }, [files]);

  const selectedSet = useMemo(
    () => new Set(selectedPages),
    [selectedPages]
  );

  const togglePage = (index: number) => {
    if (mode === 'reorder' || mode === 'merge') return;

    const next = selectedSet.has(index)
      ? selectedPages.filter((page) => page !== index)
      : [...selectedPages, index];

    onSelectedPagesChange(next.sort((a, b) => a - b));
  };

  const reorderPages = (fromIndex: number, toIndex: number) => {
    if (fromIndex === toIndex || fromIndex < 0 || toIndex < 0) return;
    if (fromIndex >= pages.length || toIndex >= pages.length) return;

    const next = [...pages];
    const [moved] = next.splice(fromIndex, 1);
    next.splice(toIndex, 0, moved);
    setPages(next);
    if (mode === 'reorder') {
      onReorderChange(next.map((page) => page.pageIndex + 1));
    }
  };

  const movePage = (index: number, direction: number) => {
    const target = index + direction;
    if (target < 0 || target >= pages.length) return;

    const next = [...pages];
    [next[index], next[target]] = [next[target], next[index]];

    setPages(next);

    if (mode === 'reorder') {
      onReorderChange(next.map((page) => page.pageIndex + 1));
    }
  };

  const actionText =
    mode === 'merge'
      ? 'PDF order'
      : mode === 'reorder'
        ? 'Drag-free page ordering'
        : mode === 'delete'
          ? 'Select pages to delete'
          : mode === 'split'
            ? 'Select pages to extract'
            : mode === 'rotate'
              ? 'Select pages to rotate'
              : 'Preview before adding page numbers';

  if (!files.length) return null;

  return (
    <section className="rounded-2xl border border-zinc-200 bg-zinc-50/70 p-4 dark:border-zinc-800 dark:bg-zinc-950/60">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <h4 className="text-sm font-bold text-zinc-900 dark:text-white">
            PDF workspace
          </h4>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            {mode === 'reorder' ? 'Drag any page directly to its new position, or use the arrows.' : actionText}
          </p>
        </div>
        {loading && (
          <span className="inline-flex items-center gap-2 text-xs text-zinc-500">
            <Loader2 className="h-4 w-4 animate-spin" />
            Preparing preview…
          </span>
        )}
      </div>

      {pages.length > 0 && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {pages.map((page, index) => {
            const selected = selectedSet.has(index);

            return (
              <div
                key={`${page.fileIndex}-${page.pageIndex}-${index}`}
                draggable={mode === 'reorder'}
                onDragStart={() => {
                  if (mode === 'reorder') setDraggedIndex(index);
                }}
                onDragOver={(event) => {
                  if (mode === 'reorder') event.preventDefault();
                }}
                onDrop={(event) => {
                  event.preventDefault();
                  if (mode === 'reorder' && draggedIndex !== null) {
                    reorderPages(draggedIndex, index);
                  }
                  setDraggedIndex(null);
                }}
                onDragEnd={() => setDraggedIndex(null)}
                className={[
                  'group relative rounded-xl border bg-white p-2 shadow-sm transition',
                  mode === 'reorder' ? 'cursor-grab active:cursor-grabbing' : '',
                  draggedIndex === index ? 'opacity-50' : '',
                  selected
                    ? 'border-violet-500 ring-2 ring-violet-500/20'
                    : 'border-zinc-200 dark:border-zinc-800 dark:bg-zinc-900',
                ].join(' ')}
              >
                <button
                  type="button"
                  className="block w-full text-left"
                  onClick={() => togglePage(index)}
                  disabled={mode === 'merge' || mode === 'reorder'}
                  aria-label={selected ? `Deselect page ${index + 1}` : `Select page ${index + 1}`}
                >
                  <div className="relative overflow-hidden rounded-lg border border-zinc-100 bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-950">
                    <img
                      src={page.src}
                      alt={page.label}
                      className="aspect-[3/4] w-full object-contain"
                      loading="lazy"
                    />
                    {selected && (
                      <span className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-violet-600 text-white shadow">
                        <Check className="h-4 w-4" />
                      </span>
                    )}
                  </div>
                  <div className="mt-2 truncate text-center text-[11px] font-semibold text-zinc-700 dark:text-zinc-200">
                    {files.length > 1 ? page.label : `Page ${index + 1}`}
                  </div>
                </button>

                {mode === 'reorder' && (
                  <div className="mt-2 flex justify-center gap-1">
                    <button
                      type="button"
                      className="rounded-lg border border-zinc-200 bg-white p-1.5 text-zinc-700 hover:bg-zinc-50 disabled:opacity-40 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200"
                      onClick={() => movePage(index, -1)}
                      disabled={index === 0}
                      aria-label={`Move page ${index + 1} up`}
                    >
                      <ArrowUp className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      className="rounded-lg border border-zinc-200 bg-white p-1.5 text-zinc-700 hover:bg-zinc-50 disabled:opacity-40 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200"
                      onClick={() => movePage(index, 1)}
                      disabled={index === pages.length - 1}
                      aria-label={`Move page ${index + 1} down`}
                    >
                      <ArrowDown className="h-3.5 w-3.5" />
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {notice && (
        <p className="mt-3 text-xs text-zinc-500 dark:text-zinc-400">
          {notice}
        </p>
      )}
    </section>
  );
}
