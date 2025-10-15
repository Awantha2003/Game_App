export interface AnalyticsData {
  totalGames: number;
  totalStudents: number;
  averageScore: number;
  completionRate: number;
  timeSpent: number; // in minutes
  dateRange: {
    from: string;
    to: string;
  };
}

export interface PerformanceMetrics {
  grade: number;
  subject: string;
  averageScore: number;
  totalGames: number;
  completionRate: number;
  improvement: number; // percentage change
}

export interface LeaderboardEntry {
  rank: number;
  studentName: string;
  studentId?: string;
  score: number;
  totalGames: number;
  averageScore: number;
  stars: number;
  lastPlayed: string;
  grade: number;
  subject: string;
}

export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    color: string;
    backgroundColor?: string;
  }[];
}

export interface AnalyticsFilter {
  grade?: number;
  subject?: string;
  dateFrom?: string;
  dateTo?: string;
  timeRange?: 'week' | 'month' | 'quarter' | 'year' | 'all';
}

export interface SubjectBreakdown {
  subject: string;
  totalGames: number;
  averageScore: number;
  completionRate: number;
  improvement: number;
}

export interface GradeBreakdown {
  grade: number;
  totalStudents: number;
  totalGames: number;
  averageScore: number;
  topPerformer: string;
}

export interface TimeSeriesData {
  date: string;
  gamesPlayed: number;
  averageScore: number;
  completionRate: number;
}

export interface AnalyticsInsights {
  topPerformingSubject: string;
  mostImprovedGrade: number;
  peakActivityTime: string;
  engagementTrend: 'increasing' | 'decreasing' | 'stable';
  recommendations: string[];
}
