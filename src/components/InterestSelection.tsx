import React from 'react';
import { motion } from 'motion/react';
import { INTEREST_TAGS } from '../constants';
import { cn } from '../lib/utils';

interface Props {
  selected: string[];
  onToggle: (tag: string) => void;
  onComplete: () => void;
}

export const InterestSelection: React.FC<Props> = ({ selected, onToggle, onComplete }) => {
  return (
    <div className="h-full overflow-y-auto bg-surface px-5 sm:px-6 pt-[max(4rem,env(safe-area-inset-top))] pb-[calc(2.5rem+env(safe-area-inset-bottom))] flex flex-col">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 sm:mb-10 text-center"
      >
        <h1 className="font-headline text-[32px] sm:text-[42px] font-extrabold tracking-tight mb-2 leading-[1.05]">找到你的兴趣圈子.</h1>
        <p className="text-on-surface-variant text-[16px] sm:text-[19px] font-medium opacity-70 px-4">挑选你感兴趣的领域，开启社团发现之旅</p>
      </motion.div>
 
      <div className="flex flex-wrap justify-center gap-x-2.5 gap-y-3.5 mb-auto px-1">
        {INTEREST_TAGS.map((interest, idx) => {
          const isSelected = selected.includes(interest.name);
          // Create variety by slightly varying padding based on index or name length
          const extraPadding = interest.name.length > 2 ? "px-6" : "px-4";
          
          return (
            <motion.button
              key={`${interest.name}-${idx}`}
              onClick={() => onToggle(interest.name)}
              className={cn(
                "flex items-center gap-2 py-2.5 rounded-full transition-all border-1.5 whitespace-nowrap",
                extraPadding,
                isSelected 
                  ? "bg-primary/5 border-primary/5 text-primary shadow-sm" 
                  : "bg-white border-outline-variant/25 text-on-surface hover:border-outline-variant/60"
              )}
            >
              <span className="text-[18px] sm:text-[22px] leading-none translate-y-[-0.5px]">{interest.icon}</span>
              <span className="font-headline font-semibold text-[15.5px] sm:text-[18.5px] tracking-tight translate-y-[-1px]">{interest.name}</span>
            </motion.button>
          );
        })}
      </div>
 
      <div className="mt-12 flex flex-col items-center gap-4 shrink-0">
        <div className="text-sm font-medium text-on-surface-variant">
          已选择 {selected.length} 个感兴趣领域 {selected.length === 0 && "(可跳过)"}
        </div>
        <button
          onClick={onComplete}
          className={cn(
            "w-full max-w-[280px] mx-auto py-3.5 rounded-full font-headline font-bold text-[17.5px] sm:text-[20.5px] transition-all active:scale-[0.98]",
            selected.length > 0 
              ? "editorial-gradient text-white shadow-xl" 
              : "bg-surface-container-high text-on-surface/60 hover:bg-surface-container-highest"
          )}
        >
          {selected.length > 0 ? "开启匹配之旅" : "跳过并进入"}
        </button>
      </div>
    </div>
  );
};
