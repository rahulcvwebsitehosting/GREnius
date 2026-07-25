import { spawn } from 'child_process';
import * as fs from 'fs';

const STOCKFISH_PATH = 'C:\\Users\\saini\\Downloads\\stockfish-windows-x86-64\\stockfish\\stockfish-windows-x86-64.exe';

console.log('=== Stockfish Diagnostic ===\n');
console.log('1. Checking binary exists:');
if (!fs.existsSync(STOCKFISH_PATH)) {
  console.error(`   ✗ NOT FOUND: ${STOCKFISH_PATH}`);
  process.exit(1);
}
console.log(`   ✓ Found: ${STOCKFISH_PATH}`);

const stats = fs.statSync(STOCKFISH_PATH);
console.log(`   Size: ${(stats.size / 1024 / 1024).toFixed(2)} MB`);

console.log('\n2. Testing Stockfish startup:');
const stockfish = spawn(STOCKFISH_PATH, [], { stdio: ['pipe', 'pipe', 'pipe'] });

let buffer = '';
let uciOk = false;

const timeout = setTimeout(() => {
  console.error('   ✗ TIMEOUT: Stockfish did not respond in 10s');
  stockfish.kill();
  process.exit(1);
}, 10000);

stockfish.stdout.on('data', (data: Buffer) => {
  const output = data.toString();
  buffer += output;
  console.log('   <- stdout:', JSON.stringify(output));

  if (output.includes('uciok')) {
    uciOk = true;
    console.log('\n3. Testing position + go command:');
    stockfish.stdin?.write('position fen rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1\n');
    stockfish.stdin?.write('go depth 1\n');
  }

  if (output.includes('bestmove')) {
    clearTimeout(timeout);
    console.log('\n4. Result:');
    const match = output.match(/bestmove\s+(\S+)/);
    if (match) {
      console.log(`   ✓ Got bestmove: ${match[1]}`);
      console.log('\n=== ALL TESTS PASSED ===');
    } else {
      console.error('   ✗ bestmove not found in output');
    }
    stockfish.kill();
    process.exit(0);
  }
});

stockfish.stderr.on('data', (data: Buffer) => {
  console.error('   <- stderr:', data.toString());
});

stockfish.on('error', (err) => {
  console.error(`   ✗ Process error: ${err.message}`);
  process.exit(1);
});

stockfish.on('exit', (code) => {
  if (code !== 0) {
    console.error(`   ✗ Process exited with code ${code}`);
  }
});

console.log('   Sending: uci');
stockfish.stdin?.write('uci\n');
