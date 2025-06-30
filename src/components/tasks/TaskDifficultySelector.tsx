import React, { useState } from 'react';
import { Star, Zap, Target } from 'lucide-react';

interface DifficultyOption {
  id: string;
  label: string;
  distribution: { basic: number; intermediate: number; pro: number };
  description: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  color: string;
}

interface TaskDifficultySelectorProps {
  onSelect: (option: DifficultyOption) => void;
  selectedOption?: DifficultyOption;
}

const TaskDifficultySelector: React.FC<TaskDifficultySelectorProps> = ({ onSelect, selectedOption }) => {
  const difficultyOptions: DifficultyOption[] = [
    {
      id: 'easy-focus',
      label: '3 Easy Tasks',
      distribution: { basic: 3, intermediate: 0, pro: 0 },
      description: 'Perfect for warming up or building confidence',
      icon: Star,
      color: 'from-green-500 to-emerald-500'
    },
    {
      id: 'mixed-easy',
      label: '2 Easy + 1 Medium',
      distribution: { basic: 2, intermediate: 1, pro: 0 },
      description: 'Gradual challenge progression',
      icon: Target,
      color: 'from-blue-500 to-cyan-500'
    },
    {
      id: 'balanced',
      label: '1 Easy + 1 Medium + 1 Hard',
      distribution: { basic: 1, intermediate: 1, pro: 1 },
      description: 'Balanced skill assessment',
      icon: Zap,
      color: 'from-purple-500 to-violet-500'
    },
    {
      id: 'medium-focus',
      label: '3 Medium Tasks',
      distribution: { basic: 0, intermediate: 3, pro: 0 },
      description: 'Solid intermediate challenge',
      icon: Target,
      color: 'from-yellow-500 to-orange-500'
    },
    {
      id: 'mixed-hard',
      label: '2 Medium + 1 Hard',
      distribution: { basic: 0, intermediate: 2, pro: 1 },
      description: 'Advanced skill testing',
      icon: Zap,
      color: 'from-red-500 to-pink-500'
    },
    {
      id: 'pro-focus',
      label: '3 Hard Tasks',
      distribution: { basic: 0, intermediate: 0, pro: 3 },
      description: 'Expert level challenges',
      icon: Zap,
      color: 'from-indigo-500 to-purple-500'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-poppins font-bold text-white mb-2">
          Choose Your Challenge Level
        </h2>
        <p className="text-white/60">
          Select the difficulty distribution that matches your current skill level and goals
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {difficultyOptions.map((option) => {
          const Icon = option.icon;
          const isSelected = selectedOption?.id === option.id;
          
          return (
            <button
              key={option.id}
              onClick={() => onSelect(option)}
              className={`p-6 rounded-xl border-2 text-left transition-all duration-300 hover:scale-105 hover:shadow-lg ${
                isSelected
                  ? 'border-primary bg-primary/5 shadow-lg'
                  : 'border-white/10 bg-white/5 hover:border-primary/50'
              }`}
            >
              <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${option.color} flex items-center justify-center mb-4`}>
                <Icon size={24} className="text-white" />
              </div>
              
              <h3 className="font-poppins font-semibold text-white mb-2">
                {option.label}
              </h3>
              
              <p className="text-white/60 text-sm mb-4">
                {option.description}
              </p>
              
              <div className="flex items-center space-x-2">
                {option.distribution.basic > 0 && (
                  <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded-full">
                    {option.distribution.basic} Easy
                  </span>
                )}
                {option.distribution.intermediate > 0 && (
                  <span className="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs rounded-full">
                    {option.distribution.intermediate} Medium
                  </span>
                )}
                {option.distribution.pro > 0 && (
                  <span className="px-2 py-1 bg-purple-500/20 text-purple-400 text-xs rounded-full">
                    {option.distribution.pro} Hard
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>
      
      {selectedOption && (
        <div className="bg-primary/10 border border-primary/20 rounded-xl p-6 text-center">
          <h3 className="text-lg font-semibold text-white mb-2">
            Selected: {selectedOption.label}
          </h3>
          <p className="text-white/80">
            Your tasks will be generated with this difficulty distribution
          </p>
        </div>
      )}
    </div>
  );
};

export default TaskDifficultySelector;