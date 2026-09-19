export const runtime = 'nodejs';

const VIDEO_ID_PATTERN = /^[A-Za-z0-9_-]{11}$/;

const THUMBNAIL_LEVELS = [
  'maxresdefault',
  'sddefault',
  'hqdefault',
  'mqdefault',
  'default',
];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const videoId = searchParams.get('videoId') || '';

  if (!VIDEO_ID_PATTERN.test(videoId)) {
    return new Response('Invalid YouTube video ID.', { status: 400 });
  }

  for (const level of THUMBNAIL_LEVELS) {
    const sourceUrl = 'https://i.ytimg.com/vi/' + videoId + '/' + level + '.jpg';

    try {
      const response = await fetch(sourceUrl, {
        cache: 'no-store',
        headers: {
          Accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
        },
      });

      if (!response.ok) continue;

      const contentType = response.headers.get('content-type') || 'image/jpeg';
      const body = await response.arrayBuffer();

      return new Response(body, {
        status: 200,
        headers: {
          'Content-Type': contentType,
          'Content-Disposition': 'attachment; filename="youtube-thumbnail-' + videoId + '.jpg"',
          'Cache-Control': 'private, no-store',
        },
      });
    } catch {
      // Try the next supported thumbnail resolution.
    }
  }

  return new Response('Thumbnail not found for this video.', { status: 404 });
}