'use client';

import React from 'react';
import { BarChart3, CheckCircle2, FileText, Image as ImageIcon, Code2, Type, ArrowRight, Calculator, Youtube, RefreshCw, ShieldCheck } from 'lucide-react';
import { ToolMeta } from '@/data/toolsRegistry';
import { getToolSeoContent } from '@/data/toolSeo';

function VisualPanel({ tool, visual }: { tool: ToolMeta; visual: ReturnType<typeof getToolSeoContent>['visual'] }) {
  const common = 'rounded-3xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 shadow-sm';
  if (visual === 'finance') {
    return <div className={common}>
      <div className="flex items-center gap-2 mb-4"><Calculator className="h-5 w-5 text-violet-600" /><h3 className="font-bold">How the calculation behaves</h3></div>
      <div className="grid grid-cols-4 items-end gap-3 h-40">
        {[28, 40, 55, 74].map((height, i) => <div key={i} className="flex flex-col items-center gap-2"><div className="w-full rounded-t-xl bg-violet-500/20 dark:bg-violet-400/20" style={{ height: height + '%' }} /><span className="text-[10px] text-zinc-500">Scenario {i + 1}</span></div>)}
      </div>
      <p className="mt-3 text-[11px] leading-5 text-zinc-500">Illustrative visual only. Actual results depend on the values and assumptions entered into {tool.name}.</p>
    </div>;
  }
  if (visual === 'formats') return <div className={common}><div className="flex items-center gap-2 mb-4"><ImageIcon className="h-5 w-5 text-violet-600" /><h3 className="font-bold">Image workflow</h3></div><div className="grid grid-cols-3 gap-2 text-xs font-semibold">{['Input image','Transform','Output'].map((x,i)=><React.Fragment key={x}><div className="rounded-2xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 p-4 text-center">{x}</div>{i<2&&<ArrowRight className="h-4 w-4 self-center text-zinc-400" />}</React.Fragment>)}</div><p className="mt-3 text-[11px] leading-5 text-zinc-500">Choose output format and quality based on compatibility, transparency, dimensions, and intended use.</p></div>;
  if (visual === 'converter') return <div className={common}><div className="flex items-center gap-2 mb-4"><RefreshCw className="h-5 w-5 text-violet-600" /><h3 className="font-bold">Conversion path</h3></div><div className="flex items-center justify-between gap-2"><span className="rounded-2xl bg-violet-50 dark:bg-violet-950/40 px-4 py-3 text-sm font-bold">Source unit</span><ArrowRight className="h-5 w-5 text-zinc-400" /><span className="rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 px-4 py-3 text-sm font-bold">Converted value</span></div><p className="mt-3 text-[11px] leading-5 text-zinc-500">Always confirm the source and target units before using a converted value in technical or regulated work.</p></div>;
  if (visual === 'code') return <div className={common}><div className="flex items-center gap-2 mb-4"><Code2 className="h-5 w-5 text-violet-600" /><h3 className="font-bold">Developer workflow</h3></div><div className="space-y-2 font-mono text-xs"><div className="rounded-xl bg-zinc-950 text-zinc-300 p-3">input → validate</div><div className="rounded-xl bg-violet-950/50 text-violet-200 p-3">process → transform → test</div><div className="rounded-xl bg-emerald-950/50 text-emerald-200 p-3">output → inspect → reuse</div></div><p className="mt-3 text-[11px] leading-5 text-zinc-500">For development work, validate important output in the target application or trusted local tooling.</p></div>;
  if (visual === 'text') return <div className={common}><div className="flex items-center gap-2 mb-4"><Type className="h-5 w-5 text-violet-600" /><h3 className="font-bold">Text transformation flow</h3></div><div className="grid grid-cols-3 gap-2 text-xs"><div className="rounded-2xl border p-4">Raw text</div><div className="rounded-2xl border p-4 bg-violet-50 dark:bg-violet-950/30">Transform</div><div className="rounded-2xl border p-4 bg-emerald-50 dark:bg-emerald-950/30">Clean output</div></div><p className="mt-3 text-[11px] leading-5 text-zinc-500">Keep a source copy when the operation changes or removes text.</p></div>;
  if (visual === 'youtube') return <div className={common}><div className="flex items-center gap-2 mb-4"><Youtube className="h-5 w-5 text-violet-600" /><h3 className="font-bold">Creator workflow</h3></div><div className="grid grid-cols-3 gap-2 text-xs"><div className="rounded-2xl border p-4">Video/topic</div><div className="rounded-2xl border p-4 bg-violet-50 dark:bg-violet-950/30">Tool analysis</div><div className="rounded-2xl border p-4 bg-emerald-50 dark:bg-emerald-950/30">Creator output</div></div><p className="mt-3 text-[11px] leading-5 text-zinc-500">Public platform data and estimates can change; use outputs as planning aids.</p></div>;
  return <div className={common}><div className="flex items-center gap-2 mb-4"><FileText className="h-5 w-5 text-violet-600" /><h3 className="font-bold">Document workflow</h3></div><div className="flex items-center justify-between gap-2"><div className="rounded-2xl border p-4 text-center text-xs font-semibold">Source</div><ArrowRight className="h-5 w-5 text-zinc-400" /><div className="rounded-2xl bg-violet-50 dark:bg-violet-950/30 border p-4 text-center text-xs font-semibold">Process</div><ArrowRight className="h-5 w-5 text-zinc-400" /><div className="rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border p-4 text-center text-xs font-semibold">Review</div></div><p className="mt-3 text-[11px] leading-5 text-zinc-500">Keep an original copy and inspect the generated document before sharing or submitting it.</p></div>;
}

