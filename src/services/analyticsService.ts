import { 
  AnalyticsData, 
  PerformanceMetrics, 
  LeaderboardEntry, 
  ChartData, 
  AnalyticsFilter,
  SubjectBreakdown,
  GradeBreakdown,
  TimeSeriesData,
  AnalyticsInsights
} from '../types/analytics';
import { GameResult } from '../types/game';
import { GameService } from './gameService';

// Mock API base URL - replace with your actual backend URL
const API_BASE_URL = 'http://localhost:3000/api';

export class AnalyticsService {
  static async getAnalyticsData(filters?: AnalyticsFilter): Promise<AnalyticsData> {
    try {
      // Get all results for analysis
      const results = await GameService.getResults();
      
      // Apply filters
      let filteredResults = [...results];
      if (filters) {
        if (filters.grade) {
          filteredResults = filteredResults.filter(r => r.grade === filters.grade);
        }
        if (filters.subject) {
          filteredResults = filteredResults.filter(r => r.subject === filters.subject);
        }
        if (filters.dateFrom) {
          filteredResults = filteredResults.filter(r => new Date(r.completedAt) >= new Date(filters.dateFrom!));
        }
        if (filters.dateTo) {
          filteredResults = filteredResults.filter(r => new Date(r.completedAt) <= new Date(filters.dateTo!));
        }
      }

      const totalGames = filteredResults.length;
      const totalStudents = new Set(filteredResults.map(r => r.studentId || 'anonymous')).size;
      const averageScore = totalGames > 0 ? filteredResults.reduce((sum, r) => sum + r.score, 0) / totalGames : 0;
      const completionRate = totalGames > 0 ? (filteredResults.filter(r => r.score > 0).length / totalGames) * 100 : 0;
      const timeSpent = filteredResults.reduce((sum, r) => sum + r.duration, 0) / 60; // Convert to minutes

      return {
        totalGames,
        totalStudents,
        averageScore: Math.round(averageScore * 10) / 10,
        completionRate: Math.round(completionRate * 10) / 10,
        timeSpent: Math.round(timeSpent),
        dateRange: {
          from: filters?.dateFrom || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
          to: filters?.dateTo || new Date().toISOString(),
        },
      };

      // Uncomment below for real API integration:
      /*
      const accessToken = await AuthServiceEnhanced.getAccessToken();
      if (!accessToken) {
        throw new Error('No access token available');
      }

      const queryParams = new URLSearchParams();
      if (filters?.grade) queryParams.append('grade', filters.grade.toString());
      if (filters?.subject) queryParams.append('subject', filters.subject);
      if (filters?.dateFrom) queryParams.append('dateFrom', filters.dateFrom);
      if (filters?.dateTo) queryParams.append('dateTo', filters.dateTo);
      if (filters?.timeRange) queryParams.append('timeRange', filters.timeRange);

      const response = await fetch(`${API_BASE_URL}/analytics?${queryParams}`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch analytics data');
      }

      return await response.json();
      */
    } catch (error) {
      console.error('Get analytics data error:', error);
      throw error;
    }
  }

  static async getPerformanceMetrics(filters?: AnalyticsFilter): Promise<PerformanceMetrics[]> {
    try {
      const results = await GameService.getResults();
      let filteredResults = [...results];
      
      if (filters) {
        if (filters.grade) {
          filteredResults = filteredResults.filter(r => r.grade === filters.grade);
        }
        if (filters.subject) {
          filteredResults = filteredResults.filter(r => r.subject === filters.subject);
        }
      }

      // Group by grade and subject
      const groupedResults: Record<string, GameResult[]> = {};
      filteredResults.forEach(result => {
        const key = `${result.grade}-${result.subject}`;
        if (!groupedResults[key]) {
          groupedResults[key] = [];
        }
        groupedResults[key].push(result);
      });

      const metrics: PerformanceMetrics[] = [];
      Object.entries(groupedResults).forEach(([key, results]) => {
        const [grade, subject] = key.split('-');
        const totalGames = results.length;
        const averageScore = totalGames > 0 ? results.reduce((sum, r) => sum + r.score, 0) / totalGames : 0;
        const completionRate = totalGames > 0 ? (results.filter(r => r.score > 0).length / totalGames) * 100 : 0;
        
        // Calculate improvement (mock data for now)
        const improvement = Math.random() * 20 - 10; // -10% to +10%

        metrics.push({
          grade: parseInt(grade),
          subject,
          averageScore: Math.round(averageScore * 10) / 10,
          totalGames,
          completionRate: Math.round(completionRate * 10) / 10,
          improvement: Math.round(improvement * 10) / 10,
        });
      });

      return metrics.sort((a, b) => b.averageScore - a.averageScore);

      // Uncomment below for real API integration:
      /*
      const accessToken = await AuthServiceEnhanced.getAccessToken();
      if (!accessToken) {
        throw new Error('No access token available');
      }

      const response = await fetch(`${API_BASE_URL}/analytics/performance`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch performance metrics');
      }

      return await response.json();
      */
    } catch (error) {
      console.error('Get performance metrics error:', error);
      throw error;
    }
  }

