export interface Question {
  id: string;
  prompt: string;
  options: string[];
  correctAnswer: number; // Index of correct option (0-based)
  grade: number; // 1-5
  subject: 'Math' | 'Spelling' | 'General Knowledge';
  difficulty: 'Easy' | 'Medium' | 'Hard';
  createdAt: string;
  updatedAt: string;
  createdBy: string; // User ID who created the question
  isActive: boolean;
}

export interface QuestionFormData {
  prompt: string;
  options: string[];
  correctAnswer: number;
  grade: number;
  subject: 'Math' | 'Spelling' | 'General Knowledge';
  difficulty: 'Easy' | 'Medium' | 'Hard';
}

export interface QuestionFilters {
  grade?: number;
  subject?: string;
  difficulty?: string;
  search?: string;
}

export interface BulkImportData {
  questions: QuestionFormData[];
  format: 'json' | 'csv';
}

export interface QuestionStats {
  total: number;
  byGrade: Record<number, number>;
  bySubject: Record<string, number>;
  byDifficulty: Record<string, number>;
}
