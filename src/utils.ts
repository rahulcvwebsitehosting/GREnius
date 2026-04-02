/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Word } from './types';
import { ALL_GRE_WORDS } from './data';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Audio System (Web Audio API)
let audioCtx: AudioContext | null = null;

export function initAudio() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
}

export function playSound(type: 'correct' | 'wrong' | 'flip' | 'xp' | 'levelup', enabled: boolean) {
  if (!enabled) return;
  initAudio();
  if (!audioCtx) return;

  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.connect(gain);
  gain.connect(audioCtx.destination);

  const configs = {
    correct: { freq: 523, type: 'sine' as OscillatorType, duration: 0.2, gain: 0.3 },
    wrong:   { freq: 220, type: 'sawtooth' as OscillatorType, duration: 0.3, gain: 0.2 },
    flip:    { freq: 440, type: 'sine' as OscillatorType, duration: 0.1, gain: 0.1 },
    xp:      { freq: 659, type: 'sine' as OscillatorType, duration: 0.15, gain: 0.25 },
    levelup: { freq: 784, type: 'sine' as OscillatorType, duration: 0.5, gain: 0.4 }
  };

  const c = configs[type];
  osc.type = c.type;
  osc.frequency.value = c.freq;
  gain.gain.setValueAtTime(c.gain, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + c.duration);
  osc.start();
  osc.stop(audioCtx.currentTime + c.duration);
}

// Confetti System
export function fireConfetti() {
  const canvas = document.getElementById('confetti-canvas') as HTMLCanvasElement;
  if (!canvas) return;
  canvas.style.display = 'block';
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const particles = Array.from({ length: 120 }, () => ({
    x: canvas.width / 2,
    y: canvas.height / 2,
    vx: (Math.random() - 0.5) * 20,
    vy: Math.random() * -15 - 5,
    color: ['#F0C040', '#3DD6C8', '#FF6B6B', '#A78BFA', '#3DD68C'][Math.floor(Math.random() * 5)],
    size: Math.random() * 6 + 3,
    rotation: Math.random() * 360,
    rotationSpeed: (Math.random() - 0.5) * 10,
    gravity: 0.4,
    life: 1
  }));

  function animate() {
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let alive = false;
    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += p.gravity;
      p.rotation += p.rotationSpeed;
      p.life -= 0.015;
      if (p.life > 0) {
        alive = true;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation * Math.PI / 180);
        ctx.globalAlpha = p.life;
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
        ctx.restore();
      }
    });
    if (alive) requestAnimationFrame(animate);
    else {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      canvas.style.display = 'none';
    }
  }
  animate();
}

// Storage Helpers
export const STORAGE_KEYS = {
  xp: 'grenius_xp',
  level: 'grenius_level',
  streak: 'grenius_streak',
  lastVisit: 'grenius_last_visit',
  masteredWords: 'grenius_mastered_words',
  weakWords: 'grenius_weak_words',
  quizHistory: 'grenius_quiz_history',
  settings: 'grenius_settings',
  dailyGoals: 'grenius_daily_goals',
  studyTime: 'grenius_study_time',
  gamesPlayed: 'grenius_games_played',
  wordsStudied: 'grenius_words_studied',
  unlockedAchievements: 'grenius_unlocked_achievements'
};

export function getStorage<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (e) {
    console.error(`Error parsing storage key ${key}:`, e);
    return defaultValue;
  }
}

export function setStorage<T>(key: string, value: T) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function awardXP(amount: number): number {
  const current = getStorage(STORAGE_KEYS.xp, 0) as number;
  const newXP = current + amount;
  setStorage(STORAGE_KEYS.xp, newXP);
  return newXP;
}

export function updateStreak(): number {
  const today = new Date().toDateString(); // e.g. "Mon Mar 23 2026"
  const lastVisit = getStorage(STORAGE_KEYS.lastVisit, null) as string | null;
  const currentStreak = getStorage(STORAGE_KEYS.streak, 0) as number;
  
  if (lastVisit === today) {
    // Already visited today, streak unchanged
    return currentStreak;
  }
  
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toDateString();
  
  let newStreak: number;
  if (lastVisit === yesterdayStr) {
    // Visited yesterday → increment streak
    newStreak = currentStreak + 1;
  } else if (lastVisit === null) {
    // First ever visit
    newStreak = 1;
  } else {
    // Missed a day → reset streak
    newStreak = 1;
  }
  
  setStorage(STORAGE_KEYS.lastVisit, today);
  setStorage(STORAGE_KEYS.streak, newStreak);
  return newStreak;
}

import { Mistake, QuizResult } from './types';

