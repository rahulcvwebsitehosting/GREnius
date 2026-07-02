import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, RotateCcw, Lightbulb, X, Search, Maximize2, Minimize2, Flag, Play, Brain, BarChart3, SkipBack, SkipForward } from 'lucide-react';
import { Chess, Square } from 'chess.js';
import { StockfishEngine } from '../StockfishEngine';
import { posToSquare, squareToPos, getBoard, PIECE_UNICODE, PieceType, Piece, Board, ChessPos } from '../chessUtils';
import { playSound } from '../utils';
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
  classification?: 'Brilliant' | 'Great' | 'Best' | 'Excellent' | 'Book' | 'Inaccuracy' | 'Mistake' | 'Blunder';
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
const PieceUnicode = ({ piece, size = 'text-4xl' }: { piece: Piece; size?: string }) => {
  if (!piece) return null;
  return (
    <span className={`${size} leading-none select-none ${
      piece.color === 'w'
        ? 'text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]'
        : 'text-black drop-shadow-[0_1px_2px_rgba(0,0,0,0.3)]'
    }`}>
      {PIECE_UNICODE[piece.color + piece.type]}
    </span>
  );
};

function ChessBoard({ board, selected, legalMoves = [], lastMove, inCheck, animatingPiece, onSquareClick }: {
  board: Board; selected?: ChessPos | null; legalMoves?: ChessPos[];
  lastMove?: { from: ChessPos; to: ChessPos } | null; inCheck?: boolean;
  animatingPiece?: AnimatingPiece | null;
  onSquareClick?: (row: number, col: number) => void;
}) {
  return (
    <div className="relative w-full aspect-square rounded-sm overflow-hidden shadow-lg select-none">
      {board.map((rowArr, row) => (
        <div key={row} className="flex h-[12.5%]">
          {rowArr.map((p, col) => {
            const isLight = (row + col) % 2 === 0;
            const isSelected = selected?.row === row && selected?.col === col;
            const isLastFrom = lastMove?.from.row === row && lastMove?.from.col === col;
            const isLastTo = lastMove?.to.row === row && lastMove?.to.col === col;
            const isLegal = legalMoves.some(m => m.row === row && m.col === col);
            const isKingCheck = inCheck && p?.type === 'K';
            let bg = isLight ? BOARD_LIGHT : BOARD_DARK;
            if (isSelected) bg = isLight ? BOARD_LIGHT_SEL : BOARD_DARK_SEL;
            else if (isKingCheck) bg = isLight ? BOARD_LIGHT_CHECK : BOARD_DARK_CHECK;
            else if (isLastFrom || isLastTo) bg = isLight ? BOARD_LIGHT_LAST : BOARD_DARK_LAST;
            return (
              <div key={col} onClick={() => onSquareClick?.(row, col)}
                className="flex-1 flex items-center justify-center relative cursor-pointer aspect-square transition-colors duration-150"
                style={{ backgroundColor: bg }}>
                {isLegal && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    {p ? (
                      <div className="w-[35%] h-[35%] rounded-full border-[3px] border-black/15" />
                    ) : (
                      <div className="w-[25%] h-[25%] rounded-full bg-black/12" />
                    )}
                  </div>
                )}
                {col === 0 && (
                  <span className="absolute top-0.5 left-0.5 text-[9px] font-bold pointer-events-none"
                    style={{ color: isLight ? BOARD_DARK : BOARD_LIGHT }}>{8 - row}</span>)}
                {row === 7 && (
                  <span className="absolute bottom-0.5 right-0.5 text-[9px] font-bold pointer-events-none"
                    style={{ color: isLight ? BOARD_DARK : BOARD_LIGHT }}>{'abcdefgh'[col]}</span>)}
              </div>
            );
          })}
        </div>
      ))}
      {animatingPiece && (
        <motion.div key={animatingPiece.id}
          className="absolute z-30 pointer-events-none flex items-center justify-center"
          style={{ width: '12.5%', height: '12.5%', top: `${animatingPiece.from.row * 12.5}%`, left: `${animatingPiece.from.col * 12.5}%` }}
          animate={{ top: `${animatingPiece.to.row * 12.5}%`, left: `${animatingPiece.to.col * 12.5}%` }}
          transition={{ duration: 0.2, ease: 'ease-in-out' }}>
          <PieceUnicode piece={animatingPiece.piece} size="text-4xl" />
        </motion.div>
      )}
    </div>
  );
}

