export interface Level {
  id: string;
  title: string;
  description: string;
  grade: number; // 1-5
  subject: 'Math' | 'Spelling' | 'General Knowledge';
  difficulty: 'Easy' | 'Medium' | 'Hard';
  passScore: number; // Minimum score to pass (e.g., 7 out of 10)
  totalQuestions: number;
  questionIds: string[]; // Array of question IDs
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy: string; // User ID who created the level
}

export interface LevelFormData {
  title: string;
  description: string;
  grade: number;
  subject: 'Math' | 'Spelling' | 'General Knowledge';
  difficulty: 'Easy' | 'Medium' | 'Hard';
  passScore: number;
  questionIds: string[];
}

export interface LevelFilters {
  grade?: number;
  subject?: string;
  difficulty?: string;
  search?: string;
}

export interface LevelStats {
  total: number;
  byGrade: Record<number, number>;
  bySubject: Record<string, number>;
  byDifficulty: Record<string, number>;
  averagePassScore: number;
}

export interface QuestionOption {
  id: string;
  prompt: string;
  subject: string;
  difficulty: string;
  grade: number;
}
