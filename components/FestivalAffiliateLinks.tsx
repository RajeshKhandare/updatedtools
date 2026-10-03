'use client';

import React, { useEffect, useState } from 'react';
import { ExternalLink, Gift, Lightbulb, ShoppingBag, SprayCan, Sparkles, Shirt } from 'lucide-react';
import type { ToolMeta } from '@/data/toolsRegistry';
import { CURATED_FESTIVAL_PRODUCTS } from '@/data/festivalAffiliateProducts';

type AffiliateItem = {
  title: string;
  query: string;
  icon: React.ReactNode;
};

type AmazonProduct = {
  asin: string;
  title: string;
  imageUrl?: string;
  price?: string;
  availability?: string;
  url: string;
};

const ITEMS: Record<string, AffiliateItem[]> = {
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
  'diwali-mithai-faral-calculator': { heading: 'दिवाली मिठाई और फराल की खरीदारी', intro: 'मिठाई, फराल और गिफ्टिंग की तैयारी के लिए उपयोगी चीजें देखें।', disclosure: 'Amazon पर जाने वाला लिंक (paid link)', cta: 'Amazon पर देखें' },
  'diwali-puja-samagri-checklist': { heading: 'पूजा सामग्री की खरीदारी', intro: 'चेकलिस्ट के साथ पूजा थाली, दीये और जरूरी सामान देखें।', disclosure: 'Amazon पर जाने वाला लिंक (paid link)', cta: 'Amazon पर देखें' },
  'diwali-budget-calculator': { heading: 'दिवाली खरीदारी आइडिया', intro: 'अपने बजट के अनुसार गिफ्ट, कपड़े और सजावट की चीजें देखें।', disclosure: 'Amazon पर जाने वाला लिंक (paid link)', cta: 'Amazon पर देखें' },
  'diya-requirement-calculator': { heading: 'दीये और लाइटिंग की खरीदारी', intro: 'कैलकुलेटर के बाद संबंधित दीये और बाती के प्रोडक्ट देखें।', disclosure: 'Amazon पर जाने वाला लिंक (paid link)', cta: 'Amazon पर देखें' },
  'diwali-cleaning-planner': { heading: 'दिवाली सफाई की खरीदारी', intro: 'सफाई प्लान के अनुसार उपयोगी cleaning और storage सामान देखें।', disclosure: 'Amazon पर जाने वाला लिंक (paid link)', cta: 'Amazon पर देखें' },
  'diwali-countdown-preparation-planner': { heading: 'दिवाली तैयारी की खरीदारी', intro: 'काउंटडाउन के साथ जरूरी सजावट और gift packaging प्रोडक्ट देखें।', disclosure: 'Amazon पर जाने वाला लिंक (paid link)', cta: 'Amazon पर देखें' },
};

const AMAZON_AFFILIATE_UI_ENABLED = false;

const EN = { heading: 'Related Diwali & Festival Shopping', intro: 'Relevant Amazon products are loaded for the preparation tasks covered by this tool.', disclosure: 'Amazon link (paid link)', cta: 'View on Amazon' };

function amazonSearchUrl(query: string) {
  return 'https://www.amazon.in/s?' + new URLSearchParams({ k: query, tag: 'innovative067-21' }).toString();
}

