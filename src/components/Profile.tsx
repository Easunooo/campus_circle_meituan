import React from 'react';
import { motion } from 'motion/react';
import { UserProfile } from '../types';
import { cn } from '../lib/utils';
import { Camera, Edit3, Bell, HelpCircle, FileText, ChevronRight, LayoutGrid, Users, GraduationCap, Calendar, Hash, Mail, Smartphone } from 'lucide-react';

interface Props {
  user: UserProfile;
  onEdit?: () => void;
}

export const Profile: React.FC<Props> = ({ user, onEdit }) => {
  return (
    <div className="flex-1 relative overflow-hidden bg-surface">
      {/* Premium Ambient background */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div 
          className="absolute -top-[10%] -left-[10%] w-[120%] h-[60%] opacity-40 blur-[100px] bg-cover bg-center mix-blend-multiply transition-all duration-1000"
          style={{ backgroundImage: `url(${user.avatar})` }}
        />
        <div className="absolute top-[20%] right-[-10%] w-[50%] h-[40%] bg-primary/10 rounded-full blur-[100px]" />
        <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-surface/90 to-surface pointer-events-none" />
      </div>

      <div className="absolute inset-0 z-10 overflow-y-auto no-scrollbar pt-20 pb-40">
        <section className="flex flex-col items-center mb-10 px-8">
          <motion.div 
            className="relative"
          >
            <div className="w-32 h-32 rounded-[2.5rem] overflow-hidden shadow-xl border-[4px] border-white/60 backdrop-blur-md">
              <img src={user.avatar} alt="Avatar" className="w-full h-full object-cover" />
            </div>
            <button className="absolute -bottom-2 -right-2 bg-white backdrop-blur-md p-3 rounded-2xl shadow-lg border border-white/40 text-on-surface hover:text-primary transition-all">
              <Camera size={24} strokeWidth={2} />
            </button>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mt-8 text-center"
          >
            <h1 className="text-3xl font-headline font-black tracking-tight text-on-surface mb-2">{user.name}</h1>
            <div className="flex flex-col items-center mt-10">
              <div className="text-xl font-headline font-black tracking-tighter text-on-surface">{user.college}</div>
              <div className="text-base font-bold text-on-surface/40 mt-1 tracking-tight">{user.major}</div>
              
              <div className="mt-6 flex flex-col items-center gap-1">
                <div className="text-sm font-medium text-on-surface-variant/50 tracking-tight">{user.enrollmentYear}级</div>
                <div className="text-sm font-medium text-on-surface-variant/50 tracking-tight">{user.email}</div>
              </div>
            </div>
          </motion.div>
        </section>

        <div className="px-8 space-y-8">


          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h3 className="px-0.5 text-xs font-black uppercase tracking-[0.2em] text-on-surface-variant/40 mb-4">账号管理</h3>
            <div className="bg-white/40 backdrop-blur-3xl rounded-[1.75rem] p-2 border border-white/60 shadow-sm overflow-hidden">
              <MenuLink icon={<Edit3 />} label="资料修改" color="text-indigo-500" onClick={onEdit} first />
              <div className="mx-6 h-[1px] bg-black/5" />
              <MenuLink icon={<Bell />} label="系统通知" color="text-rose-500" />
            </div>
          </motion.section>

          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <h3 className="px-0.5 text-xs font-black uppercase tracking-[0.2em] text-on-surface-variant/40 mb-4">更多信息</h3>
            <div className="bg-white/40 backdrop-blur-3xl rounded-[1.75rem] p-2 border border-white/60 shadow-sm overflow-hidden">
              <MenuLink icon={<HelpCircle />} label="帮助与反馈" color="text-neutral-500" first />
              <div className="mx-6 h-[1px] bg-black/5" />
              <MenuLink icon={<FileText />} label="服务与隐私条款" color="text-neutral-500" />
            </div>
          </motion.section>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="pt-6 flex flex-col items-center"
          >
            <button className="w-full py-5 rounded-[2rem] bg-on-surface/5 hover:bg-on-surface/10 text-on-surface-variant/60 font-headline font-black text-md transition-all duration-300 active:scale-[0.98]">
              安全退出
            </button>
            <p className="mt-10 text-[11px] font-bold uppercase tracking-[0.25em] text-on-surface-variant/30">CampusCircle · Release 2.4.0</p>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

const MenuLink = ({ icon, label, color, first, onClick }: any) => (
  <button 
    onClick={onClick}
    className={cn(
    "w-full flex items-center justify-between p-4 px-5 hover:bg-white/40 active:bg-white/60 transition-all group",
    first ? "rounded-t-[1.5rem]" : "rounded-b-[1.5rem]"
  )}>
    <div className="flex items-center gap-4">
      <div className={cn("flex items-center justify-center transition-transform", color)}>
        {React.cloneElement(icon as React.ReactElement, { strokeWidth: 2, size: 24 })}
      </div>
      <span className="font-bold text-md text-on-surface/80 group-hover:text-on-surface transition-colors">{label}</span>
    </div>
    <div className="flex items-center justify-center opacity-20 group-hover:opacity-40 transition-opacity">
      <ChevronRight size={22} strokeWidth={3} className="text-on-surface" />
    </div>
  </button>
);
