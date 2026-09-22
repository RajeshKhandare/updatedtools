import Link from 'next/link';
import { notFound } from 'next/navigation';
import { TOOLS_REGISTRY } from '@/data/toolsRegistry';
import { LOCALES, getLocale, localizedToolPath } from '@/data/internationalSeo';
import { getLocalizedToolName, getLocalizedUi, getLocalizedCategoryLabel } from '@/data/internationalLocalization';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';


export const dynamic = 'force-static';
export const dynamicParams = true;

export function generateStaticParams() {
  return LOCALES.filter((locale) => locale.code !== 'en').map((locale) => ({ locale: locale.code }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: code } = await params;
  const locale = getLocale(code);
  if (!locale || locale.code === 'en') return {};
  const ui = getLocalizedUi(locale.code);
  return { title: 'Toolployee — ' + ui.toolLabel + 's', description: ui.description, robots: { index: false, follow: true } };
}

export default async function LocalizedToolsIndex({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: code } = await params;
  const locale = getLocale(code);
  if (!locale || locale.code === 'en') notFound();
  const ui = getLocalizedUi(locale.code);

  return (
    <main lang={locale.code} dir={locale.code === 'ar' ? 'rtl' : 'ltr'} className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100">
      <Navbar />
      <section className="mx-auto max-w-7xl px-4 sm:px-6 py-10">
        <Link href={'/' + locale.code} className="text-xs font-bold text-violet-600 hover:underline">Toolployee</Link>
        <h1 className="mt-4 text-3xl sm:text-4xl font-black">{ui.toolsLabel}</h1>
        <p className="mt-3 text-sm text-zinc-600 dark:text-zinc-400">{ui.description}</p>
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {TOOLS_REGISTRY.map((tool) => (
            <Link key={tool.slug} href={localizedToolPath(locale.code, tool.slug)} className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 hover:border-violet-400 hover:shadow-md transition-all">
              <h2 className="text-sm font-bold">{getLocalizedToolName(tool, locale.code)}</h2>
              <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-400">{getLocalizedCategoryLabel(tool.category, locale.code)}</p>
            </Link>
          ))}
        </div>
      </section>
      <Footer />
    </main>
  );
}