  static async getLeaderboard(subject?: string, grade?: number, limit: number = 10): Promise<LeaderboardEntry[]> {
    try {
      const results = await GameService.getResults();
      let filteredResults = [...results];
      
      if (subject) {
        filteredResults = filteredResults.filter(r => r.subject === subject);
      }
      if (grade) {
        filteredResults = filteredResults.filter(r => r.grade === grade);
      }

      // Group by student
      const studentStats: Record<string, {
        studentName: string;
        studentId?: string;
        scores: number[];
        totalGames: number;
        stars: number;
        lastPlayed: string;
        grade: number;
        subject: string;
      }> = {};

      filteredResults.forEach(result => {
        const key = result.studentId || result.studentName || 'anonymous';
        if (!studentStats[key]) {
          studentStats[key] = {
            studentName: result.studentName || 'Anonymous Student',
            studentId: result.studentId,
            scores: [],
            totalGames: 0,
            stars: 0,
            lastPlayed: result.completedAt,
            grade: result.grade,
            subject: result.subject,
          };
        }
        studentStats[key].scores.push(result.score);
        studentStats[key].totalGames++;
        studentStats[key].stars += result.stars;
        if (new Date(result.completedAt) > new Date(studentStats[key].lastPlayed)) {
          studentStats[key].lastPlayed = result.completedAt;
        }
      });

      // Calculate leaderboard entries
      const leaderboard: LeaderboardEntry[] = Object.entries(studentStats)
        .map(([key, stats]) => ({
          rank: 0, // Will be set after sorting
          studentName: stats.studentName,
          studentId: stats.studentId,
          score: Math.max(...stats.scores),
          totalGames: stats.totalGames,
          averageScore: stats.scores.reduce((sum, score) => sum + score, 0) / stats.scores.length,
          stars: stats.stars,
          lastPlayed: stats.lastPlayed,
          grade: stats.grade,
          subject: stats.subject,
        }))
        .sort((a, b) => b.score - a.score)
        .slice(0, limit)
        .map((entry, index) => ({
          ...entry,
          rank: index + 1,
        }));

      return leaderboard;

      // Uncomment below for real API integration:
      /*
      const accessToken = await AuthServiceEnhanced.getAccessToken();
      if (!accessToken) {
        throw new Error('No access token available');
      }

      const queryParams = new URLSearchParams();
      if (subject) queryParams.append('subject', subject);
      if (grade) queryParams.append('grade', grade.toString());
      queryParams.append('limit', limit.toString());

      const response = await fetch(`${API_BASE_URL}/analytics/leaderboard?${queryParams}`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch leaderboard');
      }

      return await response.json();
      */
    } catch (error) {
      console.error('Get leaderboard error:', error);
      throw error;
    }
  }

