export async function GET() {
  const body = 'User-agent: *\nAllow: /\nSitemap: https://paste.toolployee.com/sitemap.xml\n';
  return new Response(body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}
