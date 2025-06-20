import React, { useEffect, useState } from 'react';
import { TrendingUp, Target, Award, Zap } from 'lucide-react';

const PerformanceScore: React.FC = () => {
  const [animatedScores, setAnimatedScores] = useState({
    overall: 0,
    code: 0,
    architecture: 0,
    performance: 0,
  });

  const finalScores = {
    overall: 94,
    code: 96,
    architecture: 92,
    performance: 98,
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedScores(finalScores);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const metrics = [
    {
      icon: Target,
      label: 'Code Quality',
      score: animatedScores.code,
      color: 'text-green-400',
      bgColor: 'bg-green-400/20',
    },
    {
      icon: Award,
      label: 'Architecture',
      score: animatedScores.architecture,
      color: 'text-blue-400',
      bgColor: 'bg-blue-400/20',
    },
    {
      icon: Zap,
      label: 'Performance',
      score: animatedScores.performance,
      color: 'text-accent',
      bgColor: 'bg-accent/20',
    },
  ];

  return (
    <section className="py-24 bg-dark-bg text-white relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Column - Content */}
          <div className="animate-on-scroll">
            <div className="inline-flex items-center space-x-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full mb-6 border border-white/20">
              <TrendingUp size={16} className="text-accent" />
              <span className="text-accent font-medium text-sm">Performance Analytics</span>
            </div>

            <h2 className="text-4xl md:text-5xl font-poppins font-bold mb-6 leading-tight">
              Real-Time 
              <span className="gradient-text"> Performance Insights</span>
            </h2>

            <p className="text-xl text-gray-300 mb-8 leading-relaxed">
              Get detailed feedback on every aspect of your code, from algorithmic efficiency 
              to architectural decisions. Our AI-powered analysis provides actionable insights 
              to help you improve.
            </p>

            {/* Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {metrics.map((metric, index) => (
                <div key={index} className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10">
                  <div className={`w-12 h-12 ${metric.bgColor} rounded-lg flex items-center justify-center mb-4`}>
                    <metric.icon size={24} className={metric.color} />
                  </div>
                  <div className="text-2xl font-bold mb-2">
                    <span className={metric.color}>{metric.score}</span>
                    <span className="text-gray-400">/100</span>
                  </div>
                  <div className="text-gray-400 text-sm">{metric.label}</div>
                </div>
              ))}
            </div>

            <div className="flex items-center space-x-4">
              <button className="px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-blue-600 transition-colors duration-200">
                View Full Report
              </button>
              <button className="px-6 py-3 border border-white/20 text-white rounded-lg font-medium hover:bg-white/10 transition-colors duration-200">
                Compare Scores
              </button>
            </div>
          </div>

          {/* Right Column - Dashboard */}
          <div className="animate-on-scroll">
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
              {/* Overall Score Circle */}
              <div className="text-center mb-8">
                <div className="relative w-48 h-48 mx-auto">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      stroke="rgba(255,255,255,0.1)"
                      strokeWidth="8"
                      fill="none"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      stroke="url(#gradient)"
                      strokeWidth="8"
                      fill="none"
                      strokeLinecap="round"
                      strokeDasharray={`${animatedScores.overall * 2.83} 283`}
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
                    <div className="text-4xl font-bold gradient-text">{animatedScores.overall}</div>
                    <div className="text-gray-400 text-sm">Overall Score</div>
                  </div>
                </div>
              </div>

              {/* Detailed Breakdown */}
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                  <span className="text-gray-300">Time Complexity</span>
                  <span className="text-accent font-mono">O(n log n)</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                  <span className="text-gray-300">Memory Usage</span>
                  <span className="text-green-400 font-mono">2.3 MB</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                  <span className="text-gray-300">Code Coverage</span>
                  <span className="text-blue-400 font-mono">98%</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                  <span className="text-gray-300">Best Practices</span>
                  <span className="text-accent font-mono">Excellent</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PerformanceScore;