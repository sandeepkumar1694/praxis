import React from 'react';
import { Code, Database, Globe, Cpu, Brain, BarChart3, Server } from 'lucide-react';
import { OnboardingData, ValidationErrors } from '../../../types/onboarding';

interface RoleSelectionStepProps {
  data: Partial<OnboardingData>;
  errors: ValidationErrors;
  onChange: (field: keyof OnboardingData, value: string) => void;
}

const RoleSelectionStep: React.FC<RoleSelectionStepProps> = ({ data, errors, onChange }) => {
  const roles = [
    {
      id: 'frontend',
      title: 'Frontend Developer',
      description: 'Build user interfaces and experiences',
      icon: Globe,
      color: 'from-blue-500 to-cyan-500'
    },
    {
      id: 'backend',
      title: 'Backend Developer',
      description: 'Develop server-side logic and APIs',
      icon: Server,
      color: 'from-green-500 to-emerald-500'
    },
    {
      id: 'fullstack',
      title: 'Full Stack Developer',
      description: 'Work across frontend and backend',
      icon: Code,
      color: 'from-purple-500 to-violet-500'
    },
    {
      id: 'software-engineer',
      title: 'Software Engineer',
      description: 'Design and develop software systems',
      icon: Cpu,
      color: 'from-orange-500 to-red-500'
    },
    {
      id: 'ml-engineer',
      title: 'ML Engineer',
      description: 'Build machine learning systems',
      icon: Brain,
      color: 'from-pink-500 to-rose-500'
    },
    {
      id: 'data-scientist',
      title: 'Data Scientist',
      description: 'Extract insights from data',
      icon: BarChart3,
      color: 'from-indigo-500 to-blue-500'
    },
    {
      id: 'devops',
      title: 'DevOps Engineer',
      description: 'Manage infrastructure and deployments',
      icon: Database,
      color: 'from-yellow-500 to-orange-500'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-poppins font-bold text-text-primary mb-2">
          What's your role?
        </h2>
        <p className="text-text-secondary">
          Select the role that best describes your career focus
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {roles.map((role) => {
          const Icon = role.icon;
          const isSelected = data.role === role.id;
          
          return (
            <button
              key={role.id}
              onClick={() => onChange('role', role.id)}
              className={`p-6 rounded-xl border-2 text-left transition-all duration-200 hover:scale-105 hover:shadow-lg ${
                isSelected
                  ? 'border-primary bg-primary/5 shadow-lg'
                  : 'border-secondary bg-white hover:border-primary/50'
              }`}
              aria-pressed={isSelected}
              aria-describedby={errors.role ? 'role-error' : undefined}
            >
              <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${role.color} flex items-center justify-center mb-4`}>
                <Icon size={24} className="text-white" />
              </div>
              <h3 className="font-poppins font-semibold text-text-primary mb-2">
                {role.title}
              </h3>
              <p className="text-text-secondary text-sm">
                {role.description}
              </p>
            </button>
          );
        })}
      </div>

      {errors.role && (
        <p id="role-error" className="text-center text-sm text-red-500">
          {errors.role}
        </p>
      )}
    </div>
  );
};

export default RoleSelectionStep;