function PlayerBar({ name, rating, title, capturedPieces, materialAdvantage, isBottom, isThinking }: {
  name: string; rating?: string; title?: string; capturedPieces: Piece[];
  materialAdvantage: number; isBottom?: boolean; isThinking?: boolean;
}) {
  const sorted = [...capturedPieces].sort((a, b) => {
    const order: Record<string, number> = { Q: 9, R: 5, B: 3, N: 3, P: 1, K: 0 };
    return (order[b.type] || 0) - (order[a.type] || 0);
  });
  return (
    <div className={`flex items-center justify-between px-3 py-2 rounded-md bg-white/95 shadow-sm border border-gray-200/60`}>
      <div className="flex items-center gap-2 min-w-0">
        <div className="relative">
          <div className={`w-8 h-8 rounded-full ${
            isBottom ? 'bg-amber-100 text-amber-700' : 'bg-slate-800 text-white'
          } flex items-center justify-center text-sm font-bold`}>
            {isBottom ? 'Y' : 'S'}
          </div>
          {isThinking && (
            <div className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-blue-500 rounded-full flex items-center justify-center">
              <div className="w-1.5 h-1.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            </div>
          )}
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="text-sm font-bold text-gray-800 truncate">{name}</span>
            {title && <span className="text-[10px] text-gray-400 font-medium">{title}</span>}
          </div>
          {rating && <span className="text-[11px] text-gray-500">{rating}</span>}
        </div>
      </div>
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-0.5">
          {sorted.slice(0, 5).map((p, i) => (
            <span key={i} className="text-sm leading-none" style={{ opacity: p.color === 'b' ? 0.7 : 0.9 }}>
              {PIECE_UNICODE[p.color + p.type]}
            </span>
          ))}
          {sorted.length > 5 && <span className="text-[10px] text-gray-400 font-medium ml-0.5">+{sorted.length - 5}</span>}
        </div>
        {materialAdvantage !== 0 && (
          <span className={`text-xs font-bold px-1.5 py-0.5 rounded ${
            ((isBottom && materialAdvantage > 0) || (!isBottom && materialAdvantage < 0))
              ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
          }`}>
            {materialAdvantage > 0 ? '+' : ''}{materialAdvantage}
          </span>
        )}
      </div>
    </div>
  );
}