export function recordQuizResult(type: string, correct: number, total: number, mistakes?: Mistake[]): number {
  const history = getStorage(STORAGE_KEYS.quizHistory, []) as QuizResult[];
  const score = Math.round((correct / total) * 100);
  const entry: QuizResult = {
    type,
    score,
    correct,
    total,
    date: new Date().toISOString(),
    mistakes
  };
  // Keep only last 50 results
  const updated = [...history, entry].slice(-50);
  setStorage(STORAGE_KEYS.quizHistory, updated);

  if (score === 100) {
    return awardXP(XP_REWARDS.perfectQuiz);
  }
  return getStorage(STORAGE_KEYS.xp, 0);
}

export function trackWeakWord(wordId: number) {
  const weakWords = getStorage(STORAGE_KEYS.weakWords, []) as number[];
  if (!weakWords.includes(wordId)) {
    setStorage(STORAGE_KEYS.weakWords, [...weakWords, wordId]);
  }
}

export function removeWeakWord(wordId: number) {
  const weakWords = getStorage(STORAGE_KEYS.weakWords, []) as number[];
  setStorage(STORAGE_KEYS.weakWords, weakWords.filter(id => id !== wordId));
}

// XP and Leveling
export const XP_REWARDS = {
  correctVocab: 10,
  correctQuant: 15,
  correctVerbal: 12,
  flashcardMastered: 5,
  dailyStreak: 20,
  perfectQuiz: 50,
  dailyChallenge: 50
};

export const LEVELS = [
  0, 100, 250, 500, 900, 1400, 2100, 3000, 4200, 5700, 
  8000, 11000, 15000, 20000, 26000, 33000, 41000, 50000, 60000, 75000
];

export function getLevelInfo(xp: number) {
  let level = 1;
  for (let i = LEVELS.length - 1; i >= 0; i--) {
    if (xp >= LEVELS[i]) {
      level = i + 1;
      break;
    }
  }

  const titles = [
    "Novice", "Novice", "Apprentice", "Apprentice", 
    "Scholar", "Scholar", "Academic", "Academic", "Intellectual",
    "Wordsmith", "Wordsmith", "Etymologist", "Etymologist", "Philologist", "Philologist", "Lexicographer", "Lexicographer", "Polymath", "Polymath",
    "GRE Master"
  ];
  
  const title = titles[Math.min(level - 1, titles.length - 1)];
  
  // If we are at the max level, progress is 100% and nextXP is null or current
  const isMaxLevel = level >= LEVELS.length;
  const nextXP = isMaxLevel ? LEVELS[LEVELS.length - 1] : LEVELS[level];
  const prevXP = LEVELS[level - 1] || 0;
  
  const progress = isMaxLevel ? 100 : ((xp - prevXP) / (nextXP - prevXP)) * 100;

  return { level, title, progress, nextXP };
}

export function getDailyChallenge(): Word[] {
  const today = new Date();
  const seed = today.getUTCFullYear() * 10000 + (today.getUTCMonth() + 1) * 100 + today.getUTCDate();
  // Seeded shuffle
  let s = seed;
  const rng = () => { s = (s * 1664525 + 1013904223) & 0xffffffff; return (s >>> 0) / 0xffffffff; };
  const shuffled = [...ALL_GRE_WORDS].sort(() => rng() - 0.5);
  return shuffled.slice(0, 10);
}

export function getDailyChallengeKey(): string {
  const today = new Date();
  return `daily_${today.getUTCFullYear()}_${today.getUTCMonth() + 1}_${today.getUTCDate()}`;
}

export function hasDoneToday(): boolean {
  return !!localStorage.getItem(getDailyChallengeKey());
}

export function markDailyDone(score: number): void {
  localStorage.setItem(getDailyChallengeKey(), JSON.stringify({ score, ts: Date.now() }));
}

export function getUserStats() {
  const xp = getStorage(STORAGE_KEYS.xp, 0);
  const masteredWords = getStorage(STORAGE_KEYS.masteredWords, []).length;
  const quizHistory = getStorage(STORAGE_KEYS.quizHistory, []);
  const quizzesTaken = quizHistory.length;
  const perfectQuizzes = quizHistory.filter((q: any) => q.score === 100).length;
  const streakDays = getStorage(STORAGE_KEYS.streak, 0);
  const gamesPlayed = getStorage(STORAGE_KEYS.gamesPlayed, 0);
  const wordsStudied = getStorage(STORAGE_KEYS.wordsStudied, 0);

  return {
    totalXP: xp,
    masteredWords,
    quizzesTaken,
    streakDays,
    gamesPlayed,
    perfectQuizzes,
    wordsStudied
  };
}

export function incrementStat(key: keyof typeof STORAGE_KEYS, amount = 1) {
  const current = getStorage(STORAGE_KEYS[key], 0) as number;
  setStorage(STORAGE_KEYS[key], current + amount);
}
