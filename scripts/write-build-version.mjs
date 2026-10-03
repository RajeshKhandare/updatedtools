import fs from 'node:fs';
import path from 'node:path';

const commit =
  process.env.WORKERS_CI_COMMIT_SHA ||
  process.env.GITHUB_SHA ||
  process.env.BUILD_SHA ||
  'cloudflare-test';

const outDir = path.resolve('out');
fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(
  path.join(outDir, 'build-version.json'),
  JSON.stringify({ commit }, null, 2) + '\n',
  'utf8',
);

console.log('Build version marker:', commit);
