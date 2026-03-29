import React, { useState, useMemo } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Compass, Heart, User as UserIcon, Search, Settings } from 'lucide-react';
import { InterestSelection } from './components/InterestSelection';
import { ClubSwiper } from './components/ClubSwiper';
import { ClubDetail } from './components/ClubDetail';
import { IntentionList } from './components/IntentionList';
import { Profile } from './components/Profile';
import { SubmissionModal } from './components/SubmissionModal';
import { EditProfileModal } from './components/EditProfileModal';
import { SearchOverlay } from './components/SearchOverlay';
import { CLUBS } from './constants';
import { AppState, UserProfile, Application, Club } from './types';
import { cn } from './lib/utils';

const INITIAL_USER: UserProfile = {
  name: 'Patrick Wang',
  avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=1000&auto=format&fit=crop',
  phone: '18596231777',
  college: 'Peking University',
  major: 'Computer Science',
  enrollmentYear: '2024',
  studentId: '202211001',
  email: 'pattwang@stu.pku.edu.cn',
  selectedInterests: []
};

export default function App() {
  const [currentTab, setCurrentTab] = useState<AppState>('interests');
  const [user, setUser] = useState<UserProfile>(INITIAL_USER);
  const [intentionList, setIntentionList] = useState<string[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [activeClubDetail, setActiveClubDetail] = useState<Club | null>(null);
  const [showSubmission, setShowSubmission] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [pendingSubmissionIds, setPendingSubmissionIds] = useState<string[]>([]);

  // Filter and sort clubs based on interests
  const recommendedClubs = useMemo(() => {
    // Filter out clubs that are already in the intention list or have an application
    const filteredClubs = CLUBS.filter(club => 
      !intentionList.includes(club.id) && 
      !applications.some(app => app.clubId === club.id)
    );

    return [...filteredClubs].sort((a, b) => {
      const aMatch = a.tags.filter(t => user.selectedInterests.includes(t)).length;
      const bMatch = b.tags.filter(t => user.selectedInterests.includes(t)).length;
      return bMatch - aMatch;
    });
  }, [user.selectedInterests, intentionList, applications]);

  const handleToggleInterest = (tag: string) => {
    setUser(prev => {
      const exists = prev.selectedInterests.includes(tag);
      if (exists) {
        return { ...prev, selectedInterests: prev.selectedInterests.filter(t => t !== tag) };
      }
      return { ...prev, selectedInterests: [...prev.selectedInterests, tag] };
    });
  };

  const handleLike = (club: Club) => {
    if (!intentionList.includes(club.id)) {
      setIntentionList(prev => [club.id, ...prev]);
    }
  };

  const handleSubmit = (submissionData: any) => {
    const newApps: Application[] = pendingSubmissionIds.map(id => ({
      clubId: id,
      status: 'pending',
      submittedAt: Date.now(),
      reason: submissionData[id]?.reason,
      attachment: submissionData[id]?.attachment
    }));
    setApplications(prev => [...prev, ...newApps]);
    setIntentionList(prev => prev.filter(id => !pendingSubmissionIds.includes(id)));
    setShowSubmission(false);
    setPendingSubmissionIds([]);
    
    // Simulate progress after some time
    setTimeout(() => {
      setApplications(prev => prev.map(a => ({ ...a, status: 'interviewing' })));
    }, 5000);
  };

  const handleDeleteFromIntention = (clubId: string) => {
    setIntentionList(prev => prev.filter(id => id !== clubId));
  };

  const handleUpdateProfile = (newData: Partial<UserProfile>) => {
    setUser(prev => ({ ...prev, ...newData }));
    setShowEditProfile(false);
  };

  return (
    <div className="w-full h-[100dvh] min-h-[100svh] overflow-hidden">
      <div className="w-full h-full flex justify-center overflow-hidden">
      <div className="app-frame w-full max-w-md mx-auto h-[100dvh] min-h-[100svh] bg-surface flex flex-col relative overflow-hidden sm:shadow-xl">
      <div className="flex-1 min-h-0 relative">
      <AnimatePresence mode="wait">
        {currentTab === 'interests' && (
          <motion.div key="interests" className="h-full" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <InterestSelection 
              selected={user.selectedInterests} 
              onToggle={handleToggleInterest} 
              onComplete={() => setCurrentTab('discovery')} 
            />
          </motion.div>
        )}

        {currentTab === 'discovery' && (
          <motion.div key="discovery" className="h-full flex flex-col min-h-0 relative" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <ClubSwiper 
              clubs={recommendedClubs} 
              onSwipeLeft={() => {}} 
              onSwipeRight={handleLike} 
              onSearch={() => setShowSearch(true)}
              onSettings={() => setCurrentTab('interests')}
            />
          </motion.div>
        )}

        {currentTab === 'intentions' && (
          <motion.div key="intentions" className="h-full flex flex-col min-h-0 relative" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <IntentionList 
              intentionIds={intentionList} 
              applications={applications}
              onReorder={setIntentionList}
              onViewClub={(club) => {
                setActiveClubDetail(club);
              }}
              onDelete={handleDeleteFromIntention}
              onSubmit={(ids) => {
                setPendingSubmissionIds(ids);
                setShowSubmission(true);
              }}
            />
          </motion.div>
        )}

        {currentTab === 'profile' && (
          <motion.div key="profile" className="h-full flex flex-col min-h-0 relative" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <Profile 
              user={user} 
              onEdit={() => setShowEditProfile(true)}
            />
          </motion.div>
        )}
      </AnimatePresence>
      </div>

      {currentTab !== 'interests' && (
        <nav className="absolute bottom-[calc(1.25rem+env(safe-area-inset-bottom))] left-1/2 -translate-x-1/2 z-50 w-auto bg-white/20 backdrop-blur-3xl rounded-full py-2 px-6 flex justify-center items-center gap-4 shadow-lg border border-white/20">
          <NavButton 
            active={currentTab === 'discovery'} 
            onClick={() => setCurrentTab('discovery')} 
            icon={<Compass />} 
            label="发现" 
          />
          <NavButton 
            active={currentTab === 'intentions'} 
            onClick={() => setCurrentTab('intentions')} 
            icon={<Heart />} 
            label="意向" 
          />
          <NavButton 
            active={currentTab === 'profile'} 
            onClick={() => setCurrentTab('profile')} 
            icon={<UserIcon />} 
            label="个人" 
          />
        </nav>
      )}

      <AnimatePresence>
        {activeClubDetail && (
          <ClubDetail 
            club={activeClubDetail} 
            onClose={() => setActiveClubDetail(null)} 
            onLike={handleLike}
            onSubmit={(club) => {
              setPendingSubmissionIds([club.id]);
              setShowSubmission(true);
            }}
            isLiked={intentionList.includes(activeClubDetail.id)}
          />
        )}
      </AnimatePresence>

      <SearchOverlay 
        isOpen={showSearch} 
        onClose={() => setShowSearch(false)} 
        onSelectClub={setActiveClubDetail} 
        intentionIds={intentionList}
      />

      <AnimatePresence>
        {showSubmission && (
          <SubmissionModal 
            user={user} 
            clubs={CLUBS.filter(c => pendingSubmissionIds.includes(c.id))}
            onCancel={() => setShowSubmission(false)} 
            onSubmit={handleSubmit} 
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {showEditProfile && (
          <EditProfileModal 
            user={user} 
            onCancel={() => setShowEditProfile(false)} 
            onSave={handleUpdateProfile} 
          />
        )}
      </AnimatePresence>
    </div>
    </div>
    </div>
  );
}

const NavButton = ({ active, onClick, icon, label }: any) => (
  <button 
    onClick={onClick}
    className={cn(
      "flex flex-col items-center justify-center transition-all active:scale-95 p-3 rounded-full",
      active ? "text-primary bg-white/30" : "text-on-surface/30 hover:text-on-surface/50 hover:bg-white/10"
    )}
  >
    <div className={cn("transition-all duration-300", active && "scale-105")}>
      {React.cloneElement(icon, { 
        size: 26,
        fill: active && (label === '意向' || label === 'Heart') ? 'currentColor' : 'none', 
        strokeWidth: 2
      })}
    </div>
  </button>
);
