import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircle2, 
  XCircle, 
  ArrowRight, 
  RotateCcw, 
  Lightbulb, 
  Trophy,
  Keyboard,
  Target,
  Flame,
  AlertCircle
} from 'lucide-react';
import { ALL_GRE_WORDS } from '../data';
import { Word } from '../types';
import { 
  awardXP, 
  playSound, 
  STORAGE_KEYS, 
  getStorage, 
  setStorage, 
  trackWeakWord, 
  fireConfetti,
  XP_REWARDS
} from '../utils';

interface SpellingPracticeProps {
  onXpChange: (xp: number) => void;
}

const SpellingPractice: React.FC<SpellingPracticeProps> = ({ onXpChange }) => {
  const [currentWord, setCurrentWord] = useState<Word | null>(null);
  const [userInput, setUserInput] = useState('');
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const [attempts, setAttempts] = useState(0);
  const [totalAttempts, setTotalAttempts] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [sessionWords, setSessionWords] = useState<Word[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const soundEnabled = getStorage(STORAGE_KEYS.settings, { soundEnabled: true }).soundEnabled;

  const nextWord = () => {
    const weakWordsIds = getStorage(STORAGE_KEYS.weakWords, []) as number[];
    const weakWords = ALL_GRE_WORDS.filter(w => weakWordsIds.includes(w.id));
    
    // 30% chance to pick a weak word if available
    let word: Word;
    if (weakWords.length > 0 && Math.random() < 0.3) {
      word = weakWords[Math.floor(Math.random() * weakWords.length)];
    } else {
      word = ALL_GRE_WORDS[Math.floor(Math.random() * ALL_GRE_WORDS.length)];
    }

    setCurrentWord(word);
    setUserInput('');
    setFeedback(null);
    setAttempts(0);
    setShowHint(false);
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  useEffect(() => {
    nextWord();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentWord || feedback === 'correct') return;

    const isCorrect = userInput.trim().toLowerCase() === currentWord.word.toLowerCase();

    if (isCorrect) {
      setFeedback('correct');
      setScore(prev => prev + 1);
      setStreak(prev => prev + 1);
      playSound('correct', soundEnabled);
      const newXp = awardXP(XP_REWARDS.correctVocab);
      onXpChange(newXp);
      
      if (streak + 1 >= 5) {
        fireConfetti();
      }

      // Record word studied
      const studied = getStorage(STORAGE_KEYS.wordsStudied, 0);
      setStorage(STORAGE_KEYS.wordsStudied, studied + 1);
    } else {
      setFeedback('incorrect');
      setAttempts(prev => prev + 1);
      setTotalAttempts(prev => prev + 1);
      setStreak(0);
      playSound('wrong', soundEnabled);
      trackWeakWord(currentWord.id);
    }
  };

  const getHint = () => {
    setShowHint(true);
    setAttempts(prev => prev + 1);
    setTotalAttempts(prev => prev + 1);
  };

  if (!currentWord) return null;

  return (
    <div className="max-w-4xl mx-auto w-full space-y-12 py-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-ink/5 pb-8">
        <div className="space-y-4">
          <div className="flex items-center gap-3 text-accent-gold">
            <Keyboard size={20} />
            <span className="text-[10px] font-sans font-bold uppercase tracking-[0.3em]">Lexical Spelling Protocol</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-serif font-bold text-ink leading-none">
            Orthographic<br />Precision.
          </h1>
        </div>

        <div className="flex items-center gap-12">
          <div className="text-right space-y-1">
            <p className="text-[10px] font-sans font-bold text-ink/30 uppercase tracking-widest">Current Score</p>
            <p className="text-3xl font-serif font-bold text-ink">{score}</p>
          </div>
          <div className="text-right space-y-1">
            <p className="text-[10px] font-sans font-bold text-ink/30 uppercase tracking-widest">Streak</p>
            <div className="flex items-center justify-end gap-2">
              <Flame size={16} className={streak > 0 ? "text-orange-500" : "text-ink/10"} />
              <p className="text-3xl font-serif font-bold text-ink">{streak}</p>
            </div>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
        <div className="lg:col-span-3 space-y-8">
          <section className="p-8 md:p-12 bg-bg-primary border border-ink/5 rounded-sm space-y-8 relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-[0.02] pointer-events-none" 
                 style={{ backgroundImage: 'radial-gradient(circle, currentColor 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
            
            <div className="relative space-y-6">
              <div className="flex items-center gap-2 text-[10px] font-sans font-bold text-ink/40 uppercase tracking-widest">
                <Target size={12} /> Semantic Definition
              </div>
              <p className="text-2xl md:text-3xl font-serif text-ink leading-relaxed italic">
                "{currentWord.definition}"
              </p>
              
              <div className="pt-4 flex flex-wrap gap-4">
                <span className="px-3 py-1 bg-ink/5 rounded-full text-[10px] font-sans font-bold text-ink/40 uppercase tracking-widest">
                  {currentWord.pos}
                </span>
                <span className="px-3 py-1 bg-ink/5 rounded-full text-[10px] font-sans font-bold text-ink/40 uppercase tracking-widest">
                  {currentWord.category}
                </span>
              </div>
            </div>
          </section>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative">
              <input
                ref={inputRef}
                type="text"
                value={userInput}
                onChange={(e) => {
                  setUserInput(e.target.value);
                  if (feedback === 'incorrect') setFeedback(null);
                }}
                disabled={feedback === 'correct'}
                placeholder="Type the word here..."
                className={`w-full p-6 md:p-8 bg-bg-primary border-2 rounded-sm font-serif text-3xl md:text-4xl text-ink transition-all focus:outline-none ${
                  feedback === 'correct' ? 'border-green-500 bg-green-50/30' : 
                  feedback === 'incorrect' ? 'border-red-500 animate-shake' : 
                  'border-ink/5 focus:border-accent-gold'
                }`}
                autoFocus
                autoComplete="off"
                autoCorrect="off"
                spellCheck="false"
              />
              
              <AnimatePresence>
                {feedback === 'correct' && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="absolute right-6 top-1/2 -translate-y-1/2 text-green-500"
                  >
                    <CheckCircle2 size={32} />
                  </motion.div>
                )}
                {feedback === 'incorrect' && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="absolute right-6 top-1/2 -translate-y-1/2 text-red-500"
                  >
                    <XCircle size={32} />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <button
                  type="submit"
                  disabled={feedback === 'correct' || !userInput.trim()}
                  className="px-10 py-4 bg-ink text-bg-primary rounded-sm font-sans font-bold text-xs uppercase tracking-[0.2em] hover:bg-accent-gold transition-all disabled:opacity-20 disabled:hover:bg-ink"
                >
                  Verify Orthography
                </button>
                
                {feedback !== 'correct' && (
                  <button
                    type="button"
                    onClick={getHint}
                    disabled={showHint}
                    className="flex items-center gap-2 px-6 py-4 border border-ink/10 rounded-sm font-sans font-bold text-[10px] uppercase tracking-widest hover:border-accent-gold hover:text-accent-gold transition-all disabled:opacity-30"
                  >
                    <Lightbulb size={14} /> Reveal Hint
                  </button>
                )}
              </div>

              {feedback === 'correct' && (
                <motion.button
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  onClick={nextWord}
                  className="flex items-center gap-3 text-accent-gold font-sans font-bold text-xs uppercase tracking-[0.2em] hover:translate-x-2 transition-all"
                >
                  Next Challenge <ArrowRight size={16} />
                </motion.button>
              )}
            </div>
          </form>

          <AnimatePresence>
            {showHint && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-6 bg-accent-gold/5 border border-accent-gold/20 rounded-sm space-y-2"
              >
                <div className="flex items-center gap-2 text-[10px] font-sans font-bold text-accent-gold uppercase tracking-widest">
                  <Lightbulb size={12} /> Mnemonic Aid
                </div>
                <p className="text-sm font-serif text-ink italic leading-relaxed">
                  {currentWord.mnemonic || `The word starts with "${currentWord.word[0]}" and has ${currentWord.word.length} letters.`}
                </p>
                <div className="pt-2 flex gap-1">
                  {currentWord.word.split('').map((char, i) => (
                    <div key={i} className="w-6 h-8 border-b-2 border-ink/10 flex items-center justify-center font-serif text-lg text-ink/40">
                      {i === 0 || i === currentWord.word.length - 1 ? char : '_'}
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="lg:col-span-2 space-y-8">
          <section className="p-8 border border-ink/5 rounded-sm space-y-6">
            <h3 className="text-[10px] font-sans font-bold text-ink/40 uppercase tracking-[0.3em] border-b border-ink/5 pb-4">
              Session Analytics
            </h3>
            
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 text-ink/40">
                  <CheckCircle2 size={16} />
                  <span className="text-xs font-sans font-bold uppercase tracking-wider">Accuracy</span>
                </div>
                <span className="text-lg font-serif font-bold text-ink">
                  {score > 0 ? Math.round((score / (score + totalAttempts)) * 100) : 0}%
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 text-ink/40">
                  <AlertCircle size={16} />
                  <span className="text-xs font-sans font-bold uppercase tracking-wider">Total Mistakes</span>
                </div>
                <span className="text-lg font-serif font-bold text-red-500">{totalAttempts}</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 text-ink/40">
                  <Trophy size={16} />
                  <span className="text-xs font-sans font-bold uppercase tracking-wider">XP Earned</span>
                </div>
                <span className="text-lg font-serif font-bold text-accent-gold">+{score * XP_REWARDS.correctVocab}</span>
              </div>
            </div>
          </section>

          <section className="p-8 bg-ink text-bg-primary rounded-sm space-y-6">
            <h3 className="text-[10px] font-sans font-bold text-bg-primary/40 uppercase tracking-[0.3em] border-b border-bg-primary/10 pb-4">
              Pro-Tip
            </h3>
            <p className="text-sm font-sans text-bg-primary/60 leading-relaxed italic">
              "Spelling is the foundation of lexical precision. In the GRE, misinterpreting a word's structure can lead to semantic errors in Sentence Equivalence."
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default SpellingPractice;
