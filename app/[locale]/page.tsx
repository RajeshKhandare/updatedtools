import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { LOCALES, getLocale } from '@/data/internationalSeo';
import { getLocalizedUi } from '@/data/internationalLocalization';
import LocalizedHomeClient from '@/components/LocalizedHomeClient';

export const dynamicParams = false;

export function generateStaticParams(){ return LOCALES.filter(x=>x.code!=='en').map(x=>({locale:x.code})); }

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale: code } = await params;
  const locale = getLocale(code);
  if (!locale || locale.code === 'en') return {};
  const ui = getLocalizedUi(locale.code);
  return {
    title: 'Toolployee — ' + ui.toolsLabel,
    description: ui.description,
    alternates: {
      canonical: '/' + locale.code,
      languages: Object.fromEntries(LOCALES.map((item) => [item.hreflang, item.code === 'en' ? '/' : '/' + item.code])),
    },
  };
}

export default async function LocalizedHome({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: localeCode } = await params;
  const locale = getLocale(localeCode);
  if (!locale || locale.code === 'en') notFound();
  return <LocalizedHomeClient localeCode={locale.code} />;
}



