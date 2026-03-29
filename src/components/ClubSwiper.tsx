import React, { useState } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'motion/react';
import { useEffect } from 'react';
import { Club } from '../constants';
import { cn } from '../lib/utils';
import { Heart, X, Info, Search, Settings, Clock, Users, Star } from 'lucide-react';

interface Props {
  clubs: Club[];
  onSwipeLeft: (club: Club) => void;
  onSwipeRight: (club: Club) => void;
  onSearch: () => void;
  onSettings: () => void;
}

export const ClubSwiper: React.FC<Props> = ({ clubs, onSwipeLeft, onSwipeRight, onSearch, onSettings }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-15, 15]);
  const opacity = useTransform(x, [-200, -150, 0, 150, 200], [0, 1, 1, 1, 0]);
  const likeOpacity = useTransform(x, [50, 150], [0, 1]);
  const nopeOpacity = useTransform(x, [-150, -50], [1, 0]);

  const currentClub = clubs[currentIndex];
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const container = document.getElementById('discovery-scroll-container');
    const handleScroll = () => {
      if (container) {
        setIsScrolled(container.scrollTop > 100);
      }
    };
    container?.addEventListener('scroll', handleScroll);
    return () => container?.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const container = document.getElementById('discovery-scroll-container');
    if (container) {
      container.scrollTo({ top: 0, behavior: 'instant' });
    }
  }, [currentClub?.id]);

  const handleDragEnd = (_: any, info: any) => {
    if (info.offset.x > 100) {
      onSwipeRight(currentClub);
      setCurrentIndex(prev => prev + 1);
    } else if (info.offset.x < -100) {
      onSwipeLeft(currentClub);
      setCurrentIndex(prev => prev + 1);
    }
    x.set(0);
  };

  if (currentIndex >= clubs.length) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-10 text-center">
        <div className="w-20 h-20 bg-surface-container rounded-full flex items-center justify-center mb-6">
          <Info className="text-on-surface-variant" size={32} />
        </div>
        <h2 className="text-2xl font-headline font-bold mb-2">已浏览全部社团</h2>
        <p className="text-on-surface-variant">去意向清单看看你的选择吧</p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col min-h-0 relative">
      <div className={cn(
        "absolute top-9 left-8 right-8 justify-between items-center z-40 mt-[env(safe-area-inset-top)]",
        isScrolled ? "hidden" : "flex"
      )}>
        <button 
          onClick={(e) => {
            e.stopPropagation();
            onSearch();
          }}
          className="w-11 h-11 rounded-full flex items-center justify-center backdrop-blur-md shadow-sm bg-white/10 text-white hover:bg-white/20 transition-colors"
        >
          <Search size={22} />
        </button>
        <button 
          onClick={(e) => {
            e.stopPropagation();
            onSettings();
          }}
          className="w-11 h-11 rounded-full flex items-center justify-center backdrop-blur-md shadow-sm bg-white/10 text-white hover:bg-white/20 transition-colors"
        >
          <Settings size={22} />
        </button>
      </div>

      <div id="discovery-scroll-container" className="h-full w-full overflow-y-auto overflow-x-hidden no-scrollbar snap-y snap-proximity relative scroll-smooth">
        {/* Page 1: The Swiper View */}
        <div className="h-full w-full flex-shrink-0 flex flex-col relative snap-start px-4 pt-4 pb-28">
          <div className="flex-1 relative mt-[env(safe-area-inset-top)]">
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.div
              key={currentClub.id}
              style={{ x, rotate, touchAction: 'pan-y' }}
              drag="x"
              dragDirectionLock
              dragPropagation={false}
              dragConstraints={{ left: 0, right: 0 }}
              dragTransition={{ bounceStiffness: 600, bounceDamping: 20 }}
              onDragEnd={handleDragEnd}
              className="absolute inset-0 z-10 cursor-grab active:cursor-grabbing will-change-[transform,rotate]"
            >
              <div className="h-full w-full bg-surface rounded-[1.75rem] shadow-xl overflow-hidden relative border border-black/5 isolate transform-gpu select-none">
                <img 
                  src={currentClub.coverImage} 
                  alt={currentClub.name}
                  draggable="false"
                  className="absolute inset-0 w-full h-full object-cover pointer-events-none"
                />
                
                <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black/40 to-transparent z-10" />

                <motion.div 
                  style={{ opacity: likeOpacity }}
                  className="absolute top-24 left-10 border-4 border-emerald-500 text-emerald-500 font-headline font-black text-2xl px-4 py-2 rounded-xl rotate-[-15deg] uppercase z-20"
                >
                  感兴趣
                </motion.div>
                <motion.div 
                  style={{ opacity: nopeOpacity }}
                  className="absolute top-24 right-10 border-4 border-rose-500 text-rose-500 font-headline font-black text-2xl px-4 py-2 rounded-xl rotate-[15deg] uppercase z-20"
                >
                  跳过
                </motion.div>

                <div 
                  className="absolute inset-0 z-10 pointer-events-none bg-white/10"
                  style={{
                    maskImage: 'linear-gradient(to top, black 0%, black 15%, transparent 60%)',
                    WebkitMaskImage: 'linear-gradient(to top, black 0%, black 15%, transparent 60%)',
                    backdropFilter: 'blur(32px) saturate(180%)',
                    WebkitBackdropFilter: 'blur(32px) saturate(180%)',
                  }}
                />

                <div className="absolute inset-x-0 bottom-0 p-8 pb-16 pt-20 z-20 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex flex-col gap-4">
                  <div>
                    <h2 className="text-3xl font-headline font-black text-white leading-tight mb-4 drop-shadow-md">{currentClub.name}</h2>
                    <div className="flex flex-wrap gap-x-0 gap-y-1 mb-4">
                      {[...currentClub.tags, ...currentClub.practicalTags.slice(0, 2)].map((t, idx) => {
                        const isPractical = idx >= currentClub.tags.length;
                        return (
                          <span 
                            key={t} 
                            className={cn(
                              "inline-flex items-center justify-center px-3 py-1 text-4xs font-normal rounded-full backdrop-blur-sm uppercase tracking-wider whitespace-nowrap scale-[0.9] origin-center",
                              isPractical ? "bg-black/20 text-white/90" : "bg-white/10 text-white"
                            )}
                          >
                            {t}
                          </span>
                        );
                      })}
                    </div>
                    <p className="text-base text-white/90 leading-relaxed line-clamp-3 font-medium drop-shadow-md">
                      {currentClub.intro}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="absolute bottom-24 left-0 right-0 flex justify-center items-center gap-6 z-20 pointer-events-none">
          <button 
            onClick={() => {
              onSwipeLeft(currentClub);
              setCurrentIndex(prev => prev + 1);
            }}
            className="w-14 h-14 rounded-full bg-white shadow-md flex items-center justify-center text-on-surface-variant hover:text-rose-500 transition-colors pointer-events-auto"
          >
            <X size={28} />
          </button>
          <button 
            onClick={() => {
              // Scroll to the next snap point
              const container = document.getElementById('discovery-scroll-container');
              if (container) {
                container.scrollBy({ top: window.innerHeight, behavior: 'smooth' });
              }
            }}
            className="w-12 h-12 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant hover:bg-surface-container-high transition-colors pointer-events-auto shadow-md"
          >
            <Info size={22} />
          </button>
          <button 
            onClick={() => {
              onSwipeRight(currentClub);
              setCurrentIndex(prev => prev + 1);
            }}
            className="w-14 h-14 rounded-full bg-white shadow-md flex items-center justify-center text-primary transition-colors pointer-events-auto"
          >
            <Heart size={28} fill="currentColor" />
          </button>
        </div>
        
      </div>

      {/* Page 2: Detail Card View */}
      <div className="min-h-full w-full flex-shrink-0 flex flex-col snap-start px-4 pt-4 pb-12">
        <div className="flex-1 w-full bg-white rounded-[1.75rem] shadow-xl relative z-20 px-8 pt-10 pb-4 flex flex-col mt-[env(safe-area-inset-top)] border border-black/5">
          
          <div className="mb-3">
            <h2 className="text-3xl font-headline font-black text-on-surface mb-2 tracking-tight">{currentClub.name}</h2>
            <div className="flex flex-wrap gap-x-1.5 gap-y-1 text-on-surface-variant">
              {currentClub.tags.map(t => (
                <span key={t} className="text-4xs bg-primary/10 text-primary px-3 py-1 rounded-full font-normal uppercase tracking-[0.02em] scale-[0.85] origin-left whitespace-nowrap">{t}</span>
              ))}
            </div>
          </div>

          {currentClub.detailImages && currentClub.detailImages.length > 0 && (
            <div className="h-[26vh] flex overflow-x-auto snap-x snap-mandatory no-scrollbar mb-10 -mx-8 px-8 gap-3">
              {currentClub.detailImages.map((img, i) => (
                <img 
                  key={i} 
                  src={img} 
                  alt={`${currentClub.name} ${i}`} 
                  className="h-full w-[80%] object-cover rounded-2xl flex-shrink-0 snap-center bg-surface-variant shadow-sm"
                />
              ))}
            </div>
          )}
          
          <div className="grid grid-cols-2 gap-x-8 gap-y-6 mb-12">
            {[
              { label: '社团类型', value: currentClub.type },
              { label: '活动时间', value: currentClub.time },
              { label: '招新人数', value: currentClub.memberCount },
              { label: '有无面试', value: currentClub.hasInterview ? '有面试' : '无面试' },
            ].map((item, i) => (
              <div key={i} className="flex flex-col gap-1">
                <span className="text-xs text-on-surface-variant">{item.label}</span>
                <span className="text-md font-semibold text-on-surface">{item.value}</span>
              </div>
            ))}
          </div>

          <div className="space-y-8 mb-12">
            {[
              { title: '简介', content: currentClub.fullIntro },
              { title: '日常', content: currentClub.activities },
              { title: '收获', content: currentClub.benefits },
            ].map((section, i) => (
              <section key={i}>
                <h3 className="text-md font-bold mb-2 text-on-surface">{section.title}</h3>
                <p className="text-base text-on-surface-variant leading-relaxed">
                  {section.content}
                </p>
              </section>
            ))}
          </div>

          <div className="mb-6 pb-2">
            <h3 className="text-md font-bold mb-4 text-on-surface">联系渠道</h3>
            <div className="space-y-1">
              <div className="flex justify-between items-center py-4 border-b border-black/[0.03]">
                 <span className="text-base text-on-surface-variant">公众号</span>
                 <div className="flex items-center gap-3">
                   <span className="text-base font-semibold text-on-surface">{currentClub.officialAccount}</span>
                   <button className="px-4 py-1.5 bg-black/[0.05] text-on-surface text-sm font-bold rounded-full transition-colors">关注</button>
                 </div>
              </div>
              <div className="flex justify-between items-center py-4">
                 <span className="text-base text-on-surface-variant">招新群</span>
                 <div className="flex items-center gap-3">
                   <span className="text-base font-semibold text-on-surface">{currentClub.groupNumber}</span>
                   <button className="px-4 py-1.5 bg-black/[0.05] text-on-surface text-sm font-bold rounded-full transition-colors">加群</button>
                 </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3 pt-2 pb-6">
              <button 
                onClick={() => {
                  onSwipeRight(currentClub);
                  setCurrentIndex(prev => prev + 1);
                  const container = document.getElementById('discovery-scroll-container');
                  if (container) {
                    container.scrollTo({ top: 0, behavior: 'instant' });
                  }
                }}
                className="w-full py-4 rounded-full bg-rose-500 text-white font-bold text-base transition-colors hover:bg-rose-600 flex items-center justify-center gap-2"
              >
                <Heart size={18} fill="currentColor" />
                添加到兴趣清单
              </button>
              <button 
                onClick={() => {
                  const container = document.getElementById('discovery-scroll-container');
                  if (container) {
                    container.scrollTo({ top: 0, behavior: 'smooth' });
                  }
                }}
                className="w-full py-4 rounded-full bg-surface-container text-on-surface font-semibold text-base transition-colors hover:bg-surface-container-high"
              >
                返回顶部
              </button>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
};
