import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { LOCALES, getLocale } from '@/data/internationalSeo';
import LocalizedPlatformPage from '@/components/LocalizedPlatformPage';

export const dynamicParams = false;

export function generateStaticParams() {
  return LOCALES.filter((locale) => locale.code !== 'en').map((locale) => ({
    locale: locale.code,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: code } = await params;
  const locale = getLocale(code);
  if (!locale || locale.code === 'en') return {};
  return {
    title: 'Privacy Policy | Toolployee — ' + locale.languageName,
    description: 'Learn how Toolployee handles tool inputs, browser processing, analytics, advertising, and contact submissions.',
    alternates: {
      canonical: '/' + locale.code + '/privacy-policy',
      languages: Object.fromEntries(LOCALES.map((item) => [item.hreflang, '/' + item.code + '/privacy-policy'])),
    },
  };
}

export default async function LocalizedPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: code } = await params;
  const locale = getLocale(code);
  if (!locale || locale.code === 'en') notFound();

  return <LocalizedPlatformPage locale={locale.code} page="privacy" />;
}
