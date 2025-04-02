/**
 * Application types
 */

// User types
export interface User {
  uid: string;
  email: string;
  displayName: string | null;
  photoURL: string | null;
  createdAt: Date | string;
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
  id?: string;
  title: string;
  description: string;
  image?: string;
  tags?: string[];
  link?: string;
  startDate: string;
  endDate?: string;
  featured?: boolean;
}

export interface LeadershipRole {
  id?: string;
  title: string;
  organization: string;
  description: string;
  startDate: string;
  endDate?: string;
  image?: string;
}

export interface Skill {
  id?: string;
  name: string;
  proficiency: number; // 1-5
  categoryId: string;
  featured?: boolean;
}

export interface AuthState {
  currentUser: User | null;
  loading: boolean;
  error: string | null;
}

export interface PersonalInfo {
  fullName: string;
  title: string;
  bio: string;
  school: string;
  location: string;
  graduationYear?: string;
  major?: string;
  minor?: string;
  gpa?: number;
  image?: string;
}

export interface SkillCategory {
  id?: string;
  name: string;
  description?: string;
  order: number;
  skills?: Skill[];
}

export interface Leadership {
  id?: string;
  roles: LeadershipRole[];
}

export interface ContactInfo {
  email: string;
  phone?: string;
  linkedin?: string;
  github?: string;
  website?: string;
  twitter?: string;
  instagram?: string;
  allowMessages: boolean;
}

export interface Portfolio {
  uid: string;
  personalInfo: PersonalInfo;
  projects?: Project[];
  leadership?: Leadership;
  skillCategories?: SkillCategory[];
  contactInfo?: ContactInfo;
  isPublished: boolean;
  createdAt: Date | string;
  updatedAt: Date | string;
}

// Form types
export interface FormState {
  isSubmitting: boolean;
  isSuccess: boolean;
  error: string | null;
}

// API types
export interface ApiResponse<T> {
  data?: T;
  error?: string;
  status: 'success' | 'error' | 'loading';
}

// UI types
export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  footer?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  children: React.ReactNode;
}
