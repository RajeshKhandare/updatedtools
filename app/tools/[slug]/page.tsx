'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ToolEngineRunner from '@/components/ToolEngineRunner';
import ToolSeoContent from '@/components/ToolSeoContent';
import { TOOLS_REGISTRY } from '@/data/toolsRegistry';
import {
  Upload,
  FileText,
  Trash2,
  ArrowDown,
  ArrowUp,
  Download,
  Loader2,
  CheckCircle2,
  Lock,
  ArrowRight,
  BookOpen,
  Play,
  Copy,
  Check,
  RotateCw,
  Key,
  HelpCircle,
  ChevronDown,
  Youtube,
  Tag,
  Code,
  Database,
  Terminal,
  FileCode,
} from 'lucide-react';
import { PDFDocument, StandardFonts, degrees } from 'pdf-lib';
import JSZip from 'jszip';

// ----------------------------------------------------
// 1. DEDICATED PDF SUITE ENGINE
// ----------------------------------------------------
function DedicatedPdfEngine({ toolSlug, toolName }: { toolSlug: string; toolName: string }) {
  const [files, setFiles] = useState<{ id: string; file: File; name: string; size: string }[]>([]);
  const [processing, setProcessing] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);

  const [password, setPassword] = useState('');
  const [pageRange, setPageRange] = useState('1');
  const [rotationAngle, setRotationAngle] = useState(90);
  const [pageNumberStart, setPageNumberStart] = useState(1);

  const isDeleteTool = toolSlug === 'delete-pdf-pages';
  const isReorderTool = toolSlug === 'reorder-pdf-pages';
  const isPageNumbersTool = toolSlug === 'add-page-numbers-pdf';
  const isJpgToPdfTool = toolSlug === 'jpg-to-pdf';
  const isPdfToJpgTool = toolSlug === 'pdf-to-jpg';
  const isGrayscalePdfTool = toolSlug === 'pdf-grayscale-converter';

  const isLockTool = toolSlug.includes('protect') || toolSlug.includes('lock') || toolSlug.includes('password');
  const isSplitTool = toolSlug.includes('split');
  const isRotateTool = toolSlug.includes('rotate');

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const newFiles = Array.from(e.target.files).map((file) => ({
      id: Math.random().toString(36).substring(7),
      file,
      name: file.name,
      size: (file.size / (1024 * 1024)).toFixed(2) + ' MB',
    }));

    if (isLockTool || isSplitTool || isRotateTool || isDeleteTool || isReorderTool || isPageNumbersTool || isJpgToPdfTool || isPdfToJpgTool || isGrayscalePdfTool) {
      setFiles([newFiles[0]]);
    } else {
      setFiles((prev) => [...prev, ...newFiles]);
    }
  };

  const moveItem = (index: number, dir: 'up' | 'down') => {
    const target = dir === 'up' ? index - 1 : index + 1;
    if (target < 0 || target >= files.length) return;
    const updated = [...files];
    const [moved] = updated.splice(index, 1);
    updated.splice(target, 0, moved);
    setFiles(updated);
  };

  const parsePageNumbers = (spec: string, count: number) => {
    const values: number[] = [];
    for (const part of spec.split(',').map((p) => p.trim()).filter(Boolean)) {
      const range = part.match(/^(\d+)\s*-\s*(\d+)$/);
      if (range) {
        const start = Number(range[1]);
        const end = Number(range[2]);
        if (start > end || start < 1 || end > count) return [];
        for (let n = start; n <= end; n++) values.push(n);
      } else if (/^\d+$/.test(part)) {
        const n = Number(part);
        if (n < 1 || n > count) return [];
        values.push(n);
      } else return [];
    }
    return Array.from(new Set(values));
  };

  const runPdfOperation = async () => {
    if (files.length === 0) return;
    if (isLockTool) {
      alert(toolSlug === 'unlock-pdf-password' ? 'Unlocking encrypted PDFs is not supported by the current browser PDF engine.' : 'Password protection is not supported by the current browser PDF engine. No file was changed.');
      return;
    }

    setProcessing(true);
    try {
      if (isJpgToPdfTool) {
        const imageBytes = new Uint8Array(await files[0].file.arrayBuffer());
        const pdf = await PDFDocument.create();
        const image = await pdf.embedJpg(imageBytes);
        const page = pdf.addPage([image.width, image.height]);
        page.drawImage(image, { x: 0, y: 0, width: image.width, height: image.height });
        const bytes = await pdf.save();
        setDownloadUrl(URL.createObjectURL(new Blob([bytes as any], { type: 'application/pdf' })));
      } else if (isPdfToJpgTool || isGrayscalePdfTool) {
        const pdfjs = await import('pdfjs-dist/legacy/build/pdf.mjs');
        const pdfData = new Uint8Array(await files[0].file.arrayBuffer());
        const loaded = await pdfjs.getDocument({ data: pdfData }).promise;
        const zip = isPdfToJpgTool ? new JSZip() : null;
        const outputPdf = isGrayscalePdfTool ? await PDFDocument.create() : null;
        for (let pageNo = 1; pageNo <= loaded.numPages; pageNo++) {
          const sourcePage = await loaded.getPage(pageNo);
          const viewport = sourcePage.getViewport({ scale: 1.5 });
          const canvas = document.createElement('canvas');
          canvas.width = Math.ceil(viewport.width);
          canvas.height = Math.ceil(viewport.height);
          const ctx = canvas.getContext('2d');
          if (!ctx) throw new Error('Browser canvas is unavailable.');
          if (isGrayscalePdfTool) ctx.filter = 'grayscale(100%)';
          await sourcePage.render({ canvasContext: ctx, viewport }).promise;
          const blob = await new Promise<Blob>((resolve, reject) => canvas.toBlob(b => b ? resolve(b) : reject(new Error('Could not create JPG image.')), 'image/jpeg', 0.9));
          if (zip) zip.file(`page-${pageNo}.jpg`, blob);
          if (outputPdf) {
            const jpgBytes = new Uint8Array(await blob.arrayBuffer());
            const image = await outputPdf.embedJpg(jpgBytes);
            const page = outputPdf.addPage([image.width, image.height]);
            page.drawImage(image, { x: 0, y: 0, width: image.width, height: image.height });
          }
          canvas.width = 1; canvas.height = 1;
        }
        if (zip) {
          const zipBlob = await zip.generateAsync({ type: 'blob' });
          setDownloadUrl(URL.createObjectURL(zipBlob));
        } else if (outputPdf) {
          const bytes = await outputPdf.save();
          setDownloadUrl(URL.createObjectURL(new Blob([bytes as any], { type: 'application/pdf' })));
        }
      } else if (isDeleteTool) {
        const buf = await files[0].file.arrayBuffer();
        const srcPdf = await PDFDocument.load(buf);
        const count = srcPdf.getPageCount();
        const toDelete = parsePageNumbers(pageRange, count);
        if (!toDelete.length) throw new Error('Enter pages to delete, for example 2,4-5.');
        const keep = Array.from({ length: count }, (_, i) => i + 1).filter((n) => !toDelete.includes(n));
        if (!keep.length) throw new Error('At least one page must remain.');
        const out = await PDFDocument.create();
        const pages = await out.copyPages(srcPdf, keep.map((n) => n - 1));
        pages.forEach((p) => out.addPage(p));
        const bytes = await out.save();
        setDownloadUrl(URL.createObjectURL(new Blob([bytes as any], { type: 'application/pdf' })));
      } else if (isReorderTool) {
        const buf = await files[0].file.arrayBuffer();
        const srcPdf = await PDFDocument.load(buf);
        const count = srcPdf.getPageCount();
        const order = parsePageNumbers(pageRange, count);
        if (order.length !== count || new Set(order).size !== count) throw new Error(`Enter every page exactly once, e.g. 3,1,2 for a 3-page PDF.`);
        const out = await PDFDocument.create();
        const pages = await out.copyPages(srcPdf, order.map((n) => n - 1));
        pages.forEach((p) => out.addPage(p));
        const bytes = await out.save();
        setDownloadUrl(URL.createObjectURL(new Blob([bytes as any], { type: 'application/pdf' })));
      } else if (isPageNumbersTool) {
        const buf = await files[0].file.arrayBuffer();
        const pdf = await PDFDocument.load(buf);
        const font = await pdf.embedFont(StandardFonts.Helvetica);
        pdf.getPages().forEach((page, index) => {
          const { width } = page.getSize();
          page.drawText(String(pageNumberStart + index), { x: width / 2 - 5, y: 18, size: 10, font });
        });
        const bytes = await pdf.save();
        setDownloadUrl(URL.createObjectURL(new Blob([bytes as any], { type: 'application/pdf' })));
      } else if (isRotateTool) {
        const buf = await files[0].file.arrayBuffer();
        const pdf = await PDFDocument.load(buf);
        const pages = pdf.getPages();
        pages.forEach((p) => p.setRotation(degrees(rotationAngle)));
        const bytes = await pdf.save();
        const blob = new Blob([bytes as any], { type: 'application/pdf' });
        setDownloadUrl(URL.createObjectURL(blob));
      } else if (isSplitTool) {
        const buf = await files[0].file.arrayBuffer();
        const srcPdf = await PDFDocument.load(buf);
        const newPdf = await PDFDocument.create();
        const requested = pageRange
          .split(',')
          .map((part) => part.trim())
          .filter(Boolean)
          .flatMap((part) => {
            const match = part.match(/^(\d+)\s*-\s*(\d+)$/);
            if (match) {
              const start = Number(match[1]);
              const end = Number(match[2]);
              return Array.from({ length: Math.max(0, end - start + 1) }, (_, i) => start + i);
            }
            return /^\d+$/.test(part) ? [Number(part)] : [];
          });
        const uniquePages = Array.from(new Set(requested));
        if (!uniquePages.length || uniquePages.some((page) => page < 1 || page > srcPdf.getPageCount())) {
          throw new Error(`Invalid page range. This PDF has ${srcPdf.getPageCount()} page(s).`);
        }
        const copiedPages = await newPdf.copyPages(srcPdf, uniquePages.map((page) => page - 1));
        copiedPages.forEach((page) => newPdf.addPage(page));
        const bytes = await newPdf.save();
        const blob = new Blob([bytes as any], { type: 'application/pdf' });
        setDownloadUrl(URL.createObjectURL(blob));
      } else if (isLockTool) {
        const buf = await files[0].file.arrayBuffer();
        const srcPdf = await PDFDocument.load(buf);
        const bytes = await srcPdf.save({
          useObjectStreams: false,
          userPassword: password.trim(),
          ownerPassword: password.trim() + '_owner',
          permissions: {
            printing: 'highResolution',
            modifying: false,
            copying: false,
            annotating: false,
            fillingForms: true,
            contentAccessibility: true,
            documentAssembly: false,
          },
        } as any);
        const blob = new Blob([bytes as any], { type: 'application/pdf' });
        setDownloadUrl(URL.createObjectURL(blob));
      } else {
        const mergedPdf = await PDFDocument.create();
        for (const item of files) {
          const buf = await item.file.arrayBuffer();
          const pdf = await PDFDocument.load(buf);
          const pages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
          pages.forEach((p) => mergedPdf.addPage(p));
        }
        const bytes = await mergedPdf.save();
        const blob = new Blob([bytes as any], { type: 'application/pdf' });
        setDownloadUrl(URL.createObjectURL(blob));
      }
    } catch (e) {
      alert('Error processing PDF client-side.');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="border-2 border-dashed border-zinc-300 dark:border-zinc-800 hover:border-violet-500 rounded-3xl p-8 text-center bg-white dark:bg-zinc-900/50">
        <input
          type="file"
          id="pdf-in"
          multiple={!isLockTool && !isSplitTool && !isRotateTool && !isDeleteTool && !isReorderTool && !isPageNumbersTool && !isJpgToPdfTool}
          accept={isJpgToPdfTool ? '.jpg,.jpeg,image/jpeg' : '.pdf,application/pdf'}
          onChange={handleFileUpload}
          className="hidden"
        />
        <label htmlFor="pdf-in" className="cursor-pointer flex flex-col items-center">
          <div className="h-14 w-14 rounded-2xl bg-violet-50 dark:bg-violet-950/40 text-violet-600 dark:text-violet-400 flex items-center justify-center mb-3">
            <Upload className="h-7 w-7" />
          </div>
          <span className="text-sm font-bold text-zinc-900 dark:text-white">
            {isJpgToPdfTool ? 'Select JPG Image' : isLockTool ? 'Select PDF to Protect' : isSplitTool ? 'Select PDF to Split' : isDeleteTool ? 'Select PDF to Edit' : isReorderTool ? 'Select PDF to Reorder' : isPageNumbersTool ? 'Select PDF to Number' : 'Choose or Drop PDF Files'}
          </span>
          <span className="text-xs text-zinc-400 mt-1">Processing stays in your browser for supported tools</span>
        </label>
      </div>

      {files.length > 0 && (
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 shadow-sm space-y-4">
          <div className="flex justify-between items-center pb-2 border-b border-zinc-100 dark:border-zinc-800">
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">
              Selected Document ({files.length})
            </span>
            <button onClick={() => setFiles([])} className="text-xs font-bold text-rose-500 hover:underline">
              Clear
            </button>
          </div>

          <div className="space-y-2">
            {files.map((file, idx) => (
              <div
                key={file.id}
                className="flex items-center justify-between p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200/60 dark:border-zinc-800/60"
              >
                <div className="flex items-center gap-3 truncate">
                  <FileText className="h-5 w-5 text-violet-600 shrink-0" />
                  <div className="truncate">
                    <p className="text-xs font-bold text-zinc-900 dark:text-white truncate">{file.name}</p>
                    <p className="text-[10px] text-zinc-400">{file.size}</p>
                  </div>
                </div>

                {!isLockTool && !isSplitTool && files.length > 1 && (
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      disabled={idx === 0}
                      onClick={() => moveItem(idx, 'up')}
                      className="p-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 disabled:opacity-30"
                    >
                      <ArrowUp className="h-3.5 w-3.5" />
                    </button>
                    <button
                      disabled={idx === files.length - 1}
                      onClick={() => moveItem(idx, 'down')}
                      className="p-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 disabled:opacity-30"
                    >
                      <ArrowDown className="h-3.5 w-3.5" />
                    </button>
                  </div>
                )}
                <button
                  onClick={() => setFiles(files.filter((f) => f.id !== file.id))}
                  className="p-1.5 rounded-lg border border-rose-200 dark:border-rose-900 text-rose-500"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>

          {isLockTool && (
            <div className="p-4 rounded-2xl bg-violet-50/50 dark:bg-violet-950/20 border border-violet-100 dark:border-violet-900/50 space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-zinc-900 dark:text-white">
                <Key className="h-4 w-4 text-violet-600" />
                <span>Set Password Protection</span>
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter strong password..."
                className="w-full rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3.5 py-2.5 text-xs text-zinc-900 dark:text-white outline-none focus:border-violet-500"
              />
            </div>
          )}

          {isSplitTool && (
            <div className="p-4 rounded-2xl bg-violet-50/50 dark:bg-violet-950/20 border border-violet-100 dark:border-violet-900/50 space-y-2">
              <label className="text-xs font-bold text-zinc-900 dark:text-white block">
                Extract Pages (e.g. 1,3-5)
              </label>
              <input
                type="text"
                placeholder="1,3-5"
                value={pageRange}
                onChange={(e) => setPageRange(e.target.value)}
                className="w-32 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-2 text-xs text-zinc-900 dark:text-white outline-none"
              />
            </div>
          )}

          {(isDeleteTool || isReorderTool) && (
            <div className="p-4 rounded-2xl bg-violet-50/50 dark:bg-violet-950/20 border border-violet-100 dark:border-violet-900/50 space-y-2">
              <label className="text-xs font-bold text-zinc-900 dark:text-white block">
                {isDeleteTool ? 'Pages to delete (e.g. 2,4-5)' : 'New page order (e.g. 3,1,2)'}
              </label>
              <input type="text" value={pageRange} onChange={(e) => setPageRange(e.target.value)} placeholder={isDeleteTool ? '2,4-5' : '3,1,2'} className="w-full max-w-sm rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-2 text-xs text-zinc-900 dark:text-white outline-none" />
            </div>
          )}

          {isPageNumbersTool && (
            <div className="p-4 rounded-2xl bg-violet-50/50 dark:bg-violet-950/20 border border-violet-100 dark:border-violet-900/50 space-y-2">
              <label className="text-xs font-bold text-zinc-900 dark:text-white block">Starting page number</label>
              <input type="number" min="1" value={pageNumberStart} onChange={(e) => setPageNumberStart(Math.max(1, Number(e.target.value) || 1))} className="w-32 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-2 text-xs text-zinc-900 dark:text-white outline-none" />
            </div>
          )}

          {isRotateTool && (
            <div className="p-4 rounded-2xl bg-violet-50/50 dark:bg-violet-950/20 border border-violet-100 dark:border-violet-900/50 flex items-center gap-3">
              <span className="text-xs font-bold text-zinc-900 dark:text-white">Rotate Direction:</span>
              <div className="flex gap-2">
                {[90, 180, 270].map((deg) => (
                  <button
                    key={deg}
                    onClick={() => setRotationAngle(deg)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition ${
                      rotationAngle === deg
                        ? 'bg-violet-600 text-white border-violet-600'
                        : 'bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-800'
                    }`}
                  >
                    {deg}°
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="pt-2 flex flex-col sm:flex-row gap-3">
            <button
              onClick={runPdfOperation}
              disabled={processing}
              className="flex-1 flex items-center justify-center gap-2 rounded-2xl bg-violet-600 px-6 py-3.5 text-xs font-bold text-white hover:bg-violet-700 shadow-md shadow-violet-500/20 disabled:opacity-50"
            >
              {processing ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Processing In Browser...</span>
                </>
              ) : (
                <span>Run {toolName}</span>
              )}
            </button>

            {downloadUrl && (
              <a
                href={downloadUrl}
                download={`TheToolsGenie_${toolSlug}.pdf`}
                className="flex items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-6 py-3.5 text-xs font-bold text-white hover:bg-emerald-700 shadow-md shadow-emerald-500/20"
              >
                <Download className="h-4 w-4" /> Download Result
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ----------------------------------------------------
// 2. DEDICATED IMAGE ENGINE (Interactive Canvas)
// ----------------------------------------------------
function DedicatedImageEngine({ toolSlug, toolName }: { toolSlug: string; toolName: string }) {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [quality, setQuality] = useState(85);
  const [cropWidth, setCropWidth] = useState(400);
  const [cropHeight, setCropHeight] = useState(400);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const handleImg = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0]) return;
    const reader = new FileReader();
    reader.onload = (ev) => setImageSrc(ev.target?.result as string);
    reader.readAsDataURL(e.target.files[0]);
  };

  useEffect(() => {
    if (!imageSrc || !canvasRef.current) return;
    const cvs = canvasRef.current;
    const ctx = cvs.getContext('2d');
    if (!ctx) return;
    const img = new Image();
    img.src = imageSrc;
    img.onload = () => {
      cvs.width = cropWidth;
      cvs.height = cropHeight;
      if (toolSlug.includes('grayscale') || toolSlug.includes('black-and-white')) {
        ctx.filter = 'grayscale(100%)';
      }
      ctx.drawImage(img, 0, 0, cropWidth, cropHeight);
      setDownloadUrl(cvs.toDataURL('image/jpeg', quality / 100));
    };
  }, [imageSrc, quality, cropWidth, cropHeight, toolSlug]);

  return (
    <div>
      {!imageSrc ? (
        <div className="border-2 border-dashed border-zinc-300 dark:border-zinc-800 rounded-3xl p-10 text-center bg-white dark:bg-zinc-900/50">
          <input type="file" id="img-in" accept="image/*" onChange={handleImg} className="hidden" />
          <label htmlFor="img-in" className="cursor-pointer flex flex-col items-center">
            <Upload className="h-10 w-10 text-violet-600 mb-3" />
            <span className="text-sm font-bold text-zinc-900 dark:text-white">Upload Image for {toolName}</span>
            <span className="text-xs text-zinc-400 mt-1">100% Client-side local canvas transformation</span>
          </label>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6">
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400">Tool Adjustments</h3>
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span>Output Quality</span>
                <span>{quality}%</span>
              </div>
              <input
                type="range"
                min="20"
                max="100"
                value={quality}
                onChange={(e) => setQuality(Number(e.target.value))}
                className="w-full accent-violet-600"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-zinc-400 block mb-1">Target Width</label>
                <input
                  type="number"
                  value={cropWidth}
                  onChange={(e) => setCropWidth(Number(e.target.value))}
                  className="w-full rounded-xl border p-2 text-xs bg-zinc-50 dark:bg-zinc-950 font-bold"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-zinc-400 block mb-1">Target Height</label>
                <input
                  type="number"
                  value={cropHeight}
                  onChange={(e) => setCropHeight(Number(e.target.value))}
                  className="w-full rounded-xl border p-2 text-xs bg-zinc-50 dark:bg-zinc-950 font-bold"
                />
              </div>
            </div>
            {downloadUrl && (
              <a
                href={downloadUrl}
                download={`TheToolsGenie_${toolSlug}.jpg`}
                className="flex items-center justify-center gap-2 rounded-2xl bg-violet-600 p-3.5 text-xs font-bold text-white shadow-md"
              >
                <Download className="h-4 w-4" /> Download Processed Image
              </a>
            )}
            <button
              onClick={() => setImageSrc(null)}
              className="w-full text-center text-xs text-zinc-400 hover:text-rose-500"
            >
              Choose different image
            </button>
          </div>
          <div className="lg:col-span-2 flex flex-col items-center justify-center p-4 bg-zinc-50 dark:bg-zinc-950 rounded-2xl border">
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-3 self-start">
              Live Canvas Preview
            </span>
            <canvas ref={canvasRef} className="max-w-full max-h-[400px] rounded-lg shadow" />
          </div>
        </div>
      )}
    </div>
  );
}

// ----------------------------------------------------
// 3. PROGRAMIZ-STYLE SPLIT IDE COMPILER (Branded Violet Theme)
// ----------------------------------------------------
function ProgramizCompilerEngine({ toolSlug, toolName }: { toolSlug: string; toolName: string }) {
  const isSql = toolSlug.includes('sql');
  const isJava = toolSlug.includes('java');
  const isPython = toolSlug.includes('python');
  const isCpp = toolSlug.includes('cpp');
  const isCsharp = toolSlug.includes('csharp');
  const isPhp = toolSlug.includes('php');

  const fileName = isSql ? 'query.sql' : isJava ? 'Main.java' : isPython ? 'main.py' : isCpp ? 'main.cpp' : isCsharp ? 'Program.cs' : isPhp ? 'main.php' : 'index.js';

  const defaultCode = isSql
    ? `-- Online SQL Editor to Run SQL Online.\n-- Query existing sample tables or create new schemas.\n\nSELECT customer_id, first_name, last_name, age, country\nFROM Customers\nWHERE age >= 25;`
    : isJava
    ? `// Online Java Compiler\n// Use this editor to write, compile and run your Java code online\n\nclass Main {\n    public static void main(String[] args) {\n        System.out.println("Hello, World!");\n        System.out.println("TheToolsGenie IDE Ready.");\n    }\n}`
    : isPython
    ? `# Online Python Compiler (Python 3)\ndef greet(name):\n    return f"Hello, {name}! Welcome to Python IDE."\n\nprint(greet("Developer"))\nnumbers = [1, 2, 3, 4, 5]\nprint("Squared:", [x**2 for x in numbers])`
    : isCsharp
    ? `using System;\n\nclass Program {\n    static void Main() {\n        Console.WriteLine("Hello from C#!");\n    }\n}`
    : isPhp
    ? `<?php\n$numbers = [10, 20, 30, 40];\necho "Sum: " . array_sum($numbers) . PHP_EOL;\n?>`
    : `// Online JavaScript / Developer IDE\nconsole.log("Welcome to ${toolName}!");\nconst numbers = [10, 20, 30, 40];\nconsole.log("Sum:", numbers.reduce((a, b) => a + b, 0));`;

  const [code, setCode] = useState(defaultCode);
  const [copied, setCopied] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [sqlOutputData, setSqlOutputData] = useState<any[]>([
    { customer_id: 1, first_name: 'John', last_name: 'Doe', age: 31, country: 'USA' },
    { customer_id: 4, first_name: 'John', last_name: 'Reinhardt', age: 25, country: 'UK' },
    { customer_id: 5, first_name: 'Betty', last_name: 'Doe', age: 28, country: 'UAE' },
  ]);
  const [consoleOutput, setConsoleOutput] = useState<string>('Hello, World!\nTheToolsGenie IDE Ready.');

  const runCode = async () => {
    setIsRunning(true);
    try {
      if (isSql) {
        const initSqlJs = (await import('sql.js')).default;
        const SQL = await initSqlJs({ locateFile: (file: string) => `/${file}` });
        const db = new SQL.Database();
        db.run(`CREATE TABLE Customers (customer_id INTEGER, first_name TEXT, last_name TEXT, age INTEGER, country TEXT);
          INSERT INTO Customers VALUES
          (1, 'John', 'Doe', 31, 'USA'),
          (2, 'Sarah', 'Miller', 22, 'Canada'),
          (3, 'Mike', 'Brown', 41, 'India'),
          (4, 'John', 'Reinhardt', 25, 'UK'),
          (5, 'Betty', 'Doe', 28, 'UAE');`);

        const statements = code.split(/;(?=(?:[^']*'[^']*')*[^']*$)/).map((q) => q.trim()).filter(Boolean);
        if (!statements.length) throw new Error('SQL query cannot be empty.');

        let resultRows: any[] = [];
        let resultColumns: string[] = [];
        let executed = 0;
        for (const statement of statements) {
          const results = db.exec(statement);
          executed += 1;
          if (results.length) {
            resultColumns = results[0].columns;
            resultRows = results[0].values.map((row: any[]) => Object.fromEntries(resultColumns.map((col, i) => [col, row[i]])));
          }
        }
        setSqlOutputData(resultRows);
        setConsoleOutput(`${executed} SQL statement(s) executed locally.`);
        db.close();
        return;
      }

      const language = isPython ? 'python' : isJava ? 'java' : isCpp ? 'cpp' : isCsharp ? 'csharp' : isPhp ? 'php' : 'javascript';
      setConsoleOutput('Submitting code to the configured execution runtime...');
      const response = await fetch('/api/execute-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ language, code }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error || `Execution failed (${response.status})`);
      const output = [data.stdout, data.stderr, data.compileOutput].filter(Boolean).join('\n');
      setConsoleOutput(output || 'Program finished successfully with no output.');
    } catch (err) {
      setConsoleOutput(`Execution Error: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setIsRunning(false);
    }
  };

  const lineCount = Math.max(12, code.split('\n').length);

  return (
    <div className="flex border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden bg-white dark:bg-zinc-950 shadow-sm">
      {/* Programiz Left Side Icons Bar */}
      <div className="w-12 border-r border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/60 flex flex-col items-center py-3 gap-3 shrink-0">
        <button className="p-2 rounded-xl bg-violet-50 dark:bg-violet-950 text-violet-600 dark:text-violet-400" title="Editor">
          <FileCode className="h-4 w-4" />
        </button>
        <button className="p-2 rounded-xl text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200" title="Console">
          <Terminal className="h-4 w-4" />
        </button>
        {isSql && (
          <button className="p-2 rounded-xl text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200" title="Database Tables">
            <Database className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Main IDE Workspace */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Tab Header (Violet Themed) */}
        <div className="flex items-center justify-between px-4 py-2 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/70 dark:bg-zinc-900/30">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-t-lg bg-white dark:bg-zinc-900 text-xs font-bold border-t-2 border-violet-600 text-zinc-900 dark:text-white flex items-center gap-1.5 shadow-sm">
              <span className="h-2 w-2 rounded-full bg-violet-500"></span>
              {fileName}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                navigator.clipboard.writeText(code);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
              }}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 text-xs font-semibold hover:bg-zinc-100 dark:hover:bg-zinc-800"
            >
              {copied ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>

            {/* Branded Violet Run Button */}
            <button
              onClick={runCode}
              disabled={isRunning}
              className="flex items-center gap-1.5 px-5 py-1.5 rounded-lg bg-violet-600 hover:bg-violet-700 text-xs font-bold text-white transition shadow-sm shadow-violet-500/20 disabled:opacity-50"
            >
              <Play className="h-3.5 w-3.5 fill-white" />
              <span>{isSql ? 'Run SQL' : 'Run'}</span>
            </button>
          </div>
        </div>

        {/* Split Screen Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[420px]">
          {/* Left Column: Code Editor */}
          <div className="flex border-r border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 font-mono text-xs">
            <div className="w-10 select-none py-3 text-right pr-2 text-zinc-300 dark:text-zinc-700 leading-6 shrink-0 bg-zinc-50/50 dark:bg-zinc-900/20">
              {Array.from({ length: lineCount }).map((_, i) => (
                <div key={i}>{i + 1}</div>
              ))}
            </div>

            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              spellCheck="false"
              rows={lineCount}
              className="flex-1 p-3 bg-transparent text-zinc-900 dark:text-zinc-100 outline-none resize-none font-mono text-xs leading-6"
            />
          </div>

          {/* Right Column: Console Output */}
          <div className="flex flex-col bg-zinc-50/40 dark:bg-zinc-950/40">
            <div className="px-4 py-2 border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 flex items-center justify-between">
              <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Output</span>
              <span className="text-[10px] text-zinc-400">Terminal Ready</span>
            </div>

            <div className="flex-1 p-4 overflow-auto">
              {isSql ? (
                <div className="border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden bg-white dark:bg-zinc-900">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-zinc-50 dark:bg-zinc-800/60 border-b border-zinc-200 dark:border-zinc-800 font-bold text-zinc-700 dark:text-zinc-300">
                      <tr>
                        <th className="p-2.5">customer_id</th>
                        <th className="p-2.5">first_name</th>
                        <th className="p-2.5">last_name</th>
                        <th className="p-2.5">age</th>
                        <th className="p-2.5">country</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800 font-mono">
                      {sqlOutputData.map((row, idx) => (
                        <tr key={idx} className="hover:bg-zinc-50/60 dark:hover:bg-zinc-800/30">
                          <td className="p-2.5 font-bold text-violet-600 dark:text-violet-400">{row.customer_id}</td>
                          <td className="p-2.5">{row.first_name}</td>
                          <td className="p-2.5">{row.last_name}</td>
                          <td className="p-2.5">{row.age}</td>
                          <td className="p-2.5">{row.country}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <pre className="font-mono text-xs text-zinc-800 dark:text-emerald-400 whitespace-pre-wrap leading-relaxed">
                  {consoleOutput}
                </pre>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ----------------------------------------------------
// 4. DEDICATED YOUTUBE SUITE ENGINE
// ----------------------------------------------------
function DedicatedYoutubeEngine({ toolSlug, toolName }: { toolSlug: string; toolName: string }) {
  const isThumbnail = toolSlug.includes('thumbnail');
  const isMoney = toolSlug.includes('money') || toolSlug.includes('revenue') || toolSlug.includes('calculator');

  const [videoUrl, setVideoUrl] = useState('');
  const [extractedId, setExtractedId] = useState<string | null>(null);

  const [dailyViews, setDailyViews] = useState(25000);
  const [rpm, setRpm] = useState(2.5);

  const [topic, setTopic] = useState('');
  const [generatedTags, setGeneratedTags] = useState<string[]>([]);

  const handleExtractThumbnail = () => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = videoUrl.match(regExp);
    if (match && match[2].length === 11) {
      setExtractedId(match[2]);
    } else {
      alert('Please enter a valid YouTube Video link.');
    }
  };

  const handleGenerateTags = () => {
    if (!topic.trim()) return;
    const base = topic.trim().toLowerCase();
    const tags = [
      base,
      `${base} tutorial`,
      `how to ${base}`,
      `${base} guide 2026`,
      `${base} tips`,
      `best ${base}`,
      `${base} for beginners`,
      `trending ${base}`,
    ];
    setGeneratedTags(tags);
  };

  const monthlyViews = dailyViews * 30;
  const monthlyEarnings = Math.round((monthlyViews / 1000) * rpm);
  const yearlyEarnings = monthlyEarnings * 12;

  if (isThumbnail) {
    return (
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 sm:p-8 space-y-6">
        <div className="space-y-2">
          <label className="text-xs font-bold text-zinc-900 dark:text-white flex items-center gap-2">
            <Youtube className="h-4 w-4 text-red-500" />
            <span>Paste YouTube Video URL</span>
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              placeholder="https://www.youtube.com/watch?v=..."
              className="flex-1 rounded-2xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-950 px-4 py-3 text-xs text-zinc-900 dark:text-white outline-none focus:border-violet-500 font-medium"
            />
            <button
              onClick={handleExtractThumbnail}
              className="rounded-2xl bg-violet-600 px-6 py-3 text-xs font-bold text-white hover:bg-violet-700 transition"
            >
              Get Thumbnails
            </button>
          </div>
        </div>

        {extractedId && (
          <div className="space-y-4 pt-4 border-t border-zinc-100 dark:border-zinc-800">
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">Available Resolutions</span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 p-3 bg-zinc-50 dark:bg-zinc-950 space-y-2">
                <div className="aspect-video rounded-xl overflow-hidden bg-black">
                  <img
                    src={`https://img.youtube.com/vi/${extractedId}/maxresdefault.jpg`}
                    alt="HD Thumbnail"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex justify-between items-center pt-1">
                  <span className="text-xs font-bold">Ultra HD (1080p / 720p)</span>
                  <a
                    href={`https://img.youtube.com/vi/${extractedId}/maxresdefault.jpg`}
                    target="_blank"
                    rel="noreferrer"
                    download
                    className="px-3 py-1.5 rounded-xl bg-violet-600 text-white text-xs font-bold hover:bg-violet-700"
                  >
                    View & Save
                  </a>
                </div>
              </div>

              <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 p-3 bg-zinc-50 dark:bg-zinc-950 space-y-2">
                <div className="aspect-video rounded-xl overflow-hidden bg-black">
                  <img
                    src={`https://img.youtube.com/vi/${extractedId}/hqdefault.jpg`}
                    alt="Standard Thumbnail"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex justify-between items-center pt-1">
                  <span className="text-xs font-bold">Standard HQ</span>
                  <a
                    href={`https://img.youtube.com/vi/${extractedId}/hqdefault.jpg`}
                    target="_blank"
                    rel="noreferrer"
                    download
                    className="px-3 py-1.5 rounded-xl bg-violet-600 text-white text-xs font-bold hover:bg-violet-700"
                  >
                    View & Save
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  if (isMoney) {
    return (
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 sm:p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-5">
            <div>
              <div className="flex justify-between text-xs font-bold mb-1">
                <span>Estimated Daily Views</span>
                <span className="text-red-500 font-extrabold">{dailyViews.toLocaleString()} views/day</span>
              </div>
              <input
                type="range"
                min="1000"
                max="500000"
                step="2000"
                value={dailyViews}
                onChange={(e) => setDailyViews(Number(e.target.value))}
                className="w-full accent-red-500"
              />
            </div>
            <div>
              <div className="flex justify-between text-xs font-bold mb-1">
                <span>Estimated RPM / CPM ($ per 1,000 views)</span>
                <span className="text-red-500 font-extrabold">${rpm.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="15"
                step="0.25"
                value={rpm}
                onChange={(e) => setRpm(Number(e.target.value))}
                className="w-full accent-red-500"
              />
            </div>
          </div>

          <div className="rounded-2xl bg-zinc-50 dark:bg-zinc-950 p-6 border flex flex-col justify-between">
            <div className="space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">Projected Creator Revenue</span>
              <div className="flex justify-between text-xs">
                <span className="text-zinc-500">Monthly Views:</span>
                <span className="font-bold text-zinc-900 dark:text-white">{monthlyViews.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-zinc-500">Estimated Monthly Income:</span>
                <span className="font-bold text-emerald-600">+${monthlyEarnings.toLocaleString()}</span>
              </div>
              <div className="pt-3 border-t flex justify-between items-baseline">
                <span className="text-sm font-bold">Estimated Annual Earnings:</span>
                <span className="text-2xl font-black text-red-600 dark:text-red-500">
                  ${yearlyEarnings.toLocaleString()}
                </span>
              </div>
            </div>
            <p className="text-[11px] text-zinc-400 mt-4">Calculated locally using live creator monetization metrics.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 sm:p-8 space-y-5">
      <div className="space-y-2">
        <label className="text-xs font-bold text-zinc-900 dark:text-white flex items-center gap-2">
          <Tag className="h-4 w-4 text-violet-600" />
          <span>Enter Video Topic or Focus Keyword</span>
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="e.g. Next.js SaaS Tutorial, Fitness Workout, etc."
            className="flex-1 rounded-2xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-950 px-4 py-3 text-xs text-zinc-900 dark:text-white outline-none focus:border-violet-500 font-medium"
          />
          <button
            onClick={handleGenerateTags}
            className="rounded-2xl bg-violet-600 px-6 py-3 text-xs font-bold text-white hover:bg-violet-700 transition"
          >
            Generate Tags
          </button>
        </div>
      </div>

      {generatedTags.length > 0 && (
        <div className="space-y-3 pt-3 border-t border-zinc-100 dark:border-zinc-800">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">
              Generated Tags ({generatedTags.length})
            </span>
            <button
              onClick={() => {
                navigator.clipboard.writeText(generatedTags.join(', '));
                alert('Tags copied to clipboard!');
              }}
              className="text-xs font-bold text-violet-600 hover:underline"
            >
              Copy All Tags
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {generatedTags.map((tag, i) => (
              <span
                key={i}
                className="px-3 py-1.5 rounded-xl bg-violet-50 dark:bg-violet-950/40 border border-violet-200 dark:border-violet-900 text-violet-700 dark:text-violet-300 text-xs font-semibold"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ----------------------------------------------------
// 5. DEDICATED FINANCE & CALCULATOR ENGINE
// ----------------------------------------------------
function UtilityEngine({ toolSlug, toolName, category }: { toolSlug: string; toolName: string; category: string }) {
  const [input, setInput] = useState('');
  const [second, setSecond] = useState('');
  const [replacement, setReplacement] = useState('');
  const [value, setValue] = useState(100);
  const [rate, setRate] = useState(10);
  const [result, setResult] = useState('');
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');

  const run = () => {
    try {
      if (category === 'Text' || category === 'Developer') {
        if (toolSlug === 'word-character-counter') {
          const words = input.trim() ? input.trim().split(/\s+/).length : 0;
          setResult(`Words: ${words}\nCharacters: ${input.length}\nCharacters (no spaces): ${input.replace(/\s/g, '').length}\nLines: ${input ? input.split(/\r?\n/).length : 0}`);
        } else if (toolSlug === 'text-case-converter') setResult(input.replace(/(^|\s)\S/g, m => m.toUpperCase()).replace(/\s+/g, ' ').trim());
        else if (toolSlug === 'remove-duplicate-lines') setResult(Array.from(new Set(input.split(/\r?\n/))).join('\n'));
        else if (toolSlug === 'reverse-text-mirror-tool') setResult(input.split('').reverse().join(''));
        else if (toolSlug === 'strip-html-tags') { const el=document.createElement('div'); el.innerHTML=input; setResult(el.textContent || ''); }
        else if (toolSlug === 'find-replace-text') { if (!second) throw new Error('Enter text to find.'); setResult(input.split(second).join(replacement)); }
        else if (toolSlug === 'alphabetical-line-sorter') setResult(input.split(/\r?\n/).sort((a,b)=>a.localeCompare(b)).join('\n'));
        else if (toolSlug === 'json-formatter-validator') { const obj=JSON.parse(input); setResult(JSON.stringify(obj,null,2)); }
        else if (toolSlug === 'base64-encoder-decoder') setResult(mode==='encode' ? btoa(unescape(encodeURIComponent(input))) : decodeURIComponent(escape(atob(input))));
        else if (toolSlug === 'url-component-encoder-decoder') setResult(mode==='encode' ? encodeURIComponent(input) : decodeURIComponent(input));
        else if (toolSlug === 'clean-url-slug-generator') setResult(input.toLowerCase().trim().replace(/[^a-z0-9\s-]/g,'').replace(/\s+/g,'-').replace(/-+/g,'-'));
        else if (toolSlug === 'html-entity-encoder') { const el=document.createElement('div'); el.textContent=input; setResult(el.innerHTML); }
        else if (toolSlug === 'css-minifier-cleaner') setResult(input.replace(/\/\*[\s\S]*?\*\//g,'').replace(/\s+/g,' ').replace(/\s*([{}:;,>])\s*/g,'$1').trim());
        else if (toolSlug === 'unix-timestamp-converter') { const n=Number(input); setResult(Number.isFinite(n) ? new Date(n < 1e12 ? n*1000 : n).toISOString() : String(Math.floor(Date.now()/1000))); }
        else if (toolSlug === 'hex-to-rgb-hsl-converter') { const h=input.replace('#',''); const n=parseInt(h,16); setResult(`rgb(${(n>>16)&255}, ${(n>>8)&255}, ${n&255})`); }
        else if (toolSlug === 'jwt-token-inspector') { const part=input.split('.')[1]; if(!part) throw new Error('Invalid JWT'); setResult(JSON.stringify(JSON.parse(atob(part.replace(/-/g,'+').replace(/_/g,'/'))),null,2)); }
        else if (toolSlug === 'uuid-guid-v4-generator') setResult(crypto.randomUUID());
        else if (toolSlug === 'strong-password-generator') { const chars='ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%^&*'; const a=new Uint32Array(20); crypto.getRandomValues(a); setResult(Array.from(a,x=>chars[x%chars.length]).join('')); }
        else if (toolSlug === 'user-agent-string-parser') setResult(navigator.userAgent);
        else if (toolSlug === 'lorem-ipsum-generator') setResult('Lorem ipsum dolor sit amet, consectetur adipiscing elit. '.repeat(Math.max(1,Math.min(10,Number(value)||1))).trim());
        else if (toolSlug === 'reverse-text-mirror-tool') setResult(input.split('').reverse().join(''));
        else setResult(input);
      } else if (category === 'Converters') {
        const n=Number(input); if(!Number.isFinite(n)) throw new Error('Enter a valid number.');
        const maps:any={
          'unit-length-converter': n*3.280839895,
          'weight-mass-converter': n*2.2046226218,
          'temperature-converter': (n*9/5)+32,
          'data-size-converter': n*1024*1024,
          'speed-velocity-converter': n*0.6213711922,
          'time-duration-converter': n/3600,
          'area-land-converter': n*10.763910417,
          'pressure-unit-converter': n*14.5037738,
          'energy-work-converter': n*0.239005736,
          'power-wattage-converter': n*0.00134102209,
        };
        setResult(String(maps[toolSlug] ?? n));
      } else if (category === 'Calculators') {
        const p=value, r=rate/100, t=Math.max(0,Number(second)||1);
        let x=0;
        if(toolSlug==='simple-interest-calculator') x=p*r*t;
        else if(toolSlug==='compound-interest-calculator') x=p*Math.pow(1+r,t)-p;
        else if(toolSlug==='percentage-calculator') x=p*r;
        else if(toolSlug==='discount-calculator') x=p-(p*r);
        else if(toolSlug==='tip-calculator') x=p*r;
        else if(toolSlug==='bmi-calculator') x=p/Math.pow(Math.max(0.01,t/100),2);
        else x=p;
        setResult(x.toFixed(2));
      } else setResult(input);
    } catch(e:any) { setResult(`Error: ${e.message || 'Invalid input'}`); }
  };

  const textMode = category==='Text' || category==='Developer';
  return <div className="rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 sm:p-8 space-y-5">
    <div className="flex items-center justify-between gap-3"><div><h3 className="font-bold text-zinc-900 dark:text-white">{toolName}</h3><p className="text-xs text-zinc-400 mt-1">Runs locally in your browser.</p></div>{(toolSlug.includes('base64')||toolSlug.includes('url-component'))&&<div className="flex gap-2">{(['encode','decode'] as const).map(m=><button key={m} onClick={()=>setMode(m)} className={`px-3 py-2 rounded-xl text-xs font-bold ${mode===m?'bg-violet-600 text-white':'bg-zinc-100 dark:bg-zinc-800'}`}>{m}</button>)}</div>}</div>
    {textMode ? <><textarea value={input} onChange={e=>setInput(e.target.value)} placeholder="Enter or paste your content…" className="w-full min-h-48 rounded-2xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-950 p-4 text-sm outline-none focus:border-violet-500" />{toolSlug==='find-replace-text'&&<div className="grid sm:grid-cols-2 gap-3"><input value={second} onChange={e=>setSecond(e.target.value)} placeholder="Find text" className="w-full rounded-xl border p-3 text-sm bg-zinc-50 dark:bg-zinc-950" /><input value={replacement} onChange={e=>setReplacement(e.target.value)} placeholder="Replace with" className="w-full rounded-xl border p-3 text-sm bg-zinc-50 dark:bg-zinc-950" /></div>}</> : <div className="grid sm:grid-cols-2 gap-3"><input type="number" value={value} onChange={e=>setValue(Number(e.target.value))} className="rounded-xl border p-3 text-sm bg-zinc-50 dark:bg-zinc-950" /><input type="number" value={rate} onChange={e=>setRate(Number(e.target.value))} className="rounded-xl border p-3 text-sm bg-zinc-50 dark:bg-zinc-950" placeholder="Rate / %" /></div>}
    <button onClick={run} className="rounded-2xl bg-violet-600 px-6 py-3.5 text-xs font-bold text-white">Run {toolName}</button>
    {result && <pre className="whitespace-pre-wrap rounded-2xl bg-zinc-950 text-zinc-100 p-5 text-sm overflow-auto">{result}</pre>}
  </div>;
}

function DedicatedFinanceEngine({ toolSlug, toolName }: { toolSlug: string; toolName: string }) {
  const [amount, setAmount] = useState(5000);
  const [rate, setRate] = useState(12);
  const [years, setYears] = useState(10);

  const i = rate / 12 / 100;
  const n = years * 12;
  const invested = amount * n;
  const total = Math.round(amount * ((Math.pow(1 + i, n) - 1) / i) * (1 + i));
  const returns = total - invested;

  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 sm:p-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-5">
          <div>
            <div className="flex justify-between text-xs font-bold mb-1">
              <span>Principal Amount / Monthly Deposit</span>
              <span className="text-violet-600 font-extrabold">${amount.toLocaleString()}</span>
            </div>
            <input
              type="range"
              min="500"
              max="100000"
              step="500"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="w-full accent-violet-600"
            />
          </div>
          <div>
            <div className="flex justify-between text-xs font-bold mb-1">
              <span>Expected Annual Interest / Return Rate (%)</span>
              <span className="text-violet-600 font-extrabold">{rate}%</span>
            </div>
            <input
              type="range"
              min="1"
              max="30"
              step="0.5"
              value={rate}
              onChange={(e) => setRate(Number(e.target.value))}
              className="w-full accent-violet-600"
            />
          </div>
          <div>
            <div className="flex justify-between text-xs font-bold mb-1">
              <span>Duration (Years)</span>
              <span className="text-violet-600 font-extrabold">{years} Years</span>
            </div>
            <input
              type="range"
              min="1"
              max="35"
              value={years}
              onChange={(e) => setYears(Number(e.target.value))}
              className="w-full accent-violet-600"
            />
          </div>
        </div>

        <div className="rounded-2xl bg-zinc-50 dark:bg-zinc-950 p-6 border flex flex-col justify-between">
          <div className="space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">Calculation Summary</span>
            <div className="flex justify-between text-xs">
              <span className="text-zinc-500">Invested Capital:</span>
              <span className="font-bold text-zinc-900 dark:text-white">${invested.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-zinc-500">Estimated Returns:</span>
              <span className="font-bold text-emerald-600">+${returns.toLocaleString()}</span>
            </div>
            <div className="pt-3 border-t flex justify-between items-baseline">
              <span className="text-sm font-bold">Total Maturity Value:</span>
              <span className="text-2xl font-black text-violet-600 dark:text-violet-400">
                ${total.toLocaleString()}
              </span>
            </div>
          </div>
          <p className="text-[11px] text-zinc-400 mt-4">Calculated locally in browser memory.</p>
        </div>
      </div>
    </div>
  );
}

// ----------------------------------------------------
// MAIN DYNAMIC TOOL PAGE
// ----------------------------------------------------
export default function ToolPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = React.use(params);
  const tool = TOOLS_REGISTRY.find((t) => t.slug === slug);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && typeof (window as Window & { gtag?: (...args: unknown[]) => void }).gtag === 'function') {
      (window as Window & { gtag?: (...args: unknown[]) => void }).gtag!('event', 'tool_view', {
        tool_slug: tool?.slug,
        tool_name: tool?.name,
        tool_category: tool?.category,
      });
    }
  }, [tool?.slug, tool?.name, tool?.category]);

  if (!tool) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Tool not found.</p>
      </div>
    );
  }

  const companionTools = TOOLS_REGISTRY
    .filter((t) => t.category === tool.category && t.slug !== tool.slug)
    .map((candidate) => {
      const sourceTerms = new Set(
        (tool.targetKeyword || tool.name)
          .toLowerCase()
          .split(/[^a-z0-9]+/)
          .filter((term) => term.length > 2)
      );
      const candidateTerms = (candidate.targetKeyword || candidate.name)
        .toLowerCase()
        .split(/[^a-z0-9]+/)
        .filter((term) => term.length > 2);
      const overlap = candidateTerms.filter((term) => sourceTerms.has(term)).length;
      return { candidate, overlap };
    })
    .sort((a, b) => b.overlap - a.overlap || a.candidate.name.localeCompare(b.candidate.name))
    .slice(0, 4)
    .map(({ candidate }) => candidate);

  const toolFaqs = [
    {
      q: `Are my files or inputs safe while using ${tool.name}?`,
      a: tool.category === 'Compiler' ? `SQL and browser-preview operations can run locally, while compiled languages may use the configured execution runtime. Do not submit passwords, API keys, or other sensitive secrets as source code.` : `For browser-based tools, processing is performed in your browser where supported. Your selected files are not intentionally uploaded by the tool engine.`,
    },
    {
      q: `Is ${tool.name} free to use?`,
      a: `${tool.name} is available without a paid account. Browser, device-memory, file-size, or third-party runtime limits can still apply depending on the tool.`,
    },
    {
      q: `Can I use ${tool.name} on mobile or tablet devices?`,
      a: `The interface is responsive and works in modern desktop and mobile browsers. Large files and compute-heavy operations may perform differently depending on the device.`,
    },
  ];

  const renderEngine = () => {
    return <ToolEngineRunner tool={tool} />;
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 flex flex-col justify-between">
      <div>
        <Navbar />

        {/* Clean Header Without Any Security Pill Badge */}
        <div className="relative overflow-hidden border-b border-zinc-200/70 dark:border-white/10 bg-white dark:bg-zinc-950">
          <div className="absolute inset-0 tool-premium-grid opacity-70 dark:opacity-40" />
          <div className="absolute -top-24 right-10 h-56 w-56 rounded-full bg-violet-500/10 blur-3xl" />
          <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-12 lg:py-14">
            <div className="inline-flex items-center gap-2 rounded-full border border-violet-200/80 dark:border-violet-400/20 bg-violet-50/80 dark:bg-violet-950/30 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-violet-700 dark:text-violet-300">
              <span className="h-1.5 w-1.5 rounded-full bg-violet-500 shadow-[0_0_10px_rgba(124,58,237,.7)]" />
              {tool.category} Tool
            </div>
            <h1 className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-black tracking-[-0.03em] text-zinc-950 dark:text-white">
              {tool.name}
            </h1>
            <p className="mt-3 text-sm sm:text-base text-zinc-500 dark:text-zinc-400 max-w-3xl leading-7">
              {tool.description}
            </p>
          </div>
        </div>

        {/* Workspace Runner */}
        <main className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-12">
          {renderEngine()}

          <ToolSeoContent tool={tool} />

          {/* Related Companion Tools */}
          <div className="mt-14">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-sm sm:text-base font-bold text-zinc-950 dark:text-white">
                Related {tool.category} Tools
              </h2>
              <Link
                href={`/?category=${encodeURIComponent(tool.category)}#tools`}
                className="text-xs font-bold text-violet-600 dark:text-violet-400 hover:underline flex items-center gap-1"
              >
                Explore all {tool.category} tools <ArrowRight className="h-3 w-3" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {companionTools.map((comp) => (
                <Link
                  key={comp.slug}
                  href={`/tools/${comp.slug}`}
                  className="rounded-2xl border border-zinc-200/90 dark:border-zinc-800/80 bg-white dark:bg-zinc-900 p-4 hover:border-violet-500 dark:hover:border-violet-400 transition-all hover:-translate-y-0.5 group shadow-sm"
                >
                  <p className="text-xs font-bold text-zinc-900 dark:text-white group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors truncate">
                    {comp.name}
                  </p>
                  <p className="text-[11px] text-zinc-400 line-clamp-2 mt-1.5 font-normal leading-relaxed">
                    {comp.description}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
}
