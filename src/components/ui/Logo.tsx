import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'color' | 'monochrome';
  showText?: boolean;
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ 
  size = 'md', 
  variant = 'color', 
  showText = true,
  className = ''
}) => {
  const sizeConfig = {
    sm: { icon: 'w-6 h-6', text: 'text-lg' },
    md: { icon: 'w-8 h-8', text: 'text-xl' },
    lg: { icon: 'w-12 h-12', text: 'text-2xl' },
  };

  const iconClass = variant === 'color' 
    ? 'bg-gradient-to-r from-primary to-accent' 
    : 'bg-gradient-to-r from-gray-800 to-gray-600';

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <div className={`${sizeConfig[size].icon} ${iconClass} rounded-lg flex items-center justify-center`}>
        <span className="text-white font-bold text-sm">P</span>
      </div>
      {showText && (
        <span className={`${sizeConfig[size].text} font-poppins font-bold text-text-primary`}>
          Praxis
        </span>
      )}
    </div>
  );
};

export default Logo;