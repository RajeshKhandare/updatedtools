import fs from 'node:fs';
const registry=fs.readFileSync('data/toolsRegistry.ts','utf8');
const slugs=[...registry.matchAll(/slug:\s*'([^']+)'/g)].map(m=>m[1]);
const categories=[...registry.matchAll(/category:\s*'([^']+)'/g)].map(m=>m[1]);
const counts={}; for(const c of categories) counts[c]=(counts[c]||0)+1;
if(slugs.length!==88||new Set(slugs).size!==88) throw new Error(`Expected 88 unique tools; found ${slugs.length} / ${new Set(slugs).size}`);
const runner=fs.readFileSync('components/ToolEngineRunner.tsx','utf8');
for(const c of ['PDF','Image','Compiler','Finance','Developer','Text','Converters','Calculators','YouTube']) if(!runner.includes(`'${c}'`)) throw new Error(`Runner missing ${c}`);
const all=[]; for(const dir of ['components','app']){ if(!fs.existsSync(dir)) continue; const walk=d=>{for(const e of fs.readdirSync(d,{withFileTypes:true})){const p=`${d}/${e.name}`; if(e.isDirectory())walk(p); else if(/\.(ts|tsx)$/.test(e.name)) all.push(p)}};walk(dir)}
const bad=[]; for(const f of all){const s=fs.readFileSync(f,'utf8'); if(/\beval\s*\(|\bnew\s+Function\s*\(|\bFunction\s*\(/.test(s))bad.push(f)}
if(bad.length) throw new Error(`Dynamic code execution found in: ${bad.join(', ')}`);
console.log(JSON.stringify({tools:slugs.length,uniqueSlugs:new Set(slugs).size,categoryCounts:counts,dynamicExecutionMatches:0},null,2));
