import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const GNEWS_KEY = process.env.GNEWS_API_KEY || '762c3df44daeb44814a314cc2d2f6092';
const NEWSDATA_KEY = process.env.NEWSDATA_API_KEY || 'pub_498b18ed0ba44a79a9808554a9b78f81';
const THENEWSAPI_KEY = process.env.THENEWSAPI_KEY || '8rJEVScDpCbPop4kdpa5BbZOEqIzToVWAejRBBfF';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Proxy for News
  app.get('/api/news', async (req, res) => {
    const { category, country } = req.query;
    const gnewsCategory = category as string;
    const gnewsCountry = country as string;

    console.log(`Server: Fetching news for ${category} in ${country}`);

    // 1. Try GNews
    try {
      const gnewsRes = await fetch(
        `https://gnews.io/api/v4/top-headlines?category=${gnewsCategory}&country=${gnewsCountry}&lang=en&apikey=${GNEWS_KEY}`
      );
      if (gnewsRes.ok) {
        const data = await gnewsRes.json();
        return res.json({ source: 'gnews', articles: data.articles });
      }
    } catch (e) {
      console.error('Server: GNews failed', e);
    }

    // 2. Fallback to NewsData.io
    try {
      const newsDataRes = await fetch(
        `https://newsdata.io/api/1/news?apikey=${NEWSDATA_KEY}&category=${gnewsCategory}&country=${gnewsCountry}&language=en`
      );
      if (newsDataRes.ok) {
        const data = await newsDataRes.json();
        return res.json({ source: 'newsdata', results: data.results });
      }
    } catch (e) {
      console.error('Server: NewsData failed', e);
    }

    // 3. Fallback to TheNewsAPI
    try {
      const theNewsRes = await fetch(
        `https://api.thenewsapi.com/v1/news/top?api_token=${THENEWSAPI_KEY}&categories=${gnewsCategory}&locale=${gnewsCountry}&language=en`
      );
      if (theNewsRes.ok) {
        const data = await theNewsRes.json();
        return res.json({ source: 'thenewsapi', data: data.data });
      }
    } catch (e) {
      console.error('Server: TheNewsAPI failed', e);
    }

    res.status(500).json({ error: 'All news sources failed' });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
