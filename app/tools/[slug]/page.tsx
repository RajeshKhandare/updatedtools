'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ToolEngineRunner from '@/components/ToolEngineRunner';
import { TOOLS_REGISTRY } from '@/data/toolsRegistry';
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  ChevronDown,
  HelpCircle,
  Lock,
} from 'lucide-react';

export default function ToolPage({
  params,
}: {
  params: { slug: string };
}) {
  const tool = TOOLS_REGISTRY.find(
    (item) => item.slug === params.slug
  );

  const [openFaq, setOpenFaq] = useState<number | null>(null);

  if (!tool) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-950">
        <p className="text-sm text-zinc-500">Tool not found.</p>
      </div>
    );
  }

  const companionTools = TOOLS_REGISTRY.filter(
    (item) =>
      item.category === tool.category &&
      item.slug !== tool.slug
  ).slice(0, 4);

  const faqs = [
    {
      q: `How do I use ${tool.name}?`,
      a: `Enter or upload the required input in the tool workspace, configure the available options, then run the tool and download or copy the result.`,
    },
    {
      q: `Is ${tool.name} free to use?`,
      a: `${tool.name} is provided as a free utility. Some compiler tools may depend on the configured execution runtime, while browser-based tools process data locally.`,
    },
    {
      q: `Are my files uploaded to a server?`,
      a: `PDF and image processing in the browser-based engines is performed locally. Compiler languages that use the execution API send the submitted source code to that runtime for execution.`,
    },
  ];

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 flex flex-col">
      <Navbar />

      <header className="border-b border-zinc-200/80 dark:border-zinc-800/80 bg-white dark:bg-zinc-900/50 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-zinc-950 dark:text-white">
            {tool.name}
          </h1>
          <p className="mt-1.5 text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 max-w-3xl">
            {tool.description}
          </p>
        </div>
      </header>

      <main className="max-w-6xl mx-auto w-full px-4 sm:px-6 py-10 flex-1">
        <ToolEngineRunner tool={tool} />

        <section className="mt-14 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="rounded-3xl border border-zinc-200/90 dark:border-zinc-800/80 bg-white dark:bg-zinc-900 p-6 sm:p-7 shadow-sm">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-50 dark:bg-violet-950/60 text-violet-600 dark:text-violet-400">
                <BookOpen className="h-4 w-4" />
              </div>
              <h2 className="text-sm sm:text-base font-bold text-zinc-950 dark:text-white">
                How to use {tool.name}
              </h2>
            </div>

            <div className="space-y-3">
              {[
                'Enter your values, text, code, or upload the required file.',
                'Choose the available options and run the tool.',
                'Review the result, then copy or download it.',
              ].map((text, index) => (
                <div
                  key={text}
                  className="flex items-start gap-3"
                >
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-violet-100 dark:bg-violet-950/70 text-[11px] font-bold text-violet-700 dark:text-violet-300 mt-0.5">
                    {index + 1}
                  </span>
                  <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                    {text}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-zinc-200/90 dark:border-zinc-800/80 bg-white dark:bg-zinc-900 p-6 sm:p-7 shadow-sm">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
                <Lock className="h-4 w-4" />
              </div>
              <h2 className="text-sm sm:text-base font-bold text-zinc-950 dark:text-white">
                Processing & privacy
              </h2>
            </div>

            <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
              Browser-based PDF, image, text, converter, calculator, finance,
              and SQL tools process their inputs in the browser. Compiler
              languages that use the execution API require code to be sent to
              that runtime.
            </p>

            <div className="mt-5 pt-4 border-t border-zinc-100 dark:border-zinc-800/70 flex items-center gap-2 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="h-4 w-4 shrink-0" />
              <span>Clear processing behavior for this tool</span>
            </div>
          </div>
        </section>

        <section className="mt-14 max-w-4xl mx-auto">
          <div className="text-center mb-6">
            <span className="inline-flex items-center gap-1 text-xs font-bold text-violet-600 dark:text-violet-400 uppercase tracking-widest">
              <HelpCircle className="h-3.5 w-3.5" />
              Support & FAQs
            </span>
            <h2 className="mt-1 text-lg sm:text-xl font-bold text-zinc-900 dark:text-white">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, index) => {
              const open = openFaq === index;

              return (
                <div
                  key={faq.q}
                  className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden shadow-sm"
                >
                  <button
                    type="button"
                    onClick={() =>
                      setOpenFaq(open ? null : index)
                    }
                    className="flex w-full items-center justify-between gap-4 p-4 sm:p-5 text-left text-xs sm:text-sm font-bold text-zinc-900 dark:text-white hover:text-violet-600 transition-colors"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      className={`h-4 w-4 shrink-0 text-zinc-400 transition-transform ${
                        open
                          ? 'rotate-180 text-violet-600'
                          : ''
                      }`}
                    />
                  </button>

                  {open && (
                    <div className="px-5 pb-5 text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed border-t border-zinc-100 dark:border-zinc-800/60 pt-3">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {companionTools.length > 0 && (
          <section className="mt-14">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-sm sm:text-base font-bold text-zinc-950 dark:text-white">
                Related {tool.category} Tools
              </h2>

              <Link
                href={`/?category=${encodeURIComponent(
                  tool.category
                )}#tools`}
                className="text-xs font-bold text-violet-600 dark:text-violet-400 hover:underline flex items-center gap-1"
              >
                Explore all
                <ArrowRight className="h-3 w-3" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {companionTools.map((companion) => (
                <Link
                  key={companion.slug}
                  href={`/tools/${companion.slug}`}
                  className="rounded-2xl border border-zinc-200/90 dark:border-zinc-800/80 bg-white dark:bg-zinc-900 p-4 hover:border-violet-500 dark:hover:border-violet-400 transition-all hover:-translate-y-0.5 group shadow-sm"
                >
                  <p className="text-xs font-bold text-zinc-900 dark:text-white group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors truncate">
                    {companion.name}
                  </p>
                  <p className="text-[11px] text-zinc-400 line-clamp-2 mt-1.5 leading-relaxed">
                    {companion.description}
                  </p>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}
