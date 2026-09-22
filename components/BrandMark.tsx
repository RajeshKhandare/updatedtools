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
      className={`relative flex shrink-0 items-center justify-center overflow-hidden rounded-[13px] bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-600 text-white shadow-lg shadow-violet-500/25 ring-1 ring-white/20 dark:ring-white/10 ${className}`}
    >
      <svg viewBox="0 0 32 32" fill="none" className={`relative z-10 ${iconClassName}`}>
        <path d="M7 7.5h18v4h-7v13h-4v-13H7v-4Z" fill="currentColor" />
        <path d="M23.7 5.7v3.1M22.15 7.25h3.1" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" opacity=".9" />
        <circle cx="23.7" cy="5.7" r="1.1" fill="currentColor" opacity=".95" />
      </svg>
      <span className="absolute -right-3 -top-3 h-8 w-8 rounded-full bg-white/20 blur-md" />
    </div>
  );
}
