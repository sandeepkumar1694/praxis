import React from 'react';
import { OnboardingData, ValidationErrors } from '../../../types/onboarding';

interface AcademicsStepProps {
  data: Partial<OnboardingData>;
  errors: ValidationErrors;
  onChange: (field: keyof OnboardingData, value: string) => void;
}

const AcademicsStep: React.FC<AcademicsStepProps> = ({ data, errors, onChange }) => {
  const branches = [
    'Computer Science',
    'Information Technology',
    'Software Engineering',
    'Computer Engineering',
    'Electrical Engineering',
    'Electronics Engineering',
    'Mechanical Engineering',
    'Civil Engineering',
    'Mathematics',
    'Physics',
    'Other'
  ];

  const currentYear = new Date().getFullYear();
  const graduationYears = Array.from({ length: 10 }, (_, i) => currentYear - 5 + i);

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-poppins font-bold text-text-primary mb-2">
          Academic Background
        </h2>
        <p className="text-text-secondary">
          Tell us about your educational journey
        </p>
      </div>

      <div className="space-y-4">
        {/* University */}
        <div>
          <label htmlFor="university" className="block text-sm font-medium text-text-primary mb-2">
            University/College *
          </label>
          <input
            type="text"
            id="university"
            value={data.university || ''}
            onChange={(e) => onChange('university', e.target.value)}
            className={`w-full h-11 px-4 border rounded-md font-inter focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors duration-200 ${
              errors.university ? 'border-red-500' : 'border-secondary'
            }`}
            placeholder="Enter your university or college name"
            aria-describedby={errors.university ? 'university-error' : undefined}
          />
          {errors.university && (
            <p id="university-error" className="mt-1 text-sm text-red-500">
              {errors.university}
            </p>
          )}
        </div>

        {/* Degree */}
        <div>
          <label htmlFor="degree" className="block text-sm font-medium text-text-primary mb-2">
            Degree *
          </label>
          <input
            type="text"
            id="degree"
            value={data.degree || ''}
            onChange={(e) => onChange('degree', e.target.value)}
            className={`w-full h-11 px-4 border rounded-md font-inter focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors duration-200 ${
              errors.degree ? 'border-red-500' : 'border-secondary'
            }`}
            placeholder="e.g., Bachelor of Technology, Master of Science"
            aria-describedby={errors.degree ? 'degree-error' : undefined}
          />
          {errors.degree && (
            <p id="degree-error" className="mt-1 text-sm text-red-500">
              {errors.degree}
            </p>
          )}
        </div>

        {/* Branch and Graduation Year Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Branch */}
          <div>
            <label htmlFor="branch" className="block text-sm font-medium text-text-primary mb-2">
              Branch/Major *
            </label>
            <select
              id="branch"
              value={data.branch || ''}
              onChange={(e) => onChange('branch', e.target.value)}
              className={`w-full h-11 px-4 border rounded-md font-inter focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors duration-200 ${
                errors.branch ? 'border-red-500' : 'border-secondary'
              }`}
              aria-describedby={errors.branch ? 'branch-error' : undefined}
            >
              <option value="">Select branch</option>
              {branches.map((branch) => (
                <option key={branch} value={branch}>
                  {branch}
                </option>
              ))}
            </select>
            {errors.branch && (
              <p id="branch-error" className="mt-1 text-sm text-red-500">
                {errors.branch}
              </p>
            )}
          </div>

          {/* Graduation Year */}
          <div>
            <label htmlFor="graduationYear" className="block text-sm font-medium text-text-primary mb-2">
              Graduation Year *
            </label>
            <select
              id="graduationYear"
              value={data.graduationYear || ''}
              onChange={(e) => onChange('graduationYear', e.target.value)}
              className={`w-full h-11 px-4 border rounded-md font-inter focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors duration-200 ${
                errors.graduationYear ? 'border-red-500' : 'border-secondary'
              }`}
              aria-describedby={errors.graduationYear ? 'graduationYear-error' : undefined}
            >
              <option value="">Select year</option>
              {graduationYears.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
            {errors.graduationYear && (
              <p id="graduationYear-error" className="mt-1 text-sm text-red-500">
                {errors.graduationYear}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AcademicsStep;