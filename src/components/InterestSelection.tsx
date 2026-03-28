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
  const isFull = selected.length === 5;

  return (
    <div className="min-h-screen bg-surface px-6 pt-16 pb-10 flex flex-col">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-10"
      >
        <h1 className="font-headline text-3xl font-extrabold tracking-tight mb-2">找到适合你的社团</h1>
        <p className="text-on-surface-variant text-base">请选择感兴趣的领域（最多 5 个）</p>
      </motion.div>

      <div className="grid grid-cols-3 gap-3 mb-auto">
        {INTEREST_TAGS.map((tag) => {
          const isSelected = selected.includes(tag);
          return (
            <motion.button
              key={tag}
              whileTap={{ scale: 0.95 }}
              onClick={() => onToggle(tag)}
              disabled={!isSelected && isFull}
              className={cn(
                "h-20 rounded-2xl flex flex-col items-center justify-center gap-1.5 transition-all border",
                isSelected 
                  ? "editorial-gradient text-white border-transparent shadow-lg shadow-primary/20" 
                  : "bg-white border-outline-variant/20 text-on-surface hover:bg-surface-container-low disabled:opacity-50"
              )}
            >
              <span className="font-headline font-bold text-sm">{tag}</span>
            </motion.button>
          );
        })}
      </div>

      <div className="mt-12 flex flex-col items-center gap-4">
        <div className="text-sm font-medium text-on-surface-variant">
          已选择 {selected.length} / 5 {selected.length === 0 && "(可跳过)"}
        </div>
        <button
          onClick={onComplete}
          className={cn(
            "w-full py-4 rounded-full font-headline font-bold text-lg transition-all active:scale-[0.98]",
            selected.length > 0 
              ? "editorial-gradient text-white shadow-xl shadow-primary/20" 
              : "bg-surface-container-high text-on-surface/60 hover:bg-surface-container-highest"
          )}
        >
          {selected.length > 0 ? "开启匹配之旅" : "跳过并进入"}
        </button>
      </div>
    </div>
  );
};
