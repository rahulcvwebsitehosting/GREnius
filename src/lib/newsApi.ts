import { NewsCard, NewsCategory } from '../types';

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

  try {
    const res = await fetch(`/api/news?category=${gnewsCategory}&country=${country}`);
    if (res.ok) {
      const data = await res.json();
      
      if (data.source === 'gnews') {
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
      } else if (data.source === 'newsdata') {
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
      } else if (data.source === 'thenewsapi') {
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
      }
    } else {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.error || `News proxy returned status ${res.status}`);
    }
  } catch (e) {
    console.error('News fetch failed:', e);
    throw e;
  }

  return [];
}
