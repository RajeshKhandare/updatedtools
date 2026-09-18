import fs from 'node:fs';
const registry=fs.readFileSync('data/toolsRegistry.ts','utf8');
const slugs=[...registry.matchAll(/slug:\s*'([^']+)'/g)].map(m=>m[1]);
const categories=[...registry.matchAll(/category:\s*'([^']+)'/g)].map(m=>m[1]);
const counts={}; for(const c of categories) counts[c]=(counts[c]||0)+1;
if(slugs.length!==88||new Set(slugs).size!==88) throw new Error(`Expected 88 unique tools; found ${slugs.length} / ${new Set(slugs).size}`);

const names=[...registry.matchAll(/name:\s*'([^']+)'/g)].map(m=>m[1]);
const descriptions=[...registry.matchAll(/description:\s*'([^']*)'/g)].map(m=>m[1]);
const targetKeywords=[...registry.matchAll(/targetKeyword:\s*'([^']+)'/g)].map(m=>m[1]);
if(names.length!==88||descriptions.length!==88||targetKeywords.length!==88) throw new Error(`Expected 88 names, descriptions, and target keywords; found ${names.length}, ${descriptions.length}, ${targetKeywords.length}`);
if(descriptions.some(d=>d.trim().length<30)) throw new Error('Every tool description must contain at least 30 characters');
if(targetKeywords.some(k=>!k.trim())) throw new Error('Every tool must have a non-empty targetKeyword');
if(slugs.some(s=>!^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(s))) throw new Error('Every tool slug must be lowercase kebab-case');

const expectedCounts={PDF:14,Image:14,Compiler:8,Developer:12,Text:10,Converters:10,Calculators:9,Finance:7,YouTube:4};
for(const [category,expected] of Object.entries(expectedCounts)) if((counts[category]||0)!==expected) throw new Error(`Expected ${expected} ${category} tools; found ${counts[category]||0}`);

const runner=fs.readFileSync('components/ToolEngineRunner.tsx','utf8');
for(const c of ['PDF','Image','Compiler','Finance','Developer','Text','Converters','Calculators','YouTube']) if(!runner.includes(`'${c}'`)) throw new Error(`Runner missing ${c}`);
const all=[]; for(const dir of ['components','app']){ if(!fs.existsSync(dir)) continue; const walk=d=>{for(const e of fs.readdirSync(d,{withFileTypes:true})){const p=`${d}/${e.name}`; if(e.isDirectory())walk(p); else if(/\.(ts|tsx)$/.test(e.name)) all.push(p)}};walk(dir)}
const bad=[]; for(const f of all){const s=fs.readFileSync(f,'utf8'); if(/\beval\s*\(|\bnew\s+Function\s*\(|\bFunction\s*\(/.test(s))bad.push(f)}
if(bad.length) throw new Error(`Dynamic code execution found in: ${bad.join(', ')}`);
console.log(JSON.stringify({tools:slugs.length,uniqueSlugs:new Set(slugs).size,categoryCounts:counts,dynamicExecutionMatches:0},null,2));


const packageJson=JSON.parse(fs.readFileSync('package.json','utf8'));
if(packageJson.scripts?.postinstall!=='node scripts/copy-sql-wasm.mjs') throw new Error('postinstall must copy required WASM/browser assets');
const assetScript=fs.readFileSync('scripts/copy-sql-wasm.mjs','utf8');
for(const asset of ['sql-wasm.wasm','qpdf.wasm','pdf.worker.min.mjs']) if(!assetScript.includes(asset)) throw new Error(`Asset copy script missing ${asset}`);
console.log('Asset pipeline checks: OK');
