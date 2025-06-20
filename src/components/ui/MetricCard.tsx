import React from 'react';
import { DivideIcon as LucideIcon } from 'lucide-react';

interface MetricCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  description?: string;
  color?: string;
  bgColor?: string;
  size?: 'sm' | 'md' | 'lg';
}

const MetricCard: React.FC<MetricCardProps> = ({
  icon: Icon,
  label,
  value,
  description,
  color = 'text-primary',
  bgColor = 'bg-primary/10',
  size = 'md'
}) => {
  const sizeConfig = {
    sm: { icon: 'w-8 h-8', iconSize: 16, text: 'text-lg', card: 'p-4' },
    md: { icon: 'w-12 h-12', iconSize: 24, text: 'text-2xl', card: 'p-6' },
    lg: { icon: 'w-16 h-16', iconSize: 32, text: 'text-3xl', card: 'p-8' },
  };

  return (
    <div className={`bg-white/5 backdrop-blur-sm rounded-lg border border-white/10 ${sizeConfig[size].card}`}>
      <div className={`${sizeConfig[size].icon} ${bgColor} rounded-lg flex items-center justify-center mb-4`}>
        <Icon size={sizeConfig[size].iconSize} className={color} />
      </div>
      <div className={`${sizeConfig[size].text} font-bold mb-2`}>
        <span className={color}>{value}</span>
        {typeof value === 'number' && size !== 'sm' && (
          <span className="text-gray-400">/100</span>
        )}
      </div>
      <div className="text-gray-400 text-sm">{label}</div>
      {description && (
        <div className="text-gray-500 text-xs mt-1">{description}</div>
      )}
    </div>
  );
};

export default MetricCard;