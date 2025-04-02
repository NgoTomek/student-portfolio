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
