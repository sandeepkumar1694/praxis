import React from 'react';
import { DivideIcon as LucideIcon } from 'lucide-react';

interface ProblemCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  variant?: 'default' | 'danger';
}

const ProblemCard: React.FC<ProblemCardProps> = ({
  icon: Icon,
  title,
  description,
  variant = 'default'
}) => {
  const variantStyles = {
    default: {
      container: 'hover:bg-gray-50',
      iconBg: 'bg-gray-100',
      iconColor: 'text-gray-500',
    },
    danger: {
      container: 'hover:bg-red-50',
      iconBg: 'bg-red-100',
      iconColor: 'text-red-500',
    },
  };

  const styles = variantStyles[variant];

  return (
    <div className={`flex items-start space-x-4 p-4 rounded-lg transition-colors duration-200 ${styles.container}`}>
      <div className={`flex-shrink-0 w-12 h-12 ${styles.iconBg} rounded-lg flex items-center justify-center`}>
        <Icon size={24} className={styles.iconColor} />
      </div>
      <div>
        <h3 className="font-semibold text-text-primary mb-2">{title}</h3>
        <p className="text-text-secondary">{description}</p>
      </div>
    </div>
  );
};

export default ProblemCard;