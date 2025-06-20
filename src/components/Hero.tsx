import React, { useEffect, useState } from 'react';
import { ChevronDown, Play, Zap } from 'lucide-react';

const Hero: React.FC = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const floatingElements = [
    { icon: Zap, delay: '0s', position: 'top-1/4 left-1/4' },
    { icon: Play, delay: '2s', position: 'top-1/3 right-1/4' },
    { icon: Zap, delay: '4s', position: 'bottom-1/3 left-1/3' },
  ];

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden plexus-bg">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-accent rounded-full animate-pulse-slow"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 4}s`,
            }}
          />
        ))}
      </div>

      {/* Floating Elements */}
      {floatingElements.map((element, index) => (
        <div
          key={index}
          className={`absolute ${element.position} animate-float opacity-20`}
          style={{ animationDelay: element.delay }}
        >
          <element.icon size={48} className="text-primary" />
        </div>
      ))}

      {/* Main Content */}
      <div className="relative z-10 text-center max-w-5xl mx-auto px-6">
        <div className="animate-fade-in-up">
          <div className="inline-flex items-center space-x-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full mb-8 border border-white/20">
            <div className="w-2 h-2 bg-accent rounded-full animate-pulse" />
            <span className="text-text-secondary font-medium">Next-generation hiring platform</span>
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-poppins font-bold mb-6 leading-tight">
            <span className="block text-text-primary">Interviews Are</span>
            <span className="block gradient-text">Broken.</span>
            <span className="block text-text-primary">Prove Your Skill.</span>
          </h1>

          <p className="text-xl md:text-2xl text-text-secondary mb-12 max-w-3xl mx-auto leading-relaxed">
            Skip the whiteboard. Skip the stress. Demonstrate your real abilities with 
            hands-on challenges that actually matter to top engineering teams.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6 mb-16">
            <button className="group px-8 py-4 bg-primary text-white rounded-lg font-semibold text-lg hover:bg-blue-600 transition-all duration-300 flex items-center space-x-2 hover:scale-105">
              <span>Start Your Assessment</span>
              <Play size={20} className="group-hover:translate-x-1 transition-transform duration-300" />
            </button>
            
            <button className="px-8 py-4 border-2 border-primary text-primary rounded-lg font-semibold text-lg hover:bg-primary hover:text-white transition-all duration-300">
              Watch Demo
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-poppins font-bold text-primary mb-2">2.5M+</div>
              <div className="text-text-secondary">Assessments Completed</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-poppins font-bold text-primary mb-2">95%</div>
              <div className="text-text-secondary">Candidate Satisfaction</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-poppins font-bold text-primary mb-2">500+</div>
              <div className="text-text-secondary">Partner Companies</div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <ChevronDown size={32} className="text-text-secondary" />
      </div>

      {/* Interactive Cursor Effect */}
      <div
        className="absolute w-96 h-96 bg-gradient-to-r from-primary/20 to-accent/20 rounded-full blur-3xl pointer-events-none transition-all duration-300 ease-out"
        style={{
          left: mousePosition.x - 192,
          top: mousePosition.y - 192,
        }}
      />
    </section>
  );
};

export default Hero;