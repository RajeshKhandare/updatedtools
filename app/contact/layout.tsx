import type { Metadata } from 'next';
import { SITE_NAME, SITE_URL } from '@/config/site';

export const metadata: Metadata = {
  title: `Contact ${SITE_NAME} | Support, Feedback & Tool Requests`,
  description: `Contact ${SITE_NAME} for tool requests, bug reports, feedback, partnership questions, and support.`,
  alternates: { canonical: SITE_URL + '/contact' },
  openGraph: { title: `Contact ${SITE_NAME}`, description: `Get in touch with ${SITE_NAME} for support, feedback, and tool requests.`, url: SITE_URL + '/contact', siteName: SITE_NAME, type: 'website' },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) { return children; }
