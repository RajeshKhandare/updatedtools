'use client';

import React from 'react';

type BrandMarkProps = {
  className?: string;
  iconClassName?: string;
};

/**
 * Toolployee signature mark.
 * A custom TP ligature: the P is carved into the T as negative space,
 * making one clean silhouette rather than two overlapping letters.
 */
export default function BrandMark({ className = '', iconClassName = '' }: BrandMarkProps) {
  return (
    <div
      aria-hidden="true"
      className={`relative flex shrink-0 items-center justify-center overflow-hidden rounded-[14px] bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-600 text-white shadow-lg shadow-violet-500/25 ring-1 ring-white/20 dark:ring-white/10 ${className}`}
    >
      <svg viewBox="0 0 40 40" fill="none" className={`relative z-10 ${iconClassName}`}>
        <path
          fill="currentColor"
          fillRule="evenodd"
          d="M6.5 8.5C6.5 7.67 7.17 7 8 7h24c.83 0 1.5.67 1.5 1.5v4c0 .83-.67 1.5-1.5 1.5h-8v17.5c0 .83-.67 1.5-1.5 1.5h-5c-.83 0-1.5-.67-1.5-1.5V14h-8c-.83 0-1.5-.67-1.5-1.5v-4ZM22.5 14h6.2c1.88 0 3.3 1.42 3.3 3.3v1.9c0 3.2-2.6 5.8-5.8 5.8h-3.7v-3.8h3.05c.77 0 1.4-.63 1.4-1.4v-.5c0-.72-.58-1.3-1.3-1.3H22.5V14Z"
          clipRule="evenodd"
        />
        <path
          d="M28.8 16.2c.9.45 1.2 1.2 1.2 2.15"
          stroke="white"
          strokeWidth="1"
          strokeLinecap="round"
          strokeOpacity=".28"
        />
      </svg>
    </div>
  );
}
