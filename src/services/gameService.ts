import { GameSession, GameQuestion, GameAnswer, GameResult, StudentProgress, ProgressFilter, ProgressStats } from '../types/game';
import { LevelService } from './levelService';
import { QuestionService } from './questionService';

// Mock API base URL - replace with your actual backend URL
const API_BASE_URL = 'http://localhost:3000/api';

export class GameService {
  // Mock data for development
  private static mockResults: GameResult[] = [
    {
      id: '1',
      sessionId: 'session-1',
      studentName: 'Anonymous Student',
      levelId: '1',
      levelTitle: 'Grade 3 Addition Basics',
      grade: 3,
      subject: 'Math',
      score: 8,
      totalQuestions: 10,
      stars: 4,
      completedAt: new Date().toISOString(),
      duration: 300,
      isOffline: false,
    },
    {
      id: '2',
      sessionId: 'session-2',
      studentName: 'Anonymous Student',
      levelId: '2',
      levelTitle: 'Grade 2 Spelling Challenge',
      grade: 2,
      subject: 'Spelling',
      score: 6,
      totalQuestions: 12,
      stars: 3,
      completedAt: new Date(Date.now() - 86400000).toISOString(),
      duration: 450,
      isOffline: false,
    },
  ];

  static async startGameSession(levelId: string): Promise<GameSession> {
    try {
      // Get level details
      const level = await LevelService.getLevelById(levelId);
      if (!level) {
        throw new Error('Level not found');
      }

      // Get questions for the level
      const questions = await QuestionService.getAllQuestions({
        grade: level.grade,
        subject: level.subject,
      });

      // Filter questions by level's question IDs
      const levelQuestions = questions.filter(q => level.questionIds.includes(q.id));

      // Select random 10 questions (or all if less than 10)
      const selectedQuestions = this.shuffleArray(levelQuestions).slice(0, Math.min(10, levelQuestions.length));

      const gameQuestions: GameQuestion[] = selectedQuestions.map(q => ({
        id: q.id,
        prompt: q.prompt,
        options: q.options,
        correctAnswer: q.correctAnswer,
        difficulty: q.difficulty,
      }));

      const session: GameSession = {
        id: Date.now().toString(),
        levelId: level.id,
        levelTitle: level.title,
        grade: level.grade,
        subject: level.subject,
        questions: gameQuestions,
        answers: [],
        score: 0,
        totalQuestions: gameQuestions.length,
        stars: 0,
        completedAt: '',
        duration: 0,
        isOffline: false,
      };

      return session;

      // Uncomment below for real API integration:
      /*
      const token = await SecureStorageService.getToken();
      const response = await fetch(`${API_BASE_URL}/games/start`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ levelId }),
      });

      if (!response.ok) {
        throw new Error('Failed to start game session');
      }

      return await response.json();
      */
    } catch (error) {
      console.error('Error starting game session:', error);
      throw error;
    }
  }

  static async submitAnswer(sessionId: string, questionId: string, selectedAnswer: number, timeSpent: number): Promise<{ isCorrect: boolean; correctAnswer: number }> {
    try {
      // For now, we'll use mock logic. Replace with actual API call
      const questions = await QuestionService.getAllQuestions();
      const question = questions.find(q => q.id === questionId);
      
      if (!question) {
        throw new Error('Question not found');
      }

      const isCorrect = selectedAnswer === question.correctAnswer;

      return {
        isCorrect,
        correctAnswer: question.correctAnswer,
      };

      // Uncomment below for real API integration:
      /*
      const token = await SecureStorageService.getToken();
      const response = await fetch(`${API_BASE_URL}/games/answer`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          sessionId,
          questionId,
          selectedAnswer,
          timeSpent,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit answer');
      }

      return await response.json();
      */
    } catch (error) {
      console.error('Error submitting answer:', error);
      throw error;
    }
  }

  static async completeGameSession(session: GameSession): Promise<GameResult> {
    try {
      const correctAnswers = session.answers.filter(a => a.isCorrect).length;
      const score = correctAnswers;
      const stars = this.calculateStars(score, session.totalQuestions);
      const duration = Math.floor((Date.now() - parseInt(session.id)) / 1000);

      const result: GameResult = {
        id: Date.now().toString(),
        sessionId: session.id,
        studentName: 'Anonymous Student',
        levelId: session.levelId,
        levelTitle: session.levelTitle,
        grade: session.grade,
        subject: session.subject,
        score,
        totalQuestions: session.totalQuestions,
        stars,
        completedAt: new Date().toISOString(),
        duration,
        isOffline: false,
      };

      // Store result locally
      this.mockResults.unshift(result);

      return result;

      // Uncomment below for real API integration:
      /*
      const token = await SecureStorageService.getToken();
      const response = await fetch(`${API_BASE_URL}/games/complete`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(session),
      });

      if (!response.ok) {
        throw new Error('Failed to complete game session');
      }

      return await response.json();
      */
    } catch (error) {
      console.error('Error completing game session:', error);
      throw error;
    }
  }

