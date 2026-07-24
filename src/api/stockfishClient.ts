const API_BASE = '/api/stockfish';

interface Evaluation {
  score: number;
  isMate: boolean;
  mateIn?: number;
}

export async function getBestMove(fen: string, depth: number = 15): Promise<string> {
  try {
    console.log(`Requesting best move for FEN: ${fen}, depth: ${depth}`);
    const res = await fetch(API_BASE + '/move', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fen, depth }),
    });
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      console.error('Stockfish API error:', res.status, errorData);
      throw new Error(errorData.error || `API error: ${res.status}`);
    }
    const data = await res.json();
    console.log(`Received best move: ${data.bestMove}`);
    return data.bestMove || '';
  } catch (err) {
    console.error('getBestMove error:', err);
    throw err;
  }
}

export async function evaluatePosition(fen: string, depth: number = 12): Promise<Evaluation> {
  try {
    console.log(`Requesting evaluation for FEN: ${fen}, depth: ${depth}`);
    const res = await fetch(API_BASE + '/evaluate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fen, depth }),
    });
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      console.error('Stockfish API error:', res.status, errorData);
      throw new Error(errorData.error || `API error: ${res.status}`);
    }
    const data = await res.json();
    console.log(`Received evaluation: ${JSON.stringify(data)}`);
    return data;
  } catch (err) {
    console.error('evaluatePosition error:', err);
    throw err;
  }
}

export async function configureStockfish(skillLevel: number, elo?: number): Promise<boolean> {
  try {
    console.log(`Configuring Stockfish: skillLevel=${skillLevel}, elo=${elo}`);
    const res = await fetch(API_BASE + '/configure', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ skillLevel, elo }),
    });
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      console.error('Stockfish configure error:', res.status, errorData);
      return false;
    }
    return true;
  } catch (err) {
    console.error('configureStockfish error:', err);
    return false;
  }
}

export async function sendStockfishCommand(command: string): Promise<string> {
  try {
    console.log(`Sending Stockfish command: ${command}`);
    const res = await fetch(API_BASE + '/command', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ command }),
    });
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      console.error('Stockfish command error:', res.status, errorData);
      throw new Error(errorData.error || `API error: ${res.status}`);
    }
    const data = await res.json();
    console.log(`Command result: ${data.result}`);
    return data.result || '';
  } catch (err) {
    console.error('sendStockfishCommand error:', err);
    throw err;
  }
}

export async function checkStockfishHealth(): Promise<any> {
  try {
    console.log('Checking Stockfish health');
    const res = await fetch(API_BASE + '/health');
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      console.error('Stockfish health check error:', res.status, errorData);
      throw new Error(errorData.error || `Health check failed: ${res.status}`);
    }
    const data = await res.json();
    console.log('Stockfish health:', data);
    return data;
  } catch (err) {
    console.error('checkStockfishHealth error:', err);
    throw err;
  }
}