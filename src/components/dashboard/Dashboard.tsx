import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import DashboardLayout from './DashboardLayout';
import PerformanceOverview from './sections/PerformanceOverview';
import PerformanceAnalytics from './sections/PerformanceAnalytics';
import SkillsAssessment from './sections/SkillsAssessment';
import ActiveTasks from './sections/ActiveTasks';
import UserProfile from './sections/UserProfile';
import AchievementMetrics from './sections/AchievementMetrics';
import ActivityFeed from './sections/ActivityFeed';
import { useDashboardData } from '../../hooks/useDashboardData';
import LoadingSpinner from '../ui/LoadingSpinner';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { data, loading, error, refreshData } = useDashboardData();
  const [animationStep, setAnimationStep] = useState(0);

  // Staggered animation effect
  useEffect(() => {
    const timer = setInterval(() => {
      setAnimationStep(prev => {
        if (prev < 7) return prev + 1;
        clearInterval(timer);
        return prev;
      });
    }, 100);

    return () => clearInterval(timer);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-dashboard-bg flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" color="text-primary" />
          <p className="mt-4 text-white/60">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-dashboard-bg flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-red-400 text-2xl">⚠️</span>
          </div>
          <h2 className="text-xl font-poppins font-bold text-white mb-2">
            Unable to Load Dashboard
          </h2>
          <p className="text-white/60 mb-6">
            We're having trouble loading your data. Please try again.
          </p>
          <button
            onClick={refreshData}
            className="px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-blue-600 transition-colors duration-200"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <DashboardLayout>
      <div className="grid grid-cols-1 xl:grid-cols-10 gap-8 min-h-screen">
        {/* Left Column - Primary Content (70%) */}
        <div className="xl:col-span-7 space-y-8">
          {/* Performance Overview */}
          <div 
            className={`transition-all duration-500 ${
              animationStep >= 0 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
            style={{ transitionDelay: '0ms' }}
          >
            <PerformanceOverview data={data?.performance} />
          </div>

          {/* Performance Analytics */}
          <div 
            className={`transition-all duration-500 ${
              animationStep >= 1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
            style={{ transitionDelay: '100ms' }}
          >
            <PerformanceAnalytics data={data?.analytics} />
          </div>

          {/* Skills Assessment */}
          <div 
            className={`transition-all duration-500 ${
              animationStep >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
            style={{ transitionDelay: '200ms' }}
          >
            <SkillsAssessment data={data?.skills} />
          </div>

          {/* Active Tasks */}
          <div 
            className={`transition-all duration-500 ${
              animationStep >= 3 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
            style={{ transitionDelay: '300ms' }}
          >
            <ActiveTasks data={data?.tasks} />
          </div>
        </div>

        {/* Right Column - Secondary Content (30%) */}
        <div className="xl:col-span-3 space-y-8">
          {/* User Profile */}
          <div 
            className={`transition-all duration-500 ${
              animationStep >= 4 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
            style={{ transitionDelay: '400ms' }}
          >
            <UserProfile user={user} data={data?.profile} />
          </div>

          {/* Achievement Metrics */}
          <div 
            className={`transition-all duration-500 ${
              animationStep >= 5 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
            style={{ transitionDelay: '500ms' }}
          >
            <AchievementMetrics data={data?.achievements} />
          </div>

          {/* Activity Feed */}
          <div 
            className={`transition-all duration-500 ${
              animationStep >= 6 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
            style={{ transitionDelay: '600ms' }}
          >
            <ActivityFeed data={data?.activities} />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;