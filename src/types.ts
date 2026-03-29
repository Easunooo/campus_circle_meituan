export type { Club } from './constants';

export type AppState = 'interests' | 'discovery' | 'intentions' | 'profile';

export interface Interest {
  name: string;
  icon: string;
}

export interface UserProfile {
  name: string;
  avatar: string;
  phone: string;
  college: string;
  major: string;
  enrollmentYear: string;
  studentId: string;
  email: string;
  selectedInterests: string[];
}

export interface Application {
  clubId: string;
  status: 'pending' | 'interviewing' | 'passed' | 'rejected';
  submittedAt: number;
  reason?: string;
  attachment?: string; // URL or filename
}

export interface GlobalState {
  currentTab: AppState;
  user: UserProfile;
  intentionList: string[]; // Club IDs
  applications: Application[];
  isSubmitted: boolean;
}
