import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  return NextResponse.json(
    {
      commit:
        process.env.VERCEL_GIT_COMMIT_SHA ||
        process.env.NEXT_PUBLIC_BUILD_SHA ||
        'unknown',
    },
    { headers: { 'Cache-Control': 'no-store, max-age=0' } }
  );
}
