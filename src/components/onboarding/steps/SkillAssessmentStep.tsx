import React from 'react';
import { Code, Database, Globe } from 'lucide-react';
import { OnboardingData, ValidationErrors } from '../../../types/onboarding';

interface SkillAssessmentStepProps {
  data: Partial<OnboardingData>;
  errors: ValidationErrors;
  onChange: (field: keyof OnboardingData, value: string[]) => void;
}

const SkillAssessmentStep: React.FC<SkillAssessmentStepProps> = ({ data, errors, onChange }) => {
  const skillCategories = [
    {
      icon: Code,
      title: 'Languages',
      color: 'from-blue-500 to-cyan-500',
      skills: ['Python', 'JavaScript', 'TypeScript', 'Java', 'Go', 'C++', 'Rust']
    },
    {
      icon: Globe,
      title: 'Frameworks',
      color: 'from-green-500 to-emerald-500',
      skills: ['React', 'Node.js', 'Vue', 'Django', 'Flask', 'Spring Boot', 'ASP.NET']
    },
    {
      icon: Database,
      title: 'Databases',
      color: 'from-purple-500 to-violet-500',
      skills: ['PostgreSQL', 'MySQL', 'MongoDB', 'Redis']
    }
  ];

  const selectedSkills = data.selectedSkills || [];

  const handleSkillToggle = (skill: string) => {
    const updatedSkills = selectedSkills.includes(skill)
      ? selectedSkills.filter(s => s !== skill)
      : [...selectedSkills, skill];
    
    onChange('selectedSkills', updatedSkills);
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-poppins font-bold text-text-primary mb-2">
          Define Your Tech Stack
        </h2>
        <p className="text-text-secondary">
          Select your strongest skills. This helps us tailor your first set of tasks.
        </p>
      </div>

      <div className="space-y-8">
        {skillCategories.map((category, categoryIndex) => {
          const Icon = category.icon;
          
          return (
            <div key={categoryIndex} className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className={`w-10 h-10 rounded-lg bg-gradient-to-r ${category.color} flex items-center justify-center`}>
                  <Icon size={20} className="text-white" />
                </div>
                <h3 className="text-lg font-poppins font-semibold text-text-primary">
                  {category.title}
                </h3>
              </div>
              
              <div className="flex flex-wrap gap-3">
                {category.skills.map((skill, skillIndex) => {
                  const isSelected = selectedSkills.includes(skill);
                  
                  return (
                    <button
                      key={skillIndex}
                      onClick={() => handleSkillToggle(skill)}
                      className={`px-4 py-2 rounded-full border-2 font-medium text-sm transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:ring-offset-2 ${
                        isSelected
                          ? 'bg-primary border-primary text-white shadow-lg'
                          : 'bg-white border-secondary text-text-secondary hover:border-primary/50 hover:text-primary'
                      }`}
                      aria-pressed={isSelected}
                      aria-describedby={errors.selectedSkills ? 'skills-error' : undefined}
                    >
                      {skill}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Skills Counter */}
      <div className="text-center">
        <p className="text-sm text-text-secondary">
          {selectedSkills.length} skill{selectedSkills.length !== 1 ? 's' : ''} selected
          {selectedSkills.length >= 3 ? ' ✓' : ' (minimum 3 recommended)'}
        </p>
      </div>

      {errors.selectedSkills && (
        <p id="skills-error" className="text-center text-sm text-red-500">
          {errors.selectedSkills}
        </p>
      )}
    </div>
  );
};

export default SkillAssessmentStep;