import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, Code, Zap, Target, ChevronRight, Calendar } from 'lucide-react';
import { DailyTask, UserSubmission } from '../../types/tasks';
import { useAuth } from '../../contexts/AuthContext';
import { useNotification } from '../../contexts/NotificationContext';
import LoadingSpinner from '../ui/LoadingSpinner';

const DailyTasksList: React.FC = () => {
  const { user } = useAuth();
  const { showSuccess, showError } = useNotification();
  const navigate = useNavigate();
  const [tasks, setTasks] = useState<DailyTask[]>([]);
  const [userSubmission, setUserSubmission] = useState<UserSubmission | null>(null);
  const [loading, setLoading] = useState(true);
  const [choosingTask, setChoosingTask] = useState<string | null>(null);

  // Mock data - replace with actual API calls
  const mockTasks: DailyTask[] = [
    {
      id: '1',
      level: 'basic',
      title: 'Array Sum Calculator',
      description: 'Create a function that takes an array of numbers and returns their sum. Handle edge cases like empty arrays and non-numeric values.',
      timeLimit: 30,
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: '2',
      level: 'intermediate',
      title: 'API Rate Limiter',
      description: 'Implement a rate limiter that allows a maximum of N requests per time window. Include proper error handling and cleanup mechanisms.',
      timeLimit: 60,
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: '3',
      level: 'pro',
      title: 'Distributed Cache System',
      description: 'Design and implement a distributed cache system with consistent hashing, replication, and failure recovery mechanisms.',
      timeLimit: 120,
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    },
  ];

  useEffect(() => {
    fetchDailyTasks();
  }, []);

  const fetchDailyTasks = async () => {
    try {
      setLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock: Check if user has already chosen a task today
      const existingSubmission = localStorage.getItem(`task_submission_${user?.id}_${new Date().toDateString()}`);
      if (existingSubmission) {
        setUserSubmission(JSON.parse(existingSubmission));
      }
      
      setTasks(mockTasks);
    } catch (error) {
      showError('Failed to load daily tasks');
    } finally {
      setLoading(false);
    }
  };

  const handleChooseTask = async (taskId: string) => {
    if (userSubmission) return;
    
    try {
      setChoosingTask(taskId);
      
      // Simulate API call to choose task
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const newSubmission: UserSubmission = {
        id: `submission_${Date.now()}`,
        userId: user!.id,
        taskId,
        chosenAt: new Date().toISOString(),
        status: 'chosen',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      // Mock: Store in localStorage
      localStorage.setItem(
        `task_submission_${user?.id}_${new Date().toDateString()}`, 
        JSON.stringify(newSubmission)
      );
      
      setUserSubmission(newSubmission);
      showSuccess('Task selected! You can now start working on it.');
      
      // Navigate to task completion
      navigate(`/tasks/complete/${taskId}`);
    } catch (error) {
      showError('Failed to select task');
    } finally {
      setChoosingTask(null);
    }
  };

  const getLevelIcon = (level: DailyTask['level']) => {
    switch (level) {
      case 'basic':
        return Code;
      case 'intermediate':
        return Target;
      case 'pro':
        return Zap;
    }
  };

  const getLevelColor = (level: DailyTask['level']) => {
    switch (level) {
      case 'basic':
        return 'from-green-500 to-emerald-500';
      case 'intermediate':
        return 'from-blue-500 to-cyan-500';
      case 'pro':
        return 'from-purple-500 to-violet-500';
    }
  };

  const getLevelBadgeColor = (level: DailyTask['level']) => {
    switch (level) {
      case 'basic':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'intermediate':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'pro':
        return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-dashboard-bg">
        <div className="container mx-auto px-6 py-8 max-w-4xl">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <LoadingSpinner size="lg" color="text-primary" />
              <p className="mt-4 text-white/60">Loading today's challenges...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dashboard-bg">
      <div className="container mx-auto px-6 py-8 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-primary to-accent rounded-xl flex items-center justify-center">
              <Calendar size={24} className="text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-poppins font-bold text-white">
                Today's Challenges
              </h1>
              <p className="text-white/60">
                Choose one challenge to test your skills
              </p>
            </div>
          </div>
          
          {userSubmission && (
            <div className="bg-accent/20 border border-accent/30 rounded-lg p-4">
              <p className="text-accent font-medium">
                You've already selected a task for today! 
                {userSubmission.status === 'chosen' && (
                  <button 
                    onClick={() => navigate(`/tasks/complete/${userSubmission.taskId}`)}
                    className="ml-2 underline hover:no-underline"
                  >
                    Continue working on it
                  </button>
                )}
                {userSubmission.status === 'scored' && (
                  <button 
                    onClick={() => navigate(`/tasks/result/${userSubmission.id}`)}
                    className="ml-2 underline hover:no-underline"
                  >
                    View your results
                  </button>
                )}
              </p>
            </div>
          )}
        </div>

        {/* Tasks Grid */}
        <div className="space-y-6">
          {tasks.map((task) => {
            const LevelIcon = getLevelIcon(task.level);
            const isChosen = userSubmission?.taskId === task.id;
            const isDisabled = userSubmission && !isChosen;
            const isChoosing = choosingTask === task.id;
            
            return (
              <div
                key={task.id}
                className={`bg-dashboard-card rounded-2xl p-6 border transition-all duration-300 ${
                  isChosen 
                    ? 'border-accent/50 bg-accent/5' 
                    : isDisabled 
                    ? 'border-white/10 opacity-50' 
                    : 'border-white/10 hover:border-white/20 hover:transform hover:-translate-y-1'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-4 mb-4">
                      <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${getLevelColor(task.level)} flex items-center justify-center`}>
                        <LevelIcon size={24} className="text-white" />
                      </div>
                      <div>
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-xl font-poppins font-bold text-white">
                            {task.title}
                          </h3>
                          <span className={`px-3 py-1 text-xs font-medium rounded-full border ${getLevelBadgeColor(task.level)}`}>
                            {task.level.toUpperCase()}
                          </span>
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-white/60">
                          <div className="flex items-center space-x-1">
                            <Clock size={14} />
                            <span>{task.timeLimit} minutes</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <p className="text-white/80 mb-6 leading-relaxed">
                      {task.description}
                    </p>
                  </div>
                  
                  <div className="ml-6">
                    {isChosen ? (
                      <div className="text-center">
                        <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center mb-2">
                          <Target size={24} className="text-accent" />
                        </div>
                        <p className="text-accent text-sm font-medium">Selected</p>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleChooseTask(task.id)}
                        disabled={isDisabled || isChoosing}
                        className={`group px-6 py-3 rounded-lg font-medium transition-all duration-200 flex items-center space-x-2 ${
                          isDisabled 
                            ? 'bg-gray-600 text-gray-400 cursor-not-allowed' 
                            : 'bg-primary text-white hover:bg-blue-600 hover:scale-105'
                        }`}
                      >
                        {isChoosing ? (
                          <>
                            <LoadingSpinner size="sm" color="text-white" />
                            <span>Selecting...</span>
                          </>
                        ) : (
                          <>
                            <span>Choose Task</span>
                            <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform duration-200" />
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Info Section */}
        <div className="mt-8 bg-white/5 rounded-xl p-6 border border-white/10">
          <h3 className="text-lg font-semibold text-white mb-3">How it works</h3>
          <div className="grid md:grid-cols-3 gap-4 text-sm text-white/80">
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-primary text-xs font-bold">1</span>
              </div>
              <p>Choose one challenge that matches your skill level</p>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-primary text-xs font-bold">2</span>
              </div>
              <p>Complete the task within the time limit</p>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-primary text-xs font-bold">3</span>
              </div>
              <p>Get detailed AI feedback and scoring</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DailyTasksList;