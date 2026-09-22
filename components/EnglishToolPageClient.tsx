'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ToolEngineRunner from '@/components/ToolEngineRunner';
import ToolSeoContent from '@/components/ToolSeoContent';
import { ArrowRight } from 'lucide-react';
import { TOOLS_REGISTRY, type ToolMeta } from '@/data/toolsRegistry';

export default function EnglishToolPageClient({ tool }: { tool: ToolMeta }) {
  useEffect(() => {
    if (
      typeof window !== 'undefined' &&
      typeof (window as Window & { gtag?: (...args: unknown[]) => void }).gtag === 'function'
    ) {
      (window as Window & { gtag?: (...args: unknown[]) => void }).gtag!('event', 'tool_view', {
        tool_slug: tool.slug,
        tool_name: tool.name,
        tool_category: tool.category,
      });
    }
  }, [tool.slug, tool.name, tool.category]);

  const companionTools = TOOLS_REGISTRY
    .filter((candidate) => candidate.category === tool.category && candidate.slug !== tool.slug)
    .map((candidate) => {
      const sourceTerms = new Set(
        (tool.targetKeyword || tool.name)
          .toLowerCase()
          .split(/[^a-z0-9]+/)
          .filter((term) => term.length > 2)
      );
      const candidateTerms = (candidate.targetKeyword || candidate.name)
        .toLowerCase()
        .split(/[^a-z0-9]+/)
        .filter((term) => term.length > 2);
      const overlap = candidateTerms.filter((term) => sourceTerms.has(term)).length;
      return { candidate, overlap };
    })
    .sort((a, b) => b.overlap - a.overlap || a.candidate.name.localeCompare(b.candidate.name))
    .slice(0, 4)
    .map(({ candidate }) => candidate);

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 flex flex-col justify-between">
      <div>
        <Navbar />

        <div className="relative overflow-hidden border-b border-zinc-200/70 dark:border-white/10 bg-white dark:bg-zinc-950">
          <div className="absolute inset-0 tool-premium-grid opacity-70 dark:opacity-40" />
          <div className="absolute -top-24 right-10 h-56 w-56 rounded-full bg-violet-500/10 blur-3xl" />
          <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-12 lg:py-14">
            <div className="inline-flex items-center gap-2 rounded-full border border-violet-200/80 dark:border-violet-400/20 bg-violet-50/80 dark:bg-violet-950/30 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-violet-700 dark:text-violet-300">
              <span className="h-1.5 w-1.5 rounded-full bg-violet-500 shadow-[0_0_10px_rgba(124,58,237,.7)]" />
              {tool.category} Tool
            </div>
            <h1 className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-black tracking-[-0.03em] text-zinc-950 dark:text-white">
              {tool.name}
            </h1>
            <p className="mt-3 text-sm sm:text-base text-zinc-500 dark:text-zinc-400 max-w-3xl leading-7">
              {tool.description}
            </p>
          </div>
        </div>

        <main className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-12">
          <ToolEngineRunner tool={tool} />
          <ToolSeoContent tool={tool} />

          <div className="mt-14">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-sm sm:text-base font-bold text-zinc-950 dark:text-white">
                Related {tool.category} Tools
              </h2>
              <Link
                href={`/?category=${encodeURIComponent(tool.category)}#tools`}
                className="text-xs font-bold text-violet-600 dark:text-violet-400 hover:underline flex items-center gap-1"
              >
                Explore all {tool.category} tools <ArrowRight className="h-3 w-3" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {companionTools.map((comp) => (
                <Link
                  key={comp.slug}
                  href={`/tools/${comp.slug}`}
                  className="rounded-2xl border border-zinc-200/90 dark:border-zinc-800/80 bg-white dark:bg-zinc-900 p-4 hover:border-violet-500 dark:hover:border-violet-400 transition-all hover:-translate-y-0.5 group shadow-sm"
                >
                  <p className="text-xs font-bold text-zinc-900 dark:text-white group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors truncate">
                    {comp.name}
                  </p>
                  <p className="text-[11px] text-zinc-400 line-clamp-2 mt-1.5 font-normal leading-relaxed">
                    {comp.description}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
}
