'use client';

import React from 'react';

type BrandMarkProps = {
  className?: string;
  iconClassName?: string;
};

export default function BrandMark({ className = '', iconClassName = '' }: BrandMarkProps) {
  return (
    <div
      aria-hidden="true"
      className={`relative flex shrink-0 items-center justify-center overflow-hidden rounded-[14px] bg-gradient-to-br from-violet-700 via-indigo-600 to-indigo-700 text-white shadow-lg shadow-indigo-500/20 ring-1 ring-black/5 dark:ring-white/10 ${className}`}
    >
      <svg viewBox="0 0 32 32" fill="none" className={`relative z-10 ${iconClassName}`}>
        {/* Custom Toolployee monogram: a geometric T with an integrated tool-slot cut. */}
        <path
          d="M6.5 8.25C6.5 7.56 7.06 7 7.75 7h16.5c.69 0 1.25.56 1.25 1.25v2.5c0 .69-.56 1.25-1.25 1.25H18.5v11.75c0 .69-.56 1.25-1.25 1.25h-2.5c-.69 0-1.25-.56-1.25-1.25V12H7.75c-.69 0-1.25-.56-1.25-1.25v-2.5Z"
          fill="currentColor"
        />
        <path
          d="M21 7.25h3.75a1.25 1.25 0 0 1 1.25 1.25v.9h-5V7.25Z"
          fill="currentColor"
          opacity=".72"
        />
        <path
          d="M21 9.4h4.2"
          stroke="currentColor"
          strokeWidth="1.35"
          strokeLinecap="round"
          opacity=".55"
        />
        <path
          d="M21.1 10.75h2.65"
          stroke="white"
          strokeWidth="1.15"
          strokeLinecap="round"
          opacity=".9"
        />
      </svg>
    </div>
  );
}
