import type { Metadata } from 'next';
import { SITE_NAME, SITE_URL } from '@/config/site';

export const metadata: Metadata = {
  title: 'All Free Online Tools | PDF, Image, Developer, Converter & Calculator Tools',
  description: `Browse ${SITE_NAME} directory of 88 free online tools for PDF files, images, developers, text, unit conversion, calculators, finance, compilers, and YouTube.`,
  keywords: ['free online tools','online tools directory','PDF tools','image tools','developer tools','online converters','online calculators','free browser tools'],
  alternates: { canonical: SITE_URL + '/tools' },
  openGraph: {
    title: `All Free Online Tools | ${SITE_NAME}`,
    description: 'Browse 88 free online tools for PDF, images, code, text, conversions, calculators, finance, and YouTube.',
    url: SITE_URL + '/tools',
    siteName: SITE_NAME,
    type: 'website',
  },
  robots: { index: true, follow: true },
};

export default function ToolsLayout({ children }: { children: React.ReactNode }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: `${SITE_NAME} Free Online Tools Directory`,
    url: SITE_URL + '/tools',
    description: 'Directory of 88 free online tools across PDF, image, developer, text, converter, calculator, finance, compiler, and YouTube categories.',
    isPartOf: { '@type': 'WebSite', name: SITE_NAME, url: SITE_URL },
  };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      {children}
    </>
  );
}
