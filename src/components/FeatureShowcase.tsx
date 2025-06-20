import React, { useState } from 'react';
import { Play, Code2, GitBranch, BarChart3, Users, Zap } from 'lucide-react';

const FeatureShowcase: React.FC = () => {
  const [activeDemo, setActiveDemo] = useState(0);

  const features = [
    {
      icon: Code2,
      title: 'Interactive Coding Environment',
      description: 'Full-featured IDE with syntax highlighting, auto-completion, and real-time execution.',
      demo: 'Live coding simulation with multiple languages and frameworks',
      metrics: ['99.9% uptime', '< 100ms latency', '25+ languages'],
    },
    {
      icon: GitBranch,
      title: 'Version Control Integration',
      description: 'Work with real repositories, branches, and pull requests just like in production.',
      demo: 'Git workflow demonstration with branching and merging',
      metrics: ['GitHub integration', 'Team collaboration', 'Code review flow'],
    },
    {
      icon: BarChart3,
      title: 'Performance Analytics',
      description: 'Detailed insights into code quality, efficiency, and architectural decisions.',
      demo: 'Real-time performance metrics and code analysis',
      metrics: ['Code complexity', 'Performance score', 'Best practices'],
    },
    {
      icon: Users,
      title: 'Team Challenges',
      description: 'Collaborative projects that simulate real team dynamics and communication.',
      demo: 'Multi-developer project coordination',
      metrics: ['Team communication', 'Project management', 'Collaboration skills'],
    },
  ];

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16 animate-on-scroll">
          <div className="inline-flex items-center space-x-2 px-4 py-2 bg-accent/10 rounded-full mb-6">
            <Zap size={16} className="text-accent" />
            <span className="text-accent font-medium text-sm">Platform Features</span>
          </div>

          <h2 className="text-4xl md:text-5xl font-poppins font-bold text-text-primary mb-6 leading-tight">
            Everything You Need to 
            <span className="gradient-text"> Showcase Your Skills</span>
          </h2>
        </div>

        {features.map((feature, index) => (
          <div key={index} className={`grid lg:grid-cols-2 gap-16 items-center mb-24 ${
            index % 2 === 1 ? 'lg:grid-flow-col-dense' : ''
          }`}>
            {/* Content */}
            <div className={`animate-on-scroll ${index % 2 === 1 ? 'lg:col-start-2' : ''}`}>
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <feature.icon size={24} className="text-primary" />
                </div>
                <div className="text-sm font-medium text-primary">0{index + 1}</div>
              </div>

              <h3 className="text-3xl font-poppins font-bold text-text-primary mb-4">
                {feature.title}
              </h3>

              <p className="text-xl text-text-secondary mb-8 leading-relaxed">
                {feature.description}
              </p>

              <div className="grid grid-cols-3 gap-4 mb-8">
                {feature.metrics.map((metric, metricIndex) => (
                  <div key={metricIndex} className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-sm font-medium text-text-secondary">{metric}</div>
                  </div>
                ))}
              </div>

              <button className="group inline-flex items-center space-x-2 px-6 py-3 border-2 border-primary text-primary rounded-lg font-medium hover:bg-primary hover:text-white transition-all duration-300">
                <Play size={18} />
                <span>Watch Demo</span>
              </button>
            </div>

            {/* Demo Visualization */}
            <div className={`animate-on-scroll ${index % 2 === 1 ? 'lg:col-start-1' : ''}`}>
              <div className="relative bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-8 overflow-hidden">
                {/* Terminal/IDE Mockup */}
                <div className="flex items-center space-x-2 mb-4">
                  <div className="w-3 h-3 bg-red-400 rounded-full" />
                  <div className="w-3 h-3 bg-yellow-400 rounded-full" />
                  <div className="w-3 h-3 bg-green-400 rounded-full" />
                  <div className="flex-1 text-center text-gray-400 text-sm font-mono">
                    {feature.demo}
                  </div>
                </div>

                {/* Code/Content Area */}
                <div className="bg-gray-800 rounded-lg p-4 min-h-64 font-mono text-sm">
                  <div className="text-green-400">// {feature.demo}</div>
                  <div className="text-gray-400 mt-2">
                    {index === 0 && (
                      <>
                        <div className="text-blue-400">function</div> <span className="text-yellow-400">optimizeQuery</span>
                        <span className="text-white">(data) {'{'}</span>
                        <div className="ml-4 text-gray-300">return data.filter(item ={'>'} item.active)</div>
                        <div className="ml-8 text-gray-300">.sort((a, b) ={'>'} b.score - a.score)</div>
                        <span className="text-white">{'}'}</span>
                      </>
                    )}
                    {index === 1 && (
                      <>
                        <div className="text-green-400">$ git checkout -b feature/new-component</div>
                        <div className="text-blue-400">Switched to a new branch 'feature/new-component'</div>
                        <div className="text-green-400 mt-2">$ git add . && git commit -m "Add component"</div>
                        <div className="text-yellow-400">[feature/new-component abc123] Add component</div>
                      </>
                    )}
                    {index === 2 && (
                      <>
                        <div className="text-accent">Performance Score: 95/100</div>
                        <div className="text-white mt-2">Complexity: O(n log n)</div>
                        <div className="text-green-400">Memory Usage: 2.3MB</div>
                        <div className="text-blue-400">Code Coverage: 98%</div>
                      </>
                    )}
                    {index === 3 && (
                      <>
                        <div className="text-purple-400">Team: 4 developers online</div>
                        <div className="text-white mt-2">📋 Task: Implement user authentication</div>
                        <div className="text-green-400">✅ Database schema - Alice</div>
                        <div className="text-yellow-400">🔄 API endpoints - Bob</div>
                      </>
                    )}
                  </div>
                </div>

                {/* Animated Elements */}
                <div className={`absolute top-4 right-4 w-2 h-2 bg-accent rounded-full animate-pulse ${
                  activeDemo === index ? 'opacity-100' : 'opacity-30'
                }`} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FeatureShowcase;