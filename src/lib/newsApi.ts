import { NewsCard, NewsCategory } from '../types';

// Helper to safely access environment variables in Vite
const getEnv = (key: string, defaultValue: string): string => {
  // @ts-ignore
  const env = import.meta.env;
  return env[`VITE_${key}`] || env[`NEXT_PUBLIC_${key}`] || defaultValue;
};

const GNEWS_KEY = getEnv('GNEWS_API_KEY', '762c3df44daeb44814a314cc2d2f6092');
const NEWSDATA_KEY = getEnv('NEWSDATA_API_KEY', 'pub_498b18ed0ba44a79a9808554a9b78f81');
const THENEWSAPI_KEY = getEnv('THENEWSAPI_KEY', '8rJEVScDpCbPop4kdpa5BbZOEqIzToVWAejRBBfF');

const getFavicon = (url: string) => {
  try {
    const domain = new URL(url).hostname;
    return `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;
  } catch (e) {
    return undefined;
  }
};

const CATEGORY_MAP: Record<NewsCategory, string> = {
  'India': 'general',
  'World': 'world',
  'Education': 'technology', // GNews doesn't have education, using tech as proxy
  'Business': 'business',
  'Science': 'science'
};

export async function fetchNews(category: NewsCategory): Promise<NewsCard[]> {
  const country = category === 'India' ? 'in' : 'us';
  const gnewsCategory = CATEGORY_MAP[category];

  console.log(`Fetching news for category: ${category}, country: ${country}`);

  // 1. Try GNews
  try {
    console.log('Trying GNews...');
    const res = await fetch(
      `https://gnews.io/api/v4/top-headlines?category=${gnewsCategory}&country=${country}&lang=en&apikey=${GNEWS_KEY}`
    );
    if (res.ok) {
      const data = await res.json();
      console.log(`GNews success: ${data.articles?.length || 0} articles`);
      return data.articles.map((a: any, i: number) => ({
        id: `gnews-${i}-${a.publishedAt}`,
        title: a.title,
        summary: a.description,
        content: a.content,
        source: {
          name: a.source.name,
          url: a.source.url,
          favicon: getFavicon(a.source.url),
        },
        publishedAt: a.publishedAt,
        imageUrl: a.image,
        category,
        country: country.toUpperCase(),
        readTime: Math.ceil((a.content?.length || 500) / 1000) + 1,
        originalUrl: a.url
      }));
    } else {
      console.warn(`GNews returned status ${res.status}: ${res.statusText}`);
    }
  } catch (e) {
    console.error('GNews failed:', e);
  }

  // 2. Fallback to NewsData.io
  try {
    console.log('GNews failed or returned no data, trying NewsData.io...');
    const res = await fetch(
      `https://newsdata.io/api/1/news?apikey=${NEWSDATA_KEY}&category=${gnewsCategory}&country=${country}&language=en`
    );
    if (res.ok) {
      const data = await res.json();
      console.log(`NewsData success: ${data.results?.length || 0} articles`);
      return data.results.map((a: any) => ({
        id: `newsdata-${a.article_id}`,
        title: a.title,
        summary: a.description || a.content?.substring(0, 200),
        content: a.content,
        source: {
          name: a.source_id,
          url: a.link,
          favicon: getFavicon(a.link),
        },
        publishedAt: a.pubDate,
        imageUrl: a.image_url,
        category,
        country: country.toUpperCase(),
        readTime: Math.ceil((a.content?.length || 500) / 1000) + 1,
        originalUrl: a.link
      }));
    } else {
      console.warn(`NewsData returned status ${res.status}: ${res.statusText}`);
    }
  } catch (e) {
    console.error('NewsData failed:', e);
  }

  // 3. Fallback to TheNewsAPI
  try {
    console.log('NewsData failed or returned no data, trying TheNewsAPI...');
    const res = await fetch(
      `https://api.thenewsapi.com/v1/news/top?api_token=${THENEWSAPI_KEY}&categories=${gnewsCategory}&locale=${country}&language=en`
    );
    if (res.ok) {
      const data = await res.json();
      console.log(`TheNewsAPI success: ${data.data?.length || 0} articles`);
      return data.data.map((a: any) => ({
        id: `thenews-${a.uuid}`,
        title: a.title,
        summary: a.description,
        content: a.snippet,
        source: {
          name: a.source,
          url: a.url,
          favicon: getFavicon(a.url),
        },
        publishedAt: a.published_at,
        imageUrl: a.image_url,
        category,
        country: country.toUpperCase(),
        readTime: 3,
        originalUrl: a.url
      }));
    } else {
      console.warn(`TheNewsAPI returned status ${res.status}: ${res.statusText}`);
    }
  } catch (e) {
    console.error('TheNewsAPI failed:', e);
  }

  return [];
}
