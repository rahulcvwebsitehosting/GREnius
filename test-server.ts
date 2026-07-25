import express from 'express';
import { spawn, ChildProcess } from 'child_process';
import fs from 'fs';

const STOCKFISH_PATH = process.env.STOCKFISH_PATH || 'C:\\Users\\saini\\Downloads\\stockfish-windows-x86-64\\stockfish\\stockfish-windows-x86-64.exe';

class StockfishManager {
  private process: ChildProcess | null = null;
  private ready = false;
  private buffer = '';
  private requestQueue: Array<{
    command: string;
    resolve: (result: string) => void;
    reject: (err: Error) => void;
    expectBestmove: boolean;
  }> = [];
  private processing = false;

  start(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!fs.existsSync(STOCKFISH_PATH)) {
        console.error(`Stockfish binary not found at ${STOCKFISH_PATH}`);
        reject(new Error(`Stockfish binary not found at ${STOCKFISH_PATH}`));
        return;
      }

      console.log(`Starting Stockfish from ${STOCKFISH_PATH}`);
      this.process = spawn(STOCKFISH_PATH, [], { stdio: ['pipe', 'pipe', 'pipe'] });

      const timeout = setTimeout(() => {
        console.error('Stockfish initialization timed out');
        reject(new Error('Stockfish initialization timed out'));
      }, 15000);

      let uciOk = false;
      let readyOk = false;

      const checkReady = () => {
        if (uciOk && readyOk) {
          clearTimeout(timeout);
          this.ready = true;
          console.log('Stockfish engine ready');
          resolve();
        }
      };

      this.process.stdout?.on('data', (data: Buffer) => {
        const output = data.toString();
        console.log('Stockfish stdout:', output);
        this.buffer += output;
        const lines = this.buffer.split('\n');
        this.buffer = lines.pop() || '';

        for (const line of lines) {
          const trimmed = line.trim();
          if (trimmed === 'uciok') {
            console.log('Received uciok');
            uciOk = true;
            if (this.process?.stdin?.writable) {
              this.process.stdin.write('isready\n');
            } else {
              console.error('Stockfish stdin not writable');
            }
          } else if (trimmed === 'readyok') {
            console.log('Received readyok');
            readyOk = true;
            checkReady();
          }
        }
      });

      this.process.stderr?.on('data', (data: Buffer) => {
        console.error('Stockfish stderr:', data.toString());
      });

      this.process.on('error', (err) => {
        console.error('Stockfish process error:', err);
        clearTimeout(timeout);
        reject(err);
      });

      this.process.on('exit', (code) => {
        console.log(`Stockfish exited with code ${code}`);
        this.ready = false;
        this.process = null;
      });

