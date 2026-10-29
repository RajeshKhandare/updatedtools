'use client';

import React, { useState } from 'react';
import { Play, RotateCcw, Copy, Check, Terminal, Code2, Loader2 } from 'lucide-react';
import type { LocaleCode } from '@/data/internationalSeo';
import { getEngineUi } from '@/data/engineLocalization';

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


const COMPILER_UI: Record<LocaleCode, any> = {
  en:{editor:'Editor',runtimeReady:'Runtime ready. Click "Run Code" to execute.',runCode:'Run Code',htmlRendered:'HTML rendered in a sandboxed preview.',runningSql:'Running SQL locally...',sqlSuccess:'SQL executed successfully.',sqlError:'SQL Error',submitting:'Submitting code to the configured execution runtime...',executionFailed:'Execution failed',finished:'Program finished successfully with no output.',executionError:'Execution Error',clipboardBlocked:'Clipboard access was blocked by the browser.',sourceFile:'Source File',consoleOutput:'Console Output',htmlPreview:'HTML sandbox preview'},
  pt:{editor:'Editor',runtimeReady:'Runtime pronto. Clique em "Executar código" para executar.',runCode:'Executar código',htmlRendered:'HTML renderizado em uma pré-visualização isolada.',runningSql:'Executando SQL localmente...',sqlSuccess:'SQL executado com sucesso.',sqlError:'Erro de SQL',submitting:'Enviando código para o ambiente de execução configurado...',executionFailed:'Falha na execução',finished:'Programa concluído com sucesso sem saída.',executionError:'Erro de execução',clipboardBlocked:'O acesso à área de transferência foi bloqueado pelo navegador.',sourceFile:'Arquivo-fonte',consoleOutput:'Saída do console',htmlPreview:'Pré-visualização HTML isolada'},
  es:{editor:'Editor',runtimeReady:'Entorno listo. Haz clic en "Ejecutar código" para ejecutar.',runCode:'Ejecutar código',htmlRendered:'HTML renderizado en una vista previa aislada.',runningSql:'Ejecutando SQL localmente...',sqlSuccess:'SQL ejecutado correctamente.',sqlError:'Error de SQL',submitting:'Enviando el código al entorno de ejecución configurado...',executionFailed:'Error de ejecución',finished:'El programa terminó correctamente sin salida.',executionError:'Error de ejecución',clipboardBlocked:'El navegador bloqueó el acceso al portapapeles.',sourceFile:'Archivo fuente',consoleOutput:'Salida de consola',htmlPreview:'Vista previa HTML aislada'},
  de:{editor:'Editor',runtimeReady:'Laufzeit bereit. Klicke auf "Code ausführen", um den Code auszuführen.',runCode:'Code ausführen',htmlRendered:'HTML wird in einer isolierten Vorschau dargestellt.',runningSql:'SQL wird lokal ausgeführt...',sqlSuccess:'SQL wurde erfolgreich ausgeführt.',sqlError:'SQL-Fehler',submitting:'Code wird an die konfigurierte Laufzeit gesendet...',executionFailed:'Ausführung fehlgeschlagen',finished:'Programm erfolgreich ohne Ausgabe beendet.',executionError:'Ausführungsfehler',clipboardBlocked:'Der Browser hat den Zugriff auf die Zwischenablage blockiert.',sourceFile:'Quelldatei',consoleOutput:'Konsolenausgabe',htmlPreview:'Isolierte HTML-Vorschau'},
  fr:{editor:'Éditeur',runtimeReady:'Environnement prêt. Cliquez sur "Exécuter le code" pour lancer le code.',runCode:'Exécuter le code',htmlRendered:'HTML rendu dans un aperçu isolé.',runningSql:'Exécution de SQL localement...',sqlSuccess:'SQL exécuté avec succès.',sqlError:'Erreur SQL',submitting:'Envoi du code vers l’environnement d’exécution configuré...',executionFailed:'Échec de l’exécution',finished:'Programme terminé avec succès sans sortie.',executionError:'Erreur d’exécution',clipboardBlocked:'L’accès au presse-papiers a été bloqué par le navigateur.',sourceFile:'Fichier source',consoleOutput:'Sortie de la console',htmlPreview:'Aperçu HTML isolé'},
  it:{editor:'Editor',runtimeReady:'Ambiente pronto. Fai clic su "Esegui codice" per eseguire.',runCode:'Esegui codice',htmlRendered:'HTML visualizzato in un’anteprima isolata.',runningSql:'Esecuzione SQL locale...',sqlSuccess:'SQL eseguito correttamente.',sqlError:'Errore SQL',submitting:'Invio del codice all’ambiente di esecuzione configurato...',executionFailed:'Esecuzione non riuscita',finished:'Programma terminato correttamente senza output.',executionError:'Errore di esecuzione',clipboardBlocked:'Il browser ha bloccato l’accesso agli appunti.',sourceFile:'File sorgente',consoleOutput:'Output della console',htmlPreview:'Anteprima HTML isolata'},
  ja:{editor:'エディター',runtimeReady:'実行環境の準備ができました。「コードを実行」をクリックしてください。',runCode:'コードを実行',htmlRendered:'HTMLを分離されたプレビューで表示しました。',runningSql:'SQLをローカルで実行中...',sqlSuccess:'SQLを正常に実行しました。',sqlError:'SQLエラー',submitting:'設定された実行環境にコードを送信中...',executionFailed:'実行に失敗しました',finished:'プログラムは出力なしで正常に終了しました。',executionError:'実行エラー',clipboardBlocked:'ブラウザーによってクリップボードへのアクセスがブロックされました。',sourceFile:'ソースファイル',consoleOutput:'コンソール出力',htmlPreview:'HTML分離プレビュー'},
  ko:{editor:'에디터',runtimeReady:'실행 환경이 준비되었습니다. "코드 실행"을 클릭하세요.',runCode:'코드 실행',htmlRendered:'HTML을 격리된 미리보기에서 렌더링했습니다.',runningSql:'SQL을 로컬에서 실행하는 중...',sqlSuccess:'SQL이 성공적으로 실행되었습니다.',sqlError:'SQL 오류',submitting:'구성된 실행 환경으로 코드를 전송하는 중...',executionFailed:'실행 실패',finished:'프로그램이 출력 없이 성공적으로 종료되었습니다.',executionError:'실행 오류',clipboardBlocked:'브라우저에서 클립보드 접근을 차단했습니다.',sourceFile:'소스 파일',consoleOutput:'콘솔 출력',htmlPreview:'격리된 HTML 미리보기'},
  zh:{editor:'编辑器',runtimeReady:'运行环境已就绪。点击“运行代码”执行。',runCode:'运行代码',htmlRendered:'HTML 已在隔离预览中渲染。',runningSql:'正在本地运行 SQL...',sqlSuccess:'SQL 执行成功。',sqlError:'SQL 错误',submitting:'正在将代码提交到配置的运行环境...',executionFailed:'执行失败',finished:'程序已成功完成且没有输出。',executionError:'执行错误',clipboardBlocked:'浏览器阻止了剪贴板访问。',sourceFile:'源文件',consoleOutput:'控制台输出',htmlPreview:'HTML 隔离预览'},
  ru:{editor:'Редактор',runtimeReady:'Среда готова. Нажмите «Запустить код» для выполнения.',runCode:'Запустить код',htmlRendered:'HTML отображается в изолированном предпросмотре.',runningSql:'Локальное выполнение SQL...',sqlSuccess:'SQL успешно выполнен.',sqlError:'Ошибка SQL',submitting:'Отправка кода в настроенную среду выполнения...',executionFailed:'Ошибка выполнения',finished:'Программа успешно завершена без вывода.',executionError:'Ошибка выполнения',clipboardBlocked:'Браузер заблокировал доступ к буферу обмена.',sourceFile:'Исходный файл',consoleOutput:'Вывод консоли',htmlPreview:'Изолированный предпросмотр HTML'},
  ar:{editor:'المحرر',runtimeReady:'بيئة التشغيل جاهزة. انقر على "تشغيل الكود" للتنفيذ.',runCode:'تشغيل الكود',htmlRendered:'تم عرض HTML في معاينة معزولة.',runningSql:'جارٍ تشغيل SQL محليًا...',sqlSuccess:'تم تنفيذ SQL بنجاح.',sqlError:'خطأ SQL',submitting:'جارٍ إرسال الكود إلى بيئة التشغيل المُهيأة...',executionFailed:'فشل التنفيذ',finished:'اكتمل البرنامج بنجاح دون مخرجات.',executionError:'خطأ في التنفيذ',clipboardBlocked:'حظر المتصفح الوصول إلى الحافظة.',sourceFile:'الملف المصدر',consoleOutput:'مخرجات وحدة التحكم',htmlPreview:'معاينة HTML معزولة'},
  hi:{editor:'एडिटर',runtimeReady:'रनटाइम तैयार है। चलाने के लिए "कोड चलाएँ" पर क्लिक करें।',runCode:'कोड चलाएँ',htmlRendered:'HTML को सैंडबॉक्स प्रीव्यू में रेंडर किया गया है।',runningSql:'SQL स्थानीय रूप से चल रहा है...',sqlSuccess:'SQL सफलतापूर्वक चलाया गया।',sqlError:'SQL त्रुटि',submitting:'कोड को कॉन्फ़िगर किए गए रनटाइम पर भेजा जा रहा है...',executionFailed:'निष्पादन विफल',finished:'प्रोग्राम बिना आउटपुट के सफलतापूर्वक पूरा हुआ।',executionError:'निष्पादन त्रुटि',clipboardBlocked:'ब्राउज़र ने क्लिपबोर्ड एक्सेस को ब्लॉक कर दिया।',sourceFile:'सोर्स फ़ाइल',consoleOutput:'कंसोल आउटपुट',htmlPreview:'HTML सैंडबॉक्स प्रीव्यू'}
};

