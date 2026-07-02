import { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const GROQ_KEY = process.env.GROQ_API_KEY || '';
    const { fenBefore, movePlayed, bestMove, evalDrop } = req.body;

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          { role: 'system', content: 'You are a chess coach. Explain the blunder in 1-2 sentences. Be encouraging, not harsh.' },
          { role: 'user', content: `Position before: ${fenBefore}\nPlayer moved: ${movePlayed}\nBest move was: ${bestMove}\nEvaluation dropped by: ${evalDrop} centipawns\nExplain why this was a mistake and what the better move achieves.` }
        ],
        temperature: 0.7,
        max_tokens: 150
      })
    });

    const data = await response.json();
    const explanation = data.choices?.[0]?.message?.content || "Could not generate an explanation.";

    return res.status(200).json({ explanation });
  } catch (e) {
    console.error("Groq explanation error", e);
    return res.status(200).json({ explanation: "Could not generate an explanation." });
  }
}
