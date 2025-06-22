import React from 'react';

interface OnboardingLayoutProps {
  children: React.ReactNode;
}

const OnboardingLayout: React.FC<OnboardingLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {children}
      </div>
    </div>
  );
};

export default OnboardingLayout;