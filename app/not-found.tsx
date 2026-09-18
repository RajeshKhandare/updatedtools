import type { Metadata } from 'next';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { SITE_NAME } from '@/config/site';

export const metadata: Metadata = {
  title: 'Page Not Found',
  description: 'The requested page could not be found. Return to the home page to browse the available online tools.',
  robots: { index: false, follow: true },
};

export default function NotFound(){return <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 flex flex-col"><Navbar/><main className="flex-1 flex items-center justify-center px-4 py-20 text-center"><div><p className="text-sm font-bold text-violet-600">404</p><h1 className="mt-2 text-3xl font-black">Page not found</h1><p className="mt-3 text-sm text-zinc-500">The page you requested does not exist. Browse {SITE_NAME} tools from the home page.</p><Link href="/" className="mt-6 inline-flex rounded-2xl bg-violet-600 px-5 py-3 text-sm font-bold text-white">Back to Home</Link></div></main><Footer/></div>;}
