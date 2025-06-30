import React from 'react';
import { Bot, MessageCircle, Lightbulb, Calendar, Star } from 'lucide-react';
import AuthenticatedLayout from '../layout/AuthenticatedLayout';

const AITeamLeadPage: React.FC = () => {
  const features = [
    {
      icon: MessageCircle,
      title: 'Code Reviews',
      description: 'Get detailed code reviews and suggestions for improvement from your AI team lead.'
    },
    {
      icon: Lightbulb,
      title: 'Architecture Guidance',
      description: 'Discuss system design and architectural decisions with expert AI insights.'
    },
    {
      icon: Calendar,
      title: '1-on-1 Sessions',
      description: 'Schedule regular check-ins to discuss your progress and career development.'
    },
    {
      icon: Star,
      title: 'Skill Development',
      description: 'Receive personalized learning paths and skill development recommendations.'
    }
  ];

  return (
    <AuthenticatedLayout>
      <div className="container mx-auto px-6 py-8 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Bot size={40} className="text-white" />
          </div>
          <h1 className="text-4xl font-poppins font-bold text-white mb-4">
            AI Team Lead
          </h1>
          <div className="inline-flex items-center space-x-2 px-4 py-2 bg-accent/20 text-accent rounded-full mb-4">
            <span className="text-sm font-medium">Coming Soon</span>
          </div>
          <p className="text-xl text-white/60 max-w-2xl mx-auto">
            Your personal AI mentor and team lead. Get guidance, feedback, and support 
            whenever you need it, just like having a senior developer by your side.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-dashboard-card rounded-2xl p-6 border border-white/10 hover:border-white/20 transition-all duration-300"
            >
              <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center mb-4">
                <feature.icon size={24} className="text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">
                {feature.title}
              </h3>
              <p className="text-white/60">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* What to Expect */}
        <div className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 rounded-2xl p-8 mb-8">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">
            What to Expect
          </h2>
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-indigo-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-white text-xs font-bold">✓</span>
              </div>
              <div>
                <h4 className="font-semibold text-white mb-1">Personalized Mentorship</h4>
                <p className="text-white/70">
                  Your AI team lead will learn your coding style, strengths, and areas for improvement 
                  to provide tailored guidance.
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-indigo-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-white text-xs font-bold">✓</span>
              </div>
              <div>
                <h4 className="font-semibold text-white mb-1">24/7 Availability</h4>
                <p className="text-white/70">
                  Get help whenever you need it. Your AI team lead is always available to discuss 
                  code, architecture, or career advice.
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-indigo-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-white text-xs font-bold">✓</span>
              </div>
              <div>
                <h4 className="font-semibold text-white mb-1">Real-world Experience</h4>
                <p className="text-white/70">
                  Learn from industry best practices and real-world scenarios with guidance 
                  from an AI trained on millions of code reviews.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Get Notified */}
        <div className="bg-dashboard-card rounded-2xl p-8 border border-white/10 text-center">
          <h3 className="text-2xl font-bold text-white mb-4">
            Be the First to Know
          </h3>
          <p className="text-white/60 mb-6">
            Join our waitlist to get early access to the AI Team Lead feature. 
            We'll notify you as soon as it's available.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 h-12 px-4 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50"
            />
            <button className="h-12 px-6 bg-indigo-500 text-white rounded-lg font-medium hover:bg-indigo-600 transition-colors duration-200">
              Join Waitlist
            </button>
          </div>
          <p className="text-xs text-white/40 mt-4">
            We'll only use your email to notify you about the AI Team Lead launch.
          </p>
        </div>

        {/* Contact Info */}
        <div className="mt-8 p-6 bg-white/5 rounded-xl border border-white/10">
          <h4 className="font-semibold text-white mb-2 flex items-center space-x-2">
            <MessageCircle size={16} />
            <span>Questions or Feedback?</span>
          </h4>
          <p className="text-white/60 text-sm">
            Have questions about the AI Team Lead feature? Feel free to reach out to us anytime. 
            We're here to help you succeed in your coding journey.
          </p>
        </div>
      </div>
    </AuthenticatedLayout>
  );
};

export default AITeamLeadPage;