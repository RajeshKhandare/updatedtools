import { TOOLS_REGISTRY } from './toolsRegistry';
import { INTERNATIONAL_KEYWORD_SEEDS } from './internationalKeywordSeeds';

export type InternationalSeoResearchStatus =
  | 'needs-serp-validation'
  | 'validated'
  | 'ready-for-localization'
  | 'indexable';

export interface InternationalSeoOpportunity {
  locale: string;
  market: string;
  language: string;
  slug: string;
  toolName: string;
  category: string;
  sourceKeyword: string;
  researchSeeds: string[];
  status: InternationalSeoResearchStatus;
  validatedKeyword: string | null;
  searchVolume: number | null;
  keywordDifficulty: number | null;
  serpNotes: string | null;
}

/**
 * Research queue for every tool × planned locale.
 *
 * This intentionally contains no invented search volume, difficulty, rankings,
 * or "winning" keywords. The seed phrases are starting points only. A row
 * becomes indexable only after local SERP/keyword research and real localized
 * content are completed.
 */
export const INTERNATIONAL_SEO_OPPORTUNITY_MATRIX: readonly InternationalSeoOpportunity[] =
  TOOLS_REGISTRY.flatMap((tool) =>
    INTERNATIONAL_KEYWORD_SEEDS.map((market) => ({
      locale: market.locale,
      market: market.market,
      language: market.language,
      slug: tool.slug,
      toolName: tool.name,
      category: tool.category,
      sourceKeyword: tool.targetKeyword ?? tool.name,
      researchSeeds: [...market.primaryPatterns, ...market.secondaryPatterns],
      status: 'needs-serp-validation' as const,
      validatedKeyword: null,
      searchVolume: null,
      keywordDifficulty: null,
      serpNotes: null,
    }))
  );

export const INTERNATIONAL_SEO_MATRIX_SIZE =
  INTERNATIONAL_SEO_OPPORTUNITY_MATRIX.length;

export function getInternationalSeoRows(locale: string, slug?: string) {
  return INTERNATIONAL_SEO_OPPORTUNITY_MATRIX.filter(
    (row) => row.locale === locale && (!slug || row.slug === slug)
  );
}
