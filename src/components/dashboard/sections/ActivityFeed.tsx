import React, { useState, useEffect } from 'react';
import { RefreshCw, MessageCircle, GitCommit, Award, Clock, ChevronDown } from 'lucide-react';

interface Activity {
  id: string;
  type: 'task_completed' | 'skill_improved' | 'badge_earned' | 'code_reviewed' | 'challenge_started';
  title: string;
  description: string;
  timestamp: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  color: string;
  metadata?: {
    points?: number;
    difficulty?: string;
    duration?: string;
  };
}

interface ActivityFeedProps {
  data?: Activity[];
}

const ActivityFeed: React.FC<ActivityFeedProps> = ({ data }) => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const mockActivities: Activity[] = data || [
    {
      id: '1',
      type: 'task_completed',
      title: 'Completed Authentication System',
      description: 'Successfully implemented JWT-based authentication with refresh tokens',
      timestamp: '2025-01-22T14:30:00Z',
      icon: GitCommit,
      color: 'text-green-400',
      metadata: { points: 850, difficulty: 'Advanced', duration: '4h 30m' }
    },
    {
      id: '2',
      type: 'badge_earned',
      title: 'Security Expert Badge',
      description: 'Earned for implementing secure authentication practices',
      timestamp: '2025-01-22T14:35:00Z',
      icon: Award,
      color: 'text-yellow-400',
      metadata: { points: 500 }
    },
    {
      id: '3',
      type: 'skill_improved',
      title: 'Node.js Skill Level Up',
      description: 'Advanced from Intermediate to Advanced level',
      timestamp: '2025-01-22T10:15:00Z',
      icon: GitCommit,
      color: 'text-blue-400',
      metadata: { points: 300 }
    },
    {
      id: '4',
      type: 'code_reviewed',
      title: 'Code Review Completed',
      description: 'Provided feedback on React component optimization challenge',
      timestamp: '2025-01-21T16:45:00Z',
      icon: MessageCircle,
      color: 'text-purple-400',
      metadata: { points: 150 }
    },
    {
      id: '5',
      type: 'challenge_started',
      title: 'Started Database Optimization',
      description: 'Beginning work on PostgreSQL query optimization challenge',
      timestamp: '2025-01-21T09:20:00Z',
      icon: Clock,
      color: 'text-accent',
      metadata: { difficulty: 'Advanced' }
    }
  ];

  useEffect(() => {
    setActivities(mockActivities.slice(0, 5));
  }, []);

  const formatTimestamp = (timestamp: string) => {
    const now = new Date();
    const activityTime = new Date(timestamp);
    const diffInMinutes = Math.floor((now.getTime() - activityTime.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  const loadMore = () => {
    setIsLoading(true);
    setTimeout(() => {
      const currentLength = activities.length;
      const newActivities = mockActivities.slice(currentLength, currentLength + 3);
      setActivities(prev => [...prev, ...newActivities]);
      setIsLoading(false);
      if (currentLength + 3 >= mockActivities.length) {
        setHasMore(false);
      }
    }, 1000);
  };

  const refresh = () => {
    setIsLoading(true);
    setTimeout(() => {
      setActivities([...mockActivities].slice(0, 5));
      setHasMore(true);
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="bg-dashboard-card rounded-2xl p-6 border border-white/10 hover:border-white/20 transition-all duration-300">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-poppins font-bold text-white mb-1">
            Activity Feed
          </h3>
          <p className="text-white/60 text-sm">Recent achievements and updates</p>
        </div>
        <button 
          onClick={refresh}
          disabled={isLoading}
          className="p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200 disabled:opacity-50"
        >
          <RefreshCw size={16} className={isLoading ? 'animate-spin' : ''} />
        </button>
      </div>

      <div className="space-y-4 max-h-80 overflow-y-auto custom-scrollbar">
        {activities.map((activity, index) => {
          const Icon = activity.icon;
          
          return (
            <div
              key={activity.id}
              className="group flex items-start space-x-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-300 cursor-pointer"
              style={{
                animationDelay: `${index * 50}ms`,
                animation: 'fadeInLeft 0.6s ease-out forwards'
              }}
            >
              <div className="flex-shrink-0 mt-1">
                <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Icon size={16} className={activity.color} />
                </div>
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-medium text-white text-sm mb-1 group-hover:text-primary transition-colors duration-200">
                      {activity.title}
                    </h4>
                    <p className="text-xs text-white/60 leading-relaxed mb-2">
                      {activity.description}
                    </p>
                    
                    {/* Metadata */}
                    {activity.metadata && (
                      <div className="flex items-center space-x-3 text-xs text-white/50">
                        {activity.metadata.points && (
                          <span className="text-accent">+{activity.metadata.points} XP</span>
                        )}
                        {activity.metadata.difficulty && (
                          <span>{activity.metadata.difficulty}</span>
                        )}
                        {activity.metadata.duration && (
                          <span>{activity.metadata.duration}</span>
                        )}
                      </div>
                    )}
                  </div>
                  
                  <span className="text-xs text-white/40 ml-2 flex-shrink-0">
                    {formatTimestamp(activity.timestamp)}
                  </span>
                </div>
              </div>
            </div>
          );
        })}

        {/* Load More Button */}
        {hasMore && (
          <button
            onClick={loadMore}
            disabled={isLoading}
            className="w-full flex items-center justify-center space-x-2 py-3 text-white/60 hover:text-white hover:bg-white/5 rounded-lg transition-all duration-200 disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <RefreshCw size={16} className="animate-spin" />
                <span className="text-sm">Loading...</span>
              </>
            ) : (
              <>
                <ChevronDown size={16} />
                <span className="text-sm">Load More</span>
              </>
            )}
          </button>
        )}

        {!hasMore && activities.length > 0 && (
          <div className="text-center py-4">
            <span className="text-xs text-white/40">You've reached the end</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ActivityFeed;