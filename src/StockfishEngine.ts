export class StockfishEngine {
  private worker: Worker;
  private isReady: boolean = false;
  private isInitializing: boolean = false;
  private initPromise: Promise<void> | null = null;
  private callbacks: Record<string, Function> = {};
  private currentDepth: number = 20;

  constructor() {
    this.worker = new Worker('/stockfish.js');
    this.worker.onmessage = this.onMessage.bind(this);
    this.init();
  }

  private async init() {
    if (this.isInitializing) return this.initPromise;
    this.isInitializing = true;
    
    this.initPromise = new Promise((resolve, reject) => {
      const timeoutToken = setTimeout(() => {
        console.error('Stockfish Engine: Initialization timeout reached (30s)');
        this.isInitializing = false;
        reject(new Error('Stockfish timeout'));
      }, 30000);

      let uciOk = false;
      let readyOk = false;

      const finishInit = () => {
        if (uciOk && readyOk) {
          console.log('Stockfish Engine: Fully initialized and ready');
          clearTimeout(timeoutToken);
          this.isReady = true;
          this.isInitializing = false;
          // Set safe defaults for lite-single version
          this.worker.postMessage('setoption name Hash value 16');
          resolve();
        }
      };

      this.callbacks['uciok'] = () => {
        console.log('Stockfish Engine: uciok received. Engine identification complete.');
        uciOk = true;
        console.log('Stockfish Engine: Sending isready...');
        this.worker.postMessage('isready');
      };

      this.callbacks['readyok'] = () => {
        console.log('Stockfish Engine: readyok received. Engine is ready for commands.');
        readyOk = true;
        finishInit();
      };
      
      this.worker.onerror = (e) => {
        clearTimeout(timeoutToken);
        console.error('Stockfish Worker Error:', e);
        this.isInitializing = false;
        reject(new Error('Stockfish worker error'));
      };

      console.log('Stockfish Engine: Starting initialization...');
      console.log('Stockfish Engine: Sending uci...');
      this.worker.postMessage('uci');
    });
    
    return this.initPromise;
  }

  private onMessage(event: MessageEvent) {
    const line = typeof event.data === 'string' ? event.data.trim() : '';
    console.log('Stockfish message:', line);
    if (!line) return;
    
    if (line === 'uciok') {
      if (this.callbacks['uciok']) {
        this.callbacks['uciok']();
        delete this.callbacks['uciok'];
      }
    } else if (line === 'readyok') {
      if (this.callbacks['readyok']) {
        this.callbacks['readyok']();
        delete this.callbacks['readyok'];
      }
    } else if (line.startsWith('bestmove')) {
      const match = line.match(/bestmove\s+(\S+)/);
      if (match && this.callbacks['bestmove']) {
        const callback = this.callbacks['bestmove'];
        delete this.callbacks['bestmove'];
        callback(match[1]);
      }
    } else if (line.startsWith('info depth')) {
      if (this.callbacks['info']) {
        this.callbacks['info'](line);
      }
    }
  }

  public async getBestMove(fen: string, depth?: number): Promise<string> {
    if (!this.isReady) await this.init();
    const searchDepth = depth || this.currentDepth;
    return new Promise((resolve) => {
      this.callbacks['bestmove'] = resolve;
      this.worker.postMessage(`position fen ${fen}`);
      this.worker.postMessage(`go depth ${searchDepth}`);
    });
  }

  public async evaluatePosition(fen: string, depth: number = 15): Promise<{ score: number, bestMove: string, lines: any[] }> {
    if (!this.isReady) await this.init();
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
