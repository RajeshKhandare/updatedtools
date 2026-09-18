'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Application error:', error);
  }, [error]);

  return (
    <main className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 flex items-center justify-center px-4 py-20">
      <div className="w-full max-w-lg rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-8 text-center shadow-sm">
        <p className="text-sm font-bold text-violet-600">Something went wrong</p>
        <h1 className="mt-2 text-2xl font-black">This page could not load</h1>
        <p className="mt-3 text-sm leading-6 text-zinc-500 dark:text-zinc-400">
          The error was handled safely. Try the page again or return to the tools home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <button
            type="button"
            onClick={() => reset()}
            className="rounded-2xl bg-violet-600 px-5 py-3 text-sm font-bold text-white hover:bg-violet-500"
          >
            Try again
          </button>
          <Link
            href="/"
            className="rounded-2xl border border-zinc-200 dark:border-zinc-700 px-5 py-3 text-sm font-bold"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </main>
  );
}
