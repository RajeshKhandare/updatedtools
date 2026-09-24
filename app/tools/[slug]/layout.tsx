import type { Metadata } from 'next';
import { TOOLS_REGISTRY } from '@/data/toolsRegistry';
import { SITE_NAME, SITE_URL, SITE_URL_CONFIGURED } from '@/config/site';
import { getToolSeoContent } from '@/data/toolSeo';
import { getLocalizedAlternates } from '@/data/internationalSeo';

export function generateStaticParams() {
  return TOOLS_REGISTRY.map((tool) => ({ slug: tool.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const tool = TOOLS_REGISTRY.find((x) => x.slug === slug);
  if (!tool) return { title: 'Tool Not Found', robots: { index: false, follow: false } };

  const keyword = tool.targetKeyword || tool.name;
  const title = keyword.toLowerCase().includes('online')
    ? keyword
    : `${keyword} Online`;
  const description = `${tool.description} Use this free ${tool.name.toLowerCase()} tool in your browser with no account required.`;

  return {
    title,
    description,
    keywords: [keyword, `free ${keyword.toLowerCase()}`, `${tool.name.toLowerCase()} online`, `${tool.category.toLowerCase()} tools`, ...tool.slug.split('-').filter((part) => part.length > 2)],
    alternates: {
      canonical: `${SITE_URL}/tools/${tool.slug}`,
      languages: Object.fromEntries(
        Object.entries(getLocalizedAlternates(tool.slug)).map(([hreflang, path]) => [hreflang, SITE_URL + path])
      ),
    },
    openGraph: { title, description, url: `${SITE_URL}/tools/${tool.slug}`, siteName: SITE_NAME, type: 'website' },
    twitter: { card: 'summary_large_image', title, description },
    robots: { index: SITE_URL_CONFIGURED, follow: true },
  };
}

export default async function ToolLayout({ children, params }: { children: React.ReactNode; params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const tool = TOOLS_REGISTRY.find((x) => x.slug === slug);
  if (!tool) return children;

  const faqs = getToolSeoContent(tool).faq;

  const breadcrumb = {
    '@context': 'https://schema.org', '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: tool.category + ' Tools', item: SITE_URL + '/?category=' + encodeURIComponent(tool.category) + '#tools' },
      { '@type': 'ListItem', position: 3, name: tool.name, item: SITE_URL + '/tools/' + tool.slug },
    ],
  };
  const app = {
    '@context': 'https://schema.org', '@type': 'WebApplication',
    name: tool.name, url: SITE_URL + '/tools/' + tool.slug,
    mainEntityOfPage: SITE_URL + '/tools/' + tool.slug,
    applicationCategory: 'UtilitiesApplication', operatingSystem: 'Web Browser',
    isAccessibleForFree: true,
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    description: tool.description,
  };
  const faq = {
    '@context': 'https://schema.org', '@type': 'FAQPage',
    mainEntity: faqs.map((x) => ({ '@type': 'Question', name: x.q, acceptedAnswer: { '@type': 'Answer', text: x.a } })),
  };

  return <>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(app) }} />
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faq) }} />
    {children}
  </>;
}
