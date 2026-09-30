import type { MetadataRoute } from 'next';
import { TOOLS_REGISTRY } from '@/data/toolsRegistry';
import { SITE_URL, SITE_URL_CONFIGURED } from '@/config/site';
import { INDEXABLE_LOCALES, FESTIVAL_LOCALES, localizedToolPath } from '@/data/internationalSeo';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  if (!SITE_URL_CONFIGURED) return [];

  const now = new Date();
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: SITE_URL, lastModified: now, changeFrequency: 'daily', priority: 1 },
    { url: SITE_URL + '/tools', lastModified: now, changeFrequency: 'weekly', priority: 0.95 },
    { url: SITE_URL + '/about', lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: SITE_URL + '/contact', lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: SITE_URL + '/privacy-policy', lastModified: now, changeFrequency: 'yearly', priority: 0.4 },
    { url: SITE_URL + '/terms', lastModified: now, changeFrequency: 'yearly', priority: 0.4 },
  ];

  const toolRoutes: MetadataRoute.Sitemap = TOOLS_REGISTRY.map((tool) => ({
    url: SITE_URL + '/tools/' + tool.slug,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: 0.85,
  }));

  const localizedStaticRoutes: MetadataRoute.Sitemap = INDEXABLE_LOCALES
    .filter((locale) => locale.code !== 'en')
    .flatMap((locale) => [
      { url: SITE_URL + '/' + locale.code, lastModified: now, changeFrequency: 'daily' as const, priority: 0.9 },
      { url: SITE_URL + '/' + locale.code + '/tools', lastModified: now, changeFrequency: 'weekly' as const, priority: 0.85 },
      { url: SITE_URL + '/' + locale.code + '/about', lastModified: now, changeFrequency: 'monthly' as const, priority: 0.7 },
      { url: SITE_URL + '/' + locale.code + '/contact', lastModified: now, changeFrequency: 'monthly' as const, priority: 0.6 },
      { url: SITE_URL + '/' + locale.code + '/privacy-policy', lastModified: now, changeFrequency: 'yearly' as const, priority: 0.4 },
      { url: SITE_URL + '/' + locale.code + '/terms', lastModified: now, changeFrequency: 'yearly' as const, priority: 0.4 },
    ]);

  const festivalLocalizedRoutes: MetadataRoute.Sitemap = FESTIVAL_LOCALES.flatMap((locale) =>
    TOOLS_REGISTRY.filter((tool) => tool.category === 'Festival').map((tool) => ({
      url: SITE_URL + localizedToolPath(locale.code, tool.slug),
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }))
  );

  const navratriDayRoutes: MetadataRoute.Sitemap = [
    ...Array.from({ length: 9 }, (_, i) => SITE_URL + '/tools/navratri-colors-2026/day-' + (i + 1)),
    ...['hi', 'mr'].flatMap((locale) => Array.from({ length: 9 }, (_, i) => SITE_URL + '/' + locale + '/tools/navratri-colors-2026/day-' + (i + 1))),
  ].map((url) => ({ url, lastModified: now, changeFrequency: 'weekly' as const, priority: 0.78 }));

  const localizedRoutes: MetadataRoute.Sitemap = INDEXABLE_LOCALES
    .filter((locale) => locale.code !== 'en')
    .flatMap((locale) =>
      TOOLS_REGISTRY.filter((tool) => tool.category !== 'Festival').map((tool) => ({
        url: SITE_URL + localizedToolPath(locale.code, tool.slug),
        lastModified: now,
        changeFrequency: 'weekly' as const,
        priority: 0.75,
      }))
    );

  return [...staticRoutes, ...toolRoutes, ...localizedStaticRoutes, ...localizedRoutes, ...festivalLocalizedRoutes, ...navratriDayRoutes];
}
