import { notFound } from 'next/navigation';
import { LOCALES, getLocale } from '@/data/internationalSeo';
import LocalizedHomeClient from '@/components/LocalizedHomeClient';

export const dynamic = 'force-static';
export const dynamicParams = true;

export function generateStaticParams(){ return LOCALES.filter(x=>x.code!=='en').map(x=>({locale:x.code})); }

export default async function LocalizedHome({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: localeCode } = await params;
  const locale = getLocale(localeCode);
  if (!locale || locale.code === 'en') notFound();
  return <LocalizedHomeClient localeCode={locale.code} />;
}
