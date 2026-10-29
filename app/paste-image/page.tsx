import type { Metadata } from 'next';
import PasteImageTool from './PasteImageTool';

const canonical = 'https://paste.toolployee.com/';

export const metadata: Metadata = {
  title: 'Paste Image to Download – Free Clipboard Image Tool',
  description: 'Paste a screenshot or clipboard image with Ctrl+V and download it as PNG, JPG, or WebP. Free, fast image conversion processed in your browser.',
  alternates: { canonical },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Paste Image to Download | Toolployee',
    description: 'Paste clipboard images and download them as PNG, JPG, or WebP. Free and processed in your browser.',
    url: canonical,
    siteName: 'Toolployee',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Paste Image to Download | Toolployee',
    description: 'Paste clipboard images and download them as PNG, JPG, or WebP.',
  },
};

export default function PasteImagePage() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Paste Image to Download',
    url: canonical,
    applicationCategory: 'UtilitiesApplication',
    operatingSystem: 'Any',
    isAccessibleForFree: true,
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    description: 'Paste clipboard images and download them as PNG, JPG, or WebP using browser-side processing.',
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <PasteImageTool />
    </>
  );
}
