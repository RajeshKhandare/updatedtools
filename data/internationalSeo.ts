export type LocaleCode = 'en'|'pt'|'es'|'de'|'fr'|'it'|'ja'|'ko'|'zh'|'ru'|'ar'|'hi';

export interface LocaleConfig {
  code: LocaleCode;
  hreflang: string;
  languageName: string;
  market: string;
  status: 'source' | 'planned';
}

export const LOCALES: readonly LocaleConfig[] = [
  { code:'en', hreflang:'en', languageName:'English', market:'Global', status:'source' },
  { code:'pt', hreflang:'pt-BR', languageName:'Português', market:'Brazil', status:'source' },
  { code:'es', hreflang:'es', languageName:'Español', market:'Spanish-speaking markets', status:'source' },
  { code:'de', hreflang:'de', languageName:'Deutsch', market:'Germany / DACH', status:'source' },
  { code:'fr', hreflang:'fr', languageName:'Français', market:'France / Francophone markets', status:'source' },
  { code:'it', hreflang:'it', languageName:'Italiano', market:'Italy', status:'source' },
  { code:'ja', hreflang:'ja', languageName:'日本語', market:'Japan', status:'source' },
  { code:'ko', hreflang:'ko', languageName:'한국어', market:'South Korea', status:'source' },
  { code:'zh', hreflang:'zh-CN', languageName:'中文', market:'Simplified Chinese', status:'source' },
  { code:'ru', hreflang:'ru', languageName:'Русский', market:'Russian-speaking markets', status:'source' },
  { code:'ar', hreflang:'ar', languageName:'العربية', market:'Arabic-speaking markets', status:'source' },
  { code:'hi', hreflang:'hi', languageName:'हिन्दी', market:'India', status:'source' },
];

export const INDEXABLE_LOCALES = LOCALES.filter((locale) => locale.status === 'source');

export function getLocale(code: string): LocaleConfig | undefined {
  return LOCALES.find((locale) => locale.code === code);
}

export function isLocale(code: string): code is LocaleCode {
  return Boolean(getLocale(code));
}

export function localizedToolPath(locale: LocaleCode, slug: string): string {
  return locale === 'en' ? `/tools/${slug}` : `/${locale}/tools/${slug}`;
}

export function getLocalizedAlternates(slug: string): Record<string, string> {
  return Object.fromEntries(
    INDEXABLE_LOCALES.map((locale) => [
      locale.hreflang,
      localizedToolPath(locale.code, slug),
    ])
  );
}