export default function FestivalAffiliateLinks({ tool, locale = 'en' }: { tool: ToolMeta; locale?: string }) {
  const items = ITEMS[tool.slug];
  const [products, setProducts] = useState<AmazonProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!AMAZON_AFFILIATE_UI_ENABLED || tool.category !== 'Festival' || !items?.length) {
      setLoading(false);
      return;
    }

    let cancelled = false;

    const load = async () => {
      try {
        const all: AmazonProduct[] = [];
        for (const item of items) {
          const response = await fetch('/api/amazon-products?q=' + encodeURIComponent(item.query), {
            headers: { Accept: 'application/json' },
          });
          if (!response.ok) continue;
          const data = await response.json();
          if (Array.isArray(data?.products)) {
            for (const product of data.products.slice(0, 3)) {
              if (product && typeof product.asin === 'string' && product.asin && typeof product.url === 'string' && product.url) {
                all.push(product as AmazonProduct);
              }
            }
          }
        }

        if (!cancelled) {
          const seen = new Set<string>();
          const unique: AmazonProduct[] = [];
          for (const product of all) {
            if (seen.has(product.asin)) continue;
            seen.add(product.asin);
            unique.push(product);
          }
          setProducts(unique.slice(0, 8));
        }
      } catch {
        if (!cancelled) setProducts([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    void load();
    return () => { cancelled = true; };
  }, [tool.category, tool.slug]);

  if (!AMAZON_AFFILIATE_UI_ENABLED || tool.slug === 'navratri-colors-2026' || tool.category !== 'Festival' || !items?.length) return null;

  const copy = locale === 'hi'
    ? HI[tool.slug] || { heading: 'फेस्टिवल शॉपिंग', intro: 'तैयारी के लिए संबंधित Amazon प्रोडक्ट देखें।', disclosure: 'Amazon पर जाने वाला लिंक (paid link)', cta: 'Amazon पर देखें' }
    : EN;

  const curated: AmazonProduct[] = (CURATED_FESTIVAL_PRODUCTS[tool.slug] || []).map((product) => ({
    asin: product.asin,
    title: product.title,
    url: product.url,
  }));
  const displayProducts: AmazonProduct[] = products.length > 0 ? products : curated;

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
        As an Amazon Associate I earn from qualifying purchases. <span className="font-semibold">{copy.disclosure}</span>.
      </p>
      {loading && <div className="mt-5 grid sm:grid-cols-2 lg:grid-cols-3 gap-3">{Array.from({ length: 6 }).map((_, index) => <div key={index} className="h-48 rounded-2xl border border-zinc-200/80 dark:border-zinc-800 bg-white/70 dark:bg-zinc-950/60 animate-pulse" />)}</div>}
      {!loading && displayProducts.length > 0 && (
        <div className="mt-5 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {displayProducts.map((product) => (
            <a key={product.asin} href={product.url} target="_blank" rel="nofollow sponsored noopener noreferrer" className="group overflow-hidden rounded-2xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-950/60 hover:border-amber-400 hover:-translate-y-0.5 transition-all">
              <div className="h-40 bg-white dark:bg-zinc-900 flex items-center justify-center p-4">
                {product.imageUrl ? <img src={product.imageUrl} alt={product.title} loading="lazy" className="h-full max-w-full object-contain" /> : <ShoppingBag className="h-10 w-10 text-amber-500" aria-hidden="true" />}
              </div>
              <div className="p-4">
                <p className="text-sm font-bold leading-5 line-clamp-2">{product.title}</p>
                <div className="mt-3 flex items-center justify-between gap-3">
                  {product.price ? <span className="text-base font-black">{product.price}</span> : <span className="text-xs text-zinc-500">See current Amazon price</span>}
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-violet-600 dark:text-violet-400">{copy.cta}<ExternalLink className="h-3.5 w-3.5" /></span>
                </div>
                {product.availability && <p className="mt-2 text-[10px] text-zinc-400">{product.availability}</p>}
              </div>
            </a>
          ))}
        </div>
      )}
      {!loading && displayProducts.length === 0 && (
        <div className="mt-5 rounded-2xl border border-dashed border-zinc-300 dark:border-zinc-700 bg-white/60 dark:bg-zinc-950/50 p-5">
          <p className="text-sm font-semibold">Live Amazon products are temporarily unavailable.</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {items.map((item) => <a key={item.query} href={amazonSearchUrl(item.query)} target="_blank" rel="nofollow sponsored noopener noreferrer" className="inline-flex items-center gap-1 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-3 py-2 text-xs font-bold text-violet-600 dark:text-violet-400">{item.title}<ExternalLink className="h-3.5 w-3.5" /></a>)}
          </div>
        </div>
      )}
    </section>
  );
}
