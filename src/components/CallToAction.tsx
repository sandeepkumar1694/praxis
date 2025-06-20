import React from 'react';
import { ArrowRight, Star, Users, CheckCircle } from 'lucide-react';

const CallToAction: React.FC = () => {
  const benefits = [
    'Skip the algorithmic puzzles',
    'Work on real-world challenges',
    'Get detailed performance feedback',
    'Connect directly with top companies',
  ];

  return (
    <section className="py-24 bg-gradient-to-br from-primary to-blue-600 text-white relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-full opacity-10">
          {[...Array(30)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full animate-pulse-slow"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 4}s`,
              }}
            />
          ))}
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
        <div className="animate-on-scroll">
          {/* Social Proof */}
          <div className="flex items-center justify-center space-x-6 mb-8">
            <div className="flex items-center space-x-2">
              <div className="flex -space-x-2">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="w-8 h-8 bg-white/20 rounded-full border-2 border-white" />
                ))}
              </div>
              <span className="text-sm">Trusted by 10,000+ developers</span>
            </div>
            <div className="flex items-center space-x-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={16} className="text-yellow-300 fill-current" />
              ))}
              <span className="text-sm ml-2">4.9/5 rating</span>
            </div>
          </div>

          <h2 className="text-4xl md:text-6xl font-poppins font-bold mb-6 leading-tight">
            Ready to Show What You Can 
            <span className="text-accent"> Really Do?</span>
          </h2>

          <p className="text-xl md:text-2xl mb-8 opacity-90 max-w-2xl mx-auto leading-relaxed">
            Join thousands of developers who've landed their dream jobs by demonstrating 
            real skills, not memorized algorithms.
          </p>

          {/* Benefits */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12 max-w-2xl mx-auto">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-center space-x-3 text-left">
                <CheckCircle size={20} className="text-accent flex-shrink-0" />
                <span className="text-white/90">{benefit}</span>
              </div>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6 mb-12">
            <button className="group w-full sm:w-auto px-8 py-4 bg-white text-primary rounded-lg font-bold text-lg hover:bg-gray-100 transition-all duration-300 flex items-center justify-center space-x-2 hover:scale-105">
              <span>Start Your Free Assessment</span>
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform duration-300" />
            </button>
            
            <button className="w-full sm:w-auto px-8 py-4 border-2 border-white text-white rounded-lg font-bold text-lg hover:bg-white/10 transition-all duration-300">
              Talk to Sales
            </button>
          </div>

          {/* Trust Indicators */}
          <div className="text-center">
            <p className="text-white/70 text-sm mb-4">Free to start • No credit card required • 5-minute setup</p>
            <div className="flex items-center justify-center space-x-8 text-white/60">
              <div className="flex items-center space-x-2">
                <Users size={16} />
                <span className="text-sm">500+ hiring partners</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle size={16} />
                <span className="text-sm">GDPR compliant</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;