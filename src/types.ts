/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type Word = {
  id: number;
  word: string;
  pronunciation: string;
  pos: string;
  definition: string;
  mnemonic: string;
  example: string;
  difficulty: number;
  category: string;
  synonyms?: string[];
};

export interface QuantQuestion {
  id: number;
  type: "QC" | "MC" | "NE";
  difficulty: number;
  topic: string;
  colA?: string;
  colB?: string;
  question?: string;
  options?: string[];
  answer: string;
  explanation: string;
}

export interface VerbalQuestion {
  id: number;
  type: "TC" | "SE" | "RC";
  blanks?: number;
  sentence?: string;
  options?: string[][] | string[];
  answers?: string[];
  explanation: string;
  passage?: string;
  questions?: {
    q: string;
    options: string[];
    answer: string;
    explanation: string;
  }[];
}

export interface Mistake {
  question: string;
  userAnswer: string;
  correctAnswer: string;
  explanation?: string;
}

export interface QuizResult {
  type: string;
  score: number;
  correct: number;
  total: number;
  date: string;
  mistakes?: Mistake[];
}

export interface UserSettings {
  name: string;
  dailyGoal: number;
  soundEnabled: boolean;
  theme: 'light' | 'dark';
}

export type UserStats = {
  totalXP: number;
  masteredWords: number;
  quizzesTaken: number;
  streakDays: number;
  gamesPlayed: number;
  perfectQuizzes: number;
  wordsStudied: number;
};

export interface NewsCard {
  id: string;
  title: string;
  summary: string;
  source: {
    name: string;
    url: string;
    favicon?: string;
  };
  author?: string;
  publishedAt: string;
  imageUrl?: string;
  category: string;
  country: string;
  vocabularyHighlight?: {
    word: string;
    definition: string;
    context: string;
  }[];
  readTime: number;
  originalUrl: string;
  content?: string;
}

export type NewsCategory = 'India' | 'World' | 'Education' | 'Business' | 'Science';

export type Achievement = {
  id: string;
  title: string;
  description: string;
  icon: string;
  condition: (stats: UserStats) => boolean;
  xpReward: number;
};

export type WorldDay = {
  month: number;        // 1–12
  day: number;          // 1–31
  name: string;
  category: 'health' | 'environment' | 'education' | 'science' | 'culture' | 'civic' | 
            'awareness' | 'national' | 'global' | 'food' | 'technology' | 'memorial' | 
            'media' | 'cultural' | 'sports';
  icon: string;
  description: string;
  greWord?: string;     // optional GRE word linked
  greWordDef?: string;  // optional definition for the GRE word
  greWordId?: number;   // optional ID to link to vocabulary section
};
