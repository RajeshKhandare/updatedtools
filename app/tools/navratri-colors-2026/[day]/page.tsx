import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import { ArrowLeft, Sparkles, Heart, ShoppingBag, Utensils, Music2, Flower2, CalendarDays } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { getNavratriDays } from '@/data/festivalNavratri';
import { SITE_URL } from '@/config/site';

export const dynamicParams = false;

export function generateStaticParams() {
  return Array.from({length:9},(_,i)=>({day:`day-${i+1}`}));
}

export async function generateMetadata({params}:{params:Promise<{day:string}>}):Promise<Metadata>{
  const {day}=await params;
  const dayNumber=Number(day.replace(/^day-/,'') );
  const item=getNavratriDays('en')[dayNumber-1];
  if(!item) return {};
  return {
    title:`Navratri Day ${item.day} ${item.color} ${item.date} | Toolployee`,
    description:`Navratri Day ${item.day} on ${item.date}: ${item.color} color, ${item.devi}, significance, puja ideas, outfit ideas and festive planning.`,
    alternates:{canonical:`${SITE_URL}/tools/navratri-colors-2026/day-${item.day}`,languages:{en:`${SITE_URL}/tools/navratri-colors-2026/day-${item.day}`,hi:`${SITE_URL}/hi/tools/navratri-colors-2026/day-${item.day}`}},
  };
}

