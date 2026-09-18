import type { Metadata } from 'next';
import { TOOLS_REGISTRY } from '@/data/toolsRegistry';

const SITE_URL = 'https://thetoolgenie.com';

export function generateStaticParams() {
  return TOOLS_REGISTRY.map((tool) => ({ slug: tool.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const tool = TOOLS_REGISTRY.find((x) => x.slug === params.slug);

  if (!tool) {
    return {
      title: 'Tool Not Found',
      robots: { index: false, follow: false },
    };
  }

  const keyword = tool.targetKeyword || tool.name;
  const title = `${tool.name} - Free Online ${tool.category} Tool | TheToolsGenie`;
  const description = `${tool.description} Use this free online ${keyword.toLowerCase()} tool in your browser with no account required.`;

  return {
    title,
    description,
    keywords: [keyword, `${keyword} online`, `free ${keyword.toLowerCase()}`, `${tool.category} tools`, `${tool.name} free`],
    alternates: { canonical: `${SITE_URL}/tools/${tool.slug}` },
    openGraph: {
      title,
      description,
      url: `${SITE_URL}/tools/${tool.slug}`,
      siteName: 'TheToolsGenie',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
    robots: { index: true, follow: true },
  };
}

export default function ToolLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { slug: string };
}) {
  const tool = TOOLS_REGISTRY.find((x) => x.slug === params.slug);
  if (!tool) return children;

  const faqs = [
    {
      q: `Are my files or inputs safe while using ${tool.name}?`,
      a:
        tool.category === 'Compiler'
          ? 'SQL and browser-preview operations can run locally, while compiled languages may use the configured execution runtime. Do not submit passwords, API keys, or other sensitive secrets as source code.'
          : `For browser-based ${tool.category.toLowerCase()} tools, processing is performed in your browser. Your selected files are not intentionally uploaded by the tool engine.`,
    },
    {
      q: `Is ${tool.name} free to use?`,
      a: `${tool.name} is available without a paid account. Browser, device-memory, file-size, or third-party runtime limits can still apply depending on the tool.`,
    },
    {
      q: `Can I use ${tool.name} on mobile or tablet devices?`,
      a: 'The interface is responsive and works in modern desktop and mobile browsers. Large files and compute-heavy operations may perform differently depending on the device.',
    },
  ];

  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
      {
        '@type': 'ListItem',
        position: 2,
        name: tool.category + ' Tools',
        item: SITE_URL + '/?category=' + encodeURIComponent(tool.category) + '#tools',
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: tool.name,
        item: SITE_URL + '/tools/' + tool.slug,
      },
    ],
  };

  const app = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: tool.name,
    url: SITE_URL + '/tools/' + tool.slug,
    applicationCategory: 'UtilitiesApplication',
    operatingSystem: 'Web Browser',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    description: tool.description,
  };

  const faq = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((x) => ({
      '@type': 'Question',
      name: x.q,
      acceptedAnswer: { '@type': 'Answer', text: x.a },
    })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(app) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faq) }} />
      {children}
    </>
  );
}
