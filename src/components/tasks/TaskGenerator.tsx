import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Zap, ArrowRight } from 'lucide-react';
import TaskDifficultySelector from './TaskDifficultySelector';
import { useAuth } from '../../contexts/AuthContext';
import { useNotification } from '../../contexts/NotificationContext';
import { taskAPI } from '../../lib/api';
import LoadingSpinner from '../ui/LoadingSpinner';
import AuthenticatedLayout from '../layout/AuthenticatedLayout';

interface DifficultyOption {
  id: string;
  label: string;
  distribution: { basic: number; intermediate: number; pro: number };
  description: string;
}

const TaskGenerator: React.FC = () => {
  const { user } = useAuth();
  const { showSuccess, showError } = useNotification();
  const navigate = useNavigate();
  const [selectedDifficulty, setSelectedDifficulty] = useState<DifficultyOption | undefined>();
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateTasks = async () => {
    if (!selectedDifficulty) {
      showError('Please select a difficulty level first');
      return;
    }

    try {
      setIsGenerating(true);
      
      // Call the enhanced task generation API with difficulty preferences
      await taskAPI.generateDailyTasksWithDifficulty(selectedDifficulty.distribution);
      
      showSuccess('Tasks generated successfully!');
      navigate('/tasks');
    } catch (error) {
      showError(error instanceof Error ? error.message : 'Failed to generate tasks');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <AuthenticatedLayout>
      <div className="container mx-auto px-6 py-8 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-primary to-accent rounded-xl flex items-center justify-center mx-auto mb-4">
            <Zap size={32} className="text-white" />
          </div>
          <h1 className="text-3xl font-poppins font-bold text-white mb-2">
            Generate Daily Tasks
          </h1>
          <p className="text-white/60">
            Customize your coding challenges based on your skill level and goals
          </p>
        </div>

        {/* Difficulty Selector */}
        <div className="mb-8">
          <TaskDifficultySelector 
            onSelect={setSelectedDifficulty}
            selectedOption={selectedDifficulty}
          />
        </div>

        {/* Generate Button */}
        <div className="text-center">
          <button
            onClick={handleGenerateTasks}
            disabled={!selectedDifficulty || isGenerating}
            className="group px-8 py-4 bg-primary text-white rounded-lg font-semibold text-lg hover:bg-blue-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 flex items-center space-x-2 mx-auto"
          >
            {isGenerating ? (
              <>
                <LoadingSpinner size="sm" color="text-white" />
                <span>Generating Tasks...</span>
              </>
            ) : (
              <>
                <span>Generate My Tasks</span>
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform duration-300" />
              </>
            )}
          </button>
          
          {selectedDifficulty && (
            <p className="mt-4 text-white/60 text-sm">
              This will generate {selectedDifficulty.distribution.basic + selectedDifficulty.distribution.intermediate + selectedDifficulty.distribution.pro} tasks 
              with your selected difficulty distribution
            </p>
          )}
        </div>
      </div>
    </AuthenticatedLayout>
  );
};

export default TaskGenerator;