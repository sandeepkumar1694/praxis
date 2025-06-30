import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Star, BarChart3, Eye, Filter, ChevronDown } from 'lucide-react';
import { UserSubmission, DailyTask } from '../../types/tasks';
import { useAuth } from '../../contexts/AuthContext';
import { useNotification } from '../../contexts/NotificationContext';
import { supabase } from '../../lib/supabase';
import LoadingSpinner from '../ui/LoadingSpinner';
import AuthenticatedLayout from '../layout/AuthenticatedLayout';

interface CompletedTaskWithTask extends UserSubmission {
  daily_tasks: DailyTask;
}

const CompletedTasksList: React.FC = () => {
  const { user } = useAuth();
  const { showError } = useNotification();
  const navigate = useNavigate();
  const [completedTasks, setCompletedTasks] = useState<CompletedTaskWithTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'basic' | 'intermediate' | 'pro'>('all');
  const [sortBy, setSortBy] = useState<'recent' | 'score' | 'level'>('recent');

  useEffect(() => {
    fetchCompletedTasks();
  }, []);

  const fetchCompletedTasks = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('user_submissions')
        .select(`
          *,
          daily_tasks (
            id,
            title,
            description,
            level,
            time_limit_minutes,
            company_context
          )
        `)
        .eq('user_id', user?.id)
        .eq('status', 'scored')
        .order('updated_at', { ascending: false });

      if (error) throw error;

      setCompletedTasks(data || []);
    } catch (error) {
      showError(error instanceof Error ? error.message : 'Failed to load completed tasks');
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

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'basic':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'intermediate':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'pro':
        return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const filteredAndSortedTasks = completedTasks
    .filter(task => filter === 'all' || task.daily_tasks.level === filter)
    .sort((a, b) => {
      switch (sortBy) {
        case 'score':
          return (b.score || 0) - (a.score || 0);
        case 'level':
          const levelOrder = { basic: 0, intermediate: 1, pro: 2 };
          return levelOrder[b.daily_tasks.level] - levelOrder[a.daily_tasks.level];
        default:
          return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
      }
    });

  if (loading) {
    return (
      <AuthenticatedLayout>
        <div className="container mx-auto px-6 py-8 max-w-6xl">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <LoadingSpinner size="lg" color="text-primary" />
              <p className="mt-4 text-white/60">Loading completed tasks...</p>
            </div>
          </div>
        </div>
      </AuthenticatedLayout>
    );
  }

  return (
    <AuthenticatedLayout>
      <div className="container mx-auto px-6 py-8 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
              <Star size={24} className="text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-poppins font-bold text-white">
                Completed Tasks
              </h1>
              <p className="text-white/60">
                Review your task history and performance reports
              </p>
            </div>
          </div>

          {/* Filters and Sorting */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
            {/* Level Filter */}
            <div className="flex bg-white/5 rounded-lg p-1">
              {(['all', 'basic', 'intermediate', 'pro'] as const).map((filterOption) => (
                <button
                  key={filterOption}
                  onClick={() => setFilter(filterOption)}
                  className={`px-3 py-1 text-sm font-medium rounded transition-all duration-200 ${
                    filter === filterOption
                      ? 'bg-primary text-white'
                      : 'text-white/60 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {filterOption.charAt(0).toUpperCase() + filterOption.slice(1)}
                </button>
              ))}
            </div>

            {/* Sort Dropdown */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-white/5 border border-white/10 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
                <option value="recent">Most Recent</option>
                <option value="score">Highest Score</option>
                <option value="level">Difficulty Level</option>
              </select>
            </div>

            {/* Stats */}
            <div className="flex items-center space-x-4 ml-auto">
              <div className="text-center">
                <div className="text-lg font-bold text-white">{completedTasks.length}</div>
                <div className="text-xs text-white/60">Completed</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-accent">
                  {completedTasks.length ? Math.round(completedTasks.reduce((sum, task) => sum + (task.score || 0), 0) / completedTasks.length) : 0}
                </div>
                <div className="text-xs text-white/60">Avg Score</div>
              </div>
            </div>
          </div>
        </div>

        {/* Tasks Grid */}
        {filteredAndSortedTasks.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
              <Star size={32} className="text-white/40" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">No completed tasks yet</h3>
            <p className="text-white/60 mb-6">Complete some daily tasks to see your progress here</p>
            <button
              onClick={() => navigate('/tasks')}
              className="px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-blue-600 transition-colors duration-200"
            >
              Start Daily Tasks
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredAndSortedTasks.map((task) => (
              <div
                key={task.id}
                className="bg-dashboard-card rounded-2xl p-6 border border-white/10 hover:border-white/20 hover:transform hover:-translate-y-1 transition-all duration-300 cursor-pointer"
                onClick={() => navigate(`/tasks/result/${task.id}`)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-3">
                      <h3 className="text-xl font-poppins font-bold text-white">
                        {task.daily_tasks.title}
                      </h3>
                      <span className={`px-3 py-1 text-xs font-medium rounded-full border ${getLevelColor(task.daily_tasks.level)}`}>
                        {task.daily_tasks.level.toUpperCase()}
                      </span>
                      <div className={`text-2xl font-bold ${getScoreColor(task.score || 0)}`}>
                        {task.score}%
                      </div>
                    </div>
                    
                    <p className="text-white/80 mb-4 line-clamp-2">
                      {task.daily_tasks.description}
                    </p>
                    
                    <div className="flex items-center space-x-4 text-sm text-white/60">
                      <div className="flex items-center space-x-1">
                        <Calendar size={14} />
                        <span>{new Date(task.updated_at).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <BarChart3 size={14} />
                        <span>Time: {task.daily_tasks.time_limit_minutes} min</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="ml-6 flex items-center space-x-2">
                    <button className="p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200">
                      <Eye size={20} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AuthenticatedLayout>
  );
};

export default CompletedTasksList;