import React from 'react';
import { motion } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';
import { Clock, ExternalLink, BookOpen } from 'lucide-react';
import { NewsCard as NewsCardType } from '../../types';
import { cn } from '../../utils';
import { useVocabularyScan } from '../../hooks/useVocabularyScan';

interface NewsCardProps {
  key?: string | number;
  article: NewsCardType;
  onClick: (article: NewsCardType) => void;
  isHero?: boolean;
}

export const NewsCard = ({ article, onClick, isHero = false }: NewsCardProps) => {
  const vocab = useVocabularyScan(article.title + ' ' + article.summary);
  const hasVocab = vocab.length > 0;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      className={cn(
        "group bg-bg-primary border border-ink/5 rounded-sm overflow-hidden transition-all duration-500 hover:shadow-2xl hover:border-accent-gold/30 flex flex-col",
        isHero ? "md:grid md:grid-cols-2 md:gap-8 p-6" : "p-4"
      )}
    >
      <div 
        className={cn(
          "relative overflow-hidden rounded-sm bg-ink/5 cursor-pointer",
          isHero ? "aspect-[21/9] md:aspect-auto h-full" : "aspect-[16/9] mb-4"
        )}
        onClick={() => onClick(article)}
      >
        {article.imageUrl ? (
          <img
            src={article.imageUrl}
            alt={article.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-ink/10">
            <BookOpen size={48} />
          </div>
        )}
        <div className="absolute top-3 left-3 flex gap-2">
          <div className="flex items-center gap-2 px-2 py-1 bg-ink/80 backdrop-blur-sm rounded-sm">
            {article.source.favicon && (
              <img 
                src={article.source.favicon} 
                alt="" 
                className="w-3 h-3 rounded-full"
                referrerPolicy="no-referrer"
              />
            )}
            <span className="text-white text-[8px] font-sans font-bold uppercase tracking-widest">
              {article.source.name}
            </span>
          </div>
          {hasVocab && (
            <span className="px-2 py-1 bg-accent-gold text-white text-[8px] font-sans font-bold uppercase tracking-widest rounded-sm flex items-center gap-1">
              🎯 GRE Word
            </span>
          )}
        </div>
      </div>

      <div className="flex flex-col justify-between flex-1">
        <div className="space-y-3">
          <div className="flex items-center gap-3 text-[8px] font-sans font-bold text-ink/30 uppercase tracking-[0.2em]">
            <span>{article.category}</span>
            <span className="w-1 h-1 rounded-full bg-ink/10" />
            <span className="flex items-center gap-1">
              <Clock size={10} /> {formatDistanceToNow(new Date(article.publishedAt))} ago
            </span>
          </div>

          <h3 
            className={cn(
              "font-serif font-bold text-ink group-hover:text-accent-gold transition-colors cursor-pointer leading-tight",
              isHero ? "text-4xl" : "text-xl"
            )}
            onClick={() => onClick(article)}
          >
            {article.title}
          </h3>

          <p className={cn(
            "text-sm font-sans text-ink/60 leading-relaxed line-clamp-3",
            isHero ? "text-base" : "text-sm"
          )}>
            {article.summary}
          </p>
        </div>

        <div className="mt-6 pt-4 border-t border-ink/5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-sans font-bold text-ink/30 uppercase tracking-widest">
              {article.readTime} min read
            </span>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => onClick(article)}
              className="text-[10px] font-sans font-bold text-accent-gold uppercase tracking-[0.2em] hover:text-ink transition-colors flex items-center gap-1"
            >
              Analyze <BookOpen size={12} />
            </button>
            <a 
              href={article.originalUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-ink/20 hover:text-ink transition-colors"
            >
              <ExternalLink size={14} />
            </a>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
