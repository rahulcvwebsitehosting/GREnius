import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { RotateCcw, Lightbulb, Maximize2, Minimize2, Flag, Play, Brain, BarChart3, SkipBack, SkipForward } from 'lucide-react';
import { Chess, Square } from 'chess.js';
import { StockfishEngine } from '../StockfishEngine';
import { posToSquare, squareToPos, getBoard, PieceType, Piece, Board, ChessPos } from '../chessUtils';
import { PIECE_IMAGES } from '../pieceSvgs';
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

function ChessBoard({ board, selected, legalMoves = [], lastMove, inCheck, animatingPiece, flipped, onSquareClick }: {
  board: Board; selected?: ChessPos | null; legalMoves?: ChessPos[];
  lastMove?: { from: ChessPos; to: ChessPos } | null; inCheck?: boolean;
  animatingPiece?: AnimatingPiece | null; flipped?: boolean;
  onSquareClick?: (row: number, col: number) => void;
}) {
  const rows = flipped ? [...board].reverse() : board;
  return (
    <div className="relative w-full aspect-square rounded-[4px] overflow-hidden shadow-[0_1px_6px_rgba(0,0,0,0.25)] select-none">
      {rows.map((rowArr, ri) => {
        const actualRow = flipped ? 7 - ri : ri;
        return (
          <div key={ri} className="flex h-[12.5%]">
            {rowArr.map((p, col) => {
              const actualCol = flipped ? 7 - col : col;
              const isLight = (actualRow + actualCol) % 2 === 0;
              const isSelected = selected?.row === actualRow && selected?.col === actualCol;
              const isLastFrom = lastMove?.from.row === actualRow && lastMove?.from.col === actualCol;
              const isLastTo = lastMove?.to.row === actualRow && lastMove?.to.col === actualCol;
              const isLegal = legalMoves.some(m => m.row === actualRow && m.col === actualCol);
              const isKingCheck = inCheck && p?.type === 'K';
              let bg = isLight ? BOARD_LIGHT : BOARD_DARK;
              if (isSelected) bg = isLight ? BOARD_LIGHT_SEL : BOARD_DARK_SEL;
              else if (isKingCheck) bg = isLight ? BOARD_LIGHT_CHECK : BOARD_DARK_CHECK;
              else if (isLastFrom || isLastTo) bg = isLight ? BOARD_LIGHT_LAST : BOARD_DARK_LAST;
              return (
                <div key={col} onClick={() => onSquareClick?.(actualRow, actualCol)}
                  className="flex-1 flex items-center justify-center relative cursor-pointer aspect-square"
                  style={{ backgroundColor: bg }}>
                  {p && <PieceImg piece={p} />}
                  {isLegal && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      {p ? (
                        <div className="w-[33%] h-[33%] rounded-full border-[3px] border-black/20" />
                      ) : (
                        <div className="w-[26%] h-[26%] rounded-full bg-black/10" />
                      )}
                    </div>
                  )}
                  {!flipped && col === 0 && (
                    <span className="absolute top-[1px] left-[2px] text-[9px] font-bold leading-none pointer-events-none"
                      style={{ color: isLight ? BOARD_DARK : BOARD_LIGHT }}>{8 - actualRow}</span>)}
                  {!flipped && actualRow === 7 && (
                    <span className="absolute bottom-[1px] right-[2px] text-[9px] font-bold leading-none pointer-events-none"
                      style={{ color: isLight ? BOARD_DARK : BOARD_LIGHT }}>{'abcdefgh'[actualCol]}</span>)}
                </div>
              );
            })}
          </div>
        );
      })}
      {animatingPiece && (
        <motion.div key={animatingPiece.id}
          className="absolute z-30 pointer-events-none flex items-center justify-center"
          style={{ width: '12.5%', height: '12.5%', top: `${animatingPiece.from.row * 12.5}%`, left: `${animatingPiece.from.col * 12.5}%` }}
          animate={{ top: `${animatingPiece.to.row * 12.5}%`, left: `${animatingPiece.to.col * 12.5}%` }}
          transition={{ duration: 0.15, ease: 'ease-in-out' }}>
          <PieceImg piece={animatingPiece.piece} />
        </motion.div>
      )}
    </div>
  );
}

