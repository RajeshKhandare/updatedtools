import type { Metadata } from 'next';

const SITE_URL = 'https://thetoolgenie.com';

export const metadata: Metadata = {
  title: 'All Free Online Tools | PDF, Image, Developer, Converter & Calculator Tools',
  description: 'Browse TheToolsGenie directory of 88 free online tools for PDF files, images, developers, text, unit conversion, calculators, finance, compilers, and YouTube.',
  keywords: ['free online tools','online tools directory','PDF tools','image tools','developer tools','online converters','online calculators','free browser tools'],
  alternates: { canonical: SITE_URL + '/tools' },
  openGraph: {
    title: 'All Free Online Tools | TheToolsGenie',
    description: 'Browse 88 free browser-based tools for PDF, images, code, text, conversions, calculators, finance, and YouTube.',
    url: SITE_URL + '/tools',
    siteName: 'TheToolsGenie',
    type: 'website',
  },
  robots: { index: true, follow: true },
};

export default function ToolsLayout({ children }: { children: React.ReactNode }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'TheToolsGenie Free Online Tools Directory',
    url: SITE_URL + '/tools',
    description: 'Directory of free browser-based online tools.',
    isPartOf: { '@type': 'WebSite', name: 'TheToolsGenie', url: SITE_URL },
  };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      {children}
    </>
  );
}
