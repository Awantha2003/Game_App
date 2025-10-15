import { Feedback, FeedbackFormData, FeedbackFilter, FeedbackStats } from '../types/feedback';
import { AuthServiceEnhanced } from './authServiceEnhanced';

// Mock API base URL - replace with your actual backend URL
const API_BASE_URL = 'http://localhost:3000/api';

export class FeedbackService {
  // Mock data for development
  private static mockFeedback: Feedback[] = [
    {
      id: '1',
      userId: '2',
      userName: 'Teacher User',
      type: 'bug',
      category: 'incorrect_answer',
      title: 'Wrong answer in Math question',
      description: 'The correct answer for question 5 is marked as B but it should be C.',
      gameId: '1',
      questionId: '5',
      levelId: '1',
      priority: 'high',
      status: 'open',
      submittedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: '2',
      userId: '2',
      userName: 'Teacher User',
      type: 'suggestion',
      category: 'content_issue',
      title: 'Add more spelling questions',
      description: 'Grade 3 spelling section needs more challenging words.',
      levelId: '2',
      priority: 'medium',
      status: 'in_progress',
      adminComments: 'Working on adding more content.',
      submittedAt: new Date(Date.now() - 86400000).toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: '3',
      userId: '2',
      userName: 'Teacher User',
      type: 'question_issue',
      category: 'spelling_mistake',
      title: 'Typo in question text',
      description: 'There is a spelling error in the question prompt.',
      questionId: '12',
      priority: 'low',
      status: 'resolved',
      adminComments: 'Fixed the typo.',
      submittedAt: new Date(Date.now() - 172800000).toISOString(),
      updatedAt: new Date().toISOString(),
      resolvedAt: new Date(Date.now() - 86400000).toISOString(),
      resolvedBy: 'admin@edugame.com',
    },
  ];

