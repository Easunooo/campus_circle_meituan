import React, { useState } from 'react';
import { motion, Reorder, AnimatePresence, useDragControls } from 'motion/react';
import { Club, CLUBS } from '../constants';
import { Application } from '../types';
import { cn } from '../lib/utils';
import { GripVertical, CheckCircle2, Clock, AlertCircle, Send, Plus } from 'lucide-react';

interface Props {
  intentionIds: string[];
  applications: Application[];
  onReorder: (newIds: string[]) => void;
  onSubmit: (selectedIds: string[]) => void;
}

export const IntentionList: React.FC<Props> = ({ intentionIds, applications, onReorder, onSubmit }) => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  
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

      <div className="absolute inset-0 z-10 px-6 pt-16 pb-40 overflow-y-auto no-scrollbar">
        <motion.div 
          className="mb-8"
        >
          <h1 className="text-3xl font-headline font-black tracking-tight text-on-surface mb-2">我的社团</h1>
          <p className="text-on-surface-variant/45 font-semibold text-[13px] tracking-wide">管理校园生活与申请进度</p>
        </motion.div>

        <AnimatePresence>
          {isSubmitted && (
            <motion.section 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mb-12"
            >
              <div className="flex items-center justify-between mb-5 px-1">
                <h3 className="font-headline font-black text-[13px] uppercase tracking-[0.2em] text-on-surface-variant/40">申请实时进度</h3>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary/40" />
                  <span className="text-[10px] font-black text-primary/60 tracking-widest uppercase">Live Updates</span>
                </div>
              </div>
              <div 
                ref={scrollRef}
                onMouseDown={handleMouseDown}
                onMouseLeave={handleMouseLeave}
                onMouseUp={handleMouseUp}
                onMouseMove={handleMouseMove}
                className={cn(
                  "flex gap-4 overflow-x-auto pb-6 no-scrollbar snap-x cursor-grab active:cursor-grabbing select-none",
                  isDragging && "snap-none"
                )}
              >
                {applications.map((app) => {
                  const club = CLUBS.find(c => c.id === app.clubId)!;
                  return (
                    <div key={app.clubId} className="flex-shrink-0 w-64 p-5 rounded-[2.5rem] bg-white/40 backdrop-blur-3xl border border-white/60 snap-start shadow-sm">
                      <div className="flex justify-between items-center mb-5">
                        <p className="font-headline font-black text-[14px] text-on-surface truncate pr-2">{club.name}</p>
                        <StatusBadge status={app.status} />
                      </div>
                      <div className="relative h-2 w-full bg-black/5 rounded-full overflow-hidden mb-4 pointer-events-none">
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
                      <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-on-surface-variant/30 px-1 pointer-events-none">
                        <span className={cn(app.status !== 'pending' && "text-on-surface-variant/60")}>申请</span>
                        <span className={cn((app.status === 'interviewing' || app.status === 'passed') && "text-on-surface-variant/60")}>面试</span>
                        <span className={cn(app.status === 'passed' && "text-on-surface-variant/60")}>录取</span>
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
            <h3 className="font-headline font-black text-[13px] uppercase tracking-[0.2em] text-on-surface-variant/40">意向清单管理</h3>
            {!isSubmitted && (
              <span className="text-[10px] font-bold text-on-surface-variant/50 tracking-wide bg-black/5 px-3 py-1 rounded-full">
                长按拖拽排序
              </span>
            )}
          </div>

          <Reorder.Group axis="y" values={intentionIds} onReorder={onReorder} className="space-y-4 select-none">
            {intentionClubs.map((club, index) => {
              const isSelected = selectedIds.includes(club.id);
              
              return (
                <ReorderItem 
                  key={club.id}
                  club={club}
                  index={index}
                  isSelected={isSelected}
                  onToggle={() => toggleSelect(club.id)}
                />
              );
            })}
            
            {intentionClubs.length === 0 && (
              <div className="py-20 flex flex-col items-center text-center px-10">
                <div className="w-20 h-20 rounded-[2.5rem] bg-black/5 flex items-center justify-center mb-6 text-on-surface-variant/20">
                  <Plus size={40} strokeWidth={1} />
                </div>
                <p className="text-on-surface-variant/80 font-bold">列表还是空的</p>
                <p className="text-on-surface-variant/40 text-xs mt-2">快去发现页面寻找感兴趣的社团吧</p>
              </div>
            )}
          </Reorder.Group>
        </section>

        {selectedIds.length > 0 && (
          <div className="fixed bottom-32 left-0 right-0 px-8 z-30">
            <motion.button 
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onSubmit(selectedIds)}
              className="w-full py-5 rounded-[2rem] font-headline font-black text-base flex items-center justify-center gap-3 shadow-lg bg-primary text-white shadow-primary/10 transition-all duration-300"
            >
              <Send size={18} strokeWidth={2.5} />
              <span>一键投递申请 ({selectedIds.length})</span>
            </motion.button>
          </div>
        )}
      </div>
    </div>
  );
};

const ReorderItem = ({ club, index, isSelected, onToggle }: any) => {
  const controls = useDragControls();

  return (
    <Reorder.Item 
      value={club.id}
      dragListener={false}
      dragControls={controls}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      whileDrag={{ 
        scale: 1.02, 
        backgroundColor: "rgba(255, 255, 255, 0.9)",
        boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
        zIndex: 50
      }}
      className={cn(
        "p-3 rounded-[2rem] border flex items-center gap-4 transition-colors duration-200 select-none",
        isSelected 
          ? "ring-2 ring-primary bg-white/80 shadow-lg border-transparent" 
          : "bg-white/40 backdrop-blur-3xl border-white/60 shadow-sm"
      )}
    >
      <div 
        onPointerDown={(e) => controls.start(e)}
        className="flex flex-col items-center justify-center w-10 h-10 -ml-1 text-on-surface-variant/30 group cursor-grab active:cursor-grabbing hover:text-primary/40 transition-colors touch-none"
      >
        <span className="text-[10px] font-black mb-1 opacity-40">{(index + 1).toString().padStart(2, '0')}</span>
        <GripVertical size={16} strokeWidth={2.5} />
      </div>
      
      <div 
        onClick={onToggle}
        className="flex-1 flex items-center gap-4 min-w-0 cursor-pointer"
      >
        <div className="relative flex-shrink-0">
          <img src={club.coverImage} className="w-14 h-14 rounded-2xl object-cover" alt="" />
          <AnimatePresence>
            {isSelected && (
              <motion.div 
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="absolute -top-1.5 -right-1.5 w-6 h-6 bg-primary rounded-full flex items-center justify-center text-white border border-white shadow-md"
              >
                <CheckCircle2 size={12} strokeWidth={3} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <h4 className="font-headline font-black text-[15px] text-on-surface truncate">{club.name}</h4>
            <span className="px-2.5 py-0.5 bg-black/5 text-[9px] font-bold rounded-full text-on-surface-variant/70 uppercase tracking-widest">{club.type}</span>
          </div>
          <p className="text-[12px] text-on-surface-variant/60 font-medium truncate">{club.intro}</p>
        </div>
      </div>
    </Reorder.Item>
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
    <span className={cn("text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest", bg, color)}>
      {label}
    </span>
  );
};

