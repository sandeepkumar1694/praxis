export interface DailyTask {
  id: string;
  level: 'basic' | 'intermediate' | 'pro';
  title: string;
  description: string;
  time_limit_minutes: number;
  expected_output_format?: any;
  test_cases?: any[];
  company_context?: string;
  generated_by_ai?: boolean;
  createdAt: string;
  expiresAt: string;
}

export interface UserSubmission {
  id: string;
  user_id: string;
  task_id: string;
  chosen_at: string;
  submitted_at?: string;
  submission_code?: string;
  status: 'chosen' | 'in_progress' | 'submitted' | 'scoring' | 'scored' | 'expired' | 'error';
  score?: number;
  ai_feedback?: {
    overall: string;
    codeQuality: number;
    efficiency: number;
    readability: number;
    correctness: number;
    overallScore: number;
    suggestions: string[];
    strengths: string[];
    improvements: string[];
  };
  created_at: string;
  updated_at: string;
}

export interface TaskApiResponse {
  tasks: DailyTask[];
  userSubmission?: UserSubmission | null;
}

export interface TaskResultResponse {
  submission: UserSubmission;
  task: DailyTask;
}