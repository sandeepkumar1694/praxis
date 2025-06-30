import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, Target, Award, Calendar, ChevronDown, Filter } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useNotification } from '../../contexts/NotificationContext';
import { supabase } from '../../lib/supabase';
import LoadingSpinner from '../ui/LoadingSpinner';
import AuthenticatedLayout from '../layout/AuthenticatedLayout';

interface PerformanceData {
  totalTasks: number;
  averageScore: number;
  improvementRate: number;
  skillBreakdown: {
    [key: string]: {
      score: number;
      tasks: number;
      trend: 'up' | 'down' | 'stable';
    };
  };
  monthlyData: {
    month: string;
    score: number;
    tasks: number;
  }[];
  recentPerformance: {
    date: string;
    taskTitle: string;
    score: number;
    level: string;
  }[];
}

const PerformancePage: React.FC = () => {
  const { user } = useAuth();
  const { showError } = useNotification();
  const [performanceData, setPerformanceData] = useState<PerformanceData | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'1month' | '3months' | '6months' | '1year'>('3months');
  const [selectedMetric, setSelectedMetric] = useState<'score' | 'tasks' | 'improvement'>('score');

  useEffect(() => {
    fetchPerformanceData();
  }, [timeRange]);

  const fetchPerformanceData = async () => {
    try {
      setLoading(true);
      
      // Fetch user submissions for performance analysis
      const { data: submissions, error } = await supabase
        .from('user_submissions')
        .select(`
          *,
          daily_tasks (
            title,
            level,
            time_limit_minutes
          )
        `)
        .eq('user_id', user?.id)
        .eq('status', 'scored')
        .order('updated_at', { ascending: false });

      if (error) throw error;

      // Process data for analytics
      const processedData: PerformanceData = {
        totalTasks: submissions?.length || 0,
        averageScore: submissions?.length 
          ? Math.round(submissions.reduce((sum, s) => sum + (s.score || 0), 0) / submissions.length)
          : 0,
        improvementRate: 15, // Mock calculation
        skillBreakdown: {
          'JavaScript': { score: 92, tasks: 25, trend: 'up' },
          'React': { score: 88, tasks: 18, trend: 'up' },
          'Node.js': { score: 85, tasks: 15, trend: 'stable' },
          'Database': { score: 82, tasks: 12, trend: 'up' },
          'Algorithms': { score: 78, tasks: 20, trend: 'down' }
        },
        monthlyData: [
          { month: 'Oct', score: 78, tasks: 12 },
          { month: 'Nov', score: 82, tasks: 15 },
          { month: 'Dec', score: 85, tasks: 18 },
          { month: 'Jan', score: 88, tasks: 22 }
        ],
        recentPerformance: submissions?.slice(0, 10).map(s => ({
          date: s.updated_at,
          taskTitle: s.daily_tasks?.title || 'Unknown Task',
          score: s.score || 0,
          level: s.daily_tasks?.level || 'basic'
        })) || []
      };

      setPerformanceData(processedData);
    } catch (error) {
      showError('Failed to load performance data');
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-400';
    if (score >= 70) return 'text-blue-400';
    if (score >= 50) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    if (trend === 'up') return <TrendingUp size={16} className="text-green-400" />;
    if (trend === 'down') return <TrendingUp size={16} className="text-red-400 rotate-180" />;
    return <div className="w-4 h-4 bg-yellow-400 rounded-full" />;
  };

  if (loading) {
    return (
      <AuthenticatedLayout>
        <div className="container mx-auto px-6 py-8 max-w-6xl">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <LoadingSpinner size="lg" color="text-primary" />
              <p className="mt-4 text-white/60">Loading performance data...</p>
            </div>
          </div>
        </div>
      </AuthenticatedLayout>
    );
  }

  if (!performanceData) return null;

  return (
    <AuthenticatedLayout>
      <div className="container mx-auto px-6 py-8 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                <BarChart3 size={24} className="text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-poppins font-bold text-white">
                  Performance Analytics
                </h1>
                <p className="text-white/60">
                  Detailed insights into your coding performance and growth
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value as any)}
                className="bg-white/5 border border-white/10 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
                <option value="1month">Last Month</option>
                <option value="3months">Last 3 Months</option>
                <option value="6months">Last 6 Months</option>
                <option value="1year">Last Year</option>
              </select>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-dashboard-card rounded-xl p-6 border border-white/10">
              <div className="flex items-center space-x-3 mb-2">
                <Target size={20} className="text-primary" />
                <span className="text-white/80">Average Score</span>
              </div>
              <div className={`text-2xl font-bold ${getScoreColor(performanceData.averageScore)}`}>
                {performanceData.averageScore}%
              </div>
              <div className="text-sm text-white/60">Across all tasks</div>
            </div>
            
            <div className="bg-dashboard-card rounded-xl p-6 border border-white/10">
              <div className="flex items-center space-x-3 mb-2">
                <Award size={20} className="text-yellow-400" />
                <span className="text-white/80">Tasks Completed</span>
              </div>
              <div className="text-2xl font-bold text-white">{performanceData.totalTasks}</div>
              <div className="text-sm text-white/60">Total challenges</div>
            </div>
            
            <div className="bg-dashboard-card rounded-xl p-6 border border-white/10">
              <div className="flex items-center space-x-3 mb-2">
                <TrendingUp size={20} className="text-green-400" />
                <span className="text-white/80">Improvement Rate</span>
              </div>
              <div className="text-2xl font-bold text-green-400">+{performanceData.improvementRate}%</div>
              <div className="text-sm text-white/60">This month</div>
            </div>
            
            <div className="bg-dashboard-card rounded-xl p-6 border border-white/10">
              <div className="flex items-center space-x-3 mb-2">
                <Calendar size={20} className="text-accent" />
                <span className="text-white/80">Streak</span>
              </div>
              <div className="text-2xl font-bold text-accent">7</div>
              <div className="text-sm text-white/60">Days active</div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Performance Chart */}
          <div className="lg:col-span-2">
            <div className="bg-dashboard-card rounded-2xl p-6 border border-white/10 mb-8">
              <h3 className="text-lg font-semibold text-white mb-4">Performance Trend</h3>
              
              <div className="relative h-64 bg-white/5 rounded-xl p-6 overflow-hidden">
                <svg className="w-full h-full" viewBox="0 0 600 200">
                  {/* Grid lines */}
                  {[0, 25, 50, 75, 100].map((y, i) => (
                    <line
                      key={i}
                      x1="0"
                      y1={200 - (y * 2)}
                      x2="600"
                      y2={200 - (y * 2)}
                      stroke="rgba(255,255,255,0.1)"
                      strokeWidth="1"
                    />
                  ))}

                  {/* Chart path */}
                  <path
                    d={performanceData.monthlyData.map((point, i) => {
                      const x = (i / (performanceData.monthlyData.length - 1)) * 500 + 50;
                      const y = 200 - ((point.score / 100) * 180) - 10;
                      return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
                    }).join(' ')}
                    stroke="url(#chartGradient)"
                    strokeWidth="3"
                    fill="none"
                    strokeLinecap="round"
                  />

                  {/* Data points */}
                  {performanceData.monthlyData.map((point, i) => {
                    const x = (i / (performanceData.monthlyData.length - 1)) * 500 + 50;
                    const y = 200 - ((point.score / 100) * 180) - 10;
                    
                    return (
                      <circle
                        key={i}
                        cx={x}
                        cy={y}
                        r="4"
                        fill="#00A8FF"
                        className="transition-all duration-200"
                      />
                    );
                  })}

                  {/* X-axis labels */}
                  {performanceData.monthlyData.map((point, i) => {
                    const x = (i / (performanceData.monthlyData.length - 1)) * 500 + 50;
                    return (
                      <text
                        key={i}
                        x={x}
                        y="195"
                        textAnchor="middle"
                        fill="rgba(255,255,255,0.6)"
                        fontSize="12"
                      >
                        {point.month}
                      </text>
                    );
                  })}

                  <defs>
                    <linearGradient id="chartGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#00A8FF" />
                      <stop offset="100%" stopColor="#05FDD1" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
            </div>

            {/* Recent Performance */}
            <div className="bg-dashboard-card rounded-2xl p-6 border border-white/10">
              <h3 className="text-lg font-semibold text-white mb-4">Recent Performance</h3>
              <div className="space-y-3 max-h-80 overflow-y-auto custom-scrollbar">
                {performanceData.recentPerformance.map((task, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                    <div className="flex-1">
                      <h4 className="text-white font-medium">{task.taskTitle}</h4>
                      <div className="text-sm text-white/60">
                        {new Date(task.date).toLocaleDateString()} • {task.level}
                      </div>
                    </div>
                    <div className={`text-lg font-bold ${getScoreColor(task.score)}`}>
                      {task.score}%
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Skills Breakdown */}
          <div className="space-y-6">
            <div className="bg-dashboard-card rounded-2xl p-6 border border-white/10">
              <h3 className="text-lg font-semibold text-white mb-4">Skills Breakdown</h3>
              <div className="space-y-4">
                {Object.entries(performanceData.skillBreakdown).map(([skill, data]) => (
                  <div key={skill} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-white font-medium">{skill}</span>
                      <div className="flex items-center space-x-2">
                        {getTrendIcon(data.trend)}
                        <span className={`font-bold ${getScoreColor(data.score)}`}>
                          {data.score}%
                        </span>
                      </div>
                    </div>
                    <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-primary to-accent rounded-full transition-all duration-1000 ease-out"
                        style={{ width: `${data.score}%` }}
                      />
                    </div>
                    <div className="text-xs text-white/60">{data.tasks} tasks completed</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Performance Insights */}
            <div className="bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-3">💡 Insights</h3>
              <ul className="space-y-2 text-sm text-white/80">
                <li>• Your JavaScript skills have improved by 15% this month</li>
                <li>• Focus on algorithm challenges to boost your score</li>
                <li>• You're performing above average in React tasks</li>
                <li>• Consider practicing database optimization</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
};

export default PerformancePage;