import React from 'react';

interface CircularProgressProps {
  value: number;
  maxValue?: number;
  size?: 'sm' | 'md' | 'lg';
  label?: string;
  sublabel?: string;
  color?: string;
  backgroundColor?: string;
}

const CircularProgress: React.FC<CircularProgressProps> = ({
  value,
  maxValue = 100,
  size = 'md',
  label,
  sublabel,
  color = 'url(#gradient)',
  backgroundColor = 'rgba(255,255,255,0.1)'
}) => {
  const sizeConfig = {
    sm: { dimension: 'w-24 h-24', radius: 35, strokeWidth: 6, textSize: 'text-lg' },
    md: { dimension: 'w-48 h-48', radius: 45, strokeWidth: 8, textSize: 'text-4xl' },
    lg: { dimension: 'w-64 h-64', radius: 55, strokeWidth: 10, textSize: 'text-5xl' },
  };

  const config = sizeConfig[size];
  const normalizedValue = Math.min(value, maxValue);
  const percentage = (normalizedValue / maxValue) * 100;
  const circumference = 2 * Math.PI * config.radius;
  const strokeDasharray = `${(percentage / 100) * circumference} ${circumference}`;

  return (
    <div className="relative flex items-center justify-center">
      <svg className={`${config.dimension} transform -rotate-90`} viewBox="0 0 100 100">
        <circle
          cx="50"
          cy="50"
          r={config.radius}
          stroke={backgroundColor}
          strokeWidth={config.strokeWidth}
          fill="none"
        />
        <circle
          cx="50"
          cy="50"
          r={config.radius}
          stroke={color}
          strokeWidth={config.strokeWidth}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={strokeDasharray}
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
        <div className={`${config.textSize} font-bold gradient-text`}>
          {normalizedValue}
        </div>
        {label && (
          <div className="text-gray-400 text-sm">{label}</div>
        )}
        {sublabel && (
          <div className="text-gray-500 text-xs">{sublabel}</div>
        )}
      </div>
    </div>
  );
};

export default CircularProgress;