  static async submitFeedback(feedbackData: FeedbackFormData): Promise<Feedback> {
    try {
      const currentUser = await AuthServiceEnhanced.getCurrentUser();
      
      const feedback: Feedback = {
        id: Date.now().toString(),
        userId: currentUser?.id,
        userName: currentUser?.name,
        ...feedbackData,
        status: 'open',
        submittedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // Store feedback locally
      this.mockFeedback.unshift(feedback);

      return feedback;

      // Uncomment below for real API integration:
      /*
      const accessToken = await AuthServiceEnhanced.getAccessToken();
      if (!accessToken) {
        throw new Error('No access token available');
      }

      const response = await fetch(`${API_BASE_URL}/feedback`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify(feedbackData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to submit feedback');
      }

      return await response.json();
      */
    } catch (error) {
      console.error('Submit feedback error:', error);
      throw error;
    }
  }

  static async getFeedback(filters?: FeedbackFilter): Promise<Feedback[]> {
    try {
      // For now, we'll use mock data. Replace with actual API call
      let feedback = [...this.mockFeedback];

      if (filters) {
        if (filters.type) {
          feedback = feedback.filter(f => f.type === filters.type);
        }
        if (filters.category) {
          feedback = feedback.filter(f => f.category === filters.category);
        }
        if (filters.priority) {
          feedback = feedback.filter(f => f.priority === filters.priority);
        }
        if (filters.status) {
          feedback = feedback.filter(f => f.status === filters.status);
        }
        if (filters.searchText) {
          const searchLower = filters.searchText.toLowerCase();
          feedback = feedback.filter(f => 
            f.title.toLowerCase().includes(searchLower) ||
            f.description.toLowerCase().includes(searchLower) ||
            f.userName?.toLowerCase().includes(searchLower)
          );
        }
        if (filters.dateFrom) {
          feedback = feedback.filter(f => new Date(f.submittedAt) >= new Date(filters.dateFrom!));
        }
        if (filters.dateTo) {
          feedback = feedback.filter(f => new Date(f.submittedAt) <= new Date(filters.dateTo!));
        }
      }

      return feedback;

      // Uncomment below for real API integration:
      /*
      const accessToken = await AuthServiceEnhanced.getAccessToken();
      if (!accessToken) {
        throw new Error('No access token available');
      }

      const queryParams = new URLSearchParams();
      if (filters?.type) queryParams.append('type', filters.type);
      if (filters?.category) queryParams.append('category', filters.category);
      if (filters?.priority) queryParams.append('priority', filters.priority);
      if (filters?.status) queryParams.append('status', filters.status);
      if (filters?.searchText) queryParams.append('searchText', filters.searchText);
      if (filters?.dateFrom) queryParams.append('dateFrom', filters.dateFrom);
      if (filters?.dateTo) queryParams.append('dateTo', filters.dateTo);

      const response = await fetch(`${API_BASE_URL}/feedback?${queryParams}`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch feedback');
      }

      return await response.json();
      */
    } catch (error) {
      console.error('Get feedback error:', error);
      throw error;
    }
  }

  static async updateFeedbackStatus(feedbackId: string, status: Feedback['status'], adminComments?: string): Promise<Feedback> {
    try {
      // Mock status update - replace with real API call
      const feedback = this.mockFeedback.find(f => f.id === feedbackId);
      if (!feedback) {
        throw new Error('Feedback not found');
      }

      feedback.status = status;
      feedback.updatedAt = new Date().toISOString();
      if (adminComments) {
        feedback.adminComments = adminComments;
      }
      if (status === 'resolved') {
        feedback.resolvedAt = new Date().toISOString();
        feedback.resolvedBy = 'admin@edugame.com';
      }

      return feedback;

      // Uncomment below for real API integration:
      /*
      const accessToken = await AuthServiceEnhanced.getAccessToken();
      if (!accessToken) {
        throw new Error('No access token available');
      }

      const response = await fetch(`${API_BASE_URL}/feedback/${feedbackId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ status, adminComments }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to update feedback');
      }

      return await response.json();
      */
    } catch (error) {
      console.error('Update feedback error:', error);
      throw error;
    }
  }

  static async deleteFeedback(feedbackId: string): Promise<void> {
    try {
      // Mock deletion - replace with real API call
      const index = this.mockFeedback.findIndex(f => f.id === feedbackId);
      if (index !== -1) {
        this.mockFeedback.splice(index, 1);
      }

      // Uncomment below for real API integration:
      /*
      const accessToken = await AuthServiceEnhanced.getAccessToken();
      if (!accessToken) {
        throw new Error('No access token available');
      }

      const response = await fetch(`${API_BASE_URL}/feedback/${feedbackId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to delete feedback');
      }
      */
    } catch (error) {
      console.error('Delete feedback error:', error);
      throw error;
    }
  }

  static async getFeedbackStats(): Promise<FeedbackStats> {
    try {
      // Mock stats - replace with real API call
      const feedback = this.mockFeedback;
      const totalFeedback = feedback.length;
      const openIssues = feedback.filter(f => f.status === 'open').length;
      const resolvedIssues = feedback.filter(f => f.status === 'resolved').length;
      const criticalIssues = feedback.filter(f => f.priority === 'critical').length;

      const typeBreakdown: Record<string, number> = {};
      const categoryBreakdown: Record<string, number> = {};
      const priorityBreakdown: Record<string, number> = {};

      feedback.forEach(f => {
        typeBreakdown[f.type] = (typeBreakdown[f.type] || 0) + 1;
        categoryBreakdown[f.category] = (categoryBreakdown[f.category] || 0) + 1;
        priorityBreakdown[f.priority] = (priorityBreakdown[f.priority] || 0) + 1;
      });

      return {
        totalFeedback,
        openIssues,
        resolvedIssues,
        criticalIssues,
        typeBreakdown,
        categoryBreakdown,
        priorityBreakdown,
      };

      // Uncomment below for real API integration:
      /*
      const accessToken = await AuthServiceEnhanced.getAccessToken();
      if (!accessToken) {
        throw new Error('No access token available');
      }

      const response = await fetch(`${API_BASE_URL}/feedback/stats`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch feedback stats');
      }

      return await response.json();
      */
    } catch (error) {
      console.error('Get feedback stats error:', error);
      throw error;
    }
  }
}
