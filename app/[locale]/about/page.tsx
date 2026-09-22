import type { Metadata } from 'next';
// Localized platform page build verification.
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
    title: 'About Toolployee — ' + locale.languageName,
    description: 'Learn about Toolployee, its browser-based architecture, and its free online tools for everyday digital tasks.',
    alternates: {
      canonical: '/' + locale.code + '/about',
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

  return <LocalizedPlatformPage locale={locale.code} page="about" />;
}
