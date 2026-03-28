import React from 'react';
import { motion } from 'motion/react';
import { UserProfile } from '../types';
import { Smartphone, User, GraduationCap, ArrowRight } from 'lucide-react';

interface Props {
  user: UserProfile;
  onSubmit: (data: Partial<UserProfile>) => void;
  onCancel: () => void;
}

export const SubmissionModal: React.FC<Props> = ({ user, onSubmit, onCancel }) => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] flex items-center justify-center p-6"
    >
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onCancel} />
      
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        className="relative w-full max-w-sm bg-white rounded-[2.25rem] shadow-2xl overflow-hidden"
      >
        <div className="p-6 text-center">
          <h2 className="text-2xl font-headline font-extrabold mb-1">申请加入</h2>
          <p className="text-xs text-on-surface-variant">请确认你的个人信息</p>
        </div>

        <div className="px-6 pb-6 space-y-5">
          <div className="space-y-3.5">
            <div className="space-y-1">
              <label className="text-[9px] font-bold uppercase tracking-widest text-on-surface-variant px-1">姓名</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant" size={16} />
                <input 
                   className="w-full bg-surface-container-low border-none rounded-2xl p-3.5 pl-11 text-sm font-bold focus:ring-2 focus:ring-primary/20"
                  defaultValue={user.name}
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[9px] font-bold uppercase tracking-widest text-on-surface-variant px-1">院系/专业</label>
              <div className="relative">
                <GraduationCap className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant" size={16} />
                <input 
                   className="w-full bg-surface-container-low border-none rounded-2xl p-3.5 pl-11 text-sm font-bold focus:ring-2 focus:ring-primary/20"
                  defaultValue={`${user.college} / ${user.major}`}
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[9px] font-bold uppercase tracking-widest text-on-surface-variant px-1">手机号</label>
              <div className="relative">
                <Smartphone className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant" size={16} />
                <input 
                   className="w-full bg-surface-container-low border-none rounded-2xl p-3.5 pl-11 text-sm font-bold focus:ring-2 focus:ring-primary/20"
                  defaultValue={user.phone}
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2.5">
            <button 
              onClick={() => onSubmit({})}
              className="w-full editorial-gradient py-3.5 rounded-full text-white font-headline font-bold text-base shadow-xl shadow-primary/20 flex items-center justify-center gap-2"
            >
              确认投递
              <ArrowRight size={18} />
            </button>
            <button 
              onClick={onCancel}
              className="w-full py-3.5 rounded-full font-headline font-bold text-sm text-on-surface-variant hover:bg-surface-container transition-colors"
            >
              取消
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};
