'use client';

import React from 'react';
import { ExternalLink, Gift, Lightbulb, Sparkles, ShoppingBag, SprayCan, Shirt } from 'lucide-react';
import type { ToolMeta } from '@/data/toolsRegistry';

type AffiliateItem = {
  title: string;
  query: string;
  icon: React.ReactNode;
};

const ITEMS: Record<string, AffiliateItem[]> = {
  'navratri-colors-2026': [
    { title: 'Navratri ethnic wear', query: 'Navratri ethnic wear women men', icon: <Shirt className="h-5 w-5" /> },
    { title: 'Garba & Dandiya outfits', query: 'Garba Dandiya outfit chaniya choli kurta', icon: <Sparkles className="h-5 w-5" /> },
    { title: 'Festive jewellery & accessories', query: 'Navratri festive jewellery accessories', icon: <Gift className="h-5 w-5" /> },
  ],
  'diwali-mithai-faral-calculator': [
    { title: 'Sweet & snack storage', query: 'airtight sweet snack storage containers', icon: <ShoppingBag className="h-5 w-5" /> },
    { title: 'Kitchen weighing scale', query: 'digital kitchen weighing scale', icon: <Sparkles className="h-5 w-5" /> },
    { title: 'Diwali gift boxes', query: 'Diwali sweet gift boxes', icon: <Gift className="h-5 w-5" /> },
  ],
  'diwali-puja-samagri-checklist': [
    { title: 'Diwali puja thali', query: 'Diwali puja thali set', icon: <Gift className="h-5 w-5" /> },
    { title: 'Diyas & diya sets', query: 'Diwali clay diya set', icon: <Lightbulb className="h-5 w-5" /> },
    { title: 'Cotton wicks', query: 'cotton diya wicks', icon: <Sparkles className="h-5 w-5" /> },
    { title: 'Rangoli supplies', query: 'rangoli powder stencil Diwali', icon: <Sparkles className="h-5 w-5" /> },
  ],
  'diwali-budget-calculator': [
    { title: 'Diwali gifts', query: 'Diwali gifts India', icon: <Gift className="h-5 w-5" /> },
    { title: 'Festive clothing', query: 'Diwali ethnic wear India', icon: <Shirt className="h-5 w-5" /> },
    { title: 'Diwali decorations', query: 'Diwali home decoration lights', icon: <Sparkles className="h-5 w-5" /> },
  ],
  'diya-requirement-calculator': [
    { title: 'Clay diyas', query: 'Diwali clay diyas', icon: <Lightbulb className="h-5 w-5" /> },
    { title: 'Cotton wicks', query: 'cotton diya wicks', icon: <Sparkles className="h-5 w-5" /> },
    { title: 'Diya oil lamps', query: 'Diwali diya oil lamp set', icon: <Lightbulb className="h-5 w-5" /> },
  ],
  'diwali-cleaning-planner': [
    { title: 'Microfiber cleaning cloths', query: 'microfiber cleaning cloth set', icon: <SprayCan className="h-5 w-5" /> },
    { title: 'Home cleaning brushes', query: 'home cleaning brush set India', icon: <SprayCan className="h-5 w-5" /> },
    { title: 'Storage organizers', query: 'home storage organizer boxes', icon: <ShoppingBag className="h-5 w-5" /> },
  ],
  'diwali-countdown-preparation-planner': [
    { title: 'Diwali lights', query: 'Diwali decorative string lights', icon: <Sparkles className="h-5 w-5" /> },
    { title: 'Diwali decoration', query: 'Diwali home decoration items', icon: <Gift className="h-5 w-5" /> },
    { title: 'Gift packaging', query: 'Diwali gift bags boxes wrapping', icon: <Gift className="h-5 w-5" /> },
  ],
};