  static async getChartData(type: 'score' | 'completion' | 'time', filters?: AnalyticsFilter): Promise<ChartData> {
    try {
      const results = await GameService.getResults();
      let filteredResults = [...results];
      
      if (filters) {
        if (filters.grade) {
          filteredResults = filteredResults.filter(r => r.grade === filters.grade);
        }
        if (filters.subject) {
          filteredResults = filteredResults.filter(r => r.subject === filters.subject);
        }
      }

      // Group by subject for chart data
      const subjectGroups: Record<string, GameResult[]> = {};
      filteredResults.forEach(result => {
        if (!subjectGroups[result.subject]) {
          subjectGroups[result.subject] = [];
        }
        subjectGroups[result.subject].push(result);
      });

      const labels = Object.keys(subjectGroups);
      const data = labels.map(subject => {
        const results = subjectGroups[subject];
        switch (type) {
          case 'score':
            return results.reduce((sum, r) => sum + r.score, 0) / results.length;
          case 'completion':
            return (results.filter(r => r.score > 0).length / results.length) * 100;
          case 'time':
            return results.reduce((sum, r) => sum + r.duration, 0) / results.length / 60; // minutes
          default:
            return 0;
        }
      });

      const colors = ['#667eea', '#764ba2', '#f093fb', '#f5576c', '#4facfe', '#00f2fe'];

      return {
        labels,
        datasets: [{
          label: type === 'score' ? 'Average Score' : 
                 type === 'completion' ? 'Completion Rate (%)' : 'Average Time (min)',
          data,
          color: colors[0],
          backgroundColor: colors[0] + '20',
        }],
      };

      // Uncomment below for real API integration:
      /*
      const accessToken = await AuthServiceEnhanced.getAccessToken();
      if (!accessToken) {
        throw new Error('No access token available');
      }

      const queryParams = new URLSearchParams();
      queryParams.append('type', type);
      if (filters?.grade) queryParams.append('grade', filters.grade.toString());
      if (filters?.subject) queryParams.append('subject', filters.subject);
      if (filters?.dateFrom) queryParams.append('dateFrom', filters.dateFrom);
      if (filters?.dateTo) queryParams.append('dateTo', filters.dateTo);

      const response = await fetch(`${API_BASE_URL}/analytics/charts?${queryParams}`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch chart data');
      }

      return await response.json();
      */
    } catch (error) {
      console.error('Get chart data error:', error);
      throw error;
    }
  }

  static async getAnalyticsInsights(): Promise<AnalyticsInsights> {
    try {
      const results = await GameService.getResults();
      
      // Calculate insights from results
      const subjectStats: Record<string, { total: number; avgScore: number }> = {};
      const gradeStats: Record<number, { total: number; avgScore: number }> = {};
      
      results.forEach(result => {
        if (!subjectStats[result.subject]) {
          subjectStats[result.subject] = { total: 0, avgScore: 0 };
        }
        subjectStats[result.subject].total++;
        subjectStats[result.subject].avgScore += result.score;
        
        if (!gradeStats[result.grade]) {
          gradeStats[result.grade] = { total: 0, avgScore: 0 };
        }
        gradeStats[result.grade].total++;
        gradeStats[result.grade].avgScore += result.score;
      });

      // Calculate averages
      Object.keys(subjectStats).forEach(subject => {
        subjectStats[subject].avgScore /= subjectStats[subject].total;
      });
      Object.keys(gradeStats).forEach(grade => {
        gradeStats[parseInt(grade)].avgScore /= gradeStats[parseInt(grade)].total;
      });

      const topPerformingSubject = Object.entries(subjectStats)
        .sort(([,a], [,b]) => b.avgScore - a.avgScore)[0]?.[0] || 'Math';
      
      const mostImprovedGrade = Object.entries(gradeStats)
        .sort(([,a], [,b]) => b.avgScore - a.avgScore)[0]?.[0] || 3;

      return {
        topPerformingSubject,
        mostImprovedGrade: parseInt(mostImprovedGrade),
        peakActivityTime: '2:00 PM - 4:00 PM',
        engagementTrend: 'increasing',
        recommendations: [
          'Focus on Math content as it shows highest engagement',
          'Consider adding more Grade 3 level content',
          'Peak activity time is 2-4 PM, schedule important content then',
        ],
      };

      // Uncomment below for real API integration:
      /*
      const accessToken = await AuthServiceEnhanced.getAccessToken();
      if (!accessToken) {
        throw new Error('No access token available');
      }

      const response = await fetch(`${API_BASE_URL}/analytics/insights`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch analytics insights');
      }

      return await response.json();
      */
    } catch (error) {
      console.error('Get analytics insights error:', error);
      throw error;
    }
  }
}
