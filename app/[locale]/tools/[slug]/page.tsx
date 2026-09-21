import Link from 'next/link';
import { notFound } from 'next/navigation';
import { TOOLS_REGISTRY } from '@/data/toolsRegistry';
import { getLocale, localizedToolPath } from '@/data/internationalSeo';
import { getLocalizedToolName, getLocalizedUi } from '@/data/internationalLocalization';
import { SITE_URL } from '@/config/site';
import ToolEngineRunner from '@/components/ToolEngineRunner';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default async function LocalizedToolPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale: localeCode, slug } = await params;
  const locale = getLocale(localeCode);
  const tool = TOOLS_REGISTRY.find((x) => x.slug === slug);
  if (!locale || !tool) notFound();

  const ui = getLocalizedUi(locale.code);
  const name = getLocalizedToolName(tool, locale.code);
  const url = SITE_URL + localizedToolPath(locale.code, tool.slug);

  return (
    <main lang={locale.code} dir={locale.code === 'ar' ? 'rtl' : 'ltr'} className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100">
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        <nav className="text-xs text-zinc-500 mb-8">
          <Link href={`/${locale.code}`} className="hover:underline">Toolployee</Link> / {name}
        </nav>
        <header className="rounded-3xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 sm:p-8">
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-violet-600 dark:text-violet-400">{ui.freeLabel}</p>
          <h1 className="mt-3 text-3xl sm:text-4xl font-black tracking-tight">{name}</h1>
          <p className="mt-3 text-sm sm:text-base leading-7 text-zinc-600 dark:text-zinc-400">{ui.description}</p>
          <p className="mt-2 text-xs font-semibold text-zinc-500">{ui.browserLabel}</p>
        </header>
        <div className="mt-8">
          <ToolEngineRunner tool={tool} />
        </div>
        <section className="mt-10 rounded-3xl border border-amber-200/80 dark:border-amber-900/40 bg-amber-50/60 dark:bg-amber-950/10 p-6">
          <h2 className="text-lg font-bold">{ui.guideLabel}</h2>
          <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
            This localized route is part of Toolployee's international SEO coverage. The route is intentionally kept out of search indexing until the full tool guide, FAQs, examples, and keyword targeting are localized and reviewed for this language.
          </p>
          <Link href={`/tools/${tool.slug}`} className="mt-4 inline-flex text-sm font-bold text-violet-600 hover:underline">
            Open English version
          </Link>
        </section>
      </div>
      <Footer />
    </main>
  );
}
