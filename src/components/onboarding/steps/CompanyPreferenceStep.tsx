import React from 'react';
import { Rocket, Building2, Users } from 'lucide-react';
import { OnboardingData, ValidationErrors } from '../../../types/onboarding';

interface CompanyPreferenceStepProps {
  data: Partial<OnboardingData>;
  errors: ValidationErrors;
  onChange: (field: keyof OnboardingData, value: string) => void;
}

const CompanyPreferenceStep: React.FC<CompanyPreferenceStepProps> = ({ data, errors, onChange }) => {
  const preferences = [
    {
      id: 'startup',
      title: 'Startup',
      description: 'Fast-paced environment with high growth potential and diverse responsibilities',
      icon: Rocket,
      color: 'from-purple-500 to-violet-500',
      benefits: ['High impact work', 'Equity opportunities', 'Rapid learning']
    },
    {
      id: 'product',
      title: 'Product-Based',
      description: 'Focus on building and scaling products used by millions of users worldwide',
      icon: Building2,
      color: 'from-blue-500 to-cyan-500',
      benefits: ['Scale challenges', 'Strong engineering culture', 'Career growth']
    },
    {
      id: 'service',
      title: 'Service-Based',
      description: 'Work on diverse client projects across different industries and technologies',
      icon: Users,
      color: 'from-green-500 to-emerald-500',
      benefits: ['Technology diversity', 'Client interaction', 'Domain expertise']
    }
  ];

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-poppins font-bold text-text-primary mb-2">
          Company Preference
        </h2>
        <p className="text-text-secondary">
          What type of company environment interests you most?
        </p>
      </div>

      <div className="space-y-4">
        {preferences.map((preference) => {
          const Icon = preference.icon;
          const isSelected = data.companyPreference === preference.id;
          
          return (
            <button
              key={preference.id}
              onClick={() => onChange('companyPreference', preference.id)}
              className={`w-full p-6 rounded-xl border-2 text-left transition-all duration-200 hover:scale-[1.02] hover:shadow-lg ${
                isSelected
                  ? 'border-primary bg-primary/5 shadow-lg'
                  : 'border-secondary bg-white hover:border-primary/50'
              }`}
              aria-pressed={isSelected}
              aria-describedby={errors.companyPreference ? 'companyPreference-error' : undefined}
            >
              <div className="flex items-start space-x-4">
                <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${preference.color} flex items-center justify-center flex-shrink-0`}>
                  <Icon size={24} className="text-white" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <h3 className="font-poppins font-semibold text-text-primary mb-2">
                    {preference.title}
                  </h3>
                  <p className="text-text-secondary mb-3">
                    {preference.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {preference.benefits.map((benefit, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-gray-100 rounded-full text-xs font-medium text-text-secondary"
                      >
                        {benefit}
                      </span>
                    ))}
                  </div>
                </div>

                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  isSelected ? 'border-primary' : 'border-secondary'
                }`}>
                  {isSelected && (
                    <div className="w-3 h-3 bg-primary rounded-full"></div>
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {errors.companyPreference && (
        <p id="companyPreference-error" className="text-center text-sm text-red-500">
          {errors.companyPreference}
        </p>
      )}
    </div>
  );
};

export default CompanyPreferenceStep;