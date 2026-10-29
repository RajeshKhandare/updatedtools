const TOKEN_ENDPOINT = 'https://api.amazon.co.uk/auth/o2/token';
const CREATORS_API_ENDPOINT = 'https://creatorsapi.amazon/catalog/v1/searchItems';
const MARKETPLACE = 'www.amazon.in';

type AmazonCreatorsEnv = {
  AMAZON_CREATORS_CLIENT_ID?: string;
  AMAZON_CREATORS_CLIENT_SECRET?: string;
  AMAZON_CREATORS_CREDENTIAL_VERSION?: string;
  AMAZON_ASSOCIATE_TAG?: string;
};

type AmazonProduct = {
  asin: string;
  title: string;
  imageUrl?: string;
  price?: string;
  currency?: string;
  availability?: string;
  url: string;
};

let cachedToken: { value: string; expiresAt: number } | null = null;

async function getAccessToken(env: AmazonCreatorsEnv) {
  const clientId = env.AMAZON_CREATORS_CLIENT_ID?.trim();
  const clientSecret = env.AMAZON_CREATORS_CLIENT_SECRET?.trim();

  if (!clientId || !clientSecret) {
    return null;
  }

  const now = Date.now();
  if (cachedToken && cachedToken.expiresAt > now + 60_000) {
    return cachedToken.value;
  }

  const response = await fetch(TOKEN_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      grant_type: 'client_credentials',
      client_id: clientId,
      client_secret: clientSecret,
      scope: 'creatorsapi::default',
    }),
  });

  const data = await response.json().catch(() => null) as {
    access_token?: unknown;
    expires_in?: unknown;
  } | null;

  if (!response.ok || typeof data?.access_token !== 'string') {
    throw new Error('Amazon Creators API token request failed.');
  }

  const expiresIn = Number(data.expires_in) || 3600;
  cachedToken = {
    value: data.access_token,
    expiresAt: now + Math.max(60, expiresIn - 60) * 1000,
  };

  return cachedToken.value;
}

function withAffiliateTag(url: string, tag: string) {
  try {
    const parsed = new URL(url);
    parsed.searchParams.set('tag', tag);
    return parsed.toString();
  } catch {
    return url;
  }
}

export async function searchAmazonProducts(
  env: AmazonCreatorsEnv,
  keywords: string,
  count = 6,
): Promise<AmazonProduct[]> {
  const partnerTag = env.AMAZON_ASSOCIATE_TAG?.trim();
  const token = await getAccessToken(env);

  if (!token || !partnerTag) {
    return [];
  }

  const response = await fetch(CREATORS_API_ENDPOINT, {
    method: 'POST',
    headers: {
      Authorization: 'Bearer ' + token,
      'Content-Type': 'application/json',
      'x-marketplace': MARKETPLACE,
    },
    body: JSON.stringify({
      keywords,
      partnerTag,
      marketplace: MARKETPLACE,
      itemCount: Math.min(Math.max(count, 1), 10),
      resources: [
        'images.primary.medium',
        'itemInfo.title',
        'offersV2.listings.price',
        'offersV2.listings.availability',
      ],
      condition: 'New',
      availability: 'Available',
      sortBy: 'Relevance',
    }),
  });

  const data = await response.json().catch(() => null) as {
    searchResult?: {
      items?: Array<{
        asin?: string;
        detailPageURL?: string;
        images?: { primary?: { medium?: { url?: string } } };
        itemInfo?: { title?: { displayValue?: string } };
        offersV2?: {
          listings?: Array<{
            isBuyBoxWinner?: boolean;
            availability?: { message?: string; type?: string };
            price?: {
              money?: {
                displayAmount?: string;
                currency?: string;
              };
            };
          }>;
        };
      }>;
    };
  } | null;

  if (!response.ok || !data?.searchResult?.items) {
    throw new Error('Amazon product search failed.');
  }

  return data.searchResult.items
    .map((item) => {
      const listing = item.offersV2?.listings?.find((entry) => entry.isBuyBoxWinner)
        || item.offersV2?.listings?.[0];
      const url = item.detailPageURL || (item.asin
        ? 'https://www.amazon.in/dp/' + item.asin
        : '');

      return {
        asin: item.asin || '',
        title: item.itemInfo?.title?.displayValue || 'Amazon product',
        imageUrl: item.images?.primary?.medium?.url,
        price: listing?.price?.money?.displayAmount,
        currency: listing?.price?.money?.currency,
        availability: listing?.availability?.message || listing?.availability?.type,
        url: partnerTag ? withAffiliateTag(url, partnerTag) : url,
      };
    })
    .filter((item) => item.asin && item.url && item.title);
}
