import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Club } from '../constants';
import { X, MapPin, Clock, Users, Star, ChevronRight, Heart } from 'lucide-react';

interface Props {
  club: Club | null;
  onClose: () => void;
  onLike: (club: Club) => void;
}

export const ClubDetail: React.FC<Props> = ({ club, onClose, onLike }) => {
  if (!club) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="fixed inset-0 z-[100] bg-white overflow-y-auto no-scrollbar"
      >
        <div className="relative">
          <button 
            onClick={onClose}
            className="fixed top-6 left-6 z-10 w-10 h-10 rounded-full bg-black/20 backdrop-blur-md flex items-center justify-center text-white"
          >
            <X size={20} />
          </button>

          <div className="h-[50vh] w-full flex overflow-x-auto snap-x snap-mandatory no-scrollbar">
            {club.detailImages.map((img, i) => (
              <img 
                key={i} 
                src={img} 
                alt={`${club.name} ${i}`} 
                draggable="false"
                className="h-full w-full object-cover flex-shrink-0 snap-center pointer-events-none"
              />
            ))}
          </div>

          <div className="px-6 pt-8 pb-32">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h1 className="text-3xl font-headline font-extrabold mb-2">{club.name}</h1>
                <div className="flex flex-wrap gap-2">
                  {club.tags.map(t => (
                    <span key={t} className="px-3 py-1 bg-primary/10 text-primary text-[10px] font-bold rounded-full">{t}</span>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="bg-surface-container-low p-3.5 rounded-2xl">
                <div className="flex items-center gap-2 text-primary mb-1">
                  <Star size={14} />
                  <span className="text-[9px] font-bold uppercase tracking-wider">社团类型</span>
                </div>
                <p className="font-bold text-sm">{club.type}</p>
              </div>
              <div className="bg-surface-container-low p-3.5 rounded-2xl">
                <div className="flex items-center gap-2 text-primary mb-1">
                  <Clock size={14} />
                  <span className="text-[9px] font-bold uppercase tracking-wider">活动时间</span>
                </div>
                <p className="font-bold text-sm">{club.time}</p>
              </div>
              <div className="bg-surface-container-low p-3.5 rounded-2xl">
                <div className="flex items-center gap-2 text-primary mb-1">
                  <Users size={14} />
                  <span className="text-[9px] font-bold uppercase tracking-wider">招新人数</span>
                </div>
                <p className="font-bold text-sm">{club.memberCount}</p>
              </div>
              <div className="bg-surface-container-low p-3.5 rounded-2xl">
                <div className="flex items-center gap-2 text-primary mb-1">
                  <Star size={14} />
                  <span className="text-[9px] font-bold uppercase tracking-wider">有无面试</span>
                </div>
                <p className="font-bold text-sm">{club.hasInterview ? '有面试' : '无面试'}</p>
              </div>
            </div>

            <div className="space-y-6 mb-10">
              <section>
                <h3 className="text-lg font-headline font-bold mb-2">社团简介</h3>
                <p className="text-sm text-on-surface-variant leading-relaxed">{club.fullIntro}</p>
              </section>
              <section>
                <h3 className="text-lg font-headline font-bold mb-2">日常活动</h3>
                <p className="text-sm text-on-surface-variant leading-relaxed">{club.activities}</p>
              </section>
              <section>
                <h3 className="text-lg font-headline font-bold mb-2">加入收获</h3>
                <p className="text-sm text-on-surface-variant leading-relaxed">{club.benefits}</p>
              </section>
            </div>

            <section className="bg-surface-container-low rounded-3xl p-5 space-y-5">
              <h3 className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">官方渠道</h3>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center text-primary">
                    <Star size={18} />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-on-surface-variant">公众号</p>
                    <p className="font-bold text-sm">{club.officialAccount}</p>
                  </div>
                </div>
                <button className="px-3 py-1.5 bg-on-surface text-white text-[10px] font-bold rounded-full">去关注</button>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center text-primary">
                    <Users size={18} />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-on-surface-variant">招新群</p>
                    <p className="font-bold text-sm">{club.groupNumber}</p>
                  </div>
                </div>
                <button className="px-3 py-1.5 border border-outline-variant text-on-surface text-[10px] font-bold rounded-full">一键加群</button>
              </div>
            </section>
          </div>

          <div className="fixed bottom-0 left-0 right-0 p-6 bg-white/80 backdrop-blur-xl border-t border-black/5">
            <button 
              onClick={() => {
                onLike(club);
                onClose();
              }}
              className="w-full editorial-gradient py-3.5 rounded-full text-white font-headline font-bold text-base flex items-center justify-center gap-2 shadow-xl shadow-primary/20"
            >
              <Heart size={18} fill="currentColor" />
              加入意向清单
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
