import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Clock, ExternalLink, Share2, Bookmark, BookOpen, ArrowRight } from 'lucide-react';
import { format } from 'date-fns';
import { NewsCard as NewsCardType } from '../../types';
import { cn } from '../../utils';
import { useVocabularyScan } from '../../hooks/useVocabularyScan';
import { shareContent } from '../../utils';

interface ArticleModalProps {
  article: NewsCardType | null;
  onClose: () => void;
}

export const ArticleModal = ({ article, onClose }: ArticleModalProps) => {
  const [imageError, setImageError] = React.useState(false);
  const vocab = useVocabularyScan(article?.title + ' ' + article?.summary + ' ' + article?.content);

  const handleShare = (platform: string) => {
    if (!article) return;
    shareContent(platform, {
      title: article.title,
      text: `Check out this story on GREnius: ${article.title}`,
      url: article.originalUrl,
      websitePath: `/news?article=${encodeURIComponent(article.title)}`
    });
  };

  if (!article) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-ink/80 backdrop-blur-sm"
        />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-4xl max-h-[90vh] bg-bg-primary rounded-sm shadow-2xl overflow-hidden flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-ink/5 bg-white/50 backdrop-blur-md sticky top-0 z-10">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-3 py-1 bg-ink rounded-sm">
                {article.source.favicon && (
                  <img 
                    src={article.source.favicon} 
                    alt="" 
                    className="w-4 h-4 rounded-full"
                    referrerPolicy="no-referrer"
                    onError={(e) => (e.target as HTMLImageElement).style.display = 'none'}
                  />
                )}
                <span className="text-white text-[10px] font-sans font-bold uppercase tracking-[0.2em]">
                  {article.source.name}
                </span>
              </div>
              <span className="text-[10px] font-sans font-bold text-ink/30 uppercase tracking-[0.2em] flex items-center gap-1">
                <Clock size={12} /> {article.readTime} min read
              </span>
            </div>
            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center gap-2 mr-4">
                {['Twitter', 'LinkedIn', 'WhatsApp'].map(platform => (
                  <button 
                    key={platform} 
                    onClick={() => handleShare(platform)}
                    className="p-2 text-ink/40 hover:text-ink transition-colors"
                    title={`Share on ${platform}`}
                  >
                    <Share2 size={16} />
                  </button>
                ))}
              </div>
              <button className="p-2 text-ink/40 hover:text-ink transition-colors">
                <Bookmark size={18} />
              </button>
              <button 
                onClick={onClose}
                className="p-2 text-ink/40 hover:text-ink transition-colors bg-ink/5 rounded-full"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6 md:p-10 space-y-8 scrollbar-hide">
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-[10px] font-sans font-bold text-accent-gold uppercase tracking-[0.2em]">
                <span>{article.category}</span>
                <span className="w-1 h-1 rounded-full bg-accent-gold/30" />
                <span>{format(new Date(article.publishedAt), 'MMMM d, yyyy')}</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-serif font-bold text-ink leading-tight">
                {article.title}
              </h2>
            </div>

            {article.imageUrl && !imageError && (
              <div className="aspect-[21/9] rounded-sm overflow-hidden bg-ink/5">
                <img
                  src={article.imageUrl}
                  alt={article.title}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                  onError={() => setImageError(true)}
                />
              </div>
            )}

            <div className="grid md:grid-cols-3 gap-10">
              <div className="md:col-span-2 space-y-6">
                <p className="text-lg font-sans text-ink/80 leading-relaxed first-letter:text-5xl first-letter:font-serif first-letter:font-bold first-letter:mr-3 first-letter:float-left first-letter:text-accent-gold">
                  {article.summary}
                </p>
                <div className="prose prose-ink max-w-none">
                  <p className="text-sm font-sans text-ink/60 leading-relaxed">
                    {article.content || "Full content unavailable. Please visit the source to read the complete article."}
                  </p>
                </div>
                
                <div className="pt-8 border-t border-ink/5">
                  <a 
                    href={article.originalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-3 px-8 py-4 bg-ink text-white text-xs font-sans font-bold uppercase tracking-[0.2em] rounded-sm hover:bg-accent-gold transition-all duration-500 group"
                  >
                    Read Original Article <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                  </a>
                </div>
              </div>

              {/* Vocabulary Sidebar */}
              <div className="space-y-6">
                <div className="p-6 bg-accent-gold/5 rounded-sm border border-accent-gold/10 space-y-4">
                  <div className="flex items-center gap-2 text-accent-gold">
                    <BookOpen size={18} />
                    <h4 className="text-xs font-sans font-bold uppercase tracking-[0.2em]">GRE Vocabulary</h4>
                  </div>
                  
                  {vocab.length > 0 ? (
                    <div className="space-y-6">
                      {vocab.map((v, i) => (
                        <div key={i} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-lg font-serif font-bold text-ink">{v.word.word}</span>
                            <span className="text-[8px] font-sans font-bold text-ink/20 uppercase tracking-widest">
                              {v.word.type}
                            </span>
                          </div>
                          <p className="text-[10px] font-sans text-ink/60 leading-relaxed italic">
                            "{v.context}"
                          </p>
                          <p className="text-[10px] font-sans text-accent-gold font-bold">
                            {v.word.definition}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-[10px] font-sans text-ink/40 italic">
                      No specific GRE vocabulary identified in this snippet. Read more to find hidden gems!
                    </p>
                  )}
                </div>

                <div className="p-6 bg-bg-primary rounded-sm border border-ink/5 space-y-4">
                  <h4 className="text-[10px] font-sans font-bold text-ink/40 uppercase tracking-[0.2em]">Share Story</h4>
                  <div className="flex gap-2">
                    {['Twitter', 'LinkedIn', 'WhatsApp'].map(platform => (
                      <button 
                        key={platform} 
                        onClick={() => handleShare(platform)}
                        className="px-3 py-1.5 bg-ink/5 text-[10px] font-sans font-bold text-ink/60 rounded-sm hover:bg-ink hover:text-white transition-all"
                      >
                        {platform}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
