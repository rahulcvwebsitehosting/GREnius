import React from 'react';
import { motion } from 'framer-motion';
import { LucideIcon, ArrowRight } from 'lucide-react';

interface StatCardProps {
  icon: LucideIcon;
  value: string | number;
  label: string;
  subtitle?: string;
}

export const StatCard = ({ icon: Icon, value, label, subtitle }: StatCardProps) => (
  <div className="space-y-2">
    <div className="flex items-center gap-3 text-ink/40 mb-4">
      <Icon size={20} />
    </div>
    <p className="text-5xl font-serif font-bold text-ink">{value}</p>
    <p className="text-[10px] font-sans font-bold text-ink/40 uppercase tracking-[0.2em]">{label}</p>
    {subtitle && <p className="text-[8px] font-sans text-ink/20 italic mt-1">{subtitle}</p>}
  </div>
);

interface AccoladeItemProps {
  key?: string | number;
  icon: LucideIcon;
  title: string;
  subtitle: string;
  unlocked: boolean;
}

export const AccoladeItem = ({ icon: Icon, title, subtitle, unlocked }: AccoladeItemProps) => (
  <div className={`flex items-center gap-4 transition-all ${unlocked ? 'opacity-100' : 'opacity-25 grayscale'}`}>
    <div className={`w-12 h-12 rounded-full border flex items-center justify-center ${unlocked ? 'border-accent-gold text-accent-gold' : 'border-ink/10 text-ink/20'}`}>
      <Icon size={20} />
    </div>
    <div>
      <p className="text-sm font-serif font-bold text-ink">{title}</p>
      <p className="text-[10px] font-sans text-ink/40 uppercase tracking-widest">
        {unlocked ? subtitle : `🔒 ${subtitle}`}
      </p>
    </div>
  </div>
);

interface GoalItemProps {
  key?: string | number;
  text: string;
  done: boolean;
  progress: number;
  target: number;
}

export const GoalItem = ({ text, done, progress, target }: GoalItemProps) => (
  <div className={`flex flex-col gap-2 p-4 bg-bg-primary rounded-sm border border-ink/5 ${done ? 'opacity-40' : ''}`}>
    <div className="flex items-center gap-3">
      <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${done ? 'bg-ink/20' : 'bg-accent-gold'}`} />
      <span className={`text-xs font-sans text-ink/60 uppercase tracking-widest ${done ? 'line-through' : ''}`}>{text}</span>
      {done && <span className="ml-auto text-[10px] text-accent-gold font-bold">✓ Done</span>}
    </div>
    {!done && (
      <div className="w-full h-0.5 bg-ink/5 rounded-full overflow-hidden ml-4">
        <div className="h-full bg-accent-gold/50 transition-all duration-700" style={{ width: `${(progress / target) * 100}%` }} />
      </div>
    )}
  </div>
);

interface StudySectionCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionText: string;
  onClick: () => void;
}

export const StudySectionCard = ({ icon: Icon, title, description, actionText, onClick }: StudySectionCardProps) => (
  <button 
    onClick={onClick}
    className="group text-left space-y-6"
  >
    <div className="w-16 h-16 bg-bg-primary rounded-sm border border-ink/5 flex items-center justify-center text-accent-gold group-hover:bg-ink group-hover:text-white transition-all duration-500">
      <Icon size={24} />
    </div>
    <div className="space-y-2">
      <h3 className="text-3xl font-serif font-bold text-ink group-hover:text-accent-gold transition-colors">{title}</h3>
      <p className="text-sm font-sans text-ink/60 leading-relaxed">{description}</p>
    </div>
    <div className="flex items-center gap-2 text-[10px] font-sans font-bold text-ink/30 uppercase tracking-[0.2em] group-hover:text-ink transition-colors">
      {actionText} <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
    </div>
  </button>
);
