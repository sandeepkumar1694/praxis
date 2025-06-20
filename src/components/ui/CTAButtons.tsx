import React from 'react';
import { DivideIcon as LucideIcon } from 'lucide-react';

interface CTAButton {
  text: string;
  variant: 'primary' | 'secondary';
  icon?: LucideIcon;
  onClick?: () => void;
}

interface CTAButtonsProps {
  buttons: CTAButton[];
  layout?: 'horizontal' | 'vertical';
  fullWidth?: boolean;
}

const CTAButtons: React.FC<CTAButtonsProps> = ({ 
  buttons, 
  layout = 'horizontal',
  fullWidth = false 
}) => {
  const containerClass = layout === 'horizontal' 
    ? 'flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6'
    : 'flex flex-col items-center space-y-4';

  return (
    <div className={containerClass}>
      {buttons.map((button, index) => {
        const Icon = button.icon;
        const baseClass = `group ${fullWidth ? 'w-full sm:w-auto' : ''} px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 flex items-center justify-center space-x-2`;
        
        const variantClass = button.variant === 'primary'
          ? 'bg-primary text-white hover:bg-blue-600 hover:scale-105'
          : 'border-2 border-primary text-primary hover:bg-primary hover:text-white';

        return (
          <button
            key={index}
            onClick={button.onClick}
            className={`${baseClass} ${variantClass}`}
          >
            <span>{button.text}</span>
            {Icon && (
              <Icon size={20} className="group-hover:translate-x-1 transition-transform duration-300" />
            )}
          </button>
        );
      })}
    </div>
  );
};

export default CTAButtons;