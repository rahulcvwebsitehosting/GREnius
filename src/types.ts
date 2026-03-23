/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Word {
  id: number;
  word: string;
  pronunciation: string;
  pos: string;
  definition: string;
  mnemonic: string;
  example: string;
  difficulty: number;
  category: string;
}

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

export interface ChessPuzzle {
  id: number;
  title: string;
  difficulty: string;
  description: string;
  position: string;
  solution: string;
  explanation: string;
}

export interface QuizResult {
  section: string;
  score: number;
  total: number;
  date: string;
}

export interface UserSettings {
  name: string;
  dailyGoal: number;
  soundEnabled: boolean;
  theme: 'light' | 'dark';
}
