import fs from 'fs';
import path from 'path';

const srcDir = path.join(process.cwd(), 'node_modules', 'stockfish', 'bin');
const destDir = path.join(process.cwd(), 'public');

if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir);
}

// Use Stockfish 18 lite-single which is stable, fast, and doesn't require CORS headers (COOP/COEP)
fs.copyFileSync(path.join(srcDir, 'stockfish-18-lite-single.js'), path.join(destDir, 'stockfish.js'));
fs.copyFileSync(path.join(srcDir, 'stockfish-18-lite-single.wasm'), path.join(destDir, 'stockfish.wasm'));

console.log('Copied Stockfish 18 lite-single package files to public/');
