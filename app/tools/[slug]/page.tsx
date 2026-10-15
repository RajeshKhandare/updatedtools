import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { TOOLS_REGISTRY } from '@/data/toolsRegistry';
import EnglishToolPageClient from '@/components/EnglishToolPageClient';
import { LOCALES, localizedToolPath } from '@/data/internationalSeo';
import { SITE_NAME, SITE_URL } from '@/config/site';
import { getToolSeoContent } from '@/data/toolSeo';

export const dynamicParams = false;

export function generateStaticParams() {
  return TOOLS_REGISTRY.map((tool) => ({ slug: tool.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const tool = TOOLS_REGISTRY.find((t) => t.slug === slug);
  if (!tool) return { title: 'Tool Not Found', robots: { index: false, follow: false } };
  const seo = getToolSeoContent(tool);
  const isMergePdf = tool.slug === 'merge-pdf';
  const keyword = tool.targetKeyword || tool.name;
  const title = isMergePdf
    ? 'Merge PDF Files Online Free – Combine PDFs in Order | Toolployee'
    : `${keyword} Online | Toolployee`;
  const rawDescription = isMergePdf
    ? 'Merge multiple PDF files into one document online for free. Arrange files in the right order, combine reports or scanned pages, and download one PDF.'
    : `${tool.description} Use this free online ${keyword.toLowerCase()} tool to complete the task and review your result.`;
  const description = rawDescription.length > 158 ? `${rawDescription.slice(0, 155).trimEnd()}…` : rawDescription;
  const languages = tool.category === 'Festival'
    ? LOCALES.filter((item) => item.code === 'en' || item.code === 'hi')
    : LOCALES;
  return {
    title,
    description,
    keywords: [tool.targetKeyword, ...seo.useCases].filter(Boolean) as string[],
    alternates: {
      canonical: SITE_URL + localizedToolPath('en', tool.slug),
      languages: Object.fromEntries(languages.map((item) => [item.hreflang, SITE_URL + localizedToolPath(item.code, tool.slug)])),
    },
    openGraph: { title, description, url: SITE_URL + localizedToolPath('en', tool.slug), siteName: SITE_NAME, type: 'website', locale: 'en_US' },
    twitter: { card: 'summary_large_image', title, description },
    robots: { index: true, follow: true },
  };
}

export default async function ToolPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const tool = TOOLS_REGISTRY.find((t) => t.slug === slug);
  if (!tool) notFound();
  const seo = getToolSeoContent(tool);
  const faq = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: seo.faq.map((x) => ({
      '@type': 'Question',
      name: x.q,
      acceptedAnswer: { '@type': 'Answer', text: x.a },
    })),
  };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faq) }} />
      <EnglishToolPageClient tool={tool} />
    </>
  );
}
