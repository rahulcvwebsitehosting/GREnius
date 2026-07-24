import React from 'react';
import { NewsCategory } from '../../types';
import { cn } from '../../utils';

interface CategoryTabsProps {
  activeCategory: NewsCategory;
  onCategoryChange: (category: NewsCategory) => void;
}

const CATEGORIES: NewsCategory[] = ['India', 'World', 'Education', 'Business', 'Science'];

export const CategoryTabs = ({ activeCategory, onCategoryChange }: CategoryTabsProps) => {
  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-4 scrollbar-hide">
      {CATEGORIES.map((category) => (
        <button
          key={category}
          onClick={() => onCategoryChange(category)}
          className={cn(
            "px-6 py-2 rounded-full text-xs font-sans font-bold uppercase tracking-[0.2em] transition-all duration-300 shrink-0",
            activeCategory === category
              ? "bg-ink text-white shadow-lg shadow-ink/20"
              : "bg-bg-primary text-ink/40 border border-ink/5 hover:border-accent-gold/30 hover:text-ink"
          )}
        >
          {category}
        </button>
      ))}
    </div>
  );
};
