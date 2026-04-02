import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Zap, Timer, CheckCircle2, X, ArrowRight, Brain } from 'lucide-react';
import { recordQuizResult, playSound, fireConfetti, awardXP, getStorage, STORAGE_KEYS, XP_REWARDS } from '../utils';
import { Mistake } from '../types';
import { GameAnalysis } from './GameAnalysis';

interface MentalMathProps {
  onXpChange: (xp: number) => void;
  onClose: () => void;
}

type Question = {
  text: string;
  answer: string | string[];
  explanation: string;
};

const MentalMath: React.FC<MentalMathProps> = ({ onXpChange, onClose }) => {
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'over'>('idle');
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [userInput, setUserInput] = useState('');
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [mistakes, setMistakes] = useState<Mistake[]>([]);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  
  const timerRef = useRef<any>(null);
  const soundEnabled = getStorage(STORAGE_KEYS.settings, { soundEnabled: true }).soundEnabled;

  const generateQuestion = (): Question => {
    const types = ['exponent', 'square', 'root', 'percent', 'multi'];
    const type = types[Math.floor(Math.random() * types.length)];

    switch (type) {
      case 'exponent': {
        const base = [2, 3][Math.floor(Math.random() * 2)];
        const n = Math.floor(Math.random() * 5) + 2;
        const count = base;
        const text = Array(count).fill(`${base}^${n}`).join(' + ');
        const numericalValue = Math.pow(base, n + 1);
        return {
          text: `Evaluate: ${text}`,
          answer: [`${base}^${n + 1}`, numericalValue.toString()],
          explanation: `When you add ${count} terms of ${base}^${n}, it's ${count} * (${base}^${n}), which is ${base}^1 * ${base}^n = ${base}^(n+1). ${base}^${n+1} = ${numericalValue}.`
        };
      }
      case 'square': {
        const n = Math.floor(Math.random() * 15) + 11;
        return {
          text: `What is ${n}²?`,
          answer: (n * n).toString(),
          explanation: `The square of ${n} is ${n * n}. Memorizing squares up to 25 is helpful for the GRE.`
        };
      }
      case 'root': {
        const n = Math.floor(Math.random() * 15) + 11;
        const square = n * n;
        return {
          text: `What is √${square}?`,
          answer: n.toString(),
          explanation: `The square root of ${square} is ${n}.`
        };
      }
      case 'percent': {
        const percents = [10, 15, 20, 25, 50];
        const p = percents[Math.floor(Math.random() * percents.length)];
        const val = (Math.floor(Math.random() * 10) + 1) * 20;
        const ans = (p / 100) * val;
        return {
          text: `What is ${p}% of ${val}?`,
          answer: ans.toString(),
          explanation: `${p}% of ${val} is (${p}/100) * ${val} = ${ans}.`
        };
      }
      case 'multi': {
        const a = Math.floor(Math.random() * 8) + 12;
        const b = Math.floor(Math.random() * 5) + 11;
        return {
          text: `What is ${a} × ${b}?`,
          answer: (a * b).toString(),
          explanation: `${a} * ${b} = ${a * b}. Try breaking it down: ${a} * 10 + ${a} * ${b-10}.`
        };
      }
      default:
        return { text: '2 + 2', answer: '4', explanation: 'Basic addition.' };
    }
  };

  const startGame = () => {
    setGameState('playing');
    setScore(0);
    setTimeLeft(60);
    setMistakes([]);
    setCurrentQuestion(generateQuestion());
    setUserInput('');
    setIsCorrect(null);
    setShowFeedback(false);
  };

  useEffect(() => {
    if (gameState === 'playing' && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setGameState('over');
      clearInterval(timerRef.current);
      const newXp = recordQuizResult('Mental Math', score, score + mistakes.length, mistakes);
      onXpChange(newXp);
    }
    return () => clearInterval(timerRef.current);
  }, [gameState, timeLeft]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentQuestion || showFeedback) return;

    const answers = Array.isArray(currentQuestion.answer) ? currentQuestion.answer : [currentQuestion.answer];
    const correct = answers.some(a => userInput.trim().toLowerCase() === a.toLowerCase());
    setIsCorrect(correct);
    setShowFeedback(true);

    if (correct) {
      setScore(s => s + 1);
      playSound('correct', soundEnabled);
      awardXP(XP_REWARDS.correctQuant);
    } else {
      playSound('wrong', soundEnabled);
      setMistakes(prev => [...prev, {
        question: currentQuestion.text,
        userAnswer: userInput,
        correctAnswer: answers[0], // Show the preferred exponent form
        explanation: currentQuestion.explanation
      }]);
    }

    setTimeout(() => {
      setShowFeedback(false);
      setIsCorrect(null);
      setUserInput('');
      setCurrentQuestion(generateQuestion());
    }, 1000);
  };

  if (gameState === 'idle') {
    return (
      <div className="flex flex-col items-center justify-center space-y-12 py-20 text-center animate-in fade-in">
        <div className="space-y-6">
          <div className="w-24 h-24 bg-bg-primary rounded-sm border border-ink/5 flex items-center justify-center text-accent-gold mx-auto shadow-xl">
            <Zap size={40} />
          </div>
          <div className="space-y-2">
            <h2 className="text-5xl font-serif font-bold text-ink">Mental Math Blitz.</h2>
            <p className="text-sm font-sans text-ink/60 tracking-wide max-w-md mx-auto">
              Test your speed and pattern recognition. 60 seconds to solve as many as you can.
            </p>
          </div>
        </div>
        <button 
          onClick={startGame}
          className="px-16 py-6 bg-ink text-white rounded-sm font-sans font-bold text-xs uppercase tracking-[0.3em] hover:bg-ink/90 transition-all shadow-2xl flex items-center gap-4 group"
        >
          Initiate Blitz <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    );
  }

  if (gameState === 'over') {
    return (
      <div className="space-y-12 py-12 text-center animate-in fade-in max-w-4xl mx-auto">
        <div className="space-y-4">
          <span className="text-[10px] font-sans font-bold text-accent-gold uppercase tracking-[0.3em]">Session Terminated</span>
          <h2 className="text-6xl font-serif font-bold text-ink leading-tight">Blitz<br />Result.</h2>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          <div className="p-12 bg-white rounded-sm border border-ink/5 shadow-xl space-y-8">
            <div className="space-y-2">
              <span className="text-[10px] font-sans font-bold text-ink/30 uppercase tracking-[0.2em]">Score</span>
              <p className="text-7xl font-serif font-bold text-ink tracking-tighter">{score}</p>
            </div>
            <div className="flex justify-between items-center border-t border-ink/5 pt-8">
              <div className="text-left">
                <span className="text-[10px] font-sans font-bold text-ink/30 uppercase tracking-[0.2em]">Mistakes</span>
                <p className="text-2xl font-serif font-bold text-red-500">{mistakes.length}</p>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-sans font-bold text-ink/30 uppercase tracking-[0.2em]">Accuracy</span>
                <p className="text-2xl font-serif font-bold text-ink">
                  {score + mistakes.length > 0 ? Math.round((score / (score + mistakes.length)) * 100) : 0}%
                </p>
              </div>
            </div>
            <div className="flex flex-col gap-4">
              <button 
                onClick={startGame}
                className="w-full px-12 py-6 bg-ink text-white rounded-sm font-sans font-bold text-xs uppercase tracking-[0.2em] hover:bg-ink/90 transition-all shadow-xl"
              >
                Retry Blitz
              </button>
              <button 
                onClick={onClose}
                className="w-full px-12 py-6 bg-bg-primary text-ink/60 rounded-sm font-sans font-bold text-xs uppercase tracking-[0.2em] hover:bg-ink/5 transition-all"
              >
                Exit Game
              </button>
            </div>
          </div>

          <div className="text-left">
            <GameAnalysis mistakes={mistakes} onClose={() => {}} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-12 py-12 animate-in fade-in">
      <div className="flex items-center justify-between border-b border-ink/5 pb-8">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-bg-primary rounded-sm border border-ink/5 flex items-center justify-center text-accent-gold">
            <Brain size={24} />
          </div>
          <div>
            <span className="text-[10px] font-sans font-bold text-ink/30 uppercase tracking-[0.2em]">Mental Math</span>
            <h3 className="text-xl font-serif font-bold text-ink">Blitz Mode</h3>
          </div>
        </div>
        <div className="flex items-center gap-8">
          <div className="text-right">
            <span className="text-[10px] font-sans font-bold text-ink/30 uppercase tracking-[0.2em]">Time</span>
            <p className={`text-2xl font-serif font-bold ${timeLeft < 10 ? 'text-red-500 animate-pulse' : 'text-ink'}`}>
              {timeLeft}s
            </p>
          </div>
          <div className="text-right">
            <span className="text-[10px] font-sans font-bold text-ink/30 uppercase tracking-[0.2em]">Score</span>
            <p className="text-2xl font-serif font-bold text-ink">{score}</p>
          </div>
        </div>
      </div>

      <div className="p-12 bg-white rounded-sm border border-ink/5 shadow-2xl relative overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div 
            key={currentQuestion?.text}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-12 text-center"
          >
            <h2 className="text-4xl font-serif font-bold text-ink leading-tight min-h-[80px] flex items-center justify-center">
              {currentQuestion?.text}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="relative">
                <input 
                  autoFocus
                  type="text"
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  placeholder="ANSWER..."
                  className={`w-full p-8 bg-bg-primary border-2 rounded-sm font-serif font-bold text-4xl text-center transition-all outline-none
                    ${showFeedback ? (isCorrect ? 'border-teal-500 bg-teal-50' : 'border-red-500 bg-red-50') : 'border-ink/5 focus:border-accent-gold'}
                  `}
                />
                {showFeedback && (
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-4 -right-4"
                  >
                    {isCorrect ? (
                      <div className="w-12 h-12 bg-teal-500 rounded-full flex items-center justify-center text-white shadow-lg">
                        <CheckCircle2 size={24} />
                      </div>
                    ) : (
                      <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center text-white shadow-lg">
                        <X size={24} />
                      </div>
                    )}
                  </motion.div>
                )}
              </div>
              <p className="text-[10px] font-sans font-bold text-ink/30 uppercase tracking-[0.2em]">Press Enter to Submit</p>
            </form>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="flex justify-center">
        <button 
          onClick={() => setGameState('over')}
          className="text-[10px] font-sans font-bold text-ink/30 uppercase tracking-[0.2em] hover:text-red-500 transition-colors"
        >
          End Session
        </button>
      </div>
    </div>
  );
};

export default MentalMath;
