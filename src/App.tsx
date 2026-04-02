/**
 * Master the GRE
 */

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
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
  Book,
  ChevronDown,
  CheckCircle2,
  Clock,
  ArrowRight,
  Trash2,
  Target,
  Volume2,
  Medal,
  Maximize2,
  Lightbulb,
  RotateCcw,
  BarChart2,
  ChevronLeft,
  Info,
  AlertTriangle,
  Newspaper,
  Globe,
  Linkedin,
  ExternalLink
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { GameAnalysis } from './components/GameAnalysis';
import MathCheatSheet from './components/MathCheatSheet';
import MentalMath from './components/MentalMath';
import QuantitativeNotes from './components/QuantitativeNotes';
import { NewsContainer } from './components/news/NewsContainer';
import { playSound, fireConfetti, getStorage, setStorage, XP_REWARDS, LEVELS, STORAGE_KEYS, getLevelInfo, awardXP, updateStreak, recordQuizResult, getDailyChallenge, getDailyChallengeKey, hasDoneToday, markDailyDone, getUserStats, incrementStat } from './utils';
import { ALL_GRE_WORDS, GRE_QUANT, GRE_VERBAL, ETYMOLOGY_ROOTS, ACHIEVEMENTS, WORLD_DAYS } from './data';
import { QuizResult, UserSettings, Word, Achievement, UserStats, WorldDay, Mistake } from './types';
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

        <div className="pt-16 border-t border-ink/5">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-2">
              <label className="text-[10px] font-sans font-bold text-ink/40 uppercase tracking-[0.2em]">Project Genesis</label>
              <p className="text-xs font-sans text-ink/30 italic leading-relaxed">The engineering mind behind this cognitive environment.</p>
            </div>
            <div className="md:col-span-2">
              <motion.a 
                href="https://www.linkedin.com/in/rahulshyamcivil/"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                className="group relative block overflow-hidden rounded-sm border border-ink/10 bg-bg-primary p-0 transition-all hover:border-accent-gold/40 hover:shadow-2xl hover:shadow-accent-gold/10"
              >
                {/* Blueprint Grid Background */}
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
                     style={{ backgroundImage: 'radial-gradient(circle, currentColor 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
                
                <div className="relative p-6 md:p-8 flex flex-col md:flex-row items-center md:items-stretch gap-0">
                  {/* Left Section: Identity */}
                  <div className="flex-1 flex items-center gap-4 md:gap-6 pb-6 md:pb-0 md:pr-8 md:border-r md:border-ink/5">
                    <div className="relative">
                      <div className="w-16 h-16 md:w-20 md:h-20 rounded-sm bg-ink text-bg-primary flex items-center justify-center font-serif text-2xl md:text-3xl font-bold relative z-10">
                        RS
                      </div>
                      {/* Technical Measurement Lines */}
                      <div className="absolute -top-2 -left-2 w-4 h-[1px] bg-accent-gold/40" />
                      <div className="absolute -top-2 -left-2 w-[1px] h-4 bg-accent-gold/40" />
                      <div className="absolute -bottom-2 -right-2 w-4 h-[1px] bg-accent-gold/40" />
                      <div className="absolute -bottom-2 -right-2 w-[1px] h-4 bg-accent-gold/40" />
                    </div>
                    
                    <div className="space-y-1">
                      <h3 className="text-2xl md:text-3xl font-serif font-bold text-ink tracking-tight group-hover:text-accent-gold transition-colors">Rahul S</h3>
                      <div className="flex items-center gap-2">
                        <span className="h-[1px] w-4 bg-accent-gold/30" />
                        <p className="text-[9px] md:text-[10px] font-sans font-bold text-ink/40 uppercase tracking-[0.2em] md:tracking-[0.3em]">Civil Engineer & Developer</p>
                      </div>
                    </div>
                  </div>

                  {/* Right Section: Interactive Button */}
                  <div className="w-full md:w-auto flex items-center justify-center md:pl-8 pt-8 md:pt-0 border-t md:border-t-0 border-ink/5">
                    <div className="relative group/btn">
                      <div className="absolute -inset-4 bg-accent-gold/5 rounded-full scale-0 group-hover/btn:scale-100 transition-transform duration-500" />
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-14 h-14 rounded-full border border-ink/10 flex items-center justify-center text-ink group-hover/btn:border-accent-gold group-hover/btn:text-accent-gold transition-all duration-300 group-hover/btn:rotate-12">
                          <Linkedin size={24} strokeWidth={1.5} />
                        </div>
                        <div className="flex items-center gap-2 overflow-hidden h-4">
                          <span className="text-[9px] font-sans font-black uppercase tracking-[0.2em] text-ink/30 group-hover/btn:text-accent-gold transition-colors whitespace-nowrap">
                            Establish Connection
                          </span>
                          <ArrowRight size={10} className="text-accent-gold opacity-0 -translate-x-4 group-hover/btn:opacity-100 group-hover/btn:translate-x-0 transition-all" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bottom Technical Bar */}
                <div className="h-1 w-full bg-ink/5 relative overflow-hidden">
                  <motion.div 
                    initial={{ x: '-100%' }}
                    whileHover={{ x: '100%' }}
                    transition={{ duration: 1.5, ease: "easeInOut" }}
                    className="absolute inset-0 bg-accent-gold/40"
                  />
                </div>
              </motion.a>
            </div>
          </div>
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
    <div className="space-y-8 md:space-y-16 max-w-5xl animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="max-w-3xl">
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-serif font-bold text-ink leading-[0.9] mb-6 md:mb-8">
          Scholarly<br />Progression.
        </h1>
        <p className="text-lg md:text-xl font-sans text-ink/60 leading-relaxed max-w-2xl">
          An analytical breakdown of your academic milestones. 
          Your current standing reflects a disciplined approach to the Digital Lexicon.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 border-y border-ink/5 py-8 md:py-12">
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
                const totalInCategory = ALL_GRE_WORDS.filter(w => w.category === cat).length;
                const masteredInCategory = ALL_GRE_WORDS.filter(w => w.category === cat && masteredWords.includes(w.id)).length;
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

type PieceType = 'K'|'Q'|'R'|'B'|'N'|'P';
type Piece = { type: PieceType, color: 'w'|'b' } | null;
type Board = Piece[][];
type ChessPos = { row: number; col: number };

interface CastlingRights {
  w: { k: boolean; q: boolean };
  b: { k: boolean; q: boolean };
}

interface GameState {
  board: Board;
  turn: 'w'|'b';
  castling: CastlingRights;
  enPassant: ChessPos | null;
  halfMoveClock: number;
  fullMoveNumber: number;
}

const INIT_BOARD: Board = (() => {
  const b: Board = Array(8).fill(null).map(() => Array(8).fill(null));
  const order: PieceType[] = ['R','N','B','Q','K','B','N','R'];
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

const PIECE_VALUES: Record<PieceType, number> = {
  P: 100, N: 320, B: 330, R: 500, Q: 900, K: 20000
};

// Piece-Square Tables (PST) - from perspective of white. Black uses mirrored.
const PST: Record<PieceType, number[][]> = {
  P: [
    [0,  0,  0,  0,  0,  0,  0,  0],
    [50, 50, 50, 50, 50, 50, 50, 50],
    [10, 10, 20, 30, 30, 20, 10, 10],
    [5,  5, 10, 25, 25, 10,  5,  5],
    [0,  0,  0, 20, 20,  0,  0,  0],
    [5, -5,-10,  0,  0,-10, -5,  5],
    [5, 10, 10,-20,-20, 10, 10,  5],
    [0,  0,  0,  0,  0,  0,  0,  0]
  ],
  N: [
    [-50,-40,-30,-30,-30,-30,-40,-50],
    [-40,-20,  0,  0,  0,  0,-20,-40],
    [-30,  0, 10, 15, 15, 10,  0,-30],
    [-30,  5, 15, 20, 20, 15,  5,-30],
    [-30,  0, 15, 20, 20, 15,  0,-30],
    [-30,  5, 10, 15, 15, 10,  5,-30],
    [-40,-20,  0,  5,  5,  0,-20,-40],
    [-50,-40,-30,-30,-30,-30,-40,-50]
  ],
  B: [
    [-20,-10,-10,-10,-10,-10,-10,-20],
    [-10,  0,  0,  0,  0,  0,  0,-10],
    [-10,  0,  5, 10, 10,  5,  0,-10],
    [-10,  5,  5, 10, 10,  5,  5,-10],
    [-10,  0, 10, 10, 10, 10,  0,-10],
    [-10, 10, 10, 10, 10, 10, 10,-10],
    [-10,  5,  0,  0,  0,  0,  5,-10],
    [-20,-10,-10,-10,-10,-10,-10,-20]
  ],
  R: [
    [0,  0,  0,  0,  0,  0,  0,  0],
    [5, 10, 10, 10, 10, 10, 10,  5],
    [-5,  0,  0,  0,  0,  0,  0, -5],
    [-5,  0,  0,  0,  0,  0,  0, -5],
    [-5,  0,  0,  0,  0,  0,  0, -5],
    [-5,  0,  0,  0,  0,  0,  0, -5],
    [-5,  0,  0,  0,  0,  0,  0, -5],
    [0,  0,  0,  5,  5,  0,  0,  0]
  ],
  Q: [
    [-20,-10,-10, -5, -5,-10,-10,-20],
    [-10,  0,  0,  0,  0,  0,  0,-10],
    [-10,  0,  5,  5,  5,  5,  0,-10],
    [-5,  0,  5,  5,  5,  5,  0, -5],
    [0,  0,  5,  5,  5,  5,  0, -5],
    [-10,  5,  5,  5,  5,  5,  0,-10],
    [-10,  0,  5,  0,  0,  0,  0,-10],
    [-20,-10,-10, -5, -5,-10,-10,-20]
  ],
  K: [
    [-30,-40,-40,-50,-50,-40,-40,-30],
    [-30,-40,-40,-50,-50,-40,-40,-30],
    [-30,-40,-40,-50,-50,-40,-40,-30],
    [-30,-40,-40,-50,-50,-40,-40,-30],
    [-20,-30,-30,-40,-40,-30,-30,-20],
    [-10,-20,-20,-20,-20,-20,-20,-10],
    [20, 20,  0,  0,  0,  0, 20, 20],
    [20, 30, 10,  0,  0, 10, 30, 20]
  ]
};

function cloneBoard(b: Board): Board {
  return b.map(row => row.map(p => p ? {...p} : null));
}

function isInBounds(r: number, c: number): boolean {
  return r >= 0 && r < 8 && c >= 0 && c < 8;
}

function getPseudoLegalMoves(state: GameState, row: number, col: number): ChessPos[] {
  const { board, turn, castling, enPassant } = state;
  const piece = board[row][col];
  if (!piece || piece.color !== turn) return [];
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
    if (addIfValid(row + dir, col, false, true)) {
      const startRow = color === 'w' ? 6 : 1;
      if (row === startRow) addIfValid(row + 2 * dir, col, false, true);
    }
    [-1, 1].forEach(dc => {
      const tr = row + dir, tc = col + dc;
      if (isInBounds(tr, tc)) {
        if (board[tr][tc]?.color === enemy) moves.push({ row: tr, col: tc });
        else if (enPassant && enPassant.row === tr && enPassant.col === tc) moves.push({ row: tr, col: tc });
      }
    });
  } else if (type === 'N') {
    [[-2,-1],[-2,1],[-1,-2],[-1,2],[1,-2],[1,2],[2,-1],[2,1]].forEach(([dr,dc]) => addIfValid(row+dr, col+dc));
  } else if (type === 'B') {
    [[-1,-1],[-1,1],[1,-1],[1,1]].forEach(([dr,dc]) => slide(dr,dc));
  } else if (type === 'R') {
    [[-1,0],[1,0],[0,-1],[0,1]].forEach(([dr,dc]) => slide(dr,dc));
  } else if (type === 'Q') {
    [[-1,-1],[-1,1],[1,-1],[1,1],[-1,0],[1,0],[0,-1],[0,1]].forEach(([dr,dc]) => slide(dr,dc));
  } else if (type === 'K') {
    [[-1,-1],[-1,0],[-1,1],[0,-1],[0,1],[1,-1],[1,0],[1,1]].forEach(([dr,dc]) => addIfValid(row+dr, col+dc));
    
    // Castling
    if (!isInCheck(board, color)) {
      const rights = castling[color];
      if (rights.k) {
        if (!board[row][col+1] && !board[row][col+2] && !isSquareAttacked(board, row, col+1, enemy)) {
          moves.push({ row, col: col+2 });
        }
      }
      if (rights.q) {
        if (!board[row][col-1] && !board[row][col-2] && !board[row][col-3] && !isSquareAttacked(board, row, col-1, enemy)) {
          moves.push({ row, col: col-2 });
        }
      }
    }
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
  const dir = byColor === 'w' ? 1 : -1;
  // Pawn attacks
  for (const dc of [-1, 1]) {
    const pr = row + dir, pc = col + dc;
    if (isInBounds(pr, pc) && board[pr][pc]?.type === 'P' && board[pr][pc]?.color === byColor) return true;
  }
  // Knight attacks
  const nMoves = [[-2,-1],[-2,1],[-1,-2],[-1,2],[1,-2],[1,2],[2,-1],[2,1]];
  for (const [dr, dc] of nMoves) {
    const nr = row + dr, nc = col + dc;
    if (isInBounds(nr, nc) && board[nr][nc]?.type === 'N' && board[nr][nc]?.color === byColor) return true;
  }
  // Sliding pieces
  const dirs = [[-1,-1],[-1,1],[1,-1],[1,1],[-1,0],[1,0],[0,-1],[0,1]];
  for (let i = 0; i < 8; i++) {
    const [dr, dc] = dirs[i];
    let r = row + dr, c = col + dc;
    while (isInBounds(r, c)) {
      const p = board[r][c];
      if (p) {
        if (p.color === byColor) {
          if (i < 4 && (p.type === 'B' || p.type === 'Q')) return true;
          if (i >= 4 && (p.type === 'R' || p.type === 'Q')) return true;
          if (Math.abs(r-row) <= 1 && Math.abs(c-col) <= 1 && p.type === 'K') return true;
        }
        break;
      }
      r += dr; c += dc;
    }
  }
  return false;
}

function isInCheck(board: Board, color: 'w'|'b'): boolean {
  const king = findKing(board, color);
  if (!king) return false;
  return isSquareAttacked(board, king.row, king.col, color === 'w' ? 'b' : 'w');
}

function performMove(state: GameState, from: ChessPos, to: ChessPos, promotion: PieceType = 'Q'): GameState {
  const nb = cloneBoard(state.board);
  const piece = nb[from.row][from.col]!;
  const newCastling = { w: { ...state.castling.w }, b: { ...state.castling.b } };
  let newEnPassant: ChessPos | null = null;

  // Handle Castling
  if (piece.type === 'K') {
    if (Math.abs(from.col - to.col) === 2) {
      const isKingside = to.col > from.col;
      const rookFromCol = isKingside ? 7 : 0;
      const rookToCol = isKingside ? 5 : 3;
      nb[from.row][rookToCol] = nb[from.row][rookFromCol];
      nb[from.row][rookFromCol] = null;
    }
    newCastling[piece.color].k = false;
    newCastling[piece.color].q = false;
  }

  // Handle Rook movement for castling rights
  if (piece.type === 'R') {
    if (from.col === 0) newCastling[piece.color].q = false;
    if (from.col === 7) newCastling[piece.color].k = false;
  }
  // Handle Rook capture for castling rights
  const target = state.board[to.row][to.col];
  if (target?.type === 'R') {
    const enemy = piece.color === 'w' ? 'b' : 'w';
    if (to.col === 0) newCastling[enemy].q = false;
    if (to.col === 7) newCastling[enemy].k = false;
  }

  // Handle Pawn logic
  if (piece.type === 'P') {
    // En Passant capture
    if (state.enPassant && to.row === state.enPassant.row && to.col === state.enPassant.col) {
      nb[from.row][to.col] = null;
    }
    // Set En Passant target
    if (Math.abs(from.row - to.row) === 2) {
      newEnPassant = { row: (from.row + to.row) / 2, col: from.col };
    }
    // Promotion
    const promRow = piece.color === 'w' ? 0 : 7;
    if (to.row === promRow) {
      piece.type = promotion;
    }
  }

  nb[to.row][to.col] = piece;
  nb[from.row][from.col] = null;

  return {
    board: nb,
    turn: state.turn === 'w' ? 'b' : 'w',
    castling: newCastling,
    enPassant: newEnPassant,
    halfMoveClock: (piece.type === 'P' || target) ? 0 : state.halfMoveClock + 1,
    fullMoveNumber: state.turn === 'b' ? state.fullMoveNumber + 1 : state.fullMoveNumber
  };
}

function evaluateBoard(board: Board): number {
  let score = 0;
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const p = board[r][c];
      if (p) {
        const val = PIECE_VALUES[p.type];
        const pstVal = p.color === 'w' ? PST[p.type][r][c] : PST[p.type][7-r][c];
        const total = val + pstVal;
        score += p.color === 'w' ? total : -total;
      }
    }
  }
  return score;
}

function getLegalMoves(state: GameState): {from: ChessPos, to: ChessPos}[] {
  const moves: {from: ChessPos, to: ChessPos}[] = [];
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      if (state.board[r][c]?.color === state.turn) {
        const pseudo = getPseudoLegalMoves(state, r, c);
        for (const to of pseudo) {
          const next = performMove(state, {row: r, col: c}, to);
          if (!isInCheck(next.board, state.turn)) {
            moves.push({ from: {row: r, col: c}, to });
          }
        }
      }
    }
  }
  return moves;
}

function negamax(state: GameState, depth: number, alpha: number, beta: number, color: number): number {
  if (depth === 0) return color * evaluateBoard(state.board);

  const moves = getLegalMoves(state);
  if (moves.length === 0) {
    if (isInCheck(state.board, state.turn)) return -100000 - depth; // Prefer shorter mate
    return 0; // Stalemate
  }

  // Move ordering: captures first
  moves.sort((a, b) => {
    const targetA = state.board[a.to.row][a.to.col];
    const targetB = state.board[b.to.row][b.to.col];
    const valA = targetA ? PIECE_VALUES[targetA.type] : 0;
    const valB = targetB ? PIECE_VALUES[targetB.type] : 0;
    return valB - valA;
  });

  let maxEval = -Infinity;
  for (const move of moves) {
    const next = performMove(state, move.from, move.to);
    const ev = -negamax(next, depth - 1, -beta, -alpha, -color);
    maxEval = Math.max(maxEval, ev);
    alpha = Math.max(alpha, ev);
    if (alpha >= beta) break;
  }
  return maxEval;
}

function aiMove(state: GameState): { from: ChessPos; to: ChessPos } | null {
  const moves = getLegalMoves(state);
  if (moves.length === 0) return null;

  let bestMove = moves[0];
  let bestValue = -Infinity;
  const color = state.turn === 'w' ? 1 : -1;

  // Move ordering
  moves.sort((a, b) => {
    const targetA = state.board[a.to.row][a.to.col];
    const targetB = state.board[b.to.row][b.to.col];
    return (targetB ? PIECE_VALUES[targetB.type] : 0) - (targetA ? PIECE_VALUES[targetA.type] : 0);
  });

  for (const move of moves) {
    const next = performMove(state, move.from, move.to);
    // Depth 3 is usually good enough for a web app and fast enough
    const val = -negamax(next, 3, -Infinity, Infinity, -color);
    if (val > bestValue) {
      bestValue = val;
      bestMove = move;
    }
  }
  return bestMove;
}

interface MoveRecord {
  moveNumber: number;
  player: 'w' | 'b';
  from: ChessPos;
  to: ChessPos;
  piece: Piece;
  captured: Piece | null;
  stateBefore: GameState;
  stateAfter: GameState;
  evaluation: number;
  bestMoves?: { move: {from: ChessPos, to: ChessPos}, val: number }[];
  classification?: 'Excellent' | 'Good' | 'Inaccuracy' | 'Mistake' | 'Blunder';
}

function analyzePosition(state: GameState, depth: number = 3) {
  const moves = getLegalMoves(state);
  if (moves.length === 0) return [];
  const color = state.turn === 'w' ? 1 : -1;
  const evaluations = moves.map(move => {
    const next = performMove(state, move.from, move.to);
    const val = -negamax(next, depth - 1, -Infinity, Infinity, -color);
    return { move, val: val * color };
  });
  evaluations.sort((a, b) => b.val - a.val);
  return evaluations;
}

