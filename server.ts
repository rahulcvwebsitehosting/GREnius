import express from 'express';
import { createServer as createViteServer } from 'vite';
import { spawn, ChildProcess } from 'child_process';
import path from 'path';
import fs from 'fs';

const STOCKFISH_PATH = 'C:\\Users\\saini\\Downloads\\stockfish-windows-x86-64\\stockfish\\stockfish-windows-x86-64.exe';

class StockfishManager {
  private process: ChildProcess | null = null;
  private ready = false;
  private buffer = '';
  private requestQueue: Array<{
    command: string;
    resolve: (result: string) => void;
    reject: (err: Error) => void;
  }> = [];
  private processing = false;

  start(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!fs.existsSync(STOCKFISH_PATH)) {
        reject(new Error(`Stockfish binary not found at ${STOCKFISH_PATH}`));
        return;
      }

      this.process = spawn(STOCKFISH_PATH, [], { stdio: ['pipe', 'pipe', 'pipe'] });

      const timeout = setTimeout(() => {
        reject(new Error('Stockfish initialization timed out'));
      }, 15000);

      let uciOk = false;
      let readyOk = false;

      const checkReady = () => {
        if (uciOk && readyOk) {
          clearTimeout(timeout);
          this.ready = true;
          resolve();
        }
      };

      this.process.stdout?.on('data', (data: Buffer) => {
        this.buffer += data.toString();
        const lines = this.buffer.split('\n');
        this.buffer = lines.pop() || '';

        for (const line of lines) {
          const trimmed = line.trim();
          if (trimmed === 'uciok') {
            uciOk = true;
            this.process?.stdin?.write('isready\n');
          } else if (trimmed === 'readyok') {
            readyOk = true;
            checkReady();
          }
        }
      });

      this.process.stderr?.on('data', (data: Buffer) => {
        console.error('Stockfish stderr:', data.toString());
      });

      this.process.on('error', (err) => {
        clearTimeout(timeout);
        reject(err);
      });

      this.process.on('exit', (code) => {
        console.log(`Stockfish exited with code ${code}`);
        this.ready = false;
        this.process = null;
      });

      this.process.stdin?.write('uci\n');
    });
  }

  private processNext(): void {
    if (this.processing || this.requestQueue.length === 0) return;
    this.processing = true;
    const request = this.requestQueue.shift()!;

    let resultBuffer = '';

    const onData = (data: Buffer) => {
      resultBuffer += data.toString();
      const lines = resultBuffer.split('\n');
      resultBuffer = lines.pop() || '';

      for (const line of lines) {
        const trimmed = line.trim();
        if (trimmed.startsWith('bestmove')) {
          cleanup();
          this.processing = false;
          request.resolve(trimmed);
          this.processNext();
          return;
        }
      }
    };

    const onError = (err: Error) => {
      cleanup();
      this.processing = false;
      request.reject(err);
      this.processNext();
    };

    const cleanup = () => {
      this.process?.stdout?.removeListener('data', onData);
      this.process?.removeListener('error', onError);
      this.process?.removeListener('exit', onExit);
    };

    const onExit = () => {
      cleanup();
      this.processing = false;
      request.reject(new Error('Stockfish process exited'));
      this.processNext();
    };

    this.process?.stdout?.on('data', onData);
    this.process?.on('error', onError);
    this.process?.on('exit', onExit);

    this.process?.stdin?.write(request.command);
  }

  sendCommand(command: string): Promise<string> {
    return new Promise((resolve, reject) => {
      this.requestQueue.push({ command, resolve, reject });
      this.processNext();
    });
  }

  async getBestMove(fen: string, depth: number = 15): Promise<string> {
    const response = await this.sendCommand(`position fen ${fen}\ngo depth ${depth}\n`);
    const match = response.match(/bestmove\s+(\S+)/);
    return match ? match[1] : '';
  }

  async evaluatePosition(fen: string, depth: number = 12): Promise<{ score: number; isMate: boolean; mateIn?: number }> {
    const response = await this.sendCommand(`position fen ${fen}\ngo depth ${depth}\n`);
    const cpMatch = response.match(/score cp (-?\d+)/);
    const mateMatch = response.match(/score mate (-?\d+)/);
    return {
      score: cpMatch ? parseInt(cpMatch[1]) : 0,
      isMate: !!mateMatch,
      mateIn: mateMatch ? parseInt(mateMatch[1]) : undefined
    };
  }

  async setDifficulty(level: number, elo?: number): Promise<void> {
    const skillLevel = Math.max(0, Math.min(20, level));
    await this.sendCommand(`setoption name Skill Level value ${skillLevel}\n`);
    if (elo) {
      await this.sendCommand('setoption name UCI_LimitStrength value true\n');
      await this.sendCommand(`setoption name UCI_Elo value ${elo}\n`);
    } else {
      await this.sendCommand('setoption name UCI_LimitStrength value false\n');
    }
  }

  stop(): void {
    this.process?.stdin?.write('stop\n');
  }

  terminate(): void {
    this.process?.stdin?.write('quit\n');
    this.process?.kill();
    this.process = null;
    this.ready = false;
  }
}

async function startServer() {
  const app = express();
  app.use(express.json());

  const stockfish = new StockfishManager();

  try {
    await stockfish.start();
    console.log('Native Stockfish engine initialized successfully');
  } catch (err) {
    console.error('Failed to start Stockfish:', err);
  }

  app.post('/api/stockfish/move', async (req, res) => {
    try {
      const { fen, depth = 15 } = req.body;
      if (!fen) return res.status(400).json({ error: 'FEN is required' });
      const bestMove = await stockfish.getBestMove(fen, depth);
      res.json({ bestMove });
    } catch (err) {
      res.status(500).json({ error: 'Stockfish engine error' });
    }
  });

  app.post('/api/stockfish/evaluate', async (req, res) => {
    try {
      const { fen, depth = 12 } = req.body;
      if (!fen) return res.status(400).json({ error: 'FEN is required' });
      const evaluation = await stockfish.evaluatePosition(fen, depth);
      res.json(evaluation);
    } catch (err) {
      res.status(500).json({ error: 'Stockfish engine error' });
    }
  });

  app.post('/api/stockfish/configure', async (req, res) => {
    try {
      const { skillLevel, elo } = req.body;
      await stockfish.setDifficulty(skillLevel || 10, elo);
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ error: 'Failed to configure Stockfish' });
    }
  });

  app.post('/api/stockfish/command', async (req, res) => {
    try {
      const { command } = req.body;
      if (!command) return res.status(400).json({ error: 'Command is required' });
      const result = await stockfish.sendCommand(command + '\n');
      res.json({ result });
    } catch (err) {
      res.status(500).json({ error: 'Stockfish engine error' });
    }
  });

  if (process.env.NODE_ENV === 'production') {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  const port = parseInt(process.env.PORT || '5173');
  app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
    console.log(`Stockfish: ${STOCKFISH_PATH}`);
  });
}

startServer().catch(console.error);