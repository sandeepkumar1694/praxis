import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Zap, Target, Award, BarChart3 } from 'lucide-react';
import CountUp from '../../ui/CountUp';

interface PerformanceData {
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
}

interface PerformanceOverviewProps {
  data?: PerformanceData;
}

const PerformanceOverview: React.FC<PerformanceOverviewProps> = ({ data }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 200);
    return () => clearTimeout(timer);
  }, []);

  const mockData: PerformanceData = data || {
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
  };

  const subScoreItems = [
    { 
      key: 'codeQuality' as keyof typeof mockData.subScores, 
      label: 'Code Quality', 
      icon: Target, 
      color: 'from-green-400 to-emerald-500' 
    },
    { 
      key: 'problemSolving' as keyof typeof mockData.subScores, 
      label: 'Problem Solving', 
      icon: Zap, 
      color: 'from-blue-400 to-cyan-500' 
    },
    { 
      key: 'efficiency' as keyof typeof mockData.subScores, 
      label: 'Efficiency', 
      icon: BarChart3, 
      color: 'from-purple-400 to-violet-500' 
    },
    { 
      key: 'collaboration' as keyof typeof mockData.subScores, 
      label: 'Collaboration', 
      icon: Award, 
      color: 'from-accent to-cyan-400' 
    },
  ];

  return (
    <div className="bg-dashboard-card rounded-2xl p-8 border border-white/10 hover:border-white/20 transition-all duration-300 hover:transform hover:-translate-y-1">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-poppins font-bold text-white mb-2">
            Performance Overview
          </h2>
          <p className="text-white/60">
            Your overall performance across all challenges
          </p>
        </div>
        <div className={`flex items-center space-x-2 px-3 py-1 rounded-full ${
          mockData.trend === 'up' ? 'bg-green-500/20 text-green-400' : 
          mockData.trend === 'down' ? 'bg-red-500/20 text-red-400' : 
          'bg-yellow-500/20 text-yellow-400'
        }`}>
          {mockData.trend === 'up' ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
          <span className="text-sm font-medium">
            {mockData.trend === 'up' ? '+' : ''}{mockData.trendPercentage}%
          </span>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Main Score Circle */}
        <div className="flex items-center justify-center">
          <div className="relative w-48 h-48">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="45"
                stroke="rgba(255,255,255,0.1)"
                strokeWidth="6"
                fill="none"
              />
              <circle
                cx="50"
                cy="50"
                r="45"
                stroke="url(#gradient)"
                strokeWidth="6"
                fill="none"
                strokeLinecap="round"
                strokeDasharray={`${isVisible ? mockData.overallScore * 2.83 : 0} 283`}
                className="transition-all duration-2000 ease-out"
              />
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#00A8FF" />
                  <stop offset="100%" stopColor="#05FDD1" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="text-5xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                <CountUp end={isVisible ? mockData.overallScore : 0} duration={2000} />
              </div>
              <div className="text-white/60 text-sm font-medium">Overall Score</div>
              <div className={`text-xs mt-1 ${
                mockData.recentChange > 0 ? 'text-green-400' : 
                mockData.recentChange < 0 ? 'text-red-400' : 'text-yellow-400'
              }`}>
                {mockData.recentChange > 0 ? '+' : ''}{mockData.recentChange} this week
              </div>
            </div>
          </div>
        </div>

        {/* Sub-scores */}
        <div className="space-y-4">
          {subScoreItems.map((item, index) => {
            const Icon = item.icon;
            const score = mockData.subScores[item.key];
            
            return (
              <div 
                key={item.key}
                className="group bg-white/5 rounded-xl p-4 hover:bg-white/10 transition-all duration-300"
                style={{ 
                  animationDelay: `${index * 100}ms`,
                  animation: isVisible ? 'fadeInUp 0.6s ease-out forwards' : 'none'
                }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 rounded-lg bg-gradient-to-r ${item.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                      <Icon size={20} className="text-white" />
                    </div>
                    <span className="font-medium text-white">{item.label}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-bold text-white">
                      <CountUp end={isVisible ? score : 0} duration={1500} delay={index * 100} />
                    </div>
                    <div className="w-16 h-2 bg-white/10 rounded-full overflow-hidden mt-1">
                      <div 
                        className={`h-full bg-gradient-to-r ${item.color} rounded-full transition-all duration-1000 ease-out`}
                        style={{ 
                          width: isVisible ? `${score}%` : '0%',
                          transitionDelay: `${index * 100}ms`
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default PerformanceOverview;