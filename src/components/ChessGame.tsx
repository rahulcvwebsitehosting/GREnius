import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import { RotateCcw, Lightbulb, Maximize2, Minimize2, Flag, Play, Brain, BarChart3, SkipBack, SkipForward } from 'lucide-react';
import { Chess, Square } from 'chess.js';
import { posToSquare, squareToPos, getBoard, PieceType, Piece, Board, ChessPos } from '../chessUtils';
import { PIECE_IMAGES } from '../pieceSvgs';
import { getBestMove, configureStockfish, checkStockfishHealth } from '../api/stockfishClient';
import { Chessground } from 'chessground';
import { Api as CgApi } from 'chessground/api';
import { Config } from 'chessground/config';
import * as cg from 'chessground/types';

type Difficulty = 'Beginner (600 Elo)' | 'Intermediate (1200 Elo)' | 'Advanced (1800+ Elo)' | 'Extreme Grandmaster (2500+ Elo)';

interface MoveRecord {
  moveNumber: number;
  player: 'w' | 'b';
  from: ChessPos;
  to: ChessPos;
  piece: Piece;
  captured: Piece | null;
  san: string;
  fenBefore: string;
  fenAfter: string;
  evaluation: number;
}
interface AnimatingPiece {
  id: number;
  piece: Piece;
  from: ChessPos;
  to: ChessPos;
}
const BOARD_LIGHT = '#ebecd0';
const BOARD_DARK = '#779556';
const BOARD_LIGHT_LAST = '#f5f082';
const BOARD_DARK_LAST = '#bac237';
const BOARD_LIGHT_SEL = '#f6f669';
const BOARD_DARK_SEL = '#baca2b';
const BOARD_LIGHT_CHECK = '#ff6b6b';
const BOARD_DARK_CHECK = '#cc4444';
const PIECE_VALUES: Record<string, number> = { Q: 9, R: 5, B: 3.5, N: 3.5, P: 1, K: 0 };

const PIECE_ROLE: Record<string, cg.Role> = { K: 'king', Q: 'queen', R: 'rook', B: 'bishop', N: 'knight', P: 'pawn' };
const ROLE_PIECE: Record<cg.Role, string> = { king: 'K', queen: 'Q', rook: 'R', bishop: 'B', knight: 'N', pawn: 'P' };

function boardToCgPieces(board: Board): cg.Pieces {
  const pieces: cg.Pieces = new Map();
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const p = board[r][c];
      if (p) {
        const key = (String.fromCharCode(97 + c) + (8 - r)) as cg.Key;
        pieces.set(key, { role: PIECE_ROLE[p.type], color: p.color === 'w' ? 'white' : 'black' });
      }
    }
  }
  return pieces;
}

function calcDests(chess: Chess): cg.Dests {
  const dests: cg.Dests = new Map();
  const moves = chess.moves({ verbose: true });
  for (const m of moves) {
    const from = m.from as cg.Key;
    const to = m.to as cg.Key;
    if (!dests.has(from)) dests.set(from, []);
    dests.get(from)!.push(to);
  }
  return dests;
}

const PieceImg = ({ piece }: { piece: Piece }) => {
  if (!piece) return null;
  const url = PIECE_IMAGES[piece.color + piece.type];
  if (!url) return null;
  return (
    <div className="flex items-center justify-center w-full h-full">
      <img src={url} alt="" className="w-[85%] h-[85%] object-contain select-none pointer-events-none" draggable={false} />
    </div>
  );
};

