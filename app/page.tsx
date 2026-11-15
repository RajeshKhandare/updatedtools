import type { Metadata } from 'next';
import { SITE_NAME, SITE_URL } from '@/config/site';
import { LOCALES } from '@/data/internationalSeo';
import HomePageClient from '@/components/HomePageClient';

export const metadata: Metadata = {
  title: `${SITE_NAME} | Free Online Tools`,
  description: 'Free online PDF, image, developer, text, converter, calculator, finance, compiler, and YouTube tools. Fast browser-based utilities with no account required.',
  alternates: {
    canonical: SITE_URL + '/',
    languages: Object.fromEntries(
      LOCALES.map((locale) => [
        locale.hreflang,
        SITE_URL + (locale.code === 'en' ? '/' : '/' + locale.code + '/'),
      ])
    ),
  },
  openGraph: {
    title: `${SITE_NAME} | Free Online Tools`,
    description: 'Free online tools for PDF, images, code, text, conversions, calculators, finance, and YouTube.',
    url: SITE_URL + '/',
    siteName: SITE_NAME,
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: `${SITE_NAME} | Free Online Tools`,
    description: 'Free browser-based tools for PDF, images, code, text, conversions, calculators, finance, and YouTube.',
  },
};

export default function HomePage() {
  return <HomePageClient />;
}