const HI: Record<string, { heading: string; intro: string; disclosure: string; cta: string }> = {
  'navratri-colors-2026': { heading: 'नवरात्रि की खरीदारी', intro: 'रंग और उत्सव की तैयारी के लिए संबंधित प्रोडक्ट खोजें।', disclosure: 'Amazon पर जाने वाला लिंक (paid link)', cta: 'Amazon पर देखें' },
  'diwali-mithai-faral-calculator': { heading: 'दिवाली मिठाई और फराल की खरीदारी', intro: 'मिठाई, फराल और गिफ्टिंग की तैयारी के लिए उपयोगी चीजें खोजें।', disclosure: 'Amazon पर जाने वाला लिंक (paid link)', cta: 'Amazon पर देखें' },
  'diwali-puja-samagri-checklist': { heading: 'पूजा सामग्री की खरीदारी', intro: 'चेकलिस्ट के साथ पूजा थाली, दीये और जरूरी सामान खोजें।', disclosure: 'Amazon पर जाने वाला लिंक (paid link)', cta: 'Amazon पर देखें' },
  'diwali-budget-calculator': { heading: 'दिवाली खरीदारी आइडिया', intro: 'अपने बजट के अनुसार गिफ्ट, कपड़े और सजावट की चीजें खोजें।', disclosure: 'Amazon पर जाने वाला लिंक (paid link)', cta: 'Amazon पर देखें' },
  'diya-requirement-calculator': { heading: 'दीये और लाइटिंग की खरीदारी', intro: 'कैलकुलेटर में अनुमान लगाने के बाद संबंधित दीये और बाती खोजें।', disclosure: 'Amazon पर जाने वाला लिंक (paid link)', cta: 'Amazon पर देखें' },
  'diwali-cleaning-planner': { heading: 'दिवाली सफाई की खरीदारी', intro: 'सफाई प्लान के अनुसार उपयोगी cleaning और storage सामान खोजें।', disclosure: 'Amazon पर जाने वाला लिंक (paid link)', cta: 'Amazon पर देखें' },
  'diwali-countdown-preparation-planner': { heading: 'दिवाली तैयारी की खरीदारी', intro: 'काउंटडाउन के साथ जरूरी सजावट, गिफ्ट पैकेजिंग और तैयारी का सामान खोजें।', disclosure: 'Amazon पर जाने वाला लिंक (paid link)', cta: 'Amazon पर देखें' },
};

const EN = { heading: 'Related Diwali & Festival Shopping', intro: 'Explore relevant products for the preparation tasks covered by this tool.', disclosure: 'Amazon link (paid link)', cta: 'View on Amazon' };

function amazonSearchUrl(query: string, tag: string) {
  const params = new URLSearchParams({ k: query });
  if (tag) params.set('tag', tag);
  return 'https://www.amazon.in/s?' + params.toString();
}

export default function FestivalAffiliateLinks({ tool, locale = 'en' }: { tool: ToolMeta; locale?: string }) {
  if (tool.category !== 'Festival') return null;
  const items = ITEMS[tool.slug];
  if (!items?.length) return null;

  const tag = process.env.NEXT_PUBLIC_AMAZON_ASSOCIATE_TAG?.trim() || '';
  const hi = locale === 'hi';
  const copy = hi ? HI[tool.slug] || { heading: 'फेस्टिवल शॉपिंग', intro: 'तैयारी के लिए संबंधित प्रोडक्ट खोजें।', disclosure: 'Amazon पर जाने वाला लिंक (paid link)', cta: 'Amazon पर देखें' } : EN;

  return (
    <section className="mt-8 max-w-5xl mx-auto rounded-3xl border border-amber-200/80 dark:border-amber-400/10 bg-gradient-to-br from-amber-50/70 via-white to-orange-50/50 dark:from-zinc-900 dark:via-zinc-900 dark:to-amber-950/10 p-6 sm:p-7">
      <div className="flex items-start justify-between gap-4">
        <div>
          <span className="text-[10px] font-black uppercase tracking-[0.18em] text-amber-700 dark:text-amber-300">Shopping</span>
          <h2 className="mt-2 text-xl sm:text-2xl font-black">{copy.heading}</h2>
          <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-400">{copy.intro}</p>
        </div>
        <ShoppingBag className="h-6 w-6 shrink-0 text-amber-600" aria-hidden="true" />
      </div>
      <p className="mt-4 text-[11px] leading-5 text-zinc-500 dark:text-zinc-400">
        {tag ? <>As an Amazon Associate I earn from qualifying purchases. <span className="font-semibold">{copy.disclosure}</span>.</> : 'Amazon product-search links are ready; the Associate tracking tag is not configured for this build yet.'}
      </p>
      <div className="mt-5 grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {items.map((item) => (
          <a
            key={item.query}
            href={amazonSearchUrl(item.query, tag)}
            target="_blank"
            rel="nofollow sponsored noopener noreferrer"
            className="group rounded-2xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-950/60 p-4 hover:border-amber-400 hover:-translate-y-0.5 transition-all"
          >
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 dark:bg-amber-950/30 text-amber-600">{item.icon}</span>
              <span className="text-sm font-bold">{item.title}</span>
            </div>
            <span className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-violet-600 dark:text-violet-400">
              {copy.cta}<ExternalLink className="h-3.5 w-3.5" />
            </span>
            <span className="mt-2 block text-[10px] text-zinc-400">{tag ? copy.disclosure : 'Amazon search'}</span>
          </a>
        ))}
      </div>
    </section>
  );
}
