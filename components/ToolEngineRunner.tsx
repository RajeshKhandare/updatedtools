'use client';

import React from 'react';
import { ToolMeta } from '@/data/toolsRegistry';
import PdfEngine from './engines/PdfEngine';
import ImageEngine from './engines/ImageEngine';
import CompilerEngine from './engines/CompilerEngine';
import FinanceEngine from './engines/FinanceEngine';
import UniversalToolEngine from './UniversalToolEngine';

export default function ToolEngineRunner({ tool }: { tool: ToolMeta }) {
  switch (tool.category) {
    case 'PDF': return <PdfEngine toolSlug={tool.slug} toolName={tool.name} />;
    case 'Image': return <ImageEngine toolSlug={tool.slug} toolName={tool.name} />;
    case 'Compiler': return <CompilerEngine toolSlug={tool.slug} toolName={tool.name} />;
    case 'Finance': return <FinanceEngine toolSlug={tool.slug} toolName={tool.name} />;
    case 'Calculators':
      if (tool.slug === 'sip-wealth-calculator') return <FinanceEngine toolSlug="sip-calculator" toolName={tool.name} />;
      return <UniversalToolEngine tool={tool} />;
    case 'Developer':
    case 'Text':
    case 'Converters':
    case 'YouTube':
      return <UniversalToolEngine tool={tool} />;
    default: return <UniversalToolEngine tool={tool} />;
  }
}
