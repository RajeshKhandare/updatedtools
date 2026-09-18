'use client';

import React, { useEffect, useRef, useState } from 'react';
import QRCode from 'qrcode';

const card =
  'w-full max-w-5xl mx-auto rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 sm:p-8 space-y-5';

const input =
  'w-full rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 px-4 py-3 text-sm text-zinc-900 dark:text-white';

function download(url: string, name: string) {
  const a = document.createElement('a');
  a.href = url;
  a.download = name;
  a.click();
}

export default function ImageEngine({
  toolSlug,
  toolName,
}: {
  toolSlug: string;
  toolName: string;
}) {
  const [file, setFile] = useState<File | null>(null);
  const [src, setSrc] = useState('');
  const [quality, setQuality] = useState(85);
  const [width, setWidth] = useState(1200);
  const [height, setHeight] = useState(800);
  const [ratio, setRatio] = useState('free');
  const [x, setX] = useState(50);
  const [y, setY] = useState(50);
  const [angle, setAngle] = useState(0);
  const [flip, setFlip] = useState('none');
  const [text, setText] = useState('https://example.com');
  const [output, setOutput] = useState('');
  const [palette, setPalette] = useState<string[]>([]);
  const [message, setMessage] = useState('');

  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!file) return;

    if (file.size > 50 * 1024 * 1024) {
      setMessage('Image must be 50 MB or smaller.');
      setSrc('');
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      setSrc(String(reader.result));
      setMessage('');
      setOutput('');
      setPalette([]);
    };

    reader.onerror = () => {
      setMessage('Could not read the selected image.');
    };

    reader.readAsDataURL(file);
  }, [file]);

  const make = async () => {
    setMessage('');

    try {
      if (toolSlug === 'instant-qr-code-generator') {
        const qr = await QRCode.toDataURL(text || 'https://example.com', {
          width: 1000,
          margin: 2,
        });

        setOutput(qr);
        return;
      }

      if (!src) {
        setMessage('Choose an image first.');
        return;
      }

      const img = new Image();

      img.onload = () => {
        const ow = img.width;
        const oh = img.height;

        let tw = ow;
        let th = oh;

        if (toolSlug === 'image-resizer') {
          tw = Math.max(1, Math.floor(width));
          th = Math.max(1, Math.floor(height));
        } else if (toolSlug === 'crop-image-online') {
          const ar =
            ratio === '1:1'
              ? 1
              : ratio === '4:3'
                ? 4 / 3
                : ratio === '16:9'
                  ? 16 / 9
                  : ow / oh;

          if (ratio !== 'free') {
            if (ow / oh > ar) {
              th = oh;
              tw = Math.max(1, Math.round(oh * ar));
            } else {
              tw = ow;
              th = Math.max(1, Math.round(ow / ar));
            }
          } else {
            tw = Math.min(Math.max(1, width), ow);
            th = Math.min(Math.max(1, height), oh);
          }
        }

        const c = canvas.current;

        if (!c) {
          setMessage('Browser canvas is unavailable.');
          return;
        }

        c.width = tw;
        c.height = th;

        const ctx = c.getContext('2d');

        if (!ctx) {
          setMessage('Could not create image processing context.');
          return;
        }

        ctx.clearRect(0, 0, tw, th);

        let filter = 'none';

        if (toolSlug === 'black-and-white-image-filter') {
          filter = 'grayscale(1)';
        }

        if (toolSlug === 'invert-image-colors') {
          filter = 'invert(1)';
        }

        if (toolSlug === 'image-blur-filter') {
          filter = 'blur(8px)';
        }

        ctx.filter = filter;

        ctx.save();

        ctx.translate(tw / 2, th / 2);

        ctx.rotate((angle * Math.PI) / 180);

        ctx.scale(
          flip === 'horizontal' ? -1 : 1,
          flip === 'vertical' ? -1 : 1
        );

        ctx.translate(-tw / 2, -th / 2);

        let sx = 0;
        let sy = 0;
        let sw = ow;
        let sh = oh;

        if (toolSlug === 'crop-image-online') {
          sw = tw;
          sh = th;

          sx = Math.round(((ow - sw) * x) / 100);
          sy = Math.round(((oh - sh) * y) / 100);

          sx = Math.max(0, Math.min(sx, ow - sw));
          sy = Math.max(0, Math.min(sy, oh - sh));
        }

        ctx.drawImage(
          img,
          sx,
          sy,
          sw,
          sh,
          0,
          0,
          tw,
          th
        );

        ctx.restore();

        const pngTools = [
          'webp-to-png-converter',
          'jpg-to-png-converter',
          'svg-to-png-converter',
        ];

        const jpegTools = [
          'webp-to-jpg-converter',
          'png-to-jpg-converter',
          'compress-image',
        ];

        let type = 'image/jpeg';

        if (pngTools.includes(toolSlug)) {
          type = 'image/png';
        }

        if (jpegTools.includes(toolSlug)) {
          type = 'image/jpeg';
        }

        if (
          !pngTools.includes(toolSlug) &&
          !jpegTools.includes(toolSlug)
        ) {
          type = file?.type === 'image/png'
            ? 'image/png'
            : 'image/jpeg';
        }

        const url = c.toDataURL(
          type,
          Math.min(1, Math.max(0.1, quality / 100))
        );

        setOutput(url);

        if (toolSlug === 'image-color-palette-extractor') {
          try {
            const paletteCanvas = document.createElement('canvas');
            const paletteWidth = Math.min(300, tw);
            const paletteHeight = Math.max(
              1,
              Math.round((th / tw) * paletteWidth)
            );

            paletteCanvas.width = paletteWidth;
            paletteCanvas.height = paletteHeight;

            const paletteCtx =
              paletteCanvas.getContext('2d');

            if (!paletteCtx) {
              setPalette([]);
              return;
            }

            paletteCtx.drawImage(
              img,
              0,
              0,
              paletteWidth,
              paletteHeight
            );

            const imageData = paletteCtx.getImageData(
              0,
              0,
              paletteWidth,
              paletteHeight
            ).data;

            const map = new Map<string, number>();

            for (
              let i = 0;
              i < imageData.length;
              i += 40
            ) {
              const r =
                Math.round(imageData[i] / 16) * 16;

              const g =
                Math.round(imageData[i + 1] / 16) * 16;

              const b =
                Math.round(imageData[i + 2] / 16) * 16;

              const key = `${r},${g},${b}`;

              map.set(
                key,
                (map.get(key) || 0) + 1
              );
            }

            const colors = Array.from(map.entries())
              .sort((a, b) => b[1] - a[1])
              .slice(0, 8)
              .map(([key]) => {
                const parts = key.split(',').map(Number);

                return (
                  '#' +
                  parts
                    .map((value) =>
                      value
                        .toString(16)
                        .padStart(2, '0')
                    )
                    .join('')
                );
              });

            setPalette(colors);
          } catch {
            setPalette([]);
          }
        }
      };

      img.onerror = () => {
        setMessage(
          'Could not decode this image. Please choose a valid image file.'
        );
      };

      img.src = src;
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : 'Image processing failed.'
      );
    }
  };

  const accept =
    toolSlug === 'svg-to-png-converter'
      ? '.svg,image/svg+xml'
      : 'image/*';

  if (toolSlug === 'instant-qr-code-generator') {
    return (
      <div className={card}>
        <h3 className="text-lg font-bold">
          {toolName}
        </h3>

        <input
          className={input}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Text or URL"
        />

        {message && (
          <p className="text-sm text-rose-500">
            {message}
          </p>
        )}

        <button
          className="rounded-xl bg-violet-600 px-5 py-2.5 text-xs font-bold text-white hover:bg-violet-700"
          onClick={make}
        >
          Generate QR
        </button>

        {output && (
          <div>
            <img
              className="max-w-xs rounded-2xl border"
              src={output}
              alt="Generated QR code"
            />

            <button
              className="mt-3 rounded-xl border px-4 py-2 text-xs"
              onClick={() =>
                download(output, 'qrcode.png')
              }
            >
              Download
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={card}>
      <h3 className="text-lg font-bold">
        {toolName}
      </h3>

      <input
        type="file"
        accept={accept}
        onChange={(e) =>
          setFile(e.target.files?.[0] || null)
        }
        className="text-sm"
      />

      {message && (
        <p className="text-sm text-rose-500">
          {message}
        </p>
      )}

      {src && (
        <div className="grid sm:grid-cols-2 gap-3">
          {[
            'image-resizer',
            'crop-image-online',
          ].includes(toolSlug) && (
            <>
              <input
                className={input}
                type="number"
                min="1"
                value={width}
                onChange={(e) =>
                  setWidth(Number(e.target.value))
                }
                placeholder="Width"
              />

              <input
                className={input}
                type="number"
                min="1"
                value={height}
                onChange={(e) =>
                  setHeight(Number(e.target.value))
                }
                placeholder="Height"
              />
            </>
          )}

          {toolSlug === 'crop-image-online' && (
            <>
              <select
                className={input}
                value={ratio}
                onChange={(e) =>
                  setRatio(e.target.value)
                }
              >
                <option value="free">Free</option>
                <option value="1:1">1:1</option>
                <option value="4:3">4:3</option>
                <option value="16:9">16:9</option>
              </select>

              <label className="text-xs text-zinc-500">
                Horizontal position
                <input
                  className="w-full"
                  type="range"
                  min="0"
                  max="100"
                  value={x}
                  onChange={(e) =>
                    setX(Number(e.target.value))
                  }
                />
              </label>

              <label className="text-xs text-zinc-500">
                Vertical position
                <input
                  className="w-full"
                  type="range"
                  min="0"
                  max="100"
                  value={y}
                  onChange={(e) =>
                    setY(Number(e.target.value))
                  }
                />
              </label>
            </>
          )}

          {toolSlug === 'flip-rotate-image' && (
            <>
              <select
                className={input}
                value={flip}
                onChange={(e) =>
                  setFlip(e.target.value)
                }
              >
                <option value="none">
                  No flip
                </option>

                <option value="horizontal">
                  Flip horizontal
                </option>

                <option value="vertical">
                  Flip vertical
                </option>
              </select>

              <input
                className={input}
                type="number"
                step="90"
                value={angle}
                onChange={(e) =>
                  setAngle(Number(e.target.value))
                }
                placeholder="Rotation angle"
              />
            </>
          )}

          {[
            'compress-image',
            'webp-to-jpg-converter',
            'png-to-jpg-converter',
          ].includes(toolSlug) && (
            <label className="text-xs text-zinc-500">
              Quality: {quality}%
              <input
                className="w-full"
                type="range"
                min="10"
                max="100"
                value={quality}
                onChange={(e) =>
                  setQuality(Number(e.target.value))
                }
              />
            </label>
          )}
        </div>
      )}

      <button
        className="rounded-xl bg-violet-600 px-5 py-2.5 text-xs font-bold text-white hover:bg-violet-700"
        onClick={make}
      >
        Process {toolName}
      </button>

      <canvas
        ref={canvas}
        className="hidden"
      />

      {output && (
        <div>
          <img
            className="max-h-96 max-w-full rounded-2xl border"
            src={output}
            alt="Processed output"
          />

          <button
            className="mt-3 rounded-xl border px-4 py-2 text-xs"
            onClick={() =>
              download(
                output,
                `${toolSlug}.${
                  output.startsWith('data:image/png')
                    ? 'png'
                    : 'jpg'
                }`
              )
            }
          >
            Download
          </button>
        </div>
      )}

      {palette.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {palette.map((color) => (
            <div
              key={color}
              className="rounded-xl border px-3 py-2 text-xs font-mono"
            >
              {color}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
