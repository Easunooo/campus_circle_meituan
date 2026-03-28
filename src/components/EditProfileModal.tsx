import React, { useState } from 'react';
import { motion } from 'motion/react';
import { UserProfile } from '../types';
import { Smartphone, User, GraduationCap, Calendar, Hash, Mail, Check, X } from 'lucide-react';

interface Props {
  user: UserProfile;
  onSave: (data: Partial<UserProfile>) => void;
  onCancel: () => void;
}

export const EditProfileModal: React.FC<Props> = ({ user, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: user.name,
    college: user.college,
    major: user.major,
    phone: user.phone,
    enrollmentYear: user.enrollmentYear || '',
    studentId: user.studentId || '',
    email: user.email || ''
  });

  const handleSave = () => {
    onSave(formData);
  };

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
        className="relative w-full max-w-sm bg-white rounded-[2.25rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        <div className="p-6 text-center shrink-0">
          <h2 className="text-2xl font-headline font-extrabold mb-1 text-on-surface">修改资料</h2>
          <p className="text-xs text-on-surface-variant">在此更新你的基本信息</p>
        </div>

        <div className="px-6 pb-6 space-y-5 overflow-y-auto no-scrollbar flex-1">
          <div className="space-y-3.5">
            <div className="space-y-1">
              <label className="text-[9px] font-bold uppercase tracking-widest text-on-surface-variant px-1">姓名</label>
              <div className="relative text-on-surface">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant" size={16} />
                <input 
                  className="w-full bg-surface-container-low border-none rounded-2xl p-3.5 pl-11 text-sm font-bold focus:ring-2 focus:ring-primary/20"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[9px] font-bold uppercase tracking-widest text-on-surface-variant px-1">大学</label>
                <div className="relative text-on-surface">
                  <GraduationCap className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant" size={16} />
                  <input 
                    className="w-full bg-surface-container-low border-none rounded-2xl p-3.5 pl-11 text-sm font-bold focus:ring-2 focus:ring-primary/20"
                    value={formData.college}
                    onChange={(e) => setFormData({ ...formData, college: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-bold uppercase tracking-widest text-on-surface-variant px-1">入学年份</label>
                <div className="relative text-on-surface">
                  <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant" size={16} />
                  <input 
                    className="w-full bg-surface-container-low border-none rounded-2xl p-3.5 pl-11 text-sm font-bold focus:ring-2 focus:ring-primary/20"
                    value={formData.enrollmentYear}
                    placeholder="例: 2024"
                    onChange={(e) => setFormData({ ...formData, enrollmentYear: e.target.value })}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[9px] font-bold uppercase tracking-widest text-on-surface-variant px-1">专业</label>
              <div className="relative text-on-surface">
                <GraduationCap className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant" size={16} />
                <input 
                  className="w-full bg-surface-container-low border-none rounded-2xl p-3.5 pl-11 text-sm font-bold focus:ring-2 focus:ring-primary/20"
                  value={formData.major}
                  onChange={(e) => setFormData({ ...formData, major: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[9px] font-bold uppercase tracking-widest text-on-surface-variant px-1">学号</label>
              <div className="relative text-on-surface">
                <Hash className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant" size={16} />
                <input 
                  className="w-full bg-surface-container-low border-none rounded-2xl p-3.5 pl-11 text-sm font-bold focus:ring-2 focus:ring-primary/20"
                  value={formData.studentId}
                  placeholder="请输入学号"
                  onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[9px] font-bold uppercase tracking-widest text-on-surface-variant px-1">手机号</label>
              <div className="relative text-on-surface">
                <Smartphone className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant" size={16} />
                <input 
                  className="w-full bg-surface-container-low border-none rounded-2xl p-3.5 pl-11 text-sm font-bold focus:ring-2 focus:ring-primary/20"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[9px] font-bold uppercase tracking-widest text-on-surface-variant px-1">个人邮箱</label>
              <div className="relative text-on-surface">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant" size={16} />
                <input 
                  className="w-full bg-surface-container-low border-none rounded-2xl p-3.5 pl-11 text-sm font-bold focus:ring-2 focus:ring-primary/20"
                  value={formData.email}
                  placeholder="example@edu.cn"
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2.5 pt-2 shrink-0">
            <button 
              onClick={handleSave}
              className="w-full editorial-gradient py-3.5 rounded-full text-white font-headline font-bold text-base shadow-xl shadow-primary/20 flex items-center justify-center gap-2"
            >
              <Check size={18} />
              保存修改
            </button>
            <button 
              onClick={onCancel}
              className="w-full py-3.5 rounded-full font-headline font-bold text-sm text-on-surface-variant hover:bg-surface-container transition-colors flex items-center justify-center gap-2"
            >
              <X size={16} />
              取消
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};
