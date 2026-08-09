
// Only vigesimal format now
export type GradeFormat = 'twenty';

export interface Subject {
  id: string;
  name: string;
  code?: string;
  professor?: string;
  color: string;
  credits?: number;
  gradeFormat: GradeFormat;
  targetGrade?: number;
  currentGrade?: number;
  assessments: Assessment[];
  semester?: string;
  year?: number;
  tags?: string[];
}

export type AssessmentType = 'exam' | 'quiz' | 'assignment' | 'project' | 'midterm' | 'final' | 'other';

export interface Assessment {
  id: string;
  subjectId: string;
  name: string;
  type: AssessmentType;
  weight: number; // percentage of final grade
  dueDate?: Date;
  grade?: number;
  maxGrade: number;
  completed: boolean;
  description?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'parent' | 'teacher';
  institution?: string;
  preferences: UserPreferences;
}

export interface UserPreferences {
  language: string;
  gradeFormat: GradeFormat;
  theme: string;
  darkMode: boolean;
  largeText: boolean;
  animations: boolean;
  notificationsEnabled: boolean;
  emailNotifications: boolean;
  autoBackup: boolean;
}

export interface GradeGoal {
  subjectId: string;
  targetGrade: number;
}

export interface Semester {
  id: string;
  name: string;
  startDate: Date;
  endDate: Date;
  year: number;
}
