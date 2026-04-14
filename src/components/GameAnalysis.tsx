import React from 'react';
import { motion } from 'motion/react';
import { CheckCircle2, XCircle, ChevronRight, AlertCircle } from 'lucide-react';
import { Mistake } from '../types';

interface GameAnalysisProps {
  mistakes: Mistake[];
  onClose: () => void;
  title?: string;
}

export const GameAnalysis: React.FC<GameAnalysisProps> = ({ mistakes, onClose, title = "Performance Analysis" }) => {
  if (mistakes.length === 0) {
    return (
      <div className="p-6 sm:p-12 text-center space-y-6 bg-white rounded-sm border border-ink/5 shadow-xl animate-in fade-in zoom-in duration-500">
        <div className="w-20 h-20 bg-teal-50 rounded-full flex items-center justify-center text-teal-500 mx-auto">
          <CheckCircle2 size={40} />
        </div>
        <div className="space-y-2">
          <h3 className="text-3xl font-serif font-bold text-ink">Flawless Execution.</h3>
          <p className="text-sm font-sans text-ink/60">No lexical or logical errors detected in this session.</p>
        </div>
        <button 
          onClick={onClose}
          className="px-8 py-4 bg-ink text-white rounded-sm font-sans font-bold text-[10px] uppercase tracking-[0.2em] hover:bg-ink/90 transition-all"
        >
          Continue
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between border-b border-ink/5 pb-6">
        <div className="space-y-1">
          <h3 className="text-2xl font-serif font-bold text-ink">{title}</h3>
          <p className="text-[10px] font-sans font-bold text-red-500 uppercase tracking-[0.2em]">
            {mistakes.length} {mistakes.length === 1 ? 'Error' : 'Errors'} Identified
          </p>
        </div>
        <button 
          onClick={onClose}
          className="text-[10px] font-sans font-bold text-ink/30 hover:text-ink uppercase tracking-[0.2em] transition-colors"
        >
          Close Analysis
        </button>
      </div>

      <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-4 custom-scrollbar">
        {mistakes.map((mistake, idx) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="p-6 bg-white rounded-sm border border-ink/5 shadow-sm space-y-4 group hover:border-ink/20 transition-all"
          >
            <div className="flex items-start gap-4">
              <div className="mt-1 w-6 h-6 rounded-full bg-red-50 flex items-center justify-center text-red-500 shrink-0">
                <XCircle size={14} />
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-sans font-bold text-ink/30 uppercase tracking-[0.2em]">Question</p>
                <p className="text-lg font-serif font-bold text-ink leading-tight">{mistake.question}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-ink/5">
              <div className="space-y-1">
                <p className="text-[10px] font-sans font-bold text-red-400 uppercase tracking-[0.2em]">Your Response</p>
                <p className="text-sm font-sans font-medium text-red-900 line-through opacity-60">{mistake.userAnswer}</p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-sans font-bold text-teal-500 uppercase tracking-[0.2em]">Correct Answer</p>
                <p className="text-sm font-sans font-bold text-teal-900">{mistake.correctAnswer}</p>
              </div>
            </div>

            {mistake.explanation && (
              <div className="p-4 bg-bg-primary/50 rounded-sm border-l-2 border-accent-gold">
                <div className="flex items-center gap-2 mb-2">
                  <AlertCircle size={12} className="text-accent-gold" />
                  <p className="text-[10px] font-sans font-bold text-accent-gold uppercase tracking-[0.2em]">Analysis</p>
                </div>
                <p className="text-xs font-sans text-ink/60 leading-relaxed italic">
                  {mistake.explanation}
                </p>
              </div>
            )}
          </motion.div>
        ))}
      </div>

      <div className="pt-6 border-t border-ink/5 flex justify-center">
        <button 
          onClick={onClose}
          className="px-12 py-6 bg-ink text-white rounded-sm font-sans font-bold text-xs uppercase tracking-[0.2em] hover:bg-ink/90 transition-all shadow-xl"
        >
          Acknowledge & Continue
        </button>
      </div>
    </div>
  );
};
