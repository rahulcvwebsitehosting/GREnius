import React, { useState, useMemo } from 'react';
import useSWR from 'swr';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, RefreshCw, AlertCircle, Loader2, Filter } from 'lucide-react';
import { NewsCategory, NewsCard as NewsCardType } from '../../types';
import { fetchNews } from '../../lib/newsApi';
import { CategoryTabs } from './CategoryTabs';
import { NewsCard } from './NewsCard';
import { ArticleModal } from './ArticleModal';
import { cn } from '../../utils';

export const NewsContainer = () => {
  const [activeCategory, setActiveCategory] = useState<NewsCategory>('India');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedArticle, setSelectedArticle] = useState<NewsCardType | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const { data: articles, error, isLoading, mutate } = useSWR(
    ['news', activeCategory],
    () => fetchNews(activeCategory),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      dedupingInterval: 300000, // 5 minutes
    }
  );

  const filteredArticles = useMemo(() => {
    if (!articles) return [];
    return articles.filter(article => 
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.summary.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [articles, searchQuery]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await mutate();
    setIsRefreshing(false);
  };

  const heroArticle = filteredArticles[0];
  const gridArticles = filteredArticles.slice(1);

  return (
    <div className="space-y-10 max-w-7xl mx-auto px-4 md:px-8 py-10">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <span className="w-12 h-0.5 bg-accent-gold" />
            <span className="text-[10px] font-sans font-bold text-accent-gold uppercase tracking-[0.4em]">
              The Daily GREnius
            </span>
          </div>
          <h1 className="text-6xl md:text-8xl font-serif font-bold text-ink tracking-tighter">
            News & <br />
            <span className="text-accent-gold">Affairs.</span>
          </h1>
          <p className="text-sm font-sans text-ink/40 max-w-md leading-relaxed">
            Curated global and Indian news, analyzed for GRE aspirants. 
            Build your vocabulary while staying informed about the world.
          </p>
        </div>

        <div className="flex flex-col gap-4 w-full md:w-auto">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-ink/20 group-focus-within:text-accent-gold transition-colors" size={18} />
            <input
              type="text"
              placeholder="Search headlines..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full md:w-80 pl-12 pr-6 py-4 bg-bg-primary border border-ink/5 rounded-sm text-sm font-sans focus:outline-none focus:border-accent-gold/50 focus:ring-4 focus:ring-accent-gold/5 transition-all"
            />
          </div>
          <div className="flex items-center justify-between md:justify-end gap-4">
            <button 
              onClick={handleRefresh}
              disabled={isRefreshing || isLoading}
              className="flex items-center gap-2 px-4 py-2 text-[10px] font-sans font-bold text-ink/40 uppercase tracking-widest hover:text-ink transition-colors disabled:opacity-50"
            >
              <RefreshCw size={14} className={cn(isRefreshing && "animate-spin")} />
              {isRefreshing ? 'Refreshing...' : 'Refresh Feed'}
            </button>
            <div className="flex items-center gap-2 px-4 py-2 bg-ink/5 rounded-full">
              <div className="w-1.5 h-1.5 rounded-full bg-accent-gold animate-pulse" />
              <span className="text-[8px] font-sans font-bold text-ink/40 uppercase tracking-widest">Live Updates</span>
            </div>
          </div>
        </div>
      </div>

      {/* Categories */}
      <CategoryTabs 
        activeCategory={activeCategory} 
        onCategoryChange={setActiveCategory} 
      />

      {/* Main Content */}
      <div className="min-h-[400px]">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-3 h-[400px] bg-ink/5 animate-pulse rounded-sm" />
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="h-80 bg-ink/5 animate-pulse rounded-sm" />
            ))}
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
            <AlertCircle size={48} className="text-accent-gold" />
            <h3 className="text-2xl font-serif font-bold text-ink">Feed Unavailable</h3>
            <p className="text-sm font-sans text-ink/40 max-w-xs">
              We're having trouble reaching our news sources. Please check your connection or try again later.
            </p>
            <button 
              onClick={() => mutate()}
              className="px-8 py-3 bg-ink text-white text-xs font-sans font-bold uppercase tracking-widest rounded-sm hover:bg-accent-gold transition-all"
            >
              Retry Connection
            </button>
          </div>
        ) : filteredArticles.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
            <Search size={48} className="text-ink/10" />
            <h3 className="text-2xl font-serif font-bold text-ink">No Stories Found</h3>
            <p className="text-sm font-sans text-ink/40">
              Try adjusting your search or category filters.
            </p>
          </div>
        ) : (
          <div className="space-y-12">
            {/* Hero Story */}
            {heroArticle && !searchQuery && (
              <NewsCard 
                article={heroArticle} 
                onClick={setSelectedArticle} 
                isHero 
              />
            )}

            {/* Grid Stories */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {(searchQuery ? filteredArticles : gridArticles).map((article) => (
                <NewsCard 
                  key={article.id} 
                  article={article} 
                  onClick={setSelectedArticle} 
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer Disclaimer */}
      <div className="pt-20 pb-10 border-t border-ink/5 text-center space-y-4">
        <p className="text-[10px] font-sans text-ink/20 uppercase tracking-[0.2em] max-w-2xl mx-auto leading-loose">
          GREnius News aggregates stories from GNews, NewsData.io, and TheNewsAPI. 
          All content and images are property of their respective owners. 
          Vocabulary analysis is for educational purposes only.
        </p>
      </div>

      {/* Article Modal */}
      <ArticleModal 
        article={selectedArticle} 
        onClose={() => setSelectedArticle(null)} 
      />
    </div>
  );
};
