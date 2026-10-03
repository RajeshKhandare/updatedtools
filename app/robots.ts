import { MetadataRoute } from 'next';
import { SITE_URL, SITE_URL_CONFIGURED } from '@/config/site';

export const dynamic = 'force-static';

export default function robots():MetadataRoute.Robots{
  return SITE_URL_CONFIGURED
    ? {rules:{userAgent:'*',allow:'/'},sitemap:SITE_URL+'/sitemap.xml'}
    : {rules:{userAgent:'*',allow:'/'}}; 
}
