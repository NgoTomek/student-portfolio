export interface User {
  uid: string;
  email: string;
  displayName: string | null;
  photoURL: string | null;
}

export interface PortfolioData {
  personalInfo: {
    name: string;
    email: string;
    phone?: string;
    location?: string;
    bio?: string;
  };
  projects: Project[];
  leadership: LeadershipRole[];
  skills: Skill[];
  contact: {
    email: string;
    phone?: string;
    location?: string;
    socialLinks?: {
      github?: string;
      linkedin?: string;
      twitter?: string;
    };
  };
  lastUpdated: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  technologies: string[];
  startDate: string;
  endDate?: string;
  link?: string;
  imageUrl?: string;
}

export interface LeadershipRole {
  id: string;
  title: string;
  organization: string;
  description: string;
  startDate: string;
  endDate?: string;
}

export interface Skill {
  id: string;
  name: string;
  category: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
}

export interface AuthState {
  currentUser: User | null;
  loading: boolean;
  error: string | null;
}

export interface PersonalInfo {
  displayName: string;
  title: string;
  bio: string;
  location: string;
  avatarUrl?: string;
  coverImageUrl?: string;
  quote?: string;
}

export interface SkillCategory {
  name: string;
  skills: string[];
}

export interface Project {
  id?: string;
  title: string;
  description: string;
  technologies: string[];
  imageUrl?: string;
  githubUrl?: string;
  demoUrl?: string;
  startDate: string;
  endDate: string;
  ongoing: boolean;
  featured: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface Leadership {
  id?: string;
  title: string;
  organization: string;
  description: string;
  startDate: string;
  endDate: string;
  ongoing: boolean;
  imageUrl?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ContactInfo {
  email: string;
  phone?: string;
  linkedIn?: string;
  github?: string;
  twitter?: string;
  website?: string;
  otherLinks?: {
    name: string;
    url: string;
  }[];
}

export interface Portfolio {
  id?: string;
  userId: string;
  personalInfo?: PersonalInfo;
  skills?: SkillCategory[];
  projects?: Project[];
  leadership?: Leadership[];
  contactInfo?: ContactInfo;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface FormState {
  isSubmitting: boolean;
  isValid: boolean;
  isDirty: boolean;
  errors: Record<string, string>;
  touched: Record<string, boolean>;
}

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  status: 'success' | 'error' | 'loading';
  timestamp: number;
  fromCache?: boolean;
}

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  footer?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showCloseButton?: boolean;
  children: React.ReactNode;
}
