import fs from 'fs';
import path from 'path';

const srcDir = path.join(process.cwd(), 'node_modules', 'stockfish', 'bin');
const destDir = path.join(process.cwd(), 'public');

if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir);
}

fs.copyFileSync(path.join(srcDir, 'stockfish.js'), path.join(destDir, 'stockfish.js'));
fs.copyFileSync(path.join(srcDir, 'stockfish.wasm'), path.join(destDir, 'stockfish.wasm'));

console.log('Copied stockfish files to public/');
