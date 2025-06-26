export interface DailyTask {
  id: string;
  level: 'basic' | 'intermediate' | 'pro';
  title: string;
  description: string;
  timeLimit: number; // in minutes
  createdAt: string;
  expiresAt: string;
}

export interface UserSubmission {
  id: string;
  userId: string;
  taskId: string;
  chosenAt: string;
  submittedAt?: string;
  submissionCode?: string;
  status: 'chosen' | 'in_progress' | 'submitted' | 'scored' | 'expired';
  score?: number;
  aiFeedback?: {
    overall: string;
    codeQuality: number;
    efficiency: number;
    readability: number;
    correctness: number;
    suggestions: string[];
    strengths: string[];
    improvements: string[];
  };
  createdAt: string;
  updatedAt: string;
}

export interface TaskApiResponse {
  tasks: DailyTask[];
  userSubmission?: UserSubmission;
}