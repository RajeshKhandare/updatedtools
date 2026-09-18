import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '..'
);

function copyAsset(source, target) {
  if (!fs.existsSync(source)) {
    console.warn(
      '[assets] Source not found; skipping: ' +
        source
    );
    return;
  }

  fs.mkdirSync(
    path.dirname(target),
    { recursive: true }
  );

  fs.copyFileSync(
    source,
    target
  );

  console.log(
    '[assets] Copied ' +
      path.basename(source) +
      ' to public/.'
  );
}

copyAsset(
  path.join(
    root,
    'node_modules',
    'sql.js',
    'dist',
    'sql-wasm.wasm'
  ),
  path.join(
    root,
    'public',
    'sql-wasm.wasm'
  )
);

copyAsset(
  path.join(
    root,
    'node_modules',
    'pdfstudio',
    'dist',
    'wasm',
    'qpdf.wasm'
  ),
  path.join(
    root,
    'public',
    'qpdf.wasm'
  )
);

copyAsset(
  path.join(
    root,
    'node_modules',
    'pdfjs-dist',
    'legacy',
    'build',
    'pdf.worker.min.mjs'
  ),
  path.join(
    root,
    'public',
    'pdf.worker.min.mjs'
  )
);