  static async getStudentProgress(studentId?: string): Promise<StudentProgress> {
    try {
      // For now, we'll use mock data. Replace with actual API call
      const results = this.mockResults;
      const totalGamesPlayed = results.length;
      const totalStars = results.reduce((sum, r) => sum + r.stars, 0);
      const averageScore = results.length > 0 ? results.reduce((sum, r) => sum + r.score, 0) / results.length : 0;
      
      const subjectCounts: Record<string, number> = {};
      results.forEach(r => {
        subjectCounts[r.subject] = (subjectCounts[r.subject] || 0) + 1;
      });
      const favoriteSubject = Object.keys(subjectCounts).reduce((a, b) => 
        subjectCounts[a] > subjectCounts[b] ? a : b, 'Math'
      );

      const progress: StudentProgress = {
        studentId,
        totalGamesPlayed,
        totalStars,
        averageScore: Math.round(averageScore * 10) / 10,
        favoriteSubject,
        recentGames: results.slice(0, 5),
        achievements: this.generateAchievements(totalStars, totalGamesPlayed),
      };

      return progress;

      // Uncomment below for real API integration:
      /*
      const token = await SecureStorageService.getToken();
      const response = await fetch(`${API_BASE_URL}/games/progress${studentId ? `?studentId=${studentId}` : ''}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch student progress');
      }

      return await response.json();
      */
    } catch (error) {
      console.error('Error fetching student progress:', error);
      throw error;
    }
  }

  static async getResults(filters?: ProgressFilter): Promise<GameResult[]> {
    try {
      // For now, we'll use mock data. Replace with actual API call
      let results = [...this.mockResults];

      if (filters) {
        if (filters.grade) {
          results = results.filter(r => r.grade === filters.grade);
        }
        if (filters.subject) {
          results = results.filter(r => r.subject === filters.subject);
        }
        if (filters.studentName) {
          results = results.filter(r => 
            r.studentName?.toLowerCase().includes(filters.studentName!.toLowerCase())
          );
        }
        if (filters.dateFrom) {
          results = results.filter(r => new Date(r.completedAt) >= new Date(filters.dateFrom!));
        }
        if (filters.dateTo) {
          results = results.filter(r => new Date(r.completedAt) <= new Date(filters.dateTo!));
        }
      }

      return results;

      // Uncomment below for real API integration:
      /*
      const token = await SecureStorageService.getToken();
      const queryParams = new URLSearchParams();
      if (filters?.grade) queryParams.append('grade', filters.grade.toString());
      if (filters?.subject) queryParams.append('subject', filters.subject);
      if (filters?.studentName) queryParams.append('studentName', filters.studentName);
      if (filters?.dateFrom) queryParams.append('dateFrom', filters.dateFrom);
      if (filters?.dateTo) queryParams.append('dateTo', filters.dateTo);

      const response = await fetch(`${API_BASE_URL}/games/results?${queryParams}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch results');
      }

      return await response.json();
      */
    } catch (error) {
      console.error('Error fetching results:', error);
      throw error;
    }
  }

  static async getProgressStats(): Promise<ProgressStats> {
    try {
      // For now, we'll use mock data. Replace with actual API call
      const results = this.mockResults;
      const totalStudents = new Set(results.map(r => r.studentId || 'anonymous')).size;
      const totalGames = results.length;
      const averageScore = results.length > 0 ? results.reduce((sum, r) => sum + r.score, 0) / results.length : 0;
      
      const topPerformers = results
        .sort((a, b) => b.score - a.score)
        .slice(0, 10);

      const subjectBreakdown: Record<string, number> = {};
      const gradeBreakdown: Record<number, number> = {};
      
      results.forEach(r => {
        subjectBreakdown[r.subject] = (subjectBreakdown[r.subject] || 0) + 1;
        gradeBreakdown[r.grade] = (gradeBreakdown[r.grade] || 0) + 1;
      });

      return {
        totalStudents,
        totalGames,
        averageScore: Math.round(averageScore * 10) / 10,
        topPerformers,
        subjectBreakdown,
        gradeBreakdown,
      };

      // Uncomment below for real API integration:
      /*
      const token = await SecureStorageService.getToken();
      const response = await fetch(`${API_BASE_URL}/games/stats`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch progress stats');
      }

      return await response.json();
      */
    } catch (error) {
      console.error('Error fetching progress stats:', error);
      throw error;
    }
  }

  private static shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  private static calculateStars(score: number, totalQuestions: number): number {
    const percentage = (score / totalQuestions) * 100;
    if (percentage >= 90) return 5;
    if (percentage >= 80) return 4;
    if (percentage >= 70) return 3;
    if (percentage >= 60) return 2;
    return 1;
  }

  private static generateAchievements(totalStars: number, totalGames: number): any[] {
    const achievements = [];
    
    if (totalStars >= 10) {
      achievements.push({
        id: '1',
        title: 'Star Collector',
        description: 'Earned 10 stars',
        icon: 'star',
        earnedAt: new Date().toISOString(),
        category: 'score',
      });
    }
    
    if (totalGames >= 5) {
      achievements.push({
        id: '2',
        title: 'Dedicated Learner',
        description: 'Played 5 games',
        icon: 'trophy',
        earnedAt: new Date().toISOString(),
        category: 'streak',
      });
    }

    return achievements;
  }
}
