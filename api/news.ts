import type { VercelRequest, VercelResponse } from '@vercel/node';

const GNEWS_KEY = process.env.VITE_GNEWS_API_KEY || process.env.GNEWS_API_KEY || '762c3df44daeb44814a314cc2d2f6092';
const NEWSDATA_KEY = process.env.VITE_NEWSDATA_API_KEY || process.env.NEWSDATA_API_KEY || 'pub_498b18ed0ba44a79a9808554a9b78f81';
const THENEWSAPI_KEY = process.env.VITE_THENEWSAPI_KEY || process.env.THENEWSAPI_KEY || '8rJEVScDpCbPop4kdpa5BbZOEqIzToVWAejRBBfF';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Handle health check
  if (req.url?.endsWith('/health') || req.url?.includes('health=true')) {
    return res.status(200).json({ 
      status: 'ok', 
      message: 'News API is active',
      keys_configured: {
        gnews: !!GNEWS_KEY,
        newsdata: !!NEWSDATA_KEY,
        thenewsapi: !!THENEWSAPI_KEY
      }
    });
  }
  const { category, country } = req.query;
  const gnewsCategory = category || 'general';
  const gnewsCountry = country || 'in';

  console.log(`API: Fetching news for category: ${gnewsCategory}, country: ${gnewsCountry}`);

  // 1. Try GNews
  try {
    console.log(`API: Trying GNews...`);
    const gnewsRes = await fetch(
      `https://gnews.io/api/v4/top-headlines?category=${gnewsCategory}&country=${gnewsCountry}&lang=en&apikey=${GNEWS_KEY}`
    );
    if (gnewsRes.ok) {
      const data = await gnewsRes.json();
      console.log(`API: GNews success, found ${data.articles?.length || 0} articles`);
      return res.status(200).json({ source: 'gnews', articles: data.articles });
    } else {
      console.warn(`API: GNews failed with status ${gnewsRes.status}`);
    }
  } catch (e) {
    console.error('API: GNews exception', e);
  }

  // 2. Fallback to NewsData.io
  try {
    console.log(`API: Trying NewsData.io...`);
    const newsDataCategory = gnewsCategory === 'general' ? 'top' : gnewsCategory;
    const newsDataRes = await fetch(
      `https://newsdata.io/api/1/news?apikey=${NEWSDATA_KEY}&category=${newsDataCategory}&country=${gnewsCountry}&language=en`
    );
    if (newsDataRes.ok) {
      const data = await newsDataRes.json();
      if (data.results && data.results.length > 0) {
        console.log(`API: NewsData success, found ${data.results.length} articles`);
        return res.status(200).json({ source: 'newsdata', results: data.results });
      } else {
        console.warn(`API: NewsData returned no results`);
      }
    } else {
      console.warn(`API: NewsData failed with status ${newsDataRes.status}`);
    }
  } catch (e) {
    console.error('API: NewsData exception', e);
  }

  // 3. Fallback to TheNewsAPI
  try {
    console.log(`API: Trying TheNewsAPI...`);
    const theNewsRes = await fetch(
      `https://api.thenewsapi.com/v1/news/top?api_token=${THENEWSAPI_KEY}&categories=${gnewsCategory}&locale=${gnewsCountry}&language=en`
    );
    if (theNewsRes.ok) {
      const data = await theNewsRes.json();
      console.log(`API: TheNewsAPI success, found ${data.data?.length || 0} articles`);
      return res.status(200).json({ source: 'thenewsapi', data: data.data });
    } else {
      console.warn(`API: TheNewsAPI failed with status ${theNewsRes.status}`);
    }
  } catch (e) {
    console.error('API: TheNewsAPI exception', e);
  }

  return res.status(500).json({ error: 'All news sources failed' });
}
