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
  { code:'pt', hreflang:'pt-BR', languageName:'Português', market:'Brazil', status:'planned' },
  { code:'es', hreflang:'es', languageName:'Español', market:'Spanish-speaking markets', status:'planned' },
  { code:'de', hreflang:'de', languageName:'Deutsch', market:'Germany / DACH', status:'planned' },
  { code:'fr', hreflang:'fr', languageName:'Français', market:'France / Francophone markets', status:'planned' },
  { code:'it', hreflang:'it', languageName:'Italiano', market:'Italy', status:'planned' },
  { code:'ja', hreflang:'ja', languageName:'日本語', market:'Japan', status:'planned' },
  { code:'ko', hreflang:'ko', languageName:'한국어', market:'South Korea', status:'planned' },
  { code:'zh', hreflang:'zh-CN', languageName:'中文', market:'Simplified Chinese', status:'planned' },
  { code:'ru', hreflang:'ru', languageName:'Русский', market:'Russian-speaking markets', status:'planned' },
  { code:'ar', hreflang:'ar', languageName:'العربية', market:'Arabic-speaking markets', status:'planned' },
  { code:'hi', hreflang:'hi', languageName:'हिन्दी', market:'India', status:'planned' },
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
