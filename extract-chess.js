import fs from 'fs';

let file = fs.readFileSync('src/App.tsx', 'utf-8');

const startMarker = "const ChessBoard = ({";
const endMarker = "const MemoryPalace = ({";

const startIndex = file.indexOf(startMarker);
const endIndex = file.indexOf(endMarker);

if (startIndex === -1 || endIndex === -1) {
  console.error('Markers not found');
  process.exit(1);
}

const chessGameCode = file.substring(startIndex, endIndex);

fs.writeFileSync('src/components/ChessGame.tsx', `import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Settings as SettingsIcon, ChevronRight, Flame, Trophy, Zap, Keyboard, Menu, X, Search, BookMarked, Book, Maximize2, Minimize2, RotateCcw, Lightbulb, SkipForward, Play, Pause, FastForward, Rewind } from 'lucide-react';
import { Chess, Square } from 'chess.js';
import { StockfishEngine } from '../StockfishEngine';
import { posToSquare, squareToPos, getBoard, PIECE_UNICODE, PieceType, Piece, Board, ChessPos } from '../chessUtils';
import { GameAnalysis } from './GameAnalysis';
import { playSound, XP_REWARDS } from '../utils';

type Difficulty = 'Beginner (600 Elo)' | 'Intermediate (1200 Elo)' | 'Advanced (1800+ Elo)' | 'Extreme Grandmaster (2500+ Elo)';

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

` + chessGameCode);

file = file.substring(0, startIndex) + file.substring(endIndex);

// Add import for ChessGame
const importMarker = "import { GameAnalysis } from './components/GameAnalysis';";
file = file.replace(importMarker, importMarker + "\\nimport ChessGame from './components/ChessGame';");

fs.writeFileSync('src/App.tsx', file);
console.log('Extracted ChessGame');
