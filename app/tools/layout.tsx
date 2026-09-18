import type { Metadata } from 'next';
const SITE_URL=process.env.NEXT_PUBLIC_SITE_URL||'https://updatedtools-8kbg.vercel.app';
export const metadata:Metadata={title:'All Online Tools',description:'Browse all free online PDF, image, developer, text, converter, calculator, finance, compiler, and YouTube tools from TheToolsGenie.',alternates:{canonical:SITE_URL+'/tools'},openGraph:{title:'All Online Tools | TheToolsGenie',description:'Browse all free online tools in one place.',url:SITE_URL+'/tools',siteName:'TheToolsGenie',type:'website'}};
export default function ToolsLayout({children}:{children:React.ReactNode}){return children;}