export default async function NavratriDayPage({params}:{params:Promise<{day:string}>}){
  const {day}=await params;
  const index=Number(day.replace(/^day-/,'') )-1;
  const item=getNavratriDays('en')[index];
  if(!item) notFound();
  const next=index<8?item.day+1:1;
  const previous=index>0?item.day-1:9;
  return <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 flex flex-col">
    <Navbar/>
    <main className="flex-1">
      <section className="relative overflow-hidden border-b border-amber-200/70 dark:border-amber-500/10 bg-gradient-to-br from-orange-50 via-white to-violet-50 dark:from-zinc-950 dark:via-zinc-950 dark:to-violet-950/20">
        <div className="absolute -top-24 right-10 h-72 w-72 rounded-full bg-orange-400/15 blur-3xl"/>
        <div className="absolute -bottom-24 left-10 h-64 w-64 rounded-full bg-violet-500/10 blur-3xl"/>
        <div className="relative mx-auto max-w-5xl px-4 sm:px-6 py-10 sm:py-16">
          <Link href="/tools/navratri-colors-2026" className="inline-flex items-center gap-2 text-xs font-bold text-violet-600 dark:text-violet-400 hover:underline"><ArrowLeft className="h-4 w-4"/>Back to Navratri 2026</Link>
          <div className="mt-7 flex flex-wrap items-center gap-2 text-[11px] font-black uppercase tracking-[0.16em] text-amber-700 dark:text-amber-300"><Sparkles className="h-4 w-4"/><span>Navratri Day {item.day}</span><span>•</span><span>{item.date}</span></div>
          <h1 className="mt-4 text-4xl sm:text-5xl lg:text-6xl font-black tracking-[-0.04em]">{item.color} Day — {item.devi}</h1>
          <p className="mt-4 max-w-3xl text-base sm:text-lg leading-8 text-zinc-600 dark:text-zinc-300">{item.significance}</p>
          <div className="mt-7 flex flex-wrap gap-3">
            <span className="inline-flex items-center gap-2 rounded-full border border-zinc-200 dark:border-white/10 bg-white/80 dark:bg-zinc-900/80 px-4 py-2 text-xs font-bold"><span className="h-3 w-3 rounded-full" style={{background:item.colorHex}}/>{item.color}</span>
            <span className="inline-flex items-center gap-2 rounded-full border border-zinc-200 dark:border-white/10 bg-white/80 dark:bg-zinc-900/80 px-4 py-2 text-xs font-bold"><CalendarDays className="h-4 w-4"/>{item.weekday}</span>
            <span className="inline-flex items-center gap-2 rounded-full border border-zinc-200 dark:border-white/10 bg-white/80 dark:bg-zinc-900/80 px-4 py-2 text-xs font-bold"><Heart className="h-4 w-4"/>{item.festivalMoment}</span>
          </div>
        </div>
      </section>
      <section className="mx-auto max-w-5xl px-4 sm:px-6 py-10 sm:py-14">
        <div className="grid lg:grid-cols-[1.35fr_.65fr] gap-6">
          <div className="space-y-6">
            <article className="rounded-3xl border border-amber-200/70 dark:border-amber-500/10 bg-white dark:bg-zinc-900 p-6 sm:p-8 shadow-sm"><h2 className="text-xl font-black flex items-center gap-2"><Heart className="h-5 w-5 text-rose-500"/>Why this day matters</h2><p className="mt-3 text-sm sm:text-base leading-7 text-zinc-600 dark:text-zinc-300">{item.significance}</p></article>
            <article className="rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 sm:p-8 shadow-sm"><h2 className="text-xl font-black flex items-center gap-2"><Sparkles className="h-5 w-5 text-violet-500"/>What you can do today</h2><div className="mt-4 grid sm:grid-cols-2 gap-3">{item.whatToDo.map(x=><div key={x} className="rounded-2xl bg-zinc-50 dark:bg-zinc-950/70 p-4 text-sm leading-6"><span className="font-black text-violet-600">✓</span> {x}</div>)}</div></article>
            <article className="rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 sm:p-8 shadow-sm"><h2 className="text-xl font-black flex items-center gap-2"><ShoppingBag className="h-5 w-5 text-amber-500"/>Dress, food & celebration</h2><div className="mt-5 grid md:grid-cols-3 gap-4"><div className="rounded-2xl border p-4"><p className="text-[11px] font-black uppercase tracking-wider text-zinc-400">Outfit</p><p className="mt-2 text-sm leading-6">{item.outfit}</p></div><div className="rounded-2xl border p-4"><p className="text-[11px] font-black uppercase tracking-wider text-zinc-400">Prasad / food</p><p className="mt-2 text-sm leading-6">{item.food}</p></div><div className="rounded-2xl border p-4"><p className="text-[11px] font-black uppercase tracking-wider text-zinc-400">Celebration ideas</p><p className="mt-2 text-sm leading-6">{item.festiveIdeas.join(' ')}</p></div></div></article>
          </div>
          <aside className="space-y-4">
            <div className="rounded-3xl bg-zinc-950 text-white p-6 sm:p-7 shadow-xl"><Flower2 className="h-7 w-7 text-violet-300"/><p className="mt-4 text-xs uppercase tracking-widest text-zinc-400">Festival moment</p><h2 className="mt-1 text-xl font-black">{item.festivalMoment}</h2><p className="mt-3 text-sm text-zinc-400">Traditions differ by family and region. Use this page as a practical festive guide and follow your own family or community practice where it differs.</p></div>
            <div className="rounded-3xl border border-amber-200/70 dark:border-amber-500/10 bg-amber-50/70 dark:bg-amber-950/10 p-6"><Utensils className="h-6 w-6 text-amber-600"/><p className="mt-3 text-xs font-black uppercase tracking-wider text-amber-700 dark:text-amber-300">Today’s food note</p><p className="mt-2 text-sm leading-6">{item.food}</p></div>
            <div className="rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6"><Music2 className="h-6 w-6 text-violet-500"/><p className="mt-3 text-xs font-black uppercase tracking-wider text-zinc-400">Keep the vibe going</p><p className="mt-2 text-sm leading-6">{item.festiveIdeas[0]}</p></div>
          </aside>
        </div>
        <div className="mt-10 flex items-center justify-between gap-3"><Link href={`/tools/navratri-colors-2026/day-${previous}`} className="rounded-2xl border border-zinc-200 dark:border-zinc-800 px-4 py-3 text-xs font-bold hover:border-violet-400">← Day {previous}</Link><Link href={`/tools/navratri-colors-2026/day-${next}`} className="rounded-2xl bg-violet-600 text-white px-5 py-3 text-xs font-bold hover:bg-violet-500">Day {next} →</Link></div>
      </section>
    </main>
    <Footer/>
  </div>
}