function ChessGame({ onXpChange, soundEnabled, currentXp }: { onXpChange: (xp: number) => void, soundEnabled: boolean, currentXp: number }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [gameState, setGameState] = useState<GameState>({
    board: INIT_BOARD.map(r => r.map(p => p ? {...p} : null)),
    turn: 'w',
    castling: { w: { k: true, q: true }, b: { k: true, q: true } },
    enPassant: null,
    halfMoveClock: 0,
    fullMoveNumber: 1
  });
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

  const classifyMove = (move: {from: ChessPos, to: ChessPos}, bestMoves: {move: {from: ChessPos, to: ChessPos}, val: number}[], player: 'w' | 'b') => {
    if (bestMoves.length === 0) return 'Excellent';
    const best = bestMoves[0];
    const isBest = best.move.from.row === move.from.row && best.move.from.col === move.from.col && 
                   best.move.to.row === move.to.row && best.move.to.col === move.to.col;
    if (isBest) return 'Excellent';
    
    const isInTop3 = bestMoves.slice(0, 3).some(m => 
      m.move.from.row === move.from.row && m.move.from.col === move.from.col && 
      m.move.to.row === move.to.row && m.move.to.col === move.to.col
    );
    if (isInTop3) return 'Good';

    const playedMove = bestMoves.find(m => 
      m.move.from.row === move.from.row && m.move.from.col === move.from.col && 
      m.move.to.row === move.to.row && m.move.to.col === move.to.col
    );
    
    if (!playedMove) return 'Blunder';

    const diff = Math.abs(best.val - playedMove.val);
    if (diff < 100) return 'Inaccuracy';
    if (diff < 300) return 'Mistake';
    return 'Blunder';
  };

  const analyzeGame = async () => {
    setAnalysisLoading(true);
    setShowAnalysis(true);
    
    const newHistory = [...history];
    for (let i = 0; i < newHistory.length; i++) {
      const record = newHistory[i];
      if (record.classification) continue;
      
      const bestMoves = analyzePosition(record.stateBefore, 3);
      record.bestMoves = bestMoves;
      record.classification = classifyMove({from: record.from, to: record.to}, bestMoves, record.player);
      if (i % 3 === 0) await new Promise(r => setTimeout(r, 0));
    }
    
    setHistory(newHistory);
    setAnalysisLoading(false);
  };

  const undoMove = () => {
    if (history.length < 2 || currentXp < 5) return;
    
    // Undo 2 moves (Player + AI)
    const newHistory = history.slice(0, -2);
    const lastRecord = newHistory[newHistory.length - 1];
    
    if (lastRecord) {
      setGameState(JSON.parse(JSON.stringify(lastRecord.stateAfter)));
      setLastMove({ from: lastRecord.from, to: lastRecord.to });
    } else {
      setGameState({
        board: INIT_BOARD.map(r => r.map(p => p ? {...p} : null)),
        turn: 'w',
        castling: { w: { k: true, q: true }, b: { k: true, q: true } },
        enPassant: null,
        halfMoveClock: 0,
        fullMoveNumber: 1
      });
      setLastMove(null);
    }
    
    setHistory(newHistory);
    onXpChange(-5);
    setGameOver(false);
    setStatus('Move undone. Your turn (White)');
    playSound('flip', soundEnabled);
  };

  const getHint = (type: 'piece' | 'square' | 'move') => {
    const cost = type === 'piece' ? 5 : type === 'square' ? 10 : 15;
    if (currentXp < cost) return;

    const bestMoves = analyzePosition(gameState, 3);
    if (bestMoves.length > 0) {
      const best = bestMoves[0].move;
      setHint({
        from: type === 'piece' || type === 'move' ? best.from : undefined,
        to: type === 'square' || type === 'move' ? best.to : undefined,
        type
      });
      onXpChange(-cost);
      setShowHintMenu(false);
    }
  };
  const handleSquareClick = (row: number, col: number) => {
    if (gameOver || gameState.turn !== 'w' || isThinking) return;
    const piece = gameState.board[row][col];

    if (selected) {
      const move = legalMoves.find(m => m.row === row && m.col === col);
      if (move) {
        let captured = gameState.board[row][col];
        // En passant capture detection for UI
        if (!captured && gameState.board[selected.row][selected.col]?.type === 'P' && selected.col !== col) {
          captured = gameState.board[selected.row][col];
        }
        if (captured) {
          setCapturedW(prev => [...prev, captured]);
          playSound('flip', soundEnabled);
        } else {
          playSound('flip', soundEnabled);
        }

        const from = selected;
        const to = { row, col };
        const piece = gameState.board[from.row][from.col]!;
        const stateBefore = JSON.parse(JSON.stringify(gameState));

        const nextState = performMove(gameState, from, to);
        setGameState(nextState);
        setLastMove({ from, to });
        setSelected(null);
        setLegalMoves([]);
        setHint(null);
        setIsThinking(true);
        setStatus('AI is thinking...');

        const moveRecord: MoveRecord = {
          moveNumber: gameState.fullMoveNumber,
          player: 'w',
          from,
          to,
          piece,
          captured: captured || undefined,
          stateBefore,
          stateAfter: JSON.parse(JSON.stringify(nextState)),
          evaluation: evaluateBoard(nextState.board)
        };
        setHistory(prev => [...prev, moveRecord]);

        // AI Turn
        setTimeout(() => {
          const aiMv = aiMove(nextState);
          if (!aiMv) {
            const inCheck = isInCheck(nextState.board, 'b');
            if (inCheck) {
              setStatus('🏆 Checkmate! You win!');
              onXpChange(awardXP(20));
              playSound('correct', soundEnabled);
            } else {
              setStatus('🤝 Stalemate!');
            }
            setGameOver(true);
            setIsThinking(false);
            return;
          }

          let aiCaptured = nextState.board[aiMv.to.row][aiMv.to.col];
          if (!aiCaptured && nextState.board[aiMv.from.row][aiMv.from.col]?.type === 'P' && aiMv.from.col !== aiMv.to.col) {
            aiCaptured = nextState.board[aiMv.from.row][aiMv.to.col];
          }
          if (aiCaptured) {
            setCapturedB(prev => [...prev, aiCaptured]);
            playSound('flip', soundEnabled);
          } else {
            playSound('flip', soundEnabled);
          }

          const finalState = performMove(nextState, aiMv.from, aiMv.to);
          const aiPiece = nextState.board[aiMv.from.row][aiMv.from.col]!;
          const aiMoveRecord: MoveRecord = {
            moveNumber: nextState.fullMoveNumber,
            player: 'b',
            from: aiMv.from,
            to: aiMv.to,
            piece: aiPiece,
            captured: aiCaptured || undefined,
            stateBefore: JSON.parse(JSON.stringify(nextState)),
            stateAfter: JSON.parse(JSON.stringify(finalState)),
            evaluation: evaluateBoard(finalState.board)
          };
          setHistory(prev => [...prev, aiMoveRecord]);

          setGameState(finalState);
          setLastMove({ from: aiMv.from, to: aiMv.to });

          const playerMoves = getLegalMoves(finalState);
          if (playerMoves.length === 0) {
            const inCheck = isInCheck(finalState.board, 'w');
            if (inCheck) {
              setStatus('💀 Checkmate! AI wins.');
              playSound('wrong', soundEnabled);
            } else {
              setStatus('🤝 Stalemate!');
            }
            setGameOver(true);
          } else {
            const inCheck = isInCheck(finalState.board, 'w');
            if (inCheck) {
              setStatus('⚠️ You are in check! Your turn (White)');
              playSound('flip', soundEnabled);
            } else {
              setStatus('Your turn (White)');
            }
          }
          setIsThinking(false);
        }, 500);
        return;
      }
      setSelected(null);
      setLegalMoves([]);
    }

    if (piece?.color === 'w') {
      setSelected({ row, col });
      const moves = getPseudoLegalMoves(gameState, row, col).filter(m => {
        const next = performMove(gameState, {row, col}, m);
        return !isInCheck(next.board, 'w');
      });
      setLegalMoves(moves);
      playSound('flip', soundEnabled);
    }
  };

  const resetGame = () => {
    setGameState({
      board: INIT_BOARD.map(r => r.map(p => p ? {...p} : null)),
      turn: 'w',
      castling: { w: { k: true, q: true }, b: { k: true, q: true } },
      enPassant: null,
      halfMoveClock: 0,
      fullMoveNumber: 1
    });
    setSelected(null); setLegalMoves([]); setGameOver(false);
    setCapturedW([]); setCapturedB([]); setStatus('Your turn (White)');
    setLastMove(null); setIsThinking(false);
  };

  const resignGame = () => {
    if (gameOver) return;
    setGameOver(true);
    setStatus('🏳️ You resigned. AI wins.');
    playSound('wrong', soundEnabled);
    setIsThinking(false);
    setShowResignConfirm(false);
  };

  const inCheck = !gameOver && isInCheck(gameState.board, 'w');

  return (
    <div ref={containerRef} className={`flex flex-col items-center gap-4 p-4 transition-all relative ${isFullscreen ? 'fixed inset-0 z-50 bg-white dark:bg-bg-dark overflow-auto py-12' : ''}`}>
      <button 
        onClick={toggleFullscreen}
        className="absolute top-4 right-4 p-2 bg-ink/5 hover:bg-ink/10 rounded-full transition-all z-20"
        title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
      >
        <Maximize2 size={20} className="text-ink/60" />
      </button>

      <div className="text-center">
        <h2 className="text-2xl font-bold text-accent-gold font-serif mb-1">Chess</h2>
        <p className={`text-sm font-medium ${inCheck ? 'text-red-500' : 'text-ink/70 dark:text-ink-dark/70'}`}>{status}</p>
      </div>

      {!isFullscreen && (
        <div className="w-full max-w-xs text-xs text-ink/60 dark:text-ink-dark/60 flex justify-between">
          <div className="flex flex-wrap gap-0.5">AI: {capturedB.map((p,i) => <span key={i} className="text-lg">{p ? PIECE_UNICODE[p.color+p.type] : ''}</span>)}</div>
          <div className="flex flex-wrap gap-0.5 text-right">You: {capturedW.map((p,i) => <span key={i} className="text-lg">{p ? PIECE_UNICODE[p.color+p.type] : ''}</span>)}</div>
        </div>
      )}

      <div className={`border-4 border-accent-gold/40 rounded-lg overflow-hidden shadow-2xl bg-white ${isFullscreen ? 'w-full max-w-[min(90vw,75vh)] aspect-square' : ''}`}>
        {gameState.board.map((rowArr, row) => (
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
                  onClick={() => handleSquareClick(row, col)}
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

      <div className="flex flex-wrap justify-center gap-3">
        <button onClick={resetGame} className="px-6 py-2 bg-ink text-white rounded-lg font-semibold hover:opacity-90 transition-all text-sm shadow-md flex items-center gap-2">
          New Game
        </button>

        <div className="relative">
          <button 
            onClick={() => setShowResignConfirm(!showResignConfirm)} 
            disabled={gameOver || isThinking}
            className="px-6 py-2 bg-red-500 text-white rounded-lg font-semibold hover:opacity-90 transition-all text-sm shadow-md flex items-center gap-2 disabled:opacity-50"
          >
            Resign
          </button>
          
          <AnimatePresence>
            {showResignConfirm && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-white dark:bg-bg-dark border border-ink/10 rounded-xl shadow-xl p-3 z-30 min-w-[160px]"
              >
                <p className="text-xs font-bold text-ink/70 dark:text-ink-dark/70 mb-2 text-center">Are you sure?</p>
                <div className="flex gap-2">
                  <button 
                    onClick={resignGame}
                    className="flex-1 py-1.5 bg-red-500 text-white rounded-lg text-xs font-bold hover:opacity-90"
                  >
                    Yes, Resign
                  </button>
                  <button 
                    onClick={() => setShowResignConfirm(false)}
                    className="flex-1 py-1.5 bg-ink/5 text-ink/70 rounded-lg text-xs font-bold hover:bg-ink/10"
                  >
                    No
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        <div className="relative">
          <button 
            onClick={() => setShowHintMenu(!showHintMenu)}
            disabled={isThinking || gameOver}
            className="px-6 py-2 bg-accent-gold text-white rounded-lg font-semibold hover:opacity-90 transition-all text-sm shadow-md flex items-center gap-2 disabled:opacity-50"
          >
            <Lightbulb size={16} /> Hint
          </button>
          
          <AnimatePresence>
            {showHintMenu && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-white dark:bg-bg-dark border border-ink/10 rounded-xl shadow-2xl p-3 w-48 z-30"
              >
                <div className="text-[10px] font-bold text-ink/30 uppercase tracking-widest mb-2 text-center">Select Hint Type</div>
                <div className="space-y-1">
                  {[
                    { type: 'piece', label: 'Piece to move', cost: 5 },
                    { type: 'square', label: 'Target square', cost: 10 },
                    { type: 'move', label: 'Full move', cost: 15 }
                  ].map(h => (
                    <button
                      key={h.type}
                      onClick={() => getHint(h.type as any)}
                      disabled={currentXp < h.cost}
                      className="w-full text-left px-3 py-2 rounded-lg hover:bg-ink/5 flex justify-between items-center text-xs disabled:opacity-30"
                    >
                      <span className="font-medium">{h.label}</span>
                      <span className="text-accent-gold font-bold">{h.cost} XP</span>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <button 
          onClick={undoMove}
          disabled={history.length < 2 || isThinking || gameOver || currentXp < 5}
          className="px-6 py-2 border-2 border-ink/10 text-ink/70 rounded-lg font-semibold hover:bg-ink/5 transition-all text-sm shadow-sm flex items-center gap-2 disabled:opacity-30"
        >
          <RotateCcw size={16} /> Undo (5 XP)
        </button>

        {gameOver && (
          <button 
            onClick={analyzeGame}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-all text-sm shadow-md flex items-center gap-2"
          >
            <BarChart2 size={16} /> Analyze Game
          </button>
        )}
      </div>

      <div className="text-[10px] font-bold text-ink/30 uppercase tracking-widest">
        Current XP: <span className="text-accent-gold">{currentXp}</span>
      </div>

      {/* Analysis Modal */}
      <AnimatePresence>
        {showAnalysis && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-bg-dark w-full max-w-4xl max-h-[90vh] rounded-2xl shadow-2xl overflow-hidden flex flex-col"
            >
              <div className="p-6 border-b border-ink/5 flex justify-between items-center bg-bg-primary">
                <div className="flex items-center gap-3">
                  <BarChart2 className="text-accent-gold" />
                  <h3 className="text-2xl font-serif font-bold text-ink">Game Analysis</h3>
                </div>
                <button onClick={() => setShowAnalysis(false)} className="p-2 hover:bg-ink/5 rounded-full transition-all">
                  <X size={24} />
                </button>
              </div>

              <div className="flex-1 overflow-auto p-6">
                {analysisLoading ? (
                  <div className="h-64 flex flex-col items-center justify-center gap-4">
                    <div className="w-12 h-12 border-4 border-accent-gold border-t-transparent rounded-full animate-spin" />
                    <p className="text-ink/60 font-medium animate-pulse">Engine is analyzing moves...</p>
                  </div>
                ) : (
                  <div className="space-y-8">
                    {/* Summary Stats */}
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
                      {['Excellent', 'Good', 'Inaccuracy', 'Mistake', 'Blunder'].map(cls => {
                        const count = history.filter(r => r.player === 'w' && r.classification === cls).length;
                        const colors: any = {
                          Excellent: 'text-green-500',
                          Good: 'text-blue-500',
                          Inaccuracy: 'text-yellow-500',
                          Mistake: 'text-orange-500',
                          Blunder: 'text-red-500'
                        };
                        return (
                          <div key={cls} className="bg-bg-primary p-3 rounded-xl border border-ink/5 text-center">
                            <div className={`text-xl font-bold ${colors[cls]}`}>{count}</div>
                            <div className="text-[10px] font-bold text-ink/30 uppercase tracking-widest">{cls}</div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Move List */}
                    <div className="space-y-4">
                      <h4 className="text-lg font-serif font-bold text-ink border-b border-ink/5 pb-2">Key Moments</h4>
                      <div className="grid gap-4">
                        {history.filter(r => r.player === 'w' && (r.classification === 'Blunder' || r.classification === 'Mistake' || r.classification === 'Excellent')).slice(-5).map((record, i) => {
                          const colors: any = {
                            Excellent: 'bg-green-500/10 border-green-500/20 text-green-700',
                            Good: 'bg-blue-500/10 border-blue-500/20 text-blue-700',
                            Inaccuracy: 'bg-yellow-500/10 border-yellow-500/20 text-yellow-700',
                            Mistake: 'bg-orange-500/10 border-orange-500/20 text-orange-700',
                            Blunder: 'bg-red-500/10 border-red-500/20 text-red-700'
                          };
                          
                          return (
                            <div key={i} className={`p-4 rounded-xl border flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 ${colors[record.classification!]}`}>
                              <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-white/50 flex items-center justify-center font-bold text-lg">
                                  {record.moveNumber}
                                </div>
                                <div>
                                  <div className="font-bold flex items-center gap-2">
                                    {PIECE_UNICODE[record.piece.color + record.piece.type]} {'abcdefgh'[record.from.col]}{8-record.from.row} → {'abcdefgh'[record.to.col]}{8-record.to.row}
                                    <span className="text-xs uppercase tracking-widest opacity-70">({record.classification})</span>
                                  </div>
                                  <p className="text-xs opacity-80 mt-1">
                                    {record.classification === 'Blunder' ? 'This move significantly weakens your position.' : 
                                     record.classification === 'Excellent' ? 'The strongest move in this position.' : 
                                     'A questionable move that gives the opponent an advantage.'}
                                  </p>
                                </div>
                              </div>
                              <button 
                                onClick={() => {
                                  setGameState(JSON.parse(JSON.stringify(record.stateBefore)));
                                  setGameOver(false);
                                  setShowAnalysis(false);
                                  setHistory(prev => prev.slice(0, prev.indexOf(record)));
                                  setStatus('Retrying position. Your turn (White)');
                                }}
                                className="px-4 py-2 bg-white/50 hover:bg-white/80 rounded-lg text-xs font-bold transition-all flex items-center gap-2"
                              >
                                <RotateCcw size={14} /> Retry Position
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    <div className="bg-accent-gold/5 p-6 rounded-2xl border border-accent-gold/10">
                      <div className="flex items-center gap-2 text-accent-gold mb-2">
                        <Info size={18} />
                        <span className="font-bold uppercase tracking-widest text-xs">Learning Tip</span>
                      </div>
                      <p className="text-sm text-ink/80 leading-relaxed">
                        {history.some(r => r.classification === 'Blunder') 
                          ? "Focus on scanning the board for undefended pieces before making a move. Blunders often occur when we miss a simple tactical threat."
                          : "Your tactical awareness is strong! To improve further, try to think 2-3 moves ahead and consider your opponent's best responses."}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
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
  const wordPool = ALL_GRE_WORDS.filter(w => w.word.length >= 5 && w.word.length <= 10 && !w.word.includes(' '));
  const [gameState, setGameState] = useState<'playing' | 'end'>('playing');
  const [currentWord, setCurrentWord] = useState(() => wordPool[Math.floor(Math.random() * wordPool.length)]);
  const [scrambled, setScrambled] = useState(() => scrambleWord(currentWord.word));
  const [input, setInput] = useState('');
  const [feedback, setFeedback] = useState<'correct'|'wrong'|null>(null);
  const [showHint, setShowHint] = useState(false);
  const [showDef, setShowDef] = useState(false);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [mistakes, setMistakes] = useState<Mistake[]>([]);
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
    
    // Find and un-use the LAST matching used letter
    const newLetters = [...letters];
    for (let i = newLetters.length - 1; i >= 0; i--) {
      if (newLetters[i].char === char && newLetters[i].used) {
        newLetters[i] = { ...newLetters[i], used: false };
        break;
      }
    }
    setLetters(newLetters);
  };

  const handleReset = () => {
    setLetters(prev => prev.map(l => ({ ...l, used: false })));
    setAssembled([]);
    setFeedback(null);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (feedback === 'correct') return;
      
      const key = e.key.toUpperCase();
      if (key === 'ENTER') {
        if (assembled.length === currentWord.word.length) handleSubmit();
      } else if (key === 'BACKSPACE') {
        if (assembled.length > 0) handleAssembledClick(assembled.length - 1);
      } else if (key === 'ESCAPE') {
        handleReset();
      } else if (/^[A-Z]$/.test(key)) {
        const idx = letters.findIndex(l => l.char === key && !l.used);
        if (idx !== -1) handleLetterClick(idx);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [letters, assembled, feedback, currentWord]);

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

  const handleSkip = () => { 
    setMistakes(prev => [...prev, {
      question: `Unscramble: "${scrambled}"`,
      userAnswer: assembled.join('') || 'Skipped',
      correctAnswer: currentWord.word,
      explanation: currentWord.definition
    }]);
    setShowDef(true); 
    setTimeout(loadNew, 2500); 
  };

  if (gameState === 'end') {
    return (
      <div className="space-y-12 py-12 text-center animate-in fade-in max-w-4xl mx-auto">
        <div className="space-y-4">
          <span className="text-[10px] font-sans font-bold text-accent-gold uppercase tracking-[0.3em]">Session Concluded</span>
          <h2 className="text-6xl font-serif font-bold text-ink leading-tight">Lexical<br />Reconstruction.</h2>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          <div className="p-12 bg-white rounded-sm border border-ink/5 shadow-xl space-y-8">
            <div className="space-y-2">
              <span className="text-[10px] font-sans font-bold text-ink/30 uppercase tracking-[0.2em]">Final Score</span>
              <p className="text-7xl font-serif font-bold text-ink tracking-tighter">{score}</p>
            </div>
            <div className="flex justify-between items-center border-t border-ink/5 pt-8">
              <div className="text-left">
                <span className="text-[10px] font-sans font-bold text-ink/30 uppercase tracking-[0.2em]">Attempts</span>
                <p className="text-2xl font-serif font-bold text-ink">{attempts}</p>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-sans font-bold text-ink/30 uppercase tracking-[0.2em]">Max Streak</span>
                <p className="text-2xl font-serif font-bold text-accent-gold">{streak}</p>
              </div>
            </div>
            <button 
              onClick={() => { setGameState('playing'); setScore(0); setAttempts(0); setStreak(0); setMistakes([]); loadNew(); }}
              className="w-full px-12 py-6 bg-ink text-white rounded-sm font-sans font-bold text-xs uppercase tracking-[0.2em] hover:bg-ink/90 transition-all shadow-xl"
            >
              Restart Session
            </button>
          </div>

          <div className="text-left">
            <GameAnalysis mistakes={mistakes} onClose={() => { setGameState('playing'); setScore(0); setAttempts(0); setStreak(0); setMistakes([]); loadNew(); }} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-5 p-4 max-w-sm mx-auto">
      <div className="w-full flex justify-end">
        <button 
          onClick={() => {
            setGameState('end');
            recordQuizResult('Word Scramble', score, attempts, mistakes);
          }}
          className="text-[10px] font-sans font-bold text-ink/30 hover:text-ink uppercase tracking-[0.2em] transition-colors"
        >
          Finish Session
        </button>
      </div>
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
          onClick={handleReset}
          className="px-4 py-2 border border-ink/20 dark:border-ink-dark/20 text-ink/50 dark:text-ink-dark/50 rounded-lg text-sm hover:bg-ink/5 transition-all"
        >
          Reset (Esc)
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
  const [current, setCurrent] = useState<Word | null>(null);
  const [choices, setChoices] = useState<string[]>([]);
  const [feedback, setFeedback] = useState<'correct'|'wrong'|null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<string|null>(null);
  const [combo, setCombo] = useState(0);
  const [totalAnswered, setTotalAnswered] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [mistakes, setMistakes] = useState<Mistake[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const pickQuestion = () => {
    const word = ALL_GRE_WORDS[Math.floor(Math.random() * ALL_GRE_WORDS.length)];
    const wrong = ALL_GRE_WORDS
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
      setMistakes(prev => [...prev, {
        question: `Match definition: "${current.definition}"`,
        userAnswer: answer,
        correctAnswer: current.word,
        explanation: current.mnemonic
      }]);
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
    <div className="flex flex-col items-center gap-12 p-6 text-center animate-in fade-in max-w-4xl mx-auto">
      <div className="space-y-4">
        <h2 className="text-5xl font-serif font-bold text-ink leading-tight">Time's Up! ⏱️</h2>
        <p className="text-sm text-ink/60 dark:text-ink-dark/60">
          {score >= 200 ? '🏆 Exceptional! GRE master!' : score >= 100 ? '🌟 Great performance!' : score >= 50 ? '📚 Good effort, keep practicing!' : '💪 Keep studying those definitions!'}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start w-full">
        <div className="space-y-8">
          <div className="grid grid-cols-2 gap-4">
            {[['Score', score, 'text-accent-gold'],['Accuracy', `${accuracy}%`, 'text-blue-500'],['Correct', correctCount, 'text-green-500'],['Answered', totalAnswered, 'text-ink dark:text-ink-dark']].map(([lbl,val,cls]) => (
              <div key={lbl as string} className="bg-white rounded-sm p-6 border border-ink/5 shadow-sm">
                <div className={`text-3xl font-bold ${cls}`}>{val}</div>
                <div className="text-[10px] font-sans font-bold text-ink/30 uppercase tracking-[0.2em] mt-1">{lbl}</div>
              </div>
            ))}
          </div>
          <button 
            onClick={() => { startGame(); setMistakes([]); }}
            className="w-full px-8 py-6 bg-ink text-white rounded-sm font-sans font-bold text-xs uppercase tracking-[0.2em] hover:bg-ink/90 transition-all shadow-xl"
          >
            Play Again
          </button>
        </div>

        <div className="text-left">
          <GameAnalysis mistakes={mistakes} onClose={() => { setGameState('idle'); setMistakes([]); }} />
        </div>
      </div>
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
        <div className="bg-white rounded-2xl p-6 border border-ink/5 shadow-lg min-h-[120px] flex flex-col items-center justify-center text-center gap-3 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-accent-gold/20" />
          <div className="text-[10px] font-sans font-bold text-ink/30 uppercase tracking-[0.2em]">{current.pos} · {current.category}</div>
          <p className="text-ink font-serif text-xl font-bold leading-tight">{current.definition}</p>
          {current.example && (
            <div className="mt-2 p-3 bg-bg-primary rounded-sm border border-ink/5 italic">
              <p className="text-xs text-ink/60 leading-relaxed">"{current.example}"</p>
            </div>
          )}
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

// ─── SYNONYM DUEL ──────────────────────────────────────────────────────────────

// Curated synonym pairs — ordered by approximate difficulty for escalation
const SYNONYM_PAIRS: { word: string; correct: string; decoy: string; explanation: string }[] = [
  // Tier 1: Clear Antonyms
  { word: 'Loquacious', correct: 'Garrulous', decoy: 'Taciturn', explanation: 'Both mean excessively talkative. Taciturn means the opposite: silent.' },
  { word: 'Ebullient', correct: 'Effervescent', decoy: 'Phlegmatic', explanation: 'Both mean enthusiastically lively. Phlegmatic means calm and unemotional.' },
  { word: 'Acerbic', correct: 'Caustic', decoy: 'Affable', explanation: 'Both mean sharply critical or sour. Affable means friendly.' },
  { word: 'Diffident', correct: 'Timorous', decoy: 'Audacious', explanation: 'Both mean lacking confidence. Audacious means boldly daring.' },
  { word: 'Equanimity', correct: 'Composure', decoy: 'Perturbation', explanation: 'Both mean mental calmness. Perturbation means anxiety or disturbance.' },
  { word: 'Enervate', correct: 'Debilitate', decoy: 'Invigorate', explanation: 'Both mean to weaken or drain. Invigorate means the opposite.' },
  { word: 'Gainsay', correct: 'Refute', decoy: 'Corroborate', explanation: 'Both mean to deny or contradict. Corroborate means to confirm.' },
  { word: 'Alacrity', correct: 'Eagerness', decoy: 'Apathy', explanation: 'Both mean brisk and cheerful readiness. Apathy means lack of interest.' },
  { word: 'Mitigate', correct: 'Alleviate', decoy: 'Aggravate', explanation: 'Both mean to make less severe. Aggravate means to make worse.' },
  { word: 'Luminous', correct: 'Radiant', decoy: 'Obscure', explanation: 'Both mean emitting or reflecting light. Obscure means dark or hidden.' },

  // Tier 2: More Nuanced
  { word: 'Mendacious', correct: 'Perfidious', decoy: 'Veracious', explanation: 'Both relate to dishonesty/untrustworthiness. Veracious means truthful.' },
  { word: 'Laconic', correct: 'Terse', decoy: 'Verbose', explanation: 'Both mean using few words. Verbose means using too many words.' },
  { word: 'Obsequious', correct: 'Sycophantic', decoy: 'Intransigent', explanation: 'Both mean excessively flattering/servile. Intransigent means stubborn.' },
  { word: 'Recalcitrant', correct: 'Refractory', decoy: 'Tractable', explanation: 'Both mean stubbornly resistant. Tractable means easily controlled.' },
  { word: 'Perspicacious', correct: 'Discerning', decoy: 'Obtuse', explanation: 'Both mean having sharp insight. Obtuse means slow to understand.' },
  { word: 'Prodigal', correct: 'Profligate', decoy: 'Parsimonious', explanation: 'Both mean wastefully extravagant. Parsimonious means extremely stingy.' },
  { word: 'Truculent', correct: 'Pugnacious', decoy: 'Placid', explanation: 'Both mean aggressively combative. Placid means calm and peaceful.' },
  { word: 'Vituperate', correct: 'Castigate', decoy: 'Encomium', explanation: 'Both mean to harshly criticize. Encomium is high praise.' },
  { word: 'Soporific', correct: 'Somnolent', decoy: 'Invigorating', explanation: 'Both mean tending to induce sleep. Invigorating means the opposite.' },
  { word: 'Pellucid', correct: 'Limpid', decoy: 'Opaque', explanation: 'Both mean transparently clear. Opaque means not see-through.' },
  { word: 'Anomalous', correct: 'Atypical', decoy: 'Conforming', explanation: 'Both mean deviating from what is standard. Conforming means following rules.' },
  { word: 'Cogent', correct: 'Compelling', decoy: 'Incoherent', explanation: 'Both mean clear, logical, and convincing. Incoherent means confusing.' },
  { word: 'Deference', correct: 'Veneration', decoy: 'Contempt', explanation: 'Both mean humble submission and respect. Contempt means disregard.' },
  { word: 'Diatribe', correct: 'Harangue', decoy: 'Panegyric', explanation: 'Both mean a forceful and bitter verbal attack. Panegyric is a speech of praise.' },
  { word: 'Eschew', correct: 'Abstain', decoy: 'Indulge', explanation: 'Both mean to deliberately avoid using. Indulge means to allow oneself to enjoy.' },

  // Tier 3: High Difficulty / Near-Synonyms
  { word: 'Assiduous', correct: 'Sedulous', decoy: 'Indolent', explanation: 'Both mean diligently hard-working. Indolent means lazy.' },
  { word: 'Circumspect', correct: 'Judicious', decoy: 'Reckless', explanation: 'Both mean carefully cautious. Reckless means the opposite.' },
  { word: 'Magnanimous', correct: 'Munificent', decoy: 'Parsimonious', explanation: 'Both relate to generosity and nobility. Parsimonious means stingy.' },
  { word: 'Assuage', correct: 'Mollify', decoy: 'Exacerbate', explanation: 'Both mean to soothe or calm. Exacerbate means to make worse.' },
  { word: 'Contrite', correct: 'Penitent', decoy: 'Impenitent', explanation: 'Both mean feeling remorse. Impenitent means showing no remorse.' },
  { word: 'Inimical', correct: 'Antagonistic', decoy: 'Propitious', explanation: 'Both mean hostile or harmful. Propitious means favorable.' },
  { word: 'Ephemeral', correct: 'Transitory', decoy: 'Perennial', explanation: 'Both mean short-lived. Perennial means lasting indefinitely.' },
  { word: 'Pragmatic', correct: 'Utilitarian', decoy: 'Quixotic', explanation: 'Both mean practically oriented. Quixotic means impractically idealistic.' },
  { word: 'Imperturbable', correct: 'Stoical', decoy: 'Excitable', explanation: 'Both mean unable to be upset or excited. Stoical means enduring pain without complaint.' },
  { word: 'Inchoate', correct: 'Nascent', decoy: 'Developed', explanation: 'Both mean just begun and so not fully formed. Developed means fully grown.' },
  { word: 'Inexorable', correct: 'Relentless', decoy: 'Yielding', explanation: 'Both mean impossible to stop or prevent. Yielding means giving way under pressure.' },
  { word: 'Insipid', correct: 'Vapid', decoy: 'Piquant', explanation: 'Both mean lacking flavor or interest. Piquant means having a pleasantly sharp taste.' },
  { word: 'Obdurate', correct: 'Obstinate', decoy: 'Pliant', explanation: 'Both mean stubbornly refusing to change one\'s opinion. Pliant means easily influenced.' },
  { word: 'Paucity', correct: 'Scarcity', decoy: 'Plethora', explanation: 'Both mean the presence of something only in small or insufficient quantities. Plethora means an excess.' },
  { word: 'Placate', correct: 'Appease', decoy: 'Antagonize', explanation: 'Both mean to make someone less angry or hostile. Antagonize means to cause someone to become hostile.' },
  { word: 'Precipitate', correct: 'Abrupt', decoy: 'Deliberate', explanation: 'Both mean done, made, or acting suddenly or without careful consideration. Deliberate means done consciously.' },
  { word: 'Propitiate', correct: 'Conciliate', decoy: 'Enrage', explanation: 'Both mean to win or regain the favor of by doing something that pleases them. Enrage means to make very angry.' },
  { word: 'Quiescent', correct: 'Dormant', decoy: 'Active', explanation: 'Both mean in a state or period of inactivity or dormancy. Active means engaging in physical energy.' },
  { word: 'Specious', correct: 'Spurious', decoy: 'Valid', explanation: 'Both mean superficially plausible, but actually wrong. Valid means having a sound basis in logic.' },
  { word: 'Venerate', correct: 'Revere', decoy: 'Despise', explanation: 'Both mean to regard with great respect. Despise means to feel contempt or a deep repugnance.' },
];

function SynonymDuel({ onXpChange, soundEnabled }: { onXpChange: (xp: number) => void, soundEnabled: boolean }) {
  const [gameState, setGameState] = useState<'start' | 'playing' | 'end'>('start');
  const [currentWord, setCurrentWord] = useState<Word | null>(null);
  const [options, setOptions] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [questionCount, setQuestionCount] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [mistakes, setMistakes] = useState<Mistake[]>([]);
  const wordsWithSynonyms = ALL_GRE_WORDS.filter(w => w.synonyms && w.synonyms.length > 0);

  const generateQuestion = () => {
    const word = wordsWithSynonyms[Math.floor(Math.random() * wordsWithSynonyms.length)];
    const correct = word.synonyms![Math.floor(Math.random() * word.synonyms!.length)];
    
    const others = ALL_GRE_WORDS
      .filter(w => w.id !== word.id && !word.synonyms?.includes(w.word))
      .sort(() => 0.5 - Math.random())
      .slice(0, 3)
      .map(w => w.word);
    
    setCurrentWord(word);
    setOptions([correct, ...others].sort(() => 0.5 - Math.random()));
    setSelectedOption(null);
    setIsCorrect(null);
  };

  const startDuel = () => {
    setGameState('playing');
    setScore(0);
    setQuestionCount(0);
    generateQuestion();
    incrementStat('gamesPlayed');
  };

  const handleAnswer = (opt: string) => {
    if (selectedOption) return;
    setSelectedOption(opt);
    const correct = currentWord?.synonyms?.includes(opt);
    setIsCorrect(correct);
    
    if (correct) {
      setScore(prev => prev + 1);
      playSound('correct', soundEnabled);
      const newXp = awardXP(XP_REWARDS.correctVerbal);
      onXpChange(newXp);
    } else {
      playSound('wrong', soundEnabled);
      setMistakes(prev => [...prev, {
        question: `Find the closest synonym for "${currentWord?.word}"`,
        userAnswer: opt,
        correctAnswer: currentWord?.synonyms?.[0] || 'Unknown',
        explanation: currentWord?.definition
      }]);
    }

    setTimeout(() => {
      if (questionCount < 9) {
        setQuestionCount(prev => prev + 1);
        generateQuestion();
      } else {
        setGameState('end');
        recordQuizResult('Synonym Duel', score + (correct ? 1 : 0), 10, mistakes);
      }
    }, 1500);
  };

  if (gameState === 'start') return (
    <div className="flex flex-col items-center gap-8 p-6 text-center animate-in fade-in slide-in-from-bottom-4">
      <div className="w-20 h-20 bg-bg-primary rounded-sm border border-ink/5 flex items-center justify-center text-accent-gold mx-auto">
        <Zap size={32} />
      </div>
      <div className="space-y-4">
        <h2 className="text-5xl font-serif font-bold text-ink">Synonym Duel.</h2>
        <p className="text-lg font-sans text-ink/60 max-w-md mx-auto">Can you identify the closest synonym? Master the subtle nuances of the lexicon.</p>
      </div>
      <button 
        onClick={startDuel}
        className="px-12 py-6 bg-ink text-white rounded-sm font-sans font-bold text-xs uppercase tracking-[0.2em] hover:bg-ink/90 transition-all shadow-xl"
      >
        Initiate Duel
      </button>
    </div>
  );

  if (gameState === 'end') return (
    <div className="space-y-12 py-12 text-center animate-in fade-in max-w-4xl mx-auto">
      <div className="space-y-4">
        <span className="text-[10px] font-sans font-bold text-accent-gold uppercase tracking-[0.3em]">Duel Concluded</span>
        <h2 className="text-6xl font-serif font-bold text-ink leading-tight">Lexical<br />Precision.</h2>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        <div className="p-12 bg-white rounded-sm border border-ink/5 shadow-xl space-y-8">
          <div className="space-y-2">
            <span className="text-[10px] font-sans font-bold text-ink/30 uppercase tracking-[0.2em]">Final Accuracy</span>
            <p className="text-7xl font-serif font-bold text-ink tracking-tighter">{Math.round((score / 10) * 100)}%</p>
          </div>
          <div className="flex justify-between items-center border-t border-ink/5 pt-8">
            <div className="text-left">
              <span className="text-[10px] font-sans font-bold text-ink/30 uppercase tracking-[0.2em]">Correct</span>
              <p className="text-2xl font-serif font-bold text-teal-500">{score}</p>
            </div>
            <div className="text-right">
              <span className="text-[10px] font-sans font-bold text-ink/30 uppercase tracking-[0.2em]">XP Gained</span>
              <p className="text-2xl font-serif font-bold text-accent-gold">{score * 10}</p>
            </div>
          </div>
          <button 
            onClick={() => { setGameState('start'); setMistakes([]); }}
            className="w-full px-12 py-6 bg-ink text-white rounded-sm font-sans font-bold text-xs uppercase tracking-[0.2em] hover:bg-ink/90 transition-all shadow-xl"
          >
            Restart Duel
          </button>
        </div>

        <div className="text-left">
          <GameAnalysis mistakes={mistakes} onClose={() => { setGameState('start'); setMistakes([]); }} />
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-12 max-w-2xl mx-auto w-full animate-in fade-in">
      <div className="flex items-center justify-between border-b border-ink/5 pb-8">
        <div className="text-left">
          <span className="text-[10px] font-sans font-bold text-ink/30 uppercase tracking-[0.2em]">Question</span>
          <p className="text-2xl font-serif font-bold text-ink">{(questionCount + 1).toString().padStart(2, '0')}/10</p>
        </div>
        <div className="text-right">
          <span className="text-[10px] font-sans font-bold text-ink/30 uppercase tracking-[0.2em]">Current Score</span>
          <p className="text-2xl font-serif font-bold text-accent-gold">{score}</p>
        </div>
      </div>

      <div className="py-12 space-y-8 text-center">
        <p className="text-[10px] font-sans font-bold text-ink/30 uppercase tracking-[0.3em]">Find the closest synonym for</p>
        <h2 className="text-6xl font-serif font-bold text-ink tracking-tight">{currentWord?.word}</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-8">
          {options.map((opt, idx) => (
            <button
              key={idx}
              onClick={() => handleAnswer(opt)}
              className={`
                p-6 rounded-sm border transition-all text-center font-serif text-2xl font-bold
                ${selectedOption === opt 
                  ? (currentWord?.synonyms?.includes(opt) ? 'bg-ink text-white border-ink' : 'bg-red-50 border-red-200 text-red-900')
                  : (selectedOption && currentWord?.synonyms?.includes(opt) ? 'bg-teal-50 border-teal-200 text-teal-900' : 'bg-white border-ink/5 hover:border-ink/20 text-ink/60')}
              `}
            >
              {opt}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

const MemoryPalace = ({ onXpChange, soundEnabled }: { onXpChange: (xp: number) => void, soundEnabled: boolean }) => {
  const [gameState, setGameState] = useState<'start' | 'playing' | 'recall' | 'end'>('start');
  const [level, setLevel] = useState(1);
  const [grid, setGrid] = useState<{ word: Word; pos: number }[]>([]);
  const [recallIndex, setRecallIndex] = useState(0);
  const [userInput, setUserInput] = useState('');
  const [score, setScore] = useState(0);
  const [timer, setTimer] = useState(0);
  const [mistakes, setMistakes] = useState<Mistake[]>([]);

  const startLevel = (lvl: number) => {
    const wordCount = Math.min(lvl + 2, 9);
    const selectedWords = [...ALL_GRE_WORDS].sort(() => 0.5 - Math.random()).slice(0, wordCount);
    const positions = Array.from({ length: 9 }, (_, i) => i).sort(() => 0.5 - Math.random()).slice(0, wordCount);
    
    const newGrid = selectedWords.map((word, i) => ({ word, pos: positions[i] }));
    setGrid(newGrid);
    setGameState('playing');
    setTimer(5 + lvl * 2);
    setRecallIndex(0);
    setUserInput('');
  };

  useEffect(() => {
    let interval: any;
    if (gameState === 'playing' && timer > 0) {
      interval = setInterval(() => setTimer(t => t - 1), 1000);
    } else if (gameState === 'playing' && timer === 0) {
      setGameState('recall');
    }
    return () => clearInterval(interval);
  }, [gameState, timer]);

  const handleRecall = () => {
    const current = grid[recallIndex];
    if (userInput.toLowerCase().trim() === current.word.word.toLowerCase()) {
      playSound('correct', soundEnabled);
      if (recallIndex < grid.length - 1) {
        setRecallIndex(prev => prev + 1);
        setUserInput('');
      } else {
        const nextLvl = level + 1;
        setLevel(nextLvl);
        setScore(prev => prev + level * 100);
        const newXp = awardXP(level * 10);
        onXpChange(newXp);
        startLevel(nextLvl);
      }
    } else {
      playSound('wrong', soundEnabled);
      setGameState('end');
      setMistakes([{
        question: `Recall word at position ${current.pos + 1}`,
        userAnswer: userInput || 'No Input',
        correctAnswer: current.word.word,
        explanation: current.word.definition
      }]);
      recordQuizResult('Memory Palace', level, 10, [{
        question: `Recall word at position ${current.pos + 1}`,
        userAnswer: userInput || 'No Input',
        correctAnswer: current.word.word,
        explanation: current.word.definition
      }]);
    }
  };

  if (gameState === 'start') return (
    <div className="flex flex-col items-center gap-8 p-6 text-center animate-in fade-in slide-in-from-bottom-4">
      <div className="w-20 h-20 bg-bg-primary rounded-sm border border-ink/5 flex items-center justify-center text-accent-gold mx-auto">
        <BookMarked size={32} />
      </div>
      <div className="space-y-4">
        <h2 className="text-5xl font-serif font-bold text-ink">Memory Palace.</h2>
        <p className="text-lg font-sans text-ink/60 max-w-md mx-auto">Associate words with spatial positions. Memorize the grid and recall them in order.</p>
      </div>
      <button 
        onClick={() => startLevel(1)}
        className="px-12 py-6 bg-ink text-white rounded-sm font-sans font-bold text-xs uppercase tracking-[0.2em] hover:bg-ink/90 transition-all shadow-xl"
      >
        Enter Palace
      </button>
    </div>
  );

  if (gameState === 'end') return (
    <div className="space-y-12 py-12 text-center animate-in fade-in max-w-4xl mx-auto">
      <div className="space-y-4">
        <span className="text-[10px] font-sans font-bold text-accent-gold uppercase tracking-[0.3em]">Palace Exited</span>
        <h2 className="text-6xl font-serif font-bold text-ink leading-tight">Spatial<br />Recall.</h2>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        <div className="space-y-8">
          <div className="p-12 bg-white rounded-sm border border-ink/5 shadow-xl space-y-8">
            <div className="space-y-2">
              <span className="text-[10px] font-sans font-bold text-ink/30 uppercase tracking-[0.2em]">Peak Level</span>
              <p className="text-7xl font-serif font-bold text-ink tracking-tighter">{level}</p>
            </div>
            <div className="flex justify-between items-center border-t border-ink/5 pt-8">
              <div className="text-left">
                <span className="text-[10px] font-sans font-bold text-ink/30 uppercase tracking-[0.2em]">Score</span>
                <p className="text-2xl font-serif font-bold text-ink">{score}</p>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-sans font-bold text-ink/30 uppercase tracking-[0.2em]">XP Gained</span>
                <p className="text-2xl font-serif font-bold text-accent-gold">{score / 10}</p>
              </div>
            </div>
            <button 
              onClick={() => { setGameState('start'); setLevel(1); setScore(0); setMistakes([]); }}
              className="w-full px-12 py-6 bg-ink text-white rounded-sm font-sans font-bold text-xs uppercase tracking-[0.2em] hover:bg-ink/90 transition-all shadow-xl"
            >
              Restart Session
            </button>
          </div>

          <div className="text-left">
            <GameAnalysis mistakes={mistakes} onClose={() => { setGameState('start'); setLevel(1); setScore(0); setMistakes([]); }} />
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-12 max-w-2xl mx-auto w-full animate-in fade-in">
      <div className="flex justify-between items-end border-b border-ink/5 pb-6">
        <div className="space-y-1">
          <span className="text-[10px] font-sans font-bold text-ink/30 uppercase tracking-[0.2em]">Level {level}</span>
          <h3 className="text-3xl font-serif font-bold text-ink">
            {gameState === 'playing' ? 'Memorize the Grid' : `Recall Word ${recallIndex + 1}`}
          </h3>
        </div>
        <div className="text-right space-y-1">
          <span className="text-[10px] font-sans font-bold text-ink/30 uppercase tracking-[0.2em]">
            {gameState === 'playing' ? 'Time Remaining' : 'Progress'}
          </span>
          <p className="text-2xl font-serif font-bold text-ink tabular-nums">
            {gameState === 'playing' ? `${timer}s` : `${recallIndex + 1}/${grid.length}`}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 aspect-square">
        {Array.from({ length: 9 }).map((_, i) => {
          const item = grid.find(g => g.pos === i);
          const isRecalling = gameState === 'recall' && item === grid[recallIndex];
          
          return (
            <div 
              key={i}
              className={`
                aspect-square rounded-sm border flex items-center justify-center p-4 text-center transition-all duration-500
                ${gameState === 'playing' && item ? 'bg-white border-ink/10 shadow-sm' : 'bg-bg-primary border-ink/5'}
                ${isRecalling ? 'ring-2 ring-accent-gold bg-white' : ''}
              `}
            >
              {gameState === 'playing' && item && (
                <span className="text-sm font-serif font-bold text-ink leading-tight">{item.word.word}</span>
              )}
              {gameState === 'recall' && isRecalling && (
                <div className="w-full space-y-4">
                  <span className="text-[10px] font-sans font-bold text-accent-gold uppercase tracking-[0.2em]">Recall Here</span>
                  <input
                    type="text"
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleRecall()}
                    autoFocus
                    className="w-full text-center text-lg font-serif font-bold border-b border-ink focus:outline-none bg-transparent"
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {gameState === 'recall' && (
        <button
          onClick={handleRecall}
          className="w-full py-6 bg-ink text-white rounded-sm font-sans font-bold text-xs uppercase tracking-[0.2em] hover:bg-ink/90 transition-all shadow-xl"
        >
          Confirm Word
        </button>
      )}
    </div>
  );
};

const PronunciationQuiz = ({ onXpChange, soundEnabled }: { onXpChange: (xp: number) => void, soundEnabled: boolean }) => {
  const [gameState, setGameState] = useState<'start' | 'playing' | 'end'>('start');
  const [currentWord, setCurrentWord] = useState<Word | null>(null);
  const [options, setOptions] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [questionCount, setQuestionCount] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [mistakes, setMistakes] = useState<Mistake[]>([]);

  const wordsWithPronunciation = ALL_GRE_WORDS.filter(w => w.pronunciation && w.pronunciation.length > 0);

  const generateQuestion = () => {
    const correct = wordsWithPronunciation[Math.floor(Math.random() * wordsWithPronunciation.length)];
    const others = wordsWithPronunciation
      .filter(w => w.id !== correct.id)
      .sort(() => 0.5 - Math.random())
      .slice(0, 3)
      .map(w => w.word);
    
    setCurrentWord(correct);
    setOptions([correct.word, ...others].sort(() => 0.5 - Math.random()));
    setSelectedOption(null);
    setIsCorrect(null);
    
    // Auto-play pronunciation
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(correct.word);
      utterance.rate = 0.8;
      window.speechSynthesis.speak(utterance);
    }
  };

  const startQuiz = () => {
    setGameState('playing');
    setScore(0);
    setQuestionCount(0);
    generateQuestion();
    incrementStat('gamesPlayed');
  };

  const handleAnswer = (opt: string) => {
    if (selectedOption) return;
    setSelectedOption(opt);
    const correct = opt === currentWord?.word;
    setIsCorrect(correct);
    
    if (correct) {
      setScore(prev => prev + 1);
      playSound('correct', soundEnabled);
      const newXp = awardXP(XP_REWARDS.correctVerbal);
      onXpChange(newXp);
    } else {
      playSound('wrong', soundEnabled);
      setMistakes(prev => [...prev, {
        question: `Identify the word from its pronunciation`,
        userAnswer: opt,
        correctAnswer: currentWord?.word || 'Unknown',
        explanation: currentWord?.definition
      }]);
    }

    setTimeout(() => {
      if (questionCount < 9) {
        setQuestionCount(prev => prev + 1);
        generateQuestion();
      } else {
        setGameState('end');
        recordQuizResult('Pronunciation Quiz', score + (correct ? 1 : 0), 10, mistakes);
      }
    }, 1500);
  };

  const replayPronunciation = () => {
    if (currentWord && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(currentWord.word);
      utterance.rate = 0.8;
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="max-w-2xl mx-auto w-full text-center space-y-12">
      {gameState === 'start' && (
        <div className="space-y-8">
          <div className="w-20 h-20 bg-bg-primary rounded-sm border border-ink/5 flex items-center justify-center text-accent-gold mx-auto">
            <Volume2 size={32} />
          </div>
          <div className="space-y-4">
            <h2 className="text-5xl font-serif font-bold text-ink">Phonetic Recall.</h2>
            <p className="text-lg font-sans text-ink/60 max-w-md mx-auto">Identify the correct word based on its auditory pronunciation. Master the sounds of the lexicon.</p>
          </div>
          <button 
            onClick={startQuiz}
            className="px-12 py-6 bg-ink text-white rounded-sm font-sans font-bold text-xs uppercase tracking-[0.2em] hover:bg-ink/90 transition-all shadow-xl"
          >
            Initiate Protocol
          </button>
        </div>
      )}

      {gameState === 'playing' && currentWord && (
        <div className="space-y-12">
          <div className="flex items-center justify-between border-b border-ink/5 pb-8">
            <div className="text-left">
              <span className="text-[10px] font-sans font-bold text-ink/30 uppercase tracking-[0.2em]">Question</span>
              <p className="text-2xl font-serif font-bold text-ink">{(questionCount + 1).toString().padStart(2, '0')}/10</p>
            </div>
            <div className="text-right">
              <span className="text-[10px] font-sans font-bold text-ink/30 uppercase tracking-[0.2em]">Current Score</span>
              <p className="text-2xl font-serif font-bold text-accent-gold">{score}</p>
            </div>
          </div>

          <div className="py-12 space-y-8">
            <button 
              onClick={replayPronunciation}
              className="w-24 h-24 bg-bg-primary rounded-full border border-ink/5 flex items-center justify-center text-accent-gold mx-auto hover:bg-ink hover:text-white transition-all shadow-lg group"
            >
              <Volume2 size={40} className="group-hover:scale-110 transition-transform" />
            </button>
            <p className="text-[10px] font-sans font-bold text-ink/30 uppercase tracking-[0.3em]">Listen to the Pronunciation</p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {options.map((opt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleAnswer(opt)}
                  className={`
                    p-6 rounded-sm border transition-all text-center font-serif text-2xl font-bold
                    ${selectedOption === opt 
                      ? (opt === currentWord.word ? 'bg-ink text-white border-ink' : 'bg-red-50 border-red-200 text-red-900')
                      : (selectedOption && opt === currentWord.word ? 'bg-teal-50 border-teal-200 text-teal-900' : 'bg-white border-ink/5 hover:border-ink/20 text-ink/60')}
                  `}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {gameState === 'end' && (
        <div className="space-y-12 py-12 text-center animate-in fade-in max-w-4xl mx-auto">
          <div className="space-y-4">
            <span className="text-[10px] font-sans font-bold text-accent-gold uppercase tracking-[0.3em]">Session Complete</span>
            <h2 className="text-6xl font-serif font-bold text-ink leading-tight">Auditory<br />Mastery.</h2>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <div className="p-12 bg-white rounded-sm border border-ink/5 shadow-xl space-y-8">
              <div className="space-y-2">
                <span className="text-[10px] font-sans font-bold text-ink/30 uppercase tracking-[0.2em]">Final Accuracy</span>
                <p className="text-7xl font-serif font-bold text-ink tracking-tighter">{Math.round((score / 10) * 100)}%</p>
              </div>
              <div className="flex justify-between items-center border-t border-ink/5 pt-8">
                <div className="text-left">
                  <span className="text-[10px] font-sans font-bold text-ink/30 uppercase tracking-[0.2em]">Correct</span>
                  <p className="text-2xl font-serif font-bold text-teal-500">{score}</p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-sans font-bold text-ink/30 uppercase tracking-[0.2em]">XP Gained</span>
                  <p className="text-2xl font-serif font-bold text-accent-gold">{score * 10}</p>
                </div>
              </div>
              <button 
                onClick={() => { setGameState('start'); setMistakes([]); }}
                className="w-full px-12 py-6 bg-ink text-white rounded-sm font-sans font-bold text-xs uppercase tracking-[0.2em] hover:bg-ink/90 transition-all shadow-xl"
              >
                Restart Protocol
              </button>
            </div>

            <div className="text-left">
              <GameAnalysis mistakes={mistakes} onClose={() => { setGameState('start'); setMistakes([]); }} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const MindGames = ({ onXpChange, currentXp }: { onXpChange: (xp: number) => void, currentXp: number }) => {
  const [activeGame, setActiveGame] = useState<string | null>(null);
  const [gameState, setGameState] = useState<'start' | 'playing' | 'end'>('start');
  const [level, setLevel] = useState(1);
  const [score, setScore] = useState(0);
  const [number, setNumber] = useState('');
  const [userInput, setUserInput] = useState('');
  const [showNumber, setShowNumber] = useState(false);
  const [mistakes, setMistakes] = useState<Mistake[]>([]);
  const soundEnabled = getStorage(STORAGE_KEYS.settings, { soundEnabled: true }).soundEnabled;

  const startNumberMemory = () => {
    setGameState('playing');
    incrementStat('gamesPlayed');
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
      setMistakes([{
        question: `Level ${level} Sequence`,
        userAnswer: userInput || 'No Input',
        correctAnswer: number,
        explanation: `The cognitive load exceeded your current working memory capacity at Level ${level}.`
      }]);
      recordQuizResult('Number Memory', level - 1, level, [{
        question: `Level ${level} Sequence`,
        userAnswer: userInput || 'No Input',
        correctAnswer: number,
        explanation: `The cognitive load exceeded your current working memory capacity at Level ${level}.`
      }]);
    }
  };

  const renderGame = () => {
    switch (activeGame) {
      case 'chess':
        return <ChessGame onXpChange={onXpChange} soundEnabled={soundEnabled} currentXp={currentXp} />;
      case 'word-scramble':
        return <WordScramble onXpChange={onXpChange} soundEnabled={soundEnabled} />;
      case 'speed-blitz':
        return <SpeedBlitz onXpChange={onXpChange} soundEnabled={soundEnabled} />;
      case 'synonym-duel':
        return <SynonymDuel onXpChange={onXpChange} soundEnabled={soundEnabled} />;
      case 'pronunciation-quiz':
        return <PronunciationQuiz onXpChange={onXpChange} soundEnabled={soundEnabled} />;
      case 'memory-palace':
        return <MemoryPalace onXpChange={onXpChange} soundEnabled={soundEnabled} />;
      case 'mental-math':
        return <MentalMath onXpChange={onXpChange} onClose={() => setActiveGame(null)} />;
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
              <div className="space-y-12 py-12 text-center animate-in fade-in max-w-4xl mx-auto">
                <div className="space-y-4">
                  <span className="text-[10px] font-sans font-bold text-red-500 uppercase tracking-[0.3em]">Sequence Terminated</span>
                  <h2 className="text-6xl font-serif font-bold text-ink leading-tight">Academic<br />Performance.</h2>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                  <div className="space-y-8">
                    <div className="p-8 bg-red-50 rounded-sm border border-red-100 space-y-6 text-left">
                      <div className="space-y-2">
                        <span className="text-[10px] font-sans font-bold text-red-400 uppercase tracking-[0.2em]">Expected Sequence</span>
                        <p className="text-4xl font-serif font-bold text-red-900 tracking-tighter">{number}</p>
                      </div>
                      <div className="space-y-2">
                        <span className="text-[10px] font-sans font-bold text-red-400 uppercase tracking-[0.2em]">Your Input</span>
                        <p className="text-4xl font-serif font-bold text-red-900 tracking-tighter opacity-50">{userInput || 'No Input'}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
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
                      onClick={() => { setGameState('start'); setLevel(1); setScore(0); setUserInput(''); setMistakes([]); }}
                      className="w-full px-12 py-6 bg-ink text-white rounded-sm font-sans font-bold text-xs uppercase tracking-[0.2em] hover:bg-ink/90 transition-all shadow-xl"
                    >
                      Restart Protocol
                    </button>
                  </div>

                  <div className="text-left">
                    <GameAnalysis mistakes={mistakes} onClose={() => { setGameState('start'); setLevel(1); setScore(0); setUserInput(''); setMistakes([]); }} />
                  </div>
                </div>
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
                onClick={() => { setActiveGame('chess'); incrementStat('gamesPlayed'); }}
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
                onClick={() => { setActiveGame('word-scramble'); incrementStat('gamesPlayed'); }}
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
                onClick={() => { setActiveGame('speed-blitz'); incrementStat('gamesPlayed'); }}
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

              <button 
                onClick={() => { setActiveGame('synonym-duel'); incrementStat('gamesPlayed'); }}
                className="group text-left space-y-6"
              >
                <div className="w-16 h-16 bg-bg-primary rounded-sm border border-ink/5 flex items-center justify-center text-accent-gold group-hover:bg-ink group-hover:text-white transition-all duration-500">
                  <span className="text-2xl">⚔️</span>
                </div>
                <div className="space-y-2">
                  <h3 className="text-3xl font-serif font-bold text-ink group-hover:text-accent-gold transition-colors">Synonym Duel</h3>
                  <p className="text-sm font-sans text-ink/60 leading-relaxed">Can you identify the closest synonym? The GRE loves testing these subtle nuances.</p>
                </div>
                <div className="flex items-center gap-2 text-[10px] font-sans font-bold text-ink/30 uppercase tracking-[0.2em] group-hover:text-ink transition-colors">
                  Initiate Protocol <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </button>

              <button 
                onClick={() => { setActiveGame('pronunciation-quiz'); incrementStat('gamesPlayed'); }}
                className="group text-left space-y-6"
              >
                <div className="w-16 h-16 bg-bg-primary rounded-sm border border-ink/5 flex items-center justify-center text-accent-gold group-hover:bg-ink group-hover:text-white transition-all duration-500">
                  <Volume2 size={24} />
                </div>
                <div className="space-y-2">
                  <h3 className="text-3xl font-serif font-bold text-ink group-hover:text-accent-gold transition-colors">Pronunciation Quiz</h3>
                  <p className="text-sm font-sans text-ink/60 leading-relaxed">Identify words based on their auditory pronunciation. Master the sounds of the lexicon.</p>
                </div>
                <div className="flex items-center gap-2 text-[10px] font-sans font-bold text-ink/30 uppercase tracking-[0.2em] group-hover:text-ink transition-colors">
                  Initiate Protocol <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </button>

              <button 
                onClick={() => { setActiveGame('memory-palace'); incrementStat('gamesPlayed'); }}
                className="group text-left space-y-6"
              >
                <div className="w-16 h-16 bg-bg-primary rounded-sm border border-ink/5 flex items-center justify-center text-accent-gold group-hover:bg-ink group-hover:text-white transition-all duration-500">
                  <BookMarked size={24} />
                </div>
                <div className="space-y-2">
                  <h3 className="text-3xl font-serif font-bold text-ink group-hover:text-accent-gold transition-colors">Memory Palace</h3>
                  <p className="text-sm font-sans text-ink/60 leading-relaxed">Associate words with spatial positions in a 3x3 grid. Sharpen your visual-spatial recall.</p>
                </div>
                <div className="flex items-center gap-2 text-[10px] font-sans font-bold text-ink/30 uppercase tracking-[0.2em] group-hover:text-ink transition-colors">
                  Initiate Protocol <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </button>

              <button 
                onClick={() => { setActiveGame('mental-math'); incrementStat('gamesPlayed'); }}
                className="group text-left space-y-6"
              >
                <div className="w-16 h-16 bg-bg-primary rounded-sm border border-ink/5 flex items-center justify-center text-accent-gold group-hover:bg-ink group-hover:text-white transition-all duration-500">
                  <Zap size={24} />
                </div>
                <div className="space-y-2">
                  <h3 className="text-3xl font-serif font-bold text-ink group-hover:text-accent-gold transition-colors">Mental Math Blitz</h3>
                  <p className="text-sm font-sans text-ink/60 leading-relaxed">Fast-paced quantitative patterns. Exponents, squares, and quick arithmetic.</p>
                </div>
                <div className="flex items-center gap-2 text-[10px] font-sans font-bold text-ink/30 uppercase tracking-[0.2em] group-hover:text-ink transition-colors">
                  Initiate Protocol <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </button>
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
  const [mistakes, setMistakes] = useState<Mistake[]>([]);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const sessionCorrectRef = useRef(0);
  const sessionTotalRef = useRef(0);

  useEffect(() => {
    return () => {
      if (sessionTotalRef.current > 0) {
        const newXp = recordQuizResult('Verbal', sessionCorrectRef.current, sessionTotalRef.current);
        onXpChange(newXp);
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
        setMistakes(prev => [...prev, {
          question: currentQuestion.sentence || currentQuestion.passage || 'Verbal Question',
          userAnswer: ans,
          correctAnswer: currentQuestion.answers?.[0] || 'Unknown',
          explanation: currentQuestion.explanation
        }]);
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
      setMistakes(prev => [...prev, {
        question: currentQuestion.questions?.[questionIndex].q || 'RC Question',
        userAnswer: opt,
        correctAnswer: currentQuestion.questions?.[questionIndex].answer || 'Unknown',
        explanation: currentQuestion.explanation
      }]);
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
      setMistakes(prev => [...prev, {
        question: currentQuestion.sentence || currentQuestion.passage || 'TC Question',
        userAnswer: blankSelections.join(', '),
        correctAnswer: currentQuestion.answers?.join(', ') || 'Unknown',
        explanation: currentQuestion.explanation
      }]);
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
      setMistakes(prev => [...prev, {
        question: currentQuestion.sentence || currentQuestion.passage || 'SE Question',
        userAnswer: selectedAnswers.join(', '),
        correctAnswer: currentQuestion.answers?.join(', ') || 'Unknown',
        explanation: currentQuestion.explanation
      }]);
    }
  };

  const nextQuestion = () => {
    if (sessionTotalRef.current > 0 && sessionTotalRef.current % 5 === 0) {
      setShowAnalysis(true);
      return;
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

  if (showAnalysis) {
    const c = sessionCorrect;
    const t = sessionTotal;
    return (
      <div className="space-y-12 py-12 text-center animate-in fade-in max-w-4xl mx-auto">
        <div className="space-y-4">
          <span className="text-[10px] font-sans font-bold text-accent-gold uppercase tracking-[0.3em]">Checkpoint Reached</span>
          <h2 className="text-6xl font-serif font-bold text-ink leading-tight">Verbal<br />Analysis.</h2>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          <div className="p-12 bg-white rounded-sm border border-ink/5 shadow-xl space-y-8">
            <div className="space-y-2">
              <span className="text-[10px] font-sans font-bold text-ink/30 uppercase tracking-[0.2em]">Accuracy</span>
              <p className="text-7xl font-serif font-bold text-ink tracking-tighter">{Math.round((c / t) * 100)}%</p>
            </div>
            <div className="flex justify-between items-center border-t border-ink/5 pt-8">
              <div className="text-left">
                <span className="text-[10px] font-sans font-bold text-ink/30 uppercase tracking-[0.2em]">Correct</span>
                <p className="text-2xl font-serif font-bold text-teal-500">{c}</p>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-sans font-bold text-ink/30 uppercase tracking-[0.2em]">Total</span>
                <p className="text-2xl font-serif font-bold text-ink">{t}</p>
              </div>
            </div>
            <button 
              onClick={() => {
                sessionCorrectRef.current = 0;
                sessionTotalRef.current = 0;
                setSessionCorrect(0);
                setSessionTotal(0);
                setMistakes([]);
                setShowAnalysis(false);
                recordQuizResult('Verbal', c, t, mistakes);
                setCurrentIndex((prev) => (prev + 1) % GRE_VERBAL.length);
                setSelectedAnswers([]);
                setBlankSelections([]);
                setRcAnswers({});
                setShowExplanation(false);
                setIsCorrect(null);
                setTimer(0);
                setIsTimerActive(true);
              }}
              className="w-full px-12 py-6 bg-ink text-white rounded-sm font-sans font-bold text-xs uppercase tracking-[0.2em] hover:bg-ink/90 transition-all shadow-xl"
            >
              Continue Practice
            </button>
          </div>

          <div className="text-left">
            <GameAnalysis mistakes={mistakes} onClose={() => {
              sessionCorrectRef.current = 0;
              sessionTotalRef.current = 0;
              setSessionCorrect(0);
              setSessionTotal(0);
              setMistakes([]);
              setShowAnalysis(false);
              recordQuizResult('Verbal', c, t, mistakes);
              setCurrentIndex((prev) => (prev + 1) % GRE_VERBAL.length);
              setSelectedAnswers([]);
              setBlankSelections([]);
              setRcAnswers({});
              setShowExplanation(false);
              setIsCorrect(null);
              setTimer(0);
              setIsTimerActive(true);
            }} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-ink/5 pb-12">
        <div className="space-y-4">
          <span className="text-[10px] font-sans font-bold text-accent-gold uppercase tracking-[0.3em]">Verbal Reasoning</span>
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-serif font-bold text-ink leading-tight">
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
                            const wordData = ALL_GRE_WORDS.find(w => w.word.toLowerCase() === ans.toLowerCase());
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

const StudyNotes = () => {
  const [activeTab, setActiveTab] = useState<'verbal' | 'quantitative'>('verbal');

  return (
    <div className="space-y-8">
      <div className="flex justify-center">
        <div className="flex bg-bg-primary p-1 rounded-sm border border-ink/5">
          <button 
            onClick={() => setActiveTab('verbal')}
            className={`px-8 py-3 text-[10px] font-sans font-bold uppercase tracking-widest transition-all ${activeTab === 'verbal' ? 'bg-white text-ink shadow-sm' : 'text-ink/30 hover:text-ink/60'}`}
          >
            Verbal Lexicon
          </button>
          <button 
            onClick={() => setActiveTab('quantitative')}
            className={`px-8 py-3 text-[10px] font-sans font-bold uppercase tracking-widest transition-all ${activeTab === 'quantitative' ? 'bg-white text-ink shadow-sm' : 'text-ink/30 hover:text-ink/60'}`}
          >
            Quantitative Guide
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === 'verbal' ? <VerbalNotes /> : <QuantitativeNotes />}
        </motion.div>
      </AnimatePresence>
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
  const [showCheatSheet, setShowCheatSheet] = useState(false);
  const [sessionCorrect, setSessionCorrect] = useState(0);
  const [sessionTotal, setSessionTotal] = useState(0);
  const [mistakes, setMistakes] = useState<Mistake[]>([]);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const sessionCorrectRef = useRef(0);
  const sessionTotalRef = useRef(0);

  useEffect(() => {
    return () => {
      if (sessionTotalRef.current > 0) {
        const newXp = recordQuizResult('Quantitative', sessionCorrectRef.current, sessionTotalRef.current);
        onXpChange(newXp);
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
      setMistakes(prev => [...prev, {
        question: currentQuestion.type === 'QC' ? `Compare Quantity A: ${currentQuestion.colA} and Quantity B: ${currentQuestion.colB}` : currentQuestion.question || 'Quantitative Question',
        userAnswer: ans,
        correctAnswer: currentQuestion.answer,
        explanation: currentQuestion.explanation
      }]);
    }
  };

  const nextQuestion = () => {
    if (sessionTotalRef.current > 0 && sessionTotalRef.current % 5 === 0) {
      setShowAnalysis(true);
      return;
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

  if (showAnalysis) {
    const c = sessionCorrect;
    const t = sessionTotal;
    return (
      <div className="space-y-12 py-12 text-center animate-in fade-in max-w-4xl mx-auto">
        <div className="space-y-4">
          <span className="text-[10px] font-sans font-bold text-accent-gold uppercase tracking-[0.3em]">Checkpoint Reached</span>
          <h2 className="text-6xl font-serif font-bold text-ink leading-tight">Quantitative<br />Analysis.</h2>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          <div className="p-12 bg-white rounded-sm border border-ink/5 shadow-xl space-y-8">
            <div className="space-y-2">
              <span className="text-[10px] font-sans font-bold text-ink/30 uppercase tracking-[0.2em]">Accuracy</span>
              <p className="text-7xl font-serif font-bold text-ink tracking-tighter">{Math.round((c / t) * 100)}%</p>
            </div>
            <div className="flex justify-between items-center border-t border-ink/5 pt-8">
              <div className="text-left">
                <span className="text-[10px] font-sans font-bold text-ink/30 uppercase tracking-[0.2em]">Correct</span>
                <p className="text-2xl font-serif font-bold text-teal-500">{c}</p>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-sans font-bold text-ink/30 uppercase tracking-[0.2em]">Total</span>
                <p className="text-2xl font-serif font-bold text-ink">{t}</p>
              </div>
            </div>
            <button 
              onClick={() => {
                sessionCorrectRef.current = 0;
                sessionTotalRef.current = 0;
                setSessionCorrect(0);
                setSessionTotal(0);
                setMistakes([]);
                setShowAnalysis(false);
                recordQuizResult('Quantitative', c, t, mistakes);
                setCurrentIndex((prev) => (prev + 1) % GRE_QUANT.length);
                setSelectedAnswer(null);
                setShowExplanation(false);
                setIsCorrect(null);
                setTimer(0);
                setTimeout(() => setIsTimerActive(true), 0);
                setNeInput('');
              }}
              className="w-full px-12 py-6 bg-ink text-white rounded-sm font-sans font-bold text-xs uppercase tracking-[0.2em] hover:bg-ink/90 transition-all shadow-xl"
            >
              Continue Practice
            </button>
          </div>

          <div className="text-left">
            <GameAnalysis mistakes={mistakes} onClose={() => {
              sessionCorrectRef.current = 0;
              sessionTotalRef.current = 0;
              setSessionCorrect(0);
              setSessionTotal(0);
              setMistakes([]);
              setShowAnalysis(false);
              recordQuizResult('Quantitative', c, t, mistakes);
              setCurrentIndex((prev) => (prev + 1) % GRE_QUANT.length);
              setSelectedAnswer(null);
              setShowExplanation(false);
              setIsCorrect(null);
              setTimer(0);
              setTimeout(() => setIsTimerActive(true), 0);
              setNeInput('');
            }} />
          </div>
        </div>
      </div>
    );
  }

  if (showCheatSheet) {
    return (
      <div className="py-12">
        <MathCheatSheet onClose={() => setShowCheatSheet(false)} />
      </div>
    );
  }

  return (
    <div className="space-y-8 md:space-y-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 md:gap-8 border-b border-ink/5 pb-8 md:pb-12">
        <div className="space-y-4">
          <span className="text-[10px] font-sans font-bold text-accent-gold uppercase tracking-[0.3em]">Quantitative Reasoning</span>
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-serif font-bold text-ink leading-tight">
            Mathematical Analysis.
          </h1>
        </div>
        <div className="flex items-center justify-between md:justify-end gap-8">
          <div className="text-left md:text-right">
            <span className="text-[10px] font-sans font-bold text-ink/30 uppercase tracking-[0.2em]">Time Elapsed</span>
            <p className="text-xl md:text-2xl font-serif font-bold text-ink">{formatTime(timer)}</p>
          </div>
          <button 
            onClick={() => setShowCalculator(!showCalculator)}
            className={`w-10 h-10 md:w-12 md:h-12 rounded-sm border flex items-center justify-center transition-all ${showCalculator ? 'bg-ink text-white border-ink' : 'bg-white text-ink/40 border-ink/5 hover:border-ink/20'}`}
          >
            <Calculator size={18} className="md:w-5 md:h-5" />
          </button>
          <button 
            onClick={() => setShowCheatSheet(!showCheatSheet)}
            className={`w-10 h-10 md:w-12 md:h-12 rounded-sm border flex items-center justify-center transition-all ${showCheatSheet ? 'bg-ink text-white border-ink' : 'bg-white text-ink/40 border-ink/5 hover:border-ink/20'}`}
          >
            <Book size={18} className="md:w-5 md:h-5" />
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-16">
        <div className="lg:col-span-8 space-y-8 md:space-y-12">
          <div className="p-6 md:p-12 bg-white rounded-sm border border-ink/5 shadow-sm relative">
            <div className="absolute top-0 left-0 w-1 h-full bg-accent-gold" />
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 md:mb-12">
              <span className="text-[10px] font-sans font-bold text-accent-gold uppercase tracking-[0.2em]">
                Problem {currentIndex + 1} of {GRE_QUANT.length}
              </span>
              <span className="text-[10px] font-sans font-bold text-ink/30 uppercase tracking-[0.2em]">
                Topic: {currentQuestion.topic}
              </span>
            </div>

            {currentQuestion.type === 'QC' && (
              <div className="space-y-8 md:space-y-12">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 md:gap-12">
                  <div className="space-y-4">
                    <h4 className="text-[10px] font-sans font-bold text-ink/30 uppercase tracking-[0.2em]">Quantity A</h4>
                    <p className="text-2xl md:text-3xl font-serif font-bold text-ink">{currentQuestion.colA}</p>
                  </div>
                  <div className="space-y-4">
                    <h4 className="text-[10px] font-sans font-bold text-ink/30 uppercase tracking-[0.2em]">Quantity B</h4>
                    <p className="text-2xl md:text-3xl font-serif font-bold text-ink">{currentQuestion.colB}</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-8 border-t border-ink/5">
                  {['A', 'B', 'C', 'D'].map((opt) => (
                    <button
                      key={opt}
                      onClick={() => handleAnswer(opt)}
                      className={`
                        group flex items-center gap-4 md:gap-6 p-4 md:p-6 rounded-sm border transition-all text-left
                        ${showExplanation && opt === currentQuestion.answer
                          ? 'bg-ink text-white border-ink'
                          : selectedAnswer === opt && opt !== currentQuestion.answer
                          ? 'bg-red-50 border-red-200 text-red-900'
                          : 'bg-white border-ink/5 hover:border-ink/20 text-ink/60'}
                      `}
                    >
                      <span className={`
                        w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center text-[10px] font-sans font-bold uppercase tracking-widest transition-colors shrink-0
                        ${(showExplanation && opt === currentQuestion.answer) || selectedAnswer === opt ? 'bg-white/20 text-white' : 'bg-bg-primary text-ink/30 group-hover:bg-ink group-hover:text-white'}
                      `}>
                        {opt}
                      </span>
                      <span className="text-xs md:text-sm font-sans font-medium">
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
              <div className="space-y-8 md:space-y-12">
                <p className="text-xl sm:text-2xl md:text-3xl font-serif font-bold text-ink leading-relaxed">{currentQuestion.question}</p>
                <div className="grid grid-cols-1 gap-4">
                  {currentQuestion.options?.map((opt, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleAnswer(opt)}
                      className={`
                        group flex items-center gap-4 md:gap-6 p-4 md:p-6 rounded-sm border transition-all text-left
                        ${showExplanation && opt === currentQuestion.answer
                          ? 'bg-ink text-white border-ink'
                          : selectedAnswer === opt && opt !== currentQuestion.answer
                          ? 'bg-red-50 border-red-200 text-red-900'
                          : 'bg-white border-ink/5 hover:border-ink/20 text-ink/60'}
                      `}
                    >
                      <span className={`
                        w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center text-[10px] font-sans font-bold uppercase tracking-widest transition-colors shrink-0
                        ${(showExplanation && opt === currentQuestion.answer) || selectedAnswer === opt ? 'bg-white/20 text-white' : 'bg-bg-primary text-ink/30 group-hover:bg-ink group-hover:text-white'}
                      `}>
                        {String.fromCharCode(65 + idx)}
                      </span>
                      <span className="text-base md:text-lg font-sans font-medium">{opt}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {currentQuestion.type === 'NE' && (
              <div className="space-y-8 md:space-y-12">
                <p className="text-xl sm:text-2xl md:text-3xl font-serif font-bold text-ink leading-relaxed">{currentQuestion.question}</p>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 md:gap-6">
                  <div className="flex-1 space-y-2">
                    <span className="text-[10px] font-sans font-bold text-ink/30 uppercase tracking-[0.2em]">Numeric Entry</span>
                    <input 
                      type="text" 
                      value={neInput}
                      onChange={(e) => setNeInput(e.target.value)}
                      placeholder="ENTER VALUE..."
                      className="w-full p-4 md:p-6 bg-bg-primary border border-ink/5 rounded-sm font-serif font-bold text-2xl md:text-3xl text-ink focus:ring-1 focus:ring-accent-gold/20 transition-all placeholder:text-ink/10"
                      onKeyDown={(e) => e.key === 'Enter' && handleAnswer(neInput.trim())}
                    />
                  </div>
                  <button 
                    onClick={() => handleAnswer(neInput.trim())}
                    disabled={!neInput.trim()}
                    className="sm:mt-6 px-8 md:px-12 py-4 md:py-6 bg-ink text-white rounded-sm font-sans font-bold text-xs uppercase tracking-[0.2em] hover:bg-ink/90 transition-all shadow-xl disabled:opacity-30 disabled:cursor-not-allowed"
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

// ─── DAILY CHALLENGE ─────────────────────────────────────────────────────────────

function DailyChallenge({ onBack, onXpChange }: { onBack: () => void, onXpChange: (xp: number) => void }) {
  const [words, setWords] = useState<Word[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [options, setOptions] = useState<string[]>([]);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [started, setStarted] = useState(false);
  const [done, setDone] = useState(hasDoneToday());
  const soundEnabled = getStorage(STORAGE_KEYS.settings, { soundEnabled: true }).soundEnabled;

  useEffect(() => {
    if (!done && started) {
      const challengeWords = getDailyChallenge();
      setWords(challengeWords);
      generateOptions(challengeWords[0]);
    }
  }, [done, started]);

  const generateOptions = (word: Word) => {
    const correct = word.definition;
    const others = [...ALL_GRE_WORDS]
      .filter(w => w.id !== word.id)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3)
      .map(w => w.definition);
    setOptions([correct, ...others].sort(() => Math.random() - 0.5));
    setSelectedOption(null);
    setIsCorrect(null);
  };

  const handleAnswer = (opt: string) => {
    if (selectedOption) return;
    setSelectedOption(opt);
    const correct = opt === words[currentIndex].definition;
    setIsCorrect(correct);
    if (correct) {
      setScore(s => s + 1);
      playSound('correct', soundEnabled);
    } else {
      playSound('wrong', soundEnabled);
    }

    setTimeout(() => {
      if (currentIndex < words.length - 1) {
        const nextIdx = currentIndex + 1;
        setCurrentIndex(nextIdx);
        generateOptions(words[nextIdx]);
      } else {
        setShowResult(true);
        markDailyDone(score + (correct ? 1 : 0));
        const finalScore = score + (correct ? 1 : 0);
        if (finalScore >= 7) {
          fireConfetti();
          playSound('levelup', soundEnabled);
        }
        const newXp = awardXP(XP_REWARDS.dailyChallenge);
        onXpChange(newXp);
      }
    }, 1500);
  };

  if (done && !showResult) {
    const todayResult = JSON.parse(localStorage.getItem(getDailyChallengeKey()) || '{}');
    return (
      <div className="flex flex-col items-center justify-center gap-6 md:gap-8 p-6 md:p-12 text-center min-h-[60vh] py-12">
        <div className="w-16 h-16 md:w-24 md:h-24 bg-bg-primary rounded-full border border-ink/5 flex items-center justify-center text-accent-gold mb-2 md:mb-4">
          <CheckCircle2 size={32} className="md:w-12 md:h-12" />
        </div>
        <div className="space-y-2 md:space-y-4">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-ink">Challenge Complete.</h2>
          <p className="text-base md:text-lg font-sans text-ink/60">You've already conquered today's lexical trial.</p>
          <div className="text-xl sm:text-2xl md:text-3xl font-serif font-bold text-accent-gold">Score: {todayResult.score}/10</div>
        </div>
        <button onClick={onBack} className="px-8 md:px-12 py-4 md:py-6 bg-ink text-white rounded-sm font-sans font-bold text-[10px] md:text-xs uppercase tracking-[0.2em] hover:bg-ink/90 transition-all shadow-xl">
          Return to Dashboard
        </button>
      </div>
    );
  }

  if (!started) {
    return (
      <div className="flex flex-col items-center justify-center gap-6 md:gap-8 p-6 md:p-12 text-center min-h-[60vh] py-12 max-w-2xl mx-auto">
        <div className="w-16 h-16 md:w-24 md:h-24 bg-bg-primary rounded-full border border-ink/5 flex items-center justify-center text-accent-gold mb-2 md:mb-4">
          <Zap size={32} className="md:w-12 md:h-12" />
        </div>
        <div className="space-y-2 md:space-y-4">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-ink">Daily Trial.</h2>
          <p className="text-base md:text-lg font-sans text-ink/60">10 words. One chance. Earn bonus XP and maintain your streak. All scholars face the same challenge today.</p>
        </div>
        <div className="flex flex-col gap-3 md:gap-4 w-full max-w-xs">
          <button onClick={() => setStarted(true)} className="px-8 md:px-12 py-4 md:py-6 bg-ink text-white rounded-sm font-sans font-bold text-[10px] md:text-xs uppercase tracking-[0.2em] hover:bg-ink/90 transition-all shadow-xl">
            Begin Challenge
          </button>
          <button onClick={onBack} className="px-8 md:px-12 py-3 md:py-4 text-ink/40 font-sans font-bold text-[8px] md:text-[10px] uppercase tracking-widest hover:text-ink transition-colors">
            Maybe Later
          </button>
        </div>
      </div>
    );
  }

  if (showResult) {
    return (
      <div className="flex flex-col items-center justify-center gap-6 md:gap-8 p-6 md:p-12 text-center min-h-[60vh] py-12">
        <div className="space-y-2 md:space-y-4">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-ink">Daily Result.</h2>
          <div className="text-5xl sm:text-7xl md:text-8xl font-serif font-bold text-accent-gold">{score}/10</div>
          <p className="text-base md:text-lg font-sans text-ink/60">Scholarly performance recorded.</p>
          <p className="text-xs md:text-sm font-sans text-accent-gold font-bold uppercase tracking-widest">+50 XP Awarded</p>
        </div>
        <button onClick={onBack} className="px-8 md:px-12 py-4 md:py-6 bg-ink text-white rounded-sm font-sans font-bold text-[10px] md:text-xs uppercase tracking-[0.2em] hover:bg-ink/90 transition-all shadow-xl">
          Return to Dashboard
        </button>
      </div>
    );
  }

  if (words.length === 0) return null;

  const currentWord = words[currentIndex];

  return (
    <div className="max-w-3xl mx-auto w-full space-y-8 md:space-y-12 p-4 md:p-8">
      <div className="flex items-center justify-between border-b border-ink/5 pb-6 md:pb-8">
        <div className="space-y-1">
          <span className="text-[8px] md:text-[10px] font-sans font-bold text-ink/30 uppercase tracking-[0.2em]">Daily Challenge</span>
          <h2 className="text-2xl md:text-3xl font-serif font-bold text-ink">Question {currentIndex + 1}/10</h2>
        </div>
        <div className="w-32 md:w-48 h-1 bg-ink/5 rounded-full overflow-hidden">
          <div 
            className="h-full bg-accent-gold transition-all duration-500" 
            style={{ width: `${((currentIndex + 1) / 10) * 100}%` }}
          />
        </div>
      </div>

      <div className="space-y-8 md:space-y-12">
        <div className="text-center space-y-2 md:space-y-4">
          <span className="text-[8px] md:text-[10px] font-sans font-bold text-accent-gold uppercase tracking-[0.3em]">Identify Definition</span>
          <h3 className="text-3xl sm:text-5xl md:text-6xl font-serif font-bold text-ink break-words">{currentWord.word}</h3>
        </div>

        <div className="grid grid-cols-1 gap-3 md:gap-4">
          {options.map((opt, idx) => (
            <button
              key={idx}
              onClick={() => handleAnswer(opt)}
              disabled={!!selectedOption}
              className={`
                group flex items-center gap-4 md:gap-6 p-4 md:p-6 rounded-sm border transition-all text-left
                ${selectedOption === opt 
                  ? (opt === currentWord.definition ? 'bg-ink text-white border-ink' : 'bg-red-50 border-red-200 text-red-900')
                  : (selectedOption && opt === currentWord.definition ? 'bg-teal-50 border-teal-200 text-teal-900' : 'bg-white border-ink/5 hover:border-ink/20 text-ink/60')}
              `}
            >
              <span className={`
                w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center text-[8px] md:text-[10px] font-sans font-bold uppercase tracking-widest transition-colors shrink-0
                ${selectedOption === opt ? 'bg-white/20 text-white' : 'bg-bg-primary text-ink/30 group-hover:bg-ink group-hover:text-white'}
              `}>
                {String.fromCharCode(65 + idx)}
              </span>
              <span className="text-sm md:text-lg font-sans font-medium leading-tight">{opt}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

const EtymologyExplorer = ({ onWordClick }: { onWordClick: (word: string) => void }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedRoot, setExpandedRoot] = useState<string | null>(null);

  const filteredRoots = useMemo(() => ETYMOLOGY_ROOTS.filter(item => 
    item.root.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.meaning.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.words.some(w => w.toLowerCase().includes(searchQuery.toLowerCase()))
  ), [searchQuery]);

  return (
    <div className="space-y-6">
      <div className="relative group">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-ink/20 group-focus-within:text-accent-gold transition-colors" />
        <input
          type="text"
          placeholder="Search roots, meanings, or words..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-12 pr-4 py-4 bg-white border border-ink/5 rounded-sm focus:ring-0 focus:border-accent-gold/20 outline-none transition-all text-xs font-sans font-bold uppercase tracking-widest placeholder:text-ink/10"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredRoots.map((item) => (
          <motion.div
            key={item.root}
            layout
            className="bg-white border border-ink/5 rounded-sm overflow-hidden hover:shadow-xl hover:shadow-ink/5 transition-all"
          >
            <button
              onClick={() => setExpandedRoot(expandedRoot === item.root ? null : item.root)}
              className="w-full p-6 text-left flex items-start justify-between group"
            >
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <span className="text-3xl font-bold text-ink font-serif tracking-tighter group-hover:text-accent-gold transition-colors">{item.root}</span>
                  <span className="px-2 py-0.5 bg-accent-gold/10 text-accent-gold text-[8px] font-sans font-bold uppercase rounded-full tracking-widest">
                    {item.language}
                  </span>
                </div>
                <p className="text-ink/40 font-serif italic text-sm">"{item.meaning}"</p>
              </div>
              <ChevronDown className={`w-5 h-5 text-ink/20 transition-transform duration-500 ${expandedRoot === item.root ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
              {expandedRoot === item.root && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="px-6 pb-6 border-t border-ink/5 bg-bg-primary/30"
                >
                  <div className="pt-6 space-y-6">
                    <div className="space-y-3">
                      <h4 className="text-[10px] font-sans font-bold text-ink/20 uppercase tracking-[0.2em]">Associated Words</h4>
                      <div className="flex flex-wrap gap-2">
                        {item.words.map(word => {
                          const isGreWord = ALL_GRE_WORDS.some(w => w.word.toLowerCase() === word.toLowerCase());
                          return (
                            <button
                              key={word}
                              onClick={() => isGreWord && onWordClick(word)}
                              className={`px-4 py-2 rounded-sm text-[10px] font-sans font-bold uppercase tracking-widest transition-all ${
                                isGreWord 
                                  ? 'bg-accent-gold text-white hover:bg-accent-gold/90 shadow-lg shadow-accent-gold/20' 
                                  : 'bg-white text-ink/40 border border-ink/5 cursor-default'
                              }`}
                            >
                              {word}
                              {isGreWord && <Zap size={10} className="inline-block ml-2 fill-current" />}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                    
                    <div className="p-4 bg-white rounded-sm border border-ink/5">
                      <h4 className="text-[10px] font-sans font-bold text-accent-gold uppercase tracking-[0.2em] mb-2">Mnemonic Aid</h4>
                      <p className="text-sm text-ink/60 italic leading-relaxed">
                        {item.mnemonic}
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>

      {filteredRoots.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-bold text-gray-900">No roots found</h3>
          <p className="text-gray-500">Try searching for a different root or word</p>
        </div>
      )}
    </div>
  );
};

const Vocabulary = ({ onBack, onXpChange, globalSearch, onSearchClear }: { onBack: () => void, onXpChange: (xp: number) => void, globalSearch?: string, onSearchClear?: () => void }) => {
  const [view, setView] = useState<'menu' | 'flashcards' | 'list' | 'practice' | 'etymology'>('menu');
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

  const currentWord = ALL_GRE_WORDS[currentIndex];

  const filteredWords = ALL_GRE_WORDS.filter(word => {
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
    setCurrentIndex((prev) => (prev + 1) % ALL_GRE_WORDS.length);
    playSound('flip', soundEnabled);
    incrementStat('wordsStudied');
  };

  const prevWord = () => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev - 1 + ALL_GRE_WORDS.length) % ALL_GRE_WORDS.length);
    playSound('flip', soundEnabled);
    incrementStat('wordsStudied');
  };

  const startPractice = () => {
    setView('practice');
    generatePracticeOptions(currentIndex);
  };

  const generatePracticeOptions = (index: number) => {
    const correct = ALL_GRE_WORDS[index].definition;
    const others = ALL_GRE_WORDS
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
    const nextIdx = (currentIndex + 1) % ALL_GRE_WORDS.length;
    setCurrentIndex(nextIdx);
    generatePracticeOptions(nextIdx);
    playSound('flip', soundEnabled);
  };

  if (view === 'menu') {
    return (
      <div className="space-y-8 md:space-y-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <button
          onClick={onBack}
          className="group flex items-center gap-3 text-[10px] font-sans font-bold text-ink/30 uppercase tracking-[0.2em] hover:text-ink transition-colors mb-4 md:mb-8"
        >
          <ArrowRight size={14} className="rotate-180 group-hover:-translate-x-1 transition-transform" />
          Back to Dashboard
        </button>
        <header className="max-w-3xl">
          <h1 className="text-5xl sm:text-7xl md:text-8xl font-serif font-bold text-ink leading-[0.9] mb-6 md:mb-8">
            Lexical<br />Mastery.
          </h1>
          <p className="text-lg md:text-xl font-sans text-ink/60 leading-relaxed max-w-2xl">
            A systematic approach to high-frequency GRE vocabulary. 
            Master the nuances of the Digital Lexicon through focused study.
          </p>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 md:gap-12 border-t border-ink/5 pt-12">
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
            onClick={() => setView('etymology')}
            className="group text-left space-y-6"
          >
            <div className="w-16 h-16 bg-bg-primary rounded-sm border border-ink/5 flex items-center justify-center text-accent-gold group-hover:bg-ink group-hover:text-white transition-all duration-500">
              <BookMarked size={24} />
            </div>
            <div className="space-y-2">
              <h3 className="text-3xl font-serif font-bold text-ink group-hover:text-accent-gold transition-colors">Etymology Explorer</h3>
              <p className="text-sm font-sans text-ink/60 leading-relaxed">Master Latin and Greek roots to unlock the meaning of thousands of words.</p>
            </div>
            <div className="flex items-center gap-2 text-[10px] font-sans font-bold text-ink/30 uppercase tracking-[0.2em] group-hover:text-ink transition-colors">
              Explore Origins <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
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

  if (view === 'etymology') {
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
            Etymology Explorer
          </div>
        </div>

        <header className="max-w-2xl">
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-ink leading-tight mb-6">Root Origins.</h2>
          <p className="text-base md:text-lg font-sans text-ink/60 leading-relaxed">
            Unlock thousands of words by mastering their Latin and Greek roots. 
            One root family can reveal the meaning of dozens of GRE-level terms.
          </p>
        </header>

        <EtymologyExplorer onWordClick={(word) => {
          const index = ALL_GRE_WORDS.findIndex(w => w.word.toLowerCase() === word.toLowerCase());
          if (index !== -1) {
            setCurrentIndex(index);
            setView('flashcards');
            setIsFlipped(false);
          }
        }} />
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
            Word {currentIndex + 1} of {ALL_GRE_WORDS.length}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          <div className="lg:col-span-8 space-y-12">
            <div className="p-12 bg-white rounded-sm border border-ink/5 shadow-sm relative">
              <div className="absolute top-0 left-0 w-1 h-full bg-accent-gold" />
              <p className="text-[10px] font-sans font-bold text-ink/30 uppercase tracking-[0.3em] mb-8">
                Identify the Definition
              </p>
              <h2 className="text-4xl sm:text-5xl md:text-6xl font-serif font-bold text-ink mb-4">{currentWord.word}</h2>
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
      <div className="space-y-8 md:space-y-12 max-w-4xl mx-auto px-4 md:px-0">
        <div className="flex items-center justify-between border-b border-ink/5 pb-6 md:pb-8">
          <button 
            onClick={() => setView('menu')} 
            className="group flex items-center gap-2 md:gap-3 text-[8px] md:text-[10px] font-sans font-bold text-ink/30 uppercase tracking-[0.2em] hover:text-ink transition-colors"
          >
            <X size={12} className="md:w-[14px] md:h-[14px]" /> Terminate Session
          </button>
          <div className="text-[8px] md:text-[10px] font-sans font-bold text-ink/30 uppercase tracking-[0.2em]">
            Card {currentIndex + 1} of {ALL_GRE_WORDS.length}
          </div>
        </div>

        <div className="h-[400px] md:h-[500px] relative cursor-pointer" style={{ perspective: '1000px' }} onClick={() => { setIsFlipped(!isFlipped); if (!isFlipped) incrementStat('wordsStudied'); }}>
          <motion.div 
            className="w-full h-full relative shadow-2xl"
            style={{ transformStyle: 'preserve-3d' }}
            animate={{ rotateY: isFlipped ? 180 : 0 }}
            transition={{ type: "spring", stiffness: 100, damping: 20 }}
          >
            {/* Front */}
            <div 
              className="absolute inset-0 bg-white rounded-sm border border-ink/5 flex flex-col items-center justify-center p-8 md:p-16 text-center"
              style={{ backfaceVisibility: 'hidden' }}
            >
              <div className="absolute top-4 left-4 flex gap-2">
                <span className="text-[8px] md:text-[10px] font-sans font-bold text-accent-gold uppercase tracking-[0.3em]">
                  {currentWord.category}
                </span>
                <span className={`text-[8px] md:text-[10px] font-sans font-bold uppercase tracking-[0.2em] px-2 py-0.5 rounded-full ${currentWord.id > 1000 ? 'bg-blue-50 text-blue-500' : 'bg-bg-primary text-ink/30'}`}>
                  {currentWord.id > 1000 ? 'Flash Review' : 'Manhattan Prep'}
                </span>
              </div>
              <div className="relative mb-4 md:mb-6 w-full">
                <h2 className="text-4xl sm:text-6xl md:text-8xl font-serif font-bold text-ink tracking-tight px-4 md:px-16 break-words">{currentWord.word}</h2>
                <button 
                  onClick={(e) => playPronunciation(currentWord.word, e)}
                  className="absolute -right-2 md:right-0 top-1/2 -translate-y-1/2 p-2 md:p-3 rounded-full bg-ink/5 text-ink/40 hover:bg-ink/10 hover:text-ink transition-colors"
                  title="Play pronunciation"
                >
                  <Volume2 size={18} className="md:w-6 md:h-6" />
                </button>
              </div>
              <p className="text-lg md:text-xl font-serif italic text-ink/30">{currentWord.pronunciation}</p>
              <div className="mt-8 md:mt-16 flex items-center gap-2 text-[8px] md:text-[10px] font-sans font-bold text-ink/10 uppercase tracking-[0.2em]">
                Tap to reveal definition
              </div>
            </div>

            {/* Back */}
            <div 
              className="absolute inset-0 bg-white rounded-sm border border-ink/5 flex flex-col p-8 md:p-16 overflow-y-auto"
              style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
            >
              <div className="flex items-center justify-between mb-8 md:mb-12">
                <div className="flex items-center gap-4">
                  <span className="text-[8px] md:text-[10px] font-sans font-bold text-ink/30 uppercase tracking-[0.2em]">{currentWord.pos}</span>
                  {currentWord.pronunciation && (
                    <span className="text-[8px] md:text-[10px] font-serif italic text-ink/20">[{currentWord.pronunciation}]</span>
                  )}
                </div>
                <button 
                  onClick={(e) => { e.stopPropagation(); toggleMastered(currentWord.id); }}
                  className={`p-2 md:p-3 rounded-sm transition-all ${masteredWords.includes(currentWord.id) ? 'bg-accent-gold text-white shadow-lg' : 'bg-ink/5 text-ink/20 hover:text-ink/40'}`}
                >
                  <CheckCircle2 size={18} className="md:w-6 md:h-6" />
                </button>
              </div>
              
              <div className="space-y-8 md:space-y-12">
                <div className="space-y-2 md:space-y-4">
                  <h4 className="text-[8px] md:text-[10px] font-sans font-bold text-ink/30 uppercase tracking-[0.2em]">Definition</h4>
                  <p className="text-xl md:text-3xl font-serif font-bold text-ink leading-tight">{currentWord.definition}</p>
                </div>

                {currentWord.synonyms && currentWord.synonyms.length > 0 && (
                  <div className="space-y-2 md:space-y-4">
                    <h4 className="text-[8px] md:text-[10px] font-sans font-bold text-ink/30 uppercase tracking-[0.2em]">Synonyms</h4>
                    <div className="flex flex-wrap gap-2">
                      {currentWord.synonyms.map(syn => (
                        <span key={syn} className="px-3 py-1 bg-bg-primary rounded-full text-xs font-sans text-ink/60 border border-ink/5">
                          {syn}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="p-4 md:p-8 bg-bg-primary rounded-sm border border-ink/5 border-l-4 border-l-accent-gold">
                  <h4 className="text-[8px] md:text-[10px] font-sans font-bold text-accent-gold uppercase tracking-[0.2em] mb-2 md:mb-4">Mnemonic</h4>
                  <p className="text-base md:text-lg font-sans text-ink/60 italic leading-relaxed">"{currentWord.mnemonic}"</p>
                </div>

                <div className="space-y-2 md:space-y-4">
                  <h4 className="text-[8px] md:text-[10px] font-sans font-bold text-ink/30 uppercase tracking-[0.2em]">Contextual Usage</h4>
                  <p className="text-base md:text-lg font-sans text-ink/60 leading-relaxed italic">"{currentWord.example}"</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="flex items-center justify-center gap-6 md:gap-12 pt-6 md:pt-8">
          <button 
            onClick={prevWord}
            className="group flex items-center gap-2 md:gap-3 text-[8px] md:text-[10px] font-sans font-bold text-ink/30 uppercase tracking-[0.2em] hover:text-ink transition-colors"
          >
            <ArrowRight size={12} className="rotate-180 group-hover:-translate-x-1 transition-transform md:w-[14px] md:h-[14px]" /> Previous
          </button>
          <button 
            onClick={() => setIsFlipped(!isFlipped)}
            className="px-6 md:px-12 py-4 md:py-6 bg-ink text-white rounded-sm font-sans font-bold text-[10px] md:text-xs uppercase tracking-[0.2em] hover:bg-ink/90 transition-colors shadow-xl"
          >
            Flip Card
          </button>
          <button 
            onClick={nextWord}
            className="group flex items-center gap-2 md:gap-3 text-[8px] md:text-[10px] font-sans font-bold text-ink/30 uppercase tracking-[0.2em] hover:text-ink transition-colors"
          >
            Next <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform md:w-[14px] md:h-[14px]" />
          </button>
        </div>
      </div>
    );
  }

  if (view === 'list') {
    return (
    <div className="space-y-8 md:space-y-12">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 md:gap-8 border-b border-ink/5 pb-8 md:pb-12">
        <div className="space-y-2 md:space-y-4">
          <button 
            onClick={() => setView('menu')} 
            className="group flex items-center gap-2 md:gap-3 text-[8px] md:text-[10px] font-sans font-bold text-ink/30 uppercase tracking-[0.2em] hover:text-ink transition-colors"
          >
            <ArrowRight size={12} className="rotate-180 group-hover:-translate-x-1 transition-transform md:w-[14px] md:h-[14px]" /> Back to Menu
          </button>
          <h1 className="text-4xl md:text-6xl font-serif font-bold text-ink">Repository.</h1>
        </div>
        <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
          <div className="relative">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full appearance-none pl-4 pr-10 py-3 md:py-4 bg-white border border-ink/5 rounded-sm text-[8px] md:text-[10px] font-sans font-bold uppercase tracking-widest focus:ring-1 focus:ring-accent-gold/20 transition-all cursor-pointer"
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
              className="w-full pl-12 pr-12 py-3 md:py-4 bg-white border border-ink/5 rounded-sm text-xs md:text-sm font-sans focus:ring-1 focus:ring-accent-gold/20 transition-all placeholder:text-ink/20"
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
                  <th className="px-8 py-6 text-[10px] font-sans font-bold text-ink/30 uppercase tracking-[0.2em]">Synonyms</th>
                  <th className="px-8 py-6 text-[10px] font-sans font-bold text-ink/30 uppercase tracking-[0.2em]">Definition</th>
                  <th className="px-8 py-6 text-[10px] font-sans font-bold text-ink/30 uppercase tracking-[0.2em]">Mastery</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink/5">
                {searchQuery && filteredWords.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-8 py-12 text-center text-sm font-sans text-ink/30 italic">
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
                        <div className="flex flex-wrap gap-1 max-w-[200px]">
                          {word.synonyms?.slice(0, 3).map(syn => (
                            <span key={syn} className="text-[10px] font-sans text-ink/40 bg-bg-primary px-2 py-0.5 rounded-full border border-ink/5">
                              {syn}
                            </span>
                          )) || <span className="text-[10px] font-sans text-ink/20 italic">None</span>}
                        </div>
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

const VerbalNotes = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [viewMode, setViewMode] = useState<'lexicon' | 'flashcards'>('lexicon');
  const [currentFlashcardIndex, setCurrentFlashcardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const filteredWords = ALL_GRE_WORDS.filter(word => {
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

  const categories = ['All', ...Array.from(new Set(ALL_GRE_WORDS.map(w => w.category)))].sort();

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
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 md:gap-8 border-b border-ink/5 pb-8 md:pb-12 px-4 md:px-0">
        <div className="space-y-2 md:space-y-4">
          <span className="text-[8px] md:text-[10px] font-sans font-bold text-accent-gold uppercase tracking-[0.3em]">Scholarly Lexicon</span>
          <h1 className="text-4xl md:text-7xl font-serif font-bold text-ink leading-none tracking-tight">
            Scholarly<br />Lexicon.
          </h1>
          <p className="text-base md:text-xl font-sans text-ink/60 leading-relaxed max-w-2xl italic">
            A curated compendium of high-frequency GRE terminology, 
            meticulously annotated for the discerning academic.
          </p>
        </div>
        
        <div className="flex bg-bg-primary p-0.5 md:p-1 rounded-sm border border-ink/5 w-fit">
          <button 
            onClick={() => setViewMode('lexicon')}
            className={`px-4 md:px-6 py-2 md:py-3 text-[8px] md:text-[10px] font-sans font-bold uppercase tracking-widest transition-all ${viewMode === 'lexicon' ? 'bg-white text-ink shadow-sm' : 'text-ink/30 hover:text-ink/60'}`}
          >
            Lexicon
          </button>
          <button 
            onClick={() => {
              setViewMode('flashcards');
              setCurrentFlashcardIndex(0);
              setIsFlipped(false);
            }}
            className={`px-4 md:px-6 py-2 md:py-3 text-[8px] md:text-[10px] font-sans font-bold uppercase tracking-widest transition-all ${viewMode === 'flashcards' ? 'bg-white text-ink shadow-sm' : 'text-ink/30 hover:text-ink/60'}`}
          >
            Flashcards
          </button>
        </div>
      </header>

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

// ─── WORLD DAYS COMPONENT ──────────────────────────────────────────────────────
// Paste this into src/App.tsx before the main App() function,
// OR save as src/components/WorldDays.tsx and import it.
//
// DEPENDENCIES (must already exist in your project):
//   - WORLD_DAYS array from data.ts (paste WorldDays_data.ts content into data.ts)
//   - GRE_WORDS array from data.ts
//   - useState from React (already imported)
//
// WIRING (add to App.tsx section renderer):
//   {activeSection === 'worlddays' && <WorldDays />}
//
// SIDEBAR (add to nav items):
//   { id: 'worlddays', label: 'World Days', icon: '🌍' }

// ─── HELPER FUNCTIONS ──────────────────────────────────────────────────────────

const MONTH_NAMES_FULL = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December'
];
const MONTH_NAMES_SHORT = [
  'Jan','Feb','Mar','Apr','May','Jun',
  'Jul','Aug','Sep','Oct','Nov','Dec'
];

const CATEGORY_CONFIG: Record<string, { label: string; color: string; bg: string; border: string }> = {
  health:      { label:'Health',       color:'text-red-600 dark:text-red-400',      bg:'bg-red-50 dark:bg-red-900/20',      border:'border-red-200 dark:border-red-800' },
  environment: { label:'Environment',  color:'text-green-700 dark:text-green-400',  bg:'bg-green-50 dark:bg-green-900/20',  border:'border-green-200 dark:border-green-800' },
  education:   { label:'Education',    color:'text-blue-600 dark:text-blue-400',    bg:'bg-blue-50 dark:bg-blue-900/20',    border:'border-blue-200 dark:border-blue-800' },
  science:     { label:'Science',      color:'text-purple-600 dark:text-purple-400',bg:'bg-purple-50 dark:bg-purple-900/20',border:'border-purple-200 dark:border-purple-800' },
  culture:     { label:'Culture',      color:'text-orange-600 dark:text-orange-400',bg:'bg-orange-50 dark:bg-orange-900/20',border:'border-orange-200 dark:border-orange-800' },
  civic:       { label:'Civic',        color:'text-indigo-600 dark:text-indigo-400',bg:'bg-indigo-50 dark:bg-indigo-900/20',border:'border-indigo-200 dark:border-indigo-800' },
  awareness:   { label:'Awareness',    color:'text-pink-600 dark:text-pink-400',    bg:'bg-pink-50 dark:bg-pink-900/20',    border:'border-pink-200 dark:border-pink-800' },
  national:    { label:'National',     color:'text-amber-700 dark:text-amber-400',  bg:'bg-amber-50 dark:bg-amber-900/20',  border:'border-amber-200 dark:border-amber-800' },
  global:      { label:'Global',       color:'text-teal-600 dark:text-teal-400',    bg:'bg-teal-50 dark:bg-teal-900/20',    border:'border-teal-200 dark:border-teal-800' },
  food:        { label:'Food',         color:'text-lime-700 dark:text-lime-400',    bg:'bg-lime-50 dark:bg-lime-900/20',    border:'border-lime-200 dark:border-lime-800' },
  technology:  { label:'Technology',   color:'text-cyan-600 dark:text-cyan-400',    bg:'bg-cyan-50 dark:bg-cyan-900/20',    border:'border-cyan-200 dark:border-cyan-800' },
  memorial:    { label:'Memorial',     color:'text-gray-600 dark:text-gray-400',    bg:'bg-gray-50 dark:bg-gray-900/20',    border:'border-gray-200 dark:border-gray-700' },
  media:       { label:'Media',        color:'text-yellow-700 dark:text-yellow-400',bg:'bg-yellow-50 dark:bg-yellow-900/20',border:'border-yellow-200 dark:border-yellow-800' },
  cultural:    { label:'Cultural',     color:'text-rose-600 dark:text-rose-400',    bg:'bg-rose-50 dark:bg-rose-900/20',    border:'border-rose-200 dark:border-rose-800' },
  sports:      { label:'Sports',       color:'text-emerald-600 dark:text-emerald-400',bg:'bg-emerald-50 dark:bg-emerald-900/20',border:'border-emerald-200 dark:border-emerald-800' },
};

function getDaysUntilEvent(month: number, day: number): number {
  const now = new Date();
  const thisYear = new Date(now.getFullYear(), month - 1, day);
  if (thisYear.getTime() <= now.getTime()) {
    thisYear.setFullYear(now.getFullYear() + 1);
  }
  return Math.ceil((thisYear.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
}

function isTodayCheck(month: number, day: number): boolean {
  const now = new Date();
  return now.getMonth() + 1 === month && now.getDate() === day;
}

function isThisMonthCheck(month: number): boolean {
  return new Date().getMonth() + 1 === month;
}

// ─── DAY CARD SUB-COMPONENT ────────────────────────────────────────────────────

interface DayCardProps {
  day: WorldDay & { daysUntil?: number };
  showCountdown?: boolean;
  defaultExpanded?: boolean;
  key?: string | number;
}

const DayCard = ({
  day,
  showCountdown = false,
  defaultExpanded = false,
}: DayCardProps) => {
  const [expanded, setExpanded] = useState(defaultExpanded);
  const todayBadge = isTodayCheck(day.month, day.day);
  const cfg = CATEGORY_CONFIG[day.category] ?? CATEGORY_CONFIG.global;

  // Find linked GRE word in the word list
  const linkedWord = day.greWordId
    ? ALL_GRE_WORDS.find(w => w.id === day.greWordId) ?? null
    : ALL_GRE_WORDS.find(w => w.word.toLowerCase() === day.greWord?.toLowerCase()) ?? null;

  return (
    <div
      className={`rounded-2xl border overflow-hidden transition-all duration-200 cursor-pointer select-none
        ${todayBadge
          ? 'border-accent-gold bg-accent-gold/5 shadow-md shadow-accent-gold/15'
          : 'border-ink/8 dark:border-ink-dark/10 bg-secondary dark:bg-secondary-dark hover:border-accent-gold/40 hover:shadow-sm'
        }`}
      onClick={() => setExpanded(e => !e)}
    >
      {/* ── CARD HEADER ── */}
      <div className="flex items-start gap-2 md:gap-3 p-3 md:p-4">
        {/* Icon */}
        <div className={`w-10 h-10 md:w-11 md:h-11 rounded-xl flex items-center justify-center text-lg md:text-xl flex-shrink-0 border ${cfg.bg} ${cfg.border}`}>
          {day.icon}
        </div>

        {/* Text */}
        <div className="flex-1 min-w-0">
          {/* Badges row */}
          <div className="flex flex-wrap items-center gap-1.5 mb-1">
            {todayBadge && (
              <span className="px-2 py-0.5 bg-accent-gold text-white text-[10px] font-bold rounded-full tracking-wide">
                TODAY
              </span>
            )}
            {showCountdown && day.daysUntil !== undefined && day.daysUntil > 0 && (
              <span className="px-2 py-0.5 bg-accent-gold/15 text-accent-gold text-[10px] font-bold rounded-full">
                in {day.daysUntil} day{day.daysUntil !== 1 ? 's' : ''}
              </span>
            )}
            <span className={`px-2 py-0.5 text-[10px] font-semibold rounded-full border ${cfg.bg} ${cfg.border} ${cfg.color}`}>
              {cfg.label}
            </span>
          </div>

          {/* Name */}
          <h3 className="font-semibold text-ink dark:text-ink-dark leading-snug text-sm">
            {day.name}
          </h3>

          {/* Date */}
          <p className="text-[11px] text-ink/40 dark:text-ink-dark/40 mt-0.5">
            {MONTH_NAMES_SHORT[day.month - 1]} {day.day}
            {day.greWord && (
              <span className="text-accent-gold ml-2">· {day.greWord}</span>
            )}
          </p>
        </div>

        {/* Chevron */}
        <span
          className={`text-ink/25 dark:text-ink-dark/25 text-xs mt-1 transition-transform duration-200 flex-shrink-0 ${expanded ? 'rotate-180' : ''}`}
        >
          ▼
        </span>
      </div>

      {/* ── EXPANDED BODY ── */}
      {expanded && (
        <div
          className="px-4 pb-4 flex flex-col gap-3 border-t border-ink/6 dark:border-ink-dark/8 pt-3"
          onClick={e => e.stopPropagation()}
        >
          {/* Description */}
          <p className="text-sm text-ink/80 dark:text-ink-dark/75 leading-relaxed">
            {day.description}
          </p>

          {/* GRE Word Connection */}
          {day.greWord && (
            <div className="rounded-xl border border-accent-gold/25 bg-accent-gold/8 p-3 flex gap-3 items-start">
              <span className="text-lg flex-shrink-0">📝</span>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] text-accent-gold/70 uppercase tracking-widest font-semibold mb-1">
                  GRE Word Connection
                </p>
                <div className="flex flex-wrap items-baseline gap-2">
                  <span className="text-accent-gold font-bold text-base">
                    {day.greWord}
                  </span>
                  <span className="text-xs text-ink/50 dark:text-ink-dark/50 italic">
                    {linkedWord
                      ? `— ${linkedWord.definition.slice(0, 70)}${linkedWord.definition.length > 70 ? '...' : ''}`
                      : day.greWordDef
                        ? `— ${day.greWordDef}`
                        : ''}
                  </span>
                </div>
                {linkedWord && (
                  <p className="text-[11px] text-ink/45 dark:text-ink-dark/45 mt-1.5 leading-relaxed">
                    💡 This day embodies what <em>{day.greWord}</em> means — a real-world anchor to remember it.
                  </p>
                )}
                {!linkedWord && day.greWordDef && (
                  <p className="text-[11px] text-ink/45 dark:text-ink-dark/45 mt-1.5 leading-relaxed">
                    💡 This word will appear in GRE verbal questions — today is a great time to learn it.
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// ─── MAIN WORLD DAYS COMPONENT ─────────────────────────────────────────────────

function WorldDays() {
  const today = new Date();
  const currentMonth = today.getMonth() + 1;

  const [view, setView] = useState<'today' | 'upcoming' | 'browse'>('today');
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [search, setSearch] = useState('');

  // ── Derived data ──────────────────────────────────────────────────────────────

  const todaysDays = WORLD_DAYS.filter(d => isTodayCheck(d.month, d.day));

  const upcomingDays = WORLD_DAYS
    .map(d => ({ ...d, daysUntil: getDaysUntilEvent(d.month, d.day) }))
    .filter(d => d.daysUntil >= 1 && d.daysUntil <= 7)
    .sort((a, b) => a.daysUntil - b.daysUntil);

  const browseDays = WORLD_DAYS
    .filter(d => d.month === selectedMonth)
    .filter(d => selectedCategory === 'all' || d.category === selectedCategory)
    .sort((a, b) => a.day - b.day);

  const searchResults = search.trim().length >= 2
    ? WORLD_DAYS.filter(d => {
        const q = search.toLowerCase();
        return (
          d.name.toLowerCase().includes(q) ||
          d.description.toLowerCase().includes(q) ||
          (d.greWord ?? '').toLowerCase().includes(q) ||
          (d.greWordDef ?? '').toLowerCase().includes(q) ||
          d.category.toLowerCase().includes(q)
        );
      }).sort((a, b) => a.month - b.month || a.day - b.day)
    : null;

  const allCategories = ['all', ...Object.keys(CATEGORY_CONFIG)];

  // Month counts for the grid
  const monthCounts = MONTH_NAMES_SHORT.map((_, i) =>
    WORLD_DAYS.filter(d => d.month === i + 1).length
  );

  // ── Render ────────────────────────────────────────────────────────────────────

  return (
    <div className="flex flex-col gap-3 md:gap-5 pb-8">

      {/* ── HEADER ── */}
      <div className="flex flex-col gap-1">
        <h1 className="text-xl md:text-2xl font-bold text-ink dark:text-ink-dark font-serif flex items-center gap-2">
          🌍 World Days
        </h1>
        <p className="text-xs md:text-sm text-ink/50 dark:text-ink-dark/50">
          {WORLD_DAYS.length} observances · Each linked to a GRE vocabulary word
        </p>
      </div>

      {/* ── SEARCH BAR ── */}
      <div className="relative">
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search days, descriptions, or GRE words…"
          className="w-full pl-9 pr-9 py-2.5 rounded-xl border border-ink/15 dark:border-ink-dark/15
            bg-secondary dark:bg-secondary-dark text-sm text-ink dark:text-ink-dark
            placeholder-ink/35 dark:placeholder-ink-dark/35
            focus:outline-none focus:border-accent-gold transition-colors"
        />
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-ink/30 dark:text-ink-dark/30 text-sm pointer-events-none">
          🔍
        </span>
        {search && (
          <button
            onClick={() => setSearch('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-ink/30 dark:text-ink-dark/30
              hover:text-ink/60 dark:hover:text-ink-dark/60 text-lg leading-none"
          >
            ×
          </button>
        )}
      </div>

      {/* ── SEARCH RESULTS ── */}
      {searchResults !== null ? (
        <div className="flex flex-col gap-3">
          <p className="text-xs text-ink/45 dark:text-ink-dark/45">
            {searchResults.length === 0
              ? `No results for "${search}"`
              : `${searchResults.length} result${searchResults.length !== 1 ? 's' : ''} for "${search}"`}
          </p>
          {searchResults.map(d => (
            <DayCard key={`${d.month}-${d.day}-${d.name}`} day={d} />
          ))}
        </div>
      ) : (
        <>
          {/* ── VIEW TABS ── */}
          <div className="flex gap-2 p-1 bg-ink/5 dark:bg-ink-dark/5 rounded-xl">
            {([
              { id: 'today',    label: "Today" },
              { id: 'upcoming', label: "Next 7 Days" },
              { id: 'browse',   label: "Browse" },
            ] as const).map(tab => (
              <button
                key={tab.id}
                onClick={() => setView(tab.id)}
                className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all
                  ${view === tab.id
                    ? 'bg-white dark:bg-secondary-dark text-ink dark:text-ink-dark shadow-sm'
                    : 'text-ink/50 dark:text-ink-dark/50 hover:text-ink/80 dark:hover:text-ink-dark/80'
                  }`}
              >
                {tab.label}
                {tab.id === 'today' && todaysDays.length > 0 && (
                  <span className="ml-1.5 px-1.5 py-0.5 bg-accent-gold text-white text-[9px] rounded-full">
                    {todaysDays.length}
                  </span>
                )}
                {tab.id === 'upcoming' && upcomingDays.length > 0 && (
                  <span className="ml-1.5 px-1.5 py-0.5 bg-accent-gold/20 text-accent-gold text-[9px] rounded-full">
                    {upcomingDays.length}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* ── TODAY VIEW ── */}
          {view === 'today' && (
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold text-accent-gold">
                  {today.toLocaleDateString('en-US', { weekday:'long', month:'long', day:'numeric', year:'numeric' })}
                </p>
                {todaysDays.length > 0 && (
                  <span className="text-xs text-ink/40 dark:text-ink-dark/40">
                    {todaysDays.length} observance{todaysDays.length !== 1 ? 's' : ''}
                  </span>
                )}
              </div>

              {todaysDays.length === 0 ? (
                <div className="flex flex-col items-center gap-4 py-12 text-center">
                  <span className="text-5xl">📅</span>
                  <div>
                    <p className="font-semibold text-ink/60 dark:text-ink-dark/60">
                      No major observances today
                    </p>
                    <p className="text-sm text-ink/40 dark:text-ink-dark/40 mt-1">
                      Check upcoming days or browse by month
                    </p>
                  </div>
                  <button
                    onClick={() => setView('upcoming')}
                    className="px-4 py-2 bg-accent-gold/15 text-accent-gold rounded-xl text-sm font-semibold hover:bg-accent-gold/25 transition-colors"
                  >
                    See next 7 days →
                  </button>
                </div>
              ) : (
                todaysDays.map(d => (
                  <DayCard key={`${d.month}-${d.day}-${d.name}`} day={d} defaultExpanded={true} />
                ))
              )}
            </div>
          )}

          {/* ── UPCOMING VIEW ── */}
          {view === 'upcoming' && (
            <div className="flex flex-col gap-3">
              <p className="text-xs text-ink/45 dark:text-ink-dark/45">
                {upcomingDays.length === 0
                  ? 'No major observances in the next 7 days'
                  : `${upcomingDays.length} observance${upcomingDays.length !== 1 ? 's' : ''} coming up`}
              </p>
              {upcomingDays.map(d => (
                <DayCard
                  key={`${d.month}-${d.day}-${d.name}`}
                  day={d}
                  showCountdown
                />
              ))}
            </div>
          )}

          {/* ── BROWSE VIEW ── */}
          {view === 'browse' && (
            <div className="flex flex-col gap-4">

              {/* Month grid */}
              <div>
                <p className="text-[11px] text-ink/40 dark:text-ink-dark/40 uppercase tracking-wider font-semibold mb-2">
                  Select Month
                </p>
                <div className="grid grid-cols-4 gap-1.5">
                  {MONTH_NAMES_SHORT.map((name, i) => {
                    const mNum = i + 1;
                    const isSelected = selectedMonth === mNum;
                    const isCurrent = isThisMonthCheck(mNum);
                    return (
                      <button
                        key={name}
                        onClick={() => setSelectedMonth(mNum)}
                        className={`py-2 px-1 rounded-xl text-[11px] font-semibold transition-all
                          ${isSelected
                            ? 'bg-accent-gold text-white shadow-sm'
                            : isCurrent
                              ? 'bg-accent-gold/15 text-accent-gold border border-accent-gold/30'
                              : 'bg-secondary dark:bg-secondary-dark text-ink/55 dark:text-ink-dark/55 hover:bg-accent-gold/10 border border-transparent'
                          }`}
                      >
                        {name}
                        <span className="block text-[9px] font-normal opacity-60 mt-0.5">
                          {monthCounts[i]}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Category filter */}
              <div>
                <p className="text-[11px] text-ink/40 dark:text-ink-dark/40 uppercase tracking-wider font-semibold mb-2">
                  Filter by Category
                </p>
                <div className="flex gap-1.5 flex-wrap">
                  {allCategories.map(cat => {
                    const isActive = selectedCategory === cat;
                    const cfg = CATEGORY_CONFIG[cat];
                    return (
                      <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`px-3 py-1 rounded-full text-[11px] font-semibold transition-all border
                          ${isActive
                            ? cat === 'all'
                              ? 'bg-accent-gold text-white border-accent-gold'
                              : `${cfg.bg} ${cfg.color} ${cfg.border} opacity-100`
                            : cat === 'all'
                              ? 'bg-transparent text-ink/50 dark:text-ink-dark/50 border-ink/15 dark:border-ink-dark/15 hover:border-accent-gold/40'
                              : `${cfg.bg} ${cfg.color} ${cfg.border} opacity-60 hover:opacity-100`
                          }`}
                      >
                        {cat === 'all' ? 'All' : cfg.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Month heading */}
              <div className="flex items-center justify-between">
                <h2 className="font-bold text-ink dark:text-ink-dark">
                  {MONTH_NAMES_FULL[selectedMonth - 1]}
                </h2>
                <span className="text-xs text-ink/40 dark:text-ink-dark/40">
                  {browseDays.length} observance{browseDays.length !== 1 ? 's' : ''}
                </span>
              </div>

              {/* Days */}
              {browseDays.length === 0 ? (
                <div className="text-center py-10 text-ink/40 dark:text-ink-dark/40 text-sm">
                  No observances match this filter.
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  {browseDays.map(d => (
                    <DayCard key={`${d.month}-${d.day}-${d.name}`} day={d} />
                  ))}
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}

// ─── DASHBOARD PREVIEW CARD ────────────────────────────────────────────────────
// Add this inside your Dashboard component where you want the card to appear.
// It needs setActiveSection to be in scope.

function WorldDaysDashboardCard({ onNavigate }: { onNavigate: () => void }) {
  const todaysDays = WORLD_DAYS.filter(d => isTodayCheck(d.month, d.day));
  const nextUp = WORLD_DAYS
    .map(d => ({ ...d, daysUntil: getDaysUntilEvent(d.month, d.day) }))
    .filter(d => d.daysUntil >= 1)
    .sort((a, b) => a.daysUntil - b.daysUntil)[0];

  return (
    <div
      onClick={onNavigate}
      className="bg-secondary dark:bg-secondary-dark rounded-2xl p-5 cursor-pointer border
        border-ink/6 dark:border-ink-dark/10 hover:border-accent-gold/40 hover:shadow-md transition-all"
    >
      {/* Header row */}
      <div className="flex items-center justify-between mb-3">
        <span className="font-semibold text-ink dark:text-ink-dark text-sm flex items-center gap-2">
          🌍 World Days
        </span>
        <span className="text-xs text-accent-gold font-semibold">View all →</span>
      </div>

      {todaysDays.length > 0 ? (
        <div className="flex flex-col gap-2.5">
          {todaysDays.slice(0, 2).map(d => (
            <div key={d.name} className="flex items-start gap-2.5">
              <span className="text-xl leading-none mt-0.5">{d.icon}</span>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-ink dark:text-ink-dark truncate">{d.name}</p>
                {d.greWord && (
                  <p className="text-xs text-accent-gold mt-0.5">
                    GRE word: <span className="font-semibold">{d.greWord}</span>
                  </p>
                )}
              </div>
            </div>
          ))}
          {todaysDays.length > 2 && (
            <p className="text-xs text-ink/35 dark:text-ink-dark/35">
              +{todaysDays.length - 2} more today
            </p>
          )}
        </div>
      ) : nextUp ? (
        <div className="flex items-start gap-3">
          <span className="text-2xl leading-none mt-0.5">{nextUp.icon}</span>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-ink dark:text-ink-dark">{nextUp.name}</p>
            <p className="text-xs text-ink/45 dark:text-ink-dark/45 mt-0.5">
              {MONTH_NAMES_SHORT[nextUp.month - 1]} {nextUp.day} · in {nextUp.daysUntil} day{nextUp.daysUntil !== 1 ? 's' : ''}
            </p>
            {nextUp.greWord && (
              <p className="text-xs text-accent-gold mt-0.5">
                GRE word: <span className="font-semibold">{nextUp.greWord}</span>
              </p>
            )}
          </div>
        </div>
      ) : (
        <p className="text-sm text-ink/40 dark:text-ink-dark/40">
          Explore {WORLD_DAYS.length} world observances →
        </p>
      )}
    </div>
  );
}

const Dashboard = ({ onNavigate }: { onNavigate: (section: string) => void }) => {
  const xp = getStorage(STORAGE_KEYS.xp, 0);
  const streak = getStorage(STORAGE_KEYS.streak, 0);
  const masteredWords = getStorage(STORAGE_KEYS.masteredWords, []);
  const quizHistory = getStorage(STORAGE_KEYS.quizHistory, []);
  const totalSeconds = getStorage(STORAGE_KEYS.studyTime, 0);
  const { level, title, progress, nextXP } = getLevelInfo(xp);

  const [timeLeft, setTimeLeft] = useState('');
  const dailyDone = hasDoneToday();
  const dailyWords = getDailyChallenge();
  const difficultyDist = {
    easy: dailyWords.filter(w => w.difficulty === 1).length,
    medium: dailyWords.filter(w => w.difficulty === 2).length,
    hard: dailyWords.filter(w => w.difficulty === 3).length,
  };

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayKey = `daily_${yesterday.getFullYear()}_${yesterday.getMonth()+1}_${yesterday.getDate()}`;
  const yesterdayResult = JSON.parse(localStorage.getItem(yesterdayKey) || 'null');

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const midnight = new Date();
      midnight.setHours(24, 0, 0, 0);
      const diff = midnight.getTime() - now.getTime();
      const h = Math.floor(diff / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      setTimeLeft(`${h}h ${m}m ${s}s`);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

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

  const behaviorWords = ALL_GRE_WORDS.filter(w => w.category?.toLowerCase() === 'behavior');
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
    <div className="space-y-8 md:space-y-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="max-w-4xl">
        <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-serif font-bold text-ink leading-[0.85] mb-8 md:mb-12 tracking-tighter">
          Academic<br />Attainment.
        </h1>
        <p className="text-lg md:text-2xl font-sans text-ink/60 leading-relaxed max-w-2xl font-light">
          A comprehensive audit of your cognitive progression across the Digital Lexicon. 
          Your trajectory indicates a significant mastery of high-frequency verbal patterns from our unified pool of {ALL_GRE_WORDS.length} words.
        </p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-16 border-y border-ink/5 py-12 md:py-20">
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 md:gap-20">
        <div className="lg:col-span-2 space-y-12 md:space-y-20">
          <section className="space-y-8 md:space-y-12 bg-white p-6 md:p-12 rounded-sm border border-ink/5 shadow-sm">
            <div className="flex items-end justify-between border-b border-ink/5 pb-6">
              <div className="space-y-1">
                <h2 className="text-[10px] font-sans font-bold text-ink/30 uppercase tracking-[0.4em]">Experience Trajectory</h2>
                <p className="text-xs font-sans font-bold text-accent-gold uppercase tracking-widest">{title}</p>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-sans font-bold text-ink/20 uppercase tracking-widest block mb-1">Current Standing</span>
                <span className="text-xs font-sans font-bold text-ink/40 uppercase tracking-widest">Level {level}</span>
              </div>
            </div>
            <div className="space-y-6 md:space-y-10">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div className="relative">
                  <span className="text-4xl sm:text-5xl md:text-7xl font-serif font-bold text-ink tracking-tighter">
                    {xp.toLocaleString()}
                  </span>
                  <span className="absolute -top-2 -right-8 text-sm md:text-lg text-accent-gold font-serif italic opacity-50">XP</span>
                </div>
                <div className="flex items-center gap-3 text-[10px] font-sans font-bold text-ink/40 uppercase tracking-widest">
                  <span className="w-8 h-[1px] bg-ink/10" />
                  {nextXP - xp} XP TO LEVEL {level + 1}
                </div>
              </div>
              <div className="relative pt-4">
                <div className="w-full h-[2px] bg-ink/5 rounded-full overflow-hidden">
                  <motion.div 
                    className="h-full bg-accent-gold"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 2, ease: [0.22, 1, 0.36, 1] }}
                  />
                </div>
                {/* Progress Markers */}
                <div className="absolute top-0 left-0 w-full flex justify-between px-1">
                  {[0, 25, 50, 75, 100].map(p => (
                    <div key={p} className={`w-[1px] h-2 ${progress >= p ? 'bg-accent-gold' : 'bg-ink/10'} transition-colors duration-1000`} />
                  ))}
                </div>
              </div>
            </div>
          </section>

          <section className="p-6 md:p-12 bg-bg-primary rounded-sm border border-ink/5 relative overflow-hidden group cursor-pointer" onClick={() => onNavigate('daily-challenge')}>
            <div className="absolute top-0 left-0 w-1 h-full bg-accent-gold" />
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 md:gap-8">
              <div className="space-y-4 md:space-y-6">
                <div className="space-y-2">
                  <span className="text-[10px] font-sans font-bold text-accent-gold uppercase tracking-[0.3em]">Daily Trial</span>
                  <h3 className="text-3xl md:text-4xl font-serif font-bold text-ink">
                    {dailyDone ? '✓ Completed.' : 'Today\'s Challenge.'}
                  </h3>
                </div>
                <div className="flex flex-wrap items-center gap-6 md:gap-8">
                  <div className="space-y-1">
                    <span className="text-[10px] font-sans font-bold text-ink/30 uppercase tracking-widest">Resets In</span>
                    <p className="text-sm font-mono font-bold text-ink">{timeLeft}</p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] font-sans font-bold text-ink/30 uppercase tracking-widest">Difficulty</span>
                    <div className="flex gap-1">
                      {Array.from({length: difficultyDist.easy}).map((_, i) => <div key={i} className="w-1 h-3 bg-teal-500/30 rounded-full" />)}
                      {Array.from({length: difficultyDist.medium}).map((_, i) => <div key={i} className="w-1 h-3 bg-accent-gold/30 rounded-full" />)}
                      {Array.from({length: difficultyDist.hard}).map((_, i) => <div key={i} className="w-1 h-3 bg-red-500/30 rounded-full" />)}
                    </div>
                  </div>
                  {yesterdayResult && (
                    <div className="space-y-1">
                      <span className="text-[10px] font-sans font-bold text-ink/30 uppercase tracking-widest">Yesterday</span>
                      <p className="text-sm font-sans font-bold text-ink">{yesterdayResult.score}/10</p>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-3 text-[10px] font-sans font-bold text-ink uppercase tracking-[0.2em] group-hover:translate-x-2 transition-transform">
                {dailyDone ? 'Review Results' : 'Initiate Challenge'} <ArrowRight size={14} />
              </div>
            </div>
          </section>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 md:gap-12">
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

        <aside className="space-y-8 md:space-y-12">
          <WorldDaysDashboardCard onNavigate={() => onNavigate('worlddays')} />
          <RecentAchievements />

          <section className="space-y-6 md:space-y-8">
            <h2 className="text-xs font-sans font-bold text-ink uppercase tracking-[0.3em] border-b border-ink/5 pb-4">Academic Accolades</h2>
            <div className="space-y-4 md:space-y-6">
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

          <section className="space-y-6 md:space-y-8">
            <h2 className="text-xs font-sans font-bold text-ink uppercase tracking-[0.3em] border-b border-ink/5 pb-4">Upcoming Goals</h2>
            <div className="space-y-3 md:space-y-4">
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

const Achievements = ({ onXpChange }: { onXpChange: (xp: number) => void }) => {
  const [stats, setStats] = useState<UserStats>(getUserStats());
  const [unlockedIds, setUnlockedIds] = useState<string[]>(getStorage(STORAGE_KEYS.unlockedAchievements, []));

  useEffect(() => {
    const currentStats = getUserStats();
    setStats(currentStats);
    
    const newlyUnlocked: Achievement[] = [];
    const currentUnlocked = [...unlockedIds];
    
    ACHIEVEMENTS.forEach(achievement => {
      if (!currentUnlocked.includes(achievement.id) && achievement.condition(currentStats)) {
        newlyUnlocked.push(achievement);
        currentUnlocked.push(achievement.id);
      }
    });

    if (newlyUnlocked.length > 0) {
      setUnlockedIds(currentUnlocked);
      setStorage(STORAGE_KEYS.unlockedAchievements, currentUnlocked);
      
      let totalXpReward = 0;
      newlyUnlocked.forEach(a => {
        totalXpReward += a.xpReward;
      });
      
      if (totalXpReward > 0) {
        const newXp = awardXP(totalXpReward);
        onXpChange(newXp);
        playSound('levelup', true);
      }
      
      fireConfetti();
    }
  }, []);

  const categories = [
    { name: 'Words', filter: (a: Achievement) => a.id.startsWith('word') || a.id === 'first_word' },
    { name: 'Streaks', filter: (a: Achievement) => a.id.startsWith('streak') },
    { name: 'Quizzes', filter: (a: Achievement) => a.id.startsWith('quiz') || a.id === 'perfect_quiz' },
    { name: 'XP', filter: (a: Achievement) => a.id.startsWith('xp') },
    { name: 'Games', filter: (a: Achievement) => a.id.startsWith('games') },
  ];

  return (
    <div className="space-y-8 md:space-y-12">
      <div className="space-y-2 md:space-y-4">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-ink tracking-tight">Achievements</h2>
        <p className="text-base md:text-lg font-sans text-ink/60 max-w-2xl">Your journey to GRE mastery, documented in milestones.</p>
      </div>

      <div className="grid grid-cols-1 gap-8 md:gap-12">
        {categories.map(cat => {
          const catAchievements = ACHIEVEMENTS.filter(cat.filter);
          const unlockedCount = catAchievements.filter(a => unlockedIds.includes(a.id)).length;
          const progress = (unlockedCount / catAchievements.length) * 100;

          return (
            <div key={cat.name} className="space-y-4 md:space-y-6">
              <div className="flex items-end justify-between border-b border-ink/5 pb-3 md:pb-4">
                <div className="space-y-1">
                  <h3 className="text-xl md:text-2xl font-serif font-bold text-ink">{cat.name}</h3>
                  <p className="text-[8px] md:text-[10px] font-sans font-bold text-ink/30 uppercase tracking-widest">
                    {unlockedCount} of {catAchievements.length} Unlocked
                  </p>
                </div>
                <div className="w-32 md:w-48 h-1 bg-bg-primary rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    className="h-full bg-accent-gold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
                {catAchievements.map(achievement => {
                  const isUnlocked = unlockedIds.includes(achievement.id);
                  return (
                    <div 
                      key={achievement.id}
                      className={`
                        p-4 md:p-6 rounded-sm border transition-all duration-500
                        ${isUnlocked 
                          ? 'bg-white border-ink/10 shadow-xl shadow-ink/5' 
                          : 'bg-bg-primary/50 border-ink/5 opacity-60 grayscale'}
                      `}
                    >
                      <div className="flex flex-col items-center text-center space-y-3 md:space-y-4">
                        <div className={`
                          w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center text-2xl md:text-3xl
                          ${isUnlocked ? 'bg-accent-gold/10' : 'bg-ink/5'}
                        `}>
                          {achievement.icon}
                        </div>
                        <div className="space-y-1">
                          <h4 className="text-sm md:text-base font-serif font-bold text-ink">{achievement.title}</h4>
                          <p className="text-[10px] md:text-xs font-sans text-ink/60 leading-relaxed">{achievement.description}</p>
                        </div>
                        {isUnlocked ? (
                          <div className="flex items-center gap-1 text-[7px] md:text-[8px] font-sans font-bold text-teal-600 uppercase tracking-widest">
                            <CheckCircle2 size={8} className="md:w-[10px] md:h-[10px]" /> Unlocked
                          </div>
                        ) : (
                          <div className="flex items-center gap-1 text-[7px] md:text-[8px] font-sans font-bold text-ink/20 uppercase tracking-widest">
                            <Clock size={8} className="md:w-[10px] md:h-[10px]" /> Locked
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const RecentAchievements = () => {
  const unlockedIds = getStorage(STORAGE_KEYS.unlockedAchievements, []);
  const recent = ACHIEVEMENTS
    .filter(a => unlockedIds.includes(a.id))
    .slice(-3)
    .reverse();

  if (recent.length === 0) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-[10px] font-sans font-bold text-ink/30 uppercase tracking-[0.2em]">Recent Achievements</h3>
        <Trophy size={14} className="text-accent-gold" />
      </div>
      <div className="space-y-4">
        {recent.map(a => (
          <div key={a.id} className="flex items-center gap-4 group cursor-default">
            <div className="w-10 h-10 rounded-full bg-bg-primary border border-ink/5 flex items-center justify-center text-xl group-hover:scale-110 transition-transform">
              {a.icon}
            </div>
            <div className="space-y-0.5">
              <div className="text-sm font-serif font-bold text-ink">{a.title}</div>
              <div className="text-[10px] font-sans text-ink/40 uppercase tracking-wider">{a.description}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const Leaderboard = () => {
  const stats = getUserStats();
  const { title } = getLevelInfo(stats.totalXP);
  
  const MOCK_LEADERS = [
    { name: 'Dr. Vocab', xp: 12500, title: 'Lexicographer', isUser: false },
    { name: 'Quant Master', xp: 9800, title: 'Polymath', isUser: false },
    { name: 'GRE Guru', xp: 7200, title: 'Etymologist', isUser: false },
    { name: 'Word Wizard', xp: 5400, title: 'Wordsmith', isUser: false },
    { name: 'Study Bee', xp: 3100, title: 'Academic', isUser: false },
  ];

  const allLeaders = [
    ...MOCK_LEADERS,
    { name: 'You', xp: stats.totalXP, title: title, isUser: true }
  ].sort((a, b) => b.xp - a.xp);

  return (
    <div className="space-y-8 md:space-y-12">
      <div className="space-y-4">
        <h2 className="text-3xl md:text-5xl font-serif font-bold text-ink tracking-tight">Global Rankings</h2>
        <p className="text-sm md:text-lg font-sans text-ink/60 max-w-2xl">See how your academic trajectory compares with the global scholar community.</p>
      </div>

      <div className="bg-white rounded-sm border border-ink/5 shadow-xl shadow-ink/5 overflow-hidden">
        <div className="grid grid-cols-12 p-4 md:p-6 border-b border-ink/5 bg-bg-primary/50">
          <div className="col-span-2 md:col-span-1 text-[10px] font-sans font-bold text-ink/30 uppercase tracking-widest">Rank</div>
          <div className="col-span-10 md:col-span-6 text-[10px] font-sans font-bold text-ink/30 uppercase tracking-widest">Scholar</div>
          <div className="hidden md:block md:col-span-3 text-[10px] font-sans font-bold text-ink/30 uppercase tracking-widest">Title</div>
          <div className="hidden md:block md:col-span-2 text-right text-[10px] font-sans font-bold text-ink/30 uppercase tracking-widest">Total XP</div>
        </div>
        <div className="divide-y divide-ink/5">
          {allLeaders.map((leader, idx) => (
            <div 
              key={leader.name} 
              className={`grid grid-cols-12 p-4 md:p-6 lg:p-8 items-center transition-colors ${leader.isUser ? 'bg-accent-gold/5' : 'hover:bg-bg-primary/30'}`}
            >
              <div className="col-span-2 md:col-span-1">
                <span className={`
                  w-8 h-8 rounded-full flex items-center justify-center text-xs font-sans font-bold
                  ${idx === 0 ? 'bg-accent-gold text-white' : idx === 1 ? 'bg-ink/20 text-ink' : idx === 2 ? 'bg-ink/10 text-ink' : 'text-ink/30'}
                `}>
                  {idx + 1}
                </span>
              </div>
              <div className="col-span-10 md:col-span-6 flex items-center gap-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center border shrink-0 ${leader.isUser ? 'bg-ink border-ink' : 'bg-bg-primary border-ink/5'}`}>
                  <span className={`text-[10px] font-sans font-bold ${leader.isUser ? 'text-accent-gold' : 'text-ink/30'}`}>
                    {leader.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                  </span>
                </div>
                <div className="space-y-0.5 min-w-0">
                  <div className={`text-base md:text-lg font-serif font-bold truncate ${leader.isUser ? 'text-ink' : 'text-ink/80'}`}>
                    {leader.name} {leader.isUser && <span className="text-[10px] font-sans font-bold text-accent-gold uppercase ml-2 tracking-widest inline-block">(You)</span>}
                  </div>
                  <div className="md:hidden">
                    <span className="text-[8px] font-sans font-bold text-ink/40 uppercase tracking-widest">{leader.title} • {leader.xp.toLocaleString()} XP</span>
                  </div>
                </div>
              </div>
              <div className="hidden md:block md:col-span-3">
                <span className="text-[10px] font-sans font-bold text-ink/40 uppercase tracking-widest">{leader.title}</span>
              </div>
              <div className="hidden md:block md:col-span-2 text-right">
                <span className="text-xl font-serif font-bold text-ink">{leader.xp.toLocaleString()}</span>
              </div>
            </div>
          ))}
        </div>
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

  const unlockedAchievementsCount = getStorage(STORAGE_KEYS.unlockedAchievements, []).length;

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'vocabulary', label: 'Vocabulary', icon: BookOpen },
    { id: 'notes', label: 'Notes', icon: BookMarked },
    { id: 'quantitative', label: 'Quantitative', icon: Calculator },
    { id: 'verbal', label: 'Verbal Practice', icon: MessageSquare },
    { id: 'mindgames', label: 'Mind Games', icon: Gamepad2 },
    { id: 'news', label: 'News & Affairs', icon: Newspaper },
    { id: 'worlddays', label: 'World Days', icon: Globe },
    { id: 'achievements', label: 'Achievements', icon: Trophy, badge: unlockedAchievementsCount },
    { id: 'leaderboard', label: 'Leaderboard', icon: Medal },
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
        return <StudyNotes />;
      case 'quantitative':
        return <Quantitative onXpChange={handleXpChange} />;
      case 'verbal':
        return <Verbal onXpChange={handleXpChange} />;
      case 'mindgames':
        return <MindGames onXpChange={handleXpChange} currentXp={xp} />;
      case 'news':
        return <NewsContainer />;
      case 'worlddays':
        return <WorldDays />;
      case 'achievements':
        return <Achievements onXpChange={handleXpChange} />;
      case 'leaderboard':
        return <Leaderboard />;
      case 'daily-challenge':
        return <DailyChallenge onBack={() => setActiveSection('dashboard')} onXpChange={handleXpChange} />;
      case 'progress':
        return <Progress />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard onNavigate={setActiveSection} />;
    }
  };

  return (
    <div className="h-screen bg-bg-primary flex overflow-hidden">
      {/* Sidebar */}
      <aside 
        className={`
          fixed md:sticky top-0 h-screen inset-y-0 left-0 z-50
          bg-white border-r border-ink/5 transition-all duration-500 ease-in-out overflow-y-auto overflow-x-hidden
          ${isMobile 
            ? (isSidebarOpen ? 'w-full sm:w-80 translate-x-0' : 'w-full sm:w-80 -translate-x-full')
            : (isSidebarOpen ? 'w-80' : 'w-20')
          }
        `}
      >
        <div className={`flex flex-col transition-all duration-500 ${isSidebarOpen ? 'p-8' : 'p-5'}`}>
          <div className={`flex items-center justify-between transition-all duration-500 mb-16 ${isSidebarOpen ? 'gap-4' : 'gap-0 justify-center'}`}>
            <div className="flex items-center gap-4">
              <motion.div 
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.9 }}
                className="w-12 h-12 bg-accent-gold rounded-sm flex items-center justify-center text-white shrink-0 shadow-xl shadow-accent-gold/20 cursor-pointer"
                onClick={() => !isMobile && setIsSidebarOpen(!isSidebarOpen)}
              >
                <Brain size={24} />
              </motion.div>
              <AnimatePresence mode="wait">
                {isSidebarOpen && (
                  <motion.span 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.3 }}
                    className="text-3xl font-serif font-bold text-ink tracking-tighter whitespace-nowrap"
                  >
                    GREnius
                  </motion.span>
                )}
              </AnimatePresence>
            </div>
            {isMobile && isSidebarOpen && (
              <button 
                onClick={() => setIsSidebarOpen(false)}
                className="p-3 text-ink/40 hover:text-ink bg-ink/5 rounded-full transition-colors"
              >
                <X size={24} />
              </button>
            )}
          </div>

          <nav className="flex-1 space-y-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveSection(item.id);
                  if (isMobile) setIsSidebarOpen(false);
                  const soundEnabled = getStorage(STORAGE_KEYS.settings, { soundEnabled: true }).soundEnabled;
                  playSound('flip', soundEnabled);
                }}
                className={`w-full flex items-center transition-all relative group
                  ${isSidebarOpen ? 'gap-4 p-4' : 'gap-0 p-4 justify-center'}
                  ${activeSection === item.id 
                    ? 'text-accent-gold border-l-4 border-accent-gold bg-accent-gold/5' 
                    : 'text-ink/40 hover:text-ink border-l-4 border-transparent hover:bg-ink/5'}
                  ${isSidebarOpen && activeSection === item.id ? 'pl-[calc(1rem-4px)]' : ''}`}
              >
                <div className="shrink-0 relative">
                  <item.icon size={22} strokeWidth={activeSection === item.id ? 2.5 : 2} />
                  {item.badge !== undefined && item.badge > 0 && (
                    <div className="absolute -top-2 -right-2 w-5 h-5 bg-accent-gold text-white text-[9px] font-sans font-bold flex items-center justify-center rounded-full border-2 border-white shadow-sm">
                      {item.badge}
                    </div>
                  )}
                </div>
                <AnimatePresence mode="wait">
                  {isSidebarOpen && (
                    <motion.span 
                      initial={{ opacity: 0, x: -5 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -5 }}
                      transition={{ duration: 0.2 }}
                      className="text-[11px] font-sans font-bold uppercase tracking-[0.25em] whitespace-nowrap"
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
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top Header */}
        <header className="h-16 md:h-24 bg-white/90 backdrop-blur-xl border-b border-ink/5 flex items-center justify-between px-4 md:px-12 sticky top-0 z-40">
          <div className="flex items-center gap-3 md:gap-8">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="text-ink/60 hover:text-ink transition-all p-2.5 bg-ink/5 rounded-full md:bg-transparent"
            >
              <Menu size={isMobile ? 24 : 20} />
            </button>
            <span className="text-lg md:text-2xl font-serif italic text-ink tracking-tight">GREnius.</span>
          </div>

          <div className="flex-1 max-w-xl px-8 hidden lg:block">
            <div className="relative group">
              <Search className="absolute left-0 top-1/2 -translate-y-1/2 text-ink/20 group-focus-within:text-accent-gold transition-colors" size={18} />
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
                className="w-full pl-10 pr-4 py-3 bg-transparent border-none text-[11px] font-sans font-bold uppercase tracking-[0.3em] focus:ring-0 placeholder:text-ink/10 transition-all"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-4 md:gap-8">
            <div className="hidden sm:flex items-center gap-6 md:gap-10">
              <div className="flex flex-col items-end">
                <span className="text-[9px] font-sans font-bold text-ink/30 uppercase tracking-widest">Streak</span>
                <span className="text-sm font-serif font-bold text-accent-gold">{streak.toString().padStart(2, '0')}</span>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-[9px] font-sans font-bold text-ink/30 uppercase tracking-widest">XP</span>
                <span className="text-sm font-serif font-bold text-ink">{xp.toLocaleString()}</span>
              </div>
            </div>
            <button 
              onClick={() => setActiveSection('settings')}
              className="w-10 h-10 md:w-12 md:h-12 rounded-full border border-ink/5 flex items-center justify-center text-ink/40 hover:text-ink hover:border-ink/20 transition-all bg-bg-primary/50"
            >
              <SettingsIcon size={18} className="md:w-5 md:h-5" />
            </button>
          </div>
        </header>

        {/* Section Content */}
        <div className="flex-1 p-6 sm:p-12 md:p-20 lg:p-24 max-w-7xl mx-auto w-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
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
