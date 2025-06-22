import React from 'react';
import { OnboardingData, ValidationErrors } from '../../../types/onboarding';

interface ProfileStepProps {
  data: Partial<OnboardingData>;
  errors: ValidationErrors;
  onChange: (field: keyof OnboardingData, value: string) => void;
}

const ProfileStep: React.FC<ProfileStepProps> = ({ data, errors, onChange }) => {
  const ageOptions = Array.from({ length: 43 }, (_, i) => i + 18);
  const genderOptions = ['Male', 'Female', 'Non-binary', 'Prefer not to say'];

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-poppins font-bold text-text-primary mb-2">
          Tell us about yourself
        </h2>
        <p className="text-text-secondary">
          Help us personalize your experience on Praxis
        </p>
      </div>

      <div className="space-y-4">
        {/* Full Name */}
        <div>
          <label htmlFor="fullName" className="block text-sm font-medium text-text-primary mb-2">
            Full Name *
          </label>
          <input
            type="text"
            id="fullName"
            value={data.fullName || ''}
            onChange={(e) => onChange('fullName', e.target.value)}
            className={`w-full h-11 px-4 border rounded-md font-inter focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors duration-200 ${
              errors.fullName ? 'border-red-500' : 'border-secondary'
            }`}
            placeholder="Enter your full name"
            aria-describedby={errors.fullName ? 'fullName-error' : undefined}
          />
          {errors.fullName && (
            <p id="fullName-error" className="mt-1 text-sm text-red-500">
              {errors.fullName}
            </p>
          )}
        </div>

        {/* Age and Gender Row */}
        <div className="grid grid-cols-2 gap-4">
          {/* Age */}
          <div>
            <label htmlFor="age" className="block text-sm font-medium text-text-primary mb-2">
              Age *
            </label>
            <select
              id="age"
              value={data.age || ''}
              onChange={(e) => onChange('age', e.target.value)}
              className={`w-full h-11 px-4 border rounded-md font-inter focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors duration-200 ${
                errors.age ? 'border-red-500' : 'border-secondary'
              }`}
              aria-describedby={errors.age ? 'age-error' : undefined}
            >
              <option value="">Select age</option>
              {ageOptions.map((age) => (
                <option key={age} value={age}>
                  {age}
                </option>
              ))}
            </select>
            {errors.age && (
              <p id="age-error" className="mt-1 text-sm text-red-500">
                {errors.age}
              </p>
            )}
          </div>

          {/* Gender */}
          <div>
            <label htmlFor="gender" className="block text-sm font-medium text-text-primary mb-2">
              Gender *
            </label>
            <select
              id="gender"
              value={data.gender || ''}
              onChange={(e) => onChange('gender', e.target.value)}
              className={`w-full h-11 px-4 border rounded-md font-inter focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors duration-200 ${
                errors.gender ? 'border-red-500' : 'border-secondary'
              }`}
              aria-describedby={errors.gender ? 'gender-error' : undefined}
            >
              <option value="">Select gender</option>
              {genderOptions.map((gender) => (
                <option key={gender} value={gender}>
                  {gender}
                </option>
              ))}
            </select>
            {errors.gender && (
              <p id="gender-error" className="mt-1 text-sm text-red-500">
                {errors.gender}
              </p>
            )}
          </div>
        </div>

        {/* GitHub URL */}
        <div>
          <label htmlFor="githubUrl" className="block text-sm font-medium text-text-primary mb-2">
            GitHub Profile URL *
          </label>
          <input
            type="url"
            id="githubUrl"
            value={data.githubUrl || ''}
            onChange={(e) => onChange('githubUrl', e.target.value)}
            className={`w-full h-11 px-4 border rounded-md font-inter focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors duration-200 ${
              errors.githubUrl ? 'border-red-500' : 'border-secondary'
            }`}
            placeholder="https://github.com/yourusername"
            aria-describedby={errors.githubUrl ? 'githubUrl-error' : undefined}
          />
          {errors.githubUrl && (
            <p id="githubUrl-error" className="mt-1 text-sm text-red-500">
              {errors.githubUrl}
            </p>
          )}
        </div>

        {/* LinkedIn URL */}
        <div>
          <label htmlFor="linkedinUrl" className="block text-sm font-medium text-text-primary mb-2">
            LinkedIn Profile URL
          </label>
          <input
            type="url"
            id="linkedinUrl"
            value={data.linkedinUrl || ''}
            onChange={(e) => onChange('linkedinUrl', e.target.value)}
            className={`w-full h-11 px-4 border rounded-md font-inter focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors duration-200 ${
              errors.linkedinUrl ? 'border-red-500' : 'border-secondary'
            }`}
            placeholder="https://linkedin.com/in/yourusername (optional)"
            aria-describedby={errors.linkedinUrl ? 'linkedinUrl-error' : undefined}
          />
          {errors.linkedinUrl && (
            <p id="linkedinUrl-error" className="mt-1 text-sm text-red-500">
              {errors.linkedinUrl}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileStep;