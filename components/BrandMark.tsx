'use client';

import React from 'react';

type BrandMarkProps = {
  className?: string;
  iconClassName?: string;
};

export default function BrandMark({ className = '', iconClassName = '' }: BrandMarkProps) {
  return (
    <div aria-hidden="true" className={`relative flex shrink-0 items-center justify-center ${className}`}>
      <img
        src="/branding/toolployee-logo.webp"
        alt=""
        width={128}
        height={128}
        draggable={false}
        className={`h-full w-full object-contain ${iconClassName}`}
      />
    </div>
  );
}
