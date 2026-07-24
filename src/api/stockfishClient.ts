const API_BASE = '/api/stockfish';

interface Evaluation {
  score: number;
  isMate: boolean;
  mateIn?: number;
}

export async function getBestMove(fen: string, depth: number = 15): Promise<string> {
  try {
    const res = await fetch(API_BASE + '/move', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fen, depth }),
    });
    if (!res.ok) throw new Error('API error');
    const data = await res.json();
    return data.bestMove || '';
  } catch {
    return '';
  }
}

export async function evaluatePosition(fen: string, depth: number = 12): Promise<Evaluation> {
  try {
    const res = await fetch(API_BASE + '/evaluate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fen, depth }),
    });
    if (!res.ok) throw new Error('API error');
    return await res.json();
  } catch {
    return { score: 0, isMate: false };
  }
}

export async function configureStockfish(skillLevel: number, elo?: number): Promise<boolean> {
  try {
    const res = await fetch(API_BASE + '/configure', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ skillLevel, elo }),
    });
    return res.ok;
  } catch {
    return false;
  }
}

export async function sendStockfishCommand(command: string): Promise<string> {
  try {
    const res = await fetch(API_BASE + '/command', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ command }),
    });
    if (!res.ok) throw new Error('API error');
    const data = await res.json();
    return data.result || '';
  } catch {
    return '';
  }
}

export function isServerAvailable(): Promise<boolean> {
  return fetch(API_BASE + '/evaluate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1', depth: 1 }),
  }).then(res => res.ok).catch(() => false);
}