export interface EngineEvaluation {
  score: number; // in centipawns
  isMate: boolean;
  mateIn?: number;
  bestMove?: string;
  depth?: number;
  pvs?: string[];
}

export class StockfishEngine {
  private worker: Worker;
  private isReady: boolean = false;
  private isInitializing: boolean = false;
  private initPromise: Promise<void> | null = null;
  private callbacks: Record<string, Function> = {};
  private currentDepth: number = 20;
  private onEvalUpdate?: (evaluation: EngineEvaluation) => void;

  constructor() {
    this.worker = new Worker('/stockfish18.js');
    this.worker.onmessage = this.onMessage.bind(this);
    this.init();
  }

  private async init() {
    if (this.isInitializing) return this.initPromise;
    if (this.isReady) return;
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
          // Set efficient defaults for WASM
          this.worker.postMessage('setoption name Threads value 1');
          this.worker.postMessage('setoption name Hash value 32');
          this.worker.postMessage('setoption name MultiPV value 1');
          resolve();
        }
      };

      this.callbacks['uciok'] = () => {
        uciOk = true;
        this.worker.postMessage('isready');
      };

      this.callbacks['readyok'] = () => {
        readyOk = true;
        finishInit();
      };
      
      this.worker.onerror = (e) => {
        clearTimeout(timeoutToken);
        console.error('Stockfish Worker Error:', e);
        this.isInitializing = false;
        reject(new Error('Stockfish worker error'));
      };

      this.worker.postMessage('uci');
    });
    
    return this.initPromise;
  }

  private onMessage(event: MessageEvent) {
    const line = typeof event.data === 'string' ? event.data.trim() : '';
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
        delete this.callbacks['info']; // Clear info callback as well
        callback(match[1]);
      }
    } else if (line.startsWith('info')) {
      this.parseInfoLine(line);
    }
  }

  private parseInfoLine(line: string) {
    const depthMatch = line.match(/depth (\d+)/);
    const cpMatch = line.match(/score cp (-?\d+)/);
    const mateMatch = line.match(/score mate (-?\d+)/);
    const pvMatch = line.match(/pv (.*)/);

    if (depthMatch || cpMatch || mateMatch) {
      const evaluation: EngineEvaluation = {
        score: cpMatch ? parseInt(cpMatch[1]) : 0,
        isMate: !!mateMatch,
        mateIn: mateMatch ? parseInt(mateMatch[1]) : undefined,
        depth: depthMatch ? parseInt(depthMatch[1]) : undefined,
        pvs: pvMatch ? pvMatch[1].split(' ') : undefined
      };

      if (this.onEvalUpdate) {
        this.onEvalUpdate(evaluation);
      }

      if (this.callbacks['info']) {
        this.callbacks['info'](evaluation);
      }
    }
  }

  public setOnEvalUpdate(callback: (evaluation: EngineEvaluation) => void) {
    this.onEvalUpdate = callback;
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

  public async evaluatePosition(fen: string, depth: number = 15): Promise<EngineEvaluation> {
    if (!this.isReady) await this.init();
    return new Promise((resolve) => {
      let lastEval: EngineEvaluation | null = null;

      this.callbacks['info'] = (evaluation: EngineEvaluation) => {
        lastEval = evaluation;
      };

      this.callbacks['bestmove'] = (move: string) => {
        if (lastEval) {
          resolve({ ...lastEval, bestMove: move });
        } else {
          resolve({ score: 0, isMate: false, bestMove: move });
        }
      };

      this.worker.postMessage(`position fen ${fen}`);
      this.worker.postMessage(`go depth ${depth}`);
    });
  }

  public async setDifficulty(level: number, elo?: number) {
    if (!this.isReady) await this.init();
    const skillLevel = Math.max(0, Math.min(20, level));
    this.worker.postMessage(`setoption name Skill Level value ${skillLevel}`);
    
    if (elo) {
      this.worker.postMessage('setoption name UCI_LimitStrength value true');
      this.worker.postMessage(`setoption name UCI_Elo value ${elo}`);
    } else {
      this.worker.postMessage('setoption name UCI_LimitStrength value false');
    }
    
    if (skillLevel < 5) this.currentDepth = 5;
    else if (skillLevel < 15) this.currentDepth = 12;
    else this.currentDepth = 18;
  }

  public stop() {
    this.worker.postMessage('stop');
  }

  public terminate() {
    this.worker.terminate();
  }
}

