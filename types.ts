
export type UserRole = 'teacher' | 'student' | 'parent';

export interface CareerSuggestion {
  title: string;
  matchPercentage: number;
  description: string;
  requiredSkills: string[];
}

export interface SkillGap {
  skill: string;
  type: 'core' | 'developmental';
  score: number;
}

export interface AcademicMatch {
  course: string;
  score: number;
  relevance: 'Yüksek' | 'Orta' | 'Düşük';
  impactAnalysis: string;
}

export interface UniversitySuggestion {
  university: string;
  department: string;
  matchScore: number;
  city: string;
  type: 'Devlet' | 'Vakıf';
}

export interface WeeklyPlan {
  week: number;
  title: string;
  tasks: string[];
  status: 'completed' | 'current' | 'locked';
}

export interface CareerReport {
  generatedAt: Date;
  personalityAnalysis: string;
  interestAnalysis: string;
  careers: CareerSuggestion[];
  skills: SkillGap[];
  academicMatches: AcademicMatch[];
  universities: UniversitySuggestion[];
  weeklyPlan: WeeklyPlan[];
  riasecScores?: { [key: string]: number }; // R, I, A, S, E, C scores
}

export interface User {
  id: string;
  username: string;
  password?: string;
  name: string;
  role: UserRole;
  isAssessmentComplete?: boolean;
  
  // İlişkisel Veriler
  teacherUsername?: string;
  parentName?: string;
  parentContact?: string;
  linkedStudentUsername?: string;
  
  // Generated Report
  report?: CareerReport;
}

export interface StudentProfile {
  name: string;
  grade: string;
  personalityScores: {
    subject: string;
    A: number;
    fullMark: number;
  }[];
  academicFocus: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

export enum PageView {
  LANDING = 'LANDING',
  LOGIN = 'LOGIN',
  TEACHER_DASHBOARD = 'TEACHER_DASHBOARD',
  ASSESSMENT = 'ASSESSMENT',
  STUDENT_DASHBOARD = 'STUDENT_DASHBOARD',
}
