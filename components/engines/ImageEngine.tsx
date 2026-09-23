'use client';

import React, { useEffect, useRef, useState } from 'react';
import FileDropzone from '../FileDropzone';
import QRCode from 'qrcode';
import type { LocaleCode } from '@/data/internationalSeo';
import { getEngineUi } from '@/data/engineLocalization';

const card =
  'w-full max-w-5xl mx-auto rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 sm:p-8 space-y-5';

const input =
  'w-full rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 px-4 py-3 text-sm text-zinc-900 dark:text-white';


const IMAGE_LABELS: Record<LocaleCode, { width:string; height:string; free:string; horizontal:string; vertical:string; noFlip:string; flipHorizontal:string; flipVertical:string; rotation:string; quality:string; generateQr:string; qrAlt:string; processedAlt:string;preview:string }> = {
  en:{width:'Width',height:'Height',free:'Free',horizontal:'Horizontal position',vertical:'Vertical position',noFlip:'No flip',flipHorizontal:'Flip horizontal',flipVertical:'Flip vertical',rotation:'Rotation angle',quality:'Quality',generateQr:'Generate QR',qrAlt:'Generated QR code',processedAlt:'Processed output',preview:'Image preview'},
  pt:{width:'Largura',height:'Altura',free:'Livre',horizontal:'Posição horizontal',vertical:'Posição vertical',noFlip:'Sem inversão',flipHorizontal:'Inverter horizontalmente',flipVertical:'Inverter verticalmente',rotation:'Ângulo de rotação',quality:'Qualidade',generateQr:'Gerar QR',qrAlt:'Código QR gerado',processedAlt:'Resultado processado',preview:'Pré-visualização da imagem'},
  es:{width:'Ancho',height:'Alto',free:'Libre',horizontal:'Posición horizontal',vertical:'Posición vertical',noFlip:'Sin voltear',flipHorizontal:'Voltear horizontalmente',flipVertical:'Voltear verticalmente',rotation:'Ángulo de rotación',quality:'Calidad',generateQr:'Generar QR',qrAlt:'Código QR generado',processedAlt:'Resultado procesado',preview:'Vista previa de la imagen'},
  de:{width:'Breite',height:'Höhe',free:'Frei',horizontal:'Horizontale Position',vertical:'Vertikale Position',noFlip:'Nicht spiegeln',flipHorizontal:'Horizontal spiegeln',flipVertical:'Vertikal spiegeln',rotation:'Drehwinkel',quality:'Qualität',generateQr:'QR erstellen',qrAlt:'Generierter QR-Code',processedAlt:'Verarbeitetes Ergebnis',preview:'Bildvorschau'},
  fr:{width:'Largeur',height:'Hauteur',free:'Libre',horizontal:'Position horizontale',vertical:'Position verticale',noFlip:'Sans retournement',flipHorizontal:'Retourner horizontalement',flipVertical:'Retourner verticalement',rotation:'Angle de rotation',quality:'Qualité',generateQr:'Générer un QR',qrAlt:'Code QR généré',processedAlt:'Résultat traité',preview:'Aperçu de l’image'},
  it:{width:'Larghezza',height:'Altezza',free:'Libero',horizontal:'Posizione orizzontale',vertical:'Posizione verticale',noFlip:'Nessun ribaltamento',flipHorizontal:'Ribalta orizzontalmente',flipVertical:'Ribalta verticalmente',rotation:'Angolo di rotazione',quality:'Qualità',generateQr:'Genera QR',qrAlt:'Codice QR generato',processedAlt:'Risultato elaborato',preview:'Anteprima immagine'},
  ja:{width:'幅',height:'高さ',free:'自由',horizontal:'水平位置',vertical:'垂直位置',noFlip:'反転なし',flipHorizontal:'水平方向に反転',flipVertical:'垂直方向に反転',rotation:'回転角度',quality:'品質',generateQr:'QRを生成',qrAlt:'生成されたQRコード',processedAlt:'処理済み画像',preview:'画像プレビュー'},
  ko:{width:'너비',height:'높이',free:'자유',horizontal:'가로 위치',vertical:'세로 위치',noFlip:'뒤집지 않음',flipHorizontal:'가로로 뒤집기',flipVertical:'세로로 뒤집기',rotation:'회전 각도',quality:'품질',generateQr:'QR 생성',qrAlt:'생성된 QR 코드',processedAlt:'처리된 결과',preview:'이미지 미리보기'},
  zh:{width:'宽度',height:'高度',free:'自由',horizontal:'水平位置',vertical:'垂直位置',noFlip:'不翻转',flipHorizontal:'水平翻转',flipVertical:'垂直翻转',rotation:'旋转角度',quality:'质量',generateQr:'生成二维码',qrAlt:'生成的二维码',processedAlt:'处理后的结果',preview:'图片预览'},
  ru:{width:'Ширина',height:'Высота',free:'Свободно',horizontal:'Горизонтальное положение',vertical:'Вертикальное положение',noFlip:'Без отражения',flipHorizontal:'Отразить по горизонтали',flipVertical:'Отразить по вертикали',rotation:'Угол поворота',quality:'Качество',generateQr:'Создать QR',qrAlt:'Созданный QR-код',processedAlt:'Обработанный результат',preview:'Предпросмотр изображения'},
  ar:{width:'العرض',height:'الارتفاع',free:'حر',horizontal:'الموضع الأفقي',vertical:'الموضع الرأسي',noFlip:'بدون قلب',flipHorizontal:'قلب أفقي',flipVertical:'قلب رأسي',rotation:'زاوية الدوران',quality:'الجودة',generateQr:'إنشاء QR',qrAlt:'رمز QR المُنشأ',processedAlt:'النتيجة المعالجة',preview:'معاينة الصورة'},
  hi:{width:'चौड़ाई',height:'ऊँचाई',free:'फ्री',horizontal:'क्षैतिज स्थिति',vertical:'ऊर्ध्वाधर स्थिति',noFlip:'फ्लिप नहीं',flipHorizontal:'क्षैतिज फ्लिप',flipVertical:'ऊर्ध्वाधर फ्लिप',rotation:'रोटेशन कोण',quality:'क्वालिटी',generateQr:'QR जनरेट करें',qrAlt:'जनरेट किया गया QR कोड',processedAlt:'प्रोसेस किया गया परिणाम',preview:'इमेज प्रीव्यू'},
};

