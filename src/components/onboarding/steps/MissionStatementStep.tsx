import React from 'react';
import { Target, CheckCircle } from 'lucide-react';
import { OnboardingData, ValidationErrors } from '../../../types/onboarding';

interface MissionStatementStepProps {
  data: Partial<OnboardingData>;
  errors: ValidationErrors;
  onChange: (field: keyof OnboardingData, value: string | boolean) => void;
}

const MissionStatementStep: React.FC<MissionStatementStepProps> = ({ data, errors, onChange }) => {
  const goals = [
    'Land my first tech job',
    'Switch to a top-tier company',
    'Build a strong portfolio',
    'Master new technologies'
  ];

  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-gradient-to-r from-primary to-accent rounded-xl flex items-center justify-center mx-auto mb-4">
          <Target size={32} className="text-white" />
        </div>
        <h2 className="text-3xl font-poppins font-bold text-text-primary mb-2">
          Set Your Mission
        </h2>
        <p className="text-text-secondary">
          Define your goals and commit to excellence in the Praxis experience
        </p>
      </div>

      <div className="space-y-6">
        {/* Goal Selector */}
        <div>
          <label htmlFor="primaryGoal" className="block text-sm font-medium text-text-primary mb-3">
            What is your primary goal in The Crucible? *
          </label>
          <select
            id="primaryGoal"
            value={data.primaryGoal || ''}
            onChange={(e) => onChange('primaryGoal', e.target.value)}
            className={`w-full h-12 px-4 border rounded-lg font-inter text-base focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors duration-200 ${
              errors.primaryGoal ? 'border-red-500' : 'border-secondary'
            }`}
            aria-describedby={errors.primaryGoal ? 'primaryGoal-error' : undefined}
          >
            <option value="">Select your primary goal</option>
            {goals.map((goal, index) => (
              <option key={index} value={goal}>
                {goal}
              </option>
            ))}
          </select>
          {errors.primaryGoal && (
            <p id="primaryGoal-error" className="mt-2 text-sm text-red-500">
              {errors.primaryGoal}
            </p>
          )}
        </div>

        {/* Terms Agreement */}
        <div className="bg-gray-50 rounded-xl p-6 border border-secondary">
          <div className="flex items-start space-x-4">
            <button
              type="button"
              onClick={() => onChange('termsAgreed', !data.termsAgreed)}
              className={`flex-shrink-0 w-6 h-6 rounded border-2 flex items-center justify-center transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:ring-offset-2 ${
                data.termsAgreed
                  ? 'bg-primary border-primary'
                  : errors.termsAgreed
                  ? 'border-red-500'
                  : 'border-secondary hover:border-primary/50'
              }`}
              aria-checked={data.termsAgreed}
              aria-describedby={errors.termsAgreed ? 'terms-error' : undefined}
              role="checkbox"
            >
              {data.termsAgreed && (
                <CheckCircle size={16} className="text-white" />
              )}
            </button>
            
            <div className="flex-1">
              <label 
                htmlFor="termsAgreed" 
                className="text-sm text-text-primary leading-relaxed cursor-pointer"
                onClick={() => onChange('termsAgreed', !data.termsAgreed)}
              >
                I agree to the{' '}
                <a 
                  href="#" 
                  className="text-primary hover:underline font-medium"
                  onClick={(e) => e.stopPropagation()}
                >
                  Praxis Terms of Service
                </a>{' '}
                and commit to giving my best effort in the simulation. I understand that this 
                experience is designed to challenge me and help demonstrate my real-world capabilities.
              </label>
            </div>
          </div>
          
          {errors.termsAgreed && (
            <p id="terms-error" className="mt-3 text-sm text-red-500">
              {errors.termsAgreed}
            </p>
          )}
        </div>

        {/* Motivational Message */}
        <div className="bg-gradient-to-r from-primary/5 to-accent/5 rounded-xl p-6 border border-primary/20">
          <div className="text-center">
            <h3 className="font-poppins font-semibold text-text-primary mb-2">
              You're About to Enter The Crucible
            </h3>
            <p className="text-sm text-text-secondary leading-relaxed">
              The next phase will test your skills through real-world challenges. 
              Your performance here will directly influence the opportunities you receive. 
              Bring your A-game and show what you're truly capable of.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MissionStatementStep;