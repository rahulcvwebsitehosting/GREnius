/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
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
  CheckCircle2,
  Clock,
  ArrowRight,
  Volume2,
  Trash2,
  Target
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { playSound, fireConfetti, getStorage, setStorage, XP_REWARDS, LEVELS, STORAGE_KEYS, getLevelInfo, awardXP, updateStreak, recordQuizResult } from './utils';
import { GRE_WORDS, GRE_QUANT, GRE_VERBAL } from './data';
import { QuizResult, UserSettings } from './types';

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

  const categories = ['behavior', 'intellect', 'emotion', 'speech', 'morality', 'change', 'opposition', 'perception'];
  
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
    nextLevel();
  };

  const nextLevel = () => {
    const newNumber = Math.floor(Math.random() * Math.pow(10, level)).toString();
    setNumber(newNumber);
    setShowNumber(true);
    setUserInput('');
    playSound('flip', soundEnabled);
    setTimeout(() => setShowNumber(false), 2000 + (level * 500));
  };

  const checkNumber = () => {
    if (userInput === number) {
      setScore(score + (level * 100));
      setLevel(level + 1);
      playSound('correct', soundEnabled);
      const newXp = awardXP(level * 5);
      onXpChange(newXp);
      nextLevel();
    } else {
      setGameState('end');
      playSound('wrong', soundEnabled);
    }
  };

  const renderGame = () => {
    switch (activeGame) {
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
  const [timer, setTimer] = useState(0);
  const [isTimerActive, setIsTimerActive] = useState(true);
  const [sessionCorrect, setSessionCorrect] = useState(0);
  const [sessionTotal, setSessionTotal] = useState(0);
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
      setShowExplanation(true);
      setIsTimerActive(false);
      setSessionTotal(t => t + 1);
      
      if (currentQuestion.answers?.includes(ans)) {
        playSound('correct', soundEnabled);
        fireConfetti();
        setSessionCorrect(c => c + 1);
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
    
    const isCorrect = opt === currentQuestion.questions?.[questionIndex].answer;
    setSessionTotal(t => t + 1);
    if (isCorrect) {
      playSound('correct', soundEnabled);
      setSessionCorrect(c => c + 1);
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
    setShowExplanation(true);
    setIsTimerActive(false);
    setSessionTotal(t => t + 1);
    
    const isCorrect = blankSelections.every((ans, idx) => currentQuestion.answers?.[idx] === ans);
    if (isCorrect) {
      playSound('correct', soundEnabled);
      fireConfetti();
      setSessionCorrect(c => c + 1);
      const newXp = awardXP(XP_REWARDS.correctVerbal);
      onXpChange(newXp);
    } else {
      playSound('wrong', soundEnabled);
    }
  };

  const submitSE = () => {
    if (selectedAnswers.length !== 2) return;
    setShowExplanation(true);
    setIsTimerActive(false);
    setSessionTotal(t => t + 1);
    
    const isCorrect = selectedAnswers.every(ans => currentQuestion.answers?.includes(ans));
    if (isCorrect) {
      playSound('correct', soundEnabled);
      fireConfetti();
      setSessionCorrect(c => c + 1);
      const newXp = awardXP(XP_REWARDS.correctVerbal);
      onXpChange(newXp);
    } else {
      playSound('wrong', soundEnabled);
    }
  };

  const nextQuestion = () => {
    setCurrentIndex((prev) => (prev + 1) % GRE_VERBAL.length);
    setSelectedAnswers([]);
    setBlankSelections([]);
    setRcAnswers({});
    setShowExplanation(false);
    setTimer(0);
    setIsTimerActive(true);
    playSound('flip', soundEnabled);
  };

  const finishSession = () => {
    if (sessionTotal > 0) {
      recordQuizResult('Verbal', sessionCorrect, sessionTotal);
      setSessionCorrect(0);
      setSessionTotal(0);
      playSound('xp', soundEnabled);
    }
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
                              ${blankSelections[blankIndex] === opt
                                ? (showExplanation 
                                    ? (currentQuestion.answers?.[blankIndex] === opt ? 'bg-ink text-white border-ink' : 'bg-red-50 border-red-200 text-red-900')
                                    : 'bg-ink text-white border-ink')
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
                        ${selectedAnswers.includes(opt) 
                          ? (currentQuestion.answers?.includes(opt) ? 'bg-ink text-white border-ink' : 'bg-red-50 border-red-200 text-red-900')
                          : 'bg-white border-ink/5 hover:border-ink/20 text-ink/60'}
                      `}
                    >
                      <span className={`
                        w-10 h-10 rounded-full flex items-center justify-center text-[10px] font-sans font-bold uppercase tracking-widest transition-colors
                        ${selectedAnswers.includes(opt) ? 'bg-white/20 text-white' : 'bg-bg-primary text-ink/30 group-hover:bg-ink group-hover:text-white'}
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
                  <div className="flex items-center gap-3 text-accent-gold">
                    <CheckCircle2 size={20} />
                    <h3 className="text-[10px] font-sans font-bold uppercase tracking-[0.2em]">Scholarly Insight</h3>
                  </div>
                  <p className="text-lg font-sans text-ink/60 leading-relaxed italic">
                    {currentQuestion.explanation}
                  </p>
                </div>
                <button 
                  onClick={nextQuestion}
                  className="w-full py-6 bg-accent-gold text-white rounded-sm font-sans font-bold text-xs uppercase tracking-[0.2em] hover:bg-accent-gold/90 transition-all shadow-xl flex items-center justify-center gap-3"
                >
                  Next Challenge <ArrowRight size={14} />
                </button>
                {sessionTotal >= 5 && (
                  <button 
                    onClick={finishSession}
                    className="w-full py-4 bg-ink/5 text-ink/40 rounded-sm font-sans font-bold text-[10px] uppercase tracking-[0.2em] hover:bg-ink/10 hover:text-ink transition-all flex items-center justify-center gap-2"
                  >
                    <CheckCircle2 size={12} /> Finish Session & Record
                  </button>
                )}
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
  const [timer, setTimer] = useState(0);
  const [isTimerActive, setIsTimerActive] = useState(true);
  const [showCalculator, setShowCalculator] = useState(false);
  const [calcValue, setCalcValue] = useState('0');
  const [neInput, setNeInput] = useState('');
  const [sessionCorrect, setSessionCorrect] = useState(0);
  const [sessionTotal, setSessionTotal] = useState(0);
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
    setShowExplanation(true);
    setIsTimerActive(false);
    setSessionTotal(t => t + 1);

    if (ans.trim() === currentQuestion.answer.trim()) {
      playSound('correct', soundEnabled);
      fireConfetti();
      setSessionCorrect(c => c + 1);
      const newXp = awardXP(XP_REWARDS.correctQuant);
      onXpChange(newXp);
    } else {
      playSound('wrong', soundEnabled);
    }
  };

  const nextQuestion = () => {
    setCurrentIndex((prev) => (prev + 1) % GRE_QUANT.length);
    setSelectedAnswer(null);
    setShowExplanation(false);
    setTimer(0);
    setIsTimerActive(true);
    setNeInput('');
    playSound('flip', soundEnabled);
  };

  const finishSession = () => {
    if (sessionTotal > 0) {
      recordQuizResult('Quantitative', sessionCorrect, sessionTotal);
      setSessionCorrect(0);
      setSessionTotal(0);
      playSound('xp', soundEnabled);
    }
  };

  const handleCalc = (val: string) => {
    if (val === 'C') {
      setCalcValue('0');
    } else if (val === '=') {
      try {
        // Use Function constructor to safely evaluate math expression
        // Only allow numbers and basic operators
        const sanitized = calcValue.replace(/[^0-9+\-*/().]/g, '');
        const result = Function('"use strict"; return (' + sanitized + ')')();
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
                        ${selectedAnswer === opt 
                          ? (opt === currentQuestion.answer ? 'bg-ink text-white border-ink' : 'bg-red-50 border-red-200 text-red-900')
                          : 'bg-white border-ink/5 hover:border-ink/20 text-ink/60'}
                      `}
                    >
                      <span className={`
                        w-10 h-10 rounded-full flex items-center justify-center text-[10px] font-sans font-bold uppercase tracking-widest transition-colors
                        ${selectedAnswer === opt ? 'bg-white/20 text-white' : 'bg-bg-primary text-ink/30 group-hover:bg-ink group-hover:text-white'}
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
                        ${selectedAnswer === opt 
                          ? (opt === currentQuestion.answer ? 'bg-ink text-white border-ink' : 'bg-red-50 border-red-200 text-red-900')
                          : 'bg-white border-ink/5 hover:border-ink/20 text-ink/60'}
                      `}
                    >
                      <span className={`
                        w-10 h-10 rounded-full flex items-center justify-center text-[10px] font-sans font-bold uppercase tracking-widest transition-colors
                        ${selectedAnswer === opt ? 'bg-white/20 text-white' : 'bg-bg-primary text-ink/30 group-hover:bg-ink group-hover:text-white'}
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
                {['7', '8', '9', '/', '4', '5', '6', '*', '1', '2', '3', '-', '0', '⌫', 'C', '+'].map((btn) => (
                  <button
                    key={btn}
                    onClick={() => handleCalc(btn)}
                    className="h-12 bg-white/5 hover:bg-white/10 text-white rounded-sm font-mono font-bold transition-colors"
                  >
                    {btn}
                  </button>
                ))}
                <button 
                  onClick={() => handleCalc('=')}
                  className="col-span-4 h-12 bg-accent-gold hover:bg-accent-gold/90 text-white rounded-sm font-mono font-bold transition-colors"
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
                  <div className="flex items-center gap-3 text-accent-gold">
                    <CheckCircle2 size={20} />
                    <h3 className="text-[10px] font-sans font-bold uppercase tracking-[0.2em]">Mathematical Proof</h3>
                  </div>
                  <p className="text-lg font-sans text-ink/60 leading-relaxed italic">
                    {currentQuestion.explanation}
                  </p>
                </div>
                <button 
                  onClick={nextQuestion}
                  className="w-full py-6 bg-accent-gold text-white rounded-sm font-sans font-bold text-xs uppercase tracking-[0.2em] hover:bg-accent-gold/90 transition-all shadow-xl flex items-center justify-center gap-3"
                >
                  Next Challenge <ArrowRight size={14} />
                </button>
                {sessionTotal >= 5 && (
                  <button 
                    onClick={finishSession}
                    className="w-full py-4 bg-ink/5 text-ink/40 rounded-sm font-sans font-bold text-[10px] uppercase tracking-[0.2em] hover:bg-ink/10 hover:text-ink transition-all flex items-center justify-center gap-2"
                  >
                    <CheckCircle2 size={12} /> Finish Session & Record
                  </button>
                )}
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

const Vocabulary = ({ onBack, onXpChange }: { onBack: () => void, onXpChange: (xp: number) => void }) => {
  const [view, setView] = useState<'menu' | 'flashcards' | 'list'>('menu');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
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

  const currentWord = GRE_WORDS[currentIndex];

  const filteredWords = GRE_WORDS.filter(word =>
    word.word.toLowerCase().includes(searchQuery.toLowerCase()) ||
    word.definition.toLowerCase().includes(searchQuery.toLowerCase()) ||
    word.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

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

        <div className="perspective-1000 h-[500px] relative cursor-pointer" onClick={() => setIsFlipped(!isFlipped)}>
          <motion.div 
            className="w-full h-full relative transition-all duration-700 preserve-3d shadow-2xl"
            animate={{ rotateY: isFlipped ? 180 : 0 }}
            transition={{ type: "spring", stiffness: 100, damping: 20 }}
          >
            {/* Front */}
            <div className="absolute inset-0 backface-hidden bg-white rounded-sm border border-ink/5 flex flex-col items-center justify-center p-16 text-center">
              <p className="text-[10px] font-sans font-bold text-accent-gold uppercase tracking-[0.3em] mb-8">
                {currentWord.category}
              </p>
              <h2 className="text-8xl font-serif font-bold text-ink mb-6 tracking-tight">{currentWord.word}</h2>
              <p className="text-xl font-serif italic text-ink/30">{currentWord.pronunciation}</p>
              <div className="mt-16 flex items-center gap-2 text-[10px] font-sans font-bold text-ink/10 uppercase tracking-[0.2em]">
                Click to reveal definition
              </div>
            </div>

            {/* Back */}
            <div className="absolute inset-0 backface-hidden bg-white rounded-sm border border-ink/5 flex flex-col p-16 rotate-y-180 overflow-y-auto">
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
          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-ink/20" size={16} />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
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
                        <p className="text-xl font-serif font-bold text-ink group-hover:text-accent-gold transition-colors">{word.word}</p>
                        <p className="text-xs font-serif italic text-ink/30">{word.pronunciation}</p>
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
        <div className="space-y-2">
          <div className="flex items-center gap-3 text-ink/40 mb-4">
            <BookMarked size={20} />
          </div>
          <p className="text-5xl font-serif font-bold text-ink">{masteredWords.length.toLocaleString()}</p>
          <p className="text-[10px] font-sans font-bold text-ink/40 uppercase tracking-[0.2em]">Words Mastered</p>
        </div>
        <div className="space-y-2">
          <div className="flex items-center gap-3 text-ink/40 mb-4">
            <CheckCircle2 size={20} />
          </div>
          <p className="text-5xl font-serif font-bold text-ink">
            {avgScore !== null ? `${avgScore}%` : '—'}
          </p>
          <p className="text-[10px] font-sans font-bold text-ink/40 uppercase tracking-[0.2em]">Average Quiz Score</p>
          {avgScore === null && (
            <p className="text-[8px] font-sans text-ink/20 italic mt-1">Complete quizzes to see score</p>
          )}
        </div>
        <div className="space-y-2">
          <div className="flex items-center gap-3 text-ink/40 mb-4">
            <Clock size={20} />
          </div>
          <p className="text-5xl font-serif font-bold text-ink">{formatStudyTime(totalSeconds)}</p>
          <p className="text-[10px] font-sans font-bold text-ink/40 uppercase tracking-[0.2em]">Total Study Time</p>
        </div>
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
            <button 
              onClick={() => onNavigate('vocabulary')}
              className="group text-left space-y-6"
            >
              <div className="w-16 h-16 bg-bg-primary rounded-sm border border-ink/5 flex items-center justify-center text-accent-gold group-hover:bg-ink group-hover:text-white transition-all duration-500">
                <BookOpen size={24} />
              </div>
              <div className="space-y-2">
                <h3 className="text-3xl font-serif font-bold text-ink group-hover:text-accent-gold transition-colors">Vocabulary</h3>
                <p className="text-sm font-sans text-ink/60 leading-relaxed">Master the nuances of 90+ high-frequency terms with scholarly mnemonics.</p>
              </div>
              <div className="flex items-center gap-2 text-[10px] font-sans font-bold text-ink/30 uppercase tracking-[0.2em] group-hover:text-ink transition-colors">
                Initiate Study <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </button>

            <button 
              onClick={() => onNavigate('quantitative')}
              className="group text-left space-y-6"
            >
              <div className="w-16 h-16 bg-bg-primary rounded-sm border border-ink/5 flex items-center justify-center text-accent-gold group-hover:bg-ink group-hover:text-white transition-all duration-500">
                <Calculator size={24} />
              </div>
              <div className="space-y-2">
                <h3 className="text-3xl font-serif font-bold text-ink group-hover:text-accent-gold transition-colors">Quantitative</h3>
                <p className="text-sm font-sans text-ink/60 leading-relaxed">Rigorous practice across arithmetic, algebra, and geometric analysis.</p>
              </div>
              <div className="flex items-center gap-2 text-[10px] font-sans font-bold text-ink/30 uppercase tracking-[0.2em] group-hover:text-ink transition-colors">
                Solve Problems <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </button>
          </div>
        </div>

          <aside className="space-y-12">
            <section className="space-y-8">
              <h2 className="text-xs font-sans font-bold text-ink uppercase tracking-[0.3em] border-b border-ink/5 pb-4">Academic Accolades</h2>
              <div className="space-y-6">
                {ACCOLADES.map(accolade => {
                  const unlocked = accolade.condition(accoladeData);
                  return (
                    <div key={accolade.id} className={`flex items-center gap-4 transition-all ${unlocked ? 'opacity-100' : 'opacity-25 grayscale'}`}>
                      <div className={`w-12 h-12 rounded-full border flex items-center justify-center ${unlocked ? 'border-accent-gold text-accent-gold' : 'border-ink/10 text-ink/20'}`}>
                        <accolade.icon size={20} />
                      </div>
                      <div>
                        <p className="text-sm font-serif font-bold text-ink">{accolade.title}</p>
                        <p className="text-[10px] font-sans text-ink/40 uppercase tracking-widest">
                          {unlocked ? accolade.subtitle : `🔒 ${accolade.subtitle}`}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

          <section className="space-y-8">
            <h2 className="text-xs font-sans font-bold text-ink uppercase tracking-[0.3em] border-b border-ink/5 pb-4">Upcoming Goals</h2>
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 bg-bg-primary rounded-sm border border-ink/5">
                <div className="w-1.5 h-1.5 bg-accent-gold rounded-full" />
                <span className="text-xs font-sans text-ink/60 uppercase tracking-widest">Complete 10 Quant QC problems</span>
              </div>
              <div className="flex items-center gap-4 p-4 bg-bg-primary rounded-sm border border-ink/5">
                <div className="w-1.5 h-1.5 bg-accent-gold rounded-full" />
                <span className="text-xs font-sans text-ink/60 uppercase tracking-widest">Master 5 new 'Behavior' words</span>
              </div>
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
};

const App = () => {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
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
        return <Vocabulary onBack={() => setActiveSection('dashboard')} onXpChange={handleXpChange} />;
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
          fixed md:static inset-y-0 left-0 z-50
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
