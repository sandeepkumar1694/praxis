import React from 'react';
import { CheckCircle } from 'lucide-react';

interface Benefit {
  text: string;
  icon?: React.ReactNode;
}

interface BenefitsListProps {
  benefits: (string | Benefit)[];
  columns?: 1 | 2;
  iconColor?: string;
}

const BenefitsList: React.FC<BenefitsListProps> = ({ 
  benefits, 
  columns = 2,
  iconColor = 'text-accent' 
}) => {
  const gridClass = columns === 2 ? 'grid grid-cols-1 md:grid-cols-2 gap-4' : 'space-y-3';

  return (
    <div className={gridClass}>
      {benefits.map((benefit, index) => {
        const isString = typeof benefit === 'string';
        const text = isString ? benefit : benefit.text;
        const icon = isString ? <CheckCircle size={20} className={iconColor} /> : benefit.icon;

        return (
          <div key={index} className="flex items-center space-x-3 text-left">
            <div className="flex-shrink-0">
              {icon}
            </div>
            <span className="text-white/90">{text}</span>
          </div>
        );
      })}
    </div>
  );
};

export default BenefitsList;