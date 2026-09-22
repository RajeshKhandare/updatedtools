'use client';

import React from 'react';

type BrandMarkProps = {
  className?: string;
  iconClassName?: string;
};

/**
 * Toolployee brand mark:
 * an interlocking T/P monogram inspired by a precision tool head and a
 * connected workflow. No sparkle/star decoration; the silhouette is the identity.
 */
export default function BrandMark({ className = '', iconClassName = '' }: BrandMarkProps) {
  return (
    <div
      aria-hidden="true"
      className={`relative flex shrink-0 items-center justify-center overflow-hidden rounded-[14px] bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-600 text-white shadow-lg shadow-violet-500/25 ring-1 ring-white/20 dark:ring-white/10 ${className}`}
    >
      <svg viewBox="0 0 40 40" fill="none" className={`relative z-10 ${iconClassName}`}>
        {/* Interlocking TP monogram — one continuous, tool-like silhouette. */}
        <path
          d="M7 8.5C7 7.67 7.67 7 8.5 7H30c1.66 0 3 1.34 3 3v4.25c0 .83-.67 1.5-1.5 1.5H24v15.75c0 .83-.67 1.5-1.5 1.5h-5c-.83 0-1.5-.67-1.5-1.5V15.75H8.5c-.83 0-1.5-.67-1.5-1.5v-5.75Z"
          fill="currentColor"
        />
        {/* Precision cut-out turns the right side into a subtle P/tool-head cue. */}
        <path
          d="M24 15.75h6.1c1.05 0 1.9.85 1.9 1.9v1.65c0 2.49-2.01 4.5-4.5 4.5H24v-3.8h2.45c.48 0 .87-.39.87-.87v-.18c0-.48-.39-.87-.87-.87H24v-2.33Z"
          fill="white"
          fillOpacity=".22"
        />
        <path
          d="M24 15.75h6.1"
          stroke="white"
          strokeWidth="1.35"
          strokeLinecap="round"
          strokeOpacity=".62"
        />
      </svg>
    </div>
  );
}
