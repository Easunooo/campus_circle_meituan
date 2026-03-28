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
  name: 'Julian Chen',
  avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=1000&auto=format&fit=crop',
  phone: '+86 138-0000-0000',
  college: 'Stanford University',
  major: 'Computer Science',
  enrollmentYear: '2022',
  studentId: '202211001',
  email: 'julian.chen@stanford.edu',
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
    return [...CLUBS].sort((a, b) => {
      const aMatch = a.tags.filter(t => user.selectedInterests.includes(t)).length;
      const bMatch = b.tags.filter(t => user.selectedInterests.includes(t)).length;
      return bMatch - aMatch;
    });
  }, [user.selectedInterests]);

  const handleToggleInterest = (tag: string) => {
    setUser(prev => {
      const exists = prev.selectedInterests.includes(tag);
      if (exists) {
        return { ...prev, selectedInterests: prev.selectedInterests.filter(t => t !== tag) };
      }
      if (prev.selectedInterests.length < 5) {
        return { ...prev, selectedInterests: [...prev.selectedInterests, tag] };
      }
      return prev;
    });
  };

  const handleLike = (club: Club) => {
    if (!intentionList.includes(club.id)) {
      setIntentionList(prev => [club.id, ...prev]);
    }
  };

  const handleSubmit = () => {
    const newApps: Application[] = pendingSubmissionIds.map(id => ({
      clubId: id,
      status: 'pending',
      submittedAt: Date.now()
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

  const handleUpdateProfile = (newData: Partial<UserProfile>) => {
    setUser(prev => ({ ...prev, ...newData }));
    setShowEditProfile(false);
  };

  return (
    <div className="max-w-md mx-auto h-screen bg-surface flex flex-col relative shadow-xl overflow-hidden">
      <AnimatePresence mode="wait">
        {currentTab === 'interests' && (
          <motion.div key="interests" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <InterestSelection 
              selected={user.selectedInterests} 
              onToggle={handleToggleInterest} 
              onComplete={() => setCurrentTab('discovery')} 
            />
          </motion.div>
        )}

        {currentTab === 'discovery' && (
          <motion.div key="discovery" className="flex-1 flex flex-col min-h-0 relative" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
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
          <motion.div key="intentions" className="flex-1 flex flex-col" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <IntentionList 
              intentionIds={intentionList} 
              applications={applications}
              onReorder={setIntentionList}
              onSubmit={(ids) => {
                setPendingSubmissionIds(ids);
                setShowSubmission(true);
              }}
            />
          </motion.div>
        )}

        {currentTab === 'profile' && (
          <motion.div key="profile" className="flex-1 flex flex-col" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <Profile 
              user={user} 
              onEdit={() => setShowEditProfile(true)}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {currentTab !== 'interests' && (
        <nav className="absolute bottom-5 left-1/2 -translate-x-1/2 z-50 w-auto bg-white/20 backdrop-blur-3xl rounded-full py-2 px-6 flex justify-center items-center gap-4 shadow-lg border border-white/20">
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

      <ClubDetail 
        club={activeClubDetail} 
        onClose={() => setActiveClubDetail(null)} 
        onLike={handleLike}
      />

      <SearchOverlay 
        isOpen={showSearch} 
        onClose={() => setShowSearch(false)} 
        onSelectClub={setActiveClubDetail} 
      />

      <AnimatePresence>
        {showSubmission && (
          <SubmissionModal 
            user={user} 
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
        size: 22,
        fill: active && (label === '意向' || label === 'Heart') ? 'currentColor' : 'none', 
        strokeWidth: 2
      })}
    </div>
  </button>
);
