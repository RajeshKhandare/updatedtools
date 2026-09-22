'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import BrandMark from '@/components/BrandMark';
import { getLocalizedToolName, getLocalizedUi, getLocalizedCategoryLabel } from '@/data/internationalLocalization';
import { type LocaleCode } from '@/data/internationalSeo';

export default function Footer() {
  const [currentLocale, setCurrentLocale] = useState<LocaleCode>('en');

  useEffect(() => {
    const match = window.location.pathname.match(/^\/(pt|es|de|fr|it|ja|ko|zh|ru|ar|hi)(?:\/|$)/);
    setCurrentLocale((match?.[1] as LocaleCode | undefined) || 'en');
  }, []);

  const ui = getLocalizedUi(currentLocale);
  const localized = (path: string) => currentLocale === 'en' ? path : `/${currentLocale}${path}`;

  return (
    <footer className="border-t border-zinc-200/80 dark:border-zinc-800/80 bg-white dark:bg-zinc-950 text-zinc-600 dark:text-zinc-400 transition-colors">
      <div className="mx-auto max-w-7xl px-4 pt-14 pb-10 sm:px-6">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 md:grid-cols-5">
          <div className="md:col-span-2 space-y-4">
            <Link href={localized("/")} className="flex items-center" aria-label="Home">
              <BrandMark className="h-10 w-10" />
              <span className="ml-1.5 text-lg font-extrabold tracking-tight text-zinc-950 dark:text-white">Toolployee</span>
            </Link>
            <p className="text-xs leading-relaxed text-zinc-500 dark:text-zinc-400 max-w-sm">{ui.footerDescription}</p>
            <div className="flex items-center gap-2 text-[11px] font-medium text-zinc-500 dark:text-zinc-400">
              <span className="inline-block h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>{ui.operationalLabel}</span>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-white">{ui.categoriesLabel}</h4>
            <ul className="space-y-2.5 text-xs">
              {['PDF', 'Image', 'Compiler', 'Finance'].map((category) => (
                <li key={category}>
                  <Link href={localized(`/?category=${category}#tools`)} className="hover:text-violet-600 dark:hover:text-violet-400 transition-colors">
                    {getLocalizedCategoryLabel(category, currentLocale)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-white">{ui.popularToolsLabel}</h4>
            <ul className="space-y-2.5 text-xs">
              <li><Link href={localized("/tools/youtube-thumbnail-downloader")} className="hover:text-violet-600 dark:hover:text-violet-400 transition-colors">{getLocalizedToolName({name:'YouTube Thumbnail Downloader', slug:'youtube-thumbnail-downloader', category:'YouTube', description:''}, currentLocale)}</Link></li>
              <li><Link href={localized("/tools/sip-wealth-calculator")} className="hover:text-violet-600 dark:hover:text-violet-400 transition-colors">{getLocalizedToolName({name:'SIP Calculator', slug:'sip-wealth-calculator', category:'Calculators', description:''}, currentLocale)}</Link></li>
              <li><Link href={localized("/tools/online-python-compiler")} className="hover:text-violet-600 dark:hover:text-violet-400 transition-colors">{getLocalizedToolName({name:'Online Python Compiler', slug:'online-python-compiler', category:'Compiler', description:''}, currentLocale)}</Link></li>
              <li><Link href={localized("/tools/merge-pdf")} className="hover:text-violet-600 dark:hover:text-violet-400 transition-colors">{getLocalizedToolName({name:'Merge PDF', slug:'merge-pdf', category:'PDF', description:''}, currentLocale)}</Link></li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-white">{ui.platformLabel}</h4>
            <ul className="space-y-2.5 text-xs">
              <li><Link href={localized("/about")} className="hover:text-violet-600 dark:hover:text-violet-400 transition-colors">{ui.aboutLabel}</Link></li>
              <li><Link href={localized("/contact")} className="hover:text-violet-600 dark:hover:text-violet-400 transition-colors">{ui.contactLabel}</Link></li>
              <li><Link href={localized("/privacy-policy")} className="hover:text-violet-600 dark:hover:text-violet-400 transition-colors">{ui.privacyLabel}</Link></li>
              <li><Link href={localized("/terms")} className="hover:text-violet-600 dark:hover:text-violet-400 transition-colors">{ui.termsLabel}</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-zinc-100 dark:border-zinc-800/80 pt-6 flex flex-col sm:flex-row items-center justify-between text-[11px] text-zinc-400 dark:text-zinc-500 gap-3">
          <p>© {new Date().getFullYear()} Toolployee. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