export default function ToolSeoContent({ tool }: { tool: ToolMeta }) {
  const seo = getToolSeoContent(tool);
  return <section className="mt-14 border-t border-zinc-200/80 dark:border-zinc-800 pt-12">
    <div className="max-w-5xl mx-auto">
      <div className="mb-8">
        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-violet-600 dark:text-violet-400">Complete tool guide</span>
        <h2 className="mt-2 text-2xl sm:text-3xl font-black tracking-tight">Everything you need to know about {tool.name}</h2>
        <p className="mt-3 text-sm sm:text-base leading-7 text-zinc-600 dark:text-zinc-400">{seo.intro}</p>
      </div>

      <div className="grid lg:grid-cols-[1.1fr_.9fr] gap-6">
        <div className="rounded-3xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 sm:p-7">
          <h3 className="text-lg font-bold">Why use {tool.name}?</h3>
          <p className="mt-3 text-sm leading-7 text-zinc-600 dark:text-zinc-400">{seo.why}</p>
          {seo.formula && <div className="mt-5 rounded-2xl bg-zinc-950 text-zinc-100 p-5"><div className="text-[10px] uppercase tracking-widest text-violet-300 font-bold mb-2">Calculation model</div><p className="font-mono text-xs sm:text-sm leading-6">{seo.formula}</p></div>}
        </div>
        <VisualPanel tool={tool} visual={seo.visual} />
      </div>

      <div className="mt-6 grid md:grid-cols-2 gap-6">
        <div className="rounded-3xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6">
          <h3 className="text-lg font-bold">How to use it</h3>
          <ol className="mt-4 space-y-4">{seo.steps.map((step, i)=><li key={step} className="flex gap-3"><span className="h-6 w-6 shrink-0 rounded-full bg-violet-100 dark:bg-violet-950/60 text-violet-700 dark:text-violet-300 text-xs font-bold flex items-center justify-center">{i+1}</span><p className="text-sm leading-6 text-zinc-600 dark:text-zinc-400">{step}</p></li>)}</ol>
        </div>
        <div className="rounded-3xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6">
          <h3 className="text-lg font-bold">Common use cases</h3>
          <ul className="mt-4 space-y-3">{seo.useCases.map(x=><li key={x} className="flex gap-3 text-sm leading-6 text-zinc-600 dark:text-zinc-400"><CheckCircle2 className="h-4 w-4 mt-1 shrink-0 text-emerald-500"/>{x}</li>)}</ul>
        </div>
      </div>

      <div className="mt-6 grid md:grid-cols-2 gap-6">
        <div className="rounded-3xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6">
          <h3 className="text-lg font-bold">Best practices</h3>
          <ul className="mt-4 space-y-3">{seo.tips.map(x=><li key={x} className="text-sm leading-6 text-zinc-600 dark:text-zinc-400">• {x}</li>)}</ul>
        </div>
        <div className="rounded-3xl border border-amber-200/80 dark:border-amber-900/40 bg-amber-50/50 dark:bg-amber-950/10 p-6">
          <div className="flex items-center gap-2"><ShieldCheck className="h-5 w-5 text-amber-600"/><h3 className="text-lg font-bold">Important limitations</h3></div>
          <ul className="mt-4 space-y-3">{seo.limitations.map(x=><li key={x} className="text-sm leading-6 text-zinc-600 dark:text-zinc-400">• {x}</li>)}</ul>
        </div>
      </div>

      <div className="mt-6 rounded-3xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 sm:p-7">
        <div className="flex items-center gap-2"><BarChart3 className="h-5 w-5 text-violet-600"/><h3 className="text-lg font-bold">Quick reference</h3></div>
        <div className="mt-5 grid sm:grid-cols-3 gap-3">
          <div className="rounded-2xl bg-zinc-50 dark:bg-zinc-950 p-4"><p className="text-[10px] uppercase tracking-wider text-zinc-400">Category</p><p className="mt-1 text-sm font-bold">{tool.category}</p></div>
          <div className="rounded-2xl bg-zinc-50 dark:bg-zinc-950 p-4"><p className="text-[10px] uppercase tracking-wider text-zinc-400">Primary intent</p><p className="mt-1 text-sm font-bold">{tool.targetKeyword || tool.name}</p></div>
          <div className="rounded-2xl bg-zinc-50 dark:bg-zinc-950 p-4"><p className="text-[10px] uppercase tracking-wider text-zinc-400">Access</p><p className="mt-1 text-sm font-bold">Browser-based</p></div>
        </div>
      </div>

      <div className="mt-6">
        <h3 className="text-xl font-bold">Frequently asked questions</h3>
        <div className="mt-4 grid md:grid-cols-2 gap-4">
          {seo.faq.map(item=><details key={item.q} className="group rounded-2xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5"><summary className="cursor-pointer list-none pr-6 text-sm font-bold text-zinc-900 dark:text-white">{item.q}</summary><p className="mt-3 text-sm leading-6 text-zinc-600 dark:text-zinc-400">{item.a}</p></details>)}
        </div>
      </div>
    </div>
  </section>;
}
