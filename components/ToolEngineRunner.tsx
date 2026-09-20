'use client';

import dynamic from 'next/dynamic';
import { ToolMeta } from '@/data/toolsRegistry';
import UniversalToolEngine from './UniversalToolEngine';

const PdfEngine = dynamic(() => import('./engines/PdfEngine'));
const ImageEngine = dynamic(() => import('./engines/ImageEngine'));
const CompilerEngine = dynamic(() => import('./engines/CompilerEngine'));
const FinanceEngine = dynamic(() => import('./engines/FinanceEngine'));

export default function ToolEngineRunner({ tool }: { tool: ToolMeta }) {
  switch (tool.category) {
    case 'PDF':
      return <PdfEngine toolSlug={tool.slug} toolName={tool.name} />;
    case 'Image':
      return <ImageEngine toolSlug={tool.slug} toolName={tool.name} />;
    case 'Compiler':
      return <CompilerEngine toolSlug={tool.slug} toolName={tool.name} />;
    case 'Finance':
      return <FinanceEngine toolSlug={tool.slug} toolName={tool.name} />;
    case 'Calculators':
      if (tool.slug === 'sip-wealth-calculator') {
        return <FinanceEngine toolSlug="sip-calculator" toolName={tool.name} />;
      }
      return <UniversalToolEngine tool={tool} />;
    case 'Developer':
    case 'Text':
    case 'Converters':
    case 'YouTube':
    default:
      return <UniversalToolEngine tool={tool} />;
  }
}
