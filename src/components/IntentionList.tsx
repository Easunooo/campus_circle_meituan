import React, { useState } from 'react';
import { motion, Reorder, AnimatePresence, useDragControls } from 'motion/react';
import { Club, CLUBS } from '../constants';
import { Application } from '../types';
import { cn } from '../lib/utils';
import { GripVertical, CheckCircle2, Clock, AlertCircle, Send, Plus, Trash2 } from 'lucide-react';

interface Props {
  intentionIds: string[];
  applications: Application[];
  onReorder: (newIds: string[]) => void;
  onSubmit: (selectedIds: string[]) => void;
  onViewClub: (club: Club) => void;
  onDelete?: (clubId: string) => void;
}

export const IntentionList: React.FC<Props> = ({ intentionIds, applications, onReorder, onSubmit, onViewClub, onDelete }) => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  
  const intentionClubs = intentionIds.map(id => CLUBS.find(c => c.id === id)!).filter(Boolean);
  const isSubmitted = applications.length > 0;

  // Clear selections after successful submission
  React.useEffect(() => {
    setSelectedIds(prev => prev.filter(id => !applications.some(app => app.clubId === id)));
  }, [applications]);

  const scrollRef = React.useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeft(scrollRef.current.scrollLeft);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 2; // Speed multiplier
    scrollRef.current.scrollLeft = scrollLeft - walk;
  };

  const toggleSelect = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(prev => prev.filter(i => i !== id));
    } else if (selectedIds.length < 5) {
      setSelectedIds(prev => [...prev, id]);
    }
  };

  return (
    <div className="flex-1 relative overflow-hidden bg-surface">
      {/* Premium Ambient background */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[40%] bg-primary/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[60%] h-[40%] bg-indigo-500/10 rounded-full blur-[100px]" />
      </div>

      <div className="absolute inset-0 z-10 px-6 pt-10 pb-40 overflow-y-auto no-scrollbar">
        <motion.div 
          className="mb-6 px-1"
        >
          <h1 className="text-3xl font-headline font-black tracking-tight text-on-surface">我的社团</h1>
        </motion.div>

        <AnimatePresence>
          {isSubmitted && (
            <motion.section 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mb-6"
            >
              <div className="flex items-center justify-between mb-5 px-1">
                <h3 className="font-headline font-black text-base text-on-surface-variant/40">申请实时进度</h3>
              </div>
              <div 
                ref={scrollRef}
                onMouseDown={handleMouseDown}
                onMouseLeave={handleMouseLeave}
                onMouseUp={handleMouseUp}
                onMouseMove={handleMouseMove}
                className={cn(
                  "flex gap-4 overflow-x-auto pb-4 no-scrollbar snap-x cursor-grab active:cursor-grabbing select-none -mx-6 px-7 scroll-px-7",
                  isDragging && "snap-none"
                )}
              >
                {applications.map((app) => {
                  const club = CLUBS.find(c => c.id === app.clubId)!;
                  return (
                    <div key={app.clubId} className="flex-shrink-0 w-64 h-36 p-5 rounded-[1.75rem] bg-white shadow-[0_12px_30px_rgba(0,0,0,0.04)] snap-start flex flex-col justify-between">
                      <div className="flex justify-between items-start">
                        <p className="font-headline font-black text-base text-on-surface leading-tight truncate pr-4">{club.name}</p>
                        <StatusBadge status={app.status} />
                      </div>
                      <div className="mt-auto">
                        <div className="relative h-2 w-full bg-black/5 rounded-full overflow-hidden mb-3 pointer-events-none">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ 
                              width: app.status === 'pending' ? "25%" : 
                                     app.status === 'interviewing' ? "50%" : "100%" 
                            }}
                            transition={{ duration: 1, ease: "easeOut" }}
                            className={cn(
                              "h-full rounded-full",
                              app.status === 'pending' ? "bg-indigo-500" :
                              app.status === 'interviewing' ? "bg-amber-500" :
                              app.status === 'passed' ? "bg-emerald-500" : "bg-rose-500"
                            )}
                          />
                        </div>
                        <div className="flex justify-between text-xs font-black uppercase tracking-widest text-on-surface-variant/30 px-1 pointer-events-none transform scale-[0.9] origin-bottom">
                          <span className={cn(app.status !== 'pending' && "text-on-surface-variant/60")}>申请</span>
                          <span className={cn((app.status === 'interviewing' || app.status === 'passed') && "text-on-surface-variant/60")}>面试</span>
                          <span className={cn(app.status === 'passed' && "text-on-surface-variant/60")}>录取</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.section>
          )}
        </AnimatePresence>

        <section>
          <div className="flex items-center justify-between mb-5 px-1">
            <h3 className="font-headline font-black text-base text-on-surface-variant/40">意向清单管理</h3>
            {intentionClubs.length > 0 && (
              <button 
                onClick={() => {
                  setIsSelectionMode(!isSelectionMode);
                  if (isSelectionMode) setSelectedIds([]); 
                }}
                className={cn(
                  "text-xs font-black tracking-widest uppercase px-4 py-1.5 rounded-full transition-all duration-300 transform scale-[0.95] origin-right",
                  isSelectionMode 
                    ? "bg-black/5 text-on-surface-variant/60"
                    : "bg-primary text-white"
                )}
              >
                {isSelectionMode ? '退出选择' : '多选投递'}
              </button>
            )}
          </div>

          <div className="space-y-4 select-none">
            {intentionClubs.map((club, index) => {
              const isSelected = selectedIds.includes(club.id);
              
              return (
                <ReorderItem 
                  key={club.id}
                  club={club}
                  index={index}
                  isSelected={isSelected}
                  isSelectionMode={isSelectionMode}
                  onToggle={() => toggleSelect(club.id)}
                  onView={() => onViewClub(club)}
                  onDelete={() => onDelete?.(club.id)}
                  onSubmitSingle={() => onSubmit([club.id])}
                />
              );
            })}
            
            {intentionClubs.length === 0 && (
              <div className="py-20 flex flex-col items-center text-center px-10">
                <div className="w-20 h-20 rounded-[2.5rem] bg-black/5 flex items-center justify-center mb-6">
                  <Plus size={40} strokeWidth={3} className="text-on-surface-variant opacity-20" />
                </div>
                <p className="text-on-surface-variant/80 font-bold">列表还是空的</p>
                <p className="text-on-surface-variant/40 text-xs mt-2">快去发现页面寻找感兴趣的社团吧</p>
              </div>
            )}
          </div>
        </section>

      </div>
      
      {isSelectionMode && selectedIds.length > 0 && (
        <div className="absolute bottom-24 left-0 right-0 z-30 flex justify-center px-8">
          <motion.button 
            whileTap={{ scale: 0.95 }}
            onClick={() => onSubmit(selectedIds)}
            className="px-8 py-3 rounded-full font-headline font-black text-sm flex items-center justify-center gap-2 shadow-[0_8px_30px_rgb(0,0,0,0.12)] bg-primary text-white transition-all duration-300"
          >
            <Send size={18} strokeWidth={2.5} />
            <span>申请投递 ({selectedIds.length})</span>
          </motion.button>
        </div>
      )}


      
      
    </div>
  );
};

const ReorderItem = ({ club, index, isSelected, isSelectionMode, onToggle, onView, onDelete, onSubmitSingle }: any) => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={cn(
        "pl-1 pr-5 py-3 rounded-[2.2rem] flex items-center gap-1.5 transition-all duration-300 select-none group",
        isSelected 
          ? "ring-2 ring-primary/40 bg-white shadow-md" 
          : "bg-white shadow-[0_8px_25px_rgba(0,0,0,0.04)]"
      )}
    >
      <div 
        className={cn(
          "flex flex-col items-center justify-center w-6 h-12 text-on-surface-variant/20 transition-all duration-500"
        )}
      >
        <span className="text-sm font-black mb-0.5 opacity-60 font-body tracking-tighter">{(index + 1).toString().padStart(2, '0')}</span>
        <div className="flex flex-col gap-0.5 mt-0.5">
          <div className="w-1 h-1 rounded-full bg-current opacity-60" />
          <div className="w-1 h-1 rounded-full bg-current" />
          <div className="w-1 h-1 rounded-full bg-current opacity-60" />
        </div>
      </div>
      
      <div 
        onClick={isSelectionMode ? onToggle : onView}
        className="flex-1 flex items-center gap-4 min-w-0 cursor-pointer"
      >
        <div className="relative flex-shrink-0">
          <img src={club.coverImage} className="w-16 h-16 rounded-[1.25rem] object-cover shadow-sm ring-4 ring-white/20" alt="" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <h4 className="font-headline font-black text-base text-on-surface truncate">{club.name}</h4>
          </div>
          <div className="flex flex-wrap gap-1.5 mt-1 opacity-60">
            {club.tags.map((tag: string) => (
              <span key={tag} className="px-2 py-0.5 bg-black/5 text-on-surface-variant text-base font-bold rounded-full uppercase tracking-tight inline-block transform scale-[0.75] origin-left -mr-2">
                {tag}
              </span>
            ))}
          </div>
        </div>

        {isSelectionMode ? (
          <div className="flex flex-col justify-center items-center w-12 px-2 text-primary">
            {isSelected ? (
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="w-6 h-6 rounded-full bg-primary flex items-center justify-center shadow-md"
              >
                <CheckCircle2 size={16} strokeWidth={3} color="white" />
              </motion.div>
            ) : (
              <div className="w-6 h-6 rounded-full border-2 border-on-surface-variant/20" />
            )}
          </div>
        ) : (
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <button 
              onClick={(e) => { e.stopPropagation(); onSubmitSingle(); }}
              className="p-2 text-on-surface-variant/20 hover:text-primary transition-colors duration-200"
            >
              <Send size={22} strokeWidth={2.5} />
            </button>
            <button 
              onClick={(e) => { e.stopPropagation(); onDelete(); }}
              className="p-2 text-on-surface-variant/20 hover:text-rose-500 transition-colors duration-200"
            >
              <Trash2 size={22} strokeWidth={2.5} />
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
};

const StatusBadge = ({ status }: { status: Application['status'] }) => {
  const config = {
    pending: { label: '待审核', color: 'text-indigo-500', bg: 'bg-indigo-500/10' },
    interviewing: { label: '待面试', color: 'text-amber-500', bg: 'bg-amber-500/10' },
    passed: { label: '已通过', color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
    rejected: { label: '未录取', color: 'text-rose-500', bg: 'bg-rose-500/10' },
  };

  const { label, color, bg } = config[status];

  return (
    <span className={cn("text-xs font-black px-2 py-0.5 rounded-full uppercase tracking-widest inline-block transform scale-[0.7] origin-right", bg, color)}>
      {label}
    </span>
  );
};

