import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Club } from '../constants';
import { X, MapPin, Clock, Users, Star, ChevronRight, Heart, Send } from 'lucide-react';
import { cn } from '../lib/utils';

interface Props {
  club: Club | null;
  onClose: () => void;
  onLike: (club: Club) => void;
  onSubmit: (club: Club) => void;
  isLiked: boolean;
}

export const ClubDetail: React.FC<Props> = ({ club, onClose, onLike, onSubmit, isLiked }) => {
  if (!club) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 z-[100] bg-surface/80 backdrop-blur-md flex flex-col pt-16 pb-12 px-4 overflow-y-auto no-scrollbar"
      >
        <button 
          onClick={onClose}
          className="absolute top-6 left-6 z-[110] w-10 h-10 rounded-full bg-white/80 backdrop-blur-md flex items-center justify-center text-on-surface border border-black/5 shadow-lg active:scale-90 transition-all"
        >
          <X size={20} strokeWidth={2.5} />
        </button>

        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="w-full bg-white rounded-[2rem] shadow-2xl relative z-20 px-8 pt-12 pb-8 flex flex-col border border-black/5"
        >
          <div className="mb-3">
            <h2 className="text-3xl font-headline font-black text-on-surface mb-2 tracking-tight">{club.name}</h2>
            <div className="flex flex-wrap gap-0 text-on-surface-variant">
              {club.tags.map(t => (
                <span key={t} className="text-4xs bg-primary/10 text-primary px-3 py-1 rounded-full font-medium uppercase tracking-[0.02em] whitespace-nowrap scale-[0.9] origin-center">{t}</span>
              ))}
            </div>
          </div>

          {club.detailImages && club.detailImages.length > 0 && (
            <div className="h-[26vh] flex overflow-x-auto snap-x snap-mandatory no-scrollbar mb-10 -mx-8 px-8 gap-3">
              {club.detailImages.map((img, i) => (
                <img 
                  key={i} 
                  src={img} 
                  alt={`${club.name} ${i}`} 
                  className="h-full w-[80%] object-cover rounded-2xl flex-shrink-0 snap-center bg-surface-variant shadow-sm border border-black/5"
                />
              ))}
            </div>
          )}
          
          <div className="grid grid-cols-2 gap-x-8 gap-y-6 mb-12">
            {[
              { label: '社团类型', value: club.type },
              { label: '活动时间', value: club.time },
              { label: '招新人数', value: club.memberCount },
              { label: '有无面试', value: club.hasInterview ? '有面试' : '无面试' },
            ].map((item, i) => (
              <div key={i} className="flex flex-col gap-1">
                <span className="text-xs text-on-surface-variant">{item.label}</span>
                <span className="text-md font-semibold text-on-surface">{item.value}</span>
              </div>
            ))}
          </div>

          <div className="space-y-8 mb-12">
            {[
              { title: '简介', content: club.fullIntro },
              { title: '日常', content: club.activities },
              { title: '收获', content: club.benefits },
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
                   <span className="text-base font-semibold text-on-surface">{club.officialAccount}</span>
                   <button className="px-4 py-1.5 bg-black/[0.05] text-on-surface text-sm font-bold rounded-full transition-colors">关注</button>
                 </div>
              </div>
              <div className="flex justify-between items-center py-4">
                 <span className="text-base text-on-surface-variant">招新群</span>
                 <div className="flex items-center gap-3">
                   <span className="text-base font-semibold text-on-surface">{club.groupNumber}</span>
                   <button className="px-4 py-1.5 bg-black/[0.05] text-on-surface text-sm font-bold rounded-full transition-colors">加群</button>
                 </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3 pt-2">
              <button 
                onClick={() => {
                  if (!isLiked) {
                    onLike(club);
                  }
                  onClose();
                }}
                className={cn(
                  "w-full py-4 rounded-full font-bold text-base transition-colors flex items-center justify-center gap-2",
                  isLiked 
                    ? "bg-black/[0.05] text-on-surface/40 cursor-default" 
                    : "bg-rose-500 text-white hover:bg-rose-600"
                )}
              >
                <Heart size={18} fill={isLiked ? "currentColor" : "none"} />
                <span>{isLiked ? '已添加到意向清单' : '添加到意向清单'}</span>
              </button>

              {isLiked && (
                <button 
                  onClick={() => {
                    onSubmit(club);
                    onClose();
                  }}
                  className="w-full py-4 rounded-full bg-rose-500 text-white font-bold text-base transition-all hover:bg-rose-600 active:scale-[0.98] flex items-center justify-center gap-2 shadow-lg shadow-rose-500/20"
                >
                  <Send size={18} />
                  <span>立即申请投递</span>
                </button>
              )}
              

          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

