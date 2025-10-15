import { Level, LevelFormData, LevelFilters, LevelStats, QuestionOption } from '../types/level';
import { QuestionService } from './questionService';

// Mock API base URL - replace with your actual backend URL
const API_BASE_URL = 'http://localhost:3000/api';

export class LevelService {
  // Mock data for development
  private static mockLevels: Level[] = [
    {
      id: '1',
      title: 'Grade 3 Addition Basics',
      description: 'Basic addition problems for Grade 3 students',
      grade: 3,
      subject: 'Math',
      difficulty: 'Easy',
      passScore: 7,
      totalQuestions: 10,
      questionIds: ['1', '2', '3'],
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: 'teacher-1',
    },
    {
      id: '2',
      title: 'Grade 2 Spelling Challenge',
      description: 'Common words spelling for Grade 2',
      grade: 2,
      subject: 'Spelling',
      difficulty: 'Medium',
      passScore: 8,
      totalQuestions: 12,
      questionIds: ['2', '4', '5'],
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: 'teacher-1',
    },
    {
      id: '3',
      title: 'Grade 4 World Geography',
      description: 'Countries and capitals around the world',
      grade: 4,
      subject: 'General Knowledge',
      difficulty: 'Hard',
      passScore: 6,
      totalQuestions: 15,
      questionIds: ['3', '6', '7'],
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: 'teacher-1',
    },
  ];

  static async getAllLevels(filters?: LevelFilters): Promise<Level[]> {
    try {
      // For now, we'll use mock data. Replace with actual API call
      let levels = [...this.mockLevels];

      // Apply filters
      if (filters) {
        if (filters.grade) {
          levels = levels.filter(l => l.grade === filters.grade);
        }
        if (filters.subject) {
          levels = levels.filter(l => l.subject === filters.subject);
        }
        if (filters.difficulty) {
          levels = levels.filter(l => l.difficulty === filters.difficulty);
        }
        if (filters.search) {
          const searchTerm = filters.search.toLowerCase();
          levels = levels.filter(l => 
            l.title.toLowerCase().includes(searchTerm) ||
            l.description.toLowerCase().includes(searchTerm)
          );
        }
      }

      return levels;

      // Uncomment below for real API integration:
      /*
      const token = await SecureStorageService.getToken();
      if (!token) {
        throw new Error('No authentication token found');
      }

      const queryParams = new URLSearchParams();
      if (filters?.grade) queryParams.append('grade', filters.grade.toString());
      if (filters?.subject) queryParams.append('subject', filters.subject);
      if (filters?.difficulty) queryParams.append('difficulty', filters.difficulty);
      if (filters?.search) queryParams.append('search', filters.search);

      const response = await fetch(`${API_BASE_URL}/levels?${queryParams}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch levels');
      }

      return await response.json();
      */
    } catch (error) {
      console.error('Error fetching levels:', error);
      throw error;
    }
  }

  static async getLevelById(id: string): Promise<Level | null> {
    try {
      // For now, we'll use mock data. Replace with actual API call
      const level = this.mockLevels.find(l => l.id === id);
      return level || null;

      // Uncomment below for real API integration:
      /*
      const token = await SecureStorageService.getToken();
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`${API_BASE_URL}/levels/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch level');
      }

      return await response.json();
      */
    } catch (error) {
      console.error('Error fetching level:', error);
      throw error;
    }
  }

  static async createLevel(levelData: LevelFormData): Promise<Level> {
    try {
      // For now, we'll use mock data. Replace with actual API call
      const newLevel: Level = {
        id: Date.now().toString(),
        ...levelData,
        totalQuestions: levelData.questionIds.length,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        createdBy: 'current-user', // Replace with actual user ID
        isActive: true,
      };

      this.mockLevels.push(newLevel);
      return newLevel;

      // Uncomment below for real API integration:
      /*
      const token = await SecureStorageService.getToken();
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`${API_BASE_URL}/levels`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(levelData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create level');
      }

      return await response.json();
      */
    } catch (error) {
      console.error('Error creating level:', error);
      throw error;
    }
  }

