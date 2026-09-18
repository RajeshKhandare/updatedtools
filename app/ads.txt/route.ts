import { NextResponse } from 'next/server';

export function GET() {
  const publisherId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;

  if (!publisherId) {
    return new NextResponse('AdSense publisher ID is not configured.\n', {
      status: 404,
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    });
  }

  const normalized = publisherId.startsWith('ca-pub-')
    ? publisherId.slice('ca-pub-'.length)
    : publisherId;

  return new NextResponse(
    `google.com, pub-${normalized}, DIRECT, f08c47fec0942fa0\n`,
    {
      status: 200,
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'public, max-age=3600',
      },
    }
  );
}
