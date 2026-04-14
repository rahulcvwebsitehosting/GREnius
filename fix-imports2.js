import fs from 'fs';

let file = fs.readFileSync('src/App.tsx', 'utf-8');

const badImports = `\\import { Chess, Square } from 'chess.js';
import { StockfishEngine } from './StockfishEngine';
import { posToSquare, squareToPos, getBoard, PIECE_UNICODE, PieceType, Piece, Board, ChessPos } from './chessUtils';
`;

file = file.replace(badImports, '');

const goodImports = `import { Chess, Square } from 'chess.js';
import { StockfishEngine } from './StockfishEngine';
import { posToSquare, squareToPos, getBoard, PIECE_UNICODE, PieceType, Piece, Board, ChessPos } from './chessUtils';
`;

// Add after the first import
const firstImportEnd = file.indexOf('\\n', file.indexOf('import ')) + 1;
file = file.substring(0, firstImportEnd) + goodImports + file.substring(firstImportEnd);

fs.writeFileSync('src/App.tsx', file);
console.log('Fixed imports again');