      if (this.process.stdin?.writable) {
        console.log('Sending uci command');
        this.process.stdin.write('uci\n');
      } else {
        console.error('Stockfish stdin not writable');
        reject(new Error('Stockfish stdin not writable'));
      }
    });
  }

  private processNext(): void {
    if (this.processing || this.requestQueue.length === 0) return;
    this.processing = true;
    const request = this.requestQueue.shift()!;

    let resultBuffer = '';
    let timeout: NodeJS.Timeout | null = null;

    const onData = (data: Buffer) => {
      const output = data.toString();
      console.log('Stockfish response:', output);
      resultBuffer += output;
      const lines = resultBuffer.split('\n');
      resultBuffer = lines.pop() || '';

      for (const line of lines) {
        const trimmed = line.trim();
        if (request.expectBestmove && trimmed.startsWith('bestmove')) {
          console.log('Found bestmove:', trimmed);
          cleanup();
          this.processing = false;
          request.resolve(trimmed);
          this.processNext();
          return;
        }
        if (!request.expectBestmove && trimmed === 'readyok') {
          console.log('Found readyok');
          cleanup();
          this.processing = false;
          request.resolve(trimmed);
          this.processNext();
          return;
        }
      }
    };

    const onError = (err: Error) => {
      console.error('Stockfish command error:', err);
      cleanup();
      this.processing = false;
      request.reject(err);
      this.processNext();
    };

    const cleanup = () => {
      if (timeout) clearTimeout(timeout);
      this.process?.stdout?.removeListener('data', onData);
      this.process?.removeListener('error', onError);
      this.process?.removeListener('exit', onExit);
    };

    const onExit = () => {
      console.log('Stockfish process exited during command');
      cleanup();
      this.processing = false;
      request.reject(new Error('Stockfish process exited'));
      this.processNext();
    };

    timeout = setTimeout(() => {
      console.error('Stockfish command timed out');
      cleanup();
      this.processing = false;
      request.reject(new Error('Stockfish command timeout'));
      this.processNext();
    }, 30000);

    this.process?.stdout?.on('data', onData);
    this.process?.on('error', onError);
    this.process?.on('exit', onExit);

    if (this.process?.stdin?.writable) {
      console.log('Sending command:', request.command);
      this.process.stdin.write(request.command);
    } else {
      console.error('Stockfish stdin not writable for command');
      cleanup();
      this.processing = false;
      request.reject(new Error('Stockfish stdin not writable'));
      this.processNext();
    }
  }

  sendCommand(command: string, expectBestmove = true): Promise<string> {
    return new Promise((resolve, reject) => {
      this.requestQueue.push({ command, resolve, reject, expectBestmove });
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
    await this.sendCommand(`setoption name Skill Level value ${skillLevel}\nisready\n`, false);
    if (elo) {
      await this.sendCommand('setoption name UCI_LimitStrength value true\nisready\n', false);
      await this.sendCommand(`setoption name UCI_Elo value ${elo}\nisready\n`, false);
    } else {
      await this.sendCommand('setoption name UCI_LimitStrength value false\nisready\n', false);
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

process.on('uncaughtException', (err) => {
  console.error('UNCAUGHT EXCEPTION:', err);
});
process.on('unhandledRejection', (reason) => {
  console.error('UNHANDLED REJECTION:', reason);
});

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

  app.get('/api/stockfish/health', async (req, res) => {
    try {
      const status = {
        ready: stockfish['ready'],
        process: stockfish['process'] ? {
          pid: stockfish['process'].pid,
          connected: stockfish['process'].connected,
        } : null,
        queueLength: stockfish['requestQueue'].length,
        processing: stockfish['processing'],
      };
      res.json({ status });
    } catch (err) {
      console.error("Health check error", err);
      res.status(500).json({ error: 'Health check failed', details: err instanceof Error ? err.message : String(err) });
    }
  });

  app.post('/api/stockfish/move', async (req, res) => {
    try {
      const { fen, depth = 15 } = req.body;
      if (!fen) return res.status(400).json({ error: 'FEN is required' });
      console.log(`Getting best move for FEN: ${fen}, depth: ${depth}`);
      const bestMove = await stockfish.getBestMove(fen, depth);
      console.log(`Best move: ${bestMove}`);
      res.json({ bestMove });
    } catch (err) {
      console.error("Stockfish move error", err);
      res.status(500).json({ error: 'Stockfish engine error', details: err instanceof Error ? err.message : String(err) });
    }
  });

  app.post('/api/stockfish/evaluate', async (req, res) => {
    try {
      const { fen, depth = 12 } = req.body;
      if (!fen) return res.status(400).json({ error: 'FEN is required' });
      console.log(`Evaluating position: ${fen}, depth: ${depth}`);
      const evaluation = await stockfish.evaluatePosition(fen, depth);
      console.log(`Evaluation: ${JSON.stringify(evaluation)}`);
      res.json(evaluation);
    } catch (err) {
      console.error("Stockfish evaluate error", err);
      res.status(500).json({ error: 'Stockfish engine error', details: err instanceof Error ? err.message : String(err) });
    }
  });

  app.post('/api/stockfish/configure', async (req, res) => {
    try {
      const { skillLevel, elo } = req.body;
      console.log(`Configuring Stockfish: skillLevel=${skillLevel}, elo=${elo}`);
      await stockfish.setDifficulty(skillLevel || 10, elo);
      res.json({ success: true });
    } catch (err) {
      console.error("Stockfish configure error", err);
      res.status(500).json({ error: 'Failed to configure Stockfish', details: err instanceof Error ? err.message : String(err) });
    }
  });

  const port = 5174;
  const server = app.listen(port, '0.0.0.0', () => {
    console.log(`Test server running on http://0.0.0.0:${port}`);
    console.log(`Stockfish: ${STOCKFISH_PATH}`);
  });

  server.on('error', (err) => {
    console.error('Server error:', err);
  });

  // Keep process alive
  setInterval(() => {}, 1000);
}

startServer().catch(console.error);