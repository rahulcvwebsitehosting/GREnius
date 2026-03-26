/**
 * Master the GRE
 */

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { 
  Brain, 
  LayoutDashboard, 
  BookOpen, 
  Calculator, 
  MessageSquare, 
  Gamepad2, 
  BarChart3, 
  Settings as SettingsIcon, 
  ChevronRight, 
  Flame, 
  Trophy, 
  Zap,
  Menu,
  X,
  Search,
  BookMarked,
  ChevronDown,
  CheckCircle2,
  Clock,
  ArrowRight,
  Trash2,
  Target,
  Volume2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { playSound, fireConfetti, getStorage, setStorage, XP_REWARDS, LEVELS, STORAGE_KEYS, getLevelInfo, awardXP, updateStreak, recordQuizResult } from './utils';
import { GRE_WORDS, GRE_QUANT, GRE_VERBAL } from './data';
import { QuizResult, UserSettings } from './types';
import { 
  StatCard, 
  AccoladeItem, 
  GoalItem, 
  StudySectionCard 
} from './components/DashboardComponents';

// Components for different sections
const Settings = () => {
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [settings, setSettings] = useState<UserSettings>(getStorage(STORAGE_KEYS.settings, {
    name: 'GRE Scholar',
    dailyGoal: 50,
    soundEnabled: true,
    theme: 'light'
  }));

  const updateSetting = (key: keyof UserSettings, value: any) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    setStorage(STORAGE_KEYS.settings, newSettings);
    playSound('correct', newSettings.soundEnabled);
  };

  return (
    <div className="space-y-16 max-w-3xl animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="max-w-xl">
        <h1 className="text-6xl font-serif font-bold text-ink leading-[0.9] mb-6">
          System<br />Configuration.
        </h1>
        <p className="text-lg font-sans text-ink/60 leading-relaxed">
          Tailor the cognitive environment to your specific scholarly requirements. 
          Adjust parameters for optimal focus and data retention.
        </p>
      </header>

      <div className="space-y-12 border-t border-ink/5 pt-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-2">
            <label className="text-[10px] font-sans font-bold text-ink/40 uppercase tracking-[0.2em]">Profile Identity</label>
            <p className="text-xs font-sans text-ink/30 italic leading-relaxed">The nomenclature used for your academic records.</p>
          </div>
          <div className="md:col-span-2">
            <input 
              type="text" 
              value={settings.name}
              onChange={(e) => updateSetting('name', e.target.value)}
              className="w-full p-4 bg-bg-primary border border-ink/5 rounded-sm font-serif text-xl text-ink focus:outline-none focus:border-accent-gold transition-colors"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-2">
            <label className="text-[10px] font-sans font-bold text-ink/40 uppercase tracking-[0.2em]">Daily XP Objective</label>
            <p className="text-xs font-sans text-ink/30 italic leading-relaxed">The minimum threshold for daily cognitive attainment.</p>
          </div>
          <div className="md:col-span-2 space-y-4">
            <input 
              type="range" 
              min="10" 
              max="200" 
              step="10"
              value={settings.dailyGoal}
              onChange={(e) => updateSetting('dailyGoal', parseInt(e.target.value))}
              className="w-full accent-accent-gold"
            />
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-sans font-bold text-ink/40 uppercase tracking-widest">10 XP</span>
              <span className="text-2xl font-serif font-bold text-ink">{settings.dailyGoal} <span className="text-sm italic text-ink/20">XP</span></span>
              <span className="text-[10px] font-sans font-bold text-ink/40 uppercase tracking-widest">200 XP</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-2">
            <label className="text-[10px] font-sans font-bold text-ink/40 uppercase tracking-[0.2em]">Auditory Feedback</label>
            <p className="text-xs font-sans text-ink/30 italic leading-relaxed">Enable or disable sonic cues for correct responses.</p>
          </div>
          <div className="md:col-span-2">
            <button 
              onClick={() => updateSetting('soundEnabled', !settings.soundEnabled)}
              className="flex items-center gap-4 group"
            >
              <div className={`w-12 h-6 rounded-full transition-all duration-500 relative ${settings.soundEnabled ? 'bg-accent-gold' : 'bg-ink/10'}`}>
                <motion.div 
                  animate={{ x: settings.soundEnabled ? 28 : 4 }}
                  className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm"
                />
              </div>
              <span className="text-sm font-sans font-bold text-ink uppercase tracking-widest group-hover:text-accent-gold transition-colors">
                {settings.soundEnabled ? 'Active' : 'Muted'}
              </span>
            </button>
          </div>
        </div>

        <div className="pt-12 border-t border-ink/5">
          <button 
            onClick={() => setShowResetConfirm(true)}
            className="group flex items-center gap-4 text-red-600/40 hover:text-red-600 transition-colors"
          >
            <div className="w-10 h-10 rounded-full border border-current flex items-center justify-center">
              <Trash2 size={16} />
            </div>
            <span className="text-[10px] font-sans font-bold uppercase tracking-[0.2em]">Purge Academic Records</span>
          </button>

          {showResetConfirm && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 p-8 bg-red-50 border border-red-100 rounded-sm space-y-6"
            >
              <p className="text-sm font-sans text-red-700 leading-relaxed">
                This will permanently erase all XP, mastered words, quiz history, and streak data. 
                This action cannot be undone.
              </p>
              <div className="flex items-center gap-6">
                <button
                  onClick={() => { localStorage.clear(); window.location.reload(); }}
                  className="px-8 py-3 bg-red-600 text-white rounded-sm font-sans font-bold text-xs uppercase tracking-[0.2em] hover:bg-red-700 transition-colors"
                >
                  Yes, Purge Everything
                </button>
                <button
                  onClick={() => setShowResetConfirm(false)}
                  className="text-xs font-sans font-bold text-ink/40 uppercase tracking-[0.2em] hover:text-ink transition-colors"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      <footer className="pt-16 text-center">
        <p className="text-[10px] font-sans text-ink/20 uppercase tracking-[0.4em]">GREnius v1.0.0 — Crafted for Excellence</p>
      </footer>
    </div>
  );
};

const Progress = () => {
  const masteredWords = getStorage(STORAGE_KEYS.masteredWords, []);
  const xp = getStorage(STORAGE_KEYS.xp, 0);
  const quizHistory = getStorage(STORAGE_KEYS.quizHistory, []);
  const settings = getStorage(STORAGE_KEYS.settings, { soundEnabled: true });
  
  const { level, title, progress, nextXP } = getLevelInfo(xp);

  const categories = ['Action', 'Art', 'Behavior', 'Change', 'Emotion', 'Intellect', 'Logic', 'Morality', 'Quantity', 'Speech'];
  
  const percentile = Math.min(99, Math.floor((xp / 8000) * 100) + 10);

  return (
    <div className="space-y-16 max-w-5xl animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="max-w-3xl">
        <h1 className="text-6xl md:text-7xl font-serif font-bold text-ink leading-[0.9] mb-8">
          Scholarly<br />Progression.
        </h1>
        <p className="text-xl font-sans text-ink/60 leading-relaxed max-w-2xl">
          An analytical breakdown of your academic milestones. 
          Your current standing reflects a disciplined approach to the Digital Lexicon.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-12 border-y border-ink/5 py-12">
        <div className="space-y-4 text-center md:text-left">
          <div className="w-16 h-16 bg-bg-primary rounded-full border border-ink/5 flex items-center justify-center text-accent-gold mx-auto md:mx-0">
            <Trophy size={24} />
          </div>
          <div className="space-y-1">
            <p className="text-[10px] font-sans font-bold text-ink/40 uppercase tracking-[0.2em]">Current Standing</p>
            <p className="text-3xl font-serif font-bold text-ink">{title}</p>
            <p className="text-xs font-sans text-ink/30 italic">Level {level}</p>
          </div>
        </div>
        <div className="space-y-4 text-center md:text-left">
          <div className="w-16 h-16 bg-bg-primary rounded-full border border-ink/5 flex items-center justify-center text-accent-gold mx-auto md:mx-0">
            <Target size={24} />
          </div>
          <div className="space-y-1">
            <p className="text-[10px] font-sans font-bold text-ink/40 uppercase tracking-[0.2em]">Overall Standing</p>
            <p className="text-3xl font-serif font-bold text-ink">{percentile}th <span className="text-lg text-ink/20 italic">Percentile</span></p>
            <p className="text-xs font-sans text-ink/30 italic">Top {100 - percentile}% of Scholars</p>
          </div>
        </div>
        <div className="space-y-6">
          <div className="flex items-end justify-between">
            <span className="text-xs font-sans font-bold text-ink uppercase tracking-[0.2em]">Experience to Next Milestone</span>
            <span className="text-sm font-serif font-bold text-ink">{xp} / {nextXP} <span className="text-[10px] italic text-ink/20">XP</span></span>
          </div>
          <div className="w-full h-1 bg-ink/5 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 1.5, ease: "circOut" }}
              className="h-full bg-accent-gold"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
        <div className="lg:col-span-2 space-y-12">
          <section className="space-y-8">
            <h2 className="text-xs font-sans font-bold text-ink uppercase tracking-[0.3em] border-b border-ink/5 pb-4">Academic Activity</h2>
            <div className="space-y-4">
              {quizHistory.length > 0 ? (
                quizHistory.slice().reverse().map((quiz: any, idx: number) => (
                  <div key={idx} className="flex items-center justify-between py-4 border-b border-ink/5 last:border-0 group">
                    <div className="flex items-center gap-6">
                      <div className="w-10 h-10 rounded-sm border border-ink/5 flex items-center justify-center text-ink/20 group-hover:text-accent-gold transition-colors">
                        {quiz.type === 'vocabulary' || quiz.type === 'verbal' ? <BookOpen size={16} /> : <Calculator size={16} />}
                      </div>
                      <div>
                        <p className="text-sm font-serif font-bold text-ink uppercase tracking-wider">{quiz.type}</p>
                        <p className="text-[10px] font-sans text-ink/40 uppercase tracking-widest">{new Date(quiz.date).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-serif font-bold text-ink">{quiz.score}%</p>
                      <p className="text-[10px] font-sans text-ink/40 uppercase tracking-widest">Efficiency</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-12 text-center border border-dashed border-ink/10 rounded-sm">
                  <p className="text-sm font-sans text-ink/30 italic">No academic records found in the current session.</p>
                </div>
              )}
            </div>
          </section>
        </div>

        <aside className="space-y-12">
          <section className="space-y-8">
            <h2 className="text-xs font-sans font-bold text-ink uppercase tracking-[0.3em] border-b border-ink/5 pb-4">Category Proficiency</h2>
            <div className="space-y-6">
              {categories.map(cat => {
                const totalInCategory = GRE_WORDS.filter(w => w.category === cat).length;
                const masteredInCategory = GRE_WORDS.filter(w => w.category === cat && masteredWords.includes(w.id)).length;
                const pct = totalInCategory > 0 ? Math.round((masteredInCategory / totalInCategory) * 100) : 0;
                
                return (
                  <div key={cat} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-sans font-bold text-ink/40 uppercase tracking-[0.2em]">{cat}</span>
                      <span className="text-[10px] font-sans font-bold text-ink/60">{pct}%</span>
                    </div>
                    <div className="w-full h-1 bg-ink/5 rounded-full overflow-hidden">
                      <div className="h-full bg-accent-gold transition-all duration-1000" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          <section className="space-y-8">
            <h2 className="text-xs font-sans font-bold text-ink uppercase tracking-[0.3em] border-b border-ink/5 pb-4">Lexical Mastery</h2>
            <div className="space-y-6">
              <div className="p-8 bg-bg-primary border border-ink/5 rounded-sm text-center space-y-2">
                <p className="text-5xl font-serif font-bold text-ink">{masteredWords.length}</p>
                <p className="text-[10px] font-sans font-bold text-ink/40 uppercase tracking-[0.2em]">Words Mastered</p>
              </div>
              <p className="text-xs font-sans text-ink/40 leading-relaxed italic text-center">
                "Words are, of course, the most powerful drug used by mankind." — Rudyard Kipling
              </p>
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
};

// ─── CHESS GAME ────────────────────────────────────────────────────────────────

type Piece = { type: 'K'|'Q'|'R'|'B'|'N'|'P', color: 'w'|'b' } | null;
type Board = Piece[][];
type ChessPos = { row: number; col: number };

const INIT_BOARD: Board = (() => {
  const b: Board = Array(8).fill(null).map(() => Array(8).fill(null));
  const order: Piece['type'][] = ['R','N','B','Q','K','B','N','R'];
  order.forEach((t, c) => {
    b[0][c] = { type: t, color: 'b' };
    b[1][c] = { type: 'P', color: 'b' };
    b[6][c] = { type: 'P', color: 'w' };
    b[7][c] = { type: t, color: 'w' };
  });
  return b;
})();

const PIECE_UNICODE: Record<string, string> = {
  wK:'♔', wQ:'♕', wR:'♖', wB:'♗', wN:'♘', wP:'♙',
  bK:'♚', bQ:'♛', bR:'♜', bB:'♝', bN:'♞', bP:'♟'
};

function cloneBoard(b: Board): Board {
  return b.map(row => row.map(p => p ? {...p} : null));
}

function isInBounds(r: number, c: number): boolean {
  return r >= 0 && r < 8 && c >= 0 && c < 8;
}

function getLegalMoves(board: Board, row: number, col: number, lastMove?: {from: ChessPos, to: ChessPos, piece: Piece}): ChessPos[] {
  const piece = board[row][col];
  if (!piece) return [];
  const moves: ChessPos[] = [];
  const { type, color } = piece;
  const dir = color === 'w' ? -1 : 1;
  const enemy = color === 'w' ? 'b' : 'w';

  const addIfValid = (r: number, c: number, captureOnly = false, moveOnly = false) => {
    if (!isInBounds(r, c)) return false;
    const target = board[r][c];
    if (target) {
      if (!moveOnly && target.color === enemy) moves.push({ row: r, col: c });
      return false; // blocked
    }
    if (!captureOnly) moves.push({ row: r, col: c });
    return true; // empty, keep going
  };

  const slide = (dr: number, dc: number) => {
    let r = row + dr, c = col + dc;
    while (isInBounds(r, c)) {
      const cont = addIfValid(r, c);
      if (!cont) break;
      r += dr; c += dc;
    }
  };

  if (type === 'P') {
    // Forward
    if (addIfValid(row + dir, col, false, true)) {
      // Double push from start
      const startRow = color === 'w' ? 6 : 1;
      if (row === startRow) addIfValid(row + 2 * dir, col, false, true);
    }
    // Captures
    [-1, 1].forEach(dc => {
      const tr = row + dir, tc = col + dc;
      if (isInBounds(tr, tc) && board[tr][tc]?.color === enemy) moves.push({ row: tr, col: tc });
      // En passant
      if (lastMove && lastMove.piece?.type === 'P' && Math.abs(lastMove.from.row - lastMove.to.row) === 2) {
        if (lastMove.to.row === row && lastMove.to.col === tc) {
          moves.push({ row: tr, col: tc });
        }
      }
    });
  }

  if (type === 'N') {
    [[-2,-1],[-2,1],[-1,-2],[-1,2],[1,-2],[1,2],[2,-1],[2,1]].forEach(([dr,dc]) => addIfValid(row+dr, col+dc));
  }
  if (type === 'B' || type === 'Q') { [[-1,-1],[-1,1],[1,-1],[1,1]].forEach(([dr,dc]) => slide(dr,dc)); }
  if (type === 'R' || type === 'Q') { [[-1,0],[1,0],[0,-1],[0,1]].forEach(([dr,dc]) => slide(dr,dc)); }
  if (type === 'K') {
    [[-1,-1],[-1,0],[-1,1],[0,-1],[0,1],[1,-1],[1,0],[1,1]].forEach(([dr,dc]) => addIfValid(row+dr, col+dc));
  }
  return moves;
}

function findKing(board: Board, color: 'w'|'b'): ChessPos | null {
  for (let r = 0; r < 8; r++) for (let c = 0; c < 8; c++) {
    if (board[r][c]?.type === 'K' && board[r][c]?.color === color) return { row: r, col: c };
  }
  return null;
}

function isSquareAttacked(board: Board, row: number, col: number, byColor: 'w'|'b'): boolean {
  for (let r = 0; r < 8; r++) for (let c = 0; c < 8; c++) {
    const p = board[r][c];
    if (p?.color === byColor) {
      const moves = getLegalMoves(board, r, c);
      if (moves.some(m => m.row === row && m.col === col)) return true;
    }
  }
  return false;
}

function isInCheck(board: Board, color: 'w'|'b'): boolean {
  const king = findKing(board, color);
  if (!king) return false;
  const enemy = color === 'w' ? 'b' : 'w';
  return isSquareAttacked(board, king.row, king.col, enemy);
}

function simulateMove(board: Board, from: ChessPos, to: ChessPos): Board {
  const nb = cloneBoard(board);
  const piece = nb[from.row][from.col];
  if (piece?.type === 'P') {
    const promRow = piece.color === 'w' ? 0 : 7;
    if (to.row === promRow) {
      nb[to.row][to.col] = { type: 'Q', color: piece.color };
      nb[from.row][from.col] = null;
      return nb;
    }
    // En passant capture
    if (from.col !== to.col && !board[to.row][to.col]) {
      nb[from.row][to.col] = null;
    }
  }
  nb[to.row][to.col] = piece;
  nb[from.row][from.col] = null;
  return nb;
}

const PIECE_VALUES: Record<string, number> = { P: 100, N: 320, B: 330, R: 500, Q: 900, K: 20000 };

function evaluateBoard(board: Board): number {
  let score = 0;
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const p = board[r][c];
      if (p) {
        let val = PIECE_VALUES[p.type];
        if (p.type === 'P') {
          val += (p.color === 'w' ? (6 - r) : (r - 1)) * 10;
        } else if (p.type === 'N' || p.type === 'B') {
          const centerDist = Math.abs(r - 3.5) + Math.abs(c - 3.5);
          val += (7 - centerDist) * 5;
        }
        score += p.color === 'b' ? val : -val;
      }
    }
  }
  return score;
}

function getAllLegalMoves(board: Board, color: 'w'|'b'): {from: ChessPos, to: ChessPos}[] {
  const moves: {from: ChessPos, to: ChessPos}[] = [];
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      if (board[r][c]?.color === color) {
        const pieceMoves = getLegalMoves(board, r, c);
        for (const to of pieceMoves) {
          moves.push({ from: {row: r, col: c}, to });
        }
      }
    }
  }
  return moves;
}

function minimax(board: Board, depth: number, alpha: number, beta: number, isMaximizing: boolean): number {
  if (depth === 0) return evaluateBoard(board);
  
  const color = isMaximizing ? 'b' : 'w';
  const moves = getAllLegalMoves(board, color);
  
  let hasValidMove = false;
  
  if (isMaximizing) {
    let maxEval = -Infinity;
    for (const move of moves) {
      const nb = simulateMove(board, move.from, move.to);
      if (isInCheck(nb, 'b')) continue;
      hasValidMove = true;
      const ev = minimax(nb, depth - 1, alpha, beta, false);
      maxEval = Math.max(maxEval, ev);
      alpha = Math.max(alpha, ev);
      if (beta <= alpha) break;
    }
    if (!hasValidMove) return isInCheck(board, 'b') ? -99999 : 0;
    return maxEval;
  } else {
    let minEval = Infinity;
    for (const move of moves) {
      const nb = simulateMove(board, move.from, move.to);
      if (isInCheck(nb, 'w')) continue;
      hasValidMove = true;
      const ev = minimax(nb, depth - 1, alpha, beta, true);
      minEval = Math.min(minEval, ev);
      beta = Math.min(beta, ev);
      if (beta <= alpha) break;
    }
    if (!hasValidMove) return isInCheck(board, 'w') ? 99999 : 0;
    return minEval;
  }
}

function aiMove(board: Board, lastMove?: {from: ChessPos, to: ChessPos, piece: Piece}): { from: ChessPos; to: ChessPos } | null {
  const moves: {from: ChessPos, to: ChessPos}[] = [];
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      if (board[r][c]?.color === 'b') {
        const pieceMoves = getLegalMoves(board, r, c, lastMove);
        for (const to of pieceMoves) {
          moves.push({ from: {row: r, col: c}, to });
        }
      }
    }
  }
  let bestMove = null;
  let bestValue = -Infinity;
  
  moves.sort((a, b) => {
     const scoreA = board[a.to.row][a.to.col] ? 10 : 0;
     const scoreB = board[b.to.row][b.to.col] ? 10 : 0;
     return scoreB - scoreA;
  });

  for (const move of moves) {
    const nb = simulateMove(board, move.from, move.to);
    if (isInCheck(nb, 'b')) continue; 
    
    const boardValue = minimax(nb, 2, -Infinity, Infinity, false); 
    const randomizedValue = boardValue + (Math.random() * 10 - 5);
    
    if (randomizedValue > bestValue) {
      bestValue = randomizedValue;
      bestMove = move;
    }
  }
  
  if (!bestMove) {
     for(const m of moves) {
        const nb = simulateMove(board, m.from, m.to);
        if (!isInCheck(nb, 'b')) return m;
     }
  }
  
  return bestMove;
}

function hasLegalMoves(board: Board, color: 'w'|'b', lastMove?: {from: ChessPos, to: ChessPos, piece: Piece}): boolean {
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      if (board[r][c]?.color === color) {
        const moves = getLegalMoves(board, r, c, lastMove);
        for (const m of moves) {
          const nb = simulateMove(board, {row: r, col: c}, m);
          if (!isInCheck(nb, color)) return true;
        }
      }
    }
  }
  return false;
}

function ChessGame() {
  const [board, setBoard] = useState<Board>(INIT_BOARD.map(r => r.map(p => p ? {...p} : null)));
  const [selected, setSelected] = useState<ChessPos | null>(null);
  const [legalMoves, setLegalMoves] = useState<ChessPos[]>([]);
  const [turn, setTurn] = useState<'w'|'b'>('w');
  const [status, setStatus] = useState<string>('Your turn (White)');
  const [gameOver, setGameOver] = useState(false);
  const [lastMove, setLastMove] = useState<{from: ChessPos, to: ChessPos, piece: Piece} | undefined>();
  const [capturedW, setCapturedW] = useState<Piece[]>([]);
  const [capturedB, setCapturedB] = useState<Piece[]>([]);

  const doMove = (board: Board, from: ChessPos, to: ChessPos): Board => {
    return simulateMove(board, from, to);
  };

  const handleSquareClick = (row: number, col: number) => {
    if (gameOver || turn !== 'w') return;
    const piece = board[row][col];

    if (selected) {
      const isLegal = legalMoves.some(m => m.row === row && m.col === col);
      if (isLegal) {
        let captured = board[row][col];
        if (!captured && board[selected.row][selected.col]?.type === 'P' && selected.col !== col) {
          captured = board[selected.row][col];
        }
        if (captured) setCapturedW(prev => [...prev, captured]);
        const nb = doMove(board, selected, { row, col });
        setBoard(nb);
        setLastMove({ from: selected, to: { row, col }, piece: board[selected.row][selected.col] });
        setSelected(null);
        setLegalMoves([]);
        setTurn('b');
        setStatus('AI is thinking...');

        // Check if AI is in check/mate
        setTimeout(() => {
          const aiMv = aiMove(nb, { from: selected, to: { row, col }, piece: board[selected.row][selected.col] });
          if (!aiMv) {
            setStatus(isInCheck(nb, 'b') ? '🏆 Checkmate! You win!' : '🤝 Stalemate!');
            setGameOver(true);
            return;
          }
          let aiCaptured = nb[aiMv.to.row][aiMv.to.col];
          if (!aiCaptured && nb[aiMv.from.row][aiMv.from.col]?.type === 'P' && aiMv.from.col !== aiMv.to.col) {
            aiCaptured = nb[aiMv.from.row][aiMv.to.col];
          }
          if (aiCaptured) setCapturedB(prev => [...prev, aiCaptured]);
          const nb2 = doMove(nb, aiMv.from, aiMv.to);
          setBoard(nb2);
          setLastMove({ from: aiMv.from, to: aiMv.to, piece: nb[aiMv.from.row][aiMv.from.col] });

          if (isInCheck(nb2, 'w')) {
            // Check for checkmate
            if (!hasLegalMoves(nb2, 'w', { from: aiMv.from, to: aiMv.to, piece: nb[aiMv.from.row][aiMv.from.col] })) {
              setStatus('💀 Checkmate! AI wins.'); setGameOver(true); return;
            }
            setStatus('⚠️ You are in check! Your turn (White)');
          } else {
            if (!hasLegalMoves(nb2, 'w', { from: aiMv.from, to: aiMv.to, piece: nb[aiMv.from.row][aiMv.from.col] })) {
              setStatus('🤝 Stalemate!'); setGameOver(true); return;
            }
            setStatus('Your turn (White)');
          }
          setTurn('w');
        }, 400);
        return;
      }
      setSelected(null);
      setLegalMoves([]);
    }

    if (piece?.color === 'w') {
      setSelected({ row, col });
      const pseudoMoves = getLegalMoves(board, row, col, lastMove);
      const validMoves = pseudoMoves.filter(m => {
        const nb = simulateMove(board, {row, col}, m);
        return !isInCheck(nb, 'w');
      });
      setLegalMoves(validMoves);
    }
  };

  const resetGame = () => {
    setBoard(INIT_BOARD.map(r => r.map(p => p ? {...p} : null)));
    setSelected(null); setLegalMoves([]); setTurn('w');
    setStatus('Your turn (White)'); setGameOver(false);
    setCapturedW([]); setCapturedB([]);
  };

  const inCheck = !gameOver && isInCheck(board, 'w');

  return (
    <div className="flex flex-col items-center gap-4 p-4">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-accent-gold font-serif mb-1">Chess</h2>
        <p className={`text-sm font-medium ${inCheck ? 'text-red-500' : 'text-ink/70 dark:text-ink-dark/70'}`}>{status}</p>
      </div>

      {/* Captured pieces */}
      <div className="w-full max-w-xs text-xs text-ink/60 dark:text-ink-dark/60 flex justify-between">
        <span>AI captured: {capturedB.map((p,i) => <span key={i}>{p ? PIECE_UNICODE[p.color+p.type] : ''}</span>)}</span>
        <span>You captured: {capturedW.map((p,i) => <span key={i}>{p ? PIECE_UNICODE[p.color+p.type] : ''}</span>)}</span>
      </div>

      {/* Board */}
      <div className="border-2 border-accent-gold/40 rounded-lg overflow-hidden shadow-xl">
        {board.map((rowArr, row) => (
          <div key={row} className="flex">
            {rowArr.map((piece, col) => {
              const isLight = (row + col) % 2 === 0;
              const isSelected = selected?.row === row && selected?.col === col;
              const isLegal = legalMoves.some(m => m.row === row && m.col === col);
              const isLastMove = lastMove && ((lastMove.from.row===row&&lastMove.from.col===col)||(lastMove.to.row===row&&lastMove.to.col===col));
              const isKingInCheck = inCheck && piece?.type === 'K' && piece?.color === 'w';

              let bg = isLight ? 'bg-amber-100' : 'bg-amber-800';
              if (isSelected) bg = 'bg-yellow-400';
              else if (isKingInCheck) bg = 'bg-red-400';
              else if (isLastMove) bg = isLight ? 'bg-yellow-200' : 'bg-yellow-600';

              return (
                <div
                  key={col}
                  onClick={() => handleSquareClick(row, col)}
                  className={`w-9 h-9 flex items-center justify-center cursor-pointer relative select-none ${bg} hover:brightness-110 transition-all`}
                >
                  {isLegal && (
                    <div className={`absolute inset-0 flex items-center justify-center ${piece ? 'ring-2 ring-inset ring-green-500' : ''}`}>
                      {!piece && <div className="w-3 h-3 rounded-full bg-green-500/50" />}
                    </div>
                  )}
                  {piece && (
                    <span className={`text-xl leading-none z-10 drop-shadow ${piece.color === 'w' ? 'text-white' : 'text-gray-900'}`} style={{textShadow: piece.color==='w' ? '0 0 2px #000,0 0 2px #000' : '0 0 2px #fff'}}>
                      {PIECE_UNICODE[piece.color + piece.type]}
                    </span>
                  )}
                  {/* Coordinates */}
                  {col === 0 && <span className="absolute top-0 left-0.5 text-[8px] opacity-40 font-mono">{8-row}</span>}
                  {row === 7 && <span className="absolute bottom-0 right-0.5 text-[8px] opacity-40 font-mono">{'abcdefgh'[col]}</span>}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      <button onClick={resetGame} className="px-6 py-2 bg-accent-gold text-white rounded-lg font-semibold hover:opacity-90 transition-all text-sm">
        New Game
      </button>
    </div>
  );
}

// ─── WORD SCRAMBLE 

function scrambleWord(word: string): string {
  const letters = word.toUpperCase().split('');
  // Fisher-Yates shuffle — ensure not same as original
  let result = [...letters];
  let attempts = 0;
  do {
    for (let i = result.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [result[i], result[j]] = [result[j], result[i]];
    }
    attempts++;
  } while (result.join('') === letters.join('') && attempts < 20);
  return result.join('');
}

function WordScramble({ onXpChange, soundEnabled }: { onXpChange: (xp: number) => void, soundEnabled: boolean }) {
  const wordPool = GRE_WORDS.filter(w => w.word.length >= 5 && w.word.length <= 10 && !w.word.includes(' '));
  const [currentWord, setCurrentWord] = useState(() => wordPool[Math.floor(Math.random() * wordPool.length)]);
  const [scrambled, setScrambled] = useState(() => scrambleWord(currentWord.word));
  const [input, setInput] = useState('');
  const [feedback, setFeedback] = useState<'correct'|'wrong'|null>(null);
  const [showHint, setShowHint] = useState(false);
  const [showDef, setShowDef] = useState(false);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [letters, setLetters] = useState<{char: string; used: boolean}[]>(() =>
    scrambleWord(currentWord.word).split('').map(c => ({ char: c, used: false }))
  );
  const [assembled, setAssembled] = useState<string[]>([]);

  const loadNew = () => {
    const w = wordPool[Math.floor(Math.random() * wordPool.length)];
    setCurrentWord(w);
    const sc = scrambleWord(w.word);
    setScrambled(sc);
    setLetters(sc.split('').map(c => ({ char: c, used: false })));
    setAssembled([]);
    setInput('');
    setFeedback(null);
    setShowHint(false);
    setShowDef(false);
  };

  const handleLetterClick = (idx: number) => {
    if (letters[idx].used || feedback === 'correct') return;
    const newLetters = [...letters];
    newLetters[idx] = { ...newLetters[idx], used: true };
    setLetters(newLetters);
    setAssembled(prev => [...prev, letters[idx].char]);
  };

  const handleAssembledClick = (idx: number) => {
    if (feedback === 'correct') return;
    const char = assembled[idx];
    const newAssembled = assembled.filter((_, i) => i !== idx);
    setAssembled(newAssembled);
    // Un-use the letter
    const newLetters = [...letters];
    for (let i = 0; i < newLetters.length; i++) {
      if (newLetters[i].char === char && newLetters[i].used) {
        // Find which occurrence to un-use (match usage state)
        const usedCount = newAssembled.filter(c => c === char).length;
        const totalCount = newLetters.filter(l => l.char === char).length;
        // Un-use last used one
        if (newLetters[i].used) { newLetters[i] = { ...newLetters[i], used: false }; break; }
      }
    }
    setLetters(newLetters);
  };

  const handleSubmit = () => {
    const guess = assembled.join('').toUpperCase();
    const target = currentWord.word.toUpperCase();
    setAttempts(a => a + 1);
    if (guess === target) {
      setFeedback('correct');
      const pts = showHint ? 5 : 10;
      setScore(s => s + pts);
      setStreak(s => s + 1);
      playSound('correct', soundEnabled);
      const newXp = awardXP(10);
      onXpChange(newXp);
      setTimeout(loadNew, 1800);
    } else {
      setFeedback('wrong');
      setStreak(0);
      playSound('wrong', soundEnabled);
      setTimeout(() => setFeedback(null), 800);
    }
  };

  const handleSkip = () => { setShowDef(true); setTimeout(loadNew, 2500); };

  return (
    <div className="flex flex-col items-center gap-5 p-4 max-w-sm mx-auto">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-accent-gold font-serif mb-1">Word Scramble</h2>
        <p className="text-sm text-ink/60 dark:text-ink-dark/60">Unscramble the GRE word</p>
      </div>

      {/* Score bar */}
      <div className="flex gap-6 text-sm">
        <div className="text-center"><div className="text-2xl font-bold text-accent-gold">{score}</div><div className="text-ink/50 dark:text-ink-dark/50 text-xs">Score</div></div>
        <div className="text-center"><div className="text-2xl font-bold text-green-500">{streak}</div><div className="text-ink/50 dark:text-ink-dark/50 text-xs">Streak</div></div>
        <div className="text-center"><div className="text-2xl font-bold text-blue-500">{attempts}</div><div className="text-ink/50 dark:text-ink-dark/50 text-xs">Attempts</div></div>
      </div>

      {/* Word info */}
      <div className="text-center">
        <div className="text-xs text-ink/50 dark:text-ink-dark/50 mb-1">{currentWord.word.length} letters · {currentWord.pos} · {currentWord.category}</div>
        {showHint && <p className="text-xs text-accent-gold italic max-w-xs">{currentWord.definition}</p>}
        {showDef && <p className="text-sm text-green-600 font-medium">✓ {currentWord.word} — {currentWord.definition}</p>}
      </div>

      {/* Assembled word display */}
      <div className="flex gap-2 min-h-[48px] items-center flex-wrap justify-center">
        {currentWord.word.split('').map((_, i) => (
          <div
            key={i}
            onClick={() => assembled[i] && handleAssembledClick(i)}
            className={`w-10 h-10 border-b-2 flex items-center justify-center text-lg font-bold cursor-pointer transition-all
              ${assembled[i] ? 'border-accent-gold text-ink dark:text-ink-dark' : 'border-ink/20 dark:border-ink-dark/20'}
              ${feedback === 'correct' ? 'border-green-500 text-green-500' : ''}
              ${feedback === 'wrong' ? 'border-red-500 text-red-500 animate-shake' : ''}
            `}
          >
            {assembled[i] || ''}
          </div>
        ))}
      </div>

      {/* Scrambled letters */}
      <div className="flex gap-2 flex-wrap justify-center">
        {letters.map((l, i) => (
          <button
            key={i}
            onClick={() => handleLetterClick(i)}
            disabled={l.used}
            className={`w-10 h-10 rounded-lg text-lg font-bold font-mono transition-all
              ${l.used
                ? 'bg-ink/10 dark:bg-ink-dark/10 text-ink/20 dark:text-ink-dark/20 cursor-not-allowed'
                : 'bg-accent-gold/20 border border-accent-gold/50 text-ink dark:text-ink-dark hover:bg-accent-gold/40 cursor-pointer'
              }`}
          >
            {l.used ? '' : l.char}
          </button>
        ))}
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <button
          onClick={handleSubmit}
          disabled={assembled.length !== currentWord.word.length}
          className="px-5 py-2 bg-accent-gold text-white rounded-lg font-semibold text-sm disabled:opacity-40 hover:opacity-90 transition-all"
        >
          Submit
        </button>
        <button
          onClick={() => setShowHint(true)}
          className="px-4 py-2 border border-accent-gold/40 text-accent-gold rounded-lg text-sm hover:bg-accent-gold/10 transition-all"
        >
          Hint (-5pts)
        </button>
        <button
          onClick={handleSkip}
          className="px-4 py-2 border border-ink/20 dark:border-ink-dark/20 text-ink/50 dark:text-ink-dark/50 rounded-lg text-sm hover:bg-ink/5 transition-all"
        >
          Skip
        </button>
      </div>
    </div>
  );
}

// ─── SPEED BLITZ ───────────────────────────────────────────────────────────────

function SpeedBlitz({ onXpChange, soundEnabled }: { onXpChange: (xp: number) => void, soundEnabled: boolean }) {
  const TOTAL_TIME = 90;
  const [gameState, setGameState] = useState<'idle'|'playing'|'over'>('idle');
  const [timeLeft, setTimeLeft] = useState(TOTAL_TIME);
  const [score, setScore] = useState(0);
  const [current, setCurrent] = useState<typeof GRE_WORDS[0] | null>(null);
  const [choices, setChoices] = useState<string[]>([]);
  const [feedback, setFeedback] = useState<'correct'|'wrong'|null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<string|null>(null);
  const [combo, setCombo] = useState(0);
  const [totalAnswered, setTotalAnswered] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const pickQuestion = () => {
    const word = GRE_WORDS[Math.floor(Math.random() * GRE_WORDS.length)];
    const wrong = GRE_WORDS
      .filter(w => w.id !== word.id)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3)
      .map(w => w.word);
    const opts = [...wrong, word.word].sort(() => Math.random() - 0.5);
    setCurrent(word);
    setChoices(opts);
    setFeedback(null);
    setSelectedAnswer(null);
  };

  const startGame = () => {
    setGameState('playing');
    setScore(0); setTimeLeft(TOTAL_TIME); setCombo(0);
    setTotalAnswered(0); setCorrectCount(0);
    pickQuestion();
  };

  useEffect(() => {
    if (gameState !== 'playing') return;
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(timerRef.current!);
          setGameState('over');
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current!);
  }, [gameState]);

  const handleAnswer = (answer: string) => {
    if (feedback || !current) return;
    setSelectedAnswer(answer);
    setTotalAnswered(n => n + 1);
    const correct = answer === current.word;
    setFeedback(correct ? 'correct' : 'wrong');

    if (correct) {
      const pts = 10 + combo * 5; // combo bonus
      setScore(s => s + pts);
      setCombo(c => c + 1);
      setCorrectCount(n => n + 1);
      setTimeLeft(t => Math.min(t + 2, 120));
      playSound('correct', soundEnabled);
      const newXp = awardXP(2);
      onXpChange(newXp);
    } else {
      setCombo(0);
      setTimeLeft(t => Math.max(t - 3, 0));
      playSound('wrong', soundEnabled);
    }
    setTimeout(() => { if (gameState === 'playing') pickQuestion(); }, 500);
  };

  const accuracy = totalAnswered > 0 ? Math.round((correctCount / totalAnswered) * 100) : 0;
  const timerColor = timeLeft > 30 ? 'text-green-500' : timeLeft > 10 ? 'text-yellow-500' : 'text-red-500';
  const timerWidth = (timeLeft / TOTAL_TIME) * 100;
  const timerBarColor = timeLeft > 30 ? 'bg-green-500' : timeLeft > 10 ? 'bg-yellow-500' : 'bg-red-500';

  if (gameState === 'idle') return (
    <div className="flex flex-col items-center gap-6 p-6 text-center">
      <h2 className="text-2xl font-bold text-accent-gold font-serif">Speed Blitz ⚡</h2>
      <p className="text-ink/70 dark:text-ink-dark/70 max-w-xs">You have 90 seconds. Match definitions to GRE words as fast as you can. Correct = +2s, Wrong = -3s. Build combos for bonus points!</p>
      <div className="grid grid-cols-3 gap-4 text-center">
        {[['⏱️','90 sec','Start time'],['✅','+2s','Per correct'],['❌','-3s','Per wrong']].map(([icon,val,lbl]) => (
          <div key={lbl} className="bg-bg-primary rounded-xl p-3 border border-ink/5">
            <div className="text-2xl">{icon}</div>
            <div className="font-bold text-accent-gold">{val}</div>
            <div className="text-xs text-ink/50 dark:text-ink-dark/50">{lbl}</div>
          </div>
        ))}
      </div>
      <button onClick={startGame} className="px-8 py-3 bg-ink text-white rounded-sm font-sans font-bold text-xs uppercase tracking-[0.2em] hover:bg-ink/90 transition-all shadow-xl">
        Start Blitz!
      </button>
    </div>
  );

  if (gameState === 'over') return (
    <div className="flex flex-col items-center gap-5 p-6 text-center">
      <h2 className="text-2xl font-bold text-accent-gold font-serif">Time's Up! ⏱️</h2>
      <div className="grid grid-cols-2 gap-4 w-full max-w-xs">
        {[['Score', score, 'text-accent-gold'],['Accuracy', `${accuracy}%`, 'text-blue-500'],['Correct', correctCount, 'text-green-500'],['Answered', totalAnswered, 'text-ink dark:text-ink-dark']].map(([lbl,val,cls]) => (
          <div key={lbl as string} className="bg-bg-primary rounded-xl p-4 border border-ink/5">
            <div className={`text-3xl font-bold ${cls}`}>{val}</div>
            <div className="text-xs text-ink/50 dark:text-ink-dark/50 mt-1">{lbl}</div>
          </div>
        ))}
      </div>
      <div className="text-sm text-ink/60 dark:text-ink-dark/60">
        {score >= 200 ? '🏆 Exceptional! GRE master!' : score >= 100 ? '🌟 Great performance!' : score >= 50 ? '📚 Good effort, keep practicing!' : '💪 Keep studying those definitions!'}
      </div>
      <button onClick={startGame} className="px-8 py-3 bg-ink text-white rounded-sm font-sans font-bold text-xs uppercase tracking-[0.2em] hover:bg-ink/90 transition-all shadow-xl">
        Play Again
      </button>
    </div>
  );

  return (
    <div className="flex flex-col gap-4 p-4 max-w-sm mx-auto">
      {/* Timer bar */}
      <div className="flex items-center gap-3">
        <span className={`text-2xl font-mono font-bold w-12 ${timerColor}`}>{timeLeft}s</span>
        <div className="flex-1 h-3 bg-ink/10 dark:bg-ink-dark/10 rounded-full overflow-hidden">
          <div className={`h-full transition-all duration-1000 ${timerBarColor}`} style={{width:`${timerWidth}%`}} />
        </div>
        <span className="text-accent-gold font-bold w-16 text-right">{score}pts</span>
      </div>

      {combo >= 2 && (
        <div className="text-center text-sm font-bold text-orange-500 animate-pulse">🔥 {combo}x Combo!</div>
      )}

      {/* Definition card */}
      {current && (
        <div className="bg-bg-primary rounded-2xl p-5 border border-ink/5 shadow-lg min-h-[100px] flex flex-col items-center justify-center text-center gap-2">
          <div className="text-[10px] font-sans font-bold text-ink/30 uppercase tracking-[0.2em]">{current.pos} · {current.category}</div>
          <p className="text-ink font-serif text-lg font-bold leading-snug">{current.definition}</p>
          {current.example && <p className="text-xs text-ink/50 italic">"{current.example}"</p>}
        </div>
      )}

      {/* Answer choices */}
      <div className="grid grid-cols-2 gap-3">
        {choices.map(choice => {
          let btnClass = 'border border-ink/10 text-ink hover:bg-accent-gold/5 hover:border-accent-gold/20';
          if (selectedAnswer === choice) {
            btnClass = feedback === 'correct' ? 'bg-green-50 border-green-500 text-green-700' : 'bg-red-50 border-red-500 text-red-700';
          } else if (feedback === 'wrong' && choice === current?.word) {
            btnClass = 'bg-green-50 border-green-500/30 text-green-700';
          }
          return (
            <button
              key={choice}
              onClick={() => handleAnswer(choice)}
              className={`p-4 rounded-sm border font-serif font-bold text-sm transition-all ${btnClass}`}
            >
              {choice}
            </button>
          );
        })}
      </div>
    </div>
  );
}

const MindGames = ({ onXpChange }: { onXpChange: (xp: number) => void }) => {
  const [activeGame, setActiveGame] = useState<string | null>(null);
  const [gameState, setGameState] = useState<'start' | 'playing' | 'end'>('start');
  const [level, setLevel] = useState(1);
  const [score, setScore] = useState(0);
  const [number, setNumber] = useState('');
  const [userInput, setUserInput] = useState('');
  const [showNumber, setShowNumber] = useState(false);
  const soundEnabled = getStorage(STORAGE_KEYS.settings, { soundEnabled: true }).soundEnabled;

  const startNumberMemory = () => {
    setGameState('playing');
    nextLevelWith(1);
  };

  const nextLevelWith = (currentLevel: number) => {
    const digits = Math.max(1, currentLevel);
    const min = Math.pow(10, digits - 1);
    const max = Math.pow(10, digits) - 1;
    const newNumber = Math.floor(min + Math.random() * (max - min + 1)).toString();
    setNumber(newNumber);
    setShowNumber(true);
    setUserInput('');
    playSound('flip', soundEnabled);
    setTimeout(() => setShowNumber(false), 2000 + (currentLevel * 500));
  };

  const checkNumber = () => {
    if (userInput === number) {
      const newLevel = level + 1;
      setScore(score + (level * 100));
      setLevel(newLevel);
      playSound('correct', soundEnabled);
      const newXp = awardXP(level * 5);
      onXpChange(newXp);
      nextLevelWith(newLevel);
    } else {
      setGameState('end');
      playSound('wrong', soundEnabled);
    }
  };

  const renderGame = () => {
    switch (activeGame) {
      case 'chess':
        return <ChessGame />;
      case 'wordscramble':
        return <WordScramble onXpChange={onXpChange} soundEnabled={soundEnabled} />;
      case 'speedblitz':
        return <SpeedBlitz onXpChange={onXpChange} soundEnabled={soundEnabled} />;
      case 'number-memory':
        return (
          <div className="max-w-2xl mx-auto w-full text-center space-y-12">
            {gameState === 'start' && (
              <div className="space-y-8">
                <div className="w-20 h-20 bg-bg-primary rounded-sm border border-ink/5 flex items-center justify-center text-accent-gold mx-auto">
                  <Zap size={32} />
                </div>
                <div className="space-y-4">
                  <h2 className="text-5xl font-serif font-bold text-ink">Number Memory.</h2>
                  <p className="text-lg font-sans text-ink/60 max-w-md mx-auto">Remember the longest number you can. The sequence increases in complexity with each successful level.</p>
                </div>
                <button 
                  onClick={startNumberMemory}
                  className="px-12 py-6 bg-ink text-white rounded-sm font-sans font-bold text-xs uppercase tracking-[0.2em] hover:bg-ink/90 transition-all shadow-xl"
                >
                  Initiate Sequence
                </button>
              </div>
            )}
            {gameState === 'playing' && (
              <div className="space-y-12">
                <div className="flex items-center justify-between border-b border-ink/5 pb-8">
                  <div className="text-left">
                    <span className="text-[10px] font-sans font-bold text-ink/30 uppercase tracking-[0.2em]">Current Level</span>
                    <p className="text-2xl font-serif font-bold text-ink">{level.toString().padStart(2, '0')}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-sans font-bold text-ink/30 uppercase tracking-[0.2em]">Accumulated XP</span>
                    <p className="text-2xl font-serif font-bold text-accent-gold">{score.toLocaleString()}</p>
                  </div>
                </div>

                <div className="py-20">
                  {showNumber ? (
                    <motion.p 
                      key={number}
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="text-8xl font-serif font-bold text-ink tracking-tighter"
                    >
                      {number}
                    </motion.p>
                  ) : (
                    <div className="max-w-md mx-auto space-y-8">
                      <div className="space-y-2">
                        <span className="text-[10px] font-sans font-bold text-ink/30 uppercase tracking-[0.2em]">Enter Sequence</span>
                        <input 
                          type="text" 
                          value={userInput}
                          onChange={(e) => setUserInput(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && checkNumber()}
                          className="w-full p-6 bg-white border border-ink/10 rounded-sm text-center text-5xl font-serif font-bold text-ink focus:ring-1 focus:ring-accent-gold/20 transition-all"
                          autoFocus
                        />
                      </div>
                      <button 
                        onClick={checkNumber}
                        className="w-full py-6 bg-ink text-white rounded-sm font-sans font-bold text-xs uppercase tracking-[0.2em] hover:bg-ink/90 transition-all shadow-xl"
                      >
                        Validate Input
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
            {gameState === 'end' && (
              <div className="space-y-12 py-12">
                <div className="space-y-4">
                  <span className="text-[10px] font-sans font-bold text-red-500 uppercase tracking-[0.3em]">Sequence Terminated</span>
                  <h2 className="text-6xl font-serif font-bold text-ink leading-tight">Academic<br />Performance.</h2>
                </div>
                
                <div className="max-w-md mx-auto p-8 bg-red-50 rounded-sm border border-red-100 space-y-6">
                  <div className="space-y-2">
                    <span className="text-[10px] font-sans font-bold text-red-400 uppercase tracking-[0.2em]">Expected Sequence</span>
                    <p className="text-4xl font-serif font-bold text-red-900 tracking-tighter">{number}</p>
                  </div>
                  <div className="space-y-2">
                    <span className="text-[10px] font-sans font-bold text-red-400 uppercase tracking-[0.2em]">Your Input</span>
                    <p className="text-4xl font-serif font-bold text-red-900 tracking-tighter opacity-50">{userInput || 'No Input'}</p>
                  </div>
                  <p className="text-xs font-sans text-red-600 leading-relaxed">
                    The cognitive load exceeded your current working memory capacity at Level {level}. 
                    Regular practice can help expand this capacity.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-8 max-w-md mx-auto">
                  <div className="p-8 bg-bg-primary rounded-sm border border-ink/5 text-left">
                    <span className="text-[10px] font-sans font-bold text-ink/30 uppercase tracking-[0.2em]">Final Level</span>
                    <p className="text-3xl font-serif font-bold text-ink">{level}</p>
                  </div>
                  <div className="p-8 bg-bg-primary rounded-sm border border-ink/5 text-left">
                    <span className="text-[10px] font-sans font-bold text-ink/30 uppercase tracking-[0.2em]">Total Score</span>
                    <p className="text-3xl font-serif font-bold text-accent-gold">{score}</p>
                  </div>
                </div>

                <button 
                  onClick={() => { setGameState('start'); setLevel(1); setScore(0); setUserInput(''); }}
                  className="px-12 py-6 bg-ink text-white rounded-sm font-sans font-bold text-xs uppercase tracking-[0.2em] hover:bg-ink/90 transition-all shadow-xl"
                >
                  Restart Protocol
                </button>
              </div>
            )}
          </div>
        );
      default:
        return (
          <div className="space-y-16">
            <header className="max-w-3xl">
              <h1 className="text-7xl md:text-8xl font-serif font-bold text-ink leading-[0.9] mb-8">
                Cognitive<br />Acuity.
              </h1>
              <p className="text-xl font-sans text-ink/60 leading-relaxed max-w-2xl">
                Scientific exercises designed to enhance mnemonic retention, 
                processing speed, and logical deduction.
              </p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 border-t border-ink/5 pt-12">
              <button 
                onClick={() => { setActiveGame('number-memory'); setGameState('start'); }}
                className="group text-left space-y-6"
              >
                <div className="w-16 h-16 bg-bg-primary rounded-sm border border-ink/5 flex items-center justify-center text-accent-gold group-hover:bg-ink group-hover:text-white transition-all duration-500">
                  <Zap size={24} />
                </div>
                <div className="space-y-2">
                  <h3 className="text-3xl font-serif font-bold text-ink group-hover:text-accent-gold transition-colors">Number Memory</h3>
                  <p className="text-sm font-sans text-ink/60 leading-relaxed">Expand your working memory capacity through progressive digit recall sequences.</p>
                </div>
                <div className="flex items-center gap-2 text-[10px] font-sans font-bold text-ink/30 uppercase tracking-[0.2em] group-hover:text-ink transition-colors">
                  Initiate Protocol <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </button>

              <button 
                onClick={() => { setActiveGame('chess'); }}
                className="group text-left space-y-6"
              >
                <div className="w-16 h-16 bg-bg-primary rounded-sm border border-ink/5 flex items-center justify-center text-accent-gold group-hover:bg-ink group-hover:text-white transition-all duration-500">
                  <span className="text-2xl">♟️</span>
                </div>
                <div className="space-y-2">
                  <h3 className="text-3xl font-serif font-bold text-ink group-hover:text-accent-gold transition-colors">Chess</h3>
                  <p className="text-sm font-sans text-ink/60 leading-relaxed">Play chess against an AI opponent. Sharpen your strategic thinking — a core GRE skill.</p>
                </div>
                <div className="flex items-center gap-2 text-[10px] font-sans font-bold text-ink/30 uppercase tracking-[0.2em] group-hover:text-ink transition-colors">
                  Initiate Protocol <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </button>

              <button 
                onClick={() => { setActiveGame('wordscramble'); }}
                className="group text-left space-y-6"
              >
                <div className="w-16 h-16 bg-bg-primary rounded-sm border border-ink/5 flex items-center justify-center text-accent-gold group-hover:bg-ink group-hover:text-white transition-all duration-500">
                  <span className="text-2xl">🔤</span>
                </div>
                <div className="space-y-2">
                  <h3 className="text-3xl font-serif font-bold text-ink group-hover:text-accent-gold transition-colors">Word Scramble</h3>
                  <p className="text-sm font-sans text-ink/60 leading-relaxed">Unscramble GRE vocabulary words against the clock. Tests spelling and word recognition.</p>
                </div>
                <div className="flex items-center gap-2 text-[10px] font-sans font-bold text-ink/30 uppercase tracking-[0.2em] group-hover:text-ink transition-colors">
                  Initiate Protocol <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </button>

              <button 
                onClick={() => { setActiveGame('speedblitz'); }}
                className="group text-left space-y-6"
              >
                <div className="w-16 h-16 bg-bg-primary rounded-sm border border-ink/5 flex items-center justify-center text-accent-gold group-hover:bg-ink group-hover:text-white transition-all duration-500">
                  <span className="text-2xl">⚡</span>
                </div>
                <div className="space-y-2">
                  <h3 className="text-3xl font-serif font-bold text-ink group-hover:text-accent-gold transition-colors">Speed Blitz</h3>
                  <p className="text-sm font-sans text-ink/60 leading-relaxed">90 seconds. Match definitions to words as fast as possible. Build combos for bonus points!</p>
                </div>
                <div className="flex items-center gap-2 text-[10px] font-sans font-bold text-ink/30 uppercase tracking-[0.2em] group-hover:text-ink transition-colors">
                  Initiate Protocol <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </button>

              <div className="group text-left space-y-6 opacity-40 grayscale">
                <div className="w-16 h-16 bg-bg-primary rounded-sm border border-ink/5 flex items-center justify-center text-ink/20">
                  <Gamepad2 size={24} />
                </div>
                <div className="space-y-2">
                  <h3 className="text-3xl font-serif font-bold text-ink">Visual Recall</h3>
                  <p className="text-sm font-sans text-ink/60 leading-relaxed">Enhance spatial awareness and pattern recognition. Coming soon to the repository.</p>
                </div>
                <div className="flex items-center gap-2 text-[10px] font-sans font-bold text-ink/10 uppercase tracking-[0.2em]">
                  Locked Content
                </div>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="space-y-12">
      {activeGame && (
        <button 
          onClick={() => setActiveGame(null)}
          className="group flex items-center gap-3 text-[10px] font-sans font-bold text-ink/30 uppercase tracking-[0.2em] hover:text-ink transition-colors"
        >
          <X size={14} /> Terminate Protocol
        </button>
      )}

      <div className="min-h-[500px] flex flex-col">
        {renderGame()}
      </div>
    </div>
  );
};

const Verbal = ({ onXpChange }: { onXpChange: (xp: number) => void }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<string[]>([]);
  const [blankSelections, setBlankSelections] = useState<string[]>([]);
  const [rcAnswers, setRcAnswers] = useState<{[key: number]: string}>({});
  const [showExplanation, setShowExplanation] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [timer, setTimer] = useState(0);
  const [isTimerActive, setIsTimerActive] = useState(true);
  const [sessionCorrect, setSessionCorrect] = useState(0);
  const [sessionTotal, setSessionTotal] = useState(0);
  const sessionCorrectRef = useRef(0);
  const sessionTotalRef = useRef(0);

  useEffect(() => {
    return () => {
      if (sessionTotalRef.current > 0) {
        recordQuizResult('Verbal', sessionCorrectRef.current, sessionTotalRef.current);
      }
    };
  }, []);

  const soundEnabled = getStorage(STORAGE_KEYS.settings, { soundEnabled: true }).soundEnabled;

  useEffect(() => {
    const entryTime = Date.now();
    return () => {
      const elapsed = Math.floor((Date.now() - entryTime) / 1000);
      const current = getStorage(STORAGE_KEYS.studyTime, 0);
      setStorage(STORAGE_KEYS.studyTime, current + elapsed);
    };
  }, []);

  const currentQuestion = GRE_VERBAL[currentIndex];

  useEffect(() => {
    let interval: any;
    if (isTimerActive) {
      interval = setInterval(() => setTimer((t) => t + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerActive]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAnswer = (ans: string) => {
    if (showExplanation) return;
    
    let newAnswers = [...selectedAnswers];
    if (currentQuestion.type === 'SE') {
      if (newAnswers.includes(ans)) {
        newAnswers = newAnswers.filter(a => a !== ans);
      } else if (newAnswers.length < 2) {
        newAnswers.push(ans);
      }
      setSelectedAnswers(newAnswers);
    } else {
      setSelectedAnswers([ans]);
      const correct = currentQuestion.answers?.includes(ans) || false;
      setIsCorrect(correct);
      setShowExplanation(true);
      setIsTimerActive(false);
      setSessionTotal(t => {
        const next = t + 1;
        sessionTotalRef.current = next;
        return next;
      });
      
      if (correct) {
        playSound('correct', soundEnabled);
        fireConfetti();
        setSessionCorrect(c => {
          const next = c + 1;
          sessionCorrectRef.current = next;
          return next;
        });
        const newXp = awardXP(XP_REWARDS.correctVerbal);
        onXpChange(newXp);
      } else {
        playSound('wrong', soundEnabled);
      }
    }
  };

  const handleRCAnswer = (questionIndex: number, opt: string) => {
    if (rcAnswers[questionIndex] !== undefined || showExplanation) return;
    const newAnswers = { ...rcAnswers, [questionIndex]: opt };
    setRcAnswers(newAnswers);
    
    const correct = opt === currentQuestion.questions?.[questionIndex].answer;
    setIsCorrect(correct);
    setSessionTotal(t => {
      const next = t + 1;
      sessionTotalRef.current = next;
      return next;
    });
    if (correct) {
      playSound('correct', soundEnabled);
      setSessionCorrect(c => {
        const next = c + 1;
        sessionCorrectRef.current = next;
        return next;
      });
      const newXp = awardXP(XP_REWARDS.correctVerbal);
      onXpChange(newXp);
    } else {
      playSound('wrong', soundEnabled);
    }

    if (currentQuestion.questions && Object.keys(newAnswers).length === currentQuestion.questions.length) {
      setTimeout(() => {
        setShowExplanation(true);
        setIsTimerActive(false);
        
        // Perfect quiz bonus for RC passage
        const allCorrect = currentQuestion.questions?.every((q, idx) => newAnswers[idx] === q.answer);
        if (allCorrect) {
          const newXp = awardXP(XP_REWARDS.perfectQuiz);
          onXpChange(newXp);
          fireConfetti();
          playSound('xp', soundEnabled);
        }
      }, 400);
    }
  };

  const selectBlankOption = (blankIndex: number, value: string) => {
    if (showExplanation) return;
    const newSelections = [...blankSelections];
    newSelections[blankIndex] = value;
    setBlankSelections(newSelections);
    playSound('flip', soundEnabled);
  };

  const submitTC = () => {
    if (blankSelections.length !== currentQuestion.blanks || !blankSelections.every(s => s)) return;
    const correct = blankSelections.every((ans, idx) => currentQuestion.answers?.[idx] === ans);
    setIsCorrect(correct);
    setShowExplanation(true);
    setIsTimerActive(false);
    setSessionTotal(t => {
      const next = t + 1;
      sessionTotalRef.current = next;
      return next;
    });
    
    if (correct) {
      playSound('correct', soundEnabled);
      fireConfetti();
      setSessionCorrect(c => {
        const next = c + 1;
        sessionCorrectRef.current = next;
        return next;
      });
      const newXp = awardXP(XP_REWARDS.correctVerbal);
      onXpChange(newXp);
    } else {
      playSound('wrong', soundEnabled);
    }
  };

  const submitSE = () => {
    if (selectedAnswers.length !== 2) return;
    const correct = selectedAnswers.every(ans => currentQuestion.answers?.includes(ans));
    setIsCorrect(correct);
    setShowExplanation(true);
    setIsTimerActive(false);
    setSessionTotal(t => {
      const next = t + 1;
      sessionTotalRef.current = next;
      return next;
    });
    
    if (correct) {
      playSound('correct', soundEnabled);
      fireConfetti();
      setSessionCorrect(c => {
        const next = c + 1;
        sessionCorrectRef.current = next;
        return next;
      });
      const newXp = awardXP(XP_REWARDS.correctVerbal);
      onXpChange(newXp);
    } else {
      playSound('wrong', soundEnabled);
    }
  };

  const nextQuestion = () => {
    if (sessionTotalRef.current > 0 && sessionTotalRef.current % 5 === 0) {
      const c = sessionCorrectRef.current;
      const t = sessionTotalRef.current;
      
      // Reset refs BEFORE recording to avoid race condition
      sessionCorrectRef.current = 0;
      sessionTotalRef.current = 0;
      setSessionCorrect(0);
      setSessionTotal(0);
      
      recordQuizResult('Verbal', c, t);
      playSound('xp', soundEnabled);
    }

    setCurrentIndex((prev) => (prev + 1) % GRE_VERBAL.length);
    setSelectedAnswers([]);
    setBlankSelections([]);
    setRcAnswers({});
    setShowExplanation(false);
    setIsCorrect(null);
    setTimer(0);
    // Use a slight delay or ensure state update is clean
    setTimeout(() => setIsTimerActive(true), 0);
    playSound('flip', soundEnabled);
  };

  return (
    <div className="space-y-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-ink/5 pb-12">
        <div className="space-y-4">
          <span className="text-[10px] font-sans font-bold text-accent-gold uppercase tracking-[0.3em]">Verbal Reasoning</span>
          <h1 className="text-6xl font-serif font-bold text-ink">
            {currentQuestion.type === 'TC' ? 'Text Completion.' : currentQuestion.type === 'SE' ? 'Sentence Equivalence.' : 'Reading Comprehension.'}
          </h1>
        </div>
        <div className="flex items-center gap-8">
          <div className="text-right">
            <span className="text-[10px] font-sans font-bold text-ink/30 uppercase tracking-[0.2em]">Time Elapsed</span>
            <p className="text-2xl font-serif font-bold text-ink">{formatTime(timer)}</p>
          </div>
          <div className="text-right">
            <span className="text-[10px] font-sans font-bold text-ink/30 uppercase tracking-[0.2em]">Progress</span>
            <p className="text-2xl font-serif font-bold text-ink">{currentIndex + 1} / {GRE_VERBAL.length}</p>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
        <div className="lg:col-span-8 space-y-12">
          {currentQuestion.type === 'RC' ? (
            <div className="space-y-12">
              <div className="p-12 bg-white rounded-sm border border-ink/5 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-accent-gold" />
                <h4 className="text-[10px] font-sans font-bold text-ink/30 uppercase tracking-[0.2em] mb-8">Scholarly Passage</h4>
                <div className="prose prose-ink max-w-none">
                  <p className="text-xl font-serif text-ink leading-relaxed italic">
                    {currentQuestion.passage}
                  </p>
                </div>
              </div>

              <div className="space-y-12">
                {currentQuestion.questions?.map((q, qIdx) => (
                  <div key={qIdx} className="space-y-8">
                    <h3 className="text-3xl font-serif font-bold text-ink leading-tight">{q.q}</h3>
                    <div className="grid grid-cols-1 gap-4">
                      {q.options.map((opt, oIdx) => {
                        const isSelected = rcAnswers[qIdx] === opt;
                        const hasAnswered = rcAnswers[qIdx] !== undefined;
                        const isCorrect = opt === q.answer;
                        
                        let buttonClass = 'bg-white border-ink/5 hover:border-ink/20 text-ink/60';
                        if (hasAnswered) {
                          if (isSelected && isCorrect) buttonClass = 'bg-ink text-white border-ink';
                          else if (isSelected && !isCorrect) buttonClass = 'bg-red-50 border-red-200 text-red-900';
                          else if (isCorrect) buttonClass = 'bg-teal-50 border-teal-200 text-teal-900';
                        }

                        return (
                          <button
                            key={oIdx}
                            onClick={() => handleRCAnswer(qIdx, opt)}
                            className={`group flex items-center gap-6 p-6 rounded-sm border transition-all text-left ${buttonClass}`}
                          >
                            <span className={`
                              w-10 h-10 rounded-full flex items-center justify-center text-[10px] font-sans font-bold uppercase tracking-widest transition-colors
                              ${isSelected ? 'bg-white/20 text-white' : 'bg-bg-primary text-ink/30 group-hover:bg-ink group-hover:text-white'}
                            `}>
                              {String.fromCharCode(65 + oIdx)}
                            </span>
                            <span className="text-lg font-sans font-medium">{opt}</span>
                          </button>
                        );
                      })}
                    </div>
                    {rcAnswers[qIdx] !== undefined && (
                      <div className="p-6 bg-bg-primary rounded-sm border-l-4 border-l-accent-gold space-y-2 mt-4">
                        <span className="text-[10px] font-sans font-bold text-accent-gold uppercase tracking-[0.2em]">
                          {rcAnswers[qIdx] === q.answer ? '✓ Correct' : '✗ Incorrect'}
                        </span>
                        <p className="text-sm font-sans text-ink/60 leading-relaxed italic">{q.explanation}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-12">
              <div className="p-12 bg-white rounded-sm border border-ink/5 shadow-sm relative">
                <div className="absolute top-0 left-0 w-1 h-full bg-accent-gold" />
                <h4 className="text-[10px] font-sans font-bold text-ink/30 uppercase tracking-[0.2em] mb-8">Contextual Sentence</h4>
                <p className="text-3xl font-serif font-bold text-ink leading-relaxed">
                  {currentQuestion.sentence}
                </p>
              </div>

              {currentQuestion.type === 'TC' && Array.isArray(currentQuestion.options?.[0]) ? (
                <div className="space-y-12">
                  {(currentQuestion.options as string[][]).map((blankOptions, blankIndex) => (
                    <div key={blankIndex} className="space-y-4">
                      <h4 className="text-[10px] font-sans font-bold text-ink/30 uppercase tracking-[0.2em]">
                        Blank {blankIndex + 1}
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {blankOptions.map((opt, optIdx) => (
                          <button
                            key={optIdx}
                            onClick={() => selectBlankOption(blankIndex, opt)}
                            className={`p-4 rounded-sm border text-left text-sm font-sans transition-all
                              ${showExplanation && currentQuestion.answers?.[blankIndex] === opt
                                ? 'bg-ink text-white border-ink'
                                : blankSelections[blankIndex] === opt && showExplanation && currentQuestion.answers?.[blankIndex] !== opt
                                ? 'bg-red-50 border-red-200 text-red-900'
                                : blankSelections[blankIndex] === opt && !showExplanation
                                ? 'bg-ink text-white border-ink'
                                : 'bg-white border-ink/5 hover:border-ink/20 text-ink/60'}`}
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                  {blankSelections.length === currentQuestion.blanks && blankSelections.every(s => s) && !showExplanation && (
                    <button 
                      onClick={submitTC}
                      className="w-full py-6 bg-ink text-white rounded-sm font-sans font-bold text-xs uppercase tracking-[0.2em] hover:bg-ink/90 transition-all shadow-xl"
                    >
                      Submit Answer
                    </button>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {Array.isArray(currentQuestion.options) && (currentQuestion.options as string[]).map((opt, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleAnswer(opt)}
                      className={`
                        group flex items-center gap-6 p-6 rounded-sm border transition-all text-left
                        ${showExplanation && currentQuestion.answers?.includes(opt)
                          ? 'bg-ink text-white border-ink'
                          : selectedAnswers.includes(opt) && !currentQuestion.answers?.includes(opt)
                          ? 'bg-red-50 border-red-200 text-red-900'
                          : 'bg-white border-ink/5 hover:border-ink/20 text-ink/60'}
                      `}
                    >
                      <span className={`
                        w-10 h-10 rounded-full flex items-center justify-center text-[10px] font-sans font-bold uppercase tracking-widest transition-colors
                        ${(showExplanation && currentQuestion.answers?.includes(opt)) || selectedAnswers.includes(opt) ? 'bg-white/20 text-white' : 'bg-bg-primary text-ink/30 group-hover:bg-ink group-hover:text-white'}
                      `}>
                        {String.fromCharCode(65 + idx)}
                      </span>
                      <span className="text-lg font-sans font-medium">{opt}</span>
                    </button>
                  ))}
                </div>
              )}

              {currentQuestion.type === 'SE' && !showExplanation && (
                <button 
                  onClick={submitSE}
                  disabled={selectedAnswers.length !== 2}
                  className="w-full py-6 bg-ink text-white rounded-sm font-sans font-bold text-xs uppercase tracking-[0.2em] hover:bg-ink/90 transition-all shadow-xl disabled:opacity-20"
                >
                  Validate Dual Selection
                </button>
              )}
            </div>
          )}
        </div>

        <aside className="lg:col-span-4 space-y-12">
          <AnimatePresence mode="wait">
            {showExplanation ? (
              <motion.div 
                key="explanation"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <div className="p-8 bg-white rounded-sm border border-ink/5 shadow-sm space-y-6">
                  <div className={`flex items-center gap-3 ${isCorrect ? 'text-teal-500' : 'text-red-500'}`}>
                    {isCorrect ? <CheckCircle2 size={20} /> : <X size={20} />}
                    <h3 className="text-[10px] font-sans font-bold uppercase tracking-[0.2em]">
                      {isCorrect ? 'Correct Analysis' : 'Incorrect Analysis'}
                    </h3>
                  </div>
                  
                  <div className="space-y-4">
                    <p className="text-lg font-sans text-ink/60 leading-relaxed italic">
                      {currentQuestion.explanation}
                    </p>

                    {currentQuestion.type === 'RC' && currentQuestion.questions && (
                      <div className="pt-4 border-t border-ink/5 space-y-6">
                        <h4 className="text-[10px] font-sans font-bold text-ink/30 uppercase tracking-[0.2em]">Question Breakdown</h4>
                        <div className="space-y-6">
                          {currentQuestion.questions.map((q, idx) => (
                            <div key={idx} className="space-y-3">
                              <p className="text-xs font-sans font-bold text-ink">{q.q}</p>
                              <div className="p-4 bg-bg-primary rounded-sm border border-ink/5">
                                <p className="text-sm font-sans font-bold text-accent-gold mb-1">{q.answer}</p>
                                <p className="text-xs font-sans text-ink/60 leading-relaxed italic">
                                  {q.explanation}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {currentQuestion.answers && (
                      <div className="pt-4 border-t border-ink/5 space-y-4">
                        <h4 className="text-[10px] font-sans font-bold text-ink/30 uppercase tracking-[0.2em]">Correct Solution</h4>
                        <div className="space-y-3">
                          {currentQuestion.answers.map((ans, idx) => {
                            const wordData = GRE_WORDS.find(w => w.word.toLowerCase() === ans.toLowerCase());
                            return (
                              <div key={idx} className="p-4 bg-bg-primary rounded-sm border border-ink/5">
                                <p className="text-sm font-sans font-bold text-ink mb-1">{ans}</p>
                                {wordData && (
                                  <p className="text-xs font-sans text-ink/60 leading-relaxed">
                                    <span className="font-bold text-accent-gold">Definition:</span> {wordData.definition}
                                  </p>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <button 
                  onClick={nextQuestion}
                  className="w-full py-6 bg-accent-gold text-white rounded-sm font-sans font-bold text-xs uppercase tracking-[0.2em] hover:bg-accent-gold/90 transition-all shadow-xl flex items-center justify-center gap-3"
                >
                  Next Challenge <ArrowRight size={14} />
                </button>
              </motion.div>
            ) : (
              <motion.div 
                key="tips"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="p-8 bg-bg-primary rounded-sm border border-ink/5 space-y-8"
              >
                <h3 className="text-[10px] font-sans font-bold text-ink/30 uppercase tracking-[0.2em]">Verbal Strategies</h3>
                <ul className="space-y-6">
                  <li className="space-y-2">
                    <span className="text-[10px] font-sans font-bold text-accent-gold uppercase tracking-widest">Contextual Clues</span>
                    <p className="text-sm font-sans text-ink/60 leading-relaxed">Look for transition words like 'however', 'moreover', or 'despite' to determine the sentence's logical direction.</p>
                  </li>
                  <li className="space-y-2">
                    <span className="text-[10px] font-sans font-bold text-accent-gold uppercase tracking-widest">Elimination</span>
                    <p className="text-sm font-sans text-ink/60 leading-relaxed">Systematically remove options that are grammatically incorrect or logically inconsistent with the passage.</p>
                  </li>
                </ul>
              </motion.div>
            )}
          </AnimatePresence>
        </aside>
      </div>
    </div>
  );
};

const Quantitative = ({ onXpChange }: { onXpChange: (xp: number) => void }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [timer, setTimer] = useState(0);
  const [isTimerActive, setIsTimerActive] = useState(true);
  const [showCalculator, setShowCalculator] = useState(false);
  const [calcValue, setCalcValue] = useState('0');
  const [neInput, setNeInput] = useState('');
  const [sessionCorrect, setSessionCorrect] = useState(0);
  const [sessionTotal, setSessionTotal] = useState(0);
  const sessionCorrectRef = useRef(0);
  const sessionTotalRef = useRef(0);

  useEffect(() => {
    return () => {
      if (sessionTotalRef.current > 0) {
        recordQuizResult('Quantitative', sessionCorrectRef.current, sessionTotalRef.current);
      }
    };
  }, []);

  const soundEnabled = getStorage(STORAGE_KEYS.settings, { soundEnabled: true }).soundEnabled;

  useEffect(() => {
    const entryTime = Date.now();
    return () => {
      const elapsed = Math.floor((Date.now() - entryTime) / 1000);
      const current = getStorage(STORAGE_KEYS.studyTime, 0);
      setStorage(STORAGE_KEYS.studyTime, current + elapsed);
    };
  }, []);

  const currentQuestion = GRE_QUANT[currentIndex];

  useEffect(() => {
    let interval: any;
    if (isTimerActive) {
      interval = setInterval(() => setTimer((t) => t + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerActive]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAnswer = (ans: string) => {
    if (showExplanation) return;
    setSelectedAnswer(ans);
    const correct = ans.trim() === currentQuestion.answer.trim();
    setIsCorrect(correct);
    setShowExplanation(true);
    setIsTimerActive(false);
    setSessionTotal(t => {
      const next = t + 1;
      sessionTotalRef.current = next;
      return next;
    });

    if (correct) {
      playSound('correct', soundEnabled);
      fireConfetti();
      setSessionCorrect(c => {
        const next = c + 1;
        sessionCorrectRef.current = next;
        return next;
      });
      
      // Update quant_correct storage for accolade
      const quantCorrect = getStorage('grenius_quant_correct', 0) as number;
      setStorage('grenius_quant_correct', quantCorrect + 1);
      
      const newXp = awardXP(XP_REWARDS.correctQuant);
      onXpChange(newXp);
    } else {
      playSound('wrong', soundEnabled);
    }
  };

  const nextQuestion = () => {
    if (sessionTotalRef.current > 0 && sessionTotalRef.current % 5 === 0) {
      const c = sessionCorrectRef.current;
      const t = sessionTotalRef.current;
      
      // Reset refs BEFORE recording to avoid race condition
      sessionCorrectRef.current = 0;
      sessionTotalRef.current = 0;
      setSessionCorrect(0);
      setSessionTotal(0);
      
      recordQuizResult('Quantitative', c, t);
      playSound('xp', soundEnabled);
    }

    setCurrentIndex((prev) => (prev + 1) % GRE_QUANT.length);
    setSelectedAnswer(null);
    setShowExplanation(false);
    setIsCorrect(null);
    setTimer(0);
    setTimeout(() => setIsTimerActive(true), 0);
    setNeInput('');
    playSound('flip', soundEnabled);
  };

  const handleCalc = (val: string) => {
    if (val === 'C') {
      setCalcValue('0');
    } else if (val === '=') {
      try {
        // Use Function constructor to safely evaluate math expression
        // Only allow numbers, basic operators, and decimal point
        const sanitized = calcValue.replace(/[^0-9+\-*/().]/g, '');
        // Use a more restricted evaluation if possible, but sanitized regex helps
        const result = new Function('"use strict"; return (' + sanitized + ')')();
        setCalcValue(String(parseFloat(result.toFixed(8))));
      } catch {
        setCalcValue('Error');
      }
    } else if (val === '⌫') {
      setCalcValue(calcValue.length > 1 ? calcValue.slice(0, -1) : '0');
    } else {
      setCalcValue(calcValue === '0' || calcValue === 'Error' ? val : calcValue + val);
    }
    playSound('flip', soundEnabled);
  };

  return (
    <div className="space-y-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-ink/5 pb-12">
        <div className="space-y-4">
          <span className="text-[10px] font-sans font-bold text-accent-gold uppercase tracking-[0.3em]">Quantitative Reasoning</span>
          <h1 className="text-6xl font-serif font-bold text-ink">
            Mathematical Analysis.
          </h1>
        </div>
        <div className="flex items-center gap-8">
          <div className="text-right">
            <span className="text-[10px] font-sans font-bold text-ink/30 uppercase tracking-[0.2em]">Time Elapsed</span>
            <p className="text-2xl font-serif font-bold text-ink">{formatTime(timer)}</p>
          </div>
          <button 
            onClick={() => setShowCalculator(!showCalculator)}
            className={`w-12 h-12 rounded-sm border flex items-center justify-center transition-all ${showCalculator ? 'bg-ink text-white border-ink' : 'bg-white text-ink/40 border-ink/5 hover:border-ink/20'}`}
          >
            <Calculator size={20} />
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
        <div className="lg:col-span-8 space-y-12">
          <div className="p-12 bg-white rounded-sm border border-ink/5 shadow-sm relative">
            <div className="absolute top-0 left-0 w-1 h-full bg-accent-gold" />
            <div className="flex items-center justify-between mb-12">
              <span className="text-[10px] font-sans font-bold text-accent-gold uppercase tracking-[0.2em]">
                Problem {currentIndex + 1} of {GRE_QUANT.length}
              </span>
              <span className="text-[10px] font-sans font-bold text-ink/30 uppercase tracking-[0.2em]">
                Topic: {currentQuestion.topic}
              </span>
            </div>

            {currentQuestion.type === 'QC' && (
              <div className="space-y-12">
                <div className="grid grid-cols-2 gap-12">
                  <div className="space-y-4">
                    <h4 className="text-[10px] font-sans font-bold text-ink/30 uppercase tracking-[0.2em]">Quantity A</h4>
                    <p className="text-3xl font-serif font-bold text-ink">{currentQuestion.colA}</p>
                  </div>
                  <div className="space-y-4">
                    <h4 className="text-[10px] font-sans font-bold text-ink/30 uppercase tracking-[0.2em]">Quantity B</h4>
                    <p className="text-3xl font-serif font-bold text-ink">{currentQuestion.colB}</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-8 border-t border-ink/5">
                  {['A', 'B', 'C', 'D'].map((opt) => (
                    <button
                      key={opt}
                      onClick={() => handleAnswer(opt)}
                      className={`
                        group flex items-center gap-6 p-6 rounded-sm border transition-all text-left
                        ${showExplanation && opt === currentQuestion.answer
                          ? 'bg-ink text-white border-ink'
                          : selectedAnswer === opt && opt !== currentQuestion.answer
                          ? 'bg-red-50 border-red-200 text-red-900'
                          : 'bg-white border-ink/5 hover:border-ink/20 text-ink/60'}
                      `}
                    >
                      <span className={`
                        w-10 h-10 rounded-full flex items-center justify-center text-[10px] font-sans font-bold uppercase tracking-widest transition-colors
                        ${(showExplanation && opt === currentQuestion.answer) || selectedAnswer === opt ? 'bg-white/20 text-white' : 'bg-bg-primary text-ink/30 group-hover:bg-ink group-hover:text-white'}
                      `}>
                        {opt}
                      </span>
                      <span className="text-sm font-sans font-medium">
                        {opt === 'A' && 'Quantity A is greater'}
                        {opt === 'B' && 'Quantity B is greater'}
                        {opt === 'C' && 'The two quantities are equal'}
                        {opt === 'D' && 'The relationship cannot be determined'}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {currentQuestion.type === 'MC' && (
              <div className="space-y-12">
                <p className="text-3xl font-serif font-bold text-ink leading-relaxed">{currentQuestion.question}</p>
                <div className="grid grid-cols-1 gap-4">
                  {currentQuestion.options?.map((opt, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleAnswer(opt)}
                      className={`
                        group flex items-center gap-6 p-6 rounded-sm border transition-all text-left
                        ${showExplanation && opt === currentQuestion.answer
                          ? 'bg-ink text-white border-ink'
                          : selectedAnswer === opt && opt !== currentQuestion.answer
                          ? 'bg-red-50 border-red-200 text-red-900'
                          : 'bg-white border-ink/5 hover:border-ink/20 text-ink/60'}
                      `}
                    >
                      <span className={`
                        w-10 h-10 rounded-full flex items-center justify-center text-[10px] font-sans font-bold uppercase tracking-widest transition-colors
                        ${(showExplanation && opt === currentQuestion.answer) || selectedAnswer === opt ? 'bg-white/20 text-white' : 'bg-bg-primary text-ink/30 group-hover:bg-ink group-hover:text-white'}
                      `}>
                        {String.fromCharCode(65 + idx)}
                      </span>
                      <span className="text-lg font-sans font-medium">{opt}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {currentQuestion.type === 'NE' && (
              <div className="space-y-12">
                <p className="text-3xl font-serif font-bold text-ink leading-relaxed">{currentQuestion.question}</p>
                <div className="flex items-center gap-6">
                  <div className="flex-1 space-y-2">
                    <span className="text-[10px] font-sans font-bold text-ink/30 uppercase tracking-[0.2em]">Numeric Entry</span>
                    <input 
                      type="text" 
                      value={neInput}
                      onChange={(e) => setNeInput(e.target.value)}
                      placeholder="ENTER VALUE..."
                      className="w-full p-6 bg-bg-primary border border-ink/5 rounded-sm font-serif font-bold text-3xl text-ink focus:ring-1 focus:ring-accent-gold/20 transition-all placeholder:text-ink/10"
                      onKeyDown={(e) => e.key === 'Enter' && handleAnswer(neInput.trim())}
                    />
                  </div>
                  <button 
                    onClick={() => handleAnswer(neInput.trim())}
                    disabled={!neInput.trim()}
                    className="mt-6 px-12 py-6 bg-ink text-white rounded-sm font-sans font-bold text-xs uppercase tracking-[0.2em] hover:bg-ink/90 transition-all shadow-xl disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    Validate
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        <aside className="lg:col-span-4 space-y-12">
          {showCalculator && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-ink p-8 rounded-sm shadow-2xl space-y-6"
            >
              <div className="bg-white/5 p-6 rounded-sm text-right">
                <p className="text-3xl font-mono font-bold text-white truncate">{calcValue}</p>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {['7', '8', '9', '/', '4', '5', '6', '*', '1', '2', '3', '-', '0', '.', '⌫', '+'].map((btn) => (
                  <button
                    key={btn}
                    onClick={() => handleCalc(btn)}
                    className="h-12 bg-white/5 hover:bg-white/10 text-white rounded-sm font-mono font-bold transition-colors"
                  >
                    {btn}
                  </button>
                ))}
                <button 
                  onClick={() => handleCalc('C')}
                  className="col-span-2 h-12 bg-red-500/20 hover:bg-red-500/30 text-red-500 rounded-sm font-mono font-bold transition-colors"
                >
                  C
                </button>
                <button 
                  onClick={() => handleCalc('=')}
                  className="col-span-2 h-12 bg-accent-gold hover:bg-accent-gold/90 text-white rounded-sm font-mono font-bold transition-colors"
                >
                  =
                </button>
              </div>
            </motion.div>
          )}

          <AnimatePresence mode="wait">
            {showExplanation ? (
              <motion.div 
                key="explanation"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <div className="p-8 bg-white rounded-sm border border-ink/5 shadow-sm space-y-6">
                  <div className={`flex items-center gap-3 ${isCorrect ? 'text-teal-500' : 'text-red-500'}`}>
                    {isCorrect ? <CheckCircle2 size={20} /> : <X size={20} />}
                    <h3 className="text-[10px] font-sans font-bold uppercase tracking-[0.2em]">
                      {isCorrect ? 'Mathematical Proof' : 'Error Analysis'}
                    </h3>
                  </div>
                  <div className="space-y-4">
                    <div className="p-4 bg-bg-primary rounded-sm border border-ink/5">
                      <p className="text-[10px] font-sans font-bold text-ink/30 uppercase tracking-[0.2em] mb-2">Correct Answer</p>
                      <p className="text-2xl font-serif font-bold text-accent-gold">{currentQuestion.answer}</p>
                    </div>
                    <p className="text-lg font-sans text-ink/60 leading-relaxed italic">
                      {currentQuestion.explanation}
                    </p>
                  </div>
                </div>
                <button 
                  onClick={nextQuestion}
                  className="w-full py-6 bg-accent-gold text-white rounded-sm font-sans font-bold text-xs uppercase tracking-[0.2em] hover:bg-accent-gold/90 transition-all shadow-xl flex items-center justify-center gap-3"
                >
                  Next Challenge <ArrowRight size={14} />
                </button>
              </motion.div>
            ) : (
              <motion.div 
                key="tips"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="p-8 bg-bg-primary rounded-sm border border-ink/5 space-y-8"
              >
                <h3 className="text-[10px] font-sans font-bold text-ink/30 uppercase tracking-[0.2em]">Quant Strategies</h3>
                <ul className="space-y-6">
                  <li className="space-y-2">
                    <span className="text-[10px] font-sans font-bold text-accent-gold uppercase tracking-widest">QC Comparison</span>
                    <p className="text-sm font-sans text-ink/60 leading-relaxed">In Quantitative Comparison, always test extreme values: zero, one, negative numbers, and fractions.</p>
                  </li>
                  <li className="space-y-2">
                    <span className="text-[10px] font-sans font-bold text-accent-gold uppercase tracking-widest">Data Interpretation</span>
                    <p className="text-sm font-sans text-ink/60 leading-relaxed">Read the axes and labels carefully. Most errors in DI come from misinterpreting the units or scale.</p>
                  </li>
                </ul>
              </motion.div>
            )}
          </AnimatePresence>
        </aside>
      </div>
    </div>
  );
};

const Vocabulary = ({ onBack, onXpChange, globalSearch, onSearchClear }: { onBack: () => void, onXpChange: (xp: number) => void, globalSearch?: string, onSearchClear?: () => void }) => {
  const [view, setView] = useState<'menu' | 'flashcards' | 'list' | 'practice'>('menu');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [practiceOptions, setPracticeOptions] = useState<string[]>([]);
  const [selectedPracticeOption, setSelectedPracticeOption] = useState<string | null>(null);
  const [showPracticeExplanation, setShowPracticeExplanation] = useState(false);
  const [isPracticeCorrect, setIsPracticeCorrect] = useState<boolean | null>(null);
  const [masteredWords, setMasteredWords] = useState<number[]>(getStorage(STORAGE_KEYS.masteredWords, []));
  const [searchQuery, setSearchQuery] = useState('');
  const soundEnabled = getStorage(STORAGE_KEYS.settings, { soundEnabled: true }).soundEnabled;

  useEffect(() => {
    const entryTime = Date.now();
    return () => {
      const elapsed = Math.floor((Date.now() - entryTime) / 1000);
      const current = getStorage(STORAGE_KEYS.studyTime, 0);
      setStorage(STORAGE_KEYS.studyTime, current + elapsed);
    };
  }, []);

  useEffect(() => {
    if (globalSearch && globalSearch.length > 0) {
      setView('list');
      setSearchQuery(globalSearch);
    }
  }, [globalSearch]);

  const currentWord = GRE_WORDS[currentIndex];

  const filteredWords = GRE_WORDS.filter(word => {
    const queryTerms = searchQuery.toLowerCase().split(' ').filter(Boolean);
    const matchesSearch = queryTerms.length === 0 || queryTerms.every(term => 
      word.word.toLowerCase().includes(term) ||
      word.definition.toLowerCase().includes(term) ||
      word.category.toLowerCase().includes(term) ||
      word.mnemonic.toLowerCase().includes(term)
    );
    const matchesCategory = selectedCategory === 'All' || word.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const playPronunciation = (text: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel(); // Cancel any ongoing speech
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.85; // Slightly slower for better pronunciation clarity
      window.speechSynthesis.speak(utterance);
    }
  };

  const toggleMastered = (id: number) => {
    const isNowMastered = !masteredWords.includes(id);
    const newMastered = isNowMastered 
      ? [...masteredWords, id]
      : masteredWords.filter(mid => mid !== id);
    
    setMasteredWords(newMastered);
    setStorage(STORAGE_KEYS.masteredWords, newMastered);
    
    if (isNowMastered) {
      playSound('correct', soundEnabled);
      fireConfetti();
      const newXp = awardXP(XP_REWARDS.flashcardMastered);
      onXpChange(newXp);
    } else {
      playSound('flip', soundEnabled);
    }
  };

  const nextWord = () => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev + 1) % GRE_WORDS.length);
    playSound('flip', soundEnabled);
  };

  const prevWord = () => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev - 1 + GRE_WORDS.length) % GRE_WORDS.length);
    playSound('flip', soundEnabled);
  };

  const startPractice = () => {
    setView('practice');
    generatePracticeOptions(currentIndex);
  };

  const generatePracticeOptions = (index: number) => {
    const correct = GRE_WORDS[index].definition;
    const others = GRE_WORDS
      .filter((_, i) => i !== index)
      .sort(() => 0.5 - Math.random())
      .slice(0, 3)
      .map(w => w.definition);
    
    setPracticeOptions([correct, ...others].sort(() => 0.5 - Math.random()));
    setSelectedPracticeOption(null);
    setShowPracticeExplanation(false);
    setIsPracticeCorrect(null);
  };

  const handlePracticeAnswer = (opt: string) => {
    if (showPracticeExplanation) return;
    setSelectedPracticeOption(opt);
    const correct = opt === currentWord.definition;
    setIsPracticeCorrect(correct);
    setShowPracticeExplanation(true);
    
    if (correct) {
      playSound('correct', soundEnabled);
      fireConfetti();
      const newXp = awardXP(XP_REWARDS.correctVerbal);
      onXpChange(newXp);
    } else {
      playSound('wrong', soundEnabled);
    }
  };

  const nextPracticeWord = () => {
    const nextIdx = (currentIndex + 1) % GRE_WORDS.length;
    setCurrentIndex(nextIdx);
    generatePracticeOptions(nextIdx);
    playSound('flip', soundEnabled);
  };

  if (view === 'menu') {
    return (
      <div className="space-y-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <button
          onClick={onBack}
          className="group flex items-center gap-3 text-[10px] font-sans font-bold text-ink/30 uppercase tracking-[0.2em] hover:text-ink transition-colors mb-8"
        >
          <ArrowRight size={14} className="rotate-180 group-hover:-translate-x-1 transition-transform" />
          Back to Dashboard
        </button>
        <header className="max-w-3xl">
          <h1 className="text-7xl md:text-8xl font-serif font-bold text-ink leading-[0.9] mb-8">
            Lexical<br />Mastery.
          </h1>
          <p className="text-xl font-sans text-ink/60 leading-relaxed max-w-2xl">
            A systematic approach to high-frequency GRE vocabulary. 
            Master the nuances of the Digital Lexicon through focused study.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 border-t border-ink/5 pt-12">
          <button 
            onClick={() => setView('flashcards')}
            className="group text-left space-y-6"
          >
            <div className="w-16 h-16 bg-bg-primary rounded-sm border border-ink/5 flex items-center justify-center text-accent-gold group-hover:bg-ink group-hover:text-white transition-all duration-500">
              <Zap size={24} />
            </div>
            <div className="space-y-2">
              <h3 className="text-3xl font-serif font-bold text-ink group-hover:text-accent-gold transition-colors">Flashcards</h3>
              <p className="text-sm font-sans text-ink/60 leading-relaxed">Interactive cards with pronunciations, mnemonics, and contextual examples.</p>
            </div>
            <div className="flex items-center gap-2 text-[10px] font-sans font-bold text-ink/30 uppercase tracking-[0.2em] group-hover:text-ink transition-colors">
              Initiate Session <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
            </div>
          </button>

          <button 
            onClick={() => setView('list')}
            className="group text-left space-y-6"
          >
            <div className="w-16 h-16 bg-bg-primary rounded-sm border border-ink/5 flex items-center justify-center text-accent-gold group-hover:bg-ink group-hover:text-white transition-all duration-500">
              <Search size={24} />
            </div>
            <div className="space-y-2">
              <h3 className="text-3xl font-serif font-bold text-ink group-hover:text-accent-gold transition-colors">Word List</h3>
              <p className="text-sm font-sans text-ink/60 leading-relaxed">A comprehensive repository of all high-frequency terms with progress tracking.</p>
            </div>
            <div className="flex items-center gap-2 text-[10px] font-sans font-bold text-ink/30 uppercase tracking-[0.2em] group-hover:text-ink transition-colors">
              Browse Repository <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
            </div>
          </button>

          <button 
            onClick={startPractice}
            className="group text-left space-y-6"
          >
            <div className="w-16 h-16 bg-bg-primary rounded-sm border border-ink/5 flex items-center justify-center text-accent-gold group-hover:bg-ink group-hover:text-white transition-all duration-500">
              <Target size={24} />
            </div>
            <div className="space-y-2">
              <h3 className="text-3xl font-serif font-bold text-ink group-hover:text-accent-gold transition-colors">Practice Quiz</h3>
              <p className="text-sm font-sans text-ink/60 leading-relaxed">Test your recall with definition-matching challenges and detailed feedback.</p>
            </div>
            <div className="flex items-center gap-2 text-[10px] font-sans font-bold text-ink/30 uppercase tracking-[0.2em] group-hover:text-ink transition-colors">
              Initiate Quiz <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
            </div>
          </button>
        </div>
      </div>
    );
  }

  if (view === 'practice') {
    return (
      <div className="space-y-12 max-w-4xl mx-auto">
        <div className="flex items-center justify-between border-b border-ink/5 pb-8">
          <button 
            onClick={() => setView('menu')} 
            className="group flex items-center gap-3 text-[10px] font-sans font-bold text-ink/30 uppercase tracking-[0.2em] hover:text-ink transition-colors"
          >
            <X size={14} /> Terminate Quiz
          </button>
          <div className="text-[10px] font-sans font-bold text-ink/30 uppercase tracking-[0.2em]">
            Word {currentIndex + 1} of {GRE_WORDS.length}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          <div className="lg:col-span-8 space-y-12">
            <div className="p-12 bg-white rounded-sm border border-ink/5 shadow-sm relative">
              <div className="absolute top-0 left-0 w-1 h-full bg-accent-gold" />
              <p className="text-[10px] font-sans font-bold text-ink/30 uppercase tracking-[0.3em] mb-8">
                Identify the Definition
              </p>
              <h2 className="text-6xl font-serif font-bold text-ink mb-4">{currentWord.word}</h2>
              <p className="text-lg font-serif italic text-ink/30 mb-12">{currentWord.pronunciation}</p>

              <div className="grid grid-cols-1 gap-4">
                {practiceOptions.map((opt, idx) => (
                  <button
                    key={idx}
                    onClick={() => handlePracticeAnswer(opt)}
                    className={`
                      group flex items-center gap-6 p-6 rounded-sm border transition-all text-left
                      ${selectedPracticeOption === opt 
                        ? (opt === currentWord.definition ? 'bg-ink text-white border-ink' : 'bg-red-50 border-red-200 text-red-900')
                        : (showPracticeExplanation && opt === currentWord.definition ? 'bg-teal-50 border-teal-200 text-teal-900' : 'bg-white border-ink/5 hover:border-ink/20 text-ink/60')}
                    `}
                  >
                    <span className={`
                      w-10 h-10 rounded-full flex items-center justify-center text-[10px] font-sans font-bold uppercase tracking-widest transition-colors
                      ${selectedPracticeOption === opt ? 'bg-white/20 text-white' : 'bg-bg-primary text-ink/30 group-hover:bg-ink group-hover:text-white'}
                    `}>
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span className="text-lg font-sans font-medium leading-tight">{opt}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <aside className="lg:col-span-4 space-y-12">
            <AnimatePresence mode="wait">
              {showPracticeExplanation ? (
                <motion.div 
                  key="explanation"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-8"
                >
                  <div className="p-8 bg-white rounded-sm border border-ink/5 shadow-sm space-y-6">
                    <div className={`flex items-center gap-3 ${isPracticeCorrect ? 'text-teal-500' : 'text-red-500'}`}>
                      {isPracticeCorrect ? <CheckCircle2 size={20} /> : <X size={20} />}
                      <h3 className="text-[10px] font-sans font-bold uppercase tracking-[0.2em]">
                        {isPracticeCorrect ? 'Lexical Accuracy' : 'Lexical Error'}
                      </h3>
                    </div>
                    
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <h4 className="text-[10px] font-sans font-bold text-ink/30 uppercase tracking-[0.2em]">Dictionary Meaning</h4>
                        <p className="text-lg font-sans text-ink/60 leading-relaxed italic">
                          {currentWord.definition}
                        </p>
                      </div>

                      <div className="p-6 bg-bg-primary rounded-sm border border-ink/5">
                        <h4 className="text-[10px] font-sans font-bold text-accent-gold uppercase tracking-[0.2em] mb-3">Contextual Usage</h4>
                        <p className="text-sm font-sans text-ink/60 leading-relaxed italic">
                          "{currentWord.example}"
                        </p>
                      </div>

                      <div className="space-y-2">
                        <h4 className="text-[10px] font-sans font-bold text-ink/30 uppercase tracking-[0.2em]">Mnemonic Aid</h4>
                        <p className="text-sm font-sans text-ink/60 leading-relaxed">
                          {currentWord.mnemonic}
                        </p>
                      </div>
                    </div>
                  </div>
                  <button 
                    onClick={nextPracticeWord}
                    className="w-full py-6 bg-accent-gold text-white rounded-sm font-sans font-bold text-xs uppercase tracking-[0.2em] hover:bg-accent-gold/90 transition-all shadow-xl flex items-center justify-center gap-3"
                  >
                    Next Word <ArrowRight size={14} />
                  </button>
                </motion.div>
              ) : (
                <motion.div 
                  key="tips"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="p-8 bg-bg-primary rounded-sm border border-ink/5 space-y-8"
                >
                  <h3 className="text-[10px] font-sans font-bold text-ink/30 uppercase tracking-[0.2em]">Practice Tips</h3>
                  <ul className="space-y-6">
                    <li className="space-y-2">
                      <span className="text-[10px] font-sans font-bold text-accent-gold uppercase tracking-widest">Active Recall</span>
                      <p className="text-sm font-sans text-ink/60 leading-relaxed">Try to define the word in your own head before looking at the options.</p>
                    </li>
                    <li className="space-y-2">
                      <span className="text-[10px] font-sans font-bold text-accent-gold uppercase tracking-widest">Etymology</span>
                      <p className="text-sm font-sans text-ink/60 leading-relaxed">Look for Latin or Greek roots that might hint at the word's meaning.</p>
                    </li>
                  </ul>
                </motion.div>
              )}
            </AnimatePresence>
          </aside>
        </div>
      </div>
    );
  }

  if (view === 'flashcards') {
    return (
      <div className="space-y-12 max-w-4xl mx-auto">
        <div className="flex items-center justify-between border-b border-ink/5 pb-8">
          <button 
            onClick={() => setView('menu')} 
            className="group flex items-center gap-3 text-[10px] font-sans font-bold text-ink/30 uppercase tracking-[0.2em] hover:text-ink transition-colors"
          >
            <X size={14} /> Terminate Session
          </button>
          <div className="text-[10px] font-sans font-bold text-ink/30 uppercase tracking-[0.2em]">
            Card {currentIndex + 1} of {GRE_WORDS.length}
          </div>
        </div>

        <div className="h-[500px] relative cursor-pointer" style={{ perspective: '1000px' }} onClick={() => setIsFlipped(!isFlipped)}>
          <motion.div 
            className="w-full h-full relative shadow-2xl"
            style={{ transformStyle: 'preserve-3d' }}
            animate={{ rotateY: isFlipped ? 180 : 0 }}
            transition={{ type: "spring", stiffness: 100, damping: 20 }}
          >
            {/* Front */}
            <div 
              className="absolute inset-0 bg-white rounded-sm border border-ink/5 flex flex-col items-center justify-center p-16 text-center"
              style={{ backfaceVisibility: 'hidden' }}
            >
              <p className="text-[10px] font-sans font-bold text-accent-gold uppercase tracking-[0.3em] mb-8">
                {currentWord.category}
              </p>
              <div className="relative mb-6">
                <h2 className="text-8xl font-serif font-bold text-ink tracking-tight px-16">{currentWord.word}</h2>
                <button 
                  onClick={(e) => playPronunciation(currentWord.word, e)}
                  className="absolute right-0 top-1/2 -translate-y-1/2 p-3 rounded-full bg-ink/5 text-ink/40 hover:bg-ink/10 hover:text-ink transition-colors"
                  title="Play pronunciation"
                >
                  <Volume2 size={24} />
                </button>
              </div>
              <p className="text-xl font-serif italic text-ink/30">{currentWord.pronunciation}</p>
              <div className="mt-16 flex items-center gap-2 text-[10px] font-sans font-bold text-ink/10 uppercase tracking-[0.2em]">
                Click to reveal definition
              </div>
            </div>

            {/* Back */}
            <div 
              className="absolute inset-0 bg-white rounded-sm border border-ink/5 flex flex-col p-16 overflow-y-auto"
              style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
            >
              <div className="flex items-center justify-between mb-12">
                <span className="text-[10px] font-sans font-bold text-ink/30 uppercase tracking-[0.2em]">{currentWord.pos}</span>
                <button 
                  onClick={(e) => { e.stopPropagation(); toggleMastered(currentWord.id); }}
                  className={`p-3 rounded-sm transition-all ${masteredWords.includes(currentWord.id) ? 'bg-accent-gold text-white shadow-lg' : 'bg-ink/5 text-ink/20 hover:text-ink/40'}`}
                >
                  <CheckCircle2 size={24} />
                </button>
              </div>
              
              <div className="space-y-12">
                <div className="space-y-4">
                  <h4 className="text-[10px] font-sans font-bold text-ink/30 uppercase tracking-[0.2em]">Definition</h4>
                  <p className="text-3xl font-serif font-bold text-ink leading-tight">{currentWord.definition}</p>
                </div>
                
                <div className="p-8 bg-bg-primary rounded-sm border border-ink/5 border-l-4 border-l-accent-gold">
                  <h4 className="text-[10px] font-sans font-bold text-accent-gold uppercase tracking-[0.2em] mb-4">Mnemonic</h4>
                  <p className="text-lg font-sans text-ink/60 italic leading-relaxed">"{currentWord.mnemonic}"</p>
                </div>

                <div className="space-y-4">
                  <h4 className="text-[10px] font-sans font-bold text-ink/30 uppercase tracking-[0.2em]">Contextual Usage</h4>
                  <p className="text-lg font-sans text-ink/60 leading-relaxed italic">"{currentWord.example}"</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="flex items-center justify-center gap-12 pt-8">
          <button 
            onClick={prevWord}
            className="group flex items-center gap-3 text-[10px] font-sans font-bold text-ink/30 uppercase tracking-[0.2em] hover:text-ink transition-colors"
          >
            <ArrowRight size={14} className="rotate-180 group-hover:-translate-x-1 transition-transform" /> Previous
          </button>
          <button 
            onClick={() => setIsFlipped(!isFlipped)}
            className="px-12 py-6 bg-ink text-white rounded-sm font-sans font-bold text-xs uppercase tracking-[0.2em] hover:bg-ink/90 transition-colors shadow-xl"
          >
            Flip Card
          </button>
          <button 
            onClick={nextWord}
            className="group flex items-center gap-3 text-[10px] font-sans font-bold text-ink/30 uppercase tracking-[0.2em] hover:text-ink transition-colors"
          >
            Next <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    );
  }

  if (view === 'list') {
    return (
      <div className="space-y-12">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-ink/5 pb-12">
          <div className="space-y-4">
            <button 
              onClick={() => setView('menu')} 
              className="group flex items-center gap-3 text-[10px] font-sans font-bold text-ink/30 uppercase tracking-[0.2em] hover:text-ink transition-colors"
            >
              <ArrowRight size={14} className="rotate-180 group-hover:-translate-x-1 transition-transform" /> Back to Menu
            </button>
            <h1 className="text-6xl font-serif font-bold text-ink">Repository.</h1>
          </div>
          <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
            <div className="relative">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="appearance-none pl-4 pr-10 py-4 bg-white border border-ink/5 rounded-sm text-[10px] font-sans font-bold uppercase tracking-widest focus:ring-1 focus:ring-accent-gold/20 transition-all cursor-pointer"
              >
                {['All', 'Action', 'Art', 'Behavior', 'Change', 'Emotion', 'Intellect', 'Logic', 'Morality', 'Quantity', 'Speech'].map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-ink/20 pointer-events-none" size={12} />
            </div>
            <div className="relative w-full md:w-96">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-ink/20" size={16} />
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  if (e.target.value === '') onSearchClear?.();
                }}
                placeholder="Search the lexicon..."
                className="w-full pl-12 pr-12 py-4 bg-white border border-ink/5 rounded-sm text-sm font-sans focus:ring-1 focus:ring-accent-gold/20 transition-all placeholder:text-ink/20"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-ink/20 hover:text-ink transition-colors p-1"
                >
                  <X size={16} />
                </button>
              )}
            </div>
          </div>
        </header>

        <div className="bg-white rounded-sm border border-ink/5 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-bg-primary border-b border-ink/5">
                  <th className="px-8 py-6 text-[10px] font-sans font-bold text-ink/30 uppercase tracking-[0.2em]">Lexeme</th>
                  <th className="px-8 py-6 text-[10px] font-sans font-bold text-ink/30 uppercase tracking-[0.2em]">Category</th>
                  <th className="px-8 py-6 text-[10px] font-sans font-bold text-ink/30 uppercase tracking-[0.2em]">Definition</th>
                  <th className="px-8 py-6 text-[10px] font-sans font-bold text-ink/30 uppercase tracking-[0.2em]">Mastery</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink/5">
                {searchQuery && filteredWords.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-8 py-12 text-center text-sm font-sans text-ink/30 italic">
                      No words match "{searchQuery}"
                    </td>
                  </tr>
                ) : (
                  filteredWords.map((word) => (
                    <tr key={word.id} className="hover:bg-bg-primary transition-colors group cursor-pointer">
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-3">
                          <div>
                            <p className="text-xl font-serif font-bold text-ink group-hover:text-accent-gold transition-colors">{word.word}</p>
                            <p className="text-xs font-serif italic text-ink/30">{word.pronunciation}</p>
                          </div>
                          <button 
                            onClick={(e) => playPronunciation(word.word, e)}
                            className="p-2 rounded-full bg-ink/5 text-ink/40 hover:bg-ink/10 hover:text-ink transition-colors opacity-0 group-hover:opacity-100"
                            title="Play pronunciation"
                          >
                            <Volume2 size={16} />
                          </button>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <span className="text-[10px] font-sans font-bold text-ink/40 uppercase tracking-widest">
                          {word.category}
                        </span>
                      </td>
                      <td className="px-8 py-6">
                        <p className="text-sm font-sans text-ink/60 leading-relaxed max-w-md line-clamp-1">{word.definition}</p>
                      </td>
                      <td className="px-8 py-6">
                        <button 
                          onClick={(e) => { e.stopPropagation(); toggleMastered(word.id); }}
                          className={`p-3 rounded-sm transition-all ${masteredWords.includes(word.id) ? 'bg-accent-gold text-white shadow-lg' : 'bg-ink/5 text-ink/10 group-hover:text-ink/30'}`}
                        >
                          <CheckCircle2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

const VocabularyNotes = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [viewMode, setViewMode] = useState<'lexicon' | 'flashcards'>('lexicon');
  const [currentFlashcardIndex, setCurrentFlashcardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const filteredWords = GRE_WORDS.filter(word => {
    const queryTerms = searchQuery.toLowerCase().split(' ').filter(Boolean);
    const matchesSearch = queryTerms.length === 0 || queryTerms.every(term => 
      word.word.toLowerCase().includes(term) ||
      word.definition.toLowerCase().includes(term) ||
      word.category.toLowerCase().includes(term) ||
      word.mnemonic.toLowerCase().includes(term)
    );
    const matchesCategory = selectedCategory === 'All' || word.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const playPronunciation = (text: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.85;
      window.speechSynthesis.speak(utterance);
    }
  };

  const categories = ['All', ...Array.from(new Set(GRE_WORDS.map(w => w.category)))].sort();

  const nextFlashcard = () => {
    setIsFlipped(false);
    setCurrentFlashcardIndex((prev) => (prev + 1) % filteredWords.length);
  };

  const prevFlashcard = () => {
    setIsFlipped(false);
    setCurrentFlashcardIndex((prev) => (prev - 1 + filteredWords.length) % filteredWords.length);
  };

  return (
    <div className="space-y-16 max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-1000">
      <header className="space-y-8 border-b border-ink/5 pb-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="space-y-4">
            <h1 className="text-7xl font-serif font-bold text-ink leading-none tracking-tight">
              Scholarly<br />Lexicon.
            </h1>
            <p className="text-xl font-sans text-ink/60 leading-relaxed max-w-2xl italic">
              A curated compendium of high-frequency GRE terminology, 
              meticulously annotated for the discerning academic.
            </p>
          </div>
          
          <div className="flex bg-bg-primary p-1 rounded-sm border border-ink/5">
            <button 
              onClick={() => setViewMode('lexicon')}
              className={`px-6 py-3 text-[10px] font-sans font-bold uppercase tracking-widest transition-all ${viewMode === 'lexicon' ? 'bg-white text-ink shadow-sm' : 'text-ink/30 hover:text-ink/60'}`}
            >
              Lexicon
            </button>
            <button 
              onClick={() => {
                setViewMode('flashcards');
                setCurrentFlashcardIndex(0);
                setIsFlipped(false);
              }}
              className={`px-6 py-3 text-[10px] font-sans font-bold uppercase tracking-widest transition-all ${viewMode === 'flashcards' ? 'bg-white text-ink shadow-sm' : 'text-ink/30 hover:text-ink/60'}`}
            >
              Flashcards
            </button>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-6 pt-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-ink/20" size={18} />
            <input 
              type="text" 
              placeholder="Filter by keyword or concept..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentFlashcardIndex(0);
              }}
              className="w-full pl-12 pr-4 py-4 bg-white border border-ink/5 rounded-sm font-sans text-sm focus:outline-none focus:border-accent-gold transition-colors placeholder:text-ink/10"
            />
          </div>
          <div className="relative min-w-[200px]">
            <select 
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setCurrentFlashcardIndex(0);
              }}
              className="w-full appearance-none pl-4 pr-10 py-4 bg-white border border-ink/5 rounded-sm font-sans text-[10px] font-bold uppercase tracking-[0.2em] focus:outline-none focus:border-accent-gold transition-colors cursor-pointer"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat.toUpperCase()}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-ink/20 pointer-events-none" size={14} />
          </div>
        </div>
      </header>

      {viewMode === 'lexicon' ? (
        <div className="space-y-24">
          {filteredWords.map((word, index) => (
            <motion.article 
              key={word.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              className="group relative grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-16"
            >
              <div className="md:col-span-4 space-y-4">
                <div className="flex items-baseline gap-4">
                  <span className="text-xs font-mono text-ink/20">{(index + 1).toString().padStart(3, '0')}</span>
                  <div className="flex items-center gap-3">
                    <h2 className="text-4xl font-serif font-bold text-ink group-hover:text-accent-gold transition-colors duration-500">
                      {word.word}
                    </h2>
                    <button 
                      onClick={(e) => playPronunciation(word.word, e)}
                      className="p-2 rounded-full bg-ink/5 text-ink/40 hover:bg-ink/10 hover:text-ink transition-colors opacity-0 group-hover:opacity-100"
                      title="Play pronunciation"
                    >
                      <Volume2 size={18} />
                    </button>
                  </div>
                </div>
                <div className="flex flex-wrap gap-3">
                  <span className="text-[10px] font-sans font-bold text-ink/40 uppercase tracking-widest border border-ink/10 px-2 py-1 rounded-sm">
                    {word.pos}
                  </span>
                  <span className="text-[10px] font-sans font-bold text-accent-gold uppercase tracking-widest bg-accent-gold/5 px-2 py-1 rounded-sm">
                    {word.category}
                  </span>
                </div>
                <p className="text-sm font-serif italic text-ink/40">{word.pronunciation}</p>
              </div>

              <div className="md:col-span-8 space-y-8">
                <div className="space-y-4">
                  <h3 className="text-[10px] font-sans font-bold text-ink/20 uppercase tracking-[0.3em]">Definition</h3>
                  <p className="text-xl font-sans text-ink/80 leading-relaxed font-medium">
                    {word.definition}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-4 border-t border-ink/5">
                  <div className="space-y-3">
                    <h4 className="text-[10px] font-sans font-bold text-accent-gold uppercase tracking-[0.2em]">Mnemonic Aid</h4>
                    <p className="text-sm font-sans text-ink/60 leading-relaxed italic">
                      {word.mnemonic}
                    </p>
                  </div>
                  <div className="space-y-3">
                    <h4 className="text-[10px] font-sans font-bold text-ink/30 uppercase tracking-[0.2em]">Contextual Usage</h4>
                    <p className="text-sm font-sans text-ink/60 leading-relaxed italic">
                      "{word.example}"
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Decorative line */}
              <div className="absolute -bottom-12 left-0 w-full h-px bg-gradient-to-r from-ink/5 via-ink/5 to-transparent" />
            </motion.article>
          ))}
          
          {filteredWords.length === 0 && (
            <div className="py-24 text-center space-y-4">
              <div className="text-4xl font-serif italic text-ink/10">No matches found in the lexicon.</div>
              <button 
                onClick={() => { setSearchQuery(''); setSelectedCategory('All'); }}
                className="text-[10px] font-sans font-bold text-accent-gold uppercase tracking-widest hover:text-ink transition-colors"
              >
                Reset Filters
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-12">
          {filteredWords.length > 0 ? (
            <div className="max-w-2xl mx-auto space-y-12">
              <div className="flex items-center justify-between text-[10px] font-sans font-bold text-ink/30 uppercase tracking-[0.3em]">
                <span>Word {currentFlashcardIndex + 1} of {filteredWords.length}</span>
                <span>{filteredWords[currentFlashcardIndex].category}</span>
              </div>

              <div 
                className="h-[450px] relative cursor-pointer" 
                style={{ perspective: '1000px' }}
                onClick={() => setIsFlipped(!isFlipped)}
              >
                <motion.div 
                  className="w-full h-full relative"
                  style={{ transformStyle: 'preserve-3d' }}
                  animate={{ rotateY: isFlipped ? 180 : 0 }}
                  transition={{ type: "spring", stiffness: 100, damping: 20 }}
                >
                  {/* Front */}
                  <div 
                    className="absolute inset-0 bg-white rounded-sm border border-ink/5 flex flex-col items-center justify-center p-12 text-center shadow-2xl shadow-ink/5"
                    style={{ backfaceVisibility: 'hidden' }}
                  >
                    <div className="absolute top-8 left-8 w-12 h-px bg-accent-gold" />
                    <div className="relative mb-4">
                      <h2 className="text-6xl font-serif font-bold text-ink tracking-tight px-12">
                        {filteredWords[currentFlashcardIndex].word}
                      </h2>
                      <button 
                        onClick={(e) => playPronunciation(filteredWords[currentFlashcardIndex].word, e)}
                        className="absolute right-0 top-1/2 -translate-y-1/2 p-2 rounded-full bg-ink/5 text-ink/40 hover:bg-ink/10 hover:text-ink transition-colors"
                        title="Play pronunciation"
                      >
                        <Volume2 size={18} />
                      </button>
                    </div>
                    <p className="text-lg font-serif italic text-ink/30">
                      {filteredWords[currentFlashcardIndex].pronunciation}
                    </p>
                    <div className="mt-12 flex items-center gap-2 text-[8px] font-sans font-bold text-ink/10 uppercase tracking-[0.3em]">
                      Click to reveal definition
                    </div>
                  </div>

                  {/* Back */}
                  <div 
                    className="absolute inset-0 bg-white rounded-sm border border-ink/5 flex flex-col p-12 overflow-y-auto shadow-2xl shadow-ink/5"
                    style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
                  >
                    <div className="flex items-center justify-between mb-8">
                      <span className="text-[10px] font-sans font-bold text-ink/30 uppercase tracking-[0.2em]">
                        {filteredWords[currentFlashcardIndex].pos}
                      </span>
                      <div className="w-8 h-px bg-accent-gold" />
                    </div>
                    
                    <div className="space-y-8">
                      <div className="space-y-3">
                        <h4 className="text-[10px] font-sans font-bold text-ink/20 uppercase tracking-[0.3em]">Definition</h4>
                        <p className="text-2xl font-serif font-bold text-ink leading-tight">
                          {filteredWords[currentFlashcardIndex].definition}
                        </p>
                      </div>
                      
                      <div className="p-6 bg-bg-primary rounded-sm border-l-2 border-accent-gold">
                        <h4 className="text-[10px] font-sans font-bold text-accent-gold uppercase tracking-[0.2em] mb-3">Mnemonic</h4>
                        <p className="text-sm font-sans text-ink/60 italic leading-relaxed">
                          {filteredWords[currentFlashcardIndex].mnemonic}
                        </p>
                      </div>

                      <div className="space-y-3">
                        <h4 className="text-[10px] font-sans font-bold text-ink/20 uppercase tracking-[0.3em]">Usage</h4>
                        <p className="text-sm font-sans text-ink/60 leading-relaxed italic">
                          "{filteredWords[currentFlashcardIndex].example}"
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>

              <div className="flex items-center justify-center gap-12 pt-4">
                <button 
                  onClick={(e) => { e.stopPropagation(); prevFlashcard(); }}
                  className="group flex items-center gap-3 text-[10px] font-sans font-bold text-ink/30 uppercase tracking-[0.2em] hover:text-ink transition-colors"
                >
                  <ArrowRight size={14} className="rotate-180 group-hover:-translate-x-1 transition-transform" /> Previous
                </button>
                <div className="w-px h-4 bg-ink/10" />
                <button 
                  onClick={(e) => { e.stopPropagation(); nextFlashcard(); }}
                  className="group flex items-center gap-3 text-[10px] font-sans font-bold text-ink/30 uppercase tracking-[0.2em] hover:text-ink transition-colors"
                >
                  Next <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          ) : (
            <div className="py-24 text-center space-y-4">
              <div className="text-4xl font-serif italic text-ink/10">No words available for flashcards.</div>
              <button 
                onClick={() => { setSearchQuery(''); setSelectedCategory('All'); }}
                className="text-[10px] font-sans font-bold text-accent-gold uppercase tracking-widest hover:text-ink transition-colors"
              >
                Reset Filters
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const Dashboard = ({ onNavigate }: { onNavigate: (section: string) => void }) => {
  const xp = getStorage(STORAGE_KEYS.xp, 0);
  const streak = getStorage(STORAGE_KEYS.streak, 0);
  const masteredWords = getStorage(STORAGE_KEYS.masteredWords, []);
  const quizHistory = getStorage(STORAGE_KEYS.quizHistory, []);
  const totalSeconds = getStorage(STORAGE_KEYS.studyTime, 0);
  const { level, title, progress } = getLevelInfo(xp);

  const ACCOLADES = [
    { id: 'pioneer', title: 'Lexical Pioneer', subtitle: 'Mastered 50+ Words', icon: Trophy, condition: (data: any) => data.masteredWords >= 50 },
    { id: 'scholar', title: 'Consistent Scholar', subtitle: '7 Day Streak', icon: Zap, condition: (data: any) => data.streak >= 7 },
    { id: 'centurion', title: 'Word Centurion', subtitle: 'Mastered 100+ Words', icon: BookMarked, condition: (data: any) => data.masteredWords >= 100 },
    { id: 'quant', title: 'Quant Ace', subtitle: '10 Correct Quant Answers', icon: Calculator, condition: (data: any) => data.quantCorrect >= 10 },
  ];

  const accoladeData = { masteredWords: masteredWords.length, streak, quantCorrect: getStorage('grenius_quant_correct', 0) };

  const avgScore = quizHistory.length > 0
    ? Math.round(quizHistory.reduce((acc: number, q: any) => acc + (q.score || 0), 0) / quizHistory.length)
    : null;

  const formatStudyTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  const behaviorWords = GRE_WORDS.filter(w => w.category?.toLowerCase() === 'behavior');
  const masteredBehavior = behaviorWords.filter(w => masteredWords.includes(w.id)).length;
  const quizHistoryData = getStorage(STORAGE_KEYS.quizHistory, []) as any[];
  const quantCorrect = getStorage('grenius_quant_correct', 0);

  const goals = [
    {
      text: 'Master 10 vocabulary words',
      done: masteredWords.length >= 10,
      progress: Math.min(masteredWords.length, 10),
      target: 10
    },
    {
      text: `Master all "behavior" words (${masteredBehavior}/${behaviorWords.length})`,
      done: masteredBehavior >= behaviorWords.length,
      progress: masteredBehavior,
      target: behaviorWords.length
    },
    {
      text: 'Complete your first verbal session',
      done: quizHistoryData.some((q: any) => q.type === 'Verbal'),
      progress: quizHistoryData.some((q: any) => q.type === 'Verbal') ? 1 : 0,
      target: 1
    },
    {
      text: 'Complete your first quant session',
      done: quizHistoryData.some((q: any) => q.type === 'Quantitative'),
      progress: quizHistoryData.some((q: any) => q.type === 'Quantitative') ? 1 : 0,
      target: 1
    },
    {
      text: 'Reach a 3-day study streak',
      done: streak >= 3,
      progress: Math.min(streak, 3),
      target: 3
    },
    {
      text: 'Answer 50 quant questions correctly',
      done: quantCorrect >= 50,
      progress: Math.min(quantCorrect, 50),
      target: 50
    },
  ];
  
  return (
    <div className="space-y-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="max-w-3xl">
        <h1 className="text-7xl md:text-8xl font-serif font-bold text-ink leading-[0.9] mb-8">
          Academic<br />Attainment.
        </h1>
        <p className="text-xl font-sans text-ink/60 leading-relaxed max-w-2xl">
          A comprehensive audit of your cognitive progression across the Digital Lexicon. 
          Your trajectory indicates a significant mastery of high-frequency verbal patterns.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-12 border-y border-ink/5 py-12">
        <StatCard 
          icon={BookMarked} 
          value={masteredWords.length.toLocaleString()} 
          label="Words Mastered" 
        />
        <StatCard 
          icon={CheckCircle2} 
          value={avgScore !== null ? `${avgScore}%` : '—'} 
          label="Average Quiz Score" 
          subtitle={avgScore === null ? "Complete quizzes to see score" : undefined}
        />
        <StatCard 
          icon={Clock} 
          value={formatStudyTime(totalSeconds)} 
          label="Total Study Time" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
        <div className="lg:col-span-2 space-y-16">
          <section className="space-y-8">
            <div className="flex items-end justify-between border-b border-ink/5 pb-4">
              <h2 className="text-xs font-sans font-bold text-ink uppercase tracking-[0.3em]">Experience Trajectory</h2>
              <span className="text-[10px] font-sans font-bold text-accent-gold uppercase tracking-widest">{title}</span>
            </div>
            <div className="space-y-6">
              <div className="flex items-end justify-between">
                <span className="text-4xl font-serif font-bold text-ink">{xp} <span className="text-lg text-ink/20 italic">XP</span></span>
                <span className="text-xs font-sans font-bold text-ink/40 uppercase tracking-widest">Level {level}</span>
              </div>
              <div className="w-full h-1 bg-ink/5 rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-accent-gold"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 1.5, ease: "circOut" }}
                />
              </div>
            </div>
          </section>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-12">
            <StudySectionCard 
              icon={BookOpen}
              title="Vocabulary"
              description="Master the nuances of 995 authentic Manhattan Prep GRE terms with scholarly mnemonics."
              actionText="Initiate Study"
              onClick={() => onNavigate('vocabulary')}
            />
            <StudySectionCard 
              icon={Calculator}
              title="Quantitative"
              description="Rigorous practice across arithmetic, algebra, and geometric analysis."
              actionText="Solve Problems"
              onClick={() => onNavigate('quantitative')}
            />
          </div>
        </div>

        <aside className="space-y-12">
          <section className="space-y-8">
            <h2 className="text-xs font-sans font-bold text-ink uppercase tracking-[0.3em] border-b border-ink/5 pb-4">Academic Accolades</h2>
            <div className="space-y-6">
              {ACCOLADES.map(accolade => (
                <AccoladeItem 
                  key={accolade.id}
                  icon={accolade.icon}
                  title={accolade.title}
                  subtitle={accolade.subtitle}
                  unlocked={accolade.condition(accoladeData)}
                />
              ))}
            </div>
          </section>

          <section className="space-y-8">
            <h2 className="text-xs font-sans font-bold text-ink uppercase tracking-[0.3em] border-b border-ink/5 pb-4">Upcoming Goals</h2>
            <div className="space-y-4">
              {goals.map(goal => (
                <GoalItem 
                  key={goal.text}
                  text={goal.text}
                  done={goal.done}
                  progress={goal.progress}
                  target={goal.target}
                />
              ))}
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
};

const App = () => {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth >= 768);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [globalSearch, setGlobalSearch] = useState('');
  const [settings, setSettings] = useState<UserSettings>(getStorage(STORAGE_KEYS.settings, {
    name: 'Scholar',
    dailyGoal: 50,
    soundEnabled: true,
    theme: 'light'
  }));
  const [xp, setXp] = useState(() => getStorage(STORAGE_KEYS.xp, 0));
  const [streak, setStreak] = useState(() => getStorage(STORAGE_KEYS.streak, 0));

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) setIsSidebarOpen(false);
      else setIsSidebarOpen(true);
    };
    window.addEventListener('resize', handleResize);
    
    // Update streak on mount
    const newStreak = updateStreak();
    setStreak(newStreak);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    setSettings(getStorage(STORAGE_KEYS.settings, { name: 'Scholar' }));
    const currentXp = getStorage(STORAGE_KEYS.xp, 0);
    const currentStreak = getStorage(STORAGE_KEYS.streak, 0);
    setXp(currentXp);
    setStreak(currentStreak);
  }, [activeSection]);

  const handleXpChange = (newXp: number) => {
    setXp(newXp);
  };

  const { level, title } = getLevelInfo(xp);

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .filter(Boolean)
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getDisplayName = (name: string) => {
    const parts = name.split(' ').filter(Boolean);
    if (parts.length > 1) {
      return `${parts[0]} ${parts[1][0]}.`;
    }
    return name;
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'vocabulary', label: 'Vocabulary', icon: BookOpen },
    { id: 'notes', label: 'Notes', icon: BookMarked },
    { id: 'quantitative', label: 'Quantitative', icon: Calculator },
    { id: 'verbal', label: 'Verbal Practice', icon: MessageSquare },
    { id: 'mindgames', label: 'Mind Games', icon: Gamepad2 },
    { id: 'progress', label: 'My Progress', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: SettingsIcon },
  ];

  const renderSection = () => {
    switch (activeSection) {
      case 'dashboard':
        return <Dashboard onNavigate={setActiveSection} />;
      case 'vocabulary':
        return <Vocabulary onBack={() => setActiveSection('dashboard')} onXpChange={handleXpChange} globalSearch={globalSearch} onSearchClear={() => setGlobalSearch('')} />;
      case 'notes':
        return <VocabularyNotes />;
      case 'quantitative':
        return <Quantitative onXpChange={handleXpChange} />;
      case 'verbal':
        return <Verbal onXpChange={handleXpChange} />;
      case 'mindgames':
        return <MindGames onXpChange={handleXpChange} />;
      case 'progress':
        return <Progress />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard onNavigate={setActiveSection} />;
    }
  };

  return (
    <div className="min-h-screen bg-bg-primary flex">
      {/* Sidebar */}
      <aside 
        className={`
          fixed md:sticky top-0 h-screen inset-y-0 left-0 z-50
          bg-white border-r border-ink/5 transition-all duration-500 ease-in-out overflow-hidden
          ${isMobile 
            ? (isSidebarOpen ? 'w-72 translate-x-0' : 'w-72 -translate-x-full')
            : (isSidebarOpen ? 'w-72' : 'w-20')
          }
        `}
      >
        <div className={`h-full flex flex-col transition-all duration-500 ${isSidebarOpen ? 'p-6' : 'p-5'}`}>
          <div className={`flex items-center transition-all duration-500 mb-16 ${isSidebarOpen ? 'gap-3' : 'gap-0 justify-center'}`}>
            <motion.div 
              whileHover={{ scale: 1.1, rotate: 5 }}
              whileTap={{ scale: 0.9 }}
              className="w-10 h-10 bg-accent-gold rounded-sm flex items-center justify-center text-white shrink-0 shadow-lg shadow-accent-gold/20 cursor-pointer"
              onClick={() => !isMobile && setIsSidebarOpen(!isSidebarOpen)}
            >
              <Brain size={20} />
            </motion.div>
            <AnimatePresence mode="wait">
              {isSidebarOpen && (
                <motion.span 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.2 }}
                  className="text-2xl font-serif font-bold text-ink whitespace-nowrap"
                >
                  GREnius
                </motion.span>
              )}
            </AnimatePresence>
          </div>

          <nav className="flex-1 space-y-4">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveSection(item.id);
                  if (isMobile) setIsSidebarOpen(false);
                  const soundEnabled = getStorage(STORAGE_KEYS.settings, { soundEnabled: true }).soundEnabled;
                  playSound('flip', soundEnabled);
                }}
                className={`w-full flex items-center transition-all relative
                  ${isSidebarOpen ? 'gap-4 p-3' : 'gap-0 p-3 justify-center'}
                  ${activeSection === item.id 
                    ? 'text-accent-gold border-l-2 border-accent-gold bg-accent-gold/5' 
                    : 'text-ink/40 hover:text-ink border-l-2 border-transparent'}
                  ${isSidebarOpen && activeSection === item.id ? 'pl-[calc(0.75rem-2px)]' : ''}`}
              >
                <div className="shrink-0">
                  <item.icon size={20} strokeWidth={activeSection === item.id ? 2.5 : 2} />
                </div>
                <AnimatePresence mode="wait">
                  {isSidebarOpen && (
                    <motion.span 
                      initial={{ opacity: 0, x: -5 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -5 }}
                      transition={{ duration: 0.2 }}
                      className="text-[10px] font-sans font-bold uppercase tracking-[0.2em] whitespace-nowrap"
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>
            ))}
          </nav>

          <div className="mt-auto pt-8 border-t border-ink/5">
            <div className={`flex items-center gap-4 transition-all ${isSidebarOpen ? '' : 'justify-center'}`}>
              <div className="w-10 h-10 rounded-full bg-ink flex items-center justify-center border border-ink/10 shrink-0 overflow-hidden">
                <span className="text-[10px] font-sans font-bold text-accent-gold tracking-widest">
                  {getInitials(settings.name || 'Scholar')}
                </span>
              </div>
              {isSidebarOpen && (
                <div className="overflow-hidden">
                  <p className="text-[10px] font-sans font-bold text-ink uppercase tracking-widest truncate">
                    {getDisplayName(settings.name || 'Scholar')}
                  </p>
                  <p className="text-[8px] font-sans text-ink/30 uppercase tracking-widest truncate">
                    {title} — Level {level}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-ink/5 flex items-center justify-between px-8 sticky top-0 z-40">
          <div className="flex items-center gap-8">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="text-ink/40 hover:text-ink transition-colors"
            >
              <Menu size={20} />
            </button>
            <span className="text-2xl font-serif italic text-ink hidden sm:block">GREnius.</span>
          </div>

          <div className="flex-1 max-w-xl px-8 hidden md:block">
            <div className="relative">
              <Search className="absolute left-0 top-1/2 -translate-y-1/2 text-ink/20" size={16} />
              <input 
                type="text" 
                value={globalSearch}
                onChange={(e) => {
                  setGlobalSearch(e.target.value);
                  if (e.target.value.length > 0 && activeSection !== 'vocabulary') {
                    setActiveSection('vocabulary');
                  }
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Escape') setGlobalSearch('');
                }}
                placeholder="SEARCH LEXICON..."
                className="w-full pl-8 pr-4 py-2 bg-transparent border-none text-[10px] font-sans font-bold uppercase tracking-[0.2em] focus:ring-0 placeholder:text-ink/10 transition-all"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="hidden sm:flex items-center gap-6">
              <div className="flex flex-col items-end">
                <span className="text-[8px] font-sans font-bold text-ink/30 uppercase tracking-widest">Streak</span>
                <span className="text-xs font-serif font-bold text-accent-gold">{streak.toString().padStart(2, '0')} Days</span>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-[8px] font-sans font-bold text-ink/30 uppercase tracking-widest">Experience</span>
                <span className="text-xs font-serif font-bold text-ink">{xp.toLocaleString()} XP</span>
              </div>
            </div>
            <button 
              onClick={() => setActiveSection('settings')}
              className="w-10 h-10 rounded-full border border-ink/5 flex items-center justify-center text-ink/40 hover:text-ink hover:border-ink/20 transition-all"
            >
              <SettingsIcon size={18} />
            </button>
          </div>
        </header>

        {/* Section Content */}
        <div className="flex-1 p-8 md:p-16 max-w-7xl mx-auto w-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5, ease: "circOut" }}
            >
              {renderSection()}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* Mobile Overlay */}
      {isMobile && isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-ink/40 backdrop-blur-sm z-40"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <canvas
        id="confetti-canvas"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          pointerEvents: 'none',
          zIndex: 9999,
          display: 'none'
        }}
      />
    </div>
  );
};

export default App;
