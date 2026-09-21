'use client';

import React, { useMemo, useState } from 'react';
import { Check, Copy, Download, RefreshCw } from 'lucide-react';
import { ToolMeta } from '@/data/toolsRegistry';
import type { LocaleCode } from '@/data/internationalSeo';
import { getEngineUi } from '@/data/engineLocalization';
import { getLocalizedToolName } from '@/data/internationalLocalization';

const card='relative w-full max-w-5xl mx-auto overflow-hidden rounded-[28px] border border-zinc-200/80 dark:border-white/10 bg-white/95 dark:bg-zinc-900/90 p-5 sm:p-7 lg:p-8 space-y-6 shadow-[0_24px_80px_-36px_rgba(0,0,0,0.55)] backdrop-blur-xl';
const input='w-full rounded-2xl border border-zinc-200/90 dark:border-white/10 bg-zinc-50/80 dark:bg-zinc-950/80 px-4 py-3.5 text-sm text-zinc-900 dark:text-white shadow-sm outline-none transition-all duration-200 placeholder:text-zinc-400 focus:border-violet-500/70 focus:ring-4 focus:ring-violet-500/10 focus:bg-white dark:focus:bg-zinc-950';
const button='inline-flex items-center justify-center gap-2 rounded-2xl bg-violet-600 px-5 py-3 text-xs font-bold text-white shadow-lg shadow-violet-600/20 transition-all duration-200 hover:-translate-y-0.5 hover:bg-violet-500 hover:shadow-violet-600/30 active:translate-y-0 disabled:opacity-50';
const secondary='inline-flex items-center justify-center gap-2 rounded-2xl border border-zinc-200/90 dark:border-white/10 bg-white/70 dark:bg-zinc-900/70 px-4 py-3 text-xs font-semibold text-zinc-700 dark:text-zinc-200 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-violet-400/50 hover:bg-violet-50 dark:hover:bg-violet-950/30 active:translate-y-0';
const resultPanel='rounded-2xl border border-zinc-200/80 dark:border-white/10 bg-zinc-50/80 dark:bg-zinc-950/80 p-5 shadow-inner';
const plainCard=card.replace(' shadow-[0_24px_80px_-36px_rgba(0,0,0,0.55)] backdrop-blur-xl','');

function n(v:string,f=0){
  const x=Number(v);
  return Number.isFinite(x)?x:f;
}

function fmt(v:number){
  return Number.isFinite(v)
    ? new Intl.NumberFormat('en-US',{maximumFractionDigits:8}).format(v)
    : ({en:'Invalid result',pt:'Resultado inválido',es:'Resultado no válido',de:'Ungültiges Ergebnis',fr:'Résultat invalide',it:'Risultato non valido',ja:'無効な結果',ko:'잘못된 결과',zh:'结果无效',ru:'Недопустимый результат',ar:'نتيجة غير صالحة',hi:'अमान्य परिणाम'} as Record<string,string>)[typeof document !== 'undefined' ? document.documentElement.lang : 'en'] || 'Invalid result';
}

function b64e(s:string){
  return btoa(unescape(encodeURIComponent(s)));
}

function b64d(s:string){
  return decodeURIComponent(escape(atob(s.trim())));
}

function downloadText(text:string,name:string,type='text/plain'){
  const blob=new Blob([text],{type});
  const url=URL.createObjectURL(blob);
  const a=document.createElement('a');
  a.href=url;
  a.download=name;
  a.click();
  setTimeout(()=>URL.revokeObjectURL(url),500);
}

function copySafe(text:string){
  return navigator.clipboard.writeText(text);
}

function escHtml(s:string){
  const el=document.createElement('textarea');
  el.textContent=s;
  return el.innerHTML;
}

function stripHtml(s:string){
  const el=document.createElement('div');
  el.innerHTML=s;
  return el.textContent||el.innerText||'';
}

function titleCase(s:string){
  return s.toLowerCase().replace(/\b\w/g,c=>c.toUpperCase());
}

function sentenceCase(s:string){
  return s.toLowerCase().replace(/(^|[.!?]\s+)([a-z])/g,(_,p,c)=>p+c.toUpperCase());
}

function camelCase(s:string){
  return s.trim().toLowerCase().split(/[^a-zA-Z0-9]+/).filter(Boolean).map((w,i)=>i?w[0].toUpperCase()+w.slice(1):w).join('');
}

