import fs from 'fs';

let file = fs.readFileSync('src/App.tsx', 'utf-8');

const imports = `import { Chess, Square } from 'chess.js';
import { StockfishEngine } from './StockfishEngine';
import { posToSquare, squareToPos, getBoard, PIECE_UNICODE, PieceType, Piece, Board, ChessPos } from './chessUtils';
`;

// Add imports after the last import
const lastImportIndex = file.lastIndexOf('import ');
const endOfLastImport = file.indexOf('\\n', lastImportIndex) + 1;

file = file.substring(0, endOfLastImport) + imports + file.substring(endOfLastImport);

const startMarker = "type PieceType = 'K'|'Q'|'R'|'B'|'N'|'P';";
const endMarker = "const ChessBoard = ({ ";

const startIndex = file.indexOf(startMarker);
const endIndex = file.indexOf(endMarker);

if (startIndex === -1 || endIndex === -1) {
  console.error('Markers not found');
  process.exit(1);
}

const newChessLogic = `
interface MoveRecord {
  moveNumber: number;
  player: 'w' | 'b';
  from: ChessPos;
  to: ChessPos;
  piece: Piece;
  captured: Piece | null;
  fenBefore: string;
  fenAfter: string;
  evaluation: number;
  bestMoves?: { move: string, val: number }[];
  classification?: 'Brilliant' | 'Great' | 'Best' | 'Excellent' | 'Book' | 'Inaccuracy' | 'Mistake' | 'Blunder';
  explanation?: string;
}

`;

file = file.substring(0, startIndex) + newChessLogic + file.substring(endIndex);

fs.writeFileSync('src/App.tsx', file);
console.log('Replaced chess logic and added imports');
