import React, { useState, useEffect } from 'react';
import { Calendar, Trophy, Clock, Star, Target, ChevronRight } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useNotification } from '../../contexts/NotificationContext';
import { supabase } from '../../lib/supabase';
import LoadingSpinner from '../ui/LoadingSpinner';
import AuthenticatedLayout from '../layout/AuthenticatedLayout';

interface WeeklyChallenge {
  id: string;
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  points: number;
  deadline: string;
  completed: boolean;
  progress: number;
  requirements: string[];
}

const WeeklyTasksPage: React.FC = () => {
  const { user } = useAuth();
  const { showError, showSuccess } = useNotification();
  const [challenges, setChallenges] = useState<WeeklyChallenge[]>([]);
  const [loading, setLoading] = useState(true);
  const [weeklyScore, setWeeklyScore] = useState(0);
  const [weeklyRank, setWeeklyRank] = useState(0);

  useEffect(() => {
    fetchWeeklyChallenges();
  }, []);

  const fetchWeeklyChallenges = async () => {
    try {
      setLoading(true);
      
      // Mock data - replace with actual API call
      const mockChallenges: WeeklyChallenge[] = [
        {
          id: '1',
          title: 'Algorithm Master',
          description: 'Complete 5 algorithm challenges this week',
          difficulty: 'medium',
          points: 500,
          deadline: '2025-01-05T23:59:59Z',
          completed: false,
          progress: 60,
          requirements: ['Complete 5 daily tasks', 'Score above 80%', 'Include algorithms']
        },
        {
          id: '2',
          title: 'System Design Pro',
          description: 'Design a scalable system architecture',
          difficulty: 'hard',
          points: 1000,
          deadline: '2025-01-05T23:59:59Z',
          completed: false,
          progress: 25,
          requirements: ['Complete system design task', 'Document architecture', 'Consider scalability']
        },
        {
          id: '3',
          title: 'Code Quality Champion',
          description: 'Maintain high code quality scores',
          difficulty: 'easy',
          points: 300,
          deadline: '2025-01-05T23:59:59Z',
          completed: true,
          progress: 100,
          requirements: ['Score above 90%', 'Follow best practices', 'Add proper comments']
        }
      ];

      setChallenges(mockChallenges);
      setWeeklyScore(mockChallenges.reduce((sum, c) => sum + (c.completed ? c.points : 0), 0));
      setWeeklyRank(15); // Mock rank
    } catch (error) {
      showError('Failed to load weekly challenges');
    } finally {
      setLoading(false);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'medium':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'hard':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getTimeRemaining = (deadline: string) => {
    const now = new Date();
    const end = new Date(deadline);
    const diff = end.getTime() - now.getTime();
    
    if (diff <= 0) return 'Expired';
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (days > 0) return `${days}d ${hours}h left`;
    return `${hours}h left`;
  };

  if (loading) {
    return (
      <AuthenticatedLayout>
        <div className="container mx-auto px-6 py-8 max-w-6xl">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <LoadingSpinner size="lg" color="text-primary" />
              <p className="mt-4 text-white/60">Loading weekly challenges...</p>
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
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-xl flex items-center justify-center">
              <Calendar size={24} className="text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-poppins font-bold text-white">
                Weekly Challenges
              </h1>
              <p className="text-white/60">
                Take on bigger challenges for bonus points and recognition
              </p>
            </div>
          </div>

          {/* Weekly Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-dashboard-card rounded-xl p-6 border border-white/10">
              <div className="flex items-center space-x-3 mb-2">
                <Trophy size={20} className="text-yellow-400" />
                <span className="text-white/80">Weekly Score</span>
              </div>
              <div className="text-2xl font-bold text-white">{weeklyScore}</div>
              <div className="text-sm text-white/60">Points earned this week</div>
            </div>
            
            <div className="bg-dashboard-card rounded-xl p-6 border border-white/10">
              <div className="flex items-center space-x-3 mb-2">
                <Target size={20} className="text-primary" />
                <span className="text-white/80">Weekly Rank</span>
              </div>
              <div className="text-2xl font-bold text-white">#{weeklyRank}</div>
              <div className="text-sm text-white/60">Among all users</div>
            </div>
            
            <div className="bg-dashboard-card rounded-xl p-6 border border-white/10">
              <div className="flex items-center space-x-3 mb-2">
                <Clock size={20} className="text-accent" />
                <span className="text-white/80">Challenges</span>
              </div>
              <div className="text-2xl font-bold text-white">
                {challenges.filter(c => c.completed).length}/{challenges.length}
              </div>
              <div className="text-sm text-white/60">Completed this week</div>
            </div>
          </div>
        </div>

        {/* Challenges List */}
        <div className="space-y-6">
          {challenges.map((challenge) => (
            <div
              key={challenge.id}
              className={`bg-dashboard-card rounded-2xl p-6 border transition-all duration-300 hover:transform hover:-translate-y-1 ${
                challenge.completed
                  ? 'border-green-500/30 bg-green-500/5'
                  : 'border-white/10 hover:border-white/20'
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-xl font-poppins font-bold text-white">
                      {challenge.title}
                    </h3>
                    <span className={`px-3 py-1 text-xs font-medium rounded-full border ${getDifficultyColor(challenge.difficulty)}`}>
                      {challenge.difficulty.toUpperCase()}
                    </span>
                    {challenge.completed && (
                      <div className="flex items-center space-x-1 text-green-400">
                        <Trophy size={16} />
                        <span className="text-sm font-medium">Completed</span>
                      </div>
                    )}
                  </div>
                  
                  <p className="text-white/80 mb-4">
                    {challenge.description}
                  </p>
                  
                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <h4 className="text-sm font-semibold text-white mb-2">Requirements:</h4>
                      <ul className="space-y-1">
                        {challenge.requirements.map((req, index) => (
                          <li key={index} className="text-sm text-white/60 flex items-center space-x-2">
                            <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                            <span>{req}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-white/60">Progress</span>
                        <span className="text-white font-medium">{challenge.progress}%</span>
                      </div>
                      <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-primary to-accent rounded-full transition-all duration-1000 ease-out"
                          style={{ width: `${challenge.progress}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="ml-6 text-right">
                  <div className="text-2xl font-bold text-primary mb-1">
                    {challenge.points}
                  </div>
                  <div className="text-sm text-white/60 mb-2">Points</div>
                  <div className="text-xs text-white/60">
                    {getTimeRemaining(challenge.deadline)}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Leaderboard Teaser */}
        <div className="mt-8 bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">
                Weekly Leaderboard
              </h3>
              <p className="text-white/80">
                See how you rank against other developers this week
              </p>
            </div>
            <button className="flex items-center space-x-2 px-4 py-2 bg-primary text-white rounded-lg font-medium hover:bg-blue-600 transition-colors duration-200">
              <span>View Leaderboard</span>
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
};

export default WeeklyTasksPage;