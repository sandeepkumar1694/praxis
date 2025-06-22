import { useState, useEffect } from 'react';

interface DashboardData {
  performance: {
    overallScore: number;
    trend: 'up' | 'down' | 'stable';
    trendPercentage: number;
    subScores: {
      codeQuality: number;
      problemSolving: number;
      efficiency: number;
      collaboration: number;
    };
    recentChange: number;
  };
  analytics: {
    chartData: Array<{
      month: string;
      score: number;
      tasks: number;
    }>;
    insights: {
      bestMonth: string;
      improvement: number;
      totalTasks: number;
    };
  };
  skills: Array<{
    name: string;
    current: number;
    target: number;
    color: string;
  }>;
  tasks: Array<{
    id: string;
    title: string;
    description: string;
    status: 'not_started' | 'in_progress' | 'completed' | 'overdue';
    priority: 'low' | 'medium' | 'high';
    dueDate: string;
    progress: number;
    difficulty: string;
    estimatedTime: string;
  }>;
  achievements: Array<{
    id: string;
    title: string;
    description: string;
    value: number;
    unit: string;
    trend?: {
      direction: 'up' | 'down';
      percentage: number;
    };
    color: string;
  }>;
  activities: Array<{
    id: string;
    type: string;
    title: string;
    description: string;
    timestamp: string;
    color: string;
    metadata?: any;
  }>;
  profile: {
    location?: string;
    joinDate?: string;
    role?: string;
    level?: string;
    nextLevelProgress?: number;
  };
}

export const useDashboardData = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Simulate API call with realistic data
      await new Promise(resolve => setTimeout(resolve, 1000));

      const mockData: DashboardData = {
        performance: {
          overallScore: 94,
          trend: 'up',
          trendPercentage: 12,
          subScores: {
            codeQuality: 96,
            problemSolving: 92,
            efficiency: 89,
            collaboration: 98
          },
          recentChange: 8
        },
        analytics: {
          chartData: [
            { month: 'Jan', score: 78, tasks: 12 },
            { month: 'Feb', score: 82, tasks: 15 },
            { month: 'Mar', score: 85, tasks: 18 },
            { month: 'Apr', score: 88, tasks: 22 },
            { month: 'May', score: 91, tasks: 25 },
            { month: 'Jun', score: 94, tasks: 28 },
          ],
          insights: {
            bestMonth: 'June',
            improvement: 16,
            totalTasks: 120
          }
        },
        skills: [
          { name: 'JavaScript', current: 92, target: 95, color: '#00A8FF' },
          { name: 'React', current: 88, target: 90, color: '#05FDD1' },
          { name: 'Node.js', current: 85, target: 90, color: '#8B5CF6' },
          { name: 'Python', current: 78, target: 85, color: '#10B981' },
          { name: 'Database', current: 82, target: 87, color: '#F59E0B' },
          { name: 'DevOps', current: 75, target: 80, color: '#EF4444' },
          { name: 'Testing', current: 80, target: 85, color: '#6366F1' },
          { name: 'Security', current: 70, target: 80, color: '#EC4899' },
        ],
        tasks: [
          {
            id: '1',
            title: 'Build Authentication System',
            description: 'Implement secure user authentication with JWT tokens and refresh mechanisms',
            status: 'in_progress',
            priority: 'high',
            dueDate: '2025-01-25',
            progress: 65,
            difficulty: 'Advanced',
            estimatedTime: '4-6 hours'
          },
          {
            id: '2',
            title: 'API Rate Limiting',
            description: 'Design and implement rate limiting for the REST API endpoints',
            status: 'not_started',
            priority: 'medium',
            dueDate: '2025-01-28',
            progress: 0,
            difficulty: 'Intermediate',
            estimatedTime: '2-3 hours'
          },
          {
            id: '3',
            title: 'Database Optimization',
            description: 'Optimize slow queries and implement proper indexing strategies',
            status: 'completed',
            priority: 'high',
            dueDate: '2025-01-20',
            progress: 100,
            difficulty: 'Advanced',
            estimatedTime: '3-4 hours'
          }
        ],
        achievements: [
          {
            id: 'tasks_completed',
            title: 'Tasks Completed',
            description: 'Total challenges finished',
            value: 142,
            unit: '',
            trend: { direction: 'up', percentage: 23 },
            color: 'from-yellow-400 to-orange-500'
          },
          {
            id: 'accuracy_rate',
            title: 'Accuracy Rate',
            description: 'Average solution accuracy',
            value: 94,
            unit: '%',
            trend: { direction: 'up', percentage: 8 },
            color: 'from-green-400 to-emerald-500'
          }
        ],
        activities: [
          {
            id: '1',
            type: 'task_completed',
            title: 'Completed Authentication System',
            description: 'Successfully implemented JWT-based authentication with refresh tokens',
            timestamp: '2025-01-22T14:30:00Z',
            color: 'text-green-400',
            metadata: { points: 850, difficulty: 'Advanced', duration: '4h 30m' }
          }
        ],
        profile: {
          location: 'San Francisco, CA',
          joinDate: '2024-03-15',
          role: 'Full Stack Developer',
          level: 'Senior',
          nextLevelProgress: 75
        }
      };

      setData(mockData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const refreshData = () => {
    fetchDashboardData();
  };

  return {
    data,
    loading,
    error,
    refreshData
  };
};