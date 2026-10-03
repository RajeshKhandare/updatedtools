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
        src="/branding/toolployee-logo-96.png"
        alt=""
        width={96}
        height={96}
        draggable={false}
        className={`h-full w-full object-contain ${iconClassName}`}
      />
    </div>
  );
}
