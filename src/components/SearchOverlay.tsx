import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, X, ChevronRight, ChevronLeft } from 'lucide-react';
import { Club, CLUBS } from '../constants';
import { cn } from '../lib/utils';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSelectClub: (club: Club) => void;
  intentionIds: string[];
}

export const SearchOverlay: React.FC<Props> = ({ isOpen, onClose, onSelectClub, intentionIds }) => {
  const [query, setQuery] = useState('');

  const results = useMemo(() => {
    if (!query.trim()) return CLUBS;
    return CLUBS.filter(club => 
      club.name.toLowerCase().includes(query.toLowerCase()) ||
      club.intro.toLowerCase().includes(query.toLowerCase()) ||
      club.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
    );
  }, [query]);

  const suggestedInterests = useMemo(() => {
    const allTags = CLUBS.flatMap(club => club.tags);
    const tagCounts: { [key: string]: number } = {};
    allTags.forEach(tag => {
      tagCounts[tag] = (tagCounts[tag] || 0) + 1;
    });
    return Object.entries(tagCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([tag]) => tag);
  }, []);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.4, ease: [0.32, 0.72, 0, 1] }}
          className="absolute inset-y-0 -left-[1px] -right-[1px] z-[100] flex flex-col bg-white/85 backdrop-blur-[40px]"
        >
          <header className="px-8 pt-12 pb-3 flex items-center gap-1.5">
            <button 
              onClick={onClose}
              className="p-1 px-1.5 text-black/60 active:opacity-70 transition-opacity"
            >
              <ChevronLeft size={24} />
            </button>
            <div className="flex-1 relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-black/40" size={20} />
              <input
                autoFocus
                type="text"
                placeholder="搜索社团、活动..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full bg-black/[0.06] border-none rounded-[14px] py-2.5 pl-10 pr-10 text-md font-medium text-black placeholder:text-black/40 focus:ring-0 focus:outline-none focus:bg-black/[0.08] transition-colors"
                style={{ WebkitAppearance: 'none' }}
              />
              {query && (
                <button 
                  onClick={() => setQuery('')}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-black/40 hover:text-black/60 transition-colors"
                >
                  <X size={20} />
                </button>
              )}
            </div>
          </header>

          <div className="flex-1 overflow-y-auto no-scrollbar px-8 pb-8 space-y-6">
            {!query && (
              <div className="space-y-3 mt-4">
                <h3 className="text-base font-semibold text-black/50 px-1">根据兴趣搜索</h3>
                <div className="flex flex-wrap gap-2">
                  {suggestedInterests.map(tag => (
                    <button 
                      key={tag}
                      onClick={() => setQuery(tag)}
                      className="px-4 py-2 bg-black/[0.04] rounded-full text-sm font-medium text-black/80 active:bg-black/10 transition-colors"
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {query && results.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 text-black/40">
                <Search size={42} className="opacity-20 mb-4" />
                <p className="text-md font-medium">未找到相关内容</p>
              </div>
            ) : (
              <div className="flex flex-col mt-2">
                {!query && (
                  <h3 className="text-base font-semibold text-black/50 mb-2 px-1">
                    全部社团 ({results.length})
                  </h3>
                )}
                <div className="flex flex-col">
                  {results.map((club, index) => (
                    <motion.button
                      key={club.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.2 }}
                      onClick={() => {
                        onSelectClub(club);
                      }}
                      className="w-full flex items-center gap-3.5 py-1 px-2 active:bg-black/5 rounded-2xl transition-colors relative"
                    >
                      <img src={club.coverImage} className="w-[82px] h-[82px] rounded-[22px] object-cover shadow-[0_4px_16px_rgba(0,0,0,0.06)] bg-black/5" alt="" />
                      <div className={cn(
                        "flex-1 text-left py-3 flex flex-col justify-center min-h-[64px] border-black/5",
                        index !== results.length - 1 && "border-b"
                      )}>
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold text-md text-black/90 leading-tight">{club.name}</h4>
                          {intentionIds.includes(club.id) && (
                            <span className="text-[11px] font-semibold text-black/40 bg-black/[0.04] px-1.5 py-1 rounded-md uppercase tracking-widest whitespace-nowrap">已添加</span>
                          )}
                        </div>
                        <div className="flex flex-wrap gap-1 mt-1.5">
                          {club.tags.slice(0, 2).map(tag => (
                            <span key={tag} className="text-sm font-medium text-black/50 bg-black/[0.04] px-2 py-0.5 rounded-full uppercase tracking-widest whitespace-nowrap inline-block transform scale-[0.8] origin-left -mr-1.5">
                              {tag}
                            </span>
                          ))}
                          {club.practicalTags.slice(0, 1).map(tag => (
                            <span key={tag} className="text-sm font-medium text-black/60 bg-black/[0.08] px-2 py-0.5 rounded-full uppercase tracking-widest whitespace-nowrap inline-block transform scale-[0.8] origin-left -mr-1.5">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 text-black/20">
                        <ChevronRight size={20} />
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