function PlayerBar({ name, rating, capturedPieces }: {
  name: string; rating?: string; capturedPieces: Piece[];
}) {
  const sorted = [...capturedPieces].sort((a, b) => (PIECE_VALUES[b.type] || 0) - (PIECE_VALUES[a.type] || 0));
  return (
    <div className="flex items-center gap-2 px-2.5 py-1.5 bg-white/90 rounded-[3px] border border-gray-200/70 shadow-sm">
      <div className="shrink-0">
        <div className="w-7 h-7 rounded-full bg-gray-800 text-white flex items-center justify-center text-xs font-bold">
          {name[0]}
        </div>
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
  useEffect(() => {
    if (listRef.current) listRef.current.scrollTop = listRef.current.scrollHeight;
  }, [history.length]);

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-3 py-2 border-b border-gray-100 shrink-0">
        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Moves</span>
        {history.length > 0 && <span className="text-[11px] text-gray-400">{Math.ceil(history.length / 2)}</span>}
      </div>
      <div ref={listRef} className="flex-1 overflow-y-auto custom-scrollbar py-1">
        {history.length === 0 ? (
          <div className="flex items-center justify-center h-full py-8">
            <p className="text-xs text-gray-300">Make a move to begin</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <tbody>
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
            </tbody>
          </table>
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
  const [playerColor] = useState<'w' | 'b'>('w');
  const [gameOver, setGameOver] = useState<{ type: string; winner?: 'w' | 'b' } | null>(null);
  const [animatingPiece, setAnimatingPiece] = useState<AnimatingPiece | null>(null);
  const [mode, setMode] = useState<'play' | 'review'>('play');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showEval, setShowEval] = useState(false);
  const [flipped, setFlipped] = useState(false);
  const animIdRef = useRef(0);
  const hasInitRef = useRef(false);
  const capturedW = useRef<Piece[]>([]);
  const capturedB = useRef<Piece[]>([]);

  const lastMove = history.length > 0 ? { from: history[history.length - 1].from, to: history[history.length - 1].to } : null;
  const currentEval = evaluations.length > 0 ? evaluations[evaluations.length - 1] : 0;

  const diffToLevel: Record<Difficulty, number> = {
    'Beginner (600 Elo)': 2, 'Intermediate (1200 Elo)': 8,
    'Advanced (1800+ Elo)': 15, 'Extreme Grandmaster (2500+ Elo)': 20,
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

  const updateBoardState = useCallback((g: Chess) => {
    setBoard(getBoard(g));
    if (g.isGameOver()) {
      if (g.isCheckmate()) setGameOver({ type: 'checkmate', winner: g.turn() === 'w' ? 'b' : 'w' });
      else if (g.isStalemate()) setGameOver({ type: 'stalemate' });
      else if (g.isDraw()) setGameOver({ type: 'draw' });
      return true;
    }
    return false;
  }, []);

  const makeAIMove = useCallback(async (fen: string) => {
    const eng = engineRef.current;
    if (!eng) return;
    try {
      const moveStr = await eng.getBestMove(fen);
      if (!moveStr) return;
      const g = new Chess(fen);
      const result = g.move(moveStr, { strict: true });
      if (!result) return;
      const from = squareToPos(result.from);
      const to = squareToPos(result.to);
      const capturedPiece = result.captured
        ? { type: result.captured as PieceType, color: result.color === 'w' ? 'b' as const : 'w' as const }
        : null;
      if (capturedPiece) {
        if (result.color === 'w') capturedB.current.push(capturedPiece);
        else capturedW.current.push(capturedPiece);
      }
      const animPiece: Piece = { type: result.piece as PieceType, color: result.color as 'w' | 'b' };
      const animId = ++animIdRef.current;
      setAnimatingPiece({ id: animId, piece: animPiece, from, to });
      setTimeout(() => {
        setAnimatingPiece(null);
        setGame(g);
        updateBoardState(g);
      }, 150);
    } catch (e) { console.error('AI move error:', e); }
  }, [updateBoardState]);

  const handlePlayerMove = useCallback((row: number, col: number) => {
    if (gameOver || mode !== 'play') return;
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
      const capturedPiece = result.captured
        ? { type: result.captured as PieceType, color: result.color === 'w' ? 'b' as const : 'w' as const }
        : null;
      if (capturedPiece) {
        if (result.color === 'w') capturedB.current.push(capturedPiece);
        else capturedW.current.push(capturedPiece);
      }
      const from = squareToPos(result.from);
      const to = squareToPos(result.to);
      const piece: Piece = { type: result.piece as PieceType, color: result.color as 'w' | 'b' };
      const newFen = g.fen();
      const animId = ++animIdRef.current;
      setAnimatingPiece({ id: animId, piece, from, to });
      const moveRec: MoveRecord = {
        moveNumber: Math.floor(history.length / 2) + 1,
        player: result.color as 'w' | 'b',
        from, to, piece, captured: capturedPiece,
        san: result.san, fenBefore: game.fen(), fenAfter: newFen, evaluation: 0,
      };
      setSelected(null); setLegalMoves([]);
      setTimeout(() => {
        setAnimatingPiece(null);
        setGame(g);
        const isOver = updateBoardState(g);
        setHistory(prev => [...prev, moveRec]);
        setReviewIndex(-1);
        if (!isOver) makeAIMove(newFen);
      }, 150);
    } catch { setSelected(null); setLegalMoves([]); }
  }, [game, board, selected, playerColor, gameOver, mode, history, updateBoardState, makeAIMove]);

  const startNewGame = useCallback(() => {
    const g = new Chess();
    setGame(g); setBoard(getBoard(g));
    setSelected(null); setLegalMoves([]);
    setHistory([]); setReviewIndex(-1);
    setEvaluations([]); setGameOver(null);
    setAnimatingPiece(null); setMode('play');
    capturedW.current.length = 0; capturedB.current.length = 0;
  }, []);

  const resign = useCallback(() => setGameOver({ type: 'resign', winner: playerColor === 'w' ? 'b' : 'w' }), [playerColor]);
  const handleDraw = useCallback(() => setGameOver({ type: 'draw' }), []);

  const undoMove = useCallback(() => {
    if (history.length < 2) return;
    const g = new Chess(game.fen());
    g.undo(); g.undo();
    const gCopy = new Chess(g.fen());
    setGame(gCopy); setBoard(getBoard(gCopy));
    setHistory(prev => prev.slice(0, -2));
    setEvaluations(prev => prev.slice(0, -2));
    setGameOver(null);
    if (capturedB.current.length > 0) capturedB.current.pop();
    if (capturedW.current.length > 0) capturedW.current.pop();
  }, [history, game]);

  const getHint = useCallback(async () => {
    const eng = engineRef.current;
    if (!eng || gameOver) return;
    try {
      const moveStr = await eng.getBestMove(game.fen());
      if (moveStr) {
        const from = squareToPos(moveStr.slice(0, 2) as Square);
        if (from) {
          setSelected(from);
          const g = new Chess(game.fen());
          const moves = g.moves({ square: posToSquare(from) as Square, verbose: true });
          setLegalMoves(moves.map(m => squareToPos(m.to as Square)));
        }
      }
    } catch (e) { console.error('Hint error:', e); }
  }, [game]);

  const enterReview = useCallback(() => {
    setMode('review');
    setReviewIndex(history.length - 1);
  }, [history]);

  const selectMove = useCallback((idx: number) => {
    setMode('review');
    setReviewIndex(idx);
  }, []);

  const reviewPrev = useCallback(() => setReviewIndex(prev => Math.max(-1, prev - 1)), []);
  const reviewNext = useCallback(() => setReviewIndex(prev => Math.min(history.length - 1, prev + 1)), [history]);

  useEffect(() => {
    if (mode === 'review' && reviewIndex >= 0 && reviewIndex < history.length) {
      setBoard(getBoard(new Chess(history[reviewIndex].fenBefore)));
    } else if (mode === 'play' || reviewIndex === -1) {
      setBoard(getBoard(game));
    }
  }, [mode, reviewIndex, game, history]);

  const diffLabels: Difficulty[] = ['Beginner (600 Elo)', 'Intermediate (1200 Elo)', 'Advanced (1800+ Elo)', 'Extreme Grandmaster (2500+ Elo)'];

  return (
    <div className="max-w-[980px] mx-auto px-2 py-3">
      <div className="flex gap-3 items-start">
        <div className={`${isFullscreen ? 'fixed inset-0 z-40 bg-[#1a1a1a] flex items-center justify-center p-4' : 'flex-1 max-w-[520px]'}`}>
          <div className={`${isFullscreen ? 'w-full max-w-[min(85vh,85vw)]' : 'w-full'}`}>
            <PlayerBar name="Stockfish" rating={difficulty.match(/\d+/)?.[0]}
              capturedPieces={capturedW.current} />
            <div className="flex gap-1.5 mt-1">
              <div className="relative flex-1">
                <ChessBoard board={board} selected={selected} legalMoves={legalMoves}
                  lastMove={lastMove} inCheck={game.inCheck() && mode === 'play'}
                  animatingPiece={animatingPiece} flipped={flipped} onSquareClick={handlePlayerMove} />
                {gameOver && <GameOverModal result={gameOver} onPlayAgain={startNewGame}
                  onAnalyze={() => setShowEval(true)} onReview={enterReview} />}
              </div>
              {showEval && mode === 'play' && !gameOver && (
                <div className="w-[10px] shrink-0">
                  <EvalBar score={currentEval} />
                </div>
              )}
            </div>
            <div className="mt-1">
              <PlayerBar name="You" rating="" capturedPieces={capturedB.current} />
            </div>
            <div className="flex items-center gap-1 mt-2.5 flex-wrap justify-center">
              {mode === 'play' && !gameOver && (
                <>
                  <button onClick={() => setDifficulty(diffLabels[(diffLabels.indexOf(difficulty) + 1) % 4])}
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
                    className="flex items-center gap-1 px-2 py-1 text-xs font-semibold rounded bg-white text-gray-600 hover:bg-gray-50 border border-gray-200 transition-colors">
                    Draw
                  </button>
                  <button onClick={() => setShowEval(p => !p)}
                    className="flex items-center gap-1 px-2 py-1 text-xs font-semibold rounded bg-white text-gray-600 hover:bg-gray-50 border border-gray-200 transition-colors">
                    <BarChart3 size={13} />
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
                  <button onClick={() => { setMode('play'); setSelected(null); setLegalMoves([]); setBoard(getBoard(game)); }}
                    className="flex items-center gap-1 px-2 py-1 text-xs font-semibold rounded bg-green-50 text-green-700 hover:bg-green-100 border border-green-200 transition-colors">
                    <Play size={13} /> Play
                  </button>
                </div>
              )}
              <button onClick={() => setFlipped(p => !p)}
                className="flex items-center gap-1 px-2 py-1 text-xs font-semibold rounded bg-white text-gray-600 hover:bg-gray-50 border border-gray-200 transition-colors">
                Flip
              </button>
              <button onClick={() => setIsFullscreen(p => !p)}
                className="flex items-center gap-1 px-2 py-1 text-xs font-semibold rounded bg-white text-gray-600 hover:bg-gray-50 border border-gray-200 transition-colors">
                {isFullscreen ? <Minimize2 size={13} /> : <Maximize2 size={13} />}
              </button>
              {history.length > 0 && mode === 'play' && !gameOver && (
                <button onClick={enterReview}
                  className="flex items-center gap-1 px-2 py-1 text-xs font-semibold rounded bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 transition-colors">
                  Review
                </button>
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
