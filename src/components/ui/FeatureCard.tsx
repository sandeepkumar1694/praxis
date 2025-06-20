import React from 'react';
import { LucideIcon } from 'lucide-react';

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  color?: string;
  bgColor?: string;
  iconColor?: string;
  children?: React.ReactNode;
  variant?: 'default' | 'hover-lift';
}

const FeatureCard: React.FC<FeatureCardProps> = ({
  icon: Icon,
  title,
  description,
  color = 'from-blue-500 to-cyan-500',
  bgColor = 'bg-blue-50',
  iconColor = 'text-blue-500',
  children,
  variant = 'hover-lift'
}) => {
  const cardClass = variant === 'hover-lift' 
    ? 'group hover-lift bg-white rounded-2xl p-8 text-center animate-on-scroll'
    : 'bg-white rounded-2xl p-8 text-center animate-on-scroll';

  return (
    <div className={cardClass}>
      <div className={`w-16 h-16 ${bgColor} rounded-xl flex items-center justify-center mx-auto mb-6 ${variant === 'hover-lift' ? 'group-hover:scale-110' : ''} transition-transform duration-300`}>
        <Icon size={32} className={iconColor} />
      </div>

      <h3 className="text-xl font-poppins font-bold text-text-primary mb-4">
        {title}
      </h3>

      <p className="text-text-secondary leading-relaxed mb-6">
        {description}
      </p>

      {children}

      <div className={`h-1 bg-gradient-to-r ${color} rounded-full transform scale-x-0 ${variant === 'hover-lift' ? 'group-hover:scale-x-100' : ''} transition-transform duration-300`} />
    </div>
  );
};

export default FeatureCard;