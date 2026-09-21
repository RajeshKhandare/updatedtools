import Link from 'next/link';
import { notFound } from 'next/navigation';
import { TOOLS_REGISTRY } from '@/data/toolsRegistry';
import { LOCALES, getLocale, localizedToolPath } from '@/data/internationalSeo';
import { getLocalizedToolName, getLocalizedUi } from '@/data/internationalLocalization';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const dynamicParams = false;

export function generateStaticParams() {
  return LOCALES.filter((locale) => locale.code !== 'en').map((locale) => ({ locale: locale.code }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: code } = await params;
  const locale = getLocale(code);
  if (!locale || locale.code === 'en') return {};
  const ui = getLocalizedUi(locale.code);
  return {
    title: 'Toolployee — ' + ui.freeLabel,
    description: ui.description,
    robots: { index: false, follow: true },
  };
}

export default async function LocalizedHome({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: code } = await params;
  const locale = getLocale(code);
  if (!locale || locale.code === 'en') notFound();
  const ui = getLocalizedUi(locale.code);
  const tools = TOOLS_REGISTRY.slice(0, 24);

  return (
    <main lang={locale.code} dir={locale.code === 'ar' ? 'rtl' : 'ltr'} className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100">
      <Navbar />
      <section className="mx-auto max-w-5xl px-4 pt-12 pb-10 text-center">
        <p className="text-xs font-bold uppercase tracking-widest text-violet-600 dark:text-violet-400">{ui.freeLabel}</p>
        <h1 className="mt-3 text-4xl sm:text-5xl font-black tracking-tight">Toolployee</h1>
        <p className="mt-4 max-w-2xl mx-auto text-sm sm:text-base leading-7 text-zinc-600 dark:text-zinc-400">{ui.description}</p>
        <Link href={'/' + locale.code + '/tools'} className="mt-7 inline-flex rounded-2xl bg-violet-600 px-6 py-3 text-sm font-bold text-white hover:bg-violet-700">
          {ui.toolLabel} — {locale.languageName}
        </Link>
      </section>

      <section className="mx-auto max-w-7xl px-4 sm:px-6 pb-16">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {tools.map((tool) => (
            <Link key={tool.slug} href={localizedToolPath(locale.code, tool.slug)} className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 hover:border-violet-400 hover:shadow-md transition-all">
              <h2 className="text-sm font-bold">{getLocalizedToolName(tool, locale.code)}</h2>
              <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-400">{tool.category} · {ui.browserLabel}</p>
            </Link>
          ))}
        </div>
      </section>
      <Footer />
    </main>
  );
}