function download(url: string, name: string) {
  const a = document.createElement('a');
  a.href = url;
  a.download = name;
  a.click();
}

export default function ImageEngine({
  toolSlug,
  toolName,
  locale = 'en',
}: {
  toolSlug: string;
  toolName: string;
  locale?: LocaleCode;
}) {
  const ui = getEngineUi(locale);
  const labels = IMAGE_LABELS[locale];
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

    setSrc('');
    setOutput('');
    setPalette([]);
    setMessage('');

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
          placeholder={locale === "en" ? "Text or URL" : locale === "pt" ? "Texto ou URL" : locale === "es" ? "Texto o URL" : locale === "de" ? "Text oder URL" : locale === "fr" ? "Texte ou URL" : locale === "it" ? "Testo o URL" : locale === "ja" ? "テキストまたはURL" : locale === "ko" ? "텍스트 또는 URL" : locale === "zh" ? "文本或 URL" : locale === "ru" ? "Текст или URL" : locale === "ar" ? "نص أو رابط" : "टेक्स्ट या URL"}
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
              alt={labels.qrAlt}
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

      <FileDropzone
        accept={accept}
        label={ui.chooseImage}
        subtitle={ui.fileSubtitle}
        onFiles={(selected) => setFile(selected[0] || null)}
      />

      {message && (
        <p className="text-sm text-rose-500">
          {message}
        </p>
      )}

      {src && (
        <div className="rounded-2xl border border-zinc-200/80 bg-zinc-50/70 p-3 dark:border-zinc-800 dark:bg-zinc-950/60">
          <div className="mb-2 flex items-center justify-between gap-2">
            <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-200">{labels.preview}</span>
            {file && <span className="max-w-[65%] truncate text-[10px] text-zinc-400">{file.name}</span>}
          </div>
          <div className="flex min-h-40 items-center justify-center overflow-hidden rounded-xl border border-zinc-200 bg-white p-2 dark:border-zinc-800 dark:bg-zinc-900">
            <img
              data-testid="image-input-preview"
              src={src}
              alt={file?.name || labels.preview}
              className="max-h-72 max-w-full rounded-lg object-contain"
            />
          </div>
        </div>
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
                placeholder={labels.width}
              />

              <input
                className={input}
                type="number"
                min="1"
                value={height}
                onChange={(e) =>
                  setHeight(Number(e.target.value))
                }
                placeholder={labels.height}
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
                <option value="free">{labels.free}</option>
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
                  {labels.noFlip}
                </option>

                <option value="horizontal">
                  {labels.flipHorizontal}
                </option>

                <option value="vertical">
                  {labels.flipVertical}
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
                placeholder={labels.rotation}
              />
            </>
          )}

          {[
            'compress-image',
            'webp-to-jpg-converter',
            'png-to-jpg-converter',
          ].includes(toolSlug) && (
            <label className="text-xs text-zinc-500">
              {labels.quality}: {quality}%
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
        className="rounded-xl bg-violet-600 px-5 py-2.5 text-xs font-bold text-white hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-50"
        onClick={make}
        disabled={!src}
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
            alt={labels.processedAlt}
          />

          <button
            className="mt-3 rounded-xl border border-zinc-300 bg-white px-4 py-2 text-xs font-medium text-zinc-900 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white dark:hover:bg-zinc-700"
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
