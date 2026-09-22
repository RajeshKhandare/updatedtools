'use client';

import React from 'react';

type BrandMarkProps = {
  className?: string;
  iconClassName?: string;
};

/**
 * Toolployee signature ribbon mark.
 * Inspired by the selected Toolployee brand board: two flowing ribbon pieces
 * form a distinctive abstract "tool / workflow" symbol without using a letter.
 */
export default function BrandMark({ className = '', iconClassName = '' }: BrandMarkProps) {
  return (
    <div aria-hidden="true" className={`relative flex shrink-0 items-center justify-center ${className}`}>
      <svg viewBox="0 0 40 40" fill="none" className={`h-full w-full ${iconClassName}`}>
        <defs>
          <linearGradient id="toolployeeMarkGradient" x1="5" y1="31" x2="35" y2="4" gradientUnits="userSpaceOnUse">
            <stop stopColor="#4F46E5" />
            <stop offset=".52" stopColor="#7C3AED" />
            <stop offset="1" stopColor="#C026D3" />
          </linearGradient>
        </defs>
        {/* Upper flowing ribbon */}
        <path
          d="M4.2 22.1c0-3.4 1.7-5.7 4.8-7.2L31.1 5.2c2.4-1 4.7.4 4.7 3v5.1c0 3.3-1.5 5.5-4.5 6.8L8.8 28.5c-2.4 1-4.6-.5-4.6-3.1v-3.3Z"
          fill="url(#toolployeeMarkGradient)"
        />
        {/* Lower folded ribbon */}
        <path
          d="M13.2 28.4c0-2.7 1.1-4.4 3.5-5.4l8.7-3.7c2.7-1.1 4.8.5 4.8 3.3v8.2c0 2.8-1.1 4.6-3.6 5.7l-8.6 3.7c-2.7 1.1-4.8-.5-4.8-3.3v-8.5Z"
          fill="url(#toolployeeMarkGradient)"
        />
        {/* Fine separation/flow accent */}
        <path
          d="M4.9 27.2 15.8 22.8"
          stroke="white"
          strokeWidth="1.05"
          strokeLinecap="round"
          strokeOpacity=".72"
        />
      </svg>
    </div>
  );
}
