import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const source = path.join(root, 'node_modules', 'sql.js', 'dist', 'sql-wasm.wasm');
const publicDir = path.join(root, 'public');
const target = path.join(publicDir, 'sql-wasm.wasm');

if (!fs.existsSync(source)) {
  console.warn('[sql.js] WASM file not found; skipping copy.');
  process.exit(0);
}

fs.mkdirSync(publicDir, { recursive: true });
fs.copyFileSync(source, target);
console.log('[sql.js] Copied sql-wasm.wasm to public/.');