function PlayerBar({ name, rating, capturedPieces }: {
  name: string; rating?: string; capturedPieces: Piece[];
}) {
  const sorted = [...capturedPieces].sort((a, b) => (PIECE_VALUES[b.type] || 0) - (PIECE_VALUES[a.type] || 0));
  return (
    <div className="flex items-center gap-2 px-2.5 py-1.5 bg-white/90 rounded-[3px] border border-gray-200/70 shadow-sm">
      <div className="shrink-0">
        <div className="w-7 h-7 rounded-full bg-gray-800 text-white flex items-center justify-center text-xs font-bold">{name[0]}</div>
      </div>
      <div className="flex items-center gap-2 min-w-0 flex-1">
        <span className="text-sm font-semibold text-gray-800 truncate">{name}</span>
        {rating && <span className="text-[11px] text-gray-500 font-medium">{rating}</span>}
      </div>
      <div className="flex items-center gap-0.5">
        {sorted.slice(0, 5).map((p, i) => (
          <span key={i} className="w-3.5 h-3.5 inline-block">
            <img src={PIECE_IMAGES[p.color + p.type]} alt="" className="w-full h-full object-contain" draggable={false} />
          </span>
        ))}
        {sorted.length > 5 && <span className="text-[10px] text-gray-400 ml-0.5">+{sorted.length - 5}</span>}
      </div>
    </div>
  );
}

function MoveHistory({ history, reviewIndex, onSelectMove }: {
  history: MoveRecord[]; reviewIndex: number; onSelectMove: (idx: number) => void;
}) {
  const listRef = useRef<HTMLDivElement>(null);
  useEffect(() => { if (listRef.current) listRef.current.scrollTop = listRef.current.scrollHeight; }, [history.length]);
  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-3 py-2 border-b border-gray-100 shrink-0">
        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Moves</span>
        {history.length > 0 && <span className="text-[11px] text-gray-400">{Math.ceil(history.length / 2)}</span>}
      </div>
      <div ref={listRef} className="flex-1 overflow-y-auto custom-scrollbar py-1">
        {history.length === 0 ? (
          <div className="flex items-center justify-center h-full py-8"><p className="text-xs text-gray-300">Make a move to begin</p></div>
        ) : (
          <table className="w-full text-sm"><tbody>
            {Array.from({ length: Math.ceil(history.length / 2) }).map((_, i) => {
              const wMove = history[i * 2];
              const bMove = history[i * 2 + 1];
              return (
                <tr key={i} className="hover:bg-gray-50">
                  <td className="w-7 text-[11px] text-gray-400 text-right pr-1 py-0.5 font-mono">{i + 1}.</td>
                  <td className={`py-0.5 px-1.5 rounded cursor-pointer font-mono text-[13px] ${reviewIndex === i * 2 ? 'bg-blue-100 text-blue-800 font-semibold' : 'text-gray-700'}`}
                    onClick={() => onSelectMove(i * 2)}>{wMove.san}</td>
                  <td className={`py-0.5 px-1.5 rounded cursor-pointer font-mono text-[13px] ${reviewIndex === i * 2 + 1 ? 'bg-blue-100 text-blue-800 font-semibold' : 'text-gray-700'}`}
                    onClick={() => bMove && onSelectMove(i * 2 + 1)}>{bMove?.san || ''}</td>
                </tr>
              );
            })}
          </tbody></table>
        )}
      </div>
    </div>
  );
}

function EvalBar({ score }: { score: number }) {
  const pct = Math.max(2, Math.min(98, 50 + (score / 100) * 4));
  return (
    <div className="flex flex-col items-center gap-1">
      <span className="text-[10px] font-bold text-gray-500 tabular-nums w-9 text-center leading-none">
        {score > 0 ? '+' : ''}{(score / 100).toFixed(1)}
      </span>
      <div className="relative w-[10px] flex-1 bg-gray-200 rounded-sm overflow-hidden border border-gray-300 min-h-[60px]">
        <motion.div className="absolute bottom-0 left-0 right-0 bg-gray-800"
          animate={{ height: `${pct}%` }} transition={{ duration: 0.3, ease: 'easeOut' }} />
      </div>
    </div>
  );
}

