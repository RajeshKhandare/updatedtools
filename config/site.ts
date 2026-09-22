// Toolployee is the locked working brand. Keep the production domain configurable
// until the final domain is purchased and connected.
const SITE_NAME = 'Toolployee';
const SITE_URL_CONFIGURED = Boolean(process.env.NEXT_PUBLIC_SITE_URL?.trim());
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://updatedtools-8kbg.vercel.app';

export { SITE_NAME, SITE_URL, SITE_URL_CONFIGURED };
