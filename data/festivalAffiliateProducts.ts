export type CuratedAmazonProduct = {
  asin: string;
  title: string;
  url: string;
};

export type NavratriColorProduct = CuratedAmazonProduct & {
  day: number;
  color: string;
  colorHex: string;
};

export const CURATED_FESTIVAL_PRODUCTS: Record<string, CuratedAmazonProduct[]> = {
  'navratri-colors-2026': [
    {
      asin: 'B0H5XGHG62',
      title: 'GELAI ENTERPRIS Anarkali Dress with Dupatta – Traditional Wear',
      url: 'https://www.amazon.in/dp/B0H5XGHG62?tag=innovative067-21',
    },
    {
      asin: 'B0FMYKFFQ4',
      title: 'KLOSIA Women Embroidery Solid Anarkali Kurta and Pant Set with Dupatta',
      url: 'https://www.amazon.in/dp/B0FMYKFFQ4?tag=innovative067-21',
    },
    {
      asin: 'B0FVSDSQ8G',
      title: 'PARTHVI Women’s Printed Straight Kurta Set with Palazzo Pants & Dupatta',
      url: 'https://www.amazon.in/dp/B0FVSDSQ8G?tag=innovative067-21',
    },
  ],
};

export const NAVRATRI_COLOR_PRODUCTS: Record<number, NavratriColorProduct[]> = {
  6: [
    {
      day: 6,
      color: 'Green',
      colorHex: '#22c55e',
      asin: 'B0H5XGHG62',
      title: 'GELAI ENTERPRIS Anarkali Dress with Dupatta – Traditional Wear',
      url: 'https://www.amazon.in/dp/B0H5XGHG62?tag=innovative067-21',
    },
    {
      day: 6,
      color: 'Green',
      colorHex: '#22c55e',
      asin: 'B0FMYKFFQ4',
      title: 'KLOSIA Women Embroidery Solid Anarkali Kurta and Pant Set with Dupatta',
      url: 'https://www.amazon.in/dp/B0FMYKFFQ4?tag=innovative067-21',
    },
    {
      day: 6,
      color: 'Green',
      colorHex: '#22c55e',
      asin: 'B0FVSDSQ8G',
      title: 'PARTHVI Women’s Printed Straight Kurta Set with Palazzo Pants & Dupatta',
      url: 'https://www.amazon.in/dp/B0FVSDSQ8G?tag=innovative067-21',
    },
  ],
};
