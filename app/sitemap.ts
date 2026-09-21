import type { MetadataRoute } from 'next';
import { TOOLS_REGISTRY } from '@/data/toolsRegistry';
import { SITE_URL, SITE_URL_CONFIGURED } from '@/config/site';
import { INDEXABLE_LOCALES, localizedToolPath } from '@/data/internationalSeo';

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

  // Planned locales are intentionally excluded until localized routes contain
  // genuinely localized content and are marked indexable.
  const localizedRoutes: MetadataRoute.Sitemap = INDEXABLE_LOCALES
    .filter((locale) => locale.code !== 'en')
    .flatMap((locale) =>
      TOOLS_REGISTRY.map((tool) => ({
        url: SITE_URL + localizedToolPath(locale.code, tool.slug),
        lastModified: now,
        changeFrequency: 'weekly' as const,
        priority: 0.75,
      }))
    );

  return [...staticRoutes, ...toolRoutes, ...localizedRoutes];
}
