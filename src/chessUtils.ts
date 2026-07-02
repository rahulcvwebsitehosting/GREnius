import { Chess, Square } from 'chess.js';

export type PieceType = 'K'|'Q'|'R'|'B'|'N'|'P';
export type Piece = { type: PieceType, color: 'w'|'b' } | null;
export type Board = Piece[][];
export type ChessPos = { row: number; col: number };

export const PIECE_UNICODE: Record<string, string> = {
  wK:'♔', wQ:'♕', wR:'♖', wB:'♗', wN:'♘', wP:'♙',
  bK:'♚', bQ:'♛', bR:'♜', bB:'♝', bN:'♞', bP:'♟'
};

export function posToSquare(pos: ChessPos): Square {
  return (String.fromCharCode(97 + pos.col) + (8 - pos.row)) as Square;
}

export function squareToPos(sq: string): ChessPos {
  return { col: sq.charCodeAt(0) - 97, row: 8 - parseInt(sq[1]) };
}

export function getBoard(chess: Chess): Board {
  return chess.board().map(row => row.map(p => p ? { type: p.type.toUpperCase() as PieceType, color: p.color } : null));
}