  static async updateLevel(id: string, levelData: Partial<LevelFormData>): Promise<Level> {
    try {
      // For now, we'll use mock data. Replace with actual API call
      const levelIndex = this.mockLevels.findIndex(l => l.id === id);
      if (levelIndex === -1) {
        throw new Error('Level not found');
      }

      this.mockLevels[levelIndex] = {
        ...this.mockLevels[levelIndex],
        ...levelData,
        totalQuestions: levelData.questionIds ? levelData.questionIds.length : this.mockLevels[levelIndex].totalQuestions,
        updatedAt: new Date().toISOString(),
      };

      return this.mockLevels[levelIndex];

      // Uncomment below for real API integration:
      /*
      const token = await SecureStorageService.getToken();
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`${API_BASE_URL}/levels/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(levelData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update level');
      }

      return await response.json();
      */
    } catch (error) {
      console.error('Error updating level:', error);
      throw error;
    }
  }

  static async deleteLevel(id: string): Promise<void> {
    try {
      // For now, we'll use mock data. Replace with actual API call
      const levelIndex = this.mockLevels.findIndex(l => l.id === id);
      if (levelIndex === -1) {
        throw new Error('Level not found');
      }

      this.mockLevels.splice(levelIndex, 1);

      // Uncomment below for real API integration:
      /*
      const token = await SecureStorageService.getToken();
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`${API_BASE_URL}/levels/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete level');
      }
      */
    } catch (error) {
      console.error('Error deleting level:', error);
      throw error;
    }
  }

  static async getLevelStats(): Promise<LevelStats> {
    try {
      // For now, we'll use mock data. Replace with actual API call
      const levels = this.mockLevels.filter(l => l.isActive);
      
      const stats: LevelStats = {
        total: levels.length,
        byGrade: {},
        bySubject: {},
        byDifficulty: {},
        averagePassScore: 0,
      };

      let totalPassScore = 0;
      levels.forEach(level => {
        // Count by grade
        stats.byGrade[level.grade] = (stats.byGrade[level.grade] || 0) + 1;
        
        // Count by subject
        stats.bySubject[level.subject] = (stats.bySubject[level.subject] || 0) + 1;
        
        // Count by difficulty
        stats.byDifficulty[level.difficulty] = (stats.byDifficulty[level.difficulty] || 0) + 1;
        
        // Calculate average pass score
        totalPassScore += level.passScore;
      });

      stats.averagePassScore = levels.length > 0 ? totalPassScore / levels.length : 0;

      return stats;

      // Uncomment below for real API integration:
      /*
      const token = await SecureStorageService.getToken();
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`${API_BASE_URL}/levels/stats`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch level stats');
      }

      return await response.json();
      */
    } catch (error) {
      console.error('Error fetching level stats:', error);
      throw error;
    }
  }

  static async getAvailableQuestions(grade?: number, subject?: string): Promise<QuestionOption[]> {
    try {
      // Get questions from QuestionService
      const questions = await QuestionService.getAllQuestions({
        grade,
        subject,
      });

      return questions.map(q => ({
        id: q.id,
        prompt: q.prompt,
        subject: q.subject,
        difficulty: q.difficulty,
        grade: q.grade,
      }));

      // Uncomment below for real API integration:
      /*
      const token = await SecureStorageService.getToken();
      if (!token) {
        throw new Error('No authentication token found');
      }

      const queryParams = new URLSearchParams();
      if (grade) queryParams.append('grade', grade.toString());
      if (subject) queryParams.append('subject', subject);

      const response = await fetch(`${API_BASE_URL}/questions/available?${queryParams}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch available questions');
      }

      return await response.json();
      */
    } catch (error) {
      console.error('Error fetching available questions:', error);
      throw error;
    }
  }
}
