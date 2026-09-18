import type { Metadata } from 'next';

const SITE_URL = 'https://thetoolgenie.com';

export const metadata: Metadata = {
  title: 'Contact TheToolsGenie | Support, Feedback & Tool Requests',
  description: 'Contact TheToolsGenie for tool requests, bug reports, feedback, partnership questions, and support.',
  alternates: { canonical: SITE_URL + '/contact' },
  openGraph: {
    title: 'Contact TheToolsGenie',
    description: 'Get in touch with TheToolsGenie for support, feedback, and tool requests.',
    url: SITE_URL + '/contact',
    siteName: 'TheToolsGenie',
    type: 'website',
  },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}
