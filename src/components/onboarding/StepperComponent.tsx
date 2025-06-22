import React from 'react';
import { Check } from 'lucide-react';

interface StepperComponentProps {
  currentStep: number;
  totalSteps: number; 
}

const StepperComponent: React.FC<StepperComponentProps> = ({ currentStep, totalSteps }) => {
  return (
    <div className="flex items-center justify-center mb-12">
      <div className="flex items-center space-x-4">
        {Array.from({ length: totalSteps }, (_, index) => {
          const stepNumber = index + 1;
          const isCompleted = stepNumber < currentStep;
          const isCurrent = stepNumber === currentStep;
          
          return (
            <React.Fragment key={stepNumber}>
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                  isCompleted
                    ? 'bg-primary border-primary text-white'
                    : isCurrent
                    ? 'bg-white border-primary text-primary'
                    : 'bg-white border-secondary text-text-secondary'
                }`}
                aria-label={`Step ${stepNumber}${isCompleted ? ' completed' : isCurrent ? ' current' : ''}`}
              >
                {isCompleted ? (
                  <Check size={16} />
                ) : (
                  <span className="text-sm font-medium">{stepNumber}</span>
                )}
              </div>
              
              {stepNumber < totalSteps && (
                <div
                  className={`w-12 h-0.5 transition-all duration-300 ${
                    isCompleted ? 'bg-primary' : 'bg-secondary'
                  }`}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default StepperComponent;