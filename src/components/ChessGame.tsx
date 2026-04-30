import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Settings as SettingsIcon, ChevronRight, Flame, Trophy, Zap, Keyboard, Menu, X, Search, BookMarked, Book, Maximize2, Minimize2, RotateCcw, Lightbulb, SkipForward, Play, Pause, FastForward, Rewind, ChevronLeft } from 'lucide-react';
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

const ChessBoard = ({ 
  board, 
  selected, 
  legalMoves = [], 
  lastMove, 
  inCheck, 
  hint, 
  onSquareClick,
  isFullscreen
}: {
  board: Board;
  selected?: ChessPos | null;
  legalMoves?: ChessPos[];
  lastMove?: { from: ChessPos; to: ChessPos } | null;
  inCheck?: boolean;
  hint?: { from?: ChessPos, to?: ChessPos, type: string } | null;
  onSquareClick?: (row: number, col: number) => void;
  isFullscreen?: boolean;
}) => {
  return (
    <div className={`border-4 border-accent-gold/40 rounded-lg overflow-hidden shadow-2xl bg-white ${isFullscreen ? 'w-full max-w-[min(90vw,75vh)] aspect-square' : 'w-full max-w-md aspect-square'}`}>
      {board.map((rowArr, row) => (
        <div key={row} className="flex h-[12.5%]">
          {rowArr.map((piece, col) => {
            const isLight = (row + col) % 2 === 0;
            const isSelected = selected?.row === row && selected?.col === col;
            const isLegal = legalMoves.some(m => m.row === row && m.col === col);
            const isLast = lastMove && ((lastMove.from.row===row&&lastMove.from.col===col)||(lastMove.to.row===row&&lastMove.to.col===col));
            const isKingInCheck = inCheck && piece?.type === 'K' && piece?.color === 'w';
            const isHintFrom = hint?.from?.row === row && hint?.from?.col === col && (hint.type === 'piece' || hint.type === 'move');
            const isHintTo = hint?.to?.row === row && hint?.to?.col === col && (hint.type === 'square' || hint.type === 'move');

            let bg = isLight ? 'bg-[#f0d9b5]' : 'bg-[#b58863]';
            if (isSelected) bg = 'bg-yellow-400';
            else if (isKingInCheck) bg = 'bg-red-400';
            else if (isLast) bg = isLight ? 'bg-yellow-200' : 'bg-yellow-600';
            else if (isHintFrom) bg = 'bg-blue-300';
            else if (isHintTo) bg = 'bg-blue-400';

            return (
              <div
                key={col}
                onClick={() => onSquareClick?.(row, col)}
                className={`flex-1 flex items-center justify-center cursor-pointer relative select-none ${bg} hover:brightness-105 transition-all aspect-square`}
              >
                {isLegal && (
                  <div className={`absolute inset-0 flex items-center justify-center ${piece ? 'ring-4 ring-inset ring-black/10' : ''}`}>
                    {!piece && <div className="w-3 h-3 rounded-full bg-black/10" />}
                  </div>
                )}
                {piece && (
                  <span className={`text-3xl sm:text-4xl md:text-5xl leading-none z-10 drop-shadow-sm ${piece.color === 'w' ? 'text-white' : 'text-black'}`} style={{
                    filter: piece.color === 'w' ? 'drop-shadow(0 0 1px black)' : 'drop-shadow(0 0 1px white)'
                  }}>
                    {PIECE_UNICODE[piece.color + piece.type]}
                  </span>
                )}
                {col === 0 && <span className={`absolute top-0.5 left-0.5 text-[8px] sm:text-[10px] font-bold ${isLight ? 'text-[#b58863]' : 'text-[#f0d9b5]'}`}>{8-row}</span>}
                {row === 7 && <span className={`absolute bottom-0.5 right-0.5 text-[8px] sm:text-[10px] font-bold ${isLight ? 'text-[#b58863]' : 'text-[#f0d9b5]'}`}>{'abcdefgh'[col]}</span>}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
};

export default function ChessGame({ onXpChange, soundEnabled, currentXp }: { onXpChange: (xp: number) => void, soundEnabled: boolean, currentXp: number }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [difficulty, setDifficulty] = useState<Difficulty>('Intermediate (1200 Elo)');
  
  const chessRef = useRef(new Chess());
  const engineRef = useRef<StockfishEngine | null>(null);

  const [board, setBoard] = useState<Board>(getBoard(chessRef.current));
  const [selected, setSelected] = useState<ChessPos | null>(null);
  const [legalMoves, setLegalMoves] = useState<ChessPos[]>([]);
  const [status, setStatus] = useState<string>('Your turn (White)');
  const [gameOver, setGameOver] = useState(false);
  const [lastMove, setLastMove] = useState<{from: ChessPos, to: ChessPos} | null>(null);
  const [capturedW, setCapturedW] = useState<Piece[]>([]);
  const [capturedB, setCapturedB] = useState<Piece[]>([]);
  const [isThinking, setIsThinking] = useState(false);
  const [history, setHistory] = useState<MoveRecord[]>([]);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [analysisLoading, setAnalysisLoading] = useState(false);
  const [hint, setHint] = useState<{ from?: ChessPos, to?: ChessPos, type: 'piece' | 'square' | 'move' } | null>(null);
  const [showHintMenu, setShowHintMenu] = useState(false);
  const [showResignConfirm, setShowResignConfirm] = useState(false);
  const [reviewIndex, setReviewIndex] = useState<number>(-1);

  useEffect(() => {
    engineRef.current = new StockfishEngine();
    return () => {
      engineRef.current?.terminate();
    };
  }, []);

  useEffect(() => {
    engineRef.current?.setDifficulty(difficulty);
  }, [difficulty]);

  useEffect(() => {
    const handleFsChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen().catch(err => console.error(err));
    } else {
      document.exitFullscreen();
    }
  };

  const updateBoardState = () => {
    setBoard(getBoard(chessRef.current));
    if (chessRef.current.isGameOver()) {
      setGameOver(true);
      if (chessRef.current.isCheckmate()) {
        setStatus(`Checkmate! ${chessRef.current.turn() === 'w' ? 'Black' : 'White'} wins.`);
      } else if (chessRef.current.isDraw()) {
        setStatus('Draw!');
      }
    } else {
      setStatus(chessRef.current.turn() === 'w' ? 'Your turn (White)' : 'AI is thinking...');
    }
  };

  const handleSquareClick = async (row: number, col: number) => {
    if (gameOver || isThinking || reviewIndex !== -1) return;

    const clickedPos = { row, col };
    const piece = board[row][col];

    if (selected) {
      if (selected.row === row && selected.col === col) {
        setSelected(null);
        setLegalMoves([]);
        return;
      }

      const move = legalMoves.find(m => m.row === row && m.col === col);
      if (move) {
        const fromSq = posToSquare(selected);
        const toSq = posToSquare(clickedPos);
        
        try {
          const fenBefore = chessRef.current.fen();
          const moveObj = chessRef.current.move({ from: fromSq, to: toSq, promotion: 'q' });
          
          if (soundEnabled) playSound('flip', soundEnabled);
          
          setLastMove({ from: selected, to: clickedPos });
          setSelected(null);
          setLegalMoves([]);
          
          if (moveObj.captured) {
            setCapturedW(prev => [...prev, { type: moveObj.captured!.toUpperCase() as PieceType, color: 'b' }]);
          }

          setHistory(prev => [...prev, {
            moveNumber: prev.length + 1,
            player: 'w',
            from: selected,
            to: clickedPos,
            piece: { type: moveObj.piece.toUpperCase() as PieceType, color: 'w' },
            captured: moveObj.captured ? { type: moveObj.captured.toUpperCase() as PieceType, color: 'b' } : null,
            fenBefore,
            fenAfter: chessRef.current.fen(),
            evaluation: 0
          }]);

          updateBoardState();
          
          if (!chessRef.current.isGameOver()) {
            makeAIMove();
          }
        } catch (e) {
          // Invalid move
          if (piece?.color === 'w') {
            setSelected(clickedPos);
            const moves = chessRef.current.moves({ square: posToSquare(clickedPos), verbose: true });
            setLegalMoves(moves.map(m => squareToPos(m.to)));
          } else {
            setSelected(null);
            setLegalMoves([]);
          }
        }
      } else if (piece?.color === 'w') {
        setSelected(clickedPos);
        const moves = chessRef.current.moves({ square: posToSquare(clickedPos), verbose: true });
        setLegalMoves(moves.map(m => squareToPos(m.to)));
      } else {
        setSelected(null);
        setLegalMoves([]);
      }
    } else {
      if (piece?.color === 'w') {
        setSelected(clickedPos);
        const moves = chessRef.current.moves({ square: posToSquare(clickedPos), verbose: true });
        setLegalMoves(moves.map(m => squareToPos(m.to)));
      }
    }
  };

  const makeAIMove = async () => {
    setIsThinking(true);
    
    try {
      if (engineRef.current) {
        const fenBefore = chessRef.current.fen();
        const bestMoveStr = await engineRef.current.getBestMove(fenBefore);
        
        if (bestMoveStr) {
          const fromSq = bestMoveStr.substring(0, 2) as Square;
          const toSq = bestMoveStr.substring(2, 4) as Square;
          const promotion = bestMoveStr.length > 4 ? bestMoveStr[4] : undefined;
          
          const moveObj = chessRef.current.move({ from: fromSq, to: toSq, promotion });
          
          if (soundEnabled) playSound('flip', soundEnabled);
          
          const fromPos = squareToPos(fromSq);
          const toPos = squareToPos(toSq);
          
          setLastMove({ from: fromPos, to: toPos });
          
          if (moveObj.captured) {
            setCapturedB(prev => [...prev, { type: moveObj.captured!.toUpperCase() as PieceType, color: 'w' }]);
          }

          setHistory(prev => [...prev, {
            moveNumber: prev.length + 1,
            player: 'b',
            from: fromPos,
            to: toPos,
            piece: { type: moveObj.piece.toUpperCase() as PieceType, color: 'b' },
            captured: moveObj.captured ? { type: moveObj.captured.toUpperCase() as PieceType, color: 'w' } : null,
            fenBefore,
            fenAfter: chessRef.current.fen(),
            evaluation: 0
          }]);
        }
      }
    } catch (error) {
      console.error('AI Move error:', error);
      setStatus('AI failed to move. Your turn.');
    } finally {
      updateBoardState();
      setIsThinking(false);
    }
  };

  const analyzeGame = async () => {
    setAnalysisLoading(true);
    setShowAnalysis(true);
    
    const newHistory = [...history];
    for (let i = 0; i < newHistory.length; i++) {
      const record = newHistory[i];
      if (record.classification) continue;
      
      if (engineRef.current) {
        const evalData = await engineRef.current.evaluatePosition(record.fenBefore, 15);
        record.evaluation = evalData.score;
        record.bestMoves = evalData.lines.map(l => ({ move: l.pv[0], val: l.score }));
        
        // Simple classification based on evaluation drop
        if (i > 0) {
          const prevEval = newHistory[i-1].evaluation;
          const diff = record.player === 'w' ? evalData.score - prevEval : prevEval - evalData.score;
          
          if (diff < -300) record.classification = 'Blunder';
          else if (diff < -100) record.classification = 'Mistake';
          else if (diff < -50) record.classification = 'Inaccuracy';
          else if (diff > 100) record.classification = 'Great';
          else record.classification = 'Good';
        } else {
          record.classification = 'Book';
        }
      }
    }
    
    setHistory(newHistory);
    setAnalysisLoading(false);
  };

  const goToNextMoveOfType = (cls: string) => {
    const indices = history
      .map((h, i) => (h.player === 'w' && h.classification === cls ? i : -1))
      .filter(i => i !== -1);
    
    if (indices.length === 0) return;

    const nextIndex = indices.find(i => i > reviewIndex) ?? indices[0];
    setReviewIndex(nextIndex);
  };

  const undoMove = () => {
    if (history.length < 2 || currentXp < 5) return;
    
    setReviewIndex(-1);
    const newHistory = history.slice(0, -2);
    const lastRecord = newHistory[newHistory.length - 1];
    
    if (lastRecord) {
      chessRef.current.load(lastRecord.fenAfter);
      setLastMove({ from: lastRecord.from, to: lastRecord.to });
    } else {
      chessRef.current.reset();
      setLastMove(null);
    }
    
    setHistory(newHistory);
    updateBoardState();
    onXpChange(-5);
  };

  const resetGame = () => {
    chessRef.current.reset();
    setHistory([]);
    setCapturedW([]);
    setCapturedB([]);
    setLastMove(null);
    setSelected(null);
    setLegalMoves([]);
    setGameOver(false);
    setReviewIndex(-1);
    setShowAnalysis(false);
    updateBoardState();
  };

  const handleHint = (type: 'piece' | 'square' | 'move') => {
    if (currentXp < 10 || gameOver) return;
    
    const moves = chessRef.current.moves({ verbose: true });
    if (moves.length === 0) return;
    
    // Simple random hint for now
    const randomMove = moves[Math.floor(Math.random() * moves.length)];
    const fromPos = squareToPos(randomMove.from);
    const toPos = squareToPos(randomMove.to);
    
    setHint({ from: fromPos, to: toPos, type });
    onXpChange(-10);
    setShowHintMenu(false);
    
    setTimeout(() => setHint(null), 2000);
  };

  // Render logic...
  return (
    <div ref={containerRef} className={`flex flex-col h-full ${isFullscreen ? 'bg-slate-900 fixed inset-0 z-50 overflow-y-auto' : ''}`}>
      <div className="flex items-center justify-between p-4 bg-white border-b sticky top-0 z-20">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-accent-gold/20 rounded-lg">
            <Brain className="w-6 h-6 text-accent-gold" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-primary-dark">Grandmaster Chess</h2>
            <p className="text-sm text-gray-500">Play against Stockfish 16.1</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value as Difficulty)}
            className="text-sm border-gray-300 rounded-md shadow-sm focus:border-accent-gold focus:ring-accent-gold"
            disabled={history.length > 0 && !gameOver}
          >
            <option>Beginner (600 Elo)</option>
            <option>Intermediate (1200 Elo)</option>
            <option>Advanced (1800+ Elo)</option>
            <option>Extreme Grandmaster (2500+ Elo)</option>
          </select>
          <button onClick={toggleFullscreen} className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg">
            {isFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
          </button>
        </div>
      </div>

      <div className={`flex-1 p-4 sm:p-6 flex flex-col lg:flex-row gap-6 ${isFullscreen ? 'max-w-7xl mx-auto w-full' : ''}`}>
        {showAnalysis ? (
          <div className="flex-1 bg-white rounded-xl shadow-sm border p-6 overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-gray-900">Game Analysis</h3>
              <button onClick={() => setShowAnalysis(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {analysisLoading ? (
              <div className="flex flex-col items-center justify-center py-20">
                <div className="w-12 h-12 border-4 border-accent-gold border-t-transparent rounded-full animate-spin mb-4" />
                <p className="text-gray-500 font-medium">Analyzing game with Stockfish...</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
                  <div className="p-4 bg-red-50 rounded-lg text-center">
                    <div className="text-2xl font-bold text-red-600">{history.filter(h => h.player === 'w' && h.classification === 'Blunder').length}</div>
                    <div className="text-sm text-red-800 font-medium">Blunders</div>
                  </div>
                  <div className="p-4 bg-orange-50 rounded-lg text-center">
                    <div className="text-2xl font-bold text-orange-600">{history.filter(h => h.player === 'w' && h.classification === 'Mistake').length}</div>
                    <div className="text-sm text-orange-800 font-medium">Mistakes</div>
                  </div>
                  <div className="p-4 bg-yellow-50 rounded-lg text-center">
                    <div className="text-2xl font-bold text-yellow-600">{history.filter(h => h.player === 'w' && h.classification === 'Inaccuracy').length}</div>
                    <div className="text-sm text-yellow-800 font-medium">Inaccuracies</div>
                  </div>
                  <div className="p-4 bg-green-50 rounded-lg text-center">
                    <div className="text-2xl font-bold text-green-600">{history.filter(h => h.player === 'w' && (h.classification === 'Great' || h.classification === 'Brilliant')).length}</div>
                    <div className="text-sm text-green-800 font-medium">Great Moves</div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-bold text-gray-900">Key Moments</h4>
                  {history.filter(h => h.player === 'w' && ['Blunder', 'Mistake', 'Inaccuracy', 'Great', 'Brilliant'].includes(h.classification || '')).map((record, i) => (
                    <div key={i} className="flex items-start gap-4 p-4 border rounded-lg hover:bg-gray-50 cursor-pointer" onClick={() => { setShowAnalysis(false); setReviewIndex(history.indexOf(record)); }}>
                      <div className={`w-2 h-full rounded-full ${
                        record.classification === 'Blunder' ? 'bg-red-500' :
                        record.classification === 'Mistake' ? 'bg-orange-500' :
                        record.classification === 'Inaccuracy' ? 'bg-yellow-500' :
                        'bg-green-500'
                      }`} />
                      <div className="flex-1">
                        <div className="flex justify-between items-center">
                          <div className="font-medium">Move {Math.ceil(record.moveNumber / 2)}: {PIECE_UNICODE[record.piece.color + record.piece.type]} {posToSquare(record.from)}-{posToSquare(record.to)}</div>
                          <div className={`text-sm font-bold ${
                            record.classification === 'Blunder' ? 'text-red-600' :
                            record.classification === 'Mistake' ? 'text-orange-600' :
                            record.classification === 'Inaccuracy' ? 'text-yellow-600' :
                            'text-green-600'
                          }`}>{record.classification}</div>
                        </div>
                        {record.bestMoves && record.bestMoves.length > 0 && record.classification && ['Blunder', 'Mistake', 'Inaccuracy'].includes(record.classification) && (
                          <div className="text-sm text-gray-500 mt-1">
                            Best move was {record.bestMoves[0].move}
                          </div>
                        )}
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-400" />
                    </div>
                  ))}
                  {history.filter(h => h.player === 'w' && ['Blunder', 'Mistake', 'Inaccuracy', 'Great', 'Brilliant'].includes(h.classification || '')).length === 0 && (
                    <div className="text-center text-gray-500 py-8">No major mistakes or brilliant moves found. Solid game!</div>
                  )}
                </div>
              </>
            )}
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center">
            <div className="w-full max-w-md mb-4 flex justify-between items-end">
              <div className="flex gap-1">
                {capturedW.map((p, i) => (
                  <span key={i} className="text-xl opacity-50">{PIECE_UNICODE[p.color + p.type]}</span>
                ))}
              </div>
              <div className="text-sm font-medium text-gray-500">Stockfish</div>
            </div>

            <ChessBoard 
              board={reviewIndex !== -1 ? getBoard(new Chess(history[reviewIndex].fenAfter)) : board}
              selected={selected}
              legalMoves={legalMoves}
              lastMove={reviewIndex !== -1 ? {from: history[reviewIndex].from, to: history[reviewIndex].to} : lastMove}
              inCheck={chessRef.current.inCheck()}
              hint={hint}
              onSquareClick={handleSquareClick}
              isFullscreen={isFullscreen}
            />

            <div className="w-full max-w-md mt-4 flex justify-between items-start">
              <div className="text-sm font-medium text-gray-900">You</div>
              <div className="flex gap-1">
                {capturedB.map((p, i) => (
                  <span key={i} className="text-xl opacity-50">{PIECE_UNICODE[p.color + p.type]}</span>
                ))}
              </div>
            </div>

            <div className="mt-6 text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-full text-sm font-medium">
                <div className={`w-2 h-2 rounded-full ${isThinking ? 'bg-yellow-500 animate-pulse' : chessRef.current.turn() === 'w' ? 'bg-green-500' : 'bg-gray-400'}`} />
                {status}
              </div>
            </div>
          </div>
        )}

        <div className="w-full lg:w-80 flex flex-col gap-4">
          {/* Controls and History */}
          <div className="bg-white rounded-xl shadow-sm border p-4 flex flex-col h-full max-h-[600px]">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-gray-900">Game History</h3>
              <div className="flex gap-2">
                <button 
                  onClick={undoMove}
                  disabled={history.length < 2 || currentXp < 5 || gameOver}
                  className="p-1.5 text-gray-500 hover:bg-gray-100 rounded disabled:opacity-50"
                  title="Undo Move (5 XP)"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => setShowHintMenu(!showHintMenu)}
                  disabled={gameOver || currentXp < 10}
                  className="p-1.5 text-gray-500 hover:bg-gray-100 rounded disabled:opacity-50 relative"
                  title="Get Hint (10 XP)"
                >
                  <Lightbulb className="w-4 h-4" />
                  {showHintMenu && (
                    <div className="absolute right-0 top-full mt-1 w-48 bg-white border rounded-lg shadow-xl z-50 py-1">
                      <button onClick={() => handleHint('piece')} className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50">Highlight Piece</button>
                      <button onClick={() => handleHint('square')} className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50">Highlight Destination</button>
                      <button onClick={() => handleHint('move')} className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50">Show Full Move</button>
                    </div>
                  )}
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto pr-2 space-y-1">
              {Array.from({ length: Math.ceil(history.length / 2) }).map((_, i) => {
                const wMove = history[i * 2];
                const bMove = history[i * 2 + 1];
                return (
                  <div key={i} className="flex text-sm">
                    <div className="w-8 text-gray-400 py-1">{i + 1}.</div>
                    <div 
                      className={`flex-1 py-1 px-2 rounded cursor-pointer ${reviewIndex === i * 2 ? 'bg-accent-gold/20 font-medium' : 'hover:bg-gray-50'}`}
                      onClick={() => setReviewIndex(i * 2)}
                    >
                      {PIECE_UNICODE[wMove.piece.color + wMove.piece.type]} {posToSquare(wMove.from)}-{posToSquare(wMove.to)}
                    </div>
                    {bMove && (
                      <div 
                        className={`flex-1 py-1 px-2 rounded cursor-pointer ${reviewIndex === i * 2 + 1 ? 'bg-accent-gold/20 font-medium' : 'hover:bg-gray-50'}`}
                        onClick={() => setReviewIndex(i * 2 + 1)}
                      >
                        {PIECE_UNICODE[bMove.piece.color + bMove.piece.type]} {posToSquare(bMove.from)}-{posToSquare(bMove.to)}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {gameOver && (
              <div className="mt-4 pt-4 border-t space-y-2">
                <button
                  onClick={analyzeGame}
                  disabled={analysisLoading}
                  className="w-full py-2 bg-accent-gold text-white rounded-lg font-medium hover:bg-accent-gold/90 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {analysisLoading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Search className="w-5 h-5" />}
                  {analysisLoading ? 'Analyzing...' : 'Analyze Game'}
                </button>
                <button
                  onClick={resetGame}
                  className="w-full py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                >
                  Play Again
                </button>
              </div>
            )}
            
            {!gameOver && history.length > 0 && (
              <div className="mt-4 pt-4 border-t">
                {showResignConfirm ? (
                  <div className="flex gap-2">
                    <button onClick={() => { setGameOver(true); setStatus('You resigned. Black wins.'); setShowResignConfirm(false); }} className="flex-1 py-2 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition-colors">Confirm</button>
                    <button onClick={() => setShowResignConfirm(false)} className="flex-1 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors">Cancel</button>
                  </div>
                ) : (
                  <button onClick={() => setShowResignConfirm(true)} className="w-full py-2 text-red-500 font-medium hover:bg-red-50 rounded-lg transition-colors">
                    Resign Game
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
