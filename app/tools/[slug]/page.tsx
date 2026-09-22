import Link from 'next/link';
import { notFound } from 'next/navigation';
import { TOOLS_REGISTRY } from '@/data/toolsRegistry';
import EnglishToolPageClient from '@/components/EnglishToolPageClient';

export const dynamicParams = false;

export function generateStaticParams() {
  return TOOLS_REGISTRY.map((tool) => ({ slug: tool.slug }));
}

export default async function ToolPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const tool = TOOLS_REGISTRY.find((t) => t.slug === slug);
  if (!tool) notFound();
  return <EnglishToolPageClient tool={tool} />;
}
