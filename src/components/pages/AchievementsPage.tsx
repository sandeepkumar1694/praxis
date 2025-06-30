import React, { useState, useEffect } from 'react';
import { Trophy, Star, Zap, Target, Calendar, Lock, CheckCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useNotification } from '../../contexts/NotificationContext';
import { supabase } from '../../lib/supabase';
import LoadingSpinner from '../ui/LoadingSpinner';
import AuthenticatedLayout from '../layout/AuthenticatedLayout';

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  category: 'coding' | 'consistency' | 'performance' | 'social' | 'milestone';
  difficulty: 'bronze' | 'silver' | 'gold' | 'platinum';
  points: number;
  progress: number;
  maxProgress: number;
  unlocked: boolean;
  unlockedAt?: string;
  requirements: string[];
}

const AchievementsPage: React.FC = () => {
  const { user } = useAuth();
  const { showError } = useNotification();
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'unlocked' | 'locked'>('all');
  const [category, setCategory] = useState<'all' | Achievement['category']>('all');

  useEffect(() => {
    fetchAchievements();
  }, []);

  const fetchAchievements = async () => {
    try {
      setLoading(true);
      
      // Mock achievements data - replace with actual API call
      const mockAchievements: Achievement[] = [
        {
          id: '1',
          title: 'First Steps',
          description: 'Complete your first coding task',
          icon: Target,
          category: 'milestone',
          difficulty: 'bronze',
          points: 100,
          progress: 1,
          maxProgress: 1,
          unlocked: true,
          unlockedAt: '2025-01-01T12:00:00Z',
          requirements: ['Complete 1 task']
        },
        {
          id: '2',
          title: 'Perfect Score',
          description: 'Score 100% on any task',
          icon: Star,
          category: 'performance',
          difficulty: 'silver',
          points: 250,
          progress: 0,
          maxProgress: 1,
          unlocked: false,
          requirements: ['Score 100% on a task']
        },
        {
          id: '3',
          title: 'Week Warrior',
          description: 'Complete tasks for 7 consecutive days',
          icon: Calendar,
          category: 'consistency',
          difficulty: 'gold',
          points: 500,
          progress: 5,
          maxProgress: 7,
          unlocked: false,
          requirements: ['7 day streak']
        },
        {
          id: '4',
          title: 'Algorithm Master',
          description: 'Complete 50 algorithm-based tasks',
          icon: Zap,
          category: 'coding',
          difficulty: 'platinum',
          points: 1000,
          progress: 23,
          maxProgress: 50,
          unlocked: false,
          requirements: ['50 algorithm tasks']
        },
        {
          id: '5',
          title: 'Speed Demon',
          description: 'Complete a task in under 10 minutes',
          icon: Zap,
          category: 'performance',
          difficulty: 'silver',
          points: 300,
          progress: 1,
          maxProgress: 1,
          unlocked: true,
          unlockedAt: '2025-01-15T09:30:00Z',
          requirements: ['Complete task < 10 minutes']
        },
        {
          id: '6',
          title: 'Century Club',
          description: 'Complete 100 tasks',
          icon: Trophy,
          category: 'milestone',
          difficulty: 'gold',
          points: 750,
          progress: 67,
          maxProgress: 100,
          unlocked: false,
          requirements: ['100 completed tasks']
        }
      ];

      setAchievements(mockAchievements);
    } catch (error) {
      showError('Failed to load achievements');
    } finally {
      setLoading(false);
    }
  };

  const getDifficultyColor = (difficulty: Achievement['difficulty']) => {
    switch (difficulty) {
      case 'bronze':
        return 'from-yellow-600 to-yellow-700';
      case 'silver':
        return 'from-gray-400 to-gray-500';
      case 'gold':
        return 'from-yellow-400 to-yellow-500';
      case 'platinum':
        return 'from-purple-400 to-purple-500';
    }
  };

  const getCategoryColor = (category: Achievement['category']) => {
    switch (category) {
      case 'coding':
        return 'text-blue-400';
      case 'consistency':
        return 'text-green-400';
      case 'performance':
        return 'text-yellow-400';
      case 'social':
        return 'text-purple-400';
      case 'milestone':
        return 'text-accent';
    }
  };

  const filteredAchievements = achievements.filter(achievement => {
    if (filter === 'unlocked' && !achievement.unlocked) return false;
    if (filter === 'locked' && achievement.unlocked) return false;
    if (category !== 'all' && achievement.category !== category) return false;
    return true;
  });

  const totalPoints = achievements
    .filter(a => a.unlocked)
    .reduce((sum, a) => sum + a.points, 0);

  const totalUnlocked = achievements.filter(a => a.unlocked).length;

  if (loading) {
    return (
      <AuthenticatedLayout>
        <div className="container mx-auto px-6 py-8 max-w-6xl">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <LoadingSpinner size="lg" color="text-primary" />
              <p className="mt-4 text-white/60">Loading achievements...</p>
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
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center">
              <Trophy size={24} className="text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-poppins font-bold text-white">
                Achievements
              </h1>
              <p className="text-white/60">
                Unlock badges and earn points by completing challenges
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-dashboard-card rounded-xl p-6 border border-white/10">
              <div className="flex items-center space-x-3 mb-2">
                <Trophy size={20} className="text-yellow-400" />
                <span className="text-white/80">Total Points</span>
              </div>
              <div className="text-2xl font-bold text-yellow-400">{totalPoints}</div>
              <div className="text-sm text-white/60">Achievement points earned</div>
            </div>
            
            <div className="bg-dashboard-card rounded-xl p-6 border border-white/10">
              <div className="flex items-center space-x-3 mb-2">
                <CheckCircle size={20} className="text-green-400" />
                <span className="text-white/80">Unlocked</span>
              </div>
              <div className="text-2xl font-bold text-white">
                {totalUnlocked}/{achievements.length}
              </div>
              <div className="text-sm text-white/60">Achievements unlocked</div>
            </div>
            
            <div className="bg-dashboard-card rounded-xl p-6 border border-white/10">
              <div className="flex items-center space-x-3 mb-2">
                <Star size={20} className="text-primary" />
                <span className="text-white/80">Completion</span>
              </div>
              <div className="text-2xl font-bold text-primary">
                {Math.round((totalUnlocked / achievements.length) * 100)}%
              </div>
              <div className="text-sm text-white/60">Overall progress</div>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4 mb-8">
            {/* Status Filter */}
            <div className="flex bg-white/5 rounded-lg p-1">
              {(['all', 'unlocked', 'locked'] as const).map((filterOption) => (
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

            {/* Category Filter */}
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as any)}
              className="bg-white/5 border border-white/10 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
            >
              <option value="all">All Categories</option>
              <option value="coding">Coding</option>
              <option value="consistency">Consistency</option>
              <option value="performance">Performance</option>
              <option value="milestone">Milestones</option>
            </select>
          </div>
        </div>

        {/* Achievements Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAchievements.map((achievement) => {
            const Icon = achievement.icon;
            const progressPercentage = (achievement.progress / achievement.maxProgress) * 100;
            
            return (
              <div
                key={achievement.id}
                className={`relative bg-dashboard-card rounded-2xl p-6 border-2 transition-all duration-300 hover:transform hover:-translate-y-1 ${
                  achievement.unlocked
                    ? 'border-yellow-500/30 bg-yellow-500/5'
                    : 'border-white/10 hover:border-white/20'
                } ${!achievement.unlocked ? 'opacity-75' : ''}`}
              >
                {/* Lock/Unlock Status */}
                <div className="absolute top-4 right-4">
                  {achievement.unlocked ? (
                    <CheckCircle size={20} className="text-green-400" />
                  ) : (
                    <Lock size={20} className="text-white/40" />
                  )}
                </div>

                {/* Achievement Icon */}
                <div className={`w-16 h-16 rounded-xl bg-gradient-to-r ${getDifficultyColor(achievement.difficulty)} flex items-center justify-center mb-4 ${
                  !achievement.unlocked ? 'grayscale' : ''
                }`}>
                  <Icon size={32} className="text-white" />
                </div>

                {/* Achievement Info */}
                <div className="mb-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <h3 className="text-lg font-bold text-white">{achievement.title}</h3>
                    <span className={`text-xs px-2 py-1 rounded-full bg-white/10 ${getCategoryColor(achievement.category)}`}>
                      {achievement.category}
                    </span>
                  </div>
                  <p className="text-white/60 text-sm mb-3">{achievement.description}</p>
                  
                  {achievement.unlocked && achievement.unlockedAt && (
                    <div className="text-xs text-green-400 mb-2">
                      Unlocked {new Date(achievement.unlockedAt).toLocaleDateString()}
                    </div>
                  )}
                </div>

                {/* Progress */}
                {!achievement.unlocked && (
                  <div className="mb-4">
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="text-white/60">Progress</span>
                      <span className="text-white">
                        {achievement.progress}/{achievement.maxProgress}
                      </span>
                    </div>
                    <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-primary to-accent rounded-full transition-all duration-1000 ease-out"
                        style={{ width: `${progressPercentage}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Requirements */}
                <div className="mb-4">
                  <h4 className="text-xs font-semibold text-white/80 mb-2">Requirements:</h4>
                  <ul className="space-y-1">
                    {achievement.requirements.map((req, index) => (
                      <li key={index} className="text-xs text-white/60 flex items-center space-x-2">
                        <div className="w-1 h-1 bg-primary rounded-full" />
                        <span>{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Points */}
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-yellow-400">
                    {achievement.points}
                  </span>
                  <span className="text-xs text-white/60">points</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty State */}
        {filteredAchievements.length === 0 && (
          <div className="text-center py-12">
            <Trophy size={48} className="text-white/20 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No achievements found</h3>
            <p className="text-white/60">Try adjusting your filters to see more achievements.</p>
          </div>
        )}
      </div>
    </AuthenticatedLayout>
  );
};

export default AchievementsPage;