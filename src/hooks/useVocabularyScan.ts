import { useMemo } from 'react';
import { GRE_WORDS } from '../data';
import { Word } from '../types';

export function useVocabularyScan(text: string | null | undefined) {
  return useMemo(() => {
    if (!text) return [];
    
    const wordsFound: { word: Word; context: string }[] = [];
    const lowerText = text.toLowerCase();
    
    // Simple scan for top 5 GRE words
    for (const greWord of GRE_WORDS) {
      const wordLower = greWord.word.toLowerCase();
      // Use regex for whole word match
      const regex = new RegExp(`\\b${wordLower}\\b`, 'i');
      const match = text.match(regex);
      
      if (match) {
        // Extract context (sentence)
        const start = Math.max(0, match.index! - 60);
        const end = Math.min(text.length, match.index! + wordLower.length + 60);
        const context = `...${text.substring(start, end)}...`;
        
        wordsFound.push({ word: greWord, context });
        if (wordsFound.length >= 5) break;
      }
    }
    
    return wordsFound;
  }, [text]);
}
