import { MetadataRoute } from 'next';
import { TOOLS_REGISTRY } from '@/data/toolsRegistry';
import { SITE_URL, SITE_URL_CONFIGURED } from '@/config/site';

export default function sitemap():MetadataRoute.Sitemap{
  if(!SITE_URL_CONFIGURED)return[];
  const now=new Date();
  const staticRoutes:MetadataRoute.Sitemap=[
    {url:SITE_URL,lastModified:now,changeFrequency:'daily',priority:1},
    {url:SITE_URL+'/tools',lastModified:now,changeFrequency:'weekly',priority:.95},
    {url:SITE_URL+'/about',lastModified:now,changeFrequency:'monthly',priority:.7},
    {url:SITE_URL+'/contact',lastModified:now,changeFrequency:'monthly',priority:.6},
    {url:SITE_URL+'/privacy-policy',lastModified:now,changeFrequency:'yearly',priority:.4},
    {url:SITE_URL+'/terms',lastModified:now,changeFrequency:'yearly',priority:.4}
  ];
  const toolRoutes=TOOLS_REGISTRY.map(tool=>({url:SITE_URL+'/tools/'+tool.slug,lastModified:now,changeFrequency:'weekly' as const,priority:.85}));
  return[...staticRoutes,...toolRoutes];
}
