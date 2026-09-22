import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { TOOLS_REGISTRY } from '@/data/toolsRegistry';
import { getLocale, LOCALES, localizedToolPath } from '@/data/internationalSeo';
import { getLocalizedToolName, getLocalizedUi } from '@/data/internationalLocalization';
import { SITE_NAME, SITE_URL } from '@/config/site';

export function generateStaticParams() {
  return LOCALES.flatMap((locale) =>
    TOOLS_REGISTRY.map((tool) => ({ locale: locale.code, slug: tool.slug }))
  );
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }): Promise<Metadata> {
  const { locale: localeCode, slug } = await params;
  const locale = getLocale(localeCode);
  const tool = TOOLS_REGISTRY.find((x) => x.slug === slug);
  if (!locale || !tool) return { title: 'Tool Not Found', robots: { index: false, follow: false } };

  const name = getLocalizedToolName(tool, locale.code);
  const ui = getLocalizedUi(locale.code);
  const title = name === tool.name ? `${name} Online` : name;
  const description = `${ui.freeLabel}. ${ui.description} ${name}.`;
  const url = SITE_URL + localizedToolPath(locale.code, tool.slug);

  return {
    title,
    description,
    alternates: {
      canonical: url,
      languages: Object.fromEntries(LOCALES.map((item) => [item.hreflang, SITE_URL + localizedToolPath(item.code, tool.slug)])),
    },
    openGraph: { title, description, url, siteName: SITE_NAME, type: 'website', locale: locale.hreflang },
    twitter: { card: 'summary_large_image', title, description },
    robots: { index: true, follow: true },
  };
}

export default async function LocalizedToolLayout({ children, params }: { children: React.ReactNode; params: Promise<{ locale: string; slug: string }> }) {
  const { locale: localeCode, slug } = await params;
  const locale = getLocale(localeCode);
  const tool = TOOLS_REGISTRY.find((x) => x.slug === slug);
  if (!locale || !tool) notFound();

  const url = SITE_URL + localizedToolPath(locale.code, tool.slug);
  const englishUrl = SITE_URL + '/tools/' + tool.slug;
  const name = getLocalizedToolName(tool, locale.code);

  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: name, item: url },
    ],
  };

  return <>
    <link rel="alternate" hrefLang="en" href={englishUrl} />
    <link rel="alternate" hrefLang={locale.hreflang} href={url} />
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
    {children}
  </>;
}
