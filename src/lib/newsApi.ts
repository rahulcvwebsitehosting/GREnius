import { NewsCard, NewsCategory } from '../types';

const GNEWS_KEY = process.env.NEXT_PUBLIC_GNEWS_API_KEY || '762c3df44daeb44814a314cc2d2f6092';
const NEWSDATA_KEY = process.env.NEXT_PUBLIC_NEWSDATA_API_KEY || 'pub_498b18ed0ba44a79a9808554a9b78f81';
const THENEWSAPI_KEY = process.env.NEXT_PUBLIC_THENEWSAPI_KEY || '8rJEVScDpCbPop4kdpa5BbZOEqIzToVWAejRBBfF';

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

  // 1. Try GNews
  try {
    const res = await fetch(
      `https://gnews.io/api/v4/top-headlines?category=${gnewsCategory}&country=${country}&lang=en&apikey=${GNEWS_KEY}`
    );
    if (res.ok) {
      const data = await res.json();
      return data.articles.map((a: any, i: number) => ({
        id: `gnews-${i}-${a.publishedAt}`,
        title: a.title,
        summary: a.description,
        content: a.content,
        source: {
          name: a.source.name,
          url: a.source.url,
        },
        publishedAt: a.publishedAt,
        imageUrl: a.image,
        category,
        country: country.toUpperCase(),
        readTime: Math.ceil((a.content?.length || 500) / 1000) + 1,
        originalUrl: a.url
      }));
    }
  } catch (e) {
    console.error('GNews failed:', e);
  }

  // 2. Fallback to NewsData.io
  try {
    const res = await fetch(
      `https://newsdata.io/api/1/news?apikey=${NEWSDATA_KEY}&category=${gnewsCategory}&country=${country}&language=en`
    );
    if (res.ok) {
      const data = await res.json();
      return data.results.map((a: any) => ({
        id: `newsdata-${a.article_id}`,
        title: a.title,
        summary: a.description || a.content?.substring(0, 200),
        content: a.content,
        source: {
          name: a.source_id,
          url: a.link,
        },
        publishedAt: a.pubDate,
        imageUrl: a.image_url,
        category,
        country: country.toUpperCase(),
        readTime: Math.ceil((a.content?.length || 500) / 1000) + 1,
        originalUrl: a.link
      }));
    }
  } catch (e) {
    console.error('NewsData failed:', e);
  }

  // 3. Fallback to TheNewsAPI
  try {
    const res = await fetch(
      `https://api.thenewsapi.com/v1/news/top?api_token=${THENEWSAPI_KEY}&categories=${gnewsCategory}&locale=${country}&language=en`
    );
    if (res.ok) {
      const data = await res.json();
      return data.data.map((a: any) => ({
        id: `thenews-${a.uuid}`,
        title: a.title,
        summary: a.description,
        content: a.snippet,
        source: {
          name: a.source,
          url: a.url,
        },
        publishedAt: a.published_at,
        imageUrl: a.image_url,
        category,
        country: country.toUpperCase(),
        readTime: 3,
        originalUrl: a.url
      }));
    }
  } catch (e) {
    console.error('TheNewsAPI failed:', e);
  }

  return [];
}
