import { supabase } from './supabase';
import { DailyTask, UserSubmission, TaskApiResponse, TaskResultResponse } from '../types/tasks';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;

class TaskAPI {
  private async getAuthHeaders() {
    const { data: { session } } = await supabase.auth.getSession();
    return {
      'Authorization': `Bearer ${session?.access_token}`,
      'Content-Type': 'application/json',
    };
  }

  async getDailyTasks(): Promise<TaskApiResponse> {
    try {
      const headers = await this.getAuthHeaders();
      const response = await fetch(`${SUPABASE_URL}/functions/v1/get-daily-tasks`, {
        method: 'GET',
        headers,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return {
        tasks: data.tasks || [],
        userSubmission: data.userSubmission || null,
      };
    } catch (error) {
      console.error('Error fetching daily tasks:', error);
      throw new Error('Failed to fetch daily tasks');
    }
  }

  async chooseTask(taskId: string): Promise<UserSubmission> {
    try {
      const headers = await this.getAuthHeaders();
      const response = await fetch(`${SUPABASE_URL}/functions/v1/choose-task`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ taskId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.submission;
    } catch (error) {
      console.error('Error choosing task:', error);
      throw error;
    }
  }

  async submitTaskForEvaluation(submissionId: string, submissionCode: string): Promise<void> {
    try {
      const headers = await this.getAuthHeaders();
      const response = await fetch(`${SUPABASE_URL}/functions/v1/submit-task-for-evaluation`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ submissionId, submissionCode }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (!data.success) {
        throw new Error('Failed to submit task for evaluation');
      }
    } catch (error) {
      console.error('Error submitting task:', error);
      throw error;
    }
  }

  async getTaskResult(submissionId: string): Promise<TaskResultResponse> {
    try {
      const headers = await this.getAuthHeaders();
      const response = await fetch(
        `${SUPABASE_URL}/functions/v1/get-task-result?submissionId=${submissionId}`,
        {
          method: 'GET',
          headers,
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching task result:', error);
      throw error;
    }
  }

  async generateDailyTasks(): Promise<DailyTask[]> {
    try {
      const headers = await this.getAuthHeaders();
      const response = await fetch(`${SUPABASE_URL}/functions/v1/generate-daily-tasks`, {
        method: 'POST',
        headers,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.tasks || [];
    } catch (error) {
      console.error('Error generating daily tasks:', error);
      throw new Error('Failed to generate daily tasks');
    }
  }
}

export const taskAPI = new TaskAPI();