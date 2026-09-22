// Deployment retry probe: keep locale routing unchanged.
import { NextRequest, NextResponse } from 'next/server';

const LOCALE_COOKIE = 'toolployee-locale';

const COUNTRY_TO_LOCALE: Record<string, string> = {
  BR: 'pt',
  ES: 'es', MX: 'es', AR: 'es', CO: 'es', CL: 'es', PE: 'es', VE: 'es', UY: 'es', PY: 'es', BO: 'es', EC: 'es', CR: 'es', PA: 'es', DO: 'es', GT: 'es', HN: 'es', SV: 'es', NI: 'es',
  DE: 'de', AT: 'de', LI: 'de',
  FR: 'fr', MC: 'fr',
  IT: 'it', SM: 'it', VA: 'it',
  JP: 'ja',
  KR: 'ko',
  CN: 'zh', SG: 'zh',
  RU: 'ru', BY: 'ru', KZ: 'ru', KG: 'ru',
  SA: 'ar', AE: 'ar', EG: 'ar', QA: 'ar', KW: 'ar', BH: 'ar', OM: 'ar', JO: 'ar', LB: 'ar', IQ: 'ar', MA: 'ar', DZ: 'ar', TN: 'ar',
  PT: 'pt',
};

function isLocalizedPath(pathname: string) {
  return /^\/(pt|es|de|fr|it|ja|ko|zh|ru|ar|hi)(?:\/|$)/.test(pathname);
}

function isSearchCrawler(request: NextRequest) {
  const userAgent = request.headers.get('user-agent')?.toLowerCase() || '';
  return /googlebot|bingbot|yandexbot|baiduspider|duckduckbot|slurp|facebookexternalhit|twitterbot|linkedinbot|pinterestbot/.test(userAgent);
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (isLocalizedPath(pathname)) return NextResponse.next();
  if (pathname !== '/' && !pathname.startsWith('/tools')) return NextResponse.next();
  if (isSearchCrawler(request)) return NextResponse.next();

  const savedLocale = request.cookies.get(LOCALE_COOKIE)?.value;
  if (savedLocale === 'en') return NextResponse.next();

  const country = request.headers.get('x-vercel-ip-country')?.toUpperCase();
  const detectedLocale = country ? COUNTRY_TO_LOCALE[country] : undefined;
  const locale = savedLocale && savedLocale !== 'en' ? savedLocale : detectedLocale;

  if (!locale) return NextResponse.next();

  const url = request.nextUrl.clone();
  url.pathname = pathname === '/' ? '/' + locale : '/' + locale + pathname;

  const response = NextResponse.redirect(url, 302);
  response.cookies.set(LOCALE_COOKIE, locale, { path: '/', maxAge: 60 * 60 * 24 * 365 });
  return response;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
