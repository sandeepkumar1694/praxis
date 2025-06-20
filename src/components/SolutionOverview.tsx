import React from 'react';
import { Code, Target, Shield, Award } from 'lucide-react';

const SolutionOverview: React.FC = () => {
  const solutions = [
    {
      icon: Code,
      title: 'Real-World Challenges',
      description: 'Work on actual problems that mirror day-to-day engineering tasks, not abstract algorithms.',
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-500',
    },
    {
      icon: Target,
      title: 'Skill-Based Assessment',
      description: 'Demonstrate your expertise through practical implementations and architectural decisions.',
      color: 'from-green-500 to-emerald-500',
      bgColor: 'bg-green-50',
      iconColor: 'text-green-500',
    },
    {
      icon: Shield,
      title: 'Bias-Free Evaluation',
      description: 'Automated scoring based on code quality, functionality, and best practices.',
      color: 'from-purple-500 to-violet-500',
      bgColor: 'bg-purple-50',
      iconColor: 'text-purple-500',
    },
  ];

  return (
    <section className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16 animate-on-scroll">
          <div className="inline-flex items-center space-x-2 px-4 py-2 bg-primary/10 rounded-full mb-6">
            <Award size={16} className="text-primary" />
            <span className="text-primary font-medium text-sm">The Solution</span>
          </div>

          <h2 className="text-4xl md:text-5xl font-poppins font-bold text-text-primary mb-6 leading-tight">
            Skills Over 
            <span className="gradient-text"> Performance Theater</span>
          </h2>

          <p className="text-xl text-text-secondary max-w-3xl mx-auto leading-relaxed">
            Praxis revolutionizes technical hiring by focusing on what actually matters: 
            your ability to solve real problems and write quality code.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {solutions.map((solution, index) => (
            <div
              key={index}
              className="group hover-lift bg-white rounded-2xl p-8 text-center animate-on-scroll"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <div className={`w-16 h-16 ${solution.bgColor} rounded-xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300`}>
                <solution.icon size={32} className={solution.iconColor} />
              </div>

              <h3 className="text-xl font-poppins font-bold text-text-primary mb-4">
                {solution.title}
              </h3>

              <p className="text-text-secondary leading-relaxed mb-6">
                {solution.description}
              </p>

              <div className={`h-1 bg-gradient-to-r ${solution.color} rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300`} />
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16 animate-on-scroll">
          <button className="group inline-flex items-center space-x-2 px-8 py-4 bg-primary text-white rounded-lg font-semibold text-lg hover:bg-blue-600 transition-all duration-300 hover:scale-105">
            <span>See How It Works</span>
            <Award size={20} className="group-hover:rotate-12 transition-transform duration-300" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default SolutionOverview;