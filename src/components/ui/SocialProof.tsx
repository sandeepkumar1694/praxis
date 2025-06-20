import React from 'react';
import { Star, Users } from 'lucide-react';

interface SocialProofProps {
  userCount?: string;
  rating?: number;
  ratingCount?: string;
  layout?: 'horizontal' | 'vertical';
  variant?: 'light' | 'dark';
}

const SocialProof: React.FC<SocialProofProps> = ({
  userCount = '10,000+',
  rating = 4.9,
  ratingCount = '5',
  layout = 'horizontal',
  variant = 'light'
}) => {
  const containerClass = layout === 'horizontal' 
    ? 'flex items-center justify-center space-x-6'
    : 'flex flex-col items-center space-y-4';

  const textColor = variant === 'light' ? 'text-gray-600' : 'text-white';

  return (
    <div className={containerClass}>
      <div className="flex items-center space-x-2">
        <div className="flex -space-x-2">
          {[...Array(5)].map((_, i) => (
            <div 
              key={i} 
              className={`w-8 h-8 ${variant === 'light' ? 'bg-gray-200' : 'bg-white/20'} rounded-full border-2 ${variant === 'light' ? 'border-white' : 'border-white'}`} 
            />
          ))}
        </div>
        <span className={`text-sm ${textColor}`}>
          Trusted by {userCount} developers
        </span>
      </div>
      
      <div className="flex items-center space-x-1">
        {[...Array(5)].map((_, i) => (
          <Star 
            key={i} 
            size={16} 
            className={`${variant === 'light' ? 'text-yellow-400' : 'text-yellow-300'} fill-current`} 
          />
        ))}
        <span className={`text-sm ml-2 ${textColor}`}>
          {rating}/{ratingCount} rating
        </span>
      </div>
    </div>
  );
};

export default SocialProof;