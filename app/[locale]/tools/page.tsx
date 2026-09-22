import { notFound } from 'next/navigation';
import { getLocale, localizedToolPath, LOCALES } from '@/data/internationalSeo';
import { getLocalizedUi } from '@/data/internationalLocalization';
import LocalizedToolsIndexClient from '@/components/LocalizedToolsIndexClient';

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
    title: 'Toolployee — ' + ui.toolsLabel,
    description: ui.description,
    robots: { index: true, follow: true },
    alternates: {
      canonical: '/' + locale.code + '/tools',
      languages: Object.fromEntries(LOCALES.map((item) => [item.hreflang, item.code === 'en' ? '/tools' : '/' + item.code + '/tools'])),
    },
  };
}

export default async function LocalizedToolsIndex({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: code } = await params;
  const locale = getLocale(code);
  if (!locale || locale.code === 'en') notFound();
  const ui = getLocalizedUi(locale.code);
  return <LocalizedToolsIndexClient locale={locale.code} ui={ui} />;
}
