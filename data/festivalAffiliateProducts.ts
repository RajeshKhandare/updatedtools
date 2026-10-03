export type CuratedAmazonProduct = {
  asin: string;
  title: string;
  url: string;
};

export const CURATED_FESTIVAL_PRODUCTS: Record<string, CuratedAmazonProduct[]> = {
  'navratri-colors-2026': [
    {
      asin: 'B0BC3PS8XJ',
      title: 'SIRIL Bandhani Printed Chiffon Navratri Saree',
      url: 'https://www.amazon.in/dp/B0BC3PS8XJ?tag=innovative067-21',
    },
    {
      asin: 'B0H6WSXTX',
      title: 'Curated Navratri festival product',
      url: 'https://www.amazon.in/dp/B0H6WSXTX?tag=innovative067-21',
    },
  ],
};
