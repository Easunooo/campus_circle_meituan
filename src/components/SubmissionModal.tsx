import React from 'react';
import { motion } from 'motion/react';
import { UserProfile } from '../types';
import { Smartphone, User, GraduationCap, ArrowRight, MessageSquare, FileUp, Paperclip } from 'lucide-react';
import { Club } from '../constants';

interface SubmissionData {
  [clubId: string]: {
    reason: string;
    attachment?: string;
  };
}

interface Props {
  user: UserProfile;
  clubs: Club[];
  onSubmit: (data: SubmissionData) => void;
  onCancel: () => void;
}

export const SubmissionModal: React.FC<Props> = ({ user, clubs, onSubmit, onCancel }) => {
  const [data, setData] = React.useState<SubmissionData>(
    clubs.reduce((acc, club) => ({
      ...acc,
      [club.id]: { reason: '', attachment: '' }
    }), {})
  );

  const updateData = (clubId: string, updates: Partial<{ reason: string; attachment: string }>) => {
    setData(prev => ({
      ...prev,
      [clubId]: { ...prev[clubId], ...updates }
    }));
  };

  const handleFileClick = (clubId: string) => {
    // Simulated file upload
    const mockFiles = ['作品集.pdf', '个人简历.docx', '项目展示.zip', '设计稿.psd'];
    const randomFile = mockFiles[Math.floor(Math.random() * mockFiles.length)];
    updateData(clubId, { attachment: randomFile });
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 z-[200] flex items-center justify-center p-4 sm:p-6"
    >
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onCancel} />
      
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        className="relative w-full max-w-sm bg-surface rounded-[2.25rem] shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
      >
        <div className="pt-6 pb-4 text-center shrink-0 bg-white border-b border-black/[0.03]">
          <h2 className="text-2xl font-headline font-black mb-1">申请投递</h2>
          <p className="text-xs font-bold text-on-surface-variant/40 uppercase tracking-widest">请补充申请信息</p>
        </div>

        <div className="flex-1 overflow-y-auto p-4 sm:p-6 pb-64 space-y-9 no-scrollbar bg-white">
          {/* Section: Basic info */}
          <section className="space-y-4">
            <h3 className="text-xs font-black text-on-surface-variant/50 uppercase tracking-[0.05em] px-1">确认个人信息</h3>
            <div className="px-1.5 space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-rose-50 flex items-center justify-center text-rose-400 shrink-0">
                  <User size={20} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-on-surface-variant/60 font-black uppercase tracking-widest leading-none mb-1">姓名</p>
                  <p className="text-base font-black truncate text-on-surface">{user.name}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-400 shrink-0">
                  <Smartphone size={20} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-on-surface-variant/60 font-black uppercase tracking-widest leading-none mb-1">手机号</p>
                  <p className="text-base font-black truncate text-on-surface">{user.phone}</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-2 px-1 py-1 transform scale-[0.95] origin-left opacity-70">
              <div className="w-4 h-4 rounded-full bg-emerald-500 flex items-center justify-center text-white shadow-sm shadow-emerald-500/20">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" className="w-2.5 h-2.5">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              </div>
              <p className="text-xs font-bold text-on-surface">默认同步所有个人主页填写信息</p>
            </div>
          </section>

          {/* Section: Club reasons */}
          <section className="space-y-2.5 pb-2">
            <h3 className="text-xs font-black text-on-surface-variant/50 uppercase tracking-[0.05em] px-1">补充社团申请理由</h3>
            {clubs.map((club) => (
              <div key={club.id} className="space-y-5 bg-white rounded-[2.25rem] p-6 shadow-[0_12px_40px_rgba(0,0,0,0.03)] border border-black/[0.03]">
                <div className="flex items-center gap-3">
                  <img src={club.coverImage} className="w-8 h-8 rounded-full object-cover shadow-sm ring-1 ring-black/5" alt="" />
                  <span className="font-headline font-black text-lg tracking-tight">{club.name}</span>
                </div>
                
                <div className="space-y-2.5">
                  <label className="text-xs font-bold text-on-surface-variant/50 uppercase tracking-[0.1em] px-1 flex items-center gap-2">
                    <MessageSquare size={13} strokeWidth={2.5} className="opacity-40" />
                    投递理由
                  </label>
                  <textarea 
                    className="w-full bg-black/[0.015] border border-transparent rounded-2xl p-4 text-sm font-medium focus:outline-none transition-all min-h-[110px] resize-none placeholder:text-on-surface-variant/30 leading-relaxed"
                    placeholder="分享你的优势，吸引社团负责人的注意..."
                    value={data[club.id].reason}
                    onChange={(e) => updateData(club.id, { reason: e.target.value })}
                  />
                </div>

                <div className="space-y-2.5">
                  <label className="text-xs font-bold text-on-surface-variant/50 uppercase tracking-[0.1em] px-1 flex items-center gap-2">
                    <FileUp size={13} strokeWidth={2.5} className="opacity-40" />
                    附件 / 作品集
                    {club.requiresAttachment && (
                      <span className="ml-auto text-primary text-[10px] bg-primary/5 px-2.5 py-1 rounded-full normal-case tracking-tight font-black">必传项</span>
                    )}
                  </label>
                  
                  {data[club.id].attachment ? (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex items-center justify-between bg-primary/[0.03] border border-primary/10 rounded-2xl p-4"
                    >
                      <div className="flex items-center gap-3 overflow-hidden">
                        <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                          <Paperclip size={16} strokeWidth={2.5} />
                        </div>
                        <span className="text-sm font-bold text-primary truncate leading-tight">{data[club.id].attachment}</span>
                      </div>
                      <button 
                        onClick={() => updateData(club.id, { attachment: '' })}
                        className="w-8 h-8 rounded-full hover:bg-primary/5 transition-colors flex items-center justify-center text-primary/40 group-hover:text-primary"
                      >
                        <ArrowRight size={16} strokeWidth={2.5} className="rotate-180" />
                      </button>
                    </motion.div>
                  ) : (
                    <button 
                      onClick={() => handleFileClick(club.id)}
                      className="w-full py-5 border-2 border-dashed border-black/[0.04] rounded-[1.75rem] flex flex-col items-center justify-center gap-1.5 text-on-surface-variant/30 hover:bg-black/[0.01] hover:border-primary/20 hover:text-primary transition-all duration-500 group"
                    >
                      <FileUp size={22} strokeWidth={2} className="mb-1 opacity-50 group-hover:opacity-100" />
                      <span className="text-xs font-bold tracking-tight">点击上传 PDF / 图片 / 视频</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
            <div className="h-20" /> {/* Even more safe clearance for the last card */}
          </section>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-6 pt-10 px-6 bg-gradient-to-t from-white via-white/100 to-transparent pointer-events-none">
          <div className="flex flex-col gap-2 pointer-events-auto">
            <button 
              onClick={() => onSubmit(data)}
              className="w-full editorial-gradient py-3.5 rounded-full text-white font-headline font-black text-sm shadow-md active:scale-[0.98] transition-all flex items-center justify-center"
            >
              确认投递 ({clubs.length})
            </button>
            <button 
              onClick={onCancel}
              className="w-full py-2.5 rounded-full font-headline font-black text-sm text-on-surface-variant/30 hover:text-on-surface-variant/60 transition-colors"
            >
              稍后再说
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};
