import React, { useEffect, useState } from 'react';
import { CheckCircle, Sparkles } from 'lucide-react';

interface CompletionStepProps {
  onComplete: () => void;
}

const CompletionStep: React.FC<CompletionStepProps> = ({ onComplete }) => {
  const [countdown, setCountdown] = useState(3);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    setIsAnimating(true);
    
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setTimeout(() => onComplete(), 500);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <div className="space-y-8 text-center">
      {/* Success Animation */}
      <div className={`transition-all duration-1000 ${isAnimating ? 'scale-100 opacity-100' : 'scale-50 opacity-0'}`}>
        <div className="relative w-32 h-32 mx-auto mb-6">
          <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent rounded-full animate-pulse"></div>
          <div className="absolute inset-2 bg-white rounded-full flex items-center justify-center">
            <CheckCircle size={48} className="text-primary" />
          </div>
          
          {/* Floating sparkles */}
          <div className="absolute -top-4 -left-4 animate-bounce" style={{ animationDelay: '0.5s' }}>
            <Sparkles size={16} className="text-accent" />
          </div>
          <div className="absolute -top-2 -right-6 animate-bounce" style={{ animationDelay: '1s' }}>
            <Sparkles size={12} className="text-primary" />
          </div>
          <div className="absolute -bottom-4 -right-2 animate-bounce" style={{ animationDelay: '1.5s' }}>
            <Sparkles size={14} className="text-accent" />
          </div>
        </div>
      </div>

      <div className={`transition-all duration-1000 delay-500 ${isAnimating ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
        <h2 className="text-4xl font-poppins font-bold text-text-primary mb-4">
          Welcome to Praxis!
        </h2>
        <p className="text-xl text-text-secondary mb-8 max-w-md mx-auto">
          Your profile is complete. Get ready to showcase your skills and land your dream job.
        </p>

        {/* Loading Animation */}
        <div className="flex items-center justify-center space-x-2 mb-6">
          <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
        </div>

        <p className="text-text-secondary">
          Redirecting to your dashboard in {countdown} seconds...
        </p>
      </div>

      {/* Background particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-accent rounded-full opacity-30 animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default CompletionStep;