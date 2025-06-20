import React from 'react';
import { AlertCircle, Clock, Users, TrendingDown } from 'lucide-react';

const ProblemStatement: React.FC = () => {
  const problems = [
    {
      icon: AlertCircle,
      title: 'Whiteboard Anxiety',
      description: 'Talented developers freeze up in artificial coding environments that bear no resemblance to real work.',
    },
    {
      icon: Clock,
      title: 'Time Wasted',
      description: 'Months of interview prep for algorithmic puzzles you\'ll never use on the job.',
    },
    {
      icon: Users,
      title: 'Bias & Inconsistency',
      description: 'Subjective evaluations that vary wildly between interviewers and companies.',
    },
    {
      icon: TrendingDown,
      title: 'Missed Opportunities',
      description: 'Great engineers rejected based on interview performance, not actual ability.',
    },
  ];

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Column - Content */}
          <div className="animate-on-scroll">
            <div className="inline-flex items-center space-x-2 px-4 py-2 bg-red-50 rounded-full mb-6">
              <AlertCircle size={16} className="text-red-500" />
              <span className="text-red-700 font-medium text-sm">The Problem</span>
            </div>

            <h2 className="text-4xl md:text-5xl font-poppins font-bold text-text-primary mb-6 leading-tight">
              Traditional Hiring Is 
              <span className="text-red-500"> Fundamentally Broken</span>
            </h2>

            <p className="text-xl text-text-secondary mb-8 leading-relaxed">
              The current interview process doesn't just fail candidates—it fails companies. 
              You're losing incredible talent because of outdated methods that have nothing 
              to do with real-world engineering skills.
            </p>

            <div className="space-y-6">
              {problems.map((problem, index) => (
                <div 
                  key={index}
                  className="flex items-start space-x-4 p-4 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                >
                  <div className="flex-shrink-0 w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                    <problem.icon size={24} className="text-red-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-text-primary mb-2">{problem.title}</h3>
                    <p className="text-text-secondary">{problem.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column - Visual */}
          <div className="animate-on-scroll relative">
            <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-2xl p-8 relative overflow-hidden">
              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-10">
                {[...Array(12)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute w-4 h-4 border-2 border-red-400 rotate-45"
                    style={{
                      left: `${20 + (i % 4) * 20}%`,
                      top: `${20 + Math.floor(i / 4) * 25}%`,
                    }}
                  />
                ))}
              </div>

              {/* Content */}
              <div className="relative z-10 text-center">
                <div className="w-20 h-20 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <TrendingDown size={40} className="text-white" />
                </div>
                
                <h3 className="text-2xl font-poppins font-bold text-text-primary mb-4">
                  Only 23% of developers feel confident in traditional interviews
                </h3>
                
                <p className="text-text-secondary mb-6">
                  Yet 89% excel when given real-world challenges that match their daily work.
                </p>

                <div className="grid grid-cols-2 gap-4 mt-8">
                  <div className="bg-white rounded-lg p-4 shadow-sm">
                    <div className="text-2xl font-bold text-red-500 mb-1">77%</div>
                    <div className="text-sm text-text-secondary">Interview Anxiety</div>
                  </div>
                  <div className="bg-white rounded-lg p-4 shadow-sm">
                    <div className="text-2xl font-bold text-red-500 mb-1">6 months</div>
                    <div className="text-sm text-text-secondary">Average Prep Time</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProblemStatement;