import { Question, QuestionFormData, QuestionFilters, BulkImportData, QuestionStats } from '../types/question';
import { SecureStorageService } from './secureStorage';

// Mock API base URL - replace with your actual backend URL
const API_BASE_URL = 'http://localhost:3000/api';

export class QuestionService {
  // Mock data for development
  private static mockQuestions: Question[] = [
    {
      id: '1',
      prompt: 'What is 2 + 2?',
      options: ['3', '4', '5', '6'],
      correctAnswer: 1,
      grade: 1,
      subject: 'Math',
      difficulty: 'Easy',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: 'teacher-1',
      isActive: true,
    },
    {
      id: '2',
      prompt: 'Spell the word "CAT"',
      options: ['CAT', 'KAT', 'CUT', 'COT'],
      correctAnswer: 0,
      grade: 1,
      subject: 'Spelling',
      difficulty: 'Easy',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: 'teacher-1',
      isActive: true,
    },
    {
      id: '3',
      prompt: 'What is the capital of France?',
      options: ['London', 'Berlin', 'Paris', 'Madrid'],
      correctAnswer: 2,
      grade: 3,
      subject: 'General Knowledge',
      difficulty: 'Medium',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: 'teacher-1',
      isActive: true,
    },
  ];

  static async getAllQuestions(filters?: QuestionFilters): Promise<Question[]> {
    try {
      // For now, we'll use mock data. Replace with actual API call
      let questions = [...this.mockQuestions];

      // Apply filters
      if (filters) {
        if (filters.grade) {
          questions = questions.filter(q => q.grade === filters.grade);
        }
        if (filters.subject) {
          questions = questions.filter(q => q.subject === filters.subject);
        }
        if (filters.difficulty) {
          questions = questions.filter(q => q.difficulty === filters.difficulty);
        }
        if (filters.search) {
          const searchTerm = filters.search.toLowerCase();
          questions = questions.filter(q => 
            q.prompt.toLowerCase().includes(searchTerm) ||
            q.options.some(option => option.toLowerCase().includes(searchTerm))
          );
        }
      }

      return questions;

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

      const response = await fetch(`${API_BASE_URL}/questions?${queryParams}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch questions');
      }

      return await response.json();
      */
    } catch (error) {
      console.error('Error fetching questions:', error);
      throw error;
    }
  }

  static async getQuestionById(id: string): Promise<Question | null> {
    try {
      // For now, we'll use mock data. Replace with actual API call
      const question = this.mockQuestions.find(q => q.id === id);
      return question || null;

      // Uncomment below for real API integration:
      /*
      const token = await SecureStorageService.getToken();
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`${API_BASE_URL}/questions/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch question');
      }

      return await response.json();
      */
    } catch (error) {
      console.error('Error fetching question:', error);
      throw error;
    }
  }

  static async createQuestion(questionData: QuestionFormData): Promise<Question> {
    try {
      // For now, we'll use mock data. Replace with actual API call
      const newQuestion: Question = {
        id: Date.now().toString(),
        ...questionData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        createdBy: 'current-user', // Replace with actual user ID
        isActive: true,
      };

      this.mockQuestions.push(newQuestion);
      return newQuestion;

      // Uncomment below for real API integration:
      /*
      const token = await SecureStorageService.getToken();
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`${API_BASE_URL}/questions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(questionData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create question');
      }

      return await response.json();
      */
    } catch (error) {
      console.error('Error creating question:', error);
      throw error;
    }
  }

  static async updateQuestion(id: string, questionData: Partial<QuestionFormData>): Promise<Question> {
    try {
      // For now, we'll use mock data. Replace with actual API call
      const questionIndex = this.mockQuestions.findIndex(q => q.id === id);
      if (questionIndex === -1) {
        throw new Error('Question not found');
      }

      this.mockQuestions[questionIndex] = {
        ...this.mockQuestions[questionIndex],
        ...questionData,
        updatedAt: new Date().toISOString(),
      };

      return this.mockQuestions[questionIndex];

      // Uncomment below for real API integration:
      /*
      const token = await SecureStorageService.getToken();
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`${API_BASE_URL}/questions/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(questionData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update question');
      }

      return await response.json();
      */
    } catch (error) {
      console.error('Error updating question:', error);
      throw error;
    }
  }

  static async deleteQuestion(id: string): Promise<void> {
    try {
      // For now, we'll use mock data. Replace with actual API call
      const questionIndex = this.mockQuestions.findIndex(q => q.id === id);
      if (questionIndex === -1) {
        throw new Error('Question not found');
      }

      this.mockQuestions.splice(questionIndex, 1);

      // Uncomment below for real API integration:
      /*
      const token = await SecureStorageService.getToken();
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`${API_BASE_URL}/questions/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete question');
      }
      */
    } catch (error) {
      console.error('Error deleting question:', error);
      throw error;
    }
  }

  static async getQuestionStats(): Promise<QuestionStats> {
    try {
      // For now, we'll use mock data. Replace with actual API call
      const questions = this.mockQuestions.filter(q => q.isActive);
      
      const stats: QuestionStats = {
        total: questions.length,
        byGrade: {},
        bySubject: {},
        byDifficulty: {},
      };

      questions.forEach(question => {
        // Count by grade
        stats.byGrade[question.grade] = (stats.byGrade[question.grade] || 0) + 1;
        
        // Count by subject
        stats.bySubject[question.subject] = (stats.bySubject[question.subject] || 0) + 1;
        
        // Count by difficulty
        stats.byDifficulty[question.difficulty] = (stats.byDifficulty[question.difficulty] || 0) + 1;
      });

      return stats;

      // Uncomment below for real API integration:
      /*
      const token = await SecureStorageService.getToken();
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`${API_BASE_URL}/questions/stats`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch question stats');
      }

      return await response.json();
      */
    } catch (error) {
      console.error('Error fetching question stats:', error);
      throw error;
    }
  }

  static async bulkImportQuestions(importData: BulkImportData): Promise<{ success: number; failed: number; errors: string[] }> {
    try {
      // For now, we'll use mock data. Replace with actual API call
      let success = 0;
      let failed = 0;
      const errors: string[] = [];

      for (const questionData of importData.questions) {
        try {
          // Validate question data
          if (!questionData.prompt || questionData.options.length < 2) {
            throw new Error('Invalid question data');
          }

          const newQuestion: Question = {
            id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
            ...questionData,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            createdBy: 'current-user',
            isActive: true,
          };

          this.mockQuestions.push(newQuestion);
          success++;
        } catch (error) {
          failed++;
          errors.push(`Question ${success + failed}: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
      }

      return { success, failed, errors };

      // Uncomment below for real API integration:
      /*
      const token = await SecureStorageService.getToken();
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`${API_BASE_URL}/questions/bulk-import`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(importData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to import questions');
      }

      return await response.json();
      */
    } catch (error) {
      console.error('Error importing questions:', error);
      throw error;
    }
  }
}