function MoveHistory({ history, reviewIndex, onSelectMove }: {
  history: MoveRecord[]; reviewIndex: number; onSelectMove: (idx: number) => void;
}) {
  const listRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (listRef.current) listRef.current.scrollTop = listRef.current.scrollHeight;
  }, [history.length]);

  return (
    <div className="flex-1 overflow-hidden flex flex-col">
      <div className="flex items-center justify-between px-3 py-2 border-b border-gray-100">
        <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Moves</span>
        {history.length > 0 && (
          <span className="text-[11px] text-gray-400 font-medium">{Math.ceil(history.length / 2)} moves</span>
        )}
      </div>
      <div ref={listRef} className="flex-1 overflow-y-auto custom-scrollbar py-1">
        {history.length === 0 ? (
          <div className="flex items-center justify-center h-full py-8">
            <p className="text-xs text-gray-400 italic">Make a move to begin</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <tbody>
              {Array.from({ length: Math.ceil(history.length / 2) }).map((_, i) => {
                const wMove = history[i * 2];
                const bMove = history[i * 2 + 1];
                return (
                  <tr key={i} className="hover:bg-gray-50">
                    <td className="w-8 text-[11px] text-gray-400 text-right pr-1 py-0.5 font-medium">{i + 1}.</td>
                    <td className={`py-0.5 px-2 rounded cursor-pointer text-gray-800 font-medium ${reviewIndex === i * 2 ? 'bg-blue-100 text-blue-800' : ''}`}
                      onClick={() => onSelectMove(i * 2)}>{wMove.san}</td>
                    <td className={`py-0.5 px-2 rounded cursor-pointer text-gray-800 font-medium ${reviewIndex === i * 2 + 1 ? 'bg-blue-100 text-blue-800' : ''}`}
                      onClick={() => bMove && onSelectMove(i * 2 + 1)}>{bMove?.san || ''}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

function EvalBar({ score }: { score: number }) {
  const display = (score / 100).toFixed(1);
  const pct = Math.max(0, Math.min(100, 50 + (score / 100) * 5));
  return (
    <div className="flex flex-col items-center gap-0.5">
      <span className="text-[10px] font-bold text-gray-600 tabular-nums w-10 text-center">
        {score > 0 ? '+' : ''}{display}
      </span>
      <div className="relative w-3 flex-1 bg-gray-200 rounded-full overflow-hidden border border-gray-300 min-h-[60px]">
        <motion.div className="absolute bottom-0 left-0 right-0 bg-gray-800"
          animate={{ height: `${pct}%` }} transition={{ duration: 0.3, ease: 'easeOut' }} />
      </div>
    </div>
  );
}

function GameOverModal({ result, onPlayAgain, onAnalyze, onReview }: {
  result: { type: 'checkmate' | 'stalemate' | 'resign' | 'draw' | 'timeout'; winner?: 'w' | 'b' };
  onPlayAgain: () => void; onAnalyze: () => void; onReview: () => void;
}) {
  const isWin = result.winner === 'w';
  const isLoss = result.winner === 'b';
  const isDraw = result.type === 'stalemate' || result.type === 'draw';
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <motion.div initial={{ scale: 0.85, y: 20 }} animate={{ scale: 1, y: 0 }} transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        className="bg-white rounded-xl shadow-2xl p-6 mx-4 max-w-xs w-full text-center">
        <div className="text-4xl mb-2">{isWin ? '🎉' : isDraw ? '🤝' : '😞'}</div>
        <h2 className="text-xl font-bold text-gray-800 mb-1">
          {isWin ? 'You Win!' : isLoss ? 'You Lose' : 'Draw'}
        </h2>
        <p className="text-sm text-gray-500 mb-4">
          {result.type === 'checkmate' ? 'Checkmate' : result.type === 'stalemate' ? 'Stalemate' : result.type === 'resign' ? `${isWin ? 'Opponent' : 'You'} resigned` : 'Draw agreed'}
        </p>
        <div className="flex flex-col gap-2">
          <button onClick={onPlayAgain} className="w-full py-2 px-4 bg-green-600 hover:bg-green-700 text-white text-sm font-bold rounded-lg transition-colors">
            Play Again
          </button>
          <button onClick={onAnalyze} className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-lg transition-colors">
            Analyze Game
          </button>
          <button onClick={onReview} className="w-full py-2 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-bold rounded-lg transition-colors">
            Review Board
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function ChessGame() {
  const engineRef = useRef<StockfishEngine | null>(null);
  const [game, setGame] = useState(new Chess());
  const [board, setBoard] = useState<Board>(getBoard(new Chess()));
  const [selected, setSelected] = useState<ChessPos | null>(null);
  const [legalMoves, setLegalMoves] = useState<ChessPos[]>([]);
  const [history, setHistory] = useState<MoveRecord[]>([]);
  const [reviewIndex, setReviewIndex] = useState(-1);
  const [evaluations, setEvaluations] = useState<number[]>([]);
  const [difficulty, setDifficulty] = useState<Difficulty>('Intermediate (1200 Elo)');
  const [isThinking, setIsThinking] = useState(false);
  const [playerColor] = useState<'w' | 'b'>('w');
  const [gameOver, setGameOver] = useState<{ type: 'checkmate' | 'stalemate' | 'resign' | 'draw' | 'timeout'; winner?: 'w' | 'b' } | null>(null);
  const [showPromotion, setShowPromotion] = useState(false);
  const [promotionFrom, setPromotionFrom] = useState<ChessPos | null>(null);
  const [promotionTo, setPromotionTo] = useState<ChessPos | null>(null);
  const [animatingPiece, setAnimatingPiece] = useState<AnimatingPiece | null>(null);
  const [mode, setMode] = useState<'play' | 'review' | 'analysis'>('play');
  const [analysisBoard, setAnalysisBoard] = useState<Board>(getBoard(new Chess()));
  const [analysisFen, setAnalysisFen] = useState('');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const animIdRef = useRef(0);
  const hasInitRef = useRef(false);
  const gameRef = useRef(game);
  gameRef.current = game;

  const capturedByWhite = useRef<Piece[]>([]);
  const capturedByBlack = useRef<Piece[]>([]);
  const capturedW = capturedByWhite.current;
  const capturedB = capturedByBlack.current;

  const lastMove = history.length > 0 ? { from: history[history.length - 1].from, to: history[history.length - 1].to } : null;

  const diffToLevel: Record<Difficulty, number> = {
    'Beginner (600 Elo)': 2,
    'Intermediate (1200 Elo)': 8,
    'Advanced (1800+ Elo)': 15,
    'Extreme Grandmaster (2500+ Elo)': 20,
  };

  useEffect(() => {
    if (hasInitRef.current) return;
    hasInitRef.current = true;
    const engine = new StockfishEngine();
    engineRef.current = engine;
    return () => { engine.terminate(); };
  }, []);

  useEffect(() => {
    if (engineRef.current) engineRef.current.setDifficulty(diffToLevel[difficulty]);
  }, [difficulty]);

  const getCapturedMaterial = useCallback((pieces: Piece[]) => {
    const values: Record<string, number> = { Q: 9, R: 5, B: 3, N: 3, P: 1, K: 0 };
    return pieces.reduce((sum, p) => sum + (values[p.type] || 0), 0);
  }, []);

  const materialAdvW = getCapturedMaterial(capturedW);
  const materialAdvB = getCapturedMaterial(capturedB);
  const materialAdvantage = materialAdvW - materialAdvB;

  const updateBoardState = useCallback((g: Chess) => {
    setBoard(getBoard(g));
    const inCheck = g.inCheck();
    const isOver = g.isGameOver();
    if (isOver) {
      if (g.isCheckmate()) setGameOver({ type: 'checkmate', winner: g.turn() === 'w' ? 'b' : 'w' });
      else if (g.isStalemate()) setGameOver({ type: 'stalemate' });
      else if (g.isDraw()) setGameOver({ type: 'draw' });
    }
    return { inCheck, isOver };
  }, []);

  const requestEval = useCallback(async (g: Chess) => {
    if (!engineRef.current) return;
    try {
      const evalResult = await engineRef.current.evaluatePosition(g.fen());
      setEvaluations(prev => [...prev, evalResult.score]);
    } catch { /* ignore */ }
  }, []);

  const makeAIMove = useCallback(async () => {
    if (!engineRef.current || gameRef.current.isGameOver()) return;
    setIsThinking(true);
    try {
      const fen = gameRef.current.fen();
      const moveStr = await engineRef.current.getBestMove(fen);
      if (!moveStr) { setIsThinking(false); return; }
      const g = new Chess(fen);
      const result = g.move(moveStr, { strict: true });
      if (!result) { setIsThinking(false); return; }
      const from = squareToPos(result.from);
      const to = squareToPos(result.to);
      const capturedPiece = result.captured ? { type: result.captured as PieceType, color: result.color === 'w' ? 'b' as const : 'w' as const } : null;
      if (capturedPiece) {
        if (result.color === 'w') capturedB.push(capturedPiece);
        else capturedW.push(capturedPiece);
      }
      const animPiece: Piece = { type: result.piece as PieceType, color: result.color as 'w' | 'b' };
      const animId = ++animIdRef.current;
      setAnimatingPiece({ id: animId, piece: animPiece, from, to });
      setTimeout(() => {
        setAnimatingPiece(null);
        setGame(g);
        updateBoardState(g);
        requestEval(g);
        setIsThinking(false);
      }, 200);
    } catch { setIsThinking(false); }
  }, [updateBoardState, requestEval]);

  const handlePlayerMove = useCallback((row: number, col: number) => {
    if (isThinking || gameOver || mode !== 'play') return;
    const g = new Chess(game.fen());
    if (selected === null) {
      const piece = board[row][col];
      if (!piece || piece.color !== playerColor) return;
      setSelected({ row, col });
      const moves = g.moves({ square: posToSquare({ row, col }) as Square, verbose: true });
      setLegalMoves(moves.map(m => squareToPos(m.to as Square)));
      return;
    }
    if (selected.row === row && selected.col === col) {
      setSelected(null); setLegalMoves([]);
      return;
    }
    const fromSquare = posToSquare(selected) as Square;
    const toSquare = posToSquare({ row, col }) as Square;
    try {
      const result = g.move({ from: fromSquare, to: toSquare, promotion: 'q' });
      if (!result) { setSelected(null); setLegalMoves([]); return; }
      const capturedPiece = result.captured ? { type: result.captured as PieceType, color: result.color === 'w' ? 'b' as const : 'w' as const } : null;
      if (capturedPiece) {
        if (result.color === 'w') capturedB.push(capturedPiece);
        else capturedW.push(capturedPiece);
      }
      const from = squareToPos(result.from);
      const to = squareToPos(result.to);
      const piece: Piece = { type: result.piece as PieceType, color: result.color as 'w' | 'b' };
      const animId = ++animIdRef.current;
      setAnimatingPiece({ id: animId, piece, from, to });
      const moveRec: MoveRecord = {
        moveNumber: Math.floor(history.length / 2) + 1,
        player: result.color as 'w' | 'b',
        from, to, piece, captured: capturedPiece,
        san: result.san, fenBefore: game.fen(), fenAfter: g.fen(), evaluation: 0,
      };
      setSelected(null); setLegalMoves([]);
      setTimeout(() => {
        setAnimatingPiece(null);
        setGame(g);
        const { isOver } = updateBoardState(g);
        setHistory(prev => [...prev, moveRec]);
        requestEval(g);
        setReviewIndex(-1);
        if (!isOver) makeAIMove();
      }, 200);
    } catch { setSelected(null); setLegalMoves([]); }
  }, [game, board, selected, playerColor, isThinking, gameOver, mode, history, updateBoardState, requestEval, makeAIMove]);

  const startNewGame = useCallback(() => {
    const g = new Chess();
    setGame(g);
    setBoard(getBoard(g));
    setSelected(null); setLegalMoves([]);
    setHistory([]); setReviewIndex(-1);
    setEvaluations([]); setGameOver(null);
    setAnimatingPiece(null); setMode('play');
    capturedW.length = 0; capturedB.length = 0;
  }, []);

  const resign = useCallback(() => {
    setGameOver({ type: 'resign', winner: playerColor === 'w' ? 'b' : 'w' });
  }, [playerColor]);

  const handleDraw = useCallback(() => {
    setGameOver({ type: 'draw' });
  }, []);

  const undoMove = useCallback(() => {
    if (history.length < 2 || isThinking) return;
    const g = new Chess(game.fen());
    g.undo(); g.undo();
    const gCopy = new Chess(g.fen());
    setGame(gCopy);
    setBoard(getBoard(gCopy));
    setHistory(prev => prev.slice(0, -2));
    setEvaluations(prev => prev.slice(0, -2));
    setGameOver(null);
    if (capturedW.length > 0 && history[history.length - 1].captured) capturedW.pop();
    if (capturedB.length > 0 && history[history.length - 2].captured) capturedB.pop();
  }, [history, isThinking, game]);

  const getHint = useCallback(async () => {
    if (!engineRef.current || isThinking || gameOver) return;
    setIsThinking(true);
    try {
      const moveStr = await engineRef.current.getBestMove(game.fen());
      if (moveStr) {
        const to = squareToPos(moveStr.slice(2, 4) as Square);
        const from = squareToPos(moveStr.slice(0, 2) as Square);
        if (from) {
          setSelected(from);
          const g = new Chess(game.fen());
          const moves = g.moves({ square: posToSquare(from) as Square, verbose: true });
          setLegalMoves(moves.map(m => squareToPos(m.to as Square)));
        }
      }
    } catch { /* ignore */ }
    setIsThinking(false);
  }, [isThinking, game]);

  const enterReview = useCallback(() => {
    setMode('review');
    setReviewIndex(history.length - 1);
  }, [history]);

  const reviewPrev = useCallback(() => {
    setReviewIndex(prev => Math.max(-1, prev - 1));
  }, []);

  const reviewNext = useCallback(() => {
    setReviewIndex(prev => Math.min(history.length - 1, prev + 1));
  }, [history]);

  const selectMove = useCallback((idx: number) => {
    setReviewIndex(idx);
  }, []);

  const reviewFen = reviewIndex >= 0 && reviewIndex < history.length
    ? history[reviewIndex].fenBefore
    : reviewIndex === -1
      ? game.fen() : '';

  const reviewChess = reviewFen ? new Chess(reviewFen) : game;
  const reviewBoard = reviewFen ? getBoard(reviewChess) : board;
  const reviewInCheck = reviewFen ? reviewChess.inCheck() : false;
  const reviewCheckmate = reviewFen ? reviewChess.isCheckmate() : false;
  const reviewStalemate = reviewFen ? reviewChess.isStalemate() : false;
  const reviewTurn = reviewFen ? reviewChess.turn() === 'w' : playerColor === 'w';

  useEffect(() => {
    if (mode === 'review' && reviewIndex >= 0 && reviewIndex < history.length) {
      const g = new Chess(history[reviewIndex].fenBefore);
      setBoard(getBoard(g));
    } else if (mode === 'review' && reviewIndex === -1) {
      setBoard(getBoard(game));
    } else if (mode === 'play') {
      setBoard(getBoard(game));
    }
  }, [mode, reviewIndex, game]);

  const currentEval = evaluations.length > 0 ? evaluations[evaluations.length - 1] : 0;

  return (
    <div className="max-w-7xl mx-auto px-2 py-4">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-4">
        <div className="flex gap-3">
          <div className="flex-1 max-w-[560px] mx-auto">
            <div className={`${isFullscreen ? 'fixed inset-0 z-40 bg-black/90 flex items-center justify-center p-4' : ''}`}>
              <div className={`${isFullscreen ? 'w-full max-w-[min(90vh,90vw)]' : ''}`}>
                <div className="flex items-center gap-2 mb-2">
                  <PlayerBar name="Stockfish AI" rating={difficulty.match(/\d+/)?.[0]} title="AI"
                    capturedPieces={capturedW} materialAdvantage={materialAdvantage}
                    isThinking={isThinking} />
                  <div className="w-8 shrink-0">
                    {currentEval !== 0 && mode === 'play' && !gameOver && (
                      <button onClick={() => setShowAnalysis(p => !p)}
                        className="w-full h-full flex items-center justify-center text-gray-400 hover:text-gray-600" title="Eval Bar">
                        <BarChart3 size={16} />
                      </button>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <ChessBoard board={board} selected={selected} legalMoves={legalMoves}
                      lastMove={lastMove} inCheck={game.inCheck() && mode === 'play'}
                      animatingPiece={animatingPiece} onSquareClick={handlePlayerMove} />
                    {gameOver && <GameOverModal result={gameOver} onPlayAgain={startNewGame}
                      onAnalyze={() => { setMode('analysis'); setShowAnalysis(true); }}
                      onReview={enterReview} />}
                  </div>
                  {showAnalysis && (
                    <div className="w-8 shrink-0">
                      <EvalBar score={currentEval} />
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <PlayerBar name="You" rating="" capturedPieces={capturedB} materialAdvantage={-materialAdvantage}
                    isBottom />
                </div>
                <div className="flex items-center justify-center gap-1.5 mt-3 flex-wrap">
                  {mode === 'play' && !gameOver && (
                    <>
                      <button onClick={() => { const d: Difficulty[] = ['Beginner (600 Elo)', 'Intermediate (1200 Elo)', 'Advanced (1800+ Elo)', 'Extreme Grandmaster (2500+ Elo)']; setDifficulty(d[(d.indexOf(difficulty) + 1) % d.length]); }}
                        className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-bold rounded-lg bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition-colors">
                        <Brain size={14} /> {difficulty}
                      </button>
                      <button onClick={undoMove} disabled={history.length < 2 || isThinking}
                        className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-bold rounded-lg bg-amber-50 text-amber-600 hover:bg-amber-100 disabled:opacity-40 transition-colors">
                        <RotateCcw size={14} /> Undo
                      </button>
                      <button onClick={getHint} disabled={isThinking}
                        className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-bold rounded-lg bg-sky-50 text-sky-600 hover:bg-sky-100 disabled:opacity-40 transition-colors">
                        <Lightbulb size={14} /> Hint
                      </button>
                      <button onClick={resign}
                        className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-bold rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors">
                        <Flag size={14} /> Resign
                      </button>
                      <button onClick={handleDraw}
                        className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-bold rounded-lg bg-gray-50 text-gray-600 hover:bg-gray-100 transition-colors">
                        Draw
                      </button>
                    </>
                  )}
                  {mode === 'review' && (
                    <div className="flex items-center gap-1.5">
                      <button onClick={reviewPrev} disabled={reviewIndex < 0}
                        className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-bold rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 disabled:opacity-40 transition-colors">
                        <SkipBack size={14} /> Prev
                      </button>
                      <span className="text-xs text-gray-500 font-medium px-2">
                        {reviewIndex < 0 ? 'Current' : `Move ${Math.floor(reviewIndex / 2) + 1}${reviewIndex % 2 === 0 ? 'w' : 'b'}`}
                      </span>
                      <button onClick={reviewNext} disabled={reviewIndex >= history.length - 1}
                        className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-bold rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 disabled:opacity-40 transition-colors">
                        <SkipForward size={14} /> Next
                      </button>
                      <button onClick={() => { setMode('play'); setSelected(null); setLegalMoves([]); setBoard(getBoard(game)); }}
                        className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-bold rounded-lg bg-green-50 text-green-600 hover:bg-green-100 transition-colors">
                        <Play size={14} /> Resume
                      </button>
                    </div>
                  )}
                  <button onClick={() => setIsFullscreen(p => !p)}
                    className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-bold rounded-lg bg-gray-50 text-gray-600 hover:bg-gray-100 transition-colors ml-auto">
                    {isFullscreen ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
                  </button>
                  {history.length > 0 && mode === 'play' && !gameOver && (
                    <button onClick={enterReview}
                      className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-bold rounded-lg bg-purple-50 text-purple-600 hover:bg-purple-100 transition-colors">
                      <Search size={14} /> Review
                    </button>
                  )}
                  {gameOver && (
                    <button onClick={startNewGame}
                      className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-bold rounded-lg bg-green-600 text-white hover:bg-green-700 transition-colors">
                      <Play size={14} /> New Game
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="w-[280px] shrink-0 hidden lg:flex flex-col bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            {mode === 'analysis' && showAnalysis ? (
              <div className="flex-1 overflow-hidden flex flex-col">
                <div className="flex items-center justify-between px-3 py-2 border-b border-gray-100">
                  <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Analysis Board</span>
                  <button onClick={() => setShowAnalysis(false)} className="text-gray-400 hover:text-gray-600">
                    <X size={14} />
                  </button>
                </div>
                <div className="flex-1 p-3 overflow-y-auto">
                  <p className="text-xs text-gray-500">Analysis mode active</p>
                </div>
              </div>
            ) : (
              <MoveHistory history={history} reviewIndex={reviewIndex} onSelectMove={selectMove} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
