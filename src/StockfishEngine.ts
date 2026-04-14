export class StockfishEngine {
  private worker: Worker;
  private isReady: boolean = false;
  private callbacks: Record<string, Function> = {};
  private currentDepth: number = 20;

  constructor() {
    this.worker = new Worker('/stockfish.js');
    this.worker.onmessage = this.onMessage.bind(this);
    this.worker.postMessage('uci');
    this.worker.postMessage('setoption name Threads value 4');
    this.worker.postMessage('setoption name Hash value 128');
  }

  private onMessage(event: MessageEvent) {
    const line = event.data;
    if (line === 'uciok') {
      this.isReady = true;
      this.worker.postMessage('isready');
    } else if (line === 'readyok') {
      if (this.callbacks['ready']) {
        this.callbacks['ready']();
        delete this.callbacks['ready'];
      }
    } else if (line.startsWith('bestmove')) {
      const match = line.match(/bestmove\s+(\S+)/);
      if (match && this.callbacks['bestmove']) {
        this.callbacks['bestmove'](match[1]);
        delete this.callbacks['bestmove'];
      }
    } else if (line.startsWith('info depth')) {
      if (this.callbacks['info']) {
        this.callbacks['info'](line);
      }
    }
  }

  public async getBestMove(fen: string, depth?: number): Promise<string> {
    const searchDepth = depth || this.currentDepth;
    return new Promise((resolve) => {
      this.callbacks['bestmove'] = resolve;
      this.worker.postMessage(`position fen ${fen}`);
      this.worker.postMessage(`go depth ${searchDepth}`);
    });
  }

  public async evaluatePosition(fen: string, depth: number = 15): Promise<{ score: number, bestMove: string, lines: any[] }> {
    return new Promise((resolve) => {
      let bestMove = '';
      let score = 0;
      let lines: any[] = [];

      this.callbacks['info'] = (line: string) => {
        const scoreMatch = line.match(/score cp (-?\d+)/);
        const mateMatch = line.match(/score mate (-?\d+)/);
        const pvMatch = line.match(/pv\s+(.*)/);
        
        if (scoreMatch) score = parseInt(scoreMatch[1]);
        else if (mateMatch) score = parseInt(mateMatch[1]) * 10000; // Large value for mate

        if (pvMatch) {
          lines.push({ score, pv: pvMatch[1].split(' ') });
        }
      };

      this.callbacks['bestmove'] = (move: string) => {
        delete this.callbacks['info'];
        resolve({ score, bestMove: move, lines });
      };

      this.worker.postMessage(`position fen ${fen}`);
      this.worker.postMessage(`go depth ${depth}`);
    });
  }

  public setDifficulty(difficulty: string) {
    let skillLevel = 20;
    this.currentDepth = 20;
    if (difficulty.includes('Beginner')) {
      skillLevel = 0;
      this.currentDepth = 1;
    } else if (difficulty.includes('Intermediate')) {
      skillLevel = 10;
      this.currentDepth = 5;
    } else if (difficulty.includes('Advanced')) {
      skillLevel = 20;
      this.currentDepth = 15;
    } else if (difficulty.includes('Extreme')) {
      skillLevel = 20;
      this.currentDepth = 22;
    }
    
    this.worker.postMessage(`setoption name Skill Level value ${skillLevel}`);
  }

  public terminate() {
    this.worker.terminate();
  }
}
