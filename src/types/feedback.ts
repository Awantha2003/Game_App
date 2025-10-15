export interface Feedback {
  id: string;
  userId?: string;
  userName?: string;
  type: 'bug' | 'suggestion' | 'question_issue' | 'general';
  category: 'incorrect_answer' | 'spelling_mistake' | 'technical_issue' | 'content_issue' | 'other';
  title: string;
  description: string;
  gameId?: string;
  questionId?: string;
  levelId?: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  attachments?: string[];
  adminComments?: string;
  submittedAt: string;
  updatedAt: string;
  resolvedAt?: string;
  resolvedBy?: string;
}

export interface FeedbackFormData {
  type: 'bug' | 'suggestion' | 'question_issue' | 'general';
  category: 'incorrect_answer' | 'spelling_mistake' | 'technical_issue' | 'content_issue' | 'other';
  title: string;
  description: string;
  gameId?: string;
  questionId?: string;
  levelId?: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
}

export interface FeedbackFilter {
  type?: string;
  category?: string;
  priority?: string;
  status?: string;
  dateFrom?: string;
  dateTo?: string;
  searchText?: string;
}

export interface FeedbackStats {
  totalFeedback: number;
  openIssues: number;
  resolvedIssues: number;
  criticalIssues: number;
  typeBreakdown: Record<string, number>;
  categoryBreakdown: Record<string, number>;
  priorityBreakdown: Record<string, number>;
}
