const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME || 'Toolployee';
const SITE_URL_CONFIGURED = Boolean(process.env.NEXT_PUBLIC_SITE_URL?.trim());
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://updatedtools-8kbg.vercel.app';

export { SITE_NAME, SITE_URL, SITE_URL_CONFIGURED };
