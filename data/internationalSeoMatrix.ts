import { TOOLS_REGISTRY } from './toolsRegistry';
import { INTERNATIONAL_KEYWORD_SEEDS } from './internationalKeywordSeeds';
import { getInternationalKeywordValidation } from './internationalKeywordValidation';

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
  sourceUrls: string[];
}

/**
 * Research matrix for every tool × planned locale.
 *
 * Validated rows are backed by current localized SERP pages. Rows without
 * evidence stay in the research queue; no search-volume, difficulty, ranking,
 * or traffic figures are invented.
 */
export const INTERNATIONAL_SEO_OPPORTUNITY_MATRIX: readonly InternationalSeoOpportunity[] =
  TOOLS_REGISTRY.flatMap((tool) =>
    INTERNATIONAL_KEYWORD_SEEDS.map((market) => {
      const validation = getInternationalKeywordValidation(market.locale, tool.slug);

      return {
        locale: market.locale,
        market: market.market,
        language: market.language,
        slug: tool.slug,
        toolName: tool.name,
        category: tool.category,
        sourceKeyword:
          validation?.primaryKeyword ?? tool.targetKeyword ?? tool.name,
        researchSeeds: [
          ...market.primaryPatterns,
          ...market.secondaryPatterns,
          ...(validation?.alternateKeywords ?? []),
        ],
        status: validation ? 'validated' as const : 'needs-serp-validation' as const,
        validatedKeyword: validation?.primaryKeyword ?? null,
        searchVolume: null,
        keywordDifficulty: null,
        serpNotes: validation?.notes ?? null,
        sourceUrls: validation?.sourceUrls ?? [],
      };
    })
  );

export const INTERNATIONAL_SEO_MATRIX_SIZE =
  INTERNATIONAL_SEO_OPPORTUNITY_MATRIX.length;

export function getInternationalSeoRows(locale: string, slug?: string) {
  return INTERNATIONAL_SEO_OPPORTUNITY_MATRIX.filter(
    (row) => row.locale === locale && (!slug || row.slug === slug)
  );
}
