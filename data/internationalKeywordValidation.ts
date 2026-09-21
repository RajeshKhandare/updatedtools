export interface InternationalKeywordValidation {
  locale: string;
  slug: string;
  primaryKeyword: string;
  alternateKeywords: string[];
  intent: 'tool';
  sourceUrls: string[];
  notes: string;
}

/**
 * Validated terminology from current localized SERP pages.
 * This is intentionally a small, evidence-backed layer; unvalidated markets
 * remain research seeds until their wording is checked.
 */
export const INTERNATIONAL_KEYWORD_VALIDATIONS: readonly InternationalKeywordValidation[] = [
  {
    locale: 'pt-BR',
    slug: 'merge-pdf',
    primaryKeyword: 'juntar PDF',
    alternateKeywords: ['unir PDF', 'mesclar PDF'],
    intent: 'tool',
    sourceUrls: [
      'https://dica.com.br/como-juntar-pdf-online/',
      'https://resolvetools.com.br/ferramentas/juntar-pdf',
      'https://conversorbrasil.com/juntar-pdf',
    ],
    notes: 'Brazilian pages consistently use “juntar PDF”; “unir PDF” also appears. Prefer local phrasing over literal translation of “merge”.',
  },
  {
    locale: 'es',
    slug: 'merge-pdf',
    primaryKeyword: 'unir PDF',
    alternateKeywords: ['combinar PDF', 'juntar PDF'],
    intent: 'tool',
    sourceUrls: [
      'https://www.adobe.com/es/acrobat/online/merge-pdf.html',
      'https://www.filuni.com/es/blog/how-to-merge-pdf-online-free',
      'https://smallpdf.com/es/blog/escanear-varias-paginas-en-un-solo-pdf',
    ],
    notes: 'Current Spanish pages use “Unir PDF” prominently; “combinar” is also natural. Validate country-specific wording before expanding beyond the Spanish-language market.',
  },
  {
    locale: 'de',
    slug: 'merge-pdf',
    primaryKeyword: 'PDF zusammenfügen',
    alternateKeywords: ['PDF verbinden', 'PDF kombinieren', 'PDF zusammenführen'],
    intent: 'tool',
    sourceUrls: [
      'https://www.pdf.de/pdf-zusammenfuegen/',
      'https://tooltea.com/de/pdf/pdf-zusammenfuegen',
      'https://www.visualpdf.com/de/pdf-zusammenfuegen',
    ],
    notes: 'German SERPs show “PDF zusammenfügen” as the dominant practical wording, with “verbinden/kombinieren/zusammenführen” as related variants.',
  },
  {
    locale: 'fr',
    slug: 'merge-pdf',
    primaryKeyword: 'fusionner PDF',
    alternateKeywords: ['fusionner des PDF', 'assembler PDF', 'combiner PDF'],
    intent: 'tool',
    sourceUrls: [
      'https://tools.pdf24.org/fr/fusionner-pdf',
      'https://www.foxit.com/fr/merge-pdf/',
      'https://www.visualpdf.com/fr/fusionner-pdf',
    ],
    notes: 'French pages consistently use “fusionner PDF”; “assembler” and “combiner” are secondary variants.',
  },
  {
    locale: 'ja',
    slug: 'merge-pdf',
    primaryKeyword: 'PDF 結合',
    alternateKeywords: ['PDFを結合', 'PDF 統合', 'PDFをまとめる'],
    intent: 'tool',
    sourceUrls: [
      'https://www.ilovepdf.com/ja/merge_pdf',
      'https://www.adobe.com/jp/acrobat/roc/blog/merge-pdf.html',
      'https://www.pdfpeach.com/ja/merge-pdf',
    ],
    notes: 'Japanese tool pages use “PDF 結合” / “PDFを結合”; “PDF 統合” and “PDFをまとめる” are useful semantic variants.',
  },
  {
    locale: 'ru',
    slug: 'merge-pdf',
    primaryKeyword: 'объединить PDF',
    alternateKeywords: ['соединить PDF', 'склеить PDF'],
    intent: 'tool',
    sourceUrls: [
      'https://tools.pdf24.org/ru/merge-pdf',
      'https://freelypdf.com/ru/merge-pdf/',
      'https://pdfty.com/ru/blog/kak-soedinit-pdf-fajly',
    ],
    notes: 'Russian pages use “объединить PDF” and “соединить PDF”; “склеить” appears as an informal variant.',
  },
  {
    locale: 'zh-CN',
    slug: 'merge-pdf',
    primaryKeyword: '合并PDF',
    alternateKeywords: ['合并 PDF', 'PDF拼接', 'PDF合并'],
    intent: 'tool',
    sourceUrls: [
      'https://tools.pdf24.org/zh/merge-pdf',
      'https://www.ilovepdf.com/zh-cn/merge_pdf',
      'https://www.i2pdf.com/zh/merge-pdf',
    ],
    notes: 'Simplified Chinese pages consistently use “合并PDF/合并 PDF”; “PDF拼接” is a useful secondary variant.',
  },
  {
    locale: 'it',
    slug: 'merge-pdf',
    primaryKeyword: 'unire PDF',
    alternateKeywords: ['unire file PDF', 'unisci PDF', 'combinare PDF'],
    intent: 'tool',
    sourceUrls: [
      'https://f24editabile.com/strumenti-utili/unire-pdf/',
      'https://schermata.it/it/strumenti/unire-pdf',
      'https://combinepdf.com/it/',
    ],
    notes: 'Italian pages use “unire PDF” and “unisci PDF”; “combinare” is a semantic alternative.',
  },
  {
    locale: 'hi',
    slug: 'merge-pdf',
    primaryKeyword: 'PDF मर्ज करें',
    alternateKeywords: ['PDF मर्ज', 'PDF को मर्ज करें', 'PDF फाइलों को मर्ज करें'],
    intent: 'tool',
    sourceUrls: [
      'https://tools.pdf24.org/hi/merge-pdf',
      'https://www.pdf2go.com/hi/merge-pdf',
      'https://omypdf.com/hi/merge-pdf',
    ],
    notes: 'Current Hindi pages commonly retain the English technical term “मर्ज”; avoid replacing it with an unnatural literal Hindi phrase.',
  },
  {
    locale: 'ar',
    slug: 'merge-pdf',
    primaryKeyword: 'دمج PDF',
    alternateKeywords: ['دمج ملفات PDF', 'دمج ملفات بي دي إف'],
    intent: 'tool',
    sourceUrls: [
      'https://www.sapdf.net/merge-pdf',
      'https://www.useotools.com/ar/merge-pdf',
      'https://arabpdf.net/merge-pdf',
    ],
    notes: 'Arabic pages consistently use “دمج PDF” / “دمج ملفات PDF”. Keep RTL copy natural rather than translating English word-for-word.',
  },
];

export function getInternationalKeywordValidation(locale: string, slug: string) {
  return INTERNATIONAL_KEYWORD_VALIDATIONS.find(
    (row) => row.locale === locale && row.slug === slug
  );
}
