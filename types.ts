
export type UserRole = 'teacher' | 'student' | 'parent';

export type AssessmentStage = 'holland' | 'transition_to_mi' | 'mi' | 'transition_to_academic' | 'academic';

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

export interface StudentProfile {
  name: string;
  grade: string;
  academicFocus: string;
  personalityScores: { subject: string; A: number; fullMark: number }[];
}

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
  riasecScores?: { [key: string]: number };
  miScores?: { [key: string]: number };
}

export interface SupplementalData {
  gpa?: number; 
  previousGpa?: number; // Dönemsel performans karşılaştırması için
  focusArea?: string; 
  
  subjectGrades: {
    math: number;
    science: number;
    turkish: number;
    social: number;
    language: number;
  };

  hobbies: string;
  futureGoals: string;

  technicalSkills: {
    coding: number;
    problemSolving: number;
    teamwork: number;
    presentation: number;
  }
}

export interface User {
  id: string;
  username: string;
  password?: string;
  name: string;
  role: UserRole;
  isAssessmentComplete?: boolean;
  teacherUsername?: string;
  parentName?: string;
  parentContact?: string;
  linkedStudentUsername?: string;
  report?: CareerReport;
}

export enum PageView {
  LANDING = 'LANDING',
  LOGIN = 'LOGIN',
  TEACHER_DASHBOARD = 'TEACHER_DASHBOARD',
  ASSESSMENT = 'ASSESSMENT',
  STUDENT_DASHBOARD = 'STUDENT_DASHBOARD',
}