function GameOverModal({ result, onPlayAgain, onAnalyze, onReview }: {
  result: { type: string; winner?: 'w' | 'b' };
  onPlayAgain: () => void; onAnalyze: () => void; onReview: () => void;
}) {
  const isWin = result.winner === 'w';
  const isDraw = result.type === 'stalemate' || result.type === 'draw';
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-[2px]">
      <motion.div initial={{ scale: 0.9, y: 15 }} animate={{ scale: 1, y: 0 }} transition={{ type: 'spring', stiffness: 350, damping: 28 }}
        className="bg-white rounded-lg shadow-2xl p-5 mx-3 max-w-[260px] w-full text-center">
        <div className="text-3xl mb-1.5">{isWin ? '🎉' : isDraw ? '🤝' : '😞'}</div>
        <h2 className="text-lg font-bold text-gray-800 mb-0.5">{isWin ? 'You Win!' : isDraw ? 'Draw' : 'You Lose'}</h2>
        <p className="text-xs text-gray-400 mb-3">{result.type === 'checkmate' ? 'Checkmate' : result.type === 'stalemate' ? 'Stalemate' : result.type === 'resign' ? `${isWin ? 'Opponent resigned' : 'You resigned'}` : 'Draw'}</p>
        <div className="flex flex-col gap-1.5">
          <button onClick={onPlayAgain} className="w-full py-1.5 px-3 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold rounded-md transition-colors">Play Again</button>
          <button onClick={onAnalyze} className="w-full py-1.5 px-3 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-md transition-colors">Analyze</button>
          <button onClick={onReview} className="w-full py-1.5 px-3 bg-gray-50 hover:bg-gray-100 text-gray-600 text-sm font-semibold rounded-md transition-colors">Review</button>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function ChessGame({ onXpChange, soundEnabled, currentXp }: {
  onXpChange?: (xp: number) => void;
  soundEnabled?: boolean;
  currentXp?: number;
} = {}) {
  const gameRef = useRef(new Chess());
  const cgRef = useRef<CgApi | null>(null);
  const boardRef = useRef<HTMLDivElement>(null);
  const [board, setBoard] = useState<Board>(getBoard(gameRef.current));
  const [selected, setSelected] = useState<ChessPos | null>(null);
  const [legalMoves, setLegalMoves] = useState<ChessPos[]>([]);
  const [history, setHistory] = useState<MoveRecord[]>([]);
  const [reviewIndex, setReviewIndex] = useState(-1);
  const [evaluations, setEvaluations] = useState<number[]>([]);
  const [difficulty, setDifficulty] = useState<Difficulty>('Intermediate (1200 Elo)');
  const [playerColor] = useState<'w' | 'b'>('w');
  const [gameOver, setGameOver] = useState<{ type: string; winner?: 'w' | 'b' } | null>(null);
  const [animatingPiece, setAnimatingPiece] = useState<AnimatingPiece | null>(null);
  const [mode, setMode] = useState<'play' | 'review'>('play');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showEval, setShowEval] = useState(false);
  const [flipped, setFlipped] = useState(false);
  const [stockfishStatus, setStockfishStatus] = useState<'idle' | 'ready' | 'error'>('idle');
  const [stockfishError, setStockfishError] = useState<string | null>(null);
  const animIdRef = useRef(0);
  const capturedW = useRef<Piece[]>([]);
  const capturedB = useRef<Piece[]>([]);
  const aiBusy = useRef(false);
  const afterMoveRef = useRef<(result: any) => void>(() => {});
  const makeAIMoveRef = useRef<() => void>(() => {});
  const refreshCgBoardRef = useRef<() => void>(() => {});
  const lastMove = history.length > 0 ? { from: history[history.length - 1].from, to: history[history.length - 1].to } : null;
  const currentEval = evaluations.length > 0 ? evaluations[evaluations.length - 1] : 0;

  const buildCgConfig = useCallback(() => {
    const chess = gameRef.current;
    const turnColor = chess.turn() === 'w' ? 'white' : 'black';
    const isPlayerTurn = mode === 'play' && !gameOver && chess.turn() === playerColor;
    const lastMoveKeys: cg.Key[] | undefined = history.length > 0
      ? [posToSquare(history[history.length - 1].from) as cg.Key, posToSquare(history[history.length - 1].to) as cg.Key]
      : undefined;
    const config: Config = {
      fen: chess.fen(),
      orientation: flipped ? 'black' : 'white',
      turnColor,
      lastMove: lastMoveKeys,
      check: mode === 'play' && chess.isCheck() ? turnColor : undefined,
      movable: {
        free: false,
        color: isPlayerTurn ? (playerColor === 'w' ? 'white' : 'black') : undefined,
        dests: isPlayerTurn ? calcDests(chess) : undefined,
        showDests: true,
        rookCastle: true,
      },
      draggable: { enabled: true, showGhost: true },
      selectable: { enabled: true },
      animation: { enabled: true, duration: 200 },
      highlight: { lastMove: true, check: true },
      events: {
        select: (key: cg.Key) => {
          if (mode !== 'play' || gameOver) return;
          const col = key.charCodeAt(0) - 97;
          const row = 8 - parseInt(key[1]);
          setSelected({ row, col });
        }
      }
    };
    return config;
  }, [history, mode, gameOver, playerColor, flipped]);

  const refreshCgBoard = useCallback(() => {
    if (cgRef.current) cgRef.current.set(buildCgConfig());
  }, [buildCgConfig]);

  const afterPlayerMove = (result: any) => {
    console.log('[ChessGame] afterPlayerMove:', result.san);
    const from = squareToPos(result.from);
    const to = squareToPos(result.to);
    const captured = result.captured ? { type: result.captured.toUpperCase() as PieceType, color: result.color === 'w' ? 'b' as const : 'w' as const } : null;
    if (captured) {
      if (result.color === 'w') capturedB.current.push(captured);
      else capturedW.current.push(captured);
    }
    const piece: Piece = { type: result.piece.toUpperCase() as PieceType, color: result.color as 'w' | 'b' };
    setSelected(null); setLegalMoves([]);
    setBoard(getBoard(gameRef.current));
    setHistory(prev => [...prev, {
      moveNumber: Math.floor(prev.length / 2) + 1,
      player: result.color as 'w' | 'b', from, to, piece, captured,
      san: result.san, fenBefore: result.before || gameRef.current.fen(), fenAfter: gameRef.current.fen(), evaluation: 0,
    }]);
    setReviewIndex(-1);
    if (cgRef.current) cgRef.current.set({
      fen: gameRef.current.fen(),
      turnColor: gameRef.current.turn() === 'w' ? 'white' : 'black',
    });
    if (!gameRef.current.isGameOver()) {
      console.log('[ChessGame] Scheduling AI move in 100ms');
      setTimeout(() => makeAIMoveRef.current(), 100);
    }
  };

  const getEngineMove = (fen: string): Promise<string> => getBestMove(fen, 12);

  const makeAIMove = async () => {
    console.log('[ChessGame] makeAIMove called');
    if (aiBusy.current || gameRef.current.isGameOver()) {
      console.log('[ChessGame] makeAIMove early return: aiBusy=', aiBusy.current);
      return;
    }
    aiBusy.current = true;
    try {
      const fen = gameRef.current.fen();
      console.log('[ChessGame] Requesting AI move for FEN:', fen);
      const moveStr = await getEngineMove(fen);
      console.log('[ChessGame] AI returned:', moveStr);
      if (!moveStr) {
        console.warn('[ChessGame] AI: empty move');
        aiBusy.current = false;
        if (cgRef.current) cgRef.current.set({ fen: gameRef.current.fen(), turnColor: gameRef.current.turn() === 'w' ? 'white' : 'black' });
        return;
      }
      let result = null;
      try {
        result = gameRef.current.move(moveStr);
      } catch (moveErr) {
        console.warn('[ChessGame] AI move threw on string parse, trying as object:', moveErr);
        try {
          result = gameRef.current.move({ from: moveStr.slice(0, 2), to: moveStr.slice(2, 4), promotion: moveStr.slice(4, 5) || undefined });
        } catch (moveErr2) {
          console.error('[ChessGame] AI move parse failed:', moveErr2);
        }
      }
      if (!result) {
        console.warn('[ChessGame] AI: invalid move', moveStr);
        aiBusy.current = false;
        if (cgRef.current) cgRef.current.set({ fen: gameRef.current.fen(), turnColor: gameRef.current.turn() === 'w' ? 'white' : 'black' });
        return;
      }
      const from = squareToPos(result.from);
      const to = squareToPos(result.to);
      const captured = result.captured ? { type: result.captured.toUpperCase() as PieceType, color: result.color === 'w' ? 'b' as const : 'w' as const } : null;
      if (captured) {
        if (result.color === 'w') capturedB.current.push(captured);
        else capturedW.current.push(captured);
      }
      setHistory(prev => [...prev, {
        moveNumber: Math.floor(prev.length / 2) + 1,
        player: result.color as 'w' | 'b', from, to,
        piece: { type: result.piece.toUpperCase() as PieceType, color: result.color as 'w' | 'b' },
        captured,
        san: result.san, fenBefore: fen, fenAfter: gameRef.current.fen(), evaluation: 0,
      }]);
      setBoard(getBoard(gameRef.current));
      console.log('[ChessGame] AI move applied:', result.san);
      if (cgRef.current) cgRef.current.set({
        fen: gameRef.current.fen(),
        turnColor: gameRef.current.turn() === 'w' ? 'white' : 'black',
      });
      aiBusy.current = false;
    } catch (e) {
      console.error('[ChessGame] AI error:', e);
      aiBusy.current = false;
      if (cgRef.current) cgRef.current.set({ fen: gameRef.current.fen() });
    }
  };

  const checkStockfish = useCallback(async () => {
    try {
      setStockfishStatus('idle');
      const health = await checkStockfishHealth();
      if (health.status.ready) {
        setStockfishStatus('ready');
        setStockfishError(null);
      } else {
        setStockfishStatus('error');
        setStockfishError('Stockfish engine not ready');
      }
    } catch (err) {
      setStockfishStatus('error');
      setStockfishError(err instanceof Error ? err.message : String(err));
    }
  }, []);

  useEffect(() => {
    checkStockfishHealth().then(health => {
      if (health?.status?.ready) {
        const level = { 'Beginner (600 Elo)': 2, 'Intermediate (1200 Elo)': 8, 'Advanced (1800+ Elo)': 15, 'Extreme Grandmaster (2500+ Elo)': 20 }[difficulty];
        configureStockfish(level).then(success => {
          if (success) checkStockfish();
        });
      } else {
        setStockfishStatus('error');
        setStockfishError('Server not available');
      }
    }).catch(err => {
      setStockfishStatus('error');
      setStockfishError(err instanceof Error ? err.message : String(err));
    });
  }, []);

  useEffect(() => {
    console.log('[ChessGame] Mount: initializing chessground');
    if (boardRef.current && !cgRef.current) {
      cgRef.current = Chessground(boardRef.current, {
        fen: 'start',
        movable: {
          free: false,
          color: 'white',
          showDests: true,
          rookCastle: true,
          events: {
            after: (orig: cg.Key, dest: cg.Key) => {
              console.log('[ChessGame] chessground after fired:', orig, '->', dest);
              if (aiBusy.current) { console.log('[ChessGame] after skipped: aiBusy'); return; }
              try {
                const result = gameRef.current.move({ from: orig, to: dest, promotion: 'q' });
                if (!result) { console.log('[ChessGame] chess.move failed'); return; }
                console.log('[ChessGame] Player move applied:', result.san);
                afterMoveRef.current(result);
              } catch(e) { console.error('[ChessGame] after error:', e); }
            }
          }
        },
        draggable: { enabled: true, showGhost: true },
        selectable: { enabled: true },
        animation: { enabled: true, duration: 200 },
        highlight: { lastMove: true, check: true },
      });
      console.log('[ChessGame] Chessground initialized');
    }
    return () => {
      console.log('[ChessGame] Cleanup: destroying chessground');
      if (cgRef.current) { cgRef.current.destroy(); cgRef.current = null; }
    };
  }, []);

  useEffect(() => { refreshCgBoard(); }, [refreshCgBoard]);

  const handleSquareClick = (row: number, col: number) => {
    if (gameOver || mode !== 'play' || aiBusy.current) return;
    const cg = cgRef.current;
    if (!cg) return;
    const key = (String.fromCharCode(97 + col) + (8 - row)) as cg.Key;
    const piece = getBoard(gameRef.current)[row][col];
    if (selected === null) {
      if (!piece || piece.color !== playerColor) return;
      setSelected({ row, col });
      const moves = gameRef.current.moves({ square: key as Square, verbose: true });
      setLegalMoves(moves.map(m => squareToPos(m.to as Square)));
    } else {
      if (selected.row === row && selected.col === col) { setSelected(null); setLegalMoves([]); return; }
      const fromSquare = posToSquare(selected) as Square;
      const toSquare = posToSquare({ row, col }) as Square;
      const result = gameRef.current.move({ from: fromSquare, to: toSquare, promotion: 'q' });
      if (!result) { setSelected(null); setLegalMoves([]); return; }
      afterPlayerMove(result);
    }
  };

  const startNewGame = useCallback(() => {
    gameRef.current = new Chess();
    capturedW.current.length = 0; capturedB.current.length = 0;
    setBoard(getBoard(gameRef.current));
    setSelected(null); setLegalMoves([]);
    setHistory([]); setReviewIndex(-1);
    setEvaluations([]); setGameOver(null);
    setAnimatingPiece(null); setMode('play');
    setTimeout(() => refreshCgBoard(), 50);
  }, [refreshCgBoard]);

  const resign = useCallback(() => setGameOver({ type: 'resign', winner: playerColor === 'w' ? 'b' : 'w' }), [playerColor]);
  const handleDraw = useCallback(() => setGameOver({ type: 'draw' }), []);

  const undoMove = useCallback(() => {
    if (history.length < 2) return;
    gameRef.current.undo(); gameRef.current.undo();
    capturedB.current.pop(); capturedW.current.pop();
    setBoard(getBoard(gameRef.current));
    setHistory(prev => prev.slice(0, -2));
    setEvaluations(prev => prev.slice(0, -2));
    setGameOver(null);
    refreshCgBoard();
  }, [history, refreshCgBoard]);

  const getHint = useCallback(async () => {
    if (gameOver || aiBusy.current) return;
    try {
      const moveStr = await getEngineMove(gameRef.current.fen());
      if (moveStr) {
        const from = squareToPos(moveStr.slice(0, 2) as Square);
        if (from) {
          setSelected(from);
          const moves = gameRef.current.moves({ square: posToSquare(from) as Square, verbose: true });
          setLegalMoves(moves.map(m => squareToPos(m.to as Square)));
        }
      }
    } catch (e) { console.error('Hint error:', e); }
  }, []);

  const enterReview = useCallback(() => { setMode('review'); setReviewIndex(history.length - 1); }, [history]);
  const selectMove = useCallback((idx: number) => { setMode('review'); setReviewIndex(idx); }, []);
  const reviewPrev = useCallback(() => setReviewIndex(prev => Math.max(-1, prev - 1)), []);
  const reviewNext = useCallback(() => setReviewIndex(prev => Math.min(history.length - 1, prev + 1)), [history]);

  useEffect(() => {
    if (mode === 'review' && reviewIndex >= 0 && reviewIndex < history.length) {
      const g = new Chess(history[reviewIndex].fenBefore);
      setBoard(getBoard(g));
      if (cgRef.current) cgRef.current.set({ fen: history[reviewIndex].fenBefore });
    } else if (mode === 'play' || reviewIndex === -1) {
      setBoard(getBoard(gameRef.current));
      refreshCgBoard();
    }
  }, [mode, reviewIndex, history, refreshCgBoard]);

  const diffLabels: Difficulty[] = ['Beginner (600 Elo)', 'Intermediate (1200 Elo)', 'Advanced (1800+ Elo)', 'Extreme Grandmaster (2500+ Elo)'];

  // Keep refs in sync for async chessground callbacks
  afterMoveRef.current = afterPlayerMove;
  makeAIMoveRef.current = makeAIMove;

  return (
    <div className="max-w-[980px] mx-auto px-2 py-3">
      <div className="flex gap-3 items-start">
        <div className={`${isFullscreen ? 'fixed inset-0 z-40 bg-[#1a1a1a] flex items-center justify-center p-4' : 'flex-1 max-w-[520px]'}`}>
          <div className={`${isFullscreen ? 'w-full max-w-[min(85vh,85vw)]' : 'w-full'}`}>
            <PlayerBar name="Stockfish" rating={difficulty.match(/\d+/)?.[0]} capturedPieces={capturedW.current} />
            <div className="flex gap-1.5 mt-1">
              <div className="relative flex-1">
                <div ref={boardRef} className="cg-wrap w-full aspect-square" style={{ minHeight: 320 }} />
                {gameOver && <GameOverModal result={gameOver} onPlayAgain={startNewGame}
                  onAnalyze={() => setShowEval(true)} onReview={enterReview} />}
              </div>
              {showEval && mode === 'play' && !gameOver && (
                <div className="w-[10px] shrink-0"><EvalBar score={currentEval} /></div>
              )}
            </div>
            <div className="mt-1"><PlayerBar name="You" rating="" capturedPieces={capturedB.current} /></div>
            <div className="flex items-center gap-1 mt-2.5 flex-wrap justify-center">
              {mode === 'play' && !gameOver && (
                <>
                  <button onClick={() => {
                    const next = diffLabels[(diffLabels.indexOf(difficulty) + 1) % 4];
                    setDifficulty(next);
                    const level = { 'Beginner (600 Elo)': 2, 'Intermediate (1200 Elo)': 8, 'Advanced (1800+ Elo)': 15, 'Extreme Grandmaster (2500+ Elo)': 20 }[next];
                    configureStockfish(level).then(success => {
                      if (success) checkStockfish();
                    });
                  }}
                    className="flex items-center gap-1 px-2 py-1 text-xs font-semibold rounded bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200 transition-colors">
                    <Brain size={13} /> {difficulty}
                  </button>
                  <button onClick={undoMove} disabled={history.length < 2}
                    className="flex items-center gap-1 px-2 py-1 text-xs font-semibold rounded bg-white text-gray-600 hover:bg-gray-50 border border-gray-200 disabled:opacity-30 transition-colors">
                    <RotateCcw size={13} /> Undo
                  </button>
                  <button onClick={getHint}
                    className="flex items-center gap-1 px-2 py-1 text-xs font-semibold rounded bg-white text-gray-600 hover:bg-gray-50 border border-gray-200 transition-colors">
                    <Lightbulb size={13} /> Hint
                  </button>
                  <button onClick={resign}
                    className="flex items-center gap-1 px-2 py-1 text-xs font-semibold rounded bg-white text-red-500 hover:bg-red-50 border border-gray-200 transition-colors">
                    <Flag size={13} /> Resign
                  </button>
                  <button onClick={handleDraw}
                    className="flex items-center gap-1 px-2 py-1 text-xs font-semibold rounded bg-white text-gray-600 hover:bg-gray-50 border border-gray-200 transition-colors">Draw</button>
                  <button onClick={() => setShowEval(p => !p)}
                    className="flex items-center gap-1 px-2 py-1 text-xs font-semibold rounded bg-white text-gray-600 hover:bg-gray-50 border border-gray-200 transition-colors">
                    <BarChart3 size={13} />
                  </button>
                  <button onClick={checkStockfish}
                    className="flex items-center gap-1 px-2 py-1 text-xs font-semibold rounded bg-white text-gray-600 hover:bg-gray-50 border border-gray-200 transition-colors" title="Check Stockfish status">
                    {stockfishStatus === 'ready' ? (
                      <span className="text-green-500">●</span>
                    ) : stockfishStatus === 'error' ? (
                      <span className="text-red-500">●</span>
                    ) : (
                      <span className="text-yellow-500">●</span>
                    )}
                    Stockfish
                  </button>
                </>
              )}
              {mode === 'review' && (
                <div className="flex items-center gap-1">
                  <button onClick={reviewPrev} disabled={reviewIndex < 0}
                    className="flex items-center gap-1 px-2 py-1 text-xs font-semibold rounded bg-white text-gray-600 hover:bg-gray-50 border border-gray-200 disabled:opacity-30 transition-colors">
                    <SkipBack size={13} />
                  </button>
                  <span className="text-xs text-gray-500 font-medium px-2 min-w-[60px] text-center">
                    {reviewIndex < 0 ? 'Current' : `${Math.floor(reviewIndex / 2) + 1}${reviewIndex % 2 === 0 ? '. ' : '... '}${reviewIndex % 2 === 0 ? 'White' : 'Black'}`}
                  </span>
                  <button onClick={reviewNext} disabled={reviewIndex >= history.length - 1}
                    className="flex items-center gap-1 px-2 py-1 text-xs font-semibold rounded bg-white text-gray-600 hover:bg-gray-50 border border-gray-200 disabled:opacity-30 transition-colors">
                    <SkipForward size={13} />
                  </button>
                  <button onClick={() => { setMode('play'); setSelected(null); setLegalMoves([]); refreshCgBoard(); }}
                    className="flex items-center gap-1 px-2 py-1 text-xs font-semibold rounded bg-green-50 text-green-700 hover:bg-green-100 border border-green-200 transition-colors">
                    <Play size={13} /> Play
                  </button>
                </div>
              )}
              <button onClick={() => { setFlipped(p => !p); refreshCgBoard(); }}
                className="flex items-center gap-1 px-2 py-1 text-xs font-semibold rounded bg-white text-gray-600 hover:bg-gray-50 border border-gray-200 transition-colors">Flip</button>
              <button onClick={() => setIsFullscreen(p => !p)}
                className="flex items-center gap-1 px-2 py-1 text-xs font-semibold rounded bg-white text-gray-600 hover:bg-gray-50 border border-gray-200 transition-colors">
                {isFullscreen ? <Minimize2 size={13} /> : <Maximize2 size={13} />}
              </button>
              {history.length > 0 && mode === 'play' && !gameOver && (
                <button onClick={enterReview}
                  className="flex items-center gap-1 px-2 py-1 text-xs font-semibold rounded bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 transition-colors">Review</button>
              )}
              {gameOver && (
                <button onClick={startNewGame}
                  className="flex items-center gap-1 px-3 py-1 text-xs font-semibold rounded bg-green-600 text-white hover:bg-green-700 transition-colors">
                  <Play size={13} /> New Game
                </button>
              )}
            </div>
          </div>
        </div>
        <div className="w-[220px] shrink-0 hidden lg:flex flex-col bg-white rounded-[3px] border border-gray-200 shadow-sm overflow-hidden" style={{ height: 'min(520px, calc(100vh - 80px))' }}>
          <MoveHistory history={history} reviewIndex={reviewIndex} onSelectMove={selectMove} />
        </div>
      </div>
    </div>
  );
}