import React, { useState, useEffect } from 'react';
import { Trophy, Target, Zap, TrendingUp, Star, Calendar } from 'lucide-react';
import CountUp from '../../ui/CountUp';

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  value: number;
  unit: string;
  trend?: {
    direction: 'up' | 'down';
    percentage: number;
  };
  color: string;
}

interface AchievementMetricsProps {
  data?: Achievement[];
}

const AchievementMetrics: React.FC<AchievementMetricsProps> = ({ data }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [selectedMetric, setSelectedMetric] = useState<string | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 500);
    return () => clearTimeout(timer);
  }, []);

  const mockData: Achievement[] = data || [
    {
      id: 'tasks_completed',
      title: 'Tasks Completed',
      description: 'Total challenges finished',
      icon: Trophy,
      value: 142,
      unit: '',
      trend: { direction: 'up', percentage: 23 },
      color: 'from-yellow-400 to-orange-500'
    },
    {
      id: 'accuracy_rate',
      title: 'Accuracy Rate',
      description: 'Average solution accuracy',
      icon: Target,
      value: 94,
      unit: '%',
      trend: { direction: 'up', percentage: 8 },
      color: 'from-green-400 to-emerald-500'
    },
    {
      id: 'streak_days',
      title: 'Current Streak',
      description: 'Consecutive active days',
      icon: Zap,
      value: 28,
      unit: ' days',
      color: 'from-purple-400 to-violet-500'
    },
    {
      id: 'skill_points',
      title: 'Skill Points',
      description: 'Total XP earned',
      icon: Star,
      value: 3420,
      unit: ' XP',
      trend: { direction: 'up', percentage: 15 },
      color: 'from-blue-400 to-cyan-500'
    },
    {
      id: 'avg_completion',
      title: 'Avg Completion',
      description: 'Average time to complete',
      icon: Calendar,
      value: 2.4,
      unit: 'h',
      trend: { direction: 'down', percentage: 12 },
      color: 'from-accent to-cyan-400'
    },
    {
      id: 'rank_percentile',
      title: 'Global Rank',
      description: 'Top percentile ranking',
      icon: TrendingUp,
      value: 95,
      unit: '%',
      trend: { direction: 'up', percentage: 5 },
      color: 'from-pink-400 to-rose-500'
    }
  ];

  return (
    <div className="bg-dashboard-card rounded-2xl p-6 border border-white/10 hover:border-white/20 transition-all duration-300">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-poppins font-bold text-white mb-1">
            Achievement Metrics
          </h3>
          <p className="text-white/60 text-sm">Your performance highlights</p>
        </div>
        <div className="flex items-center space-x-1">
          <div className="w-2 h-2 bg-accent rounded-full animate-pulse"></div>
          <span className="text-xs text-white/60">Live</span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {mockData.map((achievement, index) => {
          const Icon = achievement.icon;
          const isSelected = selectedMetric === achievement.id;
          
          return (
            <div
              key={achievement.id}
              className={`group p-4 rounded-xl bg-white/5 hover:bg-white/10 cursor-pointer transition-all duration-300 ${
                isSelected ? 'ring-2 ring-primary/50 bg-white/10' : ''
              }`}
              onMouseEnter={() => setSelectedMetric(achievement.id)}
              onMouseLeave={() => setSelectedMetric(null)}
              style={{
                animationDelay: `${index * 100}ms`,
                animation: isVisible ? 'fadeInUp 0.6s ease-out forwards' : 'none'
              }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 rounded-lg bg-gradient-to-r ${achievement.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                    <Icon size={20} className="text-white" />
                  </div>
                  <div>
                    <div className="text-xl font-bold text-white flex items-baseline">
                      <CountUp 
                        end={isVisible ? achievement.value : 0} 
                        duration={1500} 
                        delay={index * 100}
                        decimals={achievement.unit === 'h' ? 1 : 0}
                      />
                      <span className="text-sm text-white/60 ml-1">
                        {achievement.unit}
                      </span>
                    </div>
                    <div className="text-xs text-white/60">{achievement.title}</div>
                  </div>
                </div>
                
                {achievement.trend && (
                  <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${
                    achievement.trend.direction === 'up' 
                      ? 'bg-green-500/20 text-green-400' 
                      : 'bg-red-500/20 text-red-400'
                  }`}>
                    <TrendingUp 
                      size={12} 
                      className={achievement.trend.direction === 'down' ? 'rotate-180' : ''}
                    />
                    <span>{achievement.trend.percentage}%</span>
                  </div>
                )}
              </div>
              
              {/* Tooltip on hover */}
              {isSelected && (
                <div className="mt-3 p-2 bg-black/20 rounded-lg border border-white/10">
                  <p className="text-xs text-white/80">{achievement.description}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Summary Stats */}
      <div className="mt-6 pt-4 border-t border-white/10">
        <div className="flex items-center justify-between text-sm">
          <span className="text-white/60">This Month</span>
          <span className="text-accent font-medium">+18% improvement</span>
        </div>
      </div>
    </div>
  );
};

export default AchievementMetrics;