export default function CompilerEngine({ toolSlug, toolName, locale = 'en' }: { toolSlug: string; toolName: string; locale?: LocaleCode }) {
  const ui = getEngineUi(locale);
  const cui = COMPILER_UI[locale] ?? COMPILER_UI.en;
  const langKey = toolSlug.includes('python') ? 'python' : toolSlug.includes('javascript') ? 'javascript' : toolSlug.includes('java') && !toolSlug.includes('javascript') ? 'java' : toolSlug.includes('cpp') ? 'cpp' : toolSlug.includes('csharp') ? 'csharp' : toolSlug.includes('php') ? 'php' : toolSlug.includes('sql') ? 'sql' : 'html';
  const [code, setCode] = useState(DEFAULT_CODES[langKey]);
  const [output, setOutput] = useState(cui.runtimeReady);
  const [copied, setCopied] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [preview, setPreview] = useState(false);

  const runCode = async () => {
    if (langKey === 'html') { setPreview(true); setOutput(cui.htmlRendered); return; }
    if (langKey === 'sql') {
      setIsRunning(true); setOutput(cui.runningSql);
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
        setOutput(rows.join('\n') || cui.sqlSuccess);
      } catch (err) { setOutput(`${cui.sqlError}:\n${err instanceof Error ? err.message : 'Unknown error'}`); }
      finally { setIsRunning(false); }
      return;
    }
    setIsRunning(true); setOutput(cui.submitting);
    try {
      const response = await fetch('/api/execute-code', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({language:langKey,code}) });
      const data = await response.json().catch(()=>({}));
      if (!response.ok) throw new Error(data.error || `${cui.executionFailed} (${response.status})`);
      const parts=[data.stdout,data.stderr,data.compileOutput].filter(Boolean);
      setOutput(parts.join('\n') || cui.finished);
    } catch (err) { setOutput(`${cui.executionError}:\n${err instanceof Error ? err.message : 'Unknown error'}`); }
    finally { setIsRunning(false); }
  };


  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setOutput(cui.clipboardBlocked);
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
      const htmlPattern = /<!--.*?-->|<[/]?[A-Za-z][^>]*>/g;

      for (const match of line.matchAll(htmlPattern)) {
        const startIndex = match.index ?? 0;
        if (startIndex > last) {
          parts.push(highlightCodeLine(line.slice(last, startIndex)));
        }

        const token = match[0];
        if (token.startsWith('<!--')) {
          parts.push(wrap('text-zinc-500 italic', token));
        } else {
          const tagMatch = token.match(/^(<[/]?)([A-Za-z][\w:-]*)(.*?)([/]?>)$/);
          if (!tagMatch) {
            parts.push(escapeHtml(token));
          } else {
            const [, open, tagName, attrs, close] = tagMatch;
            let attrHtml = '';
            let attrLast = 0;
            const attrPattern = /([A-Za-z_:][\w:.-]*)(\s*=\s*)(".*?"|'.*?'|[^\s>]+)/g;

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
          <span className="text-xs font-bold uppercase tracking-wider">{toolName} {cui.editor}</span>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={copyCode} className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold transition">
            {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
            <span>{copied ? ui.copied : ui.copy}</span>
          </button>
          <button onClick={() => { setCode(DEFAULT_CODES[langKey]); setPreview(false); setOutput(cui.runtimeReady); }} className="p-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition" title={ui.reset}>
            <RotateCcw className="h-3.5 w-3.5" />
          </button>
          <button onClick={runCode} disabled={isRunning} className="flex items-center gap-1.5 px-5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition disabled:opacity-50">
            {isRunning ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Play className="h-3.5 w-3.5 fill-white" />}
            <span>{langKey === 'html' ? ui.preview : cui.runCode}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-4 font-mono text-xs shadow-inner">
          <div className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest pb-2 border-b border-zinc-800 mb-2">
            {cui.sourceFile} (main.{langKey === 'python' ? 'py' : langKey === 'html' ? 'html' : 'js'})
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
          <iframe title={cui.htmlPreview} sandbox="allow-scripts" srcDoc={code} className="w-full min-h-[420px] rounded-2xl border border-zinc-800 bg-white" />
        ) : (
          <div className="rounded-2xl border border-zinc-800 bg-black p-4 font-mono text-xs shadow-inner flex flex-col min-h-[420px]">
            <div className="flex items-center gap-2 pb-2 border-b border-zinc-800 mb-2">
              <Terminal className="h-3.5 w-3.5 text-zinc-500" />
              <span className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest">{cui.consoleOutput}</span>
            </div>
            <pre className="flex-1 text-emerald-400 whitespace-pre-wrap overflow-auto leading-relaxed">{output}</pre>
          </div>
        )}
      </div>
    </div>
  );
}
