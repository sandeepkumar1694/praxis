import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import OnboardingLayout from './OnboardingLayout';
import StepperComponent from './StepperComponent';
import ProfileStep from './steps/ProfileStep';
import AcademicsStep from './steps/AcademicsStep';
import SkillAssessmentStep from './steps/SkillAssessmentStep';
import RoleSelectionStep from './steps/RoleSelectionStep';
import CompanyPreferenceStep from './steps/CompanyPreferenceStep';
import MissionStatementStep from './steps/MissionStatementStep';
import CompletionStep from './steps/CompletionStep';
import { OnboardingData, ValidationErrors } from '../../types/onboarding';
import {
  validateProfileStep,
  validateAcademicsStep,
  validateSkillsStep,
  validateRoleStep,
  validateCompanyStep,
  validateMissionStep
} from '../../utils/onboardingValidation';

const OnboardingFlow: React.FC = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isAnimating, setIsAnimating] = useState(false);
  const [data, setData] = useState<Partial<OnboardingData>>({});
  const [errors, setErrors] = useState<ValidationErrors>({});

  const steps = [
    { component: ProfileStep, validate: validateProfileStep },
    { component: AcademicsStep, validate: validateAcademicsStep },
    { component: SkillAssessmentStep, validate: validateSkillsStep },
    { component: RoleSelectionStep, validate: validateRoleStep },
    { component: CompanyPreferenceStep, validate: validateCompanyStep },
    { component: MissionStatementStep, validate: validateMissionStep },
    { component: CompletionStep, validate: () => ({}) }
  ];

  // Load saved data from localStorage
  useEffect(() => {
    const savedData = localStorage.getItem('onboardingData');
    if (savedData) {
      try {
        setData(JSON.parse(savedData));
      } catch (error) {
        console.error('Failed to load onboarding data:', error);
      }
    }
  }, []);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    if (Object.keys(data).length > 0) {
      localStorage.setItem('onboardingData', JSON.stringify(data));
    }
  }, [data]);

  const handleDataChange = (field: keyof OnboardingData, value: string | string[] | boolean) => {
    setData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateCurrentStep = () => {
    const validator = steps[currentStep - 1].validate;
    const stepErrors = validator(data);
    setErrors(stepErrors);
    return Object.keys(stepErrors).length === 0;
  };

  const handleNext = () => {
    if (currentStep < 7 && validateCurrentStep()) {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentStep(prev => prev + 1);
        setIsAnimating(false);
      }, 150);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentStep(prev => prev - 1);
        setIsAnimating(false);
      }, 150);
    }
  };

  const handleComplete = () => {
    // Clear onboarding data from localStorage
    localStorage.removeItem('onboardingData');
    
    // Save completed onboarding data (you can send this to your API)
    console.log('Onboarding completed:', data);
    
    // Redirect to dashboard
    navigate('/dashboard');
  };

  const CurrentStepComponent = steps[currentStep - 1].component;

  return (
    <OnboardingLayout>
      <div className="bg-white rounded-2xl shadow-xl p-8 relative overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 pointer-events-none" />
        
        <div className="relative z-10">
          {/* Progress Stepper */}
          <StepperComponent currentStep={currentStep} totalSteps={6} />

          {/* Step Content */}
          <div className={`transition-all duration-300 ${isAnimating ? 'opacity-50 scale-95' : 'opacity-100 scale-100'}`}>
            {currentStep === 7 ? (
              <CompletionStep onComplete={handleComplete} />
            ) : (
              <CurrentStepComponent
                data={data}
                errors={errors}
                onChange={handleDataChange}
              />
            )}
          </div>

          {/* Navigation Buttons */}
          {currentStep < 7 && (
            <div className="flex justify-between items-center mt-12">
              <button
                onClick={handlePrevious}
                disabled={currentStep === 1}
                className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                  currentStep === 1
                    ? 'text-gray-400 cursor-not-allowed'
                    : 'text-text-secondary hover:text-primary hover:bg-primary/5'
                }`}
                aria-label="Previous step"
              >
                <ChevronLeft size={20} />
                <span>Previous</span>
              </button>

              <div className="text-sm text-text-secondary">
                Step {currentStep} of 6
              </div>

              {currentStep === 6 ? (
                <button
                  onClick={handleNext}
                  disabled={!data.termsAgreed}
                  className="flex items-center space-x-2 px-8 py-3 bg-primary text-white rounded-lg font-medium hover:bg-blue-600 transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                  aria-label="Enter The Crucible"
                >
                  <span>Enter The Crucible</span>
                  <ChevronRight size={20} />
                </button>
              ) : (
                <button
                  onClick={handleNext}
                  className="flex items-center space-x-2 px-8 py-3 bg-primary text-white rounded-lg font-medium hover:bg-blue-600 transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:ring-offset-2"
                  aria-label="Next step"
                >
                  <span>Next</span>
                  <ChevronRight size={20} />
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </OnboardingLayout>
  );
};

export default OnboardingFlow;