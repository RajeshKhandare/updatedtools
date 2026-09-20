import type { Metadata } from 'next';
import { Geist_Mono, Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import { SITE_NAME, SITE_URL, SITE_URL_CONFIGURED } from '@/config/site';

const jakarta=Plus_Jakarta_Sans({subsets:['latin'],weight:['400','500','600','700','800'],variable:'--font-jakarta'});\nconst geistMono=Geist_Mono({subsets:['latin'],weight:['400','500','600','700'],variable:'--font-geist-mono'});

export const metadata:Metadata={
  metadataBase:new URL(SITE_URL),
  title:{default:`${SITE_NAME} | Free Online Tools`,template:`%s | ${SITE_NAME}`},
  description:'Free online PDF, image, developer, text, converter, calculator, finance, compiler, and YouTube tools. Fast browser-based utilities with no account required.',
  keywords:['free online tools','online tools','PDF tools','image tools','online calculator','online compiler','developer tools','text tools','unit converters','YouTube tools'],
  applicationName:SITE_NAME,
  authors:[{name:SITE_NAME}],
  creator:SITE_NAME,
  publisher:SITE_NAME,
  category:'technology',
  alternates:{canonical:SITE_URL},
  openGraph:{title:`${SITE_NAME} | Free Online Tools`,description:'Free online tools for PDF, images, code, text, conversions, calculators, finance, and YouTube.',url:SITE_URL,siteName:SITE_NAME,locale:'en_US',type:'website'},
  twitter:{card:'summary_large_image',title:`${SITE_NAME} | Free Online Tools`,description:'Free browser-based tools for PDF, images, code, text, conversions, calculators, finance, and YouTube.'},
  robots:{index:SITE_URL_CONFIGURED,follow:true,googleBot:{index:SITE_URL_CONFIGURED,follow:true,'max-video-preview':-1,'max-image-preview':'large','max-snippet':-1}},
  ...(process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION ? {verification:{google:process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION}} : {})
};

export default function RootLayout({children}:{children:React.ReactNode}){
  const org={'@context':'https://schema.org','@type':'Organization',name:SITE_NAME,url:SITE_URL};
  const adsenseClientId=process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;
  const gaMeasurementId=process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
  const siteSchema={'@context':'https://schema.org','@type':'WebSite',name:SITE_NAME,url:SITE_URL,potentialAction:{'@type':'SearchAction',target:SITE_URL+'/?q={search_term_string}','query-input':'required name=search_term_string'}};
  return <html lang="en" className={'scroll-smooth '+jakarta.variable+' '+geistMono.variable}><body className="font-sans antialiased bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 selection:bg-violet-100 selection:text-violet-900"><script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(org)}}/>{adsenseClientId&&<script async src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseClientId}`} crossOrigin="anonymous"/>}{gaMeasurementId&&<><script async src={`https://www.googletagmanager.com/gtag/js?id=${gaMeasurementId}`}/><script dangerouslySetInnerHTML={{__html:`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)};gtag('js',new Date());gtag('config','${gaMeasurementId}',{anonymize_ip:true});`}}/></>}<script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(siteSchema)}}/>{children}</body></html>;
}