function markdownToHtml(md:string){
  const e=escHtml(md);

  return e.split(/\n{2,}/).map(block=>{
    let x=block
      .replace(/^### (.*)$/gm,'<h3>$1</h3>')
      .replace(/^## (.*)$/gm,'<h2>$1</h2>')
      .replace(/^# (.*)$/gm,'<h1>$1</h1>')
      .replace(/\*\*(.+?)\*\*/g,'<strong>$1</strong>')
      .replace(/\*(.+?)\*/g,'<em>$1</em>')
      .replace(/`(.+?)`/g,'<code>$1</code>');

    const li=x.split('\n').filter(l=>/^[-*] /.test(l));

    if(li.length&&li.length===x.split('\n').length){
      return `<ul>${li.map(l=>`<li>${l.slice(2)}</li>`).join('')}</ul>`;
    }

    return /^<h[1-3]>/.test(x)
      ? x
      : `<p>${x.replace(/\n/g,'<br/>')}</p>`;
  }).join('\n');
}

const units:Record<string,{label:string;factor:number}[]>={
  'unit-length-converter':[
    ['Meter',1],['Kilometer',1000],['Centimeter',.01],['Millimeter',.001],
    ['Mile',1609.344],['Yard',.9144],['Foot',.3048],['Inch',.0254]
  ].map(([label,factor])=>({label:String(label),factor:Number(factor)})),

  'weight-mass-converter':[
    ['Kilogram',1],['Gram',.001],['Milligram',1e-6],['Metric ton',1000],
    ['Pound',.45359237],['Ounce',.028349523125]
  ].map(([label,factor])=>({label:String(label),factor:Number(factor)})),

  'data-size-converter':[
    ['Byte',1],['KB (1000)',1e3],['MB (1000)',1e6],['GB (1000)',1e9],
    ['TB (1000)',1e12],['KiB (1024)',1024],['MiB (1024)',1024**2],
    ['GiB (1024)',1024**3],['TiB (1024)',1024**4]
  ].map(([label,factor])=>({label:String(label),factor:Number(factor)})),

  'speed-velocity-converter':[
    ['m/s',1],['km/h',1/3.6],['mph',.44704],
    ['knot',.514444444],['Mach 1 (sea level)',340.29]
  ].map(([label,factor])=>({label:String(label),factor:Number(factor)})),

  'time-duration-converter':[
    ['Second',1],['Minute',60],['Hour',3600],['Day',86400],
    ['Week',604800],['30-day month',2592000],['365-day year',31536000]
  ].map(([label,factor])=>({label:String(label),factor:Number(factor)})),

  'area-land-converter':[
    ['Square meter',1],['Square kilometer',1e6],['Square foot',.09290304],
    ['Square yard',.83612736],['Acre',4046.8564224],
    ['Hectare',10000],['Square mile',2589988.110336]
  ].map(([label,factor])=>({label:String(label),factor:Number(factor)})),

  'pressure-unit-converter':[
    ['Pascal',1],['Kilopascal',1000],['Bar',100000],
    ['PSI',6894.757293168],['Atmosphere',101325],['Torr',133.3223684211]
  ].map(([label,factor])=>({label:String(label),factor:Number(factor)})),

  'energy-work-converter':[
    ['Joule',1],['Kilojoule',1000],['Calorie (thermochemical)',4.184],
    ['Kilocalorie',4184],['Watt-hour',3600],['Kilowatt-hour',3.6e6]
  ].map(([label,factor])=>({label:String(label),factor:Number(factor)})),

  'power-wattage-converter':[
    ['Watt',1],['Kilowatt',1000],['Megawatt',1e6],
    ['Mechanical horsepower',745.6998715823],
    ['Metric horsepower',735.49875]
  ].map(([label,factor])=>({label:String(label),factor:Number(factor)})),
};

function Converter({slug, locale='en'}:{slug:string; locale?: LocaleCode}){
  const ui = getEngineUi(locale);
  const list=units[slug]||[];

  const [v,setV]=useState('1');
  const [from,setFrom]=useState(list[0]?.label||'');
  const [to,setTo]=useState(list[1]?.label||list[0]?.label||'');

  const result=useMemo(()=>{
    const a=list.find(x=>x.label===from);
    const b=list.find(x=>x.label===to);
    return a&&b?n(v)*a.factor/b.factor:NaN;
  },[v,from,to,list]);

  return (
    <div className={card}>
      <div className="grid sm:grid-cols-3 gap-3">
        <input
          className={input}
          type="number"
          value={v}
          onChange={e=>setV(e.target.value)}
        />

        <select
          className={input}
          value={from}
          onChange={e=>setFrom(e.target.value)}
        >
          {list.map(x=><option key={x.label}>{x.label}</option>)}
        </select>

        <select
          className={input}
          value={to}
          onChange={e=>setTo(e.target.value)}
        >
          {list.map(x=><option key={x.label}>{x.label}</option>)}
        </select>
      </div>

      <div className="resultPanel">
        <div className="text-xs text-zinc-500">{ui.result}</div>
        <div className="text-2xl font-bold mt-1">
          {fmt(result)} {to}
        </div>
      </div>
    </div>
  );
}

function Temperature(){
  const [v,setV]=useState('0');
  const [from,setFrom]=useState('C');
  const [to,setTo]=useState('F');

  const c=
    from==='C'
      ? n(v)
      : from==='F'
        ? (n(v)-32)*5/9
        : n(v)-273.15;

  const r=
    to==='C'
      ? c
      : to==='F'
        ? c*9/5+32
        : c+273.15;

  return (
    <div className={card}>
      <div className="grid sm:grid-cols-3 gap-3">
        <input
          className={input}
          type="number"
          value={v}
          onChange={e=>setV(e.target.value)}
        />

        <select
          className={input}
          value={from}
          onChange={e=>setFrom(e.target.value)}
        >
          <option value="C">{ui.universal.celsius}</option>
          <option value="F">{ui.universal.fahrenheit}</option>
          <option value="K">{ui.universal.kelvin}</option>
        </select>

        <select
          className={input}
          value={to}
          onChange={e=>setTo(e.target.value)}
        >
          <option value="C">{ui.universal.celsius}</option>
          <option value="F">{ui.universal.fahrenheit}</option>
          <option value="K">{ui.universal.kelvin}</option>
        </select>
      </div>

      <div className="text-2xl font-bold">
        {fmt(r)} °{to}
      </div>
    </div>
  );
}

function DeveloperText({tool, locale='en'}:{tool:ToolMeta; locale?: LocaleCode}){
  const ui = getEngineUi(locale);
  const slug=tool.slug;

  const [value,setValue]=useState('');
  const [second,setSecond]=useState('');
  const [replacement,setReplacement]=useState('');
  const [mode,setMode]=useState<'encode'|'decode'>('encode');
  const [caseMode,setCaseMode]=useState('upper');
  const [result,setResult]=useState('');
  const [copied,setCopied]=useState(false);

  const process=()=>{
    try{
      let out='';

      if(slug==='json-formatter-validator'){
        out=JSON.stringify(JSON.parse(value),null,2);

      }else if(slug==='base64-encoder-decoder'){
        out=mode==='encode'?b64e(value):b64d(value);

      }else if(slug==='clean-url-slug-generator'){
        out=value
          .normalize('NFKD')
          .replace(/[\u0300-\u036f]/g,'')
          .toLowerCase()
          .replace(/[^a-z0-9]+/g,'-')
          .replace(/^-|-$/g,'');

      }else if(slug==='html-entity-encoder'){
        out=escHtml(value);

      }else if(slug==='css-minifier-cleaner'){
        out=value
          .replace(/\/\*[\s\S]*?\*\//g,'')
          .replace(/\s+/g,' ')
          .replace(/\s*([{}:;,>])\s*/g,'$1')
          .trim();

      }else if(slug==='unix-timestamp-converter'){
        const x=value.trim();

        if(/^\d+$/.test(x)){
          const ms=x.length>10?Number(x):Number(x)*1000;
          out=new Date(ms).toISOString();
        }else{
          const ms=Date.parse(x);

          if(!Number.isFinite(ms)){
            throw new Error(ui.universal.timestampError);
          }

          out=String(Math.floor(ms/1000));
        }

      }else if(slug==='hex-to-rgb-hsl-converter'){
        let h=value.trim().replace(/^#/,'');
        if(h.length===3)h=h.split('').map(c=>c+c).join('');

        if(!/^[0-9a-f]{6}$/i.test(h)){
          throw new Error(ui.universal.hexError);
        }

        const r=parseInt(h.slice(0,2),16);
        const g=parseInt(h.slice(2,4),16);
        const b=parseInt(h.slice(4,6),16);

        const mx=Math.max(r,g,b)/255;
        const mn=Math.min(r,g,b)/255;
        const l=(mx+mn)/2;
        const d=mx-mn;

        let H=0;
        let S=0;

        if(d){
          S=d/(1-Math.abs(2*l-1));

          if(mx===r){
            H=60*((g-b)/255/d%6);
          }else if(mx===g){
            H=60*((b-r)/255/d+2);
          }else{
            H=60*((r-g)/255/d+4);
          }

          if(H<0)H+=360;
        }

        out=`RGB: rgb(${r}, ${g}, ${b})
HSL: hsl(${H.toFixed(1)}, ${(S*100).toFixed(1)}%, ${(l*100).toFixed(1)}%)`;

      }else if(slug==='url-component-encoder-decoder'){
        out=mode==='encode'
          ? encodeURIComponent(value)
          : decodeURIComponent(value);

      }else if(slug==='jwt-token-inspector'){
        const p=value.trim().split('.');

        if(p.length<2){
          throw new Error(ui.universal.jwtError);
        }

        out=`Header:
${JSON.stringify(
  JSON.parse(
    b64d(p[0].replace(/-/g,'+').replace(/_/g,'/'))
  ),
  null,
  2
)}

Payload:
${JSON.stringify(
  JSON.parse(
    b64d(p[1].replace(/-/g,'+').replace(/_/g,'/'))
  ),
  null,
  2
)}`;

      }else if(slug==='uuid-guid-v4-generator'){
        out=crypto.randomUUID();

      }else if(slug==='strong-password-generator'){
        const chars='ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%^&*_-';
        const len=Math.min(128,Math.max(8,n(value,20)));
        const arr=new Uint32Array(len);

        crypto.getRandomValues(arr);

        out=Array.from(arr,x=>chars[x%chars.length]).join('');

      }else if(slug==='user-agent-string-parser'){
        const ua=value||navigator.userAgent;

        const browser=
          /Edg\//.test(ua)
            ? 'Edge'
            : /Chrome\//.test(ua)
              ? 'Chrome'
              : /Firefox\//.test(ua)
                ? 'Firefox'
                : /Safari\//.test(ua)&&!/Chrome\//.test(ua)
                  ? 'Safari'
                  : 'Unknown';

        const os=
          /Windows/.test(ua)
            ? 'Windows'
            : /Android/.test(ua)
              ? 'Android'
              : /iPhone|iPad/.test(ua)
                ? 'iOS'
                : /Mac OS X/.test(ua)
                  ? 'macOS'
                  : /Linux/.test(ua)
                    ? 'Linux'
                    : 'Unknown';

        out=`${ui.universal.browser}: ${browser}
${ui.universal.os}: ${os}
${ui.universal.userAgent}: ${ua}`;

      }else if(slug==='word-character-counter'){
        const words=value.trim()?value.trim().split(/\s+/).length:0;
        const chars=value.length;
        const charsNoSpaces=value.replace(/\s/g,'').length;

        out=`${ui.universal.words}: ${words}
${ui.universal.characters}: ${chars}
${ui.universal.charactersNoSpaces}: ${charsNoSpaces}
${ui.universal.lines}: ${value?value.split(/\r?\n/).length:0}`;

      }else if(slug==='text-case-converter'){
        out=
          caseMode==='upper'
            ? value.toUpperCase()
            : caseMode==='lower'
              ? value.toLowerCase()
              : caseMode==='title'
                ? titleCase(value)
                : caseMode==='sentence'
                  ? sentenceCase(value)
                  : camelCase(value);

      }else if(slug==='remove-duplicate-lines'){
        const seen=new Set<string>();

        out=value
          .split(/\r?\n/)
          .filter(line=>{
            if(seen.has(line))return false;
            seen.add(line);
            return true;
          })
          .join('\n');

      }else if(slug==='lorem-ipsum-generator'){
        const count=Math.min(50,Math.max(1,Math.floor(n(value,3))));
        const p='Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.';

        out=Array.from({length:count},()=>p).join('\n\n');

      }else if(slug==='markdown-to-html-converter'){
        out=markdownToHtml(value);

      }else if(slug==='reverse-text-mirror-tool'){
        out=
          mode==='encode'
            ? Array.from(value).reverse().join('')
            : value.split(/\s+/).reverse().join(' ');

      }else if(slug==='text-diff-checker'){
        const a=value.split(/\r?\n/);
        const b=second.split(/\r?\n/);
        const max=Math.max(a.length,b.length);

        out=Array.from(
          {length:max},
          (_,i)=>
            a[i]===b[i]
              ? `  ${a[i]??''}`
              : `- ${a[i]??''}\n+ ${b[i]??''}`
        ).join('\n');

      }else if(slug==='alphabetical-line-sorter'){
        out=value
          .split(/\r?\n/)
          .sort((a,b)=>a.localeCompare(b,undefined,{sensitivity:'base'}))
          .join('\n');

      }else if(slug==='strip-html-tags'){
        out=stripHtml(value);

      }else if(slug==='find-replace-text'){
        if(!second){
          throw new Error(ui.universal.findError);
        }

        out=value.split(second).join(replacement);

      }else{
        throw new Error(ui.universal.notConfigured);
      }

      setResult(out);

    }catch(e){
      setResult(`${ui.universal.invalidInput}: ${e instanceof Error?e.message:ui.universal.invalidInput}`);
    }
  };

  const copy=async()=>{
    try{
      await copySafe(result);
      setCopied(true);
      setTimeout(()=>setCopied(false),1500);
    }catch{
      setResult(ui.universal.clipboardError);
    }
  };

  const isTwo=slug==='text-diff-checker';
  const isCase=slug==='text-case-converter';
  const isMode=[
    'base64-encoder-decoder',
    'url-component-encoder-decoder',
    'reverse-text-mirror-tool'
  ].includes(slug);

  return (
    <div className={card}>
      <h3 className="text-lg font-bold">{getLocalizedToolName(tool,locale)}</h3>

      {isMode&&(
        <div className="flex gap-2">
          <button
            className={mode==='encode'?button:secondary}
            onClick={()=>setMode('encode')}
          >
            {slug==='reverse-text-mirror-tool'?ui.universal.reverseCharacters:ui.universal.encode}
          </button>

          <button
            className={mode==='decode'?button:secondary}
            onClick={()=>setMode('decode')}
          >
            {slug==='reverse-text-mirror-tool'?ui.universal.reverseWords:ui.universal.decode}
          </button>
        </div>
      )}

      {isCase&&(
        <select
          className={input}
          value={caseMode}
          onChange={e=>setCaseMode(e.target.value)}
        >
          <option value="upper">UPPERCASE</option>
          <option value="lower">lowercase</option>
          <option value="title">Title Case</option>
          <option value="sentence">Sentence case</option>
          <option value="camel">camelCase</option>
        </select>
      )}

      <textarea
        className={input+' min-h-44 font-mono'}
        value={value}
        onChange={e=>setValue(e.target.value)}
        placeholder={ui.enterValues}
      />

      {isTwo&&(
        <textarea
          className={input+' min-h-32 font-mono'}
          value={second}
          onChange={e=>setSecond(e.target.value)}
          placeholder={ui.enterValues}
        />
      )}

      {slug==='find-replace-text'&&(
        <>
          <input
            className={input}
            value={second}
            onChange={e=>setSecond(e.target.value)}
            placeholder={locale==="en"?"Find":locale==="es"?"Buscar":locale==="pt"?"Localizar":locale==="de"?"Suchen":locale==="fr"?"Rechercher":locale==="it"?"Trova":locale==="ja"?"検索":locale==="ko"?"찾기":locale==="zh"?"查找":locale==="ru"?"Найти":locale==="ar"?"بحث":"खोजें"}
          />

          <input
            className={input}
            value={replacement}
            onChange={e=>setReplacement(e.target.value)}
            placeholder={locale==="en"?"Replacement":locale==="es"?"Reemplazo":locale==="pt"?"Substituição":locale==="de"?"Ersetzung":locale==="fr"?"Remplacement":locale==="it"?"Sostituzione":locale==="ja"?"置換":locale==="ko"?"바꾸기":locale==="zh"?"替换":locale==="ru"?"Замена":locale==="ar"?"الاستبدال":"बदलें"}
          />
        </>
      )}

      {['strong-password-generator','lorem-ipsum-generator'].includes(slug)&&(
        <p className="text-xs text-zinc-500">
          {ui.enterValues}
        </p>
      )}

      <div className="flex flex-wrap gap-2">
        <button className={button} onClick={process}>
          {ui.process}
        </button>

        {result&&(
          <>
            <button className={secondary} onClick={copy}>
              {copied
                ? <Check className="inline h-3.5 w-3.5"/>
                : <Copy className="inline h-3.5 w-3.5"/>}
              {' '}
              {copied ? ui.copied : ui.copy}
            </button>

            <button
              className={secondary}
              onClick={()=>downloadText(result,`${slug}.txt`)}
            >
              <Download className="inline h-3.5 w-3.5"/>
              {' '}
              {ui.download}
            </button>
          </>
        )}

        <button
          className={secondary}
          onClick={()=>{
            setValue('');
            setSecond('');
            setReplacement('');
            setResult('');
          }}
        >
          <RefreshCw className="inline h-3.5 w-3.5"/>
          {' '}
          {ui.reset}
        </button>
      </div>

      {result&&(
        <pre className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 p-4 text-xs whitespace-pre-wrap overflow-auto">
          {result}
        </pre>
      )}
    </div>
  );
}

function evaluateScientificExpression(expression:string){
  const x=expression.trim();

  if(!/^[0-9+\-*/().\s^a-z]+$/i.test(x)){
    throw new Error(ui.universal.unsupportedCharacters);
  }

  const norm=x
    .replace(/\s+/g,'')
    .replace(/\bpi\b/gi,String(Math.PI))
    .replace(/\^/g,'**')
    .replace(/\bsqrt\(([^()]*)\)/gi,(_,v)=>String(Math.sqrt(Number(v))))
    .replace(/\bsin\(([^()]*)\)/gi,(_,v)=>String(Math.sin(Number(v))))
    .replace(/\bcos\(([^()]*)\)/gi,(_,v)=>String(Math.cos(Number(v))))
    .replace(/\btan\(([^()]*)\)/gi,(_,v)=>String(Math.tan(Number(v))))
    .replace(/\blog\(([^()]*)\)/gi,(_,v)=>String(Math.log10(Number(v))))
    .replace(/\bln\(([^()]*)\)/gi,(_,v)=>String(Math.log(Number(v))));

  if(!/^[0-9+\-*/().]+$/.test(norm)){
    throw new Error(ui.universal.expressionHelp);
  }

  const tokens=norm.match(/\d+(?:\.\d+)?|\*\*|[+\-*/()]/g);

  if(!tokens||tokens.join('')!==norm){
    throw new Error(ui.universal.invalidExpression);
  }

  const vals:number[]=[];
  const ops:string[]=[];

  const prec=(o:string)=>
    o==='+'||o==='-'
      ? 1
      : o==='*'||o==='/'
        ? 2
        : o==='**'
          ? 3
          : 0;

  const apply=()=>{
    const o=ops.pop();
    if(!o) throw new Error(ui.universal.invalidExpression);
    const y=vals.pop();
    const z=vals.pop();
    if(y===undefined||z===undefined) throw new Error(ui.universal.invalidExpression);
    vals.push(o==='+'?z+y:o==='-'?z-y:o==='*'?z*y:o==='/'?z/y:z**y);
  };

  let expect=true;

  for(const t of tokens){
    if(/^\d/.test(t)){
      vals.push(Number(t));
      expect=false;
    }else if(t==='('){
      ops.push(t);
      expect=true;
    }else if(t===')'){
      while(ops.length&&ops.at(-1)!=='(') apply();
      if(ops.pop()!=='(') throw new Error(ui.universal.mismatchedParentheses);
      expect=false;
    }else if((t==='+'||t==='-')&&expect){
      vals.push(0);
      ops.push(t);
    }else{
      while(ops.length&&ops.at(-1)!=='('&&prec(ops.at(-1)!)>=prec(t)) apply();
      ops.push(t);
      expect=true;
    }
  }

  while(ops.length) apply();

  if(vals.length!==1||!Number.isFinite(vals[0])) throw new Error(ui.universal.invalidExpression);
  return fmt(vals[0]);
}
function Calculator({slug,toolName,locale='en'}:{slug:string;toolName:string;locale?:LocaleCode}){
  const ui = getEngineUi(locale);
  const [a,setA]=useState('1000');
  const [b,setB]=useState('5');
  const [c,setC]=useState('10');
  const [d,setD]=useState('12');
  const [expr,setExpr]=useState('');
  const [scientificResult,setScientificResult]=useState('');
  const [date,setDate]=useState('2000-01-01');

  const calculateScientific=()=>{
    try{
      setScientificResult(evaluateScientificExpression(expr));
    }catch(e){
      setScientificResult(`${ui.universal.invalidInput}: ${e instanceof Error?e.message:ui.universal.invalidInput}`);
    }
  };

  let out='';

  try{
    if(slug==='sip-wealth-calculator'){
      const monthly=n(a);
      const annualRate=n(b);
      const years=n(c);

      if(monthly<0||annualRate<=-100||years<=0){
        throw new Error(ui.universal.positiveSip);
      }

      const monthlyRate=annualRate/12/100;
      const months=Math.round(years*12);
      const invested=monthly*months;
      const futureValue=monthlyRate===0
        ? invested
        : monthly*((Math.pow(1+monthlyRate,months)-1)/monthlyRate)*(1+monthlyRate);

      out=`${ui.universal.monthlySip}: ₹${fmt(monthly)}\n${ui.universal.totalInvested}: ₹${fmt(invested)}\n${ui.universal.estimatedReturns}: ₹${fmt(futureValue-invested)}\n${ui.universal.maturityValue}: ₹${fmt(futureValue)}\n\n${ui.universal.assumption}\n${ui.universal.estimateOnly}`;
    }else if(slug==='compound-interest-calculator'){
      const p=n(a);
      const r=n(b)/100;
      const t=Math.max(0,n(c));
      const q=Math.max(1,Math.floor(n(d,12)));
      const fv=p*Math.pow(1+r/q,q*t);

      out=`${ui.universal.principal}: ${fmt(p)}\n${ui.universal.interest}: ${fmt(fv-p)}\n${ui.universal.finalAmount}: ${fmt(fv)}`;

    }else if(slug==='simple-interest-calculator'){
      const p=n(a);
      const r=n(b);
      const t=n(c);
      const i=p*r*t/100;

      out=`${ui.universal.simpleInterest}: ${fmt(i)}\n${ui.universal.totalAmount}: ${fmt(p+i)}`;

    }else if(slug==='percentage-calculator'){
      const x=n(a);
      const y=n(b);

      out=
        y===0
          ? ui.universal.nonZero
          : `${fmt(x)} ${ui.universal.percentOf} ${fmt(x/y*100)}% ${ui.universal.percentOf} ${fmt(y)}\n${ui.universal.difference}: ${fmt(y-x)}`;

    }else if(slug==='age-calculator'){
      const dob=new Date(date+'T00:00:00');
      const now=new Date();

      if(!Number.isFinite(dob.getTime())||dob>now){
        throw new Error(ui.universal.pastDate);
      }

      let years=now.getFullYear()-dob.getFullYear();
      let months=now.getMonth()-dob.getMonth();

      if(now.getDate()<dob.getDate())months--;

      if(months<0){
        years--;
        months+=12;
      }

      out=`${ui.universal.age}: ${years} ${ui.universal.years}, ${months} ${ui.universal.months}\n${ui.universal.approxDays}: ${Math.floor((now.getTime()-dob.getTime())/86400000).toLocaleString()}`;

    }else if(slug==='bmi-calculator'){
      const kg=n(a);
      const cm=n(b);

      if(kg<=0||cm<=0){
        throw new Error(ui.universal.positiveWeight);
      }

      const bmi=kg/(cm/100)**2;

      out=`${ui.universal.bmi}: ${bmi.toFixed(1)}\n${ui.universal.category}: ${bmi<18.5?ui.universal.underweight:bmi<25?ui.universal.normal:bmi<30?ui.universal.overweight:ui.universal.obesity}`;

    }else if(slug==='scientific-calculator'){
      out=scientificResult;

    }else if(slug==='discount-calculator'){
      const price=n(a);
      const disc=n(b);
      const tax=n(c);
      const after=price*(1-disc/100);
      const total=after*(1+tax/100);

      out=`${ui.universal.original}: ${fmt(price)}\n${ui.universal.afterDiscount}: ${fmt(after)}\n${ui.universal.discountSaved}: ${fmt(price-after)}\n${ui.universal.afterTax}: ${fmt(total)}`;

    }else if(slug==='tip-calculator'){
      const bill=n(a);
      const tip=n(b);
      const people=Math.max(1,Math.floor(n(c,1)));
      const tipAmt=bill*tip/100;
      const total=bill+tipAmt;

      out=`${ui.universal.tip}: ${fmt(tipAmt)}\n${ui.universal.total}: ${fmt(total)}\n${ui.universal.perPerson}: ${fmt(total/people)}`;

    }else{
      out='';
    }

  }catch(e){
    out=`${ui.universal.invalidInput}: ${e instanceof Error?e.message:ui.universal.invalidInput}`;
  }

  return (
    <div className={plainCard}>
      <h3 className="text-lg font-bold">{toolName}</h3>

      {slug==='age-calculator'
        ? (
          <div>
            <label className="mb-2 block text-xs font-medium text-zinc-500">
              {ui.dateOfBirth}
            </label>
            <input
              className={input}
              type="date"
              value={date}
              onChange={e=>setDate(e.target.value)}
            />
          </div>
        )
        : slug==='scientific-calculator'
          ? (
            <div>
              <label className="mb-2 block text-xs font-medium text-zinc-500">
                {ui.expression}
              </label>
              <input
                className={input}
                value={expr}
                onChange={e=>setExpr(e.target.value)}
                placeholder={ui.universal.dateExample}
              />
              <button
                className={button+' mt-3'}
                onClick={calculateScientific}
              >
                Calculate
              </button>
            </div>
          )
          : (
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="mb-2 block text-xs font-medium text-zinc-500">
                  {slug==='sip-wealth-calculator'
                    ? ui.universal.monthlyInvestment
                    : slug==='bmi-calculator'
                      ? `${ui.enterValues} — kg`
                      : slug==='compound-interest-calculator'
                        ? ui.universal.principalAmount
                        : slug==='simple-interest-calculator'
                          ? ui.universal.principalAmount
                          : slug==='percentage-calculator'
                            ? ui.result
                            : slug==='discount-calculator'
                              ? ui.enterValues
                             : ui.universal.billAmount}
                </label>
                <input
                  className={input}
                  type="number"
                  value={a}
                  onChange={e=>setA(e.target.value)}
                  placeholder={ui.enterValues}
                />
              </div>

              <div>
                <label className="mb-2 block text-xs font-medium text-zinc-500">
                  {slug==='sip-wealth-calculator'
                    ? ui.universal.expectedReturn
                    : slug==='bmi-calculator'
                      ? `${ui.enterValues} — cm`
                      : slug==='percentage-calculator'
                        ? ui.universal.totalReference
                        : slug==='tip-calculator'
                          ? ui.enterValues
                          : slug==='discount-calculator'
                            ? ui.universal.discount
                            : ui.enterValues}
                </label>
                <input
                  className={input}
                  type="number"
                  value={b}
                  onChange={e=>setB(e.target.value)}
                  placeholder={ui.enterValues}
                />
              </div>

              {[
                'sip-wealth-calculator',
                'compound-interest-calculator',
                'simple-interest-calculator',
                'discount-calculator',
                'tip-calculator'
              ].includes(slug)&&(
                <>
                  <div>
                    <label className="mb-2 block text-xs font-medium text-zinc-500">
                      {slug==='sip-wealth-calculator'
                        ? ui.universal.investmentPeriod
                        : slug==='tip-calculator'
                          ? ui.universal.people
                          : slug==='discount-calculator'
                            ? ui.universal.tax
                            : '{ui.universal.timePeriod}'}
                    </label>
                    <input
                      className={input}
                      type="number"
                      value={c}
                      onChange={e=>setC(e.target.value)}
                      placeholder={ui.enterValues}
                    />
                  </div>

                  {slug==='compound-interest-calculator'&&(
                    <div>
                      <label className="mb-2 block text-xs font-medium text-zinc-500">
                        Compounding Frequency (per year)
                      </label>
                      <input
                        className={input}
                        type="number"
                        value={d}
                        onChange={e=>setD(e.target.value)}
                        placeholder="e.g. 12"
                      />
                    </div>
                  )}
                </>
              )}
            </div>
          )
      }

      <div className="resultPanel">
        <div className="text-xs font-semibold text-zinc-500">{ui.result}</div>
        <pre className="mt-2 text-sm whitespace-pre-wrap">
          {slug==='scientific-calculator'
            ? (scientificResult || '—')
            : out}
        </pre>
      </div>
    </div>
  );

}

function YouTube({slug,locale='en'}:{slug:string;locale?:LocaleCode}){
  const ui = getEngineUi(locale);
  const [inputValue,setInputValue]=useState<string>('');
  const [result,setResult]=useState<string>('');

  const run=()=>{
    const topic=inputValue.trim()||'YouTube video';

    if(slug==='youtube-tag-generator'){
      const words:string[]=topic.toLowerCase().match(/[a-z0-9]+/g)??[];
      const phrase=topic.replace(/\s+/g,' ').trim().toLowerCase();
      const tags:string[]=[
        phrase,
        `${phrase} tutorial`,
        `${phrase} guide`,
        `how to ${phrase}`,
        `${phrase} tips`,
        `${phrase} explained`,
        `${phrase} for beginners`,
        `${phrase} step by step`,
        `${phrase} examples`,
        `${phrase} best practices`,
        ...words,
        ...words.map((word)=>`${word} tutorial`),
        ...words.map((word)=>`${word} guide`),
        'youtube video',
        'video tutorial',
        'how to',
        'beginner guide'
      ];
      setResult(Array.from(new Set(tags.filter((tag)=>tag.length>1))).slice(0,30).join(', '));
      return;
    }
    setResult(ui.universal.youtubeTopic);
  };

  return (
    <div className={plainCard}>
      <h3 className="text-lg font-bold">
        '{ui.universal.youtubeTag}'
      </h3>

      <input
        className={input}
        value={inputValue}
        onChange={e=>setInputValue(e.target.value)}
        placeholder={ui.enterValues}
      />

      <button className={button} onClick={run}>
        {ui.generate}
      </button>

      {result&&(
        <pre className="resultPanel text-sm whitespace-pre-wrap">
          {result}
        </pre>
      )}

      <p className="text-xs text-zinc-500">
        {ui.generatedNote}
      </p>
    </div>
  );
}

export default function UniversalToolEngine({tool, locale='en'}:{tool:ToolMeta; locale?: LocaleCode}){
  const ui = getEngineUi(locale);
  if(tool.category==='Converters'){
    return tool.slug==='temperature-converter'
      ? <Temperature/>
      : <Converter slug={tool.slug} locale={locale}/>;
  }

  if(tool.category==='Calculators'){
    return <Calculator slug={tool.slug} toolName={getLocalizedToolName(tool,locale)} locale={locale}/>;
  }

  if(tool.category==='YouTube'){
    if(tool.slug==='youtube-money-calculator'){
      const [revenue,setRevenue]=useState('');

      return (
        <div className={plainCard}>
          <h3 className="text-lg font-bold">
            {getLocalizedToolName(tool,locale)}
          </h3>

          <div className="grid sm:grid-cols-2 gap-4">
            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                {ui.monthlyViews}
              </span>
              <input
                id="views"
                className={input}
                type="number"
                defaultValue="100000"
                aria-label={ui.universal.monthlyViews}
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                {ui.rpmUsd}
              </span>
              <input
                id="rpm"
                className={input}
                type="number"
                defaultValue="2"
                aria-label={ui.universal.rpmUsdLabel}
              />
            </label>
          </div>

          <button
            className={button}
            onClick={()=>{
              const v=n(
                (document.getElementById('views') as HTMLInputElement).value
              );

              const r=n(
                (document.getElementById('rpm') as HTMLInputElement).value
              );

              setRevenue(
                `${ui.universal.estimatedRevenue}: ${(v*r/1000).toFixed(2)}`
              );
            }}
          >
            Calculate
          </button>

          {revenue&&(
            <div className="resultPanel text-lg font-bold">
              {revenue}
            </div>
          )}

          <p className="text-xs text-zinc-500">
            Estimate only; actual YouTube revenue varies by RPM, geography,
            ads, and monetized views.
          </p>
        </div>
      );
    }

    if(tool.slug==='youtube-thumbnail-downloader'){
      return <Thumbnail locale={locale}/>;
    }

    return <YouTube slug={tool.slug} locale={locale}/>;
  }

  return <DeveloperText tool={tool} locale={locale}/>;
}

function Thumbnail({locale='en'}:{locale?:LocaleCode}){
  const ui = getEngineUi(locale);
  const [url,setUrl]=useState('');
  const [id,setId]=useState('');
  const [downloading,setDownloading]=useState(false);
  const [message,setMessage]=useState('');

  const get=()=>{
    const m=url.match(
      /(?:[?&]v=|youtu\.be\/|youtube\.com\/shorts\/|youtube\.com\/embed\/)([A-Za-z0-9_-]{11})/
    );

    setId(m?.[1]||'');
    setMessage(m?.[1] ? '' : ui.validUrl);
  };

  const downloadThumbnail=async()=>{
    if(!id) return;

    setDownloading(true);
    setMessage('');

    try{
      const response=await fetch(`/api/youtube-thumbnail?videoId=${id}`);
      if(!response.ok) throw new Error(ui.thumbnailError);

      const blob=await response.blob();
      const blobUrl=URL.createObjectURL(blob);
      const anchor=document.createElement('a');

      anchor.href=blobUrl;
      anchor.download=`youtube-thumbnail-${id}.jpg`;
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();

      setTimeout(()=>URL.revokeObjectURL(blobUrl),1000);
    }catch(e){
      setMessage(e instanceof Error?e.message:ui.universal.thumbnailFailed);
    }finally{
      setDownloading(false);
    }
  };

  return (
    <div className={plainCard}>
      <input
        className={input}
        value={url}
        onChange={e=>setUrl(e.target.value)}
        placeholder={ui.enterValues}
      />

      <button className={button} onClick={get}>
        {ui.generate}
      </button>

      {message&&(
        <p className="text-sm text-rose-500">{message}</p>
      )}

      {id&&(
        <div className="space-y-3">
          <img
            className="w-full rounded-2xl border"
            src={`https://i.ytimg.com/vi/${id}/maxresdefault.jpg`}
            alt="YouTube thumbnail"
          />

          <button
            className={button}
            disabled={downloading}
            onClick={downloadThumbnail}
          >
            <Download className="h-4 w-4" />
            {downloading?ui.processing:ui.download}
          </button>
        </div>
      )}
    </div>
  );
}