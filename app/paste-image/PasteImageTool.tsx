'use client';

import { ChangeEvent, DragEvent, useCallback, useEffect, useRef, useState } from 'react';
import { ClipboardPaste, Download, ImagePlus, RefreshCw, ShieldCheck, Upload, X } from 'lucide-react';
import ImageGuide from './ImageGuide';

type OutputFormat = 'png' | 'jpeg' | 'webp';

const MIME_TYPES: Record<OutputFormat, string> = {
  png: 'image/png',
  jpeg: 'image/jpeg',
  webp: 'image/webp',
};

export default function PasteImageTool() {
  const [imageUrl, setImageUrl] = useState('');
  const [imageName, setImageName] = useState('pasted-image');
  const [format, setFormat] = useState<OutputFormat>('png');
  const [status, setStatus] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [dimensions, setDimensions] = useState<{ width: number; height: number } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const sourceBlobRef = useRef<Blob | null>(null);
  const objectUrlRef = useRef('');

  const loadImage = useCallback((file: File | Blob, name = 'pasted-image') => {
    if (!file.type.startsWith('image/')) {
      setStatus('Please choose a valid image file.');
      return;
    }
    if (file.size > 25 * 1024 * 1024) {
      setStatus('This image is larger than 25 MB. Please choose a smaller image.');
      return;
    }

    if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);
    const nextUrl = URL.createObjectURL(file);
    objectUrlRef.current = nextUrl;
    sourceBlobRef.current = file;
    setImageUrl(nextUrl);
    setImageName(name.replace(/\.[^.]+$/, '') || 'pasted-image');
    setDimensions(null);
    setStatus('Image ready. Choose a format and download it.');
  }, []);

  useEffect(() => {
    const onPaste = (event: ClipboardEvent) => {
      const items = Array.from(event.clipboardData?.items ?? []);
      const imageItem = items.find((item) => item.type.startsWith('image/'));
      const file = imageItem?.getAsFile();
      if (file) {
        event.preventDefault();
        loadImage(file, 'pasted-image');
      }
    };
    window.addEventListener('paste', onPaste);
    return () => {
      window.removeEventListener('paste', onPaste);
      if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);
    };
  }, [loadImage]);

  const onFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) loadImage(file, file.name);
    event.target.value = '';
  };

  const onDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    const file = Array.from(event.dataTransfer.files).find((item) => item.type.startsWith('image/'));
    if (file) loadImage(file, file.name);
    else setStatus('Drop an image file to continue.');
  };

  const clearImage = () => {
    if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);
    objectUrlRef.current = '';
    sourceBlobRef.current = null;
    setImageUrl('');
    setDimensions(null);
    setStatus('');
  };

  const downloadImage = async () => {
    const source = sourceBlobRef.current;
    if (!source || !imageUrl) {
      setStatus('Paste or select an image first.');
      return;
    }

    try {
      setStatus('Preparing your download…');
      const image = new Image();
      image.src = imageUrl;
      await new Promise<void>((resolve, reject) => {
        image.onload = () => resolve();
        image.onerror = () => reject(new Error('The image could not be opened.'));
      });

      const canvas = document.createElement('canvas');
      canvas.width = image.naturalWidth;
      canvas.height = image.naturalHeight;
      const context = canvas.getContext('2d');
      if (!context) throw new Error('Your browser could not process this image.');

      if (format === 'jpeg') {
        context.fillStyle = '#ffffff';
        context.fillRect(0, 0, canvas.width, canvas.height);
      }
      context.drawImage(image, 0, 0);
      const output = await new Promise<Blob | null>((resolve) =>
        canvas.toBlob(resolve, MIME_TYPES[format], format === 'jpeg' || format === 'webp' ? 0.92 : undefined),
      );
      if (!output) throw new Error('This format is not supported by your browser. Try PNG instead.');

      const url = URL.createObjectURL(output);
      const anchor = document.createElement('a');
      anchor.href = url;
      anchor.download = `${imageName}-toolployee.${format === 'jpeg' ? 'jpg' : format}`;
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      window.setTimeout(() => URL.revokeObjectURL(url), 1000);
      setStatus('Your image download has started.');
    } catch (error) {
      setStatus(error instanceof Error ? error.message : 'Unable to download this image. Please try again.');
    }
  };

  return (
    <main className="paste-shell">
      <header className="paste-header">
        <a className="paste-brand" href="https://toolployee.com/" aria-label="Toolployee home">
          <span className="paste-brand-mark"><ClipboardPaste size={19} /></span>
          <span>Toolployee</span>
        </a>
        <span className="paste-private"><ShieldCheck size={15} /> Private by design</span>
      </header>

      <section className="paste-main" aria-labelledby="paste-title">
        <div className="paste-eyebrow"><span /> FREE ONLINE IMAGE TOOL</div>
        <h1 id="paste-title">Paste image. Download instantly.</h1>
        <p className="paste-intro">Save screenshots and clipboard images as PNG, JPG, or WebP — without installing software.</p>

        {!imageUrl ? (
          <div
            className={`paste-dropzone${isDragging ? ' is-dragging' : ''}`}
            role="button"
            tabIndex={0}
            aria-label="Paste or choose an image"
            onClick={(event) => { if ((event.target as HTMLElement).closest('button')) return; fileInputRef.current?.click(); }}
            onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); fileInputRef.current?.click(); } }}
            onDragOver={(event) => { event.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={onDrop}
          >
            <div className="paste-icon"><ImagePlus size={30} strokeWidth={1.7} /></div>
            <h2>PASTE IMAGE TO DOWNLOAD</h2>
            <p>Use <kbd>Ctrl</kbd> + <kbd>V</kbd> (or <kbd>⌘</kbd> + <kbd>V</kbd> on Mac)</p>
            <span className="paste-or">You can also click me</span>
            <button type="button" className="paste-button paste-button-dark" onClick={() => fileInputRef.current?.click()}>
              <Upload size={16} /> Choose an image
            </button>
            <input ref={fileInputRef} className="paste-file-input" type="file" accept="image/*" onChange={onFileChange} aria-label="Choose an image file" />
            <span className="paste-file-note">Image files up to 25 MB</span>
          </div>
        ) : (
          <div className="paste-preview-card">
            <div className="paste-preview-top">
              <div className="paste-file-label"><span className="paste-file-dot" /> Image ready</div>
              <button type="button" className="paste-icon-button" onClick={clearImage} aria-label="Clear image"><X size={18} /></button>
            </div>
            <div className="paste-preview-stage">
              {/* The preview URL is generated locally from the selected image. */}
              <img
                src={imageUrl}
                alt="Preview of your pasted image"
                onLoad={(event) => setDimensions({ width: event.currentTarget.naturalWidth, height: event.currentTarget.naturalHeight })}
              />
            </div>
            <div className="paste-image-meta">
              <span className="paste-image-name">{imageName}</span>
              {dimensions && <span>{dimensions.width} × {dimensions.height}px</span>}
            </div>
            <div className="paste-download-row">
              <label htmlFor="paste-format">Download format</label>
              <select id="paste-format" value={format} onChange={(event) => setFormat(event.target.value as OutputFormat)}>
                <option value="png">PNG</option>
                <option value="jpeg">JPG</option>
                <option value="webp">WebP</option>
              </select>
              <button type="button" className="paste-button paste-button-dark" onClick={downloadImage}><Download size={16} /> Download image</button>
            </div>
            <button type="button" className="paste-reset-button" onClick={clearImage}><RefreshCw size={14} /> Paste another image</button>
          </div>
        )}

        <p className={`paste-status${status ? ' has-status' : ''}`} role="status" aria-live="polite">{status || 'Your image stays in your browser. It is not uploaded to our servers.'}</p>

        <div className="paste-benefits">
          <div><ShieldCheck size={18} /><span><strong>Private processing</strong><small>Images stay on your device</small></span></div>
          <div><RefreshCw size={18} /><span><strong>Three formats</strong><small>PNG, JPG and WebP</small></span></div>
          <div><Download size={18} /><span><strong>Instant download</strong><small>No account required</small></span></div>
        </div>
      </section>

      <ImageGuide />

      <footer className="paste-footer">
        <span>© {new Date().getFullYear()} Toolployee</span>
        <a href="https://toolployee.com/privacy-policy">Privacy</a>
        <a href="https://toolployee.com/">More free tools</a>
      </footer>
    </main>
  );
}
