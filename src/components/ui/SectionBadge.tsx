import React from 'react';
import { DivideIcon as LucideIcon } from 'lucide-react';

interface SectionBadgeProps {
  icon: LucideIcon;
  text: string;
  variant?: 'primary' | 'secondary' | 'accent' | 'warning';
}

const SectionBadge: React.FC<SectionBadgeProps> = ({ 
  icon: Icon, 
  text, 
  variant = 'primary' 
}) => {
  const variantStyles = {
    primary: 'bg-primary/10 text-primary',
    secondary: 'bg-gray-100 text-gray-700',
    accent: 'bg-accent/10 text-accent',
    warning: 'bg-red-50 text-red-700',
  };

  return (
    <div className={`inline-flex items-center space-x-2 px-4 py-2 rounded-full mb-6 ${variantStyles[variant]}`}>
      <Icon size={16} />
      <span className="font-medium text-sm">{text}</span>
    </div>
  );
};

export default SectionBadge;