'use client';

import React, { useState } from 'react';
import { Play, RotateCcw, Copy, Check, Terminal, Code2, Loader2 } from 'lucide-react';

const DEFAULT_CODES: Record<string, string> = {
  python: `def fibonacci(n):
    a, b = 0, 1
    for _ in range(n):
        print(a)
        a, b = b, a + b

fibonacci(8)`,
  javascript: `const users = [{name: 'Alex'}, {name: 'Sarah'}];
console.log(users.map(u => u.name));`,
  java: `public class Main {
  public static void main(String[] args) {
    System.out.println("Hello from Java");
  }
}`,
  cpp: `#include <iostream>
int main() { std::cout << "Hello from C++\n"; return 0; }`,
  csharp: `using System;
class Program { static void Main() { Console.WriteLine("Hello from C#"); } }`,
  php: `<?php
echo "Hello from PHP\n";`,
  html: `<!doctype html><html><body><h2>TheToolGenie HTML Preview</h2><p>Edit and preview your HTML/CSS/JS.</p></body></html>`,
  sql: `CREATE TABLE users (id INTEGER, name TEXT);
INSERT INTO users VALUES (1, 'Alex'), (2, 'Sarah');
SELECT * FROM users;`,
};


export default function CompilerEngine({ toolSlug, toolName }: { toolSlug: string; toolName: string }) {
  const langKey = toolSlug.includes('python') ? 'python' : toolSlug.includes('javascript') ? 'javascript' : toolSlug.includes('java') && !toolSlug.includes('javascript') ? 'java' : toolSlug.includes('cpp') ? 'cpp' : toolSlug.includes('csharp') ? 'csharp' : toolSlug.includes('php') ? 'php' : toolSlug.includes('sql') ? 'sql' : 'html';
  const [code, setCode] = useState(DEFAULT_CODES[langKey]);
  const [output, setOutput] = useState('Runtime ready. Click "Run Code" to execute.');
  const [copied, setCopied] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [preview, setPreview] = useState(false);

  const runCode = async () => {
    if (langKey === 'html') { setPreview(true); setOutput('HTML rendered in a sandboxed preview.'); return; }
    if (langKey === 'sql') {
      setIsRunning(true); setOutput('Running SQL locally...');
      try {
        const initSqlJs =
          (await import('sql.js')).default;

        let wasmUrl =
          '/sql-wasm.wasm';

        try {
          const probe =
            await fetch(
              wasmUrl,
              {
                method: 'HEAD',
                cache: 'no-store',
              }
            );

          if (!probe.ok) {
            wasmUrl =
              'https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.13.0/sql-wasm.wasm';
          }
        } catch {
          wasmUrl =
            'https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.13.0/sql-wasm.wasm';
        }

        const SQL =
          await initSqlJs({
            locateFile: () =>
              wasmUrl,
          });

        const db =
          new SQL.Database();
        const statements = code.split(/;(?=(?:[^']*'[^']*')*[^']*$)/).map(s=>s.trim()).filter(Boolean);
        const rows:string[]=[];
        for (const statement of statements) {
          const result = db.exec(statement);
          for (const r of result) rows.push(JSON.stringify({ columns:r.columns, values:r.values }));
        }
        setOutput(rows.join('\n') || 'SQL executed successfully.');
      } catch (err) { setOutput(`SQL Error:\n${err instanceof Error ? err.message : 'Unknown error'}`); }
      finally { setIsRunning(false); }
      return;
    }
    setIsRunning(true); setOutput('Submitting code to the configured execution runtime...');
    try {
      const response = await fetch('/api/execute-code', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({language:langKey,code}) });
      const data = await response.json().catch(()=>({}));
      if (!response.ok) throw new Error(data.error || `Execution failed (${response.status})`);
      const parts=[data.stdout,data.stderr,data.compileOutput].filter(Boolean);
      setOutput(parts.join('\n') || 'Program finished successfully with no output.');
    } catch (err) { setOutput(`Execution Error:\n${err instanceof Error ? err.message : 'Unknown error'}`); }
    finally { setIsRunning(false); }
  };


  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setOutput('Clipboard access was blocked by the browser.');
    }
  };

  const highlightedCode = React.useMemo(() => {
    const keywordSets: Record<string, string[]> = {
      python: ['def','return','for','in','range','if','else','elif','import','from','class','True','False','None','and','or','not','while','print','try','except','finally','with','as','lambda','yield','async','await'],
      javascript: ['const','let','var','function','return','if','else','for','of','in','class','new','async','await','import','from','export','default','true','false','null','undefined','this','try','catch','finally','throw','typeof','instanceof'],
      java: ['public','private','protected','class','static','void','int','double','float','long','boolean','new','return','if','else','for','while','String','true','false','null','this','extends','implements','interface','final','try','catch','finally','throw'],
      cpp: ['include','int','double','float','long','char','void','return','if','else','for','while','class','struct','const','auto','true','false','nullptr','namespace','using','public','private','protected','template','typename','std','new','delete'],
      csharp: ['using','namespace','class','public','private','protected','static','void','int','double','float','string','bool','return','if','else','for','while','true','false','null','new','var','async','await','Task','interface','extends','try','catch','finally'],
      php: ['echo','function','return','if','else','elseif','foreach','as','class','public','private','protected','new','true','false','null','namespace','use','extends','implements','try','catch','finally','function'],
      html: ['html','head','body','title','meta','link','style','script','div','span','main','section','header','footer','h1','h2','h3','p','a','img','button','input','form','class','id','href','src','alt'],
      sql: ['SELECT','FROM','WHERE','INSERT','INTO','VALUES','UPDATE','SET','DELETE','CREATE','TABLE','AND','OR','AS','JOIN','ON','ORDER','BY','GROUP','LIMIT','NULL','PRIMARY','KEY','NOT','IS','INNER','LEFT','RIGHT','OUTER','DROP','ALTER','ADD','INDEX'],
    };

    const escapeHtml = (value: string) =>
      value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

    const wrap = (className: string, value: string) =>
      '<span class="' + className + '">' + escapeHtml(value) + '</span>';

    const keywords = new Set(keywordSets[langKey] || []);
    const tokenPattern = /("(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|\/\/.*|#.*|\/\*[\s\S]*?\*\/|\b\d+(?:\.\d+)?\b|\b[A-Za-z_$][A-Za-z0-9_$]*\b)/g;

    const highlightCodeLine = (line: string) => {
      const parts: string[] = [];
      let last = 0;

      for (const match of line.matchAll(tokenPattern)) {
        const startIndex = match.index ?? 0;
        if (startIndex > last) parts.push(escapeHtml(line.slice(last, startIndex)));

        const token = match[0];
        if (/^("|')/.test(token)) parts.push(wrap('text-amber-300', token));
        else if (token.startsWith('//') || token.startsWith('#') || token.startsWith('/*')) parts.push(wrap('text-zinc-500 italic', token));
        else if (/^\d/.test(token)) parts.push(wrap('text-cyan-300', token));
        else if (keywords.has(token) || (langKey === 'sql' && keywords.has(token.toUpperCase()))) {
          parts.push(wrap('text-violet-300 font-semibold', token));
        } else {
          parts.push(escapeHtml(token));
        }
        last = startIndex + token.length;
      }

      if (last < line.length) parts.push(escapeHtml(line.slice(last)));
      return parts.join('') || ' ';
    };

    const highlightHtmlLine = (line: string) => {
      const parts: string[] = [];
      let last = 0;
      const htmlPattern = /<!--.*?-->|<\\/?[A-Za-z][^>]*>/g;

      for (const match of line.matchAll(htmlPattern)) {
        const startIndex = match.index ?? 0;
        if (startIndex > last) {
          parts.push(highlightCodeLine(line.slice(last, startIndex)));
        }

        const token = match[0];
        if (token.startsWith('<!--')) {
          parts.push(wrap('text-zinc-500 italic', token));
        } else {
          const tagMatch = token.match(/^(<\\/?)([A-Za-z][\\w:-]*)(.*?)(\\/?>)$/);
          if (!tagMatch) {
            parts.push(escapeHtml(token));
          } else {
            const [, open, tagName, attrs, close] = tagMatch;
            let attrHtml = '';
            let attrLast = 0;
            const attrPattern = /([A-Za-z_:][\\w:.-]*)(\\s*=\\s*)(".*?"|'.*?'|[^\\s>]+)/g;

            for (const attrMatch of attrs.matchAll(attrPattern)) {
              const attrStart = attrMatch.index ?? 0;
              if (attrStart > attrLast) attrHtml += escapeHtml(attrs.slice(attrLast, attrStart));
              attrHtml += wrap('text-cyan-300', attrMatch[1]);
              attrHtml += escapeHtml(attrMatch[2]);
              attrHtml += wrap('text-amber-300', attrMatch[3]);
              attrLast = attrStart + attrMatch[0].length;
            }

            if (attrLast < attrs.length) attrHtml += escapeHtml(attrs.slice(attrLast));
            parts.push(
              escapeHtml(open) +
              wrap('text-violet-300 font-semibold', tagName) +
              attrHtml +
              escapeHtml(close)
            );
          }
        }

        last = startIndex + token.length;
      }

      if (last < line.length) parts.push(highlightCodeLine(line.slice(last)));
      return parts.join('') || ' ';
    };

    return code
      .split('\\n')
      .map((line) => {
        const highlighted = langKey === 'html' ? highlightHtmlLine(line) : highlightCodeLine(line);
        return '<span class="block min-w-full">' + highlighted + '</span>';
      })
      .join('');
  }, [code, langKey]);

  const lineCount = Math.max(code.split('\n').length, 1);

  return (
    <div className="w-full max-w-6xl mx-auto space-y-4">
      <div className="flex items-center justify-between bg-zinc-900 text-white px-5 py-3 rounded-2xl border border-zinc-800 shadow-md">
        <div className="flex items-center gap-2">
          <Code2 className="h-4 w-4 text-violet-400" />
          <span className="text-xs font-bold uppercase tracking-wider">{toolName} Editor</span>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={copyCode} className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold transition">
            {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>
          <button onClick={() => { setCode(DEFAULT_CODES[langKey]); setPreview(false); setOutput('Runtime ready. Click "Run Code" to execute.'); }} className="p-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition" title="Reset code">
            <RotateCcw className="h-3.5 w-3.5" />
          </button>
          <button onClick={runCode} disabled={isRunning} className="flex items-center gap-1.5 px-5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition disabled:opacity-50">
            {isRunning ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Play className="h-3.5 w-3.5 fill-white" />}
            <span>{langKey === 'html' ? 'Preview' : 'Run Code'}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-4 font-mono text-xs shadow-inner">
          <div className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest pb-2 border-b border-zinc-800 mb-2">
            Source File (main.{langKey === 'python' ? 'py' : langKey === 'html' ? 'html' : 'js'})
          </div>
          <div className="flex min-h-[420px] overflow-hidden rounded-xl border border-zinc-800 bg-zinc-950">
            <div aria-hidden="true" className="w-10 shrink-0 select-none overflow-hidden border-r border-zinc-800 bg-zinc-900/60 py-3 text-right font-mono text-xs leading-relaxed text-zinc-600">
              {Array.from({ length: lineCount }, (_, index) => <div key={index} className="pr-3">{index + 1}</div>)}
            </div>
            <div className="relative min-w-0 flex-1">
              <pre aria-hidden="true" className="pointer-events-none absolute inset-0 m-0 overflow-hidden whitespace-pre p-3 font-mono text-xs leading-relaxed text-zinc-200" dangerouslySetInnerHTML={{ __html: highlightedCode }} />
              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                onScroll={(e) => {
                  const target = e.currentTarget;
                  const highlight = target.previousElementSibling as HTMLElement | null;
                  if (highlight) { highlight.scrollTop = target.scrollTop; highlight.scrollLeft = target.scrollLeft; }
                }}
                onKeyDown={(e) => {
                  if (e.key !== 'Tab') return;
                  e.preventDefault();
                  const textarea = e.currentTarget;
                  const start = textarea.selectionStart;
                  const end = textarea.selectionEnd;
                  const indent = '    ';
                  const nextValue = code.slice(0, start) + indent + code.slice(end);
                  setCode(nextValue);
                  requestAnimationFrame(() => { textarea.selectionStart = start + indent.length; textarea.selectionEnd = start + indent.length; });
                }}
                spellCheck={false}
                rows={18}
                className="relative z-10 h-full min-h-[420px] w-full resize-none overflow-auto bg-transparent p-3 font-mono text-xs leading-relaxed text-transparent caret-violet-300 outline-none selection:bg-violet-500/30 selection:text-transparent"
              />
            </div>
          </div>
        </div>

        {langKey === 'html' && preview ? (
          <iframe title="HTML sandbox preview" sandbox="allow-scripts" srcDoc={code} className="w-full min-h-[420px] rounded-2xl border border-zinc-800 bg-white" />
        ) : (
          <div className="rounded-2xl border border-zinc-800 bg-black p-4 font-mono text-xs shadow-inner flex flex-col min-h-[420px]">
            <div className="flex items-center gap-2 pb-2 border-b border-zinc-800 mb-2">
              <Terminal className="h-3.5 w-3.5 text-zinc-500" />
              <span className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest">Console Output</span>
            </div>
            <pre className="flex-1 text-emerald-400 whitespace-pre-wrap overflow-auto leading-relaxed">{output}</pre>
          </div>
        )}
      </div>
    </div>
  );
}
