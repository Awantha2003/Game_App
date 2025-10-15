export interface GameSession {
  id: string;
  studentId?: string; // Optional for anonymous play
  levelId: string;
  levelTitle: string;
  grade: number;
  subject: string;
  questions: GameQuestion[];
  answers: GameAnswer[];
  score: number;
  totalQuestions: number;
  stars: number;
  completedAt: string;
  duration: number; // in seconds
  isOffline: boolean;
}

export interface GameQuestion {
  id: string;
  prompt: string;
  options: string[];
  correctAnswer: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
}

export interface GameAnswer {
  questionId: string;
  selectedAnswer: number;
  isCorrect: boolean;
  timeSpent: number; // in seconds
}

export interface GameResult {
  id: string;
  sessionId: string;
  studentId?: string;
  studentName?: string;
  levelId: string;
  levelTitle: string;
  grade: number;
  subject: string;
  score: number;
  totalQuestions: number;
  stars: number;
  completedAt: string;
  duration: number;
  isOffline: boolean;
}

export interface StudentProgress {
  studentId?: string;
  totalGamesPlayed: number;
  totalStars: number;
  averageScore: number;
  favoriteSubject: string;
  recentGames: GameResult[];
  achievements: Achievement[];
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  earnedAt: string;
  category: 'score' | 'streak' | 'subject' | 'special';
}

export interface ProgressFilter {
  grade?: number;
  subject?: string;
  dateFrom?: string;
  dateTo?: string;
  studentName?: string;
}

export interface ProgressStats {
  totalStudents: number;
  totalGames: number;
  averageScore: number;
  topPerformers: GameResult[];
  subjectBreakdown: Record<string, number>;
  gradeBreakdown: Record<number, number>;
}
